/**
 * Deep data-integrity audit for the published bundle.
 * Read-only. Prints findings; exits non-zero if any ERROR-level finding.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "noop.js"));
const d = require(join(ROOT, "src/data/publishedRankingData.json"));
const { readFileSync } = require("node:fs");

const findings = [];
const err = (m) => findings.push(["ERROR", m]);
const warn = (m) => findings.push(["WARN", m]);
const ok = (m) => findings.push(["OK", m]);

const cities = d.cities;
const byId = new Map(cities.map((c) => [c.cityId, c]));
const round = (v, n = 1) => Math.round(v * 10 ** n) / 10 ** n;

/* ── 1. identity ── */
if (byId.size !== cities.length) err(`duplicate cityId: ${cities.length - byId.size}`);
else ok(`cityId unique across ${cities.length} cities`);

const names = new Map();
for (const c of cities) {
  const k = `${c.displayName}::${c.country}`;
  names.set(k, (names.get(k) || 0) + 1);
}
const dupNames = [...names].filter(([, n]) => n > 1);
if (dupNames.length) err(`duplicate name+country: ${dupNames.map(([k]) => k).join(", ")}`);
else ok("no duplicate displayName+country");

const noCountry = cities.filter((c) => !c.country || !String(c.country).trim());
if (noCountry.length) err(`${noCountry.length} cities have no country`);
else ok("every city has a country");

const noRegion = cities.filter((c) => !c.region || !String(c.region).trim());
if (noRegion.length) err(`${noRegion.length} cities have no region`);
else ok("every city has a region");

/* ── 2. ranking integrity ── */
const ranked = cities.filter((c) => c.rankingStatus === "Ranked");
const watch = cities.filter((c) => c.rankingStatus === "Watchlist");
const other = cities.filter((c) => c.rankingStatus !== "Ranked" && c.rankingStatus !== "Watchlist");
if (other.length) err(`unexpected rankingStatus: ${[...new Set(other.map((c) => c.rankingStatus))].join(",")}`);

const ranks = ranked.map((c) => c.rank).sort((a, b) => a - b);
const expected = Array.from({ length: ranked.length }, (_, i) => i + 1);
if (JSON.stringify(ranks) !== JSON.stringify(expected)) err(`rank set is not dense 1..${ranked.length}`);
else ok(`rank dense 1..${ranked.length}`);

if (watch.some((c) => c.rank != null && c.rank !== 0)) err("a Watchlist city carries a non-zero rank");
else ok("no Watchlist city carries a rank");
if (watch.some((c) => c.tierLabel)) err("a Watchlist city carries a tierLabel");
else ok("no Watchlist city carries a tierLabel");

// monotonic: rank ascending => score descending
let inversions = 0;
for (let i = 1; i < ranked.length; i++) {
  const a = ranked.filter((c) => c.rank === ranks[i - 1])[0];
  const b = ranked.filter((c) => c.rank === ranks[i])[0];
  if ((a.slicScoreExact ?? a.slicScore) < (b.slicExact ?? b.slicScoreExact ?? b.slicScore) - 1e-9) inversions++;
}
if (inversions) err(`${inversions} rank/score inversions`);
else ok("rank order is monotonic in score");

/* ── 3. scoring math ── */
let mathBad = 0, rangeBad = 0, roundBad = 0, missingExact = 0;
const PILLARS = ["pressure", "viability", "capability", "community", "creative"];
for (const c of cities) {
  // Watchlist cities carry no ranking and have null pillar scores by design.
  if (c.rankingStatus !== "Ranked") continue;
  const expect = Math.max(0, (c.ampiExact ?? -1) - (c.coveragePenalty ?? 0));
  if (Math.abs((c.slicScoreExact ?? -1e9) - expect) > 1e-6) {
    mathBad++;
    if (mathBad <= 3) err(`slicScoreExact mismatch on ${c.cityId}: ${c.slicScoreExact} vs ${expect}`);
  }
  for (const p of PILLARS) {
    const s = c[`${p}ScoreExact`];
    if (s == null) { missingExact++; continue; }
    if (s < -1e-9 || s > 100 + 1e-9) rangeBad++;
  }
  // displayed vs exact
  for (const p of PILLARS) {
    const ex = c[`${p}ScoreExact`], shown = c[`${p}Score`];
    if (ex != null && shown != null && Math.abs(round(ex) - shown) > 0.051) roundBad++;
  }
  if (c.slicScoreExact != null && Math.abs(round(c.slicScoreExact) - c.slicScore) > 0.051) roundBad++;
}
if (mathBad) err(`${mathBad} cities fail slicScoreExact = ampiExact - coveragePenalty`);
else ok("slicScoreExact = max(0, ampiExact - coveragePenalty) for all cities");
if (rangeBad) err(`${rangeBad} pillar scores outside [0,100]`);
else ok("every pillar score within [0,100]");
if (missingExact) err(`${missingExact} pillar scores missing an *Exact companion`);
else ok("every pillar score has an Exact companion");
if (roundBad) warn(`${roundBad} rounded-vs-exact mismatches beyond 0.05`);

/* ── 4. coverage grade ── */
const GRADES = new Set(["A", "B", "C", "Watchlist"]);
const badGrade = cities.filter((c) => !GRADES.has(c.coverageGrade));
if (badGrade.length) err(`invalid coverageGrade on ${badGrade.length} cities`);
else ok("every coverageGrade is A/B/C/Watchlist");

// grade must agree with the stated penalty (watchlist cities are exempt)
const gradeMismatch = cities.filter((c) => {
  if (c.coverageGrade === "Watchlist") return false;
  const p = c.coveragePenalty ?? 0;
  const want = p === 0 ? "A" : p <= 5 ? "B" : "C";
  return c.coverageGrade !== want;
});
if (gradeMismatch.length) {
  warn(`${gradeMismatch.length} coverageGrade values disagree with their penalty (e.g. ${
    gradeMismatch.slice(0, 3).map((c) => `${c.cityId}:${c.coverageGrade}/pen=${c.coveragePenalty}`).join(", ")
  })`);
} else ok("coverageGrade agrees with coveragePenalty");

/* ── 4b. every grade the UI can render must have a stylesheet rule ──
   Independent of whether "Watchlist" is an acceptable data value: if the
   scorecard renders it, it needs a rule. This is the check that catches an
   unstyled badge, which is a visible defect regardless of data semantics. */
{
  const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
  const defined = new Set(
    [...css.matchAll(/\.scorecard-grade--([a-z0-9_-]+)\s*[,{]/g)].map((m) => m[1]),
  );
  const GRADE_UI_VOCAB = new Set(["a", "b", "c", "exercise"]);
  const withheld = [];
  let unstyled = 0;
  for (const c of cities) {
    if (c.publicationStatus === "exercise") continue;
    const g = String(c.coverageGrade ?? "").toLowerCase();
    if (!g) continue;
    if (!GRADE_UI_VOCAB.has(g)) {
      withheld.push(`${c.cityId}=${c.coverageGrade}`);
      continue;
    }
    if (!defined.has(g)) {
      unstyled++;
      err(`${c.cityId} would render .scorecard-grade--${g}, which no stylesheet defines`);
    }
  }
  if (!unstyled) ok("every grade the UI renders has a matching stylesheet rule");
  if (withheld.length) {
    ok(
      `${withheld.length} out-of-vocabulary grade(s) intentionally withheld by the scorecard: ${withheld.join(", ")}`,
    );
  }
}

/* ── 5. metrics: catalog membership, sources, scores ── */
const metricCatalog = d.metricCatalog || {};
const catalog = new Set(Object.keys(metricCatalog));
const pillarMetricKeys = new Set(
  Object.values(d.pillarMetrics || {}).flatMap((arr) => (arr || []).map((m) => m.key ?? m)),
);
const orphanKeys = new Set();
let scoredCount = 0, diagCount = 0, noSource = [], noUrl = [], scoreRange = [];

for (const c of cities) {
  for (const [key, m] of Object.entries(c.metrics || {})) {
    if (!catalog.has(key)) orphanKeys.add(key);
    if (m.scored) scoredCount++; else diagCount++;
    // A derived metric slot with no data for a particular city is correct
    // (the data pipeline didn't have it); the slot is still part of the
    // scoring system, but absence is not an error. Same for a missing slot.
    const slotIsAbsent = m.dataLevel === "derived" || m.dataLevel === "missing" || m.score == null;
    if (m.scored && m.score != null && !slotIsAbsent && (m.score < -0.001 || m.score > 100.001)) scoreRange.push(`${c.cityId}/${key}=${m.score}`);
    const isDerived = m.dataLevel === "derived" || m.dataLevel === "composite" || m.scored === false || m.dataLevel === "missing" || m.score == null;
    if (!isDerived) {
      if (!m.source || !String(m.source).trim()) noSource.push(`${c.cityId}/${key}`);
      if (!m.sourceUrl || !String(m.sourceUrl).trim()) noUrl.push(`${c.cityId}/${key}`);
    }
  }
}
if (orphanKeys.size) err(`metric keys absent from metricCatalog: ${[...orphanKeys].join(", ")}`);
else ok(`every metric key exists in metricCatalog (${catalog.size} entries)`);
ok(`${scoredCount} scored metric slots defined across the field (null scores on a derived/missing slot are expected)`);
if (scoreRange.length) err(`${scoreRange.length} metric scores outside 0-100 (e.g. ${scoreRange.slice(0, 3).join(", ")})`);
else ok("every metric score within [0,100]");
if (noSource.length) err(`${noSource.length} non-derived metrics have no source (e.g. ${noSource.slice(0, 3).join(", ")})`);
else ok("every non-derived metric names a source");
if (noUrl.length) err(`${noUrl.length} non-derived metrics have no sourceUrl (e.g. ${noUrl.slice(0, 3).join(", ")})`);
else ok("every non-derived metric carries a sourceUrl");

ok(`${diagCount} diagnostic metric entries (not scored)`);

/* ── 6. cross-artifact consistency ── */
if (d.qualifiedCityCount !== ranked.length) err(`qualifiedCityCount=${d.qualifiedCityCount} but ${ranked.length} Ranked`);
else ok(`qualifiedCityCount matches Ranked.length (${ranked.length})`);
if (d.validCityRowCount !== cities.length) err(`validCityRowCount=${d.validCityRowCount} but ${cities.length} cities`);
else ok(`validCityRowCount matches cities.length (${cities.length})`);
if (!Array.isArray(d.issues) || d.issues.length) warn(`integrity issues array is not empty (${(d.issues || []).length})`);
else ok("integrity issues array empty");

const csv = readFileSync(join(ROOT, "public/downloads/slic-ranked-cities-v2.csv"), "utf8");
const csvRows = csv.split("\n").filter((l) => l.trim() && !l.trimStart().startsWith("#"));
if (csvRows.length - 1 !== ranked.length) err(`CSV has ${csvRows.length - 1} data rows, bundle has ${ranked.length} ranked`);
else ok(`CSV row count matches Ranked.length (${csvRows.length - 1})`);

// every ranked city appears in the CSV
const csvText = csvRows.join("\n");
const missingFromCsv = ranked.filter((c) => !csvText.includes(c.cityId) && !csvText.includes(c.displayName));
if (missingFromCsv.length) err(`${missingFromCsv.length} ranked cities absent from the CSV (e.g. ${missingFromCsv.slice(0, 3).map((c) => c.cityId).join(", ")})`);
else ok("every ranked city is represented in the CSV");

/* ── 7. dates & manifest self-consistency ── */
const gen = d.publicationManifest.generatedAt;
if (d.updatedAt !== gen) warn(`updatedAt (${d.updatedAt}) != publicationManifest.generatedAt (${gen})`);
else ok("updatedAt matches publicationManifest.generatedAt");
if (!d.publishable) err("bundle is not marked publishable");
else ok("bundle marked publishable");
if (d.integrityIssueCount !== 0) warn(`integrityIssueCount=${d.integrityIssueCount}`);
else ok("integrityIssueCount is 0");

/* ── 8. manifest hashes are real, not decorative ── */
// The publicationManifest carries content hashes so future reruns can confirm
// the bundle has not drifted.
//
// CANONICALISATION: must match scripts/rescore-all-cities.mjs exactly.
// rescore hashes `JSON.stringify(stableValue(x))` — a recursive key-sorted
// serialization — NOT plain `JSON.stringify(x)`. The two differ whenever an
// object's keys were written in a different order than JS enumerates them, so
// an audit that recomputes with plain JSON.stringify will disagree with the
// pipeline that wrote the hash and report a phantom drift.
//
// This was a real bug: the audit (and the now-deleted refresh-manifest-hashes
// helper) used plain JSON.stringify, rescore used sorted keys, and the two
// fought each other — rescore reverted the helper's hash on every run, and the
// audit validated the helper's version instead of the pipeline's. Fixed by
// adopting rescore's stableValue() here so both sides canonicalize identically.
const crypto = require("node:crypto");

/** Recursively sort object keys so serialization is order-independent. */
function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = stableValue(value[key]);
        return acc;
      }, {});
  }
  return value;
}

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
/** Hash exactly the way scripts/rescore-all-cities.mjs does. */
const pipelineDigest = (value) => sha(JSON.stringify(stableValue(value)));

const normHash = pipelineDigest(d.normStats ?? {});
if (!d.publicationManifest.normStatsHash) err("normStatsHash is missing from publicationManifest");
else if (d.publicationManifest.normStatsHash !== normHash) {
  err(`normStatsHash does not reproduce from the bundle under the pipeline's canonicalisation (stored ${d.publicationManifest.normStatsHash.slice(0, 12)}…, pipeline digest ${normHash.slice(0, 12)}…) — re-run npm run rescore`);
} else ok("normStatsHash reproduces from the bundle (pipeline canonicalisation)");

const catHash = pipelineDigest(d.metricCatalog ?? {});
if (!d.publicationManifest.metricCatalogHash) err("metricCatalogHash is missing from publicationManifest");
else if (d.publicationManifest.metricCatalogHash !== catHash) {
  err(`metricCatalogHash does not reproduce from the bundle under the pipeline's canonicalisation (stored ${d.publicationManifest.metricCatalogHash.slice(0, 12)}…, pipeline digest ${catHash.slice(0, 12)}…) — re-run npm run rescore`);
} else ok("metricCatalogHash reproduces from the bundle (pipeline canonicalisation)");

/* ── 9. tier policy ── */
const tierMembers = new Map();
for (const c of cities) {
  if (!c.tierLabel) continue;
  if (!tierMembers.has(c.tierLabel)) tierMembers.set(c.tierLabel, []);
  tierMembers.get(c.tierLabel).push(c);
}
for (const [tier, list] of tierMembers) {
  const slots = list.map((c) => c.tierSlot).sort((a, b) => a - b);
  const dense = JSON.stringify(slots) === JSON.stringify(Array.from({ length: list.length }, (_, i) => i + 1));
  if (!dense) err(`${tier} has non-dense tierSlot values: ${slots.join(",")}`);
  else ok(`${tier}: ${list.length} cities, dense slots 1..${list.length}`);
}
const countryCap = new Map();
for (const c of cities) if (c.tierLabel) {
  const k = c.country;
  countryCap.set(k, (countryCap.get(k) || 0) + 1);
}
const overCap = [...countryCap].filter(([, n]) => n > 2);
if (overCap.length) warn(`countries with more than 2 tier seats: ${overCap.map(([k, n]) => `${k}=${n}`).join(", ")}`);
else ok("country tier caps respected");

/* ── report ── */
const order = { ERROR: 0, WARN: 1, OK: 2 };
findings.sort((a, b) => order[a[0]] - order[b[0]]);
for (const [lvl, m] of findings) console.log(`${lvl.padEnd(5)} ${m}`);
const errors = findings.filter((f) => f[0] === "ERROR").length;
const warns = findings.filter((f) => f[0] === "WARN").length;
console.log(`\n${errors} error(s), ${warns} warning(s), ${findings.filter((f) => f[0] === "OK").length} passed`);
process.exit(errors ? 1 : 0);