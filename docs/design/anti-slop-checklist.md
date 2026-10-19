# Anti-slop pre-ship checklist — the enforcement map

**The rules live in [`ANTI-SLOP.md`](../../ANTI-SLOP.md).** That file is the prose
source of truth and it wins if anything here disagrees with it. This file only
answers a narrower question: *which of those rules does a test catch, and which
ones still need eyes on pixels?*

## What the test catches

`test/design-slop-invariants.test.mjs` — 10 tests, runs on every `npm test`,
currently all green.

| ANTI-SLOP.md limit | Gate |
|---|---|
| #1 ≤3 drop shadows | `rule 7: decorative elevation shadows stay at or under 3` |
| #2 ≤65ch for prose | `rule 3: prose containers cap their measure in ch, not px` |
| #3 one radius or none | `rule 7: the radius token is zero and no rule reintroduces a radius` |
| #4 ≤8 sizes, 1.5–2× step | `rule 6: the homepage has a declared type-scale with real steps` (step only) |
| No AI-slop fonts | `rule 4: …` (3 tests — banned families, real serif heading token, ≤2 design families) |
| No emoji-as-icon | `rule 5: no emoji is used as an icon in JSX text content` |
| No decorative gradients | `rule 5: gradients are ink scrims over photography, not decoration` |
| No filler copy | `rule 7: UI prose carries no marketing filler` |

## What still needs a human (or a different agent)

Three rules are not decidable from source. Run these before shipping.

### 1 · Boxes fit their content
- [ ] No card/panel/button noticeably wider or taller than the text inside it.
- [ ] Padding proportional to its type size (≈0.5–1.5× line height), not a fixed fat value.
- [ ] No `min-height` leaving dead space under a short string.

### 2 · Balanced composition
- [ ] Screenshot at **1440**, **1024**, **390**.
- [ ] No heavy column beside an empty one; no orphan block.
- [ ] Squint at each — the visual masses should balance.

### 6 · Something must win
- [ ] One obvious first look (the hero number, the headline, the spider), then a clear second and third.
- [ ] The squinted screenshot has a visible focal point.
- [ ] No grid of equal-weight cards.

### Method
1. Screenshot 1440 / 1024 / 390.
2. List every hit with the element.
3. Fix, then re-screenshot.
4. **A different agent or person reviews. Never self-review** — the eye that built it is the eye that misses it.

## Known deviations, recorded rather than hidden

- **Rule #4 (≤8 font sizes) is not fully enforced.** The stylesheet has 16 distinct
  `px` sizes plus 59 fluid `clamp()` steps. Fluid responsive type needs more
  steps than a static scale, so the gate checks only the 1.5–2× step between
  display and body. The count is tracked here rather than silently ignored.
- **Type sizes below the prose floor** (9px, 10px, 11px micro-labels) exist for
  mono data chips. They are below ANTI-SLOP.md's readability intent but are
  data labels, not body copy.

## Exemptions, encoded in the test body not left implicit

- **Keyboard glyphs are exempt from the emoji ban.** `⌘K` on the masthead search
  trigger and `↑ ↓ ↵` in the quick-search field are accessibility affordances,
  not decoration. The first version of that test flagged all seven and was wrong.
- **Focus rings are exempt from the shadow cap.** They are WCAG requirements.
- **Citations and metric names are exempt from the filler ban.** "Empowerment" is
  the real HRMI index name; "Conference on the Future of Europe" is a real EU
  institution. The ban is scoped to the locale string tables. A gate that cries
  wolf on real source names gets ignored within a week.

## Adding a rule later

Prefer a test to a line of prose. If a rule genuinely cannot be decided from
source, put it in this file and say so — do not half-enforce it with so many
carve-outs that it stops catching anything. **A gate with carve-outs is a gate
people route around.**