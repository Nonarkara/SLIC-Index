import publishedRankingData from "./data/publishedRankingData.json";
import { getDisplayAlphaCityExclusions, PUBLIC_TIER_RULES } from "./publicTierPolicy.js";
import type { MethodologyReference, WorksheetColumn } from "./types";

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

export const publishedCities = (publishedRankingData.cities ?? []) as MethodologyPublishedCity[];
export const methodologyFacts = ((publishedRankingData as { methodologyFacts?: MethodologyFacts }).methodologyFacts ?? {}) as MethodologyFacts;
export const workedExample = methodologyFacts.workedExample;
export const singaporeCity = publishedCities.find((city) => city.displayName === "Singapore");
export const bangkokCity = publishedCities.find((city) => city.displayName === "Bangkok");

export function formatOneDecimal(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(1) : "—";
}

export function formatTwoDecimals(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(2) : "—";
}

export function formatThreeDecimals(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(3) : "—";
}

export const officialSlicFormula = "SLIC(c) = max(0, AMPI_5pillar(c) - penalty(c))";
export const officialAmpiFormula =
  "mu(c) = (25 Pressure + 22 Viability + 18 Capability + 15 Community + 20 Creative) / 100\n" +
  "var(c) = (25(Pressure - mu)^2 + 22(Viability - mu)^2 + 18(Capability - mu)^2 + 15(Community - mu)^2 + 20(Creative - mu)^2) / 100\n" +
  "AMPI_5pillar(c) = mu(c) - var(c)/mu(c)";
export const growthPillarFormula =
  "Growth(c) = (8 DI_PPP + 5 HousingBurden + 2 DebtBurden + 4 WorkingTimePressure + 4 SuicideMentalStrain + 2 HankeMisery) / Sum observed weights";
export const toleranceCompositeFormula =
  "TolerancePluralism(c) = 0.4 EqualdexCountry + 0.3 FreedomHouseCountry + 0.3 ReverseHateCrime";
export const economicVitalityFormula =
  "EconomicVitality(c) = 0.5 InvestmentSignal + 0.3 GDPperCapitaPPP + 0.2 GDPGrowth";

export const workedExampleDisplayName = workedExample?.displayName ?? "Kaohsiung";
export const workedExampleSafetyFormula =
  workedExample?.safety?.raw != null &&
  workedExample?.safety?.p05 != null &&
  workedExample?.safety?.p95 != null
    ? `SafetyScore = 100 x (${formatTwoDecimals(workedExample.safety.p95)} - ${workedExample.safety.raw}) / (${formatTwoDecimals(workedExample.safety.p95)} - ${formatTwoDecimals(workedExample.safety.p05)})`
    : "SafetyScore = 100 x (P95 - raw) / (P95 - P05)";
export const workedExamplePressureFormula =
  workedExample?.pressure?.terms && workedExample.pressure.terms.length > 0 && workedExample?.pressure?.denominator
    ? `Growth = (${workedExample.pressure.terms.map((term) => `${term.weight}x${formatOneDecimal(term.scoreRounded ?? undefined)}`).join(" + ")}) / ${workedExample.pressure.denominator}`
    : "Growth = (weighted pressure numerator) / observed pressure weights";
export const workedExampleMeanFormula =
  workedExample?.weightedMeanTerms && workedExample.weightedMeanTerms.length > 0
    ? `mu = (${workedExample.weightedMeanTerms.map((term) => `${term.weight}x${formatOneDecimal(term.scoreRounded ?? undefined)}`).join(" + ")}) / 100 = ${formatThreeDecimals(workedExample?.overall?.weightedMeanExact ?? undefined)}\n` +
      `var = (25(Pressure-mu)^2 + 22(Viability-mu)^2 + 18(Capability-mu)^2 + 15(Community-mu)^2 + 20(Creative-mu)^2) / 100 = ${formatTwoDecimals(workedExample?.overall?.weightedVarianceExact ?? undefined)}`
    : "mu = weighted pillar mean\nvar = weighted pillar variance";
export const workedExampleAmpiFormula =
  workedExample?.overall
    ? `AMPI = mu - var/mu = ${formatThreeDecimals(workedExample.overall.weightedMeanExact ?? undefined)} - ${formatTwoDecimals(workedExample.overall.weightedVarianceExact ?? undefined)}/${formatThreeDecimals(workedExample.overall.weightedMeanExact ?? undefined)} = ${formatThreeDecimals(workedExample.overall.ampiExact ?? undefined)}\n` +
      `Coverage = ${formatTwoDecimals(workedExample.overall.coverageRounded ?? undefined)} -> grade ${workedExample.overall.coverageGrade ?? "—"} -> penalty = ${workedExample.overall.coveragePenalty ?? 0}\n` +
      `SLIC = ${formatOneDecimal(workedExample.overall.slicScoreRounded ?? undefined)}`
    : "AMPI = mu - var/mu\nCoverage -> grade -> penalty\nSLIC = published score";
export const workedExampleDiRaw = workedExample?.disposableIncomeRaw != null ? workedExample.disposableIncomeRaw.toFixed(2) : "—";
export const alphaCountryExclusionList = (PUBLIC_TIER_RULES.alphaCountryExclusions ?? []).join(", ") || "none";
export const alphaCityExclusionList = getDisplayAlphaCityExclusions().join(", ") || "none";
export const maxJapanCrossTier = PUBLIC_TIER_RULES.maxJapanAcrossPublicTiers ?? 1;

export const methodologyReferences: MethodologyReference[] = [
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

export const worksheetColumns: WorksheetColumn[] = [
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
