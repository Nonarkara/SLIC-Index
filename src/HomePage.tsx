import { type CSSProperties, type MouseEvent, useEffect, useMemo, useState } from "react";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import { rankingPublication } from "./rankingPublication";
import { getExerciseCities } from "./rankingsData";
import SiteFooter from "./SiteFooter";
import type { PillarAllocation } from "./ZeroSumAllocator";
import ZeroSumAllocator from "./ZeroSumAllocator";
import { appHref } from "./routing";
import type { Locale, SitePath } from "./types";
import { getVisitorStats } from "./visitorTracking";

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

interface HomeCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  rankingStatus: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
}

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Growth",
    viability: "Viability",
    capability: "Capability",
    community: "Community",
    creative: "Creative",
  },
  th: {
    pressure: "การเติบโต",
    viability: "ความน่าอยู่",
    capability: "ศักยภาพ",
    community: "ชุมชน",
    creative: "ความสร้างสรรค์",
  },
  zh: {
    pressure: "增长",
    viability: "宜居",
    capability: "能力",
    community: "社区",
    creative: "创新",
  },
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];
const EQUAL_WEIGHT = 20;
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const HERO_PHOTO = `${BASE}/launch-photos/20260318145941_DSC09480.jpg`;
const STAGE_PHOTO = `${BASE}/launch-photos/20260318145249_ABC01948.jpg`;

const localeNumberFormat: Record<Locale, string> = {
  en: "en-US",
  th: "th-TH",
  zh: "zh-CN",
};

const severityClass: Record<string, string> = {
  severe: "tradeoff-card tradeoff-card--severe",
  moderate: "tradeoff-card tradeoff-card--moderate",
  mild: "tradeoff-card tradeoff-card--mild",
};

const publishedBoard: HomeCity[] = rankingPublication.cities
  .map((city) => ({
    cityId: city.cityId,
    displayName: city.displayName,
    country: city.country,
    region: city.region,
    rankingStatus: city.manifestStatus,
    pressureScore: city.pressureScore ?? 0,
    viabilityScore: city.viabilityScore ?? 0,
    capabilityScore: city.capabilityScore ?? 0,
    communityScore: city.communityScore ?? 0,
    creativeScore: city.creativeScore ?? 0,
    slicScore: city.slicScore,
    rank: city.rank,
  }))
  .sort((left, right) => left.rank - right.rank);

const exerciseCities: HomeCity[] = getExerciseCities().map((city) => ({
  cityId: city.id,
  displayName: city.name,
  country: city.country,
  region: city.region,
  rankingStatus: city.coreBoardEligible ? "Ranked" : "Candidate",
  pressureScore: city.scores.pressure,
  viabilityScore: city.scores.viability,
  capabilityScore: city.scores.capability,
  communityScore: city.scores.community,
  creativeScore: city.scores.creative,
  slicScore: city.scores.slic,
  rank: city.globalRank,
}));

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

function navigateLink(
  event: MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath | string) => void,
  path: SitePath | string,
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

function scoreCityWithWeights(city: HomeCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((sum, pillar) => sum + weights[pillar], 0);
  if (total === 0) {
    return 0;
  }

  return PILLAR_ORDER.reduce(
    (sum, pillar) =>
      sum + ((city[`${pillar}Score` as keyof HomeCity] as number) * weights[pillar]) / total,
    0,
  );
}

function leadPillarForCity(city: HomeCity): PillarId {
  return PILLAR_ORDER.reduce((best, pillar) =>
    (city[`${pillar}Score` as keyof HomeCity] as number) >
    (city[`${best}Score` as keyof HomeCity] as number)
      ? pillar
      : best,
  PILLAR_ORDER[0]);
}

export default function HomePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const ui = {
    allocatorHint: t(
      locale,
      "Drag the spider or use the sliders. Total = 100.",
      "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวม = 100",
      "拖动蛛网图或使用滑块，总分 = 100。",
    ),
    resetLabel: t(locale, "Reset", "รีเซ็ต", "重置"),
  };
  const labels = PILLAR_LABELS[locale];

  const [visitors, setVisitors] = useState(12424);
  useEffect(() => {
    getVisitorStats().then((stats) => setVisitors(stats.count));
  }, []);

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: EQUAL_WEIGHT,
    })),
  );

  const weights = useMemo(() => {
    const nextWeights: Record<string, number> = {};
    pillars.forEach((pillar) => {
      nextWeights[pillar.id] = pillar.value;
    });
    return nextWeights as Record<PillarId, number>;
  }, [pillars]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

  const results = useMemo(
    () =>
      exerciseCities
        .map((city) => ({
          ...city,
          customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
        }))
        .sort((a, b) => b.customScore - a.customScore),
    [weights],
  );

  const handleReset = () =>
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: EQUAL_WEIGHT,
      })),
    );

  const formattedVisitors = new Intl.NumberFormat(localeNumberFormat[locale]).format(visitors);

  return (
    <>
      <header className="hp-opening">
        <div className="hp-opening-inner section">
          <p className="hp-kicker">
            {t(locale, "SLIC Index V3 / 2026 edition", "ดัชนี SLIC V3 / ฉบับปี 2026", "SLIC 指数 V3 / 2026 版")}
          </p>
          <p className="hp-lede">
            {t(
              locale,
              "Most city rankings measure prestige. SLIC measures what it actually costs to build a life here.",
              "ดัชนีเมืองส่วนใหญ่วัดความมีชื่อเสียง SLIC วัดว่าการสร้างชีวิตที่นี่ใช้ต้นทุนจริงเท่าไร",
              "大多数城市排名衡量声望。SLIC 衡量在这里生活的真实成本。",
            )}
          </p>
          <h1 className="hp-headline">
            {t(
              locale,
              "Which cities score highest under this metric?",
              "เมืองใดได้คะแนนสูงสุดภายใต้เมตริกนี้?",
              "哪些城市在这一指标下得分最高？",
            )}
          </h1>
          <p className="hp-deck">
            {t(
              locale,
              "157 published cities. One declared score per city, traced through five public pillars: pressure, viability, capability, community, and creative momentum.",
              "157 เมืองที่เผยแพร่แล้ว แต่ละเมืองมีคะแนนที่ประกาศชัดเจนหนึ่งค่า และสามารถไล่ย้อนกลับได้ผ่าน 5 เสาหลักสาธารณะ: แรงกดดัน ความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์",
              "157 座已发布城市。每座城市对应一个公开分数，并可追溯到五个公开支柱：压力、宜居性、能力、社区与创造动能。",
            )}
          </p>
          <div className="hp-opening-stats">
            <span className="hp-opening-stat">
              <strong>{publishedBoard.length}</strong>
              <em>{t(locale, "cities", "เมือง", "城市")}</em>
            </span>
            <span className="hp-opening-stat">
              <strong>5</strong>
              <em>{t(locale, "pillars", "เสาหลัก", "支柱")}</em>
            </span>
            <span className="hp-opening-stat">
              <strong>{formattedVisitors}</strong>
              <em>{t(locale, "visitors", "ผู้เข้าชม", "访客")}</em>
            </span>
          </div>
        </div>
      </header>

      <section className="hp-photo-break">
        <img
          src={HERO_PHOTO}
          alt="Smart City Summit and Expo 2026 in Taipei"
          className="hp-photo-break-img"
          width={6000}
          height={4000}
          loading="eager"
          fetchPriority="high"
        />
        <p className="hp-photo-caption">
          {t(
            locale,
            "Smart City Summit & Expo 2026, Taipei. SLIC entered the room as a public method, not a brand deck.",
            "Smart City Summit & Expo 2026, ไทเป — SLIC เปิดตัวในฐานะระเบียบวิธีสาธารณะ ไม่ใช่เพียงสไลด์ภาพลักษณ์",
            "2026 台北智慧城市峰会。SLIC 作为一套公开方法进入现场，而不是一份品牌演示稿。",
          )}
        </p>
      </section>

      <section className="hp-thesis section">
        <div className="hp-thesis-inner">
          <h2 className="hp-thesis-title">
            {t(
              locale,
              "A public metric.\nDeclared terms.",
              "เมตริกสาธารณะ\nพร้อมเงื่อนไขที่ประกาศชัดเจน",
              "一个公开指标。\n前提明确。",
            )}
          </h2>
          <p className="hp-thesis-body">
            {t(
              locale,
              "SLIC publishes one city number built from five declared pillars. It is not a claim that one score can settle what a city means to every person; it is a transparent statement of what this model measures and how each number can be traced.",
              "SLIC เผยแพร่ตัวเลขหนึ่งค่าต่อหนึ่งเมือง โดยสร้างจาก 5 เสาหลักที่ประกาศชัดเจน ไม่ได้อ้างว่าคะแนนเดียวสามารถตัดสินความหมายของเมืองต่อทุกคนได้ แต่ประกาศอย่างโปร่งใสว่าโมเดลนี้วัดอะไร และไล่ย้อนกลับตัวเลขแต่ละค่าได้อย่างไร",
              "SLIC 为每座城市发布一个由五个公开支柱构成的分数。它并不声称一个数字就能定义一座城市对所有人的意义，而是透明说明这个模型测量什么，以及每个数字如何回溯。",
            )}
          </p>
          <a
            className="hp-thesis-link"
            href={appHref("/compare")}
            onClick={(event) => navigateLink(event, onNavigate, "/compare")}
          >
            {t(locale, "Read the full comparison", "อ่านการเปรียบเทียบเต็ม", "阅读完整对比")} &rarr;
          </a>
        </div>
      </section>

      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">
            {t(
              locale,
              "Published board, verified order.",
              "บอร์ดที่เผยแพร่แล้ว ตามลำดับที่ตรวจสอบแล้ว",
              "已发布榜单，按已核验顺序呈现。",
            )}
          </h2>
        </div>
        <div className="v3-alpha-grid section">
          {publishedBoard.slice(0, 10).map((city) => (
              <a
                key={city.cityId}
                className="v3-city-card"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                style={{ "--city-accent": PILLAR_COLORS[leadPillarForCity(city)] } as CSSProperties}
              >
              <span className="v3-city-card-meta">
                <span className="v3-city-card-rank">#{String(city.rank).padStart(2, "0")}</span>
                <span>{t(locale, "Published board", "บอร์ดที่เผยแพร่", "已发布榜单")}</span>
              </span>
              <div className="v3-city-card-topline">
                <span className="v3-city-card-name">{city.displayName}</span>
                <span className="v3-city-card-score">{city.slicScore.toFixed(1)}</span>
              </div>
              <span className="v3-city-card-country">{city.country}</span>
              <span className="v3-city-card-region">{city.region}</span>
              <div className="v3-city-card-bars">
                {PILLAR_ORDER.map((pillar) => (
                  <div
                    key={pillar}
                    style={{
                      width: `${city[`${pillar}Score` as keyof typeof city] as number}%`,
                      background: PILLAR_COLORS[pillar],
                    }}
                  />
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="hp-photo-break hp-photo-break--narrow">
        <img
          src={STAGE_PHOTO}
          alt="Dr Non presenting SLIC on stage"
          className="hp-photo-break-img"
          width={5997}
          height={4000}
          loading="lazy"
        />
        <p className="hp-photo-caption">
          {t(
            locale,
            "On stage in Taipei. The pitch was simple: replace lifestyle fantasy with an auditable city metric.",
            "บนเวทีที่ไทเป ข้อเสนอเรียบง่ายมาก: เปลี่ยนภาพฝันแบบไลฟ์สไตล์ให้เป็นเมตริกเมืองที่ตรวจสอบได้",
            "在台北的舞台上，主张很简单：用可审计的城市指标，取代生活方式幻象。",
          )}
        </p>
      </section>

      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; BETA</span>
          <div className="v3-lower-tier-cities">
            {publishedBoard.slice(10, 20).map((city) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{city.rank}</span>
                <span className="v3-tier-chip-body">
                  <strong>{city.displayName}</strong>
                  <span>{city.country}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--gamma">&gamma; GAMMA</span>
          <div className="v3-lower-tier-cities">
            {publishedBoard.slice(20, 30).map((city) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{city.rank}</span>
                <span className="v3-tier-chip-body">
                  <strong>{city.displayName}</strong>
                  <span>{city.country}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">
            {t(locale, "Now test the weights yourself.", "ตอนนี้ลองทดสอบน้ำหนักด้วยตัวเอง", "现在自己测试这些权重。")}
          </h2>
          <p className="v3-spider-hint">
            {t(
              locale,
              "Drag the spider. This does not overwrite the published board; it creates a personal comparison view using the same five pillars.",
              "ลากใยแมงมุมได้เลย การทำเช่นนี้ไม่ได้เขียนทับบอร์ดที่เผยแพร่ แต่สร้างมุมมองเปรียบเทียบส่วนบุคคลจาก 5 เสาหลักเดียวกัน",
              "拖动蛛网图即可。这不会改写已发布榜单，而是用同样的五个支柱生成你的个人对比视图。",
            )}
          </p>
          <div className="v3-spider-layout">
            <div className="v3-spider-chart">
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} />
              <button type="button" className="rankings-reset-btn" onClick={handleReset}>
                {ui.resetLabel}
              </button>
            </div>
            <div className="v3-spider-results">
              {consequences.length > 0 && (
                <div className="v3-tradeoffs">
                  {consequences.slice(0, 3).map((consequence) => (
                    <div key={consequence.id} className={severityClass[consequence.severity]}>
                      <p>{consequence.narrative}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="v3-spider-list">
                {results.slice(0, 15).map((city, index) => (
                  <a
                    key={city.cityId}
                    className="v3-spider-row"
                    href={appHref(`/city/${city.cityId}`)}
                    onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                  >
                    <span className="v3-spider-rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="v3-spider-name">{city.displayName}</span>
                    <span className="v3-spider-score">{city.customScore.toFixed(1)}</span>
                    <span className="v3-spider-country">{city.country}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="v3-cta-section section">
        <a
          className="v3-cta"
          href={appHref("/methodology")}
          onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
        >
          {t(locale, "Read the methodology", "อ่านระเบียบวิธี", "阅读方法论")}
        </a>
        <a
          className="v3-cta-secondary"
          href={appHref("/about-slic")}
          onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}
        >
          {t(locale, "About SLIC", "เกี่ยวกับ SLIC", "关于 SLIC")}
        </a>
        <a
          className="v3-cta-secondary"
          href={appHref("/history")}
          onClick={(event) => navigateLink(event, onNavigate, "/history")}
        >
          {t(locale, "How it was built", "เบื้องหลังการสร้าง", "它是如何被建造出来的")}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
