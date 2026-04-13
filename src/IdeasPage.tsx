import { useMemo, useState } from "react";
import { cityIdeas, ideaCategories } from "./ideasData";
import type { CityIdea } from "./ideasData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

const difficultyColors: Record<CityIdea["difficulty"], string> = {
  starter: "var(--accent-green)",
  intermediate: "var(--accent-amber)",
  advanced: "var(--accent-red)",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button type="button" className="idea-copy-btn" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy code"}
    </button>
  );
}

export default function IdeasPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
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


        <div className="rankings-hero-grid">
          <div>
            <h1 className="rankings-title">Steal This Idea</h1>
            <p className="hero-intro">
              Real city innovations with working code you can copy, adapt, and deploy.
              Each idea comes from a real programme in a real city. The code snippets
              are starter templates you can drop into a no-code platform or build on directly.
            </p>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <p className="panel-label">Category</p>
              <div className="region-switch" role="group" aria-label="Idea category filter">
                <button type="button" className={category === "all" ? "region-button active" : "region-button"} onClick={() => setCategory("all")}>All</button>
                {ideaCategories.map((cat) => (
                  <button key={cat.value} type="button" className={category === cat.value ? "region-button active" : "region-button"} onClick={() => setCategory(cat.value)}>{cat.label}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">Difficulty</p>
              <div className="mode-switch" role="group" aria-label="Idea difficulty filter">
                <button type="button" className={difficulty === "all" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("all")}>All</button>
                <button type="button" className={difficulty === "starter" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("starter")}>Starter</button>
                <button type="button" className={difficulty === "intermediate" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("intermediate")}>Intermediate</button>
                <button type="button" className={difficulty === "advanced" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("advanced")}>Advanced</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{filtered.length} ideas</p>
              <h2>Copy, adapt, deploy</h2>
            </div>
            <p className="section-summary">
              Click any card to reveal the working code snippet. Copy it directly or use it as a starting point.
            </p>
          </div>

          <div className="idea-grid">
            {filtered.map((idea) => (
              <article className="idea-card" key={idea.id}>
                <div className="idea-card-head">
                  <div>
                    <div className="idea-card-meta">
                      <span className="idea-difficulty" style={{ color: difficultyColors[idea.difficulty] }}>{idea.difficulty}</span>
                      <span className="idea-category">{ideaCategories.find((c) => c.value === idea.category)?.label}</span>
                    </div>
                    <h3>{idea.title}</h3>
                    <p className="city-location">{idea.city}, {idea.country}</p>
                  </div>
                </div>

                <p className="idea-problem"><strong>Problem:</strong> {idea.problem}</p>
                <p className="idea-solution"><strong>Solution:</strong> {idea.solution}</p>
                <p className="idea-impact"><strong>Impact:</strong> {idea.impact}</p>

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
                  {expanded === idea.id ? "Hide code" : "Show code"}
                </button>

                {expanded === idea.id && (
                  <div className="idea-code-block">
                    <div className="idea-code-header">
                      <span>Starter code</span>
                      <CopyButton text={idea.codeSnippet} />
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
