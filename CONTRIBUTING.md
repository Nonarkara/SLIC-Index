# Contributing to SLIC Index

Fork the **method**, not the secrets. This repo is a civic publication: the ranking is meant to be cloned, recalculated, criticised, and taught. API keys, visitor-tracking credentials, and unpublished worksheets are not part of the public claim.

SLIC is an independent civic-studio project. It is not a government product, a UN ranking, or a ministry certification. In-kind infrastructure support is not a ranking endorsement.

## Run a local copy

Clone and run instructions live in the README ([Run it / fork it](README.md#run-it--fork-it)). Short version:

```bash
git clone https://github.com/Nonarkara/SLIC-Index.git
cd SLIC-Index
npm ci
npm run dev          # http://127.0.0.1:5173
```

You do not need Supabase, Wrangler, or any secret to develop locally. Leave `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` unset.

Before you trust a number you changed:

```bash
npm run typecheck
npm test
npm run check:publication
npm run check:methodology
```

`npm run rescore` rewrites the published snapshot. Run it only when you intend to change scores. After a data edit, keep these three aligned:

- `data/verified_sources/city_inputs.csv`
- `src/data/publishedRankingData.json`
- `public/downloads/slic-ranked-cities-v2.csv`

## Pull requests

1. Fork this repository (or a branch off `main`).
2. Keep the change focused: one method, data, or docs concern per PR.
3. Show the method. If you change weights, cities, or sources, say so in the PR and leave the provenance fields (`source`, `sourceUrl`, `dataLevel`) intact.
4. Do not commit `.env`, service-role keys, unpublished worksheets, or visitor-tracking credentials.
5. Run the checks above. Mention what you ran.
6. Custom CSS only — no Tailwind, shadcn, or utility-class frameworks.

A rewritten board is a fork of the argument, not “the” SLIC ranking. Do not keep the SLIC name, the DEPA / PMU-A / ReTL lockup, or slic.nonarkara.org on a board you have silently rewritten. Cite this repo, show your diffs, and label modelled cells as modelled.

## Issues

Use issues for method questions, data corrections with a public source, and reproducible bugs. Do not paste secrets, tokens, or unpublished worksheets into issues. See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

Suggested credit, from the site footer: *Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [date], plus the deployment URL used.*
