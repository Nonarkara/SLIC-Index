import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const publication = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/publishedRankingData.json"), "utf8"),
);
const citiesById = new Map(publication.cities.map((c) => [c.cityId, c]));
const citiesByName = new Map(
  publication.cities.map((c) => [c.displayName.toLowerCase(), c]),
);

test("ECHO_CHAMBER_NOTES slicRank matches publishedRankingData.json for every in-dataset city", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/compareRankingsData.ts"), "utf8");
  const start = src.indexOf("export const ECHO_CHAMBER_NOTES");
  assert.notEqual(start, -1, "ECHO_CHAMBER_NOTES export not found");
  const section = src.slice(start);

  const entryRe = /(?:"([^"]+)"|([a-z]+)):\s*\{\s*slicRank:\s*(\d+)/g;
  let checked = 0;
  for (const match of section.matchAll(entryRe)) {
    const key = (match[1] ?? match[2]).toLowerCase();
    const claimedRank = Number(match[3]);
    const city = citiesByName.get(key);
    assert.ok(city, `ECHO_CHAMBER_NOTES key "${key}" not found in publishedRankingData.json`);
    assert.equal(
      claimedRank,
      city.rank,
      `ECHO_CHAMBER_NOTES.${key}.slicRank is #${claimedRank}, but published rank is #${city.rank}`,
    );
    checked += 1;
  }
  assert.ok(checked >= 10, `Expected at least 10 in-dataset ECHO_CHAMBER_NOTES entries, found ${checked}`);
});

test("cityEditorialTranslations.ts SLIC and pillar figures match publishedRankingData.json", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/cityEditorialTranslations.ts"), "utf8");
  const blocks = src.split(/"([a-z]{2}-[a-z-]+)":\s*\{/);
  const drifts = [];

  for (let i = 1; i < blocks.length; i += 2) {
    const cityId = blocks[i];
    const body = blocks[i + 1];
    const city = citiesById.get(cityId);
    if (!city) continue;

    const slicActual = Number(city.slicScore.toFixed(1));
    const pillars = {
      Pressure: Number(city.pressureScore.toFixed(1)),
      Viability: Number(city.viabilityScore.toFixed(1)),
      Capability: Number(city.capabilityScore.toFixed(1)),
      Community: Number(city.communityScore.toFixed(1)),
      Creative: Number(city.creativeScore.toFixed(1)),
    };

    for (const m of body.matchAll(/SLIC\s+(\d+(?:\.\d+)?)/g)) {
      const v = Number(m[1]);
      if (Math.abs(v - slicActual) > 0.05) {
        drifts.push(`${cityId}: editorial says SLIC ${v}, published is ${slicActual}`);
      }
    }

    for (const m of body.matchAll(/pure rank #(\d+)/gi)) {
      const r = Number(m[1]);
      if (city.rank != null && r !== city.rank) {
        drifts.push(`${cityId}: editorial says pure rank #${r}, published is #${city.rank}`);
      }
    }

    for (const [pillar, actual] of Object.entries(pillars)) {
      const reAfter = new RegExp(`${pillar}\\s*(?:score\\s+of|score|at)?\\s*\\(?(\\d+\\.\\d+)\\)?`, "g");
      for (const m of body.matchAll(reAfter)) {
        const v = Number(m[1]);
        if (Math.abs(v - actual) > 0.05) {
          drifts.push(`${cityId}: editorial says ${pillar} ${v}, published is ${actual}`);
        }
      }
      const reBefore = new RegExp(`scores\\s+(\\d+\\.\\d+)\\s+on\\s+${pillar}`, "gi");
      for (const m of body.matchAll(reBefore)) {
        const v = Number(m[1]);
        if (Math.abs(v - actual) > 0.05) {
          drifts.push(`${cityId}: editorial says ${v} on ${pillar}, published is ${actual}`);
        }
      }
    }
  }

  assert.deepEqual(drifts, [], `Editorial score drift detected:\n${drifts.join("\n")}`);
});

test("HomePage verdict matches published Singapore and Dubai facts", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/HomePage.tsx"), "utf8");
  const sg = citiesById.get("sg-singapore");
  assert.equal(sg?.tierLabel, "Alpha", "Expected Singapore to be Alpha in published data");
  assert.doesNotMatch(
    home,
    /Singapore[^"]*Gamma tier/i,
    "HomePage.tsx must not claim Singapore is Gamma tier when published tier is Alpha",
  );

  const dubai = citiesById.get("ae-dubai");
  assert.equal(dubai?.tierLabel, "Gamma", "Expected Dubai to be Gamma in published data");
  assert.match(home, new RegExp(`Dubai scores ${dubai.pressureScore.toFixed(1)} on Pressure and ${dubai.capabilityScore.toFixed(1)} on Capability`), "HomePage Dubai verdict Pressure/Capability must match published data");
  assert.match(home, new RegExp(`Community sits at ${dubai.communityScore.toFixed(1)}`), "HomePage Dubai verdict Community must match published data");
});
