export const mm = (v: number) => v;

export function resolvePadding(
  p?: number | { top?: number; right?: number; bottom?: number; left?: number }
) {
  if (!p && p !== 0) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (typeof p === "number") return { top: p, right: p, bottom: p, left: p };
  return {
    top: p.top ?? 0,
    right: p.right ?? 0,
    bottom: p.bottom ?? 0,
    left: p.left ?? 0,
  };
}

export function hexToRgb(
  color: string
): [number, number, number, number] | null {
  if (!color) return null;
  // Handle Hex
  if (color.startsWith("#")) {
    const s = color.replace("#", "");
    if (s.length === 3) {
      const r = parseInt(s[0] + s[0], 16);
      const g = parseInt(s[1] + s[1], 16);
      const b = parseInt(s[2] + s[2], 16);
      return [r, g, b, 1];
    }
    if (s.length === 6) {
      const r = parseInt(s.slice(0, 2), 16);
      const g = parseInt(s.slice(2, 4), 16);
      const b = parseInt(s.slice(4, 6), 16);
      return [r, g, b, 1];
    }
    if (s.length === 8) {
      const r = parseInt(s.slice(0, 2), 16);
      const g = parseInt(s.slice(2, 4), 16);
      const b = parseInt(s.slice(4, 6), 16);
      const a = parseInt(s.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    }
  }

  // Handle rgba(r, g, b, a) or rgb(r, g, b)
  const match = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    return [r, g, b, a];
  }

  return null;
}

export function toRoman(n: number, uppercase = true): string {
  if (n <= 0) return String(n);
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let v = n,
    out = "";
  for (const [val, sym] of map) {
    while (v >= val) {
      out += sym;
      v -= val;
    }
  }
  return uppercase ? out : out.toLowerCase();
}

export function inScope(
  page: number,
  scope: "all" | "first-only" | "except-first" | number[] | undefined
): boolean {
  if (!scope || scope === "all") return true;
  if (scope === "first-only") return page === 1;
  if (scope === "except-first") return page > 1;
  if (Array.isArray(scope)) return scope.includes(page);
  return true;
}
