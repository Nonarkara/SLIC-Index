import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";
import { getEssayBodyCopy } from "./essayBodyCopy";

// ── Photo metadata ──────────────────────────────────────────────────────────
// Captions are locale-keyed so every reader encounters the editorial frame
// in their own language, even though the essay body is English.

interface EssayPhoto {
  src: string;
  alt: string;
  captions: Record<Locale, string>;
  credit?: string;
}

const PHOTOS: Record<string, EssayPhoto> = {
  hero: {
    src: "/photos/city-taipei.jpg",
    alt: "Taipei cityscape at dusk",
    captions: {
      en: "Taipei — ranked #1 by SLIC when equal weight is applied across all five pillars. It does not rank in any established livability index.",
      th: "ไทเป — จัดอันดับ #1 โดย SLIC เมื่อให้น้ำหนักเท่ากันทุกเสาหลัก ไม่ปรากฏในดัชนีชีวาภาพเมืองที่มีชื่อเสียงใดเลย",
      zh: "台北——全五柱等权时SLIC排名第一，不出现在任何主流宜居指数中。",
      ko: "타이베이 — 다섯 기둥 모두에 동등한 가중치를 적용했을 때 SLIC 1위. 기존의 어떤 생활가능성 지수에도 등장하지 않는 도시입니다.",
      ja: "台北——全5柱に等重みをかけた場合、SLICで1位。既存の生活持続性指数には登場しない都市です。",
    },
    credit: "SLIC Index archive",
  },
  melbourne: {
    src: "/photos/report-city-night.jpg",
    alt: "City at night — urban architecture",
    captions: {
      en: "A city that ranks well and a city where people can afford to live are not always the same city.",
      th: "เมืองที่ได้อันดับสูงกับเมืองที่ผู้คนสามารถอยู่ได้จริง ๆ ไม่ใช่เมืองเดียวกันเสมอไป",
      zh: "排名靠前的城市，和人们真正住得起的城市，并不总是同一个城市。",
      ko: "높은 순위의 도시와 사람들이 실제로 감당할 수 있는 도시는 항상 같은 도시가 아닙니다.",
      ja: "ランキング上位の都市と、人々が実際に住める都市は、必ずしも同じではありません。",
    },
    credit: "SLIC Index archive",
  },
  singapore: {
    src: "/launch-photos/gitex-singapore-2026-02.jpg",
    alt: "Singapore — GITEX Asia 2026",
    captions: {
      en: "Singapore at GITEX Asia 2026. The city ranks exceptionally by conventional measures. The SLIC civic freedom composite gives it 39 out of 100.",
      th: "สิงคโปร์ที่งาน GITEX Asia 2026 เมืองนี้ได้คะแนนดีเยี่ยมในการวัดแบบปกติ แต่ดัชนีเสรีภาพพลเมืองของ SLIC ให้ 39 คะแนนจาก 100",
      zh: "新加坡在GITEX亚洲2026上。按常规标准，这是一座卓越的城市。SLIC公民自由综合评分为39/100。",
      ko: "GITEX 아시아 2026에서의 싱가포르. 이 도시는 일반적인 기준으로는 탁월합니다. SLIC 시민 자유 복합 지수는 100점 만점에 39점입니다.",
      ja: "GITEXアジア2026のシンガポール。一般的な指標では優れた都市です。SLICの市民の自由複合スコアは100点中39点です。",
    },
    credit: "Non Arkara / SLIC Index",
  },
  governance: {
    src: "/photos/profile-roundtable.jpg",
    alt: "City officials in roundtable discussion",
    captions: {
      en: "Citizen-centric governance is not a technology choice. It is a decision about whose problems the city is trying to solve.",
      th: "การปกครองที่ยึดพลเมืองเป็นศูนย์กลางไม่ใช่การเลือกทางเทคโนโลยี แต่เป็นการตัดสินใจว่าเมืองพยายามแก้ปัญหาของใคร",
      zh: "以市民为中心的治理不是一种技术选择。它是一个决策——城市正在努力解决谁的问题。",
      ko: "시민 중심 거버넌스는 기술적 선택이 아닙니다. 그것은 도시가 누구의 문제를 해결하려 하는지에 대한 결정입니다.",
      ja: "市民中心のガバナンスは技術的な選択ではありません。都市が誰の問題を解決しようとしているかについての決定です。",
    },
    credit: "SLIC Index archive",
  },
  transit: {
    src: "/photos/report-city-transit.jpg",
    alt: "Urban transit infrastructure",
    captions: {
      en: "Transit quality is one of five pillars in the SLIC framework — scored on reach, frequency, and commute burden, not on the age of the rolling stock.",
      th: "คุณภาพระบบขนส่งสาธารณะเป็นหนึ่งในห้าเสาหลักของ SLIC วัดจากการครอบคลุม ความถี่ และภาระการเดินทาง ไม่ใช่อายุของรถ",
      zh: "交通质量是SLIC框架五个支柱之一——按覆盖范围、频率和通勤负担评分，而非车辆年龄。",
      ko: "대중교통 품질은 SLIC 프레임워크의 다섯 기둥 중 하나입니다 — 차량 연식이 아닌 노선 범위, 빈도, 통근 부담으로 측정합니다.",
      ja: "交通の質はSLICフレームワークの5つの柱の1つです——車両の年齢ではなく、路線範囲、頻度、通勤負担で評価されます。",
    },
    credit: "SLIC Index archive",
  },
  london: {
    src: "/photos/city-london.jpg",
    alt: "London streetscape",
    captions: {
      en: "London — £270–340 per square foot at the £350,000 price point. Ranked among the world's most livable cities. Ranked among the world's least affordable.",
      th: "ลอนดอน — ราคา 270–340 ปอนด์ต่อตารางฟุต ณ ราคา 350,000 ปอนด์ ถูกจัดให้เป็นหนึ่งในเมืองที่น่าอยู่ที่สุดในโลก และยังเป็นหนึ่งในเมืองที่ค่าครองชีพสูงที่สุดด้วย",
      zh: "伦敦——在35万英镑价格段，每平方英尺270至340英镑。被评为全球最宜居城市之一，也是全球最难负担的城市之一。",
      ko: "런던 — 35만 파운드 가격대에서 평방 피트당 270~340파운드. 세계에서 가장 생활가능한 도시 중 하나로 선정됩니다. 세계에서 가장 저렴하지 않은 도시 중 하나이기도 합니다.",
      ja: "ロンドン——35万ポンドの価格帯で1平方フィートあたり270〜340ポンド。世界で最も住みやすい都市の一つとしてランク付けされています。世界で最も手頃でない都市の一つでもあります。",
    },
    credit: "SLIC Index archive",
  },
};

// ── Academic references ─────────────────────────────────────────────────────
const REFS = [
  { id: 1, text: "Economist Intelligence Unit (2024). Global Liveability Index 2024. Economist Intelligence Unit.", url: "https://www.eiu.com/n/campaigns/global-liveability-index-2024/" },
  { id: 2, text: "Porter, T.M. (1995). Trust in Numbers: The Pursuit of Objectivity in Science and Public Life. Princeton University Press." },
  { id: 3, text: "Espeland, W.N. & Stevens, M.L. (1998). Commensuration as a Social Process. Annual Review of Sociology, 24, 313–343." },
  { id: 4, text: "Demographia (2024). 20th Annual Demographia International Housing Affordability Survey. demographia.com." },
  { id: 5, text: "Holt-Lunstad, J., Smith, T.B., Baker, M., Harris, T. & Stephenson, D. (2015). Loneliness and Social Isolation as Risk Factors for Mortality: A Meta-Analytic Review. Perspectives on Psychological Science, 10(2), 227–237." },
  { id: 6, text: "Putnam, R.D. (2000). Bowling Alone: The Collapse and Revival of American Community. Simon & Schuster." },
  { id: 7, text: "World Health Organization (2022). World Mental Health Report: Transforming Mental Health for All. WHO." },
  { id: 8, text: "Kahneman, D. & Deaton, A. (2010). High income improves evaluation of life but not emotional well-being. Proceedings of the National Academy of Sciences, 107(38), 16489–16493." },
  { id: 9, text: "Sen, A. (1999). Development as Freedom. Oxford University Press." },
  { id: 10, text: "Stiglitz, J., Sen, A. & Fitoussi, J.P. (2009). Report by the Commission on the Measurement of Economic Performance and Social Progress. INSEE." },
  { id: 11, text: "Jacobs, J. (1961). The Death and Life of Great American Cities. Random House." },
  { id: 12, text: "Lefebvre, H. (1968). Le Droit à la Ville. Anthropos. [English: The Right to the City, Blackwell, 1996.]" },
  { id: 13, text: "Harvey, D. (2008). The Right to the City. New Left Review, 53, 23–40." },
  { id: 14, text: "Townsend, A.M. (2013). Smart Cities: Big Data, Civic Hackers, and the Quest for a New Utopia. W.W. Norton." },
  { id: 15, text: "Meijer, A. & Bolívar, M.P.R. (2016). Governing the Smart City: A Review of the Literature on Smart Urban Governance. International Review of Administrative Sciences, 82(2), 392–408." },
  { id: 16, text: "Human Rights Measurement Initiative (2024). HRMI Rights Tracker. humanrightsmeasurement.org." },
  { id: 17, text: "Freedom House (2024). Freedom in the World 2024. freedomhouse.org." },
  { id: 18, text: "V-Dem Institute (2024). Democracy Report 2024: Democracy Winning and Losing at the Ballot. University of Gothenburg." },
  { id: 19, text: "Peen, J., Schoevers, R.A., Beekman, A.T. & Dekker, J. (2010). The current status of urban-rural differences in psychiatric disorders. Acta Psychiatrica Scandinavica, 121(2), 84–93." },
  { id: 20, text: "UN-Habitat (2022). World Cities Report 2022: Envisaging the Future of Cities. United Nations Human Settlements Programme." },
];

// ── Locale-aware UI strings ─────────────────────────────────────────────────

interface EssayStrings {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: { I: string; II: string; III: string; IV: string; V: string };
  pull1: string;
  pull2: string;
  pull3: string;
  pull4: string;
  refsHead: string;
  furtherHead: string;
  abstractLabel: string;
  langNote: string;
}

const STRINGS: Record<Locale, EssayStrings> = {
  en: {
    eyebrow: "SLIC INDEX — LONG READ",
    title: "The City Is Not a Spreadsheet",
    subtitle: "On the politics of urban measurement, the silence beneath prestige, and what a better instrument might look like",
    sections: {
      I:   "I. The Archaeology of a Score",
      II:  "II. The Silence Beneath the Score",
      III: "III. What a Different Instrument Would Look Like",
      IV:  "IV. The Four Principles, Applied Imperfectly",
      V:   "V. What This Instrument Cannot Do",
    },
    pull1: "The ranking rewards the city's ability to represent itself well to outside judges. The judges are not residents. The documentation is not cheap to produce.",
    pull2: "A ranking system which cannot see Vienna's suicide rate while awarding it first place is measuring something other than what it claims to measure.",
    pull3: "Kaohsiung — a port city in southern Taiwan — ranks first when equal weight is applied across all five pillars. It does not appear on any established liveability list.",
    pull4: "I am still, genuinely, not certain I have got it right. But I am certain that the alternative is a choice with consequences, and not a neutral one.",
    refsHead: "References",
    furtherHead: "RELATED WRITING",
    abstractLabel: "",
    langNote: "",
  },
  th: {
    eyebrow: "SLIC INDEX — บทความเชิงลึก",
    title: "เมืองไม่ใช่สเปรดชีต",
    subtitle: "ว่าด้วยการเมืองของการวัดค่าเมือง ความเงียบใต้ภาพลักษณ์ และเครื่องมือที่ดีกว่าควรมีหน้าตาอย่างไร",
    sections: {
      I:   "I. โบราณคดีแห่งคะแนน",
      II:  "II. ความเงียบใต้คะแนน",
      III: "III. เครื่องมือที่แตกต่างจะมีหน้าตาอย่างไร",
      IV:  "IV. หลักการสี่ข้อ ประยุกต์ใช้อย่างไม่สมบูรณ์",
      V:   "V. สิ่งที่เครื่องมือนี้ทำไม่ได้",
    },
    pull1: "การจัดอันดับให้รางวัลกับความสามารถของเมืองในการแสดงตัวเองต่อผู้ตัดสินจากภายนอก ผู้ตัดสินไม่ใช่ผู้อยู่อาศัย การจัดทำเอกสารไม่ใช่เรื่องถูก",
    pull2: "ระบบจัดอันดับที่ไม่สามารถมองเห็นอัตราการฆ่าตัวตายของเวียนนาในขณะที่มอบอันดับหนึ่งให้กับเมืองนั้น กำลังวัดอะไรบางอย่างที่ต่างจากที่อ้างว่าวัด",
    pull3: "เกาสง — เมืองท่าทางตอนใต้ของไต้หวัน — อยู่ในอันดับต้นเมื่อให้น้ำหนักเท่ากันทุกเสาหลัก ไม่ปรากฏในรายการที่มีชื่อเสียงใดเลย",
    pull4: "ผมยังไม่แน่ใจอย่างจริงจังว่าทำถูกต้องหรือเปล่า แต่แน่ใจว่าทางเลือกอื่นเป็นตัวเลือกที่มีผลตามมา และไม่ใช่การตัดสินใจที่เป็นกลาง",
    refsHead: "อ้างอิง",
    furtherHead: "บทความที่เกี่ยวข้อง",
    abstractLabel: "บทคัดย่อ",
    langNote: "เนื้อหาหลักของบทความนี้เขียนเป็นภาษาอังกฤษ บทคัดย่อด้านบนให้ไว้เป็นภาษาไทย",
  },
  zh: {
    eyebrow: "SLIC INDEX — 深度长文",
    title: "城市不是电子表格",
    subtitle: "论城市测量的政治，声望背后的沉默，以及一个更好的衡量工具应该是什么样的",
    sections: {
      I:   "I. 一个分数的考古学",
      II:  "II. 分数背后的沉默",
      III: "III. 一个不同的工具会是什么样",
      IV:  "IV. 四条原则，不完美地应用",
      V:   "V. 这个工具做不到什么",
    },
    pull1: "排名奖励的是城市向外部评审人员展示自身的能力。评审人员不是居民，制作文档的费用也不便宜。",
    pull2: "一个无法看到维也纳自杀率却将其评为第一名的排名系统，测量的是某种与其所声称的不同的东西。",
    pull3: "高雄——台湾南部的港口城市——在全五柱等权时排名靠前，不出现在任何既有宜居榜单中。",
    pull4: "我仍然真诚地不确定自己是否做对了。但我确信，另一种选择是有代价的，而不是中立的。",
    refsHead: "参考文献",
    furtherHead: "相关文章",
    abstractLabel: "摘要",
    langNote: "本文正文以英语撰写。上方摘要以中文提供。",
  },
  ko: {
    eyebrow: "SLIC INDEX — 심층 에세이",
    title: "도시는 스프레드시트가 아닙니다",
    subtitle: "도시 측정의 정치, 명성 이면의 침묵, 그리고 더 나은 도구가 어떤 모습일지에 대하여",
    sections: {
      I:   "I. 점수의 고고학",
      II:  "II. 점수 이면의 침묵",
      III: "III. 다른 도구는 어떤 모습일까",
      IV:  "IV. 불완전하게 적용된 네 가지 원칙",
      V:   "V. 이 도구가 할 수 없는 것",
    },
    pull1: "순위는 도시가 외부 심사위원들에게 자신을 잘 표현하는 능력에 보상을 줍니다. 심사위원들은 거주자가 아닙니다. 문서 작성은 비용이 적지 않습니다.",
    pull2: "비엔나에 1위를 수여하면서 그 자살률을 보지 못하는 순위 체계는 자신이 주장하는 것과 다른 무언가를 측정하고 있습니다.",
    pull3: "가오슝 — 대만 남부의 항구 도시 — 은 다섯 기둥 모두에 동등한 가중치를 적용했을 때 최상위에 위치합니다. 기존의 어떤 생활가능성 목록에도 등장하지 않습니다.",
    pull4: "저는 여전히, 진심으로, 제가 옳게 이해했는지 확신하지 못합니다. 하지만 그 대안이 결과를 가져오는 선택이며, 중립적이지 않다는 것은 확신합니다.",
    refsHead: "참고문헌",
    furtherHead: "관련 글",
    abstractLabel: "요약",
    langNote: "이 에세이 본문은 영어로 작성되었습니다. 위의 요약은 한국어로 제공됩니다.",
  },
  ja: {
    eyebrow: "SLIC INDEX — 深読み",
    title: "都市はスプレッドシートではない",
    subtitle: "都市測定の政治、名声の背後にある沈黙、そしてより良い指標が何を意味するかについて",
    sections: {
      I:   "I. スコアの考古学",
      II:  "II. スコアの背後にある沈黙",
      III: "III. 異なる指標はどのようなものか",
      IV:  "IV. 四つの原則、不完全に適用",
      V:   "V. この指標にできないこと",
    },
    pull1: "ランキングは、都市が外部の審査員に対して自らをうまくアピールする能力を評価します。審査員は住民ではありません。書類作成は安くありません。",
    pull2: "ウィーンに1位を授与しながらその自殺率を見ることができないランキングシステムは、主張とは異なる何かを測定しています。",
    pull3: "高雄——台湾南部の港湾都市——は、全5柱に等重みをかけると上位に位置します。確立された生活持続性リストには登場しません。",
    pull4: "私はまだ、本当に、正しく理解しているか確信が持てません。しかし、代替案は結果をもたらす選択であり、中立的なものではないと確信しています。",
    refsHead: "参考文献",
    furtherHead: "関連記事",
    abstractLabel: "要約",
    langNote: "このエッセイ本文は英語で書かれています。上記の要約は日本語で提供されています。",
  },
};

// ── Native-language abstracts ───────────────────────────────────────────────
// For non-English locales: a 4-paragraph distillation of the essay's argument
// in the reader's own language. The essay body remains English — this is an
// editorial decision, not a limitation. The abstract respects the reader;
// the full text invites them in.

const ABSTRACTS: Partial<Record<Locale, string[]>> = {
  th: [
    "เรื่องราวเริ่มต้นในเดือนพฤศจิกายน 2568 ที่นครศรีธรรมราช คำเตือนอุทกภัยถูกส่งออกไป 10 ชั่วโมงล่วงหน้า เจ้าหน้าที่เปิดใช้สถานีสูบน้ำที่เชื่อมกล้อง CCTV กว่า 70 จุด นายกเทศมนตรียืนกลางน้ำท่วมกำกับดูแลสถานการณ์ด้วยตัวเอง และประชาชน 40,000 คนได้รับข้อมูลการอพยพภายในไม่กี่ชั่วโมง เหตุการณ์นี้ไม่ปรากฏในดัชนีเมืองใดทั้งสิ้น EIU Global Liveability Index เก็บค่า PDF ฉบับละ 935 ดอลลาร์ และใช้ระเบียบวิธีที่ไม่เคยเปิดเผยอย่างสมบูรณ์ตั้งแต่ปี 2533 เป็นต้นมา",
    "ดัชนีเมืองส่วนใหญ่ไม่ได้วัดสิ่งที่ผู้อยู่อาศัยสัมผัสอยู่จริง ผมเล่าถึงเคนนี่ ผู้บริหารระดับสูงในสิงคโปร์ เมืองของเขาได้คะแนนสูงในทุกดัชนี แต่เขาเป็นเกย์ และเชื่อว่าเส้นทางอาชีพของตัวเองถูกจัดการอย่างเงียบ ๆ มาตลอด แล้วยังมีเฉิน ผู้หญิงจากเซินเจิ้นที่อาศัยในบรัสเซลส์มาแปดปี เธอพูดภาษาฝรั่งเศสได้ดี ลูก ๆ เข้าสังคมได้ดี แต่ไม่มีเพื่อนชาวเบลเยียมแม้แต่คนเดียว ดัชนีจับเรื่องราวเหล่านี้ไม่ได้",
    "SLIC — Smart and Liveable Cities Index — คือความพยายามสร้างเครื่องมือที่ใกล้เคียงกับแนวคิดของอมาร์เตีย เซน ผมไม่ใช่นักเศรษฐศาสตร์ ไม่ใช่รัฐบาล และไม่ใช่สถาบันวิจัยที่มีงบประมาณ ผมเป็นแค่คนหนึ่งที่มีแล็ปท็อป เผยแพร่ระเบียบวิธีทั้งหมดต่อสาธารณะ ให้ข้อมูลทั้งหมดฟรี และยังคงตั้งคำถามอยู่ว่าทำไมเมลเบิร์นถึงถูกเรียกว่าเมืองที่น่าอยู่ที่สุดสำหรับครอบครัวที่มีรายได้ระดับกลาง",
    "ผมอยากพูดอย่างตรงไปตรงมาเกี่ยวกับสิ่งที่ SLIC ทำไม่ได้ ผมวัดน้ำหนักของสิ่งที่เคนนี่รู้สึกไม่ได้ และวัดสิ่งที่เฉินสร้างไม่ได้ในแปดปีที่บรัสเซลส์ไม่ได้ แต่ผมสามารถตั้งชื่อให้กับการขาดหายเหล่านั้นได้ คะแนนเสรีภาพพลเมืองของสิงคโปร์ที่ 39 คะแนนจาก 100 หมายความว่า อย่างน้อยดัชนีนี้รู้ว่าเคนนี่มีตัวตนอยู่ ผมยังพยายามอยู่เพื่อก้าวไปไกลกว่านั้น",
  ],
  zh: [
    "故事从2025年11月的那空是贪玛叻开始。洪水预警提前10小时发出，官员启动了70处CCTV联动泵站，市长亲自站在洪水中指挥，4万名居民在数小时内收到了疏散信息。这一切不会出现在任何城市排名中。EIU全球宜居指数一份PDF收费935美元，自1990年起使用从未完整公开的方法论对城市进行评估。",
    "大多数城市排名无法测量居民真实的生活体验。肯尼是新加坡的高管，他的城市在每一项指数上都表现优异。但他是同性恋，他相信自己的职业生涯一直在被悄然管理。还有陈，来自深圳、在布鲁塞尔生活了八年的女人。她法语说得很好，孩子融入当地，却一个比利时朋友都没有。城市排名无法捕捉他们的故事。",
    "SLIC——智慧宜居城市指数——是一种尝试，旨在构建更接近阿马蒂亚·森所说的能力方法的东西。我不是经济学家，不是政府，也不是有预算的研究机构。我只是一个有笔记本电脑的人，完整公开方法论，免费提供所有数据，并持续质疑墨尔本是否真的是中等收入家庭最宜居的城市。",
    "我也要诚实说明SLIC做不到什么。我无法测量肯尼所感受的那种具体重量，也无法测量陈在布鲁塞尔八年里未能建立的东西。但我可以为这些缺失命名。新加坡的公民自由得分是100分中的39分——这意味着，至少这个指数知道肯尼的存在。我仍在努力做到更多。",
  ],
  ko: [
    "이야기는 2025년 11월 나콘시탐마랏에서 시작됩니다. 홍수 경보가 10시간 전에 발령되었고, 시 공무원들은 CCTV와 연동된 70개 펌프장을 가동했으며, 시장이 직접 침수 지역에 서서 상황을 지휘했습니다. 4만 명의 주민이 몇 시간 안에 대피 정보를 받았습니다. 이 사건은 어떤 도시 순위에도 등장하지 않습니다. EIU 글로벌 생활가능성 지수는 PDF 한 부에 935달러를 청구하며, 1990년부터 공개된 적 없는 방법론으로 도시를 평가해 왔습니다.",
    "도시 순위 체계는 거주자가 실제로 경험하는 것을 측정하지 않습니다. 케니는 싱가포르의 고위 임원입니다. 그의 도시는 모든 지수에서 탁월한 점수를 받습니다. 하지만 그는 동성애자이며, 자신의 경력이 조용히 관리되어 왔다고 믿습니다. 첸은 브뤼셀에 8년째 거주하는 선전 출신 여성입니다. 프랑스어도 잘 하고, 아이들도 현지에 잘 통합되어 있지만, 단 한 명의 벨기에 친구도 없습니다. 도시 순위는 그들의 이야기를 담아내지 못합니다.",
    "SLIC — 스마트·생활친화 도시 지수 — 는 아마르티아 센의 역량 접근법에 더 가까운 것을 구축하려는 시도입니다. 저는 경제학자도, 정부도, 예산이 있는 연구 기관도 아닙니다. 방법론을 전부 공개하고, 모든 데이터를 무료로 제공하며, 멜버른이 중위 소득 가족에게 가장 살기 좋은 도시라는 생각에 지속적으로 이의를 제기하는 한 사람입니다.",
    "SLIC가 할 수 없는 것에 대해서도 솔직하게 말씀드리겠습니다. 케니가 경험한 구체적인 무게, 첸이 8년 동안 쌓지 못한 것을 측정할 수 없습니다. 하지만 이러한 부재를 명명할 수는 있습니다. 싱가포르의 시민 자유 점수가 100점 만점에 39점이라는 사실은, 적어도 이 지수가 케니의 존재를 인식하고 있음을 의미합니다. 그 이상이 되기 위해 아직도 노력 중입니다.",
  ],
  ja: [
    "物語は2025年11月のナコンシータンマラートから始まります。洪水警報が10時間前に発令され、市職員は70台のCCTV連動ポンプ施設を稼働させ、市長は自ら浸水エリアに立って指揮を執りました。4万人の住民が数時間以内に避難情報を受け取りました。この出来事は、いかなる都市ランキングにも登場しません。EIUグローバル居住適性指数はPDF1部に935ドルを請求し、1990年から非公開の方法論で都市を評価し続けています。",
    "都市ランキングは、住民が実際に経験することを測定しません。ケニーはシンガポールの上級管理職です。彼の都市はあらゆる指数で優れた評価を受けています。しかし彼はゲイであり、自分のキャリアが静かに管理されてきたと信じています。陳は深センからブリュッセルに移住し、8年間暮らしている女性です。フランス語も堪能で、子供たちも地域に溶け込んでいますが、ベルギー人の友人は一人もいません。都市ランキングは彼らの経験を捉えることができません。",
    "SLIC（スマート・アンド・リバブル・シティズ・インデックス）は、アマルティア・センのケイパビリティアプローチに近いものを構築しようとする試みです。私は経済学者でも、政府でも、予算を持つ研究機関でもありません。方法論を完全に公開し、すべてのデータを無料で提供し、メルボルンが中位所得層の家族にとって世界一住みやすい都市だという考えに継続的に異議を唱える一人の人間です。",
    "SLICができないことについても率直に述べます。ケニーが経験した具体的な重さや、陳が8年間で築けなかったものを測定することはできません。しかし、そのような欠如に名前をつけることはできます。シンガポールの市民の自由スコアが100点中39点という事実は、少なくともこの指数がケニーの存在を認識していることを意味します。それ以上を目指して、今もまだ取り組んでいます。",
  ],
};

// ── Sub-components ──────────────────────────────────────────────────────────

function Cite({ ids }: { ids: number[] }) {
  return (
    <sup className="essay-cite">
      [{ids.join(", ")}]
    </sup>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return <blockquote className="essay-pull">{children}</blockquote>;
}

function Photo({ photo, locale }: { photo: EssayPhoto; locale: Locale }) {
  return (
    <figure className="essay-photo">
      <img src={photo.src} alt={photo.alt} loading="lazy" />
      <figcaption>
        <span className="essay-photo-caption">{photo.captions[locale]}</span>
        {photo.credit && <span className="essay-photo-credit">{photo.credit}</span>}
      </figcaption>
    </figure>
  );
}

function SectionHead({ title }: { title: string }) {
  // Title already contains the roman numeral — render as split for styling
  const dot = title.indexOf(".");
  if (dot === -1) return <div className="essay-section-head"><h2 className="essay-section-title">{title}</h2></div>;
  const number = title.slice(0, dot + 1);
  const label = title.slice(dot + 1).trim();
  return (
    <div className="essay-section-head">
      <span className="essay-section-number">{number}</span>
      <h2 className="essay-section-title">{label}</h2>
    </div>
  );
}

// ── Page component ──────────────────────────────────────────────────────────

export default function EssayPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const ui = STRINGS[locale];
  const abstract = ABSTRACTS[locale];
  const p = getEssayBodyCopy(locale, Cite);

  return (
    <div className="essay-page">

      {/* ── Hero ── */}
      <header className="essay-hero">
        <div className="essay-hero-image-wrap">
          <img
            src={PHOTOS.hero.src}
            alt={PHOTOS.hero.alt}
            className="essay-hero-image"
          />
          <div className="essay-hero-overlay" />
        </div>
        <div className="essay-hero-text">
          <p className="essay-eyebrow">{ui.eyebrow}</p>
          <h1 className="essay-title">{ui.title}</h1>
          <p className="essay-subtitle">{ui.subtitle}</p>
          <p className="essay-byline">Non Arkara &nbsp;·&nbsp; 2026</p>
        </div>
      </header>

      {/* ── Body ── */}
      <article className="essay-body">

        {/* Abstract for non-English readers ───────────────────────────────
            Four paragraphs in the reader's language summarise the essay's
            argument. The full body remains in English below. This is an
            editorial decision: the essay is personal journalism written in
            English; a literal machine translation would diminish it. */}
        {abstract && abstract.length > 0 && (
          <div className="essay-abstract">
            <p className="essay-abstract-label">{ui.abstractLabel}</p>
            {abstract.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <p className="essay-lang-note">{ui.langNote}</p>
          </div>
        )}

        {/* Opening */}
        <div className="essay-prose">
          {p.p1}
          {p.p2}
          {p.p3}
          {p.p4}
        </div>

        <Photo photo={PHOTOS.melbourne} locale={locale} />

        {/* Section I */}
        <SectionHead title={ui.sections.I} />
        <div className="essay-prose">
          {p.p5}
          {p.p6}
          {p.p7}

          <Pull>{ui.pull1}</Pull>

          {p.p8}
          {p.p9}
        </div>

        {/* Section II */}
        <SectionHead title={ui.sections.II} />
        <div className="essay-prose">
          {p.p10}
          {p.p11}
          {p.p12}
        </div>

        <Photo photo={PHOTOS.singapore} locale={locale} />

        <div className="essay-prose">
          {p.p13}
          {p.p14}
          {p.p15}
          {p.p16}

          <Pull>{ui.pull2}</Pull>

          {p.p17}
        </div>

        {/* Section III */}
        <SectionHead title={ui.sections.III} />

        <Photo photo={PHOTOS.governance} locale={locale} />

        <div className="essay-prose">
          {p.p18}
          {p.p19}
          {p.p20}
          {p.p21}
          {p.p22}

          <Pull>{ui.pull3}</Pull>

          {p.p23}
          {p.p24}
        </div>

        <Photo photo={PHOTOS.transit} locale={locale} />

        {/* Section IV */}
        <SectionHead title={ui.sections.IV} />
        <div className="essay-prose">
          {p.p25}
          {p.p26}
          {p.p27}
          {p.p28}
          {p.p29}
        </div>

        {/* Section V */}
        <SectionHead title={ui.sections.V} />

        <Photo photo={PHOTOS.london} locale={locale} />

        <div className="essay-prose">
          {p.p30}
          {p.p31}
          {p.p32}
          {p.p33}
          {p.p34}
          {p.p35}
          {p.p36}
          {p.p37}

          <Pull>{ui.pull4}</Pull>

          {p.p38}
          {p.p39}
          {p.p40}
        </div>

        {/* References */}
        <section className="essay-references">
          <h3 className="essay-references-head">{ui.refsHead}</h3>
          <ol className="essay-references-list">
            {REFS.map((ref) => (
              <li key={ref.id} id={`ref-${ref.id}`} className="essay-reference-item">
                <span className="essay-reference-number">{ref.id}.</span>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="essay-reference-text">
                    {ref.text}
                  </a>
                ) : (
                  <span className="essay-reference-text">{ref.text}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Medium links */}
        <section className="essay-further">
          <p className="essay-further-head">{ui.furtherHead}</p>
          <div className="essay-further-links">
            <a
              href="https://medium.com/design-bootcamp/your-city-won-most-livable-your-therapist-disagrees-f2f782859c8e"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium — Design Bootcamp</span>
              <span className="essay-further-title">Your City Won 'Most Livable.' Your Therapist Disagrees.</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/every-city-ranking-is-a-lie-heres-ours-80f95411731a"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Every City Ranking is a Lie. Here's Ours.</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/smart-and-livable-cities-manifesto-slic-manifesto-249074cdb122"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Smart and Livable Cities Manifesto</span>
            </a>
            <a
              href="https://nonsmartcity.medium.com/citizen-centric-smart-city-an-ultimate-handbook-1c07f1b7256a"
              target="_blank"
              rel="noopener noreferrer"
              className="essay-further-item"
            >
              <span className="essay-further-label">Medium</span>
              <span className="essay-further-title">Citizen-Centric Smart City: An Ultimate Handbook</span>
            </a>
          </div>
        </section>

      </article>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </div>
  );
}
