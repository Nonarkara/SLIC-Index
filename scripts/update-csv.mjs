/**
 * Regenerates public/downloads/slic-ranked-cities-v2.csv
 * Appends 13 new columns: population, national share, industries, 6 metrics, 3 peer cities
 *
 * Run from project root: node scripts/update-csv.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/* ── Load cityContext.ts — extract just the object literal after '=' ── */
const ctxTs = readFileSync(join(root, "src/data/cityContext.ts"), "utf8");
// Find the position of the opening brace of the CITY_CONTEXT object value
const eqIdx = ctxTs.indexOf("= {", ctxTs.indexOf("CITY_CONTEXT"));
const objStart = ctxTs.indexOf("{", eqIdx);
// Match balanced braces to find end
let depth = 0, objEnd = -1;
for (let i = objStart; i < ctxTs.length; i++) {
  if (ctxTs[i] === "{") depth++;
  else if (ctxTs[i] === "}") { depth--; if (depth === 0) { objEnd = i; break; } }
}
const ctxBody = ctxTs.slice(objStart, objEnd + 1);
const CITY_CONTEXT = new Function("return " + ctxBody)();

/* ── Load ranking data ── */
const publishedData = JSON.parse(readFileSync(join(root, "src/data/publishedRankingData.json"), "utf8"));
const allCities = publishedData.cities ?? [];
const ranked = allCities
  .filter((c) => c.rankingStatus === "Ranked")
  .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));

/* ── Pillar distance for peer matching ── */
const PILLARS = ["pressure", "viability", "capability", "community", "creative"];

function pillarDist(a, b) {
  return PILLARS.reduce((sum, p) => {
    const ak = a[`${p}Score`] ?? 50;
    const bk = b[`${p}Score`] ?? 50;
    return sum + Math.pow(ak - bk, 2);
  }, 0);
}

function findPeers(target, allRanked) {
  return allRanked
    .filter((c) => c.cityId !== target.cityId)
    .map((c) => ({ city: c, dist: pillarDist(target, c) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3)
    .map(({ city }) => city.displayName);
}

/* ── Metric helper ── */
function metricRaw(city, key) {
  const m = city.metrics?.[key];
  if (!m || m.raw === null || m.raw === undefined) return "";
  return m.raw;
}

/* ── Build CSV ── */
const headers = [
  "rank", "cityId", "displayName", "country", "region", "cityType",
  "slicScore", "pressureScore", "viabilityScore", "capabilityScore", "communityScore", "creativeScore",
  "coverageGrade", "overallWeightedCoverage", "rankingStatus",
  // New columns
  "populationM", "countryPopM", "nationalSharePct", "industries",
  "birthRate", "workingHrsPerWk", "waterAccessPct", "broadbandPer100", "climateScore", "gdpGrowthPct",
  "peer1", "peer2", "peer3",
];

function csvVal(v) {
  if (v === null || v === undefined || v === "") return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const rows = [headers.join(",")];

for (const city of ranked) {
  const ctx = CITY_CONTEXT[city.cityId];
  const peers = findPeers(city, ranked);

  const birthRate = metricRaw(city, "community_birth_rate_optimism");
  const workingHrs = metricRaw(city, "pressure_working_time_pressure");
  const waterAccess = metricRaw(city, "viability_water_sanitation_utility");
  const broadband = metricRaw(city, "viability_digital_infrastructure");
  const climate = metricRaw(city, "viability_climate_sunlight_livability");
  const gdpGrowth = metricRaw(city, "pressure_economic_growth_momentum");

  const row = [
    city.rank,
    city.cityId,
    city.displayName,
    city.country,
    city.region,
    city.cityType ?? "",
    city.slicScore,
    city.pressureScore,
    city.viabilityScore,
    city.capabilityScore,
    city.communityScore,
    city.creativeScore,
    city.coverageGrade,
    city.overallWeightedCoverage ?? "",
    city.rankingStatus,
    // New
    ctx ? ctx.cityPop : "",
    ctx ? ctx.countryPop : "",
    ctx ? ((ctx.cityPop / ctx.countryPop) * 100).toFixed(1) : "",
    ctx ? ctx.industries.join("; ") : "",
    birthRate !== "" ? Number(birthRate).toFixed(2) : "",
    workingHrs !== "" ? Number(workingHrs).toFixed(1) : "",
    waterAccess !== "" ? Number(waterAccess).toFixed(1) : "",
    broadband !== "" ? Number(broadband).toFixed(1) : "",
    climate !== "" ? Number(climate).toFixed(1) : "",
    gdpGrowth !== "" ? Number(gdpGrowth).toFixed(2) : "",
    peers[0] ?? "",
    peers[1] ?? "",
    peers[2] ?? "",
  ];

  rows.push(row.map(csvVal).join(","));
}

const csvPath = join(root, "public/downloads/slic-ranked-cities-v2.csv");
writeFileSync(csvPath, rows.join("\n") + "\n", "utf8");

console.log(`Written: ${csvPath}`);
console.log(`Rows: ${rows.length - 1} cities + 1 header = ${rows.length} lines`);
console.log(`Columns: ${headers.length}`);

// Spot-check Bangkok and Singapore
const bkk = ranked.find((c) => c.cityId === "th-bangkok");
const sgp = ranked.find((c) => c.cityId === "sg-singapore");
if (bkk) {
  const ctx = CITY_CONTEXT["th-bangkok"];
  console.log(`\nBangkok: pop=${ctx?.cityPop}M, share=${ctx ? ((ctx.cityPop / ctx.countryPop) * 100).toFixed(1) : "?"}%, industries=${ctx?.industries.join("; ")}`);
}
if (sgp) {
  const ctx = CITY_CONTEXT["sg-singapore"];
  console.log(`Singapore: pop=${ctx?.cityPop}M, share=${ctx ? ((ctx.cityPop / ctx.countryPop) * 100).toFixed(1) : "?"}%`);
}
