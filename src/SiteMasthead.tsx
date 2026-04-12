import { type MouseEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { getCopy } from "./siteCopy";
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

const menuLabels: Record<Locale, { open: string; close: string; primary: string; mobile: string }> = {
  en: {
    open: "Open navigation",
    close: "Close navigation",
    primary: "Primary navigation",
    mobile: "Mobile navigation",
  },
  th: {
    open: "เปิดเมนูนำทาง",
    close: "ปิดเมนูนำทาง",
    primary: "เมนูหลัก",
    mobile: "เมนูบนมือถือ",
  },
  zh: {
    open: "打开导航",
    close: "关闭导航",
    primary: "主导航",
    mobile: "移动导航",
  },
};

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

function navigateLink(
  event: MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  onNavigate(path);
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
  const labels = menuLabels[locale];

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath, locale]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);

    if (y < 80) {
      setHidden(false);
    } else if (y > lastScrollY.current + 8) {
      setHidden(true);
    } else if (y < lastScrollY.current - 8) {
      setHidden(false);
    }

    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNav = (path: SitePath) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  const classes = [
    "mh",
    scrolled ? "mh--scrolled" : "",
    hidden && !menuOpen ? "mh--hidden" : "",
    menuOpen ? "mh--open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <div className="mh-inner">
        <a
          href="/"
          className="mh-wordmark"
          onClick={(event) => navigateLink(event, onNavigate, "/")}
          aria-label="SLIC home"
        >
          <span className="mh-wordmark-main">SLIC</span>
          <span className="mh-wordmark-sub">Index</span>
        </a>

        <span className="mh-edition">V3 &middot; 2026</span>

        <nav className="mh-nav" aria-label={labels.primary}>
          {navPaths.map((path) => (
            <a
              key={path}
              href={path}
              className={path === currentPath ? "mh-link mh-link--active" : "mh-link"}
              onClick={(event) => navigateLink(event, onNavigate, path)}
              aria-current={path === currentPath ? "page" : undefined}
            >
              {navLabel(path, locale)}
            </a>
          ))}
        </nav>

        <div className="mh-actions">
          <LocaleSwitch locale={locale} onChange={onLocaleChange} />
          <button
            type="button"
            className={menuOpen ? "mh-burger mh-burger--open" : "mh-burger"}
            aria-expanded={menuOpen}
            aria-controls={navPanelId}
            aria-label={menuOpen ? labels.close : labels.open}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={menuOpen ? "mh-panel mh-panel--open" : "mh-panel"} id={navPanelId}>
        <nav className="mh-panel-nav" aria-label={labels.mobile}>
          <a
            href="/"
            className={currentPath === "/" ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"}
            onClick={(event) => navigateLink(event, handleNav, "/")}
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            {navLabel("/", locale)}
          </a>
          {navPaths.map((path) => (
            <a
              key={path}
              href={path}
              className={path === currentPath ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"}
              onClick={(event) => navigateLink(event, handleNav, path)}
              aria-current={path === currentPath ? "page" : undefined}
            >
              {navLabel(path, locale)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
