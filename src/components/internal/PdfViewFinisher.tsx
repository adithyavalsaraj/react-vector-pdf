import React from "react";
import type { ViewStyle } from "../../core/types";
import { hexToRgb } from "../../core/utils";
import { usePdf } from "../PdfProvider";

export interface PdfViewFinisherProps {
  viewState: {
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  };
  style: ViewStyle;
  pad: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  w?: number;
  h?: number;
}

export const PdfViewFinisher: React.FC<PdfViewFinisherProps> = ({
  viewState,
  style,
  pad,
  margin,
  w,
  h,
}) => {
  const pdf = usePdf();

  React.useLayoutEffect(() => {
    pdf.queueOperation(() => {
      const start = viewState.start;
      if (!start) return;

      // Stop Recording
      // const ops = pdf.stopRecording(); // DISABLED

      // Clear the height reservation
      // We keep it during playback to ensure consistent layout, clear it at the very end

      let boxW = w ?? pdf.contentAreaWidth;
      if (typeof style.width === "number") {
        boxW = style.width;
      }

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

        let drawY = pdf.contentTop;
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
          drawY = pdf.contentTop;
          if (style.height) {
            drawH = after.y - pdf.contentTop + pad.bottom;
          } else {
            drawH = after.y - pdf.contentTop + pad.bottom;
          }
          // Clamp to physical margins, effectively ignoring reserved height (padding) for the box itself
          const physicalBottom = pdf.height - pdf.margin.bottom;
          drawH = Math.min(drawH, physicalBottom - pdf.contentTop);
        } else {
          // Middle page
          drawY = pdf.contentTop;
          drawH = pdf.height - pdf.margin.bottom - pdf.contentTop;
        }

        // Draw Borders (Foreground) - Draw first to ensure they appear even if background injection fails
        if (style.borderColor || style.borderWidth) {
          const inst = pdf.instance;
          const width = style.borderWidth ?? 0.1;
          const color = style.borderColor ?? "#000000";
          inst.setLineWidth(width);
          const rgb = hexToRgb(color);
          if (rgb) inst.setDrawColor(rgb[0], rgb[1], rgb[2]);

          const gx = p === startPage ? start.x : pdf.contentLeft;
          const gy = drawY;
          const gw = boxW;
          const gh = drawH;

          inst.line(gx, gy, gx, gy + gh);
          inst.line(gx + gw, gy, gx + gw, gy + gh);

          if (p === startPage) inst.line(gx, gy, gx + gw, gy);
          if (p === endPage) inst.line(gx, gy + gh, gx + gw, gy + gh);
        }

        // Draw Background (Inject Fill Behind)
        if (style.fillColor) {
          const rectX = p === startPage ? start.x : pdf.contentLeft;
          const rectY = drawY;
          const rectW = boxW;
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
      // @ts-ignore
      if (pdf.popIndent) pdf.popIndent();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, style, w, h]);

  return null;
};
