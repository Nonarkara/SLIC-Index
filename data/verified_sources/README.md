Verified source pack for the SLIC workbook.

Files:
- `providers.csv`: trusted provider registry. Add new providers here before using them in input rows.
- `country_context.csv`: one row per `country` and workbook context field.
- `city_inputs.csv`: one row per `city_id` and direct city input field.
- `field_source_guide.csv`: field-by-field sourcing policy for city inputs, including preferred provider families and minimum evidence rules.
- `city_source_playbook.csv`: curated city-specific starting points for hard cases or high-priority cities. Current coverage includes Milan and Bologna.
- `output/spreadsheet/economist_reference.csv`: internal analyst reference extract from The Economist PDF. This file does not feed scoring directly.

Rules:
- Do not fill a numeric value without `provider_id`, `source_url`, `source_title`, `source_date`, `reference_period`, `source_scope`, and `proxy_status`.
- `source_date` must use `YYYY-MM-DD`.
- `reference_period` should describe the measurement window plainly, for example `2024 annual`, `2024 Q4`, or `as_of 2025-01-31`.
- `source_scope` must be one of `city`, `metro`, `regional`, `national`, or `international`.
- `proxy_status` must be either `direct` or `approved_proxy`.
- Use `https` URLs only.
- Prefer Tier 1 and Tier 2 official city or subnational sources when available.
- Use Tier 3 international official baselines when city data is unavailable.
- Required scoring rows must use Tier 1-3 sources. Tier 4 and Tier 5 rows may support internal research, but they do not qualify the public ranking.
- Providers marked `reference_only=true` are internal-only research aids and cannot be used in publishable scoring rows.
- City rows using `regional`, `national`, or `international` scope must be marked `approved_proxy`.
- Country rows with proxy fields such as `tax_rate_assumption` or `household_debt_proxy` must be marked `approved_proxy`.
- Freshness matters:
  - costs, safety, air, and business-activity rows must be no older than 24 months
  - healthcare, education, labour, and utility-reliability rows must be no older than 36 months
  - structural rows must be no older than 60 months, and anything older than 36 months should be treated as an `approved_proxy`
- Treat `field_source_guide.csv` and `city_source_playbook.csv` as collection guidance, not as scoring data. They tell you where to source values; they do not make the ranking publishable by themselves.

Workflow:
1. Run `npm run prepare:verified-sources` once to create starter files if they do not exist.
2. Optionally run `npm run fetch:country-context:wb` and `npm run seed:country-context:wb` to seed the country layer from World Bank WDI exports.
3. Review `output/spreadsheet/country_context_world_bank_seed_report.md` for missing or stale country rows before publication.
4. Fill remaining gaps in `data/verified_sources/country_context.csv`.
5. Review `data/verified_sources/field_source_guide.csv` and `data/verified_sources/city_source_playbook.csv` before filling any city metric.
6. Fill `data/verified_sources/city_inputs.csv`.
7. Run `npm run sync:verified-sources` to validate and hydrate the workbook.
8. Review `Data_Quality` and `Integrity_Watchlist` in the generated sheets before treating any ranking output as credible.
9. Run `npm run export:ranking` to recompute the ranking export from the verified source pack.
10. Run `npm run extract:economist` to refresh the internal Economist reference CSV.
11. Run `npm run build:sheets:internal` to generate the analyst workbook with `Economist_Reference`, `Field_Source_Guide`, `City_Source_Playbook`, `Data_Quality`, `Integrity_Watchlist`, and `Economist_Match_Review` tabs.
