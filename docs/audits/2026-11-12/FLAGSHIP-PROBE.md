---
updated: 2026-11-12
drafted_by: codex/gpt-5
reviewed: false
---

# Flagship release probe

Baseline: production and repository commit `1ed1ea0`. The snapshot, CSV,
publication hashes and methodology downloads were not changed.

| Boundary | Confirmed before | Correction and check |
| --- | --- | --- |
| Workbench publication | Gothenburg showed #1 and 77.5 in the official mode. The bundle says #2 and 72.5 after its five-point coverage penalty. | Render published rows, including their global ranks and tier allocations. The browser gate checks all 158 before and after a custom preset. |
| Reading order | On a 390 px phone the first preset started below the fold, at 868 px. A citation note preceded the instrument. | Align the opening to the workbench, make the figures a strip, and place the citation note after published results only. See [decision geometry](../../design/decision-geometry.md) for budgets and viewport measurements. |
| Traffic replay | The UUID validator accepted upper and lower case but the HMAC treated those spellings as different sessions. | Normalize before hashing; exercise both spellings against the SQLite trigger in one day. |
| Worker assets | The production edge served `/request-policy.js` as public JavaScript. It carried no secret, but was not a client asset. | Block its direct, encoded and repeated-slash forms before asset fetch. Check GET and HEAD locally and check the deployed route. |
| About gallery | Two 1,600 px photos were drawn at 410 px, 3.9× the display width. | Use the existing 960 px versions, with the same aspect ratios, captions and alt text. Keep the originals. |

The data audit recomputes all 163 published cities; 158 are ranked and five
are on the watchlist. Source reconciliation covers 4,187 of 4,193 inputs
with six declared exemptions and 180 undated inputs. These are coverage
and reproducibility checks, not independent empirical validation.

Traffic totals are still best-effort browser-session records, not verified
unique visitors. Origin checks are browser controls, not authentication;
the network quota is not a defence against all distributed inflation or
load. No synthetic successful writes were sent to production. No claim is
made about provider-side IAM, independent data quality, or a site-wide 50%
reduction in scroll.
