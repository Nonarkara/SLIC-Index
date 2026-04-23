/**
 * patch-housing-widen.mjs
 *
 * Widens the housing-burden winsorization ceiling so that extreme-cost
 * cities (NYC 48%, Paris 45%, London 44%, Zurich 43%, Vancouver 43%,
 * Munich 43%, Toronto 42%, Amsterdam 42%, Copenhagen 40%) stop getting
 * clamped to a score of 0 and start to differentiate from each other.
 *
 *   normStats.housing_burden_raw.p95:  38.85 → 55.0
 *
 * p05 stays at 13.4 (lower end of livable housing burdens). Direction stays
 * "negative" (lower % of income going to housing = better).
 *
 * Run scripts/rescore-all-cities.mjs afterward to propagate the new ceiling
 * into every city's pressure_housing_burden score.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const stat = data.normStats.housing_burden_raw;
  if (!stat) throw new Error("housing_burden_raw not found in normStats");

  const before = { ...stat };
  stat.p95 = 55.0;

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log("Widened housing_burden_raw normStats:");
  console.log(`  before: ${JSON.stringify(before)}`);
  console.log(`  after:  ${JSON.stringify(stat)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
