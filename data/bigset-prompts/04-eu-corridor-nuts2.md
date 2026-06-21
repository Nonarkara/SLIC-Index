# BigSet prompt — EU NUTS-2 Regional GDP / Blue Banana Corridor (Axis 5)

## Dataset description (paste into BigSet verbatim)

Top 20 European NUTS-2 regions by regional GDP, most recent available year from Eurostat (2022 or 2023 — note: NUTS-2 data has a 2-3 year publication lag). For each region include: NUTS-2 code, region name, anchor city (primary urban center), country, GDP in billions EUR, data year, and source URL. Primary source: Eurostat regional GDP dataset (nama_10r_3gdp). Secondary source: UK Office for National Statistics (ONS) for UK NUTS-2 equivalents post-Brexit.

## Target schema

| Column | Type | Notes |
|---|---|---|
| nuts2_code | string | e.g. FR10, ITC4, DEA2 |
| region_name | string | e.g. Île-de-France, Lombardy |
| anchor_city | string | primary city name |
| country | string | ISO country name |
| country_iso2 | string | ISO 3166-1 alpha-2 |
| gdp_eur_b | float | GDP in billions EUR |
| year | integer | data year |
| blue_banana | boolean | in the London→Rhine→Milan corridor |
| source_url | string | Eurostat or ONS direct URL |

## Refresh cadence

Annual (Eurostat NUTS-2 GDP usually updated Q1-Q2 of year+2).

## SLIC tile this feeds

CompareRankingsPage → `EU_NUTS2` constant → Economic Corridor section table.

## Current data source (being replaced)

2021 data hardcoded in `src/CompareRankingsPage.tsx` as `EU_NUTS2` array.
The 2023 Eurostat release should be available by mid-2026 per the brief.

## Spike priority

MEDIUM — Eurostat portal is English and structured but JS-heavy.
Good test of BigSet's ability to navigate institutional data portals.

## Blue Banana membership logic

Regions within the London → Amsterdam → Rhine-Ruhr → Stuttgart/Frankfurt
→ Basel/Zurich → Milan corridor. Debated at the edges (Munich, Lyon);
use geographic centroid within 150km of the corridor axis as the criterion.

## Output path

`data/verified_sources/eu-nuts2-corridor.csv`
