import { useState } from "react";
import { INDEX_PROFILES } from "./compareRankingsData";
import publishedData from "./data/publishedRankingData.json";
import { PILLAR_ORDER } from "./pillarConfig";
import type { PillarId } from "./pillarConfig";
import type { Locale } from "./types";

interface PublishedCity {
  cityId: string; displayName: string; country: string; rankingStatus: string;
  pressureScore: number; viabilityScore: number; capabilityScore: number; communityScore: number; creativeScore: number;
}

const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked");
const defaultWeights = publishedData.canonicalWeights as Record<PillarId, number>;

function scoreCity(city: PublishedCity, weights: Record<PillarId, number>): number {
  const total = PILLAR_ORDER.reduce((s, p) => s + weights[p], 0);
  if (total === 0) return 0;
  return PILLAR_ORDER.reduce((s, p) => s + ((city[`${p}Score` as keyof PublishedCity] as number) * weights[p]) / total, 0);
}

const slicTop10 = rankedCities
  .map((c) => ({ ...c, customScore: scoreCity(c, defaultWeights) }))
  .sort((a, b) => b.customScore - a.customScore)
  .slice(0, 10);

export default function ComparisonGrid({ locale }: { locale: Locale }) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const t = (en: string, th: string, zh: string) => (locale === "en" ? en : locale === "th" ? th : zh);

  const allColumns = [
    {
      id: "slic",
      name: "SLIC Index",
      accent: "#ffffff",
      cities: slicTop10.map((c, i) => ({ rank: i + 1, city: c.displayName, country: c.country })),
    },
    ...INDEX_PROFILES.map((p) => ({
      id: p.id,
      name: p.name,
      accent: p.accentHex,
      cities: p.topCities,
    })),
  ];

  // Calculate frequency of each city across all columns
  const frequencyMap = new Map<string, number>();
  allColumns.forEach((col) => {
    col.cities.forEach((item) => {
      frequencyMap.set(item.city, (frequencyMap.get(item.city) || 0) + 1);
    });
  });

  return (
    <div className="comp-grid-wrapper">
      <div className="comp-grid">
        {allColumns.map((col) => (
          <div key={col.id} className="comp-col" style={{ "--accent": col.accent } as React.CSSProperties}>
            <div className="comp-header">
              <span className="comp-header-dot" />
              <h3>{col.name}</h3>
            </div>
            <div className="comp-list">
              {col.cities.map((item) => {
                const count = frequencyMap.get(item.city) || 1;
                const isHovered = hoveredCity === item.city;
                const isSlic = col.id === "slic";
                const isSlicExclusive = isSlic && count === 1;

                return (
                  <div
                    key={`${col.id}-${item.rank}-${item.city}`}
                    className={`comp-item comp-item--freq-${count} ${isHovered ? "comp-item--highlight" : ""} ${isSlicExclusive ? "comp-item--exclusive" : ""}`}
                    onMouseEnter={() => setHoveredCity(item.city)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <span className="comp-rank">{item.rank}</span>
                    <div className="comp-city-info">
                      <span className="comp-city-name">{item.city}</span>
                      {count > 1 && (
                        <span className="comp-city-freq" title={t(`${count} indices`, `${count} ดัชนี`, `${count}个指数`)}>
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="comp-grid-note">
        {t(
          "* Colored highlights indicate how many indices include this city. Blue-tinted SLIC cities are exclusive to our top 10.",
          "* แถบสีระบุจำนวนดัชนีที่ระบุเมืองนี้ เมือง SLIC สีฟ้าคือเมืองที่มีเฉพาะในท็อป 10 ของเรา",
          "* 彩色高亮指示有多少个指数包含此城市。蓝色的SLIC城市是我们前10名特有的。"
        )}
      </p>
    </div>
  );
}
