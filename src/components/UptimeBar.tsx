"use client";

import { useState } from "react";

/** How a day went: fine, degraded, down, or nothing measured yet. */
export type UptimeTone = "up" | "degraded" | "down" | "none";

export type UptimeDay = {
  /** Shown as the tip's title, e.g. "Oct 11, 2026". */
  label: string;
  tone: UptimeTone;
  /** One line per fact in the tip, e.g. "99.98% uptime", "Slow search". */
  details?: string[];
};

const TONE_LABEL: Record<UptimeTone, string> = {
  up: "No downtime",
  degraded: "Degraded",
  down: "Outage",
  none: "No data",
};

/** Keeps the tip inside the bar near either end. */
const EDGE_SHARE = 0.15;

/**
 * A status-page history: one slim bar per day, oldest on the left, coloured by how the
 * day went. Each bar reads out its date and details on hover or focus.
 */
export function UptimeBar({
  days,
  label,
  startLabel,
  endLabel,
  summary,
}: {
  days: UptimeDay[];
  /** Accessible name for the row of days, e.g. "API uptime, last 90 days". */
  label: string;
  /** Under the left end, e.g. "90 days ago". */
  startLabel?: string;
  /** Under the right end, e.g. "Today". */
  endLabel?: string;
  /** Centered under the bars, e.g. "99.98% uptime". */
  summary?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const align = (index: number) => {
    const share = days.length > 1 ? index / (days.length - 1) : 0.5;
    if (share < EDGE_SHARE) return "start";
    if (share > 1 - EDGE_SHARE) return "end";
    return "center";
  };

  return (
    <div className="os-uptime">
      <div className="os-uptime-days" role="group" aria-label={label}>
        {days.map((day, index) => {
          const details = day.details?.length ? day.details : [TONE_LABEL[day.tone]];
          return (
            <span
              key={`${day.label}-${index}`}
              className="os-uptime-day"
              data-tone={day.tone}
              tabIndex={0}
              role="img"
              aria-label={`${day.label}: ${details.join(", ")}`}
              onPointerEnter={() => setActive(index)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              {active === index ? (
                <span className="os-chart-tip" data-align={align(index)} role="presentation">
                  <span className="os-chart-tip-title">{day.label}</span>
                  {details.map((detail) => (
                    <span key={detail} className="os-chart-tip-row">
                      {detail}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      {startLabel || endLabel || summary ? (
        <div className="os-uptime-axis">
          <span>{startLabel}</span>
          <span className="os-uptime-summary">{summary}</span>
          <span>{endLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
