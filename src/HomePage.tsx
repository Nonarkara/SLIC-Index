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
/** Canonical SLIC weights matching the published score (sum = 100). */
const CANONICAL_WEIGHTS: Record<PillarId, number> = {
  pressure: 25,
  viability: 22,
  capability: 18,
  community: 15,
  creative: 20,
};
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const HERO_PHOTO = `${BASE}/launch-photos/20260318145941_DSC09480.jpg`;
const METHOD_PHOTO = `${BASE}/launch-photos/20260318145319_DSC09441.jpg`;
const STAGE_PHOTO = `${BASE}/launch-photos/20260318145249_ABC01948.jpg`;
const SHOWFLOOR_PHOTO = `${BASE}/launch-photos/20260318151147_DSC09510.jpg`;
const GITEX_STAGE_PHOTO = `${BASE}/launch-photos/gitex-singapore-2026-02.jpg`;
const LEAP_EAST_PHOTO = `${BASE}/launch-photos/leap-east-hong-kong-2026.png`;

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

/**
 * AMPI across pillars — matches the published SLIC aggregation.
 *
 *   μ    = weighted mean of pillar scores (with user-chosen weights)
 *   σ²   = weighted variance
 *   AMPI = μ − σ²/μ   (penalises pillar imbalance)
 */
function scoreCityWithWeights(city: HomeCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((sum, pillar) => sum + weights[pillar], 0);
  if (total === 0) return 0;

  const pillarValues: Array<[number, number]> = PILLAR_ORDER
    .map((p) => [city[`${p}Score` as keyof HomeCity] as number, weights[p]] as [number, number])
    .filter(([s]) => s != null);

  if (pillarValues.length === 0) return 0;

  const sumW = pillarValues.reduce((s, [, w]) => s + w, 0);
  if (sumW === 0) return 0;

  const mu = pillarValues.reduce((s, [v, w]) => s + v * w, 0) / sumW;
  if (pillarValues.length < 2 || mu === 0) return Math.max(0, Math.min(100, mu));

  const variance = pillarValues.reduce((s, [v, w]) => s + w * (v - mu) ** 2, 0) / sumW;
  const ampi = mu - variance / mu;
  return Math.max(0, Math.min(100, ampi));
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
      value: CANONICAL_WEIGHTS[id],
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

  // Both the top tier cards and the spider results read from this. One source
  // of truth: the published 160-city board, live-scored under the current
  // weight profile. At the canonical default, this exactly matches each city's
  // stored slicScore. When the user drags the spider, every tier card updates
  // in lockstep.
  const results = useMemo(
    () =>
      publishedBoard
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
        value: CANONICAL_WEIGHTS[id],
      })),
    );

  const formattedVisitors = new Intl.NumberFormat(localeNumberFormat[locale]).format(visitors);

  return (
    <>
      <header className="hp-opening">
        <div className="hp-opening-media" aria-hidden="true">
          <img
            src={HERO_PHOTO}
            alt=""
            width={6000}
            height={4000}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="hp-opening-inner section">
          <p className="hp-kicker">
            {t(locale, "THE CITY RANKING THAT SHOWS ITS SOURCES", "ดัชนีเมืองที่เปิดเผยแหล่งที่มาทุกตัวเลข", "唯一公开每条数据来源的城市排名")}
          </p>
          <p className="hp-lede">
            {t(
              locale,
              "Most city rankings are someone's opinion dressed as data. SLIC publishes the math.",
              "ดัชนีเมืองส่วนใหญ่คือความเห็นที่แต่งตัวเป็นข้อมูล SLIC เผยแพร่ตัวเลขที่ตรวจสอบได้",
              "大多数城市排名是裹着数据外衣的观点。SLIC 发布可验证的数字。",
            )}
          </p>
          <h1 className="hp-headline">
            {t(
              locale,
              "The others are brochures. This one is an audit.",
              "ดัชนีอื่นเป็นโบรชัวร์ ดัชนีนี้คือการตรวจสอบ",
              "其他的是宣传册。这一个是审计。",
            )}
          </h1>
          <p className="hp-deck">
            {t(
              locale,
              "160 published cities. One declared score per city, traced through five public pillars: pressure, viability, capability, community, and creative momentum.",
              "160 เมืองที่เผยแพร่แล้ว แต่ละเมืองมีคะแนนที่ประกาศชัดเจนหนึ่งค่า และสามารถไล่ย้อนกลับได้ผ่าน 5 เสาหลักสาธารณะ: แรงกดดัน ความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์",
              "160 座已发布城市。每座城市对应一个公开分数，并可追溯到五个公开支柱：压力、宜居性、能力、社区与创造动能。",
            )}
          </p>
          <div className="hp-opening-actions">
            <a
              className="hp-cta-primary"
              href={appHref("/rankings")}
              onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
            >
              {t(locale, "See all 160 cities", "ดูเมืองทั้ง 160 แห่ง", "查看全部 160 座城市")} →
            </a>
            <a
              className="hp-cta-secondary"
              href={appHref("/map")}
              onClick={(event) => navigateLink(event, onNavigate, "/map")}
            >
              {t(locale, "Open global map", "แผนที่โลก", "打开全球地图")}
            </a>
            <a
              className="hp-cta-secondary"
              href={appHref("/compare")}
              onClick={(event) => navigateLink(event, onNavigate, "/compare")}
            >
              {t(locale, "Compare with other indices", "เปรียบเทียบกับดัชนีอื่น", "与其他指数对比")}
            </a>
          </div>

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
          <p className="hp-opening-credit">
            {t(
              locale,
              "Smart City Summit & Expo 2026, Taipei",
              "Smart City Summit & Expo 2026, ไทเป",
              "2026 台北智慧城市峰会",
            )}
          </p>
        </div>
      </header>

      <section className="hp-photo-break">
        <img
          src={METHOD_PHOTO}
          alt="SLIC presentation slide at Smart City Summit and Expo 2026"
          className="hp-photo-break-img"
          width={6000}
          height={4000}
          loading="lazy"
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
          {results.slice(0, 10).map((city, idx) => (
              <a
                key={city.cityId}
                className="v3-city-card"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                style={{ "--city-accent": PILLAR_COLORS[leadPillarForCity(city)] } as CSSProperties}
              >
              <span className="v3-city-card-meta">
                <span className="v3-city-card-rank">#{String(idx + 1).padStart(2, "0")}</span>
                <span>{t(locale, "Published board", "บอร์ดที่เผยแพร่", "已发布榜单")}</span>
              </span>
              <div className="v3-city-card-topline">
                <span className="v3-city-card-name">{city.displayName}</span>
                <span className="v3-city-card-score">{city.customScore.toFixed(1)}</span>
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
          src={SHOWFLOOR_PHOTO}
          alt="Dr Non at Smart City Summit Taipei show floor"
          className="hp-photo-break-img"
          width={5997}
          height={4000}
          loading="lazy"
        />
        <p className="hp-photo-caption">
          {t(
            locale,
            "On the floor in Taipei. The pitch was simple: replace lifestyle fantasy with an auditable city metric.",
            "บนโถงงานที่ไทเป ข้อเสนอเรียบง่ายมาก: เปลี่ยนภาพฝันแบบไลฟ์สไตล์ให้เป็นเมตริกเมืองที่ตรวจสอบได้",
            "在台北的展会现场，主张很简单：用可审计的城市指标，取代生活方式幻象。",
          )}
        </p>
      </section>

      <section className="hp-launch-trail section">
        <p className="eyebrow">{t(locale, "GLOBAL LAUNCH TRAIL", "เส้นทางเปิดตัวทั่วโลก", "全球发布路线")}</p>
        <h2 className="hp-launch-trail-title">
          {t(
            locale,
            "Taking SLIC to the rooms where decisions get made.",
            "นำ SLIC สู่ห้องที่การตัดสินใจเกิดขึ้น",
            "将 SLIC 带入决策发生的场合。",
          )}
        </h2>
        <div className="hp-launch-trail-grid">
          <div className="hp-launch-event">
            <div className="hp-launch-event-photo">
              <img src={STAGE_PHOTO} alt="SLIC keynote, Smart City Summit Taipei 2026" loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag">Taipei</span>
              <span className="hp-launch-event-date">March 2026</span>
              <p>{t(
                locale,
                "Smart City Summit & Expo — keynote to 3,000+ professionals. The largest smart city event in Asia.",
                "Smart City Summit & Expo — keynote ต่อหน้า 3,000+ คน งานเมืองอัจฉริยะที่ใหญ่ที่สุดในเอเชีย",
                "智慧城市峰会——向 3,000 余名专业人士发表主题演讲。亚洲最大智慧城市活动。",
              )}</p>
            </div>
          </div>

          <div className="hp-launch-event">
            <div className="hp-launch-event-photo">
              <img src={GITEX_STAGE_PHOTO} alt="Dr Non, main-stage keynote at GITEX AI Asia Singapore 2026" loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag">Singapore</span>
              <span className="hp-launch-event-date">April 2026</span>
              <p>{t(
                locale,
                "GITEX AI Asia, Marina Bay Sands — main-stage keynote and Government Innovation as a Service workshop. 23,000+ attendees from 110+ countries.",
                "GITEX AI Asia, Marina Bay Sands — keynote บนเวทีหลักและเวิร์กช็อป Government Innovation as a Service ผู้เข้าร่วมกว่า 23,000 คนจาก 110+ ประเทศ",
                "GITEX AI Asia，滨海湾金沙——主舞台主题演讲及「政府创新即服务」工作坊。23,000 余名观众，110 余个国家。",
              )}</p>
            </div>
          </div>

          <div className="hp-launch-event hp-launch-event--upcoming">
            <div className="hp-launch-event-photo hp-launch-event-photo--graphic">
              <img src={LEAP_EAST_PHOTO} alt="Dr Non speaking at LEAP EAST, Hong Kong, 8–10 July 2026" loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag hp-launch-event-tag--upcoming">Hong Kong</span>
              <span className="hp-launch-event-date">July 2026</span>
              <p>{t(
                locale,
                "LEAP EAST, HKCEC — Asia's leading conference for innovation leaders and investors. 8–10 July 2026.",
                "LEAP EAST, HKCEC — งานประชุมชั้นนำในเอเชียสำหรับผู้นำด้านนวัตกรรมและนักลงทุน 8–10 กรกฎาคม 2569",
                "LEAP EAST，香港会展中心——亚洲领先的创新领袖与投资者峰会。2026 年 7 月 8–10 日。",
              )}</p>
            </div>
          </div>
        </div>

        <div className="hp-launch-reach">
          <div className="hp-launch-reach-stat">
            <span className="hp-launch-reach-number">10,000+</span>
            <span className="hp-launch-reach-label">
              {t(locale, "people have accessed the SLIC Index", "ผู้เข้าถึง SLIC Index", "人次访问 SLIC 指数")}
            </span>
          </div>
          <div className="hp-launch-reach-stat">
            <span className="hp-launch-reach-number">5,000+</span>
            <span className="hp-launch-reach-label">
              {t(
                locale,
                "have seen SLIC presented live in Taipei and Singapore",
                "ได้เห็นการนำเสนอ SLIC สดที่ไทเปและสิงคโปร์",
                "现场观看了 SLIC 在台北与新加坡的演讲",
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; BETA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(10, 20).map((city, idx) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{idx + 11}</span>
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
            {results.slice(20, 30).map((city, idx) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{idx + 21}</span>
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
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} locale={locale} />
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
