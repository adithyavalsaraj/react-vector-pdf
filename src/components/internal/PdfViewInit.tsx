import React from "react";
import { ViewStyle } from "../../core/types";
import { resolvePadding } from "../../core/utils";
import { usePdf } from "../PdfProvider";

export interface PdfViewInitProps {
  style: ViewStyle;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  viewState: {
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  };
}
// ...
// ...

// Move cursor inside for content (Padding)

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

export const PdfViewInit: React.FC<PdfViewInitProps> = ({
  style,
  x,
  y,
  w,
  h,
  viewState,
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

  React.useLayoutEffect(() => {
    pdf.queueOperation(() => {
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof w === "number" &&
        typeof h === "number"
      ) {
        viewState.isAbsolute = true;
        const page = pdf.getPageCount();
        viewState.start = { x, y, page };
        pdf.setCursor(x + pad.left, y + pad.top);
      } else {
        viewState.isAbsolute = false;
        // Add Margin Top
        if (margin.top > 0) {
          pdf.moveCursor(0, margin.top);
        }

        // Start Recording children rendering
        pdf.startRecording();

        const start = pdf.getCursor();
        const page = pdf.getPageCount();
        viewState.start = { ...start, page };

        // Move cursor inside for content (Padding)
        // We use pushIndent to ensure this indentation persists across page breaks (e.g. implicitly added pages)
        // @ts-ignore
        if (pdf.pushIndent) {
          // @ts-ignore
          pdf.pushIndent(pad.left, pad.right);

          // Also move Y for padding Top
          // Note: pushIndent moves X, but Y is handled by moveCursor
          if (pad.top > 0) pdf.moveCursor(0, pad.top);
        } else {
          // Fallback for older renderer versions (shouldn't happen with local code)
          pdf.setCursor(start.x + pad.left, start.y + pad.top);
        }

        // Reserve space for bottom padding so content breaks to next page before overlapping footer
        pdf.setReservedHeight(pad.bottom);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, x, y, w, h]);

  return null;
};
