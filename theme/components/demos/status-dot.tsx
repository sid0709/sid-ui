"use client";

import {
  Avatar,
  AvatarGroup,
  AvatarGroupOverflow,
  AvatarStatusDot,
  Badge,
  Button,
  Card,
  HStack,
  Heading,
  Icon,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  StatusDot,
  StatusIndicator,
  Text,
  UptimeBar,
  icons,
  type StatusDotVariant,
  type StatusIndicatorAppearance,
  type StatusIndicatorSize,
  type UptimeDay,
} from "sid-ui";
import { useEffect, useState } from "react";

import { Caption, Examples, PEOPLE, Preview, Row } from "./shared";

const VARIANTS: { variant: StatusDotVariant; label: string; meaning: string }[] = [
  { variant: "success", label: "Online", meaning: "Healthy, available, done" },
  { variant: "warning", label: "Degraded", meaning: "Slow, waiting, at risk" },
  { variant: "error", label: "Down", meaning: "Failed, blocked, busy" },
  { variant: "accent", label: "New", meaning: "Unread, in progress, yours" },
  { variant: "neutral", label: "Offline", meaning: "Idle, archived, unknown" },
];

const SIZES: StatusIndicatorSize[] = ["sm", "md", "lg"];
const APPEARANCES: StatusIndicatorAppearance[] = ["plain", "soft", "outline"];

/* ---------- Live counter ---------- */

function LiveBidding() {
  const [bidders, setBidders] = useState(12);
  const [last, setLast] = useState(4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBidders((n) => Math.max(8, Math.min(19, n + (Math.random() > 0.45 ? 1 : -1))));
      setLast(0);
    }, 2600);
    const tick = window.setInterval(() => setLast((s) => s + 1), 1000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(tick);
    };
  }, []);

  return (
    <Card maxWidth={440}>
      <Stack gap={3}>
        <HStack hAlign="between" vAlign="center">
          <StatusIndicator variant="error" label="Live" appearance="soft" size="sm" isPulsing />
          <Text type="supporting" color="secondary">
            Closes in 01:42:10
          </Text>
        </HStack>
        <Stack gap={0}>
          <Heading level={3}>Brand refresh</Heading>
          <Text color="secondary">
            {bidders} people bidding · last bid {last === 0 ? "just now" : `${last}s ago`}
          </Text>
        </Stack>
        <HStack gap={2} vAlign="center">
          <AvatarGroup size="sm">
            {PEOPLE.slice(0, 4).map((person) => (
              <Avatar key={person.name} name={person.name} />
            ))}
            <AvatarGroupOverflow count={bidders - 4} />
          </AvatarGroup>
          <Text type="supporting" color="secondary">
            watching now
          </Text>
        </HStack>
      </Stack>
    </Card>
  );
}

/* ---------- Presence picker ---------- */

/* Avatar dots come in success, neutral, and error; an icon tells Away from Offline. */
const PRESENCE_OPTIONS: {
  value: StatusDotVariant;
  avatar: "success" | "neutral" | "error";
  icon?: (typeof icons)[keyof typeof icons];
  label: string;
  note: string;
}[] = [
  { value: "success", avatar: "success", label: "Active", note: "Shown as available" },
  { value: "warning", avatar: "neutral", icon: icons.clock, label: "Away", note: "Back in 15 minutes" },
  {
    value: "error",
    avatar: "error",
    icon: icons.minus,
    label: "Do not disturb",
    note: "Notifications paused until 5 PM",
  },
  { value: "neutral", avatar: "neutral", label: "Offline", note: "Appear offline to everyone" },
];

function PresencePicker() {
  const [mine, setMine] = useState<StatusDotVariant>("success");
  const current = PRESENCE_OPTIONS.find((o) => o.value === mine) ?? PRESENCE_OPTIONS[0];
  return (
    <Stack gap={3} hAlign="start">
      <HStack gap={3} vAlign="center">
        <Avatar
          name={PEOPLE[0].name}
          size="lg"
          tooltip={false}
          status={
            <AvatarStatusDot
              variant={current.avatar}
              label={current.label}
              icon={current.icon ? <Icon icon={current.icon} /> : undefined}
            />
          }
        />
        <Stack gap={0}>
          <Text weight="semibold">{PEOPLE[0].name}</Text>
          <StatusIndicator variant={mine} label={current.label} detail={current.note} size="sm" />
        </Stack>
      </HStack>
      <SegmentedControl
        label="Set your status"
        value={mine}
        onChange={(value) => setMine(value as StatusDotVariant)}
        size="sm"
      >
        {PRESENCE_OPTIONS.map((o) => (
          <SegmentedControlItem key={o.value} value={o.value} label={o.label} />
        ))}
      </SegmentedControl>
    </Stack>
  );
}

/* ---------- Status page ---------- */

function history(seed: number, trouble: number[]): UptimeDay[] {
  return Array.from({ length: 45 }, (_, i) => {
    const down = trouble.includes(i);
    const degraded = !down && (i * seed) % 41 === 7;
    return {
      label: `Day ${i + 1}`,
      tone: down ? "down" : degraded ? "degraded" : "up",
      details: down ? ["Outage · 42 min"] : degraded ? ["Slow responses"] : ["No downtime"],
    };
  });
}

const SERVICES: {
  name: string;
  variant: StatusDotVariant;
  note: string;
  uptime: string;
  days: UptimeDay[];
}[] = [
  { name: "Rooms API", variant: "success", note: "Operational", uptime: "99.98%", days: history(3, []) },
  {
    name: "Email invites",
    variant: "warning",
    note: "Delayed ~5 min",
    uptime: "99.71%",
    days: history(5, [44]),
  },
  {
    name: "Escrow payments",
    variant: "success",
    note: "Operational",
    uptime: "100%",
    days: history(7, []),
  },
  {
    name: "File uploads",
    variant: "error",
    note: "Outage",
    uptime: "98.40%",
    days: history(2, [21, 43, 44]),
  },
];

function StatusPage() {
  return (
    <Stack gap={4}>
      <HStack hAlign="between" vAlign="center" gap={3} wrap="wrap">
        <Stack gap={0}>
          <Heading level={3}>System status</Heading>
          <Text type="supporting" color="secondary">
            Updated 30 seconds ago
          </Text>
        </Stack>
        <StatusIndicator
          variant="error"
          label="Partial outage"
          detail="1 of 4 systems"
          appearance="soft"
          isPulsing
        />
      </HStack>
      {SERVICES.map((s) => (
        <Stack key={s.name} gap={2}>
          <HStack hAlign="between" vAlign="center" gap={3}>
            <Text weight="semibold">{s.name}</Text>
            <StatusIndicator variant={s.variant} label={s.note} detail={s.uptime} size="sm" />
          </HStack>
          <UptimeBar
            days={s.days}
            label={`${s.name}, last 45 days`}
            startLabel="45 days ago"
            endLabel="Today"
          />
        </Stack>
      ))}
    </Stack>
  );
}

/* ---------- Pipeline ---------- */

const STEPS = ["Build", "Test", "Deploy", "Verify"];

function Pipeline() {
  const [step, setStep] = useState(2);
  const [failed, setFailed] = useState(false);
  const done = step >= STEPS.length;

  useEffect(() => {
    if (done || failed) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), 2200);
    return () => window.clearTimeout(timer);
  }, [step, done, failed]);

  return (
    <Stack gap={3}>
      <HStack hAlign="between" vAlign="center" gap={3} wrap="wrap">
        <HStack gap={2} vAlign="center">
          <Text weight="semibold">main · 65034d6</Text>
          <Badge
            label={failed ? "Failed" : done ? "Deployed" : "Running"}
            variant={failed ? "error" : done ? "success" : "info"}
          />
        </HStack>
        <HStack gap={1}>
          <Button
            label="Fail this step"
            size="sm"
            variant="ghost"
            isDisabled={done || failed}
            onClick={() => setFailed(true)}
          />
          <Button
            label="Re-run"
            size="sm"
            variant="secondary"
            icon={<Icon icon={icons.refresh} />}
            onClick={() => {
              setFailed(false);
              setStep(0);
            }}
          />
        </HStack>
      </HStack>
      <HStack gap={0} vAlign="center" wrap="wrap">
        {STEPS.map((name, index) => {
          const state =
            index < step ? "done" : index === step ? (failed ? "failed" : "running") : "waiting";
          return (
            <HStack key={name} gap={2} vAlign="center">
              <StatusIndicator
                variant={
                  state === "done"
                    ? "success"
                    : state === "failed"
                      ? "error"
                      : state === "running"
                        ? "accent"
                        : "neutral"
                }
                label={name}
                detail={
                  state === "done"
                    ? "Passed"
                    : state === "failed"
                      ? "Failed"
                      : state === "running"
                        ? "Running"
                        : "Queued"
                }
                appearance={state === "waiting" ? "outline" : "soft"}
                size="sm"
                isPulsing={state === "running"}
              />
              {index < STEPS.length - 1 && <Icon icon={icons.chevronRight} size="sm" color="secondary" />}
            </HStack>
          );
        })}
      </HStack>
    </Stack>
  );
}

/* ---------- Page ---------- */

export default function StatusDotDemo() {
  return (
    <Examples>
      <Preview
        label="Variants"
        description="Five meanings. Every dot has a label — read aloud and shown in the tooltip."
      >
        <HStack gap={3} wrap="wrap">
          {VARIANTS.map(({ variant, label, meaning }) => (
            <Card key={variant} maxWidth={180}>
              <Stack gap={2}>
                <StatusIndicator variant={variant} label={label} size="lg" />
                <Text type="supporting" color="secondary">
                  {meaning}
                </Text>
              </Stack>
            </Card>
          ))}
        </HStack>
      </Preview>

      <Preview
        align="start"
        label="Status Indicator"
        description="StatusIndicator pairs the dot with its words — three sizes, plain or in a soft or outlined pill."
      >
        <Stack gap={3}>
          {APPEARANCES.map((appearance) => (
            <HStack key={appearance} gap={4} vAlign="center" wrap="wrap">
              <Text type="supporting" color="secondary">
                {appearance}
              </Text>
              {SIZES.map((size, index) => (
                <StatusIndicator
                  key={size}
                  variant={VARIANTS[index].variant}
                  label={VARIANTS[index].label}
                  detail={size}
                  size={size}
                  appearance={appearance}
                />
              ))}
            </HStack>
          ))}
        </Stack>
      </Preview>

      <Preview
        label="Live"
        description="A pulse marks what is happening right now — here a counter that keeps ticking."
      >
        <LiveBidding />
      </Preview>

      <Preview
        label="Your status"
        description="Pick a presence; the avatar dot and the line under the name follow."
      >
        <PresencePicker />
      </Preview>

      <Preview label="Status page" description="One indicator per system, with 45 days of history underneath.">
        <StatusPage />
      </Preview>

      <Preview
        label="Pipeline"
        description="Steps move from queued to running to passed. Fail one, then re-run."
      >
        <Pipeline />
      </Preview>

      <Preview
        align="start"
        label="Dot only"
        description="StatusDot on its own — pulsing, with a tooltip, or with an icon so it never relies on color."
      >
        <Stack gap={3}>
          <Row>
            <StatusDot variant="success" label="Live" isPulsing />
            <StatusDot variant="error" label="Incident" isPulsing />
            <StatusDot variant="accent" label="Unread" isPulsing />
            <Caption>Pulsing</Caption>
          </Row>
          <Row>
            <StatusDot variant="success" label="Synced" tooltip="Synced 2 minutes ago" />
            <StatusDot variant="warning" label="Pending" tooltip="3 changes waiting to sync" />
            <StatusDot variant="error" label="Failed" tooltip="Sync failed — retry in settings" />
            <Caption>Hover for a tooltip</Caption>
          </Row>
          <Row>
            <Avatar
              name={PEOPLE[1].name}
              size="md"
              tooltip={false}
              status={<AvatarStatusDot variant="success" label="Done" icon={<Icon icon={icons.check} />} />}
            />
            <Avatar
              name={PEOPLE[2].name}
              size="md"
              tooltip={false}
              status={<AvatarStatusDot variant="error" label="Blocked" icon={<Icon icon={icons.lock} />} />}
            />
            <Avatar
              name={PEOPLE[3].name}
              size="md"
              tooltip={false}
              status={<AvatarStatusDot variant="neutral" label="Waiting" icon={<Icon icon={icons.clock} />} />}
            />
            <Caption>Icons on avatars</Caption>
          </Row>
        </Stack>
      </Preview>

      <Preview align="start" label="Legend" description="Explain what the dots on a chart or calendar mean.">
        <Row>
          {[
            { variant: "accent" as const, label: "Your rooms" },
            { variant: "success" as const, label: "Awarded" },
            { variant: "warning" as const, label: "Closing soon" },
            { variant: "neutral" as const, label: "Archived" },
          ].map((item) => (
            <StatusIndicator key={item.label} variant={item.variant} label={item.label} size="sm" />
          ))}
        </Row>
      </Preview>
    </Examples>
  );
}
