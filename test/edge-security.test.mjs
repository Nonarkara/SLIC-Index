import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../public/_worker.js';

test('edge rejects encoded private paths before fetching assets', async () => {
  const env = { ASSETS: { fetch() { assert.fail('Blocked path reached assets'); } } };
  for (const [path, status] of [['/.env', 404], ['/%2eenv', 404], ['/%2egit%2fconfig', 404], ['/_worker.js', 404], ['//_headers', 404], ['/%2f_headers', 404], ['//_worker.js', 404], ['/%2f_worker.js', 404], ['///_routes.json', 404], ['/%2f_redirects', 404], ['/%E0%A4%A', 400], ['/%00', 400]]) {
    const r = await worker.fetch(new Request('https://slic.test' + path), env);
    assert.equal(r.status, status);
    assert.equal(r.headers.get('cache-control'), 'no-store');
  }
});

test('edge blocks traffic module source before fetching assets', async () => {
  const env = { ASSETS: { fetch() { assert.fail('Private traffic module reached assets'); } } };
  for (const path of ['/traffic-api.js', '/traffic-api%2ejs', '//traffic-api.js', '/%2ftraffic-api.js', '///traffic-api%2ejs', '/traffic-api.js/']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request('https://slic.test' + path, { method }), env);
      assert.equal(response.status, 404, `${method} ${path}`);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      if (method === 'HEAD') assert.equal(await response.text(), '');
    }
  }
});

test('edge does not cache HTML as JavaScript; real files and SPA routes survive', async () => {
  const env = { ASSETS: { async fetch(request) {
    const path = new URL(request.url).pathname;
    return new Response(path.endsWith('real.js') ? 'export {}' : '<title>SLIC</title>', {
      headers: { 'Content-Type': path.endsWith('real.js') ? 'application/javascript' : 'text/html', 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } } };
  for (const path of ['/assets/missing.js', '/missing.png', '/downloads/missing.pdf', '/missing.html', '/downloads/missing.pdf/', '/missing%2epdf/', '/assets']) {
    const r = await worker.fetch(new Request('https://slic.test' + path), env);
    assert.equal(r.status, 404);
    assert.equal(r.headers.get('cache-control'), 'no-store');
  }
  for (const path of ['/', '/rankings', '/city/th-bangkok', '/index%2ehtml']) {
    const r = await worker.fetch(new Request('https://slic.test' + path), env);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('cache-control'), 'no-cache');
  }
  const js = await worker.fetch(new Request('https://slic.test/assets/real.js'), env);
  assert.equal(js.status, 200);
  assert.match(js.headers.get('cache-control'), /immutable/);
  const head = await worker.fetch(new Request('https://slic.test/assets/missing.js', { method: 'HEAD' }), env);
  assert.equal(head.status, 404);
  assert.equal(await head.text(), '');
  const post = await worker.fetch(new Request('https://slic.test/', { method: 'POST' }), env);
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});

test('edge asset outages return a bounded failure without internals', async () => {
  const r = await worker.fetch(new Request('https://slic.test/'), {
    ASSETS: { fetch() { throw new Error('private infrastructure detail'); } },
  });
  assert.equal(r.status, 503);
  assert.equal(await r.text(), 'Service unavailable');
  assert.equal(r.headers.get('cache-control'), 'no-store');
});
