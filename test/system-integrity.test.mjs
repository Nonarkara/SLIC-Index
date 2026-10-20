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
 *      → "the wordmark is live type" — no image may render the brand name.
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
 * GATE 2 — the wordmark is live type
 * ────────────────────────────────────────────────────────────────────── */

test("integrity: the wordmark is live type, never a raster", () => {
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    // An <img> whose alt or filename marks it as the site wordmark/brand.
    for (const m of code.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      if (/slicLogo|logo-full|slic-index-full|wordmark/i.test(tag)) {
        offenders.push(`${name}: ${tag.replace(/\s+/g, " ").slice(0, 90)}`);
      }
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

test("integrity: no raster asset is used for the site identity", () => {
  // The brand plates may exist as files (other projects reference them for
  // docs), but the web UI must not load one as its wordmark.
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    if (!/SiteMasthead|SiteFooter|BrandLockup/.test(name)) continue;
    // Match actual usage, not a prose mention inside a doc comment.
    const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    if (/slic-index-full\.png/.test(code) || /<img[^>]*slicLogo/.test(code)) {
      offenders.push(name);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Masthead/footer identity must be type, not a raster:\n  ${offenders.join("\n  ")}`,
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
  const BASELINE = 156;

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