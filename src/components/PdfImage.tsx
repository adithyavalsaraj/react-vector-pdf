import React from "react";
import { usePdf } from "./PdfProvider";

export interface PdfImageProps {
  src: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  mime?: "PNG" | "JPEG";
  flow?: boolean;
  align?: "left" | "center" | "right";
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
}

export const PdfImage: React.FC<PdfImageProps> = ({
  src,
  x,
  y,
  w,
  h,
  mime = "PNG",
  flow,
  align = "left",
  showInAllPages,
  scope,
}) => {
  const pdf = usePdf();

  React.useEffect(() => {
    // Determine if we are in absolute or flow mode
    const isFlow = flow === true || (x === undefined && y === undefined);

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
          w,
          h,
          mime,
          align,
        });
        return res;
      };

      const res = await draw();

      if (isFlow && res) {
        // Move cursor down
        pdf.moveCursor(0, res.height + 2); // default spacing
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
                w,
                h,
                mime,
                align,
              });
            });
          },
          scope: scope ?? "all",
          y: isFlow ? startPos.y : renderY ?? 0,
          height: res.height + 2,
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, src, x, y, w, h, mime, flow, align, showInAllPages, scope]);
  return null;
};
