import React, { useId } from "react";
import type { TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";
import { usePdfItemContext } from "./internal/PdfItemContext";

export interface PdfListProps {
  items: string[];
  ordered?: boolean;
  style?: TextStyle;
  indent?: number; // mm
  markerWidth?: number; // mm
  spacing?: number; // mm between items
  className?: string;
}

export const PdfList: React.FC<PdfListProps> = ({
  items,
  ordered = false,
  style,
  indent = 5,
  markerWidth = 5,
  spacing = 2,
  className,
}) => {
  const pdf = usePdf();
  const context = usePdfItemContext();
  const id = useId();
  const { ref, computeStyle } = useClassStyles(className);
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

    // Merge Computed Text Style with Prop Style
    const mergedStyle: TextStyle = {
      ...computed,
      ...style,
    };

    const task = async () => {
      // Handle Container Margin (e.g. mt-4)
      const mt =
        typeof computed.margin === "number"
          ? computed.margin
          : computed.margin?.top;
      if (mt) {
        pdf.moveCursor(0, mt);
      }

      items.forEach((item, idx) => {
        const marker = ordered ? `${idx + 1}.` : "•";
        const fontSize = mergedStyle.fontSize ?? pdf.baseFont.size;

        // Check if we have space for at least one line of text
        const lineHeight = fontSize * 1.2 * 0.3528; // mm approx
        const currentY = pdf.getCursor().y;

        if (currentY + lineHeight > pdf.contentBottom) {
          pdf.addPage();
        }

        const startY = pdf.getCursor().y;
        const startX = pdf.getCursor().x;
        const contentX = startX + indent + markerWidth;

        // Calculate baseline offset to align with paragraph text
        const textY = startY + fontSize * 0.3528;

        // Draw marker
        pdf.textRaw(
          marker,
          startX + indent,
          textY,
          mergedStyle,
          markerWidth,
          "right"
        );

        // Draw content
        pdf.setCursor(contentX, startY);

        // Calculate width available
        const maxWidth = pdf.contentRight - contentX;

        pdf.paragraph(item, mergedStyle, maxWidth);

        // Reset X, keep Y (paragraph moved it)
        const endY = pdf.getCursor().y;
        pdf.setCursor(startX, endY + spacing);
      });

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
  }, [
    pdf,
    context,
    id,
    items,
    ordered,
    style,
    indent,
    markerWidth,
    spacing,
    className,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};
