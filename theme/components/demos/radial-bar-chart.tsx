"use client";

import { Button, HStack, RadialBarChart, Stack, type RadialBarDatum } from "sid-ui";
import { useState } from "react";

import { Caption, Examples, Preview } from "./shared";

export default function RadialBarChartDemo() {
  const [rings, setRings] = useState<RadialBarDatum[]>([
    { label: "Bids sent", value: 14, max: 20, tone: "red" },
    { label: "Replies", value: 9, max: 15, tone: "green" },
    { label: "Calls", value: 3, max: 6, tone: "blue" },
  ]);
  const [profile, setProfile] = useState(72);

  return (
    <Examples>
      <Preview
        label="Rings"
        description="One ring per goal, nested like activity rings. They sweep in on first paint and glide when a value changes."
      >
        <Stack gap={3}>
          <RadialBarChart label="This week's goals" data={rings} size={220} />
          <HStack gap={2} vAlign="center">
            <Button
              label="Log activity"
              size="sm"
              variant="primary"
              onClick={() =>
                setRings((all) =>
                  all.map((r) => ({ ...r, value: Math.min(r.max, r.value + Math.ceil(r.max / 8)) })),
                )
              }
            />
            <Button
              label="Reset"
              size="sm"
              variant="ghost"
              onClick={() => setRings((all) => all.map((r) => ({ ...r, value: Math.round(r.max * 0.3) })))}
            />
            <Caption>Hover a ring to read it in the middle.</Caption>
          </HStack>
        </Stack>
      </Preview>

      <Preview label="Gauge" description='variant="gauge" draws one measure as an open three-quarter dial.'>
        <Stack gap={3}>
          <HStack gap={6} wrap="wrap" vAlign="center">
            <RadialBarChart
              label="Profile completeness"
              variant="gauge"
              data={[{ label: "Profile complete", value: profile, max: 100, tone: "blue" }]}
              size={200}
              hasLegend={false}
            />
            <RadialBarChart
              label="Storage used"
              variant="gauge"
              data={[{ label: "Storage used", value: 82, max: 100, tone: "orange" }]}
              size={160}
              hasLegend={false}
            />
            <RadialBarChart
              label="Escrow released"
              variant="gauge"
              data={[{ label: "Escrow released", value: 38, max: 100, tone: "green" }]}
              size={160}
              hasLegend={false}
            />
          </HStack>
          <HStack gap={2}>
            <Button label="−10" size="sm" variant="secondary" onClick={() => setProfile((p) => Math.max(0, p - 10))} />
            <Button label="+10" size="sm" variant="secondary" onClick={() => setProfile((p) => Math.min(100, p + 10))} />
          </HStack>
        </Stack>
      </Preview>
    </Examples>
  );
}
