import { useMemo, useState } from "react";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import { thailandProvinces, thailandRegions } from "./thailandData";
import type { Locale, SitePath } from "./types";

type ScorePillar = "overall" | "safety" | "economy" | "health" | "education" | "environment" | "infrastructure" | "culture";

const pillarLabels: Record<Locale, Record<ScorePillar, string>> = {
  en: {
    overall: "Overall",
    safety: "Safety",
    economy: "Economy",
    health: "Health",
    education: "Education",
    environment: "Environment",
    infrastructure: "Infrastructure",
    culture: "Culture",
  },
  th: {
    overall: "ภาพรวม",
    safety: "ความปลอดภัย",
    economy: "เศรษฐกิจ",
    health: "สุขภาพ",
    education: "การศึกษา",
    environment: "สิ่งแวดล้อม",
    infrastructure: "โครงสร้างพื้นฐาน",
    culture: "วัฒนธรรม",
  },
  zh: {
    overall: "总分",
    safety: "安全",
    economy: "经济",
    health: "健康",
    education: "教育",
    environment: "环境",
    infrastructure: "基础设施",
    culture: "文化",
  },
};

const thailandUiCopy: Record<
  Locale,
  {
    scope: string;
    ranked: string;
    all: string;
    region: string;
    allRegions: string;
    sortBy: string;
    topProvinces: string;
    leadingOn: string;
    topSummary: string;
    fullTable: string;
    remaining: string;
    rank: string;
    rankLabel: string;
    province: string;
    regionColumn: string;
    gppPerCapita: string;
    avgIncome: string;
    perMonth: string;
    pm25: string;
    beds: string;
    crime: string;
    green: string;
    provisional: string;
    infraShort: string;
    patternsEyebrow: string;
    patternsTitle: string;
    patternsSummary: string;
    centralLabel: string;
    centralTitle: string;
    centralBody: string;
    northLabel: string;
    northTitle: string;
    northBody: string;
    isanLabel: string;
    isanTitle: string;
    isanBody: string;
    southEastLabel: string;
    southEastTitle: string;
    southEastBody: string;
  }
> = {
  en: {
    scope: "Scope",
    ranked: "Ranked",
    all: "All provinces",
    region: "Region",
    allRegions: "All",
    sortBy: "Sort by pillar",
    topProvinces: "Top provinces",
    leadingOn: "Leading on",
    topSummary: "Cards show score breakdowns across all pillars with key provincial metrics.",
    fullTable: "Full table",
    remaining: "Remaining provinces",
    rank: "Rank",
    rankLabel: "Rank",
    province: "Province",
    regionColumn: "Region",
    gppPerCapita: "GPP / capita",
    avgIncome: "Avg income",
    perMonth: "/mo",
    pm25: "PM2.5",
    beds: "Beds/10k",
    crime: "Crime",
    green: "Green %",
    provisional: "provisional",
    infraShort: "Infra",
    patternsEyebrow: "Regional patterns",
    patternsTitle: "What the provincial data reveals",
    patternsSummary:
      "Thailand's internal SLIC landscape shows sharp tradeoffs between economic output and environmental quality, and between infrastructure scale and cultural depth.",
    centralLabel: "Central",
    centralTitle: "Economic gravity, environmental cost",
    centralBody:
      "Bangkok and its satellites dominate on economy and infrastructure, but PM2.5 levels, congestion, and housing pressure make daily life harder than the numbers suggest. Nonthaburi and Pathum Thani benefit from proximity but inherit the same air-quality burden.",
    northLabel: "North",
    northTitle: "Cultural richness, seasonal strain",
    northBody:
      "Chiang Mai and Chiang Rai score highest on culture but carry the worst PM2.5 readings nationally due to seasonal agricultural burning. Air quality is the region's most visible weakness and most urgent policy target.",
    isanLabel: "Northeast (Isan)",
    isanTitle: "Human warmth, economic gaps",
    isanBody:
      "Isan provinces score well on safety and cultural vitality but face the lowest economic indicators. University hospital hubs like Khon Kaen show what targeted investment can do for health and education scores.",
    southEastLabel: "South & East",
    southEastTitle: "Best air, uneven depth",
    southEastBody:
      "Coastal provinces like Krabi and Phuket have Thailand's cleanest air and strongest tourism economies, but health infrastructure and education access remain thinner. The Eastern Seaboard (Chonburi, Rayong) shows industrial economic strength.",
  },
  th: {
    scope: "ขอบเขต",
    ranked: "จังหวัดที่จัดอันดับ",
    all: "ทุกจังหวัด",
    region: "ภูมิภาค",
    allRegions: "ทั้งหมด",
    sortBy: "เรียงตามเสาหลัก",
    topProvinces: "จังหวัดเด่น",
    leadingOn: "นำในด้าน",
    topSummary: "การ์ดแสดงคะแนนรายเสาหลักพร้อมตัวชี้วัดสำคัญของแต่ละจังหวัด",
    fullTable: "ตารางเต็ม",
    remaining: "จังหวัดที่เหลือ",
    rank: "อันดับ",
    rankLabel: "อันดับ",
    province: "จังหวัด",
    regionColumn: "ภูมิภาค",
    gppPerCapita: "GPP / คน",
    avgIncome: "รายได้เฉลี่ย",
    perMonth: "/เดือน",
    pm25: "PM2.5",
    beds: "เตียง/หมื่นคน",
    crime: "อาชญากรรม",
    green: "พื้นที่สีเขียว %",
    provisional: "ชั่วคราว",
    infraShort: "โครงสร้าง",
    patternsEyebrow: "รูปแบบเชิงภูมิภาค",
    patternsTitle: "สิ่งที่ข้อมูลระดับจังหวัดกำลังบอกเรา",
    patternsSummary:
      "ภูมิทัศน์ SLIC ภายในประเทศไทยเผยให้เห็นการแลกเปลี่ยนที่คมชัดระหว่างผลผลิตทางเศรษฐกิจกับคุณภาพสิ่งแวดล้อม และระหว่างขนาดโครงสร้างพื้นฐานกับความลึกทางวัฒนธรรม",
    centralLabel: "ภาคกลาง",
    centralTitle: "แรงโน้มเศรษฐกิจ กับต้นทุนสิ่งแวดล้อม",
    centralBody:
      "กรุงเทพฯ และจังหวัดปริมณฑลโดดเด่นด้านเศรษฐกิจและโครงสร้างพื้นฐาน แต่ PM2.5 การจราจร และแรงกดดันด้านที่อยู่อาศัยทำให้ชีวิตจริงยากกว่าที่ตัวเลขบอก นนทบุรีและปทุมธานีได้ประโยชน์จากความใกล้เมืองหลวง แต่ก็รับภาระอากาศแบบเดียวกัน",
    northLabel: "ภาคเหนือ",
    northTitle: "วัฒนธรรมเข้มข้น แต่เผชิญแรงกดดันตามฤดูกาล",
    northBody:
      "เชียงใหม่และเชียงรายได้คะแนนวัฒนธรรมสูง แต่มีค่า PM2.5 หนักที่สุดจากการเผาทางการเกษตรตามฤดูกาล คุณภาพอากาศจึงเป็นจุดอ่อนที่ชัดที่สุดและเป็นเป้าหมายนโยบายเร่งด่วนของภูมิภาค",
    isanLabel: "ภาคตะวันออกเฉียงเหนือ",
    isanTitle: "ความอบอุ่นของผู้คน กับช่องว่างทางเศรษฐกิจ",
    isanBody:
      "จังหวัดอีสานทำได้ดีด้านความปลอดภัยและพลังวัฒนธรรม แต่ยังเผชิญตัวชี้วัดเศรษฐกิจที่ต่ำกว่า พื้นที่อย่างขอนแก่นแสดงให้เห็นว่าการลงทุนแบบเจาะจงสามารถดันคะแนนสุขภาพและการศึกษาได้มากเพียงใด",
    southEastLabel: "ภาคใต้และภาคตะวันออก",
    southEastTitle: "อากาศดีที่สุด แต่ความลึกยังไม่เท่ากัน",
    southEastBody:
      "จังหวัดชายฝั่งอย่างกระบี่และภูเก็ตมีอากาศดีที่สุดและเศรษฐกิจท่องเที่ยวแข็งแรง แต่โครงสร้างสุขภาพและการเข้าถึงการศึกษายังบางกว่า ขณะที่ชลบุรีและระยองแสดงพลังเศรษฐกิจอุตสาหกรรมอย่างชัดเจน",
  },
  zh: {
    scope: "范围",
    ranked: "正式排序",
    all: "全部府省",
    region: "地区",
    allRegions: "全部",
    sortBy: "按支柱排序",
    topProvinces: "领先府省",
    leadingOn: "该支柱领先",
    topSummary: "卡片展示各支柱分数结构以及关键省级指标。",
    fullTable: "完整表格",
    remaining: "其余府省",
    rank: "排名",
    rankLabel: "排名",
    province: "府省",
    regionColumn: "地区",
    gppPerCapita: "人均 GPP",
    avgIncome: "平均收入",
    perMonth: "/月",
    pm25: "PM2.5",
    beds: "每万人床位",
    crime: "犯罪",
    green: "绿化 %",
    provisional: "暂列",
    infraShort: "基础设施",
    patternsEyebrow: "区域格局",
    patternsTitle: "省级数据真正揭示了什么",
    patternsSummary:
      "泰国内部的 SLIC 地图清楚显示了经济产出与环境质量之间、基础设施规模与文化厚度之间的现实权衡。",
    centralLabel: "中部",
    centralTitle: "经济引力与环境代价",
    centralBody:
      "曼谷及其卫星府在经济和基础设施上占优，但 PM2.5、拥堵与住房压力让日常生活比数字显示得更艰难。暖武里与巴吞他尼受益于邻近首都，同时也承受同样的空气质量负担。",
    northLabel: "北部",
    northTitle: "文化丰度与季节性压力",
    northBody:
      "清迈与清莱在文化上得分很高，但因季节性农业焚烧而承受全国最差的 PM2.5。空气质量是该区域最可见也最紧迫的政策短板。",
    isanLabel: "东北（Isan）",
    isanTitle: "人情温度与经济缺口",
    isanBody:
      "伊桑诸府在安全与文化活力上表现不错，但经济指标仍偏弱。像孔敬这样的大学医疗中心说明，定向投资能够明显抬升健康与教育得分。",
    southEastLabel: "南部与东部",
    southEastTitle: "空气最佳，但深度不均",
    southEastBody:
      "甲米和普吉等沿海府拥有泰国最干净的空气和强劲的旅游经济，但医疗基础和教育可及性仍较薄。东部海岸带的春武里和罗勇则显示出工业经济实力。",
  },
};

function formatBaht(value: number): string {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 65) return "var(--accent-cyan)";
  if (score >= 50) return "var(--accent-amber)";
  return "var(--accent-red)";
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="th-score-bar">
      <div className="th-score-bar-header">
        <span>{label}</span>
        <strong style={{ color: scoreColor(score) }}>{score}</strong>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${score}%`, background: scoreColor(score) }} />
      </div>
    </div>
  );
}

export default function ThailandPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const ui = thailandUiCopy[locale];
  const [pillar, setPillar] = useState<ScorePillar>("overall");
  const [region, setRegion] = useState<string>("All");
  const [scope, setScope] = useState<"ranked" | "all">("all");

  const filtered = useMemo(() => {
    let rows = scope === "ranked"
      ? thailandProvinces.filter((p) => p.status === "ranked")
      : [...thailandProvinces];
    if (region !== "All") {
      rows = rows.filter((p) => p.region === region);
    }
    return rows.sort((a, b) => b.scores[pillar] - a.scores[pillar]);
  }, [pillar, region, scope]);

  const topCards = filtered.slice(0, 5);
  const tableRows = filtered.slice(5);

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{copy.thailand.eyebrow}</p>
            <h1 className="rankings-title">{copy.thailand.title}</h1>
            <p className="hero-intro">{copy.thailand.intro}</p>
            <p className="rankings-filter-note">{copy.thailand.note}</p>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <div>
                <p className="panel-label">{ui.scope}</p>
                <div className="region-switch" role="tablist">
                  <button type="button" className={scope === "ranked" ? "region-button active" : "region-button"} onClick={() => setScope("ranked")}>{ui.ranked}</button>
                  <button type="button" className={scope === "all" ? "region-button active" : "region-button"} onClick={() => setScope("all")}>{ui.all}</button>
                </div>
              </div>

              <p className="panel-label">{ui.region}</p>
              <div className="region-switch" role="tablist">
                <button type="button" className={region === "All" ? "region-button active" : "region-button"} onClick={() => setRegion("All")}>{ui.allRegions}</button>
                {thailandRegions.map((r) => (
                  <button key={r} type="button" className={region === r ? "region-button active" : "region-button"} onClick={() => setRegion(r)}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.sortBy}</p>
              <div className="mode-switch" role="tablist">
                {(Object.keys(pillarLabels[locale]) as ScorePillar[]).map((p) => (
                  <button key={p} type="button" className={p === pillar ? "mode-button active" : "mode-button"} onClick={() => setPillar(p)}>{pillarLabels[locale][p]}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.topProvinces}</p>
              <h2>{ui.leadingOn} {pillarLabels[locale][pillar].toLowerCase()}</h2>
            </div>
            <p className="section-summary">{ui.topSummary}</p>
          </div>

          <div className="ranking-card-grid">
            {topCards.map((province, index) => (
              <article className="ranking-detail-card" key={province.id}>
                <div className="ranking-detail-head">
                  <div>
                    <p className="panel-label">{ui.rankLabel} {String(index + 1).padStart(2, "0")}</p>
                    <h3>{province.nameEn}</h3>
                    <p className="city-location">{province.nameTh} / {province.region}</p>
                  </div>
                  <div className="detail-score">
                    <strong style={{ color: scoreColor(province.scores[pillar]) }}>{province.scores[pillar]}</strong>
                    <span>{pillarLabels[locale][pillar]}</span>
                  </div>
                </div>

                <p className="city-tagline">{province.tagline}</p>

                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <ScoreBar score={province.scores.safety} label={pillarLabels[locale].safety} />
                  <ScoreBar score={province.scores.economy} label={pillarLabels[locale].economy} />
                  <ScoreBar score={province.scores.health} label={pillarLabels[locale].health} />
                  <ScoreBar score={province.scores.education} label={pillarLabels[locale].education} />
                  <ScoreBar score={province.scores.environment} label={pillarLabels[locale].environment} />
                  <ScoreBar score={province.scores.infrastructure} label={ui.infraShort} />
                  <ScoreBar score={province.scores.culture} label={pillarLabels[locale].culture} />
                </div>

                <div className="detail-metric-grid">
                  <div>
                    <span>{ui.gppPerCapita}</span>
                    <strong>฿{formatBaht(province.metrics.gppPerCapita)}</strong>
                  </div>
                  <div>
                    <span>{ui.avgIncome}</span>
                    <strong>฿{formatBaht(province.metrics.avgMonthlyIncome)}{ui.perMonth}</strong>
                  </div>
                  <div>
                    <span>{ui.pm25}</span>
                    <strong style={{ color: province.metrics.pm25Annual > 35 ? "var(--accent-red)" : province.metrics.pm25Annual > 25 ? "var(--accent-amber)" : "var(--accent-green)" }}>
                      {province.metrics.pm25Annual} µg/m³
                    </strong>
                  </div>
                </div>

                <div className="metric-taglist">
                  {province.highlights.map((h) => (<span key={h}>{h}</span>))}
                  {province.status === "provisional" && <span>{ui.provisional}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {tableRows.length > 0 && (
          <section className="rankings-table-section section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{ui.fullTable}</p>
                <h2>{ui.remaining}</h2>
              </div>
            </div>

            <div className="sheet-table-shell">
              <table className="sheet-table ranking-table">
                <thead>
                  <tr>
                    <th>{ui.rank}</th>
                    <th>{ui.province}</th>
                    <th>{ui.regionColumn}</th>
                    <th>{pillarLabels[locale][pillar]}</th>
                    <th>{ui.gppPerCapita}</th>
                    <th>{ui.pm25}</th>
                    <th>{ui.beds}</th>
                    <th>{ui.crime}</th>
                    <th>{ui.green}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((province, index) => (
                    <tr key={province.id}>
                      <td>{index + 6}</td>
                      <td><strong>{province.nameEn}</strong><br /><small style={{ color: "var(--text-soft)" }}>{province.nameTh}</small></td>
                      <td>{province.region}</td>
                      <td style={{ color: scoreColor(province.scores[pillar]) }}><strong>{province.scores[pillar]}</strong></td>
                      <td>฿{formatBaht(province.metrics.gppPerCapita)}</td>
                      <td style={{ color: province.metrics.pm25Annual > 35 ? "var(--accent-red)" : "inherit" }}>{province.metrics.pm25Annual}</td>
                      <td>{province.metrics.hospitalBeds}</td>
                      <td>{province.metrics.crimeRate}</td>
                      <td>{province.metrics.greenCoverage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.patternsEyebrow}</p>
              <h2>{ui.patternsTitle}</h2>
            </div>
            <p className="section-summary">{ui.patternsSummary}</p>
          </div>

          <div className="critique-grid">
            <article className="paper-card">
              <p className="panel-label">{ui.centralLabel}</p>
              <h3>{ui.centralTitle}</h3>
              <p>{ui.centralBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.northLabel}</p>
              <h3>{ui.northTitle}</h3>
              <p>{ui.northBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.isanLabel}</p>
              <h3>{ui.isanTitle}</h3>
              <p>{ui.isanBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.southEastLabel}</p>
              <h3>{ui.southEastTitle}</h3>
              <p>{ui.southEastBody}</p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
