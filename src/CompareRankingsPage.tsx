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

/* ─── Billionaire capital vs livability: cities present in both datasets ─── */
/* tfr = country-level total fertility rate, 2023 (UN / World Bank) */
const BILLI_DATA: Array<{
  name: string; b: number; s: number; tfr: number;
  labeled: boolean; hero?: boolean;
  lx: number; ly: number; la: string;
}> = [
  { name: "New York",   b: 146, s: 66.4, tfr: 1.62, labeled: true,  lx:  9, ly:  4, la: "start" },
  { name: "Shenzhen",   b: 132, s: 43.7, tfr: 1.09, labeled: true,  lx:  0, ly: -9, la: "middle" },
  { name: "Shanghai",   b: 120, s: 42.3, tfr: 1.09, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "London",     b: 102, s: 65.6, tfr: 1.49, labeled: true,  lx: -9, ly:  4, la: "end" },
  { name: "Moscow",     b:  82, s: 31.4, tfr: 1.41, labeled: true,  lx:  0, ly: 14, la: "middle" },
  { name: "Hangzhou",   b:  64, s: 42.6, tfr: 1.09, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Singapore",  b:  51, s: 62.8, tfr: 1.04, labeled: true,  lx:  9, ly:  4, la: "start" },
  { name: "São Paulo",  b:  51, s: 45.5, tfr: 1.77, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Taipei",     b:  49, s: 61.2, tfr: 0.87, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Paris",      b:  44, s: 53.2, tfr: 1.68, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Guangzhou",  b:  41, s: 45.1, tfr: 1.09, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Bangkok",    b:  38, s: 53.7, tfr: 1.32, labeled: true,  lx:  9, ly:  4, la: "start", hero: true },
  { name: "Tokyo",      b:  31, s: 60.4, tfr: 1.20, labeled: true,  lx:  0, ly: -9, la: "middle" },
  { name: "Bengaluru",  b:  30, s: 36.2, tfr: 2.03, labeled: false, lx:  0, ly:  0, la: "middle" },
  { name: "Milan",      b:  29, s: 61.2, tfr: 1.24, labeled: false, lx:  0, ly:  0, la: "middle" },
];
/* TFR quadrant thresholds (used for generational optimism section) */
const TFR_HIGH = 1.5;   // above = "hopeful" signal (below replacement but meaningfully above sub-1.5)
const BILLI_HIGH = 55;  // billionaires

/* ─── European NUTS-2 top-10 by regional GDP, 2021 (Eurostat / ONS via Visual Capitalist) ─── */
/* bb = inside the Blue Banana corridor (London → Rhine → Milan) */
const EU_NUTS2: Array<{ rank: number; region: string; anchor: string; gdp: number; bb: boolean }> = [
  { rank:  1, region: "Île-de-France",        anchor: "Paris",           gdp: 866, bb: false },
  { rank:  2, region: "Lombardy",             anchor: "Milan",           gdp: 721, bb: true  },
  { rank:  3, region: "Upper Bavaria",        anchor: "Munich",          gdp: 507, bb: true  },
  { rank:  4, region: "Eastern Midlands",     anchor: "London area",     gdp: 358, bb: true  },
  { rank:  5, region: "Community of Madrid",  anchor: "Madrid",          gdp: 316, bb: false },
  { rank:  6, region: "Catalonia",            anchor: "Barcelona",       gdp: 308, bb: false },
  { rank:  7, region: "Rhône-Alpes",          anchor: "Lyon",            gdp: 298, bb: false },
  { rank:  8, region: "Stockholm",            anchor: "Stockholm",       gdp: 281, bb: false },
  { rank:  9, region: "Düsseldorf",           anchor: "Düsseldorf",      gdp: 270, bb: true  },
  { rank: 10, region: "Darmstadt",            anchor: "Frankfurt area",  gdp: 267, bb: true  },
];

/* ─── Asian corridor analogs to the Blue Banana ─── */
const ASIAN_CORRIDORS: Array<{
  name: string; nameEn: string; cities: string;
  gdpNote: string; role: string; hero?: boolean;
}> = [
  {
    name: "East Asian Pacific Rim",
    nameEn: "East Asian Pacific Rim",
    cities: "Tokyo → Seoul → Shanghai → Hong Kong → Shenzhen → Singapore",
    gdpNote: "~$12T combined metro GDP",
    role: "anchor chain",
  },
  {
    name: "South Asian Arc",
    nameEn: "South Asian Arc",
    cities: "Mumbai → Bangalore → Hyderabad → Chennai",
    gdpNote: "~$1.2T combined metro GDP",
    role: "emerging",
  },
  {
    name: "ASEAN Mainland",
    nameEn: "ASEAN Mainland",
    cities: "Bangkok / EEC → Phnom Penh → Ho Chi Minh City",
    gdpNote: "~$0.5T combined metro GDP",
    role: "gateway",
    hero: true,
  },
];
/* SVG scatter layout constants */
const SML = 60, SMR = 25, SMT = 35, SMB = 50, SW = 640, SH = 370;
const SPW = SW - SML - SMR, SPH = SH - SMT - SMB;
function scX(b: number): number { return SML + (b / 155) * SPW; }
function scY(s: number): number { return SMT + (1 - s / 100) * SPH; }
const SREF_Y = scY(53);  // SLIC ≈ 53 reference
const SREF_X = scX(52);  // billionaire cluster boundary

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

      {/* ═══════ 07. BILLIONAIRE CAPITAL SCATTER ═══════ */}
      <section className="compare-scatter-section section">
        <h2 className="compare-section-title">
          {t(locale, "Capital gravity vs. livability", "แรงดึงดูดทุนกับคุณภาพชีวิต", "资本引力与宜居性", "자본 중력 대 생활가능성", "資本重力と宜住性")}
        </h2>
        <p className="compare-section-sub">
          {t(locale,
            "15 cities that appear in both the 2026 Forbes Billionaires list and the SLIC dataset — each plotted by billionaire count (x) and SLIC livability score (y). The shape of the cloud is the editorial.",
            "15 เมืองที่ปรากฏในทั้งรายชื่อมหาเศรษฐีฟอร์บส 2026 และฐานข้อมูล SLIC — แต่ละจุดแสดงจำนวนมหาเศรษฐี (แกน x) และคะแนนคุณภาพชีวิต SLIC (แกน y)",
            "15个同时出现在2026年福布斯富豪榜和SLIC数据集中的城市 — 按亿万富翁数量（x轴）和SLIC宜居得分（y轴）绘制。",
            "2026년 포브스 억만장자 명단과 SLIC 데이터셋 양쪽에 등장하는 15개 도시 — 억만장자 수(x)와 SLIC 생활가능성 점수(y)로 표시.",
            "2026年フォーブス長者番付とSLICデータセット両方に登場する15都市 — 億万長者数（x）とSLIC宜住スコア（y）でプロット。"
          )}
        </p>
        <div className="compare-scatter-wrap">
          <svg viewBox={`0 0 ${SW} ${SH}`} role="img" aria-label="Scatter chart: billionaire count vs SLIC livability score" style={{ display: "block", width: "100%", maxWidth: "640px", margin: "0 auto" }}>
            <rect x="0" y="0" width={SW} height={SH} fill="#1c1914" />
            {/* Grid */}
            {[0, 25, 50, 75, 100].map(s => (
              <line key={`gy${s}`} x1={SML} x2={SW - SMR} y1={scY(s)} y2={scY(s)} stroke="#f8f5f0" strokeWidth="0.5" strokeOpacity="0.1" />
            ))}
            {[0, 40, 80, 120, 155].map(b => (
              <line key={`gx${b}`} x1={scX(b)} x2={scX(b)} y1={SMT} y2={SH - SMB} stroke="#f8f5f0" strokeWidth="0.5" strokeOpacity="0.1" />
            ))}
            {/* Reference lines */}
            <line x1={SML} x2={SW - SMR} y1={SREF_Y} y2={SREF_Y} stroke="#b85c28" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" />
            <line x1={SREF_X} x2={SREF_X} y1={SMT} y2={SH - SMB} stroke="#b85c28" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" />
            {/* Quadrant labels */}
            <text x={SML + 8} y={SMT + 15} fill="#f8f5f0" fillOpacity="0.18" fontSize="8" fontFamily="'JetBrains Mono', monospace">LIVABLE · UNDERSTATED</text>
            <text x={SREF_X + 8} y={SMT + 15} fill="#f8f5f0" fillOpacity="0.18" fontSize="8" fontFamily="'JetBrains Mono', monospace">CAPITAL + QUALITY</text>
            <text x={SML + 8} y={SH - SMB - 8} fill="#f8f5f0" fillOpacity="0.18" fontSize="8" fontFamily="'JetBrains Mono', monospace">LIMITED CAPITAL</text>
            <text x={SREF_X + 8} y={SH - SMB - 8} fill="#f8f5f0" fillOpacity="0.18" fontSize="8" fontFamily="'JetBrains Mono', monospace">BILLIONAIRE FACTORIES</text>
            {/* Dots */}
            {BILLI_DATA.map(d => (
              <circle key={d.name} cx={scX(d.b)} cy={scY(d.s)}
                r={d.hero ? 7 : 5}
                fill={d.hero ? "#b85c28" : "#f8f5f0"}
                fillOpacity={d.hero ? 1 : 0.55}
              />
            ))}
            {/* Labels */}
            {BILLI_DATA.filter(d => d.labeled).map(d => (
              <text key={`lbl${d.name}`}
                x={scX(d.b) + d.lx}
                y={scY(d.s) + d.ly}
                fill={d.hero ? "#b85c28" : "#f8f5f0"}
                fillOpacity={d.hero ? 1 : 0.7}
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                textAnchor={d.la}
              >
                {d.name}
              </text>
            ))}
            {/* Axis ticks */}
            {[0, 40, 80, 120, 155].map(b => (
              <text key={`xt${b}`} x={scX(b)} y={SH - SMB + 16} fill="#f8f5f0" fillOpacity="0.35" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">{b}</text>
            ))}
            {[0, 25, 50, 75, 100].map(s => (
              <text key={`yt${s}`} x={SML - 6} y={scY(s) + 3} fill="#f8f5f0" fillOpacity="0.35" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="end">{s}</text>
            ))}
            {/* Axis captions */}
            <text x={SW / 2} y={SH - 6} fill="#f8f5f0" fillOpacity="0.3" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">BILLIONAIRES (VISUAL CAPITALIST / VORONOI, 2026)</text>
            <text x={14} y={SMT + SPH / 2} fill="#f8f5f0" fillOpacity="0.3" fontSize="9" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" transform={`rotate(-90 14 ${SMT + SPH / 2})`}>SLIC SCORE</text>
          </svg>
        </div>
        <p className="compare-scatter-note">
          {t(locale,
            "The top-left cluster — Tokyo, Milan, Taipei, Singapore — achieves high SLIC scores with modest billionaire counts. The bottom-right cluster shows Chinese cities whose extraordinary capital concentration is not matched by livability metrics. Bangkok sits at the median: more economic gravity than its regional peers, with livability headroom that makes it the city to watch.",
            "กลุ่มซ้ายบน — โตเกียว มิลาน ไทเป สิงคโปร์ — บรรลุคะแนน SLIC สูงด้วยจำนวนมหาเศรษฐีที่ไม่มาก กลุ่มขวาล่างแสดงเมืองจีนที่มีการกระจุกตัวของทุนมหาศาลแต่ไม่สะท้อนในตัวชี้วัดคุณภาพชีวิต กรุงเทพฯ อยู่ที่จุดกึ่งกลาง: มีแรงดึงดูดทางเศรษฐกิจมากกว่าเพื่อนบ้านในภูมิภาค พร้อมศักยภาพคุณภาพชีวิตที่ยังมีห้องให้เติบโต",
            "左上角群体——东京、米兰、台北、新加坡——以较少的亿万富翁实现了高SLIC得分。右下角群体显示中国城市拥有非凡的资本集中度，但未能在宜居指标上得到体现。曼谷处于中间位置：比地区同行有更强的经济引力，但宜居性仍有提升空间。",
            "왼쪽 상단 그룹 — 도쿄, 밀라노, 타이베이, 싱가포르 — 은 적은 수의 억만장자로 높은 SLIC 점수를 달성합니다. 오른쪽 하단 그룹은 엄청난 자본 집중이 생활가능성 지표에 반영되지 않는 중국 도시들을 보여줍니다. 방콕은 중간 지점에 위치합니다.",
            "左上のクラスター（東京、ミラノ、台北、シンガポール）は、少ない億万長者数で高いSLICスコアを達成しています。右下のクラスターは、驚異的な資本集中が宜住指標に反映されていない中国の都市を示しています。バンコクは中央に位置しています。"
          )}
        </p>
      </section>

      {/* ═══════ 08. GENERATIONAL OPTIMISM — TFR × CAPITAL ═══════ */}
      <section className="compare-tfr-section section">
        <h2 className="compare-section-title">
          {t(locale, "Capital × future: generational optimism", "ทุน × อนาคต: ความหวังของคนรุ่นใหม่", "资本 × 未来：世代乐观主义", "자본 × 미래: 세대적 낙관주의", "資本 × 未来：世代的楽観主義")}
        </h2>
        <p className="compare-section-sub">
          {t(locale,
            "Total fertility rate (UN/World Bank, 2023) for the 15 cities in both the billionaire and SLIC datasets. Cities above 1.5 TFR are making a revealed-preference bet on the future; below 1.5, the demographic signal is cautionary. Replacement rate is 2.1.",
            "อัตราเจริญพันธุ์รวม (UN/World Bank, 2023) สำหรับ 15 เมืองในชุดข้อมูลทั้งมหาเศรษฐีและ SLIC เมืองที่มี TFR สูงกว่า 1.5 กำลังแสดงการเดิมพันที่เปิดเผยต่ออนาคต ต่ำกว่า 1.5 สัญญาณประชากรเป็นการเตือน",
            "15个同时在亿万富翁和SLIC数据集中的城市的总和生育率（联合国/世界银行，2023年）。TFR高于1.5的城市正在对未来做出显性偏好押注；低于1.5，人口信号是警示性的。替代率为2.1。",
            "억만장자 및 SLIC 데이터셋에 있는 15개 도시의 총합계출산율(UN/세계은행, 2023). TFR 1.5 이상은 미래에 대한 선호 베팅을 나타냅니다.",
            "億万長者とSLICデータセット両方に含まれる15都市の合計特殊出生率（UN/世界銀行、2023年）。TFR1.5以上の都市は未来への投票を示しています。"
          )}
        </p>

        {/* 4-quadrant grid */}
        <div className="compare-tfr-grid">
          {/* Q1: Capital + Future */}
          <article className="compare-tfr-card compare-tfr-card--q1">
            <p className="compare-tfr-card-label">{t(locale, "Capital + Future", "ทุน + อนาคต", "资本 + 未来", "자본 + 미래", "資本 + 未来")}</p>
            <p className="compare-tfr-card-sub">{t(locale, "TFR ≥ 1.5 · Billionaires ≥ 55", "TFR ≥ 1.5 · มหาเศรษฐี ≥ 55", "TFR ≥ 1.5 · 亿万富翁 ≥ 55", "TFR ≥ 1.5 · 억만장자 ≥ 55", "TFR ≥ 1.5 · 億万長者 ≥ 55")}</p>
            <div className="compare-tfr-cities">
              {BILLI_DATA.filter(d => d.tfr >= TFR_HIGH && d.b >= BILLI_HIGH).map(d => (
                <span key={d.name} className="compare-tfr-city">{d.name} <em>{d.tfr.toFixed(2)}</em></span>
              ))}
            </div>
            <p className="compare-tfr-note">{t(locale, "Rare. Capital accumulation and demographic optimism co-existing.", "หายาก ทุนสะสมและความหวังทางประชากรศาสตร์อยู่ร่วมกัน", "罕见。资本积累与人口乐观主义共存。", "드뭅니다. 자본 축적과 인구 낙관주의의 공존.", "希少。資本蓄積と人口的楽観主義の共存。")}</p>
          </article>

          {/* Q2: Future Momentum */}
          <article className="compare-tfr-card compare-tfr-card--q2">
            <p className="compare-tfr-card-label">{t(locale, "Future Momentum", "แรงขับเคลื่อนอนาคต", "未来动力", "미래 모멘텀", "未来の勢い")}</p>
            <p className="compare-tfr-card-sub">{t(locale, "TFR ≥ 1.5 · Billionaires < 55", "TFR ≥ 1.5 · มหาเศรษฐี < 55", "TFR ≥ 1.5 · 亿万富翁 < 55", "TFR ≥ 1.5 · 억만장자 < 55", "TFR ≥ 1.5 · 億万長者 < 55")}</p>
            <div className="compare-tfr-cities">
              {BILLI_DATA.filter(d => d.tfr >= TFR_HIGH && d.b < BILLI_HIGH).map(d => (
                <span key={d.name} className="compare-tfr-city">{d.name} <em>{d.tfr.toFixed(2)}</em></span>
              ))}
            </div>
            <p className="compare-tfr-note">{t(locale, "Future-betting without corresponding capital concentration.", "เดิมพันกับอนาคตโดยไม่มีการกระจุกตัวของทุนที่สอดคล้องกัน", "对未来押注，但没有相应的资本集中。", "자본 집중 없이 미래에 베팅.", "相応の資本集中なしで未来に賭ける。")}</p>
          </article>

          {/* Q3: Wealth Without Future */}
          <article className="compare-tfr-card compare-tfr-card--q3">
            <p className="compare-tfr-card-label">{t(locale, "Wealth Without Future", "ความมั่งคั่งไร้อนาคต", "没有未来的财富", "미래 없는 부", "未来なき富")}</p>
            <p className="compare-tfr-card-sub">{t(locale, "TFR < 1.5 · Billionaires ≥ 55", "TFR < 1.5 · มหาเศรษฐี ≥ 55", "TFR < 1.5 · 亿万富翁 ≥ 55", "TFR < 1.5 · 억만장자 ≥ 55", "TFR < 1.5 · 億万長者 ≥ 55")}</p>
            <div className="compare-tfr-cities">
              {BILLI_DATA.filter(d => d.tfr < TFR_HIGH && d.b >= BILLI_HIGH).map(d => (
                <span key={d.name} className="compare-tfr-city">{d.name} <em>{d.tfr.toFixed(2)}</em></span>
              ))}
            </div>
            <p className="compare-tfr-note">{t(locale, "Capital without renewal. The largest cluster of cities in this dataset.", "ทุนโดยไม่มีการต่ออายุ กลุ่มเมืองที่ใหญ่ที่สุดในชุดข้อมูลนี้", "没有更新的资本。该数据集中最大的城市集群。", "갱신 없는 자본. 이 데이터셋에서 가장 큰 도시 클러스터.", "更新なき資本。このデータセットで最大の都市クラスター。")}</p>
          </article>

          {/* Q4: Demographic Headwind */}
          <article className="compare-tfr-card compare-tfr-card--q4">
            <p className="compare-tfr-card-label">{t(locale, "Demographic Headwind", "แรงต้านประชากรศาสตร์", "人口逆风", "인구통계학적 역풍", "人口学的逆風")}</p>
            <p className="compare-tfr-card-sub">{t(locale, "TFR < 1.5 · Billionaires < 55", "TFR < 1.5 · มหาเศรษฐี < 55", "TFR < 1.5 · 亿万富翁 < 55", "TFR < 1.5 · 억만장자 < 55", "TFR < 1.5 · 億万長者 < 55")}</p>
            <div className="compare-tfr-cities">
              {BILLI_DATA.filter(d => d.tfr < TFR_HIGH && d.b < BILLI_HIGH).map(d => (
                <span key={d.name} className={`compare-tfr-city${d.hero ? " compare-tfr-city--hero" : ""}`}>{d.name} <em>{d.tfr.toFixed(2)}</em></span>
              ))}
            </div>
            <p className="compare-tfr-note">{t(locale, "Below-replacement TFR with modest capital gravity. Bangkok sits here alongside Tokyo, Milan, and Taipei — a city with more economic weight than its demographic signal suggests.", "TFR ต่ำกว่าอัตราทดแทนพร้อมแรงดึงดูดทุนที่พอประมาณ กรุงเทพฯ อยู่ที่นี่ร่วมกับโตเกียว มิลาน และไทเป", "低于替代率的TFR，资本引力有限。曼谷与东京、米兰、台北并列——一座经济分量超过其人口信号的城市。", "보충 TFR 이하에 자본 중력이 낮습니다. 방콕은 도쿄, 밀라노, 타이베이와 함께 여기 위치합니다.", "補充TFR以下で資本重力は控えめ。バンコクは東京、ミラノ、台北とともにここに位置しています。")}</p>
          </article>
        </div>
        <p className="compare-scatter-note">
          {t(locale,
            "TFR source: UN World Population Prospects 2024 / World Bank WDI (country-level). 5-year trend for all 15 cities is declining — none of the plotted countries has reversed its fertility trajectory since 2018. The China curve (peaked 1.41b in 2023, projected to return to 600m by 2100) is the extreme case Thailand is watching 20 years behind.",
            "ที่มา TFR: UN World Population Prospects 2024 / World Bank WDI (ระดับประเทศ) แนวโน้ม 5 ปีของทั้ง 15 เมืองกำลังลดลง — ไม่มีประเทศใดในกราฟที่พลิกกลับวิถีเจริญพันธุ์ตั้งแต่ปี 2018",
            "TFR来源：联合国人口展望2024 / 世界银行WDI（国家层面）。全部15个城市的5年趋势均下降——自2018年以来，没有一个国家逆转了其生育率轨迹。",
            "TFR 출처: UN 세계 인구 전망 2024 / 세계은행 WDI (국가 수준). 15개 도시 모두 5년 추세가 하락 중.",
            "TFR出典：国連世界人口予測2024/世界銀行WDI（国レベル）。15都市すべての5年トレンドは下降中。"
          )}
        </p>
      </section>

      {/* ═══════ 09. ECONOMIC CORRIDOR MEMBERSHIP — BLUE BANANA LENS ═══════ */}
      <section className="compare-corridor-section section">
        <h2 className="compare-section-title">
          {t(locale, "Economic corridor membership", "การเป็นสมาชิกเส้นทางเศรษฐกิจ", "经济走廊成员资格", "경제 회랑 소속", "経済回廊の所属")}
        </h2>
        <p className="compare-section-sub">
          {t(locale,
            "The Blue Banana — London → Amsterdam → Rhine → Milan — hosts over half of Europe's top-20 NUTS-2 regional economies. The corridor lens asks a question no single-city index does: is this city inside a megalopolitan economic corridor, or outside one?",
            "บลูบานาน่า — ลอนดอน → อัมสเตอร์ดัม → ไรน์ → มิลาน — เป็นที่ตั้งของมากกว่าครึ่งหนึ่งของ 20 ภูมิภาคเศรษฐกิจ NUTS-2 อันดับต้นๆ ของยุโรป",
            "蓝香蕉——伦敦→阿姆斯特丹→莱茵河→米兰——拥有欧洲前20个NUTS-2区域经济体的一半以上。走廊视角提出了单城市指数无法回答的问题：这座城市是否位于大都市经济走廊内？",
            "블루 바나나 — 런던 → 암스테르담 → 라인강 → 밀라노 — 유럽 상위 20개 NUTS-2 지역 경제의 절반 이상을 차지합니다.",
            "ブルーバナナ — ロンドン → アムステルダム → ライン → ミラノ — はヨーロッパのNUTS-2上位20地域経済の半数以上を擁しています。"
          )}
        </p>

        {/* EU NUTS-2 table */}
        <div className="compare-corridor-table-wrap">
          <table className="compare-corridor-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t(locale, "Region", "ภูมิภาค", "地区", "지역", "地域")}</th>
                <th>{t(locale, "Anchor city", "เมืองหลัก", "锚定城市", "앵커 도시", "アンカー都市")}</th>
                <th>GDP €B <span style={{ fontWeight: 400, opacity: 0.6 }}>(2021)</span></th>
                <th>{t(locale, "Corridor", "เส้นทาง", "走廊", "회랑", "回廊")}</th>
              </tr>
            </thead>
            <tbody>
              {EU_NUTS2.map(r => (
                <tr key={r.rank}>
                  <td>{r.rank}</td>
                  <td>{r.region}</td>
                  <td style={{ color: "var(--text-soft)" }}>{r.anchor}</td>
                  <td>{r.gdp}</td>
                  <td>{r.bb ? <span className="compare-corridor-bb">Blue Banana</span> : <span style={{ color: "var(--text-soft)", fontSize: "11px" }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="compare-scatter-note" style={{ marginTop: "0.75rem" }}>
            {t(locale,
              "Source: Eurostat / Office for National Statistics via Visual Capitalist / Voronoi, 2021 GDP at current prices. NUTS-2 data carries a 2–3 year publication lag — 2023 figures should be available from Eurostat by mid-2026.",
              "ที่มา: Eurostat / สำนักงานสถิติแห่งชาติสหราชอาณาจักร ผ่าน Visual Capitalist / Voronoi ข้อมูล GDP ปี 2021 ราคาปัจจุบัน ข้อมูล NUTS-2 มีความล่าช้าในการเผยแพร่ 2–3 ปี",
              "来源：欧盟统计局/英国国家统计局，经Visual Capitalist/Voronoi，2021年当前价格GDP。NUTS-2数据有2-3年的发布滞后期。",
              "출처: Eurostat/영국 국가통계국, Visual Capitalist/Voronoi 경유, 2021년 현재 가격 GDP.",
              "出典：ユーロスタット/英国国家統計局、Visual Capitalist/Voronoi経由、2021年現在価格GDP。"
            )}
          </p>
        </div>

        {/* Asian corridor cards */}
        <h3 className="compare-corridor-subtitle">
          {t(locale, "Asian corridor analogs", "เส้นทางเศรษฐกิจเอเชียที่เทียบเท่า", "亚洲走廊类比", "아시아 회랑 유사체", "アジア回廊の類似体")}
        </h3>
        <div className="compare-corridor-cards">
          {ASIAN_CORRIDORS.map(c => (
            <article key={c.nameEn} className={`compare-corridor-card${c.hero ? " compare-corridor-card--hero" : ""}`}>
              <p className="compare-corridor-card-label">{c.name}</p>
              <p className="compare-corridor-card-cities">{c.cities}</p>
              <div className="compare-corridor-card-meta">
                <span className="compare-corridor-card-gdp">{c.gdpNote}</span>
                <span className="compare-corridor-card-role">{c.role}</span>
              </div>
              {c.hero && (
                <p className="compare-corridor-card-note">
                  {t(locale,
                    "Bangkok sits at the western anchor of this corridor — the EEC (Eastern Economic Corridor) is its special economic zone. Analogous to Milan at the southern tip of the Blue Banana: a gateway city between a developed corridor and the periphery.",
                    "กรุงเทพฯ อยู่ที่จุดยึดทางตะวันตกของเส้นทางนี้ — EEC (เขตพัฒนาพิเศษภาคตะวันออก) คือเขตเศรษฐกิจพิเศษ เทียบได้กับมิลานที่ปลายใต้ของบลูบานาน่า: เมืองประตูระหว่างเส้นทางที่พัฒนาแล้วกับเขตรอบนอก",
                    "曼谷位于该走廊的西部锚点——EEC（东部经济走廊）是其经济特区。类似于蓝香蕉南端的米兰：一座连接发达走廊与外围地区的门户城市。",
                    "방콕은 이 회랑의 서쪽 앵커에 위치합니다 — EEC(동부경제회랑)가 경제특구입니다. 블루 바나나 남단의 밀라노와 유사합니다.",
                    "バンコクはこの回廊の西端アンカーに位置しています — EEC（東部経済回廊）がその経済特区です。ブルーバナナ南端のミラノに類似しています。"
                  )}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
