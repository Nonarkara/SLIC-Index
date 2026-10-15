import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function execute(file, context) {
  const source = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8')
    .replaceAll('import.meta.env.VITE_VISITOR_COUNT_URL', 'globalThis.countUrl');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  runInNewContext(outputText, { exports, URL, URLSearchParams, ...context });
  return exports;
}

const defensiveRestore = readFileSync(new URL('../public/route-restore.js', import.meta.url), 'utf8');

test('real bootstrap mounts despite malformed links and denied history', () => {
  for (const search of ['?p=%', '?x=1&p=%', '?p=%E0%A4%A', '?p=rankings']) {
    for (const denied of [false, true]) {
      let mounted = false;
      let location = new URL(`https://site.invalid/${search}`);
      const window = {
        get location() { return location; },
        history: { replaceState(_state, _title, path) {
          if (denied) throw new Error('denied');
          location = new URL(path, location);
        } },
      };
      runInNewContext(defensiveRestore, { window });
      execute('main.tsx', {
        window,
        document: { getElementById: () => ({}) },
        require: (name) => name === 'react-dom/client'
          ? { default: { createRoot: () => ({ render() { mounted = true; } }) } }
          : name === 'react/jsx-runtime' ? { jsx: () => ({}) } : {},
      });
      assert.equal(mounted, true, `${search}, history denied=${denied}`);
    }
  }
});

test('real bootstrap restores legacy routes once and stays same-origin', () => {
  for (const [search, expected] of [
    ['?p=city%2Fth-bangkok%26lang%3Dth%23score', '/city/th-bangkok?lang=th#score'],
    ['?x=1&p=city%2Fth-bangkok%26lang%3Dth%23score', '/city/th-bangkok?lang=th#score'],
    ['?p=%2F%2Fevil.invalid', '/evil.invalid'],
    ['?p=city%2Fpercent%2520name', '/city/percent%20name'],
  ]) {
    let location = new URL(`https://site.invalid/${search}`);
    const window = {
      get location() { return location; },
      history: { replaceState(_state, _title, path) { location = new URL(path, location); } },
    };
    runInNewContext(defensiveRestore, { window });
    execute('main.tsx', {
      window, document: { getElementById: () => ({}) },
      require: (name) => name === 'react-dom/client'
        ? { default: { createRoot: () => ({ render() {} }) } }
        : name === 'react/jsx-runtime' ? { jsx: () => ({}) } : {},
    });
    assert.equal(location.origin, 'https://site.invalid');
    assert.equal(location.pathname + location.search + location.hash, expected);
  }
});

function trackingHarness({ privacy = {}, storageDenial = '', geoFails = false } = {}) {
  const requests = [], rows = [], stored = new Map();
  const context = {
    countUrl: 'https://count.invalid/',
    navigator: { language: 'en', ...privacy },
    window: { location: new URL('https://site.invalid/city/bangkok?private=QUERY#FRAGMENT') },
    document: { referrer: 'https://referrer.invalid/private?private=REFERRER#HIDDEN' },
    get sessionStorage() {
      if (storageDenial === 'access') throw new Error('denied');
      return {
        getItem(key) { if (storageDenial === 'read') throw new Error('denied'); return stored.get(key); },
        setItem(key, value) { if (storageDenial === 'write') throw new Error('denied'); stored.set(key, value); },
      };
    },
    AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (url === 'https://ipapi.co/json/') {
        if (geoFails) throw new Error('offline');
        return { ok: true, json: async () => ({ ip: '192.0.2.1', country_name: 'Test', region: 'Region', city: 'City' }) };
      }
      return { ok: true, json: async () => ({ count: 42, countries: [] }) };
    },
    require: () => ({ supabase: { from: () => ({
      insert: (row) => { rows.push(row); return Promise.resolve({ error: null }); },
      select: async () => ({ count: 42, error: null }),
    }) } }),
  };
  // Preserve the throwing storage accessor while constructing the VM globals.
  const storageDescriptor = Object.getOwnPropertyDescriptor(context, 'sessionStorage');
  delete context.sessionStorage;
  const api = executeTracking(context, storageDescriptor);
  return { api, requests, rows, context };
}

function executeTracking(context, storageDescriptor) {
  const source = readFileSync(new URL('../src/visitorTracking.ts', import.meta.url), 'utf8')
    .replaceAll('import.meta.env.VITE_VISITOR_COUNT_URL', 'globalThis.countUrl');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  const globals = { exports, URL, ...context };
  Object.defineProperty(globals, 'sessionStorage', storageDescriptor);
  runInNewContext(outputText, globals);
  return exports;
}

test('both visitor records redact private URL data and identifying fields', async () => {
  const { api, requests, rows } = trackingHarness();
  await api.trackVisitor();
  await api.trackVisitor();
  const post = requests.find((request) => request.options?.method === 'POST');
  assert.equal(requests.length, 2);
  assert.equal(rows.length, 1);
  const body = JSON.parse(post.options.body);
  for (const record of [body, rows[0]]) {
    assert.equal(record.page, 'https://site.invalid/city/bangkok');
    assert.equal(record.referrer, 'https://referrer.invalid');
    assert.equal(record.country, 'Test');
    for (const field of ['ip', 'userAgent', 'user_agent', 'screen', 'timezone']) assert.equal(field in record, false);
    assert.doesNotMatch(JSON.stringify(record), /QUERY|FRAGMENT|REFERRER|HIDDEN|192\.0\.2\.1/);
  }
  assert.equal(post.options.referrerPolicy, 'no-referrer');
  assert.equal(requests[0].options.referrerPolicy, 'no-referrer');
});

test('explicit page arguments are sanitized too', async () => {
  const { api, rows } = trackingHarness();
  await api.trackVisitor('/rankings?private=QUERY#FRAGMENT');
  assert.equal(rows[0].page, 'https://site.invalid/rankings');
});

test('DNT and GPC suppress all collection while counters remain functional', async () => {
  for (const privacy of [{ doNotTrack: '1' }, { doNotTrack: 'yes' }, { msDoNotTrack: '1' }, { globalPrivacyControl: true }]) {
    const { api, requests, rows } = trackingHarness({ privacy, storageDenial: 'access' });
    await api.trackVisitor();
    assert.equal(requests.length, 0);
    assert.equal(rows.length, 0);
    assert.equal((await api.getVisitorStats()).count, 42);
  }
});

test('storage denial and failed geo lookup do not reject or duplicate tracking', async () => {
  for (const storageDenial of ['access', 'read', 'write']) {
    const { api, requests, rows } = trackingHarness({ storageDenial, geoFails: true });
    await Promise.all([api.trackVisitor(), api.trackVisitor()]);
    assert.equal(requests.length, 2);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].country, 'Unknown');
  }
});
