import { rankingIntegrity, rankingPublication } from "./rankingPublication";
import { pickLocale, type LocalizedRecord } from "./i18n";
import type { Locale } from "./types";

const bannerCopy: LocalizedRecord<{
    eyebrow: string;
    note: string;
}> = {
  en: {
    eyebrow: "Ranking status",
    note: "This ranking may be cited with attribution. See the methodology paper for replication details.",
  },
  th: {
    eyebrow: "สถานะของอันดับ",
    note: "สามารถอ้างอิงอันดับนี้ได้โดยระบุแหล่งที่มา ดูรายละเอียดเพิ่มเติมในเอกสารระเบียบวิธี",
  },
  zh: {
    eyebrow: "榜单状态",
    note: "可引用本排名，请注明来源。复现细节请参阅方法论论文。",
  },
  ko: {
    eyebrow: "순위 상태",
    note: "이 순위는 출처를 밝히고 인용할 수 있습니다. 복제 세부 사항은 방법론 문서를 참조하세요.",
  },
  ja: {
    eyebrow: "ランキングステータス",
    note: "このランキングは帰属表示付きで引用できます。複製に関する詳細は方法論の文書をご覧ください。",
  },
};

export default function RankingIntegrityBanner({ locale }: { locale: Locale }) {
  const copy = pickLocale(bannerCopy, locale);
  const cityCount = rankingPublication.cities.length;
  const catalog = (rankingPublication as unknown as { metricCatalog?: Record<string, { scored?: boolean; diagnostic?: boolean }> }).metricCatalog ?? {};
  const catalogEntries = Object.values(catalog);
  const scoredCount = catalogEntries.filter((entry) => entry?.scored === true).length;
  const diagnosticCount = catalogEntries.filter((entry) => entry?.diagnostic === true).length;
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
  const title =
    locale === "th"
      ? `อันดับที่เผยแพร่แล้ว — ${cityCount} เมือง`
      : locale === "zh"
        ? `已发布排名 — ${cityCount} 座城市`
        : `Published ranking — ${cityCount} cities`;
  const body =
    locale === "th"
      ? `อันดับนี้เผยแพร่จากเวิร์กบุ๊ก SLIC ที่ผ่านการตรวจสอบแล้ว ครอบคลุม ${cityCount} เมือง พร้อม ${scoredCount} เมตริกที่ให้คะแนนใน 5 เสาหลัก และอีก ${diagnosticCount} diagnostic ที่มองเห็นได้ หน้าคะแนนแต่ละใบไล่ย้อนกลับไปยังตัวเลขที่เผยแพร่ได้`
      : locale === "zh"
        ? `本榜单由已核验的 SLIC 工作簿导出发布，覆盖 ${cityCount} 座城市；五大支柱内含 ${scoredCount} 条计分指标，另设 ${diagnosticCount} 条可见诊断指标。每张城市卡片都保留回溯该城市发布分数的路径。`
        : `This board is published from the verified SLIC workbook export. ${cityCount} cities are shown across five pillars composed of ${scoredCount} scored metric lines plus ${diagnosticCount} visible diagnostics, and each city card keeps the trace back to the published score.`;

  return (
    <article className="ranking-integrity-banner" role="note" aria-live="polite">
      <p className="panel-label">{copy.eyebrow}</p>
      <h3>{title}</h3>
      <p>{body}</p>
      <strong>{copy.note}</strong>
      <p className="ranking-integrity-meta">{meta}</p>
    </article>
  );
}
