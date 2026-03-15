import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import RankingIntegrityBanner from "./RankingIntegrityBanner";
import { exerciseRegions, getExerciseCities } from "./rankingsData";
import SiteFooter from "./SiteFooter";
import type { FullRankedCity, Locale, SitePath } from "./types";

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

type MatchedCity = FullRankedCity & {
  customScore: number;
  customRank: number;
  rankShift: number;
};

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#ff8f4a",
  viability: "#31d596",
  capability: "#66a3ff",
  community: "#c084fc",
  creative: "#ff5ea8",
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

const PILLAR_HINTS: Record<Locale, Record<PillarId, string>> = {
  en: {
    pressure: "Economic dynamism, market forces, affordability as natural outcome.",
    viability: "Safety, air, transit, water, and digital reliability.",
    capability: "Healthcare, education, and equal access to move up.",
    community: "Belonging, tolerance, public life, and social texture.",
    creative: "Entrepreneurship, research, productive edge, and ambition.",
  },
  th: {
    pressure: "พลวัตเศรษฐกิจ กลไกตลาด ค่าครองชีพตามกลไก.",
    viability: "ความปลอดภัย อากาศ การเดินทาง น้ำ และความเสถียรดิจิทัล.",
    capability: "สาธารณสุข การศึกษา และโอกาสที่เข้าถึงได้จริง.",
    community: "ความเป็นส่วนหนึ่ง ความเปิดกว้าง ชีวิตสาธารณะ และเนื้อสัมผัสทางสังคม.",
    creative: "ผู้ประกอบการ งานวิจัย พลังการแข่งขัน และความทะเยอทะยาน.",
  },
  zh: {
    pressure: "经济活力、市场力量、自然可负担性。",
    viability: "安全、空气、交通、供水和数字基础可靠性。",
    capability: "医疗、教育，以及向上流动的真实机会。",
    community: "归属感、包容度、公共生活与社会质感。",
    creative: "创业、研究、生产活力与进取心。",
  },
};

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const CANONICAL = publishedData.canonicalWeights as Record<PillarId, number>;
const indexedCities = getExerciseCities();

const PRESETS: Array<{
  id: string;
  values: Record<PillarId, number>;
  label: Record<Locale, string>;
}> = [
  {
    id: "canonical",
    values: { ...CANONICAL },
    label: {
      en: "Balanced SLIC",
      th: "สมดุลแบบ SLIC",
      zh: "SLIC 平衡",
    },
  },
  {
    id: "growth",
    values: { pressure: 44, viability: 10, capability: 10, community: 6, creative: 30 },
    label: {
      en: "Capital Edge",
      th: "ขอบทุนนิยม",
      zh: "资本锋线",
    },
  },
  {
    id: "safe",
    values: { pressure: 15, viability: 34, capability: 20, community: 16, creative: 15 },
    label: {
      en: "Safe Base",
      th: "ฐานมั่นคง",
      zh: "安全底盘",
    },
  },
  {
    id: "human",
    values: { pressure: 12, viability: 18, capability: 28, community: 26, creative: 16 },
    label: {
      en: "Human Core",
      th: "แกนมนุษย์",
      zh: "人本核心",
    },
  },
  {
    id: "creative",
    values: { pressure: 18, viability: 15, capability: 14, community: 15, creative: 38 },
    label: {
      en: "Creative Pulse",
      th: "พลังสร้างสรรค์",
      zh: "创意脉冲",
    },
  },
];

const interactiveCopy: Record<
  Locale,
  {
    heroEyebrow: string;
    heroTitle: string;
    heroIntro: string;
    heroNoteTitle: string;
    heroNoteBody: string;
    indexedCitiesLabel: string;
    lockedPointsLabel: string;
    pillarsLabel: string;
    allocatorTitle: string;
    allocatorHint: string;
    presetTitle: string;
    resetLabel: string;
    canonicalBadge: string;
    customBadge: string;
    canonicalNote: string;
    methodologyTitle: string;
    methodologyBody: string;
    consequencesTitle: string;
    noConsequences: string;
    resultsTitle: string;
    resultsBody: string;
    bestMatchTitle: string;
    bestMatchBody: string;
    fitScore: string;
    baseRank: string;
    citiesLabel: string;
    top10: string;
    top50: string;
    showAll: string;
    regionLabel: string;
    allRegions: string;
    featureSignal: string;
    featurePriority: string;
    featureWhy: string;
    featureTags: string;
    listTitle: string;
    scoreNow: string;
    reviewMethodology: string;
    downloadSheet: string;
  }
> = {
  en: {
    heroEyebrow: "Preference engine",
    heroTitle: "Tune the city field to your life",
    heroIntro:
      "This workbench reranks the full 200-city indexed field in real time. Drag the spider web, move the sliders, or use a preset to see which cities match the kind of life you actually want.",
    heroNoteTitle: "Why this should feel credible",
    heroNoteBody:
      "This is meant to read like a declared ranking instrument, not a vibe list. The frame is traceable: post-tax room after essentials, daily viability, capability, community texture, and creative edge, all held inside one explicit five-part model.",
    indexedCitiesLabel: "Indexed cities",
    lockedPointsLabel: "Locked points",
    pillarsLabel: "Declared pillars",
    allocatorTitle: "Shape your ideal profile",
    allocatorHint: "Zero-sum allocator: total stays at 100 while every move changes the field.",
    presetTitle: "Quick profiles",
    resetLabel: "Reset to SLIC baseline",
    canonicalBadge: "Official SLIC ranking",
    customBadge: "Your profile match",
    canonicalNote: "Declared baseline: Growth 25 / Viability 22 / Capability 18 / Community 15 / Creative 20",
    methodologyTitle: "Declared method",
    methodologyBody:
      "Growth measures economic dynamism and market forces that shape a city's trajectory. It rewards disposable room after essentials and punishes false prosperity. If you want hard competitive edge, the Creative pillar is the sharper signal.",
    consequencesTitle: "Trade-off signals",
    noConsequences: "Keep moving the weights. When your profile becomes distinctive, the main trade-offs appear here.",
    resultsTitle: "Closest matches",
    resultsBody: "At baseline you are seeing the official SLIC order. Once you move the bars, the workbench switches into profile matching across the full 200-city indexed field.",
    bestMatchTitle: "Best current match",
    bestMatchBody: "The lead city below is the closest shape-match to your current five-part profile.",
    fitScore: "Profile fit",
    baseRank: "Base rank",
    citiesLabel: "cities in view",
    top10: "Top 10",
    top50: "Top 50",
    showAll: "All",
    regionLabel: "Region",
    allRegions: "All regions",
    featureSignal: "Current signal",
    featurePriority: "Closest aligned pillars",
    featureWhy: "Why it fits",
    featureTags: "Field tags",
    listTitle: "Full profile-matched list",
    scoreNow: "Now",
    reviewMethodology: "Review methodology",
    downloadSheet: "Download sheet template",
  },
  th: {
    heroEyebrow: "เครื่องมือปรับความชอบ",
    heroTitle: "จูนสนามเมืองให้เข้ากับชีวิตของคุณ",
    heroIntro:
      "หน้านี้จัดอันดับใหม่แบบสดจากเมืองทั้ง 200 เมืองในสนามดัชนี ลากใยแมงมุม ขยับสไลเดอร์ หรือใช้ preset เพื่อดูว่าเมืองไหนใกล้กับชีวิตที่คุณต้องการจริง ๆ",
    heroNoteTitle: "ทำไมหน้านี้ต้องดูน่าเชื่อถือ",
    heroNoteBody:
      "หน้านี้ตั้งใจให้เป็นเครื่องมือจัดอันดับที่ประกาศวิธีคิดชัดเจน ไม่ใช่ลิสต์ตามอารมณ์ เรามองพื้นที่รายได้หลังภาษีและค่าใช้จ่ายจำเป็น ความน่าอยู่ ศักยภาพมนุษย์ พลังชุมชน และขอบการสร้างสรรค์ ภายใต้โมเดลเดียวที่ตรวจย้อนกลับได้",
    indexedCitiesLabel: "เมืองในสนาม",
    lockedPointsLabel: "คะแนนคงที่",
    pillarsLabel: "เสาหลัก",
    allocatorTitle: "จัดรูปโปรไฟล์เมืองในอุดมคติ",
    allocatorHint: "ระบบ zero-sum: คะแนนรวมคงที่ 100 ทุกการขยับจะเปลี่ยนผลลัพธ์ทั้งสนาม",
    presetTitle: "โปรไฟล์ด่วน",
    resetLabel: "รีเซ็ตเป็นค่า SLIC",
    canonicalBadge: "อันดับ SLIC ทางการ",
    customBadge: "โปรไฟล์ที่คุณจับคู่",
    canonicalNote: "ฐานที่ประกาศ: Growth 25 / Viability 22 / Capability 18 / Community 15 / Creative 20",
    methodologyTitle: "วิธีคิดที่ประกาศไว้",
    methodologyBody:
      "Growth วัดพลวัตเศรษฐกิจและกลไกตลาดที่กำหนดทิศทางเมือง เสานี้ให้คะแนนพื้นที่ทางการเงินหลังค่าใช้จ่ายจำเป็น และลงโทษความเจริญที่ไม่จริง ถ้าต้องการดูความแข่งขันเชิงทุนนิยมจริง ๆ ให้ดูเสา Creative",
    consequencesTitle: "สัญญาณข้อแลกเปลี่ยน",
    noConsequences: "ลองขยับน้ำหนักต่อไป เมื่อโปรไฟล์ของคุณชัดขึ้น ข้อแลกเปลี่ยนหลักจะปรากฏตรงนี้",
    resultsTitle: "เมืองที่ใกล้ที่สุด",
    resultsBody: "ถ้าอยู่ที่ค่า baseline คุณกำลังเห็นอันดับ SLIC ทางการ แต่เมื่อคุณขยับแถบ ระบบจะเปลี่ยนเป็นการจับคู่โปรไฟล์กับเมืองทั้ง 200 เมืองในสนาม",
    bestMatchTitle: "เมืองที่ตรงที่สุดตอนนี้",
    bestMatchBody: "เมืองด้านล่างคือเมืองที่มีรูปทรงคะแนนใกล้กับโปรไฟล์ห้ามิติของคุณมากที่สุดในตอนนี้",
    fitScore: "คะแนนการจับคู่",
    baseRank: "อันดับฐาน",
    citiesLabel: "เมืองในมุมมอง",
    top10: "10 อันดับ",
    top50: "50 อันดับ",
    showAll: "ทั้งหมด",
    regionLabel: "ภูมิภาค",
    allRegions: "ทุกภูมิภาค",
    featureSignal: "สัญญาณปัจจุบัน",
    featurePriority: "เสาที่ใกล้ที่สุด",
    featureWhy: "เหตุผลที่ตรง",
    featureTags: "แท็กสนาม",
    listTitle: "รายการที่จับคู่โปรไฟล์ทั้งหมด",
    scoreNow: "ตอนนี้",
    reviewMethodology: "ดูระเบียบวิธี",
    downloadSheet: "ดาวน์โหลดเทมเพลตชีต",
  },
  zh: {
    heroEyebrow: "偏好引擎",
    heroTitle: "把城市场域调到适合你的生活",
    heroIntro:
      "这个工作台会对完整的 200 城市索引场进行实时重排。拖动蛛网图、调整滑块，或使用预设，看看哪些城市最接近你真正想要的生活。",
    heroNoteTitle: "为什么它应该显得可信",
    heroNoteBody:
      "这应该像一个声明清楚的方法工具，而不是情绪化榜单。它把税后和基本开支后的剩余空间、日常宜居性、人力能力、社区质感和创造性动能放进同一个可追溯的五部分模型里。",
    indexedCitiesLabel: "索引城市",
    lockedPointsLabel: "锁定点数",
    pillarsLabel: "声明支柱",
    allocatorTitle: "塑造你的理想城市画像",
    allocatorHint: "零和分配器：总分固定为 100，你的每一次调整都会改变整个城市场域。",
    presetTitle: "快捷画像",
    resetLabel: "重置为 SLIC 基线",
    canonicalBadge: "官方 SLIC 排名",
    customBadge: "你的画像匹配",
    canonicalNote: "声明基线：Growth 25 / Viability 22 / Capability 18 / Community 15 / Creative 20",
    methodologyTitle: "声明方法",
    methodologyBody:
      "Growth 衡量经济活力和塑造城市轨迹的市场力量。它奖励基本开支后的可支配空间，惩罚虚假繁荣。如果你要看更强的竞争锋芒，Creative 才是更直接的支柱。",
    consequencesTitle: "权衡信号",
    noConsequences: "继续调整权重。你的画像越鲜明，这里出现的主要权衡就越清楚。",
    resultsTitle: "最接近的匹配",
    resultsBody: "在基线状态下你看到的是官方 SLIC 排名。一旦你移动滑块，工作台就会切换成对完整 200 城市索引场的画像匹配。",
    bestMatchTitle: "当前最佳匹配",
    bestMatchBody: "下面领先的城市，是与你当前五维画像形状最接近的城市。",
    fitScore: "画像匹配分",
    baseRank: "基础排名",
    citiesLabel: "城市可见",
    top10: "前10",
    top50: "前50",
    showAll: "全部",
    regionLabel: "地区",
    allRegions: "全部地区",
    featureSignal: "当前信号",
    featurePriority: "最接近的支柱",
    featureWhy: "匹配原因",
    featureTags: "场域标签",
    listTitle: "完整画像匹配列表",
    scoreNow: "当前",
    reviewMethodology: "查看方法论",
    downloadSheet: "下载表格模板",
  },
};

const severityLabel: Record<Locale, Record<FiredConsequence["severity"], string>> = {
  en: { mild: "Quiet signal", moderate: "Important trade-off", severe: "Hard warning" },
  th: { mild: "สัญญาณเบา", moderate: "ข้อแลกเปลี่ยนสำคัญ", severe: "คำเตือนแรง" },
  zh: { mild: "轻微信号", moderate: "重要权衡", severe: "强警示" },
};

function scoreCityWithWeights(city: Pick<FullRankedCity, "scores">, weights: Record<PillarId, number>) {
  const total = PILLAR_ORDER.reduce((sum, pillar) => sum + weights[pillar], 0);
  if (total === 0) return 0;

  return PILLAR_ORDER.reduce((sum, pillar) => {
    return sum + (city.scores[pillar] * weights[pillar]) / total;
  }, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function profileMatchScore(city: Pick<FullRankedCity, "scores">, weights: Record<PillarId, number>) {
  // --- Cosine similarity: pure shape match (Cherchye et al., 2007) ---
  // Treats city pillar scores and user weights as vectors; measures angle between them.
  // A city whose strongest pillar matches the user's heaviest weight scores high,
  // regardless of whether absolute scores are 90 or 50.
  const cityVec = PILLAR_ORDER.map((p) => city.scores[p]);
  const weightVec = PILLAR_ORDER.map((p) => weights[p]);
  const dot = cityVec.reduce((sum, v, i) => sum + v * weightVec[i], 0);
  const magCity = Math.sqrt(cityVec.reduce((sum, v) => sum + v * v, 0));
  const magWeight = Math.sqrt(weightVec.reduce((sum, v) => sum + v * v, 0));
  const cosine = magCity > 0 && magWeight > 0 ? dot / (magCity * magWeight) : 0;
  const shapeFit = cosine * 100; // 0–100 scale

  // --- Penalised weighted mean: Mazziotta-Pareto inspired (2016) ---
  // Weighted average of pillar scores, penalised by coefficient of variation.
  // Cities with balanced-but-mediocre scores get less credit than cities
  // whose strengths concentrate where the user cares most.
  const weightedMean = PILLAR_ORDER.reduce(
    (sum, p) => sum + city.scores[p] * (weights[p] / 100),
    0,
  );
  const weightedVariance = PILLAR_ORDER.reduce(
    (sum, p) => sum + (weights[p] / 100) * (city.scores[p] - weightedMean) ** 2,
    0,
  );
  const cv = weightedMean > 0 ? Math.sqrt(weightedVariance) / weightedMean : 0;
  const penalisedMean = weightedMean * (1 - cv * cv);

  // --- How concentrated is the user's profile? ---
  const ordered = [...PILLAR_ORDER].sort((a, b) => weights[b] - weights[a]);
  const concentration = clamp((weights[ordered[0]] - 20) / 30, 0, 1);

  // --- Final blend ---
  // At equal weights (concentration ≈ 0): mostly penalised mean (quality matters)
  // As weights diverge (concentration → 1): cosine similarity dominates (shape matters)
  const shapeWeight = 0.40 + concentration * 0.30;  // 0.40 → 0.70
  const qualityWeight = 1 - shapeWeight;             // 0.60 → 0.30
  const score =
    Math.round(
      (shapeFit * shapeWeight + penalisedMean * qualityWeight) * 10,
    ) / 10;

  return { score, shapeFit: Math.round(shapeFit * 10) / 10 };
}

function scoreToBars(city: Pick<FullRankedCity, "scores">) {
  return PILLAR_ORDER.map((pillar) => ({
    id: pillar,
    score: city.scores[pillar],
    color: PILLAR_COLORS[pillar],
  }));
}

function applyValuesToPillars(labels: Record<PillarId, string>, values: Record<PillarId, number>): PillarAllocation[] {
  return PILLAR_ORDER.map((id) => ({
    id,
    label: labels[id],
    color: PILLAR_COLORS[id],
    value: values[id],
  }));
}

function describePriorityFit(city: FullRankedCity, weights: Record<PillarId, number>, labels: Record<PillarId, string>) {
  return [...PILLAR_ORDER]
    .sort((left, right) => weights[right] - weights[left])
    .slice(0, 2)
    .map((pillar) => `${labels[pillar]} ${city.scores[pillar]}`)
    .join(" · ");
}

function profileReadout(
  weights: Record<PillarId, number>,
  labels: Record<PillarId, string>,
  locale: Locale,
) {
  const ordered = [...PILLAR_ORDER].sort((left, right) => weights[right] - weights[left]);
  const top = ordered.slice(0, 2);
  const low = ordered.slice(-2);

  if (locale === "th") {
    return {
      eyebrow: "ภาพโปรไฟล์ตอนนี้",
      title: `${labels[top[0]]} นำ · ${labels[top[1]]} ตาม`,
      body: `โปรไฟล์นี้ดัน ${labels[top[0]]} และ ${labels[top[1]]} ขึ้นก่อน และยอมลดน้ำหนัก ${labels[low[0]]} กับ ${labels[low[1]]} ลงเพื่อให้สนามเปลี่ยนคาแรกเตอร์ชัดขึ้น`,
    };
  }

  if (locale === "zh") {
    return {
      eyebrow: "当前画像",
      title: `${labels[top[0]]} 优先 · ${labels[top[1]]} 次优先`,
      body: `这个画像优先放大 ${labels[top[0]]} 和 ${labels[top[1]]}，并主动压低 ${labels[low[0]]} 与 ${labels[low[1]]}，让结果更明显地偏向你要的城市类型。`,
    };
  }

  return {
    eyebrow: "Current profile read",
    title: `${labels[top[0]]} first · ${labels[top[1]]} second`,
    body: `This profile actively rewards ${labels[top[0]].toLowerCase()} and ${labels[top[1]].toLowerCase()}, while discounting ${labels[low[0]].toLowerCase()} and ${labels[low[1]].toLowerCase()} so the field shifts toward a more specific city type.`,
  };
}

function formatRankShift(rankShift: number) {
  if (rankShift > 0) return `+${rankShift}`;
  if (rankShift < 0) return `${rankShift}`;
  return "0";
}

export default function RankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const ui = interactiveCopy[locale];
  const labels = PILLAR_LABELS[locale];
  const hints = PILLAR_HINTS[locale];

  const [pillars, setPillars] = useState<PillarAllocation[]>(() => applyValuesToPillars(labels, CANONICAL));
  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(10);

  useEffect(() => {
    setPillars((current) =>
      current.map((pillar) => ({
        ...pillar,
        label: labels[pillar.id as PillarId],
      })),
    );
  }, [labels]);

  const weights = useMemo(() => {
    const currentWeights: Record<string, number> = {};
    pillars.forEach((pillar) => {
      currentWeights[pillar.id] = pillar.value;
    });
    return currentWeights as Record<PillarId, number>;
  }, [pillars]);

  const isCustom = useMemo(() => {
    return PILLAR_ORDER.some((pillar) => weights[pillar] !== CANONICAL[pillar]);
  }, [weights]);

  const activePresetId = useMemo(() => {
    return PRESETS.find((preset) =>
      PILLAR_ORDER.every((pillar) => preset.values[pillar] === weights[pillar]))?.id ?? null;
  }, [weights]);

  const consequences = useMemo<FiredConsequence[]>(() => evaluateConsequences(weights), [weights]);
  const liveProfile = useMemo(() => profileReadout(weights, labels, locale), [labels, locale, weights]);

  const results = useMemo<MatchedCity[]>(() => {
    const filteredCities = region === "All" ? indexedCities : indexedCities.filter((city) => city.region === region);
    if (!isCustom) {
      return [...filteredCities]
        .sort((left, right) => left.globalRank - right.globalRank)
        .map((city, index) => ({
          ...city,
          customScore: Math.round(scoreCityWithWeights(city, CANONICAL) * 10) / 10,
          customRank: index + 1,
          rankShift: 0,
        }));
    }

    return filteredCities
      .map((city) => {
        const { score } = profileMatchScore(city, weights);
        return {
          ...city,
          customScore: score,
        };
      })
      .sort((left, right) => {
        const scoreDelta = right.customScore - left.customScore;
        if (scoreDelta !== 0) return scoreDelta;
        const liveDelta = right.delta - left.delta;
        if (liveDelta !== 0) return liveDelta;
        return left.globalRank - right.globalRank;
      })
      .map((city, index) => ({
        ...city,
        customRank: index + 1,
        rankShift: city.globalRank - (index + 1),
      }));
  }, [isCustom, region, weights]);

  const displayResults = showCountValue >= results.length ? results : results.slice(0, showCountValue);
  const featuredCity = displayResults[0] ?? null;
  const spotlightCities = displayResults.slice(1, Math.min(displayResults.length, 5));
  const listCities = displayResults.slice(5);

  const handleReset = () => {
    setPillars(applyValuesToPillars(labels, CANONICAL));
  };

  const handlePreset = (values: Record<PillarId, number>) => {
    setPillars(applyValuesToPillars(labels, values));
  };

  return (
    <>
      <header className="rankings-hero section">
        <div className="rankings-hero-shell">
          <div className="rankings-hero-copy">
            <p className="eyebrow">{ui.heroEyebrow}</p>
            <h1 className="rankings-title">{ui.heroTitle}</h1>
            <p className="hero-intro">{ui.heroIntro}</p>
          </div>

          <div className="rankings-status-grid">
            <article className="rankings-status-card">
              <span>{ui.indexedCitiesLabel}</span>
              <strong>{indexedCities.length}</strong>
            </article>
            <article className="rankings-status-card">
              <span>{ui.lockedPointsLabel}</span>
              <strong>100</strong>
            </article>
            <article className="rankings-status-card">
              <span>{ui.pillarsLabel}</span>
              <strong>{PILLAR_ORDER.length}</strong>
            </article>
          </div>
        </div>

        <RankingIntegrityBanner locale={locale} />
      </header>

      <main>
        <section className="rankings-stage section">
          <div className="rankings-stage-inner">
            <div className="rankings-preset-group">
              <div className="rankings-preset-row">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`rankings-preset-btn${activePresetId === preset.id ? " is-active" : ""}`}
                    onClick={() => handlePreset(preset.values)}
                  >
                    {preset.label[locale]}
                  </button>
                ))}
                <button type="button" className="rankings-preset-btn" onClick={handleReset}>
                  {ui.resetLabel}
                </button>
              </div>
            </div>

            <ZeroSumAllocator
              pillars={pillars}
              onChange={setPillars}
              size={520}
              descriptions={hints}
            />

            <div className="rankings-stage-readout">
              <div className="rankings-profile-readout">
                <strong>{liveProfile.title}</strong>
                <p>{liveProfile.body}</p>
              </div>
              <span className={`rankings-mode-badge ${isCustom ? "is-custom" : "is-canonical"}`}>
                {isCustom ? ui.customBadge : ui.canonicalBadge}
              </span>
            </div>

            {consequences.length > 0 && (
              <div className="rankings-insight-list">
                {consequences.map((consequence) => (
                  <article key={consequence.id} className={`rankings-insight-card is-${consequence.severity}`}>
                    <span className="rankings-insight-kicker">{severityLabel[locale][consequence.severity]}</span>
                    <p>{consequence.narrative}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="rankings-workbench">
            <div className="rankings-results-panel">
              <div className="rankings-results-shell">
                <div className="rankings-filter-bar">
                  <div>
                    <p className="eyebrow">{ui.resultsTitle}</p>
                    <p className="rankings-results-copy">{ui.resultsBody}</p>
                  </div>

                  <div className="rankings-filter-actions">
                    <div className="rankings-count-toggle">
                      {[10, 50, indexedCities.length].map((count) => (
                        <button
                          key={count}
                          type="button"
                          className={showCountValue === count ? "active" : ""}
                          onClick={() => setShowCountValue(count)}
                        >
                          {count === 10 ? ui.top10 : count === 50 ? ui.top50 : ui.showAll}
                        </button>
                      ))}
                    </div>
                    <div className="region-switch" role="tablist" aria-label={ui.regionLabel}>
                      {exerciseRegions.map((entry) => (
                        <button
                          key={entry}
                          type="button"
                          className={region === entry ? "region-button active" : "region-button"}
                          onClick={() => setRegion(entry)}
                        >
                          {entry === "All" ? ui.allRegions : entry}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rankings-results-meta">
                  <span>
                    <strong>{displayResults.length}</strong> {ui.citiesLabel}
                  </span>
                  <span>{region === "All" ? ui.allRegions : region}</span>
                  <span>{isCustom ? ui.customBadge : ui.canonicalBadge}</span>
                </div>

                {featuredCity ? (
                  <section className="rankings-feature-card">
                    <div className="rankings-feature-topline">
                      <div>
                        <span className="rankings-feature-kicker">{ui.bestMatchTitle}</span>
                        <h3>
                          {featuredCity.name}, {featuredCity.country}
                        </h3>
                        <p>{ui.bestMatchBody}</p>
                      </div>
                      <div className="rankings-feature-score">
                        <span>{ui.fitScore}</span>
                        <strong>{featuredCity.customScore.toFixed(1)}</strong>
                        <small>
                          {ui.baseRank} #{featuredCity.globalRank}
                        </small>
                      </div>
                    </div>

                    <div className="rankings-feature-grid">
                      <article>
                        <span>{ui.featureSignal}</span>
                        <p>{featuredCity.signal}</p>
                      </article>
                      <article>
                        <span>{ui.featurePriority}</span>
                        <p>{describePriorityFit(featuredCity, weights, labels)}</p>
                      </article>
                      <article>
                        <span>{ui.featureWhy}</span>
                        <p>{featuredCity.inclusionRationale}</p>
                      </article>
                      <article>
                        <span>{ui.featureTags}</span>
                        <div className="rankings-tag-row">
                          {featuredCity.tags.slice(0, 4).map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </article>
                    </div>

                    <div className="rankings-feature-bars">
                      {scoreToBars(featuredCity).map((bar) => (
                        <div key={bar.id} className="rankings-feature-bar">
                          <div className="rankings-feature-bar-head">
                            <span>{labels[bar.id]}</span>
                            <strong>{bar.score}</strong>
                          </div>
                          <div className="rankings-feature-track">
                            <div style={{ width: `${bar.score}%`, background: bar.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {spotlightCities.length > 0 ? (
                  <div className="rankings-spotlight-grid">
                    {spotlightCities.map((city) => (
                      <article key={city.id} className="rankings-spotlight-card">
                        <div className="rankings-spotlight-head">
                          <div>
                            <h3>{city.name}</h3>
                            <p>
                              {city.country} · {city.region}
                            </p>
                          </div>
                          <div className="rankings-spotlight-rank">
                            <strong>#{city.customRank}</strong>
                            <span>{formatRankShift(city.rankShift)}</span>
                          </div>
                        </div>
                        <p className="rankings-spotlight-priority">{describePriorityFit(city, weights, labels)}</p>
                        <div className="rankings-tag-row">
                          {city.tags.slice(0, 3).map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="rankings-pillar-bars">
                          {scoreToBars(city).map((bar) => (
                            <div key={bar.id}>
                              <div style={{ width: `${bar.score}%`, background: bar.color }} />
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}

                <section className="rankings-list-section">
                  <div className="rankings-list-head">
                    <h3>{ui.listTitle}</h3>
                  </div>

                  <div className="rankings-row-list">
                    {listCities.map((city) => (
                      <article key={city.id} className="rankings-city-row">
                        <div className="rankings-row-rank">
                          <strong>{String(city.customRank).padStart(2, "0")}</strong>
                          <span>{formatRankShift(city.rankShift)}</span>
                        </div>

                        <div className="rankings-row-main">
                          <div className="rankings-row-title">
                            <h4>{city.name}</h4>
                            <p>
                              {city.country} · {city.region}
                            </p>
                          </div>
                          <p className="rankings-row-priority">{describePriorityFit(city, weights, labels)}</p>
                          <div className="rankings-pillar-bars">
                            {scoreToBars(city).map((bar) => (
                              <div key={bar.id}>
                                <div style={{ width: `${bar.score}%`, background: bar.color }} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rankings-dual-score">
                          <span>{ui.scoreNow}</span>
                          <strong>{city.customScore.toFixed(1)}</strong>
                          <small>
                            {ui.baseRank} #{city.globalRank}
                          </small>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <div className="rankings-actions">
                  <a
                    className="primary-action"
                    href="/methodology"
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate("/methodology");
                    }}
                  >
                    {ui.reviewMethodology}
                  </a>
                  <a className="secondary-action" href="/downloads/slic-google-sheets-template.xlsx" download>
                    {ui.downloadSheet}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
