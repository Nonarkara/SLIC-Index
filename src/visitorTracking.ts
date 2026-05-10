/**
 * Visitor tracking — dual-write to Google Sheets + Supabase.
 *
 * Google Sheets remains the primary store (already collecting since launch).
 * Supabase receives a parallel INSERT when env vars are configured.
 * Neither failure blocks the other.
 */

import { supabase } from "./supabaseClient";

const GOOGLE_SHEETS_TRACKING =
  "https://script.google.com/macros/s/AKfycbzSIskjTOoavYg6U_uLgG9xjRY4FLuv2tuYhT-FGuHE1aSt6-rdqnu_u_-49eMBslZQ/exec";

const GOOGLE_SHEETS_COUNT =
  "https://script.google.com/macros/s/AKfycbzSIskjTOoavYg6U_uLgG9xjRY4FLuv2tuYhT-FGuHE1aSt6-rdqnu_u_-49eMBslZQ/exec";

/* ── Geolocation helper ── */

interface GeoData {
  ip: string;
  country: string;
  region: string;
  city: string;
}

async function fetchGeo(): Promise<GeoData> {
  try {
    const r = await fetch("https://ipapi.co/json/");
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
    /* geo blocked or failed — non-critical */
  }
  return { ip: "Unknown", country: "Unknown", region: "Unknown", city: "Unknown" };
}

/* ── Track visitor (dual-write) ── */

export async function trackVisitor(page = "/") {
  if (sessionStorage.getItem("slic_tracked")) return;

  const geo = await fetchGeo();
  const userAgent = navigator.userAgent;
  const referrer = document.referrer || "Direct";

  // Mark tracked early to prevent double-fire even if writes fail
  sessionStorage.setItem("slic_tracked", "true");

  // 1. Google Sheets (fire-and-forget, no-cors)
  // Send the full set of fields the Apps Script can record so visits via
  // slic.nonarkara.org are distinguishable from legacy nonarkara.github.io paths.
  fetch(GOOGLE_SHEETS_TRACKING, {
    method: "POST",
    mode: "no-cors",
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
        version: "v2",
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase visitor insert failed:", error.message);
      });
  }
}

/* ── Visitor stats (Supabase primary, Google Sheets fallback) ── */

export interface VisitorStats {
  count: number;
  countries: Array<{ country: string; pct: number }>;
}

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
  try {
    const r = await fetch(GOOGLE_SHEETS_COUNT, { mode: "cors" });
    const d = await r.json();
    return {
      count: d.count ?? 12424,
      countries: d.countries ?? [],
    };
  } catch {
    return { count: 12424, countries: [] };
  }
}
