
---

## Copenhagenize Index 2025 — Active Mobility / Cycling Infrastructure

**Filed:** 2026-06-08  
**Source:** Copenhagenize Index by Copenhagenize and EIT Urban Mobility (2025)  
**URL:** https://copenhagenize.eu/index  
**Coverage:** EU cities only, ~21 cities ranked

### Intent
User: "Extra points to some cities." — incorporate cycling infrastructure as a data dimension in V4.

### SLIC Crosswalk (10 overlapping cities)

| City | Copenhagenize Rank | Copen Score (approx) | SLIC V3 Rank | SLIC Score |
|---|---|---|---|---|
| Copenhagen | #2 | ~71 | 13 | 66.0 |
| Amsterdam | #4 | ~67 | 46 | 59.8 |
| Helsinki | #6 | ~64 | 28 | 62.9 |
| Antwerp | #8 | ~64 | 54 | 58.0 |
| Lyon | #14 | ~59 | 25 | 63.8 |
| Munich | #16 | ~58 | 120 | 34.4 |
| Vienna | #17 | ~57 | 47 | 59.5 |
| Graz | #18 | ~57 | 12 | 66.8 |
| Bologna | #21 | ~52 | 57 | 56.9 |
| Ljubljana | #20 | ~52 | 66 | 53.3 |
| Paris | #5 | ~62 | 67 | 53.2 |

SLIC European cities with NO Copenhagenize data: Eindhoven, Gothenburg, Bergen, Zurich, Braga, Porto, Katowice, Toruń, Gdańsk, Kraków, Budapest, Valencia, Cork, Venice, Malmö (not in SLIC).

### Key structural observations

1. **Coverage is EU-only** — 10/158 ranked cities (~6.3%). Would require a global active mobility source (ITDP, Numbeo cycling safety, WHO physical activity index) to activate globally without penalizing all Asian/African/American cities.

2. **Munich paradox** — Copenhagenize #16 (~58) but SLIC #120 (34.4). Cycling infra score would not salvage Munich's position because its SLIC drag is non-mobility metrics (likely Growth/pressure). Worth checking which metrics pull Munich to 120.

3. **Candidate pillar: Viability** — Active mobility fits Viability (sustainable urban systems) better than Community (social cohesion) or Creative (knowledge economy). Could pair with an existing environment metric. Alternative: sub-metric under the dormant Transit metric (which has unit inconsistency across 7 cities).

4. **Transit metric pathway** — In V4, the Transit metric could be split into:
   - `Active Mobility` (cycling modal share or Copenhagenize-style score) — global data via ITDP or survey
   - `Public Transport Access` (frequency, coverage, ridership) — separate unit, separate normalization
   This avoids the V3 unit mismatch (modal share % vs commute minutes) that caused transit to go dormant.

5. **Score range** — Copenhagenize uses a 0–100 proprietary scale (40–72 visible in this dataset). Would need to be converted to SLIC normalized score via P5/P95 anchors on whatever population SLIC covers.

### Action for V4

- Source global cycling infrastructure data from ITDP (Institute for Transportation and Development Policy) before committing to Copenhagenize as the canonical source — ITDP has broader global coverage.
- If Copenhagenize remains EU-only, treat it as a supplementary source to validate ITDP values for overlap cities, not as a standalone metric.
- Pilot with a V4 sub-metric "Active Mobility Index" in Viability pillar; weight TBD.
- Munich #120 explained: Growth pillar has zero data (coverage 47%), AMPI imbalance penalty = 12.4 pts (Viability 100 vs Creative 36.2), Grade C = −15 pts. Raw weighted mean = 61.8 → would rank ~30 with full data. Cycling score would not move it — Growth data population is the V4 fix, not a new metric.


---

## Global Peace Index 2026 — Safety & Stability Dimension

**Filed:** 2026-06-10  
**Source:** Global Peace Index 2026 by Institute for Economics & Peace (IEP)  
**BBC article:** https://www.bbc.com/travel/article/20260609-what-its-like-to-live-in-the-worlds-safest-countries-for-2026  
**Direct source:** https://www.visionofhumanity.org/maps/#/  
**Coverage:** 163 nations (same count as SLIC V3's ranked set)  
**Methodology:** 23 indicators — military expenditure, ongoing conflict, homicide rates, perceptions of safety, weapons imports, political terror, violent demonstrations, militarisation  
**Publisher:** Institute for Economics & Peace (IEP), founded 2007

### Top 10 GPI 2026

| Rank | Country | Notes |
|---|---|---|
| 1 | Iceland | 19th consecutive year; ↑2% from drop in violent demos |
| 2 | New Zealand | ↑ from #3; Asia-Pacific safest; weapons imports fell |
| 3 | Switzerland | ↑ from #5; military neutrality + low crime |
| 4 | Slovenia | First time in top 5 |
| 5 | Ireland | Low violence, military non-alignment |
| 6 | Austria | — |
| 7 | Portugal | — |
| 8 | Singapore | — |
| 9 | Finland | — |
| 10 | Japan | — |

Context: global peacefulness deteriorated in 99 countries, 12th consecutive year of decline. These 10 countries are standing apart from the trend.

### SLIC V3 Crosswalk — 18 cities inside GPI top-10 countries

| SLIC City | Country | GPI Country Rank | SLIC Rank | SLIC Score | Community |
|---|---|---|---|---|---|
| Graz | Austria | #6 | 12 | 66.8 | 76.9 |
| Braga | Portugal | #7 | 16 | 65.5 | 68.7 |
| Porto | Portugal | #7 | 26 | 63.4 | 68.7 |
| Helsinki | Finland | #9 | 28 | 62.9 | 60.3 |
| Christchurch | New Zealand | #2 | 31 | 62.2 | 70.8 |
| Dunedin | New Zealand | #2 | 32 | 62.1 | 70.8 |
| Fukuoka | Japan | #10 | 33 | 62.0 | 59.9 |
| Wellington | New Zealand | #2 | 34 | 61.9 | 70.8 |
| Sapporo | Japan | #10 | 39 | 60.7 | 59.9 |
| Auckland | New Zealand | #2 | 40 | 60.6 | 70.8 |
| Zurich | Switzerland | #3 | 41 | 60.5 | 82.1 |
| Hiroshima | Japan | #10 | 42 | 60.5 | 59.9 |
| Tokyo | Japan | #10 | 43 | 60.4 | 73.0 |
| Kobe | Japan | #10 | 44 | 60.4 | 59.9 |
| Cork | Ireland | #5 | 45 | 59.9 | 93.4 |
| Vienna | Austria | #6 | 47 | 59.5 | 75.0 |
| Singapore | Singapore | #8 | 48 | 59.4 | 38.4 |
| Ljubljana | Slovenia | #4 | 66 | 53.3 | 87.7 |

Iceland (#1 GPI) has no SLIC city — Reykjavik not in V3 dataset.

### Key analytical observations

**1. Ljubljana anomaly** — Slovenia is GPI #4 (first time in top 5), but Ljubljana sits at SLIC #66 (53.3). Community is 87.7 (high tolerance, high hospitality). The drag is almost certainly Growth pillar. Peace and safety do not equal economic dynamism. SLIC is correct to separate the two.

**2. Singapore paradox sharpens** — GPI #8 (among world's most peaceful) but SLIC #48 (Gamma tier, Community 38.4 fails Alpha floor by 1.6 pts). GPI peace ≠ SLIC community openness. Singapore's peace is institutional/security-enforced; SLIC's Community measures social openness and tolerance. The index is not wrong — it's measuring something different and more granular.

**3. New Zealand 4-city cluster** (#31–40) — a peaceful country but mid-tier SLIC performance. Consistent with Growth drag (post-2020 fiscal conditions, debt levels). Safety is already baked into their Community scores (70.8 range). Adding GPI would reinforce but not dramatically reorder.

**4. Cork** (#45, Community 93.4) — highest Community score in dataset for Irish cities. Ireland's GPI top-5 status is fully reflected in Cork's Community score already. GPI adds redundancy here, not new information.

**5. Coverage symmetry** — GPI covers all 163 SLIC-ranked cities' countries. Unlike Copenhagenize (EU-only), GPI provides global coverage. No coverage penalty for Asian or African cities.

### V4 Integration options

**Option A — Supplementary safety validation layer**  
Use GPI country score to cross-validate SLIC's existing homicide-rate-based safety metric. Flag cities where GPI ranking diverges sharply from SLIC Community score (e.g. Ljubljana, Singapore). No new metric needed — use as an audit check.

**Option B — New V4 metric: "Stability & Peace Index"**  
Add GPI national score as a standalone metric under the **Viability** pillar (sustainable governance/security). Weight: ~2–3 points. Normalized via P5/P95 across all 163 country scores. Countries not in GPI top-10 still have GPI scores — IEP publishes scores for all 163 nations. This is the cleanest integration path: global coverage, transparent source, 23-indicator depth.

**Option C — Replace/augment UNODC homicide metric**  
GPI's 23-indicator peace score is more comprehensive than homicide rate alone. Could serve as a richer safety proxy. Risk: loses comparability with V3 methodology. Better to add alongside, not replace.

**Recommendation for V4:** Option B + A combined. Add GPI as a Viability sub-metric (weight 2–3), then use Option A to audit Community scores against it. File under Viability rather than Community because peace/stability is a structural/institutional quality (like rule of law) not a social cohesion quality.


---

## "Roadmap for Eradicating Poverty Beyond Growth" — Beyond-GDP Methodology Signal

**Filed:** 2026-06-10  
**Source:** The Guardian, 10 June 2026  
**URL:** https://www.theguardian.com/commentisfree/2026/jun/10/economists-maths-growth-doomed-strategy-un-agencies-political-leaders  
**Authors / signatories:** Olivier De Schutter (chair, New Economies for Eradicating Poverty), Joseph Stiglitz (Nobel laureate), Jayati Ghosh (UMass Amherst), Thomas Piketty (Paris School of Economics), Kate Raworth (Oxford, Doughnut Economics), Jason Hickel (Barcelona, Degrowth). 350+ total signatories including Jean Drèze, Pavlina Tcherneva, Tim Jackson, Julia Steinberger, Timothée Parrique.  
**Process:** 18 months, 400+ contributors — UN agencies, national governments, civil society, trade unions, grassroots movements (global north and south)

### Core argument

The "grow-tax-transfer" model has failed: national incomes expanded while wages stagnated, public services were cut, inequality widened. Growth is also ecologically unsustainable. The real question is not whether growth continues but *what kind of economies we are building and who they serve*.

Alternative: economies redesigned around **fulfilment of rights and collective wellbeing within planetary boundaries** — not GDP maximisation.

Key structural proposals:
- Living wages, employment guarantees, workplace democracy
- Universal public provisioning (housing, health, education, transport)
- Public control of strategic assets
- Debt justice for the global south (3.4bn people in countries spending more on debt servicing than healthcare/education)
- "Beyond GDP" indicators and an international panel on inequality

### Why this matters for SLIC V4

**1. Direct challenge to SLIC's Growth pillar framing**  
SLIC V3's Growth pillar (25% weight) uses DI_PPP and macroeconomic metrics as proxies for city wellbeing. Stiglitz, Piketty, and Raworth — whose frameworks inform the academic discourse SLIC methodology cites — are now explicitly calling GDP-linked metrics insufficient. V4 should articulate *why SLIC's Growth pillar is not GDP growth* more clearly in the methodology. DI_PPP is disposable income per capita (purchasing power), which already decouples from raw GDP — but this should be stated explicitly.

**2. Debt burden metric validation**  
Signatories note 3.4bn people live in countries spending more on debt servicing than healthcare or education. SLIC V3 already includes Debt Burden as a Growth sub-metric. This paper provides direct academic backing for that choice. Cite it in V4 methodology.

**3. AMPI scoring is the anti-thesis of GDP maximisation**  
AMPI explicitly penalises pillar imbalance — a city cannot score high by excelling on Growth alone if Community or Viability lags. This is structurally aligned with the "beyond GDP" argument. V4 methodology should name this alignment.

**4. Potential new metric: "Beyond-GDP composite"**  
Raworth's Doughnut Economics and Hickel's Degrowth frameworks have produced city-level indices (Doughnut City Portrait, Thriving Cities Index). These could feed a V4 Viability or Community sub-metric. Specifically: Hickel's Social Metabolism data and Raworth's Doughnut City assessments (Amsterdam, Brussels, Copenhagen, Portland) have city-level coverage for a handful of SLIC cities.

**5. Kate Raworth's Doughnut — direct SLIC relevance**  
Amsterdam commissioned the first official Doughnut City Portrait in 2020. Amsterdam is in SLIC (rank 46). If Raworth's team publishes additional city assessments, these are high-credibility supplements to SLIC's Community and Viability pillars.

### Named economists to cite in SLIC V4 methodology

| Economist | Relevance to SLIC |
|---|---|
| Joseph Stiglitz | Led the Stiglitz-Sen-Fitoussi Commission (2009) which redefined how to measure societal progress beyond GDP — direct precedent for SLIC's multi-pillar approach |
| Thomas Piketty | Capital in the 21st Century — wealth inequality data; SLIC Housing Burden metric draws on this tradition |
| Kate Raworth | Doughnut Economics — social foundation + planetary ceiling = the AMPI viability envelope by another name |
| Jason Hickel | Degrowth and Ecological Footprint — Viability pillar ecological metrics |
| Tim Jackson | Prosperity Without Growth — foundational for why SLIC separates Growth from Community |
| Pavlina Tcherneva | Job guarantee economics — Employment metrics in Growth pillar |

