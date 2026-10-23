import type { Locale } from "./types";

/**
 * The locale, decided once and in one place.
 *
 * The app decides it at mount, and the font boot script has to decide it
 * before the app mounts (the font stylesheet is what the first paint waits
 * on). Two copies of this rule would drift, and a drift here is invisible:
 * the reader would get one script's fonts and the other's text.
 */
export const localeMap: Record<Locale, string> = {
  en: "en",
  th: "th",
  zh: "zh-CN",
  ko: "ko",
  ja: "ja",
};

const LOCALES: Locale[] = ["en", "th", "zh", "ko", "ja"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as string[]).includes(value);
}

/**
 * The stored choice wins; otherwise the browser's own language preference.
 * A stored locale is the reader's explicit choice, so it outranks the OS.
 */
export function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const saved = window.localStorage.getItem("slic-locale");
  if (isLocale(saved)) return saved;

  const candidates = [navigator.language, ...navigator.languages]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  if (candidates.some((c) => c.startsWith("th"))) return "th";
  if (candidates.some((c) => c.startsWith("zh"))) return "zh";
  if (candidates.some((c) => c.startsWith("ko"))) return "ko";
  if (candidates.some((c) => c.startsWith("ja"))) return "ja";

  return "en";
}
