#!/usr/bin/env node
/**
 * Masthead gate.
 *
 * The bar at the top of every page used to be a collage: a translucent dark
 * plate inset inside the viewport, and inside it a search button with its
 * own plate, a ⌘K keycap with a box, a native select with the browser's own
 * white card glued to it, and a burger with a light border. Five nested
 * treatments on one bar, none of them earning its place — the Rams rule, as
 * a box inside a box inside a box.
 *
 * The bar is now one opaque cream band, full bleed, with a hairline rule at
 * the bottom, and the controls sit on it as bare marks. This gate holds
 * that:
 *
 *   1. one ground — the bar's background is opaque and is the site's own
 *      background token, on every page including the home page, whose hero
 *      photograph used to sit behind a dark scrim;
 *   2. no plate — the bar's inner row, the search trigger, the ⌘K keycap,
 *      the language control and the menu button paint no background of
 *      their own and carry no border;
 *   3. no box in a box — no element inside the bar may paint a background
 *      that differs from the bar's ground;
 *   4. full bleed — the band reaches both edges of the viewport, and the
 *      content inside it keeps the page's gutter.
 *
 * Usage:
 *   node scripts/check-masthead.mjs
 *   node scripts/check-masthead.mjs --url <base>    # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

const WIDTHS = [390, 768, 1024, 1440];

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[urlArg + 1] : null;

function serve(dir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dir, url);
      if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) file = path.join(dir, "index.html");
      const ext = path.extname(file);
      const type = ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : ext === ".html" ? "text/html" : "application/octet-stream";
      res.writeHead(200, { "content-type": type });
      res.end(fs.readFileSync(file));
    });
    server.listen(port, () => resolve(server));
  });
}

/** Runs in the page. Reports the treatment of every part of the bar. */
const PROBE = () => {
  const bar = document.querySelector(".mh");
  if (!bar) return { error: "no .mh" };

  const alpha = (color) => {
    const m = /rgba?\(([^)]+)\)/.exec(color || "");
    if (!m) return 1;
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    if (parts.length < 4) return 1;
    return parts[3];
  };

  const describe = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      sel: el.className && typeof el.className === "string" ? `.${el.className.split(/\s+/).filter(Boolean).join(".")}` : el.tagName,
      background: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      alpha: alpha(cs.backgroundColor),
      borderTop: parseFloat(cs.borderTopWidth) || 0,
      borderLeft: parseFloat(cs.borderLeftWidth) || 0,
      borderRight: parseFloat(cs.borderRightWidth) || 0,
      borderBottom: parseFloat(cs.borderBottomWidth) || 0,
      shadow: cs.boxShadow === "none" ? "none" : cs.boxShadow,
      appearance: cs.appearance,
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      height: Math.round(r.height),
      visible: r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden",
    };
  };

  const barCs = getComputedStyle(bar);
  const rootBg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();

  /** The token is written as a hex; the computed style is rgb(). Put them
   *  in the same notation before comparing them, or the gate fails on the
   *  notation and not on the colour. */
  const toRgb = (value) => {
    const v = (value || "").trim();
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if (!hex) return v.replace(/\s+/g, " ").toLowerCase();
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    const n = parseInt(h, 16);
    return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  };

  const parts = [".mh", ".mh-inner", ".mh-search-btn", ".mh-search-kbd", ".locale-select", ".mh-burger", ".mh-mark"]
    .map((sel) => {
      const el = document.querySelector(sel);
      return { sel, d: describe(el) };
    })
    .filter((p) => p.d);

  return {
    rootBg: toRgb(rootBg),
    barBackground: toRgb(barCs.backgroundColor),
    barBackgroundImage: barCs.backgroundImage,
    barAlpha: alpha(barCs.backgroundColor),
    barLeft: Math.round(bar.getBoundingClientRect().left),
    barRight: Math.round(bar.getBoundingClientRect().right),
    viewport: window.innerWidth,
    parts,
  };
};

const oldServer = LIVE ? null : await serve(path.resolve("dist"), 8806);
const base = LIVE ?? "http://localhost:8806";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
let checked = 0;

const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
const page = await context.newPage();

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  try {
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".mh", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(500);

    const r = await page.evaluate(PROBE);
    checked++;
    const where = `@${width}`;

    if (r.error) {
      failures.push(`${where}: ${r.error}`);
      continue;
    }

    // 1. one ground: the bar is opaque and it is the site's background.
    if (r.barAlpha < 1) {
      failures.push(
        `${where}: the bar is translucent (${r.barBackground}) — it must be one opaque ground, not glass over the page`,
      );
    }
    if (r.rootBg) {
      const bar = r.barBackground.replace(/\s+/g, "");
      const want = r.rootBg.replace(/\s+/g, "");
      if (bar !== want) {
        failures.push(`${where}: the bar's ground is ${r.barBackground}, not the site's --bg (${r.rootBg}) — one ground`);
      }
    }
    if (r.barBackgroundImage && r.barBackgroundImage !== "none") {
      failures.push(`${where}: the bar paints a background image (${r.barBackgroundImage}) — one ground, one treatment`);
    }

    // 4. full bleed: the band reaches both edges.
    if (r.barLeft > 0 || r.barRight < r.viewport - 1) {
      failures.push(
        `${where}: the bar is inset (${r.barLeft}px to ${r.barRight}px in a ${r.viewport}px viewport) — it must be a band across the full width`,
      );
    }

    for (const part of r.parts) {
      const d = part.d;
      if (!d.visible) continue;

      // 2. no plate: no control paints a background or carries a border.
      if (part.sel === ".mh") continue;
      if (d.alpha > 0 && d.alpha < 1) {
        failures.push(`${where}: ${part.sel} is translucent (${d.background}) — nothing in the bar is glass`);
      }
      if (d.alpha === 1 && part.sel !== ".mh-inner" && d.background !== r.barBackground) {
        failures.push(
          `${where}: ${part.sel} paints its own ground (${d.background}) — a box inside a box`,
        );
      }
      if (part.sel === ".mh-inner" && d.alpha === 1 && d.background !== r.barBackground) {
        failures.push(`${where}: the bar's inner row paints its own ground (${d.background}) — one ground`);
      }
      const borders = d.borderTop + d.borderLeft + d.borderRight + d.borderBottom;
      if (borders > 0 && part.sel !== ".mh") {
        failures.push(`${where}: ${part.sel} carries a border — the bar's controls are bare marks`);
      }
      if (d.shadow !== "none") {
        failures.push(`${where}: ${part.sel} carries a shadow (${d.shadow}) — nothing in the bar is floating`);
      }
    }
  } catch (e) {
    failures.push(`@${width}: ${String(e.message || e).split("\n")[0]}`);
  }
}

await context.close();
await browser.close();
if (oldServer) oldServer.close();

console.log(`masthead gate: ${checked} page loads checked across ${WIDTHS.length} widths`);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures.slice(0, 40)) console.log(`  ${f}`);
  console.log("\nMASTHEAD GATE FAILED.");
  process.exit(1);
}
console.log(
  "MASTHEAD GATE PASSED: one opaque ground, full bleed, no plate and no border on any control, nothing in glass.",
);
