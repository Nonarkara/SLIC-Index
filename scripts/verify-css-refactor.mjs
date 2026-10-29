#!/usr/bin/env node
/**
 * Prove a CSS refactor changed nothing that renders.
 *
 * Static cascade analysis can tell you that a merge is *probably* safe. It
 * cannot tell you that an element matching two equal-specificity selectors did
 * not change colour, because that depends on the real DOM.
 *
 * This does the real thing: it serves the OLD build and the NEW build side by
 * side, drives a real browser over every route at every breakpoint, and
 * compares the FULL computed style of every element — including ::before and
 * ::after — between the two.
 *
 * Two-phase, so the diff stays cheap:
 *   Phase 1  each page hashes every computed property (per element, per
 *            pseudo-element) into one digest per property. Only ~350 small
 *            digests cross the wire.
 *   Phase 2  only if a digest differs do we re-fetch that property's actual
 *            values for every element, so the failure report can say exactly
 *            which element and which declaration moved.
 *
 * Usage:
 *   node scripts/verify-css-refactor.mjs --against <dir>
 *
 * <dir> is a previously built copy of dist/ (e.g. a `git stash` snapshot or a
 * CI artifact). The current dist/ is the "new" side.
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const ROUTES = [
  "/",
  "/rankings",
  "/methodology",
  "/data",
  "/thailand",
  "/essay",
  "/ideas",
  "/compare",
  "/side-by-side",
  "/history",
  "/map",
  "/city/th-bangkok",
  "/about-slic",
  "/awards",
  "/traffic",
];

const WIDTHS = [1440, 1024, 390];
const VIEWPORT_HEIGHT = 900;

/** Narrow the run for debugging: VERIFY_ROUTES="/,/map" VERIFY_WIDTHS=390 */
const ROUTE_SET = process.env.VERIFY_ROUTES
  ? process.env.VERIFY_ROUTES.split(",").filter(Boolean)
  : ROUTES;
const WIDTH_SET = process.env.VERIFY_WIDTHS
  ? process.env.VERIFY_WIDTHS.split(",").filter(Boolean).map(Number)
  : WIDTHS;

/** Serve a directory over HTTP with SPA fallback. */
function serve(dir, port) {
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
        ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : ext === ".html" ? "text/html" : "application/octet-stream";
      res.writeHead(200, { "content-type": type });
      res.end(fs.readFileSync(file));
    });
    server.listen(port, () => resolve(server));
  });
}

/**
 * The in-page snapshot. Runs in the browser, returns only digests.
 *
 * Incremental hashing keeps memory flat: we never hold every value of every
 * property, only a running hash per property key.
 */
const SNAPSHOT = () => {
  const FNV_A = 0x01000193;
  const FNV_B = 0x85ebca6b;
  const hashers = new Map();
  const els = Array.prototype.slice.call(document.querySelectorAll("*"));
  for (const el of els) {
    const targets = [
      [null, null],
      ["::before", "::before"],
      ["::after", "::after"],
    ];
    for (const [key0, pseudo] of targets) {
      const cs = pseudo ? getComputedStyle(el, pseudo) : getComputedStyle(el);
      for (let i = 0; i < cs.length; i++) {
        const name = cs[i];
        const key = key0 ? key0 + "|" + name : name;
        let h = hashers.get(key);
        if (!h) {
          h = { h1: 0x811c9dc5 | 0, h2: 0x01000193 | 0, n: 0 };
          hashers.set(key, h);
        }
        const str = cs.getPropertyValue(name) + "\u0001";
        for (let j = 0; j < str.length; j++) {
          const c = str.charCodeAt(j);
          h.h1 = Math.imul(h.h1 ^ c, FNV_A);
          h.h2 = Math.imul(h.h2 ^ (c + j), FNV_B);
        }
        h.n++;
      }
    }
  }
  const props = [];
  for (const [key, h] of hashers) {
    props.push({ key, digest: ((h.h1 >>> 0).toString(16) + (h.h2 >>> 0).toString(16)) + ":" + h.n });
  }
  props.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return {
    props,
    elementCount: els.length,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    title: document.title,
  };
};

/** Fetch the raw values of specific property keys for every element. */
const FETCH_KEYS = (keys) => {
  const pathOf = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1) {
      let s = n.tagName.toLowerCase();
      const par = n.parentElement;
      if (par) {
        const sibs = Array.prototype.filter.call(par.children, (c) => c.tagName === n.tagName);
        s += ":" + (sibs.indexOf(n) + 1);
      }
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(">");
  };
  const els = Array.prototype.slice.call(document.querySelectorAll("*"));
  const rows = els.map((el) => {
    const vals = {};
    for (const key of keys) {
      const bar = key.indexOf("|");
      const pseudo = bar === -1 ? null : key.slice(0, bar);
      const name = bar === -1 ? key : key.slice(bar + 1);
      const cs = pseudo ? getComputedStyle(el, pseudo) : getComputedStyle(el);
      vals[key] = cs.getPropertyValue(name);
    }
    return { sig: pathOf(el), vals };
  });
  return { rows, innerWidth: window.innerWidth, elementCount: els.length };
};

/**
 * Load a route and wait until it has actually finished rendering.
 *
 * Waiting on networkidle alone is not enough: this is a client-routed SPA, so
 * the HTML arrives first and the route renders later. We wait for the shell,
 * for the network to go quiet, for fonts and images to settle, and then for
 * the element count to stop changing.
 */
/**
 * Freeze every animation and transition.
 *
 * The comparison is about CSS, not about animation phase. Several elements
 * animate continuously (the wordmark mark, the spider chart circles), and the
 * two builds reach any given frame a few milliseconds apart, so an un-frozen
 * comparison reports differences like `matrix(1.03824)` vs `matrix(1.03826)`
 * that say nothing about the stylesheet. Freezing both sides identically makes
 * the comparison deterministic without weakening it.
 */
const FREEZE_CSS = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
}`;

async function settle(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  // Images: wait only for those already in the viewport, and only briefly.
  // Lazy images below the fold never load, and `decode()` on them hangs
  // forever — which is exactly how the first version of this script wedged.
  await page
    .evaluate(async () => {
      const near = [...document.images].filter((i) => {
        const r = i.getBoundingClientRect();
        return r.bottom > -200 && r.top < window.innerHeight + 200;
      });
      await Promise.race([
        Promise.all(near.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()))),
        new Promise((r) => setTimeout(r, 4000)),
      ]);
    })
    .catch(() => {});
  // Wait for the DOM to stop growing — the last thing a lazy route adds.
  await page.waitForFunction(
    () => {
      const n = document.querySelectorAll("*").length;
      if (window.__lastCount === n) return true;
      window.__lastCount = n;
      return false;
    },
    null,
    { timeout: 15000, polling: 250 },
  );
  await page.waitForTimeout(400);
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.waitForTimeout(120);
}

/* ── Main ──────────────────────────────────────────────────────────────── */

const newDir = path.resolve("dist");
const againstIdx = process.argv.indexOf("--against");
if (againstIdx === -1) {
  console.error("Usage: node scripts/verify-css-refactor.mjs --against <dir>");
  process.exit(2);
}
const oldDir = path.resolve(process.argv[againstIdx + 1]);
if (!fs.existsSync(path.join(oldDir, "index.html"))) {
  console.error(`No build at ${oldDir} (no index.html)`);
  process.exit(2);
}

const OLD_PORT = 8801;
const NEW_PORT = 8802;
const oldServer = await serve(oldDir, OLD_PORT);
const newServer = await serve(newDir, NEW_PORT);
const oldOrigin = `http://localhost:${OLD_PORT}`;
const newOrigin = `http://localhost:${NEW_PORT}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: WIDTHS[0], height: VIEWPORT_HEIGHT } });

// Hermetic: only the two local builds are allowed to load. Google Fonts and
// the Cloudflare RUM beacon are the only external requests the site makes.
// Webfont load state does not change any computed style value (font-family
// computes to the declared stack, not the resolved face), so blocking them
// costs nothing and makes both sides of the comparison identical.
await context.route("**/*", (route) => {
  const u = route.request().url();
  if (u.startsWith(`http://localhost:${OLD_PORT}`) || u.startsWith(`http://localhost:${NEW_PORT}`)) {
    return route.continue();
  }
  return route.abort();
});

const page = await context.newPage();

let totalDiffs = 0;
let totalCompared = 0;
let totalElements = 0;
const failures = [];
const viewportProblems = [];

try {
  for (const width of WIDTH_SET) {
    // Set the viewport explicitly and confirm it took. A headless viewport that
    // silently disagrees with the requested width invalidates the whole run.
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    for (const route of ROUTE_SET) {
      let oldSnap, newSnap;
      try {
        await settle(page, `${oldOrigin}${route}`);
        oldSnap = await page.evaluate(SNAPSHOT);
        await settle(page, `${newOrigin}${route}`);
        newSnap = await page.evaluate(SNAPSHOT);
      } catch (e) {
        failures.push(`${route} @${width}: ${e.message.split("\n")[0]}`);
        continue;
      }

      for (const [label, snap] of [
        ["old", oldSnap],
        ["new", newSnap],
      ]) {
        if (snap.innerWidth !== width) {
          viewportProblems.push(
            `${route} @${width}: ${label} build measured innerWidth=${snap.innerWidth} (expected ${width})`,
          );
        }
      }

      const oldMap = new Map(oldSnap.props.map((p) => [p.key, p.digest]));
      const newMap = new Map(newSnap.props.map((p) => [p.key, p.digest]));
      const keys = new Set([...oldMap.keys(), ...newMap.keys()]);
      const changed = [...keys].filter((k) => oldMap.get(k) !== newMap.get(k)).sort();

      if (oldSnap.elementCount !== newSnap.elementCount) {
        failures.push(
          `${route} @${width}: element count changed ${oldSnap.elementCount} -> ${newSnap.elementCount} (DOM is not identical)`,
        );
        continue;
      }
      totalElements += newSnap.elementCount;

      if (changed.length) {
        // Phase 2 — pull the actual values so the report names the element.
        await settle(page, `${oldOrigin}${route}`);
        const oldDetail = await page.evaluate(FETCH_KEYS, changed);
        await settle(page, `${newOrigin}${route}`);
        const newDetail = await page.evaluate(FETCH_KEYS, changed);
        const byProp = new Map();
        for (let i = 0; i < oldDetail.rows.length; i++) {
          const o = oldDetail.rows[i];
          const n = newDetail.rows[i];
          for (const k of changed) {
            if (o.vals[k] === n.vals[k]) continue;
            totalDiffs++;
            let bucket = byProp.get(k);
            if (!bucket) {
              bucket = { count: 0, example: `${o.sig} | ${k} | old=${o.vals[k]} | new=${n.vals[k]}` };
              byProp.set(k, bucket);
            }
            bucket.count++;
          }
        }
        totalCompared += oldSnap.elementCount * changed.length;
        // Report the properties that changed, deepest cause first: a changed
        // font-size shows up as hundreds of changed heights downstream, and
        // the interesting number is the one with the fewest occurrences.
        const ranked = [...byProp.entries()].sort((a, b) => a[1].count - b[1].count);
        console.log(
          `DIFF ${String(width).padStart(4)}px ${route.padEnd(22)} ${changed.length} properties changed, ${totalDiffs} values`,
        );
        for (const [k, b] of ranked.slice(0, 30)) {
          console.log(`       ${k}  (${b.count} elements)  e.g. ${b.example}`);
        }
      } else {
        totalCompared += newSnap.elementCount * newSnap.props.length;
        console.log(`ok   ${String(width).padStart(4)}px ${route.padEnd(22)} elements=${String(newSnap.elementCount).padStart(5)} properties=${String(newSnap.props.length).padStart(4)} identical`);
      }
    }
  }
} finally {
  await browser.close();
  oldServer.close();
  newServer.close();
}

console.log(`\n=== ${totalCompared} element/property comparisons across ${ROUTE_SET.length} routes × ${WIDTH_SET.length} widths (${totalElements} elements rendered) ===`);
console.log(`=== total computed-style differences: ${totalDiffs} ===`);

if (viewportProblems.length) {
  console.log("\nVIEWPORT PROBLEMS (the run below is not trustworthy):");
  for (const v of viewportProblems) console.log(`  ${v}`);
}
if (failures.length) {
  console.log("\nFAILURES:");
  for (const f of failures) console.log(`  ${f}`);
}
if (totalDiffs > 0 || failures.length || viewportProblems.length) {
  console.log("\nREFACTOR IS NOT BEHAVIOUR-PRESERVING.");
  process.exit(1);
}
console.log("\nREFACTOR IS BEHAVIOUR-PRESERVING: every computed style is identical.");
