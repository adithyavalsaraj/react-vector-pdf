import React from "react";
import type { TextStyle } from "../core/types";
import { usePdf } from "./PdfProvider";

export interface PdfListProps {
  items: string[];
  ordered?: boolean;
  style?: TextStyle;
  indent?: number; // mm
  markerWidth?: number; // mm
  spacing?: number; // mm between items
}

export const PdfList: React.FC<PdfListProps> = ({
  items,
  ordered = false,
  style,
  indent = 5,
  markerWidth = 5,
  spacing = 2,
}) => {
  const pdf = usePdf();

  React.useEffect(() => {
    pdf.queueOperation(() => {
      items.forEach((item, idx) => {
        // Check space logic implicitly handled by paragraph() mostly,
        // but drawing marker needs care if page break happens inside paragraph?
        // Actually, if we just draw marker at current Y, and paragraph moves to next page?
        // Risky. Ideally we should check space for at least one line.

        const marker = ordered ? `${idx + 1}.` : "•";

        const startY = pdf.getCursor().y;
        const startX = pdf.getCursor().x;
        const contentX = startX + indent + markerWidth;

        // Calculate baseline offset to align with paragraph text
        // Paragraph logic: textY = cursorY + fontSize * 0.3528
        const fontSize = style?.fontSize ?? pdf.baseFont.size;
        const textY = startY + fontSize * 0.3528;

        // Draw marker
        pdf.textRaw(
          marker,
          startX + indent,
          textY,
          style,
          markerWidth,
          "right"
        );

        // Draw content
        // We temporarily move cursor to content start
        pdf.setCursor(contentX, startY);

        // Calculate width available
        const maxWidth = pdf.contentRight - contentX;

        pdf.paragraph(item, style, maxWidth);

        // Reset X, keep Y (paragraph moved it)
        const endY = pdf.getCursor().y;
        pdf.setCursor(startX, endY + spacing);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, ordered, style, indent, markerWidth, spacing]);

  return null;
};
