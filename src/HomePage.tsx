import { type CSSProperties, type MouseEvent, useEffect, useMemo, useState } from "react";
import { displayCountry } from "./cityUtils";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import { allocatePublicTiers, assignPureScoreRanks, getDisplayAlphaCityExclusions, PUBLIC_TIER_RULES } from "./publicTierPolicy.js";
import { rankingPublication } from "./rankingPublication";
import SiteFooter from "./SiteFooter";
import type { PillarAllocation } from "./ZeroSumAllocator";
import ZeroSumAllocator from "./ZeroSumAllocator";
import { t, localeNumberFormat } from "./i18n";
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
  coverageGrade: string | null;
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
  ko: {
    pressure: "성장",
    viability: "생활가능성",
    capability: "역량",
    community: "커뮤니티",
    creative: "창의성",
  },
  ja: {
    pressure: "成長",
    viability: "生活持続性",
    capability: "能力",
    community: "コミュニティ",
    creative: "創造性",
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
    coverageGrade: city.coverageGrade ?? null,
    coveragePenalty: city.coveragePenalty ?? 0,
    slicScore: city.slicScore,
    rank: city.rank,
  }))
  .sort((left, right) => left.rank - right.rank);
const publishedRankedCount = publishedBoard.filter((city) => city.rankingStatus === "Ranked").length;
const publishedWatchlistCount = rankingPublication.cities.length - publishedRankedCount;

// Bangkok is the editorial anchor — pull live numbers so bridge copy never drifts.
const bangkokWorked = rankingPublication.cities.find((c) => c.cityId === "th-bangkok");
const bangkokRank = bangkokWorked?.rank ?? 66;
const bangkokTierSlot = bangkokWorked?.tierSlot ?? null;
const bangkokCommunity = bangkokWorked?.communityScore?.toFixed(1) ?? "70.7";
const bangkokPressure = bangkokWorked?.pressureScore?.toFixed(1) ?? "42.6";
const bangkokCoverage = bangkokWorked?.coverageGrade ?? "A";
const bangkokTierSeatNote = bangkokTierSlot
  ? `Alpha slot ${bangkokTierSlot}`
  : "no public-tier seat";
const bangkokTierExplain = bangkokTierSlot
  ? "Thailand's seat is uncontested, no exclusion blocks it."
  : "Every public-tier slot was filled by higher-ranked cities before Bangkok's turn — the rules are not gamed to force the anchor city onto the shelf.";
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
      "거미줄을 드래그하거나 슬라이더를 사용하세요. 합계 = 100.",
      "スパイダーをドラッグするかスライダーを使用してください。合計＝100。",
    ),
    resetLabel: t(locale, "Reset", "รีเซ็ต", "重置", "초기화", "リセット"),
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
            {t(locale, "MEASURED FOR RESIDENTS, NOT FOR BUYERS.", "วัดเพื่อผู้อยู่อาศัย ไม่ใช่เพื่อผู้ซื้อ", "为居民而量，不为买家而排。", "거주자를 위해 측정, 구매자를 위함이 아닙니다.", "購入者のためでなく、住民のために測定。")}
          </p>
          <p className="hp-lede">
            {t(
              locale,
              "Most city rankings evaluate cities for people who already have the money to live there.",
              "ดัชนีเมืองส่วนใหญ่เลือกตัวชี้วัดแบบผิวเผินเพื่อประเมินเมืองให้กับ \"คนที่มีเงินพอจะอาศัยอยู่ที่นั่นอยู่แล้ว\" (คนรวย) แต่ดัชนีนี้เปิดเผยแหล่งที่มาทุกตัวเลข เลือกและวิเคราะห์ตัวชี้วัดเพื่อทำให้เราสามารถมองเห็น",
              "大多数城市排名是为那些已经有钱住在那里的人评估城市。",
              "대부분의 도시 순위는 이미 그곳에 살 돈이 있는 사람들을 위해 도시를 평가합니다.",
              "ほとんどの都市ランキングは、そこに住む資金を既に持っている人のために都市を評価しています。",
            )}
          </p>
          <h1 className="hp-headline">
            {locale === "th" ? (
              <>เมืองที่มีการเติบโตและใช้ชีวิตได้ดีล้วน ๆ{" "}<span className="hp-headline--accent">ไม่มีโฆษณาชวนเชื่อมาผสม</span></>
            ) : locale === "zh" ? (
              <>既在增长，也还住得起。<span className="hp-headline--accent">其余都是营销。</span></>
            ) : locale === "ko" ? (
              <>번영하면서도 여전히 감당 가능.{" "}<span className="hp-headline--accent">나머지는 모두 마케팅입니다.</span></>
            ) : locale === "ja" ? (
              <>成長していて、それでも手頃。{" "}<span className="hp-headline--accent">それ以外はすべてマーケティング。</span></>
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
              `${publishedRankedCount}개 도시 순위 + ${publishedWatchlistCount}개 분쟁 지역 및 저커버리지 관찰 목록. 도시당 공식 선언 점수 1개, 5개 공개 기둥을 통해 추적 가능: 성장, 생활가능성, 역량, 커뮤니티, 창의적 모멘텀. 알파는 생활 가능성 기준선이 필요합니다.`,
              `${publishedRankedCount}都市のランキングと${publishedWatchlistCount}都市の紛争地域・低カバレッジ観察リスト。都市ごとに1つの宣言スコア、5つの公開柱を通じて追跡可能：成長、生活持続性、能力、コミュニティ、創造性。アルファには生活持続性の最低基準が必要です。`,
            )}
          </p>
          <div className="hp-opening-actions">
            <a
              className="hp-cta-primary"
              href={appHref("/rankings")}
              onClick={(event) => navigateLink(event, onNavigate, "/rankings")}
            >
              {t(locale, `See all ${publishedRankedCount} cities`, `ดูเมืองทั้ง ${publishedRankedCount} แห่ง`, `查看全部 ${publishedRankedCount} 座城市`, `${publishedRankedCount}개 도시 모두 보기`, `全${publishedRankedCount}都市を見る`)} →
            </a>
            <a
              className="hp-cta-secondary"
              href={appHref("/map")}
              onClick={(event) => navigateLink(event, onNavigate, "/map")}
            >
              {t(locale, "Open global map", "แผนที่โลก", "打开全球地图", "글로벌 지도 열기", "グローバルマップを開く")}
            </a>
            <a
              className="hp-cta-secondary"
              href={appHref("/compare")}
              onClick={(event) => navigateLink(event, onNavigate, "/compare")}
            >
              {t(locale, "Compare with other indices", "เปรียบเทียบกับดัชนีอื่น", "与其他指数对比", "다른 지수와 비교", "他の指標と比較")}
            </a>
          </div>

          <div className="hp-opening-stats">
            <span className="hp-opening-stat">
              <strong>{publishedBoard.length}</strong>
              <em>{t(locale, "cities", "เมือง", "城市", "개 도시", "都市")}</em>
            </span>
            <span className="hp-opening-stat">
              <strong>5</strong>
              <em>{t(locale, "pillars", "เสาหลัก", "支柱", "기둥", "柱")}</em>
            </span>
            <span className="hp-opening-stat">
              <strong>{formattedVisitors}</strong>
              <em>{t(locale, "visitors", "ผู้เข้าชม", "访客", "방문자", "訪問者")}</em>
            </span>
          </div>
          <p className="hp-opening-credit">
            {t(
              locale,
              "Smart City Summit & Expo 2026, Taipei",
              "Smart City Summit & Expo 2026, ไทเป",
              "2026 台北智慧城市峰会",
              "Smart City Summit & Expo 2026, 타이베이",
              "スマートシティ・サミット&エキスポ2026、台北",
            )}
          </p>
        </div>
      </header>

      <section className="hp-photo-break">
        <img
          src={METHOD_PHOTO}
          alt={t(locale, "SLIC presentation slide at Smart City Summit and Expo 2026", "สไลด์นำเสนอ SLIC ที่งาน Smart City Summit and Expo 2026", "SLIC 在 2026 智慧城市展览会上的演示幻灯片", "2026 스마트시티 서밋 엑스포의 SLIC 발표 슬라이드", "スマートシティサミット＆エキスポ2026でのSLICプレゼンテーションスライド")}
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
            "Smart City Summit & Expo 2026, 타이베이. SLIC는 브랜드 덱이 아닌 공개 방법론으로 현장에 입장했습니다.",
            "スマートシティ・サミット&エキスポ2026、台北。SLICはブランドデッキではなく、公開方法論として登場しました。",
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
              "모든 순위에는 숨겨진 가정이 있습니다.\n우리는 우리 것을 공개했습니다.",
              "すべてのランキングには隠された前提があります。\n私たちは自分たちのものを公開しました。",
            )}
          </h2>
          <p className="hp-thesis-body">
            {t(
              locale,
              "Five declared pillars. Twenty scored metric lines plus three visible diagnostics, each value traced back to its source. No imputation, no paid placement, no composite buried in a PDF you have to trust. Disagree with the weights? Good — drag them below and see what actually changes.",
              "ห้าเสาหลักที่ประกาศชัด ยี่สิบ metric line ที่ให้คะแนนพร้อมสาม diagnostic ที่มองเห็นได้ ทุกค่าตรวจสอบกลับไปยังแหล่งที่มาได้ ไม่มีการเติมข้อมูล ไม่มีเมืองจ่ายเงินเพื่อเข้าร่วม ไม่มีสูตรซ่อนในไฟล์ PDF ที่ต้องเชื่อโดยดุษณี ไม่เห็นด้วยกับน้ำหนัก? ดีมาก — ลากด้านล่างแล้วดูว่าอะไรเปลี่ยน",
              "五个公开支柱。二十条计分指标加三条可见的诊断指标，每个数值都可追溯到来源。没有数据填充，没有付费排名，没有藏在 PDF 里叫你盲目相信的公式。不同意这些权重？很好——拖动下方滑块，看看什么真的会变。",
              "다섯 개의 선언된 기둥. 스무 개의 채점 지표와 세 개의 공개 진단 지표, 각 값은 출처까지 추적 가능합니다. 대체 데이터 없음, 유료 순위 없음, 믿어야만 하는 PDF 속 공식 없음. 가중치에 동의하지 않습니까? 좋습니다 — 아래에서 드래그해 무엇이 실제로 바뀌는지 확인하세요.",
              "5つの宣言された柱。採点された20の指標と3つの診断指標、各値はそのソースまで追跡可能。データ補完なし、有料掲載なし、盲目的に信じなければならないPDF内の数式なし。重みに同意しませんか？良い——以下でドラッグして、実際に何が変わるか確認してください。",
            )}
          </p>
          <a
            className="hp-thesis-link"
            href={appHref("/compare")}
            onClick={(event) => navigateLink(event, onNavigate, "/compare")}
          >
            {t(locale, "See how SLIC compares to EIU, Mercer, and Resonance", "เปรียบเทียบ SLIC กับ EIU, Mercer และ Resonance", "对比 SLIC 与 EIU、美世、Resonance", "SLIC와 EIU, Mercer, Resonance 비교 보기", "SLICとEIU、マーサー、レゾナンスの比較を見る")} &rarr;
          </a>
        </div>
      </section>

      <section className="hp-verdict section">
        <div className="hp-verdict-inner">
          <p className="hp-verdict-p">
            {t(
              locale,
              "These ten cities have almost nothing in common. Montreal endures eight months of winter. Kaohsiung has no metro. Valparaíso is built on cliffs that flood. Graz is a city most people couldn't find on a map.",
              "สิบเมืองนี้แทบไม่มีอะไรเหมือนกัน มอนทรีออลทนหนาวแปดเดือนต่อปี เกาสงไม่มีรถไฟใต้ดิน วัลปาราอีโซสร้างบนหน้าผาที่น้ำท่วมซ้ำซาก กราซเป็นเมืองที่คนส่วนใหญ่หาบนแผนที่ไม่เจอ",
              "这十座城市几乎毫无共同之处。蒙特利尔要熬过八个月的冬天。高雄没有地铁。瓦尔帕莱索建在时常被水淹的悬崖上。格拉茨是大多数人在地图上找不到的城市。",
              "이 열 개 도시는 거의 공통점이 없습니다. 몬트리올은 8개월의 겨울을 버팁니다. 가오슝에는 지하철이 없습니다. 발파라이소는 자주 침수되는 절벽 위에 세워져 있습니다. 그라츠는 대부분의 사람들이 지도에서 찾지 못하는 도시입니다.",
              "この10都市には、ほとんど共通点がありません。モントリオールは8ヶ月の冬を耐え抜きます。高雄に地下鉄はありません。バルパライソは頻繁に洪水が起きる崖の上に建てられています。グラーツは、ほとんどの人が地図上で見つけられない都市です。",
            )}
          </p>
          <p className="hp-verdict-p hp-verdict-p--mid">
            {t(
              locale,
              "What they share is the absence of a specific pressure — the kind that makes a city technically impressive but inaccessible to the person living a normal life inside it.",
              "สิ่งที่พวกเมืองเหล่านี้มีร่วมกันคือการขาดไปของแรงกดดันชนิดหนึ่ง — ชนิดที่ทำให้เมืองดูน่าประทับใจในแง่ตัวเลข แต่ไม่อาจเข้าถึงได้สำหรับคนที่ใช้ชีวิตธรรมดาอยู่ในนั้น",
              "它们的共同点，是某种压力的缺席——那种让一座城市在数字上令人印象深刻、但对于普通生活其中的人却难以企及的压力。",
              "이 도시들의 공통점은 특정 압박의 부재입니다 — 도시를 수치상으로 인상적으로 만들지만, 그 안에서 평범한 삶을 사는 사람에게는 닿을 수 없게 만드는 그런 압박입니다.",
              "これらの都市が共有しているのは、ある特定の圧力の不在です——数字の上では都市を印象的に見せながら、その中で普通の生活を送る人には手の届かないものにしてしまうような圧力です。",
            )}
          </p>
          <p className="hp-verdict-p hp-verdict-p--anchor">
            {t(
              locale,
              "Singapore scores 94.1 on Capability. No city in this dataset comes close. It is Gamma tier. That single fact tells you more about what SLIC is measuring than any equation we could publish.",
              "สิงคโปร์ได้คะแนน Capability 94.1 ไม่มีเมืองใดในชุดข้อมูลนี้เทียบได้ แต่สิงคโปร์อยู่ใน Gamma tier ข้อเท็จจริงประการเดียวนี้บอกอะไรเกี่ยวกับสิ่งที่ SLIC วัดได้มากกว่าสมการใดๆ ที่เราจะเผยแพร่",
              "新加坡的能力得分是94.1，数据集中无出其右。但它是Gamma级。这一个事实，比我们能发布的任何方程式都更能说明SLIC在衡量什么。",
              "싱가포르의 역량 점수는 94.1입니다. 이 데이터셋의 어떤 도시도 근접하지 못합니다. 그럼에도 싱가포르는 감마 등급입니다. 이 하나의 사실이, 우리가 발표할 수 있는 어떤 방정식보다 SLIC가 무엇을 측정하는지를 더 잘 말해줍니다.",
              "シンガポールの能力スコアは94.1です。このデータセットで近い都市はありません。それでもシンガポールはガンマ級です。この一つの事実が、私たちが発表できるどんな方程式よりも、SLICが何を測っているかを雄弁に物語っています。",
            )}
          </p>
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
              "발표 가능한 10개 도시. 모든 수치는 출처까지 추적 가능합니다.",
              "公開可能な10都市。すべての数値はソースまで追跡可能です。",
            )}
          </h2>
          <div className="v3-alpha-bridge">
            <p className="v3-alpha-bridge-headline">
              {t(
                locale,
                "Alpha is curated, not counted.",
                "Alpha คือชั้นที่คัดเลือก ไม่ใช่ชั้นที่นับคะแนน",
                "Alpha 是经编辑挑选，而非按分计票。",
                "알파는 선별된 것이며, 점수로 산정되지 않습니다.",
                "アルファは厳選されたもので、点数で決まるわけではありません。",
              )}
            </p>
            <p className="v3-alpha-bridge-body">
              {t(
                locale,
                `It is the editorial overlay reserved for cities where the median resident actually thrives — not the top ten by pure score. Cities with higher pure rank can fail a gate (floor scores, ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}-grade coverage, country cap, editorial exclusion); cities with lower pure rank can earn a seat — or, like Bangkok, clear the floor yet hold no shelf at all. Bangkok is the anchor worked example: pure rank #${bangkokRank}, ${bangkokTierSeatNote}. Community ${bangkokCommunity} and Pressure ${bangkokPressure} clear the Alpha floor, coverage is ${bangkokCoverage}. ${bangkokTierExplain} Travel-cost evidence strengthens the public story: Bangkok combines major global visitor pull with unusually low everyday food, transport, and lodging costs, but that evidence is context, not a hidden score boost.`,
                `คือชั้นบรรณาธิการที่สงวนไว้ให้กับเมืองที่ผู้อยู่อาศัยมัธยฐานเจริญงอกงามจริง — ไม่ใช่ top-10 ตามคะแนนล้วน เมืองที่อันดับคะแนนสูงกว่าอาจไม่ผ่านประตู (เกณฑ์ขั้นต่ำ coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade} เพดานประเทศ การกีดกันบรรณาธิการ) เมืองที่อันดับคะแนนต่ำกว่าอาจได้ที่นั่ง — หรืออย่างกรุงเทพฯ ผ่านพื้นแต่ไม่มีชั้นสาธารณะเลย กรุงเทพฯ คือตัวอย่างหลัก: อันดับล้วน #${bangkokRank} · ${bangkokTierSlot ? `Alpha สล็อตที่ ${bangkokTierSlot}` : "ไม่มีชั้นสาธารณะ"} · Community ${bangkokCommunity} และ Pressure ${bangkokPressure} ผ่านพื้น Alpha · coverage ${bangkokCoverage} · ${bangkokTierSlot ? "ที่นั่งของไทยไม่มีคู่แข่ง · ไม่มีการกีดกัน" : "ทุกชั้นสาธารณะถูกเติมโดยเมืองที่อันดับสูงกว่าก่อน — กติกาไม่ถูกปรับเพื่อดันเมืองหลักขึ้นชั้น"} หลักฐานต้นทุนการเดินทางช่วยเสริมเรื่องเล่าสาธารณะ: กรุงเทพฯ มีแรงดึงดูดนักเดินทางระดับโลกพร้อมต้นทุนอาหาร การเดินทาง และที่พักที่ยังต่ำผิดปกติ แต่หลักฐานนี้เป็นบริบท ไม่ใช่คะแนนแฝง`,
                `它是为中位居民真正安居的城市保留的编辑层 —— 而非按纯分排出的前 10。纯分更高的城市可能未通过门槛（底线、${PUBLIC_TIER_RULES.alphaMinCoverageGrade} 级覆盖、国家上限、编辑排除）；纯分更低的城市可能赢得席位 —— 或像曼谷一样，越过底线却没有公开层级席位。曼谷是锚点范例：纯分第 ${bangkokRank} · ${bangkokTierSlot ? `Alpha 第 ${bangkokTierSlot} 席` : "无公开层级席位"} · 社区 ${bangkokCommunity}、压力 ${bangkokPressure} 越过 Alpha 底线 · 覆盖 ${bangkokCoverage} · ${bangkokTierSlot ? "泰国席位无人争夺 · 不在任何排除清单上" : "所有公开层级席位已被更高排名城市占满 —— 规则不会为锚点城市破例"}。旅行成本证据强化了公开叙事：曼谷兼具全球游客吸引力与异常低的日常餐饮、交通、住宿成本，但这只是背景证据，不是隐藏加分。`,
                `이것은 중위 거주자가 실제로 번성하는 도시를 위해 예약된 편집 레이어입니다 — 순수 점수 기준 상위 10위가 아닙니다. 순수 순위가 높은 도시도 관문(최저 점수, ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}등급 커버리지, 국가 상한, 편집 제외)에서 탈락할 수 있고, 순수 순위가 낮은 도시도 자리를 얻을 수 있습니다 —— 또는 방콕처럼 최저선은 넘지만 공개 등급 자리가 없을 수 있습니다. 방콕이 앵커 예시입니다: 순수 순위 #${bangkokRank}, ${bangkokTierSlot ? `알파 슬롯 ${bangkokTierSlot}` : "공개 등급 없음"}. 커뮤니티 ${bangkokCommunity} 및 압력 ${bangkokPressure}이 Alpha 최저선을 충족하고, 커버리지는 ${bangkokCoverage}. ${bangkokTierSlot ? "태국 자리는 경쟁 없음, 제외 항목 없음." : "모든 공개 등급 자리가 더 높은 순위의 도시로 먼저 채워졌습니다 — 앵커 도시를 억지로 올리지 않습니다."} 여행 비용 증거가 공개 서사를 강화합니다: 방콕은 주요 글로벌 방문객 유인력과 이례적으로 낮은 일상 식비, 교통비, 숙박비를 결합하고 있지만, 이 증거는 맥락일 뿐 숨겨진 점수 가산이 아닙니다.`,
                `これは、中央値の居住者が実際に繁栄している都市のために予約された編集レイヤーです——純粋なスコアによるトップ10ではありません。純粋な順位が高い都市もゲート（最低スコア、${PUBLIC_TIER_RULES.alphaMinCoverageGrade}グレードカバレッジ、国別上限、編集除外）で落ちることがあり、純粋な順位が低い都市も席を得ることができます——またはバンコクのように、最低線をクリアしても公開ティアの席がない場合もあります。バンコクがアンカーの実例です：純粋な順位#${bangkokRank}、${bangkokTierSlot ? `アルファスロット${bangkokTierSlot}` : "公開ティアなし"}。コミュニティ${bangkokCommunity}とプレッシャー${bangkokPressure}がAlpha最低線をクリアし、カバレッジは${bangkokCoverage}。${bangkokTierSlot ? "タイの席は争いなし、除外項目もなし。" : "すべての公開ティア席がより高い順位の都市で先に埋まりました——アンカー都市を無理やり載せるルールではありません。"}旅行コストの証拠が公開の物語を強化します：バンコクは主要なグローバル訪問者の牽引力と異常に低い日常の食費、交通費、宿泊費を組み合わせていますが、この証拠は文脈であり、隠れたスコアブーストではありません。`,
              )}
            </p>
          </div>
          <p className="v3-alpha-subtitle">
            {t(
              locale,
              `Each country holds at most one Alpha seat, with a few exceptions for regions where SLIC has strong multi-city data (two seats for Japan and East Asia). Alpha requires both Community and Pressure scores above ${PUBLIC_TIER_RULES.alphaMinCommunity}, plus ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}-grade coverage — a liveability floor, not just a high overall score. Europe holds ${PUBLIC_TIER_RULES.maxEuropeInAlpha} Alpha seats; Oceania holds none (purchase and rental costs exceed the median-resident threshold Alpha requires). Some cities are excluded from Alpha specifically because of housing cost — not because they are bad cities, but because Alpha is reserved for cities where a person on a local salary can actually build a life. The full tier policy is published in the methodology.`,
              `แต่ละประเทศมีที่นั่ง Alpha ได้สูงสุดหนึ่งที่ โดยมีข้อยกเว้นสำหรับภูมิภาคที่ SLIC มีข้อมูลเมืองหลายแห่งที่แข็งแกร่ง Alpha ต้องมีคะแนน Community และ Pressure เกิน ${PUBLIC_TIER_RULES.alphaMinCommunity} ทั้งคู่ พร้อม coverage grade ${PUBLIC_TIER_RULES.alphaMinCoverageGrade} — เป็นเกณฑ์ขั้นต่ำด้านความน่าอยู่ ไม่ใช่แค่คะแนนรวมสูง บางเมืองถูกกันออกจาก Alpha เพราะค่าครองชีพ ไม่ใช่เพราะเป็นเมืองแย่ แต่เพราะ Alpha สงวนไว้สำหรับเมืองที่คนมีรายได้ท้องถิ่นสามารถสร้างชีวิตได้จริง นโยบายชั้นฉบับเต็มเผยแพร่ในหน้าระเบียบวิธี`,
              `原则上每国一个 Alpha 席位，部分地区因 SLIC 拥有多城强数据而有例外（如日本和东亚可占两席）。Alpha 要求 Community 与 Pressure 都高于 ${PUBLIC_TIER_RULES.alphaMinCommunity}，且覆盖等级达到 ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}——这是宜居门槛，不只是总分高。大洋洲不设 Alpha 席位，因为该区域的购房与租房成本超出了 Alpha 所要求的中位居民可负担线。部分城市因住房成本被排除在 Alpha 之外——不是因为它们不好，而是 Alpha 专为当地薪资水平的人也能真正安家的城市保留。完整的分层政策已在方法论页面公开。`,
              `각 국가는 최대 하나의 알파 자리를 보유하며, SLIC가 강력한 다도시 데이터를 보유한 지역에는 일부 예외가 있습니다(일본 및 동아시아는 2석). 알파는 커뮤니티와 성장 점수 모두 ${PUBLIC_TIER_RULES.alphaMinCommunity} 이상이고 ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}등급 커버리지가 필요합니다 — 생활 가능성 기준선이며, 단순히 높은 총점이 아닙니다. 유럽은 ${PUBLIC_TIER_RULES.maxEuropeInAlpha}개 알파 자리를 보유하고, 오세아니아는 없습니다(구매 및 임대 비용이 알파가 요구하는 중위 거주자 기준선을 초과). 일부 도시는 주거 비용 때문에 알파에서 제외됩니다 — 나쁜 도시여서가 아니라, 알파는 현지 급여 수준의 사람이 실제로 삶을 구축할 수 있는 도시를 위해 예약되어 있기 때문입니다. 완전한 등급 정책은 방법론에 공개되어 있습니다.`,
              `各国は最大1つのアルファ席を保有し、SLICが強力なマルチシティデータを持つ地域には一部例外があります（日本と東アジアは2席）。アルファはコミュニティと成長のスコアが両方${PUBLIC_TIER_RULES.alphaMinCommunity}以上、かつ${PUBLIC_TIER_RULES.alphaMinCoverageGrade}グレードのカバレッジが必要です——生活持続性の最低基準であり、単なる高い総合スコアではありません。ヨーロッパは${PUBLIC_TIER_RULES.maxEuropeInAlpha}席のアルファ席を保有し、オセアニアは保有しません（購入・賃貸コストがアルファが要求する中央値居住者の基準を超えるため）。一部の都市は住宅コストのためにアルファから除外されます——悪い都市だからではなく、アルファは地元の給与水準の人が実際に生活を構築できる都市のために予約されているためです。完全な等級ポリシーは方法論で公開されています。`,
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
                <span>{t(locale, "Published board", "บอร์ดที่เผยแพร่", "已发布榜单", "발표된 순위", "公開ボード")}</span>
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
          alt={t(locale, "Dr Non at Smart City Summit Taipei show floor", "ดร.นนท์ ที่บูธงาน Smart City Summit ไทเป", "Non 博士在台北智慧城市展会现场", "타이베이 스마트시티 서밋 전시장의 Non 박사", "台北スマートシティサミット会場のNon博士")}
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
            "타이베이 전시장에서. 제안은 간단했습니다: 라이프스타일 환상을 감사 가능한 도시 지표로 교체하는 것.",
            "台北の会場で。提案はシンプルでした：ライフスタイルの幻想を監査可能な都市指標に置き換えること。",
          )}
        </p>
      </section>

      <section className="hp-launch-trail section">
        <p className="eyebrow">{t(locale, "GLOBAL LAUNCH TRAIL", "เส้นทางเปิดตัวทั่วโลก", "全球发布路线", "글로벌 론칭 행보", "グローバル・ローンチ・トレイル")}</p>
        <h2 className="hp-launch-trail-title">
          {t(
            locale,
            "A city ranking is only useful if it enters the rooms where city decisions get made. Here is where SLIC has gone — and where it is scheduled next.",
            "ดัชนีเมืองมีประโยชน์ก็ต่อเมื่อได้เข้าสู่ห้องที่การตัดสินใจเรื่องเมืองเกิดขึ้นจริง นี่คือที่ที่ SLIC ไปมาแล้ว — และเวทีถัดไปที่มีกำหนด",
            "城市排名只有进入真正做城市决策的场合才有意义。这里是 SLIC 已经去过的地方，以及下一站安排。",
            "도시 순위는 도시 결정이 이루어지는 공간에 진입해야만 유용합니다. 이곳이 SLIC가 다녀온 곳이며 — 다음으로 예정된 곳입니다.",
            "都市ランキングは、都市の意思決定が行われる場に入って初めて役立ちます。ここがSLICが行った場所——そして次に予定されている場所です。",
          )}
        </h2>
        <div className="hp-launch-trail-grid">
          <div className="hp-launch-event">
            <div className="hp-launch-event-photo">
              <img src={STAGE_PHOTO} alt={t(locale, "SLIC keynote, Smart City Summit Taipei 2026", "ปาฐกถา SLIC ที่งาน Smart City Summit ไทเป 2026", "SLIC 主题演讲，2026 台北智慧城市峰会", "2026 타이베이 스마트시티 서밋 SLIC 기조연설", "台北スマートシティサミット2026でのSLIC基調講演")} loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag">{t(locale, "Taipei", "ไทเป", "台北", "타이베이", "台北")}</span>
              <span className="hp-launch-event-date">{t(locale, "March 2026", "มีนาคม 2026", "2026年3月", "2026년 3월", "2026年3月")}</span>
              <p>{t(
                locale,
                "Smart City Summit & Expo — keynote to 3,000+ professionals. The largest smart city event in Asia.",
                "Smart City Summit & Expo — keynote ต่อหน้า 3,000+ คน งานเมืองอัจฉริยะที่ใหญ่ที่สุดในเอเชีย",
                "智慧城市峰会——向 3,000 余名专业人士发表主题演讲。亚洲最大智慧城市活动。",
                "Smart City Summit & Expo — 3,000명 이상 전문가 대상 기조연설. 아시아 최대 스마트시티 행사.",
                "スマートシティ・サミット&エキスポ——3,000名以上のプロフェッショナルへの基調講演。アジア最大のスマートシティイベント。",
              )}</p>
            </div>
          </div>

          <div className="hp-launch-event">
            <div className="hp-launch-event-photo">
              <img src={GITEX_STAGE_PHOTO} alt={t(locale, "Dr Non, main-stage keynote at GITEX AI Asia Singapore 2026", "ดร.นนท์ ปาฐกถาเวทีหลักที่งาน GITEX AI Asia สิงคโปร์ 2026", "Non 博士在 2026 新加坡 GITEX AI Asia 主舞台发表主题演讲", "2026 싱가포르 GITEX AI Asia 메인 무대 기조연설의 Non 박사", "GITEX AI Asiaシンガポール2026メインステージで基調講演を行うNon博士")} loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag">{t(locale, "Singapore", "สิงคโปร์", "新加坡", "싱가포르", "シンガポール")}</span>
              <span className="hp-launch-event-date">{t(locale, "April 2026", "เมษายน 2026", "2026年4月", "2026년 4월", "2026年4月")}</span>
              <p>{t(
                locale,
                "GITEX AI Asia, Marina Bay Sands — main-stage keynote and Government Innovation as a Service workshop. 23,000+ attendees from 110+ countries.",
                "GITEX AI Asia, Marina Bay Sands — keynote บนเวทีหลักและเวิร์กช็อป Government Innovation as a Service ผู้เข้าร่วมกว่า 23,000 คนจาก 110+ ประเทศ",
                "GITEX AI Asia，滨海湾金沙——主舞台主题演讲及「政府创新即服务」工作坊。23,000 余名观众，110 余个国家。",
                "GITEX AI Asia, 마리나 베이 샌즈 — 메인 스테이지 기조연설 및 Government Innovation as a Service 워크숍. 110개국 이상 23,000명 이상 참석자.",
                "GITEX AI Asia、マリーナ・ベイ・サンズ——メインステージ基調講演とGovernment Innovation as a Serviceワークショップ。110カ国以上から23,000名以上の参加者。",
              )}</p>
            </div>
          </div>

          <div className="hp-launch-event hp-launch-event--upcoming">
            <div className="hp-launch-event-photo hp-launch-event-photo--graphic">
              <img src={LEAP_EAST_PHOTO} alt={t(locale, "LEAP EAST Hong Kong event card, 8–10 July 2026", "บัตรงาน LEAP EAST ฮ่องกง 8–10 กรกฎาคม 2026", "LEAP EAST 香港活动卡，2026 年 7 月 8–10 日", "LEAP EAST 홍콩 행사 카드, 2026년 7월 8–10일", "LEAP EAST香港イベントカード、2026年7月8–10日")} loading="lazy" />
            </div>
            <div className="hp-launch-event-meta">
              <span className="hp-launch-event-tag hp-launch-event-tag--upcoming">{t(locale, "Hong Kong", "ฮ่องกง", "香港", "홍콩", "香港")}</span>
              <span className="hp-launch-event-date">{t(locale, "July 2026", "กรกฎาคม 2026", "2026年7月", "2026년 7월", "2026年7月")}</span>
              <p>{t(
                locale,
                "Scheduled next: LEAP EAST, HKCEC — Asia's leading conference for innovation leaders and investors, 8–10 July 2026.",
                "เวทีถัดไปที่มีกำหนด: LEAP EAST, HKCEC — งานประชุมชั้นนำในเอเชียสำหรับผู้นำด้านนวัตกรรมและนักลงทุน 8–10 กรกฎาคม 2569",
                "下一站已排期：LEAP EAST，香港会展中心——亚洲领先的创新领袖与投资者峰会，2026 年 7 月 8–10 日。",
                "다음 예정: LEAP EAST, HKCEC — 아시아 선도 혁신 리더 및 투자자 컨퍼런스, 2026년 7월 8–10일.",
                "次回予定：LEAP EAST、HKCEC——アジア最先端のイノベーションリーダーと投資家のカンファレンス、2026年7月8〜10日。",
              )}</p>
            </div>
          </div>
        </div>

        <div className="hp-launch-reach">
          <div className="hp-launch-reach-stat">
            <span className="hp-launch-reach-number">10,000+</span>
            <span className="hp-launch-reach-label">
              {t(locale, "people have accessed the SLIC Index", "ผู้เข้าถึง SLIC Index", "人次访问 SLIC 指数", "SLIC Index에 접속한 사람들", "SLIC Indexにアクセスした人々")}
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
                "타이베이와 싱가포르에서 SLIC 라이브 발표를 직접 관람",
                "台北とシンガポールでSLICのライブ発表を見た人々",
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
            `베타와 감마는 단순한 순위 구간이 아닌 별도의 공개 등급 레이어입니다. 알파 상한이 적용될 때, 같은 국가 도시가 이미 공개 슬롯을 차지했을 때, 또는 베타의 엄격한 생활 가능성 기준선에서 거부될 때 도시가 여기로 이동할 수 있습니다. 현재 알파 제외 항목: 국가 ${alphaCountryExclusionList}; 도시 ${alphaCityExclusionList}.`,
            `ベータとガンマは単純な順位帯ではなく、独立した公開等級レイヤーです。アルファの上限が適用されるとき、同国の都市がすでに公開スロットを占有しているとき、またはベータのより厳格な生活持続性の最低基準で却下されるときに都市がここに流れ込みます。現在のアルファ除外項目：国 ${alphaCountryExclusionList}；都市 ${alphaCityExclusionList}。`,
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
            {t(locale, "Most rankings pick your priorities for you. Drag to pick your own.", "ดัชนีส่วนใหญ่เลือกน้ำหนักแทนคุณ ลากเพื่อตั้งน้ำหนักของตัวเอง", "大多数排名替你决定优先级。拖动滑块，设定你自己的。", "대부분의 순위는 우선순위를 대신 정해줍니다. 드래그해서 직접 정해보세요.", "ほとんどのランキングはあなたの優先順位を代わりに決めます。ドラッグして自分で決めてください。")}
          </h2>
          <p className="v3-spider-hint">
            {t(
              locale,
              "Drag any pillar to reweight the model. The published board stays intact — this builds a personal comparison view using the same 20 scored metric lines.",
              "ลากเสาหลักใดก็ได้เพื่อปรับน้ำหนัก บอร์ดที่เผยแพร่ไม่เปลี่ยน — นี่คือมุมมองเปรียบเทียบส่วนตัวจาก 20 metric line ที่ให้คะแนนชุดเดียวกัน",
              "拖动任意支柱以调整权重。已发布榜单保持不变——这里构建的是你的个人对比视图，使用同样的 20 条计分指标。",
              "임의의 기둥을 드래그해 모델의 가중치를 조정하세요. 발표된 순위는 그대로 유지됩니다 — 동일한 20개 채점 지표를 사용한 개인 비교 뷰를 구성합니다.",
              "任意の柱をドラッグしてモデルの重みを調整してください。公開ボードはそのまま維持されます——同じ20の採点指標を使用した個人比較ビューを構築します。",
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
                  { id: "alpha", glyph: "α", label: t(locale, "ALPHA", "ALPHA", "ALPHA", "ALPHA", "ALPHA"), cities: tieredResults.alpha },
                  { id: "beta", glyph: "β", label: t(locale, "BETA", "BETA", "BETA", "BETA", "BETA"), cities: tieredResults.beta },
                  { id: "gamma", glyph: "γ", label: t(locale, "GAMMA", "GAMMA", "GAMMA", "GAMMA", "GAMMA"), cities: tieredResults.gamma },
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
                          `${tier.cities.length}개 도시 · 실시간`,
                          `${tier.cities.length}都市 · ライブ`,
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
          {t(locale, "Read the methodology", "อ่านระเบียบวิธี", "阅读方法论", "방법론 읽기", "方法論を読む")}
        </a>
        <a
          className="v3-cta-secondary"
          href={appHref("/about-slic")}
          onClick={(event) => navigateLink(event, onNavigate, "/about-slic")}
        >
          {t(locale, "About SLIC", "เกี่ยวกับ SLIC", "关于 SLIC", "SLIC 소개", "SLICについて")}
        </a>
        <a
          className="v3-cta-secondary"
          href={appHref("/history")}
          onClick={(event) => navigateLink(event, onNavigate, "/history")}
        >
          {t(locale, "How it was built", "เบื้องหลังการสร้าง", "它是如何被建造出来的", "어떻게 만들어졌나", "どのように作られたか")}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
