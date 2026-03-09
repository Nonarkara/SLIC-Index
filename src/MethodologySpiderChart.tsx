import type { Locale } from "./types";

interface SpiderDatum {
  label: string;
  value: number;
}

function polarPoint(centerX: number, centerY: number, radius: number, angle: number) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

function polygonPath(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export default function MethodologySpiderChart({
  title,
  subtitle,
  data,
  locale,
}: {
  title: string;
  subtitle: string;
  data: SpiderDatum[];
  locale: Locale;
}) {
  const centerX = 170;
  const centerY = 160;
  const maxRadius = 112;
  const levels = [0.2, 0.4, 0.6, 0.8, 1];
  const angles = data.map((_, index) => -Math.PI / 2 + (index * Math.PI * 2) / data.length);

  const levelPolygons = levels.map((level) =>
    polygonPath(
      angles.map((angle) => polarPoint(centerX, centerY, maxRadius * level, angle)),
    ),
  );

  const dataPolygon = polygonPath(
    data.map((datum, index) =>
      polarPoint(centerX, centerY, maxRadius * (datum.value / 100), angles[index]),
    ),
  );

  const levelLabels = locale === "th"
    ? ["20", "40", "60", "80", "100"]
    : locale === "zh"
      ? ["20", "40", "60", "80", "100"]
      : ["20", "40", "60", "80", "100"];

  return (
    <article className="paper-card methodology-balance-card">
      <p className="panel-label">{title}</p>
      <p className="methodology-balance-summary">{subtitle}</p>

      <div className="methodology-spider-shell">
        <svg
          className="methodology-spider"
          viewBox="0 0 340 320"
          role="img"
          aria-label={title}
        >
          {levelPolygons.map((points, index) => (
            <polygon
              className="spider-grid"
              key={`grid-${levelLabels[index]}`}
              points={points}
            />
          ))}

          {angles.map((angle, index) => {
            const edge = polarPoint(centerX, centerY, maxRadius, angle);
            return (
              <line
                className="spider-axis"
                key={`axis-${data[index].label}`}
                x1={centerX}
                y1={centerY}
                x2={edge.x}
                y2={edge.y}
              />
            );
          })}

          <polygon className="spider-data-area" points={dataPolygon} />
          <polygon className="spider-data-line" points={dataPolygon} />

          {data.map((datum, index) => {
            const point = polarPoint(centerX, centerY, maxRadius * (datum.value / 100), angles[index]);
            const labelPoint = polarPoint(centerX, centerY, maxRadius + 30, angles[index]);
            return (
              <g key={datum.label}>
                <circle className="spider-point" cx={point.x} cy={point.y} r="4.5" />
                <text className="spider-label" x={labelPoint.x} y={labelPoint.y}>
                  {datum.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="spider-legend">
        {data.map((datum) => (
          <div className="spider-legend-row" key={datum.label}>
            <span>{datum.label}</span>
            <strong>{datum.value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}
