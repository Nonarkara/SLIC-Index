import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../public/route-restore.js', import.meta.url), 'utf8');
test('route restoration stays on the current origin and tolerates invalid encoding', () => {
  for (const [search, expected] of [
    ['?p=rankings', '/rankings'],
    ['?p=city%2Fth-bangkok%26lang%3Dth%23score', '/city/th-bangkok?lang=th#score'],
    ['?p=%2F%2Fevil.example', '/evil.example'],
    ['?p=%E0%A4%A', null],
  ]) {
    let restored = null;
    runInNewContext(script, { window: {
      location: { search },
      history: { replaceState: (_state, _title, path) => { restored = path; } },
    } });
    assert.equal(restored, expected);
  }
});
