/**
 * @deprecated — NOT USED BY THE PUBLISHED SCORER
 *
 * This file is an orphaned implementation that predates the current scoring
 * pipeline. The live scorer is `src/publicationMath.js` (pillar/metric weights,
 * winsorized normalization, weighted AMPI) together with
 * `scripts/rescore-all-cities.mjs` (the rescore harness).
 *
 * This file implements a different architecture:
 * - Unweighted AMPI (live uses weighted AMPI with pillar weights 25/22/18/15/20)
 * - Raw-indicator-count coverage grade (live uses weighted coverage ratio)
 * - Older 7-indicator pillar structure (live has 4-6 metrics per pillar)
 *
 * Do NOT use this file to understand the published scoring logic. It will give
 * wrong results. It is kept here only to preserve development history.
 *
 * Lesson logged in tasks/lessons.md: 2026-06-03
 */

/**
 * SLIC Index V3 — Absolute Scoring Engine
 *
 * Pure math module. No data fetching, no side effects.
 * All anchor thresholds are fixed constants.
 * Adding city #501 does not change scores for cities #1-500.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single [rawValue, score] anchor point for piecewise linear mapping. */
export type AnchorPoint = readonly [raw: number, score: number];

/** Ordered array of anchor points for one indicator. */
export type AnchorTable = readonly AnchorPoint[];

export interface IndicatorData {
  id: string;
  raw: number | null; // null = missing
}

export interface PillarResult {
  pillar: string;
  ampiRaw: number;          // AMPI before coverage penalty
  coverageGrade: 'A' | 'B' | 'C';
  coveragePenalty: number;
  score: number;             // final pillar score (clamped 0-100)
  indicatorScores: number[]; // individual 0-100 scores used
  populatedCount: number;
  totalIndicators: number;
}

export interface CityScoreResult {
  overall: number;           // final SLIC score (clamped 0-100)
  pillars: {
    growth: PillarResult;
    viability: PillarResult;
    capability: PillarResult;
    community: PillarResult;
    creative: PillarResult;
  };
}

// ---------------------------------------------------------------------------
// Piecewise linear interpolation
// ---------------------------------------------------------------------------

/**
 * Maps a raw value to a 0-100 score using fixed anchor points.
 *
 * Anchors must be sorted by raw value (ascending OR descending for
 * lower-is-better indicators). Values beyond outer anchors are clamped.
 *
 * For "higher is better": anchors go raw ascending, score ascending.
 * For "lower is better": anchors go raw descending, score ascending.
 */
export function piecewiseLinear(raw: number, anchors: AnchorTable): number {
  if (anchors.length === 0) return 0;
  if (anchors.length === 1) return clamp(anchors[0][1]);

  // Determine direction: raw values may be ascending or descending
  const ascending = anchors[anchors.length - 1][0] >= anchors[0][0];

  if (ascending) {
    if (raw <= anchors[0][0]) return clamp(anchors[0][1]);
    if (raw >= anchors[anchors.length - 1][0]) return clamp(anchors[anchors.length - 1][1]);
  } else {
    if (raw >= anchors[0][0]) return clamp(anchors[0][1]);
    if (raw <= anchors[anchors.length - 1][0]) return clamp(anchors[anchors.length - 1][1]);
  }

  // Find the segment containing raw
  for (let i = 0; i < anchors.length - 1; i++) {
    const [r0, s0] = anchors[i];
    const [r1, s1] = anchors[i + 1];
    const lo = Math.min(r0, r1);
    const hi = Math.max(r0, r1);

    if (raw >= lo && raw <= hi) {
      if (r1 === r0) return clamp(s0);
      const t = (raw - r0) / (r1 - r0);
      return clamp(s0 + t * (s1 - s0));
    }
  }

  // Fallback (should not reach here with well-formed anchors)
  return clamp(anchors[anchors.length - 1][1]);
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

// ---------------------------------------------------------------------------
// Passthrough helper — score equals raw, clamped to 0-100
// ---------------------------------------------------------------------------

const PASSTHROUGH: AnchorTable = [[0, 0], [100, 100]] as const;

// ---------------------------------------------------------------------------
// GROWTH anchors (G1-G7) — all higher is better
// ---------------------------------------------------------------------------

export const G1_GDP_GROWTH: AnchorTable = [
  [0, 0], [1.0, 25], [2.5, 50], [4.0, 75], [6.0, 100],
] as const;

export const G2_STARTUP_DENSITY: AnchorTable = [
  [5, 0], [20, 25], [50, 50], [100, 75], [200, 100],
] as const;

export const G3_VC_INTENSITY: AnchorTable = [
  [5, 0], [50, 25], [200, 50], [500, 75], [1500, 100],
] as const;

export const G4_BUSINESS_EASE: AnchorTable = PASSTHROUGH;

export const G5_CIVIC_FREEDOM: AnchorTable = PASSTHROUGH;

export const G6_PATENTS: AnchorTable = [
  [2, 0], [15, 25], [40, 50], [80, 75], [150, 100],
] as const;

export const G7_HIGH_SKILL: AnchorTable = [
  [10, 0], [20, 25], [30, 50], [40, 75], [55, 100],
] as const;

export const GROWTH_ANCHORS: readonly AnchorTable[] = [
  G1_GDP_GROWTH, G2_STARTUP_DENSITY, G3_VC_INTENSITY,
  G4_BUSINESS_EASE, G5_CIVIC_FREEDOM, G6_PATENTS, G7_HIGH_SKILL,
] as const;

// ---------------------------------------------------------------------------
// VIABILITY anchors (V1-V8)
// ---------------------------------------------------------------------------

/** V1 Homicide rate — lower is better (raw descending, score ascending) */
export const V1_HOMICIDE: AnchorTable = [
  [50, 0], [20, 25], [5, 50], [1.0, 75], [0.3, 100],
] as const;

/** V2 PM2.5 — lower is better */
export const V2_PM25: AnchorTable = [
  [80, 0], [50, 25], [25, 50], [10, 75], [5, 100],
] as const;

/** V3 Healthcare Access & Quality — passthrough 0-100 */
export const V3_HAQ: AnchorTable = PASSTHROUGH;

/** V4 PPP-adjusted disposable income $/month — higher is better */
export const V4_DISPOSABLE_INCOME: AnchorTable = [
  [0, 0], [200, 25], [500, 50], [2000, 75], [4000, 100],
] as const;

/** V5 housing price pressure — lower is better */
export const V5_RENT_BURDEN: AnchorTable = [
  [70, 0], [50, 25], [30, 50], [20, 75], [10, 100],
] as const;

/** V6 Water & sanitation % — higher is better */
export const V6_WATER: AnchorTable = [
  [50, 0], [70, 25], [85, 50], [95, 75], [99, 100],
] as const;

/**
 * V7 Global Peace Index — formula-based.
 * GPI ranges 1 (most peaceful) to 4 (least peaceful).
 * Converted via (4 - GPI) / 3 * 100, then passthrough.
 * Caller should pre-convert using `gpiToScore()` then pass through PASSTHROUGH.
 */
export const V7_PEACE: AnchorTable = PASSTHROUGH;

/** Helper: convert raw GPI value to 0-100 score */
export function gpiToScore(gpi: number): number {
  return clamp(((4 - gpi) / 3) * 100);
}

/** V8 Birth rate per 1000 — higher is better */
export const V8_BIRTH_RATE: AnchorTable = [
  [4, 0], [7, 25], [10, 50], [14, 75], [20, 100],
] as const;

export const VIABILITY_ANCHORS: readonly AnchorTable[] = [
  V1_HOMICIDE, V2_PM25, V3_HAQ, V4_DISPOSABLE_INCOME,
  V5_RENT_BURDEN, V6_WATER, V7_PEACE, V8_BIRTH_RATE,
] as const;

// ---------------------------------------------------------------------------
// CAPABILITY anchors (C1-C7)
// ---------------------------------------------------------------------------

export const C1_TRANSIT: AnchorTable = [
  [5, 0], [20, 25], [40, 50], [65, 75], [85, 100],
] as const;

export const C2_INTERNET: AnchorTable = [
  [5, 0], [25, 25], [75, 50], [150, 75], [300, 100],
] as const;

export const C3_DIGITAL_GOV: AnchorTable = PASSTHROUGH;

export const C4_PISA: AnchorTable = [
  [350, 0], [400, 25], [450, 50], [500, 75], [550, 100],
] as const;

export const C5_WALKABILITY: AnchorTable = PASSTHROUGH;

export const C6_CYCLING: AnchorTable = [
  [1, 0], [5, 25], [15, 50], [30, 75], [50, 100],
] as const;

export const C7_RENEWABLES: AnchorTable = [
  [2, 0], [15, 25], [35, 50], [60, 75], [90, 100],
] as const;

export const CAPABILITY_ANCHORS: readonly AnchorTable[] = [
  C1_TRANSIT, C2_INTERNET, C3_DIGITAL_GOV, C4_PISA,
  C5_WALKABILITY, C6_CYCLING, C7_RENEWABLES,
] as const;

// ---------------------------------------------------------------------------
// COMMUNITY anchors (O1-O7)
// ---------------------------------------------------------------------------

export const O1_LGBTQ: AnchorTable = PASSTHROUGH;

/**
 * O2 Religious freedom — formula-based.
 * Pew GRI 0-10 where 0 = best. Converted via (10 - GRI) / 10 * 100.
 * Caller should pre-convert using `griToScore()` then pass through PASSTHROUGH.
 */
export const O2_RELIGIOUS_FREEDOM: AnchorTable = PASSTHROUGH;

/** Helper: convert raw Pew GRI (0-10) to 0-100 score */
export function griToScore(gri: number): number {
  return clamp(((10 - gri) / 10) * 100);
}

/** O3 Immigrant integration gap — lower is better */
export const O3_IMMIGRANT_GAP: AnchorTable = [
  [30, 0], [20, 25], [10, 50], [5, 75], [1, 100],
] as const;

/** O4 Gini coefficient — lower is better */
export const O4_GINI: AnchorTable = [
  [0.60, 0], [0.45, 25], [0.35, 50], [0.28, 75], [0.22, 100],
] as const;

/** O5 Social trust % — higher is better */
export const O5_TRUST: AnchorTable = [
  [5, 0], [15, 25], [30, 50], [50, 75], [70, 100],
] as const;

/**
 * O6 Gender equality — formula-based.
 * UNDP GII 0-1 where 0 = best. Converted via (1 - GII) * 100.
 * Caller should pre-convert using `giiToScore()` then pass through PASSTHROUGH.
 */
export const O6_GENDER_EQUALITY: AnchorTable = PASSTHROUGH;

/** Helper: convert raw UNDP GII (0-1) to 0-100 score */
export function giiToScore(gii: number): number {
  return clamp((1 - gii) * 100);
}

/** O7 Weekend retention ratio — higher is better */
export const O7_WEEKEND_RETENTION: AnchorTable = [
  [0.70, 0], [0.80, 25], [0.90, 50], [1.00, 75], [1.10, 100],
] as const;

export const COMMUNITY_ANCHORS: readonly AnchorTable[] = [
  O1_LGBTQ, O2_RELIGIOUS_FREEDOM, O3_IMMIGRANT_GAP, O4_GINI,
  O5_TRUST, O6_GENDER_EQUALITY, O7_WEEKEND_RETENTION,
] as const;

// ---------------------------------------------------------------------------
// CREATIVE anchors (R1-R7) — all higher is better
// ---------------------------------------------------------------------------

export const R1_VENUES: AnchorTable = [
  [2, 0], [8, 25], [20, 50], [40, 75], [70, 100],
] as const;

export const R2_UNESCO: AnchorTable = [
  [0, 0], [1, 25], [3, 50], [6, 75], [10, 100],
] as const;

export const R3_CUISINES: AnchorTable = [
  [1, 0], [3, 25], [8, 50], [15, 75], [25, 100],
] as const;

export const R4_NIGHTLIFE: AnchorTable = [
  [3, 0], [10, 25], [25, 50], [50, 75], [80, 100],
] as const;

export const R5_ARTS_FUNDING: AnchorTable = [
  [5, 0], [30, 25], [80, 50], [150, 75], [300, 100],
] as const;

export const R6_CREATIVE_EMPLOYMENT: AnchorTable = [
  [1, 0], [3, 25], [6, 50], [10, 75], [15, 100],
] as const;

export const R7_EVENTS: AnchorTable = [
  [2, 0], [10, 25], [25, 50], [50, 75], [100, 100],
] as const;

export const CREATIVE_ANCHORS: readonly AnchorTable[] = [
  R1_VENUES, R2_UNESCO, R3_CUISINES, R4_NIGHTLIFE,
  R5_ARTS_FUNDING, R6_CREATIVE_EMPLOYMENT, R7_EVENTS,
] as const;

// ---------------------------------------------------------------------------
// Coverage grade
// ---------------------------------------------------------------------------

export function coverageGrade(
  populatedCount: number,
  totalIndicators: number,
): { grade: 'A' | 'B' | 'C'; penalty: number } {
  const missing = totalIndicators - populatedCount;
  if (missing <= 1) return { grade: 'A', penalty: 0 };
  if (populatedCount >= 4) return { grade: 'B', penalty: 5 };
  return { grade: 'C', penalty: 15 };
}

// ---------------------------------------------------------------------------
// Adjusted Mazziotta-Pareto Index (AMPI)
// ---------------------------------------------------------------------------

/**
 * Computes AMPI for an array of 0-100 indicator scores.
 *
 * AMPI = mu - (sigma^2 / mu)
 *
 * Edge cases:
 * - Empty array → 0
 * - Single value → that value
 * - mu = 0 → 0
 */
export function computePillarAMPI(indicatorScores: number[]): number {
  const n = indicatorScores.length;
  if (n === 0) return 0;
  if (n === 1) return clamp(indicatorScores[0]);

  const mu = indicatorScores.reduce((a, b) => a + b, 0) / n;
  if (mu === 0) return 0;

  const variance =
    indicatorScores.reduce((sum, s) => sum + (s - mu) ** 2, 0) / n;
  const sigma = Math.sqrt(variance);
  const cv = sigma / mu;

  // AMPI = mu - sigma * cv  ≡  mu - sigma^2 / mu
  return clamp(mu - sigma * cv);
}

// ---------------------------------------------------------------------------
// Overall SLIC score
// ---------------------------------------------------------------------------

export function computeOverallSLIC(pillarScores: {
  growth: number;
  viability: number;
  capability: number;
  community: number;
  creative: number;
}): number {
  const scores = [
    pillarScores.growth,
    pillarScores.viability,
    pillarScores.capability,
    pillarScores.community,
    pillarScores.creative,
  ];
  return computePillarAMPI(scores);
}

// ---------------------------------------------------------------------------
// Full city scoring pipeline
// ---------------------------------------------------------------------------

/**
 * Score a single pillar from raw indicator data.
 *
 * @param pillarName  Label for the result
 * @param indicators  Raw values (null = missing)
 * @param anchors     Anchor tables, same order as indicators
 */
export function scorePillar(
  pillarName: string,
  indicators: (number | null)[],
  anchors: readonly AnchorTable[],
): PillarResult {
  const totalIndicators = anchors.length;
  const indicatorScores: number[] = [];

  for (let i = 0; i < totalIndicators; i++) {
    const raw = indicators[i];
    if (raw !== null && raw !== undefined) {
      indicatorScores.push(piecewiseLinear(raw, anchors[i]));
    }
  }

  const populatedCount = indicatorScores.length;
  const { grade, penalty } = coverageGrade(populatedCount, totalIndicators);
  const ampiRaw = computePillarAMPI(indicatorScores);
  const score = clamp(ampiRaw - penalty);

  return {
    pillar: pillarName,
    ampiRaw,
    coverageGrade: grade,
    coveragePenalty: penalty,
    score,
    indicatorScores,
    populatedCount,
    totalIndicators,
  };
}
