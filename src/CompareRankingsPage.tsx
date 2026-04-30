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
};
const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
const EQUAL_WEIGHT = 20;

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
      score: city[`${id}Score` as keyof PublishedCity] as number,
    }))
    .sort((left, right) => left.score - right.score);
  const weakest = pillars[0];
  const secondWeakest = pillars[1];
  const strongest = [...pillars].sort((left, right) => right.score - left.score)[0];
  const tierContext = city.tierLabel
    ? t(locale, `public ${city.tierLabel} tier`, `ชั้น ${city.tierLabel} สาธารณะ`, `公开 ${city.tierLabel} 层`)
    : t(locale, "public top tiers", "ชั้นสาธารณะบนสุด", "公开高层级");

  return t(
    locale,
    `SLIC #${city.rank}. ${strongest.en} remains strong at ${strongest.score.toFixed(1)}, but ${weakest.en} (${weakest.score.toFixed(1)}) and ${secondWeakest.en} (${secondWeakest.score.toFixed(1)}) are the main drag on ${city.displayName}'s standing in the ${tierContext}.`,
    `SLIC อันดับ #${city.rank} จุดแข็งสุดคือ ${strongest.th} ที่ ${strongest.score.toFixed(1)} แต่ ${weakest.th} (${weakest.score.toFixed(1)}) และ ${secondWeakest.th} (${secondWeakest.score.toFixed(1)}) เป็นตัวถ่วงหลักต่อสถานะของ ${city.displayName} ใน ${tierContext}`,
    `SLIC 第 ${city.rank} 名。${strongest.zh} 仍然很强（${strongest.score.toFixed(1)}），但 ${weakest.zh}（${weakest.score.toFixed(1)}）与 ${secondWeakest.zh}（${secondWeakest.score.toFixed(1)}）是拖累 ${city.displayName} 在 ${tierContext} 中位置的主要因素。`,
  );
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
          <p className="compare-section-sub">{t(locale, "The other seven indices are frozen. Only SLIC responds to your priorities.", "อีกเจ็ดดัชนียังคงเดิม มีแค่ SLIC ที่ตอบสนอง", "其他七个指数固定不变，只有SLIC响应你的优先级")}</p>
          <div className="compare-spider-widget">
            <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={360} locale={locale} />
            <div className="compare-spider-controls">
              <button type="button" className="compare-reset-btn" onClick={handleReset}>{t(locale, "Reset to equal", "รีเซ็ต", "重置")}</button>
              {isCustom && <span className="compare-custom-badge">{t(locale, "Custom weights", "น้ำหนักที่ปรับ", "自定义权重")}</span>}
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
                <strong>SLIC V3{isCustom ? ` — ${t(locale, "CUSTOM", "ปรับแล้ว", "自定义")}` : ""}</strong>
                <span>2026 · {rankedCities.length} {t(locale, "cities", "เมือง", "座城市")} · {t(locale, "LIVE", "สด", "实时")}</span>
              </div>,
              ...INDEX_PROFILES.map((profile) => (
                <div key={`h-${profile.id}`} className="compare-matrix-hd" style={{ borderTopColor: profile.accentHex }}>
                  <strong>{profile.shortName}</strong>
                  <span>{profile.year} · {profile.citiesEvaluated} {t(locale, "cities", "เมือง", "座城市")}</span>
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
          <p className="compare-overline">{t(locale, "THE VISIBLE GAP", "ช่องว่างที่มองเห็นได้", "可见的差距")}</p>
          <h2 className="compare-section-title">{t(locale, "Most visited vs most livable", "เมืองที่คนเที่ยวมากสุด เทียบกับเมืองที่อยู่ได้จริง", "最受游客欢迎 vs 最宜居")}</h2>
          <p className="compare-section-sub">{t(
            locale,
            "Every other index measures visitor pull or capital attraction. SLIC asks where a resident can actually build a life. The two questions produce completely different answers.",
            "ดัชนีอื่นๆ วัดแรงดึงดูดนักท่องเที่ยวหรือทุน SLIC ถามว่าประชากรจะสร้างชีวิตได้ที่ไหน สองคำถามให้คำตอบที่ต่างกันสิ้นเชิง",
            "其他指数衡量游客吸引力或资本聚集力。SLIC 问的是居民能在哪里真正立足。两个问题给出截然不同的答案。",
          )}</p>
        </div>

        <div className="compare-visits-grid">
          <div className="compare-visits-col">
            <h3 className="compare-visits-col-header">{t(locale, "Most visited", "เที่ยวมากสุด", "最受游客欢迎")}</h3>
            <p className="compare-visits-col-source">{t(locale, "MasterCard GDCI 2019", "MasterCard GDCI 2019", "MasterCard GDCI 2019")}</p>
            {mastercardWithSlic.map((c, i) => (
              <div key={c.city} className={`compare-visits-row${i % 2 === 0 ? " compare-visits-row-even" : ""}`}>
                <span className="compare-visits-rank">{c.rank}</span>
                <div className="compare-visits-city-block">
                  <span className="compare-visits-city">{c.city}</span>
                  <span className="compare-visits-country">{c.country}</span>
                </div>
                <span className="compare-visits-meta">{c.visitorsMillions}M {t(locale, "visits", "ครั้ง", "人次")}</span>
                <span className={c.slicRank ? "compare-visits-slic-tag" : "compare-visits-slic-tag compare-visits-slic-tag--missing"}>
                  {c.slicRank
                    ? `SLIC #${c.slicRank}`
                    : t(locale, "Not in SLIC", "ไม่อยู่ใน SLIC", "未在 SLIC")}
                </span>
              </div>
            ))}
          </div>

          <div className="compare-visits-col">
            <h3 className="compare-visits-col-header">{t(locale, "Most livable", "น่าอยู่จริง", "最宜居")}</h3>
            <p className="compare-visits-col-source">{t(locale, "SLIC 2026", "SLIC 2026", "SLIC 2026")}</p>
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
          )}</blockquote>

        <p className="compare-visits-source-footer">{t(
          locale,
          "Source: MasterCard Global Destination Cities Index 2019 (final published edition, international overnight visitors). SLIC: this study, 2026.",
          "แหล่งข้อมูล: MasterCard Global Destination Cities Index 2019 (ฉบับเผยแพร่สุดท้าย นักท่องเที่ยวค้างคืนระหว่างประเทศ) SLIC: การศึกษานี้ 2026",
          "来源：MasterCard 全球目的地城市指数 2019（最终公开版，国际过夜游客）。SLIC：本研究，2026。",
        )}</p>
      </section>

      {/* ═══════ 03. OVERLAP ANALYSIS (dynamic) ═══════ */}
      <section className="compare-overlap section">
        <h2 className="compare-section-title">{t(locale, "The echo chamber", "ห้องเสียงสะท้อน", "回声室")}</h2>
        <p className="compare-section-sub">{t(locale, "Cities appearing in 3+ establishment top-10 lists — and the specific SLIC factors that tell a different story.", "เมืองที่ติด top 10 ของดัชนีสถาบันอย่างน้อย 3 ดัชนี — และปัจจัย SLIC ที่บอกเล่าเรื่องราวต่างออกไป", "出现在3个以上主流指数前10名的城市——以及SLIC给出不同答案的具体因素")}</p>
        <div className="compare-overlap-grid">
          {establishmentFavorites.map((item) => {
            const note = ECHO_CHAMBER_NOTES[item.city.toLowerCase()];
            const liveCity = currentPublishedCity(item.city);
            const liveSlicRank = liveCity?.rank ?? note?.slicRank;
            const liveNote = liveCity ? buildLiveEchoNote(liveCity, locale) : (note ? (locale === "th" ? note.th : locale === "zh" ? note.zh : note.en) : null);
            return (
              <div key={item.city} className="compare-overlap-card">
                <div className="compare-overlap-card-header">
                  <strong>{item.city}</strong>
                  {liveSlicRank && (
                    <span className="compare-overlap-slic-rank">
                      {t(locale, `SLIC #${liveSlicRank}`, `SLIC อันดับ ${liveSlicRank}`, `SLIC 第${liveSlicRank}名`)}
                    </span>
                  )}
                </div>
                <span className="compare-overlap-indices">{item.indices.join(", ")}</span>
                <span className={item.inSlic ? "compare-overlap-slic yes" : "compare-overlap-slic no"}>
                  {item.inSlic ? t(locale, "Also in SLIC top 10", "อยู่ใน SLIC top 10 ด้วย", "也在SLIC前10") : t(locale, "Not in SLIC top 10", "ไม่อยู่ใน SLIC top 10", "不在SLIC前10")}
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
            <h3>{t(locale, "Only in SLIC", "มีใน SLIC เท่านั้น", "仅在SLIC中")}</h3>
            <p>{t(locale, "These cities rank in SLIC\u2019s top 10 but appear in zero establishment top-10 lists.", "เมืองเหล่านี้อยู่ใน SLIC top 10 แต่ไม่อยู่ในดัชนีสถาบันใดเลย", "这些城市在SLIC前10中但不在任何机构前10中")}</p>
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
          <a className="v3-cta" href={appHref("/methodology")} onClick={(event) => navigateLink(event, onNavigate, "/methodology")}>{t(locale, "READ THE FULL METHODOLOGY", "อ่านระเบียบวิธีเต็ม", "阅读完整方法论")} &rarr;</a>
          <a className="v3-cta-secondary" href={appHref("/rankings")} onClick={(event) => navigateLink(event, onNavigate, "/rankings")}>{t(locale, "SEE THE SLIC RANKING", "ดูอันดับ SLIC", "查看SLIC排名")}</a>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
