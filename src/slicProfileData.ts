import type { Locale } from "./types";

export const OFFICIAL_SLIC_URL = "https://nonarkara.github.io/slic-landing-page/";

interface ProfileCard {
  title: string;
  body: string;
}

interface ProfileProgram {
  kicker: string;
  title: string;
  body: string;
}

interface SlicProfileContent {
  eyebrow: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summary: string[];
  deliveryLabel: string;
  serviceTitle: string;
  deliverySummary: string;
  programmeLabel: string;
  services: ProfileCard[];
  programTitle: string;
  programmeSummary: string;
  programs: ProfileProgram[];
  publicationLabel: string;
  publicationTitle: string;
  publicationSummary: string;
  resourceLabel: string;
  resourcesTitle: string;
  resources: ProfileCard[];
  bridgeTitle: string;
  bridgeBody: string;
  partnersLabel: string;
  externalLabel: string;
  methodologyLabel: string;
}

export const slicProfileData: Record<Locale, SlicProfileContent> = {
  en: {
    eyebrow: "Organization profile",
    title: "The broader SLIC organization behind the index",
    intro:
      "The external SLIC page is the wider institutional profile: who SLIC is, how it works with cities, and how the ranking sits inside a larger smart-city, education, and public-innovation platform.",
    summaryTitle: "What the external page says",
    summary: [
      "SLIC presents itself as a Thai smart-city consultancy and innovation partner focused on data, human-centered design, and practical implementation rather than abstract technology branding.",
      "Its public positioning is broader than the ranking: it covers advisory work, ecosystem building, capability building, and co-creation across the public, private, academic, and civic sectors.",
      "The page is multilingual and structured like a public company profile, with mission, services, flagship projects, public programs, partners, and downloadable resources.",
    ],
    deliveryLabel: "Delivery model",
    serviceTitle: "The 4C delivery model",
    deliverySummary:
      "This is the broader operating frame behind the index: advising, connecting, training, and co-building real city programmes.",
    programmeLabel: "Programmes",
    services: [
      {
        title: "Consult",
        body: "Strategic advice for city governments and private developers on urban technology, sustainability, and transformation priorities.",
      },
      {
        title: "Connect",
        body: "Partnership-building across government agencies, universities, entrepreneurs, and technology providers.",
      },
      {
        title: "Capacity Building",
        body: "Training and capability development for officials, local teams, and city leaders who need to run real programmes rather than just buy technology.",
      },
      {
        title: "Co-create",
        body: "Practical delivery through public-private-people collaboration, from concept design to implementation and evaluation.",
      },
    ],
    programTitle: "Flagship work featured there",
    programmeSummary:
      "The external page positions SLIC as more than a report publisher. It presents an operating ecosystem of data products, education, events, and implementation work.",
    programs: [
      {
        kicker: "Core platform",
        title: "Thailand Smart City Data Platform",
        body: "An AI-assisted city-listening and analytics platform that turns public data and signal noise into operating intelligence for urban decision-making.",
      },
      {
        kicker: "Learning",
        title: "Metaverse Classroom",
        body: "An immersive education initiative positioned around STEM engagement and digital learning environments for Thai schools.",
      },
      {
        kicker: "Public convening",
        title: "SLICx Expo",
        body: "A flagship event surface for speeches, technology showcases, partnership-building, and smart-city public conversation.",
      },
      {
        kicker: "Leadership",
        title: "LFC Programme",
        body: "A city-leadership and implementation course focused on practical smart-city change, civic listening, governance, finance, and AI-enabled delivery.",
      },
    ],
    publicationLabel: "Publication context",
    publicationTitle: "The institutional page and the ranking now talk to each other.",
    publicationSummary:
      "One page explains the organization, programmes, and public role. This site carries the live ranking, the scoring workbook, and the methodological doctrine.",
    resourceLabel: "Resources",
    resourcesTitle: "Resources highlighted there",
    resources: [
      {
        title: "Company profile",
        body: "A downloadable overview of SLIC services, team, and projects, intended as the institutional companion to the ranking site.",
      },
      {
        title: "Smart city guide",
        body: "A public-facing primer built with partners to explain the fundamentals of practical smart-city development.",
      },
    ],
    bridgeTitle: "How this relates to the ranking site",
    bridgeBody:
      "This ranking site is the analytical publication surface: methodology, live board, Thailand track, and the scoring workbook. The external SLIC page is the broader organizational and programme surface behind that work.",
    partnersLabel: "Partners",
    externalLabel: "Open the official SLIC page",
    methodologyLabel: "Open the methodology paper",
  },
  th: {
    eyebrow: "ข้อมูลองค์กร",
    title: "ภาพรวมของ SLIC ที่อยู่เบื้องหลังดัชนี",
    intro:
      "หน้า SLIC ภายนอกเป็นโปรไฟล์องค์กรในภาพกว้าง อธิบายว่า SLIC คือใคร ทำงานกับเมืองอย่างไร และดัชนีนี้เชื่อมอยู่ภายในระบบงานเมืองอัจฉริยะ การศึกษา และนวัตกรรมสาธารณะที่ใหญ่กว่าอย่างไร",
    summaryTitle: "สรุปจากหน้าเว็บไซต์ภายนอก",
    summary: [
      "SLIC วางตัวเป็นบริษัทและพันธมิตรนวัตกรรมด้านเมืองอัจฉริยะจากไทย ที่เน้นข้อมูล การออกแบบที่ยึดคนเป็นศูนย์กลาง และการลงมือทำจริง มากกว่าการสร้างภาพเทคโนโลยีลอย ๆ",
      "บทบาทขององค์กรกว้างกว่าดัชนีนี้ ครอบคลุมทั้งที่ปรึกษา การเชื่อมเครือข่าย การพัฒนาศักยภาพ และการร่วมสร้างโครงการร่วมกับภาครัฐ เอกชน มหาวิทยาลัย และภาคประชาชน",
      "ตัวเว็บไซต์เป็นโปรไฟล์สาธารณะแบบหลายภาษา มีทั้งภารกิจ บริการ โครงการหลัก กิจกรรมสาธารณะ พันธมิตร และเอกสารดาวน์โหลด",
    ],
    deliveryLabel: "โมเดลการทำงาน",
    serviceTitle: "โมเดลการทำงาน 4C",
    deliverySummary:
      "นี่คือกรอบปฏิบัติการที่อยู่เบื้องหลังดัชนี ทั้งการให้คำปรึกษา การเชื่อมเครือข่าย การฝึกอบรม และการร่วมสร้างโครงการเมืองจริง",
    programmeLabel: "โปรแกรม",
    services: [
      {
        title: "Consult",
        body: "ให้คำปรึกษาเชิงกลยุทธ์แก่เมืองและผู้พัฒนาเอกชนเรื่องเทคโนโลยีเมือง ความยั่งยืน และลำดับความสำคัญของการเปลี่ยนผ่าน",
      },
      {
        title: "Connect",
        body: "เชื่อมหน่วยงานรัฐ มหาวิทยาลัย ผู้ประกอบการ และผู้ให้บริการเทคโนโลยีให้ทำงานร่วมกันได้จริง",
      },
      {
        title: "Capacity Building",
        body: "สร้างความรู้และทักษะให้เจ้าหน้าที่ ทีมท้องถิ่น และผู้นำเมืองที่ต้องผลักโครงการจริง ไม่ใช่เพียงซื้อเทคโนโลยี",
      },
      {
        title: "Co-create",
        body: "ร่วมออกแบบและดำเนินงานผ่านความร่วมมือรัฐ-เอกชน-ประชาชน ตั้งแต่แนวคิดจนถึงการประเมินผล",
      },
    ],
    programTitle: "งานหลักที่หน้าเว็บไซต์ภายนอกนำเสนอ",
    programmeSummary:
      "หน้าเว็บไซต์ภายนอกวาง SLIC ไว้มากกว่าผู้เผยแพร่รายงาน เพราะนำเสนอระบบงานที่เชื่อมข้อมูล การศึกษา งานอีเวนต์ และการทำงานเชิงปฏิบัติจริงเข้าด้วยกัน",
    programs: [
      {
        kicker: "แพลตฟอร์มหลัก",
        title: "Thailand Smart City Data Platform",
        body: "แพลตฟอร์มรับฟังเมืองและวิเคราะห์ข้อมูลด้วย AI เพื่อเปลี่ยนสัญญาณและข้อมูลสาธารณะให้เป็นข้อมูลเชิงปฏิบัติการสำหรับการตัดสินใจ",
      },
      {
        kicker: "การเรียนรู้",
        title: "Metaverse Classroom",
        body: "โครงการการเรียนรู้แบบ immersive ที่ผลักดันการเรียน STEM และสภาพแวดล้อมการเรียนรู้ดิจิทัลในโรงเรียนไทย",
      },
      {
        kicker: "เวทีสาธารณะ",
        title: "SLICx Expo",
        body: "พื้นที่หลักสำหรับปาฐกถา โชว์เคสเทคโนโลยี การสร้างพันธมิตร และการสนทนาสาธารณะเรื่องเมืองอัจฉริยะ",
      },
      {
        kicker: "ภาวะผู้นำ",
        title: "หลักสูตร LFC",
        body: "หลักสูตรผู้นำและการลงมือทำที่เน้นการเปลี่ยนเมืองอย่างเป็นรูปธรรม การฟังประชาชน ธรรมาภิบาล การเงิน และการใช้ AI",
      },
    ],
    publicationLabel: "บริบทของสิ่งพิมพ์",
    publicationTitle: "หน้าองค์กรและหน้าดัชนีจึงเชื่อมโยงกันเป็นระบบเดียว",
    publicationSummary:
      "หน้าหนึ่งอธิบายองค์กร โปรแกรม และบทบาทสาธารณะ ส่วนเว็บไซต์นี้ทำหน้าที่เป็นพื้นที่เผยแพร่บอร์ดแบบสด เวิร์กบุ๊กคะแนน และระเบียบวิธี",
    resourceLabel: "ทรัพยากร",
    resourcesTitle: "เอกสารและทรัพยากรที่ถูกเน้น",
    resources: [
      {
        title: "Company profile",
        body: "เอกสารภาพรวมบริการ ทีมงาน และโครงการของ SLIC ซึ่งทำหน้าที่เป็นภาคคู่ขนานกับเว็บไซต์ดัชนีนี้",
      },
      {
        title: "Smart city guide",
        body: "คู่มือสาธารณะว่าด้วยพื้นฐานการพัฒนาเมืองอัจฉริยะเชิงปฏิบัติที่จัดทำร่วมกับพันธมิตร",
      },
    ],
    bridgeTitle: "ความเชื่อมโยงกับเว็บไซต์ดัชนี",
    bridgeBody:
      "เว็บไซต์นี้คือพื้นที่เผยแพร่เชิงวิเคราะห์ของดัชนี ทั้งระเบียบวิธี บอร์ดแบบสด เส้นทางประเทศไทย และเวิร์กบุ๊กคะแนน ส่วนเว็บไซต์ SLIC ภายนอกคือภาพรวมองค์กรและระบบโครงการที่อยู่เบื้องหลังงานทั้งหมดนั้น",
    partnersLabel: "พันธมิตร",
    externalLabel: "เปิดเว็บไซต์ SLIC อย่างเป็นทางการ",
    methodologyLabel: "เปิดหน้าระเบียบวิธี",
  },
  zh: {
    eyebrow: "机构概况",
    title: "指数背后的 SLIC 组织全貌",
    intro:
      "外部的 SLIC 页面是更完整的机构介绍，说明 SLIC 是谁、如何与城市合作，以及这个指数如何嵌入更大的智慧城市、教育与公共创新平台之中。",
    summaryTitle: "外部页面的核心信息",
    summary: [
      "SLIC 把自己定位为来自泰国的智慧城市咨询与创新伙伴，强调数据、人本设计与实际落地，而不是空泛的技术包装。",
      "它的公开角色比排名更广，涵盖咨询、生态连接、能力建设，以及与政府、企业、大学和市民网络的共同创造。",
      "该网站是一个多语种机构页面，包含使命、服务、旗舰项目、公共活动、合作伙伴与下载资源。",
    ],
    deliveryLabel: "交付模型",
    serviceTitle: "4C 交付模型",
    deliverySummary:
      "这就是指数背后的更大操作框架：咨询、连接、培训，以及共同建设真实的城市项目。",
    programmeLabel: "项目与计划",
    services: [
      {
        title: "Consult",
        body: "为城市政府与私营开发者提供有关城市科技、可持续性与转型优先级的战略咨询。",
      },
      {
        title: "Connect",
        body: "连接政府机构、大学、创业者与技术提供方，形成真正可运作的合作网络。",
      },
      {
        title: "Capacity Building",
        body: "为官员、本地团队与城市领导者提供执行真实项目所需的知识和能力，而不只是采购技术。",
      },
      {
        title: "Co-create",
        body: "通过政产民协作共同设计和实施项目，从概念到评估形成闭环。",
      },
    ],
    programTitle: "外部页面展示的旗舰工作",
    programmeSummary:
      "外部页面把 SLIC 描绘成一个不仅发布报告的机构，而是一个连接数据产品、教育、活动与实施工作的操作生态。",
    programs: [
      {
        kicker: "核心平台",
        title: "Thailand Smart City Data Platform",
        body: "一个 AI 辅助的城市聆听与分析平台，把公共数据和噪音信号转化为城市运营智能。",
      },
      {
        kicker: "学习",
        title: "Metaverse Classroom",
        body: "围绕 STEM 参与和数字化学习场景构建的沉浸式教育项目。",
      },
      {
        kicker: "公共汇聚",
        title: "SLICx Expo",
        body: "一个用于主题演讲、技术展示、伙伴协作和智慧城市公共讨论的旗舰活动界面。",
      },
      {
        kicker: "领导力",
        title: "LFC Programme",
        body: "面向城市领导与项目执行的课程，重点放在实践型智慧城市转型、公民倾听、治理、融资与 AI 赋能交付。",
      },
    ],
    publicationLabel: "发布语境",
    publicationTitle: "机构页面与排名页面现在形成了清晰分工。",
    publicationSummary:
      "一个页面解释组织、计划与公共角色；这个站点则承担实时榜单、评分工作簿与方法论发布。",
    resourceLabel: "资源",
    resourcesTitle: "页面上强调的资源",
    resources: [
      {
        title: "公司简介",
        body: "下载式机构资料，总览 SLIC 的服务、团队与项目，可视作本排名站点的机构补充面。",
      },
      {
        title: "智慧城市指南",
        body: "与伙伴共同制作的公开指南，用于解释实践型智慧城市建设的基础框架。",
      },
    ],
    bridgeTitle: "它与本排名站点的关系",
    bridgeBody:
      "这个站点是分析发布面：方法论、实时榜单、泰国分榜和评分工作簿。外部 SLIC 页面则是这些工作的机构、项目与公共计划总面。",
    partnersLabel: "合作伙伴",
    externalLabel: "打开官方 SLIC 页面",
    methodologyLabel: "打开方法论文",
  },
};
