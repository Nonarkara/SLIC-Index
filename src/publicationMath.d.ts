export type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

export interface NormStats {
  p05: number;
  p95: number;
  dir: "positive" | "negative";
}

export interface MetricDef {
  key: string;
  pillar: PillarId;
  weight: number;
  inputKey: string | null;
  kind: "direct" | "composite" | "diagnostic";
  scored: boolean;
  label: string;
  components?: readonly [string, number][];
}

export interface MetricCatalog {
  [key: string]: MetricDef;
}

export interface ScoreMetricResult {
  score: number | null;
  coverage: number;
  scored: boolean;
  weight: number;
  componentScores?: Record<string, number | null>;
}

export interface AmpiResult {
  score: number | null;
  mu: number | null;
  variance: number | null;
}

export interface ScoreCityResult {
  metricScores: Record<string, ScoreMetricResult>;
  pillarScores: Record<PillarId, number | null>;
  pillarCoverage: Record<PillarId, number>;
  weightedMean: number | null;
  weightedVariance: number | null;
  ampiScore: number | null;
  slicScore: number | null;
  overallCoverage: number;
  coverageGrade: "A" | "B" | "C" | "Watchlist";
  rankingStatus: "Ranked" | "Watchlist";
  coveragePenalty: number;
}

export const SCORE_MODEL_VERSION: string;
export const PILLAR_WEIGHTS: Readonly<Record<PillarId, number>>;
export const PILLAR_ORDER: readonly PillarId[];
export const PUBLIC_METRICS: readonly MetricDef[];
export const SCORED_METRICS: readonly MetricDef[];
export const DIAGNOSTIC_METRICS: readonly MetricDef[];
export const METRIC_BY_KEY: MetricCatalog;

export function numeric(value: unknown): value is number;
export function scoreAccessor<T>(row: T, key: string): number | null;
export function ampi(entries: readonly { score: number | null; weight: number }[]): AmpiResult;
export function extractRawInputs(city: Record<string, unknown>): Record<string, unknown>;
export function scoreMetric(
  rawInputs: Record<string, unknown>,
  normStats: Record<string, NormStats>,
  metric: MetricDef,
): ScoreMetricResult;
export function scoreCity(
  rawInputs: Record<string, unknown>,
  normStats: Record<string, NormStats>,
): ScoreCityResult;
export function buildMetricCatalog(): MetricCatalog;
export function buildPillarMetrics(): Record<PillarId, readonly MetricDef[]>;
export function buildDiagnosticMetrics(): Record<PillarId, readonly MetricDef[]>;
