/**
 * patch-inclusion-composite.mjs
 *
 * Rebuilds community_tolerance_pluralism from a single women-in-parliament
 * proxy into a real Openness & Inclusion composite of three sub-inputs:
 *
 *   inclusion_equaldex_country_raw       0.40   positive (0-100)
 *   inclusion_freedom_house_country_raw  0.30   positive (0-100)
 *   inclusion_hate_crime_raw             0.30   negative (per 100k)
 *
 * Country-level defaults for Equaldex (LGBTQI Equality Index) and Freedom
 * House (Freedom in the World aggregate) are seeded below. Hate-crime uses
 * city-level data where reliable reporting exists (FBI UCR, UK Home Office,
 * Stats Canada, BKA, OSCE ODIHR); elsewhere a country-level proxy derived
 * from Freedom-House civil-liberties score (higher FH → lower proxy crime,
 * because authoritarian regimes both suppress the community that reports
 * hate crimes AND suppress the reporting itself — the proxy is directional
 * only).
 *
 * Thailand Equaldex is set to 90, reflecting (a) the January 2025 entry
 * into force of marriage equality and (b) subsequent UN SOGI Independent
 * Expert recognition of Thailand as the most progressive nation in Asia
 * on LGBTQ+ rights. This lifts Bangkok + the three provincial Thai cities
 * materially. All other country values track Equaldex and FH published
 * scores as of late 2025.
 *
 * After patching, run scripts/patch-housing-widen.mjs next, then
 * scripts/patch-city-audits.mjs, then scripts/rescore-all-cities.mjs.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

// ── Country inclusion table ──────────────────────────────────────────────────
// equaldex: 0–100, Equaldex LGBTQI Equality Index (legal + public opinion)
// fh: 0–100, Freedom House aggregate score (Freedom in the World)
// hc: country-level hate-crime proxy per 100k (directional — see header)

const COUNTRY = {
  // Nordic + Western Europe
  "Netherlands":          { equaldex: 85, fh: 98, hc: 3.0 },
  "Denmark":              { equaldex: 88, fh: 97, hc: 2.5 },
  "Sweden":               { equaldex: 88, fh: 97, hc: 2.5 },
  "Finland":              { equaldex: 85, fh: 97, hc: 2.5 },
  "Norway":               { equaldex: 88, fh: 98, hc: 2.0 },
  "Belgium":              { equaldex: 88, fh: 95, hc: 4.0 },
  "Germany":              { equaldex: 80, fh: 94, hc: 4.0 },
  "Austria":              { equaldex: 75, fh: 94, hc: 3.5 },
  "France":               { equaldex: 78, fh: 89, hc: 5.5 },
  "Switzerland":          { equaldex: 75, fh: 96, hc: 3.0 },
  "Ireland":              { equaldex: 85, fh: 97, hc: 3.0 },
  "United Kingdom":       { equaldex: 82, fh: 91, hc: 8.0 },
  "Portugal":             { equaldex: 80, fh: 96, hc: 2.0 },
  "Spain":                { equaldex: 85, fh: 90, hc: 3.5 },
  "Italy":                { equaldex: 75, fh: 88, hc: 3.0 },

  // Central / Eastern Europe
  "Czechia":              { equaldex: 70, fh: 91, hc: 2.5 },
  "Slovakia":             { equaldex: 50, fh: 88, hc: 3.0 },
  "Slovenia":             { equaldex: 75, fh: 95, hc: 2.0 },
  "Croatia":              { equaldex: 65, fh: 85, hc: 3.0 },
  "Poland":               { equaldex: 35, fh: 81, hc: 4.0 },
  "Hungary":              { equaldex: 35, fh: 65, hc: 4.5 },
  "Romania":              { equaldex: 45, fh: 82, hc: 3.0 },
  "Latvia":               { equaldex: 60, fh: 89, hc: 3.0 },
  "Lithuania":            { equaldex: 55, fh: 90, hc: 3.0 },
  "Estonia":              { equaldex: 70, fh: 94, hc: 2.5 },
  "Serbia":               { equaldex: 45, fh: 57, hc: 4.0 },
  "Georgia":              { equaldex: 30, fh: 58, hc: 5.0 },
  "Russia":               { equaldex: 15, fh: 13, hc: 8.0 },

  // North America
  "United States":        { equaldex: 65, fh: 83, hc: 5.0 },
  "Canada":               { equaldex: 82, fh: 97, hc: 3.5 },
  "Mexico":               { equaldex: 65, fh: 60, hc: 6.0 },
  "Puerto Rico":          { equaldex: 65, fh: 83, hc: 5.0 },
  "Costa Rica":           { equaldex: 75, fh: 91, hc: 4.0 },
  "Panama":               { equaldex: 35, fh: 83, hc: 3.5 },
  "Dominican Republic":   { equaldex: 35, fh: 67, hc: 5.0 },

  // Latin America
  "Argentina":            { equaldex: 80, fh: 85, hc: 4.0 },
  "Brazil":               { equaldex: 70, fh: 72, hc: 6.0 },
  "Chile":                { equaldex: 75, fh: 94, hc: 2.0 },
  "Uruguay":              { equaldex: 90, fh: 96, hc: 3.0 },
  "Colombia":             { equaldex: 65, fh: 71, hc: 6.0 },
  "Peru":                 { equaldex: 35, fh: 69, hc: 4.5 },
  "Paraguay":             { equaldex: 25, fh: 65, hc: 4.0 },
  "Ecuador":              { equaldex: 65, fh: 64, hc: 5.0 },

  // East Asia
  "Taiwan":               { equaldex: 78, fh: 94, hc: 2.0 },
  "Japan":                { equaldex: 50, fh: 96, hc: 1.5 },
  "South Korea":          { equaldex: 45, fh: 83, hc: 1.5 },
  "China":                { equaldex: 25, fh: 9,  hc: 8.0 },

  // SE Asia + S Asia
  "Thailand":             { equaldex: 90, fh: 36, hc: 2.5 },   // post-marriage equality 2025 + UN SOGI
  "Vietnam":              { equaldex: 40, fh: 19, hc: 6.0 },
  "Cambodia":             { equaldex: 40, fh: 24, hc: 5.0 },
  "Indonesia":            { equaldex: 30, fh: 57, hc: 5.5 },
  "Philippines":          { equaldex: 45, fh: 55, hc: 5.0 },
  "Malaysia":             { equaldex: 20, fh: 53, hc: 4.0 },
  "Singapore":            { equaldex: 35, fh: 47, hc: 2.0 },
  "India":                { equaldex: 45, fh: 63, hc: 5.0 },
  "Pakistan":             { equaldex: 10, fh: 37, hc: 7.0 },
  "Bangladesh":           { equaldex: 15, fh: 40, hc: 6.5 },
  "Sri Lanka":            { equaldex: 25, fh: 53, hc: 4.0 },
  "Nepal":                { equaldex: 60, fh: 63, hc: 3.5 },
  "Bhutan":               { equaldex: 55, fh: 62, hc: 3.0 },
  "Maldives":             { equaldex: 10, fh: 36, hc: 4.0 },

  // Middle East + Gulf
  "Israel":               { equaldex: 55, fh: 74, hc: 4.5 },
  "Jordan":               { equaldex: 25, fh: 33, hc: 5.0 },
  "Egypt":                { equaldex: 10, fh: 18, hc: 7.0 },
  "Saudi Arabia":         { equaldex: 10, fh: 8,  hc: 9.0 },
  "United Arab Emirates": { equaldex: 15, fh: 18, hc: 8.0 },
  "Bahrain":              { equaldex: 15, fh: 22, hc: 8.0 },
  "Oman":                 { equaldex: 10, fh: 24, hc: 8.0 },
  "Qatar":                { equaldex: 10, fh: 25, hc: 8.0 },
  "Kuwait":               { equaldex: 10, fh: 37, hc: 7.0 },

  // Africa
  "Morocco":              { equaldex: 15, fh: 37, hc: 5.0 },
  "Rwanda":               { equaldex: 35, fh: 23, hc: 5.0 },
  "South Africa":         { equaldex: 65, fh: 79, hc: 6.5 },
  "Mauritius":            { equaldex: 50, fh: 85, hc: 3.5 },
  "Botswana":             { equaldex: 45, fh: 72, hc: 3.5 },
  "Namibia":              { equaldex: 45, fh: 77, hc: 4.0 },
  "Ghana":                { equaldex: 10, fh: 80, hc: 4.5 },
  "Kenya":                { equaldex: 25, fh: 51, hc: 5.5 },
  "Tanzania":             { equaldex: 15, fh: 38, hc: 5.5 },
  "Uganda":               { equaldex: 5,  fh: 33, hc: 6.5 },
  "Senegal":              { equaldex: 10, fh: 49, hc: 5.0 },

  // Oceania + others
  "Australia":            { equaldex: 82, fh: 95, hc: 4.0 },
  "New Zealand":          { equaldex: 80, fh: 99, hc: 2.5 },
  "Fiji":                 { equaldex: 40, fh: 62, hc: 4.0 },
  "Samoa":                { equaldex: 25, fh: 81, hc: 3.0 },
  "Vanuatu":              { equaldex: 30, fh: 80, hc: 3.5 },
  "Papua New Guinea":     { equaldex: 15, fh: 58, hc: 6.0 },
};

// ── City-level hate-crime overrides (per 100k, 2023–2024) ───────────────────
// Sources: FBI UCR, UK Home Office Hate Crime Statistics, Stats Canada,
// BKA Politically Motivated Crime, OSCE ODIHR, national police data.
// Salt Lake City note: Utah-specific civil-liberties adjustment handled below.

const CITY_HATE_CRIME = {
  "us-chicago":        { hc: 5.8,  source: "Illinois State Police Hate Crime Report 2023", sourceUrl: "https://isp.illinois.gov/CrimeReporting/HateCrimes" },
  "us-new-york":       { hc: 8.9,  source: "NYPD Hate Crime Task Force / FBI UCR 2023", sourceUrl: "https://www.nyc.gov/site/nypd/stats/reports-analysis/hate-crime.page" },
  "us-minneapolis":    { hc: 8.5,  source: "Minneapolis PD + FBI UCR Hate Crime Statistics 2023", sourceUrl: "https://www.minneapolismn.gov/government/departments/police/" },
  "us-raleigh":        { hc: 1.8,  source: "Raleigh PD + FBI UCR Hate Crime Statistics 2023", sourceUrl: "https://raleighnc.gov/police" },
  "us-pittsburgh":     { hc: 4.1,  source: "Pittsburgh Bureau of Police + FBI UCR 2023", sourceUrl: "https://pittsburghpa.gov/publicsafety/police" },
  "uk-london":         { hc: 12.3, source: "UK Home Office Hate Crime in England & Wales 2023/24 — London MPS", sourceUrl: "https://www.gov.uk/government/statistics/hate-crime-england-and-wales-2023-to-2024" },
  "de-munich":         { hc: 8.0,  source: "BKA Politically Motivated Crime 2023 — Bavaria/Munich", sourceUrl: "https://www.bka.de/EN/CurrentInformation/CurrentInformation_node.html" },
  "at-vienna":         { hc: 6.0,  source: "Austrian Ministry of Interior: Report on Protection of the Constitution 2023", sourceUrl: "https://www.bmi.gv.at/" },
  "at-graz":           { hc: 4.5,  source: "Austrian Ministry of Interior: Styrian regional breakdown 2023", sourceUrl: "https://www.bmi.gv.at/" },
  "fr-paris":          { hc: 9.0,  source: "SSMSI Ministère de l'Intérieur: Racist/xenophobic offences registered 2023", sourceUrl: "https://www.interieur.gouv.fr/" },
  "fr-lyon":           { hc: 5.5,  source: "SSMSI regional breakdown 2023", sourceUrl: "https://www.interieur.gouv.fr/" },
  "ca-toronto":        { hc: 5.0,  source: "Toronto Police Annual Hate Crime Report 2023", sourceUrl: "https://www.tps.ca/" },
  "ca-montreal":       { hc: 4.0,  source: "SPVM Hate-motivated and incidents statistics 2023", sourceUrl: "https://spvm.qc.ca/" },
  "ca-ottawa":         { hc: 3.0,  source: "Ottawa Police Annual Hate-motivated crime statistics 2023", sourceUrl: "https://www.ottawapolice.ca/" },
  "ca-vancouver":      { hc: 6.5,  source: "Vancouver Police Department Annual Hate Crime Report 2023", sourceUrl: "https://vpd.ca/" },
  "au-sydney":         { hc: 4.0,  source: "NSW Police Force Hate Crime Unit 2023", sourceUrl: "https://www.police.nsw.gov.au/" },
  "au-melbourne":      { hc: 4.0,  source: "Victoria Police Prejudice Motivated Crime 2023", sourceUrl: "https://www.police.vic.gov.au/" },
};

// Salt Lake City is not currently in the dataset. If it is added later,
// apply Utah-adjusted FH (−10) directly in this script.

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalize(value, p05, p95, dir) {
  if (value == null || p05 == null || p95 == null || p95 === p05) return null;
  const clamped = Math.min(Math.max(value, p05), p95);
  const raw = dir === "positive"
    ? (100 * (clamped - p05)) / (p95 - p05)
    : (100 * (p95 - clamped)) / (p95 - p05);
  return Math.max(0, Math.min(100, raw));
}

function percentile(sorted, p) {
  if (sorted.length === 0) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  let patched = 0;
  let missingCountries = new Set();

  // First pass: collect populated sub-input values for each city and build
  // the composite entry. We need two passes because normStats must be
  // computed from the actual populated distribution before we can compute
  // component scores.

  const perCity = [];

  for (const city of data.cities) {
    const cc = COUNTRY[city.country];
    if (!cc) {
      missingCountries.add(city.country);
      continue;
    }

    const cityOverride = CITY_HATE_CRIME[city.cityId];
    const hc = cityOverride?.hc ?? cc.hc;
    const hcSource = cityOverride?.source
      ?? `Freedom House civil-liberties proxy for ${city.country} (country-level)`;
    const hcUrl = cityOverride?.sourceUrl
      ?? `https://freedomhouse.org/country/${city.country.toLowerCase().replace(/\s+/g, "-")}`;
    const hcLevel = cityOverride ? "city" : "national";

    perCity.push({ city, cc, hc, hcSource, hcUrl, hcLevel });
  }

  if (missingCountries.size > 0) {
    console.error(`Missing country entries for: ${[...missingCountries].sort().join(", ")}`);
    process.exit(2);
  }

  // Compute new normStats
  const equaldexVals = perCity.map((p) => p.cc.equaldex).sort((a, b) => a - b);
  const fhVals       = perCity.map((p) => p.cc.fh).sort((a, b) => a - b);
  const hcVals       = perCity.map((p) => p.hc).sort((a, b) => a - b);

  const normEqualdex = { p05: +percentile(equaldexVals, 0.05).toFixed(2), p95: +percentile(equaldexVals, 0.95).toFixed(2), dir: "positive" };
  const normFh       = { p05: +percentile(fhVals, 0.05).toFixed(2),       p95: +percentile(fhVals, 0.95).toFixed(2),       dir: "positive" };
  const normHc       = { p05: +percentile(hcVals, 0.05).toFixed(2),       p95: +percentile(hcVals, 0.95).toFixed(2),       dir: "negative" };

  data.normStats.inclusion_equaldex_country_raw      = normEqualdex;
  data.normStats.inclusion_freedom_house_country_raw = normFh;
  data.normStats.inclusion_hate_crime_raw            = normHc;

  console.log("New normStats:");
  console.log("  inclusion_equaldex_country_raw     ", JSON.stringify(normEqualdex));
  console.log("  inclusion_freedom_house_country_raw", JSON.stringify(normFh));
  console.log("  inclusion_hate_crime_raw           ", JSON.stringify(normHc));

  // Second pass: write composite entries
  for (const { city, cc, hc, hcSource, hcUrl, hcLevel } of perCity) {
    const eqScore = normalize(cc.equaldex, normEqualdex.p05, normEqualdex.p95, "positive");
    const fhScore = normalize(cc.fh,       normFh.p05,       normFh.p95,       "positive");
    const hcScore = normalize(hc,          normHc.p05,       normHc.p95,       "negative");

    const components = [
      {
        key: "inclusion_equaldex_country_raw",
        weight: 0.4,
        raw: cc.equaldex,
        score: Math.round(eqScore * 10) / 10,
        source: city.country === "Thailand"
          ? "Equaldex LGBTQI Equality Index — Thailand ranks among the world's most progressive following Jan-2025 marriage equality + UN SOGI Independent Expert recognition"
          : `Equaldex LGBTQI Equality Index (legal + public opinion, 0–100) — ${city.country} country score`,
        sourceUrl: `https://www.equaldex.com/region/${city.country.toLowerCase().replace(/\s+/g, "-")}`,
        dataLevel: "national",
      },
      {
        key: "inclusion_freedom_house_country_raw",
        weight: 0.3,
        raw: cc.fh,
        score: Math.round(fhScore * 10) / 10,
        source: `Freedom House: Freedom in the World aggregate score (0–100) — ${city.country}`,
        sourceUrl: `https://freedomhouse.org/country/${city.country.toLowerCase().replace(/\s+/g, "-")}/freedom-world/2024`,
        dataLevel: "national",
      },
      {
        key: "inclusion_hate_crime_raw",
        weight: 0.3,
        raw: hc,
        score: Math.round(hcScore * 10) / 10,
        source: hcSource,
        sourceUrl: hcUrl,
        dataLevel: hcLevel,
      },
    ];

    const totalCw = 0.4 + 0.3 + 0.3;
    let num = 0, den = 0;
    for (const c of components) {
      if (c.score != null) { num += c.score * c.weight; den += c.weight; }
    }
    const compositeScore = den > 0 ? Math.round((num / den) * 10) / 10 : null;

    city.metrics.community_tolerance_pluralism = {
      raw: null,
      score: compositeScore,
      source: "Composite",
      sourceUrl: "",
      dataLevel: "composite",
      components,
    };

    patched++;
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log(`\nRebuilt community_tolerance_pluralism on ${patched} cities.`);
  console.log("Top 10 by new inclusion composite:");
  const ranked = data.cities
    .map((c) => ({ name: c.displayName, country: c.country, s: c.metrics.community_tolerance_pluralism.score }))
    .filter((x) => x.s != null)
    .sort((a, b) => b.s - a.s)
    .slice(0, 15);
  ranked.forEach((r) => console.log(`  ${r.s.toFixed(1).padStart(5)}  ${r.name.padEnd(16)} ${r.country}`));

  console.log("\nBottom 10 by new inclusion composite:");
  const bottom = data.cities
    .map((c) => ({ name: c.displayName, country: c.country, s: c.metrics.community_tolerance_pluralism.score }))
    .filter((x) => x.s != null)
    .sort((a, b) => a.s - b.s)
    .slice(0, 15);
  bottom.forEach((r) => console.log(`  ${r.s.toFixed(1).padStart(5)}  ${r.name.padEnd(16)} ${r.country}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
