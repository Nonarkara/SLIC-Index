import { rankingIntegrity } from "./rankingPublication";
import type { Locale } from "./types";

const bannerCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
  }
> = {
  en: {
    eyebrow: "Ranking status",
    title: "Published ranking — 103 cities scored",
    body:
      "Rankings are produced from the verified SLIC workbook with 103 cities scored across 92 signals and 35 connected sources. Five public pillars with declared weights and full source provenance.",
    note: "This ranking may be cited with attribution. See the methodology paper for replication details.",
  },
  th: {
    eyebrow: "สถานะของอันดับ",
    title: "อันดับเผยแพร่แล้ว — 103 เมืองได้รับการให้คะแนน",
    body:
      "อันดับผลิตจากเวิร์กบุ๊ก SLIC ที่ผ่านการตรวจสอบ ครอบคลุม 103 เมือง 92 สัญญาณ และ 35 แหล่งข้อมูล ห้าเสาหลักสาธารณะพร้อมน้ำหนักที่ประกาศชัดเจนและแหล่งที่มาครบถ้วน",
    note: "สามารถอ้างอิงอันดับนี้ได้โดยระบุแหล่งที่มา ดูรายละเอียดเพิ่มเติมในเอกสารระเบียบวิธี",
  },
  zh: {
    eyebrow: "榜单状态",
    title: "已发布排名 — 103 个城市已评分",
    body:
      "排名由经过验证的 SLIC 工作簿生成，涵盖 103 个城市、92 个信号和 35 个连接数据源。五个公开支柱，权重明确声明，数据来源完整。",
    note: "可引用本排名，请注明来源。复现细节请参阅方法论论文。",
  },
};

export default function RankingIntegrityBanner({ locale }: { locale: Locale }) {
  const copy = bannerCopy[locale];
  const issueCount = rankingIntegrity.issues.length;
  const auditDate = new Date(rankingIntegrity.updatedAt);
  const auditLabel = Number.isNaN(auditDate.valueOf())
    ? null
    : auditDate.toLocaleDateString(
        locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      );
  const meta =
    locale === "th"
      ? `${issueCount === 0 ? "ไม่พบปัญหา" : `${issueCount} ประเด็น`}${auditLabel ? ` อัปเดตล่าสุด ${auditLabel}` : ""}`
      : locale === "zh"
        ? `${issueCount === 0 ? "无问题" : `${issueCount} 个问题`}${auditLabel ? `，更新于 ${auditLabel}` : ""}`
        : `${issueCount === 0 ? "No issues" : `${issueCount} issues`}${auditLabel ? `, updated ${auditLabel}` : ""}`;

  return (
    <article className="ranking-integrity-banner" role="note" aria-live="polite">
      <p className="panel-label">{copy.eyebrow}</p>
      <h3>{copy.title}</h3>
      <p>{copy.body}</p>
      <strong>{copy.note}</strong>
      <p className="ranking-integrity-meta">{meta}</p>
    </article>
  );
}
