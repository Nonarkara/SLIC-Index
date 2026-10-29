#!/usr/bin/env python3
"""Reconcile publication metadata with exact source-register matches, not guesses."""
import argparse
import csv
import hashlib
import io
import json
import re
from collections import Counter, defaultdict
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path


def number(value):
    if value is None or isinstance(value, bool) or str(value).strip() == "":
        return None
    try:
        result = Decimal(str(value))
        return result if result.is_finite() else None
    except InvalidOperation:
        return None


def input_records(publication):
    for city in publication["cities"]:
        for metric_key, metric in city.get("metrics", {}).items():
            catalog = publication["metricCatalog"][metric_key]
            if catalog.get("inputKey"):
                yield city, metric_key, None, catalog["inputKey"], metric
            else:
                for component in metric.get("components", []):
                    yield city, metric_key, component["key"], component["key"], component


def read_aliases(root):
    """Declared second names for the same measurement.

    An alias says only that two field names denote one measurement. It is not
    permission to match a row that holds a different number: the value, the
    source URL and the source title must still match exactly, so a wrong alias
    can fail to resolve (and be reported as unregistered) but can never make an
    unverified figure look registered.
    """
    path = root / "data/verified_sources/field_aliases.csv"
    if not path.exists():
        return {}
    aliases = {}
    with open(path, encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            key = row.get("publication_input_key", "").strip()
            target = row.get("register_field", "").strip()
            if key and target:
                aliases[key] = target
    return aliases


def measured(rows):
    """Register rows that actually carry a value.

    The registers keep a placeholder row for every city and field, so a row
    with no value is an empty slot rather than a measurement. Such a row must
    not shadow the populated row that sits one level up, or the input reads
    as a value-mismatch against an empty cell instead of matching the real
    country figure.
    """
    return [(line, row) for line, row in rows if row.get("value", "").strip() != ""]


def read_exemptions(root):
    """Inputs the register deliberately does not claim.

    A declared exemption is a statement that the figure cannot be re-read
    from the cited source. It is not a failure: it is a hole that has been
    found and written down rather than one that nobody mentions.
    """
    path = root / "data/verified_sources/register_exemptions.csv"
    if not path.exists():
        return {}
    exemptions = {}
    with open(path, encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            key = (row.get("city_id", "").strip(), row.get("input_key", "").strip())
            if all(key):
                exemptions[key] = row.get("reason", "").strip()
    return exemptions


def reconcile(publication, register_text, apply=False, country_register_text="", aliases=None, exemptions=None):
    aliases = aliases or {}
    exemptions = exemptions or {}
    index = defaultdict(list)
    for line, row in enumerate(csv.DictReader(io.StringIO(register_text)), 2):
        index[(row["city_id"], row["field"])].append((line, row))
    country_index = defaultdict(list)
    for line, row in enumerate(csv.DictReader(io.StringIO(country_register_text)), 2):
        country_index[(row["country"], row["field"])].append((line, row))
    entries, violations = [], []
    corrections = 0
    for city, key, component, field, detail in input_records(publication):
        if detail.get("raw") is None:
            continue
        exemption = exemptions.get((city["cityId"], field))
        if exemption:
            entries.append({
                "cityId": city["cityId"], "metricKey": key, "componentKey": component,
                "inputKey": field, "raw": detail["raw"], "dataLevel": detail.get("dataLevel"),
                "sourceUrl": detail.get("sourceUrl", ""), "registerStatus": "exempt",
                "registerFile": None, "registerRow": None, "registeredSourceDate": None,
                "registeredNationalProxy": False, "resolvedViaAlias": False,
                "exemptionReason": exemption,
            })
            continue
        rows = measured(index.get((city["cityId"], field), []))
        register_file = "city_inputs.csv" if rows else None
        # Never use a national row to date a city/derived input or hide a conflicting city row.
        if not rows and detail.get("dataLevel") == "national":
            rows = measured(country_index.get((city["country"], field), []))
            register_file = "country_context.csv" if rows else None
        aliased = False
        if not rows:
            alias_field = aliases.get(field)
            if alias_field:
                if detail.get("dataLevel") == "national":
                    aliased_rows = measured(country_index.get((city["country"], alias_field), []))
                    aliased_file = "country_context.csv"
                else:
                    aliased_rows = measured(index.get((city["cityId"], alias_field), []))
                    aliased_file = "city_inputs.csv"
                if aliased_rows:
                    rows = aliased_rows
                    register_file = aliased_file
                    aliased = True
        row_number, row = rows[0] if len(rows) == 1 else (None, None)
        status = "matched"
        if not rows:
            status = "unregistered"
        elif len(rows) != 1:
            status = "ambiguous"
        elif number(detail["raw"]) is None or number(detail["raw"]) != number(row["value"]):
            status = "value-mismatch"
        elif register_file == "country_context.csv" and row.get("source_scope", "").strip().lower() not in ("national", "international"):
            # A country row may carry this country's own figure from an
            # international series (World Bank and friends), which is still a
            # country-level observation. A row whose scope is city, metro or
            # regional describes a narrower geography and must not stand in
            # for a national claim.
            status = "scope-mismatch"
        elif not detail.get("sourceUrl", "").strip() or not detail.get("source", "").strip() or detail["sourceUrl"].strip() != row["source_url"].strip() or detail["source"].strip() != row["source_title"].strip():
            status = "source-mismatch"

        registered_date = None
        national_proxy = False
        if status == "matched":
            declarations = {value.strip() for value in re.findall(r"(?:^|;)\s*country_proxy=([^;]+)", row["notes"])}
            if declarations and declarations != {city["country"]}:
                status = "proxy-conflict"
                violations.append(f"{city['cityId']}/{key}/{field}: conflicting country proxy declarations")
            national_proxy = declarations == {city["country"]}
        if status == "matched":
            if national_proxy and detail.get("dataLevel") == "city":
                if apply:
                    detail["dataLevel"] = "national"
                    corrections += 1
                else:
                    violations.append(f"{city['cityId']}/{key}/{field}: registered national proxy labelled city")
            candidate = row["source_date"].strip()
            try:
                parsed = date.fromisoformat(candidate)
                if parsed.isoformat() == candidate and candidate <= publication["updatedAt"][:10]:
                    registered_date = candidate
            except ValueError:
                pass
        # Unmatched inputs never inherit dates from a similar or outdated row.
        if apply and status != "proxy-conflict":
            if registered_date:
                detail["registeredSourceDate"] = registered_date
            else:
                detail.pop("registeredSourceDate", None)
        elif not apply and detail.get("registeredSourceDate") != registered_date:
            violations.append(f"{city['cityId']}/{key}/{field}: registered source date disagrees")

        entries.append({
            "cityId": city["cityId"], "metricKey": key, "componentKey": component,
            "inputKey": field, "raw": detail["raw"], "dataLevel": detail.get("dataLevel"),
            "sourceUrl": detail.get("sourceUrl", ""), "registerStatus": status,
            "registerFile": register_file, "registerRow": row_number, "registeredSourceDate": registered_date,
            "registeredNationalProxy": national_proxy, "resolvedViaAlias": aliased,
        })
    return entries, violations, corrections


def serialise(value):
    return json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--apply", action="store_true", help="Correct only exact-match metadata; then run rescore and regenerate exports")
    parser.add_argument("--check", action="store_true", help="Fail on metadata or generated-artifact drift")
    args = parser.parse_args()
    if args.apply and args.check:
        parser.error("--apply and --check are mutually exclusive")
    bundle = args.root / "src/data/publishedRankingData.json"
    source = args.root / "data/verified_sources/city_inputs.csv"
    country_source = args.root / "data/verified_sources/country_context.csv"
    publication_bytes = bundle.read_bytes()
    register_bytes = source.read_bytes()
    country_bytes = country_source.read_bytes()
    publication = json.loads(publication_bytes)
    aliases = read_aliases(args.root)
    exemptions = read_exemptions(args.root)
    entries, violations, corrections = reconcile(publication, register_bytes.decode("utf-8-sig"), args.apply, country_bytes.decode("utf-8-sig"), aliases, exemptions)
    if violations:
        print("FAIL source provenance: " + "\n".join(violations[:12]))
        print(f"{len(violations)} metadata mismatch(es). Review then run --apply, rescore, and rebuild.")
        return 1
    if args.apply:
        bundle.write_text(serialise(publication))
        print(f"Corrected {corrections} city-labelled national proxies; registered dates attached only to exact matches.")
        print("Run npm run rescore, node scripts/update-csv.mjs, and this script again before publishing.")
        return 0

    statuses = Counter(entry["registerStatus"] for entry in entries)
    dated = [entry["registeredSourceDate"] for entry in entries if entry["registeredSourceDate"]]
    alias_path = args.root / "data/verified_sources/field_aliases.csv"
    summary = {
        "schemaVersion": 3, "publicationGeneratedAt": publication["updatedAt"],
        "sourceRegisters": ["data/verified_sources/city_inputs.csv", "data/verified_sources/country_context.csv"],
        "publicationSha256": hashlib.sha256(publication_bytes).hexdigest(),
        "registerSha256": {"city_inputs.csv": hashlib.sha256(register_bytes).hexdigest(), "country_context.csv": hashlib.sha256(country_bytes).hexdigest()},
        "fieldAliases": aliases,
        "aliasResolvedInputCount": sum(entry["resolvedViaAlias"] for entry in entries),
        "inputCount": len(entries), "datedInputCount": len(dated),
        "undatedInputCount": len(entries) - len(dated),
        "registerStatusCounts": {key: statuses[key] for key in ["matched", "exempt", "unregistered", "ambiguous", "value-mismatch", "source-mismatch", "proxy-conflict", "scope-mismatch"]},
        "exemptInputCount": statuses["exempt"],
        "exemptions": {f"{city}|{field}": reason for (city, field), reason in exemptions.items()},
        "earliestRegisteredDate": min(dated) if dated else None,
        "latestRegisteredDate": max(dated) if dated else None,
        "registeredYearCounts": dict(sorted(Counter(item[:4] for item in dated).items())),
        "nationalProxyInputCount": sum(entry["registeredNationalProxy"] for entry in entries),
        "dateMeaning": "Dates recorded in the source registers; not independently verified observation periods. Exact value, source URL, source title and unambiguous city/input identity must match; explicitly national inputs may match their own country's national-scope register row when no city row exists. A declared field alias names a second field for the same measurement and still requires the value, source URL and source title to match exactly. Missing dates remain unknown.",
    }
    outputs = {
        args.root / "src/data/evidenceSummary.json": summary,
        args.root / "public/downloads/slic-evidence-register.json": {"summary": summary, "inputs": entries},
    }
    for destination, value in outputs.items():
        expected = serialise(value)
        if args.check:
            if not destination.exists() or destination.read_text() != expected:
                print(f"FAIL stale evidence artifact: {destination.relative_to(args.root)}")
                return 1
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(expected)
    print(f"PASS source provenance: {len(entries)} inputs; {len(dated)} registered dates; {len(entries) - len(dated)} unknown; {dict(statuses)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
