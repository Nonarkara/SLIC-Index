import { profilePhotos } from "./profilePhotos";
import { appHref } from "./routing";
import { OFFICIAL_SLIC_URL, slicProfileData, type PartnerCard } from "./slicProfileData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

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
                {locale === "th" ? "เมษายน 2569" : locale === "zh" ? "2026 年 4 月" : "April 2026"}
              </p>
              <h3>GITEX AI Asia · Singapore</h3>
              <p>
                {locale === "th"
                  ? "Marina Bay Sands, 9–10 เมษายน 2569 · ผู้เข้าร่วมกว่า 23,000 คนจาก 110+ ประเทศ · ดร. นนท์ นำเสนอ V3 Protocol Beta บนเวทีหลักต่อหน้าผู้ชมกว่าพันคน · เวิร์กช็อป Government Innovation as a Service ที่นั่งเต็มก่อนเริ่มงาน"
                  : locale === "zh"
                    ? "滨海湾金沙，2026 年 4 月 9–10 日 · 110+ 国家逾 23,000 名观众 · Dr. Non 在主舞台向上千名观众展示 V3 Protocol Beta · 后续政府创新即服务工作坊开场前即座无虚席"
                    : "Marina Bay Sands, 9–10 April 2026 · 23,000+ attendees from 110+ countries · Dr. Non presented V3 Protocol Beta on the main stage to a thousand-strong audience · Follow-on Government Innovation as a Service workshop filled before opening remarks"}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {locale === "th" ? "มีนาคม 2569" : locale === "zh" ? "2026 年 3 月" : "March 2026"}
              </p>
              <h3>Smart City Summit & Expo · Taipei</h3>
              <p>
                {locale === "th"
                  ? "การเปิดตัว V2 ในรูปคีย์โน้ตที่งาน Smart City Summit & Expo เมืองไทเป — งาน smart city ที่ใหญ่ที่สุดในเอเชีย · 174 เมือง, 53 ประเทศ, ผู้เชี่ยวชาญ 3,000+ คน"
                  : locale === "zh"
                    ? "在台北 Smart City Summit & Expo（亚洲最大智慧城市活动）以主旨演讲发布 V2 · 174 座城市、53 个国家、3,000+ 名专业人士"
                    : "V2 keynote launch at Smart City Summit & Expo Taipei — the largest smart city event in Asia · 174 cities, 53 countries, 3,000+ professionals"}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {locale === "th" ? "มีนาคม 2566" : locale === "zh" ? "2023 年 3 月" : "March 2023"}
              </p>
              <h3>Smart City Summit & Expo · Taipei</h3>
              <p>
                {locale === "th"
                  ? "การนำเสนอกรอบ smart city ระยะแรกของ ดร. นนท์ ครั้งแรกบนเวที Smart City Summit & Expo เมืองไทเป — จุดเริ่มต้นของแนวคิดที่ภายหลังกลายเป็น SLIC Index"
                  : locale === "zh"
                    ? "Dr. Non 在台北 Smart City Summit & Expo 首次公开展示其早期智慧城市框架 —— 后来演变为 SLIC Index 的雏形"
                    : "Dr. Non's first public presentation of his early smart city frameworks at Smart City Summit & Expo Taipei — the starting point of the thinking that later became the SLIC Index"}
              </p>
            </article>

            <article className="paper-card">
              <p className="panel-label">
                {locale === "th" ? "เพิ่มเติม" : locale === "zh" ? "更多" : "More"}
              </p>
              <h3>
                {locale === "th"
                  ? "งานเพิ่มเติม · ติดตามผ่านลิงก์ Submissions"
                  : locale === "zh"
                    ? "更多活动 · 通过投奖案卷链接追踪"
                    : "Additional appearances · tracked via the Submissions link"}
              </h3>
              <p>
                {locale === "th"
                  ? "งาน วงสัมมนา และการเชิญพูดในอนาคตจะถูกบันทึกที่นี่เมื่อยืนยันแล้ว ระหว่างนี้สามารถดู /history เพื่ออ่านเส้นทางการพัฒนา SLIC แบบครบถ้วน"
                  : locale === "zh"
                    ? "未来的会议、论坛与受邀演讲将在确认后记录于此。在此期间请访问 /history 阅读 SLIC 的完整发展路径。"
                    : "Future conferences, panels, and invited talks land here only after confirmation. See /history for the full development arc of SLIC in the meantime."}
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
