import publishedRankingData from "./data/publishedRankingData.json";

export interface PublishedRankingCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  manifestStatus: string;
  cityType: string;
  rankingStatus: string;
  rank: number;
  tierLabel: "Alpha" | "Beta" | "Gamma" | null;
  tierSlot: number | null;
  tierReason?: string | null;
  slicScore: number;
  slicScoreExact?: number | null;
  coverageGrade: string;
  overallWeightedCoverage: number | null;
  overallWeightedCoverageExact?: number | null;
  pressureScore: number | null;
  pressureScoreExact?: number | null;
  viabilityScore: number | null;
  viabilityScoreExact?: number | null;
  capabilityScore: number | null;
  capabilityScoreExact?: number | null;
  communityScore: number | null;
  communityScoreExact?: number | null;
  creativeScore: number | null;
  creativeScoreExact?: number | null;
  weightedMeanExact?: number | null;
  weightedVarianceExact?: number | null;
  ampiExact?: number | null;
  coveragePenalty?: number | null;
  provenanceSummary?: Record<string, unknown>;
}

export interface PublicationManifest {
  generatedAt: string;
  scorerVersion: string;
  tierPolicyVersion: string;
  normStatsHash: string;
  inputDataHash: string;
  metricCatalogHash: string;
  publicationHash: string;
}

export interface RankingPublicationState {
  publishable: boolean;
  status: "published" | "reranking";
  updatedAt: string;
  canonicalWeights: Record<string, number>;
  qualifiedCityCount?: number;
  integrityIssueCount?: number;
  validCountryRowCount?: number;
  validCityRowCount?: number;
  metricCatalog?: Record<string, unknown>;
  pillarMetrics?: Record<string, unknown>;
  diagnosticMetrics?: Record<string, unknown>;
  diagnostics?: Record<string, unknown>;
  methodologyFacts?: Record<string, unknown>;
  changeSummary?: Record<string, unknown>;
  stabilityAnalysis?: Record<string, unknown>;
  publicationManifest?: PublicationManifest;
  issues: string[];
  cities: PublishedRankingCity[];
}

export const rankingPublication = publishedRankingData as RankingPublicationState;

export const rankingIntegrity = {
  publishable: rankingPublication.publishable,
  status: rankingPublication.status,
  issues: rankingPublication.issues,
  updatedAt: rankingPublication.updatedAt,
} as const;
