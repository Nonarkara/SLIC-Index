# -*- coding: utf-8 -*-
import json

more_translations = {
  "imd": {
    "focus": {
      "en": "How residents perceive smart technology in their city — the only major index based purely on citizen surveys rather than hard data.",
      "th": "ผู้อยู่อาศัยรับรู้ถึงเทคโนโลยีอัจฉริยะในเมืองของตนอย่างไร — เป็นดัชนีหลักเพียงหนึ่งเดียวที่อิงจากแบบสำรวจประชาชนล้วนๆ แทนที่จะเป็นข้อมูลเชิงปริมาณ",
      "zh": "居民如何看待所在城市的智能技术——唯一一个纯粹基于市民调查而非硬数据的的主要指数。",
      "ko": "주민들이 자신의 도시에서 스마트 기술을 어떻게 인식하는가 — 정량적 데이터가 아닌 순수하게 시민 설문조사에 기반한 유일한 주요 지수.",
      "ja": "住民が自分の都市のスマートテクノロジーをどう認識しているか — ハードデータではなく、純粋に市民アンケートに基づいた唯一の主要な指標。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Measure smart city performance through the perception of citizens who live and work there.",
        "th": "วัดประสิทธิภาพเมืองอัจฉริยะผ่านมุมมองของประชาชนที่อาศัยและทำงานที่นั่น",
        "zh": "通过在那里生活和工作的市民的感知来衡量智能城市的表现。",
        "ko": "그곳에 살고 일하는 시민들의 인식을 통해 스마트 시티 성과를 측정합니다.",
        "ja": "そこに住み、働く市民の認識を通じて、スマートシティのパフォーマンスを測定する。"
      },
      "actualMeasure": {
        "en": "Around 120 residents per city answer a survey about whether tech infrastructure \"works for them.\" No hard metrics — pure perception. Asks things like \"do you use mobile apps for city services?\" and \"do you feel safe?\" A city that has smart bus apps but crushing rents scores well if its residents report satisfaction with the apps. Wealth correlates with tech satisfaction, so wealthy cities top the list regardless of their actual urban performance.",
        "th": "ผู้อยู่อาศัยประมาณ 120 คนต่อเมืองตอบแบบสอบถามว่าโครงสร้างพื้นฐานด้านเทคโนโลยี \"ตอบโจทย์พวกเขาไหม\" ไม่มีตัวชี้วัดที่เป็นตัวเลข — เป็นการรับรู้ล้วนๆ ถามคำถามเช่น \"คุณใช้แอปมือถือสำหรับบริการของเมืองไหม\" และ \"คุณรู้สึกปลอดภัยไหม\" เมืองที่มีแอปรถเมล์อัจฉริยะแต่ค่าเช่าแพงหูฉี่จะได้คะแนนดีถ้าผู้อยู่อาศัยรายงานว่าพอใจกับแอป ความมั่งคั่งแปรผันตามความพอใจในเทคโนโลยี ดังนั้นเมืองที่ร่ำรวยจึงติดอันดับท็อปไม่ว่าประสิทธิภาพของเมืองจริงๆ จะเป็นอย่างไร",
        "zh": "每个城市约 120 名居民回答一项调查，关于技术基础设施是否“对他们有用”。没有硬性指标——纯粹的感知。提出诸如“你使用移动应用程序获取城市服务吗？”以及“你觉得安全吗？”这样的问题。如果居民对应用程序表示满意，一个拥有智能公交应用程序但租金高昂的城市也能获得高分。财富与对技术的满意度相关，因此无论其实际的城市表现如何，富裕的城市都能名列前茅。",
        "ko": "도시 당 약 120명의 주민이 기술 인프라가 '자신에게 유용한지'에 대한 설문 조사에 답합니다. 정량적 지표 없음 — 순수한 인식. '도시 서비스를 위해 모바일 앱을 사용하십니까?' 및 '안전하다고 느끼십니까?'와 같은 질문을 합니다. 스마트 버스 앱이 있지만 임대료가 살인적인 도시는 주민들이 앱에 대한 만족도를 보고하면 높은 점수를 받습니다. 부는 기술 만족도와 상관관계가 있으므로 실제 도시 성과에 관계없이 부유한 도시가 목록의 맨 위에 오릅니다.",
        "ja": "各都市約120人の住民が、技術インフラが「自分たちにとって役立つか」についてのアンケートに答えます。ハードな指標はなし — 純粋な認識です。「都市サービスにモバイルアプリを使用していますか？」「安全だと感じますか？」といったことを尋ねます。スマートバスアプリがあっても家賃が破滅的な都市でも、住民がアプリに満足していると報告すれば高得点になります。富はテクノロジーへの満足度と相関関係があるため、実際の都市のパフォーマンスに関係なく、裕福な都市が上位にランクインします。"
      },
      "categories": {
        "en": ["Structures — Physical: transport, health facilities, green space, housing", "Structures — Institutional: governance, safety, social cohesion", "Technology — Services: smart apps, digital payments, mobility tech", "Technology — Connectivity: internet, 5G, digital infrastructure"],
        "th": ["โครงสร้าง — กายภาพ: ขนส่งมวลชน, สิ่งอำนวยความสะดวกด้านสุขภาพ, พื้นที่สีเขียว, ที่อยู่อาศัย", "โครงสร้าง — สถาบัน: ธรรมาภิบาล, ความปลอดภัย, ความกลมเกลียวทางสังคม", "เทคโนโลยี — บริการ: แอปอัจฉริยะ, การชำระเงินดิจิทัล, เทคโนโลยีการเดินทาง", "เทคโนโลยี — การเชื่อมต่อ: อินเทอร์เน็ต, 5G, โครงสร้างพื้นฐานดิจิทัล"],
        "zh": ["结构 — 物理：交通、医疗设施、绿地、住房", "结构 — 制度：治理、安全、社会凝聚力", "技术 — 服务：智能应用、数字支付、移动技术", "技术 — 连通性：互联网、5G、数字基础设施"],
        "ko": ["구조 — 물리적: 교통, 의료 시설, 녹지, 주택", "구조 — 제도적: 거버넌스, 안전, 사회적 결속력", "기술 — 서비스: 스마트 앱, 디지털 결제, 모빌리티 기술", "기술 — 연결성: 인터넷, 5G, 디지털 인프라"],
        "ja": ["構造 — 物理的：交通、医療施設、緑地、住宅", "構造 — 制度的：ガバナンス、安全性、社会的結束", "テクノロジー — サービス：スマートアプリ、デジタル決済、モビリティ技術", "テクノロジー — 接続性：インターネット、5G、デジタルインフラ"]
      },
      "dataInputs": {
        "en": ["~120 resident interviews per city (very small samples)", "Perception-based — no verified hard metrics", "Conducted jointly with Singapore University of Technology and Design (SUTD)", "Online surveys weighted to demographic quotas"],
        "th": ["สัมภาษณ์ผู้อยู่อาศัยประมาณ 120 คนต่อเมือง (กลุ่มตัวอย่างเล็กมาก)", "อิงการรับรู้ — ไม่มีตัวชี้วัดเชิงปริมาณที่ตรวจสอบได้", "จัดทำร่วมกับมหาวิทยาลัยเทคโนโลยีและการออกแบบแห่งสิงคโปร์ (SUTD)", "แบบสำรวจออนไลน์ถ่วงน้ำหนักตามโควต้าประชากรศาสตร์"],
        "zh": ["每个城市约 120 名居民的面谈（样本量极小）", "基于感知——没有经过验证的硬指标", "与新加坡科技设计大学 (SUTD) 联合进行", "按人口统计配额加权的在线调查"],
        "ko": ["도시 당 약 120명의 주민 인터뷰 (매우 적은 표본)", "인식 기반 — 검증된 정량적 지표 없음", "싱가포르 기술 디자인 대학교(SUTD)와 공동 수행", "인구 통계 할당량에 따라 가중치가 부여된 온라인 설문조사"],
        "ja": ["1都市あたり約120人の住民インタビュー（非常に少数のサンプル）", "認識ベース — 検証済みのハードな指標はなし", "シンガポール工科デザイン大学（SUTD）と共同で実施", "人口統計の割り当てに重み付けされたオンラインアンケート"]
      },
      "blindSpots": {
        "en": ["Housing affordability (not measured at all)", "Actual tech outcomes vs. perceived satisfaction", "Digital divide — who is surveyed vs. who is excluded", "Labour rights, working hours, income inequality", "Survey bias: satisfied residents in wealthy cities give high scores regardless of structural gaps", "Small samples (120 people) cannot reliably represent cities of millions"],
        "th": ["ความสามารถในการจ่ายค่าที่อยู่อาศัย (ไม่ได้วัดผลเลย)", "ผลลัพธ์ทางเทคโนโลยีที่เกิดขึ้นจริง เทียบกับความพึงพอใจที่รับรู้", "ช่องว่างดิจิทัล — ใครถูกสำรวจ เทียบกับใครถูกกีดกันออกไป", "สิทธิแรงงาน, ชั่วโมงการทำงาน, ความเหลื่อมล้ำทางรายได้", "อคติจากการสำรวจ: ผู้อยู่อาศัยที่พึงพอใจในเมืองที่ร่ำรวยให้คะแนนสูงโดยไม่สนช่องโหว่เชิงโครงสร้าง", "กลุ่มตัวอย่างขนาดเล็ก (120 คน) ไม่สามารถเป็นตัวแทนที่เชื่อถือได้ของเมืองที่มีประชากรนับล้าน"],
        "zh": ["住房可负担性（完全没有测量）", "实际技术成果 vs. 感知满意度", "数字鸿沟——谁接受调查 vs. 谁被排除在外", "劳工权利、工作时间、收入不平等", "调查偏差：富裕城市中满意的居民无论结构性差距如何都会给出高分", "小样本（120 人）无法可靠地代表拥有数百万人口的城市"],
        "ko": ["주택 가격 적정성 (전혀 측정되지 않음)", "실제 기술 결과 vs. 인식된 만족도", "디지털 격차 — 누구를 조사하고 누구를 배제하는가", "노동권, 노동 시간, 소득 불평등", "설문조사 편향: 부유한 도시의 만족한 주민들은 구조적 격차에 관계없이 높은 점수를 줌", "소규모 표본(120명)은 수백만 명의 도시를 신뢰할 수 있게 대변할 수 없음"],
        "ja": ["住宅の手頃な価格（まったく測定されていない）", "実際の技術成果 vs. 認識された満足度", "デジタル・ディバイド — 誰が調査され、誰が除外されているか", "労働者の権利、労働時間、所得の不平等", "調査の偏り：裕福な都市の満足している住民は、構造的な格差に関係なく高得点をつける", "少数のサンプル（120人）では、数百万人規模の都市を確実に代表することはできない"]
      },
      "audienceNote": {
        "en": "Smart city vendors, urban tech consultants, and government digital transformation teams. The ranking is frequently cited by tech companies as validation for their city deployments.",
        "th": "ผู้จำหน่ายสมาร์ทซิตี้, ที่ปรึกษาด้านเทคโนโลยีในเมือง, และทีมเปลี่ยนผ่านดิจิทัลของรัฐบาล การจัดอันดับนี้มักถูกบริษัทเทคโนโลยีอ้างถึงเพื่อเป็นเครื่องยืนยันความสำเร็จของการนำเทคโนโลยีไปใช้ในเมือง",
        "zh": "智慧城市供应商、城市技术顾问和政府数字化转型团队。该排名经常被科技公司引用，作为其在城市部署的验证。",
        "ko": "스마트 시티 공급업체, 도시 기술 컨설턴트 및 정부 디지털 전환 팀. 이 순위는 기술 회사가 도시 배포에 대한 검증으로 자주 인용합니다.",
        "ja": "スマートシティベンダー、都市技術コンサルタント、政府のデジタルトランスフォーメーションチーム。このランキングは、テクノロジー企業が自社の都市展開の正当性を示すためによく引用されます。"
      }
    },
    "critique": {
      "headline": {
        "en": "Perception of tech is not the same as liveable outcomes",
        "th": "การรับรู้ถึงเทคโนโลยีไม่เหมือนกับผลลัพธ์ที่น่าอยู่",
        "zh": "对技术的感知不等于宜居的成果",
        "ko": "기술에 대한 인식이 곧 살기 좋은 결과를 의미하는 것은 아닙니다.",
        "ja": "技術に対する認識は、住みやすい成果と同じではない"
      },
      "body": {
        "en": "The IMD index is methodologically unusual — it deliberately avoids hard data and measures only what residents think. This makes it resistant to gaming on metrics but extremely susceptible to wealth bias: residents of rich, stable cities simply report higher satisfaction with everything, including apps they barely use. Three Swiss cities appear in the top 10 on the strength of general satisfaction rather than measurable smart outcomes. The sample size (roughly 120 people per city) is statistically insufficient to represent cities of 1–10 million. The index is honest about measuring perception, but its headline rankings are regularly misread as measuring actual smart-city performance — which they do not.",
        "th": "ดัชนี IMD มีระเบียบวิธีที่แปลก — มันจงใจหลีกเลี่ยงข้อมูลเชิงประจักษ์และวัดเฉพาะสิ่งที่ผู้อยู่อาศัยคิด สิ่งนี้ทำให้ยากต่อการปั่นตัวเลข แต่ง่ายต่อการเกิดอคติจากความมั่งคั่ง: ผู้อยู่อาศัยในเมืองที่รวยและมั่นคงมักจะรายงานความพึงพอใจที่สูงกว่าในทุกเรื่อง รวมถึงแอปที่พวกเขาแทบไม่ได้ใช้ เมืองในสวิส 3 เมืองติดท็อป 10 ด้วยพลังของความพึงพอใจทั่วไป แทนที่จะเป็นผลลัพธ์ความฉลาดที่วัดผลได้ ขนาดของกลุ่มตัวอย่าง (ประมาณ 120 คนต่อเมือง) ไม่เพียงพอในทางสถิติที่จะเป็นตัวแทนของเมืองที่มีประชากร 1-10 ล้านคน ดัชนีนี้ซื่อตรงว่าเป็นการวัดการรับรู้ แต่การจัดอันดับพาดหัวข่าวของมันมักถูกตีความผิดว่าวัดประสิทธิภาพเมืองอัจฉริยะจริงๆ — ซึ่งมันไม่ได้ทำแบบนั้น",
        "zh": "IMD 指数在方法论上很不寻常——它刻意避开硬数据，只衡量居民的想法。这使得它能够抵御对指标的操纵，但极易受到财富偏见的影响：富裕、稳定城市的居民只是在各个方面报告更高的满意度，包括他们几乎不用的应用程序。三个瑞士城市跻身前十，凭借的是普遍的满意度，而不是可衡量的智能成果。样本量（每个城市大约 120 人）在统计学上不足以代表人口达 100 到 1000 万的城市。该指数诚实地表示自己衡量的是感知，但其头条排名经常被误读为衡量实际的智能城市表现——而事实上它们并非如此。",
        "ko": "IMD 지수는 방법론적으로 이례적입니다 — 정량적 데이터를 의도적으로 피하고 주민들의 생각만을 측정합니다. 이는 지표 조작에 대한 저항력을 갖게 하지만, 부의 편향에 매우 취약하게 만듭니다. 부유하고 안정적인 도시의 주민들은 단순히 거의 사용하지 않는 앱을 포함한 모든 항목에서 더 높은 만족도를 보고합니다. 3개의 스위스 도시는 측정 가능한 스마트 결과보다는 전반적인 만족도에 힘입어 상위 10위 안에 들었습니다. 표본 크기(도시당 약 120명)는 100만~1,000만 명의 도시를 대변하기에는 통계적으로 불충분합니다. 지수는 인식을 측정한다는 점에 대해서는 정직하지만, 주요 순위는 실제 스마트 시티 성과를 측정하는 것으로 정기적으로 오해받습니다 — 실제로는 그렇지 않은데 말이죠.",
        "ja": "IMDインデックスは方法論的に珍しいものです — 意図的にハードデータを避け、住民の考えだけを測定します。これにより指標の不正操作には強いですが、富の偏見には極めて弱くなります。豊かで安定した都市の住民は、ほとんど使わないアプリを含め、あらゆることに対して単純により高い満足度を報告します。スイスの3都市が、測定可能なスマートな結果よりも一般的な満足度の高さでトップ10に入っています。サンプルサイズ（1都市あたり約120人）は、100万人から1000万人の都市を代表するには統計的に不十分です。このインデックスは認識の測定については正直ですが、その見出しのランキングは、実際のスマートシティのパフォーマンスを測定しているものとして定期的に誤読されています — 実際にはそうではないにもかかわらず。"
      }
    }
  },
  "mori": {
    "focus": {
      "en": "\"Magnetic power\" — how strongly a city attracts people and capital from around the world. Explicitly designed around the interests of global elites who move between cities.",
      "th": "\"พลังดึงดูด\" — เมืองดึงดูดผู้คนและเงินทุนจากทั่วโลกได้แรงแค่ไหน ออกแบบมาโดยอิงผลประโยชน์ของชนชั้นนำระดับโลกที่ย้ายถิ่นฐานระหว่างเมืองต่างๆ อย่างชัดเจน",
      "zh": "“磁力”——一座城市对来自世界各地的人才和资本的吸引力有多大。明确围绕穿梭于城市间的全球精英的利益而设计。",
      "ko": "'자력(Magnetic power)' — 도시가 전 세계의 사람과 자본을 얼마나 강하게 끌어들이는지. 도시 간을 이동하는 글로벌 엘리트들의 이익을 중심으로 명시적으로 설계되었습니다.",
      "ja": "「磁力」 — 都市が世界中の人々や資本をどれほど強く惹きつけるか。都市間を移動するグローバルエリートの利益を中心に明確に設計されています。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Evaluate the comprehensive power of cities by their ability to attract people, capital, and enterprises from around the world.",
        "th": "ประเมินพลังโดยรวมของเมืองต่างๆ จากความสามารถในการดึงดูดผู้คน เงินทุน และองค์กรธุรกิจจากทั่วโลก",
        "zh": "通过城市吸引全球人才、资本和企业的能力，评估城市的综合实力。",
        "ko": "전 세계의 인재, 자본, 기업을 유치하는 능력을 통해 도시의 종합적인 힘을 평가합니다.",
        "ja": "世界中から人、資本、企業を惹きつける能力によって、都市の総合力を評価する。"
      },
      "actualMeasure": {
        "en": "Six \"functions\" scored across 70 indicators. Economy is the dominant function — GDP, financial market size, corporate HQ concentration, ease of doing business. \"Livability\" exists as a sub-function but is weighted low and covers only residential comfort for mobile professionals. Backed by the Mori Building Company (a major Tokyo real estate developer), which creates a structural incentive to favor financial centers over resident-centric cities. Only 48 pre-selected \"global\" cities — not a representative world assessment.",
        "th": "ให้คะแนน \"ฟังก์ชัน\" 6 ด้านผ่านตัวชี้วัด 70 ตัว เศรษฐกิจคือฟังก์ชันหลัก — GDP, ขนาดตลาดการเงิน, การกระจุกตัวของสำนักงานใหญ่, ความง่ายในการทำธุรกิจ \"ความน่าอยู่\" มีเป็นฟังก์ชันย่อยแต่ให้น้ำหนักน้อย และครอบคลุมแค่ความสะดวกสบายของที่อยู่อาศัยสำหรับมืออาชีพที่ย้ายถิ่นฐาน สนับสนุนโดย Mori Building Company (ผู้พัฒนาอสังหาริมทรัพย์รายใหญ่ในโตเกียว) ซึ่งสร้างแรงจูงใจเชิงโครงสร้างที่เอื้อต่อศูนย์กลางทางการเงินมากกว่าเมืองที่เน้นผู้อยู่อาศัย มีเพียง 48 เมือง \"ระดับโลก\" ที่ถูกคัดเลือกไว้ล่วงหน้า — ไม่ใช่การประเมินโลกที่เป็นตัวแทนจริงๆ",
        "zh": "针对 70 个指标对六项“功能”进行评分。经济是主导功能——GDP、金融市场规模、企业总部集中度、营商便利度。“宜居性”作为一项子功能存在，但权重较低，且仅涵盖流动专业人士的居住舒适度。由森大厦株式会社（东京一家大型房地产开发商）提供支持，这产生了一种偏向金融中心而非以居民为中心的城市的结构性动机。只有 48 个预先挑选的“全球”城市——并非具有代表性的世界评估。",
        "ko": "70개 지표에 걸쳐 6가지 '기능' 점수를 매깁니다. 경제가 지배적인 기능입니다 — GDP, 금융 시장 규모, 기업 본사 집중도, 비즈니스 용이성. '살기 좋은 정도'는 하위 기능으로 존재하지만 가중치가 낮고 이동성이 높은 전문가를 위한 주거의 편안함만 다룹니다. 도쿄의 주요 부동산 개발업체인 모리 빌딩 컴퍼니(Mori Building Company)가 후원하며, 이는 주민 중심 도시보다 금융 센터를 선호하는 구조적 인센티브를 만듭니다. 사전에 선별된 48개의 '글로벌' 도시만 — 전 세계를 대변하는 평가는 아닙니다.",
        "ja": "70の指標にわたって6つの「機能」を採点。経済が支配的な機能です — GDP、金融市場の規模、企業本社の集中度、ビジネスのしやすさ。「住みやすさ」はサブ機能として存在しますが、ウェイトが低く、移動する専門家のための居住の快適さしかカバーしていません。森ビル（東京の大手不動産開発業者）が支援しており、これが住民中心の都市よりも金融センターを優遇する構造的なインセンティブを生み出しています。事前に選択されたわずか48の「グローバル」都市 — 代表的な世界評価ではありません。"
      },
      "categories": {
        "en": ["Economy (financial market size, corporate HQ, business ease, GDP)", "R&D (patents, researchers, university rankings, innovation output)", "Cultural Interaction (tourism, international events, language accessibility)", "Livability (workplaces, cost of living, safety, shopping, schools for expatriates)", "Environment (CO₂ emissions, green space, environmental policy)", "Accessibility (international flights, transport links, connectivity)"],
        "th": ["เศรษฐกิจ (ขนาดตลาดการเงิน, สำนักงานใหญ่บริษัท, ความง่ายในการทำธุรกิจ, GDP)", "การวิจัยและพัฒนา (สิทธิบัตร, นักวิจัย, อันดับมหาวิทยาลัย, ผลผลิตทางนวัตกรรม)", "ปฏิสัมพันธ์ทางวัฒนธรรม (การท่องเที่ยว, งานระดับนานาชาติ, การเข้าถึงด้านภาษา)", "ความน่าอยู่ (สถานที่ทำงาน, ค่าครองชีพ, ความปลอดภัย, แหล่งช้อปปิ้ง, โรงเรียนสำหรับชาวต่างชาติ)", "สิ่งแวดล้อม (การปล่อย CO₂, พื้นที่สีเขียว, นโยบายสิ่งแวดล้อม)", "การเข้าถึง (เที่ยวบินระหว่างประเทศ, การเชื่อมต่อการขนส่ง, ความเชื่อมโยง)"],
        "zh": ["经济（金融市场规模、企业总部、营商便利度、GDP）", "研发（专利、研究人员、大学排名、创新产出）", "文化互动（旅游、国际赛事、语言便利性）", "宜居性（工作场所、生活成本、安全、购物、外籍人士学校）", "环境（二氧化碳排放、绿地、环境政策）", "交通便利性（国际航班、交通连接、连通性）"],
        "ko": ["경제 (금융 시장 규모, 기업 본사, 비즈니스 용이성, GDP)", "R&D (특허, 연구원, 대학 순위, 혁신 산출물)", "문화적 교류 (관광, 국제 행사, 언어 접근성)", "살기 좋은 정도 (직장, 생활비, 안전, 쇼핑, 주재원 자녀 학교)", "환경 (CO₂ 배출, 녹지, 환경 정책)", "접근성 (국제선 항공편, 교통망, 연결성)"],
        "ja": ["経済（金融市場規模、企業本社、ビジネスのしやすさ、GDP）", "R&D（特許、研究者、大学ランキング、イノベーションの成果）", "文化的交流（観光、国際イベント、言語のアクセシビリティ）", "住みやすさ（職場、生活費、安全性、ショッピング、駐在員向け学校）", "環境（CO2排出量、緑地、環境政策）", "アクセシビリティ（国際線フライト、交通リンク、接続性）"]
      },
      "dataInputs": {
        "en": ["70 indicators from 48 cities", "IMF, World Bank, UN, OECD data", "Questionnaire surveys targeting mobile professionals (not general residents)", "Mori Foundation research team in Tokyo"],
        "th": ["ตัวชี้วัด 70 ตัวจาก 48 เมือง", "ข้อมูลของ IMF, World Bank, UN, OECD", "แบบสอบถามกำหนดเป้าหมายไปที่มืออาชีพที่ย้ายถิ่นฐาน (ไม่ใช่ผู้อยู่อาศัยทั่วไป)", "ทีมวิจัยมูลนิธิ Mori ในโตเกียว"],
        "zh": ["来自 48 个城市的 70 个指标", "国际货币基金组织 (IMF)、世界银行、联合国、经合组织数据", "针对流动专业人士的问卷调查（并非普通居民）", "东京森纪念财团研究团队"],
        "ko": ["48개 도시의 70개 지표", "IMF, 세계은행, UN, OECD 데이터", "모바일 전문가 대상 설문조사(일반 주민 아님)", "도쿄 모리 기념 재단 연구팀"],
        "ja": ["48都市の70の指標", "IMF、世界銀行、国連、OECDのデータ", "モバイルプロフェッショナルを対象としたアンケート調査（一般住民ではない）", "東京の森記念財団の研究チーム"]
      },
      "blindSpots": {
        "en": ["Affordability and housing costs for ordinary residents", "Inequality and income distribution within cities", "Working conditions, overwork culture (notably absent for Tokyo)", "Community cohesion and social capital", "Excludes cities in Africa, most of South/Southeast Asia, Latin America", "Structural conflict: publisher (Mori Building) profits from cities scoring highly on real estate value"],
        "th": ["ความสามารถในการจ่ายและค่าที่อยู่อาศัยสำหรับผู้อยู่อาศัยธรรมดา", "ความเหลื่อมล้ำและการกระจายรายได้ภายในเมือง", "สภาพการทำงาน, วัฒนธรรมการทำงานหนักเกินไป (หายไปอย่างน่าสังเกตสำหรับโตเกียว)", "ความกลมเกลียวของชุมชนและทุนทางสังคม", "ไม่รวมเมืองในแอฟริกา, ส่วนใหญ่ของเอเชียใต้/เอเชียตะวันออกเฉียงใต้, ละตินอเมริกา", "ความขัดแย้งเชิงโครงสร้าง: ผู้เผยแพร่ (Mori Building) ได้กำไรจากเมืองที่ทำคะแนนได้สูงด้านมูลค่าอสังหาริมทรัพย์"],
        "zh": ["普通居民的负担能力和住房成本", "城市内的不平等和收入分配", "工作条件、加班文化（值得注意的是对于东京这一项缺失）", "社区凝聚力和社会资本", "将非洲、南亚/东南亚大部分地区、拉丁美洲的城市排除在外", "结构性冲突：发布者（森大厦株式会社）从房地产价值得分高的城市中获利"],
        "ko": ["일반 주민의 주택 비용 감당 능력 및 주거비", "도시 내 불평등 및 소득 분배", "노동 환경, 과로 문화 (도쿄의 경우 눈에 띄게 누락됨)", "커뮤니티 결속력 및 사회적 자본", "아프리카, 남/동남아시아 대부분, 라틴 아메리카 도시 제외", "구조적 충돌: 퍼블리셔(Mori Building)는 부동산 가치가 높은 도시에서 이익을 얻음"],
        "ja": ["一般住民の手頃な価格と住居費", "都市内の不平等と所得分配", "労働条件、過労文化（特に東京については欠落している）", "コミュニティの結束とソーシャルキャピタル", "アフリカ、南/東南アジアの大部分、ラテンアメリカの都市を除外", "構造的な対立：パブリッシャー（森ビル）は、不動産価値のスコアが高い都市から利益を得ている"]
      },
      "audienceNote": {
        "en": "Global corporations, real estate investors, and high-net-worth individuals deciding where to base regional operations. Designed to serve the mobile global class, not residents.",
        "th": "บริษัทระดับโลก นักลงทุนอสังหาริมทรัพย์ และผู้มีสินทรัพย์สูงที่กำลังตัดสินใจว่าจะตั้งฐานปฏิบัติการในภูมิภาคไหน ออกแบบมาเพื่อรับใช้กลุ่มคนระดับโลกที่ย้ายถิ่นฐานได้ ไม่ใช่ผู้อยู่อาศัย",
        "zh": "决定地区业务驻地的跨国公司、房地产投资者和高净值人士。旨在服务流动全球阶层，而非本地居民。",
        "ko": "지역 본부를 어디에 둘지 결정하는 글로벌 기업, 부동산 투자자 및 고액 자산가. 거주자가 아닌 이동하는 글로벌 계층에 서비스하도록 설계되었습니다.",
        "ja": "地域の拠点をどこに置くかを決定するグローバル企業、不動産投資家、富裕層。住民ではなく、移動の自由を持つグローバルクラスのニーズに応えるように設計されています。"
      }
    },
    "critique": {
      "headline": {
        "en": "Measuring global power, not the ability to build a life",
        "th": "วัดอำนาจระดับโลก ไม่ใช่ความสามารถในการสร้างชีวิต",
        "zh": "衡量的是全球实力，而非安身立命的能力",
        "ko": "삶을 구축하는 능력이 아닌 글로벌 파워 측정",
        "ja": "生活を築く能力ではなく、グローバルな力を測定する"
      },
      "body": {
        "en": "Mori GPCI is the most transparent about what it values: the ability to attract capital, talent, and enterprise. It makes no pretence of measuring quality of life for ordinary residents. \"Livability\" is one of six functions and is weighted for professionals on the move, not locals. Tokyo's persistent top-three finish is interesting: Mori Building is a major Tokyo developer with a direct financial interest in Tokyo’s global prestige ranking. The index excludes the overwhelming majority of the world’s cities, all of Sub-Saharan Africa, and most of Southeast Asia and South America — because they are not yet hubs for mobile global capital. The index is honest about serving global elites; the problem is when its results are used to guide public policy for ordinary residents.",
        "th": "Mori GPCI โปร่งใสที่สุดว่ามันให้คุณค่ากับอะไร: ความสามารถในการดึงดูดทุน ผู้มีความสามารถ และองค์กร มันไม่ได้เสแสร้งเลยว่าจะวัดคุณภาพชีวิตของผู้อยู่อาศัยทั่วไป \"ความน่าอยู่\" เป็นเพียงหนึ่งใน 6 ฟังก์ชันและถูกให้น้ำหนักสำหรับมืออาชีพที่ต้องเดินทาง ไม่ใช่คนท้องถิ่น การที่โตเกียวติดท็อปสามเสมอเป็นเรื่องน่าสนใจ: Mori Building คือผู้พัฒนารายใหญ่ของโตเกียวที่มีผลประโยชน์ทางการเงินโดยตรงกับการจัดอันดับศักดิ์ศรีระดับโลกของโตเกียว ดัชนีนี้กันเมืองส่วนใหญ่ในโลกออกไปทั้งหมด ทั้งซับซาฮาราแอฟริกา เอเชียตะวันออกเฉียงใต้และอเมริกาใต้ส่วนใหญ่ — เพราะเมืองเหล่านั้นยังไม่ใช่ศูนย์กลางของทุนระดับโลกที่เคลื่อนย้ายได้ ดัชนีนี้ตรงไปตรงมาว่ารับใช้ชนชั้นนำระดับโลก แต่ปัญหาจะเกิดเมื่อผลลัพธ์ของมันถูกนำไปใช้เป็นแนวทางนโยบายสาธารณะสำหรับคนธรรมดา",
        "zh": "森大厦 GPCI 对其所重视的东西最为坦白：吸引资本、人才和企业的能力。它毫不掩饰自己并不衡量普通居民的生活质量。“宜居性”只是六大功能之一，而且主要是针对流动专业人士的，而非本地居民。东京持续稳居前三名这一点很有趣：森大厦株式会社是东京的主要开发商，在东京的全球声誉排名中拥有直接的经济利益。该指数排除了世界上绝大多数的城市、整个撒哈拉以南非洲地区，以及东南亚和南美洲的大部分地区——因为它们尚未成为流动全球资本的中心。该指数很坦诚它是为全球精英服务的；问题在于，当它的结果被用来指导针对普通居民的公共政策时，麻烦就来了。",
        "ko": "Mori GPCI는 가치 있게 여기는 것에 대해 가장 투명합니다. 자본, 인재 및 기업을 끌어들이는 능력. 이 지수는 일반 주민의 삶의 질을 측정하는 척하지 않습니다. '살기 좋은 정도'는 6가지 기능 중 하나이며 현지인이 아닌 이동 중인 전문가에게 가중치가 부여됩니다. 도쿄가 지속적으로 3위 안에 드는 것은 흥미롭습니다. Mori Building은 도쿄의 글로벌 위상 순위에 직접적인 재정적 이익을 가진 도쿄의 주요 개발자입니다. 이 지수는 전 세계 대다수의 도시, 사하라 이남 아프리카 전체, 동남아시아 및 남미 대부분을 배제합니다. 그들은 아직 모바일 글로벌 자본의 허브가 아니기 때문입니다. 이 지수는 글로벌 엘리트들에게 서비스를 제공한다는 점에 대해 정직합니다. 문제는 그 결과가 일반 주민들을 위한 공공 정책의 지침으로 사용될 때입니다.",
        "ja": "森記念財団のGPCIは、それが何を重視しているかについて最も透明性があります。資本、才能、企業を惹きつける能力です。一般住民の生活の質を測定しているようなふりは一切しません。「住みやすさ」は6つの機能のうちの1つであり、地元の人々ではなく、移動中の専門家に比重が置かれています。東京が常にトップ3に入っているのは興味深いことです。森ビルは東京の大手開発業者であり、東京のグローバルな威信のランキングに直接的な経済的利害関係を持っています。この指数は、世界中の圧倒的多数の都市、サハラ以南のアフリカのすべて、東南アジアや南米の大部分を除外しています。なぜなら、それらはまだ流動的なグローバル資本のハブではないからです。この指数はグローバルエリートに奉仕することに正直です。問題は、その結果が一般住民向けの公共政策の指針として使用される場合です。"
      }
    }
  },
  "oxford": {
    "focus": {
      "en": "Economic performance and future growth trajectory — which cities offer the best conditions for business, investment, and high-skill labour. Essentially a forward-looking investment map.",
      "th": "ประสิทธิภาพทางเศรษฐกิจและทิศทางการเติบโตในอนาคต — เมืองไหนเสนอเงื่อนไขที่ดีที่สุดสำหรับธุรกิจ, การลงทุน, และแรงงานทักษะสูง โดยแก่นแท้แล้วมันคือแผนที่การลงทุนที่มองไปสู่อนาคต",
      "zh": "经济表现和未来增长轨迹——哪些城市为商业、投资和高技能劳动力提供了最佳条件。本质上是一张具有前瞻性的投资地图。",
      "ko": "경제 성과 및 미래 성장 궤적 — 비즈니스, 투자 및 고숙련 노동력에 가장 좋은 조건을 제공하는 도시는 어디인가. 본질적으로 미래지향적인 투자 지도.",
      "ja": "経済的パフォーマンスと将来の成長軌道 — どの都市がビジネス、投資、そして高度なスキルを持つ労働力にとって最良の条件を提供しているか。本質的には未来志向の投資マップです。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Measure current city performance and growth potential across economics, human capital, quality of life, environment, and governance.",
        "th": "วัดประสิทธิภาพปัจจุบันของเมืองและศักยภาพการเติบโตทั่วทั้งเศรษฐศาสตร์ ทุนมนุษย์ คุณภาพชีวิต สิ่งแวดล้อม และธรรมาภิบาล",
        "zh": "衡量城市在经济、人力资本、生活质量、环境和治理方面的当前表现和增长潜力。",
        "ko": "경제, 인적 자본, 삶의 질, 환경 및 거버넌스 전반에 걸친 현재 도시 성과 및 성장 잠재력을 측정합니다.",
        "ja": "経済、人的資本、生活の質、環境、ガバナンスにわたる現在の都市のパフォーマンスと成長の可能性を測定する。"
      },
      "actualMeasure": {
        "en": "Economics and human capital together dominate the score. The index is explicitly designed to inform corporate location decisions and public-sector investment strategies — the same clients who pay Oxford Economics for customised city benchmarking reports. Quality of life is a sub-pillar but is weighted much lower than economic output and labour-market depth. Future growth outlook (a separate but related product) is frequently conflated with the current index in media coverage, blurring present-day performance with forecast trajectories. Oxford Economics sells bespoke city analysis to governments and developers — the same entities whose cities appear in the ranking.",
        "th": "เศรษฐศาสตร์และทุนมนุษย์รวมกันครองคะแนนส่วนใหญ่ ดัชนีนี้ถูกออกแบบมาอย่างชัดเจนเพื่อให้ข้อมูลประกอบการตัดสินใจเรื่องที่ตั้งองค์กรและกลยุทธ์การลงทุนของภาครัฐ — ซึ่งก็คือลูกค้ารายเดียวกับที่จ่ายเงินให้ Oxford Economics เพื่อทำรายงานเทียบเคียงเมืองแบบกำหนดเอง คุณภาพชีวิตเป็นเสาหลักย่อยแต่ถูกให้น้ำหนักต่ำกว่าผลผลิตทางเศรษฐกิจและความลึกของตลาดแรงงานมาก แนวโน้มการเติบโตในอนาคต (ซึ่งเป็นผลผลิตแยกต่างหากแต่เกี่ยวข้องกัน) มักถูกสื่อนำไปปะปนกับดัชนีปัจจุบัน ทำให้ประสิทธิภาพในวันนี้กลืนไปกับเส้นทางที่คาดการณ์ไว้ Oxford Economics ขายการวิเคราะห์เมืองแบบสั่งทำให้กับรัฐบาลและผู้พัฒนาอสังหาฯ — ซึ่งเป็นหน่วยงานเดียวกับที่เมืองของพวกเขาปรากฏในการจัดอันดับ",
        "zh": "经济和人力资本共同主导了得分。该指数被明确设计用于为企业选址决策和公共部门投资策略提供信息——而这些客户正是花钱请 Oxford Economics 撰写定制城市基准报告的人。“生活质量”是一个子支柱，但其权重远低于经济产出和劳动力市场深度。在媒体报道中，未来的增长前景（一个独立但相关的产品）经常与当前指数混为一谈，模糊了目前的表现与预测的轨迹。Oxford Economics 向政府和开发商出售定制的城市分析——而这些实体的城市恰好就出现在排名中。",
        "ko": "경제 및 인적 자본이 점수를 주도합니다. 이 지수는 기업의 입지 결정 및 공공 부문 투자 전략에 정보를 제공하도록 명시적으로 설계되었습니다 — 맞춤형 도시 벤치마킹 보고서를 위해 Oxford Economics에 비용을 지불하는 바로 그 고객들입니다. 삶의 질은 하위 기둥이지만 경제적 생산 및 노동 시장의 깊이보다 훨씬 낮게 평가됩니다. 미래 성장 전망(별개지만 관련 있는 제품)은 미디어 보도에서 현재 지수와 자주 혼동되어, 오늘날의 성과와 예측 궤적을 흐리게 합니다. Oxford Economics는 정부와 개발업체에 맞춤형 도시 분석을 판매합니다 — 그들의 도시가 순위에 오르는 바로 그 기업들입니다.",
        "ja": "経済と人的資本がスコアを独占しています。この指標は、企業の立地決定や公共部門の投資戦略に情報を提供するために明確に設計されています — これは、カスタマイズされた都市のベンチマークレポートのためにオックスフォード・エコノミクスに料金を支払うのと同じ顧客です。生活の質はサブの柱ですが、経済生産高や労働市場の厚みよりもはるかに低いウェイトが置かれています。将来の成長見通し（別のものであるが関連する製品）は、メディアの報道では現在の指標と混同されることが多く、現在のパフォーマンスと予測された軌道を曖昧にしています。オックスフォード・エコノミクスは、政府や開発業者にオーダーメイドの都市分析を販売しています — その都市がランキングに登場するのと同じ実体です。"
      },
      "categories": {
        "en": ["Economics: GDP, growth rate, trade, financial depth, business environment", "Human Capital: talent pool, education levels, research output, skills", "Quality of Life: healthcare access, safety, environment, housing (weakly weighted)", "Environment: emissions, green infrastructure, climate risk", "Governance: institutional quality, transparency, regulatory efficiency"],
        "th": ["เศรษฐศาสตร์: GDP, อัตราการเติบโต, การค้า, ความลึกทางการเงิน, สภาพแวดล้อมทางธุรกิจ", "ทุนมนุษย์: กลุ่มผู้มีความสามารถ, ระดับการศึกษา, ผลผลิตการวิจัย, ทักษะ", "คุณภาพชีวิต: การเข้าถึงการรักษาพยาบาล, ความปลอดภัย, สิ่งแวดล้อม, ที่อยู่อาศัย (ให้น้ำหนักน้อย)", "สิ่งแวดล้อม: การปล่อยมลพิษ, โครงสร้างพื้นฐานสีเขียว, ความเสี่ยงด้านสภาพภูมิอากาศ", "ธรรมาภิบาล: คุณภาพของสถาบัน, ความโปร่งใส, ประสิทธิภาพในการกำกับดูแล"],
        "zh": ["经济学：GDP、增长率、贸易、金融深度、商业环境", "人力资本：人才库、教育水平、研究产出、技能", "生活质量：医疗服务可及性、安全、环境、住房（权重较低）", "环境：排放、绿色基础设施、气候风险", "治理：机构质量、透明度、监管效率"],
        "ko": ["경제: GDP, 성장률, 무역, 금융의 깊이, 비즈니스 환경", "인적 자본: 인재 풀, 교육 수준, 연구 성과, 기술", "삶의 질: 의료 접근성, 안전, 환경, 주거(낮은 가중치)", "환경: 배출량, 녹색 인프라, 기후 위험", "거버넌스: 제도적 질, 투명성, 규제 효율성"],
        "ja": ["経済学：GDP、成長率、貿易、金融の深さ、ビジネス環境", "人的資本：人材プール、教育水準、研究成果、スキル", "生活の質：医療アクセス、安全性、環境、住宅（弱い重み付け）", "環境：排出量、グリーンインフラ、気候リスク", "ガバナンス：制度の質、透明性、規制の効率性"]
      },
      "dataInputs": {
        "en": ["IMF, World Bank, OECD, national statistics offices", "Oxford Economics proprietary GDP and growth models", "Business environment indices (World Bank Doing Business)", "No resident surveys — entirely data-model driven"],
        "th": ["สำนักงานสถิติแห่งชาติ, IMF, World Bank, OECD", "โมเดล GDP และการเติบโตที่เป็นกรรมสิทธิ์ของ Oxford Economics", "ดัชนีสภาพแวดล้อมทางธุรกิจ (World Bank Doing Business)", "ไม่มีการสำรวจผู้อยู่อาศัย — ขับเคลื่อนด้วยโมเดลข้อมูลทั้งหมด"],
        "zh": ["国际货币基金组织 (IMF)、世界银行、经合组织、国家统计局", "Oxford Economics 专有的 GDP 和增长模型", "商业环境指数（世界银行《营商环境报告》）", "没有居民调查——完全由数据模型驱动"],
        "ko": ["IMF, 세계은행, OECD, 국가 통계청", "Oxford Economics의 독점적인 GDP 및 성장 모델", "비즈니스 환경 지수(세계은행 Doing Business)", "거주자 설문 조사 없음 — 전적으로 데이터 모델 주도"],
        "ja": ["IMF、世界銀行、OECD、各国の統計局", "オックスフォード・エコノミクスの独自のGDPと成長モデル", "ビジネス環境指数（世界銀行のビジネス環境の現状）", "住民アンケートなし — 完全にデータモデル駆動"]
      },
      "blindSpots": {
        "en": ["Housing affordability and rent burden for residents", "Income inequality within cities", "Working conditions, burnout, overwork (absent)", "Community social capital and civic health", "Digital divide and technology access inequality", "Conflict of interest: publisher sells advisory services to cities in the ranking"],
        "th": ["ความสามารถในการจ่ายค่าที่อยู่อาศัยและภาระค่าเช่าของผู้อยู่อาศัย", "ความเหลื่อมล้ำทางรายได้ภายในเมือง", "สภาพการทำงาน, ความเหนื่อยล้า, การทำงานหนักเกินไป (หายไป)", "ทุนทางสังคมของชุมชนและสุขภาวะของพลเมือง", "ช่องว่างทางดิจิทัลและความไม่เท่าเทียมในการเข้าถึงเทคโนโลยี", "ผลประโยชน์ทับซ้อน: ผู้จัดทำขายบริการให้คำปรึกษาแก่เมืองต่างๆ ในการจัดอันดับ"],
        "zh": ["居民的住房负担能力和租金压力", "城市内部的收入不平等", "工作条件、倦怠、过度工作（未涉及）", "社区社会资本和公民健康", "数字鸿沟和技术获取的不平等", "利益冲突：发布者向排名中的城市出售咨询服务"],
        "ko": ["거주자의 주거 비용 감당 능력 및 임대료 부담", "도시 내 소득 불평등", "근로 조건, 번아웃, 과로 (누락됨)", "지역 사회 사회적 자본 및 시민 건강", "디지털 격차 및 기술 접근성 불평등", "이해 상충: 발행인이 순위에 있는 도시에 자문 서비스를 판매함"],
        "ja": ["住民にとっての住宅の手頃さと家賃の負担", "都市内の所得の不平等", "労働条件、燃え尽き症候群、過労（なし）", "コミュニティのソーシャルキャピタルと市民の健康", "デジタルデバイドとテクノロジーへのアクセスの不平等", "利益相反：発行者はランキングにある都市にアドバイザリーサービスを販売している"]
      },
      "audienceNote": {
        "en": "Corporate real estate teams, sovereign wealth funds, city economic development agencies, and consultants advising governments on investment attraction. Not designed for residents.",
        "th": "ทีมอสังหาริมทรัพย์ระดับองค์กร, กองทุนความมั่งคั่งแห่งชาติ, หน่วยงานพัฒนาเศรษฐกิจของเมือง, และที่ปรึกษาที่ให้คำแนะนำรัฐบาลเรื่องการดึงดูดการลงทุน ไม่ได้ออกแบบมาสำหรับผู้อยู่อาศัย",
        "zh": "企业房地产团队、主权财富基金、城市经济发展机构，以及为政府提供招商引资建议的顾问。并非为居民设计。",
        "ko": "기업 부동산 팀, 국부 펀드, 도시 경제 개발 기관, 그리고 정부에 투자 유치에 대해 조언하는 컨설턴트. 거주자를 위해 설계되지 않았습니다.",
        "ja": "企業の不動産チーム、ソブリン・ウェルス・ファンド、都市の経済開発機関、そして投資誘致について政府に助言するコンサルタント。住民向けに設計されたものではありません。"
      }
    },
    "critique": {
      "headline": {
        "en": "A location map for capital, not a quality-of-life index",
        "th": "แผนที่ทำเลสำหรับเงินทุน ไม่ใช่ดัชนีคุณภาพชีวิต",
        "zh": "一份为资本指路的地图，而非生活质量指数",
        "ko": "자본을 위한 위치 지도일 뿐, 삶의 질 지수가 아님",
        "ja": "資本のためのロケーションマップであり、生活の質の指標ではない"
      },
      "body": {
        "en": "Oxford Economics GCI is the most candid of the eight about its purpose: it is a product for investors and corporations deciding where to place capital and talent. Economics accounts for the largest share of the score, and ‘quality of life’ is included primarily because it affects the ability to attract high-skill workers — not because residents’ wellbeing matters in its own right. The publisher also sells bespoke city analysis to governments and developers, creating a structural incentive to include influential clients as ‘top performers.’ Housing affordability, working hours, and inequality are absent. The resulting top 10 is entirely predictable: the cities where the most capital already sits.",
        "th": "Oxford Economics GCI เป็นดัชนีที่ตรงไปตรงมาที่สุดใน 8 ดัชนีเกี่ยวกับจุดประสงค์ของมัน: มันคือผลิตภัณฑ์สำหรับนักลงทุนและองค์กรในการตัดสินใจว่าจะวางเงินทุนและคนเก่งไว้ที่ไหน เศรษฐศาสตร์ครองสัดส่วนคะแนนมากที่สุด และ 'คุณภาพชีวิต' ถูกรวมไว้หลักๆ เพราะมันส่งผลต่อความสามารถในการดึงดูดแรงงานทักษะสูง — ไม่ใช่เพราะความเป็นอยู่ของชาวเมืองสำคัญในตัวมันเอง ผู้จัดทำยังขายการวิเคราะห์เมืองแบบสั่งทำให้กับรัฐบาลและนักพัฒนา สร้างแรงจูงใจเชิงโครงสร้างที่จะรวมลูกค้ารายใหญ่ให้เป็น 'ผู้ทำผลงานยอดเยี่ยม' ความสามารถในการจ่ายค่าที่อยู่อาศัย ชั่วโมงทำงาน และความเหลื่อมล้ำหายไป ท็อป 10 ที่ได้จึงเดาทางได้ง่ายมาก: คือเมืองที่มีทุนกองอยู่มากที่สุดอยู่แล้ว",
        "zh": "在这八个指数中，Oxford Economics GCI 对其目的最为坦白：它是一个为决定在哪里投入资本和人才的投资者和企业提供的产品。经济占了得分的最大份额，而加入“生活质量”主要是因为它会影响吸引高技能工人的能力——而不是因为居民的福祉本身很重要。发布者还向政府和开发商出售定制的城市分析，这就产生了一种结构性的动机，将有影响力的客户列为“表现最佳者”。住房负担能力、工作时间以及不平等方面的问题付之阙如。最终得出的前 10 名完全在意料之中：也就是那些资本原本就最集中的城市。",
        "ko": "Oxford Economics GCI는 8개 지수 중 목적에 대해 가장 솔직합니다. 자본과 인재를 어디에 배치할지 결정하는 투자자와 기업을 위한 제품입니다. 경제가 점수에서 가장 큰 비중을 차지하며, '삶의 질'이 포함된 것은 주로 고숙련 노동자를 유치하는 능력에 영향을 미치기 때문이지 주민의 웰빙 자체가 중요해서가 아닙니다. 퍼블리셔는 정부와 개발자에게 맞춤형 도시 분석을 판매하여 영향력 있는 고객을 '최고의 성과자'로 포함시킬 구조적 인센티브를 만듭니다. 주택 감당 능력, 노동 시간 및 불평등은 없습니다. 그 결과 상위 10위는 완전히 예측 가능합니다. 가장 많은 자본이 이미 자리 잡고 있는 도시입니다.",
        "ja": "オックスフォード・エコノミクスのGCIは、その目的について8つの中で最も率直です。それは資本と才能をどこに配置するかを決定する投資家や企業向けの製品です。経済学がスコアの最大のシェアを占めており、「生活の質」が含まれているのは、主に高度なスキルを持つ労働者を惹きつける能力に影響を与えるためであり、住民の幸福自体が重要だからではありません。発行者は政府や開発業者にオーダーメイドの都市分析を販売しており、影響力のある顧客を「トップパフォーマー」として含める構造的なインセンティブを生み出しています。住宅の手頃な価格、労働時間、そして不平等は存在しません。その結果生じるトップ10は完全に予測可能です。すでに最も多くの資本が存在する都市です。"
      }
    }
  },
  "hanke": {
    "focus": {
      "en": "Pure macroeconomic stress: 2×unemployment + inflation + bank-lending-rate − real GDP/capita growth. Lower scores = 'happier' economy.",
      "th": "ความเครียดทางเศรษฐกิจมหภาคล้วนๆ: 2×การว่างงาน + เงินเฟ้อ + อัตราดอกเบี้ยกู้ยืม - การเติบโตของ GDP แท้จริงต่อหัว คะแนนยิ่งต่ำ = เศรษฐกิจที่ 'มีความสุข' กว่า",
      "zh": "纯粹的宏观经济压力：2 × 失业率 + 通货膨胀率 + 银行贷款利率 - 实际人均 GDP 增长率。得分越低 = 经济越“幸福”。",
      "ko": "순수한 거시경제적 스트레스: 실업률 × 2 + 인플레이션 + 은행 대출 금리 - 실질 1인당 GDP 성장률. 점수가 낮을수록 = '행복한' 경제.",
      "ja": "純粋なマクロ経済のストレス：2×失業率 ＋ インフレ率 ＋ 銀行貸出金利 − 実質1人当たりGDP成長率。スコアが低いほど「幸せな」経済。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Measure 'the temperature of the patient' — how miserable or healthy the macroeconomic environment is for an average resident.",
        "th": "วัด 'อุณหภูมิของผู้ป่วย' — สภาพแวดล้อมทางเศรษฐกิจมหภาคน่าหดหู่หรือแข็งแรงแค่ไหนสำหรับชาวเมืองโดยเฉลี่ย",
        "zh": "测量“病人的体温”——普通居民所处的宏观经济环境有多糟糕或多健康。",
        "ko": "'환자의 체온' 측정 — 평균적인 거주자에게 거시경제 환경이 얼마나 비참하거나 건강한지.",
        "ja": "「患者の体温」を測る — 平均的な住民にとってマクロ経済環境がどれほど悲惨か、あるいは健康的か。"
      },
      "actualMeasure": {
        "en": "Pure macroeconomic vital signs. Captures inflation, unemployment, lending rates, and growth per capita. By construction it ignores everything that isn't a Bloomberg-feedable number — mental health, civic freedom, LGBTQ+ legal environment, working hours, housing affordability for non-citizens, environmental misery, gender equality, social trust. Hanke himself frames the index as economic vital signs, not wellbeing. Authoritarian states with low inflation and tight labour markets (Singapore, Qatar, Macau) consistently appear near the top.",
        "th": "สัญญาณชีพทางเศรษฐกิจมหภาคล้วนๆ ตรวจจับอัตราเงินเฟ้อ การว่างงาน อัตราดอกเบี้ยกู้ยืม และการเติบโตต่อหัว โครงสร้างของมันละเลยทุกสิ่งที่ไม่ใช่ตัวเลขที่ป้อนเข้า Bloomberg ได้ — สุขภาพจิต เสรีภาพพลเมือง สภาพแวดล้อมทางกฎหมาย LGBTQ+ ชั่วโมงทำงาน ความสามารถในการจ่ายค่าที่พักสำหรับผู้ที่ไม่ใช่พลเมือง ความทุกข์ทนด้านสิ่งแวดล้อม ความเท่าเทียมทางเพศ ความเชื่อใจในสังคม Hanke เองจัดกรอบดัชนีนี้ว่าเป็นสัญญาณชีพทางเศรษฐกิจ ไม่ใช่ความเป็นอยู่ที่ดี รัฐเผด็จการที่มีเงินเฟ้อต่ำและตลาดแรงงานตึงตัว (สิงคโปร์, กาตาร์, มาเก๊า) ปรากฏอยู่บนๆ เสมอ",
        "zh": "纯粹的宏观经济生命体征。捕捉通货膨胀、失业率、贷款利率和人均增长。从其结构设计来看，它忽略了所有不能通过彭博社(Bloomberg)输入数据的数字——心理健康、公民自由、LGBTQ+ 法律环境、工作时间、非公民的住房可负担性、环境恶劣程度、性别平等以及社会信任。Hanke 本人也将该指数定位为经济生命体征，而非衡量福祉的指标。那些通胀率低且劳动力市场紧张的威权国家（如新加坡、卡塔尔、中国澳门）总是名列前茅。",
        "ko": "순수한 거시경제 활력 징후. 인플레이션, 실업, 대출 금리 및 1인당 성장을 포착합니다. 구조적으로 Bloomberg 피드에 제공 가능한 수치가 아닌 모든 것(정신 건강, 시민 자유, LGBTQ+ 법적 환경, 근로 시간, 비시민권자의 주택 감당 능력, 환경적 불행, 성평등, 사회적 신뢰)을 무시합니다. Hanke 자신도 이 지수를 웰빙이 아닌 경제적 활력 징후로 규정합니다. 인플레이션이 낮고 노동 시장이 경직된 권위주의 국가(싱가포르, 카타르, 마카오)가 지속적으로 최상위권에 나타납니다.",
        "ja": "純粋なマクロ経済のバイタルサイン。インフレ、失業、貸出金利、1人当たりの成長を捉えます。構造上、ブルームバーグに入力できる数字以外のすべて（メンタルヘルス、市民の自由、LGBTQ+の法的環境、労働時間、非市民の住宅の手頃さ、環境の悲惨さ、ジェンダー平等、社会的信頼）を無視しています。ハンケ自身は、この指標を幸福度ではなく経済的なバイタルサインとして位置づけています。低インフレで労働市場が逼迫している権威主義国家（シンガポール、カタール、マカオ）が常に上位に名を連ねます。"
      },
      "categories": {
        "en": ["End-period consumer price inflation rate", "Bank lending rate (cost of credit)", "Unemployment rate (weighted ×2)", "Real GDP per capita growth (subtracted)"],
        "th": ["อัตราเงินเฟ้อราคาผู้บริโภคช่วงปลายงวด", "อัตราดอกเบี้ยกู้ยืมของธนาคาร (ต้นทุนสินเชื่อ)", "อัตราการว่างงาน (ถ่วงน้ำหนัก ×2)", "การเติบโตของ GDP แท้จริงต่อหัว (หักลบ)"],
        "zh": ["期末消费者物价通胀率", "银行贷款利率（信贷成本）", "失业率（加权 ×2）", "实际人均 GDP 增长率（减去）"],
        "ko": ["기말 소비자 물가 인플레이션율", "은행 대출 금리 (신용 비용)", "실업률 (가중치 ×2)", "실질 1인당 GDP 성장률 (차감)"],
        "ja": ["期末の消費者物価上昇率", "銀行の貸出金利（信用のコスト）", "失業率（2倍の重み付け）", "実質1人当たりGDP成長率（減算）"]
      },
      "dataInputs": {
        "en": ["IMF + World Bank + national central banks for inflation", "ILO + national labor statistics for unemployment", "Central bank data for lending rates", "IMF / World Bank for GDP per capita growth"],
        "th": ["IMF + World Bank + ธนาคารกลางของประเทศ สำหรับเงินเฟ้อ", "ILO + สถิติแรงงานแห่งชาติ สำหรับการว่างงาน", "ข้อมูลธนาคารกลาง สำหรับอัตราดอกเบี้ยกู้ยืม", "IMF / World Bank สำหรับการเติบโตของ GDP ต่อหัว"],
        "zh": ["国际货币基金组织 (IMF) + 世界银行 + 各国中央银行的通胀数据", "国际劳工组织 (ILO) + 国家劳工统计数据的失业率", "中央银行关于贷款利率的数据", "国际货币基金组织 (IMF) / 世界银行关于人均 GDP 增长的数据"],
        "ko": ["인플레이션: IMF + 세계은행 + 국가 중앙은행", "실업률: ILO + 국가 노동 통계", "대출 금리: 중앙은행 데이터", "1인당 GDP 성장: IMF / 세계은행"],
        "ja": ["インフレ率：IMF＋世界銀行＋各国の中央銀行", "失業率：ILO＋各国の労働統計", "貸出金利：中央銀行のデータ", "1人当たりGDP成長率：IMF／世界銀行"]
      },
      "blindSpots": {
        "en": ["Mental-health distress (depression, suicide, work-related burnout)", "Civic freedom and political rights (Hanke's top-10 includes Qatar, Singapore, Macau)", "LGBTQ+ legal environment", "Working-time pressure and overwork culture", "Housing affordability for non-citizen residents (Singapore's HDB regime favours citizens)", "Environmental misery — air quality, climate extremes", "Income inequality within a country (national averages hide extreme distributions)", "Gender equality and women's autonomy"],
        "th": ["ความทุกข์ทรมานด้านสุขภาพจิต (ซึมเศร้า, ฆ่าตัวตาย, ภาวะหมดไฟจากการทำงาน)", "เสรีภาพพลเมืองและสิทธิทางการเมือง (ท็อป 10 ของ Hanke รวม กาตาร์, สิงคโปร์, มาเก๊า)", "สภาพแวดล้อมทางกฎหมายของ LGBTQ+", "ความกดดันเรื่องเวลาทำงานและวัฒนธรรมทำงานหนักเกินไป", "ความสามารถในการจ่ายค่าที่พักสำหรับผู้ที่ไม่ใช่พลเมือง (ระบบ HDB ของสิงคโปร์เอื้อประโยชน์ต่อพลเมือง)", "ความทุกข์ทนด้านสิ่งแวดล้อม — คุณภาพอากาศ, สภาพอากาศสุดขั้ว", "ความเหลื่อมล้ำทางรายได้ภายในประเทศ (ค่าเฉลี่ยระดับชาติปกปิดการกระจายตัวแบบสุดโต่ง)", "ความเท่าเทียมทางเพศและอิสระของผู้หญิง"],
        "zh": ["心理健康困扰（抑郁、自杀、与工作相关的倦怠）", "公民自由和政治权利（Hanke 的前十名包括卡塔尔、新加坡和中国澳门）", "LGBTQ+ 的法律环境", "工作时间压力和过度加班文化", "非公民居民的住房负担能力（新加坡的建屋发展局制度倾向于本国公民）", "环境恶劣——空气质量、极端气候", "一国之内的收入不平等（全国平均水平掩盖了极端的分配差距）", "性别平等与女性自主权"],
        "ko": ["정신 건강 고통 (우울증, 자살, 업무 관련 번아웃)", "시민의 자유 및 정치적 권리 (Hanke의 상위 10위에는 카타르, 싱가포르, 마카오가 포함됨)", "LGBTQ+ 법적 환경", "근로 시간 압박 및 과로 문화", "비시민권자 거주자를 위한 주택 감당 능력 (싱가포르의 HDB 제도는 시민권자를 우대함)", "환경적 불행 — 대기 질, 기후 변화", "국가 내 소득 불평등 (국가 평균은 극단적인 분배를 숨김)", "양성 평등 및 여성의 자율성"],
        "ja": ["メンタルヘルスの苦痛（うつ病、自殺、仕事関連の燃え尽き症候群）", "市民の自由と政治的権利（ハンケのトップ10にはカタール、シンガポール、マカオが含まれる）", "LGBTQ+の法的環境", "労働時間のプレッシャーと過労文化", "非市民の居住者にとっての住宅の手頃さ（シンガポールのHDB制度は市民を優遇している）", "環境の悲惨さ — 大気質、極端な気候", "国内の所得の不平等（全国平均は極端な分布を隠している）", "ジェンダー平等と女性の自律性"]
      },
      "audienceNote": {
        "en": "Macroeconomists, central banks, sovereign-debt analysts. Useful as one input for assessing whether a country is heading into a debt crisis. Not designed to tell you whether residents are flourishing.",
        "th": "นักเศรษฐศาสตร์มหภาค ธนาคารกลาง นักวิเคราะห์หนี้สาธารณะ มีประโยชน์ในฐานะข้อมูลหนึ่งเพื่อประเมินว่าประเทศกำลังมุ่งสู่วิกฤตหนี้หรือไม่ ไม่ได้ออกแบบมาเพื่อบอกว่าพลเมืองกำลังเจริญรุ่งเรืองหรือไม่",
        "zh": "宏观经济学家、中央银行和主权债务分析师。作为评估一个国家是否正走向债务危机的一种输入参考是很有用的。并非为了告诉你当地居民是否安居乐业而设计。",
        "ko": "거시경제학자, 중앙은행, 국가 부채 분석가. 국가가 부채 위기로 치닫고 있는지 평가하기 위한 하나의 입력 자료로 유용합니다. 주민들이 번창하고 있는지 알려주기 위해 설계되지 않았습니다.",
        "ja": "マクロ経済学者、中央銀行、ソブリン債のアナリスト。ある国が債務危機に向かっているかどうかを評価するための1つの入力として役立ちます。住民が繁栄しているかどうかを伝えるようには設計されていません。"
      }
    },
    "critique": {
      "headline": {
        "en": "A thermostat, not a wellbeing index",
        "th": "เทอร์โมสตัท ไม่ใช่ดัชนีชี้วัดความเป็นอยู่ที่ดี",
        "zh": "它是个“温度计”，而非福祉指数",
        "ko": "온도계일 뿐, 웰빙 지수가 아님",
        "ja": "幸福度指数ではなく、温度計"
      },
      "body": {
        "en": "HAMI was honestly designed to measure macroeconomic stability and nothing else, and within that scope it works. The trouble is when it gets read as a happiness ranking and authoritarian states with low inflation and tight labor markets — Singapore, Qatar, Macau — appear in the top 10. Hanke himself never claimed otherwise; the index is a temperature reading. SLIC measures whether the patient wants to keep living there. The gap between Hanke's Singapore #2 and SLIC's Singapore #21 is exactly the dignity dimension Hanke's formula deliberately excludes — mental-health distress, civic freedom, LGBTQ+ legal restrictions, world's lowest fertility rate as the lived consequence.",
        "th": "HAMI ถูกออกแบบมาอย่างซื่อสัตย์เพื่อวัดความมั่นคงทางเศรษฐกิจมหภาคและไม่มีอย่างอื่นเลย และภายใต้ขอบเขตนั้นมันทำงานได้ดี ปัญหาคือเมื่อมันถูกตีความว่าเป็นการจัดอันดับความสุข แล้วรัฐเผด็จการที่มีเงินเฟ้อต่ำและตลาดแรงงานตึงตัว — สิงคโปร์, กาตาร์, มาเก๊า — ไปโผล่ในท็อป 10 Hanke เองไม่เคยอ้างเป็นอย่างอื่นเลย; ดัชนีนี้คือการวัดอุณหภูมิ SLIC วัดว่าผู้ป่วยอยากมีชีวิตอยู่ต่อที่นั่นไหม ช่องว่างระหว่างสิงคโปร์ #2 ของ Hanke กับสิงคโปร์ #21 ของ SLIC ก็คือมิติแห่งศักดิ์ศรีที่สูตรของ Hanke จงใจตัดออกไปนั่นเอง — ความเครียดทางสุขภาพจิต, เสรีภาพพลเมือง, ข้อจำกัดทางกฎหมาย LGBTQ+, และอัตราการเกิดต่ำที่สุดในโลกที่เป็นผลสะท้อนจากชีวิตจริง",
        "zh": "HAMI 被如实设计用于仅衡量宏观经济稳定性，在这个范围内它是有效的。麻烦在于，当它被解读为幸福排名，并且通胀率低、劳动力市场紧俏的威权国家——新加坡、卡塔尔、中国澳门——出现在前十名时。Hanke 本人从未有过其他声称；该指数就是一个温度读数。而 SLIC 衡量的是患者是否想继续生活在那里。Hanke 榜单中排名第二的新加坡，与 SLIC 榜单中排名第 21 的新加坡之间的差距，恰恰就是 Hanke 的公式刻意排除的尊严维度——心理健康困扰、公民自由、LGBTQ+ 法律限制，以及作为生活后果的全球最低生育率。",
        "ko": "HAMI는 거시경제적 안정성을 측정하기 위해 정직하게 설계되었으며 그 외에는 아무것도 없습니다. 그리고 그 범위 내에서는 효과가 있습니다. 문제는 이 지수가 행복 순위로 읽히고, 인플레이션이 낮고 노동 시장이 경직된 권위주의 국가 — 싱가포르, 카타르, 마카오 — 가 상위 10위 안에 등장할 때입니다. Hanke 자신은 그렇지 않다고 주장한 적이 없습니다. 지수는 체온 측정값입니다. SLIC는 환자가 그곳에 계속 살고 싶어하는지 측정합니다. Hanke의 싱가포르 2위와 SLIC의 싱가포르 21위 사이의 격차는 Hanke의 공식이 의도적으로 배제하는 존엄성 차원(정신 건강의 고통, 시민의 자유, LGBTQ+에 대한 법적 제한, 그로 인한 세계 최저의 출산율 등)과 정확히 일치합니다.",
        "ja": "HAMIはマクロ経済の安定性を測定するためだけに正直に設計されており、その範囲内では機能します。問題は、それが幸福度ランキングとして読まれ、低インフレで労働市場が逼迫している権威主義国家 — シンガポール、カタール、マカオ — がトップ10に入っている場合です。ハンケ自身はそれ以外のことを主張したことはありません。この指標は温度の読み取りです。SLICは、患者がそこに住み続けたいかどうかを測定します。ハンケのシンガポール2位とSLICのシンガポール21位のギャップは、まさにハンケの公式が意図的に除外している尊厳の側面 — メンタルヘルスの苦痛、市民の自由、LGBTQ+の法的制限、そしてその生活の結果としての世界最低の出生率 — です。"
      }
    }
  },
  "slic-soft-power": {
    "focus": {
      "en": "Cities ranked by attraction power — visitor magnetism, religious and ethnic pluralism, cuisine diversity, cultural exports, and visa openness in both directions. Built explicitly to challenge the Eurocentric bias of Michelin, Resonance, Brand Finance, Monocle Soft Power, and other Western-anchored cultural rankings.",
      "th": "จัดอันดับเมืองตามพลังดึงดูด — เสน่ห์ที่ดึงดูดนักท่องเที่ยว ความเป็นพหุนิยมทางศาสนาและชาติพันธุ์ ความหลากหลายของอาหาร การส่งออกทางวัฒนธรรม และความเปิดกว้างด้านวีซ่าทั้งสองทิศทาง สร้างขึ้นอย่างชัดเจนเพื่อท้าทายอคติที่มีศูนย์กลางอยู่ที่ยุโรปของ Michelin, Resonance, Brand Finance, Monocle Soft Power, และการจัดอันดับวัฒนธรรมที่ยึดชาติตะวันตกเป็นศูนย์กลางอื่นๆ",
      "zh": "按吸引力排名的城市——游客磁力、宗教和种族多元化、美食多样性、文化输出以及双向签证开放度。明确旨在挑战米其林、Resonance、Brand Finance、Monocle Soft Power 等以西方为基点的文化排名中存在的欧洲中心主义偏见。",
      "ko": "관광객 유치력, 종교 및 인종적 다원주의, 요리의 다양성, 문화 수출, 양방향 비자 개방성 등 흡인력으로 순위를 매긴 도시. 미슐랭(Michelin), 레조넌스(Resonance), 브랜드 파이낸스(Brand Finance), 모노클 소프트 파워(Monocle Soft Power) 및 기타 서구 중심 문화 순위의 유럽 중심적 편견에 도전하기 위해 명시적으로 구축되었습니다.",
      "ja": "引力によってランク付けされた都市 — 訪問者を惹きつける力、宗教的および民族的な多元性、料理の多様性、文化的な輸出、そして双方向のビザの開放性。ミシュラン、レゾナンス、ブランド・ファイナンス、モノクル・ソフトパワー、その他の西洋を中心とした文化的ランキングのヨーロッパ中心主義のバイアスに明確に挑戦するために構築されました。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Measure attraction power — the soft cultural pull a city exerts on visitors, residents, and the global imagination. Built specifically because Brand Finance, Monocle Soft Power Survey, and similar indices structurally favour Western capitals (London, Paris, New York) and miss the actual gravitational centres of global cultural traffic.",
        "th": "วัดพลังดึงดูด — แรงดึงดูดทางวัฒนธรรมแบบละมุนที่เมืองมีต่อนักท่องเที่ยว ผู้อยู่อาศัย และจินตนาการของคนทั่วโลก สร้างขึ้นมาโดยเฉพาะเพราะ Brand Finance, Monocle Soft Power Survey, และดัชนีทำนองเดียวกัน มักจะเอื้อประโยชน์เชิงโครงสร้างให้กับเมืองหลวงชาติตะวันตก (ลอนดอน ปารีส นิวยอร์ก) และมองข้ามศูนย์กลางแรงโน้มถ่วงที่แท้จริงของการแลกเปลี่ยนวัฒนธรรมระดับโลก",
        "zh": "衡量吸引力——即一座城市对游客、居民及全球想象力产生的柔性文化吸引力。专门建立该指数是因为 Brand Finance、Monocle 软实力调查等类似指数在结构上偏向于西方国家的首都（伦敦、巴黎、纽约），从而错失了全球文化交流实际的引力中心。",
        "ko": "유인력 측정 — 도시가 방문객, 주민, 그리고 글로벌한 상상력에 미치는 부드러운 문화적 끌림. Brand Finance, Monocle Soft Power Survey 및 유사한 지수들이 구조적으로 서구 수도(런던, 파리, 뉴욕)를 선호하며 글로벌 문화 교류의 실제 중력 중심을 놓치고 있기 때문에 특별히 구축되었습니다.",
        "ja": "引力を測定する — 都市が訪問者、住民、そして世界的な想像力に及ぼす柔らかな文化的な引きつけ。ブランドファイナンス、モノクル・ソフトパワーサーベイ、および同様の指標が構造的に西洋の首都（ロンドン、パリ、ニューヨーク）を優遇し、世界的な文化トラフィックの実際の重力の中心を見逃しているため、特別に構築されました。"
      },
      "actualMeasure": {
        "en": "Five-component composite: Magnetism (visitor count weighted by visitor-to-resident ratio, 30%), Pluralism (Pew Government Restrictions on Religion inverted + legal recognition of multiple faiths + ethnic-minority public participation, 25%), Cuisine Density (Shannon entropy of cuisine categories per square km of central metro, 20%), Cultural Exports (global presence of city-originated media — film, music, drama, sport — and culinary diaspora, 15%), Mobility Openness (inbound visa-free destinations available + outbound passport mobility, 10%).",
        "th": "องค์ประกอบรวม 5 ด้าน: พลังดึงดูด (จำนวนนักท่องเที่ยวถ่วงน้ำหนักด้วยอัตราส่วนนักท่องเที่ยวต่อผู้อยู่อาศัย, 30%), พหุนิยม (ข้อจำกัดทางศาสนาของรัฐบาลจาก Pew กลับด้าน + การรับรองหลายความเชื่อทางกฎหมาย + การมีส่วนร่วมสาธารณะของชนกลุ่มน้อย, 25%), ความหนาแน่นของอาหาร (เอนโทรปีแชนนอนของประเภทอาหารต่อตารางกิโลเมตรในใจกลางเมือง, 20%), การส่งออกทางวัฒนธรรม (ตัวตนในระดับโลกของสื่อที่มาจากเมือง — ภาพยนตร์ ดนตรี ละคร กีฬา — และพลัดถิ่นทางอาหาร, 15%), ความเปิดกว้างด้านการเคลื่อนย้าย (จุดหมายปลายทางที่ไม่ต้องขอวีซ่าเข้า + ความคล่องตัวของพาสปอร์ตขาออก, 10%)",
        "zh": "五部分组成的综合指标：磁力（游客数量按游客与居民比例加权，30%），多元主义（皮尤政府宗教限制指数倒置 + 多种信仰的法律承认 + 少数族裔公众参与，25%），美食密度（市中心每平方公里美食类别的香农熵，20%），文化输出（源自该城市的媒体——电影、音乐、戏剧、体育——以及烹饪文化在海外的全球影响力，15%），流动开放度（可用的入境免签目的地 + 出境护照流动性，10%）。",
        "ko": "5가지 구성 요소 결합: 흡인력 (관광객 대 거주자 비율로 가중된 관광객 수, 30%), 다원주의 (Pew 정부 종교 규제 역산 + 다중 종교의 법적 인정 + 소수 민족의 공공 참여, 25%), 요리 밀도 (중심 대도시의 평방 킬로미터당 요리 카테고리의 섀넌 엔트로피, 20%), 문화 수출 (도시 발 미디어 — 영화, 음악, 드라마, 스포츠 — 및 요리 디아스포라의 글로벌 영향력, 15%), 이동 개방성 (인바운드 무비자 목적지 제공 + 아웃바운드 여권 이동성, 10%).",
        "ja": "5つの要素の複合体：磁力（訪問者対住民の比率で重み付けされた訪問者数、30%）、多元性（ピュー・リサーチの政府による宗教制限の逆数 ＋ 複数の信仰の法的承認 ＋ 少数民族の公的参加、25%）、料理の密度（中心地下鉄の1平方kmあたりの料理カテゴリーのシャノンエントロピー、20%）、文化的な輸出（都市発のメディア — 映画、音楽、ドラマ、スポーツ — および料理のディアスポラの世界的プレゼンス、15%）、モビリティの開放性（利用可能なインバウンドのビザ免除の目的地 ＋ アウトバウンドのパスポートの機動性、10%）。"
      },
      "categories": {
        "en": ["Magnetism (30%): MasterCard / Euromonitor international arrivals, Visitor-to-resident ratio (city + metro both)", "Pluralism (25%): Pew Research Government Restrictions on Religion (inverted), legal recognition of plural faiths, ethnic-minority public participation", "Cuisine Density (20%): Shannon entropy of cuisine categories within 1km of a 500m grid in central metro (Google Places + OSM tags)", "Cultural Exports (15%): Global presence of city's drama/music/film/sport (Thai BL, K-drama, anime, Bollywood, Muay Thai, etc.)", "Mobility Openness (10%): Henley Passport Index (outbound) + inbound visa-exemption count + nomad-visa availability (DTV-style)"],
        "th": ["พลังดึงดูด (30%): ผู้มาเยือนจากต่างประเทศจาก MasterCard / Euromonitor, อัตราส่วนนักท่องเที่ยวต่อผู้อยู่อาศัย (ทั้งระดับเมืองและเขตปริมณฑล)", "พหุนิยม (25%): ข้อจำกัดทางศาสนาของรัฐจาก Pew Research (กลับด้าน), การยอมรับทางกฎหมายต่อความเชื่อที่หลากหลาย, การมีส่วนร่วมในที่สาธารณะของกลุ่มชาติพันธุ์ส่วนน้อย", "ความหนาแน่นของอาหาร (20%): เอนโทรปีชานนอนของประเภทอาหารในระยะ 1 กม. ของตาราง 500 ม. กลางเมือง (แท็กจาก Google Places + OSM)", "การส่งออกทางวัฒนธรรม (15%): การปรากฏตัวในระดับโลกของละคร/ดนตรี/ภาพยนตร์/กีฬาของเมือง (เช่น ซีรีส์วายไทย, K-drama, อะนิเมะ, บอลลีวูด, มวยไทย เป็นต้น)", "ความเปิดกว้างในการเดินทาง (10%): Henley Passport Index (ขาออก) + จำนวนประเทศที่ได้รับการยกเว้นวีซ่าเข้าประเทศ + การมีวีซ่าสำหรับผู้อยู่อาศัยชั่วคราวแบบเร่ร่อน (สไตล์ DTV)"],
        "zh": ["吸引力 (30%)：万事达卡 / 欧睿国际入境人数、游客与居民比例（包含市区和都会区）", "多元主义 (25%)：皮尤研究中心关于政府限制宗教的指数（取反）、多信仰的法律认可、少数族裔公共参与", "美食密度 (20%)：市中心 500 米网格 1 公里范围内美食类别的香农熵（基于 Google Places + OpenStreetMap 标签）", "文化输出 (15%)：该城市的戏剧/音乐/电影/体育（如泰剧 BL、韩剧、动漫、宝莱坞、泰拳等）在世界范围内的影响力", "出行开放度 (10%)：亨利护照指数（出境）+ 入境免签国家数量 + 游牧签证可用性（DTV 类）"],
        "ko": ["자력 (30%): MasterCard / Euromonitor 국제 입국자, 거주자 대비 방문객 비율 (도시 + 대도시권 모두)", "다원성 (25%): 퓨 리서치(Pew Research) 정부의 종교 제한 (역순), 다원적 신앙에 대한 법적 승인, 소수 민족의 공공 참여", "음식 밀도 (20%): 도심 내 500m 그리드에서 반경 1km 이내 요리 카테고리의 섀넌 엔트로피 (Google Places + OSM 태그 기반)", "문화 수출 (15%): 도시의 드라마/음악/영화/스포츠 (태국 BL, K-드라마, 애니메이션, 발리우드, 무에타이 등) 의 글로벌 영향력", "이동 개방성 (10%): 헨리 여권 지수 (출국) + 입국 비자 면제국 수 + 노마드 비자 가용성 (DTV 방식)"],
        "ja": ["磁力 (30%)：MasterCard / Euromonitor の海外到着数、居住者に対する訪問者の割合（都市と大都市圏の両方）", "多元主義 (25%)：Pew Research の政府による宗教規制（反転）、複数信仰の法的承認、少数民族の公的参加", "料理の密度 (20%)：中心部地下鉄の500mグリッドから1km以内の料理カテゴリーのシャノンエントロピー（Google Places + OSMタグ）", "文化的輸出 (15%)：都市発のドラマ/音楽/映画/スポーツ（タイのBL、韓国ドラマ、アニメ、ボリウッド、ムエタイなど）のグローバルな存在感", "モビリティの開放性 (10%)：ヘンリー・パスポート・インデックス（出国）＋ 入国ビザ免除の数 ＋ ノマドビザの利用可能性（DTVスタイル）"]
      },
      "dataInputs": {
        "en": ["MasterCard Global Destination Cities Index 2024 (international arrivals)", "UN World Tourism Organisation arrival statistics", "Pew Research Center Government Restrictions on Religion 2022", "U.S. State Department International Religious Freedom Reports", "Henley Passport Index (Q1 2026)", "Government immigration / nomad-visa publications (Thai DTV, Indonesia KITAS, Mexico FMM, etc.)", "Google Places + OpenStreetMap cuisine-tag taxonomy", "Brand Finance Global Soft Power Index (country-level baseline)"],
        "th": ["MasterCard Global Destination Cities Index 2024 (จำนวนผู้เดินทางระหว่างประเทศ)", "สถิติผู้เดินทางมาถึงขององค์การการท่องเที่ยวโลกแห่งสหประชาชาติ (UNWTO)", "Pew Research Center Government Restrictions on Religion 2022", "รายงานเสรีภาพทางศาสนาระหว่างประเทศของกระทรวงการต่างประเทศสหรัฐฯ", "Henley Passport Index (ไตรมาส 1 ปี 2026)", "สิ่งพิมพ์ของรัฐบาลเกี่ยวกับการเข้าเมือง / วีซ่าเร่ร่อน (Thai DTV, Indonesia KITAS, Mexico FMM ฯลฯ)", "การจัดหมวดหมู่แท็กอาหารจาก Google Places + OpenStreetMap", "Brand Finance Global Soft Power Index (เกณฑ์พื้นฐานระดับประเทศ)"],
        "zh": ["万事达卡全球目的地城市指数 2024（国际入境人数）", "联合国世界旅游组织入境统计数据", "皮尤研究中心 2022 年关于政府对宗教限制的报告", "美国国务院国际宗教自由报告", "亨利护照指数（2026 年第一季度）", "政府移民/游牧签证出版物（如泰国 DTV、印度尼西亚 KITAS、墨西哥 FMM 等）", "Google Places + OpenStreetMap 美食标签分类法", "Brand Finance 全球软实力指数（国家层面基准）"],
        "ko": ["MasterCard 글로벌 관광 목적지 지수 2024 (국제 입국자 수)", "UN 세계 관광 기구 입국 통계", "퓨 리서치 센터(Pew Research Center) 2022년 정부의 종교 제한", "미 국무부 국제 종교 자유 보고서", "헨리 여권 지수 (2026년 1분기)", "정부 이민 / 노마드 비자 간행물 (태국 DTV, 인도네시아 KITAS, 멕시코 FMM 등)", "Google Places + OpenStreetMap 요리 태그 분류 체계", "Brand Finance 글로벌 소프트 파워 지수 (국가별 기준)"],
        "ja": ["MasterCard 世界渡航先ランキング 2024（海外からの到着数）", "国連世界観光機関の到着統計", "Pew Research Center の2022年政府による宗教規制", "米国務省の国際信教の自由報告書", "Henley Passport Index（2026年第1四半期）", "政府の移民 / ノマドビザに関する出版物（タイのDTV、インドネシアのKITAS、メキシコのFMMなど）", "Google Places + OpenStreetMap の料理タグ分類", "Brand Finance グローバルソフトパワーインデックス（国レベルのベースライン）"]
      },
      "blindSpots": {
        "en": ["Resident burden — soft power tells you nothing about whether locals can afford rent", "Working conditions — visitors don't see overwork", "Political freedom — countries with restricted civic life can still project soft power (Saudi Arabia hosting Vision 2030 events, China's Belt-and-Road cultural diplomacy)", "Equality of cultural participation — index measures *what's exported*, not who benefits inside the city", "Quality vs. quantity tension — McDonald's is 'cultural export' by any measure; this index leans toward authentic local culture"],
        "th": ["ภาระของผู้อยู่อาศัย — ซอฟต์พาวเวอร์ไม่ได้บอกคุณเลยว่าคนท้องถิ่นมีปัญญาจ่ายค่าเช่าหรือไม่", "สภาพการทำงาน — ผู้มาเยือนไม่เห็นการทำงานหนักเกินไป", "เสรีภาพทางการเมือง — ประเทศที่จำกัดชีวิตพลเมืองยังสามารถแผ่ซอฟต์พาวเวอร์ได้ (ซาอุดิอาระเบียเป็นเจ้าภาพจัดงาน Vision 2030, การทูตเชิงวัฒนธรรม Belt-and-Road ของจีน)", "ความเท่าเทียมในการมีส่วนร่วมทางวัฒนธรรม — ดัชนีวัดว่า *มีการส่งออกอะไร*, ไม่ใช่วัดว่าใครได้ประโยชน์ในเมือง", "ความตึงเครียดระหว่างคุณภาพเทียบกับปริมาณ — ไม่ว่าจะวัดด้วยเกณฑ์ใด McDonald's ก็คือ 'การส่งออกทางวัฒนธรรม' ดัชนีนี้เอนเอียงไปทางวัฒนธรรมท้องถิ่นที่แท้จริง"],
        "zh": ["居民负担——软实力不能告诉你当地人是否付得起房租", "工作条件——游客看不到过度劳累", "政治自由——公民生活受限的国家仍然可以投射软实力（沙特阿拉伯举办“愿景2030”活动，中国的“一带一路”文化外交）", "文化参与的平等性——指数衡量的是*输出的内容*，而不是城市内部谁在受益", "质量与数量的矛盾——无论如何衡量，麦当劳都是一种“文化输出”；而本指数偏向于真实的本土文化"],
        "ko": ["거주자 부담 — 소프트 파워는 현지인이 임대료를 감당할 수 있는지 여부에 대해 아무것도 알려주지 않음", "근로 조건 — 관광객은 과로를 보지 못함", "정치적 자유 — 시민 생활이 제한된 국가도 소프트 파워를 투사할 수 있음 (사우디아라비아의 비전 2030 행사 개최, 중국의 일대일로 문화 외교)", "문화 참여의 평등성 — 지수는 *수출되는 것*을 측정할 뿐, 도시 내에서 누가 혜택을 받는지를 측정하지 않음", "질 vs. 양의 긴장 — 맥도날드는 어떤 기준으로 보아도 '문화 수출'입니다. 이 지수는 진정한 지역 문화 쪽으로 기울어져 있습니다"],
        "ja": ["住民の負担 — ソフトパワーは地元住民が家賃を払えるかどうかについては何も教えてくれません", "労働条件 — 訪問者には過労は見えません", "政治的自由 — 市民生活が制限されている国でもソフトパワーを投影できます（サウジアラビアがビジョン2030のイベントを主催し、中国が一帯一路の文化外交を行っているように）", "文化参加の平等 — この指標は*何が輸出されているか*を測定しており、都市内部で誰が利益を得ているかではありません", "質対量の緊張関係 — マクドナルドはどんな基準でも「文化的な輸出」です。この指標は本物の地域文化に傾いています"]
      },
      "audienceNote": {
        "en": "Tourism boards, cultural diplomacy ministries, MICE planners, expat-life publications, soft-power scholars. Not a livability index — pair with SLIC's main ranking for the resident view.",
        "th": "คณะกรรมการการท่องเที่ยว, กระทรวงการทูตเชิงวัฒนธรรม, นักวางแผน MICE, สิ่งพิมพ์เกี่ยวกับชีวิตชาวต่างชาติ, นักวิชาการด้านซอฟต์พาวเวอร์ ไม่ใช่ดัชนีความน่าอยู่ — ควรจับคู่กับการจัดอันดับหลักของ SLIC สำหรับมุมมองของผู้อยู่อาศัย",
        "zh": "旅游局、文化外交部、MICE（会议、奖励旅游、大型企业会议、活动展览）规划者、外籍人士生活出版物、软实力学者。这不是一个宜居指数——请结合 SLIC 的主要排名来了解居民视角的看法。",
        "ko": "관광청, 문화 외교 부처, MICE 기획자, 주재원 생활 간행물, 소프트 파워 학자. 살기 좋은 지수가 아닙니다 — 거주자의 관점을 파악하려면 SLIC의 주요 순위와 짝을 이루세요.",
        "ja": "観光局、文化外交省、MICEプランナー、駐在員生活の出版物、ソフトパワーの学者。住みやすさの指標ではありません — 住民の視点についてはSLICのメインランキングと組み合わせてください。"
      }
    },
    "critique": {
      "headline": {
        "en": "Bangkok #1 isn't an opinion — it's the data when Eurocentric weighting is removed",
        "th": "กรุงเทพฯ อันดับ 1 ไม่ใช่ความคิดเห็น — มันคือข้อมูลเมื่อตัดอคติแบบยุโรปเป็นศูนย์กลางออกไป",
        "zh": "曼谷排名第一并不是什么观点，而是剔除欧洲中心论权重后得出的数据",
        "ko": "방콕 1위는 의견이 아닙니다 — 유럽 중심적 가중치를 제거했을 때의 데이터일 뿐입니다.",
        "ja": "バンコクの1位は意見ではありません — ヨーロッパ中心主義の重み付けを取り除いた場合のデータです"
      },
      "body": {
        "en": "Brand Finance ranks France, UK, Germany, Japan in their soft power top 5. Monocle's annual list reads identically. The reason is methodology: those indices weight institutional reputation (universities, embassies, multilateral organisations) and English/French language ubiquity, both of which structurally favour Western capitals. SLIC Soft Power inverts this by weighting *who actually shows up* — visitor count, cuisine diversity, religious pluralism, visa openness in both directions. On those measures Bangkok leads, Tokyo and Istanbul follow, and global-south cultural capitals (Mexico City, Marrakesh, Mumbai, Lima) clear top 10 ahead of Paris and London. The most-visited city on Earth being recognised as the world's #1 soft-power city isn't controversial — it's what the data has been saying all along, ignored only because it reaches conclusions Western indices were not built to surface.",
        "th": "Brand Finance จัดให้ฝรั่งเศส, สหราชอาณาจักร, เยอรมนี, ญี่ปุ่น อยู่ในท็อป 5 ของซอฟต์พาวเวอร์ รายชื่อประจำปีของ Monocle ก็ออกมาหน้าตาแบบเดียวกัน เหตุผลคือระเบียบวิธี: ดัชนีเหล่านั้นให้น้ำหนักกับชื่อเสียงของสถาบัน (มหาวิทยาลัย, สถานทูต, องค์กรพหุภาคี) และความแพร่หลายของภาษาอังกฤษ/ฝรั่งเศส ซึ่งทั้งสองอย่างเอื้อประโยชน์ให้กับเมืองหลวงของชาติตะวันตกในเชิงโครงสร้าง SLIC Soft Power พลิกกลับสิ่งนี้ด้วยการให้น้ำหนักว่า *ใครปรากฏตัวจริงๆ* — จำนวนผู้มาเยือน, ความหลากหลายของอาหาร, ความเป็นพหุนิยมทางศาสนา, การเปิดรับวีซ่าทั้งสองทาง ในมาตรวัดเหล่านั้น กรุงเทพฯ นำมา โตเกียวและอิสตันบูลตามมา และเมืองหลวงทางวัฒนธรรมของซีกโลกใต้ (เม็กซิโกซิตี้, มาร์ราเกช, มุมไบ, ลิมา) กวาดอันดับท็อป 10 นำหน้าปารีสและลอนดอน การที่เมืองที่มีคนไปเยือนมากที่สุดในโลกได้รับการยอมรับว่าเป็นเมืองซอฟต์พาวเวอร์อันดับ 1 ของโลกไม่ใช่เรื่องน่าถกเถียง — มันคือสิ่งที่ข้อมูลบอกมาตลอด เพียงแต่ถูกละเลยเพราะมันได้ข้อสรุปที่ดัชนีของตะวันตกไม่ได้ถูกสร้างมาเพื่อนำเสนอ",
        "zh": "Brand Finance 将法国、英国、德国和日本列入其软实力的前 5 名。Monocle 的年度榜单也完全一样。原因在于方法论：这些指数看重机构声誉（大学、大使馆、多边组织）以及英语/法语的普及程度，这两者在结构上都偏向于西方国家的首都。SLIC 软实力指数颠覆了这一点，它看重的是*实际到来的人*——游客数量、美食多样性、宗教多元化、双向的签证开放度。在这些衡量标准上，曼谷领跑，东京和伊斯坦布尔紧随其后，全球南方文化之都（墨西哥城、马拉喀什、孟买、利马）则超越了巴黎和伦敦，跻身前 10 名。世界上最受游客欢迎的城市被公认为世界第一的软实力城市，这一点也无可厚非——这正是数据一直以来的呈现，被忽视只是因为它得出的结论是那些西方指数不打算去揭示的。",
        "ko": "Brand Finance는 소프트 파워 상위 5개국에 프랑스, 영국, 독일, 일본을 랭크합니다. Monocle의 연례 목록도 똑같이 읽힙니다. 이유는 방법론 때문입니다. 이러한 지수는 기관의 평판(대학, 대사관, 다자간 조직)과 영어/불어의 보편성에 가중치를 부여하며, 이 두 가지 모두 서구 수도를 구조적으로 선호합니다. SLIC 소프트 파워는 *누가 실제로 나타나는지*(방문자 수, 요리의 다양성, 종교적 다원성, 양방향의 비자 개방성)에 가중치를 부여함으로써 이를 뒤집습니다. 이러한 척도에서 방콕이 앞장서고, 도쿄와 이스탄불이 그 뒤를 이으며, 파리와 런던을 제치고 글로벌 남부 문화 수도(멕시코 시티, 마라케시, 뭄바이, 리마)가 상위 10위를 휩쓸고 있습니다. 지구상에서 가장 많이 방문하는 도시가 세계 1위 소프트 파워 도시로 인정받는 것은 논란의 여지가 없습니다 — 데이터가 계속해서 말해왔던 것이며, 서구 지수들이 표면화하도록 구축되지 않은 결론에 도달했다는 이유만으로 무시되었을 뿐입니다.",
        "ja": "ブランドファイナンスは、フランス、イギリス、ドイツ、日本をソフトパワーのトップ5にランク付けしています。モノクルの年次リストも全く同じです。その理由は方法論にあります。これらの指標は、制度的評判（大学、大使館、多国間組織）と英語/フランス語の偏在性に重きを置いており、そのどちらも構造的に西側の首都を優遇しています。SLICソフトパワーは、*実際に誰が現れるか* — 訪問者数、料理の多様性、宗教の多元性、双方向のビザの開放性 — に重きを置くことでこれを逆転させます。これらの指標ではバンコクがリードし、東京とイスタンブールが続き、グローバルサウスの文化首都（メキシコシティ、マラケシュ、ムンバイ、リマ）がパリとロンドンを抑えてトップ10に食い込んでいます。地球上で最も訪問者が多い都市が世界ナンバー1のソフトパワー都市として認識されることは議論を呼ぶものではありません — それはデータがずっと語ってきたことであり、西側の指標が表面化するように作られていなかった結論に達しているからこそ無視されてきたのです。"
      }
    }
  },
  "happy-city": {
    "focus": {
      "en": "Urban happiness across six categories: Citizens, Health, Environment, Governance, Mobility, Economy. 64 indicators. Max 10,000 points.",
      "th": "ความสุขในเขตเมือง ครอบคลุม 6 หมวดหมู่ ได้แก่ พลเมือง, สุขภาพ, สิ่งแวดล้อม, ธรรมาภิบาล, การเคลื่อนย้าย (Mobility) และเศรษฐกิจ ตัวชี้วัด 64 รายการ คะแนนเต็ม 10,000 คะแนน",
      "zh": "涵盖六大类别的城市幸福感：市民、健康、环境、治理、流动性、经济。64个指标。最高10,000分。",
      "ko": "시민, 건강, 환경, 거버넌스, 모빌리티, 경제 등 6개 범주에 걸친 도시 행복도. 64개 지표. 최대 10,000점.",
      "ja": "市民、健康、環境、ガバナンス、モビリティ、経済の6つのカテゴリーにおける都市の幸福度。64の指標。最大10,000ポイント。"
    },
    "methodology": {
      "claimedPurpose": {
        "en": "Measure holistic urban happiness from the citizen's perspective across governance, health, mobility, environment, and economy.",
        "th": "วัดความสุขในเมืองแบบองค์รวมจากมุมมองของประชาชน โดยครอบคลุมด้านธรรมาภิบาล, สุขภาพ, การเดินทาง, สิ่งแวดล้อม, และเศรษฐกิจ",
        "zh": "从市民的视角，衡量涵盖治理、健康、交通、环境和经济等方面的整体城市幸福感。",
        "ko": "거버넌스, 건강, 모빌리티, 환경, 경제 전반에 걸쳐 시민의 관점에서 종합적인 도시 행복도를 측정합니다.",
        "ja": "ガバナンス、健康、モビリティ、環境、経済全体にわたって、市民の視点から総合的な都市の幸福度を測定する。"
      },
      "actualMeasure": {
        "en": "Governance capacity and institutional delivery quality in well-funded northern European cities. Six of the top 10 cities are Nordic. The 'happiness' framing is aspirational — what the index operationalizes is the infrastructure, transit, and public-health delivery capacity of developed-world local governments. Categories like Governance and Mobility inherently reward cities with large public budgets and long civic-planning traditions.",
        "th": "ขีดความสามารถในการบริหารจัดการและคุณภาพการให้บริการของสถาบันในเมืองแถบยุโรปเหนือที่มีเงินทุนหนา 6 ใน 10 เมืองที่ติดอันดับท็อปคือประเทศกลุ่มนอร์ดิก การวางกรอบเรื่อง 'ความสุข' เป็นความปรารถนาที่ตั้งไว้สูง — สิ่งที่ดัชนีนี้ใช้วัดคือโครงสร้างพื้นฐาน การขนส่งสาธารณะ และความสามารถในการส่งมอบบริการด้านสาธารณสุขของรัฐบาลท้องถิ่นในประเทศพัฒนาแล้ว หมวดหมู่อย่างธรรมาภิบาลและการเดินทาง ย่อมให้ประโยชน์กับเมืองที่มีงบประมาณสาธารณะจำนวนมากและมีประเพณีการวางผังเมืองมายาวนานโดยเนื้อแท้",
        "zh": "资金充裕的北欧城市在治理能力和机构执行力方面的质量。排名前10的城市中有6个是北欧城市。“幸福”的设定是一种抱负——该指数实际衡量的是发达国家地方政府在基础设施、公共交通和公共卫生方面的交付能力。像“治理”和“出行”这样的类别，本质上是在奖励那些拥有庞大公共预算和悠久公民规划传统的城市。",
        "ko": "자금 지원이 잘 되는 북유럽 도시의 거버넌스 역량 및 제도적 서비스 제공 품질. 상위 10개 도시 전반적인 6개가 북유럽입니다. '행복'이라는 프레임은 열망적입니다 — 지수가 구체화하는 것은 선진국 지방 정부의 인프라, 대중교통 및 공중 보건 서비스 제공 역량입니다. 거버넌스 및 모빌리티와 같은 범주는 막대한 공공 예산과 오랜 시민 계획 전통을 가진 도시에 본질적으로 보상을 제공합니다.",
        "ja": "資金豊富な北欧の都市におけるガバナンス能力と制度的サービス提供の質。トップ10のうち6都市は北欧です。「幸福」という枠組みは熱望的なものであり、指標が運用しているのは、先進国の地方政府のインフラ、交通機関、および公衆衛生の提供能力です。ガバナンスやモビリティのようなカテゴリーは、本質的に大規模な公的予算と長い市民計画の伝統を持つ都市に報酬を与えます。"
      },
      "categories": {
        "en": ["Citizens: social cohesion, inclusion, quality of life perception", "Health: healthcare quality, access, public health outcomes", "Environment: green space, air quality, sustainability", "Governance: institutional quality, transparency, public services", "Mobility: transit, cycling infrastructure, commute quality", "Economy: employment, income, economic opportunity"],
        "th": ["พลเมือง: ความกลมเกลียวในสังคม, การไม่แบ่งแยก, การรับรู้ถึงคุณภาพชีวิต", "สุขภาพ: คุณภาพการรักษาพยาบาล, การเข้าถึง, ผลลัพธ์ทางสาธารณสุข", "สิ่งแวดล้อม: พื้นที่สีเขียว, คุณภาพอากาศ, ความยั่งยืน", "ธรรมาภิบาล: คุณภาพของสถาบัน, ความโปร่งใส, บริการสาธารณะ", "การเดินทาง (Mobility): ขนส่งสาธารณะ, โครงสร้างพื้นฐานสำหรับจักรยาน, คุณภาพการเดินทางไปทำงาน", "เศรษฐกิจ: การจ้างงาน, รายได้, โอกาสทางเศรษฐกิจ"],
        "zh": ["市民：社会凝聚力、包容性、生活质量感知", "健康：医疗质量、医疗可及性、公共卫生结果", "环境：绿地、空气质量、可持续性", "治理：制度质量、透明度、公共服务", "出行：公共交通、自行车基础设施、通勤质量", "经济：就业、收入、经济机会"],
        "ko": ["시민: 사회적 유대감, 포용성, 삶의 질 인식", "건강: 의료 품질, 접근성, 공중 보건 결과", "환경: 녹지 공간, 공기 질, 지속 가능성", "거버넌스: 제도적 품질, 투명성, 공공 서비스", "이동성: 대중교통, 자전거 인프라, 통근 질", "경제: 고용, 소득, 경제적 기회"],
        "ja": ["市民：社会的結束、包摂、生活の質の認識", "健康：医療の質、アクセス、公衆衛生の結果", "環境：緑地、空気の質、持続可能性", "ガバナンス：制度の質、透明性、公共サービス", "モビリティ：公共交通機関、自転車インフラ、通勤の質", "経済：雇用、収入、経済的機会"]
      },
      "dataInputs": {
        "en": ["64 indicators from international databases", "Uses 2025 data where available; otherwise 2024", "Minimum 100,000 residents to qualify"],
        "th": ["ตัวชี้วัด 64 ตัวจากฐานข้อมูลนานาชาติ", "ใช้ข้อมูลปี 2025 หากมี มิฉะนั้นจะใช้ข้อมูลปี 2024", "ต้องมีประชากรขั้นต่ำ 100,000 คนจึงจะมีสิทธิ์"],
        "zh": ["来自国际数据库的64项指标", "如果有可用的2025年数据则使用该数据；否则使用2024年数据", "居民人数至少达到10万方可符合条件"],
        "ko": ["국제 데이터베이스에서 가져온 64개 지표", "가능한 경우 2025년 데이터 사용, 그렇지 않으면 2024년 데이터 사용", "최소 100,000명의 거주자 필요"],
        "ja": ["国際データベースからの64の指標", "利用可能な場合は2025年のデータを使用。それ以外は2024年のデータ", "資格を得るには最低10万人の住民が必要"]
      },
      "blindSpots": {
        "en": ["Affordability — no disposable income or cost-of-living metric", "Cultural vibrancy — no food scene, nightlife, hospitality, or visitor magnetism signal", "LGBTQ+ legal environment and civic freedom", "Overwork and working-hour pressure", "Southeast Asian and African cities entirely absent from top 50", "Bangkok — world's most visited city — does not appear in top 50", "Informal economy and street-level urban vitality are invisible"],
        "th": ["ความสามารถในการจ่ายค่าครองชีพ — ไม่มีตัวชี้วัดเรื่องรายได้สุทธิ (disposable income) หรือค่าครองชีพ", "ความมีชีวิตชีวาทางวัฒนธรรม — ไม่มีข้อมูลเรื่องร้านอาหาร, ชีวิตกลางคืน, การต้อนรับ หรือสัญญาณดึงดูดนักท่องเที่ยว", "สภาพแวดล้อมทางกฎหมายสำหรับ LGBTQ+ และเสรีภาพของพลเมือง", "การทำงานล่วงเวลาและความกดดันเรื่องชั่วโมงการทำงาน", "เมืองในเอเชียตะวันออกเฉียงใต้และแอฟริกาไม่ติดอันดับท็อป 50 เลย", "กรุงเทพฯ — เมืองที่มีผู้มาเยือนมากที่สุดในโลก — ไม่ปรากฏในท็อป 50", "เศรษฐกิจนอกระบบและความมีชีวิตชีวาของเมืองระดับท้องถนนนั้นไม่สามารถมองเห็นได้"],
        "zh": ["可负担性——没有可支配收入或生活成本指标", "文化活力——缺乏美食、夜生活、热情好客程度或吸引游客的指标", "LGBTQ+的法律环境和公民自由", "过度劳累和工作时长压力", "东南亚和非洲城市完全缺席前50名", "曼谷——世界上游客最多的城市——并未出现在前50名中", "非正规经济和街道层面的城市活力被忽视"],
        "ko": ["감당 능력 — 가처분 소득이나 생활비 지표 없음", "문화적 활력 — 음식 문화, 밤문화, 환대, 또는 방문객 유인 요소 없음", "LGBTQ+ 법적 환경 및 시민의 자유", "과로 및 근무 시간 압박", "동남아시아 및 아프리카 도시들은 상위 50위권에 전혀 없음", "세계에서 가장 많이 방문하는 도시인 방콕이 상위 50위권에 없음", "비공식 경제 및 거리 수준의 도시 활력은 보이지 않음"],
        "ja": ["手頃さ — 可処分所得や生活費の指標がない", "文化的な活気 — 食のシーン、ナイトライフ、ホスピタリティ、または訪問者を惹きつける魅力のシグナルがない", "LGBTQ+の法的環境と市民の自由", "過労と労働時間の圧力", "東南アジアやアフリカの都市はトップ50に全く含まれていない", "世界で最も訪問者の多い都市であるバンコクはトップ50に登場しない", "インフォーマル経済とストリートレベルの都市の活力は見えない"]
      },
      "audienceNote": {
        "en": "Municipal governments and urban planners benchmarking city systems against northern European standards. Useful for infrastructure investment decisions; less useful for understanding where people actually want to live.",
        "th": "รัฐบาลระดับเทศบาลและนักวางผังเมืองที่ต้องการเปรียบเทียบระบบของเมืองกับมาตรฐานของยุโรปเหนือ มีประโยชน์สำหรับการตัดสินใจลงทุนด้านโครงสร้างพื้นฐาน แต่มีประโยชน์น้อยกว่าในการทำความเข้าใจว่าจริงๆ แล้วผู้คนอยากอาศัยอยู่ที่ไหน",
        "zh": "致力于将城市系统与北欧标准进行基准比较的市政府和城市规划者。对于基础设施投资决策很有用；但在了解人们真正想住在哪里的方面，用处不大。",
        "ko": "도시 시스템을 북유럽 표준과 벤치마킹하는 지방 자치 단체 및 도시 계획가. 인프라 투자 결정에 유용하지만 사람들이 실제로 살고 싶어하는 곳을 이해하는 데는 덜 유용합니다.",
        "ja": "北欧の基準に照らして都市システムをベンチマークする地方政府や都市計画家。インフラ投資の決定には役立ちますが、人々が実際にどこに住みたいかを理解するのにはあまり役立ちません。"
      }
    },
    "critique": {
      "headline": {
        "en": "Happiness or governance quality?",
        "th": "ความสุข หรือ คุณภาพธรรมาภิบาล?",
        "zh": "是幸福感还是治理质量？",
        "ko": "행복인가, 아니면 거버넌스 품질인가?",
        "ja": "幸福か、それともガバナンスの質か？"
      },
      "body": {
        "en": "The Happy City Index places six Nordic cities in its top 10, with Singapore at #22 and Bangkok absent from the top 50. Bangkok is the world's most visited city — Euromonitor, Mastercard arrivals data, and SLIC's own Hospitality score all confirm it — and yet it does not register as 'happy' here. This reveals the index's structural assumption: happiness is what well-funded northern European governments deliver (transit, green space, public health). It is not what Bangkok's food culture, hospitality, LGBTQ+ acceptance, nightlife, and affordable daily life deliver for the people living and visiting there. SLIC's Community pillar scores Bangkok Hospitality at 100.0 — the highest in the dataset. The Happy City Index has no equivalent dimension. Copenhagen at #1 is a reasonable governance benchmark; it is an incomplete happiness benchmark.",
        "th": "Happy City Index จัดให้ 6 เมืองในกลุ่มนอร์ดิกติด 10 อันดับแรก โดยสิงคโปร์อยู่ในอันดับที่ 22 และกรุงเทพฯ หลุดโผจาก 50 อันดับแรก กรุงเทพฯ เป็นเมืองที่มีคนมาเยือนมากที่สุดในโลก — ข้อมูลของ Euromonitor, ตัวเลขการเดินทางมาถึงของ Mastercard, และคะแนน Hospitality ของ SLIC เอง ก็ล้วนยืนยันเรื่องนี้ — แต่ทว่าที่นี่ กรุงเทพฯ กลับไม่ได้ถูกจัดว่าเป็นเมืองที่ 'มีความสุข' สิ่งนี้สะท้อนให้เห็นถึงข้อสันนิษฐานเชิงโครงสร้างของดัชนีนี้: ความสุขคือสิ่งที่รัฐบาลยุโรปเหนือที่มีเงินทุนหนาส่งมอบให้ (ระบบขนส่งมวลชน, พื้นที่สีเขียว, สาธารณสุข) มันไม่ใช่สิ่งที่วัฒนธรรมอาหารของกรุงเทพฯ, การให้การต้อนรับ, การยอมรับ LGBTQ+, ชีวิตกลางคืน, และชีวิตประจำวันที่เข้าถึงได้ มอบให้กับผู้คนที่อาศัยและมาเยือนที่นั่น เสาหลักเรื่อง Community ของ SLIC ให้คะแนน Bangkok Hospitality ที่ 100.0 — ซึ่งสูงที่สุดในชุดข้อมูล ทว่า Happy City Index ไม่มีมิติใดๆ ที่เทียบเคียงกับเรื่องนี้ได้ การที่โคเปนเฮเกนอยู่อันดับ 1 ถือเป็นเกณฑ์มาตรฐานด้านธรรมาภิบาลที่สมเหตุสมผล แต่ถือเป็นเกณฑ์มาตรฐานด้านความสุขที่ไม่สมบูรณ์",
        "zh": "《快乐城市指数》(Happy City Index) 将6座北欧城市列入前十，新加坡位列第22，而曼谷未进前50。曼谷是全球游客最多的城市——无论是 Euromonitor 还是万事达卡的入境数据，以及 SLIC 自身的“热情好客”(Hospitality) 评分都证实了这一点——然而在这里，它却没有被认为是“快乐”的。这暴露了该指数在结构上的假设：快乐是由资金充足的北欧政府提供的（如公共交通、绿地、公共卫生）。它并不认为曼谷的美食文化、热情好客、对LGBTQ+的包容度、夜生活以及负担得起的日常生活，能为生活和在那里游玩的人带来快乐。在 SLIC 的“社区”指标中，曼谷的“热情好客”得分为100.0，是整个数据集中最高的。而《快乐城市指数》却没有与之对应的衡量维度。哥本哈根排名第一，作为治理基准是合理的；但作为衡量快乐的基准，它是不完整的。",
        "ko": "Happy City Index는 상위 10위 안에 6개의 북유럽 도시를 올렸고, 싱가포르는 22위, 방콕은 상위 50위에서 제외했습니다. 방콕은 세계에서 가장 방문객이 많은 도시입니다. Euromonitor, Mastercard 입국 데이터, SLIC 자체의 환대 점수 모두 이를 확인해 주지만, 이 지수에서는 '행복'으로 등록되지 않습니다. 이것은 이 지수의 구조적 가정을 드러냅니다: 행복이란 자금 지원이 충분한 북유럽 정부가 제공하는 것(대중교통, 녹지, 공중보건)이라는 점입니다. 이것은 방콕의 음식 문화, 환대, LGBTQ+ 수용, 나이트라이프, 합리적인 비용의 일상 생활이 거주민과 방문객에게 제공하는 것이 아닙니다. SLIC의 커뮤니티 지표에서 방콕의 환대 점수는 100.0으로 전체 데이터세트에서 가장 높습니다. Happy City Index에는 이와 동등한 척도가 없습니다. 1위인 코펜하겐은 타당한 거버넌스 벤치마크이긴 하지만, 불완전한 행복 벤치마크입니다.",
        "ja": "ハッピー・シティ・インデックスでは、トップ10に北欧の6都市がランクインしており、シンガポールは22位、バンコクはトップ50から外れています。バンコクは世界で最も訪問者の多い都市であり、ユーロモニター、マスターカードの到着データ、そしてSLIC独自のホスピタリティスコアがそれを裏付けていますが、ここでは「ハッピー」として認識されていません。これは、この指標の構造的な前提を明らかにしています。幸福とは、資金豊富な北欧の政府が提供するもの（交通機関、緑地、公衆衛生）であるということです。バンコクの食文化、ホスピタリティ、LGBTQ+の受容、ナイトライフ、手頃な価格の日常生活が、そこに住み、訪れる人々にもたらすものではありません。SLICのコミュニティの柱は、バンコクのホスピタリティを100.0と評価しており、これはデータセットで最高です。ハッピー・シティ・インデックスにはそれに相当する次元がありません。1位のコペンハーゲンは妥当なガバナンスのベンチマークですが、不完全な幸福のベンチマークです。"
      }
    }
  }
}

with open('src/compareRankingsTranslations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

json_str = json.dumps(more_translations, indent=2, ensure_ascii=False)
json_str = json_str.strip()[1:-1]

last_brace_idx = content.rfind('};')

if last_brace_idx != -1:
    new_content = content[:last_brace_idx] + ",\n" + json_str + content[last_brace_idx:]
    with open('src/compareRankingsTranslations.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully appended translations")
else:
    print("Could not find closing brace")
