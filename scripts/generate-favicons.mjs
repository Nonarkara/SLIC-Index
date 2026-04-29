#!/usr/bin/env node
/**
 * Generate the SLIC Index favicon system from public/favicon-source.svg.
 *
 * Outputs:
 *   public/favicon-16.png        16×16
 *   public/favicon-32.png        32×32
 *   public/favicon-48.png        48×48 (used inside .ico)
 *   public/favicon.ico           multi-size 16/32/48
 *   public/apple-touch-icon.png  180×180
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgBuf = readFileSync(resolve(root, 'public/favicon-source.svg'));

async function makePng(size, outPath) {
  // Render at 4× then downsample for crisp small-size raster.
  const big = await sharp(svgBuf, { density: 384 })
    .resize(size * 4, size * 4, { fit: 'fill' })
    .png()
    .toBuffer();
  await sharp(big).resize(size, size, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(outPath);
  return outPath;
}

const out16 = resolve(root, 'public/favicon-16.png');
const out32 = resolve(root, 'public/favicon-32.png');
const out48 = resolve(root, 'public/favicon-48.png');
const outApple = resolve(root, 'public/apple-touch-icon.png');
const outIco = resolve(root, 'public/favicon.ico');

await makePng(16, out16);
await makePng(32, out32);
await makePng(48, out48);
await makePng(180, outApple);

const icoBuf = await pngToIco([out16, out32, out48]);
writeFileSync(outIco, icoBuf);

console.log('Favicon set written:');
for (const p of [out16, out32, out48, outApple, outIco]) console.log('  ' + p);
