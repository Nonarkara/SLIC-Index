export type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

export interface AmpiEntry {
  score: number | null | undefined;
  weight: number;
}

export interface AmpiResult {
  score: number | null;
  mean: number | null;
  variance: number | null;
}

export const SCORE_MODEL_VERSION: string;
export const PILLAR_WEIGHTS: Readonly<Record<PillarId, number>>;
export const PILLAR_ORDER: readonly PillarId[];
export const SCORED_METRICS: readonly unknown[];
export const DIAGNOSTIC_METRICS: readonly unknown[];

export function numeric(value: unknown): value is number;
export function scoreAccessor<T>(row: T, key: string): number | null;
export function ampi(entries: readonly AmpiEntry[]): AmpiResult;
