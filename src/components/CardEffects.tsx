"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Glyph } from "./Glyph";

/** lift rises on hover; tilt leans toward the pointer with a glare; spotlight glows under it. */
export type MotionCardEffect = "lift" | "tilt" | "spotlight";

export interface MotionCardProps {
  children: ReactNode;
  effect?: MotionCardEffect;
  /** Inner padding as any CSS length. */
  padding?: string;
  /** Width as a number of px or any CSS width. */
  width?: number | string;
  /** Tilt only: the largest lean in degrees. */
  maxTilt?: number;
  /** Spotlight and tilt: the glow color. Defaults to the accent. */
  glowColor?: string;
  className?: string;
}

function size(value: number | string | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * A card that answers the pointer. The effect is pure CSS driven by custom properties, so moving
 * the pointer never re-renders React. Reduced motion keeps the glow and drops the movement.
 */
export function MotionCard({
  children,
  effect = "lift",
  padding = "var(--spacing-5)",
  width,
  maxTilt = 10,
  glowColor,
  className,
}: MotionCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || effect === "lift") return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    node.style.setProperty("--os-mc-x", `${x * 100}%`);
    node.style.setProperty("--os-mc-y", `${y * 100}%`);
    if (effect === "tilt") {
      node.style.setProperty("--os-mc-rx", `${(0.5 - y) * maxTilt * 2}deg`);
      node.style.setProperty("--os-mc-ry", `${(x - 0.5) * maxTilt * 2}deg`);
    }
  };

  const onPointerLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--os-mc-rx", "0deg");
    node.style.setProperty("--os-mc-ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={["os-mc", `os-mc-${effect}`, className].filter(Boolean).join(" ")}
      style={
        {
          "--os-mc-pad": padding,
          "--os-mc-glow": glowColor,
          width: size(width),
        } as CSSProperties
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="os-mc-body">{children}</div>
      {effect !== "lift" && <span className="os-mc-light" aria-hidden />}
    </div>
  );
}

export interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  /** Controlled side. Omit to let the card flip itself. */
  isFlipped?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
  /** Both faces share this height. */
  height: number | string;
  width?: number | string;
  /** Names the flip button for assistive tech. */
  label?: string;
  /** vertical flips over the top edge instead of the side. */
  direction?: "horizontal" | "vertical";
}

/**
 * Two faces on one card. The round button in the corner turns it over (or flip it from outside
 * with `isFlipped`); the hidden face is inert so focus and screen readers stay on the visible side.
 */
export function FlipCard({
  front,
  back,
  isFlipped,
  onFlipChange,
  height,
  width,
  label = "Flip card",
  direction = "horizontal",
}: FlipCardProps) {
  const [own, setOwn] = useState(false);
  const flipped = isFlipped ?? own;
  const flip = () => {
    if (isFlipped === undefined) setOwn(!flipped);
    onFlipChange?.(!flipped);
  };

  return (
    <div
      className={["os-flip", `os-flip-${direction}`, flipped && "os-flip-on"].filter(Boolean).join(" ")}
      style={{ height: size(height), width: size(width) }}
    >
      <div className="os-flip-inner">
        <div className="os-flip-face os-flip-front" inert={flipped}>
          {front}
        </div>
        <div className="os-flip-face os-flip-back" inert={!flipped}>
          {back}
        </div>
      </div>
      <button
        type="button"
        className="os-flip-toggle"
        aria-label={label}
        aria-pressed={flipped}
        onClick={flip}
      >
        <Glyph name="refresh" />
      </button>
    </div>
  );
}

export interface ExpandableCardProps {
  /** Always visible; clicking it toggles the body. */
  header: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  width?: number | string;
}

/** A card whose body slides open under its header — FAQs, job details, order lines. */
export function ExpandableCard({
  header,
  children,
  defaultExpanded = false,
  isExpanded,
  onExpandedChange,
  width,
}: ExpandableCardProps) {
  const id = useId();
  const [own, setOwn] = useState(defaultExpanded);
  const open = isExpanded ?? own;
  const toggle = () => {
    if (isExpanded === undefined) setOwn(!open);
    onExpandedChange?.(!open);
  };

  return (
    <div className={open ? "os-xcard os-xcard-open" : "os-xcard"} style={{ width: size(width) }}>
      <button
        type="button"
        className="os-xcard-head"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        <span className="os-xcard-title">{header}</span>
        <span className="os-xcard-chevron" aria-hidden>
          <Glyph name="chevronDown" />
        </span>
      </button>
      <div className="os-xcard-panel" id={id} inert={!open}>
        <div className="os-xcard-body">{children}</div>
      </div>
    </div>
  );
}
