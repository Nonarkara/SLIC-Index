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
  pressure: "#d96629",   // Wada Plate 001 English Red
  viability: "#1a6b5a",  // Wada Viridian / Pine
  capability: "#12354e", // Wada Plate 002 Dark Tyrian Blue
  community: "#8c4a2a",  // Wada Raw Sienna / Burnt Umber
  creative: "#a72144",   // Wada Red (Dr Non signature chord)
};

/**
 * The five pillar names, as the published method states them.
 *
 * Two conventions are in play on this site and they are not the same thing:
 *
 *   - the published method — the methodology page, the PDF, the tier floors,
 *     the tier policy — names the pillars in Latin, in every locale;
 *   - the interactive surfaces — the scorecard plates, the rankings filters,
 *     the compare page — label the first pillar "Growth" in their own local
 *     words, so a Thai reader reads "การเติบโต" where the method says
 *     "Pressure".
 *
 * The board follows the method, because the board prints the tier floors
 * directly above it and a key that renamed them would contradict the
 * sentence next to it. The open question — which way the two conventions
 * should be reconciled site-wide — is one decision, and this table is the
 * one place it would be made.
 */
export const PILLAR_NAMES: Record<PillarId, string> = {
  pressure: "Pressure",
  viability: "Viability",
  capability: "Capability",
  community: "Community",
  creative: "Creative",
};
