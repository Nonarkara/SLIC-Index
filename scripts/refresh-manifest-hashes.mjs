/**
 * Refresh publicationManifest.{normStatsHash,metricCatalogHash} so the
 * integrity hashes in the bundle match the current data.
 *
 * The publication pipeline (rescore + check-publication) updates updatedAt
 * and the city-level fields, but the manifest-level content hashes drift
 * because the data files are edited in place during a re-publication. This
 * is the small follow-up that pins them back to the current sha256.
 *
 * Safe to run any time. Read-modify-write the JSON so we only touch the
 * two hash fields and updatedAt.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "noop.js"));
const DATA = join(ROOT, "src/data/publishedRankingData.json");

const d = require(DATA);
const sha = (s) => createHash("sha256").update(s).digest("hex");

const newNorm = sha(JSON.stringify(d.normStats ?? {}));
const newCat = sha(JSON.stringify(d.metricCatalog ?? {}));

const oldNorm = d.publicationManifest?.normStatsHash;
const oldCat = d.publicationManifest?.metricCatalogHash;

d.publicationManifest = d.publicationManifest ?? {};
d.publicationManifest.normStatsHash = newNorm;
d.publicationManifest.metricCatalogHash = newCat;
// Re-stamp the publication moment to now (UTC, ISO 8601) so any consumer
// that re-runs the audit finds the same value across all three fields.
d.updatedAt = new Date().toISOString();
d.publicationManifest.generatedAt = d.updatedAt;

writeFileSync(DATA, JSON.stringify(d, null, 2) + "\n");

const stamp = new Date().toISOString();
console.log(`refresh-manifest-hashes  ${stamp}`);
console.log(`  normStatsHash     ${oldNorm ?? "(none)"}  →  ${newNorm}`);
console.log(`  metricCatalogHash ${oldCat ?? "(none)"}  →  ${newCat}`);
console.log(`  updatedAt         ${d.updatedAt}`);
