/**
 * Recompute the published SLIC dataset from the live raw metric rows.
 *
 * Canonical flow:
 *   1. winsorized P5/P95 normalization
 *   2. composite metric aggregation where needed
 *   3. weighted means inside pillars
 *   4. weighted AMPI across the five pillars
 *   5. coverage penalty
 *   6. pure score rank from exact values
 *   7. Alpha / Beta / Gamma public overlay
 *   8. publication manifest, provenance, diagnostics, and diff report
 *
 * Run:
 *   node scripts/rescore-all-cities.mjs
 */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildDiagnosticMetrics,
  buildMetricCatalog,
  buildPillarMetrics,
  DIAGNOSTIC_METRICS,
  DIAGNOSTIC_METRIC_COUNT,
  extractRawInputs,
  PILLAR_ORDER,
  PILLAR_WEIGHTS,
  PUBLIC_METRICS,
  r1,
  r2,
  r4,
  scoreCity,
  SCORE_MODEL_VERSION,
  SCORED_METRICS,
  SCORED_METRIC_COUNT,
} from "../src/publicationMath.js";
import {
  allocatePublicTiers,
  assignPureScoreRanks,
  compareCitiesByPublishedScore,
  mergePublicTierRules,
  PUBLIC_TIER_ORDER,
  PUBLIC_TIER_POLICY_VERSION,
  PUBLIC_TIER_RULES,
} from "../src/publicTierPolicy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "src/data/publishedRankingData.json");

const PUBLIC_METRIC_KEYS = PUBLIC_METRICS.map((metric) => metric.key);
const DATA_LEVEL_KEYS = ["city", "national", "derived", "composite", "missing"];
const WORKED_EXAMPLE_PREFERRED_IDS = ["tw-kaohsiung", "us-raleigh", "tw-taipei", "ca-montreal"];

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => stableValue(entry));
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = stableValue(value[key]);
        return accumulator;
      }, {});
  }
  return value;
}

function digest(value) {
  return createHash("sha256")
    .update(JSON.stringify(stableValue(value)))
    .digest("hex");
}

function blankLevelCounts() {
  return {
    city: 0,
    national: 0,
    derived: 0,
    composite: 0,
    missing: 0,
  };
}

function hasObservedMetric(detail) {
  if (!detail) return false;
  if (detail.raw != null || detail.scoreExact != null || detail.score != null) return true;
  if (Array.isArray(detail.components)) {
    return detail.components.some((component) => component.raw != null || component.scoreExact != null || component.score != null);
  }
  return false;
}

function dataLevelOf(detail) {
  const level = detail?.dataLevel;
  return DATA_LEVEL_KEYS.includes(level) ? level : "missing";
}

function share(value, denominator) {
  return denominator > 0 ? r4(value / denominator) : null;
}

function buildLevelShares(counts, denominator) {
  return Object.fromEntries(
    DATA_LEVEL_KEYS.map((key) => [key, share(counts[key] ?? 0, denominator)]),
  );
}

function buildObservedLevelShares(counts, denominator) {
  return Object.fromEntries(
    DATA_LEVEL_KEYS
      .filter((key) => key !== "missing")
      .map((key) => [key, share(counts[key] ?? 0, denominator)]),
  );
}

function citySnapshot(city) {
  return {
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    rankingStatus: city.rankingStatus,
    rank: city.rank ?? 0,
    tierLabel: city.tierLabel ?? null,
    tierSlot: city.tierSlot ?? null,
    slicScore: city.slicScore ?? null,
    slicScoreExact: city.slicScoreExact ?? city.slicScore ?? null,
  };
}

function buildChangeSummary(previousCities, nextCities, updatedAt, previousUpdatedAt) {
  const previousById = new Map((previousCities ?? []).map((city) => [city.cityId, city]));
  let scoreChangedCount = 0;
  let rankChangedCount = 0;
  let tierChangedCount = 0;
  let rankingStatusChangedCount = 0;

  const rankChanges = [];
  const tierTransitions = [];

  for (const city of nextCities) {
    const previous = previousById.get(city.cityId);
    if (!previous) continue;

    const previousExact = previous.slicScoreExact ?? previous.slicScore ?? null;
    const nextExact = city.slicScoreExact ?? city.slicScore ?? null;
    if (previousExact !== nextExact) scoreChangedCount += 1;
    if ((previous.rank ?? 0) !== (city.rank ?? 0)) {
      rankChangedCount += 1;
      rankChanges.push({
        cityId: city.cityId,
        displayName: city.displayName,
        country: city.country,
        previousRank: previous.rank ?? 0,
        currentRank: city.rank ?? 0,
        delta: (previous.rank ?? 0) - (city.rank ?? 0),
      });
    }
    if ((previous.tierLabel ?? null) !== (city.tierLabel ?? null) || (previous.tierSlot ?? null) !== (city.tierSlot ?? null)) {
      tierChangedCount += 1;
      tierTransitions.push({
        cityId: city.cityId,
        displayName: city.displayName,
        country: city.country,
        previousTierLabel: previous.tierLabel ?? null,
        previousTierSlot: previous.tierSlot ?? null,
        currentTierLabel: city.tierLabel ?? null,
        currentTierSlot: city.tierSlot ?? null,
      });
    }
    if ((previous.rankingStatus ?? null) !== (city.rankingStatus ?? null)) {
      rankingStatusChangedCount += 1;
    }
  }

  rankChanges.sort((left, right) => {
    const deltaGap = Math.abs(right.delta) - Math.abs(left.delta);
    if (deltaGap !== 0) return deltaGap;
    return left.displayName.localeCompare(right.displayName);
  });

  return {
    previousUpdatedAt: previousUpdatedAt ?? null,
    updatedAt,
    scoreChangedCount,
    rankChangedCount,
    tierChangedCount,
    rankingStatusChangedCount,
    biggestRankMovers: rankChanges.slice(0, 10),
    tierTransitions: tierTransitions.slice(0, 10),
  };
}

function computeCityProvenance(city) {
  const counts = blankLevelCounts();
  const scoredCounts = blankLevelCounts();
  const diagnosticCounts = blankLevelCounts();
  let observedMetricCount = 0;
  let observedScoredMetricCount = 0;
  let observedDiagnosticMetricCount = 0;

  for (const metric of PUBLIC_METRICS) {
    const detail = city.metrics?.[metric.key];
    const observed = hasObservedMetric(detail);
    const level = observed ? dataLevelOf(detail) : "missing";

    counts[level] += 1;
    if (metric.scored) {
      scoredCounts[level] += 1;
    } else {
      diagnosticCounts[level] += 1;
    }

    if (observed) {
      observedMetricCount += 1;
      if (metric.scored) observedScoredMetricCount += 1;
      if (!metric.scored) observedDiagnosticMetricCount += 1;
    }
  }

  return {
    publicMetricCount: PUBLIC_METRICS.length,
    observedMetricCount,
    missingMetricCount: PUBLIC_METRICS.length - observedMetricCount,
    observedScoredMetricCount,
    observedDiagnosticMetricCount,
    dataLevelCounts: counts,
    dataLevelShares: buildLevelShares(counts, PUBLIC_METRICS.length),
    observedDataLevelShares: buildObservedLevelShares(counts, observedMetricCount),
    scoredDataLevelCounts: scoredCounts,
    scoredDataLevelShares: buildLevelShares(scoredCounts, SCORED_METRIC_COUNT),
    observedScoredDataLevelShares: buildObservedLevelShares(scoredCounts, observedScoredMetricCount),
    diagnosticDataLevelCounts: diagnosticCounts,
    diagnosticDataLevelShares: buildLevelShares(diagnosticCounts, DIAGNOSTIC_METRIC_COUNT),
    observedDiagnosticDataLevelShares: buildObservedLevelShares(diagnosticCounts, observedDiagnosticMetricCount),
  };
}

function computeGlobalProvenance(cities) {
  const counts = blankLevelCounts();
  const gradeCounts = {};
  let observedMetricLines = 0;

  for (const city of cities) {
    gradeCounts[city.coverageGrade] = (gradeCounts[city.coverageGrade] ?? 0) + 1;
    for (const metricKey of PUBLIC_METRIC_KEYS) {
      const detail = city.metrics?.[metricKey];
      const observed = hasObservedMetric(detail);
      const level = observed ? dataLevelOf(detail) : "missing";
      counts[level] += 1;
      if (observed) observedMetricLines += 1;
    }
  }

  const publicMetricLineCount = cities.length * PUBLIC_METRICS.length;
  return {
    publicMetricLineCount,
    observedMetricLines,
    dataLevelCounts: counts,
    dataLevelShares: buildLevelShares(counts, publicMetricLineCount),
    observedDataLevelShares: buildObservedLevelShares(counts, observedMetricLines),
    gradeCounts,
  };
}

function summarizeTierMembers(cities) {
  return Object.fromEntries(
    PUBLIC_TIER_ORDER.map((tierLabel) => [
      tierLabel,
      cities
        .filter((city) => city.tierLabel === tierLabel)
        .map((city) => ({
          cityId: city.cityId,
          displayName: city.displayName,
          country: city.country,
          rank: city.rank,
          tierSlot: city.tierSlot,
        })),
    ]),
  );
}

function buildStabilityAnalysis(rankedCities) {
  const baselineById = new Map(
    rankedCities.map((city) => [
      city.cityId,
      {
        tierLabel: city.tierLabel ?? null,
        tierSlot: city.tierSlot ?? null,
        rank: city.rank,
        displayName: city.displayName,
        country: city.country,
      },
    ]),
  );

  const scenarios = [
    {
      scenarioId: "alpha_floor_minus_5",
      label: "Alpha floors reduced by 5",
      ruleOverrides: {
        alphaMinCommunity: PUBLIC_TIER_RULES.alphaMinCommunity - 5,
        alphaMinPressure: PUBLIC_TIER_RULES.alphaMinPressure - 5,
      },
    },
    {
      scenarioId: "alpha_floor_plus_5",
      label: "Alpha floors increased by 5",
      ruleOverrides: {
        alphaMinCommunity: PUBLIC_TIER_RULES.alphaMinCommunity + 5,
        alphaMinPressure: PUBLIC_TIER_RULES.alphaMinPressure + 5,
      },
    },
    {
      scenarioId: "beta_floor_minus_5",
      label: "Beta floors reduced by 5",
      ruleOverrides: {
        betaMinCommunity: PUBLIC_TIER_RULES.betaMinCommunity - 5,
        betaMinPressure: PUBLIC_TIER_RULES.betaMinPressure - 5,
      },
    },
    {
      scenarioId: "beta_floor_plus_5",
      label: "Beta floors increased by 5",
      ruleOverrides: {
        betaMinCommunity: PUBLIC_TIER_RULES.betaMinCommunity + 5,
        betaMinPressure: PUBLIC_TIER_RULES.betaMinPressure + 5,
      },
    },
  ];

  const reports = scenarios.map((scenario) => {
    const candidateRules = mergePublicTierRules(scenario.ruleOverrides);
    const tieredScenario = allocatePublicTiers(rankedCities, {
      scoreKey: "slicScoreExact",
      rankKey: "rank",
      tierLabelKey: "tierLabel",
      tierSlotKey: "tierSlot",
      tierReasonKey: "tierReason",
      tierDiagnosticsKey: "tierDiagnostics",
      rules: candidateRules,
    });

    const changedCities = tieredScenario
      .filter((city) => {
        const baseline = baselineById.get(city.cityId);
        return (
          (baseline?.tierLabel ?? null) !== (city.tierLabel ?? null) ||
          (baseline?.tierSlot ?? null) !== (city.tierSlot ?? null)
        );
      })
      .map((city) => {
        const baseline = baselineById.get(city.cityId);
        return {
          cityId: city.cityId,
          displayName: city.displayName,
          country: city.country,
          rank: city.rank,
          baselineTierLabel: baseline?.tierLabel ?? null,
          baselineTierSlot: baseline?.tierSlot ?? null,
          scenarioTierLabel: city.tierLabel ?? null,
          scenarioTierSlot: city.tierSlot ?? null,
        };
      })
      .sort((left, right) => left.rank - right.rank);

    const baselineAlpha = new Set(
      rankedCities
        .filter((city) => city.tierLabel === "Alpha")
        .map((city) => city.cityId),
    );
    const scenarioAlpha = new Set(
      tieredScenario
        .filter((city) => city.tierLabel === "Alpha")
        .map((city) => city.cityId),
    );

    return {
      scenarioId: scenario.scenarioId,
      label: scenario.label,
      ruleOverrides: scenario.ruleOverrides,
      changedCount: changedCities.length,
      alphaChangedCount: changedCities.filter((city) => city.baselineTierLabel === "Alpha" || city.scenarioTierLabel === "Alpha").length,
      betaChangedCount: changedCities.filter((city) => city.baselineTierLabel === "Beta" || city.scenarioTierLabel === "Beta").length,
      gammaChangedCount: changedCities.filter((city) => city.baselineTierLabel === "Gamma" || city.scenarioTierLabel === "Gamma").length,
      alphaRetentionCount: [...baselineAlpha].filter((cityId) => scenarioAlpha.has(cityId)).length,
      changedCities: changedCities.slice(0, 20),
    };
  });

  const maxTierChangeCount = reports.reduce(
    (max, report) => Math.max(max, report.changedCount),
    0,
  );
  const averageTierChangeCount = reports.length > 0
    ? r2(reports.reduce((sum, report) => sum + report.changedCount, 0) / reports.length)
    : 0;

  return {
    scope: "Public-tier floor sensitivity around the live Alpha and Beta thresholds.",
    baselineRuleSnapshot: {
      alphaMinCommunity: PUBLIC_TIER_RULES.alphaMinCommunity,
      alphaMinPressure: PUBLIC_TIER_RULES.alphaMinPressure,
      betaMinCommunity: PUBLIC_TIER_RULES.betaMinCommunity,
      betaMinPressure: PUBLIC_TIER_RULES.betaMinPressure,
      maxEuropeInAlpha: PUBLIC_TIER_RULES.maxEuropeInAlpha,
      maxOceaniaInAlpha: PUBLIC_TIER_RULES.maxOceaniaInAlpha,
      maxTaiwanAcrossPublicTiers: PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers,
      maxSouthKoreaInAlpha: PUBLIC_TIER_RULES.maxSouthKoreaInAlpha,
      maxJapanInAlpha: PUBLIC_TIER_RULES.maxJapanInAlpha,
      maxJapanAcrossPublicTiers: PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1,
      alphaCountryExclusions: PUBLIC_TIER_RULES.alphaCountryExclusions ?? [],
      alphaCityExclusions: PUBLIC_TIER_RULES.alphaCityExclusions ?? [],
    },
    baselineMembers: summarizeTierMembers(rankedCities),
    maxTierChangeCount,
    averageTierChangeCount,
    scenarios: reports,
  };
}

function buildReferenceCity(city) {
  if (!city) return null;
  return {
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    rank: city.rank,
    tierLabel: city.tierLabel,
    tierSlot: city.tierSlot,
    rankingStatus: city.rankingStatus,
    coverageGrade: city.coverageGrade,
    slicScore: city.slicScore,
    slicScoreExact: city.slicScoreExact,
    pressureScore: city.pressureScore,
    pressureScoreExact: city.pressureScoreExact,
    viabilityScore: city.viabilityScore,
    viabilityScoreExact: city.viabilityScoreExact,
    capabilityScore: city.capabilityScore,
    capabilityScoreExact: city.capabilityScoreExact,
    communityScore: city.communityScore,
    communityScoreExact: city.communityScoreExact,
    creativeScore: city.creativeScore,
    creativeScoreExact: city.creativeScoreExact,
    tierReason: city.tierReason ?? null,
  };
}

function chooseWorkedExampleCity(cities) {
  for (const cityId of WORKED_EXAMPLE_PREFERRED_IDS) {
    const found = cities.find((city) => city.cityId === cityId);
    if (found) return found;
  }
  return cities.find((city) =>
    city.rankingStatus === "Ranked" &&
    city.coverageGrade === "A" &&
    city.metrics?.viability_personal_safety?.raw != null,
  ) ?? cities.find((city) => city.rankingStatus === "Ranked");
}

function buildWorkedExample(city, normStats) {
  if (!city) return null;

  const safetyMetric = city.metrics?.viability_personal_safety;
  const safetyStats = normStats?.personal_safety_raw ?? {};
  const pressureTerms = SCORED_METRICS
    .filter((metric) => metric.pillar === "pressure")
    .map((metric) => ({
      key: metric.key,
      label: metric.label,
      weight: metric.weight,
      scoreExact: city.metrics?.[metric.key]?.scoreExact ?? null,
      scoreRounded: city.metrics?.[metric.key]?.score ?? null,
    }))
    .filter((term) => term.scoreExact != null);

  const pressureNumeratorExact = pressureTerms.reduce(
    (sum, term) => sum + term.weight * term.scoreExact,
    0,
  );
  const pressureDenominator = pressureTerms.reduce((sum, term) => sum + term.weight, 0);
  const weightedMeanTerms = PILLAR_ORDER.map((pillar) => ({
    pillar,
    weight: PILLAR_WEIGHTS[pillar],
    scoreExact: city[`${pillar}ScoreExact`],
    scoreRounded: city[`${pillar}Score`],
  }));

  return {
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    disposableIncomeRaw: city.metrics?.pressure_disposable_income_ppp?.raw ?? null,
    pillarScores: {
      pressure: city.pressureScore ?? null,
      viability: city.viabilityScore ?? null,
      capability: city.capabilityScore ?? null,
      community: city.communityScore ?? null,
      creative: city.creativeScore ?? null,
    },
    safety: {
      raw: safetyMetric?.raw ?? null,
      p05: safetyStats?.p05 ?? null,
      p95: safetyStats?.p95 ?? null,
      scoreExact: safetyMetric?.scoreExact ?? null,
      scoreRounded: safetyMetric?.score ?? null,
    },
    pressure: {
      terms: pressureTerms,
      numeratorExact: r4(pressureNumeratorExact),
      denominator: pressureDenominator,
      scoreExact: city.pressureScoreExact ?? null,
      scoreRounded: city.pressureScore ?? null,
    },
    overall: {
      weightedMeanExact: city.weightedMeanExact ?? null,
      weightedVarianceExact: city.weightedVarianceExact ?? null,
      ampiExact: city.ampiExact ?? null,
      slicScoreExact: city.slicScoreExact ?? null,
      slicScoreRounded: city.slicScore ?? null,
      coverageExact: city.overallWeightedCoverageExact ?? null,
      coverageRounded: city.overallWeightedCoverage ?? null,
      coverageGrade: city.coverageGrade,
      coveragePenalty: city.coveragePenalty ?? 0,
    },
    weightedMeanTerms,
  };
}

function buildMethodologyFacts(data, diagnostics) {
  const cities = data.cities ?? [];
  const ranked = cities
    .filter((city) => city.rankingStatus === "Ranked" && city.rank > 0)
    .sort((left, right) => left.rank - right.rank);

  return {
    scoreModelVersion: SCORE_MODEL_VERSION,
    tierPolicyVersion: PUBLIC_TIER_POLICY_VERSION,
    scoredMetricCount: SCORED_METRIC_COUNT,
    diagnosticMetricCount: DIAGNOSTIC_METRIC_COUNT,
    cityCount: cities.length,
    rankedCityCount: ranked.length,
    watchlistCityCount: cities.length - ranked.length,
    ruleSnapshot: {
      pureRankUsesExactScore: true,
      exactScoreField: "slicScoreExact",
      alphaMinCommunity: PUBLIC_TIER_RULES.alphaMinCommunity,
      alphaMinPressure: PUBLIC_TIER_RULES.alphaMinPressure,
      betaMinCommunity: PUBLIC_TIER_RULES.betaMinCommunity,
      betaMinPressure: PUBLIC_TIER_RULES.betaMinPressure,
      maxEuropeInAlpha: PUBLIC_TIER_RULES.maxEuropeInAlpha,
      maxOceaniaInAlpha: PUBLIC_TIER_RULES.maxOceaniaInAlpha,
      maxTaiwanAcrossPublicTiers: PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers,
      maxSouthKoreaInAlpha: PUBLIC_TIER_RULES.maxSouthKoreaInAlpha,
      maxJapanInAlpha: PUBLIC_TIER_RULES.maxJapanInAlpha,
      maxJapanAcrossPublicTiers: PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1,
      alphaCountryExclusions: PUBLIC_TIER_RULES.alphaCountryExclusions ?? [],
      alphaCityExclusions: PUBLIC_TIER_RULES.alphaCityExclusions ?? [],
    },
    referenceCities: {
      singapore: buildReferenceCity(cities.find((city) => city.displayName === "Singapore")),
      bangkok: buildReferenceCity(cities.find((city) => city.displayName === "Bangkok")),
      tokyo: buildReferenceCity(cities.find((city) => city.displayName === "Tokyo")),
    },
    workedExample: buildWorkedExample(chooseWorkedExampleCity(ranked), data.normStats),
    publicTierMembers: Object.fromEntries(
      PUBLIC_TIER_ORDER.map((tierLabel) => [
        tierLabel,
        summarizeTierMembers(ranked)[tierLabel],
      ]),
    ),
    provenance: diagnostics.provenance,
    coverage: diagnostics.coverage,
  };
}

function buildDiagnostics(data) {
  const ranked = data.cities
    .filter((city) => city.rankingStatus === "Ranked" && city.rank > 0)
    .sort((left, right) => left.rank - right.rank);
  const watchlist = data.cities.filter((city) => city.rankingStatus !== "Ranked");

  const integrityIssues = [];
  const exactRankInversions = [];

  for (let index = 1; index < ranked.length; index += 1) {
    const previous = ranked[index - 1];
    const current = ranked[index];
    const compare = compareCitiesByPublishedScore(previous, current, "slicScoreExact");
    if (compare <= 0) continue;
    exactRankInversions.push({
      previousCityId: previous.cityId,
      previousDisplayName: previous.displayName,
      previousRank: previous.rank,
      previousScoreExact: previous.slicScoreExact,
      currentCityId: current.cityId,
      currentDisplayName: current.displayName,
      currentRank: current.rank,
      currentScoreExact: current.slicScoreExact,
    });
  }

  if (exactRankInversions.length > 0) {
    integrityIssues.push(`Found ${exactRankInversions.length} exact score-rank inversions.`);
  }

  const tiered = ranked.filter((city) => city.tierLabel);
  const countryCaps = new Map([
    ["Taiwan", PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers ?? 1],
    ["Japan", PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1],
  ]);
  const countryCounts = new Map();
  for (const city of tiered) {
    countryCounts.set(city.country, (countryCounts.get(city.country) ?? 0) + 1);
  }

  const duplicateCountryBreaches = [...countryCounts.entries()]
    .filter(([country, count]) => count > (countryCaps.get(country) ?? 1))
    .map(([country, count]) => ({ country, count }));
  if (duplicateCountryBreaches.length > 0) {
    integrityIssues.push("Public tier country-cap breaches detected.");
  }

  const alpha = tiered.filter((city) => city.tierLabel === "Alpha");
  const alphaEuropeCount = alpha.filter((city) => String(city.region).includes("Europe")).length;
  const alphaOceaniaCount = alpha.filter((city) => String(city.region).includes("Oceania")).length;
  const alphaTaiwanCount = alpha.filter((city) => city.country === "Taiwan").length;
  const alphaSouthKoreaCount = alpha.filter((city) => city.country === "South Korea").length;
  const alphaJapanCount = alpha.filter((city) => city.country === "Japan").length;
  const alphaIsraelCount = alpha.filter((city) => city.country === "Israel").length;

  if (alphaEuropeCount > PUBLIC_TIER_RULES.maxEuropeInAlpha) integrityIssues.push("Alpha Europe cap breached.");
  if (alphaOceaniaCount > PUBLIC_TIER_RULES.maxOceaniaInAlpha) integrityIssues.push("Alpha Oceania cap breached.");
  if (alphaTaiwanCount > PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers) integrityIssues.push("Taiwan public-tier cap breached.");
  if (alphaSouthKoreaCount > PUBLIC_TIER_RULES.maxSouthKoreaInAlpha) integrityIssues.push("Alpha South Korea cap breached.");
  if (alphaJapanCount > PUBLIC_TIER_RULES.maxJapanInAlpha) integrityIssues.push("Alpha Japan cap breached.");
  if (alphaIsraelCount > 0) integrityIssues.push("Alpha includes an excluded country.");

  const watchlistWithTiers = watchlist.filter((city) => city.tierLabel != null);
  if (watchlistWithTiers.length > 0) {
    integrityIssues.push("Watchlist cities should not have public tiers.");
  }

  const provenance = computeGlobalProvenance(data.cities);

  return {
    scoreModel: {
      version: SCORE_MODEL_VERSION,
      pillarWeights: PILLAR_WEIGHTS,
      scoredMetricCount: SCORED_METRIC_COUNT,
      diagnosticMetricCount: DIAGNOSTIC_METRIC_COUNT,
      totalCityCount: data.cities.length,
      rankedCityCount: ranked.length,
      watchlistCityCount: watchlist.length,
    },
    coverage: {
      gradeCounts: provenance.gradeCounts,
    },
    provenance,
    integrity: {
      issueCount: integrityIssues.length,
      issues: integrityIssues,
      exactRankInversions,
      duplicateCountryBreaches,
      alphaEuropeCount,
      alphaOceaniaCount,
      alphaTaiwanCount,
      alphaSouthKoreaCount,
      alphaJapanCount,
      alphaIsraelCount,
      watchlistWithTiers: watchlistWithTiers.map((city) => city.cityId),
      tierCounts: Object.fromEntries(PUBLIC_TIER_ORDER.map((tierLabel) => [tierLabel, tiered.filter((city) => city.tierLabel === tierLabel).length])),
    },
  };
}

async function main() {
  const previousData = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const data = JSON.parse(JSON.stringify(previousData));

  data.metricCatalog = buildMetricCatalog();
  data.pillarMetrics = buildPillarMetrics();
  data.diagnosticMetrics = buildDiagnosticMetrics();
  data.canonicalWeights = PILLAR_WEIGHTS;

  const normStats = data.normStats ?? {};
  const inputDataHash = digest({
    normStats,
    cities: data.cities.map((city) => ({
      cityId: city.cityId,
      metrics: Object.fromEntries(
        PUBLIC_METRICS.map((metric) => [
          metric.key,
          {
            raw: city.metrics?.[metric.key]?.raw ?? null,
            dataLevel: city.metrics?.[metric.key]?.dataLevel ?? null,
            components: (city.metrics?.[metric.key]?.components ?? []).map((component) => ({
              key: component.key,
              raw: component.raw ?? null,
              dataLevel: component.dataLevel ?? null,
            })),
          },
        ]),
      ),
      watchlistReason: city.watchlistReason ?? null,
    })),
  });

  let scoreChanges = 0;

  for (const city of data.cities) {
    const rawInputs = extractRawInputs(city);
    const scored = scoreCity(rawInputs, normStats);

    for (const metric of PUBLIC_METRICS) {
      const detail = city.metrics?.[metric.key];
      const metricScore = scored.metricScores[metric.key];
      if (!detail || !metricScore) continue;

      detail.scoreExact = r4(metricScore.score);
      detail.score = r1(metricScore.score);
      detail.coverageExact = r4(metricScore.coverage);
      detail.scored = metric.scored;
      detail.diagnostic = !metric.scored;

      if (metric.kind === "composite" && Array.isArray(detail.components) && metricScore.componentScores) {
        for (const component of detail.components) {
          const componentScore = metricScore.componentScores[component.key];
          component.scoreExact = r4(componentScore);
          component.score = r1(componentScore);
        }
      }
    }

    const previousSlic = city.slicScoreExact ?? city.slicScore ?? null;

    for (const pillar of PILLAR_ORDER) {
      const scoreExact = scored.pillarScores[pillar];
      const coverageExact = scored.pillarCoverage[pillar];
      city[`${pillar}ScoreExact`] = r4(scoreExact);
      city[`${pillar}Score`] = r1(scoreExact);
      city[`${pillar}CoverageExact`] = r4(coverageExact);
      city[`${pillar}Coverage`] = r2(coverageExact);
    }

    city.weightedMeanExact = r4(scored.weightedMean);
    city.weightedVarianceExact = r4(scored.weightedVariance);
    city.ampiExact = r4(scored.ampiScore);
    city.coveragePenalty = scored.coveragePenalty;
    city.overallWeightedCoverageExact = r4(scored.overallCoverage);
    city.overallWeightedCoverage = r2(scored.overallCoverage);
    city.coverageGrade = scored.coverageGrade;
    city.slicScoreExact = r4(scored.slicScore);
    city.slicScore = r1(scored.slicScore);

    if (city.watchlistReason) {
      city.rankingStatus = "Watchlist";
      city.rank = 0;
    } else {
      city.rankingStatus = scored.rankingStatus;
    }

    const scoredMetrics = SCORED_METRICS
      .map((metric) => ({
        key: metric.key,
        scoreExact: city.metrics?.[metric.key]?.scoreExact ?? null,
      }))
      .filter((metric) => metric.scoreExact != null)
      .sort((left, right) => right.scoreExact - left.scoreExact);

    city.highlights = scoredMetrics.length > 0
      ? {
          strongest: scoredMetrics[0].key,
          weakest: scoredMetrics[scoredMetrics.length - 1].key,
        }
      : { strongest: null, weakest: null };

    city.provenanceSummary = computeCityProvenance(city);

    if (previousSlic !== city.slicScoreExact) scoreChanges += 1;
  }

  const ranked = data.cities
    .filter((city) => city.rankingStatus === "Ranked" && city.slicScoreExact != null)
    .sort((left, right) => compareCitiesByPublishedScore(left, right, "slicScoreExact"));

  const rankedWithRanks = assignPureScoreRanks(ranked, {
    scoreKey: "slicScoreExact",
    rankKey: "rank",
  });
  const rankedWithTiers = allocatePublicTiers(rankedWithRanks, {
    scoreKey: "slicScoreExact",
    rankKey: "rank",
    tierLabelKey: "tierLabel",
    tierSlotKey: "tierSlot",
    tierReasonKey: "tierReason",
    tierDiagnosticsKey: "tierDiagnostics",
  });

  const rankingByCityId = new Map(rankedWithTiers.map((city) => [city.cityId, city]));

  for (const city of data.cities) {
    const rankedCity = rankingByCityId.get(city.cityId);
    if (rankedCity) {
      city.rank = rankedCity.rank;
      city.tierLabel = rankedCity.tierLabel;
      city.tierSlot = rankedCity.tierSlot;
      city.tierReason = rankedCity.tierReason ?? null;
      city.tierDiagnostics = rankedCity.tierDiagnostics ?? null;
    } else {
      city.rank = 0;
      city.tierLabel = null;
      city.tierSlot = null;
      city.tierReason = null;
      city.tierDiagnostics = null;
    }
  }

  const updatedAt = new Date().toISOString();
  data.updatedAt = updatedAt;

  const diagnostics = buildDiagnostics(data);
  data.diagnostics = diagnostics;
  data.methodologyFacts = buildMethodologyFacts(data, diagnostics);
  data.changeSummary = buildChangeSummary(previousData.cities, data.cities, updatedAt, previousData.updatedAt);
  data.stabilityAnalysis = buildStabilityAnalysis(rankedWithTiers);
  data.issues = diagnostics.integrity.issues;
  data.publishable = diagnostics.integrity.issueCount === 0;
  data.status = data.publishable ? "published" : "reranking";
  data.qualifiedCityCount = data.cities.filter((city) => city.rankingStatus === "Ranked").length;
  data.integrityIssueCount = diagnostics.integrity.issueCount;
  data.validCityRowCount = data.cities.length;
  data.validCountryRowCount = new Set(data.cities.map((city) => city.country)).size;
  data.publicationManifest = {
    generatedAt: updatedAt,
    scorerVersion: SCORE_MODEL_VERSION,
    tierPolicyVersion: PUBLIC_TIER_POLICY_VERSION,
    normStatsHash: digest(normStats),
    inputDataHash,
    metricCatalogHash: digest(data.metricCatalog),
    publicationHash: digest(data.cities.map((city) => citySnapshot(city))),
  };

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  const displayRanked = rankedWithTiers.slice().sort((left, right) => left.rank - right.rank);
  console.log(`Rescored ${data.cities.length} cities.`);
  console.log(`Exact score changes: ${scoreChanges}/${data.cities.length}`);
  console.log(`Ranked: ${displayRanked.length} | Watchlist: ${data.cities.length - displayRanked.length}`);
  console.log(`Integrity issues: ${diagnostics.integrity.issueCount}`);
  console.log(`Publication hash: ${data.publicationManifest.publicationHash.slice(0, 12)}`);
  console.log(`Stability scenarios: ${data.stabilityAnalysis.scenarios.length} | max tier changes: ${data.stabilityAnalysis.maxTierChangeCount}`);

  console.log("\nTop 30 by pure exact-score rank with public tier overlay:");
  displayRanked.slice(0, 30).forEach((city) => {
    console.log(
      `  #${String(city.rank).padStart(3)} ${city.displayName.padEnd(16)} ${city.country.padEnd(18)} ` +
      `SLIC ${city.slicScore.toFixed(1).padStart(5)} (exact ${city.slicScoreExact.toFixed(4)}) ` +
      `tier ${city.tierLabel ?? "-"}${city.tierSlot ? `:${city.tierSlot}` : ""}`,
    );
  });

  for (const tierLabel of PUBLIC_TIER_ORDER) {
    console.log(`\n${tierLabel}:`);
    displayRanked
      .filter((city) => city.tierLabel === tierLabel)
      .forEach((city) => console.log(
        `  ${String(city.tierSlot).padStart(2)}. #${String(city.rank).padStart(3)} ${city.displayName} (${city.country})`,
      ));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
