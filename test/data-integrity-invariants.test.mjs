/**
 * Comprehensive data-integrity invariant suite.
 * Asserts 17 cross-cutting facts the index's credibility depends on.
 * Every future data refresh, tier-rule edit, and rescore runs through here.
 *
 * If any of these fails, do NOT silence the gate — investigate the data.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import publication from "../src/data/publishedRankingData.json" with { type: "json" };

const ranked = publication.cities.filter((c) => c.rankingStatus === "Ranked");
const watch = publication.cities.filter((c) => c.rankingStatus !== "Ranked");
const PILLARS = ["pressureScore", "viabilityScore", "capabilityScore", "communityScore", "creativeScore"];

test("invariant 1 — slicScoreExact = max(0, ampiExact - coveragePenalty)", () => {
  for (const c of publication.cities) {
    if (c.ampiExact == null || c.slicScoreExact == null) continue;
    const expected = Math.max(0, c.ampiExact - (c.coveragePenalty ?? 0));
    assert.ok(
      Math.abs(expected - c.slicScoreExact) < 0.001,
      `${c.displayName}: slicScoreExact=${c.slicScoreExact}, expected=${expected.toFixed(4)} (ampi ${c.ampiExact} − penalty ${c.coveragePenalty ?? 0})`,
    );
  }
});

test("invariant 2 — rank monotonic with slicScoreExact (Ranked only)", () => {
  const sortedByRank = [...ranked].sort((a, b) => a.rank - b.rank);
  for (let i = 1; i < sortedByRank.length; i++) {
    assert.ok(
      sortedByRank[i].slicScoreExact <= sortedByRank[i - 1].slicScoreExact + 0.0001,
      `rank ${sortedByRank[i].rank} ${sortedByRank[i].displayName} (${sortedByRank[i].slicScoreExact}) > rank ${sortedByRank[i - 1].rank} ${sortedByRank[i - 1].displayName} (${sortedByRank[i - 1].slicScoreExact})`,
    );
  }
});

test("invariant 3 — Ranked rank values are dense 1..N with no gaps", () => {
  const ranks = ranked.map((c) => c.rank).sort((a, b) => a - b);
  for (let i = 0; i < ranks.length; i++) {
    assert.equal(ranks[i], i + 1, `Expected rank ${i + 1}, found ${ranks[i]}`);
  }
});

test("invariant 4 — each public tier has exactly 10 dense slots 1..10", () => {
  for (const tier of ["Alpha", "Beta", "Gamma"]) {
    const slots = publication.cities
      .filter((c) => c.tierLabel === tier)
      .map((c) => c.tierSlot)
      .sort((a, b) => a - b);
    assert.equal(slots.length, 10, `${tier}: ${slots.length} cities, expected 10`);
    for (let i = 0; i < slots.length; i++) {
      assert.equal(slots[i], i + 1, `${tier} slot ${i + 1} missing or duplicated`);
    }
  }
});

test("invariant 5 — Watchlist cities hold no public tier", () => {
  for (const c of watch) {
    assert.equal(c.tierLabel, null, `${c.displayName} is ${c.rankingStatus} but tier=${c.tierLabel}`);
  }
});

test("invariant 6 — country cap respected (Taiwan/Japan max 2, others max 1)", () => {
  const tieredByCountry = new Map();
  for (const c of publication.cities.filter((c) => c.tierLabel)) {
    tieredByCountry.set(c.country, (tieredByCountry.get(c.country) ?? 0) + 1);
  }
  for (const [country, count] of tieredByCountry) {
    const cap = country === "Taiwan" || country === "Japan" ? 2 : 1;
    assert.ok(count <= cap, `${country}: ${count} cities in public tiers, cap is ${cap}`);
  }
});

test("invariant 7 — alphaCityExclusions respected (Tokyo not in Alpha)", () => {
  const tokyo = publication.cities.find((c) => c.displayName === "Tokyo");
  if (tokyo) {
    assert.notEqual(tokyo.tierLabel, "Alpha", "Tokyo in Alpha despite editorial exclusion");
  }
});

test("invariant 8 — every Ranked city has all 5 pillar scores", () => {
  for (const c of ranked) {
    for (const p of PILLARS) {
      assert.ok(
        c[p] != null,
        `${c.displayName} (${c.country}): ${p.replace("Score", "")} is null. Either fill the data or move the city to Watchlist.`,
      );
    }
  }
});

test("invariant 9 — every Ranked city has a valid coverage grade (A/B/C)", () => {
  for (const c of ranked) {
    assert.ok(["A", "B", "C"].includes(c.coverageGrade), `${c.displayName}: coverageGrade=${c.coverageGrade}`);
  }
});

test("invariant 10 — methodologyFacts.referenceCities cache matches live cities[]", () => {
  for (const [k, ref] of Object.entries(publication.methodologyFacts?.referenceCities ?? {})) {
    const live = publication.cities.find((c) => c.cityId === ref.cityId);
    assert.ok(live, `referenceCities.${k}: live city ${ref.cityId} not found`);
    for (const f of ["rank", "slicScore", "tierLabel", "tierSlot", "pressureScore", "viabilityScore", "capabilityScore", "communityScore", "creativeScore"]) {
      assert.deepEqual(ref[f], live[f], `referenceCities.${k}.${f}: cached ${ref[f]} vs live ${live[f]}`);
    }
  }
});

test("invariant 11 — methodologyFacts.publicTierMembers cache matches live tier rosters", () => {
  for (const tier of ["Alpha", "Beta", "Gamma"]) {
    const cached = publication.methodologyFacts?.publicTierMembers?.[tier] ?? [];
    const live = publication.cities
      .filter((c) => c.tierLabel === tier)
      .sort((a, b) => a.tierSlot - b.tierSlot);
    assert.equal(cached.length, live.length, `publicTierMembers.${tier}: cached ${cached.length} vs live ${live.length}`);
    cached.forEach((m, i) => {
      assert.equal(m.cityId, live[i].cityId, `publicTierMembers.${tier}[${i}]: cached ${m.cityId} vs live ${live[i].cityId}`);
      assert.equal(m.rank, live[i].rank, `publicTierMembers.${tier}[${i}].rank: cached ${m.rank} vs live ${live[i].rank}`);
    });
  }
});

test("invariant 12 — methodologyFacts counts match live cities[]", () => {
  const mf = publication.methodologyFacts;
  assert.equal(mf.cityCount, publication.cities.length, `cityCount drift: ${mf.cityCount} vs ${publication.cities.length}`);
  assert.equal(mf.rankedCityCount, ranked.length, `rankedCityCount drift: ${mf.rankedCityCount} vs ${ranked.length}`);
  assert.equal(mf.watchlistCityCount, watch.length, `watchlistCityCount drift: ${mf.watchlistCityCount} vs ${watch.length}`);
});

test("invariant 13 — slic-ranked-cities-v2.csv row count matches Ranked.length + 1 header (after stripping # preamble)", async () => {
  const fs = await import("node:fs");
  const csv = fs
    .readFileSync("public/downloads/slic-ranked-cities-v2.csv", "utf8")
    .trim()
    .split("\n")
    .filter((line) => !line.startsWith("#"));
  assert.equal(csv.length, ranked.length + 1, `CSV (excluding # preamble): ${csv.length} lines, expected ${ranked.length + 1}`);
});

test("invariant 14 — every metric key on a city exists in metricCatalog", () => {
  const catalogKeys = new Set(Object.keys(publication.metricCatalog ?? {}));
  const orphans = new Set();
  for (const c of publication.cities) {
    for (const k of Object.keys(c.metrics ?? {})) {
      if (!catalogKeys.has(k)) orphans.add(k);
    }
  }
  assert.equal(orphans.size, 0, `Metric keys missing from catalog: ${[...orphans].join(", ")}`);
});

test("invariant 15 — pillar scores are within [0, 100]", () => {
  for (const c of publication.cities) {
    for (const p of PILLARS) {
      const v = c[p];
      if (v != null) {
        assert.ok(v >= 0 && v <= 100, `${c.displayName}.${p}=${v} out of [0,100]`);
      }
    }
  }
});

test("invariant 16 — cityId is unique across cities[]", () => {
  const seen = new Map();
  for (const c of publication.cities) {
    assert.ok(!seen.has(c.cityId), `Duplicate cityId: ${c.cityId} (${seen.get(c.cityId)} and ${c.displayName})`);
    seen.set(c.cityId, c.displayName);
  }
});

test("invariant 17 — every city has a non-empty country name", () => {
  for (const c of publication.cities) {
    assert.ok(c.country && c.country.length > 0, `${c.displayName}: missing country`);
  }
});

/* ── Declared-vs-actual disclosure ─────────────────────────────────────────────
 * The methodology publishes a weight for every scored metric. A metric that is
 * declared scored but produces a score for nobody is a silent lie in the weights:
 * a reader reproducing from the published table gets different numbers.
 * `viability_transit_access_commute` is exactly that today, and the methodology
 * page discloses it in full ("only 7 of 158 cities have raw data ... all cities
 * show null transit scores"). These two tests keep declaration, reality, and
 * disclosure locked together — if transit ever activates, or another metric goes
 * dark, the copy has to be updated in the same commit.
 * ──────────────────────────────────────────────────────────────────────────── */

const KNOWN_DORMANT = ["viability_transit_access_commute"];

test("invariant 18 — the dormant metric set is exactly what the methodology discloses", () => {
  const catalog = publication.metricCatalog;
  const dormant = Object.entries(catalog)
    .filter(([key, meta]) =>
      meta.scored &&
      !publication.cities.some((c) => c.metrics?.[key]?.score !== null && c.metrics?.[key]?.score !== undefined))
    .map(([key]) => key)
    .sort();
  assert.deepEqual(
    dormant,
    [...KNOWN_DORMANT].sort(),
    `Dormant scored metrics changed. Actual: [${dormant}]. Update the methodology copy ` +
      `(methodologyData.ts) and KNOWN_DORMANT together — the published weights must never ` +
      `claim a metric contributes when it scores for nobody.`,
  );
});

test("invariant 19 — every dormant metric is described as inactive in the methodology copy", async () => {
  const src = await readFile(new URL("../src/methodologyData.ts", import.meta.url), "utf8");
  for (const key of KNOWN_DORMANT) {
    const label = publication.metricCatalog[key]?.label;
    assert.ok(label, `${key}: missing catalog label`);
    const idx = src.indexOf(label);
    assert.ok(idx > -1, `${key}: "${label}" is not documented on the methodology page`);
    const window_ = src.slice(idx, idx + 900);
    assert.match(
      window_,
      /inactive|null .*scores|not scored/i,
      `${key}: the methodology mentions "${label}" but does not say it is inactive`,
    );
  }
});
