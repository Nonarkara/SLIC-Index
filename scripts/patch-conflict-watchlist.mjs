/**
 * patch-conflict-watchlist.mjs
 *
 * A ranked city index is a claim about liveability. When a city sits on an
 * active conflict line — routine shelter alerts, civilian evacuation zones,
 * targeted strikes on civilian infrastructure — ranking it alongside cities
 * with no such exposure is not honest, regardless of what the normalised
 * homicide line in a WDI table implies.
 *
 * Israel's northern (Haifa) and central-coast (Tel Aviv) metros have been
 * in an active engagement envelope through 2023–2024. Rather than keep
 * tweaking `viability_personal_safety` raws upward, we move both cities to
 * `rankingStatus: "Watchlist"` with a conflict reason. They remain on the
 * board with all metrics intact and visible — readers can see the data —
 * but they do not receive a rank number or occupy a tier slot.
 *
 * When the conflict envelope closes (sustained ceasefire + resident-return),
 * reverse this patch and rescore.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

const CONFLICT_WATCHLIST = [
  {
    cityId: "il-haifa",
    reason:
      "Active Middle East conflict envelope, 2023–2024: sustained Hezbollah rocket + anti-tank fire on Haifa/Northern District; routine shelter alerts and targeted civilian-infrastructure strikes. Removed from ranked board on liveability-honesty grounds. Reverses when sustained ceasefire + resident-return normalises.",
  },
  {
    cityId: "il-tel-aviv",
    reason:
      "Active Middle East conflict envelope, 2023–2024: Hamas / PIJ rocket barrages reaching Tel Aviv metro; frequent civilian shelter alerts and terror-attack exposure. Removed from ranked board on liveability-honesty grounds. Reverses when sustained ceasefire normalises.",
  },
];

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));

  for (const { cityId, reason } of CONFLICT_WATCHLIST) {
    const city = data.cities.find((c) => c.cityId === cityId);
    if (!city) throw new Error(`${cityId} not found`);
    const before = city.rankingStatus;
    city.rankingStatus = "Watchlist";
    city.watchlistReason = reason;
    console.log(`  ${cityId.padEnd(14)} rankingStatus: ${before} → Watchlist (conflict)`);
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log("\nConflict watchlist applied. Run rescore-all-cities.mjs next.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
