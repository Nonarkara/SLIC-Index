import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { displayCountry } from "./cityUtils";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { allocatePublicTiers, assignPureScoreRanks } from "./publicTierPolicy.js";
import RankingIntegrityBanner from "./RankingIntegrityBanner";
import { exerciseRegions, getExerciseCities } from "./rankingsData";
import { appHref } from "./routing";
import { scoreCityWithWeights } from "./scoring";
import SiteFooter from "./SiteFooter";
import type { FullRankedCity, Locale, SitePath } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

type MatchedCity = FullRankedCity & {
  customScore: number;
  customRank: number;
  computedTierLabel: "Alpha" | "Beta" | "Gamma" | null;
  computedTierSlot: number | null;
  rankShift: number;
};

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
  ko: { pressure: "성장", viability: "생활가능성", capability: "역량", community: "커뮤니티", creative: "창의성" },
  ja: { pressure: "成長", viability: "生活持続性", capability: "能力", community: "コミュニティ", creative: "創造性" },
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
  ko: {
    pressure: "경제적 역동성, 시장 메커니즘, 자연적 결과로서의 주거 가능성.",
    viability: "안전, 대기, 대중교통, 물, 디지털 안정성.",
    capability: "의료, 교육, 계층 이동을 위한 동등한 접근.",
    community: "소속감, 관용, 공공 생활, 사회적 질감.",
    creative: "창업, 연구, 생산적 경쟁력, 야망.",
  },
  ja: {
    pressure: "経済的活力、市場メカニズム、自然な結果としての生活可能性。",
    viability: "安全、大気、交通、水、デジタルの信頼性。",
    capability: "医療、教育、上方移動への平等なアクセス。",
    community: "帰属感、寛容性、公共の生活、社会的肌合い。",
    creative: "起業家精神、研究、生産的な競争力、野心。",
  },
};

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

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];


const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#f59e0b",
  C: "#f97316",
};

const CANONICAL = publishedData.canonicalWeights as Record<PillarId, number>;
// The live workbench operates on the public Ranked board only — watchlist
// cities are excluded so the spider doesn't surface incomplete-data cities
// (Taichung, Apia, etc.) as top results when sliders shift. globalRank > 0
// is the watchlist signal: rank=0 means the city was held off the public
// board for missing pillars or special status.
const indexedCities = getExerciseCities().filter((city) => city.globalRank > 0);

const PRESETS: Array<{
  id: string;
  values: Record<PillarId, number>;
  label: Record<Locale, string>;
  tagline: Record<Locale, string>;
}> = [
  {
    id: "canonical",
    values: { ...CANONICAL },
    label: {
      en: "Balanced SLIC",
      th: "สมดุลแบบ SLIC",
      zh: "SLIC 平衡",
      ko: "SLIC 균형",
      ja: "SLICバランス",
    },
    tagline: {
      en: "Declared baseline — five pillars, no tilt.",
      th: "ฐานที่ประกาศ — ห้าเสาหลัก ไม่มีการเอียง",
      zh: "声明基线——五个支柱，毫无偏向。",
      ko: "공식 기준선 — 5개 기둥, 치우침 없음.",
      ja: "宣言されたベースライン——5つの柱、偏りなし。",
    },
  },
  {
    id: "thriving",
    values: { pressure: 48, viability: 8, capability: 10, community: 6, creative: 28 },
    label: {
      en: "Economic engine",
      th: "เครื่องยนต์เศรษฐกิจ",
      zh: "经济引擎",
      ko: "경제 엔진",
      ja: "経済エンジン",
    },
    tagline: {
      en: "Growth, growth, growth — we don't care about the rest.",
      th: "โต โต โต — อย่างอื่นไม่สน",
      zh: "增长、增长、增长——其他都不在乎。",
      ko: "성장, 성장, 성장 — 나머지는 중요하지 않습니다.",
      ja: "成長、成長、成長——他は気にしない。",
    },
  },
  {
    id: "affordable",
    values: { pressure: 18, viability: 30, capability: 15, community: 24, creative: 13 },
    label: {
      en: "Affordable metropolis",
      th: "มหานครที่ยังพอใช้ชีวิตได้",
      zh: "可负担的大都市",
      ko: "물가 부담 없는 대도시",
      ja: "手頃な大都市",
    },
    tagline: {
      en: "Big-city life where rent doesn't eat the paycheque.",
      th: "ชีวิตเมืองใหญ่ที่ค่าเช่าไม่กินเงินเดือน",
      zh: "大城市生活，但租金不会吞掉薪水。",
      ko: "집세가 월급을 잡아먹지 않는 대도시 생활",
      ja: "家賃に給料を食われない大都市生活。",
    },
  },
  {
    id: "startup",
    values: { pressure: 26, viability: 14, capability: 22, community: 10, creative: 28 },
    label: {
      en: "Startup town",
      th: "เมืองสตาร์ทอัพ",
      zh: "创业之城",
      ko: "스타트업 도시",
      ja: "スタートアップ都市",
    },
    tagline: {
      en: "Creative edge and capability; growth follows.",
      th: "ความสร้างสรรค์และศักยภาพมาก่อน การเติบโตตามมา",
      zh: "创造力与能力在前，增长随之而来。",
      ko: "창의성과 역량이 먼저, 성장은 뒤따릅니다.",
      ja: "クリエイティブと能力が先、成長はその後。",
    },
  },
  {
    id: "nomad",
    values: { pressure: 12, viability: 30, capability: 18, community: 22, creative: 18 },
    label: {
      en: "Digital nomad dream",
      th: "เมืองในฝันของดิจิทัลโนแมด",
      zh: "数字游民梦想地",
      ko: "디지털 노마드의 꿈",
      ja: "デジタルノマドの夢",
    },
    tagline: {
      en: "Reliable, tolerant, affordable, wired.",
      th: "เสถียร เปิดกว้าง ค่าครองชีพโอเค เน็ตแรง",
      zh: "稳定、包容、可负担、网络发达。",
      ko: "안정적이고, 개방적이며, 저렴하고, 연결된 도시.",
      ja: "安定、寛容、手頃、ネット充実。",
    },
  },
  {
    id: "retirement",
    values: { pressure: 6, viability: 38, capability: 24, community: 26, creative: 6 },
    label: {
      en: "Retirement paradise",
      th: "สวรรค์ของวัยเกษียณ",
      zh: "退休天堂",
      ko: "은퇴 낙원",
      ja: "リタイア天国",
    },
    tagline: {
      en: "Safety, healthcare, belonging — nothing else matters.",
      th: "ปลอดภัย สาธารณสุขดี มีสังคม — เรื่องอื่นไม่สำคัญ",
      zh: "安全、医疗、归属感——其他都不重要。",
      ko: "안전, 의료, 소속감 — 그 외엔 중요하지 않습니다.",
      ja: "安全、医療、帰属感——他は重要でない。",
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
    tierAlpha: string;
    tierBeta: string;
    tierGamma: string;
    tierContenders: string;
    tierBand: string;
  }
> = {
  en: {
    heroEyebrow: "Preference engine",
    heroTitle: "Tune the city field to your life",
    heroIntro:
      "This workbench reranks the full {count}-city indexed field in real time. Drag the spider web, move the sliders, or use a preset to see which cities match the kind of life you actually want.",
    heroNoteTitle: "Why this is traceable",
    heroNoteBody:
      "This is a declared ranking instrument, not a vibe list. The published board keeps one baseline score per city; this workbench lets you compare how the same five pillars behave when you change the weights.",
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
      "Growth captures economic momentum and residual room after essentials. Reweighting here changes emphasis for comparison; it does not rewrite the published workbook score.",
    consequencesTitle: "Trade-off signals",
    noConsequences: "Keep moving the weights. When your profile becomes distinctive, the main trade-offs appear here.",
    resultsTitle: "Closest matches",
    resultsBody: "At baseline you are seeing the published SLIC order. Once you move the bars, the workbench switches into profile matching across the indexed field.",
    bestMatchTitle: "Top current result",
    bestMatchBody: "The lead city below is the closest match to the current five-pillar profile.",
    fitScore: "Current score",
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
    tierAlpha: "ALPHA",
    tierBeta: "BETA",
    tierGamma: "GAMMA",
    tierContenders: "CONTENDERS",
    tierBand: "ranks {from}–{to}",
  },
  th: {
    heroEyebrow: "เครื่องมือปรับความชอบ",
    heroTitle: "จูนสนามเมืองให้เข้ากับชีวิตของคุณ",
    heroIntro:
      "หน้านี้จัดอันดับใหม่แบบสดจากเมืองทั้ง {count} เมืองในสนามดัชนี ลากใยแมงมุม ขยับสไลเดอร์ หรือใช้ preset เพื่อดูว่าเมืองไหนใกล้กับชีวิตที่คุณต้องการจริง ๆ",
    heroNoteTitle: "ทำไมหน้านี้จึงไล่ย้อนกลับได้",
    heroNoteBody:
      "หน้านี้เป็นเครื่องมือจัดอันดับที่ประกาศกรอบชัดเจน ไม่ใช่ลิสต์ตามอารมณ์ บอร์ดที่เผยแพร่เก็บคะแนนพื้นฐานหนึ่งค่าต่อเมือง ส่วนเวิร์กเบนช์นี้ให้คุณเปรียบเทียบว่า 5 เสาหลักเดียวกันตอบสนองอย่างไรเมื่อคุณเปลี่ยนน้ำหนัก",
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
      "Growth สะท้อนโมเมนตัมทางเศรษฐกิจและพื้นที่รายได้หลังจ่ายสิ่งจำเป็น การปรับน้ำหนักที่นี่เป็นการเปลี่ยนมุมเปรียบเทียบเท่านั้น ไม่ได้เขียนทับคะแนนจากเวิร์กบุ๊กที่เผยแพร่",
    consequencesTitle: "สัญญาณข้อแลกเปลี่ยน",
    noConsequences: "ลองขยับน้ำหนักต่อไป เมื่อโปรไฟล์ของคุณชัดขึ้น ข้อแลกเปลี่ยนหลักจะปรากฏตรงนี้",
    resultsTitle: "เมืองที่ใกล้ที่สุด",
    resultsBody: "ที่ค่า baseline คุณกำลังเห็นลำดับ SLIC ที่เผยแพร่แล้ว เมื่อคุณขยับแถบ เวิร์กเบนช์จะเปลี่ยนเป็นการจับคู่โปรไฟล์กับสนามเมืองที่จัดทำดัชนีไว้",
    bestMatchTitle: "ผลลัพธ์นำตอนนี้",
    bestMatchBody: "เมืองด้านล่างคือเมืองที่ใกล้กับโปรไฟล์ 5 เสาหลักปัจจุบันมากที่สุด",
    fitScore: "คะแนนปัจจุบัน",
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
    tierAlpha: "อัลฟา",
    tierBeta: "เบตา",
    tierGamma: "แกมมา",
    tierContenders: "ผู้ท้าชิง",
    tierBand: "อันดับ {from}–{to}",
  },
  zh: {
    heroEyebrow: "偏好引擎",
    heroTitle: "把城市场域调到适合你的生活",
    heroIntro:
      "这个工作台会对完整的 {count} 城市索引场进行实时重排。拖动蛛网图、调整滑块，或使用预设，看看哪些城市最接近你真正想要的生活。",
    heroNoteTitle: "为什么它可以被追溯",
    heroNoteBody:
      "这是一套公开声明的方法工具，而不是一份凭感觉的榜单。已发布榜单为每座城市保留一个基线分数；这个工作台则让你比较同样五个支柱在改动权重后会如何变化。",
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
      "Growth 反映的是经济动能，以及扣除必要开支后的剩余空间。这里的权重调整只会改变比较视角，不会改写已发布的工作簿分数。",
    consequencesTitle: "权衡信号",
    noConsequences: "继续调整权重。你的画像越鲜明，这里出现的主要权衡就越清楚。",
    resultsTitle: "最接近的匹配",
    resultsBody: "在基线状态下你看到的是已发布的 SLIC 顺序。一旦你移动滑块，工作台就会切换成索引城市场中的画像匹配。",
    bestMatchTitle: "当前最高结果",
    bestMatchBody: "下面领先的城市，是与当前五支柱画像最接近的结果。",
    fitScore: "当前分数",
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
    tierAlpha: "阿尔法",
    tierBeta: "贝塔",
    tierGamma: "伽马",
    tierContenders: "挑战者",
    tierBand: "第 {from}–{to} 名",
  },
  ko: {
    heroEyebrow: "선호도 엔진",
    heroTitle: "도시 목록을 내 삶에 맞게 조정하세요",
    heroIntro: "이 워크벤치는 {count}개 전체 인덱스 도시를 실시간으로 재정렬합니다. 거미줄 차트를 드래그하거나, 슬라이더를 조정하거나, 프리셋을 사용해 내가 원하는 삶에 맞는 도시를 찾아보세요.",
    heroNoteTitle: "왜 이 결과를 추적할 수 있는가",
    heroNoteBody: "이것은 공개된 방법론에 기반한 순위 도구입니다. 발표된 순위표는 도시별로 하나의 기준 점수를 유지하며, 이 워크벤치에서는 같은 5개 기둥이 가중치 변화에 어떻게 반응하는지 비교할 수 있습니다.",
    indexedCitiesLabel: "인덱스 도시 수",
    lockedPointsLabel: "고정 점수",
    pillarsLabel: "선언된 기둥",
    allocatorTitle: "이상적인 도시 프로필 설정",
    allocatorHint: "제로섬 배분기: 합계는 항상 100으로 유지되며, 모든 조정이 전체 도시 목록을 변화시킵니다.",
    presetTitle: "빠른 프로필",
    resetLabel: "SLIC 기준으로 초기화",
    canonicalBadge: "공식 SLIC 순위",
    customBadge: "내 프로필 매칭",
    canonicalNote: "선언된 기준: 성장 25 / 생활가능성 22 / 역량 18 / 커뮤니티 15 / 창의성 20",
    methodologyTitle: "선언된 방법론",
    methodologyBody: "성장은 경제적 모멘텀과 필수 지출 후 여유분을 반영합니다. 여기서 가중치를 재조정해도 발표된 워크북 점수는 변경되지 않습니다.",
    consequencesTitle: "트레이드오프 신호",
    noConsequences: "가중치를 계속 조정하세요. 프로필이 뚜렷해질수록 주요 트레이드오프가 여기에 표시됩니다.",
    resultsTitle: "가장 근접한 매칭",
    resultsBody: "기준 상태에서는 발표된 SLIC 순서를 보고 있습니다. 슬라이더를 움직이면 워크벤치가 인덱스 도시 전체에 걸쳐 프로필 매칭 모드로 전환됩니다.",
    bestMatchTitle: "현재 최상위 결과",
    bestMatchBody: "아래 선두 도시가 현재 5개 기둥 프로필에 가장 가까운 결과입니다.",
    fitScore: "현재 점수",
    baseRank: "기본 순위",
    citiesLabel: "표시된 도시",
    top10: "상위 10",
    top50: "상위 50",
    showAll: "전체",
    regionLabel: "지역",
    allRegions: "전체 지역",
    featureSignal: "현재 신호",
    featurePriority: "가장 일치하는 기둥",
    featureWhy: "적합한 이유",
    featureTags: "필드 태그",
    listTitle: "전체 프로필 매칭 목록",
    scoreNow: "현재",
    reviewMethodology: "방법론 검토",
    downloadSheet: "시트 템플릿 다운로드",
    tierAlpha: "알파",
    tierBeta: "베타",
    tierGamma: "감마",
    tierContenders: "도전자",
    tierBand: "{from}–{to}위",
  },
  ja: {
    heroEyebrow: "プリファレンスエンジン",
    heroTitle: "都市フィールドを自分の生活に合わせて調整",
    heroIntro: "このワークベンチは{count}都市全体をリアルタイムで再ランキングします。スパイダー図をドラッグするか、スライダーを調整するか、プリセットを使用して、本当に望む生活に合った都市を見つけてください。",
    heroNoteTitle: "なぜ追跡可能なのか",
    heroNoteBody: "これは公開された方法論に基づくランキングツールです。公開されたボードは都市ごとに1つの基準スコアを保持しており、このワークベンチでは同じ5つの柱が重みを変えたときにどう変化するかを比較できます。",
    indexedCitiesLabel: "インデックス都市数",
    lockedPointsLabel: "固定ポイント",
    pillarsLabel: "宣言された柱",
    allocatorTitle: "理想の都市プロファイルを設定",
    allocatorHint: "ゼロサム配分器：合計は常に100で、調整するたびに都市フィールド全体が変化します。",
    presetTitle: "クイックプロファイル",
    resetLabel: "SLICベースラインにリセット",
    canonicalBadge: "公式SLICランキング",
    customBadge: "あなたのプロファイル一致",
    canonicalNote: "宣言されたベースライン：成長 25 / 生活持続性 22 / 能力 18 / コミュニティ 15 / 創造性 20",
    methodologyTitle: "宣言された方法論",
    methodologyBody: "成長は経済的モメンタムと必要経費後の余裕を反映します。ここでの重みの調整は公開されたワークブックスコアを変更しません。",
    consequencesTitle: "トレードオフシグナル",
    noConsequences: "引き続き重みを調整してください。プロファイルが明確になると、主なトレードオフがここに表示されます。",
    resultsTitle: "最も近い一致",
    resultsBody: "ベースライン状態では公開されたSLICの順序が表示されます。スライダーを動かすと、ワークベンチはインデックスフィールド全体でのプロファイルマッチングモードに切り替わります。",
    bestMatchTitle: "現在の最上位結果",
    bestMatchBody: "以下のリード都市が、現在の5柱プロファイルに最も近い結果です。",
    fitScore: "現在のスコア",
    baseRank: "基本ランク",
    citiesLabel: "表示中の都市",
    top10: "上位10",
    top50: "上位50",
    showAll: "すべて",
    regionLabel: "地域",
    allRegions: "全地域",
    featureSignal: "現在のシグナル",
    featurePriority: "最も一致する柱",
    featureWhy: "適合する理由",
    featureTags: "フィールドタグ",
    listTitle: "プロファイル一致の全リスト",
    scoreNow: "現在",
    reviewMethodology: "方法論を確認",
    downloadSheet: "シートテンプレートをダウンロード",
    tierAlpha: "アルファ",
    tierBeta: "ベータ",
    tierGamma: "ガンマ",
    tierContenders: "上位候補群",
    tierBand: "{from}–{to}位",
  },
};

const severityLabel: Record<Locale, Record<FiredConsequence["severity"], string>> = {
  en: { mild: "Quiet signal", moderate: "Important trade-off", severe: "Hard warning" },
  th: { mild: "สัญญาณเบา", moderate: "ข้อแลกเปลี่ยนสำคัญ", severe: "คำเตือนแรง" },
  zh: { mild: "轻微信号", moderate: "重要权衡", severe: "强警示" },
  ko: { mild: "약한 신호", moderate: "중요한 트레이드오프", severe: "강한 경고" },
  ja: { mild: "軽微なシグナル", moderate: "重要なトレードオフ", severe: "強い警告" },
};

/**
 * AMPI across pillars — matches the published SLIC aggregation.
 *
 *   μ    = weighted mean of pillar scores (with user-chosen weights)
 *   σ²   = weighted variance
 *   AMPI = μ − σ²/μ   (penalises pillar imbalance)
 */
function scoreCity(city: Pick<FullRankedCity, "scores">, weights: Record<PillarId, number>) {
  return scoreCityWithWeights({
    pressure: city.scores.pressure,
    viability: city.scores.viability,
    capability: city.scores.capability,
    community: city.scores.community,
    creative: city.scores.creative,
  }, weights);
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

function applyValuesToPillars(labels: Record<PillarId, string>, values: Record<PillarId, number>): PillarAllocation[] {
  return PILLAR_ORDER.map((id) => ({
    id,
    label: labels[id],
    color: PILLAR_COLORS[id],
    value: values[id],
  }));
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

  if (locale === "ko") {
    return {
      eyebrow: "현재 프로필",
      title: `${labels[top[0]]} 우선 · ${labels[top[1]]} 차순위`,
      body: `이 프로필은 ${labels[top[0]]}과 ${labels[top[1]]}을 적극적으로 우대하며, ${labels[low[0]]}과 ${labels[low[1]]}의 비중을 낮춰 더 구체적인 도시 유형으로 결과를 이동시킵니다.`,
    };
  }

  if (locale === "ja") {
    return {
      eyebrow: "現在のプロファイル",
      title: `${labels[top[0]]} 優先 · ${labels[top[1]]} 次優先`,
      body: `このプロファイルは${labels[top[0]]}と${labels[top[1]]}を積極的に評価し、${labels[low[0]]}と${labels[low[1]]}の比重を下げることで、より特定の都市タイプへと結果を絞り込みます。`,
    };
  }

  return {
    eyebrow: "Current profile read",
    title: `${labels[top[0]]} first · ${labels[top[1]]} second`,
    body: `This profile actively rewards ${labels[top[0]].toLowerCase()} and ${labels[top[1]].toLowerCase()}, while discounting ${labels[low[0]].toLowerCase()} and ${labels[low[1]].toLowerCase()} so the field shifts toward a more specific city type.`,
  };
}

export default function RankingsPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
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
    const scoredCities = (isCustom
      ? filteredCities.map((city) => ({
          ...city,
          customScore: profileMatchScore(city, weights).score,
        }))
      : filteredCities.map((city) => ({
          ...city,
          customScore: Math.round(scoreCity(city, CANONICAL) * 10) / 10,
        }))) as Array<FullRankedCity & { customScore: number }>;

    const rankedCities = assignPureScoreRanks(scoredCities, {
      scoreKey: "customScore",
      rankKey: "customRank",
    });
    const tieredCities = allocatePublicTiers(rankedCities, {
      scoreKey: "customScore",
      rankKey: "customRank",
      tierLabelKey: "computedTierLabel",
      tierSlotKey: "computedTierSlot",
    });

    return tieredCities.map((city) => ({
      ...city,
      rankShift: isCustom ? city.globalRank - city.customRank : 0,
    }));
  }, [isCustom, region, weights]);

  const displayResults = showCountValue >= results.length ? results : results.slice(0, showCountValue);
  const featuredCity = displayResults[0] ?? null;

  const activePreset = useMemo(
    () => PRESETS.find((preset) => preset.id === activePresetId) ?? null,
    [activePresetId],
  );

  const tierGroups = useMemo(() => {
    const tiers: Array<{
      id: "alpha" | "beta" | "gamma" | "contenders";
      label: string;
      from: number;
      to: number;
      cities: MatchedCity[];
    }> = [];
    const tierSpecs: Array<{
      id: "alpha" | "beta" | "gamma";
      label: string;
      tierLabel: MatchedCity["computedTierLabel"];
    }> = [
      { id: "alpha", label: ui.tierAlpha, tierLabel: "Alpha" },
      { id: "beta", label: ui.tierBeta, tierLabel: "Beta" },
      { id: "gamma", label: ui.tierGamma, tierLabel: "Gamma" },
    ];
    tierSpecs.forEach((spec) => {
      const cities = displayResults.filter((city) => city.computedTierLabel === spec.tierLabel);
      if (cities.length > 0) {
        tiers.push({
          id: spec.id,
          label: spec.label,
          from: Math.min(...cities.map((city) => city.customRank)),
          to: Math.max(...cities.map((city) => city.customRank)),
          cities,
        });
      }
    });
    const contenders = displayResults.filter((city) => city.computedTierLabel === null);
    if (contenders.length > 0) {
      tiers.push({
        id: "contenders",
        label: ui.tierContenders,
        from: Math.min(...contenders.map((city) => city.customRank)),
        to: Math.max(...contenders.map((city) => city.customRank)),
        cities: contenders,
      });
    }
    return tiers;
  }, [displayResults, ui.tierAlpha, ui.tierBeta, ui.tierGamma, ui.tierContenders]);


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
            <p className="hero-intro">{ui.heroIntro.replace("{count}", String(indexedCities.length))}</p>
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
              {activePreset && (
                <p className="rankings-preset-tagline">{activePreset.tagline[locale]}</p>
              )}
            </div>

            <ZeroSumAllocator
              pillars={pillars}
              onChange={setPillars}
              size={430}
              descriptions={hints}
              locale={locale}
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
                    <div className="region-switch" role="group" aria-label={ui.regionLabel}>
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

                {featuredCity && (
                  <section className="rankings-feature-card">
                    <div className="rankings-feature-topline">
                      <div>
                        <span className="rankings-feature-kicker">{ui.bestMatchTitle}</span>
                        <h3>
                          {featuredCity.name}{displayCountry(featuredCity.country) ? `, ${displayCountry(featuredCity.country)}` : ""}
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
                  </section>
                )}

                {/* Coverage legend */}
                <div className="coverage-legend">
                  {locale === "en" ? "Data coverage: " : locale === "th" ? "ครอบคลุมข้อมูล: " : "数据覆盖: "}
                  <span style={{ color: GRADE_COLORS.A }}>A</span> 75%+
                  {" · "}
                  <span style={{ color: GRADE_COLORS.B }}>B</span> 50–74%
                  {" · "}
                  <span style={{ color: GRADE_COLORS.C }}>C</span> 35–49%
                </div>

                {/* City list grouped by tier */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {tierGroups.map((tier) => (
                    <div key={tier.id}>
                      <div className="rankings-tier-heading">
                        <span className={`v3-tier-badge v3-tier-badge--${tier.id === "contenders" ? "gamma" : tier.id}`}>
                          {tier.id === "alpha" ? "\u03B1 " : tier.id === "beta" ? "\u03B2 " : tier.id === "gamma" ? "\u03B3 " : ""}
                          {tier.label}
                        </span>
                        <small>
                          {ui.tierBand.replace("{from}", String(tier.from)).replace("{to}", String(tier.to))}
                        </small>
                      </div>
                      {tier.cities.map((city) => {
                        const pillarScores = {
                          pressure: city.scores.pressure,
                          viability: city.scores.viability,
                          capability: city.scores.capability,
                          community: city.scores.community,
                          creative: city.scores.creative,
                        };
                        const isTop = city.customRank <= 3;
                        return (
                          <a
                            key={city.id}
                            className={`rankings-city-row${isTop ? " is-top" : ""}`}
                            href={appHref(`/city/${city.id}`)}
                            onClick={(event) => navigateLink(event, onNavigate, `/city/${city.id}`)}
                            aria-label={`View ${city.name} scorecard`}
                            style={{ cursor: "pointer" }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div className="city-name-row">
                                <span className="city-display-name">{city.name}</span>
                                {displayCountry(city.country) && <span className="city-country">{displayCountry(city.country)}</span>}
                              </div>
                              <div className="rankings-pillar-bars">
                                {PILLAR_ORDER.map((pid) => (
                                  <div key={pid}>
                                    <div style={{ width: `${pillarScores[pid]}%`, background: PILLAR_COLORS[pid] }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <span className="city-tier-arrow">&#8250;</span>
                          </a>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="rankings-actions">
                  <a
                    className="primary-action"
                    href={appHref("/methodology")}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate("/methodology");
                    }}
                  >
                    {ui.reviewMethodology}
                  </a>
                  <a className="secondary-action" href={`${BASE}/downloads/slic-google-sheets-template.xlsx`} download>
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
