import { useMemo, useState } from "react";
import BrandLockup from "./BrandLockup";
import LocaleSwitch from "./LocaleSwitch";
import { cityIdeas, ideaCategories } from "./ideasData";
import type { CityIdea } from "./ideasData";
import { getCopy } from "./siteCopy";
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

const difficultyColors: Record<CityIdea["difficulty"], string> = {
  starter: "var(--accent-green)",
  intermediate: "var(--accent-amber)",
  advanced: "var(--accent-red)",
};

function CopyButton({ text, ui }: { text: string; ui: any }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button type="button" className="idea-copy-btn" onClick={handleCopy}>
      {copied ? ui.copied : ui.copyCode}
    </button>
  );
}

export default function IdeasPage({
  onNavigate,
  locale,
  onLocaleChange,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const copy = getCopy(locale);
  const ui = copy.ideas;
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...cityIdeas];
    if (category !== "all") {
      rows = rows.filter((idea) => idea.category === category);
    }
    if (difficulty !== "all") {
      rows = rows.filter((idea) => idea.difficulty === difficulty);
    }
    return rows;
  }, [category, difficulty]);

  return (
    <>
      <header className="rankings-hero section">
        <div className="topbar topbar-stack">
          <div className="topbar-left">
            <button type="button" className="back-arrow" onClick={() => onNavigate("/")} aria-label="Back to home">&larr;</button>
            <BrandLockup eyebrow={ui.eyebrow} microCopy={ui.title} />
          </div>

          <div className="topbar-actions">
            <LocaleSwitch locale={locale} onChange={onLocaleChange} />
            <nav className="topnav" aria-label="Page navigation">
              <a href="/" onClick={(event) => navigateLink(event, onNavigate, "/")}>
                {copy.nav.home}
              </a>
              <a href="/rankings" onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>
                {copy.nav.rankings}
              </a>
              <a href="/methodology" onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>
                {copy.nav.methodology}
              </a>
            </nav>
          </div>
        </div>

        <div className="rankings-hero-grid">
          <div>
            <h1 className="rankings-title">{ui.title}</h1>
            <p className="hero-intro">{ui.intro}</p>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <p className="panel-label">{ui.category}</p>
              <div className="region-switch" role="tablist">
                <button type="button" className={category === "all" ? "region-button active" : "region-button"} onClick={() => setCategory("all")}>{ui.all}</button>
                {ideaCategories.map((cat) => (
                  <button key={cat.value} type="button" className={category === cat.value ? "region-button active" : "region-button"} onClick={() => setCategory(cat.value)}>{cat.label}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.difficulty}</p>
              <div className="mode-switch" role="tablist">
                <button type="button" className={difficulty === "all" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("all")}>{ui.all}</button>
                <button type="button" className={difficulty === "starter" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("starter")}>{ui.difficultyLabels.starter}</button>
                <button type="button" className={difficulty === "intermediate" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("intermediate")}>{ui.difficultyLabels.intermediate}</button>
                <button type="button" className={difficulty === "advanced" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("advanced")}>{ui.difficultyLabels.advanced}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{filtered.length} {copy.rankings.citiesLabel}</p>
              <h2>{ui.summary}</h2>
            </div>
          </div>

          <div className="idea-grid">
            {filtered.map((idea) => (
              <article className="idea-card" key={idea.id}>
                <div className="idea-card-head">
                  <div>
                    <div className="idea-card-meta">
                      <span className="idea-difficulty" style={{ color: difficultyColors[idea.difficulty] }}>{ui.difficultyLabels[idea.difficulty]}</span>
                      <span className="idea-category">{ideaCategories.find((c) => c.value === idea.category)?.label}</span>
                    </div>
                    <h3>{idea.title}</h3>
                    <p className="city-location">{idea.city}, {idea.country}</p>
                  </div>
                </div>

                <p className="idea-problem"><strong>{ui.problem}:</strong> {idea.problem}</p>
                <p className="idea-solution"><strong>{ui.solution}:</strong> {idea.solution}</p>
                <p className="idea-impact"><strong>{ui.impact}:</strong> {idea.impact}</p>

                <div className="metric-taglist">
                  {idea.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <button
                  type="button"
                  className={expanded === idea.id ? "idea-toggle active" : "idea-toggle"}
                  onClick={() => setExpanded(expanded === idea.id ? null : idea.id)}
                >
                  {expanded === idea.id ? ui.hideCode : ui.showCode}
                </button>

                {expanded === idea.id && (
                  <div className="idea-code-block">
                    <div className="idea-code-header">
                      <span>{ui.starterCode}</span>
                      <CopyButton text={idea.codeSnippet} ui={ui} />
                    </div>
                    <pre className="idea-code"><code>{idea.codeSnippet}</code></pre>
                    <p className="idea-repo-hint">{idea.repoHint}</p>
                  </div>
                )}

                <div className="metric-taglist">
                  {idea.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
