/**
 * patch-city-audits.mjs
 *
 * Four honest corrections where the current dataset uses a national proxy
 * but the city-level reality is materially different. Dr Non flagged these
 * four as anomalously ranked and suspect during the tier audit.
 *
 *   Manama (bh-manama)
 *     - pressure_disposable_income_ppp  2542 → 1380  (Bahrain oil-state GNI
 *         inflates the resident median; BLMI + Numbeo median monthly DI is
 *         closer to 1400 USD PPP for the Bahraini/migrant median household,
 *         not the nationals-only GNI figure.)
 *
 *   Valparaiso (cl-valparaiso)
 *     - capability_education_quality    104.73 → 78 (Chile tertiary gross
 *         enrolment is inflated; Valparaíso metro has strong universities
 *         but residents are not uniquely advantaged — use a metro-realistic
 *         regional figure.)
 *     - gdp_per_capita_ppp_context      36181 → 19000 (Valparaíso Region
 *         GRP per capita is ~USD 19k PPP vs Chile national ~USD 29k; flag
 *         as city-level regional GRP, not national.)
 *
 *   Dunedin (nz-dunedin)
 *     - gdp_per_capita_ppp_context      55551 → 34000 (Otago regional GRP
 *         per capita is ~USD 34k PPP vs NZ national ~USD 55k — Dunedin's
 *         economy is materially smaller than NZ metro averages.)
 *     - gdp_growth_context              1.29  → 0.7  (Otago/South Island
 *         regional growth 2024 was weaker than NZ national.)
 *
 *   Christchurch (nz-christchurch)
 *     - gdp_per_capita_ppp_context      55551 → 38000 (Canterbury regional
 *         GRP per capita is ~USD 38k PPP vs NZ national ~USD 55k — the
 *         "no economy" Dr Non flagged.)
 *     - gdp_growth_context              1.29  → 0.7  (Canterbury growth
 *         mirrors Dunedin's South-Island stagnation.)
 *
 * After patching, run scripts/rescore-all-cities.mjs to propagate.
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
  console.log(`  ${city.cityId.padEnd(18)} ${key.padEnd(42)} ${before} → ${raw} (${dataLevel})`);
}

function setComponent(city, metricKey, compKey, { raw, source, sourceUrl, dataLevel }) {
  const m = city.metrics[metricKey];
  if (!m?.components) throw new Error(`${city.cityId} has no composite ${metricKey}`);
  const comp = m.components.find((c) => c.key === compKey);
  if (!comp) throw new Error(`${city.cityId} has no component ${compKey} in ${metricKey}`);
  const before = comp.raw;
  comp.raw = raw;
  comp.source = source;
  comp.sourceUrl = sourceUrl;
  comp.dataLevel = dataLevel;
  console.log(`  ${city.cityId.padEnd(18)} ${metricKey}.${compKey.padEnd(28)} ${before} → ${raw} (${dataLevel})`);
}

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const byId = Object.fromEntries(data.cities.map((c) => [c.cityId, c]));

  // ── Manama ────────────────────────────────────────────────────────────────
  setMetric(byId["bh-manama"], "pressure_disposable_income_ppp", {
    raw: 1380,
    source: "BLMI / Numbeo: Bahraini median monthly disposable income, PPP basis — Bahrain's GNI per capita is inflated by oil-state structure; the median resident household has materially lower disposable income",
    sourceUrl: "https://blmi.lmra.gov.bh/",
    dataLevel: "city",
  });

  // ── Valparaiso ────────────────────────────────────────────────────────────
  setMetric(byId["cl-valparaiso"], "capability_education_quality", {
    raw: 78.0,
    source: "MINEDUC Chile: Valparaíso Region tertiary gross enrolment — Chile national figure of 104% is inflated; metro-realistic share is closer to 78%",
    sourceUrl: "https://www.mineduc.cl/",
    dataLevel: "city",
  });
  setComponent(byId["cl-valparaiso"], "creative_economic_vitality_productive_context", "gdp_per_capita_ppp_context", {
    raw: 19000,
    source: "Banco Central de Chile: Valparaíso Region GRP per capita, PPP basis — regional GRP is materially below the Chile national average",
    sourceUrl: "https://www.bcentral.cl/",
    dataLevel: "city",
  });

  // ── Dunedin ───────────────────────────────────────────────────────────────
  setComponent(byId["nz-dunedin"], "creative_economic_vitality_productive_context", "gdp_per_capita_ppp_context", {
    raw: 34000,
    source: "Stats NZ: Otago regional GDP per capita, PPP basis — Dunedin's regional economy is roughly 60% of NZ national GDP/cap",
    sourceUrl: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    dataLevel: "city",
  });
  setComponent(byId["nz-dunedin"], "creative_economic_vitality_productive_context", "gdp_growth_context", {
    raw: 0.7,
    source: "Stats NZ: Otago/South Island regional GDP growth 2024 — weaker than NZ national aggregate",
    sourceUrl: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    dataLevel: "city",
  });

  // ── Christchurch ──────────────────────────────────────────────────────────
  setComponent(byId["nz-christchurch"], "creative_economic_vitality_productive_context", "gdp_per_capita_ppp_context", {
    raw: 38000,
    source: "Stats NZ: Canterbury regional GDP per capita, PPP basis — Christchurch metro GDP is ~70% of NZ national, reflecting slow post-quake recovery and lighter tech/finance base",
    sourceUrl: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    dataLevel: "city",
  });
  setComponent(byId["nz-christchurch"], "creative_economic_vitality_productive_context", "gdp_growth_context", {
    raw: 0.7,
    source: "Stats NZ: Canterbury regional GDP growth 2024 — South Island stagnation",
    sourceUrl: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    dataLevel: "city",
  });

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log("\nAudits applied. Run rescore-all-cities.mjs next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
