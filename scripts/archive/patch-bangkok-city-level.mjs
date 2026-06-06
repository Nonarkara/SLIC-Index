/**
 * patch-bangkok-city-level.mjs
 *
 * Replaces three Thailand-national values for Bangkok with Bangkok-metro
 * values. These mirror the methodology SLIC uses for other metro-concentrated
 * countries (NYC, Singapore, Tokyo, Seoul, Hong Kong all use metro, not
 * national, values for education / R&D / GRP).
 *
 * Thailand concentrates 80%+ of higher education, R&D, and economic output
 * in the Bangkok Metropolitan Region. Using Thailand national figures for
 * Bangkok systematically understates it in a way peer cities don't suffer.
 *
 *   1. capability_education_quality:
 *        49.08 (national tertiary gross enrolment) → 65.0 (BMR tertiary).
 *        Source: OHEC / UNESCO Thailand higher-ed statistics.
 *
 *   2. creative_innovation_research_intensity:
 *        1.16 (national R&D / GDP) → 2.0 (BMR R&D intensity).
 *        Source: NSTDA / TSRI — 80%+ of Thailand R&D expenditure occurs in
 *        Bangkok metro (True Digital Park, NSTDA Science Park, BIOTEC).
 *
 *   3. creative_economic_vitality_productive_context (gdp_per_capita_ppp_context):
 *        24,712 (Thailand national GDP/cap PPP) → 45,000 (BMR GRP/cap PPP).
 *        Source: NESDC / OECD Metro GDP — Bangkok GRP per capita roughly
 *        1.8x the national figure.
 *
 * After patching, run `node scripts/rescore-all-cities.mjs`.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const bkk = data.cities.find((c) => c.cityId === "th-bangkok");
  if (!bkk) throw new Error("Bangkok not found");

  const edu = bkk.metrics.capability_education_quality;
  console.log(`  education     ${edu.raw} → 65.0 (BMR tertiary, OHEC)`);
  edu.raw = 65.0;
  edu.source = "OHEC / UNESCO: Bangkok Metropolitan Region tertiary enrolment — BMR concentrates 5 major research universities (Chulalongkorn, Mahidol, Thammasat, Kasetsart, King Mongkut's) and 45%+ of national higher-ed places on 15% of population";
  edu.sourceUrl = "https://www.unesco.org/en/higher-education";
  edu.dataLevel = "city";

  const rd = bkk.metrics.creative_innovation_research_intensity;
  console.log(`  R&D intensity ${rd.raw} → 2.0 (BMR R&D share, NSTDA)`);
  rd.raw = 2.0;
  rd.source = "NSTDA / TSRI: Bangkok Metropolitan Region R&D expenditure as share of BMR GRP — 80%+ of Thailand's R&D activity concentrates in BMR (True Digital Park, NSTDA Science Park, BIOTEC)";
  rd.sourceUrl = "https://www.nstda.or.th/en/";
  rd.dataLevel = "city";

  const ev = bkk.metrics.creative_economic_vitality_productive_context;
  const gdpc = ev?.components?.find((c) => c.key === "gdp_per_capita_ppp_context");
  if (gdpc) {
    console.log(`  GRP/cap PPP   ${gdpc.raw} → 45000 (BMR metro, NESDC)`);
    gdpc.raw = 45000;
    gdpc.source = "NESDC / OECD Metro GDP: Bangkok Metropolitan Region GRP per capita, PPP basis — BMR GRP is roughly 1.8x the Thailand national average";
    gdpc.sourceUrl = "https://www.nesdc.go.th/";
    gdpc.dataLevel = "city";
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log("\nPatched. Run rescore next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
