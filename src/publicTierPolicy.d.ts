export type PublicTierLabel = "Alpha" | "Beta" | "Gamma";

export interface PublicTierRules {
  alphaMinCommunity: number;
  alphaMinPressure: number;
  betaMinCommunity: number;
  betaMinPressure: number;
  maxPerTier: number;
  maxEuropeInAlpha: number;
  maxOceaniaInAlpha: number;
  maxTaiwanAcrossPublicTiers: number;
  maxJapanAcrossPublicTiers: number;
  maxJapanInAlpha: number;
  maxSouthKoreaInAlpha: number;
  alphaCountryExclusions: readonly string[];
  alphaCityExclusions: readonly string[];
}

type RankDecorated<T, RankKey extends string> = T & Record<RankKey, number>;

type TierDecorated<
  T,
  TierLabelKey extends string,
  TierSlotKey extends string,
  TierReasonKey extends string,
  TierDiagnosticsKey extends string,
> = T &
  Record<TierLabelKey, PublicTierLabel | null> &
  Record<TierSlotKey, number | null> &
  Record<TierReasonKey, string | null> &
  Record<TierDiagnosticsKey, unknown>;

export const PUBLIC_TIER_POLICY_VERSION: string;
export const PUBLIC_TIER_ORDER: readonly PublicTierLabel[];
export const PUBLIC_TIER_RULES: PublicTierRules;

export function mergePublicTierRules(overrides?: Partial<PublicTierRules>): Readonly<PublicTierRules>;

export function compareCitiesByPublishedScore<T>(
  left: T,
  right: T,
  scoreKey?: string,
): number;

export function assignPureScoreRanks<T, RankKey extends string = "rank">(
  cities: readonly T[],
  options?: {
    scoreKey?: string;
    rankKey?: RankKey;
  },
): Array<RankDecorated<T, RankKey>>;

export function allocatePublicTiers<
  T,
  TierLabelKey extends string = "tierLabel",
  TierSlotKey extends string = "tierSlot",
  TierReasonKey extends string = "tierReason",
  TierDiagnosticsKey extends string = "tierDiagnostics",
>(
  cities: readonly T[],
  options?: {
    scoreKey?: string;
    rankKey?: string;
    tierLabelKey?: TierLabelKey;
    tierSlotKey?: TierSlotKey;
    tierReasonKey?: TierReasonKey;
    tierDiagnosticsKey?: TierDiagnosticsKey;
    rules?: Partial<PublicTierRules>;
  },
): Array<TierDecorated<T, TierLabelKey, TierSlotKey, TierReasonKey, TierDiagnosticsKey>>;
