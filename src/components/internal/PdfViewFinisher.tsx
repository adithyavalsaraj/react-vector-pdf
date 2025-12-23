import React from "react";
import type { ViewStyle } from "../../core/types";
import { usePdf } from "../PdfProvider";

export interface PdfViewFinisherProps {
  viewState: { start?: { x: number; y: number }; isAbsolute?: boolean };
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

  React.useEffect(() => {
    pdf.queueOperation(() => {
      const start = viewState.start;
      if (!start) return;

      const after = pdf.getCursor();
      // Calculate content height consumed by children
      const contentHeight = Math.max(after.y - start.y - pad.top, 0);

      let boxH = h ?? contentHeight + pad.top + pad.bottom;

      // Fixed height override from style?
      if (style.height) {
        boxH = style.height;
      }

      let boxW = w ?? pdf.contentAreaWidth;
      if (typeof style.width === "number") {
        boxW = style.width;
      }

      // Draw the box shape (Border/Background)
      const drawBox = () => {
        if (style.borderColor || style.fillColor || style.borderWidth) {
          pdf.box(start.x, start.y, boxW, boxH, style);
        }
      };

      drawBox();

      if (style.showInAllPages) {
        pdf.registerRecurringItem({
          draw: drawBox,
          scope: style.scope ?? "all",
          y: start.y,
          height: boxH,
        });
      }

      if (viewState.isAbsolute) {
        // Do not move flow cursor for absolute positioning
      } else {
        // Set cursor to after box (taking into account marginBottom)
        const finalY = start.y + boxH + margin.bottom;
        pdf.setCursor(start.x, finalY);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, style.showInAllPages, style.scope, w, h]);

  return null;
};
