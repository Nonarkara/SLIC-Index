import { Suspense, lazy, useEffect, useState } from "react";
import SiteMasthead from "./SiteMasthead";
import { localeLabels, getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";
import { trackVisitor } from "./visitorTracking";

const LandingPage = lazy(() => import("./CompareRankingsPage"));
const IdeasPage = lazy(() => import("./IdeasPage"));
const MethodologyPage = lazy(() => import("./MethodologyPage"));
const RankingsPage = lazy(() => import("./RankingsPage"));
const SlicProfilePage = lazy(() => import("./SlicProfilePage"));
const ThailandPage = lazy(() => import("./ThailandPage"));
const HistoryPage = lazy(() => import("./HistoryPage"));
const CompareCitiesPage = lazy(() => import("./CompareCitiesPage"));
const CityScorecardPage = lazy(() => import("./CityScorecardPage"));

type DocumentWithViewTransition = Document & {
  startViewTransition?: Document["startViewTransition"];
};

function resolvePath(pathname: string): SitePath {
  if (pathname === "/about-slic") {
    return "/about-slic";
  }

  if (pathname === "/methodology") {
    return "/methodology";
  }

  if (pathname === "/rankings") {
    return "/rankings";
  }


  if (pathname === "/thailand") {
    return "/thailand";
  }

  if (pathname === "/ideas") {
    return "/ideas";
  }


  if (pathname === "/history") {
    return "/history";
  }

  if (pathname.startsWith("/city/")) {
    return "/city";
  }

  if (pathname === "/compare") {
    return "/compare";
  }

  return "/";
}

function commitRoute(path: SitePath | string): SitePath {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  return resolvePath(path);
}

function RouteLoading({ locale }: { locale: Locale }) {
  const copy = getCopy(locale).app.loading;

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
  const [locale, setLocale] = useState<Locale>("en");

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
    const copy = getCopy(locale);
    const localeTitlePrefix = localeLabels[locale];
    
    let routeTitle = copy.app.titles.default;
    
    if (route === "/about-slic") routeTitle = copy.app.titles.about;
    else if (route === "/methodology") routeTitle = copy.app.titles.methodology;
    else if (route === "/rankings") routeTitle = copy.app.titles.rankings;
    else if (route === "/thailand") routeTitle = copy.app.titles.thailand;
    else if (route === "/ideas") routeTitle = copy.app.titles.ideas;
    else if (route === "/history") routeTitle = copy.app.titles.history;
    else if (route === "/city") routeTitle = copy.app.titles.city;

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
      <div className="page-frame" key={route}>
        <Suspense fallback={<RouteLoading locale={locale} />}>
          {route === "/compare" ? (
            <CompareCitiesPage locale={locale} onNavigate={navigate} />
          ) : route === "/methodology" ? (
            <MethodologyPage onNavigate={navigate} locale={locale} />
          ) : route === "/about-slic" ? (
            <SlicProfilePage onNavigate={navigate} locale={locale} />
          ) : route === "/rankings" ? (
            <RankingsPage onNavigate={navigate} locale={locale} />
          ) : route === "/thailand" ? (
            <ThailandPage onNavigate={navigate} locale={locale} />
          ) : route === "/ideas" ? (
            <IdeasPage onNavigate={navigate} locale={locale} onLocaleChange={setLocale} />
          ) : route === "/history" ? (
            <HistoryPage onNavigate={navigate} locale={locale} />
          ) : route === "/city" ? (
            <CityScorecardPage onNavigate={navigate} locale={locale} />
          ) : (
            <LandingPage onNavigate={navigate} locale={locale} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
