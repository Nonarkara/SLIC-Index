# Frontend shipability audit — SLIC Index

> Measured 2026-11-04 against the deployed build. The benchmark is
> `tools/slop-lint.mjs` (Nonarkara/dr-non-vibecoding-skills): **≥6 points is
> SLOP, 3–5 is REVIEW, under 3 is OK**, scored at 1440×900 and 390×844. The
> house rules are in `ANTI-SLOP.md`; the layout law is in `CLAUDE.md` §Anti-Slop
> Design Law, and the instrument that owns the layout is
> `scripts/audit-spatial.mjs`.

---

## The headline

One route was in the SLOP band. It is not any more, and the reason was
measurable rather than a matter of taste.

| Route | Before | After | Band |
|---|---|---|---|
| `/side-by-side` | **9** | **4** | SLOP → REVIEW |
| `/thailand` | 5 | 5 | REVIEW |
| `/rankings` `/compare` `/data` `/ideas` `/history` `/awards` `/about-slic` | 4 | 4 | REVIEW |
| `/` `/methodology` `/essay` `/traffic` `/city/th-bangkok` | 2 | 2 | OK |
| `/map` | 1 | 1 | OK |

`/side-by-side` was the only route above the REVIEW line. It had five
findings; three of them were real defects and are fixed:

| Finding | What it was | What it is now |
|---|---|---|
| `stretch-to-fill` (2) | four preset buttons filling 331px tracks to hold 94px of text | the chips are sized by their own words; the column count still divides the count, so the row stays even |
| `emoji-icons` (2) | seven typed "↗" characters used as link affordances | one drawn `ExternalLinkMark` in the site's own mark set |
| `big-number-tiles` (1) | five 32px SLIC scores shouting at once on a five-column page | 24px; the bar under each number is the instrument and the number is its label |
| `void` (2) | the page's flat first screen | unchanged — see *What is left* |
| `long-lines` (1), `type-chaos` (1) | systemic | unchanged — see *What is left* |

## What was fixed, and why

### The typed arrow became a drawn mark

`↗` is a real symbol, not an emoji — but it is still a character in the text
flow. It takes the line's font, it cannot be aligned with the name beside it,
and it reads as a pictograph to any linter that counts them. It appeared in
three places: the comparison city's name, the footer's archive links, and the
quick-search result type.

It is now `ExternalLinkMark` in `src/IconMarks.tsx`, drawn in the same
20×20 line style as `CityBoardMark`, `GlobeMark` and `CompareMark`, on
`currentColor`.

**The footer's arrow stayed a character.** The footer's links are the ones
thing that must not wrap: each group runs on a single line, separated by a
middot, and the footer-nav gate checks that at every width in every locale.
A drawn mark is wider than the character it replaces, and the archive links
began to break onto two lines — the footer-nav gate caught it at fifteen
widths in one run. The arrow in the footer is the one place where the
character is the right tool, because the line it sits in has a hard rule
about its own length.

One thing the drawn mark did not settle on its own: the tier chip on the
homepage carries a third child — the city's score — and at narrow widths a
media query reset the chip to two columns, so the score fell onto a second
row on its own and left the rest of the chip empty. The layout gate caught it
as a stray: a grid with two columns and three items, and 230px of hole. The
chip is three columns at every width now.

### Buttons are the width of their words

`.rankings-actions` was a one-column grid. Grid items stretch to their track
by default, so "Review methodology" and "Download sheet template" became two
1088px-wide bars holding 77px and 152px of text, and the flat space beside
them was most of the page's void. It is now a flex row: the buttons are
content-width, the row wraps when the width forces it.

The region filter was tried and left alone. `.region-switch > *` has
`flex: 1 1 auto`, so the buttons share the row they are in; on `/thailand`
that means a chip 275px wide holding 73px of text, which the linter counts as
a stretched chip. But that panel is narrow, and a full-width button in a
narrow side panel is a tap target, not a stretched chip — and making the
buttons content-width there pushed the row onto a second line, which the
layout gate read as a defect. The instrument that owns the layout won. The
filter row stays as it was; the finding is recorded here instead.

### The comparison score stopped shouting

`.sbs-slic-number` was 2rem. Five cities side by side, five numbers at 32px,
and the reader was given five shouts instead of one comparison — while the bar
under each number, which is the instrument that actually compares them, was
the smaller element. The number is now 1.5rem.

### The hero's figures became a strip

The rankings hero was a two-column grid: the statement in a 1150px column
that used 520px of it, and the three figures in the far right, bottom-aligned.
The middle of the first screen was empty ground.

The figures are now a ruled strip under the statement — one baseline, one
rule, the numbers the page is about — which is the same shape the homepage
already uses for its own figures. The hero's top padding came down from 6.6rem
to 5.4rem.

### The ranking-status banner lost two of its five lines

It was a label, a title, a paragraph running the full 1300px of the page, an
uppercase credit line and a timestamp — five blocks, 205px tall, in a
full-width pale band. Now: the label and the title share a line, the
explanation holds one reading measure (46em) instead of the page's whole
width, and the credit and the timestamp share the last line.

### Prose holds a measure

`.hero-intro` now stops at 46em. The column is 1390px; a line of prose running
all of it is 170 characters, and nobody reads that.

---

## What is left, and why

### `void` — 2 points on nine routes

The rule fires when the first screen has a flat empty region of at least 35%
and the page shows no map or data covering 40% of it.

On these routes the flat region is the **page background around a large
display title** — the wall-label composition the site is built in, and what
`ANTI-SLOP.md` calls "a museum's wall label earns its space". The linter is a
screen, not a judge, and this is the case where the screen and the judgement
disagree: on `/data` the first screen carries a title, four figures and a
manifest card, and the empty part is the margin around them.

The fix that would clear it mechanically is the one the house law already
names: put the page's data instrument in the first screen, at 60% of it. On
`/rankings` that means the workbench itself — the spider web and the sliders —
moves above the fold instead of the statement and the status banner. That is
an editorial decision per page, not a stylesheet change, and it is the next
round of work rather than this one.

### `long-lines` — 1 point on every route

The linter takes the widest *row* of any block whose text runs past 120
characters. On every page in the site the widest row is the **footer's
six-column sitemap**: 1390px, 96.7em. Each group inside it is already a single
line of its own links, which is exactly what the house rule asks for ("a
group's links run on one line, separated by a middot, so every block in the
sitemap is about the same height"). The linter unions the six columns because
they share a visual row.

This rule and the footer's own law are in direct conflict, and the footer law
is the project's, not the linter's. The real prose offenders were found and
fixed separately: the ranking-status banner and the hero intro, both now on a
measure.

### `type-chaos` — 1 point on thirteen routes

The site declares **57 fluid font sizes** (`clamp()` with a vw term), so at any
one viewport they resolve to 17–23 distinct pixel values on a page. That is a
real finding and it is a design-system decision, not a stylesheet tidy: eight
steps means choosing the eight, and the choice changes every page.

### `big-number-tiles` — 1 point on `/thailand`

Five bare numbers at 26px or more sit in tiles on the Thailand page. They
are the province and city counts the page is about, so they are not
filler — but a count next to its label, in a ruled strip, would say the
same thing with less ink. Not changed here: it is a page-specific edit, and
the counts are the finding.

### `default-font` — reported, not scored

The linter's expected font list does not include IBM Plex Sans Thai, which is
the Thai face the site uses by design. Not a defect.

---

## Verified

- `npm run verify:release` — the full gate suite, including the dense spatial
  audit, the layout and clearance gates, the numbers and figures gates, and
  the shipability browser gate.
- `npm test` — 138 tests, including the CSS duplicate-selector ratchet, which
  caught one duplicate introduced by this work (a second
  `.rankings-filter-group` block); it was merged into the original rule rather
  than the baseline being raised.
- The spatial gate caught three of this work's own changes — a stranded tier
  chip, a filter row that wrapped once its buttons were content-width, and an
  action row whose two buttons sat a pixel apart because one of them carries
  a border. All three were fixed in the source rather than absorbed into the
  baseline.
- `node tools/slop-lint.mjs` over fifteen routes at 1440×900 and 390×844.
- Screenshots at 1440, 1024 and 390 of every page touched.

## Not done here

- The `/methodology` page is 26.8 screens tall and `/essay` is 20.5. Both are
  documents — a technical paper and an essay — and the methodology PDF is 25
  pages. The scroll depth is the content, not padding, but a screen-length
  summary and a jump-to-section index would give a reader the finding before
  the apparatus.
- `/compare` is 13.6 screens and `/thailand` 13.1. Both carry a real
  instrument; the compaction work there is about the data density per screen,
  not the page structure.
- The type scale is 57 steps and wants to be 8. That is the next project's
  worth of work, and it should start with a stated scale rather than a
  mechanical merge.
