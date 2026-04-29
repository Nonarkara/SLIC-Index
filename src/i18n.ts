import type { Locale } from "./types";

/** Pick the right locale string from an en/th/zh triplet. */
export function t(locale: Locale, en: string, th: string, zh: string): string {
  if (locale === "th") return th;
  if (locale === "zh") return zh;
  return en;
}
