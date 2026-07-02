# SLIC Index V3 — Data Assets Master Index
# All data sets, templates, and resources created by the human audit

---

## Created Data Sets

| # | File | Type | Purpose | Pages | Key Content |
|---|------|------|---------|-------|-------------|
| 1 | `SLIC_V3_Human_Audit_Report.md` | Audit Report | Comprehensive human audit of all 15 pages | 43KB | Domain-by-domain grades, gap analysis, priority action plan |
| 2 | `city-editorial-template.md` | Content Template | Write editorial rationales for all 163 cities | 25KB | Structured template + 5-language examples for Bangkok, Singapore, Taipei |
| 3 | `city-photo-sourcing-guide.md` | Resource Guide | Source free, legal photos for 163 cities | 9KB | Unsplash/Wikimedia search terms, style guide, batch workflow, credits log |
| 4 | `press-media-archive-template.md` | Archive Template | Track press, conferences, citations, podcasts | 9KB | JSON schemas for articles, talks, citations, social highlights, press kit specs |
| 5 | `team-advisory-template.md` | Team Template | Document core team, advisors, contributors | 13KB | Bios in 5 languages, advisory board terms, photo requirements, page design |
| 6 | `data-quality-report-template.md` | Report Template | Annual transparency report on data | 14KB | Source inventory, coverage grades, known issues, audit log, maintenance workflow |
| 7 | `what-this-system-could-be.md` | Vision Document | Roadmap from award-worthy to award-winning | 38KB | Current→potential state for all 15 pages, priority matrix, effort estimates |
| 8 | `data-gaps-tracker.csv` | Spreadsheet | Track what's missing per city | — | 163 cities × 10 gap columns (photos, editorial, news, etc.) |

---

## How to Use These Assets

### For Content Creators (Writers, Translators)
1. Start with `city-editorial-template.md` — it has the template and 3 worked examples
2. Use the Bangkok/Taipei/Singapore examples as style references for the remaining ~160 cities
3. Write in English first, then translate to TH/ZH/KO/JA using the same tone and structure
4. Track progress in `data-gaps-tracker.csv`

### For Designers & Photo Curators
1. ✅ **Photos are DONE** — All 163 cities already have Wikimedia Commons photos in `cityEditorial.ts`. No further photo sourcing is needed.
2. The remaining photo work is **optional quality improvements** — replacing generic skyline shots with lived-experience photos (see `city-photo-sourcing-guide.md` for style guide).
3. **Focus on the 130 cities that need editorial text** — the photo already exists, but the written rationale is missing.
4. If you want to improve photos, track credits in the photographer credit log.

### For Developers
1. Start with `what-this-system-could-be.md` — the P0 (Critical) section lists the 6 things to build first
2. Fix the nav dead-end (V2 Archive) and coverage legend KO/JA — these are 1-day fixes
3. Add Open Graph meta tags — this is the highest-impact technical change
4. Implement URL sharing for custom rankings — this is the #1 viral feature

### For Project Managers
1. Start with `SLIC_V3_Human_Audit_Report.md` — it has the full assessment and 2-week priority plan
2. Use `what-this-system-could-be.md` for the 6-month roadmap
3. Use `data-gaps-tracker.csv` to assign tasks and track completion
4. Use `data-quality-report-template.md` to set up the annual transparency process

### For Media & Partnerships
1. Start with `press-media-archive-template.md` — it has the archive structure and press kit specs
2. Use the press kit template to create downloadable assets for journalists
3. Use the conference talks template to track speaking engagements
4. Use the social highlights template to track viral mentions

---

## Quick Reference: What's Missing vs. What's Done

### ✅ What's Already Excellent (Keep It)
- **5-language translations:** All 15 pages have complete EN/TH/ZH/KO/JA translations. Quality is high.
- **Methodology rigor:** AMPI formula, coverage penalties, public tier policy, 20+ data sources.
- **Essay content:** 23 references, full 5-language body copy, 5 editorial photos.
- **History timeline:** 6 years, full translations, 20+ photos.
- **Awards page:** 4 awards, full translations, strong credibility signals.
- **Thailand page:** 77 provinces, 8 pillars, regional patterns, full translations.
- **Ideas page:** 12 civic tech concepts, excellent visual design, full translations.
- **Compare page:** 7 indices, 12 categories, full translations.
- **Technical implementation:** React + Vite, D3 maps, lazy loading, error boundaries, responsive design.

### ⚠️ What's Partially Done (Complete It)
- **City photos:** ALL 163 cities have photos via Wikimedia Commons (in `cityEditorial.ts`). ✅ Complete.
- **City editorials:** 33 cities have full editorial (heroLine + intro). **130 cities need editorial text.** Template is ready.
- **Coverage legend:** Only EN/TH/ZH have labels. KO/JA need them. Fix is trivial.
- **Press archive:** Structure is designed. Needs to be populated with actual articles.
- **Team page:** Core team is there. Advisory board needs to be added. Template is ready.
- **Data quality report:** Template is ready. Needs to be populated and published annually.

### ❌ What's Missing (Build It)
- **V2 Archive page:** Nav references it but no route exists. Remove or build.
- **Exercise page:** Redirects to `/rankings`. Build a real quiz or remove from nav.
- **Global search:** No search anywhere. Medium effort, high impact.
- **Share links / Open Graph:** No custom sharing. Critical for growth.
- **Newsletter signup:** No email capture anywhere. Critical for re-engagement.
- **Advisory board section:** Not on the About page. High credibility impact.
- **Press kit:** No downloadable assets for journalists. High media impact.
- **Data quality dashboard:** Not on the Methodology page. High transparency impact.
- **City news feeds:** No local news on scorecards. Medium effort, nice-to-have.
- **Cost calculator:** No personalized cost comparison. Medium effort, nice-to-have.
- **Comments / forum:** No community engagement. Low effort, nice-to-have.
- **Historical trends:** No V1→V2→V3 comparison. Medium effort if data exists.
- **3D globe:** Map is 2D only. Medium effort, nice-to-have.
- **PWA / Mobile app:** No offline access. High effort, future consideration.
- **Multilingual SEO:** No language-specific URLs. Medium effort, high SEO impact.
- **Accessibility audit:** Not WCAG 2.1 AA compliant. Medium effort, required for awards.

---

## File Locations

All files are in:
```
/Users/nonarkara/Projects/slic-index/v3-current/
├── SLIC_V3_Human_Audit_Report.md          ← Main audit report
├── data/
│   ├── city-editorial-template.md           ← Content template for 163 cities
│   ├── city-photo-sourcing-guide.md         ← Photo sourcing workflow
│   ├── press-media-archive-template.md      ← Media tracking archive
│   ├── team-advisory-template.md            ← Team & advisory board
│   ├── data-quality-report-template.md      ← Annual transparency report
│   ├── what-this-system-could-be.md         ← Vision & roadmap
│   └── data-gaps-tracker.csv              ← Missing data tracker
```

---

## Next Steps (Recommended Order)

### Week 1: Critical Fixes (P0)
1. Fix V2 Archive nav dead-end (1 day)
2. Fix coverage legend KO/JA (2 hours)
3. Add Open Graph meta tags to all pages (3 days)
4. Create contact forms (press, partnerships, corrections) (2 days)

### Week 2: Content Sprint (P0-P1)
1. **Write city editorials for top 30 cities** (Beta + Gamma + high-traffic Watchlist) — 5 days
2. **Add advisory board to About page** — 2 days
3. **Add press kit to About/Downloads pages** — 2 days
4. **Add data quality report to Methodology page** — 2 days

### Month 2: Full Editorial Coverage (P1)
1. **Write city editorials for all 130 remaining cities** (parallel with translation) — 4-6 weeks
2. **Add newsletter signup to Home, About, Contact pages** — 2 days
3. **Add global search to masthead** — 1 week
4. **Add URL sharing for custom rankings** — 1 week
5. **Add Open Graph meta tags** — 3 days

### Month 3: Feature Expansion (P2)
1. Add compare mode to Rankings page
2. Add historical trends to Time Machine / Rankings
3. Upgrade Map page (zoom, pan, click, filter, search)
4. Add Thailand province scorecards and interactive map
5. Add methodology video to About/Methodology pages
6. Add FAQ to About page

### Month 4-6: Polish & Future (P3)
1. Add 3D globe toggle to Map page
2. Add city news feeds to scorecards (if API available)
3. Add cost calculator to scorecards
4. Add comments to Essay and City Scorecard pages
5. Add correlation analysis to Compare page
6. Implement multilingual SEO (language-specific URLs)
7. Accessibility audit and WCAG 2.1 AA fixes
8. Performance optimization (Core Web Vitals)
9. Consider PWA or mobile app

---

*End of Master Index*
