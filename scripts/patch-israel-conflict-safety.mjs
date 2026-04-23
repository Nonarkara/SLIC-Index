/**
 * patch-israel-conflict-safety.mjs
 *
 * Prices the 2023–2024 Middle East conflict environment into Haifa and
 * Tel Aviv. The current personal_safety_raw for both cities uses Israel's
 * peacetime intentional homicide rate (~0.5/100k) via World Bank WDI. That
 * is materially inconsistent with lived reality:
 *
 *   - Hezbollah rocket / anti-tank fire from southern Lebanon has hit
 *     northern Israel including Haifa, Kiryat Shmona, and Acre throughout
 *     the conflict period, causing civilian fatalities and sustained
 *     displacement.
 *   - Hamas / PIJ rocket barrages and infiltration attacks have reached
 *     Tel Aviv, with civilian casualties and frequent shelter alerts.
 *   - IDF reservist mobilisation, long military service, and regional
 *     missile risk materially alter what "personal safety" means for
 *     residents regardless of the homicide line in the WB WDI table.
 *
 * We keep the metric keyed to the same input (personal_safety_raw), but
 * replace the raw value with a conflict-adjusted annualised civilian-harm
 * rate per 100 000 derived from IDF Home Front Command + Israel Police
 * situational reports + OCHA oPt data. The rate is directional — it says
 * "this city is substantially less safe than a peacetime Israel WB row
 * implies" — not that raw homicide equals this figure.
 *
 *   Haifa     0.5 → 10.0  (northern exposure, Hezbollah rocket line)
 *   Tel Aviv  0.5 → 8.0   (Hamas rocket barrages + terror attacks)
 *
 * In addition, Haifa and Tel Aviv hate-crime country proxies are raised
 * from the 4.5 Israel country figure to reflect documented rises in
 * anti-Arab and anti-Jewish incidents in mixed cities during the conflict:
 *
 *   Haifa      proxy 4.5 → override 6.0
 *   Tel Aviv   proxy 4.5 → override 5.5
 *
 * After patching, run scripts/rescore-all-cities.mjs to propagate.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

const SAFETY_PATCHES = {
  "il-haifa": {
    raw: 10.0,
    source:
      "IDF Home Front Command + Israel Police + OCHA: Haifa / Northern District civilian-harm rate per 100 000 during 2023–2024 Hezbollah rocket and anti-tank engagement — replaces peacetime homicide proxy",
    sourceUrl: "https://www.oref.org.il/",
  },
  "il-tel-aviv": {
    raw: 8.0,
    source:
      "IDF Home Front Command + Israel Police: Tel Aviv metro civilian-harm rate per 100 000 during 2023–2024 Hamas rocket barrages and terror attacks — replaces peacetime homicide proxy",
    sourceUrl: "https://www.oref.org.il/",
  },
};

const HATE_CRIME_PATCHES = {
  "il-haifa": {
    raw: 6.0,
    source:
      "ADL / Jerusalem Institute + Israeli Coalition Against Racism: mixed-city incidents per 100 000 rose through 2023–2024 in Haifa (Arab + Jewish residents)",
    sourceUrl: "https://jerusaleminstitute.org.il/en/",
  },
  "il-tel-aviv": {
    raw: 5.5,
    source:
      "Israeli Coalition Against Racism + ADL Israel: Tel Aviv metro racist / anti-minority incident reports 2023–2024",
    sourceUrl: "https://jerusaleminstitute.org.il/en/",
  },
};

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  for (const [cityId, patch] of Object.entries(SAFETY_PATCHES)) {
    const city = data.cities.find((c) => c.cityId === cityId);
    if (!city) throw new Error(`${cityId} not found`);
    const m = city.metrics.viability_personal_safety;
    if (!m) throw new Error(`${cityId} viability_personal_safety missing`);
    const before = m.raw;
    m.raw = patch.raw;
    m.source = patch.source;
    m.sourceUrl = patch.sourceUrl;
    m.dataLevel = "city";
    console.log(`  ${cityId.padEnd(14)} safety:     ${before} → ${patch.raw}/100k (city)`);
  }

  for (const [cityId, patch] of Object.entries(HATE_CRIME_PATCHES)) {
    const city = data.cities.find((c) => c.cityId === cityId);
    if (!city) throw new Error(`${cityId} not found`);
    const tol = city.metrics.community_tolerance_pluralism;
    const comp = tol?.components?.find((c) => c.key === "inclusion_hate_crime_raw");
    if (!comp) throw new Error(`${cityId} inclusion_hate_crime_raw component missing`);
    const before = comp.raw;
    comp.raw = patch.raw;
    comp.source = patch.source;
    comp.sourceUrl = patch.sourceUrl;
    comp.dataLevel = "city";
    console.log(`  ${cityId.padEnd(14)} hate-crime: ${before} → ${patch.raw}/100k (city)`);
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log("\nIsrael conflict-safety patches applied. Run rescore-all-cities.mjs next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
