import { useMemo, useState } from "react";
import publishedData from "./data/publishedRankingData.json";
import type { Locale, SitePath } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_ORDER } from "./pillarConfig";
import { getCopy } from "./siteCopy";
import SiteFooter from "./SiteFooter";

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  cityType: string;
  pressureScore: number;
  viabilityScore: number;
  capabilityScore: number;
  communityScore: number;
  creativeScore: number;
  slicScore: number;
  rank: number;
  rankingStatus: string;
  qualitative?: {
    economyAndState: string;
    funFact: string;
    tags: string[];
  };
}

const allCities = (publishedData.cities ?? []) as PublishedCity[];
const rankedCities = allCities.filter((c) => c.rankingStatus === "Ranked").sort((a, b) => b.slicScore - a.slicScore);

const alphaCities = rankedCities.slice(0, 10);
const betaCities = rankedCities.slice(10, 50);
const gammaCities = rankedCities.slice(50);

export default function CompareCitiesPage({ locale, onNavigate }: { locale: Locale, onNavigate: (path: SitePath) => void }) {
  const copy = getCopy(locale);
  const ui = copy.compareCities;
  const labels = PILLAR_LABELS[locale];

  const defaultTop5 = rankedCities.slice(0, 5).map(c => c.cityId);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultTop5);
  
  const selectedCities = useMemo(() => {
    return selectedIds.map(id => rankedCities.find(c => c.cityId === id)).filter(Boolean) as PublishedCity[];
  }, [selectedIds]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
        // Remove if already selected
        setSelectedIds(prev => prev.filter(c => c !== id));
        return;
    }
    setSelectedIds(prev => {
        const next = [...prev, id];
        if (next.length > 5) return next.slice(1);
        return next;
    });
  };

  const clearAll = () => setSelectedIds([]);
  const resetDefault = () => setSelectedIds(defaultTop5);

  return (
    <>
      <header className="compare-hero section">
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h1 className="rankings-title">{ui.title}</h1>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
             <button type="button" className="v3-cta" style={{ background: "rgba(255,255,255,0.1)", color: "var(--text)" }} onClick={clearAll}>
                {ui.clearAll}
             </button>
             <button type="button" className="v3-cta" onClick={resetDefault}>
                {ui.resetDefault}
             </button>
          </div>
        </div>
      </header>

      <main className="section" style={{ paddingBottom: "6rem" }}>
        {/* Comparator Matrix View */}
        <div className="comparator-matrix" style={{ marginTop: "2rem", overflowX: "auto" }}>
            <table className="v3-comparator-table" style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th style={{ width: "200px", padding: "16px", borderBottom: "1px solid var(--border-strong)" }}></th>
                        {/* Render slots */}
                        {[0, 1, 2, 3, 4].map(idx => {
                            const city = selectedCities[idx];
                            return (
                                <th key={idx} style={{ width: "calc((100% - 200px) / 5)", padding: "16px", borderBottom: "1px solid var(--border-strong)", verticalAlign: "bottom" }}>
                                    {city ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                                <span style={{ fontSize: "1.5rem", fontFamily: "var(--font-heading)", lineHeight: 1.1 }}>{city.displayName}</span>
                                                <button type="button" onClick={() => handleSelect(city.cityId)} style={{ opacity: 0.5, cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: "1.2rem" }}>&times;</button>
                                            </div>
                                            <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>{city.country}</span>
                                        </div>
                                    ) : (
                                        <div style={{ opacity: 0.3, fontSize: "0.9rem", border: "1px dashed var(--border-strong)", padding: "20px 10px", textAlign: "center", borderRadius: "8px" }}>
                                            {ui.selectCity}
                                        </div>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* Overall Rank */}
                    <tr style={{ height: "80px" }}>
                        <td style={{ padding: "20px 16px", fontWeight: "bold", borderBottom: "1px solid var(--border)" }}>{ui.globalRank}</td>
                        {[0, 1, 2, 3, 4].map(idx => (
                            <td key={idx} style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", borderLeft: "1px solid rgba(255,255,255,0.02)" }}>
                                {selectedCities[idx] ? <span style={{ fontSize: "1.75rem", fontFamily: "var(--font-mono)", fontWeight: 700 }}>#{selectedCities[idx].rank}</span> : "-"}
                            </td>
                        ))}
                    </tr>
                    
                    {/* SLIC Score */}
                    <tr>
                        <td style={{ padding: "20px 16px", fontWeight: "bold", borderBottom: "1px solid var(--border)" }}>{ui.slicScore}</td>
                        {[0, 1, 2, 3, 4].map(idx => (
                            <td key={idx} style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", borderLeft: "1px solid rgba(255,255,255,0.02)" }}>
                                {selectedCities[idx] ? <span style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.8)" }}>{selectedCities[idx].slicScore.toFixed(1)}</span> : "-"}
                            </td>
                        ))}
                    </tr>

                    {/* Pillars */}
                    {PILLAR_ORDER.map(pid => (
                        <tr key={pid}>
                            <td style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: PILLAR_COLORS[pid] }} />
                                    {labels[pid]}
                                </div>
                            </td>
                            {[0, 1, 2, 3, 4].map(idx => {
                                const city = selectedCities[idx];
                                const score = city ? city[`${pid}Score` as keyof PublishedCity] as number : null;
                                return (
                                    <td key={idx} style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", borderLeft: "1px solid rgba(255,255,255,0.02)" }}>
                                        {score !== null ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <span style={{ fontFamily: "var(--font-mono)", width: "32px" }}>{Math.round(score)}</span>
                                                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                                                    <div style={{ height: "100%", width: `${score}%`, background: PILLAR_COLORS[pid], borderRadius: 2 }} />
                                                </div>
                                            </div>
                                        ) : "-"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    {/* Qualitative Insights */}
                    <tr>
                         <td style={{ padding: "20px 16px", fontWeight: "bold", verticalAlign: "top", paddingTop: "32px" }}>{ui.localVibe}</td>
                         {[0, 1, 2, 3, 4].map(idx => {
                             const city = selectedCities[idx];
                             return (
                                 <td key={idx} style={{ padding: "20px 16px", borderLeft: "1px solid rgba(255,255,255,0.02)", verticalAlign: "top", paddingTop: "32px" }}>
                                     {city && city.qualitative ? (
                                         <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {city.qualitative.tags.map((t, i) => <span key={i} style={{ fontSize: "10px", padding: "4px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", whiteSpace: "nowrap" }}>{t}</span>)}
                                         </div>
                                     ) : "-"}
                                 </td>
                             )
                         })}
                    </tr>
                    <tr>
                         <td style={{ padding: "20px 16px", fontWeight: "bold", verticalAlign: "top" }}>{ui.economicContext}</td>
                         {[0, 1, 2, 3, 4].map(idx => {
                             const city = selectedCities[idx];
                             return (
                                 <td key={idx} style={{ padding: "20px 16px", borderLeft: "1px solid rgba(255,255,255,0.02)", verticalAlign: "top" }}>
                                     {city && city.qualitative ? (
                                         <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5, opacity: 0.8 }}>{city.qualitative.economyAndState}</p>
                                     ) : "-"}
                                 </td>
                             )
                         })}
                    </tr>
                </tbody>
            </table>
        </div>

        {/* City Selector Columns */}
        <div style={{ marginTop: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
                {ui.selectPrompt}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "2rem" }}>
                {/* Alpha */}
                <div>
                   <h3 style={{ fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: "1rem" }}>Alpha <span style={{ opacity: 0.5, marginLeft: 8 }}>1–10</span></h3>
                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                       {alphaCities.map(c => {
                           const isSelected = selectedIds.includes(c.cityId);
                           return (
                               <button 
                                   key={c.cityId} 
                                   onClick={() => handleSelect(c.cityId)} 
                                   style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: isSelected ? "var(--accent)" : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: isSelected ? "var(--accent)" : "transparent", borderRadius: "6px", cursor: "pointer", color: isSelected ? "#000" : "inherit", transition: "all 0.2s" }}
                               >
                                   <span style={{ fontWeight: 600 }}>{c.displayName}</span>
                                   <span style={{ fontFamily: "var(--font-mono)", opacity: isSelected ? 0.8 : 0.4 }}>#{c.rank}</span>
                               </button>
                           )
                       })}
                   </div>
                </div>
                {/* Beta */}
                <div>
                   <h3 style={{ fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: "1rem" }}>Beta <span style={{ opacity: 0.5, marginLeft: 8 }}>11–50</span></h3>
                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
                       {betaCities.map(c => {
                           const isSelected = selectedIds.includes(c.cityId);
                           return (
                               <button 
                                   key={c.cityId} 
                                   onClick={() => handleSelect(c.cityId)} 
                                   style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: isSelected ? "var(--accent)" : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: isSelected ? "var(--accent)" : "transparent", borderRadius: "6px", cursor: "pointer", color: isSelected ? "#000" : "inherit", transition: "all 0.2s" }}
                               >
                                   <span style={{ fontWeight: 600 }}>{c.displayName}</span>
                                   <span style={{ fontFamily: "var(--font-mono)", opacity: isSelected ? 0.8 : 0.4 }}>#{c.rank}</span>
                               </button>
                           )
                       })}
                   </div>
                </div>
                {/* Gamma */}
                <div>
                   <h3 style={{ fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: "1rem" }}>Gamma <span style={{ opacity: 0.5, marginLeft: 8 }}>51+</span></h3>
                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
                       {gammaCities.map(c => {
                           const isSelected = selectedIds.includes(c.cityId);
                           return (
                               <button 
                                   key={c.cityId} 
                                   onClick={() => handleSelect(c.cityId)} 
                                   style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: isSelected ? "var(--accent)" : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: isSelected ? "var(--accent)" : "transparent", borderRadius: "6px", cursor: "pointer", color: isSelected ? "#000" : "inherit", transition: "all 0.2s" }}
                               >
                                   <span style={{ fontWeight: 600 }}>{c.displayName}</span>
                                   <span style={{ fontFamily: "var(--font-mono)", opacity: isSelected ? 0.8 : 0.4 }}>#{c.rank}</span>
                               </button>
                           )
                       })}
                   </div>
                </div>
            </div>
        </div>
      </main>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
