"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { segmentShares, squarify } from "./chartMath";
import {
  ChartLegend,
  ChartTable,
  ChartTip,
  defaultFormat,
  toneAt,
  type ChartTone,
} from "./chartParts";
import { useElementWidth } from "./Responsive";

export type TreemapDatum = {
  label: string;
  value: number;
  /** Tiles in the same group share a tone and a legend entry. */
  group?: string;
  tone?: ChartTone;
};

const DEFAULT_HEIGHT = 320;
/** The 2px surface gap between tiles. */
const GAP = 2;
/** A tile needs this much room before it prints its name. */
const LABEL_MIN = { width: 64, height: 40 };

/**
 * Part of a whole for many items at once — budget lines, storage by folder. Each tile's area is
 * its share, laid out squarified so tiles stay readable. Group tiles to color them by category.
 */
export function Treemap({
  data,
  label,
  height = DEFAULT_HEIGHT,
  formatValue = defaultFormat,
}: {
  data: TreemapDatum[];
  /** Accessible name for the chart. */
  label: string;
  height?: number;
  formatValue?: (value: number) => string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const width = useElementWidth(frame);
  const [active, setActive] = useState<number | null>(null);

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const groups = [...new Set(sorted.map((d) => d.group ?? d.label))];
  const grouped = sorted.some((d) => d.group);
  const toneOf = (d: TreemapDatum) =>
    d.tone ?? toneAt(groups.indexOf(d.group ?? d.label) % 4, undefined);
  const tiles = squarify(
    sorted.map((d) => d.value),
    { x: 0, y: 0, width, height },
  );
  const shares = segmentShares(sorted.map((d) => d.value));
  const largest = Math.max(1, ...sorted.map((d) => d.value));

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (sorted.length === 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      setActive((current) => ((current ?? -step) + step + sorted.length) % sorted.length);
    } else if (event.key === "Escape") {
      setActive(null);
    }
  };

  const focusTile = active === null ? null : tiles[active];

  return (
    <div className="os-chart">
      {grouped ? (
        <ChartLegend
          items={groups.map((g) => ({
            label: g,
            tone: toneOf(sorted.find((d) => (d.group ?? d.label) === g) ?? sorted[0]),
          }))}
        />
      ) : null}
      <div
        ref={frame}
        className="os-chart-frame os-treemap"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use the arrow keys to read each tile.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
      >
        {width > 0
          ? sorted.map((d, index) => {
              const tile = tiles[index];
              if (tile.width <= 0 || tile.height <= 0) return null;
              const roomy = tile.width >= LABEL_MIN.width && tile.height >= LABEL_MIN.height;
              // Larger tiles in a group read stronger.
              const strength = 62 + Math.round((d.value / largest) * 38);
              return (
                <div
                  key={`${d.label}-${index}`}
                  className="os-treemap-tile"
                  data-tone={toneOf(d)}
                  data-active={active === index || undefined}
                  data-dim={active !== null && active !== index ? true : undefined}
                  style={
                    {
                      left: tile.x + GAP / 2,
                      top: tile.y + GAP / 2,
                      width: Math.max(0, tile.width - GAP),
                      height: Math.max(0, tile.height - GAP),
                      "--os-treemap-strength": `${strength}%`,
                      animationDelay: `${Math.min(500, index * 35)}ms`,
                    } as CSSProperties
                  }
                  onPointerEnter={() => setActive(index)}
                  aria-hidden
                >
                  {roomy ? (
                    <>
                      <span className="os-treemap-name">{d.label}</span>
                      <span className="os-treemap-value">{formatValue(d.value)}</span>
                    </>
                  ) : null}
                </div>
              );
            })
          : null}
        {active !== null && focusTile ? (
          <ChartTip
            title={sorted[active].group ?? undefined}
            left={focusTile.x + focusTile.width / 2}
            top={Math.max(0, focusTile.y + 8)}
            align={
              focusTile.x + focusTile.width / 2 < width / 4
                ? "start"
                : focusTile.x + focusTile.width / 2 > (width * 3) / 4
                  ? "end"
                  : "center"
            }
            rows={[
              {
                label: `${sorted[active].label} · ${Math.round(shares[active])}%`,
                value: formatValue(sorted[active].value),
                tone: toneOf(sorted[active]),
              },
            ]}
          />
        ) : null}
      </div>
      <ChartTable
        caption={label}
        headers={["", ...(grouped ? ["Group"] : []), "Value", "Share"]}
        rows={sorted.map((d, index) => [
          d.label,
          ...(grouped ? [d.group ?? ""] : []),
          formatValue(d.value),
          `${Math.round(shares[index])}%`,
        ])}
      />
    </div>
  );
}
