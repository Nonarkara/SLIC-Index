#!/usr/bin/env node
/**
 * reconcile-publication-to-register.mjs
 *
 * Where the register holds a figure for a published input, the publication
 * takes that figure — the value, the source title and the source URL — from
 * the register. The register is the curated record; the publication is what
 * the reader sees. When the two disagree, the register is right, because
 * that is the document that was curated against a source.
 *
 * This is what closes the last of the value-mismatches:
 *
 *   * a national input must carry the same figure for every city of its
 *     country, and the register holds one figure per country;
 *   * a country's GDP-growth context is the register's five-year average,
 *     not whichever single year a city happened to be patched with;
 *   * a city's figure that disagrees with its own register row is corrected
 *     to the register's value.
 *
 * Usage:
 *   node scripts/reconcile-publication-to-register.mjs --apply
 *   node scripts/reconcile-publication-to-register.mjs --check
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/data/publishedRankingData.json");
const COUNTRY_REGISTER = path.join(ROOT, "data/verified_sources/country_context.csv");
const CITY_REGISTER = path.join(ROOT, "data/verified_sources/city_inputs.csv");
const ALIAS_FILE = path.join(ROOT, "data/verified_sources/field_aliases.csv");

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

/**
 * Inputs the register deliberately does not claim. A declared exemption is a
 * statement that the figure cannot be re-read from the cited source, so the
 * register stays silent rather than asserting something it cannot support.
 * Exempt inputs are left exactly as the publication has them.
 */
const EXEMPTIONS = new Map();
const EXEMPTION_FILE = path.join(ROOT, "data/verified_sources/register_exemptions.csv");
if (fs.existsSync(EXEMPTION_FILE)) {
  for (const row of readCsv(fs.readFileSync(EXEMPTION_FILE, "utf8"))) {
    const key = `${row.city_id}|${row.input_key}`;
    EXEMPTIONS.set(key, row);
  }
}

const aliases = new Map();
if (fs.existsSync(ALIAS_FILE)) {
  for (const row of readCsv(fs.readFileSync(ALIAS_FILE, "utf8"))) {
    aliases.set(row.publication_input_key?.trim(), row.register_field?.trim());
  }
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

/** The register row for a published input, or null. */
function registerRow(city, field, dataLevel) {
  const own = cityIndex.get(`${city.cityId}|${field}`);
  if (own) return own;
  const alias = aliases.get(field);
  if (alias) {
    const aliasedOwn = cityIndex.get(`${city.cityId}|${alias}`);
    if (aliasedOwn) return aliasedOwn;
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
const changes = [];
const unresolved = [];
const exempted = [];

for (const city of publication.cities) {
  for (const [metricKey, metric] of Object.entries(city.metrics ?? {})) {
    // A direct metric names its input in the catalogue, not on the metric
    // itself; a composite names it in the components.
    const catalogInput = publication.metricCatalog?.[metricKey]?.inputKey ?? metric.inputKey;
    // `ref` is the object that actually holds the value. For a composite that
    // is the component; for a direct metric it is the metric itself. Writing
    // to a copy of the metric would change nothing on disk.
    const targets = metric.components?.length
      ? metric.components.map((component) => ({ ref: component, key: component.key }))
      : (catalogInput ? [{ ref: metric, key: catalogInput }] : []);
    for (const target of targets) {
      const value = target.ref.raw;
      const dataLevel = target.ref.dataLevel;
      if (value === null || value === undefined) continue;
      const exemption = EXEMPTIONS.get(`${city.cityId}|${target.key}`);
      if (exemption) {
        exempted.push({ cityId: city.cityId, field: target.key, raw: value, reason: exemption.reason });
        continue;
      }
      const row = registerRow(city, target.key, dataLevel);
      if (!row) {
        unresolved.push({ cityId: city.cityId, field: target.key, raw: value });
        continue;
      }
      const before = { raw: value, source: target.ref.source, sourceUrl: target.ref.sourceUrl };
      // A figure written 45 and a figure written 45.0 are the same figure.
      // Compare as numbers where both are numbers, and keep the publication's
      // own number type so a reconcile never rewrites 45 into "45.0".
      const registerNumber = Number(row.value);
      const sameNumber = Number.isFinite(registerNumber)
        && Number.isFinite(Number(before.raw))
        && registerNumber === Number(before.raw);
      const after = {
        raw: sameNumber ? before.raw : row.value,
        source: row.source_title,
        sourceUrl: row.source_url,
      };
      const same = (sameNumber || String(before.raw) === String(row.value))
        && String(before.source ?? "").trim() === String(after.source).trim()
        && String(before.sourceUrl ?? "").trim() === String(after.sourceUrl).trim();
      if (same) continue;
      changes.push({ cityId: city.cityId, metricKey, field: target.key, before, after });
      if (APPLY) {
        target.ref.raw = after.raw;
        target.ref.source = after.source;
        target.ref.sourceUrl = after.sourceUrl;
      }
    }
  }
}

const byField = new Map();
for (const change of changes) {
  const key = change.field;
  if (!byField.has(key)) byField.set(key, []);
  byField.get(key).push(change);
}

console.log(`inputs reconciled to the register: ${changes.length}`);
for (const [field, list] of [...byField.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const valueChanges = list.filter((c) => String(c.before.raw) !== String(c.after.raw)).length;
  console.log(`  ${field.padEnd(30)} ${String(list.length).padStart(4)} changed (${valueChanges} values, ${list.length - valueChanges} citations only)`);
}
console.log(`inputs with no register row: ${unresolved.length}`);
console.log(`declared exemptions honoured: ${exempted.length}`);

if (CHECK) {
  // Compared by meaning, not by bytes: the publication is written by more
  // than one tool, and two writers rarely agree on how to spell a float.
  if (changes.length > 0) {
    console.error(`FAIL publication does not follow the register (${changes.length} input(s) differ):`);
    for (const change of changes.slice(0, 15)) {
      console.error(`  ${change.cityId}/${change.field}: ${change.before.raw} -> ${change.after.raw}`);
    }
    console.error("Run: node scripts/reconcile-publication-to-register.mjs --apply && npm run rescore");
    process.exit(1);
  }
  if (unresolved.length > 0) {
    console.error(`FAIL ${unresolved.length} published input(s) have no register row and no exemption`);
    process.exit(1);
  }
  console.log("PASS publication follows the register");
  process.exit(0);
}

if (APPLY) {
  fs.writeFileSync(DATA, `${JSON.stringify(publication, null, 2)}\n`);
  console.log("publication written. Next: npm run rescore && node scripts/update-csv.mjs");
  process.exit(0);
}

console.log("Nothing written. Use --apply to write, or --check to assert.");
