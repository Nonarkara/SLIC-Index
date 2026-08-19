import { ampi, PILLAR_ORDER } from "./publicationMath.js";
import type { PillarId } from "./publicationMath";


/**
 * AMPI score for a set of pillar values under a given weight allocation.
 * Single source of truth — wraps `ampi()` in publicationMath.js so the same
 * formula (μ − σ²/μ) is used everywhere: HomePage, RankingsPage, CompareRankingsPage.
 *
 * Returns the clamped 0–100 score (0 if no usable pillars).
 */
export function scoreCityWithWeights(
  pillarScores: Record<PillarId, number | null>,
  weights: Record<PillarId, number>,
): number {
  const entries = (PILLAR_ORDER as readonly PillarId[]).map((pillar) => ({
    score: pillarScores[pillar],
    weight: weights[pillar],
  }));
  return ampi(entries).score ?? 0;
}
