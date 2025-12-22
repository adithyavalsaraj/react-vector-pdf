import React from "react";
import { BoxStyle, TextStyle } from "../core/types";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";

export interface TableColumn {
  header?: string;
  accessor?: string | ((row: any) => React.ReactNode); // simple text or custom? For now string.
  width?: number | string; // e.g. 20 or "20%" or "auto"
  align?: "left" | "center" | "right";
  id?: string; // unique id if accessor is function
}

export interface TableCell {
  content?: string | number;
  colSpan?: number;
  rowSpan?: number;
  style?: TextStyle & BoxStyle;
}

export interface PdfTableProps {
  data: any[];
  columns: TableColumn[];
  width?: number | string; // Table width, default 100%
  borderWidth?: number;
  borderColor?: string;
  cellPadding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  headerStyle?: TextStyle & BoxStyle;
  rowStyle?: TextStyle & BoxStyle;
  alternateRowStyle?: TextStyle & BoxStyle;
  headerHeight?: number; // min height
}

export const PdfTable: React.FC<PdfTableProps> = ({
  data,
  columns,
  width = "100%",
  borderWidth = 0.1,
  borderColor = "#000000",
  cellPadding = 2,
  headerStyle,
  rowStyle,
  alternateRowStyle,
  headerHeight,
}) => {
  const pdf = usePdf();

  React.useEffect(() => {
    pdf.queueOperation(() => {
      // 1. Calculate available width
      const totalWidth =
        typeof width === "number"
          ? width
          : (parseFloat(width) / 100) * pdf.contentAreaWidth;

      // 2. Resolve column widths
      // Simple algorithm: Fixed widths take space, rest distributed among "auto" or "%"
      // simplifying: support fixed (number) and weighted (default 1)

      const colWidths: number[] = columns.map((col) => {
        if (typeof col.width === "number") return col.width;
        // treat string as % for now, or simplistic approach
        if (typeof col.width === "string" && col.width.endsWith("%")) {
          return (parseFloat(col.width) / 100) * totalWidth;
        }
        return 0; // 'auto' placeholder
      });

      // Distribute remaining space
      const used = colWidths.reduce((a, b) => a + b, 0);
      const remaining = Math.max(0, totalWidth - used);
      const autoCount = colWidths.filter((w) => w === 0).length;
      if (autoCount > 0) {
        const perAuto = remaining / autoCount;
        for (let i = 0; i < colWidths.length; i++) {
          if (colWidths[i] === 0) colWidths[i] = perAuto;
        }
      }

      const drawCell = (
        text: string,
        x: number,
        y: number,
        w: number,
        h: number,
        style: TextStyle & BoxStyle,
        align: "left" | "center" | "right" = "left",
        drawBorder: boolean = true
      ) => {
        // Draw background/border
        if (drawBorder) {
          pdf.box(x, y, w, h, {
            borderColor: style.borderColor ?? borderColor,
            borderWidth: style.borderWidth ?? borderWidth,
            fillColor: style.fillColor,
          });
        }

        // Draw text
        // Need padding
        const basePad = resolvePadding(style.padding ?? cellPadding);
        const pad = {
          top: style.paddingTop ?? basePad.top,
          right: style.paddingRight ?? basePad.right,
          bottom: style.paddingBottom ?? basePad.bottom,
          left: style.paddingLeft ?? basePad.left,
        };
        const availW = w - pad.left - pad.right;

        // Manually split text to ensure wrapping respects the cell width
        const lines = pdf.instance.splitTextToSize(text, availW, style);

        const lineHeightMm =
          (style.fontSize ?? pdf.baseFont.size) *
          (style.lineHeight ?? pdf.baseLineHeight) *
          0.3528;

        // Vertical alignment calculation
        // Fix: Use simpler baseline calculation.
        // We draw from top of cell. textY is the baseline of the first line.
        // Approx baseline for top-aligned text is y + padding + fontSize (ascender).

        // Vertical alignment calculation
        const fontSizeMm = (style.fontSize ?? pdf.baseFont.size) * 0.3528;

        // Calculate total text block height
        // Note: lines.length * lineHeightMm is the height of the text content
        const textHeight = lines.length * lineHeightMm;
        const availH = h - pad.top - pad.bottom;

        let offsetY = 0;
        if (style.verticalAlign === "middle") {
          offsetY = Math.max(0, (availH - textHeight) / 2);
        } else if (style.verticalAlign === "bottom") {
          offsetY = Math.max(0, availH - textHeight);
        }

        // Baseline logic: y + pad.top + offsetY + fontSize (ascender approx)
        let textY = y + pad.top + offsetY + fontSizeMm;

        // Determine effective horizontal alignment from style or default
        const effAlign = style.align ?? align;

        // Store cursor before drawing
        const prevCursor = pdf.getCursor();

        lines.forEach((line: string) => {
          let lineX = x + pad.left;

          if (effAlign === "center") {
            lineX = x + w / 2;
          } else if (effAlign === "right") {
            lineX = x + w - pad.right;
          }

          // pdf.textRaw uses pdf.text. jsPDF default baseline is alphabetic (bottom-left).
          // So passing Y as baseline is correct.
          pdf.textRaw(line, lineX, textY, style, undefined, effAlign);
          textY += lineHeightMm;
        });

        pdf.setCursor(prevCursor.x, prevCursor.y);
      };

      // Header
      let y = pdf.getCursor().y;
      const startX = pdf.getCursor().x;

      // Calculate Header Height
      // For now assume fixed or single line?
      // User asked for "expand cell based on content".
      // We need to measure logic.
      const hH = headerHeight ?? 10; // TODO: measure

      // Check page break for header
      if (y + hH > pdf.contentBottom) {
        pdf.addPage();
        y = pdf.getCursor().y;
      }

      let x = startX;
      columns.forEach((col, i) => {
        const w = colWidths[i];
        drawCell(
          col.header ?? "",
          x,
          y,
          w,
          hH,
          headerStyle ?? { fontStyle: "bold" },
          col.align ?? "left"
        );
        x += w;
      });
      y += hH;
      pdf.setCursor(startX, y);

      // Rows
      // Method to measure cell text height
      const measureCell = (
        text: string,
        width: number,
        style: TextStyle & BoxStyle
      ) => {
        // padding?
        const basePad = resolvePadding(cellPadding);
        const pad = {
          top: style.paddingTop ?? basePad.top,
          right: style.paddingRight ?? basePad.right,
          bottom: style.paddingBottom ?? basePad.bottom,
          left: style.paddingLeft ?? basePad.left,
        };
        const availW = width - pad.left - pad.right;
        const dims = pdf.measureText(text, style, availW);
        return dims.height + pad.top + pad.bottom;
      };

      // Skip map for rowspans: [colIndex] -> number of rows to skip
      const skipMap: number[] = new Array(columns.length).fill(0);

      const renderRows = () => {
        const rowHeights: number[] = new Array(data.length).fill(0);

        // Pass 1: Measure Heights
        for (let ri = 0; ri < data.length; ri++) {
          const row = data[ri];
          let maxH = 0;

          for (let ci = 0; ci < columns.length; ci++) {
            const col = columns[ci];
            const val =
              typeof col.accessor === "function"
                ? col.accessor(row)
                : row[col.accessor as string];
            let content = "";
            let style = rowStyle;
            let cSpan = 1;
            let rSpan = 1;

            if (val && typeof val === "object" && val.content !== undefined) {
              content = String(val.content);
              if (val.style) style = val.style;
              if (val.colSpan) cSpan = val.colSpan;
              if (val.rowSpan) rSpan = val.rowSpan;
            } else {
              content = String(val ?? "");
            }

            // If spans multiple rows, don't use it to calculate THIS row's height
            if (rSpan > 1) {
              ci += cSpan - 1;
              continue;
            }

            let effW = colWidths[ci];
            for (let k = 1; k < cSpan; k++) {
              if (ci + k < colWidths.length) effW += colWidths[ci + k];
            }

            const h = measureCell(content, effW, style ?? {});
            if (h > maxH) maxH = h;

            ci += cSpan - 1;
          }
          if (maxH < 8) maxH = 8;
          rowHeights[ri] = maxH;
        }

        // Pass 2: Render
        let currentY = y;
        const skipMap: number[] = new Array(columns.length).fill(0);

        const startX = pdf.getCursor().x;

        for (let ri = 0; ri < data.length; ri++) {
          const row = data[ri];
          const rowH = rowHeights[ri];

          // Pre-calculate max vertical reach for this row to check page break
          let maxReach = rowH;
          for (let ci = 0; ci < columns.length; ci++) {
            // Accessor logic duplicated to find rowSpan
            // We can optimizations later, but for now cleanliness:
            const col = columns[ci];
            const val =
              typeof col.accessor === "function"
                ? col.accessor(row)
                : row[col.accessor as string];
            let rSpan = 1;
            if (val && typeof val === "object" && val.rowSpan) {
              rSpan = val.rowSpan;
            }

            if (rSpan > 1) {
              let spanH = 0;
              for (let k = 0; k < rSpan; k++) {
                if (ri + k < rowHeights.length) spanH += rowHeights[ri + k];
              }
              if (spanH > maxReach) maxReach = spanH;
            }
          }

          // Check Break with maxReach
          // Prevent infinite loop if element is larger than page (only break if we are not at top)
          const isAtTop =
            Math.abs(currentY - (pdf.contentTop + (headerHeight ?? 10))) < 1;

          if (currentY + maxReach > pdf.contentBottom && !isAtTop) {
            pdf.addPage();
            currentY = pdf.getCursor().y;
            // Header Repeat
            if (headerHeight !== 0) {
              let hx = startX;
              columns.forEach((col, i) => {
                const w = colWidths[i];
                drawCell(
                  col.header ?? "",
                  hx,
                  currentY,
                  w,
                  headerHeight ?? 10,
                  headerStyle ?? { fontStyle: "bold" },
                  col.align ?? "left"
                );
                hx += w;
              });
              currentY += headerHeight ?? 10;
            }
          }

          let currentX = startX;
          for (let ci = 0; ci < columns.length; ci++) {
            if (skipMap[ci] > 0) {
              skipMap[ci]--;
              currentX += colWidths[ci];
              continue;
            }

            const col = columns[ci];
            const val =
              typeof col.accessor === "function"
                ? col.accessor(row)
                : row[col.accessor as string];
            let cSpan = 1;
            let rSpan = 1;
            let cStyle =
              ri % 2 === 1 && alternateRowStyle ? alternateRowStyle : rowStyle;
            let content = "";

            if (val && typeof val === "object" && val.content !== undefined) {
              content = String(val.content);
              if (val.colSpan) cSpan = val.colSpan;
              if (val.rowSpan) rSpan = val.rowSpan;
              if (val.style) cStyle = { ...cStyle, ...val.style };
            } else {
              content = String(val ?? "");
            }

            let cellW = colWidths[ci];
            for (let k = 1; k < cSpan; k++) {
              if (ci + k < colWidths.length) cellW += colWidths[ci + k];
            }

            // Calculate total height for this cell
            let cellH = rowH;
            if (rSpan > 1) {
              for (let k = 1; k < rSpan; k++) {
                if (ri + k < rowHeights.length) {
                  cellH += rowHeights[ri + k];
                }
              }
            }

            drawCell(
              content,
              currentX,
              currentY,
              cellW,
              cellH,
              cStyle ?? {},
              col.align ?? "left",
              true
            );

            // Update RowSpans
            if (rSpan > 1) {
              skipMap[ci] = rSpan - 1;
              for (let k = 1; k < cSpan; k++) {
                if (ci + k < skipMap.length) skipMap[ci + k] = rSpan - 1;
              }
            }

            currentX += cellW;
            ci += cSpan - 1;
          }
          currentY += rowH;
        }
        pdf.setCursor(startX, currentY);
      };

      renderRows();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, width]); // simplified deps

  return null;
};
