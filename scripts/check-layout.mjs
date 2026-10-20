#!/usr/bin/env node
/**
 * Layout integrity gate.
 *
 * Condensing a page is easy to do and easy to break. A tighter grid, a
 * narrower measure, a two-up field layout — any of these can push a row past
 * the viewport and produce a page that scrolls sideways, and nothing else in
 * the build notices. Nothing in the unit tests can notice either, because
 * layout is not a property of the source.
 *
 * So this drives the real built site in a real browser at three widths and
 * asserts the things that must never be true of a shipped page:
 *
 *   1. no horizontal overflow — the page never scrolls sideways
 *   2. no uncaught exception during load or route change
 *   3. no broken image
 *   4. the route actually rendered — a lazy chunk that never resolves leaves
 *      a skeleton, which is a shipped blank page
 *
 * Usage:
 *   node scripts/check-layout.mjs            # against dist/
 *   node scripts/check-layout.mjs --url <base>  # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
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

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

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

/** Runs in the page. Reports anything that must not be true of a shipped page. */
const PROBE = () => {
  const doc = document.documentElement;
  const clientWidth = doc.clientWidth;
  const scrollWidth = Math.max(doc.scrollWidth, document.body.scrollWidth);

  const overflow = [];
  if (scrollWidth > clientWidth + 1) {
    // An element that sticks out is only a real offender if nothing above it
    // clips it. A full-bleed photo inside an overflow:hidden frame is clipped
    // and harmless; reporting it would train people to ignore the list.
    const isClipped = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p);
        if (o.overflowX === "hidden" || o.overflowX === "clip" || o.overflowX === "auto" || o.overflowX === "scroll") return true;
      }
      return false;
    };
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right <= clientWidth + 1 && r.left >= -1) continue;
      if (isClipped(el)) continue;
      overflow.push(
        `${el.tagName.toLowerCase()}.${String(el.className).replace(/\s+/g, ".").slice(0, 50)} ` +
          `left=${Math.round(r.left)} right=${Math.round(r.right)} w=${Math.round(r.width)}`,
      );
      if (overflow.length >= 6) break;
    }
  }

  const brokenImages = [];
  for (const img of document.images) {
    if (!img.complete) continue; // still loading (lazy) — not broken
    if (img.naturalWidth === 0 && img.getAttribute("src")) {
      brokenImages.push(img.getAttribute("src").slice(0, 90));
    }
    if (brokenImages.length >= 6) break;
  }

  const text = (document.body.innerText || "").trim();
  return {
    clientWidth,
    scrollWidth,
    overflow,
    brokenImages,
    textLength: text.length,
    headings: document.querySelectorAll("h1, h2").length,
  };
};

const oldServer = LIVE ? null : await serve(path.resolve("dist"), 8802);
const base = LIVE ?? "http://localhost:8802";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: WIDTHS[0], height: 900 } });
const page = await context.newPage();

const failures = [];
const warnings = [];
let checked = 0;

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
  for (const route of ROUTES) {
    const pageErrors = [];
    const onError = (e) => pageErrors.push(String(e).split("\n")[0]);
    page.on("pageerror", onError);

    try {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      // Let the lazy route chunk resolve and the reveal animations settle.
      await page.waitForTimeout(1200);

      const r = await page.evaluate(PROBE);
      checked++;

      if (r.scrollWidth > r.clientWidth + 1) {
        failures.push(
          `${route} @${width}: horizontal overflow — document is ${r.scrollWidth}px wide in a ${r.clientWidth}px viewport\n` +
            r.overflow.map((o) => `      ${o}`).join("\n"),
        );
      }
      if (pageErrors.length) {
        failures.push(`${route} @${width}: uncaught exception — ${pageErrors[0]}`);
      }
      if (r.brokenImages.length) {
        failures.push(`${route} @${width}: broken image — ${r.brokenImages.join(", ")}`);
      }
      // A route that never resolves its lazy chunk renders a skeleton: a
      // shipped page with almost no words on it.
      if (r.textLength < 400 || r.headings === 0) {
        failures.push(
          `${route} @${width}: route did not render — ${r.textLength} characters of text, ${r.headings} headings`,
        );
      }
      if (pageErrors.length) {
        warnings.push(`${route} @${width}: ${pageErrors.length} exception(s)`);
      }
    } catch (e) {
      failures.push(`${route} @${width}: ${String(e.message || e).split("\n")[0]}`);
    } finally {
      page.off("pageerror", onError);
    }
  }
}

await browser.close();
if (oldServer) oldServer.close();

console.log(`layout gate: ${checked} page loads checked across ${ROUTES.length} routes × ${WIDTHS.length} widths`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 10)) console.log(`  ${w}`);
}
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures) console.log(`  ${f}`);
  console.log("\nLAYOUT GATE FAILED.");
  process.exit(1);
}
console.log("LAYOUT GATE PASSED: no horizontal overflow, no exceptions, no broken images, every route rendered.");
