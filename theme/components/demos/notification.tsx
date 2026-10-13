"use client";

import {
  Avatar,
  Badge,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Notification,
  NotificationGroup,
  NotificationIcon,
  NotificationList,
  Popover,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Text,
  icons,
  useNotification,
  type NotificationPosition,
  type NotificationTone,
} from "sid-ui";
import { useState, type ReactNode } from "react";

import { Caption, Examples, PEOPLE, Preview, Row } from "./shared";

/* ---------- Inbox data ---------- */

type Filter = "all" | "unread" | "mentions";
type Day = "Today" | "Yesterday" | "Earlier this week";

type InboxItem = {
  id: string;
  day: Day;
  time: string;
  tone: NotificationTone;
  /** A person, or a system event with an icon. */
  who?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  preview?: ReactNode;
  mention?: boolean;
  /** Invites get Accept and Decline until answered. */
  invite?: boolean;
  review?: boolean;
};

function FileChip({ name, size }: { name: string; size: string }) {
  return (
    <HStack gap={2} vAlign="center">
      <Icon icon={icons.file} size="sm" color="secondary" />
      <Text type="supporting">{name}</Text>
      <Text type="supporting" color="secondary">
        {size}
      </Text>
    </HStack>
  );
}

const INBOX: InboxItem[] = [
  {
    id: "bid",
    day: "Today",
    time: "2m",
    tone: "accent",
    who: PEOPLE[1].name,
    badge: <Icon icon={icons.tag} />,
    title: (
      <>
        <strong>{PEOPLE[1].name}</strong> submitted a bid on Brand refresh
      </>
    ),
    preview: (
      <HStack hAlign="between" vAlign="center" gap={3}>
        <Stack gap={0}>
          <Text weight="semibold">$2,400</Text>
          <Text type="supporting" color="secondary">
            Delivers in 10 days · 3 revisions
          </Text>
        </Stack>
        <Badge label="Sealed until Fri" variant="info" />
      </HStack>
    ),
    review: true,
  },
  {
    id: "mention",
    day: "Today",
    time: "18m",
    tone: "accent",
    who: PEOPLE[2].name,
    badge: <Icon icon={icons.chat} />,
    mention: true,
    title: (
      <>
        <strong>{PEOPLE[2].name}</strong> mentioned you in Landing page copy
      </>
    ),
    preview: (
      <Text type="supporting">
        “<Text type="supporting" color="accent" weight="semibold">
          @Jordan
        </Text>{" "}
        is the voice formal or conversational? I have two drafts ready either way.”
      </Text>
    ),
  },
  {
    id: "invite",
    day: "Today",
    time: "1h",
    tone: "success",
    who: PEOPLE[5].name,
    badge: <Icon icon={icons.users} />,
    title: (
      <>
        <strong>{PEOPLE[5].name}</strong> invited you to collaborate on Pitch deck
      </>
    ),
    description: "Strategy room · 4 members",
    invite: true,
  },
  {
    id: "deadline",
    day: "Today",
    time: "3h",
    tone: "warning",
    icon: <Icon icon={icons.clock} />,
    title: "Brand refresh closes in 2 hours",
    description: "Two invitees haven’t bid yet. Extend or close early from the room.",
  },
  {
    id: "files",
    day: "Yesterday",
    time: "Mon",
    tone: "neutral",
    who: PEOPLE[6].name,
    badge: <Icon icon={icons.upload} />,
    title: (
      <>
        <strong>{PEOPLE[6].name}</strong> uploaded final files to Motion system
      </>
    ),
    preview: (
      <Stack gap={1}>
        <FileChip name="motion-system.fig" size="18.2 MB" />
        <FileChip name="easing-curves.pdf" size="1.4 MB" />
        <Text type="supporting" color="secondary">
          + 2 more
        </Text>
      </Stack>
    ),
  },
  {
    id: "escrow",
    day: "Yesterday",
    time: "Mon",
    tone: "success",
    icon: <Icon icon={icons.creditCard} />,
    title: "Escrow released — $1,800 to Riley Chen",
    description: "Website QA · Paid to the card ending 4242",
  },
  {
    id: "mention-2",
    day: "Earlier this week",
    time: "Sat",
    tone: "accent",
    who: PEOPLE[3].name,
    badge: <Icon icon={icons.chat} />,
    mention: true,
    title: (
      <>
        <strong>{PEOPLE[3].name}</strong> replied to your comment
      </>
    ),
    description: "“Pushed the fix — mobile nav now closes on route change.”",
  },
  {
    id: "failed",
    day: "Earlier this week",
    time: "Fri",
    tone: "danger",
    icon: <Icon icon={icons.alertCircle} />,
    title: "Payment failed for Pitch deck",
    description: "The card was declined. Update it to keep escrow active.",
  },
];

const DAYS: Day[] = ["Today", "Yesterday", "Earlier this week"];

function Inbox() {
  const [filter, setFilter] = useState<Filter>("all");
  const [unread, setUnread] = useState<string[]>(["bid", "mention", "invite", "deadline", "failed"]);
  const [gone, setGone] = useState<string[]>([]);
  const [answered, setAnswered] = useState<Record<string, "accepted" | "declined">>({});

  const markRead = (id: string) => setUnread((ids) => ids.filter((x) => x !== id));
  const live = INBOX.filter((item) => !gone.includes(item.id));
  const shown = live.filter(
    (item) =>
      filter === "all" ||
      (filter === "unread" && unread.includes(item.id)) ||
      (filter === "mentions" && item.mention),
  );
  const unreadCount = live.filter((item) => unread.includes(item.id)).length;
  const mentionCount = live.filter((item) => item.mention).length;

  const empty = {
    all: { title: "You’re all caught up", body: "We’ll let you know when a bid comes in." },
    unread: { title: "Nothing unread", body: "Everything here has been seen." },
    mentions: { title: "No mentions yet", body: "When someone @mentions you, it lands here." },
  }[filter];

  return (
    <Stack gap={3}>
      <NotificationList
        label="Inbox"
        header={
          <Stack gap={3}>
            <HStack hAlign="between" vAlign="center" gap={2}>
              <HStack gap={2} vAlign="center">
                <Heading level={3}>Notifications</Heading>
                {unreadCount > 0 && <Badge label={`${unreadCount} new`} variant="info" />}
              </HStack>
              <HStack gap={1} vAlign="center">
                <Button
                  label="Mark all read"
                  size="sm"
                  variant="ghost"
                  icon={<Icon icon={icons.check} />}
                  isDisabled={unreadCount === 0}
                  onClick={() => setUnread([])}
                />
                <IconButton
                  label="Notification settings"
                  tooltip="Settings"
                  size="sm"
                  variant="ghost"
                  icon={<Icon icon={icons.settings} />}
                />
              </HStack>
            </HStack>
            <SegmentedControl
              label="Show"
              value={filter}
              onChange={(value) => setFilter(value as Filter)}
            >
              <SegmentedControlItem value="all" label={`All ${live.length}`} />
              <SegmentedControlItem value="unread" label={`Unread ${unreadCount}`} />
              <SegmentedControlItem value="mentions" label={`Mentions ${mentionCount}`} />
            </SegmentedControl>
          </Stack>
        }
        empty={
          <>
            <NotificationIcon icon={<Icon icon={icons.bell} />} tone="neutral" />
            <Text weight="semibold">{empty.title}</Text>
            <Text type="supporting" color="secondary">
              {empty.body}
            </Text>
            {gone.length > 0 && (
              <Button label="Restore dismissed" size="sm" variant="secondary" onClick={() => setGone([])} />
            )}
          </>
        }
      >
        {DAYS.map((day) => {
          const items = shown.filter((item) => item.day === day);
          if (items.length === 0) return null;
          return (
            <NotificationGroup key={day} label={day}>
              {items.map((item) => {
                const answer = answered[item.id];
                return (
                  <Notification
                    key={item.id}
                    unread={unread.includes(item.id)}
                    tone={item.tone}
                    start={
                      item.who ? (
                        <Avatar name={item.who} size="md" tooltip={false} />
                      ) : (
                        <NotificationIcon icon={item.icon} tone={item.tone} />
                      )
                    }
                    badge={item.badge}
                    title={item.title}
                    description={
                      answer === "accepted"
                        ? "You joined Pitch deck."
                        : answer === "declined"
                          ? "You declined this invite."
                          : item.description
                    }
                    preview={item.preview}
                    time={item.time}
                    actions={
                      item.invite && !answer ? (
                        <>
                          <Button
                            label="Accept"
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setAnswered((a) => ({ ...a, [item.id]: "accepted" }));
                              markRead(item.id);
                            }}
                          />
                          <Button
                            label="Decline"
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setAnswered((a) => ({ ...a, [item.id]: "declined" }));
                              markRead(item.id);
                            }}
                          />
                        </>
                      ) : item.review ? (
                        <>
                          <Button
                            label="Review bid"
                            size="sm"
                            variant="primary"
                            onClick={() => markRead(item.id)}
                          />
                          <Button
                            label="Message"
                            size="sm"
                            variant="ghost"
                            icon={<Icon icon={icons.send} />}
                          />
                        </>
                      ) : item.mention && item.preview ? (
                        <Button
                          label="Reply"
                          size="sm"
                          variant="secondary"
                          icon={<Icon icon={icons.chat} />}
                          onClick={() => markRead(item.id)}
                        />
                      ) : undefined
                    }
                    onClick={() => markRead(item.id)}
                    onDismiss={() => setGone((ids) => [...ids, item.id])}
                  />
                );
              })}
            </NotificationGroup>
          );
        })}
      </NotificationList>
      <Caption>
        Click a row to mark it read, answer the invite, or dismiss with ×. The tabs filter without
        losing state.
      </Caption>
    </Stack>
  );
}

/* ---------- Bell ---------- */

function Bell() {
  const [seen, setSeen] = useState(false);
  const latest = INBOX.slice(0, 3);
  return (
    <Popover
      width={380}
      placement="below"
      label="Recent notifications"
      onOpenChange={(open) => {
        if (!open) setSeen(true);
      }}
      content={
        <NotificationList
          label="Recent"
          header={
            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Recent</Text>
              <Link href="#inbox">View all</Link>
            </HStack>
          }
        >
          {latest.map((item) => (
            <Notification
              key={item.id}
              unread={!seen}
              tone={item.tone}
              start={
                item.who ? (
                  <Avatar name={item.who} size="sm" tooltip={false} />
                ) : (
                  <NotificationIcon icon={item.icon} tone={item.tone} />
                )
              }
              badge={item.badge}
              title={item.title}
              time={item.time}
              href="#inbox"
            />
          ))}
        </NotificationList>
      }
    >
      <Button
        label="Notifications"
        variant="ghost"
        icon={<Icon icon={icons.bell} />}
        endContent={seen ? undefined : <Badge label="3" variant="error" />}
      />
    </Popover>
  );
}

/* ---------- Triggered ---------- */

const POSITIONS: NotificationPosition[] = ["topStart", "topEnd", "bottomStart", "bottomEnd"];
const POSITION_LABEL: Record<NotificationPosition, string> = {
  topStart: "Top start",
  topEnd: "Top end",
  bottomStart: "Bottom start",
  bottomEnd: "Bottom end",
};

function Triggers() {
  const notify = useNotification();
  const [position, setPosition] = useState<NotificationPosition>("bottomEnd");

  return (
    <Stack gap={3} hAlign="start">
      <SegmentedControl
        label="Corner"
        value={position}
        onChange={(value) => setPosition(value as NotificationPosition)}
        size="sm"
      >
        {POSITIONS.map((p) => (
          <SegmentedControlItem key={p} value={p} label={POSITION_LABEL[p]} />
        ))}
      </SegmentedControl>
      <Row>
        <Button
          label="Success"
          variant="secondary"
          icon={<Icon icon={icons.check} />}
          onClick={() =>
            notify({
              position,
              tone: "success",
              title: "Room published",
              description: "Three invitees were notified by email.",
            })
          }
        />
        <Button
          label="From a person"
          variant="secondary"
          icon={<Icon icon={icons.user} />}
          onClick={() =>
            notify({
              position,
              start: <Avatar name={PEOPLE[1].name} size="md" tooltip={false} />,
              title: `${PEOPLE[1].name} submitted a bid`,
              description: "Brand refresh · $2,400",
              actions: [{ label: "Review", onClick: () => {}, variant: "primary" }],
            })
          }
        />
        <Button
          label="With undo"
          variant="secondary"
          icon={<Icon icon={icons.archive} />}
          onClick={() =>
            notify({
              position,
              tone: "neutral",
              title: "Conversation archived",
              description: "You can find it under Archive.",
              duration: 6000,
              actions: [
                {
                  label: "Undo",
                  onClick: () =>
                    notify({ position, tone: "success", title: "Moved back to Inbox", duration: 2500 }),
                },
              ],
            })
          }
        />
        <Button
          label="Needs attention"
          variant="secondary"
          icon={<Icon icon={icons.alert} />}
          onClick={() =>
            notify({
              position,
              tone: "warning",
              duration: 0,
              title: "Payment method expires soon",
              description: "Update it before Friday to keep escrow active. This one stays.",
              actions: [
                { label: "Update card", onClick: () => {}, variant: "primary" },
                { label: "Later", onClick: () => {} },
              ],
            })
          }
        />
        <Button
          label="Burst of three"
          variant="ghost"
          onClick={() => {
            const tones: NotificationTone[] = ["accent", "success", "danger"];
            const titles = ["Sync started", "12 files uploaded", "1 file failed — too large"];
            tones.forEach((tone, index) =>
              window.setTimeout(
                () => notify({ position, tone, title: titles[index], duration: 4000 + index * 800 }),
                index * 350,
              ),
            );
          }}
        />
      </Row>
      <Caption>Hover a card to pause its timer. The bar along the bottom shows the time left.</Caption>
    </Stack>
  );
}

/* ---------- Tones ---------- */

const TONES: {
  tone: NotificationTone;
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    tone: "accent",
    icon: <Icon icon={icons.info} />,
    title: "New bid on Brand refresh",
    description: "Alex Rivera · $2,400",
  },
  {
    tone: "success",
    icon: <Icon icon={icons.check} />,
    title: "Room published",
    description: "Three invitees were notified.",
  },
  {
    tone: "warning",
    icon: <Icon icon={icons.alert} />,
    title: "Closing in 2 hours",
    description: "Two invitees haven’t bid yet.",
  },
  {
    tone: "danger",
    icon: <Icon icon={icons.alertCircle} />,
    title: "Payment failed",
    description: "Update your card to keep escrow active.",
  },
  {
    tone: "neutral",
    icon: <Icon icon={icons.eye} />,
    title: "Sam Okafor viewed the brief",
    description: "No action needed.",
  },
];

export default function NotificationDemo() {
  return (
    <Examples>
      <Preview
        label="Inbox"
        description="Filters, day groups, avatars with event badges, rich previews, and inline actions."
      >
        <Inbox />
      </Preview>

      <Preview
        align="start"
        label="Bell"
        description="The count clears once the popover has been opened and closed."
      >
        <Bell />
      </Preview>

      <Preview
        align="start"
        label="Trigger"
        description="useNotification() shows a card at a corner — with a person, actions, or a timer that pauses on hover."
      >
        <Triggers />
      </Preview>

      <Preview label="Tones" description="The mark and icon carry the tone. The title still says what happened.">
        <NotificationList label="Tone examples">
          {TONES.map((item) => (
            <Notification
              key={item.tone}
              unread
              tone={item.tone}
              start={<NotificationIcon icon={item.icon} tone={item.tone} />}
              title={item.title}
              description={item.description}
              time="Just now"
            />
          ))}
        </NotificationList>
      </Preview>

      <Preview
        label="Read and unread"
        description="Unread rows are tinted, semibold, and marked. Read rows stay quiet."
      >
        <NotificationList label="Read state">
          <Notification
            unread
            title="New bid on Brand refresh"
            description="Alex Rivera · $2,400"
            time="2m"
            start={<Avatar name={PEOPLE[1].name} size="md" tooltip={false} />}
            badge={<Icon icon={icons.tag} />}
          />
          <Notification
            title="You published Landing page copy"
            description="Invitees can bid now."
            time="Yesterday"
            start={<Avatar name={PEOPLE[0].name} size="md" tooltip={false} />}
            badge={<Icon icon={icons.send} />}
            tone="success"
          />
        </NotificationList>
      </Preview>
    </Examples>
  );
}
