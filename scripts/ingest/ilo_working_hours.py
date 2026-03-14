"""
ILO Working Hours Ingestion — fetches average weekly working hours from the
ILO ILOSTAT database and applies them as country-level proxies to SLIC cities.

Maps to: working_time_pressure_raw (pressure pillar, weight 4, directionality negative)

Source: ILO ILOSTAT indicator HOW_TEMP_SEX_ECO_NB_A
        (Mean weekly hours actually worked per employed person)
API:    https://rplumber.ilo.org/data/indicator/

Provider: ilo (Tier 3)
Granularity: Country-level (applied to all cities in that country)
Update frequency: Annual

Usage:
    python3 scripts/ingest/ilo_working_hours.py [--dry-run]
"""
from __future__ import annotations

import csv
import io
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

# Reverse mapping: ISO3 → country display name used in our city universe
ISO3_TO_COUNTRY: dict[str, str] = {v: k for k, v in COUNTRY_TO_ISO3.items()}

ILO_CSV_URL = (
    "https://rplumber.ilo.org/data/indicator/"
    "?id=HOW_TEMP_SEX_ECO_NB_A&timefrom=2018&type=code&format=.csv"
)

FIELD = "working_time_pressure_raw"
PROVIDER = "ilo_ilostat"
LABEL = "Working time pressure (weekly hours)"
PILLAR = "pressure"
SOURCE_TITLE = "ILO ILOSTAT: Mean weekly hours actually worked per employed person"
NOTES_PREFIX = "auto_ingest=ilo_working_hours; indicator=HOW_TEMP_SEX_ECO_NB_A"
STALE_BEFORE = 2018


def fetch_ilo_csv() -> list[dict[str, str]]:
    """Download the ILO indicator CSV and return parsed rows."""
    print(f"  Fetching ILO CSV from rplumber.ilo.org ...")
    req = Request(ILO_CSV_URL, headers={
        "Accept": "text/csv",
        "User-Agent": "SLIC-Index-Ingestion/1.0",
    })
    try:
        with urlopen(req, timeout=120) as resp:
            raw = resp.read()
    except (HTTPError, URLError) as exc:
        print(f"  Warning: ILO CSV download failed: {exc}")
        return []

    # Try UTF-8-SIG (handles BOM) first, fall back to latin-1
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text))
    return list(reader)


def extract_latest_by_iso3(rows: list[dict[str, str]]) -> dict[str, tuple[float, int]]:
    """
    Parse ILO CSV rows and return {iso3: (hours, year)} keeping only the
    latest year per country.

    The CSV columns vary but typically include:
      ref_area (ISO3), time, obs_value, sex, classif1, ...
    We filter for:
      - sex = "Total" (or "Sex: Total")
      - classif1 = "Total" / "Economic activity: Total" (aggregate)
    """
    latest: dict[str, tuple[float, int]] = {}
    # Code mode values
    sex_ok = {"total", "sex: total", "sex_t", "sex_t"}
    eco_ok = {"total", "economic activity: total", "economic activity (aggregate): total",
              "eco_aggregate_total", "eco_isic4_total"}

    if not rows:
        return latest

    sample = rows[0]
    keys = list(sample.keys())
    # Strip any remaining BOM or whitespace from keys
    clean_keys = {k.strip().strip('"'): k for k in keys}

    def find_col(*candidates: str) -> str | None:
        for c in candidates:
            if c in sample:
                return c
            # Try case-insensitive match against cleaned keys
            for clean, orig in clean_keys.items():
                if clean.lower() == c.lower():
                    return orig
        return None

    iso3_col = find_col("ref_area", "ref_area.label")
    time_col = find_col("time", "time.label")
    value_col = find_col("obs_value")
    sex_col = find_col("sex", "sex.label")
    eco_col = find_col("classif1", "classif1.label")

    if iso3_col is None or time_col is None or value_col is None:
        print(f"  Warning: Could not identify required columns. Available: {keys}")
        return latest

    print(f"  CSV columns: iso3={iso3_col}, time={time_col}, value={value_col}, sex={sex_col}, eco={eco_col}")

    skipped_sex = 0
    skipped_eco = 0
    parsed = 0

    for row in rows:
        # Filter sex dimension
        if sex_col:
            sex_val = row.get(sex_col, "").strip().lower()
            if sex_val and sex_val not in sex_ok:
                skipped_sex += 1
                continue

        # Filter economic activity dimension
        if eco_col:
            eco_val = row.get(eco_col, "").strip().lower()
            if eco_val and eco_val not in eco_ok:
                skipped_eco += 1
                continue

        iso3_raw = row.get(iso3_col, "").strip()
        # In label mode, ref_area.label is country name; ref_area is ISO3.
        # Check if we also have a ref_area column with the code
        if iso3_col == "ref_area.label" and "ref_area" in row:
            iso3 = row["ref_area"].strip()
        else:
            iso3 = iso3_raw

        # iso3 codes are 3 uppercase letters
        if len(iso3) != 3 or not iso3.isalpha():
            continue
        iso3 = iso3.upper()

        value_str = row.get(value_col, "").strip()
        time_str = row.get(time_col, "").strip()
        if not value_str or not time_str:
            continue

        try:
            value = float(value_str)
            year = int(time_str)
        except (ValueError, TypeError):
            continue

        if year < STALE_BEFORE:
            continue

        parsed += 1

        if iso3 not in latest or year > latest[iso3][1]:
            latest[iso3] = (value, year)

    print(f"  Parsed {parsed} matching observations ({skipped_sex} skipped by sex filter, {skipped_eco} by eco filter)")
    return latest


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("ILO Working Hours Ingestion for SLIC Index")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe to map countries to cities
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    country_to_cities: dict[str, list[dict[str, str]]] = {}
    for row in city_rows:
        country = row.get("country", "")
        if country:
            country_to_cities.setdefault(country, []).append(row)

    print(f"Loaded {sum(len(v) for v in country_to_cities.values())} cities across {len(country_to_cities)} countries")

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    print(f"Existing city_inputs rows: {len(existing_rows)}")
    print()

    # Fetch ILO data
    print("Fetching ILO working hours data...")
    ilo_rows = fetch_ilo_csv()
    if not ilo_rows:
        print("ERROR: No data returned from ILO API. Aborting.")
        return 1

    print(f"  Downloaded {len(ilo_rows)} raw CSV rows")

    latest = extract_latest_by_iso3(ilo_rows)
    print(f"  Latest values for {len(latest)} countries")
    print()

    # Map to our countries
    matched_countries = 0
    unmatched_iso3: list[str] = []
    for country in country_to_cities:
        iso3 = COUNTRY_TO_ISO3.get(country)
        if iso3 and iso3 in latest:
            matched_countries += 1
        elif iso3:
            unmatched_iso3.append(f"{country} ({iso3})")

    print(f"Country matches: {matched_countries}/{len(country_to_cities)}")
    if unmatched_iso3:
        print(f"  No ILO data for: {', '.join(sorted(unmatched_iso3))}")
    print()

    # Apply to cities
    updates = 0
    for country, cities in country_to_cities.items():
        iso3 = COUNTRY_TO_ISO3.get(country)
        if iso3 is None or iso3 not in latest:
            continue

        value, year = latest[iso3]
        rounded_value = round(value, 2)

        for city_row in cities:
            city_id = city_row.get("city_id", "")
            if not city_id:
                continue
            key = (city_id, FIELD)

            existing = existing_by_key.get(key, {})
            existing_provider = existing.get("provider_id", "").strip()

            # Don't overwrite non-ILO provider data
            if existing_provider and existing_provider not in (PROVIDER, ""):
                continue

            source_url = (
                f"https://ilostat.ilo.org/data/indicator/?id=HOW_TEMP_SEX_ECO_NB_A&ref_area={iso3}"
            )

            if key in existing_by_key:
                row = existing_by_key[key]
                row["value"] = str(rounded_value)
                row["provider_id"] = PROVIDER
                row["source_url"] = source_url
                row["source_title"] = SOURCE_TITLE
                row["source_date"] = f"{year}-12-31"
                row["notes"] = f"{NOTES_PREFIX}; year={year}; hours={rounded_value}; country_proxy={country}"
            else:
                new_row = {f: "" for f in CITY_INPUT_FIELDS}
                new_row["city_id"] = city_id
                new_row["display_name"] = city_row.get("display_name", city_id)
                new_row["country"] = country
                new_row["cohort"] = city_row.get("cohort", "")
                new_row["field"] = FIELD
                new_row["label"] = LABEL
                new_row["pillar"] = PILLAR
                new_row["required_for_ranking"] = "yes"
                new_row["value"] = str(rounded_value)
                new_row["provider_id"] = PROVIDER
                new_row["source_url"] = source_url
                new_row["source_title"] = SOURCE_TITLE
                new_row["source_date"] = f"{year}-12-31"
                new_row["notes"] = f"{NOTES_PREFIX}; year={year}; hours={rounded_value}; country_proxy={country}"
                existing_rows.append(new_row)
                existing_by_key[key] = new_row

            updates += 1

    print(f"Total city rows to update: {updates}")

    if dry_run:
        print(f"\nDRY RUN — {updates} rows would be updated. No files modified.")
        # Show a sample
        sample_count = 0
        for country, cities in sorted(country_to_cities.items()):
            iso3 = COUNTRY_TO_ISO3.get(country)
            if iso3 and iso3 in latest:
                value, year = latest[iso3]
                print(f"  {country} ({iso3}): {value} hrs/week ({year})")
                sample_count += 1
                if sample_count >= 20:
                    print(f"  ... and {matched_countries - 20} more countries")
                    break
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {updates} {FIELD} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
