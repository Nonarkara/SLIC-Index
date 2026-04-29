import { useMemo, useState } from "react";
import { cityIdeas, ideaCategories } from "./ideasData";
import type { CityIdea } from "./ideasData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const difficultyColors: Record<CityIdea["difficulty"], string> = {
  starter: "var(--accent-green)",
  intermediate: "var(--accent-amber)",
  advanced: "var(--accent-red)",
};

const ideasUiCopy: Record<
  Locale,
  {
    title: string;
    eyebrow: string;
    intro: string;
    statTools: string;
    statCountries: string;
    statPeople: string;
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
    eyebrow: "Open-source civic tech",
    intro:
      "Forty years of urban innovation, one afternoon to ship. Every tool here is open source, globally deployed, and proven in a real city. Clone the repo. Change the city name. Go.",
    statTools: "12 open-source tools",
    statCountries: "40+ countries deployed",
    statPeople: "1 billion+ people served",
    category: "Category",
    difficulty: "Difficulty",
    all: "All",
    starter: "Starter",
    intermediate: "Intermediate",
    advanced: "Advanced",
    countSuffix: "ideas",
    sectionHeading: "12 tools. Real cities. Free to clone.",
    sectionSummary:
      "Click any card to see the working code. Every snippet connects to a live GitHub repo.",
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
    eyebrow: "เทคโนโลยีเมืองแบบโอเพนซอร์ส",
    intro:
      "นวัตกรรมเมือง 40 ปี บ่ายเดียวก็ deploy ได้ ทุกเครื่องมือที่นี่เป็นโอเพนซอร์ส ใช้งานจริงทั่วโลก และพิสูจน์แล้วในเมืองจริง โคลน repo เปลี่ยนชื่อเมือง แค่นั้น",
    statTools: "12 เครื่องมือโอเพนซอร์ส",
    statCountries: "deploy แล้วใน 40+ ประเทศ",
    statPeople: "คนกว่า 1 พันล้านได้ใช้",
    category: "หมวดหมู่",
    difficulty: "ระดับความยาก",
    all: "ทั้งหมด",
    starter: "เริ่มต้น",
    intermediate: "ปานกลาง",
    advanced: "ขั้นสูง",
    countSuffix: "ไอเดีย",
    sectionHeading: "12 เครื่องมือ เมืองจริง โคลนได้ฟรี",
    sectionSummary:
      "คลิกที่การ์ดใดก็ได้เพื่อดูโค้ดที่ใช้งานได้จริง ทุก snippet เชื่อมต่อกับ GitHub repo สด",
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
    eyebrow: "开源城市科技",
    intro:
      "四十年的城市创新，一个下午就能上线。这里的每个工具都是开源的，已在真实城市全球部署并验证。克隆仓库，改个城市名，出发。",
    statTools: "12 个开源工具",
    statCountries: "部署至 40+ 个国家",
    statPeople: "服务超 10 亿人",
    category: "类别",
    difficulty: "难度",
    all: "全部",
    starter: "入门",
    intermediate: "中级",
    advanced: "高级",
    countSuffix: "个想法",
    sectionHeading: "12 个工具。真实城市。免费克隆。",
    sectionSummary: "点击任意卡片查看可用代码片段。每个片段都连接到一个实时 GitHub 仓库。",
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
            <p className="eyebrow">{ui.eyebrow}</p>
            <h1 className="rankings-title">{ui.title}</h1>
            <p className="hero-intro">{ui.intro}</p>
            <div className="ideas-hero-stats">
              <span>{ui.statTools}</span>
              <span>{ui.statCountries}</span>
              <span>{ui.statPeople}</span>
            </div>
          </div>

          <div className="rankings-controls">
            <div className="rankings-filter-group">
              <p className="panel-label">{ui.category}</p>
              <div className="region-switch" role="group" aria-label={ui.categoryAria}>
                <button
                  type="button"
                  className={category === "all" ? "region-button active" : "region-button"}
                  onClick={() => setCategory("all")}
                >
                  {ui.all}
                </button>
                {ideaCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={category === cat.value ? "region-button active" : "region-button"}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.labels[locale]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label">{ui.difficulty}</p>
              <div className="mode-switch" role="group" aria-label={ui.difficultyAria}>
                <button
                  type="button"
                  className={difficulty === "all" ? "mode-button active" : "mode-button"}
                  onClick={() => setDifficulty("all")}
                >
                  {ui.all}
                </button>
                <button
                  type="button"
                  className={difficulty === "starter" ? "mode-button active" : "mode-button"}
                  onClick={() => setDifficulty("starter")}
                >
                  {ui.starter}
                </button>
                <button
                  type="button"
                  className={difficulty === "intermediate" ? "mode-button active" : "mode-button"}
                  onClick={() => setDifficulty("intermediate")}
                >
                  {ui.intermediate}
                </button>
                <button
                  type="button"
                  className={difficulty === "advanced" ? "mode-button active" : "mode-button"}
                  onClick={() => setDifficulty("advanced")}
                >
                  {ui.advanced}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="rankings-top section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {filtered.length} {ui.countSuffix}
              </p>
              <h2>{ui.sectionHeading}</h2>
            </div>
            <p className="section-summary">{ui.sectionSummary}</p>
          </div>

          <div className="idea-grid">
            {filtered.map((idea) => (
              <article className="idea-card" key={idea.id}>
                {idea.image && (
                  <div className="idea-card-photo">
                    <img
                      src={`${BASE}/${idea.image}`}
                      alt={`${idea.city} — ${idea.title}`}
                      loading="lazy"
                    />
                    {idea.imageCredit && (
                      <span className="idea-card-photo-credit">{idea.imageCredit}</span>
                    )}
                  </div>
                )}

                <div className="idea-card-head">
                  <div>
                    <div className="idea-card-meta">
                      <span
                        className="idea-difficulty"
                        style={{ color: difficultyColors[idea.difficulty] }}
                      >
                        {difficultyLabels[locale][idea.difficulty]}
                      </span>
                      <span className="idea-category">
                        {ideaCategories.find((c) => c.value === idea.category)?.labels[locale]}
                      </span>
                    </div>
                    <h3>{idea.title}</h3>
                    <p className="city-location">
                      {idea.city}, {idea.country}
                    </p>
                  </div>
                </div>

                <p className="idea-problem">
                  <strong>{ui.problem}:</strong> {idea.problem}
                </p>
                <p className="idea-solution">
                  <strong>{ui.solution}:</strong> {idea.solution}
                </p>
                <p className="idea-impact">
                  <strong>{ui.impact}:</strong> {idea.impact}
                </p>

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
                    <pre className="idea-code">
                      <code>{idea.codeSnippet}</code>
                    </pre>
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
