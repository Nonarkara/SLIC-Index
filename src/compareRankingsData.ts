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
    slicRank: 33,
    en: "Happy City Index 2026 places Singapore at #22 — strong on Governance and Mobility, exactly what Singapore's state capacity delivers. Hanke ranks it #2 'happiest economy' in 2025 on macroeconomic stability alone. SLIC scores Singapore at #33 (pure rank, SLIC 63.3) in Alpha tier (slot 7): Capability 94.1, Viability 90.4, and Creative 73.3 are elite, and Community 47.4 and Pressure 44.1 clear the Alpha floor — yet AMPI penalises the spread between 90+ state capacity and everyday pressure (long work weeks, housing burden, and civic tightness).",
    th: "Happy City Index 2026 จัดสิงคโปร์อยู่ที่ #22 — แข็งแกร่งด้านธรรมาภิบาลและระบบขนส่ง ส่วน Hanke จัดอยู่อันดับ #2 ด้านเสถียรภาพมหภาค SLIC ให้คะแนนสิงคโปร์ที่อันดับ #33 (อันดับล้วน, SLIC 63.3) ในชั้นสาธารณะ Alpha (สล็อต 7): Capability 94.1, Viability 90.4 และ Creative 73.3 อยู่ระดับแถวหน้า ขณะที่ Community 47.4 และ Pressure 44.1 ผ่านพื้น Alpha — แต่ AMPI ยังลงโทษช่องว่างระหว่างขีดความสามารถรัฐระดับ 90+ กับแรงกดดันรายวัน (ชั่วโมงทำงาน ภาระค่าที่อยู่อาศัย และพื้นที่พลเมือง)",
    zh: "Happy City Index 2026 将新加坡列为 #22——在治理与交通方面表现强劲；Hanke 则仅凭宏观稳定将其排在第 2。SLIC 将新加坡评为纯分第 #33（SLIC 63.3），位列 Alpha 层第 7 席：能力 94.1、宜居 90.4 与创意 73.3 均属顶级，社区 47.4 与压力 44.1 越过 Alpha 底线——但 AMPI 仍惩罚 90+ 国家能力与日常压力（长工时、住房负担与公民空间收紧）之间的落差。",
    ko: "Happy City Index 2026는 싱가포르를 #22로, Hanke는 거시경제 안정성만으로 2위로 평가합니다. SLIC는 싱가포르를 순수 순위 #33(SLIC 63.3), Alpha 등급(7번 슬롯)으로 분류합니다. 역량 94.1, 생존 가능성 90.4, 창의성 73.3은 최상위권이며 커뮤니티 47.4와 압력 44.1도 Alpha 기준선을 넘지만, AMPI는 90점대 국가 역량과 40점대 일상 압박(장시간 노동, 주거 부담, 시민 공간 제약) 사이의 편차를 패널티로 반영합니다.",
    ja: "Happy City Index 2026ではシンガポールは#22、Hankeではマクロ安定性のみで2位です。SLICはシンガポールを純粋順位#33（SLIC 63.3）、Alphaティア（7枠）に位置づけます。能力94.1、生活維持性90.4、創造性73.3は最上位であり、コミュニティ47.4と圧力44.1もAlpha最低線をクリアしますが、AMPIは90点台の国家能力と40点台の日常圧力（長時間労働、住宅負担、市民空間の制約）の格差を減点します。",
  },
  zurich: {
    slicRank: 47,
    en: "SLIC #47 under AMPI (SLIC 60.5), public-tier Gamma (slot 5). Viability 98.2 is near-perfect (safety, air, water, digital) and Community 82.2 is strong. But Pressure 40.4 — disposable income after Swiss rents and housing burden — and Creative 49.4 create enough variance that AMPI pulls the overall score down. Zurich scores the way Zurich actually is: immaculate, moderately dynamic, and crushingly expensive.",
    th: "SLIC อันดับ #47 ภายใต้ AMPI (SLIC 60.5) ชั้นสาธารณะ Gamma (สล็อต 5) ความน่าอยู่ 98.2 ใกล้สมบูรณ์แบบ ชุมชน 82.2 แข็งแกร่ง แต่ Pressure 40.4 — รายได้คงเหลือหลังค่าเช่าสวิสและภาระที่อยู่อาศัย — และ Creative 49.4 สร้างความแปรปรวนจน AMPI ฉุดคะแนนรวมลง",
    zh: "AMPI 下 SLIC 第 47 名（SLIC 60.5），公开层为 Gamma（第 5 席）。宜居 98.2 接近完美，社区 82.2 稳健。但压力 40.4（瑞士房租后的可支配收入与住房负担）与创意 49.4 制造的方差足以令 AMPI 拉低总分。苏黎世得分如实：无可挑剔、中等活力、贵得令人窒息。",
    ko: "AMPI 기준 SLIC 47위(SLIC 60.5), 공개 등급 감마(5번 슬롯). 생활 가능성 98.2는 거의 완벽하고 커뮤니티 82.2도 탄탄합니다. 그러나 스위스의 높은 임대료와 주거 부담이 반영된 압력(40.4)과 창의성(49.4)의 편차가 AMPI 전체 점수를 끌어내렸습니다. 취리히는 흠잡을 데 없고 적당히 역동적이지만 엄청나게 비쌉니다.",
    ja: "AMPIでSLIC 47位（SLIC 60.5）、公開ティアはGamma（5枠）。生活維持性98.2はほぼ完璧で、コミュニティ82.2も堅実です。しかし、スイスの高い家賃と住宅負担を反映した圧力（40.4）と創造性（49.4）の差異がAMPIの総合スコアを引き下げています。チューリッヒは非の打ち所がなく、適度にダイナミックですが、圧倒的に高価です。",
  },
  copenhagen: {
    slicRank: 12,
    en: "SLIC #12 under AMPI (SLIC 67.1), public-tier Alpha (slot 4). Community 91.0 is the second-highest social-cohesion signal in the dataset (tolerance, gender equality, social trust), and Viability 98.4 sits near the top of the scale. Pressure at 43.7 — reflecting Copenhagen's sharp housing-cost rise over the past decade — keeps AMPI's imbalance penalty active, yet Copenhagen still clears the Alpha floor and earns Europe's second Alpha seat.",
    th: "SLIC อันดับ #12 ภายใต้ AMPI (SLIC 67.1) ชั้นสาธารณะ Alpha (สล็อต 4) ชุมชน 91.0 เป็นสัญญาณความสามัคคีทางสังคมสูงสุดอันดับสองของชุดข้อมูล ความน่าอยู่ 98.4 อยู่ที่ระดับยอดสุด แม้ Pressure 43.7 จากค่าเช่าที่พุ่งสูงในรอบทศวรรษจะทำให้ AMPI หักคะแนนความไม่สมดุล แต่โคเปนเฮเกนยังผ่านพื้น Alpha และครองที่นั่ง Alpha ที่สองของยุโรป",
    zh: "AMPI 下 SLIC 第 12 名（SLIC 67.1），公开层为 Alpha（第 4 席）。社区 91.0 位列全数据集第二强的社会凝聚信号，宜居 98.4 居于前列。尽管压力 43.7（哥本哈根过去十年房价大涨）令 AMPI 失衡惩罚生效，哥本哈根仍越过 Alpha 底线并赢得欧洲的 Alpha 席位。",
    ko: "AMPI 기준 SLIC 12위(SLIC 67.1), 공개 등급 알파(4번 슬롯). 커뮤니티 91.0은 데이터셋에서 두 번째로 강한 사회적 유대 신호이며, 생활 가능성 98.4는 최상위권입니다. 지난 10년간 집값 상승을 반영한 압력(43.7)이 AMPI 패널티를 작동시키지만, 코펜하겐은 Alpha 기준선을 넘어 Alpha 자리를 확보했습니다.",
    ja: "AMPIでSLIC 12位（SLIC 67.1）、公開ティアはAlpha（4枠）。コミュニティ91.0はデータセットで2番目に強い社会的結束のシグナルであり、生活維持性98.4も最上位クラスです。過去10年間の住宅費上昇を反映した圧力（43.7）がAMPIペナルティを働かせつつも、コペンハーゲンはAlpha最低線をクリアしてAlpha枠を獲得しています。",
  },
  sydney: {
    slicRank: 23,
    en: "SLIC #23 under AMPI (SLIC 64.4), no public-tier seat. Viability 92.7 and Capability 92.4 are genuinely strong; Creative 63.9 is solid. But Pressure 40.7 — Sydney's rent-to-income crunch — pulls AMPI down, and Melbourne (#9, SLIC 67.6) has already claimed Australia's Beta seat under the country-cap rules.",
    th: "SLIC อันดับ #23 ภายใต้ AMPI (SLIC 64.4) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 92.7 และศักยภาพ 92.4 แข็งจริง ความสร้างสรรค์ 63.9 ดี แต่ Pressure 40.7 — วิกฤตค่าเช่าต่อรายได้ของซิดนีย์ — ดึง AMPI ลง และเมลเบิร์น (#9, SLIC 67.6) ครองที่นั่ง Beta ของออสเตรเลียไปแล้วตามกฎเพดานประเทศ",
    zh: "AMPI 下 SLIC 第 23 名（SLIC 64.4），未获公开层席位。宜居 92.7 与能力 92.4 强劲，创意 63.9 稳健。但压力 40.7——悉尼的租金收入比危机——拉低了 AMPI，而墨尔本（#9，SLIC 67.6）已按国别上限规则占据澳大利亚的 Beta 席位。",
    ko: "AMPI 기준 SLIC 23위(SLIC 64.4), 공개 등급 없음. 생활 가능성 92.7, 역량 92.4, 창의성 63.9 모두 탄탄합니다. 그러나 소득 대비 임대료 부담을 반영한 압력(40.7)이 AMPI를 끌어내리며, 멜버른(#9, SLIC 67.6)이 국가별 상한 규칙에 따라 호주의 Beta 자리를 먼저 차지했습니다.",
    ja: "AMPIでSLIC 23位（SLIC 64.4）、公開ティアなし。生活維持性92.7、能力92.4、創造性63.9はいずれも堅実です。しかし家賃対所得の負担を反映した圧力（40.7）がAMPIを引き下げ、メルボルン（#9、SLIC 67.6）が国別上限ルールによりオーストラリアのBeta枠を先に確保しています。",
  },
  vienna: {
    slicRank: 53,
    en: "SLIC #53 under AMPI (SLIC 59.5), no public-tier seat. Viability 90.1, Capability 83.1, and Community 75.7 — Vienna is consistently solid on the classic liveability frame. Creative 41.4 and Pressure 45.9 are the drag: Vienna's cultural reputation rests more on historical capital than current startup output, and Austria's public shelf seat is already claimed by Graz (#13, Beta).",
    th: "SLIC อันดับ #53 ภายใต้ AMPI (SLIC 59.5) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 90.1 ศักยภาพ 83.1 ชุมชน 75.7 — เวียนนาแข็งสม่ำเสมอในกรอบความน่าอยู่คลาสสิก Creative 41.4 และ Pressure 45.9 เป็นตัวถ่วง และที่นั่งสาธารณะของออสเตรียถูกครองโดย Graz (#13, Beta) แล้ว",
    zh: "AMPI 下 SLIC 第 53 名（SLIC 59.5），未获公开层席位。宜居 90.1、能力 83.1、社区 75.7 ——维也纳在经典宜居框架中各项稳健。创意 41.4 与压力 45.9 是拖累，且奥地利的公开层席位已由格拉茨（#13，Beta）占据。",
    ko: "AMPI 기준 SLIC 53위(SLIC 59.5), 공개 등급 없음. 생활 가능성 90.1, 역량 83.1, 커뮤니티 75.7 등 고전적인 거주 적합성 기준에서는 일관되게 탄탄합니다. 그러나 창의성 41.4와 압력 45.9가 발목을 잡으며, 오스트리아의 공개 등급 자리는 그라츠(#13, Beta)가 이미 차지했습니다.",
    ja: "AMPIでSLIC 53位（SLIC 59.5）、公開ティアなし。生活維持性90.1、能力83.1、コミュニティ75.7と、古典的な居住性の枠組みでは一貫して堅実です。しかし創造性41.4と圧力45.9が足を引っ張り、オーストリアの公開ティア枠はグラーツ（#13、Beta）が先に確保しています。",
  },
  amsterdam: {
    slicRank: 49,
    en: "SLIC #49 under AMPI (SLIC 59.7), no public-tier seat. Viability 98.2 and Capability 87.3 are elite, but Pressure 42.9 and Creative 42.8 create pillar variance that AMPI penalises meaningfully. The Netherlands' Alpha seat goes to Eindhoven (#5, SLIC 69.6), where median residents face far less housing pressure.",
    th: "SLIC อันดับ #49 ภายใต้ AMPI (SLIC 59.7) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 98.2 และศักยภาพ 87.3 อยู่ระดับแถวหน้า แต่ Pressure 42.9 และ Creative 42.8 สร้างความแปรปรวนที่ AMPI ลงโทษอย่างมีนัยสำคัญ ที่นั่ง Alpha ของเนเธอร์แลนด์ตกเป็นของ Eindhoven (#5, SLIC 69.6)",
    zh: "AMPI 下 SLIC 第 49 名（SLIC 59.7），未获公开层席位。宜居 98.2 与能力 87.3 极强，但压力 42.9 与创意 42.8 制造的方差被 AMPI 明显惩罚。荷兰的 Alpha 席位归埃因霍温（#5，SLIC 69.6）所有。",
    ko: "AMPI 기준 SLIC 49위(SLIC 59.7), 공개 등급 없음. 생활 가능성 98.2와 역량 87.3은 최상위권이지만, 압력 42.9와 창의성 42.8이 만드는 편차로 AMPI 패널티를 받습니다. 네덜란드의 Alpha 자리는 에인트호번(#5, SLIC 69.6)이 차지했습니다.",
    ja: "AMPIでSLIC 49位（SLIC 59.7）、公開ティアなし。生活維持性98.2と能力87.3は最上位ですが、圧力42.9と創造性42.8の差異がAMPIペナルティを生みます。オランダのAlpha枠はアイントホーフェン（#5、SLIC 69.6）が獲得しています。",
  },
  paris: {
    slicRank: 67,
    en: "SLIC #67 under AMPI (SLIC 53.3), no public-tier seat. Viability 98.4 and Community 72.4 are strong, but Pressure 33.1 is among the lowest of any G7 capital — driven by central housing burden and cost pressure for the median resident. AMPI punishes the extreme outlier, and France's public shelf seat goes to Lyon (#28, Beta).",
    th: "SLIC อันดับ #67 ภายใต้ AMPI (SLIC 53.3) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 98.4 และชุมชน 72.4 แข็งแกร่ง แต่ Pressure 33.1 ต่ำสุดในบรรดาเมืองหลวง G7 จากภาระค่าเช่าและค่าครองชีพ AMPI ลงโทษค่าผิดปกติสุดขั้ว และที่นั่งสาธารณะของฝรั่งเศสเป็นของลียง (#28, Beta)",
    zh: "AMPI 下 SLIC 第 67 名（SLIC 53.3），未获公开层席位。宜居 98.4 与社区 72.4 出色，但压力 33.1 是 G7 首都中最低之列——受市中心住房负担与生活成本拖累。AMPI 惩罚极端离群值，法国的公开层席位归里昂（#28，Beta）所有。",
    ko: "AMPI 기준 SLIC 67위(SLIC 53.3), 공개 등급 없음. 생활 가능성 98.4와 커뮤니티 72.4는 강하지만, 압력 33.1은 G7 수도 중 최하위권으로 도심 주거비 부담을 반영합니다. AMPI가 극단적 편차를 패널티로 반영하며, 프랑스의 공개 등급 자리는 리옹(#28, Beta)에 돌아갔습니다.",
    ja: "AMPIでSLIC 67位（SLIC 53.3）、公開ティアなし。生活維持性98.4とコミュニティ72.4は強力ですが、圧力33.1はG7首都の中でも最低水準で、都心の住居費負担を反映しています。AMPIが極端な偏りを減点し、フランスの公開ティア枠はリヨン（#28、Beta）が確保しています。",
  },
  auckland: {
    slicRank: 36,
    en: "SLIC #36 under AMPI (SLIC 62.8), no public-tier seat. Viability 94.3 and Capability 85.7 are genuinely high, and Community 71.9 is solid, but Pressure 44.4 reflects Auckland's housing-cost crunch — dragging the composite behind Christchurch (#26, SLIC 64.0), which holds New Zealand's Beta seat.",
    th: "SLIC อันดับ #36 ภายใต้ AMPI (SLIC 62.8) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ 94.3 และศักยภาพ 85.7 สูงจริง และชุมชน 71.9 แข็งแรง แต่ Pressure 44.4 สะท้อนแรงกดดันค่าที่อยู่อาศัยของโอ๊กแลนด์ จึงตามหลัง Christchurch (#26, SLIC 64.0) ที่ครองที่นั่ง Beta ของนิวซีแลนด์",
    zh: "AMPI 下 SLIC 第 36 名（SLIC 62.8），未获公开层席位。宜居 94.3、能力 85.7 与社区 71.9 均表现稳健，但压力 44.4 反映了奥克兰的住房负担危机，使总分落后于占据新西兰 Beta 席位的基督城（#26，SLIC 64.0）。",
    ko: "AMPI 기준 SLIC 36위(SLIC 62.8), 공개 등급 없음. 생활 가능성 94.3, 역량 85.7, 커뮤니티 71.9 모두 탄탄하지만 압력 44.4가 오클랜드의 주거비 부담을 반영해 뉴질랜드의 Beta 자리를 차지한 크라이스트처치(#26, SLIC 64.0) 뒤에 자리합니다.",
    ja: "AMPIでSLIC 36位（SLIC 62.8）、公開ティアなし。生活維持性94.3、能力85.7、コミュニティ71.9はいずれも堅実ですが、圧力44.4がオークランドの住居費負担を反映し、ニュージーランドのBeta枠を確保したクライストチャーチ（#26、SLIC 64.0）の後塵を拝しています。",
  },
  bangkok: {
    slicRank: 66,
    en: "Bangkok does not appear in the Happy City Index top 50, the EIU top 50, or most standard liveability rankings. SLIC places Bangkok at #66 (pure rank, SLIC 53.5) with no public-tier seat — Community 68.4 and Pressure 42.6 still clear the Alpha floor, but every shelf slot was filled by higher-ranked cities first. The gap is the argument. Happy City measures governance delivery and public infrastructure. EIU measures expat-comfort stability. Neither index has a dimension for the world's most visited city (Euromonitor 2024–25), for hospitality and acceptance scores that exceed most peers, for marriage equality (January 2025), for safety at 91.2 out of 100, or for a food, nightlife, and daily-life culture that draws tens of millions of international arrivals per year. SLIC doesn't argue Bangkok is the best-governed city. It argues that governance is one dimension of a liveable city, and Bangkok clears dimensions the other indices omit — without gaming the tier rules to force the anchor city onto the shelf.",
    th: "กรุงเทพฯ ไม่ปรากฏใน 50 อันดับแรกของ Happy City Index, EIU หรือการจัดอันดับความน่าอยู่มาตรฐานส่วนใหญ่ SLIC จัดกรุงเทพฯ ไว้ที่อันดับ #66 (อันดับล้วน, SLIC 53.5) โดยไม่มีชั้นสาธารณะ — Community 68.4 และ Pressure 42.6 ยังผ่านพื้น Alpha แต่ทุกชั้นถูกเติมโดยเมืองที่อันดับสูงกว่าก่อน ช่องว่างนี้คือข้อโต้แย้ง Happy City วัดการส่งมอบธรรมาภิบาลและโครงสร้างพื้นฐาน EIU วัดเสถียรภาพสำหรับผู้ถูกส่งมาทำงาน ไม่มีดัชนีใดมีมิติสำหรับเมืองที่มีนักท่องเที่ยวมากที่สุดในโลก คะแนน Hospitality และการยอมรับที่สูงกว่าเมืองคู่แข่ง ความเท่าเทียมทางการสมรส (มกราคม 2568) ความปลอดภัย 91.2/100 หรืออาหาร ชีวิตกลางคืน และวัฒนธรรมประจำวันที่ดึงดูดนักท่องเที่ยวหลายสิบล้านคนต่อปี",
    zh: "曼谷未能进入 Happy City Index、EIU 或大多数标准宜居排名的前 50 名。SLIC 将曼谷列于第 #66 位（纯分，SLIC 53.5），无公开层级席位 —— 社区 68.4 与压力 42.6 仍越过 Alpha 底线，但所有层级席位已被更高排名城市占满。这一差距本身就是论据。Happy City 衡量治理交付与公共基础设施。EIU 衡量外派稳定性。没有任何指数涵盖：全球访客最多的城市、超越多数同类的接待与接受度分数、婚姻平等（2025 年 1 月）、91.2/100 的安全分，以及每年吸引数千万国际游客的美食、夜生活与日常文化。",
    ko: "방콕은 Happy City Index, EIU 또는 대부분의 표준 생활 가능성 순위 상위 50위에 들지 않습니다. SLIC는 방콕을 순수 순위 #66(SLIC 53.5), 공개 등급 없음으로 평가합니다 — 커뮤니티 68.4와 압력 42.6은 Alpha 최저선을 넘지만 모든 등급 자리가 더 높은 순위의 도시로 먼저 채워졌습니다. 이 격차가 논거입니다. Happy City는 거버넌스 제공과 공공 인프라를 측정합니다. EIU는 주재원 안정성을 측정합니다.",
    ja: "バンコクはHappy City Index、EIU、または標準的な居住性ランキングのトップ50には登場しません。SLICはバンコクを純粋な順位#66（SLIC 53.5）、公開ティアなしと位置づけています——コミュニティ68.4とプレッシャー42.6はAlpha最低線をクリアしていますが、すべてのティア席がより高い順位の都市で先に埋まりました。このギャップこそが論拠です。",
  },
  // ── Global reference cities now in SLIC (added April 2026) ────────────────
  london: {
    slicRank: 20,
    en: "SLIC #20 under AMPI (SLIC 64.9), public-tier Beta (slot 7). Viability 82.8, Community 71.2, and Capability 69.4 are strong, while Pressure 54.8 and Creative 57.7 keep the profile balanced enough for the top 20. London earns Beta — visible on the public shelf, yet behind smaller European cities where median residents face far lower housing pressure.",
    th: "SLIC อันดับ #20 ภายใต้ AMPI (SLIC 64.9) ชั้นสาธารณะ Beta (สล็อต 7) ความน่าอยู่ 82.8 ชุมชน 71.2 และศักยภาพ 69.4 แข็งแกร่ง ขณะที่ Pressure 54.8 และ Creative 57.7 สมดุลพอให้ติดท็อป 20 ลอนดอนได้ Beta — มองเห็นบนชั้นสาธารณะ แต่ยังตามหลังเมืองยุโรปขนาดเล็กที่ค่าที่อยู่อาศัยกดดันน้อยกว่า",
    zh: "AMPI 下 SLIC 第 20 名（SLIC 64.9），公开层为 Beta（第 7 席）。宜居 82.8、社区 71.2 与能力 69.4 稳健，压力 54.8 与创意 57.7 保持足够均衡，使其进入前 20 并位列 Beta——但仍落后于中位居民住房压力更小的欧洲中小城市。",
    ko: "AMPI 기준 SLIC 20위(SLIC 64.9), 공개 등급 베타(7번 슬롯). 생활 가능성 82.8, 커뮤니티 71.2, 역량 69.4가 탄탄하며 압력 54.8과 창의성 57.7이 균형을 유지해 상위 20위와 Beta 자리를 확보했습니다. 다만 주거비 압박이 덜한 유럽 중소도시들보다는 뒤에 자리합니다.",
    ja: "AMPIでSLIC 20位（SLIC 64.9）、公開ティアはBeta（7枠）。生活維持性82.8、コミュニティ71.2、能力69.4が堅実で、圧力54.8と創造性57.7も一定の均衡を保ちトップ20・Beta枠を獲得しています。ただし住居費圧力の低い欧州中小都市の後塵を拝しています。",
  },
  "new york": {
    slicRank: 16,
    en: "SLIC #16 under AMPI (SLIC 66.4), no public-tier seat. Four strong pillars — Viability 85.4, Capability 82.2, Creative 74.5, and Community 70.5 — put NYC inside the top 20, yet Pressure at 43.8 exposes the median-resident cost crunch, and the United States' Alpha seat is already claimed by higher-ranked Raleigh (#4, SLIC 71.8).",
    th: "SLIC อันดับ #16 ภายใต้ AMPI (SLIC 66.4) ไม่มีที่นั่งในชั้นสาธารณะ สี่เสาหลักที่แข็ง — ความน่าอยู่ 85.4 ศักยภาพ 82.2 ความสร้างสรรค์ 74.5 และชุมชน 70.5 — พา NYC ติดท็อป 20 แต่ Pressure 43.8 สะท้อนแรงกดดันค่าครองชีพ และที่นั่ง Alpha ของสหรัฐฯ ถูกครองโดย Raleigh (#4, SLIC 71.8) แล้ว",
    zh: "AMPI 下 SLIC 第 16 名（SLIC 66.4），未获公开层席位。宜居 85.4、能力 82.2、创意 74.5 与社区 70.5 四根强支柱令纽约跻身前 20，但压力 43.8 暴露了中位居民的成本重压，且美国的 Alpha 席位已由排名更高的罗利（#4，SLIC 71.8）占据。",
    ko: "AMPI 기준 SLIC 16위(SLIC 66.4), 공개 등급 없음. 생활 가능성 85.4, 역량 82.2, 창의성 74.5, 커뮤니티 70.5 네 기둥이 뉴욕을 상위 20위에 올렸지만, 압력 43.8이 주민 생활비 부담을 드러내며 미국의 Alpha 자리는 더 높은 순위의 롤리(#4, SLIC 71.8)가 이미 차지했습니다.",
    ja: "AMPIでSLIC 16位（SLIC 66.4）、公開ティアなし。生活維持性85.4、能力82.2、創造性74.5、コミュニティ70.5の4本柱でトップ20入りしますが、圧力43.8が中間層住民のコスト負担を示し、米国のAlpha枠は上位のローリー（#4、SLIC 71.8）が先に確保しています。",
  },
  tokyo: {
    slicRank: 54,
    en: "SLIC #54 under AMPI (SLIC 59.5), no public-tier seat. Tokyo's Viability 94.2 is elite (low homicide, clean air, safe streets), Community 73.9 is solid, and Capability 70.5 is strong. Variance still bites — Pressure 49.0 (long hours, housing burden) and Creative 42.1 pull the AMPI composite down, while Japan's public shelf seats go to Fukuoka (#38, Alpha) and Sapporo (#42, Gamma).",
    th: "SLIC อันดับ #54 ภายใต้ AMPI (SLIC 59.5) ไม่มีที่นั่งในชั้นสาธารณะ ความน่าอยู่ของโตเกียว 94.2 อยู่ระดับแถวหน้า ชุมชน 73.9 และศักยภาพ 70.5 แข็งแรง แต่ความแปรปรวนจาก Pressure 49.0 และ Creative 42.1 ดึงคะแนน AMPI ลง ขณะที่ที่นั่งสาธารณะของญี่ปุ่นเป็นของฟุกุโอกะ (#38, Alpha) และซัปโปโร (#42, Gamma)",
    zh: "AMPI 下 SLIC 第 54 名（SLIC 59.5），未获公开层席位。东京宜居 94.2 属顶级，社区 73.9 与能力 70.5 稳健。但压力 49.0（长工时与住房负担）与创意 42.1 造成的方差拉低了 AMPI 总分，日本的公开层席位归福冈（#38，Alpha）与札幌（#42，Gamma）所有。",
    ko: "AMPI 기준 SLIC 54위(SLIC 59.5), 공개 등급 없음. 도쿄의 생활 가능성 94.2는 최상위권이며 커뮤니티 73.9와 역량 70.5도 탄탄합니다. 그러나 압력 49.0과 창의성 42.1의 편차가 AMPI 점수를 낮추며, 일본의 공개 등급 자리는 후쿠오카(#38, Alpha)와 삿포로(#42, Gamma)가 차지했습니다.",
    ja: "AMPIでSLIC 54位（SLIC 59.5）、公開ティアなし。東京の生活維持性94.2は最上位、コミュニティ73.9と能力70.5も堅実です。しかし圧力49.0と創造性42.1の差異がAMPI総合スコアを引き下げ、日本の公開ティア枠は福岡（#38、Alpha）と札幌（#42、Gamma）が獲得しています。",
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
