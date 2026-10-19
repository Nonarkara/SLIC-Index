/**
 * Anti-slop design invariants.
 *
 * The anti-slop rules (boxes-fit-content, balanced composition, A4/A5 measure,
 * no AI-slop fonts, no lazy ornaments, clear hierarchy, no filler) exist as prose
 * guidance. Prose guidance does not survive six months of well-meaning commits.
 * These tests turn the machine-checkable subset of the rules into gates.
 *
 * What is enforced here (static, decidable from source):
 *   rule 4 — no AI-slop font is ever loaded; family budget stays bounded
 *   rule 5 — no emoji-as-icon, no decorative icon tiles
 *   rule 7 — no rounded-everything, no filler copy in UI prose,
 *            no gradients that are not ink scrims over photography
 *   rule 3 — every prose container declares a measure cap in ch (A4/A5 rule)
 *
 * What cannot be enforced statically and needs a human/agent eyeball:
 *   rule 1 (boxes fit content)  → screenshot at 1440/1024/390
 *   rule 2 (balanced composition) → squint test at three widths
 *   rule 6 (something must win)  → squint test shows a focal point
 * Those are called out in docs/design/anti-slop-checklist.md.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");

const tsxFiles = readdirSync(join(ROOT, "src"))
  .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
  .map((f) => ({ name: f, text: readFileSync(join(ROOT, "src", f), "utf8") }));

/** Strip comments so guidance about banned fonts does not count as usage. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/* ──────────────────────────────────────────────────────────────────────
 * RULE 4 — No AI-slop fonts
 * ────────────────────────────────────────────────────────────────────── */

const BANNED_FAMILIES = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto",
  "Open Sans",
  "Lato",
  "DM Sans",
  "Space Grotesk",
  "Geist",
  "Plus Jakarta Sans",
  "Manrope",
  "Nunito",
];

test("rule 4: no AI-slop font is declared in any font-family", () => {
  const declarations = cssNoComments.match(/font-family:[^;}]+/g) ?? [];
  const offenders = [];
  for (const decl of declarations) {
    for (const banned of BANNED_FAMILIES) {
      if (new RegExp(`(^|[\\s,"'])${banned}([\\s,"']|$)`, "i").test(decl)) {
        offenders.push(`${banned} in: ${decl.trim().slice(0, 90)}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `AI-slop fonts must never be loaded:\n  ${offenders.join("\n  ")}\n` +
      `Use a Bauhaus/Bayer lookalike instead (Jost first; Prompt/Kanit for Thai).`,
  );
});

test("rule 4: the design font tokens name real editorial faces", () => {
  // The heading face must be a serif with a real weight range (the Libre
  // Baskerville 400/700 trap snapped every display heading to Bold), and the
  // body face must be a humanist sans, not a geometric-default slop face.
  const heading = cssNoComments.match(/--font-heading:\s*([^;]+);/)?.[1] ?? "";
  const body = cssNoComments.match(/--font-body:\s*([^;]+);/)?.[1] ?? "";
  assert.match(heading, /serif/i, "--font-heading must fall back to a generic serif");
  assert.ok(
    /Source Serif|Libre Baskerville|Charis|Noto Serif|Spectral|Iowan|Newsreader/i.test(heading),
    `--font-heading should name an editorial serif with a real weight range, got: ${heading.trim()}`,
  );
  assert.ok(
    /Source Sans|IBM Plex Sans|Noto Sans|IBM Plex Sans Thai/i.test(body),
    `--font-body should name a humanist sans, got: ${body.trim()}`,
  );
});

test("rule 4: at most two design families plus one data mono", () => {
  // A third *design* face (another text face) is the failure mode this rule
  // guards. Script fallbacks (Noto Sans SC/KR/JP for CJK, IBM Plex Sans Thai)
  // and the data mono do not count against the budget.
  const textFaces = new Set();
  for (const m of cssNoComments.matchAll(/--font-(heading|body|display|title|serif|sans)\s*:\s*([^;]+);/g)) {
    const first = m[2].split(",")[0].trim().replace(/["']/g, "");
    if (first && !/^(serif|sans-serif|monospace|system-ui|-apple-system|Georgia|monospace)$/i.test(first)) {
      textFaces.add(first);
    }
  }
  assert.ok(
    textFaces.size <= 2,
    `at most two design text families per product, found ${textFaces.size}: ${[...textFaces].join(", ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * RULE 7 / CLAUDE.md §14 — no rounded-everything
 * ────────────────────────────────────────────────────────────────────── */

test("rule 7: the radius token is zero and no rule reintroduces a radius", () => {
  assert.match(
    cssNoComments,
    /--radius:\s*0\s*;/,
    "--radius must stay 0. The Monocle-meets-Red-Dot identity is square corners.",
  );
  // A decorative radius on a single element is the same slop wearing a hat.
  const nonZero = [];
  for (const m of cssNoComments.matchAll(
    /([^{}]+)\{([^{}]*border-radius:[^}]*)\}/g,
  )) {
    for (const decl of m[2].matchAll(/border-radius:\s*([^;]+)/g)) {
      const v = decl[1].trim();
      if (v !== "0" && v !== "0px" && !/^(inherit|unset|revert)\b/i.test(v)) {
        nonZero.push(`${v} in ${m[1].trim().replace(/\s+/g, " ").slice(0, 70)}`);
      }
    }
  }
  assert.deepEqual(
    nonZero,
    [],
    `border-radius must stay 0 everywhere. Found:\n  ${nonZero.join("\n  ")}`,
  );
});

test("rule 7: decorative elevation shadows stay at or under 3", () => {
  // ANTI-SLOP.md hard limit #1: "<=3 drop shadows. Separate with space and
  // rules, not shadows." Measured: 68% of slop apps had >=8 shadows and no
  // clean app did (median 14 vs 1).
  //
  // Focus rings are exempt. They are WCAG requirements, not fake depth, and
  // a gate that makes you delete a keyboard focus indicator is a gate you
  // route around.
  const elevation = [];
  for (const m of cssNoComments.matchAll(/([^{}]+)\{([^{}]*box-shadow:[^}]*)\}/g)) {
    const sel = m[1];
    if (/:focus-visible|:focus-within/.test(sel)) continue; // focus ring, exempt
    for (const d of m[2].matchAll(/box-shadow:\s*([^;]+)/g)) {
      const v = d[1].trim();
      if (v === "none" || /^(inherit|unset|revert)\b/i.test(v)) continue;
      elevation.push(`${v.slice(0, 40)} in ${sel.trim().replace(/\s+/g, " ").slice(0, 50)}`);
    }
  }
  assert.ok(
    elevation.length <= 3,
    `at most 3 decorative drop shadows (ANTI-SLOP.md limit #1), found ${elevation.length}:\n  ${elevation.join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * RULE 5 — no emoji as icons, no lazy ornaments
 * ────────────────────────────────────────────────────────────────────── */

test("rule 5: no emoji is used as an icon in JSX text content", () => {
  // Pictographic blocks an LLM reaches for when it wants an icon: misc symbols,
  // dingbats, emoji presentation, transport, geometric shapes.
  //
  // Keyboard and navigation glyphs (↑ ↓ ↵ ⌘ ⌥ ⇧ esc glyphs) are deliberately
  // EXCLUDED. They are accessibility affordances — a <kbd> hint for Cmd+K, an
  // arrow-key reminder in the search field — not decoration, and banning them
  // would delete real keyboard guidance from the UI.
  const emoji =
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}]/u;
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    const code = stripComments(text);
    for (const m of code.matchAll(/>([^<>{}]*)<|\{"([^"]{1,40})"\}/g)) {
      const snippet = m[1] ?? m[2] ?? "";
      const trimmed = snippet.trim();
      // A snippet that is only a keyboard/shortcut glyph is a kbd hint, not an icon.
      if (!trimmed) continue;
      if (/^[\u{2190}-\u{21FF}\u{2318}\u{2325}\u{2317}\u{21E7}\u{2B05}\u{21B5}\s]+$/u.test(trimmed)) continue;
      if (emoji.test(trimmed)) {
        offenders.push(`${name}: ${trimmed.slice(0, 50)}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `emoji are banned as icons (keyboard glyphs like ⌘K and ↑↓ are exempt — they are affordances):\n  ${offenders.join("\n  ")}`,
  );
});

test("rule 5: gradients are ink scrims over photography, not decoration", () => {
  // A gradient that interpolates two brand colours is the "generic gradient
  // hero" the rules call out. A gradient whose stops are all near-black/transparent
  // is a legibility scrim and is allowed.
  const offenders = [];
  for (const m of cssNoComments.matchAll(
    /(linear-gradient|radial-gradient)\(([^;]*?)\)/g,
  )) {
    const stops = m[2];
    // Allow only stops that are transparent or a dark ink (rgb channel 0–70).
    const colours = stops.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/gi) ?? [];
    for (const c of colours) {
      let dark = false;
      const rgb = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (rgb) dark = Math.max(+rgb[1], +rgb[2], +rgb[3]) <= 70;
      else if (/^#[0-9a-f]{3,8}$/i.test(c)) {
        let h = c.slice(1);
        if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((x) => x + x).join("");
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        dark = Math.max(r, g, b) <= 70;
      }
      if (/transparent/i.test(c)) continue;
      if (!dark) {
        offenders.push(`non-scrim gradient stop ${c} in ${m[0].slice(0, 60)}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `gradients must be dark ink scrims for legibility over photos, not decoration:\n  ${offenders.slice(0, 6).join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * RULE 3 — the A4/A5 readable-measure rule
 * ────────────────────────────────────────────────────────────────────── */

test("rule 3: prose containers cap their measure in ch, not px", () => {
  // The long-form reading surfaces. Each must declare its own measure so the
  // column never runs full-bleed on an ultrawide. ch is required (not px/rem)
  // so the measure tracks the type size when the scale changes.
  const proseSelectors = [
    ".essay-body",
    ".essay-abstract",
    ".essay-subtitle",
    ".history-archive-intro",
    ".history-subtitle",
    ".data-sources-page .hero-intro",
    ".methodology-horizon-card",
    ".scorecard-tier-bridge",
    ".scorecard-equation-note",
  ];
  const problems = [];
  for (const sel of proseSelectors) {
    const m = cssNoComments.match(new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`));
    if (!m) {
      problems.push(`${sel}: rule not found (did the class get renamed?)`);
      continue;
    }
    const mw = m[1].match(/max-width:\s*(\d+(?:\.\d+)?)(ch|rem|px|em)/);
    if (!mw) {
      problems.push(`${sel}: no max-width`);
      continue;
    }
    const [, value, unit] = mw;
    if (unit !== "ch") {
      problems.push(`${sel}: max-width is ${value}${unit} — use ch so the measure tracks the type`);
      continue;
    }
    const chars = Number(value);
    // ANTI-SLOP.md hard limit #2: "<=65ch for prose" (measured: 64% of slop
    // apps went over 40em; median line 61em vs 26em for clean apps).
    if (chars > 65) problems.push(`${sel}: ${chars}ch is over the 65ch A4/A5 ceiling (ANTI-SLOP.md limit #2)`);
    if (chars < 45) problems.push(`${sel}: ${chars}ch is under the 45ch floor — the column will look ragged`);
  }
  assert.deepEqual(
    problems,
    [],
    `rule 3 (A4/A5 measure):\n  ${problems.join("\n  ")}`,
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * RULE 7 — no filler copy in UI prose
 * ────────────────────────────────────────────────────────────────────── */

test("rule 7: UI prose carries no marketing filler", () => {
  // Scoped deliberately: citation labels, metric names and article titles are
  // allowed to contain words like "Harness" or "Empowerment" because those are
  // the real names of real sources. Only free marketing prose is checked, which
  // is the locale string tables — the copy a reader actually reads as editorial
  // voice. Ambiguous phrases that are also real proper nouns ("the Conference on
  // the Future of Europe") are excluded rather than risk a false positive that
  // trains people to ignore the gate.
  const FILLER = [
    "unlock the power",
    "seamlessly",
    "revolutioniz",
    "game-chang",
    "cutting-edge",
    "in today's fast",
    "dive in",
    "elevate your",
    "supercharge",
    "best-in-class",
    "world-class experience",
    "take it to the next level",
    "unleash",
    "empower your",
  ];
  const offenders = [];
  for (const { name, text } of tsxFiles) {
    if (!/Translations\.ts$|Copy\.tsx?$|copy\.ts$/i.test(name)) continue;
    const code = stripComments(text).toLowerCase();
    for (const f of FILLER) {
      if (code.includes(f)) offenders.push(`${name}: "${f}"`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `filler copy in editorial prose:\n  ${offenders.join("\n  ")}`,
  );
});

test("rule 6: the homepage has a declared type-scale with real steps", () => {
  // Rule 6 asks for at least a 1.5–2× type step between levels. Prove the
  // display range exists rather than trusting a comment.
  const px = [...cssNoComments.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1]));
  assert.ok(px.length > 20, "expected a real type scale in the stylesheet");
  const min = Math.min(...px);
  const max = Math.max(...px);
  assert.ok(
    max / min >= 1.8,
    `display type must clear body type by at least 1.8× (found ${min}px → ${max}px = ${(max / min).toFixed(2)}×)`,
  );
});