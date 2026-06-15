/* ═══════ Compare Rankings — data + editorial copy ═══════ */
import type { Locale } from "./types";
import { compareTranslations } from "./compareRankingsTranslations";

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
  focus: Record<Locale, string>;
  topCities: IndexCity[];
  methodology: {
    claimedPurpose: Record<Locale, string>;
    actualMeasure: Record<Locale, string>;
    categories: Record<Locale, string[]>;
    dataInputs: Record<Locale, string[]>;
    blindSpots: Record<Locale, string[]>;
    audienceNote: Record<Locale, string>;
  };
  critique: {
    headline: Record<Locale, string>;
    body: Record<Locale, string>;
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
    focus: compareTranslations["eiu"].focus,
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
      claimedPurpose: compareTranslations["eiu"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["eiu"].methodology.actualMeasure,
      categories: compareTranslations["eiu"].methodology.categories,
      dataInputs: compareTranslations["eiu"].methodology.dataInputs,
      blindSpots: compareTranslations["eiu"].methodology.blindSpots,
      audienceNote: compareTranslations["eiu"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["eiu"].critique.headline,
      body: compareTranslations["eiu"].critique.body,
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
    focus: compareTranslations["mercer"].focus,
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
      claimedPurpose: compareTranslations["mercer"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["mercer"].methodology.actualMeasure,
      categories: compareTranslations["mercer"].methodology.categories,
      dataInputs: compareTranslations["mercer"].methodology.dataInputs,
      blindSpots: compareTranslations["mercer"].methodology.blindSpots,
      audienceNote: compareTranslations["mercer"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["mercer"].critique.headline,
      body: compareTranslations["mercer"].critique.body,
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
    focus: compareTranslations["resonance"].focus,
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
      claimedPurpose: compareTranslations["resonance"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["resonance"].methodology.actualMeasure,
      categories: compareTranslations["resonance"].methodology.categories,
      dataInputs: compareTranslations["resonance"].methodology.dataInputs,
      blindSpots: compareTranslations["resonance"].methodology.blindSpots,
      audienceNote: compareTranslations["resonance"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["resonance"].critique.headline,
      body: compareTranslations["resonance"].critique.body,
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
    focus: compareTranslations["monocle"].focus,
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
      claimedPurpose: compareTranslations["monocle"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["monocle"].methodology.actualMeasure,
      categories: compareTranslations["monocle"].methodology.categories,
      dataInputs: compareTranslations["monocle"].methodology.dataInputs,
      blindSpots: compareTranslations["monocle"].methodology.blindSpots,
      audienceNote: compareTranslations["monocle"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["monocle"].critique.headline,
      body: compareTranslations["monocle"].critique.body,
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
    focus: compareTranslations["yonsei"].focus,
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
      claimedPurpose: compareTranslations["yonsei"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["yonsei"].methodology.actualMeasure,
      categories: compareTranslations["yonsei"].methodology.categories,
      dataInputs: compareTranslations["yonsei"].methodology.dataInputs,
      blindSpots: compareTranslations["yonsei"].methodology.blindSpots,
      audienceNote: compareTranslations["yonsei"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["yonsei"].critique.headline,
      body: compareTranslations["yonsei"].critique.body,
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
    focus: compareTranslations["imd"].focus,
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
      claimedPurpose: compareTranslations["imd"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["imd"].methodology.actualMeasure,
      categories: compareTranslations["imd"].methodology.categories,
      dataInputs: compareTranslations["imd"].methodology.dataInputs,
      blindSpots: compareTranslations["imd"].methodology.blindSpots,
      audienceNote: compareTranslations["imd"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["imd"].critique.headline,
      body: compareTranslations["imd"].critique.body,
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
    focus: compareTranslations["mori"].focus,
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
      claimedPurpose: compareTranslations["mori"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["mori"].methodology.actualMeasure,
      categories: compareTranslations["mori"].methodology.categories,
      dataInputs: compareTranslations["mori"].methodology.dataInputs,
      blindSpots: compareTranslations["mori"].methodology.blindSpots,
      audienceNote: compareTranslations["mori"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["mori"].critique.headline,
      body: compareTranslations["mori"].critique.body,
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
    focus: compareTranslations["oxford"].focus,
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
      claimedPurpose: compareTranslations["oxford"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["oxford"].methodology.actualMeasure,
      categories: compareTranslations["oxford"].methodology.categories,
      dataInputs: compareTranslations["oxford"].methodology.dataInputs,
      blindSpots: compareTranslations["oxford"].methodology.blindSpots,
      audienceNote: compareTranslations["oxford"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["oxford"].critique.headline,
      body: compareTranslations["oxford"].critique.body,
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
    focus: compareTranslations["hanke"].focus,
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
      claimedPurpose: compareTranslations["hanke"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["hanke"].methodology.actualMeasure,
      categories: compareTranslations["hanke"].methodology.categories,
      dataInputs: compareTranslations["hanke"].methodology.dataInputs,
      blindSpots: compareTranslations["hanke"].methodology.blindSpots,
      audienceNote: compareTranslations["hanke"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["hanke"].critique.headline,
      body: compareTranslations["hanke"].critique.body,
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
    focus: compareTranslations["slic-soft-power"].focus,
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
      claimedPurpose: compareTranslations["slic-soft-power"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["slic-soft-power"].methodology.actualMeasure,
      categories: compareTranslations["slic-soft-power"].methodology.categories,
      dataInputs: compareTranslations["slic-soft-power"].methodology.dataInputs,
      blindSpots: compareTranslations["slic-soft-power"].methodology.blindSpots,
      audienceNote: compareTranslations["slic-soft-power"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["slic-soft-power"].critique.headline,
      body: compareTranslations["slic-soft-power"].critique.body,
    },
  },
  /* ── 11. Happy City Index 2026 ── */
  {
    id: "happy-city",
    name: "Happy City Index",
    shortName: "Happy City",
    publisher: "Happy City Initiative · Copenhagenize / Visual Capitalist data",
    year: 2026,
    citiesEvaluated: 400,
    accentHex: "#e8a020",
    focus: compareTranslations["happy-city"].focus,
    topCities: [
      { rank: 1, city: "Copenhagen", country: "Denmark", score: "6,954" },
      { rank: 2, city: "Helsinki", country: "Finland", score: "6,919" },
      { rank: 3, city: "Geneva", country: "Switzerland", score: "6,882" },
      { rank: 4, city: "Uppsala", country: "Sweden", score: "6,848" },
      { rank: 5, city: "Tokyo", country: "Japan", score: "6,788" },
      { rank: 6, city: "Trondheim", country: "Norway", score: "6,755" },
      { rank: 7, city: "Bern", country: "Switzerland", score: "6,746" },
      { rank: 8, city: "Malmö", country: "Sweden", score: "6,705" },
      { rank: 9, city: "Munich", country: "Germany", score: "6,691" },
      { rank: 10, city: "Aarhus", country: "Denmark", score: "6,665" },
    ],
    methodology: {
      claimedPurpose: compareTranslations["happy-city"].methodology.claimedPurpose,
      actualMeasure: compareTranslations["happy-city"].methodology.actualMeasure,
      categories: compareTranslations["happy-city"].methodology.categories,
      dataInputs: compareTranslations["happy-city"].methodology.dataInputs,
      blindSpots: compareTranslations["happy-city"].methodology.blindSpots,
      audienceNote: compareTranslations["happy-city"].methodology.audienceNote,
    },
    critique: {
      headline: compareTranslations["happy-city"].critique.headline,
      body: compareTranslations["happy-city"].critique.body,
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
export interface CompareHeroLocale {
  eyebrow: string;
  title: string;
  subtitle: string;
  thesis: string;
  overarchingCritique: string;
}

export const COMPARE_HERO: Record<string, CompareHeroLocale> = {
  en: {
    eyebrow: "COMPARE RANKINGS",
    title: "Eleven indices. Same planet.\nCompletely different answers.",
    subtitle: "Drag the spider to rebuild SLIC\u2019s top 10 in real time.",
    thesis:
      "Each major city ranking serves a different use case and weighting frame. EIU and Mercer lean toward relocation and hardship logic; Resonance toward brand and visitor signals; Monocle toward editorial lifestyle framing; Yonsei toward smart-city platforms; IMD toward resident perception of tech; Mori GPCI toward global financial magnetism; Oxford Economics toward investment return; Hanke HAMI toward pure macroeconomic stress (inflation + unemployment + lending rate \u2212 growth); SLIC Soft Power 2026 toward visitor magnetism, religious pluralism, cuisine density, cultural exports and mobility openness, where Bangkok ranks #1 once Eurocentric weighting is removed. Happy City Index 2026 toward governance quality, public mobility, and environmental delivery, where six of the top ten cities are Nordic and Bangkok — the world's most visited city — does not appear in the top fifty. Small score gaps are often over-read as hard fact. SLIC differs by placing affordability, overwork, tolerance, civic-freedom dignity, and community conditions directly inside the published formula \u2014 the dimensions that purely-economic indices like Hanke\u2019s deliberately exclude.",
    overarchingCritique:
      "These rankings often converge on wealthy, globally legible cities because their inputs and audiences reward those conditions. Cities also learn the annual cycle and can optimize for the visible variables. Studies comparing ranking outputs with resident surveys often show only partial overlap. The point of this comparison is not to declare one list fraudulent; it is to show that every board reflects its chosen frame.",
  },
  th: {
    eyebrow: "\u0e40\u0e1b\u0e23\u0e35\u0e22\u0e1a\u0e40\u0e17\u0e35\u0e22\u0e1a\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a",
    title: "\u0e2a\u0e34\u0e1a\u0e40\u0e2d\u0e47\u0e14\u0e14\u0e31\u0e0a\u0e19\u0e35 \u0e42\u0e25\u0e01\u0e40\u0e14\u0e35\u0e22\u0e27\u0e01\u0e31\u0e19\n\u0e04\u0e33\u0e15\u0e2d\u0e1a\u0e15\u0e48\u0e32\u0e07\u0e01\u0e31\u0e19\u0e2a\u0e34\u0e49\u0e19\u0e40\u0e0a\u0e34\u0e07",
    subtitle: "\u0e25\u0e32\u0e01\u0e2a\u0e44\u0e1b\u0e40\u0e14\u0e2d\u0e23\u0e4c\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e2a\u0e23\u0e49\u0e32\u0e07 Top 10 \u0e02\u0e2d\u0e07 SLIC \u0e43\u0e2b\u0e21\u0e48\u0e41\u0e1a\u0e1a\u0e40\u0e23\u0e35\u0e22\u0e25\u0e44\u0e17\u0e21\u0e4c",
    thesis:
      "\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2a\u0e33\u0e04\u0e31\u0e0d\u0e41\u0e15\u0e48\u0e25\u0e30\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e21\u0e35\u0e01\u0e23\u0e2d\u0e1a\u0e41\u0e25\u0e30\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e15\u0e48\u0e32\u0e07\u0e01\u0e31\u0e19 EIU \u0e41\u0e25\u0e30 Mercer \u0e40\u0e19\u0e49\u0e19\u0e15\u0e23\u0e23\u0e01\u0e30\u0e01\u0e32\u0e23\u0e22\u0e49\u0e32\u0e22\u0e16\u0e34\u0e48\u0e19\u0e41\u0e25\u0e30\u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e34\u0e01\u0e32\u0e23\u0e1c\u0e39\u0e49\u0e16\u0e39\u0e01\u0e2a\u0e48\u0e07\u0e21\u0e32\u0e17\u0e33\u0e07\u0e32\u0e19 Resonance \u0e40\u0e19\u0e49\u0e19\u0e2a\u0e31\u0e0d\u0e0d\u0e32\u0e13\u0e41\u0e1a\u0e23\u0e19\u0e14\u0e4c\u0e41\u0e25\u0e30\u0e19\u0e31\u0e01\u0e17\u0e48\u0e2d\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e27 Monocle \u0e40\u0e19\u0e49\u0e19\u0e21\u0e38\u0e21\u0e21\u0e2d\u0e07\u0e1a\u0e23\u0e23\u0e13\u0e32\u0e18\u0e34\u0e01\u0e32\u0e23\u0e14\u0e49\u0e32\u0e19\u0e44\u0e25\u0e1f\u0e4c\u0e2a\u0e44\u0e15\u0e25\u0e4c Yonsei \u0e40\u0e19\u0e49\u0e19\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e2a\u0e21\u0e32\u0e23\u0e4c\u0e17\u0e0b\u0e34\u0e15\u0e35\u0e49 IMD \u0e40\u0e19\u0e49\u0e19\u0e01\u0e32\u0e23\u0e23\u0e31\u0e1a\u0e23\u0e39\u0e49\u0e02\u0e2d\u0e07\u0e1c\u0e39\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22\u0e40\u0e01\u0e35\u0e48\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35 Mori GPCI \u0e40\u0e19\u0e49\u0e19\u0e41\u0e23\u0e07\u0e14\u0e36\u0e07\u0e14\u0e39\u0e14\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e40\u0e07\u0e34\u0e19\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e42\u0e25\u0e01 Oxford Economics \u0e40\u0e19\u0e49\u0e19\u0e1c\u0e25\u0e15\u0e2d\u0e1a\u0e41\u0e17\u0e19\u0e01\u0e32\u0e23\u0e25\u0e07\u0e17\u0e38\u0e19 Hanke HAMI \u0e40\u0e19\u0e49\u0e19\u0e04\u0e27\u0e32\u0e21\u0e40\u0e04\u0e23\u0e35\u0e22\u0e14\u0e17\u0e32\u0e07\u0e40\u0e28\u0e23\u0e29\u0e10\u0e01\u0e34\u0e08\u0e21\u0e2b\u0e20\u0e32\u0e04\u0e25\u0e49\u0e27\u0e46 (\u0e40\u0e07\u0e34\u0e19\u0e40\u0e1f\u0e49\u0e2d + \u0e27\u0e48\u0e32\u0e07\u0e07\u0e32\u0e19 + \u0e2d\u0e31\u0e15\u0e23\u0e32\u0e14\u0e2d\u0e01\u0e40\u0e1a\u0e35\u0e49\u0e22 \u2212 \u0e01\u0e32\u0e23\u0e40\u0e15\u0e34\u0e1a\u0e42\u0e15) SLIC Soft Power 2026 \u0e40\u0e19\u0e49\u0e19\u0e41\u0e23\u0e07\u0e14\u0e36\u0e07\u0e14\u0e39\u0e14\u0e19\u0e31\u0e01\u0e17\u0e48\u0e2d\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e27 \u0e1e\u0e2b\u0e38\u0e19\u0e34\u0e22\u0e21\u0e17\u0e32\u0e07\u0e28\u0e32\u0e2a\u0e19\u0e32 \u0e04\u0e27\u0e32\u0e21\u0e2b\u0e19\u0e32\u0e41\u0e19\u0e48\u0e19\u0e02\u0e2d\u0e07\u0e2d\u0e32\u0e2b\u0e32\u0e23 \u0e01\u0e32\u0e23\u0e2a\u0e48\u0e07\u0e2d\u0e2d\u0e01\u0e17\u0e32\u0e07\u0e27\u0e31\u0e12\u0e19\u0e18\u0e23\u0e23\u0e21 \u0e41\u0e25\u0e30\u0e04\u0e27\u0e32\u0e21\u0e40\u0e1b\u0e34\u0e14\u0e01\u0e27\u0e49\u0e32\u0e07\u0e14\u0e49\u0e32\u0e19\u0e01\u0e32\u0e23\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e22\u0e49\u0e32\u0e22 \u2014 \u0e0b\u0e36\u0e48\u0e07\u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e2f \u0e15\u0e34\u0e14\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a 1 \u0e40\u0e21\u0e37\u0e48\u0e2d\u0e25\u0e1a\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e22\u0e38\u0e42\u0e23\u0e1b\u0e40\u0e1b\u0e47\u0e19\u0e28\u0e39\u0e19\u0e22\u0e4c\u0e01\u0e25\u0e32\u0e07\u0e2d\u0e2d\u0e01 \u0e0a\u0e48\u0e2d\u0e07\u0e27\u0e48\u0e32\u0e07\u0e04\u0e30\u0e41\u0e19\u0e19\u0e40\u0e25\u0e47\u0e01\u0e19\u0e49\u0e2d\u0e22\u0e21\u0e31\u0e01\u0e16\u0e39\u0e01\u0e2d\u0e48\u0e32\u0e19\u0e40\u0e01\u0e34\u0e19\u0e08\u0e23\u0e34\u0e07 SLIC \u0e41\u0e15\u0e01\u0e15\u0e48\u0e32\u0e07\u0e42\u0e14\u0e22\u0e19\u0e33\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e43\u0e19\u0e01\u0e32\u0e23\u0e0b\u0e37\u0e49\u0e2d \u0e01\u0e32\u0e23\u0e17\u0e33\u0e07\u0e32\u0e19\u0e25\u0e48\u0e27\u0e07\u0e40\u0e27\u0e25\u0e32 \u0e04\u0e27\u0e32\u0e21\u0e2d\u0e14\u0e01\u0e25\u0e49\u0e31\u0e19 \u0e28\u0e31\u0e01\u0e14\u0e34\u0e4c\u0e28\u0e23\u0e35\u0e41\u0e2b\u0e48\u0e07\u0e40\u0e2a\u0e23\u0e35\u0e20\u0e32\u0e1e\u0e1e\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07 \u0e41\u0e25\u0e30\u0e40\u0e07\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e02\u0e0a\u0e38\u0e21\u0e0a\u0e19\u0e40\u0e02\u0e49\u0e32\u0e21\u0e32\u0e43\u0e19\u0e2a\u0e39\u0e15\u0e23\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e30\u0e42\u0e14\u0e22\u0e15\u0e23\u0e07 Happy City Index 2026 \u0e40\u0e19\u0e49\u0e19\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e18\u0e23\u0e23\u0e21\u0e32\u0e20\u0e34\u0e1a\u0e32\u0e25 \u0e23\u0e30\u0e1a\u0e1a\u0e02\u0e19\u0e2a\u0e48\u0e07\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e30 \u0e41\u0e25\u0e30\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e48\u0e07\u0e41\u0e27\u0e14\u0e25\u0e49\u0e2d\u0e21 \u2014 \u0e0b\u0e36\u0e48\u0e07 6 \u0e43\u0e19 10 \u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e41\u0e23\u0e01\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e19\u0e2d\u0e23\u0e4c\u0e14\u0e34\u0e01 \u0e41\u0e25\u0e30\u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e2f \u0e0b\u0e36\u0e48\u0e07\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e17\u0e35\u0e48\u0e21\u0e35\u0e19\u0e31\u0e01\u0e17\u0e48\u0e2d\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e27\u0e21\u0e32\u0e01\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14\u0e43\u0e19\u0e42\u0e25\u0e01 \u0e44\u0e21\u0e48\u0e1b\u0e23\u0e32\u0e01\u0e0f\u0e43\u0e19 50 \u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e41\u0e23\u0e01",
    overarchingCritique:
      "\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e40\u0e2b\u0e25\u0e48\u0e32\u0e19\u0e35\u0e49\u0e21\u0e31\u0e01\u0e21\u0e38\u0e48\u0e07\u0e44\u0e1b\u0e17\u0e35\u0e48\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e17\u0e35\u0e48\u0e23\u0e48\u0e33\u0e23\u0e27\u0e22\u0e41\u0e25\u0e30\u0e40\u0e1b\u0e47\u0e19\u0e17\u0e35\u0e48\u0e23\u0e39\u0e49\u0e08\u0e31\u0e01\u0e43\u0e19\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e42\u0e25\u0e01 \u0e40\u0e1e\u0e23\u0e32\u0e30\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e19\u0e33\u0e40\u0e02\u0e49\u0e32\u0e41\u0e25\u0e30\u0e01\u0e25\u0e38\u0e48\u0e21\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e21\u0e31\u0e01\u0e15\u0e2d\u0e1a\u0e41\u0e17\u0e19\u0e40\u0e07\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e02\u0e40\u0e2b\u0e25\u0e48\u0e32\u0e19\u0e31\u0e49\u0e19 \u0e19\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e19\u0e35\u0e49\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e15\u0e48\u0e32\u0e07\u0e46 \u0e22\u0e31\u0e07\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e40\u0e23\u0e35\u0e22\u0e19\u0e23\u0e39\u0e49\u0e23\u0e2d\u0e1a\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e1b\u0e35\u0e41\u0e25\u0e30\u0e1b\u0e23\u0e31\u0e1a\u0e43\u0e2b\u0e49\u0e40\u0e2b\u0e21\u0e32\u0e30\u0e01\u0e31\u0e1a\u0e15\u0e31\u0e27\u0e41\u0e1b\u0e23\u0e17\u0e35\u0e48\u0e21\u0e2d\u0e07\u0e40\u0e2b\u0e47\u0e19\u0e44\u0e14\u0e49 \u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\u0e17\u0e35\u0e48\u0e40\u0e1b\u0e23\u0e35\u0e22\u0e1a\u0e40\u0e17\u0e35\u0e22\u0e1a\u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e01\u0e31\u0e1a\u0e41\u0e1a\u0e1a\u0e2a\u0e33\u0e23\u0e27\u0e08\u0e1c\u0e39\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22\u0e21\u0e31\u0e01\u0e1e\u0e1a\u0e01\u0e32\u0e23\u0e17\u0e31\u0e1a\u0e0b\u0e49\u0e2d\u0e19\u0e40\u0e1e\u0e35\u0e22\u0e07\u0e1a\u0e32\u0e07\u0e2a\u0e48\u0e27\u0e19 \u0e08\u0e38\u0e14\u0e1b\u0e23\u0e30\u0e2a\u0e07\u0e04\u0e4c\u0e02\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e23\u0e35\u0e22\u0e1a\u0e40\u0e17\u0e35\u0e22\u0e1a\u0e19\u0e35\u0e49\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28\u0e27\u0e48\u0e32\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e43\u0e14\u0e1a\u0e31\u0e0d\u0e0a\u0e35\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e17\u0e47\u0e08 \u0e41\u0e15\u0e48\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e41\u0e2a\u0e14\u0e07\u0e27\u0e48\u0e32\u0e17\u0e38\u0e01\u0e01\u0e23\u0e30\u0e14\u0e32\u0e19\u0e2a\u0e30\u0e17\u0e49\u0e2d\u0e19\u0e01\u0e23\u0e2d\u0e1a\u0e17\u0e35\u0e48\u0e15\u0e19\u0e40\u0e25\u0e37\u0e2d\u0e01",
  },
  zh: {
    eyebrow: "\u6307\u6570\u5bf9\u6bd4",
    title: "\u5341\u4e00\u4efd\u6307\u6570\u3002\u540c\u4e00\u661f\u7403\u3002\n\u622a\u7136\u4e0d\u540c\u7684\u7b54\u6848\u3002",
    subtitle: "\u62d6\u52a8\u8718\u86db\u7f51\u56fe\uff0c\u5b9e\u65f6\u91cd\u5efa SLIC \u524d 10 \u540d\u3002",
    thesis:
      "\u5404\u5927\u57ce\u5e02\u6392\u540d\u9488\u5bf9\u4e0d\u540c\u4f7f\u7528\u573a\u666f\u548c\u6743\u91cd\u6846\u67b6\u3002EIU \u548c Mercer \u4fa7\u91cd\u5916\u6d3e\u4e0e\u9a7b\u5916\u903b\u8f91\uff1bResonance \u4fa7\u91cd\u54c1\u724c\u548c\u8bbf\u5ba2\u4fe1\u53f7\uff1bMonocle \u4fa7\u91cd\u7f16\u8f91\u89c6\u89d2\u7684\u751f\u6d3b\u65b9\u5f0f\u6846\u67b6\uff1b\u5ef6\u4e16 (Yonsei) \u4fa7\u91cd\u667a\u6167\u57ce\u5e02\u5e73\u53f0\uff1bIMD \u4fa7\u91cd\u5c45\u6c11\u5bf9\u6280\u672f\u7684\u611f\u77e5\uff1bMori GPCI \u4fa7\u91cd\u5168\u7403\u91d1\u878d\u5438\u5f15\u529b\uff1bOxford Economics \u4fa7\u91cd\u6295\u8d44\u56de\u62a5\uff1bHanke HAMI \u4fa7\u91cd\u7eaf\u5b8f\u89c2\u7ecf\u6d4e\u538b\u529b\uff08\u901a\u8139 + \u5931\u4e1a + \u8d37\u6b3e\u5229\u7387 \u2212 \u589e\u957f\uff09\uff1bSLIC \u8f6f\u5b9e\u529b 2026 \u4fa7\u91cd\u8bbf\u5ba2\u5438\u5f15\u529b\u3001\u5b97\u6559\u591a\u5143\u4e3b\u4e49\u3001\u7f8e\u98df\u5bc6\u5ea6\u3001\u6587\u5316\u51fa\u53e3\u4e0e\u51fa\u884c\u5f00\u653e\u5ea6\u2014\u2014\u5728\u8be5\u6307\u6807\u4e2d\uff0c\u53bb\u9664\u6b27\u6d32\u4e2d\u5fc3\u6743\u91cd\u540e\uff0c\u66fc\u8c37\u6392\u540d\u7b2c\u4e00\u3002\u5fae\u5c0f\u7684\u5206\u6570\u5dee\u8ddd\u5e38\u88ab\u8fc7\u5ea6\u89e3\u8bfb\u4e3a\u786e\u5b9a\u6027\u4e8b\u5b9e\u3002SLIC \u7684\u4e0d\u540c\u4e4b\u5904\u5728\u4e8e\uff1a\u5c06\u53ef\u8d1f\u62c5\u6027\u3001\u8fc7\u52b3\u3001\u5305\u5bb9\u5ea6\u3001\u516c\u6c11\u81ea\u7531\u5c0a\u4e25\u4ee5\u53ca\u793e\u533a\u6761\u4ef6\u76f4\u63a5\u7eb3\u5165\u516c\u5f00\u516c\u5f0f\uff0c\u800c Hanke \u7b49\u7eaf\u7ecf\u6d4e\u6307\u6570\u523b\u610f\u5c06\u8fd9\u4e9b\u7ef4\u5ea6\u6392\u9664\u5728\u5916\u3002 Happy City Index 2026 \u4fa7\u91cd\u6cbb\u7406\u8d28\u91cf\u3001\u516c\u5171\u4ea4\u901a\u4e0e\u73af\u5883\u7ba1\u7406\u2014\u2014\u524d\u5341\u540d\u4e2d\u516d\u5ea7\u4e3a\u5317\u6b27\u57ce\u5e02\uff0c\u800c\u5168\u7403\u8bbf\u5ba2\u6700\u591a\u7684\u57ce\u5e02\u66fc\u8c37\u672a\u80fd\u8fdb\u5165\u524d\u4e94\u5341\u540d\u3002",
    overarchingCritique:
      "\u8fd9\u4e9b\u6392\u540d\u5f80\u5f80\u805a\u7126\u4e8e\u5bcc\u88d5\u3001\u5168\u7403\u77e5\u540d\u7684\u57ce\u5e02\uff0c\u56e0\u4e3a\u5176\u8f93\u5165\u6570\u636e\u548c\u53d7\u4f17\u90fd\u5bf9\u8fd9\u4e9b\u6761\u4ef6\u6709\u5229\u3002\u57ce\u5e02\u4e5f\u4f1a\u6478\u6e05\u5e74\u5ea6\u5468\u671f\uff0c\u5e76\u9488\u5bf9\u53ef\u89c1\u53d8\u91cf\u8fdb\u884c\u4f18\u5316\u3002\u5c06\u6392\u540d\u7ed3\u679c\u4e0e\u5c45\u6c11\u8c03\u67e5\u5bf9\u6bd4\u7684\u7814\u7a76\u901a\u5e38\u53ea\u80fd\u53d1\u73b0\u90e8\u5206\u91cd\u5408\u3002\u672c\u6b21\u5bf9\u6bd4\u7684\u76ee\u7684\u4e0d\u662f\u5ba3\u5224\u67d0\u4efd\u699c\u5355\u9020\u5047\uff0c\u800c\u662f\u8868\u660e\uff1a\u6bcf\u4e00\u5757\u6392\u540d\u699c\u90fd\u53cd\u6620\u4e86\u5176\u6240\u9009\u62e9\u7684\u6846\u67b6\u3002",
  },
  ko: {
    eyebrow: "\uc21c\uc704 \ube44\uad50",
    title: "\uc5f4\ud55c \uac1c\uc758 \uc9c0\uc218. \uac19\uc740 \ud589\uc131.\n\uc644\uc804\ud788 \ub2e4\ub978 \ub2f5\ub4e4.",
    subtitle: "\uc2a4\ud30c\uc774\ub354\ub97c \ub4dc\ub798\uadf8\ud558\uc5ec SLIC \uc0c1\uc704 10\uc704\ub97c \uc2e4\uc2dc\uac04\uc73c\ub85c \uc7ac\uad6c\uc131\ud558\uc138\uc694.",
    thesis:
      "\uc8fc\uc694 \ub3c4\uc2dc \uc21c\uc704\ub4e4\uc740 \uac01\uac01 \ub2e4\ub978 \ubaa9\uc801\uacfc \uac00\uc911\uce58 \uccb4\uacc4\ub97c \ubc14\ud0d5\uc73c\ub85c \ud569\ub2c8\ub2e4. EIU\uc640 Mercer\ub294 \uc774\uc8fc \ubc0f \uc8fc\uc7ac\uc6d0 \ud3b8\uc758 \ub85c\uc9c1\uc5d0 \ud3b8\uc911\ub418\uc5b4 \uc788\uace0, Resonance\ub294 \ube0c\ub79c\ub4dc \ubc0f \ubc29\ubb38\uc790 \uc2e0\ud638\uc5d0, Monocle\uc740 \ud3b8\uc9d1\ubd80\uc758 \ub77c\uc774\ud504\uc2a4\ud0c0\uc77c \uc2dc\uac01\uc5d0, Yonsei\ub294 \uc2a4\ub9c8\ud2b8 \uc2dc\ud2f0 \ud50c\ub7ab\ud3fc\uc5d0, IMD\ub294 \uae30\uc220\uc5d0 \ub300\ud55c \uac70\uc8fc\uc790 \uc778\uc2dd\uc5d0, Mori GPCI\ub294 \uae00\ub85c\ubc8c \uae08\uc735 \ub9e4\ub825\uc5d0, Oxford Economics\ub294 \ud22c\uc790 \uc218\uc775\uc5d0, Hanke HAMI\ub294 \uc21c\uc218 \uac70\uc2dc\uacbd\uc81c\uc801 \uc2a4\ud2b8\ub808\uc2a4(\uc778\ud50c\ub808\uc774\uc158 + \uc2e4\uc5c5\ub960 + \ub300\ucd9c \uae08\ub9ac \u2212 \uc131\uc7a5)\uc5d0, SLIC \uc18c\ud504\ud2b8\ud30c\uc6cc 2026\uc740 \ubc29\ubb38\uc790 \ub9e4\ub825, \uc885\uad50\uc801 \ub2e4\uc6d0\uc8fc\uc758, \uc74c\uc2dd \ubb38\ud654 \ubc00\ub3c4, \ubb38\ud654 \uc218\ucd9c \ubc0f \uc774\ub3d9\uc758 \uac1c\ubc29\uc131\uc5d0 \ucd08\uc810\uc744 \ub4d1\ub2c8\ub2e4 \u2014 \uc720\ub7fd \uc911\uc2ec \uac00\uc911\uce58\ub97c \uc81c\uac70\ud558\uba74 \ubc29\ucf55\uc774 1\uc704\ub97c \ucc28\uc9c0\ud569\ub2c8\ub2e4. \uc791\uc740 \uc810\uc218 \ucc28\uc774\ub294 \uc885\uc885 \ud655\uace0\ud55c \uc0ac\uc2e4\ub85c \uacfc\ub300 \ud574\uc11d\ub429\ub2c8\ub2e4. SLIC\ub294 Hanke \uac19\uc740 \uc21c\uc218 \uacbd\uc81c \uc9c0\uc218\uac00 \uc758\ub3c4\uc801\uc73c\ub85c \uc81c\uc678\ud55c \ucc28\uc6d0\ub4e4 \u2014 \uc8fc\uac70 \uac00\ub2a5\uc131, \uacfc\ub85c, \uad00\uc6a9, \uc2dc\ubbfc\uc801 \uc790\uc720\uc758 \uc874\uc5c4, \ucee4\ubba4\ub2c8\ud2f0 \uc870\uac74 \u2014 \uc744 \uacf5\uac1c \uacf5\uc2dd\uc5d0 \uc9c1\uc811 \ud3ec\ud568\uc2dc\ud0b5\ub2c8\ub2e4. Happy City Index 2026\ub294 \uac70\ubc84\ub10c\uc2a4 \ud488\uc9c8, \uacf5\uacf5 \uad50\ud1b5, \ud658\uacbd \uad00\ub9ac\uc5d0 \ucd08\uc810\uc744 \ub450\uba70, \uc0c1\uc704 10\uac1c \ub3c4\uc2dc \uc911 6\uac1c\uac00 \ubd81\uc720\ub7fd \ub3c4\uc2dc\uc774\uace0 \uc138\uacc4\uc5d0\uc11c \uac00\uc7a5 \ub9ce\uc740 \ubc29\ubb38\uac1d\uc744 \ubcf4\uc720\ud55c \ubc29\ucf55\uc740 50\uc704 \uc548\uc5d0 \ub4e4\uc9c0 \ubabb\ud569\ub2c8\ub2e4.",
    overarchingCritique:
      "\uc774\ub7ec\ud55c \uc21c\uc704\ub4e4\uc740 \uc785\ub825\uac12\uacfc \ub300\uc0c1 \ub3c5\uc790\uac00 \uadf8\ub7ec\ud55c \uc870\uac74\uc744 \uc120\ud638\ud558\uae30 \ub54c\ubb38\uc5d0 \ubd80\uc720\ud558\uace0 \uae00\ub85c\ubc8c\ud558\uac8c \uc778\uc9c0\ub3c4 \uc788\ub294 \ub3c4\uc2dc\ub4e4\uc5d0 \uc218\ub834\ud558\ub294 \uacbd\ud5a5\uc774 \uc788\uc2b5\ub2c8\ub2e4. \ub3c4\uc2dc\ub4e4\uc740 \uc5f0\uac04 \uc8fc\uae30\ub97c \ud30c\uc545\ud558\uace0 \ubcf4\uc774\ub294 \ubcc0\uc218\ub4e4\uc5d0 \ub9de\uac8c \ucd5c\uc801\ud654\ud560 \uc218\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uc21c\uc704 \uacb0\uacfc\ubb3c\uc744 \uac70\uc8fc\uc790 \uc124\ubb38\uc870\uc0ac\uc640 \ube44\uad50\ud55c \uc5f0\uad6c\ub4e4\uc740 \uc885\uc885 \ubd80\ubd84\uc801\uc778 \uc77c\uce58\ub9cc \ubcf4\uc5ec\uc90d\ub2c8\ub2e4. \uc774 \ube44\uad50\uc758 \ubaa9\uc801\uc740 \uc5b4\ub5a4 \ubaa9\ub85d\uc774 \ud5c8\uc704\ub77c\uace0 \uc120\uc5b8\ud558\ub294 \uac83\uc774 \uc544\ub2c8\ub77c, \ubaa8\ub4e0 \uc21c\uc704\ud45c\uac00 \uc790\uc2e0\uc774 \uc120\ud0dd\ud55c \ud504\ub808\uc784\uc744 \ubc18\uc601\ud55c\ub2e4\ub294 \uac83\uc744 \ubcf4\uc5ec\uc8fc\ub294 \uac83\uc785\ub2c8\ub2e4.",
  },
  ja: {
    eyebrow: "\u30e9\u30f3\u30ad\u30f3\u30b0\u6bd4\u8f03",
    title: "11\u306e\u6307\u6a19\u3002\u540c\u3058\u5730\u7403\u3002\n\u5168\u304f\u7570\u306a\u308b\u7b54\u3048\u3002",
    subtitle: "\u30b9\u30d1\u30a4\u30c0\u30fc\u3092\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u3001SLIC\u306e\u30c8\u30c3\u30d710\u3092\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u3067\u518d\u69cb\u7bc9\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
    thesis:
      "\u4e3b\u8981\u306a\u90fd\u5e02\u30e9\u30f3\u30ad\u30f3\u30b0\u306f\u305d\u308c\u305e\u308c\u7570\u306a\u308b\u7528\u9014\u3068\u91cd\u307f\u4ed8\u3051\u306e\u6846\u7d44\u307f\u3092\u6301\u3063\u3066\u3044\u307e\u3059\u3002EIU\u3068Mercer\u306f\u79fb\u4f4f\u30fb\u99d0\u5728\u30ed\u30b8\u30c3\u30af\u306b\u508d\u304d\u3001Resonance\u306f\u30d6\u30e9\u30f3\u30c9\u3068\u8a2a\u554f\u8005\u30b7\u30b0\u30ca\u30eb\u306b\u3001Monocle\u306f\u7de8\u96c6\u7684\u306a\u30e9\u30a4\u30d5\u30b9\u30bf\u30a4\u30eb\u306e\u8996\u70b9\u306b\u3001Yonsei\u306f\u30b9\u30de\u30fc\u30c8\u30b7\u30c6\u30a3\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306b\u3001IMD\u306f\u6280\u8853\u306b\u5bfe\u3059\u308b\u5c45\u4f4f\u8005\u306e\u8a8d\u8b58\u306b\u3001Mori GPCI\u306f\u30b0\u30ed\u30fc\u30d0\u30eb\u306a\u91d1\u878d\u7684\u9b45\u529b\u306b\u3001Oxford Economics\u306f\u6295\u8cc7\u30ea\u30bf\u30fc\u30f3\u306b\u3001Hanke HAMI\u306f\u7d14\u7c8b\u306a\u7d4c\u6e08\u7684\u30b9\u30c8\u30ec\u30b9\uff08\u30a4\u30f3\u30d5\u30ec\uff0b\u5931\u696d\u7387\uff0b\u8cb8\u51fa\u91d1\u5229\uff0d\u6210\u9577\uff09\u306b\u3001SLIC\u30bd\u30d5\u30c8\u30d1\u30ef\u30fc2026\u306f\u8a2a\u554f\u8005\u306e\u9b45\u529b\u3001\u5b97\u6559\u7684\u591a\u5143\u4e3b\u7fa9\u3001\u6599\u7406\u5bc6\u5ea6\u3001\u6587\u5316\u7684\u8f38\u51fa\u3001\u79fb\u52d5\u306e\u958b\u653e\u6027\u306b\u7126\u70b9\u3092\u5f53\u3066\u3066\u3044\u307e\u3059\u2014\u2014\u6b27\u5dde\u4e2d\u5fc3\u7684\u306a\u91cd\u307f\u4ed8\u3051\u3092\u9664\u304f\u3068\u30d0\u30f3\u30b3\u30af\u304c1\u4f4d\u306b\u306a\u308a\u307e\u3059\u3002\u308f\u305a\u304b\u306a\u30b9\u30b3\u30a2\u5dee\u306f\u78ba\u56fa\u305f\u308b\u4e8b\u5b9e\u3068\u3057\u3066\u904e\u5927\u89e3\u91c8\u3055\u308c\u308b\u3053\u3068\u304c\u591a\u3044\u3067\u3059\u3002SLIC\u306f\u3001Hanke\u306e\u3088\u3046\u306a\u7d14\u7c8b\u306a\u7d4c\u6e08\u6307\u6a19\u304c\u610f\u56f3\u7684\u306b\u9664\u5916\u3057\u3066\u3044\u308b\u6b21\u5143\u2014\u2014\u4f4f\u5b85\u306e\u624b\u9803\u3055\u3001\u904e\u91cd\u52b4\u50cd\u3001\u5bbd\u5bb9\u6027\u3001\u5e02\u6c11\u7684\u81ea\u7531\u306e\u5c0a\u53b3\u3001\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u6761\u4ef6\u2014\u2014\u3092\u516c\u958b\u3055\u308c\u305f\u8a08\u7b97\u5f0f\u306b\u76f4\u63a5\u7d44\u307f\u8fbc\u3080\u3053\u3068\u3067\u7570\u306a\u308a\u307e\u3059\u3002 Happy City Index 2026\u306f\u30ac\u30d0\u30ca\u30f3\u30b9\u306e\u8cea\u3001\u516c\u5171\u4ea4\u901a\u3001\u74b0\u5883\u7ba1\u7406\u306b\u91cd\u70b9\u3092\u7f6e\u304d\u3001\u4e0a\u4f4d10\u90fd\u5e02\u306e\u3046\u30616\u90fd\u5e02\u304c\u5317\u6b27\u306e\u90fd\u5e02\u3067\u3001\u4e16\u754c\u3067\u6700\u3082\u8a2a\u554f\u8005\u6570\u306e\u591a\u3044\u90fd\u5e02\u30d0\u30f3\u30b3\u30af\u306f\u30c8\u30c3\u30d750\u306b\u5165\u3063\u3066\u3044\u307e\u305b\u3093\u3002",
    overarchingCritique:
      "\u3053\u308c\u3089\u306e\u30e9\u30f3\u30ad\u30f3\u30b0\u306f\u3001\u5165\u529b\u5024\u3068\u5bfe\u8c61\u8aad\u8005\u304c\u305d\u306e\u6761\u4ef6\u3092\u512a\u9047\u3059\u308b\u305f\u3081\u3001\u88d5\u798f\u3067\u30b0\u30ed\u30fc\u30d0\u30eb\u306b\u8a8d\u77e5\u3055\u308c\u305f\u90fd\u5e02\u306b\u53ce\u6496\u3059\u308b\u50be\u5411\u304c\u3042\u308a\u307e\u3059\u3002\u90fd\u5e02\u306f\u5e74\u9593\u30b5\u30a4\u30af\u30eb\u3092\u5b66\u7fd2\u3057\u3001\u53ef\u8996\u7684\u306a\u5909\u6570\u306b\u6700\u9069\u5316\u3059\u308b\u3053\u3068\u3082\u3067\u304d\u307e\u3059\u3002\u30e9\u30f3\u30ad\u30f3\u30b0\u7d50\u679c\u3068\u5c45\u4f4f\u8005\u8abf\u67fb\u3092\u6bd4\u8f03\u3057\u305f\u7814\u7a76\u3067\u306f\u3001\u591a\u304f\u306e\u5834\u5408\u90e8\u5206\u7684\u306a\u4e00\u81f4\u3057\u304b\u898b\u3089\u308c\u307e\u305b\u3093\u3002\u3053\u306e\u6bd4\u8f03\u306e\u76ee\u7684\u306f\u3001\u3042\u308b\u9806\u4f4d\u8868\u304c\u4e0d\u6b63\u3067\u3042\u308b\u3068\u5ba3\u8a00\u3059\u308b\u3053\u3068\u3067\u306f\u306a\u304f\u3001\u3059\u3079\u3066\u306e\u9806\u4f4d\u8868\u304c\u9078\u629e\u3057\u305f\u30d5\u30ec\u30fc\u30e0\u3092\u53cd\u6620\u3057\u3066\u3044\u308b\u3053\u3068\u3092\u793a\u3059\u3053\u3068\u3067\u3059\u3002",
  },
};

/* ── SLIC difference cards ── */
export interface SlicDifferenceCard {
  title: Record<string, string>;
  body: Record<string, string>;
}

export const SLIC_DIFFERENCE: SlicDifferenceCard[] = [
  {
    title: {
      en: "Disposable income after rent",
      th: "\u0e23\u0e32\u0e22\u0e44\u0e14\u0e49\u0e17\u0e35\u0e48\u0e43\u0e0a\u0e49\u0e44\u0e14\u0e49\u0e2b\u0e25\u0e31\u0e07\u0e04\u0e48\u0e32\u0e40\u0e0a\u0e48\u0e32",
      zh: "\u79df\u540e\u53ef\u652f\u914d\u6536\u5165",
      ko: "\uc784\ub300\ub8cc \ud6c4 \uac00\ucc98\ubd84 \uc18c\ub4dd",
      ja: "\u5bb6\u8cce\u5f8c\u306e\u53ef\u51e6\u5206\u6240\u5f97",
    },
    body: {
      en: "Tracks what remains after housing costs, adjusted for purchasing power. It measures residual room to live rather than treating GDP or salary alone as sufficient.",
      th: "\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e23\u0e32\u0e22\u0e44\u0e14\u0e49\u0e17\u0e35\u0e48\u0e40\u0e2b\u0e25\u0e37\u0e2d\u0e2b\u0e25\u0e31\u0e07\u0e2b\u0e31\u0e01\u0e04\u0e48\u0e32\u0e17\u0e35\u0e48\u0e1e\u0e31\u0e01\u0e42\u0e14\u0e22\u0e1b\u0e23\u0e31\u0e1a\u0e15\u0e32\u0e21\u0e01\u0e33\u0e25\u0e31\u0e07\u0e0b\u0e37\u0e49\u0e2d \u0e27\u0e31\u0e14\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e27\u0e48\u0e32\u0e07\u0e43\u0e19\u0e01\u0e32\u0e23\u0e14\u0e33\u0e23\u0e07\u0e0a\u0e35\u0e27\u0e34\u0e15\u0e08\u0e23\u0e34\u0e07 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e41\u0e04\u0e48 GDP \u0e2b\u0e23\u0e37\u0e2d\u0e40\u0e07\u0e34\u0e19\u0e40\u0e14\u0e37\u0e2d\u0e19",
      zh: "\u8ffd\u8e2a\u6263\u9664\u4f4f\u623f\u6210\u672c\u540e\u7ecf\u8d2d\u4e70\u529b\u8c03\u6574\u7684\u5269\u4f59\u6536\u5165\uff0c\u8861\u91cf\u5b9e\u9645\u751f\u6d3b\u4f59\u88d5\uff0c\u800c\u975e\u4ec5\u4ee5 GDP \u6216\u85aa\u8d44\u4f5c\u4e3a\u5145\u5206\u8861\u91cf\u6807\u51c6\u3002",
      ko: "\uc8fc\uac70 \ube44\uc6a9\uc744 \uc81c\ud55c \ud6c4 \uad6c\ub9e4\ub825\uc73c\ub85c \uc870\uc815\ub41c \uc794\uc5ec \uc18c\ub4dd\uc744 \ucd94\uc801\ud569\ub2c8\ub2e4. GDP\ub098 \uae09\uc5ec\ub9cc\uc73c\ub85c\ub294 \ubd80\uc871\ud558\ub2e4\uace0 \ubcf4\uace0, \uc2e4\uc9c8\uc801\uc778 \uc0dd\ud65c \uc5ec\uc720\ub97c \uce21\uc815\ud569\ub2c8\ub2e4.",
      ja: "\u4f4f\u5c45\u8cbb\u3092\u5dee\u3057\u5f15\u3044\u305f\u5f8c\u306e\u6b8b\u4f59\u6240\u5f97\u3092\u8cfc\u8cb7\u529b\u3067\u8abf\u6574\u3057\u3066\u8ffd\u8de1\u3057\u307e\u3059\u3002GDP\u3084\u7d66\u4e0e\u3060\u3051\u3067\u306f\u4e0d\u5341\u5206\u3068\u3057\u3066\u3001\u751f\u6d3b\u306e\u5b9f\u8cfd\u306a\u4f59\u88d5\u3092\u6e2c\u5b9a\u3057\u307e\u3059\u3002",
    },
  },
  {
    title: {
      en: "Overwork and working-time pressure",
      th: "\u0e01\u0e32\u0e23\u0e17\u0e33\u0e07\u0e32\u0e19\u0e25\u0e48\u0e27\u0e07\u0e40\u0e27\u0e25\u0e32\u0e41\u0e25\u0e30\u0e41\u0e23\u0e07\u0e01\u0e14\u0e14\u0e31\u0e19\u0e14\u0e49\u0e32\u0e19\u0e40\u0e27\u0e25\u0e32\u0e07\u0e32\u0e19",
      zh: "\u8fc7\u52b3\u4e0e\u5de5\u65f6\u538b\u529b",
      ko: "\uacfc\ub85c \ubc0f \ub178\ub3d9 \uc2dc\uac04 \uc555\ub825",
      ja: "\u904e\u91cd\u52b4\u50cd\u3068\u52b4\u50cd\u6642\u9593\u306e\u5727\u529b",
    },
    body: {
      en: "Adds working-time pressure directly into the score so that efficiency and long-hour cultures are not treated as automatic positives.",
      th: "\u0e19\u0e33\u0e41\u0e23\u0e07\u0e01\u0e14\u0e14\u0e31\u0e19\u0e14\u0e49\u0e32\u0e19\u0e40\u0e27\u0e25\u0e32\u0e17\u0e33\u0e07\u0e32\u0e19\u0e40\u0e02\u0e49\u0e32\u0e43\u0e19\u0e04\u0e30\u0e41\u0e19\u0e19\u0e42\u0e14\u0e22\u0e15\u0e23\u0e07 \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e44\u0e21\u0e48\u0e43\u0e2b\u0e49\u0e27\u0e31\u0e12\u0e19\u0e18\u0e23\u0e23\u0e21\u0e1b\u0e23\u0e30\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e20\u0e32\u0e1e\u0e41\u0e25\u0e30\u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e17\u0e33\u0e07\u0e32\u0e19\u0e22\u0e32\u0e27\u0e16\u0e39\u0e01\u0e21\u0e2d\u0e07\u0e27\u0e48\u0e32\u0e40\u0e1b\u0e47\u0e19\u0e2a\u0e34\u0e48\u0e07\u0e14\u0e35\u0e42\u0e14\u0e22\u0e2d\u0e31\u0e15\u0e42\u0e19\u0e21\u0e31\u0e15\u0e34",
      zh: "\u5c06\u5de5\u65f6\u538b\u529b\u76f4\u63a5\u7eb3\u5165\u8bc4\u5206\uff0c\u4f7f\u6548\u7387\u548c\u957f\u5de5\u65f6\u6587\u5316\u4e0d\u88ab\u81ea\u52a8\u89c6\u4e3a\u6b63\u9762\u56e0\u7d20\u3002",
      ko: "\ub178\ub3d9 \uc2dc\uac04 \uc555\ub825\uc744 \uc9c1\uc811 \uc810\uc218\uc5d0 \ubc18\uc601\ud558\uc5ec \ud6a8\uc728\uc131\uacfc \uc7a5\uc2dc\uac04 \ub178\ub3d9 \ubb38\ud654\uac00 \uc790\ub3d9\uc73c\ub85c \uae0d\uc815\uc801\uc73c\ub85c \ud3c9\uac00\ub418\uc9c0 \uc54a\ub3c4\ub85d \ud569\ub2c8\ub2e4.",
      ja: "\u52b4\u50cd\u6642\u9593\u306e\u5727\u529b\u3092\u76f4\u63a5\u30b9\u30b3\u30a2\u306b\u7d44\u307f\u8fbc\u307f\u3001\u52b9\u7387\u6027\u3068\u9577\u6642\u9593\u52b4\u50cd\u6587\u5316\u304c\u81ea\u52d5\u7684\u306b\u9ad8\u8a55\u4fa1\u3068\u306a\u3089\u306a\u3044\u3088\u3046\u306b\u3057\u307e\u3059\u3002",
    },
  },
  {
    title: {
      en: "Tolerance and civic openness",
      th: "\u0e04\u0e27\u0e32\u0e21\u0e2d\u0e14\u0e01\u0e25\u0e49\u0e31\u0e19\u0e41\u0e25\u0e30\u0e04\u0e27\u0e32\u0e21\u0e40\u0e1b\u0e34\u0e14\u0e01\u0e27\u0e49\u0e32\u0e07\u0e17\u0e32\u0e07\u0e1e\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07",
      zh: "\u5305\u5bb9\u6027\u4e0e\u516c\u6c11\u5f00\u653e\u6027",
      ko: "\uad00\uc6a9\uacfc \uc2dc\ubbfc\uc801 \uac1c\ubc29\uc131",
      ja: "\u5bdb\u5bb9\u6027\u3068\u5e02\u6c11\u7684\u958b\u653e\u6027",
    },
    body: {
      en: "Measures whether difference can be lived with low friction in daily life, using structural openness rather than tourism branding or surface cosmopolitanism.",
      th: "\u0e27\u0e31\u0e14\u0e27\u0e48\u0e32\u0e04\u0e27\u0e32\u0e21\u0e41\u0e15\u0e01\u0e15\u0e48\u0e32\u0e07\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e2d\u0e22\u0e39\u0e48\u0e23\u0e48\u0e27\u0e21\u0e01\u0e31\u0e19\u0e44\u0e14\u0e49\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e23\u0e32\u0e1a\u0e23\u0e37\u0e48\u0e19\u0e43\u0e19\u0e0a\u0e35\u0e27\u0e34\u0e15\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e27\u0e31\u0e19\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48 \u0e42\u0e14\u0e22\u0e43\u0e0a\u0e49\u0e04\u0e27\u0e32\u0e21\u0e40\u0e1b\u0e34\u0e14\u0e01\u0e27\u0e49\u0e32\u0e07\u0e40\u0e0a\u0e34\u0e07\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e41\u0e04\u0e48\u0e01\u0e32\u0e23\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e41\u0e1a\u0e23\u0e19\u0e14\u0e4c\u0e17\u0e48\u0e2d\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e27",
      zh: "\u8861\u91cf\u5dee\u5f02\u80fd\u5426\u4ee5\u4f4e\u6469\u64e6\u65b9\u5f0f\u5728\u65e5\u5e38\u751f\u6d3b\u4e2d\u5171\u5b58\uff0c\u91c7\u7528\u7ed3\u6784\u6027\u5f00\u653e\u5ea6\uff0c\u800c\u975e\u65c5\u6e38\u54c1\u724c\u5851\u9020\u6216\u8868\u9762\u4e0a\u7684\u56fd\u9645\u4e3b\u4e49\u3002",
      ko: "\ud45c\uba74\uc801\uc778 \uad00\uad11 \ube0c\ub79c\ub529\uc774\ub098 \uc138\uacc4\uc2dc\ubbfc\uc8fc\uc758\uac00 \uc544\ub2cc, \uad6c\uc870\uc801\uc778 \uac1c\ubc29\uc131\uc744 \ud1b5\ud574 \uc77c\uc0c1 \uc18d\uc5d0\uc11c \ub2e4\ub984\uc774 \ub9c8\ub9cc \uc5c6\uc774 \uacf5\uc874\ud560 \uc218 \uc788\ub294\uc9c0\ub97c \uce21\uc815\ud569\ub2c8\ub2e4.",
      ja: "\u89b3\u5149\u30d6\u30e9\u30f3\u30c7\u30a3\u30f3\u30b0\u3084\u8868\u9762\u7684\u306a\u30b3\u30b9\u30e2\u30dd\u30ea\u30bf\u30cb\u30ba\u30e0\u3067\u306f\u306a\u304f\u3001\u69cb\u9020\u7684\u306a\u958b\u653e\u6027\u3092\u901a\u3058\u3066\u3001\u65e5\u5e38\u751f\u6d3b\u306e\u4e2d\u3067\u9055\u3044\u304c\u4f4e\u6469\u64e6\u3067\u5171\u5b58\u3067\u304d\u308b\u304b\u3069\u3046\u304b\u3092\u6e2c\u5b9a\u3057\u307e\u3059\u3002",
    },
  },
  {
    title: {
      en: "Cultural experience diversity",
      th: "\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e25\u0e32\u0e01\u0e2b\u0e25\u0e32\u0e22\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\u0e17\u0e32\u0e07\u0e27\u0e31\u0e12\u0e19\u0e18\u0e23\u0e23\u0e21",
      zh: "\u6587\u5316\u4f53\u9a8c\u591a\u6837\u6027",
      ko: "\ubb38\ud654\uc801 \uacbd\ud5d8\uc758 \ub2e4\uc591\uc131",
      ja: "\u6587\u5316\u4f53\u9a13\u306e\u591a\u69d8\u6027",
    },
    body: {
      en: "Not museums-per-capita for tourists. The variety and depth of lived cultural life \u2014 food, community, public gathering \u2014 for residents, not visitors.",
      th: "\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e08\u0e33\u0e19\u0e27\u0e19\u0e1e\u0e34\u0e1e\u0e34\u0e18\u0e20\u0e31\u0e13\u0e11\u0e4c\u0e15\u0e48\u0e2d\u0e2b\u0e31\u0e27\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e19\u0e31\u0e01\u0e17\u0e48\u0e2d\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e27 \u0e41\u0e15\u0e48\u0e04\u0e37\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e25\u0e32\u0e01\u0e2b\u0e25\u0e32\u0e22\u0e41\u0e25\u0e30\u0e04\u0e27\u0e32\u0e21\u0e25\u0e36\u0e01\u0e02\u0e2d\u0e07\u0e0a\u0e35\u0e27\u0e34\u0e15\u0e17\u0e32\u0e07\u0e27\u0e31\u0e12\u0e19\u0e18\u0e23\u0e23\u0e21\u0e08\u0e23\u0e34\u0e07\u0e46 \u2014 \u0e2d\u0e32\u0e2b\u0e32\u0e23 \u0e0a\u0e38\u0e21\u0e0a\u0e19 \u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e30 \u2014 \u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e1c\u0e39\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e1c\u0e39\u0e49\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e40\u0e22\u0e37\u0e2d\u0e19",
      zh: "\u4e0d\u662f\u4e3a\u6e38\u5ba2\u8ba1\u7b97\u7684\u4eba\u5747\u535a\u7269\u9986\u6570\u91cf\uff0c\u800c\u662f\u5c45\u6c11\uff08\u800c\u975e\u8bbf\u5ba2\uff09\u6240\u80fd\u4f53\u9a8c\u5230\u7684\u996e\u98df\u3001\u793e\u533a\u3001\u516c\u5171\u805a\u96c6\u7b49\u751f\u6d3b\u6587\u5316\u7684\u591a\u6837\u6027\u4e0e\u6df1\u5ea6\u3002",
      ko: "\uad00\uad11\uac1d\uc744 \uc704\ud55c 1\uc778\ub2f9 \ubc15\ubb3c\uad00 \uc218\uac00 \uc544\ub2d9\ub2c8\ub2e4. \ubc29\ubb38\uac1d\uc774 \uc544\ub2cc \uac70\uc8fc\uc790\ub97c \uc704\ud55c \uc74c\uc2dd, \uacf5\ub3d9\uccb4, \uacf5\uacf5 \ubaa8\uc784\uc758 \ub2e4\uc591\uc131\uacfc \uc9c4\uc815\uc131\uc785\ub2c8\ub2e4.",
      ja: "\u89b3\u5149\u5ba2\u5411\u3051\u306e\u4e00\u4eba\u5f53\u305f\u308a\u535a\u7269\u9928\u6570\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002\u8a2a\u554f\u8005\u3067\u306f\u306a\u304f\u5c45\u4f4f\u8005\u306e\u305f\u3081\u306e\u3001\u98df\u3001\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u3001\u516c\u5171\u306e\u96c6\u3044\u306e\u591a\u69d8\u6027\u3068\u6df1\u3055\u3067\u3059\u3002",
    },
  },
  {
    title: {
      en: "Suicide and mental strain",
      th: "\u0e01\u0e32\u0e23\u0e06\u0e48\u0e32\u0e15\u0e31\u0e27\u0e15\u0e32\u0e22\u0e41\u0e25\u0e30\u0e04\u0e27\u0e32\u0e21\u0e15\u0e36\u0e07\u0e40\u0e04\u0e23\u0e35\u0e22\u0e14\u0e17\u0e32\u0e07\u0e08\u0e34\u0e15\u0e43\u0e08",
      zh: "\u81ea\u6740\u4e0e\u5fc3\u7406\u538b\u529b",
      ko: "\uc790\uc0b4 \ubc0f \uc815\uc2e0\uc801 \ubd80\ub2f4",
      ja: "\u81ea\u6bba\u3068\u7cbe\u795e\u7684\u30b9\u30c8\u30ec\u30b9",
    },
    body: {
      en: "Includes severe mental-strain indicators as a public-health pressure term rather than leaving them outside the city score.",
      th: "\u0e23\u0e27\u0e21\u0e15\u0e31\u0e27\u0e0a\u0e35\u0e49\u0e27\u0e31\u0e14\u0e04\u0e27\u0e32\u0e21\u0e40\u0e04\u0e23\u0e35\u0e22\u0e14\u0e17\u0e32\u0e07\u0e08\u0e34\u0e15\u0e43\u0e08\u0e23\u0e38\u0e19\u0e41\u0e23\u0e07\u0e40\u0e1b\u0e47\u0e19\u0e15\u0e31\u0e27\u0e41\u0e1b\u0e23\u0e41\u0e23\u0e07\u0e01\u0e14\u0e14\u0e31\u0e19\u0e14\u0e49\u0e32\u0e19\u0e2a\u0e32\u0e18\u0e32\u0e23\u0e13\u0e2a\u0e38\u0e02 \u0e41\u0e17\u0e19\u0e17\u0e35\u0e48\u0e08\u0e30\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e44\u0e27\u0e49\u0e19\u0e2d\u0e01\u0e04\u0e30\u0e41\u0e19\u0e19\u0e40\u0e21\u0e37\u0e2d\u0e07",
      zh: "\u5c06\u4e25\u91cd\u7684\u7cbe\u795e\u538b\u529b\u6307\u6807\u7eb3\u5165\u516c\u5171\u536b\u751f\u538b\u529b\u9879\uff0c\u800c\u975e\u5c06\u5176\u6392\u9664\u5728\u57ce\u5e02\u8bc4\u5206\u4e4b\u5916\u3002",
      ko: "\uc2ec\uac01\ud55c \uc815\uc2e0\uc801 \uc2a4\ud2b8\ub808\uc2a4 \uc9c0\ud45c\ub97c \ub3c4\uc2dc \uc810\uc218 \ubc16\uc5d0 \ub450\ub294 \ub300\uc2e0 \uacf5\uc911\ubcf4\uac74 \uc555\ub825 \ud56d\ubaa9\uc73c\ub85c \ud3ec\ud568\uc2dc\ud0b5\ub2c8\ub2e4.",
      ja: "\u6df1\u523b\u306a\u7cbe\u795e\u7684\u30b9\u30c8\u30ec\u30b9\u6307\u6a19\u3092\u90fd\u5e02\u30b9\u30b3\u30a2\u304b\u3089\u9664\u5916\u3059\u308b\u306e\u3067\u306f\u306a\u304f\u3001\u516c\u885e\u885b\u751f\u306e\u5727\u529b\u9805\u76ee\u3068\u3057\u3066\u7d44\u307f\u8fbc\u307f\u307e\u3059\u3002",
    },
  },
  {
    title: {
      en: "Graduate housing burden",
      th: "\u0e20\u0e32\u0e23\u0e30\u0e17\u0e35\u0e48\u0e1e\u0e31\u0e01\u0e02\u0e2d\u0e07\u0e1a\u0e31\u0e13\u0e11\u0e34\u0e15\u0e08\u0e1a\u0e43\u0e2b\u0e21\u0e48",
      zh: "\u5e94\u5c4a\u6bd5\u4e1a\u751f\u4f4f\u623f\u8d1f\u62c5",
      ko: "\uc878\uc5c5\uc0dd \uc8fc\uac70 \ubd80\ub2f4",
      ja: "\u5927\u5b66\u5352\u696d\u751f\u306e\u4f4f\u5b85\u8ca0\u62c5",
    },
    body: {
      en: "Tracks how much of a young graduate\u2019s salary goes to housing, making early-career affordability visible instead of assuming all residents enter the market with assets.",
      th: "\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e27\u0e48\u0e32\u0e23\u0e32\u0e22\u0e44\u0e14\u0e49\u0e02\u0e2d\u0e07\u0e1a\u0e31\u0e13\u0e11\u0e34\u0e15\u0e2b\u0e19\u0e38\u0e48\u0e21\u0e2a\u0e32\u0e27\u0e16\u0e39\u0e01\u0e43\u0e0a\u0e49\u0e08\u0e48\u0e32\u0e22\u0e01\u0e31\u0e1a\u0e17\u0e35\u0e48\u0e1e\u0e31\u0e01\u0e21\u0e32\u0e01\u0e41\u0e04\u0e48\u0e44\u0e2b\u0e19 \u0e17\u0e33\u0e43\u0e2b\u0e49\u0e40\u0e2b\u0e47\u0e19\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e43\u0e19\u0e01\u0e32\u0e23\u0e0b\u0e37\u0e49\u0e2d\u0e43\u0e19\u0e0a\u0e48\u0e27\u0e07\u0e40\u0e23\u0e34\u0e48\u0e21\u0e15\u0e49\u0e19\u0e2d\u0e32\u0e0a\u0e35\u0e1e\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e15\u0e31\u0e49\u0e07\u0e2a\u0e21\u0e21\u0e15\u0e34\u0e10\u0e32\u0e19\u0e27\u0e48\u0e32\u0e1c\u0e39\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22\u0e17\u0e38\u0e01\u0e04\u0e19\u0e21\u0e35\u0e17\u0e38\u0e19\u0e2d\u0e22\u0e39\u0e48\u0e41\u0e25\u0e49\u0e27",
      zh: "\u8ffd\u8e2a\u5e74\u8f7b\u6bd5\u4e1a\u751f\u85aa\u8d44\u4e2d\u7528\u4e8e\u4f4f\u623f\u7684\u6bd4\u4f8b\uff0c\u4f7f\u65e9\u671f\u804c\u4e1a\u9636\u6bb5\u7684\u53ef\u8d1f\u62c5\u6027\u53ef\u89c1\uff0c\u800c\u975e\u5047\u8bbe\u6240\u6709\u5c45\u6c11\u5e26\u8d44\u5165\u5e02\u3002",
      ko: "\uc81c\uc0c8 \uc704 \uac70\uc8fc\uc790\uac00 \uc790\uc0b0\uc744 \uac00\uc9c0\uace0 \uc2dc\uc7a5\uc5d0 \uc9c4\uc785\ud55c\ub2e4\uace0 \uac00\uc815\ud558\uc9c0 \uc54a\uace0, \uc820\uc740 \uc878\uc5c5\uc0dd\uc758 \uae09\uc5ec \uc911 \uc8fc\uac70\ube44\uac00 \ucc28\uc9c0\ud558\ub294 \ube44\uc728\uc744 \ucd94\uc801\ud558\uc5ec \ucd08\uae30 \uacbd\ub825\uc758 \uc8fc\uac70 \uac00\ub2a5\uc131\uc744 \uac00\uc2dc\ud654\ud569\ub2c8\ub2e4.",
      ja: "\u5168\u5c45\u4f4f\u8005\u304c\u8cc7\u7523\u3092\u6301\u3063\u3066\u5e02\u5834\u306b\u53c2\u5165\u3059\u308b\u3068\u4eee\u5b9a\u305b\u305a\u3001\u82e5\u3044\u5352\u696d\u751f\u306e\u7d66\u4e0e\u306e\u3046\u3061\u4f4f\u5c45\u8cbb\u304c\u5360\u3081\u308b\u5272\u5408\u3092\u8ffd\u8de1\u3057\u3001\u65e9\u671f\u30ad\u30e3\u30ea\u30a2\u306e\u4f4f\u5b85\u306e\u624b\u9803\u3055\u3092\u53ef\u8996\u5316\u3057\u307e\u3059\u3002",
    },
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
  ko: string;
  ja: string;
  slicRank?: number; // omit if city is outside SLIC's current 163-city coverage
}

export const ECHO_CHAMBER_NOTES: Record<string, EchoChamberNote> = {
  singapore: {
    slicRank: 21,
    en: "Happy City Index 2026 places Singapore at #22 — strong on Governance and Mobility, exactly what Singapore's state capacity delivers. SLIC scores the same Singapore at #21 (pure rank) but Gamma tier. Hanke ranks it #2 'happiest economy' in 2025 — but on macroeconomic stability alone (low inflation, tight labour market, low lending rate). SLIC sees the same Singapore at #21: world-class Capability 94 and Creative 73 still hold up, but Community 38 and Pressure 43 reflect what Hanke chose not to measure — civic freedom under closed-autocracy rule (HRMI Empowerment 3.7/10), criminalised gender recognition, 30-year career penalties for LGBTQ+ public servants, world's lowest fertility rate (TFR 0.87) as the existential consequence, 45-hour weeks (PMC research), and HDB ownership now requiring 8.9 years of median income vs 4.8 a generation ago.",
    th: "Happy City Index 2026 จัดสิงคโปร์อยู่ที่ #22 — แข็งแกร่งด้านธรรมาภิบาลและระบบขนส่ง ซึ่งสะท้อนความสามารถของรัฐสิงคโปร์ SLIC ให้คะแนนสิงคโปร์เดียวกันที่อันดับ #21 (อันดับล้วน) แต่อยู่ชั้น Gamma SLIC อันดับ #18 ภายใต้ AMPI ชั้นสาธารณะ Gamma ศักยภาพ 94.1 สูงสุดในชุดข้อมูล (ระบบสุขภาพ การศึกษา ธรรมาภิบาลดิจิทัล) ความสร้างสรรค์ 73.3 และความน่าอยู่ 87.4 ก็ระดับสูง สิ่งที่จำกัดคือชุมชน 38.8 — เสรีภาพพลเมืองและความอดกลั้นต่ำกว่าคู่เทียบ สิงคโปร์แข็งในเสาที่เมืองมั่งคั่งคาดหวัง แต่ overlay สาธารณะจัดให้อยู่ Gamma เพราะ Community ต่ำกว่าพื้น Alpha และ Beta",
    zh: "Happy City Index 2026 将新加坡列为 #22——在治理与交通方面表现强劲，正是新加坡国家能力所能交付的。SLIC 对同一个新加坡的纯分排名为 #21，但公开层为 Gamma。AMPI 下 SLIC 第 18 名，公开层为 Gamma。能力支柱 94.1 是全数据集最高；创意 73.3 与宜居 87.4 亦属顶级。拖累是社区支柱 38.8 ——公民自由与包容性远低于同等财富水平的城市。新加坡在富裕同侪期待的支柱上很强，但公开层覆盖将其归入 Gamma，因为社区低于 Alpha 与 Beta 的门槛。",
    ko: "Happy City Index 2026는 싱가포르를 #22로 평가합니다 — 거버넌스와 교통에서 강점을 보이며, 이는 싱가포르의 국가 역량이 제공하는 바를 정확히 반영합니다. SLIC는 같은 싱가포르를 순수 순위 #21로 평가하지만 감마 등급으로 분류합니다. Hanke는 싱가포르를 2025년 '가장 행복한 경제' 2위로 평가했지만, 이는 거시경제적 안정성(낮은 인플레이션, 타이트한 노동 시장, 낮은 대출 금리)에만 기반합니다. SLIC은 싱가포르를 21위로 평가합니다. 세계적인 역량(94)과 창의성(73)은 여전히 높지만, 커뮤니티(38)와 성장 압력(43)은 Hanke가 측정하지 않은 부분(폐쇄적 독재 하의 시민의 자유, 성별 인정의 범죄화, 성소수자 공무원의 30년 경력 불이익, 최저 출산율, 긴 노동 시간, 가중되는 주거 부담)을 반영합니다.",
    ja: "Happy City Index 2026ではシンガポールは#22位——ガバナンスとモビリティで強く、まさにシンガポールの国家能力が提供するものを反映しています。SLICは同じシンガポールを純粋な順位#21と評価しますが、ガンマ層に分類されます。Hankeは2025年の「最も幸せな経済」でシンガポールを2位と評価しましたが、これはマクロ経済の安定性（低インフレ、逼迫した労働市場、低貸出金利）のみに基づいています。SLICも同じシンガポールを21位と評価しています。世界トップクラスの能力（94）と創造性（73）は健在ですが、コミュニティ（38）と成長圧力（43）は、Hankeが測定しなかった点（閉鎖的専制下での市民の自由、性別承認の犯罪化、LGBTQ+公務員の30年にわたるキャリアの不利益、最低の出生率、長時間労働、住宅負担の増大）を反映しています。",
  },
  zurich: {
    slicRank: 28,
    en: "SLIC #28 under AMPI, public-tier Gamma. Viability 97.6 is near-perfect (safety, air, water, digital), Community 76.0 solid. But Growth 39.1 — disposable income after Swiss rents, graduate housing burden — and Creative 49.4 create enough variance that AMPI pulls the overall down. Zurich scores the way Zurich actually is: immaculate, moderately dynamic, crushingly expensive.",
    th: "SLIC อันดับ #28 ภายใต้ AMPI ชั้นสาธารณะ Gamma ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ ชุมชน 76.0 ดี แต่ Growth 39.1 — รายได้คงเหลือหลังค่าเช่าสวิส ภาระที่อยู่อาศัย — และ Creative 49.4 สร้างความแปรปรวนจน AMPI ฉุดคะแนนรวมลง",
    zh: "AMPI 下 SLIC 第 28 名，公开层为 Gamma。宜居 97.6 接近完美，社区 76.0 稳健。但增长 39.1（瑞士房租后的可支配收入、毕业生住房负担）与创意 49.4 制造的方差足以令 AMPI 拉低总分。苏黎世得分如实：无可挑剔、中等活力、贵得令人窒息。",
    ko: "AMPI 기준 SLIC 28위, 공개 등급 감마(Gamma). 생활 가능성 97.6은 거의 완벽하고 커뮤니티 76.0도 탄탄합니다. 그러나 스위스의 높은 임대료와 생활비가 반영된 성장 압력(39.1)과 창의성(49.4)으로 인한 편차가 AMPI 전체 점수를 끌어내렸습니다. 취리히는 흠잡을 데 없고 적당히 역동적이지만 엄청나게 비쌉니다.",
    ja: "AMPIでSLIC 28位、公開ティアはGamma。生活持続性97.6はほぼ完璧であり、コミュニティ76.0も堅実です。しかし、スイスの高い家賃と生活費を反映した成長圧力（39.1）と創造性（49.4）による差異が、AMPIの総合スコアを大きく引き下げています。チューリッヒは非の打ち所がなく、適度にダイナミックですが、圧倒的に高価です。",
  },
  copenhagen: {
    slicRank: 19,
    en: "SLIC #19 under AMPI, public-tier Gamma. Community 89.6 is the dataset's strongest social-cohesion signal (tolerance, gender equality, social trust). Viability 97.9 matches Paris and Amsterdam at the top of the scale. But Growth 33.1 — Copenhagen's housing costs have risen sharply over the past decade — keeps the AMPI penalty live. The strongest community signal in the index still places Copenhagen inside the top 20 by score, with Gamma reflecting where it lands once the affordability floor binds.",
    th: "SLIC อันดับ #19 ภายใต้ AMPI ชั้นสาธารณะ Gamma ชุมชน 89.6 เป็นสัญญาณความสามัคคีทางสังคมที่แรงที่สุดในชุดข้อมูล ความน่าอยู่ 97.9 อยู่ระดับยอดเท่ากับ Paris และ Amsterdam แต่ Growth 33.1 — ค่าเช่าโคเปนเฮเกนเพิ่มขึ้นมากในทศวรรษที่ผ่านมา — ทำให้ AMPI ลงโทษ สัญญาณชุมชนที่แรงที่สุดในดัชนียังดึงโคเปนเฮเกนเข้า top 20 ตามคะแนน โดย Gamma สะท้อนตำแหน่งหลังพื้นความสามารถในการอยู่อาศัยจำกัด",
    zh: "AMPI 下 SLIC 第 19 名，公开层为 Gamma。社区 89.6 是整个数据集最强的社会凝聚信号。宜居 97.9 与巴黎、阿姆斯特丹并列榜首。但增长 33.1 ——哥本哈根过去十年房价大涨——令 AMPI 持续扣分。最强的社区信号仍让哥本哈根按分数稳居前 20，Gamma 则反映可负担门槛绑定后的实际定位。",
    ko: "AMPI 기준 SLIC 19위, 공개 등급 감마(Gamma). 커뮤니티 89.6은 데이터 세트 내에서 가장 강력한 사회적 유대 신호입니다. 생활 가능성 97.9는 파리와 암스테르담에 필적하는 최고 수준입니다. 그러나 지난 10년간 집값이 크게 상승한 성장 압력(33.1)이 AMPI 패널티를 계속해서 부과합니다.",
    ja: "AMPIでSLIC 19位、公開ティアはGamma。コミュニティ89.6は、データセット内で最も強い社会的結束のシグナルです。生活持続性97.9は、パリやアムステルダムと並んでトップクラスです。しかし、過去10年間で住宅価格が急騰したことによる成長圧力（33.1）が、AMPIのペナルティを継続させています。",
  },
  sydney: {
    slicRank: 51,
    en: "SLIC #51 under AMPI, no public-tier seat. Viability 89.5 and Capability 87.1 are genuinely strong; Creative 63.9 solid. But Growth 27.8 — Sydney's world-class rent-to-income crisis — pulls AMPI hard. Australia is excluded from the Alpha public tier under SLIC's editorial rule (cost-of-living for the median resident), and Perth has already claimed Australia's Beta seat by ranking higher.",
    th: "SLIC อันดับ #51 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 89.5 และศักยภาพ 87.1 แข็งจริง ความสร้างสรรค์ 63.9 ดี แต่ Growth 27.8 — วิกฤตค่าเช่าระดับโลกของซิดนีย์ — ดึง AMPI ลงแรง ออสเตรเลียถูกกันออกจาก Alpha สาธารณะตามกฎบรรณาธิการ และเพิร์ธคู่เทียบได้ที่นั่ง Beta ของออสเตรเลียไปแล้วเพราะอันดับสูงกว่า",
    zh: "AMPI 下 SLIC 第 51 名，未获公开层席位。宜居 89.5 与能力 87.1 强劲，创意 63.9 稳健。但增长 27.8 ——悉尼世界级的租金收入比危机——重压 AMPI。按 SLIC 的编辑规则（中位居民可负担），澳大利亚被排除出 Alpha；珀斯已凭更高排名占据澳洲在 Beta 的席位。",
    ko: "AMPI 기준 SLIC 51위, 공개 등급 없음. 생활 가능성 89.5, 역량 87.1, 창의성 63.9 모두 탄탄합니다. 하지만 세계적인 임대료 대비 소득 위기로 인한 성장 압력(27.8)이 AMPI 점수를 크게 낮췄습니다. 호주는 중간 거주자를 위한 물가를 고려한 SLIC의 편집 규칙에 따라 알파 등급에서 제외되었습니다.",
    ja: "AMPIでSLIC 51位、公開ティアなし。生活持続性89.5、能力87.1、創造性63.9はどれも堅実です。しかし、世界的な家賃対収入の危機による成長圧力（27.8）が、AMPIのスコアを大きく引き下げています。オーストラリアは、中間所得層の生活費を考慮したSLICの編集規則により、Alpha層から除外されました。",
  },
  vienna: {
    slicRank: 34,
    en: "SLIC #34 under AMPI, no public-tier seat. Viability 87.1, Capability 74.4, Community 71.1 — Vienna is consistently solid on the classic liveability frame. Creative 41.4 is the drag: Vienna's cultural reputation rests on historical capital more than current output, and the startup ecosystem is modest. The two European Alpha seats are filled by Eindhoven and Graz, and Austria is already claimed by Graz.",
    th: "SLIC อันดับ #34 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 87.1 ศักยภาพ 74.4 ชุมชน 71.1 — เวียนนาแข็งสม่ำเสมอในกรอบความน่าอยู่คลาสสิก Creative 41.4 เป็นตัวถ่วง สองที่นั่ง Alpha ของยุโรปถูกครองโดย Eindhoven และ Graz และออสเตรียถูกอ้างสิทธิ์ผ่าน Graz แล้ว",
    zh: "AMPI 下 SLIC 第 34 名，未获公开层席位。宜居 87.1、能力 74.4、社区 71.1 ——维也纳在经典宜居框架中各项稳健。创意 41.4 是拖累。欧洲两个 Alpha 席位由 Eindhoven 与 Graz 占据，而奥地利已通过 Graz 获得代表。",
    ko: "AMPI 기준 SLIC 34위, 공개 등급 없음. 생활 가능성 87.1, 역량 74.4, 커뮤니티 71.1 등 고전적인 거주 적합성 기준에서는 일관되게 탄탄합니다. 그러나 창의성 41.4가 발목을 잡습니다. 스타트업 생태계는 평범하며, 문화적 명성은 현재의 산출물보다 역사적 자본에 더 많이 의존합니다.",
    ja: "AMPIでSLIC 34位、公開ティアなし。生活持続性87.1、能力74.4、コミュニティ71.1と、古典的な居住性の枠組みでは一貫して堅実です。しかし、創造性41.4が足を引っ張っています。スタートアップのエコシステムは控えめで、文化的な名声は現在の成果よりも歴史的な資本に依存しています。",
  },
  amsterdam: {
    slicRank: 55,
    en: "SLIC #55 under AMPI, no public-tier seat. Viability 97.6 is near-perfect, but Growth 37.6 and Creative 42.8 create pillar variance that AMPI penalises meaningfully. Tolerance indicators remain good but declining as housing pressure and migration tensions bite. Amsterdam under AMPI is no longer a top-40 city.",
    th: "SLIC อันดับ #55 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 97.6 ใกล้สมบูรณ์แบบ แต่ Growth 37.6 และ Creative 42.8 สร้างความแปรปรวนที่ AMPI ลงโทษอย่างมีนัยสำคัญ ตัวชี้วัดความอดกลั้นยังดีแต่ลดลงเพราะแรงกดดันด้านที่อยู่อาศัยและความตึงเครียดด้านการอพยพ อัมสเตอร์ดัมภายใต้ AMPI ไม่ใช่เมือง top-40 อีกต่อไป",
    zh: "AMPI 下 SLIC 第 55 名，未获公开层席位。宜居 97.6 接近完美，但增长 37.6 与创意 42.8 制造的方差被 AMPI 明显惩罚。包容性尚好但在住房与移民压力下下滑。在 AMPI 下阿姆斯特丹已不再是前 40 的城市。",
    ko: "AMPI 기준 SLIC 55위, 공개 등급 없음. 생활 가능성 97.6은 거의 완벽하지만, 성장 압력 37.6과 창의성 42.8이 유의미한 편차를 만들어 AMPI의 페널티를 받습니다. 관용성 지표는 여전히 좋지만, 주거 압박과 이민자 긴장으로 인해 하락하고 있습니다. 암스테르담은 더 이상 상위 40위 내 도시가 아닙니다.",
    ja: "AMPIでSLIC 55位、公開ティアなし。生活持続性97.6はほぼ完璧ですが、成長圧力37.6と創造性42.8がAMPIの大きなペナルティの対象となる差異を生んでいます。寛容性の指標は依然として良好ですが、住宅の圧力と移民の緊張により低下しつつあります。アムステルダムはもはやトップ40の都市ではありません。",
  },
  paris: {
    slicRank: 68,
    en: "SLIC #68 under AMPI, no public-tier seat. Viability 97.9 and Community 69.2 are excellent. Growth 27.7 is among the lowest of any G7 capital — housing burden, median-resident income negative after central rent, working-time pressure at the professional tier. AMPI punishes the extreme outlier: Paris cannot compensate for its affordability catastrophe with Viability and culture, and the European Alpha seats are claimed by smaller cities where residents actually thrive.",
    th: "SLIC อันดับ #68 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 97.9 และชุมชน 69.2 ยอดเยี่ยม Growth 27.7 ต่ำสุดในบรรดาเมืองหลวง G7 — ภาระค่าเช่า รายได้มัธยฐานติดลบ ชั่วโมงทำงานระดับวิชาชีพ AMPI ลงโทษค่าผิดปกติสุดขั้ว ที่นั่ง Alpha ยุโรปถูกครองโดยเมืองเล็กกว่าที่ผู้อยู่อาศัยรุ่งเรืองจริง",
    zh: "AMPI 下 SLIC 第 68 名，未获公开层席位。宜居 97.9 与社区 69.2 出色。增长 27.7 是 G7 首都中最低之列——住房负担、中位居民可支配收入为负、职场工时压力。AMPI 惩罚极端离群值：巴黎无法用宜居与文化补偿其可负担性灾难。欧洲 Alpha 席位由真正让居民安居的小城所占。",
    ko: "AMPI 기준 SLIC 68위, 공개 등급 없음. 생활 가능성 97.9(대중교통, 의료, 문화 인프라)와 창의성 84.1(선도적인 스타트업 허브)은 엘리트 수준입니다. 그러나 교외 분리, 주택 부족, 생활비 압박이 성장 압력(37.4)과 커뮤니티(56.9)를 억누르며 극단적인 편차를 만듭니다.",
    ja: "AMPIでSLIC 68位、公開ティアなし。生活持続性97.9（交通、医療、文化インフラ）と創造性84.1（主要なスタートアップハブ）はエリートレベルです。しかし、郊外の隔離、住宅不足、生活費の圧迫が成長圧力（37.4）とコミュニティ（56.9）を抑制し、極端な差異を生み出しています。",
  },
  auckland: {
    slicRank: 52,
    en: "SLIC #52 under AMPI, no public-tier seat. Viability 92.6 remains strong and Capability 85.7 is genuinely high, but Growth 32.4 and Community 57.2 create the variance that AMPI penalises. Auckland's housing-cost crisis combines with working-hours pressure to drag the overall composite below cities with more even pillar profiles, and Oceania is barred from the Alpha tier under SLIC's editorial rule.",
    th: "SLIC อันดับ #52 ภายใต้ AMPI ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 92.6 ยังแข็งและศักยภาพ 85.7 สูงจริง แต่ Growth 32.4 และ Community 57.2 สร้างความแปรปรวนที่ AMPI ลงโทษ ค่าเช่าและชั่วโมงทำงานในโอ๊กแลนด์ฉุดคะแนนรวมให้ต่ำกว่าเมืองที่มีโปรไฟล์เสาสมดุลกว่า และโอเชียเนียถูกกันออกจาก Alpha ตามกฎบรรณาธิการของ SLIC",
    zh: "AMPI 下 SLIC 第 52 名，未获公开层席位。宜居 92.6 仍强、能力 85.7 确实高，但增长 32.4 与社区 57.2 造成的方差受到 AMPI 惩罚。奥克兰房价危机叠加工时压力，将合成分拉低于支柱剖面更均衡的城市；按 SLIC 编辑规则，大洋洲被排除出 Alpha。",
    ko: "AMPI 기준 SLIC 52위, 공개 등급 없음. 생활 가능성 92.6은 여전히 강력합니다. 문제는 소득과 분리된 주택 시장(성장 압력 30.6)입니다. 뉴질랜드의 감마 등급은 주거 비용 대비 소득 비율이 조금 더 나은 웰링턴(46위)에게 돌아갔습니다.",
    ja: "AMPIでSLIC 52位、公開ティアなし。生活持続性92.6は依然として強力です。問題は、所得から切り離された住宅市場（成長圧力30.6）です。ニュージーランドのGammaティアは、所得に対する住宅費の割合がわずかに良いウェリントン（46位）に譲られました。",
  },
  bangkok: {
    slicRank: 52,
    en: "Bangkok does not appear in the Happy City Index top 50, the EIU top 50, or most standard liveability rankings. SLIC places Bangkok at #52 (pure rank) in the Alpha tier — tenth seat. The gap is the argument. Happy City measures governance delivery and public infrastructure. EIU measures expat-comfort stability. Neither index has a dimension for the world's most visited city (Euromonitor 2024–25), for a Hospitality score that maxes out the dataset at 100.0, for a Gallup acceptance index that exceeds every peer city, for marriage equality (January 2025), for Hanke's lowest macroeconomic stress in the entire 158-city set, for safety at 91.2 out of 100, or for a food, nightlife, and daily-life culture that draws 22 million international arrivals per year. SLIC doesn't argue Bangkok is the best-governed city. It argues that governance is one dimension of a liveable city, and Bangkok clears the dimensions the other indices omit.",
    th: "กรุงเทพฯ ไม่ปรากฏใน 50 อันดับแรกของ Happy City Index, EIU หรือการจัดอันดับความน่าอยู่มาตรฐานส่วนใหญ่ SLIC จัดกรุงเทพฯ ไว้ที่อันดับ #52 (อันดับล้วน) ในชั้น Alpha — ที่นั่งที่สิบ ช่องว่างนี้คือข้อโต้แย้ง Happy City วัดการส่งมอบธรรมาภิบาลและโครงสร้างพื้นฐาน EIU วัดเสถียรภาพสำหรับผู้ถูกส่งมาทำงาน ไม่มีดัชนีใดมีมิติสำหรับเมืองที่มีนักท่องเที่ยวมากที่สุดในโลก คะแนน Hospitality ที่สูงสุดในชุดข้อมูล ความอดกลั้นในชีวิตประจำวัน ความเท่าเทียมทางการสมรส (มกราคม 2568) หรืออาหาร ชีวิตกลางคืน และวัฒนธรรมประจำวันที่ดึงดูดนักท่องเที่ยว 22 ล้านคนต่อปี",
    zh: "曼谷未能进入 Happy City Index、EIU 或大多数标准宜居排名的前 50 名。SLIC 将曼谷列于第 #52 位（纯分），进入 Alpha 层——第十席。这一差距本身就是论据。Happy City 衡量治理质量和公共基础设施。EIU 衡量外派稳定性。没有任何一个指数的维度能涵盖：全球访客最多的城市（Euromonitor 2024–25）、在数据集中最高分（100.0）的接待指标、超越所有同类城市的 Gallup 接受度指数、婚姻平等（2025 年 1 月）、Hanke 全 158 城中最低宏观经济压力、91.2/100 的安全分，以及每年吸引 2200 万国际游客的美食、夜生活与日常文化。",
    ko: "방콕은 Happy City Index, EIU 또는 대부분의 표준 생활 가능성 순위의 상위 50위 안에 들지 않습니다. SLIC는 방콕을 순수 순위 #52, 알파 등급 10번째 자리로 평가합니다. 이 격차가 바로 논거입니다. Happy City는 거버넌스 제공과 공공 인프라를 측정합니다. EIU는 주재원 안정성을 측정합니다. 어떤 지수도 세계에서 방문객이 가장 많은 도시, 데이터셋 최고점(100.0)의 환대 점수, 모든 도시를 초과하는 갤럽 수용 지수, 혼인 평등(2025년 1월), 158개 도시 중 최저 거시경제 스트레스, 91.2의 안전 점수, 연간 2,200만 국제 방문객을 끌어들이는 음식·야간 문화에 대한 차원을 갖추고 있지 않습니다.",
    ja: "バンコクはHappy City Index、EIU、または標準的な居住性ランキングのトップ50には登場しません。SLICはバンコクを純粋な順位#52、アルファ層の10番目の席に位置づけています。このギャップこそが論拠です。Happy Cityはガバナンスの提供と公共インフラを測定します。EIUは駐在員の安定性を測定します。どのインデックスも、世界で最も訪問者が多い都市、データセット最高点（100.0）のホスピタリティスコア、すべての都市を超えるギャラップ受容指数、婚姻平等（2025年1月）、158都市中最低のマクロ経済ストレス、91.2の安全スコア、年間2200万人の国際訪問者を引き付ける食文化・ナイトライフのための次元を持っていません。",
  },
  // ── Global reference cities now in SLIC (added April 2026) ────────────────
  london: {
    slicRank: 29,
    en: "SLIC #29 under AMPI with score 58.2, public-tier Gamma. The weighted mean of London's other four pillars sits in the 59–83 range — a profile that would place it well inside the top-20 of any conventional index. AMPI's imbalance penalty is what drops it, because Growth at 35.1 is so far below those other pillars. For the median Londoner, central rent wipes out net salary before other essentials. London earns Gamma — visible on the public shelf, but openly classified as a city the median resident cannot afford.",
    th: "SLIC อันดับ #29 ภายใต้ AMPI คะแนน 58.2 ชั้นสาธารณะ Gamma ค่าเฉลี่ยของอีกสี่เสาลอนดอนอยู่ในช่วง 59–83 — โปรไฟล์ที่จะจัดอยู่ใน top-20 ของดัชนีทั่วไป แต่การลงโทษความไม่สมดุลของ AMPI ฉุดลง เพราะ Growth ที่ 35.1 ต่ำกว่าเสาอื่นมาก สำหรับคนลอนดอนทั่วไป ค่าเช่าใจกลางกินเงินเดือนสุทธิก่อนค่าใช้จ่ายอื่น ลอนดอนได้ Gamma — มองเห็นบนชั้นสาธารณะ แต่ถูกจัดอย่างตรงไปตรงมาว่าเป็นเมืองที่ผู้อยู่อาศัยมัธยฐานไม่อาจรับได้",
    zh: "AMPI 下 SLIC 第 29 名，得分 58.2，公开层为 Gamma。伦敦另外四根支柱位于 59–83 区间——常规指数中这种剖面会稳居前 20。但 AMPI 的失衡惩罚将其压低，因为增长支柱 35.1 远低于其他支柱。对典型伦敦人而言，市中心房租在扣除其他必需开销前便吞没净薪。伦敦获得 Gamma——公开层面可见，但被明确标识为中位居民负担不起的城市。",
    ko: "AMPI 기준 SLIC 29위, 58.2점, 공개 등급 감마(Gamma). 런던의 다른 네 가지 지주는 59~83 사이로 평범한 지수에서는 안정적으로 상위 20위에 들 것입니다. 그러나 성장 압력(35.1)이 매우 낮아 AMPI 편차 페널티로 순위가 내려갔습니다. 평범한 런던 시민에게 도심 임대료는 필수 생활비를 제외하기도 전에 순소득을 집어삼킵니다.",
    ja: "AMPIでSLIC 29位、スコア58.2、公開ティアはGamma。ロンドンの他の4つの柱は59〜83の間にあり、通常の指数では安定してトップ20に入るでしょう。しかし、成長圧力（35.1）が他よりも著しく低いため、AMPIの差異ペナルティにより順位が下がりました。典型的なロンドン市民にとって、都心の家賃は他の必須生活費を差し引く前に純収入を飲み込んでしまいます。",
  },
  "new york": {
    slicRank: 36,
    en: "SLIC #36 under AMPI with score 57.7, no public-tier seat. Weighted-mean tells you NYC's four strong pillars sit between 68 and 85 — an apex profile. AMPI tells you the weighted mean lies: Growth at 27.1 is such a catastrophic outlier against Capability 82 and Creative 75.3 that the overall score drops materially. The United States is already represented on the public shelf by Raleigh in Alpha — a city where the median resident actually thrives — and NYC's median-resident affordability falls below every public-tier floor. The city most mainstream indices rank top-5 lands, under honest pillar-imbalance scoring, in no public tier at all.",
    th: "AMPI ทำให้ SLIC ของ NYC อยู่อันดับ #36 คะแนน 57.7 ไม่มีที่นั่งในชั้นสาธารณะ ค่าเฉลี่ยถ่วงน้ำหนักของสี่เสาที่แข็งอยู่ระหว่าง 68–85 — โปรไฟล์ระดับยอด แต่ AMPI บอกว่าค่าเฉลี่ยโกหก: Growth 27.1 เป็นค่าผิดปกติรุนแรงเทียบกับ Capability 82 และ Creative 75.3 จนคะแนนรวมตกลงมาก สหรัฐอเมริกามีตัวแทนสาธารณะแล้วผ่าน Raleigh ใน Alpha — เมืองที่ผู้อยู่อาศัยมัธยฐานรุ่งเรืองจริง — และความสามารถในการอยู่อาศัยของผู้อยู่ NYC ต่ำกว่าพื้นทุกชั้นสาธารณะ เมืองที่ดัชนีกระแสหลักจัด top-5 — ภายใต้การให้คะแนนความไม่สมดุลอย่างตรงไปตรงมา — ลงเอยที่ไม่มีชั้นสาธารณะเลย",
    zh: "AMPI 下 SLIC 第 36 名，得分 57.7，未获公开层席位。加权均值告诉你纽约的四根强支柱位于 68–85 ——顶级剖面。但 AMPI 揭穿了这个均值：增长 27.1 相对于能力 82 与创意 75.3 是灾难性的离群值，令总分明显下降。美国已在公开层由 Raleigh 代表（其中位居民真正安居），而纽约的可负担性低于所有公开层门槛。这座主流指数排进前 5 的城市，在诚实衡量支柱失衡时，未能进入任何公开层。",
    ko: "AMPI 기준 SLIC 36위, 57.7점, 공개 등급 없음. 가중 평균으로 볼 때 뉴욕의 네 가지 지주는 68~85 사이로 최상위권입니다. 그러나 성장 압력(27.1)이 역량(82)과 창의성(75.3)에 비해 너무나 파괴적인 아웃라이어여서 전체 점수가 크게 떨어졌습니다. 대부분의 주류 지수가 상위 5위에 놓는 도시는 지주 간의 불균형을 정직하게 측정했을 때 어떤 공개 등급에도 들지 못했습니다.",
    ja: "AMPIでSLIC 36位、スコア57.7、公開ティアなし。加重平均で見ると、NYCの4つの強力な柱は68〜85の間にあり、トップクラスのプロファイルです。しかし、成長圧力（27.1）が能力（82）や創造性（75.3）に対して壊滅的な外れ値であるため、全体のスコアは大幅に低下しました。主流の指数がトップ5にランク付けする都市は、柱の不均衡を正直にスコアリングした場合、どの公開ティアにも属しません。",
  },
  tokyo: {
    slicRank: 21,
    en: "SLIC #21 under AMPI with score 59.5, public-tier Beta. Tokyo's Viability 94.2 is among the highest of any top-30 city (homicide 0.25/100k, clean air, safe streets), Capability 76.8 is strong, and Community 70.2 is solid. Variance still bites — Growth 46.2 (long hours, household debt) and Creative 44.2 (modest startup density) are below the others — and Tokyo is barred from Alpha under SLIC's editorial rule (cost-of-living for the median resident). Japan's Alpha seat goes to Fukuoka — quieter, more affordable, and more honest about how Japanese residents actually live. Tokyo earns Beta: globally famous, structurally compromised, openly classified.",
    th: "SLIC อันดับ #21 ภายใต้ AMPI คะแนน 59.5 ชั้นสาธารณะ Beta ความน่าอยู่ของโตเกียว 94.2 อยู่ในกลุ่มสูงสุดของ top-30 (ฆาตกรรม 0.25/100k อากาศสะอาด ถนนปลอดภัย) ศักยภาพ 76.8 แข็ง และชุมชน 70.2 มั่นคง ยังมีความแปรปรวน — Growth 46.2 (ชั่วโมงยาว หนี้ครัวเรือน) และ Creative 44.2 (ความหนาแน่นสตาร์ทอัพปานกลาง) ต่ำกว่าเสาอื่น — และโตเกียวถูกกันออกจาก Alpha ตามกฎบรรณาธิการของ SLIC (ค่าครองชีพของผู้อยู่อาศัยมัธยฐาน) ที่นั่ง Alpha ของญี่ปุ่นจึงเป็นของฟุกุโอกะ — เงียบกว่า รับได้กว่า ตรงกับวิธีที่ผู้อยู่อาศัยญี่ปุ่นจริงใช้ชีวิต โตเกียวได้ Beta: ดังระดับโลก แตกร้าวเชิงโครงสร้าง ถูกจัดประเภทอย่างเปิดเผย",
    zh: "AMPI 下 SLIC 第 21 名，得分 59.5，公开层为 Beta。东京宜居支柱 94.2 是前 30 名最高之列（凶杀 0.25/10万、空气清洁、街道安全），能力 76.8 强，社区 70.2 稳健。方差仍存——增长 46.2（长工时、家庭债务）与创意 44.2（创业密度中等）低于其他——按 SLIC 的编辑规则（中位居民可负担），东京被排除出 Alpha。日本的 Alpha 席位归福冈所有——更安静、更可负担，也更贴近日本居民的真实生活。东京获 Beta：全球闻名、结构受损、明确分类。",
    ko: "AMPI 기준 SLIC 21위, 59.5점, 공개 등급 베타(Beta). 도쿄의 생활 가능성 94.2는 상위 30개 도시 중 최고 수준입니다. 역량(76.8)도 강력하고 커뮤니티(70.2)도 탄탄합니다. 그러나 장시간 노동, 가계 부채를 반영하는 성장 압력(46.2)과 평범한 스타트업 밀도를 반영하는 창의성(44.2)이 발목을 잡았습니다. 도쿄는 중간 거주자 물가를 중시하는 SLIC 원칙에 따라 알파에서 제외되었습니다.",
    ja: "AMPIでSLIC 21位、スコア59.5、公開ティアはBeta。東京の生活持続性94.2は、トップ30都市の中で最も高いものの一つです。能力76.8も強力であり、コミュニティ70.2も堅実です。しかし、長時間労働と家計債務を反映する成長圧力（46.2）や控えめなスタートアップ密度を反映する創造性（44.2）が足を引っ張っています。東京は、中間所得層の生活費を重視するSLICの規則によりAlphaから除外されました。",
  },
  // Cities still outside SLIC's 163-city dataset
  barcelona: {
    en: "Outside SLIC's current 163-city coverage. Tourism-driven rent inflation and working-time pressure above Northern European norms would be SLIC's primary concerns, alongside documented deterioration in housing affordability.",
    th: "บาร์เซโลนาอยู่นอกชุดข้อมูล 163 เมืองของ SLIC ปัจจุบัน ค่าเช่าที่พุ่งจากการท่องเที่ยวและชั่วโมงทำงานที่สูงกว่าค่าเฉลี่ยยุโรปเหนือจะเป็นปัญหาหลัก",
    zh: "巴塞罗那目前不在SLIC的163座城市数据集中。旅游驱动的租金上涨、高于北欧规范的工时压力，以及有据可查的住房可负担性恶化，将是SLIC关注的首要问题。",
    ko: "현재 SLIC의 163개 도시 데이터 세트에는 포함되지 않습니다. 관광으로 인한 임대료 상승, 북유럽 기준을 초과하는 장시간 노동 압력, 그리고 기록된 주거 부담의 악화가 SLIC의 주요 우려 사항입니다.",
    ja: "現在のSLICの163都市のデータセットには含まれていません。観光主導の家賃高騰、北欧の基準を超える長時間労働の圧力、および記録されている住宅負担の悪化が、SLICの主な懸念事項です。",
  },
  madrid: {
    en: "Outside SLIC's current 163-city coverage. Worsening housing affordability in recent years and documented working-time culture exceeding Northern European norms are the two likeliest SLIC pressure points.",
    th: "มาดริดอยู่นอกชุดข้อมูล 163 เมืองของ SLIC ปัจจุบัน การที่อยู่อาศัยแย่ลงในช่วงหลัง และวัฒนธรรมการทำงานยาวนานกว่ายุโรปเหนือจะเป็นปัจจัยกดคะแนน",
    zh: "马德里目前不在SLIC的163座城市数据集中。近年来住房可负担性持续恶化，以及高于北欧规范的工时文化，是SLIC最可能重点扣分的两项因素。",
    ko: "현재 SLIC의 163개 도시 데이터 세트에는 포함되지 않습니다. 최근 몇 년간 악화된 주택 거주성 부담과 북유럽 기준을 초과하는 장시간 노동 문화가 가장 유력한 SLIC 페널티 요인입니다.",
    ja: "現在のSLICの163都市のデータセットには含まれていません。近年悪化している住宅の負担と、北欧の基準を超える長時間労働の文化が、SLICでスコアを引き下げる主な要因です。",
  },
};
