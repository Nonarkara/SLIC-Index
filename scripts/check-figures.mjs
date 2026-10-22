#!/usr/bin/env node
/**
 * Figure gate: the hero console and the city plates.
 *
 * Two pieces of this site were rebuilt because they repeated themselves. The
 * home page opened with three stacked buttons in boxes and then, separately,
 * a row of statistics; the city page showed twenty-two metrics as a grid of
 * boxes and then again, lower down, as the same twenty-two metrics. Both
 * were the same spatial failure — the same information twice, in two
 * arrangements, and a page twice as long as the information needed.
 *
 * The replacements are one row of symbols and numbers, and twenty-two
 * annotated plates. This gate holds them to that, and it checks the numbers
 * inside the drawings rather than the pictures:
 *
 *   1. the console is one row — every cell on one line at desktop, and no
 *      cell painting a box of its own;
 *   2. the marks are drawings — line art, not glyphs standing in for pictures;
 *   3. the plates are the scored metrics — all of them, each exactly once;
 *   4. the band is the method, drawn — the marker on the band is the score,
 *      recomputed from the published anchors, to the published value;
 *   5. the trace adds up — the five weighted terms sum to the printed mean,
 *      and the deductions take the mean to the published score.
 *
 * Point 4 is the one that matters: a diagram of a formula that does not
 * compute the formula is worse than no diagram.
 *
 * Usage:
 *   node scripts/check-figures.mjs
 *   node scripts/check-figures.mjs --url <base>    # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

/** The city whose plates are read. Bangkok: published, and every metric scored. */
const CITY = "th-bangkok";

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dir, url);
      if (!file.startsWith(dir)) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) file = path.join(dir, "index.html");
      const ext = path.extname(file);
      const type =
        ext === ".css"
          ? "text/css"
          : ext === ".js"
            ? "text/javascript"
            : ext === ".html"
              ? "text/html"
              : "application/octet-stream";
      res.writeHead(200, { "content-type": type });
      res.end(fs.readFileSync(file));
    });
    server.listen(0, () => resolve(server));
  });
}

/** The published data — the only source of truth for the numbers. */
function loadPublished() {
  const file = path.resolve("src/data/publishedRankingData.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const scored = Object.entries(data.metricCatalog)
    .filter(([, entry]) => entry.scored)
    .map(([key, entry]) => ({ key, ...entry }));
  const city = data.cities.find((c) => c.cityId === CITY);
  return { data, scored, city };
}

/** How the plate prints a band anchor. Mirrors MetricPlate.tsx exactly. */
function formatBandNumber(value) {
  if (value >= 1000) return Math.round(value).toLocaleString("en-US");
  if (value >= 100) return String(Math.round(value));
  return String(Math.round(value * 100) / 100);
}

const CONSOLE_PROBE = () => {
  const console_ = document.querySelector(".hp-opening-console");
  if (!console_) return { error: "no console" };

  const cs = getComputedStyle(console_);
  const cells = [...console_.children].map((el) => {
    const r = el.getBoundingClientRect();
    const cellStyle = getComputedStyle(el);
    const mark = el.querySelector(".hp-console-mark");
    const svg = mark?.querySelector("svg");
    return {
      kind: el.classList.contains("hp-console-cell--action")
        ? "action"
        : el.classList.contains("hp-console-cell--fact")
          ? "fact"
          : "other",
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      height: Math.round(r.height),
      gridRow: cellStyle.gridRowStart,
      background: cellStyle.backgroundColor,
      border: [cellStyle.borderTopWidth, cellStyle.borderRightWidth, cellStyle.borderBottomWidth, cellStyle.borderLeftWidth].join(" "),
      figure: el.querySelector(".hp-console-figure")?.textContent?.trim() ?? null,
      caption: el.querySelector(".hp-console-caption")?.textContent?.trim() ?? null,
      label: el.querySelector(".hp-console-label")?.textContent?.trim() ?? null,
      markPrimitives: svg ? svg.querySelectorAll("path, line, circle, rect, polyline, polygon").length : 0,
    };
  });

  const legacy = [".hp-opening-actions", ".hp-opening-stats", ".hp-cta-primary", ".hp-cta-secondary"].filter(
    (sel) => document.querySelector(sel),
  );

  return {
    display: cs.display,
    columns: cs.gridTemplateColumns,
    cells,
    legacy,
    consoleHeight: Math.round(console_.getBoundingClientRect().height),
  };
};

const CITY_PROBE = () => {
  const plates = [...document.querySelectorAll(".metric-plate")];
  const parsed = plates.map((el) => {
    const band = el.querySelector(".metric-band");
    const rule = el.querySelector(".metric-band-rule");
    const marker = el.querySelector(".metric-band-marker");
    const markerRect = marker?.getBoundingClientRect();
    const ruleRect = rule?.getBoundingClientRect();
    const measuredFraction =
      markerRect && ruleRect && ruleRect.width > 0
        ? (markerRect.left + markerRect.width / 2 - ruleRect.left) / ruleRect.width
        : null;

    return {
      metric: el.getAttribute("data-metric"),
      name: el.querySelector(".metric-plate-name")?.textContent?.trim() ?? null,
      level: el.querySelector(".metric-plate-level")?.textContent?.trim() ?? null,
      score: el.querySelector(".metric-plate-score")?.textContent?.trim() ?? null,
      value: el.querySelector(".metric-plate-value")?.textContent?.trim() ?? null,
      weight: el.querySelector(".metric-plate-weight")?.textContent?.trim() ?? null,
      markPrimitives: el.querySelector(".metric-plate-mark svg")?.querySelectorAll("path, line, circle, rect, polyline, polygon").length ?? 0,
      mark: el.querySelector(".metric-plate-mark svg")?.innerHTML ?? "",
      hasBand: Boolean(band),
      p05: el.querySelector(".metric-band-anchor--start")?.textContent?.trim() ?? null,
      p95: el.querySelector(".metric-band-anchor--end")?.textContent?.trim() ?? null,
      betterStart: band?.classList.contains("metric-band--better-start") ?? false,
      declaredFraction: marker ? Number.parseFloat(marker.style.left) / 100 : null,
      measuredFraction,
    };
  });

  const terms = [...document.querySelectorAll(".scorecard-equation-term")].map((el) => ({
    weight: Number.parseFloat(el.querySelector(".scorecard-equation-weight")?.textContent ?? "NaN"),
    pillar: el.querySelector(".scorecard-equation-pillar")?.textContent?.trim() ?? "",
    value: Number.parseFloat((el.querySelector(".scorecard-equation-pillar")?.textContent ?? "").match(/\(([\d.]+)\)/)?.[1] ?? "NaN"),
  }));

  const deductions = [...document.querySelectorAll(".scorecard-equation-deduction")].map((el) => ({
    label: el.querySelector(".scorecard-equation-deduction-label")?.textContent?.trim() ?? "",
    value: Number.parseFloat(el.textContent.replace(/[^0-9.\-]/g, "")),
  }));

  const mean = document.querySelector(".scorecard-equation-result--mean")?.textContent?.trim() ?? null;
  const published = document.querySelector(".scorecard-equation-result--published")?.textContent?.trim() ?? null;

  const legacy = [".scorecard-overview-grid", ".scorecard-metric-row", ".scorecard-overview-card", ".scorecard-norm-bar", ".scorecard-data-badge"].filter(
    (sel) => document.querySelector(sel),
  );

  return {
    plates: parsed,
    terms,
    deductions,
    mean,
    published,
    legacy,
    plateCount: parsed.length,
    nameCount: document.querySelectorAll(".metric-plate-name").length,
  };
};

const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

/* ── the home console ───────────────────────────────────────────────────── */

function checkConsole(result, { scoredCount, pillarCount }) {
  if (result.error) {
    fail(`/ : ${result.error}`);
    return;
  }

  if (result.display !== "grid") {
    fail(`/ : the opening console is display:${result.display}, not a grid — a grid is what puts it in one row`);
  }

  const actions = result.cells.filter((c) => c.kind === "action");
  const facts = result.cells.filter((c) => c.kind === "fact");

  if (actions.length !== 3) fail(`/ : the console has ${actions.length} action cells, expected 3`);
  if (facts.length < 2) fail(`/ : the console has ${facts.length} fact cells, expected at least 2`);

  /* One row: every cell sits in the first grid row, and their vertical
     bands overlap — the row is a row, not a staircase. */
  const rows = new Set(result.cells.map((c) => c.gridRow));
  if (rows.size > 1) {
    fail(`/ : the console is not one row — the cells sit in grid rows ${[...rows].sort().join(", ")}`);
  }
  const overlapTop = Math.max(...result.cells.map((c) => c.top));
  const overlapBottom = Math.min(...result.cells.map((c) => c.bottom));
  if (overlapTop >= overlapBottom) {
    fail(
      `/ : the console cells do not share a line — they run from ${Math.min(...result.cells.map((c) => c.top))}px to ${Math.max(...result.cells.map((c) => c.bottom))}px without a common band`,
    );
  }

  /* No boxes: a cell that paints its own ground or border is a box. */
  for (const cell of result.cells) {
    if (cell.background !== "rgba(0, 0, 0, 0)") {
      fail(`/ : a console cell paints its own background (${cell.background}) — the console is symbols and numbers, not boxes`);
    }
    if (cell.border !== "0px 0px 0px 0px") {
      fail(`/ : a console cell paints its own border (${cell.border}) — the console is symbols and numbers, not boxes`);
    }
  }

  /* The marks are drawings. */
  for (const cell of actions) {
    if (cell.markPrimitives < 2) {
      fail(`/ : an action cell's mark has ${cell.markPrimitives} drawn primitive(s) — a mark has to be drawn, not typed`);
    }
  }

  /* The figures are the published ones. */
  const figures = facts.map((f) => f.figure);
  if (!figures.includes(String(scoredCount))) {
    fail(`/ : the console's metric-line figure is ${figures.join(", ")} — the site scores ${scoredCount} metric lines`);
  }
  if (!figures.includes(String(pillarCount))) {
    fail(`/ : the console's pillar figure is ${figures.join(", ")} — the index has ${pillarCount} pillars`);
  }

  if (result.legacy.length) {
    fail(`/ : the old boxes are still on the page (${result.legacy.join(", ")})`);
  }

  notes.push(
    `/ : one row of ${result.cells.length} cells (${actions.length} actions + ${facts.length} facts), ${result.columns.split(" ").length} columns, ${result.consoleHeight}px tall`,
  );
}

/* ── the city plates ────────────────────────────────────────────────────── */

function checkCity(result, { scored, city }) {
  if (result.plateCount !== scored.length) {
    fail(`/city/${CITY}: ${result.plateCount} metric plates, expected ${scored.length} — each scored metric exactly once`);
  }

  const seen = new Set();
  for (const plate of result.plates) {
    const entry = scored.find((m) => m.key === plate.metric);
    if (!entry) {
      fail(`/city/${CITY}: a plate is labelled "${plate.metric}", which is not a scored metric`);
      continue;
    }
    if (seen.has(plate.metric)) {
      fail(`/city/${CITY}: "${plate.metric}" appears on more than one plate`);
    }
    seen.add(plate.metric);

    if (!plate.name) fail(`/city/${CITY}: the plate for "${plate.metric}" has no name`);
    if (!plate.level) fail(`/city/${CITY}: the plate for "${plate.metric}" has no provenance tag`);
    if (!plate.weight) fail(`/city/${CITY}: the plate for "${plate.metric}" does not print its weight`);
    if (plate.markPrimitives < 1) {
      fail(`/city/${CITY}: the plate for "${plate.metric}" draws nothing — a mark has to be drawn, not typed`);
    }

    const published = city?.metrics?.[plate.metric];
    if (!published) {
      fail(`/city/${CITY}: "${plate.metric}" is not in the published city data`);
      continue;
    }

    /* The printed score is the published score. */
    const printed = Number.parseFloat(plate.score);
    if (published.score === null || published.score === undefined) {
      if (plate.score !== "—") {
        fail(`/city/${CITY}: "${plate.metric}" prints the score ${plate.score}, but the city has no published score for it`);
      }
    } else if (!Number.isFinite(printed) || Math.abs(printed - published.score) > 0.05) {
      fail(
        `/city/${CITY}: "${plate.metric}" prints the score ${plate.score}, the published score is ${published.score}`,
      );
    }

    /* The band is the method, drawn. */
    if (plate.hasBand) {
      const anchors = plate.metric && city ? anchorsFor(plate.metric) : null;
      if (!anchors) {
        fail(`/city/${CITY}: "${plate.metric}" draws a band but has no published anchors`);
      } else {
        if (plate.p05 !== formatBandNumber(anchors.p05)) {
          fail(
            `/city/${CITY}: "${plate.metric}" prints the low anchor ${plate.p05}, the published P05 is ${formatBandNumber(anchors.p05)}`,
          );
        }
        if (plate.p95 !== formatBandNumber(anchors.p95)) {
          fail(
            `/city/${CITY}: "${plate.metric}" prints the high anchor ${plate.p95}, the published P95 is ${formatBandNumber(anchors.p95)}`,
          );
        }
        if (plate.betterStart !== (anchors.dir === "negative")) {
          fail(
            `/city/${CITY}: "${plate.metric}" points its arrow the wrong way — the published direction is "${anchors.dir}"`,
          );
        }

        /* The marker is where the formula puts it. */
        const raw = published.raw;
        const fraction = Math.min(1, Math.max(0, (raw - anchors.p05) / (anchors.p95 - anchors.p05)));
        if (plate.declaredFraction === null || Math.abs(plate.declaredFraction - fraction) > 0.005) {
          fail(
            `/city/${CITY}: "${plate.metric}" draws its marker at ${(plate.declaredFraction * 100).toFixed(2)}%, the formula puts it at ${(fraction * 100).toFixed(2)}%`,
          );
        }
        if (plate.measuredFraction !== null && Math.abs(plate.measuredFraction - fraction) > 0.01) {
          fail(
            `/city/${CITY}: "${plate.metric}" draws its marker at ${(plate.measuredFraction * 100).toFixed(2)}% on the page, the formula puts it at ${(fraction * 100).toFixed(2)}%`,
          );
        }

        /* And the marker is the score. */
        const scoreFraction = anchors.dir === "negative" ? 1 - published.score / 100 : published.score / 100;
        if (Math.abs(fraction - scoreFraction) > 0.006) {
          fail(
            `/city/${CITY}: "${plate.metric}" puts the marker at ${(fraction * 100).toFixed(2)}% but the score is ${published.score}`,
          );
        }
      }
    } else if (published.raw !== null && published.raw !== undefined) {
      const anchors = anchorsFor(plate.metric);
      if (anchors && anchors.p95 !== anchors.p05) {
        fail(`/city/${CITY}: "${plate.metric}" has a value and published anchors but draws no band`);
      }
    }
  }

  if (result.nameCount !== result.plateCount) {
    fail(`/city/${CITY}: ${result.nameCount} names for ${result.plateCount} plates`);
  }

  /* Each metric has its own drawing. Two plates carrying the same mark means
     one of them was given the fallback, which is decoration, not a drawing. */
  const markCounts = new Map();
  for (const plate of result.plates) {
    if (!plate.mark) continue;
    markCounts.set(plate.mark, (markCounts.get(plate.mark) ?? 0) + 1);
  }
  const repeated = [...markCounts.entries()].filter(([, count]) => count > 1);
  if (repeated.length) {
    fail(
      `/city/${CITY}: ${repeated.length} drawing(s) are shared by more than one plate — each metric needs its own mark`,
    );
  }

  if (result.legacy.length) {
    fail(`/city/${CITY}: the old duplicate presentation is still on the page (${result.legacy.join(", ")})`);
  }

  /* The trace adds up. */
  if (result.terms.length !== 5) {
    fail(`/city/${CITY}: the score trace has ${result.terms.length} terms, expected 5`);
  } else {
    const sum = result.terms.reduce((total, t) => total + t.weight * t.value, 0);
    const printedMean = Number.parseFloat(result.mean);
    if (!Number.isFinite(printedMean) || Math.abs(sum - printedMean) > 0.06) {
      fail(
        `/city/${CITY}: the trace's terms add up to ${sum.toFixed(3)}, the page prints ${result.mean}`,
      );
    }
    const deducted = result.deductions.reduce((total, d) => total + d.value, 0);
    const printedPublished = Number.parseFloat(result.published);
    if (Number.isFinite(printedMean) && Number.isFinite(printedPublished)) {
      if (Math.abs(printedMean - deducted - printedPublished) > 0.06) {
        fail(
          `/city/${CITY}: the trace reads ${result.mean} − ${deducted.toFixed(1)} = ${result.published}, which is not what it says`,
        );
      }
    }
    if (city && Number.isFinite(printedPublished) && Math.abs(printedPublished - city.slicScore) > 0.05) {
      fail(
        `/city/${CITY}: the trace ends at ${result.published}, the published score is ${city.slicScore}`,
      );
    }
    notes.push(
      `/city/${CITY}: ${result.plateCount} plates, the trace adds up (${result.terms.map((t) => `${t.weight}×${t.value}`).join(" + ")} = ${result.mean})`,
    );
  }
}

let anchorsCache = null;
function anchorsFor(metricKey) {
  if (!anchorsCache) {
    const { data } = loadPublished();
    anchorsCache = { data };
  }
  const { data } = anchorsCache;
  const catalog = data.metricCatalog[metricKey];
  if (!catalog?.inputKey) return null;
  const stats = data.normStats[catalog.inputKey];
  if (!stats) return null;
  return stats;
}

let server = null;
let base = "";

try {
  const { scored, city } = loadPublished();
  const pillarCount = Object.keys(loadPublished().data.pillarMetrics).length;

  if (LIVE) {
    base = LIVE.replace(/\/$/, "");
  } else {
    const dir = path.resolve("dist");
    if (!fs.existsSync(path.join(dir, "index.html"))) {
      throw new Error("dist/index.html is missing — build the site first");
    }
    server = await serve(dir);
    base = `http://127.0.0.1:${server.address().port}`;
  }

  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForSelector(".hp-opening-console", { timeout: 15000 });
  checkConsole(await page.evaluate(CONSOLE_PROBE), { scoredCount: scored.length, pillarCount });

  await page.goto(`${base}/city/${CITY}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".metric-plate", { timeout: 15000 });
  checkCity(await page.evaluate(CITY_PROBE), { scored, city });

  await browser.close();
} catch (error) {
  failures.push(`the gate could not run: ${error.message}`);
} finally {
  if (server) server.close();
}

for (const note of notes) console.log(`  ${note}`);

if (failures.length > 0) {
  console.error("");
  for (const failure of failures) console.error(`  FAIL ${failure}`);
  console.error("");
  console.error("check:figures FAILED");
  process.exit(1);
}

console.log("check:figures PASSED — one row of symbols and numbers, every scored metric as a plate once, the band is the score, the trace adds up.");
