import { PdfRenderer } from "../../core/PdfRenderer";

export function demoHeader(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(10);
  pdf.text("react-vector-pdf — Demo", renderer.contentLeft, 10);
  pdf.setLineWidth(0.2);
  pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
}

export function demoFooter(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text(
    "Generated with jsPDF (vector text, selectable)",
    renderer.contentLeft,
    renderer.height - 7
  );
}

export const parsePages = (value: string) => {
  const arr = value
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);
  return arr.length ? arr : undefined;
};
