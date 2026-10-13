/** Pure maths for the charts, kept apart from React so it is unit-testable. */

/** Each value's share of the total, in percent. All-zero input yields all zeros, never NaN. */
export function segmentShares(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);
  if (total === 0) return values.map(() => 0);
  return values.map((value) => (Math.max(0, value) / total) * 100);
}

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/**
 * Clean axis ticks from zero up to at least `max`: 0, 5, 10, 15 — never 0, 3.7, 7.4.
 * Returns `[0, 1]` when there is nothing to plot so an empty chart still has a frame.
 */
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0) || count < 1) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = (NICE_STEPS.find((nice) => nice * magnitude >= raw) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let tick = 0; tick <= top + step / 2; tick += step) ticks.push(round(tick));
  return ticks;
}

function round(value: number) {
  return Math.round(value * 1e6) / 1e6;
}

/** Maps a domain onto a pixel range. A flat domain maps everything to the range start. */
export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  return (value: number) => (span === 0 ? r0 : r0 + ((value - d0) / span) * (r1 - r0));
}

export type Point = { x: number; y: number };

/** An SVG path through the points with straight segments. */
export function linePath(points: Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${fmt(point.x)},${fmt(point.y)}`)
    .join("");
}

/** The line closed down to a baseline, for the area wash under it. */
export function areaPath(points: Point[], baseline: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath(points)}L${fmt(last.x)},${fmt(baseline)}L${fmt(first.x)},${fmt(baseline)}Z`;
}

/**
 * One ring segment from `start` to `end` (fractions of a turn, 0 at twelve o'clock),
 * between `inner` and `outer` radii around (cx, cy).
 */
export function arcPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number,
): string {
  const sweep = Math.min(end - start, 0.9999);
  if (sweep <= 0) return "";
  const a0 = start * 2 * Math.PI - Math.PI / 2;
  const a1 = (start + sweep) * 2 * Math.PI - Math.PI / 2;
  const large = sweep > 0.5 ? 1 : 0;
  const p = (radius: number, angle: number) =>
    `${fmt(cx + radius * Math.cos(angle))},${fmt(cy + radius * Math.sin(angle))}`;
  return [
    `M${p(outer, a0)}`,
    `A${fmt(outer)},${fmt(outer)} 0 ${large} 1 ${p(outer, a1)}`,
    `L${p(inner, a1)}`,
    `A${fmt(inner)},${fmt(inner)} 0 ${large} 0 ${p(inner, a0)}`,
    "Z",
  ].join("");
}

function fmt(value: number) {
  return String(Math.round(value * 100) / 100);
}

/**
 * Buckets a value into one of `steps` intensity levels for a heatmap: 0 means none,
 * 1…steps scale with the value against `max`. Any positive value is at least level 1.
 */
export function heatLevel(value: number, max: number, steps = 4): number {
  if (!(value > 0) || !(max > 0)) return 0;
  return Math.min(steps, Math.max(1, Math.ceil((value / max) * steps)));
}

/** Index of the item whose x is nearest to `x` — the crosshair's snap. */
export function nearestIndex(xs: number[], x: number): number {
  let best = 0;
  let distance = Infinity;
  xs.forEach((value, index) => {
    const next = Math.abs(value - x);
    if (next < distance) {
      distance = next;
      best = index;
    }
  });
  return best;
}

/** Step-to-step conversion in percent; the first step is always 100. */
export function conversionRates(values: number[]): number[] {
  return values.map((value, index) => {
    if (index === 0) return 100;
    const previous = values[index - 1];
    return previous > 0 ? Math.round((value / previous) * 100) : 0;
  });
}

/** Compact figures for axes and tiles: 950, 1.2K, 12K, 3.4M. */
export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

/**
 * A smooth path through the points that never overshoots them — monotone cubic
 * interpolation (Fritsch–Carlson), the same curve as D3's curveMonotoneX. Points must be
 * sorted by x.
 */
export function smoothPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return linePath(points);
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    slope.push(dx[i] === 0 ? 0 : (points[i + 1].y - points[i].y) / dx[i]);
  }
  const tangent: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    tangent.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  }
  tangent.push(slope[n - 2]);
  // Fritsch–Carlson: cap the tangents so no segment bulges past its endpoints.
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      tangent[i] = t * a * slope[i];
      tangent[i + 1] = t * b * slope[i];
    }
  }
  let d = `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const third = dx[i] / 3;
    d +=
      `C${fmt(p0.x + third)},${fmt(p0.y + tangent[i] * third)} ` +
      `${fmt(p1.x - third)},${fmt(p1.y - tangent[i + 1] * third)} ` +
      `${fmt(p1.x)},${fmt(p1.y)}`;
  }
  return d;
}

/** The smooth line closed down to a baseline. */
export function smoothAreaPath(points: Point[], baseline: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${smoothPath(points)}L${fmt(last.x)},${fmt(baseline)}L${fmt(first.x)},${fmt(baseline)}Z`;
}

/**
 * Clean ticks spanning [min, max] for axes that need not start at zero, such as a scatter
 * plot's: 20, 40, 60, 80 rather than 17.3 … 83.9.
 */
export function niceDomain(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    const pad = min === 0 ? 1 : Math.abs(min) * 0.1;
    return niceDomain(min - pad, max + pad, count);
  }
  const raw = (max - min) / Math.max(1, count);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = (NICE_STEPS.find((nice) => nice * magnitude >= raw) ?? 10) * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let tick = start; tick <= end + step / 2; tick += step) ticks.push(round(tick));
  return ticks;
}

/** The point at `fraction` of a turn (0 at twelve o'clock, clockwise) on a circle. */
export function polarPoint(cx: number, cy: number, radius: number, fraction: number): Point {
  const angle = fraction * 2 * Math.PI - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

/** A closed polygon through the points, for radar shapes and grids. */
export function polygonPath(points: Point[]): string {
  return points.length ? `${linePath(points)}Z` : "";
}

export type Rect = { x: number; y: number; width: number; height: number };

/**
 * Squarified treemap layout (Bruls, Huizing, van Wijk): tiles each value into `rect` with
 * area proportional to it, keeping tiles as close to square as it can. Returns one rect per
 * value, in input order; values should be sorted largest first for the best shapes.
 */
export function squarify(values: number[], rect: Rect): Rect[] {
  const out: Rect[] = values.map(() => ({ x: rect.x, y: rect.y, width: 0, height: 0 }));
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  if (total <= 0 || rect.width <= 0 || rect.height <= 0) return out;
  const scale = (rect.width * rect.height) / total;
  const items = values
    .map((value, index) => ({ index, area: Math.max(0, value) * scale }))
    .filter((item) => item.area > 0);

  let free = { ...rect };
  let row: typeof items = [];

  const worst = (areas: number[], side: number) => {
    const sum = areas.reduce((a, b) => a + b, 0);
    const max = Math.max(...areas);
    const min = Math.min(...areas);
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };

  const layRow = (cells: typeof items) => {
    const sum = cells.reduce((a, c) => a + c.area, 0);
    const horizontal = free.width >= free.height;
    if (horizontal) {
      const width = sum / free.height;
      let y = free.y;
      for (const cell of cells) {
        const height = cell.area / width;
        out[cell.index] = { x: free.x, y, width, height };
        y += height;
      }
      free = { x: free.x + width, y: free.y, width: free.width - width, height: free.height };
    } else {
      const height = sum / free.width;
      let x = free.x;
      for (const cell of cells) {
        const width = cell.area / height;
        out[cell.index] = { x, y: free.y, width, height };
        x += width;
      }
      free = { x: free.x, y: free.y + height, width: free.width, height: free.height - height };
    }
  };

  for (const item of items) {
    const side = Math.min(free.width, free.height);
    const current = row.map((c) => c.area);
    if (row.length === 0 || worst([...current, item.area], side) <= worst(current, side)) {
      row.push(item);
    } else {
      layRow(row);
      row = [item];
    }
  }
  if (row.length) layRow(row);
  return out;
}
