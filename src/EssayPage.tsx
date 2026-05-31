import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

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
      ja: "台北——全5柱に等重みをかけた場合、SLICで1位。既存の宜居性指数には登場しない都市です。",
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
    pull3: "高雄——台湾南部の港湾都市——は、全5柱に等重みをかけると上位に位置します。確立された宜居性リストには登場しません。",
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
          <p>
            In November 2025, a flood warning reached Nakhon Si Thammarat with a ten-hour lead time. What
            happened next would not make any major city ranking. It will not appear in the EIU Global
            Liveability Index, which charges $935 for a single PDF and has been measuring urban quality
            since 1990 with a methodology it has never fully disclosed.<Cite ids={[1]} /> It will not appear in
            the Mercer Quality of Living Survey, which was designed in the 1980s to calculate hardship
            allowances for multinational executives transferred between cities. And it will certainly not
            appear in the IMD Smart City Index, which surveys 120 residents per city and reports the
            results to four decimal places.
          </p>
          <p>
            What happened in Nakhon Si Thammarat was this: city officials activated 70 CCTV-monitored
            pumping stations, the mayor stood in floodwater directing operations in person, and 40,000
            residents received alerts and shelter information within hours. The system worked not because
            the city had invested in expensive enterprise software, but because it had spent years building
            something that no index has ever figured out how to score: trust.
          </p>
          <p>
            The mayor had a phrase for what he was trying to build. He called solutions{" "}
            <em>edible</em> — so simple and direct in their benefit that an elderly street vendor
            who had never owned a smartphone could understand why she needed one. His deputy told me
            about a woman who sold grilled corn near the old market. She did not know what a QR code was.
            She did know that since she started using it, she had stopped losing money when customers
            claimed not to have cash. The technology was invisible. The benefit was not.
          </p>
          <p>
            This essay is about that gap. Between what cities measure about themselves and what it
            actually costs to live in them.
          </p>
        </div>

        <Photo photo={PHOTOS.melbourne} locale={locale} />

        {/* Section I */}
        <SectionHead title={ui.sections.I} />
        <div className="essay-prose">
          <p>
            The EIU Global Liveability Index began as a tool for corporate actuaries — specifically,
            to calculate whether an expatriate executive transferred from London to Lagos should receive a
            hardship supplement, and if so, how much. The index's five categories — stability, healthcare,
            culture and environment, infrastructure, education — were chosen because they were legible to
            the actuarial imagination. They were not chosen because they had any particular relationship
            to whether people could afford to live, whether they felt they belonged, or whether their
            children could breathe the air.
          </p>
          <p>
            The index has since been repurposed as a general liveability ranking, reported annually in
            newspapers across every one of its measured cities. Vienna wins most years. Melbourne wins
            some years. The methodology costs $935 to read.<Cite ids={[1]} /> The data behind it is largely
            self-reported by city governments.
          </p>
          <p>
            This is not a minor methodological footnote. Theodore Porter, in{" "}
            <em>Trust in Numbers</em>, argues that quantification earns legitimacy partly through the
            obscuration of its own construction — that a number, once produced, tends to be treated as
            if the choices that produced it were either absent or inevitable.<Cite ids={[2]} /> The EIU
            ranking is a particularly elegant example of this. The choices were neither absent nor
            inevitable: they were made by insurance companies and corporate relocation consultants in
            the late twentieth century and have been inherited, with minor modification, by a system that
            now claims to tell 170 cities and their residents how well their lives are going.
          </p>

          <Pull>{ui.pull1}</Pull>

          <p>
            The circularity is also worth naming. John, a former senior official in Melbourne's city
            government — Melbourne has ranked in the EIU top ten consistently for over a decade —
            described to me how a significant portion of his team's time was allocated, each year, to
            preparing documentation intended to influence the assessment. The ranking rewards the city's
            ability to represent itself well to outside judges. The judges are not residents. The
            documentation is not cheap to produce. The housing median in Melbourne, meanwhile, reached
            AU$953,000 in 2024, with rents rising 43 percent in five years.<Cite ids={[4]} />
          </p>
          <p>
            Wendy Espeland and Mitchell Stevens, in their landmark account of commensuration as a social
            process, observe that ranking systems do not merely measure the world — they reorganise
            it.<Cite ids={[3]} /> Cities that rank well attract the capital that makes them rank better.
            Cities that rank poorly lose the investment that might have helped them improve. The index
            does not describe an equilibrium; it enforces one.
          </p>
        </div>

        {/* Section II */}
        <SectionHead title={ui.sections.II} />
        <div className="essay-prose">
          <p>
            I have a friend — I will call him Kenny — who is a senior executive in Singapore. By every
            available index, Singapore is an exceptional city: world-class infrastructure, among the
            lowest crime rates in Asia, one of the most efficient public transit systems on earth, and
            an education system that consistently outperforms every OECD comparison. Kenny is good at his
            job and he is paid well. He is also gay, in a country that criminalised male homosexuality
            until 2022 and still does not recognise same-sex partnerships or permit gay couples to adopt.
          </p>
          <p>
            Kenny has been with his partner for eleven years. His company knows he is gay. He told me
            once, very carefully, that he believes his last two promotion cycles were affected by this.
            He cannot prove it. He does not intend to try. He will probably leave Singapore in the next
            three years — not because the food is bad or the trains are late, but because the city has
            communicated to him, repeatedly and structurally, that his life is tolerated rather than
            valued.
          </p>
          <p>
            This is not in any index.
          </p>
        </div>

        <Photo photo={PHOTOS.singapore} locale={locale} />

        <div className="essay-prose">
          <p>
            There is another person I want to tell you about. I will call her Chen. She moved from
            Shenzhen to Brussels eight years ago for her husband's work. She speaks excellent French and
            reasonable Dutch. She has a son who plays football with Belgian children and a daughter who
            reads in three languages. She told me, when I met her at a conference in Taipei, that she
            does not have a single Belgian friend. Not because Belgians are unkind — she insisted on
            this — but because the city has no infrastructure for the kind of belonging she is trying to
            build. Her network is Chinese expats, her husband's colleagues, her children's school parents.
            She feels, she said, like a guest in a very well-organised apartment.
          </p>
          <p>
            Brussels scores well on most liveability indices. Reasonable healthcare, solid transit,
            acceptable air quality, cultural institutions. The indices have no way to ask whether a woman
            from Shenzhen has been able, after eight years, to feel at home.
          </p>
          <p>
            The research literature has been building, slowly and somewhat grimly, toward a reckoning
            with this gap. Julianne Holt-Lunstad and her colleagues published, in 2015, a meta-analysis
            of 70 studies covering 3.4 million participants, finding that social isolation and loneliness
            increase mortality risk by roughly 29 and 26 percent respectively — effects comparable to
            smoking fifteen cigarettes a day.<Cite ids={[5]} /> The same year, Robert Putnam's work on
            social capital had already been warning for two decades that the erosion of civic
            connectedness was producing measurable damage to human health, political participation, and
            institutional trust.<Cite ids={[6]} /> None of this is captured by a ranking system that
            measures "culture and environment" by counting opera houses.
          </p>
          <p>
            Vienna, to its credit, has beautiful opera houses. It also has one of the higher suicide
            rates among developed-world capital cities — a statistic that did not prevent it from
            ranking first, second, or third on the EIU index for most years between 2009 and
            2024.<Cite ids={[7, 19]} /> I am not suggesting that Vienna is a miserable city. I am
            suggesting that a ranking system which cannot see its suicide rate while awarding it first
            place is measuring something other than what it claims to measure.
          </p>

          <Pull>{ui.pull2}</Pull>

          <p>
            Daniel Kahneman and Angus Deaton, in their widely cited 2010 study of income and wellbeing,
            found that emotional wellbeing — how people actually feel day to day — plateaus at around
            $75,000 annual income, while life satisfaction (the evaluative judgment of whether one's life
            is going well) continues to rise with income.<Cite ids={[8]} /> What this means for city
            ranking is underappreciated: most of the indicators that conventional indices use —
            infrastructure quality, institutional density, economic output — track life satisfaction as
            evaluated by external experts, not emotional wellbeing as experienced by residents. These
            are related but not identical, and the gap between them is exactly where Kenny lives.
          </p>
        </div>

        {/* Section III */}
        <SectionHead title={ui.sections.III} />

        <Photo photo={PHOTOS.governance} locale={locale} />

        <div className="essay-prose">
          <p>
            Amartya Sen spent a career arguing, in{" "}
            <em>Development as Freedom</em> and elsewhere, that the right question is not what people
            have but what they are able to do and to be — what he called capabilities.<Cite ids={[9]} /> The
            capability approach begins not with income or institutional counts but with the actual
            freedoms people can exercise: the freedom to live a long and healthy life, to receive an
            education, to participate in political life, to move through a city without fear, to love who
            you love without professional consequence. A city ranking built on Sen's framework would look
            very different from what currently exists.
          </p>
          <p>
            It would also be harder to sell to institutional investors.
          </p>
          <p>
            The Stiglitz-Sen-Fitoussi commission, convened by the French government in 2008 and reporting
            in 2009, concluded that GDP and related productivity measures systematically fail to capture
            what actually matters to people's lives — sustainability, distribution, the quality of work,
            the security of the future.<Cite ids={[10]} /> The commission's report ran to 291 pages and
            was widely praised. Most city rankings continued unchanged.
          </p>
          <p>
            The SLIC Index — Smart and Liveable Cities Index — is an attempt to build something closer
            to what Sen and Stiglitz describe, with the significant constraint that I am not an economist,
            not a government, and not a research institution with a budget. I am a person with a laptop,
            a methodology that is published in full and free to read, and a persistent objection to the
            idea that Melbourne is the most livable city on earth for a family earning a median income.
          </p>
          <p>
            The five pillars of SLIC correspond to five questions a person building a life in a city
            would actually need answered. Can I afford to live here after rent? (<em>Growth.</em>) Is it
            safe and clean and connected? (<em>Viability.</em>) Can my children get good healthcare and
            education? (<em>Capability.</em>) Will I be welcome, or merely tolerated?{" "}
            (<em>Community.</em>) Is the city generating the kind of economic energy that creates
            opportunity over time? (<em>Creative.</em>) These are weighted by the evidence rather than by
            what is convenient to measure, and the data sources are cited, every one of them, so that
            any reader who doubts a number can go and look at where it came from.
          </p>

          <Pull>{ui.pull3}</Pull>

          <p>
            The results are uncomfortable for anyone who has been reading the EIU index as a proxy for
            where to live. By the SLIC scoring, Kaohsiung — a port city in southern Taiwan that does
            not appear in any established liveability list — ranks near the top. Vienna ranks in the
            mid-thirties. The difference is not aesthetic. Vienna is unquestionably more beautiful. It
            is also, for a person earning a local salary, significantly harder to afford, less tolerant
            of LGBTQ+ residents than the indices suggest, and carries a mental-health burden that no
            conventional ranking currently penalises.
          </p>
          <p>
            Jane Jacobs, who understood cities better than most people who have been paid to study them,
            wrote in <em>The Death and Life of Great American Cities</em> that the fundamental problem
            with urban planning was its tendency to substitute abstract categories for specific,
            observable human behaviours.<Cite ids={[11]} /> The planners she was criticising built
            highways through neighbourhoods because their models said the neighbourhood had too low a
            density — without observing that the neighbourhood was, by every measure visible to its
            residents, thriving. The ranking industry has a version of the same problem. It measures
            what is legible to its methodology and reports the results as if legibility were a property
            of the city rather than of the instrument.
          </p>
        </div>

        <Photo photo={PHOTOS.transit} locale={locale} />

        {/* Section IV */}
        <SectionHead title={ui.sections.IV} />
        <div className="essay-prose">
          <p>
            What I have learned, from trying to build a better instrument and from watching what works in
            cities like Nakhon Si Thammarat, can be compressed — imperfectly — into four things.
          </p>
          <p>
            The first is <strong>purpose</strong>. The question is not "does this city have smart city
            technology?" but "does this city solve the actual problems of the people who live in it?"
            These questions have different answers. Songdo, in South Korea, was built as a showcase of
            intelligent urban infrastructure and was for years one of the least inhabited cities of its
            size in the developed world. Nakhon Si Thammarat, with a fraction of the technology budget,
            deployed a citizen-reporting system via LINE — a messaging app most residents already used —
            and reduced average problem-resolution time from two weeks to 42 hours. The purpose was to
            serve residents. The technology was incidental.<Cite ids={[14, 15]} />
          </p>
          <p>
            The second is <strong>practicality</strong>. I am suspicious of any urban intervention that
            cannot be explained to the street vendor selling grilled corn. This is not anti-intellectualism.
            It is a recognition that the gap between a system's technical sophistication and a resident's
            ability to use it is itself a cost — one that is rarely counted in the index of what was
            spent.
          </p>
          <p>
            The third is <strong>proof</strong>. The riskiest moment in any urban innovation is the
            transition from "this worked for ten people" to "therefore we should implement it
            city-wide." Anthony Townsend, in <em>Smart Cities</em>, documents the wreckage of urban
            technology projects that skipped the intermediate steps: pilot, evaluate, revise,
            scale.<Cite ids={[14]} /> A telemedicine programme in Rayong province worked because the city
            tested devices with 40 residents, measured the results, and only then made a recommendation.
            Eighty-five percent reduction in hospital visits. That is a number I trust because I know how
            it was counted.
          </p>
          <p>
            The fourth is <strong>people</strong>. Not people as abstract beneficiaries, but people as
            the thing a city is actually for — their time, their belonging, their freedom to live a life
            that feels like their own rather than like a compromise with a system designed for someone
            else. Robert Putnam's term for this is social capital.<Cite ids={[6]} /> Henri Lefebvre's
            term is the right to the city.<Cite ids={[12]} /> David Harvey's term is the collective power
            to reshape the processes of urbanisation.<Cite ids={[13]} /> I am not sure any of these fully
            captures what Kenny described to me when he said that the city communicates, structurally,
            whether your life is valued or merely tolerated. But I think they are all pointing at the
            same thing.
          </p>
        </div>

        {/* Section V */}
        <SectionHead title={ui.sections.V} />

        <Photo photo={PHOTOS.london} locale={locale} />

        <div className="essay-prose">
          <p>
            I want to be honest about the limits of SLIC, because I am suspicious of indices that are not.
          </p>
          <p>
            SLIC cannot measure what Kenny feels when he understands that his career has been quietly
            managed around him. It can measure the legal status of same-sex relationships in Singapore,
            the Freedom House score, the HRMI Empowerment rating, the V-Dem Liberal Democracy
            Index.<Cite ids={[16, 17, 18]} /> It cannot measure the particular texture of a conversation
            Kenny had with his manager two years ago, in which nothing was said that could be quoted in
            any complaint, and everything was understood.
          </p>
          <p>
            SLIC cannot measure what Chen has not been able to build in eight years in Brussels. It can
            measure net migration rates, multilingual service availability, social trust indices. It
            cannot measure the specific weight of sitting alone at a school event while other parents
            talk in clusters that do not open.
          </p>
          <p>
            What SLIC can do — and I think this matters — is name these absences. The civic freedom and
            dignity metric added to the index in 2026 gives Singapore a score of 39 out of 100. The
            methodology is transparent: it is a composite of the Human Rights Measurement Initiative's
            Empowerment score, the Freedom House index, and the V-Dem Liberal Democracy Index.<Cite ids={[16, 17, 18]} />{" "}
            You can disagree with the weights. You can disagree with the sources. You cannot, looking at
            that score, pretend that the index does not know Kenny exists.
          </p>
          <p>
            Whether that is enough is a question I am still sitting with.
          </p>
          <p>
            The street vendor in Nakhon Si Thammarat did not ask for a QR code. She asked, at some
            point, for a way to get paid reliably. The technology that gave her that was invisible.
            The benefit was not. I keep coming back to this as the measure of what any city instrument
            should eventually be able to say: not "this city has 47 data governance initiatives" but
            "this woman can now get paid reliably."
          </p>
          <p>
            Most liveability rankings cannot say the second thing. They can say the first, at length,
            for $935 a year.
          </p>
          <p>
            This essay is free. The data behind it is free. The methodology is published. And I am still,
            genuinely, not certain I have got it right. But I am certain that the alternative — treating
            the EIU index as a proxy for where human lives go well — is a choice with consequences, and
            not a neutral one. Kenny, Chen, and the woman with the QR code are all paying some version
            of that tab.
          </p>

          <Pull>{ui.pull4}</Pull>

          <p>
            Henri Lefebvre argued, in 1968, that the city is not a consumer good or a technical
            achievement — it is a collective work, produced by the labour and imagination of its
            inhabitants, and the right to the city is therefore the right to participate in that
            production.<Cite ids={[12]} /> Most of what we call urban measurement today does not measure
            this participation. It measures what the city looks like from the outside, to someone who
            is not staying.
          </p>
          <p>
            The question I would want any city ranking to answer — the question I am still trying to
            build SLIC toward answering — is simpler than all of this. It is the question the grilled-
            corn vendor was implicitly asking when she adopted a QR code she did not understand: does
            this place work for me?
          </p>
          <p>
            That question does not have a tidy answer. But it is, I think, the right one to be asking.
          </p>
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
