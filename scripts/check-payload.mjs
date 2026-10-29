#!/usr/bin/env node
/**
 * The payload gate.
 *
 * A page can be beautiful, correct, accessible and still be unshippable: the
 * reader pays megabytes before the first pixel of content. This measures what
 * the reader actually pays and refuses three ways of overcharging them:
 *
 *   1. OVERSAMPLED IMAGES. An image painted into a 240px box from a 1600px
 *      file is four times the pixels the screen can show, and the reader pays
 *      for every one of them. The rule: a loaded image may be at most three
 *      times the width of the box it is painted into.
 *
 *   2. A ROUTE THAT COSTS TOO MUCH. The budget is the first load of a route,
 *      measured in transferred bytes: the shell, the code, the data and the
 *      images a reader pays for before they can read the page.
 *
 *   3. A SHELL THAT CARRIES THE ARGUMENT. The site is one application, and
 *      the entry graph is on every route. A chunk in the shell's preload list
 *      is a chunk every reader downloads whether or not the page they opened
 *      needs it — the 1.9 MB city dataset was there for a year.
 *
 *   4. A FONT STYLESHEET FOR THE WRONG SCRIPT. The CJK families are 1.29 MB
 *      of unicode-range rules. A reader must not download a script they are
 *      not reading, and a reader must be given a web font at all.
 *
 * Usage:
 *   node scripts/check-payload.mjs
 *   node scripts/check-payload.mjs --url https://slic.nonarkara.org
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import worker from "../public/_worker.js";

const urlArg = process.argv.indexOf("--url");
const LIVE = urlArg !== -1 ? process.argv[process.argv.indexOf("--url") + 1] : null;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DIST = path.join(ROOT, "dist");

/* The rules, as numbers, so a decision can be changed in one place. */
const MAX_OVERSAMPLE = 3; // times the rendered width
const ROUTE_BUDGET_KB = 1200; // transferred bytes on the first load
const MAX_PRELOAD_KB = 300; // a chunk the shell preloads
const MAX_FONT_KB = 80; // the font stylesheet for the reader's locale

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
  "/exercise",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
};

const findings = [];
const add = (severity, title, detail) => findings.push({ severity, title, detail });

function makeAssets(dir) {
  return {
    async fetch(request) {
      const url = new URL(request.url);
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith("/")) rel += "index.html";
      const file = path.join(dir, rel);
      if (!file.startsWith(dir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        return new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
      }
      const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
      const body = fs.readFileSync(file);
      const headers = { "content-type": type };
      if (rel.startsWith("/assets/")) headers["cache-control"] = "public, max-age=31536000, immutable";
      return new Response(body, { status: 200, headers });
    },
  };
}

async function serveEdge(dir, port) {
  const env = { ASSETS: makeAssets(dir) };
  const server = http.createServer(async (req, res) => {
    try {
      const response = await worker.fetch(
        new Request(new URL(req.url, "http://localhost"), { method: req.method, headers: req.headers }),
        env,
        {},
      );
      const headers = Object.fromEntries(response.headers.entries());
      const type = headers["content-type"] ?? "";
      const compressible = /text\/|json|javascript|xml|svg/.test(type);
      const accepts = String(req.headers["accept-encoding"] ?? "").includes("gzip");
      let body = Buffer.from(await response.arrayBuffer());
      if (compressible && accepts && body.length > 512) {
        body = zlib.gzipSync(body, { level: 6 });
        headers["content-encoding"] = "gzip";
        headers["content-length"] = String(body.length);
      }
      res.writeHead(response.status, headers);
      res.end(body);
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(String(error));
    }
  });
  await new Promise((resolve) => server.listen(port, resolve));
  return server;
}

/**
 * The shell's preload list, in bytes. A chunk here is a chunk every reader
 * downloads on every route, so its size is a decision, not a detail.
 */
function auditShellPreload() {
  const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  const preloads = [...html.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  if (!preloads.length) {
    add("blocker", "the shell preloads nothing", "A shell with no preload makes every route wait for a second round trip.");
    return;
  }
  for (const href of preloads) {
    const file = path.join(DIST, href.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      add("blocker", `the shell preloads ${href}, which does not exist`, "A preload that 404s is a request a reader pays for.");
      continue;
    }
    const kb = fs.statSync(file).size / 1024;
    if (kb > MAX_PRELOAD_KB) {
      add(
        "blocker",
        `the shell preloads ${path.basename(href)} (${kb.toFixed(0)}kB)`,
        `Every route downloads this before it can render. The limit is ${MAX_PRELOAD_KB}kB — a chunk this size belongs to the route that needs it, not to the shell.`,
      );
    }
  }
  return preloads;
}

const PROBE = () => {
  const entries = performance.getEntriesByType("resource");
  const nav = performance.getEntriesByType("navigation")[0];
  const bytes = entries.reduce((sum, e) => sum + (e.transferSize || e.encodedBodySize || 0), 0) + (nav?.transferSize || 0);
  const fonts = entries.filter((e) => /fonts\.googleapis\.com/.test(e.name));
  const fontBytes = fonts.reduce((sum, e) => sum + (e.transferSize || e.encodedBodySize || 0), 0);
  const fontUrls = fonts.map((e) => e.name);
  return {
    bytes,
    requests: entries.length + 1,
    fontBytes,
    fontUrls,
    images: [...document.images]
      .filter((i) => i.complete && i.naturalWidth > 0)
      .map((i) => {
        const r = i.getBoundingClientRect();
        return {
          src: (i.currentSrc || i.src).replace(location.origin, ""),
          rendered: Math.round(r.width),
          natural: i.naturalWidth,
          bytes: performance.getEntriesByName(i.currentSrc || i.src).reduce((s, e) => s + (e.transferSize || 0), 0),
        };
      }),
  };
};

async function auditRoutes(browser, base) {
  const costs = [];
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    try {
      await page.goto(base + route, { waitUntil: "load", timeout: 90000 });
      await page.waitForSelector("h1", { timeout: 60000 });
      await page.waitForTimeout(900);
      const p = await page.evaluate(PROBE);

      for (const img of p.images) {
        if (!img.rendered) continue;
        const ratio = img.natural / img.rendered;
        if (ratio > MAX_OVERSAMPLE) {
          add(
            "blocker",
            `${route} paints ${img.src} into ${img.rendered}px from a ${img.natural}px file`,
            `That is ${ratio.toFixed(1)}× oversampled — ${(img.bytes / 1024).toFixed(0)}kB for ${img.rendered} pixels of picture. The limit is ${MAX_OVERSAMPLE}×.`,
          );
        }
      }

      const kb = p.bytes / 1024;
      costs.push({ route, kb, requests: p.requests });
      if (kb > ROUTE_BUDGET_KB) {
        add(
          "blocker",
          `${route} costs ${kb.toFixed(0)}kB on the first load`,
          `The budget is ${ROUTE_BUDGET_KB}kB across ${p.requests} requests. A reader on a train pays all of it before the page is useful.`,
        );
      }

      if (route === "/") {
        if (!p.fontUrls.length) {
          add("blocker", "no web font stylesheet was requested", "The display face fell back to the system stack — the type the site is drawn with is missing.");
        } else {
          if (p.fontBytes / 1024 > MAX_FONT_KB) {
            add(
              "blocker",
              `the font stylesheet costs ${(p.fontBytes / 1024).toFixed(0)}kB`,
              `The limit is ${MAX_FONT_KB}kB for a reader's own script. The request was: ${p.fontUrls[0].slice(0, 160)}`,
            );
          }
          for (const url of p.fontUrls) {
            for (const family of ["Noto+Sans+SC", "Noto+Sans+KR", "Noto+Sans+JP"]) {
              if (url.includes(family)) {
                add(
                  "blocker",
                  `the default font request carries ${family}`,
                  "A reader downloads the unicode-range rules of a script they are not reading — 1.29 MB of stylesheet for three Han fonts. The CJK family belongs to the locale that reads it.",
                );
              }
            }
          }
        }
      }
    } catch (error) {
      add("blocker", `${route} did not load`, String(error.message || error).slice(0, 200));
    }
    await context.close();
  }
  return costs;
}

async function launchBrowser(attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await chromium.launch({ timeout: 120000 });
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw lastError;
}

let server = null;
let browser = null;
try {
  const preloads = auditShellPreload();
  console.log(`\n  shell preloads ${preloads.length} chunk(s): ${preloads.map((p) => path.basename(p)).join(", ")}`);

  let base = LIVE;
  if (!LIVE) {
    const port = 4182;
    server = await serveEdge(DIST, port);
    base = `http://localhost:${port}`;
    console.log(`  serving the build through the edge worker at ${base}`);
  } else {
    console.log(`  auditing the deployed site at ${base}`);
  }

  browser = await launchBrowser();
  const costs = await auditRoutes(browser, base);

  console.log("\n  first load, transferred bytes:");
  for (const c of [...costs].sort((a, b) => b.kb - a.kb)) {
    console.log(`    ${c.route.padEnd(22)} ${c.kb.toFixed(0).padStart(5)}kB  ${String(c.requests).padStart(3)} requests`);
  }
} finally {
  await browser?.close().catch(() => {});
  server?.close();
}

const blockers = findings.filter((f) => f.severity === "blocker");
const warnings = findings.filter((f) => f.severity !== "blocker");

console.log("");
for (const f of findings) {
  console.log(`  ${f.severity.toUpperCase()}  ${f.title}`);
  console.log(`        ${f.detail}`);
}
console.log(`\n=== ${blockers.length} blocker(s), ${warnings.length} warning(s) ===`);
if (blockers.length) {
  console.log("PAYLOAD AUDIT FAILED — the reader is paying for pixels they cannot see.");
  process.exit(1);
}
console.log("PAYLOAD AUDIT PASSED — every route costs what it shows.");
