/* ═══════ Compare Rankings — data + editorial copy ═══════ */

export interface IndexCity {
  rank: number;
  city: string;
  country: string;
  score?: string;
  note?: string;
}

export interface IndexProfile {
  id: string;
  name: string;
  shortName: string;
  publisher: string;
  year: number;
  citiesEvaluated: number;
  accentHex: string;
  focus: string;
  topCities: IndexCity[];
  methodology: {
    claimedPurpose: string;
    actualMeasure: string;
    categories: string[];
    dataInputs: string[];
    blindSpots: string[];
    audienceNote: string;
  };
  critique: {
    headline: string;
    body: string;
  };
}

export const INDEX_PROFILES: IndexProfile[] = [
  /* ── 1. EIU Global Liveability Index ── */
  {
    id: "eiu",
    name: "EIU Global Liveability Index",
    shortName: "EIU",
    publisher: "Economist Intelligence Unit",
    year: 2025,
    citiesEvaluated: 173,
    accentHex: "#2a5a8c",
    focus: "Quantitative \"challenges to lifestyle\" for corporate expats. Originated to calculate hardship pay.",
    topCities: [
      { rank: 1, city: "Copenhagen", country: "Denmark", score: "98.0" },
      { rank: 2, city: "Vienna", country: "Austria", score: "97.1" },
      { rank: 2, city: "Zurich", country: "Switzerland", score: "97.1" },
      { rank: 4, city: "Melbourne", country: "Australia", score: "97.0" },
      { rank: 5, city: "Geneva", country: "Switzerland" },
      { rank: 6, city: "Sydney", country: "Australia" },
      { rank: 7, city: "Osaka", country: "Japan" },
      { rank: 7, city: "Auckland", country: "New Zealand" },
      { rank: 9, city: "Adelaide", country: "Australia" },
      { rank: 10, city: "Vancouver", country: "Canada" },
    ],
    methodology: {
      claimedPurpose: "Measure liveability across stability, healthcare, culture, education, and infrastructure.",
      actualMeasure: "Rewards political stability and institutional continuity \u2014 a proxy for wealth and Western governance. The top 10 are separated by less than 2 points on a 100-point scale. Nearly half of all 173 cities score above 80. The differences are statistically meaningless, but the annual \"World\u2019s Most Liveable City\" headline generates PR worth millions.",
      categories: [
        "Stability (25%): crime, conflict, civil unrest, terrorism",
        "Healthcare (20%): availability and quality",
        "Culture & Environment (25%): climate, green space, culture, food/drink, sport",
        "Education (10%): quality and availability",
        "Infrastructure (20%): roads, transport, utilities, telecom, housing",
      ],
      dataInputs: [
        "30+ indicators from EIU analysts and local experts",
        "Official government statistics",
        "In-house expert assessments (subjective, not public)",
      ],
      blindSpots: [
        "Housing affordability and cost of living (decoupled entirely)",
        "Overwork, working hours, and burnout",
        "Inequality and income distribution",
        "Cultural diversity and tolerance for minorities",
        "Youth precarity and intergenerational equity",
        "Resident satisfaction (no surveys of actual locals)",
      ],
      audienceNote: "Corporate relocation teams calculating hardship allowances. Not designed for residents, locals, or anyone deciding where to actually live.",
    },
    critique: {
      headline: "Stability is a narrow proxy",
      body: "EIU places heavy emphasis on stability and expat-oriented comfort, which helps explain its repeated preference for Northern European and Anglosphere cities. The top 10 cities are often separated by only 0.1\u20132 points out of 100, so small methodological choices can produce headline changes that look larger than they are. The methodology is also proprietary, which limits auditability and replication. Studies comparing EIU outputs with resident experience surveys often show only partial overlap, especially where housing costs are severe.",
    },
  },

  /* ── 2. Mercer Quality of Living ── */
  {
    id: "mercer",
    name: "Mercer Quality of Living Ranking",
    shortName: "Mercer",
    publisher: "Mercer (Marsh McLennan)",
    year: 2024,
    citiesEvaluated: 241,
    accentHex: "#1a6b5a",
    focus: "Corporate relocation tool. Literally exists to calculate hardship pay differentials for multinationals.",
    topCities: [
      { rank: 1, city: "Zurich", country: "Switzerland" },
      { rank: 2, city: "Vienna", country: "Austria" },
      { rank: 3, city: "Geneva", country: "Switzerland" },
      { rank: 4, city: "Copenhagen", country: "Denmark" },
      { rank: 5, city: "Auckland", country: "New Zealand" },
      { rank: 6, city: "Amsterdam", country: "Netherlands" },
      { rank: 7, city: "Frankfurt", country: "Germany" },
      { rank: 7, city: "Vancouver", country: "Canada" },
      { rank: 9, city: "Bern", country: "Switzerland" },
      { rank: 10, city: "Basel", country: "Switzerland" },
    ],
    methodology: {
      claimedPurpose: "Measure quality of living for global talent mobility across 39 factors in 10 categories.",
      actualMeasure: "Designed to calculate hardship allowances for corporate relocation packages. Scores relative to New York = 100 (not absolute). Weights international schools, housing quality for foreigners, recreational facilities, consumer goods availability \u2014 the infrastructure of expat comfort, not resident reality. Full methodology is proprietary and expensive to access.",
      categories: [
        "Political and social environment",
        "Economic environment",
        "Socio-cultural environment",
        "Medical and health considerations",
        "Schools and education (international schools weighted heavily)",
        "Public services and transport",
        "Recreation",
        "Consumer goods availability",
        "Housing quality (for foreigners)",
        "Natural environment",
      ],
      dataInputs: [
        "39 factors across 10 categories",
        "Proprietary Mercer consultant assessments",
        "Field research in each city (not public)",
      ],
      blindSpots: [
        "Local wages vs. cost of living",
        "Housing affordability for residents (not expats)",
        "Cultural participation for non-wealthy non-expats",
        "Working conditions and labour rights",
        "Inequality within the city",
        "Digital divide and tech accessibility",
      ],
      audienceNote: "HR departments at multinationals setting expat pay differentials. Mercer explicitly states it serves \"organizations deploying staff internationally.\"",
    },
    critique: {
      headline: "Expat comfort is not quality of life",
      body: "Mercer is EIU\u2019s corporate twin: four Swiss cities in the top 10. It doesn\u2019t even pretend to measure quality of life for residents \u2014 it measures quality of life for people whose companies pay their rent. The ranking explicitly targets \"organizations deploying staff internationally.\" No housing affordability. No local wages. No resident satisfaction surveys. The full dataset is sold to corporations; the public gets teasers. Cities know the annual cycle and invest in branding, infrastructure tweaks, and direct outreach to polish scores \u2014 a 12-month lobby cycle that rewards PR-savvy cities over substantive long-term improvements.",
    },
  },

  /* ── 3. Resonance World's Best Cities ── */
  {
    id: "resonance",
    name: "Resonance World\u2019s Best Cities",
    shortName: "Resonance",
    publisher: "Resonance Consultancy",
    year: 2025,
    citiesEvaluated: 275,
    accentHex: "#8c4a2a",
    focus: "\"Place Power\u2122\" for visitors, investors, and residents \u2014 marketing-friendly attractiveness powered by Instagram and TripAdvisor.",
    topCities: [
      { rank: 1, city: "London", country: "United Kingdom" },
      { rank: 2, city: "New York", country: "United States" },
      { rank: 3, city: "Paris", country: "France" },
      { rank: 4, city: "Tokyo", country: "Japan" },
      { rank: 5, city: "Madrid", country: "Spain" },
      { rank: 6, city: "Singapore", country: "Singapore" },
      { rank: 7, city: "Rome", country: "Italy" },
      { rank: 8, city: "Dubai", country: "UAE" },
      { rank: 9, city: "Berlin", country: "Germany" },
      { rank: 10, city: "Barcelona", country: "Spain" },
    ],
    methodology: {
      claimedPurpose: "Measure overall city attractiveness for visitors, investors, and residents.",
      actualMeasure: "Perception-driven PR for city brands. Mixes big data (Google search trends, Instagram hashtags, TripAdvisor sentiment) with official stats and ~22,000 resident surveys. \"Lovability\" \u2014 measured by social media sentiment \u2014 is a core pillar. High real estate values count as prosperity, not as an affordability crisis. Great for mayors chasing FDI and TikTok fame.",
      categories: [
        "Livability: infrastructure, safety, cleanliness, healthcare",
        "Lovability: cultural buzz, social media sentiment, tourist reviews",
        "Prosperity: economy, jobs, real estate values, tourism receipts",
      ],
      dataInputs: [
        "Big data: Google search trends, Instagram hashtags, TripAdvisor reviews",
        "Resident surveys (~22,000 people)",
        "Official economic statistics",
        "Real estate market data (high prices = high score)",
      ],
      blindSpots: [
        "Affordability for non-wealthy residents",
        "Inequality as a feature (high real estate = high score)",
        "Overtourism damage to resident quality of life",
        "Working conditions and labour protections",
        "Climate vulnerability and environmental justice",
      ],
      audienceNote: "City marketing boards, tourism authorities, real estate investors, and mayors chasing FDI.",
    },
    critique: {
      headline: "Spectacle is not liveability",
      body: "Resonance flips the script toward spectacle and capital flow. London/NYC/Paris top because they score high on \"lovability\" (Instagram reels, tourist queues) and prosperity (sky-high real estate as a proxy for success). Dubai and Singapore rank high because authoritarian efficiency + investment flows = \"attractive.\" The ranking rewards overtourism, gentrification, and inequality-as-feature. It\u2019s the only major index where making a city more expensive literally improves its score. Numbeo\u2019s crowdsourced approach is more transparent but equally flawed \u2014 academics call its crime/safety indices \"worthless\" due to non-representative sampling.",
    },
  },

  /* ── 4. Monocle Quality of Life ── */
  {
    id: "monocle",
    name: "Monocle Quality of Life Survey",
    shortName: "Monocle",
    publisher: "Monocle Magazine",
    year: 2025,
    citiesEvaluated: 25,
    accentHex: "#b85c28",
    focus: "Journalistic lifestyle view \u2014 \"what cities do better than anyone else\" for cosmopolitan, design-savvy readers who can already afford to live anywhere.",
    topCities: [
      { rank: 1, city: "Paris", country: "France", note: "Best all-rounder" },
      { rank: 2, city: "Madrid", country: "Spain", note: "Best for health" },
      { rank: 3, city: "Athens", country: "Greece", note: "Best for nightlife" },
      { rank: 4, city: "Barcelona", country: "Spain", note: "Best for urban greening" },
      { rank: 5, city: "Vienna", country: "Austria", note: "Best for housing" },
      { rank: 6, city: "Z\u00fcrich", country: "Switzerland", note: "Best for mobility" },
      { rank: 7, city: "Mexico City", country: "Mexico", note: "Best for conviviality" },
      { rank: 8, city: "Lisbon", country: "Portugal", note: "Best for safe streets" },
      { rank: 9, city: "Tokyo", country: "Japan", note: "Best for cleanliness" },
      { rank: 10, city: "Tallinn", country: "Estonia", note: "Best for startups" },
    ],
    methodology: {
      claimedPurpose: "Capture holistic quality of life combining hard metrics and soft factors.",
      actualMeasure: "Editorial lifestyle preferences of affluent, design-conscious cosmopolitans. Only 25 cities \u2014 pre-selected by Monocle editors, not data. Awards categories (\"Best for conviviality\") substitute for actual numerical ranking. Fetishizes bike lanes, third-wave coffee, and Superblocks while centering wealthy capitals. Filtered through journalists, not residents.",
      categories: [
        "Hard metrics: life expectancy, crime statistics, green space %, social housing, transit ridership, CO\u2082 cuts",
        "Soft assessments: conviviality, nightlife, cleanliness, work-life balance, urban greening, mobility, startup scene",
      ],
      dataInputs: [
        "Mix of official statistics (life expectancy, crime, emissions)",
        "Subjective expert and journalist assessments",
        "Monocle bureau reports from each city",
        "Category-specific awards rather than pure numerical ranking",
      ],
      blindSpots: [
        "Affordability for non-wealthy residents",
        "Working conditions and overwork (despite valuing \"work-life balance\")",
        "Inequality and social mobility",
        "Global South representation (beyond token exceptions like Mexico City)",
        "Systemic issues vs. aesthetic improvements",
      ],
      audienceNote: "Readers who can already afford to live anywhere on the list.",
    },
    critique: {
      headline: "Taste is not data",
      body: "Monocle is the hipster outlier \u2014 more subjective, European-heavy but with wild cards (Mexico City, Athens, Tallinn). Only 25 cities, pre-selected by editors \u2014 not a global assessment, a curated gallery. It pretends to capture the soul of a city but is filtered through journalists who value bike lanes and third-wave coffee over systemic issues. Vienna wins for housing? Noble, but ignores that social housing is under attack across Europe. What looks like diversity (Athens! Mexico City!) is still curated through the same affluent cosmopolitan gaze. No affordability. No resident surveys. No accountability.",
    },
  },

  /* ── 5. Yonsei-Cambridge Smart Cities Index ── */
  {
    id: "yonsei",
    name: "Yonsei\u2013Cambridge Smart Cities Index",
    shortName: "Yonsei",
    publisher: "Yonsei University (Prof. Junghoon Lee) + University of Cambridge IfM Engage",
    year: 2024,
    citiesEvaluated: 31,
    accentHex: "#a0382a",
    focus: "Academic assessment of smart city performance \u2014 how cities use digital technology and 4IR tools for urban services. The index SLIC is explicitly built to replace.",
    topCities: [
      { rank: 1, city: "New York", country: "United States" },
      { rank: 2, city: "Amsterdam", country: "Netherlands" },
      { rank: 3, city: "Vienna", country: "Austria" },
      { rank: 4, city: "Singapore", country: "Singapore" },
      { rank: 5, city: "London", country: "United Kingdom" },
      { rank: 6, city: "Seoul", country: "South Korea" },
      { rank: 7, city: "Barcelona", country: "Spain" },
      { rank: 8, city: "Copenhagen", country: "Denmark" },
      { rank: 9, city: "Tokyo", country: "Japan" },
      { rank: 10, city: "Sydney", country: "Australia" },
    ],
    methodology: {
      claimedPurpose: "Evaluate smart city performance \u2014 how cities use digital technology, data, AI, and IoT for urban services, governance, and sustainability.",
      actualMeasure: "Only evaluates 31 pre-selected \"leading\" cities \u2014 a tiny, elite club. Counts apps, platforms, and policy documents (1,400+ analyzed) rather than measuring outcomes for residents. A city with 50 smart city apps but unaffordable housing scores high. Biennial, academic, and behind paywalls. Tells you which cities have the most digital projects, not which cities those projects actually improved.",
      categories: [
        "Service Innovation",
        "Urban Intelligence (AI, data platforms)",
        "Urban Sustainability",
        "Urban Openness (open data, transparency)",
        "Infrastructure Integration (IoT, sensors)",
        "Urban Innovativeness",
        "Collaborative Partnership",
        "Smart City Governance",
      ],
      dataInputs: [
        "1,400+ apps, web platforms, and digital services analyzed",
        "Policy reviews and project documentation",
        "Qualitative case studies by academic researchers",
        "Expert analysis (not resident surveys)",
      ],
      blindSpots: [
        "Whether smart tech actually improves resident quality of life",
        "Digital divide \u2014 who benefits from smart services",
        "Affordability, housing, cost of living (entirely absent)",
        "Privacy concerns and surveillance implications of smart infrastructure",
        "Working conditions, overwork, tolerance, community",
        "Only 31 cities \u2014 excludes the vast majority of the world",
      ],
      audienceNote: "Urban planners, tech policymakers, and smart city consultants. Academic, not commercial \u2014 but still narrowly focused on digital transformation rather than lived experience.",
    },
    critique: {
      headline: "Digital infrastructure is not the same as lived outcomes",
      body: "The Yonsei\u2013Cambridge index is the most specialized of the five \u2014 an academic exercise focused on smart-city apps and platforms rather than on broader lived outcomes. With only 31 pre-selected cities, it covers a narrow slice of the urban world. It can tell you whether a city has visible digital infrastructure; it says much less about whether that infrastructure translates into affordability, workable hours, or stronger community conditions. SLIC was built to carry those outcome terms directly in the metric.",
    },
  },

  /* ── 6. IMD Smart City Index ── */
  {
    id: "imd",
    name: "IMD Smart City Index",
    shortName: "IMD",
    publisher: "IMD World Competitiveness Center + SUTD",
    year: 2024,
    citiesEvaluated: 142,
    accentHex: "#3a5c8c",
    focus: "How residents perceive smart technology in their city \u2014 the only major index based purely on citizen surveys rather than hard data.",
    topCities: [
      { rank: 1, city: "Zurich", country: "Switzerland" },
      { rank: 2, city: "Oslo", country: "Norway" },
      { rank: 3, city: "Canberra", country: "Australia" },
      { rank: 4, city: "Geneva", country: "Switzerland" },
      { rank: 5, city: "Auckland", country: "New Zealand" },
      { rank: 6, city: "Taipei", country: "Taiwan" },
      { rank: 7, city: "Singapore", country: "Singapore" },
      { rank: 8, city: "Copenhagen", country: "Denmark" },
      { rank: 9, city: "Abu Dhabi", country: "UAE" },
      { rank: 10, city: "Lausanne", country: "Switzerland" },
    ],
    methodology: {
      claimedPurpose: "Measure smart city performance through the perception of citizens who live and work there.",
      actualMeasure: "Around 120 residents per city answer a survey about whether tech infrastructure \"works for them.\" No hard metrics \u2014 pure perception. Asks things like \"do you use mobile apps for city services?\" and \"do you feel safe?\" A city that has smart bus apps but crushing rents scores well if its residents report satisfaction with the apps. Wealth correlates with tech satisfaction, so wealthy cities top the list regardless of their actual urban performance.",
      categories: [
        "Structures \u2014 Physical: transport, health facilities, green space, housing",
        "Structures \u2014 Institutional: governance, safety, social cohesion",
        "Technology \u2014 Services: smart apps, digital payments, mobility tech",
        "Technology \u2014 Connectivity: internet, 5G, digital infrastructure",
      ],
      dataInputs: [
        "~120 resident interviews per city (very small samples)",
        "Perception-based \u2014 no verified hard metrics",
        "Conducted jointly with Singapore University of Technology and Design (SUTD)",
        "Online surveys weighted to demographic quotas",
      ],
      blindSpots: [
        "Housing affordability (not measured at all)",
        "Actual tech outcomes vs. perceived satisfaction",
        "Digital divide \u2014 who is surveyed vs. who is excluded",
        "Labour rights, working hours, income inequality",
        "Survey bias: satisfied residents in wealthy cities give high scores regardless of structural gaps",
        "Small samples (120 people) cannot reliably represent cities of millions",
      ],
      audienceNote: "Smart city vendors, urban tech consultants, and government digital transformation teams. The ranking is frequently cited by tech companies as validation for their city deployments.",
    },
    critique: {
      headline: "Perception of tech is not the same as liveable outcomes",
      body: "The IMD index is methodologically unusual \u2014 it deliberately avoids hard data and measures only what residents think. This makes it resistant to gaming on metrics but extremely susceptible to wealth bias: residents of rich, stable cities simply report higher satisfaction with everything, including apps they barely use. Three Swiss cities appear in the top 10 on the strength of general satisfaction rather than measurable smart outcomes. The sample size (roughly 120 people per city) is statistically insufficient to represent cities of 1\u201310 million. The index is honest about measuring perception, but its headline rankings are regularly misread as measuring actual smart-city performance \u2014 which they do not.",
    },
  },

  /* ── 7. Mori Foundation Global Power City Index ── */
  {
    id: "mori",
    name: "Global Power City Index",
    shortName: "Mori GPCI",
    publisher: "Mori Memorial Foundation (Tokyo)",
    year: 2024,
    citiesEvaluated: 48,
    accentHex: "#5a3a8c",
    focus: "\"Magnetic power\" \u2014 how strongly a city attracts people and capital from around the world. Explicitly designed around the interests of global elites who move between cities.",
    topCities: [
      { rank: 1, city: "London", country: "United Kingdom" },
      { rank: 2, city: "New York", country: "United States" },
      { rank: 3, city: "Tokyo", country: "Japan" },
      { rank: 4, city: "Paris", country: "France" },
      { rank: 5, city: "Singapore", country: "Singapore" },
      { rank: 6, city: "Amsterdam", country: "Netherlands" },
      { rank: 7, city: "Beijing", country: "China" },
      { rank: 8, city: "Seoul", country: "South Korea" },
      { rank: 9, city: "Sydney", country: "Australia" },
      { rank: 10, city: "Dubai", country: "UAE" },
    ],
    methodology: {
      claimedPurpose: "Evaluate the comprehensive power of cities by their ability to attract people, capital, and enterprises from around the world.",
      actualMeasure: "Six \"functions\" scored across 70 indicators. Economy is the dominant function \u2014 GDP, financial market size, corporate HQ concentration, ease of doing business. \"Livability\" exists as a sub-function but is weighted low and covers only residential comfort for mobile professionals. Backed by the Mori Building Company (a major Tokyo real estate developer), which creates a structural incentive to favor financial centers over resident-centric cities. Only 48 pre-selected \"global\" cities \u2014 not a representative world assessment.",
      categories: [
        "Economy (financial market size, corporate HQ, business ease, GDP)",
        "R&D (patents, researchers, university rankings, innovation output)",
        "Cultural Interaction (tourism, international events, language accessibility)",
        "Livability (workplaces, cost of living, safety, shopping, schools for expatriates)",
        "Environment (CO\u2082 emissions, green space, environmental policy)",
        "Accessibility (international flights, transport links, connectivity)",
      ],
      dataInputs: [
        "70 indicators from 48 cities",
        "IMF, World Bank, UN, OECD data",
        "Questionnaire surveys targeting mobile professionals (not general residents)",
        "Mori Foundation research team in Tokyo",
      ],
      blindSpots: [
        "Affordability and housing costs for ordinary residents",
        "Inequality and income distribution within cities",
        "Working conditions, overwork culture (notably absent for Tokyo)",
        "Community cohesion and social capital",
        "Excludes cities in Africa, most of South/Southeast Asia, Latin America",
        "Structural conflict: publisher (Mori Building) profits from cities scoring highly on real estate value",
      ],
      audienceNote: "Global corporations, real estate investors, and high-net-worth individuals deciding where to base regional operations. Designed to serve the mobile global class, not residents.",
    },
    critique: {
      headline: "Measuring global power, not the ability to build a life",
      body: "Mori GPCI is the most transparent about what it values: the ability to attract capital, talent, and enterprise. It makes no pretence of measuring quality of life for ordinary residents. \"Livability\" is one of six functions and is weighted for professionals on the move, not locals. Tokyo's persistent top-three finish is interesting: Mori Building is a major Tokyo developer with a direct financial interest in Tokyo\u2019s global prestige ranking. The index excludes the overwhelming majority of the world\u2019s cities, all of Sub-Saharan Africa, and most of Southeast Asia and South America \u2014 because they are not yet hubs for mobile global capital. The index is honest about serving global elites; the problem is when its results are used to guide public policy for ordinary residents.",
    },
  },

  /* ── 8. Oxford Economics Global Cities Index ── */
  {
    id: "oxford",
    name: "Oxford Economics Global Cities Index",
    shortName: "Oxford Econ",
    publisher: "Oxford Economics",
    year: 2024,
    citiesEvaluated: 300,
    accentHex: "#2a4c6c",
    focus: "Economic performance and future growth trajectory \u2014 which cities offer the best conditions for business, investment, and high-skill labour. Essentially a forward-looking investment map.",
    topCities: [
      { rank: 1, city: "New York", country: "United States" },
      { rank: 2, city: "London", country: "United Kingdom" },
      { rank: 3, city: "Tokyo", country: "Japan" },
      { rank: 4, city: "Paris", country: "France" },
      { rank: 5, city: "Singapore", country: "Singapore" },
      { rank: 6, city: "Los Angeles", country: "United States" },
      { rank: 7, city: "Seoul", country: "South Korea" },
      { rank: 8, city: "Sydney", country: "Australia" },
      { rank: 9, city: "Amsterdam", country: "Netherlands" },
      { rank: 10, city: "Chicago", country: "United States" },
    ],
    methodology: {
      claimedPurpose: "Measure current city performance and growth potential across economics, human capital, quality of life, environment, and governance.",
      actualMeasure: "Economics and human capital together dominate the score. The index is explicitly designed to inform corporate location decisions and public-sector investment strategies \u2014 the same clients who pay Oxford Economics for customised city benchmarking reports. Quality of life is a sub-pillar but is weighted much lower than economic output and labour-market depth. Future growth outlook (a separate but related product) is frequently conflated with the current index in media coverage, blurring present-day performance with forecast trajectories. Oxford Economics sells bespoke city analysis to governments and developers \u2014 the same entities whose cities appear in the ranking.",
      categories: [
        "Economics: GDP, growth rate, trade, financial depth, business environment",
        "Human Capital: talent pool, education levels, research output, skills",
        "Quality of Life: healthcare access, safety, environment, housing (weakly weighted)",
        "Environment: emissions, green infrastructure, climate risk",
        "Governance: institutional quality, transparency, regulatory efficiency",
      ],
      dataInputs: [
        "IMF, World Bank, OECD, national statistics offices",
        "Oxford Economics proprietary GDP and growth models",
        "Business environment indices (World Bank Doing Business)",
        "No resident surveys \u2014 entirely data-model driven",
      ],
      blindSpots: [
        "Housing affordability and rent burden for residents",
        "Income inequality within cities",
        "Working conditions, burnout, overwork (absent)",
        "Community social capital and civic health",
        "Digital divide and technology access inequality",
        "Conflict of interest: publisher sells advisory services to cities in the ranking",
      ],
      audienceNote: "Corporate real estate teams, sovereign wealth funds, city economic development agencies, and consultants advising governments on investment attraction. Not designed for residents.",
    },
    critique: {
      headline: "A location map for capital, not a quality-of-life index",
      body: "Oxford Economics GCI is the most candid of the eight about its purpose: it is a product for investors and corporations deciding where to place capital and talent. Economics accounts for the largest share of the score, and \u2018quality of life\u2019 is included primarily because it affects the ability to attract high-skill workers \u2014 not because residents\u2019 wellbeing matters in its own right. The publisher also sells bespoke city analysis to governments and developers, creating a structural incentive to include influential clients as \u2018top performers.\u2019 Housing affordability, working hours, and inequality are absent. The resulting top 10 is entirely predictable: the cities where the most capital already sits.",
    },
  },
];

/* ── Editorial hero copy ── */
export const COMPARE_HERO = {
  eyebrow: "COMPARE RANKINGS",
  title: "Eight indices. Same planet.\nCompletely different answers.",
  subtitle: "Drag the spider to rebuild SLIC\u2019s top 10 in real time.",
  thesis:
    "Each major city ranking serves a different use case and weighting frame. EIU and Mercer lean toward relocation and hardship logic; Resonance toward brand and visitor signals; Monocle toward editorial lifestyle framing; Yonsei toward smart-city platforms; IMD toward resident perception of tech; Mori GPCI toward global financial magnetism; Oxford Economics toward investment return. Small score gaps are often over-read as hard fact. SLIC differs by placing affordability, overwork, tolerance, and community conditions directly inside the published formula.",
  overarchingCritique:
    "These rankings often converge on wealthy, globally legible cities because their inputs and audiences reward those conditions. Cities also learn the annual cycle and can optimize for the visible variables. Studies comparing ranking outputs with resident surveys often show only partial overlap. The point of this comparison is not to declare one list fraudulent; it is to show that every board reflects its chosen frame.",
};

/* ── SLIC difference cards ── */
export const SLIC_DIFFERENCE = [
  {
    title: "Disposable income after rent",
    body: "Tracks what remains after housing costs, adjusted for purchasing power. It measures residual room to live rather than treating GDP or salary alone as sufficient.",
  },
  {
    title: "Overwork and working-time pressure",
    body: "Adds working-time pressure directly into the score so that efficiency and long-hour cultures are not treated as automatic positives.",
  },
  {
    title: "Tolerance and civic openness",
    body: "Measures whether difference can be lived with low friction in daily life, using structural openness rather than tourism branding or surface cosmopolitanism.",
  },
  {
    title: "Cultural experience diversity",
    body: "Not museums-per-capita for tourists. The variety and depth of lived cultural life \u2014 food, community, public gathering \u2014 for residents, not visitors.",
  },
  {
    title: "Suicide and mental strain",
    body: "Includes severe mental-strain indicators as a public-health pressure term rather than leaving them outside the city score.",
  },
  {
    title: "Graduate housing burden",
    body: "Tracks how much of a young graduate\u2019s salary goes to housing, making early-career affordability visible instead of assuming all residents enter the market with assets.",
  },
];

/* ── Editorial notes for echo-chamber cities ──
   Keyed by lowercase city name.
   Each note calls out 1–2 specific SLIC dimensions where the city underperforms,
   grounded in actual pillar scores where the city is in SLIC's 160-city dataset.
*/
export interface EchoChamberNote {
  en: string;
  th: string;
  zh: string;
  slicRank?: number; // omit if city is outside SLIC's current 160-city coverage
}

export const ECHO_CHAMBER_NOTES: Record<string, EchoChamberNote> = {
  singapore: {
    slicRank: 27,
    en: "Community pillar scores 11.3 — the lowest of any comparable city — driven by political-freedom and civic-openness indicators. Growth also reflects working-time pressure: annual working hours rank among the world's longest.",
    th: "คะแนนเสาชุมชนอยู่ที่ 11.3 — ต่ำที่สุดในบรรดาเมืองระดับเดียวกัน — เนื่องจากเสรีภาพทางการเมืองและความเปิดกว้างด้านพลเมืองต่ำ และการเติบโตยังสะท้อนแรงกดดันจากชั่วโมงการทำงานที่ยาวที่สุดในโลก",
    zh: "社区支柱得分仅11.3分——在同类城市中最低——主要受政治自由度与公民开放性指标拖累。增长支柱亦因工时压力失分：年均工作时长位居全球最高之列。",
  },
  zurich: {
    slicRank: 29,
    en: "Growth scores 32.3: disposable income after rent is punishing at Zurich's price level, and graduate housing burden is severe. Creative pillar at 49.4 reflects a stable but not particularly dynamic cultural and startup economy.",
    th: "คะแนนเสาการเติบโต 32.3: รายได้ที่เหลือหลังจ่ายค่าเช่าในซูริกอยู่ในระดับรุนแรง ภาระที่อยู่อาศัยของบัณฑิตก็สูงมาก และคะแนนเสาความสร้างสรรค์ 49.4 สะท้อนระบบนิเวศสตาร์ทอัพที่มั่นคงแต่ไม่ค่อยมีพลวัต",
    zh: "增长支柱得分32.3：以苏黎世的物价水平，扣除房租后的可支配收入极为有限，毕业生住房负担尤为沉重。创意支柱49.4分，反映的是一个稳定但缺乏活力的文化与创业经济体。",
  },
  copenhagen: {
    slicRank: 30,
    en: "Viability scores 61.8: Copenhagen's housing costs have risen sharply over the past decade, and affordability now lags its reputation significantly. Growth at 37.6 reflects a high-cost, moderate-growth economy.",
    th: "คะแนนเสาความน่าอยู่ 61.8: ค่าเช่าโคเปนเฮเกนขึ้นอย่างรวดเร็วในทศวรรษที่ผ่านมา ความสามารถในการจ่ายตามไม่ทัน ส่วนคะแนนการเติบโต 37.6 สะท้อนเศรษฐกิจที่มีต้นทุนสูงแต่เติบโตพอประมาณ",
    zh: "宜居支柱得分61.8：哥本哈根过去十年房价涨幅明显，可负担性已大幅落后于其声誉。增长支柱37.6，反映的是一个高成本、温和增长的经济体。",
  },
  sydney: {
    slicRank: 31,
    en: "Growth scores just 22.4 — one of the lowest in the dataset — driven by an acute rent-to-income crisis that has been building for two decades. Community at 40.5 is moderate; civic social cohesion scores are below its peers.",
    th: "คะแนนเสาการเติบโตเพียง 22.4 — หนึ่งในต่ำที่สุดในชุดข้อมูล — เนื่องจากวิกฤตค่าเช่าต่อรายได้ที่สะสมมานานกว่าสองทศวรรษ คะแนนชุมชน 40.5 ถือว่าปานกลาง",
    zh: "增长支柱仅22.4分——在整个数据集中属于最低之列——由持续积累二十年的房租收入比危机所驱动。社区支柱40.5分，公民社会凝聚力得分低于同类城市。",
  },
  vienna: {
    slicRank: 35,
    en: "Creative pillar scores 41.4 — Vienna's cultural reputation rests on historical capital more than current output, and the startup ecosystem is modest. Growth at 37.5 reflects a slowly expanding, ageing-demographic economy.",
    th: "คะแนนเสาความสร้างสรรค์ 41.4 — ชื่อเสียงทางวัฒนธรรมของเวียนนาพึ่งพาทุนทางประวัติศาสตร์มากกว่าผลผลิตปัจจุบัน ส่วนคะแนนการเติบโต 37.5 สะท้อนเศรษฐกิจขยายตัวช้าและประชากรสูงวัย",
    zh: "创意支柱得分41.4——维也纳的文化声誉更多依赖历史积淀而非当下产出，创业生态系统规模有限。增长支柱37.5，反映的是一个增长缓慢、人口老龄化的经济体。",
  },
  amsterdam: {
    slicRank: 42,
    en: "Community scores 53.2: tolerance indicators are good but declining as housing pressure and migration tensions bite. Creative at 42.8 reflects an economy increasingly oriented toward tech and finance rather than cultural production.",
    th: "คะแนนชุมชน 53.2: ตัวชี้วัดความอดกลั้นดีแต่ลดลง เพราะแรงกดดันด้านที่อยู่อาศัยและความตึงเครียดด้านการย้ายถิ่น คะแนนความสร้างสรรค์ 42.8 สะท้อนระบบเศรษฐกิจที่หันหน้าหาเทคโนโลยีและการเงินมากกว่าการผลิตทางวัฒนธรรม",
    zh: "社区支柱得分53.3分：包容性指标较好但呈下降趋势，住房压力与移民矛盾正在侵蚀这一优势。创意支柱42.8分，反映的是一个日益向科技与金融倾斜、而非文化生产的经济体。",
  },
  paris: {
    slicRank: 44,
    en: "Growth scores 28.9 — near the bottom for a G7 capital — reflecting housing burden, sluggish wage growth for non-elite residents, and documented working-time pressure at the professional tier. Safety indicators also pull the Viability score down.",
    th: "คะแนนเสาการเติบโต 28.9 — เกือบต่ำสุดในบรรดาเมืองหลวง G7 — สะท้อนภาระที่อยู่อาศัย การเติบโตของค่าจ้างที่ช้าสำหรับประชากรทั่วไป และแรงกดดันชั่วโมงทำงาน ตัวชี้วัดด้านความปลอดภัยยังกดคะแนนความน่าอยู่ด้วย",
    zh: "增长支柱仅28.9分——在G7首都城市中接近垫底——反映出住房负担、非精英居民薪资增长乏力以及有据可查的职业层工时压力。安全指标亦拉低了宜居支柱得分。",
  },
  auckland: {
    slicRank: 68,
    en: "Growth scores 20.2 — the lowest of any city appearing in a mainstream index top-10 list — almost entirely driven by one of the world's most acute housing-cost crises. Creative at 35.1 reflects a small, geographically isolated cultural economy.",
    th: "คะแนนเสาการเติบโต 20.2 — ต่ำที่สุดในบรรดาเมืองที่ติด top-10 ของดัชนีกระแสหลัก — เกือบทั้งหมดมาจากวิกฤตค่าที่อยู่อาศัยรุนแรงที่สุดแห่งหนึ่งในโลก คะแนนความสร้างสรรค์ 35.1 สะท้อนระบบเศรษฐกิจทางวัฒนธรรมขนาดเล็กที่แยกตัวทางภูมิศาสตร์",
    zh: "增长支柱仅20.2分——在所有出现于主流指数前10名的城市中最低——几乎完全由其全球最为严峻的住房成本危机所驱动。创意支柱35.1分，反映了一个规模较小、地理上相对孤立的文化经济体。",
  },
  // ── Global reference cities now in SLIC (added April 2026) ────────────────
  london: {
    slicRank: 9,
    en: "Enters SLIC at #9 with Growth 37.0 — a middling score that reflects London's housing-burden penalty (rent-to-income ratio clamped at the dataset's worst threshold) and working-time pressure at the professional tier. Strong on Capability (healthcare, education) and Creative (VC density, cultural depth).",
    th: "เข้าสู่ SLIC อันดับที่ 9 ด้วยคะแนนเสาการเติบโต 37.0 — สะท้อนภาระค่าเช่าที่สูงสุดในชุดข้อมูล และชั่วโมงทำงานระดับวิชาชีพ แต่แข็งแกร่งด้านศักยภาพ (ระบบสุขภาพ การศึกษา) และความสร้างสรรค์ (VC ความอุดมทางวัฒนธรรม)",
    zh: "以 #9 进入 SLIC，增长支柱 37.0 — 反映伦敦住房负担（租金收入比触及数据集最差阈值）与职业层工时压力。能力（医疗、教育）与创意（风投密度、文化深度）表现强劲。",
  },
  "new york": {
    slicRank: 2,
    en: "Enters SLIC at #2 just behind Kaohsiung. Creative pillar 75.3 leads the top-10 cohort (VC deal density, R&D intensity, cultural mass). Growth 39.3 is the drag — housing burden clamped to the dataset's worst value and severe working-time pressure penalise despite high Capability 82.0 and strong Community 71.5.",
    th: "เข้าสู่ SLIC อันดับที่ 2 ตามหลัง Kaohsiung นิดเดียว คะแนนความสร้างสรรค์ 75.3 นำกลุ่ม top-10 (ความหนาแน่น VC การวิจัย ความอุดมทางวัฒนธรรม) คะแนนการเติบโต 39.3 เป็นตัวถ่วง — ภาระค่าเช่าถึงจุดแย่สุดในชุดข้อมูล แต่ศักยภาพ 82.0 และชุมชน 71.5 ยังแข็งแกร่ง",
    zh: "以 #2 进入 SLIC，仅次于 Kaohsiung。创意支柱 75.3 居前十之首（风投密度、研发强度、文化规模）。增长 39.3 是主要拖累——住房负担触及数据集最差值，职业层工时压力严重，但能力 82.0 与社区 71.5 仍表现强劲。",
  },
  tokyo: {
    slicRank: 37,
    en: "Enters SLIC at #37 with Growth 35.4 and Community 51.6 — both drag scores. Long working hours (39.1 h/week), severe suicide indicator (15.4 per 100k), and modest LGBTQ+ legal environment all weigh. Viability 81.5 is strong (low homicide, clean air); Capability 76.8 decent.",
    th: "เข้าสู่ SLIC อันดับที่ 37 ด้วยคะแนนการเติบโต 35.4 และชุมชน 51.6 — ทั้งคู่ถ่วง ชั่วโมงทำงานยาว (39.1 ชม./สัปดาห์) ตัวชี้วัดการฆ่าตัวตายรุนแรง (15.4 ต่อ 100k) และกรอบกฎหมาย LGBTQ+ อ่อน ความน่าอยู่ 81.5 แข็งแกร่ง ศักยภาพ 76.8 พอใช้",
    zh: "以 #37 进入 SLIC，增长支柱 35.4 与社区支柱 51.6 均为拖累项。长工时（39.1 小时/周）、严峻的自杀指标（15.4/10万）与较弱的 LGBTQ+ 法律环境共同拉低。宜居 81.5 表现突出，能力 76.8 中上。",
  },
  // Cities still outside SLIC's 160-city dataset
  barcelona: {
    en: "Outside SLIC's current 160-city coverage. Tourism-driven rent inflation and working-time pressure above Northern European norms would be SLIC's primary concerns, alongside documented deterioration in housing affordability.",
    th: "บาร์เซโลนาอยู่นอกชุดข้อมูล 160 เมืองของ SLIC ปัจจุบัน ค่าเช่าที่พุ่งจากการท่องเที่ยวและชั่วโมงทำงานที่สูงกว่าค่าเฉลี่ยยุโรปเหนือจะเป็นปัญหาหลัก",
    zh: "巴塞罗那目前不在SLIC的160座城市数据集中。旅游驱动的租金上涨、高于北欧规范的工时压力，以及有据可查的住房可负担性恶化，将是SLIC关注的首要问题。",
  },
  madrid: {
    en: "Outside SLIC's current 160-city coverage. Worsening housing affordability in recent years and documented working-time culture exceeding Northern European norms are the two likeliest SLIC pressure points.",
    th: "มาดริดอยู่นอกชุดข้อมูล 160 เมืองของ SLIC ปัจจุบัน การที่อยู่อาศัยแย่ลงในช่วงหลัง และวัฒนธรรมการทำงานยาวนานกว่ายุโรปเหนือจะเป็นปัจจัยกดคะแนน",
    zh: "马德里目前不在SLIC的160座城市数据集中。近年来住房可负担性持续恶化，以及高于北欧规范的工时文化，是SLIC最可能重点扣分的两项因素。",
  },
};
