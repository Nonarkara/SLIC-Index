import { useState } from "react";
import { displayCountry } from "./cityUtils";
import { getExerciseCities } from "./rankingsData";
import { t, localeNumberFormat } from "./i18n";
import { rankingPublication } from "./rankingPublication";
import { appHref } from "./routing";
import SiteFooter from "./SiteFooter";
import type { FullRankedCity, Locale, SitePath } from "./types";
import { PILLAR_COLORS, PILLAR_ORDER } from "./pillars";
import type { PillarId } from "./pillars";



const PILLAR_LABELS: Record<Locale, Record<PillarId, string>> = {
  en: { pressure: "Growth", viability: "Viability", capability: "Capability", community: "Community", creative: "Creative" },
  th: { pressure: "การเติบโต", viability: "ความน่าอยู่", capability: "ศักยภาพ", community: "ชุมชน", creative: "ความสร้างสรรค์" },
  zh: { pressure: "增长", viability: "宜居", capability: "能力", community: "社区", creative: "创新" },
  ko: { pressure: "성장", viability: "생활가능성", capability: "역량", community: "커뮤니티", creative: "창의성" },
  ja: { pressure: "成長", viability: "生活持続性", capability: "能力", community: "コミュニティ", creative: "創造性" },
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
  if (publishedTier === "Alpha") return t(locale, "α Alpha", "α อัลฟา", "α 阿尔法", "α 알파", "α アルファ");
  if (publishedTier === "Beta") return t(locale, "β Beta", "β เบตา", "β 贝塔", "β 베타", "β ベータ");
  if (publishedTier === "Gamma") return t(locale, "γ Gamma", "γ แกมมา", "γ 伽马", "γ 감마", "γ ガンマ");
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

const announcementCopy: Record<Locale, { added: string; removed: string }> = {
  en: { added: "added to comparison basket.", removed: "removed from comparison basket." },
  th: { added: "เพิ่มในตะกร้าเปรียบเทียบแล้ว", removed: "นำออกจากตะกร้าเปรียบเทียบแล้ว" },
  zh: { added: "已加入对比栏。", removed: "已从对比栏移除。" },
  ko: { added: "비교 바구니에 추가되었습니다.", removed: "비교 바구니에서 제거되었습니다." },
  ja: { added: "比較バスケットに追加されました。", removed: "比較バスケットから削除されました。" },
};

const PRESET_BASKETS: Array<{
  id: string;
  label: Record<Locale, string>;
  cityIds: string[];
}> = [
  {
    id: "top-alpha",
    label: {
      en: "Alpha Leaders",
      th: "ผู้นำกลุ่มอัลฟา",
      zh: "Alpha 领军城市",
      ko: "알파 선도 도시",
      ja: "アルファ主要都市",
    },
    cityIds: ["montreal", "raleigh", "eindhoven", "copenhagen", "kaohsiung"],
  },
  {
    id: "asean-thailand",
    label: {
      en: "Thailand & Singapore",
      th: "ไทยและสิงคโปร์",
      zh: "泰国与新加坡",
      ko: "태국 및 싱가포르",
      ja: "タイとシンガポール",
    },
    cityIds: ["bangkok", "singapore", "chiang-mai", "phuket", "hat-yai"],
  },
  {
    id: "east-asia",
    label: {
      en: "East Asia Tech",
      th: "เทคโนโลยีเอเชียตะวันออก",
      zh: "东亚科技城市",
      ko: "동아시아 테크 도시",
      ja: "東アジアテック都市",
    },
    cityIds: ["taipei", "kaohsiung", "tokyo", "fukuoka", "incheon"],
  },
  {
    id: "nordic-euro",
    label: {
      en: "Nordic & Europe",
      th: "นอร์ดิกและยุโรป",
      zh: "北欧与欧洲",
      ko: "북유럽 및 유럽",
      ja: "北欧とヨーロッパ",
    },
    cityIds: ["copenhagen", "gothenburg", "bergen", "eindhoven", "aarhus"],
  },
];

export default function SideBySidePage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath | string) => void;
  locale: Locale;
}) {
  const PREFERRED_DEFAULTS = ["bangkok", "raleigh", "singapore", "tokyo", "copenhagen"];
  const defaultIds = PREFERRED_DEFAULTS
    .map((id) => allCities.find((c) => c.id === id)?.id)
    .filter((id): id is string => Boolean(id));
  const fallbackIds = allCities
    .filter((c) => c.coreBoardEligible)
    .slice(0, 5 - defaultIds.length)
    .map((c) => c.id);
  const initialIds = [...defaultIds, ...fallbackIds].slice(0, 5);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCities = params.get("cities")?.split(",").map(s => s.trim().toLowerCase()) || [];
      const cityA = params.get("cityA")?.toLowerCase();
      const cityB = params.get("cityB")?.toLowerCase();
      const combined = [...urlCities, cityA, cityB].filter((id): id is string => Boolean(id));
      const valid = combined
        .map(id => allCities.find(c => c.id === id || c.id === id.replace(/^[a-z]{2}-/, ""))?.id)
        .filter((id): id is string => Boolean(id));
      if (valid.length > 0) {
        return Array.from(new Set(valid)).slice(0, 5);
      }
    }
    return initialIds;
  });

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [announcement, setAnnouncement] = useState<string>("");

  const labels = PILLAR_LABELS[locale];
  const selectedCities = selectedIds.map((id) => allCities.find((c) => c.id === id)!).filter(Boolean);
  const maxSelected = selectedIds.length >= 5;

  const handleRemove = (indexToRemove: number) => {
    const cityToRemove = allCities.find(c => c.id === selectedIds[indexToRemove]);
    if (cityToRemove) setAnnouncement(`${cityToRemove.name} ${announcementCopy[locale].removed}`);
    setSelectedIds((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleAdd = (newCityId: string) => {
    if (selectedIds.includes(newCityId)) return;
    const cityToAdd = allCities.find(c => c.id === newCityId);
    if (cityToAdd) setAnnouncement(`${cityToAdd.name} ${announcementCopy[locale].added}`);
    setSelectedIds((prev) => [...prev, newCityId]);
    setIsAdding(false);
    setSearch("");
  };

  const handleApplyPreset = (presetIds: string[]) => {
    const valid = presetIds
      .map(id => allCities.find(c => c.id === id)?.id)
      .filter((id): id is string => Boolean(id))
      .slice(0, 5);
    if (valid.length > 0) {
      setSelectedIds(valid);
      setAnnouncement(t(locale, "Loaded preset comparison basket.", "โหลดตะกร้าเปรียบเทียบสำเร็จ", "已载入预设对比组合。", "사전 설정 비교 바구니를 불러왔습니다.", "プリセット比較バスケットを読み込みました。"));
    }
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
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <main>
        <section className="section sbs-page">
          <p className="eyebrow">
            {t(locale, "SIDE BY SIDE", "เปรียบเทียบ", "城市对比", "나란히 비교", "並列比較")}
          </p>
          <h1 className="sbs-title">
            {t(locale, "Compare cities, your way.", "เปรียบเทียบเมืองในแบบของคุณ", "按你的方式比较城市", "내 방식으로 도시를 비교하세요.", "あなたの方法で都市を比較。")}
          </h1>
          <p className="sbs-subtitle">
            {t(
              locale,
              "Build a custom basket to compare cities. Published Alpha, Beta, and Gamma follow the live public tier protocol; beyond that, Greek letters continue as ten-rank comparison markers.",
              "สร้างตะกร้าเมืองที่คุณต้องการเปรียบเทียบ Alpha, Beta และ Gamma ใช้ชั้นเผยแพร่จริงของระบบ ส่วนหลังจากนั้นใช้อักษรกรีกเป็นเครื่องหมายเปรียบเทียบทุก 10 อันดับ",
              "创建自定义篮子来比较城市。Alpha、Beta、Gamma 采用实时公开分层规则；其后继续用希腊字母作为每十名的比较标记。",
              "비교할 도시 바구니를 만드세요. 알파, 베타, 감마는 실제 공개 분류 기준을 따르며, 그 이후는 10개 순위 단위로 그리스 문자를 비교 표시로 사용합니다.",
              "比較する都市バスケットを作成してください。アルファ、ベータ、ガンマはライブ公開ティアプロトコルに従い、それ以降はギリシャ文字を10ランクの比較マーカーとして使用します。",
            )}
          </p>

          <div className="sbs-basket">
            <h3 className="sbs-basket-title">{t(locale, "Your compare basket", "ตะกร้าเปรียบเทียบของคุณ", "你的比较篮子", "내 비교 바구니", "あなたの比較バスケット")}</h3>
            
            <div className="sbs-preset-bar" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.85rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-soft)", alignSelf: "center", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: "0.2rem" }}>
                {t(locale, "Presets:", "ชุดเปรียบเทียบ:", "预设组合：", "사전 설정:", "プリセット:")}
              </span>
              {PRESET_BASKETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.cityIds)}
                  className="exercise-preset-button"
                  style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", fontFamily: "var(--font-body)" }}
                >
                  {preset.label[locale]}
                </button>
              ))}
              {selectedCities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="exercise-reset-button"
                  style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", fontFamily: "var(--font-body)" }}
                >
                  {t(locale, "Clear basket", "ล้างตะกร้า", "清空篮子", "바구니 비우기", "バスケットをクリア")}
                </button>
              )}
            </div>

            <div className="sbs-basket-chips">
              {selectedCities.map((city, idx) => (
                <div key={city.id} className={`sbs-chip tier-${getTier(city)}`}>
                  <span className="sbs-chip-tier-glyph" aria-label={getTierLabel(city, locale)}>{getTierGlyph(city)}</span>
                  <span>{city.name}</span>
                  <button type="button" className="sbs-chip-remove" onClick={() => handleRemove(idx)} aria-label={t(locale, `Remove ${city.name}`, `ลบ ${city.name}`, `移除${city.name}`, `${city.name} 제거`, `${city.name}を削除`)}>&times;</button>
                </div>
              ))}
              {selectedIds.length < 5 && !isAdding && (
                <button
                  type="button"
                  className="sbs-chip-add"
                  onClick={() => setIsAdding(true)}
                  aria-label={t(locale, "Add city to comparison", "เพิ่มเมืองเพื่อเปรียบเทียบ", "添加城市进行比较", "비교에 도시 추가", "比較に都市を追加")}
                >
                  + {t(locale, "Add City", "เพิ่มเมือง", "添加城市", "도시 추가", "都市を追加")}
                </button>
              )}
              {maxSelected && (
                <span className="sbs-chip-limit" role="status">
                  {t(locale, "5/5 selected. Remove one to add another.", "เลือกครบ 5/5 แล้ว ลบหนึ่งเมืองเพื่อเพิ่มเมืองอื่น", "已选 5/5。移除一座城市后可再添加。", "최대 5개 도시에 도달했습니다. 하나를 제거하면 다른 도시를 추가할 수 있습니다.", "5都市の上限に達しました。一つ削除すると追加できます。")}
                </span>
              )}
            </div>

            {isAdding && (
              <div className="sbs-picker">
                <input
                  className="sbs-search"
                  type="text"
                  placeholder={t(locale, "Search city...", "ค้นหาเมือง...", "搜索城市...", "도시 검색...", "都市を検索...")}
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
                {t(locale, "EMPTY BASKET", "ตะกร้าว่าง", "篮子为空", "빈 바구니", "空のバスケット")}
              </p>
              <p className="sbs-empty-title">
                {t(
                  locale,
                  "Pick a city to start the comparison.",
                  "เลือกเมืองเพื่อเริ่มเปรียบเทียบ",
                  "选择一座城市开始比较。",
                  "비교를 시작하려면 도시를 선택하세요.",
                  "比較を開始するには都市を選択してください。",
                )}
              </p>
              <p className="sbs-empty-body">
                {t(
                  locale,
                  "Add up to five cities. Each column carries the five SLIC pillars, tier band, and resident-facing context side by side.",
                  "เพิ่มได้สูงสุดห้าเมือง แต่ละคอลัมน์จะแสดงทั้งห้าเสา คะแนนชั้น และบริบทสำหรับผู้อยู่อาศัยเคียงข้างกัน",
                  "最多可添加五座城市。每列并排呈现五大支柱、层级与本地生活背景。",
                  "최대 5개 도시를 추가하세요. 각 열에는 5개의 SLIC 기둥, 등급 구간 및 주민 관점 맥락이 나란히 표시됩니다.",
                  "最大5都市を追加できます。各列には5つのSLICの柱、ティアバンド、住民向けコンテキストが並んで表示されます。",
                )}
              </p>
            </div>
          )}
          <div className="sbs-grid" style={{ gridTemplateColumns: `repeat(${selectedCities.length}, 1fr)` }}>
            {selectedCities.map((city) => (
              <div className={`sbs-column tier-border-${getTier(city)}`} key={city.id}>
                <div className="sbs-city-header">
                  <a
                    href={appHref(`/city/${city.id}`)}
                    onClick={(e) => {
                      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      onNavigate(`/city/${city.id}`);
                    }}
                    className="sbs-city-name-btn"
                    style={{ cursor: "pointer", textDecoration: "none" }}
                    title={t(locale, `View full ${city.name} scorecard`, `ดูสรุปคะแนน ${city.name} ทั้งหมด`, `查看 ${city.name} 完整评分卡`, `${city.name} 전체 스코어카드 보기`, `${city.name}の完全なスコアカードを表示`)}
                  >
                    {city.name} ↗
                  </a>
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
                     <span>{t(locale, "Type", "ประเภท", "类型", "유형", "タイプ")}</span>
                     <strong>
                       {city.cityType === "primary"
                         ? t(locale, "Primary", "เมืองหลัก", "主城市", "주요 도시", "主要都市")
                         : t(locale, "Secondary", "เมืองรอง", "次级城市", "보조 도시", "副都市")}
                     </strong>
                   </div>
                   <div className="sbs-context-item">
                     <span>{t(locale, "Region", "ภูมิภาค", "区域", "지역", "地域")}</span>
                     <strong>{city.region}</strong>
                   </div>
                   {city.metrics?.pppIncomePerHead && (
                     <div className="sbs-context-item">
                       <span>{t(locale, "Income (PPP)", "รายได้ (PPP)", "收入（PPP）", "소득 (PPP)", "所得（PPP）")}</span>
                       <strong>${Math.round(city.metrics.pppIncomePerHead).toLocaleString(localeNumberFormat[locale])}</strong>
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
