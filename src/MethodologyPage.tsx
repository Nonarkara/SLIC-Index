import { useState } from "react";
import { getMethodologyData } from "./methodologyData";
import KnowledgeRackPanel from "./KnowledgeRackPanel";
import MethodologySpiderChart from "./MethodologySpiderChart";
import PillarWeightChart from "./PillarWeightChart";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";
import type {
  Locale,
  MethodologyEquationGroup,
  MethodologyReference,
  MethodologySectionCopy,
  MethodologyWorkedExample,
  SitePath,
} from "./types";

const methodUiCopy: Record<
  Locale,
  {
    openEquation: string;
    openPdf: string;
    downloadPdf: string;
    closePdf: string;
    pdfWindowTitle: string;
    pdfWindowNote: string;
    home: string;
    guide: string;
    critique: string;
    remote: string;
    scoring: string;
    glossary: string;
    example: string;
    models: string;
    references: string;
    rack: string;
    glossarySymbol: string;
    glossaryDefinition: string;
    glossaryExplanation: string;
    worksheetColumn: string;
    worksheetPurpose: string;
    worksheetSource: string;
    sourceTierLabel: string;
    protocolLabel: string;
    roleLabel: string;
    finalScore: string;
    illustrative: string;
    citations: string;
    contextLabel: string;
    dataMixTitle: string;
    dataMixSummary: string;
  }
> = {
  en: {
    openEquation: "See the score equation",
    openPdf: "Read the technical PDF",
    downloadPdf: "Download PDF",
    closePdf: "Close paper",
    pdfWindowTitle: "SLIC technical methodology paper",
    pdfWindowNote: "Embedded reader for the downloadable English master edition.",
    home: "Home",
    guide: "Guide",
    critique: "Critique",
    remote: "Satellite layer",
    scoring: "Scoring",
    glossary: "Glossary",
    example: "Example",
    models: "Boundaries",
    references: "References",
    rack: "Knowledge rack",
    glossarySymbol: "Symbol",
    glossaryDefinition: "Definition",
    glossaryExplanation: "Explanation",
    worksheetColumn: "Column",
    worksheetPurpose: "Purpose",
    worksheetSource: "Primary source",
    sourceTierLabel: "Tier",
    protocolLabel: "Protocol",
    roleLabel: "Role",
    finalScore: "Final SLIC score",
    illustrative: "Illustrative preview computation",
    citations: "Citations",
    contextLabel: "Context term",
    dataMixTitle: "Data reliance mix",
    dataMixSummary:
      "The public model leans hardest on official urban and official macro data, while satellite and testimony layers remain disciplined supporting evidence.",
  },
  th: {
    openEquation: "ดูสมการคะแนน",
    openPdf: "อ่าน Technical PDF",
    downloadPdf: "ดาวน์โหลด PDF",
    closePdf: "ปิดเอกสาร",
    pdfWindowTitle: "เอกสารเทคนิคของ SLIC",
    pdfWindowNote: "หน้าต่างอ่านเอกสารแบบฝัง พร้อมไฟล์ English master edition ที่ดาวน์โหลดได้",
    home: "หน้าแรก",
    guide: "คู่มือ",
    critique: "ข้อวิจารณ์",
    remote: "ชั้นข้อมูลดาวเทียม",
    scoring: "สมการ",
    glossary: "สัญลักษณ์",
    example: "ตัวอย่าง",
    models: "ขอบเขตวิธี",
    references: "อ้างอิง",
    rack: "คลังความรู้",
    glossarySymbol: "สัญลักษณ์",
    glossaryDefinition: "ความหมาย",
    glossaryExplanation: "คำอธิบาย",
    worksheetColumn: "คอลัมน์",
    worksheetPurpose: "หน้าที่",
    worksheetSource: "แหล่งข้อมูลหลัก",
    sourceTierLabel: "ชั้นข้อมูล",
    protocolLabel: "โปรโตคอล",
    roleLabel: "บทบาท",
    finalScore: "คะแนน SLIC สุดท้าย",
    illustrative: "ตัวอย่างคำนวณเชิงอธิบาย",
    citations: "อ้างอิง",
    contextLabel: "ตัวแปรบริบท",
    dataMixTitle: "สัดส่วนการพึ่งพาข้อมูล",
    dataMixSummary:
      "โมเดลสาธารณะพึ่งข้อมูลทางการระดับเมืองและมหภาคเป็นหลัก ส่วนข้อมูลดาวเทียมและ testimony ทำหน้าที่เป็น supporting evidence ที่ถูกควบคุม",
  },
  zh: {
    openEquation: "查看评分公式",
    openPdf: "阅读技术 PDF",
    downloadPdf: "下载 PDF",
    closePdf: "关闭文档",
    pdfWindowTitle: "SLIC 技术方法论文",
    pdfWindowNote: "内嵌阅读窗口，提供可下载的英文主版本 PDF。",
    home: "首页",
    guide: "指南",
    critique: "批评",
    remote: "卫星层",
    scoring: "公式",
    glossary: "符号",
    example: "示例",
    models: "方法边界",
    references: "参考",
    rack: "知识架",
    glossarySymbol: "符号",
    glossaryDefinition: "定义",
    glossaryExplanation: "说明",
    worksheetColumn: "列",
    worksheetPurpose: "用途",
    worksheetSource: "主要来源",
    sourceTierLabel: "层级",
    protocolLabel: "规则",
    roleLabel: "角色",
    finalScore: "最终 SLIC 分数",
    illustrative: "说明性预览计算",
    citations: "引用",
    contextLabel: "背景项",
    dataMixTitle: "数据依赖结构",
    dataMixSummary:
      "公开模型最依赖城市与宏观官方数据，卫星层与证词层则作为受控的辅助证据使用。",
  },
};

const relianceMix: Record<
  Locale,
  Array<{
    label: string;
    value: number;
  }>
> = {
  en: [
    { label: "City official", value: 94 },
    { label: "Macro official", value: 82 },
    { label: "Satellite", value: 58 },
    { label: "Open proxy", value: 52 },
    { label: "Listening", value: 41 },
  ],
  th: [
    { label: "ข้อมูลเมือง", value: 94 },
    { label: "ข้อมูลมหภาค", value: 82 },
    { label: "ข้อมูลดาวเทียม", value: 58 },
    { label: "proxy เปิด", value: 52 },
    { label: "social listening", value: 41 },
  ],
  zh: [
    { label: "城市官方", value: 94 },
    { label: "宏观官方", value: 82 },
    { label: "卫星层", value: 58 },
    { label: "开放代理", value: 52 },
    { label: "社交聆听", value: 41 },
  ],
};

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

function citationText(ids: number[]): string {
  return ids.map((id) => `[${id}]`).join(" ");
}

function metricShareText(metricWeight: number, totalWeight: number): string {
  if (totalWeight <= 0) {
    return "0%";
  }

  const share = (metricWeight / totalWeight) * 100;
  const rounded = share >= 10 ? Math.round(share) : Math.round(share * 10) / 10;
  return `${rounded}%`;
}

function sectionSummary(section: MethodologySectionCopy) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.title}</h2>
      </div>
      <p className="section-summary">{section.summary}</p>
    </div>
  );
}

export default function MethodologyPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const ui = methodUiCopy[locale];
  const methodology = getMethodologyData(locale);
  const [pdfOpen, setPdfOpen] = useState(false);
  const pdfPath = "/downloads/slic-methodology-technical-paper-en.pdf";
  const officialEquation = methodology.equationSection.groups[0]?.equations[0];
  const paperAnchors = [
    { href: "#reader-guide", label: ui.guide },
    { href: "#critique", label: ui.critique },
    { href: "#remote-sensing", label: ui.remote },
    { href: "#scoring-framework", label: ui.scoring },
    { href: "#glossary", label: ui.glossary },
    { href: "#worked-example", label: ui.example },
    { href: "#models", label: ui.models },
    { href: "#references", label: ui.references },
    { href: "#knowledge-rack", label: ui.rack },
  ];

  return (
    <>
      <header className="methodology-hero section">
        <div className="methodology-hero-grid">
          <div className="methodology-copy">
            <p className="eyebrow">{methodology.hero.eyebrow}</p>
            <h1>{methodology.hero.title}</h1>
            <p className="hero-strapline">{methodology.hero.strapline}</p>
            <p className="paper-lead">{methodology.hero.intro}</p>

            {officialEquation ? (
              <article className="paper-card equation-hero-card">
                <p className="panel-label">{officialEquation.title}</p>
                <pre className="formula-display">{officialEquation.formula}</pre>
                <p>{officialEquation.explanation}</p>
              </article>
            ) : null}

            <div className="hero-actions">
              <a className="primary-action" href="#scoring-framework">
                {ui.openEquation}
              </a>
              <button
                type="button"
                className="secondary-action"
                onClick={() => setPdfOpen(true)}
              >
                {ui.openPdf}
              </button>
              <a
                className="secondary-action"
                href="/"
                onClick={(event) => navigateLink(event, onNavigate, "/")}
              >
                {ui.home || copy.nav.home}
              </a>
            </div>

            <nav className="paper-anchor-nav" aria-label="Methodology sections">
              {paperAnchors.map((anchor) => (
                <a key={anchor.href} href={anchor.href}>
                  {anchor.label}
                </a>
              ))}
            </nav>
          </div>

          <aside className="methodology-side">
            <article className="paper-card paper-summary-card">
              <p className="panel-label">{methodology.hero.doctrineTitle}</p>
              <h2>{methodology.hero.doctrineBody}</h2>
            </article>

            <MethodologySpiderChart
              title={ui.dataMixTitle}
              subtitle={ui.dataMixSummary}
              data={relianceMix[locale]}
              locale={locale}
            />

            <article className="paper-card">
              <p className="panel-label">{methodology.hero.contextTitle}</p>
              <ul className="compact-list">
                {methodology.hero.contextItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="paper-card">
              <p className="panel-label">{methodology.hero.explicitTitle}</p>
              <ul className="compact-list">
                {methodology.hero.explicitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </aside>
        </div>
      </header>

      <main>
        <section className="paper-section section" id="reader-guide">
          {sectionSummary(methodology.readerGuide)}

          <div className="context-grid">
            <article className="paper-card">
              <p className="panel-label">{methodology.readerGuide.layTitle}</p>
              <ol className="compact-list ordered-list">
                {methodology.readerGuide.laySteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>

            <article className="paper-card">
              <p className="panel-label">{methodology.readerGuide.technicalTitle}</p>
              <ol className="compact-list ordered-list">
                {methodology.readerGuide.technicalSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="paper-section section" id="critique">
          {sectionSummary(methodology.critiqueSection)}

          <div className="critique-grid">
            {methodology.critiques.map((critique) => (
              <article className="paper-card critique-card" key={critique.title}>
                <p className="panel-label">{methodology.critiqueSection.eyebrow}</p>
                <h3>{critique.title}</h3>
                <p>{critique.body}</p>
                <p className="critique-implication">{critique.implication}</p>
                <p className="inline-citation">{citationText(critique.citations)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-visual-strip section">
          {sectionSummary(methodology.processSection)}

          <div className="methodology-figure-grid">
            {methodology.processSection.figures.map((figure) => (
              <figure className="photo-frame methodology-figure" key={figure.id}>
                <img src={figure.src} alt={figure.alt} loading="lazy" />
                <figcaption>{figure.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="paper-section section" id="remote-sensing">
          {sectionSummary(methodology.remoteSensingSection)}

          <div className="context-grid">
            <article className="paper-card">
              <p className="panel-label">{methodology.remoteSensingSection.quantifyTitle}</p>
              <ul className="compact-list">
                {methodology.remoteSensingSection.quantifyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="paper-card">
              <p className="panel-label">{methodology.remoteSensingSection.qualifyTitle}</p>
              <ul className="compact-list">
                {methodology.remoteSensingSection.qualifyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <article className="paper-card remote-sensing-workflow-card">
            <p className="panel-label">{methodology.remoteSensingSection.workflowTitle}</p>
            <div className="remote-sensing-workflow">
              {methodology.remoteSensingSection.workflowStages.map((stage, index) => (
                <article className="remote-sensing-stage" key={stage.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{stage.title}</h3>
                    <p>{stage.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="inline-citation">{citationText(methodology.remoteSensingSection.citations)}</p>
          </article>
        </section>

        <section className="paper-section section" id="scoring-framework">
          {sectionSummary(methodology.flowSection)}

          <div className="flow-exhibit">
            {methodology.flowSection.stages.map((stage, index) => (
              <article className="paper-card flow-card" key={stage.id}>
                <div className="flow-card-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{stage.title}</h3>
                </div>
                <pre className="formula-display formula-display-compact">{stage.formula}</pre>
                <p>{stage.body}</p>
              </article>
            ))}
          </div>

          <div className="equation-group-stack">
            {methodology.equationSection.groups.map((group) => (
              <EquationGroup key={group.id} group={group} />
            ))}
          </div>

          <article className="paper-card weight-card">
            <div className="weight-card-head">
              <div>
                <p className="panel-label">{methodology.pillarsSection.eyebrow}</p>
                <h3>{methodology.pillarsSection.title}</h3>
              </div>
              <p className="section-summary">{methodology.pillarsSection.summary}</p>
            </div>
            <PillarWeightChart
              pillars={methodology.pillars}
              shareLabel={methodology.weightChartLabel}
            />
          </article>
        </section>

        <section className="paper-section section" id="glossary">
          {sectionSummary(methodology.glossarySection)}

          <div className="sheet-table-shell">
            <table className="sheet-table glossary-table">
              <thead>
                <tr>
                  <th>{ui.glossarySymbol}</th>
                  <th>{ui.glossaryDefinition}</th>
                  <th>{ui.glossaryExplanation}</th>
                </tr>
              </thead>
              <tbody>
                {methodology.glossarySection.symbols.map((symbol) => (
                  <tr key={symbol.symbol}>
                    <td>
                      <strong>{symbol.symbol}</strong>
                    </td>
                    <td>{symbol.definition}</td>
                    <td>{symbol.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="paper-section section" id="worked-example">
          {sectionSummary(methodology.workedExampleSection)}
          <WorkedExample example={methodology.workedExampleSection.example} ui={ui} />
        </section>

        <section className="paper-section section" id="models">
          {sectionSummary(methodology.modelSection)}

          <div className="equation-grid">
            {methodology.modelSection.families.map((model) => (
              <article className="paper-card equation-card" key={model.id}>
                <div className="method-family-head">
                  <p className="panel-label">{model.title}</p>
                  <span className="weight-pill">{model.role}</span>
                </div>
                <pre className="formula-display">{model.formula}</pre>
                <p>{model.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          {sectionSummary(methodology.countryContextSection)}

          <div className="context-grid">
            <article className="paper-card">
              <p className="panel-label">{methodology.hero.contextTitle}</p>
              <ul className="compact-list">
                {methodology.hero.contextItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="paper-card">
              <p className="panel-label">{ui.contextLabel}</p>
              <pre className="formula-display formula-display-compact">
                MacroContext(c) = capped(GDP_PPP + GDP_Growth + Gini + Tax + PPP)
              </pre>
              <p>{methodology.countryContextSection.summary}</p>
            </article>
          </div>
        </section>

        <section className="paper-section section">
          {sectionSummary(methodology.pillarsSection)}

          <div className="pillar-detail-grid">
            {methodology.pillars.map((pillar) => {
              const totalMetricWeight = pillar.metrics.reduce((sum, metric) => sum + metric.weight, 0);

              return (
              <article className="paper-card pillar-detail-card" key={pillar.id}>
                <div className="pillar-header">
                  <div>
                    <p className="panel-label">{pillar.name}</p>
                    <h3>{pillar.weight}%</h3>
                  </div>
                  <span className="weight-pill">{pillar.weight}%</span>
                </div>
                <p className="pillar-thesis">{pillar.thesis}</p>
                <p className="pillar-justification">{pillar.justification}</p>

                <div className="metric-rows">
                  {pillar.metrics.map((metric) => (
                    <article className="metric-row" key={metric.name}>
                      <div className="metric-row-head">
                        <strong>{metric.name}</strong>
                        <span>{metricShareText(metric.weight, totalMetricWeight)}</span>
                      </div>
                      <p>{metric.description}</p>
                      <p className="metric-inputs">Inputs: {metric.inputs.join(", ")}</p>
                    </article>
                  ))}
                </div>

                <p className="inline-citation">{citationText(pillar.citations)}</p>
              </article>
            );
            })}
          </div>
        </section>

        <section className="paper-section section">
          {sectionSummary(methodology.protocolSection)}

          <div className="rule-grid">
            {methodology.rules.map((rule) => (
              <article className="paper-card" key={rule.title}>
                <p className="panel-label">{ui.protocolLabel}</p>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
                <p className="inline-citation">{citationText(rule.citations)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          {sectionSummary(methodology.sourceSection)}

          <div className="source-tier-grid">
            {methodology.sourceTiers.map((tier) => (
              <article className="paper-card" key={tier.tier}>
                <p className="panel-label">{ui.sourceTierLabel} {tier.tier}</p>
                <h3>{tier.title}</h3>
                <p>{tier.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          {sectionSummary(methodology.worksheetSection)}

          <div className="sheet-table-shell">
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>{ui.worksheetColumn}</th>
                  <th>{ui.worksheetPurpose}</th>
                  <th>{ui.worksheetSource}</th>
                </tr>
              </thead>
              <tbody>
                {methodology.worksheetColumns.map((column) => (
                  <tr key={column.field}>
                    <td>{column.field}</td>
                    <td>{column.purpose}</td>
                    <td>{column.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="paper-section section" id="references">
          {sectionSummary(methodology.referencesSection)}

          <div className="reference-list">
            {methodology.references.map((reference) => (
              <ReferenceCard key={reference.id} reference={reference} ui={ui} />
            ))}
          </div>
        </section>

        <KnowledgeRackPanel locale={locale} />
      </main>

      {pdfOpen ? (
        <div className="pdf-viewer-modal" role="dialog" aria-modal="true" aria-label={ui.pdfWindowTitle}>
          <div className="pdf-viewer-shell">
            <div className="pdf-viewer-head">
              <div>
                <p className="panel-label">{ui.pdfWindowTitle}</p>
                <p className="pdf-viewer-note">{ui.pdfWindowNote}</p>
              </div>
              <div className="pdf-viewer-actions">
                <a className="primary-action" href={pdfPath} download>
                  {ui.downloadPdf}
                </a>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setPdfOpen(false)}
                >
                  {ui.closePdf}
                </button>
              </div>
            </div>

            <div className="pdf-viewer-frame-shell">
              <iframe className="pdf-viewer-frame" src={pdfPath} title={ui.pdfWindowTitle} />
            </div>
          </div>
        </div>
      ) : null}

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}

function EquationGroup({ group }: { group: MethodologyEquationGroup }) {
  return (
    <section className="equation-group-block">
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">{group.eyebrow}</p>
          <h2>{group.title}</h2>
        </div>
        <p className="section-summary">{group.summary}</p>
      </div>

      <div className="equation-grid">
        {group.equations.map((equation) => (
          <article className="paper-card equation-card" key={equation.id}>
            <p className="panel-label">{equation.title}</p>
            <pre className="formula-display">{equation.formula}</pre>
            <p>{equation.explanation}</p>
            <p className="inline-citation">{citationText(equation.citations)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkedExample({
  example,
  ui,
}: {
  example: MethodologyWorkedExample;
  ui: (typeof methodUiCopy)[Locale];
}) {
  return (
    <div className="worked-example-grid">
      <article className="paper-card worked-example-summary">
        <p className="panel-label">{ui.illustrative}</p>
        <h3>{example.city}</h3>
        <p>{example.note}</p>
        <div className="example-input-list">
          {example.inputs.map((input) => (
            <article key={input.label}>
              <span>{input.label}</span>
              <strong>{input.value}</strong>
              <p>{input.note}</p>
            </article>
          ))}
        </div>
      </article>

      <div className="worked-example-steps">
        {example.steps.map((step) => (
          <article className="paper-card example-step" key={step.title}>
            <p className="panel-label">{step.title}</p>
            <pre className="formula-display">{step.formula}</pre>
            <strong className="example-result">{step.result}</strong>
            <p>{step.explanation}</p>
          </article>
        ))}

        <article className="paper-card example-final-card">
          <p className="panel-label">{ui.finalScore}</p>
          <strong className="example-final-score">{example.finalScore}</strong>
          <p>{example.conclusion}</p>
        </article>
      </div>
    </div>
  );
}

function ReferenceCard({
  reference,
  ui,
}: {
  reference: MethodologyReference;
  ui: (typeof methodUiCopy)[Locale];
}) {
  return (
    <article className="paper-card reference-card">
      <p className="panel-label">
        [{reference.id}] {reference.publisher}
      </p>
      <h3>{reference.label}</h3>
      <p>{reference.note}</p>
      {reference.url ? (
        <a className="inline-page-link" href={reference.url} target="_blank" rel="noreferrer">
          {ui.references}
        </a>
      ) : (
        <p className="reference-unlinked">Local project document.</p>
      )}
    </article>
  );
}
