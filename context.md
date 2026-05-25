# SLIC Index V3

## Live URLs
- GitHub Pages (primary): https://nonarkara.github.io/SLIC-Index/
- Custom domain: https://slic.nonarkara.org (Cloudflare Pages)
- Repo: https://github.com/Nonarkara/SLIC-Index

## Stack
React 19 + TypeScript 5.8 + Vite 6.2
**No Tailwind — custom CSS only** (src/styles/)
Supabase JS (visitor tracking only, no data storage)
GitHub Pages primary deploy, Cloudflare Pages secondary

## Dev
```bash
npm run dev          # Vite on port 5174
npm run typecheck    # tsc --noEmit
npm run build        # vite build → dist/
npm run preview      # preview prod build
```

## Deploy
```bash
# GitHub Pages (primary — preferred)
npm run deploy:gh    # npm run build && npx gh-pages -d dist

# Cloudflare Pages (secondary)
npm run deploy       # wrangler pages deploy dist --project-name slic-index
```
⚠️ GitHub Actions token expired — manual `npm run deploy:gh` until token renewed.

## Math Integrity (run before every release)
```bash
npm run verify:math  # rescore + check:publication + check:methodology + test
npm run rescore      # Recalculate all city scores from raw signals
npm run test         # node --test test/*.test.mjs
```

## Data
- `src/data/rankingsData.ts` — 163 cities, ~3100 lines, all pillar scores
- `public/publishedRankingData.json` — 1.7MB frozen benchmark snapshot
- 5 pillars: Growth (25%), Viability (22%), Capability (18%), Community (15%), Creative (20%)
- Scoring: AMPI (Adjusted Mazziotta–Pareto Index), absolute 0–100, no imputation

## Design (from CLAUDE.md — protected, do not change)
- Fonts: Libre Baskerville (headings), Inter (body), JetBrains Mono (data)
- Palette: cream #f8f5f0 bg, dark #1c1914 text, amber #b85c28 accent
- NO rounded corners. NO Tailwind. NO gradients. "Monocle meets Red Dot."

## Env Vars
File: `shared/.secrets-backup/indices_smart-city-thailand-index_.env`
- `VITE_GISTDA_SPHERE_KEY` — GISTDA Sphere basemap / visitor tracking

## Anti-Regression (CLAUDE.md protections)
163-city grid, 5-pillar layout, custom CSS only, EN/TH/ZH locales, published ranking
data triplet (CSV + JSON + CSV export) are all protected. Do not touch without approval.
