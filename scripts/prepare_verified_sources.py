from __future__ import annotations

from source_guides import ensure_source_guide_files
from verified_source_pipeline import prepare_verified_source_pack


def main() -> int:
    paths = prepare_verified_source_pack(force=False)
    paths.update(ensure_source_guide_files(force=False))
    print("Verified source pack ready")
    for label, path in paths.items():
        print(f"- {label}: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
