import { useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { getCopy } from "./siteCopy";
import { SLIC_LOGO_INLINE } from "./brandAssets";
const slicLogoSrc = SLIC_LOGO_INLINE;
import type { Locale, SitePath } from "./types";

const navPaths: SitePath[] = [
  "/rankings",
  "/compare",
  "/methodology",
  "/thailand",
  "/ideas",
  "/about-slic",
  "/history",
];

function navLabel(path: SitePath, locale: Locale): string {
  const copy = getCopy(locale);
  if (path === "/") return copy.nav.home;
  if (path === "/about-slic") return copy.nav.aboutSlic;
  if (path === "/rankings") return copy.nav.rankings;
  if (path === "/methodology") return copy.nav.methodology;
  if (path === "/ideas") return copy.nav.ideas;
  if (path === "/compare") return copy.nav.compare;
  if (path === "/history") return copy.nav.history;
  return copy.nav.thailand;
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
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => { setMenuOpen(false); }, [currentPath, locale]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);
    if (y < 80) setHidden(false);
    else if (y > lastScrollY.current + 8) setHidden(true);
    else if (y < lastScrollY.current - 8) setHidden(false);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNav = (path: SitePath) => { setMenuOpen(false); onNavigate(path); };

  const cls = [
    "mh",
    scrolled ? "mh--scrolled" : "",
    hidden && !menuOpen ? "mh--hidden" : "",
    menuOpen ? "mh--open" : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="mh-inner">
        {/* Left: wordmark */}
        <button type="button" className="mh-wordmark" onClick={() => handleNav("/")}>
          <img src={slicLogoSrc} alt="SLIC Index" className="mh-logo-img" />
        </button>

        {/* Center: edition tag */}
        <span className="mh-edition">V3 &middot; 2026</span>

        {/* Right: nav links, locale, hamburger */}
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
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={menuOpen ? "mh-panel mh-panel--open" : "mh-panel"} id={navPanelId}>
        <nav className="mh-panel-nav">
          <button className={currentPath === "/" ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"} onClick={() => handleNav("/")}>
            {navLabel("/", locale)}
          </button>
          {navPaths.map((path) => (
            <button key={path} className={path === currentPath ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"} onClick={() => handleNav(path)}>
              {navLabel(path, locale)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
