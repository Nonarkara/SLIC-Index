import type { Locale } from "./types";

export interface IdeaTranslation {
  title: Record<Locale, string>;
  problem: Record<Locale, string>;
  solution: Record<Locale, string>;
  impact: Record<Locale, string>;
}

export const ideasTranslations: Record<string, IdeaTranslation> = {
  "fixmystreet": {
    title: {
      en: "FixMyStreet",
      th: "FixMyStreet (แจ้งซ่อมเมือง)",
      zh: "FixMyStreet (城市保修)",
      ko: "FixMyStreet (도시 수리 요청)",
      ja: "FixMyStreet (街の修繕リクエスト)"
    },
    problem: {
      en: "Potholes, broken lights, and fly-tipping went unreported for weeks because there was no easy way for citizens to reach the right council department. Phone lines closed at 5pm. Emails vanished.",
      th: "หลุมบ่อ ไฟเสีย และการทิ้งขยะผิดกฎหมายถูกเพิกเฉยเป็นสัปดาห์เพราะไม่มีวิธีง่ายๆ ให้ประชาชนติดต่อหน่วยงานที่รับผิดชอบได้ สายโทรศัพท์ปิด 17.00 น. อีเมลก็หายเงียบ",
      zh: "路面坑洼、路灯损坏和非法倾倒垃圾几周无人上报，因为市民没有便捷渠道联系负责的市政部门。热线电话下午5点就下班，电子邮件也石沉大海。",
      ko: "시민들이 담당 구청 부서에 쉽게 연락할 방법이 없어 포트홀, 가로등 고장, 무단 투기가 몇 주 동안 방치되었습니다. 전화는 오후 5시면 끊기고 이메일은 사라졌습니다.",
      ja: "市民が適切な市役所部門に連絡する簡単な方法がなかったため、道路の陥没、街灯の故障、不法投棄が何週間も報告されませんでした。電話は午後5時に終了し、メールは無視されました。"
    },
    solution: {
      en: "FixMyStreet lets anyone drop a pin on a map, describe the issue, and attach a photo. The platform automatically routes the report to the correct local authority using boundary data. Councils receive structured tickets they can triage, assign, and resolve — with public status updates visible to the reporter.",
      th: "FixMyStreet ให้ใครก็ได้ปักหมุดบนแผนที่ อธิบายปัญหา และแนบรูปถ่าย ระบบจะส่งรายงานไปยังหน่วยงานท้องถิ่นที่ถูกต้องโดยอัตโนมัติ เทศบาลได้รับคำร้องที่เป็นระบบ สามารถคัดกรอง มอบหมาย และแก้ไข พร้อมอัปเดตสถานะให้ผู้แจ้งเห็นแบบสาธารณะ",
      zh: "FixMyStreet 让任何人都能在地图上标出位置、描述问题并附上照片。平台利用边界数据将报告自动路由给正确的当地政府。市政委员会收到结构化派单后进行分类、分配和解决——并且处理状态对举报人公开可见。",
      ko: "FixMyStreet를 통해 누구나 지도에 핀을 놓고, 문제를 설명하고, 사진을 첨부할 수 있습니다. 플랫폼은 경계 데이터를 사용하여 올바른 관할 구역으로 신고를 자동 전달합니다. 지자체는 분류 및 배정이 가능한 구조화된 티켓을 받고, 신고자에게 공개적으로 진행 상황을 업데이트합니다.",
      ja: "FixMyStreetでは、誰でも地図上にピンを落とし、問題を説明し、写真を添付できます。プラットフォームは境界データを使用して適切な地方自治体に報告を自動転送します。市役所は構造化されたチケットを受け取り、分類、割り当て、解決を行います。進行状況は報告者に公開されます。"
    },
    impact: {
      en: "Over 2 million reports filed across the UK. Average council response time dropped 30% in participating boroughs. Forked and deployed in Nigeria, Sweden, Norway, Australia, and 20+ other countries.",
      th: "มีการแจ้งปัญหากว่า 2 ล้านครั้งทั่วสหราชอาณาจักร เวลาตอบสนองเฉลี่ยของเทศบาลลดลง 30% ในเขตที่เข้าร่วม ถูกนำไปพัฒนาต่อและใช้ในไนจีเรีย สวีเดน นอร์เวย์ ออสเตรเลีย และอีกกว่า 20 ประเทศ",
      zh: "全英提交了超过 200 万份报告。参与行政区的平均响应时间缩短了 30%。代码被分叉并部署在尼日利亚、瑞典、挪威、澳大利亚等 20 多个国家。",
      ko: "영국 전역에서 200만 건 이상의 신고가 접수되었습니다. 참여 자치구의 평균 대응 시간이 30% 감소했습니다. 나이지리아, 스웨덴, 노르웨이, 호주 등 20개국 이상에서 포크되어 배포되었습니다.",
      ja: "英国全土で200万件以上の報告が提出されました。参加する自治区の平均対応時間は30%短縮されました。ナイジェリア、スウェーデン、ノルウェー、オーストラリアなど20カ国以上でフォークされ、導入されています。"
    }
  },
  "decidim": {
    title: {
      en: "Decidim",
      th: "Decidim (แพลตฟอร์มประชาธิปไตยแบบมีส่วนร่วม)",
      zh: "Decidim (参与式民主平台)",
      ko: "Decidim (참여 민주주의 플랫폼)",
      ja: "Decidim (参加型民主主義プラットフォーム)"
    },
    problem: {
      en: "Public consultations were broken. They consisted of PDF downloads and empty town halls at 2pm on a Tuesday. Citizens couldn't propose policy, track how budgets were spent, or deliberate transparently at scale.",
      th: "การรับฟังความคิดเห็นสาธารณะล้มเหลว มีแค่ให้ดาวน์โหลด PDF และการจัดประชุมที่ว่างเปล่าในวันอังคารบ่ายสอง ประชาชนไม่สามารถเสนอแนะนโยบาย ติดตามการใช้งบประมาณ หรือมีส่วนร่วมอย่างโปร่งใสในสเกลใหญ่ได้",
      zh: "公众咨询名存实亡。通常只是些供下载的 PDF，以及定在周二下午两点、根本没几个人参加的市政厅会议。市民无法提出政策建议、追踪预算去向，也无法大规模地进行透明审议。",
      ko: "공공 협의는 망가졌습니다. 화요일 오후 2시에 열리는 텅 빈 타운홀과 PDF 다운로드가 전부였습니다. 시민들은 정책을 제안하거나 예산 집행을 추적하거나 대규모로 투명하게 논의할 수 없었습니다.",
      ja: "公開協議は機能していませんでした。PDFのダウンロードと、火曜の午後2時に開かれる誰もいないタウンホールミーティングだけでした。市民は政策を提案したり、予算の使途を追跡したり、大規模かつ透明に審議することができませんでした。"
    },
    solution: {
      en: "A comprehensive digital democracy framework. Decidim provides spaces for strategic planning, participatory budgeting, citizen assemblies, and policy drafting. It forces governments to tie proposals to actual implementation tracking.",
      th: "โครงสร้างพื้นฐานสำหรับประชาธิปไตยดิจิทัลที่ครบถ้วน Decidim ให้พื้นที่สำหรับการวางแผนเชิงกลยุทธ์ งบประมาณแบบมีส่วนร่วม สมัชชาประชาชน และการร่างนโยบาย บังคับให้รัฐบาลเชื่อมโยงข้อเสนอกับการติดตามผลการปฏิบัติจริง",
      zh: "一个全面的数字民主框架。Decidim 为战略规划、参与式预算、公民大会和政策起草提供了空间。它迫使政府将提案与实际的执行跟踪挂钩。",
      ko: "종합적인 디지털 민주주의 프레임워크. Decidim은 전략적 계획, 참여 예산제, 시민 의회, 정책 초안 작성을 위한 공간을 제공합니다. 정부가 제안을 실제 실행 추적과 연결하도록 강제합니다.",
      ja: "包括的なデジタル民主主義フレームワーク。Decidimは、戦略計画、参加型予算、市民会議、政策起草のためのスペースを提供します。政府に対し、提案を実際の実行追跡と結びつけるよう義務付けます。"
    },
    impact: {
      en: "Powers Barcelona's participatory budget. Adopted by over 450 institutions including the cities of Helsinki, Milan, and New York, scaling from 5,000-person neighborhoods to the 440-million-citizen Conference on the Future of Europe.",
      th: "ขับเคลื่อนงบประมาณแบบมีส่วนร่วมของบาร์เซโลนา ถูกนำไปใช้โดยองค์กรกว่า 450 แห่งรวมถึงเฮลซิงกิ มิลาน และนิวยอร์ก ขยายสเกลตั้งแต่ชุมชน 5,000 คน ไปจนถึงสภาร่วมอนาคตยุโรปที่มีประชากร 440 ล้านคน",
      zh: "驱动巴塞罗那的参与式预算。被赫尔辛基、米兰和纽约等超过 450 家机构采用，规模可从 5000 人的社区扩展到覆盖 4.4 亿公民的欧洲未来会议。",
      ko: "바르셀로나의 참여 예산제를 구동합니다. 헬싱키, 밀라노, 뉴욕을 포함한 450개 이상의 기관에서 도입했으며, 5천 명 규모의 동네에서부터 4억 4천만 명의 시민이 참여하는 유럽의 미래 회의에 이르기까지 확장되었습니다.",
      ja: "バルセロナの参加型予算を支えています。ヘルシンキ、ミラノ、ニューヨークなど450以上の機関で採用され、5,000人規模の地区から4億4,000万人の市民が参加する「欧州の未来に関する会議」までスケーリングしています。"
    }
  },
  "consul": {
    title: {
      en: "Consul Democracy",
      th: "Consul Democracy",
      zh: "Consul Democracy",
      ko: "Consul Democracy",
      ja: "Consul Democracy"
    },
    problem: {
      en: "Madrid needed a way to let citizens directly propose and vote on municipal legislation, but commercial voting platforms were proprietary, expensive, and lacked the auditable trust required for binding city referendums.",
      th: "มาดริดต้องการวิธีให้ประชาชนเสนอและลงมติในข้อบัญญัติท้องถิ่นได้โดยตรง แต่แพลตฟอร์มโหวตเชิงพาณิชย์เป็นระบบปิด ราคาแพง และขาดความน่าเชื่อถือที่ตรวจสอบได้สำหรับการทำประชามติของเมืองที่มีผลผูกพัน",
      zh: "马德里需要一种方式让市民直接提出和投票表决市政立法，但商业投票平台闭源且昂贵，缺乏具有约束力的城市公投所需的可审计信任。",
      ko: "마드리드는 시민들이 지자체 법안을 직접 제안하고 투표할 수 있는 방법이 필요했지만, 상업용 투표 플랫폼은 비공개 시스템이고 비쌌으며, 구속력 있는 도시 국민투표에 필요한 감사 가능한 신뢰가 부족했습니다.",
      ja: "マドリードは市民が直接市条例を提案・投票できる仕組みを必要としていましたが、商用の投票プラットフォームは独占的で高価であり、法的拘束力のある住民投票に必要な監査可能な信頼性を欠いていました。"
    },
    solution: {
      en: "A robust citizen-participation platform built entirely in Ruby on Rails. It features verified user registration, secure voting, participatory budgeting, collaborative legislation, and citizen-initiated debates.",
      th: "แพลตฟอร์มการมีส่วนร่วมของพลเมืองที่แข็งแกร่ง สร้างด้วย Ruby on Rails ทั้งหมด มีระบบลงทะเบียนยืนยันตัวตน โหวตที่ปลอดภัย งบประมาณแบบมีส่วนร่วม การร่างกฎหมายร่วมกัน และการถกเถียงที่เริ่มโดยประชาชน",
      zh: "一个完全用 Ruby on Rails 构建的强大公民参与平台。它具有经过验证的用户注册、安全投票、参与式预算、协同立法和公民发起的辩论功能。",
      ko: "완전히 Ruby on Rails로 구축된 강력한 시민 참여 플랫폼입니다. 검증된 사용자 등록, 안전한 투표, 참여 예산제, 협력적 입법 및 시민 주도 토론 기능을 갖추고 있습니다.",
      ja: "完全にRuby on Railsで構築された堅牢な市民参加プラットフォーム。本人確認済みのユーザー登録、安全な投票、参加型予算、協働的な立法、市民発議の討論機能を備えています。"
    },
    impact: {
      en: "The most widely used digital democracy platform globally. Deployed in 35 countries by 135 institutions, serving 90 million citizens. Enabled the largest participatory budget in Europe (Madrid, €100M).",
      th: "แพลตฟอร์มประชาธิปไตยดิจิทัลที่ถูกใช้มากที่สุดในโลก นำไปใช้ใน 35 ประเทศโดยองค์กร 135 แห่ง ให้บริการประชาชน 90 ล้านคน ทำให้เกิดงบประมาณแบบมีส่วนร่วมที่ใหญ่ที่สุดในยุโรป (มาดริด, 100 ล้านยูโร)",
      zh: "全球使用最广泛的数字民主平台。在 35 个国家的 135 个机构中部署，服务 9000 万公民。促成了欧洲最大规模的参与式预算（马德里，1亿欧元）。",
      ko: "세계에서 가장 널리 사용되는 디지털 민주주의 플랫폼입니다. 35개국 135개 기관에 배포되어 9,000만 명의 시민에게 서비스를 제공합니다. 유럽 최대 규모의 참여 예산제(마드리드, 1억 유로)를 실현했습니다.",
      ja: "世界で最も広く使用されているデジタル民主主義プラットフォーム。35カ国、135の機関で導入され、9,000万人の市民にサービスを提供しています。欧州最大の参加型予算（マドリード、1億ユーロ）を実現しました。"
    }
  },
  "uswds": {
    title: {
      en: "USWDS",
      th: "USWDS (ระบบออกแบบเว็บของรัฐบาลสหรัฐฯ)",
      zh: "USWDS (美国联邦网页设计系统)",
      ko: "USWDS (미국 웹 디자인 시스템)",
      ja: "USWDS (米国ウェブデザインシステム)"
    },
    problem: {
      en: "Government websites were a usability nightmare. Every department built distinct, inaccessible interfaces from scratch. Citizens trying to claim benefits, pay taxes, or access records faced a fragmented, confusing digital bureaucracy.",
      th: "เว็บไซต์รัฐบาลเคยเป็นฝันร้ายของการใช้งาน ทุกกรมสร้างอินเทอร์เฟซแยกกันเองจากศูนย์และเข้าถึงยาก ประชาชนที่พยายามขอรับสวัสดิการ จ่ายภาษี หรือเข้าถึงบันทึกต้องเผชิญกับระบบราชการดิจิทัลที่กระจัดกระจายและน่าสับสน",
      zh: "政府网站曾是可用性的噩梦。每个部门都从零开始构建各自独立的、缺乏无障碍设计的界面。试图申领福利、缴税或查询记录的公民，面临的是碎片化且令人困惑的数字官僚系统。",
      ko: "정부 웹사이트는 사용성의 악몽이었습니다. 모든 부처가 접근성 없는 각기 다른 인터페이스를 처음부터 만들었습니다. 혜택을 청구하거나 세금을 내거나 기록에 접근하려는 시민들은 파편화되고 혼란스러운 디지털 관료주의에 직면했습니다.",
      ja: "政府のウェブサイトは使い勝手の悪夢でした。すべての部門がゼロから独自の、アクセシビリティに欠けるインターフェースを構築していました。給付金の請求、納税、記録へのアクセスを試みる市民は、断片化された混乱を招くデジタル官僚主義に直面していました。"
    },
    solution: {
      en: "The U.S. Web Design System provides a library of accessible, mobile-friendly components and design tokens. It enforces Section 508 compliance (accessibility) out of the box and creates a unified visual language for government digital services.",
      th: "ระบบการออกแบบเว็บของสหรัฐฯ ให้คลังส่วนประกอบที่เข้าถึงง่ายและรองรับมือถือ มันบังคับให้ผ่านมาตรฐานการเข้าถึง (Section 508) ทันทีที่ใช้ และสร้างภาษาทางภาพที่เป็นหนึ่งเดียวสำหรับบริการดิจิทัลของรัฐ",
      zh: "美国网页设计系统提供了一个无障碍且适应移动端的组件与设计令牌库。它开箱即用地强制执行 508 条款（无障碍标准），并为政府数字服务创建了统一的视觉语言。",
      ko: "미국 웹 디자인 시스템은 접근성이 뛰어나고 모바일 친화적인 컴포넌트 및 디자인 토큰 라이브러리를 제공합니다. 기본적으로 508조 호환성(접근성)을 강제하며 정부 디지털 서비스를 위한 통합된 시각적 언어를 만듭니다.",
      ja: "米国ウェブデザインシステムは、アクセシビリティが高くモバイルフレンドリーなコンポーネントとデザイントークンのライブラリを提供します。デフォルトでセクション508（アクセシビリティ）への準拠を強制し、政府のデジタルサービスのための統一された視覚言語を作成します。"
    },
    impact: {
      en: "Adopted by nearly 200 federal agencies. Powers everything from tracking NASA missions to applying for FEMA disaster relief. Halved development times for new government portals while guaranteeing baseline accessibility.",
      th: "ถูกใช้โดยหน่วยงานรัฐบาลกลางเกือบ 200 แห่ง ขับเคลื่อนตั้งแต่การติดตามภารกิจของ NASA ไปจนถึงการขอรับเงินบรรเทาภัยพิบัติ FEMA ลดเวลาพัฒนาพอร์ทัลรัฐบาลใหม่ลงครึ่งหนึ่งพร้อมการันตีการเข้าถึงได้",
      zh: "被近 200 个联邦机构采用。驱动了从追踪 NASA 任务到申请 FEMA 救灾的方方面面。将新政府门户网站的开发时间缩短了一半，同时保证了基础无障碍体验。",
      ko: "거의 200개의 연방 기관에서 채택했습니다. NASA 임무 추적부터 FEMA 재난 구호 신청에 이르기까지 모든 것을 구동합니다. 새로운 정부 포털의 개발 시간을 절반으로 줄이면서도 기본 접근성을 보장합니다.",
      ja: "200近くの連邦機関で採用されています。NASAのミッション追跡からFEMAの災害救済申請まで、あらゆるものを支えています。ベースラインのアクセシビリティを保証しつつ、新しい政府ポータルの開発時間を半減させました。"
    }
  },
  "xroad": {
    title: {
      en: "X-Road",
      th: "X-Road (ถนนเชื่อมข้อมูลเอสโตเนีย)",
      zh: "X-Road (数据交换通道)",
      ko: "X-Road (데이터 교환 도로)",
      ja: "X-Road (データ交換基盤)"
    },
    problem: {
      en: "Estonia had no budget to build massive centralized government databases. Citizens had to carry paper documents between agencies because police, healthcare, and tax systems could not securely talk to each other.",
      th: "เอสโตเนียไม่มีงบสร้างฐานข้อมูลรวมศูนย์ขนาดใหญ่ ประชาชนต้องหอบเอกสารกระดาษระหว่างหน่วยงาน เพราะระบบตำรวจ สาธารณสุข และภาษีไม่สามารถสื่อสารกันได้อย่างปลอดภัย",
      zh: "爱沙尼亚没有预算建立庞大的集中式政府数据库。市民不得不拿着纸质文件在各机构间跑腿，因为警察、医疗和税务系统之间无法进行安全的通信。",
      ko: "에스토니아는 대규모 중앙 집중식 정부 데이터베이스를 구축할 예산이 없었습니다. 경찰, 의료, 세무 시스템이 서로 안전하게 통신할 수 없었기 때문에 시민들은 기관 사이에 종이 문서를 들고 다녀야 했습니다.",
      ja: "エストニアには、大規模な集中型政府データベースを構築する予算がありませんでした。警察、医療、税務システムが安全に通信できなかったため、市民は機関の間で紙の書類を持ち歩かなければなりませんでした。"
    },
    solution: {
      en: "A decentralized, distributed data exchange layer. X-Road connects disparate information systems securely over the public internet using end-to-end encryption and digital signatures. No data is centrally stored; it is queried on demand.",
      th: "ชั้นการแลกเปลี่ยนข้อมูลแบบกระจายศูนย์ X-Road เชื่อมต่อระบบข้อมูลที่ต่างกันอย่างปลอดภัยผ่านอินเทอร์เน็ตสาธารณะโดยใช้การเข้ารหัสแบบ End-to-End และลายเซ็นดิจิทัล ไม่มีข้อมูลถูกเก็บรวมศูนย์ แต่จะถูกสืบค้นเมื่อจำเป็น",
      zh: "一个去中心化的分布式数据交换层。X-Road 通过端到端加密和数字签名，在公共互联网上安全地连接了不同的信息系统。不集中存储任何数据；只有在需要时才进行按需查询。",
      ko: "탈중앙화된 분산형 데이터 교환 계층. X-Road는 종단 간 암호화 및 디지털 서명을 사용하여 공용 인터넷을 통해 서로 다른 정보 시스템을 안전하게 연결합니다. 데이터는 중앙에 저장되지 않으며 필요할 때만 쿼리됩니다.",
      ja: "分散型のデータ交換レイヤー。X-Roadは、エンドツーエンドの暗号化とデジタル署名を使用して、パブリックインターネット上で異なる情報システムを安全に接続します。データは中央に保存されず、オンデマンドで照会されます。"
    },
    impact: {
      en: "Saves Estonia 1,400 years of working time annually. Finland and Estonia connected their X-Roads, enabling frictionless cross-border prescriptions and tax data exchange. Now forms the backbone of Iceland and Faroe Islands' digital governments.",
      th: "ช่วยเอสโตเนียประหยัดเวลาทำงานได้ปีละ 1,400 ปี ฟินแลนด์และเอสโตเนียเชื่อม X-Road เข้าด้วยกัน ทำให้การสั่งจ่ายยาข้ามพรมแดนและแลกเปลี่ยนข้อมูลภาษีเป็นไปอย่างราบรื่น ปัจจุบันเป็นกระดูกสันหลังของรัฐบาลดิจิทัลในไอซ์แลนด์และหมู่เกาะแฟโร",
      zh: "每年为爱沙尼亚节省 1400 年的工作时间。芬兰和爱沙尼亚连接了他们的 X-Road，实现了无缝的跨境处方和税务数据交换。现在它成为了冰岛和法罗群岛数字政府的支柱。",
      ko: "에스토니아에서 매년 1,400년의 작업 시간을 절약합니다. 핀란드와 에스토니아는 양국의 X-Road를 연결하여 국경 없는 처방전 및 세무 데이터 교환을 실현했습니다. 이제 아이슬란드와 페로 제도의 디지털 정부의 중추 역할을 합니다.",
      ja: "エストニアで毎年1,400年分の労働時間を節約しています。フィンランドとエストニアは互いのX-Roadを接続し、国境を越えた処方箋や税務データの円滑な交換を可能にしました。現在ではアイスランドとフェロー諸島のデジタル政府のバックボーンとなっています。"
    }
  },
  "open311": {
    title: {
      en: "Open311",
      th: "Open311",
      zh: "Open311",
      ko: "Open311",
      ja: "Open311"
    },
    problem: {
      en: "Every city building a mobile app for non-emergency reporting (311) was writing custom API endpoints. If an independent developer wanted to build a civic reporting app, they had to write different code for Chicago, New York, and Boston.",
      th: "ทุกเมืองที่สร้างแอปมือถือสำหรับแจ้งเหตุไม่ฉุกเฉิน (311) ต้องเขียน API แยกกัน หากนักพัฒนาอิสระอยากสร้างแอปแจ้งปัญหาเมือง พวกเขาต้องเขียนโค้ดต่างกันสำหรับชิคาโก นิวยอร์ก และบอสตัน",
      zh: "每个为非紧急事件上报 (311) 构建移动应用的城市都在编写自定义 API 端点。如果独立开发者想要构建一个公民举报应用，他们必须为芝加哥、纽约和波士顿分别编写不同的代码。",
      ko: "비긴급 신고(311) 모바일 앱을 구축하는 모든 도시가 맞춤형 API 엔드포인트를 작성하고 있었습니다. 독립 개발자가 시민 신고 앱을 만들려면 시카고, 뉴욕, 보스턴에 각각 다른 코드를 작성해야 했습니다.",
      ja: "非緊急通報（311）用のモバイルアプリを構築するすべての都市が、独自のAPIエンドポイントを作成していました。独立系の開発者が市民通報アプリを作ろうとすると、シカゴ、ニューヨーク、ボストンでそれぞれ異なるコードを書く必要がありました。"
    },
    solution: {
      en: "A standardized, open API for tracking civic issues. Open311 provides a common schema for submitting service requests, attaching coordinates/photos, and querying status. It separates the backend CRM from the frontend apps.",
      th: "API แบบเปิดและเป็นมาตรฐานสำหรับการติดตามปัญหาเมือง Open311 ให้โครงสร้างกลางสำหรับส่งคำร้อง แนบพิกัด/รูปถ่าย และเช็คสถานะ มันแยก CRM หลังบ้านออกจากแอปหน้าบ้าน",
      zh: "一个标准化的开放 API，用于追踪城市问题。Open311 提供了一个通用模式，用于提交服务请求、附加坐标/照片以及查询状态。它将后端的 CRM 系统与前端的应用程序分离开来。",
      ko: "시민 문제 추적을 위한 표준화된 개방형 API. Open311은 서비스 요청 제출, 좌표/사진 첨부, 상태 쿼리를 위한 공통 스키마를 제공합니다. 백엔드 CRM과 프론트엔드 앱을 분리합니다.",
      ja: "市民の問題を追跡するための標準化されたオープンAPI。Open311は、サービスリクエストの提出、座標や写真の添付、ステータス照会のための共通スキーマを提供します。バックエンドのCRMとフロントエンドのアプリを分離します。"
    },
    impact: {
      en: "Adopted by San Francisco, Chicago, Toronto, and dozens of others. Spurred an ecosystem of third-party civic apps (like SeeClickFix) that can plug into any city using the standard, vastly reducing municipal software costs.",
      th: "ถูกนำไปใช้โดยซานฟรานซิสโก ชิคาโก โตรอนโต และเมืองอื่นๆ อีกนับสิบ ทำให้เกิดระบบนิเวศของแอปเมืองจากภายนอก (เช่น SeeClickFix) ที่เสียบใช้กับเมืองไหนก็ได้ที่ใช้มาตรฐานนี้ ลดต้นทุนซอฟต์แวร์เทศบาลไปมหาศาล",
      zh: "被旧金山、芝加哥、多伦多等数十个城市采用。催生了第三方公民应用（如 SeeClickFix）的生态系统，这些应用可以接入任何采用该标准的城市，极大地降低了市政软件成本。",
      ko: "샌프란시스코, 시카고, 토론토 등 수십 개 도시에서 채택. 표준을 사용하는 모든 도시에 연결할 수 있는 제3자 시민 앱(SeeClickFix 등) 생태계를 촉진하여 지자체 소프트웨어 비용을 크게 절감했습니다.",
      ja: "サンフランシスコ、シカゴ、トロントなど数十の都市で採用されています。この標準を使用するあらゆる都市に接続できるサードパーティの市民アプリ（SeeClickFixなど）のエコシステムを刺激し、自治体のソフトウェアコストを大幅に削減しました。"
    }
  },
  "opencity": {
    title: {
      en: "OpenTripPlanner",
      th: "OpenTripPlanner",
      zh: "OpenTripPlanner (开放行程规划器)",
      ko: "OpenTripPlanner",
      ja: "OpenTripPlanner"
    },
    problem: {
      en: "Transit agencies relied on expensive proprietary routing software, or surrendered completely to Google Maps. Neither option allowed cities to tweak routing algorithms to prioritize bike safety, lower emissions, or accommodate wheelchair accessibility seamlessly.",
      th: "หน่วยงานขนส่งต้องพึ่งพาซอฟต์แวร์จัดเส้นทางแบบปิดราคาแพง หรือยอมจำนนต่อ Google Maps ไปเลย ทั้งสองทางเลือกไม่ยอมให้เมืองปรับแต่งอัลกอริทึมให้ความสำคัญกับความปลอดภัยของจักรยาน ลดการปล่อยมลพิษ หรือรองรับวีลแชร์ได้อย่างไร้รอยต่อ",
      zh: "交通机构依赖昂贵的专有路线规划软件，或者完全向谷歌地图投降。这两种选择都不允许城市微调路线算法以优先考虑自行车安全、降低排放或无缝适配轮椅出行。",
      ko: "대중교통 기관은 비싼 상업용 라우팅 소프트웨어에 의존하거나 Google 지도에 완전히 굴복했습니다. 어떤 옵션도 자전거 안전, 탄소 배출 감소, 휠체어 접근성을 원활하게 우선시하도록 라우팅 알고리즘을 미세 조정할 수 없었습니다.",
      ja: "交通機関は高価な商用ルーティングソフトウェアに依存するか、Googleマップに完全に降伏していました。どちらの選択肢も、自転車の安全性を優先したり、排出量を削減したり、車椅子のアクセシビリティをシームレスに考慮するように都市がルーティングアルゴリズムを微調整することはできませんでした。"
    },
    solution: {
      en: "An open-source multi-modal trip planner matching GTFS (transit schedules) with OpenStreetMap. It calculates itineraries that combine walking, biking, transit, and micro-mobility, letting authorities configure exact routing preferences.",
      th: "ตัววางแผนการเดินทางหลายรูปแบบแบบโอเพนซอร์สที่จับคู่ GTFS (ตารางเดินรถ) กับ OpenStreetMap มันคำนวณเส้นทางที่รวมการเดิน ปั่นจักรยาน ขนส่งสาธารณะ และไมโครโมบิลิตี้เข้าด้วยกัน ให้หน่วยงานปรับตั้งค่าความต้องการเส้นทางได้อย่างแม่นยำ",
      zh: "一个开源的多模式行程规划器，将 GTFS（公交时刻表）与 OpenStreetMap 结合起来。它能计算出结合了步行、骑行、公交和微出行的行程，并允许管理部门配置确切的路线偏好。",
      ko: "GTFS(대중교통 시간표)와 OpenStreetMap을 일치시키는 오픈 소스 다중 모달 여행 플래너입니다. 걷기, 자전거 타기, 대중교통 및 마이크로 모빌리티를 결합한 여정을 계산하여 당국이 정확한 라우팅 기본 설정을 구성할 수 있도록 합니다.",
      ja: "GTFS（交通機関の時刻表）とOpenStreetMapを一致させるオープンソースのマルチモーダルな行程プランナー。徒歩、自転車、公共交通機関、マイクロモビリティを組み合わせた旅程を計算し、当局が正確なルーティングの好みを設定できるようにします。"
    },
    impact: {
      en: "Powers the official transit apps for New York State (MTA), Norway (Entur), Finland (Digitransit), and Portland (TriMet). Saved millions in software licensing while improving accessibility routing for disabled riders.",
      th: "ขับเคลื่อนแอปขนส่งมวลชนอย่างเป็นทางการของรัฐนิวยอร์ก (MTA), นอร์เวย์ (Entur), ฟินแลนด์ (Digitransit) และพอร์ตแลนด์ (TriMet) ประหยัดค่าลิขสิทธิ์ซอฟต์แวร์ได้หลายล้านพร้อมพัฒนาการนำทางสำหรับผู้พิการ",
      zh: "为纽约州 (MTA)、挪威 (Entur)、芬兰 (Digitransit) 和波特兰 (TriMet) 的官方公共交通应用提供支持。在改善残障乘客无障碍路线的同时，节省了数百万的软件许可费用。",
      ko: "뉴욕주(MTA), 노르웨이(Entur), 핀란드(Digitransit), 포틀랜드(TriMet)의 공식 대중교통 앱을 구동합니다. 장애인 승객을 위한 접근성 라우팅을 개선하는 동시에 소프트웨어 라이선스 비용을 수백만 달러 절감했습니다.",
      ja: "ニューヨーク州（MTA）、ノルウェー（Entur）、フィンランド（Digitransit）、ポートランド（TriMet）の公式交通アプリを支えています。障害を持つ乗客のためのアクセシビリティ・ルーティングを改善しつつ、数百万のソフトウェアライセンス費用を節約しました。"
    }
  },
  "consensys": {
    title: {
      en: "Pol.is",
      th: "Pol.is",
      zh: "Pol.is",
      ko: "Pol.is",
      ja: "Pol.is"
    },
    problem: {
      en: "Social media and standard forums highlight polarized extremes, making consensus invisible. When governments ask for online feedback, comment threads descend into toxic shouting matches where loud minorities dominate the discourse.",
      th: "โซเชียลมีเดียและเว็บบอร์ดทั่วไปมักขยายขั้วตรงข้าม ทำให้มองไม่เห็นฉันทามติ เมื่อรัฐบาลขอความคิดเห็นออนไลน์ ช่องคอมเมนต์มักกลายเป็นสมรภูมิสาดโคลนที่เสียงส่วนน้อยที่ตะโกนดังๆ เข้าครอบงำการพูดคุย",
      zh: "社交媒体和标准论坛放大了极化的极端言论，使得共识隐形。当政府在线征求反馈时，评论区就会沦为充斥着戾气的骂战，而声音大的少数派则主导了话语权。",
      ko: "소셜 미디어와 일반 포럼은 극단적인 의견을 부각시켜 합의점을 볼 수 없게 만듭니다. 정부가 온라인 피드백을 요청하면 댓글창은 소수 강경파가 담론을 지배하는 유해한 말싸움장으로 변질됩니다.",
      ja: "ソーシャルメディアや通常のフォーラムは両極端な意見を強調し、合意を不可視にします。政府がオンラインでフィードバックを求めると、コメント欄は声の大きな少数派が議論を支配する有害な怒鳴り合いの場に転落します。"
    },
    solution: {
      en: "An AI-powered consensus platform. Pol.is asks users to agree or disagree with statements without allowing direct replies. Machine learning clusters participants based on their voting patterns to find hidden statements that unite opposing groups.",
      th: "แพลตฟอร์มฉันทามติที่ขับเคลื่อนด้วย AI Pol.is ให้ผู้ใช้กดเห็นด้วยหรือไม่เห็นด้วยกับข้อความต่างๆ โดยไม่ให้ตอบกลับกันโดยตรง Machine learning จะจัดกลุ่มผู้เข้าร่วมตามรูปแบบการโหวต เพื่อหาข้อความที่เชื่อมโยงกลุ่มที่ขัดแย้งกันเข้าด้วยกัน",
      zh: "一个由 AI 驱动的共识平台。Pol.is 让用户对陈述表示同意或反对，但不允许直接回复。机器学习根据参与者的投票模式将他们聚类，从而找出能够团结对立群体的隐藏陈述。",
      ko: "AI 기반 합의 플랫폼입니다. Pol.is는 직접적인 답글을 허용하지 않고 사용자가 의견에 동의하거나 반대하도록만 합니다. 머신러닝은 투표 패턴을 기반으로 참여자를 클러스터링하여 대립하는 그룹을 하나로 묶는 숨겨진 합의점을 찾습니다.",
      ja: "AIを活用した合意形成プラットフォーム。Pol.isは、直接の返信を許可せず、ユーザーに意見への賛否を求めます。機械学習は投票パターンに基づいて参加者をクラスタリングし、対立するグループを結びつける隠れた合意事項を見つけ出します。"
    },
    impact: {
      en: "Used by vTaiwan to crowdsource national legislation on Uber and liquor sales. Deployed by the UK government, Bowling Green (KY), and the Mozilla Foundation to map out consensus on highly polarized topics.",
      th: "vTaiwan นำไปใช้ระดมสมองร่างกฎหมายระดับชาติเรื่อง Uber และการขายสุรา นำไปใช้โดยรัฐบาลสหราชอาณาจักร, เมือง Bowling Green (KY) และ Mozilla Foundation เพื่อหาฉันทามติในประเด็นที่แบ่งขั้วรุนแรง",
      zh: "vTaiwan 使用它来为 Uber 和酒类销售的国家立法进行众包。被英国政府、保林格林市 (KY) 以及 Mozilla 基金会采用，用于在高度两极分化的话题上绘制共识。",
      ko: "vTaiwan에서 Uber 및 주류 판매에 대한 국가 입법을 크라우드소싱하는 데 사용했습니다. 영국 정부, 미국 볼링그린, 모질라 재단에서 매우 양극화된 주제에 대한 합의를 도출하기 위해 도입했습니다.",
      ja: "vTaiwanによってUberや酒類販売に関する国内立法のクラウドソーシングに使用されました。英国政府、ボウリンググリーン（KY）、Mozilla財団などで、極度に両極化したトピックに関する合意を形成するために導入されています。"
    }
  },
  "smartcitizen": {
    title: {
      en: "Smart Citizen Kit",
      th: "Smart Citizen Kit",
      zh: "Smart Citizen Kit",
      ko: "Smart Citizen Kit",
      ja: "Smart Citizen Kit"
    },
    problem: {
      en: "Official environmental sensors are highly accurate but sparse, meaning a neighborhood's actual pollution exposure is invisible. Citizens had no way to gather valid, continuous environmental data to challenge municipal policy.",
      th: "เซ็นเซอร์สิ่งแวดล้อมทางการนั้นแม่นยำสูงแต่มีน้อยมาก ทำให้มองไม่เห็นมลพิษที่แท้จริงในระดับละแวกบ้าน ประชาชนไม่มีวิธีรวบรวมข้อมูลสิ่งแวดล้อมที่น่าเชื่อถือและต่อเนื่องเพื่อท้าทายนโยบายเทศบาล",
      zh: "官方的环境传感器虽然精确但分布稀疏，这意味着街区实际污染暴露情况是不可见的。市民无法收集到有效、连续的环境数据来质疑市政政策。",
      ko: "공식 환경 센서는 매우 정확하지만 듬성듬성 설치되어 있어, 동네의 실제 오염 노출 정도를 파악할 수 없습니다. 시민들은 지자체 정책에 이의를 제기할 유효하고 지속적인 환경 데이터를 수집할 방법이 없었습니다.",
      ja: "公式の環境センサーは非常に正確ですが疎であるため、近隣の実際の汚染への曝露は可視化されません。市民には、市の政策に異議を唱えるための有効で継続的な環境データを収集する方法がありませんでした。"
    },
    solution: {
      en: "An open-source hardware board equipped with sensors for particulate matter, noise, temperature, and humidity. Anyone can assemble one, place it on their balcony, and stream real-time data to a global public map.",
      th: "บอร์ดฮาร์ดแวร์โอเพนซอร์สที่มาพร้อมเซ็นเซอร์วัดฝุ่นละออง เสียง อุณหภูมิ และความชื้น ใครก็สามารถประกอบเอง วางไว้ที่ระเบียง และส่งสตรีมข้อมูลเรียลไทม์ขึ้นแผนที่สาธารณะระดับโลกได้",
      zh: "一款配备了颗粒物、噪音、温度和湿度传感器的开源硬件板。任何人都可以组装一台，放在自家阳台上，将实时数据流式传输到全球的公共地图上。",
      ko: "미세먼지, 소음, 온도, 습도 센서가 장착된 오픈 소스 하드웨어 보드입니다. 누구나 조립하여 발코니에 놓고 글로벌 공개 지도에 실시간 데이터를 스트리밍할 수 있습니다.",
      ja: "粒子状物質、騒音、温度、湿度用のセンサーを備えたオープンソースのハードウェアボード。誰でも組み立ててバルコニーに置き、リアルタイムデータをグローバルな公開マップにストリーミングできます。"
    },
    impact: {
      en: "Created by Fab Lab Barcelona. Deployed in over 10,000 locations globally. Local communities in Amsterdam used the noise data to successfully lobby the government for stricter aviation noise limits around Schiphol airport.",
      th: "สร้างสรรค์โดย Fab Lab Barcelona ติดตั้งแล้วกว่า 10,000 จุดทั่วโลก ชุมชนในอัมสเตอร์ดัมใช้ข้อมูลเสียงเพื่อกดดันรัฐบาลให้เข้มงวดกับขีดจำกัดเสียงการบินรอบสนามบิน Schiphol ได้สำเร็จ",
      zh: "由 Fab Lab Barcelona 打造。在全球超过 10,000 个地点部署。阿姆斯特丹的当地社区利用其噪音数据成功游说政府对史基浦机场周边实施更严格的航空噪音限制。",
      ko: "바르셀로나의 Fab Lab에서 제작. 전 세계 10,000개 이상의 위치에 배포됨. 암스테르담의 지역 커뮤니티는 이 소음 데이터를 활용하여 스키폴 공항 주변의 항공 소음 제한을 강화하도록 정부를 성공적으로 설득했습니다.",
      ja: "Fab Lab Barcelonaによって作成されました。世界中の10,000カ所以上で展開されています。アムステルダムの地域コミュニティは、この騒音データを利用して、スキポール空港周辺の航空騒音規制を強化するよう政府へのロビー活動に成功しました。"
    }
  },
  "ckan": {
    title: {
      en: "CKAN",
      th: "CKAN",
      zh: "CKAN",
      ko: "CKAN",
      ja: "CKAN"
    },
    problem: {
      en: "City open data portals used to be chaotic FTP servers or expensive vendor lock-in portals. Data journalists and civic hackers couldn't programmatically search for datasets, preventing accountability and innovation.",
      th: "พอร์ทัลข้อมูลเปิดของเมืองเคยเป็นแค่เซิร์ฟเวอร์ FTP ที่ยุ่งเหยิง หรือพอร์ทัลผูกขาดราคาแพง นักข่าวข้อมูลและแฮกเกอร์เมืองไม่สามารถเขียนโปรแกรมค้นหาชุดข้อมูลได้ ขัดขวางความโปร่งใสและนวัตกรรม",
      zh: "城市的开放数据门户曾是混乱的 FTP 服务器或昂贵的供应商锁定门户。数据记者和公民黑客无法以编程方式搜索数据集，从而阻碍了问责和创新。",
      ko: "도시의 공공 데이터 포털은 혼란스러운 FTP 서버이거나 비싼 벤더 종속형 포털이었습니다. 데이터 저널리스트와 시민 해커가 데이터세트를 프로그래밍 방식으로 검색할 수 없어 책임성과 혁신을 저해했습니다.",
      ja: "都市のオープンデータポータルは、かつては無秩序なFTPサーバーであるか、高価なベンダーロックインのポータルでした。データジャーナリストや市民ハッカーがプログラムでデータセットを検索できず、説明責任とイノベーションを妨げていました。"
    },
    solution: {
      en: "The Comprehensive Knowledge Archive Network (CKAN) is an open-source data management system. It provides tools for publishing, sharing, finding, and using data, complete with rich APIs, visualizations, and federated harvesting.",
      th: "CKAN คือระบบจัดการข้อมูลแบบโอเพนซอร์ส มีเครื่องมือสำหรับเผยแพร่ แบ่งปัน ค้นหา และใช้ข้อมูล มาพร้อม API ขั้นสูง ระบบแสดงผลภาพข้อมูล และการดึงข้อมูลแบบรวมศูนย์",
      zh: "综合知识档案网络 (CKAN) 是一个开源的数据管理系统。它提供用于发布、共享、查找和使用数据的工具，并配有丰富的 API、可视化图表和联合数据采集功能。",
      ko: "종합 지식 아카이브 네트워크(CKAN)는 오픈 소스 데이터 관리 시스템입니다. 데이터 게시, 공유, 검색, 사용을 위한 도구를 제공하며 풍부한 API, 시각화 및 연합 수집 기능을 갖추고 있습니다.",
      ja: "包括的知識アーカイブネットワーク（CKAN）は、オープンソースのデータ管理システムです。データの公開、共有、検索、使用のためのツールを提供し、豊富なAPI、可視化、フェデレーション・ハーベスティングを備えています。"
    },
    impact: {
      en: "The foundational infrastructure of the global open data movement. Powers Data.gov (US), Data.gov.uk (UK), the EU Open Data Portal, and hundreds of municipal data catalogs globally, hosting millions of open datasets.",
      th: "โครงสร้างพื้นฐานสำคัญของขบวนการข้อมูลเปิดทั่วโลก ขับเคลื่อน Data.gov (สหรัฐฯ), Data.gov.uk (สหราชอาณาจักร), EU Open Data Portal และแคตตาล็อกข้อมูลเมืองนับร้อยทั่วโลก เป็นแหล่งเก็บชุดข้อมูลเปิดนับล้าน",
      zh: "全球开放数据运动的基础设施。驱动了 Data.gov（美国）、Data.gov.uk（英国）、欧盟开放数据门户以及全球数百个市政数据目录，托管了数以百万计的开放数据集。",
      ko: "글로벌 오픈 데이터 운동의 기본 인프라입니다. 미국(Data.gov), 영국(Data.gov.uk), EU 오픈 데이터 포털 및 전 세계 수백 개의 지자체 데이터 카탈로그를 구동하여 수백만 개의 오픈 데이터 세트를 호스팅합니다.",
      ja: "グローバルなオープンデータ運動の基盤インフラストラクチャ。Data.gov（米国）、Data.gov.uk（英国）、EUオープンデータポータル、そして世界中の数百の自治体データカタログを支え、数百万のオープンデータセットをホストしています。"
    }
  },
  "onebusaway": {
    title: {
      en: "OneBusAway",
      th: "OneBusAway",
      zh: "OneBusAway",
      ko: "OneBusAway",
      ja: "OneBusAway"
    },
    problem: {
      en: "Riders waited in the rain wondering if the bus was coming, while transit agencies sat on live GPS data they couldn't afford to expose through custom consumer applications.",
      th: "ผู้โดยสารต้องยืนรอตากฝนสงสัยว่ารถเมล์จะมาไหม ในขณะที่หน่วยงานขนส่งมีข้อมูล GPS สดอยู่เต็มกำมือแต่ไม่มีงบทำแอปให้คนทั่วไปใช้",
      zh: "乘客在雨中苦等，不知道公交车是否会来；与此同时，交通机构手握实时 GPS 数据，却无力承担开发面向消费者的定制应用来公开这些数据。",
      ko: "승객들은 비를 맞으며 버스가 올지 궁금해하며 기다렸고, 교통 기관은 맞춤형 소비자 애플리케이션을 통해 노출할 엄두를 내지 못하는 실시간 GPS 데이터를 깔고 앉아 있었습니다.",
      ja: "乗客は雨の中でバスが来るかどうかを思い悩みながら待っていましたが、交通機関はカスタマイズされたコンシューマーアプリを通じて公開する資金がないまま、リアルタイムのGPSデータを抱え込んでいました。"
    },
    solution: {
      en: "An open-source platform that digests raw transit feeds (GTFS-Realtime) and provides real-time arrival info via mobile apps, SMS, and web APIs. It is maintained collaboratively by academic institutions and transit agencies.",
      th: "แพลตฟอร์มโอเพนซอร์สที่ย่อยข้อมูลขนส่งดิบ (GTFS-Realtime) และให้ข้อมูลรถถึงป้ายแบบเรียลไทม์ผ่านแอปมือถือ SMS และเว็บ API ดูแลรักษาร่วมกันโดยสถาบันการศึกษาและหน่วยงานขนส่ง",
      zh: "一个开源平台，能解析原始公共交通数据（GTFS-Realtime），并通过移动应用、短信和 Web API 提供实时到站信息。它由学术机构和公共交通机构共同维护。",
      ko: "원시 대중교통 피드(GTFS-Realtime)를 소화하고 모바일 앱, SMS, 웹 API를 통해 실시간 도착 정보를 제공하는 오픈 소스 플랫폼입니다. 학술 기관과 교통 기관이 협력하여 유지 관리합니다.",
      ja: "生の交通機関フィード（GTFS-Realtime）を消化し、モバイルアプリ、SMS、Web APIを介してリアルタイムの到着情報を提供するオープンソースプラットフォーム。学術機関と交通機関の協働により維持されています。"
    },
    impact: {
      en: "Deployed in Seattle, Tampa, San Diego, Buenos Aires, and Washington D.C. Studies showed that having real-time information via OneBusAway significantly increased transit ridership and rider perceived safety.",
      th: "นำไปใช้ในซีแอตเทิล แทมปา ซานดิเอโก บัวโนสไอเรส และวอชิงตัน ดี.ซี. งานวิจัยพบว่าการมีข้อมูลเรียลไทม์ผ่าน OneBusAway ช่วยเพิ่มยอดคนขึ้นรถเมล์และทำให้ผู้โดยสารรู้สึกปลอดภัยขึ้นอย่างมาก",
      zh: "在西雅图、坦帕、圣地亚哥、布宜诺斯艾利斯和华盛顿特区部署。研究表明，通过 OneBusAway 提供实时信息显著增加了公交客流量，并提升了乘客的安全感知。",
      ko: "시애틀, 탬파, 샌디에이고, 부에노스아이레스, 워싱턴 D.C. 등에 배포되었습니다. 연구에 따르면 OneBusAway를 통한 실시간 정보 제공은 대중교통 이용률과 승객의 체감 안전도를 크게 높인 것으로 나타났습니다.",
      ja: "シアトル、タンパ、サンディエゴ、ブエノスアイレス、ワシントンD.C.などで展開されています。研究によると、OneBusAwayを介したリアルタイム情報の提供は、公共交通機関の利用者数と乗客の体感的な安全性を大幅に向上させました。"
    }
  },
  "terrastories": {
    title: {
      en: "Terrastories",
      th: "Terrastories",
      zh: "Terrastories",
      ko: "Terrastories",
      ja: "Terrastories"
    },
    problem: {
      en: "Indigenous communities were mapping their lands using GIS to secure legal land tenure against resource extraction, but standard mapping tools lacked the capacity to tie oral histories and cultural significance to precise geographical coordinates offline.",
      th: "ชุมชนพื้นเมืองทำแผนที่ดินแดนด้วย GIS เพื่อคุ้มครองสิทธิที่ดินจากการทำเหมือง แต่เครื่องมือทำแผนที่ทั่วไปไม่สามารถเชื่อมโยงประวัติศาสตร์คำบอกเล่าและความสำคัญทางวัฒนธรรมเข้ากับพิกัดทางภูมิศาสตร์แบบออฟไลน์ได้",
      zh: "原住民社区利用 GIS 绘制土地地图，以确保合法土地保有权，防止资源开采；但标准的地图工具无法在离线状态下将口述历史和文化意义与精确的地理坐标联系起来。",
      ko: "원주민 커뮤니티는 자원 채굴로부터 합법적인 토지 소유권을 확보하기 위해 GIS를 사용하여 토지를 매핑하고 있었지만, 표준 매핑 도구는 오프라인 상태에서 구전 역사와 문화적 중요성을 정확한 지리적 좌표에 연결하는 기능이 부족했습니다.",
      ja: "先住民コミュニティは、資源採掘から法的な土地所有権を確保するためにGISを使用して土地をマッピングしていましたが、標準的なマッピングツールには、オフラインで口承の歴史と文化的意義を正確な地理的座標に結びつける機能が欠けていました。"
    },
    solution: {
      en: "An open-source, offline-first geostorytelling app. Built with Mapbox, it runs entirely on local mesh networks or USB-powered microservers deep in the Amazon. It allows communities to restrict sensitive cultural data entirely to local elders.",
      th: "แอปเล่าเรื่องภูมิศาสตร์แบบโอเพนซอร์สและออฟไลน์ สร้างด้วย Mapbox ทำงานได้เต็มรูปแบบบนเครือข่าย mesh ท้องถิ่น หรือเซิร์ฟเวอร์จิ๋วเสียบ USB ในป่าแอมะซอนลึก ช่วยให้ชุมชนจำกัดการเข้าถึงข้อมูลวัฒนธรรมอ่อนไหวไว้ให้ผู้อาวุโสในพื้นที่เท่านั้น",
      zh: "一款开源、离线优先的地理故事应用。基于 Mapbox 构建，可完全在亚马逊丛林深处的本地网状网络或 USB 供电的微型服务器上运行。它允许社区将敏感的文化数据完全限制在当地长者范围内访问。",
      ko: "오픈 소스, 오프라인 우선 지리적 스토리텔링 앱. Mapbox로 구축되었으며, 아마존 밀림 깊은 곳의 로컬 메시 네트워크나 USB 구동 마이크로 서버에서 완벽하게 작동합니다. 커뮤니티는 민감한 문화적 데이터를 지역 장로들에게만 제한할 수 있습니다.",
      ja: "オープンソースでオフラインファーストのジオストーリーテリングアプリ。Mapboxで構築されており、アマゾンの奥深くにあるローカルメッシュネットワークやUSB駆動のマイクロサーバー上で完全に動作します。コミュニティは、機密性の高い文化データを地元の長老に完全に限定することができます。"
    },
    impact: {
      en: "Co-designed with the Matawai Maroons in Suriname. Now used by Indigenous groups in Canada, Brazil, and Kenya to assert data sovereignty, pass down ecological knowledge, and defend legal land claims using verifiable indigenous geography.",
      th: "ออกแบบร่วมกับชาว Matawai Maroons ในซูรินาเม ปัจจุบันถูกใช้โดยกลุ่มชนพื้นเมืองในแคนาดา บราซิล และเคนยา เพื่อยืนยันอธิปไตยทางข้อมูล สืบทอดความรู้เชิงนิเวศวิทยา และปกป้องข้อเรียกร้องสิทธิที่ดินทางกฎหมายโดยใช้ภูมิศาสตร์ชนพื้นเมืองที่ตรวจสอบได้",
      zh: "与苏里南的 Matawai Maroons 共同设计。现在被加拿大、巴西和肯尼亚的原住民团体用来维护数据主权、传承生态知识，并利用可验证的原住民地理信息来捍卫合法的土地主张。",
      ko: "수리남의 Matawai 정착민과 공동 설계. 현재 캐나다, 브라질, 케냐의 원주민 그룹이 데이터 주권을 주장하고, 생태 지식을 전수하며, 검증 가능한 원주민 지리학을 사용하여 법적 토지 소유권을 방어하는 데 사용하고 있습니다.",
      ja: "スリナムのマタワイ・マルーンと共同設計されました。現在、カナダ、ブラジル、ケニアの先住民グループによって使用されており、データ主権を主張し、生態学的な知識を継承し、検証可能な先住民の地理を使用して法的な土地請求権を防御しています。"
    }
  }
};
