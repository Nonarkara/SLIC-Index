/**
 * Canonical publication math for the live SLIC board.
 *
 * This module exists so the publication pipeline, audit scripts, and tests
 * all run on the same exact scorer rather than maintaining near-duplicates.
 */

export const SCORE_MODEL_VERSION = "slic-v3.4.0";

export const PILLAR_WEIGHTS = Object.freeze({
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
});

export const PILLAR_ORDER = Object.freeze([
  "pressure",
  "viability",
  "capability",
  "community",
  "creative",
]);

function directMetric(key, pillar, weight, inputKey, label) {
  return {
    key,
    pillar,
    weight,
    inputKey,
    kind: "direct",
    label,
    scored: true,
  };
}

function compositeMetric(key, pillar, weight, components, label) {
  return {
    key,
    pillar,
    weight,
    inputKey: null,
    kind: "composite",
    components,
    label,
    scored: true,
  };
}

function diagnosticMetric(key, pillar, inputKey, label) {
  return {
    key,
    pillar,
    weight: 0,
    inputKey,
    kind: "direct",
    label,
    scored: false,
  };
}

export const SCORED_METRICS = Object.freeze([
  // Pressure pillar (sum = 25). v3.5: Hanke Annual Misery Index added (weight 2).
  // Suicide weight 3 → 4 to amplify mental-health misery (Hanke explicitly omits it).
  // Household debt 4 → 2 (overlaps with Hanke's lending-rate component).
  // DI_PPP 9 → 8 (still primary, modest reweight to make room).
  directMetric("pressure_disposable_income_ppp", "pressure", 8, "di_ppp_raw", "Tax-adjusted PPP disposable income"),
  directMetric("pressure_housing_burden", "pressure", 5, "housing_burden_raw", "Housing price pressure"),
  directMetric("pressure_household_debt_burden", "pressure", 2, "household_debt_effective_raw", "Household debt burden"),
  directMetric("pressure_working_time_pressure", "pressure", 4, "working_time_pressure_raw", "Working time pressure"),
  directMetric("pressure_suicide_mental_strain", "pressure", 4, "suicide_mental_strain_raw", "Suicide and severe mental strain"),
  directMetric("pressure_economic_stress_hanke", "pressure", 2, "hanke_misery_raw", "Macroeconomic stress (Hanke Misery Index)"),

  directMetric("viability_personal_safety", "viability", 5, "personal_safety_raw", "Personal safety"),
  directMetric("viability_transit_access_commute", "viability", 5, "transit_access_commute_raw", "Transit access and commute burden"),
  directMetric("viability_clean_air", "viability", 4, "clean_air_raw", "Clean air"),
  directMetric("viability_water_sanitation_utility", "viability", 4, "water_sanitation_utility_raw", "Water, sanitation, and utility reliability"),
  directMetric("viability_digital_infrastructure", "viability", 4, "digital_infrastructure_raw", "Digital infrastructure"),

  directMetric("capability_healthcare_quality", "capability", 8, "healthcare_quality_raw", "Healthcare quality"),
  directMetric("capability_education_quality", "capability", 6, "education_quality_raw", "Education quality"),
  compositeMetric(
    "capability_equal_opportunity_distributional_fairness",
    "capability",
    4,
    Object.freeze([
      ["equal_opportunity_raw", 0.7],
      ["gini_coefficient_context", 0.3],
    ]),
    "Equal opportunity and distributional fairness",
  ),

  // Community pillar (sum = 15). v3.5: Civic-Freedom-Dignity composite added
  // (weight 4). Other Community metrics rebalanced down proportionally.
  directMetric("community_hospitality_belonging", "community", 4, "hospitality_belonging_raw", "Hospitality and belonging"),
  compositeMetric(
    "community_tolerance_pluralism",
    "community",
    4,
    Object.freeze([
      ["inclusion_equaldex_country_raw", 0.4],
      ["inclusion_freedom_house_country_raw", 0.3],
      ["inclusion_hate_crime_raw", 0.3],
    ]),
    "Tolerance and pluralism",
  ),
  directMetric(
    "community_cultural_historic_public_life_vitality",
    "community",
    3,
    "cultural_public_life_raw",
    "Cultural, historic, and public-life vitality",
  ),
  directMetric(
    "community_civic_freedom_dignity",
    "community",
    4,
    "civic_freedom_raw",
    "Civic freedom and dignity (HRMI + Freedom House + V-Dem composite)",
  ),

  directMetric("creative_entrepreneurial_dynamism", "creative", 6, "entrepreneurial_dynamism_raw", "Entrepreneurial dynamism"),
  directMetric("creative_innovation_research_intensity", "creative", 5, "innovation_research_intensity_raw", "Innovation and research intensity"),
  compositeMetric(
    "creative_economic_vitality_productive_context",
    "creative",
    5,
    Object.freeze([
      ["investment_signal_raw", 0.5],
      ["gdp_per_capita_ppp_context", 0.3],
      ["gdp_growth_context", 0.2],
    ]),
    "Economic vitality and productive context",
  ),
  directMetric(
    "creative_administrative_investment_friction",
    "creative",
    4,
    "administrative_investment_friction_raw",
    "Administrative and investment friction",
  ),
]);

export const DIAGNOSTIC_METRICS = Object.freeze([
  diagnosticMetric("pressure_economic_growth_momentum", "pressure", "gdp_growth_context", "Economic growth momentum"),
  diagnosticMetric("viability_climate_sunlight_livability", "viability", "climate_sunlight_livability_raw", "Climate and sunlight livability"),
  diagnosticMetric("community_birth_rate_optimism", "community", "birth_rate_optimism_raw", "Birth-rate optimism"),
]);

export const PUBLIC_METRICS = Object.freeze([
  ...SCORED_METRICS,
  ...DIAGNOSTIC_METRICS,
]);

const SCORED_METRIC_KEYS = Object.freeze(SCORED_METRICS.map((metric) => metric.key));
const DIAGNOSTIC_METRIC_KEYS = Object.freeze(DIAGNOSTIC_METRICS.map((metric) => metric.key));
export const SCORED_METRIC_COUNT = SCORED_METRICS.length;
export const DIAGNOSTIC_METRIC_COUNT = DIAGNOSTIC_METRICS.length;

const METRIC_BY_KEY = Object.freeze(
  Object.fromEntries(PUBLIC_METRICS.map((metric) => [metric.key, metric])),
);

export function numeric(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalize(value, p05, p95, dir) {
  if (!numeric(value) || !numeric(p05) || !numeric(p95) || p95 === p05) {
    return null;
  }
  const clamped = Math.min(Math.max(value, p05), p95);
  const raw = dir === "positive"
    ? (100 * (clamped - p05)) / (p95 - p05)
    : (100 * (p95 - clamped)) / (p95 - p05);
  return Math.max(0, Math.min(100, raw));
}

export function ampi(entries) {
  const valid = entries.filter((entry) => numeric(entry?.score) && numeric(entry?.weight) && entry.weight > 0);
  if (valid.length === 0) return { score: null, mu: null, variance: null };

  const totalWeight = valid.reduce((sum, entry) => sum + entry.weight, 0);
  if (!totalWeight) return { score: null, mu: null, variance: null };

  const mu = valid.reduce((sum, entry) => sum + entry.score * entry.weight, 0) / totalWeight;
  if (valid.length < 2 || mu === 0) {
    return {
      score: Math.max(0, Math.min(100, mu)),
      mu,
      variance: 0,
    };
  }

  const variance = valid.reduce(
    (sum, entry) => sum + entry.weight * (entry.score - mu) ** 2,
    0,
  ) / totalWeight;
  const score = Math.max(0, Math.min(100, mu - variance / mu));

  return { score, mu, variance };
}

function roundTo(value, digits) {
  if (!numeric(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export const r1 = (value) => roundTo(value, 1);
export const r2 = (value) => roundTo(value, 2);
export const r4 = (value) => roundTo(value, 4);

export function extractRawInputs(city) {
  const raw = {};

  for (const metric of Object.values(city?.metrics ?? {})) {
    if (!metric || !Array.isArray(metric.components)) continue;
    for (const component of metric.components) {
      if (component?.key && component.raw != null) {
        raw[component.key] = component.raw;
      }
    }
  }

  for (const metric of PUBLIC_METRICS) {
    if (metric.kind !== "direct") continue;
    const detail = city?.metrics?.[metric.key];
    if (detail && detail.raw != null) {
      raw[metric.inputKey] = detail.raw;
    }
  }

  return raw;
}

function scoreMetric(rawInputs, normStats, metric) {
  if (metric.kind === "direct") {
    const stat = normStats?.[metric.inputKey];
    const score = normalize(rawInputs?.[metric.inputKey], stat?.p05, stat?.p95, stat?.dir);
    return {
      score,
      coverage: score == null ? 0 : 1,
      scored: metric.scored,
      weight: metric.weight,
    };
  }

  let numerator = 0;
  let observedWeight = 0;
  const componentScores = {};

  for (const [componentKey, componentWeight] of metric.components) {
    const stat = normStats?.[componentKey];
    const score = normalize(rawInputs?.[componentKey], stat?.p05, stat?.p95, stat?.dir);
    componentScores[componentKey] = score;
    if (score != null) {
      numerator += score * componentWeight;
      observedWeight += componentWeight;
    }
  }

  const totalWeight = metric.components.reduce((sum, [, componentWeight]) => sum + componentWeight, 0);
  return {
    score: observedWeight > 0 ? numerator / observedWeight : null,
    coverage: totalWeight > 0 ? observedWeight / totalWeight : 0,
    scored: metric.scored,
    weight: metric.weight,
    componentScores,
  };
}

export function scoreCity(rawInputs, normStats) {
  const metricScores = {};

  for (const metric of PUBLIC_METRICS) {
    metricScores[metric.key] = scoreMetric(rawInputs, normStats, metric);
  }

  const pillarScores = {};
  const pillarCoverage = {};

  for (const pillar of PILLAR_ORDER) {
    const pillarMetrics = SCORED_METRICS.filter((metric) => metric.pillar === pillar);
    let numerator = 0;
    let observedWeight = 0;

    for (const metric of pillarMetrics) {
      const detail = metricScores[metric.key];
      if (detail?.score != null) {
        numerator += detail.score * metric.weight;
        observedWeight += metric.weight;
      }
    }

    const totalWeight = pillarMetrics.reduce((sum, metric) => sum + metric.weight, 0);
    const coveredWeight = pillarMetrics.reduce(
      (sum, metric) => sum + (metricScores[metric.key]?.coverage ?? 0) * metric.weight,
      0,
    );

    pillarScores[pillar] = observedWeight > 0 ? numerator / observedWeight : null;
    pillarCoverage[pillar] = totalWeight > 0 ? coveredWeight / totalWeight : 0;
  }

  const overallEntries = PILLAR_ORDER
    .map((pillar) => ({
      score: pillarScores[pillar],
      weight: PILLAR_WEIGHTS[pillar],
    }))
    .filter((entry) => entry.score != null);

  const ampiResult = ampi(overallEntries);

  const totalPillarWeight = Object.values(PILLAR_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const overallCoverage = PILLAR_ORDER.reduce(
    (sum, pillar) => sum + pillarCoverage[pillar] * PILLAR_WEIGHTS[pillar],
    0,
  ) / totalPillarWeight;

  let coverageGrade = "Watchlist";
  let coveragePenalty = 0;
  let rankingStatus = "Watchlist";

  if (overallCoverage >= 0.75) {
    coverageGrade = "A";
    coveragePenalty = 0;
    rankingStatus = "Ranked";
  } else if (overallCoverage >= 0.5) {
    coverageGrade = "B";
    coveragePenalty = 5;
    rankingStatus = "Ranked";
  } else if (overallCoverage >= 0.35) {
    coverageGrade = "C";
    coveragePenalty = 15;
    rankingStatus = "Ranked";
  }

  const slicScore = ampiResult.score == null
    ? null
    : Math.max(0, ampiResult.score - coveragePenalty);

  return {
    metricScores,
    pillarScores,
    pillarCoverage,
    weightedMean: ampiResult.mu,
    weightedVariance: ampiResult.variance,
    ampiScore: ampiResult.score,
    slicScore,
    overallCoverage,
    coverageGrade,
    rankingStatus,
    coveragePenalty,
  };
}

export function buildMetricCatalog() {
  return Object.fromEntries(
    PUBLIC_METRICS.map((metric) => [
      metric.key,
      {
        pillar: metric.pillar,
        weight: metric.weight,
        kind: metric.kind,
        scored: metric.scored,
        diagnostic: !metric.scored,
        inputKey: metric.inputKey ?? null,
        label: metric.label,
        components: metric.kind === "composite"
          ? metric.components.map(([key, weight]) => ({ key, weight }))
          : [],
      },
    ]),
  );
}

export function buildPillarMetrics() {
  return Object.fromEntries(
    PILLAR_ORDER.map((pillar) => [
      pillar,
      SCORED_METRICS
        .filter((metric) => metric.pillar === pillar)
        .map((metric) => ({
          key: metric.key,
          weight: metric.weight,
          scored: true,
          diagnostic: false,
        })),
    ]),
  );
}

export function buildDiagnosticMetrics() {
  return Object.fromEntries(
    PILLAR_ORDER.map((pillar) => [
      pillar,
      DIAGNOSTIC_METRICS
        .filter((metric) => metric.pillar === pillar)
        .map((metric) => ({
          key: metric.key,
          weight: metric.weight,
          scored: false,
          diagnostic: true,
        })),
    ]),
  );
}

export function scoreAccessor(city, key) {
  const exactKey = `${key}Exact`;
  if (numeric(city?.[exactKey])) return city[exactKey];
  return numeric(city?.[key]) ? city[key] : null;
}
