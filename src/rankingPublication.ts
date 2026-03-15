import publishedRankingData from "./data/publishedRankingData.json";

export interface PublishedRankingCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  manifestStatus: string;
  cityType: string;
  rank: number;
  slicScore: number;
  coverageGrade: string;
  overallWeightedCoverage: number | null;
  pressureScore: number | null;
  viabilityScore: number | null;
  capabilityScore: number | null;
  communityScore: number | null;
  creativeScore: number | null;
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
