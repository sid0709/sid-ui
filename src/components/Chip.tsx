"use client";

import {
  createContext,
  useContext,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Glyph } from "./Glyph";

export type ChipColor =
  | "neutral"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "purple"
  | "pink"
  | "teal"
  | "orange"
  | "cyan";

/** filled is a solid tint, soft a lighter one, outlined a hairline on the surface. */
export type ChipVariant = "filled" | "soft" | "outlined";

export type ChipSize = "sm" | "md" | "lg";

export interface ChipProps {
  label: ReactNode;
  /** Identifies the chip inside a ChipGroup. */
  value?: string;
  variant?: ChipVariant;
  color?: ChipColor;
  size?: ChipSize;
  /** Leading visual — an Icon, a small Avatar, or a color swatch. */
  start?: ReactNode;
  /** A trailing count, such as the number of results behind a filter. */
  count?: number;
  /** Selected filter chips take the accent and grow a check mark. */
  isSelected?: boolean;
  isDisabled?: boolean;
  /** Makes the chip a button. Inside a ChipGroup the group handles clicks. */
  onClick?: () => void;
  /** Makes the chip a link. */
  href?: string;
  /** Adds a remove button. The chip collapses away first, then this runs. */
  onRemove?: () => void;
  removeLabel?: string;
}

type GroupContext = {
  selected: string[];
  toggle: (value: string) => void;
  /** Unset for a plain group that only shares size and variant. */
  mode?: "single" | "multiple";
  size?: ChipSize;
  variant?: ChipVariant;
};

const ChipGroupContext = createContext<GroupContext | null>(null);

/** Matches the collapse in chip.css, so the chip is gone before the parent drops it. */
const REMOVE_MS = 180;

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A compact, rounded label: a tag, a filter, a removable input, or a small action. Put several
 * in a ChipGroup to make them a single or multiple choice.
 */
export function Chip({
  label,
  value,
  variant,
  color = "neutral",
  size,
  start,
  count,
  isSelected,
  isDisabled = false,
  onClick,
  href,
  onRemove,
  removeLabel = "Remove",
}: ChipProps) {
  const group = useContext(ChipGroupContext);
  const [leaving, setLeaving] = useState(false);
  const inGroup = group?.mode != null && value != null;
  const selected = inGroup ? (group?.selected.includes(value) ?? false) : Boolean(isSelected);
  const resolvedSize = size ?? group?.size ?? "md";
  const resolvedVariant = variant ?? group?.variant ?? "soft";
  const selectable = inGroup || isSelected !== undefined;

  const remove = () => {
    if (!onRemove || leaving) return;
    if (reducedMotion()) {
      onRemove();
      return;
    }
    setLeaving(true);
    window.setTimeout(onRemove, REMOVE_MS);
  };

  const content = (
    <>
      {selectable && (
        <span className="os-chip-check" aria-hidden>
          <span>
            <Glyph name="check" />
          </span>
        </span>
      )}
      {start != null && <span className="os-chip-start">{start}</span>}
      <span className="os-chip-label">{label}</span>
      {count != null && <span className="os-chip-count">{count}</span>}
    </>
  );

  const className = [
    "os-chip",
    `os-chip-${resolvedVariant}`,
    `os-chip-${color}`,
    `os-chip-${resolvedSize}`,
    selected && "os-chip-selected",
    isDisabled && "os-chip-disabled",
    onRemove && "os-chip-removable",
    leaving && "os-chip-leaving",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (inGroup) group?.toggle(value);
    onClick?.();
  };

  let main: ReactNode;
  if (href && !isDisabled) {
    main = (
      <a className="os-chip-main" href={href}>
        {content}
      </a>
    );
  } else if (inGroup || onClick || selectable) {
    const single = inGroup && group?.mode === "single";
    main = (
      <button
        type="button"
        className="os-chip-main"
        onClick={handleClick}
        disabled={isDisabled}
        role={single ? "radio" : undefined}
        aria-checked={single ? selected : undefined}
        aria-pressed={!single && selectable ? selected : undefined}
      >
        {content}
      </button>
    );
  } else {
    main = <span className="os-chip-main">{content}</span>;
  }

  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (onRemove && (event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      remove();
    }
  };

  return (
    <span className={className} onKeyDown={onRemove ? onKeyDown : undefined}>
      <span className="os-chip-inner">
        {main}
        {onRemove && (
          <button
            type="button"
            className="os-chip-remove"
            aria-label={typeof label === "string" ? `${removeLabel} ${label}` : removeLabel}
            onClick={remove}
            disabled={isDisabled}
          >
            <Glyph name="close" />
          </button>
        )}
      </span>
    </span>
  );
}

export interface ChipGroupProps {
  children: ReactNode;
  /** Accessible name for the set. */
  label: string;
  /** single behaves like radio buttons, multiple like toggles. Omit for a plain set of chips. */
  selectionMode?: "single" | "multiple";
  /** Selected chip values. */
  value?: string[];
  onChange?: (value: string[]) => void;
  /** single mode: allow clicking the selected chip to clear it. */
  isClearable?: boolean;
  size?: ChipSize;
  variant?: ChipVariant;
  /** Lays the chips in one scrolling row instead of wrapping. */
  isScrollable?: boolean;
}

/** A row of chips that share a size and, optionally, a selection. */
export function ChipGroup({
  children,
  label,
  selectionMode,
  value = [],
  onChange,
  isClearable = false,
  size,
  variant,
  isScrollable = false,
}: ChipGroupProps) {
  const toggle = (chip: string) => {
    if (!onChange) return;
    if (selectionMode === "single") {
      const isOn = value.includes(chip);
      onChange(isOn ? (isClearable ? [] : value) : [chip]);
    } else {
      onChange(value.includes(chip) ? value.filter((v) => v !== chip) : [...value, chip]);
    }
  };

  const role = selectionMode === "single" ? "radiogroup" : "group";
  const groupClass = ["os-chip-group", isScrollable && "os-chip-group-scroll"]
    .filter(Boolean)
    .join(" ");

  return (
    <ChipGroupContext.Provider
      value={{ selected: value, toggle, mode: selectionMode, size, variant }}
    >
      <div className={groupClass} role={role} aria-label={label}>
        {children}
      </div>
    </ChipGroupContext.Provider>
  );
}
