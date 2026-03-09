import { profilePhotos } from "./profilePhotos";
import { OFFICIAL_SLIC_URL, slicProfileData } from "./slicProfileData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
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
                href={OFFICIAL_SLIC_URL}
                target="_blank"
                rel="noreferrer"
              >
                {profile.externalLabel}
              </a>
              <a
                className="secondary-action"
                href="/methodology"
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
            <a
              className="inline-page-link"
              href={OFFICIAL_SLIC_URL}
              target="_blank"
              rel="noreferrer"
            >
              {OFFICIAL_SLIC_URL}
            </a>
          </aside>
        </div>
      </header>

      <main>
        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.deliveryLabel}</p>
              <h2>{profile.serviceTitle}</h2>
            </div>
            <p className="section-summary">{profile.deliverySummary}</p>
          </div>

          <div className="profile-card-grid">
            {profile.services.map((service) => (
              <article className="paper-card" key={service.title}>
                <p className="panel-label">4C</p>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.programmeLabel}</p>
              <h2>{profile.programTitle}</h2>
            </div>
            <p className="section-summary">{profile.programmeSummary}</p>
          </div>

          <div className="profile-program-grid">
            {profile.programs.map((program, index) => (
              <article className={index === 0 ? "paper-card profile-program-card profile-program-card-wide" : "paper-card profile-program-card"} key={program.title}>
                <p className="panel-label">{program.kicker}</p>
                <h3>{program.title}</h3>
                <p>{program.body}</p>
              </article>
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
                <img src={photo.src} alt={photo.alt} loading="lazy" />
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
            {profile.resources.map((resource) => (
              <article className="paper-card" key={resource.title}>
                <p className="panel-label">{profile.resourceLabel}</p>
                <h3>{resource.title}</h3>
                <p>{resource.body}</p>
              </article>
            ))}

            <article className="paper-card profile-logo-card">
              <p className="panel-label">{profile.partnersLabel}</p>
              <h3>{profile.bridgeTitle}</h3>
              <p>{profile.bridgeBody}</p>
              <a className="inline-page-link" href={OFFICIAL_SLIC_URL} target="_blank" rel="noreferrer">
                {profile.externalLabel}
              </a>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
