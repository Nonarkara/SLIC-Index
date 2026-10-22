/**
 * Metric marks.
 *
 * The city scorecard used to explain twenty-two numbers with twenty-two
 * rows of text: a label, a figure, a bar, a citation. The reader had to
 * scroll past a thousand words of scaffolding to find out what was actually
 * being measured.
 *
 * These are the drawings. Each is a 24×24 line illustration of the thing
 * the metric measures — a coin for disposable income, a tap for water
 * access, a key for civic freedom. They are drawn, not typed, so a plate
 * reads as a part in a parts list: you see what is measured before you
 * read how it scored.
 *
 * Every mark is line art on `currentColor` with no fill of its own, so the
 * plate controls the tone. A metric with no mark falls back to a plain
 * tick, which is honest: we did not draw what we could not draw.
 */

import type { JSX } from "react";

const MARKS: Record<string, JSX.Element> = {
  // ── Pressure ────────────────────────────────────────────────────────────
  /* Disposable income (PPP) — a stack of coins. */
  pressure_disposable_income_ppp: (
    <>
      <ellipse cx="12" cy="5.6" rx="7" ry="2.6" />
      <path d="M5 5.6v4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-4" />
      <path d="M5 10.6v4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-4" />
    </>
  ),
  /* Housing burden — a house. */
  pressure_housing_burden: (
    <>
      <path d="M3 11.4 12 4l9 7.4" />
      <path d="M5.4 10.4V20h13.2v-9.6" />
      <path d="M9.8 20v-5.2h4.4V20" />
    </>
  ),
  /* Household debt — a ledger with a balance line. */
  pressure_household_debt_burden: (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h4" />
    </>
  ),
  /* Working time pressure — a clock. */
  pressure_working_time_pressure: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 6.8v5.4l3.6 2.1" />
    </>
  ),
  /* Mental strain — a heart with a crack through it. */
  pressure_suicide_mental_strain: (
    <>
      <path d="M12 20.2S4.6 15.6 4.6 10.8a4.1 4.1 0 0 1 7.4-2.5 4.1 4.1 0 0 1 7.4 2.5c0 4.8-7.4 9.4-7.4 9.4z" />
      <path d="M12 7.2 10.4 11.6l2 .6-1.2 3.4" />
    </>
  ),
  /* Economic stress — a falling line. */
  pressure_economic_stress_hanke: (
    <>
      <path d="M3.4 3.6v16.8h17.2" />
      <path d="M6.2 7.6 10 11l3.4-1.8 4.8 7.4" />
    </>
  ),

  // ── Viability ───────────────────────────────────────────────────────────
  /* Personal safety — a shield. */
  viability_personal_safety: (
    <>
      <path d="M12 3.2 19 6v6.1c0 4.3-2.9 7.5-7 8.8-4.1-1.3-7-4.5-7-8.8V6z" />
    </>
  ),
  /* Transit access — a rail car. */
  viability_transit_access_commute: (
    <>
      <rect x="4.6" y="3.4" width="14.8" height="13" rx="2.4" />
      <path d="M4.6 10.4h14.8" />
      <circle cx="8.8" cy="13.4" r="1" />
      <circle cx="15.2" cy="13.4" r="1" />
      <path d="M7.4 20.4 6 22M16.6 20.4 18 22" />
    </>
  ),
  /* Clean air — wind. */
  viability_clean_air: (
    <>
      <path d="M3 8h10.2a3 3 0 1 0-3-3" />
      <path d="M3 13h13.4a3 3 0 1 1-3 3" />
      <path d="M3 18h7.4" />
    </>
  ),
  /* Water and sanitation — a tap and a drop. */
  viability_water_sanitation_utility: (
    <>
      <path d="M3 9h6.4v3.6H13" />
      <path d="M9.4 9V5.4h4.4V9" />
      <path d="M13 12.6v2.6" />
      <path d="M13 19.6a1.9 1.9 0 0 0 3.8 0c0-1.4-1.9-3.6-1.9-3.6s-1.9 2.2-1.9 3.6z" />
    </>
  ),
  /* Digital infrastructure — an antenna. */
  viability_digital_infrastructure: (
    <>
      <path d="M12 9.6v11.2" />
      <path d="M7.6 20.8 12 9.6l4.4 11.2" />
      <path d="M9.2 6.4a4 4 0 0 1 5.6 0" />
      <path d="M6.6 3.8a8 8 0 0 1 10.8 0" />
      <circle cx="12" cy="9.6" r="1.5" />
    </>
  ),

  // ── Capability ──────────────────────────────────────────────────────────
  /* Healthcare quality — a cross. */
  capability_healthcare_quality: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4v9.2M7.4 12h9.2" />
    </>
  ),
  /* Education quality — an open book. */
  capability_education_quality: (
    <>
      <path d="M3 5.2h5.6a3.4 3.4 0 0 1 3.4 3.4v11a2.6 2.6 0 0 0-2.6-2.4H3z" />
      <path d="M21 5.2h-5.6A3.4 3.4 0 0 0 12 8.6v11a2.6 2.6 0 0 1 2.6-2.4H21z" />
    </>
  ),
  /* Distributional fairness — a balance. */
  capability_equal_opportunity_distributional_fairness: (
    <>
      <path d="M12 4.4v15.2" />
      <path d="M6 19.6h12" />
      <path d="M4 8.4h16" />
      <path d="M4 8.4 1.6 14h4.8z" />
      <path d="M20 8.4 17.6 14h4.8z" />
    </>
  ),

  // ── Community ───────────────────────────────────────────────────────────
  /* Belonging — one figure inside a ring of others. */
  community_hospitality_belonging: (
    <>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="4.4" r="1.5" />
      <circle cx="18.7" cy="8.2" r="1.5" />
      <circle cx="18.7" cy="15.8" r="1.5" />
      <circle cx="12" cy="19.6" r="1.5" />
      <circle cx="5.3" cy="15.8" r="1.5" />
      <circle cx="5.3" cy="8.2" r="1.5" />
    </>
  ),
  /* Tolerance — two overlapping circles. */
  community_tolerance_pluralism: (
    <>
      <circle cx="9.2" cy="12" r="6.2" />
      <circle cx="14.8" cy="12" r="6.2" />
    </>
  ),
  /* Cultural and public life — a colonnade. */
  community_cultural_historic_public_life_vitality: (
    <>
      <path d="M3.4 20.6h17.2" />
      <path d="M4.4 6.4h15.2" />
      <path d="M7.4 6.4v14.2M12 6.4v14.2M16.6 6.4v14.2" />
      <path d="M4.4 6.4 12 2.8l7.6 3.6" />
    </>
  ),
  /* Civic freedom — a key. */
  community_civic_freedom_dignity: (
    <>
      <circle cx="7.8" cy="12" r="4.6" />
      <path d="M12.4 12H21" />
      <path d="M17.2 12v3.6M20 12v2.4" />
    </>
  ),

  // ── Creative ────────────────────────────────────────────────────────────
  /* Entrepreneurial dynamism — a rocket. */
  creative_entrepreneurial_dynamism: (
    <>
      <path d="M12 2.6c3.4 2.4 5.4 6 5.4 9.9l-2.4 3.1H9L6.6 12.5c0-3.9 2-7.5 5.4-9.9z" />
      <circle cx="12" cy="9.4" r="2" />
      <path d="M9 15.6 6.6 21l3.4-1.8M15 15.6l2.4 5.4-3.4-1.8" />
    </>
  ),
  /* Innovation and research — a bulb. */
  creative_innovation_research_intensity: (
    <>
      <path d="M9.2 16.6a5.8 5.8 0 1 1 5.6 0v2.8a1.6 1.6 0 0 1-1.6 1.6h-2.4a1.6 1.6 0 0 1-1.6-1.6z" />
      <path d="M9.4 16.6h5.2" />
    </>
  ),
  /* Productive context — a factory. */
  creative_economic_vitality_productive_context: (
    <>
      <path d="M3 20.4V10.6l6 3.4v-3.4l6 3.4v-3.4l6 3.4v9.4z" />
      <path d="M2 20.4h20" />
    </>
  ),
  /* Administrative friction — a stamp. */
  creative_administrative_investment_friction: (
    <>
      <path d="M9 3.2h6v4.6l2 3.4H7l2-3.4z" />
      <path d="M12 11.2v4.6" />
      <path d="M6.2 19.4h11.6v2.2H6.2z" />
    </>
  ),
};

/** A neutral mark for a metric we have no drawing for. */
function FallbackMark() {
  return (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M8.2 12h7.6" />
    </>
  );
}

export default function MetricMark({ metricKey }: { metricKey: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {MARKS[metricKey] ?? <FallbackMark />}
    </svg>
  );
}
