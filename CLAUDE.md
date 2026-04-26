# SLIC Index V3 — Project Instructions

## What This Is

SLIC (Smart and Liveable Cities Index) V3 — a transparent, open-source city ranking system.
163 published cities (154 ranked + 9 watchlist), 5 pillars, 20 scored metrics + 3 diagnostics. Deployed to GitHub Pages.

- **Live site:** https://nonarkara.github.io/SLIC-Index/
- **Repo:** https://github.com/nonarkara/SLIC-Index
- **Branch:** `codex/red-dot-design-2-5-1` (active development)

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6.2
- No Tailwind — custom CSS in `src/styles.css` (editorial "Monocle meets Red Dot" aesthetic)
- Supabase JS for visitor tracking only (no auth, no backend)
- GitHub Pages deployment (base path: `/SLIC-Index/`)

## Build & Run

```bash
npm run dev        # Vite dev server on port 5174
npm run build      # vite build → dist/
npm run preview    # Preview built site
```

Build is `vite build` only — no TypeScript type-checking in build (pre-existing TS errors).

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
├── HistoryPage.tsx            # Development timeline with photos
├── ExercisePage.tsx           # City matching tool
├── ZeroSumAllocator.tsx       # SVG radial spider chart + linear sliders
├── SiteMasthead.tsx           # Fixed header with logo + nav
├── SiteFooter.tsx             # Footer with collaboration logos
├── brandAssets.ts             # Logo definitions (SLIC, ReTL, DEPA, etc.)
├── siteCopy.ts                # All UI text in 3 locales (en, th, zh)
├── rankingsData.ts            # City scores, regions, metadata (~3100 lines)
├── methodologyData.ts         # Methodology content, references, equations
├── compareRankingsData.ts     # Competitor index comparison data
├── scoreEngine.ts             # Absolute piecewise linear scoring
├── slicScoringEngine.ts       # AMPI percentile scoring engine
├── consequenceRules.ts        # Zero-sum rule enforcement
├── styles.css                 # Complete design system (~7500 lines)
└── data/
    ├── publishedRankingData.json  # 1.7MB — all 163 cities with per-metric sources
    ├── slic_city_universe.csv     # 353-city roster
    └── slicScoringManifest.json   # Scoring configuration

public/
├── Logos/                     # SLIC Index, ReTL, DEPA, Smart City Thailand, UWN logos
├── photos/                    # Editorial photos (city, profile, report)
├── launch-photos/             # 2026 Smart City Summit launch event
├── history-photos/            # Timeline page photos
├── downloads/
│   ├── slic-ranked-cities-v2.csv                    # 163 cities CSV export
│   ├── slic-methodology-technical-paper-en.pdf      # 22-page methodology paper
│   ├── slic_google_sheets_template.xlsx
│   └── slic_scoring_workbook.xlsx
└── knowledge-rack/            # Knowledge base data
```

## Scoring System

- **5 pillars:** Growth (25%), Viability (22%), Capability (18%), Community (15%), Creative (20%)
- **20 scored metrics + 3 diagnostics** (23 in metric catalog) normalized to 0–100 via fixed piecewise linear anchors
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
- **Logo:** `slic-index-full.png` (horizontal, 140×36) in masthead
- **Tech partner:** ReTL (The Reason to Live Company) — replaced Axiom AI
- **Collaboration logos:** UWN (PMU-A), DEPA Thailand, Smart City Thailand, ReTL
- **Shared brand assets:** `/Users/nonarkara/Projects/_reference/brand-assets/`

## Design System (CSS)

- **Fonts:** Libre Baskerville (headings), Inter (body), JetBrains Mono (data)
- **Colors:** Cream `#f8f5f0` background, dark `#1c1914` text, amber `#b85c28` accent
- **Dark sections:** Spider/allocator area uses inverted colors
- **Motion:** `cubic-bezier(0.16, 1, 0.3, 1)` easing, 80–120ms transitions

## Deployment

```bash
npm run build                              # Generate dist/
git add -A && git commit -m "..."          # Commit
git push origin codex/red-dot-design-2-5-1 # Push branch
npx gh-pages -d dist                       # Deploy to GitHub Pages
```

The `dist/` directory is committed to the repo. GitHub Pages serves from the `gh-pages` branch.

## Key Rules

- All photos must load — no broken images. Check `public/` assets before referencing.
- Every city score must trace to a source. Check `publishedRankingData.json` metrics.
- CSV export at `public/downloads/slic-ranked-cities-v2.csv` must match published data.
- Methodology PDF must be comprehensive and current.
- No "SLIC logo" — always "SLIC Index" branding.
- ReTL is the tech partner (not Axiom).
- Multilingual: all UI text has en/th/zh variants in `siteCopy.ts`.

## Cross-Agent Sync Note

- Keep `data/verified_sources/city_inputs.csv`, `src/data/publishedRankingData.json`, and `public/downloads/slic-ranked-cities-v2.csv` aligned when city metrics change. Bangkok previously had stronger published JSON values than the source CSV, which is an easy handoff mistake when different models update different layers at different times.
- `src/cityBenchmarks.ts` currently exists as draft/reference copy and is not imported by the app. Treat edits there as non-user-facing unless the component is wired back into the UI.

---

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 (The Codex Incident — Anti-Regression Laws) for the full rules. These items are the personality of SLIC Index V3. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval:

- **163-cities ranking grid (154 ranked + 9 watchlist)** — the core artifact. Do not reduce the city count, do not swap in a generic table component.
- **5-pillar scoring layout** — the five pillars are the IP. Do not collapse into a single score or a generic bar chart.
- **Custom CSS only — NO Tailwind.** Do not introduce Tailwind, shadcn, or any utility-class framework. The bespoke CSS is the aesthetic.
- **"Monocle meets Red Dot" type scale** — editorial typography, hairline rules, mono numerics. ZERO border-radius. ZERO gradients.
- **EN / TH / ZH locale switch** — three languages. Do not drop any locale. Thai first-person pronoun is strictly "ผม".
- **Published ranking data triplet** — keep `data/verified_sources/city_inputs.csv`, `src/data/publishedRankingData.json`, and `public/downloads/slic-ranked-cities-v2.csv` aligned.

If you are about to remove, replace, or "simplify" any item above: stop, show the diff, wait for explicit approval.
