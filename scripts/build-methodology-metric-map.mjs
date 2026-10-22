#!/usr/bin/env node
/**
 * Build scripts/methodology-metric-map.json.
 *
 * The number gate must know which metric each localised name refers to, or
 * a page can list the wrong metric at the right weight and pass. This map
 * is that knowledge, pinned to the bundle's metric keys.
 *
 * It is GENERATED from the pages themselves, and the gate checks it in both
 * directions: every name on a page must appear in the map, and every name in
 * the map must appear on its page. A renamed metric therefore fails the
 * gate until the map is regenerated — the map cannot drift silently.
 *
 *   node scripts/build-methodology-metric-map.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundle = JSON.parse(fs.readFileSync(path.join(REPO, "src/data/publishedRankingData.json"), "utf8"));
const PILLARS = Object.keys(bundle.pillarMetrics ?? {});

const PILLAR_RE = /id: "(pressure|viability|capability|community|creative)"/g;

function extractBlocks(source) {
  const blocks = [];
  PILLAR_RE.lastIndex = 0;
  let m;
  while ((m = PILLAR_RE.exec(source)) !== null) {
    const window = source.slice(m.index, m.index + 12000);
    const arrayMatch = window.match(/metrics: \[\n([\s\S]*?)\n\s*\],/);
    if (!arrayMatch) continue;
    const metrics = [];
    const entryRe = /\{ name: "(.*?)", weight: (\d+)[^\n]*?inputs: (\[[^\]]*\])/g;
    let e;
    while ((e = entryRe.exec(arrayMatch[1])) !== null) {
      metrics.push({
        name: e[1],
        weight: Number(e[2]),
        inputs: e[3].replace(/[\[\]"\s]/g, "").split(",").filter(Boolean).map((t) => t.toLowerCase()),
      });
    }
    blocks.push({ pillar: m[1], metrics });
  }
  return blocks;
}

const scored = (pillar) =>
  (bundle.pillarMetrics?.[pillar] ?? []).filter((m) => m.scored && !m.diagnostic).map((m) => m.key);

const enSource = fs.readFileSync(path.join(REPO, "src/methodologyData.ts"), "utf8");
const enBlocks = extractBlocks(enSource);
const first = new Map();
const second = new Map();
const seen = new Map();
for (const block of enBlocks) {
  const n = (seen.get(block.pillar) ?? 0) + 1;
  seen.set(block.pillar, n);
  if (n === 1) first.set(block.pillar, block.metrics);
  if (n === 2) second.set(block.pillar, block.metrics);
}

/** Canonical fingerprints from the English page (which follows the bundle's order). */
const canonicalInputs = new Map();
for (const pillar of PILLARS) {
  const page = first.get(pillar) ?? [];
  scored(pillar).forEach((key, index) => {
    canonicalInputs.set(key, { pillar, inputs: page[index]?.inputs ?? [] });
  });
}

function resolveByInputs(metric, pillar, used) {
  let best = null;
  let bestScore = 0;
  let ties = 0;
  for (const [key, meta] of canonicalInputs) {
    if (meta.pillar !== pillar || used.has(key)) continue;
    const shared = metric.inputs.filter((t) => meta.inputs.includes(t)).length;
    if (shared > bestScore) {
      best = key;
      bestScore = shared;
      ties = 1;
    } else if (shared === bestScore && shared > 0) {
      ties++;
    }
  }
  return best && bestScore > 0 && ties === 1 ? best : null;
}

const map = {};

/** English: positional, because the English page follows the bundle's order. */
map.en = {};
for (const pillar of PILLARS) {
  const page = first.get(pillar) ?? [];
  map.en[pillar] = page.map((metric, index) => ({ name: metric.name, key: scored(pillar)[index] }));
}

/** Thai and Chinese: matched by inputs first, then by elimination. */
for (const [locale, index] of [["th", 1], ["zh", 2]]) {
  // The file holds one locale object at a time, each with the five pillars
  // in order, so a block's locale is its index divided by the pillar count.
  const blocks = extractBlocks(enSource).filter((_, i) => Math.floor(i / PILLARS.length) === index);
  map[locale] = {};
  for (const block of blocks) {
    const keys = scored(block.pillar);
    const used = new Set();
    const rows = block.metrics.map((metric) => ({ name: metric.name, key: null }));

    // Pass one: every metric whose inputs identify it.
    block.metrics.forEach((metric, i) => {
      const key = resolveByInputs(metric, block.pillar, used);
      if (!key) return;
      rows[i].key = key;
      used.add(key);
    });

    // Pass two: a metric that matches nothing by inputs is still pinned if
    // it is the only bundle metric left in that pillar.
    const unmatched = rows.filter((r) => !r.key);
    const remaining = keys.filter((k) => !used.has(k));
    if (unmatched.length === 1 && remaining.length === 1) {
      unmatched[0].key = remaining[0];
    } else if (unmatched.length > 0) {
      // More than one name is unidentified: fall back to the page order
      // only where the already-identified names agree with the bundle order.
      const orderHolds = rows.every((r, i) => !r.key || r.key === keys[i]);
      if (orderHolds) {
        rows.forEach((r, i) => {
          if (!r.key) r.key = keys[i];
        });
      }
    }
    map[locale][block.pillar] = rows;
  }
}

/** Korean and Japanese: they list the same order as the Thai page. */
for (const [locale, file] of [["ko", "src/methodologyDataKo.ts"], ["ja", "src/methodologyDataJa.ts"]]) {
  const blocks = extractBlocks(fs.readFileSync(path.join(REPO, file), "utf8"));
  map[locale] = {};
  for (const block of blocks) {
    const thMetrics = second.get(block.pillar) ?? [];
    const thMap = map.th[block.pillar] ?? [];
    map[locale][block.pillar] = block.metrics.map((metric, i) => ({
      name: metric.name,
      key: thMap[i]?.key ?? null,
    }));
  }
}

const out = path.join(REPO, "scripts/methodology-metric-map.json");
fs.writeFileSync(out, JSON.stringify(map, null, 2) + "\n");
const unresolved = Object.entries(map).flatMap(([locale, pillars]) =>
  Object.entries(pillars).flatMap(([pillar, rows]) =>
    rows.filter((r) => !r.key).map((r) => `${locale}/${pillar}: ${r.name}`),
  ),
);
console.log(`wrote ${path.relative(REPO, out)} — ${Object.keys(map).length} locales`);
if (unresolved.length) {
  console.log(`unresolved (${unresolved.length}):`);
  for (const u of unresolved) console.log("  " + u);
} else {
  console.log("every metric name resolved to a bundle key.");
}
