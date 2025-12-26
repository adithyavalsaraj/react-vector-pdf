import React from "react";
import type { TextStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";

export interface PdfListProps {
  items: string[];
  ordered?: boolean;
  style?: TextStyle;
  indent?: number; // mm
  markerWidth?: number; // mm
  spacing?: number; // mm between items
}

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
  const { ref, computeStyle } = useClassStyles(className);

  React.useLayoutEffect(() => {
    const computed = computeStyle();

    // Merge Computed Text Style with Prop Style
    const mergedStyle: TextStyle = {
      ...computed,
      ...style,
    };

    // Handle Container Margin (e.g. mt-4)
    const mt =
      typeof computed.margin === "number"
        ? computed.margin
        : computed.margin?.top;
    if (mt) {
      pdf.moveCursor(0, mt);
    }

    pdf.queueOperation(() => {
      items.forEach((item, idx) => {
        const marker = ordered ? `${idx + 1}.` : "•";
        const fontSize = mergedStyle.fontSize ?? pdf.baseFont.size;

        // Check if we have space for at least one line of text
        // This prevents the marker from being drawn on the current page
        // while the text is pushed to the next page.
        // We use a safe approximation of line height.
        const lineHeight = fontSize * 1.2 * 0.3528; // mm approx
        const currentY = pdf.getCursor().y;

        if (currentY + lineHeight > pdf.contentBottom) {
          pdf.addPage();
        }

        const startY = pdf.getCursor().y;
        const startX = pdf.getCursor().x;
        const contentX = startX + indent + markerWidth;

        // Calculate baseline offset to align with paragraph text
        // Paragraph logic: textY = cursorY + fontSize * 0.3528
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
        // We temporarily move cursor to content start
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, items, ordered, style, indent, markerWidth, spacing, className]);

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
