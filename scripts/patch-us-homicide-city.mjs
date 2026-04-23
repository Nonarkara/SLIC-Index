/**
 * patch-us-homicide-city.mjs
 *
 * Replaces the US national homicide rate (5.76/100k from World Bank WDI)
 * with city-level rates for US cities currently using the national proxy.
 *
 * Dr Non flagged Chicago's rank-10 (Alpha) status as incoherent — Chicago's
 * actual homicide rate is ~21.8/100k (Council on Criminal Justice, 2024),
 * not the US national 5.76. Same mislabeling applies to Raleigh,
 * Minneapolis, Pittsburgh — all currently in the top 10 partly because of
 * this error. NYC already has a city-level override (4.3) and is not
 * touched here.
 *
 * Sources per city:
 *   Chicago:     21.8/100k — Council on Criminal Justice, Crime Trends 2024
 *   Raleigh:     10.5/100k — Raleigh PD Annual Stats 2023 (FBI UCR)
 *   Minneapolis: 14.5/100k — Minneapolis PD 2024
 *   Pittsburgh:  16.8/100k — Pittsburgh Bureau of Police 2023
 *
 * After patching, run `node scripts/rescore-all-cities.mjs` to propagate.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

const PATCHES = {
  "us-chicago": {
    raw: 21.8,
    source: "Council on Criminal Justice: Crime Trends in U.S. Cities 2024 — Chicago homicides per 100 000",
    sourceUrl: "https://counciloncj.org/crime-in-chicago-what-you-need-to-know/",
  },
  "us-raleigh": {
    raw: 10.5,
    source: "Raleigh Police Department Annual Report 2023 / FBI UCR",
    sourceUrl: "https://raleighnc.gov/police",
  },
  "us-minneapolis": {
    raw: 14.5,
    source: "Minneapolis Police Department Crime Dashboard 2024",
    sourceUrl: "https://www.minneapolismn.gov/government/departments/police/",
  },
  "us-pittsburgh": {
    raw: 16.8,
    source: "Pittsburgh Bureau of Police Annual Report 2023 / FBI UCR",
    sourceUrl: "https://pittsburghpa.gov/publicsafety/police",
  },
};

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  let patched = 0;

  for (const city of data.cities) {
    const patch = PATCHES[city.cityId];
    if (!patch) continue;
    const m = city.metrics?.viability_personal_safety;
    if (!m) continue;
    const before = m.raw;
    m.raw = patch.raw;
    m.source = patch.source;
    m.sourceUrl = patch.sourceUrl;
    m.dataLevel = "city";
    patched++;
    console.log(`  ${city.displayName.padEnd(14)} homicide: ${before} → ${patch.raw}/100k (city)`);
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nPatched ${patched} cities. Run rescore next.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
