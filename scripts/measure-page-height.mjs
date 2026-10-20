#!/usr/bin/env node
/**
 * Measure where the vertical space goes on every page.
 *
 * Condensing a page means knowing what it costs. This reports, per route and
 * width: the total scroll height, the height of every top-level section, and
 * how much of the page is padding rather than content.
 *
 * Usage:
 *   node scripts/measure-page-height.mjs               # against dist/
 *   node scripts/measure-page-height.mjs --url <base>  # against a live site
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

const WIDTHS = [1440, 390];
const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

function serve(dir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dir, url);
      if (!file.startsWith(dir)) return res.writeHead(403).end();
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

/** Runs in the page. Reports the vertical anatomy of the document. */
const MEASURE = () => {
  const doc = document.documentElement;
  const total = Math.max(doc.scrollHeight, document.body.scrollHeight);
  const sections = [];
  // Top-level blocks of the page: direct children of the page frame.
  const roots = [...document.querySelectorAll("main > *, .page-shell > *")];
  const seen = new Set();
  const push = (el) => {
    if (seen.has(el)) return;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.height < 1) return;
    const cs = getComputedStyle(el);
    sections.push({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).replace(/\s+/g, " ").trim().slice(0, 60),
      id: el.id || "",
      h: Math.round(r.height),
      padTop: Math.round(parseFloat(cs.paddingTop) || 0),
      padBottom: Math.round(parseFloat(cs.paddingBottom) || 0),
      marginTop: Math.round(parseFloat(cs.marginTop) || 0),
      marginBottom: Math.round(parseFloat(cs.marginBottom) || 0),
      top: Math.round(r.top + window.scrollY),
    });
  };
  for (const el of roots) push(el);
  // Any element that carries a top-level <section> but is not a direct child.
  for (const el of document.querySelectorAll("section")) {
    const r = el.getBoundingClientRect();
    if (r.height > 1 && r.top + window.scrollY < total * 0.02) push(el);
  }
  sections.sort((a, b) => a.top - b.top);
  return { total, sections, viewportH: window.innerHeight };
};

const oldServer = LIVE ? null : await serve(path.resolve("dist"), 8802);
const base = LIVE ?? "http://localhost:8802";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: WIDTHS[0], height: 900 } });
await context.route("**/*", (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
const page = await context.newPage();

const report = [];
for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ROUTES) {
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(800);
    const m = await page.evaluate(MEASURE);
    report.push({ route, width, ...m });
    console.log(`\n${route} @${width}  — total ${m.total}px  (${(m.total / m.viewportH).toFixed(1)} screens)`);
    for (const s of m.sections) {
      console.log(
        `   ${String(s.h).padStart(6)}px  ${s.tag}${s.id ? "#" + s.id : ""}${s.cls ? "." + s.cls.split(" ").join(".") : ""}` +
          `   pad ${s.padTop}/${s.padBottom}  margin ${s.marginTop}/${s.marginBottom}`,
      );
    }
  }
}

console.log("\n\n=== SUMMARY (total scroll height, px) ===");
const byRoute = new Map();
for (const r of report) {
  if (!byRoute.has(r.route)) byRoute.set(r.route, {});
  byRoute.get(r.route)[r.width] = r.total;
}
for (const [route, v] of byRoute) {
  console.log(`  ${route.padEnd(22)} 1440: ${String(v[1440]).padStart(7)}   390: ${String(v[390]).padStart(7)}`);
}

await browser.close();
if (oldServer) oldServer.close();
process.exit(0);
