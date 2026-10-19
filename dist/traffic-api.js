const ORIGIN = 'https://slic.nonarkara.org';
const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

function reply(status, body, method) {
  return new Response(method === 'HEAD' || status === 204 ? null : JSON.stringify(body), {
    status, headers: { ...jsonHeaders, ...(status === 405 ? { Allow: 'GET, HEAD, POST' } : {}) },
  });
}

async function digest(secret, value) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function smallJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 128) { await reader.cancel(); throw new Error('size'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export async function trafficApi(request, env, context) {
  const method = request.method;
  if (!['GET', 'HEAD', 'POST'].includes(method)) return reply(405, { error: 'Method not allowed' }, method);
  if (method === 'POST') {
    if (new URL(request.url).origin !== ORIGIN || request.headers.get('Origin') !== ORIGIN ||
        (request.headers.get('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site') !== 'same-origin')) {
      return reply(403, { error: 'Forbidden' }, method);
    }
    if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1' ||
        request.cf?.botManagement?.verifiedBot || /bot|crawler|spider|headless/i.test(request.headers.get('User-Agent') || '')) {
      return reply(204, null, method);
    }
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return reply(415, { error: 'JSON required' }, method);
    if (Number(request.headers.get('Content-Length')) > 128) return reply(413, { error: 'Body too large' }, method);
    let body;
    try { body = await smallJson(request); } catch { return reply(400, { error: 'Invalid body' }, method); }
    if (!body || Object.keys(body).length !== 1 || typeof body.session !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.session)) {
      return reply(400, { error: 'Invalid session' }, method);
    }
    const ip = request.headers.get('CF-Connecting-IP');
    if (!env.TRAFFIC_DB || !env.TRAFFIC_SECRET || !ip) return reply(503, { error: 'Collection unavailable' }, method);
    try {
      const day = new Date().toISOString().slice(0, 10);
      const cutoff = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      const token = await digest(env.TRAFFIC_SECRET, `session:${day}:${body.session}`);
      const budget = await digest(env.TRAFFIC_SECRET, `budget:${day}:${ip}`);
      const country = /^[A-Z]{2}$/.test(request.cf?.country || '') && request.cf.country !== 'XX' ? request.cf.country : 'ZZ';
      // The conditional insert and trigger execute atomically; retries never increment totals.
      const results = await env.TRAFFIC_DB.batch([
        env.TRAFFIC_DB.prepare('DELETE FROM traffic_sessions WHERE day < ?').bind(cutoff),
        env.TRAFFIC_DB.prepare('DELETE FROM traffic_budget WHERE day < ?').bind(cutoff),
        env.TRAFFIC_DB.prepare(`INSERT OR IGNORE INTO traffic_sessions(day, digest, budget, country)
          SELECT ?, ?, ?, ? WHERE COALESCE((SELECT count FROM traffic_budget WHERE day = ? AND digest = ?), 0) < 60`)
          .bind(day, token, budget, country, day, budget),
      ]);
      if (results.some(result => result.success === false)) throw new Error('database');
      return reply(204, null, method);
    } catch { return reply(503, { error: 'Collection unavailable' }, method); }
  }
  if (!env.TRAFFIC_DB) return reply(503, { error: 'Statistics unavailable' }, method);
  // Canonical cache key ignores attacker-supplied query strings and headers.
  // HEAD shares GET's snapshot rather than triggering another lifetime scan.
  const cache = typeof caches === 'undefined' ? null : caches.default;
  const cacheKey = new Request(`${ORIGIN}/api/traffic`);
  try {
    const cached = await cache?.match(cacheKey);
    if (cached) return method === 'HEAD' ? new Response(null, cached) : cached;
  } catch { /* Cache failure must not make statistics unavailable. */ }
  try {
    const results = await env.TRAFFIC_DB.batch([
      env.TRAFFIC_DB.prepare('SELECT country, SUM(count) AS count FROM traffic_daily GROUP BY country ORDER BY count DESC'),
      env.TRAFFIC_DB.prepare('SELECT MIN(day) AS firstDay, MAX(day) AS lastDay, COUNT(DISTINCT day) AS observedDays, COALESCE(SUM(count), 0) AS count FROM traffic_daily'),
    ]);
    if (results.some(result => result.success === false)) throw new Error('database');
    const response = reply(200, { ...results[1].results[0], countries: results[0].results, updatedAt: new Date().toISOString(), timezone: 'UTC', source: 'First-party SLIC session counter' }, 'GET');
    response.headers.set('Cache-Control', 'public, max-age=300');
    if (cache) {
      const put = cache.put(cacheKey, response.clone()).catch(() => {});
      if (context?.waitUntil) context.waitUntil(put); else await put;
    }
    return method === 'HEAD' ? new Response(null, response) : response;
  } catch { return reply(503, { error: 'Statistics unavailable' }, method); }
}
