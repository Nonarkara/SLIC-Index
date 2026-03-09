function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function fallbackLabel(index: number): string {
  return `S${String(index + 1).padStart(2, "0")}`;
}

export default function PulseCluster({
  values,
  labels,
  className = "",
}: {
  values: number[];
  labels?: string[];
  className?: string;
}) {
  const safeValues = values.length > 0 ? values : [48, 60, 74, 66, 82, 58, 71, 64];

  return (
    <div className={`pulse-cluster ${className}`.trim()} aria-hidden="true">
      {safeValues.map((value, index) => {
        const normalized = clamp(value, 0, 100);
        const label = labels?.[index] ?? fallbackLabel(index);

        return (
          <article className="pulse-cell" key={`${label}-${index}`}>
            <div className="pulse-cell-head">
              <span>{label}</span>
              <strong>{normalized}</strong>
            </div>
            <div className="pulse-cell-track">
              <div className="pulse-cell-fill" style={{ width: `${normalized}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
