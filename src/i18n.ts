import type { Locale } from "./types";

export type CoreLocale = Extract<Locale, "en" | "th" | "zh">;
export type ExtendedLocale = Exclude<Locale, CoreLocale>;
export type LocalizedRecord<T> = Record<CoreLocale, T> & Partial<Record<ExtendedLocale, T>>;

export function pickLocale<T>(copy: LocalizedRecord<T>, locale: Locale): T {
  return copy[locale] ?? copy.en;
}

/** BCP 47 tags for toLocaleString / toLocaleDateString — one per supported locale. */
export const localeNumberFormat: Record<Locale, string> = {
  en: "en-US",
  th: "th-TH",
  zh: "zh-CN",
  ko: "ko-KR",
  ja: "ja-JP",
};

/** Pick the right locale string from a locale-keyed set.
 *  ko and ja are optional; they fall back to en when not supplied. */
export function t(
  locale: Locale,
  en: string,
  th: string,
  zh: string,
  ko?: string,
  ja?: string,
): string {
  if (locale === "th") return th;
  if (locale === "zh") return zh;
  if (locale === "ko") return ko ?? en;
  if (locale === "ja") return ja ?? en;
  return en;
}
