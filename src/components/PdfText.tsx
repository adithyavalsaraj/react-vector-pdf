import React, { useId } from "react";
import type { TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";
import { usePdfItemContext } from "./internal/PdfItemContext";

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
  const context = usePdfItemContext();
  const id = useId();
  const { ref, computeStyle } = useClassStyles(className, styleProp);
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    // Prevent double-queuing for the same document generation
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    const resolved = computeStyle();

    const finalStyle = {
      ...resolved,
      ...textStyle,
    } as TextStyle;

    const task = async () => {
      const startPos = pdf.getCursor();
      let h = 0;
      const draw = () => {
        if (typeof x === "number" && typeof y === "number") {
          pdf.textRaw(children, x, y, finalStyle, maxWidth, finalStyle.align);
        } else {
          pdf.setCursor(startPos.x, startPos.y);
          h = pdf.paragraph(children, finalStyle, maxWidth);
          const cur = pdf.getCursor();

          if (spacingBelow > 0) {
            pdf.setCursor(cur.x, cur.y + spacingBelow);
          }
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
    };

    if (context) {
      context.registerOperation(id, task);
      return () => context.unregisterOperation(id);
    } else {
      pdf.queueOperation(task);
    }
  }, [
    pdf,
    context, // Add context dependency
    id,
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
