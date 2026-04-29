import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import publication from "../src/data/publishedRankingData.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FIXTURE_DIR = path.join(ROOT, "test", "fixtures");
const FIXTURE_PATH = path.join(FIXTURE_DIR, "publication-benchmark-fixture.json");

const BENCHMARK_CITY_NAMES = [
  "Raleigh",
  "Montreal",
  "Kaohsiung",
  "Singapore",
  "Bangkok",
  "Tokyo",
];

function pickCity(displayName) {
  const city = publication.cities.find((entry) => entry.displayName === displayName);
  if (!city) {
    throw new Error(`Benchmark city not found: ${displayName}`);
  }
  return {
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    rankingStatus: city.rankingStatus,
    rank: city.rank,
    tierLabel: city.tierLabel ?? null,
    tierSlot: city.tierSlot ?? null,
    coverageGrade: city.coverageGrade,
    slicScore: city.slicScore,
    slicScoreExact: city.slicScoreExact ?? null,
    pressureScoreExact: city.pressureScoreExact ?? null,
    viabilityScoreExact: city.viabilityScoreExact ?? null,
    capabilityScoreExact: city.capabilityScoreExact ?? null,
    communityScoreExact: city.communityScoreExact ?? null,
    creativeScoreExact: city.creativeScoreExact ?? null,
  };
}

const fixture = {
  generatedFromPublicationHash: publication.publicationManifest?.publicationHash ?? null,
  scorerVersion: publication.publicationManifest?.scorerVersion ?? null,
  tierPolicyVersion: publication.publicationManifest?.tierPolicyVersion ?? null,
  benchmarkCities: BENCHMARK_CITY_NAMES.map((displayName) => pickCity(displayName)),
};

await mkdir(FIXTURE_DIR, { recursive: true });
await writeFile(FIXTURE_PATH, JSON.stringify(fixture, null, 2) + "\n");

console.log(`Wrote ${FIXTURE_PATH}`);
