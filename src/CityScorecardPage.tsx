import publishedData from "./data/publishedRankingData.json";
import { getExerciseCities } from "./rankingsData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ── Types from enriched JSON ── */

interface MetricDetail {
  raw: number | null;
  score: number | null;
  source: string;
  sourceUrl: string;
  dataLevel: "city" | "national" | "derived" | "composite" | "missing";
  components?: Array<{
    key: string;
    weight: number;
    raw: number | null;
    score: number | null;
    source: string;
    sourceUrl: string;
    dataLevel: string;
  }>;
}

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  publicationStatus?: "published" | "exercise";
  cityType?: string;
  manifestStatus?: string;
  coverageGrade: string;
  overallWeightedCoverage: number | null;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
  metrics: Record<string, MetricDetail>;
  highlights: { strongest: string | null; weakest: string | null };
  pressureCoverage: number | null;
  viabilityCoverage: number | null;
  capabilityCoverage: number | null;
  communityCoverage: number | null;
  creativeCoverage: number | null;
}

interface NormStat {
  p05: number | null;
  p95: number | null;
  dir: "positive" | "negative";
}

interface PillarMetricEntry {
  key: string;
  weight: number;
}

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};

const PILLAR_LABELS: Record<string, Record<PillarId, string>> = {
  en: { pressure: "Growth Pressure", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "แรงกดดันการเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长压力", viability: "宜居性", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_WEIGHTS: Record<PillarId, number> = {
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const METRIC_LABELS: Record<string, string> = {
  pressure_disposable_income_ppp: "Disposable Income (PPP)",
  pressure_housing_burden: "Housing Burden",
  pressure_economic_growth_momentum: "Economic Growth Momentum",
  pressure_household_debt_burden: "Household Debt",
  pressure_working_time_pressure: "Working Hours",
  pressure_suicide_mental_strain: "Mental Strain",
  viability_personal_safety: "Personal Safety",
  viability_transit_access_commute: "Transit Access",
  viability_clean_air: "Air Quality",
  viability_water_sanitation_utility: "Water & Sanitation",
  viability_digital_infrastructure: "Digital Infrastructure",
  viability_climate_sunlight_livability: "Climate & Sunlight",
  capability_healthcare_quality: "Healthcare Quality",
  capability_education_quality: "Education Quality",
  capability_equal_opportunity_distributional_fairness: "Equal Opportunity",
  community_hospitality_belonging: "Hospitality & Belonging",
  community_tolerance_pluralism: "Tolerance & Pluralism",
  community_cultural_historic_public_life_vitality: "Cultural Life",
  community_birth_rate_optimism: "Birth Rate Optimism",
  creative_entrepreneurial_dynamism: "Entrepreneurial Dynamism",
  creative_innovation_research_intensity: "Innovation & R&D",
  creative_economic_vitality_productive_context: "Economic Vitality",
  creative_administrative_investment_friction: "Admin Friction",
};

const DATA_LEVEL_LABELS: Record<string, string> = {
  city: "City data",
  national: "National proxy",
  derived: "Derived",
  composite: "Composite",
  missing: "No data",
};

/* ── Helpers ── */

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

const _normStats = (publishedData as any).normStats as Record<string, NormStat>; void _normStats;
const pillarMetrics = (publishedData as any).pillarMetrics as Record<string, PillarMetricEntry[]>;
const allCities = (publishedData.cities ?? []) as PublishedCity[];

function findCity(cityId: string): PublishedCity | undefined {
  // Try exact match first (e.g. tw-taipei), then try bare name (e.g. taipei)
  const published = allCities.find((c) =>
    c.cityId === cityId || c.cityId.replace(/^[a-z]{2}-/, "") === cityId
  );
  if (published) return { ...published, publicationStatus: "published" };

  // Fallback: expose the exercise-field composite without pretending it is published.
  const exercise = getExerciseCities().find((c) => c.id === cityId.replace(/^[a-z]{2}-/, ""));
  if (!exercise) return undefined;

  return {
    cityId,
    publicationStatus: "exercise",
    displayName: exercise.name,
    country: exercise.country,
    region: exercise.region,
    coverageGrade: "Exercise",
    overallWeightedCoverage: null,
    slicScore: exercise.scores.slic,
    pressureScore: exercise.scores.pressure,
    viabilityScore: exercise.scores.viability,
    capabilityScore: exercise.scores.capability,
    communityScore: exercise.scores.community,
    creativeScore: exercise.scores.creative,
    pressureCoverage: null,
    viabilityCoverage: null,
    capabilityCoverage: null,
    communityCoverage: null,
    creativeCoverage: null,
    rank: exercise.globalRank,
    metrics: {},
    highlights: { strongest: null, weakest: null },
  } as PublishedCity;
}

function pillarScoreKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Score` as keyof PublishedCity;
}

function pillarCoverageKey(pillar: PillarId): keyof PublishedCity {
  return `${pillar}Coverage` as keyof PublishedCity;
}

/* ── Components ── */

function NormBar({ score, color }: { score: number | null; color: string }) {
  if (score === null) return <span className="scorecard-no-data">—</span>;
  return (
    <div className="scorecard-norm-bar">
      <div
        className="scorecard-norm-bar-fill"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, background: color }}
      />
      <span className="scorecard-norm-bar-label">{score.toFixed(1)}</span>
    </div>
  );
}

function DataBadge({ level }: { level: string }) {
  return (
    <span className={`scorecard-data-badge scorecard-data-badge--${level}`}>
      {DATA_LEVEL_LABELS[level] ?? level}
    </span>
  );
}

function MetricRow({
  metricKey,
  detail,
  color,
}: {
  metricKey: string;
  detail: MetricDetail;
  color: string;
}) {
  const label = METRIC_LABELS[metricKey] ?? metricKey;
  return (
    <div className="scorecard-metric-row-wrapper">
      <div className="scorecard-metric-row">
        <div className="scorecard-metric-header">
          <span className="scorecard-metric-name">{label}</span>
          <DataBadge level={detail.dataLevel} />
        </div>
        <div className="scorecard-metric-value">
          {detail.raw !== null ? (
            <span className="scorecard-raw-value">{detail.raw.toLocaleString()}</span>
          ) : (
            <span className="scorecard-raw-value scorecard-raw-value--missing">—</span>
          )}
        </div>
        <NormBar score={detail.score} color={color} />
        {detail.source && detail.sourceUrl ? (
          <a
            className="scorecard-source-link"
            href={detail.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {detail.source}
          </a>
        ) : detail.source ? (
          <span className="scorecard-source-link">{detail.source}</span>
        ) : null}
      </div>
      {detail.components && detail.components.length > 0 && (
        <div className="scorecard-metric-components">
          {detail.components.map((comp) => (
            <div key={comp.key} className="scorecard-component-row">
              <span className="scorecard-component-name">{comp.key.replace(/_/g, " ")}</span>
              <span className="scorecard-component-score">
                {comp.score !== null ? comp.score.toFixed(1) : "—"}
              </span>
              <div className="scorecard-component-bar">
                {comp.score !== null && (
                  <div
                    className="scorecard-component-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%`, background: color, opacity: 0.6 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generatePillarNarrative(pillar: PillarId, city: PublishedCity): string {
  const m = city.metrics ?? {};
  const name = city.displayName;
  const score = city[pillarScoreKey(pillar)] as number;

  if (score === null || score === undefined) return "";

  const level = score >= 67 ? "higher-range" : score >= 34 ? "mid-range" : "lower-range";

  if (pillar === "pressure") {
    const housing = m.pressure_housing_burden?.score;
    const hours = m.pressure_working_time_pressure?.score;
    const suicide = m.pressure_suicide_mental_strain?.score;
    const growth = m.pressure_economic_growth_momentum?.score;
    const parts: string[] = [];
    if (housing !== null && housing !== undefined) parts.push(housing > 60 ? "housing burden scores in the lighter range" : housing > 35 ? "housing burden sits in the middle range" : "housing burden remains elevated");
    if (hours !== null && hours !== undefined) parts.push(hours > 60 ? "working-time pressure leaves more residual time" : hours > 35 ? "working-time pressure is mid-range" : "working-time pressure remains elevated");
    if (suicide !== null && suicide !== undefined) parts.push(suicide > 60 ? "mental-strain indicators score in the higher range" : suicide > 35 ? "mental-strain indicators sit in the middle range" : "mental-strain indicators remain under pressure");
    if (growth !== null && growth !== undefined) parts.push(growth > 60 ? "growth momentum scores in the higher range" : growth > 30 ? "growth momentum is mid-range" : "growth momentum is lower-range");
    return `${name} records ${level} pressure conditions.${parts.length ? ` ${parts.join("; ")}.` : ""}`;
  }

  if (pillar === "viability") {
    const safety = m.viability_personal_safety?.score;
    const climate = m.viability_climate_sunlight_livability?.score;
    const air = m.viability_clean_air?.score;
    const parts: string[] = [];
    if (safety !== null && safety !== undefined) parts.push(safety > 70 ? "personal safety scores in the higher range" : safety > 40 ? "personal safety sits in the middle range" : "personal safety scores in the lower range");
    if (climate !== null && climate !== undefined) parts.push(climate > 60 ? "climate and sunlight conditions score in the higher range" : climate < 35 ? "climate and sunlight conditions score in the lower range" : "climate and sunlight conditions are mid-range");
    if (air !== null && air !== undefined) parts.push(air > 60 ? "air quality scores in the higher range" : air > 35 ? "air quality is mid-range" : "air quality scores in the lower range");
    return `${name} records ${level} daily-viability signals.${parts.length ? ` ${parts.join("; ")}.` : ""}`;
  }

  if (pillar === "capability") {
    const health = m.capability_healthcare_quality?.score;
    const edu = m.capability_education_quality?.score;
    const parts: string[] = [];
    if (health !== null && health !== undefined) parts.push(health > 70 ? "healthcare access and quality score in the higher range" : health > 40 ? "healthcare access and quality are mid-range" : "healthcare access and quality score in the lower range");
    if (edu !== null && edu !== undefined) parts.push(edu > 60 ? "education quality scores in the higher range" : edu > 35 ? "education quality is mid-range" : "education quality scores in the lower range");
    return `${name} records ${level} institutional-capability signals.${parts.length ? ` ${parts.join("; ")}.` : ""}`;
  }

  if (pillar === "community") {
    const hospitality = m.community_hospitality_belonging?.score;
    const cultural = m.community_cultural_historic_public_life_vitality?.score;
    const parts: string[] = [];
    if (hospitality !== null && hospitality !== undefined) parts.push(hospitality > 50 ? "belonging signals score in the higher range" : hospitality > 35 ? "belonging signals are mid-range" : "belonging signals score in the lower range");
    if (cultural !== null && cultural !== undefined) parts.push(cultural > 50 ? "cultural and public-life signals score in the higher range" : cultural > 35 ? "cultural and public-life signals are mid-range" : "cultural and public-life signals score in the lower range");
    return `${name} records ${level} community signals.${parts.length ? ` ${parts.join("; ")}.` : ""}`;
  }

  if (pillar === "creative") {
    const entrepreneurship = m.creative_entrepreneurial_dynamism?.score;
    const innovation = m.creative_innovation_research_intensity?.score;
    const parts: string[] = [];
    if (entrepreneurship !== null && entrepreneurship !== undefined) parts.push(entrepreneurship > 50 ? "entrepreneurial dynamism scores in the higher range" : entrepreneurship > 35 ? "entrepreneurial dynamism is mid-range" : "entrepreneurial dynamism scores in the lower range");
    if (innovation !== null && innovation !== undefined) parts.push(innovation > 50 ? "innovation and research intensity score in the higher range" : innovation > 35 ? "innovation and research intensity are mid-range" : "innovation and research intensity score in the lower range");
    return `${name} records ${level} creative signals.${parts.length ? ` ${parts.join("; ")}.` : ""}`;
  }

  return "";
}

function PillarSection({
  pillar,
  city,
}: {
  pillar: PillarId;
  city: PublishedCity;
}) {
  const score = city[pillarScoreKey(pillar)] as number;
  const coverage = city[pillarCoverageKey(pillar)] as number | null;
  const color = PILLAR_COLORS[pillar];
  const metrics = pillarMetrics?.[pillar] ?? [];
  const narrative = generatePillarNarrative(pillar, city);

  return (
    <div className="scorecard-pillar-section">
      <div className="scorecard-pillar-header" style={{ borderLeftColor: color }}>
        <div>
          <h3>{PILLAR_LABELS.en[pillar]}</h3>
          <span className="scorecard-pillar-weight">{PILLAR_WEIGHTS[pillar]}% weight</span>
        </div>
        <div className="scorecard-pillar-score" style={{ color }}>
          {score !== null ? score.toFixed(1) : "—"}
        </div>
      </div>
      {narrative && (
        <p className="scorecard-pillar-narrative">{narrative}</p>
      )}
      {coverage !== null && coverage < 1 && (
        <div className="scorecard-coverage-note">
          {Math.round(coverage * 100)}% data coverage
        </div>
      )}
      <div className="scorecard-metric-list">
        {metrics.map((m) => {
          const detail = city.metrics?.[m.key];
          if (!detail) return null;
          return <MetricRow key={m.key} metricKey={m.key} detail={detail} color={color} />;
        })}
      </div>
    </div>
  );
}

/* ── Main Page ── */

export default function CityScorecardPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const pathSegments = window.location.pathname.split("/city/");
  const cityId = pathSegments[pathSegments.length - 1] ?? "";
  const city = findCity(cityId);

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "8rem" }}>
        <p className="eyebrow">City not found</p>
        <h1>No data for "{cityId}"</h1>
        <a
          className="secondary-action"
          href="/rankings"
          onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
        >
          Back to rankings
        </a>
      </section>
    );
  }

  const pillarScores = PILLAR_ORDER.map((p) => ({
    id: p,
    score: city[pillarScoreKey(p)] as number,
    weight: PILLAR_WEIGHTS[p],
    color: PILLAR_COLORS[p],
    label: PILLAR_LABELS[locale]?.[p] ?? PILLAR_LABELS.en[p],
  }));
  const isPublished = city.publicationStatus !== "exercise";

  return (
    <>
      <section className="scorecard-hero section">
        <a
          className="scorecard-back"
          href="/rankings"
          onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
        >
          &larr; {locale === "en" ? "Back to rankings" : locale === "th" ? "กลับสู่อันดับ" : "返回排名"}
        </a>

        <div className="scorecard-hero-split">
          <div>
            <p className="eyebrow">{city.region}</p>
            <h1 className="scorecard-city-name">{city.displayName}</h1>
            <p className="scorecard-country">{city.country}</p>
          </div>
          <div className="scorecard-hero-scores">
            <div className="scorecard-slic-score">{city.slicScore?.toFixed(1) ?? "—"}</div>
            <div className="scorecard-rank">
              {city.rank <= 10 ? "α Alpha" : city.rank <= 20 ? "β Beta" : city.rank <= 30 ? "γ Gamma" : `#${city.rank}`}
              <span> of {allCities.filter((c) => c.rankingStatus === "Ranked").length} cities</span>
            </div>
            {isPublished ? (
              <span className={`scorecard-grade scorecard-grade--${city.coverageGrade?.toLowerCase()}`}>
                {city.coverageGrade} coverage
              </span>
            ) : (
              <span className="scorecard-grade scorecard-grade--exercise">
                {locale === "en" ? "Exploratory field" : locale === "th" ? "สนามทดลอง" : "探索字段"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── City Overview ── */}
      {isPublished && (
        <section className="section scorecard-overview">
          <p className="eyebrow">
            {locale === "en" ? "City overview" : locale === "th" ? "ภาพรวมเมือง" : "城市概况"}
          </p>
          <div className="scorecard-overview-grid">
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">Type</span>
              <strong>{city.cityType === "primary" ? "Primary city" : city.cityType === "secondary" ? "Secondary city" : city.cityType ?? "—"}</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">Region</span>
              <strong>{city.region}</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">Data coverage</span>
              <strong>{city.coverageGrade} — {Math.round((city.overallWeightedCoverage ?? 0) * 100)}%</strong>
            </div>
            <div className="scorecard-overview-card">
              <span className="scorecard-overview-label">Status</span>
              <strong>{city.manifestStatus === "locked" ? "Locked (verified)" : city.manifestStatus ?? "—"}</strong>
            </div>
            {city.metrics?.pressure_disposable_income_ppp?.raw !== null && city.metrics?.pressure_disposable_income_ppp?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Disposable income (PPP)</span>
                <strong>${Math.round(city.metrics.pressure_disposable_income_ppp.raw).toLocaleString()}/mo</strong>
              </div>
            )}
            {city.metrics?.pressure_housing_burden?.raw !== null && city.metrics?.pressure_housing_burden?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Housing burden</span>
                <strong>{city.metrics.pressure_housing_burden.raw.toFixed(1)}% of income</strong>
              </div>
            )}
            {city.metrics?.viability_personal_safety?.raw !== null && city.metrics?.viability_personal_safety?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Safety (homicide rate)</span>
                <strong>{city.metrics.viability_personal_safety.raw.toFixed(1)} per 100k</strong>
              </div>
            )}
            {city.metrics?.viability_clean_air?.raw !== null && city.metrics?.viability_clean_air?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Air quality (PM2.5)</span>
                <strong>{city.metrics.viability_clean_air.raw.toFixed(0)} μg/m³</strong>
              </div>
            )}
            {city.metrics?.capability_healthcare_quality?.raw !== null && city.metrics?.capability_healthcare_quality?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Healthcare quality</span>
                <strong>{city.metrics.capability_healthcare_quality.raw.toFixed(0)}/100</strong>
              </div>
            )}
            {city.metrics?.capability_education_quality?.raw !== null && city.metrics?.capability_education_quality?.raw !== undefined && (
              <div className="scorecard-overview-card">
                <span className="scorecard-overview-label">Education (tertiary %)</span>
                <strong>{city.metrics.capability_education_quality.raw.toFixed(0)}% enrollment</strong>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Equation bar ── */}
      <section className="scorecard-equation section">
        <p className="scorecard-equation-label">
          {isPublished
            ? locale === "en"
              ? "Published score trace"
              : locale === "th"
                ? "เส้นทางการไล่ย้อนคะแนนที่เผยแพร่"
                : "已发布分数的追溯路径"
            : locale === "en"
              ? "Exploratory score trace"
              : locale === "th"
                ? "เส้นทางการไล่ย้อนคะแนนเชิงทดลอง"
                : "探索性分数的追溯路径"}
        </p>
        <p className="scorecard-equation-note">
          {isPublished
            ? locale === "en"
              ? "This card shows the city's published SLIC score from the verified workbook export. The five pillar values below are the public trace back to that number."
              : locale === "th"
                ? "การ์ดนี้แสดงคะแนน SLIC ที่เผยแพร่ของเมืองจากเวิร์กบุ๊กที่ผ่านการตรวจสอบแล้ว โดยค่า 5 เสาหลักด้านล่างคือเส้นทางสาธารณะที่ไล่ย้อนกลับไปยังตัวเลขนั้น"
                : "此卡片显示该城市来自已核验工作簿导出的已发布 SLIC 分数。下面的五个支柱数值是回溯该数字的公开路径。"
            : locale === "en"
              ? "This city is not yet part of the verified published board. The number shown here is an exploratory field score for comparison, not the published board score."
              : locale === "th"
                ? "เมืองนี้ยังไม่อยู่ในบอร์ดที่เผยแพร่และผ่านการตรวจสอบแล้ว ตัวเลขที่แสดงจึงเป็นคะแนนภาคสนามเชิงทดลองเพื่อการเปรียบเทียบ ไม่ใช่คะแนนบนบอร์ดที่เผยแพร่"
                : "这座城市尚未进入已核验的发布榜单。这里显示的数字是用于比较的探索性场域分数，不是发布榜单分数。"}
        </p>
        <div className="scorecard-equation-bar">
          {pillarScores.map((p, i) => (
            <span key={p.id} className="scorecard-equation-term">
              {i > 0 && <span className="scorecard-equation-op">+</span>}
              <span className="scorecard-equation-weight">{(p.weight / 100).toFixed(2)}</span>
              <span className="scorecard-equation-times">&times;</span>
              <span className="scorecard-equation-pillar" style={{ color: p.color }}>
                {p.label}({p.score?.toFixed(1) ?? "?"})
              </span>
            </span>
          ))}
          <span className="scorecard-equation-op">=</span>
          <span className="scorecard-equation-result">{city.slicScore?.toFixed(1)}</span>
        </div>
      </section>

      {/* ── Pillar breakdown sections ── */}
      <main className="section scorecard-pillars">
        {PILLAR_ORDER.map((pillar) => (
          <PillarSection key={pillar} pillar={pillar} city={city} />
        ))}
      </main>

      {/* ── Highlights ── */}
      {city.highlights && (city.highlights.strongest || city.highlights.weakest) && (
        <section className="section scorecard-highlights">
          <p className="eyebrow">
            {locale === "en" ? "What stands out" : locale === "th" ? "จุดเด่น" : "亮点"}
          </p>
          <div className="scorecard-highlight-grid">
            {city.highlights.strongest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--strong">
                <span className="scorecard-highlight-label">
                  {locale === "en" ? "Highest-scoring metric" : locale === "th" ? "ตัวชี้วัดที่ได้คะแนนสูงสุด" : "最高分指标"}
                </span>
                <strong>{METRIC_LABELS[city.highlights.strongest] ?? city.highlights.strongest}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.strongest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
            {city.highlights.weakest && (
              <div className="scorecard-highlight-card scorecard-highlight-card--weak">
                <span className="scorecard-highlight-label">
                  {locale === "en" ? "Lowest-scoring metric" : locale === "th" ? "ตัวชี้วัดที่ได้คะแนนต่ำสุด" : "最低分指标"}
                </span>
                <strong>{METRIC_LABELS[city.highlights.weakest] ?? city.highlights.weakest}</strong>
                <span className="scorecard-highlight-score">
                  {city.metrics?.[city.highlights.weakest]?.score?.toFixed(1) ?? "—"}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Data transparency ── */}
      <section className="section scorecard-transparency">
        <p className="eyebrow">
          {locale === "en" ? "Data transparency" : locale === "th" ? "ความโปร่งใสของข้อมูล" : "数据透明度"}
        </p>
        {isPublished ? (
          <>
            <div className="scorecard-transparency-grid">
              <div className="scorecard-transparency-stat">
                <strong>{Math.round((city.overallWeightedCoverage ?? 0) * 100)}%</strong>
                <span>overall coverage</span>
              </div>
              {PILLAR_ORDER.map((p) => {
                const cov = city[pillarCoverageKey(p)] as number | null;
                return (
                  <div key={p} className="scorecard-transparency-stat">
                    <strong style={{ color: PILLAR_COLORS[p] }}>{Math.round((cov ?? 0) * 100)}%</strong>
                    <span>{PILLAR_LABELS.en[p]}</span>
                  </div>
                );
              })}
            </div>
            <p className="scorecard-transparency-note">
              Metrics marked "City data" come from verified city-level sources. "National proxy" means the value is a country-level estimate applied to this city. "Derived" means the value is calculated from other inputs.
            </p>
          </>
        ) : (
          <p className="scorecard-transparency-note">
            {locale === "en"
              ? "No published workbook coverage snapshot is attached to this city yet. Metric-level provenance appears after the city enters the verified board."
              : locale === "th"
                ? "เมืองนี้ยังไม่มีสแนปช็อตความครอบคลุมจากเวิร์กบุ๊กที่เผยแพร่แล้ว โดยข้อมูลแหล่งที่มาระดับตัวชี้วัดจะปรากฏเมื่อเมืองเข้าสู่บอร์ดที่ผ่านการตรวจสอบ"
                : "这座城市目前尚未附带已发布工作簿的覆盖率快照。待其进入已核验榜单后，才会显示指标级溯源信息。"}
          </p>
        )}
      </section>

      {/* ── Sticky bottom back button ── */}
      <div className="scorecard-bottom-nav">
        <a
          className="scorecard-back"
          href="/"
          onClick={(event) => navigateLink(event, onNavigate, "/")}
        >
          &larr; {locale === "en" ? "Back to all cities" : locale === "th" ? "กลับสู่เมืองทั้งหมด" : "返回所有城市"}
        </a>
      </div>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
