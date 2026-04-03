import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { getVisitorStats } from "./visitorTracking";
import SiteFooter from "./SiteFooter";
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

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

/* ── The establishment's favorites (for the callout) ── */
const ESTABLISHMENT_TOP = ["Vienna", "Zurich", "Copenhagen", "Melbourne", "Geneva", "Auckland", "London", "Paris", "Singapore", "Tokyo"];

export default function HomePage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const ui = { allocatorHint: t(locale, "Drag the web or use sliders. Total = 100.", "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวม = 100", "拖动蛛网图或使用滑块，总分 = 100"), resetLabel: t(locale, "Reset", "รีเซ็ต", "重置") };
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

  /* Which SLIC top 10 cities are NOT in the establishment top 10? */
  const slicExclusive = results.slice(0, 10).filter((c) => !ESTABLISHMENT_TOP.includes(c.displayName));

  return (
    <>
      {/* ════ 01. HERO — The thesis, not just a tagline ════ */}
      <header className="hp-opening">
        <div className="hp-opening-inner section">
          <img src={SLIC_LOGO_INLINE} alt="SLIC Index" className="hp-hero-logo" />
          <p className="hp-kicker">{t(locale, "157 cities, 35 signals, zero bullshit", "157 เมือง 35 สัญญาณ ไม่มีมุก", "157城市 35信号 零废话")}</p>
          <h1 className="hp-headline">
            {t(locale,
              "Where can you still\nbuild a life?",
              "เมืองไหน\nยังสร้างชีวิตได้?",
              "哪座城市\n还能安身立命?")}
          </h1>
          <p className="hp-deck">
            {t(locale,
              "Not prestige. Not GDP. What\u2019s left after rent, how long you work, whether your neighbors tolerate you. 157 cities scored on what actually matters. Every number traceable.",
              "ไม่ใช่ชื่อเสียง ไม่ใช่ GDP แต่คือเงินเหลือหลังค่าเช่า ชั่วโมงทำงาน และว่าเพื่อนบ้านรับคุณได้ไหม 157 เมืองวัดในสิ่งที่สำคัญจริง ทุกตัวเลขสืบย้อนได้",
              "不比声望不比GDP 而是租房后还剩多少 工作多久 邻居是否包容你 157座城市只衡量真正重要的事 每个数字都可追溯")}
          </p>
          <div className="hp-opening-stats">
            <span><strong>{rankedCities.length}</strong> {t(locale, "cities", "เมือง", "城市")}</span>
            <span className="hp-stat-sep">/</span>
            <span><strong>5</strong> {t(locale, "pillars", "เสาหลัก", "支柱")}</span>
            <span className="hp-stat-sep">/</span>
            <span><strong>{visitors.toLocaleString()}</strong> {t(locale, "visitors", "ผู้เข้าชม", "访客")}</span>
          </div>
        </div>
      </header>

      {/* ════ 02. THE PUNCHLINE — comparison callout ════ */}
      <section className="hp-callout">
        <div className="hp-callout-inner section">
          <div className="hp-callout-left">
            <p className="hp-callout-label">{t(locale, "EVERY OTHER INDEX AGREES ON", "ทุกดัชนีอื่นเห็นพ้องกับ", "所有其他指数都认同")}</p>
            <p className="hp-callout-list">Vienna, Zurich, Copenhagen, Melbourne, Geneva, Auckland, London, Paris, Singapore, Tokyo</p>
            <p className="hp-callout-note">{t(locale, "Five indices, five methodologies, one answer: rich, stable, Western-ish. The top 10 are separated by less than 2 points. The difference between #1 and #10 is smaller than a rounding error.", "ห้าดัชนี ห้าระเบียบวิธี คำตอบเดียว: ร่ำรวย มั่นคง แบบตะวันตก ท็อป 10 ต่างกันไม่ถึง 2 คะแนน", "五个指数 五种方法论 一个答案：富裕稳定偏西方 前10名相差不到2分")}</p>
          </div>
          <div className="hp-callout-divider" />
          <div className="hp-callout-right">
            <p className="hp-callout-label hp-callout-label--slic">{t(locale, "SLIC DISAGREES", "SLIC ไม่เห็นด้วย", "SLIC持不同意见")}</p>
            <p className="hp-callout-list hp-callout-list--slic">{slicExclusive.map((c) => c.displayName).join(", ")}</p>
            <p className="hp-callout-note">{t(locale,
              "Zero of these cities appear in any establishment top 10. But people actually live here, build careers, raise families, and stay. Try telling someone in Kaohsiung their city isn\u2019t liveable.",
              "ไม่มีเมืองเหล่านี้ในท็อป 10 ของดัชนีอื่นเลย แต่คนอาศัยอยู่จริง สร้างอาชีพ เลี้ยงครอบครัว และอยู่ต่อ ลองบอกคนเกาสงว่าเมืองเขาไม่น่าอยู่ดูสิ",
              "这些城市都不在任何机构前10名中 但人们真的住在这里 建立事业 养育家庭 并且留下来 试着告诉高雄人他们的城市不宜居")}</p>
          </div>
        </div>
        <div className="section">
          <a className="hp-callout-cta" href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }}>
            {t(locale, "See the full comparison \u2014 six indices, side by side", "ดูการเปรียบเทียบเต็ม \u2014 หกดัชนีเทียบกัน", "查看完整对比 \u2014 六个指数并排")} &rarr;
          </a>
        </div>
      </section>

      {/* ════ 03. FULL-BLEED PHOTO ════ */}
      <section className="hp-photo-break">
        <img src={HERO_PHOTO} alt="SCSE 2026" className="hp-photo-break-img" />
        <p className="hp-photo-caption">{t(locale, "SCSE 2026, Taipei \u2014 3,000 professionals. A European mayor\u2019s alliance asked to use SLIC instead of The Economist\u2019s index.", "SCSE 2026 ไทเป \u2014 ผู้เชี่ยวชาญ 3,000 คน พันธมิตรนายกเทศมนตรียุโรปขอใช้ SLIC แทนดัชนี The Economist", "SCSE 2026 台北 \u2014 3000位专业人士 欧洲市长联盟要求用SLIC取代经济学人指数")}</p>
      </section>

      {/* ════ 04. ALPHA TIER ════ */}
      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">{t(locale,
            "These ten cities scored highest. Click any to see exactly why.",
            "สิบเมืองนี้ได้คะแนนสูงสุด คลิกเพื่อดูว่าทำไม",
            "这十座城市得分最高 点击查看具体原因")}</h2>
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

      {/* ════ 06. SPIDER ════ */}
      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">{t(locale, "Now disagree with us.", "ตอนนี้ลองไม่เห็นด้วยกับเรา", "现在来反驳我们")}</h2>
          <p className="v3-spider-hint">{t(locale, "Drag the spider. Crank growth to 100% \u2014 watch Singapore and Jakarta rise. Max viability \u2014 safe, clean cities float up. This is your ranking, not ours.", ui.allocatorHint, ui.allocatorHint)}</p>
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

      {/* ════ 07. CTA ════ */}
      <section className="v3-cta-section section">
        <a className="v3-cta" href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }}>
          {t(locale, "THE FULL COMPARISON", "เปรียบเทียบเต็ม", "完整对比")} &rarr;
        </a>
        <a className="v3-cta-secondary" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
          {t(locale, "METHODOLOGY", "ระเบียบวิธี", "方法论")}
        </a>
        <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
          {t(locale, "ABOUT SLIC", "เกี่ยวกับ SLIC", "关于 SLIC")}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
