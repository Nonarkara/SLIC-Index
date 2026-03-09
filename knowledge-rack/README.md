# Knowledge Rack

This folder is the intake and extraction base for the SLIC knowledge rack.

## Drop zone

Put new source files into:

- `knowledge-rack/inbox/`

Supported now:

- `.pdf`
- `.docx`
- `.pptx`
- `.txt`
- `.md`

## Build the rack

```bash
python3 scripts/build_knowledge_rack.py
```

That writes:

- `knowledge-rack/catalog/manifest.json`
- `knowledge-rack/catalog/chunks.json`
- `knowledge-rack/catalog/chunks.jsonl`
- `knowledge-rack/catalog/summary.md`
- `knowledge-rack/text/*.txt`
- `knowledge-rack/library/raw/*`
- `public/knowledge-rack/catalog/*`

## Ask the rack locally

```bash
python3 scripts/query_knowledge_rack.py "What does the Smart City Primer say about citizen-centric development?"
```

This is retrieval only. It finds the best matching passages from the indexed documents.

## Next layer

The next step is to connect this rack to:

- embeddings
- a vector store
- Gemini or another model for synthesis
- a web question box with source citations
