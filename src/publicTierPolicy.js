/**
 * Shared publication ranking and tier policy used by both the rescore script
 * and React consumers. Numeric rank is pure score order. Alpha / Beta / Gamma
 * are a separate editorial-public overlay applied after ranking.
 */

import { numeric, scoreAccessor } from "./publicationMath.js";

export const PUBLIC_TIER_POLICY_VERSION = "public-tier-v1.2.0";
export const PUBLIC_TIER_ORDER = Object.freeze(["Alpha", "Beta", "Gamma"]);

// Editorial rule for Alpha (the public face of SLIC):
// Alpha is reserved for cities where the median resident genuinely thrives.
// Famously expensive English-speaking metros (NYC, London, Sydney, Perth,
// Melbourne, Auckland, Tokyo, Singapore) have catastrophic affordability
// problems for residents and DO NOT belong on the public Alpha shelf —
// they can earn Beta or Gamma seats, but never Alpha. The country/region
// caps and city exclusions encode this rule alongside the floor scores.
//
// EDITORIAL PRESENCE: Bangkok is the index's anchor city — pluralism,
// hospitality, strong community signal, the lived case study against the
// "expensive English-speaking metro = livable" assumption that SLIC was
// built to challenge. Bangkok currently clears Alpha naturally (Community
// 90.0, Pressure 45.4 over floor 40, Thailand uncontested by any higher-
// ranked Thai city, no exclusion). Two CI guards keep it there:
//   1. scripts/check-publication-integrity.mjs EXPECTED_ALPHA snapshot
//   2. scripts/check-publication-integrity.mjs explicit assertion that
//      Bangkok.tierLabel === "Alpha"
// If a future data refresh ever pushes Bangkok below the Pressure floor
// (the at-risk pillar — buffer is only +5.4) the integrity check fails
// loudly. Do NOT hardcode Bangkok past the rules; if the data ever says
// Bangkok no longer qualifies, the answer is to investigate the data,
// not silence the gate.
export const PUBLIC_TIER_RULES = Object.freeze({
  alphaMinCommunity: 40,
  alphaMinPressure: 40,
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
  // structurally too expensive for the median resident.
  alphaCityExclusions: ["Tokyo"],
});

export function mergePublicTierRules(overrides = {}) {
  return Object.freeze({
    ...PUBLIC_TIER_RULES,
    ...overrides,
  });
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
  return {
    community,
    pressure,
    alphaEligible:
      numeric(community) &&
      numeric(pressure) &&
      community >= rules.alphaMinCommunity &&
      pressure >= rules.alphaMinPressure,
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
    return "Oceania is excluded from Alpha under the live editorial rule (cost-of-living for the median resident)";
  }
  if (isOceaniaRegion(city?.region) && state.oceaniaInAlpha >= rules.maxOceaniaInAlpha) {
    return "Oceania Alpha seat already filled";
  }
  if (isJapaneseCity(city) && rules.maxJapanInAlpha === 0) {
    return "Japan is excluded from Alpha under the live editorial rule";
  }
  if (isJapaneseCity(city) && state.japanInAlpha >= rules.maxJapanInAlpha) {
    return "Japan Alpha seat already filled";
  }
  if (isSouthKoreanCity(city) && state.southKoreaInAlpha >= rules.maxSouthKoreaInAlpha) {
    return "South Korea Alpha seat already filled";
  }
  if (isUSACity(city) && state.usaInAlpha >= rules.maxUSAInAlpha) {
    return "United States Alpha seat already filled — mid-size US cities share national-level Community/Tolerance/Cultural data, so AMPI ranks them in a tight band; the public Alpha shelf carries one";
  }
  if ((rules.alphaCountryExclusions ?? []).includes(city?.country)) {
    return `${city.country} is excluded from Alpha under the live editorial rule`;
  }
  if ((rules.alphaCityExclusions ?? []).includes(labelOf(city))) {
    return `${labelOf(city)} is excluded from Alpha under the live editorial rule (cost-of-living for the median resident)`;
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
        `${city.country} is already represented by ${countryOwner.displayName} in ${countryOwner[tierLabelKey]} ` +
        `slot ${countryOwner[tierSlotKey]} (pure rank #${countryOwner[rankKey]}).`;
      continue;
    }

    if (state.buckets.Alpha.length < rules.maxPerTier && floors.alphaEligible) {
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
          `Assigned to Alpha because Community ${formatScore(floors.community)} and Pressure ${formatScore(floors.pressure)} clear the Alpha floor and ${city.country} had not yet claimed a public tier.`,
        );
        applyAlphaSeatAccounting(city, state);
        state.assignedCountry.set(city.country, [...countryOwners, city]);
        diagnostics.assignedTier = "Alpha";
        city[tierDiagnosticsKey] = diagnostics;
        continue;
      }
    }

    if (state.buckets.Beta.length < rules.maxPerTier && floors.betaEligible) {
      assignTier(
        city,
        "Beta",
        state.buckets,
        tierLabelKey,
        tierSlotKey,
        tierReasonKey,
        `Assigned to Beta because Community ${formatScore(floors.community)} and Pressure ${formatScore(floors.pressure)} clear the Beta floor, while Alpha was unavailable under the published caps or earlier selections.`,
      );
      state.assignedCountry.set(city.country, [...countryOwners, city]);
      diagnostics.assignedTier = "Beta";
      city[tierDiagnosticsKey] = diagnostics;
      continue;
    }

    if (state.buckets.Gamma.length < rules.maxPerTier) {
      const shortfall = [];
      if (!floors.alphaEligible) shortfall.push(`Alpha floor not met (${formatScore(floors.community)} Community, ${formatScore(floors.pressure)} Pressure)`);
      if (!floors.betaEligible) shortfall.push(`Beta floor not met (${formatScore(floors.community)} Community, ${formatScore(floors.pressure)} Pressure)`);

      assignTier(
        city,
        "Gamma",
        state.buckets,
        tierLabelKey,
        tierSlotKey,
        tierReasonKey,
        shortfall.length > 0
          ? `Assigned to Gamma because ${shortfall.join("; ")} and ${city.country} was still unclaimed.`
          : `Assigned to Gamma as the next highest-ranked unclaimed country after Alpha and Beta seats were allocated.`,
      );
      state.assignedCountry.set(city.country, [...countryOwners, city]);
      diagnostics.assignedTier = "Gamma";
      city[tierDiagnosticsKey] = diagnostics;
      continue;
    }

    city[tierReasonKey] = "No public tier assigned because Alpha, Beta, and Gamma were already full.";
    city[tierDiagnosticsKey] = diagnostics;
  }

  return decorated;
}
