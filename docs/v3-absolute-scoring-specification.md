# SLIC Index V3 — Absolute Scoring Formula Specification

## General Architecture

Each pillar is composed of 5-8 indicators. Each indicator is normalized to 0-100 using **piecewise linear mappings against fixed absolute benchmarks**. Pillars are aggregated using the **Adjusted Mazziotta-Pareto Index (AMPI)** to penalize imbalance across indicators.

**Key property:** All thresholds are fixed constants. Adding city #501 does not change scores for cities #1-500.

---

## Normalization Method (Universal)

All indicators use piecewise linear interpolation between fixed anchor points:

```
score = interpolate(raw_value, [(threshold_0, 0), (threshold_1, 25), (threshold_2, 50), (threshold_3, 75), (threshold_4, 100)])
```

For "lower is better" indicators, the anchor mapping is reversed. Values beyond outer anchors are clamped to 0 or 100.

```
If raw is between anchor_i (raw_i, score_i) and anchor_{i+1} (raw_{i+1}, score_{i+1}):
  score = score_i + (score_{i+1} - score_i) * (raw - raw_i) / (raw_{i+1} - raw_i)
```

---

## Pillar 1: GROWTH (Economic Dynamism)

Rewards cities with expanding economies, entrepreneurial ecosystems, innovation output, and civic freedom. Cheap but stagnant cities score low.

### Indicators

| # | Indicator | Unit | Direction | Data Source |
|---|-----------|------|-----------|-------------|
| G1 | Real GDP growth rate (5yr avg) | % p.a. | Higher better | IMF WEO, OECD Regional, Brookings Metro Monitor |
| G2 | Startup density | Startups per 100k pop | Higher better | Crunchbase, Dealroom, StartupBlink |
| G3 | VC investment intensity | VC USD per capita (3yr avg) | Higher better | Crunchbase, PitchBook |
| G4 | Ease of doing business | Score 0-100 | Higher better | World Bank B-READY |
| G5 | Civic freedom | Score 0-100 | Higher better | Freedom House + V-Dem |
| G6 | Patent applications | Patents per 100k pop (3yr avg) | Higher better | WIPO |
| G7 | High-skill employment share | % of workforce in ISCO 1-3 | Higher better | ILO, LinkedIn Talent Insights |

### Normalization Anchors

**G1 — Real GDP growth (% p.a.)**

| Raw | Score |
|-----|-------|
| <=0 | 0 |
| 1.0 | 25 |
| 2.5 | 50 |
| 4.0 | 75 |
| >=6.0 | 100 |

**G2 — Startup density (per 100k pop)**

| Raw | Score |
|-----|-------|
| <=5 | 0 |
| 20 | 25 |
| 50 | 50 |
| 100 | 75 |
| >=200 | 100 |

**G3 — VC investment (USD per capita, 3yr avg)**

| Raw | Score |
|-----|-------|
| <=5 | 0 |
| 50 | 25 |
| 200 | 50 |
| 500 | 75 |
| >=1500 | 100 |

**G4 — Ease of doing business (0-100 raw score)**
Direct passthrough.

**G5 — Civic freedom (0-100)**
Composite: 0.6 * Freedom House score (rescaled 0-100) + 0.4 * V-Dem liberal democracy index (rescaled 0-100).

**G6 — Patents per 100k pop (3yr avg)**

| Raw | Score |
|-----|-------|
| <=2 | 0 |
| 15 | 25 |
| 40 | 50 |
| 80 | 75 |
| >=150 | 100 |

**G7 — High-skill employment share (%)**

| Raw | Score |
|-----|-------|
| <=10 | 0 |
| 20 | 25 |
| 30 | 50 |
| 40 | 75 |
| >=55 | 100 |

---

## Pillar 2: VIABILITY (Lived Sustainability)

Can you actually build a life here? Measures safety, environmental quality, healthcare access, and real disposable income after all essential costs.

### Indicators

| # | Indicator | Unit | Direction | Data Source |
|---|-----------|------|-----------|-------------|
| V1 | Homicide rate | per 100k pop | Lower better | UNODC |
| V2 | Air quality (PM2.5 annual mean) | ug/m3 | Lower better | WHO, IQAir |
| V3 | Healthcare access & quality | HAQ Index 0-100 | Higher better | IHME/Lancet HAQ Index |
| V4 | PPP-adjusted disposable income | USD/month (DI_PPP) | Higher better | Numbeo + World Bank PPP |
| V5 | Housing burden | Rent as % of gross income | Lower better | Numbeo, national surveys |
| V6 | Water & sanitation quality | % safely managed water | Higher better | WHO/UNICEF JMP |
| V7 | Peace & political stability | GPI inverted | Higher better | IEP Global Peace Index |
| V8 | Birth rate (optimism signal) | per 1000 pop | Higher better | UN Population Division |

### Normalization Anchors

**V1 — Homicide rate (per 100k, lower is better)**

| Raw | Score |
|-----|-------|
| >=50 | 0 |
| 20 | 25 |
| 5 | 50 |
| 1.0 | 75 |
| <=0.3 | 100 |

**V2 — PM2.5 (ug/m3, lower is better)**

| Raw | Score |
|-----|-------|
| >=80 | 0 |
| 50 | 25 |
| 25 | 50 |
| 10 | 75 |
| <=5 | 100 |

**V3 — Healthcare (HAQ 0-100)**
Direct passthrough.

**V4 — DI_PPP (USD/month)**
Formula: `DI_PPP = (gross_income * (1 - tax_rate) - rent - utilities - transit - internet - food) / ppp_factor`

| Raw (USD/mo) | Score |
|--------------|-------|
| <=0 | 0 |
| 200 | 15 |
| 500 | 35 |
| 1000 | 55 |
| 2000 | 75 |
| >=4000 | 100 |

**V5 — Housing burden (rent % of gross income, lower is better)**

| Raw (%) | Score |
|---------|-------|
| >=70 | 0 |
| 50 | 25 |
| 30 | 50 |
| 20 | 75 |
| <=10 | 100 |

**V6 — Water & sanitation (%, higher is better)**

| Raw (%) | Score |
|---------|-------|
| <=50 | 0 |
| 70 | 25 |
| 85 | 50 |
| 95 | 75 |
| >=99 | 100 |

**V7 — Peace (GPI inverted)**
GPI 1.0-4.0 → `score = max(0, min(100, (4 - GPI) / 3 * 100))`

**V8 — Birth rate (per 1000 pop)**

| Raw | Score |
|-----|-------|
| <=4 | 0 |
| 7 | 25 |
| 10 | 50 |
| 14 | 75 |
| >=20 | 100 |

---

## Pillar 3: CAPABILITY (Infrastructure & Systems)

How well does the city's built environment serve residents?

### Indicators

| # | Indicator | Unit | Direction | Data Source |
|---|-----------|------|-----------|-------------|
| C1 | Transit coverage | % pop within 500m of frequent stop | Higher better | GTFS, ITDP |
| C2 | Internet speed (median download) | Mbps | Higher better | Ookla |
| C3 | Digital government maturity | EGDI 0-100 | Higher better | UN E-Government Survey |
| C4 | Education quality | PISA score or tertiary % | Higher better | OECD PISA, UNESCO |
| C5 | Walkability | Walk Score 0-100 | Higher better | Walk Score, OSM-derived |
| C6 | Cycling infrastructure | km protected lanes per 100k | Higher better | OSM CyclOSM |
| C7 | Renewable energy share | % electricity from renewables | Higher better | CDP Cities, IRENA |

### Normalization Anchors

**C1 — Transit coverage (%)**

| Raw (%) | Score |
|---------|-------|
| <=5 | 0 |
| 20 | 25 |
| 40 | 50 |
| 65 | 75 |
| >=85 | 100 |

**C2 — Internet speed (Mbps)**

| Raw | Score |
|-----|-------|
| <=5 | 0 |
| 25 | 25 |
| 75 | 50 |
| 150 | 75 |
| >=300 | 100 |

**C3 — Digital government (EGDI × 100)**
Direct passthrough.

**C4 — Education (PISA avg)**

| Raw | Score |
|-----|-------|
| <=350 | 0 |
| 400 | 25 |
| 450 | 50 |
| 500 | 75 |
| >=550 | 100 |

Tertiary fallback: <=5%=0, 15%=25, 25%=50, 40%=75, >=55%=100

**C5 — Walkability (0-100)**
Direct passthrough.

**C6 — Cycling (km per 100k)**

| Raw | Score |
|-----|-------|
| <=1 | 0 |
| 5 | 25 |
| 15 | 50 |
| 30 | 75 |
| >=50 | 100 |

**C7 — Renewables (%)**

| Raw (%) | Score |
|---------|-------|
| <=2 | 0 |
| 15 | 25 |
| 35 | 50 |
| 60 | 75 |
| >=90 | 100 |

---

## Pillar 4: COMMUNITY (Belonging & Tolerance)

Does the city welcome you regardless of who you are?

### Indicators

| # | Indicator | Unit | Direction | Data Source |
|---|-----------|------|-----------|-------------|
| O1 | LGBTQ+ rights | Composite 0-100 | Higher better | ILGA, Equaldex |
| O2 | Religious freedom | Pew GRI inverted 0-100 | Higher better | Pew Research |
| O3 | Immigrant integration | Employment gap (pp) | Lower better | OECD |
| O4 | Income inequality | Gini 0-1 | Lower better | World Bank |
| O5 | Social trust | % "most people can be trusted" | Higher better | World Values Survey, Gallup |
| O6 | Gender equality | GII inverted 0-100 | Higher better | UNDP |
| O7 | Weekend retention | Weekend/weekday pop ratio | Higher better | Mobile analytics |

### Normalization Anchors

**O1 — LGBTQ+ rights (composite 0-100)**
Built from: same-sex marriage (25pts), anti-discrimination (25pts), gender recognition (15pts), no criminalization (20pts), social acceptance (15pts).

**O2 — Religious freedom (GRI inverted)**
`score = max(0, min(100, (10 - GRI) / 10 * 100))`

**O3 — Immigrant integration (pp gap, lower is better)**

| Raw (pp) | Score |
|----------|-------|
| >=30 | 0 |
| 20 | 25 |
| 10 | 50 |
| 5 | 75 |
| <=1 | 100 |

**O4 — Gini (lower is better)**

| Raw | Score |
|-----|-------|
| >=0.60 | 0 |
| 0.45 | 25 |
| 0.35 | 50 |
| 0.28 | 75 |
| <=0.22 | 100 |

**O5 — Social trust (%)**

| Raw (%) | Score |
|---------|-------|
| <=5 | 0 |
| 15 | 25 |
| 30 | 50 |
| 50 | 75 |
| >=70 | 100 |

**O6 — Gender equality (GII inverted)**
`score = (1 - GII) * 100`

**O7 — Weekend retention ratio**

| Raw | Score |
|-----|-------|
| <=0.70 | 0 |
| 0.80 | 25 |
| 0.90 | 50 |
| 1.00 | 75 |
| >=1.10 | 100 |

---

## Pillar 5: CREATIVE (Cultural Richness)

Is the city culturally alive?

### Indicators

| # | Indicator | Unit | Direction | Data Source |
|---|-----------|------|-----------|-------------|
| R1 | Cultural venues density | per 100k pop | Higher better | OSM, Google Places |
| R2 | UNESCO heritage proximity | sites within 50km | Higher better | UNESCO + GIS |
| R3 | Culinary diversity | cuisine types per 100k pop | Higher better | Google Places, Yelp |
| R4 | Nightlife density | bars+clubs per 100k pop | Higher better | OSM, Google Places |
| R5 | Arts & culture funding | USD PPP per capita | Higher better | Eurostat, ministries |
| R6 | Creative industry employment | % workforce | Higher better | UNCTAD |
| R7 | International events | per million pop/year | Higher better | ICCA, Eventbrite |

### Normalization Anchors

**R1 — Cultural venues (per 100k)**

| Raw | Score |
|-----|-------|
| <=2 | 0 |
| 8 | 25 |
| 20 | 50 |
| 40 | 75 |
| >=70 | 100 |

**R2 — UNESCO sites within 50km**

| Raw | Score |
|-----|-------|
| 0 | 0 |
| 1 | 25 |
| 3 | 50 |
| 6 | 75 |
| >=10 | 100 |

**R3 — Culinary diversity (per 100k)**

| Raw | Score |
|-----|-------|
| <=1 | 0 |
| 3 | 25 |
| 8 | 50 |
| 15 | 75 |
| >=25 | 100 |

**R4 — Nightlife (per 100k)**

| Raw | Score |
|-----|-------|
| <=3 | 0 |
| 10 | 25 |
| 25 | 50 |
| 50 | 75 |
| >=80 | 100 |

**R5 — Arts funding (USD PPP per capita)**

| Raw | Score |
|-----|-------|
| <=5 | 0 |
| 30 | 25 |
| 80 | 50 |
| 150 | 75 |
| >=300 | 100 |

**R6 — Creative employment (%)**

| Raw (%) | Score |
|---------|-------|
| <=1 | 0 |
| 3 | 25 |
| 6 | 50 |
| 10 | 75 |
| >=15 | 100 |

**R7 — Events (per million pop/year)**

| Raw | Score |
|-----|-------|
| <=2 | 0 |
| 10 | 25 |
| 25 | 50 |
| 50 | 75 |
| >=100 | 100 |

---

## Missing Data Handling

### Coverage Grades

| Grade | Condition | Treatment |
|-------|-----------|-----------|
| A | >= 6 of 7 indicators (or >= 5 of 5-6) | Full confidence |
| B | >= 4 indicators | -5 point penalty |
| C | <= 3 indicators | -15 point penalty, flagged "provisional" |

### Rules
1. **No imputation.** Missing indicators excluded from aggregation.
2. Penalty applied after AMPI computation, floored at 0.
3. Coverage grade stored alongside score for transparency.

---

## Pillar Aggregation: Adjusted Mazziotta-Pareto Index (AMPI)

```
mu    = (1/n) * SUM(s_i)                          # arithmetic mean
sigma = sqrt((1/n) * SUM((s_i - mu)^2))           # population stdev
cv    = sigma / mu                                  # coefficient of variation

AMPI  = mu - (sigma * cv)                          # = mu - sigma^2/mu
```

Penalizes imbalance: city scoring 90/20 gets lower pillar than 55/55.

After AMPI: `pillar_score = max(0, AMPI - coverage_penalty)`

---

## Overall SLIC Score

Same AMPI across five pillars (equal weight):

```
mu_pillars    = (1/5) * (Growth + Viability + Capability + Community + Creative)
sigma_pillars = population stdev of the five pillar scores
cv_pillars    = sigma_pillars / mu_pillars

SLIC_overall  = mu_pillars - (sigma_pillars * cv_pillars)
```

User-facing profile matching (cosine similarity) is a separate layer — does not alter stored absolute scores.

---

## Data Source Summary

| Source | Indicators |
|--------|------------|
| IMF WEO / OECD Regional | G1 |
| Crunchbase / Dealroom | G2, G3 |
| World Bank B-READY | G4 |
| Freedom House + V-Dem | G5 |
| WIPO | G6 |
| ILO / LinkedIn | G7 |
| UNODC | V1 |
| WHO / IQAir | V2 |
| IHME / Lancet | V3 |
| Numbeo + World Bank PPP | V4, V5 |
| WHO/UNICEF JMP | V6 |
| IEP | V7 |
| UN Population Division | V8 |
| GTFS / ITDP | C1 |
| Ookla | C2 |
| UN E-Government | C3 |
| OECD PISA / UNESCO | C4 |
| Walk Score / OSM | C5 |
| OSM CyclOSM | C6 |
| CDP Cities / IRENA | C7 |
| ILGA / Equaldex | O1 |
| Pew Research | O2 |
| OECD | O3 |
| World Bank | O4 |
| WVS / Gallup | O5 |
| UNDP | O6 |
| Mobile analytics | O7 |
| OSM / Google Places | R1, R3, R4 |
| UNESCO | R2 |
| Eurostat / ministries | R5 |
| UNCTAD | R6 |
| ICCA / Eventbrite | R7 |

---

## Design Properties

1. **Absolute** — Fixed thresholds. Adding cities never changes existing scores.
2. **Transparent** — Every score traces: raw value → piecewise linear → 0-100.
3. **Penalizes imbalance** — AMPI variance penalty prevents hiding weaknesses.
4. **Honest about gaps** — No imputation. Coverage grades visible.
5. **Scalable** — Same formula for 50 or 5,000 cities.
6. **Anti-pattern resistant** — Growth ≠ cheapness, Viability = DI_PPP, Community penalizes boredom, Creative penalizes cultural deserts.
