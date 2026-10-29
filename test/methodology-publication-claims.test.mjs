import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { ampi } from '../src/publicationMath.js';

test('downloaded methodology papers disclose their actual model and verification limits', () => {
  const source = readFileSync(new URL('../scripts/generate_methodology_pdf.py', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /10\.13140\/RG\.2\.2\.SLIC\.2026|4,193 verified empirical observations|ResearchGate Preprint|Technical Paper V3\.5/);
  const result = spawnSync('python3', ['-c', `
import json
from pathlib import Path
from pypdf import PdfReader
model = json.loads(Path('src/data/publishedRankingData.json').read_text())['publicationManifest']['scorerVersion']
for locale in ('en', 'th', 'zh'):
    reader = PdfReader(f'public/downloads/slic-methodology-technical-paper-{locale}.pdf')
    text = ' '.join(page.extract_text() for page in reader.pages[:3])
    assert model in text, locale
    assert 'not independently peer reviewed' in text, locale
    assert 'not independent empirical validation' in text, locale
    assert '10.13140/RG.2.2.SLIC.2026' not in text, locale
    assert 'verified empirical observations' not in text, locale
    assert 'Non-Compensatory' not in text, locale
    assert 'sum over O(c)' in text, locale
    assert 'All-zero observed scores: mu = var = AMPI = 0' in text, locale
    assert 'max(mu(c), 1e-10)' in text, locale
`], { encoding: 'utf8', timeout: 120000 });
  assert.equal(result.status, 0, `${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
});

test('the documented missing-pillar and zero branches match the canonical AMPI', () => {
  const weights = [25, 22, 18, 15, 20];
  const score = scores => ampi(scores.map((score, i) => ({ score, weight: weights[i] })));
  assert.deepEqual(score([0, 0, 0, 0, 0]), { score: 0, mu: 0, variance: 0 });
  assert.deepEqual(score([null, null, null, null, null]), { score: null, mu: null, variance: null });
  assert.equal(score([50, 50, null, 50, 50]).mu, 50);
  assert.ok(score([100, 50, 50, 50, 50]).score > score([50, 50, 50, 50, 50]).score,
    'the penalty reduces, but does not eliminate, compensation');
});
