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
 * A void is measured twice, and this is the part that was missing: a cell
 * that is shorter than the column it stands in leaves the space BELOW it
 * empty, and the old gate only measured the gaps BETWEEN items. The
 * three-column layout that shipped with 98px of nothing under the first
 * column passed the old gate, because the old gate never looked below the
 * last item in a column. It looks now. The widths are sampled densely for
 * the same reason: a hole that appears at 561px and not at 515px is still a
 * hole, and four widths are not enough to find one.
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
const VOID_LIMIT = 36;

/** The block may not be taller than one screen. A footer is the end of the
 *  page; it is not another page. */
const MAX_NAV_SCREENS = 1;

const LOCALES = ["en", "th", "zh", "ko", "ja"];

/**
 * The widths are sampled densely, because a hole that appears at 561px and
 * not at 515px is still a hole. The old gate looked at four widths, and the
 * three-column layout that shipped with a 98px hole under its first column
 * sailed through it.
 */
const WIDTHS = [
  320, 360, 390, 430, 480, 515, 540, 561, 600, 640, 700, 768, 820, 900, 960, 1023, 1024, 1150, 1280, 1440,
];

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

  /*
   * A void is the empty space under a block of the navigation, so the
   * blocks are what must be measured — not the links. A group's links now
   * run along one line, and each link in that run has its own left edge, so
   * grouping the links by their left edge would call every link its own
   * column and report the whole block as empty.
   *
   * There are two ways for a block to leave a hole, and both are measured:
   *
   *   1. beside it — blocks that share a row take the height of the
   *      tallest of them, so a short one leaves a hole under itself. The
   *      old phone grid did this: "Home" sat alone in a 211px row.
   *   2. below the block — a column that stops short of the bottom of the
   *      navigation. The old three-column layout did this: 98px of nothing
   *      under its first column.
   *
   * The space between two rows is a gap, not a hole, and is not counted.
   */
  const blocks = [...nav.children].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      text: (el.textContent || "").trim().replace(/\s+/g, " "),
      left: Math.round(r.left),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
    };
  });

  const groupBy = (key) => {
    const keys = [...new Set(blocks.map((b) => b[key]))].sort((a, b) => a - b);
    const groups = [];
    for (const k of keys) {
      const members = blocks.filter((b) => b[key] === k);
      const last = groups[groups.length - 1];
      if (last && Math.abs(last.key - k) <= 8) {
        last.key = Math.min(last.key, k);
        last.blocks.push(...members);
        last.bottom = Math.max(last.bottom, ...members.map((b) => b.bottom));
      } else {
        groups.push({
          key: k,
          top: Math.min(...members.map((b) => b.top)),
          bottom: Math.max(...members.map((b) => b.bottom)),
          blocks: members,
        });
      }
    }
    return groups;
  };

  const voids = [];

  // 1. A hole under a block that shares a row with a taller block.
  for (const row of groupBy("top")) {
    for (const b of row.blocks) {
      const gap = Math.round(row.bottom) - b.bottom;
      if (gap > 0) {
        voids.push({ gap, after: b.text.slice(0, 30), before: "the bottom of its row" });
      }
    }
  }

  // 2. A column that stops short of the bottom of the block.
  for (const column of groupBy("left")) {
    column.blocks.sort((a, b) => a.top - b.top);
    const last = column.blocks[column.blocks.length - 1];
    const gap = Math.round(navBox.bottom) - last.bottom;
    if (gap > 0) {
      voids.push({ gap, after: last.text.slice(0, 30), before: "the bottom of the block" });
    }
  }

  const groups = [...nav.querySelectorAll(".site-footer-nav-group")].map((g) => {    const labelEl = g.querySelector(".site-footer-nav-label");
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

  // The space between the heading of a group and its links, and between the
  // lines of a run that wraps. A hole inside a group is a hole too.
  const innerVoids = [];
  for (const block of nav.children) {
    const parts = [...block.querySelectorAll(".site-footer-nav-label, a")].map((el) => {
      const r = el.getBoundingClientRect();
      return { text: (el.textContent || "").trim().slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom) };
    });
    parts.sort((a, b) => a.top - b.top);
    for (let i = 1; i < parts.length; i++) {
      const gap = parts[i].top - parts[i - 1].bottom;
      if (gap > 0) {
        innerVoids.push({ gap, after: parts[i - 1].text, before: parts[i].text });
      }
    }
  }

  return {
    navHeight: Math.round(navBox.height),
    navWidth: Math.round(navBox.width),
    voids,
    innerVoids,
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

const browser = await chromium.launch({ headless: true });
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
    try {
      await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
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
      for (const v of r.innerVoids || []) {
        if (v.gap > VOID_LIMIT) {
          failures.push(
            `${where}: void of ${v.gap}px inside a group, under "${v.after}" (before "${v.before}") — ` +
              `a group may not leave more than ${VOID_LIMIT}px empty`,
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
  try {
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
  } catch (e) {
    failures.push(`${locale} @390 drawer: ${String(e.message || e).split("\n")[0]}`);
  }
  await context.close().catch(() => {});
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
