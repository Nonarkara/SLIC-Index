import { type MouseEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { getCopy } from "./siteCopy";
import { appHref } from "./routing";
import { slicLogo } from "./brandAssets";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const navPaths: SitePath[] = [
  "/rankings",
  "/map",
  "/compare",
  "/side-by-side",
  "/methodology",
  "/data",
  "/thailand",
  "/ideas",
  "/essay",
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
  ko: {
    open: "내비게이션 열기",
    close: "내비게이션 닫기",
    primary: "주요 내비게이션",
    mobile: "모바일 내비게이션",
  },
  ja: {
    open: "ナビゲーションを開く",
    close: "ナビゲーションを閉じる",
    primary: "メインナビゲーション",
    mobile: "モバイルナビゲーション",
  },
};

function navLabel(path: SitePath, locale: Locale): string {
  const copy = getCopy(locale);
  if (path === "/") return copy.nav.home;
  if (path === "/about-slic") return copy.nav.aboutSlic;
  if (path === "/rankings") return copy.nav.rankings;
  if (path === "/methodology") return copy.nav.methodology;
  if (path === "/data") {
    if (locale === "th") return "ข้อมูล";
    if (locale === "zh") return "数据";
    if (locale === "ko") return "데이터";
    if (locale === "ja") return "データ";
    return "Data";
  }
  if (path === "/ideas") return copy.nav.ideas;
  if (path === "/essay") return copy.nav.essay;
  if (path === "/compare") return copy.nav.compare;
  if (path === "/side-by-side") {
    if (locale === "th") return "เทียบเมือง";
    if (locale === "zh") return "城市对比";
    if (locale === "ko") return "도시 비교";
    if (locale === "ja") return "都市比較";
    return "Side by Side";
  }
  if (path === "/map") {
    if (locale === "th") return "แผนที่";
    if (locale === "zh") return "地图";
    if (locale === "ko") return "지도";
    if (locale === "ja") return "地図";
    return "Map";
  }
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
    currentPath === "/" ? "mh--hero" : "",
    scrolled ? "mh--scrolled" : "",
    hidden && !menuOpen ? "mh--hidden" : "",
    menuOpen ? "mh--open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={0}
      >
        {locale === "th" ? "ข้ามไปเนื้อหาหลัก" : locale === "zh" ? "跳至主要内容" : locale === "ko" ? "본문으로 이동" : locale === "ja" ? "メインコンテンツへ" : "Skip to content"}
      </a>
      <div className="mh-inner">
        <a
          href={appHref("/")}
          className="mh-wordmark"
          onClick={(event) => navigateLink(event, onNavigate, "/")}
          aria-label={locale === "th" ? "กลับหน้าหลัก SLIC" : locale === "zh" ? "SLIC 首页" : locale === "ko" ? "SLIC 홈" : locale === "ja" ? "SLICホーム" : "SLIC home"}
        >
          <img 
            src={`${BASE}${slicLogo.src}`} 
            alt={slicLogo.alt} 
            className="mh-logo-img" 
            height={32}
            style={{ width: "auto" }} 
          />
        </a>

        <span className="mh-edition">V3 &middot; 2026</span>

        <nav className="mh-nav" aria-label={labels.primary}>
          {navPaths.map((path) => (
            <a
              key={path}
              href={appHref(path)}
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
            href={appHref("/")}
            className={currentPath === "/" ? "mh-panel-link mh-panel-link--active" : "mh-panel-link"}
            onClick={(event) => navigateLink(event, handleNav, "/")}
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            {navLabel("/", locale)}
          </a>
          {navPaths.map((path) => (
            <a
              key={path}
              href={appHref(path)}
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
