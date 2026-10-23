#!/usr/bin/env node
/**
 * Generates the thumbnails the site serves in place of the full-size photos.
 *
 * The measurements behind this plan:
 *
 *   The history timeline draws a 240×160 box. The file behind it was 1600px
 *   wide — 6.7× oversampled, and 101 kB to paint 240 pixels. Eleven of them
 *   sat in one horizontal strip, inside the browser's lazy-load threshold, so
 *   the route paid 1.5 MB before the reader scrolled once.
 *
 *   The essay and idea cards draw a 456–477px box from a 1600px file: 3.5×
 *   oversampled. The partner logos in the footer draw 44–137px from
 *   873–1177px files: up to 21× oversampled, and 257 kB for a 54px mark.
 *
 *   Nothing was cropped or cut. Each thumbnail is the same picture, resized to
 *   about twice the box it is painted into, which is what a 2× display wants.
 * The originals stay in the repository for the places that show them large.
 *
 * The brand mark is NOT in this plan: it is derived artwork, and
 * scripts/build-brand-mark.py writes it at the size it is used.
 *
 *   node scripts/generate-thumbnails.mjs           # write
 *   node scripts/generate-thumbnails.mjs --check   # fail on drift
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const PUBLIC = join(root, "public");

/**
 * The plan. A directory rule resizes every image in it; a file rule wins.
 * The width is the target for the LONGER side, chosen at roughly twice the
 * box the image is painted into.
 */
const DIRECTORY_RULES = [
  { dir: "history-photos", widths: [480] },
  { dir: "launch-photos", widths: [480, 960] },
  { dir: "photos", widths: [960] },
  { dir: "version-archive", widths: [640] },
];

const FILE_RULES = {
  "Logos/axiom_logo.png": [128],
  "Logos/retl_logo.png": [128],
  "Logos/smart_city_thailand_logo.png": [128],
  "Logos/depa_logo.png": [256],
  "Logos/rcad-sdw.png": [288],
};

const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function imagesIn(dir) {
  const abs = join(PUBLIC, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((name) => IMAGE_EXT.has(extname(name).toLowerCase()))
    .sort();
}

/** The plan, as a map of "dir/file" to the widths it is served at. */
function buildPlan() {
  const plan = new Map();
  for (const rule of DIRECTORY_RULES) {
    for (const name of imagesIn(rule.dir)) {
      plan.set(`${rule.dir}/${name}`, rule.widths);
    }
  }
  for (const [file, widths] of Object.entries(FILE_RULES)) {
    plan.set(file, widths);
  }
  return plan;
}

/**
 * The thumbnail lives under public/thumbs/<width>/<the original's path>.
 *
 * Not beside the original with a suffix: a width suffix reads like a filename
 * mangling, and it collides with the contact gate, which reads anything shaped
 * like "a local part, an at sign, a domain" as a personal email — the suffix
 * made every thumbnail a false positive. A directory of its own keeps every
 * original name intact.
 */
function thumbPath(source, width) {
  return join("thumbs", String(width), source);
}

function pixelWidth(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", file], { encoding: "utf8" });
  const match = out.match(/pixelWidth:\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function resize(source, width) {
  const target = join(PUBLIC, thumbPath(source, width));
  mkdirSync(dirname(target), { recursive: true });
  const ext = extname(source).toLowerCase();
  if (ext === ".webp") {
    // sips reads webp but cannot write it, so webp goes through cwebp, which
    // scales and encodes in one pass.
    execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", String(width), "0", join(PUBLIC, source), "-o", target], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return target;
  }
  // PNG and JPEG: sips keeps the format and, for PNG, the alpha channel.
  execFileSync("sips", ["-Z", String(width), join(PUBLIC, source), "--out", target], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return target;
}

const plan = buildPlan();
const manifest = {};
const provenance = {};
for (const [source, widths] of plan) {
  manifest[source] = {};
  provenance[source] = { source: sha256(join(PUBLIC, source)) };
  for (const width of widths) {
    manifest[source][width] = thumbPath(source, width).split("\\").join("/");
  }
}

const serialised = `${JSON.stringify(manifest, null, 2)}\n`;
const MANIFEST_FILE = join(root, "src/data/thumbnails.json");
const PROVENANCE_FILE = join(root, "src/data/thumbnail-provenance.json");

if (process.argv.includes("--check")) {
  const problems = [];
  for (const [file, label] of [
    [MANIFEST_FILE, "src/data/thumbnails.json"],
    [PROVENANCE_FILE, "src/data/thumbnail-provenance.json"],
  ]) {
    if (!existsSync(file)) {
      problems.push(`${label} does not exist — run: node scripts/generate-thumbnails.mjs`);
    }
  }

  if (problems.length === 0) {
    if (readFileSync(MANIFEST_FILE, "utf8") !== serialised) {
      problems.push("src/data/thumbnails.json disagrees with the plan — run: node scripts/generate-thumbnails.mjs");
    }
    if (readFileSync(PROVENANCE_FILE, "utf8") !== `${JSON.stringify(provenance, null, 2)}\n`) {
      problems.push("src/data/thumbnail-provenance.json disagrees with the plan — run: node scripts/generate-thumbnails.mjs");
    }

    for (const [source, widths] of plan) {
      const sourceFile = join(PUBLIC, source);
      const recorded = provenance[source].source;
      if (sha256(sourceFile) !== recorded) {
        problems.push(`${source} has changed since its thumbnail was made — re-run: node scripts/generate-thumbnails.mjs`);
      }
      for (const width of widths) {
        const file = join(PUBLIC, thumbPath(source, width));
        if (!existsSync(file)) {
          problems.push(`missing thumbnail ${thumbPath(source, width)}`);
          continue;
        }
        const natural = pixelWidth(file);
        if (natural > width) {
          problems.push(`${thumbPath(source, width)} is ${natural}px wide, wider than the ${width}px it claims`);
        }
      }
    }
  }

  if (problems.length) {
    for (const p of problems) console.error(`FAIL  ${p}`);
    process.exit(1);
  }
  const count = Object.values(manifest).reduce((sum, widths) => sum + Object.keys(widths).length, 0);
  console.log(`PASS  ${count} thumbnails exist, match the plan, and match the sources they came from.`);
} else {
  let before = 0;
  let after = 0;
  let count = 0;
  for (const [source, widths] of plan) {
    for (const width of widths) {
      const original = join(PUBLIC, source);
      const target = resize(source, width);
      before += statSync(original).size;
      after += statSync(target).size;
      count += 1;
    }
  }
  writeFileSync(MANIFEST_FILE, serialised);
  writeFileSync(PROVENANCE_FILE, `${JSON.stringify(provenance, null, 2)}\n`);
  console.log(
    `wrote ${count} thumbnails: ${(before / 1024).toFixed(0)}kB of sources became ${(after / 1024).toFixed(0)}kB of thumbnails (${((1 - after / before) * 100).toFixed(0)}% lighter).`,
  );
}
