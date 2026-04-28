import publishedRankingData from "./data/publishedRankingData.json";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

type DataLevel = "city" | "national" | "derived" | "composite" | "missing";
type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

interface MetricComponent {
  key?: string;
  raw?: number | null;
  score?: number | null;
  scoreExact?: number | null;
  source?: string;
  sourceUrl?: string;
  dataLevel?: DataLevel | string;
}

interface MetricDetail extends MetricComponent {
  components?: MetricComponent[];
  diagnostic?: boolean;
  scored?: boolean;
}

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  rankingStatus: string;
  rank: number;
  metrics?: Record<string, MetricDetail>;
}

interface MetricCatalogEntry {
  pillar?: PillarId;
  weight?: number;
  kind?: string;
  scored?: boolean;
  diagnostic?: boolean;
  inputKey?: string | null;
  label?: string;
  components?: unknown[];
}

interface PublicationPayload {
  updatedAt?: string;
  cities?: PublishedCity[];
  metricCatalog?: Record<string, MetricCatalogEntry>;
  pillarMetrics?: Record<PillarId, Array<{ key: string; weight: number }>>;
  diagnosticMetrics?: Record<PillarId, Array<{ key: string; weight: number }>>;
  diagnostics?: {
    scoreModel?: {
      totalCityCount?: number;
      rankedCityCount?: number;
      watchlistCityCount?: number;
      scoredMetricCount?: number;
      diagnosticMetricCount?: number;
    };
    provenance?: {
      publicMetricLineCount?: number;
      observedMetricLines?: number;
      dataLevelCounts?: Partial<Record<DataLevel, number>>;
      dataLevelShares?: Partial<Record<DataLevel, number>>;
      observedDataLevelShares?: Partial<Record<Exclude<DataLevel, "missing">, number>>;
    };
    coverage?: {
      gradeCounts?: Record<string, number>;
    };
    integrity?: {
      issueCount?: number;
      exactRankInversions?: unknown[];
      tierCounts?: Record<string, number>;
    };
  };
  methodologyFacts?: {
    scoredMetricCount?: number;
    diagnosticMetricCount?: number;
  };
  publicationManifest?: {
    generatedAt?: string;
    scorerVersion?: string;
    tierPolicyVersion?: string;
    normStatsHash?: string;
    inputDataHash?: string;
    metricCatalogHash?: string;
    publicationHash?: string;
  };
}

interface SourceRecord {
  label: string;
  url: string;
  domain: string;
  dataLevel: DataLevel;
  metricKey: string;
}

const publication = publishedRankingData as PublicationPayload;
const cities = publication.cities ?? [];
const metricCatalog = publication.metricCatalog ?? {};
const pillarOrder: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
const dataLevelOrder: DataLevel[] = ["city", "national", "derived", "composite", "missing"];

const copy = {
  en: {
    eyebrow: "Evidence Register",
    title: "The data underneath SLIC.",
    intro:
      "A compact audit surface for the current publication bundle: observed metric lines, provenance level, source families, metric architecture, and reproducibility fingerprints.",
    publicLines: "public metric lines",
    observedLines: "observed lines",
    sourceLabels: "source labels",
    sourceUrls: "source URLs",
    sourceDomains: "source domains",
    componentInputs: "component inputs",
    cities: "cities",
    ranked: "ranked",
    watchlist: "watchlist",
    scoreModel: "score model",
    updated: "updated",
    provenanceTitle: "Provenance mix",
    provenanceSummary:
      "Every public metric line is assigned a data level. City and metro lines are local evidence; national, derived, and composite lines are explicit proxies or computed evidence, never hidden bonuses.",
    sourceTitle: "Source families",
    sourceSummary:
      "The source desk counts every metric-level and component-level source URL in the current published bundle.",
    metricTitle: "Metric architecture",
    metricSummary:
      "The public score uses 20 scored metric lines across five pillars, plus 3 visible diagnostics that do not enter the aggregate.",
    coverageTitle: "Coverage and audit trail",
    coverageSummary:
      "The publication carries hashes and integrity checks so future reruns can be compared against the same model, normalization statistics, and metric catalog.",
    observedShare: "observed share",
    totalShare: "total share",
    noUrl: "No URL",
    scored: "scored",
    diagnostic: "diagnostic",
    weight: "weight",
    coverageGrade: "coverage grade",
    issueCount: "integrity issues",
    rankInversions: "rank inversions",
    tierCount: "tiered cities",
    tierPolicy: "Tier policy",
    manifestLabel: "Manifest",
    reproducibilityLabel: "Reproducibility",
  },
  th: {
    eyebrow: "ทะเบียนหลักฐาน",
    title: "ข้อมูลที่อยู่ใต้ SLIC",
    intro:
      "หน้าตรวจสอบชุดข้อมูลเผยแพร่ปัจจุบัน: จำนวน metric line ที่มีข้อมูล ชั้น provenance กลุ่มแหล่งข้อมูล โครงสร้างเมตริก และ fingerprint สำหรับทำซ้ำ",
    publicLines: "metric line สาธารณะ",
    observedLines: "บรรทัดที่มีข้อมูล",
    sourceLabels: "ป้ายกำกับแหล่งข้อมูล",
    sourceUrls: "URL แหล่งข้อมูล",
    sourceDomains: "โดเมนแหล่งข้อมูล",
    componentInputs: "อินพุตย่อย",
    cities: "เมือง",
    ranked: "จัดอันดับ",
    watchlist: "เฝ้าระวัง",
    scoreModel: "โมเดลคะแนน",
    updated: "อัปเดต",
    provenanceTitle: "สัดส่วน provenance",
    provenanceSummary:
      "ทุก metric line สาธารณะมี data level กำกับ ข้อมูลระดับเมืองคือหลักฐานท้องถิ่น ส่วน national, derived และ composite คือ proxy หรือหลักฐานคำนวณที่ประกาศชัด",
    sourceTitle: "กลุ่มแหล่งข้อมูล",
    sourceSummary:
      "source desk นับ URL ระดับเมตริกและระดับ component ทั้งหมดใน bundle เผยแพร่ปัจจุบัน",
    metricTitle: "โครงสร้างเมตริก",
    metricSummary:
      "คะแนนสาธารณะใช้ 20 metric line ที่ให้คะแนนจริงใน 5 เสา พร้อม diagnostic ที่มองเห็นได้ 3 รายการซึ่งไม่เข้า aggregate",
    coverageTitle: "Coverage และ audit trail",
    coverageSummary:
      "ชุดเผยแพร่มี hash และ integrity check เพื่อให้ rerun ในอนาคตเทียบกับโมเดล normStats และ metric catalog เดิมได้",
    observedShare: "สัดส่วนที่มีข้อมูล",
    totalShare: "สัดส่วนทั้งหมด",
    noUrl: "ไม่มี URL",
    scored: "คิดคะแนน",
    diagnostic: "diagnostic",
    weight: "น้ำหนัก",
    coverageGrade: "coverage grade",
    issueCount: "ปัญหา integrity",
    rankInversions: "rank inversion",
    tierCount: "เมืองที่มี tier",
    tierPolicy: "นโยบาย Tier",
    manifestLabel: "Manifest",
    reproducibilityLabel: "ทำซ้ำได้",
  },
  zh: {
    eyebrow: "证据登记",
    title: "SLIC 底层数据",
    intro:
      "当前发布包的紧凑审计页：已观察指标行、来源层级、来源家族、指标结构与可复现指纹。",
    publicLines: "公开指标行",
    observedLines: "有数据的指标行",
    sourceLabels: "来源标签",
    sourceUrls: "来源 URL",
    sourceDomains: "来源域名",
    componentInputs: "组件输入",
    cities: "城市",
    ranked: "已排名",
    watchlist: "观察名单",
    scoreModel: "评分模型",
    updated: "更新时间",
    provenanceTitle: "来源层级结构",
    provenanceSummary:
      "每一条公开指标行都有 data level。城市 / 都会数据是本地证据；国家、派生与复合数据是明确代理或计算证据，不是隐藏加分。",
    sourceTitle: "来源家族",
    sourceSummary:
      "source desk 统计当前发布包中所有指标级与组件级来源 URL。",
    metricTitle: "指标结构",
    metricSummary:
      "公开分数使用五大支柱下的 20 条计分指标，并展示 3 条不进入总分的诊断指标。",
    coverageTitle: "覆盖度与审计轨迹",
    coverageSummary:
      "发布包携带哈希与完整性检查，方便未来重跑时与同一模型、normStats 与 metric catalog 对照。",
    observedShare: "有数据占比",
    totalShare: "总占比",
    noUrl: "无 URL",
    scored: "计分",
    diagnostic: "诊断",
    weight: "权重",
    coverageGrade: "覆盖等级",
    issueCount: "完整性问题",
    rankInversions: "排名倒置",
    tierCount: "分层城市",
    tierPolicy: "分层策略",
    manifestLabel: "清单",
    reproducibilityLabel: "可复现性",
  },
} as const;

const pillarLabels: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Pressure", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "แรงกดดัน", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "สร้างสรรค์" },
  zh: { pressure: "压力", viability: "宜居", capability: "能力", community: "社区", creative: "创造" },
};

const dataLevelLabels: Record<Locale, Record<DataLevel, string>> = {
  en: { city: "City / metro", national: "National", derived: "Derived", composite: "Composite", missing: "Missing" },
  th: { city: "เมือง / เมโทร", national: "ระดับชาติ", derived: "คำนวณต่อ", composite: "คอมโพสิต", missing: "ขาดข้อมูล" },
  zh: { city: "城市 / 都会", national: "国家层", derived: "派生", composite: "复合", missing: "缺失" },
};

function isObserved(metric?: MetricComponent) {
  return metric?.raw != null || metric?.scoreExact != null || metric?.score != null;
}

function domainOf(url: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function cleanDataLevel(level: string | undefined): DataLevel {
  return dataLevelOrder.includes(level as DataLevel) ? (level as DataLevel) : "missing";
}

function collectSourceRecords() {
  const records: SourceRecord[] = [];
  let componentInputCount = 0;

  for (const city of cities) {
    for (const [metricKey, metric] of Object.entries(city.metrics ?? {})) {
      const label = metric.source?.trim() ?? "";
      const url = metric.sourceUrl?.trim() ?? "";
      if (label || url) {
        records.push({
          label: label || domainOf(url) || "Unlabelled source",
          url,
          domain: domainOf(url),
          dataLevel: cleanDataLevel(metric.dataLevel),
          metricKey,
        });
      }

      for (const component of metric.components ?? []) {
        componentInputCount += 1;
        const componentLabel = component.source?.trim() ?? "";
        const componentUrl = component.sourceUrl?.trim() ?? "";
        if (componentLabel || componentUrl) {
          records.push({
            label: componentLabel || domainOf(componentUrl) || "Unlabelled component source",
            url: componentUrl,
            domain: domainOf(componentUrl),
            dataLevel: cleanDataLevel(component.dataLevel),
            metricKey: component.key ?? metricKey,
          });
        }
      }
    }
  }

  return { records, componentInputCount };
}

function tally<T extends string>(values: T[]) {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

function numberFormat(locale: Locale) {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US");
}

function percent(value: number | null | undefined) {
  return typeof value === "number" ? `${Math.round(value * 1000) / 10}%` : "—";
}

function shortHash(value: string | undefined) {
  return value ? `${value.slice(0, 12)}…` : "—";
}

function formatDate(value: string | undefined, locale: Locale) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const sourceBundle = collectSourceRecords();
const sourceRecords = sourceBundle.records;
const sourceLabels = new Set(sourceRecords.map((record) => record.label).filter(Boolean));
const sourceUrls = new Set(sourceRecords.map((record) => record.url).filter(Boolean));
const sourceDomains = new Set(sourceRecords.map((record) => record.domain).filter(Boolean));
const domainRows = tally(sourceRecords.map((record) => record.domain).filter(Boolean)).slice(0, 12);
const sourceLabelRows = tally(sourceRecords.map((record) => record.label).filter(Boolean)).slice(0, 12);

function metricLabel(key: string) {
  return metricCatalog[key]?.label ?? key.replaceAll("_", " ");
}

function metricCountForPillar(pillar: PillarId) {
  return (publication.pillarMetrics?.[pillar]?.length ?? 0) + (publication.diagnosticMetrics?.[pillar]?.length ?? 0);
}

export default function DataSourcesPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const ui = copy[locale];
  const nf = numberFormat(locale);
  const provenance = publication.diagnostics?.provenance;
  const scoreModel = publication.diagnostics?.scoreModel;
  const coverage = publication.diagnostics?.coverage?.gradeCounts ?? {};
  const integrity = publication.diagnostics?.integrity;
  const manifest = publication.publicationManifest;
  const rankedCount = scoreModel?.rankedCityCount ?? cities.filter((city) => city.rankingStatus === "Ranked").length;
  const watchlistCount = scoreModel?.watchlistCityCount ?? cities.length - rankedCount;
  const expectedMetricLines = provenance?.publicMetricLineCount ?? cities.length * Object.keys(metricCatalog).length;
  const observedMetricLines = provenance?.observedMetricLines ?? cities.reduce(
    (sum, city) => sum + Object.values(city.metrics ?? {}).filter((metric) => isObserved(metric)).length,
    0,
  );
  const scoredMetricCount = publication.methodologyFacts?.scoredMetricCount ?? scoreModel?.scoredMetricCount ?? 0;
  const diagnosticMetricCount = publication.methodologyFacts?.diagnosticMetricCount ?? scoreModel?.diagnosticMetricCount ?? 0;
  const tieredCount = Object.values(integrity?.tierCounts ?? {}).reduce((sum, count) => sum + count, 0);

  const heroStats = [
    { label: ui.cities, value: nf.format(cities.length), note: `${nf.format(rankedCount)} ${ui.ranked} / ${nf.format(watchlistCount)} ${ui.watchlist}` },
    { label: ui.publicLines, value: nf.format(expectedMetricLines), note: `${nf.format(observedMetricLines)} ${ui.observedLines}` },
    { label: ui.sourceLabels, value: nf.format(sourceLabels.size), note: `${nf.format(sourceUrls.size)} ${ui.sourceUrls}` },
    { label: ui.sourceDomains, value: nf.format(sourceDomains.size), note: `${nf.format(sourceBundle.componentInputCount)} ${ui.componentInputs}` },
  ];

  const auditRows = [
    { label: ui.scoreModel, value: manifest?.scorerVersion ?? "—" },
    { label: ui.tierPolicy, value: manifest?.tierPolicyVersion ?? "—" },
    { label: "normStatsHash", value: shortHash(manifest?.normStatsHash) },
    { label: "inputDataHash", value: shortHash(manifest?.inputDataHash) },
    { label: "metricCatalogHash", value: shortHash(manifest?.metricCatalogHash) },
    { label: "publicationHash", value: shortHash(manifest?.publicationHash) },
  ];

  return (
    <>
      <main>
        <header className="rankings-hero section data-sources-page">
          <div className="rankings-hero-grid">
            <div>
              <p className="eyebrow">{ui.eyebrow}</p>
              <h1 className="rankings-title">{ui.title}</h1>
              <p className="hero-intro">{ui.intro}</p>
              <div className="rankings-status-grid data-sources-status-grid">
                {heroStats.map((stat) => (
                  <div className="rankings-status-card" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.note}</small>
                  </div>
                ))}
              </div>
            </div>

            <article className="hero-ranking-card data-manifest-card">
              <div className="hero-ranking-head">
                <div>
                  <p className="panel-label">{ui.manifestLabel}</p>
                  <h2>{formatDate(manifest?.generatedAt ?? publication.updatedAt, locale)}</h2>
                  <p className="hero-ranking-summary">{manifest?.publicationHash ?? "—"}</p>
                </div>
              </div>
              <div className="ranking-diagnostic-grid">
                <article>
                  <span>{ui.issueCount}</span>
                  <strong>{nf.format(integrity?.issueCount ?? 0)}</strong>
                </article>
                <article>
                  <span>{ui.rankInversions}</span>
                  <strong>{nf.format(integrity?.exactRankInversions?.length ?? 0)}</strong>
                </article>
                <article>
                  <span>{ui.tierCount}</span>
                  <strong>{nf.format(tieredCount)}</strong>
                </article>
              </div>
            </article>
          </div>
        </header>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.provenanceTitle}</p>
              <h2>{ui.observedLines}: {nf.format(observedMetricLines)}</h2>
            </div>
            <p className="section-summary">{ui.provenanceSummary}</p>
          </div>

          <div className="data-level-grid">
            {dataLevelOrder.map((level) => {
              const count = provenance?.dataLevelCounts?.[level] ?? 0;
              const share = level === "missing"
                ? provenance?.dataLevelShares?.[level]
                : provenance?.observedDataLevelShares?.[level];
              const barWidth = Math.max(2, Math.round((share ?? 0) * 100));
              return (
                <article className="paper-card data-level-card" key={level}>
                  <div className="ranking-source-card-head">
                    <p className="panel-label">{dataLevelLabels[locale][level]}</p>
                    <span className="ranking-source-date">{nf.format(count)}</span>
                  </div>
                  <div className="data-level-bar" aria-hidden="true">
                    <span style={{ width: `${barWidth}%` }} />
                  </div>
                  <p>
                    {level === "missing" ? ui.totalShare : ui.observedShare}: <strong>{percent(share)}</strong>
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.sourceTitle}</p>
              <h2>{nf.format(sourceDomains.size)} {ui.sourceDomains}</h2>
            </div>
            <p className="section-summary">{ui.sourceSummary}</p>
          </div>

          <div className="source-desk-grid">
            {domainRows.map(([domain, count]) => (
              <article className="source-desk-card" key={domain}>
                <div className="source-desk-card-head">
                  <span>{ui.sourceDomains}</span>
                  <span>{nf.format(count)}</span>
                </div>
                <h3>{domain}</h3>
                <p className="ranking-source-accent">{percent(count / sourceRecords.length)} {ui.totalShare}</p>
              </article>
            ))}
          </div>

          <div className="data-source-labels">
            {sourceLabelRows.map(([label, count]) => (
              <article className="ranking-source-card" key={label}>
                <div className="ranking-source-card-head">
                  <span className="ranking-source-date">{nf.format(count)}</span>
                  <span className="ranking-source-date">{sourceRecords.find((record) => record.label === label)?.domain || ui.noUrl}</span>
                </div>
                <p className="ranking-source-title">{label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.metricTitle}</p>
              <h2>{nf.format(scoredMetricCount)} {ui.scored} + {nf.format(diagnosticMetricCount)} {ui.diagnostic}</h2>
            </div>
            <p className="section-summary">{ui.metricSummary}</p>
          </div>

          <div className="data-metric-pillar-grid">
            {pillarOrder.map((pillar) => (
              <article className="paper-card data-metric-pillar" key={pillar}>
                <div className="ranking-accent-head">
                  <h3>{pillarLabels[locale][pillar]}</h3>
                  <span className="ranking-accent-chip" />
                </div>
                <p className="ranking-source-accent">{nf.format(metricCountForPillar(pillar))} metrics</p>
                <div className="data-metric-list">
                  {(publication.pillarMetrics?.[pillar] ?? []).map((metric) => (
                    <div className="data-metric-row" key={metric.key}>
                      <span>{metricLabel(metric.key)}</span>
                      <strong>{ui.weight} {metric.weight}</strong>
                    </div>
                  ))}
                  {(publication.diagnosticMetrics?.[pillar] ?? []).map((metric) => (
                    <div className="data-metric-row data-metric-row--diagnostic" key={metric.key}>
                      <span>{metricLabel(metric.key)}</span>
                      <strong>{ui.diagnostic}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{ui.coverageTitle}</p>
              <h2>{manifest?.scorerVersion ?? "SLIC"}</h2>
            </div>
            <p className="section-summary">{ui.coverageSummary}</p>
          </div>

          <div className="ranking-fine-print-layout">
            <div className="ranking-fine-print-copy">
              {Object.entries(coverage).map(([grade, count]) => (
                <div className="fine-print-row" key={grade}>
                  <strong>{ui.coverageGrade} {grade}</strong>
                  <span>{nf.format(count)} {ui.cities}</span>
                </div>
              ))}
            </div>
            <article className="ranking-credit-card">
              <p className="panel-label">{ui.reproducibilityLabel}</p>
              {auditRows.map((row) => (
                <div className="data-audit-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </article>
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
