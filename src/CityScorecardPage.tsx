import publishedData from "./data/publishedRankingData.json";
import { getCityEditorialEntry } from "./cityEditorial";
import { getExerciseCities } from "./rankingsData";
import { appHref, stripBase } from "./routing";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ── Types from enriched JSON ── */

interface MetricDetail {
  raw: number | null;
  score: number | null;
  source: string;
  sourceUrl: string;
  dataLevel: "city" | "national" | "derived" | "composite" | "missing";
  components?: Array<{
    key: string;
    weight: number;
    raw: number | null;
    score: number | null;
    source: string;
    sourceUrl: string;
    dataLevel: string;
  }>;
}

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  publicationStatus?: "published" | "exercise";
  cityType?: string;
  manifestStatus?: string;
  coverageGrade: string;
  overallWeightedCoverage: number | null;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
  metrics: Record<string, MetricDetail>;
  highlights: { strongest: string | null; weakest: string | null };
  pressureCoverage: number | null;
  viabilityCoverage: number | null;
  capabilityCoverage: number | null;
  communityCoverage: number | null;
  creativeCoverage: number | null;
}

interface NormStat {
  p05: number | null;
  p95: number | null;
  dir: "positive" | "negative";
}

interface PillarMetricEntry {
  key: string;
  weight: number;
}

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};

const PILLAR_LABELS: Record<string, Record<PillarId, string>> = {
  en: { pressure: "Growth Pressure", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "แรงกดดันการเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长压力", viability: "宜居性", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_WEIGHTS: Record<PillarId, number> = {
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const METRIC_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    pressure_disposable_income_ppp: "Disposable Income (PPP)",
    pressure_housing_burden: "Housing Burden",
    pressure_economic_growth_momentum: "Economic Growth Momentum",
    pressure_household_debt_burden: "Household Debt",
    pressure_working_time_pressure: "Working Hours",
    pressure_suicide_mental_strain: "Mental Strain",
    viability_personal_safety: "Personal Safety",
    viability_transit_access_commute: "Transit Access",
    viability_clean_air: "Air Quality",
    viability_water_sanitation_utility: "Water & Sanitation",
    viability_digital_infrastructure: "Digital Infrastructure",
    viability_climate_sunlight_livability: "Climate & Sunlight",
    capability_healthcare_quality: "Healthcare Quality",
    capability_education_quality: "Education Quality",
    capability_equal_opportunity_distributional_fairness: "Equal Opportunity",
    community_hospitality_belonging: "Hospitality & Belonging",
    community_tolerance_pluralism: "Tolerance & Pluralism",
    community_cultural_historic_public_life_vitality: "Cultural Life",
    community_birth_rate_optimism: "Birth Rate Optimism",
    creative_entrepreneurial_dynamism: "Entrepreneurial Dynamism",
    creative_innovation_research_intensity: "Innovation & R&D",
    creative_economic_vitality_productive_context: "Economic Vitality",
    creative_administrative_investment_friction: "Administrative Friction",
    equal_opportunity_raw: "Equal Opportunity",
    gdp_growth_context: "GDP Growth Context",
    gdp_per_capita_ppp_context: "GDP per Capita (PPP)",
    gini_coefficient_context: "Gini Coefficient",
    investment_signal_raw: "Investment Signal",
  },
  th: {
    pressure_disposable_income_ppp: "รายได้ใช้สอยคงเหลือ (PPP)",
    pressure_housing_burden: "ภาระค่าที่อยู่อาศัย",
    pressure_economic_growth_momentum: "โมเมนตัมการเติบโตทางเศรษฐกิจ",
    pressure_household_debt_burden: "ภาระหนี้ครัวเรือน",
    pressure_working_time_pressure: "ชั่วโมงทำงาน",
    pressure_suicide_mental_strain: "ความตึงเครียดทางจิตใจ",
    viability_personal_safety: "ความปลอดภัยส่วนบุคคล",
    viability_transit_access_commute: "การเข้าถึงขนส่ง",
    viability_clean_air: "คุณภาพอากาศ",
    viability_water_sanitation_utility: "น้ำและสุขาภิบาล",
    viability_digital_infrastructure: "โครงสร้างพื้นฐานดิจิทัล",
    viability_climate_sunlight_livability: "ภูมิอากาศและแสงแดด",
    capability_healthcare_quality: "คุณภาพระบบสุขภาพ",
    capability_education_quality: "คุณภาพการศึกษา",
    capability_equal_opportunity_distributional_fairness: "โอกาสที่เท่าเทียม",
    community_hospitality_belonging: "การต้อนรับและความเป็นส่วนหนึ่ง",
    community_tolerance_pluralism: "ความอดทนและพหุนิยม",
    community_cultural_historic_public_life_vitality: "ชีวิตวัฒนธรรม",
    community_birth_rate_optimism: "ความเชื่อมั่นต่ออนาคต",
    creative_entrepreneurial_dynamism: "พลวัตผู้ประกอบการ",
    creative_innovation_research_intensity: "นวัตกรรมและวิจัย",
    creative_economic_vitality_productive_context: "พลังเศรษฐกิจ",
    creative_administrative_investment_friction: "แรงเสียดทานทางธุรการ",
    equal_opportunity_raw: "โอกาสที่เท่าเทียม",
    gdp_growth_context: "บริบทการเติบโต GDP",
    gdp_per_capita_ppp_context: "GDP ต่อหัว (PPP)",
    gini_coefficient_context: "ค่าสัมประสิทธิ์จินี",
    investment_signal_raw: "สัญญาณการลงทุน",
  },
  zh: {
    pressure_disposable_income_ppp: "可支配收入（PPP）",
    pressure_housing_burden: "住房负担",
    pressure_economic_growth_momentum: "经济增长动能",
    pressure_household_debt_burden: "家庭债务负担",
    pressure_working_time_pressure: "工作时长压力",
    pressure_suicide_mental_strain: "心理压力",
    viability_personal_safety: "人身安全",
    viability_transit_access_commute: "交通可达性",
    viability_clean_air: "空气质量",
    viability_water_sanitation_utility: "供水与卫生",
    viability_digital_infrastructure: "数字基础设施",
    viability_climate_sunlight_livability: "气候与日照",
    capability_healthcare_quality: "医疗质量",
    capability_education_quality: "教育质量",
    capability_equal_opportunity_distributional_fairness: "机会公平",
    community_hospitality_belonging: "归属感与好客度",
    community_tolerance_pluralism: "包容与多元",
    community_cultural_historic_public_life_vitality: "文化生活",
    community_birth_rate_optimism: "生育乐观度",
    creative_entrepreneurial_dynamism: "创业活力",
    creative_innovation_research_intensity: "创新与研发",
    creative_economic_vitality_productive_context: "经济活力",
    creative_administrative_investment_friction: "行政摩擦",
    equal_opportunity_raw: "机会公平",
    gdp_growth_context: "GDP增长背景",
    gdp_per_capita_ppp_context: "人均GDP（PPP）",
    gini_coefficient_context: "基尼系数",
    investment_signal_raw: "投资信号",
  },
};

const DATA_LEVEL_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    city: "City data",
    national: "National proxy",
    derived: "Derived",
    composite: "Composite",
    missing: "No data",
  },
  th: {
    city: "ข้อมูลระดับเมือง",
    national: "ตัวแทนระดับประเทศ",
    derived: "คำนวณต่อยอด",
    composite: "ค่าผสม",
    missing: "ไม่มีข้อมูล",
  },
  zh: {
    city: "城市数据",
    national: "国家代理",
    derived: "推导值",
    composite: "综合值",
    missing: "无数据",
  },
};

const SCORECARD_TEXT = {
  en: {
    cityNotFound: "City not found",
    noDataFor: 'No data for',
    backToRankings: "Back to rankings",
    backToAllCities: "Back to rankings",
    citiesSuffix: "cities",
    coverageSuffix: "coverage",
    exploratoryField: "Exploratory field",
    cityOverview: "City overview",
    slicReading: "SLIC reading",
    heroImage: "Hero image",
    photoBy: "Photo by",
    type: "Type",
    region: "Region",
    dataCoverage: "Data coverage",
    status: "Status",
    primaryCity: "Primary city",
    secondaryCity: "Secondary city",
    lockedVerified: "Locked (verified)",
    disposableIncome: "Disposable income (PPP)",
    housingBurden: "Housing burden",
    safetyRate: "Safety (homicide rate)",
    airQuality: "Air quality (PM2.5)",
    healthcareQuality: "Healthcare quality",
    education: "Education (tertiary %)",
    publishedScoreTrace: "Published score trace",
    exploratoryScoreTrace: "Exploratory score trace",
    publishedScoreNote: "This card shows the city's published SLIC score from the verified workbook export. The five pillar values below are the public trace back to that number.",
    exploratoryScoreNote: "This city is not yet part of the verified published board. The number shown here is an exploratory field score for comparison, not the published board score.",
    weightSuffix: "weight",
    dataCoverageNote: "data coverage",
    whatStandsOut: "What stands out",
    highestMetric: "Highest-scoring metric",
    lowestMetric: "Lowest-scoring metric",
    dataTransparency: "Data transparency",
    overallCoverage: "overall coverage",
    transparencyNote: 'Metrics marked "City data" come from verified city-level sources. "National proxy" means the value is a country-level estimate applied to this city. "Derived" means the value is calculated from other inputs.',
    transparencyPending: "No published workbook coverage snapshot is attached to this city yet. Metric-level provenance appears after the city enters the verified board.",
    stronger: "Strongest signal",
    weaker: "Weakest signal",
  },
  th: {
    cityNotFound: "ไม่พบเมืองนี้",
    noDataFor: "ไม่มีข้อมูลสำหรับ",
    backToRankings: "กลับสู่อันดับ",
    backToAllCities: "กลับสู่อันดับ",
    citiesSuffix: "เมือง",
    coverageSuffix: "ความครอบคลุม",
    exploratoryField: "สนามทดลอง",
    cityOverview: "ภาพรวมเมือง",
    slicReading: "มุมมองแบบ SLIC",
    heroImage: "ภาพฮีโร่",
    photoBy: "ภาพโดย",
    type: "ประเภท",
    region: "ภูมิภาค",
    dataCoverage: "ความครอบคลุมข้อมูล",
    status: "สถานะ",
    primaryCity: "เมืองหลัก",
    secondaryCity: "เมืองรอง",
    lockedVerified: "ล็อกแล้ว (ตรวจสอบแล้ว)",
    disposableIncome: "รายได้ใช้สอยคงเหลือ (PPP)",
    housingBurden: "ภาระค่าที่อยู่อาศัย",
    safetyRate: "ความปลอดภัย (อัตราฆาตกรรม)",
    airQuality: "คุณภาพอากาศ (PM2.5)",
    healthcareQuality: "คุณภาพระบบสุขภาพ",
    education: "การศึกษา (% ระดับอุดมศึกษา)",
    publishedScoreTrace: "เส้นทางการไล่ย้อนคะแนนที่เผยแพร่",
    exploratoryScoreTrace: "เส้นทางการไล่ย้อนคะแนนเชิงทดลอง",
    publishedScoreNote: "การ์ดนี้แสดงคะแนน SLIC ที่เผยแพร่ของเมืองจากเวิร์กบุ๊กที่ผ่านการตรวจสอบแล้ว โดยค่า 5 เสาหลักด้านล่างคือเส้นทางสาธารณะที่ไล่ย้อนกลับไปยังตัวเลขนั้น",
    exploratoryScoreNote: "เมืองนี้ยังไม่อยู่ในบอร์ดที่เผยแพร่และผ่านการตรวจสอบแล้ว ตัวเลขที่แสดงจึงเป็นคะแนนภาคสนามเชิงทดลองเพื่อการเปรียบเทียบ ไม่ใช่คะแนนบนบอร์ดที่เผยแพร่",
    weightSuffix: "น้ำหนัก",
    dataCoverageNote: "ความครอบคลุมข้อมูล",
    whatStandsOut: "จุดเด่น",
    highestMetric: "ตัวชี้วัดที่ได้คะแนนสูงสุด",
    lowestMetric: "ตัวชี้วัดที่ได้คะแนนต่ำสุด",
    dataTransparency: "ความโปร่งใสของข้อมูล",
    overallCoverage: "ความครอบคลุมรวม",
    transparencyNote: 'ตัวชี้วัดที่ระบุว่า "ข้อมูลระดับเมือง" มาจากแหล่งข้อมูลระดับเมืองที่ผ่านการตรวจสอบแล้ว ส่วน "ตัวแทนระดับประเทศ" หมายถึงค่าประมาณระดับประเทศที่นำมาใช้กับเมืองนี้ และ "คำนวณต่อยอด" หมายถึงค่าที่คำนวณจากข้อมูลอื่น',
    transparencyPending: "เมืองนี้ยังไม่มีสแนปช็อตความครอบคลุมจากเวิร์กบุ๊กที่เผยแพร่แล้ว โดยข้อมูลแหล่งที่มาระดับตัวชี้วัดจะปรากฏเมื่อเมืองเข้าสู่บอร์ดที่ผ่านการตรวจสอบ",
    stronger: "สัญญาณที่แข็งแรงที่สุด",
    weaker: "สัญญาณที่อ่อนที่สุด",
  },
  zh: {
    cityNotFound: "未找到城市",
    noDataFor: "没有以下城市的数据",
    backToRankings: "返回排名",
    backToAllCities: "返回排名",
    citiesSuffix: "座城市",
    coverageSuffix: "覆盖度",
    exploratoryField: "探索字段",
    cityOverview: "城市概况",
    slicReading: "SLIC 解读",
    heroImage: "头图",
    photoBy: "摄影",
    type: "类型",
    region: "区域",
    dataCoverage: "数据覆盖度",
    status: "状态",
    primaryCity: "主城市",
    secondaryCity: "次级城市",
    lockedVerified: "已锁定（已核验）",
    disposableIncome: "可支配收入（PPP）",
    housingBurden: "住房负担",
    safetyRate: "安全（凶杀率）",
    airQuality: "空气质量（PM2.5）",
    healthcareQuality: "医疗质量",
    education: "教育（高等教育占比）",
    publishedScoreTrace: "已发布分数的追溯路径",
    exploratoryScoreTrace: "探索性分数的追溯路径",
    publishedScoreNote: "此卡片显示该城市来自已核验工作簿导出的已发布 SLIC 分数。下面的五个支柱数值是回溯该数字的公开路径。",
    exploratoryScoreNote: "这座城市尚未进入已核验的发布榜单。这里显示的数字是用于比较的探索性场域分数，不是发布榜单分数。",
    weightSuffix: "权重",
    dataCoverageNote: "数据覆盖度",
    whatStandsOut: "亮点",
    highestMetric: "最高分指标",
    lowestMetric: "最低分指标",
    dataTransparency: "数据透明度",
    overallCoverage: "总体覆盖度",
    transparencyNote: '标记为“城市数据”的指标来自已核验的城市级来源。“国家代理”表示该值是套用于本城市的国家级估计值，“推导值”表示该值由其他输入计算得出。',
    transparencyPending: "这座城市目前尚未附带已发布工作簿的覆盖率快照。待其进入已核验榜单后，才会显示指标级溯源信息。",
    stronger: "最强信号",
    weaker: "最弱信号",
  },
} satisfies Record<Locale, Record<string, string>>;

/* ── Helpers ── */

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

const _normStats = (publishedData as any).normStats as Record<string, NormStat>; void _normStats;
const pillarMetrics = (publishedData as any).pillarMetrics as Record<string, PillarMetricEntry[]>;
const allCities = (publishedData.cities ?? []) as PublishedCity[];

function humanizeKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getMetricLabel(metricKey: string, locale: Locale) {
  return METRIC_LABELS[locale]?.[metricKey] ?? METRIC_LABELS.en[metricKey] ?? humanizeKey(metricKey);
}

function getDataLevelLabel(level: string, locale: Locale) {
  return DATA_LEVEL_LABELS[locale]?.[level] ?? DATA_LEVEL_LABELS.en[level] ?? level;
}

function formatCityType(cityType: string | undefined, locale: Locale) {
  if (cityType === "primary") return SCORECARD_TEXT[locale].primaryCity;
  if (cityType === "secondary") return SCORECARD_TEXT[locale].secondaryCity;
  return cityType ?? "—";
}

function formatManifestStatus(status: string | undefined, locale: Locale) {
  if (status === "locked") return SCORECARD_TEXT[locale].lockedVerified;
  return status ?? "—";
}

function formatRankBand(rank: number, locale: Locale) {
  if (rank <= 10) return locale === "th" ? "α อัลฟา" : locale === "zh" ? "α 阿尔法" : "α Alpha";
  if (rank <= 20) return locale === "th" ? "β เบตา" : locale === "zh" ? "β 贝塔" : "β Beta";
  if (rank <= 30) return locale === "th" ? "γ แกมมา" : locale === "zh" ? "γ 伽马" : "γ Gamma";
  return `#${rank}`;
}

function findCity(cityId: string): PublishedCity | undefined {
  // Try exact match first (e.g. tw-taipei), then try bare name (e.g. taipei)
  const published = allCities.find((c) =>
    c.cityId === cityId || c.cityId.replace(/^[a-z]{2}-/, "") === cityId
  );
  if (published) return { ...published, publicationStatus: "published" };

  // Fallback: expose the exercise-field composite without pretending it is published.
  const exercise = getExerciseCities().find((c) => c.id === cityId.replace(/^[a-z]{2}-/, ""));
  if (!exercise) return undefined;

  return {
    cityId,
    publicationStatus: "exercise",
    displayName: exercise.name,
    country: exercise.country,
    region: exercise.region,
    coverageGrade: "Exercise",
    overallWeightedCoverage: null,
    slicScore: exercise.scores.slic,
    pressureScore: exercise.scores.pressure,
    viabilityScore: exercise.scores.viability,
    capabilityScore: exercise.scores.capability,
    communityScore: exercise.scores.community,
    creativeScore: exercise.scores.creative,
    pressureCoverage: null,
    viabilityCoverage: null,
    capabilityCoverage: null,
    communityCoverage: null,
    creativeCoverage: null,
    rank: exercise.globalRank,
    metrics: {},
    highlights: { strongest: null, weakest: null },
  } as PublishedCity;
}

function pillarScoreKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Score` as keyof PublishedCity;
}

function pillarCoverageKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Coverage` as keyof PublishedCity;
}

/* ── Components ── */

function NormBar({ score, color }: { score: number | null; color: string }) {
  if (score === null) return <span className="scorecard-no-data">—</span>;
  return (
    <div className="scorecard-norm-bar">
      <div
        className="scorecard-norm-bar-fill"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, background: color }}
      />
      <span className="scorecard-norm-bar-label">{score.toFixed(1)}</span>
    </div>
  );
}

function DataBadge({ level, locale }: { level: string; locale: Locale }) {
  return (
    <span className={`scorecard-data-badge scorecard-data-badge--${level}`}>
      {getDataLevelLabel(level, locale)}
    </span>
  );
}

function MetricRow({
  metricKey,
  detail,
  color,
  locale,
}: {
  metricKey: string;
  detail: MetricDetail;
  color: string;
  locale: Locale;
}) {
  const label = getMetricLabel(metricKey, locale);
  return (
    <div className="scorecard-metric-row-wrapper">
      <div className="scorecard-metric-row">
        <div className="scorecard-metric-header">
          <span className="scorecard-metric-name">{label}</span>
          <DataBadge level={detail.dataLevel} locale={locale} />
        </div>
        <div className="scorecard-metric-value">
          {detail.raw !== null ? (
            <span className="scorecard-raw-value">{detail.raw.toLocaleString()}</span>
          ) : (
            <span className="scorecard-raw-value scorecard-raw-value--missing">—</span>
          )}
        </div>
        <NormBar score={detail.score} color={color} />
        {detail.source && detail.sourceUrl ? (
          <a
            className="scorecard-source-link"
            href={detail.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {detail.source}
          </a>
        ) : detail.source ? (
          <span className="scorecard-source-link">{detail.source}</span>
        ) : null}
      </div>
      {detail.components && detail.components.length > 0 && (
        <div className="scorecard-metric-components">
          {detail.components.map((comp) => (
            <div key={comp.key} className="scorecard-component-row">
              <span className="scorecard-component-name">{getMetricLabel(comp.key, locale)}</span>
              <span className="scorecard-component-score">
                {comp.score !== null ? comp.score.toFixed(1) : "—"}
              </span>
              <div className="scorecard-component-bar">
                {comp.score !== null && (
                  <div
                    className="scorecard-component-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%`, background: color, opacity: 0.6 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generatePillarNarrative(pillar: PillarId, city: PublishedCity, locale: Locale): string {
  const name = city.displayName;
  const score = city[pillarScoreKey(pillar)] as number;

  if (score === null || score === undefined) return "";

  const level = score >= 67 ? "high" : score >= 34 ? "mid" : "low";
  const metrics = (pillarMetrics?.[pillar] ?? [])
    .map((metric) => ({ key: metric.key, score: city.metrics?.[metric.key]?.score ?? null }))
    .filter((metric): metric is { key: string; score: number } => metric.score !== null);

  const strongest = metrics.reduce<{ key: string; score: number } | null>(
    (best, metric) => (!best || metric.score > best.score ? metric : best),
    null,
  );
  const weakest = metrics.reduce<{ key: string; score: number } | null>(
    (worst, metric) => (!worst || metric.score < worst.score ? metric : worst),
    null,
  );

  if (locale === "th") {
    const levelLabel = level === "high" ? "ระดับสูง" : level === "mid" ? "ระดับกลาง" : "ระดับต่ำ";
    const fragments = [`${name}มีสัญญาณด้าน${PILLAR_LABELS.th[pillar]}อยู่ใน${levelLabel}`];
    if (strongest) fragments.push(`${SCORECARD_TEXT.th.stronger}: ${getMetricLabel(strongest.key, "th")}`);
    if (weakest) fragments.push(`${SCORECARD_TEXT.th.weaker}: ${getMetricLabel(weakest.key, "th")}`);
    return `${fragments.join(" · ")}.`;
  }

  if (locale === "zh") {
    const levelLabel = level === "high" ? "较高区间" : level === "mid" ? "中位区间" : "较低区间";
    const fragments = [`${name}的${PILLAR_LABELS.zh[pillar]}信号处于${levelLabel}`];
    if (strongest) fragments.push(`${SCORECARD_TEXT.zh.stronger}：${getMetricLabel(strongest.key, "zh")}`);
    if (weakest) fragments.push(`${SCORECARD_TEXT.zh.weaker}：${getMetricLabel(weakest.key, "zh")}`);
    return `${fragments.join(" · ")}。`;
  }

  const levelLabel = level === "high" ? "higher-range" : level === "mid" ? "mid-range" : "lower-range";
  const fragments = [`${name} records ${levelLabel} ${PILLAR_LABELS.en[pillar].toLowerCase()} signals`];
  if (strongest) fragments.push(`${SCORECARD_TEXT.en.stronger}: ${getMetricLabel(strongest.key, "en")}`);
  if (weakest) fragments.push(`${SCORECARD_TEXT.en.weaker}: ${getMetricLabel(weakest.key, "en")}`);
  return `${fragments.join(" · ")}.`;
}

function PillarSection({
  pillar,
  city,
  locale,
}: {
  pillar: PillarId;
  city: PublishedCity;
  locale: Locale;
}) {
  const score = city[pillarScoreKey(pillar)] as number;
  const coverage = city[pillarCoverageKey(pillar)] as number | null;
  const color = PILLAR_COLORS[pillar];
  const metrics = pillarMetrics?.[pillar] ?? [];
  const narrative = generatePillarNarrative(pillar, city, locale);

  return (
    <div className="scorecard-pillar-section">
      <div className="scorecard-pillar-header" style={{ borderLeftColor: color }}>
        <div>
          <h3>{PILLAR_LABELS[locale]?.[pillar] ?? PILLAR_LABELS.en[pillar]}</h3>
          <span className="scorecard-pillar-weight">{PILLAR_WEIGHTS[pillar]}% {SCORECARD_TEXT[locale].weightSuffix}</span>
        </div>
        <div className="scorecard-pillar-score" style={{ color }}>
          {score !== null ? score.toFixed(1) : "—"}
        </div>
      </div>
      {narrative && (
        <p className="scorecard-pillar-narrative">{narrative}</p>
      )}
      {coverage !== null && coverage < 1 && (
        <div className="scorecard-coverage-note">
          {Math.round(coverage * 100)}% {SCORECARD_TEXT[locale].dataCoverageNote}
        </div>
      )}
      <div className="scorecard-metric-list">
        {metrics.map((m) => {
          const detail = city.metrics?.[m.key];
          if (!detail) return null;
          return <MetricRow key={m.key} metricKey={m.key} detail={detail} color={color} locale={locale} />;
        })}
      </div>
    </div>
  );
}

/* ── Main Page ── */

export default function CityScorecardPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const pathSegments = stripBase(window.location.pathname).split("/city/");
  const cityId = decodeURIComponent(pathSegments[pathSegments.length - 1] ?? "");
  const city = findCity(cityId);
  const copy = SCORECARD_TEXT[locale];
  const rankedCityCount = allCities.filter((c) => c.rankingStatus === "Ranked").length;

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "8rem" }}>
        <p className="eyebrow">{copy.cityNotFound}</p>
        <h1>{copy.noDataFor} "{cityId}"</h1>
        <a
          className="secondary-action"
          href={appHref("/rankings")}
          onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
        >
          {copy.backToRankings}
        </a>
      </section>
    );
  }

  const pillarScores = PILLAR_ORDER.map((p) => ({
    id: p,
    score: city[pillarScoreKey(p)] as number,
    weight: PILLAR_WEIGHTS[p],
    color: PILLAR_COLORS[p],
    label: PILLAR_LABELS[locale]?.[p] ?? PILLAR_LABELS.en[p],
  }));
  const isPublished = city.publicationStatus !== "exercise";
  const cityEditorial = getCityEditorialEntry(city.cityId);

  return (
    <>
      <section className={`scorecard-hero section${cityEditorial?.photo ? " scorecard-hero--visual" : ""}`}>
        {cityEditorial?.photo && (
          <div className="scorecard-hero-media" aria-hidden="true">
            <img
              className="scorecard-hero-image"
              src={cityEditorial.photo.imageUrl}
              alt=""
              loading="eager"
              fetchPriority="high"
              style={{ objectPosition: cityEditorial.photo.position ?? "center center" }}
            />
          </div>
        )}
        {cityEditorial?.photo && <div className="scorecard-hero-scrim" aria-hidden="true" />}

        <div className="scorecard-hero-shell">
          <a
            className="scorecard-back"
            href={appHref("/rankings")}
            onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
          >
            &larr; {copy.backToRankings}
          </a>

          <div className="scorecard-hero-split">
            <div className="scorecard-hero-copy">
              <p className="eyebrow">{city.region}</p>
              <h1 className="scorecard-city-name">{city.displayName}</h1>
              <p className="scorecard-country">{city.country}</p>
              {cityEditorial?.heroLine && (
                <p className="scorecard-hero-line">{cityEditorial.heroLine}</p>
              )}
            </div>
            <div className="scorecard-hero-scores">
              <div className="scorecard-slic-score">{city.slicScore?.toFixed(1) ?? "—"}</div>
              <div className="scorecard-rank">
                {formatRankBand(city.rank, locale)}
                <span>
                  {locale === "th"
                    ? ` จาก ${rankedCityCount} ${copy.citiesSuffix}`
                    : locale === "zh"
                      ? ` / ${rankedCityCount}${copy.citiesSuffix}`
                      : ` of ${rankedCityCount} ${copy.citiesSuffix}`}
                </span>
              </div>
              {isPublished ? (
                <span className={`scorecard-grade scorecard-grade--${city.coverageGrade?.toLowerCase()}`}>
                  {city.coverageGrade} {copy.coverageSuffix}
                </span>
              ) : (
                <span className="scorecard-grade scorecard-grade--exercise">
                  {copy.exploratoryField}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {isPublished && cityEditorial && (
        <section className="section scorecard-editorial">
          <div className="scorecard-editorial-grid">
            <div>
              <p className="eyebrow">{copy.slicReading}</p>
              <p className="scorecard-editorial-copy">{cityEditorial.intro}</p>
            </div>
            <aside className="scorecard-editorial-credit">
              <span className="scorecard-editorial-credit-label">{copy.heroImage}</span>
              <p className="scorecard-editorial-credit-meta">
                {copy.photoBy}{" "}
                <a href={cityEditorial.photo.sourceUrl} target="_blank" rel="noreferrer noopener">
                  {cityEditorial.photo.credit}
                </a>{" "}
                / Wikimedia Commons
              </p>
            </aside>
          </div>
        </section>
      )}

      {/* ── City Overview ── */}
      {isPublished && (
        <section className="section scorecard-overview">
          <p className="eyebrow">{copy.cityOverview}</p>
          <div className="scorecard-overview-grid">
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">{copy.type}</span>
              <strong>{formatCityType(city.cityType, locale)}</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">{copy.region}</span>
              <strong>{city.region}</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">{copy.dataCoverage}</span>
              <strong>{city.coverageGrade} — {Math.round((city.overallWeightedCoverage ?? 0) * 100)}%</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">{copy.status}</span>
              <strong>{formatManifestStatus(city.manifestStatus, locale)}</strong>
            </div>
            {city.metrics?.pressure_disposable_income_ppp?.raw !== null && city.metrics?.pressure_disposable_income_ppp?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.disposableIncome}</span>
                <strong>${Math.round(city.metrics.pressure_disposable_income_ppp.raw).toLocaleString()}/mo</strong>
              </div>
            )}
            {city.metrics?.pressure_housing_burden?.raw !== null && city.metrics?.pressure_housing_burden?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.housingBurden}</span>
                <strong>{city.metrics.pressure_housing_burden.raw.toFixed(1)}% of income</strong>
              </div>
            )}
            {city.metrics?.viability_personal_safety?.raw !== null && city.metrics?.viability_personal_safety?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.safetyRate}</span>
                <strong>{city.metrics.viability_personal_safety.raw.toFixed(1)} per 100k</strong>
              </div>
            )}
            {city.metrics?.viability_clean_air?.raw !== null && city.metrics?.viability_clean_air?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.airQuality}</span>
                <strong>{city.metrics.viability_clean_air.raw.toFixed(0)} μg/m³</strong>
              </div>
            )}
            {city.metrics?.capability_healthcare_quality?.raw !== null && city.metrics?.capability_healthcare_quality?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.healthcareQuality}</span>
                <strong>{city.metrics.capability_healthcare_quality.raw.toFixed(0)}/100</strong>
              </div>
            )}
            {city.metrics?.capability_education_quality?.raw !== null && city.metrics?.capability_education_quality?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.education}</span>
                <strong>{city.metrics.capability_education_quality.raw.toFixed(0)}% enrollment</strong>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Equation bar ── */}
      <section className="scorecard-equation section">
        <p className="scorecard-equation-label">{isPublished ? copy.publishedScoreTrace : copy.exploratoryScoreTrace}</p>
        <p className="scorecard-equation-note">
          {isPublished ? copy.publishedScoreNote : copy.exploratoryScoreNote}
        </p>
        <div className="scorecard-equation-bar">
          {pillarScores.map((p, i) => (
            <span key={p.id} className="scorecard-equation-term">
              {i > 0 && <span className="scorecard-equation-op">+</span>}
              <span className="scorecard-equation-weight">{(p.weight / 100).toFixed(2)}</span>
              <span className="scorecard-equation-times">&times;</span>
              <span className="scorecard-equation-pillar" style={{ color: p.color }}>
                {p.label}({p.score?.toFixed(1) ?? "?"})
              </span>
            </span>
          ))}
          <span className="scorecard-equation-op">=</span>
          <span className="scorecard-equation-result">{city.slicScore?.toFixed(1)}</span>
        </div>
      </section>

      {/* ── Pillar breakdown sections ── */}
      <main className="section scorecard-pillars">
        {PILLAR_ORDER.map((pillar) => (
          <PillarSection key={pillar} pillar={pillar} city={city} locale={locale} />
        ))}
      </main>

      {/* ── Highlights ── */}
      {city.highlights && (city.highlights.strongest || city.highlights.weakest) && (
        <section className="section scorecard-highlights">
          <p className="eyebrow">{copy.whatStandsOut}</p>
          <div className="scorecard-highlight-grid">
            {city.highlights.strongest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--strong">
                <span className="scorecard-highlight-label">{copy.highestMetric}</span>
                <strong>{getMetricLabel(city.highlights.strongest, locale)}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.strongest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
            {city.highlights.weakest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--weak">
                <span className="scorecard-highlight-label">{copy.lowestMetric}</span>
                <strong>{getMetricLabel(city.highlights.weakest, locale)}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.weakest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Data transparency ── */}
      <section className="section scorecard-transparency">
        <p className="eyebrow">{copy.dataTransparency}</p>
        {isPublished ? (
          <>
            <div className="scorecard-transparency-grid">
              <div className="scorecard-transparency-stat">
                <strong>{Math.round((city.overallWeightedCoverage ?? 0) * 100)}%</strong>
                <span>{copy.overallCoverage}</span>
              </div>
              {PILLAR_ORDER.map((p) => {
                const cov = city[pillarCoverageKey(p)] as number | null;
                return (
                  <div key={p} className="scorecard-transparency-stat">
                    <strong style={{ color: PILLAR_COLORS[p] }}>{Math.round((cov ?? 0) * 100)}%</strong>
                    <span>{PILLAR_LABELS[locale]?.[p] ?? PILLAR_LABELS.en[p]}</span>
                  </div>
                );
              })}
            </div>
            <p className="scorecard-transparency-note">
              {copy.transparencyNote}
            </p>
          </>
        ) : (
          <p className="scorecard-transparency-note">
            {copy.transparencyPending}
          </p>
        )}
      </section>

      {/* ── Sticky bottom back button ── */}
      <div className="scorecard-bottom-nav">
        <a
          className="scorecard-back"
          href={appHref("/rankings")}
          onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
        >
          &larr; {copy.backToAllCities}
        </a>
      </div>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
