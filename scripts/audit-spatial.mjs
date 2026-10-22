#!/usr/bin/env node
/**
 * Spatial hallucination audit.
 *
 * "Why is this here, why this size, and why this far from that?" If the
 * answer is merely "the grid put it there", the layout has failed.
 *
 * Spatial hallucination is when an interface invents a reason for things to
 * occupy space, instead of arranging them around how people read, choose and
 * act. Six families:
 *
 *   1. DEAD BANDS    a horizontal strip of the page with almost nothing in it
 *                    — unjustified gap, or an element stranded beside empty
 *                    space (ANTI-SLOP limit 12: no flat region over a third
 *                    of the first screen)
 *   2. ORPHANS       a grid or flex row where one item is far shorter than
 *                    its neighbours, so the row is padded out by a sibling
 *   3. ACCIDENTAL    a *row* of controls that wraps because it ran out of
 *      WRAPPING      room — a navigation breaking wherever it runs out of
 *                    room. Stacking (flex-direction: column) and grids are
 *                    NOT wrapping: a vertical list is correct by design.
 *   4. CLIPPED       text cut off by an overflow that is not deliberate
 *      TEXT
 *   5. SCATTERED     interactive elements that belong together but sit on
 *      ACTIONS       different lines, or are pushed to opposite edges of a row
 *   6. FALSE         a modifier that promises emphasis it does not deliver
 *      HIERARCHY     ("selected", "featured", "active"), or a heading level
 *                    that is skipped — everything gets equal weight, so
 *                    nothing helps you choose
 *   7. EXPENSIVE     how far the reader must scroll before the page says what
 *      INFORMATION   it is about, and before it offers an action
 *
 * Every finding is a *measurement*, not a verdict. The tool refuses to call
 * a vertical stack a wrap, a grid a scatter, or a 1px visually-hidden span a
 * clipping bug.
 *
 * Usage:
 *   node scripts/audit-spatial.mjs                    # against dist/
 *   node scripts/audit-spatial.mjs --url <base>       # against a live site
 *   node scripts/audit-spatial.mjs --json             # machine-readable
 *   node scripts/audit-spatial.mjs --route /essay     # one route
 *   node scripts/audit-spatial.mjs --strict           # exit 1 on any finding
 *   node scripts/audit-spatial.mjs --write-baseline scripts/spatial-baseline.json
 *
 * The baseline is a ratchet, not a zero-tolerance gate: it records the
 * findings the layout already tolerates, and the gate fails only when one of
 * them gets worse. Regenerate it only from a run with zero hard findings.
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

/*
 * The widths the gate sweeps. Three of them is a sample, and a sample is how
 * a hole at 561px survives: the old gate looked at four widths and the
 * three-column footer shipped with a 98px hole under its first column.
 *
 * The dense ladder is every 20px from 320 to 1920 — the widths a reader's
 * window actually takes. It is slower, so it is opt-in (--dense), but the
 * baseline is written from a dense run, which means the ratchet is measured
 * over the whole ladder and not over three guesses.
 */
const DENSE_WIDTHS = Array.from({ length: 81 }, (_, i) => 320 + i * 20);
const WIDTHS = [1440, 1024, 390];

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
};
const LIVE = arg("--url");
const ONLY_ROUTE = arg("--route");
const ONLY_WIDTH = arg("--width") ? Number(arg("--width")) : null;
const AS_JSON = argv.includes("--json");
const STRICT = argv.includes("--strict");
const BASELINE = arg("--check") || arg("--baseline");
const WRITE_BASELINE = arg("--write-baseline");
const DENSE = argv.includes("--dense");
/** How many pages are measured at once. Six keeps the machine busy without
 *  starving it, and each page gets its own viewport. */
const CONCURRENCY = Number(arg("--concurrency")) || 6;

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

/** Runs in the page. */
const AUDIT = () => {
  const describe = (el) => {
    if (!el) return "";
    const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "")
      .replace(/\s+/g, ".")
      .trim();
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`.slice(0, 64);
  };
  const CELL = 40;
  const doc = document.documentElement;
  const totalHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
  const docWidth = doc.clientWidth;
  const vh = window.innerHeight;

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  /**
   * Groups boxes into visual lines by *vertical overlap*, not by `top`.
   * Two side-by-side buttons of different heights have different tops but
   * sit on the same line; grouping by top calls that a wrap. Two boxes on
   * genuinely different lines do not overlap at all.
   */
  const groupLines = (boxes) => {
    const lines = [];
    for (const box of boxes) {
      const b = box.r;
      const top = b.top + window.scrollY;
      const bottom = b.bottom + window.scrollY;
      let line = lines.find((L) => {
        const overlap = Math.min(L.bottom, bottom) - Math.max(L.top, top);
        const smaller = Math.min(L.bottom - L.top, bottom - top);
        return smaller > 0 && overlap > smaller * 0.5;
      });
      if (!line) {
        line = { top, bottom, items: [] };
        lines.push(line);
      }
      line.items.push(box);
      line.top = Math.min(line.top, top);
      line.bottom = Math.max(line.bottom, bottom);
    }
    return lines;
  };

  /**
   * How much room a line leaves, and whether the next item would have fit in
   * it. A wrap that was *avoidable* — the line had room and the item still
   * dropped — is a defect. A wrap that was *forced* is the layout working.
   */
  const lineSlack = (line, gap) => {
    const used = line.items.reduce((sum, it) => sum + it.outer, 0) + gap * Math.max(0, line.items.length - 1);
    return { used, slack: line.containerW - used };
  };

  const isRow = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display !== "flex" && cs.display !== "inline-flex") return false;
    return cs.flexDirection === "row" || cs.flexDirection === "row-reverse";
  };

  const isColumn = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display !== "flex" && cs.display !== "inline-flex") return false;
    return cs.flexDirection === "column" || cs.flexDirection === "column-reverse";
  };

  /* ── occupancy map: which cells contain something ───────────────────── */
  const cols = Math.ceil(docWidth / CELL);
  const rows = Math.ceil(totalHeight / CELL);
  const occupied = new Uint8Array(cols * rows);

  const SVG_SHAPES = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text", "image", "use"]);
  const hasInk = (el) => {
    // SVG elements have a lowercase tagName ("svg", not "SVG"), and they paint
    // with fill/stroke rather than background-color. A naive tag check makes
    // the entire map invisible to the occupancy map.
    if (el.namespaceURI === "http://www.w3.org/2000/svg") {
      if (!SVG_SHAPES.has(el.tagName)) return false;
      const cs = getComputedStyle(el);
      return (cs.fill && cs.fill !== "none") || (cs.stroke && cs.stroke !== "none");
    }
    if (el.tagName === "IMG" || el.tagName === "CANVAS" || el.tagName === "VIDEO") return true;
    if (el.tagName === "HR") return true;
    if (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA" || el.tagName === "BUTTON") return true;
    const cs = getComputedStyle(el);
    if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") return true;
    if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
    if (cs.borderTopWidth !== "0px" || cs.borderLeftWidth !== "0px") return true;
    for (const child of el.childNodes) {
      if (child.nodeType === 3 && child.textContent.trim().length) return true;
    }
    return false;
  };

  const mark = (el) => {
    for (const r of el.getClientRects()) {
      const x0 = Math.max(0, Math.floor(r.left / CELL));
      const x1 = Math.min(cols - 1, Math.floor((r.right - 1) / CELL));
      const y0 = Math.max(0, Math.floor((r.top + window.scrollY) / CELL));
      const y1 = Math.min(rows - 1, Math.floor((r.top + window.scrollY + r.height - 1) / CELL));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) occupied[y * cols + x] = 1;
    }
  };

  const all = [...document.querySelectorAll("body *")];
  for (const el of all) {
    if (!hasInk(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (getComputedStyle(el).visibility === "hidden") continue;
    mark(el);
  }

  /* ── 1. dead bands ──────────────────────────────────────────────────── */
  const deadBands = [];
  const bandThreshold = Math.max(240, Math.round(vh * 0.5));
  let runStart = -1;
  for (let y = 0; y < rows; y++) {
    let filled = 0;
    for (let x = 0; x < cols; x++) filled += occupied[y * cols + x];
    const empty = filled / cols < 0.06;
    if (empty && runStart === -1) runStart = y;
    if ((!empty || y === rows - 1) && runStart !== -1) {
      const end = empty ? y : y - 1;
      const bandPx = (end - runStart + 1) * CELL;
      if (bandPx >= bandThreshold) {
        const top = runStart * CELL;
        const bottom = (end + 1) * CELL;
        // what actually occupies this band?
        const residents = all
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const t = r.top + window.scrollY;
            return t < bottom && t + r.height > top && r.height > 40 && r.width > 40 && hasInk(el);
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { el, h: Math.round(r.height), t: Math.round(r.top + window.scrollY) };
          })
          .sort((a, b) => b.h - a.h)
          .slice(0, 3)
          .map((x) => `${describe(x.el)}(h${x.h})`);
        const above = document.elementFromPoint(Math.floor(docWidth / 2), Math.max(0, top - 8));
        const below = document.elementFromPoint(Math.floor(docWidth / 2), Math.min(totalHeight - 2, bottom + 8));
        deadBands.push({
          top,
          height: bandPx,
          residents,
          above: describe(above),
          below: describe(below),
        });
      }
      runStart = -1;
    }
  }

  /* ── 2. orphan grid/flex rows ───────────────────────────────────────── */
  const orphans = [];
  for (const parent of all) {
    const cs = getComputedStyle(parent);
    const isGrid = cs.display.includes("grid");
    const flexRow = isRow(parent);
    if (!isGrid && !flexRow) continue;
    const kids = [...parent.children].filter((k) => {
      const r = k.getBoundingClientRect();
      return r.height > 20 && r.width > 20;
    });
    if (kids.length < 2) continue;

    const rowsMap = new Map();
    for (const k of kids) {
      const r = k.getBoundingClientRect();
      const key = Math.round((r.top + window.scrollY) / 12);
      const found = [...rowsMap.keys()].find((k2) => Math.abs(k2 - key) <= 1);
      const key2 = found !== undefined ? found : key;
      if (!rowsMap.has(key2)) rowsMap.set(key2, []);
      rowsMap.get(key2).push({ el: k, r });
    }

    for (const [, row] of rowsMap) {
      if (row.length < 2) continue;
      const rowH = Math.max(...row.map((x) => x.r.height));
      for (const item of row) {
        if (item.r.height > rowH * 0.55) continue;
        const inner = [...item.el.children].filter((c) => c.getBoundingClientRect().height > 0);
        let ink = 0;
        if (inner.length) {
          const tops = inner.map((c) => c.getBoundingClientRect().top + window.scrollY);
          const bottoms = inner.map((c) => c.getBoundingClientRect().bottom + window.scrollY);
          ink = Math.max(...bottoms) - Math.min(...tops);
        } else {
          ink = item.r.height;
        }
        const dead = item.r.height - ink;
        if (dead < 96) continue;
        orphans.push({
          parent: describe(parent),
          item: describe(item.el),
          dead: Math.round(dead),
          rowH: Math.round(rowH),
        });
      }
    }
  }

  /* ── 3. accidental wrapping (ROW-direction flex only) ───────────────── */
  const wrapped = [];
  for (const parent of all) {
    const cs = getComputedStyle(parent);
    if (cs.display !== "flex" && cs.display !== "inline-flex") continue;
    if (cs.flexDirection !== "row" && cs.flexDirection !== "row-reverse") continue;
    if (cs.flexWrap === "nowrap") continue;
    const kids = [...parent.children].filter((k) => {
      const r = k.getBoundingClientRect();
      return r.width > 8 && r.height > 4;
    });
    if (kids.length < 3) continue;
    const containerW = parent.getBoundingClientRect().width;
    const gap = parseFloat(cs.columnGap) || 0;
    const boxes = kids.map((el) => {
      const r = el.getBoundingClientRect();
      const kcs = getComputedStyle(el);
      const outer =
        r.width + (parseFloat(kcs.marginLeft) || 0) + (parseFloat(kcs.marginRight) || 0);
      return { el, r, outer, containerW };
    });
    const lines = groupLines(boxes);
    if (lines.length < 2) continue;
    const last = lines[lines.length - 1];

    // Was each break necessary? If the previous line had room for the first
    // item of the next line, the break was a choice — a defect.
    let avoidable = false;
    for (let i = 0; i < lines.length - 1; i++) {
      const { slack } = lineSlack(lines[i], gap);
      const next = lines[i + 1].items[0];
      if (slack >= next.outer + gap) avoidable = true;
    }
    // A widow: the final line holds exactly one item.
    const widow = last.items.length === 1;
    const widowAvoidable =
      widow && lines.length > 1
        ? lineSlack(lines[lines.length - 2], gap).slack >= last.items[0].outer + gap
        : false;
    const interactiveCount = kids.filter((k) => /^(a|button)$/i.test(k.tagName)).length;
    // A stranded CONTROL: an action row — a menu, a filter, a button bar —
    // whose last line holds one button while the first held several. A tag
    // list wrapping raggedly is not this; a menu that strands a link is.
    const unbalanced = widow && interactiveCount >= 2 && lines[0].items.length >= 3;
    // Related items stacked one per line, each stretched to the full width
    // of a band that could have held them side by side. The width has to
    // matter, or this is just a list in a narrow column.
    const stacked =
      lines.length >= 3 &&
      lines.every((L) => L.items.length === 1) &&
      containerW >= 600 &&
      lines[0].items[0].outer >= containerW * 0.9;

    const interactive = interactiveCount;
    wrapped.push({
      el: describe(parent),
      lines: lines.length,
      kids: kids.length,
      interactive,
      widow,
      avoidable: avoidable || widowAvoidable,
      unbalanced,
      stacked,
      widths: lines.map((L) => L.items.length),
      containerW: Math.round(containerW),
      children: kids.map((k) => {
        const r = k.getBoundingClientRect();
        return {
          text: (k.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      }),
    });
  }

  /* ── 4. clipped text ────────────────────────────────────────────────── */
  const clipped = [];
  for (const el of all) {
    if (el.children.length) continue;
    const text = (el.textContent || "").trim();
    if (!text) continue;
    if (el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1) continue;
    const cs = getComputedStyle(el);
    // the 1px visually-hidden pattern is deliberate, not a clipping bug
    if (cs.overflow === "visible" || cs.overflowY === "visible") continue;
    if (cs.textOverflow === "ellipsis") continue;
    if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") continue;
    if (cs.clipPath && cs.clipPath !== "none") continue;
    if (el.clientWidth <= 2 && el.clientHeight <= 2) continue;
    clipped.push({
      el: describe(el),
      text: text.slice(0, 40),
      sw: el.scrollWidth,
      cw: el.clientWidth,
      sh: el.scrollHeight,
      ch: el.clientHeight,
    });
  }

  /* ── 5. scattered actions (ROW-direction flex only) ──────────────────── */
  const scattered = [];
  for (const parent of all) {
    if (!isRow(parent)) continue;
    const actions = [...parent.children].filter((k) => /^(button|a)$/i.test(k.tagName) && k.getBoundingClientRect().width > 4);
    if (actions.length < 2) continue;
    const cs = getComputedStyle(parent);
    const containerW = parent.getBoundingClientRect().width;
    const gap = parseFloat(cs.columnGap) || 0;
    const rects = actions.map((k) => k.getBoundingClientRect());
    const boxes = actions.map((el, i) => {
      const kcs = getComputedStyle(el);
      return {
        el,
        r: rects[i],
        outer: rects[i].width + (parseFloat(kcs.marginLeft) || 0) + (parseFloat(kcs.marginRight) || 0),
        containerW,
      };
    });
    const lines = groupLines(boxes);
    const detail = {
      containerW: Math.round(containerW),
      children: actions.map((k) => ({
        text: (k.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22),
        w: Math.round(k.getBoundingClientRect().width),
        h: Math.round(k.getBoundingClientRect().height),
      })),
    };
    if (lines.length > 1) {
      let avoidable = false;
      for (let i = 0; i < lines.length - 1; i++) {
        const { slack } = lineSlack(lines[i], gap);
        if (slack >= lines[i + 1].items[0].outer + gap) avoidable = true;
      }
      scattered.push({
        el: describe(parent),
        actions: actions.length,
        lines: lines.length,
        kind: "split",
        avoidable,
        ...detail,
      });
      continue;
    }
    // same line: are they pushed apart to opposite edges?
    const sorted = [...rects].sort((a, b) => a.left - b.left);
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) gaps.push(Math.round(sorted[i].left - sorted[i - 1].right));
    const maxGap = Math.max(...gaps);
    const median = [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)];
    if (gaps.length >= 1 && maxGap > 96 && maxGap > Math.max(3 * median, 96)) {
      scattered.push({ el: describe(parent), actions: actions.length, lines: 1, kind: "edges", maxGap, median });
    }
  }

  /* ── 6. false hierarchy ─────────────────────────────────────────────── */
  const hierarchy = [];
  // 6a. emphasis modifiers that change nothing visible
  const EMPHASIS = /--(active|selected|featured|primary|current|open|highlight)(\b|$)/;
  const VISUAL_KEYS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderRightColor",
    "borderTopWidth",
    "borderBottomWidth",
    "fontSize",
    "fontWeight",
    "letterSpacing",
    "opacity",
    "boxShadow",
    "textDecorationLine",
  ];
  const visualSignature = (el) => {
    const cs = getComputedStyle(el);
    return VISUAL_KEYS.map((k) => cs[k]).join("|");
  };
  const seenModifier = new Set();
  for (const el of all) {
    const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "");
    const m = cls.match(EMPHASIS);
    if (!m) continue;
    const key = cls + "|" + describe(el);
    if (seenModifier.has(key)) continue;
    seenModifier.add(key);
    const parent = el.parentElement;
    if (!parent) continue;
    const sibs = [...parent.children].filter((s) => s !== el && s.getBoundingClientRect().width > 4);
    if (sibs.length < 1) continue;
    const mine = visualSignature(el);
    const identical = sibs.every((s) => visualSignature(s) === mine);
    if (identical) {
      hierarchy.push({
        kind: "invisible-modifier",
        el: describe(el),
        modifier: m[1],
        siblings: sibs.length,
      });
    }
  }
  // 6b. skipped heading levels
  const heads = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6, h1, h2, h3, h4, h5, h6")];
  const h1s = heads.filter((h) => h.tagName === "H1");
  if (h1s.length > 1) hierarchy.push({ kind: "multiple-h1", count: h1s.length });
  let prevLevel = null;
  for (const h of heads) {
    const level = Number(h.tagName[1]);
    if (prevLevel !== null && level > prevLevel + 1) {
      hierarchy.push({ kind: "skipped-level", from: `h${prevLevel}`, to: `h${level}`, el: describe(h) });
    }
    prevLevel = level;
  }

  /* ── 7. spatially expensive information ─────────────────────────────── */
  const h1 = document.querySelector("main h1") || document.querySelector("h1");
  // An *action* is a control, not a prose link: it must render as something
  // the reader can push (a fill, a border, a button). A link buried in a
  // paragraph is reading, not a decision, and costs no scroll.
  const looksLikeControl = (el) => {
    const cs = getComputedStyle(el);
    const filled = cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent";
    const bordered = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderBottomWidth) > 0;
    const buttonish = el.tagName === "BUTTON" || el.getAttribute("role") === "button";
    return filled || bordered || buttonish;
  };
  // The page's own first control. The masthead's search is chrome, not a
  // decision the page offers, so it is excluded; the page hero is not.
  const firstAction = [...document.querySelectorAll("a[href], button")].find(
    (el) =>
      !el.closest(".site-masthead, .mh-inner, .mh-panel, .site-footer, nav") &&
      el.getBoundingClientRect().width > 8 &&
      el.getBoundingClientRect().height > 8 &&
      visible(el) &&
      looksLikeControl(el),
  );
  const heroTop = h1 ? Math.round(h1.getBoundingClientRect().top + window.scrollY) : null;
  const actionTop = firstAction ? Math.round(firstAction.getBoundingClientRect().top + window.scrollY) : null;
  const expensive = [];
  if (heroTop !== null && heroTop > vh * 0.6) {
    expensive.push({ kind: "h1-below-fold", at: heroTop, viewport: vh });
  }
  if (actionTop !== null && actionTop > vh * 1.25) {
    expensive.push({ kind: "first-action-below-fold", at: actionTop, viewport: vh });
  }

  return {
    totalHeight,
    docWidth,
    viewport: vh,
    deadBands: deadBands.slice(0, 8),
    orphans: orphans.slice(0, 10),
    wrapped: wrapped.slice(0, 10),
    clipped: clipped.slice(0, 8),
    scattered: scattered.slice(0, 8),
    hierarchy: hierarchy.slice(0, 8),
    expensive,
    heroTop,
    actionTop,
    screens: +(totalHeight / vh).toFixed(1),
  };
};

const oldServer = LIVE ? null : await serve(path.resolve("dist"), 8802);
const base = LIVE ?? "http://localhost:8802";

const widths = DENSE ? DENSE_WIDTHS : WIDTHS;

const jobs = [];
for (const width of widths) {
  if (ONLY_WIDTH && width !== ONLY_WIDTH) continue;
  for (const route of ROUTES) {
    if (ONLY_ROUTE && route !== ONLY_ROUTE) continue;
    jobs.push({ route, width });
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: widths[0], height: 900 } });

const results = [];
let hard = 0;
let soft = 0;

/**
 * One page, one width, one route. The measurement is the same at every
 * width — that is the point of the dense ladder: a hole that only appears
 * at 561px is a hole, and three widths would never have found it.
 */
const measure = async (job) => {
  const { route, width } = job;
  const page = await context.newPage();
  try {
        await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const a = await page.evaluate(AUDIT);

    // A wrap is a DEFECT only when it was avoidable — when the line above
    // had room for the item that dropped — or when it left an orphan: a
    // widow after a line of three or more, or one related item per line.
    // A wrap the width forced (a tag list, a chip row on a phone) is the
    // layout working.
    const badWraps = a.wrapped.filter((w) => w.avoidable || w.unbalanced || w.stacked);
    const okWraps = a.wrapped.filter((w) => !w.avoidable);
    const splits = a.scattered.filter((s) => s.kind === "split");
    const badSplits = splits.filter((s) => s.avoidable);
    const okSplits = splits.filter((s) => !s.avoidable);
    const edges = a.scattered.filter((s) => s.kind === "edges");
    const foldCost = a.expensive.filter((e) => e.kind === "h1-below-fold");
    const deepCost = a.expensive.filter((e) => e.kind === "first-action-below-fold");

    const hardCount =
      a.deadBands.length + a.orphans.length + a.clipped.length + a.hierarchy.length + foldCost.length + badWraps.length + badSplits.length;
    const softCount = okWraps.length + okSplits.length + edges.length + deepCost.length;
    hard += hardCount;
    soft += softCount;
    results.push({ route, width, ...a, hardCount, softCount });

    if (!AS_JSON) {
      const mark = hardCount ? "!!" : softCount ? " ~ " : "ok";
      console.log(
        `\n${mark} ${route} @${width}  height=${a.totalHeight}px (${a.screens} screens)  ` +
          `h1@${a.heroTop} action@${a.actionTop}  ` +
          `dead=${a.deadBands.length} orphan=${a.orphans.length} clip=${a.clipped.length} hier=${a.hierarchy.length} ` +
          `badWrap=${badWraps.length} badSplit=${badSplits.length} | soft wrap=${okWraps.length} split=${okSplits.length} edges=${edges.length} cost=${deepCost.length}`,
      );
      for (const d of a.deadBands) {
        console.log(`     DEAD    ${d.height}px at ${d.top}  between "${d.above}" and "${d.below}"`);
        if (d.residents.length) console.log(`             residents: ${d.residents.join(", ")}`);
      }
      for (const o of a.orphans) console.log(`     ORPHAN  ${o.dead}px empty in ${o.item} (row ${o.rowH}px) in ${o.parent}`);
      for (const w of badWraps) {
        const why = w.avoidable ? "with room to spare" : w.unbalanced ? "unbalanced — last line holds 1 of many" : "one item per line";
        console.log(`     WRAP    ${w.el} breaks into ${w.lines} lines ${why} (${w.kids} children, container ${w.containerW}px)`);
        console.log(`             ${w.children.map((c) => `${c.w}px "${c.text}"`).join("  |  ")}`);
      }
      for (const w of okWraps) {
        console.log(
          `     wrap    ${w.el} wraps into ${w.lines} lines (${w.kids} children, ${w.interactive} interactive, container ${w.containerW}px)` +
            (w.widow ? " — forced widow" : ""),
        );
      }
      for (const c of a.clipped) console.log(`     CLIP    ${c.el} "${c.text}" ${c.sw}x${c.sh} in ${c.cw}x${c.ch}`);
      for (const s of badSplits) {
        console.log(`     SPLIT   ${s.el} has ${s.actions} actions across ${s.lines} lines with room to spare (container ${s.containerW}px)`);
        console.log(`             ${s.children.map((c) => `${c.w}px "${c.text}"`).join("  |  ")}`);
      }
      for (const s of okSplits) console.log(`     split   ${s.el} has ${s.actions} actions across ${s.lines} lines (forced, container ${s.containerW}px)`);
      for (const s of edges) console.log(`     EDGES   ${s.el} has ${s.actions} actions with a ${s.maxGap}px gap (median ${s.median}px)`);
      for (const h of a.hierarchy) console.log(`     HIER    ${h.kind} ${h.el || ""} ${h.modifier || ""} ${h.from || ""}${h.to || ""}`);
      for (const e of a.expensive) console.log(`     COST    ${e.kind} at ${e.at}px (viewport ${e.viewport}px)`);
    }
  } finally {
    await page.close();
  }
};

/*
 * The pages are measured in parallel — a dense ladder is 1,215 page loads,
 * and one at a time that is half an hour of waiting for an answer. Six at a
 * time keeps the machine busy without starving it.
 */
const pool = [];
const workers = Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
  while (pool.length) {
    const job = pool.shift();
    if (!job) return;
    await measure(job);
  }
});
for (const job of jobs) pool.push(job);
await Promise.all(workers);

await browser.close();
if (oldServer) oldServer.close();

/**
 * A fingerprint of every finding, so a gate can tell "the known set" from
 * "something new".
 *
 *   dead:    how many dead bands
 *   orphan:  how many padded-out grid items
 *   clip:    how many clipped texts
 *   hier:    heading-level defects
 *   cost:    content pushed below the fold
 *   wrap:    TOTAL LINES a selector wraps into across the site — so a wrap
 *            that gets worse fails, even though its count is unchanged
 *   scatter: TOTAL LINES the actions of a selector are split across
 */
const fingerprint = (results) => {
  const fp = {};
  const bump = (key, by = 1) => {
    fp[key] = (fp[key] || 0) + by;
  };
  for (const r of results) {
    for (const d of r.deadBands) bump(`dead:${d.above}`);
    for (const o of r.orphans) bump(`orphan:${o.parent}`);
    for (const c of r.clipped) bump(`clip:${c.el}`);
    for (const h of r.hierarchy) bump(`hier:${h.kind}:${h.el || ""}`);
    for (const e of r.expensive) bump(`cost:${e.kind}`);
    for (const w of r.wrapped) bump(`wrap:${w.el}`, w.lines);
    for (const s of r.scattered) bump(`scatter:${s.el}`, s.lines);
  }
  return Object.fromEntries(Object.entries(fp).sort(([a], [b]) => a.localeCompare(b)));
};

if (AS_JSON) {
  console.log(JSON.stringify({ results, hard, soft, fingerprint: fingerprint(results) }, null, 2));
} else {
  console.log(`\n=== ${hard} hard finding(s), ${soft} soft ===`);
}

if (WRITE_BASELINE) {
  const fs = await import("node:fs");
  if (hard > 0) {
    console.error(`\n✗ refusing to write a baseline with ${hard} hard finding(s).`);
    console.error("  A baseline is a record of what the layout already tolerates. Fix the");
    console.error("  layout first, then write the baseline for what is left.");
    process.exit(1);
  }
  const now = fingerprint(results);
  fs.writeFileSync(WRITE_BASELINE, `${JSON.stringify(now, null, 2)}\n`);
  console.log(`\n✓ wrote baseline → ${WRITE_BASELINE} (${Object.keys(now).length} signature(s))`);
}

if (BASELINE) {
  const fs = await import("node:fs");
  const base = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  const now = fingerprint(results);
  const violations = [];
  const improved = [];
  for (const [key, count] of Object.entries(now)) {
    const allowed = base[key] ?? 0;
    if (count > allowed) violations.push(`${key}: ${count} now, ${allowed} allowed — got worse`);
    else if (count < allowed) improved.push(`${key}: ${count} now, ${allowed} allowed — improved`);
  }
  for (const [key, allowed] of Object.entries(base)) {
    if (!(key in now)) improved.push(`${key}: gone — drop it from the baseline`);
  }
  if (violations.length) {
    console.error(`\n✗ spatial gate failed (${violations.length} violation(s)):`);
    for (const v of violations) console.error(`   ${v}`);
    process.exit(1);
  }
  console.log(`\n✓ spatial gate passed — ${Object.keys(now).length} known finding signature(s) within baseline.`);
  if (improved.length) {
    console.log(`  (${improved.length} signature(s) improved — the baseline can be tightened)`);
    for (const i of improved) console.log(`   ${i}`);
  }
}

if (STRICT && hard + soft > 0) process.exit(1);
