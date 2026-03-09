// ---------------------------------------------------------------------------
// Thailand Province-Level SLIC Data
// ---------------------------------------------------------------------------
// Province-level rankings adapted from the global SLIC methodology.
// Scores use eight pillars (0-100) tailored to Thailand's internal dynamics:
// safety, economy, health, education, environment, infrastructure, culture.
// ---------------------------------------------------------------------------

export type ThailandRegion =
  | "Central"
  | "North"
  | "Northeast (Isan)"
  | "South"
  | "East";

export type ProvinceType = "primary" | "secondary" | "emerging";

export type ProvinceStatus = "ranked" | "provisional";

export interface ProvinceScores {
  overall: number;
  safety: number;
  economy: number;
  health: number;
  education: number;
  environment: number;
  infrastructure: number;
  culture: number;
}

export interface ProvinceMetrics {
  /** Gross Provincial Product per capita (Thai baht) */
  gppPerCapita: number;
  /** Average monthly household income (Thai baht) */
  avgMonthlyIncome: number;
  /** Annual average PM2.5 concentration (ug/m3) */
  pm25Annual: number;
  /** Hospital beds per 10,000 population */
  hospitalBeds: number;
  /** Reported crimes per 100,000 population */
  crimeRate: number;
  /** Green/forest coverage as percentage of total area */
  greenCoverage: number;
}

export interface ThailandProvince {
  id: string;
  nameEn: string;
  nameTh: string;
  region: ThailandRegion;
  population: number;
  provinceType: ProvinceType;
  scores: ProvinceScores;
  metrics: ProvinceMetrics;
  highlights: string[];
  tagline: string;
  status: ProvinceStatus;
}

// ---------------------------------------------------------------------------
// Province data
// ---------------------------------------------------------------------------

export const thailandProvinces: ThailandProvince[] = [
  {
    id: "bangkok",
    nameEn: "Bangkok",
    nameTh: "กรุงเทพฯ",
    region: "Central",
    population: 5528,
    provinceType: "primary",
    scores: {
      overall: 78,
      safety: 62,
      economy: 92,
      health: 85,
      education: 88,
      environment: 42,
      infrastructure: 90,
      culture: 82,
    },
    metrics: {
      gppPerCapita: 628000,
      avgMonthlyIncome: 40200,
      pm25Annual: 32.4,
      hospitalBeds: 42,
      crimeRate: 285,
      greenCoverage: 11,
    },
    highlights: [
      "Highest concentration of tertiary hospitals and specialist care in the country",
      "Largest urban transit network with BTS, MRT, and Airport Rail Link",
      "Unmatched density of cultural venues, markets, and culinary diversity",
    ],
    tagline: "Economic powerhouse with world-class healthcare held back by congestion and air quality.",
    status: "ranked",
  },
  {
    id: "chiang-mai",
    nameEn: "Chiang Mai",
    nameTh: "เชียงใหม่",
    region: "North",
    population: 1792,
    provinceType: "primary",
    scores: {
      overall: 72,
      safety: 74,
      economy: 64,
      health: 72,
      education: 76,
      environment: 55,
      infrastructure: 66,
      culture: 90,
    },
    metrics: {
      gppPerCapita: 168000,
      avgMonthlyIncome: 24800,
      pm25Annual: 46.1,
      hospitalBeds: 32,
      crimeRate: 142,
      greenCoverage: 68,
    },
    highlights: [
      "Recognized as Thailand's creative and digital-nomad capital with a strong cafe and coworking scene",
      "Rich Lanna heritage with over 300 Buddhist temples and annual festivals like Yi Peng",
      "Proximity to national parks and highland communities outside the smoky season",
    ],
    tagline: "Cultural heart of the north with growing creative economy, constrained by seasonal burning haze.",
    status: "ranked",
  },
  {
    id: "phuket",
    nameEn: "Phuket",
    nameTh: "ภูเก็ต",
    region: "South",
    population: 418,
    provinceType: "primary",
    scores: {
      overall: 73,
      safety: 64,
      economy: 82,
      health: 70,
      education: 62,
      environment: 66,
      infrastructure: 72,
      culture: 68,
    },
    metrics: {
      gppPerCapita: 492000,
      avgMonthlyIncome: 34600,
      pm25Annual: 14.8,
      hospitalBeds: 35,
      crimeRate: 198,
      greenCoverage: 42,
    },
    highlights: [
      "Highest per-capita tourism revenue of any Thai province, driving a strong service economy",
      "International-standard private hospitals attract medical tourists from across Southeast Asia",
      "Clean coastal air quality year-round, among the best in Thailand",
    ],
    tagline: "Tourism-driven island economy with strong private healthcare and clean air, but uneven local services.",
    status: "ranked",
  },
  {
    id: "chiang-rai",
    nameEn: "Chiang Rai",
    nameTh: "เชียงราย",
    region: "North",
    population: 1298,
    provinceType: "secondary",
    scores: {
      overall: 62,
      safety: 72,
      economy: 48,
      health: 58,
      education: 60,
      environment: 52,
      infrastructure: 52,
      culture: 82,
    },
    metrics: {
      gppPerCapita: 98000,
      avgMonthlyIncome: 18200,
      pm25Annual: 51.3,
      hospitalBeds: 24,
      crimeRate: 118,
      greenCoverage: 72,
    },
    highlights: [
      "Home to the White Temple and Blue Temple, drawing cultural tourism year-round",
      "Strong ethnic diversity with Akha, Lahu, and Hmong hill-tribe communities",
      "Emerging specialty coffee and tea growing region in highland areas",
    ],
    tagline: "Culturally rich northern frontier with severe seasonal haze and limited urban infrastructure.",
    status: "ranked",
  },
  {
    id: "khon-kaen",
    nameEn: "Khon Kaen",
    nameTh: "ขอนแก่น",
    region: "Northeast (Isan)",
    population: 1808,
    provinceType: "secondary",
    scores: {
      overall: 66,
      safety: 70,
      economy: 60,
      health: 72,
      education: 74,
      environment: 62,
      infrastructure: 60,
      culture: 72,
    },
    metrics: {
      gppPerCapita: 152000,
      avgMonthlyIncome: 22400,
      pm25Annual: 28.6,
      hospitalBeds: 34,
      crimeRate: 156,
      greenCoverage: 28,
    },
    highlights: [
      "Regional education hub with Khon Kaen University anchoring health and research sectors",
      "Planned high-speed rail connection to Bangkok will reshape connectivity",
      "Growing Isan gastronomy scene celebrated for som tam and regional specialties",
    ],
    tagline: "Isan's emerging urban center with university-driven healthcare and education strengths.",
    status: "ranked",
  },
  {
    id: "hat-yai-songkhla",
    nameEn: "Hat Yai / Songkhla",
    nameTh: "หาดใหญ่/สงขลา",
    region: "South",
    population: 1424,
    provinceType: "secondary",
    scores: {
      overall: 65,
      safety: 58,
      economy: 68,
      health: 68,
      education: 66,
      environment: 64,
      infrastructure: 64,
      culture: 70,
    },
    metrics: {
      gppPerCapita: 178000,
      avgMonthlyIncome: 23600,
      pm25Annual: 18.2,
      hospitalBeds: 28,
      crimeRate: 212,
      greenCoverage: 38,
    },
    highlights: [
      "Major cross-border commerce hub serving Malaysian and regional trade corridors",
      "Songkhla Lake is the largest natural lake in Thailand, supporting local fisheries",
      "Diverse cultural identity blending Thai-Buddhist, Malay-Muslim, and Chinese communities",
    ],
    tagline: "Southern commercial gateway with strong trade links but ongoing security concerns in the deep south.",
    status: "ranked",
  },
  {
    id: "nakhon-ratchasima",
    nameEn: "Nakhon Ratchasima (Korat)",
    nameTh: "นครราชสีมา",
    region: "Northeast (Isan)",
    population: 2634,
    provinceType: "secondary",
    scores: {
      overall: 63,
      safety: 66,
      economy: 58,
      health: 64,
      education: 64,
      environment: 60,
      infrastructure: 62,
      culture: 68,
    },
    metrics: {
      gppPerCapita: 142000,
      avgMonthlyIncome: 20800,
      pm25Annual: 26.4,
      hospitalBeds: 26,
      crimeRate: 168,
      greenCoverage: 32,
    },
    highlights: [
      "Gateway to the Isan plateau and Thailand's largest province by population",
      "Khao Yai National Park, a UNESCO World Heritage site, is within the province",
      "Expanding industrial estates attracting manufacturing investment from the Eastern Seaboard",
    ],
    tagline: "Isan gateway balancing agricultural heritage with growing industrial ambitions.",
    status: "ranked",
  },
  {
    id: "chonburi-pattaya",
    nameEn: "Chonburi / Pattaya",
    nameTh: "ชลบุรี/พัทยา",
    region: "East",
    population: 1592,
    provinceType: "primary",
    scores: {
      overall: 70,
      safety: 56,
      economy: 80,
      health: 72,
      education: 64,
      environment: 54,
      infrastructure: 76,
      culture: 62,
    },
    metrics: {
      gppPerCapita: 386000,
      avgMonthlyIncome: 30200,
      pm25Annual: 24.1,
      hospitalBeds: 30,
      crimeRate: 248,
      greenCoverage: 22,
    },
    highlights: [
      "Part of the Eastern Economic Corridor (EEC), Thailand's flagship industrial zone",
      "Laem Chabang port is the country's largest and busiest container port",
      "Pattaya's tourism economy is diversifying into conferences, sports, and family segments",
    ],
    tagline: "Industrial and tourism powerhouse on the eastern seaboard with high output but urban management challenges.",
    status: "ranked",
  },
  {
    id: "udon-thani",
    nameEn: "Udon Thani",
    nameTh: "อุดรธานี",
    region: "Northeast (Isan)",
    population: 1584,
    provinceType: "emerging",
    scores: {
      overall: 58,
      safety: 68,
      economy: 50,
      health: 58,
      education: 56,
      environment: 64,
      infrastructure: 52,
      culture: 68,
    },
    metrics: {
      gppPerCapita: 108000,
      avgMonthlyIncome: 18600,
      pm25Annual: 24.8,
      hospitalBeds: 22,
      crimeRate: 134,
      greenCoverage: 30,
    },
    highlights: [
      "Ban Chiang archaeological site is a UNESCO World Heritage location for prehistoric settlement",
      "Strong Lao-Thai cultural exchange as a border gateway to Vientiane",
      "Nong Prajak Park and Red Lotus Sea draw domestic tourists and improve livability",
    ],
    tagline: "Friendly Isan hub with archaeological significance and cross-border vitality, still building urban services.",
    status: "provisional",
  },
  {
    id: "surat-thani",
    nameEn: "Surat Thani",
    nameTh: "สุราษฎร์ธานี",
    region: "South",
    population: 1067,
    provinceType: "emerging",
    scores: {
      overall: 60,
      safety: 66,
      economy: 58,
      health: 56,
      education: 54,
      environment: 70,
      infrastructure: 54,
      culture: 62,
    },
    metrics: {
      gppPerCapita: 198000,
      avgMonthlyIncome: 21200,
      pm25Annual: 13.6,
      hospitalBeds: 20,
      crimeRate: 152,
      greenCoverage: 54,
    },
    highlights: [
      "Gateway to Koh Samui, Koh Phangan, and Koh Tao island tourism clusters",
      "Major rubber and palm oil production center supporting the agricultural economy",
      "Khao Sok National Park offers some of the oldest evergreen rainforest in the world",
    ],
    tagline: "Southern gateway to Gulf islands with strong natural assets but limited urban healthcare and education.",
    status: "provisional",
  },
  {
    id: "rayong",
    nameEn: "Rayong",
    nameTh: "ระยอง",
    region: "East",
    population: 742,
    provinceType: "secondary",
    scores: {
      overall: 66,
      safety: 62,
      economy: 78,
      health: 64,
      education: 60,
      environment: 48,
      infrastructure: 72,
      culture: 54,
    },
    metrics: {
      gppPerCapita: 1420000,
      avgMonthlyIncome: 28400,
      pm25Annual: 22.4,
      hospitalBeds: 22,
      crimeRate: 178,
      greenCoverage: 26,
    },
    highlights: [
      "Highest GPP per capita in Thailand thanks to Map Ta Phut petrochemical complex",
      "Part of the Eastern Economic Corridor with heavy investment in automation and robotics",
      "Koh Samet and coastal areas provide natural recreation despite industrial surroundings",
    ],
    tagline: "Petrochemical wealth leader with major industrial output offset by environmental and health concerns.",
    status: "ranked",
  },
  {
    id: "nonthaburi",
    nameEn: "Nonthaburi",
    nameTh: "นนทบุรี",
    region: "Central",
    population: 1278,
    provinceType: "secondary",
    scores: {
      overall: 71,
      safety: 66,
      economy: 74,
      health: 78,
      education: 76,
      environment: 50,
      infrastructure: 80,
      culture: 58,
    },
    metrics: {
      gppPerCapita: 248000,
      avgMonthlyIncome: 34800,
      pm25Annual: 30.8,
      hospitalBeds: 36,
      crimeRate: 195,
      greenCoverage: 14,
    },
    highlights: [
      "MRT Purple Line integration gives strong connectivity to central Bangkok",
      "Major government ministry offices relocated here, boosting service-sector employment",
      "Durian orchards along the Chao Phraya River maintain an agricultural identity amid urbanization",
    ],
    tagline: "Bangkok's most connected satellite with strong transit access, sharing the capital's pollution burden.",
    status: "ranked",
  },
  {
    id: "pathum-thani",
    nameEn: "Pathum Thani",
    nameTh: "ปทุมธานี",
    region: "Central",
    population: 1170,
    provinceType: "secondary",
    scores: {
      overall: 68,
      safety: 64,
      economy: 72,
      health: 70,
      education: 78,
      environment: 48,
      infrastructure: 74,
      culture: 52,
    },
    metrics: {
      gppPerCapita: 412000,
      avgMonthlyIncome: 32200,
      pm25Annual: 31.2,
      hospitalBeds: 28,
      crimeRate: 188,
      greenCoverage: 16,
    },
    highlights: [
      "Thailand Science Park and Thammasat University Rangsit campus form a research corridor",
      "Major logistics and distribution hub with proximity to Don Mueang Airport",
      "Rapidly urbanizing with large-scale housing estates serving Bangkok commuters",
    ],
    tagline: "Knowledge and logistics corridor north of Bangkok with strong education anchors but rapid sprawl.",
    status: "ranked",
  },
  {
    id: "samut-prakan",
    nameEn: "Samut Prakan",
    nameTh: "สมุทรปราการ",
    region: "Central",
    population: 1338,
    provinceType: "secondary",
    scores: {
      overall: 67,
      safety: 60,
      economy: 76,
      health: 68,
      education: 66,
      environment: 44,
      infrastructure: 78,
      culture: 50,
    },
    metrics: {
      gppPerCapita: 382000,
      avgMonthlyIncome: 30600,
      pm25Annual: 33.6,
      hospitalBeds: 26,
      crimeRate: 222,
      greenCoverage: 12,
    },
    highlights: [
      "Home to Suvarnabhumi International Airport, Thailand's primary international gateway",
      "Dense manufacturing base including automotive assembly and electronics production",
      "Bang Pu coastal wetlands serve as a migratory bird sanctuary despite industrial surroundings",
    ],
    tagline: "Industrial and aviation hub at Bangkok's southern edge, economically strong but environmentally strained.",
    status: "ranked",
  },
  {
    id: "ubon-ratchathani",
    nameEn: "Ubon Ratchathani",
    nameTh: "อุบลราชธานี",
    region: "Northeast (Isan)",
    population: 1878,
    provinceType: "emerging",
    scores: {
      overall: 56,
      safety: 72,
      economy: 44,
      health: 54,
      education: 54,
      environment: 66,
      infrastructure: 46,
      culture: 74,
    },
    metrics: {
      gppPerCapita: 82000,
      avgMonthlyIncome: 16800,
      pm25Annual: 27.2,
      hospitalBeds: 20,
      crimeRate: 112,
      greenCoverage: 36,
    },
    highlights: [
      "Annual Candle Festival is among Thailand's most spectacular Buddhist celebrations",
      "Pha Taem National Park features prehistoric cliff paintings dating back 3,000 years",
      "Mekong River border position supports community trade with Laos",
    ],
    tagline: "Deep Isan cultural heartland with strong community identity but limited economic and health infrastructure.",
    status: "provisional",
  },
  {
    id: "nakhon-si-thammarat",
    nameEn: "Nakhon Si Thammarat",
    nameTh: "นครศรีธรรมราช",
    region: "South",
    population: 1562,
    provinceType: "emerging",
    scores: {
      overall: 58,
      safety: 64,
      economy: 48,
      health: 56,
      education: 58,
      environment: 68,
      infrastructure: 48,
      culture: 72,
    },
    metrics: {
      gppPerCapita: 112000,
      avgMonthlyIncome: 19200,
      pm25Annual: 15.4,
      hospitalBeds: 22,
      crimeRate: 164,
      greenCoverage: 48,
    },
    highlights: [
      "Wat Phra Mahathat is one of Thailand's most important royal temples with a 1,000-year history",
      "Traditional Nang Talung shadow puppetry recognized as intangible cultural heritage",
      "Rich tropical fruit production including mangosteen and rambutan",
    ],
    tagline: "Ancient southern cultural center with clean air and heritage depth, awaiting modern infrastructure investment.",
    status: "provisional",
  },
  {
    id: "lampang",
    nameEn: "Lampang",
    nameTh: "ลำปาง",
    region: "North",
    population: 744,
    provinceType: "emerging",
    scores: {
      overall: 59,
      safety: 74,
      economy: 46,
      health: 56,
      education: 58,
      environment: 54,
      infrastructure: 50,
      culture: 76,
    },
    metrics: {
      gppPerCapita: 124000,
      avgMonthlyIncome: 19800,
      pm25Annual: 44.8,
      hospitalBeds: 24,
      crimeRate: 98,
      greenCoverage: 62,
    },
    highlights: [
      "Horse-drawn carriage tradition makes it unique among Thai cities",
      "Thai Elephant Conservation Centre is a nationally significant wildlife facility",
      "Well-preserved Lanna-era wooden temples and a quieter pace than Chiang Mai",
    ],
    tagline: "Quiet northern charm with low crime and strong heritage, challenged by seasonal haze and limited growth.",
    status: "provisional",
  },
  {
    id: "phitsanulok",
    nameEn: "Phitsanulok",
    nameTh: "พิษณุโลก",
    region: "North",
    population: 866,
    provinceType: "emerging",
    scores: {
      overall: 60,
      safety: 70,
      economy: 52,
      health: 62,
      education: 64,
      environment: 58,
      infrastructure: 54,
      culture: 66,
    },
    metrics: {
      gppPerCapita: 118000,
      avgMonthlyIncome: 20200,
      pm25Annual: 38.4,
      hospitalBeds: 28,
      crimeRate: 128,
      greenCoverage: 52,
    },
    highlights: [
      "Naresuan University and its teaching hospital anchor regional healthcare and education",
      "Phra Buddha Chinnarat at Wat Phra Si Rattana Mahathat is one of Thailand's most revered Buddha images",
      "Strategic north-south transport crossroads connecting Bangkok to the upper north",
    ],
    tagline: "Lower-north education and logistics crossroads with solid healthcare but moderate seasonal air quality.",
    status: "provisional",
  },
  {
    id: "krabi",
    nameEn: "Krabi",
    nameTh: "กระบี่",
    region: "South",
    population: 476,
    provinceType: "emerging",
    scores: {
      overall: 61,
      safety: 68,
      economy: 60,
      health: 52,
      education: 50,
      environment: 78,
      infrastructure: 50,
      culture: 62,
    },
    metrics: {
      gppPerCapita: 218000,
      avgMonthlyIncome: 22800,
      pm25Annual: 12.2,
      hospitalBeds: 18,
      crimeRate: 138,
      greenCoverage: 58,
    },
    highlights: [
      "Railay Beach and Phi Phi Islands are globally recognized natural attractions",
      "Best air quality among the provinces tracked, benefiting from Andaman Sea breezes",
      "Growing eco-tourism and rock-climbing community attracting longer-stay visitors",
    ],
    tagline: "Andaman coast gem with outstanding environment and tourism potential, short on healthcare and education depth.",
    status: "provisional",
  },
  {
    id: "prachuap-khiri-khan",
    nameEn: "Prachuap Khiri Khan / Hua Hin",
    nameTh: "ประจวบคีรีขันธ์/หัวหิน",
    region: "Central",
    population: 538,
    provinceType: "emerging",
    scores: {
      overall: 62,
      safety: 72,
      economy: 56,
      health: 60,
      education: 52,
      environment: 72,
      infrastructure: 56,
      culture: 64,
    },
    metrics: {
      gppPerCapita: 186000,
      avgMonthlyIncome: 21400,
      pm25Annual: 16.8,
      hospitalBeds: 22,
      crimeRate: 124,
      greenCoverage: 44,
    },
    highlights: [
      "Hua Hin is Thailand's original royal beach resort town with a century of leisure heritage",
      "Strong retiree and long-stay expat community supporting local service economies",
      "Dual-coast geography with Gulf beaches and Burmese border mountain forests",
    ],
    tagline: "Royal resort corridor with clean air and coastal calm, limited by small-town health and education capacity.",
    status: "provisional",
  },
];

// ---------------------------------------------------------------------------
// Derived exports
// ---------------------------------------------------------------------------

export const thailandRegions: ThailandRegion[] = [
  ...new Set(thailandProvinces.map((province) => province.region)),
] as ThailandRegion[];
