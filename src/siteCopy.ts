import type { Locale } from "./types";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
};

export const siteCopy = {
  en: {
    nav: {
      home: "Home",
      aboutSlic: "About SLIC",
      methodology: "Methodology",
      rankings: "Rankings",
      exercise: "Exercise",
      thailand: "Thailand",
      ideas: "Steal This Idea",
      essay: "Essay",
      compare: "Compare",
      history: "The Journey",
      timeMachine: "V2 Archive",
    },
    shared: {
      updated: "Updated",
      allRegions: "All",
      exportCsv: "Export filtered CSV",
      downloadSheetTemplate: "Download sheet template",
      liveTop10: "Preview top 10",
      openFullRanking: "Open the ranking preview",
      coreBoard: "Screened board",
      extendedField: "candidate field",
      liveStatus: "Published ranking live",
      liveScope: "163 published cities / five public pillars / verified workbook export",
      localTime: "Local time",
    },
    rankings: {
      eyebrow: "Global ranking",
      title: "SLIC city ranking",
      intro:
        "Top 10 stays card-based for depth. From rank 11 onward, the list shifts into a table while the spreadsheet template carries the transparent input, source-trail, and recalculation workflow.",
      tieNote:
        "When cities sit in the same score band, live momentum breaks the tie. SLIC does not reshuffle cities arbitrarily just to manufacture motion.",
      scopeLabel: "Board scope",
      regionLabel: "Region filter",
      scopeSummary:
        "The public core board applies baseline screens for safety confidence, coercive civic atmosphere, and disposable room to live. The extended field keeps the full candidate set visible for benchmarking and workbook review.",
      topTenTitle: "Top 10 cards",
      topTenSummary:
        "These cards foreground the lived-economy variables: PPP income, post-tax disposable room, early-career housing load, safety, tolerance, business climate, healthcare, education, ecology, and diversity of experience.",
      tableTitle: "Remaining ranked cities",
      tableSummary:
        "The full list remains sortable by score mode and filterable by region. Use the spreadsheet template to inspect formulas, attach trusted sources, and recompute the board transparently.",
      finePrintEyebrow: "Publication note",
      finePrintTitle: "How to reuse, cite, and read this ranking",
      finePrintSummary:
        "SLIC is intended to be quoted, studied, replicated, and criticised in public. The key condition is attribution and honest description of how the board is produced.",
      usageLabel: "Public-use notice",
      usageBody:
        "This ranking may be quoted, discussed, benchmarked, taught, or reused for editorial, research, classroom, and non-deceptive public-interest work, provided the source remains visible and no one implies paid placement or endorsement.",
      creditLabel: "Suggested credit",
      creditBody:
        "Suggested credit: Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [date of access]. Include the deployment URL of the public page when republishing.",
      aiLabel: "Algorithmic and AI disclosure",
      aiBody:
        "This ranking is published from the verified SLIC workbook export. Each city carries one public score, five public pillars, and workbook-level provenance.",
      liveLabel: "Live-system note",
      liveBody:
        "Rankings are published from the verified workbook export. Each city number is traceable through declared pillar weights, coverage grades, and workbook-backed sources.",
      cautionLabel: "Reading note",
      cautionBody:
        "Read the ranking as a declared measurement frame with known limits. It is not investment advice, legal advice, or a claim that one metric can settle what every city means to every person.",
      income: "PPP income / head",
      disposable: "Post-tax PPP room",
      housing: "Graduate housing load",
      healthcare: "Healthcare",
      education: "Education",
      ecology: "Ecology",
      diversity: "Experience diversity",
      business: "Creative & growth",
      safety: "Safety",
      tolerance: "Tolerance",
      localClock: "City clock",
      openingEase: "Opening ease",
      taxRegime: "Tax regime",
      stability: "Stability",
      incentives: "Incentives",
      listening: "Listening pulse",
      topics: "Conversation",
      culturalDemand: "Cultural demand",
      rationale: "Why this city is here",
      rank: "Rank",
      city: "City",
      country: "Country",
      region: "Region",
      score: "Score",
      access: "Access",
    },
    thailand: {
      eyebrow: "Thailand index",
      title: "Thailand ranking scaffold",
      intro:
        "This companion track is where province-level GDP, pollution, hospitals, schools, infrastructure, income, longevity, and competitiveness will be compared across Thailand.",
      note:
        "The data workbook already has a Thai scoring scaffold. The public page is the next surface to expand once province and city feeds are loaded.",
    },
    footer: {
      eyebrow: "SLIC disclosure",
      title: "Transparent city ranking infrastructure",
      summary:
        "This build is a public-facing SLIC prototype for ranking cities through lived viability, dignity, community, and creative economic energy.",
      transparencyLabel: "Transparency and privacy",
      disclosure:
        "No city, developer, government, vendor, or sponsor paid for inclusion, weighting, placement, or editorial treatment in this index.",
      privacy:
        "This build is designed around public, aggregated, city-level and country-level data. Experimental testimony or social-listening layers must be aggregated and non-personal before publication.",
      coverage:
        "Coverage grades, fallback proxies, and missing-data rules remain visible. High GDP alone does not determine rank.",
      collaborationLabel: "Prepared in collaboration with",
      collaboration:
        "Created by Non Arkara and Associate Professor Poon Thiengburanathum as a SLIC product prepared in collaboration with the Ministry of Digital Economy and Society, the Digital Economy Promotion Agency, Smart City Thailand Office, and Axiom × ReTL.",
      note:
        "Methodology, weights, and source hierarchy remain declared. The next publishable release must attach trusted source URLs, source tiers, and workbook-derived scores before reopening the public ranking as final.",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      aboutSlic: "เกี่ยวกับ SLIC",
      methodology: "ระเบียบวิธี",
      rankings: "การจัดอันดับ",
      exercise: "แบบฝึกหาเมือง",
      thailand: "อันดับประเทศไทย",
      ideas: "ขโมยไอเดียนี้",
      essay: "บทความ",
      compare: "เปรียบเทียบ",
      history: "เบื้องหลัง",
      timeMachine: "V2",
    },
    shared: {
      updated: "อัปเดต",
      allRegions: "ทั้งหมด",
      exportCsv: "ส่งออก CSV ตามตัวกรอง",
      downloadSheetTemplate: "ดาวน์โหลดเทมเพลตสเปรดชีต",
      liveTop10: "10 อันดับตัวอย่าง",
      openFullRanking: "เปิดบอร์ดอันดับตัวอย่าง",
      coreBoard: "บอร์ดที่ผ่านเกณฑ์",
      extendedField: "ชุดเมืองทั้งหมด",
      liveStatus: "กำลังจัดอันดับใหม่ด้วยข้อมูลที่ตรวจสอบได้",
      liveScope: "163 เมืองที่เผยแพร่แล้ว / 5 เสาหลักสาธารณะ / การส่งออกเวิร์กบุ๊กที่ได้รับการยืนยัน",
      localTime: "เวลาท้องถิ่น",
    },
    rankings: {
      eyebrow: "การจัดอันดับโลก",
      title: "การจัดอันดับเมือง SLIC",
      intro:
        "10 อันดับแรกจะแสดงเป็นการ์ดเพื่อให้เห็นรายละเอียด ส่วนอันดับที่ 11 ลงไปจะเป็นตาราง ขณะที่เทมเพลตสเปรดชีตรับหน้าที่เรื่องอินพุต แหล่งอ้างอิง และการคำนวณใหม่อย่างโปร่งใส",
      tieNote:
        "เมื่อเมืองอยู่ในช่วงคะแนนเดียวกัน ระบบจะใช้โมเมนตัมสดเป็นตัวตัดสิน ไม่ได้สลับอันดับแบบสุ่มเพื่อสร้างภาพว่ามีความเคลื่อนไหว",
      scopeLabel: "ขอบเขตบอร์ด",
      regionLabel: "ตัวกรองภูมิภาค",
      scopeSummary:
        "บอร์ดหลักสาธารณะจะกรองผ่านเกณฑ์ความปลอดภัย บรรยากาศกดดันแบบควบคุมเข้ม และพื้นที่รายได้ใช้สอยจริง ส่วนชุดเมืองทั้งหมดจะยังเปิดไว้เพื่อการเปรียบเทียบและการทบทวนผ่านเวิร์กบุ๊ก",
      topTenTitle: "การ์ด 10 อันดับแรก",
      topTenSummary:
        "การ์ดแต่ละใบเน้นตัวแปรชีวิตจริง ได้แก่ รายได้แบบ PPP พื้นที่รายได้หลังภาษี ภาระที่อยู่อาศัยของคนเริ่มทำงาน ความปลอดภัย ความอดทนต่อความแตกต่าง สภาพแวดล้อมธุรกิจ สุขภาพ การศึกษา นิเวศวิทยา และความหลากหลายของประสบการณ์",
      tableTitle: "เมืองที่เหลือในอันดับ",
      tableSummary:
        "รายการทั้งหมดสลับโหมดคะแนนและกรองตามภูมิภาคได้ ส่วนเทมเพลตสเปรดชีตใช้สำหรับตรวจสูตร แนบแหล่งข้อมูลที่เชื่อถือได้ และคำนวณบอร์ดใหม่อย่างโปร่งใส",
      finePrintEyebrow: "หมายเหตุการเผยแพร่",
      finePrintTitle: "แนวทางการนำไปใช้ อ้างอิง และอ่านอันดับนี้",
      finePrintSummary:
        "SLIC ตั้งใจให้ถูกอ้างถึง ศึกษา ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ เงื่อนไขสำคัญคือการให้เครดิตและการอธิบายอย่างตรงไปตรงมาว่าบอร์ดนี้ถูกสร้างขึ้นอย่างไร",
      usageLabel: "ประกาศการใช้งานสาธารณะ",
      usageBody:
        "การจัดอันดับนี้สามารถนำไปอ้างถึง สนทนา เปรียบเทียบ ใช้ในการเรียนการสอน งานวิจัย หรือการสื่อสารสาธารณะได้ ตราบใดที่แหล่งที่มาชัดเจน และไม่มีการสื่อให้เข้าใจว่าเมืองใดจ่ายเงินเพื่อซื้ออันดับหรือได้รับการรับรองเป็นพิเศษ",
      creditLabel: "รูปแบบการให้เครดิตที่แนะนำ",
      creditBody:
        "ตัวอย่างการให้เครดิต: Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [วันที่เข้าถึง]. เมื่อนำไปเผยแพร่ต่อควรแนบ URL ของหน้าสาธารณะที่ใช้ด้วย",
      aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
      aiBody:
        "การจัดอันดับนี้เผยแพร่จากการส่งออกเวิร์กบุ๊ก SLIC ที่ผ่านการตรวจสอบแล้ว แต่ละเมืองมีคะแนนสาธารณะหนึ่งค่า 5 เสาหลักสาธารณะ และเส้นทางแหล่งที่มาระดับเวิร์กบุ๊ก",
      liveLabel: "หมายเหตุเรื่องระบบสด",
      liveBody:
        "อันดับถูกเผยแพร่จากการส่งออกเวิร์กบุ๊กที่ผ่านการตรวจสอบแล้ว ตัวเลขของแต่ละเมืองสามารถไล่ย้อนกลับได้ผ่านน้ำหนักเสาหลักที่ประกาศ เกรดความครอบคลุม และแหล่งข้อมูลที่รองรับในเวิร์กบุ๊ก",
      cautionLabel: "ข้อควรอ่าน",
      cautionBody:
        "โปรดอ่านอันดับนี้ในฐานะกรอบการวัดที่ประกาศชัดเจนและมีข้อจำกัด ไม่ใช่คำแนะนำด้านการลงทุน กฎหมาย หรือคำอ้างว่าตัวชี้วัดเดียวสามารถตัดสินความหมายของเมืองสำหรับทุกคนได้",
      income: "รายได้ต่อหัวแบบ PPP",
      disposable: "พื้นที่รายได้หลังภาษี",
      housing: "ภาระที่อยู่อาศัยของคนเริ่มทำงาน",
      healthcare: "สาธารณสุข",
      education: "การศึกษา",
      ecology: "นิเวศวิทยา",
      diversity: "ความหลากหลายของประสบการณ์",
      business: "สร้างสรรค์และการเติบโต",
      safety: "ความปลอดภัย",
      tolerance: "ความเปิดกว้าง",
      localClock: "เวลาของเมือง",
      openingEase: "ความง่ายในการเริ่มธุรกิจ",
      taxRegime: "ภาระภาษี",
      stability: "เสถียรภาพ",
      incentives: "แรงจูงใจ",
      listening: "ชีพจรการพูดถึง",
      topics: "ประเด็นสนทนา",
      culturalDemand: "แรงดึงดูดทางวัฒนธรรม",
      rationale: "เหตุผลที่เมืองนี้อยู่ในลิสต์",
      rank: "อันดับ",
      city: "เมือง",
      country: "ประเทศ",
      region: "ภูมิภาค",
      score: "คะแนน",
      access: "การเข้าถึง",
    },
    thailand: {
      eyebrow: "ดัชนีประเทศไทย",
      title: "โครงร่างอันดับประเทศไทย",
      intro:
        "เส้นทางนี้ใช้เปรียบเทียบ GDP ระดับจังหวัด มลพิษ โรงพยาบาล โรงเรียน โครงสร้างพื้นฐาน รายได้ อายุยืน และความสามารถในการแข่งขันทั่วประเทศ",
      note:
        "ในเวิร์กบุ๊กมีโครงสร้างคะแนนไทยอยู่แล้ว หน้าสาธารณะจะขยายต่อเมื่อข้อมูลจังหวัดและเมืองถูกป้อนเข้ามา",
    },
    footer: {
      eyebrow: "คำชี้แจง SLIC",
      title: "โครงสร้างการจัดอันดับเมืองที่โปร่งใส",
      summary:
        "หน้านี้เป็นต้นแบบสาธารณะของ SLIC สำหรับจัดอันดับเมืองผ่านคุณภาพชีวิตจริง ศักดิ์ศรี ความเป็นชุมชน และพลังเศรษฐกิจเชิงสร้างสรรค์",
      transparencyLabel: "ความโปร่งใสและความเป็นส่วนตัว",
      disclosure:
        "ไม่มีเมือง ผู้พัฒนา รัฐบาล ผู้ขาย หรือผู้สนับสนุนรายใดจ่ายเงินเพื่อการบรรจุ การถ่วงน้ำหนัก การจัดลำดับ หรือการนำเสนอในดัชนีนี้",
      privacy:
        "ต้นแบบนี้ออกแบบจากข้อมูลสาธารณะและข้อมูลรวมระดับเมืองและประเทศเท่านั้น ส่วนชั้นข้อมูลทดลองเชิงคำบอกเล่าหรือ social listening ต้องถูกรวมและตัดข้อมูลส่วนบุคคลก่อนเผยแพร่",
      coverage:
        "เกรดความครอบคลุม ตัวแทนข้อมูล และกติกาข้อมูลขาดหายจะถูกเปิดเผยอย่างชัดเจน GDP สูงเพียงอย่างเดียวไม่ทำให้เมืองชนะ",
      collaborationLabel: "จัดทำร่วมกับ",
      collaboration:
        "สร้างโดย Non Arkara และ Associate Professor Poon Thiengburanathum ในฐานะผลิตภัณฑ์ SLIC ที่จัดทำร่วมกับกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม สำนักงานส่งเสริมเศรษฐกิจดิจิทัล Smart City Thailand Office และ Axiom × ReTL",
      note:
        "ระเบียบวิธี น้ำหนัก และลำดับชั้นแหล่งข้อมูลยังคงประกาศอย่างชัดเจน รุ่นที่พร้อมเผยแพร่จริงต้องแนบ URL แหล่งข้อมูล ระดับแหล่งข้อมูล และคะแนนที่ได้จากเวิร์กบุ๊กก่อนเปิดอันดับสาธารณะอีกครั้งในฐานะฉบับสุดท้าย",
    },
  },
  zh: {
    nav: {
      home: "首页",
      aboutSlic: "关于 SLIC",
      methodology: "方法论",
      rankings: "排名",
      exercise: "匹配练习",
      thailand: "泰国榜单",
      ideas: "偷师这个创意",
      essay: "长文",
      compare: "对比排名",
      history: "发展历程",
      timeMachine: "V2",
    },
    shared: {
      updated: "更新于",
      allRegions: "全部",
      exportCsv: "导出筛选后的 CSV",
      downloadSheetTemplate: "下载表格模板",
      liveTop10: "预览前10",
      openFullRanking: "打开榜单预览",
      coreBoard: "筛选榜单",
      extendedField: "候选城市池",
      liveStatus: "已验证数据重排进行中",
      liveScope: "163 座已发布城市 / 五个公开支柱 / 已验证的工作簿导出",
      localTime: "当地时间",
    },
    rankings: {
      eyebrow: "全球榜单",
      title: "SLIC 城市排名",
      intro:
        "前10名继续用卡片展示，以保留信息密度；第11名以后改为表格，而透明的输入、来源轨迹与重算流程则交给表格模板处理。",
      tieNote:
        "当城市处在同一分数带时，会用实时动量打破平局；SLIC 不会为了制造“动态感”而随意洗牌。",
      scopeLabel: "榜单范围",
      regionLabel: "地区筛选",
      scopeSummary:
        "公开核心榜单会先通过安全感、压迫性治理氛围、以及真实可支配生活空间的基础筛选。完整候选城市池仍然保留，用于基准比较与工作簿复核。",
      topTenTitle: "前10卡片",
      topTenSummary:
        "这些卡片突出真实生活变量：PPP 人均收入、税后可支配生活空间、初入职场住房负担、安全感、包容度、商业成长环境、医疗、教育、生态条件，以及生活体验的多样性。",
      tableTitle: "其余上榜城市",
      tableSummary:
        "完整榜单可按评分模式排序，也可按地区筛选。使用表格模板可以检查公式、附上可信来源，并透明地重算榜单。",
      finePrintEyebrow: "发布说明",
      finePrintTitle: "如何引用、复用并理解这份榜单",
      finePrintSummary:
        "SLIC 这份榜单本来就允许被引用、研究、复现与批评。关键条件是保留来源并诚实说明它是如何被生成的。",
      usageLabel: "公共使用说明",
      usageBody:
        "这份榜单可用于引用、讨论、教学、研究、媒体转载与公共基准比较，只要来源清楚、引用诚实，并且不暗示任何城市为排名付费或获得了额外背书。",
      creditLabel: "建议署名格式",
      creditBody:
        "建议署名：Non Arkara 与 Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC), public ranking model, accessed [访问日期]。转载时建议同时附上公开页面的部署 URL。",
      aiLabel: "算法与 AI 披露",
      aiBody:
        "本排名从经过核验的 SLIC 工作簿导出发布。每座城市都带有一个公开分数、五个公开支柱，以及工作簿层级的来源追溯。",
      liveLabel: "实时系统说明",
      liveBody:
        "排名从经过核验的工作簿导出发布。每座城市的数字都可以通过已声明的支柱权重、覆盖等级与工作簿来源回溯。",
      cautionLabel: "阅读提醒",
      cautionBody:
        "请将本排名理解为一套已声明且有边界的测量框架，而不是投资建议、法律建议，或声称单一指标就能定义一座城市对所有人的意义。",
      income: "PPP 调整后人均收入",
      disposable: "税后生活空间",
      housing: "初入职场住房负担",
      healthcare: "医疗",
      education: "教育",
      ecology: "生态",
      diversity: "体验多样性",
      business: "创造力与增长",
      safety: "安全",
      tolerance: "包容度",
      localClock: "城市时间",
      openingEase: "开业便利度",
      taxRegime: "税制",
      stability: "稳定性",
      incentives: "激励环境",
      listening: "舆情脉冲",
      topics: "讨论主题",
      culturalDemand: "文化吸引力",
      rationale: "入选理由",
      rank: "排名",
      city: "城市",
      country: "国家",
      region: "地区",
      score: "分数",
      access: "可及性",
    },
    thailand: {
      eyebrow: "泰国指数",
      title: "泰国榜单框架",
      intro:
        "这一条线将比较泰国各府的 GDP、人均收入、污染、医院、学校、基础设施、寿命与竞争力。",
      note:
        "工作簿里已经有泰国评分框架。等省级和城市数据接入后，公开页面就可以继续扩展。",
    },
    footer: {
      eyebrow: "SLIC 声明",
      title: "透明的城市排名基础设施",
      summary:
        "这是一个公开的 SLIC 原型，用来按真实生活可行性、尊严、共同体与创造性经济活力来理解城市。",
      transparencyLabel: "透明度与隐私",
      disclosure:
        "没有任何城市、开发商、政府机构、供应商或赞助方为进入榜单、权重设定、排名位置或编辑呈现支付费用。",
      privacy:
        "当前版本只面向公开、聚合的城市级与国家级数据。实验性的证词或社交聆听层在公开前必须被聚合并去除个人识别信息。",
      coverage:
        "数据覆盖等级、替代代理与缺失规则会被明确公开。高 GDP 本身不能决定名次。",
      collaborationLabel: "合作完成",
      collaboration:
        "该项目由 Non Arkara 与 Associate Professor Poon Thiengburanathum 共同发起，作为 SLIC 产品，与 Ministry of Digital Economy and Society、Digital Economy Promotion Agency、Smart City Thailand Office、Axiom × ReTL 协作完成。",
      note:
        "方法、权重与来源层级保持公开。下一版只有在附齐可信来源 URL、来源层级与工作簿导出分数后，才应重新开放为最终公开榜单。",
    },
  },
  ko: {
    nav: {
      home: "홈",
      aboutSlic: "SLIC 소개",
      methodology: "방법론",
      rankings: "순위",
      exercise: "도시 매칭",
      thailand: "태국 순위",
      ideas: "이 아이디어를 훔쳐가세요",
      essay: "에세이",
      compare: "비교",
      history: "개발 여정",
      timeMachine: "V2",
    },
    shared: {
      updated: "업데이트",
      allRegions: "전체",
      exportCsv: "필터링된 CSV 내보내기",
      downloadSheetTemplate: "스프레드시트 템플릿 다운로드",
      liveTop10: "상위 10개 미리보기",
      openFullRanking: "순위 미리보기 열기",
      coreBoard: "심사 완료 보드",
      extendedField: "후보 도시 전체",
      liveStatus: "공개 순위 게시됨",
      liveScope: "163개 공개 도시 / 5개 공개 지표 / 검증된 워크북 내보내기",
      localTime: "현지 시간",
    },
    rankings: {
      eyebrow: "글로벌 순위",
      title: "SLIC 도시 순위",
      intro:
        "상위 10개는 깊이 있는 카드 형식으로 유지됩니다. 11위부터는 표로 전환되며, 스프레드시트 템플릿이 투명한 입력값, 출처 추적, 재계산 워크플로를 담당합니다.",
      tieNote:
        "같은 점수대에 있을 경우, 실시간 모멘텀으로 순위를 결정합니다. SLIC은 인위적인 움직임을 만들기 위해 임의로 순위를 조정하지 않습니다.",
      scopeLabel: "보드 범위",
      regionLabel: "지역 필터",
      scopeSummary:
        "공개 핵심 보드는 안전 신뢰도, 강압적 시민 환경, 실질 가처분 생활 공간에 대한 기준선 심사를 적용합니다. 전체 후보 도시는 벤치마킹 및 워크북 검토를 위해 계속 공개됩니다.",
      topTenTitle: "상위 10개 카드",
      topTenSummary:
        "이 카드들은 생활 경제 변수를 중심에 둡니다. PPP 소득, 세후 가처분 여유, 초기 경력자 주거 부담, 안전, 포용성, 비즈니스 환경, 의료, 교육, 생태, 경험 다양성.",
      tableTitle: "나머지 순위 도시",
      tableSummary:
        "전체 목록은 점수 모드로 정렬하거나 지역별로 필터링할 수 있습니다. 스프레드시트 템플릿을 사용해 수식을 검토하고, 신뢰할 수 있는 출처를 첨부하고, 보드를 투명하게 재계산할 수 있습니다.",
      finePrintEyebrow: "게시 노트",
      finePrintTitle: "이 순위를 재사용, 인용, 해석하는 방법",
      finePrintSummary:
        "SLIC은 공개적으로 인용되고, 연구되고, 복제되고, 비판받도록 설계되었습니다. 핵심 조건은 출처를 밝히고 보드가 어떻게 만들어졌는지 정직하게 설명하는 것입니다.",
      usageLabel: "공개 이용 안내",
      usageBody:
        "이 순위는 출처가 명확하고 유료 배치나 보증을 암시하지 않는 한, 인용, 토론, 벤치마킹, 교육, 연구, 공공 이익 활동에 사용할 수 있습니다.",
      creditLabel: "권장 인용 형식",
      creditBody:
        "권장 인용: Non Arkara 및 Poon Thiengburanathum 부교수, Smart and Liveable Cities Index (SLIC), 공개 순위 모델, 접근일: [접근 날짜]. 재게시 시 공개 페이지의 배포 URL을 포함하세요.",
      aiLabel: "알고리즘 및 AI 공개",
      aiBody:
        "이 순위는 검증된 SLIC 워크북 내보내기에서 게시됩니다. 각 도시에는 공개 점수 하나, 5개의 공개 지표, 워크북 수준의 출처가 포함됩니다.",
      liveLabel: "라이브 시스템 노트",
      liveBody:
        "순위는 검증된 워크북 내보내기에서 게시됩니다. 각 도시 번호는 공표된 지표 가중치, 커버리지 등급, 워크북 기반 출처를 통해 추적할 수 있습니다.",
      cautionLabel: "읽기 노트",
      cautionBody:
        "이 순위를 알려진 한계가 있는 선언된 측정 프레임으로 읽어주세요. 투자 조언, 법적 조언, 또는 단일 지표가 모든 사람에게 도시의 의미를 결정할 수 있다는 주장이 아닙니다.",
      income: "PPP 1인당 소득",
      disposable: "세후 PPP 가처분 소득",
      housing: "초기 경력자 주거 부담",
      healthcare: "의료",
      education: "교육",
      ecology: "생태",
      diversity: "경험 다양성",
      business: "창조성 및 성장",
      safety: "안전",
      tolerance: "포용성",
      localClock: "도시 시간",
      openingEase: "창업 용이성",
      taxRegime: "세제",
      stability: "안정성",
      incentives: "인센티브",
      listening: "여론 동향",
      topics: "대화 주제",
      culturalDemand: "문화 수요",
      rationale: "이 도시가 포함된 이유",
      rank: "순위",
      city: "도시",
      country: "국가",
      region: "지역",
      score: "점수",
      access: "접근성",
    },
    thailand: {
      eyebrow: "태국 지수",
      title: "태국 순위 체계",
      intro:
        "이 보조 트랙은 태국 전역의 도별 GDP, 오염, 병원, 학교, 인프라, 소득, 수명, 경쟁력을 비교하는 곳입니다.",
      note:
        "워크북에는 이미 태국 점수 체계가 있습니다. 도 및 도시 데이터가 로드되면 공개 페이지를 다음으로 확장할 예정입니다.",
    },
    footer: {
      eyebrow: "SLIC 공개",
      title: "투명한 도시 순위 인프라",
      summary:
        "이 빌드는 실제 생활 가능성, 존엄성, 커뮤니티, 창의적 경제 에너지를 통해 도시를 순위화하는 SLIC의 공개 프로토타입입니다.",
      transparencyLabel: "투명성 및 개인정보 보호",
      disclosure:
        "어떤 도시, 개발자, 정부, 공급업체, 또는 후원자도 이 지수에서 포함, 가중치, 배치, 또는 편집 처리를 위해 대가를 지불하지 않았습니다.",
      privacy:
        "이 빌드는 공개적이고 집계된 도시 수준 및 국가 수준 데이터를 중심으로 설계되었습니다. 실험적인 증언 또는 소셜 리스닝 레이어는 게시 전에 집계되고 비개인적이어야 합니다.",
      coverage:
        "커버리지 등급, 대체 프록시, 누락 데이터 규칙은 공개됩니다. 높은 GDP만으로는 순위가 결정되지 않습니다.",
      collaborationLabel: "협력하여 제작",
      collaboration:
        "Non Arkara와 Poon Thiengburanathum 부교수가 SLIC 제품으로 디지털 경제사회부, 디지털 경제 진흥원, 태국 스마트시티 오피스, Axiom × ReTL과 협력하여 제작했습니다.",
      note:
        "방법론, 가중치, 출처 계층은 계속 공개됩니다. 다음 게시 가능한 릴리스는 최종 공개 순위로 다시 열리기 전에 신뢰할 수 있는 출처 URL, 출처 계층, 워크북 기반 점수를 첨부해야 합니다.",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      aboutSlic: "SLICについて",
      methodology: "方法論",
      rankings: "ランキング",
      exercise: "都市マッチング",
      thailand: "タイランキング",
      ideas: "このアイデアを盗め",
      essay: "エッセイ",
      compare: "比較",
      history: "開発の経緯",
      timeMachine: "V2",
    },
    shared: {
      updated: "更新",
      allRegions: "全て",
      exportCsv: "フィルター済みCSVエクスポート",
      downloadSheetTemplate: "スプレッドシートテンプレートのダウンロード",
      liveTop10: "上位10件のプレビュー",
      openFullRanking: "ランキングプレビューを開く",
      coreBoard: "審査済みボード",
      extendedField: "候補都市全体",
      liveStatus: "公開ランキング公開中",
      liveScope: "公開済み163都市 / 5つの公開指標 / 検証済みワークブックエクスポート",
      localTime: "現地時刻",
    },
    rankings: {
      eyebrow: "グローバルランキング",
      title: "SLIC都市ランキング",
      intro:
        "上位10件は深度のあるカード形式を維持します。11位以降はリストに切り替わり、スプレッドシートテンプレートが透明な入力値、出典追跡、再計算ワークフローを担います。",
      tieNote:
        "同一スコア帯にある場合、リアルタイムモメンタムで順位を決定します。SLICは動きを演出するために恣意的に並べ替えは行いません。",
      scopeLabel: "ボードの範囲",
      regionLabel: "地域フィルター",
      scopeSummary:
        "公開コアボードは安全信頼度、強制的な市民環境、実質的な可処分生活空間に対するベースラインスクリーニングを適用します。拡張フィールドはベンチマークとワークブックレビューのために全候補都市を公開し続けます。",
      topTenTitle: "上位10カード",
      topTenSummary:
        "これらのカードは生活経済変数を前面に出します。PPP所得、税引後可処分余力、キャリア初期の住宅負担、安全性、寛容度、ビジネス環境、医療、教育、生態系、体験の多様性。",
      tableTitle: "残りのランクイン都市",
      tableSummary:
        "全リストはスコアモードで並び替えたり、地域でフィルタリングできます。スプレッドシートテンプレートを使って数式を確認し、信頼できる出典を添付し、透明にボードを再計算できます。",
      finePrintEyebrow: "公開ノート",
      finePrintTitle: "このランキングの再利用・引用・読み方",
      finePrintSummary:
        "SLICは公に引用され、研究され、複製され、批判されることを意図しています。重要な条件は帰属表示と、このボードがどのように作成されたかの誠実な説明です。",
      usageLabel: "公開利用案内",
      usageBody:
        "このランキングは出典が明示され、有料掲載や保証を示唆しない限り、引用、議論、ベンチマーク、教育、研究、公共利益活動に使用できます。",
      creditLabel: "推奨引用形式",
      creditBody:
        "推奨引用：Non Arkara 及び Poon Thiengburanathum 准教授、Smart and Liveable Cities Index (SLIC)、公開ランキングモデル、アクセス日：[アクセス日]。再掲載時は公開ページの展開URLも含めてください。",
      aiLabel: "アルゴリズムとAIの開示",
      aiBody:
        "このランキングは検証済みのSLICワークブックエクスポートから公開されています。各都市には公開スコア1つ、5つの公開指標、ワークブックレベルの出典があります。",
      liveLabel: "ライブシステムノート",
      liveBody:
        "ランキングは検証済みワークブックエクスポートから公開されます。各都市の数値は宣言された指標ウェイト、カバレッジグレード、ワークブック出典を通じて追跡できます。",
      cautionLabel: "読み方のノート",
      cautionBody:
        "このランキングを、既知の限界を持つ宣言された測定フレームとして読んでください。投資アドバイス、法的アドバイス、または単一指標が全員にとっての都市の意味を決められるという主張ではありません。",
      income: "PPP一人当たり所得",
      disposable: "税引後PPP可処分所得",
      housing: "キャリア初期の住宅負担",
      healthcare: "医療",
      education: "教育",
      ecology: "生態系",
      diversity: "体験の多様性",
      business: "創造性と成長",
      safety: "安全性",
      tolerance: "寛容度",
      localClock: "都市時刻",
      openingEase: "創業のしやすさ",
      taxRegime: "税制",
      stability: "安定性",
      incentives: "インセンティブ",
      listening: "世論の動向",
      topics: "話題",
      culturalDemand: "文化的需要",
      rationale: "この都市が選ばれた理由",
      rank: "順位",
      city: "都市",
      country: "国",
      region: "地域",
      score: "スコア",
      access: "アクセシビリティ",
    },
    thailand: {
      eyebrow: "タイ指数",
      title: "タイランキングの枠組み",
      intro:
        "このコンパニオントラックは、タイ全土の県別GDP、汚染、病院、学校、インフラ、所得、寿命、競争力を比較する場所です。",
      note:
        "ワークブックにはすでにタイのスコア体系があります。県・都市データが読み込まれ次第、公開ページを拡張する予定です。",
    },
    footer: {
      eyebrow: "SLIC開示",
      title: "透明な都市ランキングインフラ",
      summary:
        "このビルドは、実際の生活持続性、尊厳、コミュニティ、創造的経済エネルギーを通じて都市をランク付けするSLICの公開プロトタイプです。",
      transparencyLabel: "透明性とプライバシー",
      disclosure:
        "いかなる都市、開発者、政府、ベンダー、またはスポンサーも、このインデックスへの掲載、重み付け、配置、または編集上の扱いに対して対価を支払っていません。",
      privacy:
        "このビルドは公開された集計済みの都市レベルおよび国レベルのデータを中心に設計されています。実験的な証言やソーシャルリスニング層は公開前に集計・匿名化する必要があります。",
      coverage:
        "カバレッジグレード、代替プロキシ、欠損データルールは公開されます。高いGDPだけでは順位は決まりません。",
      collaborationLabel: "協力して作成",
      collaboration:
        "Non ArkaraとPoon Thiengburanathum准教授がSLIC製品として、デジタル経済社会省、デジタル経済振興機構、タイスマートシティオフィス、Axiom × ReTLと共同で作成しました。",
      note:
        "方法論、重み、出典の階層は公開されています。次の公開可能なリリースは、最終的な公開ランキングとして再開する前に、信頼できる出典URL、出典層、ワークブックから導出したスコアを添付する必要があります。",
    },
  },
} as const;

export function getCopy(locale: Locale) {
  return siteCopy[locale];
}
