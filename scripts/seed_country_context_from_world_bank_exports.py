from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from generate_slic_workbook import build_city_universe, unique_countries
from verified_source_pipeline import COUNTRY_CONTEXT_PATH, ROOT, read_csv_rows, write_csv


EXPORT_DIR = ROOT / "output" / "spreadsheet"
REPORT_PATH = EXPORT_DIR / "country_context_world_bank_seed_report.md"

COUNTRY_TO_ISO3 = {
    "Thailand": "THA",
    "Singapore": "SGP",
    "Malaysia": "MYS",
    "Indonesia": "IDN",
    "Philippines": "PHL",
    "Taiwan": "TWN",
    "South Korea": "KOR",
    "China": "CHN",
    "Japan": "JPN",
    "India": "IND",
    "Sri Lanka": "LKA",
    "Bangladesh": "BGD",
    "Pakistan": "PAK",
    "Nepal": "NPL",
    "Bhutan": "BTN",
    "Maldives": "MDV",
    "France": "FRA",
    "Austria": "AUT",
    "Switzerland": "CHE",
    "Italy": "ITA",
    "Netherlands": "NLD",
    "Denmark": "DNK",
    "Portugal": "PRT",
    "Estonia": "EST",
    "Finland": "FIN",
    "Russia": "RUS",
    "Hungary": "HUN",
    "Poland": "POL",
    "Romania": "ROU",
    "Serbia": "SRB",
    "Slovakia": "SVK",
    "United States": "USA",
    "Mexico": "MEX",
    "Canada": "CAN",
    "Panama": "PAN",
    "Costa Rica": "CRI",
    "Puerto Rico": "PRI",
    "Brazil": "BRA",
    "Argentina": "ARG",
    "Chile": "CHL",
    "Colombia": "COL",
    "Peru": "PER",
    "Uruguay": "URY",
    "United Arab Emirates": "ARE",
    "Qatar": "QAT",
    "Saudi Arabia": "SAU",
    "Israel": "ISR",
    "Oman": "OMN",
    "Bahrain": "BHR",
    "Kuwait": "KWT",
    "Jordan": "JOR",
    "South Africa": "ZAF",
    "Kenya": "KEN",
    "Rwanda": "RWA",
    "Morocco": "MAR",
    "Mauritius": "MUS",
    "Botswana": "BWA",
    "Namibia": "NAM",
    "Ghana": "GHA",
    "Senegal": "SEN",
    "New Zealand": "NZL",
    "Australia": "AUS",
    "Fiji": "FJI",
}


@dataclass(frozen=True)
class FieldImportSpec:
    field: str
    indicator: str
    source_title: str
    export_filename: str
    decimals: int
    stale_before_year: int
    notes_prefix: str
    value_scale: float = 1.0


FIELD_SPECS = [
    FieldImportSpec(
        field="gdp_per_capita_ppp",
        indicator="NY.GDP.PCAP.PP.CD",
        source_title="World Bank WDI: GDP per capita, PPP (current international $)",
        export_filename="wb_NY.GDP.PCAP.PP.CD.json",
        decimals=2,
        stale_before_year=2022,
        notes_prefix="auto_seed=world_bank_wdi",
    ),
    FieldImportSpec(
        field="gdp_growth",
        indicator="NY.GDP.MKTP.KD.ZG",
        source_title="World Bank WDI: GDP growth (annual %)",
        export_filename="wb_NY.GDP.MKTP.KD.ZG.json",
        decimals=4,
        stale_before_year=2022,
        notes_prefix="auto_seed=world_bank_wdi",
    ),
    FieldImportSpec(
        field="gini_coefficient",
        indicator="SI.POV.GINI",
        source_title="World Bank WDI: Gini index",
        export_filename="wb_SI.POV.GINI.json",
        decimals=1,
        stale_before_year=2018,
        notes_prefix="auto_seed=world_bank_wdi",
    ),
    FieldImportSpec(
        field="ppp_private_consumption",
        indicator="PA.NUS.PRVT.PP",
        source_title="World Bank WDI: PPP conversion factor, private consumption (LCU per international $)",
        export_filename="wb_PA.NUS.PRVT.PP.json",
        decimals=6,
        stale_before_year=2022,
        notes_prefix="auto_seed=world_bank_wdi",
    ),
    FieldImportSpec(
        field="tax_rate_assumption",
        indicator="GC.TAX.TOTL.GD.ZS",
        source_title="World Bank WDI: Tax revenue (% of GDP) used as interim country average tax-take proxy",
        export_filename="wb_GC.TAX.TOTL.GD.ZS.json",
        decimals=6,
        stale_before_year=2020,
        notes_prefix="auto_seed=world_bank_wdi; proxy=country_average_tax_take_from_tax_revenue_share",
        value_scale=0.01,
    ),
    FieldImportSpec(
        field="household_debt_proxy",
        indicator="FD.AST.PRVT.GD.ZS",
        source_title="World Bank WDI: Domestic credit to private sector by banks (% of GDP) used as interim leverage proxy",
        export_filename="wb_FD.AST.PRVT.GD.ZS.json",
        decimals=4,
        stale_before_year=2020,
        notes_prefix="auto_seed=world_bank_wdi; proxy=broad_private_credit_not_household_only",
    ),
]


def countries() -> list[str]:
    return unique_countries(build_city_universe())


def indicator_url(iso3: str, indicator: str) -> str:
    return f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator}?format=json&mrv=30"


def format_value(value: float, decimals: int) -> str:
    text = f"{value:.{decimals}f}"
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def load_export(spec: FieldImportSpec) -> tuple[str, dict[str, dict[str, object]]]:
    path = EXPORT_DIR / spec.export_filename
    if not path.exists():
        raise FileNotFoundError(
            f"Missing World Bank export {path}. Fetch it before seeding {spec.field}."
        )

    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(payload, list) or len(payload) < 2:
        raise ValueError(f"Unexpected World Bank payload shape in {path}.")

    meta = payload[0]
    dataset_lastupdated = str(meta.get("lastupdated", ""))
    selected: dict[str, dict[str, object]] = {}
    for row in payload[1]:
        iso3 = str(row.get("countryiso3code", "")).strip()
        value = row.get("value")
        if iso3 not in COUNTRY_TO_ISO3.values() or value is None or iso3 in selected:
            continue
        selected[iso3] = row
    return dataset_lastupdated, selected


def build_notes(spec: FieldImportSpec, observation_year: int, dataset_lastupdated: str) -> str:
    stale = "yes" if observation_year < spec.stale_before_year else "no"
    return (
        f"{spec.notes_prefix}; indicator={spec.indicator}; observation_year={observation_year}; "
        f"dataset_lastupdated={dataset_lastupdated}; stale={stale}"
    )


def write_report(summary_rows: list[str]) -> None:
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(summary_rows).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    rows = read_csv_rows(COUNTRY_CONTEXT_PATH)
    summary_lines = [
        "# Country Context World Bank Seed Report",
        "",
        "This report records the latest non-null World Bank WDI observation selected from the local exports under `output/spreadsheet/`.",
        "",
    ]

    imports_by_key: dict[tuple[str, str], dict[str, str]] = {}

    for spec in FIELD_SPECS:
        dataset_lastupdated, selected = load_export(spec)
        imported = 0
        missing: list[str] = []
        stale: list[str] = []

        for country in countries():
            iso3 = COUNTRY_TO_ISO3[country]
            row = selected.get(iso3)
            if row is None:
                missing.append(country)
                continue

            observation_year = int(str(row["date"]))
            numeric_value = float(row["value"]) * spec.value_scale
            if observation_year < spec.stale_before_year:
                stale.append(f"{country} ({observation_year})")

            imports_by_key[(country, spec.field)] = {
                "value": format_value(numeric_value, spec.decimals),
                "provider_id": "world_bank",
                "source_url": indicator_url(iso3, spec.indicator),
                "source_title": spec.source_title,
                "source_date": f"{observation_year}-12-31",
                "notes": build_notes(spec, observation_year, dataset_lastupdated),
            }
            imported += 1

        summary_lines.append(f"## {spec.field}")
        summary_lines.append(f"- Imported rows: {imported}/{len(countries())}")
        summary_lines.append(f"- Missing countries: {', '.join(missing) if missing else 'None'}")
        summary_lines.append(f"- Stale observations: {', '.join(stale) if stale else 'None'}")
        summary_lines.append("")

    updated_rows: list[dict[str, str]] = []
    skipped_non_world_bank = 0
    for row in rows:
        key = (row["country"], row["field"])
        imported = imports_by_key.get(key)
        provider_id = row.get("provider_id", "").strip()
        if imported is None:
            updated_rows.append(row)
            continue
        if provider_id and provider_id != "world_bank":
            skipped_non_world_bank += 1
            updated_rows.append(row)
            continue

        updated_row = row.copy()
        updated_row.update(imported)
        updated_rows.append(updated_row)

    write_csv(COUNTRY_CONTEXT_PATH, updated_rows, list(rows[0].keys()))
    if skipped_non_world_bank:
        summary_lines.append(f"Skipped {skipped_non_world_bank} rows because they already used a non-World Bank provider.")

    write_report(summary_lines)

    print(f"Updated {COUNTRY_CONTEXT_PATH.relative_to(ROOT)}")
    print(f"Wrote {REPORT_PATH.relative_to(ROOT)}")
    for spec in FIELD_SPECS:
        imported_count = sum(
            1 for country in countries() if (country, spec.field) in imports_by_key
        )
        print(f"- {spec.field}: {imported_count}/{len(countries())} rows seeded")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
