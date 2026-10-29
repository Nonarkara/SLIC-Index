# Dependency and live-boundary audit

The fresh npm audit found high-severity advisories in Vite 6.4.3 and the
transitive body-parser 2.3.0 dependency. Compatible updates resolve Vite to 6.4.5,
body-parser to 2.4.0, qs to 6.16.1 and iconv-lite to 0.7.3. No major upgrade or
forced audit fix was used. The resulting npm audit reports zero known advisories.
The first resolution/audit report disagreed with the installed package files:
the build still announced Vite 6.4.3. A clean `npm ci --ignore-scripts` installed
the locked packages, and direct reads of all four package.json files confirmed
their patched versions before restarting verification. A lockfile report alone
was not accepted as proof of the executed toolchain.

The deployed Cloudflare Pages worker does not run Express or a Vite server.
The fallback Express server does not install body-parsing middleware, and the
Vite development/preview configuration binds to loopback. This limits exposure;
it is not a reason to retain vulnerable dependencies or evidence of exploitation.

Primary advisories:
- https://github.com/advisories/GHSA-27r3-jxmh-p828
- https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22

Eighteen focused backend tests passed for path classification, missing assets,
origin/method/body validation, privacy signals, database failure, atomic SQLite
deduplication and budgets, aggregate validation and canonical cache keys.

Production probes on 2026-10-25 returned 404/no-store for repeated-slash and
encoded private paths, the private traffic module and a fresh nonexistent JS
asset. DELETE returned 405; a cross-origin write returned 403; a DNT write
returned 204 without collection. Aggregate reads returned 200 with a five-minute
cache policy. The live dashboard showed 217 sessions across seven recorded days,
separate from 1,742 historical records across 106 recorded days in a 224-day span.
These are records/sessions, not independently verified unique people.

No load test, provider-account permissions audit, backup restoration drill or
independent penetration test was performed. This is bounded verification, not
an airtight-security certification. Final release/live results are recorded
separately after the patched build finishes verification.
