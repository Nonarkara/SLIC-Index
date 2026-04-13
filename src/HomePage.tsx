import { type CSSProperties, type MouseEvent, useEffect, useMemo, useState } from "react";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import { getExerciseCities } from "./rankingsData";
import SiteFooter from "./SiteFooter";
import type { PillarAllocation } from "./ZeroSumAllocator";
import ZeroSumAllocator from "./ZeroSumAllocator";
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

const rankedCities: HomeCity[] = getExerciseCities().map((city) => ({
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
      rankedCities
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
          <h1 className="hp-headline">
            {t(
              locale,
              "Where can you still build a life?",
              "เมืองไหนยังสร้างชีวิตได้จริง?",
              "哪座城市还容得下真正的生活？",
            )}
          </h1>
          <p className="hp-deck">
            {t(
              locale,
              "157 cities, ranked by what remains after rent, time pressure, safety, dignity, and room for ambition. Not prestige. Not fantasy. Daily life.",
              "157 เมือง จัดอันดับจากสิ่งที่เหลืออยู่หลังค่าเช่า เวลาที่ถูกบีบ ความปลอดภัย ศักดิ์ศรี และพื้นที่ให้ความทะเยอทะยาน ไม่ใช่ชื่อเสียง ไม่ใช่ภาพฝัน แต่คือชีวิตประจำวัน",
              "157 座城市，按照房租之后还剩下什么、时间压力、安全、尊严与抱负空间来排序。不是名望，不是幻觉，而是日常生活。",
            )}
          </p>
          <div className="hp-opening-stats">
            <span className="hp-opening-stat">
              <strong>{rankedCities.length}</strong>
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
            "Smart City Summit & Expo 2026, Taipei. SLIC entered the room as a public argument, not a brand deck.",
            "Smart City Summit & Expo 2026, ไทเป — SLIC เปิดตัวในฐานะข้อถกเถียงสาธารณะ ไม่ใช่เพียงสไลด์ขายภาพลักษณ์",
            "2026 台北智慧城市峰会。SLIC 作为一套公开论点进入现场，而不是一份品牌演示稿。",
          )}
        </p>
      </section>

      <section className="hp-thesis section">
        <div className="hp-thesis-inner">
          <h2 className="hp-thesis-title">
            {t(
              locale,
              "Every city ranking is an argument.\nThis one states its terms.",
              "ทุกการจัดอันดับเมืองคือข้อถกเถียง\nดัชนีนี้บอกเงื่อนไขของตัวเองตรงๆ",
              "每个城市排名都是一种立场。\n这个排名把自己的前提说清楚。",
            )}
          </h2>
          <p className="hp-thesis-body">
            {t(
              locale,
              "Many global lists reward executive comfort, expat stability, or polished lifestyle theatre. SLIC asks where ordinary people can still afford life, keep dignity, find community, and preserve some ambition after the bills are paid.",
              "หลายดัชนีเมืองให้รางวัลกับความสะดวกสบายของผู้บริหาร ความมั่นคงของชาวต่างชาติ หรือภาพลักษณ์ไลฟ์สไตล์ที่ถูกจัดฉาก แต่ SLIC ถามว่าคนธรรมดายังมีชีวิตที่จ่ายไหว รักษาศักดิ์ศรี มีชุมชน และเหลือพลังให้ความใฝ่ฝันอยู่ที่ไหน",
              "许多全球榜单奖励的是高管舒适感、外派稳定性，或被精心包装的生活方式。SLIC 问的是：普通人在哪里还负担得起生活、保有尊严、找到社区，并在付完账单后仍留得住抱负。",
            )}
          </p>
          <a
            className="hp-thesis-link"
            href="/compare"
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
              "The published leaders, in order.",
              "ผู้นำของบอร์ดฉบับเผยแพร่ เรียงตามลำดับจริง",
              "已发布榜单的领先城市，按真实顺序排列。",
            )}
          </h2>
        </div>
        <div className="v3-alpha-grid section">
          {results.slice(0, 10).map((city, index) => (
            <a
              key={city.cityId}
              className="v3-city-card"
              href={`/city/${city.cityId}`}
              onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              style={{ "--city-accent": PILLAR_COLORS[leadPillarForCity(city)] } as CSSProperties}
            >
              <span className="v3-city-card-meta">
                <span className="v3-city-card-rank">#{String(index + 1).padStart(2, "0")}</span>
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
            "On stage in Taipei. The pitch was simple: replace lifestyle fantasy with auditable city life.",
            "บนเวทีที่ไทเป ข้อเสนอมีเพียงอย่างเดียว: เปลี่ยนภาพฝันแบบไลฟ์สไตล์ให้เป็นคุณภาพชีวิตเมืองที่ตรวจสอบได้",
            "在台北的舞台上，主张很简单：用可审计的城市生活，取代生活方式幻象。",
          )}
        </p>
      </section>

      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; BETA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(10, 20).map((city, index) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={`/city/${city.cityId}`}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{index + 11}</span>
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
            {results.slice(20, 30).map((city, index) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={`/city/${city.cityId}`}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
              >
                <span className="v3-tier-chip-rank">#{index + 21}</span>
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
            {t(locale, "Now disagree with us.", "ตอนนี้ลองไม่เห็นด้วยกับเรา", "现在来反驳我们")}
          </h2>
          <p className="v3-spider-hint">
            {t(
              locale,
              "Drag the spider. Push growth to 100% and fast-moving cities rise. Push viability and calmer, cleaner places take over. This board is yours, not ours.",
              "ลากใยแมงมุม แล้วลองดันการเติบโตให้สุด เมืองที่กำลังพุ่งจะขึ้นมา ดันความน่าอยู่ให้สุด เมืองที่สงบและสะอาดจะลอยขึ้น นี่คืออันดับของคุณ ไม่ใช่ของเรา",
              "拖动蛛网图。把增长拉满，快速上升的城市会冲上来；把宜居拉满，更安静干净的城市会浮上去。这是你的榜单，不是我们的。",
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
                    href={`/city/${city.cityId}`}
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
          href="/methodology"
          onClick={(event) => navigateLink(event, onNavigate, "/methodology")}
        >
          {t(locale, "Read the methodology", "อ่านระเบียบวิธี", "阅读方法论")}
        </a>
        <a
          className="v3-cta-secondary"
          href="/about-slic"
          onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}
        >
          {t(locale, "About SLIC", "เกี่ยวกับ SLIC", "关于 SLIC")}
        </a>
        <a
          className="v3-cta-secondary"
          href="/history"
          onClick={(event) => navigateLink(event, onNavigate, "/history")}
        >
          {t(locale, "How it was built", "เบื้องหลังการสร้าง", "它是如何被建造出来的")}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
