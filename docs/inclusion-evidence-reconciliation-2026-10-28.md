# Source Provenance Reconciliation — 2026-10-28

> What the last session's evidence register could not see, what it could see once
> it was pointed at the right sources, and what changed in the published index
> as a result. Written by MCode for Dr Non.

---

## The short version

The previous session built the right instrument: an input-level evidence
register that traces every published number to a curated source row, and a
downloadable version of that register at
`public/downloads/slic-evidence-register.json`.

Then it stopped. The register reported **764 of 4,193 published inputs as
"unregistered"**, and the status document said the next work was to close
them.

That number was wrong, and this session found out why. The 764 were not 764
missing evidence files. They were **three different problems wearing the same
label**, and the register could not tell them apart because it had never been
pointed at the sources.

| What the register said | What was actually true | Count |
|---|---|---|
| "unregistered" | the same evidence under a second field name | 254 |
| "unregistered" | three signals the register had never covered at all | 489 |
| "unregistered" | genuinely never written down | 21 |
| "value-mismatch" / "source-mismatch" | the publication disagreed with the register | 26 |

And underneath that, three citation defects that no gate was looking for,
because the register could not see the inputs they lived in.

**Where the index stands now:**

| | Before | After |
|---|---|---|
| Published inputs with no register row | 764 | **0** |
| Inputs whose published value disagrees with the register | 19 | **0** |
| Inputs whose source URL or title disagrees | 1 | **0** |
| Inputs carrying a registered source date | 3,409 | **4,013** |
| Inputs with no known date | 784 | **180** |
| Inputs declared exempt, with a reason | 0 | 6 |

Every one of the 4,193 published inputs now either resolves to a register row
or is named in `data/verified_sources/register_exemptions.csv` with a reason.
A gate enforces it.

---

## What was wrong underneath

### 1. Three signals had no register rows at all

The Community pillar's scored metric `community_tolerance_pluralism` is a
composite of three inputs:

```
inclusion_equaldex_country_raw       0.40   Equaldex country index
inclusion_freedom_house_country_raw  0.30   Freedom in the World total
inclusion_hate_crime_raw             0.30   hate crime per 100k (city) or proxy
```

**None of the three had a single row in the register.** 489 published inputs
were invisible to the evidence layer — 40% and 30% of a scored metric, with
no register coverage at all. That is why the numbers below could drift.

### 2. The Freedom House values were not the edition they cited

The published values came from `scripts/archive/patch-inclusion-composite.mjs`,
whose header says they "track Equaldex and FH published scores as of late
2025". The citation, in the site's own reference list, says:

> Freedom House (2024). Freedom in the World 2024.

and every URL pointed at `/freedom-world/2024`.

Neither was true of the numbers. Against Freedom House's own workbook
(`Aggregate_Category_and_Subcategory_Scores_FIW_2003-2024.xlsx`, hashed and
vendored at `data/verified_sources/sources/`):

- **46 of 87** countries' published values were the 2024 edition.
- **24** were an earlier edition — the citation named a year the number did
  not come from.
- **17** matched **no** edition from 2006 to 2024 at all.

Freedom House publishes one workbook per edition with every country's score
for every year. The 2024 edition is in that file. So the correct figure for
every country was available, and half the column was not using it.

Puerto Rico was the sharpest case: Freedom House **stopped scoring Puerto
Rico after the 2016 edition**. There is no current score to cite, and the
published URL (`/country/puerto-rico/freedom-world/2024`) returned **404** —
the city page for the United States returned 93, but the value published for
San Juan was the **United States'** 2024 figure (83), presented as its own.

### 3. The Equaldex values did not match Equaldex

The same script seeded the Equaldex column by hand, and the published values
were compared against the live source by harvesting all 87 country pages the
index cites.

**Only 6 of 87 matched.** The rest had drifted, in both directions, by up to
31 points (China 25 → 56, Thailand 90 → 65, the United Kingdom 82 → 64).

Two specific things sat inside that:

- **Thailand's 90 was an editorial override, not an Equaldex figure.** The
  script says so: *"Thailand Equaldex is set to 90, reflecting (a) the
  January 2025 entry into force of marriage equality and (b) subsequent UN
  SOGI Independent Expert recognition."* The value was attributed to
  Equaldex and linked to Equaldex's page, which says **65**. That is a
  false citation, and the editorial judgement it encodes has now been removed
  from the number and left in the essay where an argument belongs.
- **Czechia's URL was dead.** The citation was built by slugifying the
  country name, which produced `/region/czechia` — **404**. Equaldex's slug
  is `czech-republic`. The value published was 70; the live figure is 72.

### 4. The hate-crime component was a proxy presented as a measurement

144 of the 163 hate-crime inputs are a hand-built country proxy, described in
the script header as *"a country-level proxy derived from Freedom-House
civil-liberties score (higher FH → lower proxy crime… the proxy is
directional only)"*. Their citation pointed at the Freedom House country
page — which carries the civil-liberties score the proxy was derived **from**,
but **not the proxy number itself**.

A reader following the citation to Freedom House would never find 2.0, 1.5 or
4.0 for Taiwan, South Korea or Poland. The proxy is legitimate as an
analyst judgement; it was not legitimate as a measurement with a link.

The 19 city-level inputs are different: they are real police and statistics
sources (Illinois State Police, NYPD, UK Home Office, BKA, SSMSI, Toronto
Police, SPVM, NSW and Victoria Police). Those are now registered as city
rows with their own sources and dates.

### 5. Within one country, some cities carried a different "national" number

`gdp_growth_context` is a **national** input — one figure for a country. But:

| Country | Cities carrying one value | Cities carrying another |
|---|---|---|
| United States | 2.4 (6 cities) | **2.79** (4 cities) |
| Japan | 0.7 (6 cities) | **0.1** (4 cities) |
| China | 5 (2 cities) | **4.98** (7 cities) |
| Italy | 0.7 (4 cities) | **0.69** (2 cities) |
| New Zealand | 1.29 (6 cities) | **0.7** (2 cities) |

The register holds one figure per country, and the title says which one:
*"World Bank WDI: GDP growth, US, 5-year average"*. The cities carrying the
other value were carrying the **single-year** figure under the same label. So
a reader comparing Raleigh with Austin was comparing a five-year average
against one year, inside a metric called "growth momentum".

---

## What was done

### The instrument

**A declared field-alias map** (`data/verified_sources/field_aliases.csv`).
Two publication inputs are the same measurement as a register field under a
different name — `gdp_per_capita_ppp_context` is `gdp_per_capita_ppp`,
`gini_coefficient_context` is `gini_coefficient`. An alias says only that two
names denote one measurement: the value, the source URL **and** the source
title must still match exactly, so a wrong alias can fail to resolve and be
reported, but can never make an unverified figure look registered. 254 inputs
resolve through the map.

**Empty rows no longer shadow real ones.** The registers keep a placeholder
row for every city and field. A placeholder with no value was being matched
instead of the populated country row one level up, so Gothenburg and Bergen
read as value-mismatches against an empty cell. The reconciler now ignores
rows that carry no value.

**A country row may carry an international series.** The register scopes
World Bank series as `international`, not `national`; a country row with that
scope is still this country's own figure and may stand in for a national
claim. A row scoped `city`, `metro` or `regional` may not.

**Declared exemptions** (`data/verified_sources/register_exemptions.csv`). Six
inputs cannot be re-read from their cited source: London, New York and Tokyo
carry an OECD social-mobility score and a commercial VC-density index where
their peers carry a World Bank series. The register stays silent on them and
says so, rather than asserting something it cannot support.

### The data

| Change | Where |
|---|---|
| Freedom House values set to the 2024 edition for all 87 countries | `scripts/build-inclusion-evidence.mjs` |
| Puerto Rico set to the United States' 2024 score, labelled a national proxy | same |
| Equaldex values set to the harvested live index, with the retrieval date | same |
| Czechia's Equaldex slug corrected to `czech-republic` | `scripts/harvest-equaldex-index.mjs` |
| The three inclusion signals registered: 254 country rows, 19 city rows | `scripts/build-inclusion-evidence.mjs` |
| Ten city- and region-scoped estimates registered with their named sources | `scripts/seed-register-coverage.mjs` |
| The publication made to follow the register wherever the register has a row | `scripts/reconcile-publication-to-register.mjs` |

The Freedom House workbook and the Equaldex harvest are **vendored** under
`data/verified_sources/sources/` with the SHA-256 of the file they came from,
so the derivation can be re-run and checked without the network. The Freedom
House extract is cross-read from a second, later workbook; the only
disagreement is Eastern Donbas, a territory Freedom House revised between
editions and one the index does not cover.

### The gate

`npm run check:register-coverage` fails the build when a published input
resolves to no register row and is not declared, when a published value
disagrees with the row that backs it, or when a declared exemption covers
nothing at all. It is wired into `npm run verify` and `npm run verify:release`.

`npm run mutation-register-coverage-gate` proves the gate can go red: it
plants a drifted value, an emptied register row and a deleted register row in
the real sources, checks the gate catches each one, and restores the files
byte for byte.

---

## What changed in the published index

The corrections are sourced, so they go through the canonical pipeline.

| | Before | After |
|---|---|---|
| Cities whose score changed | — | **133 of 163** |
| Cities whose rank changed | — | **89** |
| Cities that changed tier | — | **2** (Lyon Beta↑, Tallinn Beta↓) |
| The Alpha board | 10 cities | **the same 10 cities, the same slots** |

The Alpha board did not move. Kaohsiung went from rank 26 to 31 and kept
α6; Singapore went from 34 to 33 and kept α7; Bangkok held rank 66.

Two cities moved a long way for a reason worth naming: **Nanjing went from
rank 111 to 100** (its Gini and FDI figures were stale vintages of the
country series, and its PPP-per-capita estimate had never been registered),
and **Tokyo went from 48 to 54** (Equaldex's live index is 53, not the 50 the
index published).

---

## What is still open, and is not mine to close

**One input key carries two different constructs.** `equal_opportunity_raw`
is a World Bank Gini for 133 cities and an OECD social-mobility score for
London, New York and Tokyo. The register's own field guide says the opposite
of what the register holds:

> *Do not duplicate the country Gini value here; use a local opportunity
> measure if available.*

So the three OECD cities follow the guide and the other 133 break it. The
same is true of `investment_signal_raw` (World Bank FDI for 154 cities,
commercial VC density for three). Changing either is a methodology decision
about which measure the Capability pillar should use, not a provenance
repair, so the three cities are **declared exempt** and left as they are.
This should be decided deliberately rather than inherited.

**The register's vintage is a snapshot.** The country rows hold the World
Bank figures as they were when they were curated (the United States' PPP per
capita is recorded as 85,809.9; WDI now says 86,169.7 for the same year).
One row — the United Kingdom's PPP per capita — was filled fresh from the API
because the register had never held it, so it sits in a slightly newer
vintage than the rest. A full refresh would put every country on one vintage.

**Freshness is a declared field, not an enforced one.** The register says
what a row's observation period is; it does not yet fail the build when a row
crosses the 24/36/60-month thresholds in `data/verified_sources/README.md`.
That check is the obvious next gate.

**Equaldex is a live score.** The published value is now the value on the
cited page on the retrieval date (2026-10-28), and the register records that
date. It will drift again, which is why the date is in the register and not
only in the prose. A periodic re-harvest (`npm run evidence:harvest`) keeps
it honest.

**Thirty-eight inputs have no date.** They are the city- and region-scoped
estimates (Bangkok, Valparaíso, Christchurch, Dunedin, Nanjing, Venice,
Prague) and the hate-crime country proxies. The number is registered; the
observation period is not known and the register says so rather than guessing.

---

## How to re-run it

```bash
npm run evidence:harvest      # re-read the Equaldex country pages (network)
npm run evidence:build        # rebuild the three inclusion signals into the register
npm run evidence:seed         # write any register rows still missing
npm run evidence:reconcile    # make the publication follow the register
npm run rescore               # recompute scores, ranks and tiers
node scripts/update-csv.mjs   # republish the CSV export
python3 scripts/reconcile-source-provenance.py --apply   # attach registered dates
python3 scripts/reconcile-source-provenance.py           # rebuild the register artefacts
npm run check:evidence        # assert all of the above agrees
```

`npm run evidence:harvest` needs the network; everything else runs from the
vendored extracts.
