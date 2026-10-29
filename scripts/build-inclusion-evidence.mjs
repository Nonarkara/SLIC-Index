#!/usr/bin/env node
/**
 * build-inclusion-evidence.mjs
 *
 * The Community pillar's "Tolerance and pluralism" metric is a composite of
 * three inputs:
 *
 *   inclusion_equaldex_country_raw       0.40   Equaldex country index
 *   inclusion_freedom_house_country_raw  0.30   Freedom in the World total
 *   inclusion_hate_crime_raw             0.30   hate crime per 100k (city) or proxy
 *
 * Until now none of the three had a row in the source register, so the
 * register could not see them and the published numbers were free to drift
 * away from the sources they cited. This script closes that loop:
 *
 *   1. it reads the vendored primary extracts (Freedom House's own workbook,
 *      and the Equaldex country pages as harvested);
 *   2. it writes the register rows for all three inputs; and
 *   3. it sets each published component's value, source title and source URL
 *      to exactly the registered ones.
 *
 * The publication and the register are therefore the same fact, not two
 * documents that happen to agree. Run with --check to assert that they still
 * do; run with --apply to write them.
 *
 * After --apply, run `npm run rescore` (the percentile bounds are recomputed
 * here and the scores follow), then `node scripts/update-csv.mjs`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = path.join(ROOT, "data/verified_sources/sources");

const DATA = path.join(ROOT, "src/data/publishedRankingData.json");
const COUNTRY_REGISTER = path.join(ROOT, "data/verified_sources/country_context.csv");
const CITY_REGISTER = path.join(ROOT, "data/verified_sources/city_inputs.csv");

const FIW_EDITION = 2024;

/**
 * Territories the provider does not score, and the sovereign state whose
 * score stands in for them. Declared, not inferred: a new territory that is
 * missing from this map makes the build fail rather than silently fall back.
 */
const NOT_SCORED_PROXIES = {
  "puerto rico": "united states",
};

const EQUALDEX_FIELD = "inclusion_equaldex_country_raw";
const FH_FIELD = "inclusion_freedom_house_country_raw";
const HATE_CRIME_FIELD = "inclusion_hate_crime_raw";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

const APPLY = process.argv.includes("--apply");
const CHECK = process.argv.includes("--check");
if (APPLY && CHECK) {
  console.error("--apply and --check are mutually exclusive");
  process.exit(2);
}

function readCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
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

function detectEol(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
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

function percentile(sorted, p) {
  if (sorted.length === 0) return null;
  const index = (sorted.length - 1) * p;
  const lo = Math.floor(index);
  const hi = Math.ceil(index);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
}

function normalize(value, p05, p95, dir) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  if (p05 === null || p95 === null || p95 === p05) return null;
  const clamped = Math.min(Math.max(value, p05), p95);
  const raw = dir === "positive"
    ? (100 * (clamped - p05)) / (p95 - p05)
    : (100 * (p95 - clamped)) / (p95 - p05);
  return Math.max(0, Math.min(100, raw));
}

function slugify(country) {
  return country.toLowerCase().replace(/\s+/g, "-");
}

// ── Primary extracts ─────────────────────────────────────────────────────────

const fiwRows = readCsv(fs.readFileSync(path.join(SOURCES, `fiw${FIW_EDITION}-totals.csv`), "utf8"));
const fiwManifest = JSON.parse(fs.readFileSync(path.join(SOURCES, `fiw${FIW_EDITION}-source.json`), "utf8"));
const fiw = new Map(fiwRows.map((row) => [row.country, row]));
const equaldexHarvest = JSON.parse(fs.readFileSync(path.join(SOURCES, "equaldex-harvest.json"), "utf8"));

// ── The publication as it stands ─────────────────────────────────────────────

const publication = JSON.parse(fs.readFileSync(DATA, "utf8"));

/** The three inclusion components of one city, with their current values. */
function inclusionComponents(city) {
  const metric = city.metrics?.community_tolerance_pluralism;
  if (!metric) return null;
  const components = metric.components ?? [];
  return {
    equaldex: components.find((c) => c.key === EQUALDEX_FIELD) ?? null,
    freedomHouse: components.find((c) => c.key === FH_FIELD) ?? null,
    hateCrime: components.find((c) => c.key === HATE_CRIME_FIELD) ?? null,
  };
}

/** Cities that carry a city-level hate-crime figure rather than the proxy. */
const cityHateCrime = [];
for (const city of publication.cities) {
  const parts = inclusionComponents(city);
  if (!parts?.hateCrime) continue;
  if (parts.hateCrime.dataLevel !== "city") continue;
  cityHateCrime.push({ city, component: parts.hateCrime });
}

// ── The target state ─────────────────────────────────────────────────────────

const problems = [];
const countryRows = new Map(); // country -> { equaldex, fh, hateCrime }
const changed = { equaldex: [], freedomHouse: [], hateCrime: [] };

for (const city of publication.cities) {
  const parts = inclusionComponents(city);
  if (!parts?.equaldex || !parts?.freedomHouse || !parts?.hateCrime) {
    problems.push(`${city.cityId}: missing one of the three inclusion components`);
    continue;
  }
  const country = city.country;
  let entry = countryRows.get(country);
  if (!entry) {
    entry = { equaldex: null, freedomHouse: null, hateCrime: null };
    countryRows.set(country, entry);
  }

  // ── Equaldex ───────────────────────────────────────────────────────────────
  if (!entry.equaldex) {
    const harvest = equaldexHarvest.results[country];
    if (!harvest) {
      problems.push(`${country}: no Equaldex harvest for ${country} (re-run scripts/harvest-equaldex-index.mjs)`);
    } else if (harvest.score === null || harvest.score === undefined) {
      problems.push(`${country}: Equaldex harvest produced no score for ${cited}`);
    } else {
      const value = Math.round(harvest.score);
      const url = `https://www.equaldex.com/region/${harvest.resolvedSlug}`;
      const title = `Equaldex LGBTQI Equality Index (legal + public opinion, 0–100) — ${country} country score`;
      entry.equaldex = {
        value,
        url,
        title,
        sourceDate: harvest.retrievedAt.slice(0, 10),
        notes: [
          `equaldex_slug=${harvest.resolvedSlug}`,
          harvest.slugOverridden ? `cited_slug_corrected_from=${harvest.citedSlug}` : "",
          `retrieved_at=${harvest.retrievedAt.slice(0, 10)}`,
          "live index revised by the provider; the published value is the value shown on the cited page on the retrieval date",
        ].filter(Boolean).join("; "),
      };
      if (parts.equaldex.raw !== value) {
        changed.equaldex.push({ country, city: city.cityId, from: parts.equaldex.raw, to: value });
      }
    }
  }

  // ── Freedom House ─────────────────────────────────────────────────────────
  if (!entry.freedomHouse) {
    const key = country.toLowerCase().replace(/&/g, "and").trim();
    const proxyFor = NOT_SCORED_PROXIES[key];
    const sourceKey = proxyFor ?? key;
    const row = fiw.get(sourceKey);
    if (!row) {
      problems.push(`${country}: Freedom House edition ${FIW_EDITION} has no row (add it to NOT_SCORED_PROXIES or the extract)`);
    } else {
      const value = Number(row.total);
      const url = `https://freedomhouse.org/country/${slugify(proxyFor ?? country)}/freedom-world/${FIW_EDITION}`;
      const title = proxyFor
        ? `Freedom House: Freedom in the World ${FIW_EDITION} aggregate score (0–100) — ${proxyFor} (national proxy for ${country})`
        : `Freedom House: Freedom in the World ${FIW_EDITION} aggregate score (0–100) — ${country}`;
      entry.freedomHouse = {
        value,
        url,
        title,
        sourceDate: `${FIW_EDITION}-12-31`,
        notes: [
          `fiw_edition=${FIW_EDITION}`,
          // The register's country_proxy declaration names the territory the
          // row stands in for. It is only written when the provider does not
          // score that territory itself; a plain country row needs none.
          proxyFor ? `country_proxy=${country}` : "",
          proxyFor ? `proxy_source=${proxyFor}` : "",
          `fiw_pr=${row.political_rights}`,
          `fiw_cl=${row.civil_liberties}`,
          `fiw_status=${row.status}`,
          proxyFor ? "provider does not score this territory in this edition" : "",
        ].filter(Boolean).join("; "),
      };
      if (parts.freedomHouse.raw !== value) {
        changed.freedomHouse.push({ country, city: city.cityId, from: parts.freedomHouse.raw, to: value });
      }
    }
  }

  // ── Hate crime ────────────────────────────────────────────────────────────
  if (!entry.hateCrime && parts.hateCrime.dataLevel !== "city") {
    entry.hateCrime = {
      value: parts.hateCrime.raw,
      url: parts.hateCrime.sourceUrl,
      title: parts.hateCrime.source,
      sourceDate: "",
      notes: [
        "analyst proxy declared in scripts/archive/patch-inclusion-composite.mjs",
        "derived from the Freedom House civil-liberties score for this country",
        "directional indicator only; not a measured hate-crime rate and not independently observed",
      ].join("; "),
    };
  }
}

if (problems.length > 0) {
  console.error("FAIL inclusion evidence build:");
  for (const problem of problems.slice(0, 20)) console.error(`  ${problem}`);
  console.error(`${problems.length} problem(s).`);
  process.exit(1);
}

// ── Write the register rows ──────────────────────────────────────────────────

const countryHeader = [
  "country", "field", "label", "pillar", "required_for_ranking", "value", "provider_id",
  "source_url", "source_title", "source_date", "reference_period", "source_scope",
  "proxy_status", "notes",
];
const cityHeader = [
  "city_id", "display_name", "country", "cohort", "field", "label", "pillar",
  "required_for_ranking", "value", "provider_id", "source_url", "source_title", "source_date", "notes",
];

const countryRegister = readCsv(fs.readFileSync(COUNTRY_REGISTER, "utf8"));
const cityRegister = readCsv(fs.readFileSync(CITY_REGISTER, "utf8"));

const INCLUSION_FIELDS = new Set([EQUALDEX_FIELD, FH_FIELD, HATE_CRIME_FIELD]);
const keptCountry = countryRegister.filter((row) => !INCLUSION_FIELDS.has(row.field));

const newCountryRows = [];
for (const [country, entry] of [...countryRows.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (entry.equaldex) {
    newCountryRows.push({
      country,
      field: EQUALDEX_FIELD,
      label: "Equaldex LGBTQI equality index (country)",
      pillar: "community",
      required_for_ranking: "yes",
      value: entry.equaldex.value,
      provider_id: "equaldex",
      source_url: entry.equaldex.url,
      source_title: entry.equaldex.title,
      source_date: entry.equaldex.sourceDate,
      reference_period: "live provider index, retrieved on the recorded date",
      source_scope: "national",
      proxy_status: "direct",
      notes: entry.equaldex.notes,
    });
  }
  if (entry.freedomHouse) {
    newCountryRows.push({
      country,
      field: FH_FIELD,
      label: "Freedom in the World aggregate score (country)",
      pillar: "community",
      required_for_ranking: "yes",
      value: entry.freedomHouse.value,
      provider_id: "freedom_house",
      source_url: entry.freedomHouse.url,
      source_title: entry.freedomHouse.title,
      source_date: entry.freedomHouse.sourceDate,
      reference_period: `Freedom in the World ${FIW_EDITION} (calendar ${FIW_EDITION - 1})`,
      source_scope: "national",
      proxy_status: entry.freedomHouse.notes.includes("country_proxy=") ? "approved_proxy" : "direct",
      notes: entry.freedomHouse.notes,
    });
  }
  if (entry.hateCrime) {
    newCountryRows.push({
      country,
      field: HATE_CRIME_FIELD,
      label: "Hate crime per 100k (country proxy)",
      pillar: "community",
      required_for_ranking: "yes",
      value: entry.hateCrime.value,
      provider_id: "derived",
      source_url: entry.hateCrime.url,
      source_title: entry.hateCrime.title,
      source_date: entry.hateCrime.sourceDate,
      reference_period: "directional proxy; no observation period",
      source_scope: "national",
      proxy_status: "approved_proxy",
      notes: entry.hateCrime.notes,
    });
  }
}

const keptCity = cityRegister.filter((row) => row.field !== HATE_CRIME_FIELD);
const cohortByCity = new Map(cityRegister.map((row) => [row.city_id, row.cohort]));
const newCityRows = cityHateCrime.map(({ city, component }) => ({
  city_id: city.cityId,
  display_name: city.displayName ?? city.cityId,
  country: city.country,
  cohort: cohortByCity.get(city.cityId) ?? city.region ?? "",
  field: HATE_CRIME_FIELD,
  label: "Hate crime per 100k (city)",
  pillar: "community",
  required_for_ranking: "yes",
  value: component.raw,
  provider_id: "city_official_portal",
  source_url: component.sourceUrl,
  source_title: component.source,
  source_date: "",
  reference_period: "reporting year named in the source title",
  notes: "city-level hate-crime figure from the named police or statistics source",
}));

const nextCountryCsv = writeCsv(countryHeader, [...keptCountry, ...newCountryRows], detectEol(fs.readFileSync(COUNTRY_REGISTER, "utf8")));
const nextCityCsv = writeCsv(cityHeader, [...keptCity, ...newCityRows], detectEol(fs.readFileSync(CITY_REGISTER, "utf8")));

// ── Align the publication ────────────────────────────────────────────────────

for (const city of publication.cities) {
  const parts = inclusionComponents(city);
  if (!parts?.equaldex || !parts?.freedomHouse) continue;
  const entry = countryRows.get(city.country);
  if (entry?.equaldex) {
    parts.equaldex.raw = entry.equaldex.value;
    parts.equaldex.source = entry.equaldex.title;
    parts.equaldex.sourceUrl = entry.equaldex.url;
  }
  if (entry?.freedomHouse) {
    parts.freedomHouse.raw = entry.freedomHouse.value;
    parts.freedomHouse.source = entry.freedomHouse.title;
    parts.freedomHouse.sourceUrl = entry.freedomHouse.url;
  }
}

// ── Recompute the percentile bounds the scores are built on ──────────────────

const normStats = publication.normStats ?? {};
for (const [key, dir] of [[EQUALDEX_FIELD, "positive"], [FH_FIELD, "positive"], [HATE_CRIME_FIELD, "negative"]]) {
  const values = [];
  for (const city of publication.cities) {
    const component = inclusionComponents(city)?.[
      key === EQUALDEX_FIELD ? "equaldex" : key === FH_FIELD ? "freedomHouse" : "hateCrime"
    ];
    if (!component || component.raw === null || component.raw === undefined) continue;
    const value = Number(component.raw);
    if (Number.isFinite(value)) values.push(value);
  }
  values.sort((a, b) => a - b);
  if (values.length === 0) continue;
  normStats[key] = {
    p05: Number(percentile(values, 0.05).toFixed(2)),
    p95: Number(percentile(values, 0.95).toFixed(2)),
    dir,
  };
}
publication.normStats = normStats;

// ── Report ───────────────────────────────────────────────────────────────────

function uniquePairs(list) {
  const seen = new Map();
  for (const item of list) {
    const key = `${item.country}:${item.from}->${item.to}`;
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

console.log(`Equaldex  : ${uniquePairs(changed.equaldex).length} countries changed`);
console.log(`FreedomHouse: ${uniquePairs(changed.freedomHouse).length} countries changed`);
console.log(`Hate crime : ${cityHateCrime.length} city-level rows registered, ${countryRows.size - new Set(cityHateCrime.map((r) => r.city.country)).size} country proxies registered`);

if (CHECK) {
  const drift = [];
  // This build owns the three inclusion fields and nothing else. The register
  // files carry many other rows, so the check compares only the rows this
  // script is responsible for.
  const inclusionFields = new Set([EQUALDEX_FIELD, FH_FIELD, HATE_CRIME_FIELD]);
  const onDiskCountry = readCsv(fs.readFileSync(COUNTRY_REGISTER, "utf8"))
    .filter((row) => inclusionFields.has(row.field));
  const onDiskCity = readCsv(fs.readFileSync(CITY_REGISTER, "utf8"))
    .filter((row) => row.field === HATE_CRIME_FIELD);
  const builtCountry = readCsv(nextCountryCsv).filter((row) => inclusionFields.has(row.field));
  const builtCity = readCsv(nextCityCsv).filter((row) => row.field === HATE_CRIME_FIELD);
  const key = (row) => `${row.country ?? row.city_id}|${row.field}`;
  const summarise = (rows) => new Map(rows.map((row) => [key(row), [
    row.value, row.source_url, row.source_title, row.source_date, row.source_scope, row.proxy_status,
  ].join("|")]));
  const onDiskCountryMap = summarise(onDiskCountry);
  const builtCountryMap = summarise(builtCountry);
  for (const [id, signature] of builtCountryMap) {
    if (onDiskCountryMap.get(id) !== signature) {
      drift.push(`country_context.csv row ${id} does not match the built inclusion row`);
    }
  }
  for (const id of onDiskCountryMap.keys()) {
    if (!builtCountryMap.has(id)) drift.push(`country_context.csv has an inclusion row ${id} that the build does not produce`);
  }
  const onDiskCityMap = summarise(onDiskCity);
  const builtCityMap = summarise(builtCity);
  for (const [id, signature] of builtCityMap) {
    if (onDiskCityMap.get(id) !== signature) {
      drift.push(`city_inputs.csv row ${id} does not match the built inclusion row`);
    }
  }
  for (const id of onDiskCityMap.keys()) {
    if (!builtCityMap.has(id)) drift.push(`city_inputs.csv has an inclusion row ${id} that the build does not produce`);
  }
  // The publication's inclusion components only.
  const onDiskPublication = JSON.parse(fs.readFileSync(DATA, "utf8"));
  for (const city of onDiskPublication.cities) {
    const disk = inclusionComponents(city);
    const built = inclusionComponents(publication.cities.find((c) => c.cityId === city.cityId));
    for (const name of ["equaldex", "freedomHouse", "hateCrime"]) {
      const a = disk?.[name];
      const b = built?.[name];
      if (!a || !b) continue;
      if (String(a.raw) !== String(b.raw)
        || String(a.source ?? "").trim() !== String(b.source ?? "").trim()
        || String(a.sourceUrl ?? "").trim() !== String(b.sourceUrl ?? "").trim()) {
        drift.push(`${city.cityId} ${name}: published inclusion component differs from the built one`);
      }
    }
  }
  if (drift.length > 0) {
    console.error("FAIL inclusion evidence drift:");
    for (const line of drift) console.error(`  ${line}`);
    console.error("Run: node scripts/build-inclusion-evidence.mjs --apply && npm run rescore && node scripts/update-csv.mjs");
    process.exit(1);
  }
  console.log("PASS inclusion evidence: publication and register agree with the primary extracts");
  process.exit(0);
}

if (APPLY) {
  fs.writeFileSync(COUNTRY_REGISTER, nextCountryCsv);
  fs.writeFileSync(CITY_REGISTER, nextCityCsv);
  fs.writeFileSync(DATA, `${JSON.stringify(publication, null, 2)}\n`);
  console.log(`wrote ${newCountryRows.length} country rows and ${newCityRows.length} city rows to the register`);
  console.log("Next: npm run rescore && node scripts/update-csv.mjs");
  process.exit(0);
}

console.log("Nothing written. Use --apply to write, or --check to assert.");
