import { useState } from "react";
import { getExerciseCities } from "./rankingsData";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

type PillarId = "pressure" | "viability" | "capability" | "community" | "creative";

const PILLAR_ORDER: PillarId[] = ["pressure", "viability", "capability", "community", "creative"];

const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
};

const PILLAR_COLORS: Record<PillarId, string> = {
  pressure: "#b85c28",
  viability: "#1a6b5a",
  capability: "#2a5a8c",
  community: "#8c4a2a",
  creative: "#a0382a",
};

const allCities = getExerciseCities();

function t(locale: Locale, en: string, th: string, zh: string) {
  return locale === "en" ? en : locale === "th" ? th : zh;
}

export default function SideBySidePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const defaultIds = allCities.slice(0, 5).map((c) => c.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultIds);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const labels = PILLAR_LABELS[locale];
  const selectedCities = selectedIds.map((id) => allCities.find((c) => c.id === id)!).filter(Boolean);

  const handleSwap = (slotIndex: number, newCityId: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[slotIndex] = newCityId;
      return next;
    });
    setEditingSlot(null);
    setSearch("");
  };

  const filteredCities = search.length >= 1
    ? allCities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase()),
      ).slice(0, 12)
    : [];

  const maxSlic = Math.max(...selectedCities.map((c) => c.scores.slic), 100);

  return (
    <>
      <main>
        <section className="section sbs-page">
          <p className="eyebrow">
            {t(locale, "SIDE BY SIDE", "เปรียบเทียบ", "城市对比")}
          </p>
          <h1 className="sbs-title">
            {t(locale, "Compare cities, your way.", "เปรียบเทียบเมืองในแบบของคุณ", "按你的方式比较城市")}
          </h1>
          <p className="sbs-subtitle">
            {t(
              locale,
              "Click any city name to swap it. The default shows the Alpha leaders.",
              "คลิกชื่อเมืองเพื่อสลับ ค่าเริ่มต้นแสดง Alpha leaders",
              "点击城市名称即可替换。默认显示 Alpha 领先城市。",
            )}
          </p>

          <div className="sbs-grid">
            {selectedCities.map((city, slotIndex) => (
              <div className="sbs-column" key={`${slotIndex}-${city.id}`}>
                <div className="sbs-city-header">
                  <button
                    type="button"
                    className="sbs-city-name-btn"
                    onClick={() => setEditingSlot(editingSlot === slotIndex ? null : slotIndex)}
                  >
                    {city.name}
                    <span className="sbs-swap-icon">&#8645;</span>
                  </button>
                  <span className="sbs-city-country">{city.country}</span>
                </div>

                {editingSlot === slotIndex && (
                  <div className="sbs-picker">
                    <input
                      className="sbs-search"
                      type="text"
                      placeholder={t(locale, "Search city...", "ค้นหาเมือง...", "搜索城市...")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                    <div className="sbs-picker-list">
                      {filteredCities.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          className="sbs-picker-item"
                          onClick={() => handleSwap(slotIndex, c.id)}
                        >
                          <strong>{c.name}</strong>
                          <span>{c.country}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sbs-slic-score">
                  <span className="sbs-slic-number">{city.scores.slic}</span>
                  <span className="sbs-slic-label">SLIC</span>
                  <div className="sbs-slic-bar">
                    <div
                      style={{ width: `${(city.scores.slic / maxSlic) * 100}%`, background: "var(--text)" }}
                    />
                  </div>
                </div>

                <div className="sbs-pillars">
                  {PILLAR_ORDER.map((pillar) => (
                    <div className="sbs-pillar-row" key={pillar}>
                      <span className="sbs-pillar-label">{labels[pillar]}</span>
                      <span className="sbs-pillar-score">{city.scores[pillar]}</span>
                      <div className="sbs-pillar-bar">
                        <div
                          style={{
                            width: `${city.scores[pillar]}%`,
                            background: PILLAR_COLORS[pillar],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sbs-meta">
                  <span>{city.region}</span>
                  <span>#{city.globalRank}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
