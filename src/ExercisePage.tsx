import { useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

/* ───── pillar config ───── */

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#f97316",
  viability: "#22c55e",
  capability: "#3b82f6",
  community: "#a855f7",
  creative: "#ec4899",
};

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Pressure",
    viability: "Viability",
    capability: "Capability",
    community: "Community",
    creative: "Creative",
  },
  th: {
    pressure: "แรงกดดัน",
    viability: "ความน่าอยู่",
    capability: "ศักยภาพ",
    community: "ชุมชน",
    creative: "ความสร้างสรรค์",
  },
  zh: {
    pressure: "压力",
    viability: "宜居",
    capability: "能力",
    community: "社区",
    creative: "创新",
  },
};

const PILLAR_HINTS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Affordability, housing costs, work-life balance",
    viability: "Safety, transit, clean air, infrastructure",
    capability: "Healthcare, education, opportunity",
    community: "Belonging, tolerance, cultural life",
    creative: "Innovation, research, entrepreneurship",
  },
  th: {
    pressure: "ค่าครองชีพ ที่อยู่อาศัย สมดุลชีวิต",
    viability: "ความปลอดภัย ขนส่ง อากาศสะอาด",
    capability: "สาธารณสุข การศึกษา โอกาส",
    community: "ความเป็นส่วนหนึ่ง ความอดทน วัฒนธรรม",
    creative: "นวัตกรรม วิจัย ผู้ประกอบการ",
  },
  zh: {
    pressure: "生活成本、住房、工作生活平衡",
    viability: "安全、交通、空气、基础设施",
    capability: "医疗、教育、机会",
    community: "归属、包容、文化生活",
    creative: "创新、研究、创业",
  },
};

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  cityType: string;
  coverageGrade: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
}

const CANONICAL = publishedData.canonicalWeights as Record<PillarId, number>;
const cities = (publishedData.cities ?? []) as PublishedCity[];

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => {
    const pillarScore = city[`${p}Score` as keyof PublishedCity] as number;
    return s + (pillarScore * weights[p]) / total;
  }, 0);
}

/* ───── copy ───── */

interface GameCopy {
  eyebrow: string;
  title: string;
  intro: string;
  allocatorTitle: string;
  allocatorHint: string;
  consequencesTitle: string;
  resultsTitle: string;
  resultsSummary: string;
  yourScore: string;
  canonicalScore: string;
  noConsequences: string;
  resetLabel: string;
  citiesRanked: string;
  downloadCsv: string;
  quickLinks: { rankings: string; methodology: string };
}

const gameCopy: Record<Locale, GameCopy> = {
  en: {
    eyebrow: "The 100-Point Game",
    title: "What does your ideal city look like?",
    intro:
      "You have exactly 100 points. Distribute them across five dimensions of city life. As you shift weight, watch how the rankings change and what trade-offs emerge. There are no right answers, only honest priorities.",
    allocatorTitle: "Allocate your 100 points",
    allocatorHint: "Drag the spider web or use the sliders. The total always stays at 100.",
    consequencesTitle: "Trade-off insights",
    resultsTitle: "Cities that match your priorities",
    resultsSummary: "Re-ranked using your custom weights instead of the SLIC canonical formula.",
    yourScore: "Your score",
    canonicalScore: "SLIC score",
    noConsequences: "Adjust your weights to see trade-off insights.",
    resetLabel: "Reset to SLIC defaults",
    citiesRanked: "cities re-ranked",
    downloadCsv: "Download researcher CSV",
    quickLinks: {
      rankings: "View rankings",
      methodology: "Methodology",
    },
  },
  th: {
    eyebrow: "เกม 100 คะแนน",
    title: "เมืองในฝันของคุณเป็นอย่างไร?",
    intro:
      "คุณมี 100 คะแนนพอดี แจกจ่ายให้ 5 มิติของชีวิตในเมือง เลื่อนน้ำหนัก ดูว่าอันดับเปลี่ยนอย่างไร และข้อแลกเปลี่ยนอะไรเกิดขึ้น ไม่มีคำตอบที่ถูก มีแค่ลำดับความสำคัญที่จริงใจ",
    allocatorTitle: "แจก 100 คะแนนของคุณ",
    allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวมจะอยู่ที่ 100 เสมอ",
    consequencesTitle: "มุมมองข้อแลกเปลี่ยน",
    resultsTitle: "เมืองที่ตรงกับลำดับความสำคัญของคุณ",
    resultsSummary: "จัดอันดับใหม่ด้วยน้ำหนักที่คุณกำหนดเอง",
    yourScore: "คะแนนของคุณ",
    canonicalScore: "คะแนน SLIC",
    noConsequences: "ปรับน้ำหนักเพื่อดูข้อแลกเปลี่ยน",
    resetLabel: "รีเซ็ตเป็นค่าเริ่มต้น SLIC",
    citiesRanked: "เมืองที่จัดอันดับใหม่",
    downloadCsv: "ดาวน์โหลด CSV สำหรับนักวิจัย",
    quickLinks: { rankings: "ดูอันดับ", methodology: "ระเบียบวิธี" },
  },
  zh: {
    eyebrow: "100分游戏",
    title: "你理想的城市是什么样的？",
    intro:
      "你有整整100分。把它们分配到城市生活的五个维度上。随着权重变化，看排名如何变化，以及出现了什么权衡取舍。没有标准答案，只有真实的优先级。",
    allocatorTitle: "分配你的100分",
    allocatorHint: "拖动蛛网图或使用滑块，总分始终保持100。",
    consequencesTitle: "权衡取舍洞察",
    resultsTitle: "符合你优先级的城市",
    resultsSummary: "使用你的自定义权重重新排名。",
    yourScore: "你的评分",
    canonicalScore: "SLIC评分",
    noConsequences: "调整权重以查看权衡洞察。",
    resetLabel: "重置为SLIC默认值",
    citiesRanked: "座城市重新排名",
    downloadCsv: "下载研究者CSV",
    quickLinks: { rankings: "查看排名", methodology: "方法论" },
  },
};

/* ───── severity styles ───── */

const severityStyles: Record<string, React.CSSProperties> = {
  severe: {
    borderLeft: "4px solid #ef4444",
    background: "rgba(239,68,68,0.08)",
    padding: "12px 16px",
    borderRadius: 0,
  },
  moderate: {
    borderLeft: "4px solid #f59e0b",
    background: "rgba(245,158,11,0.06)",
    padding: "12px 16px",
    borderRadius: 0,
  },
  mild: {
    borderLeft: "4px solid #3b82f6",
    background: "rgba(59,130,246,0.06)",
    padding: "12px 16px",
    borderRadius: 0,
  },
};

/* ───── main component ───── */

export default function ExercisePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const ui = gameCopy[locale];
  const labels = PILLAR_LABELS[locale];
  const hints = PILLAR_HINTS[locale];

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: CANONICAL[id],
    }))
  );

  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => {
      w[p.id] = p.value;
    });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights]
  );

  const rankedCities = useMemo(() => {
    return cities
      .filter((c) => c.rankingStatus === "Ranked")
      .map((city) => ({
        ...city,
        customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights]);

  const handleReset = () => {
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: CANONICAL[id],
      }))
    );
  };

  return (
    <>
      <header className="exercise-hero section">
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em", margin: "0.5rem 0" }}>
            {ui.title}
          </h1>
          <p className="hero-intro" style={{ maxWidth: 600, margin: "12px auto 0" }}>
            {ui.intro}
          </p>
        </div>
      </header>

      <main>
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="game-grid">
            {/* LEFT: Allocator */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  {ui.allocatorTitle}
                </h2>
                <p style={{ fontSize: 13, opacity: 0.6 }}>{ui.allocatorHint}</p>
              </div>

              <ZeroSumAllocator pillars={pillars} onChange={setPillars} />

              <button
                type="button"
                onClick={handleReset}
                style={{
                  marginTop: 16,
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 0,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {ui.resetLabel}
              </button>

              {/* Pillar hints */}
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {PILLAR_ORDER.map((id) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      opacity: 0.55,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: PILLAR_COLORS[id],
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      <strong>{labels[id]}</strong> — {hints[id]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Consequences */}
              <div style={{ marginTop: 28 }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, marginBottom: 12, opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  {ui.consequencesTitle}
                </h3>
                {consequences.length === 0 ? (
                  <p style={{ fontSize: 13, opacity: 0.4, fontStyle: "italic" }}>
                    {ui.noConsequences}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {consequences.map((c) => (
                      <div key={c.id} style={severityStyles[c.severity]}>
                        <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{c.narrative}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Results */}
            <div style={{ minWidth: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  {ui.resultsTitle}
                </h2>
                <p style={{ fontSize: 13, opacity: 0.6 }}>
                  {ui.resultsSummary} — {rankedCities.length} {ui.citiesRanked}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rankedCities.slice(0, 20).map((city, index) => {
                  const pillarScores = {
                    pressure: city.pressureScore,
                    viability: city.viabilityScore,
                    capability: city.capabilityScore,
                    community: city.communityScore,
                    creative: city.creativeScore,
                  };
                  return (
                    <div
                      key={city.cityId}
                      className="game-city-card"
                      style={{
                        background:
                          index === 0
                            ? "rgba(99,179,237,0.1)"
                            : "rgba(255,255,255,0.03)",
                        border:
                          index === 0
                            ? "1px solid rgba(99,179,237,0.25)"
                            : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          fontVariantNumeric: "tabular-nums",
                          opacity: 0.4,
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </span>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {city.displayName}
                          <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 6 }}>
                            {city.country}
                          </span>
                        </div>
                        {/* Mini pillar bars */}
                        <div
                          style={{
                            display: "flex",
                            gap: 3,
                            marginTop: 6,
                            height: 4,
                          }}
                        >
                          {PILLAR_ORDER.map((pid) => (
                            <div
                              key={pid}
                              style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 0,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${pillarScores[pid]}%`,
                                  height: "100%",
                                  background: PILLAR_COLORS[pid],
                                  borderRadius: 0,
                                  opacity: 0.7,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            fontVariantNumeric: "tabular-nums",
                            color: "rgba(99,179,237,0.9)",
                          }}
                        >
                          {city.customScore}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.4 }}>
                          {ui.canonicalScore} {city.slicScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation links */}
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <a
                  className="primary-action"
                  href="/rankings"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("/rankings");
                  }}
                >
                  {ui.quickLinks.rankings}
                </a>
                <a
                  className="secondary-action"
                  href="/methodology"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("/methodology");
                  }}
                >
                  {ui.quickLinks.methodology}
                </a>
                <a
                  className="secondary-action"
                  href="/downloads/slic-ranked-cities-v2.csv"
                  download
                >
                  {ui.downloadCsv}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
