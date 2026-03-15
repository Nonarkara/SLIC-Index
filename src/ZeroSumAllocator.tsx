import { useCallback, useRef, useState } from "react";
import type { CSSProperties, FC, PointerEvent as ReactPointerEvent } from "react";

export interface PillarAllocation {
  id: string;
  label: string;
  color: string;
  value: number;
}

interface ZeroSumAllocatorProps {
  pillars: PillarAllocation[];
  onChange: (pillars: PillarAllocation[]) => void;
  total?: number;
  min?: number;
  max?: number;
  size?: number;
  descriptions?: Record<string, string>;
}

function allocatorLayout(size: number) {
  const padding = size < 410 ? 88 : 104;
  const canvas = size + padding * 2;
  const cx = canvas / 2;
  const cy = canvas / 2;
  const maxR = size * 0.35;
  const labelR = maxR + 62;
  return { canvas, cx, cy, maxR, labelR };
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function radarPath(cx: number, cy: number, maxR: number, values: number[], total: number): string {
  const step = 360 / values.length;
  const pts = values.map((value, index) => {
    const r = (value / total) * maxR;
    return polarToCartesian(cx, cy, r, index * step);
  });
  return pts.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const SpiderWebChart: FC<{
  pillars: PillarAllocation[];
  total: number;
  size?: number;
  draggingIndex: number | null;
  hasInteracted: boolean;
}> = ({ pillars, total, size = 380, draggingIndex, hasInteracted }) => {
  const { canvas, cx, cy, maxR, labelR } = allocatorLayout(size);
  const step = 360 / pillars.length;
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${canvas} ${canvas}`} className="allocator-svg" aria-hidden="true">
      <defs>
        <radialGradient id="allocatorSurfaceGlow" cx="50%" cy="44%" r="70%">
          <stop offset="0%" stopColor="rgba(23, 201, 203, 0.22)" />
          <stop offset="58%" stopColor="rgba(59, 111, 212, 0.12)" />
          <stop offset="100%" stopColor="rgba(11, 17, 32, 0)" />
        </radialGradient>
        <linearGradient id="allocatorRadarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(23, 201, 203, 0.95)" />
          <stop offset="100%" stopColor="rgba(123, 167, 255, 0.95)" />
        </linearGradient>
        <radialGradient id="allocatorRadarFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(123, 167, 255, 0.32)" />
          <stop offset="100%" stopColor="rgba(23, 201, 203, 0.08)" />
        </radialGradient>
        <filter id="allocatorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {!hasInteracted && (
          <style>{`
            @keyframes allocatorPulse {
              0%, 100% { opacity: 0.22; r: 14; }
              50% { opacity: 0.6; r: 22; }
            }
            .allocator-drag-pulse { animation: allocatorPulse 2.1s ease-in-out infinite; }
          `}</style>
        )}
      </defs>

      <circle cx={cx} cy={cy} r={maxR + 76} fill="url(#allocatorSurfaceGlow)" />
      <circle cx={cx} cy={cy} r={maxR + 26} fill="rgba(9, 15, 31, 0.82)" stroke="rgba(140, 170, 220, 0.14)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={maxR + 44} fill="none" stroke="rgba(227, 75, 44, 0.1)" strokeWidth="1" />

      {rings.map((frac) => (
        <g key={frac}>
          <polygon
            points={pillars
              .map((_, index) => {
                const point = polarToCartesian(cx, cy, maxR * frac, index * step);
                return `${point.x},${point.y}`;
              })
              .join(" ")}
            fill="none"
            stroke={frac === 1 ? "rgba(123, 167, 255, 0.2)" : "rgba(140, 170, 220, 0.12)"}
            strokeWidth={frac === 1 ? 1.3 : 1}
            strokeDasharray={frac === 1 ? "none" : "4 6"}
          />
          <text
            x={cx + 6}
            y={cy - maxR * frac + 4}
            fontSize={9}
            fill="rgba(226, 232, 240, 0.26)"
            fontFamily="'JetBrains Mono', monospace"
          >
            {Math.round(frac * total)}
          </text>
        </g>
      ))}

      {pillars.map((pillar, index) => {
        const end = polarToCartesian(cx, cy, maxR, index * step);
        return (
          <line
            key={pillar.id}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke={pillar.color}
            strokeWidth={1}
            strokeOpacity={0.34}
          />
        );
      })}

      {pillars.map((pillar, index) => {
        const current = polarToCartesian(cx, cy, (pillars[index].value / total) * maxR, index * step);
        const nextIndex = (index + 1) % pillars.length;
        const next = polarToCartesian(cx, cy, (pillars[nextIndex].value / total) * maxR, nextIndex * step);
        return (
          <path
            key={`${pillar.id}-wedge`}
            d={`M ${cx} ${cy} L ${current.x} ${current.y} L ${next.x} ${next.y} Z`}
            fill={pillar.color}
            fillOpacity={0.07}
            style={{ transition: draggingIndex !== null ? "none" : "d 160ms ease" }}
          />
        );
      })}

      <path
        d={radarPath(
          cx,
          cy,
          maxR,
          pillars.map((pillar) => pillar.value),
          total,
        )}
        fill="url(#allocatorRadarFill)"
        stroke="url(#allocatorRadarStroke)"
        strokeWidth={2.6}
        strokeLinejoin="round"
        filter={draggingIndex !== null ? "url(#allocatorGlow)" : undefined}
        style={{ transition: draggingIndex !== null ? "none" : "d 160ms ease" }}
      />

      {pillars.map((pillar, index) => {
        const radius = (pillar.value / total) * maxR;
        const point = polarToCartesian(cx, cy, radius, index * step);
        const labelPoint = polarToCartesian(cx, cy, labelR, index * step);
        const isDragging = draggingIndex === index;
        const labelWidth = Math.max(94, pillar.label.length * 9.6);
        const labelX = clamp(labelPoint.x - labelWidth / 2, 12, canvas - labelWidth - 12);
        const labelY = clamp(labelPoint.y - 18, 12, canvas - 64);
        const valueX = clamp(labelPoint.x - 27, 12, canvas - 66);

        return (
          <g key={pillar.id}>
            {!hasInteracted && index === 0 && (
              <circle
                cx={point.x}
                cy={point.y}
                r={14}
                fill={pillar.color}
                fillOpacity={0.18}
                className="allocator-drag-pulse"
              />
            )}
            {isDragging && (
              <circle cx={point.x} cy={point.y} r={17} fill={pillar.color} fillOpacity={0.18} filter="url(#allocatorGlow)" />
            )}

            <line
              x1={point.x}
              y1={point.y}
              x2={labelPoint.x}
              y2={labelPoint.y}
              stroke={pillar.color}
              strokeOpacity={isDragging ? 0.78 : 0.3}
              strokeWidth={isDragging ? 1.5 : 1}
              strokeDasharray="3 5"
            />

            <rect
              x={labelX}
              y={labelY}
              width={labelWidth}
              height={28}
              rx={14}
              fill="rgba(8, 14, 28, 0.94)"
              stroke={isDragging ? pillar.color : "rgba(140, 170, 220, 0.18)"}
              strokeWidth={isDragging ? 1.4 : 1}
            />
            <text
              x={labelX + labelWidth / 2}
              y={labelY + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11.5}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              fill={isDragging ? pillar.color : "rgba(226, 232, 240, 0.92)"}
              letterSpacing="0.03em"
            >
              {pillar.label}
            </text>

            <rect
              x={valueX}
              y={labelY + 33}
              width={54}
              height={22}
              rx={11}
              fill={pillar.color}
              fillOpacity={0.16}
              stroke={pillar.color}
              strokeOpacity={0.46}
            />
            <text
              x={valueX + 27}
              y={labelY + 44}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontWeight={800}
              fontFamily="'JetBrains Mono', monospace"
              fill={pillar.color}
            >
              {pillar.value}
            </text>

            <circle
              cx={point.x}
              cy={point.y}
              r={20}
              fill="transparent"
              style={{ cursor: "grab" }}
              data-index={index}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={isDragging ? 11 : 8}
              fill={pillar.color}
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={isDragging ? 3 : 2}
              filter={isDragging ? "url(#allocatorGlow)" : undefined}
              style={{
                cursor: "grab",
                transition: isDragging ? "none" : "all 160ms ease",
              }}
              data-index={index}
            />
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={28} fill="rgba(7, 12, 24, 0.94)" stroke="rgba(140, 170, 220, 0.18)" strokeWidth="1.2" />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={18}
        fontWeight={800}
        fontFamily="'JetBrains Mono', monospace"
        fill="rgba(226, 232, 240, 0.88)"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={8}
        fontWeight={600}
        fontFamily="'JetBrains Mono', monospace"
        fill="rgba(226, 232, 240, 0.32)"
        letterSpacing="0.16em"
      >
        LOCKED
      </text>

      {!hasInteracted && (
        <text
          x={cx}
          y={canvas - 18}
          textAnchor="middle"
          fontSize={11}
          fontFamily="'JetBrains Mono', monospace"
          fill="rgba(226, 232, 240, 0.42)"
        >
          drag a point or move a slider
        </text>
      )}
    </svg>
  );
};

const ZeroSumAllocator: FC<ZeroSumAllocatorProps> = ({
  pillars,
  onChange,
  total = 100,
  min = 0,
  max = 50,
  size = 440,
  descriptions = {},
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback(
    (index: number, newValue: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(newValue)));
      const oldValue = pillars[index].value;
      const delta = clamped - oldValue;
      if (delta === 0) return;

      if (!hasInteracted) setHasInteracted(true);

      const others = pillars.filter((_, pillarIndex) => pillarIndex !== index);
      const othersTotal = others.reduce((sum, pillar) => sum + pillar.value, 0);

      const updated = pillars.map((pillar, pillarIndex) => {
        if (pillarIndex === index) return { ...pillar, value: clamped };
        if (othersTotal === 0) {
          return {
            ...pillar,
            value: Math.max(min, Math.round((total - clamped) / (pillars.length - 1))),
          };
        }
        const share = pillar.value / othersTotal;
        const nextValue = Math.max(min, Math.round(pillar.value - delta * share));
        return { ...pillar, value: nextValue };
      });

      const currentTotal = updated.reduce((sum, pillar) => sum + pillar.value, 0);
      const diff = total - currentTotal;
      if (diff !== 0) {
        const adjustIndex = updated
          .map((pillar, pillarIndex) => ({ pillarIndex, value: pillar.value }))
          .filter(({ pillarIndex }) => pillarIndex !== index)
          .sort((left, right) => right.value - left.value)[0]?.pillarIndex;

        if (adjustIndex !== undefined) {
          updated[adjustIndex] = {
            ...updated[adjustIndex],
            value: Math.max(min, Math.min(max, updated[adjustIndex].value + diff)),
          };
        }
      }

      onChange(updated);
    },
    [pillars, onChange, total, min, max, hasInteracted],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      const target = event.target as SVGElement;
      const index = target.getAttribute("data-index");
      if (index !== null) {
        setDraggingIndex(parseInt(index, 10));
        target.setPointerCapture?.(event.pointerId);
        if (!hasInteracted) setHasInteracted(true);
      }
    },
    [hasInteracted],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (draggingIndex === null || !svgRef.current) return;
      const svg = svgRef.current.querySelector("svg");
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = event.clientX - rect.left - cx;
      const dy = event.clientY - rect.top - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const layout = allocatorLayout(size);
      const fraction = Math.max(0, Math.min(1, distance / (layout.maxR * (rect.width / layout.canvas))));
      handleSliderChange(draggingIndex, Math.round(fraction * total));
    },
    [draggingIndex, handleSliderChange, size, total],
  );

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return (
    <div className="allocator-shell">
      <div
        ref={svgRef}
        className="allocator-chart-frame"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <SpiderWebChart
          pillars={pillars}
          total={total}
          size={size}
          draggingIndex={draggingIndex}
          hasInteracted={hasInteracted}
        />
      </div>

      <div className="allocator-summary-grid">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.id}
            className={`allocator-summary-chip${draggingIndex === index ? " is-active" : ""}`}
            style={{ "--pillar-color": pillar.color } as CSSProperties}
          >
            <span>{pillar.label}</span>
            <strong>{pillar.value}</strong>
          </div>
        ))}
      </div>

      <div className="allocator-slider-list">
        {pillars.map((pillar, index) => (
          <label
            key={pillar.id}
            className={`allocator-slider-card${draggingIndex === index ? " is-active" : ""}`}
            style={{ "--pillar-color": pillar.color } as CSSProperties}
          >
            <div className="allocator-slider-head">
              <div>
                <span className="allocator-slider-name">{pillar.label}</span>
                {descriptions[pillar.id] ? (
                  <p className="allocator-slider-description">{descriptions[pillar.id]}</p>
                ) : null}
              </div>
              <span className="allocator-slider-value">{pillar.value}</span>
            </div>
            <input
              className="allocator-slider-input"
              type="range"
              min={min}
              max={max}
              step={1}
              value={pillar.value}
              onChange={(event) => handleSliderChange(index, parseInt(event.target.value, 10))}
              aria-label={`${pillar.label} weight`}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default ZeroSumAllocator;
