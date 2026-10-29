import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('source provenance matching rejects false city labels, guessed dates and artifact drift', () => {
  const result = spawnSync('python3', ['test/source-provenance.test.py'], { encoding: 'utf8', timeout: 30000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('all source artifacts match their inputs and the build date cannot impersonate evidence vintage', async () => {
  const result = spawnSync('python3', ['scripts/reconcile-source-provenance.py', '--check'], { encoding: 'utf8', timeout: 30000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const { dataVintageLine } = await import('../src/publicationMeta.ts');
  for (const locale of ['en', 'th', 'zh', 'ko', 'ja']) assert.doesNotMatch(dataVintageLine(locale), /2024[–〜-]2025/);
  const summary = JSON.parse(readFileSync(new URL('../src/data/evidenceSummary.json', import.meta.url)));
  assert.equal(summary.inputCount, summary.datedInputCount + summary.undatedInputCount);
  assert.equal(summary.inputCount, Object.values(summary.registerStatusCounts).reduce((sum, value) => sum + value, 0));
});
