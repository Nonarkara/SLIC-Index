"""
World Bank Country-to-City Proxy Ingestion — applies country-level WB indicators
to all cities in that country as Tier 3 proxies.

Maps to:
  - water_sanitation_utility_raw (viability, positive) ← SH.H2O.SMDW.ZS
  - education_quality_raw (capability, positive) ← SE.XPD.TOTL.GD.ZS + SE.TER.ENRR
  - working_time_pressure_raw (pressure, negative) ← custom from ILO-compatible WB
  - digital_infrastructure_raw (viability, positive) ← IT.NET.BBND.P2

Provider: world_bank (Tier 3)
Update frequency: Annual

Usage:
    python3 scripts/ingest/world_bank_city_proxy.py [--dry-run]
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
from seed_country_context_from_world_bank_exports import COUNTRY_TO_ISO3

WB_API = "https://api.worldbank.org/v2"

INDICATORS = [
    {
        "code": "SH.H2O.SMDW.ZS",
        "field": "water_sanitation_utility_raw",
        "label": "Water & sanitation access",
        "pillar": "viability",
        "source_title": "World Bank WDI: People using safely managed drinking water services (% of population)",
        "notes_prefix": "auto_ingest=world_bank_proxy",
        "scale": 1.0,
        "stale_before": 2018,
    },
    {
        "code": "IT.NET.BBND.P2",
        "field": "digital_infrastructure_raw",
        "label": "Digital infrastructure (broadband)",
        "pillar": "viability",
        "source_title": "World Bank WDI: Fixed broadband subscriptions (per 100 people)",
        "notes_prefix": "auto_ingest=world_bank_proxy",
        "scale": 1.0,
        "stale_before": 2020,
    },
    {
        "code": "SE.TER.ENRR",
        "field": "education_quality_raw",
        "label": "Education quality (tertiary enrollment)",
        "pillar": "capability",
        "source_title": "World Bank WDI: School enrollment, tertiary (% gross)",
        "notes_prefix": "auto_ingest=world_bank_proxy",
        "scale": 1.0,
        "stale_before": 2018,
    },
]


def fetch_wb_indicator(indicator_code: str) -> dict[str, tuple[float, int, str]]:
    """Fetch latest values for all countries. Returns {iso3: (value, year, url)}."""
    url = f"{WB_API}/country/all/indicator/{indicator_code}?format=json&per_page=20000&mrv=10"
    req = Request(url)
    try:
        with urlopen(req, timeout=60) as resp:
            payload = json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        print(f"  Warning: World Bank request failed for {indicator_code}: {exc}")
        return {}

    if not isinstance(payload, list) or len(payload) < 2:
        return {}

    results: dict[str, tuple[float, int, str]] = {}
    for row in payload[1]:
        iso3 = str(row.get("countryiso3code", "")).strip()
        value = row.get("value")
        year = row.get("date")
        if not iso3 or value is None or not year:
            continue
        try:
            year_int = int(year)
            value_float = float(value)
        except (ValueError, TypeError):
            continue
        if iso3 not in results or year_int > results[iso3][1]:
            source_url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator_code}?format=json&mrv=10"
            results[iso3] = (value_float, year_int, source_url)
    return results


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("World Bank Country-to-City Proxy Ingestion")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    country_to_cities: dict[str, list[dict[str, str]]] = {}
    for row in city_rows:
        country = row.get("country", "")
        if country:
            country_to_cities.setdefault(country, []).append(row)

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    total_updates = 0

    for spec in INDICATORS:
        code = spec["code"]
        field = spec["field"]
        print(f"Fetching {code} → {field}...")

        data = fetch_wb_indicator(code)
        print(f"  Got data for {len(data)} countries")

        updates = 0
        for country, cities in country_to_cities.items():
            iso3 = COUNTRY_TO_ISO3.get(country)
            if iso3 is None or iso3 not in data:
                continue

            value, year, source_url = data[iso3]
            scaled = round(value * spec["scale"], 2)

            if year < spec["stale_before"]:
                continue  # Too old

            for city_row in cities:
                city_id = city_row["city_id"]
                key = (city_id, field)

                existing = existing_by_key.get(key, {})
                existing_provider = existing.get("provider_id", "").strip()
                if existing_provider and existing_provider not in ("world_bank", ""):
                    continue

                if key in existing_by_key:
                    row = existing_by_key[key]
                    row["value"] = str(scaled)
                    row["provider_id"] = "world_bank"
                    row["source_url"] = source_url
                    row["source_title"] = spec["source_title"]
                    row["source_date"] = f"{year}-12-31"
                    row["notes"] = f"{spec['notes_prefix']}; indicator={code}; year={year}; country_proxy={country}"
                else:
                    new_row = {f: "" for f in CITY_INPUT_FIELDS}
                    new_row["city_id"] = city_id
                    new_row["display_name"] = city_row.get("display_name", city_id)
                    new_row["country"] = country
                    new_row["cohort"] = city_row.get("cohort", "")
                    new_row["field"] = field
                    new_row["label"] = spec["label"]
                    new_row["pillar"] = spec["pillar"]
                    new_row["required_for_ranking"] = "yes"
                    new_row["value"] = str(scaled)
                    new_row["provider_id"] = "world_bank"
                    new_row["source_url"] = source_url
                    new_row["source_title"] = spec["source_title"]
                    new_row["source_date"] = f"{year}-12-31"
                    new_row["notes"] = f"{spec['notes_prefix']}; indicator={code}; year={year}; country_proxy={country}"
                    existing_rows.append(new_row)
                    existing_by_key[key] = new_row

                updates += 1

        print(f"  Updated {updates} city rows")
        total_updates += updates
        time.sleep(1)

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
