import { PdfRenderer } from "../../core/PdfRenderer";

export interface HeaderFooterOptions {
  enabled: boolean;
  text: string;
  align: "left" | "center" | "right";
  fontSize: number | string;
  color: string;
  border: boolean;
  borderColor: string;
}

export function createHeaderRenderer(options: HeaderFooterOptions) {
  return (renderer: PdfRenderer, page: number, total: number) => {
    if (!options.enabled) return;

    const pdf = renderer.instance;
    renderer.setTextStyle({
      fontSize: Number(options.fontSize) || 10,
      color: options.color || "#000000",
    });

    const textWidth =
      (pdf.getStringUnitWidth(options.text) *
        (Number(options.fontSize) || 10)) /
      pdf.internal.scaleFactor;
    let x = renderer.contentLeft;

    if (options.align === "center") {
      x = (renderer.width - textWidth) / 2;
      // Simple center align for now - jspdf text api also supports 'align' option depending on version/wrapper
      // But let's stick to standard positioning if we can, or use the align arg if PdfRenderer exposes it nicely.
      // actually jspdf text takes options. But let's trust the wrapper or use simple math.
      // Wait, PdfRenderer might abstract this? Accessing .instance means raw jsPDF.
      pdf.text(options.text, renderer.width / 2, options.enabled ? 10 : 0, {
        align: "center",
      });
    } else if (options.align === "right") {
      pdf.text(options.text, renderer.contentRight, options.enabled ? 10 : 0, {
        align: "right",
      });
    } else {
      pdf.text(options.text, renderer.contentLeft, options.enabled ? 10 : 0);
    }

    if (options.border) {
      pdf.setDrawColor(options.borderColor || "#000000");
      pdf.setLineWidth(0.1); // thin line
      // Draw line below header
      pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
    }
  };
}

export function createFooterRenderer(options: HeaderFooterOptions) {
  return (renderer: PdfRenderer, page: number, total: number) => {
    if (!options.enabled) return;

    const pdf = renderer.instance;
    renderer.setTextStyle({
      fontSize: Number(options.fontSize) || 9,
      color: options.color || "#000000",
    });

    const y = renderer.height - 10; // 10 units from bottom

    if (options.align === "center") {
      pdf.text(options.text, renderer.width / 2, y, { align: "center" });
    } else if (options.align === "right") {
      pdf.text(options.text, renderer.contentRight, y, { align: "right" });
    } else {
      pdf.text(options.text, renderer.contentLeft, y);
    }

    if (options.border) {
      pdf.setDrawColor(options.borderColor || "#000000");
      pdf.setLineWidth(0.1);
      // Draw line above footer (a bit higher than text)
      pdf.line(renderer.contentLeft, y - 4, renderer.contentRight, y - 4);
    }
  };
}

// Keep existing helpers for backward compatibility if needed, or replace them
export function demoHeader(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(10);
  pdf.text("react-vector-pdf — Demo", renderer.contentLeft, 10);
  pdf.setLineWidth(0.2);
  pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
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
