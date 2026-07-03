import publishedRankingData from "./data/publishedRankingData.json";
import type { CoreLocale } from "./i18n";
import { getDisplayAlphaCityExclusions, PUBLIC_TIER_RULES } from "./publicTierPolicy.js";
import type { Locale, MethodologyData, MethodologyReference, SourceTier, WorksheetColumn } from "./types";
import { methodologyDataKo } from "./methodologyDataKo";
import { methodologyDataJa } from "./methodologyDataJa";
import { localizedInputs } from "./methodologyTranslations";


interface MethodologyPublishedCity {
  displayName: string;
  country: string;
  region: string;
  rank: number;
  tierLabel: "Alpha" | "Beta" | "Gamma" | null;
  coverageGrade: string;
  slicScore: number;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
}

interface MethodologyWorkedExampleFact {
  displayName?: string;
  country?: string;
  disposableIncomeRaw?: number | null;
  pillarScores?: {
    pressure?: number | null;
    viability?: number | null;
    capability?: number | null;
    community?: number | null;
    creative?: number | null;
  };
  safety?: {
    raw?: number | null;
    p05?: number | null;
    p95?: number | null;
    scoreExact?: number | null;
    scoreRounded?: number | null;
  };
  pressure?: {
    terms?: Array<{
      key: string;
      label: string;
      weight: number;
      scoreExact?: number | null;
      scoreRounded?: number | null;
    }>;
    denominator?: number | null;
    scoreExact?: number | null;
    scoreRounded?: number | null;
  };
  overall?: {
    weightedMeanExact?: number | null;
    weightedVarianceExact?: number | null;
    ampiExact?: number | null;
    slicScoreExact?: number | null;
    slicScoreRounded?: number | null;
    coverageExact?: number | null;
    coverageRounded?: number | null;
    coverageGrade?: string | null;
    coveragePenalty?: number | null;
  };
  weightedMeanTerms?: Array<{
    pillar: string;
    weight: number;
    scoreExact?: number | null;
    scoreRounded?: number | null;
  }>;
}

interface MethodologyFacts {
  workedExample?: MethodologyWorkedExampleFact;
}

const publishedCities = (publishedRankingData.cities ?? []) as MethodologyPublishedCity[];
const methodologyFacts = ((publishedRankingData as { methodologyFacts?: MethodologyFacts }).methodologyFacts ?? {}) as MethodologyFacts;
const workedExample = methodologyFacts.workedExample;
const singaporeCity = publishedCities.find((city) => city.displayName === "Singapore");
const bangkokCity = publishedCities.find((city) => city.displayName === "Bangkok");

function formatOneDecimal(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(1) : "—";
}

function formatTwoDecimals(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(2) : "—";
}

function formatThreeDecimals(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(3) : "—";
}

const officialSlicFormula = "SLIC(c) = max(0, AMPI_5pillar(c) - penalty(c))";
const officialAmpiFormula =
  "mu(c) = (25 Pressure + 22 Viability + 18 Capability + 15 Community + 20 Creative) / 100\n" +
  "var(c) = (25(Pressure - mu)^2 + 22(Viability - mu)^2 + 18(Capability - mu)^2 + 15(Community - mu)^2 + 20(Creative - mu)^2) / 100\n" +
  "AMPI_5pillar(c) = mu(c) - var(c)/mu(c)";
const growthPillarFormula =
  "Growth(c) = (8 DI_PPP + 5 HousingBurden + 2 DebtBurden + 4 WorkingTimePressure + 4 SuicideMentalStrain + 2 HankeMisery) / Sum observed weights";
const toleranceCompositeFormula =
  "TolerancePluralism(c) = 0.4 EqualdexCountry + 0.3 FreedomHouseCountry + 0.3 ReverseHateCrime";
const economicVitalityFormula =
  "EconomicVitality(c) = 0.5 InvestmentSignal + 0.3 GDPperCapitaPPP + 0.2 GDPGrowth";

const workedExampleDisplayName = workedExample?.displayName ?? "Kaohsiung";
const workedExampleSafetyFormula =
  workedExample?.safety?.raw != null &&
  workedExample?.safety?.p05 != null &&
  workedExample?.safety?.p95 != null
    ? `SafetyScore = 100 x (${formatTwoDecimals(workedExample.safety.p95)} - ${workedExample.safety.raw}) / (${formatTwoDecimals(workedExample.safety.p95)} - ${formatTwoDecimals(workedExample.safety.p05)})`
    : "SafetyScore = 100 x (P95 - raw) / (P95 - P05)";
const workedExamplePressureFormula =
  workedExample?.pressure?.terms && workedExample.pressure.terms.length > 0 && workedExample?.pressure?.denominator
    ? `Growth = (${workedExample.pressure.terms.map((term) => `${term.weight}x${formatOneDecimal(term.scoreRounded ?? undefined)}`).join(" + ")}) / ${workedExample.pressure.denominator}`
    : "Growth = (weighted pressure numerator) / observed pressure weights";
const workedExampleMeanFormula =
  workedExample?.weightedMeanTerms && workedExample.weightedMeanTerms.length > 0
    ? `mu = (${workedExample.weightedMeanTerms.map((term) => `${term.weight}x${formatOneDecimal(term.scoreRounded ?? undefined)}`).join(" + ")}) / 100 = ${formatThreeDecimals(workedExample?.overall?.weightedMeanExact ?? undefined)}\n` +
      `var = (25(Pressure-mu)^2 + 22(Viability-mu)^2 + 18(Capability-mu)^2 + 15(Community-mu)^2 + 20(Creative-mu)^2) / 100 = ${formatTwoDecimals(workedExample?.overall?.weightedVarianceExact ?? undefined)}`
    : "mu = weighted pillar mean\nvar = weighted pillar variance";
const workedExampleAmpiFormula =
  workedExample?.overall
    ? `AMPI = mu - var/mu = ${formatThreeDecimals(workedExample.overall.weightedMeanExact ?? undefined)} - ${formatTwoDecimals(workedExample.overall.weightedVarianceExact ?? undefined)}/${formatThreeDecimals(workedExample.overall.weightedMeanExact ?? undefined)} = ${formatThreeDecimals(workedExample.overall.ampiExact ?? undefined)}\n` +
      `Coverage = ${formatTwoDecimals(workedExample.overall.coverageRounded ?? undefined)} -> grade ${workedExample.overall.coverageGrade ?? "—"} -> penalty = ${workedExample.overall.coveragePenalty ?? 0}\n` +
      `SLIC = ${formatOneDecimal(workedExample.overall.slicScoreRounded ?? undefined)}`
    : "AMPI = mu - var/mu\nCoverage -> grade -> penalty\nSLIC = published score";
const workedExampleDiRaw = workedExample?.disposableIncomeRaw != null ? workedExample.disposableIncomeRaw.toFixed(2) : "—";
const alphaCountryExclusionList = (PUBLIC_TIER_RULES.alphaCountryExclusions ?? []).join(", ") || "none";
const alphaCityExclusionList = getDisplayAlphaCityExclusions().join(", ") || "none";
const maxJapanCrossTier = PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1;

const englishTierProtocolRule =
  `Published ordinal rank is pure SLIC score order computed from the exact unrounded score fields. Alpha, Beta, and Gamma are a separate public overlay applied after ranking, not hidden inside rank itself. ` +
  `The overlay allows one city per country across all three public tiers, except Taiwan may hold ${PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers} public-tier slots and Japan may hold ${maxJapanCrossTier} public-tier slots in the live protocol. Alpha requires Community >= ${PUBLIC_TIER_RULES.alphaMinCommunity}, Pressure >= ${PUBLIC_TIER_RULES.alphaMinPressure}, and coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}; missing stress inputs cannot be converted into a top-shelf claim. Europe is capped at ${PUBLIC_TIER_RULES.maxEuropeInAlpha} Alpha seats, Oceania capped at ${PUBLIC_TIER_RULES.maxOceaniaInAlpha}, South Korea capped at ${PUBLIC_TIER_RULES.maxSouthKoreaInAlpha}, Japan capped at ${PUBLIC_TIER_RULES.maxJapanInAlpha}; ${alphaCountryExclusionList} excluded from Alpha by country, and ${alphaCityExclusionList} barred from Alpha by editorial cost-of-living rule. ` +
  `Beta keeps the country rule, retains the Taiwan and Japan exceptions, and raises the liveability floor to Community >= ${PUBLIC_TIER_RULES.betaMinCommunity} and Pressure >= ${PUBLIC_TIER_RULES.betaMinPressure}. Gamma then fills from the remaining ranked cities.`;

const englishSingaporeRule =
  singaporeCity && bangkokCity
    ? `Singapore currently holds pure score rank #${singaporeCity.rank} with SLIC ${formatOneDecimal(singaporeCity.slicScore)} and Coverage ${singaporeCity.coverageGrade}, but the public tier overlay places it in ${singaporeCity.tierLabel ?? "no public tier"}. ` +
      `Its Viability (${formatOneDecimal(singaporeCity.viabilityScore)}) and Capability (${formatOneDecimal(singaporeCity.capabilityScore)}) remain elite, yet Community (${formatOneDecimal(singaporeCity.communityScore)}) sits below both the Alpha floor of ${PUBLIC_TIER_RULES.alphaMinCommunity} and the Beta floor of ${PUBLIC_TIER_RULES.betaMinCommunity}; Pressure (${formatOneDecimal(singaporeCity.pressureScore)}) clears Alpha but not Beta. ` +
      `Bangkok is the editorial anchor on the other side: pure score rank #${bangkokCity.rank} with SLIC ${formatOneDecimal(bangkokCity.slicScore)}, yet holds ${bangkokCity.tierLabel ?? "no public-tier seat"} — Community (${formatOneDecimal(bangkokCity.communityScore)}) and Pressure (${formatOneDecimal(bangkokCity.pressureScore)}) still clear the Alpha floor and coverage is ${bangkokCity.coverageGrade}, but every public-tier slot was filled by higher-ranked cities before Bangkok's turn. The tier rules are not gamed to force the anchor city onto the shelf. Separate travel-cost sources reinforce Bangkok's public-facing value proposition, but they remain contextual evidence rather than a scored tourism-affordability bonus.`
    : "Singapore and Bangkok are cited on this page only when their current published rows are available in the live dataset.";

const thaiTierProtocolRule =
  `อันดับที่เผยแพร่เป็นลำดับคะแนน SLIC ล้วน ๆ จากค่าคะแนนแบบ exact ก่อน แล้วค่อยวางชั้น Alpha, Beta และ Gamma เป็นชั้นสาธารณะแยกต่างหาก ไม่ได้ซ่อนอยู่ในตัวเลขอันดับเอง ` +
  `กติกาชั้นสาธารณะให้ได้หนึ่งเมืองต่อหนึ่งประเทศตลอดทั้งสามชั้น โดยยกเว้นไต้หวันที่ถือได้ ${PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers} ที่นั่งและญี่ปุ่นที่ถือได้ ${maxJapanCrossTier} ที่นั่งในโปรโตคอลปัจจุบัน Alpha ต้องมี Community >= ${PUBLIC_TIER_RULES.alphaMinCommunity}, Pressure >= ${PUBLIC_TIER_RULES.alphaMinPressure}, และ coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}; ข้อมูลแรงกดดันที่ขาดอยู่ห้ามถูกแปลงเป็นข้ออ้างระดับสูงสุด ยุโรปมีได้ ${PUBLIC_TIER_RULES.maxEuropeInAlpha} ที่นั่งใน Alpha, โอเชียเนียได้ ${PUBLIC_TIER_RULES.maxOceaniaInAlpha}, เกาหลีใต้ได้ ${PUBLIC_TIER_RULES.maxSouthKoreaInAlpha}, ญี่ปุ่นได้ ${PUBLIC_TIER_RULES.maxJapanInAlpha}; ${alphaCountryExclusionList} ถูกกันออกจาก Alpha ตามประเทศ และ ${alphaCityExclusionList} ถูกกันตามกฎบรรณาธิการเรื่องค่าครองชีพของผู้อยู่อาศัยมัธยฐาน ` +
  `ชั้น Beta ยังคงกติกาประเทศเดียวกันพร้อมข้อยกเว้นของไต้หวันและญี่ปุ่น แต่ยกเพดานความน่าอยู่เป็น Community >= ${PUBLIC_TIER_RULES.betaMinCommunity} และ Pressure >= ${PUBLIC_TIER_RULES.betaMinPressure} ส่วน Gamma จะเติมจากเมืองที่เหลือซึ่งยังติดอันดับอยู่`;

const thaiSingaporeRule =
  singaporeCity && bangkokCity
    ? `สิงคโปร์มีอันดับคะแนนล้วน #${singaporeCity.rank} ด้วย SLIC ${formatOneDecimal(singaporeCity.slicScore)} และ Coverage ${singaporeCity.coverageGrade} แต่ชั้นสาธารณะจัดให้สิงคโปร์อยู่ใน ${singaporeCity.tierLabel ?? "ชั้นนอกกลุ่มสาธารณะ"}. ` +
      `Viability (${formatOneDecimal(singaporeCity.viabilityScore)}) และ Capability (${formatOneDecimal(singaporeCity.capabilityScore)}) ยังสูงมาก แต่ Community (${formatOneDecimal(singaporeCity.communityScore)}) ต่ำกว่าเพดานทั้ง Alpha ${PUBLIC_TIER_RULES.alphaMinCommunity} และ Beta ${PUBLIC_TIER_RULES.betaMinCommunity}; ส่วน Pressure (${formatOneDecimal(singaporeCity.pressureScore)}) ผ่าน Alpha แต่ไม่ผ่าน Beta ` +
      `กรุงเทพฯ เป็นเมืองหลักทางบรรณาธิการในอีกด้านหนึ่ง: อันดับคะแนนล้วน #${bangkokCity.rank} ด้วย SLIC ${formatOneDecimal(bangkokCity.slicScore)} แต่${bangkokCity.tierLabel ? `อยู่ใน ${bangkokCity.tierLabel}` : "ไม่มีชั้นสาธารณะ"} — Community (${formatOneDecimal(bangkokCity.communityScore)}) และ Pressure (${formatOneDecimal(bangkokCity.pressureScore)}) ยังผ่านพื้น Alpha และ coverage เป็น ${bangkokCity.coverageGrade} แต่ทุกชั้นสาธารณะถูกเติมโดยเมืองที่อันดับสูงกว่าก่อนถึงคิวกรุงเทพฯ กติกาชั้นไม่ถูกปรับเพื่อดันเมืองหลักขึ้นชั้น แหล่งข้อมูลต้นทุนการเดินทางแยกต่างหากช่วยยืนยัน value proposition สาธารณะของกรุงเทพฯ แต่เป็นหลักฐานเชิงบริบท ไม่ใช่โบนัสคะแนนด้านท่องเที่ยว`
    : "หน้านี้จะอ้างถึงสิงคโปร์และกรุงเทพฯ ต่อเมื่อมีแถวข้อมูลปัจจุบันของทั้งสองเมืองอยู่ในชุดข้อมูลที่เผยแพร่";

const chineseTierProtocolRule =
  `公开排名先按精确未四舍五入的 SLIC 分数排序，然后再叠加 Alpha、Beta、Gamma 这套独立的公开分层规则，而不是把地理筛选藏进名次本身。` +
  `公开分层在三层合计范围内原则上实行每国一城，但当前协议允许台湾占 ${PUBLIC_TIER_RULES.maxTaiwanAcrossPublicTiers} 个公开层级席位、日本占 ${maxJapanCrossTier} 个公开层级席位。Alpha 要求 Community >= ${PUBLIC_TIER_RULES.alphaMinCommunity}、Pressure >= ${PUBLIC_TIER_RULES.alphaMinPressure}，且覆盖等级达到 ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}；缺失的压力数据不能被换算成最高层级声明。欧洲在 Alpha 最多 ${PUBLIC_TIER_RULES.maxEuropeInAlpha} 城，大洋洲最多 ${PUBLIC_TIER_RULES.maxOceaniaInAlpha} 城，韩国最多 ${PUBLIC_TIER_RULES.maxSouthKoreaInAlpha} 城，日本最多 ${PUBLIC_TIER_RULES.maxJapanInAlpha} 城；${alphaCountryExclusionList} 按国家排除 Alpha，${alphaCityExclusionList} 按编辑可负担规则排除 Alpha。` +
  `Beta 继续执行同样的国家规则与台湾、日本例外，同时把宜居底线提高到 Community >= ${PUBLIC_TIER_RULES.betaMinCommunity} 且 Pressure >= ${PUBLIC_TIER_RULES.betaMinPressure}。Gamma 再从其余已排名城市中补足。`;

const chineseSingaporeRule =
  singaporeCity && bangkokCity
    ? `新加坡当前的纯分数排名是第 ${singaporeCity.rank} 名，SLIC 为 ${formatOneDecimal(singaporeCity.slicScore)}，Coverage 为 ${singaporeCity.coverageGrade}，但公开分层把它放在 ${singaporeCity.tierLabel ?? "公开层级之外"}。` +
      `它的 Viability（${formatOneDecimal(singaporeCity.viabilityScore)}）与 Capability（${formatOneDecimal(singaporeCity.capabilityScore)}）依然很强，但 Community（${formatOneDecimal(singaporeCity.communityScore)}）低于 Alpha 底线 ${PUBLIC_TIER_RULES.alphaMinCommunity}，也低于 Beta 底线 ${PUBLIC_TIER_RULES.betaMinCommunity}；Pressure（${formatOneDecimal(singaporeCity.pressureScore)}）虽过 Alpha 线，却未过 Beta 线。` +
      `曼谷是编辑锚点城市的另一面：纯分数排名第 ${bangkokCity.rank} 名，SLIC 为 ${formatOneDecimal(bangkokCity.slicScore)}，${bangkokCity.tierLabel ? `公开层级为 ${bangkokCity.tierLabel}` : "无公开层级席位"} —— Community（${formatOneDecimal(bangkokCity.communityScore)}）与 Pressure（${formatOneDecimal(bangkokCity.pressureScore)}）仍越过 Alpha 门槛，覆盖等级为 ${bangkokCity.coverageGrade}，但所有公开层级席位在轮到曼谷之前已被更高排名城市占满。层级规则不会为锚点城市破例。独立旅行成本来源进一步支持曼谷的公开价值叙事，但它们只是背景证据，不是旅游可负担性的计分加成。`
    : "只有在实时公开数据中能够找到新加坡与曼谷的当前行时，本页才会引用这两个城市。";


const methodologyReferences: MethodologyReference[] = [
  {
    id: 1,
    label: "Smart and Livable City Index Methodology Benchmarking",
    publisher: "Internal benchmarking memo",
    note: "Landscape scan of existing ranking systems and their biases; supplied locally for this project.",
  },
  {
    id: 2,
    label: "About the Indicators API Documentation",
    publisher: "World Bank Data Help Desk",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
    note: "Official programmatic access point for World Bank indicators, including GDP, Gini, and PPP series.",
  },
  {
    id: 3,
    label: "GHO OData API",
    publisher: "World Health Organization",
    url: "https://www.who.int/data/gho/info/gho-odata-api",
    note: "Official WHO API for mortality, suicide, health, and related indicators.",
  },
  {
    id: 4,
    label: "ILOSTAT SDMX User Guide",
    publisher: "International Labour Organization",
    url: "https://www.ilo.org/resource/other/ilostat-sdmx-user-guide",
    note: "Official labour-statistics API guidance used for working time, labour structure, and NEET-style inputs.",
  },
  {
    id: 5,
    label: "Data",
    publisher: "WHO/UNICEF Joint Monitoring Programme",
    url: "https://washdata.org/data",
    note: "Official WASH data portal used for safely managed water and sanitation indicators.",
  },
  {
    id: 6,
    label: "UIS Data Browser",
    publisher: "UNESCO Institute for Statistics",
    url: "https://databrowser.uis.unesco.org/",
    note: "Official source for comparable education, science, and culture indicators.",
  },
  {
    id: 7,
    label: "OECD Affordable Housing Database",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/datasets/oecd-affordable-housing-database.html",
    note: "Cross-national housing affordability, housing conditions, and housing-policy indicators.",
  },
  {
    id: 8,
    label: "OECD Health Statistics",
    publisher: "OECD",
    url: "https://www.oecd.org/health/health-data.htm",
    note: "Official comparative health-system and healthcare-quality indicators.",
  },
  {
    id: 9,
    label: "PISA Dashboard",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/dashboards/pisa-education-and-skills.html",
    note: "Learning-outcome evidence used for education-quality benchmarking.",
  },
  {
    id: 10,
    label: "Methodology",
    publisher: "World Bank Entrepreneurship Database",
    url: "https://www.worldbank.org/en/programs/entrepreneurship/methodology",
    note: "Official new-business-density methodology used for entrepreneurship and business-formation inputs.",
  },
  {
    id: 11,
    label: "OpenAQ REST API",
    publisher: "OpenAQ",
    url: "https://api.openaq.org/",
    note: "Open global air-quality data and API access for city-level environmental quality proxies.",
  },
  {
    id: 12,
    label: "OECD Definition of Cities and Functional Urban Areas",
    publisher: "OECD",
    url: "https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html",
    note: "Core city-boundary logic for SLIC's functional urban area approach.",
  },
  {
    id: 13,
    label: "What is Measurement Lab?",
    publisher: "M-Lab",
    url: "https://www.measurementlab.net/about/",
    note: "Open internet-performance data source supporting broadband quality proxies.",
  },
  {
    id: 14,
    label: "Home | Gender Data Portal",
    publisher: "World Bank Gender Data Portal",
    url: "https://genderdata.worldbank.org/",
    note: "Official gender-gap and opportunity dataset used in equal-opportunity scoring.",
  },
  {
    id: 15,
    label: "About | World Bank Human Capital",
    publisher: "World Bank Human Capital Data Portal",
    url: "https://humancapital.worldbank.org/en/about",
    note: "Human-capital evidence base for health, education, labour, and skills context.",
  },
  {
    id: 16,
    label: "Intellectual Property Statistics",
    publisher: "World Intellectual Property Organization",
    url: "https://www.wipo.int/web/ip-statistics",
    note: "Official IP statistics used as an innovation and research proxy.",
  },
  {
    id: 17,
    label: "Copernicus Atmosphere Monitoring Service",
    publisher: "Copernicus / CAMS",
    url: "https://atmosphere.copernicus.eu/",
    note: "Official atmosphere service used as an aerosol and air-quality evidence layer for regional pollution context.",
  },
  {
    id: 18,
    label: "Sentinel-5P mission documentation",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel5P.html",
    note: "Official atmospheric-composition documentation used to explain aerosol, nitrogen dioxide, and wider urban airshed context.",
  },
  {
    id: 19,
    label: "Sentinel-2 collection overview",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-2",
    note: "Official land-observation source for vegetation, surface condition, and urban land-cover context.",
  },
  {
    id: 20,
    label: "Global NDVI 300 m documentation",
    publisher: "Copernicus Data Space Ecosystem",
    url: "https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/clms/bio-geophysical-parameters/vegetation/vegetation-indices/ndvi_global_300m_10daily_v3.html",
    note: "Official Copernicus vegetation-index documentation used to explain greenness and ecological buffering layers.",
  },
  {
    id: 21,
    label: "Earth observation data portal overview",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/eo-knowledge/data-portal/index.html",
    note: "JAXA overview of accessible Earth-observation products used in SLIC's remote-sensing source ladder.",
  },
  {
    id: 22,
    label: "G-Portal",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/gpr/",
    note: "JAXA portal used to access satellite-derived land and environmental layers when city sensor coverage is thin.",
  },
  {
    id: 23,
    label: "Vegetation products",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/data/products/vegetation/index.html",
    note: "Official JAXA vegetation products used to describe greenness and land-surface context around cities.",
  },
  {
    id: 24,
    label: "ALOS forest / non-forest map",
    publisher: "JAXA",
    url: "https://earth.jaxa.jp/en/data/2555/index.html",
    note: "ALOS-derived forest and non-forest mapping used as a wider ecological-context layer where relevant.",
  },
  {
    id: 25,
    label: "Landsat vegetation index documentation",
    publisher: "USGS",
    url: "https://www.usgs.gov/landsat-missions/landsat-normalized-difference-vegetation-index",
    note: "Open Landsat-derived vegetation guidance supporting greenness, land-cover, and environmental context analysis.",
  },
  {
    id: 26,
    label: "Less Is More: Thailand’s Citizen-Centric Approach to Smart, Livable Cities",
    publisher: "Smart City Magazine: Special Edition, Smart City Expo Miami 2024 / Smart Cities Americas",
    url: "https://www.smartcitymiami.com/",
    note: "Citizen-centric smart-city framing that informs SLIC's emphasis on lived quality, public value, and practical urban outcomes over prestige branding.",
  },
  {
    id: 27,
    label: "Effective Soft Power: How Media can Help Cities Harness Smart Technology for Societal Change",
    publisher: "Thai Media Fund Journal 2(2)",
    note: "Media, narrative, and public communication research informing how SLIC treats visibility, discourse, and the role of urban storytelling in social change.",
  },
  {
    id: 28,
    label: "Smart City Primer",
    publisher: "C-asean and US Embassy Bangkok",
    note: "Foundational primer on practical smart-city concepts and methods used as part of the broader research base behind SLIC.",
  },
  {
    id: 29,
    label: "Harnessing Digital Connectivity for Sustainable Cities in ASEAN",
    publisher: "The ASEAN Magazine",
    url: "https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/",
    note: "ASEAN-focused framing on digital connectivity, sustainability, and urban development that supports SLIC's regional methodology logic.",
  },
  {
    id: 30,
    label: "Smart City Initiatives in Thailand: Key Concepts and Methods",
    publisher: "Hitachi Review 70",
    note: "Thailand smart-city methods reference supporting the operational and conceptual framing used in SLIC's city-assessment architecture.",
  },
  {
    id: 31,
    label: "Bangkok’s Urban Presence: Toward the Future of Smart Urbanity (Exhibition Entry)",
    publisher: "2019 Seoul Biennale of Architecture and Urbanism: Collective City Guidebook",
    note: "Public-facing urban research on Bangkok's future smart urbanity, informing SLIC's interest in lived form, visibility, and metropolitan presence.",
  },
  {
    id: 32,
    label: "Gentrification and Its Contentment: An Anthropological Perspective on Housing, Heritage and Urban Social Change in Shanghai",
    publisher: "Urban Studies 55(7)",
    url: "https://doi.org/10.1177/0042098016684313",
    note: "Urban social-change and housing research that informs SLIC's treatment of heritage, displacement pressure, and non-economic urban value.",
  },
  {
    id: 33,
    label: "Mobility in a Global City: Making Sense of Shanghai’s Growing Automobile-Dominated Transport Culture",
    publisher: "Urban Studies 54(10)",
    url: "https://doi.org/10.1177/0042098016637568",
    note: "Mobility and transport-culture research supporting SLIC's interpretation of friction, movement, and car-dominated urban tradeoffs.",
  },
  {
    id: 34,
    label: "World Weather Information Service: Climate Normals",
    publisher: "World Meteorological Organization",
    url: "https://worldweather.wmo.int/",
    note: "Official WMO climate normals used for sunshine hours, temperature comfort, and extreme weather frequency in the climate and sunlight livability metric.",
  },
  {
    id: 35,
    label: "Fertility Rate, Total (births per woman)",
    publisher: "World Bank",
    url: "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN",
    note: "Official World Bank total fertility rate data used as a societal optimism proxy in the Community pillar.",
  },
  {
    id: 36,
    label: "133 World Cities Ranked Cheapest to Most Expensive: Backpacker Index for 2025",
    publisher: "Price of Travel",
    url: "https://www.priceoftravel.com/cheapest-places-visit",
    note: "Travel-value benchmark used only as contextual evidence; Bangkok appears among the cheaper global major destinations in the 2025 backpacker cost ranking.",
  },
  {
    id: 37,
    label: "Bangkok Travel Cost",
    publisher: "Budget Your Trip",
    url: "https://www.budgetyourtrip.com/thailand/bangkok",
    note: "Structured travel-cost breakdown from traveler budgets used only to corroborate low everyday visitor costs; it does not enter SLIC scoring.",
  },
];

const worksheetColumns: WorksheetColumn[] = [
  {
    field: "city_fua",
    purpose: "Functional urban area name used as the scoring unit.",
    source: "OECD FUA or adapted FUA rule",
  },
  {
    field: "country",
    purpose: "Country context anchor for PPP, Gini, tax, and macro indicators.",
    source: "World Bank / OECD",
  },
  {
    field: "gdp_per_capita_ppp",
    purpose: "Productive context input within Business and Growth.",
    source: "World Bank WDI",
  },
  {
    field: "gdp_growth",
    purpose: "Macro momentum context for economic vitality.",
    source: "World Bank WDI",
  },
  {
    field: "gini_coefficient",
    purpose: "Inequality input for equal opportunity and distributional fairness.",
    source: "World Bank WDI or official national statistics",
  },
  {
    field: "tax_rate_assumption",
    purpose: "User-supplied effective tax adjustment for disposable-income calculations.",
    source: "SLIC analyst input",
  },
  {
    field: "ppp_private_consumption",
    purpose: "PPP conversion term for cross-city money comparisons.",
    source: "World Bank PPP indicator",
  },
  {
    field: "median_gross_income",
    purpose: "Base income input before tax and essential-cost deductions.",
    source: "City, metro, or national labour surveys",
  },
  {
    field: "essential_costs_bundle",
    purpose: "Rent, utilities, internet, transport, and food basket total.",
    source: "Official data first, audited secondary fallback",
  },
  {
    field: "pressure_metrics",
    purpose: "Debt, working hours, suicide, and commute burden inputs.",
    source: "ILO, WHO, OECD, official national or subnational data",
  },
  {
    field: "viability_metrics",
    purpose: "Safety, air, water, transit, digital infrastructure, and climate/sunlight livability inputs.",
    source: "WHO, JMP, OpenAQ, CAMS, M-Lab, WMO, city open data",
  },
  {
    field: "remote_sensing_context",
    purpose: "Satellite aerosol, vegetation, land-cover, and ecological-context layer used when the urban frame is wider than the ground-sensor net.",
    source: "Copernicus CAMS, Sentinel-2/Sentinel-5P, JAXA, Landsat-derived public products",
  },
  {
    field: "capability_metrics",
    purpose: "Healthcare quality, education quality, and equal-opportunity inputs.",
    source: "WHO, OECD, UNESCO UIS, World Bank",
  },
  {
    field: "community_metrics",
    purpose: "Hospitality, tolerance, public-life, birth rate optimism, and adjusted visitor-flow inputs.",
    source: "Policy records, open data, social listening, testimony audit, World Bank TFR",
  },
  {
    field: "creative_metrics",
    purpose: "Business opening ease, stability, tax regime, incentives, and productive momentum.",
    source: "World Bank Entrepreneurship, WIPO, local investment data, analyst tax inputs",
  },
  {
    field: "coverage_and_output",
    purpose: "Coverage grade, pillar scores, and final SLIC score.",
    source: "SLIC model output",
  },
];

const englishSourceTiers: SourceTier[] = [
  {
    tier: "Tier 1",
    title: "City and metro official data",
    description: "Open-data portals, utility regulators, transit feeds, hospital releases, and city statistical offices.",
  },
  {
    tier: "Tier 2",
    title: "State, province, and subnational official data",
    description: "Regional statistical offices, metropolitan observatories, and subnational administrative datasets.",
  },
  {
    tier: "Tier 3",
    title: "National and international official datasets",
    description: "World Bank, WHO, ILO, UNESCO UIS, OECD, WIPO, and WHO/UNICEF JMP.",
  },
  {
    tier: "Tier 4",
    title: "Audited secondary and experimental layers",
    description: "OpenAQ, Copernicus CAMS, Sentinel-2 / Sentinel-5P context, JAXA land products, Landsat-derived vegetation layers, M-Lab, social listening, crowdsourced cost layers, and city testimony with visible caveats.",
  },
  {
    tier: "Tier 5",
    title: "Analyst assessment and cross-reference",
    description: "SLIC analyst manual assessment based on lived experience, cross-reference research, and domain expertise. Used for tolerance, hospitality, cultural life, and other qualitative signals that resist pure data capture.",
  },
];

const thaiSourceTiers: SourceTier[] = [
  {
    tier: "ชั้นที่ 1",
    title: "ข้อมูลทางการระดับเมืองและมหานคร",
    description: "พอร์ทัลข้อมูลเปิด หน่วยงานสาธารณูปโภค ข้อมูลขนส่ง โรงพยาบาล และสำนักงานสถิติของเมืองโดยตรง",
  },
  {
    tier: "ชั้นที่ 2",
    title: "ข้อมูลทางการระดับรัฐ จังหวัด หรือภูมิภาค",
    description: "สำนักงานสถิติระดับภูมิภาค หอดูข้อมูลมหานคร และฐานข้อมูลการบริหารระดับรองลงมา",
  },
  {
    tier: "ชั้นที่ 3",
    title: "ชุดข้อมูลทางการระดับชาติและระหว่างประเทศ",
    description: "World Bank, WHO, ILO, UNESCO UIS, OECD, WIPO และ WHO/UNICEF JMP",
  },
  {
    tier: "ชั้นที่ 4",
    title: "ชั้นข้อมูลรองและชั้นทดลองที่ผ่านการตรวจสอบ",
    description: "OpenAQ, Copernicus CAMS, ข้อมูลบริบท Sentinel-2 / Sentinel-5P, ผลิตภัณฑ์ที่ดินของ JAXA, ชั้น vegetation จาก Landsat, M-Lab, social listening, ชั้นข้อมูลค่าครองชีพ และ testimony ที่มี caveat ชัดเจน",
  },
  {
    tier: "ชั้นที่ 5",
    title: "การประเมินของนักวิเคราะห์และการอ้างอิงข้าม",
    description: "การประเมินด้วยตนเองของนักวิเคราะห์ SLIC จากประสบการณ์จริง การวิจัยอ้างอิงข้าม และความเชี่ยวชาญเฉพาะด้าน",
  },
];

const chineseSourceTiers: SourceTier[] = [
  {
    tier: "第1层",
    title: "城市与都会区官方数据",
    description: "城市开放数据平台、公用事业监管、交通供给、医院质量发布与城市统计部门。",
  },
  {
    tier: "第2层",
    title: "州、省与次国家官方数据",
    description: "区域统计机构、都会观察站，以及省州级行政数据集。",
  },
  {
    tier: "第3层",
    title: "国家与国际官方数据",
    description: "World Bank、WHO、ILO、UNESCO UIS、OECD、WIPO 与 WHO/UNICEF JMP。",
  },
  {
    tier: "第4层",
    title: "经审计的二级与实验层数据",
    description: "OpenAQ、Copernicus CAMS、Sentinel-2 / Sentinel-5P 背景层、JAXA 土地产品、Landsat 植被派生层、M-Lab、社交聆听、众包生活成本层，以及带有明示 caveat 的城市证词。",
  },
  {
    tier: "第5层",
    title: "分析师评估与交叉参考",
    description: "SLIC分析师基于实际经验、交叉参考研究和专业知识的人工评估。",
  },
];


const coreMethodologyContent: Record<CoreLocale, MethodologyData> = {
  en: {
    hero: {
      eyebrow: "Methodology paper",
      title: "The SLIC methodology",
      strapline:
        "V3: A diagnostic model that shows how the numbers are built.",
      intro:
        "V1 was a spreadsheet that put Busan at #1. V2 launched on stage in Taipei and got city leaders asking: can you do this for my city? V3 tightened the measurement logic. Every number is now tied back to declared inputs, scored terms are separated from visible diagnostics, cross-pillar imbalance is penalized explicitly through AMPI, and the workbench lets readers test different weight profiles without confusing those experiments for the published rank. The model is open. The formula is declared. Every city number can be audited.",
      doctrineTitle: "V3 Doctrine",
      doctrineBody:
        "SLIC treats a city as a lived system, not only as a brand or balance sheet. The model tracks affordability, safety, cultural/public life, tolerance, growth conditions, and the practical room people have to live.",
      contextTitle: "Country-context inputs",
      contextItems: [
        "GDP per capita (PPP)",
        "GDP growth",
        "Gini coefficient",
        "User-supplied tax rate",
        "PPP private consumption factor",
      ],
      explicitTitle: "What the public formula makes explicit",
      explicitItems: [
        "Safety is scored by outcomes, not surveillance intensity.",
        "Tolerance is scored through low-friction coexistence and equal market access.",
        "Business dynamism is scored explicitly, while macro context stays visible and bounded rather than dominating silently.",
      ],
    },
    readerGuide: {
      eyebrow: "Reader guide",
      title: "Readable for the public, reproducible for analysts",
      summary:
        "The methodology has to serve two audiences at once: people who want the argument in plain language, and people who want to run the score for their own city universe.",
      layTitle: "Plain-language reading path",
      technicalTitle: "Technical replication path",
      laySteps: [
        "Read the five pillars as five public questions: affordability, daily viability, capability, belonging, and creative/economic momentum.",
        "Treat technology as an enabling layer. It matters when it improves measurable daily conditions.",
        "Read high-cost cities alongside their pressure terms. Institutional strength does not erase housing or time pressure.",
        "Read secondary cities through the same declared thresholds. Lower visibility does not remove them from the measurement frame.",
      ],
      technicalSteps: [
        "Define the city as a functional urban area or the closest defensible metro unit.",
        "Collect city data first, then subnational, then national fallback data, and record source tier for each metric.",
        "Compute tax-adjusted PPP disposable room before any scoring; salary alone is not enough.",
        "Winsorize at the 5th and 95th percentiles, normalize to 0-100, reverse-score harmful metrics, separate scored metrics from visible diagnostics, and publish coverage grades with the ranking.",
      ],
    },
    critiqueSection: {
      eyebrow: "Why legacy rankings fail",
      title: "The gap SLIC is trying to close",
      summary:
        "Existing city indices are useful to study, but many of them encode a city theory that differs from SLIC's declared measurement frame.",
    },
    critiques: [
      {
        title: "Prestige is often mistaken for livability",
        body:
          "Many rankings structurally lift already rich, highly formal cities by rewarding institutional polish, spending, and brand legibility.",
        implication:
          "SLIC separates lived viability from city prestige and treats GDP per capita as context, not destiny.",
        citations: [1, 2, 14],
      },
      {
        title: "Data scarcity hides underrated cities before scoring begins",
        body:
          "Secondary cities are often missing because the benchmark architecture only accepts cities with convenient pre-existing datasets.",
        implication:
          "SLIC keeps a watchlist, publishes coverage grades, and uses a visible source ladder instead of quietly dropping cities.",
        citations: [1, 14, 15],
      },
      {
        title: "Safety is too often inferred from smart instruments",
        body:
          "Apps, dashboards, and surveillance hardware can be visible while the lived city remains unsafe or coercive.",
        implication:
          "SLIC scores harm, victimization, and daily confidence directly; cameras do not score points by themselves.",
        citations: [1, 11, 13],
      },
      {
        title: "Pressure is usually under-measured",
        body:
          "Disposable income after essentials, debt, working hours, and suicide are central to real city life but often treated as secondary or absent altogether.",
        implication:
          "SLIC gives pressure and room to live its own full public weight.",
        citations: [1, 2, 3, 7],
      },
      {
        title: "Visitor volume is informative but not automatically good",
        body:
          "Heavy tourism can coexist with crowding, crime, or extractive urban conditions.",
        implication:
          "SLIC uses travel demand as a contextual cultural-demand signal that must survive safety, ecology, and civic-pressure checks.",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "Method validation",
      title: "The model was stress-tested in rooms, panels, and workshops",
      summary:
        "SLIC is not a one-shot spreadsheet. The framework was repeatedly explained, challenged, and revised in live sessions before it was frozen into a public formula.",
      figures: [
        {
          id: "process-stage",
          src: "/photos/report-people-stage.jpg",
          alt: "People on stage during a public city event.",
          caption: "The framework had to survive public presentation, not just private drafting.",
          width: 1440,
          height: 1440,
        },
        {
          id: "process-meeting",
          src: "/photos/report-people-meeting.jpg",
          alt: "Participants meeting around a table with laptops and microphones.",
          caption: "Assumptions were tested in working meetings where data choices and city logic had to be defended.",
          width: 1439,
          height: 1085,
        },
        {
          id: "process-workshop",
          src: "/photos/report-people-workshop.jpg",
          alt: "A workshop with a speaker presenting to a seated audience.",
          caption: "Pilot discussions helped separate good-looking indicators from indicators that actually explain urban life.",
          width: 2048,
          height: 1365,
        },
      ],
    },
    flowSection: {
      eyebrow: "Score flow",
      title: "How raw indicators become a public SLIC score",
      summary:
        "The score flow is deliberately short and inspectable: raw metrics, normalized metric scores, pillar aggregation, then final weighted score.",
      stages: [
        {
          id: "raw",
          title: "Raw indicators",
          body: "Collect city, metro, subnational, and national signals with visible source tiers.",
          formula: "x_m(c)",
        },
        {
          id: "normalized",
          title: "Normalization",
          body: "Winsorize at P5/P95, scale to 0-100, and reverse-score harmful variables.",
          formula: "s_m(c)",
        },
        {
          id: "pillars",
          title: "Pillar aggregation",
          body: "Combine metric scores into public pillars with declared internal weights.",
          formula: "P_p(c) = Sum observed alpha_(p,m) x s_m(c) / Sum observed alpha_(p,m)",
        },
        {
          id: "final",
          title: "Final score",
          body: "Apply one fixed public equation and attach a coverage grade.",
          formula: "SLIC(c)",
        },
      ],
    },
    remoteSensingSection: {
      eyebrow: "Remote-sensing layer",
      title: "Satellite evidence widens the urban frame when ground sensors are too sparse",
      summary:
        "SLIC uses remote sensing to widen spatial coverage, especially when city monitoring stations are too few, too localized, or too uneven to describe the full urban airshed or ecological edge. Satellite layers are supporting evidence, not magic truth.",
      quantifyTitle: "What satellite layers help quantify",
      quantifyItems: [
        "Aerosol load and atmospheric composition across the wider urban airshed",
        "Vegetation and greenness buffering through NDVI-style land products",
        "Land cover, moisture, and surface context around dense built form",
        "Regional pollution drift that local station networks may miss",
      ],
      qualifyTitle: "What analysts still have to qualify",
      qualifyItems: [
        "Topography, coastline, wind flow, and seasonal smoke pathways",
        "The difference between a local hotspot and a citywide condition",
        "Urban form, street canyons, and how residents actually experience exposure",
        "Ground truth from official environmental records, testimony, and city evidence",
      ],
      workflowTitle: "How the satellite layer enters the method",
      workflowStages: [
        {
          id: "remote-official",
          title: "Official city and environmental records",
          body: "Ground sensors, utility reports, air-quality records, and official environmental releases remain the primary layer wherever available.",
        },
        {
          id: "remote-context",
          title: "Remote-sensing correction and context",
          body: "Copernicus, JAXA, and open Landsat-derived layers widen the frame for aerosol transport, vegetation cover, land stress, and the ecological edge of the city.",
        },
        {
          id: "remote-listening",
          title: "Social listening and city testimony",
          body: "Resident complaints, visitor testimony, and discussion intensity help identify whether mapped conditions are actually felt in the lived city.",
        },
        {
          id: "remote-judgement",
          title: "Final city judgement",
          body: "SLIC analysts read all three layers together so satellite evidence supports judgement instead of pretending to replace it.",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "Mathematical core",
      title: "The official equation stack",
      summary:
        "The public score uses fixed weights, declared directionality, and formulaic transparency. Every displayed equation is part of the real method, not decorative math.",
      groups: [
        {
          id: "official",
          eyebrow: "Public score",
          title: "Official published formula",
          summary:
            "This is the exact public score logic shown on the site and carried into the workbook.",
          equations: [
            {
              id: "official-score",
              title: "Official SLIC score",
              formula:
                "SLIC(c) = max(0, AMPI_5pillar(c) - penalty(c))",
              explanation:
                "The published score is a weighted AMPI across the five visible pillars, not a simple weighted average. The variance term makes cross-pillar imbalance expensive: a city with one broken pillar is pulled down even when other pillars are strong.",
              citations: [1],
            },
            {
              id: "official-ampi",
              title: "Expanded AMPI form",
              formula:
                "mu(c) = (25 Pressure + 22 Viability + 18 Capability + 15 Community + 20 Creative) / 100\nvar(c) = (25(Pressure - mu)^2 + 22(Viability - mu)^2 + 18(Capability - mu)^2 + 15(Community - mu)^2 + 20(Creative - mu)^2) / 100\nAMPI_5pillar(c) = mu(c) - var(c)/mu(c)",
              explanation:
                "The published scorer first computes the weighted pillar mean, then subtracts a weighted cross-pillar variance penalty divided by that mean. This is the mathematical step that makes one-dimensional city profiles expensive.",
              citations: [1],
            },
            {
              id: "disposable-income",
              title: "Tax-adjusted PPP disposable income",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPPPrivateConsumptionFactor(country(c))",
              explanation:
                "This is the core room-to-live term. It converts post-tax money left after essentials into comparable purchasing-power space once, explicitly, inside the metric.",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization",
          eyebrow: "Metric mechanics",
          title: "Normalization and coverage logic",
          summary:
            "Raw city indicators can only be aggregated after directionality and missingness are handled explicitly.",
          equations: [
            {
              id: "metric-normalization",
              title: "Winsorized metric score",
              formula:
                "If dir(m) = positive:\n  s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)\nIf dir(m) = negative:\n  s_m(c) = 100 x clamp((P95_m - winsor(x_m(c))) / (P95_m - P5_m), 0, 1)",
              explanation:
                "The live published model uses frozen P5/P95 winsorization, then rescales to 0-100. Harmful metrics reverse the numerator so higher normalized scores always mean better observed urban outcomes.",
              citations: [1],
            },
            {
              id: "coverage-score",
              title: "Weighted coverage",
              formula:
                "Cov_p(c) = Sum over metrics m of alpha_(p,m) x cov_m(c) / Sum over metrics m of alpha_(p,m)\nCov(c) = (25 Cov_pressure + 22 Cov_viability + 18 Cov_capability + 15 Cov_community + 20 Cov_creative) / 100",
              explanation:
                "Coverage is weighted by published metric importance, not by raw field count. Direct metrics contribute either 1 or 0; composite metrics contribute the observed share of their component weight.",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores",
          eyebrow: "Public subscore equations",
          title: "Subscores that remain visible to readers",
          summary:
            "The visible pillar equations below match the workbook structure used by the public score.",
          equations: [
            {
              id: "growth-pillar",
              title: "Growth pillar",
              formula:
                growthPillarFormula,
              explanation:
                "The public aggregate scores the lived pressure bundle directly. Economic growth momentum remains visible on scorecards, but it is a diagnostic line in the current published model rather than a scored term inside the final aggregate.",
              citations: [1, 2, 3, 7],
            },
            {
              id: "community-tolerance",
              title: "Tolerance composite",
              formula:
                toleranceCompositeFormula,
              explanation:
                "Community uses a scored openness composite rather than a single proxy. Where city hate-crime data is thin, the third term falls back to a published country-level civil-liberties proxy instead of pretending city evidence exists when it does not.",
              citations: [1, 14, 16, 35],
            },
            {
              id: "business-growth",
              title: "Economic vitality composite",
              formula:
                economicVitalityFormula,
              explanation:
                "Macro context matters, but it is capped inside a declared composite instead of silently overpowering city-level evidence. Birth rate and climate remain visible diagnostics for readers; they do not directly enter the current aggregate.",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "Notation glossary",
      title: "What every symbol means",
      summary:
        "The notation is intentionally compact. Each symbol is defined once so outside readers can reproduce the score or audit the worksheet.",
      symbols: [
        { symbol: "c", definition: "City or functional urban area", explanation: "The scored urban unit." },
        { symbol: "m", definition: "Metric index", explanation: "A scored metric line inside one public pillar." },
        { symbol: "k", definition: "Input channel", explanation: "A raw input used either directly or inside a composite metric." },
        { symbol: "p", definition: "Pillar index", explanation: "One of the five public pillar bundles." },
        { symbol: "x_k(c)", definition: "Raw input value", explanation: "Observed value for input channel k in city c before winsorization." },
        { symbol: "winsor(.)", definition: "Winsorization operator", explanation: "Clamps extreme values to the P5/P95 band before scoring." },
        { symbol: "P5_k, P95_k", definition: "Frozen percentile bounds", explanation: "The public lower and upper normalization bounds for input k." },
        { symbol: "s_k(c)", definition: "Normalized input score", explanation: "0-100 score after winsorization and direction adjustment." },
        { symbol: "M_m(c)", definition: "Composite metric score", explanation: "Weighted mean of normalized component scores for composite metric m." },
        { symbol: "alpha_(p,m)", definition: "Metric weight inside a pillar", explanation: "Published metric weight for m inside pillar p." },
        { symbol: "cov_m(c)", definition: "Metric coverage", explanation: "Observed share of a metric's required evidence, from 0 to 1." },
        { symbol: "Cov_p(c)", definition: "Pillar coverage", explanation: "Coverage score for pillar p after metric-weight weighting." },
        { symbol: "Cov(c)", definition: "Overall weighted coverage", explanation: "Weighted mean of the five pillar coverage scores." },
        { symbol: "w_p", definition: "Public pillar weight", explanation: "Fixed public weight applied to pillar p in the overall AMPI step." },
        { symbol: "mu(c)", definition: "Weighted pillar mean", explanation: "Weighted mean of the five pillar scores before the AMPI penalty." },
        { symbol: "var(c)", definition: "Weighted pillar variance", explanation: "Weighted cross-pillar variance used to penalize imbalance." },
        { symbol: "AMPI(c)", definition: "Adjusted Mazziotta-Pareto Index", explanation: "The variance-penalized overall composite before coverage penalty." },
        { symbol: "penalty(c)", definition: "Coverage penalty", explanation: "0, 5, or 15 points depending on the published coverage grade." },
        { symbol: "DI_ppp(c)", definition: "PPP-adjusted disposable income", explanation: "Post-tax income minus essential costs, converted once through the PPP private-consumption factor so purchasing room is comparable across cities." },
      ],
    },
    workedExampleSection: {
      eyebrow: "Worked example",
      title: "Published row walkthrough",
      summary:
        "This example uses a real published city row so the arithmetic is audit-friendly rather than decorative.",
      example: {
        city: `${workedExampleDisplayName} published row`,
        note: "Numbers below are taken from the live published snapshot in `publishedRankingData.json`, rounded exactly as displayed on the public scorecard.",
        inputs: [
          { label: "DI_ppp raw", value: workedExampleDiRaw, note: `Published raw disposable-income input for ${workedExampleDisplayName}` },
          { label: "Personal safety raw", value: workedExample?.safety?.raw != null ? String(workedExample.safety.raw) : "—", note: "Published homicide / harm input used in the negative-direction normalization example" },
          { label: "Pressure pillar", value: formatOneDecimal(workedExample?.pillarScores?.pressure ?? undefined), note: "Published pillar score after weighted mean over observed scored metrics" },
          { label: "Viability pillar", value: formatOneDecimal(workedExample?.pillarScores?.viability ?? undefined), note: "Published pillar score" },
          { label: "Capability pillar", value: formatOneDecimal(workedExample?.pillarScores?.capability ?? undefined), note: "Published pillar score" },
          { label: "Community pillar", value: formatOneDecimal(workedExample?.pillarScores?.community ?? undefined), note: "Published pillar score" },
          { label: "Creative pillar", value: formatOneDecimal(workedExample?.pillarScores?.creative ?? undefined), note: "Published pillar score" },
        ],
        steps: [
          {
            title: "Negative-direction normalization example",
            formula:
              workedExampleSafetyFormula,
            result: `SafetyScore = ${formatOneDecimal(workedExample?.safety?.scoreRounded ?? undefined)}`,
            explanation:
              `${workedExampleDisplayName}'s personal-safety input is negative-direction, so the numerator is reversed. The P5/P95 bounds here come from the frozen \`normStats\` snapshot used by the public scorer.`,
          },
          {
            title: "Growth pillar weighted mean",
            formula:
              workedExamplePressureFormula,
            result: `Growth = ${formatOneDecimal(workedExample?.pressure?.scoreRounded ?? undefined)}`,
            explanation:
              "Only observed scored metrics enter the denominator. Economic growth momentum is visible elsewhere on the scorecard, but it does not enter the current aggregate formula.",
          },
          {
            title: "Cross-pillar weighted mean and variance",
            formula:
              workedExampleMeanFormula,
            result: `mu = ${formatThreeDecimals(workedExample?.overall?.weightedMeanExact ?? undefined)}, var = ${formatTwoDecimals(workedExample?.overall?.weightedVarianceExact ?? undefined)}`,
            explanation:
              `This is the exact cross-pillar imbalance step. If ${workedExampleDisplayName} had the same weighted mean but more even pillars, its final score would be higher.`,
          },
          {
            title: "AMPI and final published score",
            formula:
              workedExampleAmpiFormula,
            result: `SLIC = ${formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined)}`,
            explanation:
              `The final score lands below the weighted pillar mean because AMPI penalizes imbalance, and no extra coverage deduction applies because ${workedExampleDisplayName} carries grade ${workedExample?.overall?.coverageGrade ?? "—"} coverage.`,
          },
        ],
        finalScore: formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined),
        conclusion:
          "The point of the example is methodological honesty: strong viability and capability do not erase a weaker community pillar. The variance penalty is what stops SLIC from rewarding one-dimensional cities as if all strengths were interchangeable.",
      },
    },
    modelSection: {
      eyebrow: "Method boundaries",
      title: "One public model, with diagnostics kept separate",
      summary:
        "The public score comes from one declared AMPI model. Diagnostics can be visible, but they do not silently mutate the published aggregate.",
      families: [
        {
          id: "weighted",
          title: "Official public model",
          formula: officialSlicFormula,
          role: "Published score",
          explanation:
            "This is the only public scoring engine: fixed weights, winsorized normalization, weighted pillar means, weighted AMPI across pillars, and an explicit coverage penalty.",
        },
        {
          id: "diagnostics",
          title: "Internal diagnostics",
          formula: "Visible diagnostics != scored diagnostics",
          role: "Non-scoring checks",
          explanation:
            "Economic growth momentum, climate/sunlight livability, and birth-rate optimism can remain visible on scorecards without directly entering the current aggregate. Visibility is not the same thing as scoring weight.",
        },
        {
          id: "profile-match",
          title: "Exploratory profile matcher",
          formula: "Match(c,u) = similarity(profile(c), preference(u))",
          role: "Exploratory only",
          explanation:
            "The spider-web exercise is not the published rank. It compares the shape of a city's five-pillar profile with a user's declared preference mix across the indexed field.",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "Country-context terms",
      title: "Macro strength matters, but it does not get to dominate",
      summary:
        "GDP per capita, growth, inequality, PPP, and tax rates all matter, but they enter SLIC as disciplined context or adjustment terms rather than headline determinants.",
    },
    weightChartLabel: "of official score",
    pillarsSection: {
      eyebrow: "Official pillars",
      title: "The five public bundles behind the score",
      summary:
        "Each pillar below matches the workbook weights and metric structure used by the public score.",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "The public label is Growth, but the underlying math is a pressure-and-runway bundle: how much usable life remains once housing, debt, overwork, and severe strain are counted honestly.",
        justification: "This is the pillar that stops SLIC from confusing prestige with room to live. GDP growth momentum remains visible on scorecards, but the current aggregate scores only the five declared lived-pressure terms below.",
        citations: [2, 3, 7],
        metrics: [
          { name: "Tax-adjusted disposable income", weight: 8, description: "Residual money after tax and essential costs, converted once through the PPP private-consumption factor so purchasing room is comparable across cities.", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "Housing price pressure", weight: 5, description: "City-market purchase price per square metre. Higher housing price pressure scores worse because it compresses the practical room to build a life locally — and because housing is the primary wealth-building vehicle for most families. Median Spanish household wealth ($107k) exceeds median German household wealth ($67k) despite lower German incomes, because Germany rents while Spain owns. The housing burden metric captures this transmission mechanism: cities where purchase prices price out the median resident deny households the primary path to intergenerational wealth accumulation.", inputs: ["USD per square metre", "city market purchase price"] },
          { name: "Household debt burden", weight: 2, description: "Debt relative to income. High leverage suggests more fragile household resilience.", inputs: ["household debt proxy"] },
          { name: "Working time pressure", weight: 4, description: "Average weekly hours and related overwork burden. Higher sustained work pressure scores worse.", inputs: ["weekly hours", "overwork share"] },
          { name: "Suicide and severe mental strain", weight: 4, description: "A severe-strain public-health signal. Higher suicide or equivalent strain proxy scores worse.", inputs: ["age-standardized suicide rate"] },
          { name: "Economic Stress (Hanke Misery Index)", weight: 2, description: "Hanke Annual Misery Index 2025: 2×unemployment + inflation + bank-lending-rate − real GDP/capita growth. Applied at country level. Lower = less macroeconomic stress.", inputs: ["unemployment rate", "CPI inflation", "bank lending rate", "real GDP/capita growth"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "Daily life should be safer, cleaner, easier to move through, and technically competent without turning coercive.",
        justification: "This pillar scores lived outcomes produced by city systems, not smart-city theatre. Climate and sunlight remain visible as a diagnostic line, but the current aggregate uses only the five scored terms below.",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "Personal safety", weight: 5, description: "Harm, violent crime, visitor victimization, and night-safety signals.", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "Transit access and commute burden", weight: 5, description: "Transit reach combined with commute time and late-hour usability. Currently inactive dataset-wide: only 7 of 158 cities have raw data and those entries mix incompatible units (modal-share % vs. commute minutes), so normalization anchors cannot be computed. This metric will activate once a consistent unit is established and at least 20 cities are populated. All cities show null transit scores for this reason.", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "Clean air", weight: 4, description: "PM2.5 and severe pollution exposure with CAMS and OpenAQ context.", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "Water, sanitation, and utility reliability", weight: 4, description: "Safe water, sanitation, and basic service reliability.", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "Digital infrastructure", weight: 4, description: "Broadband quality, affordability, and fibre readiness.", inputs: ["fixed broadband", "affordability", "internet performance"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "A serious city gives people access to good healthcare, good education, and fair pathways into adulthood.",
        justification: "This pillar prefers quality and access outcomes, not institution counts alone.",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "Healthcare quality", weight: 8, description: "Amenable mortality, capacity, and effective care access.", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "Education quality", weight: 6, description: "Learning outcomes, completion, and skills formation.", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "Equal opportunity and distributional fairness", weight: 4, description: "Composite scored metric: 70% equal-opportunity evidence and 30% reversed Gini context, reweighted over observed components when one side is missing.", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "A city is not a spreadsheet. Hospitality, tolerance, cultural richness, and the feeling of belonging are what make people stay — or leave.",
        justification: "Community is where SLIC refuses to treat openness as branding. Birth-rate optimism remains visible as a diagnostic line, but the current aggregate uses the four scored terms below and keeps the tolerance composite explicit.",
        citations: [1, 14, 16],
        metrics: [
          { name: "Hospitality and belonging", weight: 4, description: "Do people feel welcome in practice? Net migration, resident attachment, multilingual usability, and the culture of helping strangers.", inputs: ["net migration", "testimony audit", "multilingual services"] },
          { name: "Tolerance and pluralism", weight: 4, description: "Openness & Inclusion composite: 40% Equaldex LGBTQI Equality Index, 30% Freedom House aggregate, and 30% reversed hate-crime or civil-liberties proxy where city evidence is thin.", inputs: ["Equaldex country index", "Freedom House aggregate", "city hate-crime per 100k"] },
          { name: "Cultural and public-life vitality", weight: 3, description: "Everyday third places, historic continuity, events, and public-life texture. Visitor demand is contextual, not an automatic bonus.", inputs: ["tourism arrivals per 1000", "events", "public attention"] },
          { name: "Civic Freedom & Dignity", weight: 4, description: "Composite: 0.4 × HRMI Empowerment + 0.3 × Freedom House FIW + 0.3 × V-Dem Liberal Democracy Index (×100). Higher = more civic freedom and political rights.", inputs: ["HRMI Empowerment score", "Freedom House FIW", "V-Dem LDI"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "Cities should not only reduce suffering. They should also generate ambition, invention, and productive energy.",
        justification: "This pillar measures formal knowledge-economy production: how much new business is being registered, how much is being invested in research, how much capital is flowing in, and how easy productive entry is. It deliberately does not measure cultural or entertainment creative economy — food culture, nightlife, culinary arts, and tourism-creative activity register in the Community pillar instead. A city like Bangkok scores 44.5 here (formal startup/R&D economy) while scoring 70.7 on Community (food, hospitality, cultural vitality). Both numbers are correct; they are measuring different dimensions of the same city's output.",
        citations: [2, 10, 16],
        metrics: [
          { name: "Entrepreneurial dynamism", weight: 6, description: "Startup formation, business activity, and the local velocity of productive entry.", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "Innovation and research intensity", weight: 5, description: "Patents, research depth, and the city's capacity to generate new ideas.", inputs: ["patents", "R&D", "research institutions"] },
          { name: "Economic vitality and productive context", weight: 5, description: "Composite scored metric: 50% investment signal, 30% GDP per capita PPP context, and 20% GDP growth context.", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "Administrative and investment friction", weight: 4, description: "How much bureaucracy, instability, or permitting drag gets in the way of productive action.", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "Ranking protocol",
      title: "How cities enter, stay, and get published",
      summary:
        "The ranking has to handle missingness and scale honestly. Famous cities do not get automatic inclusion, and thin-data cities do not get fake precision.",
    },
    rules: [
      {
        title: "Functional urban areas, not city hall boundaries",
        body: "SLIC measures the city as the real labour market and service shed wherever possible, not as an arbitrary municipal core.",
        citations: [12],
      },
      {
        title: "Fixed official weights",
        body: "The public leaderboard uses one declared weighting scheme plus a cross-pillar AMPI penalty. User weighting can exist later as an exploratory tool, not as the published rank.",
        citations: [1],
      },
      {
        title: "Coverage gates before ranking",
        body: "A city is ranked only if its weighted coverage clears the public threshold. Below that threshold it remains watchlist-only, and manual watchlist flags such as active conflict can still override ranking eligibility.",
        citations: [1, 14, 15],
      },
      {
        title: "Safety is scored by outcomes, not surveillance",
        body: "Camera counts, control architecture, or smart-city theatre do not score by themselves. Lower harm and stronger daily confidence do.",
        citations: [1, 3],
      },
      {
        title: "Tolerance is scored by observable city effects",
        body: "SLIC does not rank religions or identities directly. It scores whether people can live, work, and participate with low friction, equal treatment, and realistic freedom.",
        citations: [1, 14],
      },
      {
        title: "Visitor demand is contextual, not automatic",
        body: "Travel demand enters as a cultural-demand signal only when it survives crowding, safety, ecology, and resident-room checks. For Bangkok, travel-cost sources support the public claim that global visitor appeal coexists with low day-to-day costs, but this evidence is not a scored tourism-affordability bonus.",
        citations: [1, 36, 37],
      },
      {
        title: "V3.3: Pure score rank, separate public tiers",
        body: englishTierProtocolRule,
        citations: [],
      },
      {
        title: "V3.3: Singapore and Bangkok under the live tier protocol",
        body: englishSingaporeRule,
        citations: [],
      },
      {
        title: "V3.2: Conflict-zone watchlist",
        body: "Cities inside an active conflict envelope — sustained rocket / missile exposure, civilian evacuation zones, routine shelter alerts, targeted strikes on civilian infrastructure — are placed on a conflict watchlist rather than ranked. All metric data remains visible on the city card, but the city does not occupy a tier slot. This is a liveability-honesty rule: ranking a city under shelter-alert protocol alongside a peacetime metro is not a like-for-like comparison. The watchlist reverses when sustained ceasefire and resident-return normalise the environment.",
        citations: [],
      },
      {
        title: "V3.1: Housing price ceiling widened",
        body: "The winsorization ceiling for pressure_housing_burden was widened after the public data contract moved to city-market purchase price per square foot. High-cost cities are now differentiated from each other instead of being flattened into the same penalty band. Housing pain now moves the pressure pillar.",
        citations: [],
      },
      {
        title: "Visible diagnostics are not hidden weights",
        body: "Economic growth momentum, climate/sunlight livability, and birth-rate optimism can stay visible on scorecards without directly entering the current aggregate. The method distinguishes between published context and scored evidence.",
        citations: [],
      },
      {
        title: "Composite metrics stay explicit",
        body: "Equal opportunity, tolerance, and economic vitality are not black-box terms. Their component weights are declared publicly and are reweighted only over observed evidence when one component is missing.",
        citations: [],
      },
      {
        title: "V3: PPP conversion is explicit and applied once",
        body: "SLIC converts residual income through the PPP private-consumption factor once, inside the disposable-income metric. That keeps cross-country money comparisons comparable without introducing any second hidden adjustment elsewhere in the score.",
        citations: [],
      },
    ],
    sourceSection: {
      eyebrow: "Source hierarchy",
      title: "What the model trusts first",
      summary:
        "The ladder below makes data distance visible. A city-level signal outranks a national proxy, and an audited proxy outranks an unqualified convenience number.",
    },
    sourceTiers: englishSourceTiers,
    worksheetSection: {
      eyebrow: "Scoring worksheet",
      title: "The city-by-city table behind the ranking",
      summary:
        "Once the city universe is loaded, these columns are filled and the model computes pillar scores, the final SLIC score, and the coverage grade.",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "References",
      title: "Source library used to justify the framework",
      summary:
        "The methodology cites the internal benchmarking memo plus the official documentation that anchors the scoring workbook and public model.",
    },
    references: methodologyReferences,
  },
  th: {
    hero: {
      eyebrow: "Methodology paper",
      title: "ระเบียบวิธีของ SLIC",
      strapline:
        "กรอบการจัดอันดับเมืองที่เขียนออกมาเป็นสมการชัดเจน เพื่อวัดคุณภาพชีวิต ความรู้สึกเป็นส่วนหนึ่ง ความทะเยอทะยาน และพื้นที่ชีวิตจริง",
      intro:
        "SLIC ถูกสร้างขึ้นเพื่อตอบโต้การจัดอันดับเมืองกระแสหลักที่มักให้รางวัลกับความมั่งคั่ง ภาพลักษณ์ที่เรียบร้อย และความเป็นทางการของระบบ มากกว่าจะให้ค่าน้ำหนักกับความปลอดภัย ความกดดันในชีวิต ความสามารถในการจ่าย ความอดทนต่อความแตกต่าง พลังธุรกิจ และพื้นผิวชีวิตจริงของเมือง เราจึงประกาศสมการสาธารณะ ชุดแหล่งข้อมูล ลำดับชั้นของข้อมูล และกติกาความครอบคลุมอย่างเปิดเผย",
      doctrineTitle: "หลักการทางการ",
      doctrineBody:
        "จัดอันดับเมืองที่คนสามารถอยู่ได้ดี รู้สึกเป็นส่วนหนึ่ง และเติบโตได้มากขึ้น SLIC ไม่ใช่ตาราง GDP ไม่ใช่คะแนนแก็ดเจ็ต และไม่ใช่ดัชนีความสบายอย่างเดียว",
      contextTitle: "ตัวแปรบริบทระดับประเทศ",
      contextItems: [
        "GDP ต่อหัว (PPP)",
        "การเติบโตของ GDP",
        "ค่าสัมประสิทธิ์จีนี",
        "อัตราภาษีที่ผู้ใช้กำหนด",
        "ตัวคูณ PPP ด้านการบริโภคภาคเอกชน",
      ],
      explicitTitle: "สิ่งที่สูตรสาธารณะทำให้เห็นชัด",
      explicitItems: [
        "ความปลอดภัยวัดจากผลลัพธ์ ไม่ใช่ความเข้มข้นของการเฝ้าระวัง",
        "ความเปิดกว้างวัดจากการอยู่ร่วมกันได้จริงและการเข้าถึงตลาดอย่างเท่าเทียม",
        "ธุรกิจและการเติบโตเป็นส่วนหนึ่งของคะแนนสาธารณะโดยตรง ไม่ใช่สมมติฐานแฝง",
      ],
    },
    readerGuide: {
      eyebrow: "คู่มือการอ่าน",
      title: "อ่านง่ายสำหรับสาธารณะ และทำซ้ำได้สำหรับนักวิเคราะห์",
      summary:
        "หน้า methodology ต้องตอบสองกลุ่มพร้อมกัน คือคนที่ต้องการเหตุผลแบบภาษาคน และคนที่ต้องการคำนวณโมเดลนี้กับชุดเมืองของตนเอง",
      layTitle: "เส้นทางอ่านแบบภาษาคน",
      technicalTitle: "เส้นทางอ่านแบบเทคนิค",
      laySteps: [
        "อ่านห้าเสาหลักเป็นห้าคำถามพื้นฐาน: จ่ายไหวไหม อยู่สบายและปลอดภัยไหม สร้างศักยภาพได้ไหม รู้สึกเป็นส่วนหนึ่งไหม และเมืองยังมีแรงผลักให้เติบโตไหม",
        "มองเทคโนโลยีเป็นชั้นสนับสนุน จะได้คะแนนก็ต่อเมื่อทำให้ชีวิตจริงดีขึ้น",
        "อ่านเมืองหรูแพงอย่างระมัดระวัง เพราะระบบที่ดีไม่ได้ลบภาระค่าใช้จ่าย ความเครียด หรือชุมชนที่บางเกินไป",
        "อ่านเมืองรองอย่างตั้งใจ เพราะ SLIC ถูกออกแบบมาเพื่อให้เมืองเหล่านี้ชนะได้เมื่อมีคุณค่าจริงและพื้นที่ให้ชีวิตดำเนินต่อ",
      ],
      technicalSteps: [
        "กำหนดเมืองเป็น functional urban area หรือหน่วยมหานครที่ป้องกันเชิงวิชาการได้",
        "เก็บข้อมูลระดับเมืองก่อน จากนั้นระดับภูมิภาค แล้วค่อยใช้ข้อมูลระดับชาติเป็น fallback พร้อมระบุ source tier ทุกตัวแปร",
        "คำนวณรายได้ใช้สอยจริงหลังภาษีและหลังค่าใช้จ่ายจำเป็นก่อนเริ่มให้คะแนน",
        "winsorize ที่ P5/P95 แปลงเป็น 0-100 กลับทิศคะแนนตัวแปรเชิงลบ และเผยแพร่ coverage grade ไปพร้อมกับอันดับ",
      ],
    },
    critiqueSection: {
      eyebrow: "ข้อจำกัดของอันดับเดิม",
      title: "ช่องว่างที่ SLIC พยายามปิด",
      summary:
        "ดัชนีเมืองเดิมมีประโยชน์ในการอ้างอิง แต่ส่วนใหญ่ตั้งอยู่บนทฤษฎีของเมืองที่ SLIC ไม่ได้ยอมรับทั้งหมด",
    },
    critiques: [
      {
        title: "ชื่อเสียงมักถูกสับสนกับความน่าอยู่",
        body: "หลายดัชนีให้คะแนนกับเมืองที่รวยและมีระบบทางการสวยงามอยู่แล้ว จึงยกเมืองบางแบบขึ้นมาโดยโครงสร้าง",
        implication: "SLIC แยกความน่าอยู่จริงออกจากชื่อเสียงของเมือง และใช้ GDP เป็นเพียงบริบท ไม่ใช่ชะตากรรม",
        citations: [1, 2, 14],
      },
      {
        title: "ข้อมูลที่มีอยู่จำกัดทำให้เมืองรองถูกตัดออกตั้งแต่ต้น",
        body: "เมืองจำนวนมากหายไปเพราะสถาปัตยกรรมของ benchmark รับเฉพาะเมืองที่มีชุดข้อมูลพร้อมใช้แบบสากลอยู่แล้ว",
        implication: "SLIC มี watchlist มี coverage grade และมี source ladder ที่เปิดเผยแทนการตัดเมืองทิ้งเงียบ ๆ",
        citations: [1, 14, 15],
      },
      {
        title: "ความปลอดภัยมักถูกอนุมานจากเครื่องมือ ไม่ใช่ผลลัพธ์",
        body: "แอป กล้อง หรือแดชบอร์ดอาจดูทันสมัย แต่เมืองยังไม่ปลอดภัยหรือมีบรรยากาศกดดันได้",
        implication: "SLIC วัดอันตราย การตกเป็นเหยื่อ และความมั่นใจในชีวิตประจำวันโดยตรง กล้องไม่ได้เพิ่มคะแนนเอง",
        citations: [1, 11, 13],
      },
      {
        title: "แรงกดดันในชีวิตมักถูกวัดน้อยเกินไป",
        body: "รายได้ใช้สอยจริงหลังค่าใช้จ่าย หนี้ ชั่วโมงงาน และการฆ่าตัวตาย เป็นตัวแปรสำคัญของชีวิตเมือง แต่ดัชนีจำนวนมากกลับให้ความสำคัญรองลงมา",
        implication: "SLIC จึงให้แรงกดดันและพื้นที่ชีวิตจริงเป็นเสาหลักสาธารณะเต็มรูปแบบ",
        citations: [1, 2, 3, 7],
      },
      {
        title: "จำนวนนักท่องเที่ยวมีประโยชน์ แต่ไม่ใช่คะแนนโบนัสอัตโนมัติ",
        body: "การท่องเที่ยวหนักอาจอยู่ร่วมกับความแออัด อาชญากรรม หรือเงื่อนไขเมืองแบบเอารัดเอาเปรียบได้",
        implication: "SLIC ใช้ visitor flow เป็นสัญญาณเชิงวัฒนธรรมที่ต้องผ่านการตรวจสอบด้านความปลอดภัย นิเวศวิทยา และแรงกดดันของเมืองก่อน",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "การทดสอบวิธี",
      title: "โมเดลนี้ถูกกดดันจริงในห้องประชุม เวที และเวิร์กช็อป",
      summary:
        "SLIC ไม่ใช่สเปรดชีตที่คิดขึ้นครั้งเดียว แต่เป็นกรอบที่ถูกอธิบาย ท้าทาย และปรับแก้ซ้ำ ๆ ในสถานการณ์จริงก่อนจะตรึงเป็นสูตรสาธารณะ",
      figures: [
        {
          id: "process-stage-th",
          src: "/photos/report-people-stage.jpg",
          alt: "ผู้คนบนเวทีงานสาธารณะด้านเมือง",
          caption: "กรอบนี้ต้องอธิบายต่อสาธารณะให้รอด ไม่ใช่แค่สวยในเอกสารภายใน",
          width: 1440,
          height: 1440,
        },
        {
          id: "process-meeting-th",
          src: "/photos/report-people-meeting.jpg",
          alt: "การประชุมรอบโต๊ะพร้อมคอมพิวเตอร์และไมโครโฟน",
          caption: "สมมติฐานถูกตรวจในห้องทำงานที่ต้องป้องกันเหตุผลด้านข้อมูลและเหตุผลด้านเมืองพร้อมกัน",
          width: 1439,
          height: 1085,
        },
        {
          id: "process-workshop-th",
          src: "/photos/report-people-workshop.jpg",
          alt: "เวิร์กช็อปที่มีผู้บรรยายต่อหน้าผู้เข้าร่วม",
          caption: "การทดลองใช้ช่วยแยกตัวชี้วัดที่ดูดีออกจากตัวชี้วัดที่อธิบายชีวิตเมืองได้จริง",
          width: 2048,
          height: 1365,
        },
      ],
    },
    flowSection: {
      eyebrow: "ลำดับการคำนวณ",
      title: "ข้อมูลดิบกลายเป็นคะแนน SLIC ได้อย่างไร",
      summary:
        "ลำดับการคำนวณถูกทำให้สั้นและตรวจสอบได้: ข้อมูลดิบ, คะแนน normalized, คะแนนเสาหลัก, แล้วจึงรวมเป็นคะแนนสุดท้าย",
      stages: [
        { id: "raw-th", title: "ข้อมูลดิบ", body: "เก็บสัญญาณจากระดับเมือง มหานคร ภูมิภาค และประเทศ พร้อม source tier", formula: "x_m(c)" },
        { id: "normalized-th", title: "การ normalize", body: "winsorize ที่ P5/P95 แปลงเป็น 0-100 และกลับทิศตัวแปรเชิงลบ", formula: "s_m(c)" },
        { id: "pillars-th", title: "รวมเป็นเสาหลัก", body: "รวมตัวชี้วัดตามน้ำหนักภายในเสาหลักที่ประกาศไว้", formula: "P_p(c) = Sum observed alpha_(p,m) x s_m(c) / Sum observed alpha_(p,m)" },
        { id: "final-th", title: "คะแนนสุดท้าย", body: "ใช้สูตรสาธารณะเพียงสูตรเดียว พร้อม coverage grade", formula: "SLIC(c)" },
      ],
    },
    remoteSensingSection: {
      eyebrow: "ชั้นข้อมูลดาวเทียม",
      title: "ข้อมูลดาวเทียมช่วยขยายกรอบของเมืองเมื่อเซนเซอร์ภาคพื้นดินไม่ครอบคลุมพอ",
      summary:
        "SLIC ใช้ remote sensing เพื่อขยายพื้นที่มองเห็นของข้อมูล โดยเฉพาะเมื่อสถานีตรวจวัดในเมืองมีจำนวนน้อย กระจุกตัว หรือไม่สม่ำเสมอจนไม่สามารถอธิบาย airshed และขอบนิเวศของเมืองได้ครบ ชั้นข้อมูลดาวเทียมเป็น supporting evidence ไม่ใช่ความจริงแบบเวทมนตร์",
      quantifyTitle: "สิ่งที่ชั้นข้อมูลดาวเทียมช่วย quantify",
      quantifyItems: [
        "ภาระ aerosol และองค์ประกอบของบรรยากาศในกรอบเมืองที่กว้างกว่า",
        "ระดับความเขียวและ vegetation buffering ผ่านผลิตภัณฑ์ลักษณะ NDVI",
        "land cover ความชื้น และบริบทของพื้นผิวรอบเมืองหนาแน่น",
        "การเคลื่อนตัวของมลพิษระดับภูมิภาคที่สถานีในเมืองอาจจับไม่ครบ",
      ],
      qualifyTitle: "สิ่งที่นักวิเคราะห์ยังต้อง qualify เพิ่ม",
      qualifyItems: [
        "ภูมิประเทศ แนวชายฝั่ง ลม และทิศทางควันตามฤดูกาล",
        "ความต่างระหว่าง hotspot เฉพาะจุดกับสภาพของทั้งเมือง",
        "urban form street canyon และวิธีที่คนในเมืองสัมผัสสภาวะเหล่านั้นจริง",
        "การยืนยันจากข้อมูลภาครัฐ testimony และหลักฐานในพื้นที่จริง",
      ],
      workflowTitle: "ชั้นดาวเทียมเข้าสู่วิธีอย่างไร",
      workflowStages: [
        {
          id: "remote-official-th",
          title: "ข้อมูลทางการด้านสิ่งแวดล้อมและเมือง",
          body: "เซนเซอร์ภาคพื้นดิน รายงานสาธารณูปโภค คุณภาพอากาศ และรายงานทางการยังเป็นชั้นข้อมูลหลักเมื่อมีอยู่จริง",
        },
        {
          id: "remote-context-th",
          title: "การแก้และเติมบริบทด้วย remote sensing",
          body: "Copernicus, JAXA และชั้นข้อมูลสาธารณะจาก Landsat ช่วยขยายกรอบเรื่อง aerosol การเคลื่อนตัวของมลพิษ พืชพรรณ และแรงกดดันเชิงนิเวศรอบเมือง",
        },
        {
          id: "remote-listening-th",
          title: "Social listening และคำบอกเล่าจากเมือง",
          body: "เสียงบ่นของคนเมือง ประสบการณ์ของผู้มาเยือน และความเข้มของการพูดถึง ช่วยบอกว่าปัญหาที่แผนที่เห็นนั้นถูกสัมผัสจริงในชีวิตประจำวันหรือไม่",
        },
        {
          id: "remote-judgement-th",
          title: "การตัดสินสุดท้ายของเมือง",
          body: "นักวิเคราะห์ SLIC อ่านทั้งสามชั้นร่วมกัน เพื่อให้ดาวเทียมทำหน้าที่สนับสนุนการตัดสิน ไม่ใช่แกล้งทำเป็นแทนความจริงภาคพื้นดินได้ทั้งหมด",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "แกนคณิตศาสตร์",
      title: "ชั้นสมการที่ใช้จริง",
      summary:
        "คะแนนสาธารณะใช้ fixed weights, directionality ที่ประกาศชัด และสมการที่ตรวจสอบได้ ทุกสมการที่แสดงคือส่วนหนึ่งของวิธีจริง ไม่ใช่ของตกแต่ง",
      groups: [
        {
          id: "official-th",
          eyebrow: "คะแนนสาธารณะ",
          title: "สูตรทางการที่เผยแพร่",
          summary: "นี่คือแกนคำนวณที่ใช้จริงทั้งบนเว็บไซต์และในเวิร์กบุ๊ก",
          equations: [
            {
              id: "official-score-th",
              title: "คะแนน SLIC อย่างเป็นทางการ",
              formula:
                officialSlicFormula,
              explanation:
                "บอร์ดสาธารณะไม่ได้ใช้ค่าเฉลี่ยถ่วงน้ำหนักธรรมดา แต่ใช้ AMPI แบบถ่วงน้ำหนักข้ามห้าเสาหลัก แล้วจึงหัก coverage penalty ตามเกณฑ์ที่ประกาศ",
              citations: [1],
            },
            {
              id: "official-ampi-th",
              title: "รูปขยายของ AMPI",
              formula:
                officialAmpiFormula,
              explanation:
                "ตัว scorer จะคำนวณค่าเฉลี่ยถ่วงน้ำหนักของห้าเสาหลักก่อน แล้วหักโทษจากความแปรปรวนข้ามเสาหลักหารด้วยค่าเฉลี่ย เมืองที่เด่นด้านเดียวจึงถูกกดลงอย่างเป็นระบบ",
              citations: [1],
            },
            {
              id: "disposable-income-th",
              title: "รายได้ใช้สอยจริงแบบ PPP หลังภาษี",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPPPrivateConsumptionFactor(country(c))",
              explanation:
                "นี่คือตัวแปรหลักของพื้นที่ชีวิตจริง โดยแปลงเงินที่เหลือหลังภาษีและค่าใช้จ่ายจำเป็นผ่าน PPP เพียงครั้งเดียวเพื่อให้เทียบกำลังซื้อกันข้ามเมืองได้",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization-th",
          eyebrow: "กลไกของตัวชี้วัด",
          title: "การ normalize และกติกาข้อมูลขาดหาย",
          summary: "ข้อมูลดิบจะถูกรวมกันได้ก็ต่อเมื่อจัดการเรื่องทิศทางของคะแนนและ missingness อย่างเปิดเผย",
          equations: [
            {
              id: "metric-normalization-th",
              title: "คะแนนตัวชี้วัดหลัง winsorize",
              formula:
                "If dir(m) = positive:\n  s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)\nIf dir(m) = negative:\n  s_m(c) = 100 x clamp((P95_m - winsor(x_m(c))) / (P95_m - P5_m), 0, 1)",
              explanation:
                "ตัวแปรเชิงบวกคำนวณตรง ตัวแปรเชิงลบจะกลับทิศตัวเศษเพื่อให้คะแนนที่สูงหมายถึงผลลัพธ์ที่ดีกว่าเสมอ",
              citations: [1],
            },
            {
              id: "coverage-score-th",
              title: "คะแนนความครอบคลุมแบบถ่วงน้ำหนัก",
              formula:
                "Cov_p(c) = Sum over metrics m of alpha_(p,m) x cov_m(c) / Sum over metrics m of alpha_(p,m)\nCov(c) = (25 Cov_pressure + 22 Cov_viability + 18 Cov_capability + 15 Cov_community + 20 Cov_creative) / 100",
              explanation:
                "coverage ถูกถ่วงน้ำหนักตามความสำคัญของตัวแปร เมืองที่ข้อมูลสำคัญบางไม่สามารถซ่อนอยู่หลังตัวแปรย่อยจำนวนมากได้",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores-th",
          eyebrow: "สมการย่อยที่สาธารณะเห็น",
          title: "คะแนนย่อยที่ยังต้องมองเห็นได้",
          summary: "สมการของเสาหลักที่มองเห็นได้ด้านล่างตรงกับโครงสร้างในเวิร์กบุ๊กที่ใช้คำนวณคะแนนสาธารณะ",
          equations: [
            {
              id: "safety-viability-th",
              title: "เสาหลัก Growth",
              formula:
                growthPillarFormula,
              explanation:
                "เสาหลักนี้รวมแรงกดดันด้านพื้นที่ชีวิตจริงโดยตรง ส่วน economic growth momentum ยังมองเห็นได้บน scorecard แต่เป็น diagnostic ที่ไม่ถูกนับใน aggregate ปัจจุบัน",
              citations: [1, 2, 3, 7],
            },
            {
              id: "community-tolerance-th",
              title: "Tolerance composite",
              formula:
                toleranceCompositeFormula,
              explanation:
                "Community ใช้ composite ด้าน openness ที่ประกาศส่วนประกอบชัดเจน แทนการใช้ proxy ตัวเดียวแบบกล่องดำ",
              citations: [1, 14, 16, 35],
            },
            {
              id: "business-growth-th",
              title: "Economic vitality composite",
              formula:
                economicVitalityFormula,
              explanation:
                "บริบทมหภาคยังสำคัญ แต่ถูกบรรจุไว้ใน composite ที่ประกาศชัด แทนที่จะปล่อยให้ครอบงำหลักฐานระดับเมืองแบบเงียบ ๆ",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "ตารางสัญลักษณ์",
      title: "ความหมายของสัญลักษณ์ทั้งหมด",
      summary:
        "สัญลักษณ์ถูกทำให้กระชับและนิยามเพียงครั้งเดียว เพื่อให้ผู้อ่านภายนอกทำซ้ำหรือ audit โมเดลได้",
      symbols: [
        { symbol: "c", definition: "เมืองหรือ functional urban area", explanation: "หน่วยเมืองที่ถูกให้คะแนน" },
        { symbol: "m", definition: "ดัชนีตัวชี้วัด", explanation: "ตัวแปรดิบ เช่น ภาระค่าเช่า PM2.5 หรือความง่ายในการเปิดธุรกิจ" },
        { symbol: "p", definition: "ดัชนีเสาหลัก", explanation: "หนึ่งในห้าเสาหลักสาธารณะ" },
        { symbol: "x_m(c)", definition: "ค่าดิบของตัวชี้วัด", explanation: "ค่าที่สังเกตได้ของตัวแปร m ในเมือง c ก่อน normalize" },
        { symbol: "winsor(.)", definition: "ตัวดำเนินการ winsorize", explanation: "ตัดค่าปลายสุดให้อยู่ในช่วง P5/P95 ก่อนให้คะแนน" },
        { symbol: "P5_m, P95_m", definition: "จุดยึดเปอร์เซ็นไทล์", explanation: "ขอบล่างและขอบบนของตัวแปร m" },
        { symbol: "s_m(c)", definition: "คะแนน normalized", explanation: "คะแนน 0-100 หลังจัดการ outlier และทิศทางของตัวแปร" },
        { symbol: "alpha_(p,m)", definition: "น้ำหนักของตัวชี้วัดภายในเสาหลัก", explanation: "บอกว่าตัวแปร m ส่งผลต่อเสาหลัก p มากแค่ไหน" },
        { symbol: "cov_m(c)", definition: "คะแนนความครอบคลุมของตัวแปร", explanation: "บอกสัดส่วนของหลักฐานที่สังเกตได้สำหรับตัวแปรนั้น ตั้งแต่ 0 ถึง 1" },
        { symbol: "w_p", definition: "น้ำหนักเสาหลักสาธารณะ", explanation: "น้ำหนักที่ใช้รวมคะแนนสุดท้าย" },
        { symbol: "DI_ppp(c)", definition: "พื้นที่รายได้ใช้สอยจริงแบบ PPP", explanation: "เงินที่เหลือหลังภาษีและค่าใช้จ่ายจำเป็นในหน่วย PPP" },
      ],
    },
    workedExampleSection: {
      eyebrow: "ตัวอย่างคำนวณ",
      title: "ไล่เส้นทางแถวข้อมูลที่เผยแพร่จริง",
      summary:
        "ตัวอย่างนี้ใช้แถวข้อมูลจริงจากชุดข้อมูลที่เผยแพร่ เพื่อให้คณิตศาสตร์ตรวจย้อนกลับได้ ไม่ใช่สูตรตกแต่ง",
      example: {
        city: `แถวข้อมูลเผยแพร่ของ ${workedExampleDisplayName}`,
        note: "ตัวเลขด้านล่างมาจาก snapshot ปัจจุบันใน `publishedRankingData.json` และปัดตามที่แสดงบน scorecard สาธารณะทุกประการ",
        inputs: [
          { label: "DI_ppp raw", value: workedExampleDiRaw, note: `ค่าดิบ disposable-income ของ ${workedExampleDisplayName} ในชุดข้อมูลที่เผยแพร่` },
          { label: "Personal safety raw", value: workedExample?.safety?.raw != null ? String(workedExample.safety.raw) : "—", note: "ค่าดิบ homicide / harm ที่ใช้ในตัวอย่าง normalize แบบตัวแปรเชิงลบ" },
          { label: "Pressure pillar", value: formatOneDecimal(workedExample?.pillarScores?.pressure ?? undefined), note: "คะแนนเสาหลังรวมตัวแปรที่มีข้อมูลจริง" },
          { label: "Viability pillar", value: formatOneDecimal(workedExample?.pillarScores?.viability ?? undefined), note: "คะแนนเสาที่เผยแพร่" },
          { label: "Capability pillar", value: formatOneDecimal(workedExample?.pillarScores?.capability ?? undefined), note: "คะแนนเสาที่เผยแพร่" },
          { label: "Community pillar", value: formatOneDecimal(workedExample?.pillarScores?.community ?? undefined), note: "คะแนนเสาที่เผยแพร่" },
          { label: "Creative pillar", value: formatOneDecimal(workedExample?.pillarScores?.creative ?? undefined), note: "คะแนนเสาที่เผยแพร่" },
        ],
        steps: [
          {
            title: "ตัวอย่าง normalize แบบตัวแปรเชิงลบ",
            formula: workedExampleSafetyFormula,
            result: `SafetyScore = ${formatOneDecimal(workedExample?.safety?.scoreRounded ?? undefined)}`,
            explanation: `ตัวแปร personal safety ของ ${workedExampleDisplayName} เป็นตัวแปรเชิงลบ จึงกลับทิศตัวเศษ ขอบ P5/P95 มาจาก \`normStats\` ชุดเดียวกับที่ scorer ใช้จริง`,
          },
          {
            title: "ค่าเฉลี่ยถ่วงน้ำหนักของเสา Growth",
            formula: workedExamplePressureFormula,
            result: `Growth = ${formatOneDecimal(workedExample?.pressure?.scoreRounded ?? undefined)}`,
            explanation: "ตัวหารนับเฉพาะ metric ที่มีข้อมูลจริง Economic growth momentum ยังแสดงบน scorecard ได้ แต่ไม่เข้าสูตร aggregate ปัจจุบัน",
          },
          {
            title: "ค่าเฉลี่ยถ่วงน้ำหนักและความแปรปรวนข้ามเสา",
            formula: workedExampleMeanFormula,
            result: `mu = ${formatThreeDecimals(workedExample?.overall?.weightedMeanExact ?? undefined)}, var = ${formatTwoDecimals(workedExample?.overall?.weightedVarianceExact ?? undefined)}`,
            explanation: `นี่คือขั้นตอนลงโทษความไม่สมดุลข้ามเสาที่แท้จริง ถ้า ${workedExampleDisplayName} มีค่าเฉลี่ยเท่าเดิมแต่เสาใกล้กันมากขึ้น คะแนนสุดท้ายจะสูงขึ้น`,
          },
          {
            title: "AMPI และคะแนนสาธารณะสุดท้าย",
            formula: workedExampleAmpiFormula,
            result: `SLIC = ${formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined)}`,
            explanation: `คะแนนสุดท้ายต่ำกว่าค่าเฉลี่ยถ่วงน้ำหนัก เพราะ AMPI ลงโทษความไม่สมดุล และ ${workedExampleDisplayName} ไม่ถูกหักเพิ่มจาก coverage เพราะได้ grade ${workedExample?.overall?.coverageGrade ?? "—"}`,
          },
        ],
        finalScore: formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined),
        conclusion:
          "ประเด็นสำคัญของตัวอย่างนี้คือความซื่อสัตย์ทางระเบียบวิธี: เสา Viability และ Capability ที่แข็งมาก ไม่ได้ลบข้ออ่อนของเสา Community ทิ้งไป AMPI ทำหน้าที่หยุดไม่ให้ SLIC ให้รางวัลเมืองมิติเดียวราวกับจุดแข็งทุกอย่างทดแทนกันได้",
      },
    },
    modelSection: {
      eyebrow: "ขอบเขตของวิธี",
      title: "มีสูตรสาธารณะเพียงชุดเดียว ส่วน diagnostics แยกออกต่างหาก",
      summary:
        "คะแนนสาธารณะมาจาก AMPI เพียงชุดเดียวที่ประกาศชัด ส่วน diagnostics อาจมองเห็นได้ แต่ไม่แก้อันดับที่เผยแพร่แบบเงียบ ๆ",
      families: [
        {
          id: "weighted-th",
          title: "โมเดลสาธารณะทางการ",
          formula: officialSlicFormula,
          role: "คะแนนที่เผยแพร่",
          explanation: "นี่คือเครื่องยนต์สาธารณะอย่างเป็นทางการเพียงชุดเดียว: น้ำหนักคงที่ winsorize แบบประกาศล่วงหน้า ค่าเฉลี่ยถ่วงน้ำหนักภายในเสา AMPI ข้ามเสา และบทลงโทษ coverage ที่ชัดเจน",
        },
        {
          id: "diagnostics-th",
          title: "การวินิจฉัยภายใน",
          formula: "Diagnostics(c) do not modify SLIC(c)",
          role: "การตรวจแบบไม่ให้คะแนน",
          explanation: "การตรวจความสอดคล้อง การทดสอบโครงสร้าง และการทบทวนของนักวิเคราะห์อาจใช้เพื่อจับข้อมูลที่อ่อนหรือไม่สมเหตุผล แต่ไม่เพิ่มโบนัสหรือบทลงโทษลับในคะแนนสาธารณะ",
        },
        {
          id: "profile-match-th",
          title: "ตัวจับคู่โปรไฟล์เชิงสำรวจ",
          formula: "Match(c,u) = similarity(profile(c), preference(u))",
          role: "ใช้เพื่อสำรวจเท่านั้น",
          explanation: "โหมด spider-web ไม่ใช่อันดับสาธารณะ แต่เป็นการเทียบรูปทรงคะแนนห้าเสาของเมืองกับความชอบที่ผู้ใช้ประกาศในสนามเมืองทั้งหมด",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "บริบทระดับประเทศ",
      title: "ความแข็งแรงระดับมหภาคมีผล แต่ครอบงำคะแนนไม่ได้",
      summary:
        "GDP ต่อหัว การเติบโต ความเหลื่อมล้ำ PPP และภาษี มีผลต่อวิธีนี้ แต่ทั้งหมดเข้าสู่สูตรในฐานะตัวแปรปรับหรือบริบท ไม่ใช่ตัวตัดสินอันดับโดยตรง",
    },
    weightChartLabel: "ของคะแนนทางการ",
    pillarsSection: {
      eyebrow: "เสาหลักทางการ",
      title: "ห้าเสาหลักสาธารณะที่อยู่เบื้องหลังคะแนน",
      summary:
        "เสาทุกต้นด้านล่างตรงกับน้ำหนักและโครงสร้างในเวิร์กบุ๊กที่ใช้คำนวณคะแนนสาธารณะ",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "พลวัตเศรษฐกิจกำหนดทิศทางเมือง การเติบโตเชิญชวนทุนนิยมและกลไกตลาดที่ส่งผลต่อค่าครองชีพ เว้นแต่รัฐจะจัดสวัสดิการ",
        justification: "เสานี้วัดพลังเศรษฐกิจและผลกระทบต่อชีวิตจริงของคนเมือง",
        citations: [2, 3, 7],
        metrics: [
          { name: "รายได้ใช้สอยจริงแบบ PPP หลังภาษี", weight: 9, description: "เงินคงเหลือหลังภาษีและค่าใช้จ่ายจำเป็น แปลงผ่าน PPP เพียงครั้งเดียวเพื่อให้เทียบกำลังซื้อข้ามเมืองได้", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "แรงกดดันราคาที่อยู่อาศัย", weight: 5, description: "ราคาซื้อขายในตลาดเมืองต่อหนึ่งตารางฟุต ยิ่งสูงยิ่งกดคะแนน เพราะบีบพื้นที่จริงในการสร้างชีวิตด้วยรายได้ท้องถิ่น", inputs: ["USD per square foot", "city market purchase price"] },
          { name: "ภาระหนี้ครัวเรือน", weight: 4, description: "หนี้เทียบกับรายได้ใช้สอยจริงหรือ proxy ที่ดีที่สุด", inputs: ["household debt", "disposable income"] },
          { name: "แรงกดดันจากชั่วโมงงาน", weight: 4, description: "ชั่วโมงงานเฉลี่ยและภาระการทำงานเกิน ยิ่งสูงต่อเนื่องยิ่งกดคะแนน", inputs: ["weekly hours", "overwork share"] },
          { name: "การฆ่าตัวตายและภาวะเครียดรุนแรง", weight: 3, description: "สัญญาณสาธารณสุขของความเครียดรุนแรง อัตราฆ่าตัวตายหรือ proxy ที่เทียบเท่าสูงกว่าจะกดคะแนน", inputs: ["age-standardized suicide rate"] },
          { name: "ความตึงเครียดทางเศรษฐกิจ (Hanke Misery Index)", weight: 2, description: "Hanke Annual Misery Index 2025: 2×อัตราว่างงาน + เงินเฟ้อ + อัตราดอกเบี้ยกู้ยืม − การเติบโต GDP ต่อหัวจริง ใช้ระดับประเทศ คะแนนต่ำ = ความตึงเครียดมหภาคน้อยกว่า", inputs: ["unemployment rate", "CPI inflation", "bank lending rate", "real GDP/capita growth"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "ชีวิตประจำวันควรปลอดภัยกว่า หายใจได้ง่ายกว่า เดินทางได้ และมีระบบพื้นฐานที่ทำงานโดยไม่กดทับคน",
        justification: "นี่คือพื้นที่ที่เมืองมีสมรรถนะจะได้คะแนน แต่ต้องเป็นสมรรถนะที่สร้างผลลัพธ์จริง",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "ความปลอดภัยส่วนบุคคล", weight: 5, description: "อันตราย อาชญากรรมรุนแรง การตกเป็นเหยื่อของผู้มาเยือน และสัญญาณความปลอดภัยยามค่ำคืน", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "การเข้าถึงขนส่งและภาระเวลาเดินทาง", weight: 5, description: "ระยะการเข้าถึงระบบขนส่งรวมกับเวลาเดินทางและการใช้งานช่วงดึก", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "อากาศสะอาด", weight: 4, description: "PM2.5 และการเผชิญมลพิษรุนแรง พร้อมข้อมูล CAMS และ OpenAQ", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "น้ำ สุขาภิบาล และความเสถียรของสาธารณูปโภค", weight: 4, description: "น้ำสะอาด สุขาภิบาล และความต่อเนื่องของบริการพื้นฐาน", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "โครงสร้างพื้นฐานดิจิทัล", weight: 4, description: "คุณภาพอินเทอร์เน็ต ความสามารถในการจ่าย และความพร้อมด้านไฟเบอร์", inputs: ["fixed broadband", "affordability", "internet performance"] },
          { name: "ความน่าอยู่ด้านภูมิอากาศและแสงแดด", weight: 7, description: "ตัวชี้วัดผสมของชั่วโมงแสงแดด ความสบายทางอุณหภูมิ และความเสี่ยงจากสภาพอากาศสุดขั้ว", inputs: ["sunshine hours", "temperature comfort", "extreme weather"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "เมืองที่จริงจังต้องให้คนเข้าถึงสุขภาพที่ดี การศึกษาที่ดี และทางผ่านที่เป็นธรรมสู่ชีวิตผู้ใหญ่",
        justification: "เสานี้ให้ความสำคัญกับคุณภาพและการเข้าถึงจริง ไม่ใช่นับจำนวนสถาบันอย่างเดียว",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "คุณภาพของระบบสุขภาพ", weight: 8, description: "amenable mortality ศักยภาพของระบบ และการเข้าถึงการรักษาที่มีประสิทธิผล", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "คุณภาพของการศึกษา", weight: 6, description: "ผลลัพธ์การเรียนรู้ การจบการศึกษา และสายทักษะ", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "โอกาสที่เท่าเทียมและความเป็นธรรมในการกระจาย", weight: 4, description: "ช่องว่างทางเพศ NEET และสัญญาณความเป็นธรรมในการกระจายโอกาส", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "การต้อนรับ การอยู่ร่วมกันได้ และการอ่านตัวเองออกในเมือง เป็นส่วนหนึ่งของผลิตภัณฑ์ที่เมืองสร้างขึ้น",
        justification: "นี่คือพื้นที่ที่เมืองที่เป็นมิตรสามารถชนะเมืองที่เย็นชาได้ แม้ทั้งคู่จะมีระบบจัดการที่ดี",
        citations: [1, 14, 16],
        metrics: [
          { name: "ชีวิตสาธารณะและพลังทางวัฒนธรรม", weight: 7, description: "third places ความต่อเนื่องทางประวัติศาสตร์ และ visitor pull ที่ถูกตรวจด้วย civic strain", inputs: ["venues", "events", "public attention", "visitor flow"] },
          { name: "การต้อนรับและความรู้สึกเป็นส่วนหนึ่ง", weight: 6, description: "ความรู้สึกต้อนรับ ความผูกพันของผู้อยู่อาศัย และการใช้งานหลายภาษา", inputs: ["social listening", "testimony audit", "multilingual services"] },
          { name: "ความเปิดกว้างและพหุนิยม", weight: 4, description: "การอยู่ร่วมกันได้อย่างลื่นไหล การเข้าถึงตลาดอย่างเท่าเทียม และเสรีภาพในการใช้ชีวิต", inputs: ["legal openness", "discrimination proxy", "market-access signal"] },
          { name: "ความเชื่อมั่นต่ออนาคตจากอัตราเกิด", weight: 2, description: "ใช้อัตราการเกิดรวมเป็นสัญญาณเชิงบริบทที่มีน้ำหนักเบา ไม่ใช่ตัวตัดสินหลักของคุณภาพชีวิตเมือง", inputs: ["World Bank TFR"] },
          { name: "เสรีภาพพลเมืองและศักดิ์ศรี", weight: 4, description: "ค่าเฉลี่ยถ่วงน้ำหนัก: 0.4 × HRMI Empowerment + 0.3 × Freedom House FIW + 0.3 × V-Dem Liberal Democracy Index (×100) คะแนนสูง = เสรีภาพพลเมืองและสิทธิการเมืองมากกว่า", inputs: ["HRMI Empowerment score", "Freedom House FIW", "V-Dem LDI"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "เมืองไม่ควรเพียงลดความทุกข์ แต่ต้องสร้างความทะเยอทะยาน การประดิษฐ์ และพลังทางเศรษฐกิจเชิงผลิตภาพด้วย",
        justification: "เสานี้ป้องกันไม่ให้ SLIC สับสนระหว่างความสงบกับความชะงัก หรือความสบายกับความสามารถในการแข่งขัน",
        citations: [2, 10, 16],
        metrics: [
          { name: "พลวัตของผู้ประกอบการ", weight: 6, description: "การเกิดของธุรกิจใหม่และความเร็วของกิจกรรมเชิงผลิตภาพในเมือง", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "ความเข้มข้นของนวัตกรรมและการวิจัย", weight: 5, description: "สิทธิบัตร ความลึกของการวิจัย และความสามารถของเมืองในการสร้างแนวคิดใหม่", inputs: ["patents", "R&D", "research institutions"] },
          { name: "พลังเศรษฐกิจและบริบทเชิงผลิตภาพ", weight: 5, description: "สัญญาณการลงทุน บริบทเศรษฐกิจเชิงผลิตภาพ และ runway ทางเศรษฐกิจของเมือง", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "แรงเสียดทานด้านการบริหารและการลงทุน", weight: 4, description: "ความยุ่งยากด้านราชการ ความไม่แน่นอน หรือภาระใบอนุญาตที่ขัดขวางการลงมือทำ", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "โปรโตคอลการจัดอันดับ",
      title: "เมืองเข้าระบบ อยู่ในระบบ และถูกเผยแพร่อย่างไร",
      summary:
        "การจัดอันดับต้องจัดการข้อมูลขาดหายและความต่างของขนาดเมืองอย่างซื่อสัตย์ เมืองที่ดังไม่ควรได้สิทธิพิเศษ และเมืองที่ข้อมูลบางก็ไม่ควรมีความแม่นยำปลอม",
    },
    rules: [
      {
        title: "ใช้ functional urban area ไม่ใช่แค่เขตเทศบาล",
        body: "SLIC วัดเมืองตามตลาดแรงงานและพื้นที่บริการจริงของเมือง ไม่ใช่แค่แกนเมืองแบบทางการ",
        citations: [12],
      },
      {
        title: "มีสูตรทางการเพียงสูตรเดียว",
        body: "บอร์ดสาธารณะใช้สูตรเดียว ส่วนการปรับน้ำหนักโดยผู้ใช้อาจมีได้ภายหลังในฐานะเครื่องมือสำรวจ ไม่ใช่อันดับทางการ",
        citations: [1],
      },
      {
        title: "ต้องผ่าน coverage gate ก่อนถูกจัดอันดับ",
        body: "เมืองจะติดอันดับได้ต่อเมื่อ coverage แบบถ่วงน้ำหนักผ่านเกณฑ์ และไม่มีเสาใดว่างจนวิกฤต มิฉะนั้นจะอยู่ใน watchlist เท่านั้น",
        citations: [1, 14, 15],
      },
      {
        title: "ความปลอดภัยวัดจากผล ไม่ใช่จากกล้อง",
        body: "จำนวนกล้องหรือ smart-city theatre ไม่ได้เพิ่มคะแนนเอง สิ่งที่เพิ่มคะแนนคืออันตรายที่ลดลงและความมั่นใจในชีวิตประจำวัน",
        citations: [1, 3],
      },
      {
        title: "ความเปิดกว้างวัดจากผลกระทบที่เกิดขึ้นจริง",
        body: "SLIC ไม่จัดอันดับศาสนาหรืออัตลักษณ์โดยตรง แต่ดูว่าคนสามารถอยู่ ทำงาน และเข้าร่วมทางเศรษฐกิจได้โดยมี friction ต่ำเพียงใด",
        citations: [1, 14],
      },
      {
        title: "แรงดึงดูดของผู้มาเยือนเป็นเพียงบริบท",
        body: "visitor flow จะถูกนับเป็นสัญญาณทางวัฒนธรรมก็ต่อเมื่อผ่านการตรวจด้านความแออัด ความปลอดภัย นิเวศวิทยา และพื้นที่ของผู้อยู่อาศัย",
        citations: [1],
      },
      {
        title: "V3.3: อันดับคะแนนล้วน แยกจากชั้นสาธารณะ",
        body: thaiTierProtocolRule,
        citations: [],
      },
      {
        title: "V3.3: สิงคโปร์และกรุงเทพฯ ภายใต้กติกาชั้นสาธารณะล่าสุด",
        body: thaiSingaporeRule,
        citations: [],
      },
    ],
    sourceSection: {
      eyebrow: "ลำดับชั้นของแหล่งข้อมูล",
      title: "โมเดลเชื่อข้อมูลประเภทไหนก่อน",
      summary:
        "ลำดับนี้ทำให้เห็นระยะห่างของข้อมูลอย่างเปิดเผย ข้อมูลระดับเมืองมีน้ำหนักมากกว่าข้อมูลระดับชาติ และ proxy ที่ผ่านการ audit ดีกว่าตัวเลขสะดวกใช้ที่ไม่มีที่มา",
    },
    sourceTiers: thaiSourceTiers,
    worksheetSection: {
      eyebrow: "ตารางคะแนน",
      title: "ตารางรายเมืองที่อยู่เบื้องหลังอันดับ",
      summary:
        "เมื่อโหลดชุดเมืองแล้ว คอลัมน์เหล่านี้จะถูกเติมและโมเดลจะคำนวณคะแนนเสาหลัก คะแนน SLIC และ coverage grade ออกมา",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "เอกสารอ้างอิง",
      title: "คลังแหล่งข้อมูลที่รองรับกรอบนี้",
      summary:
        "หน้า methodology อ้างถึงทั้ง benchmarking memo ภายในและเอกสารทางการที่จะใช้ตรึงเวิร์กบุ๊กและโมเดลสาธารณะ",
    },
    references: methodologyReferences,
  },
  zh: {
    hero: {
      eyebrow: "Methodology paper",
      title: "SLIC 方法论",
      strapline:
        "一套把宜居性、归属感、抱负与真实生活空间写成明确数学结构的城市排名方法。",
      intro:
        "SLIC 之所以存在，是因为主流城市排名往往过度奖赏财富、制度抛光与品牌声望，却低估安全、生活压力、真实可负担性、包容度、商业活力与城市日常肌理。SLIC 因此公开它的分数公式、数据来源层级、覆盖规则以及可以被审计和复现的城市工作表。",
      doctrineTitle: "官方原则",
      doctrineBody:
        "排名那些让人可以生活得好、获得归属、并且变得更强的城市。SLIC 不是 GDP 榜，不是炫技榜，也不是只谈舒适的榜单。",
      contextTitle: "国家层面的背景变量",
      contextItems: [
        "人均 GDP（PPP）",
        "GDP 增长",
        "基尼系数",
        "用户输入的税率",
        "私人消费 PPP 因子",
      ],
      explicitTitle: "公开公式明确写出的东西",
      explicitItems: [
        "安全按结果计分，而不是按监控密度计分。",
        "包容度按低摩擦共处与平等市场准入计分。",
        "商业与增长是公开分数项，而不是藏在背景里的偏好。",
      ],
    },
    readerGuide: {
      eyebrow: "阅读指南",
      title: "既给普通读者看，也给技术读者复现",
      summary:
        "这份方法论必须同时服务两类人：想看论点的人，以及想把这套方法用到自己城市清单上的人。",
      layTitle: "面向普通读者",
      technicalTitle: "面向技术读者",
      laySteps: [
        "把五个支柱读成五个问题：我能不能在这里负担生活？能不能安全呼吸和移动？能不能建立能力？能不能获得归属？这座城市还会不会激发抱负？",
        "把技术看成支撑层。只有改善真实生活时，它才得分。",
        "谨慎阅读高价名城。系统强，不代表压力、住房负担与共同体问题会自动消失。",
        "认真看待二线城市。SLIC 就是为了让它们在真正提供价值、好客与生活空间时有机会赢。",
      ],
      technicalSteps: [
        "把城市定义为 functional urban area 或最可辩护的都会区单元。",
        "优先收集城市级数据，再到次国家层级，最后才用国家级 fallback，并记录 source tier。",
        "在任何打分前，先计算税后 PPP 可支配生活空间；工资本身不够。",
        "在 P5/P95 做 winsorization，统一缩放到 0-100，对负向指标反向计分，并把 coverage grade 与榜单一起发布。",
      ],
    },
    critiqueSection: {
      eyebrow: "旧排名的问题",
      title: "SLIC 想修正的偏差",
      summary:
        "现有城市指数有研究价值，但它们大多建立在 SLIC 并不完全接受的城市理论上。",
    },
    critiques: [
      {
        title: "声望常常被误当成宜居性",
        body: "很多榜单会结构性地抬高本来就富有、规范化程度高、品牌清晰的城市。",
        implication: "SLIC 把真实生活可行性与城市声望拆开，并把 GDP 当作背景而不是命运。",
        citations: [1, 2, 14],
      },
      {
        title: "数据稀缺会让被低估的城市在计分前就消失",
        body: "很多二线城市不是因为不值得比较，而是因为现成国际数据不方便，直接被排除在样本之外。",
        implication: "SLIC 保留 watchlist、公布 coverage grade，并公开 source ladder，而不是静悄悄删掉城市。",
        citations: [1, 14, 15],
      },
      {
        title: "安全常被用 smart 工具替代",
        body: "App、平台和监控硬件可以很显眼，但真实城市仍然可能不安全或压迫感很强。",
        implication: "SLIC 直接看伤害、受害与日常信心；摄像头本身不加分。",
        citations: [1, 11, 13],
      },
      {
        title: "生活压力通常被低估",
        body: "税后剩余收入、债务、工时与自杀率才是真实城市生活的核心变量，但常常被弱化甚至缺席。",
        implication: "SLIC 给压力与生活空间一个完整的公开权重。",
        citations: [1, 2, 3, 7],
      },
      {
        title: "游客量有信息，但绝不是自动加分",
        body: "高旅游量完全可能与拥堵、犯罪或剥夺性的城市条件同时存在。",
        implication: "SLIC 只在游客量通过安全、生态与居民生活空间检查后，把它当作文化需求信号使用。",
        citations: [1],
      },
    ],
    processSection: {
      eyebrow: "方法验证",
      title: "模型在会议、论坛与工作坊里被反复压测",
      summary:
        "SLIC 不是一次性做出来的表格，而是在解释、争论、测试与修正中逐渐冻结成公开公式的。",
      figures: [
        {
          id: "process-stage-zh",
          src: "/photos/report-people-stage.jpg",
          alt: "城市议题公开活动中的舞台场景。",
          caption: "这套框架必须经得起公开说明，而不只是内部自洽。",
          width: 1440,
          height: 1440,
        },
        {
          id: "process-meeting-zh",
          src: "/photos/report-people-meeting.jpg",
          alt: "围桌会议场景，桌上有电脑与麦克风。",
          caption: "假设在真实工作会议中被检验，数据选择与城市逻辑都要能被说明。",
          width: 1439,
          height: 1085,
        },
        {
          id: "process-workshop-zh",
          src: "/photos/report-people-workshop.jpg",
          alt: "讲者面对听众进行工作坊说明。",
          caption: "试点讨论帮助我们把“看起来漂亮”的指标与真正解释城市生活的指标区分开来。",
          width: 2048,
          height: 1365,
        },
      ],
    },
    flowSection: {
      eyebrow: "评分流程",
      title: "原始指标如何变成公开 SLIC 分数",
      summary:
        "评分流程故意保持短而透明：原始指标、标准化指标分数、支柱聚合，最后才是总分。",
      stages: [
        { id: "raw-zh", title: "原始指标", body: "采集城市、都会区、次国家与国家层级信号，并标注 source tier。", formula: "x_m(c)" },
        { id: "normalized-zh", title: "标准化", body: "在 P5/P95 做 winsorization，缩放到 0-100，并对负向变量反向计分。", formula: "s_m(c)" },
        { id: "pillars-zh", title: "支柱聚合", body: "用公开的内部权重把各指标折叠成支柱分数。", formula: "P_p(c) = Sum observed alpha_(p,m) x s_m(c) / Sum observed alpha_(p,m)" },
        { id: "final-zh", title: "最终分数", body: "应用唯一的公开公式，并附上 coverage grade。", formula: "SLIC(c)" },
      ],
    },
    remoteSensingSection: {
      eyebrow: "遥感层",
      title: "当地面传感器过于稀疏时，卫星证据会把城市框架拉宽",
      summary:
        "当地面监测站数量太少、分布太偏或只能描述局部点位时，SLIC 会使用遥感层来补足整个城市气团与生态边界的空间背景。卫星层是支持性证据，不是神谕。",
      quantifyTitle: "卫星层帮助量化什么",
      quantifyItems: [
        "更大城市气团中的气溶胶负荷与大气成分",
        "通过 NDVI 类地表产品观察植被与绿量缓冲",
        "高密度建成区周边的地表覆盖、水分与表面环境",
        "地方站网可能遗漏的区域性污染漂移",
      ],
      qualifyTitle: "分析师仍需解释什么",
      qualifyItems: [
        "地形、海岸线、风场与季节性烟霾路径",
        "局部热点与全城状态之间的区别",
        "城市形态、街谷效应，以及居民真实感受到的暴露",
        "官方环保记录、证词与现场城市证据的交叉校验",
      ],
      workflowTitle: "卫星层如何进入方法",
      workflowStages: [
        {
          id: "remote-official-zh",
          title: "官方城市与环境记录",
          body: "只要存在可信的地面传感器、环境报告与公用事业记录，它们仍然是第一层证据。",
        },
        {
          id: "remote-context-zh",
          title: "遥感校正与情境补充",
          body: "Copernicus、JAXA 与公开 Landsat 衍生层帮助解释气溶胶传输、植被覆盖、地表压力以及城市生态边界。",
        },
        {
          id: "remote-listening-zh",
          title: "社交聆听与城市证词",
          body: "居民抱怨、访客证词与讨论强度帮助判断地图上的问题是否真正被生活中的人感受到。",
        },
        {
          id: "remote-judgement-zh",
          title: "最终城市判断",
          body: "SLIC 分析师把三层一起阅读，让卫星证据支持判断，而不是假装可以替代地面现实。",
        },
      ],
      citations: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    },
    equationSection: {
      eyebrow: "数学核心",
      title: "真正使用的公式层",
      summary:
        "公开分数使用固定权重、明确方向性与可复制的公式。页面上的数学不是装饰，而是方法本身。",
      groups: [
        {
          id: "official-zh",
          eyebrow: "公开分数",
          title: "官方发布公式",
          summary: "这是网站与工作簿共用的公开分数骨架。",
          equations: [
            {
              id: "official-score-zh",
              title: "官方 SLIC 分数",
              formula:
                officialSlicFormula,
              explanation:
                "公开分数不是简单加权平均，而是先做五支柱加权 AMPI，再减去覆盖度惩罚。",
              citations: [1],
            },
            {
              id: "official-ampi-zh",
              title: "AMPI 的展开形式",
              formula:
                officialAmpiFormula,
              explanation:
                "公开 scorer 先求五个支柱的加权均值，再减去以该均值标准化后的跨支柱方差惩罚，所以单维度特别强的城市不会被当成全面宜居。",
              citations: [1],
            },
            {
              id: "disposable-income-zh",
              title: "税后 PPP 可支配生活空间",
              formula:
                "DI_ppp(c) = ((GrossIncome(c) x (1 - TaxRate(country(c)))) - Rent(c) - Utilities(c) - Transit(c) - Internet(c) - Food(c)) / PPPPrivateConsumptionFactor(country(c))",
              explanation:
                "这是最核心的生活空间项：把税后扣除必需支出后的剩余收入通过 PPP 因子转换一次，得到可比较的购买力空间。",
              citations: [2, 7],
            },
          ],
        },
        {
          id: "normalization-zh",
          eyebrow: "指标机制",
          title: "标准化与缺失数据逻辑",
          summary: "只有在方向性与缺失性都被明确处理后，城市原始指标才可以被聚合。",
          equations: [
            {
              id: "metric-normalization-zh",
              title: "winsorized 指标分数",
              formula:
                "If dir(m) = positive:\n  s_m(c) = 100 x clamp((winsor(x_m(c)) - P5_m) / (P95_m - P5_m), 0, 1)\nIf dir(m) = negative:\n  s_m(c) = 100 x clamp((P95_m - winsor(x_m(c))) / (P95_m - P5_m), 0, 1)",
              explanation:
                "正向指标直接缩放，负向指标则反转分子，以保证高分永远意味着更好的城市结果。",
              citations: [1],
            },
            {
              id: "coverage-score-zh",
              title: "加权覆盖度",
              formula:
                "Cov_p(c) = Sum over metrics m of alpha_(p,m) x cov_m(c) / Sum over metrics m of alpha_(p,m)\nCov(c) = (25 Cov_pressure + 22 Cov_viability + 18 Cov_capability + 15 Cov_community + 20 Cov_creative) / 100",
              explanation:
                "覆盖度按指标重要性加权，而不是按字段个数计算。关键数据缺失不能被一堆次要字段掩盖。",
              citations: [1, 14, 15],
            },
          ],
        },
        {
          id: "subscores-zh",
          eyebrow: "公开子分数",
          title: "读者必须看得见的几个支柱",
          summary: "下面这些可见支柱公式与工作簿里用于公开分数的结构保持一致。",
          equations: [
            {
              id: "safety-viability-zh",
              title: "Growth 支柱",
              formula:
                growthPillarFormula,
              explanation:
                "这一支柱直接聚合现实生活压力项。Economic growth momentum 仍然可见，但在当前公开模型里只是 diagnostic，不进入 aggregate。",
              citations: [1, 2, 3, 7],
            },
            {
              id: "community-tolerance-zh",
              title: "Tolerance composite",
              formula:
                toleranceCompositeFormula,
              explanation:
                "Community 使用公开声明的 openness composite，而不是拿单一 proxy 直接代替城市层证据。",
              citations: [1, 14, 16, 35],
            },
            {
              id: "business-growth-zh",
              title: "Economic vitality composite",
              formula:
                economicVitalityFormula,
              explanation:
                "宏观背景仍然重要，但它被约束在一个公开 composite 里面，而不是悄悄压过城市层证据。",
              citations: [2, 10, 16],
            },
          ],
        },
      ],
    },
    glossarySection: {
      eyebrow: "符号表",
      title: "每个符号都是什么意思",
      summary:
        "记号系统故意保持紧凑，每个符号只定义一次，方便外部团队复现或审计这套方法。",
      symbols: [
        { symbol: "c", definition: "城市或 functional urban area", explanation: "被评分的城市单元。" },
        { symbol: "m", definition: "指标索引", explanation: "原始变量，如租房负担、PM2.5 或开业便利度。" },
        { symbol: "p", definition: "支柱索引", explanation: "五个公开支柱之一。" },
        { symbol: "x_m(c)", definition: "原始指标值", explanation: "城市 c 在指标 m 上的原始观测值。" },
        { symbol: "winsor(.)", definition: "winsorization 算子", explanation: "在计分前把极端值压回 P5/P95 区间。" },
        { symbol: "P5_m, P95_m", definition: "百分位锚点", explanation: "指标 m 的低位与高位基准。" },
        { symbol: "s_m(c)", definition: "标准化指标分数", explanation: "方向统一后的 0-100 分数。" },
        { symbol: "alpha_(p,m)", definition: "支柱内指标权重", explanation: "指标 m 在支柱 p 中的贡献强度。" },
        { symbol: "cov_m(c)", definition: "指标覆盖度", explanation: "表示某一指标所需证据中已被观察到的份额，取值 0 到 1。" },
        { symbol: "w_p", definition: "公开支柱权重", explanation: "最终总分中各支柱的固定权重。" },
        { symbol: "DI_ppp(c)", definition: "PPP 可支配生活空间", explanation: "扣税与必需支出后的 PPP 剩余空间。" },
      ],
    },
    workedExampleSection: {
      eyebrow: "计算示例",
      title: "公开数据行的完整演算",
      summary:
        "这个例子直接使用已经发布的真实城市行，因此这里展示的是可审计的算术，而不是装饰性的示意数学。",
      example: {
        city: `${workedExampleDisplayName}公开数据行`,
        note: "下列数字全部取自 `publishedRankingData.json` 的当前公开快照，并按公开评分卡上的显示方式取整。",
        inputs: [
          { label: "DI_ppp raw", value: workedExampleDiRaw, note: `${workedExampleDisplayName}已发布的可支配收入原始输入` },
          { label: "Personal safety raw", value: workedExample?.safety?.raw != null ? String(workedExample.safety.raw) : "—", note: "用于负向标准化示例的凶杀 / 伤害原始输入" },
          { label: "Pressure pillar", value: formatOneDecimal(workedExample?.pillarScores?.pressure ?? undefined), note: "按已观察到的计分指标加权平均后的支柱分数" },
          { label: "Viability pillar", value: formatOneDecimal(workedExample?.pillarScores?.viability ?? undefined), note: "已发布支柱分数" },
          { label: "Capability pillar", value: formatOneDecimal(workedExample?.pillarScores?.capability ?? undefined), note: "已发布支柱分数" },
          { label: "Community pillar", value: formatOneDecimal(workedExample?.pillarScores?.community ?? undefined), note: "已发布支柱分数" },
          { label: "Creative pillar", value: formatOneDecimal(workedExample?.pillarScores?.creative ?? undefined), note: "已发布支柱分数" },
        ],
        steps: [
          {
            title: "负向指标标准化示例",
            formula: workedExampleSafetyFormula,
            result: `SafetyScore = ${formatOneDecimal(workedExample?.safety?.scoreRounded ?? undefined)}`,
            explanation: `${workedExampleDisplayName}的 personal safety 输入属于负向变量，因此分子需要反向；这里的 P5/P95 边界来自公开 scorer 使用的冻结 \`normStats\`。`,
          },
          {
            title: "Growth 支柱的加权平均",
            formula: workedExamplePressureFormula,
            result: `Growth = ${formatOneDecimal(workedExample?.pressure?.scoreRounded ?? undefined)}`,
            explanation: "分母只包含已观察到的计分指标。Economic growth momentum 仍可作为可见诊断项出现，但它不进入当前公开聚合公式。",
          },
          {
            title: "跨支柱加权均值与方差",
            formula: workedExampleMeanFormula,
            result: `mu = ${formatThreeDecimals(workedExample?.overall?.weightedMeanExact ?? undefined)}, var = ${formatTwoDecimals(workedExample?.overall?.weightedVarianceExact ?? undefined)}`,
            explanation: `这就是跨支柱失衡惩罚的真实步骤。如果${workedExampleDisplayName}保持同样的加权均值，但各支柱更均衡，它的最终分数会更高。`,
          },
          {
            title: "AMPI 与最终公开分数",
            formula: workedExampleAmpiFormula,
            result: `SLIC = ${formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined)}`,
            explanation: `最终分数低于加权均值，因为 AMPI 会惩罚支柱失衡；同时${workedExampleDisplayName}拥有 ${workedExample?.overall?.coverageGrade ?? "—"} 级覆盖度，因此没有额外覆盖扣分。`,
          },
        ],
        finalScore: formatOneDecimal(workedExample?.overall?.slicScoreRounded ?? undefined),
        conclusion:
          "这个例子的重点是方法诚实：再强的 Viability 与 Capability，也不会自动抹去较弱的 Community。正是方差惩罚，让 SLIC 不会把单维度强项误当成可彼此替代的全面宜居。",
      },
    },
    modelSection: {
      eyebrow: "方法边界",
      title: "公开分数只有一个模型，诊断层与之分开",
      summary:
        "公开分数来自唯一一套已声明的 AMPI 模型。诊断项可以存在，也可以可见，但它们不会暗中改写公开总分。",
      families: [
        {
          id: "weighted-zh",
          title: "官方公开模型",
          formula: officialSlicFormula,
          role: "公开分数",
          explanation: "这是唯一的官方公开引擎：固定权重、冻结的 winsorized 标准化、支柱内加权均值、支柱间加权 AMPI，以及明确的 coverage 惩罚。",
        },
        {
          id: "diagnostics-zh",
          title: "内部诊断",
          formula: "Diagnostics(c) do not modify SLIC(c)",
          role: "非计分检查",
          explanation: "一致性检查、结构检验与分析师复核可以标出薄弱输入或不合理模式，但不会给公开分数加入隐藏加分或惩罚。",
        },
        {
          id: "profile-match-zh",
          title: "探索性画像匹配",
          formula: "Match(c,u) = similarity(profile(c), preference(u))",
          role: "仅供探索",
          explanation: "蜘蛛网交互不是公开排名本身，而是把城市五支柱的分布形状与用户声明的偏好结构进行比较。",
        },
      ],
    },
    countryContextSection: {
      eyebrow: "国家背景项",
      title: "宏观实力重要，但不能主宰城市排名",
      summary:
        "人均 GDP、增长、基尼、PPP 与税率都重要，但它们在 SLIC 中只作为调整项或背景项，而不是头号决定因素。",
    },
    weightChartLabel: "属于官方分数",
    pillarsSection: {
      eyebrow: "官方支柱",
      title: "构成总分的五个公开支柱",
      summary:
        "下方每个支柱都与工作簿中计算公开分数的权重和结构保持一致。",
    },
    pillars: [
      {
        id: "pressure",
        name: "Growth",
        weight: 25,
        thesis: "经济活力决定城市轨迹。增长吸引资本主义和市场力量来塑造可负担性——除非政府提供福利作为平衡。",
        justification: "这一支柱惩罚虚假繁荣，并将可支配空间放在评分核心。",
        citations: [2, 3, 7],
        metrics: [
          { name: "税后 PPP 可支配生活空间", weight: 9, description: "税后扣除必需支出后的剩余空间，通过 PPP 因子转换一次后再做跨城市比较。", inputs: ["gross income", "tax rate", "rent", "utilities", "internet", "transport", "food", "PPP factor"] },
          { name: "住房价格压力", weight: 5, description: "城市市场每平方英尺购房价格。价格越高，越压缩本地收入者建立生活的实际空间。", inputs: ["USD per square foot", "city market purchase price"] },
          { name: "家庭债务负担", weight: 4, description: "债务相对于可支配收入或最佳可得 proxy 的比率。", inputs: ["household debt", "disposable income"] },
          { name: "工时压力", weight: 4, description: "平均工时与持续过劳负担。长期工作压力越高，得分越低。", inputs: ["weekly hours", "overwork share"] },
          { name: "自杀与严重心理压力", weight: 3, description: "严重心理压力的公共卫生信号。自杀率或同等压力 proxy 越高，得分越低。", inputs: ["age-standardized suicide rate"] },
          { name: "经济压力（Hanke Misery Index）", weight: 2, description: "Hanke Annual Misery Index 2025：2×失业率 + 通货膨胀率 + 银行贷款利率 − 实际人均 GDP 增速。国家层面数据。分数越低代表宏观经济压力越小。", inputs: ["unemployment rate", "CPI inflation", "bank lending rate", "real GDP/capita growth"] },
        ],
      },
      {
        id: "viability",
        name: "Viability",
        weight: 22,
        thesis: "日常生活应当更安全、更能呼吸、更容易移动，而且基础系统要能运转。",
        justification: "这部分奖励的是城市系统真正带来的结果，而不是系统本身的炫耀性存在。",
        citations: [3, 5, 11, 13, 17],
        metrics: [
          { name: "个人安全", weight: 5, description: "伤害、严重犯罪、游客受害与夜间安全信号。", inputs: ["homicide", "serious violent crime", "victimization", "night-safety proxy"] },
          { name: "交通可达性与通勤负担", weight: 5, description: "交通覆盖、通勤时间与晚间可用性。", inputs: ["GTFS", "commute time", "coverage"] },
          { name: "清洁空气", weight: 4, description: "PM2.5、严重污染暴露以及 CAMS / OpenAQ 支撑。", inputs: ["PM2.5", "exceedance", "aerosol context"] },
          { name: "供水、卫生与公用事业可靠性", weight: 4, description: "饮水、卫生与基础服务稳定性。", inputs: ["WASH access", "interruptions", "compliance"] },
          { name: "数字基础设施", weight: 4, description: "宽带质量、可负担性与光纤准备度。", inputs: ["fixed broadband", "affordability", "internet performance"] },
          { name: "气候与日照宜居性", weight: 7, description: "由日照时数、温度舒适度与极端天气暴露构成的综合指标。", inputs: ["sunshine hours", "temperature comfort", "extreme weather"] },
        ],
      },
      {
        id: "capability",
        name: "Capability",
        weight: 18,
        thesis: "一座严肃的城市要让人接触到好的医疗、好的教育，以及公平的成长通道。",
        justification: "这里看的是质量与可及性结果，不只是机构数量。",
        citations: [3, 6, 8, 9, 14, 15],
        metrics: [
          { name: "医疗质量", weight: 8, description: "可避免死亡、供给能力与有效医疗可达性。", inputs: ["avoidable mortality", "quality outcomes", "provider capacity"] },
          { name: "教育质量", weight: 6, description: "学习结果、完成率与技能形成。", inputs: ["PISA", "UIS outcomes", "completion", "skills pipeline"] },
          { name: "机会平等与分配公平", weight: 4, description: "性别差距、青年 NEET 与分配公平信号。", inputs: ["gender data", "NEET", "Gini", "labour gaps"] },
        ],
      },
      {
        id: "community",
        name: "Community",
        weight: 15,
        thesis: "好客、社会可读性与和平共处，本来就是城市产品的一部分。",
        justification: "这让更欢迎人的城市有机会压过更冷的城市，即使它们行政能力都不错。",
        citations: [1, 14, 16],
        metrics: [
          { name: "文化与公共生活活力", weight: 7, description: "第三空间、历史连续性与经 civic strain 校正后的游客吸引力。", inputs: ["venues", "events", "public attention", "visitor flow"] },
          { name: "好客与归属", weight: 6, description: "欢迎感、居民依附与多语言可用性。", inputs: ["social listening", "testimony audit", "multilingual services"] },
          { name: "包容与多元共处", weight: 4, description: "低摩擦共处、平等市场准入与生活方式自由。", inputs: ["legal openness", "discrimination proxy", "market-access signal"] },
          { name: "生育乐观度", weight: 2, description: "总和生育率作为一个轻量的社会预期信号，不应被误读成城市生活质量的主导指标。", inputs: ["World Bank TFR"] },
          { name: "公民自由与尊严", weight: 4, description: "综合指标：0.4 × HRMI Empowerment + 0.3 × Freedom House FIW + 0.3 × V-Dem 自由民主指数（×100）。分数越高代表公民自由与政治权利越有保障。", inputs: ["HRMI Empowerment score", "Freedom House FIW", "V-Dem LDI"] },
        ],
      },
      {
        id: "creative",
        name: "Creative",
        weight: 20,
        thesis: "城市不应只减少痛苦，还要产生抱负、发明与生产性的经济能量。",
        justification: "这一支柱防止 SLIC 把平静误读成停滞，把舒适误读成竞争力。",
        citations: [2, 10, 16],
        metrics: [
          { name: "创业活力", weight: 6, description: "新企业形成与本地生产性进入的速度。", inputs: ["new business density", "firm formation", "entrepreneurial activity"] },
          { name: "创新与研究强度", weight: 5, description: "专利、研究深度与城市生成新想法的能力。", inputs: ["patents", "R&D", "research institutions"] },
          { name: "经济活力与生产性背景", weight: 5, description: "投资信号、生产性宏观背景与城市经济跑道。", inputs: ["investment signal", "GDP per capita PPP", "GDP growth"] },
          { name: "行政与投资摩擦", weight: 4, description: "阻碍生产性行动的官僚负担、审批拖拽或规则不稳。", inputs: ["administrative friction", "permitting burden", "rule consistency"] },
        ],
      },
    ],
    protocolSection: {
      eyebrow: "排名协议",
      title: "城市如何进入、保留并被发布",
      summary:
        "排名必须诚实处理缺失数据与城市规模差异。知名城市不会自动入围，数据很薄的城市也不能拥有虚假的精确度。",
    },
    rules: [
      {
        title: "使用 functional urban area，而不是市政边界",
        body: "SLIC 尽可能按真实劳动力市场与服务范围来界定城市，而不是按狭窄的行政核心。",
        citations: [12],
      },
      {
        title: "只有一套官方权重",
        body: "公开榜单只用一套公式。用户自定义权重未来可以作为探索工具存在，但不能取代官方排名。",
        citations: [1],
      },
      {
        title: "必须先通过 coverage gate",
        body: "只有在加权覆盖率过线且没有关键支柱严重空缺时，城市才会正式上榜，否则只能留在 watchlist。",
        citations: [1, 14, 15],
      },
      {
        title: "安全按结果计分，不按监控计分",
        body: "摄像头数量或 smart-city 表演本身不加分。更低的伤害与更高的日常信心才加分。",
        citations: [1, 3],
      },
      {
        title: "包容按可观察效果计分",
        body: "SLIC 不直接给宗教或身份打分，而是看人们能否以低摩擦、平等与现实自由在城市里生活、工作与参与经济。",
        citations: [1, 14],
      },
      {
        title: "游客需求只是背景信号",
        body: "游客流量只有在通过拥挤、安全、生态与居民空间检查后，才会被当作文化需求信号保留。",
        citations: [1],
      },
      {
        title: "V3.3: 纯分数排名与公开分层分离",
        body: chineseTierProtocolRule,
        citations: [],
      },
      {
        title: "V3.3: 新加坡与曼谷在当前分层规则下的结果",
        body: chineseSingaporeRule,
        citations: [],
      },
    ],
    sourceSection: {
      eyebrow: "来源层级",
      title: "模型最先信任什么数据",
      summary:
        "这个层级公开显示数据距离城市有多近。城市级数据优先于国家代理值，而经审计的 proxy 优于没有出处的便利数字。",
    },
    sourceTiers: chineseSourceTiers,
    worksheetSection: {
      eyebrow: "评分工作表",
      title: "支撑排名的逐城表格",
      summary:
        "城市宇宙一旦确定，下面这些列会被填入，模型再计算支柱分、总分与 coverage grade。",
    },
    worksheetColumns,
    referencesSection: {
      eyebrow: "参考资料",
      title: "支撑这套框架的来源库",
      summary:
        "方法论页面同时引用内部 benchmarking memo 与会锚定工作簿和公开模型的官方文档。",
    },
    references: methodologyReferences,
  },
};

function injectLocalizedInputs(data: MethodologyData, locale: Locale): MethodologyData {
  const inputsMap = localizedInputs[locale];
  if (!inputsMap) {
    return data;
  }
  return {
    ...data,
    pillars: data.pillars.map((pillar) => ({
      ...pillar,
      metrics: pillar.metrics.map((metric) => ({
        ...metric,
        inputs: inputsMap[metric.name] ?? metric.inputs,
      })),
    })),
  };
}

export function getMethodologyData(locale: Locale): MethodologyData {
  let rawData: MethodologyData;
  if (locale === "ko") {
    rawData = methodologyDataKo;
  } else if (locale === "ja") {
    rawData = methodologyDataJa;
  } else {
    rawData = coreMethodologyContent[locale as CoreLocale] ?? coreMethodologyContent.en;
  }
  return injectLocalizedInputs(rawData, locale);
}
