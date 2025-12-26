import React from "react";
import type { TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";

export interface PdfTextProps extends TextStyle {
  children: string;
  x?: number;
  y?: number;
  maxWidth?: number;
  spacingBelow?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PdfText: React.FC<PdfTextProps> = ({
  children,
  x,
  y,
  maxWidth,
  spacingBelow = 2,
  className,
  style: styleProp,
  ...textStyle
}) => {
  const pdf = usePdf();
  const { ref, computeStyle } = useClassStyles(className, styleProp);

  React.useLayoutEffect(() => {
    // Extract styles synchronously after render
    const resolved = computeStyle();

    // Merge Strategy: Explicit Props > CSS Class > Defaults
    const finalStyle = {
      ...resolved,
      ...textStyle,
    } as TextStyle;

    pdf.queueOperation(() => {
      const startPos = pdf.getCursor();
      let h = 0;
      const draw = () => {
        if (typeof x === "number" && typeof y === "number") {
          pdf.textRaw(children, x, y, finalStyle, maxWidth, finalStyle.align);
        } else {
          pdf.setCursor(startPos.x, startPos.y);
          h = pdf.paragraph(children, finalStyle, maxWidth);
          const cur = pdf.getCursor();
          pdf.setCursor(cur.x, cur.y + spacingBelow);
        }
      };

      draw();

      if (finalStyle.showInAllPages) {
        pdf.registerRecurringItem({
          draw,
          scope: finalStyle.scope ?? "all",
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
    className,
    textStyle.fontSize,
    textStyle.color,
    textStyle.align,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...styleProp,
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};
