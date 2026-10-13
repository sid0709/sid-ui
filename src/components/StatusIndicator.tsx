import type { ReactNode } from "react";

import type { StatusDotVariant } from "@astryxdesign/core/StatusDot";

export type StatusIndicatorSize = "sm" | "md" | "lg";

/** plain is a dot and words; soft and outline wrap them in a pill. */
export type StatusIndicatorAppearance = "plain" | "soft" | "outline";

export interface StatusIndicatorProps {
  /** Same variants as StatusDot. */
  variant: StatusDotVariant;
  /** The visible status, such as “Operational”. It is also what assistive tech reads. */
  label: ReactNode;
  /** Quieter text after the label — a time, a count, a percentage. */
  detail?: ReactNode;
  size?: StatusIndicatorSize;
  appearance?: StatusIndicatorAppearance;
  /** A ripple around the dot for live or urgent states. Still under reduced motion. */
  isPulsing?: boolean;
}

/**
 * A status dot with its words beside it. Use it wherever a dot would otherwise need a
 * hand-built row — service lists, table cells, presence, headers.
 */
export function StatusIndicator({
  variant,
  label,
  detail,
  size = "md",
  appearance = "plain",
  isPulsing = false,
}: StatusIndicatorProps) {
  return (
    <span
      className={[
        "os-status",
        `os-status-${variant}`,
        `os-status-${size}`,
        `os-status-${appearance}`,
        isPulsing && "os-status-pulsing",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="os-status-dot" aria-hidden />
      <span className="os-status-label">{label}</span>
      {detail != null && <span className="os-status-detail">{detail}</span>}
    </span>
  );
}
