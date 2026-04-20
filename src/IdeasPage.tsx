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

const ideasUiCopy: Record<
  Locale,
  {
    title: string;
    intro: string;
    category: string;
    difficulty: string;
    all: string;
    starter: string;
    intermediate: string;
    advanced: string;
    countSuffix: string;
    sectionHeading: string;
    sectionSummary: string;
    problem: string;
    solution: string;
    impact: string;
    showCode: string;
    hideCode: string;
    starterCode: string;
    copyCode: string;
    copied: string;
    categoryAria: string;
    difficultyAria: string;
    stackLabel: string;
    tagsLabel: string;
  }
> = {
  en: {
    title: "Steal This Idea",
    intro:
      "Real city innovations with working code you can copy, adapt, and deploy. Each idea comes from a real programme in a real city. The code snippets are starter templates you can drop into a no-code platform or build on directly.",
    category: "Category",
    difficulty: "Difficulty",
    all: "All",
    starter: "Starter",
    intermediate: "Intermediate",
    advanced: "Advanced",
    countSuffix: "ideas",
    sectionHeading: "Copy, adapt, deploy",
    sectionSummary:
      "Click any card to reveal the working code snippet. Copy it directly or use it as a starting point.",
    problem: "Problem",
    solution: "Solution",
    impact: "Impact",
    showCode: "Show code",
    hideCode: "Hide code",
    starterCode: "Starter code",
    copyCode: "Copy code",
    copied: "Copied!",
    categoryAria: "Idea category filter",
    difficultyAria: "Idea difficulty filter",
    stackLabel: "Stack",
    tagsLabel: "Tags",
  },
  th: {
    title: "ขโมยไอเดียนี้ไปใช้",
    intro:
      "นวัตกรรมเมืองจริงพร้อมโค้ดที่ใช้ได้จริง คัดลอก ปรับแก้ และนำไปใช้งานได้ทันที ทุกไอเดียมาจากโครงการจริงในเมืองจริง โค้ดที่ให้เป็นเทมเพลตเริ่มต้นที่นำไปใส่ในแพลตฟอร์ม no-code หรือพัฒนาต่อยอดได้โดยตรง",
    category: "หมวดหมู่",
    difficulty: "ระดับความยาก",
    all: "ทั้งหมด",
    starter: "เริ่มต้น",
    intermediate: "ปานกลาง",
    advanced: "ขั้นสูง",
    countSuffix: "ไอเดีย",
    sectionHeading: "คัดลอก ปรับแก้ นำไปใช้",
    sectionSummary:
      "คลิกที่การ์ดใดก็ได้เพื่อดูโค้ดที่ใช้งานได้จริง คัดลอกไปใช้ทันทีหรือใช้เป็นจุดเริ่มต้น",
    problem: "ปัญหา",
    solution: "ทางออก",
    impact: "ผลลัพธ์",
    showCode: "แสดงโค้ด",
    hideCode: "ซ่อนโค้ด",
    starterCode: "โค้ดเริ่มต้น",
    copyCode: "คัดลอกโค้ด",
    copied: "คัดลอกแล้ว!",
    categoryAria: "ตัวกรองหมวดหมู่ไอเดีย",
    difficultyAria: "ตัวกรองระดับความยาก",
    stackLabel: "ชุดเทคโนโลยี",
    tagsLabel: "แท็ก",
  },
  zh: {
    title: "拿去用吧",
    intro:
      "真实城市的创新案例，附带可复制、修改、部署的代码。每个想法都来自真实城市的真实项目。代码片段是起始模板，可直接放入 no-code 平台或在此基础上继续开发。",
    category: "类别",
    difficulty: "难度",
    all: "全部",
    starter: "入门",
    intermediate: "中级",
    advanced: "高级",
    countSuffix: "个想法",
    sectionHeading: "复制、修改、部署",
    sectionSummary: "点击任意卡片查看可用代码片段。直接复制或作为起点进行开发。",
    problem: "问题",
    solution: "方案",
    impact: "影响",
    showCode: "显示代码",
    hideCode: "隐藏代码",
    starterCode: "起始代码",
    copyCode: "复制代码",
    copied: "已复制！",
    categoryAria: "想法类别筛选",
    difficultyAria: "想法难度筛选",
    stackLabel: "技术栈",
    tagsLabel: "标签",
  },
};

const difficultyLabels: Record<Locale, Record<CityIdea["difficulty"], string>> = {
  en: { starter: "Starter", intermediate: "Intermediate", advanced: "Advanced" },
  th: { starter: "เริ่มต้น", intermediate: "ปานกลาง", advanced: "ขั้นสูง" },
  zh: { starter: "入门", intermediate: "中级", advanced: "高级" },
};

function CopyButton({ text, locale }: { text: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const ui = ideasUiCopy[locale];

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
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const ui = ideasUiCopy[locale];

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
            <h1 className="rankings-title">{ui.title}</h1>
            <p className="hero-intro">{ui.intro}</p>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <p className="panel-label">{ui.category}</p>
              <div className="region-switch" role="group" aria-label={ui.categoryAria}>
                <button type="button" className={category === "all" ? "region-button active" : "region-button"} onClick={() => setCategory("all")}>{ui.all}</button>
                {ideaCategories.map((cat) => (
                  <button key={cat.value} type="button" className={category === cat.value ? "region-button active" : "region-button"} onClick={() => setCategory(cat.value)}>{cat.labels[locale]}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.difficulty}</p>
              <div className="mode-switch" role="group" aria-label={ui.difficultyAria}>
                <button type="button" className={difficulty === "all" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("all")}>{ui.all}</button>
                <button type="button" className={difficulty === "starter" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("starter")}>{ui.starter}</button>
                <button type="button" className={difficulty === "intermediate" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("intermediate")}>{ui.intermediate}</button>
                <button type="button" className={difficulty === "advanced" ? "mode-button active" : "mode-button"} onClick={() => setDifficulty("advanced")}>{ui.advanced}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{filtered.length} {ui.countSuffix}</p>
              <h2>{ui.sectionHeading}</h2>
            </div>
            <p className="section-summary">{ui.sectionSummary}</p>
          </div>

          <div className="idea-grid">
            {filtered.map((idea) => (
              <article className="idea-card" key={idea.id}>
                <div className="idea-card-head">
                  <div>
                    <div className="idea-card-meta">
                      <span className="idea-difficulty" style={{ color: difficultyColors[idea.difficulty] }}>{difficultyLabels[locale][idea.difficulty]}</span>
                      <span className="idea-category">{ideaCategories.find((c) => c.value === idea.category)?.labels[locale]}</span>
                    </div>
                    <h3>{idea.title}</h3>
                    <p className="city-location">{idea.city}, {idea.country}</p>
                  </div>
                </div>

                <p className="idea-problem"><strong>{ui.problem}:</strong> {idea.problem}</p>
                <p className="idea-solution"><strong>{ui.solution}:</strong> {idea.solution}</p>
                <p className="idea-impact"><strong>{ui.impact}:</strong> {idea.impact}</p>

                <div className="metric-taglist-group">
                  <span className="metric-taglist-label">{ui.stackLabel}</span>
                  <div className="metric-taglist">
                    {idea.techStack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={expanded === idea.id ? "idea-toggle active" : "idea-toggle"}
                  onClick={() => setExpanded(expanded === idea.id ? null : idea.id)}
                  aria-expanded={expanded === idea.id}
                >
                  {expanded === idea.id ? ui.hideCode : ui.showCode}
                </button>

                {expanded === idea.id && (
                  <div className="idea-code-block">
                    <div className="idea-code-header">
                      <span>{ui.starterCode}</span>
                      <CopyButton text={idea.codeSnippet} locale={locale} />
                    </div>
                    <pre className="idea-code"><code>{idea.codeSnippet}</code></pre>
                    <p className="idea-repo-hint">{idea.repoHint[locale]}</p>
                  </div>
                )}

                <div className="metric-taglist-group">
                  <span className="metric-taglist-label">{ui.tagsLabel}</span>
                  <div className="metric-taglist metric-taglist--secondary">
                    {idea.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
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
