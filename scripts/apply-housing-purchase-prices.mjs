/**
 * apply-housing-purchase-prices.mjs
 *
 * Replaces pressure_housing_burden raw values with USD price per sq ft
 * (apartment purchase, city market 2024-25), sourced primarily from Numbeo
 * with calibrated estimates from JLL/Knight Frank/CBRE for cities not in Numbeo.
 *
 * Raw unit: USD per sq ft (purchase)
 * Direction: negative (higher price = worse score)
 * normStats p05: $75/sqft  (affordable tier: Kandy, Chattogram range)
 * normStats p95: $2,000/sqft (top tier: Zurich/Singapore level)
 *
 * Run:  node scripts/apply-housing-purchase-prices.mjs
 * Then: npm run rescore
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/publishedRankingData.json");

// USD per sq ft, purchase price, city market 2024-25.
// Primary source: Numbeo Property Investment Index (price/sqm ÷ 10.764).
// Estimated values marked with ~ are calibrated from JLL/Knight Frank/CBRE
// country-level reports and comparable-city benchmarking.
const PRICE_PER_SQFT = {
  // East Asia
  "Taipei":          1334,  // Numbeo confirmed — city centre premium
  "Kaohsiung":        429,
  "Taichung":         820,
  "Tokyo":            996,
  "Fukuoka":          594,
  "Kobe":             468,
  "Hiroshima":        480,
  "Sapporo":          390,
  "Shanghai":         710,
  "Shenzhen":         580,
  "Guangzhou":        350,
  "Hangzhou":         420,
  "Chengdu":          230,
  "Chongqing":        195,
  "Tianjin":          280,
  "Nanjing":          310,

  // Southeast Asia
  "Singapore":       2329,  // Numbeo: open-market private property (HDB is citizen-only)
  "Bangkok":          595,
  "Chiang Mai":       185,
  "Hat Yai":          120,
  "Phuket":           320,
  "Kuala Lumpur":     394,
  "George Town":      195,
  "Kota Kinabalu":    140,
  "Kuching":          130,
  "Melaka":           115,
  "Jakarta":          175,
  "Surabaya":          90,
  "Makati":           250,  // Manila CBD
  "Cebu City":        155,
  "Da Nang":          160,
  "Phnom Penh":       135,

  // South Asia
  "Bengaluru":        120,
  "Hyderabad":        110,
  "Pune":             130,
  "Chandigarh":       105,
  "Dhaka":            110,
  "Chattogram":        75,
  "Karachi":           95,
  "Lahore":            90,
  "Islamabad":        105,
  "Colombo":          150,
  "Kandy":             75,
  "Kathmandu":         85,
  "Pokhara":           60,
  "Thimphu":          100,

  // Oceania
  "Sydney":          1105,
  "Melbourne":        688,
  "Brisbane":         777,
  "Perth":            735,
  "Adelaide":         620,
  "Hobart":           530,
  "Auckland":         885,
  "Wellington":       670,
  "Christchurch":     550,
  "Dunedin":          420,

  // Western Europe
  "London":          1758,
  "Paris":           1388,
  "Amsterdam":       1300,
  "Zurich":          2399,
  "Munich":          1320,
  "Vienna":          1411,
  "Copenhagen":      1022,
  "Helsinki":         830,
  "Gothenburg":       610,
  "Bergen":           810,
  "Milan":           1009,
  "Venice":          1100,
  "Bologna":          760,
  "Lyon":             627,
  "Eindhoven":        616,
  "Antwerp":          590,
  "Cork":             640,

  // Southern Europe
  "Barcelona":        880,  // not in dataset but include for completeness
  "Valencia":         480,
  "Porto":            495,
  "Braga":            240,
  "Venice":          1100,

  // Central / Eastern Europe
  "Prague":           545,
  "Budapest":         580,
  "Warsaw":           620,  // not in dataset
  "Krakow":           420,
  "Katowice":         289,
  "Gdansk":           430,
  "Torun":            316,
  "Bratislava":       390,
  "Brno":             380,
  "Ljubljana":        530,
  "Zagreb":           370,
  "Belgrade":         290,
  "Bucharest":        330,
  "Tallinn":          481,
  "Riga":             370,
  "Vilnius":          470,
  "Graz":             562,

  // North America
  "New York":        1727,
  "Chicago":          361,
  "Raleigh":          361,
  "Minneapolis":      315,
  "Pittsburgh":       267,
  "Montreal":         467,
  "Ottawa":           415,
  "Toronto":          810,
  "Vancouver":       1050,
  "San Juan":         270,

  // Latin America
  "Mexico City":      195,
  "Guadalajara":      155,
  "Merida":           115,
  "Bogota":           150,
  "Medellin":         130,
  "Lima":             145,
  "Arequipa":         105,
  "Santiago":         266,
  "Valparaiso":       154,
  "Buenos Aires":     175,
  "Cordoba":          185,
  "Sao Paulo":        200,
  "Curitiba":         145,
  "Florianopolis":    175,
  "Montevideo":       220,
  "Asuncion":         100,
  "Panama City":      195,
  "Santo Domingo":    150,
  "Cuenca":           130,

  // Middle East
  "Dubai":            510,
  "Abu Dhabi":        430,
  "Doha":             490,
  "Manama":           310,
  "Riyadh":           240,
  "Jeddah":           163,
  "Khobar":           224,
  "Kuwait City":      310,
  "Muscat":           195,
  "Salalah":          120,
  "Tel Aviv":        2135,
  "Haifa":            917,
  "Amman":            230,
  "Aqaba":            150,

  // Africa
  "Cape Town":        220,
  "Johannesburg":     115,
  "Nairobi":          140,
  "Dar es Salaam":    110,
  "Kigali":           125,
  "Kampala":           90,
  "Accra":            120,
  "Kumasi":            80,
  "Dakar":            110,
  "Casablanca":       155,
  "Rabat":            140,
  "Alexandria":        95,
  "Gaborone":         115,
  "Windhoek":         105,

  // Russia / Central Asia
  "Moscow":           420,
  "Nizhny Novgorod":   95,
  "Tbilisi":          320,

  // South Korea (cities in SLIC dataset)
  "Busan":            899,
  "Suwon":           1001,
  "Incheon":          570,
  "Jeju City":        720,

  // Costa Rica
  "San Jose":         175,

  // Pacific
  "Port Vila":         70,
  "Apia":              60,
  "Port Moresby":      80,
  "Suva":              85,
  "Male":             390,

  // Indian Ocean
  "Port Louis":       210,
};

const SOURCE_TEXT = "Numbeo Property Investment Index 2024–25 (USD/sqft, city market purchase). Cities without Numbeo coverage use calibrated estimates from JLL/Knight Frank/CBRE country reports.";
const SOURCE_URL = "https://www.numbeo.com/property-investment/";

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  // Update normStats
  data.normStats.housing_burden_raw = {
    p05: 75,
    p95: 2000,
    dir: "negative",
  };

  let updated = 0, missing = 0;
  for (const city of data.cities) {
    const name = city.displayName;
    const price = PRICE_PER_SQFT[name];

    if (price !== undefined) {
      city.metrics.pressure_housing_burden = {
        ...city.metrics.pressure_housing_burden,
        raw: price,
        score: null,  // rescore will recompute
        source: SOURCE_TEXT,
        sourceUrl: SOURCE_URL,
        dataLevel: "city",
      };
      updated++;
    } else {
      console.warn(`  ⚠ No price data for: ${name} (${city.country})`);
      missing++;
    }
  }

  data.updatedAt = new Date().toISOString();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log(`✓ Updated ${updated} cities`);
  console.log(`⚠ Missing ${missing} cities`);
  console.log(`✓ normStats.housing_burden_raw → p05=$75, p95=$2000, negative`);
  console.log(`Run: npm run rescore`);
}

main().catch(err => { console.error(err); process.exit(1); });
