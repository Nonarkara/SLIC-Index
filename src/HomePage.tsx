import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { getVisitorStats } from "./visitorTracking";
import SiteFooter from "./SiteFooter";
import ComparisonGrid from "./ComparisonGrid";
import { getCopy } from "./siteCopy";
import { SLIC_LOGO_INLINE } from "./brandAssets";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_ORDER, EQUAL_WEIGHT } from "./pillarConfig";
import type { PillarId } from "./pillarConfig";
import type { Locale, SitePath } from "./types";

interface PublishedCity {
  cityId: string; displayName: string; country: string; region: string; rankingStatus: string;
  pressureScore: number; viabilityScore: number; capabilityScore: number; communityScore: number; creativeScore: number; slicScore: number; rank: number;
}
const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => s + ((city[`${p}Score` as keyof PublishedCity] as number) * weights[p]) / total, 0);
}

const severityClass: Record<string, string> = { severe: "tradeoff-card tradeoff-card--severe", moderate: "tradeoff-card tradeoff-card--moderate", mild: "tradeoff-card tradeoff-card--mild" };

const HERO_PHOTO = "/launch-photos/20260318145941_DSC09480.jpg";
const CITY_PHOTOS: Record<string, string> = {
  "th-bangkok": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop&q=80",
  "kr-busan": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop&q=80",
  "jp-fukuoka": "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop&q=80",
  "tw-kaohsiung": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&q=80",
  "pl-katowice": "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop&q=80",
  "fr-lyon": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600&h=400&fit=crop&q=80",
  "ca-montreal": "/city-photos/montreal.jpg",
  "us-raleigh": "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600&h=400&fit=crop&q=80",
  "cl-santiago": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&h=400&fit=crop&q=80",
  "tw-taipei": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop&q=80",
};

export default function HomePage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const copy = getCopy(locale);
  const ui = copy.home;
  const labels = PILLAR_LABELS[locale];

  const [visitors, setVisitors] = useState(12424);
  useEffect(() => { getVisitorStats().then((s) => setVisitors(s.count)); }, []);

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: EQUAL_WEIGHT })),
  );
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);
  const consequences = useMemo<FiredConsequence[]>(() => evaluateConsequences(weights), [weights]);
  const results = useMemo(() =>
    rankedCities.map((c) => ({ ...c, customScore: Math.round(scoreCityWithWeights(c, weights) * 10) / 10 })).sort((a, b) => b.customScore - a.customScore),
  [weights]);
  const handleReset = () => setPillars(PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: EQUAL_WEIGHT })));

  return (
    <>
      {/* ════ 01. HERO — The thesis, not just a tagline ════ */}
      <header className="hp-opening">
        <div className="hp-opening-inner section">
          <img src={SLIC_LOGO_INLINE} alt="SLIC Index" className="hp-hero-logo" />
          <p className="hp-kicker">{ui.kicker}</p>
          <h1 className="hp-headline">
            {ui.headline}
          </h1>
          <p className="hp-deck">
            {ui.deck}
          </p>
          <div className="hp-opening-stats">
            <span><strong>{rankedCities.length}</strong> {ui.cities}</span>
            <span className="hp-stat-sep">/</span>
            <span><strong>5</strong> {ui.pillars}</span>
            <span className="hp-stat-sep">/</span>
            <span><strong>{visitors.toLocaleString()}</strong> {ui.visitors}</span>
          </div>
        </div>
      </header>

      {/* ════ 02. THE REVEAL — Six Indices Side-by-Side ════ */}
      <section className="hp-grid-reveal">
        <div className="section">
          <p className="hp-grid-kicker">{ui.gridKicker}</p>
          <ComparisonGrid locale={locale} />
          <p className="hp-grid-note">
            {ui.gridNote}
          </p>
        </div>
      </section>

      {/* ════ 03. FULL-BLEED PHOTO ════ */}
      <section className="hp-photo-break">
        <img src={HERO_PHOTO} alt="SCSE 2026" className="hp-photo-break-img" />
        <p className="hp-photo-caption">{ui.photoCaption}</p>
      </section>

      {/* ════ 04. ALPHA TIER ════ */}
      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">{ui.alphaTitle}</h2>
        </div>
        <div className="v3-alpha-grid section">
          {results.slice(0, 10).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => {
            const photo = CITY_PHOTOS[city.cityId];
            return (
              <button key={city.cityId} className="v3-city-card v3-city-card--photo" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {photo && <img src={photo} alt={city.displayName} loading="lazy" className="v3-city-card-img" />}
                <div className="v3-city-card-overlay">
                  <span className="v3-city-card-score">{city.customScore.toFixed(1)}</span>
                  <span className="v3-city-card-name">{city.displayName}</span>
                  <span className="v3-city-card-country">{city.country}</span>
                  <div className="v3-city-card-bars">
                    {PILLAR_ORDER.map((pid) => <div key={pid} style={{ width: `${(city[`${pid}Score` as keyof typeof city] as number)}%`, background: PILLAR_COLORS[pid] }} />)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ════ 05. BETA + GAMMA ════ */}
      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; {ui.beta}</span>
          <div className="v3-lower-tier-cities">
            {results.slice(10, 20).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--gamma">&gamma; {ui.gamma}</span>
          <div className="v3-lower-tier-cities">
            {results.slice(20, 30).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ 06. SPIDER ════ */}
      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">{ui.disagreeTitle}</h2>
          <p className="v3-spider-hint">{ui.disagreeHint}. {ui.allocatorHint}</p>
          <div className="v3-spider-layout">
            <div className="v3-spider-chart">
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} />
              <button type="button" className="rankings-reset-btn" onClick={handleReset}>{ui.reset}</button>
            </div>
            <div className="v3-spider-results">
              {consequences.length > 0 && (
                <div className="v3-tradeoffs">
                  {consequences.slice(0, 3).map((c) => (
                    <div key={c.id} className={severityClass[c.severity]}><p>{c.narrative}</p></div>
                  ))}
                </div>
              )}
              <motion.div layout className="v3-spider-list">
                <AnimatePresence>
                  {results.slice(0, 15).map((city, i) => (
                    <motion.button 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      key={city.cityId} 
                      className="v3-spider-row" 
                      onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}
                    >
                      <span className="v3-spider-rank">{String(i + 1).padStart(2, "0")}</span>
                      <span className="v3-spider-name">{city.displayName}</span>
                      <span className="v3-spider-score">{city.customScore.toFixed(1)}</span>
                      <span className="v3-spider-country">{city.country}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 07. CTA ════ */}
      <section className="v3-cta-section section">
        <a className="v3-cta" href="/compare" onClick={(e) => { e.preventDefault(); onNavigate("/compare"); }}>
          {ui.fullComparison} &rarr;
        </a>
        <a className="v3-cta-secondary" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
          {copy.nav.methodology}
        </a>
        <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
          {copy.nav.aboutSlic}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
