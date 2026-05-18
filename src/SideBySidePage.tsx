import { useState } from "react";
import { displayCountry } from "./cityUtils";
import { getExerciseCities } from "./rankingsData";
import { t } from "./i18n";
import { rankingPublication } from "./rankingPublication";
import SiteFooter from "./SiteFooter";
import type { FullRankedCity, Locale, SitePath } from "./types";

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
const publishedTierById = new Map(
  rankingPublication.cities.map((city) => [city.cityId.replace(/^[a-z]{2}-/, ""), city.tierLabel ?? null]),
);


function getPublishedTier(city: FullRankedCity): "Alpha" | "Beta" | "Gamma" | null {
  return city.tierLabel ?? publishedTierById.get(city.id) ?? null;
}

function getTier(city: FullRankedCity): "alpha" | "beta" | "gamma" | "none" {
  const publishedTier = getPublishedTier(city);
  if (publishedTier === "Alpha") return "alpha";
  if (publishedTier === "Beta") return "beta";
  if (publishedTier === "Gamma") return "gamma";
  return "none";
}

// Greek letter tier system: α/β/γ are colour-coded "elite" tiers (top 30);
// δ–π extend the glyph distinction for colorblind users through rank 160.
const TIER_GLYPHS = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π"];
const TIER_NAMES  = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi"];

function getTierIndex(rank: number): number {
  return Math.ceil(rank / 10) - 1; // 0-indexed
}

function getTierLabel(city: FullRankedCity, locale: Locale): string {
  const publishedTier = getPublishedTier(city);
  if (publishedTier === "Alpha") return t(locale, "α Alpha", "α อัลฟา", "α 阿尔法");
  if (publishedTier === "Beta") return t(locale, "β Beta", "β เบตา", "β 贝塔");
  if (publishedTier === "Gamma") return t(locale, "γ Gamma", "γ แกมมา", "γ 伽马");
  const i = getTierIndex(city.globalRank);
  if (i >= 0 && i < TIER_GLYPHS.length) return `${TIER_GLYPHS[i]} ${TIER_NAMES[i]}`;
  return `#${city.globalRank}`;
}

function getTierGlyph(city: FullRankedCity): string {
  const publishedTier = getPublishedTier(city);
  if (publishedTier === "Alpha") return "α";
  if (publishedTier === "Beta") return "β";
  if (publishedTier === "Gamma") return "γ";
  const i = getTierIndex(city.globalRank);
  return TIER_GLYPHS[i] ?? "·";
}

export default function SideBySidePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  // Curated starter basket: the index's argument-in-five-cities.
  // Bangkok = the Alpha worked example (rank 27, Alpha slot 9).
  // Raleigh = Alpha slot 1, the structural top.
  // Singapore = the famous-but-Gamma counter-example (Community 38.8 fails Alpha floor).
  // Tokyo = the editorial-exclusion case (Beta, not Alpha despite passing floor).
  // Copenhagen = the Gamma case where housing pressure outweighs civic strength.
  // If any of these aren't in the published exercise field for some reason,
  // fall back to whichever Alpha cities are available so the page is never blank.
  const PREFERRED_DEFAULTS = ["bangkok", "raleigh", "singapore", "tokyo", "copenhagen"];
  const defaultIds = PREFERRED_DEFAULTS
    .map((id) => allCities.find((c) => c.id === id)?.id)
    .filter((id): id is string => Boolean(id));
  const fallbackIds = allCities
    .filter((c) => c.coreBoardEligible)
    .slice(0, 5 - defaultIds.length)
    .map((c) => c.id);
  const initialIds = [...defaultIds, ...fallbackIds].slice(0, 5);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
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
              "Build a custom basket to compare cities. Published Alpha, Beta, and Gamma follow the live public tier protocol; beyond that, Greek letters continue as ten-rank comparison markers.",
              "สร้างตะกร้าเมืองที่คุณต้องการเปรียบเทียบ Alpha, Beta และ Gamma ใช้ชั้นเผยแพร่จริงของระบบ ส่วนหลังจากนั้นใช้อักษรกรีกเป็นเครื่องหมายเปรียบเทียบทุก 10 อันดับ",
              "创建自定义篮子来比较城市。Alpha、Beta、Gamma 采用实时公开分层规则；其后继续用希腊字母作为每十名的比较标记。",
            )}
          </p>

          <div className="sbs-basket">
            <h3 className="sbs-basket-title">{t(locale, "Your compare basket", "ตะกร้าเปรียบเทียบของคุณ", "你的比较篮子")}</h3>
            <div className="sbs-basket-chips">
              {selectedCities.map((city, idx) => (
                <div key={city.id} className={`sbs-chip tier-${getTier(city)}`}>
                  <span className="sbs-chip-tier-glyph" aria-label={getTierLabel(city, locale)}>{getTierGlyph(city)}</span>
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
                        {displayCountry(c.country) && <span>{displayCountry(c.country)}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedCities.length === 0 && (
            <div className="sbs-empty">
              <p className="sbs-empty-eyebrow">
                {t(locale, "EMPTY BASKET", "ตะกร้าว่าง", "篮子为空")}
              </p>
              <p className="sbs-empty-title">
                {t(
                  locale,
                  "Pick a city to start the comparison.",
                  "เลือกเมืองเพื่อเริ่มเปรียบเทียบ",
                  "选择一座城市开始比较。",
                )}
              </p>
              <p className="sbs-empty-body">
                {t(
                  locale,
                  "Add up to five cities. Each column carries the five SLIC pillars, tier band, and resident-facing context side by side.",
                  "เพิ่มได้สูงสุดห้าเมือง แต่ละคอลัมน์จะแสดงทั้งห้าเสา คะแนนชั้น และบริบทสำหรับผู้อยู่อาศัยเคียงข้างกัน",
                  "最多可添加五座城市。每列并排呈现五大支柱、层级与本地生活背景。",
                )}
              </p>
            </div>
          )}
          <div className="sbs-grid" style={{ gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)` }}>
            {selectedCities.map((city) => (
              <div className={`sbs-column tier-border-${getTier(city)}`} key={city.id}>
                <div className="sbs-city-header">
                  <span className="sbs-city-name-btn" style={{cursor: "default"}}>{city.name}</span>
                  {displayCountry(city.country) && <span className="sbs-city-country">{displayCountry(city.country)}</span>}
                  <span className={`sbs-city-tier tier-text-${getTier(city)}`}>{getTierLabel(city, locale)}</span>
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
