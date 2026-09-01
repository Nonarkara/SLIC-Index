# Lessons · SLIC Index v3 (slic.nonarkara.org)

Corrections log. Updated after every mistake. **Read at the start of every session.**
Per §13: the same mistake never happens twice.

---

## 2026-05-26 · Bootstrap: §13 adopted

- **What went wrong:** n/a — first entry
- **Correct behaviour:** Log every correction here. Read before each session.
- **How to recognise:** Any time you repeat a fix you've already made.

---

## 2026-05-26 · GitHub Actions CI token expired — manual deploy required

- **What went wrong:** Pushing to main triggers CI that fails silently with code 9109 (invalid token).
- **Correct behaviour:** Deploy manually: `npm run deploy:gh` (runs vite build + wrangler pages deploy). The GH secret CLOUDFLARE_API_TOKEN needs renewal before CI works again.
- **How to recognise:** CI green but site not updated. Or CI red with "9109" / "invalid token" in logs.

---

## 2026-05-26 · Node.js 20.x required

- **What went wrong:** n/a — reminder
- **Correct behaviour:** `engines.node: "20.x"` in package.json. Always verify `node --version` before running build commands.
- **How to recognise:** Build fails with cryptic errors on Node 18 or earlier.

---

## 2026-05-26 · Custom CSS only — no Tailwind

- **What went wrong:** n/a — reminder
- **Correct behaviour:** This project uses custom CSS only. Never install or import Tailwind. Design tokens in `src/styles/`.
- **How to recognise:** Any `className="text-xl flex"` pattern = wrong project. SLIC uses class names like `city-card`, `score-bar`.

---

## 2026-05-26 · Thai/Chinese script font fallback was system-default

- **What went wrong:** The CSS only loaded Latin webfonts (Libre Baskerville,
  Inter, JetBrains Mono). Thai glyphs fell back to the OS default — Sukhumvit
  Set / Thonburi on macOS, Leelawadee UI on Windows, Sarabun-like faces on
  Android. All three have prominent หัว head-loops, which workspace §0
  explicitly forbids ("non-looped only — STRICT"). Chinese glyphs fell back
  to PingFang SC / Microsoft YaHei with the same cross-platform inconsistency.
- **Correct behaviour:** `:lang(th)` and `:lang(zh)` selectors in styles.css
  force IBM Plex Sans Thai / Noto Sans SC respectively (loaded via Google
  Fonts), with `!important` to defeat the 251 explicit `font-family:` rules
  in the design system. Latin code paths still get Libre Baskerville / Inter
  / JetBrains Mono because the `:lang()` overrides are scoped by the
  `<html lang>` attribute (App.tsx mirrors locale → lang).
- **How to recognise:** If a Thai glyph has a visible loop at the head of any
  letter on the site, the font stack regressed. Screenshot Thai homepage and
  compare against IBM Plex Sans Thai sample on Google Fonts.

---

## 2026-05-26 · README drifted three counts behind the live state

- **What went wrong:** README claimed "157 cities. 5 pillars. 35 signals",
  "Six-index comparison", "GitHub Pages + Vercel deployment", and "Axiom AI"
  as partner — all stale. Live state is 158 ranked + 5 watchlist (163 total),
  22 scored signals + 3 diagnostics, ten-index comparison, Cloudflare Pages
  primary + GH Pages mirror, and Axiom × ReTL as tech partner.
- **Correct behaviour:** Whenever a methodology version bump lands (anything
  that updates `methodologyFacts` in publishedRankingData.json), grep the
  README for `cities|signals|indices|Vercel|Axiom|GitHub Pages` and
  reconcile. Better still: when adding a new index to compare or a new
  metric to the pillars, update the README in the same commit.
- **How to recognise:** README counts that don't match
  `publishedRankingData.json → methodologyFacts.cityCount/rankedCityCount/
  scoredMetricCount`. Or compare-page H1 "Ten indices" not matching README
  "Six-index".

---

## 2026-05-26 · PDF author metadata read "OpenAI Codex"

- **What went wrong:** `scripts/generate_methodology_pdf.py` set the PDF
  `/Author` field to "OpenAI Codex". That metadata is visible in any PDF
  reader's Get Info pane to anyone Non shares the methodology paper with.
- **Correct behaviour:** Author = human authors (Dr. Non Arkara & A.P. Poon
  Thiengburanathum). Creator/Producer = "SLIC Index methodology engine".
  Subject line populated. Regenerated all three locale PDFs.
- **How to recognise:** `python3 -c "from pypdf import PdfReader; print(
  PdfReader('path').metadata)"` — author should never be an LLM brand name.

---

## 2026-05-26 · Defensive duplicates in policy lists leaked into UI copy

- **What went wrong:** `publicTierPolicy.js` kept both "Košice" and "Kosice"
  in `alphaCityExclusions` so matching worked against either dataset spelling.
  Methodology page + homepage joined the array directly into human copy,
  rendering "...Athens, Prague, Košice, Kosice barred from Alpha..." — reads
  as a typo.
- **Correct behaviour:** Add a display helper alongside the raw policy data.
  `getDisplayAlphaCityExclusions()` strips diacritics for dedup, keeps first
  occurrence (canonical "Košice"). Matching logic still uses the raw list.
  Drift check updated to accept the new function reference.
- **How to recognise:** Any policy list that lives in source data AND surfaces
  in human-readable copy. If you see two near-identical strings joined by
  comma in the rendered UI, the source data has a defensive duplicate that
  needs a display-only normalization layer.

---

## 2026-05-26 · Awards-pass — three more lessons

### CSV preamble breaks the row-count invariant

- **What went wrong:** Added `# ...` comment lines to the CSV header for
  juror-readable provenance. Test invariant 13 counted total lines and
  failed (164 lines vs expected 159 = ranked 158 + header 1).
- **Correct behaviour:** Update the invariant to strip `#` lines before
  counting. Comment-prefix convention is intentional and tools that read
  the CSV (pandas, jq + ad-hoc shell) honor `comment="#"`. Excel renders
  them as label rows in column A — still readable.
- **How to recognise:** Any test that does `lines.length === N` on a file
  that now carries metadata preamble.

### Cloudflare Pages `_redirects` doesn't actually rewrite — it 404s with SPA bootstrap

- **What went wrong:** Assumed `_redirects` rule `/*  /index.html  200`
  would make `curl https://slic.nonarkara.org/awards` return 200. It
  doesn't — CF Pages serves the static 404.html (with status 404) for
  any path that isn't a file. The 404.html's `<script>` then redirects
  to `/?p=awards`, the SPA bootstraps from `index.html`, reads the `?p=`
  query, and `replaceState`s back to `/awards`. Works in browsers, looks
  broken to curl.
- **Correct behaviour:** This is by design since `588e448`. Don't try to
  "fix" it — the redirect dance is the SPA fallback strategy. Verify
  new routes work by clicking through in a real browser, not by curling.
- **How to recognise:** `curl https://slic.nonarkara.org/<route>` returns
  404 but the body contains "SLIC Index Route Restore" — that's the
  bootstrap path. Working as intended.

### Footer opacity at 0.55 fails WCAG AA contrast on cream background

- **What went wrong:** Set `.site-footer-citation { opacity: 0.55 }` for
  a "subtle protocol stamp" look. On `#f8f5f0` cream background that
  produces ~3.8:1 contrast against the `#1c1914` foreground — under the
  4.5:1 threshold for 11px body text.
- **Correct behaviour:** Compute the effective rgb after opacity blend
  against the actual background before picking the value. For cream
  `#f8f5f0`, opacity ≤ 0.6 generally fails. 0.7 lands at ~5.5:1 — safe.
- **How to recognise:** Tracked-out mono text on cream that fades to gray.
  Check with a contrast checker BEFORE shipping. §11.10 is non-negotiable.

---

## 2026-05-27 · 404.html redirect loop on Cloudflare (previous lesson was wrong)

- **What went wrong:** An earlier lesson (2026-05-26, "Cloudflare Pages `_redirects` doesn't actually rewrite") stated that the 404-bootstrap pattern was "working as intended since 588e448" and that `curl` returning 404 was expected. This was incorrect — the 404.html script was designed for GitHub Pages where `l.pathname.split('/').slice(0,2)` yields the `/SLIC-Index` base. On Cloudflare (no subdirectory), slice(0,2) yields the SAME path that triggered the 404 (e.g. `/rankings`), so the redirect target is `/rankings/?p=rankings` — also a 404 — creating an infinite loop. The prior lesson was tested by clicking nav links inside the SPA (which use `pushState` and never touch 404.html), not by navigating directly to a non-root URL.
- **Correct behaviour:** The 404.html script must compute `repoBase` by checking whether the first path segment matches `SLIC-Index` (GitHub Pages only). On Cloudflare (no match), `repoBase` is empty and the redirect goes to `/?p=route` (HTTP 200). This is the fix in commit `8c92afa`.
- **How to recognise:** If navigating directly to `slic.nonarkara.org/rankings` in a fresh browser tab shows the error boundary or a blank page (not the rankings), the 404 bootstrap is broken. Test by copying a deep URL and opening it cold — not by clicking through the nav.

---

## 2026-05-28 · coverageGrade missing from publishedBoard → 0 Alpha cities on homepage

- **What went wrong:** `publishedBoard` in `HomePage.tsx` maps city objects from `rankingPublication.cities` into a `HomeCity` interface that did not include `coverageGrade`. `allocatePublicTiers` calls `meetsCoverageFloor(city, "A")` which reads `city.coverageGrade`. With that field `undefined`, `coverageRank(undefined)` returns 0, which fails `>= coverageRank("A")` for every city. Result: `tieredResults.alpha` was always empty — the hero Alpha grid rendered with 0 city cards. The bug was introduced in commit `10034b7` ("methodology: A-grade coverage floor for Alpha") which added the coverage check without adding `coverageGrade` to the `publishedBoard` map. It became visible after the 404 redirect loop fix (Pass 4) allowed the homepage to load correctly for the first time.
- **Correct behaviour:** Any property that `allocatePublicTiers` (or any policy function) reads from a city object must be present in the `publishedBoard` map AND in the `HomeCity` interface. Fix: add `coverageGrade: city.coverageGrade ?? null` to the map, and `coverageGrade: string | null` to the interface.
- **How to recognise:** Homepage Alpha grid shows the badge and title but no city cards. The `v3-alpha-grid` DOM node has 0 children. `tieredResults.alpha.length === 0` when the published data clearly has 10 alpha cities. Check `meetsCoverageFloor` and verify that every field it reads is present in the city objects passed to `allocatePublicTiers`.

---

## 2026-05-27 · Housing burden → Housing price pressure label propagation

- **What went wrong:** When renaming a metric's display label, multiple layers must be updated together: `publicationMath.js` (scored metrics list), `publishedRankingData.json` (metricCatalog + per-city entries), `slicScoringManifest.json` (metric_name + input label), `scoringEngine.ts` (JSDoc comment), `methodologyData.ts` (EN/TH/ZH methodology content + changelog), `CityScorecardPage.tsx` (METRIC_LABELS), and `docs/v3-absolute-scoring-specification.md` (spec table).
- **Correct behaviour:** Before renaming any metric display label, grep for the existing name across all of the above files. Make all changes in a single commit so the data pipeline stays consistent. Run `npm run verify:math` after — the 21 invariants will catch any metric catalog / scoring manifest drift.
- **How to recognise:** `npm run check:methodology` fails with drift errors if the label is updated in some layers but not others.

---

## 2026-06-01 · Partial locale expansion must be an explicit contract

- **What went wrong:** Korean and Japanese were added as valid UI locales, but several long-form components still only carried English, Thai, and Chinese copy. Typing those objects as `Record<Locale, ...>` made `npm run typecheck` fail; weakening the locale type or copying placeholder text everywhere would hide the real publication state.
- **Correct behaviour:** English, Thai, and Chinese are the fully translated core locales. Korean and Japanese are valid extended UI locales that may fall back to English on long-form surfaces until full translations land. Use `LocalizedRecord<T>` and `pickLocale(copy, locale)` from `src/i18n.ts` for that case. Use `Record<Locale, T>` only when every locale is complete.
- **How to recognise:** TypeScript errors that say an EN/TH/ZH object is missing `ko` and `ja`, or props that reject a full `Locale` because the child component only accepts `"en" | "th" | "zh"`.

---

## 2026-06-01 · Release completeness needs one command

- **What went wrong:** The repo had strong individual gates (`verify`, publication integrity, methodology drift) but no single command that meant "safe enough to ship or submit." That makes historical handoff fragile because different collaborators may run different subsets.
- **Correct behaviour:** Run `npm run verify:release` before deployment, award submission, public teaching, or archival handoff. The command chains typecheck, production build, tests, publication integrity, and methodology drift checks. Keep the checklist in `docs/RELEASE-COMPLETENESS-GATE.md` current.
- **How to recognise:** A change touches ranking data, tier rules, methodology copy, locale coverage, or downloadable artifacts and someone asks "is it complete?" The answer should be the release gate result, not memory.

---

## 2026-06-01 · Full Korean + Japanese i18n expansion — 23 files, 7 parallel agents

**What this was:** A complete fifth-and-sixth locale rollout for SLIC Index V3. Korean (`ko`) and Japanese (`ja`) were added across every surface in the codebase — all navigation, all page chrome, all UI strings, all data labels, pillar labels, tier labels, metric names, country/region copy, editorial sections, scoring explanations, and long-form methodology content.

**Scope (23 source files touched):**
- Infrastructure: `src/types.ts`, `src/i18n.ts`, `src/siteCopy.ts`, `src/LocaleSwitch.tsx`, `src/styles.css`, `src/cityTimezones.ts`
- Router + nav: `src/App.tsx`, `src/SiteMasthead.tsx`
- Page components: `src/HomePage.tsx`, `src/RankingsPage.tsx`, `src/CompareRankingsPage.tsx`, `src/SideBySidePage.tsx`, `src/MapPage.tsx`, `src/CityScorecardPage.tsx`, `src/DataSourcesPage.tsx`, `src/ThailandPage.tsx`, `src/IdeasPage.tsx`, `src/AwardsPage.tsx`, `src/HistoryPage.tsx`, `src/EssayPage.tsx`
- Data/content: `src/ideasData.ts`, `src/slicProfileData.ts`, `src/methodologyData.ts`

**Architecture decisions locked:**

1. **`CoreLocale = "en" | "th" | "zh"` vs full `Locale`** — `methodologyData.ts` has full en/th/zh translations (~600 lines each). ko/ja use `localizeMethodologyFallback()` which takes the English base and swaps the tier protocol rule, Singapore rule, and source tiers for localized equivalents. This is architecturally honest: a 6,000-word technical methodology paper needs real translation, not placeholder text. The fallback ensures ko/ja users see correct structural data while the full literary translation waits for a dedicated translation pass.

2. **`LocalizedRecord<T>` pattern for optional locale completeness** — `src/i18n.ts` exports `type LocalizedRecord<T> = Record<CoreLocale, T> & Partial<Record<ExtendedLocale, T>>` for cases where ko/ja are optional. Use `Record<Locale, T>` only when every locale is genuinely complete. TypeScript enforces this.

3. **EssayPage multilingual strategy (the "ikigai" work)** — The essay is personal journalism by Nontawat Arkara, written in English. Full literary translation would lose voice and require a different author. Solution: native-language abstract (4 paragraphs, ~200 words each) above the English essay body, all chrome (title, subtitle, eyebrow, section headers, pull quotes, captions, references header) in user's locale, plus an honest language note. This mirrors how FT/Economist handle long-form editorial. The abstract describes: Kenny the expat, Chen the infrastructure builder, the corn vendor outside the Marriott, and SLIC's limits as a tool. CSS: `.essay-abstract`, `.essay-abstract-label`, `.essay-lang-note`.

**Pillar labels established (canonical for all future ko/ja work):**
- Korean: Growth=성장, Viability=생활가능성, Capability=역량, Community=커뮤니티, Creative=창의성
- Japanese: Growth=成長, Viability=生活持続性, Capability=能力, Community=コミュニティ, Creative=創造性

**Register used:**
- Korean: 합니다/입니다 formal polite (academic/civic context)
- Japanese: です/ます formal polite

**Number formats:** `ko: "ko-KR"`, `ja: "ja-JP"` via `Intl.NumberFormat`

**Font stacks added to `styles.css`:** `:lang(ko)` → Noto Sans KR; `:lang(ja)` → Noto Sans JP (Google Fonts import added)

**Parallel agent strategy used:** 7 agents ran sequentially-then-in-parallel across the 23-file surface. Each agent received exact file paths, line ranges, terminology maps, and register instructions. Agents reported clean builds individually. Final verify:math ran 21/21 pass after all agents completed.

**Lesson:** When expanding locales, establish the pillar/tier/register terminology first (a terminology map document) before dispatching agents. That map prevents inconsistent translations where different agents independently coin different terms for the same concept.

---

## 2026-06-01 · Native-speaker audit before ambassador distribution

- **What went wrong:** After completing ko/ja i18n expansion across 23 files using AI translation, the output was nearly ambassador-ready but contained ~120 issues: critical meaning errors (균형=balance where "tradeoffs" was intended; 합리적인=rational where "affordable" was intended; 지속가능성=sustainability used for the Viability pillar), register errors (감사된/監査済み meaning "financially audited" used in data-validation context), domain-term errors (宜居性 is Chinese not Japanese; ケイパビリティ and クリエイティブ were business jargon where 能力 and 創造性 are the academic standard), a factual typo (author's name "Non Arkara" corrupted with Cyrillic characters in one locale), and cross-file pillar label inconsistencies (RankingsPage and CityScorecardPage used different Japanese terms for the same pillar).
- **Correct behaviour:** Before showing any locale expansion to a native-speaker audience (especially ambassadors, academic peers, or award jurors), run a full audit pass with a native-speaker prompt — not just a build/typecheck pass. The audit found issues that TypeScript and the 21 invariants cannot catch: wrong register, wrong domain vocabulary, meaning inversions, cross-file inconsistencies. Treat locale expansion as two-phase: (1) machine-assisted translation pass, (2) native-register audit pass. Neither is optional.
- **How to recognise:** Any i18n expansion > 5 files, or any locale going to a professional/formal audience, needs the audit. Symptoms: a native speaker's first reaction is hesitation rather than approval. TypeScript can be clean with 21/21 invariants passing while meaning errors remain invisible.

---

## 2026-06-03 · Bangkok methodology audit — four structural findings

- **What was verified:** Bangkok's Alpha placement was audited metric by metric against P5/P95 normalization anchors. All 17 scored metric formulas are mathematically correct. All 5 Alpha gates are genuinely cleared. The claim "17 cities ranked above Bangkok fail gates Bangkok clears" was confirmed (26 country-blocked, 16 threshold/coverage failures).

- **Finding 1 — Creative pillar vs Cultural creative economy:** Bangkok's Creative score (44.5) is correct for what the pillar measures: formal knowledge-economy production (startups, R&D, FDI flows). Bangkok's actual creative capital — food scene, nightlife, entertainment, kathoey culture, Muay Thai, Thai massage — registers in the Community pillar instead (Hospitality 100.0, Cultural vitality 75.1). The pillar name "Creative" creates a misread. Fix: clarify in methodology text and in Bangkok's editorial that Bangkok's creative output lives in Community, not Creative. Korean cities outscore Bangkok on Creative purely because Korea's national R&D/GDP ratio (5.21%) is applied to every Korean city including port and manufacturing cities — this is technically accurate but creates the misleading impression that Incheon beats Bangkok on creativity.

- **Finding 2 — Digital infrastructure unit mismatch:** 131/158 cities use World Bank fixed broadband subscriptions per 100 people. ~6 cities including Bangkok use Ookla Mbps speed. These are different dimensions on the same scoring axis. Bangkok at 28.4 Mbps scores 61.3; on the WB-equivalent metric it would score approximately 24. Bangkok's digital score is inflated ~37 points relative to peers measured on the WB dimension. Additionally, 28.4 Mbps appears pre-2024 — Bangkok's actual fixed broadband is now 100+ Mbps. Both issues need a v3.5 data pass: standardize to one unit across all cities.

- **Finding 3 — Transit metric globally dormant:** Only 7/158 cities have transit data and normStats p05/p95 are null/null, so the metric scores null for all cities. The 7 cities with data mix incompatible units (modal share % vs commute minutes). Transit cannot activate until unit is standardized and ≥20 cities populated. This is documented on the methodology page. Adding Bangkok transit data now would NOT help (the global normStats gap blocks all scores).

- **Finding 4 — Methodology metric weights were wrong in user-facing docs (fixed this session):** Three Growth weights (DI_PPP 9→8, Debt 4→2, Suicide 3→4) and three Community weights (Hospitality/Tolerance/Cultural: all 5→4/4/3) were stale. The spec also said "20 scored metrics" but live scorer has 22. A reader following the declared weights would have gotten systematically wrong reproduction results. Fixed in methodologyData.ts, spec doc, and growthPillarFormula string.

- **How to recognise:** Any time the methodology page declares metric weights, verify against the live `metricCatalog` in publishedRankingData.json. Any time a pillar is described as capturing a concept (e.g. "creative"), verify which specific metrics operationalize it vs which neighboring pillars capture adjacent concepts.

---

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->

## 2026-06-06 · Auto-generated province data had duplicates and dead color branch

- **What went wrong:** `scoreColor()` in ThailandPage had a dead branch — `>= 80` and `>= 65` both returned `--accent-cyan`, so "good" (65–79) and "excellent" (80+) scores looked identical. Separately, the auto-generated taglines for 9 provinces were identical ("Solid provincial performance with room to grow in environment."), and highlights for Nakhon Pathom, Songkhla, Chachoengsao, Samut Sakhon had the population repeated 3× because the generator fell back to population when it ran out of real facts.
- **Correct behaviour:** `scoreColor` now uses 4 tiers: cyan (≥80), blue (≥65), amber (≥50), red (<50). Province taglines and highlights must be fact-specific to the province — never generic templates. Before shipping thailand data, grep for repeated strings within a single province's highlights array.
- **How to recognise:** Any `highlights` array with two or more identical entries. Any `tagline` containing "with room to grow in" as a template placeholder. Any color function that returns the same value for two different branches.

---

## 2026-06-13 · Partial fix marked as complete — province templates survived a "fix" commit

- **What went wrong:** The 2026-06-06 entry above claims the duplicate-tagline / repeated-highlight issue was fixed. It was fixed for only 9 of 78 provinces. 60 provinces still shipped "Emerging province with potential, especially in…" and 40 highlights arrays still carried duplicated population filler. The lesson entry itself asserted closure without a whole-file check.
- **Correct behaviour:** When fixing a data-quality *pattern* (not a single instance), the verification step must grep the pattern across the WHOLE file and assert count == 0 — not just confirm the instances first noticed are gone. The fix commit message should state the assertion result ("0 template strings remain, 77/77 unique").
- **How to recognise:** Any fix described as "fixed the duplicate/template issue" without a count assertion. Any data file where a generator once produced fallback strings — the fallback pattern is rarely confined to the rows you happened to look at.

---

## 2026-07-03 · Undefined CSS tokens shipped invisible defects across 5 sections
- **What went wrong:** Sections shipped over two sessions referenced `var(--accent)`, `var(--text-muted)`, `var(--font-sans)`, `var(--section-pad)` — none defined in the design system (canonical: `--accent-amber`, `--text-soft`, `--font-body`, literal `3rem`). CSS custom-property fallback made every such declaration invalid at computed-value time: accent colors inherited dark, tint backgrounds vanished, one section had zero vertical padding. DOM-structure verification passed; rendered color was never checked.
- **Correct behaviour:** (1) Before using any CSS variable in new styles, grep `:root` for its definition — 5 seconds. (2) Verification of visual work must include computed-style checks (`getComputedStyle(...).color`) on at least one accent element, not just element-existence queries. Per §11.10, "in the DOM" ≠ "renders as designed".
- **How to recognise:** Writing `var(--anything)` from memory of other projects' token names; verifying a visual feature with only `querySelectorAll(...).length` checks.

## 2026-07-05 · Dead-code removal — grep the whole namespace, not the named list
- **What went wrong:** Work-order A5 named ~10 dead CSS classes / "~115 lines" for the V3 ticker/hero-variant block. The real dead block was ~307 lines, plus scattered responsive overrides in shared media queries, plus a *second* dead namespace (v3-story-*, v3-counter-*) the work order never mentioned. Blind-deleting the named line range (5819–5940) would have (a) missed half the dead code and (b) clipped into live rules (.v3-cta at 6036, .v3-alpha-grid).
- **Correct behaviour:** Before deleting, extract EVERY selector in the region and grep each against src/**.tsx + .ts + index.html. Find the true contiguous boundary (stop at the first live class), remove scattered overrides surgically from shared media blocks, and confirm the diff is pure-deletion (0 insertions = no live rule touched). Flag any out-of-scope dead namespace discovered rather than expanding the delete silently.
- **How to recognise:** A work order gives a line range or a short class list for a "dead code" removal in a large file (styles.css is 12k lines). The range/list is a starting hint, never the verified boundary — the file has almost certainly drifted since the audit.
- **Follow-up left open:** v3-story-*, v3-counter-*, v3-counter-num/label appear unreferenced (old-HomePage namespace) — a separate audit, not deleted in A5.

## 2026-08-19 · Light/dark surface mismatch is this codebase's dominant defect class

- **What went wrong:** A full instrumented contrast audit (computed styles, not eyeballing) found ~70 text elements failing WCAG AA across 13 routes, nearly all from two mechanisms. (1) **Surface mismatch**: a component authored for one background rendered on the other. Worst cases were exactly invisible: the spider chart's pillar axis labels on `/compare` at **1.07:1** (dark ink on the dark `.compare-spider-widget`, which had `background: var(--text)` but never got the `.v3-spider-full` dark-token override), the allocator's slider labels on `/rankings` at **1.00:1** (hardcoded `rgba(248,245,240,.7)` cream on cream), and the entire reproducibility block on `/data` at **1.00:1** — `.ranking-credit-card` is authored in cream (`--text-inverse`, cream hairlines) but has had **no background in any commit since the initial deployment**. (2) **`opacity` used to de-emphasise text**: `opacity` multiplies through whatever colour a *later* rule sets, so `.v3-tier-chip span { opacity: .35 }` dragged `--text-soft` to 1.71:1, and 30+ label/prose rules landed at 2.4–4.5:1. Also found: A/B/C coverage-grade badges in literal Tailwind defaults (`#22c55e`/`#f59e0b`/`#f97316`, 1.97–2.58:1), and `/side-by-side` had Alpha/Beta tier glyph colours **swapped** vs the canonical rankings convention with Gamma reusing Alpha's cyan — two tiers indistinguishable.
- **Correct behaviour:** (1) Never hardcode a surface-specific colour in a component that mounts on more than one background — put it behind a token the surface sets. `ZeroSumAllocator` mounts on three surfaces (`.v3-spider-full` dark, `.compare-spider-widget` dark, `.rankings-stage` light); pillar hues now flow through `--pillar` + `--pillar-lift`, and chrome through `--spider-slider-label`/`--spider-track`/`--spider-thumb`. (2) Never use `opacity` to dim text — use a colour token (`--text-dim` on cream, `--text-dim-inverse` on ink, both ~4.6:1). (3) A verification script must fold **element `opacity` and SVG `fill-opacity`** into the ratio, and must parse `color(srgb …)` (0–1 components) as well as `rgb()`, or it silently mis-scores. Verify at **both** viewport widths — `mh-edition`, `v3-spider-country` and `city-country` only fail at desktop.
- **How to recognise:** Any rule setting a cream/near-white colour without a scoped dark ancestor; any `opacity: 0.x` on an element containing text; any second mount point of a component whose first mount has a token override block. Grep `background: var(--text)` and check every such panel has the matching dark-token override.
- **Instrument caveat (do not "fix" these):** text over a photograph or behind a sub-0.85-alpha scrim reads as ratio 1.00 to a DOM-only checker because it cannot composite the image. `.essay-*` hero (over `city-taipei.jpg` + `.essay-hero-overlay`), `.mh-edition` (over a 0.68 scrim, actually 5.54:1) and `.idea-card-photo-credit` are false positives — confirm the `<img>`/scrim exists before changing anything.
- **Left open (Dr Non's call, not mechanical):** `.mh-inner` is `min(1280px, 100% - 2.5rem)` while the content column `.section` is `min(1400px, 100% - 3rem)`, so the masthead band's edges never land on the content edges (x=80 vs x=24 at 1440px) — a §14.11 Planar Alignment miss. Three stacked width declarations (1200 → 1240 → 1280) accreted without reconciliation; picking the winner is a visual decision so it was left as authored, with a note in `styles.css`. Phone was fixed (masthead and content now both 355px at x=10). Also: 26 source-citation links on the city scorecard take a 24px WCAG 2.5.8 floor rather than §11.8's 44px, because 44px each would break the dense metric grid.

## 2026-08-29 · The page grid was declared twice and neither half knew

- **What went wrong:** `--max-width` said `1200px` while `.section` — the content column, used by every page — hardcoded `min(1400px, calc(100% - 3rem))`. Everything else (`.mh-inner`, `.site-masthead-frame`, `.topbar`, `.mh-panel--open`, and `.section`'s **own** `<=760px` variant) read the token. So the masthead band and the content column never resolved to the same edge: at 1440px the band sat at x=80 and content at x=24, a §14.11 Planar Alignment miss at every width. On top of that, three masthead width rules had accreted without reconciliation — `1200px` (token) → `1240px` → `1280px/2.5rem`, each added rather than replacing the last. The city scorecard added a third edge of its own by pinning three sections to `calc(100vw - 2rem)` (343px on a 375px phone) while the masthead and every other section sat at 355px.
- **Correct behaviour:** One grid, declared once: `--max-width: 1400px` + `--page-gutter: 3rem`, with `.section` and all masthead chrome reading `min(var(--max-width), calc(100% - var(--page-gutter)))`. The giveaway that the token was always meant to be the grid was `.section`'s own responsive variant already using it — when a rule's base and its media-query variant disagree about where geometry comes from, the base is the one that drifted. Verified empirically, not by reasoning: masthead and content now share one left edge at 1440px (x=24, W=1392) and at 375px (x=10, W=355), and the scorecard collapsed from three distinct left edges to one.
- **How to recognise:** A layout token whose value disagrees with a hardcoded literal doing the same job elsewhere. Grep the token, then grep the literal — if any selector hardcodes what a token already expresses, they have already drifted. Also: `100vw` in a width is a smell, it ignores the scrollbar and cannot match a `100%`-based sibling.
- **Also:** my first attempt at this fix made it *worse* — I moved `.mh-inner` onto `--max-width` (1200) which pushed the band to x=120, further from content's x=24 than the 1280 it started at. Measuring before and after caught it; reasoning about which value "should" win did not. Measure the edges, don't argue about them.

## 2026-08-29 · Verification gotcha — a headless/occluded pane does not advance CSS transitions

- **What went wrong:** Twice during live verification a measurement looked like a serious bug and was not. (1) The allocator's `.spider-slider-fill` widths stayed frozen at their pre-drag percentages while the inline style correctly read `width: 100%` / `0%`. (2) After a real in-app click from `/` to `/rankings`, `.mh-inner` kept the dark hero scrim `rgba(28,25,20,.68)` while `.mh-edition` switched to dark ink — an apparent 2.26:1 live on production. Both elements carry a `transition` (`width .12s`, `background .3s`), and the browser pane was not compositing, so the transition never advanced past its start value. `getComputedStyle` faithfully reported the frozen mid-transition value.
- **Correct behaviour:** When a computed value disagrees with the inline style or the class state, inject `{transition: none !important}` for that selector, force a reflow, and re-measure. If it snaps to the expected value, it is a compositor artifact, not a defect. Both cases did: the fills snapped to 269px/0px, and `.mh-inner` snapped to `rgba(248,245,240,.94)` (6.67:1). Also cross-check with a **real page load** — a hard navigation to `/methodology` showed `class="mh"`, cream inner, 6.67:1, immediately.
- **How to recognise:** A computed style that exactly matches the *previous* state's value; blank screenshots from the same pane; any element with a `transition` measured shortly after a state change. Related trap in the same session: synthetic `history.pushState` + `PopStateEvent` bypasses the app's own `onNavigate`, so masthead/hero classes go stale — drive SPA navigation by clicking a real link when the thing under test depends on route state.

## 2026-08-29 · Every deep link on production was answering 404

- **What went wrong:** `public/404.html` is a deliberate SPA route-restore shim, required by **GitHub Pages** (which has no `_redirects` support). But Cloudflare Pages gives a `404.html` in the output **precedence over the `/* /index.html 200` rule in `_redirects`**, so on `slic.nonarkara.org` every client-side route — `/rankings`, `/data`, `/methodology`, `/compare`, `/thailand`, `/city/*` — answered **HTTP 404** and served the shim, which flashed "One moment — routing you through" before bouncing to the right page. It *worked*, so it never looked broken in a browser; only the status code and the interstitial gave it away. This is the §11.8 sharing-link path: a link pasted into WhatsApp or LINE is how almost everyone arrives, and crawlers generating the preview card saw a 404.
- **Correct behaviour:** Keep `404.html` in `dist/` for the gh-pages target, strip it for the Cloudflare upload. `npm run deploy` now runs `stage:cf` (`cp -R dist .cf-dist && rm -f .cf-dist/404.html`) and deploys `.cf-dist`, leaving `dist/` pristine for `deploy:gh`. The shim now carries a comment saying why it must not reach Cloudflare.
- **How to recognise:** `curl -s -o /dev/null -w '%{http_code}' <deep-link>` on the live domain — a browser will not tell you, because the shim renders the right page anyway. Verified the premise on a throwaway preview branch (`wrangler pages deploy --branch spa-fallback-test`) before changing the production deploy: without `404.html` all routes returned 200 with the real SPA shell; with it, all returned 404. Residual trade-off: unknown paths are now soft-404s (200 + homepage), which is inherent to any `/*` SPA fallback.
- **Lesson beyond this repo:** "deployed and the page looks right" is not the same as "correct". CDPT's *test on the web* step means checking the response, not only the render.

## 2026-09-01 · A mobile pass deleted the phone language switcher and nobody noticed

- **What went wrong:** A hyper-audit pass removed the `<select>` from `LocaleSwitch.tsx` **and** its two base rules from `styles.css` (`.locale-select-wrap { display: none }`, `.locale-select { min-height: 44px … }`) — but left the `@media (max-width: 768px)` block that hides `.locale-button-row` and shows `.locale-select-wrap`. The result: on any phone, the button row was `display: none` and the element meant to replace it no longer existed, so **there was no way to change language at all** on a five-locale site whose primary surface is the phone. The burger panel opened with full nav and zero locale control. Same pass hardcoded the allocator's drag hint to `fill="rgba(248,245,240,0.55)"` — cream — although the allocator also renders on the light `/rankings` surface, so the hint was invisible there; and shipped a `×` remove-city button on `/side-by-side` unclassed at 12×18px.
- **Correct behaviour:** §11.5 in the small — never delete an element without grepping every reference to it, **CSS media queries included**. A rule that shows X and hides Y is a contract between two pieces of markup; deleting X silently breaks Y. Restored the select and its base rules as a pair, with a comment in both files saying they must be removed together or not at all. The drag hint went back to `var(--spider-hint)` plus a new surface-aware `--spider-accent`, matching how the rest of the allocator already handles its three mount surfaces.
- **How to recognise:** After any "mobile pass", open the phone viewport and try to *use* each control, not just look at it — `querySelector` the interactive elements and assert they render with a non-zero box. A control that is `display:none` with no replacement looks identical to a control that was never there. The specific check that caught this: enumerate every `a,button,select,input` and flag any with `height < 24`, then separately assert the locale switcher exists and has ≥1 visible option.
- **Also:** the same pass tuned `.locale-button` sizing inside a new `@media (max-width: 380px)` block, but `.locale-button-row` is `display:none` below 768px — so that CSS can never apply on the surface it was written for. Harmless, but a reminder to check that a breakpoint's target is actually rendered at that width before tuning it.

## 2026-09-01 · The homepage displayed a hardcoded visitor count as a live metric

- **What went wrong:** `fetchGoogleSheetsStats()` ended `catch { return { count: 12424, countries: [] } }`, and the same constant appeared again as `d.count ?? 12424`. The Apps Script endpoint sends no `Access-Control-Allow-Origin` header, so the `mode: "cors"` GET throws on every single page load, the catch always fires, and the hero always rendered **"12,424 VISITORS"** — a fixed number presented as a live count, on an index whose own footer reads *"Built to be audited, not believed."* Supabase, the intended primary source, is `null` in production because no `VITE_SUPABASE_*` vars exist at build time, so there was no path to a real number at all. The consuming effect in `HomePage.tsx` already carried the correct intent in a comment — *"Live count unavailable — leave null so the hero omits the number rather than display a stale placeholder"* — but `getVisitorStats()` never rejects, so that `.catch` could never run. The implementation defeated its own documented intent.
- **Correct behaviour:** `VisitorStats.count` is now `number | null` and every failure path returns `null`; the hero already guards on `visitors != null`, so it renders two true stats and silently restores the third if the endpoint is ever fixed. §16.1 Law 3 in its sharpest form: a fabricated number is worse than an absent one, because an error costs a demo and a fake number costs the credibility the whole project is built on.
- **How to recognise:** grep the codebase for numeric literals inside `catch` blocks and `?? <number>` defaults on anything user-facing. Any constant that also appears in the rendered UI is a candidate. The tell here was that the displayed figure never changed across sessions. More generally: when a `.catch` in the consumer is documented as the honest path, check that the producer can actually reject — a helper that swallows its own errors makes every downstream guard dead code.
- **Adjacent, left as-is:** `ipapi.co` (~7s, intermittent 401) and the no-cors tracking POST still run. The POST is opaque so it may still be collecting; only the *read* was broken. Restoring a real count needs the Apps Script redeployed with CORS headers, or the Supabase env vars set at build — neither is a code change in this repo.
