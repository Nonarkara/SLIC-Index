/**
 * Single source of truth for pillar identity, order and hue.
 *
 * The type and the order come from publicationMath — the canonical scorer — so the UI can
 * never disagree with the maths about what the pillars are or what order they sit in.
 * This module adds only the one thing the scorer has no opinion about: their colours.
 *
 * Previously PillarId, PILLAR_ORDER and PILLAR_COLORS were each copy-pasted into
 * HomePage, RankingsPage, CityScorecardPage, CompareRankingsPage and SideBySidePage —
 * five identical copies apiece. They agreed by luck, not by construction.
 *
 * The hexes intentionally mirror --accent-* in styles.css. They are tuned for the cream
 * surface; on the dark ink panels the allocator lifts them toward white via --pillar-lift
 * rather than keeping a second palette here.
 */
import { PILLAR_ORDER as SCORER_PILLAR_ORDER } from "./publicationMath";
import type { PillarId } from "./publicationMath";

export type { PillarId };

export const PILLAR_ORDER: readonly PillarId[] = SCORER_PILLAR_ORDER;

export const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};
