import React from "react";
import type { ViewStyle } from "../core/types";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";

export interface PdfViewProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  debug?: boolean;
}

// Reuse logic for resolving margin similar to padding
function resolveMargin(
  m?: number | { top?: number; right?: number; bottom?: number; left?: number }
) {
  if (typeof m === "number") {
    return { top: m, right: m, bottom: m, left: m };
  }
  return {
    top: m?.top ?? 0,
    right: m?.right ?? 0,
    bottom: m?.bottom ?? 0,
    left: m?.left ?? 0,
  };
}

export const PdfView: React.FC<PdfViewProps> = ({ style = {}, children }) => {
  const pdf = usePdf();
  const basePad = resolvePadding(style.padding);
  const pad = {
    top: style.paddingTop ?? basePad.top,
    right: style.paddingRight ?? basePad.right,
    bottom: style.paddingBottom ?? basePad.bottom,
    left: style.paddingLeft ?? basePad.left,
  };

  const baseMargin = resolveMargin(style.margin);
  const margin = {
    top: style.marginTop ?? baseMargin.top,
    right: style.marginRight ?? baseMargin.right,
    bottom: style.marginBottom ?? baseMargin.bottom,
    left: style.marginLeft ?? baseMargin.left,
  };

  // Mutable state to share between start (setup) and end (draw)
  const viewState = React.useRef<{ start?: { x: number; y: number } }>(
    {}
  ).current;

  // 1. Setup Phase: Move cursor for margin, prepare start pos
  React.useEffect(() => {
    pdf.queueOperation(() => {
      // Add Margin Top
      if (margin.top > 0) {
        pdf.moveCursor(0, margin.top);
      }

      const start = pdf.getCursor();
      viewState.start = { ...start };

      // Move cursor inside for content (Padding)
      pdf.setCursor(start.x + pad.left, start.y + pad.top);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <React.Fragment>
      {children}
      <PdfViewFinisher
        viewState={viewState}
        style={style}
        pad={pad}
        margin={margin}
      />
    </React.Fragment>
  );
};

// 2. Finisher Phase: Draw box background/border and handle bottom margin
const PdfViewFinisher: React.FC<{
  viewState: { start?: { x: number; y: number } };
  style: ViewStyle;
  pad: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
}> = ({ viewState, style, pad, margin }) => {
  const pdf = usePdf();

  React.useEffect(() => {
    pdf.queueOperation(() => {
      const start = viewState.start;
      if (!start) return;

      const after = pdf.getCursor();
      // Calculate content height consumed by children
      // Note: children might have advanced Y.
      const contentHeight = Math.max(after.y - start.y - pad.top, 0);

      let boxH = contentHeight + pad.top + pad.bottom;

      // Fixed height override?
      if (style.height) {
        boxH = style.height;
      }

      // Draw the box (Border/Background)
      // Note: currently strictly mostly block-level width (full width)
      // If width is specified in style, use it.
      let boxW = pdf.contentAreaWidth;
      if (typeof style.width === "number") {
        boxW = style.width;
      }
      // If percentage strings are supported later, handle here.
      // For now, assume auto-width = full width (like div).

      // Draw the box shape
      // We pass the styles (borderColor, borderWidth, fillColor, radius)
      if (style.borderColor || style.fillColor || style.borderWidth) {
        pdf.box(start.x, start.y, boxW, boxH, style);
      }

      // Set cursor to after box (taking into account marginBottom)
      // Ensure we are below the box
      const finalY = start.y + boxH + margin.bottom;

      // X should reset to start X usually (block behavior)
      pdf.setCursor(start.x, finalY);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
