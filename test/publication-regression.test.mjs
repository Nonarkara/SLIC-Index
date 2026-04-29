import test from "node:test";
import assert from "node:assert/strict";
import fixture from "./fixtures/publication-benchmark-fixture.json" with { type: "json" };
import publication from "../src/data/publishedRankingData.json" with { type: "json" };

test("benchmark fixture matches the published snapshot for key cities", () => {
  const publicationById = new Map(publication.cities.map((city) => [city.cityId, city]));

  assert.equal(
    publication.publicationManifest?.scorerVersion,
    fixture.scorerVersion,
    "Scorer version drifted from the benchmark fixture.",
  );

  assert.equal(
    publication.publicationManifest?.tierPolicyVersion,
    fixture.tierPolicyVersion,
    "Tier policy version drifted from the benchmark fixture.",
  );

  for (const expected of fixture.benchmarkCities) {
    const actual = publicationById.get(expected.cityId);
    assert.ok(actual, `Published row missing for ${expected.displayName}.`);

    for (const key of [
      "displayName",
      "country",
      "rankingStatus",
      "rank",
      "tierLabel",
      "tierSlot",
      "coverageGrade",
      "slicScore",
      "slicScoreExact",
      "pressureScoreExact",
      "viabilityScoreExact",
      "capabilityScoreExact",
      "communityScoreExact",
      "creativeScoreExact",
    ]) {
      assert.deepEqual(
        actual[key],
        expected[key],
        `${expected.displayName} drifted on ${key}.`,
      );
    }
  }
});
