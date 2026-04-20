import { profilePhotos } from "./profilePhotos";
import { appHref } from "./routing";
import { OFFICIAL_SLIC_URL, slicProfileData, type PartnerCard } from "./slicProfileData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

function PartnerCardView({ card }: { card: PartnerCard }) {
  return (
    <article className="paper-card partner-card">
      {card.logoSrc && (
        <div className="partner-card-logo">
          <img src={`${BASE}${card.logoSrc}`} alt={`${card.name} logo`} loading="lazy" />
        </div>
      )}
      <p className="panel-label">{card.role}</p>
      <h3>{card.name}</h3>
      <p>{card.body}</p>
      {card.url && (
        <a className="inline-page-link" href={card.url} target="_blank" rel="noreferrer">
          {card.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      )}
    </article>
  );
}

export default function SlicProfilePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const profile = slicProfileData[locale];

  return (
    <>
      <header className="rankings-hero section profile-hero">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1 className="rankings-title">{profile.title}</h1>
            <p className="hero-intro">{profile.intro}</p>

            <div className="hero-actions">
              <a
                className="primary-action"
                href={appHref("/methodology")}
                onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
              >
                {profile.methodologyLabel}
              </a>
            </div>
          </div>

          <aside className="paper-card external-link-card">
            <p className="panel-label">{profile.summaryTitle}</p>
            <ul className="profile-summary-list">
              {profile.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <main>
        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.leadsLabel}</p>
              <h2>{profile.leadsTitle}</h2>
            </div>
            <p className="section-summary">{profile.leadsSummary}</p>
          </div>

          <div className="profile-card-grid">
            {profile.leads.map((lead) => (
              <PartnerCardView key={lead.name} card={lead} />
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.privateLabel}</p>
              <h2>{profile.privateTitle}</h2>
            </div>
            <p className="section-summary">{profile.privateSummary}</p>
          </div>

          <div className="profile-card-grid">
            <article className="paper-card partner-card partner-card-wide">
              {profile.privatePartner.logoSrc && (
                <div className="partner-card-logo">
                  <img
                    src={`${BASE}${profile.privatePartner.logoSrc}`}
                    alt={`${profile.privatePartner.name} logo`}
                    loading="lazy"
                  />
                </div>
              )}
              <p className="panel-label">{profile.privatePartner.role}</p>
              <h3>{profile.privatePartner.name}</h3>
              <p>{profile.privatePartner.body}</p>
              {profile.privatePartner.url && (
                <a
                  className="inline-page-link"
                  href={profile.privatePartner.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.slicFootnoteLabel}
                </a>
              )}
            </article>
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.techLabel}</p>
              <h2>{profile.techTitle}</h2>
            </div>
            <p className="section-summary">{profile.techSummary}</p>
          </div>

          <div className="profile-card-grid">
            {profile.techPartners.map((tech) => (
              <PartnerCardView key={tech.name} card={tech} />
            ))}
          </div>
        </section>

        <section className="paper-visual-strip section" aria-label="SLIC publication context">
          <div className="field-ledger-copy">
            <p className="eyebrow">{profile.publicationLabel}</p>
            <h2>{profile.publicationTitle}</h2>
            <p className="section-summary">{profile.publicationSummary}</p>
          </div>

          <div className="field-ledger-grid">
            {profilePhotos.map((photo, index) => (
              <figure
                className={index === 2 ? "photo-frame photo-frame-wide" : "photo-frame"}
                key={photo.id}
              >
                <img
                  src={`${BASE}${photo.src}`}
                  alt={photo.alt}
                  loading="lazy"
                  width={photo.width}
                  height={photo.height}
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.resourceLabel}</p>
              <h2>{profile.resourcesTitle}</h2>
            </div>
            <p className="section-summary">{profile.bridgeBody}</p>
          </div>

          <div className="profile-card-grid">
            <a
              className="paper-card profile-logo-card"
              href={appHref("/methodology")}
              onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
            >
              <p className="panel-label">{profile.resourceLabel}</p>
              <h3>{profile.methodologyLabel}</h3>
              <p>{profile.bridgeBody}</p>
            </a>

            <a
              className="paper-card profile-logo-card"
              href={OFFICIAL_SLIC_URL}
              target="_blank"
              rel="noreferrer"
            >
              <p className="panel-label">{profile.resourceLabel}</p>
              <h3>{profile.externalLabel}</h3>
              <p>{profile.slicFootnoteLabel}</p>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
