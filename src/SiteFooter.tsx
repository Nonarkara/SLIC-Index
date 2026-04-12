import BrandLockup from "./BrandLockup";
import { collaborationLogos } from "./brandAssets";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

export default function SiteFooter({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const endnotes = copy.footer.endnotes;

  return (
    <footer className="site-footer section">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <BrandLockup eyebrow={copy.footer.eyebrow} microCopy={copy.footer.title} />
          <p className="site-footer-summary">{copy.footer.summary}</p>
        </div>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.transparencyLabel}</p>
          <p>{copy.footer.disclosure}</p>
          <p>{copy.footer.privacy}</p>
          <p>{copy.footer.coverage}</p>
        </article>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.collaborationLabel}</p>
          <p>{copy.footer.collaboration}</p>
          <div className="partner-logo-strip" aria-label={copy.footer.collaborationLabel}>
            {collaborationLogos.map((logo) => (
              <div className="partner-logo-card" key={logo.name}>
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="site-footer-endnotes">
        <div className="section-heading compact-heading">
          <p className="eyebrow">{endnotes.eyebrow}</p>
        </div>
        <div className="site-footer-endnote-grid">
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.reuseLabel}</p>
            <p>{endnotes.reuseBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.creditLabel}</p>
            <p>{endnotes.creditBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.aiLabel}</p>
            <p>{endnotes.aiBody}</p>
          </article>
          <article className="site-footer-endnote">
            <p className="panel-label">{endnotes.liveLabel}</p>
            <p>{endnotes.liveBody}</p>
          </article>
        </div>
      </div>

      <div className="site-footer-bottom">
        <nav className="topnav" aria-label="Site navigation">
          <a href="/" onClick={(event) => navigateLink(event, onNavigate, "/")}>
            {copy.nav.home}
          </a>
          <a href="/about-slic" onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}>
            {copy.nav.aboutSlic}
          </a>
          <a href="/rankings" onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>
            {copy.nav.rankings}
          </a>
          <a href="/methodology" onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>
            {copy.nav.methodology}
          </a>
          <a href="/thailand" onClick={(event) => navigateLink(event, onNavigate, "/thailand")}>
            {copy.nav.thailand}
          </a>
          <a href="/ideas" onClick={(event) => navigateLink(event, onNavigate, "/ideas")}>
            {copy.nav.ideas}
          </a>
          <a href="/history" onClick={(event) => navigateLink(event, onNavigate, "/history")}>
            {copy.nav.history}
          </a>
          <a href="/compare" onClick={(event) => navigateLink(event, onNavigate, "/compare")}>
            {copy.nav.compare}
          </a>
          <a href="https://nonarkara.github.io/slic-landing-page/" target="_blank" rel="noopener noreferrer">
            V1 Archive
          </a>
          <a href="https://nonarkara.github.io/slic-index-V2/" target="_blank" rel="noopener noreferrer">
            V2 Archive
          </a>
        </nav>
        <p className="site-footer-note">{copy.footer.note}</p>
      </div>
    </footer>
  );
}
