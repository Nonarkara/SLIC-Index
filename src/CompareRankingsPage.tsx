import { useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import SiteFooter from "./SiteFooter";
import publishedData from "./data/publishedRankingData.json";
import {
  INDEX_PROFILES,
  COMPARE_HERO,
  SLIC_DIFFERENCE,
} from "./compareRankingsData";
import type { Locale, SitePath } from "./types";

/* ── Pillar config (same as HomePage) ── */
type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";
const PILLAR_COLORS: Record<PillarId, string> = { pressure: "#b85c28", viability: "#1a6b5a", capability: "#2a5a8c", community: "#8c4a2a", creative: "#a0382a" };
const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};
const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
const EQUAL_WEIGHT = 20;

interface PublishedCity {
  cityId: string; displayName: string; country: string; region: string; rankingStatus: string;
  pressureScore: number; viabilityScore: number; capabilityScore: number; communityScore: number; creativeScore: number; slicScore: number; rank: number;
}
const rankedCities = ((publishedData.cities ?? []) as PublishedCity[]).filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => s + ((city[`${p}Score` as keyof PublishedCity] as number) * weights[p]) / total, 0);
}

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
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

export default function CompareRankingsPage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  const labels = PILLAR_LABELS[locale];

  /* ── Spider state ── */
  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: EQUAL_WEIGHT })),
  );
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);
  const isCustom = useMemo(() => PILLAR_ORDER.some((id) => weights[id] !== EQUAL_WEIGHT), [weights]);

  /* ── Live SLIC results ── */
  const slicResults = useMemo(() =>
    rankedCities.map((c) => ({ ...c, customScore: Math.round(scoreCityWithWeights(c, weights) * 10) / 10 })).sort((a, b) => b.customScore - a.customScore),
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

  const handleReset = () => setPillars(PILLAR_ORDER.map((id) => ({ id, label: labels[id], color: PILLAR_COLORS[id], value: EQUAL_WEIGHT })));

  return (
    <>
      {/* ═══════ 01. HERO ═══════ */}
      <header className="compare-hero">
        <div className="compare-hero-inner section">
          <p className="compare-overline">{COMPARE_HERO.eyebrow}</p>
          <h1 className="compare-hero-title">{COMPARE_HERO.title}</h1>
          <p className="compare-hero-thesis">{COMPARE_HERO.thesis}</p>
        </div>
      </header>

      {/* ═══════ 02. INTERACTIVE SPIDER + TABLE ═══════ */}
      <section className="compare-interactive">
        <div className="section compare-spider-header">
          <h2 className="compare-section-title">{t(locale, "Drag the spider to rebuild SLIC\u2019s top 10.", "ลากใยแมงมุมเพื่อสร้าง SLIC top 10 ใหม่", "拖动蛛网图重建SLIC前10名")}</h2>
          <p className="compare-section-sub">{t(locale, "The other five indices are frozen. Only SLIC responds to your priorities.", "อีกห้าดัชนียังคงเดิม มีแค่ SLIC ที่ตอบสนอง", "其他五个指数固定不变 只有SLIC响应你的优先级")}</p>
          <div className="compare-spider-widget">
            <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={360} />
            <div className="compare-spider-controls">
              <button type="button" className="compare-reset-btn" onClick={handleReset}>{t(locale, "Reset to equal", "รีเซ็ต", "重置")}</button>
              {isCustom && <span className="compare-custom-badge">{t(locale, "Custom weights", "น้ำหนักที่ปรับ", "自定义权重")}</span>}
            </div>
          </div>
        </div>

        <div className="compare-table-scroll">
          <div className="compare-table">
            {/* SLIC column — LIVE */}
            <div className="compare-col compare-col--slic">
              <div className="compare-col-header" style={{ borderColor: "#1a6b5a" }}>
                <strong>SLIC V3{isCustom ? " \u2014 YOUR WEIGHTS" : ""}</strong>
                <span>2026 &middot; {rankedCities.length} cities &middot; LIVE</span>
              </div>
              {slicTop10.map((c, i) => (
                <div key={c.cityId} className="compare-cell compare-cell--animated">
                  <span className="compare-rank">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="compare-city">{c.displayName}</span>
                    <span className="compare-country">{c.country}</span>
                  </div>
                  <span className="compare-score">{c.customScore.toFixed(1)}</span>
                </div>
              ))}
            </div>

            {/* Other indices — STATIC */}
            {INDEX_PROFILES.map((profile) => (
              <div key={profile.id} className="compare-col">
                <div className="compare-col-header" style={{ borderColor: profile.accentHex }}>
                  <strong>{profile.shortName}</strong>
                  <span>{profile.year} &middot; {profile.citiesEvaluated} cities</span>
                </div>
                {profile.topCities.slice(0, 10).map((c) => (
                  <div key={c.rank + c.city} className="compare-cell">
                    <span className="compare-rank">{String(c.rank).padStart(2, "0")}</span>
                    <div>
                      <span className="compare-city">{c.city}</span>
                      <span className="compare-country">{c.country}</span>
                    </div>
                    {c.score && <span className="compare-score">{c.score}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 03. OVERLAP ANALYSIS (dynamic) ═══════ */}
      <section className="compare-overlap section">
        <h2 className="compare-section-title">{t(locale, "The echo chamber", "ห้องเสียงสะท้อน", "回声室")}</h2>
        <p className="compare-section-sub">{t(locale, "Cities in 3+ establishment top-10 lists \u2014 and where SLIC disagrees.", "เมืองที่อยู่ใน top 10 ของดัชนีสถาบัน 3+ ดัชนี \u2014 และที่ SLIC ไม่เห็นด้วย", "出现在3个以上机构前10名中的城市 \u2014 以及SLIC的不同意见")}</p>
        <div className="compare-overlap-grid">
          {establishmentFavorites.map((item) => (
            <div key={item.city} className="compare-overlap-card">
              <strong>{item.city}</strong>
              <span className="compare-overlap-indices">{item.indices.join(", ")}</span>
              <span className={item.inSlic ? "compare-overlap-slic yes" : "compare-overlap-slic no"}>
                {item.inSlic ? t(locale, "Also in SLIC top 10", "อยู่ใน SLIC top 10 ด้วย", "也在SLIC前10") : t(locale, "Not in SLIC top 10", "ไม่อยู่ใน SLIC top 10", "不在SLIC前10")}
              </span>
            </div>
          ))}
        </div>
        {slicOnly.length > 0 && (
          <div className="compare-slic-exclusive">
            <h3>{t(locale, "Only in SLIC", "มีใน SLIC เท่านั้น", "仅在SLIC中")}</h3>
            <p>{t(locale, "These cities rank in SLIC\u2019s top 10 but appear in zero establishment top-10 lists.", "เมืองเหล่านี้อยู่ใน SLIC top 10 แต่ไม่อยู่ในดัชนีสถาบันใดเลย", "这些城市在SLIC前10中但不在任何机构前10中")}</p>
            <div className="compare-slic-exclusive-cities">
              {slicOnly.map((c) => (
                <a
                  key={c.cityId}
                  className="compare-slic-chip"
                  href="/rankings"
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
        <h2 className="compare-section-title">{t(locale, "What each index actually measures", "แต่ละดัชนีวัดอะไรจริงๆ", "每个指数到底在衡量什么")}</h2>
        <div className="compare-meth-grid">
          {INDEX_PROFILES.map((profile) => (
            <article key={profile.id} className="compare-meth-card" style={{ borderTopColor: profile.accentHex }}>
              <div className="compare-meth-header"><strong>{profile.name}</strong><span>{profile.publisher} &middot; {profile.year}</span></div>
              <div className="compare-meth-section"><p className="compare-meth-label">{t(locale, "They claim", "พวกเขาอ้างว่า", "他们声称")}</p><p>{profile.methodology.claimedPurpose}</p></div>
              <div className="compare-meth-section compare-meth-reality"><p className="compare-meth-label">{t(locale, "What it actually measures", "วัดอะไรจริงๆ", "实际衡量什么")}</p><p>{profile.methodology.actualMeasure}</p></div>
              <div className="compare-meth-section"><p className="compare-meth-label">{t(locale, "Blind spots", "จุดบอด", "盲点")}</p><ul className="compare-blindspots">{profile.methodology.blindSpots.map((b) => <li key={b}>{b}</li>)}</ul></div>
              <div className="compare-meth-audience"><p className="compare-meth-label">{t(locale, "Who it really serves", "รับใช้ใครจริงๆ", "真正服务谁")}</p><p>{profile.methodology.audienceNote}</p></div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════ 05. CRITICAL ANALYSIS ═══════ */}
      <section className="compare-critique">
        <div className="section">
          <h2 className="compare-section-title">{t(locale, "The critique", "บทวิจารณ์", "批评")}</h2>
          <div className="compare-critique-blocks">
            {INDEX_PROFILES.map((profile) => (
              <article key={profile.id} className="compare-critique-block">
                <p className="compare-critique-eyebrow" style={{ color: profile.accentHex }}>{profile.shortName}</p>
                <h3 className="compare-critique-headline">{profile.critique.headline}</h3>
                <p className="compare-critique-body">{profile.critique.body}</p>
              </article>
            ))}
          </div>
          <blockquote className="compare-overarching">{COMPARE_HERO.overarchingCritique}</blockquote>
        </div>
      </section>

      {/* ═══════ 06. THE SLIC DIFFERENCE ═══════ */}
      <section className="compare-slic-diff section">
        <h2 className="compare-section-title">{t(locale, "What SLIC measures that others refuse to ask", "สิ่งที่ SLIC วัดแต่ดัชนีอื่นไม่กล้าถาม", "SLIC衡量的是其他指数不敢问的问题")}</h2>
        <div className="compare-diff-grid">
          {SLIC_DIFFERENCE.map((item) => (
            <article key={item.title} className="compare-diff-card"><h4>{item.title}</h4><p>{item.body}</p></article>
          ))}
        </div>
        <div className="compare-diff-cta">
          <a className="v3-cta" href="/methodology" onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>{t(locale, "READ THE FULL METHODOLOGY", "อ่านระเบียบวิธีเต็ม", "阅读完整方法论")} &rarr;</a>
          <a className="v3-cta-secondary" href="/rankings" onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>{t(locale, "SEE THE SLIC RANKING", "ดูอันดับ SLIC", "查看SLIC排名")}</a>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
