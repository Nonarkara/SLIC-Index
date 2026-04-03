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
      headline: "Stability is not liveability",
      body: "EIU obsesses over \"stability\" and expat comfort, producing permanent Northern European/Anglosphere dominance. The top 10 cities are often separated by 0.1\u20132 points out of 100 \u2014 the narcissism of small differences. One new park or one traffic tweak can swing rankings. Melbourne vs. Auckland at a ~1.8% gap? Statistically meaningless. Yet the annual \"World\u2019s Most Liveable City\" headline drives millions in city marketing. The methodology is proprietary \u2014 you can\u2019t audit it, replicate it, or verify it. Studies comparing EIU rankings to actual surveys of locals show weak correlation. The same \"liveable\" cities (Vancouver, Melbourne) have brutal housing crises that locals endure while expats get hardship allowances.",
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
      { rank: 2, city: "New York City", country: "United States" },
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
      headline: "Gadgetry is not governance",
      body: "The Yonsei\u2013Cambridge index is the most specialized of the five \u2014 an academic exercise that counts smart city apps and platforms rather than measuring whether technology improves anyone\u2019s life. Only 31 cities, pre-selected as \"leading\" \u2014 an elite club that excludes 96% of the world\u2019s urban population. It tells you New York has impressive digital infrastructure, not that New York\u2019s subway is falling apart while its apps are slick. SLIC was built specifically to ask the question Yonsei avoids: does the technology actually translate into a city where people can afford to live, work reasonable hours, and find community? Outcomes over gadgetry. That\u2019s the SLIC doctrine.",
    },
  },
];

/* ── Editorial hero copy ── */
export const COMPARE_HERO = {
  eyebrow: "COMPARE RANKINGS",
  title: "Six indices. Same planet.\nCompletely different answers.",
  subtitle: "Drag the spider to rebuild SLIC\u2019s top 10 in real time.",
  thesis:
    "Every major city ranking is an ideological artifact engineered to serve a specific constituency \u2014 corporate HR, tourism boards, tech consultants, or lifestyle journalists \u2014 while masquerading as objective science. EIU and Mercer exist to calculate hardship pay for expats. Resonance sells \"Place Power\u2122\" to mayors chasing FDI. Monocle curates lifestyle for the already-rich. Yonsei counts smart city apps without asking if they help anyone. The top 10 cities in most rankings are separated by less than 2 points on a 100-point scale \u2014 the narcissism of small differences, amplified into headline news. None seriously weights affordability, overwork, tolerance, or whether a 25-year-old can still build a life there. SLIC does.",
  overarchingCritique:
    "All six rankings are self-reinforcing echo chambers for the global professional class. They converge on safe, clean, rich, Western-ish cities because that\u2019s who funds and consumes them. Cities know the annual cycle and invest in branding, infrastructure tweaks, and direct outreach to polish scores \u2014 a 12-month lobby cycle that rewards PR-savvy cities over substantive long-term improvements. Studies comparing these rankings to actual surveys of locals show weak correlation \u2014 people\u2019s satisfaction diverges sharply from expat-focused metrics. In 2026, with housing crises, migration pressures, and climate disruption, these lists feel not just outdated but actively harmful \u2014 selling a fantasy of \"best cities\" that excludes the majority of their actual inhabitants.",
};

/* ── SLIC difference cards ── */
export const SLIC_DIFFERENCE = [
  {
    title: "Disposable income after rent",
    body: "Not GDP. Not median salary. What\u2019s actually left in your pocket after housing costs, adjusted for purchasing power. The question every other index refuses to center.",
  },
  {
    title: "Overwork and working-time pressure",
    body: "Tokyo scores high elsewhere because it\u2019s \"efficient.\" SLIC penalizes cities where people work themselves to exhaustion. A city that burns out its residents is not liveable.",
  },
  {
    title: "Tolerance and civic openness",
    body: "SLIC measures whether a city welcomes difference \u2014 not as a tourism asset, but as a structural condition of daily life. Authoritarian-capitalist \"efficiency\" (Dubai, Singapore) gets no free pass.",
  },
  {
    title: "Cultural experience diversity",
    body: "Not museums-per-capita for tourists. The variety and depth of lived cultural life \u2014 food, community, public gathering \u2014 for residents, not visitors.",
  },
  {
    title: "Suicide and mental strain",
    body: "A negative signal that most indices quietly ignore. If your city\u2019s residents are killing themselves at high rates, your \"liveability\" score is a lie.",
  },
  {
    title: "Graduate housing burden",
    body: "How much of a young graduate\u2019s salary goes to housing. The question that exposes whether a city is liveable for the next generation, or only for those who already own property.",
  },
];
