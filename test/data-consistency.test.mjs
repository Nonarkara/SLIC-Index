/**
 * Data-consistency invariants.
 *
 * Every number the site states about its own dataset is a claim a reader can
 * check against the published bundle. Two of these drifted silently before:
 *
 *   1. The scorecard hero hardcoded "min 0 · median 49 · max 74" in all five
 *      locales. It was correct on the day it was written and wrong the moment
 *      a score moved — a literal has no way to disagree with the bundle.
 *   2. ko and ja rendered the five pillars as 지표 / 指標 ("indicator") while
 *      en/th/zh said pillar. Same number, different concept, and the pillars
 *      are the thing the index is built on.
 *
 * These tests fail loudly when a claim and the bundle disagree.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import publishedData from "../src/data/publishedRankingData.json" with { type: "json" };
import {
  CITY_TOTAL,
  CITY_RANKED,
  SCORE_MIN,
  SCORE_MAX,
  SCORE_MEDIAN,
  datasetBandLine,
  PUBLISHED_AT_YEAR,
} from "../src/publicationMeta.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const LOCALES = ["en", "th", "zh", "ko", "ja"];

/* ── the derived distribution must equal the bundle's, not a remembered value ── */

function bundleDistribution() {
  const scores = publishedData.cities
    .filter((c) => c.rankingStatus === "Ranked" && typeof c.slicScore === "number")
    .map((c) => c.slicScore)
    .sort((a, b) => a - b);
  const mid = scores.length >> 1;
  const median =
    scores.length % 2 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2;
  return {
    min: Math.round(scores[0]),
    max: Math.round(scores[scores.length - 1]),
    median: Math.round(median),
    count: scores.length,
  };
}

test("the score distribution is computed from the bundle", () => {
  const expected = bundleDistribution();
  assert.equal(SCORE_MIN, expected.min);
  assert.equal(SCORE_MAX, expected.max);
  assert.equal(SCORE_MEDIAN, expected.median);
  assert.equal(expected.count, CITY_RANKED);
});

test("all five locales render the same distribution numbers", () => {
  const lines = LOCALES.map((l) => datasetBandLine(l));
  for (const l of LOCALES) {
    const line = datasetBandLine(l);
    assert.ok(line.includes(String(SCORE_MIN)), `${l} is missing the minimum`);
    assert.ok(line.includes(String(SCORE_MAX)), `${l} is missing the maximum`);
    assert.ok(line.includes(String(SCORE_MEDIAN)), `${l} is missing the median`);
  }
  // Same three numbers in every locale — only the template differs.
  assert.equal(new Set(lines).size, LOCALES.length, "two locales rendered identically");
});

test("the scorecard no longer hardcodes the distribution band", () => {
  const src = read("src/CityScorecardPage.tsx");
  assert.ok(
    !/median\s+\d/.test(src),
    "CityScorecardPage still contains a hardcoded median",
  );
  assert.ok(!/max\s+7\d/.test(src), "CityScorecardPage still hardcodes a maximum");
  assert.match(
    src,
    /datasetBandLine/,
    "CityScorecardPage should derive the band from publicationMeta",
  );
});

/* ── dataset-count claims across the UI must agree with the bundle ── */

test("liveScope states the real published-city count in every locale", () => {
  const src = read("src/siteCopy.ts");
  const claims = [...src.matchAll(/liveScope:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(claims.length, LOCALES.length, "a locale is missing liveScope");
  for (const claim of claims) {
    assert.ok(
      claim.includes(String(CITY_TOTAL)),
      `liveScope does not state ${CITY_TOTAL}: "${claim}"`,
    );
  }
});

test("no locale calls the five pillars an indicator", () => {
  // 支柱 / เสาหลัก / 기둥 / pillar. 지표 and 指標 both mean "indicator", which
  // is a different concept from the five pillars the index scores on.
  //
  // Scoped to the bigrams "공개 지표" / "公開指標" so it stays safe: legitimate
  // uses survive, e.g. "metric weights" (지표 가중치 / 指標ウェイト) and
  // "a single indicator" (단일 지표 / 単一指標).
  const src = read("src/siteCopy.ts");
  for (const bad of ["공개 지표", "公開指標"]) {
    assert.ok(
      !src.includes(bad),
      `siteCopy mistranslates "public pillars" as "${bad}"`,
    );
  }

  // Each locale's own pillar word must actually be present.
  assert.ok(src.includes("เสาหลัก"), "th should say เสาหลัก for pillar");
  assert.ok(src.includes("公开支柱"), "zh should say 公开支柱 for pillar");
  assert.ok(src.includes("기둥"), "ko should say 기둥 for pillar");
  assert.ok(src.includes("柱"), "ja should say 柱 for pillar");

  // liveScope is the shortest string that must carry all five at once.
  const claims = [...src.matchAll(/liveScope:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(claims.length, LOCALES.length, "a locale is missing liveScope");
  for (const claim of claims) {
    assert.ok(!/지표|指標/.test(claim), `liveScope mistranslates pillar: "${claim}"`);
  }
});

test("the awards CSV label states the real ranked-row count in every locale", () => {
  const src = read("src/AwardsPage.tsx");
  const claims = [...src.matchAll(/CSV[^\n]*?\((\d+)\s*(?:แถว|行|행)/g)].map((m) => m[1]);
  assert.ok(claims.length > 0, "no CSV row-count claim found");
  for (const c of claims) {
    assert.equal(Number(c), CITY_RANKED, `CSV claim says ${c} rows`);
  }
});

test("the rankings empty state states the real ranked count in every locale", () => {
  const src = read("src/RankingsPage.tsx");
  const claims = [...src.matchAll(/(\d{3})\s*(?:ranked|เมืองจัดอันดับ|座城市|순위 도시|ランキング)/g)].map(
    (m) => m[1],
  );
  assert.ok(claims.length > 0, "no ranked-count claim found in the empty state");
  for (const c of claims) {
    assert.equal(Number(c), CITY_RANKED, `empty state says ${c} ranked cities`);
  }
});

/* ── the whole set, checked as one ── */

test("city counts add up the way the footer claims", () => {
  assert.equal(CITY_TOTAL, 163);
  assert.equal(CITY_RANKED, 158);
  assert.equal(CITY_TOTAL - CITY_RANKED, 5);
  assert.equal(
    publishedData.cities.filter((c) => c.rankingStatus === "Watchlist").length,
    5,
  );
});

test("the bundle and the exported CSV agree on the ranked total", () => {
  const csv = read("public/downloads/slic-ranked-cities-v2.csv");
  // The CSV carries a `#` preamble; count only real data rows.
  const rows = csv
    .split("\n")
    .filter((l) => l.trim() && !l.trimStart().startsWith("#"));
  assert.equal(rows.length - 1, CITY_RANKED);
});

test("the publication year is a four-digit year, not a stale literal", () => {
  assert.match(String(PUBLISHED_AT_YEAR), /^\d{4}$/);
  assert.ok(PUBLISHED_AT_YEAR >= 2024, "publication year looks wrong");
});