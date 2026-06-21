# BigSet setup for SLIC v3 data pipeline

Tool: github.com/tinyfish-io/bigset (AGPL-3.0)
Purpose: Replace manual data collection for SLIC's 6 livability axes.

## Setup (~20-40 min first time)

```bash
git clone https://github.com/tinyfish-io/bigset.git
cd bigset && cp .env.example .env
# Fill in:
#   TINYFISH_API_KEY  → tinyfish.ai → API Keys
#   OPENROUTER_API_KEY → openrouter.ai → Settings → Keys (load $5-10)
#   CLERK_* keys → dashboard.clerk.com → create app → JWT Template (Convex)
make dev
# → localhost:3500 (app)  localhost:4111 (Mastra Studio)
```

## License

AGPL-3.0. Self-hosted on Non's machine for SLIC data generation = zero trigger.
If SLIC is ever hosted as a SaaS for external clients (depa/SEIC municipalities),
AGPL compliance must be planned. Current deployment (GitHub Pages static) = fine.

## Spike order

1. `01-billionaire-density.md` — highest probability (English, annual, Forbes/VC)
2. `03-time-cost-of-money.md` — OECD.Stat, English, structured
3. `04-eu-corridor-nuts2.md` — Eurostat portal, English
4. `02-demographic-optimism.md` — multi-source join, medium difficulty
5. `05-fdi-velocity-thailand.md` — Thai-language sources, lowest priority

## Integration pattern

BigSet generates → export CSV → place in `data/verified_sources/` →
existing build pipeline reads from there → no change to React app needed.

## What this replaces

Each prompt file lists the hardcoded constant it replaces in the React source.
The goal is to make those constants data-driven (read from CSV at build time)
rather than hardcoded in TSX files.

## What this does NOT replace

- The editorial copy and framing in each section
- The SLIC scoring engine and AMPI methodology
- Per-city editorial translations
- The visual/SVG chart layout
