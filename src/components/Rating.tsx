"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

export const RATING_MAX = 5;

/** The mark that repeats: gold stars by default, rose hearts for likes and favorites. */
export type RatingIcon = "star" | "heart";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  /** Hides the numeric score. The marks still expose it to assistive tech. */
  showValue?: boolean;
  caption?: string;
  icon?: RatingIcon;
  /** Lets a click on the left half of a mark pick a half, and arrow keys step by halves. */
  allowHalf?: boolean;
}

const PATHS: Record<RatingIcon, string> = {
  star: "M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z",
  heart:
    "M12 20.6s-7.6-4.55-9.35-9.4C1.5 8.05 3.55 4.4 7.15 4.4c2.05 0 3.6 1.1 4.85 2.75C13.25 5.5 14.8 4.4 16.85 4.4c3.6 0 5.65 3.65 4.5 6.8-1.75 4.85-9.35 9.4-9.35 9.4z",
};

function Mark({ icon, fill }: { icon: RatingIcon; fill: number }) {
  return (
    <>
      <svg className="os-rating-mark-base" viewBox="0 0 24 24" aria-hidden>
        <path d={PATHS[icon]} />
      </svg>
      <span className="os-rating-mark-fill" style={{ width: `${fill * 100}%` }}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d={PATHS[icon]} />
        </svg>
      </span>
    </>
  );
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * A score in stars or hearts. Read-only values can be fractional — 4.3 fills 4.3 marks — and the
 * number is written beside them unless `showValue` is off.
 */
export function Rating({
  value,
  onChange,
  max = RATING_MAX,
  readOnly = false,
  size = "md",
  label = "Rating",
  showValue = true,
  caption,
  icon = "star",
  allowHalf = false,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  // Bumps on every pick so the chosen mark replays its pop.
  const [popped, setPopped] = useState<{ mark: number; key: number } | null>(null);
  const marks = useRef<Array<HTMLButtonElement | null>>([]);
  const shown = hover ?? value;
  const interactive = Boolean(onChange) && !readOnly;
  const step = allowHalf ? 0.5 : 1;

  const pick = (next: number) => {
    const clamped = Math.max(step, Math.min(max, next));
    onChange?.(clamped);
    setPopped((p) => ({ mark: Math.ceil(clamped), key: (p?.key ?? 0) + 1 }));
  };

  const pointerValue = (mark: number, event: MouseEvent<HTMLButtonElement>) => {
    if (!allowHalf) return mark;
    const box = event.currentTarget.getBoundingClientRect();
    const fromStart = document.dir === "rtl" ? box.right - event.clientX : event.clientX - box.left;
    return fromStart < box.width / 2 ? mark - 0.5 : mark;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
    };
    if (event.key in keys) {
      event.preventDefault();
      const next = Math.max(step, Math.min(max, (value || 0) + keys[event.key]));
      pick(next);
      marks.current[Math.ceil(next) - 1]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? step : max;
      pick(next);
      marks.current[Math.ceil(next) - 1]?.focus();
    }
  };

  const focusMark = Math.max(1, Math.ceil(value || 1));

  return (
    <div className={`os-rating os-rating-${size} os-rating-${icon}`}>
      <div
        className="os-rating-marks"
        role={interactive ? "radiogroup" : "img"}
        aria-label={interactive ? label : `${label}, ${format(value)} of ${max}`}
        onMouseLeave={() => setHover(null)}
        onKeyDown={interactive ? onKeyDown : undefined}
      >
        {Array.from({ length: max }, (_, index) => {
          const mark = index + 1;
          const fill = Math.max(0, Math.min(1, shown - index));
          const pop = popped?.mark === mark;
          if (!interactive) {
            return (
              <span key={mark} className="os-rating-mark" aria-hidden>
                <Mark icon={icon} fill={fill} />
              </span>
            );
          }
          return (
            <button
              key={mark}
              ref={(node) => {
                marks.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={Math.ceil(value) === mark}
              aria-label={`${mark} of ${max}`}
              tabIndex={mark === focusMark ? 0 : -1}
              className={[
                "os-rating-mark",
                hover != null && mark <= Math.ceil(hover) && "os-rating-mark-preview",
                pop && "os-rating-mark-pop",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseMove={(event) => setHover(pointerValue(mark, event))}
              onFocus={() => setHover(null)}
              onClick={(event) => pick(pointerValue(mark, event))}
            >
              {/* Re-keyed on each pick so the pop replays without remounting the button. */}
              <span key={pop ? popped.key : 0} className="os-rating-mark-inner">
                <Mark icon={icon} fill={fill} />
              </span>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="os-rating-value">
          {format(value)} / {max}
        </span>
      )}
      {caption && <span className="os-rating-caption">{caption}</span>}
    </div>
  );
}
