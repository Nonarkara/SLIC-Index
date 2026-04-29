import test from "node:test";
import assert from "node:assert/strict";
import publication from "../src/data/publishedRankingData.json" with { type: "json" };

test("publication bundle exposes floor-sensitivity stability analysis", () => {
  const stability = publication.stabilityAnalysis;
  assert.ok(stability, "stabilityAnalysis is missing from the published bundle.");
  assert.equal(
    stability.scope,
    "Public-tier floor sensitivity around the live Alpha and Beta thresholds.",
  );
  assert.equal(stability.scenarios.length, 4, "Expected four floor-sensitivity scenarios.");
  assert.ok(stability.maxTierChangeCount >= 0, "maxTierChangeCount must be non-negative.");
  assert.ok(stability.averageTierChangeCount >= 0, "averageTierChangeCount must be non-negative.");

  const baselineAlpha = stability.baselineMembers?.Alpha ?? [];
  assert.equal(baselineAlpha.length, 10, "Baseline Alpha membership should expose 10 cities.");

  const scenarioIds = stability.scenarios.map((scenario) => scenario.scenarioId);
  assert.deepEqual(scenarioIds, [
    "alpha_floor_minus_5",
    "alpha_floor_plus_5",
    "beta_floor_minus_5",
    "beta_floor_plus_5",
  ]);
});
