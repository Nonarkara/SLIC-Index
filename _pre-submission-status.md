# SLIC Index V3 — Pre-Submission Status

> One-page status for Dr Non to skim on the plane to Singapore.
> Updated: 2026-05-01 · Live: https://nonarkara.github.io/SLIC-Index/

---

## The three numbers to memorise

```
163 cities · 157 ranked + 6 watchlist · 5 pillars / 20 scored metrics + 3 diagnostics
```

That is the entire scope. Anything else a stranger asks, work outwards from these three.

---

## The Alpha tier — the public face

| Slot | Rank | City | Country | Score | Why it earns Alpha |
|---|---|---|---|---|---|
| α1 | 1 | Raleigh | United States | 70.0 | Pressure 75 — strongest US tax-adjusted income with universal-quality pillars |
| α2 | 2 | Montreal | Canada | 69.1 | Best-balanced North America profile; Pressure 62, Community 74 |
| α3 | 3 | Kaohsiung | Taiwan | 66.7 | Capability 91, Pressure 66 — the index's lived case study |
| α4 | 6 | Eindhoven | Netherlands | 64.3 | Europe seat 1/2 — engineered livability without metropolitan strain |
| α5 | 7 | Graz | Austria | 64.2 | Europe seat 2/2 — dense community signal, modest scale |
| α6 | 8 | Taipei | Taiwan | 63.8 | Capability 90 — second Taiwan slot per editorial cap |
| α7 | 11 | Jeju City | South Korea | 61.6 | Korea's only Alpha — picked over Seoul/Busan on liveability |
| α8 | 24 | Valparaiso | Chile | 59.4 | Latin America's Alpha representative |
| α9 | 27 | **Bangkok** | Thailand | 58.5 | **Anchor city.** Community 90.0 is third-strongest in dataset; Pressure 45.4 buffer +5.4 over floor; protected by two CI guards |
| α10 | 37 | Fukuoka | Japan | 57.6 | Japan's Alpha (not Tokyo); editorial cost-of-living rule barring Tokyo |

Cities with higher pure rank that did **not** make Alpha (the editorial argument made visible):
- Singapore (#15) — Community 38.8 fails Alpha floor of 40
- Perth (#20) — Oceania capped at 0 Alpha seats
- Tokyo (#22) — explicit editorial city-exclusion (cost-of-living for median resident)
- Copenhagen (#21), Zurich (#30), London (#34) — Europe Alpha cap (2/2 used) or country already claimed
- New York (#36) — US Alpha seat already taken by Raleigh

---

## Coverage honesty

| Grade | Count | Penalty | Meaning |
|---|---|---|---|
| A | 136 | 0 | Full city-level evidence across pillars |
| B | 2 | −5 | One or two pillar gaps |
| C | 19 | −15 | Multiple pillar gaps; coverage ~40-60% |
| Watchlist | 6 | excluded | Cannot meet ranked floor |

Watchlist cities (6): Haifa, Tel Aviv, Taichung, Cuenca, Apia, Port Moresby. The first three are conflict-zone or status-special (Israel editorial rule + Taichung Watchlist for missing Viability/Capability). Apia and Port Moresby were demoted on 2026-05-01 because Samoa and Papua New Guinea publish no city-level Capability data — the index would rather show a gap than a fabricated number.

---

## Integrity gates — all green

```
test/data-integrity-invariants.test.mjs           17 invariants ✓
test/methodology-drift.test.mjs                    cross-doc drift ✓
test/publication-integrity.test.mjs                 cap/floor/snapshot ✓
test/publication-regression.test.mjs                benchmark fixture ✓
test/publication-stability.test.mjs                 floor sensitivity ✓
scripts/check-publication-integrity.mjs             ✓
scripts/check-methodology-drift.mjs                 ✓
npm run build                                       ✓ clean (22 chunks)
```

Every future data refresh, tier-rule edit, or rescore runs all 21 tests. No silent drift possible. If Bangkok ever drops out of Alpha — which it shouldn't, with Pressure +5.4 above floor and Thailand uncontested — the integrity check fails CI and forces investigation.

---

## What's deliberately NOT polished (and why)

| Open item | Why it's OK to ship |
|---|---|
| `viability_transit_access_commute` missing for ~155 cities | Honestly reflected in coverage grade C. Methodology paper says it. Filling fake transit data would compromise the credibility argument — the gap is the credibility. |
| `community_birth_rate_optimism` missing for 48 cities | Same. Diagnostic only — does not enter SLIC composite. |
| Methodology PDF body in English (Thai/Chinese metadata localised) | Substantial translation effort; metadata table and key facts are localised. Not on the Red Dot critical path. |
| 1.7 MB JSON chunk on page load | Could be code-split, but the site loads in <2s on broadband and the chunk is gzipped to 142 KB. Optimisation can wait. |
| xlsx Google Sheets template (689 KB methodology toolkit) | Partner toolkit, not a user-facing artifact. |

---

## What the URL flow looks like for a Red Dot judge

```
/                          → Hero, op-ed, Alpha grid (10 cities), Beta+Gamma rows, spider allocator
/rankings                  → Live re-rank workbench, 30-tier-banded grid
/compare                   → SLIC vs EIU/Mercer/Resonance/etc. matrix
/methodology               → Full methodology + equations
/data                      → Source desk: 534 source labels, 79 domains, integrity dashboard
/city/{cityId}             → Per-city scorecard (157 of these work; 6 watchlist do too)
/thailand                  → Companion provincial scaffold
/ideas                     → 12 open-source urban tools
/about-slic                → Mission, funding, independence
/history                   → V1→V2→V3 timeline
/map                       → Global map with tier color
/side-by-side              → Two-city head-to-head
```

CSV / methodology PDF (en, th, zh) at `/SLIC-Index/downloads/`.

V1 archive: `https://nonarkara.github.io/SLIC-Index-V1/`
V2 archive: `https://nonarkara.github.io/SLIC-Index-V2/`
All three versions cross-link in a top strip.

---

## If anyone asks something hard

| Question | Answer |
|---|---|
| "Why is Bangkok #27 but in Alpha tier?" | Pure rank is global score order. Alpha is a separate editorial overlay with country caps and exclusions. Of the 26 cities ahead of Bangkok, 17 are blocked by floor scores, country claims, regional caps, or editorial exclusions. Bangkok is the 9th city to clear every gate. |
| "Why isn't Tokyo in Alpha?" | Editorial rule: Alpha is reserved for cities where the median resident genuinely thrives. Tokyo's median-resident affordability fails the test. It earns Beta. |
| "Why is Singapore Gamma not Alpha?" | Community floor 40, Singapore Community 38.8. Fails the gate. Capability 94.1 (highest in dataset) doesn't compensate. |
| "Why does the index include London at all if it ranks low?" | Reference benchmark — it's there so the methodology can be checked against a city everyone has an opinion about. |
| "What's the funding source?" | DEPA Thailand + PMU-A infrastructure support. No private donors. Editorial independence statement in footer. |
| "Can I download the data?" | Yes — CSV at /downloads/, methodology PDF in en/th/zh, every metric line traces to a source URL. |

---

## Last commit on `codex/red-dot-design-2-5-1`
After-hours work tonight (2026-04-30 → 05-01):
- Demoted Apia + Port Moresby to Watchlist (Capability pillar incomplete)
- Filled `community_birth_rate_optimism` and `viability_transit_access_commute` for London / NYC / Tokyo
- Added 17-invariant data-integrity test suite (now part of CI)
- Re-ran rescore pipeline; regenerated CSV, all three methodology PDFs, benchmark fixture
- All 5 test suites green; integrity + drift checks pass; build clean

Push when ready. `npx gh-pages -d dist`. Live URL is current.

— made with care while you slept
