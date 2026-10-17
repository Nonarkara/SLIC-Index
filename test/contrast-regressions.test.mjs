/**
 * Text-on-surface contrast regressions.
 *
 * Three defects shipped to production because nothing compared rendered text
 * against the surface actually behind it. All three were found by measuring
 * pixels on the deployed site, not by reading the stylesheet:
 *
 *   1. `.hp-photo-caption` — white 10.4px over the Taipei home photograph. The
 *      caption paints over open sky (rgb(155,198,214)) and measured 1.84:1. An
 *      earlier rule had put a gradient scrim behind it; a later refactor block
 *      set `background: none; padding: 0` and left only a text-shadow, which
 *      softens glyph edges but contributes nothing to measured contrast.
 *
 *   2. `.essay-byline` — rgba(248,245,240,0.45) over the essay hero
 *      photograph. Measured 3.98:1 against the 4.5:1 floor.
 *
 *   3. `.scorecard-transparency-pct` — the pillar coverage percentage rendered
 *      the raw pillar hue as text. Pressure is #d96629, which is 3.27:1 on
 *      cream, and 22px/600 is not WCAG "large", so the floor is 4.5:1. The
 *      project already had --pillar-text-shade (added for exactly this number,
 *      per the token's own comment) and applied it to three components; this
 *      fourth one was never wired to it and used an inline hex instead.
 *
 * Every assertion below fails on the pre-fix state:
 *   - the scrim test requires a `.hp-photo-break::after` rule, which did not
 *     exist, and requires the caption to stack ABOVE it — without the z-index
 *     the generated box composites over the glyphs and greys them, which is
 *     exactly how the first attempt at this fix looked correct in the numbers
 *     and wrong on screen;
 *   - the byline test recomputes the composited colour, so 0.45 fails and the
 *     replacement clears;
 *   - the pillar test recomputes all five hues, and the source guard rejects
 *     any inline `color:` on a pillar value.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CSS_RAW = readFileSync(path.join(ROOT, "src/styles.css"), "utf8");
// styles.css carries design rationale in block comments, and those comments name
// tokens while explaining them. Parse the stylesheet, never the commentary.
const CSS = CSS_RAW.replace(/\/\*[\s\S]*?\*\//g, "");
const SCORECARD = readFileSync(path.join(ROOT, "src/CityScorecardPage.tsx"), "utf8");

/* ── WCAG maths ─────────────────────────────────────────────────────────── */

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
function contrast(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
const over = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

/** Pull the rgb()/rgba() declaration a selector actually resolves to. */
function declaredColour(selector, property) {
  const re = new RegExp(`(^|[,{}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`, "g");
  let m;
  let out = null;
  while ((m = re.exec(CSS))) {
    const decl = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`).exec(m[2]);
    if (decl) out = decl[1].trim();
  }
  return out;
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function parseRgba(value) {
  const n = (value || "").match(/[\d.]+/g);
  if (!n) return null;
  return { rgb: n.slice(0, 3).map(Number), a: n.length > 3 ? Number(n[3]) : 1 };
}

const CREAM = hexToRgb("#f7f5ef");

/* ── 1. Photo caption needs a real scrim, stacked below the text ────────── */

test("home photo caption has a legibility scrim beneath it", () => {
  const scrim = /\.hp-photo-break::after\s*\{([^}]*)\}/.exec(CSS);
  assert.ok(scrim, ".hp-photo-break::after must exist — white caption text over a photograph has no other guarantee");

  const body = scrim[1];
  assert.match(body, /linear-gradient/, "the scrim must be a gradient so it releases before the top of the frame");

  // The caption line box sits in the bottom ~20% of the frame. The bottom stop
  // has to be dark enough that white clears 4.5:1 over a bright subject.
  const stops = [...body.matchAll(/rgba\(\s*0,\s*0,\s*0,\s*([\d.]+)\s*\)/g)].map((m) => Number(m[1]));
  assert.ok(stops.length >= 3, `expected a multi-stop scrim, found ${stops.length}`);
  const bottom = Math.max(...stops);
  assert.ok(
    bottom >= 0.8,
    `bottom scrim alpha ${bottom} is too weak; white text over a lit subject needs >= 0.8`,
  );

  // A worst-case bright subject under the scrim must still clear the floor.
  const brightSubject = [235, 235, 235];
  const worst = Math.min(...[0.62, 0.84, 0.9].map((a) => contrast([255, 255, 255], over([0, 0, 0], a, brightSubject))));
  assert.ok(worst >= 4.5, `white over a bright subject at the caption band measures ${worst.toFixed(2)}:1`);
});

test("photo caption stacks above its scrim, not under it", () => {
  const scrimZ = Number((/\.hp-photo-break::after\s*\{([^}]*)\}/.exec(CSS)?.[1].match(/z-index:\s*(\d+)/) || [])[1] ?? -1);
  const captionZ = Number((declaredColour(".hp-photo-caption", "z-index") || "").match(/(\d+)/)?.[1] ?? -1);

  assert.ok(scrimZ >= 0, "the scrim needs an explicit z-index");
  assert.ok(
    captionZ > scrimZ,
    `caption z-index ${captionZ} must exceed scrim z-index ${scrimZ}; generated ::after content paints as the last child, so without this the scrim composites over the glyphs`,
  );
});

/* ── 2. Essay byline is attribution, not decoration ────────────────────── */

test("essay byline is legible over the hero photograph", () => {
  const sibling = parseRgba(declaredColour(".essay-subtitle", "color"));
  const byline = parseRgba(declaredColour(".essay-byline", "color"));
  assert.ok(byline, ".essay-byline must declare a colour");
  assert.ok(sibling, ".essay-subtitle must declare a colour — the byline is matched to it");

  // The hero is a scrimmed photograph (.essay-hero-overlay). rgb(64,64,64) is a
  // deliberately conservative stand-in for an already-darkened hero: the real
  // backdrop measured rgb(38,40,37), and anything lighter is the harder case.
  const heroGround = [64, 64, 64];
  const cr = contrast(over(byline.rgb, byline.a, heroGround), heroGround);

  assert.ok(
    cr >= 4.5,
    `.essay-byline composited at alpha ${byline.a} measures ${cr.toFixed(2)}:1 on a scrimmed hero — under the 4.5:1 floor`,
  );
  assert.ok(
    byline.a >= sibling.a,
    `byline alpha ${byline.a} should not fall below .essay-subtitle's ${sibling.a}; the two sit on the same surface`,
  );
});

/* ── 3. Pillar hue as text uses the project's own shade ────────────────── */

const PILLARS = {
  pressure: "#d96629",
  viability: "#1a6b5a",
  capability: "#12354e",
  community: "#8c4a2a",
  creative: "#a72144",
};

test("pillar hue rendered as text on cream clears the 4.5:1 floor", () => {
  const shadeMatch = /--pillar-text-shade:\s*([\d.]+)%/.exec(CSS);
  assert.ok(shadeMatch, "--pillar-text-shade must be declared");
  const shade = Number(shadeMatch[1]) / 100;

  for (const [name, hex] of Object.entries(PILLARS)) {
    const raw = hexToRgb(hex);
    const shaded = raw.map((c) => Math.round(c * (1 - shade)));
    const cr = contrast(shaded, CREAM);
    assert.ok(
      cr >= 4.5,
      `${name} ${hex} as text on cream measures ${cr.toFixed(2)}:1 at a ${Math.round(shade * 100)}% shade — under the 4.5:1 floor`,
    );
  }

  // The shade exists because at least one hue fails raw. If that ever stops
  // being true the token is dead weight and this assertion should notice.
  const rawFails = Object.entries(PILLARS).filter(([, hex]) => contrast(hexToRgb(hex), CREAM) < 4.5);
  assert.ok(rawFails.length > 0, "expected at least one raw pillar hue to fail on cream");
});

test("pillar coverage percentage uses the shaded token, not an inline hex", () => {
  assert.doesNotMatch(
    SCORECARD,
    /style=\{\{\s*color:\s*PILLAR_COLORS/,
    "inline `color: PILLAR_COLORS[...]` bypasses --pillar-text-shade and ships the raw hue as text",
  );
  assert.match(
    SCORECARD,
    /className="scorecard-transparency-pct"[^>]*style=\{\{\s*"--pillar":\s*PILLAR_COLORS/,
    "the pillar coverage number must carry --pillar and the class that consumes the shaded token",
  );
  assert.match(
    CSS,
    /\.scorecard-transparency-pct\s*\{[^}]*color:\s*var\(--pillar-ink-text\)/,
    ".scorecard-transparency-pct must paint with --pillar-ink-text",
  );
  // --pillar-ink-text is only defined for elements inside this group.
  const group = /\.spider-slider-row,[\s\S]*?\{([^}]*)\}/.exec(CSS);
  assert.ok(group, "expected the pillar ink definition group");
  assert.match(
    group[1],
    /--pillar-ink-text:\s*color-mix\([^)]*\)/,
    "--pillar-ink-text must be derived via color-mix so it tracks the shade token",
  );
  assert.match(
    group[0],
    /\.scorecard-transparency-pct/,
    ".scorecard-transparency-pct must be inside the group that derives --pillar-ink-text",
  );
});