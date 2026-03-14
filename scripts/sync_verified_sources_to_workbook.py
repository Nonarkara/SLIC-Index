from __future__ import annotations

from generate_slic_workbook import main as build_workbook
from verified_source_pipeline import (
    apply_source_pack_to_workbook,
    compute_ranked_rows,
    prepare_verified_source_pack,
    source_pack_completion_summary,
    validate_source_pack,
)


def main() -> int:
    build_workbook()
    prepare_verified_source_pack(force=False)
    validation = validate_source_pack()
    print("Verified source pack")
    print(f"- Completion: {source_pack_completion_summary(validation)}")

    if validation.issues:
        print("- Validation issues:")
        for issue in validation.issues:
            print(f"  * {issue}")
        return 1

    write_stats = apply_source_pack_to_workbook(validation)
    ranked_rows = compute_ranked_rows(validation)
    print(
        f"- Workbook synced: country_values_written={write_stats['country_values_written']} "
        f"city_values_written={write_stats['city_values_written']}"
    )
    print(f"- Ranked rows available: {len(ranked_rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
