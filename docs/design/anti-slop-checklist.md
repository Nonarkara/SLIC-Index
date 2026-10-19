# Anti-slop pre-ship checklist (SLIC Index)

The machine-checkable half of the anti-slop rules lives in
`test/design-slop-invariants.test.mjs` and runs on every `npm test`:

| Rule | Enforced by test | What it locks |
|---|---|---|
| 3 · A4/A5 measure | `rule 3: prose containers cap their measure in ch, not px` | every prose container declares a 45–75ch measure in `ch` |
| 4 · No AI-slop fonts | `rule 4: …` (3 tests) | no banned family in any `font-family`; ≤2 design text families; heading token is a real editorial serif |
| 5 · No lazy ornaments | `rule 5: …` (2 tests) | no emoji-as-icon; gradients are dark ink scrims only |
| 6 · Clear hierarchy | `rule 6: the homepage has a declared type-scale with real steps` | display clears body by ≥1.8× |
| 7 · More slop | `rule 7: …` (2 tests) | `--radius: 0` and no rule reintroduces a radius; no marketing filler in locale prose |

Three rules **cannot** be decided from source. They need eyes on pixels. Run
this before any ship.

## 1 · Boxes fit their content
- [ ] No card/panel/button noticeably wider or taller than the text inside it.
- [ ] Padding looks proportional to its type size (roughly 0.5–1.5× line height),
      not a fixed fat value applied everywhere.
- [ ] No `min-height` leaving dead space under a short string.

## 2 · Balanced composition
- [ ] Screenshot at **1440**, **1024**, **390**.
- [ ] No heavy column beside an empty one; no orphan block floating alone.
- [ ] Squint at each: the visual masses should balance.

## 6 · Clear hierarchy — something must win
- [ ] One obvious first look (the hero number, the headline, the spider).
      Then a clear second and third.
- [ ] The squinted screenshot has a visible focal point.
- [ ] No grid of equal-weight cards where everything shouts equally.

## Method
1. Screenshot 1440 / 1024 / 390.
2. List every hit against rules 1, 2, 6 with the element.
3. Fix, then re-screenshot.
4. **A different agent or person checks the result. Never self-review** — the
   eye that built it is the eye that misses it.

## Additions made on this codebase

Two exemptions are deliberate and are encoded in the test comments, not left
implicit:

- **Keyboard glyphs are exempt from the emoji ban.** `⌘K` on the masthead
  search trigger and the `↑ ↓ ↵` hints in the quick-search field are
  accessibility affordances, not decoration. Banning them would delete real
  keyboard guidance.
- **Academic citations and metric names are exempt from the filler-copy ban.**
  "Empowerment" is the actual name of the HRMI index; "Harnessing Digital
  Connectivity for Sustainable Cities in ASEAN" is a real paper title. The
  ban is scoped to the locale string tables — free editorial prose only —
  because a gate that cries wolf on real source names is a gate people learn
  to ignore.

## Adding a rule later

Prefer a test over a line of prose. If a rule genuinely cannot be decided from
source, put it in this file and say so — do not half-enforce it in a test with
so many carve-outs that it stops catching anything. A gate with carve-outs is
a gate people route around.