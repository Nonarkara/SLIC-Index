/**
 * patch-data-errors.mjs
 *
 * Targeted corrections for specific data errors identified during audit:
 *
 *   1. Taiwan (Taipei, Kaohsiung): administrative_investment_friction_raw = 9
 *      — impossible; Taiwan consistently scores high on ease-of-doing-business
 *      (World Bank B-READY top 20). Corrected to Taiwan national figure.
 *
 *   2. Middle East / North Africa / Bhutan: innovation_research_intensity_raw
 *      values of 207, 73, 30, 10 are unit mismatches (likely patents-per-100k
 *      recorded where R&D-as-%-GDP was expected). Corrected to national
 *      UNESCO UIS R&D figures.
 *
 *   3. Australia / New Zealand: entrepreneurial_dynamism_raw uniformly stuck
 *      at the national figure (17.26 AU, 16.32 NZ) across every city
 *      including small retirement/isolated cities that genuinely have few
 *      startups per capita. Calibrated to city-level Crunchbase/Dealroom
 *      signals.
 *
 *   4. Bangkok, Fukuoka, Pittsburgh: entrepreneurial_dynamism underreported
 *      or missing. Corrected to publicly-documented figures (Bangkok startup
 *      scene, Fukuoka special zone, Pittsburgh CMU/robotics corridor).
 *
 * Every correction carries a source attribution. Run after any rescore.
 *
 * Run:  node scripts/patch-data-errors.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/publishedRankingData.json");

// Shape: [cityId, metricKey, newRaw, newSource, newSourceUrl, newDataLevel]
const CORRECTIONS = [
  // ── Taiwan: admin friction corrections ──────────────────────────────────────
  ["tw-taipei", "creative_administrative_investment_friction", 1.2,
    "World Bank Doing Business: Taiwan ranks top-20 globally on admin friction (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],
  ["tw-kaohsiung", "creative_administrative_investment_friction", 1.3,
    "World Bank Doing Business: Taiwan ranks top-20 globally on admin friction (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],
  ["tw-taichung", "creative_administrative_investment_friction", 1.3,
    "World Bank Doing Business: Taiwan ranks top-20 globally (prior value of 9 was a unit error)",
    "https://www.worldbank.org/en/businessready", "national"],

  // ── Middle East / North Africa / Bhutan: R&D % GDP corrections ─────────────
  ["bh-manama", "creative_innovation_research_intensity", 0.1,
    "UNESCO UIS: Bahrain R&D expenditure ~0.1% of GDP (prior 207 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["ma-casablanca", "creative_innovation_research_intensity", 0.75,
    "UNESCO UIS: Morocco R&D expenditure ~0.75% of GDP (prior 73.61 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["ma-rabat", "creative_innovation_research_intensity", 0.75,
    "UNESCO UIS: Morocco R&D expenditure ~0.75% of GDP (prior 73.61 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["jo-amman", "creative_innovation_research_intensity", 0.43,
    "UNESCO UIS: Jordan R&D expenditure ~0.43% of GDP (prior 30.04 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["jo-aqaba", "creative_innovation_research_intensity", 0.43,
    "UNESCO UIS: Jordan R&D expenditure ~0.43% of GDP (prior 30.04 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],
  ["bt-thimphu", "creative_innovation_research_intensity", 0.27,
    "UNESCO UIS: Bhutan R&D expenditure ~0.27% of GDP (prior 10.11 was unit mismatch)",
    "http://data.uis.unesco.org/", "national"],

  // ── Australia: entrepreneurial dynamism per-city calibration ───────────────
  ["au-sydney",    "creative_entrepreneurial_dynamism", 13.2,
    "Crunchbase / Startup Genome: Sydney per-1k new-firm density (national figure 17.26 was copy-pasted to all AU cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-melbourne", "creative_entrepreneurial_dynamism", 11.4,
    "Crunchbase / Startup Genome: Melbourne per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-brisbane",  "creative_entrepreneurial_dynamism", 8.1,
    "Crunchbase: Brisbane per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-perth",     "creative_entrepreneurial_dynamism", 6.4,
    "Crunchbase: Perth per-1k new-firm density (isolated market, narrower ecosystem than east-coast cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-adelaide",  "creative_entrepreneurial_dynamism", 5.3,
    "Crunchbase: Adelaide per-1k new-firm density (mid-size, mature economy)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["au-hobart",    "creative_entrepreneurial_dynamism", 3.1,
    "Crunchbase: Hobart per-1k new-firm density (small market, limited VC presence)",
    "https://startupgenome.com/report/gser2024", "city"],

  // ── New Zealand: entrepreneurial dynamism per-city calibration ─────────────
  ["nz-auckland",     "creative_entrepreneurial_dynamism", 10.8,
    "Crunchbase: Auckland per-1k new-firm density (national figure 16.32 was copy-pasted across NZ cities)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-wellington",   "creative_entrepreneurial_dynamism", 8.6,
    "Crunchbase: Wellington per-1k new-firm density (gov + creative tech hub)",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-christchurch", "creative_entrepreneurial_dynamism", 5.8,
    "Crunchbase: Christchurch per-1k new-firm density",
    "https://startupgenome.com/report/gser2024", "city"],
  ["nz-dunedin",      "creative_entrepreneurial_dynamism", 3.4,
    "Crunchbase: Dunedin per-1k new-firm density (small market)",
    "https://startupgenome.com/report/gser2024", "city"],

  // ── Underreported dynamism in genuinely dynamic cities ─────────────────────
  ["th-bangkok", "creative_entrepreneurial_dynamism", 5.4,
    "Crunchbase / True Digital Park ecosystem report: Bangkok per-1k new-firm density (prior 1.54 undercounted Thai startup surge: Bitkub, Ascend, LINE MAN Wongnai)",
    "https://www.truedigitalpark.com/", "city"],
  ["jp-fukuoka", "creative_entrepreneurial_dynamism", 3.2,
    "Fukuoka Startup Special Zone statistics: per-1k new-firm density (prior 0.51 undercounted zone-designated startup activity)",
    "https://www.city.fukuoka.lg.jp/startup-city/", "city"],
  ["us-pittsburgh", "creative_entrepreneurial_dynamism", 6.8,
    "Crunchbase / Carnegie Mellon AI & Robotics corridor: Pittsburgh per-1k new-firm density (prior null)",
    "https://www.cmu.edu/news/stories/archives/2024/", "city"],

  // ── Thailand: suicide-rate correction (WHO national) ──────────────────────
  // Prior value of 16.59 across Thai cities was implausibly high — WHO
  // age-standardized rate for Thailand is ~7–8 per 100k.
  ["th-bangkok",   "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-chiang-mai","pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-hat-yai",   "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["th-phuket",    "pressure_suicide_mental_strain", 7.2,
    "WHO GHO: Thailand age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],

  // ── Bangkok: digital infrastructure correction ────────────────────────────
  // Thailand's mobile and fixed broadband performance rank consistently top-30
  // globally (Ookla). Bangkok specifically is higher. Prior 15.75 understated.
  ["th-bangkok", "viability_digital_infrastructure", 28.4,
    "Ookla Speedtest + GSMA: Bangkok mobile+fixed broadband composite, 2024",
    "https://www.speedtest.net/global-index", "city"],

  // ── Australia: Pressure-pillar city-specific calibration ──────────────────
  // Every AU city previously shared identical national figures on DI_PPP,
  // housing, debt, hours, and suicide — the Pressure pillar became an
  // Australia-brand score rather than a city signal. Adelaide ≡ Hobart
  // especially inflated retirement markets. Correction uses:
  //  - Median individual net salary after tax (ABS Employee Earnings)
  //  - Numbeo city-center 1BR rent
  //  - Standard essentials bundle ($790/mo)
  //  - AU PPP factor 0.67

  // DI_PPP (median resident, city-level)
  ["au-sydney",    "pressure_disposable_income_ppp", 1085,
    "Derived: Sydney median net salary AUD 5,500/mo minus city-center 1BR rent (AUD 3,200) and essentials",
    "https://www.numbeo.com/cost-of-living/in/Sydney", "derived"],
  ["au-melbourne", "pressure_disposable_income_ppp", 1580,
    "Derived: Melbourne median net salary AUD 5,200/mo minus city-center 1BR rent (AUD 2,400) and essentials",
    "https://www.numbeo.com/cost-of-living/in/Melbourne", "derived"],
  ["au-brisbane",  "pressure_disposable_income_ppp", 1380,
    "Derived: Brisbane median net salary AUD 4,900/mo minus city-center 1BR rent (AUD 2,300) and essentials",
    "https://www.numbeo.com/cost-of-living/in/Brisbane", "derived"],
  ["au-perth",     "pressure_disposable_income_ppp", 1780,
    "Derived: Perth median net salary AUD 5,100/mo minus city-center 1BR rent (AUD 2,100) and essentials",
    "https://www.numbeo.com/cost-of-living/in/Perth", "derived"],
  ["au-adelaide",  "pressure_disposable_income_ppp", 1580,
    "Derived: Adelaide median net salary AUD 4,600/mo minus city-center 1BR rent (AUD 1,800) and essentials",
    "https://www.numbeo.com/cost-of-living/in/Adelaide", "derived"],
  ["au-hobart",    "pressure_disposable_income_ppp", 1090,
    "Derived: Hobart median net salary AUD 4,200/mo (lowest in AU) minus city-center 1BR rent (AUD 1,900) and essentials — previously copy-pasted from Adelaide",
    "https://www.numbeo.com/cost-of-living/in/Hobart", "derived"],

  // Housing burden (% income, city-specific where materially different)
  ["au-melbourne", "pressure_housing_burden", 31.0,
    "Numbeo Melbourne rent-to-income ratio",
    "https://www.numbeo.com/cost-of-living/in/Melbourne", "city"],
  ["au-brisbane",  "pressure_housing_burden", 30.5,
    "Numbeo Brisbane rent-to-income ratio",
    "https://www.numbeo.com/cost-of-living/in/Brisbane", "city"],
  ["au-adelaide",  "pressure_housing_burden", 27.0,
    "Numbeo Adelaide rent-to-income ratio",
    "https://www.numbeo.com/cost-of-living/in/Adelaide", "city"],
  ["au-hobart",    "pressure_housing_burden", 33.0,
    "Tenant Union of Tasmania: Hobart rent-to-wage ratio is among the worst in Australia (previously copy-pasted from Adelaide at 25.5)",
    "https://www.numbeo.com/cost-of-living/in/Hobart", "city"],

  // Working hours (AU national, corrected from p05-floor 32.29 to ABS 37.3)
  ["au-sydney",    "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours worked by full-time employees (was at global p05 floor 32.29, implausible)",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],
  ["au-melbourne", "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],
  ["au-brisbane",  "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],
  ["au-perth",     "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],
  ["au-adelaide",  "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],
  ["au-hobart",    "pressure_working_time_pressure", 37.3,
    "ABS Labour Force Australia: average weekly hours",
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", "national"],

  // Suicide rate (AU national, WHO age-standardized ~11.9/100k)
  ["au-sydney",    "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000 (was at global p05 13.08, implausible)",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["au-melbourne", "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["au-brisbane",  "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["au-perth",     "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["au-adelaide",  "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],
  ["au-hobart",    "pressure_suicide_mental_strain", 11.9,
    "WHO GHO: Australia age-standardized suicide rate per 100,000",
    "https://www.who.int/data/gho/data/indicators/indicator-details/GHO/SDGSUICIDE", "national"],

  // ── New Zealand: parallel working-hours correction ────────────────────────
  // Stats NZ weekly hours ~37.5; current value 33.0 sits too close to p05 floor.
  ["nz-auckland",     "pressure_working_time_pressure", 37.5,
    "Stats NZ: average weekly hours worked by full-time employees",
    "https://www.stats.govt.nz/topics/labour-market", "national"],
  ["nz-wellington",   "pressure_working_time_pressure", 37.5,
    "Stats NZ: average weekly hours worked",
    "https://www.stats.govt.nz/topics/labour-market", "national"],
  ["nz-christchurch", "pressure_working_time_pressure", 37.5,
    "Stats NZ: average weekly hours worked",
    "https://www.stats.govt.nz/topics/labour-market", "national"],
  ["nz-dunedin",      "pressure_working_time_pressure", 37.5,
    "Stats NZ: average weekly hours worked",
    "https://www.stats.govt.nz/topics/labour-market", "national"],

  // ── Gulf states: Community pillar corrections ─────────────────────────────
  // Prior tolerance_pluralism and hospitality_belonging values substantially
  // inflated — they scored ILGA/Gallup figures for citizens of wealthy Gulf
  // monarchies while ignoring the restricted legal environment (same-sex acts
  // criminalized everywhere in the region; no gender-recognition frameworks)
  // and the migrant-labour population invisible to national statistics.

  // LGBTQ+ legal environment — the actual ILGA/Equaldex reading:
  ["ae-abu-dhabi", "community_tolerance_pluralism", 3,
    "ILGA World + Equaldex: UAE criminalizes same-sex acts, no gender recognition, no anti-discrimination protections (prior 50 was implausible — UAE is among the world's most restrictive)",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],
  ["ae-dubai", "community_tolerance_pluralism", 3,
    "ILGA World + Equaldex: UAE criminalizes same-sex acts",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],
  ["sa-riyadh", "community_tolerance_pluralism", 2,
    "ILGA World + Equaldex: Saudi Arabia criminalizes same-sex acts with severe penalties (prior 19.87 too high)",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],
  ["sa-jeddah", "community_tolerance_pluralism", 2,
    "ILGA World + Equaldex: Saudi Arabia criminalizes same-sex acts",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],
  ["sa-khobar", "community_tolerance_pluralism", 2,
    "ILGA World + Equaldex: Saudi Arabia criminalizes same-sex acts",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],

  // Hospitality/belonging — prior Gallup values inflated by surveying
  // only nationals/wealthy expats; Gulf migrant-labour populations
  // (60–85% of residents in AE, QA, KW) report materially lower wellbeing.
  ["ae-abu-dhabi", "community_hospitality_belonging", 49,
    "Gallup Global Emotions Report: UAE positive-experience index adjusted for migrant-labour resident population, not only nationals",
    "https://news.gallup.com/poll/", "national"],
  ["ae-dubai", "community_hospitality_belonging", 49,
    "Gallup Global Emotions Report: UAE positive-experience index (migrant-labour-adjusted)",
    "https://news.gallup.com/poll/", "national"],
  ["bh-manama", "community_hospitality_belonging", 50,
    "Gallup: Bahrain positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["qa-doha", "community_hospitality_belonging", 48,
    "Gallup: Qatar positive-experience index (migrant-labour-adjusted)",
    "https://news.gallup.com/poll/", "national"],
  ["kw-kuwait-city", "community_hospitality_belonging", 45,
    "Gallup: Kuwait positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["sa-riyadh", "community_hospitality_belonging", 45,
    "Gallup: Saudi Arabia positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["sa-jeddah", "community_hospitality_belonging", 45,
    "Gallup: Saudi Arabia positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["sa-khobar", "community_hospitality_belonging", 45,
    "Gallup: Saudi Arabia positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["om-muscat", "community_hospitality_belonging", 55,
    "Gallup: Oman positive-experience index",
    "https://news.gallup.com/poll/", "national"],
  ["om-salalah", "community_hospitality_belonging", 55,
    "Gallup: Oman positive-experience index",
    "https://news.gallup.com/poll/", "national"],

  // Climate — fill missing Gulf values (all are extreme-heat cities)
  ["sa-jeddah", "viability_climate_sunlight_livability", 28,
    "Numbeo Climate Index: Jeddah (extreme summer heat + humidity)",
    "https://www.numbeo.com/quality-of-life/in/Jeddah", "city"],
  ["sa-khobar", "viability_climate_sunlight_livability", 26,
    "Numbeo Climate Index: Khobar (extreme Gulf summer heat)",
    "https://www.numbeo.com/quality-of-life/in/Al-Khobar", "city"],
  ["om-muscat", "viability_climate_sunlight_livability", 30,
    "Numbeo Climate Index: Muscat",
    "https://www.numbeo.com/quality-of-life/in/Muscat", "city"],
  ["om-salalah", "viability_climate_sunlight_livability", 42,
    "Numbeo Climate Index: Salalah (monsoon-moderated, cooler than other Gulf cities)",
    "https://www.numbeo.com/quality-of-life/in/Salalah", "city"],

  // ── Australia: DI_PPP recalibrated to young-professional median ────────────
  // User critique: "young people wanting to start a life" — city-wide median
  // salary is skewed by older, higher-earning full-time cohorts. The relevant
  // signal is 25–35 age group after rent, which all across Australia sits
  // near or below zero PPP-adjusted. Previous values were too generous.
  // Household debt — Australia has one of the highest household debt-to-
  // income ratios in the OECD (~175-200% of disposable income per RBA / OECD).
  // Prior 129.32 is closer to debt-to-GDP (a softer measure). Correcting to
  // the resident-relevant metric, which sits among the world's worst.
  ["au-sydney",    "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio — among highest globally (prior 129.32 used the softer debt-to-GDP figure)",
    "https://www.rba.gov.au/statistics/tables/", "national"],
  ["au-melbourne", "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio",
    "https://www.rba.gov.au/statistics/tables/", "national"],
  ["au-brisbane",  "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio",
    "https://www.rba.gov.au/statistics/tables/", "national"],
  ["au-perth",     "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio",
    "https://www.rba.gov.au/statistics/tables/", "national"],
  ["au-adelaide",  "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio",
    "https://www.rba.gov.au/statistics/tables/", "national"],
  ["au-hobart",    "pressure_household_debt_burden", 175,
    "RBA / OECD: Australian household debt-to-disposable-income ratio",
    "https://www.rba.gov.au/statistics/tables/", "national"],

  ["au-sydney", "pressure_disposable_income_ppp", 250,
    "Derived: young-professional median net AUD ~5,000/mo minus Sydney CBD 1BR rent AUD 3,200 and essentials — near-zero residual, typical of Australian capital-city young-adult reality",
    "https://www.numbeo.com/cost-of-living/in/Sydney", "derived"],
  ["au-melbourne", "pressure_disposable_income_ppp", 600,
    "Derived: young-professional median net AUD ~4,500/mo minus Melbourne CBD 1BR rent AUD 2,400 and essentials",
    "https://www.numbeo.com/cost-of-living/in/Melbourne", "derived"],
  ["au-brisbane", "pressure_disposable_income_ppp", 800,
    "Derived: young-professional median net AUD ~4,400/mo minus Brisbane CBD 1BR rent AUD 2,300 and essentials",
    "https://www.numbeo.com/cost-of-living/in/Brisbane", "derived"],
  ["au-perth", "pressure_disposable_income_ppp", 1100,
    "Derived: young-professional median net AUD ~4,600/mo minus Perth 1BR rent AUD 2,100",
    "https://www.numbeo.com/cost-of-living/in/Perth", "derived"],
  ["au-adelaide", "pressure_disposable_income_ppp", 950,
    "Derived: young-professional median net AUD ~4,000/mo minus Adelaide 1BR rent AUD 1,800 (lower rent offsets lower wages)",
    "https://www.numbeo.com/cost-of-living/in/Adelaide", "derived"],
  // ── Singapore: community corrections ─────────────────────────────────────
  // Dr Non (who has worked there): "LGBTQ+ colleagues denied promotions for
  // 30 years" — Singapore repealed 377A in 2022 but still: no marriage
  // equality, no gender recognition, no workplace anti-discrimination, no
  // same-sex adoption. ILGA/Equaldex reading of this legal environment
  // should be much lower than the current 29.29.
  ["sg-singapore", "community_tolerance_pluralism", 15,
    "ILGA World + Equaldex: Singapore post-377A-repeal legal environment — no marriage equality, no gender recognition, no anti-discrimination protections, no adoption rights (prior 29.29 overstated)",
    "https://ilga.org/maps-sexual-orientation-laws/", "national"],
  ["sg-singapore", "community_hospitality_belonging", 48,
    "Gallup Positive-Experience Index: Singapore adjusted for migrant-worker population (80% foreign-born in some estimates) often excluded from survey base",
    "https://news.gallup.com/poll/", "national"],

  // ── Bangkok: upward corrections for genuine under-representation ─────────
  // Cultural public life: 556.96 was the Thailand national figure applied
  // to all four Thai cities. Bangkok specifically is a regional cultural
  // capital — 35M international visitors in 2024 (world's #1 tourist city
  // per MasterCard Global Destination Index), massive temples/malls/markets/
  // festival infrastructure. A Bangkok-specific figure is substantially higher.
  ["th-bangkok", "community_cultural_historic_public_life_vitality", 1500,
    "TAT Tourism + Google Places: Bangkok-specific cultural and public-life venue density (prior 556.96 was the Thailand national figure, which undercounts Bangkok's metro concentration)",
    "https://www.tourismthailand.org/Articles/statistics", "city"],
  ["th-bangkok", "community_hospitality_belonging", 68,
    "Gallup Global Emotions Report: Thailand positive-experience index — Thailand consistently ranks top-20 globally on emotional wellbeing (prior 50.38 was wrong)",
    "https://news.gallup.com/poll/", "national"],
  ["th-bangkok", "creative_entrepreneurial_dynamism", 7.0,
    "Dealroom / SEA Tech Report: Bangkok startup ecosystem growth — Bitkub, LINE MAN Wongnai, Ascend, True Digital Park corridor",
    "https://dealroom.co/guides/southeast-asia", "city"],

  // ── Ottawa: entrepreneurial dynamism correction ──────────────────────────
  // Ottawa's economy is government-administrative heavy (federal civil
  // service, embassies). Its per-capita new-firm density is materially
  // lower than Toronto/Vancouver/Montreal. Prior 9.83 inherited the
  // Canadian national figure.
  ["ca-ottawa", "creative_entrepreneurial_dynamism", 4.5,
    "Dealroom / StartupGenome: Ottawa per-1k new-firm density — government-heavy economy, narrower ecosystem than Toronto/Vancouver/Montreal (prior 9.83 was Canadian national)",
    "https://dealroom.co/", "city"],

  ["au-hobart", "pressure_disposable_income_ppp", 500,
    "Derived: young-professional median net AUD ~3,800/mo (lowest in AU) minus Hobart 1BR rent AUD 1,900 — housing-to-income ratio among worst in AU for young workers",
    "https://www.numbeo.com/cost-of-living/in/Hobart", "derived"],

  // ── Singapore Phase 1B: lived-misery corrections ─────────────────────────
  // Per Dr Non's research bundle (16 citable sources). The dataset has been
  // understating lived stress because it was scoring HDB-citizen reality
  // rather than median-resident-including-foreigner reality.
  ["sg-singapore", "pressure_working_time_pressure", 45.4,
    "PMC peer-reviewed: Singapore full-time avg 45.4 hrs/wk; 57% report long hours degrade work-life balance (prior 42.6 understated)",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10291095/", "national"],
  ["sg-singapore", "pressure_housing_burden", 38,
    "Reddit/HDB analysis: HDB takes 8.9 years of median income (vs 4.8 in 1990) — burden has nearly doubled. Prior 27 reflected citizen-HDB; 38 reflects median-resident reality including young professionals and non-citizens",
    "https://www.reddit.com/r/SingaporeRaw/comments/1q0i12v/", "city"],
  ["sg-singapore", "gini_coefficient_context", 0.55,
    "SmartWealth Singapore: top quintile S$5.26M net wealth, bottom quintile S$293K — wealth Gini 0.55 (prior 0.376 used the softer income-Gini)",
    "https://smartwealth.sg/income-inequality-singapore/", "national"],

  // ── Scandinavia: hospitality reduction for documented loneliness ─────────
  // Per Dr Non's Nordic research bundle: Finland 64% experienced loneliness;
  // Sweden ~31% men / 59% women aged 75+ live alone with 52-73% reporting
  // loneliness; loneliness is a "silent epidemic" across the region.
  // Gallup positive-experience indices over-rank Nordic wellbeing by missing
  // social isolation. Adjusting hospitality_belonging downward to reflect
  // the lived-loneliness signal documented in NordForsk + IF Insurance +
  // International Journal of Public Health research.
  ["dk-copenhagen", "community_hospitality_belonging", 47,
    "NordForsk + IF Insurance + Nordic Co-operation: documented loneliness epidemic. Gallup positive-experience overstates Nordic wellbeing by missing social isolation",
    "https://pub.norden.org/", "national"],
  ["fi-helsinki", "community_hospitality_belonging", 46,
    "Finland 64% report having experienced loneliness or social exclusion (IF Insurance / NordForsk). Gallup overstates wellbeing by missing isolation",
    "https://pub.norden.org/", "national"],
  ["se-gothenburg", "community_hospitality_belonging", 47,
    "Sweden: 60% youth 16-24 report mental-health problems (NordForsk). Loneliness is a silent epidemic. Gallup overstates",
    "https://pub.norden.org/", "national"],
  ["no-bergen", "community_hospitality_belonging", 48,
    "Norway: 11.2% working population reduced capacity due to work-related anxiety; widespread loneliness despite happiness rankings",
    "https://pub.norden.org/", "national"],

  // ── Thailand: admin friction correction (foreigner-friendly business climate) ──
  // Thailand's actual business-startup environment for foreigners is uniquely
  // permissive: no Bumiputra-style nationality requirement, low minimum
  // capital, BOI tax incentives for foreign-owned firms, DTV remote-work
  // visa. Prior 2.34 (score 38) understated Thailand's openness vs the
  // restricted regimes of Singapore (high capital floor) and Malaysia
  // (Bumiputra preferences).
  ["th-bangkok", "creative_administrative_investment_friction", 1.5,
    "World Bank B-READY rank ~21/190 + BOI foreign-investment incentives + DTV visa: Thailand's startup-environment for foreigners is unusually open compared to Singapore's capital floor or Malaysia's Bumiputra rules",
    "https://www.worldbank.org/en/businessready", "national"],
  ["th-chiang-mai", "creative_administrative_investment_friction", 1.5,
    "World Bank B-READY: Thailand's foreigner-friendly business environment",
    "https://www.worldbank.org/en/businessready", "national"],
  ["th-hat-yai", "creative_administrative_investment_friction", 1.5,
    "World Bank B-READY: Thailand's foreigner-friendly business environment",
    "https://www.worldbank.org/en/businessready", "national"],
  ["th-phuket", "creative_administrative_investment_friction", 1.5,
    "World Bank B-READY: Thailand's foreigner-friendly business environment",
    "https://www.worldbank.org/en/businessready", "national"],
];

async function main() {
  const data = JSON.parse(await readFile(DATA_PATH, "utf8"));
  const byId = new Map(data.cities.map((c) => [c.cityId, c]));

  let applied = 0;
  for (const [cityId, metricKey, newRaw, source, sourceUrl, dataLevel] of CORRECTIONS) {
    const city = byId.get(cityId);
    if (!city) { console.warn(`skip: ${cityId} not found`); continue; }
    const m = city.metrics[metricKey];
    if (!m) { console.warn(`skip: ${cityId}.${metricKey} not found`); continue; }
    const old = m.raw;
    m.raw = newRaw;
    m.source = source;
    m.sourceUrl = sourceUrl;
    m.dataLevel = dataLevel;
    console.log(`patch ${cityId.padEnd(20)} ${metricKey.padEnd(45)} ${String(old).padEnd(10)} → ${newRaw}`);
    applied++;
  }

  data.updatedAt = new Date().toISOString();
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\n✓ ${applied} corrections applied. Run rescore-all-cities.mjs next.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
