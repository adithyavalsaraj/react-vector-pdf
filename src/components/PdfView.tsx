import React from "react";
import type { ViewStyle } from "../core/types";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";
import { PdfViewFinisher } from "./internal/PdfViewFinisher";
import { PdfViewInit } from "./internal/PdfViewInit";

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

  const viewState = React.useRef<{
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
    radius?: number;
  }>({}).current;

  viewState.radius = style.radius;

  return (
    <React.Fragment>
      <PdfViewInit
        style={style}
        x={x}
        y={y}
        w={w}
        h={h}
        viewState={viewState}
      />
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
