"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { niceTicks, polarPoint, polygonPath } from "./chartMath";
import {
  ChartLegend,
  ChartTable,
  ChartTip,
  defaultFormat,
  toneAt,
  type ChartTone,
} from "./chartParts";
import { useElementWidth } from "./Responsive";

export type RadarSeries = {
  label: string;
  /** One per axis, in axis order. */
  values: number[];
  tone?: ChartTone;
};

const DEFAULT_SIZE = 420;
/** Room around the web for axis names. */
const LABEL_ROOM = 64;

/**
 * Several measures of a few things at once — a skill profile, a product comparison. Each axis
 * runs from the center out; each series is a filled shape. Hover or arrow through the axes to
 * read every series on one axis.
 */
export function RadarChart({
  axes,
  series,
  label,
  max,
  levels = 4,
  size = DEFAULT_SIZE,
  shape = "polygon",
  formatValue = defaultFormat,
  hasLegend,
}: {
  /** Axis names, clockwise from twelve o'clock. Three or more. */
  axes: string[];
  series: RadarSeries[];
  /** Accessible name for the chart. */
  label: string;
  /** The value at the rim. Defaults to a clean number above the largest value. */
  max?: number;
  /** Rings in the web. */
  levels?: number;
  /** The largest the chart grows to, in px. It shrinks to fit narrow frames. */
  size?: number;
  /** polygon draws a straight-edged web; circle draws round rings. */
  shape?: "polygon" | "circle";
  formatValue?: (value: number) => string;
  /** Defaults to on for two or more series. */
  hasLegend?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const width = useElementWidth(frame);
  const [active, setActive] = useState<number | null>(null);

  const side = Math.max(0, Math.min(size, width));
  const center = side / 2;
  const radius = Math.max(0, center - LABEL_ROOM);
  const largest = Math.max(0, ...series.flatMap((s) => s.values));
  const ticks = niceTicks(largest, levels);
  const rim = max ?? ticks[ticks.length - 1];
  const rings = max ? Array.from({ length: levels + 1 }, (_, i) => (max / levels) * i) : ticks;
  const n = axes.length;
  const toned = series.map((item, index) => ({ ...item, tone: toneAt(index, item.tone) }));
  const showLegend = hasLegend ?? series.length > 1;
  const at = (axis: number, value: number) =>
    polarPoint(center, center, rim > 0 ? (Math.max(0, value) / rim) * radius : 0, axis / n);

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (n === 0) return;
    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => ((current ?? -step) + step + n) % n);
    } else if (event.key === "Escape") {
      setActive(null);
    }
  };

  const tipPoint = active === null ? null : polarPoint(center, center, radius + 8, active / n);

  return (
    <div className="os-chart os-radar">
      {showLegend ? (
        <ChartLegend items={toned.map((item) => ({ label: item.label, tone: item.tone }))} />
      ) : null}
      <div
        ref={frame}
        className="os-chart-frame os-radar-frame"
        style={{ height: side || size }}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use the arrow keys to read each axis.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        {side > 0 ? (
          <svg
            width={side}
            height={side}
            className="os-chart-svg"
            aria-hidden
            onPointerLeave={() => setActive(null)}
          >
            {rings.slice(1).map((ring) => {
              const r = rim > 0 ? (ring / rim) * radius : 0;
              return shape === "circle" ? (
                <circle key={ring} className="os-radar-ring" cx={center} cy={center} r={r} />
              ) : (
                <path
                  key={ring}
                  className="os-radar-ring"
                  d={polygonPath(axes.map((_, i) => polarPoint(center, center, r, i / n)))}
                />
              );
            })}
            {rings.slice(1).map((ring) => (
              <text
                key={`t-${ring}`}
                className="os-chart-axis os-radar-tick"
                x={center + 4}
                y={center - (rim > 0 ? (ring / rim) * radius : 0)}
                dy="-0.3em"
              >
                {formatValue(ring)}
              </text>
            ))}
            {axes.map((name, i) => {
              const end = polarPoint(center, center, radius, i / n);
              const labelAt = polarPoint(center, center, radius + 14, i / n);
              const anchor =
                Math.abs(labelAt.x - center) < 4 ? "middle" : labelAt.x > center ? "start" : "end";
              return (
                <g key={name} data-active={active === i || undefined}>
                  <line
                    className="os-radar-spoke"
                    x1={center}
                    y1={center}
                    x2={end.x}
                    y2={end.y}
                  />
                  <text
                    className="os-radar-label"
                    x={labelAt.x}
                    y={labelAt.y}
                    textAnchor={anchor}
                    dy={labelAt.y < center - radius * 0.7 ? "-0.2em" : labelAt.y > center + radius * 0.7 ? "0.9em" : "0.35em"}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
            {toned.map((item, s) => {
              const points = axes.map((_, i) => at(i, item.values[i] ?? 0));
              return (
                <g
                  key={item.label}
                  data-tone={item.tone}
                  className="os-radar-series"
                  style={{ animationDelay: `${s * 120}ms`, transformOrigin: `${center}px ${center}px` }}
                >
                  <path className="os-radar-shape" d={polygonPath(points)} />
                  {points.map((point, i) => (
                    <circle
                      key={axes[i]}
                      className="os-radar-dot"
                      cx={point.x}
                      cy={point.y}
                      r={active === i ? 5 : 3}
                    />
                  ))}
                </g>
              );
            })}
            {/* One wedge per axis catches the pointer anywhere in its slice. */}
            {axes.map((name, i) => {
              const a = polarPoint(center, center, radius + LABEL_ROOM, (i - 0.5) / n);
              const b = polarPoint(center, center, radius + LABEL_ROOM, (i + 0.5) / n);
              return (
                <path
                  key={`hit-${name}`}
                  className="os-chart-hit"
                  d={`M${center},${center}L${a.x},${a.y}L${b.x},${b.y}Z`}
                  onPointerEnter={() => setActive(i)}
                />
              );
            })}
          </svg>
        ) : null}
        {active !== null && tipPoint ? (
          <ChartTip
            title={axes[active]}
            left={tipPoint.x + (side - width < 0 ? (width - side) / 2 : 0)}
            top={tipPoint.y}
            align={tipPoint.x < center - 4 ? "end" : tipPoint.x > center + 4 ? "start" : "center"}
            rows={toned.map((item) => ({
              label: item.label,
              value: formatValue(item.values[active] ?? 0),
              tone: item.tone,
            }))}
          />
        ) : null}
      </div>
      <ChartTable
        caption={label}
        headers={["", ...series.map((item) => item.label)]}
        rows={axes.map((axis, i) => [axis, ...series.map((item) => formatValue(item.values[i] ?? 0))])}
      />
    </div>
  );
}
