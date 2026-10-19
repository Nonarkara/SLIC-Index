/**
 * Presentation-integrity invariants.
 *
 * The bundle is the audited artifact, but the reader only ever sees what the UI
 * renders from it. These pin the two places where that translation could lie:
 * an out-of-vocabulary field value rendering as a real one, and the site making
 * a factual claim about its own deployed behaviour.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import publishedData from "../src/data/publishedRankingData.json" with { type: "json" };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const css = read("src/styles.css");
const scorecard = read("src/CityScorecardPage.tsx");

/** Modifiers the stylesheet actually defines for the coverage-grade badge. */
const definedGradeClasses = new Set(
  [...css.matchAll(/\.scorecard-grade--([a-z0-9_-]+)\s*[,{]/g)].map((m) => m[1]),
);

/** What the scorecard is willing to put on screen as a coverage grade. */
const UI_GRADE_VOCAB = new Set(["a", "b", "c", "exercise"]);

/* ── an unstyled badge is a visible defect, whatever the data says ── */

test("every coverage grade the UI can render has a stylesheet rule", () => {
  const missing = [];
  for (const city of publishedData.cities) {
    if (city.publicationStatus === "exercise") continue;
    const grade = String(city.coverageGrade ?? "").toLowerCase();
    if (!grade) continue;
    if (!UI_GRADE_VOCAB.has(grade)) continue; // withheld by the component
    if (!definedGradeClasses.has(grade)) {
      missing.push(`${city.cityId} -> .scorecard-grade--${grade}`);
    }
  }
  assert.deepEqual(missing, [], "grades render with no matching CSS rule");
});

test("the scorecard gates the grade on a closed vocabulary", () => {
  // tw-taichung ships coverageGrade "Watchlist" — a ranking status in a coverage
  // field. It must never reach the reader as a coverage grade.
  assert.match(
    scorecard,
    /COVERAGE_GRADES\s*=\s*new Set\(\["A",\s*"B",\s*"C"\]\)/,
    "the scorecard should gate coverageGrade on a closed A/B/C vocabulary",
  );
  assert.match(
    scorecard,
    /const coverageGrade = COVERAGE_GRADES\.has/,
    "the scorecard should derive a safe grade before rendering",
  );
  // and it must not interpolate the raw field into a class name any more
  assert.doesNotMatch(
    scorecard,
    /scorecard-grade--\$\{city\.coverageGrade/,
    "the raw coverageGrade is still interpolated into a class name",
  );
});

test("the withheld grade is a real case in the published bundle", () => {
  // If the producer ever fixes the field, this test should fail so the guard
  // above can be revisited rather than left as dead defensive code.
  const outOfVocabulary = publishedData.cities.filter(
    (c) => c.publicationStatus !== "exercise" && !UI_GRADE_VOCAB.has(String(c.coverageGrade ?? "").toLowerCase()),
  );
  assert.ok(
    outOfVocabulary.length > 0,
    "no out-of-vocabulary coverageGrade remains — revisit the scorecard guard",
  );
});

/* ── the site must not assert something about its own deployment ── */

test("the visitor-count claim matches how the count is actually gated", () => {
  const awards = read("src/AwardsPage.tsx");
  const tracking = read("src/firstPartyTraffic.ts");

  // Production now uses a first-party endpoint; an unavailable read stays null.
  assert.match(
    tracking,
    /count:\s*stats\?\.count\s*\?\?\s*null/,
    "an unavailable first-party count must stay null",
  );
  // The homepage only paints it when the value arrived.
  assert.match(
    read("src/HomePage.tsx"),
    /visitors\s*!=\s*null\s*&&/,
    "the homepage should render the count conditionally",
  );

  assert.match(read('src/HomePage.tsx'), /from "\.\/firstPartyTraffic"/);
  assert.doesNotMatch(
    awards,
    /Live visitor count appears on the homepage;|จำนวนผู้เข้าชมแบบสดแสดงบนหน้าแรก/,
    "the awards page asserts the count is live, but the endpoint is unset",
  );
});

test("the awards reach claim distinguishes sessions and historical records in all five locales", () => {
  const awards = read("src/AwardsPage.tsx");
  // Anchor on the placeholder that follows the "Visitor reach" label and parse
  // that one t() call. Slicing from a label string starts mid-quote and shifts
  // the pairing, which silently drops a locale.
  const labelAt = awards.indexOf('"Visitor reach"');
  assert.ok(labelAt > -1, "could not find the Visitor reach block");
  const placeholderAt = awards.indexOf("placeholder: t(", labelAt);
  assert.ok(placeholderAt > -1, "could not find the visitor placeholder");
  const call = awards.slice(placeholderAt, placeholderAt + 3000);
  // Take the first five quoted strings: t(locale, en, th, zh, ko, ja).
  // Slicing to a `),\n` terminator is brittle because the closing paren sits at
  // whatever indentation the surrounding block happens to use.
  const args = [...call.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1])
    .slice(0, 5);

  assert.equal(args.length, 5, `expected five locale variants, found ${args.length}`);
  const session = /sessions|เซสชัน|会话|세션|セッション/;
  const historical = /historical|ย้อนหลัง|历史|과거|過去/;
  for (const [i, line] of args.entries()) {
    assert.ok(
      session.test(line) && historical.test(line) && line.includes('/traffic'),
      `locale ${i} does not distinguish the two reach measures: ${line.slice(0, 60)}…`,
    );
    assert.ok(
      /not unique|ไม่ใช่บุคคล|不是独立|고유 인원 수가 아니|実人数ではなく/.test(line),
      `locale ${i} must not imply unique people: ${line.slice(0, 60)}…`,
    );
  }
});
