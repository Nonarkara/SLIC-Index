# SLIC Index — Project Instructions for Claude

This file is the single source of truth for every Claude Code session working on the SLIC Index. Read it before writing a single line.

---

## What This Project Is

**SLIC (Smart and Liveable Cities Index)** is a city ranking that deliberately disagrees with the establishment. It ranks 157 cities across 5 pillars and 35 signals, measuring what actually matters to residents — not expats, tourists, or investors.

The thesis: **Every major city ranking is an ideological artifact. EIU calculates hardship pay for expats. Mercer does the same for HR departments. Monocle curates lifestyle for the already-rich. Yonsei counts smart city apps without asking if they help anyone. SLIC measures what's left after rent.**

Created by **Dr. Non Arkara** (Harvard PhD, MIT Architecture, Oxford Chinese Studies) and **Associate Professor Poon Thiengburanathum**, launched at SCSE 2026 Taipei to 3,000 professionals. A European mayor's alliance asked to use it instead of The Economist's index.

---

## Who Dr. Non Is (and How He Works)

- Senior Expert at Thailand's Digital Economy Promotion Agency (depa)
- Works **exclusively in Claude Code** — no IDE
- Ships constantly, evaluates on **live deployed URLs only** — localhost is not a deliverable
- Thinks architecturally, mathematically, from first principles
- Context-switches across 25+ projects
- Communicates through documentation and memory files

### What Makes Him Say "Good"
- Clean, minimal design that reveals complexity progressively
- Real data, real photos, real sources — every number traceable
- Something that looks like a human designer spent weeks on it
- Mathematical rigor behind the aesthetics
- A live URL that loads fast and works perfectly

### What Makes Him Say "This Looks Templated"
- Rounded corners (the default Bootstrap/Tailwind look)
- Boxed card grid layouts (SaaS dashboard aesthetic)
- Default blue (#3B82F6 — the universal "Claude made this" signal)
- Fat text, gratuitous icons, placeholder content
- Symmetric centered-everything layouts
- Dark-mode-by-default without purpose
- Any design his cousin's lunch box app could also have

---

## Design Language

### Aesthetic: Monocle Editorial
Warm, photographic, story-driven. Not Bloomberg data-dense. Not Apple-minimal-empty. Not corporate-jargon. Think: opening an issue of a magazine you can't put down.

### Rules
- **border-radius: 0px** by default. Max 1-2px subtle. Exception: playing card shapes (4-6px), tags/badges (2-3px)
- **No default blue** — use project palette (navy #2B3A67, teal #2A9D8F from SLIC logo)
- **Asymmetric layouts** over centered grids
- **Pull quotes** in large serif italic between sections
- **Full-bleed photo breaks** for editorial breathing room
- **Real photos only** — never stock, never AI-generated, never wrong city
- **Typography hierarchy**: Libre Baskerville (headings), Inter (body), JetBrains Mono (data/code)

### Brand Colors (from SLIC Index logo)
```
--slic-navy: #2B3A67      /* primary text on light backgrounds */
--slic-teal: #2A9D8F      /* accent, interactive elements */
--bg: #f8f5f0             /* warm cream background */
--text: #1c1914           /* near-black text */
```

### Pillar Colors (shared via pillarConfig.ts)
```
pressure:   #b85c28  (burnt orange/amber)
viability:  #1a6b5a  (teal)
capability: #2a5a8c  (navy)
community:  #8c4a2a  (warm brown)
creative:   #a0382a  (dark red)
```

---

## Architecture

### Tech Stack
- React 19 + TypeScript + Vite 6
- Custom SPA routing (no React Router)
- Single CSS file (`styles.css`, ~8000+ lines)
- Pillar config shared via `pillarConfig.ts`
- SLIC logo inlined as base64 in `brandAssets.ts` (prevents broken images)
- Visitor tracking: Google Sheets + Supabase dual-write

### Page Structure (zero redundancy rule)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | CompareRankingsPage | The argument — op-ed, ComparisonGrid, blind spots, Moneyball, endorsement |
| `/rankings` | RankingsPage | The tool — spider allocator, city list, filters |
| `/methodology` | MethodologyPage | How it works — full technical documentation |
| `/about-slic` | SlicProfilePage | Who we are |
| `/thailand` | ThailandPage | Regional focus — 77 provinces |
| `/ideas` | IdeasPage | Steal This Idea — real city innovations |
| `/history` | HistoryPage | V1→V2→V3 journey |
| `/city/:id` | CityScorecardPage | Individual city — full metric breakdown |

**Rule: One purpose per page. No duplicate spiders. No duplicate comparison grids.**

### Navigation
- SLIC logo click → `/` (the argument)
- "Rankings" → `/rankings` (the tool)
- These are DIFFERENT experiences, not the same page

### Deployment
| Version | URL | Platform |
|---------|-----|----------|
| V3 (current) | nonarkara.github.io/SLIC-Index/ | GitHub Pages (free, static) |
| V3 mirror | slic-index-v2.vercel.app | Vercel (may hit rate limits) |
| V2 (archive) | nonarkara.github.io/slic-index-V2/ | GitHub Pages |
| V1 (archive) | nonarkara.github.io/slic-landing-page/ | GitHub Pages |

### GitHub Pages Deployment (critical gotcha)
The site deploys from a `gh-pages` branch containing the built `dist/` contents. Because it's at a subdirectory (`/SLIC-Index/`), ALL asset paths must be relative:

```bash
# After `npx vite build`, fix paths:
sed -i '' 's|src="/assets/|src="./assets/|g; s|href="/assets/|href="./assets/|g' dist/index.html
cp dist/index.html dist/404.html  # SPA fallback

# Fix ALL JS bundles:
for f in dist/assets/*.js; do
  sed -i '' 's|"/Logos/|"./Logos/|g; s|"/photos/|"./photos/|g; s|"/launch-photos/|"./launch-photos/|g; s|"/city-photos/|"./city-photos/|g; s|"/downloads/|"./downloads/|g; s|"/knowledge-rack/|"./knowledge-rack/|g' "$f"
done
```

**If you skip this, logos, photos, and PDFs will 404 on GitHub Pages.**

### Vercel Deployment
Deploy `dist/` directly with `npx vercel deploy dist/ --prod --yes --scope nonarkaras-projects --name slic-index-v2`. Include a `dist/vercel.json`:
```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "rewrites": [
    { "source": "/((?!assets|Logos|launch-photos|city-photos|downloads|knowledge-rack|photos).*)", "destination": "/index.html" }
  ]
}
```

---

## The Five Pillars

| Pillar | Weight | What It Measures |
|--------|--------|-----------------|
| **Growth** (Pressure) | 25% | Disposable income after rent (PPP). Housing burden. Working-time pressure. Overwork penalty. |
| **Viability** | 22% | Safety. Transit. Clean air. Digital infrastructure. Climate. |
| **Capability** | 18% | Healthcare access. Education quality. Equal opportunity. |
| **Community** | 15% | Belonging. Tolerance. Cultural life. Whether your neighbors want you there. |
| **Creative** | 20% | Entrepreneurial friction. Innovation intensity. Government stability. |

### What SLIC Measures That Others Don't
1. Disposable income after rent (not GDP)
2. Overwork and working-time pressure
3. Tolerance and civic openness
4. Cultural experience diversity (for residents, not tourists)
5. Suicide and mental strain
6. Graduate housing burden

---

## Comparison Indices

SLIC explicitly compares itself against these five:

| Index | What it actually does | Accent color |
|-------|----------------------|-------------|
| EIU | Calculates hardship pay for corporate expats | #2a5a8c |
| Mercer | Same but for HR departments | #1a6b5a |
| Resonance | Measures Instagram buzz for city marketing | #8c4a2a |
| Monocle | Curates lifestyle for people who can already afford anywhere | #b85c28 |
| Yonsei-Cambridge | Counts smart city apps without asking if they help | #a0382a |

The `ComparisonGrid` component shows all six indices side-by-side with frequency highlighting — hover any city to see where else it appears.

---

## Content Standards

### Non-Negotiable
- **Every number sourced** — no hallucinated data
- **Real photos of real places** — never wrong city (Lyon ≠ Paris, Katowice ≠ Warsaw)
- **Trilingual**: English, Thai (ไทย), Chinese (中文) — all natural, never machine-translation quality
- **No placeholder content** — every headline real, every claim sourced
- **Watchlist transparency** — war zones (Syria, Yemen, Sudan, Myanmar) on watchlist, not quietly dropped

### Editorial Voice
Elegant but direct. Academic rigor without stuffiness. Funny because it's true, not because it's trying to be funny.

Examples of the voice:
- "Every city ranking is a lie. Here's ours."
- "The establishment indices measure where Goldman Sachs should send its London bankers. SLIC measures where your next office should actually be."
- "Try telling someone in Kaohsiung their city isn't liveable."

### The Moneyball Angle
SLIC is positioned as **investment intelligence** — finding undervalued cities that establishment indices ignore. Cheaper rent, better weather, government incentives, local talent pipelines, affordable living. "You don't have to invest in Vienna because The Economist told you to."

---

## Visitor Tracking

All three versions send visitor data to the same Google Sheets endpoint:
```
https://script.google.com/macros/s/AKfycbxvOCOjlsYHF7qwWEXEYyDM8CeoLfT2asWRwaa171evuRoa-HubOkliqG3GPNyshUE4mw/exec
```

Payload: `{ ip, country, region, city, userAgent, referrer, page, version }` — geo data from ipapi.co.

Spreadsheet: `1if9nlDBaq6jDJmmK7azVnyo-woj8QpGOCY7piyzXLNg`

---

## Known Issues & Gotchas

1. **GitHub Pages subdirectory paths** — `/SLIC-Index/` base means all asset paths must be relative in the gh-pages build
2. **Vite build caching** — if builds produce stale output, delete `node_modules/.vite` and `dist/`, then `npm install && npx vite build`
3. **index.html corruption** — switching to `gh-pages` branch can overwrite `index.html` with the built version (has `./assets/` paths instead of `/src/main.tsx`). Always `git checkout -- index.html` if builds fail with `ERR_MODULE_NOT_FOUND`
4. **PDF viewer** — iframe embedding breaks on subdirectory deployments. Use direct download only, no modal
5. **Vercel rate limits** — too many CLI deploys in one day triggers fair-use block (resets in 24h)
6. **Bangkok PPP bias** — disposable income normalizes poorly against high-income cities. Needs methodology refinement in V4
7. **Partner logos** — must be served from relative paths; base64 for the SLIC logo, file paths for partners

---

## Endorsements

> "They built the index. But you build the ranking."
> — Svetlana Tesic, CoFounder, Mayors of Europe
> https://mayorsofeurope.eu/news/they-built-the-index-but-you-build-the-ranking/

---

## Version History

| Version | What Changed | Cities | Live |
|---------|-------------|--------|------|
| V1 | LinkedIn provocation. First transparent ranking. | 103 | [GitHub Pages](https://nonarkara.github.io/slic-landing-page/) |
| V2 | SCSE 2026 Taipei launch. Interactive spider. European mayors. | 174 | [GitHub Pages](https://nonarkara.github.io/slic-index-V2/) |
| V3 | Op-ed redesign. Six-index comparison. Moneyball framing. Red Dot prep. | 157 ranked + watchlist | [GitHub Pages](https://nonarkara.github.io/SLIC-Index/) |

---

## Red Dot Design Award Preparation

Submitted to Red Dot Award: Brands & Communication Design (Website category). Judges evaluate on **idea, form, and impact**.

Design system has:
- Typography scale variables (`--type-xs` through `--type-4xl`)
- Spacing scale (`--space-xs` through `--space-4xl`)
- Motion tokens (`--ease`, `--duration-fast/normal/slow`)
- Global focus-visible states for accessibility
- Custom `::selection` styling
- Shared `pillarConfig.ts` across all pages (unified colors)

---

## What To Do When Starting a New Session

1. Read this file first
2. Check `git status` and `git log --oneline -5` to understand current state
3. Check if the dev server runs: `npx vite build` (if it fails, `rm -rf node_modules dist && npm install`)
4. Check live site: `curl -s -o /dev/null -w "%{http_code}" "https://nonarkara.github.io/SLIC-Index/"`
5. Ask Dr. Non what he wants to work on — he always knows
