# SLIC Index V3 Release Completeness Gate

Updated: 2026-06-01

This is the handoff checklist for deciding whether the public project is complete enough to ship, submit, teach, or archive as a defensible release.

## The Command

```bash
npm run verify:release
```

This gate runs:

1. `npm run typecheck` — TypeScript contract health.
2. `npm run build` — production Vite bundle health.
3. `npm test` — data-integrity and publication stability invariants.
4. `npm run check:publication` — public ranking and tier snapshot integrity.
5. `npm run check:methodology` — methodology, formula, tier-rule, and PDF-source drift checks.

If this command fails, the release is not complete. Do not silence the gate. Fix the failing contract or document why the release is intentionally blocked.

## Locale Contract

The app currently exposes five UI locale choices: English, Thai, Chinese, Korean, and Japanese.

English, Thai, and Chinese are the fully translated core publication locales. Korean and Japanese are valid extended UI locales, but long-form surfaces may fall back to English until full native translations are completed.

The implementation rule is:

- Use `Record<Locale, T>` only when every locale is truly complete.
- Use `LocalizedRecord<T>` from `src/i18n.ts` when English, Thai, and Chinese are required and Korean/Japanese may fall back to English.
- Use `pickLocale(copy, locale)` whenever reading a `LocalizedRecord<T>`.

This keeps partial locale expansion honest: the UI does not crash, TypeScript remains strict, and future translators can fill Korean/Japanese copy without changing component logic.

## Completion Evidence

A complete release should leave these artifacts in agreement:

- `src/data/publishedRankingData.json`
- `public/downloads/slic-ranked-cities-v2.csv`
- `src/methodologyData.ts`
- `docs/v3-absolute-scoring-specification.md`
- `docs/v3-absolute-scoring-formula.md`
- `scripts/generate_methodology_pdf.py`
- `_pre-submission-status.md`
- `tasks/lessons.md`

When a data refresh, tier-rule change, metric rename, or locale expansion touches any of these layers, run the release gate before deployment.

## Why This Exists

SLIC is not only a frontend. It is a public claim about cities, evidence, measurement, and editorial independence. The release gate exists so that future collaborators can prove the site, dataset, methodology, and historical record still agree.
