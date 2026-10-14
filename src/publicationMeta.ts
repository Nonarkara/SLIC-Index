/**
 * Publication facts — derived from the published bundle, never hardcoded.
 *
 * Every "last published" / "data vintage" / version claim on the site used to
 * be a literal string repeated across locale branches. Three defects came out
 * of that:
 *
 *   1. The footer claimed "Last published: May 2026" on every locale. The
 *      bundle was actually generated 2026-07-04. The claim was two months stale
 *      and nothing caught it, because nothing compared it to the data.
 *   2. The same footer line stated three different facts across five locales —
 *      en/th/zh gave a date, ko said "per v3.4.0", ja said "as of the v3.4.0
 *      publication date". A reader switching languages got different facts.
 *   3. The citation line formatted authors three ways — "Arkara, N. &
 *      Thiengburanathum, P." in en/th/zh versus "Non Arkara … 부교수" and
 *      "Non Arkara … 准教授" in ko/ja, where the academic title appears in no
 *      other locale.
 *
 * The fix is structural: derive the date and the version from the bundle, and
 * localise only the template. One fact, five renderings, no hardcoded dates.
 */

// The import attribute keeps this module loadable by Node's native TS stripping
// as well as by Vite, so the test suite can import it directly and assert on the
// real rendered strings instead of re-implementing the derivation.
import publishedData from "./data/publishedRankingData.json" with { type: "json" };
import type { Locale } from "./types";

interface Manifest {
  generatedAt: string;
  scorerVersion: string;
  tierPolicyVersion: string;
}

const manifest = (publishedData.publicationManifest ?? {}) as Partial<Manifest>;

/** Fallback only if the bundle ever ships without a manifest. */
const FALLBACK_GENERATED_AT = "2026-07-04T00:00:00.000Z";

const generatedAtIso = manifest.generatedAt ?? FALLBACK_GENERATED_AT;

/** Machine-readable publication instant (UTC). */
export const PUBLISHED_AT_ISO = generatedAtIso;

/** ISO calendar date, e.g. "2026-07-04". */
export const PUBLISHED_AT_DATE = generatedAtIso.slice(0, 10);

export const PUBLISHED_AT_YEAR = Number(PUBLISHED_AT_DATE.slice(0, 4));

/** "v3.4.0" — the public-facing form of the scorer version. */
export const SCORE_MODEL_VERSION = manifest.scorerVersion ?? "slic-v3.4.0";

export const SCORE_MODEL_VERSION_SHORT = SCORE_MODEL_VERSION.replace(/^slic-/, "");

export const TIER_POLICY_VERSION = manifest.tierPolicyVersion ?? "public-tier-v1.3.0";

/** City counts straight from the bundle, so no page can claim a stale total. */
export const CITY_TOTAL = publishedData.cities.length;
export const CITY_RANKED = publishedData.cities.filter(
  (c) => c.rankingStatus === "Ranked",
).length;
export const CITY_WATCHLIST = CITY_TOTAL - CITY_RANKED;

/** Month name in each locale, from the UTC publication instant. */
function publishedMonthLabel(locale: Locale): string {
  const date = new Date(generatedAtIso);
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  switch (locale) {
    case "th":
      // Thai month names, abbreviated the way a Thai citation would write them.
      return `${["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][month]} ${year + 543}`;
    case "zh":
      return `${year} 年 ${month + 1} 月`;
    case "ko":
      return `${year}년 ${month + 1}월`;
    case "ja":
      return `${year}年${month + 1}月`;
    default:
      return date.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  }
}

/** The full publication date, localised. Single fact, five renderings. */
export function publishedMonth(locale: Locale): string {
  return publishedMonthLabel(locale);
}

/**
 * The data-vintage line. The vintage year range is a publication decision and
 * lives here once; every locale renders the same sentence shape.
 */
export function dataVintageLine(locale: Locale): string {
  const month = publishedMonthLabel(locale);
  switch (locale) {
    case "th":
      return `ข้อมูล: วินเทจปี 2024–2025 · เผยแพร่ล่าสุด: ${month}`;
    case "zh":
      return `数据：2024–2025 年版本 · 最后发布：${month}`;
    case "ko":
      return `데이터: 2024–2025 빈티지 · 최종 공개: ${month}`;
    case "ja":
      return `データ：2024〜2025年ビンテージ · 最終公開：${month}`;
    default:
      return `Data: 2024–2025 vintage · Last published: ${month}`;
  }
}

/**
 * The author identity, in the two forms the footer needs.
 *
 * `AUTHOR_APA` is the reference-list form (surname + initials) used in the
 * one-line citation. `authorProse()` is the in-sentence form used in the long
 * "Suggested credit" card, where the reader benefits from knowing who wrote it
 * and in what capacity. Both derive from the same two names so a correction to
 * one cannot leave the other stale — the footer previously carried an
 * independent author string per locale, and ko/ja had already drifted onto a
 * different rendering from en/th/zh.
 */
const AUTHOR_SURNAMES = { first: "Arkara, N.", second: "Thiengburanathum, P." } as const;

export const AUTHOR_APA = `${AUTHOR_SURNAMES.first} & ${AUTHOR_SURNAMES.second}`;

/** Full names as they appear in the long-form credit, per locale. */
const AUTHOR_PROSE_NAMES: Record<Locale, string> = {
  en: "Non Arkara and Associate Professor Poon Thiengburanathum",
  th: "Non Arkara และ Associate Professor Poon Thiengburanathum",
  zh: "Non Arkara 与 Associate Professor Poon Thiengburanathum",
  ko: "Non Arkara 및 Poon Thiengburanathum 부교수",
  ja: "Non Arkara および Poon Thiengburanathum 准教授",
};

export const authorProse = (locale: Locale): string => AUTHOR_PROSE_NAMES[locale];

/**
 * The canonical citation string. Author names and year are fixed; only the
 * surrounding labels localise. No locale adds an academic title, because no
 * other locale does.
 */
export function citationLine(locale: Locale): string {
  const title = "SLIC Index V3 — Smart and Liveable Cities Index";
  switch (locale) {
    case "th":
      return `อ้างอิงเป็น: ${AUTHOR_APA} (${PUBLISHED_AT_YEAR}). ${title}. slic.nonarkara.org`;
    case "zh":
      return `建议引用：${AUTHOR_APA} (${PUBLISHED_AT_YEAR}). ${title}. slic.nonarkara.org`;
    case "ko":
      return `인용 형식: ${AUTHOR_APA} (${PUBLISHED_AT_YEAR}). ${title}. slic.nonarkara.org`;
    case "ja":
      return `引用形式：${AUTHOR_APA} (${PUBLISHED_AT_YEAR}). ${title}. slic.nonarkara.org`;
    default:
      return `Cite as: ${AUTHOR_APA} (${PUBLISHED_AT_YEAR}). ${title}. slic.nonarkara.org`;
  }
}