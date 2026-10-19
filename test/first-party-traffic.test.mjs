import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function harness({ privacy = {}, denied = false, fail = false, origin = 'https://slic.nonarkara.org' } = {}) {
  const requests = [], storage = new Map();
  const exports = {};
  const source = readFileSync(new URL('../src/firstPartyTraffic.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  const stats = { count: 1, countries: [{ country: 'TH', count: 1 }], firstDay: '2026-10-19', lastDay: '2026-10-19', observedDays: 1, updatedAt: '2026-10-19T00:00:00Z' };
  runInNewContext(outputText, {
    exports, URL, AbortController, setTimeout: (fn, ms) => setTimeout(fn, ms === 1000 || ms === 2000 ? 0 : ms), clearTimeout, crypto,
    window: { location: new URL(`${origin}/rankings?PRIVATE_QUERY#PRIVATE_HASH`) },
    navigator: { ...privacy },
    sessionStorage: { getItem(key) { if (denied) throw Error('denied'); return storage.get(key); }, setItem(key, value) { if (denied) throw Error('denied'); storage.set(key, value); } },
    fetch: async (url, options) => { requests.push({ url, options }); if (fail) throw Error('offline'); return new Response(options.method ? null : JSON.stringify(stats), { status: options.method ? 204 : 200, headers: { 'Content-Type': 'application/json' } }); },
  });
  return { exports, requests, stats, storage };
}

test('first-party collection sends only a random session token, once, even with denied storage', async () => {
  for (const denied of [false, true]) {
    const { exports, requests } = harness({ denied });
    await Promise.all([exports.trackVisitor(), exports.trackVisitor()]);
    await exports.trackVisitor();
    assert.equal(requests.length, 1);
    const { url, options } = requests[0];
    assert.equal(url, '/api/traffic');
    assert.deepEqual(Object.keys(JSON.parse(options.body)), ['session']);
    assert.doesNotMatch(options.body, /PRIVATE|country|referrer|ip|userAgent/);
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.credentials, 'omit');
  }
});

test('DNT/GPC and nonproduction sites never collect, public aggregate reads still work', async () => {
  for (const privacy of [{ doNotTrack: '1' }, { doNotTrack: 'yes' }, { msDoNotTrack: '1' }, { globalPrivacyControl: true }]) {
    const { exports, requests } = harness({ privacy });
    await exports.trackVisitor(); assert.equal(requests.length, 0);
    assert.equal((await exports.getTrafficStats()).count, 1);
  }
  const preview = harness({ origin: 'https://preview.slic-index.pages.dev' });
  await preview.exports.trackVisitor(); assert.equal(preview.requests.length, 0);
});

test('failed writes do not mark sessions counted and failed reads never fabricate a total', async () => {
  const { exports, requests, storage } = harness({ fail: true, denied: true });
  await exports.trackVisitor(); await exports.trackVisitor();
  assert.equal(requests.length, 6); assert.equal(storage.has('slic_first_party_ack'), false);
  assert.equal(new Set(requests.map(request => request.options.body)).size, 1, 'all retries reuse the same token even without storage');
  assert.equal(await exports.getTrafficStats(), null);
  assert.equal((await exports.getVisitorStats()).count, null);
});

test('aggregate validation rejects inconsistent or negative totals', async () => {
  for (const mutate of [stats => { stats.count = -1; }, stats => { stats.count = 20; }, stats => { stats.countries[0].count = -1; }, stats => { stats.countries.push({ country: 'TH', count: 1 }); stats.count = 2; }]) {
    const h = harness(); mutate(h.stats);
    assert.equal(await h.exports.getTrafficStats(), null);
  }
});
