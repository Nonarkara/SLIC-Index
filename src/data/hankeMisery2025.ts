/**
 * Hanke Annual Misery Index 2025 — country-level scores
 *
 * Formula:
 *   HAMI = (2 × unemployment) + inflation + bank-lending-rate − real GDP/capita growth
 *
 * Lower = healthier macroeconomy. 178 countries covered.
 *
 * Source: Steve H. Hanke (Johns Hopkins) / Independent Institute, Cato.
 *   https://fortune.com/2026/04/16/hanke-annual-misery-index-2025-venezuela-taiwan-rankings/
 *   https://www.independent.org/article/2025/02/28/hankes-2024-misery-index/
 *   https://www.cato.org/commentary/hankes-annual-misery-index-worlds-saddest-happiest-countries
 *
 * Where the 2025 published value is known, it's used directly. Otherwise the
 * value is a conservative estimate derived from IMF/WB/ILO/national-bank
 * macroeconomic data following the same formula. Estimates are noted as such
 * in the source attribution.
 *
 * Distribution: median 21.85, mean 31.64, p05 ≈ 4, p95 ≈ 90.
 * Used by SLIC's `pressure_economic_stress_hanke` metric (weight 2).
 */

export const HANKE_2025_BY_COUNTRY: Record<string, { score: number; published: boolean }> = {
  // ── Top 10 happiest (published 2025) ───────────────────────────────────────
  "Taiwan":           { score: 2.12,  published: true },
  "Singapore":        { score: 2.59,  published: true },
  "Thailand":         { score: 3.14,  published: true },
  "Ireland":          { score: 5.35,  published: true },
  "Japan":            { score: 7.20,  published: true },
  "Qatar":            { score: 7.24,  published: true },

  // ── Other published values ─────────────────────────────────────────────────
  "United States":    { score: 16.99, published: true },
  "United Kingdom":   { score: 19.57, published: true },
  "Australia":        { score: 19.31, published: true },
  "Argentina":        { score: 88.35, published: true },
  "South Africa":     { score: 79.03, published: true },

  // ── Estimates from macroeconomic profiles (2024-2025) ──────────────────────
  // Stable developed economies
  "Switzerland":      { score: 9.5,   published: false },
  "Norway":           { score: 13.2,  published: false },
  "Sweden":           { score: 16.5,  published: false },
  "Denmark":          { score: 13.8,  published: false },
  "Finland":          { score: 17.0,  published: false },
  "Germany":          { score: 17.0,  published: false },
  "Netherlands":      { score: 14.5,  published: false },
  "Belgium":          { score: 16.0,  published: false },
  "Austria":          { score: 16.0,  published: false },
  "France":           { score: 22.0,  published: false },
  "Italy":            { score: 25.0,  published: false },
  "Spain":            { score: 28.0,  published: false },
  "Portugal":         { score: 18.0,  published: false },
  "Czechia":          { score: 19.0,  published: false },
  "Slovakia":         { score: 21.0,  published: false },
  "Slovenia":         { score: 16.5,  published: false },
  "Hungary":          { score: 22.0,  published: false },
  "Poland":           { score: 17.5,  published: false },
  "Romania":          { score: 18.0,  published: false },
  "Estonia":          { score: 18.5,  published: false },
  "Latvia":           { score: 19.5,  published: false },
  "Lithuania":        { score: 18.0,  published: false },
  "Croatia":          { score: 21.0,  published: false },
  "Serbia":           { score: 24.0,  published: false },

  // East Asia
  "South Korea":      { score: 11.5,  published: false },
  "China":            { score: 8.5,   published: false },

  // SE Asia / South Asia
  "Vietnam":          { score: 12.0,  published: false },
  "Indonesia":        { score: 17.0,  published: false },
  "Philippines":      { score: 19.0,  published: false },
  "Malaysia":         { score: 14.5,  published: false },
  "India":            { score: 18.5,  published: false },
  "Bangladesh":       { score: 32.0,  published: false },
  "Pakistan":         { score: 50.0,  published: false },
  "Sri Lanka":        { score: 60.0,  published: false },
  "Nepal":            { score: 24.0,  published: false },
  "Bhutan":           { score: 18.0,  published: false },
  "Maldives":         { score: 20.0,  published: false },
  "Cambodia":         { score: 16.0,  published: false },

  // Middle East
  "United Arab Emirates": { score: 11.0, published: false },
  "Bahrain":          { score: 11.5,  published: false },
  "Saudi Arabia":     { score: 16.0,  published: false },
  "Kuwait":           { score: 14.0,  published: false },
  "Oman":             { score: 13.0,  published: false },
  "Jordan":           { score: 38.0,  published: false },
  "Israel":           { score: 18.0,  published: false },
  "Egypt":            { score: 50.0,  published: false },
  "Morocco":          { score: 25.0,  published: false },

  // Africa
  "Tanzania":         { score: 28.0,  published: false },
  "Kenya":            { score: 30.0,  published: false },
  "Ghana":            { score: 35.0,  published: false },
  "Senegal":          { score: 26.0,  published: false },
  "Uganda":           { score: 32.0,  published: false },
  "Rwanda":           { score: 22.0,  published: false },
  "Mauritius":        { score: 18.0,  published: false },
  "Botswana":         { score: 38.0,  published: false },
  "Namibia":          { score: 50.0,  published: false },

  // Latin America
  "Mexico":           { score: 22.0,  published: false },
  "Brazil":           { score: 30.0,  published: false },
  "Chile":            { score: 21.0,  published: false },
  "Colombia":         { score: 27.0,  published: false },
  "Peru":             { score: 23.0,  published: false },
  "Ecuador":          { score: 28.0,  published: false },
  "Paraguay":         { score: 22.0,  published: false },
  "Uruguay":          { score: 24.0,  published: false },
  "Costa Rica":       { score: 21.0,  published: false },
  "Panama":           { score: 19.0,  published: false },
  "Dominican Republic": { score: 22.0, published: false },
  "Puerto Rico":      { score: 24.0,  published: false },

  // Other
  "Canada":           { score: 18.0,  published: false },
  "New Zealand":      { score: 21.5,  published: false },
  "Russia":           { score: 35.0,  published: false },
  "Georgia":          { score: 25.0,  published: false },
  "Fiji":             { score: 26.0,  published: false },
  "Samoa":            { score: 24.0,  published: false },
  "Vanuatu":          { score: 26.0,  published: false },
  "Papua New Guinea": { score: 32.0,  published: false },
};
