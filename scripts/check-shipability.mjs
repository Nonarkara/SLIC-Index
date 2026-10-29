#!/usr/bin/env node
/**
 * Shipability audit.
 *
 * Every other gate in this repo checks content, layout, colour or numbers.
 * None of them checks the thing a reader meets first: does the page arrive,
 * and is it a page? A site can pass all of them and still be unshippable —
 * the routes can 404 at the edge, the app can boot into a skeleton, a locale
 * can ship empty, the display face can arrive after the first paint.
 *
 * So this one runs the built site through the REAL edge worker
 * (public/_worker.js) with an asset binding that behaves the way Cloudflare's
 * does: a path with no file behind it answers 404, and the platform's own
 * SPA fallback is never assumed. That detail is the whole point. When the
 * fallback was left to the platform, a deployment answered 404 for every
 * client route — the entire site except the homepage was unreachable by
 * direct link — and every other gate stayed green, because they were all
 * serving the build through a dev server that has its own fallback.
 *
 * Usage:
 *   node scripts/check-shipability.mjs               # build + edge + browser
 *   node scripts/check-shipability.mjs --url https://slic.nonarkara.org
 *                                                   # audit a deployed site
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
const EDGE_ONLY = process.argv.includes("--edge-only");


const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DIST = path.join(ROOT, "dist");

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

const WIDTHS = [1440, 390];

const LOCALES = [
  ["en", "en-GB"],
  ["th", "th-TH"],
  ["zh", "zh-CN"],
  ["ko", "ko-KR"],
  ["ja", "ja-JP"],
];

/** Console noise that is known, reported, and not a defect of this build. */
const KNOWN_CONSOLE = [
  { match: /googleusercontent|google\.com\/forms|sheets/i, why: "the visitor-tracking POST to Google Sheets answers 401 — a deployment setting on the Google account, not a build defect" },
  { match: /ipapi\.co/i, why: "the optional geo lookup is rate-limited and fails CORS — the UI degrades to Unknown" },
  { match: /cloudflareinsights\.com\/cdn-cgi\/rum/i, why: "the Cloudflare Web Analytics beacon only answers on a Cloudflare-proxied origin; it always fails CORS against a local audit server" },
];

// The traffic counter lives in a D1 database, which only exists on the
// Cloudflare project. Off Cloudflare the endpoint answers 503 by design, and
// the page degrades to "—". Against a live URL the endpoint must answer, so
// this exemption is local-only.
if (!LIVE) {
  KNOWN_CONSOLE.push({
    match: /503 \(Service Unavailable\)|Failed to load resource/i,
    why: "the first-party traffic endpoint has no D1 binding outside Cloudflare — locally it answers 503 by design",
  });
}
const findings = [];
const add = (severity, title, detail) => findings.push({ severity, title, detail });

/* ── the edge ───────────────────────────────────────────────────────────── */

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

/**
 * An asset binding that behaves like the platform's: the file if it is there,
 * 404 if it is not, and no SPA fallback of its own. The worker is what has
 * to serve a client route, and this is what proves it.
 */
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

/* ── the edge checks ────────────────────────────────────────────────────── */

async function auditEdge(base) {
  // The reference shell: the build's own index.html locally, and — when the
  // audit runs against a deployed site — the site's own index.html. A live
  // audit asks "does every route serve this site?", so the site is the
  // reference, not whatever happens to be on this machine.
  let shell = fs.readFileSync(path.join(DIST, "index.html"));
  if (LIVE) {
    const index = await fetch(base + "/index.html");
    if (index.status === 200) {
      const raw = Buffer.from(await index.arrayBuffer());
      shell = raw.length > 2 && raw[0] === 0x1f && raw[1] === 0x8b ? zlib.gunzipSync(raw) : raw;
    }
  }
  for (const route of ROUTES) {
    const r = await fetch(base + route, { redirect: "manual" });
    const raw = Buffer.from(await r.arrayBuffer());
    // A live server answers gzip; the shell on disk is the plain bytes. The
    // comparison has to be between the same thing. The fetch client may have
    // decompressed it already, so the bytes decide, not the header.
    const gzipped = raw.length > 2 && raw[0] === 0x1f && raw[1] === 0x8b;
    const body = gzipped ? zlib.gunzipSync(raw) : raw;
    if (r.status !== 200) {
      add("blocker", `${route} answers ${r.status} at the edge`, "A published route must be served. A direct link to it is a link a reader can send.");
      continue;
    }
    if (!(r.headers.get("content-type") ?? "").includes("text/html")) {
      add("blocker", `${route} is served as ${r.headers.get("content-type")}`, "A client route must be served as HTML.");
    }
    if (!body.equals(shell)) {
      add("blocker", `${route} is not the application shell`, "The bytes served for a route are not the bytes of index.html.");
    }
    if ((r.headers.get("cache-control") ?? "") !== "no-cache") {
      add("warn", `${route} is cached as ${r.headers.get("cache-control")}`, "The shell must not be cached, or a reader keeps an old bundle.");
    }
  }

  // A file that does not exist is still a 404. The shell is the answer to a
  // route, not a blanket over the origin.
  for (const missing of ["/assets/missing.js", "/og-missing.png", "/downloads/missing.pdf", "/sitemap-missing.xml"]) {
    const r = await fetch(base + missing);
    if (r.status !== 404) add("blocker", `${missing} answers ${r.status}`, "A missing file must 404; serving the shell for a missing asset turns a broken link into a page that lies.");
  }

  // The edge boundaries still hold.
  const boundaries = [
    ["/.env", 404],
    ["/%2eenv", 404],
    ["/_worker.js", 404],
    ["/traffic-api.js", 404],
    ["/%00", 400],
    ["/api", 404],
    // The traffic counter lives in a D1 database. On Cloudflare it answers;
    // anywhere else there is no binding, and the endpoint answers 503 by
    // design rather than pretending to have data.
    ["/api/traffic", LIVE ? 200 : 503],
  ];
  for (const [path, expected] of boundaries) {
    const r = await fetch(base + path);
    if (r.status !== expected) add("blocker", `${path} answers ${r.status}, expected ${expected}`, "The edge boundary moved.");
  }

  const post = await fetch(base + "/", { method: "POST" });
  if (post.status !== 405) add("blocker", `POST / answers ${post.status}`, "Only GET and HEAD are allowed.");
}

/**
 * The sitemap is the one file a crawler reads to learn what a site has. A
 * published route that is not in it is a page the site is not offering, and
 * the 163 city scorecards are the pages a reader actually searches for.
 */
function auditSitemap() {
  const file = path.join(DIST, "sitemap.xml");
  if (!fs.existsSync(file)) {
    add("blocker", "there is no sitemap", "A crawler cannot learn what the site has without one.");
    return;
  }
  const xml = fs.readFileSync(file, "utf8");
  const missing = ROUTES.filter((route) => route !== "/" && !xml.includes(`slic.nonarkara.org${route}`));
  if (missing.length) {
    add("blocker", `${missing.length} published route(s) are not in the sitemap`, missing.join(", "));
  }
  const cityPages = (xml.match(/\/city\/[^<]+<\/loc>/g) ?? []).length;
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/publishedRankingData.json"), "utf8"));
  const cities = Array.isArray(data) ? data.length : data.cities.length;
  if (cityPages < cities) {
    add("warn", `the sitemap lists ${cityPages} city pages of ${cities}`, "The city scorecards are the pages a reader searches for.");
  }
}

/* ── the browser checks ─────────────────────────────────────────────────── */

const PROBE = async () => {
  const doc = document.documentElement;
  const images = [...document.images];
  const entries = performance.getEntriesByType("resource");
  const nav = performance.getEntriesByType("navigation")[0];
  const bytes = entries.reduce((sum, e) => sum + (e.transferSize || e.encodedBodySize || 0), 0) + (nav?.transferSize || 0);
  // LCP is not in the performance timeline: it is only reported to an
  // observer, and only for the buffered entries if the observer asks.
  const lcp = await new Promise((resolve) => {
    let value = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) value = entry.startTime;
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      setTimeout(() => { observer.disconnect(); resolve(value); }, 400);
    } catch {
      resolve(0);
    }
  });
  return {
    h1s: [...document.querySelectorAll("h1")].map((h) => (h.textContent || "").trim()),
    title: document.title,
    lang: doc.getAttribute("lang") || "",
    bodyText: (document.body.innerText || "").replace(/\s+/g, " ").trim().length,
    skeletons: document.querySelectorAll(".route-loading-skeleton").length,
    masthead: document.querySelectorAll(".site-masthead, header").length,
    brokenImages: images.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    imagesWithoutAlt: images.filter((i) => !i.hasAttribute("alt")).length,
    overflow: Math.max(doc.scrollWidth, document.body.scrollWidth) > doc.clientWidth + 1,
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    bytes,
    heaviest: entries
      .filter((e) => (e.transferSize || e.encodedBodySize || 0) > 0)
      .sort((a, b) => (b.transferSize || b.encodedBodySize || 0) - (a.transferSize || a.encodedBodySize || 0))
      .slice(0, 3)
      .map((e) => `${e.name.split("/").pop()} ${Math.round((e.transferSize || e.encodedBodySize || 0) / 1024)}kB`),
    requests: entries.length + 1,
    lcp: Math.round(lcp),
    domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0),
  };
};

async function auditBrowser(base) {
  const browser = await launchBrowser();
  try {
    await auditRoutes(browser, base);
    await auditLocales(browser, base);
    await auditNavigation(browser, base);
    await auditLinks(browser, base);
  } finally {
    await browser.close().catch(() => {});
  }
}

/**
 * Chrome is killed or starved on a loaded machine, and a launch that dies
 * must not be read as "the site is broken" — nor must it abort the audit.
 * A dead browser is relaunched, and a measurement that could not be taken is
 * recorded as a failure of the measurement, not of the site.
 */
async function launchBrowser(attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await chromium.launch({ timeout: 120000 });
    } catch (error) {
      lastError = error;
      console.log(`  (browser launch attempt ${attempt} failed — ${String(error.message || error).split("\n")[0]})`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw lastError;
}

async function auditRoutes(browser, base) {
  const weights = [];
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width, height: width > 700 ? 900 : 844 } });
      const page = await context.newPage();
      const errors = [];
      const consoleErrors = [];
      page.on("pageerror", (e) => errors.push(String(e.message || e).slice(0, 200)));
      page.on("console", (m) => {
        if (m.type() !== "error") return;
        const text = m.text();
        if (KNOWN_CONSOLE.some((k) => k.match.test(text))) return;
        consoleErrors.push(text.slice(0, 200));
      });

      try {
        await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.waitForSelector("h1", { timeout: 60000 });
        await page.waitForFunction(() => document.querySelectorAll(".route-loading-skeleton").length === 0, { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(600);
        const p = await page.evaluate(PROBE);

        if (p.h1s.length === 0) add("blocker", `${route} @${width} has no h1`, "The page did not render a heading.");
        else if (p.h1s.length > 1) add("warn", `${route} @${width} has ${p.h1s.length} h1 elements`, "More than one h1 makes the page's subject ambiguous.");
        else if (p.h1s[0].length < 4) add("blocker", `${route} @${width} rendered an empty heading`, "The route loaded a skeleton instead of its page.");
        if (p.skeletons > 0) add("blocker", `${route} @${width} is still a loading skeleton`, "A lazy chunk never resolved; the shipped page is blank.");
        if (p.bodyText < 200) add("blocker", `${route} @${width} rendered ${p.bodyText} characters`, "The page is effectively empty.");
        if (p.overflow) add("blocker", `${route} @${width} scrolls sideways (${p.scrollWidth} > ${p.clientWidth})`, "A reader on a phone has to scroll sideways to read.");
        if (p.brokenImages.length) add("blocker", `${route} @${width} has broken images`, p.brokenImages.join(", "));
        if (p.imagesWithoutAlt) add("warn", `${route} @${width} has ${p.imagesWithoutAlt} images without alt`, "A screen reader has nothing to say for them.");
        if (!p.title) add("blocker", `${route} @${width} has no title`, "The tab, the bookmark and the share card all need it.");
        if (!p.lang) add("warn", `${route} @${width} has no lang on <html>`, "Assistive technology has to guess the language.");
        if (!p.description) add("warn", `${route} @${width} has no meta description`, "A shared link gets no description.");
        if (!p.canonical) add("warn", `${route} @${width} has no canonical link`, "Search engines cannot tell which URL is the page.");
        if (errors.length) add("blocker", `${route} @${width} threw while loading`, errors.join(" | "));
        if (consoleErrors.length) add("warn", `${route} @${width} logged console errors`, consoleErrors.slice(0, 3).join(" | "));
        if (width === WIDTHS[0]) {
          weights.push({ route, bytes: p.bytes, requests: p.requests, lcp: p.lcp, dcl: p.domContentLoaded, heaviest: p.heaviest });
        }
      } catch (error) {
        add("blocker", `${route} @${width} did not load`, String(error.message || error).slice(0, 200));
      }
      await context.close();
    }
  }

  if (weights.length) {
    const sorted = [...weights].sort((a, b) => b.bytes - a.bytes);
    console.log(`\n  payload on the first load (${WIDTHS[0]}px, transferred bytes):`);
    for (const w of sorted) {
      console.log(
        `    ${w.route.padEnd(20)} ${(w.bytes / 1024).toFixed(0).padStart(5)}kB  ${String(w.requests).padStart(3)} requests  LCP ${String(w.lcp).padStart(5)}ms  DCL ${String(w.dcl).padStart(5)}ms`,
      );
    }
    const worst = sorted[0];
    if (worst.bytes > 1_500_000) {
      add(
        "warn",
        `${worst.route} pulls ${(worst.bytes / 1024).toFixed(0)}kB on the first load`,
        `The heaviest of it: ${worst.heaviest.join(", ")}. A reader on a train, on a phone, on a metered connection pays all of it before the page is useful. The bytes are the size of the pictures the page shows and the code the page runs — the fix is to serve what the page can display, not to serve more of it.`,
      );
    }
  }
}

async function auditLocales(browser, base) {
  // The five locales, on the pages where the copy is heaviest.
  for (const [locale, browserLocale] of LOCALES) {
    for (const route of ["/", "/rankings", "/city/th-bangkok"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: browserLocale });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e.message || e).slice(0, 200)));
      try {
        await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.waitForSelector("h1", { timeout: 60000 });
        await page.waitForTimeout(700);
        const p = await page.evaluate(PROBE);
        if (!p.lang.toLowerCase().startsWith(locale === "zh" ? "zh" : locale)) {
          add("blocker", `${route} in ${locale} declares lang="${p.lang}"`, "The page is not in the language it claims to be.");
        }
        if (p.h1s.length === 0 || p.h1s[0].length < 4) add("blocker", `${route} in ${locale} did not render a heading`, "The locale is empty.");
        if (errors.length) add("blocker", `${route} in ${locale} threw while loading`, errors.join(" | "));
      } catch (error) {
        add("blocker", `${route} in ${locale} did not load`, String(error.message || error).slice(0, 200));
      }
      await context.close();
    }
  }
}

async function auditNavigation(browser, base) {
  // Client-side navigation: the site is a single application, and the links
  // in it have to move the reader without a round trip to a 404.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForSelector("h1", { timeout: 60000 });
    const before = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() || "");
    // The masthead's own link, not the dropdown's hidden duplicate: a link
    // that is not visible is a link the reader cannot click either.
    const link = page.locator('a[href$="/rankings"]:visible').first();
    await link.click({ timeout: 20000 });
    await page.waitForFunction(() => window.location.pathname.endsWith("/rankings"), { timeout: 20000 });
    await page.waitForTimeout(800);
    const after = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() || "");
    if (after === before || !after) add("blocker", "clicking a link in the masthead did not change the page", "The router is not moving the reader.");
  } catch (error) {
    add("blocker", "client-side navigation failed", String(error.message || error).slice(0, 200));
  }
  await context.close();
}

/* ── link integrity ─────────────────────────────────────────────────────── */

/** Every internal link on the shipped pages must resolve at the edge. */
async function auditLinks(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const seen = new Set();
  const broken = [];
  try {
    for (const route of ["/", "/rankings", "/methodology", "/data", "/city/th-bangkok"]) {
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForSelector("h1", { timeout: 60000 });
      await page.waitForTimeout(500);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href") || ""),
      );
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/assets/")) continue;
        const clean = href.split("#")[0].split("?")[0];
        if (!clean || seen.has(clean)) continue;
        seen.add(clean);
        const r = await fetch(base + clean, { method: "HEAD" });
        if (r.status >= 400) broken.push(`${clean} → ${r.status}`);
      }
    }
  } catch (error) {
    add("warn", "the link crawl did not finish", String(error.message || error).slice(0, 200));
  }
  await context.close();
  await browser.close();
  if (broken.length) {
    add("blocker", `${broken.length} internal link(s) do not resolve`, broken.slice(0, 20).join(", "));
  }
}

/* ── delivery facts ─────────────────────────────────────────────────────── */

function auditDelivery() {
  const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  const cssFiles = fs.readdirSync(path.join(DIST, "assets")).filter((f) => f.endsWith(".css"));
  const css = cssFiles.map((f) => fs.readFileSync(path.join(DIST, "assets", f), "utf8")).join("\n");

  if (/@import\s+url\(["']?https:\/\/fonts\.googleapis\.com/.test(css)) {
    add("warn", "the web fonts are pulled in by @import inside the stylesheet", "The browser cannot start the font request until the CSS has been parsed and fetched, so the display face arrives one round trip after the page — the headline repaints in the fallback. A <link rel=\"stylesheet\"> in the document head, next to the preconnect that is already there, removes the waterfall.");
  }
  if (!/rel="preconnect"[^>]*fonts\.gstatic\.com/.test(html)) {
    add("warn", "no preconnect to fonts.gstatic.com", "The font files themselves start a fresh TLS handshake.");
  }
  for (const file of ["robots.txt", "sitemap.xml", "site.webmanifest", "favicon.ico", "og-card.png"]) {
    if (!fs.existsSync(path.join(DIST, file))) add("warn", `${file} is not in the build`, "Crawlers, shares and the home screen all look for it.");
  }
  const shellBytes = fs.statSync(path.join(DIST, "index.html")).size;
  const biggest = fs
    .readdirSync(path.join(DIST, "assets"))
    .map((f) => ({ f, bytes: fs.statSync(path.join(DIST, "assets", f)).size }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 3)
    .map((x) => `${x.f} ${(x.bytes / 1024).toFixed(0)}kB`);
  console.log(`  shell ${(shellBytes / 1024).toFixed(1)}kB · largest assets: ${biggest.join(", ")}`);
}

/* ── main ───────────────────────────────────────────────────────────────── */

let server = null;
let base = LIVE;
if (!LIVE) {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error("dist/index.html is missing — run npm run build first");
    process.exit(1);
  }
  server = await serveEdge(DIST, 0);
  base = `http://127.0.0.1:${server.address().port}`;
  console.log(`  edge: the real worker over dist/ at ${base}`);
} else {
  console.log(`  edge: ${LIVE}`);
}

console.log("shipability audit\n");

/**
 * A phase that could not run is reported as a phase that could not run.
 * "The measurement was not taken" and "the site is broken" are different
 * sentences, and a release must not be cut on the second one by accident —
 * or waved through because the first one was quiet.
 */
async function phase(name, fn) {
  try {
    await fn();
  } catch (error) {
    add("blocker", `the ${name} phase did not run`, String(error.message || error).split("\n")[0]);
  }
}

await phase("edge", () => auditEdge(base));
await phase("sitemap", () => auditSitemap());
if (!EDGE_ONLY) {
  await phase("browser", () => auditBrowser(base));
}
auditDelivery();

if (server) server.close();

const blockers = findings.filter((f) => f.severity === "blocker");
const warns = findings.filter((f) => f.severity === "warn");

for (const f of findings) {
  const mark = f.severity === "blocker" ? "BLOCKER" : "warn   ";
  console.log(`  ${mark} ${f.title}\n          ${f.detail}`);
}

console.log(`\n=== ${blockers.length} blocker(s), ${warns.length} warning(s) ===`);
if (blockers.length) {
  console.log("SHIPABILITY AUDIT FAILED — the site is not shippable in this state.");
  process.exit(1);
}
console.log("SHIPABILITY AUDIT PASSED — every published route arrives, renders, and is a page.");
