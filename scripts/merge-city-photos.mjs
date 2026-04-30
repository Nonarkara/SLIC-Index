/**
 * Read /tmp/city-photos-fetch.json (output of fetch-missing-city-photos.mjs)
 * and append the new entries to the ALPHA_CITY_EDITORIAL map in
 * src/cityEditorial.ts. Adds photo-only entries (no heroLine/intro);
 * heroLine and intro are now optional in CityEditorialSeed.
 *
 * Also adds 4 hand-picked entries for cities the fetch script could not
 * resolve from Wikipedia summary (non-commons main image or no image).
 */
import { readFileSync, writeFileSync } from "node:fs";

const MANUAL_FALLBACKS = {
  "ae-dubai": {
    fileName: "Burj Khalifa floor view from west.jpg",
    credit: "Donaldytong",
    alt: "Dubai skyline with Burj Khalifa.",
  },
  "lt-vilnius": {
    fileName: "Vilnius from Gediminas Tower.jpg",
    credit: "Pofka",
    alt: "Vilnius Old Town panorama from Gediminas Tower.",
  },
  "mx-merida": {
    fileName: "Catedral Merida 02.jpg",
    credit: "Diego Delso",
    alt: "Mérida Cathedral on the central plaza.",
  },
  "ws-apia": {
    fileName: "Apia Harbour, Samoa - panoramio.jpg",
    credit: "kismihok",
    alt: "Apia harbour in Samoa.",
  },
};

const fetched = JSON.parse(readFileSync("/tmp/city-photos-fetch.json", "utf8"));
const ok = fetched.filter((x) => x.fileName);

let editorialSrc = readFileSync("src/cityEditorial.ts", "utf8");

// Find the closing `};` of ALPHA_CITY_EDITORIAL and insert before it.
// The map opens with `const ALPHA_CITY_EDITORIAL: Record<string, CityEditorialSeed> = {`
// and closes with `};` at column 0.
const openMarker = "const ALPHA_CITY_EDITORIAL: Record<string, CityEditorialSeed> = {";
const openIdx = editorialSrc.indexOf(openMarker);
if (openIdx < 0) {
  console.error("Could not locate ALPHA_CITY_EDITORIAL opening");
  process.exit(1);
}
// Find first standalone "};" after openIdx
const afterOpen = editorialSrc.slice(openIdx);
const closeOffset = afterOpen.search(/\n\};\n/);
if (closeOffset < 0) {
  console.error("Could not locate ALPHA_CITY_EDITORIAL closing");
  process.exit(1);
}
const closeIdx = openIdx + closeOffset;

// Compose the new entries
function emit(cityId, p) {
  const altClean = p.alt.replace(/"/g, '\\"');
  const creditClean = p.credit.replace(/"/g, '\\"');
  const filenameClean = p.fileName.replace(/"/g, '\\"');
  return [
    `  "${cityId}": {`,
    `    photo: {`,
    `      fileName: "${filenameClean}",`,
    `      credit: "${creditClean}",`,
    `      alt: "${altClean}",`,
    `    },`,
    `  },`,
  ].join("\n");
}

const newBlocks = [];

// Existing keys we should NOT overwrite
const existingKeyMatches = [...editorialSrc.slice(openIdx, closeIdx).matchAll(/^\s*"([a-z0-9-]+)":\s*\{/gm)];
const existingKeys = new Set(existingKeyMatches.map((m) => m[1]));

// 1) Add fetched cities
for (const r of ok) {
  if (existingKeys.has(r.cityId)) continue;
  const alt = `${r.displayName}, ${r.country} — Wikimedia Commons photograph.`;
  newBlocks.push(emit(r.cityId, { fileName: r.fileName, credit: r.credit, alt }));
}

// 2) Add manual fallbacks
for (const [cityId, p] of Object.entries(MANUAL_FALLBACKS)) {
  if (existingKeys.has(cityId)) continue;
  newBlocks.push(emit(cityId, p));
}

const insertion = "\n\n  // — Photo-only entries (Wikimedia Commons attribution) —\n" + newBlocks.join("\n") + "\n";

const updated = editorialSrc.slice(0, closeIdx) + insertion + editorialSrc.slice(closeIdx);
writeFileSync("src/cityEditorial.ts", updated);
console.log(`Inserted ${newBlocks.length} photo-only entries.`);
