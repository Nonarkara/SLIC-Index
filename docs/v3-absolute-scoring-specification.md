# SLIC Index V3 — Published Scoring Specification

This document describes the scoring logic currently used to produce the published SLIC leaderboard in `src/data/publishedRankingData.json` and `scripts/rescore-all-cities.mjs`.

The exact city, ranked, and watchlist counts are snapshot-sensitive and are emitted in the live publication file itself under `diagnostics` / `methodologyFacts`.

## Architecture

SLIC has five public pillars with fixed weights:

| Pillar | Public label | Internal id | Weight |
|---|---|---|---:|
| 1 | Growth | `pressure` | 25 |
| 2 | Viability | `viability` | 22 |
| 3 | Capability | `capability` | 18 |
| 4 | Community | `community` | 15 |
| 5 | Creative | `creative` | 20 |

The published model contains:

- `22` scored metric lines that enter the aggregate
- `3` visible diagnostic metric lines that remain on city scorecards but do not enter the aggregate
- fixed percentile-based normalization anchors stored in `normStats`
- explicit missing-data coverage handling
- AMPI at the overall cross-pillar stage

## Normalization

Every scored raw input is normalized to a `0-100` scale using frozen `p05` / `p95` bounds:

```text
normalize(x, p05, p95, positive) =
  100 * clamp((winsor(x, p05, p95) - p05) / (p95 - p05), 0, 1)

normalize(x, p05, p95, negative) =
  100 * clamp((p95 - winsor(x, p05, p95)) / (p95 - p05), 0, 1)
```

Where:

- `winsor(x, p05, p95) = min(max(x, p05), p95)`
- positive metrics reward larger raw values
- negative metrics reward smaller raw values
- if `x`, `p05`, or `p95` is missing, the normalized score is missing

The current public implementation is percentile-winsorized, not piecewise-anchor interpolation.

## Scored Metric Set

### Growth / `pressure` (25 total)

| Metric | Weight | Notes |
|---|---:|---|
| `pressure_disposable_income_ppp` | 8 | Post-tax residual income after essentials, PPP-adjusted |
| `pressure_housing_burden` | 5 | Higher city-market housing price pressure scores worse |
| `pressure_household_debt_burden` | 2 | Country fallback allowed |
| `pressure_working_time_pressure` | 4 | Higher work burden scores worse |
| `pressure_suicide_mental_strain` | 4 | Higher severe-strain proxy scores worse |
| `pressure_hanke_misery_index` | 2 | Hanke Annual Misery Index 2025: 2×unemployment + inflation + bank-lending-rate − real GDP/capita growth; country level; lower = less stress |

Visible but excluded from the aggregate:

- `pressure_economic_growth_momentum`

### Viability / `viability` (22 total)

| Metric | Weight | Notes |
|---|---:|---|
| `viability_personal_safety` | 5 | Harm / victimization outcome metric |
| `viability_transit_access_commute` | 5 | Better access and lower burden score better |
| `viability_clean_air` | 4 | Higher pollution exposure scores worse |
| `viability_water_sanitation_utility` | 4 | Safer access and reliability score better |
| `viability_digital_infrastructure` | 4 | Quality and affordability of digital access |

Visible but excluded from the aggregate:

- `viability_climate_sunlight_livability`

### Capability / `capability` (18 total)

| Metric | Weight | Notes |
|---|---:|---|
| `capability_healthcare_quality` | 8 | Higher effective-care quality scores better |
| `capability_education_quality` | 6 | Higher learning quality scores better |
| `capability_equal_opportunity_distributional_fairness` | 4 | Composite metric |

Composite definition:

```text
capability_equal_opportunity_distributional_fairness
  = 0.7 * normalize(equal_opportunity_raw)
  + 0.3 * normalize(gini_coefficient_context, negative)
```

If one component is missing, the composite is reweighted over the observed component weights only.

### Community / `community` (15 total)

| Metric | Weight | Notes |
|---|---:|---|
| `community_hospitality_belonging` | 4 | Higher belonging / civic warmth scores better |
| `community_tolerance_pluralism` | 4 | Composite metric |
| `community_cultural_historic_public_life_vitality` | 3 | Everyday cultural/public-life vitality |
| `community_civic_freedom_dignity` | 4 | Composite: 0.4 × HRMI Empowerment + 0.3 × Freedom House FIW + 0.3 × V-Dem LDI (×100) |

Composite definition:

```text
community_tolerance_pluralism
  = 0.4 * normalize(inclusion_equaldex_country_raw)
  + 0.3 * normalize(inclusion_freedom_house_country_raw)
  + 0.3 * normalize(inclusion_hate_crime_raw, negative)
```

Visible but excluded from the aggregate:

- `community_birth_rate_optimism`

### Creative / `creative` (20 total)

| Metric | Weight | Notes |
|---|---:|---|
| `creative_entrepreneurial_dynamism` | 6 | New-business and startup dynamism |
| `creative_innovation_research_intensity` | 5 | Research and knowledge-production strength |
| `creative_economic_vitality_productive_context` | 5 | Composite metric |
| `creative_administrative_investment_friction` | 4 | Higher friction scores worse |

Composite definition:

```text
creative_economic_vitality_productive_context
  = 0.5 * normalize(investment_signal_raw)
  + 0.3 * normalize(gdp_per_capita_ppp_context)
  + 0.2 * normalize(gdp_growth_context)
```

## Pillar Aggregation

Within each pillar, SLIC uses a weighted mean over observed scored metrics only:

```text
P_p(c) = sum_{m in observed(p,c)} alpha_(p,m) * s_m(c)
         / sum_{m in observed(p,c)} alpha_(p,m)
```

Where:

- `P_p(c)` is the pillar score for city `c`
- `alpha_(p,m)` is the published metric weight
- missing metrics are excluded from the numerator and denominator

No within-pillar AMPI penalty is applied in the published scorer.

## Overall SLIC Score

The final published score is not a simple weighted average of pillars. It is a weighted AMPI across the five public pillars:

```text
mu(c) = sum_p w_p * P_p(c) / sum_p w_p

var(c) = sum_p w_p * (P_p(c) - mu(c))^2 / sum_p w_p

AMPI(c) = mu(c) - var(c) / mu(c)

SLIC(c) = max(0, AMPI(c) - coverage_penalty(c))
```

Where `w_p = {25, 22, 18, 15, 20}` for `{pressure, viability, capability, community, creative}`.

Special cases:

- if no pillar score is available, `SLIC(c)` is missing
- if `mu(c) = 0`, the AMPI result is `0`
- AMPI is clamped to `[0, 100]`

Interpretation:

- a city with one catastrophic pillar is penalized even if other pillars are strong
- imbalance is punished at the cross-pillar stage, not inside each pillar

## Coverage

Coverage is weighted, not counted by raw field totals.

For each metric:

- direct metric coverage is `1.0` if the score exists, else `0`
- composite metric coverage is the share of component weight observed

For each pillar:

```text
pillar_coverage(p,c) =
  sum_m alpha_(p,m) * metric_coverage(m,c)
  / sum_m alpha_(p,m)
```

Overall coverage:

```text
overall_coverage(c) =
  sum_p w_p * pillar_coverage(p,c) / 100
```

Coverage grades:

| Grade | Rule | Score penalty | Ranking status |
|---|---|---:|---|
| A | `overall_coverage >= 0.75` | 0 | Ranked |
| B | `0.50 <= overall_coverage < 0.75` | 5 | Ranked |
| C | `0.35 <= overall_coverage < 0.50` | 15 | Ranked |
| Watchlist | `overall_coverage < 0.35` | 0 | Watchlist |

Additional watchlist rule:

- if a city carries a manual `watchlistReason`, it remains watchlist even if coverage is otherwise sufficient

## Ranking Protocol

The published numeric rank is a pure score order:

1. ranked cities are sorted by `slicScoreExact` descending
2. ties are broken deterministically by `communityScoreExact` descending, then `pressureScoreExact` descending, then city label
3. the resulting ordinal position is written to `rank`

The public tier overlay is computed separately from rank:

1. Alpha, Beta, and Gamma each contain up to `10` cities
2. only one city per country may appear across the three public tiers combined, except Taiwan may appear `2` times and Japan may appear `2` times
3. Alpha requires `communityScore >= 40`, `pressureScore >= 40`, and coverage grade `A`
4. Alpha caps Europe at `2` slots, Oceania at `0` slot, South Korea at `1` slot, Japan at `1` slots, and excludes Israel; the published `alphaCityExclusions` list is also barred from Alpha under the editorial cost-of-living rule
5. Beta keeps the country rule, preserves the Taiwan and Japan exceptions, and raises the floors to `communityScore >= 45` and `pressureScore >= 45`
6. Gamma fills from the remaining ranked cities under the same country rule

This means `rank` is the mathematical order of the published SLIC score, while `tierLabel` / `tierSlot` encode the editorial-public overlay.

## Diagnostics and Non-Scoring Visibility

Three metric lines remain visible to readers but do not enter the aggregate:

- `pressure_economic_growth_momentum`
- `viability_climate_sunlight_livability`
- `community_birth_rate_optimism`

These are diagnostic or contextual signals, not hidden bonuses or penalties.

## Reproducibility Notes

The canonical implementation in this repo is the combination of:

- `scripts/rescore-all-cities.mjs`
- `src/data/publishedRankingData.json`

The published JSON now also carries machine-readable audit helpers:

- `publicationManifest` for scorer versioning and snapshot hashes
- `changeSummary` for publication-to-publication diffs
- `diagnostics` for integrity and provenance counts
- `stabilityAnalysis` for small floor-sensitivity checks around the live Alpha/Beta thresholds

If any narrative paper or UI copy disagrees with those two artifacts, the scorer and published dataset take precedence.
