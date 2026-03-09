function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function RankingTrendMiniChart({
  points,
}: {
  points?: number[];
}) {
  const series = points && points.length > 1 ? points : [42, 48, 46, 55, 58, 61, 64, 69];
  const width = 220;
  const height = 84;
  const step = width / Math.max(series.length - 1, 1);

  const coordinates = series.map((value, index) => {
    const normalized = clamp(value, 0, 100);
    return {
      x: Number((index * step).toFixed(2)),
      y: Number((height - (normalized / 100) * (height - 10) - 5).toFixed(2)),
    };
  });

  const line = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const finalPoint = coordinates[coordinates.length - 1];

  return (
    <div className="ranking-trend-mini-chart" aria-hidden="true">
      <svg viewBox={`0 0 ${width} ${height}`} role="presentation">
        <path className="ranking-trend-area" d={area} />
        <path className="ranking-trend-line" d={line} />
        <circle className="ranking-trend-point" cx={finalPoint.x} cy={finalPoint.y} r="4.5" />
      </svg>
    </div>
  );
}
