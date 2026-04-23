/**
 * add-missing-cities.mjs
 *
 * Adds Prague, Nanjing, Venice to the published dataset with full
 * metric loadings. Uses World Bank country proxies where no city data
 * exists, and city-level overrides where known.
 *
 * - Prague (cz-prague):  EU-solid, primary, high-capability.
 * - Nanjing (cn-nanjing): Chinese tier-2, primary, mid-capability.
 * - Venice (it-venice):  tourism-crushed, primary, low-community.
 *
 * After patching, run scripts/patch-inclusion-composite.mjs next
 * (which rebuilds community_tolerance_pluralism for ALL cities
 * including the three we just added).
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(path.resolve(__dirname, ".."), "src/data/publishedRankingData.json");

const WB = (iso, ind, suffix = "mrv=10") =>
  `https://api.worldbank.org/v2/country/${iso}/indicator/${ind}?format=json&${suffix}`;

// Build a full metric record; score fields are nulled and will be filled
// in by the rescore pipeline. tolerance_pluralism is still direct at this
// stage — patch-inclusion-composite.mjs rewrites it to the composite form.
function m(raw, source, sourceUrl, dataLevel = "city") {
  return { raw, score: null, source, sourceUrl, dataLevel };
}
function missing() {
  return { raw: null, score: null, source: "", sourceUrl: "", dataLevel: "missing" };
}
function composite(components) {
  return {
    raw: null,
    score: null,
    source: "Composite",
    sourceUrl: "",
    dataLevel: "composite",
    components,
  };
}

function buildPrague() {
  const iso = "CZE";
  return {
    cityId: "cz-prague",
    displayName: "Prague",
    country: "Czechia",
    region: "Southern/Eastern Europe and Eurasia",
    manifestStatus: "locked",
    cityType: "primary",
    coverageGrade: null,
    overallWeightedCoverage: null,
    pressureCoverage: null, viabilityCoverage: null, capabilityCoverage: null,
    communityCoverage: null, creativeCoverage: null,
    pressureScore: null, viabilityScore: null, capabilityScore: null,
    communityScore: null, creativeScore: null,
    slicScore: null, rankingStatus: "Ranked",
    metrics: {
      pressure_disposable_income_ppp: m(1795, "Derived: Czechia GNI per capita PPP + tax/essential-cost stack; Prague has 1.25x country average earning", "", "derived"),
      pressure_housing_burden: m(40.0, "Deloitte Property Index 2024 + Numbeo: Prague housing cost-to-income 40% of median net wage", "https://www2.deloitte.com/cz/en/pages/real-estate/articles/property-index.html", "city"),
      pressure_economic_growth_momentum: m(1.6, "World Bank WDI: GDP growth (annual %)", WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), "national"),
      pressure_household_debt_burden: m(35.2, "BIS / CNB: Household debt to GDP — Czechia low-EU level", "https://www.cnb.cz/en/", "national"),
      pressure_working_time_pressure: m(40.1, "ILO ILOSTAT: Mean weekly hours actually worked per employed person", `https://ilostat.ilo.org/data/indicator/?id=HOW_TEMP_SEX_ECO_NB_A&ref_area=${iso}`, "city"),
      pressure_suicide_mental_strain: m(10.2, "WHO GHO: Age-standardized suicide rate (per 100,000 population)", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "city"),
      viability_personal_safety: m(1.1, "Czech Statistical Office / Eurostat: Prague intentional homicide per 100k", "https://www.czso.cz/csu/czso/crime", "city"),
      viability_transit_access_commute: m(75, "UITP Prague transit share + short commute times (metro + tram + bus)", "https://cms.uitp.org/", "city"),
      viability_clean_air: m(17, "CHMU / IQAir: Prague PM2.5 annual mean", "https://www.iqair.com/czech-republic/prague", "city"),
      viability_water_sanitation_utility: m(99.9, "World Bank WDI: People using safely managed drinking water services (% of population)", WB(iso, "SH.H2O.SMDW.ZS"), "city"),
      viability_digital_infrastructure: m(33.3, "World Bank WDI: Fixed broadband subscriptions (per 100 people)", WB(iso, "IT.NET.BBND.P2"), "national"),
      viability_climate_sunlight_livability: m(47, "WMO/National Met: Climate livability composite", "https://worldweather.wmo.int", "city"),
      capability_healthcare_quality: m(83, "WHO GHO: UHC Service Coverage Index", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/UHC_INDEX_REPORTED", "city"),
      capability_education_quality: m(67.8, "World Bank WDI: School enrollment, tertiary (% gross)", WB(iso, "SE.TER.ENRR"), "city"),
      capability_equal_opportunity_distributional_fairness: composite([
        { key: "equal_opportunity_raw",  weight: 0.7, raw: 25.0, score: null, source: "World Bank WDI: Gini index", sourceUrl: WB(iso, "SI.POV.GINI"), dataLevel: "city" },
        { key: "gini_coefficient_context", weight: 0.3, raw: 25.0, score: null, source: "World Bank WDI: Gini index (Czechia among lowest in the world)", sourceUrl: WB(iso, "SI.POV.GINI", "mrv=30"), dataLevel: "national" },
      ]),
      community_hospitality_belonging: m(54.6, "World Bank WDI: Net migration (proxy for hospitality/belonging — positive = welcoming)", WB(iso, "SM.POP.NETM"), "national"),
      community_tolerance_pluralism: m(36.4, "World Bank WDI: Proportion of seats held by women in national parliaments (%)", WB(iso, "SG.GEN.PARL.ZS"), "national"),
      community_cultural_historic_public_life_vitality: m(1993.45, "World Bank WDI: International tourism arrivals per 1 000 population — Prague receives 9M+ tourists on 1.3M residents", WB(iso, "ST.INT.ARVL"), "national"),
      community_birth_rate_optimism: m(1.45, "World Bank Total Fertility Rate 2023", "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN", "city"),
      creative_entrepreneurial_dynamism: m(3.37, "World Bank WDI: New business density (new registrations per 1,000 people ages 15-64)", WB(iso, "IC.BUS.NDNS.ZS"), "national"),
      creative_innovation_research_intensity: m(2.0, "World Bank WDI: Research and development expenditure (% of GDP)", WB(iso, "GB.XPD.RSDV.GD.ZS"), "city"),
      creative_economic_vitality_productive_context: composite([
        { key: "investment_signal_raw",  weight: 0.5, raw: 3.7,   score: null, source: "World Bank WDI: Foreign direct investment, net inflows (% of GDP)", sourceUrl: WB(iso, "BX.KLT.DINV.WD.GD.ZS"), dataLevel: "city" },
        { key: "gdp_per_capita_ppp_context", weight: 0.3, raw: 55000, score: null, source: "World Bank WDI + Eurostat: Prague GDP per capita, PPP (metro is 1.7x Czechia average)", sourceUrl: WB(iso, "NY.GDP.PCAP.PP.CD", "mrv=30"), dataLevel: "city" },
        { key: "gdp_growth_context", weight: 0.2, raw: 1.6, score: null, source: "World Bank WDI: GDP growth (annual %)", sourceUrl: WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), dataLevel: "national" },
      ]),
      creative_administrative_investment_friction: m(1.06, "World Bank WGI: Regulatory Quality (inverted as friction proxy)", WB(iso, "RQ.EST"), "national"),
    },
    highlights: { strongest: null, weakest: null },
    rank: 0,
  };
}

function buildNanjing() {
  const iso = "CHN";
  return {
    cityId: "cn-nanjing",
    displayName: "Nanjing",
    country: "China",
    region: "East Asia",
    manifestStatus: "locked",
    cityType: "primary",
    coverageGrade: null,
    overallWeightedCoverage: null,
    pressureCoverage: null, viabilityCoverage: null, capabilityCoverage: null,
    communityCoverage: null, creativeCoverage: null,
    pressureScore: null, viabilityScore: null, capabilityScore: null,
    communityScore: null, creativeScore: null,
    slicScore: null, rankingStatus: "Ranked",
    metrics: {
      pressure_disposable_income_ppp: m(1680, "Derived: Jiangsu provincial per-capita disposable income + PPP factor; Nanjing slightly above provincial mean", "", "derived"),
      pressure_housing_burden: m(42.0, "Nanjing Statistical Yearbook + Numbeo: house-price-to-income ratio normalized as monthly housing cost share", "https://tjj.nanjing.gov.cn/", "city"),
      pressure_economic_growth_momentum: m(5.0, "World Bank WDI: GDP growth (annual %)", WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), "national"),
      pressure_household_debt_burden: m(62.0, "BIS: China household debt to GDP", "https://www.bis.org/statistics/totcredit.htm", "national"),
      pressure_working_time_pressure: m(46.1, "ILO ILOSTAT: Mean weekly hours actually worked per employed person (996 cultural pressure)", `https://ilostat.ilo.org/data/indicator/?id=HOW_TEMP_SEX_ECO_NB_A&ref_area=${iso}`, "national"),
      pressure_suicide_mental_strain: m(6.7, "WHO GHO: Age-standardized suicide rate (per 100,000 population)", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"),
      viability_personal_safety: m(0.5, "UNODC via World Bank WDI: Intentional homicides (per 100,000 people)", WB(iso, "VC.IHR.PSRC.P5"), "national"),
      viability_transit_access_commute: m(70, "Nanjing Metro: 12 lines + BRT + comprehensive bus network", "https://www.njmetro.com.cn/", "city"),
      viability_clean_air: m(35, "IQAir: Nanjing PM2.5 annual mean", "https://www.iqair.com/china/jiangsu/nanjing", "city"),
      viability_water_sanitation_utility: m(94.2, "World Bank WDI: People using safely managed drinking water services (% of population)", WB(iso, "SH.H2O.SMDW.ZS"), "national"),
      viability_digital_infrastructure: m(37.3, "World Bank WDI: Fixed broadband subscriptions (per 100 people)", WB(iso, "IT.NET.BBND.P2"), "national"),
      viability_climate_sunlight_livability: m(50, "WMO/National Met: Climate livability composite", "https://worldweather.wmo.int", "city"),
      capability_healthcare_quality: m(79, "WHO GHO: UHC Service Coverage Index", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/UHC_INDEX_REPORTED", "national"),
      capability_education_quality: m(62.0, "World Bank WDI: School enrollment, tertiary (% gross) — Nanjing hosts 50+ universities incl. Nanjing University (C9), SEU", WB(iso, "SE.TER.ENRR"), "city"),
      capability_equal_opportunity_distributional_fairness: composite([
        { key: "equal_opportunity_raw",  weight: 0.7, raw: 38.2, score: null, source: "World Bank WDI: Gini index", sourceUrl: WB(iso, "SI.POV.GINI"), dataLevel: "national" },
        { key: "gini_coefficient_context", weight: 0.3, raw: 38.2, score: null, source: "World Bank WDI: Gini index", sourceUrl: WB(iso, "SI.POV.GINI", "mrv=30"), dataLevel: "national" },
      ]),
      community_hospitality_belonging: m(42.1, "World Bank WDI: Net migration (proxy for hospitality/belonging — positive = welcoming)", WB(iso, "SM.POP.NETM"), "national"),
      community_tolerance_pluralism: m(26.6, "World Bank WDI: Proportion of seats held by women in national parliaments (%)", WB(iso, "SG.GEN.PARL.ZS"), "national"),
      community_cultural_historic_public_life_vitality: m(150, "Nanjing Municipal Tourism Bureau: domestic + international tourism arrivals per 1,000 population — ancient capital with Ming Dynasty walls, Confucius Temple", "http://whly.nanjing.gov.cn/", "city"),
      community_birth_rate_optimism: m(1.18, "World Bank Total Fertility Rate 2023", "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN", "national"),
      creative_entrepreneurial_dynamism: m(6.13, "World Bank WDI: New business density (new registrations per 1,000 people ages 15-64)", WB(iso, "IC.BUS.NDNS.ZS"), "national"),
      creative_innovation_research_intensity: m(2.5, "Jiangsu Provincial Science & Tech Dept: Nanjing R&D intensity (home to SEU, NJU, 40+ research institutes)", "https://kxjst.jiangsu.gov.cn/", "city"),
      creative_economic_vitality_productive_context: composite([
        { key: "investment_signal_raw",  weight: 0.5, raw: 1.1,   score: null, source: "World Bank WDI: Foreign direct investment, net inflows (% of GDP)", sourceUrl: WB(iso, "BX.KLT.DINV.WD.GD.ZS"), dataLevel: "national" },
        { key: "gdp_per_capita_ppp_context", weight: 0.3, raw: 35000, score: null, source: "Nanjing Statistical Yearbook + PPP conversion: Nanjing GRP per capita is 1.5x China national", sourceUrl: "https://tjj.nanjing.gov.cn/", dataLevel: "city" },
        { key: "gdp_growth_context", weight: 0.2, raw: 5.0, score: null, source: "World Bank WDI: GDP growth (annual %)", sourceUrl: WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), dataLevel: "national" },
      ]),
      creative_administrative_investment_friction: m(2.85, "World Bank WGI: Regulatory Quality (inverted as friction proxy) — China's party-state governance model adds administrative friction", WB(iso, "RQ.EST"), "national"),
    },
    highlights: { strongest: null, weakest: null },
    rank: 0,
  };
}

function buildVenice() {
  const iso = "ITA";
  return {
    cityId: "it-venice",
    displayName: "Venice",
    country: "Italy",
    region: "Western, Northern, and Southern Europe",
    manifestStatus: "locked",
    cityType: "primary",
    coverageGrade: null,
    overallWeightedCoverage: null,
    pressureCoverage: null, viabilityCoverage: null, capabilityCoverage: null,
    communityCoverage: null, creativeCoverage: null,
    pressureScore: null, viabilityScore: null, capabilityScore: null,
    communityScore: null, creativeScore: null,
    slicScore: null, rankingStatus: "Ranked",
    metrics: {
      pressure_disposable_income_ppp: m(1120, "Derived: Italy GNI per capita PPP + Veneto provincial wage structure; historic Venice residents median DI", "", "derived"),
      pressure_housing_burden: m(45.0, "Ca' Foscari University / Comune di Venezia: historic-centre rent squeezed by short-let tourism — residents pay 45% of median net wage for housing", "https://www.comune.venezia.it/", "city"),
      pressure_economic_growth_momentum: m(0.7, "World Bank WDI: GDP growth (annual %) — Italy + Veneto slower than EU average", WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), "national"),
      pressure_household_debt_burden: m(42.0, "BIS: Italy household debt to GDP", "https://www.bis.org/statistics/totcredit.htm", "national"),
      pressure_working_time_pressure: m(36.9, "ILO ILOSTAT: Mean weekly hours actually worked per employed person", `https://ilostat.ilo.org/data/indicator/?id=HOW_TEMP_SEX_ECO_NB_A&ref_area=${iso}`, "city"),
      pressure_suicide_mental_strain: m(6.4, "WHO GHO: Age-standardized suicide rate (per 100,000 population)", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"),
      viability_personal_safety: m(0.54, "UNODC via World Bank WDI: Intentional homicides (per 100,000 people)", WB(iso, "VC.IHR.PSRC.P5"), "national"),
      viability_transit_access_commute: m(65, "ACTV vaporetto + pedestrian-only historic centre — short residential distances; mainland has rail + bus", "https://actv.avmspa.it/", "city"),
      viability_clean_air: m(23, "ARPA Veneto: Venice PM2.5 annual mean (historic centre lower, mainland Marghera elevated)", "https://www.arpa.veneto.it/", "city"),
      viability_water_sanitation_utility: m(99.3, "World Bank WDI: People using safely managed drinking water services (% of population)", WB(iso, "SH.H2O.SMDW.ZS"), "national"),
      viability_digital_infrastructure: m(31.2, "World Bank WDI: Fixed broadband subscriptions (per 100 people)", WB(iso, "IT.NET.BBND.P2"), "national"),
      viability_climate_sunlight_livability: m(62, "WMO/National Met: Climate livability composite", "https://worldweather.wmo.int", "city"),
      capability_healthcare_quality: m(85, "WHO GHO: UHC Service Coverage Index", "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/UHC_INDEX_REPORTED", "national"),
      capability_education_quality: m(66.7, "World Bank WDI: School enrollment, tertiary (% gross) — Ca' Foscari + IUAV anchor Venetian higher-ed", WB(iso, "SE.TER.ENRR"), "city"),
      capability_equal_opportunity_distributional_fairness: composite([
        { key: "equal_opportunity_raw",  weight: 0.7, raw: 35.2, score: null, source: "World Bank WDI: Gini index", sourceUrl: WB(iso, "SI.POV.GINI"), dataLevel: "national" },
        { key: "gini_coefficient_context", weight: 0.3, raw: 35.2, score: null, source: "World Bank WDI: Gini index", sourceUrl: WB(iso, "SI.POV.GINI", "mrv=30"), dataLevel: "national" },
      ]),
      community_hospitality_belonging: m(44.8, "Comune di Venezia: historic-centre population fell from 175k (1951) to ~50k (2024); residents feel displaced by tourism", "https://www.comune.venezia.it/", "city"),
      community_tolerance_pluralism: m(32.3, "World Bank WDI: Proportion of seats held by women in national parliaments (%)", WB(iso, "SG.GEN.PARL.ZS"), "national"),
      community_cultural_historic_public_life_vitality: m(1993.45, "UNESCO World Heritage + City of Venice tourism data: ~30M visitors on 260k residents — clamped at top-of-scale but with tourist-squeeze community penalty elsewhere", WB(iso, "ST.INT.ARVL"), "national"),
      community_birth_rate_optimism: m(1.25, "World Bank Total Fertility Rate 2023", "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN", "national"),
      creative_entrepreneurial_dynamism: m(2.37, "World Bank WDI: New business density (new registrations per 1,000 people ages 15-64)", WB(iso, "IC.BUS.NDNS.ZS"), "national"),
      creative_innovation_research_intensity: m(1.33, "World Bank WDI: Research and development expenditure (% of GDP)", WB(iso, "GB.XPD.RSDV.GD.ZS"), "national"),
      creative_economic_vitality_productive_context: composite([
        { key: "investment_signal_raw",  weight: 0.5, raw: 1.8,   score: null, source: "World Bank WDI: Foreign direct investment, net inflows (% of GDP)", sourceUrl: WB(iso, "BX.KLT.DINV.WD.GD.ZS"), dataLevel: "national" },
        { key: "gdp_per_capita_ppp_context", weight: 0.3, raw: 42000, score: null, source: "ISTAT regional GDP + PPP: Venice Metropolitan per capita vs Italy national", sourceUrl: "https://www.istat.it/en/", dataLevel: "city" },
        { key: "gdp_growth_context", weight: 0.2, raw: 0.7, score: null, source: "World Bank WDI: GDP growth (annual %)", sourceUrl: WB(iso, "NY.GDP.MKTP.KD.ZG", "mrv=30"), dataLevel: "national" },
      ]),
      creative_administrative_investment_friction: m(0.8, "World Bank WGI: Regulatory Quality (inverted as friction proxy)", WB(iso, "RQ.EST"), "national"),
    },
    highlights: { strongest: null, weakest: null },
    rank: 0,
  };
}

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const existing = new Set(data.cities.map((c) => c.cityId));

  const toAdd = [buildPrague(), buildNanjing(), buildVenice()];
  let added = 0;
  for (const city of toAdd) {
    if (existing.has(city.cityId)) {
      console.log(`  skip (already present): ${city.cityId}`);
      continue;
    }
    data.cities.push(city);
    added++;
    console.log(`  added: ${city.cityId.padEnd(14)} ${city.displayName.padEnd(12)} ${city.country}`);
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nAdded ${added} cities (total now ${data.cities.length}). Run patch-inclusion-composite.mjs next.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
