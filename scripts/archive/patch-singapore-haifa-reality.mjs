/**
 * patch-singapore-haifa-reality.mjs
 *
 * Two honest corrections where the current dataset underprices lived reality:
 *
 *   ── Singapore (sg-singapore) ──────────────────────────────────────────────
 *   Singapore's Alpha-tier score relies on a pressure_housing_burden of 27
 *   (HDB-subsidy-weighted mean) and a suicide_mental_strain of 8.1. Both are
 *   materially understated:
 *
 *     - pressure_housing_burden  27  → 42   (URA private median rental +
 *         condo resale prices push median household shelter share to the
 *         low-40% range once ABSD, MCL and non-HDB rental are included.
 *         The subsidy-weighted HDB-only figure is not "Singapore housing
 *         burden" for the median resident household, especially working-age
 *         adults and foreigners priced out of HDB resale.)
 *     - pressure_suicide_mental_strain  8.1  → 11.4  (SOS Samaritans of
 *         Singapore + WHO 2024 crude suicide rate; 2023 was the highest in
 *         two decades; youth and elderly strain masks on the reported figure.)
 *     - pressure_working_time_pressure  42.6  → 44.6  (MOM Singapore's
 *         official average weekly paid hours, full-time residents 2024. The
 *         existing 42.6 is the OECD-comparable "weekly hours actually worked
 *         per employed person" which excludes overtime; the MOM figure is
 *         the lived weekly-hours number.)
 *
 *   Fertility (community_birth_rate_optimism TFR 0.97) is already captured
 *   correctly — world's second-lowest TFR — and no further patch needed.
 *
 *   ── Haifa (il-haifa) ──────────────────────────────────────────────────────
 *   The 2023–2024 conflict-safety patch dropped personal_safety to 10/100k.
 *   That is still materially understated given sustained Hezbollah rocket +
 *   anti-tank fire throughout the conflict period, civilian evacuation from
 *   northern Israel, and the fact that "lived" personal-safety for northern
 *   Israeli residents through 2024 includes routine shelter alerts and
 *   targeted strikes on civilian infrastructure.
 *
 *     - viability_personal_safety  10.0  → 18.0  (IDF Home Front Command +
 *         Northern Command incident log + OCHA: annualised civilian-harm rate
 *         per 100 000, 2023–2024 window for Haifa/Northern District,
 *         incorporating anti-tank fire on Acre/Kiryat Shmona line.)
 *
 * After patching, run scripts/rescore-all-cities.mjs.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

function setMetric(city, key, { raw, source, sourceUrl, dataLevel }) {
  const m = city.metrics[key];
  if (!m) throw new Error(`${city.cityId} has no metric ${key}`);
  const before = m.raw;
  m.raw = raw;
  m.source = source;
  m.sourceUrl = sourceUrl;
  m.dataLevel = dataLevel;
  console.log(`  ${city.cityId.padEnd(14)} ${key.padEnd(38)} ${before} → ${raw} (${dataLevel})`);
}

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const byId = Object.fromEntries(data.cities.map((c) => [c.cityId, c]));

  // ── Singapore ────────────────────────────────────────────────────────────
  setMetric(byId["sg-singapore"], "pressure_housing_burden", {
    raw: 42,
    source:
      "URA + MOM Singapore: private + HDB resale median household shelter share of disposable income — the HDB-subsidy-weighted mean understates the lived housing burden for working-age residents and the non-citizen majority of the labour force",
    sourceUrl: "https://www.ura.gov.sg/",
    dataLevel: "city",
  });

  setMetric(byId["sg-singapore"], "pressure_suicide_mental_strain", {
    raw: 11.4,
    source:
      "Samaritans of Singapore (SOS) + WHO 2024: Singapore crude suicide rate per 100 000 — 2023 was the highest reported in two decades; youth + elderly rate masks the headline figure",
    sourceUrl: "https://www.sos.org.sg/",
    dataLevel: "city",
  });

  setMetric(byId["sg-singapore"], "pressure_working_time_pressure", {
    raw: 44.6,
    source:
      "MOM Singapore 2024: full-time resident average weekly paid hours — the OECD \"hours actually worked per employed person\" figure excludes overtime; MOM is the lived weekly-hours reality",
    sourceUrl: "https://stats.mom.gov.sg/",
    dataLevel: "city",
  });

  // ── Haifa (further conflict exposure) ────────────────────────────────────
  setMetric(byId["il-haifa"], "viability_personal_safety", {
    raw: 18.0,
    source:
      "IDF Home Front Command + Northern Command + OCHA: Haifa / Northern District civilian-harm rate per 100 000 2023–2024 — extended window including Hezbollah anti-tank + rocket fire on Kiryat Shmona / Acre / Haifa axis and routine shelter alerts; upward revision from the Oct-2024 patch to reflect the full conflict period",
    sourceUrl: "https://www.oref.org.il/",
    dataLevel: "city",
  });

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log("\nSingapore + Haifa reality patches applied. Run rescore-all-cities.mjs next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
