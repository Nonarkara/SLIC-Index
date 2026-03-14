"""
OpenAQ v3 Air Quality Ingestion — fetches PM2.5 annual averages for SLIC cities.

Maps to: clean_air_raw (viability pillar, weight 4, directionality negative)
Provider: openaq (Tier 4)
Update frequency: Can run weekly; data is near-real-time from monitoring stations.

Usage:
    python3 scripts/ingest/openaq_air_quality.py [--dry-run]
"""
from __future__ import annotations

import csv
import json
import sys
import time
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    read_csv_rows,
    write_csv,
)

OPENAQ_BASE = "https://api.openaq.org/v3"

# City coordinates for proximity search (lat, lon).
# These are approximate city center coordinates.
CITY_COORDS: dict[str, tuple[float, float]] = {
    "th-bangkok": (13.7563, 100.5018),
    "sg-singapore": (1.3521, 103.8198),
    "my-kuala-lumpur": (3.1390, 101.6869),
    "id-jakarta": (-6.2088, 106.8456),
    "ph-makati": (14.5547, 121.0244),
    "my-george-town": (5.4141, 100.3288),
    "th-phuket": (7.8804, 98.3923),
    "th-chiang-mai": (18.7883, 98.9853),
    "my-kuching": (1.5497, 110.3634),
    "id-bali-denpasar": (-8.6705, 115.2126),
    "vn-ho-chi-minh-city": (10.8231, 106.6297),
    "kh-phnom-penh": (11.5564, 104.9282),
    "la-vientiane": (17.9757, 102.6331),
    "mm-yangon": (16.8661, 96.1951),
    "jp-tokyo": (35.6762, 139.6503),
    "kr-seoul": (37.5665, 126.9780),
    "cn-shanghai": (31.2304, 121.4737),
    "cn-beijing": (39.9042, 116.4074),
    "cn-shenzhen": (22.5431, 114.0579),
    "cn-guangzhou": (23.1291, 113.2644),
    "tw-taipei": (25.0330, 121.5654),
    "hk-hong-kong": (22.3193, 114.1694),
    "jp-osaka": (34.6937, 135.5023),
    "jp-fukuoka": (33.5904, 130.4017),
    "kr-busan": (35.1796, 129.0756),
    "mn-ulaanbaatar": (47.8864, 106.9057),
    "in-mumbai": (19.0760, 72.8777),
    "in-new-delhi": (28.6139, 77.2090),
    "in-bengaluru": (12.9716, 77.5946),
    "in-hyderabad": (17.3850, 78.4867),
    "in-chennai": (13.0827, 80.2707),
    "in-pune": (18.5204, 73.8567),
    "in-ahmedabad": (23.0225, 72.5714),
    "in-kochi": (9.9312, 76.2673),
    "lk-colombo": (6.9271, 79.8612),
    "bd-dhaka": (23.8103, 90.4125),
    "pk-lahore": (31.5204, 74.3587),
    "pk-islamabad": (33.6844, 73.0479),
    "np-kathmandu": (27.7172, 85.3240),
    "bt-thimphu": (27.4728, 89.6393),
    "mv-male": (4.1755, 73.5093),
    "fr-paris": (48.8566, 2.3522),
    "at-vienna": (48.2082, 16.3738),
    "ch-zurich": (47.3769, 8.5417),
    "it-milan": (45.4642, 9.1900),
    "it-bologna": (44.4949, 11.3426),
    "nl-amsterdam": (52.3676, 4.9041),
    "dk-copenhagen": (55.6761, 12.5683),
    "pt-lisbon": (38.7223, -9.1393),
    "ee-tallinn": (59.4370, 24.7536),
    "fi-helsinki": (60.1699, 24.9384),
    "ru-moscow": (55.7558, 37.6173),
    "hu-budapest": (47.4979, 19.0402),
    "pl-warsaw": (52.2297, 21.0122),
    "ro-bucharest": (44.4268, 26.1025),
    "rs-belgrade": (44.7866, 20.4489),
    "sk-bratislava": (48.1486, 17.1077),
    "us-new-york": (40.7128, -74.0060),
    "us-san-francisco": (37.7749, -122.4194),
    "us-austin": (30.2672, -97.7431),
    "us-portland": (45.5152, -122.6784),
    "ca-vancouver": (49.2827, -123.1207),
    "ca-toronto": (43.6532, -79.3832),
    "mx-mexico-city": (19.4326, -99.1332),
    "mx-merida": (20.9674, -89.5926),
    "pa-panama-city": (8.9824, -79.5199),
    "cr-san-jose": (9.9281, -84.0907),
    "br-sao-paulo": (-23.5505, -46.6333),
    "br-curitiba": (-25.4284, -49.2733),
    "ar-buenos-aires": (-34.6037, -58.3816),
    "cl-santiago": (-33.4489, -70.6693),
    "co-medellin": (6.2476, -75.5658),
    "co-bogota": (4.7110, -74.0721),
    "pe-lima": (-12.0464, -77.0428),
    "uy-montevideo": (-34.9011, -56.1645),
    "ae-dubai": (25.2048, 55.2708),
    "ae-abu-dhabi": (24.4539, 54.3773),
    "qa-doha": (25.2854, 51.5310),
    "sa-riyadh": (24.7136, 46.6753),
    "il-tel-aviv": (32.0853, 34.7818),
    "om-muscat": (23.5880, 58.3829),
    "bh-manama": (26.2285, 50.5860),
    "kw-kuwait-city": (29.3759, 47.9774),
    "jo-amman": (31.9454, 35.9284),
    "za-cape-town": (-33.9249, 18.4241),
    "za-johannesburg": (-26.2041, 28.0473),
    "ke-nairobi": (-1.2921, 36.8219),
    "rw-kigali": (-1.9403, 29.8739),
    "ma-casablanca": (33.5731, -7.5898),
    "mu-port-louis": (-20.1609, 57.5012),
    "bw-gaborone": (-24.6282, 25.9231),
    "na-windhoek": (-22.5609, 17.0658),
    "gh-accra": (5.6037, -0.1870),
    "sn-dakar": (14.7167, -17.4677),
    "nz-auckland": (-36.8485, 174.7633),
    "nz-wellington": (-41.2865, 174.7762),
    "au-melbourne": (-37.8136, 144.9631),
    "au-sydney": (-33.8688, 151.2093),
    "fj-suva": (-18.1416, 178.4419),
}


def fetch_openaq_locations(lat: float, lon: float, radius_m: int = 25000) -> list[dict]:
    """Fetch monitoring locations near coordinates from OpenAQ v3."""
    params = {
        "coordinates": f"{lat},{lon}",
        "radius": radius_m,
        "limit": 100,
        "order_by": "lastUpdated",
        "sort_order": "desc",
    }
    url = f"{OPENAQ_BASE}/locations?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return data.get("results", [])
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        print(f"  Warning: OpenAQ request failed: {exc}")
        return []


def extract_pm25_annual(locations: list[dict]) -> tuple[float | None, str | None]:
    """
    Extract PM2.5 annual average from OpenAQ location data.
    Uses the most recent measurements from PM2.5-reporting stations.
    Returns (pm25_ug_m3, source_date) or (None, None).
    """
    pm25_values: list[float] = []
    latest_date: str | None = None
    source_ids: list[int] = []

    for loc in locations:
        sensors = loc.get("sensors", [])
        for sensor in sensors:
            param = sensor.get("parameter", {})
            if param.get("name", "").lower() in ("pm25", "pm2.5"):
                summary = sensor.get("summary", {})
                avg = summary.get("avg")
                if avg is not None and avg > 0:
                    pm25_values.append(avg)
                    source_ids.append(loc.get("id", 0))
                    last_updated = loc.get("datetimeLast", {}).get("utc", "")
                    if last_updated and (latest_date is None or last_updated > latest_date):
                        latest_date = last_updated

    if not pm25_values:
        return None, None

    # Use median of station averages for robustness
    pm25_values.sort()
    n = len(pm25_values)
    median = (
        pm25_values[n // 2]
        if n % 2 == 1
        else (pm25_values[n // 2 - 1] + pm25_values[n // 2]) / 2
    )

    date_str = latest_date[:10] if latest_date else date.today().isoformat()
    return round(median, 2), date_str


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("OpenAQ PM2.5 Ingestion for SLIC Index")
    print(f"Cities to process: {len(CITY_COORDS)}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    results: list[dict[str, str]] = []
    success_count = 0
    skip_count = 0

    for city_id, (lat, lon) in sorted(CITY_COORDS.items()):
        # Check if already has non-OpenAQ data (don't overwrite Tier 1/2/3)
        existing = existing_by_key.get((city_id, "clean_air_raw"), {})
        existing_provider = existing.get("provider_id", "").strip()
        if existing_provider and existing_provider not in ("openaq", ""):
            print(f"  {city_id}: skipping (has {existing_provider} data)")
            skip_count += 1
            continue

        print(f"  {city_id}: fetching ({lat:.2f}, {lon:.2f})...", end=" ")

        locations = fetch_openaq_locations(lat, lon)
        pm25, source_date = extract_pm25_annual(locations)

        if pm25 is None:
            print("no PM2.5 data")
            continue

        station_count = len([
            loc for loc in locations
            for s in loc.get("sensors", [])
            if s.get("parameter", {}).get("name", "").lower() in ("pm25", "pm2.5")
        ])

        print(f"PM2.5 = {pm25} µg/m³ ({station_count} stations)")

        results.append({
            "city_id": city_id,
            "field": "clean_air_raw",
            "value": str(pm25),
            "provider_id": "openaq",
            "source_url": f"https://api.openaq.org/v3/locations?coordinates={lat},{lon}&radius=25000",
            "source_title": f"OpenAQ PM2.5 median ({station_count} stations within 25km)",
            "source_date": source_date or date.today().isoformat(),
            "notes": f"auto_ingest=openaq_v3; stations={station_count}; unit=µg/m³; metric=median_of_station_averages",
        })
        success_count += 1

        # Rate limiting: ~2 requests per second
        time.sleep(0.5)

    print()
    print(f"Results: {success_count} cities with data, {skip_count} skipped (existing)")

    if dry_run:
        print("\nDRY RUN — no files modified.")
        for r in results:
            print(f"  {r['city_id']}: {r['value']} µg/m³")
        return 0

    # Merge into existing city_inputs.csv
    updates = 0
    for result in results:
        key = (result["city_id"], "clean_air_raw")
        if key in existing_by_key:
            row = existing_by_key[key]
            row["value"] = result["value"]
            row["provider_id"] = result["provider_id"]
            row["source_url"] = result["source_url"]
            row["source_title"] = result["source_title"]
            row["source_date"] = result["source_date"]
            row["notes"] = result["notes"]
            updates += 1
        else:
            # Find the city's other rows to get display_name, country, cohort
            city_row = next(
                (r for r in existing_rows if r.get("city_id") == result["city_id"]),
                None,
            )
            if city_row:
                new_row = {field: "" for field in CITY_INPUT_FIELDS}
                new_row["city_id"] = result["city_id"]
                new_row["display_name"] = city_row.get("display_name", "")
                new_row["country"] = city_row.get("country", "")
                new_row["cohort"] = city_row.get("cohort", "")
                new_row["field"] = "clean_air_raw"
                new_row["label"] = "Clean air (PM2.5)"
                new_row["pillar"] = "viability"
                new_row["required_for_ranking"] = "yes"
                new_row["value"] = result["value"]
                new_row["provider_id"] = result["provider_id"]
                new_row["source_url"] = result["source_url"]
                new_row["source_title"] = result["source_title"]
                new_row["source_date"] = result["source_date"]
                new_row["notes"] = result["notes"]
                existing_rows.append(new_row)
                updates += 1

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {updates} clean_air_raw values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
