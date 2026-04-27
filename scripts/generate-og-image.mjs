#!/usr/bin/env node
/**
 * Generate public/og-image.png (1200x630) for SLIC Index V3.
 *
 * House style: cream #f8f5f0 background, dark #1c1914 text, amber #b85c28 accent.
 * Zero rounded corners, zero gradients, zero drop shadows. Hairline borders only.
 *
 * Renders an SVG and rasterises with sharp at 2x then resizes to 1200x630 for sharpness.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const data = JSON.parse(readFileSync(resolve(root, 'src/data/publishedRankingData.json'), 'utf8'));
const alpha = data.cities
  .filter((c) => c.tierLabel === 'Alpha')
  .sort((a, b) => b.slicScore - a.slicScore)
  .slice(0, 10);

if (alpha.length !== 10) {
  throw new Error(`Expected 10 Alpha cities, got ${alpha.length}`);
}

// Page dimensions at native render resolution (2x for crispness)
const W = 2400;
const H = 1260;
const PAD = 96; // outer padding (~48px @ 1x)

const CREAM = '#f8f5f0';
const INK = '#1c1914';
const AMBER = '#b85c28';
const HAIRLINE = 'rgba(28,25,20,0.18)';

// Column split 60/40 with internal gutter
const COL_GUTTER = 96;
const LEFT_W = Math.round((W - PAD * 2) * 0.6) - COL_GUTTER / 2;
const RIGHT_X = PAD + LEFT_W + COL_GUTTER;
const RIGHT_W = W - PAD - RIGHT_X;

// XML escape helper
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const alphaList = alpha
  .map((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    const y = 280 + i * 64; // line spacing
    return `
      <text x="0" y="${y}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="36" fill="${INK}" letter-spacing="0">
        <tspan fill="${INK}" fill-opacity="0.45">${n}</tspan><tspan dx="32" font-weight="500">${esc(c.displayName)}</tspan><tspan fill="${INK}" fill-opacity="0.55"> &#183; ${esc(c.country)}</tspan>
      </text>`;
  })
  .join('');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${CREAM}"/>

  <!-- Outer hairline frame (subtle, editorial) -->
  <rect x="${PAD - 32}" y="${PAD - 32}" width="${W - (PAD - 32) * 2}" height="${H - (PAD - 32) * 2}" fill="none" stroke="${HAIRLINE}" stroke-width="2"/>

  <!-- Single amber dot, top-right -->
  <rect x="${W - PAD - 16}" y="${PAD}" width="16" height="16" fill="${AMBER}"/>

  <!-- LEFT COLUMN (60%) -->
  <g transform="translate(${PAD}, ${PAD})">
    <!-- Eyebrow -->
    <text x="0" y="48" font-family="JetBrains Mono, ui-monospace, monospace" font-size="28" fill="${INK}" fill-opacity="0.7" letter-spacing="5.6" font-weight="500">SMART AND LIVEABLE CITIES INDEX &#183; 2026</text>

    <!-- Hairline under eyebrow -->
    <line x1="0" y1="96" x2="${LEFT_W}" y2="96" stroke="${INK}" stroke-opacity="0.2" stroke-width="2"/>

    <!-- Headline: SLIC V3 -->
    <text x="-12" y="380" font-family="Libre Baskerville, Georgia, serif" font-style="italic" font-size="284" fill="${INK}" font-weight="400" letter-spacing="-4">SLIC V3</text>

    <!-- Sub-headline -->
    <text x="0" y="500" font-family="Libre Baskerville, Georgia, serif" font-size="52" fill="${INK}" fill-opacity="0.85" font-weight="400">163 cities. 5 pillars. 20 scored metrics.</text>
    <text x="0" y="568" font-family="Libre Baskerville, Georgia, serif" font-style="italic" font-size="52" fill="${INK}" fill-opacity="0.85" font-weight="400">No tier inflation.</text>

    <!-- Bottom hairline + wordmark -->
    <line x1="0" y1="${H - PAD * 2 - 80}" x2="${LEFT_W}" y2="${H - PAD * 2 - 80}" stroke="${INK}" stroke-opacity="0.2" stroke-width="2"/>
    <text x="0" y="${H - PAD * 2 - 30}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="28" fill="${INK}" fill-opacity="0.75" letter-spacing="2.8">nonarkara.github.io/SLIC-Index</text>
  </g>

  <!-- RIGHT COLUMN (40%) -->
  <g transform="translate(${RIGHT_X}, ${PAD})">
    <!-- Eyebrow -->
    <text x="0" y="48" font-family="JetBrains Mono, ui-monospace, monospace" font-size="22" fill="${INK}" letter-spacing="3.2" font-weight="500">
      <tspan fill="${AMBER}" font-weight="700">&#945;</tspan><tspan dx="14">ALPHA &#183; TOP 10</tspan>
    </text>

    <!-- Hairline between eyebrow and list -->
    <line x1="0" y1="80" x2="${RIGHT_W}" y2="80" stroke="${INK}" stroke-width="2"/>

    <!-- Numbered list (10 items, 36px JetBrains Mono ~ 18px @ 1x) -->
    <g transform="translate(0, -100)">
      ${alphaList}
    </g>

    <!-- Bottom hairline + meta -->
    <line x1="0" y1="${H - PAD * 2 - 80}" x2="${RIGHT_W}" y2="${H - PAD * 2 - 80}" stroke="${INK}" stroke-opacity="0.2" stroke-width="2"/>
    <text x="0" y="${H - PAD * 2 - 30}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="22" fill="${INK}" fill-opacity="0.55" letter-spacing="2.4">RED DOT &#183; EDITORIAL EDITION</text>
  </g>
</svg>`;

// Save the source SVG for reference (overwritable)
const svgPath = resolve(root, 'public/og-image.svg');
writeFileSync(svgPath, svg);

const outPath = resolve(root, 'public/og-image.png');

// Render at 2x then downsample for crisp text
await sharp(Buffer.from(svg), { density: 144 })
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
console.log(`Alpha 10 verified:`);
alpha.forEach((c, i) => console.log(`  ${i + 1}. ${c.displayName} · ${c.country} (${c.slicScore})`));
