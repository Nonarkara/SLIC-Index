#!/usr/bin/env node
/**
 * Void and fat-box finder (MSH tells 2, 3, 4 measured on rendered pixels).
 *
 *  - VOID: a horizontal band of the document, taller than --min px (default 96),
 *    that crosses no text, image, svg, canvas, control or rule. Reported with
 *    the two things that bound it, because the repair is at the boundary.
 *  - FAT:  a visible box (border or background) whose area is more than 3x the
 *    area of the text it holds. A box is its label plus padding.
 *
 * Usage: node scripts/probe-voids.mjs [--route /x] [--width 390] [--min 96] [--url base]
 */
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright-core";

const arg = (n, d) => { const i = process.argv.indexOf(n); return i === -1 ? d : process.argv[i + 1]; };
const ROUTES = arg("--route") ? [arg("--route")] : ["/","/rankings","/methodology","/data","/thailand","/essay","/ideas","/compare","/side-by-side","/history","/map","/city/th-bangkok","/about-slic","/awards","/traffic"];
const WIDTHS = arg("--width") ? [Number(arg("--width"))] : [1440, 390];
const MIN = Number(arg("--min", 96));
const LIVE = arg("--url");

function serve(dir, port) {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split("?")[0]);
      let f = path.join(dir, url);
      if (!f.startsWith(dir)) return res.writeHead(403).end();
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
      if (!fs.existsSync(f)) f = path.join(dir, "index.html");
      const e = path.extname(f);
      res.writeHead(200, { "content-type": e === ".css" ? "text/css" : e === ".js" ? "text/javascript" : e === ".html" ? "text/html" : e === ".json" ? "application/json" : "application/octet-stream" });
      res.end(fs.readFileSync(f));
    });
    s.listen(port, () => resolve(s));
  });
}

const PROBE = (MIN) => {
  const W = innerWidth, H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  const label = (el) => {
    if (!el) return "(page edge)";
    const t = (el.innerText || el.getAttribute?.("alt") || "").replace(/\s+/g, " ").trim().slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : ""}${t ? ` "${t}"` : ""}`;
  };
  // 1. ink rectangles
  const ink = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const p = n.parentElement;
    if (!p || /SCRIPT|STYLE/.test(p.tagName)) continue;
    const cs = getComputedStyle(p);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.height > 0 && b.width > 0) ink.push({ top: b.top + scrollY, bottom: b.bottom + scrollY, el: p });
  }
  for (const el of document.querySelectorAll("img,svg,canvas,video,input,select,textarea,button,iframe,hr")) {
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
    const b = el.getBoundingClientRect(); if (b.height < 1 || b.width < 1) continue;
    ink.push({ top: b.top + scrollY, bottom: b.bottom + scrollY, el });
  }
  // elements painting a border or background are ink too (rules, filled bars)
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    const b = el.getBoundingClientRect(); if (b.height < 1 || b.width < 1) continue;
    const bg = cs.backgroundColor, hasBg = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    const hasBorder = ["Top","Bottom"].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none");
    if ((hasBg && b.height < 24) || hasBorder && b.height < 2) ink.push({ top: b.top + scrollY, bottom: b.bottom + scrollY, el });
    if (cs.backgroundImage !== "none" && b.height >= 24) ink.push({ top: b.top + scrollY, bottom: b.bottom + scrollY, el });
  }
  ink.sort((a, b) => a.top - b.top);
  const voids = [];
  let reach = 0, reachEl = null;
  for (const r of ink) {
    if (r.top - reach >= MIN) voids.push({ y: Math.round(reach), h: Math.round(r.top - reach), above: label(reachEl), below: label(r.el) });
    if (r.bottom > reach) { reach = r.bottom; reachEl = r.el; }
  }
  if (H - reach >= MIN) voids.push({ y: Math.round(reach), h: Math.round(H - reach), above: label(reachEl), below: "(page end)" });

  // 2. fat boxes
  const fat = [];
  for (const el of document.querySelectorAll("a,button,li,span,div,summary,label,td,th,p,h1,h2,h3,h4")) {
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    const bg = cs.backgroundColor, hasBg = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    const hasBorder = ["Top","Right","Bottom","Left"].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none");
    if (!hasBg && !hasBorder) continue;
    const b = el.getBoundingClientRect(); if (b.width < 20 || b.height < 16 || b.width > W - 1) continue;
    const r = document.createRange(); r.selectNodeContents(el);
    const rects = [...r.getClientRects()].filter((q) => q.width > 0);
    if (!rects.length) continue;
    const l = Math.min(...rects.map((q) => q.left)), t = Math.min(...rects.map((q) => q.top)), rr = Math.max(...rects.map((q) => q.right)), bb = Math.max(...rects.map((q) => q.bottom));
    const inkA = (rr - l) * (bb - t); if (inkA < 50) continue;
    const boxA = b.width * b.height, ratio = boxA / inkA;
    if (ratio > 3 && b.height > 28) fat.push({ ratio: Number(ratio.toFixed(1)), w: Math.round(b.width), h: Math.round(b.height), inkW: Math.round(rr - l), inkH: Math.round(bb - t), y: Math.round(b.top + scrollY), el: label(el) });
  }
  fat.sort((a, b) => b.ratio * b.h - a.ratio * a.h);
  return { H, voids, fat: fat.slice(0, 8) };
};

const server = LIVE ? null : await serve(path.resolve("dist"), 8803);
const base = LIVE ?? "http://localhost:8803";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/*", (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
const page = await ctx.newPage();
let totalVoid = 0;
for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: w < 600 ? 844 : 900 });
  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".page-shell, #root", { timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(700);
    const r = await page.evaluate(PROBE, MIN);
    const vs = r.voids.reduce((a, v) => a + v.h, 0); totalVoid += vs;
    console.log(`\n${route} @${w}  height ${r.H}  void ${vs}px (${(vs / r.H * 100).toFixed(0)}%)  fat ${r.fat.length}`);
    for (const v of r.voids.slice(0, 6)) console.log(`   VOID ${String(v.h).padStart(4)}px @${v.y}  ${v.above}  ↓  ${v.below}`);
    for (const f of r.fat.slice(0, 5)) console.log(`   FAT  ${f.ratio}x  ${f.w}x${f.h} holds ${f.inkW}x${f.inkH} @${f.y}  ${f.el}`);
  }
}
console.log(`\nTOTAL void px across run: ${totalVoid}`);
await browser.close(); server?.close();
