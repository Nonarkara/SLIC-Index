from __future__ import annotations

import json
from datetime import datetime, timezone

from audit_ranking_math import ROOT, extract_workbook_weights, run_validator
from verified_source_pipeline import (
    apply_source_pack_to_workbook,
    build_city_integrity_watchlist,
    compute_ranked_rows,
    prepare_verified_source_pack,
    source_pack_completion_summary,
    validate_source_pack,
)

OUTPUT_PATH = ROOT / "src" / "data" / "publishedRankingData.json"


def write_export() -> int:
    prepare_verified_source_pack(force=False)

    validator_ok, validator_output = run_validator()
    validation = validate_source_pack()
    weights = extract_workbook_weights()

    issues: list[str] = []
    if not validator_ok:
        issues.append(f"Workbook validation failed: {validator_output}")

    if validation.issues:
        issues.extend(validation.issues)

    if not validation.issues:
        apply_source_pack_to_workbook(validation)

    watchlist = build_city_integrity_watchlist(validation)
    rows = compute_ranked_rows(validation) if not validation.issues else []
    if not rows:
        issues.append(
            "Verified source pack does not currently produce any ranked city rows: "
            f"{source_pack_completion_summary(validation)}"
        )

    payload = {
        "publishable": validator_ok and not validation.issues and bool(rows),
        "status": "published" if validator_ok and not validation.issues and rows else "reranking",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "canonicalWeights": weights,
        "qualifiedCityCount": sum(1 for row in watchlist if row["qualification_status"] == "Qualified"),
        "integrityIssueCount": validation.stats.get("integrity_issue_count", 0),
        "validCountryRowCount": validation.stats["country_values"],
        "validCityRowCount": validation.stats["city_values"],
        "issues": issues,
        "cities": rows,
    }

    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)}")
    print(f"publishable={payload['publishable']} rows={len(rows)}")
    print(f"- Source-pack completion: {source_pack_completion_summary(validation)}")
    if issues:
        for issue in issues:
            print(f"- {issue}")
    return 0


if __name__ == "__main__":
    raise SystemExit(write_export())
