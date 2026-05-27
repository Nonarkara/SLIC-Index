import { type CSSProperties, type MouseEvent, useEffect, useMemo, useState } from "react";
import { displayCountry } from "./cityUtils";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import { allocatePublicTiers, assignPureScoreRanks, getDisplayAlphaCityExclusions, PUBLIC_TIER_RULES } from "./publicTierPolicy.js";
import { rankingPublication } from "./rankingPublication";
import SiteFooter from "./SiteFooter";
import type { PillarAllocation } from "./ZeroSumAllocator";
import ZeroSumAllocator from "./ZeroSumAllocator";
import { t } from "./i18n";
import { appHref } from "./routing";
import { scoreCityWithWeights } from "./scoring";
import type { Locale, SitePath } from "./types";
import { getVisitorStats } from "./visitorTracking";

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

interface HomeCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  rankingStatus: string;
  tierLabel: "Alpha" | "Beta" | "Gamma" | null;
  tierSlot: number | null;
  tierReason?: string | null;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  coveragePenalty: number;
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
    rankingStatus: city.rankingStatus,
    tierLabel: city.tierLabel ?? null,
    tierSlot: city.tierSlot ?? null,
    tierReason: city.tierReason ?? null,
    pressureScore: city.pressureScoreExact ?? city.pressureScore ?? 0,
    viabilityScore: city.viabilityScoreExact ?? city.viabilityScore ?? 0,
    capabilityScore: city.capabilityScoreExact ?? city.capabilityScore ?? 0,
    communityScore: city.communityScoreExact ?? city.communityScore ?? 0,
    creativeScore: city.creativeScoreExact ?? city.creativeScore ?? 0,
    coveragePenalty: city.coveragePenalty ?? 0,
    slicScore: city.slicScore,
    rank: city.rank,
  }))
  .sort((left, right) => left.rank - right.rank);
const publishedRankedCount = publishedBoard.filter((city) => city.rankingStatus === "Ranked").length;
const publishedWatchlistCount = rankingPublication.cities.length - publishedRankedCount;

// Bangkok is the canonical worked example for the rank-vs-Alpha distinction.
// Pull its live numbers so the bridge copy never goes stale.
const bangkokWorked = rankingPublication.cities.find((c) => c.cityId === "th-bangkok");
const bangkokRank = bangkokWorked?.rank ?? 27;
const bangkokAlphaSlot = bangkokWorked?.tierSlot ?? 9;
const bangkokCommunity = bangkokWorked?.communityScore?.toFixed(1) ?? "90.0";
const bangkokPressure = bangkokWorked?.pressureScore?.toFixed(1) ?? "45.4";
const bangkokCoverage = bangkokWorked?.coverageGrade ?? "A";
const alphaCountryExclusionList = PUBLIC_TIER_RULES.alphaCountryExclusions.join(", ") || "none";
const alphaCityExclusionList = getDisplayAlphaCityExclusions().join(", ") || "none";

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
  // of truth: the published board, live-scored under the current
  // weight profile. At the canonical default, this exactly matches each city's
  // stored slicScore. When the user drags the spider, every tier card updates
  // in lockstep.
  const results = useMemo(
    () =>
      publishedBoard
        .filter((city) => city.rankingStatus === "Ranked")
        .map((city) => {
          const ampi = scoreCityWithWeights({
            pressure: city.pressureScore,
            viability: city.viabilityScore,
            capability: city.capabilityScore,
            community: city.communityScore,
            creative: city.creativeScore,
          }, weights);
          // Apply the publication-time coverage penalty (0 for grade A, 5 for B, 15 for C)
          // so the live customScore matches the published slicScore at canonical weights.
          const exact = Math.max(0, ampi - city.coveragePenalty);
          return {
            ...city,
            // exact: used for ranking & tier allocation so ties resolve identically to the published board
            customScoreExact: exact,
            // rounded: shown in the UI
            customScore: Math.round(exact * 10) / 10,
          };
        })
        .sort((a, b) => b.customScoreExact - a.customScoreExact),
    [weights],
  );

  const tieredResults = useMemo(() => {
    const rankedResults = assignPureScoreRanks(results, {
      scoreKey: "customScoreExact",
      rankKey: "customRank",
    });
    const tiered = allocatePublicTiers(rankedResults, {
      scoreKey: "customScoreExact",
      rankKey: "customRank",
      tierLabelKey: "computedTierLabel",
      tierSlotKey: "computedTierSlot",
      tierReasonKey: "computedTierReason",
    });
    return {
      alpha: tiered.filter((city) => city.computedTierLabel === "Alpha"),
      beta: tiered.filter((city) => city.computedTierLabel === "Beta"),
      gamma: tiered.filter((city) => city.computedTierLabel === "Gamma"),
    };
  }, [results]);

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
            {t(locale, "MEASURED FOR RESIDENTS, NOT FOR BUYERS.", "วัดเพื่อผู้อยู่อาศัย ไม่ใช่เพื่อผู้ซื้อ", "为居民而量，不为买家而排。")}
          </p>
          <p className="hp-lede">
            {t(
              locale,
              "Most city rankings evaluate cities for people who already have the money to live there.",
              "ดัชนีเมืองส่วนใหญ่เลือกตัวชี้วัดแบบผิวเผินเพื่อประเมินเมืองให้กับ \"คนที่มีเงินพอจะอาศัยอยู่ที่นั่นอยู่แล้ว\" (คนรวย) แต่ดัชนีนี้เปิดเผยแหล่งที่มาทุกตัวเลข เลือกและวิเคราะห์ตัวชี้วัดเพื่อทำให้เราสามารถมองเห็น",
              "大多数城市排名是为那些已经有钱住在那里的人评估城市。",
            )}
          </p>
          <h1 className="hp-headline">
            {locale === "th" ? (
              <>เมืองที่มีการเติบโตและใช้ชีวิตได้ดีล้วน ๆ{" "}<span className="hp-headline--accent">ไม่มีโฆษณาชวนเชื่อมาผสม</span></>
            ) : locale === "zh" ? (
              <>既在增长，也还住得起。<span className="hp-headline--accent">其余都是营销。</span></>
            ) : (
              <>Thriving, and still affordable.{" "}<span className="hp-headline--accent">Everything else is marketing.</span></>
            )}
          </h1>
          <p className="hp-deck">
            {t(
              locale,
              `${publishedRankedCount} ranked cities plus a ${publishedWatchlistCount}-city conflict-zone and low-coverage watchlist. One declared score per city, traced through five public pillars: pressure, viability, capability, community, and creative momentum. Alpha requires a liveability floor — no city trades its residents for its skyline.`,
              `${publishedRankedCount} เมืองในการจัดอันดับ พร้อมรายชื่อเฝ้าระวัง ${publishedWatchlistCount} เมืองสำหรับเขตขัดแย้งและข้อมูลไม่สมบูรณ์ แต่ละเมืองมีคะแนนที่ประกาศชัดเจนหนึ่งค่า และสามารถไล่ย้อนกลับได้ผ่าน 5 เสาหลักสาธารณะ ได้แก่ แรงกดดัน ความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์ ระดับ Alpha ต้องผ่านเกณฑ์ขั้นต่ำของความน่าอยู่ — ไม่มีเมืองใดที่ยอมแลกผู้คนกับภาพลักษณ์`,
              `${publishedRankedCount} 座已排名城市，另设 ${publishedWatchlistCount} 座冲突区与数据覆盖观察名单城市。每座城市对应一个公开分数，可追溯到五个公开支柱：压力、宜居性、能力、社区与创造动能。Alpha 级须跨过宜居门槛——没有哪座城市能用居民换天际线。`,
            )}
          </p>
          <div className="hp-opening-actions">
            <a
              className="hp-cta-primary"
              href={appHref("/rankings")}
              onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
            >
              {t(locale, `See all ${publishedRankedCount} cities`, `ดูเมืองทั้ง ${publishedRankedCount} แห่ง`, `查看全部 ${publishedRankedCount} 座城市`)} →
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
              "Every ranking has hidden assumptions.\nWe published ours.",
              "ทุกดัชนีมีสมมติฐานที่ซ่อนอยู่\nเราเผยแพร่ของเราให้สาธารณะ",
              "每份排名都有隐藏的假设。\n我们把自己的公开了。",
            )}
          </h2>
          <p className="hp-thesis-body">
            {t(
              locale,
              "Five declared pillars. Twenty scored metric lines plus three visible diagnostics, each value traced back to its source. No imputation, no paid placement, no composite buried in a PDF you have to trust. Disagree with the weights? Good — drag them below and see what actually changes.",
              "ห้าเสาหลักที่ประกาศชัด ยี่สิบ metric line ที่ให้คะแนนพร้อมสาม diagnostic ที่มองเห็นได้ ทุกค่าตรวจสอบกลับไปยังแหล่งที่มาได้ ไม่มีการเติมข้อมูล ไม่มีเมืองจ่ายเงินเพื่อเข้าร่วม ไม่มีสูตรซ่อนในไฟล์ PDF ที่ต้องเชื่อโดยดุษณี ไม่เห็นด้วยกับน้ำหนัก? ดีมาก — ลากด้านล่างแล้วดูว่าอะไรเปลี่ยน",
              "五个公开支柱。二十条计分指标加三条可见的诊断指标，每个数值都可追溯到来源。没有数据填充，没有付费排名，没有藏在 PDF 里叫你盲目相信的公式。不同意这些权重？很好——拖动下方滑块，看看什么真的会变。",
            )}
          </p>
          <a
            className="hp-thesis-link"
            href={appHref("/compare")}
            onClick={(event) => navigateLink(event, onNavigate, "/compare")}
          >
            {t(locale, "See how SLIC compares to EIU, Mercer, and Resonance", "เปรียบเทียบ SLIC กับ EIU, Mercer และ Resonance", "对比 SLIC 与 EIU、美世、Resonance")} &rarr;
          </a>
        </div>
      </section>

      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">&alpha; ALPHA</span>
          <h2 className="v3-alpha-title">
            {t(
              locale,
              "The publishable ten. Every number traced to a source.",
              "สิบเมืองที่เผยแพร่ได้จริง ตัวเลขทุกค่าย้อนกลับสู่แหล่งที่มาได้",
              "可发布的十座城市。每个数字都可追溯至来源。",
            )}
          </h2>
          <div className="v3-alpha-bridge">
            <p className="v3-alpha-bridge-headline">
              {t(
                locale,
                "Alpha is curated, not counted.",
                "Alpha คือชั้นที่คัดเลือก ไม่ใช่ชั้นที่นับคะแนน",
                "Alpha 是经编辑挑选，而非按分计票。",
              )}
            </p>
            <p className="v3-alpha-bridge-body">
              {t(
                locale,
                `It is the editorial overlay reserved for cities where the median resident actually thrives — not the top ten by pure score. Cities with higher pure rank can fail a gate (floor scores, ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}-grade coverage, country cap, editorial exclusion); cities with lower pure rank can earn a seat. Bangkok is the worked example: pure rank #${bangkokRank}, Alpha slot ${bangkokAlphaSlot}. Community ${bangkokCommunity} and Pressure ${bangkokPressure} clear the floor, coverage is ${bangkokCoverage}, Thailand's seat is uncontested, no exclusion blocks it. Travel-cost evidence strengthens the public story: Bangkok combines major global visitor pull with unusually low everyday food, transport, and lodging costs, but that evidence is context, not a hidden score boost.`,
                `คือชั้นบรรณาธิการที่สงวนไว้ให้กับเมืองที่ผู้อยู่อาศัยมัธยฐานเจริญงอกงามจริง — ไม่ใช่ top-10 ตามคะแนนล้วน เมืองที่อันดับคะแนนสูงกว่าอาจไม่ผ่านประตู (เกณฑ์ขั้นต่ำ coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade} เพดานประเทศ การกีดกันบรรณาธิการ) เมืองที่อันดับคะแนนต่ำกว่าอาจได้ที่นั่ง กรุงเทพฯ คือตัวอย่าง: อันดับล้วน #${bangkokRank} · Alpha สล็อตที่ ${bangkokAlphaSlot} · Community ${bangkokCommunity} และ Pressure ${bangkokPressure} ผ่านพื้น · coverage ${bangkokCoverage} · ที่นั่งของไทยไม่มีคู่แข่ง · ไม่มีการกีดกัน หลักฐานต้นทุนการเดินทางช่วยเสริมเรื่องเล่าสาธารณะ: กรุงเทพฯ มีแรงดึงดูดนักเดินทางระดับโลกพร้อมต้นทุนอาหาร การเดินทาง และที่พักที่ยังต่ำผิดปกติ แต่หลักฐานนี้เป็นบริบท ไม่ใช่คะแนนแฝง`,
                `它是为中位居民真正安居的城市保留的编辑层 —— 而非按纯分排出的前 10。纯分更高的城市可能未通过门槛（底线、${PUBLIC_TIER_RULES.alphaMinCoverageGrade} 级覆盖、国家上限、编辑排除）；纯分更低的城市可能赢得席位。曼谷是范例：纯分第 ${bangkokRank} · Alpha 第 ${bangkokAlphaSlot} 席 · 社区 ${bangkokCommunity}、压力 ${bangkokPressure} 越过底线 · 覆盖 ${bangkokCoverage} · 泰国席位无人争夺 · 不在任何排除清单上。旅行成本证据强化了公开叙事：曼谷兼具全球游客吸引力与异常低的日常餐饮、交通、住宿成本，但这只是背景证据，不是隐藏加分。`,
              )}
            </p>
          </div>
          <p className="v3-alpha-subtitle">
            {t(
              locale,
              `Each country holds at most one Alpha seat, with a few exceptions for regions where SLIC has strong multi-city data (two seats for Japan and East Asia). Alpha requires both Community and Pressure scores above ${PUBLIC_TIER_RULES.alphaMinCommunity}, plus ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}-grade coverage — a liveability floor, not just a high overall score. Europe holds ${PUBLIC_TIER_RULES.maxEuropeInAlpha} Alpha seats; Oceania holds none (purchase and rental costs exceed the median-resident threshold Alpha requires). Some cities are excluded from Alpha specifically because of housing cost — not because they are bad cities, but because Alpha is reserved for cities where a person on a local salary can actually build a life. The full tier policy is published in the methodology.`,
              `แต่ละประเทศมีที่นั่ง Alpha ได้สูงสุดหนึ่งที่ โดยมีข้อยกเว้นสำหรับภูมิภาคที่ SLIC มีข้อมูลเมืองหลายแห่งที่แข็งแกร่ง Alpha ต้องมีคะแนน Community และ Pressure เกิน ${PUBLIC_TIER_RULES.alphaMinCommunity} ทั้งคู่ พร้อม coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade} — เป็นเกณฑ์ขั้นต่ำด้านความน่าอยู่ ไม่ใช่แค่คะแนนรวมสูง บางเมืองถูกกันออกจาก Alpha เพราะค่าครองชีพ ไม่ใช่เพราะเป็นเมืองแย่ แต่เพราะ Alpha สงวนไว้สำหรับเมืองที่คนมีรายได้ท้องถิ่นสามารถสร้างชีวิตได้จริง นโยบายชั้นฉบับเต็มเผยแพร่ในหน้าระเบียบวิธี`,
              `原则上每国一个 Alpha 席位，部分地区因 SLIC 拥有多城强数据而有例外（如日本和东亚可占两席）。Alpha 要求 Community 与 Pressure 都高于 ${PUBLIC_TIER_RULES.alphaMinCommunity}，且覆盖等级达到 ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}——这是宜居门槛，不只是总分高。大洋洲不设 Alpha 席位，因为该区域的购房与租房成本超出了 Alpha 所要求的中位居民可负担线。部分城市因住房成本被排除在 Alpha 之外——不是因为它们不好，而是 Alpha 专为当地薪资水平的人也能真正安家的城市保留。完整的分层政策已在方法论页面公开。`,
            )}
          </p>
        </div>
        <div className="v3-alpha-grid section">
          {tieredResults.alpha.map((city) => (
              <a
                key={city.cityId}
                className="v3-city-card"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                title={city.computedTierReason ?? city.tierReason ?? undefined}
                style={{ "--city-accent": PILLAR_COLORS[leadPillarForCity(city)] } as CSSProperties}
              >
              <span className="v3-city-card-meta">
                <span className="v3-city-card-rank">#{String(city.rank).padStart(2, "0")}</span>
                <span>{t(locale, "Published board", "บอร์ดที่เผยแพร่", "已发布榜单")}</span>
              </span>
              <div className="v3-city-card-topline">
                <span className="v3-city-card-name">{city.displayName}</span>
                <span className="v3-city-card-score">{city.customScore.toFixed(1)}</span>
              </div>
              {displayCountry(city.country) && <span className="v3-city-card-country">{displayCountry(city.country)}</span>}
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
            "A city ranking is only useful if it enters the rooms where city decisions get made. Here is where SLIC has gone — and where it is scheduled next.",
            "ดัชนีเมืองมีประโยชน์ก็ต่อเมื่อได้เข้าสู่ห้องที่การตัดสินใจเรื่องเมืองเกิดขึ้นจริง นี่คือที่ที่ SLIC ไปมาแล้ว — และเวทีถัดไปที่มีกำหนด",
            "城市排名只有进入真正做城市决策的场合才有意义。这里是 SLIC 已经去过的地方，以及下一站安排。",
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
              <img src={LEAP_EAST_PHOTO} alt="LEAP EAST Hong Kong event card, 8–10 July 2026" loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag hp-launch-event-tag--upcoming">Hong Kong</span>
              <span className="hp-launch-event-date">July 2026</span>
              <p>{t(
                locale,
                "Scheduled next: LEAP EAST, HKCEC — Asia's leading conference for innovation leaders and investors, 8–10 July 2026.",
                "เวทีถัดไปที่มีกำหนด: LEAP EAST, HKCEC — งานประชุมชั้นนำในเอเชียสำหรับผู้นำด้านนวัตกรรมและนักลงทุน 8–10 กรกฎาคม 2569",
                "下一站已排期：LEAP EAST，香港会展中心——亚洲领先的创新领袖与投资者峰会，2026 年 7 月 8–10 日。",
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
        <p className="v3-lower-tier-lede">
          {t(
            locale,
            `Beta and Gamma are a separate public tier overlay, not simple rank bands. Cities can cascade here when Alpha caps bind, when a compatriot already took a public slot, or when Beta's stricter liveability floor rejects them. Current Alpha exclusions: countries ${alphaCountryExclusionList}; cities ${alphaCityExclusionList}.`,
            `Beta และ Gamma เป็นชั้นเผยแพร่แยกต่างหาก ไม่ใช่เพียงช่วงอันดับ เมืองอาจไหลลงมาเมื่อเพดาน Alpha ทำงาน เมื่อเมืองร่วมชาติยึดสล็อตสาธารณะไปแล้ว หรือเมื่อเกณฑ์ความน่าอยู่ที่เข้มขึ้นของ Beta ไม่ผ่าน ข้อยกเว้น Alpha ปัจจุบัน: ประเทศ ${alphaCountryExclusionList}; เมือง ${alphaCityExclusionList}`,
            `Beta 与 Gamma 是独立的公开分层，不是简单的名次区间。城市会因 Alpha 上限、同国城市已占公开席位，或 Beta 更严格的宜居底线而级联至此。当前 Alpha 排除项：国家 ${alphaCountryExclusionList}；城市 ${alphaCityExclusionList}。`,
          )}
        </p>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">&beta; BETA</span>
          <div className="v3-lower-tier-cities">
            {tieredResults.beta.map((city) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                title={city.computedTierReason ?? city.tierReason ?? undefined}
              >
                <span className="v3-tier-chip-rank">#{city.rank}</span>
                <span className="v3-tier-chip-body">
                  <strong>{city.displayName}</strong>
                  {displayCountry(city.country) && <span>{displayCountry(city.country)}</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--gamma">&gamma; GAMMA</span>
          <div className="v3-lower-tier-cities">
            {tieredResults.gamma.map((city) => (
              <a
                key={city.cityId}
                className="v3-tier-chip"
                href={appHref(`/city/${city.cityId}`)}
                onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                title={city.computedTierReason ?? city.tierReason ?? undefined}
              >
                <span className="v3-tier-chip-rank">#{city.rank}</span>
                <span className="v3-tier-chip-body">
                  <strong>{city.displayName}</strong>
                  {displayCountry(city.country) && <span>{displayCountry(city.country)}</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">
            {t(locale, "Most rankings pick your priorities for you. Drag to pick your own.", "ดัชนีส่วนใหญ่เลือกน้ำหนักแทนคุณ ลากเพื่อตั้งน้ำหนักของตัวเอง", "大多数排名替你决定优先级。拖动滑块，设定你自己的。")}
          </h2>
          <p className="v3-spider-hint">
            {t(
              locale,
              "Drag any pillar to reweight the model. The published board stays intact — this builds a personal comparison view using the same 20 scored metric lines.",
              "ลากเสาหลักใดก็ได้เพื่อปรับน้ำหนัก บอร์ดที่เผยแพร่ไม่เปลี่ยน — นี่คือมุมมองเปรียบเทียบส่วนตัวจาก 20 metric line ที่ให้คะแนนชุดเดียวกัน",
              "拖动任意支柱以调整权重。已发布榜单保持不变——这里构建的是你的个人对比视图，使用同样的 20 条计分指标。",
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
                {([
                  { id: "alpha", glyph: "α", label: t(locale, "ALPHA", "ALPHA", "ALPHA"), cities: tieredResults.alpha },
                  { id: "beta", glyph: "β", label: t(locale, "BETA", "BETA", "BETA"), cities: tieredResults.beta },
                  { id: "gamma", glyph: "γ", label: t(locale, "GAMMA", "GAMMA", "GAMMA"), cities: tieredResults.gamma },
                ] as const).map((tier) => (
                  <div key={tier.id} className={`v3-spider-tier v3-spider-tier--${tier.id}`}>
                    <div className="v3-spider-tier-heading">
                      <span className={`v3-tier-badge v3-tier-badge--${tier.id}`}>
                        {tier.glyph} {tier.label}
                      </span>
                      <small>
                        {t(
                          locale,
                          `${tier.cities.length} cities · live`,
                          `${tier.cities.length} เมือง · สด`,
                          `${tier.cities.length} 城 · 实时`,
                        )}
                      </small>
                    </div>
                    {tier.cities.map((city) => (
                      <a
                        key={city.cityId}
                        className="v3-spider-row"
                        href={appHref(`/city/${city.cityId}`)}
                        onClick={(event) => navigateLink(event, onNavigate, `/city/${city.cityId}`)}
                        title={city.computedTierReason ?? city.tierReason ?? undefined}
                      >
                        <span className="v3-spider-rank">#{String(city.customRank).padStart(2, "0")}</span>
                        <span className="v3-spider-name">{city.displayName}</span>
                        <span className="v3-spider-score">{city.customScore.toFixed(1)}</span>
                        {displayCountry(city.country) && <span className="v3-spider-country">{displayCountry(city.country)}</span>}
                      </a>
                    ))}
                  </div>
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
