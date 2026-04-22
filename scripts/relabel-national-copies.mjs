/**
 * relabel-national-copies.mjs
 *
 * Transparency fix: identify metrics where ≥2 cities in the same country
 * share identical raw values, then flip their dataLevel from "city" to
 * "national" so the scorecard UI reflects data reality.
 *
 * Not a score change. Only a label correction. This lets the Data Transparency
 * section on each scorecard show an honest "City-direct vs National proxy"
 * breakdown, and it tells a reviewer exactly how much of a given city's
 * published score rests on national proxies vs genuine city observations.
 *
 * Excludes metrics that are legitimately national (gdp_growth, healthcare_haq,
 * education, water_sanitation — country-level by design). Only flips metrics
 * where the copy-paste is misleading.
 *
 * Run:  node scripts/relabel-national-copies.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/publishedRankingData.json");

// Metrics that SHOULD show city-level variation (where copy-paste = hidden national proxy).
// For these, if ≥2 cities in the same country share identical raw values, flip to "national".
const CITY_METRICS = new Set([
  "pressure_disposable_income_ppp",
  "pressure_housing_burden",
  "viability_personal_safety",
  "viability_clean_air",
  "viability_digital_infrastructure",
  "viability_climate_sunlight_livability",
  "community_hospitality_belonging",
  "community_tolerance_pluralism",
  "community_cultural_historic_public_life_vitality",
  "creative_entrepreneurial_dynamism",
  "creative_administrative_investment_friction",
]);

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  // Group by country + metric
  const groups = new Map(); // key: "country|metric" → [{cityId, raw, metricRef}]
  for (const city of data.cities) {
    for (const [metric, m] of Object.entries(city.metrics ?? {})) {
      if (!CITY_METRICS.has(metric)) continue;
      if (m.raw == null) continue;
      const k = `${city.country}|${metric}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push({ cityId: city.cityId, raw: m.raw, metricRef: m });
    }
  }

  let flipped = 0;
  const byCountryMetric = {};
  for (const [key, rows] of groups) {
    if (rows.length < 2) continue;
    const vals = new Set(rows.map((r) => r.raw));
    if (vals.size !== 1) continue; // has real variation; keep as-is

    const [country, metric] = key.split("|");
    byCountryMetric[country] = byCountryMetric[country] || new Set();
    byCountryMetric[country].add(metric);

    for (const r of rows) {
      if (r.metricRef.dataLevel === "city") {
        r.metricRef.dataLevel = "national";
        flipped++;
      }
    }
  }

  data.updatedAt = new Date().toISOString();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log(`✓ Flipped ${flipped} metric entries from dataLevel="city" → "national"`);
  console.log(`  (every case where ≥2 cities in the same country had identical raw values)\n`);
  console.log(`Affected metric count by country:`);
  const countries = Object.keys(byCountryMetric).sort();
  for (const country of countries) {
    const metrics = byCountryMetric[country];
    console.log(`  ${country.padEnd(24)} ${metrics.size} metrics mislabeled as city-level`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
