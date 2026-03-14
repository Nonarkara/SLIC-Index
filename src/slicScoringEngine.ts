/**
 * SLIC Scoring Engine — TypeScript port of verified_source_pipeline.py
 *
 * Pure functions for computing SLIC scores from raw city data.
 * Every score traces: SLIC → pillar → metric → normalized value → raw value.
 *
 * This engine is used by the Exercise page to recompute rankings with
 * user-customized pillar weights, and as the canonical client-side scorer.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Directionality = "positive" | "negative";

export type PillarId =
  | "pressure"
  | "viability"
  | "capability"
  | "community"
  | "creative";

export const PILLAR_ORDER: PillarId[] = [
  "pressure",
  "viability",
  "capability",
  "community",
  "creative",
];

/** Canonical pillar weights — sum to 100. */
export const CANONICAL_WEIGHTS: Record<PillarId, number> = {
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
};

export interface ScoreInput {
  sourceColumn: string;
  directionality: Directionality;
}

export interface DirectMetricSpec {
  type: "direct";
  inputKey: string;
  weight: number;
}

export interface CompositeMetricSpec {
  type: "composite";
  weight: number;
  components: [string, number][]; // [inputKey, componentWeight]
}

export type MetricSpec = DirectMetricSpec | CompositeMetricSpec;

export interface NormStats {
  p05: number | null;
  p95: number | null;
}

export interface CoverageThresholds {
  rankedMinOverall: number;
  rankedMinPillar: number;
  gradeAMin: number;
  gradeBMin: number;
  gradeCMin: number;
}

export type CoverageGrade = "A" | "B" | "C" | "Watchlist" | "";

export interface ScoredCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  pillarScores: Record<PillarId, number | null>;
  pillarCoverage: Record<PillarId, number | null>;
  slicScore: number | null;
  overallCoverage: number | null;
  coverageGrade: CoverageGrade;
  rankingStatus: "Ranked" | "Watchlist";
  rank: number | null;
}

// ---------------------------------------------------------------------------
// Constants — mirroring verified_source_pipeline.py exactly
// ---------------------------------------------------------------------------

export const SCORE_INPUTS: Record<string, ScoreInput> = {
  di_ppp_raw: { sourceColumn: "di_ppp_raw", directionality: "positive" },
  housing_burden_raw: { sourceColumn: "housing_burden_raw", directionality: "negative" },
  household_debt_effective_raw: { sourceColumn: "household_debt_effective_raw", directionality: "negative" },
  working_time_pressure_raw: { sourceColumn: "working_time_pressure_raw", directionality: "negative" },
  suicide_mental_strain_raw: { sourceColumn: "suicide_mental_strain_raw", directionality: "negative" },
  personal_safety_raw: { sourceColumn: "personal_safety_raw", directionality: "negative" },
  transit_access_commute_raw: { sourceColumn: "transit_access_commute_raw", directionality: "positive" },
  clean_air_raw: { sourceColumn: "clean_air_raw", directionality: "negative" },
  water_sanitation_utility_raw: { sourceColumn: "water_sanitation_utility_raw", directionality: "positive" },
  digital_infrastructure_raw: { sourceColumn: "digital_infrastructure_raw", directionality: "positive" },
  healthcare_quality_raw: { sourceColumn: "healthcare_quality_raw", directionality: "positive" },
  education_quality_raw: { sourceColumn: "education_quality_raw", directionality: "positive" },
  equal_opportunity_raw: { sourceColumn: "equal_opportunity_raw", directionality: "positive" },
  gini_coefficient_context: { sourceColumn: "gini_coefficient_context", directionality: "negative" },
  hospitality_belonging_raw: { sourceColumn: "hospitality_belonging_raw", directionality: "positive" },
  tolerance_pluralism_raw: { sourceColumn: "tolerance_pluralism_raw", directionality: "positive" },
  cultural_public_life_raw: { sourceColumn: "cultural_public_life_raw", directionality: "positive" },
  entrepreneurial_dynamism_raw: { sourceColumn: "entrepreneurial_dynamism_raw", directionality: "positive" },
  innovation_research_intensity_raw: { sourceColumn: "innovation_research_intensity_raw", directionality: "positive" },
  investment_signal_raw: { sourceColumn: "investment_signal_raw", directionality: "positive" },
  gdp_per_capita_ppp_context: { sourceColumn: "gdp_per_capita_ppp_context", directionality: "positive" },
  gdp_growth_context: { sourceColumn: "gdp_growth_context", directionality: "positive" },
  administrative_investment_friction_raw: { sourceColumn: "administrative_investment_friction_raw", directionality: "negative" },
};

export const METRIC_SPECS: Record<string, MetricSpec> = {
  pressure_disposable_income_ppp: { type: "direct", inputKey: "di_ppp_raw", weight: 9 },
  pressure_housing_burden: { type: "direct", inputKey: "housing_burden_raw", weight: 5 },
  pressure_household_debt_burden: { type: "direct", inputKey: "household_debt_effective_raw", weight: 4 },
  pressure_working_time_pressure: { type: "direct", inputKey: "working_time_pressure_raw", weight: 4 },
  pressure_suicide_mental_strain: { type: "direct", inputKey: "suicide_mental_strain_raw", weight: 3 },
  viability_personal_safety: { type: "direct", inputKey: "personal_safety_raw", weight: 5 },
  viability_transit_access_commute: { type: "direct", inputKey: "transit_access_commute_raw", weight: 5 },
  viability_clean_air: { type: "direct", inputKey: "clean_air_raw", weight: 4 },
  viability_water_sanitation_utility: { type: "direct", inputKey: "water_sanitation_utility_raw", weight: 4 },
  viability_digital_infrastructure: { type: "direct", inputKey: "digital_infrastructure_raw", weight: 4 },
  capability_healthcare_quality: { type: "direct", inputKey: "healthcare_quality_raw", weight: 8 },
  capability_education_quality: { type: "direct", inputKey: "education_quality_raw", weight: 6 },
  capability_equal_opportunity_distributional_fairness: {
    type: "composite",
    weight: 4,
    components: [
      ["equal_opportunity_raw", 0.7],
      ["gini_coefficient_context", 0.3],
    ],
  },
  community_hospitality_belonging: { type: "direct", inputKey: "hospitality_belonging_raw", weight: 5 },
  community_tolerance_pluralism: { type: "direct", inputKey: "tolerance_pluralism_raw", weight: 5 },
  community_cultural_historic_public_life_vitality: { type: "direct", inputKey: "cultural_public_life_raw", weight: 5 },
  creative_entrepreneurial_dynamism: { type: "direct", inputKey: "entrepreneurial_dynamism_raw", weight: 6 },
  creative_innovation_research_intensity: { type: "direct", inputKey: "innovation_research_intensity_raw", weight: 5 },
  creative_economic_vitality_productive_context: {
    type: "composite",
    weight: 5,
    components: [
      ["investment_signal_raw", 0.5],
      ["gdp_per_capita_ppp_context", 0.3],
      ["gdp_growth_context", 0.2],
    ],
  },
  creative_administrative_investment_friction: { type: "direct", inputKey: "administrative_investment_friction_raw", weight: 4 },
};

export const PILLAR_METRICS: Record<PillarId, [string, number][]> = {
  pressure: [
    ["pressure_disposable_income_ppp", 9],
    ["pressure_housing_burden", 5],
    ["pressure_household_debt_burden", 4],
    ["pressure_working_time_pressure", 4],
    ["pressure_suicide_mental_strain", 3],
  ],
  viability: [
    ["viability_personal_safety", 5],
    ["viability_transit_access_commute", 5],
    ["viability_clean_air", 4],
    ["viability_water_sanitation_utility", 4],
    ["viability_digital_infrastructure", 4],
  ],
  capability: [
    ["capability_healthcare_quality", 8],
    ["capability_education_quality", 6],
    ["capability_equal_opportunity_distributional_fairness", 4],
  ],
  community: [
    ["community_hospitality_belonging", 5],
    ["community_tolerance_pluralism", 5],
    ["community_cultural_historic_public_life_vitality", 5],
  ],
  creative: [
    ["creative_entrepreneurial_dynamism", 6],
    ["creative_innovation_research_intensity", 5],
    ["creative_economic_vitality_productive_context", 5],
    ["creative_administrative_investment_friction", 4],
  ],
};

export const COVERAGE_THRESHOLDS: CoverageThresholds = {
  rankedMinOverall: 0.5,
  rankedMinPillar: 0.35,
  gradeAMin: 0.75,
  gradeBMin: 0.5,
  gradeCMin: 0.35,
};

// ---------------------------------------------------------------------------
// Core scoring functions
// ---------------------------------------------------------------------------

/**
 * Percentile calculation using Excel PERCENTILE.INC method.
 * Returns null if fewer than 2 values.
 */
export function percentileInc(values: number[], percentile: number): number | null {
  if (values.length < 2) return null;
  const ordered = [...values].sort((a, b) => a - b);
  const index = (ordered.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.min(lower + 1, ordered.length - 1);
  const weight = index - lower;
  return ordered[lower] + (ordered[upper] - ordered[lower]) * weight;
}

/**
 * Normalize a raw value to 0-100 using p05/p95 windsorization.
 * Mirrors verified_source_pipeline.py normalize_value exactly.
 */
export function normalizeValue(
  value: number | null,
  p05: number | null,
  p95: number | null,
  directionality: Directionality,
): number | null {
  if (value == null || p05 == null || p95 == null || p95 === p05) return null;
  const clamped = Math.min(Math.max(value, p05), p95);
  const normalized =
    directionality === "positive"
      ? 100 * (clamped - p05) / (p95 - p05)
      : 100 * (p95 - clamped) / (p95 - p05);
  return Math.max(0, Math.min(100, normalized));
}

/**
 * Compute norm stats (p05, p95) for each score input across all cities.
 */
export function computeNormStats(
  cityRows: Record<string, number | null>[],
): Record<string, NormStats> {
  const stats: Record<string, NormStats> = {};
  for (const [inputKey, spec] of Object.entries(SCORE_INPUTS)) {
    const values: number[] = [];
    for (const row of cityRows) {
      const v = row[spec.sourceColumn];
      if (v != null) values.push(v);
    }
    stats[inputKey] = {
      p05: percentileInc(values, 0.05),
      p95: percentileInc(values, 0.95),
    };
  }
  return stats;
}

/**
 * Score a single metric for a city (direct or composite).
 */
export function scoreMetric(
  metricKey: string,
  cityRow: Record<string, number | null>,
  normStats: Record<string, NormStats>,
): { score: number | null; coverage: number | null } {
  const spec = METRIC_SPECS[metricKey];

  if (spec.type === "direct") {
    const inputKey = spec.inputKey;
    const { p05, p95 } = normStats[inputKey];
    const dir = SCORE_INPUTS[inputKey].directionality;
    const score = normalizeValue(cityRow[inputKey], p05, p95, dir);
    return { score, coverage: score != null ? 1.0 : null };
  }

  // Composite metric
  let numerator = 0;
  let denominator = 0;
  for (const [inputKey, weight] of spec.components) {
    const { p05, p95 } = normStats[inputKey];
    const dir = SCORE_INPUTS[inputKey].directionality;
    const componentScore = normalizeValue(cityRow[inputKey], p05, p95, dir);
    if (componentScore == null) continue;
    numerator += componentScore * weight;
    denominator += weight;
  }
  return {
    score: denominator > 0 ? numerator / denominator : null,
    coverage: denominator > 0 ? denominator : null,
  };
}

/**
 * Compute pillar scores and coverage for a city.
 */
export function computePillarScores(
  cityRow: Record<string, number | null>,
  normStats: Record<string, NormStats>,
): {
  pillarScores: Record<PillarId, number | null>;
  pillarCoverage: Record<PillarId, number | null>;
} {
  const pillarScores = {} as Record<PillarId, number | null>;
  const pillarCoverage = {} as Record<PillarId, number | null>;

  for (const pillar of PILLAR_ORDER) {
    const metrics = PILLAR_METRICS[pillar];
    let numerator = 0;
    let denominator = 0;
    let coverageNumerator = 0;
    const totalWeight = metrics.reduce((sum, [, w]) => sum + w, 0);

    for (const [metricKey, weight] of metrics) {
      const { score, coverage } = scoreMetric(metricKey, cityRow, normStats);
      if (score != null) {
        numerator += score * weight;
        denominator += weight;
      }
      if (coverage != null) {
        coverageNumerator += coverage * weight;
      }
    }

    pillarScores[pillar] = denominator > 0 ? numerator / denominator : null;
    pillarCoverage[pillar] = coverageNumerator > 0 ? coverageNumerator / totalWeight : null;
  }

  return { pillarScores, pillarCoverage };
}

/**
 * Compute the overall SLIC composite score using given pillar weights.
 * When a pillar is missing, remaining pillars are re-weighted proportionally.
 */
export function computeSlicScore(
  pillarScores: Record<PillarId, number | null>,
  weights: Record<PillarId, number> = CANONICAL_WEIGHTS,
): number | null {
  let numerator = 0;
  let availableWeight = 0;
  for (const pillar of PILLAR_ORDER) {
    const score = pillarScores[pillar];
    if (score != null) {
      numerator += score * weights[pillar];
      availableWeight += weights[pillar];
    }
  }
  return availableWeight > 0 ? numerator / availableWeight : null;
}

/**
 * Compute overall coverage from pillar coverages.
 */
export function computeOverallCoverage(
  pillarCoverage: Record<PillarId, number | null>,
): number | null {
  if (PILLAR_ORDER.every((p) => pillarCoverage[p] == null)) return null;
  return (
    PILLAR_ORDER.reduce(
      (sum, p) => sum + (pillarCoverage[p] ?? 0) * CANONICAL_WEIGHTS[p],
      0,
    ) / 100
  );
}

/**
 * Assign coverage grade from overall coverage fraction.
 */
export function coverageGrade(overallCoverage: number | null): CoverageGrade {
  if (overallCoverage == null) return "";
  if (overallCoverage >= COVERAGE_THRESHOLDS.gradeAMin) return "A";
  if (overallCoverage >= COVERAGE_THRESHOLDS.gradeBMin) return "B";
  if (overallCoverage >= COVERAGE_THRESHOLDS.gradeCMin) return "C";
  return "Watchlist";
}

/**
 * Determine ranking eligibility.
 */
export function rankingStatus(
  overallCoverage: number | null,
  pillarCoverage: Record<PillarId, number | null>,
): "Ranked" | "Watchlist" {
  if (overallCoverage == null || overallCoverage < COVERAGE_THRESHOLDS.rankedMinOverall) {
    return "Watchlist";
  }
  for (const pillar of PILLAR_ORDER) {
    const cov = pillarCoverage[pillar];
    if (cov == null || cov < COVERAGE_THRESHOLDS.rankedMinPillar) return "Watchlist";
  }
  return "Ranked";
}

function roundScore(v: number | null): number | null {
  return v != null ? Math.round(v * 10) / 10 : null;
}

// ---------------------------------------------------------------------------
// High-level: score and rank all cities
// ---------------------------------------------------------------------------

export interface CityRawData {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  values: Record<string, number | null>;
}

/**
 * Score and rank a set of cities.
 *
 * @param cities - Array of city raw data objects
 * @param weights - Optional custom pillar weights (for the Exercise game).
 *                  Defaults to canonical 25/22/18/15/20.
 * @returns Scored and ranked cities, sorted by rank.
 */
export function scoreAndRankCities(
  cities: CityRawData[],
  weights: Record<PillarId, number> = CANONICAL_WEIGHTS,
): ScoredCity[] {
  // Step 1: Compute p05/p95 across all cities
  const allRows = cities.map((c) => c.values);
  const normStats = computeNormStats(allRows);

  // Step 2: Score each city
  const scored: ScoredCity[] = cities.map((city) => {
    const { pillarScores, pillarCoverage } = computePillarScores(city.values, normStats);
    const slicScore = computeSlicScore(pillarScores, weights);
    const overallCov = computeOverallCoverage(pillarCoverage);
    const grade = coverageGrade(overallCov);
    const status = rankingStatus(overallCov, pillarCoverage);

    return {
      cityId: city.cityId,
      displayName: city.displayName,
      country: city.country,
      region: city.region,
      pillarScores: {
        pressure: roundScore(pillarScores.pressure),
        viability: roundScore(pillarScores.viability),
        capability: roundScore(pillarScores.capability),
        community: roundScore(pillarScores.community),
        creative: roundScore(pillarScores.creative),
      },
      pillarCoverage,
      slicScore: roundScore(slicScore),
      overallCoverage: roundScore(overallCov),
      coverageGrade: grade,
      rankingStatus: status,
      rank: null,
    };
  });

  // Step 3: Assign ranks (standard competition ranking, 1224 method)
  const ranked = scored.filter((c) => c.rankingStatus === "Ranked" && c.slicScore != null);
  for (const city of ranked) {
    city.rank =
      1 +
      ranked.filter(
        (other) =>
          other.slicScore != null &&
          city.slicScore != null &&
          other.slicScore > city.slicScore,
      ).length;
  }

  // Step 4: Sort by rank, then score desc, then name
  ranked.sort((a, b) => {
    if (a.rank !== b.rank) return (a.rank ?? Infinity) - (b.rank ?? Infinity);
    if ((b.slicScore ?? 0) !== (a.slicScore ?? 0)) return (b.slicScore ?? 0) - (a.slicScore ?? 0);
    return a.displayName.localeCompare(b.displayName);
  });

  // Append watchlist cities at the end
  const watchlist = scored
    .filter((c) => c.rankingStatus === "Watchlist")
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return [...ranked, ...watchlist];
}
