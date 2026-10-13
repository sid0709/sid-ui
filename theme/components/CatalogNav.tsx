"use client";

import { BRAND_NAME, JoinedMark, SideNav, useAppShellMobile } from "sid-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { ALL_ITEMS, CATALOG, itemHref, type CatalogItem } from "@/lib/catalog";

import "./catalog-nav.css";

const RECENT_KEY = "sid-ui-docs:recent";
const OPEN_KEY = "sid-ui-docs:open-groups";
const RECENT_LIMIT = 3;
const REPO_URL = "https://github.com/sid0709/sid-ui";

/** Per-category glyph (Lucide geometry, 24×24, 2px stroke) and tint. */
const CATEGORY_LOOK: Record<string, { hue: string; glyph: ReactNode }> = {
  Foundations: {
    hue: "blue",
    glyph: (
      <>
        <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      </>
    ),
  },
  Action: {
    hue: "purple",
    glyph: (
      <>
        <path d="M14 4.1 12 6" />
        <path d="m5.1 8-2.9-.8" />
        <path d="m6 12-1.9 2" />
        <path d="M7.2 2.2 8 5.1" />
        <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
      </>
    ),
  },
  Layout: {
    hue: "teal",
    glyph: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </>
    ),
  },
  Content: {
    hue: "orange",
    glyph: (
      <>
        <path d="M12 4v16" />
        <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
        <path d="M9 20h6" />
      </>
    ),
  },
  Container: {
    hue: "cyan",
    glyph: (
      <>
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
      </>
    ),
  },
  "Data input": {
    hue: "green",
    glyph: (
      <>
        <path d="M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" />
        <path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" />
        <path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
        <path d="M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" />
        <path d="M9 6v12" />
      </>
    ),
  },
  "Feedback & status": {
    hue: "yellow",
    glyph: (
      <>
        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
      </>
    ),
  },
  Navigation: {
    hue: "blue",
    glyph: (
      <>
        <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
        <circle cx="12" cy="12" r="10" />
      </>
    ),
  },
  Overlay: {
    hue: "pink",
    glyph: (
      <>
        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </>
    ),
  },
  "Table & list": {
    hue: "teal",
    glyph: (
      <>
        <path d="M12 3v18" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </>
    ),
  },
  Charts: {
    hue: "purple",
    glyph: (
      <>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </>
    ),
  },
  Chat: {
    hue: "green",
    glyph: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  },
  Utility: {
    hue: "gray",
    glyph: (
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    ),
  },
};

function Glyph({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is a convenience; the nav works without it.
  }
}

function matches(item: CatalogItem, q: string) {
  return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
}

/** Title with the first match of the query marked. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

function groupOf(path: string) {
  return CATALOG.find((g) => g.items.some((item) => itemHref(item.slug) === path))?.category;
}

function withGroup(open: Set<string>, path: string) {
  const group = groupOf(path);
  return !group || open.has(group) ? open : new Set(open).add(group);
}

function withRecent(recent: string[], path: string) {
  const slug = ALL_ITEMS.find((item) => itemHref(item.slug) === path)?.slug;
  if (!slug || recent[0] === slug) return recent;
  return [slug, ...recent.filter((s) => s !== slug)].slice(0, RECENT_LIMIT + 1);
}

export function CatalogNav({ path }: { path: string }) {
  const router = useRouter();
  const { closeMobileNav } = useAppShellMobile();
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState(() => withRecent(readStored(RECENT_KEY, []), path));
  const [open, setOpen] = useState(() => withGroup(new Set(readStored<string[]>(OPEN_KEY, [])), path));
  const [seenPath, setSeenPath] = useState(path);

  const activeGroup = groupOf(path);
  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  // On navigation, open the new page's group and remember the page as recent.
  if (seenPath !== path) {
    setSeenPath(path);
    setOpen(withGroup(open, path));
    setRecent(withRecent(recent, path));
  }

  useEffect(() => writeStored(RECENT_KEY, recent), [recent]);
  useEffect(() => writeStored(OPEN_KEY, [...open]), [open]);

  // Bring the current page into view after navigation.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLElement>('.cn-item[aria-current="page"]')
        ?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);

  // ⌘K / Ctrl+K anywhere, or "/" outside a text field, jumps to search.
  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? "");
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = useMemo(() => {
    if (!isSearching) return CATALOG;
    return CATALOG.map((group) => ({
      ...group,
      items: group.items.filter((item) => matches(item, q)),
    })).filter((group) => group.items.length > 0);
  }, [q, isSearching]);

  const results = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const recentItems = useMemo(
    () =>
      recent
        .filter((slug) => itemHref(slug) !== path)
        .slice(0, RECENT_LIMIT)
        .flatMap((slug) => ALL_ITEMS.filter((item) => item.slug === slug)),
    [recent, path],
  );

  const toggle = useCallback((category: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const allOpen = open.size >= CATALOG.length;
  const setAll = () => setOpen(allOpen ? new Set(activeGroup ? [activeGroup] : []) : new Set(CATALOG.map((g) => g.category)));

  function onSearchKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!results.length) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (cursor + step + results.length) % results.length;
      setCursor(next);
      listRef.current
        ?.querySelector<HTMLElement>(`[data-result="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && isSearching && results[cursor]) {
      event.preventDefault();
      router.push(itemHref(results[cursor].slug));
      setQuery("");
      searchRef.current?.blur();
      closeMobileNav();
    } else if (event.key === "Escape") {
      if (query) setQuery("");
      else searchRef.current?.blur();
    }
  }

  const shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
  let resultIndex = -1;

  return (
    <SideNav
      className="cn"
      header={
        <Link href="/" className="cn-brand">
          <JoinedMark size="2.25rem" label="" />
          <span className="cn-brand-text">
            <span className="cn-brand-name">sid-ui</span>
            <span className="cn-brand-meta">
              {BRAND_NAME} design system · {ALL_ITEMS.length} pages
            </span>
          </span>
        </Link>
      }
      topContent={
        <div className="cn-search">
          <Glyph size={16}>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </Glyph>
          <input
            ref={searchRef}
            type="search"
            aria-label="Search components"
            placeholder="Search components"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={onSearchKey}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="cn-search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
            >
              <Glyph size={14}>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </Glyph>
            </button>
          ) : (
            <kbd className="cn-kbd" aria-hidden>
              {shortcut}
            </kbd>
          )}
        </div>
      }
      footer={
        <div className="cn-footer">
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="cn-footer-link">
            <Glyph size={15}>
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </Glyph>
            GitHub
          </a>
          <span className="cn-footer-hint">
            <kbd className="cn-kbd">/</kbd> to search
          </span>
        </div>
      }
    >
      {/* Any link in the list ends the search and closes the mobile drawer. */}
      <div
        className="cn-body"
        ref={listRef}
        onClick={(event) => {
          if (!(event.target as Element).closest("a")) return;
          setQuery("");
          closeMobileNav();
        }}
      >
        {!isSearching && (
          <>
            <Link
              href="/"
              className="cn-top"
              aria-current={path === "/" ? "page" : undefined}
            >
              <span className="cn-tile" data-hue="accent">
                <Glyph size={16}>
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </Glyph>
              </span>
              Overview
            </Link>

            {recentItems.length > 0 && (
              <section className="cn-section">
                <h2 className="cn-label">Recently viewed</h2>
                {recentItems.map((item) => (
                  <Link key={item.slug} href={itemHref(item.slug)} className="cn-recent">
                    <Glyph size={14}>
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M12 7v5l4 2" />
                    </Glyph>
                    {item.title}
                  </Link>
                ))}
              </section>
            )}
          </>
        )}

        <section className="cn-section">
          <div className="cn-label-row">
            <h2 className="cn-label" aria-live="polite">
              {isSearching
                ? `${results.length} ${results.length === 1 ? "result" : "results"}`
                : "Components"}
            </h2>
            {!isSearching && (
              <button type="button" className="cn-label-action" onClick={setAll}>
                {allOpen ? "Collapse all" : "Expand all"}
              </button>
            )}
          </div>

          {groups.map((group) => {
            const look = CATEGORY_LOOK[group.category] ?? CATEGORY_LOOK.Utility;
            const isOpen = isSearching || open.has(group.category);
            const isActive = group.category === activeGroup;
            const panelId = `cn-group-${group.category.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <div
                key={group.category}
                className="cn-group"
                data-open={isOpen || undefined}
                data-active={isActive || undefined}
              >
                <button
                  type="button"
                  className="cn-group-head"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(group.category)}
                  disabled={isSearching}
                >
                  <span className="cn-tile" data-hue={look.hue}>
                    <Glyph size={16}>{look.glyph}</Glyph>
                  </span>
                  <span className="cn-group-name">{group.category}</span>
                  <span className="cn-count">{group.items.length}</span>
                  <span className="cn-chevron">
                    <Glyph size={14}>
                      <path d="m9 18 6-6-6-6" />
                    </Glyph>
                  </span>
                </button>
                <div className="cn-panel" id={panelId} inert={!isOpen}>
                  <ul className="cn-items">
                    {group.items.map((item) => {
                      const href = itemHref(item.slug);
                      const index = isSearching ? ++resultIndex : -1;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={href}
                            className="cn-item"
                            aria-current={path === href ? "page" : undefined}
                            data-result={isSearching ? index : undefined}
                            data-cursor={isSearching && index === cursor ? true : undefined}
                            title={item.description}
                          >
                            {isSearching ? (
                              <Fragment>
                                <span className="cn-item-title">
                                  <Highlight text={item.title} query={q} />
                                </span>
                                <span className="cn-item-desc">{item.description}</span>
                              </Fragment>
                            ) : (
                              item.title
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}

          {isSearching && results.length === 0 && (
            <div className="cn-empty">
              <Glyph size={20}>
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </Glyph>
              <p>
                Nothing matches “{query.trim()}”.
                <br />
                Try a shorter word, like “chart” or “input”.
              </p>
            </div>
          )}
        </section>
      </div>
    </SideNav>
  );
}
