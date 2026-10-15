export function inspectPath(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    return { status: 400 };
  }
  if (/[\u0000-\u001f\u007f\\]/.test(path)) return { status: 400 };
  if (path.split('/').some(part => part.startsWith('.')) ||
      /^\/(?:_worker\.js|_headers|_redirects|_routes\.json)(?:\/|$)/.test(path)) {
    return { status: 404 };
  }
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  return { status: 200, path: normalizedPath,
    isFile: /\.[^/]+$/.test(normalizedPath) || normalizedPath === '/assets' || normalizedPath.startsWith('/assets/') };
}
