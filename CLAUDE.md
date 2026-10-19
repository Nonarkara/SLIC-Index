# SLIC Index V3 — Project Instructions

## What This Is

SLIC (Smart and Liveable Cities Index) V3 — a transparent, open-source city ranking system.
163 published cities (158 ranked + 5 watchlist), 5 pillars, 22 scored metrics + 3 diagnostics. Deployed to Cloudflare Pages at https://slic.nonarkara.org.

- **Live site:** https://slic.nonarkara.org
- **Repo:** https://github.com/Nonarkara/SLIC-Index
- **Branch:** `main` (active development)

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6
- No Tailwind — custom CSS only in `src/styles.css` (~13,000 lines, editorial "Monocle meets Red Dot" aesthetic)
- Supabase JS for visitor tracking only (no auth, no backend)
- Cloudflare Pages deployment (root base path `/`)
- Cloudflare Pages Worker (`public/_worker.js`) enforces edge request boundaries, returns 400 on path-traversal attempts, returns 405 on non-GET/HEAD, masks server errors

## Build & Run

```bash
npm run dev               # Vite dev server on port 5173
npm run build             # vite build → dist/
npm run preview           # Preview built site
npm run typecheck         # tsc --noEmit — passes clean (0 errors)
npm run test              # node --test — 63/63 pass
```

The full release gate is `npm run verify:release` — typecheck + build + tests + check:publication + check:csv + check:methodology + check:translations + check:audit. Exits non-zero on any failure. The new `check:audit` runs `scripts/audit-data-integrity.mjs`, which catches identity / ranking / scoring / coverage / metric / cross-artifact / hash drift issues.

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
├── visitorTracking.ts         # Supabase-backed visitor counter (gated behind VITE_VISITOR_COUNT_URL)
├── styles.css                 # Complete design system (~13,000 lines, all design tokens)
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
- **Logo:** `slic-index-full.png` (horizontal, 140×36) in masthead
- **Tech partner:** ReTL (The Reason to Live Company) — replaced Axiom AI
- **Collaboration logos:** UWN (PMU-A), DEPA Thailand, Smart City Thailand, ReTL
- **Shared brand assets:** `/Users/nonarkara/Projects/_reference/brand-assets/`

## Design System (CSS)

- **Fonts:** Source Serif 4 (display headings, replaces Libre Baskerville which only had 400/700 and snapped everything to Bold), Source Sans 3 (body), JetBrains Mono (data)
- **Colors:** Cream `#f8f5f0` background, dark `#1c1914` text, amber `#b85c28` brand accent, `--accent-amber-text: #a04e20` (5.32:1 on cream, AA-compliant) for body text uses, Sanzo Wada-derived pillar palette
- **Dark sections:** Spider/allocator area uses inverted colors
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
npm run verify:release   # full gate — typecheck, build, test, check:publication, check:csv, check:methodology, check:translations, check:audit
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
