import { smartCityFeed } from "./smartCityFeed";
import type { Locale } from "./types";

const feedCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    summary: string;
    readMore: string;
    via: string;
  }
> = {
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
  Energy: "var(--accent-green)",
  "Climate resilience": "var(--accent-red)",
  "Urban climate": "var(--accent-amber)",
  "AI for cities": "var(--accent-cyan)",
  Inclusion: "var(--accent-green)",
  "Digital twins": "var(--accent-cyan)",
  "Clean air": "var(--accent-green)",
  "Mobility AI": "var(--accent-amber)",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export default function SmartCityFeedPanel({ locale }: { locale: Locale }) {
  const ui = feedCopy[locale];
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
                <span className="feed-time">{timeAgo(item.publishedAt)}</span>
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
