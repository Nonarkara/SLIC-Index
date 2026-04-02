import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { getVisitorStats } from "./visitorTracking";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ───── pillar config ───── */

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const EQUAL_WEIGHT = 20;

/* ───── published ranking data ───── */

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  rankingStatus: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
}

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

/* ───── locale copy ───── */

const heroCopy: Record<Locale, {
  allocatorHint: string;
  resetLabel: string;
}> = {
  en: { allocatorHint: "Drag the web or use sliders. Total = 100.", resetLabel: "Reset" },
  th: { allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวม = 100", resetLabel: "รีเซ็ต" },
  zh: { allocatorHint: "拖动蛛网图或使用滑块，总分 = 100", resetLabel: "重置" },
};

/* ───── severity → CSS class map ───── */

const severityClass: Record<string, string> = {
  severe: "tradeoff-card tradeoff-card--severe",
  moderate: "tradeoff-card tradeoff-card--moderate",
  mild: "tradeoff-card tradeoff-card--mild",
};

/* ───── city photo URLs ───── */

const HERO_PHOTO = "/launch-photos/20260318145941_DSC09480.jpg";

const CITY_PHOTOS: Record<string, string> = {
  "th-bangkok": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop",
  "kr-busan": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",
  "jp-fukuoka": "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop",
  "tw-kaohsiung": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  "pl-katowice": "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop",
  "fr-lyon": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600&h=400&fit=crop",
  "ca-montreal": "https://images.unsplash.com/photo-1519178614-68673b201f36?w=600&h=400&fit=crop",
  "us-raleigh": "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600&h=400&fit=crop",
  "cl-santiago": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&h=400&fit=crop",
  "tw-taipei": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop",
};

/* ───── t() helper ───── */
function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

/* ───── main component ───── */

export default function HomePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const ui = heroCopy[locale];
  const labels = PILLAR_LABELS[locale];

  const [visitors, setVisitors] = useState(12424);
  useEffect(() => {
    getVisitorStats().then((stats) => { setVisitors(stats.count); });
  }, []);

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: EQUAL_WEIGHT,
    })),
  );

  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

  const results = useMemo(() => {
    return rankedCities
      .map((city) => ({
        ...city,
        customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights]);

  const handleReset = () => {
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: EQUAL_WEIGHT,
      })),
    );
  };

  return (
    <>
      {/* ═══════ 01. HERO — Clean, direct ═══════ */}
      <header className="v3-hero v3-hero--slim">
        <img src={HERO_PHOTO} alt="SCSE 2026 Taipei" className="v3-hero-bg" />
        <div className="v3-hero-content section">
          <h1 className="v3-hero-title">
            {t(locale, "Not a ranking.\nA reality check.", "ไม่ใช่การจัดอันดับ\nแต่คือความจริง", "不是排名\n而是现实检验")}
          </h1>
          <p className="v3-hero-sub">
            {t(locale,
              "157 cities. 5 pillars. Every score traceable. Click any city \u2014 see exactly where every number comes from.",
              "157 เมือง 5 เสาหลัก ทุกคะแนนสืบย้อนได้ คลิกเมืองไหนก็ได้ \u2014 ดูที่มาของทุกตัวเลข",
              "157 座城市 5 大支柱 每个分数都可追溯 点击任何城市 \u2014 查看每个数字的来源")}
          </p>
          <div className="v3-hero-actions">
            <a className="v3-cta" href="#tiers" onClick={(e) => { e.preventDefault(); document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" }); }}>
              {t(locale, "SEE THE CITIES", "ดูเมือง", "查看城市")} &darr;
            </a>
            <a className="v3-cta-secondary" href="/compare" onClick={(e) => { e.preventDefault(); onNavigate("/compare"); }}>
              {t(locale, "HOW WE DIFFER", "เราต่างอย่างไร", "我们的不同")}
            </a>
          </div>
          <div className="v3-hero-stats">
            <span><strong>{rankedCities.length}</strong> {t(locale, "cities", "เมือง", "城市")}</span>
            <span><strong>35</strong> {t(locale, "signals", "สัญญาณ", "信号")}</span>
            <span><strong>{visitors.toLocaleString()}</strong> {t(locale, "visitors", "ผู้เข้าชม", "访客")}</span>
          </div>
        </div>
      </header>

      {/* ═══════ 02. ALPHA TIER ═══════ */}
      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">{t(locale,
            "10 cities. 4 continents. These are real places \u2014 click any to see why.",
            "10 เมือง 4 ทวีป สถานที่จริง \u2014 คลิกเพื่อดูว่าทำไม",
            "10 座城市 4 大洲 真实的地方 \u2014 点击任何城市了解原因")}</h2>
        </div>
        <div className="v3-alpha-grid section">
          {results.slice(0, 10).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => {
            const photo = CITY_PHOTOS[city.cityId];
            return (
              <button
                key={city.cityId}
                className="v3-city-card v3-city-card--photo"
                onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}
              >
                {photo && <img src={photo} alt={city.displayName} loading="lazy" className="v3-city-card-img" />}
                <div className="v3-city-card-overlay">
                  <span className="v3-city-card-score">{city.customScore.toFixed(1)}</span>
                  <span className="v3-city-card-name">{city.displayName}</span>
                  <span className="v3-city-card-country">{city.country}</span>
                  <div className="v3-city-card-bars">
                    {PILLAR_ORDER.map((pid) => {
                      const score = city[`${pid}Score` as keyof typeof city] as number;
                      return <div key={pid} style={{ width: `${score}%`, background: PILLAR_COLORS[pid] }} />;
                    })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════ 03. BETA + GAMMA ═══════ */}
      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; BETA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(10, 20).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--gamma">&gamma; GAMMA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(20, 30).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 04. SPIDER ═══════ */}
      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">{t(locale, "NOW MAKE YOUR OWN.", "ตอนนี้สร้างของคุณเอง", "现在自己来")}</h2>
          <p className="v3-spider-hint">{locale === "en" ? "Drag the spider. Crank growth to 100% \u2014 watch Singapore and Jakarta rise. Max viability \u2014 safe, clean cities float up. This is your ranking, not ours." : ui.allocatorHint}</p>
          <div className="v3-spider-layout">
            <div className="v3-spider-chart">
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} />
              <button type="button" className="rankings-reset-btn" onClick={handleReset}>{ui.resetLabel}</button>
            </div>
            <div className="v3-spider-results">
              {consequences.length > 0 && (
                <div className="v3-tradeoffs">
                  {consequences.slice(0, 3).map((c) => (
                    <div key={c.id} className={severityClass[c.severity]}><p>{c.narrative}</p></div>
                  ))}
                </div>
              )}
              <div className="v3-spider-list">
                {results.slice(0, 15).map((city, i) => (
                  <button key={city.cityId} className="v3-spider-row" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                    <span className="v3-spider-rank">{String(i + 1).padStart(2, "0")}</span>
                    <span className="v3-spider-name">{city.displayName}</span>
                    <span className="v3-spider-score">{city.customScore.toFixed(1)}</span>
                    <span className="v3-spider-country">{city.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 05. CTA ═══════ */}
      <section className="v3-cta-section section">
        <a className="v3-cta" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
          {t(locale, "READ THE METHODOLOGY", "อ่านระเบียบวิธี", "阅读方法论")} &rarr;
        </a>
        <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
          {t(locale, "ABOUT SLIC", "เกี่ยวกับ SLIC", "关于 SLIC")}
        </a>
        <a className="v3-cta-secondary" href="/history" onClick={(e) => { e.preventDefault(); onNavigate("/history"); }}>
          {t(locale, "THE JOURNEY", "เบื้องหลัง", "发展历程")}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
