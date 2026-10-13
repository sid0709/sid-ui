"use client";

import {
  Avatar,
  Badge,
  Button,
  Card,
  ExpandableCard,
  FlipCard,
  HStack,
  Heading,
  Icon,
  JoinedMark,
  MotionCard,
  Skeleton,
  Sparkline,
  Stack,
  StatusIndicator,
  Text,
  icons,
} from "sid-ui";
import { useEffect, useRef, useState } from "react";

import { Caption, PEOPLE, Preview } from "./shared";

/* ---------- Spotlight ---------- */

const FEATURES = [
  {
    icon: icons.lock,
    title: "Sealed bids",
    body: "Nobody sees a price until the room closes — not even you.",
  },
  {
    icon: icons.creditCard,
    title: "Escrow built in",
    body: "Funds wait safely and release the moment work is approved.",
  },
  {
    icon: icons.users,
    title: "Shared shortlists",
    body: "Vote on bids with your team and award with one click.",
  },
];

export function SpotlightCards() {
  return (
    <Preview
      label="Spotlight"
      description='effect="spotlight" — a glow follows the pointer and lights the edge nearest to it.'
    >
      <HStack gap={3} wrap="wrap" vAlign="stretch">
        {FEATURES.map((f) => (
          <MotionCard key={f.title} effect="spotlight" width={236}>
            <Stack gap={2}>
              <Icon icon={f.icon} color="accent" />
              <Heading level={4}>{f.title}</Heading>
              <Text type="supporting" color="secondary">
                {f.body}
              </Text>
            </Stack>
          </MotionCard>
        ))}
      </HStack>
    </Preview>
  );
}

/* ---------- Tilt ---------- */

export function TiltCard() {
  return (
    <Preview
      align="start"
      label="Tilt"
      description='effect="tilt" — the card leans toward the pointer in 3D with a glare that tracks it.'
    >
      <HStack gap={4} wrap="wrap" vAlign="center">
        <MotionCard effect="tilt" width={340} padding="var(--spacing-6)" maxTilt={12}>
          <Stack gap={6}>
            <HStack hAlign="between" vAlign="center">
              <JoinedMark size="2.25rem" label="" />
              <Badge label="Pro member" variant="blue" />
            </HStack>
            <Stack gap={1}>
              <Text type="supporting" color="secondary">
                Member since 2024
              </Text>
              <Heading level={3}>{PEOPLE[0].name}</Heading>
            </Stack>
            <HStack hAlign="between" vAlign="end">
              <Text hasTabularNumbers color="secondary">
                •••• •••• •••• 4242
              </Text>
              <Text type="supporting" color="secondary">
                12 / 29
              </Text>
            </HStack>
          </Stack>
        </MotionCard>
        <Caption>Move the pointer across the card.</Caption>
      </HStack>
    </Preview>
  );
}

/* ---------- Flip ---------- */

const FLASHCARDS = [
  { q: "What does a sealed bid hide?", a: "The price — until the room closes, every bid is private." },
  { q: "When is escrow released?", a: "When the client approves the delivered work." },
];

export function FlipCards() {
  const [annual, setAnnual] = useState(false);
  return (
    <Preview
      align="start"
      label="Flip"
      description="FlipCard turns over in 3D. Use the corner button, or flip it from outside with isFlipped."
    >
      <HStack gap={4} wrap="wrap" vAlign="start">
        {FLASHCARDS.map((card, index) => (
          <FlipCard
            key={card.q}
            height={180}
            width={240}
            label={`Show the answer to: ${card.q}`}
            direction={index === 1 ? "vertical" : "horizontal"}
            front={
              <Stack gap={2} padding={5} height="100%" vAlign="center">
                <Text type="supporting" color="accent">
                  Question {index + 1}
                </Text>
                <Heading level={4}>{card.q}</Heading>
              </Stack>
            }
            back={
              <Stack gap={2} padding={5} height="100%" vAlign="center">
                <Text type="supporting" color="secondary">
                  Answer
                </Text>
                <Text>{card.a}</Text>
              </Stack>
            }
          />
        ))}
        <Stack gap={2}>
          <FlipCard
            height={180}
            width={240}
            isFlipped={annual}
            onFlipChange={setAnnual}
            label="Switch billing period"
            front={
              <Stack gap={1} padding={5} height="100%" vAlign="center">
                <Text type="supporting" color="secondary">
                  Team · monthly
                </Text>
                <Text type="display-2">$24</Text>
                <Caption>per seat, billed monthly</Caption>
              </Stack>
            }
            back={
              <Stack gap={1} padding={5} height="100%" vAlign="center">
                <HStack gap={2} vAlign="center">
                  <Text type="supporting" color="secondary">
                    Team · yearly
                  </Text>
                  <Badge label="−20%" variant="success" />
                </HStack>
                <Text type="display-2">$19</Text>
                <Caption>per seat, billed $228 yearly</Caption>
              </Stack>
            }
          />
          <Button
            label={annual ? "Show monthly" : "Show yearly"}
            size="sm"
            variant="secondary"
            onClick={() => setAnnual((a) => !a)}
          />
        </Stack>
      </HStack>
    </Preview>
  );
}

/* ---------- Expandable ---------- */

const FAQ = [
  {
    q: "How long does a room stay open?",
    a: "You pick — from 24 hours to two weeks. You can close early or extend once.",
  },
  {
    q: "Can I invite people who aren’t on Joined?",
    a: "Yes. They get an email link and can bid without creating an account first.",
  },
  {
    q: "What happens if no one bids?",
    a: "Nothing is charged. Reopen the room with a new deadline, or invite more people.",
  },
];

export function ExpandableCards() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Preview
      label="Expandable"
      description="ExpandableCard slides its body open. Here only one stays open at a time."
    >
      <Stack gap={2}>
        {FAQ.map((item, index) => (
          <ExpandableCard
            key={item.q}
            isExpanded={open === index}
            onExpandedChange={(next) => setOpen(next ? index : null)}
            header={<Text weight="semibold">{item.q}</Text>}
          >
            <Text color="secondary">{item.a}</Text>
          </ExpandableCard>
        ))}
      </Stack>
    </Preview>
  );
}

/* ---------- Live ---------- */

function useCountUp(target: number, ms = 900) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(begin + (target - begin) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);
  return shown;
}

export function LiveCard() {
  const [series, setSeries] = useState([18, 22, 19, 26, 24, 31, 29, 35, 33, 38, 41, 39]);
  const total = series.reduce((a, b) => a + b, 0) * 7;
  const shown = useCountUp(total);
  const last = series[series.length - 1];
  const prev = series[series.length - 2];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeries((s) => [...s.slice(1), Math.max(12, s[s.length - 1] + Math.round(Math.random() * 12 - 5))]);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Preview
      label="Live"
      description="A dashboard card that keeps moving — the total counts up and the sparkline slides in new points."
    >
      <MotionCard effect="lift" width={360}>
        <Stack gap={3}>
          <HStack hAlign="between" vAlign="center">
            <Text type="supporting" color="secondary">
              Bids this quarter
            </Text>
            <StatusIndicator variant="success" label="Live" size="sm" appearance="soft" isPulsing />
          </HStack>
          <HStack gap={2} vAlign="end">
            <Text type="display-2" hasTabularNumbers>
              {shown.toLocaleString()}
            </Text>
            <Text type="supporting" color={last >= prev ? "accent" : "secondary"}>
              {last >= prev ? "▲" : "▼"} {Math.abs(last - prev)} today
            </Text>
          </HStack>
          <Sparkline values={series} label="Bids per day, last 12 days" height={56} />
        </Stack>
      </MotionCard>
    </Preview>
  );
}

/* ---------- Deck ---------- */

const CANDIDATES = PEOPLE.slice(0, 5).map((p, i) => ({
  ...p,
  bid: ["$2,400", "$2,150", "$2,900", "$1,980", "$2,600"][i],
  days: [10, 12, 8, 14, 9][i],
}));

export function CardDeck() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);

  const decide = (direction: "left" | "right") => {
    if (leaving || index >= CANDIDATES.length) return;
    setLeaving(direction);
    window.setTimeout(() => {
      if (direction === "right") setShortlist((s) => [...s, CANDIDATES[index].name]);
      setIndex((i) => i + 1);
      setLeaving(null);
    }, 320);
  };

  const rest = CANDIDATES.slice(index, index + 3);

  return (
    <Preview
      align="start"
      label="Deck"
      description="Cards stacked in depth. Pass or shortlist the top one and the next rises into place."
    >
      <HStack gap={6} wrap="wrap" vAlign="center">
        <Stack gap={3} hAlign="center">
          <div className="demo-deck">
            {rest.length === 0 && (
              <Card variant="muted" width={260}>
                <Stack gap={1} hAlign="center">
                  <Text weight="semibold">That’s everyone</Text>
                  <Button label="Start over" size="sm" variant="ghost" onClick={() => {
                    setIndex(0);
                    setShortlist([]);
                  }} />
                </Stack>
              </Card>
            )}
            {rest
              .map((c, depth) => (
                <div
                  key={c.name}
                  className="demo-deck-card"
                  data-depth={depth}
                  data-leaving={depth === 0 && leaving ? leaving : undefined}
                >
                  <Card elevation="med" width={260}>
                    <Stack gap={3}>
                      <HStack gap={3} vAlign="center">
                        <Avatar name={c.name} size="lg" tooltip={false} />
                        <Stack gap={0}>
                          <Text weight="semibold">{c.name}</Text>
                          <Text type="supporting" color="secondary">
                            {c.role}
                          </Text>
                        </Stack>
                      </HStack>
                      <HStack hAlign="between">
                        <Stack gap={0}>
                          <Caption>Bid</Caption>
                          <Text weight="semibold">{c.bid}</Text>
                        </Stack>
                        <Stack gap={0}>
                          <Caption>Delivery</Caption>
                          <Text weight="semibold">{c.days} days</Text>
                        </Stack>
                      </HStack>
                    </Stack>
                  </Card>
                </div>
              ))
              .reverse()}
          </div>
          <HStack gap={2}>
            <Button
              label="Pass"
              variant="secondary"
              icon={<Icon icon={icons.close} />}
              onClick={() => decide("left")}
              isDisabled={rest.length === 0}
            />
            <Button
              label="Shortlist"
              variant="primary"
              icon={<Icon icon={icons.heart} />}
              onClick={() => decide("right")}
              isDisabled={rest.length === 0}
            />
          </HStack>
        </Stack>
        <Stack gap={1}>
          <Text weight="semibold">Shortlist</Text>
          {shortlist.length === 0 ? (
            <Caption>Nobody yet.</Caption>
          ) : (
            shortlist.map((name) => (
              <HStack key={name} gap={2} vAlign="center">
                <Avatar name={name} size="xsm" tooltip={false} />
                <Text>{name}</Text>
              </HStack>
            ))
          )}
        </Stack>
      </HStack>
    </Preview>
  );
}

/* ---------- Loading ---------- */

export function LoadingCard() {
  const [loading, setLoading] = useState(false);
  const reload = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1400);
  };
  return (
    <Preview
      align="start"
      label="Loading to loaded"
      description="A skeleton keeps the card’s shape while data loads, then the content fades in."
    >
      <Stack gap={3}>
        <Card width={360}>
          {loading ? (
            <Stack gap={3}>
              <HStack gap={3} vAlign="center">
                <Skeleton width={40} height={40} radius="rounded" />
                <Stack gap={1} width="100%">
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="40%" height={12} />
                </Stack>
              </HStack>
              <Skeleton width="100%" height={12} />
              <Skeleton width="85%" height={12} />
            </Stack>
          ) : (
            <div className="demo-fade-in">
              <Stack gap={3}>
                <HStack gap={3} vAlign="center">
                  <Avatar name={PEOPLE[2].name} size="md" tooltip={false} />
                  <Stack gap={0}>
                    <Text weight="semibold">{PEOPLE[2].name}</Text>
                    <Text type="supporting" color="secondary">
                      Copywriter · 4.9 ★ (42)
                    </Text>
                  </Stack>
                </HStack>
                <Text color="secondary">
                  Launch copy for three fintech brands. Voice guides, landing pages, and onboarding
                  emails.
                </Text>
              </Stack>
            </div>
          )}
        </Card>
        <Button
          label={loading ? "Loading…" : "Reload"}
          size="sm"
          variant="secondary"
          icon={<Icon icon={icons.refresh} />}
          isDisabled={loading}
          onClick={reload}
        />
      </Stack>
    </Preview>
  );
}
