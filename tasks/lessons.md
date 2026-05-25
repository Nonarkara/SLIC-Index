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

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->
