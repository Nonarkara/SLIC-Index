import manifest from "./slicScoringManifest.json";

type Scalar = string | number | null;
type SheetColumns = typeof manifest.sheetColumns;

type SheetField<K extends keyof SheetColumns> = SheetColumns[K][number];

export type CoverageGrade = "A" | "B" | "C" | "Watchlist";
export type ManifestStatus = "locked" | "provisional";
export type CityType = "primary" | "secondary";
export type RankingStatus = "Ranked" | "Watchlist";

export type CityUniverseField = SheetField<"City_Universe">;
export type CountryContextField = SheetField<"Country_Context">;
export type CityInputField = SheetField<"City_Inputs">;
export type MetricCatalogField = SheetField<"Metric_Catalog">;
export type ScoreField = SheetField<"Scores">;
export type LeaderboardField = SheetField<"Leaderboard">;

export type CityUniverseRecord = Record<CityUniverseField, Scalar>;
export type CountryContextRecord = Record<CountryContextField, Scalar>;
export type CityInputRecord = Record<CityInputField, Scalar>;
export type ComputedCityScore = Record<ScoreField, Scalar>;

export interface MetricDefinition {
  metric_id: string;
  metric_name: string;
  pillar_id: string;
  pillar_name: string;
  pillar_weight: number;
  metric_weight: number;
  directionality: string;
  scoring_role: string;
  requiredness: string;
  data_level: string;
  source_priority: string;
  workbook_input: string;
  notes: string;
}

export interface ScoreInputDefinition {
  input_key: string;
  label: string;
  source_column: string;
  directionality: string;
  coverage_weight: number;
  aggregate_metric_id: string;
  notes: string;
}

export const WORKBOOK_SHEETS = manifest.workbookSheets;
export const COVERAGE_THRESHOLDS = manifest.coverageThresholds;
export const SOURCE_TIERS = manifest.sourceTiers;
export const SHEET_COLUMNS = manifest.sheetColumns;
export const METRIC_DEFINITIONS = manifest.metricDefinitions as MetricDefinition[];
export const SCORE_INPUT_DEFINITIONS = manifest.scoreInputs as ScoreInputDefinition[];

export const THAI_PRIORITY_INPUTS = [
  "province_gdp_per_capita",
  "pollution_index",
  "hospital_count",
  "school_count",
  "infrastructure_index",
  "median_income",
  "longevity",
  "competitiveness_index",
] as const;

export type ThaiPriorityInput = (typeof THAI_PRIORITY_INPUTS)[number];

export const slicScoringManifest = manifest;
