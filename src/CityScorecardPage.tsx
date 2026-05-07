import publishedData from "./data/publishedRankingData.json";
import { CITY_CONTEXT } from "./data/cityContext";
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
  coveragePenalty?: number | null;
  overallWeightedCoverage: number | null;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  tierLabel?: "Alpha" | "Beta" | "Gamma" | null;
  tierSlot?: number | null;
  tierReason?: string | null;
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

interface PublishedRankingData {
  publishable: boolean;
  status: string;
  updatedAt: string;
  canonicalWeights: Record<PillarId, number>;
  normStats: Record<string, NormStat>;
  pillarMetrics: Record<string, PillarMetricEntry[]>;
  metricCatalog: Record<string, unknown>;
  cities: PublishedCity[];
  diagnosticMetrics: Record<string, unknown>;
  diagnostics: unknown[];
  methodologyFacts: unknown[];
  changeSummary: unknown[];
  qualifiedCityCount: number;
  integrityIssueCount: number;
  validCityRowCount: number;
  validCountryRowCount: number;
  publicationManifest: unknown;
  stabilityAnalysis: unknown;
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
    pressure_economic_stress_hanke: "Economic Stress (Hanke)",
    community_civic_freedom_dignity: "Civic Freedom & Dignity",
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
    pressure_economic_stress_hanke: "ความตึงเครียดทางเศรษฐกิจ (Hanke)",
    community_civic_freedom_dignity: "เสรีภาพพลเมืองและศักดิ์ศรี",
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
    pressure_economic_stress_hanke: "经济压力（Hanke）",
    community_civic_freedom_dignity: "公民自由与尊严",
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
    ofIncome: "% of income",
    per100k: "per 100k",
    pctEnrollment: "% enrollment",
    population: "Population",
    cityShare: "National share",
    birthRate: "Birth rate (TFR)",
    nationalData: "(national)",
    workingHours: "Working hours",
    waterAccess: "Clean water",
    broadband: "Broadband",
    climateScore: "Climate",
    gdpGrowth: "GDP growth",
    peersEyebrow: "City peers",
    peersTitle: "Cities like this one",
    tagSameRegion: "Same region",
    tagSimilarScale: "Similar scale",
    tagSimilarIncome: "Similar income",
    derivedFormulaLabel: "Calculation formula",
    derivedDiFormula: "DI_PPP = (GrossIncome × (1 − TaxRate) − Rent − Utilities − Transit − Internet − Food) ÷ PPPFactor",
    derivedGenericNote: "Calculated from city-level inputs and country benchmarks.",
    coverageBreakdownTitle: "Data level breakdown",
    coverageCityDirect: "City-direct",
    coverageNationalProxy: "National proxy",
    coverageDerived: "Derived",
    coverageMissing: "No data",
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
    ofIncome: "% ของรายได้",
    per100k: "ต่อ 100,000 คน",
    pctEnrollment: "% อัตราการลงทะเบียนเรียน",
    population: "ประชากร",
    cityShare: "สัดส่วนในประเทศ",
    birthRate: "อัตราเกิด (TFR)",
    nationalData: "(ระดับประเทศ)",
    workingHours: "ชั่วโมงทำงาน",
    waterAccess: "น้ำสะอาด",
    broadband: "อินเทอร์เน็ต",
    climateScore: "ภูมิอากาศ",
    gdpGrowth: "การเติบโต GDP",
    peersEyebrow: "เพื่อนเมือง",
    peersTitle: "เมืองที่ใกล้เคียงกัน",
    tagSameRegion: "ภูมิภาคเดียวกัน",
    tagSimilarScale: "ขนาดใกล้เคียง",
    tagSimilarIncome: "รายได้ใกล้เคียง",
    derivedFormulaLabel: "สูตรคำนวณ",
    derivedDiFormula: "DI_PPP = (รายได้รวม × (1 − อัตราภาษี) − ค่าเช่า − ค่าสาธารณูปโภค − ค่าเดินทาง − ค่าอินเทอร์เน็ต − ค่าอาหาร) ÷ ตัวประกอบ PPP",
    derivedGenericNote: "คำนวณจากข้อมูลระดับเมืองและเกณฑ์มาตรฐานระดับประเทศ",
    coverageBreakdownTitle: "แบ่งตามระดับข้อมูล",
    coverageCityDirect: "ข้อมูลเมืองโดยตรง",
    coverageNationalProxy: "ตัวแทนระดับประเทศ",
    coverageDerived: "คำนวณต่อยอด",
    coverageMissing: "ไม่มีข้อมูล",
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
    ofIncome: "% 的收入",
    per100k: "每10万人",
    pctEnrollment: "% 入学率",
    population: "人口",
    cityShare: "全国占比",
    birthRate: "出生率（TFR）",
    nationalData: "（全国）",
    workingHours: "工作时长",
    waterAccess: "洁净水",
    broadband: "宽带",
    climateScore: "气候",
    gdpGrowth: "GDP增长",
    peersEyebrow: "城市同伴",
    peersTitle: "同类城市",
    tagSameRegion: "同一地区",
    tagSimilarScale: "规模相似",
    tagSimilarIncome: "收入相近",
    derivedFormulaLabel: "计算公式",
    derivedDiFormula: "DI_PPP = (税前收入 × (1 − 税率) − 房租 − 水电 − 交通 − 网络 − 餐饮) ÷ PPP系数",
    derivedGenericNote: "由城市级输入数据和国家基准计算得出。",
    coverageBreakdownTitle: "数据层级分布",
    coverageCityDirect: "城市直接数据",
    coverageNationalProxy: "国家代理数据",
    coverageDerived: "推导值",
    coverageMissing: "无数据",
  },
} satisfies Record<Locale, Record<string, string>>;

/* ── Helpers ── */

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath | string) => void,
  path: SitePath | string,
) {
  event.preventDefault();
  onNavigate(path);
}

const publication = publishedData as unknown as PublishedRankingData;
const pillarMetrics = publication.pillarMetrics;

/* ── Peer comparison ── */

const INDUSTRY_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    manufacturing: "Industrial", shipping: "Port city", tech: "Tech hub", finance: "Finance hub",
    tourism: "Tourism hub", government: "Capital region", energy: "Energy sector", mining: "Resource-based",
    education: "University city", pharma: "Pharma hub", automotive: "Auto & industry", trade: "Trade hub",
    services: "Service economy", agriculture: "Agricultural", media: "Media hub", garments: "Garments",
    biotech: "Biotech hub", fashion: "Fashion hub", healthcare: "Healthcare hub",
  },
  th: {
    manufacturing: "อุตสาหกรรม", shipping: "เมืองท่า", tech: "ศูนย์กลางเทคฯ", finance: "ศูนย์การเงิน",
    tourism: "ท่องเที่ยว", government: "ราชการ/เมืองหลวง", energy: "พลังงาน", mining: "ทรัพยากร",
    education: "มหาวิทยาลัย", pharma: "เภสัชกรรม", automotive: "ยานยนต์", trade: "การค้า",
    services: "บริการ", agriculture: "เกษตรกรรม", media: "สื่อ", garments: "สิ่งทอ",
    biotech: "ชีวเทค", fashion: "แฟชั่น", healthcare: "สาธารณสุข",
  },
  zh: {
    manufacturing: "工业", shipping: "港口城市", tech: "科技中心", finance: "金融中心",
    tourism: "旅游业", government: "首都/行政中心", energy: "能源产业", mining: "资源型城市",
    education: "大学城", pharma: "医药产业", automotive: "汽车工业", trade: "贸易中心",
    services: "服务业", agriculture: "农业", media: "传媒中心", garments: "纺织业",
    biotech: "生物科技", fashion: "时尚产业", healthcare: "医疗产业",
  },
};

function computePillarDistance(a: PublishedCity, b: PublishedCity): number {
  return PILLAR_ORDER.reduce((sum, p) => {
    const aScore = (a[pillarScoreKey(p)] as number) ?? 50;
    const bScore = (b[pillarScoreKey(p)] as number) ?? 50;
    return sum + Math.pow(aScore - bScore, 2);
  }, 0);
}

type PeerTag = string;

function computePeerTags(target: PublishedCity, peer: PublishedCity): PeerTag[] {
  const tags: PeerTag[] = [];
  const tc = CITY_CONTEXT[target.cityId];
  const pc = CITY_CONTEXT[peer.cityId];

  if (target.region === peer.region) tags.push("region");

  if (tc && pc) {
    const ratio = Math.max(tc.cityPop, pc.cityPop) / Math.min(tc.cityPop, pc.cityPop);
    if (ratio < 2.5) tags.push("scale");
    const shared = tc.industries.find((i) => pc.industries.includes(i));
    if (shared) tags.push(shared);
  }

  const ti = target.metrics?.pressure_disposable_income_ppp?.raw;
  const pi = peer.metrics?.pressure_disposable_income_ppp?.raw;
  if (ti && pi && tags.length < 3) {
    const incomeRatio = Math.max(ti, pi) / Math.min(ti, pi);
    if (incomeRatio < 1.5) tags.push("income");
  }

  return tags.slice(0, 3);
}

function getPeerTagLabel(tag: PeerTag, locale: Locale): string {
  const copy = SCORECARD_TEXT[locale];
  if (tag === "region") return copy.tagSameRegion;
  if (tag === "scale") return copy.tagSimilarScale;
  if (tag === "income") return copy.tagSimilarIncome;
  return INDUSTRY_LABELS[locale][tag] ?? tag;
}

function findComparableCities(
  target: PublishedCity,
  ranked: PublishedCity[],
): Array<{ city: PublishedCity; tags: PeerTag[] }> {
  return ranked
    .filter((c) => c.cityId !== target.cityId)
    .map((c) => ({ city: c, dist: computePillarDistance(target, c) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3)
    .map(({ city }) => ({ city, tags: computePeerTags(target, city) }));
}
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

function formatRankBand(
  tierLabel: PublishedCity["tierLabel"] | undefined,
  rank: number,
  rankingStatus: string | undefined,
  locale: Locale,
) {
  if (rankingStatus && rankingStatus !== "Ranked") {
    return locale === "th" ? "เฝ้าระวัง" : locale === "zh" ? "观察名单" : "Watchlist";
  }
  if (tierLabel === "Alpha") return locale === "th" ? "α อัลฟา" : locale === "zh" ? "α 阿尔法" : "α Alpha";
  if (tierLabel === "Beta") return locale === "th" ? "β เบตา" : locale === "zh" ? "β 贝塔" : "β Beta";
  if (tierLabel === "Gamma") return locale === "th" ? "γ แกมมา" : locale === "zh" ? "γ 伽马" : "γ Gamma";
  return `#${rank}`;
}

function coverageCaveat(
  coverageGrade: string | undefined,
  coveragePenalty: number | null | undefined,
  locale: Locale,
): string {
  // Grade-C cities (or any city carrying a non-zero coverage penalty) deserve
  // an inline note: their headline SLIC score is the AMPI minus the penalty,
  // not the raw composite. Without this, a reader sees Munich at 13.5 and
  // assumes the index is broken — when actually the data is.
  if (!coverageGrade || coverageGrade === "A" || !coveragePenalty || coveragePenalty <= 0) return "";
  if (locale === "th") {
    return ` คะแนนนี้รวมบทลงโทษด้านข้อมูล −${coveragePenalty} (เกรด ${coverageGrade}) เนื่องจากข้อมูลระดับเมืองยังไม่ครบทุกเสา`;
  }
  if (locale === "zh") {
    return ` 该分数包含 −${coveragePenalty} 数据覆盖扣分（${coverageGrade} 级），因部分支柱缺少城市级数据。`;
  }
  return ` This score carries a −${coveragePenalty} coverage penalty (grade ${coverageGrade}) because city-level data is incomplete on one or more pillars.`;
}

function tierBridgeNote(
  tierLabel: PublishedCity["tierLabel"] | undefined,
  rank: number,
  tierSlot: number | null | undefined,
  rankedCityCount: number,
  rankingStatus: string | undefined,
  coverageGrade: string | undefined,
  coveragePenalty: number | null | undefined,
  locale: Locale,
): { headline: string; body: string } {
  const cov = coverageCaveat(coverageGrade, coveragePenalty, locale);
  // The pedagogy: pure rank is global score order; public tier is a separate
  // editorial overlay (10 seats max per tier, country caps, floor scores,
  // editorial exclusions). A high pure rank does NOT guarantee Alpha;
  // a "lower" pure rank can earn Alpha if it clears the editorial gates.

  // Watchlist cities are explicitly NOT in the ranked list — they fail the
  // coverage threshold or hold a special status (conflict zone, missing
  // pillar). Treat them honestly rather than reusing the "ranked but no
  // tier" framing.
  if (rankingStatus && rankingStatus !== "Ranked") {
    const headline = locale === "th"
      ? "อยู่ในรายชื่อเฝ้าระวัง"
      : locale === "zh"
        ? "位于观察名单"
        : "On the Watchlist";
    return {
      headline,
      body: locale === "th"
        ? `เมืองนี้ไม่ได้อยู่ในรายชื่อจัดอันดับสาธารณะ ${rankedCityCount} เมือง และไม่ได้ถือที่นั่งในชั้น Alpha/Beta/Gamma. SLIC วางไว้ในรายชื่อเฝ้าระวังเมื่อข้อมูลที่ตรวจสอบได้สำหรับเสาหนึ่งเสาขึ้นไปยังไม่ครอบคลุม หรือเมื่อบริบทอยู่นอกเส้นแบ่งของระเบียบวิธี (เขตขัดแย้ง สถานะอธิปไตยพิเศษ) ตัวเลขด้านล่างเป็นบันทึกที่เผยแพร่ ไม่ใช่อันดับ`
        : locale === "zh"
          ? `本城未列入 ${rankedCityCount} 座已排名城市的公开榜单，也未占 Alpha/Beta/Gamma 任何席位。当一个或多个支柱的城市级证据尚未达到覆盖阈值，或当背景跨出方法论边界（冲突区、特殊主权状态）时，SLIC 将城市归入观察名单。下方数字是已发布的记录，并非排名。`
          : `This city is not in the public ranked list of ${rankedCityCount} cities, nor does it hold a seat in any public tier. SLIC places a city on the Watchlist when verified pillar data is below the coverage threshold, or when the context sits outside the methodology's boundary (conflict zone, special sovereignty status). The numbers below are the published record — not a ranking.`,
    };
  }
  if (tierLabel === "Alpha") {
    const headline = locale === "th" ? "อยู่ในชั้น Alpha" : locale === "zh" ? "位于 Alpha 层" : "On the Alpha shelf";
    return {
      headline,
      body: (locale === "th"
        ? `อันดับล้วน #${rank} ใน ${rankedCityCount} เมืองที่จัดอันดับ · Alpha สล็อตที่ ${tierSlot} จาก 10. Alpha คือชั้นบรรณาธิการที่สงวนไว้ให้กับเมืองที่ผู้อยู่อาศัยมัธยฐานเจริญงอกงามจริง — ไม่ใช่ top-10 ตามคะแนนล้วน เมืองนี้ผ่านทุกประตู: คะแนนขั้นต่ำ เพดานประเทศ การกีดกันบรรณาธิการ`
        : locale === "zh"
          ? `纯分第 ${rank}（共 ${rankedCityCount} 座已排名城市）· Alpha 第 ${tierSlot} 席（共 10 席）。Alpha 是为中位居民真正安居的城市保留的编辑层 —— 而非按纯分排出的前 10。本城通过所有门槛：底线分数、国家上限、编辑排除。`
          : `Pure rank #${rank} of ${rankedCityCount} ranked cities · Alpha slot ${tierSlot} of 10. Alpha is the editorial overlay for cities where the median resident actually thrives — not the top-ten by pure score. This city clears every gate: floor scores, country cap, editorial exclusion.`) + cov,
    };
  }
  if (tierLabel === "Beta" || tierLabel === "Gamma") {
    const headline = locale === "th"
      ? `อยู่ในชั้น ${tierLabel}`
      : locale === "zh"
        ? `位于 ${tierLabel} 层`
        : `On the ${tierLabel} shelf`;
    return {
      headline,
      body: (locale === "th"
        ? `อันดับล้วน #${rank} ใน ${rankedCityCount} เมืองที่จัดอันดับ · ${tierLabel} สล็อตที่ ${tierSlot} จาก 10. ${tierLabel} คือชั้นที่เมืองได้รับเมื่อ Alpha ปิดอยู่ — อาจเพราะคะแนนขั้นต่ำไม่ผ่าน เพดานประเทศเต็ม หรือถูกกฎบรรณาธิการกีดกัน`
        : locale === "zh"
          ? `纯分第 ${rank}（共 ${rankedCityCount} 座已排名城市）· ${tierLabel} 第 ${tierSlot} 席（共 10 席）。${tierLabel} 是当 Alpha 关闭时城市的归处 —— 可能因为底线未达、国家上限已满，或被编辑规则排除。`
          : `Pure rank #${rank} of ${rankedCityCount} ranked cities · ${tierLabel} slot ${tierSlot} of 10. ${tierLabel} is where a city lands when Alpha is closed to it — floor missed, country cap full, or editorial exclusion in force.`) + cov,
    };
  }
  const headline = locale === "th"
    ? "ไม่มีที่นั่งในชั้นสาธารณะ"
    : locale === "zh"
      ? "未获公开层席位"
      : "No public-tier seat";
  return {
    headline,
    body: (locale === "th"
      ? `อันดับล้วน #${rank} ใน ${rankedCityCount} เมืองที่จัดอันดับ. เมืองนี้อยู่ในรายชื่อจัดอันดับ แต่แต่ละชั้นสาธารณะ (Alpha, Beta, Gamma) มีเพียง 10 ที่นั่ง พร้อมเพดานประเทศและเกณฑ์ขั้นต่ำของบรรณาธิการ — ที่นั่งของชั้นใดชั้นหนึ่งจึงเต็มก่อนที่เมืองนี้จะเข้าได้`
      : locale === "zh"
        ? `纯分第 ${rank}（共 ${rankedCityCount} 座已排名城市）。本城在排名清单中，但每个公开层（Alpha、Beta、Gamma）仅 10 席，配合国家上限与编辑底线 —— 在轮到本城之前已被填满。`
        : `Pure rank #${rank} of ${rankedCityCount} ranked cities. This city is in the ranked list, but each public shelf (Alpha, Beta, Gamma) has only 10 seats with country caps and editorial floors — those seats were claimed before this city's turn.`) + cov,
  };
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
    tierLabel: null,
    tierSlot: null,
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
  const copy = SCORECARD_TEXT[locale];
  const isDiPpp = metricKey === "pressure_disposable_income_ppp";
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
      {/* Derived metric formula disclosure */}
      {detail.dataLevel === "derived" && (
        <details className="scorecard-derived-formula">
          <summary>{copy.derivedFormulaLabel}</summary>
          <code>{isDiPpp ? copy.derivedDiFormula : copy.derivedGenericNote}</code>
        </details>
      )}
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
              {/* Component source link */}
              {comp.source && (
                comp.sourceUrl ? (
                  <a className="scorecard-component-source" href={comp.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {comp.source}
                  </a>
                ) : (
                  <span className="scorecard-component-source">{comp.source}</span>
                )
              )}
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
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const pathSegments = stripBase(window.location.pathname).split("/city/");
  const cityId = decodeURIComponent(pathSegments[pathSegments.length - 1] ?? "");
  const city = findCity(cityId);
  const copy = SCORECARD_TEXT[locale];
  const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");
  const rankedCityCount = rankedCities.length;

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
  const cityCtx = CITY_CONTEXT[city.cityId];
  const peers = isPublished ? findComparableCities(city, rankedCities) : [];
  const cityEditorial = getCityEditorialEntry(city.cityId);

  return (
    <>
      <section className={`scorecard-hero section${cityEditorial?.photo ? " scorecard-hero--visual" : " scorecard-hero--dark"}`}>
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
              <div className="scorecard-rank" title={city.tierReason ?? undefined}>
                {formatRankBand(city.tierLabel, city.rank, city.rankingStatus, locale)}
                {(!city.rankingStatus || city.rankingStatus === "Ranked") && (
                  <span>
                    {locale === "th"
                      ? ` จาก ${rankedCityCount} ${copy.citiesSuffix}`
                      : locale === "zh"
                        ? ` / ${rankedCityCount}${copy.citiesSuffix}`
                        : ` of ${rankedCityCount} ${copy.citiesSuffix}`}
                  </span>
                )}
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
          {isPublished && (() => {
            const bridge = tierBridgeNote(
              city.tierLabel,
              city.rank,
              city.tierSlot,
              rankedCityCount,
              city.rankingStatus,
              city.coverageGrade,
              city.coveragePenalty,
              locale,
            );
            return (
              <div className="scorecard-tier-bridge">
                <p className="scorecard-tier-bridge-headline">{bridge.headline}</p>
                <p className="scorecard-tier-bridge-body">{bridge.body}</p>
              </div>
            );
          })()}
        </div>
      </section>

      {isPublished && cityEditorial && (
        <section className="section scorecard-editorial">
          <div className={`scorecard-editorial-grid${cityEditorial.intro ? "" : " scorecard-editorial-grid--credit-only"}`}>
            {cityEditorial.intro && (
              <div>
                <p className="eyebrow">{copy.slicReading}</p>
                <p className="scorecard-editorial-copy">{cityEditorial.intro}</p>
              </div>
            )}
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
                <strong>{city.metrics.pressure_housing_burden.raw.toFixed(1)}{copy.ofIncome}</strong>
              </div>
            )}
            {city.metrics?.viability_personal_safety?.raw !== null && city.metrics?.viability_personal_safety?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.safetyRate}</span>
                <strong>{city.metrics.viability_personal_safety.raw.toFixed(1)} {copy.per100k}</strong>
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
                <strong>{city.metrics.capability_education_quality.raw.toFixed(0)}{copy.pctEnrollment}</strong>
              </div>
            )}
            {cityCtx && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.population}</span>
                <strong>{cityCtx.cityPop >= 1 ? `${cityCtx.cityPop.toFixed(1)}M` : `${(cityCtx.cityPop * 1000).toFixed(0)}k`}</strong>
              </div>
            )}
            {cityCtx && (
              <div className="scorecard-overview-card scorecard-overview-card--highlight">
                <span className="scorecard-overview-label">{copy.cityShare}</span>
                <strong>{((cityCtx.cityPop / cityCtx.countryPop) * 100).toFixed(1)}%</strong>
              </div>
            )}
            {city.metrics?.community_birth_rate_optimism?.raw !== null && city.metrics?.community_birth_rate_optimism?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.birthRate}</span>
                <strong>{city.metrics.community_birth_rate_optimism.raw.toFixed(2)}</strong>
              </div>
            )}
            {city.metrics?.pressure_working_time_pressure?.raw !== null && city.metrics?.pressure_working_time_pressure?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.workingHours}</span>
                <strong>{city.metrics.pressure_working_time_pressure.raw.toFixed(1)} hrs/wk</strong>
              </div>
            )}
            {city.metrics?.viability_water_sanitation_utility?.raw !== null && city.metrics?.viability_water_sanitation_utility?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.waterAccess}</span>
                <strong>{city.metrics.viability_water_sanitation_utility.raw.toFixed(0)}%</strong>
              </div>
            )}
            {city.metrics?.viability_digital_infrastructure?.raw !== null && city.metrics?.viability_digital_infrastructure?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.broadband}</span>
                <strong>{city.metrics.viability_digital_infrastructure.raw.toFixed(0)}/100</strong>
              </div>
            )}
            {city.metrics?.viability_climate_sunlight_livability?.raw !== null && city.metrics?.viability_climate_sunlight_livability?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.climateScore}</span>
                <strong>{city.metrics.viability_climate_sunlight_livability.raw.toFixed(0)}/100</strong>
              </div>
            )}
            {city.metrics?.pressure_economic_growth_momentum?.raw !== null && city.metrics?.pressure_economic_growth_momentum?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">{copy.gdpGrowth}{city.metrics.pressure_economic_growth_momentum.dataLevel === "national" ? ` ${copy.nationalData}` : ""}</span>
                <strong>{city.metrics.pressure_economic_growth_momentum.raw >= 0 ? "+" : ""}{city.metrics.pressure_economic_growth_momentum.raw.toFixed(1)}%</strong>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── City Peers ── */}
      {isPublished && peers.length > 0 && (
        <section className="section scorecard-peers">
          <div className="scorecard-peers-header">
            <p className="eyebrow">{copy.peersEyebrow}</p>
            <h2 className="scorecard-peers-title">{copy.peersTitle}</h2>
          </div>
          <div className="scorecard-peers-grid">
            {peers.map(({ city: peer, tags }) => (
              <a
                key={peer.cityId}
                className="scorecard-peer-card"
                href={appHref(`/city/${peer.cityId}`)}
                onClick={(e) => navigateLink(e, onNavigate, `/city/${peer.cityId}`)}
              >
                <div className="scorecard-peer-rank">#{peer.rank}</div>
                <div className="scorecard-peer-name">{peer.displayName}</div>
                <div className="scorecard-peer-country">{peer.country}</div>
                <div className="scorecard-peer-score">{peer.slicScore.toFixed(1)}</div>
                {(() => {
                  const pCtx = CITY_CONTEXT[peer.cityId];
                  return pCtx ? (
                    <div className="scorecard-peer-pop">{pCtx.cityPop >= 1 ? `${pCtx.cityPop.toFixed(1)}M` : `${(pCtx.cityPop * 1000).toFixed(0)}k`} · {pCtx.industries.slice(0, 2).map((i) => INDUSTRY_LABELS[locale][i] ?? i).join(", ")}</div>
                  ) : null;
                })()}
                {tags.length > 0 && (
                  <div className="scorecard-peer-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="scorecard-peer-tag">{getPeerTagLabel(tag, locale)}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
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
            {/* Coverage breakdown by data level */}
            {(() => {
              const counts: Record<string, number> = { city: 0, national: 0, derived: 0, missing: 0 };
              Object.values(city.metrics ?? {}).forEach((m) => {
                const lvl = m.dataLevel ?? "missing";
                counts[lvl] = (counts[lvl] ?? 0) + 1;
              });
              const items: Array<{ key: string; label: string; count: number }> = [
                { key: "city",     label: copy.coverageCityDirect,    count: counts.city ?? 0 },
                { key: "national", label: copy.coverageNationalProxy, count: counts.national ?? 0 },
                { key: "derived",  label: copy.coverageDerived,       count: counts.derived ?? 0 },
                { key: "missing",  label: copy.coverageMissing,       count: counts.missing ?? 0 },
              ].filter((i) => i.count > 0);
              return (
                <div className="scorecard-coverage-breakdown">
                  <span className="scorecard-coverage-breakdown-title">{copy.coverageBreakdownTitle}</span>
                  <div className="scorecard-coverage-breakdown-items">
                    {items.map((i) => (
                      <span key={i.key} className={`scorecard-coverage-item scorecard-coverage-item--${i.key}`}>
                        {i.count} {i.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
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
