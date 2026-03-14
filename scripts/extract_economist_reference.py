from __future__ import annotations

import csv
import re
import unicodedata
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from pypdf import PdfReader

from verified_source_pipeline import ROOT


PDF_PATH = Path("/Users/non/Downloads/The World in Numbers _ The Economist.pdf")
OUTPUT_PATH = ROOT / "output" / "spreadsheet" / "economist_reference.csv"
SOURCE_LABEL = "The World in Numbers | The Economist"
REVIEW_STATUS = "needs_review"
FIELDNAMES = [
    "country",
    "page_number",
    "gdp_growth_pct",
    "gdp_per_person_usd",
    "gdp_per_person_ppp_usd",
    "inflation_pct",
    "budget_balance_pct_gdp",
    "population_millions",
    "raw_block_text",
    "parse_confidence",
    "review_status",
    "source_label",
    "source_date",
]

NOISE_LINES = {
    "The World in Numbers | The Economist",
    "Try The Economist for free",
    "Free trial",
    "2026 in person",
    "the economist",
    "About",
    "Reuse our content",
    "Subscribe",
    "Economist Enterprise",
    "SecureDrop",
    "the economist group",
    "The Economist Group",
    "Economist Intelligence",
    "Economist Impact",
    "Economist Impact Events",
    "Economist Education Courses",
    "contact",
    "Help and support",
    "Advertise",
    "Press centre",
    "careers",
    "Working here",
    "Executive Jobs",
}
NON_COUNTRY_HEADINGS = {
    "Europe",
    "Asia-Pacific",
    "North America",
    "Latin America",
    "Middle East and Africa",
}
NOISE_PREFIXES = (
    "Explore all of our independent journalism",
    "https://www.economist.com/interactive/twa-country-reports",
    "Figures for 2026 and beyond",
    "Figures for 2025 are estimates",
    "Dollar GDP calculated using 2026 forecasts",
    "Most figures simplified by rounding",
    "Source: Economist Intelligence",
    "Get The Economist app on",
    "To enhance your experience and ensure our website runs smoothly",
    "Terms of use",
    "Registered in England and Wales",
)
DATE_STAMP_RE = re.compile(r"^\d{1,2}/\d{1,2}/\d{2}, \d{1,2}:\d{2} [AP]M$")
PAGE_COUNTER_RE = re.compile(r"^\d+/\d+$")
GDP_GROWTH_RE = re.compile(r"\bGDP growth\s+(-?\d+(?:\.\d+)?)%")
GDP_PER_PERSON_RE = re.compile(r"\bGDP per person\s+\$([\d,]+)\s+\(PPP:\s+\$([\d,]+)\)")
INFLATION_RE = re.compile(r"\bInflation\s+(-?\d+(?:\.\d+)?)%")
BUDGET_BALANCE_RE = re.compile(r"\bBudget balance\s+(-?\d+(?:\.\d+)?)% of GDP")
POPULATION_RE = re.compile(r"\bPopulation\s+(\d+(?:\.\d+)?)m\b")


@dataclass(frozen=True)
class DocumentLine:
    page_number: int
    text: str


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value or "")
    normalized = normalized.replace("\u00a0", " ")
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def is_noise_line(line: str) -> bool:
    if not line:
        return True
    if line in NOISE_LINES:
        return True
    if line in NON_COUNTRY_HEADINGS:
        return True
    if DATE_STAMP_RE.fullmatch(line):
        return True
    if PAGE_COUNTER_RE.fullmatch(line):
        return True
    return any(line.startswith(prefix) for prefix in NOISE_PREFIXES)


def extract_document_lines(pdf_path: Path) -> list[DocumentLine]:
    reader = PdfReader(str(pdf_path))
    document_lines: list[DocumentLine] = []
    for page_index, page in enumerate(reader.pages, start=1):
        raw_text = page.extract_text() or ""
        for raw_line in raw_text.splitlines():
            line = normalize_text(raw_line)
            if is_noise_line(line):
                continue
            document_lines.append(DocumentLine(page_number=page_index, text=line))
    return document_lines


def looks_like_country_name(line: str) -> bool:
    if line in NON_COUNTRY_HEADINGS or not line:
        return False
    if len(line) > 40:
        return False
    if any(character.isdigit() for character in line):
        return False
    if line.startswith(("to watch", "Source:", "Figures for", "Get The Economist")):
        return False
    return bool(re.fullmatch(r"[A-Z][A-Za-z'().,& -]+", line))


def find_country_starts(document_lines: list[DocumentLine]) -> list[int]:
    starts: list[int] = []
    for index in range(len(document_lines) - 1):
        current = document_lines[index].text
        next_line = document_lines[index + 1].text
        if looks_like_country_name(current) and next_line.startswith("GDP growth"):
            starts.append(index)
    return starts


def extract_match(pattern: re.Pattern[str], text: str, group: int = 1) -> str:
    match = pattern.search(text)
    if match is None:
        return ""
    return match.group(group).replace(",", "")


def confidence_for_block(block_lines: list[DocumentLine], metrics: dict[str, str]) -> str:
    pages = {line.page_number for line in block_lines}
    metric_count = sum(bool(value) for value in metrics.values())
    if len(pages) > 1:
        return "low"
    if metric_count == len(metrics):
        return "high"
    if metric_count >= 3:
        return "medium"
    return "low"


def extract_reference_rows(pdf_path: Path = PDF_PATH) -> list[dict[str, str]]:
    if not pdf_path.exists():
        raise FileNotFoundError(f"Economist PDF not found: {pdf_path}")

    document_lines = extract_document_lines(pdf_path)
    starts = find_country_starts(document_lines)
    source_date = datetime.fromtimestamp(pdf_path.stat().st_mtime).date().isoformat()

    rows: list[dict[str, str]] = []
    for position, start_index in enumerate(starts):
        end_index = starts[position + 1] if position + 1 < len(starts) else len(document_lines)
        block_lines = document_lines[start_index:end_index]
        country = block_lines[0].text
        raw_block_text = "\n".join(line.text for line in block_lines)

        metrics = {
            "gdp_growth_pct": extract_match(GDP_GROWTH_RE, raw_block_text),
            "gdp_per_person_usd": extract_match(GDP_PER_PERSON_RE, raw_block_text, group=1),
            "gdp_per_person_ppp_usd": extract_match(GDP_PER_PERSON_RE, raw_block_text, group=2),
            "inflation_pct": extract_match(INFLATION_RE, raw_block_text),
            "budget_balance_pct_gdp": extract_match(BUDGET_BALANCE_RE, raw_block_text),
            "population_millions": extract_match(POPULATION_RE, raw_block_text),
        }

        rows.append(
            {
                "country": country,
                "page_number": str(block_lines[0].page_number),
                **metrics,
                "raw_block_text": raw_block_text,
                "parse_confidence": confidence_for_block(block_lines, metrics),
                "review_status": REVIEW_STATUS,
                "source_label": SOURCE_LABEL,
                "source_date": source_date,
            }
        )

    return rows


def write_reference_csv(rows: list[dict[str, str]], output_path: Path = OUTPUT_PATH) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)
    return output_path


def build_reference_csv(pdf_path: Path = PDF_PATH, output_path: Path = OUTPUT_PATH) -> tuple[Path, list[dict[str, str]]]:
    rows = extract_reference_rows(pdf_path)
    return write_reference_csv(rows, output_path), rows


def main() -> int:
    output_path, rows = build_reference_csv()
    high_confidence = sum(1 for row in rows if row["parse_confidence"] == "high")
    low_confidence = sum(1 for row in rows if row["parse_confidence"] == "low")

    print(f"Wrote {output_path.relative_to(ROOT)}")
    print(f"- Extracted country blocks: {len(rows)}")
    print(f"- High confidence: {high_confidence}")
    print(f"- Low confidence: {low_confidence}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
