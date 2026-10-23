/**
 * The font stylesheet, requested before the app mounts.
 *
 * The stylesheet is what the first paint waits on, so the decision of WHICH
 * faces to request has to be made before React renders. This module runs
 * ahead of the app (module scripts execute in document order) and creates
 * the link with the reader's own script already chosen.
 *
 * It creates the link rather than rewriting one that is already in the
 * document: a link in index.html would start a request for the Latin set
 * before this script could speak, and a CJK reader would pay for two
 * stylesheets.
 */
import { detectLocale } from "./locale";
import { WEB_FONT_LINK_ID, webFontUrl } from "./webFonts";

const locale = detectLocale();
const href = webFontUrl(locale);

if (!document.getElementById(WEB_FONT_LINK_ID)) {
  const link = document.createElement("link");
  link.id = WEB_FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
