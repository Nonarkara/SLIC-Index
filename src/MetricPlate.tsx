/**
 * The metric plate.
 *
 * A scorecard used to show twenty-two numbers as twenty-two rows of text:
 * a label, a figure, a coloured bar, a citation, then the same metric again
 * in a grid of boxes higher up the page. The reader scrolled twice to learn
 * the same thing, and learned nothing about *why* a number was the number
 * it was.
 *
 * A plate is a part in a parts list. It carries a drawing of what is being
 * measured, the raw value, the value's position on the published P05–P95
 * band, the 0–100 score that position produces, and the metric's weight in
 * its pillar. The band is the method, drawn: the normalisation is
 *
 *     score = 100 x (raw - P05) / (P95 - P05)        for "positive" metrics
 *     score = 100 x (P95 - raw) / (P95 - P05)        for "negative" ones
 *
 * so the marker on the band *is* the score, mirrored for the metrics where
 * lower is better. Nothing here is decoration; the arrow at the better end
 * of the band is the metric's direction of goodness.
 *
 * The component takes plain values so it stays independent of the scorecard
 * page's copy tables: this file knows how to draw, not what to say.
 */

import type { CSSProperties, ReactNode } from "react";
import MetricMark from "./MetricMarks";

export interface MetricBandAnchors {
  p05: number | null;
  p95: number | null;
  dir: "positive" | "negative";
}

interface MetricPlateProps {
  metricKey: string;
  label: string;
  /** The raw value as a number, or null when the metric has no value. */
  raw: number | null;
  /** The raw value pre-formatted with its unit. */
  valueText: string | null;
  score: number | null;
  anchors: MetricBandAnchors | null;
  color: string;
  /** The metric's weight inside its pillar, as a percentage. */
  weight: number;
  /** Short provenance tag: city, national, derived, composite, missing. */
  levelTag: string;
  source: string | null;
  sourceUrl: string | null;
  /** Extra disclosure rendered under the plate (formulas, component lists). */
  children?: ReactNode;
}

function formatBandNumber(value: number) {
  if (value >= 1000) return Math.round(value).toLocaleString("en-US");
  if (value >= 100) return String(Math.round(value));
  return String(Math.round(value * 100) / 100);
}

function MetricBand({
  raw,
  anchors,
  color,
}: {
  raw: number;
  anchors: MetricBandAnchors;
  color: string;
}) {
  const { p05, p95, dir } = anchors;
  if (p05 === null || p95 === null || p95 === p05) return null;

  const fraction = Math.min(1, Math.max(0, (raw - p05) / (p95 - p05)));
  const betterAtStart = dir === "negative";

  return (
    <span
      className={`metric-band${betterAtStart ? " metric-band--better-start" : " metric-band--better-end"}`}
      aria-hidden="true"
    >
      <span className="metric-band-rule" />
      <span className="metric-band-tick metric-band-tick--start" />
      <span className="metric-band-tick metric-band-tick--end" />
      <span
        className="metric-band-marker"
        style={{ left: `${(fraction * 100).toFixed(2)}%`, background: color }}
      />
      <span className="metric-band-anchor metric-band-anchor--start">{formatBandNumber(p05)}</span>
      <span className="metric-band-anchor metric-band-anchor--end">{formatBandNumber(p95)}</span>
    </span>
  );
}

export default function MetricPlate({
  metricKey,
  label,
  raw,
  valueText,
  score,
  anchors,
  color,
  weight,
  levelTag,
  source,
  sourceUrl,
  children,
}: MetricPlateProps) {
  const bandAvailable =
    raw !== null && anchors !== null && anchors.p05 !== null && anchors.p95 !== null && anchors.p95 !== anchors.p05;

  return (
    <figure className="metric-plate" data-metric={metricKey}>
      <span className="metric-plate-mark" style={{ "--pillar": color } as CSSProperties}>
        <MetricMark metricKey={metricKey} />
      </span>
      <div className="metric-plate-main">
        <div className="metric-plate-head">
          {sourceUrl ? (
            <a
              className="metric-plate-name"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={source ?? undefined}
            >
              {label}
            </a>
          ) : (
            <span className="metric-plate-name" title={source ?? undefined}>
              {label}
            </span>
          )}
          <span className="metric-plate-level">{levelTag}</span>
          <span className="metric-plate-score" style={{ color }}>
            {score === null ? "—" : score.toFixed(1)}
          </span>
        </div>
        <div className="metric-plate-read">
          <span className="metric-plate-value">{valueText ?? "—"}</span>
          {bandAvailable && (
            <MetricBand raw={raw as number} anchors={anchors as MetricBandAnchors} color={color} />
          )}
          <span
            className="metric-plate-weight"
            title={`Weight inside its pillar: ${weight} points`}
          >
            ×{weight}
          </span>
        </div>
        {children}
      </div>
    </figure>
  );
}
