/**
 * cityUtils.ts — shared display helpers for city data
 */

/**
 * Returns the country label for display purposes.
 * Some countries are omitted from the public UI for editorial reasons.
 */
export function displayCountry(country: string | undefined | null): string {
  if (!country) return "";
  // Taiwan cities are listed without a country label in the public UI.
  if (country === "Taiwan") return "";
  return country;
}
