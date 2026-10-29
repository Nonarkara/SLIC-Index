import type { CSSProperties } from "react";

export interface TracePillar {
  id: string;
  score: number | null;
  weight: number;
  color: string;
  label: string;
}

export interface ScoreTraceProps {
  pillars: TracePillar[];
  mean?: number | null;
  ampi?: number | null;
  penalty?: number | null;
  published?: number | null;
  labels: { mean: string; imbalance: string; coverage: string };
}

export default function ScoreTraceEquation({ pillars, mean, ampi, penalty = 0, published, labels }: ScoreTraceProps) {
  const observed = pillars.filter(p => p.score != null && Number.isFinite(p.score));
  const observedWeight = observed.reduce((sum, p) => sum + p.weight, 0) / 100;
  const renormalized = observedWeight > 0 && observedWeight < 1;
  const floor = ampi != null && ampi - (penalty ?? 0) < 0;
  return (
    <div className="scorecard-equation-bar">
      {renormalized && <span className="scorecard-equation-op">(</span>}
      {observed.map((p, i) => (
        <span key={p.id} className="scorecard-equation-term">
          {i > 0 && <span className="scorecard-equation-op">+</span>}
          <span className="scorecard-equation-weight">{(p.weight / 100).toFixed(2)}</span>
          <span className="scorecard-equation-times">×</span>
          <span className="scorecard-equation-pillar" style={{ "--pillar": p.color } as CSSProperties}>
            {p.label}({p.score?.toFixed(1)})
          </span>
        </span>
      ))}
      {renormalized && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">) /</span>
          <span className="scorecard-equation-denominator">{observedWeight.toFixed(2)}</span>
        </span>
      )}
      {mean != null && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">=</span>
          <span className="scorecard-equation-result scorecard-equation-result--mean" title={labels.mean}>
            {mean.toFixed(2)}
          </span>
        </span>
      )}
      {mean != null && ampi != null && mean - ampi > 0 && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">−</span>
          <span className="scorecard-equation-deduction">
            <span className="scorecard-equation-deduction-label">{labels.imbalance}</span>
            {(mean - ampi).toFixed(2)}
          </span>
        </span>
      )}
      {mean != null && (penalty ?? 0) > 0 && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">−</span>
          <span className="scorecard-equation-deduction">
            <span className="scorecard-equation-deduction-label">{labels.coverage}</span>
            {penalty}
          </span>
        </span>
      )}
      {floor && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">→</span>
          <span className="scorecard-equation-floor">max(0, {(ampi - (penalty ?? 0)).toFixed(2)})</span>
        </span>
      )}
      {published != null && (
        <span className="scorecard-equation-step">
          <span className="scorecard-equation-op">{mean != null && ampi != null ? "=" : "→"}</span>
          <span className="scorecard-equation-result scorecard-equation-result--published">{published.toFixed(1)}</span>
        </span>
      )}
    </div>
  );
}
