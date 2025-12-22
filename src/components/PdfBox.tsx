import React from "react";
import type { BoxStyle } from "../core/types";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";

export interface PdfBoxProps extends BoxStyle {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children?: React.ReactNode;
}

export const PdfBox: React.FC<PdfBoxProps> = ({
  x,
  y,
  w,
  h,
  children,
  ...style
}) => {
  const pdf = usePdf();
  const basePad = resolvePadding(style.padding);
  const pad = {
    top: style.paddingTop ?? basePad.top,
    right: style.paddingRight ?? basePad.right,
    bottom: style.paddingBottom ?? basePad.bottom,
    left: style.paddingLeft ?? basePad.left,
  };

  // Mutable state to share between start-op and end-op
  const boxState = React.useRef<{ start?: { x: number; y: number } }>(
    {}
  ).current;

  // Absolute positioning mode
  if (
    typeof x === "number" &&
    typeof y === "number" &&
    typeof w === "number" &&
    typeof h === "number"
  ) {
    React.useEffect(() => {
      pdf.queueOperation(() => {
        pdf.box(x, y, w, h, style);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [x, y, w, h]);

    return <React.Fragment>{children}</React.Fragment>;
  }

  // Flow mode setup
  React.useEffect(() => {
    pdf.queueOperation(() => {
      const start = pdf.getCursor();
      boxState.start = { ...start };
      const innerX = start.x + pad.left;
      const innerY = start.y + pad.top;
      pdf.setCursor(innerX, innerY);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {children}
      <PdfBoxFinisher boxState={boxState} pad={pad} style={style} />
    </React.Fragment>
  );
};

const PdfBoxFinisher: React.FC<{
  boxState: { start?: { x: number; y: number } };
  style: any;
  pad: any;
}> = ({ boxState, style, pad }) => {
  const pdf = usePdf();
  React.useEffect(() => {
    pdf.queueOperation(() => {
      // Logic runs after children have finished (and queued their ops)
      // Check if start position was captured
      const start = boxState.start;
      if (!start) return;

      const after = pdf.getCursor();
      const contentHeight = Math.max(after.y - start.y - pad.top, 0);
      const boxH = contentHeight + pad.top + pad.bottom;

      // Draw the box
      pdf.box(start.x, start.y, pdf.contentAreaWidth, boxH, style);

      // Set cursor to after box
      pdf.setCursor(start.x, start.y + boxH);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
