import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { displayCountry } from "./cityUtils";
import { rankingPublication } from "./rankingPublication";
import { navPathLabel } from "./navGroups";
import type { Locale, SitePath } from "./types";

interface SearchResultItem {
  id: string;
  type: "page" | "city";
  title: string;
  subtitle: string;
  path: string;
  badge?: string;
  badgeVariant?: "alpha" | "beta" | "gamma" | "watchlist" | "page";
  score?: number;
}

const searchCopy: Record<
  Locale,
  {
    placeholder: string;
    allResults: string;
    pages: string;
    cities: string;
    noResults: string;
    noResultsHint: string;
    quickShortcuts: string;
    pressEnter: string;
    navigate: string;
    close: string;
  }
> = {
  en: {
    placeholder: "Search 163 cities, metrics, pages (e.g. Bangkok, Raleigh, Map)...",
    allResults: "All Results",
    pages: "Pages & Tools",
    cities: "Cities & Scorecards",
    noResults: "No matching cities or pages found",
    noResultsHint: "Try searching for a city name, country, or page like 'Methodology' or 'Compare'.",
    quickShortcuts: "Shortcuts",
    pressEnter: "Open",
    navigate: "Navigate",
    close: "Close",
  },
  th: {
    placeholder: "ค้นหา 163 เมือง, ตัวชี้วัด, หน้า (เช่น กรุงเทพ, เชียงใหม่, แผนที่)...",
    allResults: "ผลการค้นหาทั้งหมด",
    pages: "หน้าและเครื่องมือ",
    cities: "เมืองและสรุปคะแนน",
    noResults: "ไม่พบเมืองหรือหน้าที่ค้นหา",
    noResultsHint: "ลองพิมพ์ชื่อเมือง ประเทศ หรือหน้า เช่น 'ระเบียบวิธี' หรือ 'เปรียบเทียบ'",
    quickShortcuts: "ปุ่มลัด",
    pressEnter: "เปิด",
    navigate: "เลื่อนเลือก",
    close: "ปิด",
  },
  zh: {
    placeholder: "搜索 163 座城市、指标、页面（例如：曼谷、蒙特利尔、地图）...",
    allResults: "所有结果",
    pages: "页面与工具",
    cities: "城市与评分卡",
    noResults: "未找到匹配的城市或页面",
    noResultsHint: "尝试搜索城市名称、国家或页面名称，例如“方法论”或“对比”。",
    quickShortcuts: "快捷键",
    pressEnter: "打开",
    navigate: "选择",
    close: "关闭",
  },
  ko: {
    placeholder: "163개 도시, 지표, 페이지 검색 (예: 방콕, 롤리, 지도)...",
    allResults: "모든 결과",
    pages: "페이지 및 도구",
    cities: "도시 및 스코어카드",
    noResults: "일치하는 도시나 페이지가 없습니다",
    noResultsHint: "도시 이름, 국가 또는 '방법론', '비교'와 같은 페이지를 검색해 보세요.",
    quickShortcuts: "단축키",
    pressEnter: "열기",
    navigate: "이동",
    close: "닫기",
  },
  ja: {
    placeholder: "163都市、指標、ページを検索（例：バンコク、ローリー、マップ）...",
    allResults: "すべての結果",
    pages: "ページとツール",
    cities: "都市とスコアカード",
    noResults: "一致する都市またはページが見つかりません",
    noResultsHint: "都市名、国名、または「方法論」「比較」などのページ名で検索してください。",
    quickShortcuts: "ショートカット",
    pressEnter: "開く",
    navigate: "移動",
    close: "閉じる",
  },
};

export default function QuickSearchModal({
  isOpen,
  onClose,
  onNavigate,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const copy = searchCopy[locale];

  // Reset query and focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global shortcut (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) onClose();
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable items index
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Pages
    const allPaths: SitePath[] = [
      "/",
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
      "/awards",
      "/exercise",
    ];

    for (const path of allPaths) {
      const label = navPathLabel(path, locale);
      items.push({
        id: `page-${path}`,
        type: "page",
        title: label,
        subtitle: path === "/" ? "Home · Allocator" : path.replace(/^\//, "").replace(/-/g, " "),
        path,
        badge: "PAGE",
        badgeVariant: "page",
      });
    }

    // 2. Cities — sorted by rank so the index reads top-down by default
    const sortedCities = [...rankingPublication.cities].sort((a, b) => {
      const ar = a.rankingStatus === "Ranked" ? a.rank : Number.POSITIVE_INFINITY;
      const br = b.rankingStatus === "Ranked" ? b.rank : Number.POSITIVE_INFINITY;
      return ar - br;
    });
    for (const city of sortedCities) {
      const tier = city.tierLabel;
      const isWatchlist = city.rankingStatus !== "Ranked" || !Number.isFinite(city.rank) || city.rank <= 0;
      const badgeVariant = tier === "Alpha"
        ? "alpha"
        : tier === "Beta"
          ? "beta"
          : tier === "Gamma"
            ? "gamma"
            : isWatchlist
              ? "watchlist"
              : undefined;

      const badge = tier
        ? tier.toUpperCase()
        : isWatchlist
          ? "WATCHLIST"
          : `#${city.rank}`;

      items.push({
        id: `city-${city.cityId}`,
        type: "city",
        title: city.displayName,
        subtitle: `${displayCountry(city.country)}${city.region ? ` · ${city.region}` : ""}`,
        // The CityScorecardPage reads the slug from the URL — keep the
        // full cityId (e.g. "th-bangkok") so the lookup actually finds
        // the city. Stripping the country prefix would route to a 404.
        path: `/city/${city.cityId}`,
        badge,
        badgeVariant,
        score: city.slicScore,
      });
    }

    return items;
  }, [locale]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      // Default view: every page + the top 10 ranked cities. No hardcoded
      // favourites — the index is editorial, not promotional.
      const topTen = allSearchItems.filter(
        (item) => item.type === "page" || (item.type === "city" && item.score !== undefined),
      );
      // Move all pages to the top, then the 10 highest-scoring cities.
      const pages = topTen.filter((i) => i.type === "page");
      const cities = topTen
        .filter((i) => i.type === "city")
        .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
        .slice(0, 10);
      return [...pages, ...cities];
    }

    // Free-text: case-insensitive substring on title, subtitle, and badge.
    // Word-boundary aware — every query token must match somewhere in the
    // haystack (not just one of the tokens) so "bangkok thai" doesn't
    // surface every city that happens to mention "bangkok" or "thai".
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);
    return allSearchItems
      .filter((item) => {
        const haystack = [item.title, item.subtitle, item.badge ?? ""]
          .join("  ")
          .toLowerCase();
        return tokens.every((token) => haystack.includes(token));
      })
      .sort((a, b) => {
        // Title-prefix matches outrank mid-string matches; cities outrank
        // pages because "Bangkok" is almost always a city, not a page.
        if (a.type !== b.type) return a.type === "city" ? -1 : 1;
        const aPrefix = a.title.toLowerCase().startsWith(tokens[0] ?? "") ? 0 : 1;
        const bPrefix = b.title.toLowerCase().startsWith(tokens[0] ?? "") ? 0 : 1;
        if (aPrefix !== bPrefix) return aPrefix - bPrefix;
        if (a.type === "city" && b.type === "city") {
          return (b.score ?? -1) - (a.score ?? -1);
        }
        return a.title.localeCompare(b.title);
      })
      .slice(0, 24);
  }, [allSearchItems, query]);

  // Keep active index within bounds
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredResults]);

  // Keyboard navigation inside modal
  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = filteredResults[activeIndex];
      if (selected) {
        onClose();
        onNavigate(selected.path);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    onNavigate(item.path);
  };

  if (!isOpen) return null;

  return (
    <div
      className="quick-search-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="quick-search-card">
        <div className="quick-search-header">
          <svg
            className="quick-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="quick-search-input"
            placeholder={copy.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-autocomplete="list"
            aria-controls="quick-search-listbox"
          />
          {query && (
            <button
              type="button"
              className="quick-search-clear"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
          <kbd className="quick-search-kbd">ESC</kbd>
        </div>

        <div className="quick-search-body" ref={listRef} id="quick-search-listbox" role="listbox">
          {filteredResults.length === 0 ? (
            <div className="quick-search-empty">
              <p className="quick-search-empty-title">{copy.noResults}</p>
              <p className="quick-search-empty-hint">{copy.noResultsHint}</p>
            </div>
          ) : (
            <div className="quick-search-results">
              {filteredResults.map((item, index) => {
                const isSelected = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`quick-search-item ${isSelected ? "quick-search-item--active" : ""}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="quick-search-item-main">
                      <span className="quick-search-item-type">
                        {item.type === "page" ? "↗" : "●"}
                      </span>
                      <div className="quick-search-item-text">
                        <span className="quick-search-item-title">{item.title}</span>
                        <span className="quick-search-item-sub">{item.subtitle}</span>
                      </div>
                    </div>

                    <div className="quick-search-item-meta">
                      {item.score !== undefined && (
                        <span className="quick-search-item-score">
                          SLIC <strong>{item.score.toFixed(1)}</strong>
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`quick-search-badge quick-search-badge--${item.badgeVariant ?? "default"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="quick-search-footer">
          <div className="quick-search-tips">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> {copy.navigate}
            </span>
            <span>
              <kbd>↵</kbd> {copy.pressEnter}
            </span>
            <span>
              <kbd>ESC</kbd> {copy.close}
            </span>
          </div>
          <span className="quick-search-brand">SLIC V3 INDEX</span>
        </div>
      </div>
    </div>
  );
}
