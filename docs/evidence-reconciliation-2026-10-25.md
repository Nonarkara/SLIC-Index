# Source provenance correction

## Plan and preservation contract
Correct country proxies labelled as city measurements only when the source register
has exactly one matching city/input row and the raw value, source URL, source title
and explicit country_proxy note agree with the published input. Preserve every raw
value, city, scoring rule, rank and tier; verify numerical results before/after.
Publish source-register dates only for those exact matches, not inferred from a
provider's homepage, publication build time or a similar city's row.

Where no city row exists, explicitly national inputs may also match one row in
their own country's `country_context.csv`, with national scope and exact value,
URL and source title. Do not substitute a national row for an existing conflicting
city row, or attach a national date to a city/derived reading.

Generate a downloadable input-level evidence register and a small derived summary.
Keep unmatched rows visible as unknown; matching is traceability to the local
register, not independent verification of the original measurement. Run mutation
tests for misleading city labels, stale dates, ambiguous rows and generated drift.
Correct the blanket data-vintage statement in all five locales. Use existing
data-page typography/layout and preserve all maps, tables and earned content.

## Scope and limits
The local register records source dates, not a uniform observation-period field.
Its date must never be advertised as a verified measurement year. Source labels
and URL links alone do not establish validity, comparability or a redistribution
license. A country proxy is not a city measurement even when it supplies a score.
The coverage grade currently measures availability, not geographic specificity.

Data quality remains incomplete until unregistered/mismatching inputs have primary
evidence, source observation periods are verified, proxy suitability is reviewed
and comparable city-level measures replace them where available. This correction
does not establish a world's-best claim or independent academic review.

Primary references: World Bank indicator pages for fixed broadband subscriptions
(https://data.worldbank.org/indicator/IT.NET.BBND.P2) and Gini
(https://data.worldbank.org/indicator/SI.POV.GINI), reviewed 2026-10-25, identify
country/economy series. They do not turn national readings into city measurements.

## Results
The correction changed 1,867 input/component labels. At the public metric-line
level, city/metro labels fell from 2,034 to 452 and national labels rose from 531
to 2,113. These remain declared levels, not independently certified measurements.
The audit accounts for 4,193 non-null raw inputs: 3,409 exact register matches,
764 absent register rows, 19 mismatching values and one source mismatch. The
national-register fallback supplies 640 of the exact matches; it also exposes 17
additional value disagreements instead of assigning their dates. The two city-row
disagreements are Gothenburg and Bergen hospitality inputs. All 784 missing matched
dates remain unknown. Registered dates on the matching
subset range from 2015-12-31 through 2026-03-12; this is not the whole dataset's
observation range.

Comparing every city's ID, raw metric/component values, five pillar scores,
headline/exact scores, ranks, tiers and coverage grades against pre-change HEAD
found no numerical changes. The canonical rescore independently reported 0/163
exact-score changes. The publication hash is unchanged; the input hash changes
because the corrected provenance levels are part of its canonical payload.

## Bounded primary-source spot check
On 2026-10-25 the World Bank APIs below returned HTTP 200 and dataset update date
2026-10-08. Their latest non-null Gini observations were Namibia 59.1 in 2015
and Botswana 54.9 in 2015, agreeing with the register. Thus an old observation
does not prove a newer one exists, and a 2026 provider update is not a 2026
observation. These two checks do not validate the rest of the index.

The downloadable register's `registeredNationalProxy` flag and summary
`nationalProxyInputCount` count explicit `country_proxy` notes only. They do not
count all national-scope inputs; use `dataLevel` for geographic scope.

- https://api.worldbank.org/v2/country/NAM/indicator/SI.POV.GINI?format=json&mrv=10
- https://api.worldbank.org/v2/country/BWA/indicator/SI.POV.GINI?format=json&mrv=10
