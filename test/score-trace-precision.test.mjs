import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const publication = JSON.parse(readFileSync(new URL('../src/data/publishedRankingData.json', import.meta.url)));
const source = readFileSync(new URL('../src/ScoreTraceEquation.tsx', import.meta.url), 'utf8');

async function component(text, run) {
  const root = await mkdtemp(join(tmpdir(), 'slic-trace-render-'));
  try {
    await symlink(fileURLToPath(new URL('../node_modules', import.meta.url)), join(root, 'node_modules'), 'dir');
    const code = ts.transpileModule(text, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const path = join(root, 'trace.mjs');
    await writeFile(path, code);
    await run((await import(pathToFileURL(path).href)).default);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const text = html => html.replace(/<[^>]*>/g, '').trim();
function number(html, className) {
  const match = html.match(new RegExp(`<span class="[^"]*${className}"[^>]*>([^<]*)</span>`));
  assert.ok(match, `missing rendered ${className}`);
  return Number(match[1]);
}
function props(city) {
  return {
    pillars: Object.entries(publication.canonicalWeights).map(([id, weight]) => ({
      id, weight, score: city[`${id}Score`], color: '#000', label: id,
    })),
    mean: city.weightedMeanExact, ampi: city.ampiExact, penalty: city.coveragePenalty,
    published: city.slicScore, labels: { mean: 'Observed mean', imbalance: 'imbalance', coverage: 'coverage' },
  };
}
function check(city, Trace) {
  const html = renderToStaticMarkup(createElement(Trace, props(city)));
  const observed = props(city).pillars.filter(p => p.score != null);
  const weight = observed.reduce((sum, p) => sum + p.weight, 0) / 100;
  const terms = [...html.matchAll(/class="scorecard-equation-term">(.*?)<\/span><\/span>/g)];
  assert.equal(terms.length, observed.length, city.cityId);
  const denominator = weight < 1 ? number(html, 'scorecard-equation-denominator') : 1;
  assert.equal(denominator, weight, city.cityId);
  const renderedTerms = terms.map((match, i) => {
    const weight = Number(match[1].match(/class="scorecard-equation-weight">([^<]*)/)?.[1]);
    const value = Number(match[1].match(/class="scorecard-equation-pillar"[^>]*>[^<]*\(([\d.]+)\)/)?.[1]);
    assert.equal(weight, observed[i].weight / 100, `${city.cityId}: rendered weight`);
    assert.equal(value, Number(observed[i].score.toFixed(1)), `${city.cityId}: rendered pillar`);
    return { weight, value };
  });
  const sum = renderedTerms.reduce((sum, p) => sum + p.weight * p.value, 0) / denominator;
  const mean = number(html, 'scorecard-equation-result--mean');
  assert.ok(Math.abs(sum - mean) <= 0.06, `${city.cityId}: mean`);
  const deductions = [...html.matchAll(/class="scorecard-equation-deduction">(.*?)<\/span>([^<]*)<\/span>/g)]
    .reduce((sum, match) => sum + Number(match[2]), 0);
  let end = mean - deductions;
  if (city.ampiExact - (city.coveragePenalty ?? 0) < 0) {
    assert.match(html, /class="scorecard-equation-floor">max\(0, -/);
    end = Math.max(0, end);
  }
  assert.ok(Math.abs(end - number(html, 'scorecard-equation-result--published')) <= 0.06,
    `${city.cityId}: deductions and floor: ${text(html)}`);
  assert.equal(number(html, 'scorecard-equation-result--published'), city.slicScore, city.cityId);
}

test('rendered traces preserve 0.06 tolerance, including missing pillars and the zero floor', async () => {
  const bangkok = publication.cities.find(city => city.cityId === 'th-bangkok');
  await component(source, Trace => { for (const city of publication.cities) check(city, Trace); });
  await component(source.replace('mean.toFixed(2)', 'mean.toFixed(1)'), Trace => {
    assert.throws(() => check(bangkok, Trace), /mean/);
  });
  await component(source.replace('{floor && (', '{false && floor && ('), Trace => {
    assert.throws(() => check(publication.cities.find(city => city.cityId === 'eg-alexandria'), Trace), /floor/);
  });
  await component(source.replace('{renormalized && (', '{false && renormalized && ('), Trace => {
    assert.throws(() => check(publication.cities.find(city => city.cityId === 'tw-taichung'), Trace), /denominator/);
  });
  await component(source.replace('p.score?.toFixed(1)', '(0).toFixed(1)'), Trace => {
    assert.throws(() => check(bangkok, Trace), /rendered pillar/);
  });
  await component(source, Trace => {
    const input = props(bangkok);
    const html = renderToStaticMarkup(createElement(Trace, { ...input, mean: undefined, ampi: undefined }));
    assert.equal(number(html, 'scorecard-equation-result--published'), bangkok.slicScore);
    assert.doesNotMatch(html, /result--mean/);
  });
});
