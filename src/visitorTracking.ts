/**
 * Visitor tracking — dual-write to Google Sheets + Supabase.
 *
 * Google Sheets remains the primary store (already collecting since launch).
 * Supabase receives a parallel INSERT when env vars are configured.
 * Neither failure blocks the other, and nothing here may delay the page:
 * every network call is bounded, fire-and-forget, or gated off entirely.
 */

import { supabase } from "./supabaseClient";

const GOOGLE_SHEETS_TRACKING =
  "https://script.google.com/macros/s/AKfycbwzTwBNOseKkvkkjD-LH6B3GWrsFcwS6MTDbn7W5eb3zHxA-swtlHYuwJ3w5PAVXDhU7Q/exec";

/**
 * Read-side endpoint for the live visitor count. Unset by default, on purpose.
 *
 * The Apps Script above sends no Access-Control-Allow-Origin header, so a
 * `mode: "cors"` GET against it is rejected by the browser before JS ever sees
 * a response — and a CORS rejection cannot be silenced from JS, so every page
 * view logged a red console error for a request that structurally could not
 * succeed. Rather than keep hitting an endpoint that cannot answer, the read is
 * gated behind a build-time URL: set VITE_VISITOR_COUNT_URL to a deployment
 * that returns `{count, countries}` WITH a CORS header and the live count comes
 * back; leave it unset and no request is made, no error is logged, and the
 * hero omits the number. A URL (not a boolean) because a fixed Apps Script is
 * a new deployment URL anyway. Never a constant in either branch.
 */
const VISITOR_COUNT_URL: string =
  (import.meta.env.VITE_VISITOR_COUNT_URL as string | undefined) ?? "";

/* ── Geolocation helper ── */

interface GeoData {
  ip: string;
  country: string;
  region: string;
  city: string;
}

const UNKNOWN_GEO: GeoData = {
  ip: "Unknown",
  country: "Unknown",
  region: "Unknown",
  city: "Unknown",
};

/**
 * Hard ceiling on the ipapi lookup. Measured at ~7s on production with
 * intermittent 401s; the tracking POST used to wait on it. Geo is kept (the
 * unified sheet's country column is the only place client geography is
 * recorded — Apps Script doPost cannot see the caller's IP) but bounded: past
 * this window the visit is logged as "Unknown" rather than late or never.
 */
const GEO_TIMEOUT_MS = 1500;

async function fetchGeo(): Promise<GeoData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
  try {
    const r = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    if (r.ok) {
      const d = await r.json();
      return {
        ip: d.ip ?? "Unknown",
        country: d.country_name ?? "Unknown",
        region: d.region ?? "Unknown",
        city: d.city ?? "Unknown",
      };
    }
  } catch {
    /* aborted, blocked, or failed — non-critical */
  } finally {
    clearTimeout(timer);
  }
  return UNKNOWN_GEO;
}

/* ── Track visitor (dual-write) ── */

export async function trackVisitor(page = "/") {
  if (sessionStorage.getItem("slic_tracked")) return;

  // Mark tracked early to prevent double-fire even if writes fail
  sessionStorage.setItem("slic_tracked", "true");

  const geo = await fetchGeo();
  const userAgent = navigator.userAgent;
  const referrer = document.referrer || "Direct";

  // 1. Google Sheets (fire-and-forget, no-cors)
  // Send the full set of fields the Apps Script can record so visits via
  // slic.nonarkara.org are distinguishable from legacy nonarkara.github.io paths.
  // `keepalive` lets the request outlive a quick navigation away; the response
  // is opaque either way, so nothing is read back from it.
  fetch(GOOGLE_SHEETS_TRACKING, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      ...geo,
      userAgent,
      referrer,
      dashboard: "SLIC",
      hostname: window.location.hostname,
      page: window.location.href,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      v: "v3",
    }),
  }).catch(() => {});

  // 2. Supabase (parallel, silent on failure)
  if (supabase) {
    supabase
      .from("visitors")
      .insert({
        ip: geo.ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        user_agent: userAgent,
        referrer,
        page,
        version: "v3",
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase visitor insert failed:", error.message);
      });
  }
}

/* ── Visitor stats (Supabase primary, Google Sheets fallback) ── */

export interface VisitorStats {
  /** null when no live count could be read. Never substitute a constant here — the hero
   *  omits the stat when this is null, which is the honest outcome. */
  count: number | null;
  countries: Array<{ country: string; pct: number }>;
}

const NO_STATS: VisitorStats = { count: null, countries: [] };

export async function getVisitorStats(): Promise<VisitorStats> {
  // Try Supabase first
  if (supabase) {
    try {
      // Total count
      const { count, error: countErr } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });

      if (!countErr && count !== null) {
        // Country breakdown — use RPC or manual aggregation
        // Since we can't GROUP BY easily with the JS client on anon key,
        // we'll fall through to Google Sheets for the breakdown if needed,
        // but return the Supabase count as authoritative.
        const stats = await fetchGoogleSheetsStats();
        return { count, countries: stats.countries };
      }
    } catch {
      /* fall through to Google Sheets */
    }
  }

  // Fallback: Google Sheets
  return fetchGoogleSheetsStats();
}

async function fetchGoogleSheetsStats(): Promise<VisitorStats> {
  // This previously fell back to a hardcoded 12424. The Apps Script sends no
  // Access-Control-Allow-Origin header, so the request always threw and the site
  // always rendered that constant as a live visitor count. A fabricated number is
  // worse than no number on an index whose whole claim is that it can be audited.
  // See VISITOR_COUNT_URL for why the read is now gated off by default.
  if (!VISITOR_COUNT_URL) return NO_STATS;
  try {
    const r = await fetch(VISITOR_COUNT_URL, { mode: "cors" });
    if (!r.ok) return NO_STATS;
    const d = await r.json();
    return {
      count: typeof d.count === "number" ? d.count : null,
      countries: Array.isArray(d.countries) ? d.countries : [],
    };
  } catch {
    return NO_STATS;
  }
}
