from __future__ import annotations

import json
import math
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHUNKS_PATH = ROOT / "knowledge-rack" / "catalog" / "chunks.jsonl"


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def title_variants(title: str) -> list[str]:
    lower = title.lower().strip()
    trimmed = re.sub(r"^\[[^\]]+\]\s*", "", lower).strip()
    return [variant for variant in {lower, trimmed} if variant]


def load_chunks() -> list[dict[str, object]]:
    if not CHUNKS_PATH.exists():
        return []
    return [json.loads(line) for line in CHUNKS_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]


def score_chunks(question: str, chunks: list[dict[str, object]]) -> list[tuple[float, dict[str, object]]]:
    query_tokens = tokenize(question)
    query_lower = question.lower()
    if not query_tokens:
        return []

    doc_freq: Counter[str] = Counter()
    chunk_tokens: list[list[str]] = []
    for chunk in chunks:
        tokens = tokenize(str(chunk["text"]))
        chunk_tokens.append(tokens)
        for token in set(tokens):
            doc_freq[token] += 1

    total = max(len(chunks), 1)
    scored: list[tuple[float, dict[str, object]]] = []
    for chunk, tokens in zip(chunks, chunk_tokens):
        counts = Counter(tokens)
        score = 0.0
        for token in query_tokens:
            if token not in counts:
                continue
            idf = math.log((1 + total) / (1 + doc_freq[token])) + 1
            score += counts[token] * idf

        title = str(chunk.get("title", ""))
        variants = title_variants(title)
        if any(variant in query_lower or query_lower in variant for variant in variants):
            score += 120
        else:
            title_tokens = set(tokenize(title))
            title_overlap = sum(1 for token in query_tokens if token in title_tokens)
            score += 24 if title_overlap >= 3 else title_overlap * 3.2
        if score > 0:
            scored.append((score, chunk))

    return sorted(scored, key=lambda item: item[0], reverse=True)


def main() -> int:
    if len(sys.argv) < 2:
        print('Usage: python3 scripts/query_knowledge_rack.py "your question"')
        return 1

    question = " ".join(sys.argv[1:])
    chunks = load_chunks()
    if not chunks:
        print("No indexed chunks found. Run: python3 scripts/build_knowledge_rack.py")
        return 1

    results = score_chunks(question, chunks)[:5]
    if not results:
        print("No matching passages found.")
        return 0

    print(f"Question: {question}\n")
    for index, (score, chunk) in enumerate(results, start=1):
        title = chunk.get("title", "Untitled")
        source_path = chunk.get("source_path", "")
        excerpt = str(chunk["text"]).strip().replace("\n", " ")
        excerpt = excerpt[:440] + ("..." if len(excerpt) > 440 else "")
        print(f"{index}. {title}")
        print(f"   Score: {score:.2f}")
        print(f"   Source: {source_path}")
        print(f"   Excerpt: {excerpt}\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
