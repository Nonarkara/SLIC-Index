> **Before any design or frontend work, read [ANTI-SLOP.md](ANTI-SLOP.md) and the "Anti-Slop Design Law" section below.** These are Dr Non's hard rules against AI design slop. They are enforced by machine gates, not by good intentions — see "What the gates catch" for the full list.

# SLIC Index V3 — Project Instructions

## What This Is

SLIC (Smart and Liveable Cities Index) V3 — a transparent, open-source city ranking system.
163 published cities (158 ranked + 5 watchlist), 5 pillars, 22 scored metrics + 3 diagnostics. Deployed to Cloudflare Pages at https://slic.nonarkara.org.

- **Live site:** https://slic.nonarkara.org
- **Repo:** https://github.com/Nonarkara/SLIC-Index
- **Branch:** `main` (active development)

## Anti-Slop Design Law

**Dr Non's standing position: he would never deliberately want anything to look like AI-designed slop.** This is not a preference for a house style — it is a refusal of a specific, recognisable failure mode. If your work could be mistaken for what an LLM produces on the first attempt without judgement, it is wrong, regardless of whether it passes a test.

Read [ANTI-SLOP.md](ANTI-SLOP.md) before touching any visual. It is the prose source of truth. This section is the operational summary and it binds.

### The rules, in one place

1. **Empty space is a decision.** Space is not left over; it is placed. If a section could be tighter without losing hierarchy, tighten it.
2. **Subtract before you add.** A new element must earn its place against the existing composition, not be added because it is available.
3. **The map comes first.** Where a page has a map, the map is the primary object. Text frames it; it does not replace it.
4. **Boxes fit their content.** A container's size comes from what is inside it, not from a grid cell.
5. **Balanced composition.** Nothing crowds one edge while the other floats.
6. **Something must win.** A squint test must show a focal point. If everything is equally loud, nothing is.
7. **No fake depth.** No shadows that imply volume, no gradients that interpolate brand colours, no hover that translates the surface as if a 3D model moved.
8. **A4/A5 readable measure.** Prose columns cap at ≤65ch and are declared in `ch`, not `px`/`rem`, so the measure tracks the type size.
9. **No lazy ornaments.** No emoji as icons, no decorative icon tiles, no ornamental shadows.
10. **No filler copy.** No "seamlessly", "revolutionise", "unlock the power", "cutting-edge", "supercharge". The locale string tables are the copy a reader actually reads.
11. **No AI-slop fonts.** Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito are banned. Editorial faces only.
12. **Palette discipline.** Cream ground, ink text, amber accent, plus the three Wada tier hues (categorical data, not brand decoration). One ink, one cream, one blue. A colour used more than once is a token.

### Information hierarchy — the reason the rules exist

A page is not a container for information. It is a **sequence of attention**: the reader's eye should meet the most important thing first, then the next, and so on, without scrolling past it to find out what mattered.

- **Order by importance, not by habit.** Lead with the finding, not the apparatus. A reader who stops after the first screen should have got the point.
- **Condense.** Every section that can lose 20% of its height without losing its point should. Excess scrolling is a composition failure, not a content failure.
- **Depth is earned.** A section earns vertical space by being the answer to a question the reader has. Padding is not information.
- **Anti-slop and information delivery are the same goal.** A page that needs three screens to say one thing has failed twice: it looks like slop *and* it buries the message.

**Two shapes are not negotiable**, because both were got wrong and cost a measured amount:

- **A bibliography is a ruled list, not a card grid.** Thirty-seven sources as thirty-seven bordered cards cost 9,784px on a phone — a sixth of the methodology page — and read like a dashboard of unrelated boxes. They are now a single ruled list, two columns on a wide screen, with the source title as the link.
- **A wide table on a phone is a field grid, not a stack of labels.** The Thailand table has nine short columns. Stacked one cell per line it cost 313px a row, 22,543px for seventy-two provinces. As a two-up field grid the same row is under 200px and still carries every figure. The column label sits inline with its value instead of on a line of its own — thirty-five rows of repeated column header is space spent saying nothing.

**The apparatus goes last.** On the methodology page the glossary and the worked example used to sit *before* the method. They are reference material; they now come after it. The reading order is the argument, then the apparatus, then the sources.

### Spatial hallucination

**Spatial hallucination is when an interface invents a reason for things to occupy space, instead of arranging them around how people read, choose and act.** It is the failure mode that produces something that looks composed at first glance but cannot explain its own geometry.

The test is one question: **"Why is this here, why this size, and why this far from that?"** If the answer is "the grid put it there", the layout has failed. Whitespace is intentional when it separates meaningful groups, supports reading, or establishes emphasis. It becomes spatial hallucination when it asks the reader to supply an intention the designer never had.

| Family | What it looks like |
|---|---|
| **Unjustified gaps** | space stretched to fill a container |
| **Orphan elements** | a photo or chip stranded beside an empty area |
| **Scattered actions** | related buttons on different rows, or pushed to opposite edges |
| **False hierarchy** | everything gets equal weight, so nothing helps you choose |
| **Accidental wrapping** | navigation breaks wherever it runs out of room |
| **Spatially expensive information** | a small decision costs a long scroll |

**The geometry belongs to the content, never to the container.** The worst instance on this site was a grid track declared `auto`, which let a *paragraph's* max-content width size the column. At 1024px the whole Alpha header collapsed into a 16px-wide column of broken words, 2,790px tall, and the page carried a 2,240px dead band beside it. A track whose size comes from `auto` is a track whose size a paragraph can decide. **Use proportions (`minmax(0, Nfr)`), and let a long measure be capped by the column that holds it.**

**A page needs one grid, and every band on it has to be on that grid.** The homepage already had one — `.hp-launch-trail-grid` is `repeat(6, 1fr)` with a 2rem gap, which puts column origins at 24 / 262 / 501 / 740 / 978 / 1217 inside a 1400px section — and three bands ignored it. The thesis and verdict were centred inside the section (`max-width` + `margin: 0 auto`), which floated them to 385px and 410px; the Alpha header ran its own `1.45fr/1fr` ratio, which put its second column at 865px. One screen therefore carried **four unrelated left edges — 25, 385, 410, 865** — and the right third of the thesis and verdict bands was empty. That is the shape of the question "where should people look": nothing to look at, because nothing repeats. The repair was to put all three bands on the same six columns, lead on the left axis and support on the right, so the page has a single spine the eye can ride from the thesis to the tier cards. **A band that starts somewhere no other band starts has invented its own grid, and the reader has to re-find the page's geometry at every boundary.** Measured after: thesis 24/736, verdict 24/736, Alpha title 24, note 736 — one axis, widest void 37px.

**The note must not precede the thing it notes.** The Alpha header read as a badge, then a thirteen-line amber panel, then the headline that names the section — so the eye met the caveat before the claim. The title now comes first in the DOM and on the left; the note is the right column. **A label that names one part must travel with that part** — the badge belongs above the title it labels, not inside the aside.

**A card in a row must carry the same number of lines, or its label floats alone.** The Alpha board is ten cities in two rows of five, and the lead city used to span two columns and two rows: four cells to carry the facts one cell carries, and a hole in the last row where the tenth city should have been — 549 × 166 pixels of nothing at the point where the eye falls off the board. Ten divides by five and by two, so five columns and two rows is the only arrangement in which every row is full. The lead keeps the black ground and the larger name and takes one cell, like every other city. But the cards were then not the same height *inside*: each printed its place on two lines — the country, then the region — and the region reserved a second line because the long ones ("Western, Northern, and Southern Europe") take two. Kaohsiung, whose country is withheld on editorial grounds, had one line fewer than its neighbours, so its label floated alone above **42px of void against its row-mates' 17px**, and the two European cards made their row taller than the other. The card now carries **one place line** — the country, or the region where the country cannot be printed — and nothing reserves a line it will not use; the name line is as tall as the lead's larger name, so the place line sits on one line across the board and the five pillar bars below it sit on one line too. Measured at 1440: board 1392 × 543 → 1392 × 293, every one of the ten cards 14px between its place line and its bars. At 390: the grid 1746px → 1485px, every card 140px, every card 9px of void. **The cost of the repair is editorial and was taken on purpose: the region is no longer printed on the board.** The country is the fact a reader uses to place a city; the region is a UN statistical grouping whose names run to three lines, and eight of ten cards were paying for the two that need it. The city pages still carry both.

**A wrapping row must be balanced.** Nine chips on one line and the tenth alone on the next is an orphan, not a layout. When the item count divides evenly, choose the column count that divides it. And when a row holds two kinds of thing — six preferences and one way out — give the way out its own row rather than letting it land beside a peer, where it reads as a seventh preference.

**The navigation is the structure.** A footer whose nav is squeezed beside a metadata line while a long citation sits alone below it is a composition failure, not a density failure. Give the navigation the full width and one row; put the metadata underneath it.

**Two things side by side always leave a hole under the shorter one.** The rankings workbench put the web and its five bars in one column — 798px tall — beside a 300px rail, and the 490px void under the rail was nobody's design. The fix was not to fill the void; it was to stop insisting on the two-column shape. The web kept its own column, and the bars moved into the rail, beside the thing they move, so the eye travels sideways instead of down and back up. **When a side-by-side pair leaves a hole, ask whether the pair is really one object. If it is, split it and place each part where it is read.** A label that names one part must travel with that part: "drag a bar" belongs above the bars, not under the web.

**The thing under the hand must not move.** On the homepage the spider's handle sat 18px and 53px from the finger during a pull, and one handle came to rest 125° off its axis. The drag arithmetic was right; the page was reflowing. Pulling a weight rewrites the tier lists above and below the chart, and the browser's scroll anchoring then scrolled the page 68px to keep a changing row in place, so the chart moved ~86px mid-gesture — the pointer ended up 133px from the new centre and a 40px pull read as a jump to 100. `ZeroSumAllocator` now anchors on the chart itself: it records the chart's viewport position when a pull starts, pins the page back to it after every re-render, and switches `overflow-anchor` off for the duration. It is held to 0.4px / 0.2px / 0.00° on both routes by `check:spider-drag`. The same fix covers any future cause of reflow (a lazy image, a longer list) because it measures the chart, not the cause.

**Repetition is the scroll.** Measured at 390px, the three heaviest pages were heavy for one reason each. `/thailand` spent 16,450px on 67 table rows (235px each: nine equal fields, one label wrapping to make room for its own value, the score in the same type as "Region") and 933px on each of five cards (seven bars, each a header line over a track, the label and its figure touching — the header had no CSS at all). `/compare` showed the same eleven indices twice, 8,000px apart (method, then critique): 14,000px. `/ideas` dressed eleven plain labels as bordered chips that looked pressable and were not. The repairs were regrouping, not trimming: a province row is two tiers on one six-column grid (rank · name · score, then region and five figures as label-over-value, so every figure sits on the same edges in every row); a score bar is one row; each index is one card whose verdict (what it measures; the critique headline) stays visible and whose evidence folds into a native `<details>`. `/thailand` 30,530 → 22,996px, `/compare` 28,435 → 21,161px at 390. Nothing was deleted. **Not changed, deliberately:** `/methodology` (52,000px), `/awards`, `/essay` are reading surfaces whose length is prose, and which sections matter most is an editorial call, not a spatial one.

**A flex row that is meant to break is still a wrap to the audit.** The first Thailand row used `flex-wrap` with a forced break between its two tiers and measured 93px; the ratchet counted it as 12 wrapped lines against an allowance of 0, correctly — it cannot tell "designed" from "accidental". A grid on a shared track is the better layout anyway and is not a wrap container.

### The Thailand province dataset

`src/thailandData.ts` is **hand-maintained**. It began as the output of `scripts/generate_thailand_provinces.py`, which the "Clean repo" commit (`e6ef0eb`) deleted, and has since gained five-locale editorial text the generator never produced. The restored script was run in isolation and does **not** reproduce the file (1,266 differing lines), so re-running it would silently overwrite that work — do not restore it to regenerate. Its metric values are approximations of NESDC, NSO, PCD, MOPH, Royal Thai Police and Royal Forest Dept publications: no row carries a source URL or a vintage, and no release gate covers the file. It is not part of the published 163-city board. The page's own copy still calls the work a "scaffold", which is the honest part; the numbers need an envelope (source, tier, age) before the copy is softened.

### The knowledge rack

The rack is the site's question box over the methodology. It answers with citations, so **the index it serves has to describe the bytes it was built from — exactly.**

That is not a claim, it is a gate. `scripts/check-knowledge-rack.mjs` proves that every manifest hash matches the source on disk, that every file in the intake folder is indexed, that the built and published catalogs are the same bytes, that the manifest's word, character and chunk counts agree with the extracted text, and that the chunk stream reconstructs that text. The manifest's `sha256` field was decorative until this gate existed: when four source documents were edited, the index kept serving passages from the old bytes while the published manifest kept claiming the old hashes. **A hash has to describe bytes, not an intention.**

**The corpus is fetched when the reader asks a question of it.** The rack holds 1,927 passages — 3.3MB of text — and the methodology page used to download all of it on arrival, to answer a seeded question nobody had asked: 977kB before the reader could read the methodology. Now the panel shows the document count and the passage count from the 10kB manifest, and the corpus arrives when the reader touches the rack or presses Ask. A corpus is a thing you search, not a thing you download to look at.

The corpus lives in `knowledge-rack/inbox/` and is the source of truth. `knowledge-rack/library/raw/` is a byte-identical copy the build script makes; it is derived, so it is not tracked, and the privacy scan skips it — safely, because the gate proves the copy has not diverged. The published catalog is `public/knowledge-rack/catalog/`, and it is what the site serves.

To change the corpus: drop the document into `knowledge-rack/inbox/`, then run

```bash
python3 scripts/build_knowledge_rack.py
```

which re-extracts, re-chunks, and rewrites the built and published catalogs together. The pipeline was deleted by a "clean repo" commit while `knowledge-rack/README.md` still told you to run it; it has been restored, and the README's command works again.

**Personal contact details never enter the corpus.** The source reports carry the contact lines of named individuals; those lines are redacted in the documents themselves, so the redaction survives a re-extraction, and `scripts/check-personal-contacts.py` fails the build if a personal address or phone number reappears anywhere in the tree. Published organisation inboxes and office switchboards are allowlisted and stay. Git history is not scanned: removing a contact from the tree does not remove it from older commits.

**The tree was redacted; the history was not.** The published rack served 16 personal email addresses — alongside 27 organisation inboxes, 43 in all — from 2026-03-09 until 2026-10-21, roughly seven months. The tree is clean and production is clean, but the commits that came before still carry five dirty blobs holding 21 distinct personal addresses between them, and eight branches still point at them:

| dirty blob | path | addresses |
|---|---|---|
| `bd3a9cafb632` | `dist/knowledge-rack/catalog/chunks.json` (the same blob as `public/knowledge-rack/catalog/chunks.json`) | 16 |
| `844b258c1ff2` | `knowledge-rack/catalog/chunks.jsonl` | 16 |
| `6a7c7c898260` | `knowledge-rack/text/ascn-report-2019-depa-thailand.txt` | 16 |
| `014a00c87cfe` | `knowledge-rack/inbox/SCW2020_ThaiVer final.pdf` | 1 |
| `adbda43f10a1` | `knowledge-rack/inbox/Smart City Week 2020 Booklet.pdf` | 1 |

`scripts/purge-history-contacts.sh` rewrites them away. It swaps each dirty blob for its clean twin at HEAD, verifies that no address survives, and only then force-pushes. **It rewrites every commit SHA and force-pushes every branch, so it needs Dr Non's explicit sign-off — it has not been run.** Two things it cannot do: it cannot un-publish what was already served for seven months, and it cannot tell the named individuals their addresses were out there. Both are conversations, not commands.

The blob swap is not optional. `git filter-repo --replace-text` substitutes bytes and silently does nothing on binary blobs — the two source PDFs carry a plaintext address inside compressed streams and survive a `--replace-text`-only rewrite untouched.

### The author's name

**The canonical form is `Dr Non Arkaraprasertkul` / `ดร.นน อัครประเสริฐกุล`.** A name is a fact, not a style choice, and this site had been carrying three of them.

The site published a truncated Latin surname, a Thai surname that was not his, a Thai surname that was a typo, and a Thai given name that was misspelt. They were not confined to one page: the footer funding statement, the awards page, the history timeline, the citation guidance, the publication metadata, the essay byline, the CSV header, the methodology PDF's `/Author` field and the README each carried their own variant. The README went further and documented one of the wrong ones as the intended publication credit, which is how a mistake becomes a policy.

Two things made it hard to see. First, the wrong forms sat in different files, so no single reader saw the pattern. Second, the correct surname *contains* the wrong one — a naive search for the truncated form reports the canonical name as a violation, and the same is true of the prose form. Every rule in the gate is therefore a negative lookahead, and every rule is assembled from fragments so the gate cannot match its own source.

`npm run check:author-name` proves three things: every locale's author prose and citation carry the full surname, the Thai site copy carries the canonical Thai form, and no wrong form appears anywhere in the source tree. The third check is the one that matters — the first two can be satisfied by a single correct string while the other forty are still wrong.

**The short form is allowed where there is no surname.** "Dr. Non" and "ดร.นน" alone are correct and common in the site copy. The rule is that a *surname*, when it appears, is the full one.

### What the gates catch

Every rule above that can be decided from source is a machine gate. They run in `npm run verify:release`, so a violation fails the build rather than being noticed in review.

| File | Gates |
|---|---|
| `test/design-slop-invariants.test.mjs` | banned fonts, family budget, radius = 0, ≤3 elevation shadows, no emoji-as-icon, scrim-only gradients, ≤65ch prose measure, no filler copy, type-scale step, **no fake-depth hover-lifts** |
| `test/system-integrity.test.mjs` | **palette cannot fork** (a colour used twice must be a token), no self-referential token, **the masthead carries the keyed mark on the band's own ground and the footer plate is the keyed logo on no plate**, no bordered control inside a bordered control, **photography is not desaturated**, no bare selector silently redefined (ratchet) |
| `test/accessibility-invariants.test.mjs` | contrast, focus visibility, the masthead's focus ring measured on the cream it is painted on, localised labels |
| `test/publication-hashes.test.mjs` | the scoring bundle cannot drift from its published hashes |
| `scripts/check-layout.mjs` | **the built site in a real browser**: no horizontal overflow, no uncaught exception, no broken image, and every route actually rendered — across 15 routes × 3 widths |
| `scripts/check-footer-nav.mjs` | **the footer sitemap**: a group's links run on one line, so the blocks are near-equal and no block may leave more than 36px of empty space under it — neither beside it (a hole under the short block of a row) nor below the block (a column that stops short of the bottom); a heading may not repeat one of its own links; every published route must still be one click away (exactly once); no label may wrap onto a second line; the block may never be taller than one screen — across 5 locales × 20 widths, plus the mobile drawer |
| `scripts/check-masthead.mjs` | **the bar is one ground**: the band is opaque and is the site's own `--bg`, it reaches both edges of the viewport, and nothing inside it paints a background of its own, carries a border, or floats on a shadow — across 4 widths |
| `scripts/check-spider-drag.mjs` | **the handle stays under the pointer**: on a real built page with a real pointer, a 40px sideways pull on a handle leaves it within 3px of the pointer, it returns to within 1° of its own pillar's axis on release without costing the pull its radius, and the five weights still total 100 — on the homepage and on `/rankings`. `scripts/mutation-spider-gate.mjs` proves it can fail |
| `scripts/check-clearance.mjs` | **the first line clears the band**: the masthead is a fixed band, so the first thing a reader sees on a page has to start at least 32px below its rule — across 15 routes × 4 widths. The city page got this wrong (5.5rem of padding under a 72px band, so the back link sat 16px under the rule and the page read as pasted under a lid); it survived because every other hero is tall by design |
| `scripts/check-numbers.mjs` | **the numbers on the page are the numbers in the bundle**: recomputes all 163 cities from the raw metrics and checks the published scores, five pillars, tier counts and the counts quoted in copy across all five locales. `scripts/mutation-numbers-gate.mjs` proves it can fail |
| `scripts/mutation-spatial-gate.mjs` | **the spatial gate can fail**: five cases put a known defect back into the source — a preset list back to three columns, the coda removed, the reset button back in the preset row, the partner cards back to three columns, a control row that stops growing its buttons — and each one has to fail the gate *on its own measurement*. This is the case that found the two dead rules: a widow beside an 89% hole passed the gate because the slack was `NaN` |
| `scripts/audit-spatial.mjs` | **spatial hallucination**: dead bands, orphan grid rows, stranded controls, accidental wrapping, clipped text, scattered actions, false hierarchy (an emphasis modifier that changes nothing visible, a skipped heading level), and cost-to-first-action — across 15 routes × the **dense ladder**: every 20px from 320 to 1920, 1,215 page loads. `--check <baseline>` turns it into a gate; `--json` emits the fingerprint; `--dense` is the ladder the baseline is written from, because a hole that only appears at 561px is a hole and three widths would never have found it |
| `scripts/check-knowledge-rack.mjs` | **the index describes the bytes it was built from**: every manifest hash matches the source on disk, every source in the intake folder is indexed, the built and published catalogs are the same bytes, the word/character/chunk counts agree with the extracted text, and the chunk stream reconstructs that text |
| `scripts/check-personal-contacts.py` | no personal emails or phone numbers anywhere in the tree — published organisation inboxes and office switchboards are allowlisted |
| `scripts/check-author-name.mjs` | **the author's name is one fact**: every locale's author prose and citation carry the full surname, the Thai copy carries the canonical Thai form, and no wrong form appears anywhere in the source tree |
| `scripts/build-brand-mark.py` | derives `public/Logos/slic-index-mark.png` and `slic-index-monogram.png` from the master, keys the paper off a fitted surface, and writes `scripts/brand-mark.provenance.json` — the SHA-256 of the master and of the bytes it wrote. The integrity gate checks them, so a hand-edited PNG or a changed master fails the build. **Never hand-edit the PNG; re-run the script.** |
| `scripts/build-partner-logos.sh` | keys every partner mark off its paper (`scripts/key-logo.py`) so the supporter row sits on the cream with no white plates. The sources live in `logo-sources/logos/` and are not published. **Never hand-edit a keyed PNG; re-run the script.** |
| `scripts/check-shipability.mjs` | **is this thing shippable**: it runs the built site through the *real* edge worker (`public/_worker.js`) with an asset binding that behaves the way Cloudflare's does — a path with no file behind it answers 404, and the platform's own SPA fallback is never assumed — then drives Chrome over the published routes at two widths and the five locales, and asks what a reader's first minute raises: does the route arrive, does it render a page, does it scroll sideways, is an image broken, is a link dead, does the locale declare its language, is the route in the sitemap, and how much did the page weigh. It is the gate that would have caught the site answering 404 on every route but the homepage while every other gate stayed green. `--url <base>` audits a deployed site instead of the build. **A phase that could not run is reported as a phase that could not run** — "the measurement was not taken" and "the site is broken" are different sentences |
| `scripts/check-payload.mjs` | **the reader pays for what they can see**: no image may be painted into a box from a file more than **three times** wider than that box (a 1600px photograph behind a 240px frame is four times the pixels the screen can show), no route's first load may exceed **1,200kB** of transferred bytes, the shell may not preload a chunk over **300kB**, and the font stylesheet must carry the reader's own script and not the other two. `scripts/mutation-payload-gate.mjs` proves it can fail, on each of its own measurements |
| `scripts/derive-publication-facts.mjs` | **the facts the shell prints come from the bundle**: the city count, the score range and the publication date are derived from the published data by this script, and `--check` fails when the derived file and the bundle disagree. It exists because reading them out of the 1.9MB bundle at runtime put the whole dataset in the entry graph |
| `scripts/generate-thumbnails.mjs` | **the thumbnails the site serves are the plan's thumbnails**: every planned thumbnail exists, at the width the plan claims, at the width the picture is painted into. `--check` fails when one is missing or wider than it claims. The plan is the measurement — a photograph at 6.7× its box, a partner mark at 21× |

**The reader pays for the pixels they can see. (2026-10-23.)** The shipability audit found the site passing every gate and weighing 2,093kB on its heaviest route. Nothing about that is a defect of taste; it is what a reader on a train pays before the page is useful. Three things were being charged for, and none of them was a mistake of care — they were the absence of a measurement:

- **The photographs were served at their full size.** The history timeline draws a 240×160 strip; the file behind it was 1600px wide — 6.7× oversampled — and eleven of them sat in one horizontal scroller, inside the browser's lazy-load threshold, so the route paid 1.5MB before the reader scrolled once. The partner marks in the footer were worse: a 1177px logo painted into 54px, 257kB for a mark the size of a fingernail. The fix is not a smaller picture; it is **the picture the page can show**, generated by `scripts/generate-thumbnails.mjs` at about twice the box it is painted into, with the original kept for the places that show a photograph large. Nothing was cropped and nothing was cut.
- **The fonts were a megabyte of rules for three scripts.** Google Fonts serves one stylesheet per request, and Noto Sans SC, KR and JP are 1.29MB of unicode-range rules between them. Every reader downloaded all three — including the English reader who will never see a Han glyph — on every route, before the first pixel of content. The reader now pays for the script they are reading: Latin everywhere, one script family for their locale. `src/bootFonts.ts` asks before the app mounts, so the first paint waits for the right stylesheet rather than the wrong one.
- **The dataset was in the shell.** The masthead prints "163 cities", and the count came from the 1.9MB bundle, so the bundle was in the entry graph and every route preloaded 107kB of compressed city data it never read — the traffic counter, the map, the essay. The facts are now derived from the bundle by `scripts/derive-publication-facts.mjs` into a file small enough to print a count from, and the bundle reaches the routes that need it.

The heaviest route fell from **2,093kB to 674kB**, and the methodology page from 2,359kB to 405kB — the last one because the knowledge rack was fetching its whole 3.3MB corpus on arrival to answer a question nobody had asked yet. **A corpus is fetched when the reader asks a question of it, not when they arrive at the page that mentions it.** `npm run check:payload` holds all of it: the oversampling, the route budget, the shell's preload list, and the script in the font request.

**The spatial ratchet.** `audit-spatial.mjs` separates a **defect** from a **forced wrap**: a wrap is a defect when the line above had room for the item that dropped (avoidable), when the lone item on the last line leaves a **hole** beside it (unbalanced), or when related items stacked one per line. A wrap the width genuinely forced — a tag list, a chip row on a phone — is the layout working and is reported, not failed. The gate compares a fingerprint of every finding against `scripts/spatial-baseline.json`: more lines than the baseline is a failure, fewer is a pass with a note that the baseline can be tightened. It can only go down.

**A widow is a hole, not a count. (Decision change, 2026-10-23.)** The rule used to be *a line of three or more followed by a line of one*. That counts items, and counting is the wrong question. A justified row whose last button grew to fill the line has one item on it and **no hole** — there is nothing on that line to fix — while a filter row that leaves 85% of its width empty beside its last option has the same count and a hole you can see. The rule now measures the **empty space beside the stranded item** and fails it only when that hole is more than 15% of the container's width. Nothing was relaxed to make a gate pass: the threshold is a measurement, and the audit prints the hole it found, so the number can be argued with. A wrap that was genuinely forced — a tag list on a phone — reports and does not fail.

**A grid can strand an item too. (Decision change, 2026-10-23.)** The wrap rules read row-direction *flex* containers, so a grid was invisible to them — and ten chips in three columns is 3+3+3+1: the last chip alone with two empty cells beside it, a hole drawn in cells instead of lines. The audit now carries a **stranded** family: a grid whose last row holds exactly one item, with at least 20% of the container's width empty beside it. The first version of this family looked only at grids of **controls** (60% or more of the children are `a`/`button`), on the reasoning that a magazine grid with one card in its last row is editorial rhythm. **That reasoning did not survive contact with the measurement.** A lone card in a three-column grid leaves the same two empty cells a lone chip does, and the reader cannot tell the difference from a mistake — the Alpha board, the partner cards and the protocol list all had one. Every grid counts now, controls and content alike. Turning a ragged flex row into a grid is therefore no longer a way to silence the audit: the grid is measured *harder* than the flex was.

**The rule is the widow rule, in cells.** A lone item on the last row is a defect; two or more is not. That is the same line the wrap rules draw — one item on the last line is a widow, two or more is the end of a list — and a grid that leaves one empty cell in its last row is no more of a hole than a flex row that leaves a quarter of its width empty. Where a list's count does not divide its column count, the fix is one of two, and both are in the stylesheet: **the column count that divides the count** (six presets in two, three or six columns; ten cities in two or five; four presets in two or four), or **the coda** — `.coda-grid > :last-child:nth-child(odd)` and `.coda-grid-3 > :last-child:nth-child(3n + 1)` let the last card take the full width, so the row is full and the list ends on a note instead of on a stray. The `nth-child` arithmetic is the count's own remainder, so a list that grows to an even number stops needing the coda by itself.

**The row a card belongs to is the row it overlaps.** A grid row is a band of the row tracks, and an item belongs to the band it overlaps most. Grouping items by their `top` coordinate — the first version of this family — reads a vertically centred card as a new row and invents strands that are not on the page; the census that sized the scope found 2,670 strands where the real number was 268. And a child with `display: contents` is not a cell at all: its own children are, and the shell that carries them is not a row of the grid. The rankings stage dissolves its allocator shell that way, and the audit was counting the shell as a lone card in the last row until the check looked at every child instead of only the ones with a box.

**The audit is a measurement, not a verdict.** It has been wrong in both directions and was corrected each time: it called a `flex-direction: column` list a "wrap"; it called two side-by-side buttons of different heights "split" because it grouped by `top` instead of by vertical overlap; it could not see SVG at all, because an SVG element's `tagName` is `"svg"` and not `"SVG"`. A detector that cannot tell stacking from wrapping will bury the real offenders in noise. **When a gate is noisy, fix the detector — but never by relaxing it into uselessness.**

**A rule that reads a number nobody set is a rule that never fires. (2026-10-23.)** `groupLines` built each line as `{ top, bottom, items }` and every rule that measures slack asks the line how much room is left — `line.containerW - used`. The line never carried a `containerW`, so the slack was `NaN`, and `NaN` compares false against everything: the avoidable-wrap rule and the hole-beside-a-widow rule were both dead. The audit had been reporting "0 hard findings" for a layout with a chip stranded in 89% of a row, and the baseline it wrote was a record of a gate that could not see. **The mutation proof is what found it** — a case that put a known widow back into the layout and the gate passed it. That is the argument for proving every gate red: not because the gate is broken, but because the proof is the only thing that checks whether the gate is *looking* at all. A rule that has never fired is not evidence that the layout is clean; it is evidence that nobody has asked the question.

**The audit sees flex, not grid.** Its *wrap* detector reads row-direction *flex* containers; a grid is invisible to it. Turning a ragged flex row into a grid therefore silences the finding without fixing the orphan, and the row structure has to be measured by hand. The compare page's ten exclusive-city chips were exactly this case: `auto-fit` filled the first row to nine and left the tenth alone under a row of empty columns, and the gate had nothing to say about it because by then the container was a grid. The fix was the column count that *divides* the chips, not a change of `display` — and the measurement that proved it was a row census, not the gate. **The grid is not invisible any more** — the `stranded` family measures a grid's last row directly, so a control row turned into a grid is now measured harder, not quieter. A grid is also not the only way to arrange things: the bibliography is a **ruled list** in two balanced CSS columns, and a multi-column list has no rows to strand. That is a real arrangement, not an evasion — but it is the one place the audit cannot see, so a change of layout primitive there has to be judged by eye.

**The ratchet.** `system-integrity.test.mjs` refuses a NEW duplicate selector while tolerating the ones already in the file (baseline is in the test). It can only go down. If you remove a duplicate, lower the baseline in the same commit.

**If a gate fires, fix the design — do not edit the gate.** The gates encode decisions that were already made and paid for. If a rule genuinely needs to change, change it in `ANTI-SLOP.md` *and* in the gate, in the same commit, with the reason. A gate that gets edited to go green is worse than no gate: it teaches people to route around it.

### CSS refactoring

`src/styles.css` used to define the same selector in several places. Two tools now guard it:

| Tool | What it does |
|---|---|
| `scripts/css-cascade.mjs` | A real cascade model — specificity, source order, `!important`, and media queries — used by the merge tool and the fingerprint |
| `scripts/merge-duplicate-css.mjs` | `--check` to report, `--write` to merge. Merges a group of duplicate blocks into one, or **refuses** the group when no placement is provably safe |
| `scripts/verify-css-refactor.mjs` | `--against <dir>` drives a real browser over 15 routes × 3 widths and compares the **full computed style of every element**, including `::before`/`::after` |
| `scripts/measure-page-height.mjs` | Reports total scroll height and the height of every section, per route, per width. **Measure before you tighten** — every spacing decision in this repo was made against these numbers |
| `scripts/shoot-pages.mjs` | Screenshots any route at any width into a folder, for the squint test that a number cannot replace. `--selector` shoots one element, `--scroll` shoots at an offset — how a spatial offender is actually judged: you have to look at the thing, not at the whole scroll |
| `scripts/probe-box.mjs` | Dumps the box geometry of a selector — the container, its children, and the ancestor chain — plus `--band <from:to>` to find what occupies a y-range and `--at x,y` to ask the browser what is actually painted at a point |
| `scripts/audit-spatial.mjs` | The spatial-hallucination audit. `--route`, `--width`, `--json`, `--check <baseline>`, `--write-baseline <file>` — regenerate the ratchet only from a run with zero hard findings; the tool refuses to write one otherwise |
| `scripts/check-layout.mjs` | The permanent gate: drives the built site in real Chrome over 15 routes × 3 widths and fails on horizontal overflow, an uncaught exception, a broken image, or a route that never rendered |
| `scripts/check-footer-nav.mjs` | The footer-sitemap gate: drives the built site in real Chrome over 5 locales × 20 widths and fails on a hole in the sitemap — under a block of a row, or under the last block of a column — a heading repeated as its own link, a route that is no longer reachable from the footer, a wrapped label, or a navigation block taller than one screen |
| `scripts/check-masthead.mjs` | The masthead gate: drives the built site in real Chrome over 4 widths and fails on a translucent bar, a bar that is not the site's `--bg`, a bar inset from the edge of the viewport, a control that paints its own ground, a control that carries a border, or anything in the bar that floats on a shadow |
| `scripts/mutation-layout-gates.mjs` | Proves the two layout gates can fail: it puts the old footer layouts and the old masthead collage back into the built stylesheet and asserts that the gate that owns each defect catches it |
| `scripts/check-knowledge-rack.mjs` | The rack gate: the published index describes the bytes it was built from — every manifest hash matches the source, every source is indexed, the built and published catalogs are identical, the counts agree with the extracted text, and the chunks reconstruct it |
| `scripts/build_knowledge_rack.py` | The corpus pipeline: extracts `knowledge-rack/inbox/`, chunks it, and writes the built and published catalogs together. Restored from history after a "clean repo" commit deleted it while the README still told you to run it |
| `scripts/check-personal-contacts.py` | No personal emails or phone numbers anywhere in the tree. Published organisation inboxes and office switchboards are allowlisted |
| `scripts/check-author-name.mjs` | The name gate: the author's name is one fact. Every locale's author prose and citation carry the full surname, the Thai copy carries the canonical Thai form, and no wrong form appears anywhere in the source tree |
| `scripts/query_knowledge_rack.py` | Ask the rack locally: retrieval only, prints the best-matching passages from the indexed documents |

**The browser is the proof; the fingerprint is not.** A cascade fingerprint buckets rules by selector text, so it evaluates each selector *in isolation*. Two selectors can only interact when they match the same element, which the fingerprint cannot see. Two real bugs came out of this, both caught by the browser and neither by the fingerprint:

- `.mh-panel-link` and `.mh-panel-link--active` have the same specificity. Writing the merged `.mh-panel-link` block at the group's **last** position pushed it after `--active`, and the active nav link stopped looking active.
- `@media (max-width: 768px)` and `@media (max-width: 430px)` are **cumulative**, not exclusive — a 430px viewport satisfies both. Treating each query as its own context let a merge change the homepage headline size on a phone.

So: **merge, then prove it in a browser, every time.** Run `node scripts/verify-css-refactor.mjs --against <pre-change build>` before you trust a CSS refactor.

### Things that look like slop but are not

Do not "fix" these — they were examined and kept:

- **Keyboard glyphs** (`⌘K`, `↑↓↵`, `esc`) are affordances, not emoji.
- **Focus rings** are WCAG requirements, not fake depth. They are exempt from the shadow cap.
- **The three tier hues** (`--accent-cyan`, `--accent-red`, `--accent-blue`) are categorical data-viz for the Alpha/Beta/Gamma badges. Amber is the sole *brand* accent; the three status colours are *data* colours.
- **Photo zoom on hover** is legitimate — the cursor lands on an actual `<img>`, so the zoom *is* the affordance. Named as carve-outs in the gate.
- **The CTA's ink-fill animation** (`.v3-cta:hover::after`) slides a pseudo-element in, not the surface. The button never moves.
- **The mobile full-width hero CTA stack.** On a phone the hero's actions stack one per line, full width. That is the deliberate mobile pattern, not a wrap to be fixed.
- **A forced wrap.** A tag list, a chip row, a filter row that runs out of room: the width made it happen and the layout is working. The spatial audit reports these; it does not fail them.

## Tech Stack

- React 19 + TypeScript 5.8 + Vite 6
- No Tailwind — custom CSS only in `src/styles.css` (12,960 lines, editorial "Monocle meets Red Dot" aesthetic)
- First-party visitor aggregates: Pages Worker + D1; no login. Supabase is a retired optional adapter, not imported by production.
- Cloudflare Pages deployment (root base path `/`)
- Cloudflare Pages Worker (`public/_worker.js`) enforces edge request boundaries, returns 400 on path-traversal attempts, returns 405 on non-GET/HEAD, masks server errors

## Build & Run

```bash
npm run dev               # Vite dev server on port 5173
npm run build             # vite build → dist/
npm run preview           # Preview built site
npm run typecheck         # tsc --noEmit — passes clean (0 errors)
npm run test              # node --test — 126/126 pass
```

The full release gate is `npm run verify:release` — typecheck + build + tests + check:publication + check:csv + check:methodology + check:translations + check:audit + check:numbers + check:layout + check:spatial + check:footer-nav + check:masthead + check:spider-drag + check:figures + check:clearance + check:shipability + check:knowledge-rack + check:author-name + check:contacts. Exits non-zero on any failure. `check:layout` drives the built site in real Chrome, so it only means something after a build. The new `check:audit` runs `scripts/audit-data-integrity.mjs`, which catches identity / ranking / scoring / coverage / metric / cross-artifact / hash drift issues. **`check:spatial` runs the dense ladder — 1,215 page loads, about twenty minutes** — because the baseline it compares against is a dense one; `npm run check:spatial:fast` is the three-width version for a quick look, and it is not the gate.

## Project Structure

```
src/
├── App.tsx                    # Router, locale detection, view transitions
├── HomePage.tsx               # Op-ed editorial homepage with allocator
├── RankingsPage.tsx           # Interactive ranking with ZeroSumAllocator
├── CityScorecardPage.tsx      # Per-city detail page (metrics, sources, scores)
├── MethodologyPage.tsx        # Technical deep-dive with equations
├── CompareRankingsPage.tsx    # Compare SLIC vs EIU, Mercer, Resonance, etc.
├── SideBySidePage.tsx         # Head-to-head city comparison
├── ThailandPage.tsx           # Thailand regional deep-dive
├── IdeasPage.tsx              # Steal-this-idea editorial
├── SlicProfilePage.tsx        # About SLIC
├── HistoryPage.tsx            # Development timeline with photos + version archive
├── ExercisePage.tsx           # City matching tool
├── AwardsPage.tsx             # Submission dossier for Red Dot / DEmark / CEA / TFA
├── EssayPage.tsx              # Long-read essay
├── MapPage.tsx                # Global city map
├── DataSourcesPage.tsx        # Per-source data integrity panel
├── ZeroSumAllocator.tsx       # SVG radial spider chart + linear sliders
├── KnowledgeRackPanel.tsx     # Knowledge-rack Q&A
├── SiteMasthead.tsx           # Fixed header with logo + nav
├── SiteFooter.tsx             # Footer with collaboration logos
├── brandAssets.ts             # Logo definitions (SLIC, ReTL, DEPA, etc.)
├── siteCopy.ts                # All UI text in 5 locales (en, th, zh, ko, ja)
├── rankingsData.ts            # City scores, regions, metadata (~3100 lines)
├── methodologyData.ts         # Methodology content, references, equations
├── compareRankingsData.ts     # Competitor index comparison data
├── publicationMath.js         # Canonical scorer: pillar weights, AMPI math, metric catalog
├── publicTierPolicy.js        # Alpha/Beta/Gamma tier allocation rules
├── consequenceRules.ts        # ZeroSumAllocator rule enforcement (draft/reference — not the ranking scorer)
├── visitorTracking.ts         # Retired Sheets/Supabase adapter; not imported by production
├── firstPartyTraffic.ts       # Bounded session writes and aggregate reads from /api/traffic
├── locale.ts                  # The locale, decided once — the app and the font boot script share it
├── webFonts.ts                # The web fonts, per locale: Latin everywhere, one script family for the reader's locale
├── bootFonts.ts               # Requests the right font stylesheet before the app mounts
├── thumbs.ts                  # The thumbnail of a picture for the box it is painted into
├── TrafficPage.tsx            # Historical/live worldwide reach, separate counting measures
├── styles.css                 # Complete design system (12,960 lines, all design tokens)
└── data/
    ├── publishedRankingData.json   # ~1.7MB — all 163 cities with per-metric sources
    ├── publicationFacts.json       # The shell's facts (163 cities, score range, date) — derived from the bundle by scripts/derive-publication-facts.mjs
    ├── thumbnails.json             # Which thumbnail serves which picture, at which width
    ├── thumbnail-provenance.json   # The hash of every source a thumbnail was made from
    ├── methodologyFacts.json       # Awards-page facts (sourced from the bundle)
    ├── slic_city_universe.csv      # 353-city roster
    └── slicScoringManifest.json    # Scoring configuration

public/
├── _headers                   # Cloudflare Pages response headers (HSTS, CSP, etc.)
├── _redirects                 # /* → /index.html 200 (SPA routing)
├── _worker.js                 # Cloudflare Pages Worker: path-traversal block, method allow-list, HTML-fallback rejection
├── request-policy.js          # Used by _worker.js to classify request paths
├── route-restore.js           # Runs from index.html, decodes GitHub-Pages-style ?p= redirects
├── robots.txt                 # Allow all + GPTBot/ClaudeBot/PerplexityBot/Google-Extended allow-list + Sitemap directive
├── sitemap.xml                # 15 routes, hreflang for 5 locales on the home URL
├── site.webmanifest           # PWA manifest, root-relative icon paths
├── og-card.png                # 2400×1260 OG image (declared 2400×1260 in index.html)
├── Logos/                     # SLIC Index, ReTL, DEPA, Smart City Thailand, UWN logos
├── photos/                    # Editorial photos (city, profile, report)
├── launch-photos/             # 2026 Smart City Summit + GitX + LEAP East + Tomorrow City + Osaka + Asia Roundtable launch trail
├── history-photos/            # Timeline page photos
├── version-archive/           # V1/V2/V2.5 version-archive screenshots (referenced from HistoryPage)
├── downloads/                 # CSV, methodology PDFs (en/th/zh), PPTX decks, xlsx template
├── thumbs/                    # The pictures the pages actually show, sized to their box (generated by scripts/generate-thumbnails.mjs)
└── knowledge-rack/            # Knowledge base data (Q&A catalog)
```

## Scoring System

- **5 pillars:** Growth (25%), Viability (22%), Capability (18%), Community (15%), Creative (20%)
- **22 scored metrics + 3 diagnostics** (25 in metric catalog) normalized to 0–100 via fixed piecewise linear anchors
- **Aggregation:** Adjusted Mazziotta–Pareto Index (AMPI) — penalizes imbalance
- **Coverage grades:** A (full), B (−5 penalty), C (−15 penalty, provisional)
- **No imputation** — missing data is excluded, not fabricated
- **Absolute scoring** — adding new cities never changes existing scores

Full specification: `docs/v3-absolute-scoring-specification.md`

## Data Sources

All metrics in `publishedRankingData.json` include `source`, `sourceUrl`, and `dataLevel` fields.
Primary sources: World Bank, IMF, OECD, WHO, UNODC, Numbeo, IQAir, Freedom House, WIPO, UNESCO.
See methodology PDF for complete source table.

## Branding

- **Design aesthetic:** "Jony Ive meets Dieter Rams" — Red Dot Design Award quality
- **Wordmark:** one mark, two surfaces, one rule. The bar is one opaque cream band, so the mark sits on the cream and must carry no plate of its own. `SiteMasthead.tsx` renders the **real artwork**, `public/Logos/slic-index-mark.png`, keyed off its paper by `scripts/build-brand-mark.py` — the same file the footer already loads, so it costs no extra request. `BrandLockup.tsx` renders the same file. The old `public/Logos/slic-index-full.png` is a 400×400 square PNG with an opaque ground — it stays in the repo for the other projects that reference it, but no surface here may load it, and the mark must never get a CSS background. Do not reintroduce either failure. Gated by `test/system-integrity.test.mjs`.
- **The mark is delivered at the size it is used.** It is painted at 68px in the masthead and 72px in the footer, so the derived file is written at 160px — 2× the box — and the monogram at 336px. A 389px wordmark painted into 68px is five times the pixels any screen can show, on every route, and the provenance recorded the size so nobody would notice. **The delivery size is part of the derivation**: `scripts/build-brand-mark.py` writes it, `scripts/brand-mark.provenance.json` records it, and the integrity gate compares the bytes. The partner marks are sized the same way by `scripts/generate-thumbnails.mjs`, which keeps the keyed originals and serves the picture the row can show.
- **The bar is one ground, one treatment.** It used to be a translucent dark plate inset inside the viewport, and inside it a search button with its own plate, a ⌘K keycap with a box, a native select with the browser's own white card glued to it, and a burger with a border: five nested treatments, none of them earning its place. Now the band is opaque cream, full bleed, with a hairline rule at the bottom, and every control in it is a bare mark on that ground. Nothing in the bar paints a background, carries a border, or floats on a shadow. Gated by `scripts/check-masthead.mjs`.
- **Tech partner:** ReTL (The Reason to Live Company) — replaced Axiom AI
- **The row of key supporters.** The footer carries one line of marks: RCAD (รวพ.), depa, Smart City Thailand Office, ReTL, Axiom, and SLIC's own monogram, in that order. **UWN (PMU-A) is out** — it is now a unit inside RCAD, and the roster names the agency, not the unit. Two rules hold it together:
  - **Every mark is keyed off its paper.** The sources live in `logo-sources/logos/` and are not published; `scripts/build-partner-logos.sh` writes transparent PNGs to `public/Logos/`. A mark that still carries its white plate shows a rectangle on the cream. Never hand-edit a keyed PNG — re-run the script.
  - **The row is one line and carries no boxes.** It used to be four logos in four bordered boxes, wrapped onto two rows, with a hole in the corner. The strip must not wrap, must not paint a background, and the per-logo frame must not come back. All three are gated.
- **Shared brand assets:** `/Users/nonarkara/Projects/_reference/brand-assets/`

## Design System (CSS)

- **Fonts:** Jost (display headings — the Bauhaus/Bayer geometric that `test/design-slop-invariants.test.mjs` itself names when it says "use a Bauhaus/Bayer lookalike instead"; it replaces Source Serif 4, whose pairing with Source Sans 3 was the default every generated site ships), Source Sans 3 (body), JetBrains Mono (data). Jost carries `tnum`, so the tabular-numeric scores do not jitter.
- **Colours are tokens, not literals.** The ground is cream `--bg: #f7f5ef`, the ink is `--text: #111314`, amber is `--accent-amber: #f99d1b` for fills and `--accent-amber-text: #a04e20` (5.32:1 on cream, AA-compliant) for body text. Dark blue is `--accent-blue: #12354e`, red is `--accent-red: #a72144`, teal is `--accent-cyan: #1a6b5a`. The three tier hues are categorical data-viz, not brand decoration — see "Anti-Regression — Do Not Touch".
- **A colour used more than once must be a token.** Single-use local shading (a pillar's own tint, the weight-segment greyscale ramp) is allowed to be a literal; anything used twice is forked palette and fails the gate.
- **Dark sections:** Spider/allocator area uses inverted colours (`--text-inverse`)
- **Motion:** `cubic-bezier(0.16, 1, 0.3, 1)` easing, 80–120ms transitions

## Deployment

```bash
npm run build                              # Generate dist/
git add -A && git commit -m "..."          # Commit
git push origin main                       # Push to main
npx wrangler pages deploy dist --project-name slic-index --branch main
```

The `dist/` directory is committed to the repo (this is what the deploy script ships). Cloudflare Pages serves from the `main` branch via wrangler.

## Release verification

```bash
npm run verify:release   # full gate — typecheck, build, test, check:publication, check:csv, check:methodology, check:translations, check:audit, check:numbers, check:layout, check:spatial (dense, ~20 min), check:footer-nav, check:masthead, check:spider-drag, check:figures, check:clearance, check:shipability, check:knowledge-rack, check:author-name, check:contacts
```

## Key Rules

- All photos must load — no broken images. Check `public/` assets before referencing.
- Every city score must trace to a source. Check `publishedRankingData.json` metrics.
- CSV export at `public/downloads/slic-ranked-cities-v2.csv` must match published data.
- Methodology PDF must be comprehensive and current.
- No "SLIC logo" — always "SLIC Index" branding.
- ReTL is the tech partner (not Axiom).
- **Five locales: EN / TH / ZH / KO / JA** — do not drop any. Thai first-person pronoun is strictly "ผม".
- **The footer navigation is a sitemap, not a layout.** Its columns are packed, and the way they are packed is structural: a group's links run on **one line**, separated by a middot, so every block in the sitemap is about the same height. That is what makes holes impossible — unequal blocks cannot share a row without leaving one. No block may leave more than 36px of empty space under it, either beside it (under the short block of a row) or below the block (a column that stops short of the bottom); a heading never repeats one of its own links (the heading becomes that link instead, so the word is printed once); and every published route stays exactly one click away. `npm run check:footer-nav` fails the build otherwise.
- **The masthead is one cream band, and the controls in it are bare marks.** No plate, no keycap box, no native select card, no burger border, no glass. The mark is the brand's own keyed artwork, so it has no cut-out edge on the cream. `npm run check:masthead` fails the build otherwise.
- Cloudflare Worker in `public/_worker.js` enforces path-traversal block + GET/HEAD allow-list + HTML-fallback rejection. Don't bypass.

## Cross-Agent Sync Note

- Keep `src/data/publishedRankingData.json` and `public/downloads/slic-ranked-cities-v2.csv` aligned when city metrics change. After any data edit run `npm run rescore && node scripts/update-csv.mjs` to republish. rescore re-stamps the publicationManifest hashes itself, under its own sorted-key canonicalisation — do not hand-edit them.
- `src/cityBenchmarks.ts` currently exists as draft/reference copy and is not imported by the app. Treat edits there as non-user-facing unless the component is wired back into the UI.

---

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 (The Codex Incident — Anti-Regression Laws) for the full rules. These items are the personality of SLIC Index V3. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval:

- **163-cities ranking grid (158 ranked + 5 watchlist)** — the core artifact. Do not reduce the city count, do not swap in a generic table component.
- **5-pillar scoring layout** — the five pillars are the IP. Do not collapse into a single score or a generic bar chart.
- **Custom CSS only — NO Tailwind.** Do not introduce Tailwind, shadcn, or any utility-class framework. The bespoke CSS is the aesthetic.
- **"Monocle meets Red Dot" type scale** — editorial typography, hairline rules, mono numerics. ZERO border-radius. ZERO gradients.
- **Five-locale switch (EN / TH / ZH / KO / JA)** — five languages, not three. Do not drop any locale. Thai first-person pronoun is strictly "ผม".
- **Published ranking data triplet** — keep `src/data/publishedRankingData.json` and `public/downloads/slic-ranked-cities-v2.csv` aligned. Their content hashes in `publicationManifest.{normStatsHash,metricCatalogHash}` are re-stamped by `npm run rescore` itself. Never hand-edit them, and never recompute them with a different serialization than the pipeline uses — the audit hashes with the same recursive key sort as rescore and will fail the build if the two disagree.
- **Tier status colors are an intentional §14 exception (approved 2026-07-05).** `--accent-cyan`, `--accent-red`, `--accent-blue` coexist with `--accent-amber` *by design* — they are semantic traffic-light encoding for the Alpha/Beta/Gamma tier badges and data-level chips, not brand decoration. This is categorical data-viz, which a ranking index legitimately needs. Do NOT "fix" them to amber-only for §14 (one-amber) compliance — collapsing tier hues would destroy information. Amber remains the sole *brand* accent; the three status colors are *data* colors.

If you are about to remove, replace, or "simplify" any item above: stop, show the diff, wait for explicit approval.
