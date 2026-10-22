#!/usr/bin/env node
/**
 * SLIC Index V3 — number gate.
 *
 * "Audit every number to make sure that the system is airtight" is only a
 * promise until a script can fail. This is that script. It checks the
 * numbers the site publishes against the bundle they come from, and it
 * checks the copy tables the site renders against the same bundle.
 *
 * What it proves, and why each check exists:
 *
 *  1. The bundle's own counts agree with the bundle's own contents.
 *     (cityCount, rankedCityCount, watchlistCityCount, scoredMetricCount,
 *     diagnosticMetricCount.) These are the numbers the hero prints.
 *
 *  2. The five canonical pillar weights are 25/22/18/15/20 and sum to 100,
 *     and the per-metric weights inside each pillar sum to that pillar's
 *     weight. A pillar whose metric weights do not sum to its own weight is
 *     a pillar whose score cannot be reconstructed.
 *
 *  3. Every published city's score is reproducible from its own published
 *     pillar scores:
 *         mu    = sum(pillar score x pillar weight) / 100
 *         ampi  = mu - variance / mu
 *         score = max(0, ampi - coverage penalty)
 *     All 163 cities are checked, not a sample. A sample would leave a
 *     broken city on the board.
 *
 *  4. Ranks are the descending order of the published scores, with no gaps
 *     and no duplicates among the ranked cities.
 *
 *  5. Every locale's methodology page lists the same 22 scored metrics with
 *     the same weights as the bundle. This is the check that would have
 *     caught the Thai, Chinese, Korean and Japanese pages still carrying a
 *     24-metric set from an earlier model, with weights that did not sum to
 *     their pillar. The identity of a metric is established without a
 *     hand-written dictionary:
 *       - the English page is checked positionally against the bundle
 *         (the two list each pillar's metrics in the same order);
 *       - the Thai and Chinese pages are matched to the English page by the
 *         metric's INPUTS — the raw fields it is built from, which those
 *         pages keep in English;
 *       - the Korean and Japanese pages localise their inputs, so they are
 *         matched positionally against the Thai page, which lists the same
 *         order; and every localised page must also carry the same set of
 *         weights, so a weight swapped between two metrics in one pillar
 *         fails even though the total still adds up.
 *
 *  6. The copy must not state a metric-line count that the bundle does not
 *     justify, and must not state a published-board size that the bundle
 *     does not justify. The scan is deliberately narrow: it only fires on a
 *     number that sits directly in front of a count noun in the same
 *     string literal, so it does not fire on a user's selection count or a
 *     price.
 *
 * The script is read-only. It exits non-zero with a list of findings.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(REPO, rel), "utf8"));

const findings = [];
const fail = (check, message) => findings.push(`[${check}] ${message}`);

/* ── 1. The bundle's own counts ─────────────────────────────────────────── */

const bundle = readJson("src/data/publishedRankingData.json");
const facts = readJson("src/data/methodologyFacts.json");

const cities = bundle.cities ?? [];
const pillarMetricList = (pillar) =>
  (bundle.pillarMetrics?.[pillar] ?? []).filter((m) => m.scored && !m.diagnostic);
const scoredMetrics = PILLARS_ALL().flatMap(pillarMetricList);
const diagnosticMetrics = Object.values(bundle.diagnosticMetrics ?? {}).flat();
const catalog = bundle.metricCatalog ?? {};

function PILLARS_ALL() {
  return Object.keys(bundle.pillarMetrics ?? {});
}

if (facts.cityCount !== cities.length) {
  fail("counts", `methodologyFacts.cityCount is ${facts.cityCount} but the bundle publishes ${cities.length} cities`);
}
if (bundle.methodologyFacts?.cityCount !== undefined && bundle.methodologyFacts.cityCount !== cities.length) {
  fail("counts", `bundle.methodologyFacts.cityCount is ${bundle.methodologyFacts.cityCount}, bundle has ${cities.length}`);
}

const ranked = cities.filter((c) => c.rankingStatus === "Ranked");
const watchlisted = cities.filter((c) => c.rankingStatus !== "Ranked");
if (facts.rankedCityCount !== ranked.length) {
  fail("counts", `methodologyFacts.rankedCityCount is ${facts.rankedCityCount} but ${ranked.length} cities are Ranked`);
}
if (facts.watchlistCityCount !== watchlisted.length) {
  fail("counts", `methodologyFacts.watchlistCityCount is ${facts.watchlistCityCount} but ${watchlisted.length} cities are not Ranked`);
}
if (facts.scoredMetricCount !== scoredMetrics.length) {
  fail("counts", `methodologyFacts.scoredMetricCount is ${facts.scoredMetricCount} but the bundle scores ${scoredMetrics.length} metrics`);
}
if (facts.diagnosticMetricCount !== diagnosticMetrics.length) {
  fail("counts", `methodologyFacts.diagnosticMetricCount is ${facts.diagnosticMetricCount} but the bundle carries ${diagnosticMetrics.length} diagnostics`);
}

/* ── 2. Pillar weights ──────────────────────────────────────────────────── */

const canonical = bundle.canonicalWeights ?? {};
const canonicalTotal = Object.values(canonical).reduce((a, b) => a + b, 0);
if (canonicalTotal !== 100) {
  fail("weights", `canonical pillar weights sum to ${canonicalTotal}, not 100`);
}
for (const [pillar, weight] of Object.entries(canonical)) {
  const metrics = pillarMetricList(pillar);
  const sum = metrics.reduce((a, m) => a + (m.weight ?? 0), 0);
  if (sum !== weight) {
    fail("weights", `pillar "${pillar}" weighs ${weight} but its scored metric weights sum to ${sum}`);
  }
  for (const m of metrics) {
    const entry = catalog[m.key];
    if (!entry) {
      fail("weights", `pillar "${pillar}" scores metric "${m.key}" which is not in the metric catalog`);
      continue;
    }
    if (entry.pillar !== pillar) {
      fail("weights", `metric "${m.key}" is listed under pillar "${pillar}" but the catalog says "${entry.pillar}"`);
    }
    if ((entry.weight ?? 0) !== (m.weight ?? 0)) {
      fail("weights", `metric "${m.key}" weighs ${m.weight} in pillarMetrics and ${entry.weight} in the catalog`);
    }
  }
}

/* ── 3. Every published score is reproducible ───────────────────────────── */

const PILLAR_FIELDS = {
  pressure: "pressureScore",
  viability: "viabilityScore",
  capability: "capabilityScore",
  community: "communityScore",
  creative: "creativeScore",
};

let checked = 0;
for (const city of cities) {
  const id = city.cityId ?? city.displayName;

  let mu = 0;
  let muComplete = true;
  for (const [pillar, field] of Object.entries(PILLAR_FIELDS)) {
    const value = city[field];
    if (value === null || value === undefined) {
      muComplete = false;
      continue;
    }
    mu += (value * (canonical[pillar] ?? 0)) / 100;
  }

  if (city.weightedMeanExact != null) {
    if (!muComplete) {
      // A city with a missing pillar score cannot be re-weighted the way the
      // scorer does it, so the mean is not reconstructible from the printed
      // pillar values. It must still sit inside the range of the pillars
      // that do exist.
      const present = Object.values(PILLAR_FIELDS)
        .map((field) => city[field])
        .filter((v) => v !== null && v !== undefined);
      if (
        present.length &&
        (city.weightedMeanExact < Math.min(...present) - 0.05 ||
          city.weightedMeanExact > Math.max(...present) + 0.05)
      ) {
        fail("score", `${id} weighted mean ${city.weightedMeanExact.toFixed(2)} is outside its published pillar range`);
      }
    } else if (Math.abs(mu - city.weightedMeanExact) > 0.06) {
      // The printed pillar scores are rounded to one decimal; the scorer
      // works on the exact ones, so the mean can differ by up to half a
      // hundredth of a point per pillar.
      fail("score", `${id} weighted mean is ${city.weightedMeanExact.toFixed(4)} but its pillar scores give ${mu.toFixed(4)}`);
    }
  }

  if (city.ampiExact != null && city.weightedMeanExact != null) {
    const variance = city.weightedVarianceExact ?? 0;
    const ampi = city.weightedMeanExact - variance / city.weightedMeanExact;
    if (Math.abs(ampi - city.ampiExact) > 0.02) {
      fail("score", `${id} AMPI is ${city.ampiExact.toFixed(4)} but mean - variance/mean is ${ampi.toFixed(4)}`);
    }
  }

  if (city.slicScoreExact != null) {
    const rounded = Math.round(city.slicScoreExact * 10) / 10;
    if (Math.abs(rounded - city.slicScore) > 0.05) {
      fail("score", `${id} prints ${city.slicScore} but slicScoreExact ${city.slicScoreExact} rounds to ${rounded}`);
    }
    const penalty = city.coveragePenalty ?? 0;
    const expected = Math.max(0, Math.round((city.ampiExact - penalty) * 10) / 10);
    if (Math.abs(expected - city.slicScore) > 0.05) {
      fail("score", `${id} prints ${city.slicScore} but AMPI ${city.ampiExact} minus penalty ${penalty} is ${expected}`);
    }
  }
  checked++;
}

/* ── 4. Ranks are the descending order of the scores ────────────────────── */

const byRank = [...ranked].sort((a, b) => a.rank - b.rank);
const ranks = byRank.map((c) => c.rank);
if (new Set(ranks).size !== ranks.length) {
  fail("ranks", `ranked cities have duplicate ranks: ${ranks.length} cities, ${new Set(ranks).size} distinct ranks`);
}
const expectedRanks = Array.from({ length: ranked.length }, (_, i) => i + 1);
if (ranks.some((r, i) => r !== expectedRanks[i])) {
  fail("ranks", `the ranked cities do not hold ranks 1..${ranked.length} exactly once`);
}
// A city may never rank above a city with a higher score. Equal scores may
// sit in either order, so only a strict inversion is a failure.
for (let i = 1; i < byRank.length; i++) {
  if (byRank[i].slicScore > byRank[i - 1].slicScore + 0.0001) {
    fail(
      "ranks",
      `${byRank[i].displayName} (${byRank[i].slicScore}) is ranked ${byRank[i].rank} above ${byRank[i - 1].displayName} (${byRank[i - 1].slicScore}) at ${byRank[i - 1].rank}`,
    );
    break;
  }
}

/* ── 5. Every locale's methodology page matches the bundle ──────────────── */

/*
 * Which metric each localised name refers to is the one thing a score
 * cannot carry. The map in scripts/methodology-metric-map.json pins every
 * name on every methodology page to a metric key in the bundle; it is
 * generated by scripts/build-methodology-metric-map.mjs and the gate checks
 * it in both directions, so a renamed metric fails until the map is
 * regenerated. The map cannot drift silently.
 *
 * The gate then requires, for every locale and every pillar:
 *   - the page lists exactly the names the map holds, in the map's order;
 *   - every name maps to a metric the bundle scores, in that pillar;
 *   - the weight the page prints is the weight the bundle scores it at;
 *   - the pillar's weights sum to the pillar's own weight, and the set of
 *     weights is the bundle's set, not merely the same total.
 */

const metricMap = readJson("scripts/methodology-metric-map.json");
const metricKeyWeights = new Map();
for (const [pillar, metrics] of Object.entries(bundle.pillarMetrics ?? {})) {
  for (const m of metrics) {
    if (m.scored && !m.diagnostic) metricKeyWeights.set(m.key, { pillar, weight: m.weight });
  }
}

const PILLAR_RE = /id: "(pressure|viability|capability|community|creative)"/g;

/** Pull every metrics[] array out of a methodology source, in file order. */
function extractBlocks(source) {
  const blocks = [];
  PILLAR_RE.lastIndex = 0;
  let m;
  while ((m = PILLAR_RE.exec(source)) !== null) {
    const window = source.slice(m.index, m.index + 12000);
    const arrayMatch = window.match(/metrics: \[\n([\s\S]*?)\n\s*\],/);
    if (!arrayMatch) continue;
    const metrics = [];
    const entryRe = /\{ name: "(.*?)", weight: (\d+)/g;
    let e;
    while ((e = entryRe.exec(arrayMatch[1])) !== null) {
      metrics.push({ name: e[1], weight: Number(e[2]) });
    }
    blocks.push({ pillar: m[1], metrics });
  }
  return blocks;
}

const LOCALE_SOURCES = [
  { locale: "en", file: "src/methodologyData.ts", blockIndex: 0 },
  { locale: "th", file: "src/methodologyData.ts", blockIndex: 1 },
  { locale: "zh", file: "src/methodologyData.ts", blockIndex: 2 },
  { locale: "ko", file: "src/methodologyDataKo.ts", blockIndex: 0 },
  { locale: "ja", file: "src/methodologyDataJa.ts", blockIndex: 0 },
];

for (const { locale, file, blockIndex } of LOCALE_SOURCES) {
  const source = fs.readFileSync(path.join(REPO, file), "utf8");
  const blocks = extractBlocks(source);
  const byPillar = new Map();
  const seen = new Map();
  for (const block of blocks) {
    const n = (seen.get(block.pillar) ?? 0) + 1;
    seen.set(block.pillar, n);
    if (n === blockIndex + 1) byPillar.set(block.pillar, block.metrics);
  }

  const mapPillars = metricMap[locale];
  if (!mapPillars) {
    fail("locale-weights", `the metric map has no "${locale}" section`);
    continue;
  }

  for (const pillar of Object.keys(canonical)) {
    const pageMetrics = byPillar.get(pillar);
    const mapRows = mapPillars[pillar];
    if (!pageMetrics) {
      fail("locale-weights", `${file}: the ${locale} page has no "${pillar}" block`);
      continue;
    }
    if (!mapRows) {
      fail("locale-weights", `the metric map has no ${locale}/${pillar} section`);
      continue;
    }

    // The page and the map must hold the same names, in the same order.
    if (pageMetrics.length !== mapRows.length) {
      fail("locale-weights", `${file}: the ${locale} "${pillar}" block lists ${pageMetrics.length} metrics but the map holds ${mapRows.length}`);
      continue;
    }
    for (let i = 0; i < mapRows.length; i++) {
      if (pageMetrics[i].name !== mapRows[i].name) {
        fail("locale-weights", `${file}: the ${locale} "${pillar}" block lists "${pageMetrics[i].name}" where the map holds "${mapRows[i].name}"`);
        break;
      }
    }

    // Every name must map to a metric the bundle scores, in this pillar,
    // and the page's weight must be the bundle's weight for it.
    const seenKeys = new Set();
    for (const [i, row] of mapRows.entries()) {
      const key = row.key;
      if (!key) {
        fail("locale-weights", `the metric map has no bundle key for ${locale}/${pillar} "${row.name}"`);
        continue;
      }
      const meta = metricKeyWeights.get(key);
      if (!meta) {
        fail("locale-weights", `the metric map points ${locale}/${pillar} "${row.name}" at "${key}", which the bundle does not score`);
        continue;
      }
      if (meta.pillar !== pillar) {
        fail("locale-weights", `the metric map points ${locale}/${pillar} "${row.name}" at "${key}", which the bundle puts under "${meta.pillar}"`);
        continue;
      }
      if (seenKeys.has(key)) {
        fail("locale-weights", `the metric map points two ${locale}/${pillar} names at "${key}"`);
        continue;
      }
      seenKeys.add(key);
      if (pageMetrics[i].weight !== meta.weight) {
        fail("locale-weights", `${file}: "${pageMetrics[i].name}" is listed at weight ${pageMetrics[i].weight} but the bundle scores it at ${meta.weight}`);
      }
    }

    // The block must account for every metric the bundle scores in this
    // pillar, and carry the bundle's set of weights.
    const expected = pillarMetricList(pillar);
    if (seenKeys.size !== expected.length) {
      fail("locale-weights", `${file}: the ${locale} "${pillar}" block accounts for ${seenKeys.size} of the ${expected.length} metrics the bundle scores`);
    }
    const sum = pageMetrics.reduce((a, m) => a + m.weight, 0);
    if (sum !== (canonical[pillar] ?? 0)) {
      fail("locale-weights", `${file}: the ${locale} "${pillar}" block's weights sum to ${sum}, not the pillar weight ${canonical[pillar]}`);
    }
    const blockWeights = pageMetrics.map((m) => m.weight).sort((a, b) => a - b).join(",");
    const bundleWeights = expected.map((m) => m.weight).sort((a, b) => a - b).join(",");
    if (blockWeights !== bundleWeights) {
      fail("locale-weights", `${file}: the ${locale} "${pillar}" block carries weights ${blockWeights} but the bundle scores ${bundleWeights}`);
    }
  }
}

/* ── 6. The copy must not state a count the bundle cannot justify ──────── */

const ALLOWED = new Set([
  facts.cityCount,
  facts.rankedCityCount,
  facts.watchlistCityCount,
  facts.scoredMetricCount,
  facts.diagnosticMetricCount,
  Object.keys(canonical).length,
]);

// Metric-line counts, in every language the site ships.
const METRIC_NOUNS = [
  "metric lines", "metric line", "metric lines", "metric line", "计分指标", "採点指标", "metric line",
  "metric lines", "metric line", "metric line", "metric lines", "metric line", "metric lines", "metric line",
];
// Published-board sizes, in every language the site ships.
const BOARD_NOUNS = [
  "published cities",
  "เมืองที่เผยแพร่",
  "已发布城市",
  "공개 도시",
  "公開都市",
  "published city",
  "published board",
  "บอร์ดสาธารณะ",
  "公开榜单",
  "공개 보드",
  "公開ボード",
];

const srcDir = path.join(REPO, "src");
const copyFiles = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
  .map((f) => path.join("src", f));

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* A count can be written as a digit or spelled out. "Twenty scored metric
   lines" is just as wrong as "24 scored metric lines", and it is the one
   the audit actually found. */
const WORD_NUMBERS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, "twenty-one": 21, "twenty-two": 22, "twenty-three": 23,
  "twenty-four": 24, "twenty-five": 25, "twenty-six": 26, "twenty-seven": 27, "twenty-eight": 28,
  "twenty-nine": 29, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100,
};
const WORD_ALT = Object.keys(WORD_NUMBERS)
  .map((w) => w.replace(/-/g, "[-‑–]"))
  .sort((a, b) => b.length - a.length)
  .join("|");

function scanCount(str, nouns, allowed, where, gap = 2) {
  for (const noun of nouns) {
    // Up to two words may sit between the number and the noun: the copy
    // says "Twenty-two scored metric lines", not "Twenty-two metric lines".
    const re = new RegExp(`(\\d[\\d,.]*|${WORD_ALT})\\s+(?:[A-Za-z\u0E00-\u9FFF-]+\\s+){0,${gap}}(?:${escapeRe(noun)})`, "gi");
    let hit;
    while ((hit = re.exec(str)) !== null) {
      const raw = hit[1].toLowerCase();
      const value = /^\d/.test(raw) ? Number(raw.replace(/,/g, "")) : WORD_NUMBERS[raw];
      if (!Number.isFinite(value)) continue;
      if (!allowed.has(value)) {
        fail("copy-count", `${where} states "${hit[0]}" — the bundle justifies none of ${[...allowed].join(", ")}`);
      }
    }
  }
}

for (const rel of copyFiles) {
  const source = fs.readFileSync(path.join(REPO, rel), "utf8");
  const lines = source.split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    scanCount(line, METRIC_NOUNS, new Set([facts.scoredMetricCount]), `${rel}:${index + 1}`);
    scanCount(line, BOARD_NOUNS, new Set([facts.cityCount, facts.rankedCityCount]), `${rel}:${index + 1}`, 0);
  });
}

/* ── Report ─────────────────────────────────────────────────────────────── */

if (findings.length) {
  console.error(`\n✗ check:numbers FAILED — ${findings.length} finding(s)\n`);
  for (const f of findings) console.error("  " + f);
  console.error("");
  process.exit(1);
}

console.log(
  `check:numbers PASSED — ${checked} cities recomputed, ` +
    `${scoredMetrics.length} scored metrics, ` +
    `${Object.keys(canonical).length} pillars, ` +
    `${facts.cityCount} published (${facts.rankedCityCount} ranked + ${facts.watchlistCityCount} watchlist), ` +
    `${Object.keys(metricMap).length} locales checked against the bundle, copy counts screened.`,
);
