import React from "react";
import type { TextStyle } from "../core/types";
import { usePdf } from "./PdfProvider";

export interface PdfTextProps extends TextStyle {
  children: string;
  x?: number;
  y?: number;
  maxWidth?: number;
  spacingBelow?: number;
}

export const PdfText: React.FC<PdfTextProps> = ({
  children,
  x,
  y,
  maxWidth,
  spacingBelow = 2,
  ...style
}) => {
  const pdf = usePdf();

  React.useLayoutEffect(() => {
    pdf.queueOperation(() => {
      const startPos = pdf.getCursor();
      let h = 0;
      const draw = () => {
        if (typeof x === "number" && typeof y === "number") {
          pdf.textRaw(children, x, y, style, maxWidth, style.align);
        } else {
          pdf.setCursor(startPos.x, startPos.y);
          h = pdf.paragraph(children, style, maxWidth);
          const cur = pdf.getCursor();
          pdf.setCursor(cur.x, cur.y + spacingBelow);
        }
      };

      draw();

      if (style.showInAllPages) {
        pdf.registerRecurringItem({
          draw,
          scope: style.scope ?? "all",
          y: startPos.y,
          height: h + spacingBelow,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pdf,
    children,
    x,
    y,
    maxWidth,
    spacingBelow,
    style.fontSize,
    style.align,
  ]); // Add dependencies as needed

  return null;
};
