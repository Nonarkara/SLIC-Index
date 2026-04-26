import publication from "../src/data/publishedRankingData.json" with { type: "json" };
import {
  DIAGNOSTIC_METRIC_COUNT,
  SCORED_METRIC_COUNT,
} from "../src/publicationMath.js";
import {
  compareCitiesByPublishedScore,
  PUBLIC_TIER_RULES,
} from "../src/publicTierPolicy.js";

const EXPECTED_ALPHA = [
  "Raleigh",
  "Montreal",
  "Kaohsiung",
  "Eindhoven",
  "Graz",
  "Taipei",
  "Jeju City",
  "Valparaiso",
  "Bangkok",
  "Fukuoka",
];

const REQUIRED_BETA = ["Lyon", "Prague", "Tokyo", "Perth", "Dunedin"];

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function isHexHash(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

const errors = [];
const ranked = publication.cities
  .filter((city) => city.rankingStatus === "Ranked" && city.rank > 0)
  .slice()
  .sort((left, right) => left.rank - right.rank);
const tiered = ranked.filter((city) => city.tierLabel);

for (let index = 1; index < ranked.length; index += 1) {
  const previous = ranked[index - 1];
  const current = ranked[index];
  const compare = compareCitiesByPublishedScore(previous, current, "slicScoreExact");
  assert(
    compare <= 0,
    `Exact score order violation between #${previous.rank} ${previous.displayName} and #${current.rank} ${current.displayName}.`,
    errors,
  );
}

const countryCaps = new Map([
  ["Taiwan", PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers ?? 1],
  ["Japan", PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1],
]);
const countryCounts = new Map();
for (const city of tiered) {
  countryCounts.set(city.country, (countryCounts.get(city.country) ?? 0) + 1);
}
for (const [country, count] of countryCounts.entries()) {
  const cap = countryCaps.get(country) ?? 1;
  assert(
    count <= cap,
    `Public tier country cap breach for ${country}: ${count} > ${cap}.`,
    errors,
  );
}

const alpha = tiered.filter((city) => city.tierLabel === "Alpha");
const beta = tiered.filter((city) => city.tierLabel === "Beta");
const gamma = tiered.filter((city) => city.tierLabel === "Gamma");

assert(alpha.length === 10, `Expected 10 Alpha cities, found ${alpha.length}.`, errors);
assert(beta.length === 10, `Expected 10 Beta cities, found ${beta.length}.`, errors);
assert(gamma.length === 10, `Expected 10 Gamma cities, found ${gamma.length}.`, errors);

assert(
  JSON.stringify(alpha.map((city) => city.displayName)) === JSON.stringify(EXPECTED_ALPHA),
  `Alpha tier drifted from the expected snapshot.\nExpected: ${EXPECTED_ALPHA.join(", ")}\nActual: ${alpha.map((city) => city.displayName).join(", ")}`,
  errors,
);

for (const cityName of REQUIRED_BETA) {
  assert(
    beta.some((city) => city.displayName === cityName),
    `${cityName} is expected in Beta for the current snapshot.`,
    errors,
  );
}

const alphaEurope = alpha.filter((city) => String(city.region).includes("Europe")).length;
const alphaOceania = alpha.filter((city) => String(city.region).includes("Oceania")).length;
const alphaTaiwan = alpha.filter((city) => city.country === "Taiwan").length;
const alphaSouthKorea = alpha.filter((city) => city.country === "South Korea").length;
const alphaJapan = alpha.filter((city) => city.country === "Japan").length;
const alphaIsrael = alpha.filter((city) => city.country === "Israel").length;

assert(alphaEurope <= PUBLIC_TIER_RULES.maxEuropeInAlpha, "Alpha Europe cap breached.", errors);
assert(alphaOceania <= PUBLIC_TIER_RULES.maxOceaniaInAlpha, "Alpha Oceania cap breached.", errors);
assert(alphaTaiwan <= PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers, "Alpha Taiwan cap breached.", errors);
assert(alphaSouthKorea <= PUBLIC_TIER_RULES.maxSouthKoreaInAlpha, "Alpha South Korea cap breached.", errors);
assert(alphaJapan <= PUBLIC_TIER_RULES.maxJapanInAlpha, "Alpha Japan cap breached.", errors);
assert(alphaIsrael === 0, "Alpha includes Israel despite the current exclusion rule.", errors);

const singapore = publication.cities.find((city) => city.displayName === "Singapore");
const bangkok = publication.cities.find((city) => city.displayName === "Bangkok");

assert(singapore?.tierLabel === "Gamma", "Singapore should be Gamma in the current snapshot.", errors);
assert(bangkok?.tierLabel === "Alpha", "Bangkok should be Alpha in the current snapshot.", errors);

const watchlistWithTiers = publication.cities.filter(
  (city) => city.rankingStatus !== "Ranked" && city.tierLabel != null,
);
assert(watchlistWithTiers.length === 0, "Watchlist cities must not hold public tiers.", errors);

const metricCatalogEntries = Object.values(publication.metricCatalog ?? {});
const scoredCount = metricCatalogEntries.filter((entry) => entry?.scored === true).length;
const diagnosticCount = metricCatalogEntries.filter((entry) => entry?.diagnostic === true).length;
assert(scoredCount === SCORED_METRIC_COUNT, `Expected ${SCORED_METRIC_COUNT} scored metrics, found ${scoredCount}.`, errors);
assert(diagnosticCount === DIAGNOSTIC_METRIC_COUNT, `Expected ${DIAGNOSTIC_METRIC_COUNT} diagnostic metrics, found ${diagnosticCount}.`, errors);

assert(isHexHash(publication.publicationManifest?.normStatsHash), "Missing or invalid normStatsHash.", errors);
assert(isHexHash(publication.publicationManifest?.inputDataHash), "Missing or invalid inputDataHash.", errors);
assert(isHexHash(publication.publicationManifest?.metricCatalogHash), "Missing or invalid metricCatalogHash.", errors);
assert(isHexHash(publication.publicationManifest?.publicationHash), "Missing or invalid publicationHash.", errors);

assert(publication.methodologyFacts?.workedExample != null, "methodologyFacts.workedExample is missing.", errors);
assert(publication.stabilityAnalysis != null, "stabilityAnalysis is missing.", errors);
assert(
  Array.isArray(publication.stabilityAnalysis?.scenarios) && publication.stabilityAnalysis.scenarios.length === 4,
  "stabilityAnalysis should expose four floor-sensitivity scenarios.",
  errors,
);
assert(publication.diagnostics?.integrity?.issueCount === 0, "diagnostics.integrity.issueCount must be 0.", errors);

if (errors.length > 0) {
  console.error("Publication integrity check failed:");
  for (const message of errors) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("Publication integrity check passed.");
console.log(`Ranked cities: ${ranked.length}`);
console.log(`Alpha: ${alpha.map((city) => city.displayName).join(", ")}`);
console.log(`Singapore: #${singapore.rank} ${singapore.tierLabel} | Bangkok: #${bangkok.rank} ${bangkok.tierLabel}`);
