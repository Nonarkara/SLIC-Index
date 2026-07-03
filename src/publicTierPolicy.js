/**
 * Shared publication ranking and tier policy used by both the rescore script
 * and React consumers. Numeric rank is pure score order. Alpha / Beta / Gamma
 * are a separate editorial-public overlay applied after ranking.
 */

import { numeric, scoreAccessor } from "./publicationMath.js";

export const PUBLIC_TIER_POLICY_VERSION = "public-tier-v1.3.0";
export const PUBLIC_TIER_ORDER = Object.freeze(["Alpha", "Beta", "Gamma"]);
const COVERAGE_GRADE_ORDER = Object.freeze(["Watchlist", "C", "B", "A"]);

// Editorial rule for Alpha (the public face of SLIC):
// Alpha is reserved for cities where the median resident genuinely thrives.
// Famously expensive English-speaking metros (NYC, London, Sydney, Perth,
// Melbourne, Auckland, Tokyo, Singapore) have catastrophic affordability
// problems for residents and DO NOT belong on the public Alpha shelf —
// they can earn Beta or Gamma seats, but never Alpha. The country/region
// caps, coverage floor, and city exclusions encode this rule alongside the
// floor scores. Alpha requires A-grade coverage so missing pressure/stress
// inputs cannot be converted into a top-shelf public claim.
//
// EDITORIAL PRESENCE: Bangkok is the index's anchor city — pluralism,
// hospitality, strong community signal, the lived case study against the
// "expensive English-speaking metro = livable" assumption that SLIC was
// built to challenge. Bangkok previously held Alpha:10 but dropped to
// un-tiered (#66) after two data-source updates: (1) housing_burden was
// converted to USD/sqft purchase price (Numbeo 2024-25), and (2) suicide
// rate was updated from national (7.2) to city-level (16.59). Both are
// legitimate data improvements. Bangkok remains Ranked and the editorial
// mission (Thailand page, essays) continues to use it as the anchor case
// study. The tier rules are not gamed to force Bangkok into Alpha.
export const PUBLIC_TIER_RULES = Object.freeze({
  alphaMinCommunity: 40,
  alphaMinPressure: 40,
  alphaMinCoverageGrade: "A",
  betaMinCommunity: 45,
  betaMinPressure: 45,
  maxPerTier: 10,
  maxEuropeInAlpha: 2,
  maxOceaniaInAlpha: 0,
  // United States: cap at 1 in Alpha. Mid-size US cities (Raleigh,
  // Minneapolis, Pittsburgh, Chicago, etc.) share national-level data
  // for Community/Tolerance/Cultural so AMPI tends to rank them in a
  // tight band. Letting three US cities fill the public Alpha shelf
  // misrepresents what SLIC measures — geographic diversity of healthy
  // mid-sized cities. The first qualifying US city by SLIC score earns
  // the seat; the rest drop to Beta or Gamma.
  maxUSAInAlpha: 1,
  maxTaiwanAcrossPublicTiers: 2,
  maxJapanAcrossPublicTiers: 2,
  maxJapanInAlpha: 1,
  maxSouthKoreaInAlpha: 1,
  alphaCountryExclusions: ["Israel"],
  // Specific cities barred from Alpha despite passing floor scores —
  // applied alongside the country/region caps. These cities are
  // structurally too expensive for the median resident. The 2025
  // Demographia median-multiple table supports the major-market exclusions;
  // Deloitte Property Index 2025 supports the European ownership-income
  // exclusions. San Jose, CA is not name-matched because the current universe
  // also contains San Jose, Costa Rica.
  alphaCityExclusions: [
    "Tokyo",
    "Hong Kong",
    "Sydney",
    "Vancouver",
    "Los Angeles",
    "Adelaide",
    "Honolulu",
    "San Francisco",
    "Melbourne",
    "San Diego",
    "Brisbane",
    "London",
    "Amsterdam",
    "Athens",
    "Prague",
    "Košice",
    "Kosice",
  ],
});

export function mergePublicTierRules(overrides = {}) {
  return Object.freeze({
    ...PUBLIC_TIER_RULES,
    ...overrides,
  });
}

/**
 * Display-ready alphaCityExclusions list — diacritic-deduped.
 * The raw list contains both "Košice" and "Kosice" so that matching against
 * a dataset that uses either spelling still works. For human-readable copy
 * we want one canonical spelling per city, so we collapse by stripping
 * diacritics and keeping the first occurrence (which preserves "Košice"
 * over "Kosice").
 */
export function getDisplayAlphaCityExclusions(rules = PUBLIC_TIER_RULES) {
  const seen = new Map();
  for (const name of rules.alphaCityExclusions ?? []) {
    const key = String(name).normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (!seen.has(key)) seen.set(key, name);
  }
  return Array.from(seen.values());
}

function labelOf(city) {
  return city.displayName ?? city.name ?? city.cityId ?? city.id ?? city.country ?? "Unknown";
}

function identityOf(city) {
  return city.cityId ?? city.id ?? `${city.country}::${labelOf(city)}`;
}

function scoreField(city, baseKey) {
  return scoreAccessor(city, baseKey);
}

function formatScore(value) {
  return numeric(value) ? value.toFixed(1) : "n/a";
}

function coverageRank(grade) {
  const index = COVERAGE_GRADE_ORDER.indexOf(grade);
  return index === -1 ? 0 : index;
}

function meetsCoverageFloor(city, grade) {
  if (!grade) return true;
  return coverageRank(city?.coverageGrade) >= coverageRank(grade);
}

function isEuropeanRegion(region) {
  return typeof region === "string" && region.includes("Europe");
}

function isJapaneseCity(city) {
  return city?.country === "Japan";
}

function isSouthKoreanCity(city) {
  return city?.country === "South Korea";
}

function isTaiwaneseCity(city) {
  return city?.country === "Taiwan";
}

function isOceaniaRegion(region) {
  return typeof region === "string" && region.includes("Oceania");
}

function isUSACity(city) {
  return city?.country === "United States";
}

function evaluateFloors(city, rules) {
  const community = scoreField(city, "communityScore");
  const pressure = scoreField(city, "pressureScore");
  const alphaCoverageEligible = meetsCoverageFloor(city, rules.alphaMinCoverageGrade);
  return {
    community,
    pressure,
    alphaCoverageEligible,
    alphaFloorEligible:
      numeric(community) &&
      numeric(pressure) &&
      community >= rules.alphaMinCommunity &&
      pressure >= rules.alphaMinPressure,
    alphaEligible:
      numeric(community) &&
      numeric(pressure) &&
      community >= rules.alphaMinCommunity &&
      pressure >= rules.alphaMinPressure &&
      alphaCoverageEligible,
    betaEligible:
      numeric(community) &&
      numeric(pressure) &&
      community >= rules.betaMinCommunity &&
      pressure >= rules.betaMinPressure,
  };
}

export function compareCitiesByPublishedScore(left, right, scoreKey = "slicScore") {
  const leftScore = numeric(left?.[scoreKey]) ? left[scoreKey] : scoreField(left, scoreKey);
  const rightScore = numeric(right?.[scoreKey]) ? right[scoreKey] : scoreField(right, scoreKey);
  const safeLeftScore = numeric(leftScore) ? leftScore : -Infinity;
  const safeRightScore = numeric(rightScore) ? rightScore : -Infinity;
  if (safeRightScore !== safeLeftScore) return safeRightScore - safeLeftScore;

  const leftCommunity = scoreField(left, "communityScore");
  const rightCommunity = scoreField(right, "communityScore");
  const safeLeftCommunity = numeric(leftCommunity) ? leftCommunity : -Infinity;
  const safeRightCommunity = numeric(rightCommunity) ? rightCommunity : -Infinity;
  if (safeRightCommunity !== safeLeftCommunity) return safeRightCommunity - safeLeftCommunity;

  const leftPressure = scoreField(left, "pressureScore");
  const rightPressure = scoreField(right, "pressureScore");
  const safeLeftPressure = numeric(leftPressure) ? leftPressure : -Infinity;
  const safeRightPressure = numeric(rightPressure) ? rightPressure : -Infinity;
  if (safeRightPressure !== safeLeftPressure) return safeRightPressure - safeLeftPressure;

  const nameDelta = labelOf(left).localeCompare(labelOf(right));
  if (nameDelta !== 0) return nameDelta;

  return identityOf(left).localeCompare(identityOf(right));
}

export function assignPureScoreRanks(cities, options = {}) {
  const { scoreKey = "slicScoreExact", rankKey = "rank" } = options;
  return [...cities]
    .sort((left, right) => compareCitiesByPublishedScore(left, right, scoreKey))
    .map((city, index) => ({
      ...city,
      [rankKey]: index + 1,
    }));
}

function alphaCapBlock(city, state, rules) {
  if (isEuropeanRegion(city?.region) && state.europeInAlpha >= rules.maxEuropeInAlpha) {
    return "Europe Alpha seat already filled";
  }
  if (isOceaniaRegion(city?.region) && rules.maxOceaniaInAlpha === 0) {
    return "Oceania cities are not placed on the Alpha shelf under the current methodology — purchase and rental costs are above the median-resident affordability threshold that Alpha requires.";
  }
  if (isOceaniaRegion(city?.region) && state.oceaniaInAlpha >= rules.maxOceaniaInAlpha) {
    return "The single Oceania Alpha slot is already filled. Remaining Oceania cities are evaluated for Beta or Gamma.";
  }
  if (isJapaneseCity(city) && rules.maxJapanInAlpha === 0) {
    return "Japanese cities score exceptionally on Viability and Capability but are held outside Alpha by the affordability floor — Tokyo's cost-of-living premium would require a dedicated Japan Alpha seat, which the current board does not carry.";
  }
  if (isJapaneseCity(city) && state.japanInAlpha >= rules.maxJapanInAlpha) {
    return "The single Japan Alpha slot is already filled by the highest-ranking Japanese city.";
  }
  if (isSouthKoreanCity(city) && state.southKoreaInAlpha >= rules.maxSouthKoreaInAlpha) {
    return "The single South Korea Alpha slot is already filled by the highest-ranking Korean city.";
  }
  if (isUSACity(city) && state.usaInAlpha >= rules.maxUSAInAlpha) {
    return "The single US Alpha slot is filled. Mid-size US cities share national-level Community and Tolerance data, which compresses their AMPI scores into a tight band — the board carries one representative.";
  }
  if ((rules.alphaCountryExclusions ?? []).includes(city?.country)) {
    return `${city.country} cities are not placed on the Alpha shelf under the current methodology. See the methodology page for the full tier policy.`;
  }
  if ((rules.alphaCityExclusions ?? []).includes(labelOf(city))) {
    return `${labelOf(city)} is not placed on the Alpha shelf under the current methodology — purchase and rental costs exceed the affordability threshold that Alpha requires.`;
  }
  if (!meetsCoverageFloor(city, rules.alphaMinCoverageGrade)) {
    return `${labelOf(city)} is not placed on the Alpha shelf because Alpha requires ${rules.alphaMinCoverageGrade}-grade coverage; current coverage is ${city?.coverageGrade ?? "unknown"}. Missing stress inputs cannot be converted into a top-shelf public claim.`;
  }
  return null;
}

function applyAlphaSeatAccounting(city, state) {
  if (isEuropeanRegion(city?.region)) state.europeInAlpha += 1;
  if (isOceaniaRegion(city?.region)) state.oceaniaInAlpha += 1;
  if (isJapaneseCity(city)) state.japanInAlpha += 1;
  if (isSouthKoreanCity(city)) state.southKoreaInAlpha += 1;
  if (isUSACity(city)) state.usaInAlpha += 1;
}

function assignTier(city, tierLabel, buckets, tierLabelKey, tierSlotKey, tierReasonKey, reason) {
  buckets[tierLabel].push(city);
  city[tierLabelKey] = tierLabel;
  city[tierSlotKey] = buckets[tierLabel].length;
  city[tierReasonKey] = reason;
}

export function allocatePublicTiers(cities, options = {}) {
  const {
    scoreKey = "slicScoreExact",
    rankKey = "rank",
    tierLabelKey = "tierLabel",
    tierSlotKey = "tierSlot",
    tierReasonKey = "tierReason",
    tierDiagnosticsKey = "tierDiagnostics",
    rules: providedRules = PUBLIC_TIER_RULES,
  } = options;
  const rules = mergePublicTierRules(providedRules);

  const ranked = [...cities]
    .filter((city) => {
      const score = numeric(city?.[scoreKey]) ? city[scoreKey] : scoreField(city, scoreKey);
      return numeric(score);
    })
    .sort((left, right) => {
      const leftRank = left?.[rankKey];
      const rightRank = right?.[rankKey];
      if (numeric(leftRank) && numeric(rightRank) && leftRank !== rightRank) {
        return leftRank - rightRank;
      }
      return compareCitiesByPublishedScore(left, right, scoreKey);
    });

  const decorated = ranked.map((city) => ({
    ...city,
    [tierLabelKey]: null,
    [tierSlotKey]: null,
    [tierReasonKey]: null,
  }));

  const state = {
    buckets: {
      Alpha: [],
      Beta: [],
      Gamma: [],
    },
    assignedCountry: new Map(),
    europeInAlpha: 0,
    oceaniaInAlpha: 0,
    japanInAlpha: 0,
    southKoreaInAlpha: 0,
    usaInAlpha: 0,
  };

  for (const city of decorated) {
    const floors = evaluateFloors(city, rules);
    const diagnostics = {
      communityExact: floors.community,
      pressureExact: floors.pressure,
      alphaCoverageEligible: floors.alphaCoverageEligible,
      alphaFloorEligible: floors.alphaFloorEligible,
      alphaEligible: floors.alphaEligible,
      betaEligible: floors.betaEligible,
      alphaCapBlock: null,
      countryBlock: null,
      assignedTier: null,
    };

    const countryOwners = state.assignedCountry.get(city.country) ?? [];
    const countryCap = city.country === "Taiwan"
      ? rules.maxTaiwanAcrossPublicTiers
      : city.country === "Japan"
        ? rules.maxJapanAcrossPublicTiers ?? 1
        : 1;
    if (countryOwners.length >= countryCap) {
      const countryOwner = countryOwners[0];
      diagnostics.countryBlock = {
        country: city.country,
        claimedBy: countryOwner.displayName,
        tierLabel: countryOwner[tierLabelKey],
        tierSlot: countryOwner[tierSlotKey],
        rank: countryOwner[rankKey],
      };
      city[tierDiagnosticsKey] = diagnostics;
      city[tierReasonKey] =
        `${city.country} is already on the public board — ${countryOwner.displayName} holds the ` +
        `${countryOwner[tierLabelKey]} seat. Each country occupies one slot per tier to keep the board geographically diverse.`;
      continue;
    }

    if (state.buckets.Alpha.length < rules.maxPerTier && floors.alphaFloorEligible) {
      const capBlock = alphaCapBlock(city, state, rules);
      diagnostics.alphaCapBlock = capBlock;
      if (!capBlock) {
        assignTier(
          city,
          "Alpha",
          state.buckets,
          tierLabelKey,
          tierSlotKey,
          tierReasonKey,
          `Placed on the Alpha shelf: Community ${formatScore(floors.community)} and Pressure ${formatScore(floors.pressure)} both clear the Alpha threshold, coverage is ${city.coverageGrade ?? "unknown"}, and this is ${city.country}'s first representative at this tier.`,
        );
        applyAlphaSeatAccounting(city, state);
        state.assignedCountry.set(city.country, [...countryOwners, city]);
        diagnostics.assignedTier = "Alpha";
        city[tierDiagnosticsKey] = diagnostics;
        continue;
      }
    }

    if (state.buckets.Beta.length < rules.maxPerTier && floors.betaEligible) {
      const alphaBlockDetail = diagnostics.alphaCapBlock
        ? ` Alpha was not available: ${diagnostics.alphaCapBlock}`
        : " Alpha was not available — either the regional cap was filled, or a higher-scoring city from this country already occupies it.";
      assignTier(
        city,
        "Beta",
        state.buckets,
        tierLabelKey,
        tierSlotKey,
        tierReasonKey,
        `Placed on the Beta shelf: Community ${formatScore(floors.community)} and Pressure ${formatScore(floors.pressure)} clear the Beta threshold.${alphaBlockDetail}`,
      );
      state.assignedCountry.set(city.country, [...countryOwners, city]);
      diagnostics.assignedTier = "Beta";
      city[tierDiagnosticsKey] = diagnostics;
      continue;
    }

    if (state.buckets.Gamma.length < rules.maxPerTier) {
      const shortfall = [];
      if (!floors.alphaFloorEligible) shortfall.push(`Alpha floor not met (${formatScore(floors.community)} Community, ${formatScore(floors.pressure)} Pressure)`);
      if (floors.alphaFloorEligible && !floors.alphaCoverageEligible) shortfall.push(`Alpha coverage floor not met (${city.coverageGrade ?? "unknown"} coverage; ${rules.alphaMinCoverageGrade} required)`);
      if (!floors.betaEligible) shortfall.push(`Beta floor not met (${formatScore(floors.community)} Community, ${formatScore(floors.pressure)} Pressure)`);

      assignTier(
        city,
        "Gamma",
        state.buckets,
        tierLabelKey,
        tierSlotKey,
        tierReasonKey,
        shortfall.length > 0
          ? `Placed on the Gamma shelf: ${shortfall.join("; ")}. ${city.country} has not yet claimed a higher tier.`
          : `Placed on the Gamma shelf as the highest-ranking city from ${city.country} after Alpha and Beta were allocated.`,
      );
      state.assignedCountry.set(city.country, [...countryOwners, city]);
      diagnostics.assignedTier = "Gamma";
      city[tierDiagnosticsKey] = diagnostics;
      continue;
    }

    city[tierReasonKey] = "Not placed on a public shelf — all tier slots were filled by higher-ranking cities.";
    city[tierDiagnosticsKey] = diagnostics;
  }

  return decorated;
}
