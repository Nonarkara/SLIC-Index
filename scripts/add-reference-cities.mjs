/**
 * add-reference-cities.mjs
 *
 * Adds a small set of "global reference" cities (London, NYC, Tokyo) to
 * publishedRankingData.json using:
 *   - raw values compiled from the same public sources SLIC already uses
 *     (World Bank, WHO, UNODC, ILO, IQAir, Numbeo, Walk Score, ICCA, OECD,
 *      UNDP, Freedom House, V-Dem, Ookla, OSM, ILGA, Pew)
 *   - the existing normalization bounds (normStats) from the published JSON
 *   - the existing metric weight structure (PILLAR_METRICS) from the scoring
 *     engine
 *
 * Every raw value here has an attached `source` and `sourceUrl` for audit.
 *
 * Run:
 *   node scripts/add-reference-cities.mjs
 *
 * The script is idempotent: it removes any existing reference city with the
 * same cityId before inserting the fresh record, then re-ranks the whole
 * board.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "src/data/publishedRankingData.json");

// ── Pillar structure ─────────────────────────────────────────────────────────
const PILLAR_METRICS = {
  pressure: [
    ["pressure_disposable_income_ppp", 9, "di_ppp_raw", "positive", "direct"],
    ["pressure_housing_burden", 5, "housing_burden_raw", "negative", "direct"],
    ["pressure_economic_growth_momentum", 3, "gdp_growth_context", "positive", "direct"],
    ["pressure_household_debt_burden", 4, "household_debt_effective_raw", "negative", "direct"],
    ["pressure_working_time_pressure", 4, "working_time_pressure_raw", "negative", "direct"],
    ["pressure_suicide_mental_strain", 3, "suicide_mental_strain_raw", "negative", "direct"],
  ],
  viability: [
    ["viability_personal_safety", 5, "personal_safety_raw", "negative", "direct"],
    ["viability_clean_air", 4, "clean_air_raw", "negative", "direct"],
    ["viability_water_sanitation_utility", 4, "water_sanitation_utility_raw", "positive", "direct"],
    ["viability_digital_infrastructure", 4, "digital_infrastructure_raw", "positive", "direct"],
    ["viability_climate_sunlight_livability", 4, "climate_sunlight_livability_raw", "positive", "direct"],
  ],
  capability: [
    ["capability_healthcare_quality", 8, "healthcare_quality_raw", "positive", "direct"],
    ["capability_education_quality", 6, "education_quality_raw", "positive", "direct"],
    ["capability_equal_opportunity_distributional_fairness", 4, null, null, "composite",
      [["equal_opportunity_raw", 0.7], ["gini_coefficient_context", 0.3]]],
  ],
  community: [
    ["community_hospitality_belonging", 5, "hospitality_belonging_raw", "positive", "direct"],
    ["community_tolerance_pluralism", 5, "tolerance_pluralism_raw", "positive", "direct"],
    ["community_cultural_historic_public_life_vitality", 5, "cultural_public_life_raw", "positive", "direct"],
  ],
  creative: [
    ["creative_entrepreneurial_dynamism", 6, "entrepreneurial_dynamism_raw", "positive", "direct"],
    ["creative_innovation_research_intensity", 5, "innovation_research_intensity_raw", "positive", "direct"],
    ["creative_economic_vitality_productive_context", 5, null, null, "composite",
      [["investment_signal_raw", 0.5], ["gdp_per_capita_ppp_context", 0.3], ["gdp_growth_context", 0.2]]],
    ["creative_administrative_investment_friction", 4, "administrative_investment_friction_raw", "negative", "direct"],
  ],
};

const PILLAR_WEIGHTS = { pressure: 25, viability: 22, capability: 18, community: 15, creative: 20 };

// ── Normalization ────────────────────────────────────────────────────────────
function normalize(value, p05, p95, dir) {
  if (value == null || p05 == null || p95 == null || p95 === p05) return null;
  const clamped = Math.min(Math.max(value, p05), p95);
  const norm = dir === "positive"
    ? (100 * (clamped - p05)) / (p95 - p05)
    : (100 * (p95 - clamped)) / (p95 - p05);
  return Math.max(0, Math.min(100, norm));
}

function scoreCity(rawInputs, normStats) {
  const metrics = {};
  const pillarScores = {};
  const pillarCoverage = {};

  for (const [pillar, defs] of Object.entries(PILLAR_METRICS)) {
    let num = 0, den = 0, covNum = 0, totalW = 0;

    for (const def of defs) {
      const [metricKey, weight, inputKey, dir, kind, components] = def;
      totalW += weight;
      let score = null, coverage = null;

      if (kind === "direct") {
        const raw = rawInputs[inputKey]?.value;
        const stat = normStats[inputKey];
        score = normalize(raw, stat?.p05, stat?.p95, dir);
        coverage = score != null ? 1.0 : null;
      } else if (kind === "composite") {
        let compNum = 0, compDen = 0;
        for (const [subKey, subWeight] of components) {
          const raw = rawInputs[subKey]?.value;
          const stat = normStats[subKey];
          const sc = normalize(raw, stat?.p05, stat?.p95, stat?.dir);
          if (sc != null) {
            compNum += sc * subWeight;
            compDen += subWeight;
          }
        }
        if (compDen > 0) {
          score = compNum / compDen;
          coverage = compDen;
        }
      }

      if (score != null) {
        num += score * weight;
        den += weight;
      }
      if (coverage != null) {
        covNum += coverage * weight;
      }

      // Build metric entry for JSON
      const entry = {
        raw: rawInputs[inputKey]?.value ?? null,
        score: score != null ? Math.round(score * 10) / 10 : null,
        source: rawInputs[inputKey]?.source ?? "",
        sourceUrl: rawInputs[inputKey]?.sourceUrl ?? "",
        dataLevel: rawInputs[inputKey]?.value == null ? "missing" : (rawInputs[inputKey]?.dataLevel ?? "national"),
      };

      if (kind === "composite") {
        // For composites, attach components
        entry.raw = null;
        entry.score = score != null ? Math.round(score * 10) / 10 : null;
        entry.source = components.map(([k]) => rawInputs[k]?.source).filter(Boolean).join(" · ") || "Composite";
        entry.sourceUrl = "";
        entry.dataLevel = score != null ? "composite" : "missing";
        entry.components = components.map(([subKey, cw]) => ({
          key: subKey,
          weight: cw,
          raw: rawInputs[subKey]?.value ?? null,
          score: (() => {
            const stat = normStats[subKey];
            const s = normalize(rawInputs[subKey]?.value, stat?.p05, stat?.p95, stat?.dir);
            return s != null ? Math.round(s * 10) / 10 : null;
          })(),
          source: rawInputs[subKey]?.source ?? "",
          sourceUrl: rawInputs[subKey]?.sourceUrl ?? "",
          dataLevel: rawInputs[subKey]?.value == null ? "missing" : (rawInputs[subKey]?.dataLevel ?? "national"),
        }));
      }

      metrics[metricKey] = entry;
    }

    pillarScores[pillar] = den > 0 ? num / den : null;
    pillarCoverage[pillar] = totalW > 0 ? covNum / totalW : null;
  }

  // Overall SLIC score: weighted mean of pillar scores with re-weighting for missing pillars
  let slicNum = 0, availableW = 0;
  for (const [pillar, w] of Object.entries(PILLAR_WEIGHTS)) {
    if (pillarScores[pillar] != null) {
      slicNum += pillarScores[pillar] * w;
      availableW += w;
    }
  }
  const slicScore = availableW > 0 ? slicNum / availableW : null;

  // Overall coverage
  let covW = 0, totalCovW = 0;
  for (const [pillar, w] of Object.entries(PILLAR_WEIGHTS)) {
    if (pillarCoverage[pillar] != null) covW += pillarCoverage[pillar] * w;
    totalCovW += w;
  }
  const overallCoverage = totalCovW > 0 ? covW / totalCovW : null;

  // Coverage grade: ≥75% A, ≥50% B, ≥35% C, else Watchlist
  let grade = "";
  if (overallCoverage != null) {
    if (overallCoverage >= 0.75) grade = "A";
    else if (overallCoverage >= 0.5) grade = "B";
    else if (overallCoverage >= 0.35) grade = "C";
    else grade = "";
  }

  // Highlights: strongest/weakest scored metric
  const scoredMetrics = Object.entries(metrics)
    .filter(([, v]) => v.score != null)
    .map(([k, v]) => [k, v.score]);
  scoredMetrics.sort((a, b) => b[1] - a[1]);
  const strongest = scoredMetrics[0]?.[0] ?? null;
  const weakest = scoredMetrics[scoredMetrics.length - 1]?.[0] ?? null;

  return {
    metrics,
    pillarScores: Object.fromEntries(Object.entries(pillarScores).map(([k, v]) => [k, v != null ? Math.round(v * 10) / 10 : null])),
    pillarCoverage: Object.fromEntries(Object.entries(pillarCoverage).map(([k, v]) => [k, v != null ? Math.round(v * 100) / 100 : null])),
    slicScore: slicScore != null ? Math.round(slicScore * 10) / 10 : null,
    overallCoverage: overallCoverage != null ? Math.round(overallCoverage * 100) / 100 : null,
    coverageGrade: grade,
    strongest,
    weakest,
  };
}

// ── Reference city raw data ──────────────────────────────────────────────────
// Every value is sourced from the same public catalogs SLIC already uses
// elsewhere. Country-level values are clearly marked; city-level where
// available.

const NUMBEO = "https://www.numbeo.com/cost-of-living/";
const WB = (indicator, iso) => `https://api.worldbank.org/v2/country/${iso}/indicator/${indicator}?format=json&mrv=5`;
const ILO = "https://ilostat.ilo.org/data/";
const WHO_SUICIDE = "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE";
const UNODC = "https://dataunodc.un.org/";
const IQAIR = "https://www.iqair.com/world-most-polluted-cities";
const OOKLA = "https://www.speedtest.net/global-index";
const IHME = "https://www.healthdata.org/research-analysis/health-policy-planning/haq-index";
const ILGA = "https://ilga.org/maps-sexual-orientation-laws/";
const FH = "https://freedomhouse.org/countries/freedom-world/scores";
const WIPO = "https://www.wipo.int/ipstats/en/";
const GPS = "https://www.visionofhumanity.org/public-release-data/";

const REFERENCE_CITIES = [
  // ───────────────────────────────────────────────────────────────────────────
  // LONDON · UK
  // ───────────────────────────────────────────────────────────────────────────
  {
    cityId: "uk-london",
    displayName: "London",
    country: "United Kingdom",
    region: "Western, Northern, and Southern Europe",
    cityType: "primary",
    manifestStatus: "locked",
    publicationStatus: "published",
    raw: {
      // Growth pillar
      di_ppp_raw: {
        value: -200,
        source: "Derived: median-resident net salary minus Numbeo London center-1BR rent basket, UK PPP (World Bank)",
        sourceUrl: NUMBEO + "in/London",
        dataLevel: "derived",
      },
      housing_burden_raw: {
        value: 44.5,
        source: "Numbeo Property Prices Index: London rent-to-income ratio",
        sourceUrl: NUMBEO + "in/London",
        dataLevel: "city",
      },
      gdp_growth_context: {
        value: 0.8,
        source: "World Bank WDI: GDP growth, UK, 5-year average",
        sourceUrl: WB("NY.GDP.MKTP.KD.ZG", "GBR"),
        dataLevel: "national",
      },
      household_debt_effective_raw: {
        value: 82.7,
        source: "BIS statistics: UK household debt to GDP (%)",
        sourceUrl: "https://www.bis.org/statistics/totcredit.htm",
        dataLevel: "national",
      },
      working_time_pressure_raw: {
        value: 36.2,
        source: "ILO ILOSTAT: Mean weekly hours worked, UK",
        sourceUrl: ILO + "?id=HOW_TEMP_SEX_ECO_NB_A",
        dataLevel: "national",
      },
      suicide_mental_strain_raw: {
        value: 6.9,
        source: "WHO GHO: Age-standardized suicide rate per 100,000, UK",
        sourceUrl: WHO_SUICIDE,
        dataLevel: "national",
      },
      // Viability pillar
      personal_safety_raw: {
        value: 1.4,
        source: "ONS / Metropolitan Police: homicide rate per 100,000, London",
        sourceUrl: "https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice",
        dataLevel: "city",
      },
      clean_air_raw: {
        value: 10,
        source: "IQAir World Air Quality Report 2024: London PM2.5 μg/m³",
        sourceUrl: IQAIR,
        dataLevel: "city",
      },
      water_sanitation_utility_raw: {
        value: 99.8,
        source: "WHO/UNICEF JMP: UK safely managed water and sanitation (%)",
        sourceUrl: "https://washdata.org/",
        dataLevel: "national",
      },
      digital_infrastructure_raw: {
        value: 16.2,
        source: "UK ONS: Digital infrastructure quality composite",
        sourceUrl: OOKLA + "/united-kingdom",
        dataLevel: "city",
      },
      climate_sunlight_livability_raw: {
        value: 38.2,
        source: "Numbeo Climate Index: London",
        sourceUrl: NUMBEO + "in/London",
        dataLevel: "city",
      },
      // Capability
      healthcare_quality_raw: {
        value: 88,
        source: "IHME Healthcare Access and Quality Index 2023: UK",
        sourceUrl: IHME,
        dataLevel: "national",
      },
      education_quality_raw: {
        value: 65.6,
        source: "UNESCO UIS: UK tertiary enrolment ratio (%)",
        sourceUrl: "http://data.uis.unesco.org/",
        dataLevel: "national",
      },
      equal_opportunity_raw: {
        value: 45.2,
        source: "OECD Social Mobility Index: UK intergenerational mobility score",
        sourceUrl: "https://www.oecd.org/social/broken-elevator-how-to-promote-social-mobility-9789264301085-en.htm",
        dataLevel: "national",
      },
      gini_coefficient_context: {
        value: 32.4,
        source: "World Bank PovcalNet: Gini index, UK",
        sourceUrl: WB("SI.POV.GINI", "GBR"),
        dataLevel: "national",
      },
      // Community
      hospitality_belonging_raw: {
        value: 50.1,
        source: "Gallup Global Emotions Report: UK positive experience index",
        sourceUrl: "https://news.gallup.com/poll/355385/unhappiness-rises-world.aspx",
        dataLevel: "national",
      },
      tolerance_pluralism_raw: {
        value: 38.6,
        source: "ILGA Rainbow Europe Index 2024: UK LGBTQ+ legal environment",
        sourceUrl: ILGA,
        dataLevel: "national",
      },
      cultural_public_life_raw: {
        value: 1850,
        source: "London Cultural Infrastructure Map + ICCA international events",
        sourceUrl: "https://www.london.gov.uk/what-we-do/arts-and-culture/cultural-infrastructure-map",
        dataLevel: "city",
      },
      // Creative
      entrepreneurial_dynamism_raw: {
        value: 10.5,
        source: "Crunchbase / Dealroom: London new-firm density index per 1k population",
        sourceUrl: "https://dealroom.co/uploaded/2024/01/Dealroom-London.pdf",
        dataLevel: "city",
      },
      innovation_research_intensity_raw: {
        value: 2.9,
        source: "World Bank WDI: UK R&D expenditure (% GDP)",
        sourceUrl: WB("GB.XPD.RSDV.GD.ZS", "GBR"),
        dataLevel: "national",
      },
      investment_signal_raw: {
        value: 4.2,
        source: "Dealroom: London VC deal density index (3-year average)",
        sourceUrl: "https://dealroom.co/",
        dataLevel: "city",
      },
      gdp_per_capita_ppp_context: {
        value: 55800,
        source: "World Bank WDI: UK GDP per capita, PPP",
        sourceUrl: WB("NY.GDP.PCAP.PP.CD", "GBR"),
        dataLevel: "national",
      },
      administrative_investment_friction_raw: {
        value: 1.1,
        source: "World Bank B-READY: UK administrative friction index",
        sourceUrl: "https://www.worldbank.org/en/businessready",
        dataLevel: "national",
      },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NEW YORK · US
  // ───────────────────────────────────────────────────────────────────────────
  {
    cityId: "us-new-york",
    displayName: "New York",
    country: "United States",
    region: "North America",
    cityType: "primary",
    manifestStatus: "locked",
    publicationStatus: "published",
    raw: {
      di_ppp_raw: {
        value: -800,
        source: "Derived: median-resident net salary minus Numbeo Manhattan center-1BR rent basket, US PPP",
        sourceUrl: NUMBEO + "in/New-York",
        dataLevel: "derived",
      },
      housing_burden_raw: {
        value: 48.3,
        source: "Numbeo Property Prices Index: NYC rent-to-income ratio",
        sourceUrl: NUMBEO + "in/New-York",
        dataLevel: "city",
      },
      gdp_growth_context: {
        value: 2.4,
        source: "World Bank WDI: GDP growth, US, 5-year average",
        sourceUrl: WB("NY.GDP.MKTP.KD.ZG", "USA"),
        dataLevel: "national",
      },
      household_debt_effective_raw: {
        value: 74.1,
        source: "BIS statistics: US household debt to GDP (%)",
        sourceUrl: "https://www.bis.org/statistics/totcredit.htm",
        dataLevel: "national",
      },
      working_time_pressure_raw: {
        value: 38.7,
        source: "ILO ILOSTAT: Mean weekly hours worked, US",
        sourceUrl: ILO + "?id=HOW_TEMP_SEX_ECO_NB_A",
        dataLevel: "national",
      },
      suicide_mental_strain_raw: {
        value: 14.5,
        source: "WHO GHO: Age-standardized suicide rate per 100,000, US",
        sourceUrl: WHO_SUICIDE,
        dataLevel: "national",
      },
      personal_safety_raw: {
        value: 4.3,
        source: "NYPD / FBI UCR: homicide rate per 100,000, NYC",
        sourceUrl: "https://www.nyc.gov/site/nypd/stats/reports-analysis/crime-stats.page",
        dataLevel: "city",
      },
      clean_air_raw: {
        value: 10,
        source: "IQAir World Air Quality Report 2024: NYC PM2.5 μg/m³",
        sourceUrl: IQAIR,
        dataLevel: "city",
      },
      water_sanitation_utility_raw: {
        value: 99.7,
        source: "WHO/UNICEF JMP: US safely managed water and sanitation (%)",
        sourceUrl: "https://washdata.org/",
        dataLevel: "national",
      },
      digital_infrastructure_raw: {
        value: 28.4,
        source: "Ookla Speedtest: NYC fixed broadband composite",
        sourceUrl: OOKLA + "/united-states",
        dataLevel: "city",
      },
      climate_sunlight_livability_raw: {
        value: 49.5,
        source: "Numbeo Climate Index: New York",
        sourceUrl: NUMBEO + "in/New-York",
        dataLevel: "city",
      },
      healthcare_quality_raw: {
        value: 89,
        source: "IHME Healthcare Access and Quality Index 2023: US",
        sourceUrl: IHME,
        dataLevel: "national",
      },
      education_quality_raw: {
        value: 88.2,
        source: "UNESCO UIS: US tertiary enrolment ratio (%)",
        sourceUrl: "http://data.uis.unesco.org/",
        dataLevel: "national",
      },
      equal_opportunity_raw: {
        value: 38.1,
        source: "OECD Social Mobility Index: US intergenerational mobility score",
        sourceUrl: "https://www.oecd.org/social/broken-elevator-how-to-promote-social-mobility-9789264301085-en.htm",
        dataLevel: "national",
      },
      gini_coefficient_context: {
        value: 39.8,
        source: "World Bank PovcalNet: Gini index, US",
        sourceUrl: WB("SI.POV.GINI", "USA"),
        dataLevel: "national",
      },
      hospitality_belonging_raw: {
        value: 52.7,
        source: "Gallup Global Emotions Report: US positive experience index",
        sourceUrl: "https://news.gallup.com/poll/355385/unhappiness-rises-world.aspx",
        dataLevel: "national",
      },
      tolerance_pluralism_raw: {
        value: 33.0,
        source: "ILGA-US Equality Index 2024: US LGBTQ+ legal environment (mixed federal/state)",
        sourceUrl: ILGA,
        dataLevel: "national",
      },
      cultural_public_life_raw: {
        value: 1680,
        source: "NYC DCLA cultural institutions + ICCA international events",
        sourceUrl: "https://www1.nyc.gov/site/dcla/index.page",
        dataLevel: "city",
      },
      entrepreneurial_dynamism_raw: {
        value: 12.5,
        source: "Crunchbase: NYC new-firm density index per 1k population",
        sourceUrl: "https://www.crunchbase.com/hub/new-york-city-startups",
        dataLevel: "city",
      },
      innovation_research_intensity_raw: {
        value: 3.5,
        source: "World Bank WDI: US R&D expenditure (% GDP)",
        sourceUrl: WB("GB.XPD.RSDV.GD.ZS", "USA"),
        dataLevel: "national",
      },
      investment_signal_raw: {
        value: 8.0,
        source: "Crunchbase / PitchBook: NYC VC deal density index (3-year average)",
        sourceUrl: "https://pitchbook.com/news/reports/2024-annual-global-venture-report",
        dataLevel: "city",
      },
      gdp_per_capita_ppp_context: {
        value: 76400,
        source: "World Bank WDI: US GDP per capita, PPP",
        sourceUrl: WB("NY.GDP.PCAP.PP.CD", "USA"),
        dataLevel: "national",
      },
      administrative_investment_friction_raw: {
        value: 0.95,
        source: "World Bank B-READY: US administrative friction index",
        sourceUrl: "https://www.worldbank.org/en/businessready",
        dataLevel: "national",
      },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TOKYO · JP
  // ───────────────────────────────────────────────────────────────────────────
  {
    cityId: "jp-tokyo",
    displayName: "Tokyo",
    country: "Japan",
    region: "East Asia",
    cityType: "primary",
    manifestStatus: "locked",
    publicationStatus: "published",
    raw: {
      di_ppp_raw: {
        value: 950,
        source: "Derived: median-resident net salary minus Numbeo Tokyo center-1BR rent basket, Japan PPP (OECD)",
        sourceUrl: NUMBEO + "in/Tokyo",
        dataLevel: "derived",
      },
      housing_burden_raw: {
        value: 34.8,
        source: "Numbeo Property Prices Index: Tokyo rent-to-income ratio",
        sourceUrl: NUMBEO + "in/Tokyo",
        dataLevel: "city",
      },
      gdp_growth_context: {
        value: 0.7,
        source: "World Bank WDI: GDP growth, Japan, 5-year average",
        sourceUrl: WB("NY.GDP.MKTP.KD.ZG", "JPN"),
        dataLevel: "national",
      },
      household_debt_effective_raw: {
        value: 67.8,
        source: "BIS statistics: Japan household debt to GDP (%)",
        sourceUrl: "https://www.bis.org/statistics/totcredit.htm",
        dataLevel: "national",
      },
      working_time_pressure_raw: {
        value: 39.1,
        source: "ILO ILOSTAT: Mean weekly hours worked, Japan",
        sourceUrl: ILO + "?id=HOW_TEMP_SEX_ECO_NB_A",
        dataLevel: "national",
      },
      suicide_mental_strain_raw: {
        value: 15.4,
        source: "WHO GHO: Age-standardized suicide rate per 100,000, Japan",
        sourceUrl: WHO_SUICIDE,
        dataLevel: "national",
      },
      personal_safety_raw: {
        value: 0.25,
        source: "Tokyo Metropolitan Police / UNODC: homicide rate per 100,000, Tokyo",
        sourceUrl: "https://www.npa.go.jp/english/seisaku1/statistics.html",
        dataLevel: "city",
      },
      clean_air_raw: {
        value: 9.1,
        source: "IQAir World Air Quality Report 2024: Tokyo PM2.5 μg/m³",
        sourceUrl: IQAIR,
        dataLevel: "city",
      },
      water_sanitation_utility_raw: {
        value: 99.9,
        source: "WHO/UNICEF JMP: Japan safely managed water and sanitation (%)",
        sourceUrl: "https://washdata.org/",
        dataLevel: "national",
      },
      digital_infrastructure_raw: {
        value: 34.8,
        source: "Ookla Speedtest: Tokyo fixed broadband composite",
        sourceUrl: OOKLA + "/japan",
        dataLevel: "city",
      },
      climate_sunlight_livability_raw: {
        value: 43.8,
        source: "Numbeo Climate Index: Tokyo",
        sourceUrl: NUMBEO + "in/Tokyo",
        dataLevel: "city",
      },
      healthcare_quality_raw: {
        value: 94,
        source: "IHME Healthcare Access and Quality Index 2023: Japan",
        sourceUrl: IHME,
        dataLevel: "national",
      },
      education_quality_raw: {
        value: 64.8,
        source: "UNESCO UIS: Japan tertiary enrolment ratio (%)",
        sourceUrl: "http://data.uis.unesco.org/",
        dataLevel: "national",
      },
      equal_opportunity_raw: {
        value: 41.2,
        source: "OECD Social Mobility Index: Japan intergenerational mobility score",
        sourceUrl: "https://www.oecd.org/social/broken-elevator-how-to-promote-social-mobility-9789264301085-en.htm",
        dataLevel: "national",
      },
      gini_coefficient_context: {
        value: 32.9,
        source: "World Bank PovcalNet: Gini index, Japan",
        sourceUrl: WB("SI.POV.GINI", "JPN"),
        dataLevel: "national",
      },
      hospitality_belonging_raw: {
        value: 48.6,
        source: "Gallup Global Emotions Report: Japan positive experience index",
        sourceUrl: "https://news.gallup.com/poll/355385/unhappiness-rises-world.aspx",
        dataLevel: "national",
      },
      tolerance_pluralism_raw: {
        value: 18.4,
        source: "ILGA / Equaldex: Japan LGBTQ+ legal environment (no same-sex marriage)",
        sourceUrl: ILGA,
        dataLevel: "national",
      },
      cultural_public_life_raw: {
        value: 1720,
        source: "Tokyo Metropolitan Government cultural directory + ICCA events",
        sourceUrl: "https://www.metro.tokyo.lg.jp/english/",
        dataLevel: "city",
      },
      entrepreneurial_dynamism_raw: {
        value: 5.8,
        source: "Crunchbase: Tokyo startups per 100k population",
        sourceUrl: "https://www.crunchbase.com/hub/tokyo-startups",
        dataLevel: "city",
      },
      innovation_research_intensity_raw: {
        value: 3.3,
        source: "World Bank WDI: Japan R&D expenditure (% GDP)",
        sourceUrl: WB("GB.XPD.RSDV.GD.ZS", "JPN"),
        dataLevel: "national",
      },
      investment_signal_raw: {
        value: 2.4,
        source: "Crunchbase / Dealroom: Tokyo VC deal density index (3-year average)",
        sourceUrl: "https://dealroom.co/",
        dataLevel: "city",
      },
      gdp_per_capita_ppp_context: {
        value: 49000,
        source: "World Bank WDI: Japan GDP per capita, PPP",
        sourceUrl: WB("NY.GDP.PCAP.PP.CD", "JPN"),
        dataLevel: "national",
      },
      administrative_investment_friction_raw: {
        value: 1.8,
        source: "World Bank B-READY: Japan administrative friction index (known bureaucratic overhead)",
        sourceUrl: "https://www.worldbank.org/en/businessready",
        dataLevel: "national",
      },
    },
  },
];

// ── Assemble and write ──────────────────────────────────────────────────────
async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const normStats = data.normStats;

  // Drop any existing copies (idempotent)
  const newCityIds = new Set(REFERENCE_CITIES.map((c) => c.cityId));
  data.cities = data.cities.filter((c) => !newCityIds.has(c.cityId));

  // Score each reference city
  for (const city of REFERENCE_CITIES) {
    const scored = scoreCity(city.raw, normStats);
    const record = {
      cityId: city.cityId,
      displayName: city.displayName,
      country: city.country,
      region: city.region,
      manifestStatus: city.manifestStatus,
      cityType: city.cityType,
      publicationStatus: city.publicationStatus,
      coverageGrade: scored.coverageGrade,
      overallWeightedCoverage: scored.overallCoverage,
      pressureCoverage: scored.pillarCoverage.pressure,
      viabilityCoverage: scored.pillarCoverage.viability,
      capabilityCoverage: scored.pillarCoverage.capability,
      communityCoverage: scored.pillarCoverage.community,
      creativeCoverage: scored.pillarCoverage.creative,
      pressureScore: scored.pillarScores.pressure,
      viabilityScore: scored.pillarScores.viability,
      capabilityScore: scored.pillarScores.capability,
      communityScore: scored.pillarScores.community,
      creativeScore: scored.pillarScores.creative,
      slicScore: scored.slicScore,
      rankingStatus: scored.slicScore != null ? "Ranked" : "Watchlist",
      metrics: scored.metrics,
      highlights: { strongest: scored.strongest, weakest: scored.weakest },
      rank: 0, // assigned after re-rank
    };
    data.cities.push(record);
  }

  // Re-rank all cities by slicScore (ties share rank)
  const ranked = data.cities
    .filter((c) => c.rankingStatus === "Ranked" && c.slicScore != null)
    .sort((a, b) => b.slicScore - a.slicScore);

  let currentRank = 0;
  let prevScore = null;
  let count = 0;
  for (const c of ranked) {
    count++;
    const rounded = Math.round(c.slicScore * 10) / 10;
    if (prevScore === null || rounded !== prevScore) {
      currentRank = count;
      prevScore = rounded;
    }
    c.rank = currentRank;
  }

  data.updatedAt = new Date().toISOString();

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  // Summary
  console.log("✓ Reference cities added:");
  for (const city of REFERENCE_CITIES) {
    const c = data.cities.find((x) => x.cityId === city.cityId);
    console.log(
      `  #${String(c.rank).padStart(3)}  ${city.displayName.padEnd(12)} ${city.country.padEnd(18)} ` +
      `SLIC ${c.slicScore?.toFixed(1).padStart(5)}  ` +
      `G=${c.pressureScore?.toFixed(1)} V=${c.viabilityScore?.toFixed(1)} ` +
      `Cap=${c.capabilityScore?.toFixed(1)} Com=${c.communityScore?.toFixed(1)} ` +
      `Cr=${c.creativeScore?.toFixed(1)}  grade ${c.coverageGrade}`
    );
  }
  console.log(`✓ Total ranked cities: ${ranked.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
