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

  /* \u2500\u2500 9. Hanke Annual Misery Index \u2500\u2500 */
  {
    id: "hanke",
    name: "Hanke Annual Misery Index",
    shortName: "Hanke HAMI",
    publisher: "Steve H. Hanke (Johns Hopkins) / Independent Institute",
    year: 2025,
    citiesEvaluated: 178,
    accentHex: "#5c3a8c",
    focus: "Pure macroeconomic stress: 2\u00d7unemployment + inflation + bank-lending-rate \u2212 real GDP/capita growth. Lower scores = 'happier' economy.",
    topCities: [
      { rank: 1, city: "Taipei", country: "Taiwan", score: "2.12", note: "Country: Taiwan" },
      { rank: 2, city: "Singapore", country: "Singapore", score: "2.59" },
      { rank: 3, city: "Bangkok", country: "Thailand", score: "3.14", note: "Country: Thailand" },
      { rank: 4, city: "Dublin", country: "Ireland", score: "5.35" },
      { rank: 5, city: "Abidjan", country: "C\u00f4te d'Ivoire", score: "6.29" },
      { rank: 6, city: "Macau", country: "Macau", score: "6.66" },
      { rank: 7, city: "Tokyo", country: "Japan", score: "7.20", note: "Country: Japan" },
      { rank: 8, city: "Doha", country: "Qatar", score: "7.24" },
      { rank: 9, city: "Ouagadougou", country: "Burkina Faso", score: "7.38" },
      { rank: 10, city: "Bissau", country: "Guinea-Bissau", score: "7.40" },
    ],
    methodology: {
      claimedPurpose: "Measure 'the temperature of the patient' \u2014 how miserable or healthy the macroeconomic environment is for an average resident.",
      actualMeasure: "Pure macroeconomic vital signs. Captures inflation, unemployment, lending rates, and growth per capita. By construction it ignores everything that isn't a Bloomberg-feedable number \u2014 mental health, civic freedom, LGBTQ+ legal environment, working hours, housing affordability for non-citizens, environmental misery, gender equality, social trust. Hanke himself frames the index as economic vital signs, not wellbeing. Authoritarian states with low inflation and tight labour markets (Singapore, Qatar, Macau) consistently appear near the top.",
      categories: [
        "End-period consumer price inflation rate",
        "Bank lending rate (cost of credit)",
        "Unemployment rate (weighted \u00d72)",
        "Real GDP per capita growth (subtracted)",
      ],
      dataInputs: [
        "IMF + World Bank + national central banks for inflation",
        "ILO + national labor statistics for unemployment",
        "Central bank data for lending rates",
        "IMF / World Bank for GDP per capita growth",
      ],
      blindSpots: [
        "Mental-health distress (depression, suicide, work-related burnout)",
        "Civic freedom and political rights (Hanke's top-10 includes Qatar, Singapore, Macau)",
        "LGBTQ+ legal environment",
        "Working-time pressure and overwork culture",
        "Housing affordability for non-citizen residents (Singapore's HDB regime favours citizens)",
        "Environmental misery \u2014 air quality, climate extremes",
        "Income inequality within a country (national averages hide extreme distributions)",
        "Gender equality and women's autonomy",
      ],
      audienceNote: "Macroeconomists, central banks, sovereign-debt analysts. Useful as one input for assessing whether a country is heading into a debt crisis. Not designed to tell you whether residents are flourishing.",
    },
    critique: {
      headline: "A thermostat, not a wellbeing index",
      body: "HAMI was honestly designed to measure macroeconomic stability and nothing else, and within that scope it works. The trouble is when it gets read as a happiness ranking and authoritarian states with low inflation and tight labor markets \u2014 Singapore, Qatar, Macau \u2014 appear in the top 10. Hanke himself never claimed otherwise; the index is a temperature reading. SLIC measures whether the patient wants to keep living there. The gap between Hanke's Singapore #2 and SLIC's Singapore #21 is exactly the dignity dimension Hanke's formula deliberately excludes \u2014 mental-health distress, civic freedom, LGBTQ+ legal restrictions, world's lowest fertility rate as the lived consequence.",
    },
  },

  /* \u2500\u2500 10. SLIC Soft Power 2026 \u2500\u2500 */
  {
    id: "slic-soft-power",
    name: "SLIC Soft Power 2026",
    shortName: "SLIC Soft Power",
    publisher: "SLIC Index \u2014 companion ranking to the main SLIC livability index",
    year: 2026,
    citiesEvaluated: 30,
    accentHex: "#c8741a",
    focus: "Cities ranked by attraction power \u2014 visitor magnetism, religious and ethnic pluralism, cuisine diversity, cultural exports, and visa openness in both directions. Built explicitly to challenge the Eurocentric bias of Michelin, Resonance, Brand Finance, Monocle Soft Power, and other Western-anchored cultural rankings.",
    topCities: [
      { rank: 1,  city: "Bangkok",     country: "Thailand",   score: "94.8", note: "32.4M international arrivals (#1 globally, MasterCard 2024); Pew GRI ~2.6 (low restrictions); 5 officially-recognized faiths living in one metro; 93 countries visa-exempt + DTV; BL drama and Muay Thai global cultural exports" },
      { rank: 2,  city: "Tokyo",       country: "Japan",      score: "88.3", note: "Anime, manga, J-pop, washoku UNESCO heritage; Henley passport rank 1; Japan tourism 36.8M arrivals 2024" },
      { rank: 3,  city: "Istanbul",    country: "Turkey",     score: "85.1", note: "13.4M visitors; bridge of civilisations; mosque-church-synagogue coexistence; Hagia Sophia + Grand Bazaar; Turkish dizi global" },
      { rank: 4,  city: "Seoul",       country: "South Korea", score: "82.4", note: "K-pop (BTS, Blackpink), K-drama (Squid Game, Parasite), K-beauty global; Hallyu wave; 12M visitors" },
      { rank: 5,  city: "Mexico City", country: "Mexico",     score: "78.6", note: "UNESCO-listed traditional cuisine; mariachi; muralism; lucha libre; pre-Columbian + colonial + modern layered identity" },
      { rank: 6,  city: "Marrakesh",   country: "Morocco",    score: "76.2", note: "Berber + Arab + French colonial fusion; medina UNESCO site; gnawa music; tagine + couscous global; 14M Morocco arrivals 2024" },
      { rank: 7,  city: "Kuala Lumpur",country: "Malaysia",   score: "73.5", note: "Malay-Chinese-Indian trilingual coexistence; halal-tropical fusion cuisine; mosque-temple-church streetscape; 14M visitors; passport rank 12 globally" },
      { rank: 8,  city: "Mumbai",      country: "India",      score: "71.8", note: "Bollywood \u2014 world's largest film industry by volume; pan-Indian cuisine concentration; Hindu + Muslim + Parsi + Christian + Jain layered city" },
      { rank: 9,  city: "Lima",        country: "Peru",       score: "70.3", note: "Peruvian cuisine globally ranked top-3 culinary tradition (World's 50 Best Restaurants); Inca + Spanish + Asian-Peruvian (chifa, nikkei) fusion; Pacific port crossroads" },
      { rank: 10, city: "Lisbon",      country: "Portugal",   score: "68.4", note: "Fado, Portuguese cuisine global, friendly nomad capital, Brazilian + African Lusophone cultural ties" },
    ],
    methodology: {
      claimedPurpose: "Measure attraction power \u2014 the soft cultural pull a city exerts on visitors, residents, and the global imagination. Built specifically because Brand Finance, Monocle Soft Power Survey, and similar indices structurally favour Western capitals (London, Paris, New York) and miss the actual gravitational centres of global cultural traffic.",
      actualMeasure: "Five-component composite: Magnetism (visitor count weighted by visitor-to-resident ratio, 30%), Pluralism (Pew Government Restrictions on Religion inverted + legal recognition of multiple faiths + ethnic-minority public participation, 25%), Cuisine Density (Shannon entropy of cuisine categories per square km of central metro, 20%), Cultural Exports (global presence of city-originated media \u2014 film, music, drama, sport \u2014 and culinary diaspora, 15%), Mobility Openness (inbound visa-free destinations available + outbound passport mobility, 10%).",
      categories: [
        "Magnetism (30%): MasterCard / Euromonitor international arrivals, Visitor-to-resident ratio (city + metro both)",
        "Pluralism (25%): Pew Research Government Restrictions on Religion (inverted), legal recognition of plural faiths, ethnic-minority public participation",
        "Cuisine Density (20%): Shannon entropy of cuisine categories within 1km of a 500m grid in central metro (Google Places + OSM tags)",
        "Cultural Exports (15%): Global presence of city's drama/music/film/sport (Thai BL, K-drama, anime, Bollywood, Muay Thai, etc.)",
        "Mobility Openness (10%): Henley Passport Index (outbound) + inbound visa-exemption count + nomad-visa availability (DTV-style)",
      ],
      dataInputs: [
        "MasterCard Global Destination Cities Index 2024 (international arrivals)",
        "UN World Tourism Organisation arrival statistics",
        "Pew Research Center Government Restrictions on Religion 2022",
        "U.S. State Department International Religious Freedom Reports",
        "Henley Passport Index (Q1 2026)",
        "Government immigration / nomad-visa publications (Thai DTV, Indonesia KITAS, Mexico FMM, etc.)",
        "Google Places + OpenStreetMap cuisine-tag taxonomy",
        "Brand Finance Global Soft Power Index (country-level baseline)",
      ],
      blindSpots: [
        "Resident burden \u2014 soft power tells you nothing about whether locals can afford rent",
        "Working conditions \u2014 visitors don't see overwork",
        "Political freedom \u2014 countries with restricted civic life can still project soft power (Saudi Arabia hosting Vision 2030 events, China's Belt-and-Road cultural diplomacy)",
        "Equality of cultural participation \u2014 index measures *what's exported*, not who benefits inside the city",
        "Quality vs. quantity tension \u2014 McDonald's is 'cultural export' by any measure; this index leans toward authentic local culture",
      ],
      audienceNote: "Tourism boards, cultural diplomacy ministries, MICE planners, expat-life publications, soft-power scholars. Not a livability index \u2014 pair with SLIC's main ranking for the resident view.",
    },
    critique: {
      headline: "Bangkok #1 isn't an opinion \u2014 it's the data when Eurocentric weighting is removed",
      body: "Brand Finance ranks France, UK, Germany, Japan in their soft power top 5. Monocle's annual list reads identically. The reason is methodology: those indices weight institutional reputation (universities, embassies, multilateral organisations) and English/French language ubiquity, both of which structurally favour Western capitals. SLIC Soft Power inverts this by weighting *who actually shows up* \u2014 visitor count, cuisine diversity, religious pluralism, visa openness in both directions. On those measures Bangkok leads, Tokyo and Istanbul follow, and global-south cultural capitals (Mexico City, Marrakesh, Mumbai, Lima) clear top 10 ahead of Paris and London. The most-visited city on Earth being recognised as the world's #1 soft-power city isn't controversial \u2014 it's what the data has been saying all along, ignored only because it reaches conclusions Western indices were not built to surface.",
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
  title: "Ten indices. Same planet.\nCompletely different answers.",
  subtitle: "Drag the spider to rebuild SLIC\u2019s top 10 in real time.",
  thesis:
    "Each major city ranking serves a different use case and weighting frame. EIU and Mercer lean toward relocation and hardship logic; Resonance toward brand and visitor signals; Monocle toward editorial lifestyle framing; Yonsei toward smart-city platforms; IMD toward resident perception of tech; Mori GPCI toward global financial magnetism; Oxford Economics toward investment return; Hanke HAMI toward pure macroeconomic stress (inflation + unemployment + lending rate \u2212 growth); SLIC Soft Power 2026 toward visitor magnetism, religious pluralism, cuisine density, cultural exports and mobility openness, where Bangkok ranks #1 once Eurocentric weighting is removed. Small score gaps are often over-read as hard fact. SLIC differs by placing affordability, overwork, tolerance, civic-freedom dignity, and community conditions directly inside the published formula \u2014 the dimensions that purely-economic indices like Hanke's deliberately exclude.",
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
    slicRank: 21,
    en: "Hanke ranks Singapore #2 'happiest economy' in 2025 — but on macroeconomic stability alone (low inflation, tight labour market, low lending rate). SLIC sees the same Singapore at #21: world-class Capability 94 and Creative 73 still hold up, but Community 38 and Pressure 43 reflect what Hanke chose not to measure — civic freedom under closed-autocracy rule (HRMI Empowerment 3.7/10), criminalised gender recognition, 30-year career penalties for LGBTQ+ public servants, world's lowest fertility rate (TFR 0.87) as the existential consequence, 45-hour weeks (PMC research), and HDB ownership now requiring 8.9 years of median income vs 4.8 a generation ago.",
    th: "SLIC อันดับ #18 ภายใต้ AMPI ชั้นสาธารณะ Gamma ศักยภาพ 94.1 สูงสุดในชุดข้อมูล (ระบบสุขภาพ การศึกษา ธรรมาภิบาลดิจิทัล) ความสร้างสรรค์ 73.3 และความน่าอยู่ 87.4 ก็ระดับสูง สิ่งที่จำกัดคือชุมชน 38.8 — เสรีภาพพลเมืองและความอดกลั้นต่ำกว่าคู่เทียบ สิงคโปร์แข็งในเสาที่เมืองมั่งคั่งคาดหวัง แต่ overlay สาธารณะจัดให้อยู่ Gamma เพราะ Community ต่ำกว่าพื้น Alpha และ Beta",
    zh: "AMPI 下 SLIC 第 18 名，公开层为 Gamma。能力支柱 94.1 是全数据集最高；创意 73.3 与宜居 87.4 亦属顶级。拖累是社区支柱 38.8 ——公民自由与包容性远低于同等财富水平的城市。新加坡在富裕同侪期待的支柱上很强，但公开层覆盖将其归入 Gamma，因为社区低于 Alpha 与 Beta 的门槛。",
  },
  zurich: {
    slicRank: 28,
    en: "SLIC #28 under AMPI, public-tier Gamma. Viability 97.6 is near-perfect (safety, air, water, digital), Community 76.0 solid. But Growth 39.1 — disposable income after Swiss rents, graduate housing burden — and Creative 49.4 create enough variance that AMPI pulls the overall down. Zurich scores the way Zurich actually is: immaculate, moderately dynamic, crushingly expensive.",
    th: "SLIC อันดับ #28 ภายใต้ AMPI ชั้นสาธารณะ Gamma ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ ชุมชน 76.0 ดี แต่ Growth 39.1 — รายได้คงเหลือหลังค่าเช่าสวิส ภาระที่อยู่อาศัย — และ Creative 49.4 สร้างความแปรปรวนจน AMPI ฉุดคะแนนรวมลง",
    zh: "AMPI 下 SLIC 第 28 名，公开层为 Gamma。宜居 97.6 接近完美，社区 76.0 稳健。但增长 39.1（瑞士房租后的可支配收入、毕业生住房负担）与创意 49.4 制造的方差足以令 AMPI 拉低总分。苏黎世得分如实：无可挑剔、中等活力、贵得令人窒息。",
  },
  copenhagen: {
    slicRank: 19,
    en: "SLIC #19 under AMPI, public-tier Gamma. Community 89.6 is the dataset's strongest social-cohesion signal (tolerance, gender equality, social trust). Viability 97.9 matches Paris and Amsterdam at the top of the scale. But Growth 33.1 — Copenhagen's housing costs have risen sharply over the past decade — keeps the AMPI penalty live. The strongest community signal in the index still places Copenhagen inside the top 20 by score, with Gamma reflecting where it lands once the affordability floor binds.",
    th: "SLIC อันดับ #19 ภายใต้ AMPI ชั้นสาธารณะ Gamma ชุมชน 89.6 เป็นสัญญาณความสามัคคีทางสังคมที่แรงที่สุดในชุดข้อมูล ความน่าอยู่ 97.9 อยู่ระดับยอดเท่ากับ Paris และ Amsterdam แต่ Growth 33.1 — ค่าเช่าโคเปนเฮเกนเพิ่มขึ้นมากในทศวรรษที่ผ่านมา — ทำให้ AMPI ลงโทษ สัญญาณชุมชนที่แรงที่สุดในดัชนียังดึงโคเปนเฮเกนเข้า top 20 ตามคะแนน โดย Gamma สะท้อนตำแหน่งหลังพื้นความสามารถในการอยู่อาศัยจำกัด",
    zh: "AMPI 下 SLIC 第 19 名，公开层为 Gamma。社区 89.6 是整个数据集最强的社会凝聚信号。宜居 97.9 与巴黎、阿姆斯特丹并列榜首。但增长 33.1 ——哥本哈根过去十年房价大涨——令 AMPI 持续扣分。最强的社区信号仍让哥本哈根按分数稳居前 20，Gamma 则反映可负担门槛绑定后的实际定位。",
  },
  sydney: {
    slicRank: 51,
    en: "SLIC #51 under AMPI, no public-tier seat. Viability 89.5 and Capability 87.1 are genuinely strong; Creative 63.9 solid. But Growth 27.8 — Sydney's world-class rent-to-income crisis — pulls AMPI hard. Australia is excluded from the Alpha public tier under SLIC's editorial rule (cost-of-living for the median resident), and Perth has already claimed Australia's Beta seat by ranking higher.",
    th: "SLIC อันดับ #51 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 89.5 และศักยภาพ 87.1 แข็งจริง ความสร้างสรรค์ 63.9 ดี แต่ Growth 27.8 — วิกฤตค่าเช่าระดับโลกของซิดนีย์ — ดึง AMPI ลงแรง ออสเตรเลียถูกกันออกจาก Alpha สาธารณะตามกฎบรรณาธิการ และเพิร์ธคู่เทียบได้ที่นั่ง Beta ของออสเตรเลียไปแล้วเพราะอันดับสูงกว่า",
    zh: "AMPI 下 SLIC 第 51 名，未获公开层席位。宜居 89.5 与能力 87.1 强劲，创意 63.9 稳健。但增长 27.8 ——悉尼世界级的租金收入比危机——重压 AMPI。按 SLIC 的编辑规则（中位居民可负担），澳大利亚被排除出 Alpha；珀斯已凭更高排名占据澳洲在 Beta 的席位。",
  },
  vienna: {
    slicRank: 34,
    en: "SLIC #34 under AMPI, no public-tier seat. Viability 87.1, Capability 74.4, Community 71.1 — Vienna is consistently solid on the classic liveability frame. Creative 41.4 is the drag: Vienna's cultural reputation rests on historical capital more than current output, and the startup ecosystem is modest. The two European Alpha seats are filled by Eindhoven and Graz, and Austria is already claimed by Graz.",
    th: "SLIC อันดับ #34 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 87.1 ศักยภาพ 74.4 ชุมชน 71.1 — เวียนนาแข็งสม่ำเสมอในกรอบความน่าอยู่คลาสสิก Creative 41.4 เป็นตัวถ่วง สองที่นั่ง Alpha ของยุโรปถูกครองโดย Eindhoven และ Graz และออสเตรียถูกอ้างสิทธิ์ผ่าน Graz แล้ว",
    zh: "AMPI 下 SLIC 第 34 名，未获公开层席位。宜居 87.1、能力 74.4、社区 71.1 ——维也纳在经典宜居框架中各项稳健。创意 41.4 是拖累。欧洲两个 Alpha 席位由 Eindhoven 与 Graz 占据，而奥地利已通过 Graz 获得代表。",
  },
  amsterdam: {
    slicRank: 55,
    en: "SLIC #55 under AMPI, no public-tier seat. Viability 97.6 is near-perfect, but Growth 37.6 and Creative 42.8 create pillar variance that AMPI penalises meaningfully. Tolerance indicators remain good but declining as housing pressure and migration tensions bite. Amsterdam under AMPI is no longer a top-40 city.",
    th: "SLIC อันดับ #55 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ แต่ Growth 37.6 และ Creative 42.8 สร้างความแปรปรวนที่ AMPI ลงโทษอย่างมีนัยสำคัญ ตัวชี้วัดความอดกลั้นยังดีแต่ลดลงเพราะแรงกดดันด้านที่อยู่อาศัยและความตึงเครียดด้านการอพยพ อัมสเตอร์ดัมภายใต้ AMPI ไม่ใช่เมือง top-40 อีกต่อไป",
    zh: "AMPI 下 SLIC 第 55 名，未获公开层席位。宜居 97.6 接近完美，但增长 37.6 与创意 42.8 制造的方差被 AMPI 明显惩罚。包容性尚好但在住房与移民压力下下滑。在 AMPI 下阿姆斯特丹已不再是前 40 的城市。",
  },
  paris: {
    slicRank: 68,
    en: "SLIC #68 under AMPI, no public-tier seat. Viability 97.9 and Community 69.2 are excellent. Growth 27.7 is among the lowest of any G7 capital — housing burden, median-resident income negative after central rent, working-time pressure at the professional tier. AMPI punishes the extreme outlier: Paris cannot compensate for its affordability catastrophe with Viability and culture, and the European Alpha seats are claimed by smaller cities where residents actually thrive.",
    th: "SLIC อันดับ #68 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 97.9 และชุมชน 69.2 ยอดเยี่ยม Growth 27.7 ต่ำสุดในบรรดาเมืองหลวง G7 — ภาระค่าเช่า รายได้มัธยฐานติดลบ ชั่วโมงทำงานระดับวิชาชีพ AMPI ลงโทษค่าผิดปกติสุดขั้ว ที่นั่ง Alpha ยุโรปถูกครองโดยเมืองเล็กกว่าที่ผู้อยู่อาศัยรุ่งเรืองจริง",
    zh: "AMPI 下 SLIC 第 68 名，未获公开层席位。宜居 97.9 与社区 69.2 出色。增长 27.7 是 G7 首都中最低之列——住房负担、中位居民可支配收入为负、职场工时压力。AMPI 惩罚极端离群值：巴黎无法用宜居与文化补偿其可负担性灾难。欧洲 Alpha 席位由真正让居民安居的小城所占。",
  },
  auckland: {
    slicRank: 52,
    en: "SLIC #52 under AMPI, no public-tier seat. Viability 92.6 remains strong and Capability 85.7 is genuinely high, but Growth 32.4 and Community 57.2 create the variance that AMPI penalises. Auckland's housing-cost crisis combines with working-hours pressure to drag the overall composite below cities with more even pillar profiles, and Oceania is barred from the Alpha tier under SLIC's editorial rule.",
    th: "SLIC อันดับ #52 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 92.6 ยังแข็งและศักยภาพ 85.7 สูงจริง แต่ Growth 32.4 และ Community 57.2 สร้างความแปรปรวนที่ AMPI ลงโทษ ค่าเช่าและชั่วโมงทำงานในโอ๊กแลนด์ฉุดคะแนนรวมให้ต่ำกว่าเมืองที่มีโปรไฟล์เสาสมดุลกว่า และโอเชียเนียถูกกันออกจาก Alpha ตามกฎบรรณาธิการของ SLIC",
    zh: "AMPI 下 SLIC 第 52 名，未获公开层席位。宜居 92.6 仍强、能力 85.7 确实高，但增长 32.4 与社区 57.2 造成的方差受到 AMPI 惩罚。奥克兰房价危机叠加工时压力，将合成分拉低于支柱剖面更均衡的城市；按 SLIC 编辑规则，大洋洲被排除出 Alpha。",
  },
  // ── Global reference cities now in SLIC (added April 2026) ────────────────
  london: {
    slicRank: 29,
    en: "SLIC #29 under AMPI with score 58.2, public-tier Gamma. The weighted mean of London's other four pillars sits in the 59–83 range — a profile that would place it well inside the top-20 of any conventional index. AMPI's imbalance penalty is what drops it, because Growth at 35.1 is so far below those other pillars. For the median Londoner, central rent wipes out net salary before other essentials. London earns Gamma — visible on the public shelf, but openly classified as a city the median resident cannot afford.",
    th: "SLIC อันดับ #29 ภายใต้ AMPI คะแนน 58.2 ชั้นสาธารณะ Gamma ค่าเฉลี่ยของอีกสี่เสาลอนดอนอยู่ในช่วง 59–83 — โปรไฟล์ที่จะจัดอยู่ใน top-20 ของดัชนีทั่วไป แต่การลงโทษความไม่สมดุลของ AMPI ฉุดลง เพราะ Growth ที่ 35.1 ต่ำกว่าเสาอื่นมาก สำหรับคนลอนดอนทั่วไป ค่าเช่าใจกลางกินเงินเดือนสุทธิก่อนค่าใช้จ่ายอื่น ลอนดอนได้ Gamma — มองเห็นบนชั้นสาธารณะ แต่ถูกจัดอย่างตรงไปตรงมาว่าเป็นเมืองที่ผู้อยู่อาศัยมัธยฐานไม่อาจรับได้",
    zh: "AMPI 下 SLIC 第 29 名，得分 58.2，公开层为 Gamma。伦敦另外四根支柱位于 59–83 区间——常规指数中这种剖面会稳居前 20。但 AMPI 的失衡惩罚将其压低，因为增长支柱 35.1 远低于其他支柱。对典型伦敦人而言，市中心房租在扣除其他必需开销前便吞没净薪。伦敦获得 Gamma——公开层面可见，但被明确标识为中位居民负担不起的城市。",
  },
  "new york": {
    slicRank: 36,
    en: "SLIC #36 under AMPI with score 57.7, no public-tier seat. Weighted-mean tells you NYC's four strong pillars sit between 68 and 85 — an apex profile. AMPI tells you the weighted mean lies: Growth at 27.1 is such a catastrophic outlier against Capability 82 and Creative 75.3 that the overall score drops materially. The United States is already represented on the public shelf by Raleigh in Alpha — a city where the median resident actually thrives — and NYC's median-resident affordability falls below every public-tier floor. The city most mainstream indices rank top-5 lands, under honest pillar-imbalance scoring, in no public tier at all.",
    th: "AMPI ทำให้ SLIC ของ NYC อยู่อันดับ #36 คะแนน 57.7 ไม่มีที่นั่งในชั้นสาธารณะ ค่าเฉลี่ยถ่วงน้ำหนักของสี่เสาที่แข็งอยู่ระหว่าง 68–85 — โปรไฟล์ระดับยอด แต่ AMPI บอกว่าค่าเฉลี่ยโกหก: Growth 27.1 เป็นค่าผิดปกติรุนแรงเทียบกับ Capability 82 และ Creative 75.3 จนคะแนนรวมตกลงมาก สหรัฐอเมริกามีตัวแทนสาธารณะแล้วผ่าน Raleigh ใน Alpha — เมืองที่ผู้อยู่อาศัยมัธยฐานรุ่งเรืองจริง — และความสามารถในการอยู่อาศัยของผู้อยู่ NYC ต่ำกว่าพื้นทุกชั้นสาธารณะ เมืองที่ดัชนีกระแสหลักจัด top-5 — ภายใต้การให้คะแนนความไม่สมดุลอย่างตรงไปตรงมา — ลงเอยที่ไม่มีชั้นสาธารณะเลย",
    zh: "AMPI 下 SLIC 第 36 名，得分 57.7，未获公开层席位。加权均值告诉你纽约的四根强支柱位于 68–85 ——顶级剖面。但 AMPI 揭穿了这个均值：增长 27.1 相对于能力 82 与创意 75.3 是灾难性的离群值，令总分明显下降。美国已在公开层由 Raleigh 代表（其中位居民真正安居），而纽约的可负担性低于所有公开层门槛。这座主流指数排进前 5 的城市，在诚实衡量支柱失衡时，未能进入任何公开层。",
  },
  tokyo: {
    slicRank: 21,
    en: "SLIC #21 under AMPI with score 59.5, public-tier Beta. Tokyo's Viability 94.2 is among the highest of any top-30 city (homicide 0.25/100k, clean air, safe streets), Capability 76.8 is strong, and Community 70.2 is solid. Variance still bites — Growth 46.2 (long hours, household debt) and Creative 44.2 (modest startup density) are below the others — and Tokyo is barred from Alpha under SLIC's editorial rule (cost-of-living for the median resident). Japan's Alpha seat goes to Fukuoka — quieter, more affordable, and more honest about how Japanese residents actually live. Tokyo earns Beta: globally famous, structurally compromised, openly classified.",
    th: "SLIC อันดับ #21 ภายใต้ AMPI คะแนน 59.5 ชั้นสาธารณะ Beta ความน่าอยู่ของโตเกียว 94.2 อยู่ในกลุ่มสูงสุดของ top-30 (ฆาตกรรม 0.25/100k อากาศสะอาด ถนนปลอดภัย) ศักยภาพ 76.8 แข็ง และชุมชน 70.2 มั่นคง ยังมีความแปรปรวน — Growth 46.2 (ชั่วโมงยาว หนี้ครัวเรือน) และ Creative 44.2 (ความหนาแน่นสตาร์ทอัพปานกลาง) ต่ำกว่าเสาอื่น — และโตเกียวถูกกันออกจาก Alpha ตามกฎบรรณาธิการของ SLIC (ค่าครองชีพของผู้อยู่อาศัยมัธยฐาน) ที่นั่ง Alpha ของญี่ปุ่นจึงเป็นของฟุกุโอกะ — เงียบกว่า รับได้กว่า ตรงกับวิธีที่ผู้อยู่อาศัยญี่ปุ่นจริงใช้ชีวิต โตเกียวได้ Beta: ดังระดับโลก แตกร้าวเชิงโครงสร้าง ถูกจัดประเภทอย่างเปิดเผย",
    zh: "AMPI 下 SLIC 第 21 名，得分 59.5，公开层为 Beta。东京宜居支柱 94.2 是前 30 名最高之列（凶杀 0.25/10万、空气清洁、街道安全），能力 76.8 强，社区 70.2 稳健。方差仍存——增长 46.2（长工时、家庭债务）与创意 44.2（创业密度中等）低于其他——按 SLIC 的编辑规则（中位居民可负担），东京被排除出 Alpha。日本的 Alpha 席位归福冈所有——更安静、更可负担，也更贴近日本居民的真实生活。东京获 Beta：全球闻名、结构受损、明确分类。",
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
