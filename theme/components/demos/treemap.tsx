"use client";

import { Treemap } from "sid-ui";

import { Examples, Preview } from "./shared";

const BUDGET = [
  { label: "Brand refresh", value: 24000, group: "Design" },
  { label: "Motion system", value: 12800, group: "Design" },
  { label: "Illustrations", value: 6400, group: "Design" },
  { label: "Website rebuild", value: 31000, group: "Engineering" },
  { label: "QA", value: 9200, group: "Engineering" },
  { label: "Analytics", value: 5400, group: "Engineering" },
  { label: "Launch copy", value: 8800, group: "Marketing" },
  { label: "Paid social", value: 15200, group: "Marketing" },
  { label: "Events", value: 4100, group: "Marketing" },
  { label: "Legal review", value: 3600, group: "Operations" },
  { label: "Tools", value: 2900, group: "Operations" },
];

const STORAGE = [
  { label: "Video", value: 48 },
  { label: "Design files", value: 31 },
  { label: "Photos", value: 22 },
  { label: "Documents", value: 9 },
  { label: "Audio", value: 6 },
  { label: "Archives", value: 4 },
  { label: "Other", value: 2, tone: "neutral" as const },
];

export default function TreemapDemo() {
  return (
    <Examples>
      <Preview
        label="Budget by line"
        description="Each tile's area is its share. Groups share a color; bigger tiles read stronger. Hover or arrow through tiles."
      >
        <Treemap
          label="Quarter budget by line item"
          data={BUDGET}
          height={360}
          formatValue={(v) => `$${(v / 1000).toFixed(1)}k`}
        />
      </Preview>
      <Preview label="One measure" description="Without groups, tiles take tones in order.">
        <Treemap
          label="Storage by type"
          data={STORAGE}
          height={260}
          formatValue={(v) => `${v} GB`}
        />
      </Preview>
    </Examples>
  );
}
