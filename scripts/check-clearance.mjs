#!/usr/bin/env node
/**
 * Clearance gate: the band and the first line.
 *
 * The masthead is a fixed band. Everything else on the page scrolls under it,
 * and the page's first line has to start below it — with room to breathe.
 *
 * The city page got this wrong. Its hero carried 5.5rem of padding under a
 * 72px band, so the back link sat 16px below the band's rule: the band and
 * the first line read as one crowded block, and the page looked like it had
 * been pasted under a lid. Every other page was fine, because their heroes
 * are tall by design — which is exactly why the tight one survived: it only
 * shows up on the page whose hero is deliberately short.
 *
 * The rule the gate holds, on every route and every width:
 *
 *   the first visible line of the page starts at least CLEARANCE px below the
 *   bottom of the fixed band.
 *
 * Usage:
 *   node scripts/check-clearance.mjs
 *   node scripts/check-clearance.mjs --url <base>    # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

/** The smallest gap the first line may have under the band. */
const CLEARANCE = 32;

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

const WIDTHS = [1440, 1024, 768, 390];

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

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
 * The topmost visible line of text that is not inside the band. Text, not
 * boxes: a full-bleed photograph may start at the very top of the page, but
 * the first thing a reader reads has to clear the band.
 */
const PROBE = () => {
  const header = document.querySelector("header");
  if (!header) return { error: "no header" };
  const headerBottom = header.getBoundingClientRect().bottom;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let first = null;
  let node;

  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || el.closest("header")) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height === 0 || rect.width === 0) continue;
    if (rect.top < headerBottom - 1) continue;
    if (!first || rect.top < first.top) {
      first = {
        top: Math.round(rect.top),
        tag: el.tagName,
        cls: el.getAttribute("class") || "",
        text: text.slice(0, 48),
      };
    }
  }

  return {
    headerBottom: Math.round(headerBottom),
    headerHeight: Math.round(header.getBoundingClientRect().height),
    headerPosition: getComputedStyle(header).position,
    first,
    clearance: first ? Math.round(first.top - headerBottom) : null,
  };
};

const failures = [];
const rows = [];

let server = null;
let base = "";

try {
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

  const launch = () =>
    chromium.launch({
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });

  let browser = await launch();

  // A browser that dies mid-run used to abort the whole gate: newPage() sat
  // outside the per-measurement try, so one crash reported "the gate could
  // not run" and nothing else. On a busy machine that is the common case, and
  // a gate that measures nothing is worse than one that measures most of it.
  // A dead browser is relaunched and the failed measurement is recorded, so
  // coverage can never quietly shrink below a pass.
  const ensureBrowser = async () => {
    if (!browser.isConnected()) browser = await launch();
    return browser;
  };

  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      let page = null;
      try {
        await ensureBrowser();
        page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(350);
        const r = await page.evaluate(PROBE);

        if (r.error) {
          failures.push(`${route} @${width}: ${r.error}`);
          continue;
        }

        if (r.headerPosition !== "fixed") {
          failures.push(`${route} @${width}: the band is ${r.headerPosition}, not fixed — the clearance rule assumes a fixed band`);
        }

        if (r.clearance === null) {
          failures.push(`${route} @${width}: no visible line of text on the page`);
          continue;
        }

        rows.push({ route, width, clearance: r.clearance, text: r.first.text, cls: r.first.cls });

        if (r.clearance < CLEARANCE) {
          failures.push(
            `${route} @${width}: the first line sits ${r.clearance}px under the band (limit ${CLEARANCE}px) — "${r.first.text}"`,
          );
        }
      } catch (e) {
        failures.push(`${route} @${width}: could not measure — ${String(e.message || e).split("\n")[0]}`);
      } finally {
        if (page) await page.close().catch(() => {});
      }
    }
  }

  await browser.close().catch(() => {});
} catch (error) {
  failures.push(`the gate could not run: ${error.message}`);
} finally {
  if (server) server.close();
}

const tightest = [...rows].sort((a, b) => a.clearance - b.clearance).slice(0, 5);
for (const row of tightest) {
  console.log(`  ${row.route.padEnd(20)} ${String(row.width).padStart(5)}  ${String(row.clearance).padStart(5)}px  "${row.text}"`);
}

if (failures.length > 0) {
  console.error("");
  for (const failure of failures) console.error(`  FAIL ${failure}`);
  console.error("");
  console.error("check:clearance FAILED");
  process.exit(1);
}

console.log(
  `check:clearance PASSED — ${rows.length} page loads, every first line at least ${CLEARANCE}px below the fixed band.`,
);
