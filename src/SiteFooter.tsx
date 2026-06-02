import BrandLockup from "./BrandLockup";
import { collaborationLogos } from "./brandAssets";
import { pickLocale, type LocalizedRecord } from "./i18n";
import { appHref } from "./routing";
import { getCopy } from "./siteCopy";
import type { Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const footerEndnoteCopy: LocalizedRecord<{
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
}> = {
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
  ko: {
    eyebrow: "출판 프로토콜",
    reuseLabel: "재사용 및 출처 표기",
    reuseBody: "SLIC는 공개 인용, 교육, 복제 및 비평을 위해 제공됩니다. 출처를 명확히 하고, 선언된 방법론을 유지하며, 유료 배치나 보증을 암시하지 마세요.",
    creditLabel: "권장 출처 표기",
    creditBody: "Non Arkara 및 Poon Thiengburanathum 부교수, Smart and Liveable Cities Index (SLIC), 공개 순위 모델, 접속일 [date], 사용된 배포 URL 포함.",
    aiLabel: "알고리즘 및 AI 공개",
    aiBody: "게시된 보드는 검증된 SLIC 워크북 익스포트에서 발행됩니다. 각 도시는 하나의 공개 점수, 5개의 기둥 값, 그리고 가능한 경우 지표 수준의 출처와 함께 표시됩니다.",
    liveLabel: "지속적 모델",
    liveBody: "게시된 페이지는 현재 검증된 워크북 익스포트를 반영합니다. 새로운 검증된 데이터가 채택되면 워크북 익스포트와 공개 보드가 함께 업데이트됩니다. 아이디어 페이지의 도시 사진은 Unsplash 라이선스에 따라 Unsplash에서 제공되며, 개별 사진가의 크레딧이 각 사진에 표시됩니다.",
    fundingLabel: "자금 지원 및 편집의 독립성",
    fundingBody: "컴퓨팅 인프라 및 플랫폼 비용은 태국 DEPA(디지털 경제 진흥원) 및 PMU-A(고등교육과학연구혁신부)의 현물 지원을 받았습니다. 민간 부문의 자금 지원은 없습니다. 어떤 후원자도 도시 점수, 등급 배치 또는 방법론에 영향을 미치지 않습니다. 모든 순위는 선언된 모델에 의해서만 생성됩니다. 이 연구는 Dr Non Arkara(수석 저자, 스마트 시티 실무자)와 Assoc. Prof. Poon Thiengburanathum(연구 고문) 두 사람의 노력으로 이루어졌습니다. 이 지수는 앞서 언급한 인프라 지원 외에는 어떤 도시, 정부 또는 민간 단체와도 상업적 관계가 없습니다.",
  },
  ja: {
    eyebrow: "出版プロトコル",
    reuseLabel: "再利用とクレジット",
    reuseBody: "SLICは、公開引用、教育、複製、および批評を目的としています。情報源を明記し、宣言された方法論を維持し、有料の配置や推奨を暗示しないでください。",
    creditLabel: "推奨されるクレジット",
    creditBody: "Non Arkara および Poon Thiengburanathum 准教授、Smart and Liveable Cities Index（SLIC）、公開ランキングモデル、アクセス日 [date]、および使用されたデプロイURL。",
    aiLabel: "アルゴリズムとAIの開示",
    aiBody: "公開されたボードは、検証済みのSLICワークブックエクスポートから発行されています。各都市は、1つの公開スコア、5つの柱の値、および可能であれば指標レベルの出所とともに表示されます。",
    liveLabel: "継続的モデル",
    liveBody: "公開されたページは、現在検証済みのワークブックエクスポートを反映しています。新しい検証済みデータが採用されると、ワークブックエクスポートと公開ボードが共に更新されます。アイデアページの都市写真は、Unsplashライセンスの下でUnsplashから提供されており、個々の写真家のクレジットが各写真に表示されます。",
    fundingLabel: "資金提供と編集の独立性",
    fundingBody: "コンピューティングインフラストラクチャおよびプラットフォームの費用は、タイのDEPA（デジタル経済振興庁）およびPMU-A（高等教育科学研究イノベーション省）から現物支給で支援されました。民間部門からの資金提供はありません。スポンサーが都市のスコア、ティアの配置、または方法論に影響を与えることはありません。すべてのランキングは、宣言されたモデルによってのみ作成されます。これは、Dr Non Arkara（筆頭著者、スマートシティ実務家）とAssoc. Prof. Poon Thiengburanathum（研究顧問）の2名による研究の成果です。このインデックスは、上記のインフラストラクチャの支援以外に、いかなる都市、政府、または民間企業とも商業的な関係を持っていません。",
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
  const endnotes = pickLocale(footerEndnoteCopy, locale);
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
        : locale === "ko"
          ? "방법론, 가중치, 제외 도시 목록, 모든 인용 소스는 방법론 섹션에 공개되어 있습니다."
          : locale === "ja"
            ? "方法論、重み付け、除外都市リスト、すべての引用ソースは方法論セクションで公開されています。"
            : "Methodology, weights, and provenance remain public.";

  const archiveLabels =
    locale === "th"
      ? { v1: "คลัง V1 ↗", v2: "คลัง V2 ↗", v25: "คลัง V2.5 ↗" }
      : locale === "zh"
        ? { v1: "V1 归档 ↗", v2: "V2 归档 ↗", v25: "V2.5 归档 ↗" }
        : locale === "ko"
          ? { v1: "V1 아카이브 ↗", v2: "V2 아카이브 ↗", v25: "V2.5 아카이브 ↗" }
          : locale === "ja"
            ? { v1: "V1アーカイブ ↗", v2: "V2アーカイブ ↗", v25: "V2.5アーカイブ ↗" }
            : { v1: "V1 Archive ↗", v2: "V2 Archive ↗", v25: "V2.5 Archive ↗" };

  const navAriaLabel =
    locale === "th"
      ? "เมนูหลัก"
      : locale === "zh"
        ? "网站导航"
        : locale === "ko"
          ? "사이트 탐색"
          : locale === "ja"
            ? "サイトナビゲーション"
            : "Site navigation";

  const vintageNote =
    locale === "th"
      ? "ข้อมูล: วินเทจปี 2024–2025 · เผยแพร่ครั้งล่าสุด: พฤษภาคม 2026"
      : locale === "zh"
        ? "数据：2024–2025 年版本 · 最后发布：2026 年 5 月"
        : locale === "ko"
          ? "데이터: 2024–2025 빈티지. 지표는 인덱스 v3.4.0 기준입니다."
          : locale === "ja"
            ? "データ：2024〜2025年ビンテージ。指標はインデックスv3.4.0の公開日時点です。"
            : "Data: 2024–2025 vintage · Last published: May 2026";

  // Juror-scannable one-line citation. Mirrors the long-form 'Suggested credit'
  // block above but renders as a hairline-bordered mono line on every page.
  // Year reflects publication year of V3 (2026); refresh annually if methodology
  // version major-bumps.
  const citation =
    locale === "th"
      ? "อ้างอิงเป็น: Arkara, N. & Thiengburanathum, P. (2026). SLIC Index V3 — Smart and Liveable Cities Index. slic.nonarkara.org"
      : locale === "zh"
        ? "建议引用：Arkara, N. & Thiengburanathum, P. (2026). SLIC Index V3 — Smart and Liveable Cities Index. slic.nonarkara.org"
        : locale === "ko"
          ? "인용: Non Arkara 및 Poon Thiengburanathum 부교수, Smart and Liveable Cities Index (SLIC) V3, 2026"
          : locale === "ja"
            ? "引用：Non Arkara およびPoon Thiengburanathum准教授、Smart and Liveable Cities Index (SLIC) V3、2026"
            : "Cite as: Arkara, N. & Thiengburanathum, P. (2026). SLIC Index V3 — Smart and Liveable Cities Index. slic.nonarkara.org";

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
            {locale === "th" ? "ข้อมูล" : locale === "zh" ? "数据" : locale === "ko" ? "데이터" : locale === "ja" ? "データ" : "Data"}
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
          <a href={appHref("/awards")} onClick={(event) => navigateLink(event, onNavigate, "/awards")}>
            {locale === "th" ? "เอกสารยื่นรางวัล" : locale === "zh" ? "投奖案卷" : locale === "ko" ? "출품 서류" : locale === "ja" ? "出品書類" : "Submissions"}
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
        <p className="site-footer-citation">{citation}</p>
      </div>
    </footer>
  );
}
