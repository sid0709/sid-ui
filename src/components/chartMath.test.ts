import { describe, expect, it } from "bun:test";

import {
  arcPath,
  areaPath,
  compactNumber,
  conversionRates,
  heatLevel,
  linePath,
  linearScale,
  nearestIndex,
  niceDomain,
  niceTicks,
  polarPoint,
  segmentShares,
  smoothPath,
  squarify,
} from "./chartMath";

describe("segmentShares", () => {
  it("returns percentages that sum to 100", () => {
    expect(segmentShares([1, 1, 2])).toEqual([25, 25, 50]);
  });

  it("returns zeros, not NaN, when everything is zero", () => {
    expect(segmentShares([0, 0])).toEqual([0, 0]);
  });

  it("ignores negative values", () => {
    expect(segmentShares([-4, 4])).toEqual([0, 100]);
  });
});

describe("niceTicks", () => {
  it("rounds the top up to a clean step", () => {
    expect(niceTicks(17, 4)).toEqual([0, 5, 10, 15, 20]);
  });

  it("handles fractional maxima", () => {
    expect(niceTicks(0.9, 3)).toEqual([0, 0.5, 1]);
  });

  it("gives an empty chart a frame", () => {
    expect(niceTicks(0)).toEqual([0, 1]);
  });
});

describe("linearScale", () => {
  it("maps the domain onto the range, inverted for SVG y", () => {
    const y = linearScale([0, 10], [100, 0]);
    expect(y(0)).toBe(100);
    expect(y(5)).toBe(50);
    expect(y(10)).toBe(0);
  });

  it("maps a flat domain to the range start", () => {
    expect(linearScale([3, 3], [0, 50])(3)).toBe(0);
  });
});

describe("paths", () => {
  it("draws a line and closes an area to the baseline", () => {
    const points = [
      { x: 0, y: 10 },
      { x: 5, y: 0 },
    ];
    expect(linePath(points)).toBe("M0,10L5,0");
    expect(areaPath(points, 20)).toBe("M0,10L5,0L5,20L0,20Z");
    expect(areaPath([], 20)).toBe("");
  });

  it("returns nothing for an empty arc", () => {
    expect(arcPath(10, 10, 5, 10, 0.2, 0.2)).toBe("");
    expect(arcPath(10, 10, 5, 10, 0, 0.25).startsWith("M10,0A10,10")).toBe(true);
  });
});

describe("heatLevel", () => {
  it("keeps zero at level zero and any activity at level one or more", () => {
    expect(heatLevel(0, 10)).toBe(0);
    expect(heatLevel(1, 100)).toBe(1);
    expect(heatLevel(10, 10)).toBe(4);
  });
});

describe("nearestIndex", () => {
  it("snaps to the closest x", () => {
    expect(nearestIndex([0, 10, 20], 14)).toBe(1);
    expect(nearestIndex([0, 10, 20], 16)).toBe(2);
  });
});

describe("conversionRates", () => {
  it("reports each step against the one before", () => {
    expect(conversionRates([40, 20, 5])).toEqual([100, 50, 25]);
    expect(conversionRates([0, 3])).toEqual([100, 0]);
  });
});

describe("compactNumber", () => {
  it("abbreviates large figures", () => {
    expect(compactNumber(950)).toBe("950");
    expect(compactNumber(12_400)).toBe("12.4K");
  });
});

describe("smoothPath", () => {
  it("falls back to straight segments for two points", () => {
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toBe("M0,0L10,10");
  });

  it("starts and ends on the first and last points", () => {
    const d = smoothPath([
      { x: 0, y: 10 },
      { x: 10, y: 0 },
      { x: 20, y: 5 },
    ]);
    expect(d.startsWith("M0,10C")).toBe(true);
    expect(d.endsWith(" 20,5")).toBe(true);
  });

  it("keeps a flat run flat", () => {
    const d = smoothPath([
      { x: 0, y: 5 },
      { x: 10, y: 5 },
      { x: 20, y: 5 },
    ]);
    expect(d).toBe("M0,5C3.33,5 6.67,5 10,5C13.33,5 16.67,5 20,5");
  });
});

describe("niceDomain", () => {
  it("brackets the data with clean steps", () => {
    expect(niceDomain(17.3, 83.9, 4)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it("widens a single value into a range", () => {
    const ticks = niceDomain(50, 50);
    expect(ticks[0]).toBeLessThan(50);
    expect(ticks[ticks.length - 1]).toBeGreaterThan(50);
  });
});

describe("polarPoint", () => {
  it("puts zero at twelve o'clock and a quarter at three", () => {
    const top = polarPoint(0, 0, 10, 0);
    const right = polarPoint(0, 0, 10, 0.25);
    expect(Math.round(top.x)).toBe(0);
    expect(Math.round(top.y)).toBe(-10);
    expect(Math.round(right.x)).toBe(10);
    expect(Math.round(right.y)).toBe(0);
  });
});

describe("squarify", () => {
  const rect = { x: 0, y: 0, width: 600, height: 400 };
  const values = [6, 6, 4, 3, 2, 2, 1];
  const tiles = squarify(values, rect);
  const total = values.reduce((a, b) => a + b, 0);

  it("gives each value an area in proportion", () => {
    tiles.forEach((tile, index) => {
      const share = (tile.width * tile.height) / (600 * 400);
      expect(Math.abs(share - values[index] / total)).toBeLessThan(1e-6);
    });
  });

  it("keeps every tile inside the rectangle", () => {
    for (const tile of tiles) {
      expect(tile.x).toBeGreaterThanOrEqual(-1e-6);
      expect(tile.y).toBeGreaterThanOrEqual(-1e-6);
      expect(tile.x + tile.width).toBeLessThanOrEqual(600 + 1e-6);
      expect(tile.y + tile.height).toBeLessThanOrEqual(400 + 1e-6);
    }
  });

  it("returns empty tiles when there is nothing to lay out", () => {
    expect(squarify([0, 0], rect).every((t) => t.width === 0)).toBe(true);
  });
});
