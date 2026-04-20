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

function getTier(rank: number): "alpha" | "beta" | "gamma" | "none" {
  if (rank <= 10) return "alpha";
  if (rank <= 20) return "beta";
  if (rank <= 30) return "gamma";
  return "none";
}

function getTierLabel(rank: number): string {
  if (rank <= 10) return "α Alpha";
  if (rank <= 20) return "β Beta";
  if (rank <= 30) return "γ Gamma";
  return `#${rank}`;
}

function getTierGlyph(rank: number): string {
  if (rank <= 10) return "α";
  if (rank <= 20) return "β";
  if (rank <= 30) return "γ";
  return "·";
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
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const labels = PILLAR_LABELS[locale];
  const selectedCities = selectedIds.map((id) => allCities.find((c) => c.id === id)!).filter(Boolean);

  const handleRemove = (indexToRemove: number) => {
    setSelectedIds((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleAdd = (newCityId: string) => {
    if (selectedIds.includes(newCityId)) return;
    setSelectedIds((prev) => [...prev, newCityId]);
    setIsAdding(false);
    setSearch("");
  };

  const filteredCities = search.length >= 1
    ? allCities.filter(
        (c) =>
          (c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())) &&
          !selectedIds.includes(c.id)
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
              "Build a custom basket to compare cities. The colors indicate their tier: Alpha (Top 10), Beta (11-20), Gamma (21-30).",
              "สร้างตะกร้าเมืองที่คุณต้องการเปรียบเทียบ สีแสดงถึงระดับเมือง Alpha (1-10), Beta (11-20), Gamma (21-30)",
              "创建自定义篮子来比较城市。颜色表示其层级：Alpha (前 10)，Beta (11-20)，Gamma (21-30)。",
            )}
          </p>

          <div className="sbs-basket">
            <h3 className="sbs-basket-title">{t(locale, "Your compare basket", "ตะกร้าเปรียบเทียบของคุณ", "你的比较篮子")}</h3>
            <div className="sbs-basket-chips">
              {selectedCities.map((city, idx) => (
                <div key={city.id} className={`sbs-chip tier-${getTier(city.globalRank)}`}>
                  <span className="sbs-chip-tier-glyph" aria-label={getTierLabel(city.globalRank)}>{getTierGlyph(city.globalRank)}</span>
                  <span>{city.name}</span>
                  <button type="button" onClick={() => handleRemove(idx)} aria-label={t(locale, `Remove ${city.name}`, `ลบ ${city.name}`, `移除${city.name}`)}>&times;</button>
                </div>
              ))}
              {selectedIds.length < 5 && !isAdding && (
                <button type="button" className="sbs-chip-add" onClick={() => setIsAdding(true)}>
                  + {t(locale, "Add City", "เพิ่มเมือง", "添加城市")}
                </button>
              )}
            </div>

            {isAdding && (
              <div className="sbs-picker">
                <input
                  className="sbs-search"
                  type="text"
                  placeholder={t(locale, "Search city...", "ค้นหาเมือง...", "搜索城市...")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <button type="button" className="sbs-picker-close" onClick={() => setIsAdding(false)}>&times;</button>
                {filteredCities.length > 0 && (
                  <div className="sbs-picker-list">
                    {filteredCities.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className="sbs-picker-item"
                        onClick={() => handleAdd(c.id)}
                      >
                        <strong>{c.name}</strong>
                        <span>{c.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sbs-grid" style={{ gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)` }}>
            {selectedCities.map((city) => (
              <div className={`sbs-column tier-border-${getTier(city.globalRank)}`} key={city.id}>
                <div className="sbs-city-header">
                  <span className="sbs-city-name-btn" style={{cursor: "default"}}>{city.name}</span>
                  <span className="sbs-city-country">{city.country}</span>
                  <span className={`sbs-city-tier tier-text-${getTier(city.globalRank)}`}>{getTierLabel(city.globalRank)}</span>
                </div>

                <div className="sbs-slic-score">
                  <span className="sbs-slic-number">{city.scores.slic}</span>
                  <span className="sbs-slic-label">SLIC</span>
                  <div className="sbs-slic-bar">
                    <div
                      style={{ width: `${(city.scores.slic / maxSlic) * 100}%`, background: "var(--text)" }}
                    />
                  </div>
                </div>

                <div className="sbs-slic-context">
                   <div className="sbs-context-item">
                     <span>{t(locale, "Type", "ประเภท", "类型")}</span>
                     <strong>
                       {city.cityType === "primary"
                         ? t(locale, "Primary", "เมืองหลัก", "主城市")
                         : t(locale, "Secondary", "เมืองรอง", "次级城市")}
                     </strong>
                   </div>
                   <div className="sbs-context-item">
                     <span>{t(locale, "Region", "ภูมิภาค", "区域")}</span>
                     <strong>{city.region}</strong>
                   </div>
                   {city.metrics?.pppIncomePerHead && (
                     <div className="sbs-context-item">
                       <span>{t(locale, "Income (PPP)", "รายได้ (PPP)", "收入（PPP）")}</span>
                       <strong>${Math.round(city.metrics.pppIncomePerHead).toLocaleString()}</strong>
                     </div>
                   )}
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

              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
