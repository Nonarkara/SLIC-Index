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

## 2026-05-27 · Housing burden → Housing price pressure label propagation

- **What went wrong:** When renaming a metric's display label, multiple layers must be updated together: `publicationMath.js` (scored metrics list), `publishedRankingData.json` (metricCatalog + per-city entries), `slicScoringManifest.json` (metric_name + input label), `scoringEngine.ts` (JSDoc comment), `methodologyData.ts` (EN/TH/ZH methodology content + changelog), `CityScorecardPage.tsx` (METRIC_LABELS), and `docs/v3-absolute-scoring-specification.md` (spec table).
- **Correct behaviour:** Before renaming any metric display label, grep for the existing name across all of the above files. Make all changes in a single commit so the data pipeline stays consistent. Run `npm run verify:math` after — the 21 invariants will catch any metric catalog / scoring manifest drift.
- **How to recognise:** `npm run check:methodology` fails with drift errors if the label is updated in some layers but not others.

---

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->
