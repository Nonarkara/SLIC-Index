import type { DetailedMethodologyPillar } from "./types";

const segmentClasses = [
  "weight-segment weight-segment-pressure",
  "weight-segment weight-segment-viability",
  "weight-segment weight-segment-capability",
  "weight-segment weight-segment-community",
  "weight-segment weight-segment-creative",
];

export default function PillarWeightChart({
  pillars,
  compact = false,
  shareLabel = "of official score",
}: {
  pillars: DetailedMethodologyPillar[];
  compact?: boolean;
  shareLabel?: string;
}) {
  return (
    <div className={compact ? "weight-chart weight-chart-compact" : "weight-chart"}>
      <div className="weight-spectrum" aria-label="Official SLIC pillar weights">
        {pillars.map((pillar, index) => (
          <div
            className={segmentClasses[index] ?? "weight-segment"}
            key={pillar.id}
            style={{ width: `${pillar.weight}%` }}
          >
            <span>{pillar.weight}%</span>
          </div>
        ))}
      </div>

      <div className="weight-legend">
        {pillars.map((pillar, index) => (
          <article className="weight-legend-row" key={pillar.id}>
            <span className={segmentClasses[index] ?? "weight-segment"} aria-hidden="true" />
            <div>
              <strong>{pillar.name}</strong>
              <small>
                {pillar.weight}% {shareLabel}
              </small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
