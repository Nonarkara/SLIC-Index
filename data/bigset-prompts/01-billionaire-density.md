# BigSet prompt — Billionaire Density (Axis 1)

## Dataset description (paste into BigSet verbatim)

List of the top 30 global cities by billionaire count, most recent available year (2025 or 2026). For each city include: city name, country, continent, number of billionaires, ranking year, and source URL. Sources: Forbes Real-Time Billionaires list, Visual Capitalist / Voronoi annual billionaire rankings.

## Target schema

| Column | Type | Notes |
|---|---|---|
| city | string | city name as published |
| country | string | ISO country name |
| continent | string | Africa / Asia / Europe / Americas / Oceania |
| billionaires | integer | count of billionaires resident in city |
| rank | integer | global rank (1 = most) |
| year | integer | data year |
| source_url | string | direct URL to source page |

## Refresh cadence

Annual (Forbes publishes updated list March/April each year).

## SLIC tile this feeds

CompareRankingsPage → `BILLI_DATA` constant → billionaire capital vs. livability scatter.
Also: ThailandPage → ASEAN cluster table (Bangkok #17 / 38 billionaires, 2026).

## Current data source (being replaced)

Visual Capitalist / Voronoi infographic, "Cities with the Most Billionaires in 2026".
Hardcoded into `src/CompareRankingsPage.tsx` as `BILLI_DATA` array.

## Spike priority

HIGH — English sources, annual cadence, clearly structured. Recommend first spike.

## Output path

`data/verified_sources/billionaire-density.csv`
