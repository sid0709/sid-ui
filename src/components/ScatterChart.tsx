"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { linearScale, niceDomain } from "./chartMath";
import {
  ChartLegend,
  ChartTable,
  ChartTip,
  defaultFormat,
  toneAt,
  type ChartTone,
} from "./chartParts";
import { useElementWidth } from "./Responsive";

export type ScatterPoint = {
  x: number;
  y: number;
  /** Gives the point an area — a bubble chart. */
  size?: number;
  /** Names the point in the readout. */
  label?: string;
};

export type ScatterSeries = {
  label: string;
  points: ScatterPoint[];
  tone?: ChartTone;
};

const MARGIN = { top: 16, right: 16, bottom: 44, left: 52 };
const DEFAULT_HEIGHT = 320;
const DOT = 5;
/** Bubble radii in px, smallest to largest value. */
const BUBBLE: [number, number] = [6, 26];
/** How close the pointer must come to a point to read it. */
const SNAP = 40;

/**
 * Two measures against each other, one dot per item — or a bubble whose area is a third.
 * The nearest point to the pointer lights up and reads out; the others fade. Optional mean
 * lines split the plot into quadrants.
 */
export function ScatterChart({
  series,
  label,
  xLabel,
  yLabel,
  height = DEFAULT_HEIGHT,
  formatX = defaultFormat,
  formatY = defaultFormat,
  formatSize = defaultFormat,
  sizeLabel = "Size",
  hasMeanLines = false,
  hasLegend,
}: {
  series: ScatterSeries[];
  /** Accessible name for the chart. */
  label: string;
  /** Axis titles. */
  xLabel: string;
  yLabel: string;
  height?: number;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  formatSize?: (value: number) => string;
  /** Names the bubble size in the readout. */
  sizeLabel?: string;
  /** Dashed lines at the mean of x and y, for a four-quadrant read. */
  hasMeanLines?: boolean;
  hasLegend?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const width = useElementWidth(frame);
  const [active, setActive] = useState<{ s: number; p: number } | null>(null);

  const all = series.flatMap((s) => s.points);
  const xTicks = niceDomain(Math.min(...all.map((p) => p.x)), Math.max(...all.map((p) => p.x)), 5);
  const yTicks = niceDomain(Math.min(...all.map((p) => p.y)), Math.max(...all.map((p) => p.y)), 4);
  const sizes = all.map((p) => p.size ?? 0);
  const maxSize = Math.max(0, ...sizes);
  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = Math.max(0, height - MARGIN.top - MARGIN.bottom);
  const x = linearScale([xTicks[0], xTicks[xTicks.length - 1]], [MARGIN.left, MARGIN.left + plotW]);
  const y = linearScale([yTicks[0], yTicks[yTicks.length - 1]], [MARGIN.top + plotH, MARGIN.top]);
  // Area, not radius, carries the value.
  const r = (size?: number) =>
    size == null || maxSize === 0
      ? DOT
      : BUBBLE[0] + (BUBBLE[1] - BUBBLE[0]) * Math.sqrt(Math.max(0, size) / maxSize);
  const toned = series.map((item, index) => ({ ...item, tone: toneAt(index, item.tone) }));
  const showLegend = hasLegend ?? series.length > 1;
  const flat = toned.flatMap((s, si) => s.points.map((p, pi) => ({ s: si, p: pi, point: p })));
  const meanX = all.reduce((sum, p) => sum + p.x, 0) / Math.max(1, all.length);
  const meanY = all.reduce((sum, p) => sum + p.y, 0) / Math.max(1, all.length);

  const onMove = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const px = event.clientX - box.left;
    const py = event.clientY - box.top;
    let best: { s: number; p: number } | null = null;
    let distance = SNAP;
    for (const item of flat) {
      const d = Math.hypot(x(item.point.x) - px, y(item.point.y) - py) - r(item.point.size) / 2;
      if (d < distance) {
        distance = d;
        best = { s: item.s, p: item.p };
      }
    }
    setActive(best);
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (flat.length === 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const order = [...flat].sort((a, b) => a.point.x - b.point.x);
      const at = active ? order.findIndex((o) => o.s === active.s && o.p === active.p) : -1;
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = order[(at + step + order.length) % order.length];
      setActive({ s: next.s, p: next.p });
    } else if (event.key === "Escape") {
      setActive(null);
    }
  };

  const focus = active ? toned[active.s].points[active.p] : null;
  const focusX = focus ? x(focus.x) : 0;
  const focusY = focus ? y(focus.y) : 0;
  const tipAlign = focusX < width / 3 ? "start" : focusX > (width * 2) / 3 ? "end" : "center";

  return (
    <div className="os-chart">
      {showLegend ? (
        <ChartLegend items={toned.map((item) => ({ label: item.label, tone: item.tone }))} />
      ) : null}
      <div
        ref={frame}
        className="os-chart-frame"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use the arrow keys to read each point.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        {width > 0 ? (
          <svg width={width} height={height} className="os-chart-svg" aria-hidden>
            {yTicks.map((tick) => (
              <g key={`y-${tick}`}>
                <line
                  className="os-chart-grid"
                  x1={MARGIN.left}
                  x2={MARGIN.left + plotW}
                  y1={y(tick)}
                  y2={y(tick)}
                />
                <text className="os-chart-axis" x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
                  {formatY(tick)}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  className="os-chart-grid"
                  x1={x(tick)}
                  x2={x(tick)}
                  y1={MARGIN.top}
                  y2={MARGIN.top + plotH}
                />
                <text className="os-chart-axis" x={x(tick)} y={MARGIN.top + plotH + 18} textAnchor="middle">
                  {formatX(tick)}
                </text>
              </g>
            ))}
            <text
              className="os-chart-axis-title"
              x={MARGIN.left + plotW / 2}
              y={height - 4}
              textAnchor="middle"
            >
              {xLabel}
            </text>
            <text
              className="os-chart-axis-title"
              transform={`translate(14 ${MARGIN.top + plotH / 2}) rotate(-90)`}
              textAnchor="middle"
            >
              {yLabel}
            </text>
            {hasMeanLines ? (
              <g className="os-scatter-mean">
                <line x1={x(meanX)} x2={x(meanX)} y1={MARGIN.top} y2={MARGIN.top + plotH} />
                <line x1={MARGIN.left} x2={MARGIN.left + plotW} y1={y(meanY)} y2={y(meanY)} />
              </g>
            ) : null}
            {focus ? (
              <g className="os-scatter-guide">
                <line x1={focusX} x2={focusX} y1={focusY} y2={MARGIN.top + plotH} />
                <line x1={MARGIN.left} x2={focusX} y1={focusY} y2={focusY} />
              </g>
            ) : null}
            {toned.map((item, si) => (
              <g key={item.label} data-tone={item.tone}>
                {item.points.map((point, pi) => {
                  const on = active?.s === si && active.p === pi;
                  return (
                    <circle
                      key={pi}
                      className="os-scatter-dot"
                      data-bubble={point.size != null || undefined}
                      data-active={on || undefined}
                      data-dim={active && !on ? true : undefined}
                      cx={x(point.x)}
                      cy={y(point.y)}
                      r={r(point.size)}
                      style={{ animationDelay: `${Math.min(600, (si * item.points.length + pi) * 18)}ms` }}
                    />
                  );
                })}
              </g>
            ))}
            <rect
              className="os-chart-hit"
              x={MARGIN.left}
              y={MARGIN.top}
              width={plotW}
              height={plotH}
              onPointerMove={onMove}
              onPointerLeave={() => setActive(null)}
            />
          </svg>
        ) : null}
        {focus && active ? (
          <ChartTip
            title={focus.label ?? toned[active.s].label}
            left={focusX + (tipAlign === "start" ? 14 : tipAlign === "end" ? -14 : 0)}
            top={Math.max(0, focusY - r(focus.size) - 64)}
            align={tipAlign}
            rows={[
              { label: xLabel, value: formatX(focus.x), tone: toned[active.s].tone },
              { label: yLabel, value: formatY(focus.y) },
              ...(focus.size != null ? [{ label: sizeLabel, value: formatSize(focus.size) }] : []),
            ]}
          />
        ) : null}
      </div>
      <ChartTable
        caption={label}
        headers={["Series", "Point", xLabel, yLabel, ...(maxSize > 0 ? [sizeLabel] : [])]}
        rows={flat.map(({ s, point }) => [
          toned[s].label,
          point.label ?? "",
          formatX(point.x),
          formatY(point.y),
          ...(maxSize > 0 ? [point.size != null ? formatSize(point.size) : ""] : []),
        ])}
      />
    </div>
  );
}
