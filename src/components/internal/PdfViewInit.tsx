import React from "react";
import { ViewStyle } from "../../core/types";
import { resolvePadding } from "../../core/utils";
import { usePdf } from "../PdfProvider";

export interface PdfViewInitProps {
  style: ViewStyle;
  className?: string;
  computeStyle: () => any;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  showInAllPages?: boolean;
  scope?: any;
  viewState: {
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  };
}

// Indent cursor for padding to ensure content respects the padded area.

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
  style: styleProp,
  className,
  computeStyle,
  x,
  y,
  w,
  h,
  showInAllPages,
  scope,
  viewState,
}) => {
  const pdf = usePdf();
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    // Only queue once per renderer instance/generation to prevent double-indents
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    pdf.queueOperation(() => {
      // Resolve styles inside the queue when DOM is ready
      const computed = computeStyle();
      let style = { ...computed, ...styleProp } as ViewStyle;

      // Apply smart defaults similar to PdfView logic.
      const hasBg = !!style.fillColor;
      const hasBorder = !!style.borderColor || (style.borderWidth ?? 0) > 0;
      const styleHasPadding =
        styleProp.padding !== undefined ||
        styleProp.paddingTop !== undefined ||
        styleProp.paddingRight !== undefined ||
        styleProp.paddingBottom !== undefined ||
        styleProp.paddingLeft !== undefined;

      if ((hasBg || hasBorder) && !styleHasPadding && !className) {
        style.padding = 4;
      }

      // Merge props
      if (showInAllPages !== undefined) style.showInAllPages = showInAllPages;
      if (scope !== undefined) style.scope = scope;

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

        // Support explicit height (e.g. for gaps/spacers)
        if (typeof style.height === "number" && style.height > 0) {
          pdf.moveCursor(0, style.height);
        }

        // Note: Recording is disabled here to avoid issues with React Effect ordering.
        // pdf.startRecording(); // DISABLED due to React Effect ordering issues causing content to be excluded

        const start = pdf.getCursor();
        const page = pdf.getPageCount();
        viewState.start = { ...start, page };

        // Use pushIndent to persist indentation across page breaks.
        // @ts-ignore
        if (pdf.pushIndent) {
          // Apply Indentation
          if (pad.left > 0 || pad.right > 0) {
            // @ts-ignore
            pdf.pushIndent(pad.left, pad.right);
            (viewState as any).hasIndent = true;
          }

          // Also move Y for padding Top
          // Note: pushIndent moves X. pushVerticalPadding moves Y and manages stack.
          // @ts-ignore
          if (pdf.pushVerticalPadding) {
            // @ts-ignore
            pdf.pushVerticalPadding(pad.top, pad.bottom);
            // We do NOT call moveCursor(0, pad.top) because pushVerticalPadding does it.
          } else {
            // Fallback
            if (pad.top > 0) pdf.moveCursor(0, pad.top);
            pdf.setReservedHeight(pad.bottom);
          }
        } else {
          // Fallback for environments traversing legacy renderer versions.
          pdf.setCursor(start.x + pad.left, start.y + pad.top);
          pdf.setReservedHeight(pad.bottom);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, styleProp, x, y, w, h, showInAllPages, scope]);

  return null;
};
