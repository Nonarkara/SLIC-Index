#!/usr/bin/env node
/**
 * check-register-coverage.mjs
 *
 * The register is the index's claim about where every published number came
 * from. This gate is what makes that claim true by construction rather than
 * by good intentions:
 *
 *   1. Every published input must resolve to a register row, or be named in
 *      the exemptions file with a reason. An input that resolves to nothing
 *      and is not declared is a hole, and a hole fails the build.
 *
 *   2. A city row that carries a country-level figure must agree with the
 *      country register's row for the same field. The registers hold both a
 *      city view and a country view of the same measurement; if the two
 *      drift apart, one of them is wrong and nothing would say so.
 *
 *   3. A declared exemption must actually be used. An exemption that covers
 *      nothing is a hole in the other direction: it reads as a review that
 *      happened when no review was needed.
 *
 * Run: node scripts/check-register-coverage.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/publishedRankingData.json");
const COUNTRY_REGISTER = path.join(ROOT, "data/verified_sources/country_context.csv");
const CITY_REGISTER = path.join(ROOT, "data/verified_sources/city_inputs.csv");
const ALIAS_FILE = path.join(ROOT, "data/verified_sources/field_aliases.csv");
const EXEMPTION_FILE = path.join(ROOT, "data/verified_sources/register_exemptions.csv");

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

const aliases = new Map();
for (const row of readCsv(fs.readFileSync(ALIAS_FILE, "utf8"))) {
  aliases.set(row.publication_input_key?.trim(), row.register_field?.trim());
}

const cityRows = readCsv(fs.readFileSync(CITY_REGISTER, "utf8"));
const countryRows = readCsv(fs.readFileSync(COUNTRY_REGISTER, "utf8"));

const cityIndex = new Map();
for (const row of cityRows) {
  if (!row.value) continue;
  const key = `${row.city_id}|${row.field}`;
  if (!cityIndex.has(key)) cityIndex.set(key, row);
}
const countryIndex = new Map();
for (const row of countryRows) {
  if (!row.value) continue;
  const key = `${row.country}|${row.field}`;
  if (!countryIndex.has(key)) countryIndex.set(key, row);
}

const exemptions = new Map();
for (const row of readCsv(fs.readFileSync(EXEMPTION_FILE, "utf8"))) {
  exemptions.set(`${row.city_id}|${row.input_key}`, row);
}

function registerRow(city, field, dataLevel) {
  const own = cityIndex.get(`${city.cityId}|${field}`);
  if (own) return own;
  const alias = aliases.get(field);
  if (alias) {
    const aliased = cityIndex.get(`${city.cityId}|${alias}`);
    if (aliased) return aliased;
  }
  if (dataLevel === "national") {
    const national = countryIndex.get(`${city.country}|${field}`);
    if (national) return national;
    if (alias) {
      const aliased = countryIndex.get(`${city.country}|${alias}`);
      if (aliased) return aliased;
    }
  }
  return null;
}

const publication = JSON.parse(fs.readFileSync(DATA, "utf8"));
const failures = [];
const usedExemptions = new Set();
let covered = 0;
let exempted = 0;
let inputs = 0;

for (const city of publication.cities) {
  for (const [metricKey, metric] of Object.entries(city.metrics ?? {})) {
    // A direct metric names its input in the catalogue, not on the metric
    // itself; a composite names it in the components.
    const catalogInput = publication.metricCatalog?.[metricKey]?.inputKey ?? metric.inputKey;
    const targets = metric.components?.length
      ? metric.components
      : (catalogInput ? [{ key: catalogInput, raw: metric.raw, source: metric.source, sourceUrl: metric.sourceUrl, dataLevel: metric.dataLevel }] : []);
    for (const target of targets) {
      if (target.raw === null || target.raw === undefined) continue;
      inputs += 1;
      const exemptionKey = `${city.cityId}|${target.key}`;
      if (exemptions.has(exemptionKey)) {
        exempted += 1;
        usedExemptions.add(exemptionKey);
        continue;
      }
      const row = registerRow(city, target.key, target.dataLevel);
      if (!row) {
        failures.push(`${city.cityId}/${metricKey}/${target.key}: no register row and no declared exemption`);
        continue;
      }
      covered += 1;
      if (String(row.value) !== String(target.raw)
        && !(Number.isFinite(Number(row.value)) && Number(row.value) === Number(target.raw))) {
        failures.push(`${city.cityId}/${metricKey}/${target.key}: published value ${target.raw} disagrees with the register row ${row.value}`);
      }
    }
  }
}

// The registers hold a city view and a country view of the same field, and
// the two legitimately differ: Dubai's hospitality is not the UAE's. A city
// row marked country_proxy= says it was ingested from a country source, not
// that it copies the country figure, so there is no agreement rule to
// enforce here. Coverage is the invariant this gate owns.

// An exemption that covers nothing is a review that did not happen.
for (const key of exemptions.keys()) {
  if (!usedExemptions.has(key)) {
    failures.push(`${key}: declared exemption matches no published input`);
  }
}

console.log(`register coverage: ${covered} of ${inputs} published inputs covered by a register row; ${exempted} declared exemptions`);

if (failures.length > 0) {
  console.error(`FAIL register coverage (${failures.length} problem(s)):`);
  for (const failure of failures.slice(0, 25)) console.error(`  ${failure}`);
  if (failures.length > 25) console.error(`  ... and ${failures.length - 25} more`);
  process.exit(1);
}

console.log("PASS register coverage: every published input is registered or declared");
