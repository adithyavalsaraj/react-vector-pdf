import React from "react";
import { useClassStyles } from "../core/useClassStyles";
import { usePdf } from "./PdfProvider";

export interface PdfImageProps {
  src: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  mime?: "PNG" | "JPEG";
  flow?: boolean;
  layout?: "fixed" | "flow";
  sizing?: "fit" | "fill" | "auto";
  align?: "left" | "center" | "right";
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
}

export interface PdfImageProps {
  src: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  mime?: "PNG" | "JPEG";
  flow?: boolean;
  layout?: "fixed" | "flow";
  sizing?: "fit" | "fill" | "auto";
  align?: "left" | "center" | "right";
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
  className?: string;
  style?: React.CSSProperties;
}

export const PdfImage: React.FC<PdfImageProps> = ({
  src,
  x,
  y,
  w: propW,
  h: propH,
  mime = "PNG",
  flow,
  layout,
  sizing,
  align = "left",
  showInAllPages,
  scope,
  className,
  style,
}) => {
  const pdf = usePdf();
  const { ref, computeStyle } = useClassStyles(className, style);

  React.useLayoutEffect(() => {
    const computed = computeStyle();

    // Merge props: Props take precedence over computed styles
    // Note: computed.width is in mm (if parsed correctly from px)
    const effectiveW =
      propW ??
      (typeof computed.width === "number" ? computed.width : undefined);
    const effectiveH =
      propH ??
      (typeof computed.height === "number" ? computed.height : undefined);

    // Margins logic: Default to 2mm if no margin
    const m = computed.margin;
    const marginBottom = (typeof m === "number" ? m : m?.bottom) ?? 2;

    // Determine if we are in absolute or flow mode
    const isFlow =
      layout === "flow" ||
      flow === true ||
      (x === undefined && y === undefined && layout !== "fixed");

    // Sizing logic
    let renderW = effectiveW;
    if (sizing === "fill") {
      renderW = pdf.contentAreaWidth;
    } else if (sizing === "fit" && !effectiveW) {
    }

    // Pass undefined coordinates to renderer if they are missing
    // Renderer will handle alignment fallback if x is missing
    // Renderer will handle cursorY fallback if y is missing
    const renderX = x;
    const renderY = y;

    pdf.queueOperation(async () => {
      const startPos = pdf.getCursor();
      const draw = async (reuseX?: number, reuseY?: number) => {
        const drawX = reuseX ?? renderX;
        const drawY = reuseY ?? renderY;

        const res = await pdf.imageFromUrl(src, {
          x: drawX,
          y: drawY,
          w: renderW,
          h: effectiveH,
          mime,
          align,
        });
        return res;
      };

      const res = await draw();

      if (isFlow && res) {
        // Move cursor down
        pdf.moveCursor(0, res.height + marginBottom);
      }

      if (showInAllPages && res) {
        pdf.registerRecurringItem({
          draw: () => {
            // Re-render image at same position
            // Since it's async in the renderer, we just queue it
            pdf.queueOperation(async () => {
              if (isFlow) {
                // In flow mode, we need to set the cursor before drawing
                pdf.setCursor(startPos.x, startPos.y);
              }
              await pdf.imageFromUrl(src, {
                x: renderX,
                y: isFlow ? startPos.y : renderY,
                w: renderW,
                h: effectiveH,
                mime,
                align,
              });
            });
          },
          scope: scope ?? "all",
          y: isFlow ? startPos.y : renderY ?? 0,
          height: res.height + marginBottom,
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pdf,
    src,
    x,
    y,
    propW,
    propH,
    mime,
    flow,
    layout,
    sizing,
    align,
    showInAllPages,
    scope,
    className,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};
