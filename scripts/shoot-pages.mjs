#!/usr/bin/env node
/**
 * Screenshot pages for visual review.
 *
 *   node scripts/shoot-pages.mjs /methodology /thailand --widths 1440,390 --out /tmp/shots
 *
 * External requests are allowed so the real webfonts load — a screenshot with
 * fallback fonts is not a screenshot of the site.
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const routes = args.filter((a) => a.startsWith("/"));
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const widths = flag("widths", "1440,390").split(",").map(Number);
const outDir = flag("out", "/tmp/shots");
const full = args.includes("--full");

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
const browser = await chromium.launch({ channel: "chrome", headless: true });
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
    const name = `${route.replace(/\//g, "_") || "_home"}-${width}.png`;
    const file = path.join(outDir, name);
    await page.screenshot({ path: file, fullPage: full });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${file}  (document height ${h}px)`);
  }
}

await browser.close();
server.close();
process.exit(0);
