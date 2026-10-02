import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server.js';
import { mkdtempSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('static server protects routes, headers, and missing files', async () => {
  const root = mkdtempSync(join(tmpdir(), 'slic-server-'));
  copyFileSync(new URL('../public/_headers', import.meta.url), join(root, '_headers'));
  writeFileSync(join(root, 'index.html'), '<!doctype html><title>SLIC</title>');
  const server = createApp(root).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/', '/rankings', '/city/th-bangkok']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-powered-by'), null);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'DENY');
      assert.match(response.headers.get('content-security-policy'), /object-src 'none'/);
      assert.equal(response.headers.get('cache-control'), 'no-cache');
    }
    for (const path of ['/assets/missing.js', '/missing.png', '/.env', '/.git/config']) {
      assert.equal((await fetch(base + path)).status, 404);
    }
    assert.equal((await fetch(base + '/rankings', { headers: { Accept: 'application/json' } })).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
    rmSync(root, { recursive: true });
  }
});
