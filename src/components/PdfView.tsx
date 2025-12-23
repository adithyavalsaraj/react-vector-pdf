import React from "react";
import type { ViewStyle } from "../core/types";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";
import { PdfViewFinisher } from "./internal/PdfViewFinisher";

export interface PdfViewProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  debug?: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
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

export const PdfView: React.FC<PdfViewProps> = ({
  style = {},
  children,
  x,
  y,
  w,
  h,
}) => {
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
  const viewState = React.useRef<{
    start?: { x: number; y: number };
    isAbsolute?: boolean;
  }>({}).current;

  // 1. Setup Phase: Move cursor for margin, prepare start pos
  React.useEffect(() => {
    pdf.queueOperation(() => {
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof w === "number" &&
        typeof h === "number"
      ) {
        viewState.isAbsolute = true;
        viewState.start = { x, y };
        pdf.setCursor(x + pad.left, y + pad.top);
      } else {
        viewState.isAbsolute = false;
        // Add Margin Top
        if (margin.top > 0) {
          pdf.moveCursor(0, margin.top);
        }

        const start = pdf.getCursor();
        viewState.start = { ...start };

        // Move cursor inside for content (Padding)
        pdf.setCursor(start.x + pad.left, start.y + pad.top);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, x, y, w, h]); // Run on mount or when pos changes

  return (
    <React.Fragment>
      {children}
      <PdfViewFinisher
        viewState={viewState}
        style={style}
        pad={pad}
        margin={margin}
        w={w}
        h={h}
      />
    </React.Fragment>
  );
};
