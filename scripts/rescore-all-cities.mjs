/**
 * rescore-all-cities.mjs
 *
 * Implements the SLIC methodology as documented in the methodology paper:
 *
 *   1. Piecewise/winsorized normalization using frozen normStats (p05/p95)
 *   2. Composite metric aggregation for multi-input metrics
 *   3. Weighted-mean aggregation within each pillar, with metric weights
 *      from the engine's PILLAR_METRICS (each pillar sums to its public
 *      weight: 25/22/18/15/20).
 *   4. AMPI aggregation across the five pillars to produce the overall SLIC
 *      score:
 *        μ      = weighted mean of pillar scores (with weights 25/22/18/15/20)
 *        σ²     = weighted variance
 *        AMPI   = μ − σ²/μ
 *      Penalizes cross-pillar imbalance so a city cannot compensate for a
 *      catastrophic pillar with excellence in another — which is the single
 *      distinctive claim SLIC makes vs. other indices. Applied at the pillar
 *      combination level (where n=5 always) rather than within pillars
 *      (where missing metrics would make variance unstable).
 *   5. Coverage penalty: Grade A (≥75%) none, Grade B (50–75%) −5, Grade C
 *      (35–50%) −15, below 35% → Watchlist (not ranked).
 *
 * Reads and writes src/data/publishedRankingData.json in place. Idempotent.
 *
 * Run:  node scripts/rescore-all-cities.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "src/data/publishedRankingData.json");

// ── Metric structure (mirrors slicScoringEngine.ts) ──────────────────────────
// [metricKey, pillar, weight, inputKey | null, kind, components?]

// Weights within each pillar sum exactly to that pillar's public weight.
// This mirrors src/slicScoringEngine.ts PILLAR_METRICS exactly (where only
// the metrics listed below are included in the published score; others
// present in the JSON data — birth rate, climate, economic-growth momentum —
// are carried for reference but not part of the aggregate).
const METRIC_DEFS = [
  // ── Pressure (sum = 25) ────────────────────────────────────────────────────
  ["pressure_disposable_income_ppp",      "pressure",  9, "di_ppp_raw",                     "direct"],
  ["pressure_housing_burden",             "pressure",  5, "housing_burden_raw",             "direct"],
  ["pressure_household_debt_burden",      "pressure",  4, "household_debt_effective_raw",   "direct"],
  ["pressure_working_time_pressure",      "pressure",  4, "working_time_pressure_raw",      "direct"],
  ["pressure_suicide_mental_strain",      "pressure",  3, "suicide_mental_strain_raw",      "direct"],

  // ── Viability (sum = 22) ───────────────────────────────────────────────────
  ["viability_personal_safety",           "viability", 5, "personal_safety_raw",            "direct"],
  ["viability_transit_access_commute",    "viability", 5, "transit_access_commute_raw",     "direct"],
  ["viability_clean_air",                 "viability", 4, "clean_air_raw",                  "direct"],
  ["viability_water_sanitation_utility",  "viability", 4, "water_sanitation_utility_raw",   "direct"],
  ["viability_digital_infrastructure",    "viability", 4, "digital_infrastructure_raw",     "direct"],

  // ── Capability (sum = 18) ──────────────────────────────────────────────────
  ["capability_healthcare_quality",       "capability",8, "healthcare_quality_raw",         "direct"],
  ["capability_education_quality",        "capability",6, "education_quality_raw",          "direct"],
  ["capability_equal_opportunity_distributional_fairness", "capability", 4, null, "composite",
    [["equal_opportunity_raw", 0.7], ["gini_coefficient_context", 0.3]]],

  // ── Community (sum = 15) ───────────────────────────────────────────────────
  ["community_hospitality_belonging",                     "community", 5, "hospitality_belonging_raw", "direct"],
  ["community_tolerance_pluralism",                       "community", 5, null, "composite",
    [["inclusion_equaldex_country_raw", 0.4], ["inclusion_freedom_house_country_raw", 0.3], ["inclusion_hate_crime_raw", 0.3]]],
  ["community_cultural_historic_public_life_vitality",    "community", 5, "cultural_public_life_raw",  "direct"],

  // ── Creative (sum = 20) ────────────────────────────────────────────────────
  ["creative_entrepreneurial_dynamism",       "creative", 6, "entrepreneurial_dynamism_raw",       "direct"],
  ["creative_innovation_research_intensity",  "creative", 5, "innovation_research_intensity_raw",  "direct"],
  ["creative_economic_vitality_productive_context", "creative", 5, null, "composite",
    [["investment_signal_raw", 0.5], ["gdp_per_capita_ppp_context", 0.3], ["gdp_growth_context", 0.2]]],
  ["creative_administrative_investment_friction", "creative", 4, "administrative_investment_friction_raw", "direct"],
];

const PILLAR_WEIGHTS = {
  pressure:   25,
  viability:  22,
  capability: 18,
  community:  15,
  creative:   20,
};

const PILLAR_ORDER = ["pressure", "viability", "capability", "community", "creative"];

// ── Core math ────────────────────────────────────────────────────────────────

/** Percentile-winsorized normalization to 0–100. */
function normalize(value, p05, p95, dir) {
  if (value == null || p05 == null || p95 == null || p95 === p05) return null;
  const clamped = Math.min(Math.max(value, p05), p95);
  const raw = dir === "positive"
    ? (100 * (clamped - p05)) / (p95 - p05)
    : (100 * (p95 - clamped)) / (p95 - p05);
  return Math.max(0, Math.min(100, raw));
}

/**
 * AMPI — Adjusted Mazziotta–Pareto Index.
 * entries: array of { score: number, weight: number } (non-null scores only).
 * Returns AMPI value or null if insufficient data.
 *
 *   μ    = Σ(w·s) / Σw            weighted mean
 *   σ²   = Σ(w·(s−μ)²) / Σw       weighted variance (population form)
 *   AMPI = μ − σ²/μ
 *
 * Special cases:
 *   - μ = 0 → returns 0 (nothing to penalize; nothing to reward)
 *   - n < 2 → return μ (need ≥2 metrics to have variance)
 *   - AMPI clamped to [0, 100]
 */
function ampi(entries) {
  const valid = entries.filter((e) => e.score != null && e.weight > 0);
  if (valid.length === 0) return null;

  const totalW = valid.reduce((s, e) => s + e.weight, 0);
  if (totalW === 0) return null;

  const mu = valid.reduce((s, e) => s + e.score * e.weight, 0) / totalW;
  if (valid.length < 2 || mu === 0) return Math.max(0, Math.min(100, mu));

  const variance = valid.reduce((s, e) => s + e.weight * (e.score - mu) ** 2, 0) / totalW;
  const penalty = variance / mu;
  const val = mu - penalty;
  return Math.max(0, Math.min(100, val));
}

/** Round to one decimal. */
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
/** Round to two decimals. */
const r2 = (v) => (v == null ? null : Math.round(v * 100) / 100);

// ── Scoring a single city ────────────────────────────────────────────────────

function scoreCity(rawInputs, normStats) {
  const metricScores = {}; // metricKey -> { score, coverage, componentScores? }

  for (const def of METRIC_DEFS) {
    const [metricKey, , weight, inputKey, kind, components] = def;

    if (kind === "direct") {
      const raw = rawInputs[inputKey];
      const stat = normStats[inputKey];
      const score = normalize(raw, stat?.p05, stat?.p95, stat?.dir);
      metricScores[metricKey] = {
        score,
        coverage: score != null ? 1.0 : 0,
        weight,
      };
    } else if (kind === "composite") {
      // Weighted mean of normalized component scores
      let num = 0, den = 0;
      const compScores = {};
      for (const [subKey, cw] of components) {
        const raw = rawInputs[subKey];
        const stat = normStats[subKey];
        const s = normalize(raw, stat?.p05, stat?.p95, stat?.dir);
        compScores[subKey] = s;
        if (s != null) {
          num += s * cw;
          den += cw;
        }
      }
      const totalCw = components.reduce((s, [, cw]) => s + cw, 0);
      metricScores[metricKey] = {
        score: den > 0 ? num / den : null,
        coverage: totalCw > 0 ? den / totalCw : 0,
        weight,
        componentScores: compScores,
      };
    }
  }

  // ── Pillar-level aggregation: weighted mean of metric scores ───────────────
  const pillarScores = {};
  const pillarCoverage = {};

  for (const pillar of PILLAR_ORDER) {
    const metrics = METRIC_DEFS.filter(([, p]) => p === pillar);
    let num = 0, den = 0;
    for (const [key, , weight] of metrics) {
      const score = metricScores[key]?.score;
      if (score != null) {
        num += score * weight;
        den += weight;
      }
    }

    const totalW = metrics.reduce((s, [, , w]) => s + w, 0);
    const covW = metrics.reduce((s, [key, , w]) => s + (metricScores[key]?.coverage ?? 0) * w, 0);

    pillarScores[pillar] = den > 0 ? num / den : null;
    pillarCoverage[pillar] = totalW > 0 ? covW / totalW : 0;
  }

  // ── Overall SLIC: AMPI across pillars ──────────────────────────────────────
  const slicEntries = PILLAR_ORDER
    .map((p) => ({ score: pillarScores[p], weight: PILLAR_WEIGHTS[p] }))
    .filter((e) => e.score != null);

  const slicBase = ampi(slicEntries);

  // ── Overall coverage: weighted average of pillar coverage ──────────────────
  const totalPillarW = Object.values(PILLAR_WEIGHTS).reduce((s, w) => s + w, 0);
  const weightedCov = PILLAR_ORDER.reduce(
    (s, p) => s + pillarCoverage[p] * PILLAR_WEIGHTS[p],
    0,
  ) / totalPillarW;

  // ── Coverage grade + penalty ───────────────────────────────────────────────
  let coverageGrade, penalty, rankingStatus;
  if (weightedCov >= 0.75) {
    coverageGrade = "A"; penalty = 0;    rankingStatus = "Ranked";
  } else if (weightedCov >= 0.5) {
    coverageGrade = "B"; penalty = 5;    rankingStatus = "Ranked";
  } else if (weightedCov >= 0.35) {
    coverageGrade = "C"; penalty = 15;   rankingStatus = "Ranked";
  } else {
    coverageGrade = "Watchlist"; penalty = 0; rankingStatus = "Watchlist";
  }

  const slicScore = slicBase != null ? Math.max(0, slicBase - penalty) : null;

  // ── Per-pillar penalised score (used for display) ─────────────────────────
  // Coverage grade is overall; individual pillars show raw AMPI without
  // re-penalising (that would double-count). This matches the paper's
  // description: "penalty applied after AMPI at the overall level".
  //
  // However the existing JSON exposes pillarScore as the pillar-level number.
  // Keep pillar scores at their un-penalised AMPI value; the coverage grade
  // at the city level tells the reader how much confidence to assign.

  return {
    metricScores,
    pillarScores,
    pillarCoverage,
    slicScore,
    overallCoverage: weightedCov,
    coverageGrade,
    rankingStatus,
    penalty,
  };
}

// ── Extract raw inputs from a city record ────────────────────────────────────

function extractRawInputs(city) {
  const raw = {};
  for (const [, metric] of Object.entries(city.metrics ?? {})) {
    // For composite metrics, components carry the raw values
    if (metric.components) {
      for (const comp of metric.components) {
        if (comp.raw != null) raw[comp.key] = comp.raw;
      }
    }
  }
  // Direct metrics: raw value sits on the metric entry keyed by its input
  for (const def of METRIC_DEFS) {
    const [metricKey, , , inputKey, kind] = def;
    if (kind !== "direct") continue;
    const m = city.metrics?.[metricKey];
    if (m && m.raw != null) raw[inputKey] = m.raw;
  }
  return raw;
}

// ── Rescore all cities ───────────────────────────────────────────────────────

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const normStats = data.normStats;

  let changes = 0;
  for (const city of data.cities) {
    const rawInputs = extractRawInputs(city);
    const scored = scoreCity(rawInputs, normStats);

    // Update metric-level scores (and component scores)
    for (const def of METRIC_DEFS) {
      const [metricKey, , , , kind] = def;
      const ms = scored.metricScores[metricKey];
      if (!city.metrics[metricKey]) continue;

      const m = city.metrics[metricKey];
      if (kind === "direct") {
        m.score = r1(ms.score);
      } else if (kind === "composite") {
        m.score = r1(ms.score);
        if (m.components && ms.componentScores) {
          for (const comp of m.components) {
            const newScore = ms.componentScores[comp.key];
            comp.score = r1(newScore);
          }
        }
      }
    }

    const oldSlic = city.slicScore;
    const newSlic = r1(scored.slicScore);

    city.pressureScore   = r1(scored.pillarScores.pressure);
    city.viabilityScore  = r1(scored.pillarScores.viability);
    city.capabilityScore = r1(scored.pillarScores.capability);
    city.communityScore  = r1(scored.pillarScores.community);
    city.creativeScore   = r1(scored.pillarScores.creative);

    city.pressureCoverage   = r2(scored.pillarCoverage.pressure);
    city.viabilityCoverage  = r2(scored.pillarCoverage.viability);
    city.capabilityCoverage = r2(scored.pillarCoverage.capability);
    city.communityCoverage  = r2(scored.pillarCoverage.community);
    city.creativeCoverage   = r2(scored.pillarCoverage.creative);

    city.overallWeightedCoverage = r2(scored.overallCoverage);
    city.coverageGrade = scored.coverageGrade;
    city.slicScore = newSlic;
    // If the city carries a manual `watchlistReason` (e.g. active conflict
    // zone), preserve Watchlist status regardless of coverage grade. Coverage
    // is about data completeness; the watchlist is about liveability honesty.
    if (city.watchlistReason) {
      city.rankingStatus = "Watchlist";
    } else {
      city.rankingStatus = scored.rankingStatus;
    }

    // Update highlights (strongest / weakest metric by score)
    const scoredMetrics = Object.entries(scored.metricScores)
      .filter(([, v]) => v.score != null)
      .map(([k, v]) => [k, v.score]);
    if (scoredMetrics.length > 0) {
      scoredMetrics.sort((a, b) => b[1] - a[1]);
      city.highlights = {
        strongest: scoredMetrics[0][0],
        weakest: scoredMetrics[scoredMetrics.length - 1][0],
      };
    }

    if (oldSlic !== newSlic) changes++;
  }

  // ── Re-rank all Ranked cities by new SLIC score, then enforce the ─────────
  //    one-per-country-per-10-bucket rule (Taiwan exempt). A city's rank is
  //    its position in the concatenated-buckets order, so tier labels stay
  //    rank-driven downstream. Within each bucket cities appear in
  //    slicScore-desc order (the greedy algorithm below preserves that).
  const ranked = data.cities
    .filter((c) => c.rankingStatus === "Ranked" && c.slicScore != null)
    .sort((a, b) => b.slicScore - a.slicScore);

  // V3.2 rule: one-per-CONTINENT per tier (Taiwan exempt — semi-territorial).
  // Collapse the 10 region labels into ~7 continent buckets so that each tier
  // reads as genuinely globally diverse, not "Europe x5 + N. America x3".
  const BUCKET_CAP = 10;
  const TAIWAN = "Taiwan";
  const CONTINENT_BY_REGION = {
    "North America":                          "North America",
    "Latin America":                          "Latin America",
    "Western, Northern, and Southern Europe": "Europe",
    "Southern/Eastern Europe and Eurasia":    "Europe",
    "East Asia":                              "Asia",
    "Southeast Asia":                         "Asia",
    "South Asia":                             "Asia",
    "Middle East":                            "Middle East",
    "Oceania":                                "Oceania",
    "Africa":                                 "Africa",
  };
  const continentOf = (c) => CONTINENT_BY_REGION[c.region] || c.region || "Other";

  const buckets = [];
  for (const city of ranked) {
    const cityContinent = continentOf(city);
    let placed = false;
    for (const b of buckets) {
      if (b.length >= BUCKET_CAP) continue;
      if (city.country !== TAIWAN) {
        const continentPresent = b.some(
          (c) => c.country !== TAIWAN && continentOf(c) === cityContinent,
        );
        if (continentPresent) continue;
      }
      b.push(city);
      placed = true;
      break;
    }
    if (!placed) buckets.push([city]);
  }

  // Flatten buckets into a single ordered list; rank = 1-based position.
  let pos = 0;
  for (const b of buckets) {
    for (const c of b) {
      pos++;
      c.rank = pos;
    }
  }

  // Watchlist cities: no rank
  data.cities.filter((c) => c.rankingStatus !== "Ranked").forEach((c) => { c.rank = 0; });

  data.updatedAt = new Date().toISOString();

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`Rescored ${data.cities.length} cities under AMPI aggregation.`);
  console.log(`Score changes: ${changes}/${data.cities.length} cities (cities whose slicScore changed).`);
  console.log(`Ranked: ${ranked.length}  |  Watchlist: ${data.cities.length - ranked.length}`);
  const displayRanked = [...ranked].sort((a, b) => a.rank - b.rank);
  console.log("\nTop 30 under AMPI + one-per-country tier rule:");
  displayRanked.slice(0, 30).forEach((c) => console.log(
    `  #${String(c.rank).padStart(3)}  ${c.displayName.padEnd(16)} ${c.country.padEnd(18)} ` +
    `SLIC ${c.slicScore.toFixed(1).padStart(5)}  ` +
    `G=${c.pressureScore?.toFixed(1).padStart(5)} ` +
    `V=${c.viabilityScore?.toFixed(1).padStart(5)} ` +
    `Cap=${c.capabilityScore?.toFixed(1).padStart(5)} ` +
    `Com=${c.communityScore?.toFixed(1).padStart(5)} ` +
    `Cr=${c.creativeScore?.toFixed(1).padStart(5)}  grade ${c.coverageGrade}`
  ));
  console.log("\nKey reference cities:");
  for (const name of ["New York", "London", "Tokyo", "Singapore", "Paris", "Zurich", "Auckland", "Sydney"]) {
    const c = data.cities.find((x) => x.displayName === name);
    if (c) console.log(
      `  #${String(c.rank).padStart(3)}  ${name.padEnd(14)}  SLIC ${c.slicScore?.toFixed(1).padStart(5)}  ` +
      `G=${c.pressureScore?.toFixed(1)} V=${c.viabilityScore?.toFixed(1)} ` +
      `Cap=${c.capabilityScore?.toFixed(1)} Com=${c.communityScore?.toFixed(1)} Cr=${c.creativeScore?.toFixed(1)}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
