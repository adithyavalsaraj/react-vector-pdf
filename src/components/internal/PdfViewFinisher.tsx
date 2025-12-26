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
    // Only queue once per renderer instance/generation to prevent double-drawing
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

      // Smart Defaults: matching logic in Init
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

      // STRATEGY: Single Pass (No Record/Playback)
      // 1. Calculate Page Geometry based on current cursor (after children drawn)
      // 2. Inject Background Fill (BEHIND CONTENT) into Page Stream.
      // 3. Draw Borders (FOREGROUND) using standard draw commands.

      // Pass 1: Layout - Already done by children
      // pdf.playback(ops); // DISABLED

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
        // This prevents artifacts (extra empty borders) when layout calculations result in tiny fragments
        if (drawH < 0.5 || isNaN(drawH)) continue;

        // Draw Borders (Foreground) - Draw first to ensure they appear even if background injection fails
        // Only draw border if borderWidth is explicitly set and > 0
        if (style.borderWidth && style.borderWidth > 0) {
          const inst = pdf.instance;
          const width = style.borderWidth;
          const color = style.borderColor ?? "#000000";
          inst.setLineWidth(width);
          const rgb = hexToRgb(color);
          if (rgb) inst.setDrawColor(rgb[0], rgb[1], rgb[2]);

          // Border box X position: use start.x consistently on ALL pages
          // Safety: Clamp to margin.left to prevent any weird negative shifts, though start.x should be safe
          const gx = Math.max(start.x, pdf.margin.left);
          const gy = drawY;
          const gw = boxWidthWithPadding;
          const gh = drawH;

          inst.line(gx, gy, gx, gy + gh);
          inst.line(gx + gw, gy, gx + gw, gy + gh);

          if (p === startPage) inst.line(gx, gy, gx + gw, gy);
          if (p === endPage) inst.line(gx, gy + gh, gx + gw, gy + gh);
        }

        // Draw Background (Inject Fill Behind)
        if (style.fillColor) {
          // Background box X position: use start.x consistently on ALL pages
          // Safety: Clamp to margin.left
          const rectX = Math.max(start.x, pdf.margin.left);
          const rectY = drawY;
          const rectW = boxWidthWithPadding;
          const rectH = drawH;

          // Inject Fill
          // We wrap this in try-catch to prevent crashes from aborting the rest of the render (though borders are now safe)
          try {
            if ((pdf as any).injectFill) {
              (pdf as any).injectFill(
                p,
                { x: rectX, y: rectY, w: rectW, h: rectH },
                style.fillColor
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
        // Do not move cursor
      } else {
        const finalY = after.y + pad.bottom + margin.bottom;
        pdf.setCursor(start.x, finalY);
      }

      // Finally clear reservation for this view
      pdf.setReservedHeight(0);

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
