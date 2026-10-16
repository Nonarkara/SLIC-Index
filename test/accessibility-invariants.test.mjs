/**
 * Accessibility invariants — focus indicators and the derived publication facts.
 *
 * These tests exist because two real defects shipped to production without any
 * gate catching them:
 *
 *   1. Every focus rule pointed at --accent-amber (#f99d1b), which is 1.95:1 on
 *      the cream ground. WCAG 2.2 SC 1.4.11 requires >=3:1 for a focus
 *      indicator, so every link, button, input and select on every page had a
 *      near-invisible keyboard focus ring. One control (.quick-search-input)
 *      had `outline: none` with no replacement at all.
 *
 *   2. The footer claimed "Last published: May 2026" on every locale while the
 *      published bundle was generated 2026-07-04 — two months stale. The same
 *      line stated three different facts across five locales (en/th/zh gave a
 *      date; ko said "per v3.4.0"; ja said "as of the v3.4.0 publication
 *      date"). The citation line formatted the authors three different ways.
 *
 * Both were invisible to `tsc`, to `vite build`, and to the 25 existing
 * invariant tests, because nothing compared the stylesheet against WCAG or the
 * footer against the bundle it describes.
 *
 * Each assertion below is written to FAIL on the pre-fix state:
 *   - the contrast test resolves the actual token value, so pointing a focus
 *     rule back at --accent-amber drops it to 1.95:1 and trips the 3:1 gate;
 *   - the vintage test reads publicationManifest.generatedAt, so any hardcoded
 *     month that drifts from the bundle trips it;
 *   - the parity tests compare the five locale renderings of the same fact, so
 *     a locale that drops the date, or invents its own author string, trips it.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CSS_RAW = readFileSync(path.join(ROOT, "src/styles.css"), "utf8");

/**
 * Strip CSS comments before any parsing. styles.css carries design rationale
 * in block comments, and those comments name tokens (`--accent-amber:`,
 * `--focus:`) while explaining them. A naive `--token: value;` scan reads the
 * comment prose as a declaration whose greedy value swallows the real token
 * that follows, which silently hides tokens from the whole audit. Comments are
 * documentation here, never declarations.
 */
const CSS = CSS_RAW.replace(/\/\*[\s\S]*?\*\//g, "");

/* ── WCAG relative luminance + contrast ─────────────────────────────────── */

const hex = (h) => {
  const s = h.replace("#", "").trim();
  const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const over = (fg, bg, alpha) => fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));

const luminance = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Every `--name: value;` declared in any `:root` block. */
function cssTokens(source) {
  const tokens = {};
  const rootBlocks = source.match(/:root\s*\{[^}]*\}/g) ?? [];
  for (const block of rootBlocks) {
    for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      tokens[m[1]] = m[2].trim();
    }
  }
  return tokens;
}

const TOKENS = cssTokens(CSS);
const tokenValue = (name) => {
  const raw = TOKENS[name];
  assert.ok(raw, `expected a --${name.replace(/^--/, "")} token in styles.css`);
  return raw;
};

/** Resolve `var(--x, #fallback)` / `#literal` to a hex triple. */
function resolveColour(value) {
  const v = value.trim();
  const varMatch = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)$/i);
  if (varMatch) {
    const resolved = TOKENS[varMatch[1]] ?? varMatch[2];
    assert.ok(resolved, `unresolvable token ${varMatch[1]}`);
    return resolveColour(resolved);
  }
  const hexMatch = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  assert.ok(hexMatch, `focus colour "${v}" is not a resolvable hex or var()`);
  return hex(hexMatch[1]);
}

/** Every rule block that sets an outline on a focus pseudo-class. */
function focusOutlineRules(source) {
  const found = [];
  const re = /([^{}]*(?::focus-visible|:focus)\b[^{}]*)\{([^}]*)\}/g;
  for (const m of source.matchAll(re)) {
    const [, selector, body] = m;
    const outline = body.match(/(?:^|;)\s*outline\s*:\s*([^;]+)/i);
    const outlineColour = body.match(/(?:^|;)\s*outline-color\s*:\s*([^;]+)/i);
    if (outline || outlineColour) {
      found.push({
        selector: selector.replace(/\s+/g, " ").trim(),
        outline: outline?.[1]?.trim() ?? null,
        outlineColour: outlineColour?.[1]?.trim() ?? null,
      });
    }
  }
  return found;
}

/**
 * Pull the colour token out of an `outline` shorthand
 * (`<width> <style> <colour>` in any order). The width may also be a var()
 * (`var(--focus-width)`), so candidates are probed in order and the first one
 * that resolves to an actual hex colour wins — not simply the first token.
 */
function colourFromOutlineShorthand(value) {
  const parts = value.trim().split(/\s+/);
  for (const part of parts) {
    if (!/^(var\(|#)/i.test(part)) continue;
    try {
      const rgb = resolveColour(part);
      if (rgb.every((n) => Number.isFinite(n))) return part;
    } catch {
      /* not a colour — keep probing the remaining parts */
    }
  }
  return null;
}

/**
 * Dark-surface selectors must be measured against ink, not the cream ground.
 * The hero masthead sits on a translucent scrim over a photo; the search modal
 * sits on #191714. Measuring those against --bg would report a false failure
 * for a rule that is correct in context — and, worse, would hide a real one if
 * the pairing were ever wrong. Each entry names the background to test against.
 */
const DARK_SURFACES = [
  { match: /\.mh--hero:not\(\.mh--scrolled\)/, bg: "scrim", note: "hero masthead scrim" },
  { match: /\.quick-search-card\b/, bg: "#191714", note: "search modal" },
  { match: /\.quick-search-backdrop\b/, bg: "#12100d", note: "search backdrop" },
];

function surfaceFor(selector) {
  for (const entry of DARK_SURFACES) {
    if (entry.match.test(selector)) return entry;
  }
  return { bg: null, note: "cream ground" };
}

const FOCUS_MIN = 3.0; // WCAG 2.2 SC 1.4.11 Non-text Contrast

/** Worst-case composite of the translucent hero scrim over the brightest photo. */
function heroScrimWorstCase() {
  const ink = resolveColour(tokenValue("--text"));
  return over(ink, [255, 255, 255], 0.68);
}

/* ── 1. Focus indicator contrast ─────────────────────────────────────────── */

test("focus tokens are declared for both light and dark surfaces", () => {
  assert.ok(tokenValue("--focus"), "--focus must exist");
  assert.ok(tokenValue("--focus-on-dark"), "--focus-on-dark must exist");
});

test("--focus clears 3:1 on the cream ground; --focus-on-dark clears 3:1 on ink", () => {
  const bg = resolveColour(tokenValue("--bg"));
  const ink = resolveColour(tokenValue("--text"));

  const onLight = contrast(resolveColour(tokenValue("--focus")), bg);
  const onDark = contrast(resolveColour(tokenValue("--focus-on-dark")), ink);

  assert.ok(
    onLight >= FOCUS_MIN,
    `--focus on --bg is ${onLight.toFixed(2)}:1, below the ${FOCUS_MIN}:1 floor`,
  );
  assert.ok(
    onDark >= FOCUS_MIN,
    `--focus-on-dark on --text is ${onDark.toFixed(2)}:1, below the ${FOCUS_MIN}:1 floor`,
  );
});

test("every focus rule that paints an outline resolves to a >=3:1 indicator", () => {
  const cream = resolveColour(tokenValue("--bg"));
  const rules = focusOutlineRules(CSS);
  assert.ok(rules.length > 0, "expected focus-visible rules in styles.css");

  const failures = [];
  for (const rule of rules) {
    // A bare `outline: none` removes the indicator. That is only acceptable
    // when the same rule block restores one via outline-color or box-shadow.
    if (rule.outline === "none") continue;

    let value = rule.outlineColour;
    if (!value && rule.outline) value = colourFromOutlineShorthand(rule.outline);
    if (!value) continue;

    let rgb;
    try {
      rgb = resolveColour(value);
    } catch {
      failures.push(`${rule.selector} — could not resolve "${value}"`);
      continue;
    }

    const surface = surfaceFor(rule.selector);
    let bg = cream;
    if (surface.bg === "scrim") bg = heroScrimWorstCase();
    else if (typeof surface.bg === "string" && surface.bg.startsWith("#")) bg = resolveColour(surface.bg);

    const ratio = contrast(rgb, bg);
    if (ratio < FOCUS_MIN) {
      failures.push(
        `${rule.selector} — ${ratio.toFixed(2)}:1 against ${surface.note} (needs ${FOCUS_MIN}:1)`,
      );
    }
  }

  assert.deepEqual(
    failures,
    [],
    `focus indicators below the WCAG 2.2 SC 1.4.11 ${FOCUS_MIN}:1 floor:\n  ${failures.join("\n  ")}`,
  );
});

test("the hero focus ring stays legible over a bright photo via the two-tone guard", () => {
  // The masthead scrim is translucent, so a single-colour ring cannot hold 3:1
  // across the whole backdrop range. The rule pairs a dark inner guard edge
  // with the light outer edge; at least one of the two must clear 3:1 no
  // matter how bright the photo behind the scrim is.
  const rule = CSS.match(
    /\.mh--hero:not\(\.mh--scrolled\)[^{]*:focus-visible\s*\{([^}]*)\}/,
  );
  assert.ok(rule, "expected a hero-masthead focus rule");
  assert.match(
    rule[1],
    /box-shadow\s*:[^;]*var\(--focus-on-dark-guard/,
    "the hero focus ring needs the dark inner guard edge to survive a bright photo",
  );

  // The two-tone pairing must clear 3:1 on both extremes of the backdrop.
  const outer = resolveColour(tokenValue("--focus-on-dark"));
  const inner = resolveColour(tokenValue("--focus-on-dark-guard"));
  for (const [label, photo] of [["bright", [255, 255, 255]], ["dark", [0, 0, 0]]]) {
    const bg = over(resolveColour(tokenValue("--text")), photo, 0.68);
    const best = Math.max(contrast(outer, bg), contrast(inner, bg));
    assert.ok(
      best >= FOCUS_MIN,
      `two-tone hero ring peaks at ${best.toFixed(2)}:1 over a ${label} photo`,
    );
  }
});

test("the focus ring never falls back to the graphic-fill accent token", () => {
  // --accent-amber is a fill/accent token. It reads 1.95:1 on the cream ground,
  // so a focus rule that points at it reintroduces the original defect.
  const rules = focusOutlineRules(CSS);
  const offenders = rules.filter((r) =>
    (r.outline ?? r.outlineColour ?? "").includes("--accent-amber"),
  );
  assert.deepEqual(
    offenders.map((r) => r.selector),
    [],
    "focus rules must use --focus / --focus-on-dark, never --accent-amber",
  );
});

test("no interactive control is left with outline:none and no replacement", () => {
  // .quick-search-input shipped with `outline: none` and nothing in its block,
  // so a keyboard user had no cue that the caret was in the search field.
  const block = CSS.match(/\.quick-search-input\s*\{([^}]*)\}/);
  assert.ok(block, "expected a .quick-search-input rule");
  assert.match(
    block[1],
    /outline\s*:\s*none/,
    "the borderless input still needs its own focus block",
  );
  const focusBlock = CSS.match(/\.quick-search-input:focus-visible\s*\{([^}]*)\}/);
  assert.ok(
    focusBlock,
    ".quick-search-input must restore an indicator under :focus-visible",
  );
  assert.match(
    focusBlock[1],
    /(box-shadow|outline-color|outline)\s*:/,
    ".quick-search-input:focus-visible must paint a visible indicator",
  );
});

/* ── 2. Publication facts are derived, not asserted ──────────────────────── */

const publication = JSON.parse(
  readFileSync(path.join(ROOT, "src/data/publishedRankingData.json"), "utf8"),
);
const GENERATED_AT = publication.publicationManifest.generatedAt;
const GENERATED_MONTH_EN = new Date(GENERATED_AT).toLocaleString("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const footerRaw = readFileSync(path.join(ROOT, "src/SiteFooter.tsx"), "utf8");
// Strip comments before scanning for literals. SiteFooter documents the defect it
// fixed, and a literal-phrase scan reads that rationale as a fresh violation.
// Any audit that greps source for forbidden strings hits this — either describe
// the boundary generically in comments, or exclude comments explicitly as here.
const footer = footerRaw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

test("the footer derives its vintage line instead of hardcoding a date", () => {
  assert.match(
    footer,
    /dataVintageLine\(locale\)/,
    "SiteFooter must call the derived dataVintageLine(), not inline a month",
  );
  assert.doesNotMatch(
    footer,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d\d/,
    "no literal month+year may live in SiteFooter.tsx",
  );
});

test("the published month reported by the derived line matches the bundle", async () => {
  const { publishedMonth } = await import("../src/publicationMeta.ts");
  assert.equal(
    publishedMonth("en"),
    GENERATED_MONTH_EN,
    "the advertised publication month must equal publicationManifest.generatedAt",
  );
});

test("all five locales render the same publication date", async () => {
  const { dataVintageLine, publishedMonth } = await import("../src/publicationMeta.ts");
  const locales = ["en", "th", "zh", "ko", "ja"];

  // Every locale must carry the publication YEAR in its own calendar. Thai uses
  // the Buddhist Era (+543), so "2026" legitimately appears there as "2569" —
  // checking for the Gregorian string in Thai would flag correct localisation
  // as a missing fact, which is the mirror image of the original bug.
  const gregorianYear = String(new Date(GENERATED_AT).getUTCFullYear());
  for (const locale of locales) {
    const line = dataVintageLine(locale);
    const yearForms = locale === "th" ? [gregorianYear, String(Number(gregorianYear) + 543)] : [gregorianYear];
    assert.ok(
      yearForms.some((y) => line.includes(y)),
      `locale ${locale} omits the publication year: "${line}"`,
    );
  }

  // And the rendered month must equal the bundle's, per locale. Before the fix
  // ko and ja stated "per v3.4.0" with no date at all.
  for (const locale of locales) {
    assert.ok(
      dataVintageLine(locale).includes(publishedMonth(locale)),
      `locale ${locale} does not carry its own month label`,
    );
  }
});

test("all five locales render the same citation authors", async () => {
  const { citationLine } = await import("../src/publicationMeta.ts");
  const canonical = "Arkara, N. & Thiengburanathum, P.";

  for (const locale of ["en", "th", "zh", "ko", "ja"]) {
    assert.ok(
      citationLine(locale).includes(canonical),
      `${locale} citation drops the canonical author string`,
    );
  }
});

test("no locale invents an academic honorific in the citation", async () => {
  const { citationLine } = await import("../src/publicationMeta.ts");
  // ko/ja previously appended 부교수 / 准教授. No other locale carried a title,
  // so a reader switching languages got a different author identity.
  for (const locale of ["en", "th", "zh", "ko", "ja"]) {
    const line = citationLine(locale);
    assert.doesNotMatch(line, /부교수|准教授|副教授/, `${locale} adds an honorific`);
  }
});

/**
 * The assertions above validate publicationMeta.ts. On their own they would
 * still pass while SiteFooter kept its own divergent per-locale literals —
 * which is exactly the state the footer shipped in. These two tests close that
 * gap by asserting the footer ASSIGNS those values from the helpers, with no
 * locale ternary of its own. If someone re-inlines a hardcoded month or a
 * hand-formatted author string, the assignment stops matching and both fail.
 */
test("the footer assigns vintage and citation straight from the helpers", () => {
  const vintageAssign = footer.match(/const\s+vintageNote\s*=([^;]+);/);
  const citationAssign = footer.match(/const\s+citation\s*=([^;]+);/);
  assert.ok(vintageAssign, "expected a vintageNote assignment in SiteFooter");
  assert.ok(citationAssign, "expected a citation assignment in SiteFooter");

  assert.match(
    vintageAssign[1],
    /^[\s\S]*dataVintageLine\(locale\)[\s\S]*$/,
    "vintageNote must come from dataVintageLine(locale) alone",
  );
  assert.match(
    citationAssign[1],
    /^[\s\S]*citationLine\(locale\)[\s\S]*$/,
    "citation must come from citationLine(locale) alone",
  );

  // A locale branch inside either assignment reintroduces the divergence the
  // helper was written to remove.
  for (const [name, expr] of [["vintageNote", vintageAssign[1]], ["citation", citationAssign[1]]]) {
    assert.doesNotMatch(
      expr,
      /locale\s*===/,
      `${name} branches per locale inside SiteFooter; that is how the five locales drifted apart`,
    );
  }
});

test("the footer's citation and credit cards carry no author literal of their own", () => {
  // Scoped deliberately. The funding-disclosure card names both authors with
  // their roles ("lead author", "research advisor") because that paragraph is
  // about editorial independence, and templating it would damage the prose.
  // The defect this guards is narrower: the CITATION and CREDIT cards each used
  // to carry their own author string, so ko/ja drifted onto full names plus an
  // honorific while en/th/zh used the APA surname-initial form.
  const creditBodies = [...footer.matchAll(/creditBody:\s*(`[\s\S]*?`|"[^"]*"),\n/g)].map(
    (m) => m[1],
  );
  assert.equal(creditBodies.length, 5, `expected five creditBody values, saw ${creditBodies.length}`);
  for (const body of creditBodies) {
    assert.match(
      body,
      /authorProse\("(en|th|zh|ko|ja)"\)/,
      "each creditBody must interpolate authorProse() for its locale",
    );
  }
});

test("the advertised scorer version equals the bundle's scorerVersion", async () => {
  const { SCORE_MODEL_VERSION_SHORT } = await import("../src/publicationMeta.ts");
  assert.equal(
    SCORE_MODEL_VERSION_SHORT,
    publication.publicationManifest.scorerVersion.replace(/^slic-/, ""),
  );
  assert.match(footer, /SCORE_MODEL_VERSION_SHORT/, "the footer must derive its version badge");
  assert.doesNotMatch(footer, /INDEX v\d+\.\d+\.\d+/, "no literal version badge in SiteFooter");
});

test("city-count claims are derived from the bundle, not typed by hand", () => {
  const masthead = readFileSync(path.join(ROOT, "src/SiteMasthead.tsx"), "utf8");
  const search = readFileSync(path.join(ROOT, "src/QuickSearchModal.tsx"), "utf8");
  for (const [name, source] of [["SiteMasthead", masthead], ["QuickSearchModal", search]]) {
    assert.ok(
      source.includes("CITY_TOTAL"),
      `${name} must interpolate CITY_TOTAL rather than typing a count`,
    );
  }
});

/**
 * The Wada palette darkened two hues the old 27% lift and 10% text-shade were
 * calibrated for. Capability (#12354e) numbers on the dark allocator fell to
 * 3.38:1, and Pressure (#d96629) numbers on the cream rankings page fell to
 * 3.95:1. White on the amber Beta chip was 2.13:1. These tests recompute the
 * mixes from the live tokens and the pillar hexes, so retuning either side
 * without the other fails here instead of on the page.
 */
function pillarHex(id) {
  const source = readFileSync(path.join(ROOT, "src/pillars.ts"), "utf8");
  const match = source.match(new RegExp(`${id}:\\s*"(#[0-9a-fA-F]{6})"`));
  assert.ok(match, `expected a ${id} hex in pillars.ts`);
  return hex(match[1]);
}

const mixToward = (rgb, target, amount) =>
  rgb.map((c, i) => Math.round(c * (1 - amount) + target[i] * amount));

test("amber-filled rules never set white text", () => {
  const offenders = [];
  for (const m of CSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = m[2];
    const amberFill = /background(?:-color)?\s*:\s*var\(\s*--accent-amber\s*\)/.test(body);
    const whiteText = /(?:^|;)\s*color\s*:\s*(#fff\b|#ffffff\b|white\b)/i.test(body);
    if (amberFill && whiteText) offenders.push(m[1].replace(/\s+/g, " ").trim());
  }
  assert.deepEqual(offenders, []);
});

test("beta badge ink clears 4.5:1 on the amber chip", () => {
  const block = CSS.match(/\.v3-tier-badge--beta\s*\{([^}]*)\}/);
  assert.ok(block, "expected .v3-tier-badge--beta");
  const color = block[1].match(/(?:^|;)\s*color\s*:\s*([^;]+)/);
  assert.ok(color, "beta badge must set a color");
  const ratio = contrast(resolveColour(color[1]), resolveColour(tokenValue("--accent-amber")));
  assert.ok(ratio >= 4.5, `beta badge text is ${ratio.toFixed(2)}:1 on amber`);
});

test("pillar numbers clear 4.5:1 on both allocator surfaces", () => {
  const shade = parseFloat(tokenValue("--pillar-text-shade")) / 100;
  assert.ok(shade > 0 && shade < 1, "expected a --pillar-text-shade percentage");
  const dark = CSS.match(/\.v3-spider-full\s*,\s*\.compare-spider-widget\s*\{([^}]*)\}/);
  assert.ok(dark, "expected the dark allocator token block");
  const liftDecl = dark[1].match(/--pillar-lift\s*:\s*([\d.]+)%/);
  assert.ok(liftDecl, "dark allocator must set --pillar-lift");
  const lift = parseFloat(liftDecl[1]) / 100;

  const cream = resolveColour(tokenValue("--bg"));
  const ink = resolveColour(tokenValue("--text"));
  const pressureOnCream = contrast(mixToward(pillarHex("pressure"), [0, 0, 0], shade), cream);
  const capabilityOnInk = contrast(mixToward(pillarHex("capability"), [255, 255, 255], lift), ink);

  assert.ok(
    pressureOnCream >= 4.5,
    `pressure text on cream is ${pressureOnCream.toFixed(2)}:1 at shade ${shade}`,
  );
  assert.ok(
    capabilityOnInk >= 4.5,
    `capability text on ink is ${capabilityOnInk.toFixed(2)}:1 at lift ${lift}`,
  );
});

test("the hero masthead search trigger is painted for the dark scrim", () => {
  const block = CSS.match(/\.mh--hero:not\(\.mh--scrolled\) \.mh-search-btn\s*\{([^}]*)\}/);
  assert.ok(block, "hero search button needs its own color; the base rule is cream-ground ink");
  assert.match(block[1], /color:\s*#f8f5f0|color:\s*var\(\s*--text-inverse\s*\)/);
  assert.ok(tokenValue("--border-inverse"), "ink controls need a defined inverse border");
});