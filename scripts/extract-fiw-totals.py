#!/usr/bin/env python3
"""Extract Freedom in the World country totals from Freedom House's own workbook.

The index cites "Freedom House: Freedom in the World". Freedom House publishes
one workbook per edition, with every country's aggregate score for every
edition from 2003. That workbook is the primary source; this script turns it
into the small, reviewable CSV the register builder reads.

Two things matter here and both are checked:

  * the workbook is hashed, so a reader can prove the extract came from that
    exact file, and
  * the same edition is cross-read from a second, later workbook, so a silent
    change inside Freedom House's own files would be caught rather than
    copied.

Usage:
    python3 scripts/extract-fiw-totals.py --workbook path.xlsx [--edition 2024]
                            [--cross-check path2.xlsx] [--out data/verified_sources/sources]
"""
import argparse
import csv
import hashlib
import json
import sys
from datetime import date
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is required: pip3 install openpyxl")

ROOT = Path(__file__).resolve().parents[1]

# Freedom House writes the country name differently from the way the index
# names it. Only genuine synonyms are listed here — a territory that Freedom
# House does not score is NOT aliased onto its sovereign state here, because
# that is a proxy decision and belongs in the register, not in a name map.
NAME_ALIASES = {
    "united states of america": "united states",
    "ivory coast": "côte d'ivoire",
    "turkiye": "turkey",
    "türkiye": "turkey",
    "viet nam": "vietnam",
    "kyrgyz republic": "kyrgyzstan",
    "slovak republic": "slovakia",
    "czech republic": "czechia",
    "moldova, republic of": "moldova",
    "iran, islamic republic of": "iran",
    "syrian arab republic": "syria",
    "lao people s democratic republic": "laos",
    "micronesia, fed. sts. of": "micronesia",
    "burma": "myanmar",
    "congo, dem. rep. of the": "congo, the democratic republic of the",
    "congo, rep. of the": "congo",
    "cape verde": "cabo verde",
}

# Freedom House does not score every territory the index covers. These are
# listed so the extract records the absence explicitly instead of silently
# dropping the row; the register then has to decide, in the open, what to do.
NOT_SCORED = {"puerto rico"}


def norm(name):
    return str(name).strip().lower().replace("&", "and")


def canonical(name):
    key = norm(name)
    return NAME_ALIASES.get(key, key)


def sheet_for(workbook):
    names = workbook.sheetnames
    for candidate in names:
        if candidate.startswith("FIW06-"):
            return candidate
    raise SystemExit(f"no FIW06-* sheet in workbook; sheets are {names}")


def read_totals(workbook, edition):
    sheet = workbook[sheet_for(workbook)]
    rows = {}
    for row in sheet.iter_rows(values_only=True):
        if not row or not row[0] or row[3] is None:
            continue
        try:
            found = int(row[3])
        except (TypeError, ValueError):
            continue  # repeated header rows inside the sheet
        if found != edition:
            continue
        rows[canonical(row[0])] = {
            "freedom_house_name": str(row[0]).strip(),
            "edition": found,
            "status": row[4],
            "political_rights": row[12],
            "civil_liberties": row[17],
            "total": row[18],
        }
    return rows


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workbook", type=Path, required=True)
    parser.add_argument("--cross-check", type=Path)
    parser.add_argument("--edition", type=int, default=2024)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--retrieved", default=date.today().isoformat())
    parser.add_argument("--out", type=Path, default=ROOT / "data/verified_sources/sources")
    args = parser.parse_args()

    totals = read_totals(openpyxl.load_workbook(args.workbook, read_only=True, data_only=True), args.edition)

    disagreements = []
    if args.cross_check:
        cross = read_totals(openpyxl.load_workbook(args.cross_check, read_only=True, data_only=True), args.edition)
        for key, row in totals.items():
            other = cross.get(key)
            if other and other["total"] != row["total"]:
                disagreements.append({"country": key, "primary": row["total"], "cross_check": other["total"]})
        for key in cross:
            if key not in totals:
                disagreements.append({"country": key, "primary": None, "cross_check": cross[key]["total"]})

    args.out.mkdir(parents=True, exist_ok=True)
    csv_path = args.out / f"fiw{args.edition}-totals.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "country", "freedom_house_name", "edition", "status",
            "political_rights", "civil_liberties", "total",
        ])
        writer.writeheader()
        for key in sorted(totals):
            row = totals[key]
            writer.writerow({
                "country": key,
                "freedom_house_name": row["freedom_house_name"],
                "edition": row["edition"],
                "status": row["status"],
                "political_rights": row["political_rights"],
                "civil_liberties": row["civil_liberties"],
                "total": row["total"],
            })

    manifest = {
        "source": "Freedom House — Freedom in the World",
        "edition": args.edition,
        "sourceUrl": args.source_url,
        "sourceFile": args.workbook.name,
        "sourceFileSha256": sha256(args.workbook),
        "sourceFileBytes": args.workbook.stat().st_size,
        "retrievedAt": args.retrieved,
        "extractFile": csv_path.name,
        "extractSha256": sha256(csv_path),
        "countryCount": len(totals),
        "notScoredByProvider": sorted(NOT_SCORED),
        "crossCheck": (
            {
                "sourceFile": args.cross_check.name,
                "sourceFileSha256": sha256(args.cross_check),
                "disagreements": disagreements,
            }
            if args.cross_check
            else None
        ),
    }
    manifest_path = args.out / f"fiw{args.edition}-source.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"extracted {len(totals)} countries for edition {args.edition} -> {csv_path.relative_to(ROOT)}")
    print(f"  workbook sha256 {manifest['sourceFileSha256']}")
    print(f"  extract  sha256 {manifest['extractSha256']}")
    if args.cross_check:
        print(f"  cross-check disagreements: {len(disagreements)}")
        for row in disagreements[:10]:
            print(f"    {row}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
