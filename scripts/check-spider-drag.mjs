#!/usr/bin/env node
/**
 * Spider drag gate.
 *
 * The spider chart is the one widget on the site that asks for a gesture, so
 * the gesture has to work. It used to read as broken, and the reason was
 * invisible in the source:
 *
 *   the value was computed from the pointer's distance from the centre of
 *   the web, so the handle slid along its own axis and never came to the
 *   finger. Pull a handle 40px to the side and the handle stayed 43px away
 *   from the pointer. Pull it straight out and it worked — which is why the
 *   chart looked fine in a screenshot and felt dead in the hand.
 *
 * The rule the gate holds: while a handle is being pulled, it is under the
 * pointer. Not near it, not on its axis, not in a projection of it — under
 * it. And when the pull ends, the handle returns to its own pillar's axis,
 * because a radar chart with the vertices at random angles is not a radar
 * chart; only the angle comes back, and the radius — the number — stays.
 *
 * Three things are measured, on the real built page, with a real pointer:
 *
 *   1. the pull — the distance between the handle and the pointer during a
 *      drag, in CSS pixels, on a pull that goes sideways, which is the pull
 *      that used to fail;
 *   2. the return — the angle between the handle and its pillar's axis after
 *      the drag ends;
 *   3. the arithmetic — the five weights still add up to 100 after the pull,
 *      because the chart claims to be zero-sum and the sliders are printed
 *      numbers.
 *
 * Usage:
 *   node scripts/check-spider-drag.mjs
 *   node scripts/check-spider-drag.mjs --url <base>    # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

/** How far the handle may sit from the pointer while it is being pulled. */
const TOLERANCE_PX = 3;

/** How far off its own pillar's axis the handle may come to rest. */
const AXIS_TOLERANCE_DEG = 1;

/** How far the pull travels, sideways. */
const PULL_PX = 40;

/** The weights must still add up to this. */
const TOTAL = 100;

const ROUTES = ["/", "/rankings"];

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[urlArg + 1] : null;

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

/**
 * Runs in the page. Reports where the handles are, in screen pixels, and
 * what the sliders read.
 */
const GEOMETRY = () => {
  const svg = document.querySelector(".allocator-svg");
  if (!svg) return null;

  const ctm = svg.getScreenCTM();
  if (!ctm) return null;

  const viewBox = svg.getAttribute("viewBox").split(/\s+/).map(Number);
  const toScreen = (x, y) => ({
    x: ctm.a * x + ctm.c * y + ctm.e,
    y: ctm.b * x + ctm.d * y + ctm.f,
  });

  const centre = toScreen(viewBox[0] + viewBox[2] / 2, viewBox[1] + viewBox[3] / 2);

  const vertices = [...svg.querySelectorAll('circle[data-node="vertex"]')].map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      index: Number(el.getAttribute("data-index")),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  });

  const values = [...document.querySelectorAll(".spider-slider-value")]
    .map((el) => Number(el.textContent.trim()))
    .filter((value) => Number.isFinite(value));

  return { centre, vertices, values };
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const angleBetween = (from, a, b) => {
  const ax = a.x - from.x;
  const ay = a.y - from.y;
  const bx = b.x - from.x;
  const by = b.y - from.y;
  const dot = ax * bx + ay * by;
  const norm = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (norm === 0) return 0;
  return (Math.acos(Math.max(-1, Math.min(1, dot / norm))) * 180) / Math.PI;
};

async function pull(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 12 });
  await page.waitForTimeout(80);
}

const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

/** Scrolls the chart into the middle of the screen and waits for the page to
 *  stop moving — the site scrolls smoothly and lazy content settles under
 *  the scroll, so a chart measured mid-flight is a chart measured wrong. */
async function bringIntoView(page) {
  await page.evaluate(() => {
    document.querySelector(".allocator-svg")?.scrollIntoView({ block: "center", behavior: "instant" });
  });

  let previous = null;
  let stable = 0;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const y = await page.evaluate(() => window.scrollY);
    if (previous !== null && y === previous) {
      stable += 1;
      if (stable >= 3) break;
    } else {
      stable = 0;
    }
    previous = y;
    await page.waitForTimeout(80);
  }

  await page.waitForTimeout(120);
}

async function checkRoute(page, route) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".allocator-svg", { timeout: 15000 });

  /* The chart has to be under the pointer, not below the fold. */
  await bringIntoView(page);

  const before = await page.evaluate(GEOMETRY);
  if (!before || before.vertices.length < 3) {
    fail(`${route}: the spider has no handles to pull`);
    return;
  }

  /* Every handle has to be inside the window, or the pointer cannot reach it. */
  for (const vertex of before.vertices) {
    if (vertex.y < 0 || vertex.y > 1000 || vertex.x < 0 || vertex.x > 1440) {
      fail(`${route}: handle ${vertex.index} is outside the window at (${vertex.x}, ${vertex.y})`);
    }
  }

  /* Handle 0 sits on the vertical axis; handle 2 does not, so pulling it
     sideways is a different test of the same rule. */
  for (const index of [0, 2]) {
    const start = before.vertices[index];
    if (!start) {
      fail(`${route}: handle ${index} is missing`);
      continue;
    }

    const ux = start.x - before.centre.x;
    const uy = start.y - before.centre.y;
    const length = Math.hypot(ux, uy);
    if (length === 0) {
      fail(`${route}: handle ${index} sits on the centre of the web`);
      continue;
    }

    /* The axis, and the direction across it. */
    const axis = { x: ux / length, y: uy / length };
    const across = { x: -axis.y, y: axis.x };

    const target = { x: start.x + across.x * PULL_PX, y: start.y + across.y * PULL_PX };

    const scrollBefore = await page.evaluate(() => Math.round(window.scrollY));
    await pull(page, start, target);
    const scrollAfter = await page.evaluate(() => Math.round(window.scrollY));

    if (Math.abs(scrollAfter - scrollBefore) > 1) {
      fail(
        `${route}: the page scrolled ${scrollAfter - scrollBefore}px during the pull — the chart moved under the pointer`,
      );
    }

    const during = await page.evaluate(GEOMETRY);
    const handle = during?.vertices[index];

    if (!handle) {
      fail(`${route}: handle ${index} vanished during the pull`);
      await page.mouse.up();
      continue;
    }

    const miss = distance(handle, target);
    notes.push(
      `${route} handle ${index}: ${miss.toFixed(1)}px from the pointer during a ${PULL_PX}px sideways pull`,
    );

    if (miss > TOLERANCE_PX) {
      fail(
        `${route}: handle ${index} sat ${miss.toFixed(1)}px from the pointer during a sideways pull (limit ${TOLERANCE_PX}px)`,
      );
    }

    /* The number still has to be honest. */
    const sum = during.values.reduce((total, value) => total + value, 0);
    if (sum !== TOTAL) {
      fail(`${route}: the weights add up to ${sum} after the pull, not ${TOTAL}`);
    }

    await page.mouse.up();
    await page.waitForTimeout(500);

    const after = await page.evaluate(GEOMETRY);
    const rested = after?.vertices[index];
    if (!rested) {
      fail(`${route}: handle ${index} vanished after the pull`);
      continue;
    }

    const axisPoint = {
      x: before.centre.x + axis.x * length,
      y: before.centre.y + axis.y * length,
    };
    const offAxis = angleBetween(after.centre, rested, axisPoint);
    notes.push(`${route} handle ${index}: ${offAxis.toFixed(2)}° off its axis after the pull`);

    if (offAxis > AXIS_TOLERANCE_DEG) {
      fail(
        `${route}: handle ${index} came to rest ${offAxis.toFixed(2)}° off its pillar's axis (limit ${AXIS_TOLERANCE_DEG}°)`,
      );
    }

    /* The radius is the number: letting go must not cost the pull anything. */
    const restRadius = Math.hypot(rested.x - after.centre.x, rested.y - after.centre.y);
    const heldRadius = Math.hypot(handle.x - during.centre.x, handle.y - during.centre.y);
    if (Math.abs(restRadius - heldRadius) > 1) {
      fail(
        `${route}: handle ${index} changed radius on release (${heldRadius.toFixed(1)}px → ${restRadius.toFixed(1)}px)`,
      );
    }
  }
}

let server = null;
let BASE = "";

try {
  if (LIVE) {
    BASE = LIVE.replace(/\/$/, "");
  } else {
    const dir = path.resolve("dist");
    if (!fs.existsSync(path.join(dir, "index.html"))) {
      throw new Error("dist/index.html is missing — build the site first");
    }
    server = await serve(dir);
    BASE = `http://127.0.0.1:${server.address().port}`;
  }

  const browser = await chromium.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    const found = await page
      .waitForSelector(".allocator-svg", { timeout: 15000 })
      .then(() => true)
      .catch(() => false);
    if (!found) {
      fail(`${route}: no spider on this page — the gate cannot check a chart that is not there`);
      continue;
    }
    await checkRoute(page, route);
  }

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
  console.error("check:spider-drag FAILED");
  process.exit(1);
}

console.log(`check:spider-drag PASSED — the handle stays under the pointer (≤${TOLERANCE_PX}px) and returns to its axis (≤${AXIS_TOLERANCE_DEG}°), weights still total ${TOTAL}.`);
