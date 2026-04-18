export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function appHref(path: string): string {
  if (!path) {
    return BASE_PATH || "/";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    return path;
  }

  if (path === "/") {
    return `${BASE_PATH}/` || "/";
  }

  return `${BASE_PATH}${path}`;
}

export function stripBase(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }

  return pathname || "/";
}
