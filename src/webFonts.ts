import type { Locale } from "./types";

/**
 * The web fonts, chosen per locale.
 *
 * Google Fonts serves one stylesheet per request, and the CJK families the
 * site supports are almost all of it: Noto Sans SC is 452 kB of unicode-range
 * rules, KR 381 kB, JP 459 kB — 1.29 MB of stylesheet to say "this site has
 * three Han fonts". Every reader paid for all three, including the English
 * reader who will never see a Han glyph, on every route, before the first
 * pixel of content.
 *
 * The reader pays for the script they are reading. Latin is the base for
 * everybody; the script family follows the locale. Nothing is cut — the CJK
 * faces still ship, to the people who read them.
 */
const LATIN = [
  "Jost:ital,wght@0,100..900;1,100..900",
  "Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600",
  "JetBrains+Mono:wght@400;500;600",
];

const SCRIPT_FAMILY: Record<Locale, string | null> = {
  en: null,
  th: "IBM+Plex+Sans+Thai:wght@400;500;600;700",
  zh: "Noto+Sans+SC:wght@400;500;600;700",
  ko: "Noto+Sans+KR:wght@400;500;600;700",
  ja: "Noto+Sans+JP:wght@400;500;600;700",
};

export const WEB_FONT_LINK_ID = "slic-web-fonts";

export function webFontFamilies(locale: Locale): string[] {
  const families = [...LATIN];
  const script = SCRIPT_FAMILY[locale];
  if (script) families.push(script);
  return families;
}

export function webFontUrl(locale: Locale): string {
  return `https://fonts.googleapis.com/css2?family=${webFontFamilies(locale).join("&family=")}&display=swap`;
}

/**
 * Point the font stylesheet at the locale's faces. Called when the reader
 * changes locale, so a Thai reader's Thai face arrives when they ask for
 * Thai — not before.
 */
export function applyWebFonts(locale: Locale): void {
  const link = document.getElementById(WEB_FONT_LINK_ID);
  if (link instanceof HTMLLinkElement) link.href = webFontUrl(locale);
}
