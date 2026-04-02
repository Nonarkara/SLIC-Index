import { useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { slicLogo } from "./brandAssets";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

const mastheadCopy: Record<
  Locale,
  {
    goHome: string;
    primaryNavigation: string;
    openNavigation: string;
    closeNavigation: string;
  }
> = {
  en: {
    goHome: "Go to home",
    primaryNavigation: "Primary navigation",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
  },
  th: {
    goHome: "กลับสู่หน้าแรก",
    primaryNavigation: "เมนูหลัก",
    openNavigation: "เปิดเมนูนำทาง",
    closeNavigation: "ปิดเมนูนำทาง",
  },
  zh: {
    goHome: "返回首页",
    primaryNavigation: "主导航",
    openNavigation: "打开导航",
    closeNavigation: "关闭导航",
  },
};

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

  if (path === "/") {
    return copy.nav.home;
  }

  if (path === "/about-slic") {
    return copy.nav.aboutSlic;
  }

  if (path === "/rankings") {
    return copy.nav.rankings;
  }

  if (path === "/exercise") {
    return copy.nav.exercise;
  }

  if (path === "/methodology") {
    return copy.nav.methodology;
  }

  if (path === "/ideas") {
    return copy.nav.ideas;
  }

  if (path === "/compare") {
    return copy.nav.compare;
  }

  if (path === "/history") {
    return copy.nav.history;
  }

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
  const ui = mastheadCopy[locale];
  const navPanelId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath, locale]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    if (y < 80) {
      setHidden(false);
    } else if (y > lastScrollY.current + 5) {
      setHidden(true);
    } else if (y < lastScrollY.current - 5) {
      setHidden(false);
    }
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavigate = (path: SitePath) => {
    setMenuOpen(false);
    onNavigate(path);
  };

  const cls = [
    "site-masthead",
    menuOpen ? "is-open" : "",
    hidden && !menuOpen ? "is-hidden" : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={cls}>
      <div className="masthead-bar">
        {/* Brand mark */}
        <button
          type="button"
          className="masthead-brand"
          onClick={() => handleNavigate("/")}
          aria-label={ui.goHome}
        >
          <img src={slicLogo.src} alt={slicLogo.alt} className="masthead-logo-img" />
          <span className="masthead-brand-name">SLIC</span>
        </button>

        {/* Desktop nav */}
        <nav className="masthead-nav" aria-label={ui.primaryNavigation}>
          {navPaths.map((path) => (
            <button
              key={path}
              type="button"
              className={path === currentPath ? "masthead-link active" : "masthead-link"}
              onClick={() => handleNavigate(path)}
              aria-current={path === currentPath ? "page" : undefined}
            >
              {navLabel(path, locale)}
            </button>
          ))}
        </nav>

        {/* Right side: locale + hamburger */}
        <div className="masthead-right">
          <LocaleSwitch locale={locale} onChange={onLocaleChange} />
          <button
            type="button"
            className={menuOpen ? "masthead-hamburger active" : "masthead-hamburger"}
            aria-expanded={menuOpen}
            aria-controls={navPanelId}
            aria-label={menuOpen ? ui.closeNavigation : ui.openNavigation}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={menuOpen ? "masthead-mobile-panel is-open" : "masthead-mobile-panel"} id={navPanelId}>
        <nav className="masthead-mobile-nav">
          <button
            type="button"
            className={currentPath === "/" ? "masthead-mobile-link active" : "masthead-mobile-link"}
            onClick={() => handleNavigate("/")}
          >
            {navLabel("/", locale)}
          </button>
          {navPaths.map((path) => (
            <button
              key={path}
              type="button"
              className={path === currentPath ? "masthead-mobile-link active" : "masthead-mobile-link"}
              onClick={() => handleNavigate(path)}
            >
              {navLabel(path, locale)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
