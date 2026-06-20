import { useMemo, useState } from "react";
import { getCopy } from "./siteCopy";
import { t } from "./i18n";
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
  ko: {
    overall: "종합",
    safety: "안전",
    economy: "경제",
    health: "보건",
    education: "교육",
    environment: "환경",
    infrastructure: "인프라",
    culture: "문화",
  },
  ja: {
    overall: "総合",
    safety: "安全",
    economy: "経済",
    health: "健康",
    education: "教育",
    environment: "環境",
    infrastructure: "インフラ",
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
  ko: {
    scope: "범위",
    ranked: "순위 지정",
    all: "전체 주",
    region: "지역",
    allRegions: "전체",
    sortBy: "기둥별 정렬",
    topProvinces: "상위 주",
    leadingOn: "선두 분야",
    topSummary: "카드는 모든 기둥의 점수 구성과 주요 주별 지표를 보여줍니다.",
    fullTable: "전체 표",
    remaining: "나머지 주",
    rank: "순위",
    rankLabel: "순위",
    province: "주",
    regionColumn: "지역",
    gppPerCapita: "1인당 GPP",
    avgIncome: "평균 소득",
    perMonth: "/월",
    pm25: "PM2.5",
    beds: "병상/만명",
    crime: "범죄율",
    green: "녹지 %",
    provisional: "잠정치",
    infraShort: "인프라",
    patternsEyebrow: "지역 패턴",
    patternsTitle: "주별 데이터가 드러내는 것",
    patternsSummary:
      "태국 내부의 SLIC 지형은 경제 산출과 환경 품질, 그리고 인프라 규모와 문화적 깊이 사이의 극명한 상충관계를 보여줍니다.",
    centralLabel: "중부",
    centralTitle: "경제 중심지, 환경 비용",
    centralBody:
      "방콕과 위성 도시들은 경제와 인프라에서 탁월하지만 PM2.5, 교통 혼잡, 주거 압박으로 실제 생활은 수치보다 더 힘듭니다. 논타부리와 파툼타니는 수도 인접의 이점을 누리지만 같은 대기질 부담을 안고 있습니다.",
    northLabel: "북부",
    northTitle: "문화적 풍요, 계절적 부담",
    northBody:
      "치앙마이와 치앙라이는 문화 점수가 가장 높지만 계절적 농업 소각으로 전국 최악의 PM2.5를 기록합니다. 대기질은 이 지역의 가장 뚜렷한 약점이자 가장 시급한 정책 과제입니다.",
    isanLabel: "북동부 (이산)",
    isanTitle: "사람의 온기, 경제적 격차",
    isanBody:
      "이산 주들은 안전과 문화 활력에서 좋은 점수를 보이지만 경제 지표는 최하위를 유지합니다. 콘깬 같은 대학병원 거점은 집중 투자가 보건 및 교육 점수에 어떤 영향을 미칠 수 있는지 보여줍니다.",
    southEastLabel: "남부 및 동부",
    southEastTitle: "최고의 공기질, 고르지 않은 깊이",
    southEastBody:
      "끄라비와 푸껫 같은 해안 주들은 태국에서 가장 깨끗한 공기와 강한 관광 경제를 자랑하지만 의료 인프라와 교육 접근성은 여전히 부족합니다. 동부 해안 지대인 촌부리와 라용은 산업 경제의 강점을 보여줍니다.",
  },
  ja: {
    scope: "対象範囲",
    ranked: "順位付き",
    all: "全府",
    region: "地域",
    allRegions: "すべて",
    sortBy: "柱で並べ替え",
    topProvinces: "上位府",
    leadingOn: "リード分野",
    topSummary: "カードは全柱のスコア構成と主要な府別指標を表示します。",
    fullTable: "全表",
    remaining: "残りの府",
    rank: "順位",
    rankLabel: "順位",
    province: "府",
    regionColumn: "地域",
    gppPerCapita: "一人当たりGPP",
    avgIncome: "平均所得",
    perMonth: "/月",
    pm25: "PM2.5",
    beds: "病床/万人",
    crime: "犯罪率",
    green: "緑地 %",
    provisional: "暫定値",
    infraShort: "インフラ",
    patternsEyebrow: "地域パターン",
    patternsTitle: "府別データが明らかにすること",
    patternsSummary:
      "タイ国内のSLIC地図は、経済産出と環境品質の間、そしてインフラ規模と文化的深みの間にある明確なトレードオフを示しています。",
    centralLabel: "中部",
    centralTitle: "経済の重力と環境コスト",
    centralBody:
      "バンコクと衛星都市は経済とインフラで優位に立つが、PM2.5・渋滞・住宅圧力により実際の生活は数字が示すより困難です。ノンタブリーとパトゥムタニーは首都近隣の恩恵を受けつつ、同じ大気質の負担を抱えています。",
    northLabel: "北部",
    northTitle: "文化的豊かさと季節的負担",
    northBody:
      "チェンマイとチェンライは文化スコアが最も高いが、季節的な農業焼却により全国最悪のPM2.5を記録します。大気質はこの地域で最も顕著な弱点であり、最も緊急な政策課題です。",
    isanLabel: "東北部（イサーン）",
    isanTitle: "人の温かさと経済格差",
    isanBody:
      "イサーンの府は安全と文化活力では好成績を収めるが、経済指標では依然として最下位です。コンケンのような大学病院拠点は、集中投資が保健・教育スコアにどれほど貢献できるかを示しています。",
    southEastLabel: "南部・東部",
    southEastTitle: "最高の空気質、不均一な深み",
    southEastBody:
      "クラビやプーケットなどの沿岸府はタイで最もきれいな空気と強い観光経済を持つが、医療インフラと教育アクセスは薄いままです。東部臨海地帯のチョンブリーとラヨーンは工業経済の強みを示しています。",
  },
};

function formatBaht(value: number): string {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent-cyan)";   // excellent
  if (score >= 65) return "var(--accent-blue)";   // good
  if (score >= 50) return "var(--accent-amber)";  // moderate
  return "var(--accent-red)";                     // poor
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
                <div className="region-switch" role="group" aria-label={t(locale, "Board scope", "ขอบเขตกระดาน", "面板范围", "보드 범위", "ボード範囲")}>
                  <button type="button" className={scope === "ranked" ? "region-button active" : "region-button"} onClick={() => setScope("ranked")}>{ui.ranked}</button>
                  <button type="button" className={scope === "all" ? "region-button active" : "region-button"} onClick={() => setScope("all")}>{ui.all}</button>
                </div>
              </div>

              <p className="panel-label">{ui.region}</p>
              <div className="region-switch" role="group" aria-label={t(locale, "Region filter", "กรองตามภูมิภาค", "地区筛选", "지역 필터", "地域フィルター")}>
                <button type="button" className={region === "All" ? "region-button active" : "region-button"} onClick={() => setRegion("All")}>{ui.allRegions}</button>
                {thailandRegions.map((r) => (
                  <button key={r} type="button" className={region === r ? "region-button active" : "region-button"} onClick={() => setRegion(r)}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.sortBy}</p>
              <div className="mode-switch" role="group" aria-label={t(locale, "Pillar filter", "กรองตามเสาหลัก", "支柱筛选", "기둥 필터", "柱フィルター")}>
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

                <p className="city-tagline">{province.tagline[locale]}</p>

                {province.mayor && (
                  <p className="city-mayor" style={{ fontSize: "0.78rem", color: "#6b6459", margin: "0 0 0.6rem" }}>
                    {locale === "th" ? "ผู้ว่าฯ" : locale === "zh" ? "市长" : locale === "ko" ? "지사" : locale === "ja" ? "知事" : "Mayor"}{" "}
                    <strong>{locale === "th" && province.mayorTh ? province.mayorTh : province.mayor}</strong>
                  </p>
                )}

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
                    <strong style={{ color: province.metrics.pm25Annual > 35 ? "var(--accent-red)" : province.metrics.pm25Annual > 25 ? "var(--accent-amber)" : "var(--accent-cyan)" }}>
                      {province.metrics.pm25Annual} µg/m³
                    </strong>
                  </div>
                </div>

                <div className="metric-taglist">
                  {province.highlights.map((h, highlightIndex) => (
                    <span key={`${province.id}-${highlightIndex}-${h.en}`}>{h[locale]}</span>
                  ))}
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

        {/* ASEAN capital gravity cluster */}
        <section className="th-asean-cluster section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Capital gravity", "แรงดึงดูดทุน", "资本引力", "자본 중력", "資本重力")}</p>
              <h2>{t(locale, "Bangkok in the ASEAN billionaire cluster", "กรุงเทพฯ ในกลุ่มมหาเศรษฐีอาเซียน", "曼谷在东盟亿万富翁集群中的位置", "ASEAN 억만장자 클러스터에서의 방콕", "ASEANの億万長者クラスターにおけるバンコク")}</h2>
            </div>
            <p className="section-summary">
              {t(locale,
                "Bangkok ranks 17th globally for billionaire concentration with 38 billionaires — ahead of Seoul, Tokyo, and most of Europe. Among the ASEAN-adjacent cities that compete for regional capital, it sits in a distinct position: more economic gravity than its SLIC rank alone would suggest.",
                "กรุงเทพฯ อยู่อันดับที่ 17 ของโลกในด้านการกระจุกตัวของมหาเศรษฐีด้วยจำนวน 38 คน — นำหน้าโซล โตเกียว และยุโรปส่วนใหญ่ ในกลุ่มเมืองใกล้เคียงอาเซียนที่แข่งขันเพื่อดึงดูดทุนในภูมิภาค กรุงเทพฯ อยู่ในตำแหน่งที่โดดเด่น",
                "曼谷以38位亿万富翁在全球亿万富翁集中度排名第17位——领先于首尔、东京和欧洲大部分地区。在争夺区域资本的东盟邻近城市中，它处于独特地位：经济引力远超其SLIC排名所呈现的。",
                "방콕은 38명의 억만장자를 보유하여 글로벌 억만장자 집중도 17위를 기록합니다 — 서울, 도쿄, 유럽 대부분을 앞섭니다.",
                "バンコクは38人の億万長者を擁し、世界的な億万長者集積度で17位にランクインしています — ソウル、東京、そしてヨーロッパの大部分を上回っています。"
              )}
            </p>
          </div>
          <div className="th-asean-table-wrap">
            <table className="th-asean-table">
              <thead>
                <tr>
                  <th>{t(locale, "City", "เมือง", "城市", "도시", "都市")}</th>
                  <th>{t(locale, "Billionaire rank", "อันดับมหาเศรษฐี", "富豪排名", "억만장자 순위", "富豪ランク")}</th>
                  <th>{t(locale, "Billionaires", "มหาเศรษฐี", "亿万富翁", "억만장자", "億万長者")}</th>
                  <th>{t(locale, "SLIC rank", "อันดับ SLIC", "SLIC排名", "SLIC 순위", "SLICランク")}</th>
                  <th>{t(locale, "SLIC score", "คะแนน SLIC", "SLIC得分", "SLIC 점수", "SLICスコア")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="th-asean-highlight">
                  <td><strong>Bangkok</strong></td>
                  <td>#17</td><td>38</td><td>#66</td><td>53.7</td>
                </tr>
                <tr>
                  <td>Singapore</td>
                  <td>#12</td><td>51</td><td>#34</td><td>62.8</td>
                </tr>
                <tr>
                  <td>Shanghai</td>
                  <td>#3</td><td>120</td><td>#107</td><td>42.3</td>
                </tr>
                <tr>
                  <td>Hong Kong</td>
                  <td>#7</td><td>88</td><td style={{ color: "var(--text-muted)", fontStyle: "italic" }} colSpan={2}>
                    {t(locale, "not in SLIC dataset", "ไม่อยู่ในชุดข้อมูล SLIC", "不在SLIC数据集中", "SLIC 데이터셋 미포함", "SLICデータセット未収録")}
                  </td>
                </tr>
                <tr>
                  <td>Mumbai</td>
                  <td>#6</td><td>90</td><td style={{ color: "var(--text-muted)", fontStyle: "italic" }} colSpan={2}>
                    {t(locale, "not in SLIC dataset", "ไม่อยู่ในชุดข้อมูล SLIC", "不在SLIC数据集中", "SLIC 데이터셋 미포함", "SLICデータセット未収录")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="th-asean-note">
            {t(locale,
              "Source: Visual Capitalist / Voronoi 2026 Forbes Billionaires data. Hong Kong and Mumbai are not yet in the SLIC dataset — candidates for v4 expansion.",
              "ที่มา: Visual Capitalist / Voronoi ข้อมูลมหาเศรษฐีฟอร์บส 2026 ฮ่องกงและมุมไบยังไม่อยู่ในชุดข้อมูล SLIC — ผู้สมัครสำหรับการขยายตัวใน v4",
              "来源：Visual Capitalist / Voronoi 2026年福布斯亿万富翁数据。香港和孟买尚未纳入SLIC数据集——是v4扩展的候选城市。",
              "출처: Visual Capitalist / Voronoi 2026 포브스 억만장자 데이터. 홍콩과 뭄바이는 아직 SLIC 데이터셋에 없습니다 — v4 확장 후보.",
              "出典：Visual Capitalist / Voronoi 2026年フォーブス億万長者データ。香港とムンバイはまだSLICデータセットに含まれていません — v4拡張の候補。"
            )}
          </p>
        </section>

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
