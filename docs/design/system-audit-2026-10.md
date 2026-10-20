# System audit — October 2026

A screenshot of the live masthead showed two failure modes at once: a **raster
wordmark rendering as coloured mush**, and a **monochrome, over-boxed masthead**.
The hover-lift work that preceded this had treated those as taste questions. They
were not. They were structural.

This document records what was actually found, why each defect happened, and which
gate now prevents it. It exists so the next audit starts from evidence rather than
from a screenshot.

---

## How the audit was run

1. Screenshot the live site and every route.
2. Inventory the raw materials: `file` every asset, census every colour literal,
   count every selector definition, locate every filter.
3. Read the cascade for the specific controls the screenshot implicated.
4. Fix, then write a gate per defect class, then mutation-test each gate.

The structural counts came first and reframed everything after. The screenshot was
a symptom report; the counts were the diagnosis.

---

## Finding 1 — The wordmark was a square raster in a wide slot

`public/Logos/slic-index-full.png` is **400×400**. It was rendered into a
**140×36** box with `object-fit: contain`. It is blue and teal — neither of which
is in the palette. It was also the *only* raster in the masthead, on the one
element that appears on every single page.

There were already CSS classes for a live-type wordmark (`.mh-wordmark-main`,
`.mh-wordmark-sub`) and nothing used them. The type version had been designed,
then replaced by the image, and the type rules were left behind.

**Fixed:** both the masthead and the footer plate now render live type. The image
file is untouched for the projects that reference it, but the web UI cannot load
it. Type is sharper at every DPR, colourable from tokens, and costs no request.

---

## Finding 2 — The palette had forked

`:root` declares one ink and one cream. The file also contained:

| Colour | Uses | Role |
|---|---|---|
| `#111314` | declared | `--text` |
| `#1c1914` | 15 | a second ink |
| `#f7f5ef` | declared | `--bg` |
| `#f8f5f0` | 15 | a second cream |
| `#12354e` | declared | `--accent-blue` |
| `#1a3a6b` | 18 | a second blue |
| `#f99d1b` | declared | `--accent-amber` |
| `#b85c28` | 1 | a third amber |

Not one of these was a comment or a historical note. They were live declarations,
and they were spread across a file where a late rule silently wins.

The practical cost: nobody could answer "what colour is the ink?" without opening
the file and finding the last definition. Every future edit inherited that.

**Fixed:** all forked values now resolve through tokens. The rogue blue was the
largest — 18 uses of `#1a3a6b` against a declared `#12354e` that was barely used.

---

## Finding 3 — 287 selectors were defined more than once

`.hp-headline` was defined **nine times**. `.locale-button.active` was defined
**three times**, and the three disagreed:

```css
.locale-button.active { background: var(--text);     color: var(--bg); }        /* ink plate   */
.locale-button.active { background: var(--accent-blue); color: var(--text-inverse); }  /* blue plate */
.locale-button.active { background: transparent;   color: var(--accent-blue); }  /* underline  */
```

Last-write-wins meant the *dark-masthead* variant won on the homepage — which put
a solid cream plate on the active language button over photography. That is the
inverted button in the original screenshot: a low-emphasis switch rendered as the
loudest object in the bar.

**Fixed:** the three definitions are now one, plus one scoped dark-masthead
override, plus one mobile override. Same idea as every other nav item in the bar:
full-strength type and an underline.

**The structural lesson:** this is not a set of independent bugs. Duplicate
definitions *are* the bug, and most of the visible symptoms trace back to one.
A late block re-declaring a control is how the ink plate, the boxed locale row,
and the box-in-box search trigger all got there.

---

## Finding 4 — Box-in-a-box in the masthead

`.mh-search-btn` carried `border: 1px solid`, and contained `.mh-search-kbd`,
which carried its own `border: 1px solid`. Three nested rectangles in a control
that sits between two groups of quiet text.

**Fixed:** one border, on the control. The kbd hint is now differentiated by
opacity and tracking rather than a second rectangle.

---

## Finding 5 — Photography was being drained on purpose

```css
.hp-opening-media img   { filter: saturate(0.92) contrast(1.04) brightness(0.82); }
.hp-photo-break-img     { filter: saturate(0.92) contrast(1.02); }
.hp-photo-break-img     { filter: saturate(0.9); }              /* earlier block */
```

`saturate()` below 1 is a deliberate instruction to make an image greyer. Three of
them across the hero and the photo-break is what made the site read monochrome —
the complaint that sent this audit looking.

**Fixed:** removed. The hero keeps `brightness()` alone, because the ink scrim
above it genuinely needs the headroom. The photo-break keeps none.

Two `saturate()` values **above** 1 survive on `.v3-city-card-img`. Those are the
opposite intent — keeping colour alive under a dark scrim — and the gate allows
them explicitly rather than by omission.

---

## Finding 6 — Two dead classes, one dead asset path

`.mh-wordmark-main` and `.mh-wordmark-sub` were fully specified and never applied.
`.brand-mark-image` wrapped the raster and was applied only to wrap the raster.

Worth noting because a dead class and a live class are indistinguishable in a
stylesheet. Neither showed up in any visual review; both were found by counting.

---

## What was checked and found correct

- **Full-width hero CTAs.** The `width: 100%` on `.hp-cta-*` lives only inside
  `@media (max-width: 768px)`. Stacked full-width buttons on a phone are right;
  on desktop they would be wrong. The original screenshot was a narrow viewport,
  so this was correct behaviour being mistaken for a defect.
- **Radio switches on `.mh-search-btn`.** The kbd glyph is an affordance, not
  decoration — already exempted in the emoji gate.
- **`saturate()` above 1 on city-card photography.** Intentional, see above.
- **The remaining single-use raw hexes.** Each is local shading belonging to one
  component (a PDF viewer's grey, the weight-segment greyscale ramp, the traffic
  table's rules). A colour used once cannot fork, so the gate allows them.

---

## The gates

Seven, in `test/system-integrity.test.mjs`, each derived from a defect above and
each mutation-tested:

| Gate | Prevents |
|---|---|
| a colour used >1× must be a token | palette forking |
| no token defined in terms of itself | bulk-replace clobbering `:root` |
| the wordmark is live type | raster brand mark returning |
| no raster for site identity | same, at the footer |
| a bordered control holds no bordered control | box-in-box |
| photography is not desaturated | monochrome drift |
| a bare selector is not redefined | last-write-wins cascade |

The last is a **ratchet** rather than a one-shot fix: it fails on any *new*
duplicate while tolerating the ones already present, so the count can only fall.
Baseline is 156. Lower it in the test whenever a duplicate is resolved.

---

## What this audit did not do

It did not resolve the 156 remaining duplicate selectors. That is a large,
mechanical, high-risk change that needs its own pass with visual verification at
three widths — not a footnote to a colour audit. The ratchet stops the number
growing; reducing it is separate work.

It also did not touch the three archive sites (V1 / V2 / V2.5). They are frozen
historical builds and keep their own design era by intent.