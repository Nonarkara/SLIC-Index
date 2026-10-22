import { type CSSProperties, type FC, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { pickLocale, type LocalizedRecord } from "./i18n";
import type { Locale } from "./types";

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
  locale?: Locale;
}

const ALLOCATOR_HINT: LocalizedRecord<string> = {
  en: "drag a bar to weight what matters to you",
  th: "ลากแถบเพื่อให้น้ำหนักสิ่งที่สำคัญกับคุณ",
  zh: "拖动滑块以赋予你所重视事物的权重",
  ko: "막대를 드래그하여 당신에게 중요한 항목에 가중치를 부여하세요",
  ja: "バーをドラッグして、自分にとって重要な項目に重み付けをしてください",
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

/** How close the pointer has to be to a handle, in SVG user units, to grab it. */
const GRAB_RADIUS = 48;

function radarPath(
  cx: number,
  cy: number,
  maxR: number,
  values: number[],
  total: number,
  override?: { index: number; x: number; y: number } | null,
): string {
  const step = 360 / values.length;
  const minR = maxR * MIN_R_FRAC;
  const points = values.map((value, index) => {
    if (override && override.index === index) {
      return { x: override.x, y: override.y };
    }
    const r = minR + (value / total) * (maxR - minR);
    return polarToCartesian(cx, cy, r, index * step);
  });

  return `${points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")} Z`;
}

/** Pointer position in SVG user units, whatever the box ends up being on screen. */
function pointerInUserSpace(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM();
  if (ctm) {
    const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  }
  const rect = svg.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
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
  dragAngle: number | null;
  hasInteracted: boolean;
}> = ({ pillars, total, size = 380, draggingIndex, dragAngle, hasInteracted }) => {
  const { canvas, cx, cy, maxR, labelR } = allocatorLayout(size);
  const step = 360 / pillars.length;
  const rings = [0.25, 0.5, 0.75, 1];
  const minR = maxR * MIN_R_FRAC;

  /*
   * While a node is being pulled it sits exactly where the pointer is, so the
   * gesture is direct: the handle never slides away along its own axis. The
   * radius still comes from the value, so radius always encodes the number.
   */
  const pulledPoint =
    draggingIndex === null || dragAngle === null
      ? null
      : (() => {
          const value = pillars[draggingIndex]?.value ?? 0;
          const r = minR + (value / total) * (maxR - minR);
          return { index: draggingIndex, ...polarToCartesian(cx, cy, r, dragAngle) };
        })();

  return (
    <svg viewBox={`0 0 ${canvas} ${canvas}`} className="allocator-svg" aria-hidden="true">
      <defs>
        <filter id="allocatorGlow" x="-60%" y="-60%" width="220%" height="220%">
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
            stroke="var(--spider-grid, rgba(255,255,255,0.06))"
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
            style={{ "--pillar": pillar.color } as CSSProperties}
            className="allocator-node"
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="var(--pillar-ink)"
            strokeWidth={1}
            strokeOpacity={0.34}
          />
        );
      })}

      <path
        d={radarPath(cx, cy, maxR, pillars.map((pillar) => pillar.value), total, pulledPoint)}
        fill="rgba(249, 157, 27, 0.18)"
        stroke="#f99d1b"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{
          pointerEvents: "none",
          transition: draggingIndex === null ? "d 220ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      />

      {pillars.map((pillar, index) => {
        const minR = maxR * MIN_R_FRAC;
        const r = minR + (pillar.value / total) * (maxR - minR);
        const point =
          pulledPoint && pulledPoint.index === index
            ? { x: pulledPoint.x, y: pulledPoint.y }
            : polarToCartesian(cx, cy, r, index * step);
        const labelPoint = polarToCartesian(cx, cy, labelR, index * step);
        const isDragging = draggingIndex === index;
        const anchor = labelAnchor(labelPoint.x, cx);
        const labelOffsetX = anchor === "start" ? 12 : anchor === "end" ? -12 : 0;
        const valueOffsetY = labelPoint.y > cy + 8 ? 16 : 12;

        return (
          <g key={pillar.id} className="allocator-node" style={{ "--pillar": pillar.color } as CSSProperties}>
            {!hasInteracted && index === 0 && (
              <circle
                cx={point.x}
                cy={point.y}
                r={14}
                fill="var(--pillar-ink)"
                fillOpacity={0.18}
                className="allocator-drag-pulse"
              />
            )}

            {isDragging && (
              <circle
                cx={point.x}
                cy={point.y}
                r={22}
                fill="var(--pillar-ink)"
                fillOpacity={0.18}
                filter="url(#allocatorGlow)"
              />
            )}

            <line
              x1={point.x}
              y1={point.y}
              x2={labelPoint.x}
              y2={labelPoint.y}
              stroke="var(--pillar-ink)"
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
              data-node="hit"
            />

            <circle
              cx={point.x}
              cy={point.y}
              r={isDragging ? 14 : 11}
              fill="var(--pillar-ink)"
              stroke="var(--bg, rgba(255,255,255,0.92))"
              strokeWidth={isDragging ? 3 : 2}
              filter={isDragging ? "url(#allocatorGlow)" : undefined}
              style={{
                cursor: "grab",
                transition: isDragging ? "none" : "r 120ms ease, stroke-width 120ms ease",
              }}
              data-index={index}
              data-node="vertex"
            />

            <text
              x={labelPoint.x + labelOffsetX}
              y={labelPoint.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fontSize={11.5}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              fill={isDragging ? "var(--pillar-ink)" : "var(--spider-label, rgba(226, 232, 240, 0.92))"}
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
              fill="var(--pillar-ink-text)"
            >
              {pillar.value}
            </text>
          </g>
        );
      })}
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
  const [dragAngle, setDragAngle] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  const dragAngleRef = useRef<number | null>(null);
  const springFrameRef = useRef<number | null>(null);
  const anchorTopRef = useRef<number | null>(null);

  const stopSpring = useCallback(() => {
    if (springFrameRef.current !== null) {
      cancelAnimationFrame(springFrameRef.current);
      springFrameRef.current = null;
    }
  }, []);

  useEffect(() => stopSpring, [stopSpring]);

  /* After every re-render of a pull, put the chart back where the finger left it. */
  useLayoutEffect(() => {
    if (draggingIndex === null || anchorTopRef.current === null) {
      return;
    }
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) {
      return;
    }
    const drift = svg.getBoundingClientRect().top - anchorTopRef.current;
    if (Math.abs(drift) > 0.5) {
      window.scrollBy({ top: drift, behavior: "instant" });
    }
  }, [pillars, draggingIndex]);

  /* The pull is over (or the chart is gone): hand scrolling back to the browser. */
  useEffect(() => {
    if (draggingIndex !== null) {
      return;
    }
    anchorTopRef.current = null;
    document.documentElement.style.overflowAnchor = "";
  }, [draggingIndex]);

  useEffect(
    () => () => {
      document.documentElement.style.overflowAnchor = "";
    },
    [],
  );

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
      if (!svgRef.current) {
        return;
      }

      const svg = svgRef.current.querySelector("svg");
      if (!svg) {
        return;
      }

      /*
       * The handles are close together and their generous hit circles overlap,
       * so "what did I actually grab?" cannot be answered by the element the
       * pointer landed on — the topmost circle often belongs to a different
       * pillar. The nearest handle to the pointer wins, and a handle within
       * reach is grabbed even if the pointer missed its circle. That is the
       * difference between a chart you can pull and a chart you fight.
       */
      const layout = allocatorLayout(size);
      const point = pointerInUserSpace(svg, event.clientX, event.clientY);
      const minR = layout.maxR * MIN_R_FRAC;
      const step = 360 / pillars.length;

      let nearest = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;

      pillars.forEach((pillar, index) => {
        const r = minR + (pillar.value / total) * (layout.maxR - minR);
        const handle = polarToCartesian(layout.cx, layout.cy, r, index * step);
        const d = Math.hypot(handle.x - point.x, handle.y - point.y);
        if (d < nearestDistance) {
          nearestDistance = d;
          nearest = index;
        }
      });

      if (nearest === -1 || nearestDistance > GRAB_RADIUS) {
        return;
      }

      stopSpring();
      setDraggingIndex(nearest);
      /*
       * The chart is the anchor. Pulling a weight rewrites tier lists above
       * and below it, and the page reflows — on the homepage that moved the
       * chart 86px out from under the finger mid-pull, so a 40px drag read as
       * a jump to 100. Remember where the chart sits and hold it there until
       * the pull ends (the browser's own scroll anchoring is off meanwhile, or
       * it fights this and makes it worse).
       */
      anchorTopRef.current = svg.getBoundingClientRect().top;
      document.documentElement.style.overflowAnchor = "none";
      target.setPointerCapture?.(event.pointerId);
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [hasInteracted, pillars, size, stopSpring, total],
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

      const layout = allocatorLayout(size);
      const point = pointerInUserSpace(svg, event.clientX, event.clientY);
      const dx = point.x - layout.cx;
      const dy = point.y - layout.cy;
      const distance = Math.hypot(dx, dy);
      const minR = layout.maxR * MIN_R_FRAC;

      /*
       * The radius is the number; the angle is the hand. The radius is
       * clamped to the web so the handle stops at the outer ring instead of
       * leaving the chart, but the angle is free — so the handle is always
       * under the pointer, whichever way the pull goes. Reading the value off
       * the radius means the radius always encodes it.
       */
      const radius = clamp(distance, minR, layout.maxR);
      const fraction = (radius - minR) / (layout.maxR - minR);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      dragAngleRef.current = (angle + 360) % 360;
      setDragAngle(dragAngleRef.current);
      handleSliderChange(draggingIndex, Math.round(fraction * total));
    },
    [draggingIndex, handleSliderChange, size, total],
  );

  const handlePointerUp = useCallback(() => {
    const index = draggingIndex;
    const current = dragAngleRef.current;

    if (index === null || current === null) {
      dragAngleRef.current = null;
      setDragAngle(null);
      setDraggingIndex(null);
      return;
    }

    const step = 360 / pillars.length;
    const target = index * step;
    const delta = ((target - current + 540) % 360) - 180;

    if (Math.abs(delta) < 0.25) {
      dragAngleRef.current = null;
      setDragAngle(null);
      setDraggingIndex(null);
      return;
    }

    /*
     * Let go and the handle eases back onto its own pillar axis. The radius
     * — the value — is untouched, so nothing the pull said is lost.
     */
    const startedAt = performance.now();
    const duration = 220;
    const ease = (t: number) => 1 - (1 - t) ** 3;

    const advance = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const angle = (current + delta * ease(t) + 360) % 360;
      dragAngleRef.current = angle;
      setDragAngle(angle);

      if (t < 1) {
        springFrameRef.current = requestAnimationFrame(advance);
      } else {
        springFrameRef.current = null;
        dragAngleRef.current = null;
        setDragAngle(null);
        setDraggingIndex(null);
      }
    };

    springFrameRef.current = requestAnimationFrame(advance);
  }, [draggingIndex, pillars.length]);

  return (
    /*
     * The shell's box model lives in CSS, not inline, because the rankings
     * workbench dissolves the shell (`display: contents`) and places the
     * chart and the bars in different grid areas. An inline `display: flex`
     * would win the cascade and keep the two welded together.
     */
    <div className="allocator-shell" style={{ width: "100%", maxWidth: size + 208 }}>
      <div
        ref={svgRef}
        className="allocator-chart-frame"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none", userSelect: "none", width: "100%", maxWidth: size + 208 }}
      >
        <SpiderWebChart
          pillars={pillars}
          total={total}
          size={size}
          draggingIndex={draggingIndex}
          dragAngle={dragAngle}
          hasInteracted={hasInteracted}
        />
      </div>

      <div
        className="allocator-controls"
        role="status"
        aria-live="polite"
        aria-atomic="false"
        style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 6 }}
      >
        {!hasInteracted && (
          /*
           * The instruction talks about a bar, so it belongs with the bars.
           * It used to sit under the web, where it pointed at a shape and
           * described a slider — and, in the workbench, it was a full column
           * away from the only thing it named.
           */
          <p className="allocator-controls-hint">{pickLocale(ALLOCATOR_HINT, locale).toUpperCase()}</p>
        )}
        {pillars.map((pillar, index) => (
          <div key={pillar.id} className="spider-slider-row" style={{ "--pillar": pillar.color } as CSSProperties}>
            <span className="spider-slider-dot" />
            <span className="spider-slider-label">{pillar.label}</span>
            <div className="spider-slider-track">
              <div
                className="spider-slider-fill"
                style={{ width: `${(pillar.value / max) * 100}%` }}
              />
              <input
                type="range"
                min={min}
                max={max}
                value={pillar.value}
                aria-label={descriptions[pillar.id] ?? pillar.label}
                onChange={(event) => handleSliderChange(index, Number.parseInt(event.target.value, 10))}
                className="spider-slider-input"
              />
            </div>
            <span className="spider-slider-value">
              {pillar.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZeroSumAllocator;
