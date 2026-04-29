import { type CSSProperties, type FC, type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from "react";

export interface PillarAllocation {
  id: string;
  label: string;
  color: string;
  value: number;
}

export type AllocatorLocale = "en" | "th" | "zh";

interface ZeroSumAllocatorProps {
  pillars: PillarAllocation[];
  onChange: (pillars: PillarAllocation[]) => void;
  total?: number;
  min?: number;
  max?: number;
  size?: number;
  descriptions?: Record<string, string>;
  locale?: AllocatorLocale;
}

const ALLOCATOR_HINT: Record<AllocatorLocale, string> = {
  en: "drag a bar to weight what matters to you",
  th: "ลากแถบเพื่อให้น้ำหนักสิ่งที่สำคัญกับคุณ",
  zh: "拖动滑块以赋予你所重视事物的权重",
};

function allocatorLayout(size: number) {
  const padding = size < 410 ? 88 : 104;
  const canvas = size + padding * 2;
  const cx = canvas / 2;
  const cy = canvas / 2;
  const maxR = size * 0.35;
  const labelR = maxR + 70;
  return { canvas, cx, cy, maxR, labelR };
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const MIN_R_FRAC = 0.14;

function radarPath(cx: number, cy: number, maxR: number, values: number[], total: number): string {
  const step = 360 / values.length;
  const minR = maxR * MIN_R_FRAC;
  const points = values.map((value, index) => {
    const r = minR + (value / total) * (maxR - minR);
    return polarToCartesian(cx, cy, r, index * step);
  });

  return `${points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")} Z`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function labelAnchor(x: number, cx: number): "start" | "middle" | "end" {
  if (x > cx + 16) return "start";
  if (x < cx - 16) return "end";
  return "middle";
}

const SpiderWebChart: FC<{
  pillars: PillarAllocation[];
  total: number;
  size?: number;
  draggingIndex: number | null;
  hasInteracted: boolean;
  locale: AllocatorLocale;
}> = ({ pillars, total, size = 380, draggingIndex, hasInteracted, locale }) => {
  const { canvas, cx, cy, maxR, labelR } = allocatorLayout(size);
  const step = 360 / pillars.length;
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${canvas} ${canvas}`} className="allocator-svg" aria-hidden="true">
      <defs>
        <linearGradient id="allocatorRadarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(23, 201, 203, 0.95)" />
          <stop offset="100%" stopColor="rgba(123, 167, 255, 0.95)" />
        </linearGradient>
        <radialGradient id="allocatorRadarFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(123, 167, 255, 0.28)" />
          <stop offset="100%" stopColor="rgba(23, 201, 203, 0.06)" />
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
              0%, 100% { opacity: 0.18; r: 14; }
              50% { opacity: 0.55; r: 22; }
            }
            .allocator-drag-pulse { animation: allocatorPulse 2.1s ease-in-out infinite; }
          `}</style>
        )}
      </defs>

      <g style={{ pointerEvents: "none" }}>
        {rings.map((frac) => (
          <polygon
            key={frac}
            points={Array.from({ length: pillars.length }, (_, index) => {
              const point = polarToCartesian(cx, cy, maxR * frac, index * step);
              return `${point.x},${point.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={frac === 1 ? 1.35 : 0.8}
            strokeDasharray={frac < 1 ? "3 3" : undefined}
          />
        ))}
      </g>

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

      <path
        d={radarPath(cx, cy, maxR, pillars.map((pillar) => pillar.value), total)}
        fill="url(#allocatorRadarFill)"
        stroke="url(#allocatorRadarStroke)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        style={{
          pointerEvents: "none",
          transition: draggingIndex === null ? "d 220ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      />

      {pillars.map((pillar, index) => {
        const minR = maxR * MIN_R_FRAC;
        const r = minR + (pillar.value / total) * (maxR - minR);
        const point = polarToCartesian(cx, cy, r, index * step);
        const labelPoint = polarToCartesian(cx, cy, labelR, index * step);
        const isDragging = draggingIndex === index;
        const anchor = labelAnchor(labelPoint.x, cx);
        const labelOffsetX = anchor === "start" ? 12 : anchor === "end" ? -12 : 0;
        const valueOffsetY = labelPoint.y > cy + 8 ? 16 : 12;

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
              <circle
                cx={point.x}
                cy={point.y}
                r={22}
                fill={pillar.color}
                fillOpacity={0.18}
                filter="url(#allocatorGlow)"
              />
            )}

            <line
              x1={point.x}
              y1={point.y}
              x2={labelPoint.x}
              y2={labelPoint.y}
              stroke={pillar.color}
              strokeOpacity={isDragging ? 0.76 : 0.28}
              strokeWidth={isDragging ? 1.4 : 1}
              strokeDasharray="3 5"
            />

            <circle
              cx={point.x}
              cy={point.y}
              r={48}
              fill="transparent"
              style={{ cursor: "grab" }}
              data-index={index}
            />

            <circle
              cx={point.x}
              cy={point.y}
              r={isDragging ? 14 : 11}
              fill={pillar.color}
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={isDragging ? 3 : 2}
              filter={isDragging ? "url(#allocatorGlow)" : undefined}
              style={{
                cursor: "grab",
                transition: isDragging ? "none" : "r 120ms ease, stroke-width 120ms ease",
              }}
              data-index={index}
            />

            <text
              x={labelPoint.x + labelOffsetX}
              y={labelPoint.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fontSize={11.5}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              fill={isDragging ? pillar.color : "rgba(226, 232, 240, 0.92)"}
              letterSpacing="0.03em"
            >
              {pillar.label}
            </text>

            <text
              x={labelPoint.x + labelOffsetX}
              y={labelPoint.y + valueOffsetY}
              textAnchor={anchor}
              dominantBaseline="central"
              fontSize={12}
              fontWeight={800}
              fontFamily="'JetBrains Mono', monospace"
              fill={pillar.color}
            >
              {pillar.value}
            </text>
          </g>
        );
      })}

      {!hasInteracted && (
        <text
          x={cx}
          y={canvas - 18}
          textAnchor="middle"
          fontSize={11}
          fontFamily="'JetBrains Mono', monospace"
          fill="rgba(226, 232, 240, 0.42)"
        >
          {ALLOCATOR_HINT[locale]}
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
  max = 100,
  size = 440,
  descriptions = {},
  locale = "en",
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = useCallback(
    (index: number, newValue: number) => {
      const clamped = clamp(Math.round(newValue), min, max);
      const oldValue = pillars[index].value;
      const delta = clamped - oldValue;

      if (delta === 0) {
        return;
      }

      if (!hasInteracted) {
        setHasInteracted(true);
      }

      const others = pillars.filter((_, pillarIndex) => pillarIndex !== index);
      const othersTotal = others.reduce((sum, pillar) => sum + pillar.value, 0);

      const updated = pillars.map((pillar, pillarIndex) => {
        if (pillarIndex === index) {
          return { ...pillar, value: clamped };
        }

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
            value: clamp(updated[adjustIndex].value + diff, min, max),
          };
        }
      }

      onChange(updated);
    },
    [hasInteracted, max, min, onChange, pillars, total],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      const target = event.target as SVGElement;
      const index = target.getAttribute("data-index");
      if (index !== null) {
        setDraggingIndex(Number.parseInt(index, 10));
        target.setPointerCapture?.(event.pointerId);
        if (!hasInteracted) {
          setHasInteracted(true);
        }
      }
    },
    [hasInteracted],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (draggingIndex === null || !svgRef.current) {
        return;
      }

      const svg = svgRef.current.querySelector("svg");
      if (!svg) {
        return;
      }

      const rect = svg.getBoundingClientRect();
      const dx = event.clientX - rect.left - rect.width / 2;
      const dy = event.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const layout = allocatorLayout(size);
      const scale = rect.width / layout.canvas;
      const minR = layout.maxR * MIN_R_FRAC * scale;
      const usableR = layout.maxR * scale - minR;
      const fraction = clamp((distance - minR) / usableR, 0, 1);

      handleSliderChange(draggingIndex, Math.round(fraction * total));
    },
    [draggingIndex, handleSliderChange, size, total],
  );

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return (
    <div className="allocator-shell" style={{ width: "100%", maxWidth: size + 208, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        ref={svgRef}
        className="allocator-chart-frame"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none", userSelect: "none", width: "100%", maxWidth: size + 208 }}
      >
        <SpiderWebChart
          pillars={pillars}
          total={total}
          size={size}
          draggingIndex={draggingIndex}
          hasInteracted={hasInteracted}
          locale={locale}
        />
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 6 }}
      >
        {pillars.map((pillar, index) => (
          <div key={pillar.id} className="spider-slider-row">
            <span className="spider-slider-dot" style={{ background: pillar.color }} />
            <span className="spider-slider-label">{pillar.label}</span>
            <div className="spider-slider-track">
              <div
                className="spider-slider-fill"
                style={{ width: `${(pillar.value / max) * 100}%`, background: pillar.color }}
              />
              <input
                type="range"
                min={min}
                max={max}
                value={pillar.value}
                aria-label={descriptions[pillar.id] ?? pillar.label}
                onChange={(event) => handleSliderChange(index, Number.parseInt(event.target.value, 10))}
                className="spider-slider-input"
                style={{ "--accent": pillar.color } as CSSProperties}
              />
            </div>
            <span className="spider-slider-value" style={{ color: pillar.color }}>
              {pillar.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZeroSumAllocator;
