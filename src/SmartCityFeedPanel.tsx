import { smartCityFeed } from "./smartCityFeed";
import { pickLocale, type LocalizedRecord } from "./i18n";
import type { Locale } from "./types";

const feedCopy: LocalizedRecord<{
    eyebrow: string;
    title: string;
    summary: string;
    readMore: string;
    via: string;
}> = {
  en: {
    eyebrow: "Live signal feed",
    title: "Smart city pulse",
    summary:
      "Real-time headlines from the global smart city ecosystem. These signals feed the SLIC listening layer.",
    readMore: "Read full article",
    via: "via",
  },
  th: {
    eyebrow: "ฟีดสัญญาณสด",
    title: "ชีพจรเมืองอัจฉริยะ",
    summary:
      "พาดหัวข่าวเรียลไทม์จากระบบนิเวศเมืองอัจฉริยะทั่วโลก สัญญาณเหล่านี้ป้อนเข้าชั้นการฟังของ SLIC",
    readMore: "อ่านบทความฉบับเต็ม",
    via: "จาก",
  },
  zh: {
    eyebrow: "实时信号流",
    title: "智慧城市脉搏",
    summary:
      "来自全球智慧城市生态的实时头条。这些信号为 SLIC 的舆情监测层提供数据。",
    readMore: "阅读全文",
    via: "来源",
  },
};

const topicColors: Record<string, string> = {
  Workforce: "var(--accent-cyan)",
  Pilots: "var(--accent-amber)",
  Energy: "var(--accent-cyan)",
  "Clean energy": "var(--accent-cyan)",
  "Climate resilience": "var(--accent-red)",
  "Urban climate": "var(--accent-amber)",
  "AI for cities": "var(--accent-cyan)",
  "Civic AI": "var(--accent-cyan)",
  Inclusion: "var(--accent-cyan)",
  "Digital twins": "var(--accent-cyan)",
  "Digital public infrastructure": "var(--accent-cyan)",
  "Clean air": "var(--accent-cyan)",
  "Green buildings": "var(--accent-cyan)",
  "Climate planning": "var(--accent-red)",
  "Mobility AI": "var(--accent-amber)",
  Mobility: "var(--accent-amber)",
  "Smart governance": "var(--accent-cyan)",
  "Smart grids": "var(--accent-cyan)",
  "Urban innovation event": "var(--accent-amber)",
  "Urban planning": "var(--accent-amber)",
};

function timeAgo(dateStr: string, locale: Locale): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (locale === "th") {
    if (diffDays === 0) return "วันนี้";
    if (diffDays === 1) return "1 วันก่อน";
    if (diffDays < 7) return `${diffDays} วันก่อน`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ก่อน`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} เดือนก่อน`;
    return `${Math.floor(diffDays / 365)} ปีก่อน`;
  }

  if (locale === "zh") {
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "1天前";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  }

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export default function SmartCityFeedPanel({ locale }: { locale: Locale }) {
  const ui = pickLocale(feedCopy, locale);
  const sortedFeed = [...smartCityFeed].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <section className="feed-section section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h2>{ui.title}</h2>
        </div>
        <p className="section-summary">{ui.summary}</p>
      </div>

      <div className="feed-ticker">
        <div className="feed-ticker-track">
          {sortedFeed.map((item) => (
            <a
              key={item.id}
              className="feed-card"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="feed-card-head">
                <span
                  className="feed-topic-dot"
                  style={{ background: topicColors[item.topic] ?? "var(--accent-cyan)" }}
                  aria-hidden="true"
                />
                <span className="feed-topic">{item.topic}</span>
                <span className="feed-time">{timeAgo(item.publishedAt, locale)}</span>
              </div>

              <h3 className="feed-headline">{item.headline}</h3>

              <div className="feed-card-foot">
                <span className="feed-source">
                  {ui.via} <strong>{item.source}</strong>
                </span>
                <span className="feed-arrow" aria-hidden="true">&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
