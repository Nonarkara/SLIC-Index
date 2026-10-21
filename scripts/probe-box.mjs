#!/usr/bin/env node
/**
 * Dump the box geometry of a selector.
 *   node scripts/probe-box.mjs / --widths 1024 --selector .hp-verdict-p
 * Same harness as shoot-pages.mjs (which is known to work), different payload.
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
const widths = flag("widths", "1440").split(",").map(Number);
const selector = flag("selector", null);
const scrollY = Number(flag("scroll", "0"));
const band = flag("band", null);
const at = flag("at", null);
const tree = flag("tree", null);

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

const PORT = 8800 + Math.floor(Math.random() * 90);
const server = await serve(path.resolve("dist"), PORT);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: widths[0], height: 900 } });
const page = await context.newPage();

for (const width of widths) {
  await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
  for (const route of routes) {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1200);
    if (scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(400);
    }
    const out = await page.evaluate((selector) => {
      const desc = (el) => {
        const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "")
          .replace(/\s+/g, ".")
          .trim();
        return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`.slice(0, 60);
      };
      const dump = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          el: desc(el),
          x: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top + window.scrollY),
          display: cs.display,
          width: cs.width,
          maxWidth: cs.maxWidth,
          float: cs.float,
          position: cs.position,
          gridCols: cs.gridTemplateColumns,
          writingMode: cs.writingMode,
          wordSpacing: cs.wordSpacing,
          letterSpacing: cs.letterSpacing,
        };
      };
      const sel = [...document.querySelectorAll(selector)];
      return {
        count: sel.length,
        self: dump(document.documentElement),
        nodes: sel.slice(0, 6).map((el) => {
          const chain = [];
          let p = el.parentElement;
          for (let i = 0; i < 4 && p; i++, p = p.parentElement) chain.push(dump(p));
          return { node: dump(el), chain };
        }),
      };
    }, selector);

    // Tree mode: the child nodes of a selector, with their boxes, so a stray
    // text node or an unpositioned child is visible.
    if (tree) {
      const dump = await page.evaluate((tree) => {
        const el = document.querySelector(tree);
        if (!el) return { error: "not found" };
        const walk = (node, depth) => {
          const lines = [];
          for (const n of node.childNodes) {
            if (n.nodeType === 3) {
              const t = n.textContent.replace(/\s+/g, " ").trim();
              if (t) lines.push(`${"  ".repeat(depth)}#text(${t.length}) "${t.slice(0, 80)}"`);
            } else {
              const r = n.getBoundingClientRect();
              const cs = getComputedStyle(n);
              const cls = n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className;
              lines.push(
                `${"  ".repeat(depth)}<${n.tagName.toLowerCase()} class="${cls}"> x=${Math.round(r.left)} w=${Math.round(r.width)} h=${Math.round(r.height)} top=${Math.round(r.top + window.scrollY)} disp=${cs.display} pos=${cs.position}`,
              );
              if (depth < 3) lines.push(...walk(n, depth + 1));
            }
          }
          return lines;
        };
        return { error: null, lines: walk(el, 0) };
      }, tree);
      console.log(`\n--- tree ${tree} on ${route} @${width} ---`);
      if (dump.error) console.log(` ${dump.error}`);
      else console.log(dump.lines.join("\n"));
    }

    // Point mode: what is actually painted at a viewport coordinate?
    if (at) {
      const stack = await page.evaluate((at) => {
        const [x, y] = at.split(",").map(Number);
        const desc = (el) => {
          const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "")
            .replace(/\s+/g, ".")
            .trim();
          return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`.slice(0, 60);
        };
        return document.elementsFromPoint(x, y).map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            el: desc(el),
            x: Math.round(r.left),
            w: Math.round(r.width),
            h: Math.round(r.height),
            vtop: Math.round(r.top),
            position: cs.position,
            display: cs.display,
            writingMode: cs.writingMode,
            overflow: cs.overflow,
            text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 50),
          };
        });
      }, at);
      console.log(`\n--- elementsFromPoint ${at} on ${route} @${width} (scrollY=${scrollY}) ---`);
      for (const s of stack) {
        console.log(` ${s.el.padEnd(52)} vtop=${String(s.vtop).padStart(5)} ${String(s.w).padStart(5)}x${String(s.h).padStart(5)} pos=${s.position.padEnd(8)} disp=${s.display.padEnd(8)} wm=${s.writingMode} ovf=${s.overflow}`);
        console.log(`   "${s.text}"`);
      }
    }

    // Band mode: everything that intersects a y-range, so an empty-looking
    // strip can be traced back to the element that owns it.
    if (band) {
      const hits = await page.evaluate((band) => {
        const desc = (el) => {
          const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "")
            .replace(/\s+/g, ".")
            .trim();
          return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`.slice(0, 64);
        };
        const [from, to] = band.split(":").map(Number);
        const rows = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          const top = r.top + window.scrollY;
          if (top + r.height < from || top > to) continue;
          if (r.height < 6 || r.width < 6) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") continue;
          const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
          rows.push({
            el: desc(el),
            x: Math.round(r.left),
            w: Math.round(r.width),
            h: Math.round(r.height),
            top: Math.round(top),
            display: cs.display,
            overflow: cs.overflow,
            text,
          });
        }
        rows.sort((a, b) => a.top - b.top || b.h - a.h);
        return rows.slice(0, 50);
      }, band);
      console.log(`\n--- band ${band} on ${route} @${width} ---`);
      for (const r of hits) {
        console.log(` ${String(r.top).padStart(6)} x=${String(r.x).padStart(5)} ${String(r.w).padStart(5)}x${String(r.h).padStart(5)} ${r.display.padEnd(8)} ${r.el}  "${r.text}"`);
      }
    }
    console.log(`\n=== ${route} @${width}  ${selector}  (${out.count} found) ===`);
    console.log(` html: w=${out.self.w} display=${out.self.display}`);
    for (const n of out.nodes) {
      console.log(` ${n.node.el.padEnd(52)} x=${String(n.node.x).padStart(5)} w=${String(n.node.w).padStart(5)} h=${String(n.node.h).padStart(5)} top=${n.node.top}`);
      console.log(`   display=${n.node.display} width=${n.node.width} maxWidth=${n.node.maxWidth} float=${n.node.float} pos=${n.node.position} cols=${n.node.gridCols} wm=${n.node.writingMode} ls=${n.node.letterSpacing}`);
      for (const c of n.chain) {
        console.log(`   ↑ ${c.el.padEnd(50)} x=${String(c.x).padStart(5)} w=${String(c.w).padStart(5)} display=${c.display} maxWidth=${c.maxWidth} cols=${c.gridCols}`);
      }
    }
  }
}

await browser.close();
server.close();
process.exit(0);
