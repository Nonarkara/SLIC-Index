import THUMBS from "./data/thumbnails.json" with { type: "json" };

/**
 * Thumbnails.
 *
 * The site's photographs were served at their full size — a 1600px file
 * painted into a 240px box, a 1177px partner logo painted into 54px — so
 * every reader downloaded ten times the pixels the page could show. The
 * thumbnails are the same pictures, resized to about twice the box they are
 * painted into, and the manifest says which file exists at which width.
 *
 * The original is still there for the places that show a photograph large.
 * Nothing was cropped and nothing was cut.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type ThumbEntry = Record<string, string>;
const MANIFEST = THUMBS as Record<string, ThumbEntry>;

function keyOf(src: string): string {
  let path = src;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
  return path.replace(/^\//, "");
}

/**
 * The thumbnail of an image for the box it is painted into.
 *
 * `width` is the width of the thumbnail wanted — the box times two, for a 2×
 * display. When the manifest has no thumbnail at that width, the smallest one
 * it does have is used; when it has none at all, the original is returned, so
 * an image the plan does not cover still renders.
 */
export function thumbSrc(src: string, width?: number): string {
  const entry = MANIFEST[keyOf(src)];
  if (!entry) return src;

  const widths = Object.keys(entry).sort((a, b) => Number(a) - Number(b));
  const chosen = (width !== undefined && entry[String(width)]) || entry[widths[0]];
  if (!chosen) return src;
  return `${BASE}/${chosen}`;
}
