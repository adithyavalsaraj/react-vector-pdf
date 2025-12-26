import React, { useId } from "react";
import { BoxStyle, TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";
import { usePdfItemContext } from "./internal/PdfItemContext";

export interface TableColumn {
  header?: string;
  accessor?: string | ((row: any) => React.ReactNode);
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
  repeatHeader?: boolean;
  striped?: boolean;
  className?: string;
  style?: React.CSSProperties;
  stripeColor?: string; // NEW: Custom stripe color
}

export const PdfTable: React.FC<PdfTableProps> = ({
  data,
  columns,
  width: propWidth = "100%",
  borderWidth: propBorderWidth = 0.1,
  borderColor: propBorderColor = "#000000",
  cellPadding: propCellPadding = 2,
  headerStyle,
  rowStyle,
  alternateRowStyle,
  headerHeight,
  repeatHeader = true,
  striped = false,
  stripeColor = "#E5E7EB", // Default stripe color
  className,
  style,
}) => {
  const pdf = usePdf();
  const context = usePdfItemContext();
  const id = useId();
  const { ref, computeStyle } = useClassStyles(className, style);
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    // Prevent double-queuing for same document generation
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    const computed = computeStyle();

    // Resolve Table Level Styles
    const width =
      propWidth === "100%" && computed.width ? computed.width : propWidth;

    const borderColor = computed.borderColor ?? propBorderColor;
    const borderWidth = computed.borderWidth ?? propBorderWidth;

    // Only use computed padding if className or style is explicitly provided,
    // otherwise fallback to prop to avoid browser default (0px) overriding it.
    const useComputedPadding = (!!className || !!style) && computed.padding;
    const cellPadding = useComputedPadding ? computed.padding : propCellPadding;

    // Text Styles merging
    const computedTextStyle: TextStyle & BoxStyle = {
      color: computed.color,
      fontSize: computed.fontSize,
      fontStyle: computed.fontStyle,
      align: computed.align,
      fillColor: computed.fillColor,
    };

    const mergedRowStyle = { ...computedTextStyle, ...rowStyle };
    // Header style usually overrides basic style
    const mergedHeaderStyle = { ...computedTextStyle, ...headerStyle };
    if (!headerStyle?.fontStyle) {
      mergedHeaderStyle.fontStyle = headerStyle?.fontStyle ?? "bold";
    }

    const task = async () => {
      // Margin handling
      const mt =
        typeof computed.margin === "number"
          ? computed.margin
          : computed.margin?.top;
      if (mt) {
        pdf.moveCursor(0, mt);
      }

      // 1. Calculate available width
      const totalWidth =
        typeof width === "number"
          ? width
          : (parseFloat(width as string) / 100) * pdf.contentAreaWidth;

      // 2. Resolve column widths
      // Simple algorithm: Fixed widths take space, rest distributed among "auto" or "%"
      // simplifying: support fixed (number) and weighted (default 1)

      const colWidths: number[] = columns.map((col) => {
        if (typeof col.width === "number") return col.width;
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
        // @ts-ignore
        const lines = pdf.instance.splitTextToSize(text, availW, style);

        const lineHeightMm =
          (style.fontSize ?? pdf.baseFont.size) *
          (style.lineHeight ?? pdf.baseLineHeight) *
          0.3528;

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
      const hH = headerHeight ?? 10;

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
          mergedHeaderStyle,
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
        // We'll calculate min height needed for each row based on single-row cells
        // And store spanned cells to check later
        const spannedCells: {
          ri: number;
          rSpan: number;
          content: string;
          width: number;
          style: TextStyle & BoxStyle;
        }[] = [];

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
            let style = mergedRowStyle;
            let cSpan = 1;
            let rSpan = 1;

            if (val && typeof val === "object" && val.content !== undefined) {
              content = String(val.content);
              if (val.style) style = { ...style, ...val.style };
              if (val.colSpan) cSpan = val.colSpan;
              if (val.rowSpan) rSpan = val.rowSpan;
            } else {
              content = String(val ?? "");
            }

            let effW = colWidths[ci];
            for (let k = 1; k < cSpan; k++) {
              if (ci + k < colWidths.length) effW += colWidths[ci + k];
            }

            // If spans multiple rows, store for later check
            if (rSpan > 1) {
              spannedCells.push({
                ri,
                rSpan,
                content,
                width: effW,
                style: style ?? {},
              });
              ci += cSpan - 1;
              continue;
            }

            const h = measureCell(content, effW, style ?? {});
            if (h > maxH) maxH = h;

            ci += cSpan - 1;
          }
          if (maxH < 8) maxH = 8;
          rowHeights[ri] = maxH;
        }

        // Pass 1.5: Adjust heights for spanned cells
        spannedCells.forEach((cell) => {
          const { ri, rSpan, content, width, style } = cell;
          const contentH = measureCell(content, width, style);

          // Calculate current available height in the spanned rows
          let currentSpanH = 0;
          for (let k = 0; k < rSpan; k++) {
            if (ri + k < rowHeights.length) {
              currentSpanH += rowHeights[ri + k];
            }
          }

          if (contentH > currentSpanH) {
            // Distribute difference to the last row of the span (simplest approach)
            // or maybe verify if it fits better elsewhere.
            // Adding to last row is safe because it expands the block downwards.
            const diff = contentH - currentSpanH;
            const lastRowIdx = Math.min(ri + rSpan - 1, rowHeights.length - 1);
            rowHeights[lastRowIdx] += diff;
          }
        });

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
            if (repeatHeader && (headerHeight ?? 10) !== 0) {
              let hx = startX;
              columns.forEach((col, i) => {
                const w = colWidths[i];
                drawCell(
                  col.header ?? "",
                  hx,
                  currentY,
                  w,
                  headerHeight ?? 10,
                  mergedHeaderStyle,
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

            // Determine Row Style
            // Priority: cell style > alternateRowStyle > striped default > rowStyle
            let cStyle = mergedRowStyle;
            const isAlt = ri % 2 === 1;

            if (isAlt) {
              if (alternateRowStyle) {
                cStyle = alternateRowStyle;
              } else if (striped) {
                cStyle = { ...mergedRowStyle, fillColor: stripeColor };
              }
            }
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

      // Handle Container Margin Bottom
      const mb =
        typeof computed.margin === "number"
          ? computed.margin
          : computed.margin?.bottom;
      if (mb) {
        pdf.moveCursor(0, mb);
      }
    };

    if (context) {
      context.registerOperation(id, task);
      return () => context.unregisterOperation(id);
    } else {
      pdf.queueOperation(task);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, data, columns, propWidth, className]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};
