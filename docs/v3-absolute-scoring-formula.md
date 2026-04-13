# SLIC Index V3 — Absolute Scoring Formula Specification

## General Architecture

Each pillar is composed of 5-8 indicators. Each indicator is normalized to 0-100 using piecewise linear mappings against **fixed absolute benchmarks**. Pillars are aggregated using the Adjusted Mazziotta-Pareto Index (AMPI) to penalize imbalance across indicators.

**Key property:** All thresholds are fixed constants. Adding city #501 does not change scores for cities #1-500.

---

## Normalization Method (Universal)

All indicators use piecewise linear interpolation between fixed anchor points:

```
score = interpolate(raw_value, [(threshold_0, 0), (threshold_1, 25), (threshold_2, 50), (threshold_3, 75), (threshold_4, 100)])
```

For "lower is better" indicators, the mapping is reversed. Values beyond outer anchors are clamped to 0 or 100.

```
If raw is between anchor_i (raw_i, score_i) and anchor_{i+1} (raw_{i+1}, score_{i+1}):
  score = score_i + (score_{i+1} - score_i) * (raw - raw_i) / (raw_{i+1} - raw_i)
```

---

## Pillar 1: GROWTH (Economic Dynamism)

Captures expansion, entrepreneurial ecosystems, innovation output, and civic freedom through fixed public thresholds.

| # | Indicator | Unit | Direction | Source |
|---|-----------|------|-----------|--------|
| G1 | Real GDP growth rate (5yr avg) | % p.a. | Higher | IMF WEO, OECD Regional |
| G2 | Startup density | per 100k pop | Higher | Crunchbase, Dealroom, StartupBlink |
| G3 | VC investment intensity | USD per capita (3yr avg) | Higher | Crunchbase, PitchBook |
| G4 | Ease of doing business | Score 0-100 | Higher | World Bank B-READY |
| G5 | Civic freedom | Score 0-100 | Higher | Freedom House + V-Dem |
| G6 | Patent applications | per 100k pop (3yr avg) | Higher | WIPO |
| G7 | High-skill employment share | % workforce ISCO 1-3 | Higher | ILO, LinkedIn Talent Insights |

### Anchors

| Indicator | 0 | 25 | 50 | 75 | 100 |
|-----------|---|----|----|----|----|
| G1 GDP growth (%) | <=0 | 1.0 | 2.5 | 4.0 | >=6.0 |
| G2 Startups/100k | <=5 | 20 | 50 | 100 | >=200 |
| G3 VC $/capita | <=5 | 50 | 200 | 500 | >=1500 |
| G4 Business ease | passthrough 0-100 | | | | |
| G5 Civic freedom | passthrough 0-100 | | | | |
| G6 Patents/100k | <=2 | 15 | 40 | 80 | >=150 |
| G7 High-skill % | <=10 | 20 | 30 | 40 | >=55 |

---

## Pillar 2: VIABILITY (Lived Sustainability)

Safety, environment, healthcare, and real disposable income.

| # | Indicator | Unit | Direction | Source |
|---|-----------|------|-----------|--------|
| V1 | Homicide rate | per 100k pop | Lower | UNODC |
| V2 | Air quality (PM2.5) | ug/m3 annual mean | Lower | WHO, IQAir |
| V3 | Healthcare access & quality | HAQ Index 0-100 | Higher | IHME/Lancet |
| V4 | PPP-adjusted disposable income | USD/month | Higher | Numbeo + World Bank PPP |
| V5 | Housing burden | Rent % of gross income | Lower | Numbeo |
| V6 | Water & sanitation | % safely managed | Higher | WHO/UNICEF JMP |
| V7 | Peace & stability | GPI inverted | Higher | IEP |
| V8 | Birth rate (optimism) | per 1000 pop | Higher | UN Population Division |

**V4 formula:** `DI_PPP = (gross_income * (1 - tax_rate) - rent - utilities - transit - internet - food) / ppp_factor`

### Anchors

| Indicator | 0 | 25 | 50 | 75 | 100 |
|-----------|---|----|----|----|----|
| V1 Homicide/100k | >=50 | 20 | 5 | 1.0 | <=0.3 |
| V2 PM2.5 ug/m3 | >=80 | 50 | 25 | 10 | <=5 |
| V3 HAQ | passthrough 0-100 | | | | |
| V4 DI_PPP $/mo | <=0 | 200 | 500→55 | 2000 | >=4000 |
| V5 Rent % income | >=70 | 50 | 30 | 20 | <=10 |
| V6 Water % managed | <=50 | 70 | 85 | 95 | >=99 |
| V7 GPI→score | `(4-GPI)/3*100` | | | | |
| V8 Birth rate/1000 | <=4 | 7 | 10 | 14 | >=20 |

---

## Pillar 3: CAPABILITY (Infrastructure & Systems)

How well does the built environment serve residents?

| # | Indicator | Unit | Direction | Source |
|---|-----------|------|-----------|--------|
| C1 | Transit coverage | % pop within 500m of frequent stop | Higher | GTFS, ITDP |
| C2 | Internet speed | Median download Mbps | Higher | Ookla |
| C3 | Digital government | EGDI 0-100 | Higher | UN E-Gov Survey |
| C4 | Education quality | PISA score (fallback: tertiary %) | Higher | OECD PISA, UNESCO |
| C5 | Walkability | Score 0-100 | Higher | Walk Score, OSM |
| C6 | Cycling infrastructure | km protected lanes/100k | Higher | Copenhagenize, OSM |
| C7 | Renewable energy share | % electricity | Higher | CDP Cities, IRENA |

### Anchors

| Indicator | 0 | 25 | 50 | 75 | 100 |
|-----------|---|----|----|----|----|
| C1 Transit % | <=5 | 20 | 40 | 65 | >=85 |
| C2 Internet Mbps | <=5 | 25 | 75 | 150 | >=300 |
| C3 Digital gov | passthrough 0-100 | | | | |
| C4 PISA score | <=350 | 400 | 450 | 500 | >=550 |
| C5 Walkability | passthrough 0-100 | | | | |
| C6 Bike lanes/100k | <=1 | 5 | 15 | 30 | >=50 |
| C7 Renewables % | <=2 | 15 | 35 | 60 | >=90 |

---

## Pillar 4: COMMUNITY (Belonging & Tolerance)

Does the city welcome you regardless of who you are?

| # | Indicator | Unit | Direction | Source |
|---|-----------|------|-----------|--------|
| O1 | LGBTQ+ rights | Composite 0-100 | Higher | ILGA, Equaldex |
| O2 | Religious freedom | Pew GRI inverted | Higher | Pew Research |
| O3 | Immigrant integration | Employment gap pp | Lower | OECD |
| O4 | Income inequality | Gini 0-1 | Lower | World Bank |
| O5 | Social trust | % "most people trusted" | Higher | World Values Survey |
| O6 | Gender equality | GII inverted | Higher | UNDP |
| O7 | Weekend retention | Weekend/weekday pop ratio | Higher | Mobile analytics |

### Anchors

| Indicator | 0 | 25 | 50 | 75 | 100 |
|-----------|---|----|----|----|----|
| O1 LGBTQ+ | passthrough 0-100 | | | | |
| O2 Religious freedom | `(10-GRI)/10*100` | | | | |
| O3 Immigrant gap pp | >=30 | 20 | 10 | 5 | <=1 |
| O4 Gini | >=0.60 | 0.45 | 0.35 | 0.28 | <=0.22 |
| O5 Trust % | <=5 | 15 | 30 | 50 | >=70 |
| O6 Gender GII | `(1-GII)*100` | | | | |
| O7 Weekend ratio | <=0.70 | 0.80 | 0.90 | 1.00 | >=1.10 |

---

## Pillar 5: CREATIVE (Cultural Richness)

Is the city culturally alive?

| # | Indicator | Unit | Direction | Source |
|---|-----------|------|-----------|--------|
| R1 | Cultural venues density | per 100k pop | Higher | OSM, Google Places |
| R2 | UNESCO heritage proximity | Sites within 50km | Higher | UNESCO + GIS |
| R3 | Culinary diversity | Cuisine types per 100k | Higher | Google Places, Yelp |
| R4 | Nightlife density | Bars+clubs per 100k | Higher | OSM, Google Places |
| R5 | Arts & culture funding | USD PPP per capita | Higher | Eurostat, ministries |
| R6 | Creative industry employment | % workforce | Higher | UNCTAD, national stats |
| R7 | International events | per million pop/year | Higher | ICCA, Eventbrite |

### Anchors

| Indicator | 0 | 25 | 50 | 75 | 100 |
|-----------|---|----|----|----|----|
| R1 Venues/100k | <=2 | 8 | 20 | 40 | >=70 |
| R2 UNESCO sites | 0 | 1 | 3 | 6 | >=10 |
| R3 Cuisines/100k | <=1 | 3 | 8 | 15 | >=25 |
| R4 Nightlife/100k | <=3 | 10 | 25 | 50 | >=80 |
| R5 Arts $/capita | <=5 | 30 | 80 | 150 | >=300 |
| R6 Creative % | <=1 | 3 | 6 | 10 | >=15 |
| R7 Events/M pop | <=2 | 10 | 25 | 50 | >=100 |

---

## Missing Data Handling

| Grade | Condition | Penalty |
|-------|-----------|---------|
| A | >= 6 of 7 indicators | 0 |
| B | >= 4 indicators | -5 points |
| C | <= 3 indicators | -15 points |

No imputation. Missing indicators excluded from aggregation. Penalty applied after AMPI, floored at 0.

---

## Pillar Aggregation: AMPI

```
mu    = mean(s_1, ..., s_n)
sigma = population_stdev(s_1, ..., s_n)
cv    = sigma / mu

AMPI = mu - (sigma * cv)     # equivalently: mu - sigma^2/mu
```

Penalizes imbalance: 90/20 scores worse than 55/55.

Edge cases: mu=0 → score=0. Single indicator → score = that indicator.

After AMPI: `pillar_score = max(0, AMPI - coverage_penalty)`

---

## Overall SLIC Score

Same AMPI across all five pillars (equal weight):

```
SLIC = AMPI(Growth, Viability, Capability, Community, Creative)
```

User-facing profile matching (cosine similarity + penalized mean) is a separate layer and does not alter stored absolute scores.
