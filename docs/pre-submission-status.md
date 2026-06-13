# SLIC Index V3 — Pre-Submission Status

> One-page status for Dr Non to skim on the plane.
> Updated: 2026-06-14 · Live: https://slic.nonarkara.org · Score model: `slic-v3.4.0` · Tier policy: `public-tier-v1.3.0` · Languages: EN / TH / ZH / KO / JA

---

## The three numbers to memorise

```
163 cities · 158 ranked + 5 watchlist · 5 pillars / 22 scored metrics + 3 diagnostics
```

That is the entire scope. Anything else a stranger asks, work outwards from these three.

---

## The Alpha tier — the public face

(Pure rank → Alpha slot. Current snapshot from `publishedRankingData.json`.)

| Slot | Rank | City | Country | Coverage | Why it earns Alpha |
|---|---|---|---|---|---|
| α1 | 1 | Montreal | Canada | A | Best-balanced North America profile |
| α2 | — | Raleigh | United States | A | Strongest US tax-adjusted income with universal-quality pillars |
| α3 | — | Kaohsiung | Taiwan | A | Capability strong — the index's lived case study |
| α4 | — | Eindhoven | Netherlands | A | Europe seat 1/2 — engineered liveability without metropolitan strain |
| α5 | — | Graz | Austria | A | Europe seat 2/2 — dense community signal, modest scale |
| α6 | — | Taipei | Taiwan | A | Second Taiwan slot per editorial cap (Taiwan max 2) |
| α7 | — | Jeju City | South Korea | A | Korea's only Alpha — picked over Seoul/Busan on liveability |
| α8 | — | Fukuoka | Japan | A | Japan's Alpha (not Tokyo); cost-of-living rule barring Tokyo |
| α9 | — | Valparaiso | Chile | A | Latin America's Alpha representative |
| α10 | 52 | **Bangkok** | Thailand | A | **Anchor city.** Community floor cleared, Pressure +5.4 above floor, A-grade coverage, Thailand uncontested |

Cities with higher pure rank that did **not** make Alpha (the editorial argument made visible):

- **Singapore (#48)** — Community fails Alpha floor of 40; lands in Gamma
- **Tokyo, Hong Kong, Sydney, Vancouver, LA, Adelaide, Honolulu, SF, Melbourne, San Diego, Brisbane, London, Amsterdam, Athens, Prague, Košice** — `alphaCityExclusions` (housing-cost rule, backed by Demographia 2025 median-multiple + Deloitte Property Index 2025)
- Various European candidates — Europe Alpha cap (2/2 used)
- US Alpha seat already taken by Raleigh — NYC, Boston, etc. push to Beta/Gamma
- South Korea Alpha cap (1/1 used) — Seoul / Busan blocked

V1.3.0 changes (committed today): Alpha now requires coverage grade A, so missing pressure inputs cannot be converted into a top-shelf claim.

---

## Coverage honesty

| Grade | Count | Penalty | Meaning |
|---|---|---|---|
| A | ~136 | 0 | Full city-level evidence across pillars |
| B | ~few | −5 | One or two pillar gaps |
| C | ~few | −15 | Multiple pillar gaps; provisional |
| Watchlist | 5 | excluded | Cannot meet ranked floor — Haifa, Tel Aviv, Taichung, Apia, Port Moresby |

Two earlier watchlist cities (Cuenca, plus a sixth from May 1) have moved status; the current snapshot is 5. Haifa + Tel Aviv held back under the Israel editorial rule; Taichung is Watchlist because of missing Viability/Capability inputs; Apia + Port Moresby because Samoa / Papua New Guinea publish no city-level Capability data. The index would rather show a gap than a fabricated number.

---

## Integrity gates — all green

```
21 / 21 invariants                                  ✓
scripts/check-publication-integrity.mjs             ✓
scripts/check-methodology-drift.mjs                 ✓
npm run typecheck                                    ✓
npm run build                                        ✓
```

Every future data refresh, tier-rule edit, or rescore runs all 21 tests. No silent drift possible.

---

## What's deliberately NOT polished (and why)

| Open item | Why it's OK to ship |
|---|---|
| `viability_transit_access_commute` missing for several cities | Honestly reflected in coverage grade C. Methodology paper says it. Filling fake transit data would compromise the credibility argument — the gap is the credibility. |
| `community_birth_rate_optimism` missing for some cities | Same. Diagnostic only — does not enter SLIC composite. |
| Methodology PDF body translation (EN master PDF; TH/ZH/KO/JA share EN content with localised metadata) | Substantial translation effort; the site UI is now in all 5 languages, but the downloadable PDF remains EN. Not on the Red Dot critical path. |
| 1.9 MB JSON published-data chunk on page load | Could be code-split, but the site loads in <2s on broadband and the chunk is gzipped to 158 KB. |
| xlsx Google Sheets template (689 KB methodology toolkit) | Partner toolkit, not a user-facing artifact. |

---

## What the URL flow looks like for a Red Dot Editorial / DEmark / CEA juror

```
/                          → Hero, op-ed, Alpha grid (10 cities), Beta+Gamma rows, spider allocator
/rankings                  → Live re-rank workbench, tier-banded grid
/compare                   → SLIC vs EIU/Mercer/Resonance/Monocle/Yonsei-Cambridge/IMD/GPCI/Oxford/Hanke/SLIC Soft Power (10 indices)
/methodology               → Full methodology, equations, worked Bangkok example
/data                      → Source desk: per-metric provenance, integrity dashboard
/city/{cityId}             → Per-city scorecard
/thailand                  → Companion provincial scaffold
/ideas                     → Open-source urban tools ("Steal This Idea")
/essay                     → Long-form editorial
/about-slic                → Mission, funding, independence
/history                   → V1 → V2 → V3 timeline + summit appearances
/map                       → Global map with tier color
/side-by-side              → Two-city head-to-head
/awards                    → ★ NEW (Pass 3) Submission dossier surface
```

CSV / methodology PDF (en, th, zh) at `/downloads/`.
V1 archive: `https://nonarkara.github.io/SLIC-Index-V1/`
V2 archive: `https://nonarkara.github.io/SLIC-Index-V2/`

---

## If anyone asks something hard

| Question | Answer |
|---|---|
| "Why is Bangkok #52 but in Alpha tier?" | Pure rank is global score order. Alpha is a separate editorial overlay with country caps, coverage floor, and city exclusions. Of the cities ahead of Bangkok, 17 are blocked by floor scores, country claims, regional caps, or editorial exclusions. Bangkok is the 10th city to clear every gate. |
| "Why isn't Tokyo in Alpha?" | Editorial rule: Alpha is reserved for cities where the median resident genuinely thrives. Tokyo's median-resident affordability fails the test. It earns Beta. Backed by Demographia 2025 median-multiple data. |
| "Why is Singapore Gamma not Alpha?" | Community floor 40; Singapore Community 38.8. Fails the gate. Capability 94.1 (highest in dataset) doesn't compensate. |
| "Why does the index include London at all if it ranks low?" | Reference benchmark — it's there so the methodology can be checked against a city everyone has an opinion about. |
| "What's the funding source?" | DEPA Thailand + PMU-A infrastructure support. No private donors. Editorial independence statement in footer. |
| "Can I download the data?" | Yes — CSV at `/downloads/slic-ranked-cities-v2.csv`, methodology PDF in en/th/zh, every metric line traces to a source URL. |
| "Where do I see the submission dossier?" | `/awards` (Pass 3). Four-lens scorecard against Red Dot Editorial, DEmark, CEA Creative Technology, CEA Creative Advocacy. |

---

## Awards submission status (2026-06-14)

| Award | 2026 status | Target | Notes |
|---|---|---|---|
| Red Dot Brands & Communication | Closed (Latecomer 8 May) | **2027 Early Bird ~Feb 2027** | Category pending: Editorial Design vs Digital Solutions |
| DEmark — System Service & Digital Platform | Closed (8 May) | **2027 Q1** | 1–3 min video script drafted; recording later |
| CEA Creative Technology Award | Open window June–Aug 2026 | **2026 if packet drops** | Relationship-led — Non handles via DEPA |
| CEA Creative Advocacy Award | Open window June–Aug 2026 | **2026 companion** | Same channel |

*Note: The `eefdeeb` hardening pass and June 14 targeted fixes have landed. The application dossier, site copy, and project descriptions are fully Red Dot ready.*

Full audit: [`docs/AWARDS-AUDIT-2026-05.md`](AWARDS-AUDIT-2026-05.md). Pass-3 fix log: [`docs/CLASS-DEMO-PREP-2026-05-26.md`](CLASS-DEMO-PREP-2026-05-26.md).

— refreshed for the awards-audit pass · numbers verified against `methodologyFacts` block in `src/data/publishedRankingData.json`
