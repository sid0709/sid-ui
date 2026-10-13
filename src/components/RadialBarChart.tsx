"use client";

import { useState, type CSSProperties } from "react";

import { ChartTable, defaultFormat, toneAt, type ChartTone } from "./chartParts";

export type RadialBarDatum = {
  label: string;
  value: number;
  /** The value that closes the ring. */
  max: number;
  tone?: ChartTone;
};

const DEFAULT_SIZE = 200;
/** A gauge spans three quarters of a turn, open at the bottom. */
const GAUGE_SWEEP = 0.75;

/**
 * Progress toward goals as rings. `rings` nests one ring per measure, like activity rings;
 * `gauge` draws the first measure as an open three-quarter dial. Rings sweep in on first paint
 * and the center reads the hovered ring.
 */
export function RadialBarChart({
  data,
  label,
  variant = "rings",
  size = DEFAULT_SIZE,
  thickness,
  formatValue = defaultFormat,
  hasLegend = true,
}: {
  data: RadialBarDatum[];
  /** Accessible name for the chart. */
  label: string;
  variant?: "rings" | "gauge";
  size?: number;
  /** Ring width in px. Defaults to a share of the size. */
  thickness?: number;
  formatValue?: (value: number) => string;
  hasLegend?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const toned = data.map((d, index) => ({ ...d, tone: toneAt(index, d.tone) }));
  const shown = variant === "gauge" ? toned.slice(0, 1) : toned;
  const stroke = thickness ?? Math.max(8, Math.round(size * (variant === "gauge" ? 0.1 : 0.075)));
  const gap = Math.round(stroke * 0.3);
  const center = size / 2;
  const share = (d: RadialBarDatum) => (d.max > 0 ? Math.min(1, Math.max(0, d.value / d.max)) : 0);
  const focus = toned[active ?? 0];

  return (
    <div className="os-radial">
      <div
        className="os-radial-figure"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${label}: ${data
          .map((d) => `${d.label} ${formatValue(d.value)} of ${formatValue(d.max)}`)
          .join(", ")}`}
      >
        <svg width={size} height={size} aria-hidden>
          {shown.map((d, index) => {
            const r = center - stroke / 2 - index * (stroke + gap);
            if (r <= 0) return null;
            const sweep = variant === "gauge" ? GAUGE_SWEEP : 1;
            const rotate = variant === "gauge" ? 135 : -90;
            return (
              <g
                key={d.label}
                data-tone={d.tone}
                data-dim={active !== null && active !== index ? true : undefined}
                className="os-radial-ring"
                transform={`rotate(${rotate} ${center} ${center})`}
                onPointerEnter={() => setActive(index)}
                onPointerLeave={() => setActive(null)}
              >
                <circle
                  className="os-radial-track"
                  cx={center}
                  cy={center}
                  r={r}
                  strokeWidth={stroke}
                  pathLength={1}
                  strokeDasharray={`${sweep} 1`}
                />
                <circle
                  className="os-radial-bar"
                  cx={center}
                  cy={center}
                  r={r}
                  strokeWidth={stroke}
                  pathLength={1}
                  style={
                    {
                      "--os-radial-to": `${share(d) * sweep} 1`,
                      animationDelay: `${index * 110}ms`,
                    } as CSSProperties
                  }
                />
              </g>
            );
          })}
        </svg>
        <div className="os-radial-center" aria-hidden>
          <strong>
            {variant === "gauge"
              ? `${Math.round(share(focus) * 100)}%`
              : formatValue(focus.value)}
          </strong>
          <span>
            {variant === "gauge"
              ? focus.label
              : `${focus.label} · ${Math.round(share(focus) * 100)}%`}
          </span>
        </div>
      </div>
      {hasLegend ? (
        <ul className="os-radial-legend" aria-hidden>
          {shown.map((d, index) => (
            <li
              key={d.label}
              data-active={active === index || undefined}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
            >
              <span className="os-chart-key" data-tone={d.tone} />
              <span className="os-radial-name">{d.label}</span>
              <strong>{formatValue(d.value)}</strong>
              <span className="os-radial-of">/ {formatValue(d.max)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <ChartTable
        caption={label}
        headers={["", "Value", "Goal", "Progress"]}
        rows={data.map((d) => [
          d.label,
          formatValue(d.value),
          formatValue(d.max),
          `${Math.round(share(d) * 100)}%`,
        ])}
      />
    </div>
  );
}
