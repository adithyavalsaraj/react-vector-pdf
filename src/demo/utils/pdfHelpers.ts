import { PdfRenderer } from "../../core/PdfRenderer";

export interface HeaderFooterOptions {
  enabled: boolean;
  text: string;
  align: "left" | "center" | "right";
  fontSize: number | string;
  color: string;
  border: boolean;
  borderColor: string;
  scope?: "all" | "first-only" | "except-first" | number[];
}

function inScope(
  page: number,
  total: number,
  scope?: "all" | "first-only" | "except-first" | number[]
): boolean {
  if (!scope || scope === "all") return true;
  if (scope === "first-only") return page === 1;
  if (scope === "except-first") return page > 1;
  if (Array.isArray(scope)) return scope.includes(page);
  return true;
}

export function createHeaderRenderer(options: HeaderFooterOptions) {
  return (renderer: PdfRenderer, page: number, total: number) => {
    if (!options.enabled) return;
    if (!inScope(page, total, options.scope)) return;

    const pdf = renderer.instance;
    const fontSize = Number(options.fontSize) || 10;
    const color = options.color || "#111827";

    // y position for header text (baseline)
    const y = renderer.margin.top - 4;

    // Use renderer's textRaw to properly handle fonts + color resets
    renderer.textRaw(
      options.text,
      options.align === "center"
        ? (renderer.contentLeft + renderer.contentRight) / 2
        : options.align === "right"
        ? renderer.contentRight
        : renderer.contentLeft,
      y,
      { fontSize, color },
      undefined,
      options.align
    );

    if (options.border) {
      const borderColor = options.borderColor || "#e5e7eb";
      const rgb = borderColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (rgb) {
        pdf.setDrawColor(parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16));
      }
      pdf.setLineWidth(0.2);
      const lineY = renderer.margin.top - 1;
      pdf.line(renderer.contentLeft, lineY, renderer.contentRight, lineY);
      // Reset draw color
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.2);
    }
  };
}

export function createFooterRenderer(options: HeaderFooterOptions) {
  return (renderer: PdfRenderer, page: number, total: number) => {
    if (!options.enabled) return;
    if (!inScope(page, total, options.scope)) return;

    const pdf = renderer.instance;
    const fontSize = Number(options.fontSize) || 9;
    const color = options.color || "#9CA3AF";

    // y position: near bottom margin
    const y = renderer.height - renderer.margin.bottom + 4;

    renderer.textRaw(
      options.text,
      options.align === "center"
        ? (renderer.contentLeft + renderer.contentRight) / 2
        : options.align === "right"
        ? renderer.contentRight
        : renderer.contentLeft,
      y,
      { fontSize, color },
      undefined,
      options.align
    );

    if (options.border) {
      const borderColor = options.borderColor || "#e5e7eb";
      const rgb = borderColor.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (rgb) {
        pdf.setDrawColor(parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16));
      }
      pdf.setLineWidth(0.2);
      const lineY = renderer.height - renderer.margin.bottom + 1;
      pdf.line(renderer.contentLeft, lineY, renderer.contentRight, lineY);
      // Reset draw color
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.2);
    }
  };
}

// Legacy helpers for backward compatibility
export function demoHeader(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(10);
  pdf.text("react-vector-pdf — Demo", renderer.contentLeft, renderer.margin.top - 4);
  pdf.setLineWidth(0.2);
  pdf.line(renderer.contentLeft, renderer.margin.top - 1, renderer.contentRight, renderer.margin.top - 1);
}

export function demoFooter(renderer: PdfRenderer, page: number, total: number) {
  // No default text, handled by page numbers/center labels
}

export const parsePages = (value: string) => {
  const arr = value
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);
  return arr.length ? arr : undefined;
};
