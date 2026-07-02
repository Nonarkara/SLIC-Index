#!/usr/bin/env node
import fs from "fs";
const FILE = "src/cityEditorialTranslations.ts";
const src = fs.readFileSync(FILE, "utf8");

const newEntries = `
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
  }`;

// Insert before the closing };  (file ends with \n};\n)
const patched = src.replace(/\n\};\n$/, `,\n${newEntries}\n};\n`);

if (patched === src) {
  console.error("Pattern not found — file unchanged");
  process.exit(1);
}

fs.writeFileSync(FILE, patched, "utf8");
console.log("Patched: 16 cities added to cityEditorialTranslations.ts");
