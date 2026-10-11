"use client";

import { Badge, Card, HStack, Stack, Text, UptimeBar, type UptimeDay } from "sid-ui";

import { Examples, Preview } from "./shared";

const DAYS = 90;
const DAY_MS = 86_400_000;
const TODAY = new Date(2026, 9, 11);
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** A believable quarter: mostly clean, a few rough days, and the first weeks unmeasured. */
function history(rough: Record<number, Pick<UptimeDay, "tone" | "details">>, unmeasured = 0) {
  return Array.from({ length: DAYS }, (_, index): UptimeDay => {
    const label = dateLabel.format(new Date(TODAY.getTime() - (DAYS - 1 - index) * DAY_MS));
    if (index < unmeasured) return { label, tone: "none" };
    return { label, ...(rough[index] ?? { tone: "up", details: ["100% uptime"] }) };
  });
}

const COMPONENTS = [
  {
    name: "Website",
    status: "Operational",
    summary: "99.99% uptime",
    days: history({ 61: { tone: "degraded", details: ["99.6% uptime", "Slow page loads"] } }),
  },
  {
    name: "API",
    status: "Operational",
    summary: "99.92% uptime",
    days: history({
      40: { tone: "down", details: ["96.1% uptime", "API unavailable"] },
      41: { tone: "degraded", details: ["99.7% uptime"] },
    }),
  },
  {
    name: "Personalized search",
    status: "Degraded",
    summary: "99.71% uptime",
    days: history(
      { 89: { tone: "degraded", details: ["98.9% uptime", "Ranking falls back"] } },
      20,
    ),
  },
];

export default function UptimeBarDemo() {
  return (
    <Examples>
      <Preview
        label="On a status page"
        description="Hover or focus a day for its date and details. Grey days were not measured yet."
      >
        <Card padding={6}>
          <Stack gap={6}>
            {COMPONENTS.map((component) => (
              <Stack key={component.name} gap={2}>
                <HStack hAlign="between" vAlign="center" gap={2}>
                  <Text weight="semibold">{component.name}</Text>
                  <Badge
                    label={component.status}
                    variant={component.status === "Operational" ? "success" : "warning"}
                  />
                </HStack>
                <UptimeBar
                  label={`${component.name} uptime, last ${DAYS} days`}
                  days={component.days}
                  startLabel={`${DAYS} days ago`}
                  endLabel="Today"
                  summary={component.summary}
                />
              </Stack>
            ))}
          </Stack>
        </Card>
      </Preview>
    </Examples>
  );
}
