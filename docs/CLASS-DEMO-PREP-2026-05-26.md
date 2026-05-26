# SLIC Index V3 — TKC Class-Demo Prep · 2026-05-26

Pre-class audit and fix pass for the morning TKC class demo. All work landed
on `codex/red-dot-design-2-5-1` and deployed to Cloudflare Pages
(`slic.nonarkara.org`). Live site verified showing the corrected counts.

---

## (a) What I changed

Twelve commits in two passes, each isolated for clean review.

### Pass 1 — first audit (covered in this doc's original draft)

| # | Hash       | Subject |
|---|------------|---------|
| 1 | `10034b7`  | methodology: A-grade coverage floor for Alpha + expanded city exclusions |
| 2 | `09437c8`  | fix: update social-share count to 158 ranked (was stale 154) |
| 3 | `f684299`  | docs: align count copy with published dataset (158 ranked + 5 watchlist) |
| 4 | `f8782ba`  | regen: refresh Thai and Chinese methodology PDFs |
| 5 | `52c4f2a`  | chore: patch bump 0.0.0 → 0.0.1 for class-demo fix pass |

### Pass 2 — "Fix everything. Make it perfect." (second pass)

| # | Hash       | Subject |
|---|------------|---------|
|  6 | `1f21ada`  | docs: README reflects 10-index Compare, Cloudflare-primary deploy, Axiom × ReTL |
|  7 | `da47158`  | fix: methodology PDF author + creator metadata (was 'OpenAI Codex') |
|  8 | `03ae653`  | docs: log 3 new lessons from the 2026-05-26 fix pass |
|  9 | `cd4808c`  | fix: dedupe display of alphaCityExclusions ('Košice, Kosice' → 'Košice') |
| 10 | `657834b`  | **typography**: load IBM Plex Sans Thai + Noto Sans SC; scope via :lang() |
| 11 | `207df04`  | chore: refresh publishedRankingData timestamp (no score deltas) |
| 12 | (deploy)   | `npx wrangler pages deploy dist --project-name slic-index --branch main` — production verified at 18:41 GMT |

### Pass-2 highlights worth narrating in class

- **Typography fix (#10) is the biggest visual change.** Before this commit,
  every Thai page was rendering with the OS default Thai font — Sukhumvit Set
  on macOS, Leelawadee UI on Windows, Sarabun variants on Android — all of
  which carry the prominent หัว head-loops that workspace §0 forbids ("use
  IBM Plex Sans Thai (non-looped) as the primary Thai face"). Loaded IBM
  Plex Sans Thai and Noto Sans SC via Google Fonts, scoped to `:lang(th)` /
  `:lang(zh)` selectors that ride App.tsx's existing `<html lang>` mirror.
  Compare a Thai screenshot today vs yesterday — the letterforms are
  loop-free and demonstrably "made by Thais."
- **README drift (#6).** README claimed "157 cities / Six-index comparison /
  GitHub + Vercel deployment / Axiom AI" — all stale. Now mirrors the live
  10-index Compare page, Cloudflare-primary deploy, and Axiom × ReTL
  partnership.
- **Display dedup (#9).** Methodology page and homepage Alpha-exclusion
  copy read "Košice, Kosice" in three locales — both spellings were in the
  matching list defensively, but they shouldn't surface in human copy.
  Added `getDisplayAlphaCityExclusions()` helper that strips diacritics for
  deduplication and keeps `Košice` (canonical). All 21 tests + math
  integrity still green.
- **PDF metadata (#7).** The methodology paper's `/Author` field read
  "OpenAI Codex" in any PDF reader's Get Info pane. Now reads "Dr. Non
  Arkara & A.P. Poon Thiengburanathum (SLIC Index)" with the SLIC engine
  as creator.

### Commit 1 — `10034b7` · methodology v1.3.0 (was 18 files uncommitted on entry)

This was an in-progress methodology improvement already staged in the working
tree when the audit started. All 21 tests pass with it; build, `check:publication`,
and `check:methodology` all green. Committed as a single coherent unit.

- `publicTierPolicy` v1.2.0 → v1.3.0. Alpha now requires coverage grade `A`
  alongside Community ≥ 40 and Pressure ≥ 40, so missing stress inputs can no
  longer be converted into a top-shelf public claim.
- `alphaCityExclusions` expanded from `[Tokyo]` to 17 cities — Tokyo, Hong Kong,
  Sydney, Vancouver, Los Angeles, Adelaide, Honolulu, San Francisco, Melbourne,
  San Diego, Brisbane, London, Amsterdam, Athens, Prague, Košice/Kosice. Backed
  by Demographia 2025 median-multiple and Deloitte Property Index 2025.
- Two new methodology references — Price of Travel backpacker index and Budget
  Your Trip — used as **contextual** evidence for Bangkok's affordability story,
  explicitly not a scored tourism bonus.
- Footer date: `Last published: April 2026` → `May 2026` in all three locales.
- `IdeasPage` empty-state copy added in EN/TH/ZH for when filters return zero.
- External links: every `target="_blank"` now carries `rel="noopener noreferrer"`
  (security: tabnabbing).
- `visitorTracking` version tag bumped v2 → v3.
- Published baseline rescored, benchmark fixture updated.

### Commit 2 — `09437c8` · social-share count fix

`index.html` had three references to "163 cities, 154 ranked" — the meta
description, the og:description, and the noscript fallback. Live published
dataset is **158 ranked + 5 watchlist = 163 total**. This is what surfaces in
WhatsApp / LINE / Telegram link previews, so it had to match.

### Commit 3 — `f684299` · README + project CLAUDE.md counts

`README.md` said "157 cities. 5 pillars. 35 signals." Project `CLAUDE.md` said
"(154 ranked + 9 watchlist), 20 scored metrics + 3 diagnostics." Truth from
the published `methodologyFacts`: 158 ranked + 5 watchlist, 22 scored metrics
+ 3 diagnostics, score model `slic-v3.4.0`, tier policy `public-tier-v1.3.0`.

### Commit 4 — `f8782ba` · Thai + Chinese methodology PDFs

The polish commit (`af4d1b4`) only regenerated the English PDF, leaving th/zh
files pre-dating the v1.3.0 tier policy. Ran `npm run methodology:pdf` to
refresh all three so any language link from the demo serves the current
methodology.

### Commit 5 — `52c4f2a` · version bump

`package.json` 0.0.0 → 0.0.1 per the standing patch-bump rule for fix passes.
No UI version stamp exists today, so the bump is internal only.

### Commit 6 — deploy

```
✨ Success! Uploaded 4 files (136 already uploaded) (1.32 sec)
✨ Deployment complete!
   Preview: https://917dd0a3.slic-index.pages.dev
   Production: https://slic.nonarkara.org
```

Verified live at 02:22 GMT — `curl https://slic.nonarkara.org` returns the
corrected "163 cities, 158 ranked" meta description.

---

## (b) What I left alone deliberately

- **The op-ed homepage, the 5-pillar layout, the 163-city grid.** Per
  CLAUDE.md §11, these are anti-regression items.
- **`Axiom × ReTL` branding throughout.** Recent commit `0450d7f` explicitly
  restored this; not mine to undo.
- **`tasks/lessons.md` note** that "Node.js 20.x required" + the GH Actions
  CI token expired warning. Both still true; manual `npm run deploy` (the
  wrangler path) is the documented workaround, and that's what I used.
- **The `_pre-submission-status.md` file in repo root.** Not referenced from
  the app and looks like a working note. Not mine to clean up tonight.
- **Pass 2: the looped→non-looped Thai typography change** is a §0
  compliance fix, not a redesign — the Latin face (Libre Baskerville for
  display, Inter for body, JetBrains Mono for numerics) is unchanged.
  Pass 2 did NOT touch the colour palette, the layout, the spacing scale,
  any logo, or any anti-regression item in CLAUDE.md §11.
- **Pre-existing TypeScript strictness**: the build script intentionally
  skips `tsc --noEmit`. `npm run typecheck` is clean today, but `npm run build`
  does not gate on it by design. Did not change that contract.
- **20+ logo, photo, and download paths in `public/`.** All 36 referenced
  assets resolve; nothing missing.

---

## (c) Issues I could not safely fix tonight — Non to know about before demo

### 🟡 GH Actions CI token is expired

Recent push to `codex/red-dot-design-2-5-1` succeeded but no CI will fire on
main pushes until the `CLOUDFLARE_API_TOKEN` GitHub secret is renewed. The
manual `npm run deploy` path I used works today and the production site is
current; the gap is only that automated CI deploys are disabled. Not
demo-blocking. (Logged in `tasks/lessons.md` 2026-05-26.)

### 🟡 Cloudflare OAuth token expires today

Local wrangler oauth token in `~/.wrangler/config/default.toml` shows
`expiration_time = "2026-05-25T22:40:03.351Z"` — that lapsed about 4 hours
before this deploy fired, but wrangler 4.81.1 used its refresh token and the
deploy succeeded. If you need to redeploy mid-class, run `wrangler login`
first if it complains.

### 🟡 The `_pre-submission-status.md` file (1 May)

Sits in repo root. Looks like a working document. Not referenced from the
app. Harmless but unloved — consider moving to `docs/` or deleting after the
class.

### 🟡 If a student asks "why is Tokyo not in Alpha but ranked higher than Bangkok"

Tokyo, Hong Kong, Sydney, Vancouver, LA, SF, Melbourne, London, Amsterdam,
Athens, Prague, and 5 other cities are now in `alphaCityExclusions`. The
methodology page text auto-renders the full list. The story to tell: **Alpha
is the public-facing shelf reserved for cities where a median-salary resident
can actually live; high-housing-cost megacities are deliberately barred from
Alpha and can earn Beta or Gamma seats but never Alpha.** The Demographia
2025 median-multiple and Deloitte Property Index 2025 are the data backing,
and they are cited in the methodology references panel.

### 🟡 The lessons log

`tasks/lessons.md` exists per §13 of the workspace CLAUDE.md. I did not append
to it tonight because I did not hit any new mistakes — all the fixes were
either pre-staged work to commit or simple count corrections. If you want me
to add a "session entry" for the audit pass, say the word in the morning.

---

## Quick demo checklist

- [ ] Open `https://slic.nonarkara.org` on phone first (§11.8). Verify
  Alpha tier, Bangkok at #52, footer says "Last published: May 2026."
- [ ] Switch locale EN → TH → ZH. Allocator labels, Alpha bridge copy,
  footer date all localise. **NEW**: Thai letterforms are now non-looped
  (IBM Plex Sans Thai); Chinese is now Noto Sans SC. Both should look
  consistent across devices, not OS-default.
- [ ] Open Methodology page. Confirm "Alpha requires Community ≥ 40,
  Pressure ≥ 40, and coverage grade A" appears. The Alpha exclusion list
  shows 16 cities ending in `Košice` — no longer `Košice, Kosice`.
- [ ] Open Compare page. H1 reads "Ten indices. Same planet." Spider lets
  you rebuild SLIC's top 10; other 9 indices stay frozen.
- [ ] Tap "Steal this idea" (Ideas). Filter to a category with no matches
  and confirm the new empty-state renders ("No matching ideas").
- [ ] Click Methodology PDF link — should download an EN PDF dated today.
  PDF "Get Info" → Author = Dr. Non Arkara & A.P. Poon Thiengburanathum.

Pass 2 verified: build green · 21 / 21 tests pass · publication integrity
pass · methodology drift pass · production deploy verified at 18:41 GMT
(`curl https://slic.nonarkara.org/assets/index-*.css | grep "IBM+Plex+Sans+Thai"`
returns a hit).
