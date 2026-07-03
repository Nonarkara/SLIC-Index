import { type MouseEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { navGroups, navGroupLabel, navPathLabel, type NavGroupId } from "./navGroups";
import { appHref } from "./routing";
import { slicLogo } from "./brandAssets";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

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
  return navPathLabel(path, locale);
}

function groupLabel(groupId: NavGroupId, locale: Locale): string {
  return navGroupLabel(groupId, locale);
}

function groupIsActive(paths: SitePath[], currentPath: SitePath): boolean {
  return paths.some((path) => path === currentPath);
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

function NavDropdown({
  groupId,
  paths,
  locale,
  currentPath,
  onNavigate,
  isOpen,
  onToggle,
  onClose,
}: {
  groupId: NavGroupId;
  paths: SitePath[];
  locale: Locale;
  currentPath: SitePath;
  onNavigate: (path: SitePath) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const active = groupIsActive(paths, currentPath);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSelect = (path: SitePath) => {
    onClose();
    onNavigate(path);
  };

  return (
    <div
      ref={rootRef}
      className={isOpen ? "mh-dropdown mh-dropdown--open" : "mh-dropdown"}
    >
      <button
        type="button"
        className={
          active
            ? "mh-dropdown-trigger mh-dropdown-trigger--active"
            : "mh-dropdown-trigger"
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={onToggle}
      >
        {groupLabel(groupId, locale)}
        <span className="mh-dropdown-caret" aria-hidden="true" />
      </button>

      <div
        id={menuId}
        className="mh-dropdown-menu"
        role="menu"
        hidden={!isOpen}
      >
        {paths.map((path) => (
          <a
            key={path}
            href={appHref(path)}
            role="menuitem"
            className={
              path === currentPath
                ? "mh-dropdown-link mh-dropdown-link--active"
                : "mh-dropdown-link"
            }
            onClick={(event) => navigateLink(event, handleSelect, path)}
            aria-current={path === currentPath ? "page" : undefined}
          >
            {navLabel(path, locale)}
          </a>
        ))}
      </div>
    </div>
  );
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
  const [openDropdown, setOpenDropdown] = useState<NavGroupId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const labels = menuLabels[locale];

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [currentPath, locale]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

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
    setOpenDropdown(null);
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
          {navGroups.map((group) => (
            <NavDropdown
              key={group.id}
              groupId={group.id}
              paths={group.paths}
              locale={locale}
              currentPath={currentPath}
              onNavigate={onNavigate}
              isOpen={openDropdown === group.id}
              onToggle={() =>
                setOpenDropdown((current) => (current === group.id ? null : group.id))
              }
              onClose={() => setOpenDropdown(null)}
            />
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

          {navGroups.map((group) => (
            <div className="mh-panel-group" key={group.id}>
              <p className="mh-panel-group-label">{groupLabel(group.id, locale)}</p>
              {group.paths.map((path) => (
                <a
                  key={path}
                  href={appHref(path)}
                  className={
                    path === currentPath
                      ? "mh-panel-link mh-panel-link--active"
                      : "mh-panel-link"
                  }
                  onClick={(event) => navigateLink(event, handleNav, path)}
                  aria-current={path === currentPath ? "page" : undefined}
                >
                  {navLabel(path, locale)}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
