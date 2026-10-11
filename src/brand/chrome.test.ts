import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "bun:test";

import { BROWSER_THEME_COLOR } from "./chrome";

const theme = readFileSync(path.join(import.meta.dir, "../theme/theme.css"), "utf8");

describe("BROWSER_THEME_COLOR", () => {
  it("matches the surface token the app shell paints", () => {
    const surface = theme.match(
      /--color-background-surface:\s*light-dark\((#[0-9a-f]+),\s*(#[0-9a-f]+)\)/i,
    );
    expect(surface?.slice(1)).toEqual([BROWSER_THEME_COLOR.light, BROWSER_THEME_COLOR.dark]);
  });
});
