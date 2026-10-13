"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "./Action";
import { Glyph, type GlyphName } from "./Glyph";

import type { NotificationTone } from "./Notification";

/** Where a triggered notification sits. Logical start/end mirror under RTL. */
export type NotificationPosition = "topStart" | "topEnd" | "bottomStart" | "bottomEnd";

/** A button on a triggered notification. Clicking it runs `onClick`, then dismisses. */
export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export interface ShowNotificationOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: NotificationTone;
  /** Corner of the viewport. */
  position?: NotificationPosition;
  /** How long it stays. 0 keeps it until dismissed. Hovering or focusing the card pauses it. */
  duration?: number;
  /** Leading visual in place of the tone icon — an avatar or a thumbnail. */
  start?: ReactNode;
  /** Replaces the tone's default icon. */
  icon?: ReactNode;
  /** Up to two buttons under the copy, such as Undo or View. */
  actions?: NotificationAction[];
  /** Draws the time left as a bar along the bottom edge. Defaults to true when it times out. */
  showProgress?: boolean;
}

export type NotificationDismiss = () => void;

const POSITIONS: NotificationPosition[] = ["topStart", "topEnd", "bottomStart", "bottomEnd"];
const TONE_GLYPH: Record<NotificationTone, GlyphName> = {
  accent: "info",
  success: "check",
  warning: "alert",
  danger: "alertCircle",
  neutral: "bell",
};
const DEFAULT_DURATION_MS = 5000;
const DEFAULT_POSITION: NotificationPosition = "topEnd";
/** Matches --duration-slow, so the card finishes its exit before it unmounts. */
const EXIT_MS = 200;

interface Notice {
  id: number;
  title: ReactNode;
  description?: ReactNode;
  tone: NotificationTone;
  position: NotificationPosition;
  duration: number;
  start?: ReactNode;
  icon?: ReactNode;
  actions: NotificationAction[];
  showProgress: boolean;
  leaving: boolean;
}

function exitDelay() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return 0;
  return EXIT_MS;
}

interface NotificationApi {
  show: (options: ShowNotificationOptions) => NotificationDismiss;
  dismiss: (id: number) => void;
  items: Notice[];
}

const NotificationContext = createContext<NotificationApi | null>(null);

/**
 * Mounts the four corners. JoinedProvider includes this, so useNotification
 * works anywhere inside it.
 */
export function NotificationViewport({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((all) => all.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((all) => all.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (options: ShowNotificationOptions): NotificationDismiss => {
      const id = nextId.current + 1;
      nextId.current = id;
      const notice: Notice = {
        id,
        title: options.title,
        description: options.description,
        tone: options.tone ?? "accent",
        position: options.position ?? DEFAULT_POSITION,
        duration: options.duration ?? DEFAULT_DURATION_MS,
        start: options.start,
        icon: options.icon,
        actions: (options.actions ?? []).slice(0, 2),
        showProgress: options.showProgress ?? true,
        leaving: false,
      };
      setItems((all) => [notice, ...all]);
      return () => dismiss(id);
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{ show, dismiss, items }}>
      {children}
      <NotificationStacks items={items} onDismiss={dismiss} onRemove={remove} />
    </NotificationContext.Provider>
  );
}

/** Show a notification at a corner. Returns a function that dismisses it. */
export function useNotification(): (options: ShowNotificationOptions) => NotificationDismiss {
  const api = useContext(NotificationContext);
  return useCallback(
    (options: ShowNotificationOptions) => {
      if (!api) {
        throw new Error("useNotification must be used inside NotificationViewport");
      }
      return api.show(options);
    },
    [api],
  );
}

function NotificationStacks({
  items,
  onDismiss,
  onRemove,
}: {
  items: Notice[];
  onDismiss: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof layer.showPopover !== "function") return;
    const open = items.length > 0;
    const isOpen = layer.matches(":popover-open");
    if (open && !isOpen) layer.showPopover();
    if (!open && isOpen) layer.hidePopover();
  }, [items.length]);

  if (!mounted) return null;

  return createPortal(
    <div ref={layerRef} popover="manual" className="os-note-layer">
      {POSITIONS.map((position) => (
        <NotificationStack
          key={position}
          position={position}
          items={items.filter((item) => item.position === position)}
          onDismiss={onDismiss}
          onRemove={onRemove}
        />
      ))}
    </div>,
    document.body,
  );
}

function NotificationStack({
  position,
  items,
  onDismiss,
  onRemove,
}: {
  position: NotificationPosition;
  items: Notice[];
  onDismiss: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  if (items.length === 0) return null;
  const fromBottom = position.startsWith("bottom");
  return (
    <div
      className={[
        "os-note-stack",
        `os-note-stack-${position}`,
        fromBottom && "os-note-stack-reverse",
      ]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-label="Notifications"
    >
      {items.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
          onDismiss={() => onDismiss(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}

function NotificationCard({
  item,
  onDismiss,
  onRemove,
}: {
  item: Notice;
  onDismiss: () => void;
  onRemove: () => void;
}) {
  const titleId = useId();
  const timed = item.duration > 0;

  useEffect(() => {
    if (!item.leaving) return;
    const timer = window.setTimeout(onRemove, exitDelay());
    return () => window.clearTimeout(timer);
  }, [item.leaving, onRemove]);

  return (
    <div
      className={["os-note-slot", item.leaving && "os-note-slot-leaving"].filter(Boolean).join(" ")}
    >
      <div
        className={`os-note-card os-note-card-${item.tone}`}
        role={item.tone === "danger" ? "alert" : "status"}
        aria-labelledby={titleId}
      >
        {item.start != null ? (
          <span className="os-note-card-start">{item.start}</span>
        ) : (
          <span className="os-note-card-icon" aria-hidden>
            {item.icon ?? <Glyph name={TONE_GLYPH[item.tone]} />}
          </span>
        )}
        <span className="os-note-card-copy">
          <span className="os-note-card-title" id={titleId}>
            {item.title}
          </span>
          {item.description != null && (
            <span className="os-note-card-description">{item.description}</span>
          )}
          {item.actions.length > 0 && (
            <span className="os-note-card-actions">
              {item.actions.map((action, index) => (
                <Button
                  key={action.label}
                  label={action.label}
                  size="sm"
                  variant={action.variant ?? (index === 0 ? "secondary" : "ghost")}
                  onClick={() => {
                    action.onClick();
                    onDismiss();
                  }}
                />
              ))}
            </span>
          )}
        </span>
        <button type="button" className="os-note-dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Glyph name="close" />
        </button>
        {/* The bar is the timer: it pauses with the card on hover or focus, and its end dismisses. */}
        {timed && !item.leaving && (
          <span
            className={[
              "os-note-card-progress",
              !item.showProgress && "os-note-card-progress-hidden",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ animationDuration: `${item.duration}ms` }}
            onAnimationEnd={onDismiss}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
