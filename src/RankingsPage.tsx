import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import RankingIntegrityBanner from "./RankingIntegrityBanner";
import { rankingRegions } from "./rankingsData";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_ORDER } from "./pillarConfig";
import type { PillarId } from "./pillarConfig";
import type { Locale, SitePath } from "./types";

/* PILLAR_ORDER imported from pillarConfig */

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  cityType: string;
  coverageGrade: string;
  manifestStatus: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
  overallWeightedCoverage?: number;
  pressureCoverage?: number;
  viabilityCoverage?: number;
  capabilityCoverage?: number;
  communityCoverage?: number;
  creativeCoverage?: number;
}

const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#f59e0b",
  C: "#f97316",
};

function coverageOpacity(coverage: number | undefined): number {
  if (coverage === undefined) return 1;
  if (coverage >= 75) return 1;
  if (coverage >= 50) return 0.7;
  return 0.4;
}

const CANONICAL = publishedData.canonicalWeights as Record<PillarId, number>;
const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => {
    const pillarScore = city[`${p}Score` as keyof PublishedCity] as number;
    return s + (pillarScore * weights[p]) / total;
  }, 0);
}

/* ───── severity styles ───── */

const severityStyles: Record<string, React.CSSProperties> = {
  severe: { borderLeft: "4px solid #ef4444", background: "rgba(239,68,68,0.08)", padding: "10px 14px" },
  moderate: { borderLeft: "4px solid #f59e0b", background: "rgba(245,158,11,0.06)", padding: "10px 14px" },
  mild: { borderLeft: "4px solid #3b82f6", background: "rgba(59,130,246,0.06)", padding: "10px 14px" },
};

/* ───── main component ───── */

export default function RankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const ui = copy.rankings;
  const labels = PILLAR_LABELS[locale];
  const hints = ui.pillarHints;

  // Weight allocation state
  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: CANONICAL[id],
    })),
  );

  // Filters
  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(50);

  // Derived state
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const isCustom = useMemo(() => {
    return PILLAR_ORDER.some((id) => weights[id] !== CANONICAL[id]);
  }, [weights]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

  // Re-rank cities with user weights
  const results = useMemo(() => {
    let filtered = rankedCities;
    if (region !== "All") {
      filtered = filtered.filter((c) => c.region === region);
    }
    return filtered
      .map((city) => ({
        ...city,
        customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights, region]);

  const displayResults = results.slice(0, showCountValue);

  const handleReset = () => {
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: CANONICAL[id],
      })),
    );
  };

  // Why explanation toggle
  const [showWhy, setShowWhy] = useState(false);

  return (
    <>
      <header className="rankings-hero section">
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h1 className="rankings-title">{ui.title}</h1>
          <p className="hero-intro" style={{ maxWidth: 640, margin: "12px auto 0" }}>
            {ui.intro}
          </p>
          <RankingIntegrityBanner locale={locale} />
        </div>
      </header>

      <main>
        <section className="section" style={{ paddingTop: 16 }}>
          <div className="rankings-workbench">
            {/* ─── LEFT: Spider Panel ─── */}
            <aside className="rankings-spider-panel">
              <div>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {ui.allocatorTitle}
                </h2>
                <p style={{ fontSize: 12, opacity: 0.5, margin: 0 }}>{ui.allocatorHint}</p>
              </div>

              {/* Scenarios feature */}
              <div style={{ padding: "12px 14px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "var(--radius, 8px)", border: "1px solid var(--glass-border)", backdropFilter: "blur(10px) saturate(120%)", display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600 }}>{ui.scenariosLabel}</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: "100%" }}>
                  <button type="button" className="mode-button" style={{ flex: 1, padding: "6px 10px", fontSize: 11, minHeight: "unset" }} onClick={() => {
                    const preset = { pressure: 5, viability: 30, capability: 15, community: 20, creative: 30 };
                    setPillars(PILLAR_ORDER.map(id => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: preset[id] })));
                  }}>
                    {ui.scenarioNomad}
                  </button>
                  <button type="button" className="mode-button" style={{ flex: 1, padding: "6px 10px", fontSize: 11, minHeight: "unset" }} onClick={() => {
                     const preset = { pressure: 10, viability: 30, capability: 35, community: 20, creative: 5 };
                     setPillars(PILLAR_ORDER.map(id => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: preset[id] })));
                  }}>
                    {ui.scenarioFamily}
                  </button>
                  <button type="button" className="mode-button" style={{ flex: 1, padding: "6px 10px", fontSize: 11, minHeight: "unset" }} onClick={() => {
                     const preset = { pressure: 40, viability: 10, capability: 15, community: 5, creative: 30 };
                     setPillars(PILLAR_ORDER.map(id => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: preset[id] })));
                  }}>
                    {ui.scenarioGrowth}
                  </button>
                </div>
              </div>

              <ZeroSumAllocator pillars={pillars} onChange={setPillars} />

              <button type="button" className="rankings-reset-btn" onClick={handleReset}>
                {ui.reset}
              </button>

              {/* Pillar hints */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PILLAR_ORDER.map((id) => (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, opacity: 0.5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: PILLAR_COLORS[id], flexShrink: 0 }} />
                    <span><strong>{labels[id]}</strong> — {hints[id as keyof typeof hints]}</span>
                  </div>
                ))}
              </div>

              {/* Canonical reference */}
              <div className="rankings-canonical-info">
                <div style={{ marginBottom: 6 }}>{ui.canonicalNote}</div>
                <button
                  type="button"
                  onClick={() => setShowWhy(!showWhy)}
                  style={{
                    background: "none", border: "none", padding: 0,
                    color: "rgba(99,179,237,0.8)", fontSize: 11, cursor: "pointer",
                    textDecoration: "underline", textUnderlineOffset: "2px",
                  }}
                >
                  {ui.whyThisRanking}
                </button>
                {showWhy && (
                  <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.6, opacity: 0.7 }}>
                    {ui.whyExplanation}
                  </p>
                )}
              </div>

              {/* Trade-off insights */}
              {consequences.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, marginBottom: 8, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {ui.consequencesTitle}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {consequences.map((c) => (
                      <div key={c.id} style={severityStyles[c.severity]}>
                        <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>{c.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* ─── RIGHT: Results Panel ─── */}
            <div className="rankings-results-panel">
              {/* Filter bar */}
              <div className="rankings-filter-bar">
                <span className={`rankings-mode-badge ${isCustom ? "is-custom" : "is-canonical"}`}>
                  {isCustom ? ui.customBadge : ui.canonicalBadge}
                </span>

                {/* Region filter */}
                <div className="region-switch" role="tablist" aria-label={ui.regionLabel} style={{ marginLeft: "auto" }}>
                  <button
                    type="button"
                    className={region === "All" ? "region-button active" : "region-button"}
                    onClick={() => setRegion("All")}
                  >
                    {ui.allRegions}
                  </button>
                  {rankingRegions.filter((r) => r !== "All").map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={r === region ? "region-button active" : "region-button"}
                      onClick={() => setRegion(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, opacity: 0.5 }}>
                  {results.length} {ui.citiesLabel}
                </span>
                <div className="rankings-count-toggle">
                  {([10, 50, 999] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={showCountValue === n ? "active" : ""}
                      onClick={() => setShowCountValue(n)}
                    >
                      {n === 10 ? ui.top10 : n === 50 ? ui.top50 : ui.showAll}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coverage legend */}
              <div className="coverage-legend">
                {ui.labels.coverage}:
                {" "}
                <span style={{ color: GRADE_COLORS.A }}>A</span> 75%+
                {" · "}
                <span style={{ color: GRADE_COLORS.B }}>B</span> 50–74%
                {" · "}
                <span style={{ color: GRADE_COLORS.C }}>C</span> 35–49%
              </div>

              {/* City list */}
              <motion.div layout style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <AnimatePresence>
                  {displayResults.map((city, index) => {
                    const pillarScores = {
                      pressure: city.pressureScore,
                      viability: city.viabilityScore,
                      capability: city.capabilityScore,
                      community: city.communityScore,
                      creative: city.creativeScore,
                    };
                    const isTop = index < 3;
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        key={city.cityId}
                        className={`rankings-city-row${isTop ? " is-top" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}
                        onKeyDown={(e) => { if (e.key === "Enter") onNavigate(`/city/${city.cityId}` as SitePath); }}
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div className="city-name-row">
                            <span className="city-display-name">{city.displayName}</span>
                            <span className="city-country">{city.country}</span>
                          </div>
                          <div className="rankings-pillar-bars">
                            {PILLAR_ORDER.map((pid) => {
                              const covKey = `${pid}Coverage` as keyof PublishedCity;
                              const cov = city[covKey] as number | undefined;
                              return (
                                <div key={pid}>
                                  <div style={{ width: `${pillarScores[pid]}%`, background: PILLAR_COLORS[pid], opacity: coverageOpacity(cov) }} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <span className="city-tier-arrow">&#8250;</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Actions */}
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  className="primary-action"
                  href="/methodology"
                  onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}
                >
                  {copy.nav.methodology}
                </a>
                <a className="secondary-action" href="/downloads/slic-ranked-cities-v2.csv" download>
                  Download CSV
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
