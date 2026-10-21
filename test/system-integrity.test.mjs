/**
 * System-integrity gates.
 *
 * The anti-slop gates in design-slop-invariants.test.mjs police what a page
 * LOOKS like. These police the substrate that lets a page drift in the first
 * place. Every gate here corresponds to a defect that was actually found in
 * src/styles.css during the October 2026 audit, not to a hypothetical.
 *
 * Each defect class found, and the gate that now prevents it:
 *
 *   1. Two inks and two creams coexisting.
 *      --text is #111314 but #1c1914 appeared 15×; --bg is #f7f5ef but
 *      #f8f5f0 appeared 15×. Nobody could say what the ground was.
 *      → "the palette is declared once" — every colour at point of use is a token.
 *
 *   2. A second blue living beside the declared one.
 *      --accent-blue is #12354e; #1a3a6b appeared 18× as a raw hex.
 *      → same gate. This is the failure mode the gate exists for.
 *
 *   3. A raster wordmark.
 *      public/Logos/slic-index-full.png is a 400×400 SQUARE rendered into a
 *      140×36 box, in blue and teal that are not in the palette. It rendered as
 *      unreadable mush in the masthead of every page.
 *      → "the masthead wordmark is live type" — the masthead carries the
 *         brand as type. The footer carries the real artwork instead: keyed
 *         off its paper, transparent, and sitting on the cream with no plate
 *         of its own. Both are gated, so neither can come back silently.
 *
 *   4. Nested control borders.
 *      .mh-search-btn had a border and contained .mh-search-kbd, which had its
 *      own border. A box inside a box inside a button.
 *      → "a bordered control does not contain a bordered control".
 *
 *   5. Desaturation filters.
 *      filter: saturate(0.92) on the hero photograph, saturate(0.9) on the photo
 *      break. Three filters pulling every image toward grey is what made the
 *      whole site read as monochrome.
 *      → "photography is not desaturated".
 *
 *   6. 287 selectors defined more than once.
 *      The last definition silently wins, so nobody could reason about what
 *      rendered. .hp-headline was defined 9×; .locale-button 4×, and the three
 *      definitions of .locale-button.active disagreed — one filled the control
 *      with a solid ink plate, which is why the active language read as an ad.
 *      → "a selector is not silently redefined" — scoped variants are allowed,
 *         bare re-declarations are not.
 *
 * The last one is a ratchet, not a one-shot fix: it fails on any NEW duplicate
 * while tolerating the ones already in the file, so the count can only fall.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { inflateSync } from "node:zlib";

const ROOT = join(import.meta.dirname, "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");

/** CSS with comments blanked but every line number preserved. */
const maskedLines = (() => {
  const raw = css.split("\n");
  return raw.map((line) => {
    let out = "";
    let inComment = false;
    for (let i = 0; i < line.length; i++) {
      if (!inComment && line[i] === "/" && line[i + 1] === "*") {
        inComment = true;
        out += "  ";
        i++;
        continue;
      }
      if (inComment && line[i] === "*" && line[i + 1] === "/") {
        inComment = false;
        out += "  ";
        i++;
        continue;
      }
      out += inComment ? (line[i] === "\t" ? "\t" : " ") : line[i];
    }
    return out;
  });
})();

const masked = maskedLines.join("\n");

const tsxFiles = readdirSync(join(ROOT, "src"))
  .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
  .map((f) => ({ name: f, text: readFileSync(join(ROOT, "src", f), "utf8") }));

/* ──────────────────────────────────────────────────────────────────────
 * GATE 1 — the palette is declared once
 * ────────────────────────────────────────────────────────────────────── */

test("integrity: a colour used more than once must be a token, not a repeated hex", () => {
  // The failure mode this gate exists for is FORKING, not literal raw hex.
  // A colour typed at two sites can drift: someone changes one and not the
  // other, and the file ends up holding two answers to "what is the ground".
  // That is exactly how the file came to carry two inks (#1c1914 / #111314),
  // two creams (#f8f5f0 / #f7f5ef) and two blues (#1a3a6b / #12354e).
  //
  // A colour used exactly once cannot fork — there is nothing to disagree with.
  // Single-use local shading (a pillar's own hue, a PDF viewer's grey, the
  // weight-segment greyscale ramp) is therefore allowed to stay literal, which
  // is why this gate needs no exception list and cannot go stale.
  //
  // `#fff` and `#ffffff` are exempt: cream-on-ink-panel is the inverse of the
  // ground, not a second ground, and naming it would imply a token it isn't.
  const EXEMPT = new Set(["#fff", "#ffffff"]);

  // Skip :root — token declarations are allowed to hold raw hex.
  const bodyLines = [];
  let inRoot = false;
  let rootDepth = 0;
  for (let i = 0; i < maskedLines.length; i++) {
    const line = maskedLines[i];
    if (/^\s*:root\b/.test(line)) {
      inRoot = true;
      rootDepth = 0;
    }
    if (inRoot) {
      rootDepth += (line.match(/\{/g) ?? []).length;
      rootDepth -= (line.match(/\}/g) ?? []).length;
      if (rootDepth <= 0 && i > 0) inRoot = false;
      continue;
    }
    bodyLines.push({ n: i + 1, text: line });
  }

  const uses = new Map();
  for (const { n, text } of bodyLines) {
    for (const prop of text.matchAll(/([a-z-]+)\s*:\s*([^;]*)/g)) {
      for (const m of prop[2].matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const hex = m[0].toLowerCase();
        if (EXEMPT.has(hex)) continue;
        if (!uses.has(hex)) uses.set(hex, []);
        uses.get(hex).push({ line: n, prop: prop[1], raw: text.trim().slice(0, 52) });
      }
    }
  }

  const forked = [...uses.entries()].filter(([, v]) => v.length > 1);
  const offenders = forked.map(
    ([hex, v]) =>
      `${hex} used ${v.length}x → declare it in :root and use var()\n` +
      v.map((u) => `        line ${u.line}: ${u.raw}`).join("\n"),
  );

  assert.deepEqual(
    offenders,
    [],
    `A colour repeated as a raw hex can drift, and a drifted colour is how a\n` +
      `palette forks into two answers to "what is the ground".\n` +
      offenders.join("\n  "),
  );
});

test("integrity: no token is defined in terms of itself", () => {
  // --x: var(--x) is not a token, it is a circular reference that silently
  // resolves to the un-set value. It appeared when a bulk colour replacement
  // rewrote both the declaration and its comment.
  const offenders = [];
  for (let i = 0; i < maskedLines.length; i++) {
    const m = maskedLines[i].match(/(--[a-z0-9-]+)\s*:\s*var\((--[a-z0-9-]+)\)/i);
    if (m && m[1] === m[2]) {
      offenders.push(`line ${i + 1}: ${m[1]}: var(${m[2]})`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `A token may not reference itself:\n  ${offenders.join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * GATE 2 — the identity: live type in the masthead, the real logo in
 *           the footer
 * ────────────────────────────────────────────────────────────────────── */

/** Source with block and line comments removed, so prose cannot trip a gate. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/** SHA-256 of a file, as hex. Compared instead of the bytes themselves. */
function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

/**
 * Minimal PNG probe: does this file carry real transparency?
 *
 * The footer brand plate has to sit on the cream ground. If the logo is
 * re-exported with its paper background left in, the footer gets a white
 * rectangle — the exact regression the old black plate had. Reading the
 * alpha channel is the only way to catch that from the repository.
 */
function probePng(file) {
  const buf = readFileSync(file);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.ok(
    buf.subarray(0, 8).equals(signature),
    `${file} must be a PNG`,
  );

  let offset = 8;
  let header = null;
  const idat = [];
  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  assert.ok(header, `${file} has no IHDR chunk`);
  const { width, height, bitDepth, colorType, interlace } = header;
  assert.ok(
    bitDepth === 8 && !interlace,
    `${file} must be 8-bit and non-interlaced to be probed (got depth ${bitDepth}, interlace ${interlace})`,
  );

  // Channels per pixel: 1 grey, 2 grey+alpha, 3 palette, 4 RGB, 6 RGBA.
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  assert.ok(
    channels,
    `${file} is colour type ${colorType} (palette or otherwise); the probe handles grey, grey+alpha, RGB and RGBA only`,
  );

  const bytesPerPixel = channels;
  const stride = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const current = pixels.subarray(y * stride, (y + 1) * stride);
    const previous = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const rawByte = line[i];
      const a = i >= bytesPerPixel ? current[i - bytesPerPixel] : 0;
      const b = previous ? previous[i] : 0;
      const c = previous && i >= bytesPerPixel ? previous[i - bytesPerPixel] : 0;
      let value;
      switch (filter) {
        case 0:
          value = rawByte;
          break;
        case 1:
          value = rawByte + a;
          break;
        case 2:
          value = rawByte + b;
          break;
        case 3:
          value = rawByte + ((a + b) >> 1);
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          value = rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default:
          throw new Error(`unknown PNG filter ${filter} in ${file}`);
      }
      current[i] = value & 0xff;
    }
  }

  // Alpha is the last channel when the colour type carries one.
  if (colorType !== 4 && colorType !== 6) {
    return { width, height, colorType, hasAlpha: false, transparentPixels: 0 };
  }
  let transparentPixels = 0;
  for (let i = channels - 1; i < pixels.length; i += channels) {
    if (pixels[i] === 0) transparentPixels += 1;
  }
  return { width, height, colorType, hasAlpha: true, transparentPixels };
}

test("integrity: the masthead wordmark is live type, never a raster", () => {
  // The masthead appears on every page, so it carries the brand as live type
  // (.mh-wordmark-main / .mh-wordmark-sub): sharp at every DPR, colourable
  // from tokens, no extra request. The old mark was a 400×400 square PNG
  // squeezed into a 140×36 box in off-palette blue/teal — unreadable mush.
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    if (!/SiteMasthead/.test(name)) continue;
    const code = stripComments(text);
    for (const m of code.matchAll(/<img\b[^>]*>/g)) {
      offenders.push(`${name}: ${m[0].replace(/\s+/g, " ").slice(0, 90)}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `The masthead wordmark must be live text. The old mark was a 400x400 ` +
      `square PNG in off-palette blue/teal squeezed into a 140x36 box, which ` +
      `rendered as unreadable mush on every page.\n  ${offenders.join("\n  ")}`,
  );
});

test("integrity: no surface loads the square logo master as its identity", () => {
  // The master file stays in the repository because other projects reference
  // it, but the web UI may not load it: it is a square raster and it carries
  // an opaque paper ground.
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    const code = stripComments(text);
    if (/slic-index-full\.png/.test(code) || /<img[^>]*slicLogo/.test(code)) {
      offenders.push(name);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `No surface may load the square logo master:\n  ${offenders.join("\n  ")}`,
  );
});

test("integrity: the footer brand plate is the keyed logo, on no plate", () => {
  // The footer used to carry a black square with "SL" set in it — a
  // placeholder for a mark the site did not have. It now carries the real
  // SLIC Index wordmark, keyed off its paper so it sits on the cream ground.
  //
  // Three things can silently undo that, so all three are checked:
  //   1. the plate goes back to a dark box painted by CSS;
  //   2. the logo is re-exported with its paper background left in, and the
  //      footer gets a white rectangle on the cream;
  //   3. the built artifact drifts from the source, so the tree is clean
  //      while dist/ still serves the old plate.
  const lockup = tsxFiles.find((f) => f.name === "BrandLockup.tsx");
  assert.ok(lockup, "BrandLockup.tsx must exist");

  const code = stripComments(lockup.text);
  const sources = [...code.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(
    sources.length,
    1,
    `BrandLockup must load exactly one logo asset, found ${sources.length}: ${sources.join(", ")}`,
  );
  const src = sources[0];
  assert.match(src, /^\/Logos\//, `the brand plate must live under /Logos/, got ${src}`);

  const source = join(ROOT, "public", src.replace(/^\//, ""));
  assert.ok(existsSync(source), `${src} must exist in public/`);

  const png = probePng(source);
  assert.ok(png.hasAlpha, `${src} must carry an alpha channel`);
  assert.ok(
    png.transparentPixels > 0,
    `${src} must have fully transparent pixels — otherwise the footer shows a paper plate`,
  );

  // The published bytes are what the browser fetches. A tree-only gate is
  // blind to a stale artifact; this repo has paid for that once already.
  const built = join(ROOT, "dist", src.replace(/^\//, ""));
  assert.ok(
    existsSync(built),
    `dist${src} must exist — the built site ships the plate, and CI runs npm test before npm run build`,
  );
  // Hashes, not the bytes themselves: assert.deepEqual on two unequal
  // 48KB Buffers builds an enormous diff and hangs the runner instead of
  // failing the test. A gate that hangs is worse than no gate.
  assert.equal(
    sha256(built),
    sha256(source),
    `dist${src} must be byte-identical to public${src} — run npm run build`,
  );

  // Provenance: the mark is derived, so it must say what it was derived from.
  // A derived asset that cannot name its source is an opaque blob in the
  // repository — and a hand-edited PNG would pass every check above.
  const provenancePath = join(ROOT, "scripts/brand-mark.provenance.json");
  assert.ok(
    existsSync(provenancePath),
    "scripts/brand-mark.provenance.json must exist — run python3 scripts/build-brand-mark.py",
  );
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  assert.equal(
    provenance.outputSha256,
    sha256(source),
    `${src} does not match the bytes scripts/build-brand-mark.py recorded — the PNG was edited by hand, or it was re-derived without updating the record`,
  );
  assert.equal(
    provenance.sourceSha256,
    sha256(join(ROOT, "public", provenance.source.replace(/^\//, ""))),
    `the master ${provenance.source} has changed since the mark was derived — re-run python3 scripts/build-brand-mark.py`,
  );

  // No plate of its own: the mark sits on the cream, not in a box.
  const rule = /\.brand-mark\s*\{([^}]*)\}/.exec(masked);
  assert.ok(rule, ".brand-mark must be defined in src/styles.css");
  assert.ok(
    !/background\s*:/i.test(rule[1]),
    `.brand-mark must not paint a background — the mark sits on the cream:\n  ${rule[0]}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * GATE 3 — no nested control borders
 * ────────────────────────────────────────────────────────────────────── */

test("integrity: a bordered control does not contain another bordered control", () => {
  // Box-in-a-box: the masthead search trigger carried a border and held a kbd
  // chip that carried its own. Three nested rectangles read as clutter and
  // pushed the control louder than anything around it.
  const offenders = [];

  for (const m of masked.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    const body = m[2];
    if (!/border\s*:\s*(?!0|none)/.test(body)) continue;
    if (!/\bborder\b/.test(body)) continue;

    // Collect the element's own class, ignoring ancestor context.
    const ownClass = sel
      .split(",")
      .flatMap((s) => s.trim().split(/\s+/))
      .find((part) => part.startsWith(".") && !/[:[]>/.test(part.slice(1)));
    if (!ownClass) continue;
    const cls = ownClass.slice(1);

    // A kbd / badge / chip nested inside this control, declared with its own border.
    const nested = tsxFiles
      .filter(({ text }) => {
        // does this file render the child class INSIDE the parent?
        const parentOpen = new RegExp(`className="[^"]*\\b${cls}\\b[^"]*"`);
        const childCls = cls.replace(/^(\w)/, (c) => c.toUpperCase());
        return parentOpen.test(text) && new RegExp(`\\b${childCls}\\b`).test(text);
      })
      .map(({ name }) => name);

    if (nested.length && new RegExp(`\\.${cls}[^{]*\\{[^}]*\\bborder\\s*:`, "m").test(masked)) {
      // Only flag when a descendant selector also draws a border on the child.
      const descendantRule = new RegExp(`\\.${cls}[ >:][^{}]*\\{[^}]*\\bborder\\s*:`, "m");
      if (descendantRule.test(masked)) {
        offenders.push(`${cls} (bordered) contains a bordered child — ${nested.join(", ")}`);
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Nested control borders read as clutter and make a low-emphasis control ` +
      `louder than its neighbours. Differentiate the child with weight or ` +
      `tracking, not a second rectangle:\n  ${offenders.join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * GATE 4 — photography is not desaturated
 * ────────────────────────────────────────────────────────────────────── */

test("integrity: photography is not pulled toward grey by a saturate filter", () => {
  // saturate(<1) on an <img> is a deliberate decision to make the picture
  // greyer. Three of them stacked across the hero and photo-break is what made
  // the site read monochrome. saturate(>1) is the opposite intent — keep the
  // colour that survives a dark scrim — and is allowed.
  const offenders = [];
  for (let i = 0; i < maskedLines.length; i++) {
    for (const m of maskedLines[i].matchAll(/saturate\(\s*([\d.]+)\s*\)/gi)) {
      const value = Number(m[1]);
      if (value < 1) {
        offenders.push(`line ${i + 1}: saturate(${m[1]}) in ${maskedLines[i].trim().slice(0, 60)}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Do not desaturate photography. An ink scrim already does the contrast ` +
      `work; a saturate() below 1 just drains colour out of every image and ` +
      `makes the whole site read grey:\n  ${offenders.join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * GATE 5 — no silent selector redefinition (ratchet)
 * ────────────────────────────────────────────────────────────────────── */

test("integrity: a bare selector is not redefined later in the file", () => {
  // A later duplicate wins silently, so the earlier block is dead code and
  // nobody can tell what renders. Scoped variants (.x--hero .y, .y:hover) and
  // media-query overrides are legitimate; a second bare `.y { }` is not.
  //
  // This is a RATCHET: the baseline below is the count at the time the gate
  // was written. New duplicates fail. Fixing one lowers the count and the
  // baseline should be lowered with it.
  const BASELINE = 54;

  const counts = new Map();
  let depth = 0;
  let pendingSel = "";
  let pendingLine = 0;

  for (let i = 0; i < maskedLines.length; i++) {
    const line = maskedLines[i];
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;

    if (depth === 0 && line.trim().endsWith("{") && opens > 0) {
      pendingSel = line.trim().slice(0, -1).trim();
      pendingLine = i + 1;
    } else if (depth === 0 && pendingSel) {
      pendingSel = `${pendingSel} ${line.trim()}`.trim();
    }

    if (opens > 0) depth += opens;
    if (closes > 0) depth -= closes;
    if (depth === 0 && (opens > 0 || (pendingSel && !line.trim().endsWith("{")))) {
      if (pendingSel && !pendingSel.startsWith("@")) {
        for (const part of pendingSel.split(",").map((s) => s.trim()).filter(Boolean)) {
          // A "bare" selector: no parent chain, no pseudo-state, no media scope.
          if (/^[.#]?[a-zA-Z][\w-]*$/.test(part) || /^\.[a-z][\w-]*$/.test(part)) {
            if (!counts.has(part)) counts.set(part, []);
            counts.get(part).push(pendingLine);
          }
        }
      }
      pendingSel = "";
    }
  }

  const dups = [...counts.entries()].filter(([, v]) => v.length > 1);
  const total = dups.reduce((sum, [, v]) => sum + v.length - 1, 0);

  assert.ok(
    total <= BASELINE,
    `${total} bare selectors are defined more than once (ratchet baseline: ${BASELINE}). ` +
      "A later duplicate silently overrides the earlier block, so the earlier " +
      "is dead code and nobody can tell what renders. This is how " +
      "`.locale-button.active` ended up with three disagreeing definitions, one " +
      "of which filled the language switch with a solid ink plate. Fix the " +
      "duplicate, then lower BASELINE in this test.\n" +
      dups
        .slice(0, 12)
        .map(([sel, v]) => `  ${sel}: ${v.length}x (lines ${v.join(", ")})`)
        .join("\n"),
  );
});