import { createRequire } from "module";
const require = createRequire(import.meta.url);
// puppeteer lives in the npx cache — resolve from there
let puppeteer;
try {
  puppeteer = require("/Users/nonarkara/.npm/_npx/1a4eb60c8f6b0f89/node_modules/puppeteer");
} catch {
  puppeteer = require("/Users/nonarkara/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer");
}
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/og-card.png");

const html = `<!doctype html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    background: #f8f5f0;
    color: #1c1914;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px 72px 56px;
    overflow: hidden;
  }

  .top {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(28, 25, 20, 0.45);
  }

  .headline {
    font-family: 'Libre Baskerville', serif;
    font-size: 84px;
    font-weight: 700;
    line-height: 0.96;
    letter-spacing: -0.02em;
    color: #1c1914;
  }

  .data-line {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: rgba(28, 25, 20, 0.62);
    margin-top: 8px;
  }

  .data-line .accent {
    color: #b85c28;
    font-weight: 500;
  }

  .bottom {
    border-top: 1px solid rgba(28, 25, 20, 0.15);
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: rgba(28, 25, 20, 0.55);
  }

  .badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(28, 25, 20, 0.35);
  }
</style>
</head>
<body>
  <div class="top">
    <div class="eyebrow">SLIC Index V3</div>
    <div class="headline">Smart and<br>Liveable<br>Cities Index</div>
    <div class="data-line">163 cities &middot; 5 pillars &middot; AMPI &middot; <span class="accent">EN TH ZH KO JA</span></div>
  </div>
  <div class="bottom">
    <div class="url">slic.nonarkara.org</div>
    <div class="badge">Open methodology &middot; No imputation</div>
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 1200)); // let Google Fonts load
const buf = await page.screenshot({ type: "png" });
await writeFile(OUT, buf);
await browser.close();
console.log(`OG card written → ${OUT}`);
