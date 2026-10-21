#!/usr/bin/env node
/**
 * Footer navigation gate.
 *
 * The footer's navigation is a sitemap, and a sitemap has one job: get a
 * reader to a page. Two things break that job, and neither shows up in the
 * unit tests, because both are properties of the layout and not of the code:
 *
 *   1. a void — a column that is mostly empty space. The old phone layout
 *      was a two-column grid in which every row took the height of its
 *      tallest cell, so the 44px "Home" link sat alone in a 211px row with
 *      167px of nothing under it, and the gap between "Data" and "About" was
 *      190px. The links were packed; the columns were not.
 *   2. a repeated word — a heading that is also one of its own links
 *      ("Rankings" heading the "Rankings" page) prints the same word twice
 *      and reads as a mistake.
 *
 * And two things that would be worse than either:
 *
 *   3. a lost page — the fix that absorbs a repeated word must not swallow a
 *      page on the way. Every route the site publishes must still be one
 *      click away in the footer.
 *   4. a wrapped line — a label that wraps onto a second line breaks the
 *      rhythm of the whole block.
 *
 * The mobile drawer is held to the same two rules it can break: no repeated
 * word, no wrapped line.
 *
 * Usage:
 *   node scripts/check-footer-nav.mjs
 *   node scripts/check-footer-nav.mjs --url <base>    # against a deployed site
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

/** The largest empty gap a column may leave under an item. */
const VOID_LIMIT = 48;

/** The block may not be taller than one screen. A footer is the end of the
 *  page; it is not another page. */
const MAX_NAV_SCREENS = 1;

const LOCALES = ["en", "th", "zh", "ko", "ja"];
const WIDTHS = [390, 515, 768, 1440];

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

/**
 * Every route the footer must reach, read from the one file that owns the
 * navigation. Parsed rather than hard-coded so the gate cannot drift away
 * from the app: if the parse finds nothing, the gate fails rather than
 * passes.
 */
function expectedPaths() {
  const file = path.resolve("src/navGroups.ts");
  if (!fs.existsSync(file)) {
    throw new Error(`cannot find ${file} — the gate must run inside the repository`);
  }
  const src = fs.readFileSync(file, "utf8");
  const paths = new Set(["/"]);
  for (const match of src.matchAll(/paths:\s*\[([^\]]*)\]/g)) {
    for (const p of match[1].matchAll(/"\/[^"]*"/g)) paths.add(p[0].slice(1, -1));
  }
  if (paths.size < 5) {
    throw new Error(`parsed only ${paths.size} routes from navGroups.ts — refusing to pass a gate that saw nothing`);
  }
  return paths;
}

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

/** Runs in the page. Reports the shape of the footer navigation. */
const PROBE = () => {
  const nav = document.querySelector(".site-footer-nav");
  if (!nav) return { error: "no .site-footer-nav" };

  const navBox = nav.getBoundingClientRect();

  /** Counts the rendered lines of an element. A wrapped label is a rhythm
   *  break; the height alone cannot tell you, because a link is a flex box
   *  with a min-height far taller than its text. */
  const lineCount = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()].filter((r) => r.height > 1 && r.width > 0).length;
  };

  const leaves = [...nav.querySelectorAll(".site-footer-nav-label, a")].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || ""),
      text: (el.textContent || "").trim(),
      left: Math.round(r.left),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      height: Math.round(r.height),
      lines: lineCount(el),
      href: el.getAttribute("href") || "",
    };
  });

  // Group the leaves into columns by their left edge, merging edges that sit
  // within a few pixels of each other.
  const edges = [...new Set(leaves.map((l) => l.left))].sort((a, b) => a - b);
  const columns = [];
  for (const edge of edges) {
    const last = columns[columns.length - 1];
    if (last && edge - last.left <= 8) {
      last.left = Math.min(last.left, edge);
      last.items.push(...leaves.filter((l) => l.left === edge));
    } else {
      columns.push({ left: edge, items: leaves.filter((l) => l.left === edge) });
    }
  }

  const voids = [];
  for (const column of columns) {
    column.items.sort((a, b) => a.top - b.top);
    for (let i = 1; i < column.items.length; i++) {
      const gap = column.items[i].top - column.items[i - 1].bottom;
      voids.push({ gap, after: column.items[i - 1].text.slice(0, 30), before: column.items[i].text.slice(0, 30) });
    }
  }

  const groups = [...nav.querySelectorAll(".site-footer-nav-group")].map((g) => {
    const labelEl = g.querySelector(".site-footer-nav-label");
    const links = [...g.querySelectorAll("a")].filter((a) => a !== labelEl);
    return {
      label: (labelEl?.textContent || "").trim(),
      labelIsLink: labelEl?.tagName === "A",
      links: links.map((a) => (a.textContent || "").trim()),
    };
  });

  const hrefs = [...nav.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((href) => href && href.startsWith("/") && !href.startsWith("//"));

  const wrapped = leaves.filter((l) => l.lines > 1).map((l) => `${l.text} (${l.lines} lines)`);

  return {
    navHeight: Math.round(navBox.height),
    navWidth: Math.round(navBox.width),
    columns: columns.length,
    voids,
    groups,
    hrefs,
    wrapped,
  };
};

/** The mobile drawer, opened. */
const PROBE_PANEL = () => {
  const panel = document.querySelector(".mh-panel");
  if (!panel) return { error: "no .mh-panel" };
  const groups = [...panel.querySelectorAll(".mh-panel-group")].map((g) => {
    const labelEl = g.querySelector(".mh-panel-group-label");
    const links = [...g.querySelectorAll("a")].filter((a) => a !== labelEl);
    return {
      label: (labelEl?.textContent || "").trim(),
      links: links.map((a) => (a.textContent || "").trim()),
    };
  });
  const range = document.createRange();
  const wrapped = [];
  for (const el of panel.querySelectorAll(".mh-panel-group-label, .mh-panel-link")) {
    range.selectNodeContents(el);
    const lines = [...range.getClientRects()].filter((r) => r.height > 1 && r.width > 0).length;
    if (lines > 1) wrapped.push(`${(el.textContent || "").trim()} (${lines} lines)`);
  }
  return { groups, wrapped };
};

const expected = expectedPaths();
const oldServer = LIVE ? null : await serve(path.resolve("dist"), 8804);
const base = LIVE ?? "http://localhost:8804";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
let checked = 0;

for (const locale of LOCALES) {
  const context = await browser.newContext({ viewport: { width: WIDTHS[0], height: 900 } });
  await context.addInitScript((loc) => {
    try {
      localStorage.setItem("slic-locale", loc);
    } catch {}
  }, locale);
  const page = await context.newPage();

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    try {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector(".site-footer-nav", { timeout: 45000 });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(600);

      const r = await page.evaluate(PROBE);
      checked++;
      const where = `${locale} @${width}`;

      if (r.error) {
        failures.push(`${where}: ${r.error}`);
        continue;
      }

      // 1. no void
      for (const v of r.voids) {
        if (v.gap > VOID_LIMIT) {
          failures.push(
            `${where}: void of ${v.gap}px under "${v.after}" (before "${v.before}") — ` +
              `a column may not leave more than ${VOID_LIMIT}px empty`,
          );
        }
      }

      // 2. no repeated word
      for (const g of r.groups) {
        for (const link of g.links) {
          if (link === g.label) {
            failures.push(`${where}: the heading "${g.label}" is repeated as one of its own links`);
          }
        }
        if (g.links.length === 0) {
          failures.push(`${where}: the group "${g.label}" has no link under it`);
        }
      }

      // 3. no lost page, and no page linked twice
      const counts = new Map();
      for (const href of r.hrefs) {
        const path = href.length > 1 ? href.replace(/\/$/, "") : href;
        counts.set(path, (counts.get(path) || 0) + 1);
      }
      for (const p of expected) {
        const count = counts.get(p) || 0;
        if (count === 0) failures.push(`${where}: the footer no longer links to ${p}`);
        if (count > 1) failures.push(`${where}: the footer links to ${p} ${count} times`);
      }

      // 4. no wrapped line
      for (const w of r.wrapped) {
        failures.push(`${where}: wrapped line in the footer navigation — ${w}`);
      }

      // 5. one screen
      const viewport = width > 700 ? 900 : 844;
      if (r.navHeight > viewport * MAX_NAV_SCREENS) {
        failures.push(`${where}: the footer navigation is ${r.navHeight}px tall — more than one screen`);
      }
    } catch (e) {
      failures.push(`${locale} @${width}: ${String(e.message || e).split("\n")[0]}`);
    }
  }

  // The mobile drawer, on a phone width.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".mh-burger", { timeout: 45000 });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector(".mh-burger")?.click());
  await page.waitForTimeout(500);
  const panel = await page.evaluate(PROBE_PANEL);
  if (panel.error) {
    failures.push(`${locale} @390 drawer: ${panel.error}`);
  } else {
    for (const g of panel.groups) {
      for (const link of g.links) {
        if (link === g.label) {
          failures.push(`${locale} @390 drawer: the heading "${g.label}" is repeated as one of its own links`);
        }
      }
    }
    for (const w of panel.wrapped) {
      failures.push(`${locale} @390 drawer: wrapped line — ${w}`);
    }
  }
  await context.close();
}

await browser.close();
if (oldServer) oldServer.close();

console.log(
  `footer nav gate: ${checked} page loads checked across ${LOCALES.length} locales × ${WIDTHS.length} widths, ` +
    `plus ${LOCALES.length} drawer openings`,
);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures.slice(0, 40)) console.log(`  ${f}`);
  console.log("\nFOOTER NAV GATE FAILED.");
  process.exit(1);
}
console.log(
  `FOOTER NAV GATE PASSED: no void over ${VOID_LIMIT}px, no repeated heading, no lost page, no wrapped line, ` +
    `never more than one screen.`,
);
