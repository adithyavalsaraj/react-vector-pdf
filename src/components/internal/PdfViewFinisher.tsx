import React from "react";
import type { ViewStyle } from "../../core/types";
import { hexToRgb, resolvePadding } from "../../core/utils";
import { usePdf } from "../PdfProvider";

export interface PdfViewFinisherProps {
  viewState: {
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  };
  style: ViewStyle;
  className?: string;
  computeStyle: () => any;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  showInAllPages?: boolean;
  scope?: any;
}

export const PdfViewFinisher: React.FC<PdfViewFinisherProps> = ({
  viewState,
  style: styleProp,
  className,
  computeStyle,
  w,
  h,
  showInAllPages,
  scope: scopeProp,
}) => {
  const pdf = usePdf();
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    // Ensure operation is queued only once per generation.
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    pdf.queueOperation(() => {
      const start = viewState.start;
      if (!start) return;

      // Resolve styles inside the queue
      const computed = computeStyle();
      let style = { ...computed, ...styleProp } as ViewStyle;

      // Apply smart defaults consistent with initialization logic.
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
      if (scopeProp !== undefined) style.scope = scopeProp;

      const basePad = resolvePadding(style.padding);
      const pad = {
        top: style.paddingTop ?? basePad.top,
        right: style.paddingRight ?? basePad.right,
        bottom: style.paddingBottom ?? basePad.bottom,
        left: style.paddingLeft ?? basePad.left,
      };

      const resolvedMargin = (
        m?:
          | number
          | { top?: number; right?: number; bottom?: number; left?: number }
      ) => {
        if (typeof m === "number")
          return { top: m, right: m, bottom: m, left: m };
        return {
          top: m?.top ?? 0,
          right: m?.right ?? 0,
          bottom: m?.bottom ?? 0,
          left: m?.left ?? 0,
        };
      };
      const baseMargin = resolvedMargin(style.margin);
      const margin = {
        top: style.marginTop ?? baseMargin.top,
        right: style.marginRight ?? baseMargin.right,
        bottom: style.marginBottom ?? baseMargin.bottom,
        left: style.marginLeft ?? baseMargin.left,
      };

      // Box width
      let boxW = w ?? pdf.contentAreaWidth;
      if (typeof style.width === "number") {
        boxW = style.width;
      }
      const boxWidthWithPadding = boxW + pad.left + pad.right;

      // Strategy: Calculate geometry and draw background/borders.

      // Pass 1: Layout - Already done by children

      const endPage = pdf.getPageCount();
      const after = pdf.getCursor();
      const startPage = viewState.start!.page ?? endPage;

      // Draw Box (Background/Borders)
      for (let p = startPage; p <= endPage; p++) {
        pdf.instance.setPage(p);

        // Calculate safe top position (accounting for recurring headers)
        const safeTop = (pdf as any).getSafeContentTop
          ? (pdf as any).getSafeContentTop(p)
          : pdf.contentTop;

        let drawY = safeTop;
        let drawH: number;

        if (p === startPage) {
          drawY = start.y;
          if (p === endPage) {
            // Single page scenario
            if (style.height) {
              drawH = style.height;
            } else {
              drawH = after.y - start.y + pad.bottom;
            }
          } else {
            // First page of multi-page
            drawH = pdf.height - pdf.margin.bottom - start.y;
          }
        } else if (p === endPage) {
          // Last page of multi-page
          drawY = safeTop;
          if (style.height) {
            drawH = after.y - safeTop + pad.bottom;
          } else {
            drawH = after.y - safeTop + pad.bottom;
          }
          // Clamp to physical margins, effectively ignoring reserved height (padding) for the box itself
          const physicalBottom = pdf.height - pdf.margin.bottom;
          drawH = Math.min(drawH, physicalBottom - safeTop);
        } else {
          // Middle page
          drawY = safeTop;
          drawH = pdf.height - pdf.margin.bottom - safeTop;
        }

        // Safety: Ensure we don't draw negative or near-zero height boxes
        if (drawH < 0.5 || isNaN(drawH)) continue;

        const r = style.radius ?? 0;
        const isSinglePageItem = startPage === endPage;

        // Draw Borders (Foreground)
        if (style.borderWidth && style.borderWidth > 0) {
          const inst = pdf.instance;
          const width = style.borderWidth;
          const color = style.borderColor ?? "#000000";
          inst.setLineWidth(width);
          const rgb = hexToRgb(color);
          if (rgb) inst.setDrawColor(rgb[0], rgb[1], rgb[2]);

          const gx = Math.max(start.x, pdf.margin.left);
          const gy = drawY;
          const gw = boxWidthWithPadding;
          const gh = drawH;

          if (r > 0 && isSinglePageItem) {
            // Single page: all corners rounded
            inst.roundedRect(gx, gy, gw, gh, r, r);
          } else if (r > 0 && !isSinglePageItem) {
            // Multi-page: smart caps
            // We need to manually draw lines and arcs because standard rects don't support partial radius

            // Helper for partial rounded rect
            // 0=TopLeft, 1=TopRight, 2=BottomRight, 3=BottomLeft
            const drawSmartRect = (corners: boolean[]) => {
              // Construct path using lines and arcs for proper scaling

              // Let's use lines and arcs.
              // K = 0.551784
              const k = 0.551784;
              const kr = r * k;

              let ops: any[] = [];

              // Start Top-Left
              if (corners[0]) {
                // Move to start of arc
                inst.moveTo(gx, gy + r);
                inst.curveTo(gx, gy + r - kr, gx + r - kr, gy, gx + r, gy);
              } else {
                inst.moveTo(gx, gy);
              }

              // Top Edge
              inst.lineTo(gx + gw - (corners[1] ? r : 0), gy);

              // Top-Right
              if (corners[1]) {
                inst.curveTo(
                  gx + gw - r + kr,
                  gy,
                  gx + gw,
                  gy + r - kr,
                  gx + gw,
                  gy + r
                );
              } else {
                inst.lineTo(gx + gw, gy);
              }

              // Right Edge
              inst.lineTo(gx + gw, gy + gh - (corners[2] ? r : 0));

              // Bottom-Right
              if (corners[2]) {
                inst.curveTo(
                  gx + gw,
                  gy + gh - r + kr,
                  gx + gw - r + kr,
                  gy + gh,
                  gx + gw - r,
                  gy + gh
                );
              } else {
                inst.lineTo(gx + gw, gy + gh);
              }

              // Bottom Edge
              inst.lineTo(gx + (corners[3] ? r : 0), gy + gh);

              // Bottom-Left
              if (corners[3]) {
                inst.curveTo(
                  gx + r - kr,
                  gy + gh,
                  gx,
                  gy + gh - r + kr,
                  gx,
                  gy + gh - r
                );
              } else {
                inst.lineTo(gx, gy + gh);
              }

              // Left Edge (close)
              if (corners[0]) {
                inst.lineTo(gx, gy + r);
              } else {
                inst.lineTo(gx, gy);
              }

              inst.stroke();
            };

            if (p === startPage) {
              // Top corners rounded, bottom square
              drawSmartRect([true, true, false, false]);
            } else if (p === endPage) {
              // Top square, bottom rounded
              drawSmartRect([false, false, true, true]);
            } else {
              // All square
              drawSmartRect([false, false, false, false]);
            }
          } else {
            // Draw standard rectangular borders.
            inst.line(gx, gy, gx, gy + gh);
            inst.line(gx + gw, gy, gx + gw, gy + gh);

            if (p === startPage) inst.line(gx, gy, gx + gw, gy);
            if (p === endPage) inst.line(gx, gy + gh, gx + gw, gy + gh);
          }
        }

        // Draw Background (Inject Fill Behind)
        if (style.fillColor) {
          const rectX = Math.max(start.x, pdf.margin.left);
          const rectY = drawY;
          const rectW = boxWidthWithPadding;
          const rectH = drawH;

          try {
            if ((pdf as any).injectFill) {
              let radiusToApply:
                | number
                | { tl?: number; tr?: number; br?: number; bl?: number } = 0;

              if (r > 0 && isSinglePageItem) {
                radiusToApply = r;
              } else if (r > 0) {
                if (p === startPage) {
                  radiusToApply = { tl: r, tr: r, br: 0, bl: 0 };
                } else if (p === endPage) {
                  radiusToApply = { tl: 0, tr: 0, br: r, bl: r };
                } else {
                  radiusToApply = 0;
                }
              }

              (pdf as any).injectFill(
                p,
                { x: rectX, y: rectY, w: rectW, h: rectH },
                style.fillColor,
                radiusToApply
              );
            }
          } catch (e) {
            console.warn("Background injection failed", e);
          }
        }
      }

      // Restore page
      pdf.instance.setPage(endPage);

      // Handle Recurring Items
      if (style.showInAllPages) {
        const recurringDraw = () => {
          const rH = style.height ?? 20;
          pdf.box(start.x, start.y, boxW, rH, style);
        };
        pdf.registerRecurringItem({
          draw: recurringDraw,
          scope: style.scope ?? "all",
          y: start.y,
          height: style.height ?? 0,
        });
      }

      if (viewState.isAbsolute) {
        // Absolute positioning does not affect the cursor stack.
      } else {
        // We need to restore cursor.
        // popVerticalPadding will add pad.bottom to cursorY.
        // We also need to add margin.bottom.

        // However, 'after.y' is where content ended.
        // If we pop logic, we assume cursor is at 'after.y'.
        // Let's set cursor to 'after.y' first.
        pdf.setCursor(start.x, after.y);

        // @ts-ignore
        if (pdf.popVerticalPadding) {
          // @ts-ignore
          pdf.popVerticalPadding(); // Adds pad.bottom
        } else {
          // Fallback
          pdf.moveCursor(0, pad.bottom);
          pdf.setReservedHeight(0);
        }

        // Add margin bottom
        if (margin.bottom > 0) {
          pdf.moveCursor(0, margin.bottom);
        }
      }

      // Restore Indentation
      if ((viewState as any).hasIndent) {
        // @ts-ignore
        if (pdf.popIndent) pdf.popIndent();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, styleProp, w, h, showInAllPages, scopeProp]);

  return null;
};
