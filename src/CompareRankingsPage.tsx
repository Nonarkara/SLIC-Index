import React from "react";
import { getCopy } from "./siteCopy";
import ComparisonGrid from "./ComparisonGrid";
import SiteFooter from "./SiteFooter";
import "./compareRankingsData";
import { SLIC_LOGO_INLINE } from "./brandAssets";
import type { Locale, SitePath } from "./types";

export default function CompareRankingsPage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const copy = getCopy(locale);
  const ui = copy.compare;

  const BLIND_SPOT_ROWS = [
    { label: ui.blindSpotLabels.housing, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.overwork, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.tolerance, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.satisfaction, eiu: false, mercer: false, resonance: true, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.mentalStrain, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.graduateHousing, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.diversity, eiu: false, mercer: false, resonance: false, monocle: true, yonsei: false, slic: true },
    { label: ui.blindSpotLabels.incomeAfterRent, eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  ];

  const PILLAR_DATA = [
    { id: "pressure", weight: "25%", ...ui.pillarDetails.pressure },
    { id: "viability", weight: "22%", ...ui.pillarDetails.viability },
    { id: "capability", weight: "18%", ...ui.pillarDetails.capability },
    { id: "community", weight: "15%", ...ui.pillarDetails.community },
    { id: "creative", weight: "20%", ...ui.pillarDetails.creative },
  ];

  return (
    <>
      {/* ═══ ACT 1: THE PROVOCATION ═══ */}
      <header className="oped-open">
        <img src={SLIC_LOGO_INLINE} alt="SLIC Index" className="oped-open-logo" />
        <h1 className="oped-open-headline">
          {ui.title.split(/<em>|<\/em>/).map((part, i) =>
            i % 2 === 1 ? <em key={i}>{part}</em> : part
          )}
        </h1>
        <span className="oped-scroll-hint">{ui.scroll}</span>
      </header>

      {/* ═══ ACT 2: THE COMPARISON GRID ═══ */}
      <section className="hp-grid-reveal">
        <div className="section">
          <p className="hp-grid-kicker">{ui.kicker}</p>
          <ComparisonGrid locale={locale} />
          <p className="hp-grid-note">{ui.gridNote}</p>
        </div>
      </section>

      {/* Pull quote */}
      <div className="oped-pullquote">
        <p>{ui.pullQuote}</p>
      </div>

      {/* ═══ BLIND SPOTS DIAGRAM ═══ */}
      <section className="oped-blindspots section">
        <h2 className="oped-blindspots-title">{ui.blindspotsTitle}</h2>
        <p className="oped-blindspots-sub">{ui.blindspotsSub}</p>
        <div className="oped-grid">
          <div className="oped-grid-header" />
          <div className="oped-grid-header">EIU</div>
          <div className="oped-grid-header">Mercer</div>
          <div className="oped-grid-header">Resonance</div>
          <div className="oped-grid-header">Monocle</div>
          <div className="oped-grid-header">Yonsei</div>
          <div className="oped-grid-header oped-grid-header--slic">SLIC</div>
          {BLIND_SPOT_ROWS.map((row) => (
            <React.Fragment key={row.label}>
              <div className="oped-grid-row-label">{row.label}</div>
              <div className={`oped-grid-cell ${row.eiu ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.eiu ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.mercer ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.mercer ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.resonance ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.resonance ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.monocle ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.monocle ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.yonsei ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.yonsei ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.slic ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.slic ? "\u2713" : "\u2717"}</div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Photo break */}
      <figure className="oped-photo-break">
        <img src="/photos/report-city-walkway.jpg" alt="People walking on elevated walkway" loading="lazy" />
        <figcaption>{ui.photoCaption}</figcaption>
      </figure>

      {/* ═══ DATA COVERAGE ACKNOWLEDGMENT ═══ */}
      <section className="oped-editorial section" style={{ borderBottom: "1px solid var(--border)" }}>
        <h2 className="oped-editorial-big">{ui.notCoveredTitle}</h2>
        <p className="oped-editorial-body">{ui.notCoveredBody1}</p>
        <p className="oped-editorial-body">{ui.notCoveredBody2}</p>
      </section>

      {/* ═══ MONEYBALL ═══ */}
      <section className="oped-editorial section">
        <h2 className="oped-editorial-big">{ui.moneyballTitle}</h2>
        <p className="oped-editorial-body">{ui.moneyballBody1}</p>
        <p className="oped-editorial-body">{ui.moneyballBody2}</p>
      </section>

      {/* ═══ ACT 3: WHAT SLIC MEASURES ═══ */}
      <section className="oped-pillars section">
        <div>
          <h2 className="oped-blindspots-title">{ui.pillarsTitle}</h2>
          <p className="oped-blindspots-sub" style={{ marginBottom: "2rem" }}>{ui.pillarsSub}</p>
          {PILLAR_DATA.map((p) => (
            <div key={p.id} className="oped-pillar-item">
              <div className="oped-pillar-weight">{p.weight}</div>
              <div>
                <p className="oped-pillar-name">{p.name}</p>
                <p className="oped-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <figure className="oped-pillars-photo">
          <img src="/photos/report-people-workshop.jpg" alt="Workshop with city officials" loading="lazy" />
          <figcaption>{ui.workshopCaption}</figcaption>
        </figure>
      </section>

      {/* ═══ CTA: GO TO THE TOOL ═══ */}
      <section className="oped-spider">
        <div className="section" style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2 className="v3-section-title" style={{ color: "#fff" }}>{ui.disagreeTitle}</h2>
          <p className="v3-spider-hint" style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>{ui.disagreeHint}</p>
          <a className="v3-cta" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }} style={{ display: "inline-flex" }}>
            {ui.openRankings} &rarr;
          </a>
        </div>
      </section>

      {/* ═══ ENDORSEMENT ═══ */}
      <div className="oped-pullquote oped-pullquote--endorsement">
        <p>{ui.endorsementQuote}</p>
        <cite>
          <a href="https://mayorsofeurope.eu/news/they-built-the-index-but-you-build-the-ranking/" target="_blank" rel="noopener noreferrer">
            Svetlana Tesic, CoFounder, Mayors of Europe
          </a>
        </cite>
      </div>

      {/* ═══ THE CLOSE ═══ */}
      <section className="oped-close">
        <img src="/launch-photos/20260318145941_DSC09480.jpg" alt="SCSE 2026 Taipei" className="oped-close-photo" loading="lazy" />
        <div className="oped-close-content section">
          <h2 className="oped-close-title">{ui.launchTitle}</h2>
          <p className="oped-close-body">{ui.launchBody}</p>
          <div className="oped-close-cta">
            <a className="v3-cta" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}>
              {ui.exploreRankings} &rarr;
            </a>
            <a className="v3-cta-secondary" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
              {copy.nav.methodology}
            </a>
            <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
              {copy.nav.aboutSlic}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
