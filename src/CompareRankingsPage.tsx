import { useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import SiteFooter from "./SiteFooter";
import publishedData from "./data/publishedRankingData.json";
import { t } from "./i18n";
import { appHref } from "./routing";
import { scoreCityWithWeights } from "./scoring";
import {
  INDEX_PROFILES,
  COMPARE_HERO,
  SLIC_DIFFERENCE,
  ECHO_CHAMBER_NOTES,
  MASTERCARD_GDCI_2019,
} from "./compareRankingsData";
import type { Locale, SitePath } from "./types";

/* ── Pillar config (same as HomePage) ── */
type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";
const PILLAR_COLORS: Record<PillarId, string> = { pressure: "#b85c28", viability: "#1a6b5a", capability: "#2a5a8c", community: "#8c4a2a", creative: "#a0382a" };
const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
  ko: { pressure: "성장", viability: "생활가능성", capability: "역량", community: "커뮤니티", creative: "창의성" },
  ja: { pressure: "成長", viability: "生活持続性", capability: "能力", community: "コミュニティ", creative: "創造性" },
};
const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
// Default state: SLIC's canonical weights (25/22/18/15/20). When users land
// here they should see SLIC's published top 10 in the leftmost column —
// matching what they see on the homepage and rankings page. The reset
// button returns to the canonical baseline; users can move sliders toward
// equal weights or any other profile from there.
const CANONICAL_WEIGHTS = publishedData.canonicalWeights as Record<PillarId, number>;

interface PublishedCity {
  cityId: string; displayName: string; country: string; region: string; rankingStatus: string;
  pressureScore: number; viabilityScore: number; capabilityScore: number; communityScore: number; creativeScore: number; slicScore: number; rank: number;
  tierLabel?: "Alpha" | "Beta" | "Gamma" | null;
}
const rankedCities = ((publishedData.cities ?? []) as PublishedCity[]).filter((c) => c.rankingStatus === "Ranked");

/** AMPI across pillars — matches the published SLIC aggregation. */
function scoreCity(city: PublishedCity, weights: Record<PillarId, number>): number {
  return scoreCityWithWeights({
    pressure: city.pressureScore,
    viability: city.viabilityScore,
    capability: city.capabilityScore,
    community: city.communityScore,
    creative: city.creativeScore,
  }, weights);
}


function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

/* ── Overlap computation (dynamic) ── */
function computeOverlaps(slicTop10Names: string[]) {
  const cityMap = new Map<string, string[]>();
  for (const profile of INDEX_PROFILES) {
    for (const c of profile.topCities.slice(0, 10)) {
      const key = c.city.toLowerCase();
      if (!cityMap.has(key)) cityMap.set(key, []);
      cityMap.get(key)!.push(profile.shortName);
    }
  }
  for (const name of slicTop10Names) {
    const key = name.toLowerCase();
    if (!cityMap.has(key)) cityMap.set(key, []);
    cityMap.get(key)!.push("SLIC");
  }
  return cityMap;
}

function currentPublishedCity(name: string): PublishedCity | undefined {
  return rankedCities.find((city) => city.displayName.toLowerCase() === name.toLowerCase());
}

function buildLiveEchoNote(city: PublishedCity, locale: Locale): string {
  const pillars = (["pressure", "viability", "capability", "community", "creative"] as PillarId[])
    .map((id) => ({
      en: PILLAR_LABELS.en[id],
      th: PILLAR_LABELS.th[id],
      zh: PILLAR_LABELS.zh[id],
      ko: PILLAR_LABELS.ko[id],
      ja: PILLAR_LABELS.ja[id],
      score: city[`${id}Score` as keyof PublishedCity] as number,
    }))
    .sort((left, right) => left.score - right.score);
  const weakest = pillars[0];
  const secondWeakest = pillars[1];
  const strongest = [...pillars].sort((left, right) => right.score - left.score)[0];
  const tierContext = city.tierLabel
    ? t(locale, `public ${city.tierLabel} tier`, `ชั้น ${city.tierLabel} สาธารณะ`, `公开 ${city.tierLabel} 层`, `공개 ${city.tierLabel} 등급`, `公開${city.tierLabel}層`)
    : t(locale, "public top tiers", "ชั้นสาธารณะบนสุด", "公开高层级", "공개 최상위 등급", "公開最上位層");

  return t(
    locale,
    `SLIC #${city.rank}. ${strongest.en} remains strong at ${strongest.score.toFixed(1)}, but ${weakest.en} (${weakest.score.toFixed(1)}) and ${secondWeakest.en} (${secondWeakest.score.toFixed(1)}) are the main drag on ${city.displayName}'s standing in the ${tierContext}.`,
    `SLIC อันดับ #${city.rank} จุดแข็งสุดคือ ${strongest.th} ที่ ${strongest.score.toFixed(1)} แต่ ${weakest.th} (${weakest.score.toFixed(1)}) และ ${secondWeakest.th} (${secondWeakest.score.toFixed(1)}) เป็นตัวถ่วงหลักต่อสถานะของ ${city.displayName} ใน ${tierContext}`,
    `SLIC 第 ${city.rank} 名。${strongest.zh} 仍然很强（${strongest.score.toFixed(1)}），但 ${weakest.zh}（${weakest.score.toFixed(1)}）与 ${secondWeakest.zh}（${secondWeakest.score.toFixed(1)}）是拖累 ${city.displayName} 在 ${tierContext} 中位置的主要因素。`,
    `SLIC ${city.rank}위. ${strongest.ko}이(가) ${strongest.score.toFixed(1)}으로 강세를 유지하고 있지만, ${weakest.ko}(${weakest.score.toFixed(1)})와 ${secondWeakest.ko}(${secondWeakest.score.toFixed(1)})이 ${city.displayName}의 ${tierContext} 내 순위를 끌어내리는 주요 요인입니다.`,
    `SLIC ${city.rank}位。${strongest.ja}は${strongest.score.toFixed(1)}と引き続き強いですが、${weakest.ja}（${weakest.score.toFixed(1)}）と${secondWeakest.ja}（${secondWeakest.score.toFixed(1)}）が${city.displayName}の${tierContext}内での位置を押し下げる主な要因となっています。`,
  );
}

export default function CompareRankingsPage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const labels = PILLAR_LABELS[locale];

  /* ── Spider state ── */
  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: CANONICAL_WEIGHTS[id] })),
  );
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);
  const isCustom = useMemo(() => PILLAR_ORDER.some((id) => weights[id] !== CANONICAL_WEIGHTS[id]), [weights]);

  /* ── Live SLIC results ── */
  const slicResults = useMemo(() =>
    rankedCities.map((c) => ({ ...c, customScore: Math.round(scoreCity(c, weights) * 10) / 10 })).sort((a, b) => b.customScore - a.customScore),
  [weights]);
  const slicTop10 = slicResults.slice(0, 10);

  /* ── Dynamic overlap ── */
  const overlaps = useMemo(() => computeOverlaps(slicTop10.map((c) => c.displayName)), [slicTop10]);
  const establishmentFavorites = useMemo(() => {
    const results: Array<{ city: string; indices: string[]; inSlic: boolean }> = [];
    overlaps.forEach((indices, city) => {
      const nonSlic = indices.filter((i) => i !== "SLIC");
      if (nonSlic.length >= 3) {
        results.push({ city: city.charAt(0).toUpperCase() + city.slice(1), indices: nonSlic, inSlic: indices.includes("SLIC") });
      }
    });
    return results.sort((a, b) => b.indices.length - a.indices.length);
  }, [overlaps]);
  const slicOnly = useMemo(() => slicTop10.filter((c) => {
    const indices = overlaps.get(c.displayName.toLowerCase()) ?? [];
    return indices.filter((i) => i !== "SLIC").length === 0;
  }), [slicTop10, overlaps]);

  /* ── MasterCard GDCI 2019 → SLIC rank lookup (published data, not custom weights) ── */
  const mastercardWithSlic = useMemo(() => {
    return MASTERCARD_GDCI_2019.map((mc) => {
      const match = rankedCities.find(
        (c) => c.displayName.toLowerCase() === mc.city.toLowerCase(),
      );
      return {
        ...mc,
        slicRank: match?.rank ?? null,
        slicScore: match?.slicScore ?? null,
      };
    });
  }, []);

  /* ── Published SLIC top 10 (fixed weights, never changes with spider) ── */
  const publishedTop10 = useMemo(
    () => [...rankedCities].sort((a, b) => a.rank - b.rank).slice(0, 10),
    [],
  );
  const singapore = currentPublishedCity("Singapore");
  const paris = currentPublishedCity("Paris");

  const handleReset = () => setPillars(PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: CANONICAL_WEIGHTS[id] })));

  return (
    <>
      {/* ═══════ 01. HERO ═══════ */}
      <header className="compare-hero">
        <div className="compare-hero-inner section">
          <p className="compare-overline">{(COMPARE_HERO[locale] ?? COMPARE_HERO.en).eyebrow}</p>
          <h1 className="compare-hero-title">{(COMPARE_HERO[locale] ?? COMPARE_HERO.en).title}</h1>
          <p className="compare-hero-thesis">{(COMPARE_HERO[locale] ?? COMPARE_HERO.en).thesis}</p>
        </div>
      </header>

      {/* ═══════ 02. INTERACTIVE SPIDER + TABLE ═══════ */}
      <section className="compare-interactive">
        <div className="section compare-spider-header">
          <h2 className="compare-section-title">{t(locale, "Drag the spider to rebuild SLIC\u2019s top 10.", "ลากใยแมงมุมเพื่อสร้าง SLIC top 10 ใหม่", "拖动蛛网图重建SLIC前10名", "거미줄을 드래그하여 SLIC 상위 10개를 재구성하세요.", "スパイダーをドラッグしてSLICトップ10を再構築してください。")}</h2>
          <p className="compare-section-sub">{t(locale, "The other seven indices are frozen. Only SLIC responds to your priorities.", "อีกเจ็ดดัชนียังคงเดิม มีแค่ SLIC ที่ตอบสนอง", "其他七个指数固定不变，只有SLIC响应你的优先级", "다른 7개 지수는 고정되어 있습니다. SLIC만 우선순위에 반응합니다.", "他の7つの指数は固定されています。SLICだけがあなたの優先順位に応答します。")}</p>
          <div className="compare-spider-widget">
            <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={360} locale={locale} />
            <div className="compare-spider-controls">
              <button type="button" className="compare-reset-btn" onClick={handleReset}>{t(locale, "Reset to SLIC baseline", "รีเซ็ตเป็นน้ำหนัก SLIC", "重置至 SLIC 基准", "SLIC 기준으로 초기화", "SLICベースラインにリセット")}</button>
              {isCustom && <span className="compare-custom-badge">{t(locale, "Custom weights", "น้ำหนักที่ปรับ", "自定义权重", "커스텀 가중치", "カスタムウェイト")}</span>}
            </div>
          </div>
        </div>

        <div className="compare-matrix-scroll">
          <div
            className="compare-matrix"
            style={{ gridTemplateColumns: `2.2rem 1.3fr ${INDEX_PROFILES.map(() => "1fr").join(" ")}` }}
          >
            {/* ── All cells rendered as a flat list; CSS grid auto-places row by row ── */}
            {[
              // Header row: rank-label + SLIC + all indexes
              <div key="h-0" className="compare-matrix-rank-label" />,
              <div key="h-slic" className="compare-matrix-hd compare-matrix-hd--slic">
                <strong>SLIC V3{isCustom ? ` — ${t(locale, "CUSTOM", "ปรับแล้ว", "自定义", "커스텀", "カスタム")}` : ""}</strong>
                <span>2026 · {rankedCities.length} {t(locale, "cities", "เมือง", "座城市", "개 도시", "都市")} · {t(locale, "LIVE", "สด", "实时", "실시간", "ライブ")}</span>
              </div>,
              ...INDEX_PROFILES.map((profile) => (
                <div key={`h-${profile.id}`} className="compare-matrix-hd" style={{ borderTopColor: profile.accentHex }}>
                  <strong>{profile.shortName}</strong>
                  <span>{profile.year} · {profile.citiesEvaluated} {t(locale, "cities", "เมือง", "座城市", "개 도시", "都市")}</span>
                </div>
              )),
              // Data rows: for each rank i, one rank cell + SLIC cell + all index cells
              ...Array.from({ length: 10 }, (_, i) => {
                const slic = slicTop10[i];
                return [
                  <div key={`rk-${i}`} className="compare-matrix-rank">{i + 1}</div>,
                  <div key={`sc-${i}`} className={`compare-matrix-cell compare-matrix-cell--slic${i % 2 === 0 ? " compare-matrix-row-even" : ""} compare-cell--animated`}>
                    <span className="compare-city">{slic?.displayName}</span>
                    <span className="compare-country">{slic?.country}</span>
                    <span className="compare-score">{slic?.customScore.toFixed(1)}</span>
                  </div>,
                  ...INDEX_PROFILES.map((profile) => {
                    const city = profile.topCities[i];
                    return (
                      <div key={`${profile.id}-${i}`} className={`compare-matrix-cell${i % 2 === 0 ? " compare-matrix-row-even" : ""}`}>
                        <span className="compare-city">{city?.city ?? "—"}</span>
                        <span className="compare-country">{city?.country ?? ""}</span>
                      </div>
                    );
                  }),
                ];
              }).flat(),
            ]}
          </div>
        </div>
      </section>

      {/* ═══════ 02b. MOST VISITED VS MOST LIVABLE ═══════ */}
      <section className="compare-visits section">
        <div className="compare-visits-header">
          <p className="compare-overline">{t(locale, "THE VISIBLE GAP", "ช่องว่างที่มองเห็นได้", "可见的差距", "눈에 보이는 격차", "可視化されたギャップ")}</p>
          <h2 className="compare-section-title">{t(locale, "Most visited vs most livable", "เมืองที่คนเที่ยวมากสุด เทียบกับเมืองที่อยู่ได้จริง", "最受游客欢迎 vs 最宜居", "가장 많이 방문된 도시 vs 가장 살기 좋은 도시", "最も訪問される都市 vs 最も住みやすい都市")}</h2>
          <p className="compare-section-sub">{t(
            locale,
            "Every other index measures visitor pull or capital attraction. SLIC asks where a resident can actually build a life. The two questions produce completely different answers.",
            "ดัชนีอื่นๆ วัดแรงดึงดูดนักท่องเที่ยวหรือทุน SLIC ถามว่าประชากรจะสร้างชีวิตได้ที่ไหน สองคำถามให้คำตอบที่ต่างกันสิ้นเชิง",
            "其他指数衡量游客吸引力或资本聚集力。SLIC 问的是居民能在哪里真正立足。两个问题给出截然不同的答案。",
            "다른 모든 지수는 방문객 유치력이나 자본 유인력을 측정합니다. SLIC는 주민이 실제로 삶을 꾸릴 수 있는 곳이 어디인지를 묻습니다. 두 질문은 완전히 다른 답을 냅니다.",
            "他のすべての指数は訪問者の引力や資本の吸引力を測定します。SLICは住民が実際に生活を築ける場所はどこかを問います。この2つの問いはまったく異なる答えを生み出します。",
          )}</p>
        </div>

        <div className="compare-visits-grid">
          <div className="compare-visits-col">
            <h3 className="compare-visits-col-header">{t(locale, "Most visited", "เที่ยวมากสุด", "最受游客欢迎", "가장 많이 방문된", "最も訪問される")}</h3>
            <p className="compare-visits-col-source">{t(locale, "MasterCard GDCI 2019", "MasterCard GDCI 2019", "MasterCard GDCI 2019", "MasterCard GDCI 2019", "MasterCard GDCI 2019")}</p>
            {mastercardWithSlic.map((c, i) => (
              <div key={c.city} className={`compare-visits-row${i % 2 === 0 ? " compare-visits-row-even" : ""}`}>
                <span className="compare-visits-rank">{c.rank}</span>
                <div className="compare-visits-city-block">
                  <span className="compare-visits-city">{c.city}</span>
                  <span className="compare-visits-country">{c.country}</span>
                </div>
                <span className="compare-visits-meta">{c.visitorsMillions}M {t(locale, "visits", "ครั้ง", "人次", "방문", "訪問")}</span>
                <span className={c.slicRank ? "compare-visits-slic-tag" : "compare-visits-slic-tag compare-visits-slic-tag--missing"}>
                  {c.slicRank
                    ? `SLIC #${c.slicRank}`
                    : t(locale, "Not in SLIC", "ไม่อยู่ใน SLIC", "未在 SLIC", "SLIC 미포함", "SLICに未掲載")}
                </span>
              </div>
            ))}
          </div>

          <div className="compare-visits-col">
            <h3 className="compare-visits-col-header">{t(locale, "Most livable", "น่าอยู่จริง", "最宜居", "가장 살기 좋은", "最も住みやすい")}</h3>
            <p className="compare-visits-col-source">{t(locale, "SLIC 2026", "SLIC 2026", "SLIC 2026", "SLIC 2026", "SLIC 2026")}</p>
            {publishedTop10.map((c, i) => (
              <div key={c.cityId} className={`compare-visits-row${i % 2 === 0 ? " compare-visits-row-even" : ""}`}>
                <span className="compare-visits-rank">{c.rank}</span>
                <div className="compare-visits-city-block">
                  <span className="compare-visits-city">{c.displayName}</span>
                  <span className="compare-visits-country">{c.country}</span>
                </div>
                <span className="compare-visits-meta">{c.slicScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

          <blockquote className="compare-visits-callout">{t(
            locale,
            `Zero of MasterCard's top 10 most-visited cities clear SLIC's top 10. The closest is Singapore at #${singapore?.rank ?? "—"}. Paris — the world's second most-visited city — ranks #${paris?.rank ?? "—"}. That is not the index missing something. That is the index measuring something different.`,
            `ไม่มีเมืองใดใน 10 อันดับของ MasterCard ที่ติด SLIC top 10 เลย ใกล้สุดคือสิงคโปร์ที่ #${singapore?.rank ?? "—"} ส่วนปารีส — เมืองที่คนเที่ยวมากอันดับ 2 ของโลก — อยู่อันดับ #${paris?.rank ?? "—"} นี่ไม่ใช่ดัชนีที่พลาด แต่เป็นดัชนีที่วัดคนละเรื่อง`,
            `MasterCard 前 10 名中没有一座城市进入 SLIC 前 10。最接近的是新加坡（第 ${singapore?.rank ?? "—"}）。巴黎——全球第二受游客欢迎的城市——在 SLIC 排第 ${paris?.rank ?? "—"}。这不是指数遗漏了什么，这是指数衡量的是另一件事。`,
            `MasterCard 상위 10개 최다 방문 도시 중 SLIC 상위 10위에 오른 도시는 없습니다. 가장 가까운 도시는 ${singapore?.rank ?? "—"}위의 싱가포르입니다. 세계에서 두 번째로 많이 방문된 도시인 파리는 SLIC ${paris?.rank ?? "—"}위입니다. 이것은 지수가 무언가를 놓친 게 아닙니다. 지수가 다른 것을 측정하고 있는 것입니다.`,
            `MasterCardの最多訪問都市トップ10のうち、SLICトップ10に入る都市はありません。最も近いのは${singapore?.rank ?? "—"}位のシンガポールです。世界で2番目に訪問される都市であるパリはSLIC${paris?.rank ?? "—"}位にランクしています。これは指数が何かを見落としているのではありません。指数が別のことを測定しているのです。`,
          )}</blockquote>

        <p className="compare-visits-source-footer">{t(
          locale,
          "Source: MasterCard Global Destination Cities Index 2019 (final published edition, international overnight visitors). SLIC: this study, 2026.",
          "แหล่งข้อมูล: MasterCard Global Destination Cities Index 2019 (ฉบับเผยแพร่สุดท้าย นักท่องเที่ยวค้างคืนระหว่างประเทศ) SLIC: การศึกษานี้ 2026",
          "来源：MasterCard 全球目的地城市指数 2019（最终公开版，国际过夜游客）。SLIC：本研究，2026。",
          "출처: MasterCard 글로벌 목적지 도시 지수 2019 (최종 공개판, 국제 숙박 방문객). SLIC: 본 연구, 2026.",
          "出典：MasterCard グローバル目的地都市指数2019（最終公開版、国際宿泊訪問者）。SLIC：本研究、2026年。",
        )}</p>
      </section>

      {/* ═══════ 03. OVERLAP ANALYSIS (dynamic) ═══════ */}
      <section className="compare-overlap section">
        <h2 className="compare-section-title">{t(locale, "The echo chamber", "ห้องเสียงสะท้อน", "回声室", "반향실", "エコーチェンバー")}</h2>
        <p className="compare-section-sub">{t(locale, "Cities appearing in 3+ establishment top-10 lists — and the specific SLIC factors that tell a different story.", "เมืองที่ติด top 10 ของดัชนีสถาบันอย่างน้อย 3 ดัชนี — และปัจจัย SLIC ที่บอกเล่าเรื่องราวต่างออกไป", "出现在3个以上主流指数前10名的城市——以及SLIC给出不同答案的具体因素", "3개 이상의 기성 지수 상위 10위 목록에 등장한 도시들 — 그리고 SLIC가 다른 이야기를 전하는 구체적인 요인들.", "3つ以上の既存指数のトップ10リストに登場する都市——そしてSLICが異なる物語を語る具体的な要因。")}</p>
        <div className="compare-overlap-grid">
          {establishmentFavorites.map((item) => {
            const note = ECHO_CHAMBER_NOTES[item.city.toLowerCase()];
            const liveCity = currentPublishedCity(item.city);
            const liveSlicRank = liveCity?.rank ?? note?.slicRank;
            const liveNote = liveCity ? buildLiveEchoNote(liveCity, locale) : (note ? (locale === "th" ? note.th : locale === "zh" ? note.zh : locale === "ko" ? note.ko : locale === "ja" ? note.ja : note.en) : null);
            return (
              <div key={item.city} className="compare-overlap-card">
                <div className="compare-overlap-card-header">
                  <strong>{item.city}</strong>
                  {liveSlicRank && (
                    <span className="compare-overlap-slic-rank">
                      {t(locale, `SLIC #${liveSlicRank}`, `SLIC อันดับ ${liveSlicRank}`, `SLIC 第${liveSlicRank}名`, `SLIC ${liveSlicRank}위`, `SLIC ${liveSlicRank}位`)}
                    </span>
                  )}
                </div>
                <span className="compare-overlap-indices">{item.indices.join(", ")}</span>
                <span className={item.inSlic ? "compare-overlap-slic yes" : "compare-overlap-slic no"}>
                  {item.inSlic ? t(locale, "Also in SLIC top 10", "อยู่ใน SLIC top 10 ด้วย", "也在SLIC前10", "SLIC 상위 10에도 포함", "SLICトップ10にも含まれる") : t(locale, "Not in SLIC top 10", "ไม่อยู่ใน SLIC top 10", "不在SLIC前10", "SLIC 상위 10 미포함", "SLICトップ10に含まれない")}
                </span>
                {liveNote && (
                  <p className="compare-overlap-note">
                    {liveNote}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {slicOnly.length > 0 && (
          <div className="compare-slic-exclusive">
            <h3>{t(locale, "Only in SLIC", "มีใน SLIC เท่านั้น", "仅在SLIC中", "SLIC 단독 등재", "SLICのみに掲載")}</h3>
            <p>{t(locale, "These cities rank in SLIC\u2019s top 10 but appear in zero establishment top-10 lists.", "เมืองเหล่านี้อยู่ใน SLIC top 10 แต่ไม่อยู่ในดัชนีสถาบันใดเลย", "这些城市在SLIC前10中但不在任何机构前10中", "이 도시들은 SLIC 상위 10위에 포함되지만 어떤 기성 지수의 상위 10위 목록에도 나타나지 않습니다.", "これらの都市はSLICトップ10にランクインしていますが、既存のどの指数のトップ10リストにも登場しません。")}</p>
            <div className="compare-slic-exclusive-cities">
              {slicOnly.map((c) => (
                <a
                  key={c.cityId}
                  className="compare-slic-chip"
                  href={appHref("/rankings")}
                  onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
                >
                  {c.displayName} <span>{c.country}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════ 04. METHODOLOGY CARDS ═══════ */}
      <section className="compare-methodology section">
        <h2 className="compare-section-title">{t(locale, "What each index actually measures", "แต่ละดัชนีวัดอะไรจริงๆ", "每个指数到底在衡量什么", "각 지수가 실제로 측정하는 것", "各指数が実際に測定するもの")}</h2>
        <div className="compare-meth-grid">
          {INDEX_PROFILES.map((profile) => (
            <article key={profile.id} className="compare-meth-card" style={{ borderTopColor: profile.accentHex }}>
              <div className="compare-meth-header"><strong>{profile.name}</strong><span>{profile.publisher} &middot; {profile.year}</span></div>
              <div className="compare-meth-section"><p className="compare-meth-label">{t(locale, "They claim", "พวกเขาอ้างว่า", "他们声称", "주장하는 내용", "彼らの主張")}</p><p>{profile.methodology.claimedPurpose[locale]}</p></div>
              <div className="compare-meth-section compare-meth-reality"><p className="compare-meth-label">{t(locale, "What it actually measures", "วัดอะไรจริงๆ", "实际衡量什么", "실제로 측정하는 것", "実際に測定するもの")}</p><p>{profile.methodology.actualMeasure[locale]}</p></div>
              <div className="compare-meth-section"><p className="compare-meth-label">{t(locale, "Blind spots", "จุดบอด", "盲点", "사각지대", "盲点")}</p><ul className="compare-blindspots">{profile.methodology.blindSpots[locale].map((b) => <li key={b}>{b}</li>)}</ul></div>
              <div className="compare-meth-audience"><p className="compare-meth-label">{t(locale, "Who it really serves", "รับใช้ใครจริงๆ", "真正服务谁", "실제로 누구를 위한 것인가", "実際に誰のためのものか")}</p><p>{profile.methodology.audienceNote[locale]}</p></div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════ 05. CRITICAL ANALYSIS ═══════ */}
      <section className="compare-critique">
        <div className="section">
          <h2 className="compare-section-title">{t(locale, "The critique", "บทวิจารณ์", "批评", "비판", "批評")}</h2>
          <div className="compare-critique-blocks">
            {INDEX_PROFILES.map((profile) => (
              <article key={profile.id} className="compare-critique-block">
                <p className="compare-critique-eyebrow" style={{ color: profile.accentHex }}>{profile.shortName}</p>
                <h3 className="compare-critique-headline">{profile.critique.headline[locale]}</h3>
                <p className="compare-critique-body">{profile.critique.body[locale]}</p>
              </article>
            ))}
          </div>
          <blockquote className="compare-overarching">{(COMPARE_HERO[locale] ?? COMPARE_HERO.en).overarchingCritique}</blockquote>
        </div>
      </section>

      {/* ═══════ 06. THE SLIC DIFFERENCE ═══════ */}
      <section className="compare-slic-diff section">
        <h2 className="compare-section-title">{t(locale, "What SLIC measures that others refuse to ask", "สิ่งที่ SLIC วัดแต่ดัชนีอื่นไม่กล้าถาม", "SLIC衡量的是其他指数不敢问的问题", "다른 지수들이 묻기를 거부하는 것을 SLIC가 측정합니다", "他の指数が問うことを避けていることをSLICは測定します")}</h2>
        <div className="compare-diff-grid">
          {SLIC_DIFFERENCE.map((item) => (
            <article key={item.title.en} className="compare-diff-card"><h4>{item.title[locale] ?? item.title.en}</h4><p>{item.body[locale] ?? item.body.en}</p></article>
          ))}
        </div>
        <div className="compare-diff-cta">
          <a className="v3-cta" href={appHref("/methodology")} onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>{t(locale, "READ THE FULL METHODOLOGY", "อ่านระเบียบวิธีเต็ม", "阅读完整方法论", "전체 방법론 읽기", "完全な方法論を読む")} &rarr;</a>
          <a className="v3-cta-secondary" href={appHref("/rankings")} onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>{t(locale, "SEE THE SLIC RANKING", "ดูอันดับ SLIC", "查看SLIC排名", "SLIC 순위 보기", "SLICランキングを見る")}</a>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
