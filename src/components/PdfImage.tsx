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
      const res = await pdf.imageFromUrl(src, {
        x: renderX,
        y: renderY,
        w,
        h,
        mime,
        align,
      });

      if (isFlow && res) {
        // Move cursor down
        pdf.moveCursor(0, res.height + 2); // default spacing
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, src, x, y, w, h, mime, flow, align]);
  return null;
};
