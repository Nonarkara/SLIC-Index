import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import land110m from "world-atlas/land-110m.json";
import publishedData from "./data/publishedRankingData.json";
import { CITY_COORDINATES } from "./data/cityCoordinates";
import { t } from "./i18n";
import { appHref } from "./routing";
import SiteFooter from "./SiteFooter";
import type { Locale, SitePath } from "./types";

interface PublishedCity {
  cityId: string;
  displayName: string;
  country: string;
  region: string;
  slicScore: number | null;
  rank: number;
  rankingStatus: string;
  coverageGrade: string;
}

const VIEW_W = 1200;
const VIEW_H = 600;


function navigateLink(
  event: React.MouseEvent<HTMLAnchorElement | SVGCircleElement>,
  onNavigate: (path: SitePath) => void,
  path: SitePath | string,
) {
  event.preventDefault();
  event.stopPropagation();
  onNavigate(path as SitePath);
}

/** Amber → teal colour ramp driven by SLIC score 0..100. */
function scoreColor(score: number | null): string {
  if (score == null) return "#9a9088";
  // Palette: low = warm rust, mid = amber, high = teal-green.
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped >= 65) return "#1a6b5a";     // teal (strong)
  if (clamped >= 55) return "#3a7a6a";     // teal-muted
  if (clamped >= 45) return "#b85c28";     // amber (mid)
  if (clamped >= 35) return "#a0382a";     // warm rust
  return "#8c4a2a";                         // deep brown (low)
}

/** Dot size by SLIC score — slightly larger for higher ranks so top cities are legible. */
function dotRadius(score: number | null): number {
  if (score == null) return 3;
  if (score >= 60) return 6;
  if (score >= 50) return 5;
  if (score >= 40) return 4.2;
  return 3.5;
}

const mapCopy = {
  grade:     { en: "Grade",     th: "เกรด",          zh: "覆盖",   ko: "등급",      ja: "グレード"       },
  watchlist: { en: "Watchlist", th: "รายชื่อเฝ้าระวัง", zh: "观察名单", ko: "관찰 목록", ja: "ウォッチリスト" },
};

export default function MapPage({
  onNavigate,
  locale,
}: {
  onNavigate: (path: SitePath) => void;
  locale: Locale;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Project geometry once
  const { landPath, cityPoints } = useMemo(() => {
    const projection = geoNaturalEarth1()
      .fitExtent([[10, 10], [VIEW_W - 10, VIEW_H - 10]], {
        type: "Sphere",
      });
    const path = geoPath(projection);

    const topology = land110m as unknown as Topology;
    const land = feature(topology, topology.objects.land as GeometryCollection) as FeatureCollection;
    const landPath = path(land) ?? "";

    // Every published city — ranked ones get scored colour, Watchlist gets a
    // neutral grey dot so the map shows the full dataset honestly.
    const cities = (publishedData.cities as PublishedCity[])
      .map((c) => {
        const coord = CITY_COORDINATES[c.cityId];
        if (!coord) return null;
        const [lat, lng] = coord;
        const pt = projection([lng, lat]);
        if (!pt) return null;
        return { ...c, x: pt[0], y: pt[1] };
      })
      .filter((c): c is PublishedCity & { x: number; y: number } => c !== null);

    return { landPath, cityPoints: cities };
  }, []);

  const hovered = useMemo(() => cityPoints.find((c) => c.cityId === hoveredId) ?? null, [cityPoints, hoveredId]);

  const cityCount = cityPoints.length;
  const rankedCount = cityPoints.filter((city) => city.rankingStatus === "Ranked").length;

  return (
    <>
      <section className="map-page section">
        <p className="eyebrow">{t(locale, "GLOBAL MAP", "แผนที่โลก", "全球地图", "SLIC 글로벌 지도", "SLICグローバルマップ")}</p>
        <h1 className="map-title">
          {t(
            locale,
            `${cityCount} cities. One fixed instrument.`,
            `${cityCount} เมือง. เครื่องมือวัดเดียว.`,
            `${cityCount} 座城市。一套固定的量尺。`,
            `${cityCount}개 도시. 하나의 고정 지표.`,
            `${cityCount}都市。一つの固定された指標。`,
          )}
        </h1>
        <p className="map-subtitle">
          {t(
            locale,
            "Every SLIC city placed on the globe, coloured by its overall score. Hover a dot for the name and rank; click to open its scorecard.",
            "ทุกเมืองของ SLIC บนแผนที่โลก สีตามคะแนนรวม เอาเมาส์ชี้เพื่อดูชื่อและอันดับ คลิกเพื่อเปิดสรุปคะแนน",
            "SLIC 的每座城市都标注在地图上，颜色对应总分。悬停显示名称与排名，点击打开评分卡。",
            "모든 SLIC 도시가 지구상에 표시되며 전체 점수에 따라 색이 구분됩니다. 점에 마우스를 올리면 이름과 순위가, 클릭하면 성적표가 열립니다.",
            "すべてのSLIC都市が地球上に配置され、総合スコアで色分けされています。ドットにカーソルを合わせると名前とランクが、クリックするとスコアカードが開きます。",
          )}
        </p>

        <div className="map-wrapper">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="img"
            aria-label={t(locale, "World map of SLIC cities", "แผนที่โลกของเมือง SLIC", "SLIC 城市世界地图", "SLIC 도시 세계 지도", "SLIC都市の世界地図")}
            className="map-svg"
          >
            {/* Graticule feel: soft background */}
            <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="none" />

            {/* Land mass */}
            <path
              d={landPath}
              fill="#efe9df"
              stroke="#d8d0c8"
              strokeWidth={0.4}
            />

            {/* City dots — ranked cities first (coloured), then Watchlist on top as neutral */}
            <g className="map-dots">
              {cityPoints.map((c) => {
                const isHovered = c.cityId === hoveredId;
                const isRanked = c.rankingStatus === "Ranked";
                const r = isRanked ? dotRadius(c.slicScore) : 2.5;
                const fill = isRanked ? scoreColor(c.slicScore) : "#b8ada0";
                const tooltip = isRanked
                  ? `${c.displayName}, ${c.country} — Rank #${c.rank} (SLIC ${c.slicScore?.toFixed(1)})`
                  : `${c.displayName}, ${c.country} — ${t(locale, "Watchlist (coverage below publish threshold)", "รายการเฝ้าระวัง (ข้อมูลต่ำกว่าเกณฑ์เผยแพร่)", "观察名单（覆盖率低于发布门槛）", "관찰 목록 (게재 기준 미달)", "観察リスト（公開基準を下回るカバレッジ）")}`;
                return (
                  <a
                    key={c.cityId}
                    href={appHref(`/city/${c.cityId}`)}
                    onClick={(e) => navigateLink(e, onNavigate, `/city/${c.cityId}`)}
                    onMouseEnter={() => setHoveredId(c.cityId)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(c.cityId)}
                    onBlur={() => setHoveredId(null)}
                  >
                    {isHovered && isRanked && (
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={r + 5}
                        fill={fill}
                        fillOpacity={0.18}
                      />
                    )}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={r}
                      fill={fill}
                      fillOpacity={isHovered ? 1 : (isRanked ? 0.88 : 0.55)}
                      stroke="#ffffff"
                      strokeWidth={isRanked ? 0.8 : 0.5}
                      style={{ cursor: "pointer", transition: "r 0.12s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <title>{tooltip}</title>
                    </circle>
                  </a>
                );
              })}
            </g>

            {/* Hovered city label */}
            {hovered && (
              <g className="map-hover-label" pointerEvents="none">
                <text
                  x={hovered.x + 10}
                  y={hovered.y - 10}
                  fontFamily="'Libre Baskerville', Georgia, serif"
                  fontSize={13}
                  fontWeight={700}
                  fill="#1c1914"
                >
                  {hovered.displayName}
                </text>
                <text
                  x={hovered.x + 10}
                  y={hovered.y + 6}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize={10}
                  fill="#6b6459"
                >
                  {hovered.rankingStatus === "Ranked"
                    ? `#${hovered.rank} · SLIC ${hovered.slicScore?.toFixed(1)} · ${mapCopy.grade[locale]} ${hovered.coverageGrade}`
                    : `${mapCopy.watchlist[locale]} · ${mapCopy.grade[locale]} ${hovered.coverageGrade}`}
                </text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="map-legend">
            <span className="map-legend-label">
              {t(locale, "SLIC score", "คะแนน SLIC", "SLIC 分数", "SLIC 점수", "SLICスコア")}
            </span>
            <div className="map-legend-scale">
              <span><i style={{ background: "#8c4a2a" }} /> &lt;35</span>
              <span><i style={{ background: "#a0382a" }} /> 35–45</span>
              <span><i style={{ background: "#b85c28" }} /> 45–55</span>
              <span><i style={{ background: "#3a7a6a" }} /> 55–65</span>
              <span><i style={{ background: "#1a6b5a" }} /> ≥65</span>
              <span><i style={{ background: "#b8ada0" }} /> {t(locale, "Watchlist", "เฝ้าระวัง", "观察名单", "관찰 목록", "観察リスト")}</span>
            </div>
          </div>
        </div>

        <div className="map-footer-note">
          <p>
            {t(
              locale,
              `${rankedCount} ranked cities shown. The map is not an equal-opportunity sample: SLIC's current coverage leans to Asia-Pacific and Europe, with recent additions of London, New York, and Tokyo as global reference cities. See the`,
              `เมืองที่ติดอันดับ ${rankedCount} แห่ง แผนที่ไม่ใช่กลุ่มตัวอย่างที่เท่าเทียม SLIC เน้นเอเชีย-แปซิฟิกและยุโรป โดยเพิ่ม London, New York, Tokyo เป็นเมืองอ้างอิงระดับโลกไม่นานมานี้ ดูเพิ่มที่`,
              `显示 ${rankedCount} 座已排名城市。地图不是等机会样本：SLIC 当前覆盖偏向亚太与欧洲，最近新增 London、New York、Tokyo 作为全球参考城市。详见`,
              `${rankedCount}개의 순위 지정 도시가 표시됩니다. 지도는 균등한 표본이 아닙니다. SLIC의 현재 커버리지는 아시아태평양과 유럽에 치우쳐 있으며, 최근 런던, 뉴욕, 도쿄가 글로벌 참조 도시로 추가되었습니다.`,
              `${rankedCount}都市がランク付きで表示されています。地図は均等なサンプルではありません。SLICの現在のカバレッジはアジア太平洋とヨーロッパに偏っており、最近ロンドン、ニューヨーク、東京がグローバル参照都市として追加されました。`,
            )}{" "}
            <a
              href={appHref("/methodology")}
              onClick={(e) => navigateLink(e, onNavigate, "/methodology")}
            >
              {t(locale, "methodology", "ระเบียบวิธี", "方法论", "방법론", "方法論")}
            </a>
            .
          </p>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} locale={locale} />
    </>
  );
}
