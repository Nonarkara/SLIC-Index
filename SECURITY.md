# Security policy

This repository is a static civic publication: ranking method, published city data, and a Vite site. There is no product login and no ranking backend that accepts secrets from the public.

## How to report a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/Nonarkara/SLIC-Index/security/advisories/new) for this repository.

If that form is unavailable, open a **public issue that names the surface only** (for example: “visitor-tracking env handling”) and ask a maintainer to follow up privately. Do not attach payloads, tokens, or reproduction files that contain credentials.

## Do not put secrets in issues or pull requests

Never paste or commit:

- API keys, access tokens, or service-role keys
- `.env` files or visitor-tracking credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, or any other analytics secret)
- Unpublished worksheets, draft score dumps, or other non-public data
- Personal data that is not already on the public board

Fork the method, not the secrets. If a number cannot be shown with a source, it does not belong on the board — and it does not belong in a GitHub issue either.

## What is in scope

- Accidental exposure of credentials or non-public worksheets in this repo
- Ways a clone or deploy could leak tracking keys that a maintainer later adds locally
- Integrity issues that would let a republished board hide sources or invent scores while still presenting itself as this SLIC snapshot

Ordinary ranking disagreements, source updates, and methodology critique belong in public issues or pull requests, with public sources attached.

## What this is not

SLIC is independent. A security report does not make the index a government product, and in-kind infrastructure support is not a ranking endorsement.
