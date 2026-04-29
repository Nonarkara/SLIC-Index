import cityUniverseCsv from "./data/slic_city_universe.csv?raw";
import { rankingPublication } from "./rankingPublication";
import type {
  CityAccessProfile,
  CityLifeMetrics,
  FullRankedCity,
  RankedCity,
} from "./types";

interface CityUniverseRow {
  city_id: string;
  cohort: string;
  manifest_status: "locked" | "provisional";
  city_type: "primary" | "secondary";
  country: string;
  inclusion_rationale: string;
}

interface RegionProfile {
  pressure: number;
  viability: number;
  capability: number;
  community: number;
  creative: number;
  pppIncomePerHead: number;
  graduateHousingShare: number;
  experienceDiversity: number;
  healthcare: CityAccessProfile;
  education: CityAccessProfile;
  tags: string[];
}

interface CityScreenProfile {
  safety: number;
  affordability: number;
  equality: number;
  civicFreedom: number;
  ecology: number;
  crowding: number;
  hygiene?: number;
  climate?: number;
  roadSafety?: number;
  foodCulture?: number;
  boringIndex?: number;
  flatExperience?: number;
  taxReturn?: number;
  healthcareCost?: number;
  religiousViolence?: number;
  housingPriceIndex?: number;
  /** 0-100: low = stagnant/retirement, high = growing/dynamic */
  growthMomentum?: number;
  /** 0-100: low = intolerant (anti-LGBTQ, ethnic discrimination), high = open */
  toleranceOpenness?: number;
  /** 0-100: low = everything is green, high = concrete desert / no parks */
  greenSpaceDeficit?: number;
}

interface CityAccent {
  accentHex: string;
  accentSoftHex: string;
  accentLabel: string;
}

type CityOverride = Omit<FullRankedCity, "globalRank" | "coreBoardEligible" | "scores" | "tierLabel" | "tierSlot"> & {
  scores: Pick<FullRankedCity["scores"], "pressure" | "viability" | "capability" | "community"> &
    Partial<Pick<FullRankedCity["scores"], "creative">>;
};

const regionProfiles: Record<string, RegionProfile> = {
  "Southeast Asia": {
    pressure: 77,
    viability: 72,
    capability: 75,
    community: 81,
    creative: 78,
    pppIncomePerHead: 22000,
    graduateHousingShare: 25,
    experienceDiversity: 86,
    healthcare: {
      access: "Broad mixed access",
      affordability: "Low to moderate cost",
      summary: "Public and private care both matter, and quality varies city by city.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low to moderate cost",
      summary: "Good options exist when public quality and private affordability stay aligned.",
    },
    tags: ["variety", "hospitality", "cost range"],
  },
  "East Asia": {
    pressure: 72,
    viability: 79,
    capability: 77,
    community: 73,
    creative: 74,
    pppIncomePerHead: 30000,
    graduateHousingShare: 29,
    experienceDiversity: 74,
    healthcare: {
      access: "Universal or near-universal",
      affordability: "Low cost",
      summary: "Strong access baseline with high operational competence in leading systems.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Public systems are usually strong and tertiary pathways are well-established.",
    },
    tags: ["systems", "transit", "discipline"],
  },
  "South Asia": {
    pressure: 66,
    viability: 57,
    capability: 62,
    community: 63,
    creative: 62,
    pppIncomePerHead: 14000,
    graduateHousingShare: 27,
    experienceDiversity: 71,
    healthcare: {
      access: "Mixed access",
      affordability: "Moderate out-of-pocket",
      summary: "Access can be broad, but quality and financial burden are uneven.",
    },
    education: {
      access: "Mixed public-private",
      affordability: "Low to moderate cost",
      summary: "Good institutions exist, but consistency and access remain uneven.",
    },
    tags: ["ambition", "pressure", "uneven"],
  },
  "Western, Northern, and Southern Europe": {
    pressure: 64,
    viability: 80,
    capability: 74,
    community: 74,
    creative: 66,
    pppIncomePerHead: 32000,
    graduateHousingShare: 38,
    experienceDiversity: 78,
    healthcare: {
      access: "Universal public access",
      affordability: "Free to low cost",
      summary: "Healthcare is broadly accessible, with funding systems that reduce direct cost shocks.",
    },
    education: {
      access: "Universal public access",
      affordability: "Free to low cost",
      summary: "Public education is strong, but housing pressure can still dilute opportunity.",
    },
    tags: ["order", "public systems", "cost pressure"],
  },
  "Southern/Eastern Europe and Eurasia": {
    pressure: 73,
    viability: 73,
    capability: 73,
    community: 76,
    creative: 74,
    pppIncomePerHead: 23000,
    graduateHousingShare: 27,
    experienceDiversity: 76,
    healthcare: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Public systems are often accessible, though quality differs sharply by city.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low cost",
      summary: "Education is usually affordable, especially outside the most prestigious capitals.",
    },
    tags: ["heritage", "value", "human scale"],
  },
  "North America": {
    pressure: 71,
    viability: 70,
    capability: 71,
    community: 64,
    creative: 73,
    pppIncomePerHead: 31000,
    graduateHousingShare: 41,
    experienceDiversity: 77,
    healthcare: {
      access: "Mixed access",
      affordability: "Moderate to high cost",
      summary: "Strong providers exist, but direct cost remains a major differentiator.",
    },
    education: {
      access: "Broad access",
      affordability: "Moderate to high cost",
      summary: "Educational quality can be strong while affordability remains a real constraint.",
    },
    tags: ["scale", "uneven value", "opportunity"],
  },
  "Latin America": {
    pressure: 71,
    viability: 65,
    capability: 68,
    community: 78,
    creative: 67,
    pppIncomePerHead: 20000,
    graduateHousingShare: 28,
    experienceDiversity: 85,
    healthcare: {
      access: "Mixed public-private",
      affordability: "Low to moderate cost",
      summary: "Everyday access is often decent, but consistency depends heavily on city and income level.",
    },
    education: {
      access: "Broad public-private mix",
      affordability: "Low to moderate cost",
      summary: "Affordable options exist, though quality dispersion remains significant.",
    },
    tags: ["street life", "culture", "contrast"],
  },
  "Middle East": {
    pressure: 74,
    viability: 78,
    capability: 76,
    community: 60,
    creative: 72,
    pppIncomePerHead: 29000,
    graduateHousingShare: 31,
    experienceDiversity: 62,
    healthcare: {
      access: "Strong urban access",
      affordability: "Low to moderate cost",
      summary: "Service quality can be high in major cities, though social access differs by system.",
    },
    education: {
      access: "Mixed access",
      affordability: "Moderate cost",
      summary: "Good institutions exist, but public-private splits shape real affordability.",
    },
    tags: ["connectivity", "state capacity", "heat"],
  },
  Africa: {
    pressure: 67,
    viability: 61,
    capability: 64,
    community: 68,
    creative: 63,
    pppIncomePerHead: 16000,
    graduateHousingShare: 26,
    experienceDiversity: 73,
    healthcare: {
      access: "Mixed access",
      affordability: "Low to moderate cost",
      summary: "Quality can concentrate in stronger cities while broad access still varies.",
    },
    education: {
      access: "Mixed access",
      affordability: "Low to moderate cost",
      summary: "Affordability is often better than prestige cities, but quality is uneven.",
    },
    tags: ["trajectory", "regional hub", "contrast"],
  },
  Oceania: {
    pressure: 62,
    viability: 76,
    capability: 72,
    community: 70,
    creative: 62,
    pppIncomePerHead: 30000,
    graduateHousingShare: 40,
    experienceDiversity: 72,
    healthcare: {
      access: "Universal public baseline",
      affordability: "Free to low cost",
      summary: "Healthcare access is generally strong, but cost of living still weighs on daily life.",
    },
    education: {
      access: "Broad public access",
      affordability: "Low to moderate cost",
      summary: "Good public systems exist, though housing and distance affect the overall equation.",
    },
    tags: ["pleasant", "distance", "cost"],
  },
};

const regionScreenProfiles: Record<string, CityScreenProfile> = {
  "Southeast Asia": { safety: 74, affordability: 79, equality: 65, civicFreedom: 72, ecology: 61, crowding: 64 },
  "East Asia": { safety: 84, affordability: 72, equality: 74, civicFreedom: 76, ecology: 67, crowding: 60 },
  "South Asia": { safety: 55, affordability: 74, equality: 55, civicFreedom: 63, ecology: 45, crowding: 77 },
  "Western, Northern, and Southern Europe": { safety: 86, affordability: 53, equality: 79, civicFreedom: 85, ecology: 79, crowding: 55 },
  "Southern/Eastern Europe and Eurasia": { safety: 72, affordability: 74, equality: 64, civicFreedom: 66, ecology: 60, crowding: 57 },
  "North America": { safety: 67, affordability: 50, equality: 56, civicFreedom: 78, ecology: 57, crowding: 61 },
  "Latin America": { safety: 61, affordability: 71, equality: 51, civicFreedom: 70, ecology: 55, crowding: 63 },
  "Middle East": { safety: 79, affordability: 59, equality: 42, civicFreedom: 48, ecology: 38, crowding: 61 },
  Africa: { safety: 58, affordability: 73, equality: 50, civicFreedom: 63, ecology: 52, crowding: 58 },
  Oceania: { safety: 82, affordability: 48, equality: 70, civicFreedom: 84, ecology: 83, crowding: 49 },
};

const baseCityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {

  pyongyang: { safety: 50, affordability: 30, equality: 20, civicFreedom: 5, ecology: 30, crowding: 50, boringIndex: 90, religiousViolence: 5, taxReturn: 30, flatExperience: 90 },
  kabul: { safety: 10, affordability: 50, equality: 10, civicFreedom: 10, ecology: 30, crowding: 80, religiousViolence: 95, hygiene: 30 },
  caracas: { safety: 10, affordability: 30, equality: 30, civicFreedom: 30, ecology: 40, crowding: 70, roadSafety: 30 },
  "port-au-prince": { safety: 5, affordability: 20, equality: 20, civicFreedom: 30, ecology: 20, crowding: 85, hygiene: 20, roadSafety: 20, religiousViolence: 20 },
  damascus: { safety: 10, affordability: 30, equality: 25, civicFreedom: 15, ecology: 30, crowding: 70, religiousViolence: 70 },
  lagos: { safety: 30, affordability: 60, equality: 30, civicFreedom: 50, ecology: 30, crowding: 95, hygiene: 35, roadSafety: 30 },
  kinshasa: { safety: 25, affordability: 50, equality: 30, civicFreedom: 40, ecology: 30, crowding: 80, hygiene: 30 },
  yakutsk: { safety: 70, affordability: 60, equality: 60, civicFreedom: 30, ecology: 40, crowding: 30, climate: 5, flatExperience: 80, boringIndex: 85 },
  norilsk: { safety: 65, affordability: 55, equality: 60, civicFreedom: 30, ecology: 5, crowding: 20, climate: 5, hygiene: 20, flatExperience: 85, boringIndex: 90 },
  london: { safety: 80, affordability: 15, equality: 60, civicFreedom: 85, ecology: 65, crowding: 85, housingPriceIndex: 95, taxReturn: 60, flatExperience: 40, boringIndex: 40 },
  "new-york": { safety: 70, affordability: 10, equality: 50, civicFreedom: 85, ecology: 55, crowding: 90, housingPriceIndex: 98, healthcareCost: 95, taxReturn: 50 },
  "san-francisco": { safety: 60, affordability: 5, equality: 55, civicFreedom: 88, ecology: 70, crowding: 60, housingPriceIndex: 99, hygiene: 40, roadSafety: 65 },
  geneva: { safety: 95, affordability: 10, equality: 75, civicFreedom: 90, ecology: 85, crowding: 30, boringIndex: 90, flatExperience: 85, housingPriceIndex: 95 },
  monaco: { safety: 98, affordability: 5, equality: 70, civicFreedom: 85, ecology: 80, crowding: 40, boringIndex: 95, flatExperience: 90, housingPriceIndex: 99 },
  vancouver: { safety: 85, affordability: 15, equality: 70, civicFreedom: 90, ecology: 90, crowding: 45, boringIndex: 80, flatExperience: 85, housingPriceIndex: 96 },

  // ── Top-tier cities: high growth, tolerant, affordable, liveable ──
  taipei: { safety: 93, affordability: 84, equality: 82, civicFreedom: 84, ecology: 79, crowding: 56, growthMomentum: 78, toleranceOpenness: 82, greenSpaceDeficit: 35 },
  busan: { safety: 89, affordability: 80, equality: 74, civicFreedom: 77, ecology: 74, crowding: 46, growthMomentum: 72, toleranceOpenness: 65, greenSpaceDeficit: 30 },
  fukuoka: { safety: 91, affordability: 82, equality: 76, civicFreedom: 85, ecology: 78, crowding: 44, growthMomentum: 70, toleranceOpenness: 68, greenSpaceDeficit: 28 },
  bangkok: { safety: 77, affordability: 90, equality: 64, civicFreedom: 79, ecology: 55, crowding: 67, growthMomentum: 82, toleranceOpenness: 80, greenSpaceDeficit: 38 },
  jakarta: { safety: 60, affordability: 74, equality: 52, civicFreedom: 68, ecology: 37, crowding: 82 },
  makati: { safety: 76, affordability: 66, equality: 55, civicFreedom: 68, ecology: 51, crowding: 68 },
  "jeju-city": { safety: 91, affordability: 79, equality: 76, civicFreedom: 84, ecology: 90, crowding: 39 },
  penang: { safety: 81, affordability: 85, equality: 68, civicFreedom: 80, ecology: 65, crowding: 58 },
  kaohsiung: { safety: 87, affordability: 85, equality: 80, civicFreedom: 84, ecology: 71, crowding: 49, growthMomentum: 76, toleranceOpenness: 80, greenSpaceDeficit: 22 },
  shanghai: { safety: 87, affordability: 58, equality: 60, civicFreedom: 48, ecology: 54, crowding: 72 },
  shenzhen: { safety: 85, affordability: 62, equality: 61, civicFreedom: 49, ecology: 61, crowding: 69 },
  tianjin: { safety: 82, affordability: 68, equality: 60, civicFreedom: 48, ecology: 56, crowding: 63 },
  yokohama: { safety: 90, affordability: 68, equality: 75, civicFreedom: 84, ecology: 73, crowding: 54 },
  singapore: { safety: 95, affordability: 42, equality: 71, civicFreedom: 60, ecology: 74, crowding: 67, growthMomentum: 68, toleranceOpenness: 32 },
  phuket: { safety: 75, affordability: 60, equality: 62, civicFreedom: 78, ecology: 62, crowding: 79 },
  "chiang-mai": { safety: 79, affordability: 87, equality: 68, civicFreedom: 81, ecology: 52, crowding: 52, growthMomentum: 72, toleranceOpenness: 76 },
  "kuala-lumpur": { safety: 74, affordability: 77, equality: 58, civicFreedom: 68, ecology: 58, crowding: 64, toleranceOpenness: 38 },
  "george-town": { safety: 81, affordability: 84, equality: 68, civicFreedom: 80, ecology: 64, crowding: 57 },
  kuching: { safety: 80, affordability: 86, equality: 69, civicFreedom: 81, ecology: 73, crowding: 42 },
  "hat-yai": { safety: 72, affordability: 84, equality: 61, civicFreedom: 73, ecology: 63, crowding: 48 },
  sapporo: { safety: 89, affordability: 78, equality: 77, civicFreedom: 85, ecology: 84, crowding: 41, growthMomentum: 22, boringIndex: 55, toleranceOpenness: 52 },
  nagasaki: { safety: 88, affordability: 80, equality: 77, civicFreedom: 85, ecology: 80, crowding: 39, growthMomentum: 18, boringIndex: 60, toleranceOpenness: 50 },
  kobe: { safety: 88, affordability: 72, equality: 75, civicFreedom: 84, ecology: 74, crowding: 51, growthMomentum: 28, toleranceOpenness: 52 },
  tokyo: { safety: 92, affordability: 35, equality: 76, civicFreedom: 85, ecology: 67, crowding: 86, growthMomentum: 45 },
  seoul: { safety: 87, affordability: 55, equality: 71, civicFreedom: 76, ecology: 59, crowding: 74, growthMomentum: 60 },
  suwon: { safety: 88, affordability: 76, equality: 73, civicFreedom: 77, ecology: 68, crowding: 52, growthMomentum: 74, toleranceOpenness: 64 },
  hiroshima: { safety: 89, affordability: 76, equality: 77, civicFreedom: 84, ecology: 79, crowding: 42, growthMomentum: 20, toleranceOpenness: 52 },
  vienna: { safety: 92, affordability: 46, equality: 82, civicFreedom: 86, ecology: 84, crowding: 49 },
  zurich: { safety: 95, affordability: 10, equality: 78, civicFreedom: 87, ecology: 88, crowding: 46, housingPriceIndex: 98, boringIndex: 92, flatExperience: 88, growthMomentum: 20 },
  paris: { safety: 80, affordability: 27, equality: 70, civicFreedom: 82, ecology: 63, crowding: 78 },
  graz: { safety: 90, affordability: 73, equality: 83, civicFreedom: 87, ecology: 82, crowding: 38 },
  porto: { safety: 83, affordability: 77, equality: 75, civicFreedom: 84, ecology: 74, crowding: 52 },
  braga: { safety: 84, affordability: 79, equality: 76, civicFreedom: 84, ecology: 78, crowding: 37 },
  tallinn: { safety: 85, affordability: 74, equality: 67, civicFreedom: 82, ecology: 77, crowding: 34 },
  helsinki: { safety: 89, affordability: 43, equality: 82, civicFreedom: 87, ecology: 85, crowding: 36 },
  moscow: { safety: 74, affordability: 76, equality: 60, civicFreedom: 35, ecology: 58, crowding: 63 },
  budapest: { safety: 80, affordability: 79, equality: 65, civicFreedom: 70, ecology: 66, crowding: 55 },
  krakow: { safety: 84, affordability: 78, equality: 67, civicFreedom: 77, ecology: 63, crowding: 53, growthMomentum: 76, toleranceOpenness: 68 },
  bucharest: { safety: 73, affordability: 76, equality: 58, civicFreedom: 68, ecology: 57, crowding: 56 },
  belgrade: { safety: 72, affordability: 78, equality: 60, civicFreedom: 64, ecology: 56, crowding: 58 },
  "nizhny-novgorod": { safety: 70, affordability: 78, equality: 59, civicFreedom: 34, ecology: 59, crowding: 47 },
  katowice: { safety: 81, affordability: 80, equality: 65, civicFreedom: 74, ecology: 55, crowding: 43 },
  gdansk: { safety: 84, affordability: 75, equality: 66, civicFreedom: 78, ecology: 71, crowding: 43, growthMomentum: 74, toleranceOpenness: 66 },
  torun: { safety: 83, affordability: 79, equality: 67, civicFreedom: 78, ecology: 72, crowding: 34 },
  bratislava: { safety: 85, affordability: 67, equality: 71, civicFreedom: 81, ecology: 69, crowding: 43 },
  chicago: { safety: 63, affordability: 49, equality: 50, civicFreedom: 78, ecology: 54, crowding: 63 },
  pittsburgh: { safety: 78, affordability: 72, equality: 62, civicFreedom: 82, ecology: 66, crowding: 38, growthMomentum: 76, toleranceOpenness: 78 },
  toronto: { safety: 78, affordability: 36, equality: 67, civicFreedom: 82, ecology: 66, crowding: 64 },
  montreal: { safety: 77, affordability: 54, equality: 68, civicFreedom: 82, ecology: 69, crowding: 52 },
  "mexico-city": { safety: 59, affordability: 68, equality: 47, civicFreedom: 71, ecology: 45, crowding: 81 },
  guadalajara: { safety: 66, affordability: 73, equality: 52, civicFreedom: 73, ecology: 54, crowding: 61 },
  merida: { safety: 79, affordability: 72, equality: 58, civicFreedom: 80, ecology: 66, crowding: 41 },
  "san-jose": { safety: 79, affordability: 62, equality: 63, civicFreedom: 82, ecology: 76, crowding: 43 },
  "panama-city": { safety: 71, affordability: 58, equality: 53, civicFreedom: 77, ecology: 61, crowding: 62 },
  "san-juan": { safety: 65, affordability: 52, equality: 59, civicFreedom: 79, ecology: 69, crowding: 58 },
  "sao-paulo": { safety: 57, affordability: 63, equality: 42, civicFreedom: 72, ecology: 48, crowding: 77 },
  "buenos-aires": { safety: 69, affordability: 67, equality: 56, civicFreedom: 75, ecology: 62, crowding: 60 },
  santiago: { safety: 72, affordability: 56, equality: 58, civicFreedom: 77, ecology: 58, crowding: 68 },
  bogota: { safety: 58, affordability: 67, equality: 45, civicFreedom: 72, ecology: 51, crowding: 70 },
  lima: { safety: 57, affordability: 63, equality: 46, civicFreedom: 69, ecology: 44, crowding: 72 },
  curitiba: { safety: 67, affordability: 72, equality: 49, civicFreedom: 73, ecology: 63, crowding: 48 },
  medellin: { safety: 66, affordability: 70, equality: 50, civicFreedom: 74, ecology: 56, crowding: 58 },
  montevideo: { safety: 74, affordability: 60, equality: 66, civicFreedom: 82, ecology: 72, crowding: 39 },
  cordoba: { safety: 68, affordability: 70, equality: 54, civicFreedom: 76, ecology: 60, crowding: 44 },
  valparaiso: { safety: 64, affordability: 65, equality: 56, civicFreedom: 75, ecology: 59, crowding: 55 },
  // ── Gulf: desert money, low tolerance, artificial growth ──
  dubai: { safety: 88, affordability: 35, equality: 30, civicFreedom: 35, ecology: 33, crowding: 64, toleranceOpenness: 25, greenSpaceDeficit: 85 },
  "abu-dhabi": { safety: 89, affordability: 39, equality: 33, civicFreedom: 39, ecology: 35, crowding: 53, toleranceOpenness: 22, greenSpaceDeficit: 82 },
  doha: { safety: 88, affordability: 30, equality: 28, civicFreedom: 35, ecology: 31, crowding: 49, toleranceOpenness: 20, greenSpaceDeficit: 80 },
  riyadh: { safety: 80, affordability: 55, equality: 38, civicFreedom: 38, ecology: 28, crowding: 58, toleranceOpenness: 15, greenSpaceDeficit: 88 },
  "tel-aviv": { safety: 80, affordability: 29, equality: 56, civicFreedom: 63, ecology: 58, crowding: 66 },
  muscat: { safety: 84, affordability: 62, equality: 50, civicFreedom: 56, ecology: 37, crowding: 39 },
  manama: { safety: 82, affordability: 58, equality: 49, civicFreedom: 55, ecology: 34, crowding: 45, toleranceOpenness: 28, greenSpaceDeficit: 78 },
  jeddah: { safety: 78, affordability: 60, equality: 45, civicFreedom: 45, ecology: 29, crowding: 54, toleranceOpenness: 15, greenSpaceDeficit: 90 },
  "kuwait-city": { safety: 82, affordability: 43, equality: 34, civicFreedom: 42, ecology: 27, crowding: 50, toleranceOpenness: 18, greenSpaceDeficit: 85 },
  amman: { safety: 70, affordability: 61, equality: 50, civicFreedom: 61, ecology: 42, crowding: 55 },
  "cape-town": { safety: 49, affordability: 57, equality: 31, civicFreedom: 76, ecology: 61, crowding: 63 },
  johannesburg: { safety: 41, affordability: 59, equality: 29, civicFreedom: 74, ecology: 52, crowding: 59 },
  nairobi: { safety: 58, affordability: 71, equality: 45, civicFreedom: 66, ecology: 46, crowding: 67 },
  kigali: { safety: 85, affordability: 69, equality: 54, civicFreedom: 52, ecology: 71, crowding: 36 },
  casablanca: { safety: 60, affordability: 68, equality: 48, civicFreedom: 59, ecology: 47, crowding: 59 },
  "port-louis": { safety: 82, affordability: 67, equality: 61, civicFreedom: 79, ecology: 73, crowding: 34 },
  gaborone: { safety: 72, affordability: 72, equality: 56, civicFreedom: 73, ecology: 58, crowding: 33 },
  windhoek: { safety: 69, affordability: 68, equality: 47, civicFreedom: 73, ecology: 63, crowding: 31 },
  accra: { safety: 62, affordability: 72, equality: 48, civicFreedom: 68, ecology: 48, crowding: 61 },
  dakar: { safety: 61, affordability: 70, equality: 49, civicFreedom: 67, ecology: 49, crowding: 57 },
  // ── Oceania: pleasant but low growth, retirement economy, unaffordable ──
  auckland: { safety: 87, affordability: 43, equality: 72, civicFreedom: 87, ecology: 83, crowding: 51, growthMomentum: 35, boringIndex: 65 },
  sydney: { safety: 85, affordability: 26, equality: 68, civicFreedom: 86, ecology: 74, crowding: 63, growthMomentum: 42, boringIndex: 45, housingPriceIndex: 94 },
  melbourne: { safety: 84, affordability: 30, equality: 69, civicFreedom: 86, ecology: 72, crowding: 61, growthMomentum: 40, boringIndex: 48 },
  brisbane: { safety: 84, affordability: 48, equality: 68, civicFreedom: 86, ecology: 79, crowding: 42, growthMomentum: 38, boringIndex: 72 },
  wellington: { safety: 88, affordability: 46, equality: 76, civicFreedom: 88, ecology: 84, crowding: 37, growthMomentum: 30, boringIndex: 74 },
  perth: { safety: 86, affordability: 44, equality: 67, civicFreedom: 86, ecology: 79, crowding: 35, growthMomentum: 34, boringIndex: 78 },
  adelaide: { safety: 87, affordability: 52, equality: 69, civicFreedom: 86, ecology: 78, crowding: 34, growthMomentum: 32, boringIndex: 80 },
  hobart: { safety: 89, affordability: 47, equality: 71, civicFreedom: 87, ecology: 86, crowding: 27, growthMomentum: 25, boringIndex: 88 },
  christchurch: { safety: 88, affordability: 50, equality: 71, civicFreedom: 87, ecology: 82, crowding: 31, growthMomentum: 28, boringIndex: 76 },
  suva: { safety: 67, affordability: 64, equality: 57, civicFreedom: 74, ecology: 69, crowding: 42 },
  bengaluru: { safety: 55, affordability: 64, equality: 49, civicFreedom: 72, ecology: 41, crowding: 83 },
  hyderabad: { safety: 58, affordability: 67, equality: 50, civicFreedom: 72, ecology: 44, crowding: 77 },
  colombo: { safety: 74, affordability: 74, equality: 62, civicFreedom: 69, ecology: 57, crowding: 59 },
  dhaka: { safety: 44, affordability: 74, equality: 48, civicFreedom: 58, ecology: 24, crowding: 90 },
  karachi: { safety: 38, affordability: 70, equality: 47, civicFreedom: 50, ecology: 29, crowding: 86 },
  lahore: { safety: 63, affordability: 80, equality: 57, civicFreedom: 59, ecology: 33, crowding: 73 },
  chattogram: { safety: 52, affordability: 72, equality: 49, civicFreedom: 57, ecology: 38, crowding: 74 },
  kathmandu: { safety: 61, affordability: 67, equality: 55, civicFreedom: 68, ecology: 34, crowding: 61 },
  thimphu: { safety: 83, affordability: 79, equality: 66, civicFreedom: 73, ecology: 86, crowding: 21 },
  male: { safety: 76, affordability: 39, equality: 56, civicFreedom: 67, ecology: 45, crowding: 71 },
  davao: { safety: 72, affordability: 69, equality: 51, civicFreedom: 58, ecology: 55, crowding: 47 },
  denpasar: { safety: 71, affordability: 56, equality: 55, civicFreedom: 69, ecology: 57, crowding: 76 },

  // ── Major new cities ──
  berlin: { safety: 84, affordability: 62, equality: 78, civicFreedom: 86, ecology: 74, crowding: 52, toleranceOpenness: 90, growthMomentum: 65 },
  barcelona: { safety: 78, affordability: 48, equality: 72, civicFreedom: 83, ecology: 70, crowding: 62 },
  lisbon: { safety: 82, affordability: 55, equality: 71, civicFreedom: 83, ecology: 73, crowding: 48 },
  stockholm: { safety: 88, affordability: 32, equality: 80, civicFreedom: 88, ecology: 82, crowding: 42, boringIndex: 74, flatExperience: 72, taxReturn: 20, growthMomentum: 28 },
  istanbul: { safety: 62, affordability: 72, equality: 48, civicFreedom: 52, ecology: 48, crowding: 78 },
  prague: { safety: 86, affordability: 68, equality: 70, civicFreedom: 80, ecology: 72, crowding: 46 },
  osaka: { safety: 90, affordability: 55, equality: 74, civicFreedom: 84, ecology: 68, crowding: 72, growthMomentum: 38 },
  beijing: { safety: 83, affordability: 50, equality: 56, civicFreedom: 28, ecology: 42, crowding: 80 },
  guangzhou: { safety: 82, affordability: 64, equality: 55, civicFreedom: 30, ecology: 48, crowding: 78 },
  "hong-kong": { safety: 90, affordability: 8, equality: 55, civicFreedom: 38, ecology: 62, crowding: 92, housingPriceIndex: 99 },
  mumbai: { safety: 52, affordability: 58, equality: 42, civicFreedom: 72, ecology: 28, crowding: 94 },
  delhi: { safety: 48, affordability: 62, equality: 40, civicFreedom: 72, ecology: 18, crowding: 92 },
  "ho-chi-minh-city": { safety: 68, affordability: 88, equality: 56, civicFreedom: 42, ecology: 46, crowding: 72 },
  hanoi: { safety: 70, affordability: 86, equality: 55, civicFreedom: 40, ecology: 42, crowding: 68 },
  manila: { safety: 55, affordability: 64, equality: 44, civicFreedom: 66, ecology: 38, crowding: 88 },
  dallas: { safety: 72, affordability: 72, equality: 48, civicFreedom: 82, ecology: 48, crowding: 52, taxReturn: 88 },
  "fort-worth": { safety: 74, affordability: 76, equality: 48, civicFreedom: 82, ecology: 48, crowding: 44, taxReturn: 88 },
  miami: { safety: 68, affordability: 38, equality: 48, civicFreedom: 82, ecology: 62, crowding: 56, taxReturn: 86 },
  tampa: { safety: 72, affordability: 58, equality: 50, civicFreedom: 82, ecology: 64, crowding: 42, taxReturn: 86 },
  nashville: { safety: 70, affordability: 52, equality: 50, civicFreedom: 82, ecology: 58, crowding: 44, taxReturn: 84 },
  "washington-dc": { safety: 68, affordability: 28, equality: 52, civicFreedom: 84, ecology: 62, crowding: 68, housingPriceIndex: 90 },
  "san-diego": { safety: 78, affordability: 22, equality: 56, civicFreedom: 84, ecology: 78, crowding: 52, housingPriceIndex: 92 },
  houston: { safety: 64, affordability: 68, equality: 44, civicFreedom: 80, ecology: 42, crowding: 58, taxReturn: 88 },
  "los-angeles": { safety: 62, affordability: 12, equality: 48, civicFreedom: 82, ecology: 58, crowding: 72, housingPriceIndex: 96 },
  austin: { safety: 74, affordability: 42, equality: 52, civicFreedom: 82, ecology: 62, crowding: 48, taxReturn: 86 },
  boston: { safety: 76, affordability: 18, equality: 58, civicFreedom: 84, ecology: 68, crowding: 58, housingPriceIndex: 94 },
  denver: { safety: 76, affordability: 38, equality: 56, civicFreedom: 84, ecology: 76, crowding: 42 },
  seattle: { safety: 72, affordability: 22, equality: 58, civicFreedom: 84, ecology: 78, crowding: 52, housingPriceIndex: 92 },
  changwon: { safety: 86, affordability: 82, equality: 72, civicFreedom: 76, ecology: 72, crowding: 42 },
  "xi-an": { safety: 80, affordability: 72, equality: 54, civicFreedom: 30, ecology: 52, crowding: 62 },
  taichung: { safety: 88, affordability: 82, equality: 78, civicFreedom: 84, ecology: 72, crowding: 48 },
  "gold-coast": { safety: 86, affordability: 42, equality: 68, civicFreedom: 86, ecology: 82, crowding: 36 },
  "johor-bahru": { safety: 72, affordability: 88, equality: 58, civicFreedom: 68, ecology: 58, crowding: 52 },
  pattaya: { safety: 68, affordability: 90, equality: 58, civicFreedom: 74, ecology: 52, crowding: 62 },
  warsaw: { safety: 82, affordability: 68, equality: 65, civicFreedom: 74, ecology: 60, crowding: 52 },
  athens: { safety: 72, affordability: 62, equality: 62, civicFreedom: 80, ecology: 58, crowding: 58 },
  dublin: { safety: 80, affordability: 22, equality: 68, civicFreedom: 85, ecology: 72, crowding: 48 },
  rotterdam: { safety: 80, affordability: 52, equality: 74, civicFreedom: 86, ecology: 72, crowding: 48 },
  rome: { safety: 72, affordability: 48, equality: 64, civicFreedom: 82, ecology: 58, crowding: 62 },
  marseille: { safety: 58, affordability: 58, equality: 62, civicFreedom: 82, ecology: 62, crowding: 54 },
  frankfurt: { safety: 82, affordability: 38, equality: 76, civicFreedom: 86, ecology: 72, crowding: 52 },
  madrid: { safety: 80, affordability: 52, equality: 70, civicFreedom: 84, ecology: 64, crowding: 56 },
  "rio-de-janeiro": { safety: 42, affordability: 62, equality: 36, civicFreedom: 72, ecology: 56, crowding: 72 },
  monterrey: { safety: 62, affordability: 68, equality: 48, civicFreedom: 72, ecology: 48, crowding: 54 },
  durban: { safety: 44, affordability: 68, equality: 30, civicFreedom: 74, ecology: 56, crowding: 52 },
  mombasa: { safety: 54, affordability: 74, equality: 44, civicFreedom: 66, ecology: 52, crowding: 52 },

  // ── Expensive/overrated famous cities — scored honestly by SLIC ──
  copenhagen: { safety: 90, affordability: 28, equality: 82, civicFreedom: 88, ecology: 85, crowding: 38, boringIndex: 82, flatExperience: 78, taxReturn: 18, growthMomentum: 28, toleranceOpenness: 85 },
  oslo: { safety: 92, affordability: 20, equality: 80, civicFreedom: 88, ecology: 82, crowding: 35, boringIndex: 80, flatExperience: 76, taxReturn: 15, growthMomentum: 25 },
  amsterdam: { safety: 78, affordability: 25, equality: 78, civicFreedom: 88, ecology: 72, crowding: 62, housingPriceIndex: 92, toleranceOpenness: 88, growthMomentum: 35 },
  milan: { safety: 76, affordability: 35, equality: 68, civicFreedom: 82, ecology: 56, crowding: 64, housingPriceIndex: 88, growthMomentum: 42 },
  munich: { safety: 88, affordability: 28, equality: 78, civicFreedom: 86, ecology: 78, crowding: 48, boringIndex: 72, housingPriceIndex: 90, growthMomentum: 38 },
  edinburgh: { safety: 84, affordability: 38, equality: 72, civicFreedom: 84, ecology: 76, crowding: 42, boringIndex: 60, growthMomentum: 32 },
  lyon: { safety: 78, affordability: 52, equality: 72, civicFreedom: 82, ecology: 68, crowding: 52, foodCulture: 90, growthMomentum: 45 },
  gothenburg: { safety: 86, affordability: 34, equality: 78, civicFreedom: 86, ecology: 80, crowding: 38, boringIndex: 76, taxReturn: 18, growthMomentum: 30 },
  eindhoven: { safety: 84, affordability: 48, equality: 76, civicFreedom: 86, ecology: 74, crowding: 40, growthMomentum: 65, toleranceOpenness: 82 },
  lausanne: { safety: 94, affordability: 12, equality: 76, civicFreedom: 88, ecology: 86, crowding: 28, boringIndex: 85, flatExperience: 82, housingPriceIndex: 94, growthMomentum: 22 },
  roskilde: { safety: 90, affordability: 32, equality: 80, civicFreedom: 88, ecology: 82, crowding: 28, boringIndex: 86, flatExperience: 80, taxReturn: 18 },

};

const additionalCityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {
  singapore: { safety: 95, affordability: 42, equality: 71, civicFreedom: 60, ecology: 74, crowding: 67, growthMomentum: 68, toleranceOpenness: 32 },
  vienna: { safety: 92, affordability: 46, equality: 82, civicFreedom: 86, ecology: 84, crowding: 49, boringIndex: 65, growthMomentum: 30 },
  paris: { safety: 80, affordability: 27, equality: 70, civicFreedom: 82, ecology: 63, crowding: 78, housingPriceIndex: 92, toleranceOpenness: 85 },
  sydney: { safety: 85, affordability: 26, equality: 68, civicFreedom: 86, ecology: 74, crowding: 63, growthMomentum: 42, boringIndex: 45, housingPriceIndex: 94 },
  melbourne: { safety: 84, affordability: 30, equality: 69, civicFreedom: 86, ecology: 72, crowding: 61, growthMomentum: 40, boringIndex: 48 },
  vancouver: { safety: 85, affordability: 15, equality: 70, civicFreedom: 90, ecology: 90, crowding: 45, boringIndex: 80, flatExperience: 85, housingPriceIndex: 96 },
  toronto: { safety: 78, affordability: 36, equality: 67, civicFreedom: 82, ecology: 66, crowding: 64, housingPriceIndex: 90 },
  "san-francisco": { safety: 60, affordability: 5, equality: 55, civicFreedom: 88, ecology: 70, crowding: 60, housingPriceIndex: 99, healthcareCost: 95, taxReturn: 50 },
  "new-york": { safety: 70, affordability: 10, equality: 50, civicFreedom: 85, ecology: 55, crowding: 90, housingPriceIndex: 98, healthcareCost: 95, taxReturn: 50 },
  "hong-kong": { safety: 90, affordability: 8, equality: 55, civicFreedom: 38, ecology: 62, crowding: 92, housingPriceIndex: 99 },
  montreal: { safety: 77, affordability: 54, equality: 68, civicFreedom: 82, ecology: 69, crowding: 52, growthMomentum: 62, toleranceOpenness: 80 },
  pittsburgh: { safety: 78, affordability: 72, equality: 62, civicFreedom: 82, ecology: 66, crowding: 38, growthMomentum: 76, toleranceOpenness: 78 },
  porto: { safety: 83, affordability: 77, equality: 75, civicFreedom: 84, ecology: 74, crowding: 52, growthMomentum: 58, toleranceOpenness: 72 },
  braga: { safety: 84, affordability: 79, equality: 76, civicFreedom: 84, ecology: 78, crowding: 37, growthMomentum: 55, toleranceOpenness: 70 },
  tallinn: { safety: 85, affordability: 74, equality: 67, civicFreedom: 82, ecology: 77, crowding: 34, growthMomentum: 68, toleranceOpenness: 72 },
  krakow: { safety: 84, affordability: 78, equality: 67, civicFreedom: 77, ecology: 63, crowding: 53, growthMomentum: 76, toleranceOpenness: 68 },
  budapest: { safety: 80, affordability: 79, equality: 65, civicFreedom: 70, ecology: 66, crowding: 55, growthMomentum: 55 },
  santiago: { safety: 72, affordability: 56, equality: 58, civicFreedom: 77, ecology: 58, crowding: 68, toleranceOpenness: 68, growthMomentum: 62 },
  medellin: { safety: 66, affordability: 70, equality: 50, civicFreedom: 74, ecology: 56, crowding: 58, growthMomentum: 72 },
  curitiba: { safety: 67, affordability: 72, equality: 49, civicFreedom: 73, ecology: 63, crowding: 48, growthMomentum: 55 },
  montevideo: { safety: 74, affordability: 60, equality: 66, civicFreedom: 82, ecology: 72, crowding: 39, growthMomentum: 40 },
  kigali: { safety: 85, affordability: 69, equality: 54, civicFreedom: 52, ecology: 71, crowding: 36, growthMomentum: 78, hygiene: 82 },
  "cape-town": { safety: 49, affordability: 57, equality: 31, civicFreedom: 76, ecology: 61, crowding: 63 },
  nairobi: { safety: 58, affordability: 71, equality: 45, civicFreedom: 66, ecology: 46, crowding: 67, growthMomentum: 75 },
  brisbane: { safety: 84, affordability: 48, equality: 68, civicFreedom: 86, ecology: 79, crowding: 42, growthMomentum: 38, boringIndex: 72 },
  sapporo: { safety: 89, affordability: 78, equality: 77, civicFreedom: 85, ecology: 84, crowding: 41, foodCulture: 88 },
  hiroshima: { safety: 89, affordability: 76, equality: 77, civicFreedom: 85, ecology: 79, crowding: 42 },
  taichung: { safety: 88, affordability: 82, equality: 78, civicFreedom: 84, ecology: 72, crowding: 48, growthMomentum: 72 },
  bengaluru: { safety: 55, affordability: 64, equality: 49, civicFreedom: 72, ecology: 41, crowding: 83, growthMomentum: 82 },
  florianopolis: { safety: 72, affordability: 65, equality: 50, civicFreedom: 73, ecology: 74, crowding: 38, growthMomentum: 58 },
  raleigh: { safety: 80, affordability: 72, equality: 62, civicFreedom: 84, ecology: 72, crowding: 34, growthMomentum: 88, toleranceOpenness: 74 },
};

const cityScreenOverrides: Record<string, Partial<CityScreenProfile>> = {
  ...baseCityScreenOverrides,
  ...additionalCityScreenOverrides,
};
const defaultAccentByRegion: Record<string, CityAccent> = {
  "Southeast Asia": {
    accentHex: "#0f3f99",
    accentSoftHex: "rgba(15, 63, 153, 0.10)",
    accentLabel: "Electric blue urban mix",
  },
  "East Asia": {
    accentHex: "#1b5fbf",
    accentSoftHex: "rgba(27, 95, 191, 0.10)",
    accentLabel: "Calm systems blue",
  },
  "South Asia": {
    accentHex: "#7a5d1f",
    accentSoftHex: "rgba(122, 93, 31, 0.10)",
    accentLabel: "Heat and pressure amber",
  },
  "Western, Northern, and Southern Europe": {
    accentHex: "#455a89",
    accentSoftHex: "rgba(69, 90, 137, 0.10)",
    accentLabel: "Civic slate blue",
  },
  "Southern/Eastern Europe and Eurasia": {
    accentHex: "#2e5f8a",
    accentSoftHex: "rgba(46, 95, 138, 0.10)",
    accentLabel: "Stone-and-river blue",
  },
  "North America": {
    accentHex: "#334f85",
    accentSoftHex: "rgba(51, 79, 133, 0.10)",
    accentLabel: "Wide-grid steel blue",
  },
  "Latin America": {
    accentHex: "#0f6690",
    accentSoftHex: "rgba(15, 102, 144, 0.10)",
    accentLabel: "Street-life blue",
  },
  "Middle East": {
    accentHex: "#996b1f",
    accentSoftHex: "rgba(153, 107, 31, 0.10)",
    accentLabel: "Desert-gold pressure",
  },
  Africa: {
    accentHex: "#245f67",
    accentSoftHex: "rgba(36, 95, 103, 0.10)",
    accentLabel: "Equatorial teal",
  },
  Oceania: {
    accentHex: "#255b96",
    accentSoftHex: "rgba(37, 91, 150, 0.10)",
    accentLabel: "Southern ocean blue",
  },
};

const cityAccentOverrides: Record<string, CityAccent> = {
  bangkok: {
    accentHex: "#1e56c5",
    accentSoftHex: "rgba(30, 86, 197, 0.11)",
    accentLabel: "Electric street blue",
  },
  busan: {
    accentHex: "#2258a8",
    accentSoftHex: "rgba(34, 88, 168, 0.10)",
    accentLabel: "Harbour cobalt",
  },
  fukuoka: {
    accentHex: "#2d6bb8",
    accentSoftHex: "rgba(45, 107, 184, 0.10)",
    accentLabel: "Startup bay blue",
  },
  "jeju-city": {
    accentHex: "#2c8d8a",
    accentSoftHex: "rgba(44, 141, 138, 0.10)",
    accentLabel: "Island volcanic teal",
  },
  taipei: {
    accentHex: "#304ca8",
    accentSoftHex: "rgba(48, 76, 168, 0.10)",
    accentLabel: "Transit indigo",
  },
  penang: {
    accentHex: "#1f75a5",
    accentSoftHex: "rgba(31, 117, 165, 0.10)",
    accentLabel: "Straits heritage blue",
  },
  kaohsiung: {
    accentHex: "#19739c",
    accentSoftHex: "rgba(25, 115, 156, 0.10)",
    accentLabel: "Dockyard blue",
  },
  kuching: {
    accentHex: "#2b6d78",
    accentSoftHex: "rgba(43, 109, 120, 0.10)",
    accentLabel: "River-market teal",
  },
  makati: {
    accentHex: "#3557a4",
    accentSoftHex: "rgba(53, 87, 164, 0.10)",
    accentLabel: "Finance-district blue",
  },
  shanghai: {
    accentHex: "#193f7a",
    accentSoftHex: "rgba(25, 63, 122, 0.10)",
    accentLabel: "River-port navy",
  },
};

function accentForCity(city: CityOverride, row: CityUniverseRow): CityAccent {
  return (
    cityAccentOverrides[city.id] ??
    defaultAccentByRegion[row.cohort] ?? {
      accentHex: "#0f3f99",
      accentSoftHex: "rgba(15, 63, 153, 0.10)",
      accentLabel: "SLIC blue reference tone",
    }
  );
}

const countryTaxAssumptions: Record<string, number> = {
  Thailand: 0.12,
  Singapore: 0.15,
  Malaysia: 0.14,
  Indonesia: 0.14,
  Philippines: 0.12,
  Taiwan: 0.14,
  "South Korea": 0.18,
  Japan: 0.2,
  China: 0.19,
  India: 0.14,
  "Sri Lanka": 0.13,
  Bangladesh: 0.11,
  Pakistan: 0.1,
  Nepal: 0.1,
  Bhutan: 0.08,
  Maldives: 0.09,
  France: 0.28,
  Austria: 0.27,
  Switzerland: 0.22,
  Netherlands: 0.24,
  Denmark: 0.31,
  Portugal: 0.2,
  Estonia: 0.2,
  Finland: 0.27,
  Russia: 0.13,
  Hungary: 0.19,
  Poland: 0.18,
  Romania: 0.16,
  Serbia: 0.14,
  Slovakia: 0.18,
  "United States": 0.24,
  Canada: 0.26,
  Mexico: 0.16,
  Panama: 0.12,
  "Costa Rica": 0.14,
  "Puerto Rico": 0.18,
  Brazil: 0.18,
  Argentina: 0.2,
  Chile: 0.18,
  Colombia: 0.16,
  Peru: 0.14,
  Uruguay: 0.18,
  "United Arab Emirates": 0.06,
  Qatar: 0.05,
  "Saudi Arabia": 0.06,
  Israel: 0.24,
  Oman: 0.06,
  Bahrain: 0.05,
  Kuwait: 0.05,
  Jordan: 0.14,
  "South Africa": 0.2,
  Kenya: 0.14,
  Rwanda: 0.12,
  Morocco: 0.13,
  Mauritius: 0.12,
  Botswana: 0.14,
  Namibia: 0.15,
  Ghana: 0.12,
  Senegal: 0.11,
  "New Zealand": 0.24,
  Australia: 0.25,
  Fiji: 0.11,
};

const topCityOverrides: Record<string, CityOverride> = {
  taipei: {
    id: "taipei",
    name: "Taipei",
    country: "Taiwan",
    region: "East Asia",
    tagline: "Quiet confidence with everyday convenience.",
    signal: "Transit density and food culture keep daily life rich without overwhelming the city.",
    delta: 2,
    tags: ["safe", "transit", "culture"],
    scores: { pressure: 65, viability: 90, capability: 88, community: 92 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "High-systems, high-street-life benchmark aligned with earlier SLIC discussion.",
    sentimentEmojis: ["🍜", "🚇", "🏯", "🌿", "😊"],
    metrics: {
      pppIncomePerHead: 36800,
      graduateHousingShare: 28,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "High-access system with strong everyday reliability for routine and specialist care.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Strong public and tertiary options keep education quality high without extreme cost load.",
      },
      experienceDiversity: 90,
    },
  },
  busan: {
    id: "busan",
    name: "Busan",
    country: "South Korea",
    region: "East Asia",
    tagline: "A port city with breathing room.",
    signal: "Combines livability, coastline, and economic heft without Seoul-level pressure.",
    delta: 4,
    tags: ["coast", "balance", "industry"],
    scores: { pressure: 72, viability: 86, capability: 82, community: 80 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "User anchor for second-city infrastructure quality, coastal livability, and economic competence.",
    sentimentEmojis: ["🌊", "🐟", "🏖️", "🚢", "😌"],
    metrics: {
      pppIncomePerHead: 34100,
      graduateHousingShare: 26,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Strong hospital network and nationally backed access keep baseline care dependable.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Solid public and university pathways with less pressure than Seoul.",
      },
      experienceDiversity: 84,
    },
  },
  fukuoka: {
    id: "fukuoka",
    name: "Fukuoka",
    country: "Japan",
    region: "East Asia",
    tagline: "Compact, social, and startup ready.",
    signal: "Strong urban management and a human-scale rhythm keep it competitive and easy to inhabit.",
    delta: 1,
    tags: ["startup", "walkable", "food"],
    scores: { pressure: 72, viability: 88, capability: 82, community: 80 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor and strong challenger city for innovation, access, and livability balance.",
    sentimentEmojis: ["🍜", "🚶", "🌸", "💡", "😄"],
    metrics: {
      pppIncomePerHead: 31900,
      graduateHousingShare: 25,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "National healthcare access with a manageable urban scale makes routine care easy to reach.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Strong schooling and university options support early-career formation.",
      },
      experienceDiversity: 82,
    },
  },
  bangkok: {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    tagline: "High energy, high variety, still deeply liveable.",
    signal: "The city wins on vibrancy, affordability breadth, hospitality, and sheer diversity of experience.",
    delta: 5,
    tags: ["variety", "nightlife", "hospitality"],
    scores: { pressure: 82, viability: 76, capability: 78, community: 90 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "User anchor and regional benchmark for hospitality, economic dynamism, and affordability-pressure tradeoffs.",
    sentimentEmojis: ["🍛", "🛕", "🌙", "🛺", "🥰"],
    metrics: {
      pppIncomePerHead: 24300,
      graduateHousingShare: 22,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low cost",
        summary: "Private and public care both matter, and major hospitals remain comparatively affordable.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Low to moderate cost",
        summary: "There is real range, from affordable public options to premium private pathways.",
      },
      experienceDiversity: 97,
    },
  },
  jakarta: {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    region: "Southeast Asia",
    tagline: "A regional giant with real pressure and real economic gravity.",
    signal: "Jakarta belongs in the field because scale, ambition, and corporate gravity matter, even when congestion and sanitation risks keep it from the very top.",
    delta: 1,
    tags: ["regional hub", "pressure", "corporate core"],
    scores: { pressure: 79, viability: 60, capability: 72, community: 69 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a necessary Southeast Asian benchmark for scale, competitiveness, and infrastructure-pressure tradeoffs.",
    sentimentEmojis: ["🏙️", "🚦", "💼", "🌧️", "😤"],
    metrics: {
      pppIncomePerHead: 18500,
      graduateHousingShare: 30,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low to moderate cost",
        summary: "Large hospital capacity exists, but access quality varies sharply by district and provider.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Moderate cost",
        summary: "The city offers range and institutional depth, but commuting and urban pressure raise the real cost of opportunity.",
      },
      experienceDiversity: 83,
    },
  },
  "jeju-city": {
    id: "jeju-city",
    name: "Jeju",
    country: "South Korea",
    region: "East Asia",
    tagline: "Island calm with specific local character.",
    signal: "Natural beauty, safety, and a slower pace make it a strong quality-of-life outlier.",
    delta: 3,
    tags: ["nature", "island", "calm"],
    scores: { pressure: 55, viability: 88, capability: 78, community: 82 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor for lifestyle quality, hospitality, and island-scale livability.",
    sentimentEmojis: ["🏝️", "🌋", "🍊", "🐴", "😎"],
    metrics: {
      pppIncomePerHead: 29400,
      graduateHousingShare: 24,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Coverage is strong, though specialist depth is lower than the biggest mainland metros.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Education is accessible, with the city winning more on life quality than elite academic density.",
      },
      experienceDiversity: 79,
    },
  },
  penang: {
    id: "penang",
    name: "Penang",
    country: "Malaysia",
    region: "Southeast Asia",
    tagline: "Trading history meets modern industry.",
    signal: "Food, heritage, and semiconductor-linked economic depth make it more dynamic than its size suggests.",
    delta: 2,
    tags: ["heritage", "food", "industry"],
    scores: { pressure: 75, viability: 72, capability: 62, community: 78 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "User anchor for semiconductor economy, cultural texture, and secondary-city livability.",
    sentimentEmojis: ["🍜", "🏛️", "💻", "🎨", "😋"],
    metrics: {
      pppIncomePerHead: 22800,
      graduateHousingShare: 24,
      healthcare: {
        access: "Broad mixed access",
        affordability: "Low cost",
        summary: "Public and private options coexist, with good value relative to many richer cities.",
      },
      education: {
        access: "Broad public-private mix",
        affordability: "Low to moderate cost",
        summary: "Affordable schooling and tertiary options help keep the city attractive for families.",
      },
      experienceDiversity: 88,
    },
  },
  makati: {
    id: "makati",
    name: "Makati",
    country: "Philippines",
    region: "Southeast Asia",
    tagline: "A polished business district tested against the wider metro reality.",
    signal: "Makati stays interesting because it concentrates finance, services, and livable pockets, but SLIC still checks it against affordability, safety, and urban pressure.",
    delta: 2,
    tags: ["business core", "district scale", "services"],
    scores: { pressure: 80, viability: 72, capability: 76, community: 73 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a metro-core test case for whether a well-serviced district can sustain a broader livability argument.",
    sentimentEmojis: ["🏢", "☕", "🚕", "🌴", "🙂"],
    metrics: {
      pppIncomePerHead: 20800,
      graduateHousingShare: 34,
      healthcare: {
        access: "Broad private-led access",
        affordability: "Moderate cost",
        summary: "High-end options are visible, but affordability is less forgiving than in several stronger Southeast Asian peers.",
      },
      education: {
        access: "Broad private-public mix",
        affordability: "Moderate cost",
        summary: "The city has strong institutions nearby, though access depends more on household budget than in the best-value Asian systems.",
      },
      experienceDiversity: 81,
    },
  },
  kaohsiung: {
    id: "kaohsiung",
    name: "Kaohsiung",
    country: "Taiwan",
    region: "East Asia",
    tagline: "A harbor city with room to grow.",
    signal: "Cleaner edges, strong place-making, and a practical waterfront economy push it upward.",
    delta: 1,
    tags: ["harbor", "clean", "young"],
    scores: { pressure: 72, viability: 86, capability: 78, community: 88 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Harbor-city comparator with strong place-making and manageable scale.",
    sentimentEmojis: ["⚓", "🌅", "🎨", "🚄", "😊"],
    metrics: {
      pppIncomePerHead: 29700,
      graduateHousingShare: 23,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Strong urban access with comparatively low everyday financial friction.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Reliable public pathways and lower daily pressure than the capital.",
      },
      experienceDiversity: 80,
    },
  },
  shanghai: {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    region: "East Asia",
    tagline: "Massive capability, visible trade-offs.",
    signal: "Incredible transit and economic vitality are moderated by real affordability pressure.",
    delta: -1,
    tags: ["mega-city", "finance", "transit"],
    scores: { pressure: 88, viability: 62, capability: 78, community: 48 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Economic gravity benchmark included to test how mega-city capability meets affordability pressure.",
    sentimentEmojis: ["🏙️", "💹", "🚄", "🌃", "😤"],
    metrics: {
      pppIncomePerHead: 27500,
      graduateHousingShare: 35,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "High capability exists, but everyday access depends more on system tier and city cost pressure.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "Very strong academic density, though competition and housing costs raise the total burden.",
      },
      experienceDiversity: 76,
    },
  },
  shenzhen: {
    id: "shenzhen",
    name: "Shenzhen",
    country: "China",
    region: "East Asia",
    tagline: "A high-speed economic machine with fewer historical layers than its peers.",
    signal: "Shenzhen is deeply competitive and technically capable, but its cultural depth and housing pressure keep the city in active debate within SLIC.",
    delta: 3,
    tags: ["innovation", "speed", "manufacturing"],
    scores: { pressure: 85, viability: 55, capability: 75, community: 42 },
    manifestStatus: "provisional",
    cityType: "primary",
    inclusionRationale: "Included as a necessary East Asian benchmark for innovation, productive economic power, and high-pressure urban modernity.",
    sentimentEmojis: ["💻", "🏗️", "🚄", "📦", "⚡"],
    metrics: {
      pppIncomePerHead: 31200,
      graduateHousingShare: 37,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "Capability is strong, but everyday access still depends on system tier and overall cost pressure.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "High institutional ambition is visible, though the city feels more competitive than relaxed.",
      },
      experienceDiversity: 74,
    },
  },
  tianjin: {
    id: "tianjin",
    name: "Tianjin",
    country: "China",
    region: "East Asia",
    tagline: "A northern port city with scale, industry, and more breathing room than the capital.",
    signal: "Tianjin is useful for SLIC because it tests whether large-scale Chinese urban capability can be delivered without maximum-cost prestige pressure.",
    delta: 1,
    tags: ["port city", "industry", "scale"],
    scores: { pressure: 62, viability: 68, capability: 65, community: 58 },
    manifestStatus: "provisional",
    cityType: "secondary",
    inclusionRationale: "Secondary East Asian challenger included for industrial relevance, port-city utility, and relief from capital-city prestige bias.",
    sentimentEmojis: ["⚓", "🏭", "🚇", "🌆", "🙂"],
    metrics: {
      pppIncomePerHead: 26400,
      graduateHousingShare: 30,
      healthcare: {
        access: "Broad urban access",
        affordability: "Moderate cost",
        summary: "Strong metro-scale capacity exists, though experience still varies by system tier and district.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "The city has serious educational capacity without the same prestige-cost premium as the very top-tier capitals.",
      },
      experienceDiversity: 72,
    },
  },
  yokohama: {
    id: "yokohama",
    name: "Yokohama",
    country: "Japan",
    region: "East Asia",
    tagline: "Port-city composure with metropolitan access.",
    signal: "It offers a high-function baseline and strong public-space quality without constant friction.",
    delta: 0,
    tags: ["harbor", "composed", "access"],
    scores: { pressure: 58, viability: 78, capability: 72, community: 80 },
    manifestStatus: "provisional",
    cityType: "secondary",
    inclusionRationale: "Port-city comparator with strong metropolitan access and public-space quality.",
    sentimentEmojis: ["⚓", "🌸", "🎡", "🍜", "😌"],
    metrics: {
      pppIncomePerHead: 32400,
      graduateHousingShare: 31,
      healthcare: {
        access: "Universal public access",
        affordability: "Low cost",
        summary: "Reliable national coverage and strong hospital access support everyday stability.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low cost",
        summary: "Good schooling and metro-scale access without Tokyo-level housing stress.",
      },
      experienceDiversity: 75,
    },
  },
  auckland: {
    id: "auckland",
    name: "Auckland",
    country: "New Zealand",
    region: "Oceania",
    tagline: "Exceptionally pleasant, less economically urgent.",
    signal: "A quality-of-life standout whose score softens once competitiveness and long-term opportunity are factored in.",
    delta: -2,
    tags: ["pleasant", "green", "cost"],
    scores: { pressure: 55, viability: 72, capability: 75, community: 82 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Primary Oceanian benchmark for human-capital quality, openness, and cost pressure.",
    sentimentEmojis: ["🌿", "⛵", "🏔️", "☕", "😊"],
    metrics: {
      pppIncomePerHead: 30200,
      graduateHousingShare: 42,
      healthcare: {
        access: "Universal public baseline",
        affordability: "Free to low cost",
        summary: "Healthcare access is strong, but the wider cost-of-living equation is still heavy.",
      },
      education: {
        access: "Broad public access",
        affordability: "Low to moderate cost",
        summary: "Strong public systems, though the total cost of staying in the city remains high.",
      },
      experienceDiversity: 83,
    },
  },
  "new-york": {
    id: "new-york",
    name: "New York",
    country: "United States",
    region: "North America",
    tagline: "The world runs through here.",
    signal: "Extreme creative density and earning power, but housing and pace extract a real price.",
    delta: -2,
    tags: ["finance", "creative", "pressure"],
    scores: { pressure: 52, viability: 64, capability: 90, community: 45, creative: 96 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Global financial and cultural capital; benchmark for maximum growth-pressure tradeoff.",
    sentimentEmojis: ["🗽", "💰", "🎭", "🏙️", "⚡"],
    metrics: {
      pppIncomePerHead: 62500,
      graduateHousingShare: 58,
      healthcare: { access: "Private-led mixed", affordability: "High cost", summary: "World-class hospitals exist but access depends heavily on insurance and income." },
      education: { access: "Broad access with elite tier", affordability: "High cost", summary: "Best universities globally but cost loads are extreme for non-scholarship residents." },
      experienceDiversity: 98,
    },
  },
  "san-francisco": {
    id: "san-francisco",
    name: "San Francisco",
    country: "United States",
    region: "North America",
    tagline: "Where ideas become industries.",
    signal: "Highest startup density on Earth, but housing costs consume most of the surplus.",
    delta: -3,
    tags: ["startup", "tech", "expensive"],
    scores: { pressure: 38, viability: 56, capability: 86, community: 42, creative: 98 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Global VC and startup epicenter; highest creative output per capita but extreme cost pressure.",
    sentimentEmojis: ["🌉", "💻", "🏔️", "🌫️", "🚀"],
    metrics: {
      pppIncomePerHead: 68000,
      graduateHousingShare: 65,
      healthcare: { access: "Private-led", affordability: "High cost", summary: "Strong healthcare ecosystem but affordability is employer-dependent." },
      education: { access: "Broad access with elite tier", affordability: "High cost", summary: "World-class research universities, but cost of living while studying is brutal." },
      experienceDiversity: 92,
    },
  },
  london: {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Western, Northern, and Southern Europe",
    tagline: "Global stage, relentless cost.",
    signal: "Deep creative and financial industries with NHS access, but housing eats most incomes.",
    delta: -1,
    tags: ["finance", "culture", "expensive"],
    scores: { pressure: 48, viability: 72, capability: 88, community: 55, creative: 90 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "European financial and cultural capital; benchmark for high-capability cities with extreme housing cost.",
    sentimentEmojis: ["🇬🇧", "💂", "🎭", "🏛️", "☂️"],
    metrics: {
      pppIncomePerHead: 44600,
      graduateHousingShare: 52,
      healthcare: { access: "Universal NHS", affordability: "Free at point of use", summary: "NHS guarantees baseline access but wait times and specialist care have deteriorated." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Strong public education system with world-leading universities." },
      experienceDiversity: 96,
    },
  },
  berlin: {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    region: "Western, Northern, and Southern Europe",
    tagline: "Creative freedom with room to breathe.",
    signal: "Strong community texture and startup density at prices that still leave room to live.",
    delta: 3,
    tags: ["creative", "community", "affordable"],
    scores: { pressure: 64, viability: 72, capability: 76, community: 78, creative: 72 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "European creative capital; benchmark for high-community, high-creative with moderate growth pressure.",
    sentimentEmojis: ["🎨", "🎵", "🍺", "🌳", "💡"],
    metrics: {
      pppIncomePerHead: 34800,
      graduateHousingShare: 30,
      healthcare: { access: "Universal statutory", affordability: "Low cost", summary: "German statutory health insurance gives strong baseline access across all income levels." },
      education: { access: "Broad public access", affordability: "Free tuition", summary: "Public universities are tuition-free; strong technical and research institutions." },
      experienceDiversity: 94,
    },
  },
  tokyo: {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "East Asia",
    tagline: "Precision at every scale.",
    signal: "Safest and most reliable mega-city on Earth, but overwork culture taxes the human experience.",
    delta: 0,
    tags: ["safe", "transit", "overwork"],
    scores: { pressure: 52, viability: 96, capability: 90, community: 48, creative: 78 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "World's largest metro by GDP; benchmark for extreme viability with high working-pressure.",
    sentimentEmojis: ["🗼", "🚅", "🍣", "🌸", "🏙️"],
    metrics: {
      pppIncomePerHead: 38200,
      graduateHousingShare: 32,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "High-quality universal coverage with low out-of-pocket costs." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Strong public system with competitive university entrance." },
      experienceDiversity: 90,
    },
  },
  seoul: {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    region: "East Asia",
    tagline: "Hyper-connected, hyper-competitive.",
    signal: "K-wave cultural export and tech density are world-class, but housing and social pressure are crushing.",
    delta: -1,
    tags: ["tech", "culture", "pressure"],
    scores: { pressure: 40, viability: 84, capability: 92, community: 38, creative: 90 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Korean capital; benchmark for extreme education investment and creative output vs social-pressure costs.",
    sentimentEmojis: ["🇰🇷", "📱", "🎶", "🏙️", "⚡"],
    metrics: {
      pppIncomePerHead: 35600,
      graduateHousingShare: 48,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Universal coverage with world-class facilities at affordable prices." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Extremely competitive but accessible; hagwon culture adds hidden costs." },
      experienceDiversity: 88,
    },
  },
  "hong-kong": {
    id: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong SAR",
    region: "East Asia",
    tagline: "Finance density in a vertical city.",
    signal: "World's most expensive housing alongside world-class infrastructure and connectivity.",
    delta: -4,
    tags: ["finance", "crowded", "expensive"],
    scores: { pressure: 28, viability: 80, capability: 84, community: 35, creative: 72 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Global finance hub; benchmark for extreme housing costs vs infrastructure quality.",
    sentimentEmojis: ["🏙️", "💹", "🚢", "🌃", "💰"],
    metrics: {
      pppIncomePerHead: 48800,
      graduateHousingShare: 72,
      healthcare: { access: "Public-private mix", affordability: "Moderate cost", summary: "Strong public hospital system alongside expensive private options." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Competitive education system with good public schools and top universities." },
      experienceDiversity: 82,
    },
  },
  barcelona: {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Western, Northern, and Southern Europe",
    tagline: "Mediterranean life at a human scale.",
    signal: "Strong public life, walkability, and creative texture in a city that still works for non-rich residents.",
    delta: 2,
    tags: ["community", "walkable", "culture"],
    scores: { pressure: 64, viability: 78, capability: 74, community: 90, creative: 74 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Mediterranean benchmark for strong community life and cultural magnetism.",
    sentimentEmojis: ["🏖️", "🎨", "⚽", "🍷", "🌴"],
    metrics: {
      pppIncomePerHead: 30200,
      graduateHousingShare: 34,
      healthcare: { access: "Universal public", affordability: "Free at point of use", summary: "Strong Spanish public health system with good hospital access." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Solid public education with affordable university options." },
      experienceDiversity: 90,
    },
  },
  lisbon: {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Western, Northern, and Southern Europe",
    tagline: "Old city, new energy.",
    signal: "Digital nomad magnet with rising startup scene, but gentrification is pricing out locals.",
    delta: 1,
    tags: ["startup", "lifestyle", "rising"],
    scores: { pressure: 62, viability: 80, capability: 72, community: 80, creative: 78 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "European lifestyle and startup magnet; benchmark for affordability-shift and creative pull.",
    sentimentEmojis: ["🌊", "☀️", "🎵", "🏛️", "🛹"],
    metrics: {
      pppIncomePerHead: 26800,
      graduateHousingShare: 32,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Portuguese SNS provides universal access at low cost." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Affordable public universities with growing international programs." },
      experienceDiversity: 84,
    },
  },
  stockholm: {
    id: "stockholm",
    name: "Stockholm",
    country: "Sweden",
    region: "Western, Northern, and Southern Europe",
    tagline: "Unicorn factory with welfare backbone.",
    signal: "More unicorns per capita than anywhere except Silicon Valley, backed by strong social safety nets.",
    delta: 1,
    tags: ["startup", "welfare", "design"],
    scores: { pressure: 36, viability: 72, capability: 72, community: 48, creative: 52 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Nordic welfare-state benchmark; tests whether safety nets become comfort traps when affordability, light, and ambition are measured.",
    sentimentEmojis: ["👑", "💻", "🌧️", "💸", "❄️"],
    metrics: {
      pppIncomePerHead: 36400,
      graduateHousingShare: 36,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Swedish universal healthcare with strong baseline access." },
      education: { access: "Broad public access", affordability: "Free tuition", summary: "Free public universities with strong research and design programs." },
      experienceDiversity: 86,
    },
  },
  istanbul: {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    region: "Southern/Eastern Europe and Eurasia",
    tagline: "Two continents, one relentless city.",
    signal: "Massive cultural depth and economic dynamism, but inflation and political uncertainty create real pressure.",
    delta: 0,
    tags: ["culture", "growth", "volatile"],
    scores: { pressure: 70, viability: 55, capability: 58, community: 72, creative: 62 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Transcontinental mega-city; benchmark for cultural depth vs political-economic volatility.",
    sentimentEmojis: ["🕌", "🌊", "🍽️", "🏛️", "🌉"],
    metrics: {
      pppIncomePerHead: 22400,
      graduateHousingShare: 28,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Universal coverage exists but quality varies significantly by district." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Good public universities but competitive entrance exams." },
      experienceDiversity: 92,
    },
  },
  prague: {
    id: "prague",
    name: "Prague",
    country: "Czechia",
    region: "Southern/Eastern Europe and Eurasia",
    tagline: "Central European gem that still works.",
    signal: "High community texture and cultural magnetism at prices that let you build a real life.",
    delta: 3,
    tags: ["community", "heritage", "affordable"],
    scores: { pressure: 76, viability: 84, capability: 78, community: 88, creative: 68 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Central European benchmark for high community and affordability with moderate growth.",
    sentimentEmojis: ["🏰", "🍺", "🎭", "🌉", "😊"],
    metrics: {
      pppIncomePerHead: 30600,
      graduateHousingShare: 26,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Czech universal healthcare with good baseline access and low costs." },
      education: { access: "Broad public access", affordability: "Free tuition", summary: "Free public universities with strong technical and research programs." },
      experienceDiversity: 84,
    },
  },
  dallas: {
    id: "dallas",
    name: "Dallas",
    country: "United States",
    region: "North America",
    tagline: "Low tax, high growth, no apologies.",
    signal: "Texas affordability and zero state income tax create real disposable room for business builders.",
    delta: 2,
    tags: ["growth", "business", "affordable"],
    scores: { pressure: 82, viability: 68, capability: 76, community: 52, creative: 72 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Texas business hub; benchmark for low-tax growth model with strong affordability.",
    sentimentEmojis: ["🤠", "💼", "🏗️", "🛢️", "🌵"],
    metrics: {
      pppIncomePerHead: 48200,
      graduateHousingShare: 22,
      healthcare: { access: "Private-led", affordability: "Moderate cost", summary: "Good facilities but access is insurance-dependent." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Strong public university system with affordable in-state tuition." },
      experienceDiversity: 78,
    },
  },
  miami: {
    id: "miami",
    name: "Miami",
    country: "United States",
    region: "North America",
    tagline: "Latin gateway with Florida tax advantage.",
    signal: "No state income tax, booming finance sector, and Latin American connectivity create unique growth pull.",
    delta: 1,
    tags: ["finance", "lifestyle", "growth"],
    scores: { pressure: 68, viability: 62, capability: 72, community: 58, creative: 76 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Florida finance and lifestyle hub; benchmark for tax-advantaged growth with climate risk.",
    sentimentEmojis: ["🌴", "🏖️", "💰", "🌊", "🎵"],
    metrics: {
      pppIncomePerHead: 44800,
      graduateHousingShare: 38,
      healthcare: { access: "Private-led", affordability: "Moderate-high cost", summary: "Strong hospitals but cost and access vary by insurance status." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Good public universities with growing research profile." },
      experienceDiversity: 88,
    },
  },
  osaka: {
    id: "osaka",
    name: "Osaka",
    country: "Japan",
    region: "East Asia",
    tagline: "Japan's kitchen and comedy capital — getting expensive.",
    signal: "Stronger food culture and warmer social fabric than Tokyo, but costs are rising fast and the city is losing its affordability edge.",
    delta: 0,
    tags: ["food", "culture", "rising cost"],
    scores: { pressure: 58, viability: 82, capability: 78, community: 72, creative: 65 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Japan's commercial capital; benchmark for high viability with stronger community texture than Tokyo.",
    sentimentEmojis: ["🍜", "🎭", "🏯", "😄", "🌊"],
    metrics: {
      pppIncomePerHead: 34200,
      graduateHousingShare: 26,
      healthcare: { access: "Universal public", affordability: "Low cost", summary: "Same strong Japanese universal system as Tokyo at lower living costs." },
      education: { access: "Broad public access", affordability: "Moderate cost", summary: "Strong university city with good public education system." },
      experienceDiversity: 88,
    },
  },
  beijing: {
    id: "beijing",
    name: "Beijing",
    country: "China",
    region: "East Asia",
    tagline: "Capital power with imperial ambition.",
    signal: "Strongest research output in China, but civic freedom constraints and air quality limit lived experience.",
    delta: -2,
    tags: ["research", "government", "pollution"],
    scores: { pressure: 58, viability: 52, capability: 85, community: 42, creative: 80 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Chinese capital; benchmark for high capability and research output vs civic and environmental costs.",
    sentimentEmojis: ["🏛️", "🎓", "🌫️", "🏰", "📚"],
    metrics: {
      pppIncomePerHead: 28200,
      graduateHousingShare: 42,
      healthcare: { access: "Public-private mix", affordability: "Low cost", summary: "Good hospitals but crowded; access quality varies between tiers." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Home to China's best universities; extreme competition for entry." },
      experienceDiversity: 78,
    },
  },
  mumbai: {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    region: "South Asia",
    tagline: "Dream factory of a billion people.",
    signal: "India's financial and entertainment capital with extreme inequality and growth energy.",
    delta: 0,
    tags: ["finance", "entertainment", "inequality"],
    scores: { pressure: 62, viability: 38, capability: 52, community: 65, creative: 68 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "India's financial capital; benchmark for extreme growth energy with infrastructure and inequality gaps.",
    sentimentEmojis: ["🎬", "💰", "🌊", "🏗️", "⚡"],
    metrics: {
      pppIncomePerHead: 14800,
      graduateHousingShare: 45,
      healthcare: { access: "Mixed public-private", affordability: "Low-moderate cost", summary: "World-class private hospitals alongside underfunded public system." },
      education: { access: "Broad public with elite tier", affordability: "Low cost", summary: "Strong IITs and colleges but huge quality gap between public and private." },
      experienceDiversity: 86,
    },
  },
  "ho-chi-minh-city": {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    region: "Southeast Asia",
    tagline: "Young energy, fast growth, low floor.",
    signal: "Manufacturing and startup boom with extreme affordability, but infrastructure is still catching up.",
    delta: 4,
    tags: ["growth", "affordable", "young"],
    scores: { pressure: 85, viability: 58, capability: 55, community: 78, creative: 62 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Vietnam's commercial capital; benchmark for fast-growth affordability with infrastructure gaps.",
    sentimentEmojis: ["🏍️", "🍜", "☕", "🏗️", "⚡"],
    metrics: {
      pppIncomePerHead: 12400,
      graduateHousingShare: 18,
      healthcare: { access: "Public with growing private", affordability: "Low cost", summary: "Affordable basic care but quality gaps exist for specialist treatment." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Improving public education with affordable university access." },
      experienceDiversity: 76,
    },
  },
  lagos: {
    id: "lagos",
    name: "Lagos",
    country: "Nigeria",
    region: "Africa",
    tagline: "Africa's creative and economic engine.",
    signal: "Explosive creative energy and tech growth, but infrastructure and safety create daily friction.",
    delta: 0,
    tags: ["creative", "growth", "chaotic"],
    scores: { pressure: 55, viability: 32, capability: 35, community: 72, creative: 65 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Africa's largest economy hub; benchmark for creative explosion with infrastructure gaps.",
    sentimentEmojis: ["🌍", "🎵", "🏗️", "⚡", "💪"],
    metrics: {
      pppIncomePerHead: 6800,
      graduateHousingShare: 32,
      healthcare: { access: "Limited public", affordability: "Mixed", summary: "Private care is the reliable option; public system is severely underfunded." },
      education: { access: "Broad but uneven", affordability: "Low cost", summary: "Growing university sector but quality is highly variable." },
      experienceDiversity: 82,
    },
  },

  // ── V2.5 expansion: famous cities scored by SLIC methodology ──

  raleigh: {
    id: "raleigh",
    name: "Raleigh",
    country: "United States",
    region: "North America",
    tagline: "The Research Triangle that nobody outside tech knows about.",
    signal: "Three major universities (Duke, UNC, NC State) within 30 minutes create a knowledge economy with genuine diversity and affordability. Housing is a fraction of coastal cities, the weather is mild, and the job market grows faster than the infrastructure can follow. This is where America's next generation of startups is quietly forming.",
    delta: 5,
    tags: ["research", "affordable", "growth"],
    scores: { pressure: 82, viability: 80, capability: 86, community: 78 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "America's fastest-growing knowledge city; proof that innovation doesn't require coastal prices or coastal politics.",
    sentimentEmojis: ["🎓", "🌲", "💻", "🏠", "😊"],
    metrics: {
      pppIncomePerHead: 48000,
      graduateHousingShare: 42,
      healthcare: { access: "Mixed private-public", affordability: "High cost", summary: "Duke Health and UNC Hospitals are world-class; access follows American insurance patterns." },
      education: { access: "Broad access", affordability: "High cost", summary: "Three R1 universities in 30 minutes — Duke, UNC Chapel Hill, NC State — an unmatched research corridor." },
      experienceDiversity: 76,
    },
  },
  zurich: {
    id: "zurich",
    name: "Zürich",
    country: "Switzerland",
    region: "Western, Northern, and Southern Europe",
    tagline: "Wealth without friction — if you can afford to enter.",
    signal: "Zurich is immaculate: trains on time, swimmable lakes, enormous salaries. But mandatory health insurance is CHF 400+/month, dinner for two is CHF 120, and social circles are closed to outsiders. The city rewards those already inside the system.",
    delta: -3,
    tags: ["wealth", "precision", "exclusive"],
    scores: { pressure: 32, viability: 82, capability: 74, community: 42 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Extreme wealth-livability stress test; reveals how affordability erodes life quality when everything else is excellent.",
    sentimentEmojis: ["⛰️", "💎", "🚂", "🏦", "😶"],
    metrics: {
      pppIncomePerHead: 52000,
      graduateHousingShare: 44,
      healthcare: { access: "Universal mandatory insurance", affordability: "High out-of-pocket", summary: "Excellent quality but insurance premiums create real monthly pressure." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "ETH Zürich alone makes this a global education hub." },
      experienceDiversity: 68,
    },
  },
  singapore: {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    tagline: "Everything works, but at what cost to the soul?",
    signal: "The city-state runs like a Swiss watch — clean, safe, hyper-efficient. But housing is government-allocated, creative friction is managed, and the social contract trades spontaneity for order. Residents sometimes call what other indices call 'livable' simply 'sterile.'",
    delta: -2,
    tags: ["efficiency", "controlled", "expensive"],
    scores: { pressure: 48, viability: 88, capability: 78, community: 48 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Benchmark city-state for top-down governance. Infrastructure is world-class, but conformity and low tolerance suppress the creative capacity that makes a city truly livable.",
    sentimentEmojis: ["🏙️", "🌳", "🚇", "💰", "😐"],
    metrics: {
      pppIncomePerHead: 62000,
      graduateHousingShare: 42,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "World-class public hospitals backed by Medisave and Medishield." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Globally ranked universities and a hyper-competitive schooling pipeline." },
      experienceDiversity: 68,
    },
  },
  vienna: {
    id: "vienna",
    name: "Vienna",
    country: "Austria",
    region: "Western, Northern, and Southern Europe",
    tagline: "The city other indices love. SLIC asks why.",
    signal: "Vienna tops every legacy index for a reason: social housing that works, universal healthcare, and café culture. But affordable it is not for newcomers, creative it struggles to be, and growth momentum has stalled for a generation.",
    delta: -1,
    tags: ["social housing", "culture", "aging"],
    scores: { pressure: 48, viability: 94, capability: 82, community: 74 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Perennial 'most livable' in legacy indices; SLIC uses it to expose affordability and creative stagnation.",
    sentimentEmojis: ["☕", "🏛️", "🎶", "🏠", "😌"],
    metrics: {
      pppIncomePerHead: 38200,
      graduateHousingShare: 38,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Comprehensive public system with minimal out-of-pocket." },
      education: { access: "Broad public access", affordability: "Free to low cost", summary: "Free university tuition and strong vocational pathways." },
      experienceDiversity: 78,
    },
  },
  paris: {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Western, Northern, and Southern Europe",
    tagline: "The cultural capital that prices out its own artists.",
    signal: "Paris still has the museums, the food, and the intellectual density that no other city matches. But a studio in the 11th costs more than a family flat in Taipei, commute times are brutal beyond the périphérique, and the bureaucracy is Kafka-grade.",
    delta: -1,
    tags: ["culture", "bureaucracy", "unaffordable"],
    scores: { pressure: 42, viability: 78, capability: 80, community: 68 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Global cultural benchmark revealing how prestige and creative heritage coexist with severe affordability failure.",
    sentimentEmojis: ["🥐", "🎨", "🚇", "📜", "😤"],
    metrics: {
      pppIncomePerHead: 34800,
      graduateHousingShare: 42,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Excellent public system backed by Sécurité sociale." },
      education: { access: "Broad public access", affordability: "Free to low cost", summary: "Grandes écoles and public universities create a dual-track system." },
      experienceDiversity: 95,
    },
  },
  copenhagen: {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    region: "Western, Northern, and Southern Europe",
    tagline: "Cycling paradise — if you can afford the ticket in.",
    signal: "Copenhagen has the best cycling infrastructure on Earth, beautiful design, and a welfare state that catches everyone. But tax takes over half your income, the darkness from October to March is clinically significant, and the social contract produces comfort that borders on complacency. Starting anything ambitious here is swimming against the current of 'hygge.'",
    delta: -3,
    tags: ["cycling", "expensive", "dark"],
    scores: { pressure: 38, viability: 88, capability: 80, community: 62 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Nordic welfare-state benchmark; reveals how safety nets can become comfort traps when affordability, light, and ambition are measured.",
    sentimentEmojis: ["🚲", "🌧️", "💸", "🕯️", "😶"],
    metrics: {
      pppIncomePerHead: 40200,
      graduateHousingShare: 42,
      healthcare: { access: "Universal public access", affordability: "Free", summary: "Excellent universal healthcare fully tax-funded." },
      education: { access: "Universal public access", affordability: "Free", summary: "Free education through university; SU grants support living costs." },
      experienceDiversity: 70,
    },
  },
  geneva: {
    id: "geneva",
    name: "Geneva",
    country: "Switzerland",
    region: "Western, Northern, and Southern Europe",
    tagline: "Diplomacy headquarters with a CHF 35 sandwich.",
    signal: "Geneva houses the UN, WHO, and CERN, but the cost of existing here makes Zurich look reasonable. Mandatory health insurance is CHF 400+/month, a simple dinner is CHF 60, and the social scene is famously closed to outsiders. Beautiful lake, impossible economics.",
    delta: -4,
    tags: ["diplomacy", "extreme cost", "insular"],
    scores: { pressure: 32, viability: 94, capability: 82, community: 50 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Extreme cost benchmark; shows how a city can be 'safe and clean' yet utterly unlivable for anyone without institutional salary.",
    sentimentEmojis: ["🏔️", "💎", "🏛️", "💰", "😶"],
    metrics: {
      pppIncomePerHead: 54000,
      graduateHousingShare: 44,
      healthcare: { access: "Universal mandatory insurance", affordability: "Very high cost", summary: "Excellent care quality but insurance premiums create crushing monthly pressure." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "University of Geneva is affordable; the city's cost of living is the real education expense." },
      experienceDiversity: 68,
    },
  },
  oslo: {
    id: "oslo",
    name: "Oslo",
    country: "Norway",
    region: "Western, Northern, and Southern Europe",
    tagline: "Oil wealth, dark winters, and a $20 beer.",
    signal: "Oslo is safe, green, and beautifully designed. It also costs $20 for a beer, has 6 hours of daylight in December, and the social reserve makes Copenhagen feel gregarious. The oil-funded welfare state is generous but the resulting economy has the ambition profile of a well-funded retirement community.",
    delta: -4,
    tags: ["expensive", "dark", "welfare"],
    scores: { pressure: 35, viability: 90, capability: 80, community: 58 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Extreme Nordic cost benchmark; tests whether oil-funded safety nets compensate for darkness, cost, and social isolation.",
    sentimentEmojis: ["🌑", "💰", "🏔️", "🍺", "😐"],
    metrics: {
      pppIncomePerHead: 46000,
      graduateHousingShare: 42,
      healthcare: { access: "Universal public access", affordability: "Free", summary: "Comprehensive public healthcare fully tax-funded." },
      education: { access: "Universal public access", affordability: "Free", summary: "Free education through university; generous student support." },
      experienceDiversity: 66,
    },
  },
  amsterdam: {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Western, Northern, and Southern Europe",
    tagline: "Open-minded city where only the rent is closed.",
    signal: "Amsterdam has the tolerance, the canals, the cycling culture, and the progressive policies that make it a magnet. But housing has become a lottery — literally. Average wait time for social housing is 14 years, and the private market has exploded. The openness that built the city is being priced out of it.",
    delta: -2,
    tags: ["tolerance", "housing crisis", "cycling"],
    scores: { pressure: 40, viability: 80, capability: 78, community: 72 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Progressive European benchmark that tests whether social openness survives housing unaffordability.",
    sentimentEmojis: ["🚲", "🌷", "🏠", "🌈", "😰"],
    metrics: {
      pppIncomePerHead: 38000,
      graduateHousingShare: 40,
      healthcare: { access: "Universal mandatory insurance", affordability: "Moderate cost", summary: "Good coverage but insurance costs and deductibles are rising." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Strong university system with affordable tuition for EU students." },
      experienceDiversity: 86,
    },
  },
  graz: {
    id: "graz",
    name: "Graz",
    country: "Austria",
    region: "Western, Northern, and Southern Europe",
    tagline: "Vienna's quality without Vienna's price.",
    signal: "UNESCO City of Design with six universities feeding a deep creative and tech economy. Rent is roughly half of Vienna, the old town is walkable in 20 minutes, and Styrian food culture means dinner is both excellent and affordable.",
    delta: 3,
    tags: ["design", "affordable", "university"],
    scores: { pressure: 68, viability: 82, capability: 78, community: 76 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Proof that second cities in high-quality countries deliver better daily life than their famous siblings.",
    sentimentEmojis: ["🎓", "🏔️", "🍷", "🎨", "😊"],
    metrics: {
      pppIncomePerHead: 34500,
      graduateHousingShare: 36,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Same Austrian system as Vienna with shorter queues." },
      education: { access: "Broad public access", affordability: "Free to low cost", summary: "Six universities for a city of 300K — unusual academic density." },
      experienceDiversity: 76,
    },
  },
  porto: {
    id: "porto",
    name: "Porto",
    country: "Portugal",
    region: "Western, Northern, and Southern Europe",
    tagline: "Old stone, new energy, still affordable.",
    signal: "Porto runs on creative migrants, cheap natural wine, and startups in converted factories. The riverside is UNESCO-listed, the food is extraordinary, and rent — while rising — is still a fraction of Lisbon.",
    delta: 2,
    tags: ["creative", "heritage", "wine"],
    scores: { pressure: 68, viability: 80, capability: 72, community: 82 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "European creative-class magnet showing how heritage and affordability coexist before gentrification arrives.",
    sentimentEmojis: ["🍷", "🌉", "🏗️", "🎶", "😋"],
    metrics: {
      pppIncomePerHead: 22800,
      graduateHousingShare: 30,
      healthcare: { access: "Universal public (SNS)", affordability: "Low cost", summary: "Free at point of use but wait times push many to affordable private clinics." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "University of Porto is well-ranked; tuition under €1,000/year for EU." },
      experienceDiversity: 82,
    },
  },
  braga: {
    id: "braga",
    name: "Braga",
    country: "Portugal",
    region: "Western, Northern, and Southern Europe",
    tagline: "Europe's youngest city that nobody talks about.",
    signal: "Median age under 38, a university that punches above its weight in tech, and rent under €500 for a central flat. Braga is the kind of city that digital nomads discover three years before the press.",
    delta: 4,
    tags: ["young", "tech", "affordable"],
    scores: { pressure: 74, viability: 82, capability: 72, community: 84 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Under-indexed European city showing youth, affordability, and quality of life outside capital cities.",
    sentimentEmojis: ["⛪", "💻", "🌊", "🍳", "😄"],
    metrics: {
      pppIncomePerHead: 20200,
      graduateHousingShare: 32,
      healthcare: { access: "Universal public (SNS)", affordability: "Low cost", summary: "Same Portuguese public system with less pressure than Lisbon." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "University of Minho has growing CS and engineering reputation." },
      experienceDiversity: 72,
    },
  },
  tallinn: {
    id: "tallinn",
    name: "Tallinn",
    country: "Estonia",
    region: "Western, Northern, and Southern Europe",
    tagline: "The world's most digital society, in a medieval shell.",
    signal: "Estonia built e-residency, digital voting, and paperless government before anyone else. Tallinn layers that on a preserved medieval old town, free public transport for residents, and startup density per capita rivalling Tel Aviv.",
    delta: 3,
    tags: ["digital", "startup", "medieval"],
    scores: { pressure: 76, viability: 84, capability: 82, community: 78 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Global benchmark for digital governance; proof that small-state innovation creates outsized livability.",
    sentimentEmojis: ["💻", "🏰", "🧖", "🌲", "😎"],
    metrics: {
      pppIncomePerHead: 28600,
      graduateHousingShare: 34,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Digital health records and universal coverage make routine care efficient." },
      education: { access: "Broad public access", affordability: "Free to low cost", summary: "Free university tuition for Estonian-language programs." },
      experienceDiversity: 70,
    },
  },
  krakow: {
    id: "krakow",
    name: "Kraków",
    country: "Poland",
    region: "Southern/Eastern Europe and Eurasia",
    tagline: "History, hustle, and still cheap enough to breathe.",
    signal: "Kraków has what Prague had 15 years ago — a stunning old town, deep university culture, and prices that let you live well on a local salary. The tech boom brought global companies but hasn't destroyed the character. Winter air quality is the honest cost.",
    delta: 2,
    tags: ["heritage", "tech", "affordable"],
    scores: { pressure: 80, viability: 82, capability: 82, community: 84 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Central European challenger showing how tech economy and heritage coexist with affordability.",
    sentimentEmojis: ["🏰", "💻", "🍺", "📚", "😊"],
    metrics: {
      pppIncomePerHead: 26400,
      graduateHousingShare: 36,
      healthcare: { access: "Universal public (NFZ)", affordability: "Low cost", summary: "Universal coverage through NFZ; growing private sector for those who want speed." },
      education: { access: "Broad public access", affordability: "Free to low cost", summary: "Jagiellonian University is one of Europe's oldest; 200K+ students for 800K population." },
      experienceDiversity: 80,
    },
  },
  budapest: {
    id: "budapest",
    name: "Budapest",
    country: "Hungary",
    region: "Southern/Eastern Europe and Eurasia",
    tagline: "Thermal baths, ruin bars, and a democracy question.",
    signal: "Budapest offers genuinely affordable, architecturally stunning city life with world-class public baths, vibrant nightlife, and Danube views for €600/month rent. But civic freedom scores reflect a tightening political environment that other indices politely ignore.",
    delta: 0,
    tags: ["thermal", "nightlife", "political tension"],
    scores: { pressure: 68, viability: 74, capability: 72, community: 72 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Tests whether lifestyle quality compensates for democratic erosion — a question SLIC takes seriously.",
    sentimentEmojis: ["♨️", "🌉", "🍷", "🎭", "🤔"],
    metrics: {
      pppIncomePerHead: 24200,
      graduateHousingShare: 34,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Universal coverage but underfunding means long waits; private sector growing." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Strong university tradition; medical schools attract international students." },
      experienceDiversity: 84,
    },
  },
  montreal: {
    id: "montreal",
    name: "Montréal",
    country: "Canada",
    region: "North America",
    tagline: "North America's most affordable creative hub.",
    signal: "Montréal is what happens when French and English cultures collide productively: artists can still afford studio space, comedians test material in two languages, and the food scene ranges from $4 bagels to Michelin-level. Housing is still affordable by North American standards.",
    delta: 3,
    tags: ["bilingual", "creative", "affordable"],
    scores: { pressure: 74, viability: 78, capability: 82, community: 86 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "North America's best-case for creative affordability; cultural richness without New York prices.",
    sentimentEmojis: ["🎭", "🥯", "❄️", "🎵", "😊"],
    metrics: {
      pppIncomePerHead: 36200,
      graduateHousingShare: 38,
      healthcare: { access: "Universal public (RAMQ)", affordability: "Free", summary: "Quebec's single-payer system means no bills for doctor visits or hospital stays." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "McGill and UdeM make this a dual-language academic powerhouse." },
      experienceDiversity: 90,
    },
  },
  pittsburgh: {
    id: "pittsburgh",
    name: "Pittsburgh",
    country: "United States",
    region: "North America",
    tagline: "The Rust Belt city that reinvented itself around bridges and brains.",
    signal: "Pittsburgh traded steel mills for robotics labs and medical research without losing its blue-collar soul. Carnegie Mellon anchors a tech economy that's genuinely affordable — a three-bedroom house costs what a San Francisco parking spot does.",
    delta: 3,
    tags: ["reinvention", "tech", "affordable"],
    scores: { pressure: 78, viability: 80, capability: 84, community: 80 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Best American example of post-industrial reinvention without pricing out the existing community.",
    sentimentEmojis: ["🌉", "🤖", "🏈", "🥟", "😤"],
    metrics: {
      pppIncomePerHead: 42000,
      graduateHousingShare: 34,
      healthcare: { access: "Mixed private-public", affordability: "High cost", summary: "UPMC is world-class but American insurance dynamics mean access depends on employer." },
      education: { access: "Broad access", affordability: "High cost", summary: "Carnegie Mellon and Pitt are globally ranked but tuition follows American norms." },
      experienceDiversity: 76,
    },
  },
  "chiang-mai": {
    id: "chiang-mai",
    name: "Chiang Mai",
    country: "Thailand",
    region: "Southeast Asia",
    tagline: "The world's digital nomad capital — before the term existed.",
    signal: "Chiang Mai invented the 'work from anywhere' lifestyle before co-working was a category. Excellent coffee, $2 street meals, fast fiber internet, and a Lanna cultural depth most visitors never discover. The burning season (Feb-Apr) is the honest cost.",
    delta: 4,
    tags: ["nomad", "culture", "affordable"],
    scores: { pressure: 82, viability: 72, capability: 66, community: 84 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Global benchmark for remote-work livability; secondary cities attracting global talent through affordability and culture.",
    sentimentEmojis: ["☕", "🏯", "💻", "🌿", "😊"],
    metrics: {
      pppIncomePerHead: 14200,
      graduateHousingShare: 22,
      healthcare: { access: "Broad mixed access", affordability: "Low cost", summary: "Private hospitals offer excellent care at a fraction of Western prices." },
      education: { access: "Broad public-private mix", affordability: "Low cost", summary: "Chiang Mai University anchors the city; international schools serve expat community." },
      experienceDiversity: 84,
    },
  },
  kuching: {
    id: "kuching",
    name: "Kuching",
    country: "Malaysia",
    region: "Southeast Asia",
    tagline: "Borneo's best-kept secret.",
    signal: "Kuching stays small enough to be walkable, diverse enough to serve laksa and kolo mee on the same street, and connected enough to Borneo's rainforest that wildlife is a weekend trip. The Sarawak government runs semi-autonomously, giving the city distinct civic character.",
    delta: 4,
    tags: ["nature", "food", "autonomous"],
    scores: { pressure: 78, viability: 76, capability: 66, community: 84 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Southeast Asia's strongest case for small-city livability.",
    sentimentEmojis: ["🐱", "🌴", "🍜", "🦎", "😄"],
    metrics: {
      pppIncomePerHead: 18600,
      graduateHousingShare: 26,
      healthcare: { access: "Broad mixed access", affordability: "Low cost", summary: "Government and private hospitals cover basics well." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "UNIMAS provides the university anchor." },
      experienceDiversity: 76,
    },
  },
  santiago: {
    id: "santiago",
    name: "Santiago",
    country: "Chile",
    region: "Latin America",
    tagline: "Latin America's most functional experiment.",
    signal: "Santiago is what happens when a South American capital gets the basics right: functioning metro, drinkable tap water, and a pension system that actually exists. The Andes backdrop is dramatic, the wine is world-class, and the startup scene is the continent's most mature.",
    delta: 1,
    tags: ["stability", "wine", "inequality"],
    scores: { pressure: 76, viability: 80, capability: 80, community: 78 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Latin America's governance benchmark showing what's possible when a developing economy prioritizes institutions.",
    sentimentEmojis: ["🏔️", "🍷", "🚇", "📊", "😐"],
    metrics: {
      pppIncomePerHead: 22600,
      graduateHousingShare: 32,
      healthcare: { access: "Mixed public-private", affordability: "Moderate cost", summary: "Dual system where quality tracks income." },
      education: { access: "Broad access", affordability: "Moderate to high cost", summary: "PUC and Universidad de Chile are regionally strong." },
      experienceDiversity: 78,
    },
  },
  montevideo: {
    id: "montevideo",
    name: "Montevideo",
    country: "Uruguay",
    region: "Latin America",
    tagline: "South America's quiet achiever.",
    signal: "Uruguay is the continent's most stable democracy, and Montevideo is its low-key capital: safe by regional standards, socially progressive, and with a rambla giving every resident access to the Río de la Plata. The economy is small and ambition may feel capped — but for those who value calm over growth, it delivers.",
    delta: 2,
    tags: ["stable", "progressive", "waterfront"],
    scores: { pressure: 64, viability: 76, capability: 70, community: 78 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Latin America's best case for democratic stability and social progressivism.",
    sentimentEmojis: ["🌊", "🧉", "🏛️", "🌈", "😌"],
    metrics: {
      pppIncomePerHead: 19800,
      graduateHousingShare: 30,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Public-private hybrid through mutualistas system; coverage is broad." },
      education: { access: "Broad public access", affordability: "Free", summary: "Universidad de la República is free and open-admission." },
      experienceDiversity: 72,
    },
  },
  medellin: {
    id: "medellin",
    name: "Medellín",
    country: "Colombia",
    region: "Latin America",
    tagline: "The transformation story that's still being written.",
    signal: "Medellín went from the world's murder capital to a design-award-winning city in 25 years. The cable cars connecting hillside comunas to the metro are engineering marvels with social purpose. The weather is eternal spring at 1,500m, and the cost of living is genuinely low.",
    delta: 2,
    tags: ["transformation", "design", "spring"],
    scores: { pressure: 72, viability: 66, capability: 64, community: 78 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Global benchmark for urban transformation; tests whether infrastructure investment permanently changes livability.",
    sentimentEmojis: ["🚡", "🌺", "🎨", "☕", "💪"],
    metrics: {
      pppIncomePerHead: 14600,
      graduateHousingShare: 28,
      healthcare: { access: "Broad mixed access", affordability: "Low cost", summary: "Colombia's EPS system provides universal coverage; some of the continent's best hospitals." },
      education: { access: "Broad public-private mix", affordability: "Low to moderate cost", summary: "EAFIT and Universidad de Antioquia anchor a growing sector." },
      experienceDiversity: 80,
    },
  },
  curitiba: {
    id: "curitiba",
    name: "Curitiba",
    country: "Brazil",
    region: "Latin America",
    tagline: "The city that invented bus rapid transit — and still uses it.",
    signal: "Curitiba wrote the textbook on sustainable urban planning in the 1970s and the BRT system inspired cities worldwide. It's Brazil's most European-feeling city with a quality of life that outperforms cities twice its GDP.",
    delta: 2,
    tags: ["planning", "transit", "green"],
    scores: { pressure: 70, viability: 72, capability: 68, community: 74 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Global urban planning benchmark; design-led infrastructure creates lasting livability dividends.",
    sentimentEmojis: ["🚌", "🌳", "🇧🇷", "♻️", "😊"],
    metrics: {
      pppIncomePerHead: 18200,
      graduateHousingShare: 30,
      healthcare: { access: "Universal public (SUS)", affordability: "Free", summary: "Brazil's SUS provides universal coverage; Curitiba's implementation is above average." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "UFPR and PUC-PR provide solid options; technical education is strong." },
      experienceDiversity: 74,
    },
  },
  kigali: {
    id: "kigali",
    name: "Kigali",
    country: "Rwanda",
    region: "Africa",
    tagline: "Africa's cleanest city, built on discipline and vision.",
    signal: "Kigali banned plastic bags in 2008, runs mandatory monthly community clean-up days, and has a murder rate lower than many European capitals. The transformation from 1994 is almost incomprehensible. The trade-off is political freedom — the discipline that created the cleanliness also limits dissent.",
    delta: 3,
    tags: ["clean", "discipline", "transformation"],
    scores: { pressure: 68, viability: 72, capability: 62, community: 70 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Africa's most dramatic urban transformation; challenges every assumption about 'developing world' cities.",
    sentimentEmojis: ["🌿", "🧹", "🏔️", "☕", "💪"],
    metrics: {
      pppIncomePerHead: 5800,
      graduateHousingShare: 24,
      healthcare: { access: "Broad community-based insurance", affordability: "Low cost", summary: "Mutuelle de Santé covers 90%+ of the population." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Compulsory and free through secondary; university options growing." },
      experienceDiversity: 62,
    },
  },
  "cape-town": {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    tagline: "Table Mountain views, with load-shedding and inequality.",
    signal: "Cape Town is physically one of the most beautiful cities on Earth. The creative scene is world-class. But it's the most unequal city in one of the most unequal countries: the distance from Camps Bay to Khayelitsha is 30 km and 30 years of development.",
    delta: -1,
    tags: ["scenic", "inequality", "creative"],
    scores: { pressure: 60, viability: 54, capability: 58, community: 64 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Africa's most visible city; tests how beauty and creative culture score against infrastructure and equality.",
    sentimentEmojis: ["⛰️", "🌊", "🎨", "⚡", "🤔"],
    metrics: {
      pppIncomePerHead: 16200,
      graduateHousingShare: 28,
      healthcare: { access: "Mixed public-private", affordability: "Moderate cost", summary: "Private healthcare is excellent; public system is under-resourced." },
      education: { access: "Mixed access", affordability: "Low to moderate cost", summary: "UCT is Africa's top-ranked university; public schooling varies by district." },
      experienceDiversity: 82,
    },
  },
  nairobi: {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    region: "Africa",
    tagline: "East Africa's tech hub — building tomorrow with today's infrastructure.",
    signal: "Nairobi invented mobile money (M-Pesa), hosts more tech startups than any other African city, and has a creative scene that punches above its GDP. The traffic is legendary, but the energy and ambition are unmistakable.",
    delta: 1,
    tags: ["tech", "M-Pesa", "ambition"],
    scores: { pressure: 64, viability: 52, capability: 58, community: 68 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "Africa's most important tech city; benchmark for digital innovation running ahead of physical infrastructure.",
    sentimentEmojis: ["📱", "🦁", "💻", "🚗", "💪"],
    metrics: {
      pppIncomePerHead: 8400,
      graduateHousingShare: 26,
      healthcare: { access: "Mixed public-private", affordability: "Low to moderate cost", summary: "Private hospitals serve professionals; NHIF provides basic coverage." },
      education: { access: "Broad public-private mix", affordability: "Low cost", summary: "University of Nairobi and Strathmore anchor growing sector." },
      experienceDiversity: 74,
    },
  },
  sapporo: {
    id: "sapporo",
    name: "Sapporo",
    country: "Japan",
    region: "East Asia",
    tagline: "Japan's snow city with a secret food scene.",
    signal: "Sapporo is where Hokkaido's dairy, seafood, and agriculture converge with Japanese urban precision. The ramen is Japan's best, housing is cheap for a city of 2 million, and the powder snow is legendary. Japan's most livable climate escape.",
    delta: 3,
    tags: ["food", "snow", "affordable"],
    scores: { pressure: 60, viability: 78, capability: 70, community: 70 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Japan's best affordable-livability proposition, tempered by aging demographics and economic stagnation.",
    sentimentEmojis: ["🍜", "❄️", "🍺", "🏔️", "😊"],
    metrics: {
      pppIncomePerHead: 28800,
      graduateHousingShare: 26,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "National health insurance with Japanese efficiency." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "Hokkaido University is a former Imperial university with strong research." },
      experienceDiversity: 78,
    },
  },
  taichung: {
    id: "taichung",
    name: "Taichung",
    country: "Taiwan",
    region: "East Asia",
    tagline: "Taiwan's livable middle — all the quality, half the pressure.",
    signal: "Taichung is where Taiwanese go when Taipei feels too compressed. The climate is milder, the housing is genuinely affordable, and the National Taichung Theater justifies the city's creative credentials. Bubble tea was arguably invented here.",
    delta: 3,
    tags: ["livable", "affordable", "creative"],
    scores: { pressure: 64, viability: 78, capability: 74, community: 76 },
    manifestStatus: "locked",
    cityType: "secondary",
    inclusionRationale: "Taiwan's second-city livability benchmark; national system quality translates outside the capital.",
    sentimentEmojis: ["🧋", "🏛️", "🌤️", "🛵", "😊"],
    metrics: {
      pppIncomePerHead: 32400,
      graduateHousingShare: 26,
      healthcare: { access: "Universal public access", affordability: "Low cost", summary: "Same Taiwanese NHI system with shorter queues." },
      education: { access: "Broad public access", affordability: "Low cost", summary: "National Chung Hsing University and Tunghai anchor solid education." },
      experienceDiversity: 82,
    },
  },
  bengaluru: {
    id: "bengaluru",
    name: "Bengaluru",
    country: "India",
    region: "South Asia",
    tagline: "India's tech garden city — where the traffic ate the gardens.",
    signal: "Bengaluru is India's Silicon Valley: Infosys, Wipro, and more unicorns than anywhere in Asia outside China. The climate at 900m elevation is India's most pleasant. But traffic is legendary — a 10 km commute can take 90 minutes. What you earn, you spend in time.",
    delta: 1,
    tags: ["tech", "traffic", "startups"],
    scores: { pressure: 68, viability: 52, capability: 66, community: 64 },
    manifestStatus: "locked",
    cityType: "primary",
    inclusionRationale: "India's tech economy benchmark; innovation growth outrunning infrastructure and ecology.",
    sentimentEmojis: ["💻", "🚗", "☕", "🌳", "😤"],
    metrics: {
      pppIncomePerHead: 14800,
      graduateHousingShare: 34,
      healthcare: { access: "Mixed public-private", affordability: "Low to moderate cost", summary: "Private hospitals are excellent and affordable by global standards." },
      education: { access: "Broad access", affordability: "Low to moderate cost", summary: "IISc and multiple engineering colleges create a deep tech talent pipeline." },
      experienceDiversity: 76,
    },
  },
};

function hashValue(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }
  return hash;
}


function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function capitalize(word: string): string {
  if (!word) {
    return word;
  }
  return word[0].toUpperCase() + word.slice(1);
}

function displayNameFromId(cityId: string): string {
  return cityId
    .split("-")
    .slice(1)
    .map(capitalize)
    .join(" ");
}

function parseCsv(raw: string): CityUniverseRow[] {
  const rows: string[][] = [];
  let current = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      if (current || currentRow.length > 0) {
        currentRow.push(current);
        rows.push(currentRow);
        currentRow = [];
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current || currentRow.length > 0) {
    currentRow.push(current);
    rows.push(currentRow);
  }

  const [headerRow, ...bodyRows] = rows;
  return bodyRows.map((row) => {
    const record = Object.fromEntries(headerRow.map((header, index) => [header, row[index] ?? ""]));
    return {
      city_id: record.city_id,
      cohort: record.cohort,
      manifest_status: record.manifest_status === "locked" ? "locked" : "provisional",
      city_type: record.city_type === "primary" ? "primary" : "secondary",
      country: record.country,
      inclusion_rationale: record.inclusion_rationale,
    };
  });
}

function generatedAccessProfile(
  base: CityAccessProfile,
  affordabilityBias = 0,
): CityAccessProfile {
  let affordability = base.affordability;
  if (affordabilityBias > 0) {
    affordability = "Low to moderate cost";
  }

  return {
    access: base.access,
    affordability,
    summary: base.summary,
  };
}

function generatedMetrics(row: CityUniverseRow, profile: RegionProfile): CityLifeMetrics {
  const income = profile.pppIncomePerHead;
  const housing = profile.graduateHousingShare;
  const diversity = profile.experienceDiversity;

  return {
    pppIncomePerHead: income,
    graduateHousingShare: housing,
    healthcare: generatedAccessProfile(
      profile.healthcare,
      row.city_type === "primary" ? 0.05 : 0,
    ),
    education: generatedAccessProfile(
      profile.education,
      row.city_type === "primary" ? 0.04 : 0,
    ),
    experienceDiversity: diversity,
  };
}

// ---------------------------------------------------------------------------
// V3 Indicator Data Store
// ---------------------------------------------------------------------------
// Maps city_id → raw indicator values for each pillar (7 per pillar).
// null = missing. As data pipelines populate this, cities automatically
// switch from region-profile defaults to engine-computed absolute scores.
//
// Order must match the anchor arrays in scoringEngine.ts:
//   Growth:     [G1 GDP growth, G2 startups/100k, G3 VC$/cap, G4 biz ease, G5 civic freedom, G6 patents/100k, G7 high-skill %]
//   Viability:  [V1 homicide/100k, V2 PM2.5, V3 HAQ, V4 DI_PPP $/mo, V5 rent%, V6 water%, V7 peace(GPI→score), V8 birth rate]
//   Capability: [C1 transit%, C2 internet Mbps, C3 digital gov, C4 PISA, C5 walkability, C6 cycling km/100k, C7 renewables%]
//   Community:  [O1 LGBTQ+, O2 relig freedom(GRI→score), O3 immigrant gap, O4 Gini, O5 trust%, O6 gender(GII→score), O7 weekend ratio]
//   Creative:   [R1 venues/100k, R2 UNESCO, R3 cuisines/100k, R4 nightlife/100k, R5 arts$/cap, R6 creative%, R7 events/M]

function generatedScores(row: CityUniverseRow, profile: RegionProfile): RankedCity["scores"] {
  // Region profile defaults — scaffold scores for non-published cities
  const typeAdjustment = row.city_type === "primary" ? 1.5 : 0;
  const lockAdjustment = row.manifest_status === "locked" ? 0.8 : -0.6;
  const pressure = clamp(
    Math.round(profile.pressure + typeAdjustment),
    50,
    81,
  );
  const viability = clamp(
    Math.round(profile.viability + lockAdjustment),
    48,
    81,
  );
  const capability = clamp(
    Math.round(profile.capability + lockAdjustment * 0.5),
    48,
    81,
  );
  const community = clamp(
    Math.round(profile.community),
    50,
    83,
  );
  const creative = clamp(
    Math.round(profile.creative + typeAdjustment + lockAdjustment),
    48,
    86,
  );
  const slic = Math.round(
    pressure * 0.25 + viability * 0.22 + capability * 0.18 +
    community * 0.15 + creative * 0.20,
  );
  return { slic, pressure, viability, capability, community, creative };
}

function generatedTags(row: CityUniverseRow, profile: RegionProfile): string[] {
  const generated = [...profile.tags];
  if (row.city_type === "secondary") {
    generated.unshift("secondary city");
  }
  if (row.manifest_status === "provisional") {
    generated.push("watchlist");
  }
  return generated.slice(0, 3);
}

function generatedTagline(row: CityUniverseRow): string {
  if (row.city_type === "secondary") {
    return "A challenger city worth measuring on lived outcomes, not prestige alone.";
  }
  return "A major urban benchmark tested against cost, pressure, and human possibility.";
}

const regionEmojiPools: Record<string, string[]> = {
  "Southeast Asia": ["🍜", "🛕", "🌴", "🛺", "🌙", "🏖️", "😊", "🥰", "😋", "🌿"],
  "East Asia": ["🚇", "🍜", "🌸", "🏯", "💡", "🎌", "😊", "😌", "🏙️", "🎎"],
  "South Asia": ["🕌", "🍛", "🚂", "🎭", "🌺", "😤", "💪", "🏗️", "🎶", "🙏"],
  "Western, Northern, and Southern Europe": ["🏰", "🚲", "🎭", "☕", "🌧️", "😊", "🏛️", "🌿", "🎵", "📚"],
  "Southern/Eastern Europe and Eurasia": ["🏛️", "🍷", "☀️", "🎶", "🌊", "😌", "🏰", "🎨", "🍕", "💃"],
  "North America": ["🏙️", "🚗", "🌮", "💻", "🏈", "😤", "🌆", "☕", "🎸", "🌳"],
  "Latin America": ["💃", "🎶", "🌮", "⚽", "🌴", "🥰", "🎭", "🌺", "🏖️", "🎉"],
  "Middle East": ["🕌", "☀️", "🏗️", "🌴", "✈️", "😤", "🏙️", "🍵", "🎨", "💎"],
  Africa: ["🌍", "🎶", "☀️", "🏗️", "🌺", "💪", "🏙️", "🌴", "🎭", "🙏"],
  Oceania: ["🌿", "⛵", "🏔️", "☀️", "🏖️", "😊", "🐨", "🌊", "☕", "🌳"],
};

function generatedSentimentEmojis(row: CityUniverseRow): string[] {
  const pool = regionEmojiPools[row.cohort] ?? regionEmojiPools["Southeast Asia"];
  const startIndex = hashValue(`${row.city_id}-emoji`) % (pool.length - 4);
  return pool.slice(startIndex, startIndex + 5);
}

function generatedSignal(row: CityUniverseRow): string {
  if (row.city_type === "secondary") {
    return "Secondary-city scale and regional relevance make it a useful SLIC counterpoint to over-ranked capitals.";
  }
  return "Its scale and visibility make it a necessary benchmark, but SLIC still forces it through the same affordability and quality-of-life filter.";
}

function screenProfileForCity(row: CityUniverseRow, cityId: string): CityScreenProfile {
  const base = regionScreenProfiles[row.cohort] ?? regionScreenProfiles["Southeast Asia"];
  const override = cityScreenOverrides[cityId] ?? {};

  const safety = clamp(
    Math.round(override.safety ?? base.safety),
    30,
    96,
  );
  const affordability = clamp(
    Math.round(override.affordability ?? base.affordability),
    22,
    96,
  );
  const equality = clamp(
    Math.round(override.equality ?? base.equality),
    20,
    92,
  );
  const civicFreedom = clamp(
    Math.round(override.civicFreedom ?? base.civicFreedom),
    18,
    92,
  );
  const ecology = clamp(
    Math.round(override.ecology ?? base.ecology),
    18,
    94,
  );
  const crowding = clamp(
    Math.round(override.crowding ?? base.crowding),
    18,
    94,
  );

  return { safety, affordability, equality, civicFreedom, ecology, crowding };
}

function effectiveTaxRate(country: string): number {
  return countryTaxAssumptions[country] ?? 0.18;
}

function disposableIncomeEstimate(metrics: CityLifeMetrics, country: string): number {
  const effectiveTax = effectiveTaxRate(country);
  const postTaxIncome = metrics.pppIncomePerHead * (1 - effectiveTax);
  return Math.round(postTaxIncome * (1 - metrics.graduateHousingShare / 100));
}

function disposableIncomeStrength(metrics: CityLifeMetrics, country: string): number {
  return clamp(Math.round(disposableIncomeEstimate(metrics, country) / 280), 24, 96);
}

function taxCompetitiveness(country: string): number {
  return clamp(Math.round(100 - effectiveTaxRate(country) * 180), 26, 96);
}

function baseCreativeScore(
  city: CityOverride,
  row: CityUniverseRow,
  profile: CityScreenProfile,
): number {
  const seeded =
    "creative" in city.scores && typeof city.scores.creative === "number"
      ? city.scores.creative
      : Math.round(
          city.scores.pressure * 0.52 +
            city.scores.viability * 0.14 +
            city.scores.community * 0.14 +
            (regionProfiles[row.cohort]?.creative ?? 70) * 0.2,
        );

  return clamp(
    Math.round(
      seeded +
        (profile.civicFreedom - 68) / 5 +
        (profile.safety - 72) / 12 -
        (profile.crowding - 58) / 12,
    ),
    24,
    96,
  );
}

function screeningPenalty(profile: CityScreenProfile, roomToLiveStrength: number): number {
  let penalty = 0;

  if (profile.safety < 55) {
    penalty -= 14;
  } else if (profile.safety < 65) {
    penalty -= 7;
  } else if (profile.safety > 85) {
    penalty += 2;
  }

  if (roomToLiveStrength < 45) {
    penalty -= 12;
  } else if (roomToLiveStrength < 58) {
    penalty -= 6;
  } else if (roomToLiveStrength > 78) {
    penalty += 2;
  }

  if (profile.equality < 45) {
    penalty -= 8;
  } else if (profile.equality < 60) {
    penalty -= 3;
  }

  if (profile.civicFreedom < 40) {
    penalty -= 12;
  } else if (profile.civicFreedom < 55) {
    penalty -= 6;
  } else if (profile.civicFreedom > 80) {
    penalty += 1;
  }

  if (profile.ecology < 45) {
    penalty -= 10;
  } else if (profile.ecology < 58) {
    penalty -= 4;
  } else if (profile.ecology > 82) {
    penalty += 1;
  }

  if (profile.crowding > 78) {
    penalty -= 8;
  } else if (profile.crowding > 68) {
    penalty -= 4;
  } else if (profile.crowding < 46) {
    penalty += 1;
  }

  // Extensively penalize low priority traits
  if ((profile.hygiene ?? 70) < 50) penalty -= 12;
  if ((profile.climate ?? 70) < 40) penalty -= 12; // too cold
  if ((profile.roadSafety ?? 70) < 50) penalty -= 8;
  if ((profile.foodCulture ?? 70) < 50) penalty -= 6;
  if ((profile.boringIndex ?? 50) > 80) penalty -= 12;
  if ((profile.flatExperience ?? 50) > 80) penalty -= 10;
  if ((profile.taxReturn ?? 70) < 50) penalty -= 8;
  if ((profile.healthcareCost ?? 50) > 80) penalty -= 15;
  if ((profile.religiousViolence ?? 10) > 40) penalty -= 20;
  if ((profile.housingPriceIndex ?? 50) > 90) penalty -= 12;

  // Growth stagnation: retirement homes, aging economies, no domestic consumption
  const growth = profile.growthMomentum ?? 55;
  if (growth < 30) penalty -= 14;
  else if (growth < 42) penalty -= 8;
  else if (growth < 52) penalty -= 4;
  else if (growth > 75) penalty += 3;

  // Tolerance: anti-LGBTQ, ethnic discrimination, religious intolerance
  const tolerance = profile.toleranceOpenness ?? 65;
  if (tolerance < 30) penalty -= 14;
  else if (tolerance < 45) penalty -= 8;
  else if (tolerance < 55) penalty -= 4;

  // Green space deficit: concrete deserts, no parks
  if ((profile.greenSpaceDeficit ?? 40) > 75) penalty -= 6;

  return penalty;
}

function screeningTag(profile: CityScreenProfile, roomToLiveStrength: number): string {
  if ((profile.religiousViolence ?? 10) > 40) return "religious violence";
  if ((profile.hygiene ?? 70) < 50) return "unhygienic";
  if ((profile.climate ?? 70) < 40) return "too cold";
  if ((profile.housingPriceIndex ?? 50) > 95) return "unsustainable housing";
  if ((profile.healthcareCost ?? 50) > 85) return "expensive healthcare";
  if ((profile.growthMomentum ?? 55) < 30) return "stagnant economy";
  if ((profile.boringIndex ?? 50) > 85) return "retirement home";
  if ((profile.boringIndex ?? 50) > 70) return "low dynamism";
  if ((profile.toleranceOpenness ?? 65) < 35) return "intolerant atmosphere";
  if ((profile.flatExperience ?? 50) > 85) return "flat experience";
  if ((profile.taxReturn ?? 70) < 50) return "poor tax return";

  if (profile.civicFreedom < 45) {
    return "coercive atmosphere";
  }
  if (profile.safety < 60) {
    return "safety pressure";
  }
  if (profile.ecology < 50) {
    return "pollution stress";
  }
  if (profile.crowding > 74) {
    return "crowding pressure";
  }
  if (roomToLiveStrength < 50) {
    return "cost burden";
  }
  if (profile.equality < 48) {
    return "high inequality";
  }
  if (roomToLiveStrength > 78) {
    return "strong value";
  }
  if (profile.safety > 85) {
    return "high safety";
  }
  return "balanced fit";
}

function screeningSignal(
  city: CityOverride,
  profile: CityScreenProfile,
  roomToLiveStrength: number,
): string {
  if (profile.safety < 60) {
    return "This city stays in the field for comparison, but its safety confidence is too weak for the featured public board.";
  }

  if (profile.civicFreedom < 45) {
    return "Operational strength is visible, but the coercive civic atmosphere is strong enough to drag the city down in SLIC.";
  }

  if (profile.ecology < 50) {
    return "The city has energy, but environmental pressure and air-quality drag keep it below the featured board.";
  }

  if (profile.crowding > 74) {
    return "The city remains relevant, but crowding and visitor-pressure drag are eroding day-to-day livability.";
  }

  if (roomToLiveStrength < 50) {
    return "Headline income is weakened by tax and housing drag, so real disposable room to live remains thin.";
  }

  return city.signal;
}

function socialListeningTrend(delta: number, profile: CityScreenProfile): number[] {
  const points: number[] = [];
  let current = clamp(
    Math.round(50 + delta * 2 + (profile.safety - 70) / 4 + (profile.ecology - 60) / 5 - (profile.crowding - 58) / 6),
    24,
    86,
  );

  for (let index = 0; index < 8; index += 1) {
    if (index === 7 && delta !== 0) {
        current = clamp(Math.round(current + delta), 18, 94);
    }
    points.push(current);
  }

  return points;
}

function socialListeningTopics(
  city: CityOverride,
  profile: CityScreenProfile,
): string[] {
  const topics: string[] = [];

  if (city.metrics.graduateHousingShare <= 26) {
    topics.push("value");
  } else if (city.metrics.graduateHousingShare >= 34) {
    topics.push("rents");
  }

  if (profile.ecology < 55) {
    topics.push("air");
  } else if (profile.ecology > 78) {
    topics.push("clean streets");
  }

  if (profile.crowding > 70) {
    topics.push("crowding");
  }

  if (city.scores.pressure >= 86) {
    topics.push("jobs");
  }

  if ((city.scores.creative ?? 0) >= 82) {
    topics.push("business");
  }

  if (city.scores.community >= 86) {
    topics.push("culture");
  }

  if (profile.safety >= 84) {
    topics.push("safety");
  }

  if (city.tags.includes("hospitality")) {
    topics.push("hospitality");
  }

  if (city.tags.includes("startup") || city.tags.includes("innovation")) {
    topics.push("innovation");
  }

  return [...new Set(topics)].slice(0, 3);
}

function recalibrateCity(
  city: CityOverride,
  row: CityUniverseRow,
): Omit<FullRankedCity, "globalRank"> {
  const profile = screenProfileForCity(row, city.id);
  const accent = accentForCity(city, row);
  const disposableStrength = disposableIncomeStrength(city.metrics, city.country);
  const disposableIncome = disposableIncomeEstimate(city.metrics, city.country);
  const taxScore = taxCompetitiveness(city.country);
  const roomToLiveStrength = Math.round((profile.affordability + disposableStrength) / 2);
  const cultureStrength = city.metrics.experienceDiversity;

  // === Growth (25%): economic dynamism, opportunity, career trajectory ===
  // NOT affordability — Growth rewards cities where economies are active
  // and opportunity is real, regardless of cost level.
  // Affordability is captured separately via roomToLiveStrength screening.
  const pressure = clamp(
    Math.round(
      city.scores.pressure +
        (profile.civicFreedom - 68) / 4 +
        (cultureStrength - 76) / 5 +
        (profile.crowding - 50) / 12 +
        (disposableStrength - 60) / 8,
    ),
    24,
    97,
  );

  // === Viability (22%): safety, transit, clean air, water, digital ===
  const viability = clamp(
    Math.round(
      city.scores.viability +
        (profile.safety - 75) / 4 +
        (profile.ecology - 64) / 3 -
        (profile.crowding - 58) / 9 +
        (profile.civicFreedom - 70) / 12,
    ),
    28,
    97,
  );

  // === Capability (18%): healthcare, education, equal opportunity ===
  const capability = clamp(
    Math.round(
      city.scores.capability +
        (profile.equality - 60) / 5 +
        (profile.safety - 70) / 10 +
        (profile.civicFreedom - 68) / 8,
    ),
    24,
    97,
  );

  // === Community (15%): hospitality, tolerance, culture ===
  const community = clamp(
    Math.round(
      city.scores.community +
        (profile.equality - 60) / 8 +
        (profile.civicFreedom - 68) / 5 +
        (profile.safety - 70) / 10 +
        (cultureStrength - 76) / 3 -
        (profile.crowding - 58) / 10,
    ),
    24,
    97,
  );

  // === Creative (20%): entrepreneurship, innovation, investment, admin friction ===
  const creativeBase = baseCreativeScore(city, row, profile);
  const businessOpeningEase = clamp(
    Math.round(creativeBase + (profile.civicFreedom - 68) / 4 - (profile.crowding - 58) / 10),
    22,
    97,
  );
  const governmentStability = clamp(
    Math.round(profile.safety * 0.35 + profile.civicFreedom * 0.4 + pressure * 0.25),
    20,
    96,
  );
  const incentiveReadiness = clamp(
    Math.round(businessOpeningEase * 0.42 + governmentStability * 0.28 + taxScore * 0.3),
    20,
    97,
  );
  const creative = clamp(
    Math.round(
      creativeBase * 0.3 +
        businessOpeningEase * 0.24 +
        governmentStability * 0.2 +
        taxScore * 0.16 +
        incentiveReadiness * 0.1,
    ),
    24,
    97,
  );

  const tolerance = clamp(
    Math.round(profile.civicFreedom * 0.5 + profile.equality * 0.28 + cultureStrength * 0.22),
    20,
    97,
  );

  // === Official SLIC composite: 0.25P + 0.22V + 0.18Ca + 0.15Co + 0.20Cr ===
  const slicBase = Math.round(
    pressure * 0.25 + viability * 0.22 + capability * 0.18 +
    community * 0.15 + creative * 0.20,
  );
  const slic = clamp(slicBase + screeningPenalty(profile, roomToLiveStrength), 18, 97);

  const existingTags = city.tags.filter((tag) => tag !== "watchlist");
  const screenTag = screeningTag(profile, roomToLiveStrength);
  const tags = [...new Set([screenTag, ...existingTags])].slice(0, 3);
  const coreBoardEligible =
    row.manifest_status === "locked" &&
    profile.safety >= 62 &&
    roomToLiveStrength >= 52 &&
    profile.civicFreedom >= 45 &&
    profile.ecology >= 50 &&
    profile.crowding <= 80 &&
    slic >= 60;

  return {
    ...city,
    tierLabel: null,
    tierSlot: null,
    accentHex: accent.accentHex,
    accentSoftHex: accent.accentSoftHex,
    accentLabel: accent.accentLabel,
    signal: screeningSignal(city, profile, roomToLiveStrength),
    tags,
    scores: { slic, pressure, viability, capability, community, creative },
    metrics: {
      ...city.metrics,
      pppDisposableIncome: disposableIncome,
      ecologyScore: profile.ecology,
      crowdingPressure: profile.crowding,
      conversationTrend: socialListeningTrend(city.delta, profile),
      conversationTopics: socialListeningTopics(city, profile),
      safetyConfidence: profile.safety,
      affordabilityStrength: roomToLiveStrength,
      equalityStrength: profile.equality,
      civicFreedom: profile.civicFreedom,
      businessGrowth: creative,
      safetyScore: profile.safety,
      toleranceScore: tolerance,
      businessOpeningEase,
      governmentStability,
      taxCompetitiveness: taxScore,
      incentiveReadiness,
    },
    coreBoardEligible,
  };
}

const parsedCityUniverse = parseCsv(cityUniverseCsv);

function cityScaffoldForRow(row: CityUniverseRow): CityOverride {
  const override = topCityOverrides[row.city_id.replace(/^[a-z]{2}-/, "")];
  if (override) {
    return override;
  }

  const profile = regionProfiles[row.cohort] ?? regionProfiles["Southeast Asia"];
  return {
    id: row.city_id.replace(/^[a-z]{2}-/, ""),
    name: displayNameFromId(row.city_id),
    country: row.country,
    region: row.cohort,
    tagline: generatedTagline(row),
    signal: generatedSignal(row),
    delta: 0,
    tags: generatedTags(row, profile),
    scores: generatedScores(row, profile),
    sentimentEmojis: generatedSentimentEmojis(row),
    manifestStatus: row.manifest_status,
    cityType: row.city_type,
    inclusionRationale: row.inclusion_rationale,
    metrics: generatedMetrics(row, profile),
  };
}

function numericScore(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function roundPublishedScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildPublishedGlobalRankings(): FullRankedCity[] {
  const rowsByCityId = new Map(parsedCityUniverse.map((row) => [row.city_id, row]));
  const cities: FullRankedCity[] = [];

  for (const publishedRow of rankingPublication.cities) {
    const row = rowsByCityId.get(publishedRow.cityId);
    if (!row) {
      continue;
    }

    const scaffold = cityScaffoldForRow(row);
    const accent = accentForCity(scaffold, row);

    // Direct 1:1 mapping from verified SLIC pillars
    const pressure = numericScore(publishedRow.pressureScore)
      ? roundPublishedScore(publishedRow.pressureScore)
      : scaffold.scores.pressure;
    const viability = numericScore(publishedRow.viabilityScore)
      ? roundPublishedScore(publishedRow.viabilityScore)
      : scaffold.scores.viability;
    const capability = numericScore(publishedRow.capabilityScore)
      ? roundPublishedScore(publishedRow.capabilityScore)
      : scaffold.scores.capability;
    const community = numericScore(publishedRow.communityScore)
      ? roundPublishedScore(publishedRow.communityScore)
      : scaffold.scores.community;
    const creative = numericScore(publishedRow.creativeScore)
      ? roundPublishedScore(publishedRow.creativeScore)
      : (scaffold.scores.creative ?? scaffold.scores.pressure);
    const slic = numericScore(publishedRow.slicScore)
      ? roundPublishedScore(publishedRow.slicScore)
      : Math.round(pressure * 0.25 + viability * 0.22 + capability * 0.18 + community * 0.15 + creative * 0.20);

    cities.push({
      ...scaffold,
      globalRank: publishedRow.rank,
      tierLabel: publishedRow.tierLabel ?? null,
      tierSlot: publishedRow.tierSlot ?? null,
      tierReason: publishedRow.tierReason ?? null,
      slicScoreExact: publishedRow.slicScoreExact ?? null,
      pressureScoreExact: publishedRow.pressureScoreExact ?? null,
      viabilityScoreExact: publishedRow.viabilityScoreExact ?? null,
      capabilityScoreExact: publishedRow.capabilityScoreExact ?? null,
      communityScoreExact: publishedRow.communityScoreExact ?? null,
      creativeScoreExact: publishedRow.creativeScoreExact ?? null,
      coreBoardEligible: row.manifest_status === "locked",
      accentHex: accent.accentHex,
      accentSoftHex: accent.accentSoftHex,
      accentLabel: accent.accentLabel,
      scores: { slic, pressure, viability, capability, community, creative },
      metrics: {
        ...scaffold.metrics,
        safetyConfidence: viability,
        affordabilityStrength: pressure,
        equalityStrength: capability,
        businessGrowth: creative,
        safetyScore: viability,
        toleranceScore: community,
        businessOpeningEase: creative,
        governmentStability: creative,
        incentiveReadiness: creative,
      },
      signal: rankingPublication.publishable
        ? scaffold.signal
        : "Verified-data rerank preview from the source-backed SLIC export.",
    });
  }

  return cities.sort((left, right) => {
    const rankDelta = left.globalRank - right.globalRank;
    if (rankDelta !== 0) {
      return rankDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

// NOTE: A previous synthetic-ranking factory (`buildGlobalRankings`) was deleted
// because it produced ranks that diverged from publishedRankingData.json — that
// is what caused city ranks to differ between pages (Tallinn, Perth, Bangkok all
// jumped). The published JSON is now the single source of truth.

export const globalRankings: FullRankedCity[] =
  rankingPublication.cities.length > 0 ? buildPublishedGlobalRankings() : [];

// Exercise must use the same data as the published rankings to ensure
// every page (HomePage, RankingsPage, CompareRankingsPage, CityScorecardPage,
// SideBySidePage) displays the SAME rank and score for every city.
// Previously this used buildGlobalRankings() — a synthetic 353-city ranking
// that produced different scores from publishedRankingData.json, causing
// visible rank inconsistencies (e.g. Tallinn ranking differently per page).
const exerciseCities: FullRankedCity[] = [...globalRankings];

export type RankingScope = "core" | "field";

export function getExerciseCities(): FullRankedCity[] {
  return [...exerciseCities];
}

export const exerciseRegions = ["All", ...new Set(exerciseCities.map((city) => city.region))];

export function getRankingsBoard({
  mode = "slic",
  region = "All",
  scope = "field",
}: {
  mode?: keyof RankedCity["scores"];
  region?: string;
  scope?: RankingScope;
} = {}): FullRankedCity[] {
  const scopedRows =
    scope === "core"
      ? globalRankings.filter((city) => city.coreBoardEligible)
      : globalRankings;
  const rows = region === "All" ? scopedRows : scopedRows.filter((city) => city.region === region);

  return [...rows].sort((left, right) => {
    const scoreDelta = right.scores[mode] - left.scores[mode];
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    const liveDelta = right.delta - left.delta;
    if (liveDelta !== 0) {
      return liveDelta;
    }

    return left.globalRank - right.globalRank;
  });
}

export const rankingRegions = ["All", ...new Set(globalRankings.map((city) => city.region))];
