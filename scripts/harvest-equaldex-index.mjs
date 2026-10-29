#!/usr/bin/env node
/**
 * harvest-equaldex-index.mjs
 *
 * Reads the Equality Index score out of every Equaldex country page the
 * publication cites, and writes the result to a JSON file the register
 * builder consumes.
 *
 * Equaldex has no bulk download and no API, so the page is the source. The
 * score is the width of the meter bar the region page renders:
 *
 *   <div class="ei_meter"><div class="ei_meter_bar" style="width:78%;...">
 *
 * That is the number a reader sees, so it is the number recorded. The
 * retrieval time is recorded with it, because a live, continuously-updated
 * score has no publication date of its own — and a date the harvester
 * invented would be worse than no date.
 *
 * Usage: node scripts/harvest-equaldex-index.mjs [--out path] [--delay ms]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

const OUT = path.resolve(ROOT, arg("--out", "data/verified_sources/_equaldex-harvest.json"));
const DELAY = Number(arg("--delay", "400"));
const TIMEOUT = Number(arg("--timeout", "45000"));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/**
 * Equaldex does not always use the country's common name in its URL. The
 * index's own citation used a slug that does not exist, so the harvest would
 * have come back with a hole in it. Every deviation is declared here rather
 * than guessed, and a country that is missing from this map must resolve at
 * the slug the index cites or the harvest fails.
 */
const SLUG_OVERRIDES = {
  czechia: "czech-republic",
};

/** The meter bar carries the score as a percentage width. */
function extractScore(html) {
  const m = html.match(/class="ei_meter_bar"[^>]*style="width:\s*([\d.]+)%/i);
  if (m) return Number(m[1]);
  const alt = html.match(/ei_meter_bar[^>]*width:\s*([\d.]+)%/i);
  return alt ? Number(alt[1]) : null;
}

/** The page's own name, so a slug that redirects is visible. */
function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

async function fetchScore(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: controller.signal,
    });
    const html = await response.text();
    return {
      url,
      status: response.status,
      finalUrl: response.url,
      score: extractScore(html),
      title: extractTitle(html),
      bytes: html.length,
    };
  } catch (error) {
    return { url, status: 0, finalUrl: url, score: null, title: null, error: String(error.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

const publication = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/publishedRankingData.json"), "utf8"));

/**
 * The harvest is of countries, not of whatever URL the publication currently
 * happens to carry. The citation is derived FROM the harvest, so keying the
 * harvest by the citation would make the two chase each other.
 */
const countries = [...new Set(publication.cities.map((city) => city.country))].sort();
console.log(`harvesting ${countries.length} Equaldex country pages`);

const results = {};
let ok = 0;
const failures = [];
for (const [index, country] of countries.entries()) {
  const citedSlug = country.toLowerCase().replace(/\s+/g, "-");
  const slug = SLUG_OVERRIDES[citedSlug] ?? citedSlug;
  const target = `https://www.equaldex.com/region/${slug}`;
  const result = await fetchScore(target);
  results[country] = {
    ...result,
    country,
    citedSlug,
    resolvedSlug: slug,
    slugOverridden: slug !== citedSlug,
    retrievedAt: new Date().toISOString(),
  };
  if (result.score !== null) ok += 1;
  else {
    failures.push({ country, target, status: result.status });
    console.log(`  [${index + 1}/${countries.length}] NO SCORE ${target} (status ${result.status})`);
  }
  if (index < countries.length - 1) await new Promise((r) => setTimeout(r, DELAY));
}

fs.writeFileSync(OUT, `${JSON.stringify({ retrievedAt: new Date().toISOString(), results }, null, 2)}\n`);
console.log(`PASS equaldex harvest: ${ok}/${countries.length} pages yielded a score -> ${path.relative(ROOT, OUT)}`);
if (failures.length > 0) {
  console.error(`FAIL equaldex harvest: ${failures.length} page(s) produced no score`);
  process.exitCode = 1;
}
