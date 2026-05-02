#!/usr/bin/env python3
"""red-dot-strip.py — surgical removal of forbidden visual decoration in styles.css.

Removes:
  - every `box-shadow: ...;` line (Red Dot rule: hairline borders only)
  - every `backdrop-filter: ...;` and `-webkit-backdrop-filter: ...;` line (no glass)
  - every `text-shadow: ...;` line UNLESS the enclosing selector mentions
    photo / hero-photo / image / overlay / spotlight (photo-legibility OK)
  - the `.float-orb`, `.background-orb`, `.background-orb-left`, `.background-orb-right`
    rule blocks entirely
  - the `@keyframes float` animation (only used by .float-orb)

Reports (does not change):
  - every linear-gradient / radial-gradient occurrence with file:line + selector context
    (gradients need per-instance judgment; some are legitimate photo overlays)

Run from repo root:
    python3 scripts/red-dot-strip.py [--dry-run]
"""
from __future__ import annotations
import argparse
import re
from pathlib import Path

CSS = Path(__file__).resolve().parents[1] / "src" / "styles.css"

PHOTO_OK_TOKENS = ("photo", "hero-photo", "image", "overlay", "spotlight",
                   "city-photo", "leader-photo", "card-photo", "bg-image",
                   "leader-spotlight", "tier-spotlight")

BLOCKS_TO_DELETE = {
    ".float-orb",
    ".background-orb",
    ".background-orb-left",
    ".background-orb-right",
}
KEYFRAMES_TO_DELETE = {"float"}


def parse_blocks(lines: list[str]):
    """Yield (start, end_exclusive, header_text) for every top-level rule block."""
    depth = 0
    start = None
    for i, line in enumerate(lines):
        opens = line.count("{")
        closes = line.count("}")
        if depth == 0 and opens > 0:
            start = i
        depth += opens - closes
        if depth == 0 and start is not None and closes > 0:
            yield start, i + 1, lines[start].strip()
            start = None


def selector_for_line(lines: list[str], idx: int) -> str:
    """Walk back to the nearest opening brace and grab the selector."""
    j = idx
    depth_back = 0
    while j > 0:
        j -= 1
        depth_back += lines[j].count("}")
        depth_back -= lines[j].count("{")
        if depth_back < 0:
            break
    return lines[j].strip() if j >= 0 else ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    text = CSS.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    n_before = len(lines)

    # Pass 1: identify lines to delete (single-line property removals)
    to_delete: set[int] = set()
    text_shadow_kept: list[tuple[int, str]] = []
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        if stripped.startswith(("box-shadow:", "backdrop-filter:", "-webkit-backdrop-filter:")):
            to_delete.add(i)
            continue
        if stripped.startswith("text-shadow:"):
            sel = selector_for_line(lines, i).lower()
            if any(tok in sel for tok in PHOTO_OK_TOKENS):
                text_shadow_kept.append((i, sel))
                continue
            to_delete.add(i)

    # Pass 2: identify rule blocks to delete entirely
    block_deletes: list[tuple[int, int, str]] = []
    for start, end, header in parse_blocks(lines):
        first_token = header.split("{")[0].strip()
        # plain selectors
        for sel in BLOCKS_TO_DELETE:
            if first_token == sel or first_token.startswith(sel + ",") or first_token.endswith(", " + sel):
                block_deletes.append((start, end, first_token))
                break
        # keyframes
        m = re.match(r"@keyframes\s+([\w-]+)", first_token)
        if m and m.group(1) in KEYFRAMES_TO_DELETE:
            block_deletes.append((start, end, first_token))

    # Apply deletions: blocks first (range), then individual lines
    delete_ranges: list[tuple[int, int]] = [(s, e) for s, e, _ in block_deletes]
    keep_lines: list[str] = []
    block_iter = iter(sorted(delete_ranges))
    next_block = next(block_iter, None)
    i = 0
    while i < len(lines):
        if next_block and i == next_block[0]:
            i = next_block[1]
            next_block = next(block_iter, None)
            continue
        if i not in to_delete:
            keep_lines.append(lines[i])
        i += 1

    # Pass 3: collapse runs of >2 blank lines
    collapsed: list[str] = []
    blank = 0
    for line in keep_lines:
        if line.strip() == "":
            blank += 1
            if blank <= 1:
                collapsed.append(line)
        else:
            blank = 0
            collapsed.append(line)

    n_after = len(collapsed)
    removed = n_before - n_after

    # Pass 4: gradient report (no changes; just for review)
    gradient_re = re.compile(r"(linear-gradient|radial-gradient|repeating-linear-gradient)")
    gradient_report = []
    for i, line in enumerate(lines):
        if gradient_re.search(line):
            sel = selector_for_line(lines, i)
            gradient_report.append((i + 1, sel.strip(), line.strip()))

    if args.dry_run:
        print(f"DRY RUN — would remove {removed} lines ({n_before} → {n_after})")
        print(f"  - single-line property removals: {len(to_delete)}")
        print(f"  - block deletions: {len(block_deletes)}")
        for start, end, header in block_deletes:
            print(f"      {header}  (lines {start+1}–{end})")
        print(f"  - text-shadow KEPT (photo legibility): {len(text_shadow_kept)}")
        for line_idx, sel in text_shadow_kept:
            print(f"      L{line_idx+1}  {sel[:80]}")
    else:
        CSS.write_text("".join(collapsed), encoding="utf-8")
        print(f"Wrote {CSS} — removed {removed} lines ({n_before} → {n_after})")

    # Always emit the gradient report
    report_path = CSS.parent.parent / "scripts" / "gradients-to-review.txt"
    with report_path.open("w", encoding="utf-8") as f:
        f.write(f"# Gradient review — {len(gradient_report)} occurrences\n")
        f.write("# Decide: KEEP (photo overlay) or REMOVE (decoration).\n")
        f.write("# Workspace CLAUDE.md §11.6.2: only legitimate gradient is dark vertical\n")
        f.write("# overlay on a hero photograph for text legibility.\n\n")
        for line_no, sel, snippet in gradient_report:
            f.write(f"L{line_no}  selector: {sel[:100]}\n")
            f.write(f"  → {snippet[:160]}\n\n")
    print(f"Gradient report: {report_path}")
    print(f"  · {len(gradient_report)} gradient occurrences flagged for manual review")


if __name__ == "__main__":
    main()
