"use client";

import { Button, HStack, ScatterChart, Stack, type ScatterSeries } from "sid-ui";
import { useState } from "react";

import { Caption, Examples, Preview } from "./shared";

function cloud(seed: number, count: number, cx: number, cy: number, spread: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round(cx + (rand() - 0.5) * spread * 2),
    y: Math.round((cy + (rand() - 0.5) * 1.6) * 10) / 10,
    label: `Bid ${i + 1}`,
  }));
}

const MARKETS = [
  { label: "Austin", x: 18, y: 32, size: 420 },
  { label: "Berlin", x: 9, y: 24, size: 610 },
  { label: "Lagos", x: 34, y: 18, size: 180 },
  { label: "Lisbon", x: 22, y: 28, size: 240 },
  { label: "Seoul", x: 12, y: 36, size: 820 },
  { label: "São Paulo", x: 27, y: 21, size: 520 },
  { label: "Toronto", x: 7, y: 30, size: 470 },
  { label: "Nairobi", x: 31, y: 26, size: 150 },
];

export default function ScatterChartDemo() {
  const [seed, setSeed] = useState(7);
  const series: ScatterSeries[] = [
    { label: "Design", points: cloud(seed, 24, 2400, 4.3, 1400) },
    { label: "Engineering", points: cloud(seed + 11, 24, 4200, 4.0, 1800) },
  ];

  return (
    <Examples>
      <Preview
        label="Price against rating"
        description="Every bid as a dot. The nearest dot to the pointer lights up with guides to both axes; mean lines split the plot into quadrants."
      >
        <Stack gap={3}>
          <ScatterChart
            key={seed}
            label="Bid price against bidder rating"
            series={series}
            xLabel="Bid price"
            yLabel="Rating"
            formatX={(v) => `$${(v / 1000).toFixed(1)}k`}
            formatY={(v) => v.toFixed(1)}
            hasMeanLines
          />
          <HStack gap={2} vAlign="center">
            <Button label="New sample" size="sm" variant="secondary" onClick={() => setSeed((s) => s + 3)} />
            <Caption>Dots pop in one after another.</Caption>
          </HStack>
        </Stack>
      </Preview>

      <Preview
        label="Bubbles"
        description="A third measure as area — here each market's revenue. Hover a bubble for all three."
      >
        <ScatterChart
          label="Markets by growth, margin, and revenue"
          series={[{ label: "Markets", points: MARKETS, tone: "purple" }]}
          xLabel="Growth"
          yLabel="Margin"
          sizeLabel="Revenue"
          formatX={(v) => `${v}%`}
          formatY={(v) => `${v}%`}
          formatSize={(v) => `$${v}k`}
          height={340}
        />
      </Preview>
    </Examples>
  );
}
