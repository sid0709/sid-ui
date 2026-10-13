import type { IconName } from "sid-ui";

export type CatalogItem = {
  slug: string;
  title: string;
  description: string;
  importName: string;
  /** Example code for the Usage tab, after the import. */
  usage?: string;
};

export type CatalogGroup = {
  category: string;
  icon: IconName;
  items: CatalogItem[];
};

export const CATALOG: CatalogGroup[] = [
  {
    category: "Foundations",
    icon: "wrench",
    items: [
      {
        slug: "tokens",
        title: "Tokens",
        description: "Joined theme primitives — Meta blue accent, system fonts, space, radius.",
        importName: "tokens",
      },
      {
        slug: "brand",
        title: "Brand",
        description:
          "The Joined wordmark and app icon — blue first, which logo goes where, and what not to do.",
        importName: "JoinedLogo, JoinedMark, BRAND_NAME",
        usage: `// The wordmark. Blue by default; it brightens itself in dark mode.
<JoinedLogo height="2rem" />

// White on accent or photo surfaces; original colors for marketing moments only.
<JoinedLogo variant="white" />
<JoinedLogo variant="original" />

// The app icon tile, and the bare symbol for tight spaces.
<JoinedMark size="2.5rem" />
<JoinedMark variant="blue" size="1rem" label="" />`,
      },
      {
        slug: "brand-heading",
        title: "Brand Heading",
        description:
          "The TopNav heading for every app: the blue wordmark for Joined, the app icon beside a product name.",
        importName: "BrandHeading",
        usage: `// Joined itself
<TopNav heading={<BrandHeading headingHref="/" />} />

// A product under Joined
<TopNav heading={<BrandHeading product="Scoutwell" headingHref="/dashboard" />} />`,
      },
      {
        slug: "brand-lockup",
        title: "Brand Lockup",
        description: "The logo block that opens sign-in, sign-up, onboarding, and error pages.",
        importName: "BrandLockup",
        usage: `<BrandLockup tagline="Find the right people for meaningful work." />
<BrandLockup product="Scoutwell" tagline="Sign in to keep scouting." />`,
      },
      {
        slug: "brand-footer",
        title: "Brand Footer",
        description: "A quiet “Part of Joined” sign-off under landing, auth, and error pages.",
        importName: "BrandFooter",
        usage: `<BrandFooter />
<BrandFooter lead="Scoutwell is part of" align="start" />`,
      },
      {
        slug: "google-sign-in-button",
        title: "Google Sign-in Button",
        description:
          "“Continue with Google” for sign-in and sign-up pages. It posts to the app’s Google route.",
        importName: "GoogleSignInButton",
        usage: `<GoogleSignInButton action="/api/auth/google" next="/jobs" />
<GoogleSignInButton action="/api/auth/google" label="Sign up with Google" />`,
      },
    ],
  },
  {
    category: "Action",
    icon: "check",
    items: [
      {
        slug: "button",
        title: "Button",
        description: "Primary, outline, and pill. Sizes are sm, md, and lg.",
        importName: "Button",
      },
      {
        slug: "button-group",
        title: "Button Group",
        description: "Joined actions, including a fully round pill group.",
        importName: "ButtonGroup",
      },
      {
        slug: "icon-button",
        title: "Icon Button",
        description: "Icon-only actions, including a circular pill.",
        importName: "IconButton",
      },
      {
        slug: "link",
        title: "Link",
        description: "Navigation, never an action.",
        importName: "Link",
      },
      {
        slug: "dropdown-menu",
        title: "Dropdown Menu",
        description: "A trigger-anchored list of actions.",
        importName: "DropdownMenu",
      },
      {
        slug: "more-menu",
        title: "More Menu",
        description: "The overflow trigger variant of Menu.",
        importName: "MoreMenu",
      },
      {
        slug: "segmented-control",
        title: "Segmented Control",
        description: "A closed set of mutually exclusive views.",
        importName: "SegmentedControl",
      },
      {
        slug: "toggle-button",
        title: "Toggle Button",
        description:
          "A binary on/off control. Pressed: accent icon and label on a weak accent wash.",
        importName: "ToggleButton",
      },
      {
        slug: "toggle-button-group",
        title: "Toggle Button Group",
        description: "Independent toggles that share one group.",
        importName: "ToggleButtonGroup",
      },
      {
        slug: "toolbar",
        title: "Toolbar",
        description: "A row of related controls.",
        importName: "Toolbar",
      },
    ],
  },
  {
    category: "Layout",
    icon: "viewColumns",
    items: [
      {
        slug: "app-shell",
        title: "App Shell",
        description:
          "The product frame — top nav, side nav, and a content area that turns into a mobile drawer by breakpoint.",
        importName: "AppShell",
      },
      {
        slug: "aspect-ratio",
        title: "Aspect Ratio",
        description: "Keeps media at a fixed shape at any width — covers, heroes, avatars.",
        importName: "AspectRatio",
      },
      {
        slug: "divider",
        title: "Divider",
        description: "Subtle or strong rules, with labels, vertical, and full-bleed.",
        importName: "Divider",
      },
      {
        slug: "form-layout",
        title: "Form Layout",
        description: "Field spacing and rows, plus responsive one- to two-column forms.",
        importName: "FormLayout",
      },
      {
        slug: "grid",
        title: "Grid",
        description:
          "A responsive 12-track grid — spans, order, and visibility per tier — plus Astryx’s intrinsic Grid.",
        importName: "GridSystem",
      },
      {
        slug: "layout",
        title: "Layout",
        description: "Header, footer, start and end panels around scrolling content.",
        importName: "Layout",
      },
      {
        slug: "section",
        title: "Section",
        description: "Surfaces, padding, and dividers for grouping content.",
        importName: "Section",
      },
      {
        slug: "stack",
        title: "Stack",
        description:
          "Gapped rows and columns, plus ResponsiveStack that turns a column into a row by tier.",
        importName: "Stack",
      },
      {
        slug: "resize-handle",
        title: "Resize Handle",
        description: "Drag to size panes — pixels or percent, collapsible, with snap points.",
        importName: "ResizeHandle",
      },
      {
        slug: "scrollable-area",
        title: "Scrollable Area",
        description:
          "Contained scrolling on one or both axes, for lists, rails, and wide tables. Sideways rows fade at the clipped edge.",
        importName: "ScrollableArea",
      },
      {
        slug: "sticky",
        title: "Sticky",
        description:
          "Keeps a detail pane or summary in view while its column scrolls — or fills the view and scrolls inside.",
        importName: "Sticky",
      },
    ],
  },
  {
    category: "Content",
    icon: "copy",
    items: [
      {
        slug: "avatar",
        title: "Avatar",
        description:
          "A person as an image, initials, or glyph — sizes, shapes, status dots, links, and stacked groups.",
        importName: "Avatar",
      },
      {
        slug: "blockquote",
        title: "Blockquote",
        description:
          "A quoted passage with an optional rich attribution — articles, release notes, testimonials.",
        importName: "Blockquote",
      },
      {
        slug: "citation",
        title: "Citation",
        description:
          "A source chip as a label or a number, inline in copy or paired with a footnote list.",
        importName: "Citation",
      },
      {
        slug: "code",
        title: "Code",
        description:
          "Inline monospace for props, paths, and commands — in copy, headings, and links.",
        importName: "Code",
      },
      {
        slug: "code-block",
        title: "Code Block",
        description:
          "Highlighted samples with titles, line numbers, highlights, copy, wrapping, and collapsing.",
        importName: "CodeBlock",
      },
      {
        slug: "empty-state",
        title: "Empty State",
        description:
          "Says what will fill this space — icons, actions, search misses, errors, and compact panels.",
        importName: "EmptyState",
      },
      {
        slug: "heading",
        title: "Heading",
        description:
          "h1–h6 plus display types, with outline-only levels, truncation, and balanced wrapping.",
        importName: "Heading",
      },
      {
        slug: "glyph",
        title: "Glyph",
        description:
          "The Joined stroke set — one 24px grid, 2px stroke, round caps. Sun and moon included.",
        importName: "Glyph",
      },
      {
        slug: "icon",
        title: "Icon",
        description:
          "The Astryx registry and the Joined glyph set — sizes, semantic and palette colors, and labels.",
        importName: "Icon",
      },
      {
        slug: "kbd",
        title: "Kbd",
        description:
          "Platform-aware shortcuts — special keys, combinations, buttons, and shortcut sheets.",
        importName: "Kbd",
      },
      {
        slug: "markdown",
        title: "Markdown",
        description:
          "Documents, code, tables, links, citations, compact density, and streaming answers.",
        importName: "Markdown",
      },
      {
        slug: "text",
        title: "Text",
        description:
          "Body copy from the type scale — types, sizes, weights, colors, truncation, and wrapping.",
        importName: "Text",
      },
      {
        slug: "thumbnail",
        title: "Thumbnail",
        description: "An image preview that loads, fails, removes, opens, and uploads.",
        importName: "Thumbnail",
      },
      {
        slug: "timestamp",
        title: "Timestamp",
        description:
          "Every relative and absolute format, live updates, time zones, and a copyable hover card.",
        importName: "Timestamp",
      },
      {
        slug: "chip",
        title: "Chip",
        description:
          "Filter, input, suggestion, and people chips — ten colors, three variants, single or multiple selection, and a collapse on remove.",
        importName: "Chip, ChipGroup",
        usage: `<ChipGroup label="Job type" selectionMode="multiple" value={types} onChange={setTypes}>
  <Chip value="full-time" label="Full-time" count={12} />
  <Chip value="contract" label="Contract" count={8} />
</ChipGroup>

<Chip label="Figma" variant="outlined" onRemove={() => remove("Figma")} />
<Chip label="Alex Rivera" start={<Avatar name="Alex Rivera" size="xsm" />} />
<Chip label="Summarize" start={<Icon icon={icons.sparkle} />} onClick={run} />
<Chip label="Urgent" color="red" variant="filled" />`,
      },
      {
        slug: "token",
        title: "Token",
        description:
          "A tag or filter chip — sizes, colors, icons, removable, clickable, and linked.",
        importName: "Token",
      },
    ],
  },
  {
    category: "Container",
    icon: "menu",
    items: [
      {
        slug: "card",
        title: "Card",
        description:
          "Spotlight, tilt, and lift motion cards, flip and expandable cards, a live dashboard card, a deck, and loading states — plus variants, clickable, selectable, and room cards.",
        importName: "Card, MotionCard, FlipCard, ExpandableCard",
        usage: `<MotionCard effect="spotlight">…</MotionCard>
<MotionCard effect="tilt" maxTilt={12}>…</MotionCard>

<FlipCard height={180} front={<Question />} back={<Answer />} />

<ExpandableCard header={<Text weight="semibold">How long does a room stay open?</Text>}>
  <Text>You pick — from 24 hours to two weeks.</Text>
</ExpandableCard>`,
      },
      {
        slug: "carousel",
        title: "Carousel",
        description:
          "Scrolling rails with snap, loop, and edge fade — rooms, testimonials, attachments, and guided steps.",
        importName: "Carousel",
      },
      {
        slug: "collapsible",
        title: "Collapsible",
        description:
          "Disclosures and accordions — controlled, grouped, dense or roomy, with rich triggers.",
        importName: "Collapsible",
      },
    ],
  },
  {
    category: "Data input",
    icon: "search",
    items: [
      {
        slug: "calendar",
        title: "Calendar",
        description: "A month grid or a weekly schedule, at sm, md, and lg.",
        importName: "Calendar",
      },
      {
        slug: "checkbox",
        title: "Checkbox",
        description: "Single boxes, select-all, validation, async saves, and checkbox lists.",
        importName: "CheckboxInput",
      },
      {
        slug: "code-input",
        title: "Code Input",
        description:
          "Clean cells where each digit spins up like a phone’s scroll wheel — paste, backspace, PINs, and success and error motion.",
        importName: "CodeInput",
      },
      {
        slug: "date-input",
        title: "Date Input",
        description:
          "Dates, ranges with presets, and date-times — formats, limits, and blocked days.",
        importName: "DateInput",
      },
      {
        slug: "field",
        title: "Field",
        description: "Label, description, and status for any control — including your own.",
        importName: "Field",
      },
      {
        slug: "file-input",
        title: "File Input",
        description: "Drop zones and compact inputs — many files, size limits, and uploads.",
        importName: "FileInput",
      },
      {
        slug: "number-input",
        title: "Number Input",
        description: "Steppers, units, currency formatting, limits, and a live bid calculator.",
        importName: "NumberInput",
      },
      {
        slug: "radio",
        title: "Radio",
        description: "One choice from a list — descriptions, icons, prices, and horizontal rows.",
        importName: "RadioList",
      },
      {
        slug: "select",
        title: "Selector",
        description: "Single and multi select — sections, search, avatars, and ghost menus.",
        importName: "Selector",
      },
      {
        slug: "rating",
        title: "Rating",
        description:
          "Gold stars or rose hearts — hover preview, a pop on pick, half steps, fractional averages, and keyboard support.",
        usage: `<Rating value={score} onChange={setScore} caption="Great" />
<Rating icon="heart" value={love} onChange={setLove} />
<Rating value={3.5} onChange={setHalf} allowHalf />
<Rating value={4.3} readOnly />`,
        importName: "Rating",
      },
      {
        slug: "slider",
        title: "Slider",
        description: "Single values and ranges — marks, value display, vertical, and live filters.",
        importName: "Slider",
      },
      {
        slug: "switch",
        title: "Switch",
        description:
          "Instant settings — spread rows, async saves, rollbacks, and dependent toggles.",
        importName: "Switch",
      },
      {
        slug: "text-area",
        title: "Text Area",
        description: "Multi-line text — limits, guided status, autosave, and a reply composer.",
        importName: "TextArea",
      },
      {
        slug: "text-input",
        title: "Text Input",
        description: "Types, sizes, status, async checks, input groups, and a sign-in form.",
        importName: "TextInput",
      },
      {
        slug: "time-input",
        title: "Time Input",
        description: "A clock face — 12-hour, 24-hour, steps, and sm to lg.",
        importName: "TimeInput",
      },
      {
        slug: "address-selector",
        title: "Address Selector",
        description: "Geoapify suggestions fill the street, city, state, and ZIP.",
        importName: "AddressSelector",
      },
      {
        slug: "city-selector",
        title: "City Selector",
        description: "Geoapify city search — one city, or several as chips.",
        importName: "CitySelector",
      },
      {
        slug: "state-selector",
        title: "State Selector",
        description: "A searchable list of US states. The value is the abbreviation.",
        importName: "StateSelector",
      },
      {
        slug: "tokenizer",
        title: "Tokenizer",
        description: "Pick many from a search, or type and press Enter to create a chip.",
        importName: "Tokenizer",
      },
      {
        slug: "typeahead",
        title: "Typeahead",
        description: "Pick one from a search — static and async sources, custom rows.",
        importName: "Typeahead",
      },
    ],
  },
  {
    category: "Feedback & status",
    icon: "info",
    items: [
      {
        slug: "badge",
        title: "Badge",
        description: "Status and category labels — icons, counts, lifecycles, and list rows.",
        importName: "Badge",
      },
      {
        slug: "banner",
        title: "Banner",
        description: "Page and section messages — dismissable, actionable, collapsible, elevated.",
        importName: "Banner",
      },
      {
        slug: "consent-banner",
        title: "Consent Banner",
        description:
          "One question that waits for an answer — cookies or new terms — at the bottom of the viewport.",
        importName: "ConsentBanner",
      },
      {
        slug: "notification",
        title: "Notification",
        description:
          "Inbox rows with event badges, previews, inline actions, and day groups — plus useNotification cards with actions and a pausable timer.",
        importName: "Notification, NotificationList, NotificationGroup, NotificationIcon, useNotification",
        usage: `<NotificationList label="Inbox" empty={<Text>You’re all caught up</Text>}>
  <NotificationGroup label="Today">
    <Notification
      unread
      start={<Avatar name="Alex Rivera" />}
      badge={<Icon icon={icons.tag} />}
      title="Alex Rivera submitted a bid"
      preview={<Text weight="semibold">$2,400</Text>}
      actions={<Button label="Review" size="sm" variant="primary" />}
      time="2m"
      onClick={markRead}
      onDismiss={dismiss}
    />
  </NotificationGroup>
</NotificationList>

// A card at a corner. Hover pauses the timer.
const notify = useNotification();
notify({
  title: "Conversation archived",
  tone: "neutral",
  actions: [{ label: "Undo", onClick: restore }],
});`,
      },
      {
        slug: "progress-bar",
        title: "Progress Bar",
        description: "Values, variants, milestones, live uploads, and quota thresholds.",
        importName: "ProgressBar",
      },
      {
        slug: "skeleton",
        title: "Skeleton",
        description: "Loading shapes that match real layouts — cards, rows, and articles.",
        importName: "Skeleton",
      },
      {
        slug: "spinner",
        title: "Spinner",
        description: "Indeterminate waits — sizes, shades, labels, and loading regions.",
        importName: "Spinner",
      },
      {
        slug: "status-dot",
        title: "Status Dot",
        description:
          "Labeled dots for presence, services, pipelines, and legends — plus StatusIndicator, the dot with its words in three sizes and pill styles.",
        importName: "StatusDot, StatusIndicator",
        usage: `<StatusDot variant="success" label="Online" isPulsing />

<StatusIndicator variant="success" label="Operational" detail="99.98%" />
<StatusIndicator variant="error" label="Live" appearance="soft" size="sm" isPulsing />
<StatusIndicator variant="neutral" label="Queued" appearance="outline" />`,
      },
      {
        slug: "toast",
        title: "Toast",
        description: "useToast — actions, timing, de-duplication, positions, and dismiss control.",
        importName: "Toast",
      },
    ],
  },
  {
    category: "Navigation",
    icon: "chevronRight",
    items: [
      {
        slug: "breadcrumbs",
        title: "Breadcrumbs",
        description: "Paths with icons, sibling menus, deep collapsing, and client navigation.",
        importName: "Breadcrumbs",
      },
      {
        slug: "pagination",
        title: "Pagination",
        description: "Pages, count, compact, input, and dots — page sizes and unknown totals.",
        importName: "Pagination",
      },
      {
        slug: "pill-nav",
        title: "Pill Nav",
        description:
          "App pages as icon pills. The current page opens to its label, counts sit on the icon, and small screens pin the bar to the bottom.",
        importName: "PillNav",
      },
      {
        slug: "side-nav",
        title: "Side Nav",
        description: "Sections, nesting, a collapsible rail, pinned items, and a footer.",
        importName: "SideNav",
      },
      {
        slug: "stepper",
        title: "Stepper",
        description: "Horizontal and vertical steps — status, optional, collapsing, and a wizard.",
        importName: "Stepper",
      },
      {
        slug: "tab-list",
        title: "Tab List",
        description: "Icons, counts, fill, overflow, tab menus, and full-bleed panels.",
        importName: "TabList",
      },
      {
        slug: "top-nav",
        title: "Top Nav",
        description: "Product bars with search, menus, mega menus, and the Joined Nav.",
        importName: "TopNav",
      },
    ],
  },
  {
    category: "Overlay",
    icon: "moreHorizontal",
    items: [
      {
        slug: "bottom-sheet",
        title: "Bottom Sheet",
        description: "Heights, action sheets, snap points, filters, and switching sheets.",
        importName: "BottomSheet",
      },
      {
        slug: "command-palette",
        title: "Command Palette",
        description: "⌘K actions with shortcuts, a people finder, and an inline palette.",
        importName: "CommandPalette",
      },
      {
        slug: "context-menu",
        title: "Context Menu",
        description: "Right-click menus with icons, submenus, sections, and destructive actions.",
        importName: "ContextMenu",
      },
      {
        slug: "dialog",
        title: "Dialog",
        description: "Confirm, alert, form, info, fullscreen, and imperative dialogs.",
        importName: "Dialog",
      },
      {
        slug: "drawer",
        title: "Drawer",
        description:
          "Edge panels for details, edits, and filters — any side, any size, with sticky actions.",
        importName: "Drawer",
      },
      {
        slug: "hover-card",
        title: "Hover Card",
        description: "Rich previews for people and rooms — placement and delays.",
        importName: "HoverCard",
      },
      {
        slug: "popover",
        title: "Popover",
        description: "Filter panels, controlled forms, profile menus, and info popovers.",
        importName: "Popover",
      },
      {
        slug: "tooltip",
        title: "Tooltip",
        description: "Labels, shortcuts, placement, delays, truncation, and disabled controls.",
        importName: "Tooltip",
      },
    ],
  },
  {
    category: "Table & list",
    icon: "viewColumns",
    items: [
      {
        slug: "kanban",
        title: "Kanban Board",
        description:
          "Jira-style boards — drag cards across columns and swimlanes, WIP limits, keyboard moves.",
        importName: "KanbanBoard",
      },
      {
        slug: "list",
        title: "List",
        description:
          "Markers, density, rich rows, selection, links, checklists, and notifications.",
        importName: "List",
      },
      {
        slug: "message-list",
        title: "Message List",
        description:
          "Mail one line per message — unread dot, sender, subject and snippet, label, time — stacking when narrow.",
        importName: "MessageList",
        usage: `<MessageList
  label="Unread mail"
  heading="Unread"
  items={[{ id: "1", sender: "Avery Chen", subject: "Interview request", time: "1:19 PM", isUnread: true, tag: { label: "Interview", variant: "blue" } }]}
  selectedId={selected}
  onSelect={setSelected}
/>`,
      },
      {
        slug: "metadata-list",
        title: "Metadata List",
        description: "Label and value pairs — top or start labels, columns, icons, and show more.",
        importName: "MetadataList",
      },
      {
        slug: "overflow-list",
        title: "Overflow List",
        description: "Fits what it can and counts the rest — badges, tokens, avatars, and actions.",
        importName: "OverflowList",
      },
      {
        slug: "table",
        title: "Table",
        description: "Rows you can stripe, tighten, select, or leave empty.",
        importName: "Table",
      },
      {
        slug: "timeline",
        title: "Timeline",
        description: "Events on a rail, in cards, alternating, or across.",
        importName: "Timeline",
      },
      {
        slug: "tree-list",
        title: "Tree",
        description: "A hierarchy you can filter, select, and restyle.",
        importName: "Tree",
      },
    ],
  },
  {
    category: "Charts",
    icon: "funnel",
    items: [
      {
        slug: "trend-chart",
        title: "Trend Chart",
        description:
          "Change over time for up to four series — smooth lines that draw themselves in, a gradient wash, and a crosshair that reads every series.",
        importName: "TrendChart",
        usage: `<TrendChart
  label="Applications and replies per week"
  labels={["Aug 4", "Aug 11", "Aug 18", "Aug 25"]}
  series={[
    { label: "Applied", values: [6, 9, 7, 12] },
    { label: "Replies", values: [1, 3, 2, 4] },
  ]}
/>`,
      },
      {
        slug: "bar-chart",
        title: "Bar Chart",
        description:
          "Magnitude by category — columns from one baseline, or ranked bars for long names.",
        importName: "BarChart",
        usage: `<BarChart label="Applications by weekday" data={[{ label: "Mon", value: 8 }, { label: "Tue", value: 11 }]} />
<BarChart orientation="bars" label="Applications by source" data={sources} />`,
      },
      {
        slug: "donut-chart",
        title: "Donut Chart",
        description:
          "Part of a whole for up to five slices, with the total in the middle and a full legend.",
        importName: "DonutChart",
        usage: `<DonutChart label="Applications by status" centerLabel="Applications" data={statuses} />`,
      },
      {
        slug: "funnel-chart",
        title: "Funnel Chart",
        description:
          "Stages that narrow, each drawn against the first, with step-to-step conversion.",
        importName: "FunnelChart",
        usage: `<FunnelChart label="Pipeline" stages={[{ label: "Applied", value: 64 }, { label: "Replied", value: 18 }]} />`,
      },
      {
        slug: "radar-chart",
        title: "Radar Chart",
        description:
          "Several measures of a few things at once — polygon or round webs, hover or arrow through axes, shapes that spring in.",
        importName: "RadarChart",
        usage: `<RadarChart
  label="Bidder scores"
  axes={["Communication", "Craft", "Speed", "Value", "Reliability"]}
  max={10}
  series={[
    { label: "Alex Rivera", values: [9, 8, 6, 7, 9] },
    { label: "Dana Kim", values: [7, 9, 8, 5, 7] },
  ]}
/>`,
      },
      {
        slug: "scatter-chart",
        title: "Scatter Chart",
        description:
          "Two measures against each other, or bubbles for a third — nearest-point readout, guides, and mean-line quadrants.",
        importName: "ScatterChart",
        usage: `<ScatterChart
  label="Price against rating"
  xLabel="Bid price"
  yLabel="Rating"
  hasMeanLines
  series={[{ label: "Design", points: [{ x: 2400, y: 4.6 }, { x: 1800, y: 4.1 }] }]}
/>`,
      },
      {
        slug: "radial-bar-chart",
        title: "Radial Bar Chart",
        description: "Progress toward goals as nested activity rings, or one measure as a gauge.",
        importName: "RadialBarChart",
        usage: `<RadialBarChart
  label="This week's goals"
  data={[
    { label: "Bids sent", value: 14, max: 20 },
    { label: "Replies", value: 9, max: 15 },
  ]}
/>
<RadialBarChart variant="gauge" label="Profile" data={[{ label: "Complete", value: 72, max: 100 }]} />`,
      },
      {
        slug: "treemap",
        title: "Treemap",
        description: "Part of a whole for many items — squarified tiles, grouped by color, with hover readouts.",
        importName: "Treemap",
        usage: `<Treemap
  label="Budget by line"
  data={[
    { label: "Brand refresh", value: 24000, group: "Design" },
    { label: "Website rebuild", value: 31000, group: "Engineering" },
  ]}
/>`,
      },
      {
        slug: "heatmap-calendar",
        title: "Heatmap Calendar",
        description: "Daily activity as weeks of cells, one hue from light to dark.",
        importName: "HeatmapCalendar",
        usage: `<HeatmapCalendar label="Applications per day" unit="applications" days={[{ date: "2026-09-01", value: 3 }]} />`,
      },
      {
        slug: "uptime-bar",
        title: "Uptime Bar",
        description: "A status-page history: one bar per day, coloured by how the day went.",
        importName: "UptimeBar",
        usage: `<UptimeBar
  label="API uptime, last 90 days"
  startLabel="90 days ago"
  endLabel="Today"
  summary="99.98% uptime"
  days={[{ label: "Oct 11, 2026", tone: "up", details: ["100% uptime"] }]}
/>`,
      },
      {
        slug: "sparkline",
        title: "Sparkline",
        description: "A small axis-free trend that sits under a KPI number.",
        importName: "Sparkline",
        usage: `<KpiWidget label="Applications" value="64" delta={{ value: "+12%", direction: "up" }}>
  <Sparkline label="Applications per week" values={[4, 6, 5, 9, 12]} />
</KpiWidget>`,
      },
    ],
  },
  {
    category: "Chat",
    icon: "microphone",
    items: [
      {
        slug: "chat",
        title: "Chat",
        description: "Threads, an assistant with tool calls and streaming, and a full composer.",
        importName: "ChatLayout",
      },
    ],
  },
  {
    category: "Utility",
    icon: "eyeSlash",
    items: [
      {
        slug: "visually-hidden",
        title: "Visually Hidden",
        description: "Content for assistive tech only.",
        importName: "VisuallyHidden",
      },
    ],
  },
];

export const ALL_ITEMS = CATALOG.flatMap((g) => g.items);

export const COMPONENT_ITEMS = ALL_ITEMS.filter((item) => item.slug !== "tokens");

export function findItem(slug: string) {
  return ALL_ITEMS.find((i) => i.slug === slug);
}

export function itemHref(slug: string) {
  return slug === "tokens" ? "/tokens" : `/components/${slug}`;
}
