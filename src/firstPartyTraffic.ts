export interface TrafficStats {
  count: number;
  countries: Array<{ country: string; count: number }>;
  firstDay: string | null;
  lastDay: string | null;
  observedDays: number;
  updatedAt: string;
  timezone: string;
  source: string;
}

let inFlight = false;
let acknowledged = false;
let pendingSession: string | null = null;

function disabled(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const win = window as Window & { doNotTrack?: string };
  return nav.globalPrivacyControl === true || [nav.doNotTrack, nav.msDoNotTrack, win.doNotTrack].some(value => value === '1' || value === 'yes');
}

export async function trackVisitor(): Promise<void> {
  // Preview, local and GitHub deployments must never pollute production totals.
  if (window.location.origin !== 'https://slic.nonarkara.org' || disabled() || inFlight || acknowledged) return;
  inFlight = true;
  try {
    let session: string | null = pendingSession;
    try {
      if (sessionStorage.getItem('slic_first_party_ack')) return;
      session = session ?? sessionStorage.getItem('slic_first_party_session');
    } catch { /* Collection still works with storage denied. */ }
    if (!session || !/^[0-9a-f-]{36}$/i.test(session)) session = crypto.randomUUID();
    pendingSession = session;
    try { sessionStorage.setItem('slic_first_party_session', session); } catch { /* Memory dedup remains. */ }
    if (disabled()) return;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (disabled()) return;
      const attemptController = new AbortController();
      const attemptTimeout = setTimeout(() => attemptController.abort(), 2500);
      let response: Response | null = null;
      try {
        response = await fetch('/api/traffic', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session }), credentials: 'omit',
          referrerPolicy: 'no-referrer', keepalive: true, signal: attemptController.signal,
        });
      } catch { /* A committed write may have lost its response; retry the same token. */ }
      finally { clearTimeout(attemptTimeout); }
      if (response?.status === 204) {
        acknowledged = true;
        try { sessionStorage.setItem('slic_first_party_ack', '1'); } catch { /* No persistent identifier needed. */ }
        return;
      }
      if (response && response.status < 500) return;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  } catch { /* Analytics must never interfere with the index. */ }
  finally { inFlight = false; }
}

export async function getTrafficStats(): Promise<TrafficStats | null> {
  if (window.location.origin !== 'https://slic.nonarkara.org' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch('/api/traffic', { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' });
    if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json')) return null;
    const value = await response.json();
    if (!Number.isSafeInteger(value.count) || value.count < 0 || !Number.isSafeInteger(value.observedDays) || value.observedDays < 0 ||
        !Array.isArray(value.countries) || value.countries.length > 300 ||
        !value.countries.every((row: { country: string; count: number }) => row && /^[A-Z]{2}$/.test(row.country) && Number.isSafeInteger(row.count) && row.count > 0) ||
        value.countries.reduce((sum: number, row: { count: number }) => sum + row.count, 0) !== value.count ||
        new Set(value.countries.map((row: { country: string }) => row.country)).size !== value.countries.length ||
        ![value.firstDay, value.lastDay].every(day => day === null || /^\d{4}-\d{2}-\d{2}$/.test(day)) ||
        typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))) return null;
    return value;
  } catch { return null; }
  finally { clearTimeout(timeout); }
}

export async function getVisitorStats() {
  const stats = await getTrafficStats();
  // The homepage shows only the new session measure, never a legacy/live mixed total.
  return { count: stats?.count ?? null, countries: stats?.countries.map(row => ({ country: row.country, pct: stats.count ? row.count / stats.count * 100 : 0 })) ?? [] };
}
