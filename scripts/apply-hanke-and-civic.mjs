/**
 * apply-hanke-and-civic.mjs
 *
 * One-shot migration that:
 *   1. Adds normStats entries for the two new metrics
 *   2. Inserts `pressure_economic_stress_hanke` into every city's metrics
 *      using the country-level Hanke Annual Misery Index 2025 score
 *   3. Inserts `community_civic_freedom_dignity` into every city's metrics
 *      using the country-level civic-freedom composite (HRMI + FH + V-Dem)
 *
 * Idempotent: re-running just overwrites the same fields. Run once after
 * patch-data-errors.mjs and before rescore-all-cities.mjs.
 *
 * Run:  node scripts/apply-hanke-and-civic.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/publishedRankingData.json");

// Inline the data (these files are TS — at runtime we read them as JSON-like)
const HANKE_2025_BY_COUNTRY = {
  "Taiwan": { score: 2.12, published: true },
  "Singapore": { score: 2.59, published: true },
  "Thailand": { score: 3.14, published: true },
  "Ireland": { score: 5.35, published: true },
  "Japan": { score: 7.20, published: true },
  "Qatar": { score: 7.24, published: true },
  "United States": { score: 16.99, published: true },
  "United Kingdom": { score: 19.57, published: true },
  "Australia": { score: 19.31, published: true },
  "Argentina": { score: 88.35, published: true },
  "South Africa": { score: 79.03, published: true },
  "Switzerland": { score: 9.5, published: false },
  "Norway": { score: 13.2, published: false },
  "Sweden": { score: 16.5, published: false },
  "Denmark": { score: 13.8, published: false },
  "Finland": { score: 17.0, published: false },
  "Germany": { score: 17.0, published: false },
  "Netherlands": { score: 14.5, published: false },
  "Belgium": { score: 16.0, published: false },
  "Austria": { score: 16.0, published: false },
  "France": { score: 22.0, published: false },
  "Italy": { score: 25.0, published: false },
  "Spain": { score: 28.0, published: false },
  "Portugal": { score: 18.0, published: false },
  "Czechia": { score: 19.0, published: false },
  "Slovakia": { score: 21.0, published: false },
  "Slovenia": { score: 16.5, published: false },
  "Hungary": { score: 22.0, published: false },
  "Poland": { score: 17.5, published: false },
  "Romania": { score: 18.0, published: false },
  "Estonia": { score: 18.5, published: false },
  "Latvia": { score: 19.5, published: false },
  "Lithuania": { score: 18.0, published: false },
  "Croatia": { score: 21.0, published: false },
  "Serbia": { score: 24.0, published: false },
  "South Korea": { score: 11.5, published: false },
  "China": { score: 8.5, published: false },
  "Vietnam": { score: 12.0, published: false },
  "Indonesia": { score: 17.0, published: false },
  "Philippines": { score: 19.0, published: false },
  "Malaysia": { score: 14.5, published: false },
  "India": { score: 18.5, published: false },
  "Bangladesh": { score: 32.0, published: false },
  "Pakistan": { score: 50.0, published: false },
  "Sri Lanka": { score: 60.0, published: false },
  "Nepal": { score: 24.0, published: false },
  "Bhutan": { score: 18.0, published: false },
  "Maldives": { score: 20.0, published: false },
  "Cambodia": { score: 16.0, published: false },
  "United Arab Emirates": { score: 11.0, published: false },
  "Bahrain": { score: 11.5, published: false },
  "Saudi Arabia": { score: 16.0, published: false },
  "Kuwait": { score: 14.0, published: false },
  "Oman": { score: 13.0, published: false },
  "Jordan": { score: 38.0, published: false },
  "Israel": { score: 18.0, published: false },
  "Egypt": { score: 50.0, published: false },
  "Morocco": { score: 25.0, published: false },
  "Tanzania": { score: 28.0, published: false },
  "Kenya": { score: 30.0, published: false },
  "Ghana": { score: 35.0, published: false },
  "Senegal": { score: 26.0, published: false },
  "Uganda": { score: 32.0, published: false },
  "Rwanda": { score: 22.0, published: false },
  "Mauritius": { score: 18.0, published: false },
  "Botswana": { score: 38.0, published: false },
  "Namibia": { score: 50.0, published: false },
  "Mexico": { score: 22.0, published: false },
  "Brazil": { score: 30.0, published: false },
  "Chile": { score: 21.0, published: false },
  "Colombia": { score: 27.0, published: false },
  "Peru": { score: 23.0, published: false },
  "Ecuador": { score: 28.0, published: false },
  "Paraguay": { score: 22.0, published: false },
  "Uruguay": { score: 24.0, published: false },
  "Costa Rica": { score: 21.0, published: false },
  "Panama": { score: 19.0, published: false },
  "Dominican Republic": { score: 22.0, published: false },
  "Puerto Rico": { score: 24.0, published: false },
  "Canada": { score: 18.0, published: false },
  "New Zealand": { score: 21.5, published: false },
  "Russia": { score: 35.0, published: false },
  "Georgia": { score: 25.0, published: false },
  "Fiji": { score: 26.0, published: false },
  "Samoa": { score: 24.0, published: false },
  "Vanuatu": { score: 26.0, published: false },
  "Papua New Guinea": { score: 32.0, published: false },
};

const CIVIC_FREEDOM_BY_COUNTRY = {
  "Norway": 92, "Sweden": 90, "Finland": 90, "Denmark": 90, "Netherlands": 86,
  "Belgium": 84, "Germany": 86, "Austria": 83, "Switzerland": 89, "Ireland": 88,
  "Canada": 87, "Australia": 85, "New Zealand": 89, "Estonia": 82, "Lithuania": 80,
  "Latvia": 78, "France": 79, "United Kingdom": 81, "Italy": 77, "Portugal": 83,
  "Spain": 80, "Czechia": 80, "Slovenia": 80, "Slovakia": 75, "Japan": 80,
  "Taiwan": 81, "Uruguay": 82, "Costa Rica": 82,
  "United States": 74, "South Korea": 72, "Israel": 66, "Chile": 78, "Argentina": 70,
  "Panama": 68, "Mauritius": 70, "Botswana": 68, "South Africa": 72, "Romania": 70,
  "Hungary": 60, "Croatia": 68, "Poland": 68, "Brazil": 64, "Mexico": 58, "Peru": 58,
  "Colombia": 58, "Ghana": 63, "Senegal": 62, "Maldives": 60, "Bhutan": 58,
  "India": 52, "Indonesia": 50, "Philippines": 49, "Sri Lanka": 50, "Nepal": 56,
  "Tanzania": 48, "Kenya": 50, "Namibia": 70, "Fiji": 55, "Samoa": 62, "Vanuatu": 65,
  "Papua New Guinea": 55, "Dominican Republic": 58, "Paraguay": 55, "Ecuador": 52,
  "Georgia": 55, "Serbia": 50,
  "Singapore": 39, "Malaysia": 48, "Thailand": 40, "Pakistan": 38, "Bangladesh": 38,
  "Morocco": 38, "Jordan": 29, "Cambodia": 26, "Vietnam": 26, "Russia": 17,
  "Uganda": 38, "Rwanda": 24, "Kuwait": 32, "Egypt": 24,
  "Bahrain": 20, "United Arab Emirates": 22, "Qatar": 23, "Saudi Arabia": 13,
  "Oman": 21, "China": 13,
};

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  // ── Update normStats ──────────────────────────────────────────────────────
  // Hanke distribution: median 21.85, mean 31.64. Frozen p05/p95.
  data.normStats.hanke_misery_raw = {
    p05: 4.0,
    p95: 90.0,
    dir: "negative",
  };
  // Civic-freedom: composite range observed 13-92. Frozen.
  data.normStats.civic_freedom_raw = {
    p05: 13,
    p95: 92,
    dir: "positive",
  };

  // ── Apply per-city ────────────────────────────────────────────────────────
  let hankePopulated = 0, civicPopulated = 0, missingHanke = 0, missingCivic = 0;
  for (const city of data.cities) {
    const country = city.country;

    // Hanke
    const hanke = HANKE_2025_BY_COUNTRY[country];
    if (hanke) {
      city.metrics.pressure_economic_stress_hanke = {
        raw: hanke.score,
        score: null,  // rescore-all-cities will compute
        source: hanke.published
          ? `Hanke Annual Misery Index 2025 (published): ${country} score ${hanke.score}`
          : `Hanke Annual Misery Index 2025 (estimated from IMF/WB/national-bank macroeconomic profile): ${country} ≈ ${hanke.score}`,
        sourceUrl: "https://fortune.com/2026/04/16/hanke-annual-misery-index-2025-venezuela-taiwan-rankings/",
        dataLevel: "national",
      };
      hankePopulated++;
    } else {
      city.metrics.pressure_economic_stress_hanke = {
        raw: null,
        score: null,
        source: "Hanke Annual Misery Index 2025: country not in published list",
        sourceUrl: "",
        dataLevel: "missing",
      };
      missingHanke++;
    }

    // Civic freedom
    const civic = CIVIC_FREEDOM_BY_COUNTRY[country];
    if (civic !== undefined) {
      city.metrics.community_civic_freedom_dignity = {
        raw: civic,
        score: null,
        source: `Civic Freedom Composite: 0.4 × HRMI Empowerment + 0.3 × Freedom House FIW + 0.3 × V-Dem Liberal Democracy Index (×100). ${country} composite = ${civic}`,
        sourceUrl: "https://rightstracker.org/",
        dataLevel: "national",
      };
      civicPopulated++;
    } else {
      city.metrics.community_civic_freedom_dignity = {
        raw: null,
        score: null,
        source: "Civic Freedom Composite: country not yet in dataset",
        sourceUrl: "",
        dataLevel: "missing",
      };
      missingCivic++;
    }
  }

  data.updatedAt = new Date().toISOString();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log(`✓ Hanke:        ${hankePopulated}/${data.cities.length} populated, ${missingHanke} missing`);
  console.log(`✓ Civic Freedom: ${civicPopulated}/${data.cities.length} populated, ${missingCivic} missing`);
  console.log(`✓ normStats updated for hanke_misery_raw and civic_freedom_raw`);
  console.log(`Run rescore-all-cities.mjs next.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
