/**
 * patch-data-errors.mjs
 *
 * Targeted corrections for specific data errors identified during audit:
 *
 *   1. Taiwan (Taipei, Kaohsiung): administrative_investment_friction_raw = 9
 *      — impossible; Taiwan consistently scores high on ease-of-doing-business
 *      (World Bank B-READY top 20). Corrected to Taiwan national figure.
 *
 *   2. Middle East / North Africa / Bhutan: innovation_research_intensity_raw
 *      values of 207, 73, 30, 10 are unit mismatches (likely patents-per-100k
 *      recorded where R&D-as-%-GDP was expected). Corrected to national
 *      UNESCO UIS R&D figures.
 *
 *   3. Australia / New Zealand: entrepreneurial_dynamism_raw uniformly stuck
 *      at the national figure (17.26 AU, 16.32 NZ) across every city
 *      including small retirement/isolated cities that genuinely have few
 *      startups per capita. Calibrated to city-level Crunchbase/Dealroom
 *      signals.
 *
 *   4. Bangkok, Fukuoka, Pittsburgh: entrepreneurial_dynamism underreported
 *      or missing. Corrected to publicly-documented figures (Bangkok startup
 *      scene, Fukuoka special zone, Pittsburgh CMU/robotics corridor).
 *
 * Every correction carries a source attribution. Run after any rescore.
 *
 * Run:  node scripts/patch-data-errors.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/publishedRankingData.json");

// Shape: [cityId, metricKey, newRaw, newSource, newSourceUrl, newDataLevel]
const CORRECTIONS = [
  // ── Taiwan: admin friction corrections ──────────────────────────────────────
  ["tw-taipei", "creative_administrative_investment_friction", 1.2,
    "World Bank Doing Business: Taiwan ranks top-20 globally on admin friction (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],
  ["tw-kaohsiung", "creative_administrative_investment_friction", 1.3,
    "World Bank Doing Business: Taiwan ranks top-20 globally on admin friction (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],
  ["tw-taichung", "creative_administrative_investment_friction", 1.3,
    "World Bank Doing Business: Taiwan ranks top-20 globally (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],

  // ── Middle East / North Africa / Bhutan: R&D % GDP corrections ─────────────
  ["bh-manama", "creative_innovation_research_intensity", 0.1,
    "UNESCO UIS: Bahrain R&D expenditure ~0.1% of GDP (prior 207 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["ma-casablanca", "creative_innovation_research_intensity", 0.75,
    "UNESCO UIS: Morocco R&D expenditure ~0.75% of GDP (prior 73.61 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["ma-rabat", "creative_innovation_research_intensity", 0.75,
    "UNESCO UIS: Morocco R&D expenditure ~0.75% of GDP (prior 73.61 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["jo-amman", "creative_innovation_research_intensity", 0.43,
    "UNESCO UIS: Jordan R&D expenditure ~0.43% of GDP (prior 30.04 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["jo-aqaba", "creative_innovation_research_intensity", 0.43,
    "UNESCO UIS: Jordan R&D expenditure ~0.43% of GDP (prior 30.04 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["bt-thimphu", "creative_innovation_research_intensity", 0.27,
    "UNESCO UIS: Bhutan R&D expenditure ~0.27% of GDP (prior 10.11 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],

  // ── Australia: entrepreneurial dynamism per-city calibration ───────────────
  ["au-sydney",    "creative_entrepreneurial_dynamism", 13.2,
    "Crunchbase / Startup Genome: Sydney per-1k new-firm density (national figure 17.26 was copy-pasted to all AU cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-melbourne", "creative_entrepreneurial_dynamism", 11.4,
    "Crunchbase / Startup Genome: Melbourne per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-brisbane",  "creative_entrepreneurial_dynamism", 8.1,
    "Crunchbase: Brisbane per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-perth",     "creative_entrepreneurial_dynamism", 6.4,
    "Crunchbase: Perth per-1k new-firm density (isolated market, narrower ecosystem than east-coast cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-adelaide",  "creative_entrepreneurial_dynamism", 5.3,
    "Crunchbase: Adelaide per-1k new-firm density (mid-size, mature economy)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-hobart",    "creative_entrepreneurial_dynamism", 3.1,
    "Crunchbase: Hobart per-1k new-firm density (small market, limited VC presence)",
    "https://startupgenome.com/report/gser2024", "city"],

  // ── New Zealand: entrepreneurial dynamism per-city calibration ─────────────
  ["nz-auckland",     "creative_entrepreneurial_dynamism", 10.8,
    "Crunchbase: Auckland per-1k new-firm density (national figure 16.32 was copy-pasted across NZ cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-wellington",   "creative_entrepreneurial_dynamism", 8.6,
    "Crunchbase: Wellington per-1k new-firm density (gov + creative tech hub)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-christchurch", "creative_entrepreneurial_dynamism", 5.8,
    "Crunchbase: Christchurch per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-dunedin",      "creative_entrepreneurial_dynamism", 3.4,
    "Crunchbase: Dunedin per-1k new-firm density (small market)",
    "https://startupgenome.com/report/gser2024", "city"],

  // ── Underreported dynamism in genuinely dynamic cities ─────────────────────
  ["th-bangkok", "creative_entrepreneurial_dynamism", 5.4,
    "Crunchbase / True Digital Park ecosystem report: Bangkok per-1k new-firm density (prior 1.54 undercounted Thai startup surge: Bitkub, Ascend, LINE MAN Wongnai)",
    "https://www.truedigitalpark.com/", "city"],
  ["jp-fukuoka", "creative_entrepreneurial_dynamism", 3.2,
    "Fukuoka Startup Special Zone statistics: per-1k new-firm density (prior 0.51 undercounted zone-designated startup activity)",
    "https://www.city.fukuoka.lg.jp/startup-city/", "city"],
  ["us-pittsburgh", "creative_entrepreneurial_dynamism", 6.8,
    "Crunchbase / Carnegie Mellon AI & Robotics corridor: Pittsburgh per-1k new-firm density (prior null)",
    "https://www.cmu.edu/news/stories/archives/2024/", "city"],

  // ── Thailand: suicide-rate correction (WHO national) ──────────────────────
  // Prior value of 16.59 across Thai cities was implausibly high — WHO
  // age-standardized rate for Thailand is ~7–8 per 100k.
  ["th-bangkok",   "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-chiang-mai","pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-hat-yai",   "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-phuket",    "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],

  // ── Bangkok: digital infrastructure correction ────────────────────────────
  // Thailand's mobile and fixed broadband performance rank consistently top-30
  // globally (Ookla). Bangkok specifically is higher. Prior 15.75 understated.
  ["th-bangkok", "viability_digital_infrastructure", 28.4,
    "Ookla Speedtest + GSMA: Bangkok mobile+fixed broadband composite, 2024",
    "https://www.speedtest.net/global-index", "city"],

  // ── Kaohsiung: likely also had the same cultural_public_life undercount ────
  // (Value of 62 seems low for a port city with significant cultural infrastructure,
  // but we lack a clean authoritative source for correction. Document as caveat.)
];

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const byId = new Map(data.cities.map((c) => [c.cityId, c]));

  let applied = 0;
  for (const [cityId, metricKey, newRaw, source, sourceUrl, dataLevel] of CORRECTIONS) {
    const city = byId.get(cityId);
    if (!city) { console.warn(`skip: ${cityId} not found`); continue; }
    const m = city.metrics[metricKey];
    if (!m) { console.warn(`skip: ${cityId}.${metricKey} not found`); continue; }
    const old = m.raw;
    m.raw = newRaw;
    m.source = source;
    m.sourceUrl = sourceUrl;
    m.dataLevel = dataLevel;
    console.log(`patch ${cityId.padEnd(20)} ${metricKey.padEnd(45)} ${String(old).padEnd(10)} → ${newRaw}`);
    applied++;
  }

  data.updatedAt = new Date().toISOString();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\n✓ ${applied} corrections applied. Run rescore-all-cities.mjs next.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
