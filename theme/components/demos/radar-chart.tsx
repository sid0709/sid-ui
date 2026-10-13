"use client";

import { Chip, ChipGroup, RadarChart, Stack, type RadarSeries } from "sid-ui";
import { useState } from "react";

import { Caption, Examples, PEOPLE, Preview } from "./shared";

const AXES = ["Communication", "Craft", "Speed", "Value", "Reliability", "Strategy"];
const CANDIDATES: RadarSeries[] = [
  { label: PEOPLE[1].name, values: [9, 8, 6, 7, 9, 6] },
  { label: PEOPLE[2].name, values: [7, 9, 8, 5, 7, 8] },
  { label: PEOPLE[3].name, values: [6, 7, 9, 9, 6, 5] },
];

const PRODUCT_AXES = ["Speed", "Price", "Support", "Design", "Integrations", "Security", "Docs", "Uptime"];

export default function RadarChartDemo() {
  const [shown, setShown] = useState(CANDIDATES.slice(0, 2).map((c) => c.label));

  return (
    <Examples>
      <Preview
        label="Compare bidders"
        description="Several measures of a few people at once. Hover an axis — or arrow through them — to read every series on it. Toggle bidders with the chips."
      >
        <Stack gap={3}>
          <ChipGroup label="Bidders" selectionMode="multiple" value={shown} onChange={setShown} size="sm">
            {CANDIDATES.map((c) => (
              <Chip key={c.label} value={c.label} label={c.label} />
            ))}
          </ChipGroup>
          <RadarChart
            label="Bidder scores out of 10"
            axes={AXES}
            max={10}
            levels={5}
            series={CANDIDATES.map((c, index) => ({
              ...c,
              tone: (["blue", "orange", "purple"] as const)[index],
            })).filter((c) => shown.includes(c.label))}
          />
          {shown.length === 0 && <Caption>Pick a bidder to draw their shape.</Caption>}
        </Stack>
      </Preview>

      <Preview label="Round web" description='shape="circle" draws rings instead of a polygon — here one profile.'>
        <RadarChart
          label="Your skill profile"
          axes={["Research", "Wireframes", "Visual", "Motion", "Prototyping"]}
          series={[{ label: "You", values: [72, 88, 95, 60, 81], tone: "green" }]}
          max={100}
          shape="circle"
          size={300}
          formatValue={(v) => `${v}`}
        />
      </Preview>

      <Preview label="Eight axes" description="Two products scored out of 100 across eight measures.">
        <RadarChart
          label="Product comparison"
          axes={PRODUCT_AXES}
          max={100}
          series={[
            { label: "Joined", values: [92, 70, 88, 95, 76, 90, 84, 99] },
            { label: "Other tool", values: [74, 88, 62, 70, 90, 72, 66, 95] },
          ]}
        />
      </Preview>
    </Examples>
  );
}
