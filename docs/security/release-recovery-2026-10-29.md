# Release recovery, 29 October 2026

## Scope
Continue from pushed commit cf03a81 without reverting its thumbnail, Apia,
source-register or editorial work. Preserve all raw inputs, published scores,
ranks, tiers and coverage grades. One editor and one release pipeline own the
working tree. Mutation runs use a separate temporary copy and never rewrite
production sources or dist.

## Corrections
- Restore the figures gate's original 0.06 tolerance. Show the exact mean and
  imbalance deduction to two decimals instead of weakening the comparison.
- Display missing-pillar renormalization explicitly and show the zero floor as
  its own operation. Preserve the exploratory score when an AMPI trace is absent.
- Extract the equation into a small renderable component. Test actual rendered
  terms, weights, denominator, deductions and result for all 163 publication
  entries. Kill isolated mutants for old mean precision, absent denominator,
  absent floor and zeroed displayed pillar values.
- Extend the browser figures check to Bangkok, Taichung, Apia, Port Moresby and
  Alexandria. Validate rendered weights/values, denominators and zero floors;
  keep the original arithmetic tolerance unchanged.
- Remove the unresolvable proposed DOI, unsupported ResearchGate status,
  version-3.5 publication assertions and independent-verification claims from
  all three generated methodology papers. Use the declared score-model version.
  Explain compensation limits, missing-pillar weights, zero-mean behavior and
  clamping. These remain English master copies, not new translated papers.
- Target the numbers mutation by city ID rather than the retired literal 53.7.
  Update the figures mutation target to the extracted component. A timeout or
  unrelated gate error cannot count as a caught figures mutation: the intended
  defect must be named and all measurements must complete.

## Evidence And Limits
The all-city rendered tests and their four mutants pass. The isolated numbers
mutation catches all five cases. The five-city browser figures check passes.
The final-scope unit run passed 138 tests. The completed release and isolated
mutation results are recorded below; no earlier interrupted run is counted.

Actual CUA captures of the corrected Bangkok trace at 1440x900, 1024x900,
390x844 and the working 1280x720 viewport retain the full qualification and
arithmetic without horizontal overflow. At the first three widths, the trace
section measures 166.18, 163.08 and 202.08px respectively; the equation itself
measures 27.90, 24.80 and 63.80px. Taichung's phone trace is 202.08px including
its explicit denominator and source qualification. A subsequent dense run caught
two additional wrapped lines from the extra precision. Inter-term/operator gaps
were tightened without reducing font sizes or hiding terms; the old failure
was recorded before that correction. Existing spatial budgets remain unchanged.

Independent source review closed the confirmed numeric/copy issues. An
independent screenshot pass found the equations legible and unclipped. It also
noted a pre-existing collision between the Growth weight and score at phone
width, outside the changed equation. Whole-site visual perfection, institutional
endorsement and independent empirical validation are not established here.
The unchanged Bangkok editorial narrative also retains older numeric copy
(SLIC 53.7 and Community 70.7 versus the current 53.5 and 68.4). That editorial
refresh is separate from the repaired formula; a passing equation gate does not
certify all prose on the site.

## Release Verification, 30 October
`npm run verify:release` completed with exit 0: 138 tests passed; integrity audit
37 checks with zero errors/warnings; complete dense spatial sweep passed with
zero hard defects and no baseline edits. The two-line equation signature
improved from 27 allowed occurrences to 25. Footer navigation checked 100 page
loads in five locales plus five drawer openings. Clearance checked 60 page loads.
Payload and shipability both reported zero blockers and zero warnings.

The publication JSON remains byte-identical to cf03a81. All three regenerated
public PDFs match their dist copies byte-for-byte. The release build passed the
five-city figures gate and the pointer/axis spider checks. Isolated numbers
mutations caught 5/5 intended defects.

## Mutation Closure
The first eight-case figures/clearance batch exited 1, reporting 7/8 caught.
The wrong-plate-score case was not a clean proof, and its original harness did
not retain enough diagnostics to classify the cause. Do not call that batch
green or presume the cause was machine load.

The harness now retains failure diagnostics and supports a bounded `--case 4`
retry without changing the default case set or its rejection criteria. That
isolated retry exited 0 and reported 1/1 caught: a displayed 27.8 was rejected
against the published 22.8. All eight distinct cases therefore have a named
intended failure, but there was no single 8/8 clean batch. The four rendered
equation mutants and all five numbers mutations also passed. Invalid case
selection is rejected before any source write. The temporary copy was restored;
none of these mutations touched the release sources or dist.

## Live Verification
Runtime release dfc866e was pushed and deployed to Cloudflare Pages at
https://743b9c6f.slic-index.pages.dev and https://slic.nonarkara.org.
The custom-domain homepage and all three methodology PDFs returned 200 and
matched the tested build byte-for-byte. The GitHub Pages mirror revision
78c3f9411ccf271ef73867820fc22cdb6228e6fe carries the same index bytes; its
404 shim was added only to an isolated mirror staging directory, never dist.

A real browser on the custom domain displayed Bangkok's 57.75 mean, 4.27
imbalance and 53.5 published score. Bangkok, Taichung and traffic routes returned
200. Repeated-slash and encoded private paths, the private traffic module and a
new nonexistent JS asset returned 404/no-store. DELETE returned 405; a
cross-origin traffic write returned 403; a DNT write returned 204 without
collection. No valid synthetic visitor session was written by these probes.
