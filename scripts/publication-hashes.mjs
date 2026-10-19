import { createHash } from "node:crypto";
import { PUBLIC_METRICS } from "../src/publicationMath.js";

export function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

export function digest(value) {
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

// Keep these projections identical to the original scorer's manifest payloads.
export function inputSnapshot(data) {
  return {
    normStats: data.normStats ?? {},
    cities: data.cities.map((city) => ({
      cityId: city.cityId,
      metrics: Object.fromEntries(PUBLIC_METRICS.map((metric) => [metric.key, {
        raw: city.metrics?.[metric.key]?.raw ?? null,
        dataLevel: city.metrics?.[metric.key]?.dataLevel ?? null,
        components: (city.metrics?.[metric.key]?.components ?? []).map((component) => ({
          key: component.key,
          raw: component.raw ?? null,
          dataLevel: component.dataLevel ?? null,
        })),
      }])),
      watchlistReason: city.watchlistReason ?? null,
    })),
  };
}

export function citySnapshot(city) {
  return {
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    rankingStatus: city.rankingStatus,
    rank: city.rank ?? 0,
    tierLabel: city.tierLabel ?? null,
    tierSlot: city.tierSlot ?? null,
    slicScore: city.slicScore ?? null,
    slicScoreExact: city.slicScoreExact ?? city.slicScore ?? null,
  };
}

export function publicationHashes(data) {
  return {
    normStatsHash: digest(data.normStats ?? {}),
    inputDataHash: digest(inputSnapshot(data)),
    metricCatalogHash: digest(data.metricCatalog ?? {}),
    publicationHash: digest(data.cities.map(citySnapshot)),
  };
}

export function verifyPublicationHashes(data) {
  return Object.entries(publicationHashes(data)).flatMap(([key, expected]) => {
    const stored = data.publicationManifest?.[key];
    if (typeof stored !== "string" || !/^[0-9a-f]{64}$/.test(stored)) {
      return [`${key} is missing or invalid in publicationManifest`];
    }
    return stored === expected ? [] : [`${key} does not reproduce from the bundle (pipeline canonicalisation)`];
  });
}
