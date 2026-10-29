# Professional shipability: evidence and remaining work

Checked 2026-10-28. The full objective remains active; a polished build and a
passing release gate do not establish institutional authority or world's-best data.

| Requirement | Current evidence | Remaining work |
| --- | --- | --- |
| Professional reader journeys | Existing layout, dense spatial, clearance, payload, interaction and locale gates; independent review of each change | Current full release and live verification required before shipping |
| Legitimate attribution | Named authors and project-credited supporters; conflicting agency-governance wording corrected | Agency-approved publishing, commissioning, governance and review records have not been supplied |
| High-quality city evidence | 163-city publication, explicit proxies, reproducible scoring; every one of the 4,193 published inputs resolves to a source-register row or is declared exempt with a reason | 38 inputs are city- or region-scoped estimates with no observation date; 6 inputs carry a different construct from their peers and are declared, not resolved; the register's World Bank rows are a frozen vintage |
| Defensible freshness | Registered dates on 4,013 of 4,193 inputs; every registered date now names the series it came from | 180 inputs have no matched date; the 24/36/60-month thresholds in the register README are declared but not yet enforced by a gate |
| Truthful comparison | Unsupported first-ever transparency and price-causes-higher-score assertions corrected; Freedom House, Equaldex and hate-crime citations now name what they actually contain | Review edition-specific competitor coverage, units, weights and novelty against archived primary methodologies |
| World's-best claim | Not established by a UI, city count or hashing | Define comparable quality criteria and demonstrate superiority through independent, reproducible assessment; do not imply it is already established |
| Data rights | Sources named; code license present | Review provider-specific redistribution permissions and attribution; a source link is not a data license |
| Operational trust | Integrity/security tests and edge boundaries; aggregate traffic with privacy controls | Provider access controls, recovery drills and independent external review remain separate evidence requirements |

The next data-curation work is the 38 undated inputs and the declared
exemptions in the downloadable evidence register. Do not improve the apparent
coverage by assigning dates from similar rows, changing proxy labels back to
city, or treating register matching as independent measurement validation.
Preserve the current ranking until a reviewed data change is explicitly
sourced and republished through the canonical pipeline.

**What changed on 2026-10-28.** The evidence register previously reported 764
unregistered inputs, 19 value disagreements and one source disagreement. That
count was wrong by construction: the register had never been pointed at the
Freedom House, Equaldex or hate-crime sources, so two thirds of a scored
metric was invisible to it, and a declared field alias was needed before the
rest could resolve. All 4,193 published inputs now resolve to a register row
or are declared exempt with a reason, and `npm run check:register-coverage`
fails the build if that stops being true. The full findings, the sourced
corrections and the ranking impact are in
`docs/inclusion-evidence-reconciliation-2026-10-28.md`.
