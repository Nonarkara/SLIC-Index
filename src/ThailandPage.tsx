import { useMemo, useState } from "react";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import { thailandProvinces, thailandRegions } from "./thailandData";
import type { Locale, SitePath } from "./types";

type ScorePillar = "overall" | "safety" | "economy" | "health" | "education" | "environment" | "infrastructure" | "culture";

/* ───── Score pillars ───── */
const scorePillarLabels: Record<Locale, Record<ScorePillar, string>> = {
  en: {
    overall: "Overall",
    safety: "Safety",
    economy: "Economy",
    health: "Health",
    education: "Education",
    environment: "Environment",
    infrastructure: "Infrastructure",
    culture: "Culture",
  },
  th: {
    overall: "ภาพรวม",
    safety: "ความปลอดภัย",
    economy: "เศรษฐกิจ",
    health: "สุขภาพ",
    education: "การศึกษา",
    environment: "สิ่งแวดล้อม",
    infrastructure: "โครงสร้างพื้นฐาน",
    culture: "วัฒนธรรม",
  },
  zh: {
    overall: "总分",
    safety: "安全",
    economy: "经济",
    health: "健康",
    education: "教育",
    environment: "环境",
    infrastructure: "基础设施",
    culture: "文化",
  },
};

function formatBaht(value: number): string {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(value);
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 65) return "var(--accent-cyan)";
  if (score >= 50) return "var(--accent-amber)";
  return "var(--accent-red)";
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="th-score-bar">
      <div className="th-score-bar-header">
        <span>{label}</span>
        <strong style={{ color: scoreColor(score) }}>{score}</strong>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${score}%`, background: scoreColor(score) }} />
      </div>
    </div>
  );
}

export default function ThailandPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const ui = copy.thailand.ui;
  const [pillar, setPillar] = useState<ScorePillar>("overall");
  const [region, setRegion] = useState<string>("All");
  const [scope, setScope] = useState<"ranked" | "all">("all");

  const filtered = useMemo(() => {
    let rows = scope === "ranked"
      ? thailandProvinces.filter((p) => p.status === "ranked")
      : [...thailandProvinces];
    if (region !== "All") {
      rows = rows.filter((p) => p.region === region);
    }
    return rows.sort((a, b) => b.scores[pillar] - a.scores[pillar]);
  }, [pillar, region, scope]);

  const topCards = filtered.slice(0, 5);
  const tableRows = filtered.slice(5);

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{copy.thailand.eyebrow}</p>
            <h1 className="rankings-title">{copy.thailand.title}</h1>
            <p className="hero-intro">{copy.thailand.intro}</p>
            <p className="rankings-filter-note">{copy.thailand.note}</p>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <div>
                <p className="panel-label">{ui.scope}</p>
                <div className="region-switch" role="tablist">
                  <button type="button" className={scope === "ranked" ? "region-button active" : "region-button"} onClick={() => setScope("ranked")}>{ui.ranked}</button>
                  <button type="button" className={scope === "all" ? "region-button active" : "region-button"} onClick={() => setScope("all")}>{ui.all}</button>
                </div>
              </div>

              <p className="panel-label">{ui.region}</p>
              <div className="region-switch" role="tablist">
                <button type="button" className={region === "All" ? "region-button active" : "region-button"} onClick={() => setRegion("All")}>{ui.allRegions}</button>
                {thailandRegions.map((r) => (
                  <button key={r} type="button" className={region === r ? "region-button active" : "region-button"} onClick={() => setRegion(r)}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.sortBy}</p>
              <div className="mode-switch" role="tablist">
                {(Object.keys(scorePillarLabels[locale]) as ScorePillar[]).map((p) => (
                  <button key={p} type="button" className={p === pillar ? "mode-button active" : "mode-button"} onClick={() => setPillar(p)}>{scorePillarLabels[locale][p]}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.topProvinces}</p>
              <h2>{ui.leadingOn} {scorePillarLabels[locale][pillar].toLowerCase()}</h2>
            </div>
            <p className="section-summary">{ui.topSummary}</p>
          </div>

          <div className="ranking-card-grid">
            {topCards.map((province, index) => (
              <article className="ranking-detail-card" key={province.id}>
                <div className="ranking-detail-head">
                  <div>
                    <p className="panel-label">{ui.rankLabel} {String(index + 1).padStart(2, "0")}</p>
                    <h3>{province.nameEn}</h3>
                    <p className="city-location">{province.nameTh} / {province.region}</p>
                  </div>
                  <div className="detail-score">
                    <strong style={{ color: scoreColor(province.scores[pillar]) }}>{province.scores[pillar]}</strong>
                    <span>{scorePillarLabels[locale][pillar]}</span>
                  </div>
                </div>

                <p className="city-tagline">{province.tagline}</p>

                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <ScoreBar score={province.scores.safety} label={scorePillarLabels[locale].safety} />
                  <ScoreBar score={province.scores.economy} label={scorePillarLabels[locale].economy} />
                  <ScoreBar score={province.scores.health} label={scorePillarLabels[locale].health} />
                  <ScoreBar score={province.scores.education} label={scorePillarLabels[locale].education} />
                  <ScoreBar score={province.scores.environment} label={scorePillarLabels[locale].environment} />
                  <ScoreBar score={province.scores.infrastructure} label={ui.infraShort} />
                  <ScoreBar score={province.scores.culture} label={scorePillarLabels[locale].culture} />
                </div>

                <div className="detail-metric-grid">
                  <div>
                    <span>{ui.gppPerCapita}</span>
                    <strong>฿{formatBaht(province.metrics.gppPerCapita)}</strong>
                  </div>
                  <div>
                    <span>{ui.avgIncome}</span>
                    <strong>฿{formatBaht(province.metrics.avgMonthlyIncome)}{ui.perMonth}</strong>
                  </div>
                  <div>
                    <span>{ui.pm25}</span>
                    <strong style={{ color: province.metrics.pm25Annual > 35 ? "var(--accent-red)" : province.metrics.pm25Annual > 25 ? "var(--accent-amber)" : "var(--accent-green)" }}>
                      {province.metrics.pm25Annual} µg/m³
                    </strong>
                  </div>
                </div>

                <div className="metric-taglist">
                  {province.highlights.map((h) => (<span key={h}>{h}</span>))}
                  {province.status === "provisional" && <span>{ui.provisional}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {tableRows.length > 0 && (
          <section className="rankings-table-section section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{ui.fullTable}</p>
                <h2>{ui.remaining}</h2>
              </div>
            </div>

            <div className="sheet-table-shell">
              <table className="sheet-table ranking-table">
                <thead>
                  <tr>
                    <th>{ui.rank}</th>
                    <th>{ui.province}</th>
                    <th>{ui.regionColumn}</th>
                    <th>{scorePillarLabels[locale][pillar]}</th>
                    <th>{ui.gppPerCapita}</th>
                    <th>{ui.pm25}</th>
                    <th>{ui.beds}</th>
                    <th>{ui.crime}</th>
                    <th>{ui.green}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((province, index) => (
                    <tr key={province.id}>
                      <td>{index + 6}</td>
                      <td><strong>{province.nameEn}</strong><br /><small style={{ color: "var(--text-soft)" }}>{province.nameTh}</small></td>
                      <td>{province.region}</td>
                      <td style={{ color: scoreColor(province.scores[pillar]) }}><strong>{province.scores[pillar]}</strong></td>
                      <td>฿{formatBaht(province.metrics.gppPerCapita)}</td>
                      <td style={{ color: province.metrics.pm25Annual > 35 ? "var(--accent-red)" : "inherit" }}>{province.metrics.pm25Annual}</td>
                      <td>{province.metrics.hospitalBeds}</td>
                      <td>{province.metrics.crimeRate}</td>
                      <td>{province.metrics.greenCoverage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.patternsEyebrow}</p>
              <h2>{ui.patternsTitle}</h2>
            </div>
            <p className="section-summary">{ui.patternsSummary}</p>
          </div>

          <div className="critique-grid">
            <article className="paper-card">
              <p className="panel-label">{ui.centralLabel}</p>
              <h3>{ui.centralTitle}</h3>
              <p>{ui.centralBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.northLabel}</p>
              <h3>{ui.northTitle}</h3>
              <p>{ui.northBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.isanLabel}</p>
              <h3>{ui.isanTitle}</h3>
              <p>{ui.isanBody}</p>
            </article>
            <article className="paper-card">
              <p className="panel-label">{ui.southEastLabel}</p>
              <h3>{ui.southEastTitle}</h3>
              <p>{ui.southEastBody}</p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
