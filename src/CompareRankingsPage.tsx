import React from "react";
import ComparisonGrid from "./ComparisonGrid";
import SiteFooter from "./SiteFooter";
import "./compareRankingsData";
import { SLIC_LOGO_INLINE } from "./brandAssets";
import type { Locale, SitePath } from "./types";

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

const BLIND_SPOT_ROWS = [
  { label: "Housing affordability", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Overwork / working hours", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Tolerance / civic openness", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Resident satisfaction", eiu: false, mercer: false, resonance: true, monocle: false, yonsei: false, slic: true },
  { label: "Suicide / mental strain", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Graduate housing burden", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
  { label: "Cultural diversity", eiu: false, mercer: false, resonance: false, monocle: true, yonsei: false, slic: true },
  { label: "Income after rent (PPP)", eiu: false, mercer: false, resonance: false, monocle: false, yonsei: false, slic: true },
];

const PILLAR_DATA = [
  { id: "pressure", weight: "25%", name: "Growth", desc: "Economic dynamism. What\u2019s left after rent. Housing burden. Working-time pressure." },
  { id: "viability", weight: "22%", name: "Viability", desc: "Safety. Transit. Clean air. Digital infrastructure. Climate." },
  { id: "capability", weight: "18%", name: "Capability", desc: "Healthcare access. Education quality. Equal opportunity." },
  { id: "community", weight: "15%", name: "Community", desc: "Belonging. Tolerance. Cultural life. Whether your neighbors want you there." },
  { id: "creative", weight: "20%", name: "Creative", desc: "Entrepreneurial friction. Innovation intensity. Government stability." },
];

export default function CompareRankingsPage({ onNavigate, locale }: { onNavigate: (path: SitePath) => void; locale: Locale }) {
  return (
    <>
      {/* ═══ ACT 1: THE PROVOCATION ═══ */}
      <header className="oped-open">
        <img src={SLIC_LOGO_INLINE} alt="SLIC Index" className="oped-open-logo" />
        <h1 className="oped-open-headline">
          {t(locale,
            "Every city ranking is a lie.\nHere\u2019s <em>ours</em>.",
            "ทุกการจัดอันดับเมืองคือคำโกหก\nนี่คือ<em>ของเรา</em>",
            "每个城市排名都是谎言\n这是<em>我们的</em>"
          ).split(/<em>|<\/em>/).map((part, i) =>
            i % 2 === 1 ? <em key={i}>{part}</em> : part
          )}
        </h1>
        <span className="oped-scroll-hint">{t(locale, "scroll", "เลื่อนลง", "向下滚动")}</span>
      </header>

      {/* ═══ ACT 2: THE COMPARISON GRID ═══ */}
      <section className="hp-grid-reveal">
        <div className="section">
          <p className="hp-grid-kicker">{t(locale, "SIX INDICES. SIDE BY SIDE.", "หกดัชนี เทียบกัน", "六个指数 并排对比")}</p>
          <ComparisonGrid locale={locale} />
          <p className="hp-grid-note">{t(locale,
            "Five indices, five methodologies, one answer: rich, stable, Western-ish. SLIC asks a different question. Hover any city to see where else it appears.",
            "ห้าดัชนี ห้าระเบียบวิธี คำตอบเดียว: ร่ำรวย มั่นคง แบบตะวันตก SLIC ถามคำถามที่ต่าง วางเมาส์ที่เมืองใดก็ได้",
            "五个指数 五种方法论 一个答案：富裕稳定偏西方 SLIC问的是另一个问题 悬停在任何城市上查看")}</p>
        </div>
      </section>

      {/* Pull quote */}
      <div className="oped-pullquote">
        <p>{t(locale,
          "\u201CThe difference between the world\u2019s #1 city and #10 is 1.8 points out of 100. One new park can swing a ranking. One traffic camera can change a score.\u201D",
          "\u201Cความแตกต่างระหว่างเมือง #1 กับ #10 ของโลกคือ 1.8 คะแนนจาก 100 สวนสาธารณะใหม่หนึ่งแห่งเปลี่ยนอันดับได้ กล้องจราจรตัวเดียวเปลี่ยนคะแนนได้\u201D",
          "\u201C世界第1名城市和第10名之间只差1.8分（满分100） 一个新公园就能改变排名 一个监控摄像头就能改变分数\u201D")}</p>
      </div>

      {/* ═══ BLIND SPOTS DIAGRAM ═══ */}
      <section className="oped-blindspots section">
        <h2 className="oped-blindspots-title">{t(locale, "What they measure. What they miss.", "สิ่งที่วัด สิ่งที่พลาด", "衡量了什么 遗漏了什么")}</h2>
        <p className="oped-blindspots-sub">{t(locale, "Only SLIC measures all eight.", "มีแค่ SLIC ที่วัดครบทั้งแปด", "只有SLIC衡量了全部八项")}</p>
        <div className="oped-grid">
          <div className="oped-grid-header" />
          <div className="oped-grid-header">EIU</div>
          <div className="oped-grid-header">Mercer</div>
          <div className="oped-grid-header">Resonance</div>
          <div className="oped-grid-header">Monocle</div>
          <div className="oped-grid-header">Yonsei</div>
          <div className="oped-grid-header oped-grid-header--slic">SLIC</div>
          {BLIND_SPOT_ROWS.map((row) => (
            <React.Fragment key={row.label}>
              <div className="oped-grid-row-label">{row.label}</div>
              <div className={`oped-grid-cell ${row.eiu ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.eiu ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.mercer ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.mercer ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.resonance ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.resonance ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.monocle ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.monocle ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.yonsei ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.yonsei ? "\u2713" : "\u2717"}</div>
              <div className={`oped-grid-cell ${row.slic ? "oped-grid-cell--yes" : "oped-grid-cell--no"}`}>{row.slic ? "\u2713" : "\u2717"}</div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Photo break */}
      <figure className="oped-photo-break">
        <img src="/photos/report-city-walkway.jpg" alt="People walking on elevated walkway" loading="lazy" />
        <figcaption>{t(locale, "What liveability actually looks like: eye-level, human scale, daily life.", "ความน่าอยู่จริงๆ หน้าตาเป็นยังไง: ระดับสายตา มาตราส่วนมนุษย์ ชีวิตประจำวัน", "宜居性到底是什么样子：视线高度 人的尺度 日常生活")}</figcaption>
      </figure>

      {/* ═══ DATA COVERAGE ACKNOWLEDGMENT ═══ */}
      <section className="oped-editorial section" style={{ borderBottom: "1px solid var(--border)" }}>
        <h2 className="oped-editorial-big">{t(locale, "What we don\u2019t cover yet.", "สิ่งที่เรายังไม่ครอบคลุม", "我们尚未覆盖的内容")}</h2>
        <p className="oped-editorial-body">{t(locale,
          "SLIC ranks 157 cities across 35 signals. That\u2019s not every city in the world. War zones \u2014 Syria, Yemen, Sudan, Myanmar \u2014 lack the reliable, verifiable data our methodology requires. Micro-states and cities under active conflict are on our watchlist, not quietly dropped. We\u2019d rather show you the gap than pretend it doesn\u2019t exist.",
          "SLIC จัดอันดับ 157 เมือง ใน 35 สัญญาณ นั่นไม่ใช่ทุกเมืองในโลก เขตสงคราม \u2014 ซีเรีย เยเมน ซูดาน เมียนมาร์ \u2014 ขาดข้อมูลที่เชื่อถือได้ เราเลือกแสดงช่องว่างแทนที่จะเงียบๆ ตัดเมืองออก",
          "SLIC对157座城市进行排名 涵盖35个信号 这不是世界上所有的城市 战区 \u2014 叙利亚、也门、苏丹、缅甸 \u2014 缺乏可靠数据 我们宁愿展示差距也不愿假装它不存在")}</p>
        <p className="oped-editorial-body">{t(locale,
          "Every city has a coverage grade \u2014 A, B, C, or Watchlist \u2014 published alongside its score. V4 target: 350+ cities. Every new data point makes the index more honest, not more impressive.",
          "ทุกเมืองมีเกรดความครอบคลุม \u2014 A, B, C, หรือ Watchlist \u2014 เผยแพร่คู่กับคะแนน เป้าหมาย V4: 350+ เมือง",
          "每座城市都有覆盖等级 \u2014 A、B、C或观察名单 \u2014 与分数一起公布 V4目标：350+城市")}</p>
      </section>

      {/* ═══ MONEYBALL ═══ */}
      <section className="oped-editorial section">
        <h2 className="oped-editorial-big">{t(locale,
          "The Moneyball of city investment.",
          "Moneyball ของการลงทุนในเมือง",
          "城市投资的Moneyball")}</h2>
        <p className="oped-editorial-body">{t(locale,
          "You don\u2019t have to invest in Vienna because The Economist told you to. Kaohsiung has cheaper rent, better weather, a government that actively courts foreign business, and local universities producing graduates who want to stay. Bangkok has 12 million consumers, a cost of living that lets startups survive year one, and tolerance that makes diverse teams possible. Santiago has Latin America\u2019s strongest business climate with European infrastructure at a third of the price.",
          "คุณไม่จำเป็นต้องลงทุนในเวียนนาเพราะ The Economist บอกให้ทำ เกาสงมีค่าเช่าถูกกว่า อากาศดีกว่า รัฐบาลที่ดึงดูดธุรกิจต่างชาติ และมหาวิทยาลัยท้องถิ่นที่ผลิตบัณฑิตที่อยากอยู่ต่อ กรุงเทพมีผู้บริโภค 12 ล้านคน ค่าครองชีพที่ให้สตาร์ทอัพรอดปีแรก และความอดทนที่ทำให้ทีมที่หลากหลายเป็นไปได้",
          "你不必因为经济学人说了就投资维也纳 高雄租金更便宜 天气更好 政府积极招商引资 本地大学培养的毕业生愿意留下来 曼谷有1200万消费者 生活成本让创业公司撑过第一年 包容性让多元团队成为可能")}</p>
        <p className="oped-editorial-body">{t(locale,
          "The establishment indices measure where Goldman Sachs should send its London bankers. SLIC measures where your next office should actually be.",
          "ดัชนีสถาบันวัดว่า Goldman Sachs ควรส่งนักการธนาคารลอนดอนไปไหน SLIC วัดว่าออฟฟิศถัดไปของคุณควรอยู่ที่ไหนจริงๆ",
          "传统指数衡量的是高盛应该把伦敦银行家派到哪里 SLIC衡量的是你的下一个办公室到底应该在哪里")}</p>
      </section>

      {/* ═══ ACT 3: WHAT SLIC MEASURES ═══ */}
      <section className="oped-pillars section">
        <div>
          <h2 className="oped-blindspots-title">{t(locale, "So what does SLIC measure?", "แล้ว SLIC วัดอะไร?", "那SLIC衡量什么?")}</h2>
          <p className="oped-blindspots-sub" style={{ marginBottom: "2rem" }}>{t(locale, "Five pillars. One formula. Every number traceable.", "ห้าเสาหลัก สูตรเดียว ทุกตัวเลขสืบย้อนได้", "五大支柱 一个公式 每个数字都可追溯")}</p>
          {PILLAR_DATA.map((p) => (
            <div key={p.id} className="oped-pillar-item">
              <div className="oped-pillar-weight">{p.weight}</div>
              <div>
                <p className="oped-pillar-name">{p.name}</p>
                <p className="oped-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <figure className="oped-pillars-photo">
          <img src="/photos/report-people-workshop.jpg" alt="Workshop with city officials" loading="lazy" />
          <figcaption>{t(locale, "Testing the framework with city officials who actually run cities.", "ทดสอบกรอบแนวคิดกับเจ้าหน้าที่เมืองที่บริหารเมืองจริง", "与实际管理城市的官员一起测试框架")}</figcaption>
        </figure>
      </section>

      {/* ═══ CTA: GO TO THE TOOL ═══ */}
      <section className="oped-spider">
        <div className="section" style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2 className="v3-section-title" style={{ color: "#fff" }}>{t(locale, "Now disagree with us.", "ตอนนี้ลองไม่เห็นด้วยกับเรา", "现在来反驳我们")}</h2>
          <p className="v3-spider-hint" style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>{t(locale,
            "Drag the spider. Crank growth to 100% \u2014 watch Singapore rise. Max viability \u2014 safe cities float up. This is your ranking, not ours.",
            "ลากใยแมงมุม ปรับน้ำหนัก แล้วดูเมืองเปลี่ยนอันดับตามลำดับของคุณ",
            "拖动蛛网 调整权重 看城市按你的优先级重新排名")}</p>
          <a className="v3-cta" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }} style={{ display: "inline-flex" }}>
            {t(locale, "OPEN THE RANKINGS", "เปิดอันดับ", "打开排名")} &rarr;
          </a>
        </div>
      </section>

      {/* ═══ ENDORSEMENT ═══ */}
      <div className="oped-pullquote oped-pullquote--endorsement">
        <p>{t(locale,
          "\u201CThey built the index. But you build the ranking.\u201D",
          "\u201Cพวกเขาสร้างดัชนี แต่คุณสร้างอันดับ\u201D",
          "\u201C他们建立了指数 但排名由你来定\u201D")}</p>
        <cite>
          <a href="https://mayorsofeurope.eu/news/they-built-the-index-but-you-build-the-ranking/" target="_blank" rel="noopener noreferrer">
            {t(locale, "Svetlana Tesic, CoFounder, Mayors of Europe", "Svetlana Tesic ผู้ร่วมก่อตั้ง Mayors of Europe", "Svetlana Tesic Mayors of Europe联合创始人")}
          </a>
        </cite>
      </div>

      {/* ═══ THE CLOSE ═══ */}
      <section className="oped-close">
        <img src="/launch-photos/20260318145941_DSC09480.jpg" alt="SCSE 2026 Taipei" className="oped-close-photo" loading="lazy" />
        <div className="oped-close-content section">
          <h2 className="oped-close-title">{t(locale,
            "Launched at SCSE 2026, Taipei.\n3,000 professionals.\nA European mayor\u2019s alliance asked to use it instead of The Economist\u2019s.",
            "เปิดตัวที่ SCSE 2026 ไทเป\nผู้เชี่ยวชาญ 3,000 คน\nพันธมิตรนายกเทศมนตรียุโรปขอใช้แทนดัชนี The Economist",
            "在SCSE 2026台北发布\n3000位专业人士\n欧洲市长联盟要求用它取代经济学人指数")}</h2>
          <p className="oped-close-body">{t(locale,
            "Free. Public. Transparent. We show our watchlist. We show our coverage grades. We show every data source. No paywall. No proprietary black box.",
            "ฟรี เปิดเผย โปร่งใส เราแสดง watchlist แสดงเกรดความครอบคลุม แสดงแหล่งข้อมูลทุกจุด",
            "免费 公开 透明 我们展示观察名单 展示覆盖等级 展示每个数据来源")}</p>
          <div className="oped-close-cta">
            <a className="v3-cta" href="/rankings" onClick={(e) => { e.preventDefault(); onNavigate("/rankings"); }}>
              {t(locale, "EXPLORE THE RANKINGS", "สำรวจอันดับ", "探索排名")} &rarr;
            </a>
            <a className="v3-cta-secondary" href="/methodology" onClick={(e) => { e.preventDefault(); onNavigate("/methodology"); }}>
              {t(locale, "METHODOLOGY", "ระเบียบวิธี", "方法论")}
            </a>
            <a className="v3-cta-secondary" href="/about-slic" onClick={(e) => { e.preventDefault(); onNavigate("/about-slic"); }}>
              {t(locale, "ABOUT SLIC", "เกี่ยวกับ SLIC", "关于SLIC")}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
