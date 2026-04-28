import BrandLockup from "./BrandLockup";
import { collaborationLogos } from "./brandAssets";
import { appHref } from "./routing";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const footerEndnoteCopy: Record<
  Locale,
  {
    eyebrow: string;
    reuseLabel: string;
    reuseBody: string;
    creditLabel: string;
    creditBody: string;
    aiLabel: string;
    aiBody: string;
    liveLabel: string;
    liveBody: string;
    fundingLabel: string;
    fundingBody: string;
  }
> = {
  en: {
    eyebrow: "Publication protocol",
    reuseLabel: "Reuse and credit",
    reuseBody:
      "SLIC is intended for public citation, teaching, replication, and critique. Keep the source visible, preserve the declared methodology, and do not imply paid placement or endorsement.",
    creditLabel: "Suggested credit",
    creditBody:
      "Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [date], plus the deployment URL used.",
    aiLabel: "Algorithmic and AI disclosure",
    aiBody:
      "The published board is issued from the verified SLIC workbook export. Each city is shown with one public score, five pillar values, and metric-level provenance where available.",
    liveLabel: "Continuous model",
    liveBody:
      "Published pages reflect the current verified workbook export. When new verified data is adopted, the workbook export and the public board are updated together. City photography on the Ideas page is sourced from Unsplash under the Unsplash License; individual photographer credits appear on each photo.",
    fundingLabel: "Funding and editorial independence",
    fundingBody:
      "Computing infrastructure and platform costs were supported in kind by DEPA (Digital Economy Promotion Agency) and PMU-A (Ministry of Higher Education, Research, Science and Innovation), Thailand. No private-sector funding. No sponsor has any influence over city scores, tier placement, or methodology. All rankings are produced solely by the declared model. This is a two-person research effort: Dr Non Arkara (lead author, smart city practitioner) and Assoc. Prof. Poon Thiengburanathum (research advisor). The index has no commercial relationship with any city, government, or private entity beyond the infrastructure support noted above.",
  },
  th: {
    eyebrow: "ข้อกำหนดการเผยแพร่",
    reuseLabel: "การนำไปใช้และการให้เครดิต",
    reuseBody:
      "SLIC ตั้งใจให้ถูกอ้างถึง ใช้ในการเรียน ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ เพียงต้องคงแหล่งที่มาและระเบียบวิธีไว้ชัดเจน และห้ามสื่อว่ามีการซื้ออันดับหรือได้รับการรับรองเป็นพิเศษ",
    creditLabel: "รูปแบบเครดิตที่แนะนำ",
    creditBody:
      "Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [วันที่], พร้อม URL ของหน้าที่ใช้งานจริง",
    aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
    aiBody:
      "บอร์ดที่เผยแพร่ถูกออกจากเวิร์กบุ๊ก SLIC ที่ผ่านการตรวจสอบแล้ว แต่ละเมืองจะแสดงด้วยคะแนนสาธารณะหนึ่งค่า ค่าเสาหลักทั้งห้า และข้อมูลแหล่งที่มาระดับเมตริกเมื่อมีพร้อม",
    liveLabel: "โมเดลต่อเนื่อง",
    liveBody:
      "หน้าที่เผยแพร่สะท้อนเวิร์กบุ๊กที่ผ่านการตรวจสอบล่าสุด เมื่อมีการรับข้อมูลใหม่ที่ผ่านการตรวจสอบ เวิร์กบุ๊กและบอร์ดสาธารณะจะอัปเดตร่วมกัน ภาพถ่ายเมืองในหน้า Steal This Idea ใช้จาก Unsplash ภายใต้สัญญาอนุญาต Unsplash โดยมีเครดิตช่างภาพแสดงบนแต่ละภาพ",
    fundingLabel: "การสนับสนุนทุนและความเป็นอิสระด้านบรรณาธิการ",
    fundingBody:
      "ค่าใช้จ่ายด้านโครงสร้างพื้นฐานการคอมพิวเตอร์และแพลตฟอร์มได้รับการสนับสนุนเป็นสิ่งของโดย DEPA (สำนักงานส่งเสริมเศรษฐกิจดิจิทัล) และ PMU-A (กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม) ประเทศไทย ไม่มีผู้สนับสนุนจากภาคเอกชน ไม่มีผู้สนับสนุนรายใดมีอิทธิพลต่อคะแนนเมือง การจัดลำดับชั้น หรือระเบียบวิธีใดๆ อันดับทั้งหมดผลิตขึ้นจากแบบจำลองที่ประกาศไว้เท่านั้น นี่คืองานวิจัยของสองคน: ดร.นนท์ อรกร (ผู้เขียนหลัก ผู้เชี่ยวชาญด้านเมืองอัจฉริยะ) และ รศ.ภูวงษ์ เทียงบุรานัม (ที่ปรึกษาการวิจัย) ดัชนีนี้ไม่มีความสัมพันธ์เชิงพาณิชย์กับเมือง รัฐบาล หรือหน่วยงานเอกชนใด นอกเหนือจากการสนับสนุนโครงสร้างพื้นฐานที่ระบุไว้ข้างต้น",
  },
  zh: {
    eyebrow: "发布协议",
    reuseLabel: "复用与署名",
    reuseBody:
      "SLIC 本来就允许公开引用、教学使用、复现与批评。只要保留来源、说明方法，并且不要暗示任何付费上榜或额外背书。",
    creditLabel: "建议署名",
    creditBody:
      "Non Arkara 与 Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [访问日期]，并附上所使用页面的部署 URL。",
    aiLabel: "算法与 AI 披露",
    aiBody:
      "已发布榜单来自经过核验的 SLIC 工作簿导出。每座城市都显示一个公开分数、五个支柱数值，以及可用时的指标级来源信息。",
    liveLabel: "持续模型",
    liveBody:
      "已发布页面反映当前经过核验的工作簿导出。一旦采用新的已核验数据，工作簿导出与公开榜单会同步更新。创意页面的城市摄影来自 Unsplash，遵循 Unsplash 许可协议，每张照片均标注摄影师署名。",
    fundingLabel: "资助与编辑独立性",
    fundingBody:
      "计算基础设施与平台费用由泰国 DEPA（数字经济促进局）及 PMU-A（高等教育、科学、研究与创新部）以实物形式提供支持。无私营部门资助。任何赞助商均不对城市评分、等级分配或方法论产生任何影响。所有排名完全由已声明的模型生成。本指数为两人研究成果：Dr Non Arkara（主笔，智慧城市从业者）与副教授 Poon Thiengburanathum（研究顾问）。除上述基础设施支持外，本指数与任何城市、政府或私营实体均无商业关系。",
  },
};

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  onNavigate(path);
}

export default function SiteFooter({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const copy = getCopy(locale);
  const endnotes = footerEndnoteCopy[locale];
  const footerHighlights = [
    copy.footer.disclosure,
    copy.footer.privacy,
    copy.footer.coverage,
  ];
  const protocolCards = [
    {
      label: endnotes.reuseLabel,
      body: `${endnotes.reuseBody} ${endnotes.creditBody}`,
    },
    {
      label: endnotes.aiLabel,
      body: `${endnotes.aiBody} ${endnotes.liveBody}`,
    },
    {
      label: endnotes.fundingLabel,
      body: endnotes.fundingBody,
    },
  ];
  const footerNote =
    locale === "th"
      ? "ระเบียบวิธี น้ำหนัก และแหล่งอ้างอิงยังคงเปิดเผยต่อสาธารณะ"
      : locale === "zh"
        ? "方法、权重与来源链条仍保持公开。"
        : "Methodology, weights, and provenance remain public.";

  const archiveLabels =
    locale === "th"
      ? { v1: "คลัง V1", v2: "คลัง V2" }
      : locale === "zh"
        ? { v1: "V1 归档", v2: "V2 归档" }
        : { v1: "V1 Archive", v2: "V2 Archive" };

  const navAriaLabel =
    locale === "th" ? "เมนูหลัก" : locale === "zh" ? "网站导航" : "Site navigation";

  const vintageNote =
    locale === "th"
      ? "ข้อมูล: วินเทจปี 2024–2025 · เผยแพร่ครั้งล่าสุด: เมษายน 2026"
      : locale === "zh"
        ? "数据：2024–2025 年版本 · 最后发布：2026 年 4 月"
        : "Data: 2024–2025 vintage · Last published: April 2026";

  return (
    <footer className="site-footer section">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <BrandLockup eyebrow={copy.footer.eyebrow} microCopy={copy.footer.title} />
          <p className="site-footer-summary">{copy.footer.summary}</p>
        </div>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.transparencyLabel}</p>
          <ul className="site-footer-brief-list">
            {footerHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="site-footer-card">
          <p className="panel-label">{copy.footer.collaborationLabel}</p>
          <p>{copy.footer.collaboration}</p>
          <div className="partner-logo-strip" aria-label={copy.footer.collaborationLabel}>
            {collaborationLogos.map((logo) => (
              <div className="partner-logo-card" key={logo.name}>
                <img
                  src={`${BASE}${logo.src}`}
                  alt={logo.alt}
                  loading="lazy"
                  width={logo.width}
                  height={logo.height}
                />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="site-footer-endnotes">
        <div className="section-heading compact-heading">
          <p className="eyebrow">{endnotes.eyebrow}</p>
        </div>
        <div className="site-footer-endnote-grid">
          {protocolCards.map((card) => (
            <article className="site-footer-endnote" key={card.label}>
              <p className="panel-label">{card.label}</p>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom">
        <nav className="topnav" aria-label={navAriaLabel}>
          <a href={appHref("/")} onClick={(event) => navigateLink(event, onNavigate, "/")}>
            {copy.nav.home}
          </a>
          <a href={appHref("/about-slic")} onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}>
            {copy.nav.aboutSlic}
          </a>
          <a href={appHref("/rankings")} onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>
            {copy.nav.rankings}
          </a>
          <a href={appHref("/methodology")} onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>
            {copy.nav.methodology}
          </a>
          <a href={appHref("/data")} onClick={(event) => navigateLink(event, onNavigate, "/data")}>
            {locale === "th" ? "ข้อมูล" : locale === "zh" ? "数据" : "Data"}
          </a>
          <a href={appHref("/thailand")} onClick={(event) => navigateLink(event, onNavigate, "/thailand")}>
            {copy.nav.thailand}
          </a>
          <a href={appHref("/ideas")} onClick={(event) => navigateLink(event, onNavigate, "/ideas")}>
            {copy.nav.ideas}
          </a>
          <a href={appHref("/history")} onClick={(event) => navigateLink(event, onNavigate, "/history")}>
            {copy.nav.history}
          </a>
          <a href="https://nonarkara.github.io/SLIC-Index-V1/" target="_blank" rel="noopener noreferrer">
            {archiveLabels.v1}
          </a>
          <a href="https://nonarkara.github.io/SLIC-Index-V2/" target="_blank" rel="noopener noreferrer">
            {archiveLabels.v2}
          </a>
        </nav>
        <p className="site-footer-note">{footerNote}</p>
        <p className="site-footer-vintage">{vintageNote}</p>
      </div>
    </footer>
  );
}
