import React, { useMemo, useState } from "react";
import ComparisonGrid from "./ComparisonGrid";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import SiteFooter from "./SiteFooter";
import publishedData from "./data/publishedRankingData.json";
import "./compareRankingsData"; // data module used by /compare detail route
import { SLIC_LOGO_INLINE } from "./brandAssets";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_ORDER, EQUAL_WEIGHT } from "./pillarConfig";
import type { PillarId } from "./pillarConfig";
import type { Locale, SitePath } from "./types";

interface PublishedCity {
  cityId: string; displayName: string; country: string; region: string; rankingStatus: string;
  pressureScore: number; viabilityScore: number; capabilityScore: number; communityScore: number; creativeScore: number; slicScore: number; rank: number;
}
const rankedCities = ((publishedData.cities ?? []) as PublishedCity[]).filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => s + ((city[`${p}Score` as keyof PublishedCity] as number) * weights[p]) / total, 0);
}

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

const severityClass: Record<string, string> = { severe: "tradeoff-card tradeoff-card--severe", moderate: "tradeoff-card tradeoff-card--moderate", mild: "tradeoff-card tradeoff-card--mild" };

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



/* Blind spots diagram data */
const BLIND_SPOT_ROWS = [
  { label: "Housing affordability", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Overwork / working hours", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Tolerance / civic openness", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Resident satisfaction", eiu: false, mercer: false, resonance: true, monocle: false, yonsei: false, slic: true },
  { label: "Suicide / mental strain", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Graduate housing burden", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Cultural diversity", eiu: false, mercer: false, resonance: false, monocle: true, yonsei: false, slic: true },
  { label: "Income after rent (PPP)", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
];

const PILLAR_DATA = [
  { id: "pressure", weight: "25%", name: "Growth", desc: "Economic dynamism. What\u2019s left after rent. Housing burden. Working-time pressure." },
  { id: "viability", weight: "22%", name: "Viability", desc: "Safety. Transit. Clean air. Digital infrastructure. Climate." },
  { id: "capability", weight: "18%", name: "Capability", desc: "Healthcare access. Education quality. Equal opportunity." },
  { id: "community", weight: "15%", name: "Community", desc: "Belonging. Tolerance. Cultural life. Whether your neighbors want you there." },
  { id: "creative", weight: "20%", name: "Creative", desc: "Entrepreneurial friction. Innovation intensity. Government stability." },
];

export default function CompareRankingsPage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const labels = PILLAR_LABELS[locale];
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
  const slicTop10 = results.slice(0, 10);

  return (
    <>
      {/* ═══ ACT 1: THE PROVOCATION ═══ */}
      <header className="oped-open">
        <img src={SLIC_LOGO_INLINE} alt="SLIC Index" className="oped-open-logo" />
        <h1 className="oped-open-headline">
          {t(locale,
            "Every city ranking is a lie.\nHere\u2019s <em>ours</em>.",
            "ทุกการจัดอันดับเมืองคือคำโกหก\nนี่คือ<em>ของเรา</em>",
            "每个城市排名都是谎言\n这是<em>我们的</em>"
          ).split(/<em>|<\/em>/).map((part, i) =>
            i % 2 === 1 ? <em key={i}>{part}</em> : part
          )}
        </h1>
        <span className="oped-scroll-hint">{t(locale, "scroll", "เลื่อนลง", "向下滚动")}</span>
      </header>

      {/* ═══ ACT 2: THE COMPARISON GRID ═══ */}
      <section className="hp-grid-reveal">
        <div className="section">
          <p className="hp-grid-kicker">{t(locale, "SIX INDICES. SIDE BY SIDE.", "หกดัชนี เทียบกัน", "六个指数 并排对比")}</p>
          <ComparisonGrid locale={locale} />
          <p className="hp-grid-note">{t(locale,
            "Five indices, five methodologies, one answer: rich, stable, Western-ish. SLIC asks a different question. Hover any city to see where else it appears.",
            "ห้าดัชนี ห้าระเบียบวิธี คำตอบเดียว: ร่ำรวย มั่นคง แบบตะวันตก SLIC ถามคำถามที่ต่าง วางเมาส์ที่เมืองใดก็ได้",
            "五个指数 五种方法论 一个答案：富裕稳定偏西方 SLIC问的是另一个问题 悬停在任何城市上查看")}</p>
        </div>
      </section>

      {/* Pull quote */}
      <div className="oped-pullquote">
        <p>{t(locale,
          "\u201CThe difference between the world\u2019s #1 city and #10 is 1.8 points out of 100. One new park can swing a ranking. One traffic camera can change a score.\u201D",
          "\u201Cความแตกต่างระหว่างเมือง #1 กับ #10 ของโลกคือ 1.8 คะแนนจาก 100 สวนสาธารณะใหม่หนึ่งแห่งเปลี่ยนอันดับได้ กล้องจราจรตัวเดียวเปลี่ยนคะแนนได้\u201D",
          "\u201C世界第1名城市和第10名之间只差1.8分（满分100） 一个新公园就能改变排名 一个监控摄像头就能改变分数\u201D")}</p>
      </div>

      {/* ═══ BLIND SPOTS DIAGRAM ═══ */}
      <section className="oped-blindspots section">
        <h2 className="oped-blindspots-title">{t(locale, "What they measure. What they miss.", "สิ่งที่วัด สิ่งที่พลาด", "衡量了什么 遗漏了什么")}</h2>
        <p className="oped-blindspots-sub">{t(locale, "Only SLIC measures all eight.", "มีแค่ SLIC ที่วัดครบทั้งแปด", "只有SLIC衡量了全部八项")}</p>
        <div className="oped-grid">
          <div className="oped-grid-header" />
          <div className="oped-grid-header">EIU</div>
          <div className="oped-grid-header">Mercer</div>
          <div className="oped-grid-header">Resonance</div>
          <div className="oped-grid-header">Monocle</div>
          <div className="oped-grid-header">Yonsei</div>
          <div className="oped-grid-header oped-grid-header--slic">SLIC</div>
          {BLIND_SPOT_ROWS.map((row) => (
            <React.Fragment key={row.label}>
              <div className="oped-grid-row-label">{row.label}</div>
              <div className={`oped-grid-cell ${row.eiu ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.eiu ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.mercer ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.mercer ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.resonance ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.resonance ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.monocle ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.monocle ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.yonsei ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.yonsei ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.slic ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.slic ? "\u2713" : "\u2717"}</div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Photo break */}
      <figure className="oped-photo-break">
        <img src="/photos/report-city-walkway.jpg" alt="People walking on elevated walkway" loading="lazy" />
        <figcaption>{t(locale, "What liveability actually looks like: eye-level, human scale, daily life.", "ความน่าอยู่จริงๆ หน้าตาเป็นยังไง: ระดับสายตา มาตราส่วนมนุษย์ ชีวิตประจำวัน", "宜居性到底是什么样子：视线高度 人的尺度 日常生活")}</figcaption>
      </figure>

      {/* ═══ DATA COVERAGE ACKNOWLEDGMENT ═══ */}
      <section className="oped-editorial section" style={{ borderBottom: `1px solid var(--border)` }}>
        <h2 className="oped-editorial-big">{t(locale,
          "What we don\u2019t cover yet.",
          "สิ่งที่เรายังไม่ครอบคลุม",
          "我们尚未覆盖的内容")}</h2>
        <p className="oped-editorial-body">{t(locale,
          "SLIC ranks 157 cities across 35 signals. That\u2019s not every city in the world. War zones \u2014 Syria, Yemen, Sudan, Myanmar \u2014 lack the reliable, verifiable data our methodology requires. Micro-states and cities under active conflict are on our watchlist, not quietly dropped. We\u2019d rather show you the gap than pretend it doesn\u2019t exist.",
          "SLIC จัดอันดับ 157 เมือง ใน 35 สัญญาณ นั่นไม่ใช่ทุกเมืองในโลก เขตสงคราม \u2014 ซีเรีย เยเมน ซูดาน เมียนมาร์ \u2014 ขาดข้อมูลที่เชื่อถือได้ตามระเบียบวิธีของเรา เราเลือกแสดงช่องว่างแทนที่จะเงียบๆ ตัดเมืองออก",
          "SLIC对157座城市进行排名 涵盖35个信号 这不是世界上所有的城市 战区 \u2014 叙利亚、也门、苏丹、缅甸 \u2014 缺乏我们方法论所需的可靠可验证数据 我们宁愿展示差距也不愿假装它不存在")}</p>
        <p className="oped-editorial-body">{t(locale,
          "Every city has a coverage grade \u2014 A, B, C, or Watchlist \u2014 published alongside its score. No hiding behind averages. V4 target: 350+ cities. Every new data point makes the index more honest, not more impressive.",
          "ทุกเมืองมีเกรดความครอบคลุม \u2014 A, B, C, หรือ Watchlist \u2014 เผยแพร่คู่กับคะแนน ไม่ซ่อนหลังค่าเฉลี่ย เป้าหมาย V4: 350+ เมือง ข้อมูลใหม่ทุกจุดทำให้ดัชนีซื่อสัตย์ขึ้น ไม่ใช่น่าประทับใจขึ้น",
          "每座城市都有覆盖等级 \u2014 A、B、C或观察名单 \u2014 与分数一起公布 不在平均值背后隐藏 V4目标：350+城市 每个新数据点让指数更诚实 而非更令人印象深刻")}</p>
      </section>

      {/* ═══ ACT 3: THE ANSWER ═══ */}
      <section className="oped-pillars section">
        <div>
          <h2 className="oped-blindspots-title">{t(locale, "So what does SLIC measure?", "แล้ว SLIC วัดอะไร?", "那SLIC衡量什么?")}</h2>
          <p className="oped-blindspots-sub" style={{ marginBottom: "2rem" }}>{t(locale, "Five pillars. One formula. Every number traceable.", "ห้าเสาหลัก สูตรเดียว ทุกตัวเลขสืบย้อนได้", "五大支柱 一个公式 每个数字都可追溯")}</p>
          {PILLAR_DATA.map((p) => (
            <div key={p.id} className="oped-pillar-item">
              <div className="oped-pillar-weight">{p.weight}</div>
              <div>
                <p className="oped-pillar-name">{p.name}</p>
                <p className="oped-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <figure className="oped-pillars-photo">
          <img src="/photos/report-people-workshop.jpg" alt="Workshop with city officials" loading="lazy" />
          <figcaption>{t(locale, "Testing the framework with city officials who actually run cities.", "ทดสอบกรอบแนวคิดกับเจ้าหน้าที่เมืองที่บริหารเมืองจริง", "与实际管理城市的官员一起测试框架")}</figcaption>
        </figure>
      </section>

      {/* ═══ THE SPIDER — CLIMAX ═══ */}
      <section className="oped-spider">
        <div className="section">
          <h2 className="v3-section-title">{t(locale, "Now disagree with us.", "ตอนนี้ลองไม่เห็นด้วยกับเรา", "现在来反驳我们")}</h2>
          <p className="v3-spider-hint">{t(locale, "Drag the spider. Crank growth to 100% \u2014 watch Singapore and Jakarta rise. Max viability \u2014 safe, clean cities float up. This is your ranking, not ours.", "ลากใยแมงมุม ปรับการเติบโตเป็น 100% \u2014 ดูสิงคโปร์และจาการ์ตาขึ้น ปรับความน่าอยู่สูงสุด \u2014 เมืองที่ปลอดภัยและสะอาดจะลอยขึ้น นี่คืออันดับของคุณ ไม่ใช่ของเรา", "拖动蛛网 把增长调到100% \u2014 看新加坡和雅加达上升 宜居性最大化 \u2014 安全干净的城市浮上来 这是你的排名 不是我们的")}</p>
          <div className="v3-spider-layout">
            <div className="v3-spider-chart">
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} />
              <button type="button" className="rankings-reset-btn" onClick={handleReset}>{t(locale, "Reset", "รีเซ็ต", "重置")}</button>
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

      {/* ═══ ACT 4: THE CITIES ═══ */}
      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">{t(locale, "The ten cities that scored highest. Click any to see exactly why.", "สิบเมืองที่ได้คะแนนสูงสุด คลิกเพื่อดูว่าทำไม", "得分最高的十座城市 点击查看具体原因")}</h2>
        </div>
        <div className="v3-alpha-grid section oped-cities-featured">
          {slicTop10.sort((a, b) => b.customScore - a.customScore).map((city) => {
            const photo = CITY_PHOTOS[city.cityId];
            return (
              <button key={city.cityId} className="v3-city-card v3-city-card--photo" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {photo && <img src={photo} alt={city.displayName} loading="lazy" className="v3-city-card-img" />}
                <div className="v3-city-card-overlay">
                  <span className="v3-city-card-score">{city.customScore.toFixed(1)}</span>
                  <span className="v3-city-card-name">{city.displayName}</span>
                  <span className="v3-city-card-country">{city.country}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ ACT 5: THE CLOSE ═══ */}
      <section className="oped-close">
        <img src="/launch-photos/20260318145941_DSC09480.jpg" alt="SCSE 2026 Taipei" className="oped-close-photo" loading="lazy" />
        <div className="oped-close-content section">
          <h2 className="oped-close-title">{t(locale,
            "Launched at SCSE 2026, Taipei.\n3,000 professionals.\nA European mayor\u2019s alliance asked to use it instead of The Economist\u2019s.",
            "เปิดตัวที่ SCSE 2026 ไทเป\nผู้เชี่ยวชาญ 3,000 คน\nพันธมิตรนายกเทศมนตรียุโรปขอใช้แทนดัชนี The Economist",
            "在SCSE 2026台北发布\n3000位专业人士\n欧洲市长联盟要求用它取代经济学人指数")}</h2>
          <p className="oped-close-body">{t(locale,
            "Free. Public. Transparent. We show our watchlist. We show our coverage grades. We show every data source. War zones and cities with no reliable data are on our watchlist \u2014 not quietly dropped. No paywall. No proprietary black box. No 12-month lobby cycle.",
            "ฟรี เปิดเผย โปร่งใส เราแสดง watchlist แสดงเกรดความครอบคลุม แสดงแหล่งข้อมูลทุกจุด เขตสงครามและเมืองที่ไม่มีข้อมูลอยู่ใน watchlist ไม่ใช่ถูกตัดออกอย่างเงียบๆ",
            "免费 公开 透明 我们展示观察名单 展示覆盖等级 展示每个数据来源 战区和没有可靠数据的城市在我们的观察名单上 而非被悄悄丢弃")}</p>
          <div className="oped-close-cta">
            <a className="v3-cta" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
              {t(locale, "READ THE METHODOLOGY", "อ่านระเบียบวิธี", "阅读方法论")} &rarr;
            </a>
            <a className="v3-cta-secondary" href="/compare" onClick={(e) => { e.preventDefault(); onNavigate("/compare"); }}>
              {t(locale, "EXPLORE CITIES", "สำรวจเมือง", "探索城市")}
            </a>
            <a className="v3-cta-secondary" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}>
              {t(locale, "FULL RANKING", "อันดับเต็ม", "完整排名")}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
