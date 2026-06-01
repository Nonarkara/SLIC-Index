import { profilePhotos } from "./profilePhotos";
import { appHref } from "./routing";
import { OFFICIAL_SLIC_URL, slicProfileData, type PartnerCard } from "./slicProfileData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";
import { t } from "./i18n";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

function PartnerCardView({ card }: { card: PartnerCard }) {
  return (
    <article className="paper-card partner-card">
      {card.logoSrc && (
        <div className="partner-card-logo">
          <img src={`${BASE}${card.logoSrc}`} alt={`${card.name} logo`} loading="lazy" />
        </div>
      )}
      <p className="panel-label">{card.role}</p>
      <h3>{card.name}</h3>
      <p>{card.body}</p>
      {card.url && (
        <a className="inline-page-link" href={card.url} target="_blank" rel="noopener noreferrer">
          {card.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      )}
    </article>
  );
}

export default function SlicProfilePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const profile = slicProfileData[locale];

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-grid">
          <div>
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1 className="rankings-title">{profile.title}</h1>
            <p className="hero-intro">{profile.intro}</p>

            <div className="hero-actions">
              <a
                className="primary-action"
                href={appHref("/methodology")}
                onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
              >
                {profile.methodologyLabel}
              </a>
            </div>
          </div>

          <aside className="paper-card external-link-card">
            <p className="panel-label">{profile.summaryTitle}</p>
            <ul className="profile-summary-list">
              {profile.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <main>
        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.leadsLabel}</p>
              <h2>{profile.leadsTitle}</h2>
            </div>
            <p className="section-summary">{profile.leadsSummary}</p>
          </div>

          <div className="profile-card-grid">
            {profile.leads.map((lead) => (
              <PartnerCardView key={lead.name} card={lead} />
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.privateLabel}</p>
              <h2>{profile.privateTitle}</h2>
            </div>
            <p className="section-summary">{profile.privateSummary}</p>
          </div>

          <div className="profile-card-grid">
            <article className="paper-card partner-card partner-card-wide">
              {profile.privatePartner.logoSrc && (
                <div className="partner-card-logo">
                  <img
                    src={`${BASE}${profile.privatePartner.logoSrc}`}
                    alt={`${profile.privatePartner.name} logo`}
                    loading="lazy"
                  />
                </div>
              )}
              <p className="panel-label">{profile.privatePartner.role}</p>
              <h3>{profile.privatePartner.name}</h3>
              <p>{profile.privatePartner.body}</p>
              {profile.privatePartner.url && (
                <a
                  className="inline-page-link"
                  href={profile.privatePartner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.slicFootnoteLabel}
                </a>
              )}
            </article>
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.techLabel}</p>
              <h2>{profile.techTitle}</h2>
            </div>
            <p className="section-summary">{profile.techSummary}</p>
          </div>

          <div className="profile-card-grid">
            {profile.techPartners.map((tech) => (
              <PartnerCardView key={tech.name} card={tech} />
            ))}
          </div>
        </section>

        <section className="paper-section section" aria-label="Presented at">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {locale === "th"
                  ? "นำเสนอที่"
                  : locale === "zh"
                    ? "曾经出席"
                    : "Presented at"}
              </p>
              <h2>
                {locale === "th"
                  ? "เวทีและงานที่ SLIC ออกตัวจริงต่อสาธารณะ"
                  : locale === "zh"
                    ? "SLIC 公开亮相的舞台与活动"
                    : "Stages and venues SLIC has appeared on"}
              </h2>
            </div>
            <p className="section-summary">
              {locale === "th"
                ? "เหตุการณ์ที่ตรวจสอบได้ของ SLIC บนเวทีสาธารณะ ใช้เป็นหลักฐานสำหรับการยื่นรางวัล เหตุการณ์ใหม่จะเพิ่มเข้ามาเมื่อตรวจสอบและบันทึกได้แล้ว"
                : locale === "zh"
                  ? "SLIC 在公开舞台上的可核验出席。作为投奖佐证使用。新事件经核验后再补入。"
                  : "Verified public appearances of SLIC. Used as evidence in award submissions. New events land here only after they are confirmed and recorded."}
            </p>
          </div>

          <div className="profile-card-grid">
            <article className="paper-card">
              <p className="panel-label">
                {t(locale, "April 2026", "เมษายน 2569", "2026 年 4 月", "2026년 4월", "2026年4月")}
              </p>
              <h3>{t(locale, "GITEX AI Asia · Singapore", "GITEX AI Asia · สิงคโปร์", "GITEX AI Asia · 新加坡", "GITEX AI Asia · 싱가포르", "GITEX AI Asia · シンガポール")}</h3>
              <p>
                {t(locale, "Marina Bay Sands, 9–10 April 2026 · 23,000+ attendees from 110+ countries · Dr. Non presented V3 Protocol Beta on the main stage to a thousand-strong audience · Follow-on Government Innovation as a Service workshop filled before opening remarks", "Marina Bay Sands, 9–10 เมษายน 2569 · ผู้เข้าร่วมกว่า 23,000 คนจาก 110+ ประเทศ · ดร. นนท์ นำเสนอ V3 Protocol Beta บนเวทีหลักต่อหน้าผู้ชมกว่าพันคน · เวิร์กช็อป Government Innovation as a Service ที่นั่งเต็มก่อนเริ่มงาน", "滨海湾金沙，2026 年 4 月 9–10 日 · 110+ 国家逾 23,000 名观众 · Dr. Non 在主舞台向上千名观众展示 V3 Protocol Beta · 后续政府创新即服务工作坊开场前即座无虚席", "마리나 베이 샌즈, 2026년 4월 9~10일 · 110개국 이상 23,000명 이상의 참석자 · Dr. Non은 수천 명의 청중을 대상으로 메인 무대에서 V3 Protocol Beta를 발표했습니다 · 후속 Government Innovation as a Service 워크숍은 개막사 전에 마감되었습니다", "マリーナ・ベイ・サンズ、2026年4月9日〜10日 · 110カ国以上から23,000名以上の参加者 · Dr. Nonはメインステージで数千人の聴衆にV3 Protocol Betaを発表しました · 続くGovernment Innovation as a Serviceワークショップは開会の辞の前に満席になりました")}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {t(locale, "March 2026", "มีนาคม 2569", "2026 年 3 月", "2026년 3월", "2026年3月")}
              </p>
              <h3>{t(locale, "Smart City Summit & Expo · Taipei", "Smart City Summit & Expo · ไทเป", "Smart City Summit & Expo · 台北", "스마트 시티 서밋 & 엑스포 · 타이베이", "スマートシティサミット＆エキスポ · 台北")}</h3>
              <p>
                {t(locale, "V2 keynote launch at Smart City Summit & Expo Taipei — the largest smart city event in Asia · 174 cities, 53 countries, 3,000+ professionals", "การเปิดตัว V2 ในรูปคีย์โน้ตที่งาน Smart City Summit & Expo เมืองไทเป — งาน smart city ที่ใหญ่ที่สุดในเอเชีย · 174 เมือง, 53 ประเทศ, ผู้เชี่ยวชาญ 3,000+ คน", "在台北 Smart City Summit & Expo（亚洲最大智慧城市活动）以主旨演讲发布 V2 · 174 座城市、53 个国家、3,000+ 名专业人士", "스마트 시티 서밋 & 엑스포 타이베이에서 V2 기조연설 발표 — 아시아 최대 스마트 시티 행사 · 174개 도시, 53개국, 3,000명 이상의 전문가", "スマートシティサミット＆エキスポ台北でのV2基調講演 — アジア最大のスマートシティイベント · 174都市、53カ国、3,000名以上の専門家")}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {t(locale, "March 2023", "มีนาคม 2566", "2023 年 3 月", "2023년 3월", "2023年3月")}
              </p>
              <h3>{t(locale, "Smart City Summit & Expo · Taipei", "Smart City Summit & Expo · ไทเป", "Smart City Summit & Expo · 台北", "스마트 시티 서밋 & 엑스포 · 타이베이", "スマートシティサミット＆エキスポ · 台北")}</h3>
              <p>
                {t(locale, "Dr. Non's first public presentation of his early smart city frameworks at Smart City Summit & Expo Taipei — the starting point of the thinking that later became the SLIC Index", "การนำเสนอกรอบ smart city ระยะแรกของ ดร. นนท์ ครั้งแรกบนเวที Smart City Summit & Expo เมืองไทเป — จุดเริ่มต้นของแนวคิดที่ภายหลังกลายเป็น SLIC Index", "Dr. Non 在台北 Smart City Summit & Expo 首次公开展示其早期智慧城市框架 —— 后来演变为 SLIC Index 的雏形", "Dr. Non이 스마트 시티 서밋 & 엑스포 타이베이에서 초기 스마트 시티 프레임워크를 처음으로 공개 발표 — 이후 SLIC Index가 된 사고의 출발점", "Dr. Nonがスマートシティサミット＆エキスポ台北で初期のスマートシティフレームワークを初公開 — 後にSLIC Indexとなる考えの出発点")}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {t(locale, "More", "เพิ่มเติม", "更多", "더 보기", "詳細")}
              </p>
              <h3>
                {t(locale, "Additional appearances · tracked via the Submissions link", "งานเพิ่มเติม · ติดตามผ่านลิงก์ Submissions", "更多活动 · 通过投奖案卷链接追踪", "추가 활동 · Submissions 링크를 통해 확인 가능", "その他の活動 · Submissionsリンクで確認可能")}
              </h3>
              <p>
                {t(locale, "Future conferences, panels, and invited talks land here only after confirmation. See /history for the full development arc of SLIC in the meantime.", "งาน วงสัมมนา และการเชิญพูดในอนาคตจะถูกบันทึกที่นี่เมื่อยืนยันแล้ว ระหว่างนี้สามารถดู /history เพื่ออ่านเส้นทางการพัฒนา SLIC แบบครบถ้วน", "未来的会议、论坛与受邀演讲将在确认后记录于此。在此期间请访问 /history 阅读 SLIC 的完整发展路径。", "향후 컨퍼런스, 패널 및 초청 강연은 확인된 후에만 여기에 기록됩니다. 그동안 SLIC의 전체 개발 과정은 /history에서 확인하세요.", "今後のカンファレンス、パネル、招待講演は確認後にのみここに記録されます。それまでの間、SLICの完全な開発の軌跡については/historyをご覧ください。")}
              </p>
              <a
                className="inline-page-link"
                href={appHref("/history")}
                onClick={(event) => navigateLink(event, onNavigate, "/history")}
              >
                {locale === "th"
                  ? "เปิดเส้นทางการพัฒนา"
                  : locale === "zh"
                    ? "查看发展历程"
                    : "Open the journey timeline"}
              </a>
            </article>
          </div>
        </section>

        <section className="paper-visual-strip section" aria-label="SLIC publication context">
          <div className="field-ledger-copy">
            <p className="eyebrow">{profile.publicationLabel}</p>
            <h2>{profile.publicationTitle}</h2>
            <p className="section-summary">{profile.publicationSummary}</p>
          </div>

          <div className="field-ledger-grid">
            {profilePhotos.map((photo, index) => (
              <figure
                className={index === 2 ? "photo-frame photo-frame-wide" : "photo-frame"}
                key={photo.id}
              >
                <img
                  src={`${BASE}${photo.src}`}
                  alt={photo.alt}
                  loading="lazy"
                  width={photo.width}
                  height={photo.height}
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="paper-section section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{profile.resourceLabel}</p>
              <h2>{profile.resourcesTitle}</h2>
            </div>
            <p className="section-summary">{profile.bridgeBody}</p>
          </div>

          <div className="profile-card-grid">
            <a
              className="paper-card profile-logo-card"
              href={appHref("/methodology")}
              onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
            >
              <p className="panel-label">{profile.resourceLabel}</p>
              <h3>{profile.methodologyLabel}</h3>
              <p>{profile.bridgeBody}</p>
            </a>

            <a
              className="paper-card profile-logo-card"
              href={OFFICIAL_SLIC_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="panel-label">{profile.resourceLabel}</p>
              <h3>{profile.externalLabel}</h3>
              <p>{profile.slicFootnoteLabel}</p>
            </a>

            <a
              className="paper-card profile-logo-card"
              href={appHref("/awards")}
              onClick={(event) => navigateLink(event, onNavigate, "/awards")}
            >
              <p className="panel-label">
                {locale === "th"
                  ? "การยื่นรางวัล"
                  : locale === "zh"
                    ? "投奖"
                    : "Submissions"}
              </p>
              <h3>
                {locale === "th"
                  ? "เอกสารยื่นรางวัล SLIC"
                  : locale === "zh"
                    ? "SLIC 投奖案卷"
                    : "SLIC Submission Dossier"}
              </h3>
              <p>
                {locale === "th"
                  ? "หน้าเดียวสำหรับกรรมการ Red Dot, DEmark และ CEA Creative Excellence ครอบคลุมเกณฑ์ ระเบียบวิธี และไฟล์ที่เกี่ยวข้องทั้งหมด"
                  : locale === "zh"
                    ? "评审一页通览 —— Red Dot、DEmark、CEA 创造卓越奖：标准、方法、所有工件。"
                    : "One page for Red Dot, DEmark, and CEA Creative Excellence jurors — criteria, methodology answer, every artifact."}
              </p>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
