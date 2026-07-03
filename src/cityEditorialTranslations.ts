import type { Locale } from "./types";

export interface CityEditorialTranslation {
  heroLine: Record<Locale, string>;
  intro: Record<Locale, string>;
}

export const cityEditorialTranslations: Record<string, CityEditorialTranslation> = {
  "tw-kaohsiung": {
    heroLine: {
      en: "Port infrastructure, warmer light, less daily strain.",
      th: "โครงสร้างพื้นฐานเมืองท่า แสงแดดอบอุ่น และความตึงเครียดรายวันที่ลดลง",
      zh: "港口基础设施，温暖的阳光，以及更少的日常压力。",
      ko: "항구 인프라, 더 따뜻한 햇살, 덜한 일상적 스트레스.",
      ja: "港湾インフラ、温暖な気候、そして少ない日常のストレス。"
    },
    intro: {
      en: "Kaohsiung is Taiwan's southern harbor metropolis: a working port city that has spent two decades turning industrial edge into public waterfront, arts infrastructure, and a looser daily rhythm. In SLIC terms it matters because logistics strength, cultural reinvention, warmer climate, and more breathable urban pace now sit in the same frame.",
      th: "เกาสงคือมหานครท่าเรือทางตอนใต้ของไต้หวัน เมืองท่าที่ใช้เวลาสองทศวรรษเปลี่ยนพื้นที่อุตสาหกรรมให้กลายเป็นริมน้ำสาธารณะ โครงสร้างพื้นฐานด้านศิลปะ และจังหวะชีวิตรายวันที่ผ่อนคลายขึ้น ในมุมมองของ SLIC ที่นี่สำคัญเพราะความแข็งแกร่งด้านโลจิสติกส์ การสร้างใหม่ทางวัฒนธรรม ภูมิอากาศที่อบอุ่น และจังหวะเมืองที่หายใจคล่องกว่าได้มาอยู่รวมกันในที่เดียว",
      zh: "高雄是台湾南部的港湾大都会：这座辛勤运转的港口城市花了二十年时间，将工业边缘转化为公共滨水区、艺术基础设施，以及更加宽松的日常节奏。在 SLIC 看来，它的重要性在于：物流实力、文化重塑、温暖的气候和更具呼吸感的城市节奏现在都融合在同一个框架中。",
      ko: "가오슝은 대만 남부의 항구 대도시입니다. 지난 20년 동안 산업의 변두리를 공공 수변 공간, 예술 인프라, 여유로운 일상 리듬으로 탈바꿈시킨 노동 항구 도시입니다. SLIC의 관점에서 가오슝이 중요한 이유는 물류의 힘, 문화적 재창조, 따뜻한 기후, 숨쉬기 편한 도시의 속도가 이제 같은 틀 안에 공존하기 때문입니다.",
      ja: "高雄は台湾南部の港湾大都市です。20年かけて工業の周辺部を公共のウォーターフロント、芸術のインフラ、そしてよりゆったりとした日常のリズムへと変えてきた労働港湾都市です。SLICの観点から見て重要なのは、物流の強さ、文化の再発明、温暖な気候、そしてより息のしやすい都市のペースが、今や同じ枠組みの中に収まっているからです。"
    }
  },
  "tw-taipei": {
    heroLine: {
      en: "High capability without metropolitan coldness.",
      th: "ศักยภาพระดับสูงที่ปราศจากความเย็นชาแบบมหานคร",
      zh: "具备高能，却没有大都会的冷漠。",
      ko: "대도시 특유의 차가움이 없는 높은 역량.",
      ja: "大都市特有の冷たさを持たない、高い能力。"
    },
    intro: {
      en: "Taipei is Taiwan's political, cultural, and knowledge core, dense enough to be efficient but still legible enough to feel humane. SLIC reads it as a city where transit, safety, civility, food culture, and plural everyday life compound rather than cancel each other out.",
      th: "ไทเปคือศูนย์กลางทางการเมือง วัฒนธรรม และความรู้ของไต้หวัน มีความหนาแน่นพอที่จะมีประสิทธิภาพ แต่ก็อ่านง่ายพอที่จะให้ความรู้สึกเป็นมิตร SLIC มองว่าที่นี่คือเมืองที่ระบบขนส่ง ความปลอดภัย ความมีอารยธรรม วัฒนธรรมอาหาร และชีวิตประจำวันที่หลากหลายต่างส่งเสริมกันแทนที่จะหักล้างกัน",
      zh: "台北是台湾的政治、文化和知识核心，其密度足以保证高效，却又清晰得足以让人感到温暖。SLIC 将其解读为一个交通、安全、文明、饮食文化和多元日常生活相互促进，而不是相互抵消的城市。",
      ko: "타이베이는 대만의 정치, 문화, 지식의 핵심으로, 효율적일 만큼 밀도가 높으면서도 인간적으로 느껴질 만큼 쉽게 파악할 수 있는 도시입니다. SLIC은 이 도시를 교통, 안전, 시민의식, 음식 문화, 다원적인 일상생활이 서로 상쇄되지 않고 시너지를 내는 곳으로 해석합니다.",
      ja: "台北は台湾の政治、文化、知識の中核であり、効率的であるのに十分な密度を持ちながら、人間らしさを感じられるほど分かりやすい都市です。SLICは、交通、安全性、市民性、食文化、そして多元的な日常生活が、互いに打ち消し合うのではなく相乗効果を生み出す都市として読み解いています。"
    }
  },
  "us-raleigh": {
    heroLine: {
      en: "Triangle growth with more room to stay legible.",
      th: "การเติบโตแบบสามเหลี่ยมที่มีพื้นที่มากพอให้ไม่ซับซ้อนเกินไป",
      zh: "三角区的增长，留有更多清晰可见的空间。",
      ko: "트라이앵글의 성장과 함께 여전히 파악하기 쉬운 넉넉한 공간.",
      ja: "トライアングルの成長と、分かりやすさを保つ十分なスペース。"
    },
    intro: {
      en: "Raleigh is the capital of North Carolina and the largest city in the Research Triangle, shaped less by spectacle than by universities, research, and steady knowledge-economy growth. SLIC treats it as a low-friction city: ambitious, educated, and metropolitan, but still spacious enough for daily life to remain usable.",
      th: "ราลีคือเมืองหลวงของนอร์ทแคโรไลนาและเมืองที่ใหญ่ที่สุดใน Research Triangle เติบโตจากมหาวิทยาลัย การวิจัย และเศรษฐกิจฐานความรู้ที่มั่นคงมากกว่าจะเป็นสิ่งตระการตา SLIC ถือว่าที่นี่เป็นเมืองที่มีความเสียดทานต่ำ ทะเยอทะยาน มีการศึกษา และเป็นมหานคร แต่ก็ยังมีพื้นที่กว้างขวางพอให้ใช้ชีวิตประจำวันได้จริง",
      zh: "罗利是北卡罗来纳州的首府，也是研究三角区最大的城市，它的塑造更多是由大学、研究机构和稳健的知识经济增长驱动，而不是华而不实的景观。SLIC 将其视为一个低摩擦的城市：雄心勃勃、受过良好教育、拥有大都会气质，但空间仍然足够开阔，让日常生活保持可用性。",
      ko: "롤리는 노스캐롤라이나의 주도이자 리서치 트라이앵글에서 가장 큰 도시로, 화려한 볼거리보다는 대학, 연구, 그리고 꾸준한 지식 경제 성장을 바탕으로 형성되었습니다. SLIC은 이 도시를 마찰이 적은 도시로 평가합니다. 야심 차고 교육 수준이 높으며 대도시의 면모를 갖추었지만, 일상생활을 누리기에 여전히 충분히 여유롭습니다.",
      ja: "ローリーはノースカロライナ州の州都であり、リサーチ・トライアングルで最大の都市です。見世物よりも、大学、研究、着実な知識経済の成長によって形成されています。SLICはここを摩擦の少ない都市として扱っています。野心的で教育水準が高く、大都市の雰囲気がありながらも、日常生活を送るのに十分な広さがあります。"
    }
  },
  "kr-busan": {
    heroLine: {
      en: "Korea's working waterfront at a more human temperature.",
      th: "ริมน้ำระดับปฏิบัติการของเกาหลีในอุณหภูมิที่เป็นมิตรกับผู้คน",
      zh: "韩国辛勤的滨水区，有着更具人情味的温度。",
      ko: "더 인간적인 온도를 지닌 한국의 일하는 수변 도시.",
      ja: "より人間味のある温度を持つ、韓国の働くウォーターフロント。"
    },
    intro: {
      en: "Busan is South Korea's main port metropolis after Seoul, with container infrastructure, beaches, hillsides, and film-culture visibility all compressed into one maritime city. In SLIC terms it offers a powerful counter-model to capital-city overload: economic relevance and urban texture without quite the same level of pressure.",
      th: "ปูซานเป็นมหานครท่าเรือหลักของเกาหลีใต้รองจากโซล มีโครงสร้างพื้นฐานท่าเรือ ชายหาด เนินเขา และวัฒนธรรมภาพยนตร์ที่ถูกบีบรวมเป็นเมืองริมทะเลเพียงแห่งเดียว ในแง่ของ SLIC ที่นี่คือโมเดลทางเลือกที่ทรงพลังเพื่อต้านทานความแออัดของเมืองหลวง มีความสำคัญทางเศรษฐกิจและสัมผัสเมืองโดยไม่ต้องรับความกดดันที่มากเท่า",
      zh: "釜山是韩国除首尔外的主要港湾大都会，集装箱基础设施、海滩、山坡和显赫的电影文化都被压缩在这一座海上城市中。在 SLIC 看来，它提供了一个强有力的、对抗首都过载的反向模型：在没有同样高压的情况下，保留了经济相关性和城市质感。",
      ko: "부산은 서울에 이은 한국의 주요 항구 대도시로, 컨테이너 인프라, 해변, 언덕, 그리고 영화 문화의 가시성이 모두 해양 도시 하나로 압축되어 있습니다. SLIC의 관점에서 부산은 수도권 과부하에 대한 강력한 대안 모델을 제시합니다. 수도권만큼의 압박감 없이도 경제적 적합성과 도시의 질감을 제공합니다.",
      ja: "釜山はソウルに次ぐ韓国の主要な港湾大都市であり、コンテナインフラ、ビーチ、丘陵地帯、映画文化の存在感がすべてひとつの海洋都市に凝縮されています。SLICの観点から言えば、首都の過負荷に対する強力なカウンターモデルを提供しています。同じレベルのプレッシャーを受けることなく、経済的な関連性と都市の質感を兼ね備えているからです。"
    }
  },
  "pl-katowice": {
    heroLine: {
      en: "Post-industrial Poland without the museum treatment.",
      th: "โปแลนด์หลังยุคอุตสาหกรรมที่ไม่ได้ถูกแช่แข็งไว้ดูเล่นในพิพิธภัณฑ์",
      zh: "后工业时代的波兰，没有被当作博物馆一样供起来。",
      ko: "박물관 취급을 받지 않는 탈산업화 시대의 폴란드.",
      ja: "博物館扱いされない、ポスト工業化時代のポーランド。"
    },
    intro: {
      en: "Katowice is the core city of Upper Silesia's polycentric industrial belt, shaped by coal, steel, rail, and the long afterlife of heavy infrastructure. SLIC reads it as a serious working city now remaking itself through services, culture, and regional connectivity, while still keeping a tougher, more affordable urban logic than Western Europe's showcase capitals.",
      th: "คาโตวีตเซคือเมืองศูนย์กลางของเขตอุตสาหกรรมแบบหลายขั้วของเซลิเซียตอนบน ก่อร่างสร้างตัวมาจากถ่านหิน เหล็กกล้า รางรถไฟ และผลสืบเนื่องอันยาวนานจากโครงสร้างพื้นฐานอุตสาหกรรมหนัก SLIC มองที่นี่ว่าเป็นเมืองคนทำงานที่เอาจริงเอาจัง และกำลังสร้างตัวตนใหม่ผ่านบริการ วัฒนธรรม และการเชื่อมต่อในภูมิภาค ในขณะที่ยังคงตรรกะของเมืองที่ดิบและเข้าถึงได้ง่ายกว่าเมืองหลวงระดับโชว์เคสในยุโรปตะวันตก",
      zh: "卡托维兹是上西里西亚多中心工业带的核心城市，由煤炭、钢铁、铁路以及重型基础设施的长期余波塑造而成。SLIC 将其解读为一个严肃的工人城市，现在正通过服务业、文化和区域互联互通重塑自身，同时仍然保持着比西欧的“橱窗”首都更坚韧、更经济实惠的城市逻辑。",
      ko: "카토비체는 석탄, 철강, 철도 및 무거운 인프라의 긴 사후 세계로 형성된 어퍼 실레지아 다중 중심 산업 벨트의 핵심 도시입니다. SLIC은 이곳을 서비스, 문화, 지역적 연결을 통해 스스로를 재창조하는 진지한 노동의 도시로 해석합니다. 그러면서도 서유럽의 전시용 수도들보다 더 강인하고 저렴한 도시 논리를 유지하고 있습니다.",
      ja: "カトヴィツェは、石炭、鉄鋼、鉄道、そして重工業インフラの長い余波によって形成された、上シレジアの多中心的な産業地帯の中核都市です。SLICはここを、サービス、文化、地域の接続性を通じて自らを再構築しつつある真面目な労働都市として読み解いています。同時に、西ヨーロッパのショーケースのような首都よりも、よりタフで手頃な都市の論理を維持しています。"
    }
  },
  "jp-fukuoka": {
    heroLine: {
      en: "Japan's western gateway with balanced metropolitan scale.",
      th: "ประตูสู่ตะวันตกของญี่ปุ่นในสเกลมหานครที่สมดุล",
      zh: "日本西部的门户，拥有均衡的大都会规模。",
      ko: "균형 잡힌 대도시 규모를 갖춘 일본의 서쪽 관문.",
      ja: "バランスの取れた大都市の規模を持つ、日本の西の玄関口。"
    },
    intro: {
      en: "Fukuoka is Kyushu's leading city and one of Japan's oldest gateway ports to the Asian mainland, compact enough to feel coherent but large enough to carry real startup, university, and logistics energy. In SLIC terms it is balanced metropolitanism: competent, connected, and fast-moving without becoming punishing.",
      th: "ฟุกุโอกะคือเมืองเอกของคิวชูและเมืองท่าเก่าแก่ที่สุดแห่งหนึ่งของญี่ปุ่นในการเข้าสู่เอเชียแผ่นดินใหญ่ กะทัดรัดพอให้รู้สึกเป็นปึกแผ่นแต่ก็ใหญ่พอที่จะขับเคลื่อนพลังงานด้านสตาร์ทอัพ มหาวิทยาลัย และโลจิสติกส์ ในมุมมอง SLIC ที่นี่คือความเป็นมหานครที่สมดุล: มีขีดความสามารถ เชื่อมโยง และเดินหน้าอย่างรวดเร็วโดยไม่ทำร้ายผู้อยู่อาศัย",
      zh: "福冈是九州的主要城市，也是日本通往亚洲大陆最古老的门户港口之一。它小巧紧凑，让人感觉连贯，但又足够庞大，足以承载真正的初创企业、大学和物流活力。在 SLIC 看来，这是一种平衡的大都会主义：能力出众、联系紧密、行动迅速，却不会令人感到折磨。",
      ko: "후쿠오카는 규슈의 선도 도시이자 아시아 대륙으로 향하는 일본에서 가장 오래된 관문 항구 중 하나입니다. 일관성을 느낄 수 있을 만큼 컴팩트하면서도 진정한 스타트업, 대학, 물류의 에너지를 담을 만큼 충분히 큽니다. SLIC의 관점에서 이는 균형 잡힌 대도시주의입니다. 역량 있고, 연결되어 있으며, 가혹해지지 않으면서도 빠르게 움직입니다.",
      ja: "福岡は九州を代表する都市であり、アジア大陸への日本最古の玄関口となる港のひとつです。まとまりを感じるほどコンパクトでありながら、本格的なスタートアップ、大学、そして物流のエネルギーを運ぶのに十分な大きさがあります。SLICの観点から言えば、それはバランスの取れたメトロポリタニズムです。有能で、つながりがあり、残酷になることなく速いペースで動いています。"
    }
  },
  "th-bangkok": {
    heroLine: {
      en: "Plural, improvised, magnetic, and structurally alive.",
      th: "หลากหลาย ด้นสด ดึงดูด และมีชีวิตในเชิงโครงสร้าง",
      zh: "多元、即兴、充满磁性，并且在结构上充满生机。",
      ko: "다원적이고 즉흥적이며 매력적이고 구조적으로 살아 숨 쉬는 곳.",
      ja: "多元的で、即興的で、磁力があり、構造的に生きている。"
    },
    intro: {
      en: "Bangkok is the index's editorial anchor — the city SLIC was partly built to challenge the assumption that an expensive English-speaking metro equals livable. On the published board it sits at pure rank #66 (SLIC 53.7) with no public-tier seat: Community 70.7 and Pressure 42.6 clear the Alpha floor and coverage is A, but every public-tier slot was filled by higher-ranked cities before Bangkok's turn. The rules are not gamed to force the anchor city onto the shelf.\n\nWhat SLIC measures that most indices miss: everyday costs — food, transport, rent — remain accessible at Bangkok income levels, even as global visitor pull rivals cities ranked well above it. That story is contextual evidence, not a hidden score boost.\n\nA note on the pillar split: Bangkok's Creative score (38.5) reflects the formal knowledge economy — startup density, R&D spending, FDI flows. That is not where Bangkok's creative capital lives. It lives in the Community pillar: hospitality, cultural vitality, tolerance, and a 24-hour street-level economy that conventional indices routinely omit. The index reads the city in the right column.",
      th: "กรุงเทพฯ เป็นเมืองหลักทางบรรณาธิการของดัชนี — เมืองที่ SLIC ถูกสร้างขึ้นเพื่อท้าทายสมมติฐานว่ามหานครที่พูดภาษาอังกฤษและมีค่าครองชีพสูงเท่ากับความน่าอยู่ บนบอร์ดที่เผยแพร่ กรุงเทพฯ อยู่อันดับล้วน #66 (SLIC 53.7) โดยไม่มีชั้นสาธารณะ: Community 70.7 และ Pressure 42.6 ผ่านพื้น Alpha และ coverage เป็น A แต่ทุกชั้นสาธารณะถูกเติมโดยเมืองที่อันดับสูงกว่าก่อนถึงคิวกรุงเทพฯ กติกาไม่ถูกปรับเพื่อดันเมืองหลักขึ้นชั้น\n\nสิ่งที่ SLIC วัดแต่ดัชนีส่วนใหญ่มองข้าม: ต้นทุนรายวัน — อาหาร ค่าเดินทาง ค่าเช่า — ยังเข้าถึงได้ในระดับรายได้ของคนกรุงเทพฯ แม้แรงดึงดูดนักเดินทางระดับโลกจะเทียบเท่าเมืองที่อันดับสูงกว่า เรื่องราวนี้เป็นหลักฐานเชิงบริบท ไม่ใช่คะแนนแฝง\n\nหมายเหตุเรื่องโครงสร้างเสาหลัก: คะแนน Creative ของกรุงเทพฯ (38.5) สะท้อนเศรษฐกิจฐานความรู้ในระบบ — ความหนาแน่นของสตาร์ทอัพ งบวิจัยและพัฒนา และกระแสเงินลงทุนตรงจากต่างประเทศ แต่ต้นทุนความคิดสร้างสรรค์ที่แท้จริงของกรุงเทพฯ อยู่ในเสาหลัก Community: hospitality ความมีชีวิตชีวาทางวัฒนธรรม ความอดกลั้น และเศรษฐกิจระดับถนน 24 ชั่วโมงที่ดัชนีทั่วไปมักมองข้าม ดัชนีอ่านเมืองในคอลัมน์ที่ถูกต้อง",
      zh: "曼谷是本指数的编辑锚点 —— SLIC 部分就是为了挑战「昂贵英语大都会 = 宜居」这一假设而构建的。在已发布榜单上，曼谷纯分排名第 66（SLIC 53.7），无公开层级席位：社区 70.7 与压力 42.6 越过 Alpha 底线，覆盖等级为 A，但所有公开层级席位在轮到曼谷之前已被更高排名城市占满。规则不会为锚点城市破例。\n\nSLIC 衡量而多数指数忽略的：日常成本 —— 餐饮、交通、租金 —— 在曼谷收入水平下仍可承受，即便全球游客吸引力可与排名更高的城市比肩。这是背景证据，不是隐藏加分。\n\n关于支柱划分：曼谷的 Creative（38.5）反映正规知识经济 —— 初创密度、研发支出、FDI 流入。曼谷的创意资本并不在那里，而在 Community 支柱：好客度、文化活力、包容度，以及常规指数 routinely 遗漏的 24 小时街头经济。指数在正确的栏目里解读这座城市。",
      ko: "방콕은 이 지수의 편집 앵커 도시입니다 — SLIC가 '비싼 영어권 대도시 = 살기 좋다'는 가정에 도전하기 위해 일부 만들어졌습니다. 게시된 보드에서 방콕은 순수 순위 #66(SLIC 53.7), 공개 등급 없음: 커뮤니티 70.7과 압력 42.6은 Alpha 최저선을 넘고 커버리지는 A이지만, 모든 공개 등급 자리가 더 높은 순위의 도시로 먼저 채워졌습니다. 규칙은 앵커 도시를 억지로 올리지 않습니다.\n\nSLIC이 측정하지만 대부분의 지수가 놓치는 것: 일상 비용 — 음식, 교통, 임대료 — 는 방콕 소득 수준에서 여전히 감당 가능하며, 글로벌 방문객 유치력은 훨씬 상위 도시와 견줄 만합니다. 이 이야기는 맥락 증거이지 숨겨진 가산점이 아닙니다.\n\n기둥 분할 참고: 방콕의 크리에이티브 점수(38.5)는 스타트업 밀도, R&D 지출, FDI 흐름 등 공식 지식 경제를 반영합니다. 방콕의 창조적 자본은 Community 기둥 — 환대, 문화 활력, 포용성, 24시간 거리 경제 — 에 있습니다.",
      ja: "バンコクはこの指数の編集アンカー都市です——SLICは「高コストの英語圏メトロポリス＝住みやすい」という前提に挑むために部分的に構築されました。公開ボードでは純粋な順位#66（SLIC 53.7）、公開ティアなし：コミュニティ70.7とプレッシャー42.6はAlpha最低線をクリアし、カバレッジはAですが、すべての公開ティア席がより高い順位の都市で先に埋まりました。ルールはアンカー都市を無理やり載せません。\n\nSLICが測定するが他の指数が見落とすもの：食費、交通、家賃などの日常コストはバンコクの所得水準で依然アクセス可能であり、グローバルな訪問者誘引力ははるかに上位の都市に匹敵します。この物語は文脈証拠であり、隠れた加点ではありません。\n\n柱の分割について：バンコクのクリエイティブスコア（38.5）はスタートアップ密度、R&D支出、FDIフローなどの公式知識経済を反映します。バンコクの創造的資本はCommunityの柱——ホスピタリティ、文化活力、寛容性、24時間のストリート経済——にあります。"
    }
  },
  "fr-lyon": {
    heroLine: {
      en: "Institutional France in a more usable key.",
      th: "สถาบันของฝรั่งเศสในสเกลที่ใช้งานง่ายขึ้น",
      zh: "更具实用性的法国机构缩影。",
      ko: "더 실용적인 느낌의 제도적 프랑스.",
      ja: "より使いやすいスケールの、制度的なフランス。"
    },
    intro: {
      en: "Lyon is France's second great urban pole, sitting between the Rhone and Saone with a mix of industry, research, gastronomy, and dense neighborhood life. SLIC treats it as a city where institutional depth still feels usable: economically serious and culturally thick, but less theatrical and often more livable day to day than the capital.",
      th: "ลียงคือขั้วเมืองใหญ่อันดับสองของฝรั่งเศส ตั้งอยู่ระหว่างแม่น้ำ Rhone และ Saone ผสมผสานอุตสาหกรรม งานวิจัย ทักษะการทำอาหารขั้นสูง และชีวิตชุมชนที่หนาแน่น SLIC ถือว่าที่นี่เป็นเมืองที่ความลึกซึ้งทางสถาบันยังคงเข้าถึงได้: เอาจริงเอาจังทางเศรษฐกิจและหนาแน่นทางวัฒนธรรม แต่ก็แสดงละครน้อยกว่าและมักจะน่าอยู่กว่าเมืองหลวงในทุกๆ วัน",
      zh: "里昂是法国第二大都市极，坐落在罗讷河与索恩河之间，融合了工业、研究、美食以及稠密的街区生活。SLIC 将其视为一个制度深度仍然感觉有用的城市：经济上严肃，文化上深厚，但比首都少了一些戏剧性，往往在日常生活中也更宜居。",
      ko: "리옹은 론 강과 손 강 사이에 위치한 프랑스의 두 번째 대도시 거점으로 산업, 연구, 미식, 그리고 밀도 높은 동네 생활이 혼합되어 있습니다. SLIC은 리옹을 제도적 깊이가 여전히 유용하게 느껴지는 도시로 평가합니다. 경제적으로 진지하고 문화적으로 두텁지만, 수도인 파리보다 연극적인 요소는 덜하며 종종 일상적으로 살기에 더 좋습니다.",
      ja: "リヨンはフランス第2の都市拠点であり、ローヌ川とソーヌ川の間に位置し、産業、研究、美食、そして密集した近隣生活が混ざり合っています。SLICはここを、制度的な深みがまだ機能していると感じられる都市として扱っています。経済的に真面目で文化的に厚みがありますが、首都よりも演劇的ではなく、日々の生活においてより住みやすいことが多いのです。"
    }
  },
  "ca-montreal": {
    heroLine: {
      en: "North America's French metropolis, still porous and cultural.",
      th: "มหานครฝรั่งเศสแห่งอเมริกาเหนือ ที่ยังคงลื่นไหลและเต็มไปด้วยวัฒนธรรม",
      zh: "北美法语大都会，依然保持着文化渗透力与开放性。",
      ko: "여전히 유동적이고 문화적인 북미의 프랑스어 대도시.",
      ja: "北米のフランス語圏のメトロポリス、いまだ多孔的で文化的。"
    },
    intro: {
      en: "Montreal is the major French-speaking metropolis of North America, built from port history, immigration, universities, festivals, and a civic culture that still feels relatively open-textured. In SLIC terms, culture is not ornament here; it is part of the operating system that makes daily urban life feel social, creative, and worth inhabiting.",
      th: "มอนทรีออลคือมหานครที่พูดภาษาฝรั่งเศสเป็นหลักของอเมริกาเหนือ สร้างขึ้นจากประวัติศาสตร์เมืองท่า การอพยพ มหาวิทยาลัย เทศกาล และวัฒนธรรมพลเมืองที่ยังคงรู้สึกเปิดกว้าง ในแง่ของ SLIC วัฒนธรรมไม่ใช่แค่เครื่องประดับที่นี่ มันเป็นส่วนหนึ่งของระบบปฏิบัติการที่ทำให้ชีวิตเมืองรายวันรู้สึกเข้าสังคมได้ สร้างสรรค์ และน่าอยู่",
      zh: "蒙特利尔是北美主要的法语大都会，它建立在港口历史、移民、大学、节日和一种依然让人感觉相对开放的公民文化之上。在 SLIC 看来，文化在这里不是装饰品；它是操作系统的一部分，让日常的城市生活充满社交性、创造性，并让人觉得值得居住。",
      ko: "몬트리올은 북미의 주요 프랑스어권 대도시로, 항구의 역사, 이민, 대학, 축제, 그리고 여전히 비교적 개방적으로 느껴지는 시민 문화를 바탕으로 건설되었습니다. SLIC의 관점에서 이곳에서 문화는 장식이 아닙니다. 그것은 일상적인 도시 생활을 사교적이고 창조적이며 살 가치가 있게 느끼게 만드는 운영 체제의 일부입니다.",
      ja: "モントリオールは北米の主要なフランス語圏の大都市であり、港の歴史、移民、大学、祭り、そしてまだ比較的開放感のある市民文化から築かれています。SLICの観点から言えば、ここでは文化は飾りではありません。それは日々の都市生活を社交的で創造的、そして住む価値があると感じさせるオペレーティングシステムの一部なのです。"
    }
  },
  "cl-santiago": {
    heroLine: {
      en: "Capability and concentration under Andean pressure.",
      th: "ศักยภาพและการกระจุกตัวภายใต้ความกดดันของเทือกเขาแอนดีส",
      zh: "在安第斯山脉的压力下展现出的能力与集中度。",
      ko: "안데스 산맥의 압박 아래서의 역량과 집중.",
      ja: "アンデスのプレッシャーの下での能力と集中。"
    },
    intro: {
      en: "Santiago is Chile's dominant metropolitan core, with finance, universities, state power, and entrepreneurial energy concentrated in one Andean basin. SLIC reads it as a city of real capability and momentum whose attraction lies in the depth of opportunity it offers before the pressure curve hardens into inequality and strain.",
      th: "ซานติอาโกคือศูนย์กลางมหานครหลักของชิลี โดยมีการเงิน มหาวิทยาลัย อำนาจรัฐ และพลังงานของผู้ประกอบการกระจุกตัวอยู่ในแอ่งแอนดีสเพียงแห่งเดียว SLIC มองที่นี่ว่าเป็นเมืองที่มีขีดความสามารถและแรงส่งที่แท้จริง ซึ่งเสน่ห์ของมันอยู่ที่ความลึกของโอกาสที่มอบให้ ก่อนที่เส้นโค้งแรงกดดันจะแข็งตัวกลายเป็นความไม่เท่าเทียมและความตึงเครียด",
      zh: "圣地亚哥是智利占据主导地位的大都会核心，金融、大学、国家权力和创业活力都集中在一个安第斯盆地中。SLIC 将其解读为一个拥有真正能力和发展势头的城市，其吸引力在于它所提供的深层机会，而这些机会尚未被压力曲线硬化为不平等和紧张局势。",
      ko: "산티아고는 칠레의 지배적인 대도시 중심지이며, 금융, 대학, 국가 권력, 그리고 기업가적 에너지가 하나의 안데스 분지에 집중되어 있습니다. SLIC은 이곳을 진정한 역량과 추진력을 갖춘 도시로 해석하며, 그 매력은 압박 곡선이 불평등과 긴장으로 굳어지기 전에 제공하는 기회의 깊이에 있습니다.",
      ja: "サンティアゴはチリの支配的な大都市の中核であり、金融、大学、国家権力、そして起業家のエネルギーが一つのアンデス盆地に集中しています。SLICはここを、真の能力と勢いを持つ都市として読み解いており、その魅力はプレッシャー曲線が不平等や緊張へと硬化する前に提供される機会の深さにあります。"
    }
  }
,
  "us-pittsburgh": {
    heroLine: {
      en: "Industrial gravity, remade into a sharper civic machine.",
      th: "แรงดึงดูดแห่งอุตสาหกรรม ที่ถูกปรับโฉมให้กลายเป็นกลไกเมืองที่เฉียบคมยิ่งขึ้น",
      zh: "工业引力被重塑为更敏锐的城市运转机制。",
      ko: "더 날렵한 시민 사회 구조로 재편된 산업의 무게감.",
      ja: "より洗練された都市機能へと再構築された、産業の重力。"
    },
    intro: {
      en: "Pittsburgh is a post-steel American city that never fully abandoned the disciplines of heavy industry; it redirected them into universities, medicine, robotics, and a more compact civic economy. In SLIC terms it matters because capability here is not abstract prestige but a lived structure of institutions, reinvention, and workable urban scale.",
      th: "พิตต์สเบิร์กคือเมืองหลังยุคเหล็กกล้าของอเมริกาที่ไม่เคยละทิ้งวินัยของอุตสาหกรรมหนัก แต่ได้เปลี่ยนทิศทางไปยังมหาวิทยาลัย การแพทย์ วิทยาการหุ่นยนต์ และเศรษฐกิจเมืองที่กระชับขึ้น ในมุมมองของ SLIC ที่นี่สำคัญเพราะความสามารถไม่ใช่แค่ชื่อเสียงเลื่อนลอย แต่คือโครงสร้างของสถาบันที่มีชีวิต การสร้างใหม่ และขนาดของเมืองที่ใช้งานได้จริง",
      zh: "匹兹堡是一座后钢铁时代的美国城市，但它从未完全放弃重工业的纪律性；它将这些纪律性重定向到了大学、医学、机器人技术以及更紧凑的城市经济中。在 SLIC 看来，它的重要性在于：这里的“能力”并非抽象的声望，而是由各机构、重塑能力以及宜人的城市规模构成的鲜活结构。",
      ko: "피츠버그는 중공업의 규율을 완전히 버리지 않은 포스트 스틸 시대의 미국 도시로, 이를 대학, 의학, 로봇 공학 및 더 압축적인 시민 경제로 재조준했습니다. SLIC의 관점에서 이곳이 중요한 이유는 '역량'이 추상적인 위신이 아니라 제도, 재창조, 그리고 작동 가능한 도시 규모의 살아있는 구조이기 때문입니다.",
      ja: "ピッツバーグは、重工業の規律を完全に放棄することなく、それを大学、医療、ロボット工学、そしてよりコンパクトな市民経済へと方向転換させた、ポスト鉄鋼時代のアメリカの都市です。SLICの観点からは、ここでの「能力」が抽象的な威信ではなく、生きた制度の構造、再創造、そして機能的な都市規模であるため重要です。"
    }
  },
  "jp-kobe": {
    heroLine: {
      en: "Harbor city elegance with mountains still in the frame.",
      th: "ความสง่างามของเมืองท่า ที่ยังมีภูเขาอยู่ในกรอบสายตา",
      zh: "拥有山脉背景的港口城市的优雅。",
      ko: "산맥을 배경으로 한 항구 도시의 우아함.",
      ja: "山々を背景に抱く、港湾都市の優雅さ。"
    },
    intro: {
      en: "Kobe is one of Japan's classic port cities, stretched between mountain slope and harbor edge in a way that keeps the metropolitan form unusually legible. SLIC reads it as a city where trade, design consciousness, and daily calm still hold together without the crushing pressure of the very largest Japanese cores.",
      th: "โกเบเป็นหนึ่งในเมืองท่าคลาสสิกของญี่ปุ่น ที่ทอดยาวระหว่างเนินเขาและริมท่าเรือในแบบที่ทำให้รูปทรงของมหานครชัดเจนเป็นพิเศษ SLIC มองว่าที่นี่คือเมืองที่การค้า จิตสำนึกด้านการออกแบบ และความสงบในแต่ละวันยังคงอยู่ร่วมกันได้ โดยปราศจากแรงกดดันมหาศาลเหมือนในแกนกลางเมืองที่ใหญ่ที่สุดของญี่ปุ่น",
      zh: "神户是日本经典的港口城市之一，它在山坡和港口边缘之间延伸，以一种使大都市形态异常清晰的方式存在。SLIC 将其解读为一座贸易、设计意识和日常平静仍然交织在一起的城市，而没有日本最大核心城市那种令人窒息的压力。",
      ko: "고베는 일본의 고전적인 항구 도시 중 하나로, 산비탈과 항구 가장자리 사이에 뻗어 있어 대도시의 형태가 유난히 뚜렷하게 유지됩니다. SLIC는 이곳을 무역, 디자인 의식, 일상의 평온함이 가장 큰 일본 핵심 도시들의 짓누르는 압박 없이 여전히 함께 유지되는 도시로 해석합니다.",
      ja: "神戸は日本の古典的な港湾都市の一つであり、山肌と港の間に広がるその姿は、大都市の形態を異常なほど明確に保っています。SLICはここを、日本最大の中核都市が持つ押し潰されるようなプレッシャーなしに、貿易、デザインへの意識、そして日常の静けさが今なお共存している都市として読み解きます。"
    }
  },
  "us-minneapolis": {
    heroLine: {
      en: "Northern capability with room for real daily life.",
      th: "ศักยภาพแห่งแดนเหนือ ที่มีพื้นที่สำหรับชีวิตจริง",
      zh: "北方的实力，为真实的日常生活留有空间。",
      ko: "진짜 일상을 위한 공간을 갖춘 북부의 역량.",
      ja: "真の日常生活のためのゆとりを持つ、北部の実力。"
    },
    intro: {
      en: "Minneapolis is the stronger half of the Twin Cities economic engine, built on health systems, corporate depth, university capacity, and a long civic tradition of regional planning. In SLIC terms it is a serious winter city that still manages to feel structurally fairer, more organized, and more livable than many larger American peers.",
      th: "มินนีแอโพลิสคือครึ่งที่แข็งแกร่งกว่าของเครื่องยนต์เศรษฐกิจ Twin Cities ที่สร้างขึ้นบนระบบสุขภาพ ความลึกซึ้งขององค์กร ศักยภาพของมหาวิทยาลัย และประเพณีพลเมืองที่ยาวนานในการวางผังระดับภูมิภาค ในแง่ของ SLIC นี่คือเมืองฤดูหนาวที่จริงจัง ซึ่งยังคงให้ความรู้สึกถึงโครงสร้างที่ยุติธรรมกว่า มีระเบียบกว่า และน่าอยู่กว่าเมืองใหญ่อื่นๆ ในอเมริกา",
      zh: "明尼阿波利斯是双子城经济引擎中较强的一半，建立在医疗系统、企业深度、大学容量和悠久的区域规划公民传统之上。在 SLIC 看来，这是一座严肃的冬季城市，但与许多更大的美国同类城市相比，它的结构仍然让人感觉更公平、更有条理、更宜居。",
      ko: "미니애폴리스는 건강 시스템, 기업의 깊이, 대학의 수용력, 그리고 지역 계획에 대한 오랜 시민적 전통을 바탕으로 구축된 트윈 시티 경제 엔진의 더 강력한 절반입니다. SLIC의 관점에서 이곳은 진지한 겨울 도시이면서도 구조적으로 더 공정하고 조직적이며 미국의 많은 큰 대도시들보다 더 살기 좋게 느껴집니다.",
      ja: "ミネアポリスは、医療システム、企業の深み、大学の能力、そして地域計画という長年の市民的伝統の上に築かれた、ツインシティズの経済エンジンの強力な半分です。SLICの観点からは、ここは真剣な冬の都市でありながら、アメリカの多くの大きな都市よりも構造的に公平で、組織化されており、住みやすいと感じさせる都市です。"
    }
  },
  "il-haifa": {
    heroLine: {
      en: "Israel's mountain port with a broader social horizon.",
      th: "เมืองท่าบนภูเขาของอิสราเอล ที่มีขอบฟ้าทางสังคมที่กว้างไกลกว่า",
      zh: "以色列的山区港口，拥有更广阔的社会视野。",
      ko: "더 넓은 사회적 지평을 가진 이스라엘의 산악 항구.",
      ja: "より広い社会的視野を持つ、イスラエルの山岳港湾都市。"
    },
    intro: {
      en: "Haifa is Israel's principal northern port, terraced up Mount Carmel and shaped by industry, research, and one of the country's more visibly mixed urban societies. SLIC reads it as a city where coexistence, infrastructure, and topographic drama make a different proposition from the concentrated pressure of the main central belt.",
      th: "ไฮฟาคือเมืองท่าหลักทางตอนเหนือของอิสราเอล ที่ลดหลั่นไปตามไหล่เขาคาร์เมล ก่อร่างด้วยอุตสาหกรรม การวิจัย และสังคมเมืองที่ผสมผสานกันอย่างเห็นได้ชัดที่สุดแห่งหนึ่งของประเทศ SLIC มองว่าที่นี่เป็นเมืองที่การอยู่ร่วมกัน โครงสร้างพื้นฐาน และภูมิทัศน์ที่น่าทึ่ง ได้สร้างข้อเสนอที่แตกต่างไปจากแรงกดดันที่กระจุกตัวอยู่ในแถบศูนย์กลางหลัก",
      zh: "海法是以色列主要的北部港口，沿着迦密山呈阶梯状分布，由工业、研究以及该国更明显混合的城市社会之一所塑造。SLIC 将其解读为一座共存、基础设施和地形戏剧性提出了与主要中心带的集中压力不同主张的城市。",
      ko: "하이파는 이스라엘의 주요 북부 항구로, 카르멜 산을 따라 계단식으로 형성되어 있으며 산업, 연구, 그리고 이스라엘에서 더 눈에 띄게 혼합된 도시 사회 중 하나로 형성되었습니다. SLIC는 이곳을 공존, 인프라, 지형적 드라마가 주요 중앙 벨트의 집중된 압박과는 다른 제안을 하는 도시로 해석합니다.",
      ja: "ハイファはイスラエルの主要な北部港であり、カルメル山に段々畑のように広がり、産業、研究、そして国の中でより目に見えて混合された都市社会の一つによって形成されています。SLICはここを、共存、インフラストラクチャー、そして地形的なドラマが、主要な中央ベルトの集中した圧力とは異なる提案をする都市として読み解きます。"
    }
  },
  "kr-suwon": {
    heroLine: {
      en: "Seoul-region power without quite the same compression.",
      th: "พลังของภูมิภาคโซล ที่ปราศจากแรงบีบอัดในระดับเดียวกัน",
      zh: "首尔区域的实力，但没有同样程度的压缩感。",
      ko: "서울과 같은 압축감 없이 누리는 수도권의 힘.",
      ja: "同じような圧迫感を持たない、ソウル圏の力。"
    },
    intro: {
      en: "Suwon is the capital of Gyeonggi-do and one of the major cities orbiting the Seoul region, carrying electronics, administration, and inherited fortress urbanism in the same geography. In SLIC terms it matters as a metropolitan release valve: high-connectivity Korea with slightly more room, less symbolism, and a more workable everyday tempo.",
      th: "ซูวอนเป็นเมืองหลวงของจังหวัดคย็องกี และเป็นหนึ่งในเมืองใหญ่ที่โคจรรอบเขตโซล โดยมีทั้งอุตสาหกรรมอิเล็กทรอนิกส์ การบริหาร และความเป็นเมืองป้อมปราการที่สืบทอดมาในภูมิศาสตร์เดียวกัน ในแง่ของ SLIC ที่นี่สำคัญในฐานะวาล์วระบายความดันของมหานคร: เกาหลีที่มีการเชื่อมต่อสูง แต่มีพื้นที่มากขึ้นอีกนิด สัญลักษณ์น้อยลงหน่อย และจังหวะชีวิตประจำวันที่ใช้การได้มากกว่า",
      zh: "水原是京畿道的首府，也是环绕首尔地区的主要城市之一，在同一地理环境中承载着电子产业、行政管理和传承下来的堡垒城市主义。在 SLIC 看来，它作为大都市的减压阀具有重要意义：它是高度互联的韩国，但拥有稍微多一点的空间、少一点的象征意义以及更可行的日常节奏。",
      ko: "수원은 경기도의 도청 소재지이자 서울 지역을 도는 주요 도시 중 하나로, 전자 산업, 행정, 그리고 상속된 요새 도시주의를 같은 지리에 담고 있습니다. SLIC의 관점에서 이곳은 대도시의 배출구로서 중요합니다. 고도의 연결성을 가진 한국이지만 공간이 조금 더 있고 상징성은 덜하며 일상적인 템포가 더 수월합니다.",
      ja: "水原は京畿道の道庁所在地であり、ソウル圏を周回する主要都市の一つで、電子産業、行政、そして受け継がれた城塞都市の要素を同じ地理の中に持っています。SLICの観点からは、ここは首都圏の圧力解放バルブとして重要です。高い接続性を持つ韓国でありながら、少し余裕があり、象徴性が少なく、より機能的な日常のテンポを持っています。"
    }
  },
  "ca-ottawa": {
    heroLine: {
      en: "Administrative capital, but calmer than the label suggests.",
      th: "เมืองหลวงศูนย์กลางการบริหาร ที่สงบเงียบกว่าชื่อที่เรียกขาน",
      zh: "行政首府，但比标签暗示的要平静。",
      ko: "행정 수도, 하지만 타이틀이 암시하는 것보다 평온함.",
      ja: "行政の首都でありながら、その響きよりも穏やか。"
    },
    intro: {
      en: "Ottawa is Canada's federal capital, but its daily character is less imperial than procedural: government, research, bilingual institutions, and a river-based urban form that rarely needs to perform itself theatrically. SLIC reads it as a city where public-sector stability and human-scale order still convert into real livability.",
      th: "ออตตาวาคือเมืองหลวงของรัฐบาลกลางแคนาดา แต่ลักษณะเฉพาะในแต่ละวันนั้นเน้นกระบวนการมากกว่าอำนาจ: รัฐบาล การวิจัย สถาบันสองภาษา และรูปแบบเมืองริมแม่น้ำที่แทบไม่ต้องแสดงความยิ่งใหญ่ให้ใครเห็น SLIC มองว่านี่คือเมืองที่เสถียรภาพของภาครัฐและความเป็นระเบียบในระดับมนุษย์ยังคงเปลี่ยนเป็นความน่าอยู่ได้อย่างแท้จริง",
      zh: "渥太华是加拿大的联邦首都，但其日常特征更偏向于程序化而非帝国化：政府、研究、双语机构以及基于河流的城市形态，很少需要戏剧性地展示自己。SLIC 将其解读为一座公共部门的稳定性和人性化尺度的秩序仍然转化为真实宜居性的城市。",
      ko: "오타와는 캐나다의 연방 수도이지만, 일상적인 성격은 제국주의적이라기보다는 절차적입니다. 정부, 연구, 이중 언어 기관, 그리고 굳이 연극적으로 자신을 드러낼 필요가 없는 강 기반의 도시 형태가 그렇습니다. SLIC는 이곳을 공공 부문의 안정성과 인간 규모의 질서가 여전히 진정한 살기 좋음으로 전환되는 도시로 해석합니다.",
      ja: "オタワはカナダの連邦首都ですが、その日常的な性格は帝国的というより手続き的です。政府、研究、バイリンガルな機関、そして演劇的に自らを誇示する必要がめったにない、川を中心とした都市形態があります。SLICはここを、公共部門の安定性と人間スケールの秩序が今なお真の住みやすさに変換されている都市として読み解きます。"
    }
  },
  "cl-valparaiso": {
    heroLine: {
      en: "Chile's vertical port of improvisation, memory, and abrasion.",
      th: "เมืองท่าแนวตั้งของชิลี แห่งการด้นสด ความทรงจำ และร่องรอยการเสียดสี",
      zh: "智利的垂直港口，充满即兴创作、记忆和磨损感。",
      ko: "즉흥성, 기억, 그리고 마모의 수직 항구 도시 칠레.",
      ja: "即興、記憶、そして摩耗が交差する、チリの垂直港湾都市。"
    },
    intro: {
      en: "Valparaiso is Chile's old Pacific port, famous not because it is tidy but because its hills, lifts, murals, stairs, and maritime edge still make urban life feel textured and specific. SLIC reads it as a city where cultural thickness and lived character remain strong even when the infrastructure story is less polished.",
      th: "บัลปาราอีโซคือเมืองท่าเก่าแก่ริมมหาสมุทรแปซิฟิกของชิลี มีชื่อเสียงไม่ใช่เพราะความเป็นระเบียบเรียบร้อย แต่เพราะเนินเขา ลิฟต์ จิตรกรรมฝาผนัง บันได และริมฝั่งทะเลที่ทำให้ชีวิตในเมืองยังคงมีพื้นผิวและมีเอกลักษณ์เฉพาะตัว SLIC มองว่าที่นี่คือเมืองที่ความหนาแน่นทางวัฒนธรรมและลักษณะการใช้ชีวิตยังคงแข็งแกร่ง แม้ว่าเรื่องราวของโครงสร้างพื้นฐานจะยังไม่ขัดเกลาก็ตาม",
      zh: "瓦尔帕莱索是智利古老的太平洋港口，它之所以出名，不是因为它整洁，而是因为它的丘陵、缆车、壁画、楼梯和海洋边缘仍然让城市生活感觉充满质感和独特性。SLIC 将其解读为一座即使在基础设施不够完善的情况下，文化厚度和生活特征依然强烈的城市。",
      ko: "발파라이소는 칠레의 오래된 태평양 항구로, 깔끔해서가 아니라 언덕, 리프트, 벽화, 계단, 그리고 해양의 가장자리가 여전히 도시 생활에 질감과 특수성을 느끼게 해주기 때문에 유명합니다. SLIC는 이곳을 인프라 환경이 덜 세련되었을 때조차도 문화적 두께와 살아있는 특성이 여전히 강력하게 남아 있는 도시로 해석합니다.",
      ja: "バルパライソはチリの古い太平洋の港であり、整然としているからではなく、その丘、ケーブルカー、壁画、階段、そして海辺の境界が、都市生活を依然として質感があり特殊なものに感じさせるために有名です。SLICはここを、インフラストラクチャーの物語があまり洗練されていなくても、文化的な厚みと生きた個性が依然として強く残る都市として読み解きます。"
    }
  },
  "it-milan": {
    heroLine: {
      en: "Italian productivity with a sharper metropolitan edge.",
      th: "ผลผลิตแบบอิตาลี ที่มีความเฉียบคมแบบมหานคร",
      zh: "意大利的生产力，带有更锐利的大都市边缘。",
      ko: "더 날카로운 대도시의 감각을 지닌 이탈리아의 생산성.",
      ja: "より鋭い大都市の感覚を持つ、イタリアの生産性。"
    },
    intro: {
      en: "Milan is Italy's financial and business capital, a city where fashion, design, manufacturing inheritance, and European service-sector ambition all compress into one hard-working metropolitan core. In SLIC terms it scores not as romance but as capacity: organized, economically relevant, and still culturally dense enough to matter beyond pure output.",
      th: "มิลานคือเมืองหลวงด้านการเงินและธุรกิจของอิตาลี เมืองที่แฟชั่น การออกแบบ มรดกการผลิต และความทะเยอทะยานของภาคบริการในยุโรป บีบอัดรวมเป็นแกนกลางมหานครที่ทำงานหนักเพียงแห่งเดียว ในแง่ของ SLIC คะแนนที่ได้ไม่ใช่ความโรแมนติก แต่คือความสามารถ: มีการจัดการ สัมพันธ์กับเศรษฐกิจ และยังคงหนาแน่นทางวัฒนธรรมมากพอที่จะมีความหมายมากกว่าแค่ผลผลิตล้วนๆ",
      zh: "米兰是意大利的金融和商业中心，这座城市将时尚、设计、制造业遗产和欧洲服务业的雄心壮志全部压缩到一个辛勤工作的大都市核心中。在 SLIC 看来，它的得分不是因为浪漫，而是因为能力：有条理、与经济息息相关，并且在文化上仍然足够密集，其意义超越了纯粹的产出。",
      ko: "밀라노는 이탈리아의 금융 및 비즈니스 중심지로, 패션, 디자인, 제조업 유산, 그리고 유럽 서비스 부문의 야망이 모두 하나의 열심히 일하는 대도시 핵심으로 압축되는 도시입니다. SLIC의 관점에서 이곳의 점수는 낭만이 아니라 역량의 결과입니다. 조직적이고 경제적으로 관련성이 있으며, 순수한 산출량을 넘어서는 의미를 가질 만큼 문화적으로 여전히 조밀합니다.",
      ja: "ミラノはイタリアの金融とビジネスの首都であり、ファッション、デザイン、製造業の遺産、そしてヨーロッパのサービス部門の野心が、すべて一つの勤勉な大都市の核へと圧縮された都市です。SLICの観点では、そのスコアはロマンスではなく能力としての評価です。組織化され、経済的に重要であり、単なる生産高を超えて意味を持つほど、今なお文化的に密集しています。"
    }
  },
  "nl-eindhoven": {
    heroLine: {
      en: "Design and deep-tech in a city that stays functional.",
      th: "การออกแบบและเทคโนโลยีขั้นสูง ในเมืองที่ยังคงใช้งานได้จริง",
      zh: "保持功能性的城市中的设计和深层技术。",
      ko: "기능성을 유지하는 도시 속의 디자인과 딥테크.",
      ja: "機能性を保ち続ける都市における、デザインとディープテック。"
    },
    intro: {
      en: "Eindhoven is the Netherlands' engineering and design city, built on the long afterlife of Philips, technical education, and a regional innovation economy that punches above its size. SLIC reads it as a city where competence is unusually visible: productive, inventive, and less burdened by big-capital theatricality.",
      th: "ไอนด์โฮเฟนคือเมืองแห่งวิศวกรรมและการออกแบบของเนเธอร์แลนด์ ที่สร้างขึ้นบนมรดกตกทอดอันยาวนานของ Philips การศึกษาด้านเทคนิค และเศรษฐกิจนวัตกรรมระดับภูมิภาคที่แข็งแกร่งเกินขนาด SLIC มองว่าเมืองนี้มีความสามารถที่เห็นได้ชัดเจนเป็นพิเศษ: มีผลผลิต มีความคิดสร้างสรรค์ และมีภาระน้อยกว่าความเป็นละครฉากใหญ่ของเมืองหลวงขนาดใหญ่",
      zh: "埃因霍温是荷兰的工程和设计之城，建立在飞利浦的悠久余辉、技术教育以及超越其规模的区域创新经济之上。SLIC 将其解读为一座能力异常可见的城市：富有生产力、创造力，并且较少受到大写字母戏剧性的束缚。",
      ko: "에인트호번은 필립스의 긴 사후 세계, 기술 교육, 그리고 규모를 뛰어넘는 지역 혁신 경제를 바탕으로 구축된 네덜란드의 엔지니어링 및 디자인 도시입니다. SLIC는 이곳을 역량이 유난히 눈에 띄는 도시로 해석합니다. 생산적이고 창의적이며 대규모 자본의 연극성에 덜 얽매여 있습니다.",
      ja: "アイントホーフェンは、フィリップスの長い名残、技術教育、そしてその規模を上回る地域イノベーション経済の上に築かれた、オランダのエンジニアリングとデザインの都市です。SLICはここを、能力が異常なほど目に見える都市として読み解きます。生産的で、独創的であり、巨大資本の演劇性にそれほど縛られていません。"
    }
  },
  "at-graz": {
    heroLine: {
      en: "Austria's second city with less choreography and more ease.",
      th: "เมืองใหญ่อันดับสองของออสเตรีย ที่มีการจัดฉากน้อยลงและมีความสบายมากขึ้น",
      zh: "奥地利的第二大城市，编排较少，更加从容。",
      ko: "짜여진 각본은 적고 편안함은 더 큰 오스트리아의 제2 도시.",
      ja: "演出が少なく、よりリラックスできるオーストリア第2の都市。"
    },
    intro: {
      en: "Graz is a university city, regional capital, and manufacturing center whose baroque fabric and southern setting give it a softer urban grain than Vienna. In SLIC terms it is one of those places where medium scale works in its favor: enough institutional depth to be serious, not so much size that everyday life becomes over-abstracted.",
      th: "กราซเป็นเมืองมหาวิทยาลัย เมืองหลวงของภูมิภาค และศูนย์กลางการผลิต ซึ่งโครงสร้างแบบบาโรกและที่ตั้งทางตอนใต้ทำให้มีเนื้อเมืองที่นุ่มนวลกว่าเวียนนา ในแง่ของ SLIC นี่คือหนึ่งในสถานที่ที่ขนาดกลางส่งผลดี: มีความลึกของสถาบันมากพอที่จะจริงจัง แต่ไม่ได้มีขนาดใหญ่จนทำให้ชีวิตประจำวันกลายเป็นเรื่องนามธรรมเกินไป",
      zh: "格拉茨是一座大学城、区域首府和制造业中心，其巴洛克式的建筑结构和南部背景赋予了它比维也纳更柔和的城市肌理。在 SLIC 看来，它是那种中等规模成为优势的地方之一：有足够的机构深度来保持严肃，但又不至于规模太大以至于日常生活变得过于抽象。",
      ko: "그라츠는 대학 도시이자 지역 수도, 그리고 제조업 중심지로 바로크 양식의 구조와 남부 지형이 빈보다 부드러운 도시의 결을 부여합니다. SLIC의 관점에서 이곳은 중간 규모가 장점으로 작용하는 곳 중 하나입니다. 진지할 만큼 충분한 제도적 깊이가 있으면서도 일상이 지나치게 추상화될 만큼 규모가 크지는 않습니다.",
      ja: "グラーツは大学都市、地域主都、そして製造業の中心地であり、そのバロック様式の構造と南部の環境がウィーンよりも柔らかな都市の質感を与えています。SLICの観点からは、中規模のスケールが有利に働く場所の一つです。真剣になるのに十分な制度的深みを持ちながらも、日常生活が抽象化されすぎるほどの規模ではありません。"
    }
  },
  "pt-braga": {
    heroLine: {
      en: "Northern Portugal's compact city of continuity and upgrade.",
      th: "เมืองขนาดกะทัดรัดทางตอนเหนือของโปรตุเกส แห่งความต่อเนื่องและการยกระดับ",
      zh: "葡萄牙北部兼具连续性和升级的紧凑型城市。",
      ko: "연속성과 업그레이드를 갖춘 포르투갈 북부의 소형 도시.",
      ja: "連続性とアップグレードを兼ね備えた、ポルトガル北部のコンパクトシティ。"
    },
    intro: {
      en: "Braga is one of Portugal's oldest cities, but it now combines ecclesiastical and historic depth with a younger knowledge-economy and technology profile. SLIC reads it as a city where continuity has not become stagnation; the historic shell still carries an urban life that is modern, connected, and comparatively usable.",
      th: "บรากาคือหนึ่งในเมืองที่เก่าแก่ที่สุดของโปรตุเกส แต่ในปัจจุบันได้ผสมผสานความลึกซึ้งทางศาสนาและประวัติศาสตร์เข้ากับโปรไฟล์เศรษฐกิจฐานความรู้และเทคโนโลยีที่ดูอ่อนวัยลง SLIC มองว่าที่นี่คือเมืองที่ความต่อเนื่องไม่ได้กลายเป็นความหยุดนิ่ง เปลือกประวัติศาสตร์ยังคงอุ้มชูชีวิตเมืองที่ทันสมัย เชื่อมต่อได้ และใช้งานได้จริงเมื่อเทียบกับที่อื่น",
      zh: "布拉加是葡萄牙最古老的城市之一，但它现在将宗教和历史深度与年轻的知识经济和技术概况结合起来。SLIC 将其解读为一座连续性并没有变成停滞的城市；历史悠久的外壳仍然承载着现代、互联且相对实用的城市生活。",
      ko: "브라가는 포르투갈에서 가장 오래된 도시 중 하나이지만, 이제는 종교적이고 역사적인 깊이와 더 젊은 지식 경제 및 기술 프로필을 결합합니다. SLIC는 이곳을 연속성이 침체로 변하지 않은 도시로 해석합니다. 역사적인 껍데기는 여전히 현대적이고 연결되어 있으며 비교적 사용 가능한 도시 생활을 담고 있습니다.",
      ja: "ブラガはポルトガル最古の都市の一つですが、現在では宗教的・歴史的な深みと、より若い知識経済やテクノロジーのプロファイルを結びつけています。SLICはここを、連続性が停滞になっていない都市として読み解きます。歴史的な外殻は、今なお近代的で、接続され、比較的使用しやすい都市生活を内包しています。"
    }
  },
  "il-tel-aviv": {
    heroLine: {
      en: "Beach-edge intensity with very little patience for stillness.",
      th: "ความเข้มข้นริมชายหาด ที่มีความอดทนต่อความนิ่งเฉยน้อยมาก",
      zh: "海滩边缘的强烈感，对静止缺乏耐心。",
      ko: "정적을 견디지 못하는 해변의 강렬함.",
      ja: "静けさへの忍耐を持たない、海辺の熱気。"
    },
    intro: {
      en: "Tel Aviv is Israel's economic and cultural engine, where startup ambition, nightlife, liberal self-image, and Mediterranean shoreline all feed a city running at permanently elevated speed. SLIC reads it as magnetic and highly capable, but also as a place where intensity is part of both the draw and the cost.",
      th: "เทลอาวีฟคือเครื่องยนต์ทางเศรษฐกิจและวัฒนธรรมของอิสราเอล ที่ซึ่งความทะเยอทะยานของสตาร์ทอัพ ชีวิตกลางคืน ภาพลักษณ์เสรีนิยม และแนวชายฝั่งเมดิเตอร์เรเนียน ล้วนหล่อเลี้ยงเมืองที่วิ่งด้วยความเร็วสูงอย่างถาวร SLIC มองว่าที่นี่มีเสน่ห์ดึงดูดและมีความสามารถสูง แต่ก็เป็นสถานที่ที่ความเข้มข้นเป็นทั้งจุดขายและต้นทุนที่ต้องจ่าย",
      zh: "特拉维夫是以色列的经济和文化引擎，在这里，创业的野心、夜生活、自由主义的自我形象以及地中海的海岸线都为一个以永久加速运转的城市提供养分。SLIC 将其解读为具有吸引力和高能力的城市，但同时，这里的强烈感既是吸引力的一部分，也是代价。",
      ko: "텔아비브는 이스라엘의 경제적, 문화적 원동력으로, 스타트업의 야망, 나이트라이프, 자유주의적인 자기 이미지, 그리고 지중해 해안선이 영구적으로 상승된 속도로 달리는 도시에 연료를 공급하는 곳입니다. SLIC는 이곳을 자석 같고 고도로 유능한 곳으로 해석하지만, 강렬함이 매력이자 대가인 곳이기도 합니다.",
      ja: "テルアビブはイスラエルの経済と文化のエンジンであり、スタートアップの野心、ナイトライフ、リベラルな自己イメージ、そして地中海の海岸線が、常に加速した速度で走る都市に燃料を供給しています。SLICはここを、磁力があり非常に有能であると同時に、その激しさが魅力の一部でもあり、代償でもある場所として読み解きます。"
    }
  },
  "us-chicago": {
    heroLine: {
      en: "Continental-scale America in one vertical frame.",
      th: "อเมริการะดับทวีป ในกรอบแนวตั้งเพียงหนึ่งเดียว",
      zh: "一个垂直框架内展现大陆规模的美国。",
      ko: "하나의 수직 프레임에 담긴 대륙 규모의 아메리카.",
      ja: "一つの垂直なフレームに収められた、大陸規模のアメリカ。"
    },
    intro: {
      en: "Chicago remains the great inland metropolis of the United States: finance, logistics, universities, architecture, rail, and lakefront spectacle all layered into one city with genuine global weight. SLIC reads it as a place of very high capability and cultural force whose challenge is converting that scale into broadly breathable daily life.",
      th: "ชิคาโกยังคงเป็นมหานครในแผ่นดินอันยิ่งใหญ่ของสหรัฐอเมริกา: การเงิน โลจิสติกส์ มหาวิทยาลัย สถาปัตยกรรม ทางรถไฟ และทัศนียภาพริมทะเลสาบ ล้วนซ้อนทับกันอยู่ในเมืองเดียวที่มีน้ำหนักระดับโลกอย่างแท้จริง SLIC มองว่าที่นี่เป็นสถานที่ที่มีความสามารถและพลังทางวัฒนธรรมสูงมาก ซึ่งความท้าทายก็คือการเปลี่ยนขนาดที่ใหญ่นั้นให้เป็นชีวิตประจำวันที่ผู้คนส่วนใหญ่หายใจได้สะดวกขึ้น",
      zh: "芝加哥仍然是美国伟大的内陆大都市：金融、物流、大学、建筑、铁路和湖滨奇观都叠加在一座具有真正全球分量的城市中。SLIC 将其解读为一个具有极高能力和文化影响力的地方，其挑战在于将这种规模转化为广泛透气的日常生活。",
      ko: "시카고는 여전히 미국의 위대한 내륙 대도시로 남아 있습니다. 금융, 물류, 대학, 건축, 철도, 호숫가의 장관이 모두 진정한 글로벌 무게감을 가진 하나의 도시에 겹쳐 있습니다. SLIC는 이곳을 매우 높은 역량과 문화적 힘을 가진 곳으로 해석하며, 이곳의 과제는 그 규모를 넓고 쾌적한 일상 생활로 전환하는 것입니다.",
      ja: "シカゴは依然としてアメリカの偉大な内陸の大都市です。金融、物流、大学、建築、鉄道、そして湖畔の壮観が、真のグローバルな重みを持つ一つの都市に重なり合っています。SLICはここを、非常に高い能力と文化的な力を持つ場所であり、その課題はその規模を広く息のつける日常生活へと変換することであると読み解きます。"
    }
  },
  "pt-porto": {
    heroLine: {
      en: "Granite, river edge, and a strong enough center to hold.",
      th: "หินแกรนิต ริมแม่น้ำ และศูนย์กลางที่แข็งแกร่งพอจะยึดเหนี่ยว",
      zh: "花岗岩、河畔，以及足够坚固以至于能支撑起来的中心。",
      ko: "화강암, 강변, 그리고 지탱할 만큼 충분히 강한 중심.",
      ja: "花崗岩、川辺、そして支えきれるほど強固な中心部。"
    },
    intro: {
      en: "Porto is northern Portugal's main city, built along the Douro in a way that keeps commerce, memory, and rough urban texture in continuous contact. SLIC reads it as a city where beauty is not just postcard value; it is tied to density, walkability, cultural continuity, and a more grounded cost structure than bigger Southern European magnets.",
      th: "ปอร์โตคือเมืองหลักทางตอนเหนือของโปรตุเกส สร้างขึ้นริมฝั่งแม่น้ำโดรู ในลักษณะที่รักษาย่านการค้า ความทรงจำ และพื้นผิวเมืองที่หยาบกระด้างให้สัมผัสกันอย่างต่อเนื่อง SLIC มองว่าที่นี่คือเมืองที่ความงามไม่ใช่แค่คุณค่าบนโปสการ์ด แต่ผูกติดอยู่กับความหนาแน่น การเดินเท้าได้ ความต่อเนื่องทางวัฒนธรรม และโครงสร้างต้นทุนที่ติดดินมากกว่าแม่เหล็กดึงดูดขนาดใหญ่ในยุโรปใต้",
      zh: "波尔图是葡萄牙北部的主要城市，建在杜罗河畔，使商业、记忆和粗糙的城市肌理保持持续的联系。SLIC 将其解读为一座美丽不仅具有明信片价值的城市；它与密度、适宜步行性、文化连续性以及比更大的南欧磁铁城市更脚踏实地的成本结构息息相关。",
      ko: "포르투는 포르투갈 북부의 중심 도시로, 도우루 강을 따라 지어져 상업, 기억, 그리고 거친 도시의 질감이 지속적으로 접촉을 유지합니다. SLIC는 이곳을 아름다움이 단지 엽서 속 가치에 불과하지 않은 도시로 해석합니다. 이는 밀도, 보행 편의성, 문화적 연속성, 그리고 더 큰 남유럽의 자석 도시들보다 더 현실적인 비용 구조와 연결되어 있습니다.",
      ja: "ポルトはポルトガル北部の主要都市であり、ドウロ川沿いに建設され、商業、記憶、そして荒々しい都市の質感が継続的に接している場所です。SLICはここを、美しさが単なる絵葉書の価値ではない都市として読み解きます。それは、密度、歩きやすさ、文化の連続性、そして南欧の大きな引力を持つ都市よりも地に足の着いたコスト構造と結びついています。"
    }
  },
  "ee-tallinn": {
    heroLine: {
      en: "A Baltic capital that stays wired and legible.",
      th: "เมืองหลวงบอลติกที่เชื่อมต่อถึงกันและอ่านง่าย",
      zh: "一个保持互联并清晰易读的波罗的海首都。",
      ko: "인터넷에 연결되어 있고 형태가 뚜렷한 발트해의 수도.",
      ja: "デジタル化され、形態が明確なバルト海の首都。"
    },
    intro: {
      en: "Tallinn is Estonia's capital and digital showcase, but what matters in SLIC terms is not branding alone; it is the way administrative competence, compact scale, and a still-readable historic core reinforce each other. The result is a city that feels technologically modern without losing urban intelligibility.",
      th: "ทาลลินน์คือเมืองหลวงและหน้าตาด้านดิจิทัลของเอสโตเนีย แต่สิ่งที่สำคัญในแง่ของ SLIC ไม่ใช่แค่การสร้างแบรนด์ แต่คือวิธีที่ความสามารถในการบริหาร ขนาดกะทัดรัด และแกนกลางประวัติศาสตร์ที่ยังอ่านออกได้ ช่วยเสริมซึ่งกันและกัน ผลลัพธ์คือเมืองที่ให้ความรู้สึกทันสมัยทางเทคโนโลยีโดยไม่สูญเสียความเข้าใจในความเป็นเมือง",
      zh: "塔林是爱沙尼亚的首都和数字化橱窗，但在 SLIC 看来，重要的不仅是品牌塑造；而是其行政能力、紧凑的规模和仍然清晰可读的历史核心相互强化的方式。结果是，这座城市在不失去城市可理解性的情况下让人感觉技术现代化。",
      ko: "탈린은 에스토니아의 수도이자 디지털 쇼케이스이지만, SLIC 관점에서 중요한 것은 브랜딩 자체가 아닙니다. 그것은 행정적 역량, 소형 규모, 그리고 여전히 뚜렷하게 읽히는 역사적 중심지가 서로를 강화하는 방식입니다. 그 결과 도시의 이해도를 잃지 않으면서 기술적으로 현대적으로 느껴지는 도시가 탄생했습니다.",
      ja: "タリンはエストニアの首都でありデジタルのショーケースですが、SLICの観点から重要なのはブランディングだけではありません。それは、行政の能力、コンパクトな規模、そして今なお読み取れる歴史的中心部が互いに強化し合うその方法です。その結果、都市の理解しやすさを失うことなく、技術的に現代的だと感じられる都市になっています。"
    }
  },
  "pl-torun": {
    heroLine: {
      en: "Historic Poland at a slower, better-kept urban speed.",
      th: "โปแลนด์ประวัติศาสตร์ ในจังหวะเมืองที่ช้าลงและได้รับการดูแลที่ดีกว่า",
      zh: "历史悠久的波兰，拥有较慢、保养得更好的城市节奏。",
      ko: "더 느리고 잘 보존된 도시 속도를 가진 역사적인 폴란드.",
      ja: "よりゆっくりと、よく手入れされた都市の速度を持つ、歴史的なポーランド。"
    },
    intro: {
      en: "Torun is one of Poland's great medieval cities, small enough that its historic grain still organizes everyday experience rather than merely surviving as scenery. SLIC reads it as a city where continuity, walkability, and manageable scale remain active assets in the lived structure of the place.",
      th: "ตอรุญคือหนึ่งในเมืองยุคกลางที่ยิ่งใหญ่ของโปแลนด์ มีขนาดเล็กพอที่กลิ่นอายประวัติศาสตร์จะยังคงจัดระเบียบประสบการณ์ในชีวิตประจำวัน แทนที่จะหลงเหลือไว้เป็นเพียงฉากหลัง SLIC มองว่าที่นี่คือเมืองที่ความต่อเนื่อง การเดินเท้าได้ และขนาดที่จัดการได้ ยังคงเป็นสินทรัพย์ที่มีชีวิตในโครงสร้างความเป็นอยู่ของสถานที่",
      zh: "托伦是波兰伟大的中世纪城市之一，它足够小，以至于其历史肌理仍然组织着日常体验，而不仅仅是作为风景存在。SLIC 将其解读为一座城市，在这里，连续性、适宜步行性和可管理的规模仍然是该地方生活结构中的活跃资产。",
      ko: "토룬은 폴란드의 위대한 중세 도시 중 하나로, 역사적인 흔적이 단순히 풍경으로 살아남는 것이 아니라 여전히 일상 경험을 구성할 만큼 충분히 작습니다. SLIC는 이곳을 연속성, 보행 편의성, 그리고 관리 가능한 규모가 그 장소의 살아있는 구조에서 여전히 활동적인 자산으로 남아 있는 도시로 해석합니다.",
      ja: "トルンはポーランドの偉大なる中世都市の一つであり、その歴史的側面が単に風景として生き残るのではなく、依然として日常の経験を構成するほど十分に小さいです。SLICはここを、連続性、歩きやすさ、そして管理可能な規模が、その場所の生きた構造における活動的な資産として残っている都市として読み解きます。"
    }
  },
  "kr-incheon": {
    heroLine: {
      en: "Korea's western gateway built on logistics and open horizon.",
      th: "ประตูสู่ตะวันตกของเกาหลี ที่สร้างขึ้นบนโลจิสติกส์และขอบฟ้าที่เปิดกว้าง",
      zh: "建立在物流和开阔视野上的韩国西部门户。",
      ko: "물류와 열린 지평선 위에 세워진 한국의 서부 관문.",
      ja: "物流と開かれた地平線の上に築かれた、韓国の西の玄関口。"
    },
    intro: {
      en: "Incheon is South Korea's major western port and airport city, a gateway metropolis whose identity comes from movement, reclamation, logistics, and the national role of connecting Korea outward. In SLIC terms it matters because infrastructure here is not ornamental; it is the city's main grammar and a real source of capability.",
      th: "อินชอนคือเมืองท่าและเมืองท่าอากาศยานฝั่งตะวันตกที่สำคัญของเกาหลีใต้ มหานครหน้าด่านที่อัตลักษณ์มาจากความเคลื่อนไหว การถมทะเล โลจิสติกส์ และบทบาทระดับชาติในการเชื่อมต่อเกาหลีสู่ภายนอก ในแง่ของ SLIC ที่นี่สำคัญเพราะโครงสร้างพื้นฐานไม่ใช่สิ่งประดับตกแต่ง แต่เป็นไวยากรณ์หลักของเมืองและแหล่งที่มาของความสามารถที่แท้จริง",
      zh: "仁川是韩国主要的西部港口和机场城市，一个门户大都市，其身份来自流动、填海造地、物流以及将韩国向外连接的国家作用。在 SLIC 看来，它的重要性在于这里的基础设施并非装饰品；它是这座城市的主要语法，也是能力的真正来源。",
      ko: "인천은 한국의 주요 서부 항구이자 공항 도시로, 이동, 간척, 물류, 그리고 한국을 밖으로 연결하는 국가적 역할에서 정체성이 비롯된 관문 대도시입니다. SLIC 관점에서 이곳이 중요한 이유는 인프라가 장식용이 아니기 때문입니다. 그것은 도시의 주요 문법이자 역량의 진정한 원천입니다.",
      ja: "仁川は韓国の主要な西部港湾・空港都市であり、そのアイデンティティは、移動、埋め立て、物流、そして韓国を外へ繋ぐという国家的役割から来ています。SLICの観点からは、ここのインフラストラクチャーは装飾ではないため重要です。それは都市の主要な文法であり、能力の真の源泉です。"
    }
  },
  "sg-singapore": {
    heroLine: {
      en: "The highest Capability score in the dataset. Gamma tier.",
      th: "คะแนนความสามารถสูงสุดในชุดข้อมูล จัดอยู่ในระดับ Gamma",
      zh: "数据集中最高的能力得分。Gamma 级别。",
      ko: "데이터 세트 내 최고 역량 점수. 감마 티어.",
      ja: "データセット内における最高の能力スコア。ガンマ・ティア。"
    },
    intro: {
      en: "Singapore scores 94.1 on Capability — the highest in this dataset by a significant margin, and a real reflection of port power, state capacity, transit, and administrative competence operating at near-maximum efficiency. It is Gamma tier. This is not a paradox or a scoring error; it is the index working exactly as intended. Gamma is where a city lands when it fails the Alpha floor: Community 38.4 against a required 40. The 1.6-point gap reflects what the data registers — that extraordinary administrative and economic competence does not automatically translate into the social warmth, civic openness, and everyday looseness the Community pillar measures. SLIC does not argue this is a bad city. It argues that 'extraordinary' and 'the median resident thrives here' are different claims, and both deserve to be said out loud.",
      th: "สิงคโปร์ได้คะแนนด้านความสามารถ (Capability) ถึง 94.1 — ซึ่งสูงที่สุดในชุดข้อมูลนี้อย่างทิ้งห่าง และเป็นภาพสะท้อนที่แท้จริงของพลังทางท่าเรือ ขีดความสามารถของรัฐ การขนส่งมวลชน และความสามารถในการบริหารที่ดำเนินงานได้อย่างมีประสิทธิภาพเกือบสูงสุด ทว่าเมืองนี้กลับถูกจัดอยู่ในระดับ Gamma นี่ไม่ใช่เรื่องย้อนแย้งหรือข้อผิดพลาดในการให้คะแนน แต่เป็นการทำงานของดัชนีอย่างที่ตั้งใจไว้ Gamma คือที่ที่เมืองหนึ่งจะลงจอดเมื่อไม่ผ่านเกณฑ์ขั้นต่ำของระดับ Alpha: โดยสิงคโปร์ได้คะแนนด้านชุมชน (Community) 38.4 จากที่ต้องการ 40 ช่องว่าง 1.6 คะแนนสะท้อนสิ่งที่ข้อมูลบันทึกไว้ — ว่าความสามารถทางการบริหารและเศรษฐกิจที่ไม่ธรรมดา ไม่ได้แปลว่าจะกลายเป็นความอบอุ่นทางสังคม ความเปิดกว้างของพลเมือง และความผ่อนคลายในชีวิตประจำวันที่เสาหลักด้านชุมชนใช้วัดเสมอไป SLIC ไม่ได้โต้แย้งว่าเมืองนี้เป็นเมืองที่แย่ แต่แย้งว่า 'ความไม่ธรรมดา' กับ 'ประชากรทั่วไปเติบโตได้ดีที่นี่' เป็นข้อเรียกร้องที่ต่างกัน และทั้งสองเรื่องนี้ก็สมควรที่จะถูกกล่าวออกมาดังๆ",
      zh: "新加坡的能力得分为 94.1——在本项目数据集中遥遥领先，真实反映了以接近最高效率运作的港口实力、国家能力、交通和行政能力。它是 Gamma 级别。这并非悖论，也不是评分错误；这正是该指数预期的运作方式。当一座城市未达到 Alpha 的底线时，就会落入 Gamma：其社区得分为 38.4，而要求为 40。这 1.6 分的差距反映了数据的记录——非凡的行政和经济能力并不会自动转化为社区支柱所衡量的社会温暖、公民开放度和日常宽松感。SLIC 并不认为这是一座糟糕的城市。它认为“非凡”和“普通居民在这里茁壮成长”是不同的概念，两者都值得被大声说出来。",
      ko: "싱가포르는 역량 부문에서 94.1점을 받았습니다. 이는 데이터 세트에서 큰 격차로 가장 높으며, 거의 최대 효율로 작동하는 항구 전력, 국가 역량, 교통 및 행정 능력을 진정으로 반영한 것입니다. 이 도시는 감마 티어입니다. 이것은 역설이나 채점 오류가 아닙니다. 지수가 정확히 의도된 대로 작동한 것입니다. 감마는 도시가 알파 기준을 충족하지 못할 때 도달하는 곳입니다. 커뮤니티 부문에서 필요한 40점 대비 38.4점을 받았습니다. 1.6점의 격차는 데이터가 기록하는 바를 반영합니다. 즉, 비범한 행정 및 경제 역량이 커뮤니티 기둥이 측정하는 사회적 따뜻함, 시민의 개방성, 일상의 여유로움으로 자동 전환되지는 않는다는 것입니다. SLIC는 이곳이 나쁜 도시라고 주장하지 않습니다. '비범함'과 '평범한 주민이 여기서 번창한다'는 것은 다른 주장이며, 둘 다 큰 소리로 말할 가치가 있다고 주장할 뿐입니다.",
      ja: "シンガポールは能力で94.1を獲得しました。これはこのデータセットにおいて群を抜いて高く、ほぼ最大の効率で稼働する港湾力、国家の能力、交通、そして行政能力の真の反映です。そしてそれはガンマ・ティアです。これは逆説でも採点ミスでもありません。指数がまさに意図された通りに機能しているのです。ガンマとは、アルファの基準を満たさなかった時に都市が着地する場所です。必要な40に対してコミュニティは38.4でした。この1.6ポイントの差は、データが記録していること、つまり並外れた行政的・経済的能力が、コミュニティの柱が測定する社会的温かさ、市民の開放性、日常の緩やかさに自動的に変換されるわけではないことを反映しています。SLICは、これが悪い都市だと主張しているわけではありません。「並外れている」ということと「平均的な住民がここで繁栄する」ということは別のものであり、その両方が大声で語られるに値すると主張しているのです。"
    }
  },
  "ch-zurich": {
    heroLine: {
      en: "Swiss order with global finance hiding in plain sight.",
      th: "ระเบียบแบบสวิส ที่มีศูนย์กลางการเงินโลกซ่อนอยู่อย่างโจ่งแจ้ง",
      zh: "瑞士秩序，全球金融隐藏在人们的视线中。",
      ko: "스위스의 질서, 평범한 풍경 속에 숨겨진 글로벌 금융.",
      ja: "スイスの秩序、見慣れた光景の中に隠されたグローバル金融。"
    },
    intro: {
      en: "Zurich is a city where banking, infrastructure, lakefront calm, and civic discipline all reinforce a sense of uncommon reliability. In SLIC terms it is not only about wealth; it is about how institutional order, mobility, and environmental quality combine into a daily experience that feels unusually low-friction.",
      th: "ซูริคเป็นเมืองที่การธนาคาร โครงสร้างพื้นฐาน ความสงบเงียบริมทะเลสาบ และวินัยพลเมือง ต่างก็เสริมสร้างความรู้สึกถึงความน่าเชื่อถือที่ไม่ธรรมดา ในแง่ของ SLIC มันไม่ใช่แค่เรื่องของความมั่งคั่งเท่านั้น แต่เป็นเรื่องของวิธีที่ความเป็นระเบียบของสถาบัน การเดินทางเคลื่อนที่ และคุณภาพสิ่งแวดล้อม ผสมผสานกันจนกลายเป็นประสบการณ์ประจำวันที่รู้สึกว่ามีแรงเสียดทานน้อยอย่างผิดปกติ",
      zh: "苏黎世是一座将银行业、基础设施、湖畔的宁静和公民纪律共同强化为一种不同寻常的可靠感的城市。在 SLIC 看来，这不仅关乎财富；还关乎制度秩序、流动性和环境质量如何结合成一种异常顺畅的日常体验。",
      ko: "취리히는 은행업, 인프라, 호숫가의 평온함, 시민의 규율이 모두 흔치 않은 신뢰감을 강화하는 도시입니다. SLIC의 관점에서 이것은 단지 부에 관한 것만이 아닙니다. 제도적 질서, 이동성, 환경의 질이 어떻게 결합되어 유난히 마찰이 적은 일상 경험을 제공하는지에 관한 것입니다.",
      ja: "チューリッヒは、銀行業務、インフラストラクチャー、湖畔の静けさ、そして市民の規律がすべて、並外れた信頼感を強化している都市です。SLICの観点からは、それは単に富に関するものだけではありません。制度の秩序、流動性、環境の質がどのように組み合わさって、異常なほど摩擦の少ない日常の経験になっているのかということです。"
    }
  },
  "dk-copenhagen": {
    heroLine: {
      en: "Welfare urbanism made legible at metropolitan scale.",
      th: "เมืองสวัสดิการที่อ่านออกได้ง่ายในระดับมหานคร",
      zh: "在大都市规模上清晰可见的福利城市主义。",
      ko: "대도시 규모에서 뚜렷하게 읽히는 복지 도시주의.",
      ja: "大都市の規模で明確に読み取れる福祉都市計画。"
    },
    intro: {
      en: "Copenhagen is one of the clearest examples of a northern European city where planning, mobility, public space, and welfare-state assumptions still visibly structure everyday life. SLIC reads it as a place where systems coherence is the point: not glamorous in the abstract, but deeply convincing in use.",
      th: "โคเปนเฮเกนเป็นหนึ่งในตัวอย่างที่ชัดเจนที่สุดของเมืองในยุโรปเหนือ ที่การวางผังเมือง การเดินทาง พื้นที่สาธารณะ และสมมติฐานของรัฐสวัสดิการยังคงจัดโครงสร้างชีวิตประจำวันให้เห็นได้อย่างชัดเจน SLIC มองว่านี่คือสถานที่ที่ความสอดคล้องของระบบเป็นประเด็นสำคัญ: ไม่ได้เลิศหรูในเชิงนามธรรม แต่สร้างความเชื่อมั่นอย่างลึกซึ้งเมื่อใช้งานจริง",
      zh: "哥本哈根是北欧城市中最清晰的例子之一，在这里，规划、流动性、公共空间和福利国家的假设仍然显而易见地构成了日常生活的结构。SLIC 将其解读为一个以系统连贯性为核心的地方：在抽象概念上并不耀眼，但在实际使用中极具说服力。",
      ko: "코펜하겐은 계획, 이동성, 공공 장소, 그리고 복지 국가의 전제가 여전히 일상 생활을 눈에 띄게 구성하는 북유럽 도시의 가장 명확한 예 중 하나입니다. SLIC는 이곳을 시스템의 일관성이 핵심인 장소로 해석합니다. 추상적으로는 화려하지 않지만, 실제 사용할 때 깊은 설득력을 지닙니다.",
      ja: "コペンハーゲンは、計画、流動性、公共空間、そして福祉国家の前提が今なお目に見える形で日常生活を構成している北欧都市の最も明確な例の一つです。SLICはここを、システムの首尾一貫性がポイントとなる場所として読み解きます。抽象的に華やかではありませんが、使用する際には深い説得力があります。"
    }
  },
  "kr-jeju-city": {
    heroLine: {
      en: "Volcanic Korea at a slower, more elemental pace.",
      th: "เกาหลีแห่งภูเขาไฟ ในจังหวะที่ช้าลงและเป็นธรรมชาติมากขึ้น",
      zh: "火山韩国，节奏更慢、更贴近自然。",
      ko: "더 느리고 더 근원적인 속도의 화산섬 한국.",
      ja: "よりゆっくりと、より根源的なペースで進む火山性の韓国。"
    },
    intro: {
      en: "Jeju is South Korea's main island province, shaped by volcanic geography, a distinct local culture, and a longstanding role as the country's natural and spiritual counterweight to the mainland's relentless pace. SLIC reads it as a city that earns its Alpha place not through density or output but through a combination of governance at island scale, cultural distinctiveness — the haenyeo diving tradition, the Jeju language, the UNESCO-listed craters — and a daily rhythm that never fully submitted to the Seoul compression model.",
      th: "เชจูเป็นจังหวัดที่เป็นเกาะหลักของเกาหลีใต้ ก่อร่างด้วยภูมิศาสตร์ภูเขาไฟ วัฒนธรรมท้องถิ่นที่โดดเด่น และบทบาทที่มีมาอย่างยาวนานในฐานะพื้นที่ถ่วงดุลทางธรรมชาติและจิตวิญญาณของประเทศ จากจังหวะที่เร่งรีบอย่างไม่ลดละของแผ่นดินใหญ่ SLIC มองว่าที่นี่คือเมืองที่ได้รับตำแหน่งระดับ Alpha ไม่ใช่ด้วยความหนาแน่นหรือผลผลิต แต่เกิดจากการผสมผสานระหว่างการปกครองในระดับเกาะ ความโดดเด่นทางวัฒนธรรม — ประเพณีดำน้ำของแฮนยอ ภาษาเชจู ปล่องภูเขาไฟที่ได้รับการขึ้นทะเบียนโดยยูเนสโก — และจังหวะชีวิตประจำวันที่ไม่เคยยอมจำนนต่อโมเดลการบีบอัดของโซลอย่างเต็มที่",
      zh: "济州岛是韩国主要的岛屿省份，由火山地理、独特的当地文化以及长期以来作为该国自然和精神平衡物以应对内陆无情节奏的作用而塑造。SLIC 将其解读为一座赢得 Alpha 地位的城市，不是通过密度或产出，而是通过岛屿规模的治理、文化独特性——海女潜水传统、济州语言、被联合国教科文组织列入名录的火山口——以及从未完全屈服于首尔压缩模式的日常节奏的结合。",
      ko: "제주도는 화산 지리, 독특한 지역 문화, 그리고 본토의 끈질긴 속도에 맞서는 국가의 자연적, 정신적 균형추로서의 오랜 역할로 형성된 한국의 주요 섬 지역입니다. SLIC는 이곳이 밀도나 산출량을 통해서가 아니라 섬 규모의 거버넌스, 문화적 독특성(해녀 잠수 전통, 제주어, 유네스코에 등재된 분화구), 그리고 서울의 압축 모델에 결코 완전히 굴복하지 않은 일상의 리듬의 결합을 통해 알파 등급을 획득한 도시로 해석합니다.",
      ja: "済州島は韓国の主要な島嶼州であり、火山性の地理、独特の地域文化、そして本土の容赦ないペースに対する国の自然的・精神的な釣り合い役としての長年の役割によって形成されています。SLICはここを、密度や生産高によってではなく、島規模のガバナンス、文化的な独自性（海女の素潜りの伝統、済州語、ユネスコに登録された火口）、そしてソウルの圧縮モデルに決して完全には屈しなかった日常のテンポの組み合わせによってアルファの地位を獲得した都市として読み解きます。"
    }
  },
  "au-perth": {
    heroLine: {
      en: "Australia's isolated west, built on space and coastal ease.",
      th: "ตะวันตกอันโดดเดี่ยวของออสเตรเลีย ที่สร้างขึ้นบนความกว้างใหญ่และความสบายริมชายฝั่ง",
      zh: "澳大利亚孤立的西部，建立在空间和沿海的悠闲之上。",
      ko: "공간과 해안의 여유를 바탕으로 세워진 호주의 고립된 서부.",
      ja: "空間と沿岸のくつろぎの上に築かれた、オーストラリアの孤立した西部。"
    },
    intro: {
      en: "Perth is the most isolated large city on earth by the standard measure — a fact that has shaped both its psychology and its offer. Built on mining-boom capital, Indian Ocean coastline, and an almost impractical abundance of space, Perth has spent the past decade building out university research, technology, and livability infrastructure that no longer needs to apologize for the distance. SLIC reads it as a city where the pressure curve stays genuinely low: warm, spacious, coastal, and now competent enough to matter beyond resource extraction.",
      th: "เพิร์ทคือเมืองใหญ่ที่โดดเดี่ยวที่สุดในโลกตามมาตรวัดมาตรฐาน — ซึ่งเป็นความจริงที่หล่อหลอมทั้งหลักจิตวิทยาและสิ่งที่เมืองนำเสนอ สร้างขึ้นบนเงินทุนจากยุคเหมืองแร่เฟื่องฟู แนวชายฝั่งมหาสมุทรอินเดีย และความอุดมสมบูรณ์ของพื้นที่ที่แทบจะเกินความจำเป็น เพิร์ทใช้เวลาทศวรรษที่ผ่านมาในการสร้างงานวิจัยในมหาวิทยาลัย เทคโนโลยี และโครงสร้างพื้นฐานเพื่อการอยู่อาศัยที่ทำให้ไม่ต้องคอยขอโทษสำหรับความห่างไกลอีกต่อไป SLIC มองว่าที่นี่คือเมืองที่กราฟความกดดันอยู่ในระดับต่ำอย่างแท้จริง: อบอุ่น กว้างขวาง ติดชายฝั่ง และตอนนี้มีความสามารถมากพอที่จะมีความสำคัญมากกว่าแค่การสกัดทรัพยากร",
      zh: "按照标准衡量，珀斯是地球上最孤立的大城市——这一事实塑造了它的心理和它所能提供的资源。珀斯建立在矿业繁荣的资本、印度洋海岸线和几乎不切实际的空间丰富性之上，在过去的十年里，它一直在建设大学研究、技术和宜居性基础设施，这些基础设施不再需要为距离而道歉。SLIC 将其解读为一座压力曲线保持在真正低水平的城市：温暖、宽敞、沿海，并且现在足够有能力在资源开采之外发挥重要作用。",
      ko: "퍼스는 표준 척도로 볼 때 지구상에서 가장 고립된 대도시이며, 이러한 사실은 도시의 심리와 도시가 제공하는 것을 모두 형성했습니다. 광산 붐 자본, 인도양 해안선, 그리고 거의 비현실적으로 풍부한 공간을 바탕으로 건설된 퍼스는 지난 10년 동안 더 이상 거리에 대해 변명할 필요가 없는 대학 연구, 기술 및 살기 좋은 인프라를 구축하는 데 시간을 보냈습니다. SLIC는 이곳을 압박 곡선이 진정으로 낮게 유지되는 도시로 해석합니다. 따뜻하고 넓으며 해안가에 위치하고 있으며 이제 자원 추출을 넘어서 중요할 만큼 충분히 유능합니다.",
      ja: "パースは標準的な尺度によれば地球上で最も孤立した大都市であり、その事実が都市の心理とその提供するものの両方を形成してきました。鉱業ブームの資本、インド洋の海岸線、そしてほとんど非現実的なほど豊富な空間の上に築かれたパースは、過去10年間を費やして、もはや距離について謝罪する必要のない大学の研究、テクノロジー、そして住みやすさのインフラストラクチャーを構築してきました。SLICはここを、圧力曲線が純粋に低く保たれている都市として読み解きます。暖かく、広々としており、沿岸に位置し、今や資源採掘を超えて重要となるのに十分な能力を持っています。"
    }
  },
  "jp-tokyo": {
    heroLine: {
      en: "Incomprehensible scale, kept almost entirely coherent.",
      th: "ขนาดที่เกินจะเข้าใจ แต่กลับรักษาความสอดคล้องกันไว้ได้เกือบทั้งหมด",
      zh: "难以理解的规模，却保持着几乎完全的连贯性。",
      ko: "이해할 수 없는 규모, 하지만 거의 완벽하게 일관성을 유지함.",
      ja: "理解を絶する規模でありながら、ほぼ完全な首尾一貫性を保つ。"
    },
    intro: {
      en: "Tokyo is the world's largest metropolitan area by any measure, a city of 37-million-plus that still manages to run on time, stay safe, feed itself extraordinarily well, and distribute a quality of urban experience that smaller cities cannot replicate. SLIC reads it as the definitive case of system competence at extreme scale — where transit, density, safety, and accumulated cultural production compound into something that has no real equivalent. The trade-offs are real: working hours, conformity pressure, and housing cost. But the system that delivers in return is equally without parallel.",
      th: "โตเกียวคือมหานครที่ใหญ่ที่สุดในโลกไม่ว่าจะวัดด้วยมาตรฐานใด เมืองที่มีประชากรกว่า 37 ล้านคนที่ยังคงจัดการให้รถไฟวิ่งตรงเวลา ปลอดภัย เลี้ยงปากท้องผู้คนได้เป็นอย่างดี และกระจายคุณภาพประสบการณ์เมืองที่เมืองเล็กๆ ไม่สามารถลอกเลียนแบบได้ SLIC มองว่าที่นี่คือกรณีศึกษาขั้นเด็ดขาดของความสามารถในเชิงระบบในสเกลสุดขั้ว — ที่ซึ่งการขนส่งมวลชน ความหนาแน่น ความปลอดภัย และผลผลิตทางวัฒนธรรมที่สะสมมา หลอมรวมกันเป็นสิ่งที่ไม่มีใครเทียบเคียงได้ แน่นอนว่าต้องมีสิ่งที่ต้องแลกเปลี่ยน: ชั่วโมงการทำงาน แรงกดดันที่ต้องทำตามบรรทัดฐาน และค่าที่อยู่อาศัย แต่ระบบที่ให้ผลตอบแทนกลับมาก็ไร้ซึ่งสิ่งใดเทียบเท่าเช่นกัน",
      zh: "无论以何种标准衡量，东京都是世界上最大的大都会区，这座拥有超过 3700 万人口的城市仍然能够准时运转、保持安全、吃得极好，并分配出较小城市无法复制的城市体验质量。SLIC 将其解读为极端规模下系统能力的决定性案例——在这里，交通、密度、安全和积累的文化成果复合成无与伦比的产物。代价是真实的：工作时间、从众压力和住房成本。但作为回报所提供的系统同样是无与伦比的。",
      ko: "도쿄는 어떤 척도로 보나 세계에서 가장 큰 대도시 지역으로, 3,700만 명 이상의 인구를 가진 도시임에도 불구하고 여전히 정시에 운행하고, 안전을 유지하며, 예외적으로 훌륭하게 먹여 살리고, 작은 도시들은 모방할 수 없는 품질의 도시 경험을 분배합니다. SLIC는 이곳을 극한 규모에서 시스템 역량의 결정적인 사례로 해석합니다. 교통, 밀도, 안전, 축적된 문화 생산이 결합되어 필적할 만한 것이 없는 무언가로 합쳐집니다. 노동 시간, 동조 압력, 주거 비용과 같은 트레이드오프는 현실입니다. 하지만 그 대가로 제공되는 시스템 또한 타의 추종을 불허합니다.",
      ja: "東京は、どの尺度で見ても世界最大の都市圏であり、3,700万人以上の人口を抱えながらも、定時運行、安全性、並外れて豊かな食を維持し、小規模な都市には真似できない質の高い都市体験を提供し続けている都市です。SLICはここを、極端な規模におけるシステム能力の決定的な事例として読み解きます。交通、密度、安全性、そして蓄積された文化的生産が複合して、他に類を見ないものを形成しています。労働時間、同調圧力、住宅コストなど、引き換えにしなければならないものも確かに存在します。しかし、それと引き換えに提供されるシステムもまた、並ぶものがありません。"
    }
  },

  "se-gothenburg": {
    heroLine: {
      en: "Industrial west Sweden with walkable human scale.",
      th: "สวีเดนตะวันตกที่เป็นอุตสาหกรรม ในสเกลที่เดินได้และเป็นมนุษย์",
      zh: "工业化的瑞典西部城市，步行可达，尺度宜人。",
      ko: "보행 친화적 규모의 산업 도시, 스웨덴 서부.",
      ja: "歩いて暮らせる人間的なスケール、工業都市スウェーデン西部。"
    },
    intro: {
      en: "Gothenburg is Sweden's second city and its most underrated: a working port town that has spent two decades converting Volvo-era industrial infrastructure into a dense, bike-networked, culturally active urban form. SLIC reads it as almost uniquely efficient — Viability at 100, strong Capability, and a Pressure score that reflects genuine low friction in daily life rather than just low prices.",
      th: "เยเทบอรีคือเมืองที่ใหญ่เป็นอันดับสองของสวีเดนและถูกมองข้ามที่สุด เป็นเมืองท่าที่ใช้เวลาสองทศวรรษเปลี่ยนโครงสร้างพื้นฐานอุตสาหกรรมยุค Volvo ให้กลายเป็นรูปแบบเมืองที่หนาแน่น เชื่อมต่อด้วยจักรยาน และมีชีวิตทางวัฒนธรรมที่คึกคัก SLIC อ่านค่าได้ว่าที่นี่มีประสิทธิภาพเกือบเป็นเอกลักษณ์ — Viability อยู่ที่ 100 Capability แข็งแกร่ง และคะแนน Pressure ที่สะท้อนความเสียดทานต่ำในชีวิตประจำวันอย่างแท้จริง ไม่ใช่แค่ราคาที่ถูก",
      zh: "哥德堡是瑞典第二大城市，也是最被低估的一座。这是一座正在运作的港口城市，花了二十年时间将沃尔沃时代的工业基础设施转变为密集的、以自行车网络连接的、充满文化活力的城市形态。SLIC 将其解读为近乎独一无二的高效城市——宜居性满分 100，能力得分强劲，压力分数反映的是日常生活中真正的低摩擦，而不仅仅是低物价。",
      ko: "예테보리는 스웨덴 제2의 도시이자 가장 과소평가된 도시입니다. 볼보 시대의 산업 인프라를 밀도 높고 자전거 네트워크로 연결된 문화적으로 활발한 도시 형태로 전환하는 데 20년을 보낸 항구 도시입니다. SLIC은 이 도시를 거의 독보적으로 효율적인 도시로 해석합니다. 생존 가능성 100점, 강력한 역량, 그리고 단순히 낮은 물가가 아닌 일상생활의 진정한 저마찰을 반영하는 압력 점수.",
      ja: "ヨーテボリはスウェーデン第2の都市であり、最も過小評価されている都市です。ボルボ時代の産業インフラを、高密度で自転車ネットワークで結ばれた文化的に活発な都市形態に転換するために20年を費やした港湾都市です。SLICは、ほぼ比類ない効率性を持つ都市として読み解いています。生活維持性100点、強力な能力スコア、そして単なる低物価ではなく日常生活の真の低摩擦を反映した圧力スコア。"
    }
  },
  "no-bergen": {
    heroLine: {
      en: "Norway's fjord city with the highest infrastructure reading.",
      th: "เมืองฟยอร์ดของนอร์เวย์ ที่มีคะแนนโครงสร้างพื้นฐานสูงที่สุด",
      zh: "挪威的峡湾城市，基础设施评分最高。",
      ko: "노르웨이의 피오르드 도시, 가장 높은 인프라 점수.",
      ja: "ノルウェーのフィヨルド都市、最高のインフラスコアを誇る。"
    },
    intro: {
      en: "Bergen is Norway's second city and first in Capability — a striking concentration of port infrastructure, university strength, and public services for a city of its size. SLIC records Viability at 100 and Pressure at 80.4, the highest pressure-liveability reading in this cohort; the fjord geography compresses Bergen into a walkable density that works against urban sprawl and for daily life.",
      th: "เบอร์เกนคือเมืองที่ใหญ่เป็นอันดับสองของนอร์เวย์และเป็นอันดับหนึ่งในด้าน Capability — เป็นการรวมตัวกันที่โดดเด่นของโครงสร้างพื้นฐานท่าเรือ ความแข็งแกร่งของมหาวิทยาลัย และบริการสาธารณะสำหรับเมืองขนาดนี้ SLIC บันทึก Viability ที่ 100 และ Pressure ที่ 80.4 ซึ่งเป็นค่าสูงสุดในกลุ่มนี้ ภูมิศาสตร์ฟยอร์ดบีบให้เบอร์เกนมีความหนาแน่นที่เดินได้ ซึ่งต้านทานการขยายตัวของเมืองและเอื้อต่อชีวิตประจำวัน",
      zh: "卑尔根是挪威第二大城市，同时也是能力维度的第一名——对于这一规模的城市来说，港口基础设施、大学实力和公共服务的高度集中令人印象深刻。SLIC 记录的宜居性为满分 100，城市压力得分 80.4，是本批次中压力-宜居性读数最高的城市；峡湾地形将卑尔根压缩成步行友好的高密度形态，对抗城市蔓延，有利于日常生活。",
      ko: "베르겐은 노르웨이 제2의 도시이자 능력 부문 1위입니다. 이 규모의 도시로서는 놀라운 수준의 항만 인프라, 대학 역량, 공공 서비스가 집중되어 있습니다. SLIC은 생존 가능성 100점, 압력 점수 80.4점을 기록했으며, 이는 이 코호트에서 가장 높은 압력-거주 적합성 수치입니다. 피오르드 지형이 베르겐을 보행 친화적 밀도로 압축시켜 도시 확산을 억제하고 일상생활에 유리한 환경을 만듭니다.",
      ja: "ベルゲンはノルウェー第2の都市であり、能力部門では1位です。この規模の都市としては、港湾インフラ、大学の強さ、公共サービスの驚くべき集積があります。SLICは生活維持性100点、圧力スコア80.4点を記録しており、このコホートで最も高い圧力-居住適合性の数値です。フィヨルドの地形がベルゲンを歩いて暮らせる密度に圧縮し、都市のスプロール化を抑制し日常生活に貢献しています。"
    }
  },
  "cz-prague": {
    heroLine: {
      en: "Central European density, Western tolerance, Eastern prices.",
      th: "ความหนาแน่นแบบยุโรปกลาง การยอมรับแบบตะวันตก และราคาแบบตะวันออก",
      zh: "中欧的密度，西方的包容，东方的价格。",
      ko: "중유럽의 밀도, 서유럽의 관용, 동유럽의 가격.",
      ja: "中欧の密度、西欧的な寛容さ、東欧的な価格。"
    },
    intro: {
      en: "Prague sits at the intersection that defines its SLIC reading: Community at 86.1 is the standout figure — a tolerance and social life score more typical of Scandinavian cities — combined with Viability at 90.6 that reflects still-affordable housing and costs relative to its Western European peers. The result is a city where the density of daily urban life is high but the monetary and social pressure of sustaining it is comparatively low.",
      th: "ปรากตั้งอยู่ที่จุดตัดที่กำหนดค่า SLIC ของมัน Community ที่ 86.1 เป็นตัวเลขที่โดดเด่น — คะแนนความอดทนและชีวิตทางสังคมที่พบบ่อยกว่าในเมืองสแกนดิเนเวีย — ผสมกับ Viability ที่ 90.6 ที่สะท้อนที่อยู่อาศัยและต้นทุนที่ยังเอื้อมถึงได้เมื่อเทียบกับเพื่อนบ้านในยุโรปตะวันตก ผลลัพธ์คือเมืองที่ความหนาแน่นของชีวิตเมืองประจำวันสูง แต่แรงกดดันทางการเงินและสังคมในการดำรงอยู่นั้นต่ำกว่าเมื่อเปรียบเทียบ",
      zh: "布拉格处于定义其 SLIC 读数的交汇点：社区得分 86.1 是最突出的数字——这一包容度和社会生活分数更像是斯堪的纳维亚城市的典型水平——加上宜居性 90.6，反映出相对于西欧同类城市仍然可以负担的住房和生活成本。结果是一个日常城市生活密度高，但维持生活的经济和社会压力相对较低的城市。",
      ko: "프라하는 SLIC 수치를 규정하는 교차점에 위치합니다. 커뮤니티 86.1은 가장 두드러진 수치로, 스칸디나비아 도시에서 더 흔히 볼 수 있는 관용성과 사회적 삶의 점수입니다. 여기에 서유럽 동급 도시 대비 여전히 저렴한 주거비와 생활비를 반영하는 생존 가능성 90.6이 결합됩니다. 결과적으로 일상 도시 생활의 밀도는 높지만, 이를 유지하는 경제적·사회적 압력은 상대적으로 낮은 도시입니다.",
      ja: "プラハは、そのSLICの読み方を規定する交差点に位置しています。コミュニティ86.1は際立った数字で、スカンジナビアの都市により典型的な寛容性と社会生活のスコアです。これに、西欧の同規模都市と比較してまだ手頃な住宅コストと生活費を反映する生活維持性90.6が組み合わさっています。その結果、日常の都市生活の密度は高いが、それを維持するための経済的・社会的な圧力は比較的低い都市が生まれています。"
    }
  },
  "au-melbourne": {
    heroLine: {
      en: "High infrastructure, high culture, high cost.",
      th: "โครงสร้างพื้นฐานสูง วัฒนธรรมสูง ต้นทุนสูง",
      zh: "高基础设施，高文化，高成本。",
      ko: "높은 인프라, 높은 문화, 높은 비용.",
      ja: "高いインフラ、高い文化、高いコスト。"
    },
    intro: {
      en: "Melbourne is Australia's cultural capital and, in SLIC terms, its most complete city: Capability and Viability both read above 92, reflecting strong infrastructure, education access, and a cost structure that — while expensive — is at least matched by wage levels and public services. The lower Pressure score (45.7) is the honest counterweight: Melbourne is dense, competitive, and housing-stressed in ways that Sydney and even Brisbane are now catching.",
      th: "เมลเบิร์นคือเมืองหลวงทางวัฒนธรรมของออสเตรเลีย และในแง่ของ SLIC คือเมืองที่สมบูรณ์ที่สุด Capability และ Viability ต่างอ่านค่าได้สูงกว่า 92 สะท้อนโครงสร้างพื้นฐานที่แข็งแกร่ง การเข้าถึงการศึกษา และโครงสร้างต้นทุนที่แม้จะแพง แต่ก็สอดคล้องกับระดับค่าจ้างและบริการสาธารณะ คะแนน Pressure ที่ต่ำกว่า (45.7) คือน้ำหนักถ่วงที่ตรงไปตรงมา เมลเบิร์นมีความหนาแน่น แข่งขันสูง และมีปัญหาที่อยู่อาศัยในแบบที่ซิดนีย์และแม้แต่บริสเบนกำลังตามมาทัน",
      zh: "墨尔本是澳大利亚的文化之都，也是 SLIC 体系中最完整的城市：能力和宜居性均超过 92 分，反映了强大的基础设施、教育获取渠道，以及虽然昂贵但至少与工资水平和公共服务相匹配的成本结构。较低的压力分数（45.7）是诚实的对冲：墨尔本的密度高、竞争激烈，住房压力已经是悉尼和布里斯班也在赶上的水平。",
      ko: "멜버른은 호주의 문화 수도이자 SLIC 기준으로 가장 완성도 높은 도시입니다. 역량과 생존 가능성 모두 92 이상으로, 강력한 인프라, 교육 접근성, 그리고 비싸더라도 임금 수준과 공공 서비스에 걸맞은 비용 구조를 반영합니다. 낮은 압력 점수(45.7)는 솔직한 역설입니다. 멜버른은 시드니는 물론 브리즈번도 따라잡고 있는 방식으로 밀도가 높고 경쟁적이며 주거 스트레스가 큽니다.",
      ja: "メルボルンはオーストラリアの文化首都であり、SLICにおける最も完成度の高い都市です。能力と生活維持性はともに92を超えており、強力なインフラ、教育へのアクセス、そして高価ではあるものの少なくとも賃金水準と公共サービスに見合ったコスト構造を反映しています。低い圧力スコア（45.7）は正直な対抗力です。メルボルンは、シドニーやブリスベンも追いつきつつある形で、密度が高く競争的で住宅ストレスを抱えた都市です。"
    }
  },
  "fi-helsinki": {
    heroLine: {
      en: "Nordic capital with exceptional institutional depth.",
      th: "เมืองหลวงนอร์ดิกที่มีความลึกของสถาบันยอดเยี่ยม",
      zh: "北欧首都，拥有卓越的制度深度。",
      ko: "뛰어난 제도적 깊이를 지닌 북유럽 수도.",
      ja: "卓越した制度的深みを持つ北欧の首都。"
    },
    intro: {
      en: "Helsinki is the most institutionally complete city in this batch: Capability at 94.5 reflects a concentration of transport, digital infrastructure, and public services that would be remarkable in a city twice the size. SLIC Viability also reads strong. The caveat is Pressure at 47.6 — Helsinki's combination of high wages and high costs lands it in a competitive cost-of-living band that the raw Viability score softens but does not erase.",
      th: "เฮลซิงกิคือเมืองที่สมบูรณ์ที่สุดในด้านสถาบันในชุดนี้ Capability ที่ 94.5 สะท้อนการกระจุกตัวของระบบขนส่ง โครงสร้างพื้นฐานดิจิทัล และบริการสาธารณะที่จะโดดเด่นในเมืองที่ใหญ่กว่าสองเท่า SLIC Viability ก็อ่านค่าได้ดีเช่นกัน จุดสังเกตคือ Pressure ที่ 47.6 — การผสมผสานค่าจ้างสูงและต้นทุนสูงของเฮลซิงกิทำให้อยู่ในแถบค่าครองชีพที่แข่งขันกัน ซึ่งคะแนน Viability ดิบช่วยลดลงได้บ้างแต่ไม่ได้ลบล้าง",
      zh: "赫尔辛基是本批次制度最为完善的城市：能力得分 94.5 体现了交通、数字基础设施和公共服务的高度集中，对于一个规模翻倍的城市来说都会令人印象深刻。SLIC 宜居性同样表现强劲。需要注意的是压力分数 47.6——赫尔辛基高工资与高成本的组合使其处于具有竞争性的生活成本区间，原始宜居性分数有所缓和但并未消除这一压力。",
      ko: "헬싱키는 이 배치에서 제도적으로 가장 완성도 높은 도시입니다. 역량 94.5는 규모가 두 배인 도시에서도 주목받을 만한 교통, 디지털 인프라, 공공 서비스의 집약을 반영합니다. SLIC 생존 가능성도 강세를 보입니다. 주의할 점은 압력 47.6입니다. 헬싱키의 고임금과 고비용의 조합은 원시 생존 가능성 점수가 완화하긴 하지만 지우지는 못하는 경쟁적인 생활비 구간에 위치합니다.",
      ja: "ヘルシンキはこのバッチで制度的に最も完成度の高い都市です。能力94.5は、2倍の規模の都市でも注目されるであろう交通、デジタルインフラ、公共サービスの集積を反映しています。SLICの生活維持性も強い数値を示しています。注意すべきは圧力47.6です。ヘルシンキの高賃金と高コストの組み合わせは、元の生活維持性スコアが緩和するものの消すことのない、競争的な生活コスト帯に位置することになります。"
    }
  },
  "nz-christchurch": {
    heroLine: {
      en: "New Zealand's rebuilt city is now its most legible.",
      th: "เมืองที่สร้างใหม่ของนิวซีแลนด์ กลายเป็นเมืองที่อ่านง่ายที่สุด",
      zh: "新西兰的重建城市，如今成为最易读懂的城市。",
      ko: "뉴질랜드의 재건 도시, 이제 가장 알아보기 쉬운 도시.",
      ja: "ニュージーランドの再建都市は、今や最も分かりやすい都市。"
    },
    intro: {
      en: "Christchurch rebuilt from two major earthquakes between 2010 and 2011, and what emerged is one of the most planned and walkable cities in the country. SLIC records strong Viability and solid Capability on the strength of the rebuilt infrastructure; Creative remains the lowest pillar, which is honest — the city's cultural identity is still consolidating. The Pressure score of 52.0 reflects a city that is affordable and low-friction relative to Auckland or Wellington.",
      th: "ไครสต์เชิร์ชสร้างใหม่จากแผ่นดินไหวครั้งใหญ่สองครั้งระหว่างปี 2553 ถึง 2554 และสิ่งที่เกิดขึ้นคือหนึ่งในเมืองที่มีการวางแผนและเดินได้ดีที่สุดในประเทศ SLIC บันทึก Viability ที่แข็งแกร่งและ Capability ที่มั่นคงจากพลังของโครงสร้างพื้นฐานที่สร้างใหม่ Creative ยังคงเป็นเสาหลักที่ต่ำที่สุด ซึ่งสะท้อนความจริง — อัตลักษณ์ทางวัฒนธรรมของเมืองยังอยู่ในช่วงรวมตัว คะแนน Pressure ที่ 52.0 สะท้อนเมืองที่เอื้อมถึงได้และมีความเสียดทานต่ำเมื่อเทียบกับโอ๊คแลนด์หรือเวลลิงตัน",
      zh: "基督城从2010年至2011年的两次大地震中重建而来，由此诞生的是该国规划最完善、步行体验最佳的城市之一。SLIC 记录了凭借重建基础设施所展现的强劲宜居性和扎实的能力得分；创意依然是最低的维度，这是诚实的反映——这座城市的文化身份仍在整合之中。压力得分 52.0 反映了相对于奥克兰或惠灵顿而言价格亲民、摩擦较少的城市特质。",
      ko: "크라이스트처치는 2010년과 2011년 사이의 두 차례 대지진에서 재건되었으며, 그 결과는 뉴질랜드에서 가장 계획적이고 도보 친화적인 도시 중 하나입니다. SLIC은 재건된 인프라를 바탕으로 강력한 생존 가능성과 탄탄한 역량을 기록합니다. 창의성은 여전히 가장 낮은 기둥인데, 이는 솔직한 반영입니다—도시의 문화적 정체성은 아직 정립 중입니다. 압력 점수 52.0은 오클랜드나 웰링턴 대비 부담 없고 마찰이 적은 도시를 반영합니다.",
      ja: "クライストチャーチは2010年から2011年にかけての2度の大地震から再建され、生まれたのは国内で最も計画的で歩きやすい都市の一つです。SLICは、再建されたインフラの強みを背景に強力な生活維持性と確かな能力スコアを記録しています。創造性は依然として最も低い柱であり、これは正直な反映です—都市の文化的アイデンティティはまだ確立の途上にあります。圧力スコア52.0は、オークランドやウェリントンと比べて手頃で摩擦の少ない都市を反映しています。"
    }
  },
  "ca-toronto": {
    heroLine: {
      en: "North America's most diverse city, high performing and housing-pressured.",
      th: "เมืองที่หลากหลายที่สุดของอเมริกาเหนือ ประสิทธิภาพสูงและที่อยู่อาศัยตึงตัว",
      zh: "北美最多元化的城市，高绩效，住房压力大。",
      ko: "북미에서 가장 다양한 도시, 높은 성과와 주거 부담.",
      ja: "北米で最も多様な都市、高パフォーマンスと住宅圧力。"
    },
    intro: {
      en: "Toronto is Canada's financial and cultural capital, and its Community score of 80.4 is the number that explains the city: diversity metrics, tolerance scores, and civic social life compound to produce one of the highest community readings in the index outside Scandinavia. Capability reads at 84.0 on solid transit and institutional infrastructure. The Pressure score of 50.4 is the honest constraint — Toronto's housing market is among the most pressured in the anglophone world, and the Viability score of 94.9 reflects wages and purchasing power, not ease of entry.",
      th: "โตรอนโตคือเมืองหลวงทางการเงินและวัฒนธรรมของแคนาดา และคะแนน Community ที่ 80.4 คือตัวเลขที่อธิบายเมืองนี้ ตัวชี้วัดความหลากหลาย คะแนนความอดทน และชีวิตทางสังคมของพลเมืองรวมกันสร้างหนึ่งในค่า community ที่สูงที่สุดในดัชนีนอกกลุ่มสแกนดิเนเวีย Capability อ่านค่าได้ที่ 84.0 จากระบบขนส่งและโครงสร้างพื้นฐานสถาบันที่มั่นคง คะแนน Pressure ที่ 50.4 คือข้อจำกัดที่ตรงไปตรงมา — ตลาดที่อยู่อาศัยของโตรอนโตอยู่ในกลุ่มที่มีแรงกดดันมากที่สุดในโลกที่พูดภาษาอังกฤษ และคะแนน Viability ที่ 94.9 สะท้อนค่าจ้างและกำลังซื้อ ไม่ใช่ความง่ายในการเข้าถึง",
      zh: "多伦多是加拿大的金融和文化首都，其社区得分 80.4 正是解读这座城市的关键数字：多元化指标、包容度分数和公民社会生活叠加，产生了斯堪的纳维亚以外指数中最高的社区读数之一。能力得分 84.0，依托于扎实的交通和机构基础设施。压力得分 50.4 是诚实的制约因素——多伦多的住房市场是英语世界压力最大的市场之一，而宜居性得分 94.9 反映的是工资和购买力，而非进入门槛的高低。",
      ko: "토론토는 캐나다의 금융 및 문화 수도이며, 커뮤니티 점수 80.4는 이 도시를 설명하는 숫자입니다. 다양성 지표, 관용성 점수, 시민 사회 생활이 복합적으로 작용하여 스칸디나비아 외 지역에서 지수 내 최고 수준의 커뮤니티 수치 중 하나를 기록합니다. 역량은 탄탄한 대중교통과 기관 인프라를 바탕으로 84.0을 기록합니다. 압력 점수 50.4는 솔직한 제약 조건입니다. 토론토의 주택 시장은 영어권 세계에서 가장 압박이 심한 시장 중 하나이며, 생존 가능성 점수 94.9는 접근 용이성이 아닌 임금과 구매력을 반영합니다.",
      ja: "トロントはカナダの金融・文化の首都であり、コミュニティスコア80.4はこの都市を説明する数字です。多様性の指標、寛容性スコア、市民社会生活が組み合わさって、スカンジナビア以外では指数内で最も高いコミュニティ数値の一つを生み出しています。能力は確かな交通と制度的インフラを背景に84.0を記録しています。圧力スコア50.4は正直な制約です。トロントの住宅市場は英語圏で最も圧力がかかっている市場の一つであり、生活維持性スコア94.9は賃金と購買力を反映しており、参入の容易さではありません。"
    }
  },
  "au-brisbane": {
    heroLine: {
      en: "Queensland's capital building genuine cultural infrastructure.",
      th: "เมืองหลวงควีนส์แลนด์ที่กำลังสร้างโครงสร้างพื้นฐานทางวัฒนธรรมอย่างแท้จริง",
      zh: "昆士兰首府，正在构建真实的文化基础设施。",
      ko: "진정한 문화 인프라를 구축 중인 퀸즐랜드 주도.",
      ja: "本物の文化インフラを築きつつあるクイーンズランド州都。"
    },
    intro: {
      en: "Brisbane was long treated as the easygoing lesser sibling of Sydney and Melbourne, but its selection as 2032 Olympic host has accelerated what was already a genuine cultural shift. SLIC scores reflect the national Australian quality baseline — Capability at 92.4, Viability at 92.7 — while Brisbane's Creative score of 54.4 slightly outpaces Adelaide and Hobart, recording a city that has begun building cultural infrastructure rather than exporting talent south.",
      th: "บริสเบนถูกมองว่าเป็นน้องที่ผ่อนคลายกว่าของซิดนีย์และเมลเบิร์นมาช้านาน แต่การได้รับเลือกเป็นเจ้าภาพโอลิมปิก 2032 ได้เร่งให้สิ่งที่เป็นการเปลี่ยนแปลงทางวัฒนธรรมที่แท้จริงก้าวเร็วขึ้น คะแนน SLIC สะท้อนมาตรฐานคุณภาพระดับชาติออสเตรเลีย — Capability ที่ 92.4 Viability ที่ 92.7 — ขณะที่คะแนน Creative ของบริสเบนที่ 54.4 เพิ่มขึ้นเล็กน้อยเหนืออาดีเลดและโฮบาร์ต บันทึกเมืองที่เริ่มสร้างโครงสร้างพื้นฐานทางวัฒนธรรมแทนที่จะส่งออกความสามารถไปทางใต้",
      zh: "布里斯班长期以来被视为悉尼和墨尔本的悠闲小兄弟，但其入选 2032 年奥运会主办城市加速了一场已在进行的真实文化转型。SLIC 得分反映了澳大利亚全国质量基准——能力 92.4，宜居性 92.7——而布里斯班的创意得分 54.4 略高于阿德莱德和霍巴特，记录了一座已开始构建文化基础设施而非向南输送人才的城市。",
      ko: "브리즈번은 오랫동안 시드니와 멜버른의 느긋한 동생으로 여겨져 왔지만, 2032년 올림픽 개최지 선정이 이미 진행 중이던 진정한 문화적 변화를 가속화했습니다. SLIC 점수는 호주 국가 품질 기준을 반영합니다. 역량 92.4, 생존 가능성 92.7, 그리고 브리즈번의 창의성 점수 54.4는 애들레이드와 호바트를 약간 앞서며 남쪽으로 인재를 수출하는 대신 문화 인프라를 구축하기 시작한 도시를 기록합니다.",
      ja: "ブリスベンは長い間、シドニーとメルボルンののんびりした弟分として扱われてきましたが、2032年オリンピックの開催地選定が、すでに進行していた真の文化的転換を加速させました。SLICスコアはオーストラリア全国の品質基準を反映しています。能力92.4、生活維持性92.7、そしてブリスベンの創造性スコア54.4はアデレードとホバートを若干上回り、南に人材を輸出するのではなく文化インフラを構築し始めた都市を記録しています。"
    }
  },
  "au-adelaide": {
    heroLine: {
      en: "Australia's festival city at a more sustainable scale.",
      th: "เมืองเทศกาลของออสเตรเลียในสเกลที่ยั่งยืนกว่า",
      zh: "澳大利亚的节庆城市，规模更可持续。",
      ko: "더 지속 가능한 규모의 호주 축제 도시.",
      ja: "より持続可能な規模を持つオーストラリアのフェスティバル都市。"
    },
    intro: {
      en: "Adelaide consistently outperforms its population size on quality-of-life measures, and SLIC reflects this: the city sits one place below Brisbane on identical national infrastructure metrics but edges ahead on Pressure (51.3), reflecting lower housing costs and shorter commute times. Creative at 49.2 is honest about the arts calendar being event-driven rather than sustained by a deep year-round ecosystem. The scale is the point — Adelaide is a complete city that costs less to maintain.",
      th: "แอดิเลดทำผลงานได้ดีกว่าขนาดประชากรในด้านคุณภาพชีวิตอย่างสม่ำเสมอ และ SLIC สะท้อนสิ่งนี้ เมืองนี้อยู่หนึ่งอันดับต่ำกว่าบริสเบนบนตัวชี้วัดโครงสร้างพื้นฐานระดับชาติที่เหมือนกัน แต่นำหน้าเล็กน้อยในด้าน Pressure (51.3) สะท้อนต้นทุนที่อยู่อาศัยที่ต่ำกว่าและเวลาเดินทางที่สั้นกว่า Creative ที่ 49.2 สะท้อนความจริงว่าปฏิทินศิลปะขับเคลื่อนด้วยกิจกรรมมากกว่าระบบนิเวศตลอดทั้งปีที่ยั่งยืน สเกลคือจุดสำคัญ — แอดิเลดเป็นเมืองที่สมบูรณ์ซึ่งมีต้นทุนในการดูแลรักษาต่ำกว่า",
      zh: "阿德莱德在生活质量衡量指标上始终超越其人口规模，SLIC 也印证了这一点：这座城市在相同的全国基础设施指标上比布里斯班低一位，但在压力得分上（51.3）略占优势，反映出更低的住房成本和更短的通勤时间。创意得分 49.2 如实呈现了艺术日历以活动驱动为主，而非由全年深度生态系统支撑的现实。规模本身就是核心——阿德莱德是一座完整的城市，维持成本更低。",
      ko: "애들레이드는 삶의 질 지표에서 일관되게 인구 규모를 초과 달성하며, SLIC도 이를 반영합니다. 이 도시는 동일한 국가 인프라 지표에서 브리즈번보다 한 단계 아래에 위치하지만, 더 낮은 주거 비용과 짧은 통근 시간을 반영하는 압력(51.3)에서는 앞섭니다. 창의성 49.2는 예술 달력이 연중 지속적인 생태계가 아닌 이벤트 중심임을 솔직하게 나타냅니다. 규모가 핵심입니다. 애들레이드는 유지 비용이 더 낮은 완전한 도시입니다.",
      ja: "アデレードは人口規模に対して一貫して生活の質の指標で優れた成績を収めており、SLICもこれを反映しています。この都市は同一の全国インフラ指標ではブリスベンより一つ下に位置しますが、圧力スコア（51.3）ではわずかに上回り、より低い住宅コストと短い通勤時間を反映しています。創造性49.2は、年間を通じた深いエコシステムではなく、イベント駆動型の芸術カレンダーであることを正直に示しています。規模が重要なのです。アデレードは維持コストがより低い完全な都市です。"
    }
  },
  "ca-vancouver": {
    heroLine: {
      en: "The most beautiful city in the index, under the most housing pressure.",
      th: "เมืองที่สวยงามที่สุดในดัชนี ภายใต้แรงกดดันด้านที่อยู่อาศัยสูงที่สุด",
      zh: "指数中最美丽的城市，承受着最大的住房压力。",
      ko: "지수에서 가장 아름다운 도시, 가장 큰 주거 압력 하에.",
      ja: "インデックスで最も美しい都市、最大の住宅圧力を抱える。"
    },
    intro: {
      en: "Vancouver's SLIC reading is split by one number: Pressure at 45.1 is the lowest in the Canadian pair, and it reflects what residents already know — the city's natural setting and Pacific-Asian cultural density have attracted demand that the housing supply has never adequately absorbed. Viability at 94.9 records national purchasing power, not local affordability. The counterweights are genuine: Community at 78.6 reflects tolerance and civic culture competitive with much of Northern Europe, and Capability infrastructure is solid throughout.",
      th: "ค่า SLIC ของแวนคูเวอร์แบ่งด้วยตัวเลขหนึ่ง Pressure ที่ 45.1 เป็นค่าต่ำสุดในคู่แคนาดา และสะท้อนสิ่งที่ผู้อยู่อาศัยรู้ดีอยู่แล้ว — สภาพแวดล้อมทางธรรมชาติและความหนาแน่นทางวัฒนธรรมเอเชีย-แปซิฟิกของเมืองดึงดูดความต้องการที่อุปทานที่อยู่อาศัยไม่เคยรองรับได้อย่างเพียงพอ Viability ที่ 94.9 บันทึกกำลังซื้อระดับชาติ ไม่ใช่ความสามารถในการซื้อในพื้นที่ น้ำหนักถ่วงเป็นของจริง Community ที่ 78.6 สะท้อนความอดทนและวัฒนธรรมพลเมืองที่แข่งขันได้กับยุโรปเหนือ และโครงสร้างพื้นฐาน Capability มั่นคงตลอด",
      zh: "温哥华的 SLIC 读数被一个数字一分为二：压力得分 45.1 是加拿大两座城市中最低的，它折射出居民早已知晓的事实——这座城市的自然环境和太平洋-亚洲文化密度吸引了住房供应从未能充分消化的需求。宜居性 94.9 记录的是全国购买力，而非本地可负担性。对冲因素是真实存在的：社区得分 78.6 反映了可与北欧大部分地区相媲美的包容性和公民文化，能力基础设施也全面扎实。",
      ko: "밴쿠버의 SLIC 수치는 하나의 숫자로 나뉩니다. 압력 45.1은 캐나다 쌍 중 가장 낮으며, 주민들이 이미 알고 있는 사실을 반영합니다. 도시의 자연환경과 태평양-아시아 문화 밀도가 주택 공급이 한 번도 충분히 흡수하지 못한 수요를 끌어들였습니다. 생존 가능성 94.9는 지역 내 주거 접근성이 아닌 국가 구매력을 기록합니다. 대응 요소는 진실합니다. 커뮤니티 78.6은 북유럽 대부분과 경쟁하는 관용성과 시민 문화를 반영하며, 역량 인프라는 전반적으로 탄탄합니다.",
      ja: "バンクーバーのSLICの読み値は一つの数字で分かれます。圧力45.1はカナダの2都市の中で最も低く、住民がすでに知っていることを反映しています。都市の自然環境とパシフィック・アジアの文化的密度が、住宅供給がかつて十分に吸収できなかった需要を引き付けました。生活維持性94.9は地元の手頃さではなく、全国的な購買力を記録しています。対抗力は本物です。コミュニティ78.6は北欧の多くの地域と競争力のある寛容性と市民文化を反映しており、能力インフラは全体的に堅実です。"
    }
  },
  "nz-dunedin": {
    heroLine: {
      en: "New Zealand's most affordable university city.",
      th: "เมืองมหาวิทยาลัยที่เอื้อมถึงได้มากที่สุดของนิวซีแลนด์",
      zh: "新西兰最具可负担性的大学城。",
      ko: "뉴질랜드에서 가장 저렴한 대학 도시.",
      ja: "ニュージーランドで最も手頃な大学都市。"
    },
    intro: {
      en: "Dunedin is New Zealand's most affordable liveable city: a university town on the South Island with strong national public infrastructure and housing costs that other NZ cities cannot match. SLIC Creative at 37.1 is the lowest score in this batch, which is honest — cultural output correlates with student-town programming rather than a sustained commercial arts industry. Pressure at 56.8 is the stand-out reading: Dunedin is genuinely low-friction in a way that Wellington and Auckland no longer are.",
      th: "ดูนีดินคือเมืองที่เอื้อมถึงได้มากที่สุดในนิวซีแลนด์ เป็นเมืองมหาวิทยาลัยบนเกาะใต้ที่มีโครงสร้างพื้นฐานสาธารณะระดับชาติที่แข็งแกร่งและต้นทุนที่อยู่อาศัยที่เมืองอื่นในนิวซีแลนด์ไม่สามารถเทียบได้ SLIC Creative ที่ 37.1 เป็นคะแนนต่ำสุดในชุดนี้ ซึ่งสะท้อนความจริง — ผลผลิตทางวัฒนธรรมสอดคล้องกับการเป็นเมืองนักศึกษามากกว่าอุตสาหกรรมศิลปะเชิงพาณิชย์ที่ยั่งยืน Pressure ที่ 56.8 เป็นค่าที่โดดเด่น ดูนีดินมีความเสียดทานต่ำอย่างแท้จริงในแบบที่เวลลิงตันและโอ๊คแลนด์ไม่มีอีกต่อไป",
      zh: "但尼丁是新西兰最具可负担性的宜居城市：南岛的大学城，拥有强大的全国公共基础设施，以及其他新西兰城市无法比拟的住房成本。SLIC 创意得分 37.1 是本批次最低的，这是诚实的反映——文化产出与学生城市的活动安排相关，而非由持续的商业艺术产业支撑。压力得分 56.8 是最突出的数字：但尼丁真正低摩擦的程度是惠灵顿和奥克兰已无法企及的。",
      ko: "더니든은 뉴질랜드에서 가장 부담 없이 살 수 있는 도시입니다. 남섬에 위치한 대학 도시로, 강력한 국가 공공 인프라와 다른 뉴질랜드 도시들이 따라올 수 없는 주거 비용을 자랑합니다. SLIC 창의성 37.1은 이 배치에서 가장 낮은 점수로, 솔직한 반영입니다. 문화 산출물은 지속적인 상업 예술 산업이 아닌 대학 도시 특성과 연관됩니다. 압력 56.8은 두드러진 수치입니다. 더니든은 웰링턴과 오클랜드가 더 이상 그렇지 않은 방식으로 진정으로 마찰이 적습니다.",
      ja: "ダニーデンはニュージーランドで最も手頃に暮らせる都市です。南島の大学都市で、強力な全国公共インフラと他のニュージーランドの都市が追いつけない住宅コストを持っています。SLIC創造性37.1はこのバッチで最も低いスコアであり、正直な反映です。文化的産出は持続的な商業芸術産業ではなく、学生都市のプログラミングと相関しています。圧力56.8は際立った数値です。ダニーデンはウェリントンやオークランドがもはやそうではない形で、真に低摩擦です。"
    }
  },
  "nz-wellington": {
    heroLine: {
      en: "New Zealand's capital: fully functional, compact, and windy.",
      th: "เมืองหลวงนิวซีแลนด์ ทำหน้าที่สมบูรณ์ กระชับ และลมแรง",
      zh: "新西兰首都：功能完备，紧凑，风大。",
      ko: "뉴질랜드 수도: 완전히 기능하고, 아담하고, 바람 많은.",
      ja: "ニュージーランドの首都：完全に機能的でコンパクト、そして風が強い。"
    },
    intro: {
      en: "Wellington is the smallest capital city in the OECD by population, and that scale is the thesis: a fully functional national capital — government, courts, universities, Te Papa, major international airport — in a walkable coastal form. SLIC Creative at 48.8 reflects a modest but real film and digital industry alongside government-adjacent creative services. Pressure at 45.5 reads lower than Dunedin, reflecting Wellington's tighter housing stock relative to its economic density.",
      th: "เวลลิงตันคือเมืองหลวงที่มีประชากรน้อยที่สุดใน OECD และขนาดนั้นคือวิทยานิพนธ์ เมืองหลวงระดับชาติที่ทำหน้าที่สมบูรณ์ — รัฐบาล ศาล มหาวิทยาลัย Te Papa สนามบินนานาชาติหลัก — ในรูปแบบชายฝั่งที่เดินได้ SLIC Creative ที่ 48.8 สะท้อนอุตสาหกรรมภาพยนตร์และดิจิทัลที่ไม่ใหญ่โตแต่มีอยู่จริง ควบคู่กับบริการสร้างสรรค์ที่อยู่ใกล้รัฐบาล Pressure ที่ 45.5 อ่านค่าได้ต่ำกว่าดูนีดิน สะท้อนสต็อกที่อยู่อาศัยที่แน่นขนัดกว่าของเวลลิงตันเมื่อเทียบกับความหนาแน่นทางเศรษฐกิจ",
      zh: "惠灵顿是经合组织中人口最少的首都城市，而这一规模正是其核心论点：一座功能完备的国家首都——政府机构、法院、大学、新西兰国家博物馆、主要国际机场——以步行可达的滨海形态呈现。SLIC 创意得分 48.8 反映了规模不大但真实存在的电影和数字产业，以及毗邻政府的创意服务业。压力得分 45.5 低于但尼丁，反映了惠灵顿住房存量相对于其经济密度而言较为紧张的状况。",
      ko: "웰링턴은 OECD에서 인구 기준으로 가장 작은 수도이며, 그 규모가 핵심 논거입니다. 정부, 법원, 대학교, 테 파파, 주요 국제공항 등 완전히 기능하는 국가 수도가 걸어 다닐 수 있는 해안 형태로 압축되어 있습니다. SLIC 창의성 48.8은 정부 인접 창의 서비스와 함께 작지만 실질적인 영화 및 디지털 산업을 반영합니다. 압력 45.5는 더니든보다 낮게 읽히며, 경제적 밀도 대비 웰링턴의 빡빡한 주택 재고를 반영합니다.",
      ja: "ウェリントンはOECDで人口が最も少ない首都都市であり、そのスケールが論点です。政府、裁判所、大学、テ・パパ、主要国際空港など、完全に機能する国家首都が歩いて暮らせる沿岸形態の中に収まっています。SLIC創造性48.8は政府隣接のクリエイティブサービスとともに、控えめではあるが実在する映画・デジタル産業を反映しています。圧力45.5はダニーデンより低く読まれ、経済的密度に対してウェリントンの住宅ストックが逼迫していることを反映しています。"
    }
  },
  "au-hobart": {
    heroLine: {
      en: "Australia's most atmospheric small capital, anchored by one museum.",
      th: "เมืองหลวงขนาดเล็กที่มีบรรยากาศสูงสุดของออสเตรเลีย ยึดเหนี่ยวด้วยพิพิธภัณฑ์แห่งเดียว",
      zh: "澳大利亚氛围最浓的小首府，以一座博物馆为锚点。",
      ko: "한 박물관이 중심을 잡는 호주에서 가장 분위기 있는 소도시 주도.",
      ja: "一つの美術館に支えられた、オーストラリアで最も雰囲気のある小さな州都。"
    },
    intro: {
      en: "Hobart's SLIC reading reflects a city operating on national Australian infrastructure with a small-city scale: Creative at 45.1 runs above the raw cultural footprint you would expect but below Australian cities with larger economies, a figure that the MONA effect partially explains — David Walsh's museum has genuinely restructured the city's creative profile. Pressure at 46.0 is low, reflecting Hobart's modest housing costs relative to mainland cities, though that advantage is narrowing as the city's profile rises.",
      th: "ค่า SLIC ของโฮบาร์ตสะท้อนเมืองที่ดำเนินงานบนโครงสร้างพื้นฐานออสเตรเลียระดับชาติในสเกลเมืองเล็ก Creative ที่ 45.1 สูงกว่าพื้นที่ทางวัฒนธรรมดิบที่คาดไว้ แต่ต่ำกว่าเมืองออสเตรเลียที่มีเศรษฐกิจขนาดใหญ่กว่า ตัวเลขที่ส่วนหนึ่งอธิบายได้ด้วยปรากฏการณ์ MONA — พิพิธภัณฑ์ของ David Walsh ได้จัดโครงสร้างโปรไฟล์สร้างสรรค์ของเมืองใหม่อย่างแท้จริง Pressure ที่ 46.0 ต่ำ สะท้อนต้นทุนที่อยู่อาศัยที่เจียมเนื้อเจียมตัวของโฮบาร์ตเมื่อเทียบกับเมืองแผ่นดินใหญ่ แม้ว่าข้อได้เปรียบนี้กำลังลดลงเมื่อชื่อเสียงของเมืองเพิ่มขึ้น",
      zh: "霍巴特的 SLIC 读数反映了一座在全国澳大利亚基础设施框架下运行、却具有小城市规模的城市：创意得分 45.1 高于预期的原始文化覆盖面，但低于经济规模更大的澳大利亚城市，这一数字在一定程度上可以用 MONA 效应来解释——大卫·沃尔什的博物馆确实重塑了这座城市的创意面貌。压力得分 46.0 较低，反映了霍巴特相对于大陆城市较为适中的住房成本，尽管随着城市知名度的提升，这一优势正在收窄。",
      ko: "호바트의 SLIC 수치는 소도시 규모에서 호주 국가 인프라를 운영하는 도시를 반영합니다. 창의성 45.1은 예상 문화적 규모보다는 높지만 더 큰 경제를 가진 호주 도시들보다는 낮으며, 이는 부분적으로 MONA 효과로 설명됩니다. 데이비드 월시의 박물관이 도시의 창의적 프로필을 실질적으로 재구성했습니다. 압력 46.0은 낮으며 내륙 도시 대비 호바트의 적정한 주거 비용을 반영하지만, 도시의 인지도가 높아지면서 이 이점은 좁아지고 있습니다.",
      ja: "ホバートのSLICの読み値は、小都市規模で全国オーストラリアインフラを運営する都市を反映しています。創造性45.1は予想される生の文化的フットプリントを上回りますが、より大きな経済を持つオーストラリアの都市より低く、これはMONA効果が部分的に説明します。デイビッド・ウォルシュの美術館が本当に都市の創造的プロフィールを再構築しました。圧力46.0は低く、本土の都市と比較したホバートの適度な住宅コストを反映していますが、都市の知名度が上がるにつれてその優位性は縮小しています。"
    }
  },
  "jp-sapporo": {
    heroLine: {
      en: "Japan's northern city: high viability, winter scale, manageable pace.",
      th: "เมืองทางตอนเหนือของญี่ปุ่น ความเป็นไปได้สูง สเกลฤดูหนาว จังหวะที่จัดการได้",
      zh: "日本北部城市：高宜居性，冬日尺度，节奏可控。",
      ko: "일본 북부 도시: 높은 생존 가능성, 겨울 규모, 관리 가능한 페이스.",
      ja: "日本北部の都市：高い生活維持性、冬のスケール、管理しやすいペース。"
    },
    intro: {
      en: "Sapporo is Hokkaido's capital and Japan's fifth-largest city, operating at a price point and pace that Tokyo's residents frequently benchmark against. SLIC Viability at 95.8 is exceptional — reflecting lower housing costs and a wage-to-cost ratio that outperforms Japan's larger metropolitan centres — while Capability at 74.6 records city-level infrastructure that is solid but not at the level of the Tokyo–Osaka–Nagoya corridor. Creative at 37.3 reflects the cultural economy that seasonal tourism and a distinctive food and beer identity can sustain.",
      th: "ซัปโปโรคือเมืองหลวงของฮอกไกโดและเมืองที่ใหญ่เป็นอันดับห้าของญี่ปุ่น ทำงานในระดับราคาและจังหวะที่ผู้อยู่อาศัยในโตเกียวมักนำมาเปรียบเทียบ SLIC Viability ที่ 95.8 ยอดเยี่ยม — สะท้อนต้นทุนที่อยู่อาศัยที่ต่ำกว่าและอัตราส่วนค่าจ้างต่อต้นทุนที่เหนือกว่าเมืองใหญ่ในญี่ปุ่น — ขณะที่ Capability ที่ 74.6 บันทึกโครงสร้างพื้นฐานระดับเมืองที่มั่นคงแต่ไม่ถึงระดับของเส้นทาง โตเกียว–โอซาก้า–นาโกย่า Creative ที่ 37.3 สะท้อนเศรษฐกิจวัฒนธรรมที่การท่องเที่ยวตามฤดูกาลและอัตลักษณ์อาหารและเบียร์ที่โดดเด่นสามารถค้ำจุนได้",
      zh: "札幌是北海道首府，也是日本第五大城市，以东京市民频繁拿来作为基准的价格水平和生活节奏运转。SLIC 宜居性 95.8 格外突出——反映了低于日本各大都市圈的住房成本以及更优的工资-成本比——而能力得分 74.6 记录了扎实但未达到东京-大阪-名古屋走廊水平的城市级基础设施。创意得分 37.3 反映了季节性旅游和独特的美食与啤酒文化所能支撑的文化经济规模。",
      ko: "삿포로는 홋카이도의 주도이자 일본 5번째로 큰 도시로, 도쿄 주민들이 자주 기준으로 삼는 가격대와 속도로 운영됩니다. SLIC 생존 가능성 95.8은 탁월합니다. 더 낮은 주거 비용과 일본의 대도시권보다 우수한 임금 대비 비용 비율을 반영합니다. 역량 74.6은 탄탄하지만 도쿄-오사카-나고야 회랑 수준에 미치지 못하는 도시 수준 인프라를 기록합니다. 창의성 37.3은 계절 관광과 독특한 음식과 맥주 문화가 지탱할 수 있는 문화 경제를 반영합니다.",
      ja: "札幌は北海道の道都であり、日本第5位の都市で、東京の住民が頻繁にベンチマークする価格帯とペースで運営されています。SLIC生活維持性95.8は卓越しており、日本の大都市圏より低い住宅コストと優れた賃金対コスト比を反映しています。一方、能力74.6は確かですが東京-大阪-名古屋回廊のレベルには至らない都市レベルのインフラを記録しています。創造性37.3は季節観光と独特の食とビールのアイデンティティが支えられる文化経済を反映しています。"
    }
  },
  "jp-hiroshima": {
    heroLine: {
      en: "Peace architecture, automotive identity, and strong regional roots.",
      th: "สถาปัตยกรรมสันติภาพ อัตลักษณ์ยานยนต์ และรากฐานระดับภูมิภาคที่แข็งแกร่ง",
      zh: "和平建筑，汽车身份，以及深厚的地区根基。",
      ko: "평화 건축, 자동차 정체성, 그리고 강한 지역적 뿌리.",
      ja: "平和の建築、自動車アイデンティティ、そして強い地域的ルーツ。"
    },
    intro: {
      en: "Hiroshima is western Japan's principal city and carries two identities simultaneously: the Peace Memorial and its surrounding architecture form one of the most visited sites in the country, while Mazda's manufacturing presence grounds the city in an economic reality distinct from tourism. SLIC Viability and Capability reflect national Japanese metrics; Creative at 37.3 records an honest assessment — Hiroshima's cultural weight is historical and architectural more than commercial-contemporary.",
      th: "ฮิโรชิมาคือเมืองหลักของญี่ปุ่นตะวันตกและมีสองอัตลักษณ์พร้อมกัน อนุสรณ์สันติภาพและสถาปัตยกรรมโดยรอบเป็นหนึ่งในสถานที่ที่มีผู้เยี่ยมชมมากที่สุดในประเทศ ขณะที่การมีอยู่ของโรงงาน Mazda รากฐานเมืองในความเป็นจริงทางเศรษฐกิจที่แตกต่างจากการท่องเที่ยว SLIC Viability และ Capability สะท้อนตัวชี้วัดระดับชาติของญี่ปุ่น Creative ที่ 37.3 บันทึกการประเมินที่ตรงไปตรงมา — น้ำหนักทางวัฒนธรรมของฮิโรชิมาเป็นประวัติศาสตร์และสถาปัตยกรรมมากกว่าเชิงพาณิชย์-ร่วมสมัย",
      zh: "广岛是日本西部的主要城市，同时承载着两种身份：和平纪念公园及其周边建筑是全国访客量最大的景点之一，而马自达的制造业存在则将这座城市植根于有别于旅游业的经济现实。SLIC 宜居性和能力得分反映了日本全国指标；创意得分 37.3 是如实的评估——广岛的文化分量更多体现在历史与建筑层面，而非商业当代领域。",
      ko: "히로시마는 일본 서부의 주요 도시로 두 가지 정체성을 동시에 지니고 있습니다. 평화기념관과 주변 건축물은 일본에서 가장 많이 방문하는 장소 중 하나이며, 마쓰다의 제조업 존재는 관광업과는 구별되는 경제적 현실에 도시를 뿌리내리게 합니다. SLIC 생존 가능성과 역량은 일본 국가 지표를 반영합니다. 창의성 37.3은 솔직한 평가를 기록합니다. 히로시마의 문화적 비중은 상업적-현대적 영역보다 역사적이고 건축적입니다.",
      ja: "広島は西日本の主要都市であり、二つのアイデンティティを同時に持っています。平和記念碑とその周辺の建築物は国内で最も訪問者数の多い場所の一つを形成し、一方マツダの製造業の存在が観光業とは異なる経済的現実に都市を根付かせています。SLICの生活維持性と能力は日本の全国指標を反映しています。創造性37.3は正直な評価を記録しています。広島の文化的な重みは商業的・現代的というよりも、歴史的・建築的なものです。"
    }
  },
  "ie-cork": {
    heroLine: {
      en: "Ireland's second city with the index's highest community score.",
      th: "เมืองที่สองของไอร์แลนด์ที่มีคะแนน community สูงที่สุดในดัชนี",
      zh: "爱尔兰第二大城市，创下指数中最高的社区得分。",
      ko: "지수에서 가장 높은 커뮤니티 점수를 기록한 아일랜드 제2도시.",
      ja: "インデックスで最も高いコミュニティスコアを持つアイルランド第2都市。"
    },
    intro: {
      en: "Cork's headline number is Community at 93.4 — the highest community reading in this cohort and reflective of a city-scale tolerance, civic participation, and social infrastructure that punches significantly above its population weight. Viability reads 100; Pressure at 88.1 is exceptional, reflecting a small-city cost structure with large-city employment anchored by Apple's European headquarters and a growing technology sector. The Coverage grade of C (a 15-point penalty) reflects data gaps at city level rather than performance gaps — the underlying raw score would place Cork considerably higher.",
      th: "ตัวเลขหลักของคอร์กคือ Community ที่ 93.4 — ค่า community สูงสุดในกลุ่มนี้ สะท้อนความอดทน การมีส่วนร่วมของพลเมือง และโครงสร้างพื้นฐานทางสังคมในระดับเมืองที่แข็งแกร่งเกินขนาดประชากรมาก Viability อ่านค่าได้ 100 Pressure ที่ 88.1 ยอดเยี่ยม สะท้อนโครงสร้างต้นทุนเมืองเล็กกับการจ้างงานระดับเมืองใหญ่ที่ยึดเหนี่ยวด้วยสำนักงานใหญ่ยุโรปของ Apple และภาคเทคโนโลยีที่เติบโต คะแนน Coverage C (ลงโทษ 15 คะแนน) สะท้อนช่องว่างข้อมูลระดับเมืองมากกว่าช่องว่างประสิทธิภาพ — คะแนนดิบพื้นฐานจะวางคอร์กไว้ในตำแหน่งที่สูงกว่ามาก",
      zh: "科克最引人注目的数字是社区得分 93.4——这是本批次中最高的社区读数，体现了城市规模的包容性、公民参与度和社会基础设施远超其人口体量的水平。宜居性满分 100；压力得分 88.1 格外出色，反映了小城市成本结构与苹果欧洲总部及蓬勃发展的科技行业所支撑的大城市就业机会并存的格局。覆盖率评级 C（-15 分惩罚）反映的是城市层面的数据缺口，而非绩效缺口——基础原始分数将使科克的排名大幅提升。",
      ko: "코크의 핵심 수치는 커뮤니티 93.4로, 이 코호트에서 가장 높은 커뮤니티 수치이며 인구 규모를 훨씬 능가하는 도시 규모의 관용성, 시민 참여, 사회 인프라를 반영합니다. 생존 가능성은 100점. 압력 88.1은 탁월하며, 애플의 유럽 본사와 성장하는 기술 부문이 뒷받침하는 대도시 수준의 고용과 소도시 비용 구조가 공존하는 것을 반영합니다. 커버리지 등급 C(15점 페널티)는 성과 차이가 아닌 도시 수준의 데이터 격차를 반영합니다. 기본 원시 점수라면 코크를 훨씬 더 높은 위치에 놓을 것입니다.",
      ja: "コークの注目すべき数字はコミュニティ93.4で、このコホートで最も高いコミュニティ数値であり、人口規模を大幅に上回る都市規模の寛容性、市民参加、社会インフラを反映しています。生活維持性は100点。圧力88.1は卓越しており、アップルの欧州本社と成長するテクノロジーセクターに支えられた大都市レベルの雇用と小都市のコスト構造の共存を反映しています。カバレッジグレードC（15ポイントペナルティ）は、パフォーマンスのギャップではなく都市レベルのデータギャップを反映しています。基礎となる生スコアであれば、コークをかなり高い位置に置くでしょう。"
    }
  }
};
