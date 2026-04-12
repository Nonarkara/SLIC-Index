import type { Locale } from "./types";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  zh: "中文",
};

export interface SiteCopy {
  nav: {
    home: string;
    aboutSlic: string;
    methodology: string;
    rankings: string;
    exercise: string;
    thailand: string;
    ideas: string;
    history: string;
    timeMachine: string;
    compare: string;
  };
  shared: {
    updated: string;
    allRegions: string;
    exportCsv: string;
    downloadSheetTemplate: string;
    liveTop10: string;
    openFullRanking: string;
    coreBoard: string;
    extendedField: string;
    liveStatus: string;
    liveScope: string;
    localTime: string;
  };
  app: {
    loading: {
      eyebrow: string;
      title: string;
      body: string;
    };
    titles: {
      about: string;
      methodology: string;
      rankings: string;
      thailand: string;
      ideas: string;
      history: string;
      city: string;
      default: string;
    };
  };
  home: {
    kicker: string;
    headline: string;
    deck: string;
    cities: string;
    pillars: string;
    visitors: string;
    gridKicker: string;
    gridNote: string;
    photoCaption: string;
    alphaTitle: string;
    beta: string;
    gamma: string;
    disagreeTitle: string;
    disagreeHint: string;
    allocatorHint: string;
    reset: string;
    fullComparison: string;
  };
  rankings: {
    eyebrow: string;
    title: string;
    intro: string;
    tieNote: string;
    scopeLabel: string;
    regionLabel: string;
    scopeSummary: string;
    topTenTitle: string;
    topTenSummary: string;
    tableTitle: string;
    tableSummary: string;
    finePrintEyebrow: string;
    finePrintTitle: string;
    finePrintSummary: string;
    usageLabel: string;
    usageBody: string;
    creditLabel: string;
    creditBody: string;
    aiLabel: string;
    aiBody: string;
    liveLabel: string;
    liveBody: string;
    cautionLabel: string;
    cautionBody: string;
    income: string;
    disposable: string;
    housing: string;
    healthcare: string;
    education: string;
    ecology: string;
    diversity: string;
    business: string;
    safety: string;
    tolerance: string;
    localClock: string;
    openingEase: string;
    taxRegime: string;
    stability: string;
    incentives: string;
    listening: string;
    topics: string;
    culturalDemand: string;
    rationale: string;
    rank: string;
    city: string;
    country: string;
    region: string;
    score: string;
    access: string;
    spiderHint: string;
    reset: string;
    allocatorTitle: string;
    allocatorHint: string;
    scenariosLabel: string;
    scenarioNomad: string;
    scenarioFamily: string;
    scenarioGrowth: string;
    canonicalBadge: string;
    customBadge: string;
    canonicalNote: string;
    whyThisRanking: string;
    whyExplanation: string;
    consequencesTitle: string;
    citiesLabel: string;
    top10: string;
    top50: string;
    showAll: string;
    allRegions: string;
    pillarHints: {
      pressure: string;
      viability: string;
      capability: string;
      community: string;
      creative: string;
    };
    labels: {
      coverage: string;
    };
  };
  thailand: {
    eyebrow: string;
    title: string;
    intro: string;
    note: string;
    ui: {
      scope: string;
      ranked: string;
      all: string;
      region: string;
      allRegions: string;
      sortBy: string;
      topProvinces: string;
      leadingOn: string;
      topSummary: string;
      fullTable: string;
      remaining: string;
      rank: string;
      rankLabel: string;
      province: string;
      regionColumn: string;
      gppPerCapita: string;
      avgIncome: string;
      perMonth: string;
      pm25: string;
      beds: string;
      crime: string;
      green: string;
      provisional: string;
      infraShort: string;
      patternsEyebrow: string;
      patternsTitle: string;
      patternsSummary: string;
      centralLabel: string;
      centralTitle: string;
      centralBody: string;
      northLabel: string;
      northTitle: string;
      northBody: string;
      isanLabel: string;
      isanTitle: string;
      isanBody: string;
      southEastLabel: string;
      southEastTitle: string;
      southEastBody: string;
    };
  };
  methodology: {
    ui: {
      openEquation: string;
      openPdf: string;
      downloadPdf: string;
      closePdf: string;
      pdfWindowTitle: string;
      pdfWindowNote: string;
      guide: string;
      critique: string;
      remote: string;
      scoring: string;
      glossary: string;
      example: string;
      models: string;
      references: string;
      rack: string;
      glossarySymbol: string;
      glossaryDefinition: string;
      glossaryExplanation: string;
      worksheetColumn: string;
      worksheetPurpose: string;
      worksheetSource: string;
      sourceTierLabel: string;
      protocolLabel: string;
      roleLabel: string;
      finalScore: string;
      illustrative: string;
      citations: string;
      contextLabel: string;
      dataMixTitle: string;
      dataMixSummary: string;
    };
  };
  ideas: {
    eyebrow: string;
    title: string;
    intro: string;
    category: string;
    difficulty: string;
    all: string;
    summary: string;
    problem: string;
    solution: string;
    impact: string;
    hideCode: string;
    showCode: string;
    starterCode: string;
    copied: string;
    copyCode: string;
    techStack: string;
    difficultyLabels: {
      starter: string;
      intermediate: string;
      advanced: string;
    };
  };
  compare: {
    eyebrow: string;
    title: string;
    scroll: string;
    kicker: string;
    gridNote: string;
    pullQuote: string;
    blindspotsTitle: string;
    blindspotsSub: string;
    photoCaption: string;
    notCoveredTitle: string;
    notCoveredBody1: string;
    notCoveredBody2: string;
    moneyballTitle: string;
    moneyballBody1: string;
    moneyballBody2: string;
    pillarsTitle: string;
    pillarsSub: string;
    workshopCaption: string;
    disagreeTitle: string;
    disagreeHint: string;
    openRankings: string;
    endorsementQuote: string;
    launchTitle: string;
    launchBody: string;
    exploreRankings: string;
    blindSpotLabels: {
      housing: string;
      overwork: string;
      tolerance: string;
      satisfaction: string;
      mentalStrain: string;
      graduateHousing: string;
      diversity: string;
      incomeAfterRent: string;
    };
    pillarDetails: {
      pressure: { name: string; desc: string };
      viability: { name: string; desc: string };
      capability: { name: string; desc: string };
      community: { name: string; desc: string };
      creative: { name: string; desc: string };
    };
  };
  history: {
    eyebrow: string;
    heading: string;
    subtitle: string;
  };
  compareCities: {
    eyebrow: string;
    title: string;
    clearAll: string;
    resetDefault: string;
    selectCity: string;
    globalRank: string;
    slicScore: string;
    localVibe: string;
    economicContext: string;
    selectPrompt: string;
  };
  footer: {
    eyebrow: string;
    title: string;
    summary: string;
    transparencyLabel: string;
    disclosure: string;
    privacy: string;
    coverage: string;
    collaborationLabel: string;
    collaboration: string;
    note: string;
    endnotes: {
      eyebrow: string;
      reuseLabel: string;
      reuseBody: string;
      creditLabel: string;
      creditBody: string;
      aiLabel: string;
      aiBody: string;
      liveLabel: string;
      liveBody: string;
    };
  };
}

export const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    nav: {
      home: "Home",
      aboutSlic: "About SLIC",
      methodology: "Methodology",
      rankings: "Rankings",
      exercise: "Exercise",
      thailand: "Thailand",
      ideas: "Steal This Idea",
      history: "The Journey",
      timeMachine: "V2 Archive",
      compare: "Side-by-Side",
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
      liveScope: "157 cities / 35 signals / 35 sources / verified workbook export",
      localTime: "Local time",
    },
    app: {
      loading: {
        eyebrow: "Loading view",
        title: "Preparing the next section.",
        body: "Pulling in the page module and interface assets.",
      },
      titles: {
        about: "About SLIC",
        methodology: "SLIC Methodology",
        rankings: "SLIC Rankings",
        thailand: "SLIC Thailand",
        ideas: "Steal This Idea",
        history: "How SLIC Was Built",
        city: "City Scorecard",
        default: "Smart and Liveable Cities Index",
      },
    },
    home: {
      kicker: "157 cities, 35 signals, zero bullshit",
      headline: "Every city ranking\nis a lie. Here's ours.",
      deck: "Not prestige. Not GDP. What’s left after rent, how long you work, whether your neighbors tolerate you.",
      cities: "cities",
      pillars: "pillars",
      visitors: "visitors",
      gridKicker: "SIX INDICES. SIDE BY SIDE.",
      gridNote: "Five indices, five methodologies, one answer. SLIC weights the world differently.",
      photoCaption: "SCSE 2026, Taipei — 3,000 professionals. A European mayor’s alliance asked to use SLIC instead of The Economist’s index.",
      alphaTitle: "These ten cities scored highest. Click any to see exactly why.",
      beta: "BETA",
      gamma: "GAMMA",
      disagreeTitle: "Now disagree with us.",
      disagreeHint: "Adjust the spider weights. This is your ranking, not ours.",
      allocatorHint: "Drag the spider web or use the sliders. Total stays at 100.",
      reset: "Reset",
      fullComparison: "THE FULL COMPARISON",
    },
    rankings: {
      eyebrow: "Global ranking",
      title: "SLIC city ranking",
      intro: "Top 10 stays card-based for depth. From rank 11 onward, the list shifts into a table.",
      tieNote: "When cities sit in the same score band, live momentum breaks the tie.",
      scopeLabel: "Board scope",
      regionLabel: "Region filter",
      scopeSummary: "The public core board applies baseline screens for safety and viability.",
      topTenTitle: "Top 10 cards",
      topTenSummary: "These cards foreground the lived-economy variables.",
      tableTitle: "Remaining ranked cities",
      tableSummary: "The full list remains sortable by score mode and filterable by region.",
      finePrintEyebrow: "Publication note",
      finePrintTitle: "How to reuse, cite, and read this ranking",
      finePrintSummary: "SLIC is intended to be quoted, studied, replicated, and criticised in public.",
      usageLabel: "Public-use notice",
      usageBody: "This ranking may be quoted for editorial and research work.",
      creditLabel: "Suggested credit",
      creditBody: "Suggested credit: Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC).",
      aiLabel: "Algorithmic and AI disclosure",
      aiBody: "This ranking is produced from the verified SLIC workbook export.",
      liveLabel: "Live-system note",
      liveBody: "Rankings are published from the verified workbook export.",
      cautionLabel: "Reading note",
      cautionBody: "The ranking should be read as a declared algorithmic judgement about city life.",
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
      spiderHint: "Drag markers or use preset weights to re-rank cities.",
      reset: "Reset weights",
      allocatorTitle: "Set your priorities",
      allocatorHint: "Drag the spider web or use the sliders. Total stays at 100.",
      scenariosLabel: "Life Scenarios",
      scenarioNomad: "Digital Nomad",
      scenarioFamily: "Family First",
      scenarioGrowth: "Max Growth",
      canonicalBadge: "SLIC canonical",
      customBadge: "Your priorities",
      canonicalNote: "SLIC default: G 25 / V 22 / C 18 / Co 15 / Cr 20",
      whyThisRanking: "Why this default ranking?",
      whyExplanation: "SLIC weights Growth highest (25%) because economic dynamism determines a city's trajectory.",
      consequencesTitle: "Trade-off insights",
      citiesLabel: "cities",
      top10: "Top 10",
      top50: "Top 50",
      showAll: "All",
      allRegions: "All",
      pillarHints: {
        pressure: "Economic dynamism, market forces, affordability as natural outcome",
        viability: "Safety, transit, clean air, climate & sunlight",
        capability: "Healthcare access, education, opportunity",
        community: "Belonging, tolerance, cultural life, birth rate",
        creative: "Innovation, research, entrepreneurship",
      },
      labels: {
        coverage: "Data coverage",
      },
    },
    thailand: {
      eyebrow: "Thailand index",
      title: "Thailand SLIC Index",
      intro: "National comparison across all 77 Thai provinces, mapping regional resilience and urban performance.",
      note: "Includes primary tourist hubs and industrial seaboard zones.",
      ui: {
        scope: "Scope",
        ranked: "Ranked",
        all: "All provinces",
        region: "Region",
        allRegions: "All",
        sortBy: "Sort by pillar",
        topProvinces: "Top provinces",
        leadingOn: "Leading on",
        topSummary: "Cards show score breakdowns across all pillars with key provincial metrics.",
        fullTable: "Full table",
        remaining: "Remaining provinces",
        rank: "Rank",
        rankLabel: "Rank",
        province: "Province",
        regionColumn: "Region",
        gppPerCapita: "GPP / capita",
        avgIncome: "Avg income",
        perMonth: "/mo",
        pm25: "PM2.5",
        beds: "Beds/10k",
        crime: "Crime",
        green: "Green %",
        provisional: "provisional",
        infraShort: "Infra",
        patternsEyebrow: "Regional patterns",
        patternsTitle: "What the provincial data reveals",
        patternsSummary: "Thailand's internal SLIC landscape shows sharp tradeoffs.",
        centralLabel: "Central",
        centralTitle: "Economic gravity, environmental cost",
        centralBody: "Bangkok and its satellites dominate on economy but face PM2.5 pressure.",
        northLabel: "North",
        northTitle: "Cultural richness, seasonal strain",
        northBody: "Chiang Mai and Chiang Rai score highest on culture but carry seasonal air quality burden.",
        isanLabel: "Northeast (Isan)",
        isanTitle: "Human warmth, economic gaps",
        isanBody: "Isan provinces score well on safety but face the lowest economic indicators.",
        southEastLabel: "South & East",
        southEastTitle: "Best air, uneven depth",
        southEastBody: "Coastal provinces have cleanest air but thinner health infrastructure.",
      },
    },
    methodology: {
      ui: {
        openEquation: "See the score equation",
        openPdf: "Read the technical PDF",
        downloadPdf: "Download PDF",
        closePdf: "Close paper",
        pdfWindowTitle: "SLIC technical methodology paper",
        pdfWindowNote: "Embedded reader for the downloadable English master edition.",
        guide: "Guide",
        critique: "Critique",
        remote: "Satellite layer",
        scoring: "Scoring",
        glossary: "Glossary",
        example: "Example",
        models: "Boundaries",
        references: "References",
        rack: "Knowledge rack",
        glossarySymbol: "Symbol",
        glossaryDefinition: "Definition",
        glossaryExplanation: "Explanation",
        worksheetColumn: "Column",
        worksheetPurpose: "Purpose",
        worksheetSource: "Primary source",
        sourceTierLabel: "Tier",
        protocolLabel: "Protocol",
        roleLabel: "Role",
        finalScore: "Final SLIC score",
        illustrative: "Illustrative preview computation",
        citations: "Citations",
        contextLabel: "Context term",
        dataMixTitle: "Data reliance mix",
        dataMixSummary: "The public model leans hardest on official urban and official macro data.",
      },
    },
    ideas: {
      eyebrow: "Steal This Idea",
      title: "Innovation Studio",
      intro: "Real city innovations with working code you can copy, adapt, and deploy.",
      category: "Category",
      difficulty: "Difficulty",
      all: "All",
      summary: "Click any card to reveal the working code snippet.",
      problem: "Problem",
      solution: "Solution",
      impact: "Impact",
      hideCode: "Hide code",
      showCode: "Show code",
      starterCode: "Starter code",
      copied: "Copied!",
      copyCode: "Copy code",
      techStack: "Tech stack",
      difficultyLabels: {
        starter: "Starter",
        intermediate: "Intermediate",
        advanced: "Advanced",
      },
    },
    compare: {
      eyebrow: "Deep Comparison",
      title: "Every city ranking is a lie.\nHere’s ours.",
      scroll: "scroll",
      kicker: "SIX INDICES. SIDE BY SIDE.",
      gridNote: "Five indices, five methodologies, one answer. SLIC asks a different question.",
      pullQuote: "“The difference between the world’s #1 city and #10 is 1.8 points out of 100.”",
      blindspotsTitle: "What they measure. What they miss.",
      blindspotsSub: "Only SLIC measures all eight.",
      photoCaption: "What liveability actually looks like: eye-level, human scale, daily life.",
      notCoveredTitle: "What we don’t cover yet.",
      notCoveredBody1: "SLIC ranks 157 cities across 35 signals.",
      notCoveredBody2: "V4 target: 350+ cities. Every new data point makes the index more honest.",
      moneyballTitle: "The Moneyball of city investment.",
      moneyballBody1: "You don’t have to invest in Vienna because the headlines told you to.",
      moneyballBody2: "Establishment indices measure where to send bankers. SLIC measures where your next office should actually be.",
      pillarsTitle: "So what does SLIC measure?",
      pillarsSub: "Five pillars. One formula. Every number traceable.",
      workshopCaption: "Testing the framework with city officials who actually run cities.",
      disagreeTitle: "Now disagree with us.",
      disagreeHint: "Adjust the spider weights. This is your ranking, not ours.",
      openRankings: "OPEN THE RANKINGS",
      endorsementQuote: "“They built the index. But you build the ranking.”",
      launchTitle: "Launched at SCSE 2026, Taipei.",
      launchBody: "Free. Public. Transparent. No paywall. No proprietary black box.",
      exploreRankings: "EXPLORE THE RANKINGS",
      blindSpotLabels: {
        housing: "Housing affordability",
        overwork: "Overwork / working hours",
        tolerance: "Tolerance / civic openness",
        satisfaction: "Resident satisfaction",
        mentalStrain: "Suicide / mental strain",
        graduateHousing: "Graduate housing burden",
        diversity: "Cultural diversity",
        incomeAfterRent: "Income after rent (PPP)",
      },
      pillarDetails: {
        pressure: { name: "Growth", desc: "Economic dynamism. What’s left after rent. Housing burden. Working-time pressure." },
        viability: { name: "Viability", desc: "Safety. Transit. Clean air. Digital infrastructure. Climate." },
        capability: { name: "Capability", desc: "Healthcare access. Education quality. Equal opportunity." },
        community: { name: "Community", desc: "Belonging. Tolerance. Cultural life. Whether your neighbors want you there." },
        creative: { name: "Creative", desc: "Entrepreneurial friction. Innovation intensity. Government stability." },
      },
    },
    history: {
      eyebrow: "THE JOURNEY",
      heading: "How the SLIC Index Was Built",
      subtitle: "Years of real fieldwork, stakeholder workshops, and ground-truth data collection.",
    },
    compareCities: {
      eyebrow: "Side-by-Side Comparator",
      title: "Compare up to 5 cities",
      clearAll: "Clear All",
      resetDefault: "Top 5 Default",
      selectCity: "+ Select City",
      globalRank: "Global Rank",
      slicScore: "SLIC Score",
      localVibe: "Local Vibe",
      economicContext: "Economic Context",
      selectPrompt: "Select Cities to Compare",
    },
    footer: {
      eyebrow: "SLIC disclosure",
      title: "Transparent city ranking infrastructure",
      summary: "This build is a public-facing SLIC prototype.",
      transparencyLabel: "Transparency and privacy",
      disclosure: "No city paid for inclusion in this index.",
      privacy: "This build is designed around public aggregated data.",
      coverage: "Coverage grades remain visible.",
      collaborationLabel: "Prepared in collaboration with",
      collaboration: "Created by Non Arkara and Associate Professor Poon Thiengburanathum.",
      note: "Methodology, weights, and source hierarchy remain declared.",
      endnotes: {
        eyebrow: "Publication protocol",
        reuseLabel: "Reuse and credit",
        reuseBody: "SLIC is intended for public citation, teaching, replication, and critique.",
        creditLabel: "Suggested credit",
        creditBody: "Non Arkara and Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC).",
        aiLabel: "Algorithmic and AI disclosure",
        aiBody: "This ranking is produced from the verified SLIC workbook.",
        liveLabel: "Continuous model",
        liveBody: "Rankings are published from the verified workbook export.",
      },
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
      history: "เบื้องหลัง",
      timeMachine: "V2",
      compare: "เปรียบเทียบ",
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
      liveStatus: "จัดอันดับใหม่",
      liveScope: "157 เมือง / 35 สัญญาณ / 35 แหล่งข้อมูล",
      localTime: "เวลาท้องถิ่น",
    },
    app: {
      loading: {
        eyebrow: "กำลังโหลดหน้า",
        title: "กำลังเตรียมส่วนถัดไป",
        body: "กำลังดึงโมดูลของหน้าและองค์ประกอบของอินเทอร์เฟซ",
      },
      titles: {
        about: "เกี่ยวกับ SLIC",
        methodology: "ระเบียบวิธี SLIC",
        rankings: "การจัดอันดับเมือง SLIC",
        thailand: "SLIC ประเทศไทย",
        ideas: "ขโมยไอเดียนี้",
        history: "เบื้องหลัง SLIC",
        city: "ดัชนีเมืองน่าอยู่",
        default: "ดัชนีเมืองน่าอยู่",
      },
    },
    home: {
      kicker: "157 เมือง 35 สัญญาณ ไม่มีมุก",
      headline: "ทุกการจัดอันดับเมืองคือคำลวง—\nนี่คือความจริงของเรา",
      deck: "ไม่ใช่ชื่อเสียง ไม่ใช่ GDP แต่คือเงินเหลือหลังค่าเช่า ชั่วโมงทำงาน และว่าเพื่อนบ้านรับคุณได้ไหม",
      cities: "เมือง",
      pillars: "เสาหลัก",
      visitors: "ผู้เข้าชม",
      gridKicker: "หกดัชนีเทียบกัน",
      gridNote: "ห้าดัชนี ห้าระเบียบวิธี คำตอบเดียว SLIC ให้น้ำหนักโลกต่างออกไป",
      photoCaption: "SCSE 2026 ไทเป — ผู้เชี่ยวชาญ 3,000 คน พันธมิตรนายกเทศมนตรียุโรปขอใช้ SLIC แทนดัชนี The Economist",
      alphaTitle: "สิบเมืองนี้ได้คะแนนสูงสุด คลิกเพื่อดูว่าทำไม",
      beta: "BETA",
      gamma: "GAMMA",
      disagreeTitle: "ตอนนี้ลองไม่เห็นด้วยกับเรา",
      disagreeHint: "ปรับน้ำหนักตามใจคุณ นี่คืออันดับของคุณ",
      allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวมคงที่ที่ 100",
      reset: "รีเซ็ต",
      fullComparison: "เปรียบเทียบเต็ม",
    },
    rankings: {
      eyebrow: "การจัดอันดับโลก",
      title: "การจัดอันดับเมือง SLIC",
      intro: "10 อันดับแรกจะแสดงเป็นการ์ดเพื่อให้เห็นรายละเอียด",
      tieNote: "เมื่อเมืองอยู่ในช่วงคะแนนเดียวกัน ระบบจะใช้โมเมนตัมสดเป็นตัวตัดสิน",
      scopeLabel: "ขอบเขตบอร์ด",
      regionLabel: "ตัวกรองภูมิภาค",
      scopeSummary: "บอร์ดหลักสาธารณะจะกรองผ่านเกณฑ์ความปลอดภัยและอากาศ",
      topTenTitle: "การ์ด 10 อันดับแรก",
      topTenSummary: "การ์ดแต่ละใบเน้นตัวแปรชีวิตจริงของคนในเมือง",
      tableTitle: "เมืองที่เหลือในอันดับ",
      tableSummary: "รายการทั้งหมดสลับโหมดคะแนนและกรองตามภูมิภาคได้",
      finePrintEyebrow: "หมายเหตุการเผยแพร่",
      finePrintTitle: "แนวทางการนำไปใช้ อ้างอิง และอ่านอันดับนี้",
      finePrintSummary: "SLIC ตั้งใจให้ถูกอ้างถึง ศึกษา ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ",
      usageLabel: "ประกาศการใช้งานสาธารณะ",
      usageBody: "การจัดอันดับนี้สามารถนำไปอ้างถึงในการเรียนการสอนและวิจัยตัวเมืองได้",
      creditLabel: "รูปแบบการให้เครดิตที่แนะนำ",
      creditBody: "ตัวอย่างการให้เครดิต: Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC).",
      aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
      aiBody: "การจัดอันดับนี้มาจากข้อมูลเวิร์กบุ๊ก SLIC ที่ได้รับการตรวจสอบแล้ว",
      liveLabel: "หมายเหตุเรื่องระบบสด",
      liveBody: "อันดับถูกเผยแพร่จากข้อมูลเวิร์กบุ๊กที่ได้รับการยืนยันล่าสุด",
      cautionLabel: "ข้อควรอ่าน",
      cautionBody: "อันดับนี้ควรถูกอ่านในฐานะการตัดสินใจเชิงอัลกอริทึมที่โปร่งใส",
      income: "รายได้ต่อหัวแบบ PPP",
      disposable: "พื้นที่รายได้หลังภาษี",
      housing: "ภาระที่อยู่อาศัย",
      healthcare: "สาธารณสุข",
      education: "การศึกษา",
      ecology: "นิเวศวิทยา",
      diversity: "ความหลากหลาย",
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
      culturalDemand: "แรงดึงดูดวัฒนธรรม",
      rationale: "เหตุผลที่เมืองนี้อยู่ในลิสต์",
      rank: "อันดับ",
      city: "เมือง",
      country: "ประเทศ",
      region: "ภูมิภาค",
      score: "คะแนน",
      access: "การเข้าถึง",
      spiderHint: "ลากจุดบนใยแมงมุมเพื่อจัดอันดับใหม่",
      reset: "รีเซ็ตน้ำหนัก",
      allocatorTitle: "ตั้งลำดับความสำคัญ",
      allocatorHint: "ลากใยแมงมุมหรือใช้แถบเลื่อน ผลรวมคงที่ที่ 100",
      scenariosLabel: "สถานการณ์ชีวิต",
      scenarioNomad: "ดิจิทัลโนแมด",
      scenarioFamily: "เพื่อครอบครัว",
      scenarioGrowth: "เน้นการเติบโต",
      canonicalBadge: "อันดับ SLIC",
      customBadge: "ลำดับของคุณ",
      canonicalNote: "ค่าเริ่มต้น SLIC: G 25 / V 22 / C 18 / Co 15 / Cr 20",
      whyThisRanking: "ทำไมอันดับเริ่มต้นนี้?",
      whyExplanation: "SLIC ให้น้ำหนักการเติบโตสูงสุด (25%) เพราะพลวัตเศรษฐกิจกำหนดทิศทางเมือง",
      consequencesTitle: "มุมมองข้อแลกเปลี่ยน",
      citiesLabel: "เมือง",
      top10: "10 อันดับ",
      top50: "50 อันดับ",
      showAll: "ทั้งหมด",
      allRegions: "ทั้งหมด",
      pillarHints: {
        pressure: "พลวัตเศรษฐกิจ กลไกตลาด ค่าครองชีพตามกลไก",
        viability: "ความปลอดภัย ขนส่ง อากาศ ภูมิอากาศ",
        capability: "สาธารณสุข การศึกษา โอกาส",
        community: "ความเป็นส่วนหนึ่ง ความอดทน วัฒนธรรม",
        creative: "นวัตกรรม วิจัย ผู้ประกอบการ",
      },
      labels: {
        coverage: "ครอบคลุมข้อมูล",
      },
    },
    thailand: {
      eyebrow: "ดัชนีประเทศไทย",
      title: "ดัชนี SLIC ประเทศไทย",
      intro: "การเปรียบเทียบระดับภูมิภาคและจังหวัดทั้ง 77 แห่ง แผนที่ความยืดหยุ่นของประเทศไทย",
      note: "ครอบคลุมศูนย์กลางการท่องเที่ยวและเขตอุตสาหกรรมหลัก",
      ui: {
        scope: "ขอบเขต",
        ranked: "จัดอันดับ",
        all: "ทุกจังหวัด",
        region: "ภูมิภาค",
        allRegions: "ทั้งหมด",
        sortBy: "เรียงตามเสาหลัก",
        topProvinces: "จังหวัดเด่น",
        leadingOn: "นำในด้าน",
        topSummary: "การ์ดแสดงคะแนนรายเสาหลักพร้อมตัวชี้วัดสำคัญของแต่ละจังหวัด",
        fullTable: "ตารางเต็ม",
        remaining: "จังหวัดที่เหลือ",
        rank: "อันดับ",
        rankLabel: "อันดับ",
        province: "จังหวัด",
        regionColumn: "ภูมิภาค",
        gppPerCapita: "GPP / คน",
        avgIncome: "รายได้เฉลี่ย",
        perMonth: "/ด.",
        pm25: "PM2.5",
        beds: "เตียง/หมื่นคน",
        crime: "อาชญากรรม",
        green: "พื้นที่สีเขียว %",
        provisional: "ชั่วคราว",
        infraShort: "โครงสร้าง",
        patternsEyebrow: "รูปแบบภูมิภาค",
        patternsTitle: "สิ่งที่ข้อมูลกำลังบอกเรา",
        patternsSummary: "ความยืดหยุ่นของแต่ละภูมิภาคมีความแตกต่างที่ชัดเจน",
        centralLabel: "ภาคกลาง",
        centralTitle: "แรงโน้มเศรษฐกิจ กับต้นทุนสิ่งแวดล้อม",
        centralBody: "กรุงเทพฯ และเมืองบริวารโดดเด่นด้านเศรษฐกิจแต่ต้องแลกกับฝุ่นและมลพิษ",
        northLabel: "ภาคเหนือ",
        northTitle: "วัฒนธรรมเข้มข้น แรงกดดันตามฤดูกาล",
        northBody: "เชียงใหม่และเชียงรายเด่นด้านวัฒนธรรมแต่มีปัญหาเรื่องมลพิษตามฤดูกาล",
        isanLabel: "ภาคตะวันออกเฉียงเหนือ",
        isanTitle: "ความอบอุ่น กับช่องว่างเศรษฐกิจ",
        isanBody: "อีสานทำได้ดีด้านความปลอดภัยและวัฒนธรรมแต่เศรษฐกิจยังต้องการการสนับสนุน",
        southEastLabel: "ภาคใต้และภาคตะวันออก",
        southEastTitle: "อากาศดีที่สุด แต่ความลึกไม่เท่ากัน",
        southEastBody: "เน้นการท่องเที่ยวและอากาศที่ใสสะอาดแต่สาธารณสุขยังต้องพัฒนาต่อ",
      },
    },
    methodology: {
      ui: {
        openEquation: "ดูสมการคะแนน",
        openPdf: "อ่าน Technical PDF",
        downloadPdf: "ดาวน์โหลด PDF",
        closePdf: "ปิดเอกสาร",
        pdfWindowTitle: "เอกสารเทคนิค SLIC",
        pdfWindowNote: "หน้าต่างอ่านเอกสารแบบฝัง พร้อมไฟล์ Master Edition",
        guide: "คู่มือ",
        critique: "วิจารณ์",
        remote: "ดาวเทียม",
        scoring: "การคำนวณ",
        glossary: "สัญลักษณ์",
        example: "ตัวอย่าง",
        models: "ขอบเขต",
        references: "อ้างอิง",
        rack: "คลังความรู้",
        glossarySymbol: "สัญลักษณ์",
        glossaryDefinition: "ความหมาย",
        glossaryExplanation: "คำอธิบาย",
        worksheetColumn: "คอลัมน์",
        worksheetPurpose: "หน้าที่",
        worksheetSource: "แหล่งข้อมูลหลัก",
        sourceTierLabel: "ชั้น",
        protocolLabel: "โปรโตคอล",
        roleLabel: "บทบาท",
        finalScore: "คะแนน SLIC สุดท้าย",
        illustrative: "ตัวอย่างคำนวณ",
        citations: "อ้างอิง",
        contextLabel: "บริบท",
        dataMixTitle: "สัดส่วนข้อมูล",
        dataMixSummary: "โมเดลเน้นพึ่งพาข้อมูลทางการระดับเมืองและมหภาค",
      },
    },
    ideas: {
      eyebrow: "ก๊อปไอเดียนี้ไปใช้",
      title: "ห้องนวัตกรรมเมือง",
      intro: "นวัตกรรมเมืองจริงๆ พร้อมโค้ดที่ให้คุณเอาไปใช้ต่อได้ทันที",
      category: "หมวดหมู่",
      difficulty: "ความยาก",
      all: "ทั้งหมด",
      summary: "คลิกที่การ์ดเพื่อดูตัวอย่างโค้ดนวัตกรรม",
      problem: "ปัญหา",
      solution: "โซลูชัน",
      impact: "ผลกระทบ",
      hideCode: "ซ่อนโค้ด",
      showCode: "ดูโค้ด",
      starterCode: "โค้ดเริ่มต้น",
      copied: "คัดลอกแล้ว!",
      copyCode: "คัดลอกโค้ด",
      techStack: "เทคโนโลยี",
      difficultyLabels: {
        starter: "เริ่มต้น",
        intermediate: "ปานกลาง",
        advanced: "ระดับสูง",
      },
    },
    compare: {
      eyebrow: "การเปรียบเทียบ",
      title: "อันดับเมืองคือคำโกหก\nนี่คือความจริงของคุณ",
      scroll: "เลื่อนลง",
      kicker: "หกดัชนีเทียบกัน",
      gridNote: " SLIC ถามคำถามที่ติดดินกว่า",
      pullQuote: "“ความแตกต่างระหว่างเมืองที่ 1 และ 10 คือ 1.8 คะแนนจากร้อย”",
      blindspotsTitle: "สิ่งที่เขามัดและสิ่งที่เขาพลาด",
      blindspotsSub: "มีแค่ SLIC ที่วัดมิติคนอยู่ได้ครบ",
      photoCaption: "ความน่าอยู่ที่สัมผัสได้จริงไม่ใช่แค่ตัวเลข",
      notCoveredTitle: "สิ่งที่เรายังไม่ครอบคลุม",
      notCoveredBody1: "เราครอบคลุม 157 เมืองและจะเพิ่มขึ้นเรื่อยๆ",
      notCoveredBody2: "เป้าหมาย V4 คือ 350 เมืองขึ้นไป",
      moneyballTitle: "Moneyball ของเมือง",
      moneyballBody1: "คุณไม่ต้องไปเวียนนาแค่เพราะข่าวบอก",
      moneyballBody2: "SLIC วัดว่าที่ไหนที่คนอยากไปอยู่จริงๆ",
      pillarsTitle: "SLIC วัดอะไรบ้าง?",
      pillarsSub: "ห้าเสาหลัก สูตรเดียว โปร่งใสทุกจุด",
      workshopCaption: "การทดสอบกับผู้บริหารเมืองจริงๆ",
      disagreeTitle: "ตอนนี้ลองแย้งเราดู",
      disagreeHint: "ปรับน้ำหนักตามใจคุณ นี่คืออันดับของคุณ",
      openRankings: "เปิดหน้าอันดับ",
      endorsementQuote: "“เขาสร้างดัชนี แต่คุณสร้างอันดับ”",
      launchTitle: "เปิดตัวที่ไทเป 2026",
      launchBody: "ฟรี โปร่งใส ไม่มีเพย์วอล",
      exploreRankings: "สำรวจเมืองทั้งหมด",
      blindSpotLabels: {
        housing: "ภาระที่อยู่อาศัย",
        overwork: "ชั่วโมงการทำงานเกินตัว",
        tolerance: "ความอดทนและการเปิดกว้าง",
        satisfaction: "ความพึงพอใจของผู้พักอาศัย",
        mentalStrain: "ความเครียดทางสุขภาพจิต",
        graduateHousing: "ภาระที่อยู่อาศัยหลังจบการศึกษา",
        diversity: "ความหลากหลายทางวัฒนธรรม",
        incomeAfterRent: "รายได้หลังหักค่าเช่า (PPP)",
      },
      pillarDetails: {
        pressure: { name: "การเติบโต", desc: "พลวัตเศรษฐกิจ รายได้หลังหักค่าเช่า ภาระที่อยู่อาศัย แรงกดดันชั่วโมงทำงาน" },
        viability: { name: "การดำรงอยู่", desc: "ความปลอดภัย ขนส่ง อากาศสะอาด โครงสร้างดิจิทัล ภูมิอากาศ" },
        capability: { name: "ขีดความสามารถ", desc: "การเข้าถึงสาธารณสุข คุณภาพการศึกษา โอกาสที่เท่าเทียม" },
        community: { name: "ชุมชน", desc: "ความรู้สึกเป็นส่วนหนึ่ง ความอดทน วัฒนธรรม เพื่อนบ้าน" },
        creative: { name: "สร้างสรรค์", desc: "ความง่ายในการทำธุรกิจ ความเข้มข้นของนวัตกรรม เสถียรภาพรัฐบาล" },
      },
    },
    history: {
      eyebrow: "เส้นทาง",
      heading: "SLIC Index ถูกสร้างขึ้นมาอย่างไร",
      subtitle: "หลายปีของการลงพื้นที่จริง เวิร์กช็อปผู้มีส่วนได้ส่วนเสีย และการเก็บข้อมูลภาคสนาม.",
    },
    compareCities: {
      eyebrow: "การเปรียบเทียบเมือง",
      title: "เปรียบเทียบสูงสุด 5 เมือง",
      clearAll: "ล้างทั้งหมด",
      resetDefault: "ค่าเริ่มต้น 5 อันดับแรก",
      selectCity: "+ เลือกเมือง",
      globalRank: "อันดับโลก",
      slicScore: "คะแนน SLIC",
      localVibe: "บรรยากาศเมือง",
      economicContext: "บริบทเศรษฐกิจ",
      selectPrompt: "เลือกเมืองมาเปรียบเทียบ",
    },
    footer: {
      eyebrow: "ชี้แจง SLIC",
      title: "โครงสร้างที่โปร่งใส",
      summary: "ต้นแบบการจัดอันดับเมืองสาธารณะ",
      transparencyLabel: "ความโปร่งใส",
      disclosure: "ไม่มีใครมาซื้ออันดับจากเราได้",
      privacy: "เน้นข้อมูลสาธารณะและข้อมูลรวม",
      coverage: "เกรดความครอบคลุมชัดเจน",
      collaborationLabel: "ร่วมกับ",
      collaboration: "สร้างโดย Non Arkara และทีมนักวิจัย",
      note: "น้ำหนักและระเบียบวิธีประกาศไวอย่างชัดเจน",
      endnotes: {
        eyebrow: "ข้อกำหนดการเผยแพร่",
        reuseLabel: "การนำไปใช้และความเครดิต",
        reuseBody: "SLIC ตั้งใจให้ถูกอ้างถึง ใช้ในการเรียน ทำซ้ำ และวิจารณ์ได้ในที่สาธารณะ",
        creditLabel: "รูปแบบการให้เครดิตที่แนะนำ",
        creditBody: "Non Arkara และ Associate Professor Poon Thiengburanathum, Smart and Liveable Cities Index (SLIC).",
        aiLabel: "คำชี้แจงเรื่องอัลกอริทึมและ AI",
        aiBody: "การจัดอันดับนี้มาจากข้อมูลเวิร์กบุ๊ก SLIC ที่ได้รับการตรวจสอบแล้ว",
        liveLabel: "โมเดลต่อเนื่อง",
        liveBody: "อันดับถูกเผยแพร่จากข้อมูลที่ตรวจสอบแล้ว",
      },
    },
  },
  zh: {
    nav: {
      home: "首页",
      aboutSlic: "关于 SLIC",
      methodology: "方法论",
      rankings: "排名",
      exercise: "匹配练习",
      thailand: "泰国指数",
      ideas: "创意库",
      history: "发展历程",
      timeMachine: "V2 存档",
      compare: "并对比",
    },
    shared: {
      updated: "更新于",
      allRegions: "全部",
      exportCsv: "导出筛选 CSV",
      downloadSheetTemplate: "导出表单模板",
      liveTop10: "预览前 10",
      openFullRanking: "打开完整排名",
      coreBoard: "筛选榜单",
      extendedField: "候选城市池",
      liveStatus: "实时更新中",
      liveScope: "157 城市 / 35 信号",
      localTime: "当地时间",
    },
    app: {
      loading: {
        eyebrow: "正在加载页面",
        title: "正在准备下一个版块。",
        body: "正在载入页面模块与界面资源。",
      },
      titles: {
        about: "关于 SLIC",
        methodology: "SLIC 方法论",
        rankings: "SLIC 城市排名",
        thailand: "SLIC 泰国",
        ideas: "偷师这个创意",
        history: "SLIC 发展历程",
        city: "宜居城市指数",
        default: "宜居城市指数",
      },
    },
    home: {
      kicker: "157城市 35信号 零废话",
      headline: "所有的城市排名都是谎言。\n这是我们的真实排名。",
      deck: "不比声望不比GDP 而是租房后还剩多少 工作多久 邻居是否包容你",
      cities: "城市",
      pillars: "支柱",
      visitors: "访客",
      gridKicker: "六个指数并排对比",
      gridNote: "五个指数 五种方法论 一个答案 SLIC 对世界的权重不同",
      photoCaption: "SCSE 2026 台北 — 3000位专业人士 欧洲市长联盟要求用SLIC取代经济学人指数",
      alphaTitle: "这十座城市得分最高 点击查看具体原因",
      beta: "BETA",
      gamma: "GAMMA",
      disagreeTitle: "现在可以反驳我们了",
      disagreeHint: "调整你的权重。这是属于你的排名。",
      allocatorHint: "拖动蛛网或滑块。总计100。",
      reset: "重置",
      fullComparison: "完整对比",
    },
    rankings: {
      eyebrow: "全球排名",
      title: "SLIC 城市排名",
      intro: "前 10 名使用卡片详细展示，第 11 名起改为表格展示。",
      tieNote: "当城市得分相同时，动态趋势将打破平局。",
      scopeLabel: "榜单范围",
      regionLabel: "地区筛选",
      scopeSummary: "核心榜单基于城市活力和生存尊严进行筛选。",
      topTenTitle: "前 10 名卡片",
      topTenSummary: "这些卡片突出展示了生活的真实经济变量。",
      tableTitle: "其余上榜城市",
      tableSummary: "完整列表可按得分模式排序，也可按地区筛选。",
      finePrintEyebrow: "发布说明",
      finePrintTitle: "如何引用、使用和解读此排名",
      finePrintSummary: "SLIC 旨在公开被引用、研究、复制和批评。",
      usageLabel: "公共使用说明",
      usageBody: "此排名可自由用于媒体、研究和非营利性教育工作。",
      creditLabel: "建议署名",
      creditBody: "建议署名：Non Arkara 与 Associate Professor Poon Thiengburanathum, SLIC 指数。",
      aiLabel: "算法与 AI 披露",
      aiBody: "此排名由经过验证的 SLIC 数据引擎生成。",
      liveLabel: "系统说明",
      liveBody: "所有排名均来自最新的验证工作簿。",
      cautionLabel: "阅读建议",
      cautionBody: "排名应视为一种公开的方法论判断，而非财务建议。",
      income: "人均 PPP 收入",
      disposable: "税后可支配空间",
      housing: "初入职场住房负担",
      healthcare: "医疗康养",
      education: "教育资源",
      ecology: "生态环境",
      diversity: "体验多样性",
      business: "创意与增长",
      safety: "安全感",
      tolerance: "社会包容",
      localClock: "城市时钟",
      openingEase: "创业便利",
      taxRegime: "税务环境",
      stability: "稳定性",
      incentives: "激励措施",
      listening: "舆情脉冲",
      topics: "讨论话题",
      culturalDemand: "文化吸引力",
      rationale: "入选理由",
      rank: "排名",
      city: "城市",
      country: "国家",
      region: "地区",
      score: "总分",
      access: "可及性",
      spiderHint: "拖动蛛网标记以重新定义权重。",
      reset: "重置权重",
      allocatorTitle: "设定优先级",
      allocatorHint: "拖动蛛网或滑块。总计100。",
      scenariosLabel: "生活场景",
      scenarioNomad: "数字游民",
      scenarioFamily: "家庭优先",
      scenarioGrowth: "追求增长",
      canonicalBadge: "SLIC 标准",
      customBadge: "你的优先级",
      canonicalNote: "SLIC 默认: G 25 / V 22 / C 18 / Co 15 / Cr 20",
      whyThisRanking: "为什么是这个默认排名?",
      whyExplanation: "SLIC 将增长权重设为最高 (25%) 因为经济活力决定城市轨迹。",
      consequencesTitle: "权衡洞察",
      citiesLabel: "城市",
      top10: "前10",
      top50: "前50",
      showAll: "全部",
      allRegions: "全部",
      pillarHints: {
        pressure: "经济活力、市场力量、自然可负担性",
        viability: "安全、交通、空气、气候与日照",
        capability: "医疗、教育、机会",
        community: "归属、包容、文化生活",
        creative: "创新、研究、创业",
      },
      labels: {
        coverage: "数据覆盖",
      },
    },
    thailand: {
      eyebrow: "泰国指数",
      title: "泰国 SLIC 指数",
      intro: "对比泰国 77 个府，描绘区域韧性与城市表现。",
      note: "包含主要旅游目的地和工业重镇。",
      ui: {
        scope: "范围",
        ranked: "已排",
        all: "全部府省",
        region: "地区",
        allRegions: "全部",
        sortBy: "排序权重",
        topProvinces: "领先府省",
        leadingOn: "领先于",
        topSummary: "展示各支柱评分及核心省级指标。",
        fullTable: "完整列表",
        remaining: "其余府省",
        rank: "排名",
        rankLabel: "名次",
        province: "府省",
        regionColumn: "地区",
        gppPerCapita: "人均 GPP",
        avgIncome: "平均月薪",
        perMonth: "/月",
        pm25: "PM2.5",
        beds: "床位/万人",
        crime: "案发率",
        green: "绿化率 %",
        provisional: "暂列",
        infraShort: "基建",
        patternsEyebrow: "区域格局",
        patternsTitle: "数据所揭示的规律",
        patternsSummary: "泰国内部各区域的韧性表现出明显的差异化。",
        centralLabel: "中部",
        centralTitle: "经济重镇与环境代价",
        centralBody: "曼谷及其周边府在经济上占据主导，但面临 PM2.5 和交通压力。",
        northLabel: "北部",
        northTitle: "文化丰厚与季节挑战",
        northBody: "清迈与清莱文化得分极高，但面临季节性大气的考验。",
        isanLabel: "东北部",
        isanTitle: "人情暖度与经济落差",
        isanBody: "在安全和社区活力上表现出色，但经济指标仍需提振。",
        southEastLabel: "南部与东部",
        southEastTitle: "优选空气与不均深度",
        southEastBody: "沿海府省拥有最好的空气质量，但医疗资源仍显薄弱。",
      },
    },
    methodology: {
      ui: {
        openEquation: "查看公式",
        openPdf: "阅读技术文档",
        downloadPdf: "下载 PDF",
        closePdf: "关闭文档",
        pdfWindowTitle: "SLIC 技术白皮书",
        pdfWindowNote: "内置阅读器及可下载的英文版本。",
        guide: "指南",
        critique: "评价",
        remote: "卫星层",
        scoring: "打分制",
        glossary: "词汇表",
        example: "案例",
        models: "边界",
        references: "参考文献",
        rack: "知识体系",
        glossarySymbol: "符号",
        glossaryDefinition: "定义",
        glossaryExplanation: "解释",
        worksheetColumn: "列名",
        worksheetPurpose: "用途",
        worksheetSource: "数据来源",
        sourceTierLabel: "层级",
        protocolLabel: "规则",
        roleLabel: "角色",
        finalScore: "最终评分",
        illustrative: "推导说明",
        citations: "引文",
        contextLabel: "背景项",
        dataMixTitle: "数据配比",
        dataMixSummary: "公开模型主要依赖城市与宏观官方统计数据。",
      },
    },
    ideas: {
      eyebrow: "创意借鉴",
      title: "城市创新实验室",
      intro: "真实的城市解决方案，配套可复制的代码片段。",
      category: "分类",
      difficulty: "难度",
      all: "全部",
      summary: "点击卡片的代码查看详情。",
      problem: "所遇问题",
      solution: "解决方案",
      impact: "成效影响力",
      hideCode: "隐藏代码",
      showCode: "复制代码",
      starterCode: "启动代码块",
      copied: "已复制！",
      copyCode: "复制代码",
      techStack: "技术栈",
      difficultyLabels: {
        starter: "入门",
        intermediate: "中级",
        advanced: "高级",
      },
    },
    compare: {
      eyebrow: "横向对比",
      title: "排名皆为谎言\n除了你的选择",
      scroll: "向下滚动",
      kicker: "横向对比六大指数",
      gridNote: " SLIC 问的是和生活本质相关的问题。",
      pullQuote: "“世界第一和第十名之间只差 1.8 分。”",
      blindspotsTitle: "它们衡量了什么 & 它们遗漏了什么",
      blindspotsSub: "只有 SLIC 衡量了全部八个生活维度。",
      photoCaption: "宜居性不是数字，而是眼平高度的日常。 ",
      notCoveredTitle: "尚未覆盖的内容",
      notCoveredBody1: "目前覆盖 157 个城市，主要基于数据的可得性。",
      notCoveredBody2: "V4 目标：350 个以上的城市。 ",
      moneyballTitle: "城市投资的 moneyball 效应",
      moneyballBody1: "你不必只去维也纳或那些所谓的头条城市。 ",
      moneyballBody2: "SLIC 告诉你适合你下一个办公室的真实去处。",
      pillarsTitle: "SLIC 到底怎么衡量？",
      pillarsSub: "五个支柱，一个透明公式。 ",
      workshopCaption: "与实际管理城市的官员合作测试。 ",
      disagreeTitle: "现在可以反驳我们了",
      disagreeHint: "调整你的权重。这是属于你的排名。",
      openRankings: "进入排名系统",
      endorsementQuote: "“他们建立了指数，排名由你决定。”",
      launchTitle: "在 SCSE 2026 台北发布",
      launchBody: "免费，公开，透明，无付费墙。 ",
      exploreRankings: "探索排名",
      blindSpotLabels: {
        housing: "住房负担能力",
        overwork: "过度劳累/工作时间",
        tolerance: "包容性/公民开放度",
        satisfaction: "居民满意度",
        mentalStrain: "自杀率/心理压力",
        graduateHousing: "毕业生住房负担",
        diversity: "文化多样性",
        incomeAfterRent: "房租后收入 (PPP)",
      },
      pillarDetails: {
        pressure: { name: "增长", desc: "经济活力 房租后的可支配空间 住房负担 工作时长压力" },
        viability: { name: "生存能力", desc: "安全 交通 清洁空气 数字基础设施 气候" },
        capability: { name: "能力", desc: "医疗可及性 教育质量 平等机会" },
        community: { name: "社区", desc: "归属感 包容性 文化生活 邻里关系" },
        creative: { name: "创意", desc: "创业摩擦 创新强度 政府稳定性" },
      },
    },
    history: {
      eyebrow: "历程",
      heading: "SLIC指数是如何构建的",
      subtitle: "多年的实地调研、利益相关者研讨会和一手数据收集。",
    },
    compareCities: {
      eyebrow: "并排比较",
      title: "最多比较 5 座城市",
      clearAll: "清除全部",
      resetDefault: "默认前 5 名",
      selectCity: "+ 选择城市",
      globalRank: "全球排名",
      slicScore: "SLIC 评分",
      localVibe: "城市氛围",
      economicContext: "经济背景",
      selectPrompt: "选择城市进行比较",
    },
    footer: {
      eyebrow: "SLIC 披露",
      title: "透明的城市排名系统",
      summary: "这是一个公开的原型系统。 ",
      transparencyLabel: "透明度与隐私",
      disclosure: "没有任何城市为入选支付费用。",
      privacy: "基于公开聚类数据构建。 ",
      coverage: "数据覆盖等级公开可见。 ",
      collaborationLabel: "合作机构",
      collaboration: "由 Non Arkara 与教授联合发起。",
      note: "方法论与来源分级保持公开透明。 ",
      endnotes: {
        eyebrow: "发布协议",
        reuseLabel: "复用与署名",
        reuseBody: "SLIC 本身就允许公开引用、教学、复现与批评。",
        creditLabel: "建议署名",
        creditBody: "Non Arkara 与 Associate Professor Poon Thiengburanathum, SLIC 城市指数。",
        aiLabel: "算法与 AI 披露",
        aiBody: "本排名由经过验证的 SLIC 工作簿生成。",
        liveLabel: "持续模型",
        liveBody: "排名由经过验证的工作簿导出发布。",
      },
    },
  },
};

export function getCopy(locale: Locale): SiteCopy {
  return siteCopy[locale] || siteCopy.en;
}
