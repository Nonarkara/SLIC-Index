# BigSet prompt — Time-Cost of Money / Hours for $1,000 PPP (Axis 3)

## Dataset description (paste into BigSet verbatim)

Number of hours of work required to earn $1,000 USD purchasing-power-parity (PPP) adjusted, for all OECD member countries, most recent available year (2022 or 2023). Methodology: annual average wages (PPP-adjusted, USD) divided by annual working hours per worker. For each country include: country name, hours per $1000 PPP, annual average wage (PPP USD), annual working hours, data year, and source URL. Primary sources: OECD.Stat average wages dataset, OECD hours worked dataset, Our World in Data "Hours worked per year" page.

## Target schema

| Column | Type | Notes |
|---|---|---|
| country | string | OECD member country name |
| iso3 | string | ISO 3166-1 alpha-3 |
| hours_per_1000 | float | computed: annual_hours / (annual_wage_ppp / 1000) |
| annual_wage_ppp | integer | USD, PPP-adjusted |
| annual_hours | integer | average hours worked per worker per year |
| year | integer | data year |
| source_url | string | OECD.Stat or Our World in Data URL |

## Refresh cadence

Annual (OECD typically publishes prior-year data in Q2).

## SLIC tile this feeds

ThailandPage → hours-for-$1000 comparison table.
SLIC's Thailand estimate (~116h) is currently hardcoded; this dataset
would replace it with the OECD-methodology reference points.

## Current data source (being replaced)

Visual Capitalist / Voronoi bar chart "Hours of Work for $1,000 by OECD Country"
(2023 data). Values hardcoded in `src/ThailandPage.tsx` hours section.

## Spike priority

MEDIUM-HIGH — OECD.Stat has a clean English API/portal. BigSet should
handle this well. Main risk: OECD data portal is JavaScript-heavy.

## Thailand note

Thailand is NOT an OECD member. The SLIC estimate (~116h) is derived
from ILO/NSO wages + World Bank PPP. BigSet will not find a direct
OECD figure for Thailand — the estimate remains manual.

## Output path

`data/verified_sources/time-cost-of-money-oecd.csv`
