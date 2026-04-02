import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { getVisitorStats } from "./visitorTracking";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28", viability: "#1a6b5a", capability: "#2a5a8c", community: "#8c4a2a", creative: "#a0382a",
};
const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};
const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
const EQUAL_WEIGHT = 20;

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

const severityClass: Record<string, string> = {
  severe: "tradeoff-card tradeoff-card--severe",
  moderate: "tradeoff-card tradeoff-card--moderate",
  mild: "tradeoff-card tradeoff-card--mild",
};

/* ── photos ── */
const HERO_PHOTO = "/launch-photos/20260318145941_DSC09480.jpg";
const STAGE_PHOTO = "/launch-photos/20260318145249_ABC01948.jpg";
const CITY_PHOTOS: Record<string, string> = {
  "th-bangkok": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&h=400&fit=crop&q=80",
  "kr-busan": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop&q=80",
  "jp-fukuoka": "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&h=400&fit=crop&q=80",
  "tw-kaohsiung": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&q=80",
  "pl-katowice": "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop&q=80",
  "fr-lyon": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600&h=400&fit=crop&q=80",
  "ca-montreal": "https://images.unsplash.com/photo-1519178614-68673b201f36?w=600&h=400&fit=crop&q=80",
  "us-raleigh": "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600&h=400&fit=crop&q=80",
  "cl-santiago": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&h=400&fit=crop&q=80",
  "tw-taipei": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop&q=80",
};

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

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

  /* ── rotating mottos ── */
  const mottos: string[][] = [
    ["Where can you still\nbuild a life?", "เมืองไหน\nยังสร้างชีวิตได้?", "哪座城市\n还能安身立命?"],
    ["What\u2019s left\nafter rent?", "จ่ายค่าเช่าแล้ว\nเหลืออะไร?", "付完房租\n还剩什么?"],
    ["Not a ranking.\nA reality check.", "ไม่ใช่การจัดอันดับ\nแต่คือความจริง", "不是排名\n而是现实检验"],
    ["Does your city\nwork for you?", "เมืองของคุณ\nทำงานให้คุณไหม?", "你的城市\n为你服务吗?"],
    ["157 cities.\nNo bullshit.", "157 เมือง\nไม่มีมุก", "157座城市\n没有废话"],
  ];

  const [mottoIndex, setMottoIndex] = useState(0);
  const [mottoFade, setMottoFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMottoFade(false);
      setTimeout(() => {
        setMottoIndex((i) => (i + 1) % mottos.length);
        setMottoFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [mottos.length]);

  const currentMotto = mottos[mottoIndex];

  return (
    <>
      {/* ════ 01. OPENING — typographic, rotating mottos ════ */}
      <header className="hp-opening">
        <div className="hp-opening-inner section">
          <p className="hp-kicker">{t(locale, "SLIC Index V3", "ดัชนี SLIC V3", "SLIC 指数 V3")}</p>
          <h1 className={mottoFade ? "hp-headline hp-headline--visible" : "hp-headline hp-headline--fading"}>
            {t(locale, currentMotto[0], currentMotto[1], currentMotto[2])}
          </h1>
          <p className="hp-deck">
            {t(locale,
              "Not prestige. Not GDP. What\u2019s left after rent, how long you work, whether your neighbors tolerate you. 157 cities scored on what actually matters.",
              "ไม่ใช่ชื่อเสียง ไม่ใช่ GDP แต่คือเงินเหลือหลังค่าเช่า ชั่วโมงทำงาน และว่าเพื่อนบ้านรับคุณได้ไหม 157 เมืองวัดในสิ่งที่สำคัญจริง",
              "不比声望不比GDP 而是租房后还剩多少 工作多久 邻居是否包容你 157座城市只衡量真正重要的事")}
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

      {/* ════ 02. FULL-BLEED PHOTO — the stage ════ */}
      <section className="hp-photo-break">
        <img src={HERO_PHOTO} alt="SCSE 2026" className="hp-photo-break-img" />
        <p className="hp-photo-caption">{t(locale, "Smart City Summit & Expo 2026, Taipei \u2014 where SLIC V2 launched to 3,000 people", "Smart City Summit & Expo 2026 ไทเป \u2014 ที่ที่ SLIC V2 เปิดตัวต่อหน้า 3,000 คน", "2026智慧城市峰会 台北 \u2014 SLIC V2向3000人发布")}</p>
      </section>

      {/* ════ 03. THE THESIS — editorial text block ════ */}
      <section className="hp-thesis section">
        <div className="hp-thesis-inner">
          <h2 className="hp-thesis-title">
            {t(locale,
              "Every city ranking is an ideology.\nThis one admits it.",
              "ทุกการจัดอันดับเมืองคืออุดมการณ์\nดัชนีนี้ยอมรับมัน",
              "每个城市排名都是一种意识形态\n这个排名承认这一点")}
          </h2>
          <p className="hp-thesis-body">
            {t(locale,
              "EIU rewards stability for expats. Mercer calculates hardship allowances. Monocle curates lifestyle for the already-rich. SLIC asks a different question: where can an ordinary person afford life, keep dignity, find community, and still have ambition left over?",
              "EIU ให้รางวัลเสถียรภาพสำหรับชาวต่างชาติ Mercer คำนวณค่าตอบแทนความลำบาก Monocle จัดไลฟ์สไตล์สำหรับคนรวยอยู่แล้ว SLIC ถามคำถามที่ต่าง: คนธรรมดาจะมีชีวิตที่จ่ายไหว รักษาศักดิ์ศรี มีชุมชน และยังมีพลังเหลือได้ที่ไหน?",
              "EIU奖赏外派安定 Mercer计算艰苦津贴 Monocle为已经富有的人策展生活方式 SLIC问的是另一个问题：普通人在哪里还负担得起生活、保有尊严、找到社区、还有余力追求理想？")}
          </p>
          <a className="hp-thesis-link" href="/compare" onClick={(e) => { e.preventDefault(); onNavigate("/compare"); }}>
            {t(locale, "Read the full comparison", "อ่านการเปรียบเทียบเต็ม", "阅读完整对比")} &rarr;
          </a>
        </div>
      </section>

      {/* ════ 04. ALPHA TIER — the answer ════ */}
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

      {/* ════ 05. SECOND PHOTO BREAK ════ */}
      <section className="hp-photo-break hp-photo-break--narrow">
        <img src={STAGE_PHOTO} alt="Dr Non on stage" className="hp-photo-break-img" />
        <p className="hp-photo-caption">{t(locale, "Dr Non presenting SLIC V2 at SCSE Taipei. European mayors asked to replace The Economist\u2019s index.", "ดร.ณณ นำเสนอ SLIC V2 ที่ SCSE ไทเป นายกเทศมนตรียุโรปขอใช้แทนดัชนี The Economist", "Non博士在台北SCSE展示SLIC V2 欧洲市长联盟要求用它取代经济学人指数")}</p>
      </section>

      {/* ════ 06. BETA + GAMMA ════ */}
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

      {/* ════ 07. SPIDER — your turn ════ */}
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

      {/* ════ 08. CTA ════ */}
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
