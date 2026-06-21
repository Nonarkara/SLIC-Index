# BigSet prompt — Demographic Optimism / TFR (Axis 2)

## Dataset description (paste into BigSet verbatim)

Total fertility rate (TFR) for the following countries, most recent reported year (2022 or 2023): Thailand, Singapore, China, Japan, Taiwan, South Korea, Hong Kong, India, France, United Kingdom, Russia, United States, Brazil, Italy, Germany, Sweden, Australia, Netherlands, Switzerland, South Korea. For each country include: country name, TFR value, reporting year, and source URL. Primary sources: UN World Population Prospects 2024, World Bank World Development Indicators, national statistics offices.

## Target schema

| Column | Type | Notes |
|---|---|---|
| country | string | ISO country name |
| iso3 | string | ISO 3166-1 alpha-3 |
| tfr | float | total fertility rate |
| year | integer | data year |
| trend_5yr | string | "rising" / "falling" / "stable" based on 5yr direction |
| source_url | string | direct URL |

## Refresh cadence

Annual (UN WPP updates yearly; World Bank WDI quarterly).

## SLIC tile this feeds

CompareRankingsPage → `BILLI_DATA.tfr` field → TFR × Capital quadrant.
ThailandPage → ASEAN cluster table TFR column.

## Current data source (being replaced)

Country-level TFR values hardcoded into `src/CompareRankingsPage.tsx`:
Thailand 1.32, Singapore 1.04, China 1.09, Japan 1.20, Taiwan 0.87, etc.

## Spike priority

MEDIUM — UN WPP and World Bank are English, structured, but may require
multi-source join that BigSet's agents handle variably well.

## Output path

`data/verified_sources/demographic-optimism.csv`
