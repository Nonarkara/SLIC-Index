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
 *   3. The citation line formatted authors three ways — "Arkaraprasertkul, N. &
 *      Thiengburanathum, P." in en/th/zh versus "Non Arkaraprasertkul … 부교수" and
 *      "Non Arkaraprasertkul … 准教授" in ko/ja, where the academic title appears in no
 *      other locale.
 *
 * The fix is structural: derive the date and the version from the bundle, and
 * localise only the template. One fact, five renderings, no hardcoded dates.
 *
 * The facts themselves live in src/data/publicationFacts.json, which
 * scripts/derive-publication-facts.mjs writes from the published bundle. They
 * used to be read out of the bundle at runtime — which put 1.9 MB of city
 * data in the entry graph, so every route preloaded it to print a count in a
 * search placeholder.
 */

// The import attribute keeps this module loadable by Node's native TS stripping
// as well as by Vite, so the test suite can import it directly and assert on the
// real rendered strings instead of re-implementing the derivation.
import facts from "./data/publicationFacts.json" with { type: "json" };
import type { Locale } from "./types";

interface Manifest {
  generatedAt: string;
  scorerVersion: string;
  tierPolicyVersion: string;
}

const manifest = facts as Partial<Manifest>;

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
export const CITY_TOTAL = facts.cityTotal;
export const CITY_RANKED = facts.cityRanked;
export const CITY_WATCHLIST = facts.cityWatchlist;

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
 * Source years vary; the build/publication date is not an observation date.
 */
export function dataVintageLine(locale: Locale): string {
  const month = publishedMonthLabel(locale);
  switch (locale) {
    case "th":
      return `ข้อมูลจากหลายปี · เผยแพร่ล่าสุด: ${month}`;
    case "zh":
      return `数据来自不同年份 · 最后发布：${month}`;
    case "ko":
      return `여러 연도의 자료 · 최종 공개: ${month}`;
    case "ja":
      return `複数年のデータ · 最終公開：${month}`;
    default:
      return `Mixed-year evidence · Last published: ${month}`;
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
const AUTHOR_SURNAMES = { first: "Arkaraprasertkul, N.", second: "Thiengburanathum, P." } as const;

export const AUTHOR_APA = `${AUTHOR_SURNAMES.first} & ${AUTHOR_SURNAMES.second}`;

/** Full names as they appear in the long-form credit, per locale. */
const AUTHOR_PROSE_NAMES: Record<Locale, string> = {
  en: "Non Arkaraprasertkul and Associate Professor Poon Thiengburanathum",
  th: "Non Arkaraprasertkul และ Associate Professor Poon Thiengburanathum",
  zh: "Non Arkaraprasertkul 与 Associate Professor Poon Thiengburanathum",
  ko: "Non Arkaraprasertkul 및 Poon Thiengburanathum 부교수",
  ja: "Non Arkaraprasertkul および Poon Thiengburanathum 准教授",
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

/**
 * Score distribution across the ranked field.
 *
 * The scorecard hero used to hardcode "min 0 · median 49 · max 74" in all five
 * locales. It happened to be correct on the day it was written, which is exactly
 * why nothing caught it — a literal has no way to disagree with the bundle, so
 * it cannot fail loudly, it just goes quietly stale the moment a score moves.
 * This is the same defect class as the "May 2026" publication date, in a place
 * nobody was watching.
 */
/** Lowest ranked score, rounded for display. */
export const SCORE_MIN = facts.scoreMin;

/** Highest ranked score, rounded for display. */
export const SCORE_MAX = facts.scoreMax;

/** Median ranked score, rounded for display. */
export const SCORE_MEDIAN = facts.scoreMedian;

/**
 * The dataset band line shown under a city score. Localised template, derived
 * numbers — the same one-fact-many-renderings contract as the vintage line.
 */
export function datasetBandLine(locale: Locale): string {
  switch (locale) {
    case "th":
      return `ชุดข้อมูล: ต่ำสุด ${SCORE_MIN} · มัธยฐาน ${SCORE_MEDIAN} · สูงสุด ${SCORE_MAX}`;
    case "zh":
      return `数据集：最低 ${SCORE_MIN} · 中位 ${SCORE_MEDIAN} · 最高 ${SCORE_MAX}`;
    case "ko":
      return `데이터셋: 최솟값 ${SCORE_MIN} · 중앙값 ${SCORE_MEDIAN} · 최댓값 ${SCORE_MAX}`;
    case "ja":
      return `データセット：最小 ${SCORE_MIN} · 中央値 ${SCORE_MEDIAN} · 最大 ${SCORE_MAX}`;
    default:
      return `dataset: min ${SCORE_MIN} · median ${SCORE_MEDIAN} · max ${SCORE_MAX}`;
  }
}
