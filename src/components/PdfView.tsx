import React from "react";
import type { ViewStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";
import { PdfViewFinisher } from "./internal/PdfViewFinisher";
import { PdfViewInit } from "./internal/PdfViewInit";

export interface PdfViewProps {
  style?: ViewStyle | React.CSSProperties; // Allow both
  children?: React.ReactNode;
  debug?: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  className?: string;
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
  className,
  style: styleProp,
  children,
  x,
  y,
  w,
  h,
}) => {
  const pdf = usePdf();

  // useClassStyles computes the style from className and styleProp.
  const { ref, computeStyle } = useClassStyles(
    className,
    styleProp as React.CSSProperties
  );

  // Maintain merged style state to handle re-renders when styles are computed
  const [mergedStyle, setMergedStyle] = React.useState<ViewStyle>(
    style as ViewStyle
  );

  React.useLayoutEffect(() => {
    const computed = computeStyle();

    // Merge: style prop > computed class > defaults
    const newStyle = { ...computed, ...style } as ViewStyle;

    // Update state if style has changed (avoid loops)
    if (JSON.stringify(newStyle) !== JSON.stringify(mergedStyle)) {
      setMergedStyle(newStyle);
    }
  });

  // Need to handle padding/margin resolution for helper variables
  const basePad = resolvePadding(mergedStyle.padding);
  const pad = {
    top: mergedStyle.paddingTop ?? basePad.top,
    right: mergedStyle.paddingRight ?? basePad.right,
    bottom: mergedStyle.paddingBottom ?? basePad.bottom,
    left: mergedStyle.paddingLeft ?? basePad.left,
  };

  const baseMargin = resolveMargin(mergedStyle.margin);
  const margin = {
    top: mergedStyle.marginTop ?? baseMargin.top,
    right: mergedStyle.marginRight ?? baseMargin.right,
    bottom: mergedStyle.marginBottom ?? baseMargin.bottom,
    left: mergedStyle.marginLeft ?? baseMargin.left,
  };

  const viewState = React.useRef<{
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
    radius?: number;
  }>({}).current;

  viewState.radius = mergedStyle.radius;

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={className}
        style={{
          ...(styleProp as React.CSSProperties),
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />

      <PdfViewInit
        style={mergedStyle}
        x={x}
        y={y}
        w={w}
        h={h}
        viewState={viewState}
      />
      {mergedStyle.gap
        ? React.Children.map(children, (child, index) => {
            if (!child) return null;
            return (
              <React.Fragment>
                {index > 0 && (
                  <PdfViewInit
                    style={{ height: mergedStyle.gap }}
                    viewState={{}}
                  />
                )}
                {child}
              </React.Fragment>
            );
          })
        : children}
      <PdfViewFinisher
        viewState={viewState}
        style={mergedStyle}
        pad={pad}
        margin={margin}
        w={w}
        h={h}
      />
    </React.Fragment>
  );
};
