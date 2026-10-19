# Backend and traffic rebuild

## Scope
Preserve all city scores, rankings, maps, editorial content and five locales.
Verify canonical input/output hashes and reproduce scoring without restamping the publication.
Close confirmed request-path bypasses and add executable regression tests.

## Traffic architecture
Add a first-party Cloudflare Pages endpoint backed by a dedicated D1 database.
Count acknowledged browser sessions, not people. Honor DNT and GPC. No external
geolocation calls, referrer URLs, query strings, user agents or raw IP storage.
Only Cloudflare-provided country codes determine geography. Daily salted IP digests
are used solely for bounded abuse protection; session digests prevent retry duplicates.
These temporary digests are pruned on writes after two days; cleanup is opportunistic,
not a guaranteed deletion deadline. Daily country totals remain as aggregate research
reach evidence. D1 uses the Asia Pacific location hint, not a residency guarantee.

## Historical evidence
Read-only import from SLIC Index V1/V2 Visitors, retrieved 2026-10-19.
Only timestamps and existing country labels were aggregated; no IP geocoding or
raw visitor rows are committed. Three explicitly labelled test records excluded.
Show legacy records separately from new sessions: overlapping users and sessions
cannot be deduplicated. No extrapolation for collection gaps. Days without rows
are unknown, not proof of zero traffic or an outage. Historical bots and repeat
visits cannot be reliably removed. New sessions are not a measure of unique people.

## UI and verification
Add About / Worldwide Reach, country-level world map and accessible country table.
Show source, snapshot date, date span, days with records and unknown geography.
Use existing editorial fonts and square corners; preserve the existing city map.
Test origin/method/body validation, retry deduplication, rate limits, privacy signals,
backend outage behavior and aggregate consistency. Run the release gate, fresh-agent
review and browser checks at 1440, 1024 and 390 px; deploy and verify the custom domain.

## Operational limits
Aggregate reads share a canonical five-minute edge cache snapshot, including HEAD;
query strings cannot create fresh database scans. Snapshot time is displayed.
Each UTC day/network digest can contribute at most 60 sessions; shared networks
may be undercounted. A random browser-tab token is reused for three bounded write
attempts and online recovery; blocked storage retains it only in memory. This is
abuse resistance, not authenticated human counting. Distributed bots can still
inflate counts; do not use these numbers as verified unique people.

The old Google sheet is not modified and its personal-data access/retention has
not been audited here. No new records are sent there by this production build.
The legacy snapshot is fixed; continuing V1/V2 traffic is outside the new counter.
Raw historical IPs were not geocoded or copied into the repository.

| Data | Purpose | Access | Retention / cleanup |
| --- | --- | --- | --- |
| Country/day counts | Describe index reach | Public aggregate API | Retained as aggregate evidence |
| Daily HMAC network/session digests | Limit abuse and duplicate retries | Database operator only; never returned by API | Rows older than two UTC days pruned on the next accepted write; opportunistic, not scheduled |

Country-code mapping: Unicode CLDR 48 codeMappings, retrieved 2026-10-19,
https://github.com/unicode-org/cldr-json/blob/main/cldr-json/cldr-core/supplemental/codeMappings.json
(Unicode License V3). Atlas joins use numeric M49 identifiers, never translated names.

## Confirmed backend corrections
Independent probes found input/publication hashes were format-only and repeated
slashes bypassed private-file protection. Shared canonical payloads now drive the
scorer and both gates. Mutated inputs, exact outputs and zeroed hashes fail; isolated
rescoring preserves published city results. Express now uses the same decoded file
classification as the edge. Regression probes include encoded/repeated slashes.
Hashes detect internal drift, not an attacker who rewrites the data and all hashes.

## Verification results
- Full release gate: 109 tests passed, typecheck/build/publication/CSV/methodology/
  translation checks passed; integrity audit 37 checks, zero errors or warnings.
- Nine tampering cases rejected by both CLI integrity gates. Two isolated rescores
  preserved all published city objects and hashes; main publication files unchanged.
- Actual SQLite schema/trigger tests verify deduplication, caps and digest pruning.
  Fresh reviewer reproduced a committed write with a lost response and denied
  browser storage: two attempts, one UUID, one counted session.
- Fresh reviewer checked 1440/1024/390 px in a real browser: no horizontal overflow;
  readable map, controls and table; unavailable data uses dashes, not fake zeroes.
- Production custom domain /traffic and /rankings returned 200; repeated-slash and
  encoded private paths, private traffic module and fresh missing assets returned
  404/no-store. Cross-origin writes returned 403, malformed sessions 400, DELETE
  405 and DNT writes 204 without recording a visit.
- A real browser visit produced one new session; the production API and remote
  database agreed. Live API response had max-age=300 and an increasing Age header.
  Versioned methodology PDF remained 200/application/pdf with SAMEORIGIN.
- Production-only npm audit reported zero known advisories. The standalone slop-lint
  executable was unavailable; repository design-invariant tests and independent
  three-width visual review passed instead.

This is bounded verification, not a guarantee of security. No load test, provider
account/branch-protection audit or Google Sheets access-policy audit was performed.
Cloudflare's upstream logs and historic third-party retention are outside this change.
