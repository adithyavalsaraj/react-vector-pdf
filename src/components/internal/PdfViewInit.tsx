import React from "react";
import { ViewStyle } from "../../core/types";
import { resolvePadding } from "../../core/utils";
import { usePdf } from "../PdfProvider";
import { PdfRowContext } from "../PdfView";

export interface PdfViewInitProps {
  style: ViewStyle;
  className?: string;
  computeStyle: () => any;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  showInAllPages?: boolean;
  scope?: any;
  viewState: {
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  };
  isRow?: boolean;
  rowStateRef?: React.MutableRefObject<{ startX: number; startY: number; finalYs: number[] }>;
  debug?: boolean;
}

// Indent cursor for padding to ensure content respects the padded area.

function resolveMargin(
  m?: number | { top?: number; right?: number; bottom?: number; left?: number }
) {
  if (typeof m === "number") {
    return { top: m, right: m, bottom: m, left: m };
  }
  return {
    top: m?.top ?? 0,
    right: m?.right ?? 0,
    bottom: m?.bottom ?? 0,
    left: m?.left ?? 0,
  };
}

export const PdfViewInit: React.FC<PdfViewInitProps> = ({
  style: styleProp,
  className,
  computeStyle,
  x,
  y,
  w,
  h,
  showInAllPages,
  scope,
  viewState,
  isRow,
  rowStateRef,
  debug,
}) => {
  const pdf = usePdf();
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);
  const rowContext = React.useContext(PdfRowContext);

  React.useLayoutEffect(() => {
    // Only queue once per renderer instance/generation to prevent double-indents
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    pdf.queueOperation(() => {
      // Resolve styles inside the queue when DOM is ready
      const computed = computeStyle();
      let style = { ...computed, ...styleProp } as ViewStyle;

      // Apply smart defaults similar to PdfView logic.
      const hasBg = !!style.fillColor;
      const hasBorder = !!style.borderColor || (style.borderWidth ?? 0) > 0;
      const styleHasPadding =
        styleProp.padding !== undefined ||
        styleProp.paddingTop !== undefined ||
        styleProp.paddingRight !== undefined ||
        styleProp.paddingBottom !== undefined ||
        styleProp.paddingLeft !== undefined;

      if ((hasBg || hasBorder) && !styleHasPadding && !className) {
        style.padding = 4;
      }

      // Merge props
      if (showInAllPages !== undefined) style.showInAllPages = showInAllPages;
      if (scope !== undefined) style.scope = scope;

      const basePad = resolvePadding(style.padding);
      const pad = {
        top: style.paddingTop ?? basePad.top,
        right: style.paddingRight ?? basePad.right,
        bottom: style.paddingBottom ?? basePad.bottom,
        left: style.paddingLeft ?? basePad.left,
      };

      const baseMargin = resolveMargin(style.margin);
      const margin = {
        top: style.marginTop ?? baseMargin.top,
        right: style.marginRight ?? baseMargin.right,
        bottom: style.marginBottom ?? baseMargin.bottom,
        left: style.marginLeft ?? baseMargin.left,
      };

      // If we are a row container, record initial coordinate points
      if (isRow && rowStateRef) {
        rowStateRef.current.startX = pdf.getCursor().x;
        rowStateRef.current.startY = pdf.getCursor().y;
        rowStateRef.current.finalYs = [];
      }

      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof w === "number" &&
        typeof h === "number"
      ) {
        viewState.isAbsolute = true;
        const page = pdf.getPageCount();
        viewState.start = { x, y, page };
        pdf.setCursor(x + pad.left, y + pad.top);
      } else {
        viewState.isAbsolute = false;
        // Add Margin Top
        if (margin.top > 0) {
          pdf.moveCursor(0, margin.top);
        }

        // Support explicit height (e.g. for gaps/spacers)
        if (typeof style.height === "number" && style.height > 0) {
          pdf.moveCursor(0, style.height);
        }

        if (rowContext) {
          const rowStartY = rowContext.rowStateRef.current.startY;
          pdf.setCursor(pdf.getCursor().x, rowStartY);
        }

        const start = pdf.getCursor();
        const page = pdf.getPageCount();
        viewState.start = { ...start, page };

        // Use pushIndent to persist indentation across page breaks.
        if (pdf.pushIndent) {
          // Apply Indentation
          if (rowContext) {
            const currentAbsoluteLeft = pdf.margin.left + pdf.currentIndent.left;
            const currentAbsoluteRight = pdf.pageWidth - pdf.margin.right - pdf.currentIndent.right;

            const parentStartX = rowContext.rowStateRef.current.startX;
            const parentWidth = pdf.contentWidth;
            const totalGaps = (rowContext.N - 1) * rowContext.gap;
            const netAvailableWidth = Math.max(0, parentWidth - totalGaps);

            const colWidths = rowContext.customWidths.map((wVal) => {
              if (typeof wVal === "number") return wVal;
              if (typeof wVal === "string" && wVal.endsWith("%")) {
                return netAvailableWidth * (parseFloat(wVal) / 100);
              }
              return null;
            });

            const assignedSum = colWidths.reduce((sum: number, wVal) => sum + (wVal ?? 0), 0);
            const remainingWidth = Math.max(0, netAvailableWidth - assignedSum);
            const unassignedCount = colWidths.filter((wVal) => wVal === null).length;
            const equalWidth = unassignedCount > 0 ? remainingWidth / unassignedCount : 0;

            const finalWidths = colWidths.map((wVal) => wVal ?? equalWidth);

            const colWidth = finalWidths[rowContext.colIndex];
            let colX = parentStartX;
            for (let i = 0; i < rowContext.colIndex; i++) {
              colX += finalWidths[i] + rowContext.gap;
            }

            // Expose computed colWidth to finisher via viewState
            (viewState as any).colWidth = colWidth;

            const targetAbsoluteLeft = colX + pad.left;
            const targetAbsoluteRight = colX + colWidth - pad.right;

            const indentLeft = targetAbsoluteLeft - currentAbsoluteLeft;
            const indentRight = currentAbsoluteRight - targetAbsoluteRight;

            pdf.pushIndent(indentLeft, indentRight);
            (viewState as any).hasIndent = true;
          } else if (pad.left > 0 || pad.right > 0) {
            pdf.pushIndent(pad.left, pad.right);
            (viewState as any).hasIndent = true;
          }

          // Also move Y for padding Top
          // Note: pushIndent moves X. pushVerticalPadding moves Y and manages stack.
          if (pdf.pushVerticalPadding) {
            pdf.pushVerticalPadding(pad.top, pad.bottom);
          } else {
            // Fallback
            if (pad.top > 0) pdf.moveCursor(0, pad.top);
            pdf.setReservedHeight(pad.bottom);
          }
        } else {
          // Fallback for environments traversing legacy renderer versions.
          pdf.setCursor(start.x + pad.left, start.y + pad.top);
          pdf.setReservedHeight(pad.bottom);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, styleProp, x, y, w, h, showInAllPages, scope, isRow, rowStateRef, rowContext, debug]);

  return null;
};
