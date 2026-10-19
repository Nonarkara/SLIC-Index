import { inspectPath } from './request-policy.js';
import { trafficApi } from './traffic-api.js';

function failure(status, method) {
  return new Response(method === 'HEAD' ? null : status >= 500 ? 'Service unavailable' : status === 400 ? 'Bad request' : status === 405 ? 'Method not allowed' : 'Not found', {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      ...(status === 405 ? { Allow: 'GET, HEAD' } : {}),
    },
  });
}

export default {
  async fetch(request, env, context) {
    const policy = inspectPath(new URL(request.url).pathname);
    if (policy.status !== 200) return failure(policy.status, request.method);
    if (policy.path === '/api/traffic') return trafficApi(request, env, context);
    if (policy.path === '/api' || policy.path.startsWith('/api/')) return failure(404, request.method);
    if (!['GET', 'HEAD'].includes(request.method)) return failure(405, request.method);
    let response;
    try {
      response = await env.ASSETS.fetch(request);
    } catch {
      return failure(503, request.method);
    }
    // Pages' SPA fallback may return index.html even for a nonexistent asset.
    if (policy.isFile && response.headers.get('Content-Type')?.includes('text/html')) {
      // index.html is the only published HTML document.
      if (policy.path !== '/index.html') return failure(404, request.method);
    }
    if (response.status >= 400) return failure(response.status, request.method);
    const result = new Response(response.body, response);
    if (result.headers.get('Content-Type')?.includes('text/html')) {
      result.headers.set('Cache-Control', 'no-cache');
    }
    return result;
  },
};
