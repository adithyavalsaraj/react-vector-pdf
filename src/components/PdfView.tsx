import React, { useRef } from "react";
import type { ViewStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { PdfViewFinisher } from "./internal/PdfViewFinisher";
import { PdfViewInit } from "./internal/PdfViewInit";
import { usePdf } from "./PdfProvider";

export interface PdfViewProps {
  style?: ViewStyle | React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  debug?: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
}

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
  showInAllPages,
  scope,
}) => {
  const { ref, computeStyle } = useClassStyles(
    className,
    styleProp as React.CSSProperties
  );

  const viewState = useRef<{
    start?: { x: number; y: number; page?: number };
    isAbsolute?: boolean;
  }>({}).current;

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
        style={style as ViewStyle}
        className={className}
        computeStyle={computeStyle}
        x={x}
        y={y}
        w={w}
        h={h}
        showInAllPages={showInAllPages}
        scope={scope}
        viewState={viewState}
      />
      {style.gap
        ? React.Children.map(children, (child, index) => (
            <React.Fragment>
              {index > 0 && <PdfSpacer height={(style as ViewStyle).gap} />}
              {child}
            </React.Fragment>
          ))
        : children}
      <PdfViewFinisher
        viewState={viewState}
        style={style as ViewStyle}
        className={className}
        computeStyle={computeStyle}
        x={x}
        y={y}
        w={w}
        h={h}
        showInAllPages={showInAllPages}
        scope={scope}
      />
    </React.Fragment>
  );
};

const PdfSpacer: React.FC<{ height?: number }> = ({ height }) => {
  const pdf = usePdf();
  const queuedRef = React.useRef<{ pdf: any; gen: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!height) return;
    // Prevent double-queuing for same document generation
    if (
      queuedRef.current?.pdf === pdf &&
      queuedRef.current?.gen === pdf.generation
    )
      return;
    queuedRef.current = { pdf, gen: pdf.generation };

    pdf.queueOperation(() => {
      pdf.moveCursor(0, height);
    });
  }, [height, pdf]);

  return null;
};
