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

function serve(response) {
  const result = new Response(response.body, response);
  if (result.headers.get('Content-Type')?.includes('text/html')) {
    result.headers.set('Cache-Control', 'no-cache');
  }
  return result;
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
    if (response.status >= 400) {
      // A path that is not a file is a client route, and the application —
      // not the edge — decides what it means. The shell is the answer to a
      // client route, so the shell is served here.
      //
      // This used to be left to the platform: _redirects carries "/* /
      // index.html 200", and a deployment whose asset binding applies that
      // rule answered every route with the shell. A deployment whose asset
      // binding answers a client route with 404 left thirteen of the fifteen
      // published routes unreachable by direct link, while every local gate
      // stayed green — they were serving the build through a dev server
      // that has its own fallback.
      //
      // The fallback cannot be left to the platform. The shell is fetched
      // here, so the route survives whatever the binding does.
      if (!policy.isFile) {
        try {
          const shell = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
          if (shell.status === 200) return serve(shell);
        } catch {
          // Fall through to the bounded failure below.
        }
      }
      return failure(response.status, request.method);
    }
    return serve(response);
  },
};
