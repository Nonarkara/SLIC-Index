#!/usr/bin/env node
/**
 * Derives src/data/publicationFacts.json from the published bundle.
 *
 * The facts the shell needs — how many cities, what the score range is, when
 * the bundle was published — were read straight out of the 1.9 MB city
 * dataset, and the masthead is in every route's entry graph. So the dataset
 * was in the entry graph, and every route preloaded 107 kB of compressed
 * city data to print a count in a search placeholder.
 *
 * The facts are derived, never hand-written: this script reads the bundle and
 * writes them, and `--check` fails when the file on disk disagrees with the
 * bundle it came from. A stale count cannot reach the site, because the
 * build runs this first and the release gate checks it after.
 *
 *   node scripts/derive-publication-facts.mjs           # write
 *   node scripts/derive-publication-facts.mjs --check   # fail on drift
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const BUNDLE = join(root, "src/data/publishedRankingData.json");
const FACTS = join(root, "src/data/publicationFacts.json");

/* The fallbacks are the ones publicationMeta.ts used before the facts were
   split out. They have to match exactly, or a bundle without a manifest
   would print a different date than the code says it should. */
const FALLBACK_GENERATED_AT = "2026-07-04T00:00:00.000Z";
const FALLBACK_SCORER_VERSION = "slic-v3.4.0";
const FALLBACK_TIER_POLICY_VERSION = "public-tier-v1.3.0";

const publishedData = JSON.parse(readFileSync(BUNDLE, "utf8"));
const manifest = publishedData.publicationManifest ?? {};
const cities = publishedData.cities ?? [];

const rankedScores = cities
  .filter((c) => c.rankingStatus === "Ranked" && typeof c.slicScore === "number")
  .map((c) => c.slicScore)
  .sort((a, b) => a - b);

function median(values) {
  if (!values.length) return 0;
  const mid = values.length >> 1;
  const value = values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  return Math.round(value);
}

const cityRanked = cities.filter((c) => c.rankingStatus === "Ranked").length;

const facts = {
  generatedAt: manifest.generatedAt ?? FALLBACK_GENERATED_AT,
  scorerVersion: manifest.scorerVersion ?? FALLBACK_SCORER_VERSION,
  tierPolicyVersion: manifest.tierPolicyVersion ?? FALLBACK_TIER_POLICY_VERSION,
  cityTotal: cities.length,
  cityRanked,
  cityWatchlist: cities.length - cityRanked,
  scoreMin: rankedScores.length ? Math.round(rankedScores[0]) : 0,
  scoreMedian: median(rankedScores),
  scoreMax: rankedScores.length ? Math.round(rankedScores[rankedScores.length - 1]) : 100,
};

const serialised = `${JSON.stringify(facts, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let onDisk = "";
  try {
    onDisk = readFileSync(FACTS, "utf8");
  } catch {
    console.error("FAIL  src/data/publicationFacts.json does not exist — run: node scripts/derive-publication-facts.mjs");
    process.exit(1);
  }
  if (onDisk !== serialised) {
    console.error("FAIL  src/data/publicationFacts.json disagrees with the published bundle.");
    console.error("      The bundle says:", JSON.stringify(facts));
    console.error("      The file says:  ", onDisk.trim());
    console.error("      Run: node scripts/derive-publication-facts.mjs");
    process.exit(1);
  }
  console.log(`PASS  the publication facts match the bundle (${facts.cityTotal} cities, ${facts.cityRanked} ranked).`);
} else {
  writeFileSync(FACTS, serialised);
  console.log(
    `wrote src/data/publicationFacts.json — ${facts.cityTotal} cities, ${facts.cityRanked} ranked, scores ${facts.scoreMin}–${facts.scoreMax}, published ${facts.generatedAt.slice(0, 10)}.`,
  );
}
