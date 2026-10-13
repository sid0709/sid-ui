"use client";

import { useId, type ReactNode } from "react";

import { Glyph } from "./Glyph";

/** Accent on the unread mark. The title always says what happened. */
export type NotificationTone = "accent" | "success" | "warning" | "danger" | "neutral";

export interface NotificationProps {
  /** Who or what this is about. */
  title: ReactNode;
  /** The one-line detail under the title. */
  description?: ReactNode;
  /** When it happened — a relative time or a short label. */
  time?: ReactNode;
  /** Leading visual — an avatar or an icon. */
  start?: ReactNode;
  /** A small icon pinned to the corner of `start`, tinted by `tone` — what kind of event this is. */
  badge?: ReactNode;
  /** Rich detail under the description: a quoted comment, a file, an amount. Keep it non-interactive. */
  preview?: ReactNode;
  /** Buttons under the copy, such as Accept and Decline. */
  actions?: ReactNode;
  /** A trailing next step, such as a button or a link. */
  action?: ReactNode;
  /** Draws the unread mark. Read items stay quiet. */
  unread?: boolean;
  tone?: NotificationTone;
  href?: string;
  onClick?: () => void;
  /** Removes the item. The button is labelled for assistive tech. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

export interface NotificationListProps {
  children: ReactNode;
  /** Accessible name for the list. */
  label?: string;
  /** Title and actions above the list, such as “Mark all read”. */
  header?: ReactNode;
  /** Shown in place of the rows when there are none. */
  empty?: ReactNode;
}

export interface NotificationGroupProps {
  /** The section title, such as “Today” or “Earlier”. */
  label: ReactNode;
  children: ReactNode;
}

function hasItems(children: ReactNode) {
  const filled = (child: ReactNode) => child != null && child !== false;
  return Array.isArray(children) ? children.some(filled) : filled(children);
}

/** A feed of things that happened — unread marks, times, and optional actions. */
export function NotificationList({
  children,
  label = "Notifications",
  header,
  empty,
}: NotificationListProps) {
  const showEmpty = empty != null && !hasItems(children);
  return (
    <section className="os-notes" aria-label={header ? undefined : label}>
      {header && <div className="os-notes-header">{header}</div>}
      {showEmpty ? (
        <div className="os-notes-empty">{empty}</div>
      ) : (
        <ul className="os-notes-list" aria-label={header ? label : undefined}>
          {children}
        </ul>
      )}
    </section>
  );
}

export interface NotificationIconProps {
  /** An Icon or Glyph. */
  icon: ReactNode;
  tone?: NotificationTone;
}

/** A tinted round icon for `start` when the event comes from the system, not a person. */
export function NotificationIcon({ icon, tone = "accent" }: NotificationIconProps) {
  return (
    <span className={`os-note-icon os-note-icon-${tone}`} aria-hidden>
      {icon}
    </span>
  );
}

/** A labelled run of notifications inside a NotificationList — “Today”, “This week”. */
export function NotificationGroup({ label, children }: NotificationGroupProps) {
  const id = useId();
  return (
    <li className="os-note-group">
      <div className="os-note-group-label" id={id}>
        {label}
      </div>
      <ul className="os-notes-list" aria-labelledby={id}>
        {children}
      </ul>
    </li>
  );
}

/**
 * One item in a notification feed. Unread items announce themselves; the title carries the
 * meaning. With `href` or `onClick` the whole row is the target, while `actions`, `action`,
 * and the dismiss button stay separately clickable.
 */
export function Notification({
  title,
  description,
  time,
  start,
  badge,
  preview,
  actions,
  action,
  unread = false,
  tone = "accent",
  href,
  onClick,
  onDismiss,
  dismissLabel = "Dismiss",
}: NotificationProps) {
  const label = (
    <>
      {unread && <span className="os-sr">Unread. </span>}
      {title}
    </>
  );

  return (
    <li
      className={[
        "os-note",
        unread && "os-note-unread",
        (href || onClick) && "os-note-interactive",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="os-note-main">
        <span
          className={["os-note-mark", unread && `os-note-tone-${tone}`].filter(Boolean).join(" ")}
          aria-hidden
        />
        {start != null && (
          <span className="os-note-start">
            {start}
            {badge != null && (
              <span className={`os-note-badge os-note-badge-${tone}`} aria-hidden>
                {badge}
              </span>
            )}
          </span>
        )}
        <span className="os-note-body">
          <span className="os-note-title">
            {href ? (
              <a className="os-note-hit" href={href}>
                {label}
              </a>
            ) : onClick ? (
              <button type="button" className="os-note-hit" onClick={onClick}>
                {label}
              </button>
            ) : (
              label
            )}
          </span>
          {description != null && <span className="os-note-description">{description}</span>}
          {preview != null && <span className="os-note-preview">{preview}</span>}
          {actions != null && <span className="os-note-actions">{actions}</span>}
        </span>
        {time != null && <span className="os-note-time">{time}</span>}
      </div>
      {action && <span className="os-note-action">{action}</span>}
      {onDismiss && (
        <button
          type="button"
          className="os-note-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <Glyph name="close" />
        </button>
      )}
    </li>
  );
}
