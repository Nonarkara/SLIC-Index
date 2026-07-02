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
