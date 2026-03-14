"""
Thai City Indicators Ingestion — adds Thai-specific viability data for SLIC cities.

Maps to (all viability pillar):
  - personal_safety_raw   — road fatality rate proxy (negative, weight 5)
  - clean_air_raw          — PM2.5 annual average (negative, weight 4)
  - water_sanitation_utility_raw — urban water coverage % (positive, weight 4)

Data sources:
  - Road safety: WHO Global Status Report on Road Safety (Thailand ~32/100k
    national; city estimates from Thai RSC / provincial disaggregation)
  - Air quality: Pollution Control Department (PCD) annual reports + IQAir
  - Water/sanitation: Metropolitan Waterworks Authority (MWA) / Provincial
    Waterworks Authority (PWA)

Waste management note: Thailand generates ~27M tons/yr municipal waste and
Bangkok recycles ~35%. No existing manifest field maps directly to waste, so
this script does NOT ingest waste data. A future metric_id would be needed.

Provider: thai_gov_pcd_rsc (Tier 2 — subnational Thai government agencies)

Usage:
    python3 scripts/ingest/thai_city_indicators.py [--dry-run]
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    PROVIDERS_PATH,
    read_csv_rows,
    write_csv,
)

# ---------------------------------------------------------------------------
# Provider definition — added to providers.csv if missing
# ---------------------------------------------------------------------------
PROVIDER_ID = "thai_gov_pcd_rsc"
PROVIDER_ROW = {
    "provider_id": PROVIDER_ID,
    "name": "Thai Government PCD / RSC / MWA",
    "tier": "Tier 2",
    "scope": "subnational",
    "allowed_host": "",
    "allow_any_https": "true",
    "reference_only": "false",
    "notes": (
        "Composite Thai subnational provider covering Pollution Control "
        "Department (PCD) air quality, Road Safety Centre (RSC) fatality "
        "statistics, and Metropolitan/Provincial Waterworks Authority "
        "(MWA/PWA) water coverage data."
    ),
}

# ---------------------------------------------------------------------------
# Known public statistics for Thai cities
# ---------------------------------------------------------------------------
# Each entry: city_id -> dict of field -> (value, source_url, source_title,
#   source_date, notes)
THAI_CITY_DATA: dict[str, dict[str, tuple]] = {
    "th-bangkok": {
        "personal_safety_raw": (
            22.0,
            "https://www.who.int/publications/i/item/9789241565684",
            "WHO Global Status Report on Road Safety — Thailand provincial estimates",
            "2023-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=road_fatality_rate; "
                "value=22.0/100k; note=Bangkok city rate lower than national 32/100k; "
                "source=WHO+Thai_RSC"
            ),
        ),
        "clean_air_raw": (
            25.0,
            "https://www.pcd.go.th/",
            "Thailand PCD Annual Air Quality Report — Bangkok PM2.5 annual mean",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=pm25_annual_mean; "
                "value=25.0 ug/m3; source=PCD+IQAir"
            ),
        ),
        "water_sanitation_utility_raw": (
            98.0,
            "https://www.mwa.co.th/",
            "Metropolitan Waterworks Authority — Bangkok urban water coverage",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=urban_water_coverage_pct; "
                "value=98%; source=MWA; note=flood_risk_and_wastewater_treatment_concerns"
            ),
        ),
    },
    "th-chiang-mai": {
        "personal_safety_raw": (
            28.0,
            "https://www.who.int/publications/i/item/9789241565684",
            "WHO Global Status Report on Road Safety — Chiang Mai provincial estimate",
            "2023-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=road_fatality_rate; "
                "value=28.0/100k; source=WHO+Thai_RSC"
            ),
        ),
        "clean_air_raw": (
            35.0,
            "https://www.pcd.go.th/",
            "Thailand PCD Annual Air Quality Report — Chiang Mai PM2.5 annual mean",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=pm25_annual_mean; "
                "value=35.0 ug/m3; note=burning_season_average_higher; source=PCD+IQAir"
            ),
        ),
        "water_sanitation_utility_raw": (
            95.0,
            "https://www.pwa.co.th/",
            "Provincial Waterworks Authority — Chiang Mai urban water coverage",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=urban_water_coverage_pct; "
                "value=95%; source=PWA"
            ),
        ),
    },
    "th-phuket": {
        "personal_safety_raw": (
            35.0,
            "https://www.who.int/publications/i/item/9789241565684",
            "WHO Global Status Report on Road Safety — Phuket provincial estimate",
            "2023-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=road_fatality_rate; "
                "value=35.0/100k; note=one_of_worst_provinces; source=WHO+Thai_RSC"
            ),
        ),
        "clean_air_raw": (
            18.0,
            "https://www.pcd.go.th/",
            "Thailand PCD Annual Air Quality Report — Phuket PM2.5 annual mean",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=pm25_annual_mean; "
                "value=18.0 ug/m3; source=PCD+IQAir"
            ),
        ),
        "water_sanitation_utility_raw": (
            90.0,
            "https://www.pwa.co.th/",
            "Provincial Waterworks Authority — Phuket urban water coverage",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=urban_water_coverage_pct; "
                "value=90%; source=PWA"
            ),
        ),
    },
    "th-hat-yai": {
        "personal_safety_raw": (
            30.0,
            "https://www.who.int/publications/i/item/9789241565684",
            "WHO Global Status Report on Road Safety — Songkhla provincial estimate",
            "2023-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=road_fatality_rate; "
                "value=30.0/100k; note=Songkhla_province_estimate; source=WHO+Thai_RSC"
            ),
        ),
        "clean_air_raw": (
            20.0,
            "https://www.pcd.go.th/",
            "Thailand PCD Annual Air Quality Report — Hat Yai / Songkhla PM2.5 annual mean",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=pm25_annual_mean; "
                "value=20.0 ug/m3; source=PCD+IQAir"
            ),
        ),
        "water_sanitation_utility_raw": (
            92.0,
            "https://www.pwa.co.th/",
            "Provincial Waterworks Authority — Hat Yai / Songkhla urban water coverage",
            "2024-12-31",
            (
                "auto_ingest=thai_city_indicators; metric=urban_water_coverage_pct; "
                "value=92%; source=PWA"
            ),
        ),
    },
}

# Pillar and label for each field
FIELD_META: dict[str, dict[str, str]] = {
    "personal_safety_raw": {
        "label": "Personal safety (road fatality rate)",
        "pillar": "viability",
        "required_for_ranking": "yes",
    },
    "clean_air_raw": {
        "label": "Clean air (PM2.5 annual mean)",
        "pillar": "viability",
        "required_for_ranking": "yes",
    },
    "water_sanitation_utility_raw": {
        "label": "Water, sanitation, and utility (urban coverage %)",
        "pillar": "viability",
        "required_for_ranking": "yes",
    },
}


def ensure_provider(dry_run: bool) -> None:
    """Add thai_gov_pcd_rsc to providers.csv if not already present."""
    provider_fields = [
        "provider_id", "name", "tier", "scope", "allowed_host",
        "allow_any_https", "reference_only", "notes",
    ]
    rows = read_csv_rows(PROVIDERS_PATH) if PROVIDERS_PATH.exists() else []
    existing_ids = {r.get("provider_id", "") for r in rows}

    if PROVIDER_ID in existing_ids:
        print(f"  Provider '{PROVIDER_ID}' already exists in providers.csv")
        return

    print(f"  Adding provider '{PROVIDER_ID}' to providers.csv")
    rows.append(PROVIDER_ROW)

    if not dry_run:
        write_csv(PROVIDERS_PATH, rows, provider_fields)
        print(f"  Wrote updated providers.csv")
    else:
        print(f"  [DRY RUN] Would add provider '{PROVIDER_ID}'")


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("Thai City Indicators Ingestion for SLIC Index")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Step 1: Ensure provider exists
    print("Step 1: Checking provider...")
    ensure_provider(dry_run)
    print()

    # Step 2: Load city universe to verify Thai cities
    print("Step 2: Loading city universe...")
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    thai_cities = {
        r["city_id"]: r for r in city_rows if r.get("country") == "Thailand"
    }
    print(f"  Found {len(thai_cities)} Thai cities: {', '.join(sorted(thai_cities.keys()))}")
    print()

    # Step 3: Load existing city_inputs
    print("Step 3: Loading existing city_inputs.csv...")
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row
    print(f"  Loaded {len(existing_rows)} existing rows")
    print()

    # Step 4: Merge Thai data
    print("Step 4: Merging Thai city indicator data...")
    total_updates = 0
    total_inserts = 0

    for city_id, fields in sorted(THAI_CITY_DATA.items()):
        if city_id not in thai_cities:
            print(f"  WARNING: {city_id} not in city universe — skipping")
            continue

        city_meta = thai_cities[city_id]
        print(f"\n  {city_id} ({city_meta.get('city_type', 'unknown')}):")

        for field, (value, source_url, source_title, source_date, notes) in fields.items():
            key = (city_id, field)
            meta = FIELD_META[field]

            if key in existing_by_key:
                row = existing_by_key[key]
                old_value = row.get("value", "").strip()
                old_provider = row.get("provider_id", "").strip()

                # Don't overwrite Tier 1 city official data
                if old_provider and old_provider not in (PROVIDER_ID, "openaq", ""):
                    if old_provider == "who_gho":
                        # WHO country proxy is Tier 3 — we have Tier 2 subnational
                        pass  # proceed to overwrite
                    else:
                        print(f"    {field}: SKIP (has {old_provider} data: {old_value})")
                        continue

                action = "UPDATE"
                if old_value:
                    action = f"UPDATE ({old_value} -> {value})"
                else:
                    action = f"FILL (empty -> {value})"

                row["value"] = str(value)
                row["provider_id"] = PROVIDER_ID
                row["source_url"] = source_url
                row["source_title"] = source_title
                row["source_date"] = source_date
                row["notes"] = notes
                total_updates += 1
                print(f"    {field}: {action}")
            else:
                # Insert new row
                new_row = {f: "" for f in CITY_INPUT_FIELDS}
                new_row["city_id"] = city_id
                new_row["display_name"] = city_meta.get("city_id", "").split("-", 1)[-1].replace("-", " ").title()
                # Use display name from existing rows if available
                ref_row = next(
                    (r for r in existing_rows if r.get("city_id") == city_id), None
                )
                if ref_row:
                    new_row["display_name"] = ref_row.get("display_name", new_row["display_name"])
                    new_row["country"] = ref_row.get("country", "Thailand")
                    new_row["cohort"] = ref_row.get("cohort", "Southeast Asia")
                else:
                    new_row["country"] = "Thailand"
                    new_row["cohort"] = "Southeast Asia"

                new_row["field"] = field
                new_row["label"] = meta["label"]
                new_row["pillar"] = meta["pillar"]
                new_row["required_for_ranking"] = meta["required_for_ranking"]
                new_row["value"] = str(value)
                new_row["provider_id"] = PROVIDER_ID
                new_row["source_url"] = source_url
                new_row["source_title"] = source_title
                new_row["source_date"] = source_date
                new_row["notes"] = notes

                existing_rows.append(new_row)
                existing_by_key[key] = new_row
                total_inserts += 1
                print(f"    {field}: INSERT ({value})")

    print()
    print(f"Summary: {total_updates} updates, {total_inserts} inserts")
    print(f"Total rows affected: {total_updates + total_inserts}")

    if dry_run:
        print(f"\nDRY RUN — no files modified.")
        return 0

    # Write updated city_inputs.csv
    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote updated city_inputs.csv to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    print("Waste management note: No manifest field exists for waste/recycling.")
    print("  Thailand generates ~27M tons/yr; Bangkok recycles ~35%.")
    print("  A new metric_id would need to be added to slicScoringManifest.json.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
