#!/usr/bin/env node
/**
 * Screenshot pages for visual review.
 *
 *   node scripts/shoot-pages.mjs /methodology /thailand --widths 1440,390 --out /tmp/shots
 *   node scripts/shoot-pages.mjs /rankings --selector .region-switch --widths 1440
 *
 * External requests are allowed so the real webfonts load — a screenshot with
 * fallback fonts is not a screenshot of the site.
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
// Routes are what is left once the flags are taken out. Filtering on "/" up
// front swallowed the --out path as a route and visited it as a page.
const flagValues = new Set();
for (let i = 0; i < args.length; i += 1) {
  if (args[i].startsWith("--")) {
    flagValues.add(args[i]);
    if (args[i + 1] && !args[i + 1].startsWith("--")) flagValues.add(args[i + 1]);
  }
}
const routes = args.filter((a) => a.startsWith("/") && !flagValues.has(a));
const widths = flag("widths", "1440,390").split(",").map(Number);
const outDir = flag("out", "/tmp/shots");
const full = args.includes("--full");
// Screenshot one element instead of the page — how a spatial offender is
// actually judged: you have to look at the thing, not at the whole scroll.
const selector = flag("selector", null);
const pad = Number(flag("pad", "12"));
// Capture at a scroll offset instead of the top — where a dead band lives.
const scrollY = Number(flag("scroll", "0"));

fs.mkdirSync(outDir, { recursive: true });

function serve(dir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dir, url);
      if (!file.startsWith(dir)) return res.writeHead(403).end();
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

const server = await serve(path.resolve("dist"), 8802);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: widths[0], height: 900 } });
const page = await context.newPage();

for (const width of widths) {
  await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
  for (const route of routes) {
    await page.goto(`http://localhost:8802${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    // Freeze animation so a screenshot is a stable frame.
    await page.addStyleTag({ content: "*,*::before,*::after{animation:none !important;transition:none !important}" });
    await page.waitForTimeout(200);
    if (scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(700);
    }
    const slug = selector ? selector.replace(/[^\w-]+/g, "_") : null;
    const name = `${route.replace(/\//g, "_") || "_home"}-${width}${slug ? "-" + slug : ""}.png`;
    const file = path.join(outDir, name);
    if (selector) {
      const el = page.locator(selector).first();
      const count = await page.locator(selector).count();
      if (!count) {
        console.log(`${route} @${width}: selector ${selector} not found`);
        continue;
      }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const box = await el.boundingBox();
      await page.screenshot({
        path: file,
        clip: {
          x: Math.max(0, box.x - pad),
          y: Math.max(0, box.y - pad),
          width: Math.min(width, box.width + pad * 2),
          height: box.height + pad * 2,
        },
      });
      console.log(`${file}  (${selector} ${Math.round(box.width)}x${Math.round(box.height)})`);
      continue;
    }
    await page.screenshot({ path: file, fullPage: full });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${file}  (document height ${h}px)`);
  }
}

await browser.close();
server.close();
process.exit(0);
