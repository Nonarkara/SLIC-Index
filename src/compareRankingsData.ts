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

/* ── MasterCard Global Destination Cities Index 2019 (final published edition) ──
   Static external reference data. Visitor counts are international overnight
   arrivals in millions. Used to contrast "most visited" vs SLIC's "most livable"
   on the Compare page. 2019 was the final public edition before MasterCard
   discontinued the series post-pandemic. */
export interface MastercardGdciCity {
  rank: number;
  city: string;
  country: string;
  visitorsMillions: number;
}

export const MASTERCARD_GDCI_2019: MastercardGdciCity[] = [
  { rank: 1, city: "Bangkok", country: "Thailand", visitorsMillions: 22.8 },
  { rank: 2, city: "Paris", country: "France", visitorsMillions: 19.1 },
  { rank: 3, city: "London", country: "United Kingdom", visitorsMillions: 19.1 },
  { rank: 4, city: "Dubai", country: "UAE", visitorsMillions: 15.9 },
  { rank: 5, city: "Singapore", country: "Singapore", visitorsMillions: 14.7 },
  { rank: 6, city: "Kuala Lumpur", country: "Malaysia", visitorsMillions: 13.8 },
  { rank: 7, city: "New York", country: "United States", visitorsMillions: 13.6 },
  { rank: 8, city: "Istanbul", country: "Turkey", visitorsMillions: 13.4 },
  { rank: 9, city: "Tokyo", country: "Japan", visitorsMillions: 12.9 },
  { rank: 10, city: "Antalya", country: "Turkey", visitorsMillions: 12.4 },
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
   grounded in actual pillar scores where the city is in SLIC's 163-city dataset.
*/
export interface EchoChamberNote {
  en: string;
  th: string;
  zh: string;
  slicRank?: number; // omit if city is outside SLIC's current 163-city coverage
}

export const ECHO_CHAMBER_NOTES: Record<string, EchoChamberNote> = {
  singapore: {
    slicRank: 19,
    en: "SLIC #19 under AMPI. Capability 94.1 is the highest in the dataset (healthcare, education, digital governance); Creative 73.3 and Viability 87.4 also top-tier. The limit is Community 38.8 — restricted civic freedoms and tolerance scores well below wealth peers. Structural strength across four of five pillars keeps Singapore in the top 20, but the community penalty is what separates it from the Taiwanese and Canadian cities at the very top.",
    th: "SLIC อันดับ #19 ภายใต้ AMPI ศักยภาพ 94.1 สูงสุดในชุดข้อมูล (ระบบสุขภาพ การศึกษา ธรรมาภิบาลดิจิทัล) ความสร้างสรรค์ 73.3 และความน่าอยู่ 87.4 ก็ระดับสูง สิ่งที่จำกัดคือชุมชน 38.8 — เสรีภาพพลเมืองและความอดกลั้นต่ำกว่าคู่เทียบ ความแข็งแกร่งเชิงโครงสร้างของสี่เสาทำให้สิงคโปร์อยู่ใน top 20 แต่บทลงโทษด้านชุมชนคือสิ่งที่แยกสิงคโปร์ออกจากเมืองไต้หวันและแคนาดาที่อยู่ยอดสุด",
    zh: "AMPI 下 SLIC 第 19 名。能力支柱 94.1 是全数据集最高；创意 73.3 与宜居 87.4 亦属顶级。拖累是社区支柱 38.8 ——公民自由与包容性远低于同等财富水平的城市。四柱强势让新加坡稳居前 20，但社区扣分正是将其与台湾、加拿大城市拉开差距的原因。",
  },
  zurich: {
    slicRank: 29,
    en: "SLIC #29 under AMPI. Viability 97.6 is near-perfect (safety, air, water, digital), Community 76.0 solid. But Growth 39.1 — disposable income after Swiss rents, graduate housing burden — and Creative 49.4 create enough variance that AMPI pulls the overall down. Zurich scores the way Zurich actually is: immaculate, moderately dynamic, crushingly expensive.",
    th: "SLIC อันดับ #29 ภายใต้ AMPI ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ ชุมชน 76.0 ดี แต่ Growth 39.1 — รายได้คงเหลือหลังค่าเช่าสวิส ภาระที่อยู่อาศัย — และ Creative 49.4 สร้างความแปรปรวนจน AMPI ฉุดคะแนนรวมลง",
    zh: "AMPI 下 SLIC 第 29 名。宜居 97.6 接近完美，社区 76.0 稳健。但增长 39.1（瑞士房租后的可支配收入、毕业生住房负担）与创意 49.4 制造的方差足以令 AMPI 拉低总分。苏黎世得分如实：无可挑剔、中等活力、贵得令人窒息。",
  },
  copenhagen: {
    slicRank: 20,
    en: "SLIC #20 under AMPI. Community 89.6 is the dataset's strongest social-cohesion signal (tolerance, gender equality, social trust). Viability 97.9 matches Paris and Amsterdam at the top of the scale. But Growth 33.1 — Copenhagen's housing costs have risen sharply over the past decade — keeps the AMPI penalty live. Even with that drag, the strongest community signal in the index pulls Copenhagen into the top 20.",
    th: "SLIC อันดับ #20 ภายใต้ AMPI ชุมชน 89.6 เป็นสัญญาณความสามัคคีทางสังคมที่แรงที่สุดในชุดข้อมูล ความน่าอยู่ 97.9 อยู่ระดับยอดเท่ากับ Paris และ Amsterdam แต่ Growth 33.1 — ค่าเช่าโคเปนเฮเกนเพิ่มขึ้นมากในทศวรรษที่ผ่านมา — ทำให้ AMPI ลงโทษ แม้มีตัวถ่วงนี้ สัญญาณชุมชนที่แรงที่สุดในดัชนีก็ดึงโคเปนเฮเกนเข้า top 20",
    zh: "AMPI 下 SLIC 第 20 名。社区 89.6 是整个数据集最强的社会凝聚信号。宜居 97.9 与巴黎、阿姆斯特丹并列榜首。但增长 33.1 ——哥本哈根过去十年房价大涨——令 AMPI 持续扣分。即便如此，全数据集最强的社区信号将哥本哈根拉入前 20。",
  },
  sydney: {
    slicRank: 54,
    en: "SLIC #54 under AMPI. Viability 89.5 and Capability 87.1 are genuinely strong; Creative 63.9 solid. But Growth 27.8 — Sydney's world-class rent-to-income crisis — pulls AMPI hard. The pillar variance from Growth (27.8) to Capability (87.1) is exactly what AMPI penalises, and is what separates Sydney from Australian peer Perth despite very similar liveability and capability.",
    th: "SLIC อันดับ #54 ภายใต้ AMPI ความน่าอยู่ 89.5 และศักยภาพ 87.1 แข็งจริง ความสร้างสรรค์ 63.9 ดี แต่ Growth 27.8 — วิกฤตค่าเช่าระดับโลกของซิดนีย์ — ดึง AMPI ลงแรง ความแปรปรวนระหว่าง Growth (27.8) ถึง Capability (87.1) คือสิ่งที่ AMPI ลงโทษ และคือเหตุผลที่ซิดนีย์ห่างจากเพิร์ธคู่เทียบออสเตรเลียทั้งที่ค่า liveability และ capability ใกล้เคียงกัน",
    zh: "AMPI 下 SLIC 第 54 名。宜居 89.5 与能力 87.1 强劲，创意 63.9 稳健。但增长 27.8 ——悉尼世界级的租金收入比危机——重压 AMPI。从增长 (27.8) 到能力 (87.1) 的支柱方差正是 AMPI 所惩罚的，也是悉尼与澳洲同伴珀斯尽管宜居与能力相近、却被拉开差距的原因。",
  },
  vienna: {
    slicRank: 35,
    en: "SLIC #35 under AMPI. Viability 87.1, Capability 74.4, Community 71.1 — Vienna is consistently solid on the classic liveability frame. Creative 41.4 is the drag: Vienna's cultural reputation rests on historical capital more than current output, and the startup ecosystem is modest. AMPI tolerates this moderate imbalance.",
    th: "SLIC อันดับ #35 ภายใต้ AMPI ความน่าอยู่ 87.1 ศักยภาพ 74.4 ชุมชน 71.1 — เวียนนาแข็งสม่ำเสมอในกรอบความน่าอยู่คลาสสิก Creative 41.4 เป็นตัวถ่วง: ชื่อเสียงทางวัฒนธรรมพึ่งทุนประวัติศาสตร์มากกว่าผลผลิตปัจจุบัน",
    zh: "AMPI 下 SLIC 第 35 名。宜居 87.1、能力 74.4、社区 71.1 ——维也纳在经典宜居框架中各项稳健。创意 41.4 是拖累：文化声誉依赖历史积淀而非当下产出，创业生态规模有限。",
  },
  amsterdam: {
    slicRank: 58,
    en: "SLIC #58 under AMPI. Viability 97.6 is near-perfect, but Growth 37.6 and Creative 42.8 create pillar variance that AMPI penalises meaningfully. Tolerance indicators remain good but declining as housing pressure and migration tensions bite. Amsterdam under AMPI is no longer a top-40 city.",
    th: "SLIC อันดับ #58 ภายใต้ AMPI ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ แต่ Growth 37.6 และ Creative 42.8 สร้างความแปรปรวนที่ AMPI ลงโทษ",
    zh: "AMPI 下 SLIC 第 58 名。宜居 97.6 接近完美，但增长 37.6 与创意 42.8 制造的方差被 AMPI 明显惩罚。包容性尚好但在住房与移民压力下下滑。在 AMPI 下阿姆斯特丹已不再是前 40 的城市。",
  },
  paris: {
    slicRank: 71,
    en: "SLIC #71 under AMPI. Viability 97.9 and Community 69.2 are excellent. Growth 27.7 is among the lowest of any G7 capital — housing burden, median-resident income negative after central rent, working-time pressure at the professional tier. AMPI punishes the extreme outlier: Paris cannot compensate for its affordability catastrophe with Viability and culture.",
    th: "SLIC อันดับ #71 ภายใต้ AMPI ความน่าอยู่ 97.9 และชุมชน 69.2 ยอดเยี่ยม Growth 27.7 ต่ำสุดในบรรดาเมืองหลวง G7 — ภาระค่าเช่า รายได้มัธยฐานติดลบ ชั่วโมงทำงานระดับวิชาชีพ AMPI ลงโทษค่าผิดปกติสุดขั้ว",
    zh: "AMPI 下 SLIC 第 71 名。宜居 97.9 与社区 69.2 出色。增长 27.7 是 G7 首都中最低之列——住房负担、中位居民可支配收入为负、职场工时压力。AMPI 惩罚极端离群值：巴黎无法用宜居与文化补偿其可负担性灾难。",
  },
  auckland: {
    slicRank: 55,
    en: "SLIC #55 under AMPI. Viability 92.6 remains strong and Capability 85.7 is genuinely high, but Growth 32.4 and Community 57.2 create the variance that AMPI penalises. Auckland's housing-cost crisis combines with working-hours pressure to drag the overall composite below cities with more even pillar profiles.",
    th: "SLIC อันดับ #55 ภายใต้ AMPI ความน่าอยู่ 92.6 ยังแข็งและศักยภาพ 85.7 สูงจริง แต่ Growth 32.4 และ Community 57.2 สร้างความแปรปรวนที่ AMPI ลงโทษ ค่าเช่าและชั่วโมงทำงานในโอ๊กแลนด์ฉุดคะแนนรวมให้ต่ำกว่าเมืองที่มีโปรไฟล์เสาสมดุลกว่า",
    zh: "AMPI 下 SLIC 第 55 名。宜居 92.6 仍强、能力 85.7 确实高，但增长 32.4 与社区 57.2 造成的方差受到 AMPI 惩罚。奥克兰房价危机叠加工时压力，将合成分拉低于支柱剖面更均衡的城市。",
  },
  // ── Global reference cities now in SLIC (added April 2026) ────────────────
  london: {
    slicRank: 30,
    en: "SLIC #30 under AMPI with score 58.2. The weighted mean of London's other four pillars sits in the 59–83 range — a profile that would place it well inside the top-20 of any conventional index. AMPI's imbalance penalty is what drops it, because Growth at 35.1 is so far below those other pillars. For the median Londoner, central rent wipes out net salary before other essentials. London trades like a museum that's expensive to live inside.",
    th: "SLIC อันดับ #30 ภายใต้ AMPI คะแนน 58.2 ค่าเฉลี่ยของอีกสี่เสาลอนดอนอยู่ในช่วง 59–83 — โปรไฟล์ที่จะจัดอยู่ใน top-20 ของดัชนีทั่วไป แต่การลงโทษความไม่สมดุลของ AMPI ฉุดลง เพราะ Growth ที่ 35.1 ต่ำกว่าเสาอื่นมาก สำหรับคนลอนดอนทั่วไป ค่าเช่าใจกลางกินเงินเดือนสุทธิก่อนค่าใช้จ่ายอื่น ลอนดอนคือพิพิธภัณฑ์ที่แพงเหลือเกินถ้าอยากอยู่ข้างใน",
    zh: "AMPI 下 SLIC 第 30 名，得分 58.2。伦敦另外四根支柱位于 59–83 区间——常规指数中这种剖面会稳居前 20。但 AMPI 的失衡惩罚将其压低，因为增长支柱 35.1 远低于其他支柱。对典型伦敦人而言，市中心房租在扣除其他必需开销前便吞没净薪。伦敦像一座住进去极为昂贵的博物馆。",
  },
  "new york": {
    slicRank: 38,
    en: "SLIC #38 under AMPI with score 57.7. Weighted-mean tells you NYC's four strong pillars sit between 68 and 85 — an apex profile. AMPI tells you the weighted mean lies: Growth at 27.1 is such a catastrophic outlier against Capability 82 and Creative 75.3 that the overall score drops materially. NYC still clears top-40, because its extraordinary pillars are genuine — but the city most mainstream indices rank top-5 is, under honest pillar-imbalance scoring, a middle-of-the-top-quartile city for the median resident.",
    th: "AMPI ทำให้ SLIC ของ NYC อยู่อันดับ #38 คะแนน 57.7 ค่าเฉลี่ยถ่วงน้ำหนักของสี่เสาที่แข็งอยู่ระหว่าง 68–85 — โปรไฟล์ระดับยอด แต่ AMPI บอกว่าค่าเฉลี่ยโกหก: Growth 27.1 เป็นค่าผิดปกติรุนแรงเทียบกับ Capability 82 และ Creative 75.3 จนคะแนนรวมตกลงมาก NYC ยังติด top-40 เพราะเสาที่แข็งของมันจริง แต่เมืองที่ดัชนีกระแสหลักจัดไว้ top-5 — เมื่อให้คะแนนความไม่สมดุลอย่างตรงไปตรงมา — คือเมืองระดับกลางของ top-quartile สำหรับผู้อยู่อาศัยมัธยฐาน",
    zh: "AMPI 下 SLIC 第 38 名，得分 57.7。加权均值告诉你纽约的四根强支柱位于 68–85 ——顶级剖面。但 AMPI 揭穿了这个均值：增长 27.1 相对于能力 82 与创意 75.3 是灾难性的离群值，令总分明显下降。纽约仍居前 40 之列，因为它卓越的支柱是真实的——但主流指数排进前 5 的这座城市，在诚实衡量支柱失衡时，对中位数居民而言只是顶四分之一中游的城市。",
  },
  tokyo: {
    slicRank: 22,
    en: "SLIC #22 under AMPI with score 59.5. Tokyo's Viability 94.2 is among the highest of any top-30 city (homicide 0.25/100k, clean air, safe streets), Capability 76.8 is strong, and Community 70.2 is solid. Variance still bites — Growth 46.2 (long hours, household debt) and Creative 44.2 (modest startup density) are below the others — but the four supporting pillars are even enough that AMPI keeps Tokyo well inside the top quartile. Safer and more balanced than New York or Paris; behind only the Taiwanese cities and Seoul among Asian peers.",
    th: "SLIC อันดับ #22 ภายใต้ AMPI คะแนน 59.5 ความน่าอยู่ของโตเกียว 94.2 อยู่ในกลุ่มสูงสุดของ top-30 (ฆาตกรรม 0.25/100k อากาศสะอาด ถนนปลอดภัย) ศักยภาพ 76.8 แข็ง และชุมชน 70.2 มั่นคง ยังมีความแปรปรวน — Growth 46.2 (ชั่วโมงยาว หนี้ครัวเรือน) และ Creative 44.2 (ความหนาแน่นสตาร์ทอัพปานกลาง) ต่ำกว่าเสาอื่น — แต่สี่เสาสนับสนุนสมดุลพอที่ AMPI ทำให้โตเกียวอยู่ใน top-quartile อย่างมั่นคง ปลอดภัยและสมดุลกว่านิวยอร์กหรือปารีส รองจากเฉพาะเมืองไต้หวันและโซลในกลุ่มเอเชีย",
    zh: "AMPI 下 SLIC 第 22 名，得分 59.5。东京宜居支柱 94.2 是前 30 名最高之列（凶杀 0.25/10万、空气清洁、街道安全），能力 76.8 强，社区 70.2 稳健。方差仍存——增长 46.2（长工时、家庭债务）与创意 44.2（创业密度中等）低于其他——但四根支柱足够均衡，AMPI 让东京稳居前四分之一。比纽约或巴黎更安全、更平衡；在亚洲同行中仅次于台湾各城与首尔。",
  },
  // Cities still outside SLIC's 163-city dataset
  barcelona: {
    en: "Outside SLIC's current 163-city coverage. Tourism-driven rent inflation and working-time pressure above Northern European norms would be SLIC's primary concerns, alongside documented deterioration in housing affordability.",
    th: "บาร์เซโลนาอยู่นอกชุดข้อมูล 163 เมืองของ SLIC ปัจจุบัน ค่าเช่าที่พุ่งจากการท่องเที่ยวและชั่วโมงทำงานที่สูงกว่าค่าเฉลี่ยยุโรปเหนือจะเป็นปัญหาหลัก",
    zh: "巴塞罗那目前不在SLIC的163座城市数据集中。旅游驱动的租金上涨、高于北欧规范的工时压力，以及有据可查的住房可负担性恶化，将是SLIC关注的首要问题。",
  },
  madrid: {
    en: "Outside SLIC's current 163-city coverage. Worsening housing affordability in recent years and documented working-time culture exceeding Northern European norms are the two likeliest SLIC pressure points.",
    th: "มาดริดอยู่นอกชุดข้อมูล 163 เมืองของ SLIC ปัจจุบัน การที่อยู่อาศัยแย่ลงในช่วงหลัง และวัฒนธรรมการทำงานยาวนานกว่ายุโรปเหนือจะเป็นปัจจัยกดคะแนน",
    zh: "马德里目前不在SLIC的163座城市数据集中。近年来住房可负担性持续恶化，以及高于北欧规范的工时文化，是SLIC最可能重点扣分的两项因素。",
  },
};
