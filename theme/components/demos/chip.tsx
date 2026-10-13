"use client";

import {
  Avatar,
  Button,
  Card,
  Chip,
  ChipGroup,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  TextInput,
  icons,
  type ChipColor,
  type ChipSize,
  type ChipVariant,
} from "sid-ui";
import { useState } from "react";

import { Caption, Examples, PEOPLE, Preview } from "./shared";

const COLORS: ChipColor[] = [
  "neutral",
  "blue",
  "green",
  "yellow",
  "red",
  "purple",
  "pink",
  "teal",
  "orange",
  "cyan",
];
const VARIANTS: ChipVariant[] = ["soft", "filled", "outlined"];
const SIZES: ChipSize[] = ["sm", "md", "lg"];

const JOBS = [
  { title: "Brand designer", type: "contract", place: "remote", level: "senior" },
  { title: "Product designer", type: "full-time", place: "hybrid", level: "mid" },
  { title: "Motion designer", type: "contract", place: "remote", level: "mid" },
  { title: "Design lead", type: "full-time", place: "onsite", level: "senior" },
  { title: "Illustrator", type: "part-time", place: "remote", level: "junior" },
  { title: "UX writer", type: "contract", place: "hybrid", level: "mid" },
];

function FilterBar() {
  const [types, setTypes] = useState<string[]>(["contract"]);
  const [place, setPlace] = useState<string[]>([]);
  const [level, setLevel] = useState<string[]>([]);
  const shown = JOBS.filter(
    (j) =>
      (types.length === 0 || types.includes(j.type)) &&
      (place.length === 0 || place.includes(j.place)) &&
      (level.length === 0 || level.includes(j.level)),
  );
  const count = (key: "type" | "place" | "level", value: string) =>
    JOBS.filter((j) => j[key] === value).length;
  const active = types.length + place.length + level.length;

  return (
    <Stack gap={3}>
      <ChipGroup label="Job type" selectionMode="multiple" value={types} onChange={setTypes}>
        {["full-time", "contract", "part-time"].map((t) => (
          <Chip key={t} value={t} label={t} count={count("type", t)} />
        ))}
      </ChipGroup>
      <ChipGroup label="Workplace" selectionMode="multiple" value={place} onChange={setPlace} variant="outlined">
        <Chip value="remote" label="Remote" start={<Icon icon={icons.home} />} />
        <Chip value="hybrid" label="Hybrid" start={<Icon icon={icons.refresh} />} />
        <Chip value="onsite" label="On-site" start={<Icon icon={icons.pin} />} />
      </ChipGroup>
      <ChipGroup
        label="Seniority"
        selectionMode="single"
        isClearable
        value={level}
        onChange={setLevel}
        variant="outlined"
      >
        {["junior", "mid", "senior"].map((l) => (
          <Chip key={l} value={l} label={l[0].toUpperCase() + l.slice(1)} />
        ))}
      </ChipGroup>
      <HStack hAlign="between" vAlign="center">
        <Text weight="semibold">
          {shown.length} {shown.length === 1 ? "role" : "roles"}
        </Text>
        <Button
          label="Clear filters"
          size="sm"
          variant="ghost"
          isDisabled={active === 0}
          onClick={() => {
            setTypes([]);
            setPlace([]);
            setLevel([]);
          }}
        />
      </HStack>
      <Stack gap={1}>
        {shown.map((j) => (
          <HStack key={j.title} hAlign="between" vAlign="center" gap={2} wrap="wrap">
            <Text>{j.title}</Text>
            <ChipGroup label={`${j.title} tags`} size="sm">
              <Chip label={j.type} color="blue" />
              <Chip label={j.place} color="teal" />
              <Chip label={j.level} color="purple" />
            </ChipGroup>
          </HStack>
        ))}
        {shown.length === 0 && <Caption>No roles match. Loosen a filter.</Caption>}
      </Stack>
    </Stack>
  );
}

function SkillsInput() {
  const [skills, setSkills] = useState(["Figma", "Design systems", "Prototyping", "Motion"]);
  const [draft, setDraft] = useState("");
  const add = () => {
    const next = draft.trim();
    if (next && !skills.includes(next)) setSkills((s) => [...s, next]);
    setDraft("");
  };
  return (
    <Stack gap={3}>
      <ChipGroup label="Skills">
        {skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            variant="outlined"
            onRemove={() => setSkills((s) => s.filter((x) => x !== skill))}
          />
        ))}
      </ChipGroup>
      <HStack gap={2} vAlign="end">
        <TextInput
          label="Add a skill"
          value={draft}
          onChange={setDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") add();
          }}
          placeholder="e.g. Illustration"
        />
        <Button label="Add" variant="secondary" onClick={add} isDisabled={!draft.trim()} />
      </HStack>
      <Caption>Click × or press Backspace on a focused chip — it collapses before it leaves.</Caption>
    </Stack>
  );
}

const SUGGESTIONS = [
  { label: "Summarize this brief", icon: icons.sparkle },
  { label: "Draft a reply", icon: icons.send },
  { label: "Find similar rooms", icon: icons.search },
  { label: "Schedule a call", icon: icons.calendar },
  { label: "Share with team", icon: icons.users },
];

export default function ChipDemo() {
  const [mood, setMood] = useState<string[]>(["week"]);
  const [picked, setPicked] = useState<string | null>(null);
  const [assignees, setAssignees] = useState(PEOPLE.slice(0, 3).map((p) => p.name));

  return (
    <Examples>
      <Preview
        label="Filter chips"
        description="ChipGroup with selectionMode — multiple toggles or a single choice. Selected chips grow a check."
      >
        <FilterBar />
      </Preview>

      <Preview label="Input chips" description="onRemove adds a × button. Type to add more.">
        <SkillsInput />
      </Preview>

      <Preview
        label="Suggestion chips"
        description="Action chips in one scrolling row — tap one to run it."
      >
        <Stack gap={2}>
          <ChipGroup label="Suggestions" isScrollable variant="outlined">
            {SUGGESTIONS.map((s) => (
              <Chip
                key={s.label}
                label={s.label}
                start={<Icon icon={s.icon} />}
                onClick={() => setPicked(s.label)}
              />
            ))}
          </ChipGroup>
          <Caption>{picked ? `You chose “${picked}”.` : "Nothing chosen yet."}</Caption>
        </Stack>
      </Preview>

      <Preview label="People" description="A small avatar tucks into the chip’s curve.">
        <ChipGroup label="Assignees">
          {assignees.map((name) => (
            <Chip
              key={name}
              label={name}
              start={<Avatar name={name} size="xsm" tooltip={false} />}
              onRemove={() => setAssignees((a) => a.filter((x) => x !== name))}
            />
          ))}
          {assignees.length < PEOPLE.length && (
            <Chip
              label="Add"
              variant="outlined"
              start={<Icon icon={icons.plus} />}
              onClick={() =>
                setAssignees((a) => [...a, PEOPLE.find((p) => !a.includes(p.name))?.name ?? ""])
              }
            />
          )}
        </ChipGroup>
      </Preview>

      <Preview label="Colors and variants" description="Ten colors in soft, filled, and outlined.">
        <Stack gap={3}>
          {VARIANTS.map((variant) => (
            <ChipGroup key={variant} label={`${variant} chips`} variant={variant}>
              {COLORS.map((color) => (
                <Chip key={color} label={color} color={color} />
              ))}
            </ChipGroup>
          ))}
        </Stack>
      </Preview>

      <Preview label="Sizes and extras" description="sm, md, lg — with icons, counts, links, and disabled.">
        <Stack gap={3}>
          {SIZES.map((size) => (
            <ChipGroup key={size} label={`${size} chips`} size={size}>
              <Chip label={`Size ${size}`} />
              <Chip label="Starred" color="yellow" start={<Icon icon={icons.star} />} />
              <Chip label="Inbox" color="blue" count={12} />
              <Chip label="Docs" href="#chip" variant="outlined" start={<Icon icon={icons.link} />} />
              <Chip label="Disabled" isDisabled onClick={() => undefined} />
            </ChipGroup>
          ))}
        </Stack>
      </Preview>

      <Preview label="In a card" description="Chips as a quick single choice inside a composer.">
        <Card maxWidth={460}>
          <Stack gap={3}>
            <Heading level={4}>Show activity from</Heading>
            <ChipGroup label="Range" selectionMode="single" value={mood} onChange={setMood}>
              <Chip value="today" label="Today" />
              <Chip value="week" label="This week" />
              <Chip value="month" label="This month" />
              <Chip value="all" label="All time" />
            </ChipGroup>
            <Caption>Showing {mood[0] === "all" ? "everything" : `activity from ${mood[0] === "today" ? "today" : `this ${mood[0]}`}`}.</Caption>
          </Stack>
        </Card>
      </Preview>
    </Examples>
  );
}
