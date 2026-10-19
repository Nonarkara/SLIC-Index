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
  writeFileSync(join(root, '_worker.js'), 'private worker fixture');
  writeFileSync(join(root, 'traffic-api.js'), 'private traffic module fixture');
  const server = createApp(root).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/', '/rankings', '/city/th-bangkok']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-powered-by'), null);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'self'/);
      assert.match(response.headers.get('content-security-policy'), /object-src 'none'/);
      assert.equal(response.headers.get('cache-control'), 'no-cache');
    }
    for (const path of ['/assets/missing.js', '/missing.png', '/.env', '/.git/config', '/%2eenv', '/%2egit%2fconfig', '/_headers', '/_worker.js', '//_headers', '/%2f_headers', '//_worker.js', '/%2f_worker.js', '/missing%2epdf', '/downloads/missing.pdf/', '/downloads/missing%2epdf/']) {
      assert.equal((await fetch(base + path)).status, 404);
    }
    for (const path of ['//_headers', '/%2f_worker.js', '/missing%2epdf', '/downloads/missing.pdf/']) {
      const response = await fetch(base + path, { method: 'HEAD' });
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(await response.text(), '');
    }
    for (const path of ['/traffic-api.js', '/traffic-api%2ejs', '//traffic-api.js', '/%2ftraffic-api.js', '///traffic-api%2ejs', '/traffic-api.js/']) {
      for (const method of ['GET', 'HEAD']) {
        const response = await fetch(base + path, { method });
        assert.equal(response.status, 404, `${method} ${path}`);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.doesNotMatch(await response.text(), /private traffic module fixture/);
      }
    }
    for (const path of ['/%E0%A4%A', '/%00', '/%5cconfig']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 400);
      assert.equal(await response.text(), 'Bad request');
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    assert.equal((await fetch(base + '/rankings', { headers: { Accept: 'application/json' } })).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
    rmSync(root, { recursive: true });
  }
});
