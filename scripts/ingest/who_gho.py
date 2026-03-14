"""
WHO Global Health Observatory Ingestion — fetches health indicators for SLIC cities.

Maps to:
  - healthcare_quality_raw (capability pillar, weight 8, positive)
  - suicide_mental_strain_raw (pressure pillar, weight 3, negative)

Provider: who_gho (Tier 3)
Granularity: Country-level (applied to all cities in that country)
Update frequency: Annual

Usage:
    python3 scripts/ingest/who_gho.py [--dry-run]
"""
from __future__ import annotations

import csv
import json
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    read_csv_rows,
    write_csv,
)

WHO_GHO_BASE = "https://ghoapi.azureedge.net/api"

# WHO indicator codes
INDICATORS = {
    "UHC_INDEX_REPORTED": {
        "field": "healthcare_quality_raw",
        "label": "Healthcare quality (UHC index)",
        "pillar": "capability",
        "source_title": "WHO GHO: UHC Service Coverage Index",
        "notes_prefix": "auto_ingest=who_gho; indicator=UHC_INDEX_REPORTED",
        "scale": 1.0,  # Already 0-100
        "dim1_filter": None,  # No sex dimension for UHC
    },
    "SDGSUICIDE": {
        "field": "suicide_mental_strain_raw",
        "label": "Suicide / mental strain rate",
        "pillar": "pressure",
        "source_title": "WHO GHO: Age-standardized suicide rate (per 100,000 population)",
        "notes_prefix": "auto_ingest=who_gho; indicator=SDGSUICIDE",
        "scale": 1.0,
        "dim1_filter": None,  # Fetch all, filter in Python
        "py_dim1": "SEX_BTSX",         # Both sexes
        "py_dim2": "AGEGROUP_YEARSALL", # All ages (crude rate)
    },
}

# ISO3 to country name mapping (from city universe)
ISO3_TO_COUNTRY: dict[str, str] = {
    "THA": "Thailand", "SGP": "Singapore", "MYS": "Malaysia", "IDN": "Indonesia",
    "PHL": "Philippines", "VNM": "Viet Nam", "KHM": "Cambodia", "LAO": "Lao People's Democratic Republic",
    "MMR": "Myanmar", "JPN": "Japan", "KOR": "Republic of Korea", "CHN": "China",
    "TWN": "Taiwan", "HKG": "Hong Kong", "MNG": "Mongolia",
    "IND": "India", "LKA": "Sri Lanka", "BGD": "Bangladesh", "PAK": "Pakistan",
    "NPL": "Nepal", "BTN": "Bhutan", "MDV": "Maldives",
    "FRA": "France", "AUT": "Austria", "CHE": "Switzerland", "ITA": "Italy",
    "NLD": "Netherlands", "DNK": "Denmark", "PRT": "Portugal", "EST": "Estonia",
    "FIN": "Finland", "RUS": "Russian Federation", "HUN": "Hungary", "POL": "Poland",
    "ROU": "Romania", "SRB": "Serbia", "SVK": "Slovakia",
    "USA": "United States of America", "CAN": "Canada", "MEX": "Mexico",
    "PAN": "Panama", "CRI": "Costa Rica", "PRI": "Puerto Rico",
    "BRA": "Brazil", "ARG": "Argentina", "CHL": "Chile", "COL": "Colombia",
    "PER": "Peru", "URY": "Uruguay",
    "ARE": "United Arab Emirates", "QAT": "Qatar", "SAU": "Saudi Arabia",
    "ISR": "Israel", "OMN": "Oman", "BHR": "Bahrain", "KWT": "Kuwait", "JOR": "Jordan",
    "ZAF": "South Africa", "KEN": "Kenya", "RWA": "Rwanda", "MAR": "Morocco",
    "MUS": "Mauritius", "BWA": "Botswana", "NAM": "Namibia", "GHA": "Ghana", "SEN": "Senegal",
    "NZL": "New Zealand", "AUS": "Australia", "FJI": "Fiji",
}

# Reverse: country name in our system to ISO3
COUNTRY_TO_ISO3: dict[str, str] = {
    "Thailand": "THA", "Singapore": "SGP", "Malaysia": "MYS", "Indonesia": "IDN",
    "Philippines": "PHL", "Taiwan": "TWN", "South Korea": "KOR", "China": "CHN",
    "Japan": "JPN", "India": "IND", "Sri Lanka": "LKA", "Bangladesh": "BGD",
    "Pakistan": "PAK", "Nepal": "NPL", "Bhutan": "BTN", "Maldives": "MDV",
    "France": "FRA", "Austria": "AUT", "Switzerland": "CHE", "Italy": "ITA",
    "Netherlands": "NLD", "Denmark": "DNK", "Portugal": "PRT", "Estonia": "EST",
    "Finland": "FIN", "Russia": "RUS", "Hungary": "HUN", "Poland": "POL",
    "Romania": "ROU", "Serbia": "SRB", "Slovakia": "SVK",
    "United States": "USA", "Mexico": "MEX", "Canada": "CAN",
    "Panama": "PAN", "Costa Rica": "CRI", "Puerto Rico": "PRI",
    "Brazil": "BRA", "Argentina": "ARG", "Chile": "CHL", "Colombia": "COL",
    "Peru": "PER", "Uruguay": "URY",
    "United Arab Emirates": "ARE", "Qatar": "QAT", "Saudi Arabia": "SAU",
    "Israel": "ISR", "Oman": "OMN", "Bahrain": "BHR", "Kuwait": "KWT", "Jordan": "JOR",
    "South Africa": "ZAF", "Kenya": "KEN", "Rwanda": "RWA", "Morocco": "MAR",
    "Mauritius": "MUS", "Botswana": "BWA", "Namibia": "NAM", "Ghana": "GHA", "Senegal": "SEN",
    "New Zealand": "NZL", "Australia": "AUS", "Fiji": "FJI",
    "Hong Kong": "HKG", "Mongolia": "MNG",
    "Vietnam": "VNM", "Cambodia": "KHM", "Laos": "LAO", "Myanmar": "MMR",
}


def fetch_who_indicator(indicator_code: str, dim1_filter: str | None = None) -> list[dict]:
    """Fetch all data for a WHO GHO indicator. Returns list of observation dicts."""
    url = f"{WHO_GHO_BASE}/{indicator_code}"
    if dim1_filter:
        from urllib.parse import quote
        url += f"?$filter={quote(f'Dim1 eq {chr(39)}{dim1_filter}{chr(39)}')}"
    req = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
            return data.get("value", [])
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        print(f"  Warning: WHO GHO request failed for {indicator_code}: {exc}")
        return []


def get_latest_by_country(
    observations: list[dict],
    dim1_filter: str | None = None,
    dim2_filter: str | None = None,
) -> dict[str, tuple[float, int]]:
    """Extract the latest value per country (ISO3 → (value, year))."""
    latest: dict[str, tuple[float, int]] = {}
    for obs in observations:
        iso3 = obs.get("SpatialDim", "")
        value = obs.get("NumericValue")
        year = obs.get("TimeDim")
        if not iso3 or value is None or year is None:
            continue
        # Apply dimension filters in Python for reliability
        if dim1_filter and obs.get("Dim1", "") != dim1_filter:
            continue
        if dim2_filter and obs.get("Dim2", "") != dim2_filter:
            continue
        try:
            year_int = int(year)
            value_float = float(value)
        except (ValueError, TypeError):
            continue
        if iso3 not in latest or year_int > latest[iso3][1]:
            latest[iso3] = (value_float, year_int)
    return latest


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("WHO GHO Health Indicator Ingestion for SLIC Index")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe to map countries to cities
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    country_to_cities: dict[str, list[str]] = {}
    for row in city_rows:
        country = row.get("country", "")
        city_id = row.get("city_id", "")
        if country and city_id:
            country_to_cities.setdefault(country, []).append(city_id)

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    total_updates = 0

    for indicator_code, spec in INDICATORS.items():
        field = spec["field"]
        print(f"\nFetching {indicator_code} → {field}...")

        observations = fetch_who_indicator(indicator_code, spec.get("dim1_filter"))
        print(f"  Got {len(observations)} observations")

        latest = get_latest_by_country(
            observations,
            dim1_filter=spec.get("py_dim1"),
            dim2_filter=spec.get("py_dim2"),
        )
        print(f"  Latest values for {len(latest)} countries")

        updates = 0
        for country, city_ids in country_to_cities.items():
            iso3 = COUNTRY_TO_ISO3.get(country)
            if iso3 is None:
                continue

            data = latest.get(iso3)
            if data is None:
                continue

            value, year = data
            scaled = round(value * spec["scale"], 2)

            for city_id in city_ids:
                key = (city_id, field)
                existing = existing_by_key.get(key, {})
                existing_provider = existing.get("provider_id", "").strip()

                # Don't overwrite Tier 1/2 data
                if existing_provider and existing_provider not in ("who_gho", ""):
                    continue

                source_url = f"https://www.who.int/data/gho/data/indicators/indicator-details/GHO/{indicator_code}"

                if key in existing_by_key:
                    row = existing_by_key[key]
                    row["value"] = str(scaled)
                    row["provider_id"] = "who_gho"
                    row["source_url"] = source_url
                    row["source_title"] = spec["source_title"]
                    row["source_date"] = f"{year}-12-31"
                    row["notes"] = f"{spec['notes_prefix']}; year={year}; country_proxy={country}"
                else:
                    city_ref = next((r for r in existing_rows if r.get("city_id") == city_id), None)
                    new_row = {f: "" for f in CITY_INPUT_FIELDS}
                    new_row["city_id"] = city_id
                    new_row["display_name"] = city_ref.get("display_name", "") if city_ref else ""
                    new_row["country"] = country
                    new_row["cohort"] = city_ref.get("cohort", "") if city_ref else ""
                    new_row["field"] = field
                    new_row["label"] = spec["label"]
                    new_row["pillar"] = spec["pillar"]
                    new_row["required_for_ranking"] = "yes"
                    new_row["value"] = str(scaled)
                    new_row["provider_id"] = "who_gho"
                    new_row["source_url"] = source_url
                    new_row["source_title"] = spec["source_title"]
                    new_row["source_date"] = f"{year}-12-31"
                    new_row["notes"] = f"{spec['notes_prefix']}; year={year}; country_proxy={country}"
                    existing_rows.append(new_row)
                    existing_by_key[key] = new_row

                updates += 1

        print(f"  Updated {updates} city rows for {field}")
        total_updates += updates
        time.sleep(1)  # Rate limiting

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated. No files modified.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
