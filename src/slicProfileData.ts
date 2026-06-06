import type { Locale } from "./types";

export const OFFICIAL_SLIC_URL = "https://nonarkara.github.io/slic-landing-page/slic/";
const DEPA_URL = "https://www.depa.or.th/";
const PMUA_URL = "https://www.nxpo.or.th/A/";
const AXIOM_URL = "https://nonarkara.github.io/Axiom/";

export interface PartnerCard {
  name: string;
  role: string;
  body: string;
  logoSrc?: string;
  url?: string;
}

interface SlicProfileContent {
  eyebrow: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summary: string[];
  leadsLabel: string;
  leadsTitle: string;
  leadsSummary: string;
  leads: PartnerCard[];
  privateLabel: string;
  privateTitle: string;
  privateSummary: string;
  privatePartner: PartnerCard;
  techLabel: string;
  techTitle: string;
  techSummary: string;
  techPartners: PartnerCard[];
  publicationLabel: string;
  publicationTitle: string;
  publicationSummary: string;
  resourceLabel: string;
  resourcesTitle: string;
  bridgeBody: string;
  slicFootnoteLabel: string;
  externalLabel: string;
  methodologyLabel: string;
}

export const slicProfileData: Record<Locale, SlicProfileContent> = {
  en: {
    eyebrow: "A DEPA × PMU-A project",
    title: "SLIC Index is published by DEPA and PMU-A",
    intro:
      "The Smart and Liveable Cities Index is a joint public-interest initiative of the Digital Economy Promotion Agency of Thailand (DEPA) and the Program Management Unit for Area Based Development (PMU-A). It measures cities on what it actually costs to build a life there, with a transparent methodology and open data.",
    summaryTitle: "Why this framing",
    summary: [
      "DEPA brings ministerial authority and a national digital-economy mandate under the Ministry of Digital Economy and Society.",
      "PMU-A brings research funding and an area-based remit covering provincial and municipal development across Thailand.",
      "Methodology, weights, scoring, and provenance are all published openly — no paid placement, no sponsor influence on rank.",
    ],
    leadsLabel: "Who leads this",
    leadsTitle: "Two public-sector principals",
    leadsSummary:
      "SLIC Index is commissioned and governed jointly. Both principals carry public accountability for the methodology and the published board.",
    leads: [
      {
        name: "DEPA",
        role: "Digital Economy Promotion Agency of Thailand",
        body: "Thailand's national digital-economy agency under the Ministry of Digital Economy and Society. Sets the smart-city policy frame, funds the index publication, and provides the public-sector legitimacy that keeps the board usable for city governments.",
        logoSrc: "/Logos/depa_logo.jpg",
        url: DEPA_URL,
      },
      {
        name: "PMU-A",
        role: "Program Management Unit for Area Based Development",
        body: "Thailand's area-based research programme manager under NXPO. Funds the underlying research, sets coverage priorities at provincial and municipal scale, and ensures the index is anchored in independent academic review.",
        logoSrc: "/Logos/uwn_pmu_a_logo.jpeg",
        url: PMUA_URL,
      },
    ],
    privateLabel: "Private-sector delivery partner",
    privateTitle: "SLIC — the build, not the brochure",
    privateSummary:
      "SLIC is the private-sector consulting partner that turns the mandate into a working product. The reason we work with SLIC is philosophical: they prefer to show rather than tell, prototype rather than debate, and build rather than procure.",
    privatePartner: {
      name: "SLIC",
      role: "Consulting and implementation partner",
      body: "SLIC is our delivery arm on the private side. They have the access and the judgement we need — but more importantly, they share a working ethic the public sector often lacks: ship a prototype before the meeting, not after; build the thing rather than write a tender for someone else to build it later; let the product speak before the slide deck does. SLIC also carries its own broader smart-city consulting, education, and ecosystem work, which sits around the index but does not control it.",
      logoSrc: "/Logos/slic-index-120.png",
      url: OFFICIAL_SLIC_URL,
    },
    techLabel: "Technology partners",
    techTitle: "Axiom × ReTL — AI with humans in the loop",
    techSummary:
      "The index is built on AI comprehension of how AI can help us gather and analyse city data at scale. Humans stay in the loop so the result remains neutral, unbiased, comprehensive, understandable, reviewable, observable, and presentable from a human perspective.",
    techPartners: [
      {
        name: "Axiom",
        role: "AI strategy and comprehension",
        body: "Axiom designs the AI-assisted research pipeline — how models read public sources, how provenance is tracked, how prompts and data flows stay auditable. The goal is not to automate judgement but to scale the reading work so humans can focus on the judgement.",
        logoSrc: "/Logos/axiom_logo.png",
        url: AXIOM_URL,
      },
      {
        name: "ReTL",
        role: "The Reason to Live Company — product and presentation",
        body: "ReTL builds the public surface of the index: the interactions, the typography, the data presentation, the mobile experience. Their remit is to make transparent methodology also readable — so citizens, mayors, and journalists can all use the same board without needing to be specialists.",
        logoSrc: "/Logos/retl_logo.png",
      },
    ],
    publicationLabel: "Publication context",
    publicationTitle: "A public-interest index, published in the open.",
    publicationSummary:
      "The pages you see here — live board, methodology, Thailand track, scoring workbook — are the published outputs of the joint DEPA × PMU-A project. The photos below show the public process: convening, dialogue, review, and the institutional work that sits behind the board.",
    resourceLabel: "Resources",
    resourcesTitle: "Go deeper",
    bridgeBody:
      "Open the methodology paper for the full scoring specification, anchors, and source tiers. SLIC's own organisation page is kept as a companion reference below.",
    slicFootnoteLabel: "SLIC organisation page (companion reference)",
    externalLabel: "Open SLIC organisation page",
    methodologyLabel: "Open the methodology paper",
  },
  th: {
    eyebrow: "โครงการร่วม DEPA × PMU-A",
    title: "SLIC Index เผยแพร่โดย DEPA และ PMU-A",
    intro:
      "ดัชนี Smart and Liveable Cities Index เป็นความร่วมมือเพื่อสาธารณะระหว่างสำนักงานส่งเสริมเศรษฐกิจดิจิทัล (DEPA) และหน่วยบริหารและจัดการทุนด้านการพัฒนาระดับพื้นที่ (PMU-A) วัดเมืองจากต้นทุนที่ต้องจ่ายจริงในการสร้างชีวิต ด้วยระเบียบวิธีโปร่งใสและข้อมูลเปิด",
    summaryTitle: "ทำไมต้องจัดกรอบแบบนี้",
    summary: [
      "DEPA มีอำนาจเชิงนโยบายและภารกิจด้านเศรษฐกิจดิจิทัลระดับชาติภายใต้กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม",
      "PMU-A มีทุนวิจัยและภารกิจเชิงพื้นที่ครอบคลุมการพัฒนาระดับจังหวัดและเทศบาลทั่วประเทศ",
      "ระเบียบวิธี น้ำหนัก คะแนน และแหล่งอ้างอิงเปิดเผยทั้งหมด ไม่มีตำแหน่งที่ซื้อได้ ไม่มีอิทธิพลของผู้สนับสนุนต่ออันดับ",
    ],
    leadsLabel: "ผู้นำโครงการ",
    leadsTitle: "สองหน่วยงานหลักภาครัฐ",
    leadsSummary:
      "SLIC Index ถูกมอบหมายและกำกับดูแลร่วมกัน ทั้งสองหน่วยงานรับผิดชอบสาธารณะต่อระเบียบวิธีและบอร์ดที่เผยแพร่",
    leads: [
      {
        name: "DEPA",
        role: "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล",
        body: "หน่วยงานด้านเศรษฐกิจดิจิทัลระดับชาติของไทย ภายใต้กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม วางกรอบนโยบายเมืองอัจฉริยะ สนับสนุนทุนการเผยแพร่ดัชนี และให้ความชอบธรรมภาครัฐที่ทำให้บอร์ดใช้งานได้จริงกับผู้บริหารเมือง",
        logoSrc: "/Logos/depa_logo.jpg",
        url: DEPA_URL,
      },
      {
        name: "PMU-A",
        role: "หน่วยบริหารและจัดการทุนด้านการพัฒนาระดับพื้นที่",
        body: "หน่วยบริหารจัดการทุนวิจัยเชิงพื้นที่ภายใต้ สอวช. สนับสนุนทุนวิจัยพื้นฐานของดัชนี กำหนดลำดับความสำคัญของพื้นที่ทั้งระดับจังหวัดและเทศบาล และทำให้ดัชนีมีรากวิชาการที่ผ่านการทบทวนอย่างอิสระ",
        logoSrc: "/Logos/uwn_pmu_a_logo.jpeg",
        url: PMUA_URL,
      },
    ],
    privateLabel: "พันธมิตรส่งมอบภาคเอกชน",
    privateTitle: "SLIC — สร้างจริง ไม่ใช่แค่โบรชัวร์",
    privateSummary:
      "SLIC คือที่ปรึกษาภาคเอกชนที่เปลี่ยนภารกิจให้กลายเป็นสินค้าใช้งานได้จริง เราเลือกทำงานกับ SLIC ด้วยเหตุผลเชิงปรัชญา พวกเขาแสดงแทนพูด ทำต้นแบบแทนการถกเถียง และสร้างเองแทนการจัดซื้อจัดจ้าง",
    privatePartner: {
      name: "SLIC",
      role: "พันธมิตรให้คำปรึกษาและส่งมอบ",
      body: "SLIC คือฝ่ายส่งมอบของเราในภาคเอกชน พวกเขามีเครือข่ายและดุลยพินิจที่เราต้องการ แต่สิ่งสำคัญกว่าคือจริยธรรมการทำงานที่ภาครัฐมักขาด คือส่ง prototype ก่อนประชุม ไม่ใช่หลัง ลงมือสร้างเองแทนการเขียน TOR ให้คนอื่นสร้างทีหลัง ให้ตัวสินค้าพูดก่อนสไลด์ SLIC มีงานที่ปรึกษาเมืองอัจฉริยะ การศึกษา และระบบนิเวศของตัวเอง ซึ่งอยู่รอบ ๆ ดัชนีแต่ไม่ควบคุมดัชนี",
      logoSrc: "/Logos/slic-index-120.png",
      url: OFFICIAL_SLIC_URL,
    },
    techLabel: "พันธมิตรด้านเทคโนโลยี",
    techTitle: "Axiom × ReTL — AI ที่มีมนุษย์อยู่ในวงจร",
    techSummary:
      "ดัชนีนี้สร้างบนความเข้าใจของ AI ว่า AI จะช่วยเรารวบรวมและวิเคราะห์ข้อมูลเมืองในขนาดใหญ่ได้อย่างไร โดยมนุษย์ยังอยู่ในวงจรเพื่อรักษาความเป็นกลาง ไร้อคติ ครอบคลุม เข้าใจง่าย ตรวจทานได้ สังเกตได้ และดูดีจากสายตามนุษย์",
    techPartners: [
      {
        name: "Axiom",
        role: "กลยุทธ์และความเข้าใจด้าน AI",
        body: "Axiom ออกแบบกระบวนการวิจัยที่มี AI ช่วย วิธีที่โมเดลอ่านแหล่งข้อมูลสาธารณะ วิธีติดตามที่มาของข้อมูล และวิธีรักษา prompt และข้อมูลให้ตรวจสอบย้อนได้ เป้าหมายไม่ใช่การแทนที่ดุลยพินิจ แต่ขยายงานอ่านเพื่อให้มนุษย์โฟกัสที่การตัดสินใจ",
        logoSrc: "/Logos/axiom_logo.png",
        url: AXIOM_URL,
      },
      {
        name: "ReTL",
        role: "The Reason to Live Company — ผลิตภัณฑ์และการนำเสนอ",
        body: "ReTL สร้างหน้าสาธารณะของดัชนี ทั้งการปฏิสัมพันธ์ การจัดตัวอักษร การแสดงข้อมูล และประสบการณ์บนมือถือ ภารกิจคือทำให้ระเบียบวิธีโปร่งใสนั้นอ่านเข้าใจได้ เพื่อให้ประชาชน นายกเทศมนตรี และนักข่าวใช้บอร์ดเดียวกันได้โดยไม่ต้องเป็นผู้เชี่ยวชาญ",
        logoSrc: "/Logos/retl_logo.png",
      },
    ],
    publicationLabel: "บริบทของสิ่งพิมพ์",
    publicationTitle: "ดัชนีเพื่อสาธารณะ เผยแพร่อย่างเปิดเผย",
    publicationSummary:
      "หน้าที่ท่านเห็น ทั้งบอร์ดแบบสด ระเบียบวิธี เส้นทางประเทศไทย และเวิร์กบุ๊กคะแนน คือผลลัพธ์ที่เผยแพร่ของโครงการ DEPA × PMU-A ภาพด้านล่างแสดงกระบวนการสาธารณะ การประชุม การสนทนา การทบทวน และงานเชิงสถาบันที่อยู่เบื้องหลังบอร์ด",
    resourceLabel: "ทรัพยากร",
    resourcesTitle: "ลงลึกเพิ่มเติม",
    bridgeBody:
      "เปิดเอกสารระเบียบวิธีเพื่อดูการกำหนดคะแนน จุดยึด และลำดับความน่าเชื่อถือของแหล่งข้อมูล หน้าองค์กร SLIC ยังคงไว้เป็นเอกสารอ้างอิงคู่ขนาน",
    slicFootnoteLabel: "หน้าองค์กร SLIC (อ้างอิงคู่ขนาน)",
    externalLabel: "เปิดหน้าองค์กร SLIC",
    methodologyLabel: "เปิดหน้าระเบียบวิธี",
  },
  zh: {
    eyebrow: "DEPA × PMU-A 共同项目",
    title: "SLIC Index 由 DEPA 与 PMU-A 共同发布",
    intro:
      "智慧宜居城市指数是泰国数字经济促进局（DEPA）与区域发展项目管理机构（PMU-A）共同发起的公共利益项目，以透明方法与公开数据衡量一座城市真正需要多少代价才能在其中建立生活。",
    summaryTitle: "为何如此定位",
    summary: [
      "DEPA 在数字经济与社会部之下，承担国家级数字经济的政策权威与授权。",
      "PMU-A 提供研究经费与区域授权，覆盖泰国省级与市级发展议题。",
      "方法、权重、评分与数据来源全部公开——没有付费上榜，没有赞助方影响排名。",
    ],
    leadsLabel: "谁在主导",
    leadsTitle: "两个公共部门主体",
    leadsSummary:
      "SLIC Index 由双方共同委托与治理，两个主体对方法论与公开榜单共同承担公共责任。",
    leads: [
      {
        name: "DEPA",
        role: "泰国数字经济促进局",
        body: "泰国数字经济与社会部下属的国家级数字经济机构。负责设定智慧城市政策框架、资助指数发布，并提供使榜单对城市政府可用的公共部门合法性。",
        logoSrc: "/Logos/depa_logo.jpg",
        url: DEPA_URL,
      },
      {
        name: "PMU-A",
        role: "区域发展项目管理机构",
        body: "隶属 NXPO 的区域型研究经费管理机构。资助指数的基础研究，设定省级与市级的覆盖优先级，并确保指数锚定于独立学术评审之中。",
        logoSrc: "/Logos/uwn_pmu_a_logo.jpeg",
        url: PMUA_URL,
      },
    ],
    privateLabel: "私营部门交付伙伴",
    privateTitle: "SLIC — 做出来的，不是写出来的",
    privateSummary:
      "SLIC 是把授权变成能用的产品的私营部门咨询伙伴。我们选择 SLIC 的理由是理念一致：他们宁愿做给你看，不愿反复辩论；宁愿先做原型，不愿先写采购。",
    privatePartner: {
      name: "SLIC",
      role: "咨询与实施伙伴",
      body: "SLIC 是我们在私营侧的交付团队。他们拥有我们需要的资源与判断力，更重要的是他们有公共部门常常缺失的工作态度——在开会之前就把原型发出来，而不是开完再做；亲手建，而不是写一份 TOR 等别人建；让产品先说话，再谈幻灯片。SLIC 自身也承担更广泛的智慧城市咨询、教育与生态建设工作，这些工作围绕指数但不主导指数。",
      logoSrc: "/Logos/slic-index-120.png",
      url: OFFICIAL_SLIC_URL,
    },
    techLabel: "技术合作伙伴",
    techTitle: "Axiom × ReTL — 带人在回路的 AI",
    techSummary:
      "本指数建立在对 AI 如何帮助我们在大规模上收集与分析城市数据的理解之上。人类始终在回路中，以保持结果中立、无偏见、全面、可理解、可复核、可观察，并且在人的视角下值得一看。",
    techPartners: [
      {
        name: "Axiom",
        role: "AI 策略与理解",
        body: "Axiom 设计 AI 辅助的研究流水线——模型如何阅读公共来源、如何追踪数据出处、prompt 与数据流如何保持可审计。目标不是把判断自动化，而是扩大阅读工作的规模，让人类专注于判断。",
        logoSrc: "/Logos/axiom_logo.png",
        url: AXIOM_URL,
      },
      {
        name: "ReTL",
        role: "The Reason to Live Company — 产品与呈现",
        body: "ReTL 负责指数的公共界面——交互、字体、数据呈现和移动端体验。他们的任务是让透明的方法论也能被读懂，让市民、市长与记者都能共用同一块榜单，而不必是专业人士。",
        logoSrc: "/Logos/retl_logo.png",
      },
    ],
    publicationLabel: "发布语境",
    publicationTitle: "公共利益指数，公开发布。",
    publicationSummary:
      "你所看到的这些页面——实时榜单、方法论、泰国分榜、评分工作簿——都是 DEPA × PMU-A 共同项目的公开输出。下方图片展示的是其背后的公共过程：召集、对话、评审，以及支撑榜单的机构性工作。",
    resourceLabel: "资源",
    resourcesTitle: "深入阅读",
    bridgeBody:
      "打开方法论文件查看完整评分规格、锚点与来源分级。SLIC 自身的机构页面作为参考资料继续保留。",
    slicFootnoteLabel: "SLIC 机构页面（参考）",
    externalLabel: "打开 SLIC 机构页面",
    methodologyLabel: "打开方法论文件",
  },
  ko: {
    eyebrow: "DEPA × PMU-A 공동 프로젝트",
    title: "SLIC Index는 DEPA와 PMU-A가 공동 발행합니다",
    intro:
      "스마트 앤 리버블 시티 인덱스(Smart and Liveable Cities Index)는 태국 디지털경제진흥원(DEPA)과 지역기반개발사업관리기구(PMU-A)가 공동으로 추진하는 공공이익 사업입니다. 도시에서 실제로 생활을 꾸리는 데 드는 비용을 기준으로 도시를 평가하며, 투명한 방법론과 공개 데이터를 기반으로 합니다.",
    summaryTitle: "이 접근 방식의 의미",
    summary: [
      "DEPA는 디지털경제사회부 산하에서 국가 디지털경제 정책 권한과 임무를 수행합니다.",
      "PMU-A는 연구 자금과 태국 전역의 광역 및 기초 지방자치단체 개발을 아우르는 지역 기반 임무를 담당합니다.",
      "방법론, 가중치, 점수, 출처는 모두 공개됩니다. 유료 게재는 없으며, 후원자가 순위에 영향을 미치지 않습니다.",
    ],
    leadsLabel: "주관 기관",
    leadsTitle: "두 개의 공공기관",
    leadsSummary:
      "SLIC Index는 두 기관이 공동으로 위탁하고 운영합니다. 두 주관 기관 모두 방법론과 발행된 순위표에 대해 공적 책임을 집니다.",
    leads: [
      {
        name: "DEPA",
        role: "태국 디지털경제진흥원",
        body: "디지털경제사회부 산하 태국 국가 디지털경제 기관입니다. 스마트시티 정책 프레임을 수립하고, 인덱스 발행을 지원하며, 도시 정부가 순위표를 실질적으로 활용할 수 있도록 공공 부문의 정당성을 부여합니다.",
        logoSrc: "/Logos/depa_logo.jpg",
        url: DEPA_URL,
      },
      {
        name: "PMU-A",
        role: "지역기반개발사업관리기구",
        body: "NXPO 산하 태국의 지역 기반 연구비 관리 기관입니다. 인덱스의 기초 연구를 지원하고, 광역 및 기초 지방자치단체 단위의 커버리지 우선순위를 설정하며, 독립적인 학술 검토를 통해 인덱스의 학문적 토대를 확보합니다.",
        logoSrc: "/Logos/uwn_pmu_a_logo.jpeg",
        url: PMUA_URL,
      },
    ],
    privateLabel: "민간 부문 이행 파트너",
    privateTitle: "SLIC — 브로슈어가 아닌 실제 구현",
    privateSummary:
      "SLIC는 공공 위임 사항을 실제로 작동하는 제품으로 전환하는 민간 부문 컨설팅 파트너입니다. SLIC와 협력하는 이유는 철학적인 데 있습니다. 그들은 말하기보다 보여주고, 논쟁하기보다 프로토타입을 만들며, 조달하기보다 직접 구축합니다.",
    privatePartner: {
      name: "SLIC",
      role: "컨설팅 및 이행 파트너",
      body: "SLIC는 민간 측의 이행 파트너입니다. 그들은 우리가 필요로 하는 접근성과 판단력을 보유하고 있습니다. 더 중요한 것은 공공 부문에서 흔히 부족한 업무 윤리를 공유한다는 점입니다. 회의 후가 아니라 회의 전에 프로토타입을 발송하고, 나중에 누군가 만들도록 발주서를 작성하는 대신 직접 구축하며, 슬라이드보다 제품이 먼저 말하게 합니다. SLIC는 자체적인 스마트시티 컨설팅, 교육, 생태계 구축 업무도 수행하며, 이는 인덱스 주변에 있지만 인덱스를 통제하지는 않습니다.",
      logoSrc: "/Logos/slic-index-120.png",
      url: OFFICIAL_SLIC_URL,
    },
    techLabel: "기술 파트너",
    techTitle: "Axiom × ReTL — 인간이 루프 안에 있는 AI",
    techSummary:
      "이 인덱스는 AI가 도시 데이터를 대규모로 수집·분석하는 데 어떻게 기여할 수 있는지에 대한 이해 위에 구축되었습니다. 결과가 중립적이고 편향 없이 포괄적이며, 이해 가능하고 검토·관찰 가능하며 인간의 관점에서 제시될 수 있도록 인간이 루프 안에 머뭅니다.",
    techPartners: [
      {
        name: "Axiom",
        role: "AI 전략 및 이해",
        body: "Axiom은 AI 보조 연구 파이프라인을 설계합니다. 모델이 공공 출처를 읽는 방법, 출처를 추적하는 방법, 프롬프트와 데이터 흐름이 감사 가능한 상태를 유지하는 방법을 포함합니다. 목표는 판단을 자동화하는 것이 아니라 독해 작업을 확장하여 인간이 판단에 집중할 수 있도록 하는 것입니다.",
        logoSrc: "/Logos/axiom_logo.png",
        url: AXIOM_URL,
      },
      {
        name: "ReTL",
        role: "The Reason to Live Company — 제품 및 프레젠테이션",
        body: "ReTL은 인덱스의 공개 인터페이스를 구축합니다. 인터랙션, 타이포그래피, 데이터 표현, 모바일 경험이 그 범위에 포함됩니다. 그들의 임무는 투명한 방법론을 읽기 쉽게 만들어, 시민·시장·기자 모두가 전문가가 아니어도 동일한 순위표를 활용할 수 있도록 하는 것입니다.",
        logoSrc: "/Logos/retl_logo.png",
      },
    ],
    publicationLabel: "발행 맥락",
    publicationTitle: "공공이익 인덱스, 공개적으로 발행됩니다.",
    publicationSummary:
      "이 페이지들 — 실시간 순위표, 방법론, 태국 트랙, 점수 산정 워크북 — 은 DEPA × PMU-A 공동 프로젝트의 발행 결과물입니다. 아래 사진들은 공개 과정을 보여줍니다. 회의 소집, 대화, 검토, 그리고 순위표를 뒷받침하는 기관적 작업들입니다.",
    resourceLabel: "리소스",
    resourcesTitle: "더 깊이 살펴보기",
    bridgeBody:
      "방법론 문서를 열어 전체 점수 산정 사양, 앵커, 출처 등급을 확인하십시오. SLIC 자체 기관 페이지는 아래에 참고 자료로 유지됩니다.",
    slicFootnoteLabel: "SLIC 기관 페이지 (참고 자료)",
    externalLabel: "SLIC 기관 페이지 열기",
    methodologyLabel: "방법론 문서 열기",
  },
  ja: {
    eyebrow: "DEPA × PMU-A 共同プロジェクト",
    title: "SLIC IndexはDEPAとPMU-Aが共同で発行しています",
    intro:
      "スマート・アンド・リバブル・シティーズ・インデックス（Smart and Liveable Cities Index）は、タイ・デジタル経済振興庁（DEPA）と地域基盤開発プログラム管理機構（PMU-A）が共同で推進する公益的な取り組みです。透明な方法論と公開データを基に、都市で実際に生活を築くためにかかるコストを基準として都市を評価します。",
    summaryTitle: "このフレーミングの意義",
    summary: [
      "DEPAはデジタル経済社会省のもと、国家レベルのデジタル経済に関する政策的権限と使命を担っています。",
      "PMU-Aはタイ全土の広域・基礎自治体レベルの開発を対象とする研究資金と地域密着型の使命を持っています。",
      "方法論、ウェイト、スコア、出典はすべて公開されています。有料掲載はなく、スポンサーが順位に影響を与えることもありません。",
    ],
    leadsLabel: "主管機関",
    leadsTitle: "二つの公共機関",
    leadsSummary:
      "SLIC Indexは両機関が共同で委託・運営しています。両主管機関ともに方法論と公開された順位表に対して公的な説明責任を負います。",
    leads: [
      {
        name: "DEPA",
        role: "タイ・デジタル経済振興庁",
        body: "デジタル経済社会省傘下のタイ国家デジタル経済機関です。スマートシティ政策のフレームを策定し、インデックスの発行を資金援助し、都市政府が順位表を実際に活用できるよう公共部門としての正当性を提供しています。",
        logoSrc: "/Logos/depa_logo.jpg",
        url: DEPA_URL,
      },
      {
        name: "PMU-A",
        role: "地域基盤開発プログラム管理機構",
        body: "NXPO傘下のタイの地域型研究資金管理機関です。インデックスの基礎研究に資金を提供し、広域・基礎自治体レベルのカバレッジ優先事項を設定し、独立した学術審査によってインデックスの学術的根拠を確保します。",
        logoSrc: "/Logos/uwn_pmu_a_logo.jpeg",
        url: PMUA_URL,
      },
    ],
    privateLabel: "民間部門の実施パートナー",
    privateTitle: "SLIC — パンフレットではなく、実際の構築",
    privateSummary:
      "SLICは、公共の使命を実際に機能する製品へと転換する民間コンサルティングパートナーです。SLICと協力する理由は哲学的なものです。彼らは語るより示し、議論するよりプロトタイプを作り、調達するより自ら構築します。",
    privatePartner: {
      name: "SLIC",
      role: "コンサルティング・実施パートナー",
      body: "SLICは民間側の実施パートナーです。必要なアクセスと判断力を持ち、さらに重要なことに、公共部門がしばしば欠く仕事倫理を共有しています。会議の後ではなく前にプロトタイプを送付し、後で誰かに作らせる発注書を書く代わりに自ら構築し、スライドよりも製品を先に語らせます。SLICは独自のスマートシティコンサルティング、教育、エコシステム構築の業務も担っており、それらはインデックスの周囲に位置しますが、インデックスを制御するものではありません。",
      logoSrc: "/Logos/slic-index-120.png",
      url: OFFICIAL_SLIC_URL,
    },
    techLabel: "テクノロジーパートナー",
    techTitle: "Axiom × ReTL — 人間がループ内にいるAI",
    techSummary:
      "このインデックスは、AIが大規模な都市データの収集・分析をどのように支援できるかという理解の上に構築されています。結果が中立で偏りなく包括的であり、理解・検証・観察可能で、人間の視点から提示できるよう、人間は常にループ内に留まります。",
    techPartners: [
      {
        name: "Axiom",
        role: "AI戦略・理解",
        body: "AxiomはAI支援の研究パイプラインを設計しています。モデルが公開情報源を読む方法、出典を追跡する方法、プロンプトとデータフローが監査可能な状態を維持する方法が含まれます。目標は判断を自動化することではなく、読解作業を拡張して人間が判断に集中できるようにすることです。",
        logoSrc: "/Logos/axiom_logo.png",
        url: AXIOM_URL,
      },
      {
        name: "ReTL",
        role: "The Reason to Live Company — プロダクト・プレゼンテーション",
        body: "ReTLはインデックスの公開インターフェースを構築しています。インタラクション、タイポグラフィ、データ表示、モバイル体験がその範囲です。透明な方法論を読みやすくし、市民・市長・ジャーナリストが専門家でなくても同じ順位表を利用できるようにすることが彼らの使命です。",
        logoSrc: "/Logos/retl_logo.png",
      },
    ],
    publicationLabel: "発行の文脈",
    publicationTitle: "公益インデックス、公開で発行。",
    publicationSummary:
      "ここに掲載されているページ — ライブ順位表、方法論、タイランドトラック、スコアリングワークブック — はすべてDEPA × PMU-A共同プロジェクトの公開成果物です。下の写真は、順位表の背後にある公開プロセス — 召集、対話、審査、機関的な取り組み — を示しています。",
    resourceLabel: "リソース",
    resourcesTitle: "さらに深く読む",
    bridgeBody:
      "方法論文書を開いて、完全なスコアリング仕様、アンカー、出典階層を確認してください。SLICの機関ページは参考資料として下に維持されています。",
    slicFootnoteLabel: "SLIC機関ページ（参考資料）",
    externalLabel: "SLIC機関ページを開く",
    methodologyLabel: "方法論文書を開く",
  },
};
