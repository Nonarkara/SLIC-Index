import { useCallback, useEffect, useId, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { getCopy } from "./siteCopy";
import { SLIC_LOGO_INLINE } from "./brandAssets";
const slicLogoSrc = SLIC_LOGO_INLINE;
import type { Locale, SitePath } from "./types";

const navPaths: SitePath[] = [
  "/rankings",
  "/methodology",
  "/thailand",
  "/compare",
  "/ideas",
  "/about-slic",
  "/history",
];

function navLabel(path: SitePath, locale: Locale): string {
  const copy = getCopy(locale);
  switch (path) {
    case "/": return copy.nav.home;
    case "/rankings": return copy.nav.rankings;
    case "/methodology": return copy.nav.methodology;
    case "/thailand": return copy.nav.thailand;
    case "/compare": return copy.nav.compare;
    case "/ideas": return copy.nav.ideas;
    case "/about-slic": return copy.nav.aboutSlic;
    case "/history": return copy.nav.history;
    default: return copy.nav.home;
  }
}

export default function SiteMasthead({
  locale,
  currentPath,
  onLocaleChange,
  onNavigate,
}: {
  locale: Locale;
  currentPath: SitePath;
  onLocaleChange: (locale: Locale) => void;
  onNavigate: (path: SitePath) => void;
}) {
  const navPanelId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [currentPath, locale]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNav = (path: SitePath) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  const isHomepage = currentPath === "/";

  const cls = [
    "mh",
    scrolled ? "mh--scrolled" : "",
    !scrolled && isHomepage && !menuOpen ? "mh--intro-hidden" : "",
    menuOpen ? "mh--open" : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="mh-inner">
        <button type="button" className="mh-wordmark" onClick={() => handleNav("/")}>
          <img src={slicLogoSrc} alt="SLIC Index" className="mh-logo-img" />
        </button>

        <span className="mh-edition">V3 &middot; 2026</span>

        <nav className="mh-nav" aria-label="Primary navigation">
          {navPaths.map((path) => (
            <button
              key={path}
              type="button"
              className={path === currentPath ? "mh-link mh-link--active" : "mh-link"}
              onClick={() => handleNav(path)}
              aria-current={path === currentPath ? "page" : undefined}
            >
              {navLabel(path, locale)}
            </button>
          ))}
        </nav>

        <div className="mh-actions">
          <LocaleSwitch locale={locale} onChange={onLocaleChange} />
          <button
            type="button"
            className={menuOpen ? "mh-burger mh-burger--open" : "mh-burger"}
            aria-expanded={menuOpen}
            aria-controls={navPanelId}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={menuOpen ? "mh-panel mh-panel--open" : "mh-panel"} id={navPanelId}>
        <nav className="mh-panel-nav">
          {["/", ...navPaths].map((path) => (
            <button
              key={path}
              className={path === currentPath ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"}
              onClick={() => handleNav(path as SitePath)}
            >
              {navLabel(path as SitePath, locale)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
