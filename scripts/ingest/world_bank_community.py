"""
World Bank Community Pillar Proxy Ingestion — applies country-level indicators
to all cities as Tier 3 proxies for the Community pillar.

Maps to:
  - tolerance_pluralism_raw (community, positive) ← SG.GEN.PARL.ZS (women in parliament %)
  - cultural_public_life_raw (community, positive) ← SP.POP.DPND (age dependency ratio, inverted)

Provider: world_bank (Tier 3)
Update frequency: Annual

Usage:
    python3 scripts/ingest/world_bank_community.py [--dry-run]
"""
from __future__ import annotations

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
        "code": "SG.GEN.PARL.ZS",
        "field": "tolerance_pluralism_raw",
        "label": "Tolerance & pluralism (women in parliament proxy)",
        "pillar": "community",
        "source_title": "World Bank WDI: Proportion of seats held by women in national parliaments (%)",
        "notes_prefix": "auto_ingest=world_bank_proxy; proxy=gender_parity_parliament",
        "scale": 1.0,
        "stale_before": 2020,
        "transform": None,
    },
    {
        "code": "SP.POP.DPND",
        "field": "cultural_public_life_raw",
        "label": "Cultural & public life (social vitality proxy)",
        "pillar": "community",
        "source_title": "World Bank WDI: Age dependency ratio (% of working-age population), inverted as social vitality proxy",
        "notes_prefix": "auto_ingest=world_bank_proxy; proxy=inverse_dependency_ratio_social_vitality",
        "scale": 1.0,
        "stale_before": 2020,
        "transform": "invert_100",  # 100 - value: lower dependency = more social vitality
    },
    {
        "code": "SM.POP.NETM",
        "field": "hospitality_belonging_raw",
        "label": "Hospitality & belonging (net migration proxy)",
        "pillar": "community",
        "source_title": "World Bank WDI: Net migration (proxy for hospitality/belonging — positive = welcoming)",
        "notes_prefix": "auto_ingest=world_bank_proxy; proxy=net_migration_hospitality",
        "scale": 1.0,
        "stale_before": 2015,
        "transform": "per_capita",  # Will divide by population
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


def fetch_wb_population() -> dict[str, float]:
    """Fetch latest population for per-capita calculations."""
    url = f"{WB_API}/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&mrv=5"
    req = Request(url)
    try:
        with urlopen(req, timeout=60) as resp:
            payload = json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError):
        return {}

    if not isinstance(payload, list) or len(payload) < 2:
        return {}

    results: dict[str, float] = {}
    for row in payload[1]:
        iso3 = str(row.get("countryiso3code", "")).strip()
        value = row.get("value")
        year = row.get("date")
        if not iso3 or value is None:
            continue
        try:
            year_int = int(year)
            value_float = float(value)
        except (ValueError, TypeError):
            continue
        if iso3 not in results:
            results[iso3] = value_float
    return results


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("World Bank Community Pillar Proxy Ingestion")
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

    # Fetch population for per-capita transforms
    population = fetch_wb_population()

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

            if year < spec["stale_before"]:
                continue

            # Apply transforms
            if spec["transform"] == "invert_100":
                scaled = round(100.0 - value, 2)
            elif spec["transform"] == "per_capita":
                pop = population.get(iso3)
                if pop and pop > 0:
                    # Net migration per 1000 people, normalize to a 0-100ish scale
                    per_1000 = (value / pop) * 1000
                    # Shift to positive range: add 50 to center around 50
                    scaled = round(max(0, min(100, per_1000 + 50)), 2)
                else:
                    continue
            else:
                scaled = round(value * spec["scale"], 2)

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
