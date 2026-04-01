import { useEffect, useMemo, useState } from "react";
import ZeroSumAllocator from "./ZeroSumAllocator";
import type { PillarAllocation } from "./ZeroSumAllocator";
import { evaluateConsequences } from "./consequenceRules";
import type { FiredConsequence } from "./consequenceRules";
import publishedData from "./data/publishedRankingData.json";
import { buildLandingData } from "./landingData";
import { rankingRegions } from "./rankingsData";
import { getVisitorStats } from "./visitorTracking";
// RankingIntegrityBanner used on rankings page; home uses inline status line
import { getMethodologyData } from "./methodologyData";
import PillarWeightChart from "./PillarWeightChart";
// getCopy used indirectly via other modules
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

const data = buildLandingData();

/* ───── pillar config ───── */

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#ff6b35",
  viability: "#00ff88",
  capability: "#4488ff",
  community: "#ff3366",
  creative: "#ffcc00",
};

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};

/* Pillar hints moved to rankings page; home page uses compact legend */

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const EQUAL_WEIGHT = 20;

/* ───── published ranking data (single source of truth) ───── */

interface PublishedCity {
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

const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");

function scoreCityWithWeights(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => {
    const pillarScore = city[`${p}Score` as keyof PublishedCity] as number;
    return s + (pillarScore * weights[p]) / total;
  }, 0);
}

/* ───── copy ───── */

const heroCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  strapline: string;
  allocatorHint: string;
  resetLabel: string;
  equalBadge: string;
  customBadge: string;
  equalNote: string;
  consequencesTitle: string;
  yourScore: string;
  citiesLabel: string;
  top10: string;
  top50: string;
  showAll: string;
  regionLabel: string;
  allRegions: string;
  seeSlicRanking: string;
  seeMethodology: string;
}> = {
  en: {
    eyebrow: "SLIC V3 — 2026",
    title: "Not a ranking.\nA reality check.",
    strapline: "157 cities grouped by how they actually feel to live in. Click any city — see exactly where every number comes from. No hidden formulas, no prestige bias, no bullshit.",
    allocatorHint: "Drag the web or use sliders. Total = 100.",
    resetLabel: "Reset",
    equalBadge: "Equal weights",
    customBadge: "Your priorities",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "Trade-offs",
    yourScore: "Score",
    citiesLabel: "cities",
    top10: "Alpha",
    top50: "α β γ",
    showAll: "All",
    regionLabel: "Region",
    allRegions: "All",
    seeSlicRanking: "See SLIC ranking",
    seeMethodology: "Methodology",
  },
  th: {
    eyebrow: "SLIC Index V3 — 2026",
    title: "เราเลิกจัดอันดับ\nเราเริ่มวินิจฉัย",
    strapline: "157 เมือง 5 เสาหลัก ทุกตัวเลขสืบย้อนได้ถึงแหล่งที่มา เราเบื่อที่จะบอกว่าเมืองหนึ่งดีกว่าอีกเมืองด้วย 0.3 คะแนน",
    allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวม = 100",
    resetLabel: "รีเซ็ต",
    equalBadge: "น้ำหนักเท่ากัน",
    customBadge: "ลำดับของคุณ",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "ข้อแลกเปลี่ยน",
    yourScore: "คะแนน",
    citiesLabel: "เมือง",
    top10: "Alpha",
    top50: "α β γ",
    showAll: "ทั้งหมด",
    regionLabel: "ภูมิภาค",
    allRegions: "ทั้งหมด",
    seeSlicRanking: "ดูอันดับ SLIC",
    seeMethodology: "ระเบียบวิธี",
  },
  zh: {
    eyebrow: "SLIC Index V3 — 2026",
    title: "我们不再排名\n我们开始诊断",
    strapline: "157 座城市，五大支柱，每个数字都可追溯来源。我们厌倦了假装一个城市以 0.3 分优于另一个城市。",
    allocatorHint: "拖动蛛网图或使用滑块，总分 = 100",
    resetLabel: "重置",
    equalBadge: "等权重",
    customBadge: "你的优先级",
    equalNote: "20 / 20 / 20 / 20 / 20",
    consequencesTitle: "权衡",
    yourScore: "得分",
    citiesLabel: "城市",
    top10: "Alpha",
    top50: "α β γ",
    showAll: "全部",
    regionLabel: "地区",
    allRegions: "全部",
    seeSlicRanking: "查看 SLIC 排名",
    seeMethodology: "方法论",
  },
};

/* ───── severity → CSS class map ───── */

const severityClass: Record<string, string> = {
  severe: "tradeoff-card tradeoff-card--severe",
  moderate: "tradeoff-card tradeoff-card--moderate",
  mild: "tradeoff-card tradeoff-card--mild",
};

/* ───── editorial copy ───── */

const homeEditorialCopy: Record<
  Locale,
  {
    manifestoTitle: string;
    manifestoBody: string;
    manifestoFormula: string;
    manifestoDoctrine: Array<{ title: string; body: string }>;
    methodologyTitle: string;
    methodologySummary: string;
    weightLabel: string;
    weightTitle: string;
    weightSummary: string;
    methodologySurfaceTitle: string;
    methodologySurfaceSummary: string;
    methodologyAction: string;
    spotlightsEyebrow: string;
    spotlightsTitle: string;
    spotlightsSummary: string;
  }
> = {
  en: {
    manifestoTitle: "A ranking that treats cities as places to live, not trophies to display.",
    manifestoBody:
      "Too many city rankings reward prestige, cost, or brand power. SLIC asks where a person can still build a life, keep dignity, feel safe, and find some ambition without being crushed by the city itself.",
    manifestoFormula:
      "City value = real room to live + daily confidence + social openness + productive possibility",
    manifestoDoctrine: [
      { title: "Outcomes over gadgetry", body: "Technology matters only when it improves the lived city." },
      { title: "Livability over GDP optics", body: "A wealthy city can still fail if housing stress, overwork, or thin community make meaningful life difficult." },
      { title: "Culture is infrastructure too", body: "Belonging, hospitality, variety, and urban character are part of what makes a city resilient and worth choosing." },
    ],
    methodologyTitle: "Five declared pillars, full doctrine in the paper.",
    methodologySummary: "The homepage keeps the public story legible. The methodology paper carries the formal score, notation, source hierarchy, and worksheet logic.",
    weightLabel: "What the official score weighs",
    weightTitle: "Five declared pillars, one fixed public formula.",
    weightSummary: "Growth carries the largest share in the SLIC canonical ranking, followed by viability, capability, community, and creative vitality.",
    methodologySurfaceTitle: "What SLIC is trying to surface",
    methodologySurfaceSummary: "The strongest cities here are not just clean or rich. They are places where people can still afford life, move with confidence, find community, and keep ambition alive without the city draining them dry.",
    methodologyAction: "Enter the full methodology",
    spotlightsEyebrow: "City spotlights",
    spotlightsTitle: "Examples that prove the thesis",
    spotlightsSummary: "The index surfaces compelling cities that traditional prestige rankings often flatten or ignore.",
  },
  th: {
    manifestoTitle: "การจัดอันดับที่มองเมืองเป็นที่อยู่อาศัย ไม่ใช่ถ้วยรางวัลสำหรับโชว์",
    manifestoBody: "การจัดอันดับจำนวนมากให้รางวัลกับชื่อเสียง ราคาแพง หรือแบรนด์ของเมือง แต่ SLIC ถามว่าเมืองไหนยังทำให้คนสร้างชีวิต รักษาศักดิ์ศรี รู้สึกปลอดภัย และยังมีพื้นที่ให้ความทะเยอทะยานเติบโตได้โดยไม่ถูกเมืองบดขยี้",
    manifestoFormula: "คุณค่าของเมือง = พื้นที่ชีวิตจริง + ความมั่นใจในชีวิตประจำวัน + ความเปิดกว้างทางสังคม + โอกาสในการเติบโต",
    manifestoDoctrine: [
      { title: "ผลลัพธ์มาก่อนอุปกรณ์", body: "เทคโนโลยีมีความหมายก็ต่อเมื่อทำให้ชีวิตเมืองดีขึ้นจริง" },
      { title: "คุณภาพชีวิตมาก่อนภาพลวงตา GDP", body: "เมืองที่มั่งคั่งก็ยังล้มเหลวได้ หากค่าที่อยู่อาศัย ความเหนื่อยล้า หรือชุมชนที่บางเกินไปทำให้ชีวิตที่มีความหมายเกิดขึ้นยาก" },
      { title: "วัฒนธรรมก็คือโครงสร้างพื้นฐาน", body: "ความรู้สึกเป็นส่วนหนึ่ง การต้อนรับ ความหลากหลาย และคาแรกเตอร์ของเมือง เป็นส่วนหนึ่งของความยืดหยุ่นและความน่าเลือกของเมือง" },
    ],
    methodologyTitle: "หน้าแรกแสดงห้าเสาหลัก ส่วนหลักการเต็มอยู่ใน methodology paper",
    methodologySummary: "หน้าแรกทำให้เรื่องนี้อ่านง่ายสำหรับสาธารณะ ส่วน methodology paper จะแสดงสมการเต็ม สัญลักษณ์ ลำดับชั้นของแหล่งข้อมูล",
    weightLabel: "น้ำหนักที่สูตรทางการใช้จริง",
    weightTitle: "ห้าเสาหลักที่ประกาศชัด และสูตรสาธารณะเพียงสูตรเดียว",
    weightSummary: "ในอันดับ SLIC ทางการ การเติบโตมีน้ำหนักมากที่สุด ตามด้วยความน่าอยู่ ศักยภาพ ชุมชน และพลังสร้างสรรค์",
    methodologySurfaceTitle: "สิ่งที่ SLIC พยายามทำให้มองเห็น",
    methodologySurfaceSummary: "เมืองที่แข็งแรงในดัชนีนี้ไม่ใช่แค่สะอาดหรือรวย แต่เป็นเมืองที่คนยังพอมีชีวิตที่จ่ายไหว เคลื่อนที่ได้อย่างมั่นใจ มีชุมชน และยังรักษาความทะเยอทะยานไว้ได้",
    methodologyAction: "เข้าสู่ methodology เต็มรูปแบบ",
    spotlightsEyebrow: "ตัวอย่างเมือง",
    spotlightsTitle: "ตัวอย่างที่พิสูจน์สมมติฐาน",
    spotlightsSummary: "ดัชนีนี้ถูกออกแบบมาเพื่อดึงเมืองที่น่าสนใจขึ้นมาให้เห็น แม้อันดับเชิงชื่อเสียงแบบเดิมมักทำให้เมืองเหล่านี้ถูกมองข้าม",
  },
  zh: {
    manifestoTitle: "把城市当成可以生活的地方，而不是拿来炫耀的奖杯。",
    manifestoBody: "太多城市排名奖赏的是声望、高价与品牌。SLIC 追问的是：一个人能否在这里建立生活、保持尊严、拥有安全感，并在不被城市榨干的情况下继续成长。",
    manifestoFormula: "城市价值 = 真实生活空间 + 日常信心 + 社会开放度 + 生产性机会",
    manifestoDoctrine: [
      { title: "结果优先于炫技", body: "技术只有在改善真实城市生活时才值得计分。" },
      { title: "宜居性优先于 GDP 表演", body: "一个城市即使富有，也可能因为住房压力、过劳或脆弱的共同体而难以承载有意义的生活。" },
      { title: "文化本身也是基础设施", body: "归属感、好客、多样性与城市个性，本来就是城市韧性与吸引力的一部分。" },
    ],
    methodologyTitle: "首页呈现五个公开支柱，完整方法在论文页展开。",
    methodologySummary: "首页保持公共叙事的清晰度；方法论页面则完整展示分数公式、符号表、来源层级。",
    weightLabel: "官方分数到底在权衡什么",
    weightTitle: "五个公开支柱，一条固定的公开公式。",
    weightSummary: "在 SLIC 标准排名中，增长权重最高，其次是宜居、能力、社区和创新活力。",
    methodologySurfaceTitle: "SLIC 想真正显现的东西",
    methodologySurfaceSummary: "这个榜单里的强城，不只是干净或富有，而是那些仍让人负担得起生活、能安心移动、能找到共同体的地方。",
    methodologyAction: "进入完整方法论",
    spotlightsEyebrow: "城市样本",
    spotlightsTitle: "能够证明这套判断的例子",
    spotlightsSummary: "这个指数本来就是为了把那些有说服力的城市显出来，即使传统声望排名常常会把它们压平或忽略。",
  },
};

/* ───── launch section copy ───── */

const LAUNCH_PHOTOS = {
  hero: "/launch-photos/20260318145941_DSC09480.jpg",
  stage: "/launch-photos/20260318145249_ABC01948.jpg",
  slide: "/launch-photos/20260318145319_DSC09441.jpg",
  laptop: "/launch-photos/20260317094731-_DON7077.jpg",
  networking: "/launch-photos/20260318151147_DSC09510.jpg",
};

const launchCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  stats: Array<{ value: string; label: string }>;
  paragraphs: string[];
  pullquote: string;
  photoCaption: string;
}> = {
  en: {
    eyebrow: "V1 \u2192 V2 \u2192 V3: The Story",
    title: "From a Spreadsheet to a Movement",
    stats: [
      { value: "V1", label: "Busan #1" },
      { value: "V2", label: "Taipei launch" },
      { value: "V3", label: "tiers, not ranks" },
      { value: "157", label: "cities" },
    ],
    paragraphs: [
      "V1 was a spreadsheet. Busan came out on top. We thought we were done. We were wrong.",
      "V2 launched at the Smart City Summit & Expo 2026 in Taipei \u2014 the world\u2019s biggest smart city stage. The Vice President of Taiwan opened it. Dr. Non showed a war dashboard built in 45 minutes, a bus tracker running without GPS, a citizen system that cut response times from 67 hours to 2. Then: the SLIC Index. 103 cities. Five dimensions. Kaohsiung #1. The room went quiet. A European mayor\u2019s alliance asked to use it instead of The Economist\u2019s index. City leaders lined up: \u201CCan you do this for my city?\u201D",
      "V3 grew up. We realized that arguing whether city #7 beats city #8 by 0.3 points is absurd. So we built tiers \u2014 Alpha, Beta, Gamma \u2014 and made every single number traceable to its source. Click any city and you see exactly where the score comes from: which data, which formula, which source. We added growth momentum, penalized overwork and suicide rates, rewarded tolerance and cultural diversity. Cities that look good on paper but crush their residents got pushed down. Cities where people actually want to live rose up.",
    ],
    pullquote: "\u201CWe stopped ranking. We started telling the truth.\u201D",
    photoCaption: "City Vision in Action, SCSE 2026, Taipei",
  },
  th: {
    eyebrow: "การเปิดตัว",
    title: "SLIC Index เปิดตัวบนเวทีสมาร์ทซิตี้ที่ใหญ่ที่สุดของโลก",
    stats: [
      { value: "174", label: "เมือง" },
      { value: "53", label: "ประเทศ" },
      { value: "3,000+", label: "ผู้เชี่ยวชาญ" },
      { value: "2,250", label: "บูธ" },
    ],
    paragraphs: [
      "\u0e14\u0e23.\u0e13\u0e13 \u0e2d\u0e32\u0e04\u0e32\u0e23\u0e30 \u0e08\u0e32\u0e01\u0e2a\u0e33\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19\u0e2a\u0e48\u0e07\u0e40\u0e2a\u0e23\u0e34\u0e21\u0e40\u0e28\u0e23\u0e29\u0e10\u0e01\u0e34\u0e08\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25 (depa) \u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e43\u0e19\u0e2a\u0e2d\u0e07 keynote speaker \u0e1a\u0e19\u0e40\u0e27\u0e17\u0e35 City Vision\u2014\u0e2b\u0e31\u0e27\u0e43\u0e08\u0e02\u0e2d\u0e07\u0e07\u0e32\u0e19 Smart City Summit & Expo (SCSE) 2026 \u0e17\u0e35\u0e48\u0e44\u0e17\u0e40\u0e1b \u0e23\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e18\u0e32\u0e19\u0e32\u0e18\u0e34\u0e1a\u0e14\u0e35\u0e44\u0e15\u0e49\u0e2b\u0e27\u0e31\u0e19\u0e40\u0e1b\u0e34\u0e14\u0e07\u0e32\u0e19 \u0e1c\u0e39\u0e49\u0e27\u0e48\u0e32\u0e01\u0e23\u0e38\u0e07\u0e44\u0e17\u0e40\u0e1b\u0e02\u0e36\u0e49\u0e19\u0e1e\u0e39\u0e14\u0e1a\u0e19\u0e40\u0e27\u0e17\u0e35 \u0e23\u0e31\u0e10\u0e21\u0e19\u0e15\u0e23\u0e35\u0e41\u0e25\u0e30\u0e1c\u0e39\u0e49\u0e19\u0e33\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e08\u0e32\u0e01\u0e17\u0e31\u0e48\u0e27\u0e42\u0e25\u0e01\u0e21\u0e32\u0e23\u0e27\u0e21\u0e15\u0e31\u0e27\u0e01\u0e31\u0e19",
      "\u0e40\u0e02\u0e32\u0e42\u0e0a\u0e27\u0e4c war dashboard \u0e17\u0e35\u0e48\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e43\u0e19 45 \u0e19\u0e32\u0e17\u0e35 \u0e23\u0e30\u0e1a\u0e1a\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e23\u0e16\u0e40\u0e21\u0e25\u0e4c\u0e20\u0e39\u0e40\u0e01\u0e47\u0e15\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e49 GPS \u0e23\u0e30\u0e1a\u0e1a\u0e23\u0e49\u0e2d\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e35\u0e48\u0e25\u0e14\u0e40\u0e27\u0e25\u0e32\u0e15\u0e2d\u0e1a\u0e2a\u0e19\u0e2d\u0e07\u0e08\u0e32\u0e01 67 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e40\u0e2b\u0e25\u0e37\u0e2d 2 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e40\u0e1b\u0e34\u0e14\u0e15\u0e31\u0e27 SLIC Index \u0e40\u0e01\u0e32\u0e2a\u0e07: #1 \u0e44\u0e17\u0e40\u0e1b: #2 \u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e: #4",
      "\u0e2b\u0e49\u0e2d\u0e07\u0e40\u0e07\u0e35\u0e22\u0e1a\u0e25\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e33\u0e16\u0e32\u0e21\u0e01\u0e47\u0e40\u0e23\u0e34\u0e48\u0e21 \u0e1e\u0e31\u0e19\u0e18\u0e21\u0e34\u0e15\u0e23\u0e19\u0e32\u0e22\u0e01\u0e40\u0e17\u0e28\u0e21\u0e19\u0e15\u0e23\u0e35\u0e22\u0e38\u0e42\u0e23\u0e1b\u0e02\u0e2d\u0e43\u0e0a\u0e49\u0e41\u0e17\u0e19\u0e14\u0e31\u0e0a\u0e19\u0e35\u0e02\u0e2d\u0e07 The Economist \u0e1c\u0e39\u0e49\u0e19\u0e33\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e08\u0e32\u0e01\u0e40\u0e2d\u0e40\u0e0a\u0e35\u0e22\u0e41\u0e25\u0e30\u0e2d\u0e40\u0e21\u0e23\u0e34\u0e01\u0e32\u0e16\u0e32\u0e21\u0e27\u0e48\u0e32: \u201C\u0e17\u0e33\u0e43\u0e2b\u0e49\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e02\u0e2d\u0e07\u0e40\u0e23\u0e32\u0e44\u0e14\u0e49\u0e44\u0e2b\u0e21?\u201D",
    ],
    pullquote: "\u201C\u0e40\u0e23\u0e32\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e14\u0e31\u0e0a\u0e19\u0e35 \u0e04\u0e38\u0e13\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u201D",
    photoCaption: "\u0e40\u0e27\u0e17\u0e35 City Vision in Action, SCSE 2026, \u0e44\u0e17\u0e40\u0e1b",
  },
  zh: {
    eyebrow: "\u53d1\u5e03",
    title: "SLIC \u6307\u6570\u5728\u5168\u7403\u6700\u5927\u667a\u6167\u57ce\u5e02\u821e\u53f0\u4e0a\u53d1\u5e03",
    stats: [
      { value: "174", label: "\u57ce\u5e02" },
      { value: "53", label: "\u56fd\u5bb6" },
      { value: "3,000+", label: "\u4e13\u4e1a\u4eba\u58eb" },
      { value: "2,250", label: "\u5c55\u4f4d" },
    ],
    paragraphs: [
      "\u6765\u81ea\u6cf0\u56fd\u6570\u5b57\u7ecf\u6d4e\u4fc3\u8fdb\u5c40 (depa) \u7684 Non Arkara \u535a\u58eb\u662f City Vision \u821e\u53f0\u7684\u4e24\u4f4d\u4e3b\u9898\u6f14\u8bb2\u8005\u4e4b\u4e00\u2014\u2014\u8fd9\u662f 2026 \u5e74\u53f0\u5317\u667a\u6167\u57ce\u5e02\u5c55\u89c8\u4f1a (SCSE) \u7684\u6838\u5fc3\u821e\u53f0\u3002\u53f0\u6e7e\u526f\u603b\u7edf\u5f00\u5e55\uff0c\u53f0\u5317\u5e02\u957f\u767b\u53f0\u6f14\u8bb2\uff0c\u5404\u56fd\u5916\u4ea4\u90e8\u957f\u548c\u57ce\u5e02\u9886\u5bfc\u4eba\u9f50\u805a\u4e00\u5802\u3002",
      "\u4ed6\u5c55\u793a\u4e8645\u5206\u949f\u5185\u6784\u5efa\u7684\u6218\u4e89\u4eea\u8868\u76d8\u3001\u4e0d\u4f7f\u7528GPS\u7684\u666e\u5409\u5c9b\u516c\u4ea4\u8ffd\u8e2a\u5668\u3001\u5c06\u54cd\u5e94\u65f6\u95f4\u4ece67\u5c0f\u65f6\u7f29\u77ed\u52302\u5c0f\u65f6\u7684\u5e02\u6c11\u62a5\u544a\u7cfb\u7edf\u3002\u7136\u540e\u53d1\u5e03\u4e86 SLIC \u6307\u6570\u3002\u9ad8\u96c4: #1\u3002\u53f0\u5317: #2\u3002\u66fc\u8c37: #4\u3002\u65b0\u52a0\u5761: #8\u3002",
      "\u5168\u573a\u9759\u9ed8\u3002\u7136\u540e\u95ee\u9898\u5f00\u59cb\u4e86\u3002\u6b27\u6d32\u5e02\u957f\u8054\u76df\u8981\u6c42\u7528\u5b83\u66ff\u4ee3\u300a\u7ecf\u6d4e\u5b66\u4eba\u300b\u7684\u6307\u6570\u3002\u4e9a\u6d32\u548c\u7f8e\u6d32\u7684\u57ce\u5e02\u9886\u5bfc\u4eba\u95ee\uff1a\u201c\u80fd\u4e3a\u6211\u7684\u57ce\u5e02\u505a\u8fd9\u4e2a\u5417\uff1f\u201d",
    ],
    pullquote: "\u201c\u6211\u4eec\u5efa\u7acb\u6307\u6570\u3002\u4f60\u6765\u6784\u5efa\u6392\u540d\u3002\u201d",
    photoCaption: "City Vision in Action \u821e\u53f0\uff0cSCSE 2026\uff0c\u53f0\u5317",
  },
};

/* spotlightTranslations removed in V2.1 — spotlights section cut */

/* ───── main component ───── */

function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath,
) {
  event.preventDefault();
  onNavigate(path);
}

export default function HomePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const methodology = getMethodologyData(locale);
  const editorialCopy = homeEditorialCopy[locale];
  const ui = heroCopy[locale];
  const labels = PILLAR_LABELS[locale];

  /* ── visitor counter + geography (Supabase primary, Google Sheets fallback) ── */
  const [visitors, setVisitors] = useState(12424);
  const [visitorCountries, setVisitorCountries] = useState<Array<{ country: string; pct: number }>>([]);
  useEffect(() => {
    getVisitorStats().then((stats) => {
      setVisitors(stats.count);
      setVisitorCountries(stats.countries);
    });
  }, []);

  const [pillars, setPillars] = useState<PillarAllocation[]>(
    PILLAR_ORDER.map((id) => ({
      id,
      label: labels[id],
      color: PILLAR_COLORS[id],
      value: EQUAL_WEIGHT,
    })),
  );

  const [region, setRegion] = useState<string>("All");
  const [showCountValue, setShowCountValue] = useState<number>(10);

  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    pillars.forEach((p) => { w[p.id] = p.value; });
    return w as Record<PillarId, number>;
  }, [pillars]);

  const isCustom = useMemo(() => {
    return PILLAR_ORDER.some((id) => weights[id] !== EQUAL_WEIGHT);
  }, [weights]);

  const consequences = useMemo<FiredConsequence[]>(
    () => evaluateConsequences(weights),
    [weights],
  );

  const results = useMemo(() => {
    let filtered = rankedCities;
    if (region !== "All") {
      filtered = filtered.filter((c) => c.region === region);
    }
    return filtered
      .map((city) => ({
        ...city,
        customScore: Math.round(scoreCityWithWeights(city, weights) * 10) / 10,
      }))
      .sort((a, b) => b.customScore - a.customScore);
  }, [weights, region]);

  const displayResults = results.slice(0, showCountValue);

  const handleReset = () => {
    setPillars(
      PILLAR_ORDER.map((id) => ({
        id,
        label: labels[id],
        color: PILLAR_COLORS[id],
        value: EQUAL_WEIGHT,
      })),
    );
  };

  return (
    <>
      {/* ═══════ HERO: Title left + Spider right — visible on load ═══════ */}
      {/* ═══════ 01. HERO ═══════ */}
      <header className="v3-hero">
        <div className="v3-hero-overline">SLIC V3 / LAUNCHING AT GITEX SINGAPORE 2026</div>
        <h1 className="v3-hero-title">
          {locale === "en" ? "WE KILLED\nTHE RANKING." : locale === "th" ? "เราฆ่า\nการจัดอันดับ" : "我们杀死了\n排名"}
        </h1>
        <div className="v3-hero-divider" />
        <p className="v3-hero-sub">
          {locale === "en"
            ? "For the first time, a city index admits that ranking cities by decimal points is theatre. V3 replaces rankings with tiers. Groups of cities you can actually learn from. Every number traceable to its source. No more pretending."
            : locale === "th"
              ? "เป็นครั้งแรกที่ดัชนีเมืองยอมรับว่าการจัดอันดับด้วยจุดทศนิยมเป็นเรื่องหลอกลวง V3 แทนที่อันดับด้วยระดับ กลุ่มเมืองที่คุณเรียนรู้จากกันได้จริง"
              : "城市指数第一次承认，用小数点排名城市是表演。V3 用梯队取代排名。你可以真正学习的城市群。每个数字都可追溯。"}
        </p>
        <div className="v3-hero-launch-banner">
          <div className="v3-launch-event">
            <span className="v3-launch-venue">SCSE TAIPEI 2026</span>
            <span className="v3-launch-status">V2 LAUNCHED</span>
          </div>
          <div className="v3-launch-arrow">&rarr;</div>
          <div className="v3-launch-event v3-launch-event--active">
            <span className="v3-launch-venue">GITEX SINGAPORE 2026</span>
            <span className="v3-launch-status">V3 LAUNCHES HERE</span>
          </div>
        </div>
        <div className="v3-hero-actions">
          <a className="v3-cta" href="#tiers" onClick={(e) => { e.preventDefault(); document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" }); }}>
            {locale === "en" ? "SEE WHAT REPLACED IT" : "ดูว่าอะไรมาแทน"} &darr;
          </a>
        </div>
        <div className="v3-hero-counter">
          <span className="v3-counter-num">{visitors.toLocaleString()}</span>
          <span className="v3-counter-label">{locale === "en" ? "people checked since Taipei" : "คนตรวจสอบตั้งแต่ไทเป"}</span>
        </div>
      </header>

      {/* ═══════ 02. THE STORY — V1 → V2 → V3 with photos ═══════ */}
      <section className="v3-story" id="story">
        <div className="v3-story-chapter">
          <div className="v3-story-label">V1 / THE SPREADSHEET</div>
          <h2 className="v3-story-title">{locale === "en" ? "We built a spreadsheet. Busan came out on top. We thought we were done." : "เราสร้าง spreadsheet บูซานขึ้นอันดับหนึ่ง เราคิดว่าเสร็จแล้ว"}</h2>
        </div>

        <div className="v3-story-chapter v3-story-chapter--photo">
          <img src={LAUNCH_PHOTOS.hero} alt="SCSE 2026 Taipei" loading="lazy" className="v3-story-img" />
          <div>
            <div className="v3-story-label">V2 / THE STAGE</div>
            <h2 className="v3-story-title">{locale === "en" ? "Then we launched it in Taipei. The room went quiet." : "แล้วเราเปิดตัวที่ไทเป ห้องเงียบกริบ"}</h2>
            <p className="v3-story-body">{locale === "en" ? "Smart City Summit & Expo 2026. 3,000 professionals. The Vice President of Taiwan opened it. A European mayor\u2019s alliance asked to use it instead of The Economist\u2019s index." : "Smart City Summit & Expo 2026 ผู้เชี่ยวชาญ 3,000 คน รองประธานาธิบดีไต้หวันเปิดงาน"}</p>
          </div>
        </div>

        <div className="v3-story-photos">
          {[LAUNCH_PHOTOS.stage, LAUNCH_PHOTOS.slide, LAUNCH_PHOTOS.laptop, LAUNCH_PHOTOS.networking].map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>

        <div className="v3-story-chapter v3-story-chapter--highlight">
          <div className="v3-story-label">V3 / GITEX SINGAPORE 2026</div>
          <h2 className="v3-story-title">{locale === "en" ? "We killed the ranking. Built something better." : "เราฆ่าการจัดอันดับ สร้างสิ่งที่ดีกว่า"}</h2>
          <p className="v3-story-body">{locale === "en" ? "Alpha, Beta, Gamma — groups of cities that compete, compare, and learn from each other. Not a leaderboard. A diagnostic. Every score traces back to its source. Growth momentum, tolerance, cultural diversity, overwork, suicide rates — all measured, all transparent. Click any city and the system shows you exactly how it got its number. This is what we\u2019re bringing to GITEX Singapore." : "Alpha, Beta, Gamma — กลุ่มเมืองที่แข่งขัน เปรียบเทียบ และเรียนรู้จากกัน นี่คือสิ่งที่เรานำไป GITEX Singapore"}</p>
          <blockquote className="v3-story-quote">{locale === "en" ? "\u201CThe first city index that admits ranking by decimal points is meaningless.\u201D" : "\u201Cดัชนีเมืองแรกที่ยอมรับว่าการจัดอันดับด้วยจุดทศนิยมไม่มีความหมาย\u201D"}</blockquote>
        </div>
      </section>

      {/* ═══════ 03. ALPHA TIER — The headline cities ═══════ */}
      <section className="v3-alpha" id="tiers">
        <div className="v3-alpha-header section">
          <span className="v3-tier-badge v3-tier-badge--alpha">α ALPHA</span>
          <h2 className="v3-alpha-title">{locale === "en" ? "10 cities. 4 continents. Click any to see the numbers." : "10 เมือง 4 ทวีป คลิกเมืองใดก็ได้เพื่อดูตัวเลข"}</h2>
        </div>
        <div className="v3-alpha-grid section">
          {results.slice(0, 10).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
            <button
              key={city.cityId}
              className="v3-city-card"
              onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}
            >
              <span className="v3-city-card-name">{city.displayName}</span>
              <span className="v3-city-card-country">{city.country}</span>
              <div className="v3-city-card-bars">
                {PILLAR_ORDER.map((pid) => {
                  const score = city[`${pid}Score` as keyof typeof city] as number;
                  return <div key={pid} style={{ width: `${score}%`, background: PILLAR_COLORS[pid] }} />;
                })}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ 04. BETA + GAMMA — Expandable ═══════ */}
      <section className="section v3-lower-tiers">
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--beta">β BETA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(10, 20).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="v3-lower-tier-row">
          <span className="v3-tier-badge v3-tier-badge--gamma">γ GAMMA</span>
          <div className="v3-lower-tier-cities">
            {results.slice(20, 30).sort((a, b) => a.displayName.localeCompare(b.displayName)).map((city) => (
              <button key={city.cityId} className="v3-tier-chip" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                {city.displayName} <span>{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 05. SPIDER — Now it's your turn ═══════ */}
      <section className="v3-spider-full">
        <div className="section">
          <h2 className="v3-section-title">{locale === "en" ? "NOW MAKE YOUR OWN." : locale === "th" ? "ตอนนี้สร้างของคุณเอง" : "现在自己来"}</h2>
          <p className="v3-spider-hint">{locale === "en" ? "Drag the spider. Crank growth to 100% — watch Singapore and Jakarta rise. Max viability — safe, clean cities float up. This is your ranking, not ours." : ui.allocatorHint}</p>
          <div className="v3-spider-layout">
            <div className="v3-spider-chart">
              <ZeroSumAllocator pillars={pillars} onChange={setPillars} size={380} />
              <button type="button" className="rankings-reset-btn" onClick={handleReset}>{ui.resetLabel}</button>
            </div>
            <div className="v3-spider-results">
              {consequences.length > 0 && (
                <div className="v3-tradeoffs">
                  {consequences.slice(0, 3).map((c) => (
                    <div key={c.id} className={severityClass[c.severity]}><p>{c.narrative}</p></div>
                  ))}
                </div>
              )}
              <div className="v3-spider-list">
                {displayResults.slice(0, 15).map((city, i) => (
                  <button key={city.cityId} className="v3-spider-row" onClick={() => onNavigate(`/city/${city.cityId}` as SitePath)}>
                    <span className="v3-spider-rank">{String(i + 1).padStart(2, "0")}</span>
                    <span className="v3-spider-name">{city.displayName}</span>
                    <span className="v3-spider-country">{city.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 06. CTA — Go deeper ═══════ */}
      <section className="v3-cta-section section">
        <a className="v3-cta" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
          {locale === "en" ? "READ THE METHODOLOGY" : "อ่าน METHODOLOGY"} &rarr;
        </a>
        <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
          {locale === "en" ? "ABOUT SLIC" : "เกี่ยวกับ SLIC"}
        </a>
        <a className="v3-cta-secondary" href="/history" onClick={(e) => { e.preventDefault(); onNavigate("/history"); }}>
          {locale === "en" ? "THE JOURNEY" : "เบื้องหลัง"}
        </a>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
