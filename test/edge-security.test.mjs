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

test('a client route is answered with the shell even when the asset binding 404s it', async () => {
  // The asset binding does not apply _redirects: it answers a path that has
  // no file behind it with 404. The edge still has to serve the shell for a
  // client route, because the application — not the edge — decides what
  // /rankings means.
  //
  // The stub below behaves like that binding on purpose. A stub that answers
  // everything with 200 cannot see this failure: the whole site was 404 on
  // every route but the homepage while this file stayed green, because the
  // tests were serving the build through a dev server that has its own
  // fallback.
  const env = { ASSETS: { async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === '/index.html') {
      return new Response('<title>SLIC</title>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  } } };
  for (const path of ['/', '/rankings', '/compare', '/city/th-bangkok', '/methodology', '/ideas', '/traffic']) {
    const r = await worker.fetch(new Request('https://slic.test' + path), env);
    assert.equal(r.status, 200, path);
    assert.match(r.headers.get('content-type') ?? '', /text\/html/, path);
    assert.equal(r.headers.get('cache-control'), 'no-cache', path);
  }
  // A file that does not exist is still a 404: the shell is the answer to a
  // route, not a blanket over the whole origin.
  for (const path of ['/assets/missing.js', '/missing.png', '/downloads/missing.pdf', '/og-card.png']) {
    const r = await worker.fetch(new Request('https://slic.test' + path), env);
    assert.equal(r.status, 404, path);
    assert.equal(r.headers.get('cache-control'), 'no-store', path);
  }
});

test('a navigation request is answered with the shell too', async () => {
  // A request that arrives from the address bar has mode "navigate". The
  // Request constructor refuses to build from one — "invalid request mode
  // navigate" — so code that copies the incoming request into a new Request
  // throws. The edge did exactly that when it fetched the shell, swallowed
  // the throw, and answered 404 for every client route in production while
  // the test below it stayed green, because a Request built in Node is mode
  // "cors".
  const env = { ASSETS: { async fetch(request) {
    const path = new URL(typeof request === 'string' ? request : request.url).pathname;
    if (path === '/index.html') {
      return new Response('<title>SLIC</title>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  } } };
  const navigation = new Request('https://slic.test/rankings');
  Object.defineProperty(navigation, 'mode', { value: 'navigate' });
  const r = await worker.fetch(navigation, env);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') ?? '', /text\/html/);
});
