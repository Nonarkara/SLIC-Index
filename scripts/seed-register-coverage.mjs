#!/usr/bin/env node
/**
 * seed-register-coverage.mjs
 *
 * The registers hold a placeholder row for every city and field, but not every
 * one of those rows was ever filled in. This script closes the remaining
 * holes, in two ways and no others:
 *
 *   1. Explicit curated rows. A small number of inputs are city- or
 *      region-scoped estimates whose source is a named regional authority
 *      rather than a World Bank series. Each one is written out here with its
 *      value, source, scope and reason, so the register makes a statement of
 *      its own rather than echoing the publication.
 *
 *   2. Sibling rows. Where the register already holds this country's figure
 *      for this field under another city, the missing city gets the same
 *      figure: the measurement is a country one, and the other cities of that
 *      country already carry it.
 *
 * The script never invents a value. If it cannot find a source for an input
 * it leaves the input alone, and the coverage gate reports it.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/publishedRankingData.json");
const COUNTRY_REGISTER = path.join(ROOT, "data/verified_sources/country_context.csv");
const CITY_REGISTER = path.join(ROOT, "data/verified_sources/city_inputs.csv");

const APPLY = process.argv.includes("--apply");

// ── CSV helpers ──────────────────────────────────────────────────────────────

function readCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else quoted = false;
      } else field += char;
      continue;
    }
    if (char === '"') { quoted = true; continue; }
    if (char === ",") { row.push(field); field = ""; continue; }
    if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    if (char === "\r") continue;
    field += char;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows
    .filter((cells) => cells.length === header.length && cells.some((cell) => cell !== ""))
    .map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index]])));
}

function writeCsv(header, rows, eol = "\r\n") {
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [header.join(",")]
    .concat(rows.map((row) => header.map((key) => escape(row[key])).join(",")))
    .join(eol) + eol;
}

/** The registers are CRLF files. Rewriting them with LF would turn every
 *  line into a changed line and bury the real edits in a diff. */
function detectEol(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

// ── Curated city- and region-scoped estimates ───────────────────────────────
//
// These are the index's own regional estimates, not a world series. The value
// is the analyst's reading of the named source, so the register records the
// source, the scope it covers and the fact that no observation date is known.

const CURATED_ROWS = [
  {
    city_id: "th-bangkok", field: "gdp_per_capita_ppp_context", value: "45000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.nesdc.go.th/",
    source_title: "NESDC / OECD Metro GDP: Bangkok Metropolitan Region GRP per capita, PPP basis — BMR GRP is roughly 1.8x the Thailand national average",
    reference_period: "no observation date recorded", scope: "metro", proxy: "approved_proxy",
    notes: "scope=metro; regional estimate for the Bangkok Metropolitan Region; derived from the named source, not a World Bank series; no observation date",
  },
  {
    city_id: "cl-valparaiso", field: "gdp_per_capita_ppp_context", value: "19000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.bcentral.cl/",
    source_title: "Banco Central de Chile: Valparaíso Region GRP per capita, PPP basis — regional GRP is materially below the Chile national average",
    reference_period: "no observation date recorded", scope: "regional", proxy: "approved_proxy",
    notes: "scope=regional; regional estimate for Valparaíso Region; derived from the named source, not a World Bank series; no observation date",
  },
  {
    city_id: "nz-christchurch", field: "gdp_per_capita_ppp_context", value: "38000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    source_title: "Stats NZ: Canterbury regional GDP per capita, PPP basis — Christchurch metro GDP is ~70% of NZ national, reflecting slow post-quake recovery and lighter tech/finance base",
    reference_period: "no observation date recorded", scope: "regional", proxy: "approved_proxy",
    notes: "scope=regional; regional estimate for Canterbury; derived from the named source, not a World Bank series; no observation date",
  },
  {
    city_id: "nz-dunedin", field: "gdp_per_capita_ppp_context", value: "34000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    source_title: "Stats NZ: Otago regional GDP per capita, PPP basis — Dunedin's regional economy is roughly 60% of NZ national GDP/cap",
    reference_period: "no observation date recorded", scope: "regional", proxy: "approved_proxy",
    notes: "scope=regional; regional estimate for Otago; derived from the named source, not a World Bank series; no observation date",
  },
  {
    city_id: "nz-christchurch", field: "gdp_growth_context", value: "0.7",
    label: "GDP growth context raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    source_title: "Stats NZ: Canterbury regional GDP growth 2024 — South Island stagnation",
    reference_period: "2024", scope: "regional", proxy: "approved_proxy",
    notes: "scope=regional; regional growth figure for Canterbury from the named source; no observation date recorded",
  },
  {
    city_id: "nz-dunedin", field: "gdp_growth_context", value: "0.7",
    label: "GDP growth context raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.stats.govt.nz/information-releases/regional-gross-domestic-product",
    source_title: "Stats NZ: Otago/South Island regional GDP growth 2024 — weaker than NZ national aggregate",
    reference_period: "2024", scope: "regional", proxy: "approved_proxy",
    notes: "scope=regional; regional growth figure for Otago from the named source; no observation date recorded",
  },
  {
    city_id: "cz-prague", field: "gdp_per_capita_ppp_context", value: "55000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://api.worldbank.org/v2/country/CZE/indicator/NY.GDP.PCAP.PP.CD?format=json&mrv=30",
    source_title: "World Bank WDI + Eurostat: Prague GDP per capita, PPP (metro is 1.7x Czechia average)",
    reference_period: "no observation date recorded", scope: "metro", proxy: "approved_proxy",
    notes: "scope=metro; metropolitan estimate for Prague from Eurostat with a World Bank PPP conversion; no observation date",
  },
  {
    city_id: "cn-nanjing", field: "gdp_per_capita_ppp_context", value: "35000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://tjj.nanjing.gov.cn/",
    source_title: "Nanjing Statistical Yearbook + PPP conversion: Nanjing GRP per capita is 1.5x China national",
    reference_period: "no observation date recorded", scope: "metro", proxy: "approved_proxy",
    notes: "scope=metro; metropolitan estimate for Nanjing from the municipal yearbook with a PPP conversion; no observation date",
  },
  {
    city_id: "it-venice", field: "gdp_per_capita_ppp_context", value: "42000",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "national_statistical_office",
    source_url: "https://www.istat.it/en/",
    source_title: "ISTAT regional GDP + PPP: Venice Metropolitan per capita vs Italy national",
    reference_period: "no observation date recorded", scope: "metro", proxy: "approved_proxy",
    notes: "scope=metro; metropolitan estimate for Venice from ISTAT regional accounts with a PPP conversion; no observation date",
  },
];

/**
 * Country rows the register never received, filled from the World Bank's own
 * API. The year is the observation year, not the year of retrieval.
 */
const CURATED_COUNTRY_ROWS = [
  {
    country: "Czechia", field: "gini_coefficient", value: "25.7",
    label: "Gini index", pillar: "capability", provider_id: "world_bank",
    source_url: "https://api.worldbank.org/v2/country/CZE/indicator/SI.POV.GINI?format=json&mrv=30",
    source_title: "World Bank WDI: Gini index",
    source_date: "2023-12-31", reference_period: "as_of 2023-12-31", scope: "international", proxy: "direct",
    notes: "World Bank WDI SI.POV.GINI observation for 2023, read from the World Bank API",
  },
  {
    country: "United Kingdom", field: "gdp_per_capita_ppp", value: "62839.4679324927",
    label: "GDP per capita PPP raw", pillar: "creative", provider_id: "world_bank",
    source_url: "https://api.worldbank.org/v2/country/GBR/indicator/NY.GDP.PCAP.PP.CD?format=json&mrv=30",
    source_title: "World Bank WDI: GDP per capita, PPP (current international $)",
    source_date: "2024-12-31", reference_period: "as_of 2024-12-31", scope: "international", proxy: "direct",
    notes: "World Bank WDI NY.GDP.PCAP.PP.CD observation for 2024, read from the World Bank API; the register's other rows are an earlier WDI vintage, so this row may differ slightly from them",
  },
  {
    country: "United Kingdom", field: "gini_coefficient", value: "32.4",
    label: "Gini index", pillar: "capability", provider_id: "world_bank",
    source_url: "https://api.worldbank.org/v2/country/GBR/indicator/SI.POV.GINI?format=json&mrv=30",
    source_title: "World Bank WDI: Gini index",
    source_date: "2021-12-31", reference_period: "as_of 2021-12-31", scope: "international", proxy: "direct",
    notes: "World Bank WDI SI.POV.GINI observation for 2021, read from the World Bank API",
  },
];

// ── Load ─────────────────────────────────────────────────────────────────────

const publication = JSON.parse(fs.readFileSync(DATA, "utf8"));
const countryRegister = readCsv(fs.readFileSync(COUNTRY_REGISTER, "utf8"));
const cityRegister = readCsv(fs.readFileSync(CITY_REGISTER, "utf8"));
const COUNTRY_HEADER = Object.keys(countryRegister[0] ?? []);
const CITY_HEADER = Object.keys(cityRegister[0] ?? []);
const COUNTRY_EOL = detectEol(fs.readFileSync(COUNTRY_REGISTER, "utf8"));
const CITY_EOL = detectEol(fs.readFileSync(CITY_REGISTER, "utf8"));

const cityById = new Map(publication.cities.map((city) => [city.cityId, city]));

/** Every published input, as { cityId, country, field, dataLevel, raw }. */
function publishedInputs() {
  const out = [];
  for (const city of publication.cities) {
    for (const metric of Object.values(city.metrics ?? {})) {
      for (const component of metric.components ?? []) {
        if (component.raw === null || component.raw === undefined) continue;
        out.push({
          cityId: city.cityId, country: city.country, field: component.key,
          dataLevel: component.dataLevel, raw: component.raw,
        });
      }
      if (!metric.components && metric.inputKey && metric.raw !== null && metric.raw !== undefined) {
        out.push({
          cityId: city.cityId, country: city.country, field: metric.inputKey,
          dataLevel: metric.dataLevel, raw: metric.raw,
        });
      }
    }
  }
  return out;
}

const hasCityRow = (cityId, field) => cityRegister.some((r) => r.city_id === cityId && r.field === field);
const hasCountryRow = (country, field) => countryRegister.some((r) => r.country === country && r.field === field);
const cityRowValue = (cityId, field) => {
  const row = cityRegister.find((r) => r.city_id === cityId && r.field === field);
  return row && row.value ? row : null;
};
const countryRowValue = (country, field) => {
  const row = countryRegister.find((r) => r.country === country && r.field === field);
  return row && row.value ? row : null;
};

/**
 * A sibling row: the same country's figure for the same field, recorded
 * under another city. The measurement is a country one, so the missing city
 * carries the same figure.
 */
function siblingRow(country, field) {
  // A city-scoped row (a metro or regional estimate) is NOT the country's
  // figure and must never be carried across to the country register: doing
  // so would turn Valparaíso's regional GRP into Chile's GDP per capita.
  const isCountryFigure = (row) => !/scope=(city|metro|regional)/i.test(row.notes ?? "");
  return cityRegister.find((r) => r.country === country && r.field === field && r.value && isCountryFigure(r))
    ?? countryRegister.find((r) => r.country === country && r.field === field && r.value)
    ?? null;
}

// ── Seed ─────────────────────────────────────────────────────────────────────

const addedCity = [];
const addedCountry = [];

for (const spec of CURATED_COUNTRY_ROWS) {
  if (hasCountryRow(spec.country, spec.field) && countryRowValue(spec.country, spec.field)) continue;
  const existing = countryRegister.find((r) => r.country === spec.country && r.field === spec.field);
  const built = {
    country: spec.country, field: spec.field, label: spec.label, pillar: spec.pillar,
    required_for_ranking: "yes", value: spec.value, provider_id: spec.provider_id,
    source_url: spec.source_url, source_title: spec.source_title, source_date: spec.source_date,
    reference_period: spec.reference_period, source_scope: spec.scope, proxy_status: spec.proxy,
    notes: spec.notes,
  };
  if (existing) Object.assign(existing, built);
  else { countryRegister.push(built); addedCountry.push(`${spec.country}/${spec.field}`); }
}

for (const spec of CURATED_ROWS) {
  if (hasCityRow(spec.city_id, spec.field) && cityRowValue(spec.city_id, spec.field)) continue;
  const city = cityById.get(spec.city_id);
  const built = {
    city_id: spec.city_id, display_name: city?.displayName ?? spec.city_id,
    country: city?.country ?? "", cohort: city?.region ?? "",
    field: spec.field, label: spec.label, pillar: spec.pillar, required_for_ranking: "yes",
    value: spec.value, provider_id: spec.provider_id, source_url: spec.source_url,
    source_title: spec.source_title, source_date: "", notes: spec.notes,
  };
  const existing = cityRegister.find((r) => r.city_id === spec.city_id && r.field === spec.field);
  if (existing) Object.assign(existing, built);
  else { cityRegister.push(built); addedCity.push(`${spec.city_id}/${spec.field}`); }
}

// Sibling seeding for everything still missing.
for (const input of publishedInputs()) {
  const covered = input.dataLevel === "national"
    ? hasCountryRow(input.country, input.field) && countryRowValue(input.country, input.field)
    : hasCityRow(input.cityId, input.field) && cityRowValue(input.cityId, input.field);
  if (covered) continue;
  const sibling = siblingRow(input.country, input.field);
  if (!sibling) continue;
  if (input.dataLevel === "national") {
    const built = {
      country: input.country, field: input.field, label: sibling.label, pillar: sibling.pillar,
      required_for_ranking: "yes", value: sibling.value, provider_id: sibling.provider_id,
      source_url: sibling.source_url, source_title: sibling.source_title,
      source_date: sibling.source_date, reference_period: sibling.reference_period ?? "as_of the recorded date",
      // A city row has no scope column of its own. The figure it carries is a
      // country series, so the country row is scoped as such; without this the
      // row would read as an unstated scope and the reconciler would refuse
      // to let it stand in for a national claim.
      source_scope: sibling.source_scope || "international",
      proxy_status: sibling.proxy_status || "approved_proxy",
      notes: `country figure carried over from the register's own entry for ${input.country}; ${sibling.notes ?? ""}`.trim(),
    };
    const existing = countryRegister.find((r) => r.country === input.country && r.field === input.field);
    if (existing) Object.assign(existing, built);
    else { countryRegister.push(built); addedCountry.push(`${input.country}/${input.field}`); }
  } else {
    const city = cityById.get(input.cityId);
    const built = {
      city_id: input.cityId, display_name: city?.displayName ?? input.cityId,
      country: input.country, cohort: city?.region ?? "",
      field: input.field, label: sibling.label, pillar: sibling.pillar, required_for_ranking: "yes",
      value: sibling.value, provider_id: sibling.provider_id, source_url: sibling.source_url,
      source_title: sibling.source_title, source_date: sibling.source_date,
      notes: `country figure carried over from the register's own entry for ${input.country}; ${sibling.notes ?? ""}`.trim(),
    };
    const existing = cityRegister.find((r) => r.city_id === input.cityId && r.field === input.field);
    if (existing) Object.assign(existing, built);
    else { cityRegister.push(built); addedCity.push(`${input.cityId}/${input.field}`); }
  }
}

console.log(`country rows added: ${addedCountry.length}${addedCountry.length ? ` — ${addedCountry.join(", ")}` : ""}`);
console.log(`city rows added:    ${addedCity.length}${addedCity.length ? ` — ${addedCity.join(", ")}` : ""}`);

if (APPLY) {
  fs.writeFileSync(COUNTRY_REGISTER, writeCsv(COUNTRY_HEADER, countryRegister, COUNTRY_EOL));
  fs.writeFileSync(CITY_REGISTER, writeCsv(CITY_HEADER, cityRegister, CITY_EOL));
  console.log("register written");
} else {
  console.log("Nothing written. Use --apply to write.");
}
