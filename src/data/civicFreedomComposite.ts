/**
 * Civic Freedom Dignity Composite — country-level
 *
 * Composite formula:
 *   civic_freedom_dignity = 0.4 × HRMI Empowerment (×10 to scale 0-100)
 *                         + 0.3 × Freedom House Freedom in the World (0-100)
 *                         + 0.3 × V-Dem Liberal Democracy Index (×100)
 *
 * Sources (snapshots ~2024-2025):
 *   - HRMI: https://rightstracker.org/
 *   - Freedom House: https://freedomhouse.org/countries/freedom-world/scores
 *   - V-Dem: https://v-dem.net/data/dataset-archive/
 *
 * Dataset distribution: p05 ≈ 8 (closed autocracies — China, Saudi),
 *                       p95 ≈ 92 (Nordic democracies).
 *
 * Used by SLIC's `community_civic_freedom_dignity` metric (weight 4).
 * The metric explicitly captures what the Hanke Misery Index by design omits:
 * the dignity/restriction dimension of citizen experience.
 */

export const CIVIC_FREEDOM_BY_COUNTRY: Record<string, number> = {
  // ── High-freedom democracies (80+) ─────────────────────────────────────────
  "Norway":            92,
  "Sweden":            90,
  "Finland":           90,
  "Denmark":           90,
  "Netherlands":       86,
  "Belgium":           84,
  "Germany":           86,
  "Austria":           83,
  "Switzerland":       89,
  "Ireland":           88,
  "Canada":            87,
  "Australia":         85,
  "New Zealand":       89,
  "Estonia":           82,
  "Lithuania":         80,
  "Latvia":            78,
  "France":            79,
  "United Kingdom":    81,
  "Italy":             77,
  "Portugal":          83,
  "Spain":             80,
  "Czechia":           80,
  "Slovenia":          80,
  "Slovakia":          75,
  "Japan":             80,
  "Taiwan":            81,
  "Uruguay":           82,
  "Costa Rica":        82,

  // ── Mid-tier democracies (50-79) ───────────────────────────────────────────
  "United States":     74,
  "South Korea":       72,
  "Israel":            66,
  "Chile":             78,
  "Argentina":         70,
  "Panama":            68,
  "Mauritius":         70,
  "Botswana":          68,
  "South Africa":      72,
  "Romania":           70,
  "Hungary":           60,
  "Croatia":           68,
  "Poland":            68,
  "Bulgaria":          65,
  "Brazil":            64,
  "Mexico":            58,
  "Peru":              58,
  "Colombia":          58,
  "Ghana":             63,
  "Senegal":           62,
  "Maldives":          60,
  "Bhutan":            58,
  "Mongolia":          60,
  "India":             52,
  "Indonesia":         50,
  "Philippines":       49,
  "Sri Lanka":         50,
  "Nepal":             56,
  "Tanzania":          48,
  "Kenya":             50,
  "Namibia":           70,
  "Fiji":              55,
  "Samoa":             62,
  "Vanuatu":           65,
  "Papua New Guinea":  55,
  "Dominican Republic":58,
  "Paraguay":          55,
  "Ecuador":           52,
  "Georgia":           55,
  "Serbia":            50,

  // ── Restricted (25-49) ─────────────────────────────────────────────────────
  "Singapore":         39,   // HRMI 3.7, FH 49, V-Dem 0.32 → 14.8 + 14.7 + 9.6
  "Malaysia":          48,
  "Thailand":          40,
  "Pakistan":          38,
  "Bangladesh":        38,
  "Morocco":           38,
  "Jordan":            29,
  "Tunisia":           45,
  "Cambodia":          26,
  "Vietnam":           26,
  "Russia":            17,
  "Uganda":            38,
  "Rwanda":            24,
  "Kuwait":            32,
  "Egypt":             24,

  // ── Authoritarian / closed (≤25) ───────────────────────────────────────────
  "Bahrain":           20,
  "United Arab Emirates": 22,
  "Qatar":             23,
  "Saudi Arabia":      13,
  "Oman":              21,
  "China":             13,
};
