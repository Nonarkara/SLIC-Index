#!/usr/bin/env python3
"""Fail when personal emails or phone numbers are present in the working tree.

Public organisation inboxes and published office switchboards are allowlisted.
Placeholder addresses used in code samples are allowlisted. Any other email is
treated as personal contact information and fails the check, including consumer
mailboxes and named individual addresses.

Git history is not scanned. Removing a contact from the current tree does not
remove it from older commits.
"""

from __future__ import annotations

import bisect
import contextlib
import io
import re
import sys
import warnings
import zipfile
from pathlib import Path

# Consumer and personal-mail domains. Stored without "@" so this file does not
# itself contain an address the scanner would flag.
PERSONAL_DOMAINS = (
    "gmail.com",
    "googlemail.com",
    "hotmail.com",
    "hotmail.co.uk",
    "hotmail.co.th",
    "outlook.com",
    "live.com",
    "live.co.uk",
    "yahoo.com",
    "yahoo.co.uk",
    "yahoo.co.jp",
    "yahoo.co.id",
    "yahoo.com.ph",
    "yahoo.com.sg",
    "ymail.com",
    "icloud.com",
    "me.com",
    "mac.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "pm.me",
    "gmx.com",
    "gmx.net",
    "qq.com",
    "163.com",
    "126.com",
)

# Published organisation contacts. Named individual mailboxes are not listed.
ORG_EMAILS = {
    "info@smartcitythailand.or.th",
    "scp@depa.or.th",
    "doss@depa.or.th",
    "info@eeco.or.th",
    # OCR in the UK handbook splits this office address before ".th".
    "info@eeco.or",
    "info@khonkaenthinktank.com",
    "thailand.dit@fcdo.gov.uk",
    "info.bangkok@fcdo.gov.uk",
    "bangkok@fcdo.gov.uk",
    "psi@nationalarchives.gov.uk",
    "info@cea.or.th",
    "dki@jakarta.go.id",
    "vanthu@hanoi.gov.vn",
}

PLACEHOLDER_DOMAINS = {
    "example.com",
    "example.org",
    "example.net",
    "yourcity.gov",
    "invalid",
}

# Digit forms of published organisation switchboards:
# Smart City Thailand Office, and Nakhon Si Thammarat City Municipality.
ORG_PHONES = ("6620262333", "6675342880")

SKIP_DIRS = {".git", "node_modules", ".vercel", "tmp", ".claude"}
# The knowledge rack keeps a raw copy of every source document in
# `library/raw/`. It is a byte-identical duplicate of `inbox/`, which is
# scanned, so scanning it again extracts the text of 142MB of PDFs a second
# time to arrive at exactly the same findings. The duplication is proved
# byte-for-byte by scripts/check-knowledge-rack.mjs, so the skip cannot hide
# anything the inbox scan does not already see.
SKIP_RELATIVE_PREFIXES = ("knowledge-rack/library",)
TEXT_EXTENSIONS = {
    ".txt",
    ".md",
    ".json",
    ".jsonl",
    ".csv",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".html",
    ".css",
    ".yml",
    ".yaml",
    ".py",
    ".svg",
    ".xml",
}
OFFICE_EXTENSIONS = {".docx", ".pptx", ".xlsx"}

EMAIL_RE = re.compile(
    r"(?<![A-Za-z0-9._%+\-])"
    r"[A-Za-z0-9][A-Za-z0-9._%+\-]{0,63}"
    r"@"
    r"[A-Za-z0-9](?:[A-Za-z0-9\-]{0,62}\.)+"
    r"[A-Za-z]{2,24}"
    r"(?![A-Za-z0-9])"
)
INTL_PHONE_RE = re.compile(r"\+\d{1,3}(?:[\s.\-]*\d){6,14}")
LABELED_PHONE_RE = re.compile(
    r"(?i)(?:telephone|tel|phone|mobile|fax|whatsapp|hotline|โทร[^\n]{0,12})"
    r"\s*[:：]\s*\+?\d(?:[\s.\-]*\d){6,14}"
)
EXT_RE = re.compile(r"(?i)\b(?:ext\.?|extension|ต่อ)\b.*$")


def classify_email(address: str) -> str | None:
    lowered = address.lower()
    domain = lowered.rsplit("@", 1)[-1]
    if domain in PLACEHOLDER_DOMAINS:
        return None
    if any(domain == item or domain.endswith("." + item) for item in PERSONAL_DOMAINS):
        return "personal-email"
    if lowered in ORG_EMAILS:
        return None
    return "personal-email"


def phone_digits(raw: str) -> str:
    trimmed = EXT_RE.sub("", raw)
    return re.sub(r"\D", "", trimmed)


def is_allowed_phone(digits: str) -> bool:
    if len(digits) < 8:
        return True
    return any(digits == allowed or digits.startswith(allowed) for allowed in ORG_PHONES)


def normalize_address(text: str, match: re.Match[str]) -> str:
    """Drop a JSON escape prefix such as the n in '\\ninfo@...'."""
    address = match.group(0)
    if match.start() > 0 and text[match.start() - 1] == "\\" and address[0] in "nrt":
        rest = address[1:]
        if "@" in rest:
            return rest
    return address


def find_in_text(text: str, source: str, scan_phones: bool = True) -> list[str]:
    """Report personal contacts in a piece of text.

    The line number is resolved once, at the end, and only when there is
    something to report. Two costs were paid before: the newline offsets were
    computed for every megabyte of every document, and the phone patterns ran
    over the raw bytes of every PDF — where a greedy numeric pattern over
    binary data backtracks badly. Neither was needed to decide that a
    document is clean.
    """
    hits: list[tuple[int, str]] = []
    for match in EMAIL_RE.finditer(text):
        address = normalize_address(text, match)
        kind = classify_email(address)
        if kind:
            hits.append((match.start(), f"{kind}: {address}"))
    if scan_phones:
        seen_phones: set[str] = set()
        for pattern in (INTL_PHONE_RE, LABELED_PHONE_RE):
            for match in pattern.finditer(text):
                digits = phone_digits(match.group(0))
                if is_allowed_phone(digits) or digits in seen_phones:
                    continue
                seen_phones.add(digits)
                hits.append((match.start(), f"personal-phone: {match.group(0).strip()}"))
    if not hits:
        return []
    newlines = [index for index, char in enumerate(text) if char == "\n"]
    return [
        f"{source}:{bisect.bisect_left(newlines, position) + 1}: {message}"
        for position, message in hits
    ]


def iter_files(root: Path):
    root = root.resolve()
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(root)
        if any(part in SKIP_DIRS for part in relative.parts):
            continue
        if any(str(relative).startswith(prefix) for prefix in SKIP_RELATIVE_PREFIXES):
            continue
        yield path


def scan_office(path: Path) -> list[str]:
    findings: list[str] = []
    try:
        with zipfile.ZipFile(path) as archive:
            for name in archive.namelist():
                if not name.endswith((".xml", ".txt", ".rels")):
                    continue
                text = archive.read(name).decode("utf-8", "replace")
                findings.extend(find_in_text(text, f"{path}!{name}"))
    except (zipfile.BadZipFile, OSError) as exc:
        findings.append(f"{path}: unreadable-office: {exc}")
    return findings


def scan_pdf(path: Path) -> list[str]:
    findings: list[str] = []
    try:
        from pypdf import PdfReader
    except ImportError:
        return [
            "pypdf is required to scan PDF text. Install it with: python3 -m pip install pypdf"
        ]
    warnings.filterwarnings("ignore")
    sink = io.StringIO()
    try:
        with contextlib.redirect_stdout(sink), contextlib.redirect_stderr(sink):
            reader = PdfReader(str(path))
            pages = [(index, page.extract_text() or "") for index, page in enumerate(reader.pages, start=1)]
        for index, text in pages:
            findings.extend(find_in_text(text, f"{path}:page {index}"))
    except Exception as exc:  # noqa: BLE001 - report the file and keep scanning
        findings.append(f"{path}: unreadable-pdf: {exc}")
    raw = path.read_bytes().decode("latin1", "replace")
    findings.extend(
        item
        for item in find_in_text(raw, f"{path}:bytes", scan_phones=False)
        if "personal-email" in item
        and any("@" + domain in item.lower() for domain in PERSONAL_DOMAINS)
    )
    return findings


def scan(root: Path) -> list[str]:
    findings: list[str] = []
    for path in iter_files(root):
        suffix = path.suffix.lower()
        if suffix in TEXT_EXTENSIONS:
            text = path.read_text(encoding="utf-8", errors="replace")
            findings.extend(find_in_text(text, str(path)))
        elif suffix == ".pdf":
            findings.extend(scan_pdf(path))
        elif suffix in OFFICE_EXTENSIONS:
            findings.extend(scan_office(path))
    return findings


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    if not root.exists():
        print(f"Path not found: {root}", file=sys.stderr)
        return 2
    findings = scan(root)
    if not findings:
        print(f"No personal emails or phone numbers in {root}")
        return 0
    print(f"{len(findings)} personal contact finding(s) in {root}:")
    for item in findings:
        print(item)
    return 1


if __name__ == "__main__":
    sys.exit(main())
