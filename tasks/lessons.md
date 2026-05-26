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

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->
