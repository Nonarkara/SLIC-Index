import { appHref } from "./routing";
import SiteFooter from "./SiteFooter";
import { t } from "./i18n";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AwardLens {
  award: string;
  category: string;
  url?: string;
  criteria: string[];
  answer: string;
  artifact: string;
}

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

export default function AwardsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const eyebrow = t(
    locale,
    "Submission dossier",
    "เอกสารยื่นรางวัล",
    "投奖案卷",
  );

  const title = t(
    locale,
    "SLIC Index V3 — submission dossier",
    "SLIC Index V3 — เอกสารยื่นรางวัล",
    "SLIC Index V3 — 投奖案卷",
  );

  const intro = t(
    locale,
    "One page for the juror. Four awards. The same publication audited through four reading frames — editorial publication, design excellence, creative technology, and creative advocacy.",
    "หน้าเดียวสำหรับกรรมการ สี่รางวัล ผลงานเดียวกันถูกตรวจผ่านสี่กรอบ คือ บทบรรณาธิการ ความเป็นเลิศด้านการออกแบบ เทคโนโลยีสร้างสรรค์ และการรณรงค์ผ่านการออกแบบ",
    "评审一页读完。四个奖项。同一个作品在四种阅读视角下被审视：编辑出版、设计卓越、创造性技术、创造性倡导。",
  );

  const provocation = t(
    locale,
    "Every city ranking is a lie. Here's ours — public methodology, public data, no paid placement, three languages.",
    "ทุกดัชนีจัดอันดับเมืองคือเรื่องโกหก รวมถึงของผมเอง ระเบียบวิธีเปิด ข้อมูลเปิด ไม่มีการจ่ายเพื่อขึ้นอันดับ สามภาษา",
    "每一份城市排名都是谎言，包括我们这份。方法公开，数据公开，无付费上榜，三语并行。",
  );

  // Canonical numbers — read directly from methodologyFacts when this expands.
  // For now these are hard-coded to match the snapshot at publish time of this
  // Pass-3 awards work; the cross-doc drift checker will catch any divergence.
  const numbers: { value: string; label: string }[] = [
    {
      value: "163",
      label: t(locale, "Cities total", "เมืองทั้งหมด", "城市总数"),
    },
    {
      value: "158",
      label: t(locale, "Ranked", "จัดอันดับ", "已排名"),
    },
    {
      value: "5",
      label: t(locale, "Watchlist", "เฝ้าระวัง", "观察名单"),
    },
    {
      value: "5",
      label: t(locale, "Public pillars", "เสาหลักสาธารณะ", "公开支柱"),
    },
    {
      value: "22 + 3",
      label: t(locale, "Scored + diagnostic metrics", "ตัวชี้วัด + วินิจฉัย", "评分 + 诊断指标"),
    },
    {
      value: "v3.4.0",
      label: t(locale, "Score model", "โมเดลคะแนน", "评分模型"),
    },
    {
      value: "v1.3.0",
      label: t(locale, "Tier policy", "นโยบายชั้น", "层级政策"),
    },
    {
      value: "EN · TH · ZH",
      label: t(locale, "Locales", "ภาษา", "语言"),
    },
  ];

  const lenses: AwardLens[] = [
    {
      award: t(
        locale,
        "Red Dot Award · Brands & Communication Design",
        "Red Dot Award · Brands & Communication Design",
        "Red Dot Award · 品牌与传播设计",
      ),
      category: t(
        locale,
        "Editorial Design (target: 2027 cycle)",
        "Editorial Design (รอบปี 2027)",
        "编辑设计（目标：2027 周期）",
      ),
      url: "https://www.red-dot.org/bcd",
      criteria: [
        t(locale, "Originality", "ความริเริ่ม", "原创性"),
        t(locale, "Design quality", "คุณภาพการออกแบบ", "设计质量"),
        t(locale, "Creative achievement", "ความสำเร็จเชิงสร้างสรรค์", "创造性成就"),
        t(locale, "Effectiveness", "ประสิทธิผล", "传播效果"),
        t(locale, "Tone-of-voice integrity", "ความเป็นน้ำหนึ่งใจเดียวของน้ำเสียง", "声音一致性"),
        t(locale, "Self-explanatory quality", "ความเข้าใจได้ในตัวเอง", "自解释性"),
      ],
      answer: t(
        locale,
        "SLIC enters Red Dot as a publication, not a dashboard. The op-ed voice carries the differentiation. Every other major city index reads as a press release; SLIC reads as an argument with its evidence chain visible. Methodology rigor (22 metrics, per-metric source URL, no imputation) is the supporting case under the editorial frame.",
        "SLIC ยื่น Red Dot ในฐานะสิ่งพิมพ์ ไม่ใช่แดชบอร์ด น้ำเสียงเชิงบทบรรณาธิการคือสิ่งที่แยกออกจากดัชนีอื่น ดัชนีเมืองรายใหญ่อื่นทุกตัวอ่านเหมือนใบประชาสัมพันธ์ SLIC อ่านเป็นข้อโต้แย้งที่มีหลักฐานครบในแหล่งที่มา ความเข้มงวดของระเบียบวิธี (22 ตัวชี้วัด พร้อม URL แหล่งที่มาต่อตัวชี้วัด ไม่มีการเดาข้อมูล) เป็นหลักฐานประกอบใต้กรอบบทบรรณาธิการ",
        "SLIC 以出版物身份投递 Red Dot，而非数据看板。专栏式的声音构成核心差异化。其他主要城市指数读起来像新闻通稿；SLIC 读起来是一篇有可见证据链的论辩。方法论严谨度（22 项指标、每项指标的来源 URL、无估算填补）是编辑框架下的支撑证据。",
      ),
      artifact: t(
        locale,
        "Entry point: the homepage hero + Methodology paper",
        "จุดเข้า: หน้าแรก + paper ระเบียบวิธี",
        "切入点：首页 hero + 方法论 PDF",
      ),
    },
    {
      award: t(
        locale,
        "DEmark — Design Excellence Award Thailand",
        "DEmark — รางวัลการออกแบบยอดเยี่ยม",
        "DEmark — 泰国设计卓越奖",
      ),
      category: t(
        locale,
        "System Service & Digital Platform (target: 2027 cycle)",
        "System Service & Digital Platform (รอบปี 2027)",
        "系统服务与数字平台（目标：2027 周期）",
      ),
      url: "https://demarkaward.net",
      criteria: [
        t(locale, "Design Story", "เรื่องของการออกแบบ", "设计故事"),
        t(locale, "Innovative Thinking", "ความคิดเชิงนวัตกรรม", "创新思考"),
        t(locale, "Emotional & Aesthetic Quality", "คุณภาพทางอารมณ์และความงาม", "情感与美学品质"),
        t(locale, "User Value", "คุณค่าต่อผู้ใช้", "用户价值"),
        t(locale, "Sustainable Value", "คุณค่าที่ยั่งยืน", "可持续价值"),
      ],
      answer: t(
        locale,
        "DEmark's 2025 theme was 'The Liveable Creation'. SLIC is what that theme looks like as durable civic infrastructure — a Thai-led ranking that argues, in three languages, that a city is liveable only if a person on a local salary can build a life there. Open methodology, open data, open code, DEPA + PMU-A institutional backing.",
        "ธีม DEmark 2568 คือ 'The Liveable Creation' SLIC คือธีมนี้ในรูปของโครงสร้างพื้นฐานพลเมืองที่ยั่งยืน คือดัชนีที่นำโดยคนไทย ที่แย้งในสามภาษาว่า เมืองน่าอยู่ก็ต่อเมื่อคนรายได้ท้องถิ่นสร้างชีวิตได้จริง ระเบียบวิธีเปิด ข้อมูลเปิด โค้ดเปิด การสนับสนุนจาก DEPA + PMU-A",
        "DEmark 2025 主题是 'The Liveable Creation'（可居造物）。SLIC 正是这一主题作为持久公共基础设施的呈现 —— 泰国主导的城市排名，在三语中论证：只有当本地工资也能在那里安家时，城市才是宜居的。方法公开，数据公开，代码公开，DEPA 与 PMU-A 机构支持。",
      ),
      artifact: t(
        locale,
        "Entry point: this page + the mandatory 1–3 min video (script in docs/submission-video-script.md)",
        "จุดเข้า: หน้านี้ + วิดีโอ 1–3 นาที (สคริปต์ใน docs/submission-video-script.md)",
        "切入点：本页 + 强制 1–3 分钟视频（脚本在 docs/submission-video-script.md）",
      ),
    },
    {
      award: t(
        locale,
        "CEA Creative Excellence Awards",
        "CEA Creative Excellence Awards",
        "CEA 创造卓越奖",
      ),
      category: t(
        locale,
        "Creative Technology Award (Creative Business track) — primary",
        "Creative Technology Award (สาย Creative Business) — หลัก",
        "创造性技术奖（Creative Business 类）— 主投",
      ),
      url: "https://www.cea.or.th",
      criteria: [
        t(locale, "Novelty", "ความใหม่", "新颖性"),
        t(locale, "Value creation", "การสร้างคุณค่า", "价值创造"),
        t(locale, "Positive impact", "ผลกระทบเชิงบวก", "正面影响"),
        t(locale, "Sustainability / tangibility", "ความยั่งยืน / จับต้องได้", "可持续性 / 可见度"),
        t(locale, "Thailand-to-world relevance", "บทบาทไทยต่อโลก", "泰国对外的相关性"),
      ],
      answer: t(
        locale,
        "SLIC is open-methodology civic infrastructure built by Thai academics. The AMPI scoring engine + public-tier overlay (Alpha/Beta/Gamma with country caps + coverage floor + city exclusions) is a novel synthesis. Open code, open data, multilingual delivery, DEPA + PMU-A + CMU institutional backing — durable infrastructure, not a campaign.",
        "SLIC คือโครงสร้างพื้นฐานพลเมืองที่มีระเบียบวิธีเปิด สร้างโดยนักวิชาการไทย เอ็นจิ้นคำนวณ AMPI + ชั้นสาธารณะ Alpha/Beta/Gamma พร้อมเพดานประเทศ พื้น coverage และการกีดกันเมือง คือการสังเคราะห์ใหม่ โค้ดเปิด ข้อมูลเปิด หลายภาษา การสนับสนุนเชิงสถาบันจาก DEPA + PMU-A + CMU — เป็นโครงสร้างพื้นฐานที่ยั่งยืน ไม่ใช่แคมเปญชั่วคราว",
        "SLIC 是由泰国学者构建的开放方法论公共基础设施。AMPI 评分引擎 + Alpha/Beta/Gamma 公开层级（含国家上限 / 覆盖率底线 / 城市排除）是一种新颖综合。代码开放、数据开放、多语言交付，DEPA + PMU-A + CMU 机构支持 —— 是持久基础设施，而非临时活动。",
      ),
      artifact: t(
        locale,
        "Entry point: case statement on this page; full audit in docs/AWARDS-AUDIT-2026-05.md",
        "จุดเข้า: คำอธิบายเคสในหน้านี้ การตรวจสอบเต็มใน docs/AWARDS-AUDIT-2026-05.md",
        "切入点：本页案例陈述；完整审计见 docs/AWARDS-AUDIT-2026-05.md",
      ),
    },
    {
      award: t(
        locale,
        "CEA Creative Excellence Awards (companion entry)",
        "CEA Creative Excellence Awards (รายการคู่)",
        "CEA 创造卓越奖（同投）",
      ),
      category: t(
        locale,
        "Creative Advocacy Award (Creative City track)",
        "Creative Advocacy Award (สาย Creative City)",
        "创造性倡导奖（Creative City 类）",
      ),
      url: "https://www.cea.or.th",
      criteria: [
        t(locale, "Novelty", "ความใหม่", "新颖性"),
        t(locale, "Value creation", "การสร้างคุณค่า", "价值创造"),
        t(locale, "Positive impact", "ผลกระทบเชิงบวก", "正面影响"),
        t(locale, "Sustainability / tangibility", "ความยั่งยืน / จับต้องได้", "可持续性 / 可见度"),
        t(locale, "Thailand-to-world relevance", "บทบาทไทยต่อโลก", "泰国对外的相关性"),
      ],
      answer: t(
        locale,
        "SLIC reframes how readers consume city rankings. The provocation — 'every ranking is a lie' — is paired with a per-metric source chain so readers can audit any score. Bangkok holds the Alpha-tier 10th seat as the editorial anchor because the median resident genuinely thrives, not because of soft power or nostalgia. The advocacy is the publication.",
        "SLIC ปรับวิธีที่ผู้อ่านบริโภคดัชนีเมือง คำท้าทาย — 'ทุกดัชนีคือเรื่องโกหก' — มาคู่กับห่วงโซ่แหล่งที่มาต่อตัวชี้วัด ผู้อ่านตรวจสอบคะแนนได้ทุกค่า กรุงเทพฯ ครองที่นั่ง Alpha สลอตที่ 10 ในฐานะหลักทางบทบรรณาธิการ เพราะคนกรุงเทพฯ ระดับมัธยฐานเจริญงอกงามได้จริง ไม่ใช่เพราะ soft power หรือความรู้สึกหวนรำลึก การรณรงค์คือสิ่งพิมพ์เอง",
        "SLIC 重新框定读者消费城市排名的方式。挑衅式提问 ——「每一份排名都是谎言」—— 与逐项指标来源链相配，读者可审计任意分数。曼谷占据 Alpha 层第十席作为编辑锚点，是因为中位居民真正安居，而非因为软实力或怀旧。倡导即出版物本身。",
      ),
      artifact: t(
        locale,
        "Entry point: the homepage Alpha bridge + the Bangkok scorecard at /city/th-bangkok",
        "จุดเข้า: บริดจ์ Alpha บนหน้าแรก + คะแนนกรุงเทพฯ ที่ /city/th-bangkok",
        "切入点：首页 Alpha 桥段 + 曼谷评分卡 /city/th-bangkok",
      ),
    },
  ];

  const provenanceTitle = t(
    locale,
    "Provenance and editorial independence",
    "ที่มาและความเป็นอิสระด้านบรรณาธิการ",
    "来源与编辑独立性",
  );

  const provenanceBody = t(
    locale,
    "Authored by Dr. Non Arkara and Associate Professor Poon Thiengburanathum (Chiang Mai University). Computing and platform costs are supported in kind by DEPA (Digital Economy Promotion Agency) and PMU-A (Program Management Unit for Area-Based Development, Ministry of Higher Education, Research, Science and Innovation), Thailand. No private-sector funding. No sponsor has influence over scores, tier placement, or methodology. Research-pipeline and AI tooling collaboration with Axiom × ReTL. The full statement runs in every page footer.",
    "เขียนโดย ดร.นนท์ อรกร และ รศ.ภูวงษ์ เทียงบุรานัม (มหาวิทยาลัยเชียงใหม่) ค่าใช้จ่ายโครงสร้างพื้นฐานคอมพิวเตอร์และแพลตฟอร์มได้รับการสนับสนุนเป็นสิ่งของจาก DEPA (สำนักงานส่งเสริมเศรษฐกิจดิจิทัล) และ PMU-A (กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัย และนวัตกรรม) ประเทศไทย ไม่มีผู้สนับสนุนจากภาคเอกชน ไม่มีผู้สนับสนุนรายใดมีอิทธิพลต่อคะแนน การจัดลำดับชั้น หรือระเบียบวิธี ความร่วมมือด้านกระบวนการวิจัยและเครื่องมือ AI กับ Axiom × ReTL คำชี้แจงฉบับเต็มอยู่ในท้ายทุกหน้า",
    "由 Dr. Non Arkara 与副教授 Poon Thiengburanathum（清迈大学）撰写。计算与平台费用由泰国 DEPA（数字经济促进局）和 PMU-A（高等教育、科学、研究与创新部 — 区域发展项目管理署）以实物形式提供支持。无私营部门资助。任何赞助商均不影响评分、层级分配或方法论。研究流程与 AI 工具与 Axiom × ReTL 协作。完整声明在每页页脚展开。",
  );

  const impactTitle = t(
    locale,
    "Impact evidence",
    "หลักฐานผลกระทบ",
    "影响力证据",
  );

  const impactNote = t(
    locale,
    "Placeholders — Non to fill before any submission goes live. Anything published here must be falsifiable and citable.",
    "ตัวยึดที่ยังว่างอยู่ — Non จะเป็นผู้กรอกก่อนการยื่นรางวัลจริง สิ่งที่เผยแพร่ที่นี่ต้องตรวจสอบได้และมีแหล่งอ้างอิง",
    "占位 —— Non 在任何投奖前自行补全。在此发布的内容必须可证伪、可引用。",
  );

  const impactRows: { label: string; placeholder: string }[] = [
    {
      label: t(locale, "Visitor reach", "ผู้เข้าชม", "访问量"),
      placeholder: t(
        locale,
        "Visitor count + geographic distribution from getVisitorStats() — to surface from the live API",
        "จำนวนผู้เข้าชม + การกระจายเชิงภูมิศาสตร์จาก getVisitorStats() — ดึงจาก API จริง",
        "访问量 + 地理分布，来自 getVisitorStats() —— 从生产 API 拉取",
      ),
    },
    {
      label: t(locale, "Press / citations", "สื่อ / การอ้างอิง", "媒体 / 引用"),
      placeholder: "TODO — list each citation with source name, date, URL, language",
    },
    {
      label: t(locale, "Summit / conference appearances", "งานสัมมนา / เวที", "峰会 / 会议出席"),
      placeholder: t(
        locale,
        "GITEX Singapore 2026 main stage; Smart City Expo; Taipei Smart City Summit — confirm dates and link recordings/photos",
        "GITEX Singapore 2026 เวทีหลัก; Smart City Expo; Taipei Smart City Summit — ยืนยันวันที่และลิงก์บันทึก/ภาพ",
        "GITEX Singapore 2026 主舞台；Smart City Expo；台北智慧城市峰会 —— 确认日期并链接录像/照片",
      ),
    },
    {
      label: t(locale, "Partner adoption", "การนำไปใช้ของพันธมิตร", "合作伙伴采用"),
      placeholder: "TODO — each partner: organisation name, what they adopted (methodology, dataset, workbench), evidence URL",
    },
    {
      label: t(locale, "Academic use", "การใช้งานเชิงวิชาการ", "学术使用"),
      placeholder: "TODO — courses / theses / papers citing SLIC; CMU + external institutions",
    },
  ];

  const downloadsTitle = t(
    locale,
    "Downloads and deep-links",
    "ดาวน์โหลดและลิงก์ตรง",
    "下载与深链",
  );

  const downloads = [
    {
      label: t(locale, "Methodology paper (EN)", "paper ระเบียบวิธี (EN)", "方法论 PDF (英)"),
      href: `${BASE}/downloads/slic-methodology-technical-paper-en.pdf`,
    },
    {
      label: t(locale, "Methodology paper (TH)", "paper ระเบียบวิธี (TH)", "方法论 PDF (泰)"),
      href: `${BASE}/downloads/slic-methodology-technical-paper-th.pdf`,
    },
    {
      label: t(locale, "Methodology paper (ZH)", "paper ระเบียบวิธี (ZH)", "方法论 PDF (中)"),
      href: `${BASE}/downloads/slic-methodology-technical-paper-zh.pdf`,
    },
    {
      label: t(locale, "Ranked-city CSV (158 rows)", "CSV เมืองที่จัดอันดับ (158 แถว)", "已排名城市 CSV (158 行)"),
      href: `${BASE}/downloads/slic-ranked-cities-v2.csv`,
    },
    {
      label: t(locale, "Source code on GitHub", "ซอร์สโค้ดบน GitHub", "GitHub 源代码"),
      href: "https://github.com/Nonarkara/SLIC-Index",
    },
    {
      label: t(locale, "Audit document (this submission)", "เอกสารตรวจสอบ (การยื่นนี้)", "审计文档（本投奖）"),
      href: "https://github.com/Nonarkara/SLIC-Index/blob/codex/red-dot-design-2-5-1/docs/AWARDS-AUDIT-2026-05.md",
    },
    {
      label: t(locale, "Video script (EN + TH)", "สคริปต์วิดีโอ (EN + TH)", "视频脚本（英 + 泰）"),
      href: "https://github.com/Nonarkara/SLIC-Index/blob/codex/red-dot-design-2-5-1/docs/submission-video-script.md",
    },
  ];

  const calendarTitle = t(
    locale,
    "Submission calendar",
    "ปฏิทินการยื่น",
    "投奖日历",
  );

  const calendarRows = [
    {
      award: "Red Dot Brands & Communication — Editorial Design",
      status: t(locale, "Closed (May 2026)", "ปิดรับ (พ.ค. 2569)", "已截止（2026 年 5 月）"),
      next: t(locale, "Early Bird ~Feb 2027", "Early Bird ~ก.พ. 2570", "Early Bird ~2027 年 2 月"),
    },
    {
      award: "DEmark — System Service & Digital Platform",
      status: t(locale, "Closed (May 2026)", "ปิดรับ (พ.ค. 2569)", "已截止（2026 年 5 月）"),
      next: t(locale, "Q1 2027", "ไตรมาส 1 ปี 2570", "2027 Q1"),
    },
    {
      award: "CEA Creative Technology Award",
      status: t(locale, "Likely open Jun–Aug 2026", "น่าจะเปิดรับ มิ.ย.–ส.ค. 2569", "预计 2026 年 6–8 月开启"),
      next: t(locale, "2026 cycle — confirm via DEPA channel", "รอบปี 2569 — ยืนยันผ่านช่องทาง DEPA", "2026 周期 —— 通过 DEPA 渠道确认"),
    },
    {
      award: "CEA Creative Advocacy Award",
      status: t(locale, "Likely open Jun–Aug 2026", "น่าจะเปิดรับ มิ.ย.–ส.ค. 2569", "预计 2026 年 6–8 月开启"),
      next: t(locale, "2026 cycle companion entry", "รายการคู่ในรอบปี 2569", "2026 周期同投"),
    },
  ];

  const allRoutesTitle = t(
    locale,
    "What a juror reads, in order",
    "สิ่งที่กรรมการอ่าน เรียงตามลำดับ",
    "评审阅读顺序",
  );

  const routeWalk: { path: SitePath; note: string }[] = [
    {
      path: "/",
      note: t(
        locale,
        "Homepage — provocation, Alpha tier, spider allocator. First-screen test.",
        "หน้าแรก — คำท้าทาย ชั้น Alpha และ spider allocator การทดสอบหน้าจอแรก",
        "首页 —— 挑衅式提问、Alpha 层、蜘蛛分配器。第一屏测试。",
      ),
    },
    {
      path: "/methodology",
      note: t(
        locale,
        "Methodology paper — equations, worked Bangkok example, every metric's source.",
        "paper ระเบียบวิธี — สมการ ตัวอย่างกรุงเทพฯ ที่คำนวณจริง แหล่งที่มาของทุกตัวชี้วัด",
        "方法论 —— 公式、曼谷工作样例、每项指标的来源。",
      ),
    },
    {
      path: "/compare",
      note: t(
        locale,
        "Ten-index comparison — SLIC alongside EIU, Mercer, Resonance, Monocle, Yonsei-Cambridge, IMD, GPCI, Oxford Economics, Hanke, SLIC Soft Power.",
        "เปรียบเทียบ 10 ดัชนี — SLIC คู่กับ EIU, Mercer, Resonance, Monocle, Yonsei-Cambridge, IMD, GPCI, Oxford Economics, Hanke, SLIC Soft Power",
        "十指数对比 —— SLIC 与 EIU、Mercer、Resonance、Monocle、Yonsei-Cambridge、IMD、GPCI、Oxford Economics、Hanke、SLIC Soft Power 并列。",
      ),
    },
    {
      path: "/essay",
      note: t(
        locale,
        "Long-form editorial — the full argument, four-part Medium series consolidated.",
        "บทบรรณาธิการยาว — ข้อโต้แย้งเต็มรูป รวมซีรีส์ Medium สี่ตอน",
        "长文社论 —— 完整论证，四部 Medium 系列合并。",
      ),
    },
    {
      path: "/about-slic",
      note: t(
        locale,
        "About — mission, funding, editorial independence, press strip.",
        "เกี่ยวกับ — พันธกิจ การสนับสนุนทุน ความเป็นอิสระด้านบรรณาธิการ แถบสื่อ",
        "关于 —— 使命、资助、编辑独立性、媒体出现纪录。",
      ),
    },
  ];

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="rankings-title">{title}</h1>
            <p className="hero-intro">{intro}</p>
            <p className="hp-thesis-body" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
              {provocation}
            </p>

            <div className="hero-actions">
              <a
                className="primary-action"
                href={appHref("/methodology")}
                onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
              >
                {t(locale, "Read the methodology", "อ่านระเบียบวิธี", "阅读方法论")}
              </a>
              <a
                className="primary-action"
                href={appHref("/about-slic")}
                onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}
                style={{ marginLeft: "0.5rem" }}
              >
                {t(locale, "About SLIC", "เกี่ยวกับ SLIC", "关于 SLIC")}
              </a>
            </div>
          </div>

          <aside className="paper-card external-link-card">
            <p className="panel-label">{t(locale, "Canonical numbers", "ตัวเลขมาตรฐาน", "标准数据")}</p>
            <ul className="profile-summary-list">
              {numbers.map((n) => (
                <li key={n.label}>
                  <strong>{n.value}</strong>
                  <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>{n.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <main>
        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Four reading frames", "สี่กรอบการอ่าน", "四种阅读框架")}</p>
              <h2>{t(locale, "How four juries will read the same publication", "สี่คณะกรรมการอ่านสิ่งพิมพ์เดียวกันอย่างไร", "四个评审团如何阅读同一出版物")}</h2>
            </div>
            <p className="section-summary">
              {t(
                locale,
                "Each lens captures the criteria that the named award publishes, the answer SLIC gives, and the artifact a juror should reach for first.",
                "แต่ละกรอบสรุปเกณฑ์ที่รางวัลประกาศ คำตอบของ SLIC และอาร์ติแฟกต์ที่กรรมการควรหยิบเป็นอันดับแรก",
                "每个框架捕获相应奖项公布的标准、SLIC 的回答，以及评审最先应触达的工件。",
              )}
            </p>
          </div>

          <div className="profile-card-grid">
            {lenses.map((lens) => (
              <article className="paper-card partner-card" key={lens.award + lens.category}>
                <p className="panel-label">{lens.category}</p>
                <h3>{lens.award}</h3>
                <p style={{ marginTop: "0.5rem" }}>
                  <strong>{t(locale, "Named criteria:", "เกณฑ์ที่ประกาศ:", "公布标准：")}</strong>{" "}
                  {lens.criteria.join(" · ")}
                </p>
                <p style={{ marginTop: "0.75rem" }}>{lens.answer}</p>
                <p style={{ marginTop: "0.75rem", opacity: 0.7, fontSize: "0.875rem" }}>
                  {lens.artifact}
                </p>
                {lens.url && (
                  <a className="inline-page-link" href={lens.url} target="_blank" rel="noopener noreferrer">
                    {lens.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Provenance", "ที่มา", "来源")}</p>
              <h2>{provenanceTitle}</h2>
            </div>
            <p className="section-summary">{provenanceBody}</p>
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Receipts", "หลักฐาน", "凭证")}</p>
              <h2>{impactTitle}</h2>
            </div>
            <p className="section-summary">{impactNote}</p>
          </div>

          <div className="profile-card-grid">
            {impactRows.map((row) => (
              <article className="paper-card" key={row.label}>
                <p className="panel-label">{row.label}</p>
                <p style={{ opacity: 0.7, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {row.placeholder}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Calendar", "ปฏิทิน", "日历")}</p>
              <h2>{calendarTitle}</h2>
            </div>
            <p className="section-summary">
              {t(
                locale,
                "Red Dot 2026 and DEmark 2026 closed in May 2026. CEA 2026 packet is the only one of the four likely live for this calendar year.",
                "Red Dot 2026 และ DEmark 2026 ปิดรับในเดือน พ.ค. 2569 มีเพียง CEA 2026 ที่น่าจะเปิดรับในปฏิทินปีนี้",
                "Red Dot 2026 与 DEmark 2026 已于 2026 年 5 月截止。四项中仅 CEA 2026 在本年度仍有可能开放。",
              )}
            </p>
          </div>

          <div className="profile-card-grid">
            {calendarRows.map((row) => (
              <article className="paper-card" key={row.award}>
                <p className="panel-label">{row.award}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {row.status}
                </p>
                <p style={{ marginTop: "0.5rem", opacity: 0.75 }}>{row.next}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Route walk", "เดินตามเส้นทาง", "路线导览")}</p>
              <h2>{allRoutesTitle}</h2>
            </div>
            <p className="section-summary">
              {t(
                locale,
                "Recommended click-path for a cold juror landing on the site for the first time.",
                "เส้นทางคลิกที่แนะนำสำหรับกรรมการที่เข้ามาเว็บไซต์เป็นครั้งแรก",
                "为首次访问的评审推荐的点击路径。",
              )}
            </p>
          </div>

          <div className="profile-card-grid">
            {routeWalk.map((step, index) => (
              <article className="paper-card" key={step.path}>
                <p className="panel-label">
                  {String(index + 1).padStart(2, "0")} · {step.path}
                </p>
                <p>{step.note}</p>
                <a
                  className="inline-page-link"
                  href={appHref(step.path)}
                  onClick={(event) => navigateLink(event, onNavigate, step.path)}
                >
                  {t(locale, "Open", "เปิด", "打开")} {step.path}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(locale, "Artifacts", "ไฟล์ที่เกี่ยวข้อง", "工件")}</p>
              <h2>{downloadsTitle}</h2>
            </div>
            <p className="section-summary">
              {t(
                locale,
                "Every artifact a juror needs is downloadable from this page. Methodology paper in three locales; ranked-city CSV; full source code; this audit document.",
                "ทุกอาร์ติแฟกต์ที่กรรมการต้องการดาวน์โหลดได้จากหน้านี้ paper ระเบียบวิธีสามภาษา CSV เมืองที่จัดอันดับ ซอร์สโค้ดเต็ม เอกสารตรวจสอบนี้",
                "评审需要的所有工件均可从本页下载。三语方法论 PDF；已排名城市 CSV；完整源代码；本审计文档。",
              )}
            </p>
          </div>

          <div className="profile-card-grid">
            {downloads.map((d) => (
              <article className="paper-card" key={d.href}>
                <p className="panel-label">{d.label}</p>
                <a
                  className="inline-page-link"
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {d.href.replace(/^https?:\/\//, "").replace(BASE, "").replace(/\/$/, "") || d.href}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} onNavigate={onNavigate} />
    </>
  );
}
