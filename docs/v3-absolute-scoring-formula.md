# SLIC Index V3 — Formula Reference

This note gives the compact mathematical form of the published SLIC scorer.

## 1. Raw-to-score normalization

For raw input `x_k(c)` for city `c` and input channel `k`, with frozen percentile bounds `p05_k` and `p95_k`:

```text
winsor(x_k(c)) = min(max(x_k(c), p05_k), p95_k)
```

Positive-direction inputs:

```text
s_k(c) = 100 * clamp((winsor(x_k(c)) - p05_k) / (p95_k - p05_k), 0, 1)
```

Negative-direction inputs:

```text
s_k(c) = 100 * clamp((p95_k - winsor(x_k(c))) / (p95_k - p05_k), 0, 1)
```

If `x_k(c)` is missing, then `s_k(c)` is missing.

## 2. Composite metrics

For a composite metric `m` with normalized component scores `s_k(c)` and component weights `beta_(m,k)`:

```text
M_m(c) =
  sum_{k in observed(m,c)} beta_(m,k) * s_k(c)
  / sum_{k in observed(m,c)} beta_(m,k)
```

Published composites:

```text
EqualOpportunityFairness(c)
  = 0.7 * EqualOpportunity(c)
  + 0.3 * ReverseGini(c)

TolerancePluralism(c)
  = 0.4 * Equaldex(c)
  + 0.3 * FreedomHouse(c)
  + 0.3 * ReverseHateCrime(c)

EconomicVitality(c)
  = 0.5 * InvestmentSignal(c)
  + 0.3 * GDPperCapitaPPP(c)
  + 0.2 * GDPGrowth(c)
```

## 3. Pillar scores

Let `alpha_(p,m)` be the public metric weight for metric `m` inside pillar `p`.

```text
P_p(c) =
  sum_{m in observed(p,c)} alpha_(p,m) * q_m(c)
  / sum_{m in observed(p,c)} alpha_(p,m)
```

Where:

- `q_m(c)` is either the direct normalized score for metric `m`
- or the composite score `M_m(c)` when `m` is composite

The public pillar weights are:

```text
w_pressure   = 25
w_viability  = 22
w_capability = 18
w_community  = 15
w_creative   = 20
```

The scored metric weights inside pillars are:

```text
pressure:   9 + 5 + 4 + 4 + 3 = 25
viability:  5 + 5 + 4 + 4 + 4 = 22
capability: 8 + 6 + 4         = 18
community:  5 + 5 + 5         = 15
creative:   6 + 5 + 5 + 4     = 20
```

## 4. Cross-pillar weighted mean

```text
mu(c) = sum_p w_p * P_p(c) / sum_p w_p
```

## 5. Cross-pillar weighted variance

```text
var(c) = sum_p w_p * (P_p(c) - mu(c))^2 / sum_p w_p
```

## 6. AMPI

The published final composite is the weighted Adjusted Mazziotta-Pareto Index:

```text
AMPI(c) = mu(c) - var(c) / mu(c)
```

With boundary handling:

```text
if mu(c) = 0, then AMPI(c) = 0
AMPI(c) is clamped to [0, 100]
```

## 7. Coverage

Metric coverage:

```text
cov_m(c) = 1                      for observed direct metrics
cov_m(c) = 0                      for missing direct metrics
cov_m(c) = observed_component_weight / total_component_weight
                                  for composite metrics
```

Pillar coverage:

```text
Cov_p(c) =
  sum_m alpha_(p,m) * cov_m(c)
  / sum_m alpha_(p,m)
```

Overall weighted coverage:

```text
Cov(c) = sum_p w_p * Cov_p(c) / 100
```

## 8. Coverage penalty

```text
penalty(c) =
  0   if Cov(c) >= 0.75
  5   if 0.50 <= Cov(c) < 0.75
  15  if 0.35 <= Cov(c) < 0.50
  0   if Cov(c) < 0.35 and city is watchlist-only
```

Coverage grade:

```text
Grade A         if Cov(c) >= 0.75
Grade B         if 0.50 <= Cov(c) < 0.75
Grade C         if 0.35 <= Cov(c) < 0.50
Grade Watchlist if Cov(c) < 0.35
```

## 9. Final score

```text
SLIC(c) = max(0, AMPI(c) - penalty(c))
```

## 10. Published but non-scoring diagnostics

The following metric lines are visible but excluded from `SLIC(c)`:

```text
pressure_economic_growth_momentum
viability_climate_sunlight_livability
community_birth_rate_optimism
```

## 11. Rank and public tiers

Pure score rank:

```text
rank(c) = position of city c after sorting all ranked cities by
          SLIC_exact(c) descending,
          then Community_exact(c) descending,
          then Pressure_exact(c) descending,
          then city label
```

Public tiers are a separate overlay:

```text
Alpha: up to 10 cities, one city per country across Alpha/Beta/Gamma
       except Taiwan may appear 2 times and Japan may appear 2 times,
       Community >= 40, Pressure >= 40,
       Europe max 2, Oceania max 0, South Korea max 1,
       Japan max 1, Israel excluded, Tokyo excluded

Beta:  up to 10 cities, one city per country across Alpha/Beta/Gamma
       except Taiwan may appear 2 times and Japan may appear 2 times,
       Community >= 45, Pressure >= 45

Gamma: up to 10 cities, one city per country across Alpha/Beta/Gamma
       except Taiwan may appear 2 times,
       filled from remaining ranked cities
```

The overlay is written to `tierLabel` and `tierSlot`; it does not rewrite the score rank.

## 12. Important negative statement

The published SLIC score is **not**:

- a piecewise-anchor index
- a simple weighted average of the five displayed pillars
- a within-pillar AMPI model
- a model where climate, growth momentum, or birth rate directly modify the final aggregate
