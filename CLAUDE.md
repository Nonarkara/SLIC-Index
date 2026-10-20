> **Before any design or frontend work, read [ANTI-SLOP.md](ANTI-SLOP.md) and the "Anti-Slop Design Law" section below.** These are Dr Non's hard rules against AI design slop. They are enforced by machine gates, not by good intentions — see "What the gates catch" for the full list.

# SLIC Index V3 — Project Instructions

## What This Is

SLIC (Smart and Liveable Cities Index) V3 — a transparent, open-source city ranking system.
163 published cities (158 ranked + 5 watchlist), 5 pillars, 22 scored metrics + 3 diagnostics. Deployed to Cloudflare Pages at https://slic.nonarkara.org.

- **Live site:** https://slic.nonarkara.org
- **Repo:** https://github.com/Nonarkara/SLIC-Index
- **Branch:** `main` (active development)

## Anti-Slop Design Law

**Dr Non's standing position: he would never deliberately want anything to look like AI-designed slop.** This is not a preference for a house style — it is a refusal of a specific, recognisable failure mode. If your work could be mistaken for what an LLM produces on the first attempt without judgement, it is wrong, regardless of whether it passes a test.

Read [ANTI-SLOP.md](ANTI-SLOP.md) before touching any visual. It is the prose source of truth. This section is the operational summary and it binds.

### The rules, in one place

1. **Empty space is a decision.** Space is not left over; it is placed. If a section could be tighter without losing hierarchy, tighten it.
2. **Subtract before you add.** A new element must earn its place against the existing composition, not be added because it is available.
3. **The map comes first.** Where a page has a map, the map is the primary object. Text frames it; it does not replace it.
4. **Boxes fit their content.** A container's size comes from what is inside it, not from a grid cell.
5. **Balanced composition.** Nothing crowds one edge while the other floats.
6. **Something must win.** A squint test must show a focal point. If everything is equally loud, nothing is.
7. **No fake depth.** No shadows that imply volume, no gradients that interpolate brand colours, no hover that translates the surface as if a 3D model moved.
8. **A4/A5 readable measure.** Prose columns cap at ≤65ch and are declared in `ch`, not `px`/`rem`, so the measure tracks the type size.
9. **No lazy ornaments.** No emoji as icons, no decorative icon tiles, no ornamental shadows.
10. **No filler copy.** No "seamlessly", "revolutionise", "unlock the power", "cutting-edge", "supercharge". The locale string tables are the copy a reader actually reads.
11. **No AI-slop fonts.** Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito are banned. Editorial faces only.
12. **Palette discipline.** Cream ground, ink text, amber accent, plus the three Wada tier hues (categorical data, not brand decoration). One ink, one cream, one blue. A colour used more than once is a token.

### Information hierarchy — the reason the rules exist

A page is not a container for information. It is a **sequence of attention**: the reader's eye should meet the most important thing first, then the next, and so on, without scrolling past it to find out what mattered.

- **Order by importance, not by habit.** Lead with the finding, not the apparatus. A reader who stops after the first screen should have got the point.
- **Condense.** Every section that can lose 20% of its height without losing its point should. Excess scrolling is a composition failure, not a content failure.
- **Depth is earned.** A section earns vertical space by being the answer to a question the reader has. Padding is not information.
- **Anti-slop and information delivery are the same goal.** A page that needs three screens to say one thing has failed twice: it looks like slop *and* it buries the message.

**Two shapes are not negotiable**, because both were got wrong and cost a measured amount:

- **A bibliography is a ruled list, not a card grid.** Thirty-seven sources as thirty-seven bordered cards cost 9,784px on a phone — a sixth of the methodology page — and read like a dashboard of unrelated boxes. They are now a single ruled list, two columns on a wide screen, with the source title as the link.
- **A wide table on a phone is a field grid, not a stack of labels.** The Thailand table has nine short columns. Stacked one cell per line it cost 313px a row, 22,543px for seventy-two provinces. As a two-up field grid the same row is under 200px and still carries every figure. The column label sits inline with its value instead of on a line of its own — thirty-five rows of repeated column header is space spent saying nothing.

**The apparatus goes last.** On the methodology page the glossary and the worked example used to sit *before* the method. They are reference material; they now come after it. The reading order is the argument, then the apparatus, then the sources.

### What the gates catch

Every rule above that can be decided from source is a machine gate. They run in `npm run verify:release`, so a violation fails the build rather than being noticed in review.

| File | Gates |
|---|---|
| `test/design-slop-invariants.test.mjs` | banned fonts, family budget, radius = 0, ≤3 elevation shadows, no emoji-as-icon, scrim-only gradients, ≤65ch prose measure, no filler copy, type-scale step, **no fake-depth hover-lifts** |
| `test/system-integrity.test.mjs` | **palette cannot fork** (a colour used twice must be a token), no self-referential token, **wordmark is live type not a raster**, no bordered control inside a bordered control, **photography is not desaturated**, no bare selector silently redefined (ratchet) |
| `test/accessibility-invariants.test.mjs` | contrast, focus visibility, hero-masthead legibility over photography, localised labels |
| `test/publication-hashes.test.mjs` | the scoring bundle cannot drift from its published hashes |
| `scripts/check-layout.mjs` | **the built site in a real browser**: no horizontal overflow, no uncaught exception, no broken image, and every route actually rendered — across 15 routes × 3 widths |

**The ratchet.** `system-integrity.test.mjs` refuses a NEW duplicate selector while tolerating the ones already in the file (baseline is in the test). It can only go down. If you remove a duplicate, lower the baseline in the same commit.

**If a gate fires, fix the design — do not edit the gate.** The gates encode decisions that were already made and paid for. If a rule genuinely needs to change, change it in `ANTI-SLOP.md` *and* in the gate, in the same commit, with the reason. A gate that gets edited to go green is worse than no gate: it teaches people to route around it.

### CSS refactoring

`src/styles.css` used to define the same selector in several places. Two tools now guard it:

| Tool | What it does |
|---|---|
| `scripts/css-cascade.mjs` | A real cascade model — specificity, source order, `!important`, and media queries — used by the merge tool and the fingerprint |
| `scripts/merge-duplicate-css.mjs` | `--check` to report, `--write` to merge. Merges a group of duplicate blocks into one, or **refuses** the group when no placement is provably safe |
| `scripts/verify-css-refactor.mjs` | `--against <dir>` drives a real browser over 15 routes × 3 widths and compares the **full computed style of every element**, including `::before`/`::after` |
| `scripts/measure-page-height.mjs` | Reports total scroll height and the height of every section, per route, per width. **Measure before you tighten** — every spacing decision in this repo was made against these numbers |
| `scripts/shoot-pages.mjs` | Screenshots any route at any width into a folder, for the squint test that a number cannot replace |
| `scripts/check-layout.mjs` | The permanent gate: drives the built site in real Chrome over 15 routes × 3 widths and fails on horizontal overflow, an uncaught exception, a broken image, or a route that never rendered |

**The browser is the proof; the fingerprint is not.** A cascade fingerprint buckets rules by selector text, so it evaluates each selector *in isolation*. Two selectors can only interact when they match the same element, which the fingerprint cannot see. Two real bugs came out of this, both caught by the browser and neither by the fingerprint:

- `.mh-panel-link` and `.mh-panel-link--active` have the same specificity. Writing the merged `.mh-panel-link` block at the group's **last** position pushed it after `--active`, and the active nav link stopped looking active.
- `@media (max-width: 768px)` and `@media (max-width: 430px)` are **cumulative**, not exclusive — a 430px viewport satisfies both. Treating each query as its own context let a merge change the homepage headline size on a phone.

So: **merge, then prove it in a browser, every time.** Run `node scripts/verify-css-refactor.mjs --against <pre-change build>` before you trust a CSS refactor.

### Things that look like slop but are not

Do not "fix" these — they were examined and kept:

- **Keyboard glyphs** (`⌘K`, `↑↓↵`, `esc`) are affordances, not emoji.
- **Focus rings** are WCAG requirements, not fake depth. They are exempt from the shadow cap.
- **The three tier hues** (`--accent-cyan`, `--accent-red`, `--accent-blue`) are categorical data-viz for the Alpha/Beta/Gamma badges. Amber is the sole *brand* accent; the three status colours are *data* colours.
- **Photo zoom on hover** is legitimate — the cursor lands on an actual `<img>`, so the zoom *is* the affordance. Named as carve-outs in the gate.
- **The CTA's ink-fill animation** (`.v3-cta:hover::after`) slides a pseudo-element in, not the surface. The button never moves.

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6
- No Tailwind — custom CSS only in `src/styles.css` (12,759 lines, editorial "Monocle meets Red Dot" aesthetic)
- First-party visitor aggregates: Pages Worker + D1; no login. Supabase is a retired optional adapter, not imported by production.
- Cloudflare Pages deployment (root base path `/`)
- Cloudflare Pages Worker (`public/_worker.js`) enforces edge request boundaries, returns 400 on path-traversal attempts, returns 405 on non-GET/HEAD, masks server errors

## Build & Run

```bash
npm run dev               # Vite dev server on port 5173
npm run build             # vite build → dist/
npm run preview           # Preview built site
npm run typecheck         # tsc --noEmit — passes clean (0 errors)
npm run test              # node --test — 117/117 pass
```

The full release gate is `npm run verify:release` — typecheck + build + tests + check:publication + check:csv + check:methodology + check:translations + check:audit + check:layout. Exits non-zero on any failure. `check:layout` drives the built site in real Chrome, so it only means something after a build. The new `check:audit` runs `scripts/audit-data-integrity.mjs`, which catches identity / ranking / scoring / coverage / metric / cross-artifact / hash drift issues.

## Project Structure

```
src/
├── App.tsx                    # Router, locale detection, view transitions
├── HomePage.tsx               # Op-ed editorial homepage with allocator
├── RankingsPage.tsx           # Interactive ranking with ZeroSumAllocator
├── CityScorecardPage.tsx      # Per-city detail page (metrics, sources, scores)
├── MethodologyPage.tsx        # Technical deep-dive with equations
├── CompareRankingsPage.tsx    # Compare SLIC vs EIU, Mercer, Resonance, etc.
├── SideBySidePage.tsx         # Head-to-head city comparison
├── ThailandPage.tsx           # Thailand regional deep-dive
├── IdeasPage.tsx              # Steal-this-idea editorial
├── SlicProfilePage.tsx        # About SLIC
├── HistoryPage.tsx            # Development timeline with photos + version archive
├── ExercisePage.tsx           # City matching tool
├── AwardsPage.tsx             # Submission dossier for Red Dot / DEmark / CEA / TFA
├── EssayPage.tsx              # Long-read essay
├── MapPage.tsx                # Global city map
├── DataSourcesPage.tsx        # Per-source data integrity panel
├── ZeroSumAllocator.tsx       # SVG radial spider chart + linear sliders
├── KnowledgeRackPanel.tsx     # Knowledge-rack Q&A
├── SiteMasthead.tsx           # Fixed header with logo + nav
├── SiteFooter.tsx             # Footer with collaboration logos
├── brandAssets.ts             # Logo definitions (SLIC, ReTL, DEPA, etc.)
├── siteCopy.ts                # All UI text in 5 locales (en, th, zh, ko, ja)
├── rankingsData.ts            # City scores, regions, metadata (~3100 lines)
├── methodologyData.ts         # Methodology content, references, equations
├── compareRankingsData.ts     # Competitor index comparison data
├── publicationMath.js         # Canonical scorer: pillar weights, AMPI math, metric catalog
├── publicTierPolicy.js        # Alpha/Beta/Gamma tier allocation rules
├── consequenceRules.ts        # ZeroSumAllocator rule enforcement (draft/reference — not the ranking scorer)
├── visitorTracking.ts         # Retired Sheets/Supabase adapter; not imported by production
├── firstPartyTraffic.ts       # Bounded session writes and aggregate reads from /api/traffic
├── TrafficPage.tsx            # Historical/live worldwide reach, separate counting measures
├── styles.css                 # Complete design system (12,759 lines, all design tokens)
└── data/
    ├── publishedRankingData.json   # ~1.7MB — all 163 cities with per-metric sources
    ├── methodologyFacts.json       # Awards-page facts (sourced from the bundle)
    ├── slic_city_universe.csv      # 353-city roster
    └── slicScoringManifest.json    # Scoring configuration

public/
├── _headers                   # Cloudflare Pages response headers (HSTS, CSP, etc.)
├── _redirects                 # /* → /index.html 200 (SPA routing)
├── _worker.js                 # Cloudflare Pages Worker: path-traversal block, method allow-list, HTML-fallback rejection
├── request-policy.js          # Used by _worker.js to classify request paths
├── route-restore.js           # Runs from index.html, decodes GitHub-Pages-style ?p= redirects
├── robots.txt                 # Allow all + GPTBot/ClaudeBot/PerplexityBot/Google-Extended allow-list + Sitemap directive
├── sitemap.xml                # 15 routes, hreflang for 5 locales on the home URL
├── site.webmanifest           # PWA manifest, root-relative icon paths
├── og-card.png                # 2400×1260 OG image (declared 2400×1260 in index.html)
├── Logos/                     # SLIC Index, ReTL, DEPA, Smart City Thailand, UWN logos
├── photos/                    # Editorial photos (city, profile, report)
├── launch-photos/             # 2026 Smart City Summit + GitX + LEAP East + Tomorrow City + Osaka + Asia Roundtable launch trail
├── history-photos/            # Timeline page photos
├── version-archive/           # V1/V2/V2.5 version-archive screenshots (referenced from HistoryPage)
├── downloads/                 # CSV, methodology PDFs (en/th/zh), PPTX decks, xlsx template
└── knowledge-rack/            # Knowledge base data (Q&A catalog)
```

## Scoring System

- **5 pillars:** Growth (25%), Viability (22%), Capability (18%), Community (15%), Creative (20%)
- **22 scored metrics + 3 diagnostics** (25 in metric catalog) normalized to 0–100 via fixed piecewise linear anchors
- **Aggregation:** Adjusted Mazziotta–Pareto Index (AMPI) — penalizes imbalance
- **Coverage grades:** A (full), B (−5 penalty), C (−15 penalty, provisional)
- **No imputation** — missing data is excluded, not fabricated
- **Absolute scoring** — adding new cities never changes existing scores

Full specification: `docs/v3-absolute-scoring-specification.md`

## Data Sources

All metrics in `publishedRankingData.json` include `source`, `sourceUrl`, and `dataLevel` fields.
Primary sources: World Bank, IMF, OECD, WHO, UNODC, Numbeo, IQAir, Freedom House, WIPO, UNESCO.
See methodology PDF for complete source table.

## Branding

- **Design aesthetic:** "Jony Ive meets Dieter Rams" — Red Dot Design Award quality
- **Wordmark:** live type, not a raster. `SiteMasthead.tsx` renders `.mh-wordmark-main` / `.mh-wordmark-sub`; `BrandLockup.tsx` renders an `SL` plate. The old `public/Logos/slic-index-full.png` was a 400×400 square PNG squeezed into a 140×36 box in off-palette blue/teal — it rendered as unreadable mush. Do not reintroduce it.
- **Tech partner:** ReTL (The Reason to Live Company) — replaced Axiom AI
- **Collaboration logos:** UWN (PMU-A), DEPA Thailand, Smart City Thailand, ReTL
- **Shared brand assets:** `/Users/nonarkara/Projects/_reference/brand-assets/`

## Design System (CSS)

- **Fonts:** Source Serif 4 (display headings, replaces Libre Baskerville which only had 400/700 and snapped everything to Bold), Source Sans 3 (body), JetBrains Mono (data)
- **Colours are tokens, not literals.** The ground is cream `--bg: #f7f5ef`, the ink is `--text: #111314`, amber is `--accent-amber: #f99d1b` for fills and `--accent-amber-text: #a04e20` (5.32:1 on cream, AA-compliant) for body text. Dark blue is `--accent-blue: #12354e`, red is `--accent-red: #a72144`, teal is `--accent-cyan: #1a6b5a`. The three tier hues are categorical data-viz, not brand decoration — see "Anti-Regression — Do Not Touch".
- **A colour used more than once must be a token.** Single-use local shading (a pillar's own tint, the weight-segment greyscale ramp) is allowed to be a literal; anything used twice is forked palette and fails the gate.
- **Dark sections:** Spider/allocator area uses inverted colours (`--text-inverse`)
- **Motion:** `cubic-bezier(0.16, 1, 0.3, 1)` easing, 80–120ms transitions

## Deployment

```bash
npm run build                              # Generate dist/
git add -A && git commit -m "..."          # Commit
git push origin main                       # Push to main
npx wrangler pages deploy dist --project-name slic-index --branch main
```

The `dist/` directory is committed to the repo (this is what the deploy script ships). Cloudflare Pages serves from the `main` branch via wrangler.

## Release verification

```bash
npm run verify:release   # full gate — typecheck, build, test, check:publication, check:csv, check:methodology, check:translations, check:audit, check:layout
```

## Key Rules

- All photos must load — no broken images. Check `public/` assets before referencing.
- Every city score must trace to a source. Check `publishedRankingData.json` metrics.
- CSV export at `public/downloads/slic-ranked-cities-v2.csv` must match published data.
- Methodology PDF must be comprehensive and current.
- No "SLIC logo" — always "SLIC Index" branding.
- ReTL is the tech partner (not Axiom).
- **Five locales: EN / TH / ZH / KO / JA** — do not drop any. Thai first-person pronoun is strictly "ผม".
- Cloudflare Worker in `public/_worker.js` enforces path-traversal block + GET/HEAD allow-list + HTML-fallback rejection. Don't bypass.

## Cross-Agent Sync Note

- Keep `src/data/publishedRankingData.json` and `public/downloads/slic-ranked-cities-v2.csv` aligned when city metrics change. After any data edit run `npm run rescore && node scripts/update-csv.mjs` to republish. rescore re-stamps the publicationManifest hashes itself, under its own sorted-key canonicalisation — do not hand-edit them.
- `src/cityBenchmarks.ts` currently exists as draft/reference copy and is not imported by the app. Treat edits there as non-user-facing unless the component is wired back into the UI.

---

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 (The Codex Incident — Anti-Regression Laws) for the full rules. These items are the personality of SLIC Index V3. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval:

- **163-cities ranking grid (158 ranked + 5 watchlist)** — the core artifact. Do not reduce the city count, do not swap in a generic table component.
- **5-pillar scoring layout** — the five pillars are the IP. Do not collapse into a single score or a generic bar chart.
- **Custom CSS only — NO Tailwind.** Do not introduce Tailwind, shadcn, or any utility-class framework. The bespoke CSS is the aesthetic.
- **"Monocle meets Red Dot" type scale** — editorial typography, hairline rules, mono numerics. ZERO border-radius. ZERO gradients.
- **Five-locale switch (EN / TH / ZH / KO / JA)** — five languages, not three. Do not drop any locale. Thai first-person pronoun is strictly "ผม".
- **Published ranking data triplet** — keep `src/data/publishedRankingData.json` and `public/downloads/slic-ranked-cities-v2.csv` aligned. Their content hashes in `publicationManifest.{normStatsHash,metricCatalogHash}` are re-stamped by `npm run rescore` itself. Never hand-edit them, and never recompute them with a different serialization than the pipeline uses — the audit hashes with the same recursive key sort as rescore and will fail the build if the two disagree.
- **Tier status colors are an intentional §14 exception (approved 2026-07-05).** `--accent-cyan`, `--accent-red`, `--accent-blue` coexist with `--accent-amber` *by design* — they are semantic traffic-light encoding for the Alpha/Beta/Gamma tier badges and data-level chips, not brand decoration. This is categorical data-viz, which a ranking index legitimately needs. Do NOT "fix" them to amber-only for §14 (one-amber) compliance — collapsing tier hues would destroy information. Amber remains the sole *brand* accent; the three status colors are *data* colors.

If you are about to remove, replace, or "simplify" any item above: stop, show the diff, wait for explicit approval.
