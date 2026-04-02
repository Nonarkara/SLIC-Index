import { useMemo } from "react";
import SiteFooter from "./SiteFooter";
import {
  INDEX_PROFILES,
  SLIC_TOP,
  COMPARE_HERO,
  SLIC_DIFFERENCE,
} from "./compareRankingsData";
import type { Locale, SitePath } from "./types";

/* ── Overlap computation ── */
function computeOverlaps() {
  const cityMap = new Map<string, string[]>();
  for (const profile of INDEX_PROFILES) {
    for (const c of profile.topCities.slice(0, 10)) {
      const key = c.city.toLowerCase();
      if (!cityMap.has(key)) cityMap.set(key, []);
      cityMap.get(key)!.push(profile.shortName);
    }
  }
  // Add SLIC
  for (const c of SLIC_TOP.slice(0, 10)) {
    const key = c.city.toLowerCase();
    if (!cityMap.has(key)) cityMap.set(key, []);
    cityMap.get(key)!.push("SLIC");
  }
  return cityMap;
}

export default function CompareRankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const overlaps = useMemo(computeOverlaps, []);

  // Cities in 3+ establishment indices
  const establishmentFavorites = useMemo(() => {
    const results: Array<{ city: string; indices: string[]; inSlic: boolean }> = [];
    overlaps.forEach((indices, city) => {
      const nonSlic = indices.filter((i) => i !== "SLIC");
      if (nonSlic.length >= 3) {
        results.push({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          indices: nonSlic,
          inSlic: indices.includes("SLIC"),
        });
      }
    });
    return results.sort((a, b) => b.indices.length - a.indices.length);
  }, [overlaps]);

  // SLIC cities that appear in zero establishment indices
  const slicOnly = useMemo(() => {
    return SLIC_TOP.slice(0, 10).filter((c) => {
      const indices = overlaps.get(c.city.toLowerCase()) ?? [];
      return indices.filter((i) => i !== "SLIC").length === 0;
    });
  }, [overlaps]);

  return (
    <>
      {/* ═══════ 01. HERO ═══════ */}
      <header className="compare-hero">
        <div className="compare-hero-inner section">
          <p className="compare-overline">{COMPARE_HERO.eyebrow}</p>
          <h1 className="compare-hero-title">{COMPARE_HERO.title}</h1>
          <p className="compare-hero-thesis">{COMPARE_HERO.thesis}</p>
        </div>
      </header>

      {/* ═══════ 02. SIDE-BY-SIDE TABLE ═══════ */}
      <section className="compare-table-section">
        <div className="section">
          <h2 className="compare-section-title">Top 10 cities, side by side</h2>
          <p className="compare-section-sub">Same planet. Five completely different answers. Scroll to see all indices.</p>
        </div>
        <div className="compare-table-scroll">
          <div className="compare-table">
            {/* SLIC column first */}
            <div className="compare-col compare-col--slic">
              <div className="compare-col-header" style={{ borderColor: "#1a6b5a" }}>
                <strong>SLIC V3</strong>
                <span>2026 &middot; 157 cities</span>
              </div>
              {SLIC_TOP.slice(0, 10).map((c) => (
                <div key={c.rank + c.city} className="compare-cell">
                  <span className="compare-rank">{String(c.rank).padStart(2, "0")}</span>
                  <div>
                    <span className="compare-city">{c.city}</span>
                    <span className="compare-country">{c.country}</span>
                  </div>
                  {c.score && <span className="compare-score">{c.score}</span>}
                </div>
              ))}
            </div>

            {/* Other indices */}
            {INDEX_PROFILES.map((profile) => (
              <div key={profile.id} className="compare-col">
                <div className="compare-col-header" style={{ borderColor: profile.accentHex }}>
                  <strong>{profile.shortName}</strong>
                  <span>{profile.year} &middot; {profile.citiesEvaluated} cities</span>
                </div>
                {profile.topCities.slice(0, 10).map((c) => (
                  <div key={c.rank + c.city} className="compare-cell">
                    <span className="compare-rank">{String(c.rank).padStart(2, "0")}</span>
                    <div>
                      <span className="compare-city">{c.city}</span>
                      <span className="compare-country">{c.country}</span>
                    </div>
                    {c.score && <span className="compare-score">{c.score}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 03. OVERLAP ANALYSIS ═══════ */}
      <section className="compare-overlap section">
        <h2 className="compare-section-title">The echo chamber</h2>
        <p className="compare-section-sub">Cities that appear in 3+ establishment top-10 lists &mdash; and where SLIC disagrees.</p>

        <div className="compare-overlap-grid">
          {establishmentFavorites.map((item) => (
            <div key={item.city} className="compare-overlap-card">
              <strong>{item.city}</strong>
              <span className="compare-overlap-indices">{item.indices.join(", ")}</span>
              <span className={item.inSlic ? "compare-overlap-slic yes" : "compare-overlap-slic no"}>
                {item.inSlic ? "Also in SLIC top 10" : "Not in SLIC top 10"}
              </span>
            </div>
          ))}
        </div>

        {slicOnly.length > 0 && (
          <div className="compare-slic-exclusive">
            <h3>Only in SLIC</h3>
            <p>These cities rank in SLIC&rsquo;s top 10 but appear in zero establishment top-10 lists.</p>
            <div className="compare-slic-exclusive-cities">
              {slicOnly.map((c) => (
                <button
                  key={c.city}
                  className="compare-slic-chip"
                  onClick={() => onNavigate("/rankings")}
                >
                  {c.city} <span>{c.country}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════ 04. METHODOLOGY CARDS ═══════ */}
      <section className="compare-methodology section">
        <h2 className="compare-section-title">What each index actually measures</h2>
        <p className="compare-section-sub">The claimed purpose. The real audience. The blind spots.</p>

        <div className="compare-meth-grid">
          {INDEX_PROFILES.map((profile) => (
            <article key={profile.id} className="compare-meth-card" style={{ borderTopColor: profile.accentHex }}>
              <div className="compare-meth-header">
                <strong>{profile.name}</strong>
                <span>{profile.publisher} &middot; {profile.year}</span>
              </div>

              <div className="compare-meth-section">
                <p className="compare-meth-label">They claim</p>
                <p>{profile.methodology.claimedPurpose}</p>
              </div>

              <div className="compare-meth-section compare-meth-reality">
                <p className="compare-meth-label">What it actually measures</p>
                <p>{profile.methodology.actualMeasure}</p>
              </div>

              <div className="compare-meth-section">
                <p className="compare-meth-label">Data categories</p>
                <ul>
                  {profile.methodology.categories.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>

              <div className="compare-meth-section">
                <p className="compare-meth-label">Blind spots</p>
                <ul className="compare-blindspots">
                  {profile.methodology.blindSpots.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="compare-meth-audience">
                <p className="compare-meth-label">Who it really serves</p>
                <p>{profile.methodology.audienceNote}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════ 05. CRITICAL ANALYSIS ═══════ */}
      <section className="compare-critique">
        <div className="section">
          <h2 className="compare-section-title">The critique</h2>
          <p className="compare-section-sub">What each ranking worships &mdash; and what it deliberately ignores.</p>

          <div className="compare-critique-blocks">
            {INDEX_PROFILES.map((profile) => (
              <article key={profile.id} className="compare-critique-block">
                <p className="compare-critique-eyebrow" style={{ color: profile.accentHex }}>{profile.shortName}</p>
                <h3 className="compare-critique-headline">{profile.critique.headline}</h3>
                <p className="compare-critique-body">{profile.critique.body}</p>
              </article>
            ))}
          </div>

          <blockquote className="compare-overarching">
            {COMPARE_HERO.overarchingCritique}
          </blockquote>
        </div>
      </section>

      {/* ═══════ 06. THE SLIC DIFFERENCE ═══════ */}
      <section className="compare-slic-diff section">
        <h2 className="compare-section-title">What SLIC measures that others refuse to ask</h2>
        <p className="compare-section-sub">If you&rsquo;re an expat banker or influencer, pick your flavor. If you&rsquo;re a normal human, maybe ask a different question entirely.</p>

        <div className="compare-diff-grid">
          {SLIC_DIFFERENCE.map((item) => (
            <article key={item.title} className="compare-diff-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="compare-diff-cta">
          <a className="v3-cta" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
            READ THE FULL METHODOLOGY &rarr;
          </a>
          <a className="v3-cta-secondary" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}>
            SEE THE SLIC RANKING
          </a>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
