import type { Locale } from "./types";

interface CityBenchmark {
  id: string;
  label: string;
  city: string;
  value: string;
  note: string;
  source: string;
}

export const cityBenchmarks: Record<Locale, CityBenchmark[]> = {
  en: [
    {
      id: "bangkok-visitors",
      label: "Most visited city in 2025",
      city: "Bangkok",
      value: "30.3M arrivals",
      note:
        "Visitor pull matters because it captures real global demand, but SLIC still balances it against crowding, cost, safety, and local quality of life.",
      source: "Euromonitor 2025 city destinations reporting",
    },
    {
      id: "istanbul-visitors",
      label: "Global visitor benchmark",
      city: "Istanbul",
      value: "19.7M arrivals",
      note:
        "Istanbul belongs in the comparison field because tourism demand, history, and urban gravity are real signals, even if affordability and daily friction still have to be judged separately.",
      source: "Euromonitor 2025 city destinations reporting",
    },
    {
      id: "taipei-strength",
      label: "Why Taipei scores highly",
      city: "Taipei",
      value: "Safety 93 / Community 97",
      note:
        "Taipei scores because transit, healthcare affordability, public order, and daily convenience stay strong without draining all the life out of the city.",
      source: "SLIC preview model, March 2026",
    },
  ],
  th: [
    {
      id: "bangkok-visitors",
      label: "เมืองที่มีผู้มาเยือนมากที่สุดในปี 2025",
      city: "กรุงเทพฯ",
      value: "30.3 ล้านคน",
      note:
        "จำนวนผู้มาเยือนเป็นสัญญาณของแรงดึงดูดจริง แต่ SLIC ยังถ่วงดุลด้วยความแออัด ค่าครองชีพ ความปลอดภัย และคุณภาพชีวิตของคนเมือง",
      source: "รายงานเมืองปลายทางของ Euromonitor ปี 2025",
    },
    {
      id: "istanbul-visitors",
      label: "เมืองเปรียบเทียบด้านแรงดึงดูด",
      city: "อิสตันบูล",
      value: "19.7 ล้านคน",
      note:
        "อิสตันบูลควรอยู่ในสนามเปรียบเทียบ เพราะแรงดึงดูดทางประวัติศาสตร์ วัฒนธรรม และการท่องเที่ยวมีอยู่จริง แต่ยังต้องถูกตัดสินด้วยค่าครองชีพและคุณภาพชีวิตประจำวันเช่นกัน",
      source: "รายงานเมืองปลายทางของ Euromonitor ปี 2025",
    },
    {
      id: "taipei-strength",
      label: "เหตุผลที่ไทเปคะแนนสูง",
      city: "ไทเป",
      value: "ความปลอดภัย 93 / ชุมชน 97",
      note:
        "ไทเปทำได้ดีเพราะระบบขนส่ง การเข้าถึงสุขภาพ ต้นทุนที่ยังคุมได้ และความสะดวกในชีวิตประจำวันยังอยู่ร่วมกับบรรยากาศเมืองที่น่าอยู่",
      source: "โมเดลตัวอย่าง SLIC, มีนาคม 2026",
    },
  ],
  zh: [
    {
      id: "bangkok-visitors",
      label: "2025年全球到访量最高城市",
      city: "曼谷",
      value: "3030万到访",
      note:
        "到访量能反映真实吸引力，但 SLIC 仍会用拥挤度、生活成本、安全和本地生活质量来对冲旅游热度。",
      source: "Euromonitor 2025 城市目的地报道",
    },
    {
      id: "istanbul-visitors",
      label: "全球旅游吸引力参照",
      city: "伊斯坦布尔",
      value: "1970万到访",
      note:
        "伊斯坦布尔应当进入比较范围，因为历史、文化和旅游引力都是真实信号，但它仍然要接受 affordability 与日常摩擦的同样检验。",
      source: "Euromonitor 2025 城市目的地报道",
    },
    {
      id: "taipei-strength",
      label: "台北为什么得分高",
      city: "台北",
      value: "安全 93 / 社区 97",
      note:
        "台北得分高，是因为交通、医疗可负担性、日常秩序与生活便利度都很强，同时城市并没有变得空洞乏味。",
      source: "SLIC 预览模型，2026年3月",
    },
  ],
};
