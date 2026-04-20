import { Suspense, lazy, useEffect, useState } from "react";
import HomePage from "./HomePage";
import SiteMasthead from "./SiteMasthead";
import { localeLabels } from "./siteCopy";
import type { Locale, SitePath } from "./types";
import { trackVisitor } from "./visitorTracking";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const IdeasPage = lazy(() => import("./IdeasPage"));
const ExercisePage = lazy(() => import("./ExercisePage"));
const MethodologyPage = lazy(() => import("./MethodologyPage"));
const RankingsPage = lazy(() => import("./RankingsPage"));
const SlicProfilePage = lazy(() => import("./SlicProfilePage"));
const ThailandPage = lazy(() => import("./ThailandPage"));
const HistoryPage = lazy(() => import("./HistoryPage"));
const CompareRankingsPage = lazy(() => import("./CompareRankingsPage"));
const SideBySidePage = lazy(() => import("./SideBySidePage"));
const CityScorecardPage = lazy(() => import("./CityScorecardPage"));

type DocumentWithViewTransition = Document & {
  startViewTransition?: Document["startViewTransition"];
};

const localeMap: Record<Locale, string> = {
  en: "en",
  th: "th",
  zh: "zh-CN",
};

function detectLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLocale = window.localStorage.getItem("slic-locale");
  if (savedLocale === "en" || savedLocale === "th" || savedLocale === "zh") {
    return savedLocale;
  }

  const candidates = [navigator.language, ...navigator.languages]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  if (candidates.some((value) => value.startsWith("th"))) {
    return "th";
  }
  if (candidates.some((value) => value.startsWith("zh"))) {
    return "zh";
  }

  return "en";
}

/** Strip the Vite base prefix so route matching uses bare paths. */
function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || "/";
  }
  return pathname;
}

function resolvePath(pathname: string): SitePath {
  const bare = stripBase(pathname);

  if (bare === "/about-slic") {
    return "/about-slic";
  }

  if (bare === "/methodology") {
    return "/methodology";
  }

  if (bare === "/rankings") {
    return "/rankings";
  }

  if (bare === "/exercise") {
    return "/exercise";
  }

  if (bare === "/thailand") {
    return "/thailand";
  }

  if (bare === "/ideas") {
    return "/ideas";
  }

  if (bare === "/compare") {
    return "/compare";
  }

  if (bare === "/side-by-side") {
    return "/side-by-side";
  }

  if (bare === "/history") {
    return "/history";
  }

  if (bare.startsWith("/city/")) {
    return "/city";
  }

  return "/";
}

/** Prepend the base to a bare app path for pushState. */
function withBase(path: string): string {
  if (path.startsWith(BASE)) return path;
  return `${BASE}${path}`;
}

function commitRoute(path: SitePath | string): SitePath {
  const full = withBase(path);
  if (window.location.pathname !== full) {
    window.history.pushState({}, "", full);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  return resolvePath(full);
}

const routeLoadingCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
  }
> = {
  en: {
    eyebrow: "Loading view",
    title: "Preparing the next section.",
    body: "Pulling in the page module and interface assets.",
  },
  th: {
    eyebrow: "กำลังโหลดหน้า",
    title: "กำลังเตรียมส่วนถัดไป",
    body: "กำลังดึงโมดูลของหน้าและองค์ประกอบของอินเทอร์เฟซ",
  },
  zh: {
    eyebrow: "正在加载页面",
    title: "正在准备下一个版块。",
    body: "正在载入页面模块与界面资源。",
  },
};

function RouteLoading({ locale }: { locale: Locale }) {
  const copy = routeLoadingCopy[locale];

  return (
    <section className="route-loading section" aria-live="polite" aria-busy="true">
      <div className="route-loading-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setCurrentRoute] = useState<SitePath>(() => resolvePath(window.location.pathname));
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    const syncRoute = () => {
      setCurrentRoute(resolvePath(window.location.pathname));
    };

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("slic-locale", locale);
    document.documentElement.lang = localeMap[locale];
  }, [locale]);

  useEffect(() => {
    const localeTitlePrefix = localeLabels[locale];
    const routeTitle =
      route === "/about-slic"
        ? locale === "th"
          ? "เกี่ยวกับ SLIC"
          : locale === "zh"
            ? "关于 SLIC"
            : "About SLIC"
        : route === "/methodology"
          ? locale === "th"
            ? "ระเบียบวิธี SLIC"
            : locale === "zh"
              ? "SLIC 方法论"
              : "SLIC Methodology"
          : route === "/rankings"
            ? locale === "th"
              ? "การจัดอันดับเมือง SLIC"
              : locale === "zh"
                ? "SLIC 城市排名"
                : "SLIC Rankings"
            : route === "/exercise"
              ? locale === "th"
                ? "แบบฝึกหาเมืองที่เหมาะกับคุณ"
                : locale === "zh"
                  ? "城市匹配练习"
                  : "City Match Exercise"
            : route === "/thailand"
              ? locale === "th"
                ? "SLIC ประเทศไทย"
                : locale === "zh"
                  ? "SLIC 泰国"
                  : "SLIC Thailand"
              : route === "/ideas"
                ? locale === "th"
                  ? "ขโมยไอเดียนี้"
                  : locale === "zh"
                    ? "偷师这个创意"
                    : "Steal This Idea"
              : route === "/compare"
                ? locale === "th"
                  ? "เปรียบเทียบดัชนี"
                  : locale === "zh"
                    ? "对比排名"
                    : "Compare Rankings"
              : route === "/history"
                ? locale === "th"
                  ? "เบื้องหลัง SLIC"
                  : locale === "zh"
                    ? "SLIC 发展历程"
                    : "How SLIC Was Built"
              : route === "/city"
                ? locale === "th"
                  ? "สรุปคะแนนเมือง"
                  : locale === "zh"
                    ? "城市评分卡"
                    : "City Scorecard"
                : locale === "th"
                  ? "สร้างอันดับเมืองของคุณ"
                  : locale === "zh"
                    ? "构建你的城市排名"
                    : "Build Your City Ranking";

    document.title = `${routeTitle} · ${localeTitlePrefix}`;
  }, [locale, route]);

  const navigate = (path: SitePath | string) => {
    const nextRoute = resolvePath(path);
    const doc = document as DocumentWithViewTransition;

    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        commitRoute(path);
        setCurrentRoute(nextRoute);
      });
      return;
    }

    commitRoute(path);
    setCurrentRoute(nextRoute);
  };

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <SiteMasthead
        locale={locale}
        currentPath={route}
        onLocaleChange={setLocale}
        onNavigate={navigate}
      />
      <div className="page-frame" id="main-content" key={route}>
        <Suspense fallback={<RouteLoading locale={locale} />}>
          {route === "/methodology" ? (
            <MethodologyPage onNavigate={navigate} locale={locale} />
          ) : route === "/about-slic" ? (
            <SlicProfilePage onNavigate={navigate} locale={locale} />
          ) : route === "/rankings" ? (
            <RankingsPage onNavigate={navigate} locale={locale} />
          ) : route === "/exercise" ? (
            <ExercisePage onNavigate={navigate} locale={locale} />
          ) : route === "/thailand" ? (
            <ThailandPage onNavigate={navigate} locale={locale} />
          ) : route === "/ideas" ? (
            <IdeasPage onNavigate={navigate} locale={locale} />
          ) : route === "/compare" ? (
            <CompareRankingsPage onNavigate={navigate} locale={locale} />
          ) : route === "/side-by-side" ? (
            <SideBySidePage onNavigate={navigate} locale={locale} />
          ) : route === "/history" ? (
            <HistoryPage onNavigate={navigate} locale={locale} />
          ) : route === "/city" ? (
            <CityScorecardPage onNavigate={navigate} locale={locale} />
          ) : (
            <HomePage onNavigate={navigate} locale={locale} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
