import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { trafficApi } from '../public/traffic-api.js';

const origin = 'https://slic.nonarkara.org';
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../migrations/0001_traffic.sql', import.meta.url), 'utf8'));
  const env = { TRAFFIC_SECRET: 'synthetic-test-secret-only', TRAFFIC_DB: {
    prepare(text) { return { text, params: [], bind(...params) { this.params = params; return this; } }; },
    async batch(statements) {
      sql.exec('BEGIN');
      try {
        const result = statements.map(({ text, params }) => {
          const query = sql.prepare(text);
          return { success: true, results: /^SELECT/.test(text) ? query.all(...params) : (query.run(...params), []) };
        });
        sql.exec('COMMIT'); return result;
      } catch (error) { sql.exec('ROLLBACK'); throw error; }
    },
  } };
  return { env, sql };
}
function post(overrides = {}) {
  const { country = 'TH', headers = {}, body = JSON.stringify({ session: crypto.randomUUID() }), url = `${origin}/api/traffic`, ...options } = overrides;
  const req = new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, body, ...options });
  Object.defineProperty(req, 'cf', { value: { country } }); return req;
}

test('traffic writes validate origin, method, payload size and content', async () => {
  const { env, sql } = database();
  for (const [request, expected] of [
    [post({ headers: { Origin: 'https://evil.invalid' } }), 403],
    [post({ url: 'https://preview.slic-index.pages.dev/api/traffic' }), 403],
    [post({ headers: { 'Sec-Fetch-Site': 'cross-site' } }), 403],
    [post({ headers: { 'Content-Type': 'text/plain' } }), 415],
    [post({ body: 'x'.repeat(129) }), 400],
    [post({ body: '{' }), 400],
    [post({ body: JSON.stringify({ session: crypto.randomUUID(), country: 'US' }) }), 400],
    [new Request(`${origin}/api/traffic`, { method: 'DELETE' }), 405],
  ]) assert.equal((await trafficApi(request, env)).status, expected);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM traffic_daily').get().n, 0);
  sql.close();
});

test('actual SQLite trigger deduplicates sessions and limits network abuse atomically', async () => {
  const { env, sql } = database();
  const body = JSON.stringify({ session: crypto.randomUUID() });
  for (let i = 0; i < 3; i++) assert.equal((await trafficApi(post({ body }), env)).status, 204);
  assert.equal(sql.prepare('SELECT SUM(count) AS n FROM traffic_daily').get().n, 1);
  for (let i = 0; i < 65; i++) await trafficApi(post(), env);
  assert.equal(sql.prepare('SELECT SUM(count) AS n FROM traffic_daily').get().n, 60);
  await trafficApi(post({ country: 'US', headers: { 'CF-Connecting-IP': '192.0.2.2' } }), env);
  const response = await trafficApi(new Request(`${origin}/api/traffic`), env);
  const stats = await response.json();
  assert.equal(stats.count, 61);
  assert.equal(stats.countries.reduce((sum, row) => sum + row.count, 0), stats.count);
  assert.equal(stats.observedDays, 1);
  assert.doesNotMatch(JSON.stringify(stats), /192\.0\.2|"(?:digest|session|budget)"/);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=300');
  sql.close();
});

test('traffic respects privacy headers, trusts edge geography only and prunes expired digests', async () => {
  const { env, sql } = database();
  for (const headers of [{ DNT: '1' }, { 'Sec-GPC': '1' }, { 'User-Agent': 'ExampleCrawlerBot' }]) {
    await trafficApi(post({ headers }), env);
  }
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM traffic_daily').get().n, 0);
  sql.exec("INSERT INTO traffic_budget VALUES ('2000-01-01', 'expired', 1)");
  await trafficApi(post({ country: "'; DROP TABLE traffic_daily;--" }), env);
  assert.equal(sql.prepare('SELECT country FROM traffic_daily').get().country, 'ZZ');
  await trafficApi(post({ country: 'XX' }), env);
  assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM traffic_daily WHERE country='XX'").get().n, 0);
  assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM traffic_budget WHERE day='2000-01-01'").get().n, 0);
  const head = await trafficApi(new Request(`${origin}/api/traffic`, { method: 'HEAD' }), env);
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  sql.close();
});

test('database failure is bounded and never leaks implementation errors', async () => {
  const env = { TRAFFIC_DB: { prepare() { throw new Error('PRIVATE_DATABASE_DETAIL'); } }, TRAFFIC_SECRET: 'synthetic' };
  for (const request of [post(), new Request(`${origin}/api/traffic`)]) {
    const response = await trafficApi(request, env);
    assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /PRIVATE_DATABASE_DETAIL/);
  }
});

test('historical totals reconcile and contain no private visitor fields', () => {
  const source = readFileSync(new URL('../src/data/traffic-history.json', import.meta.url), 'utf8');
  const data = JSON.parse(source);
  assert.equal(data.count, 1742);
  assert.equal(data.countries.reduce((sum, row) => sum + row.count, 0), data.count);
  assert.equal(data.daily.reduce((sum, row) => sum + row.count, 0), data.count);
  assert.equal(data.daily.length, data.observedDays);
  assert.equal(data.excludedTestRecords, 3);
  assert.doesNotMatch(source, /"(?:ip|userAgent|referrer|city|region)"|Test Country/);
});

test('GET and HEAD share a canonical cached aggregate despite query-string cache busting', async () => {
  const { env, sql } = database();
  const prior = globalThis.caches;
  let saved, scans = 0;
  const original = env.TRAFFIC_DB.batch;
  env.TRAFFIC_DB.batch = async (...args) => { scans++; return original(...args); };
  globalThis.caches = { default: { async match(key) { assert.equal(key.url, `${origin}/api/traffic`); return saved?.clone(); }, async put(key, response) { assert.equal(key.url, `${origin}/api/traffic`); saved = response; } } };
  try {
    assert.equal((await trafficApi(new Request(`${origin}/api/traffic?random=one`), env)).status, 200);
    assert.equal((await trafficApi(new Request(`${origin}/api/traffic?random=two`, { method: 'HEAD' }), env)).status, 200);
    assert.equal(scans, 1);
  } finally { globalThis.caches = prior; sql.close(); }
});

test('atlas joins use stable M49 identifiers, not mutable display names', () => {
  const codes = JSON.parse(readFileSync(new URL('../src/data/country-numeric-codes.json', import.meta.url), 'utf8'));
  const atlas = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url), 'utf8'));
  for (const code of ['CD', 'CG', 'CI', 'PS', 'DO', 'SS', 'CF', 'GQ', 'BA']) {
    assert.ok(atlas.objects.countries.geometries.some(country => Number(country.id) === Number(codes[code])), code);
  }
});
