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
- `knowledge-rack/library/raw/*` — a byte-identical copy of the inbox. It is
  derived, so it is not tracked in git; the build makes it every time.
- `public/knowledge-rack/catalog/*` — the copy the site serves

After a build, check the index against the corpus:

```bash
npm run check:knowledge-rack
```

It proves that every hash in the manifest matches the source on disk, that
every file in the inbox is indexed, that the built and published catalogs are
the same bytes, and that the manifest's word, character and chunk counts
agree with the extracted text. **Never hand-edit the manifest**: a hash has to
describe bytes, not an intention.

## Personal contact details

The source reports carry the contact lines of named individuals. Those lines
are redacted in the documents themselves, so the redaction survives a
re-extraction. `npm run check:contacts` fails the build if a personal email
or phone number reappears anywhere in the tree. Published organisation
inboxes and office switchboards are allowlisted and stay.

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
