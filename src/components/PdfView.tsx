import React, {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ViewStyle } from "../core/types";
import { useClassStyles } from "../core/useClassStyles";
import { resolvePadding } from "../core/utils";
import { usePdf } from "./PdfProvider";
import {
  PdfItemContext,
  PdfOperation,
  usePdfItemContext,
} from "./internal/PdfItemContext";

export interface PdfViewProps {
  style?: ViewStyle | React.CSSProperties;
  children?: React.ReactNode;
  debug?: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  className?: string;
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
}) => {
  const pdf = usePdf();
  const parentContext = usePdfItemContext();
  const id = useId();

  const { ref, computeStyle } = useClassStyles(
    className,
    styleProp as React.CSSProperties
  );

  const [mergedStyle, setMergedStyle] = useState<ViewStyle>(style as ViewStyle);

  useLayoutEffect(() => {
    const computed = computeStyle();
    let newStyle = { ...computed, ...style } as ViewStyle;

    // Smart Defaults:
    // If BG or Border is present, but NO padding is specified in 'style' prop AND no className is used, default to 4mm.
    const hasBg = !!newStyle.fillColor;
    const hasBorder = !!newStyle.borderColor || (newStyle.borderWidth ?? 0) > 0;

    const styleHasPadding =
      (style.padding !== undefined && style.padding !== null) ||
      (style.paddingTop !== undefined && style.paddingTop !== null) ||
      (style.paddingRight !== undefined && style.paddingRight !== null) ||
      (style.paddingBottom !== undefined && style.paddingBottom !== null) ||
      (style.paddingLeft !== undefined && style.paddingLeft !== null);

    // If using utility classes, we assume user handles padding there.
    // If not using classes, and no explicit padding in style, apply default.
    if ((hasBg || hasBorder) && !styleHasPadding && !className) {
      newStyle = { ...newStyle, padding: 4 };
    }

    if (JSON.stringify(newStyle) !== JSON.stringify(mergedStyle)) {
      setMergedStyle(newStyle);
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const childOps = useRef<Map<string, PdfOperation>>(new Map());
  const [childVer, setChildVer] = useState(0);

  const registerOperation = useCallback((cid: string, op: PdfOperation) => {
    childOps.current.set(cid, op);
    setChildVer((v) => v + 1);
  }, []);

  const unregisterOperation = useCallback((cid: string) => {
    if (childOps.current.delete(cid)) {
      setChildVer((v) => v + 1);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ registerOperation, unregisterOperation }),
    [registerOperation, unregisterOperation]
  );

  const isMounted = useRef(true);

  useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    let aborted = false;

    const runView = async () => {
      // Abort check at start of execution
      if (aborted) return;

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

      const viewState: any = {};

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
        if (margin.top > 0) pdf.moveCursor(0, margin.top);

        if (typeof mergedStyle.height === "number" && mergedStyle.height > 0) {
          pdf.moveCursor(0, mergedStyle.height);
        }

        if ((pdf as any).startRecording) (pdf as any).startRecording();

        const start = pdf.getCursor();
        const page = pdf.getPageCount();
        viewState.start = { ...start, page };

        // @ts-ignore
        if (pdf.pushIndent) {
          // @ts-ignore
          pdf.pushIndent(pad.left, pad.right);
          if (pad.top > 0) pdf.moveCursor(0, pad.top);
        } else {
          pdf.setCursor(start.x + pad.left, start.y + pad.top);
        }

        pdf.setReservedHeight(pad.bottom);
      }

      // EXECUTE CHILDREN
      for (const op of childOps.current.values()) {
        await op();
      }

      // FINISH
      let ops: any[] = [];
      if ((pdf as any).stopRecording) ops = (pdf as any).stopRecording();

      pdf.setReservedHeight(0);
      // @ts-ignore
      if (pdf.popIndent) pdf.popIndent();

      const after = pdf.getCursor();
      const start = viewState.start;

      let boxW = w ?? pdf.contentAreaWidth;
      if (typeof mergedStyle.width === "number") boxW = mergedStyle.width;

      // Draw H logic
      const drawH = mergedStyle.height
        ? mergedStyle.height
        : after.y - start.y + pad.bottom;

      // Inject Fill (BG)
      if (mergedStyle.fillColor && (pdf as any).injectFill) {
        (pdf as any).injectFill(
          start.page,
          {
            x: viewState.isAbsolute ? x! : start.x,
            y: viewState.isAbsolute ? y! : start.y,
            w: boxW,
            h: drawH,
          },
          mergedStyle.fillColor,
          mergedStyle.radius // Pass Radius
        );
      }

      // Playback Content
      if ((pdf as any).playback) (pdf as any).playback(ops);

      // Draw Border (FG)
      // Only draw if borderWidth is NOT explicitly 0, and we have a width or color.
      if (
        mergedStyle.borderWidth !== 0 &&
        (mergedStyle.borderWidth || mergedStyle.borderColor)
      ) {
        pdf.box(
          viewState.isAbsolute ? x! : start.x,
          viewState.isAbsolute ? y! : start.y,
          boxW,
          drawH,
          {
            ...mergedStyle,
            fillColor: undefined,
          }
        );
      }

      if (!viewState.isAbsolute) {
        const finalY = after.y + pad.bottom + margin.bottom;
        pdf.setCursor(start.x, finalY);
      }
    };

    const task = async () => {
      // Abort check right before execution in queue
      if (aborted) return;
      await runView();
    };

    if (parentContext) {
      parentContext.registerOperation(id, task);
      return () => parentContext.unregisterOperation(id);
    } else {
      pdf.queueOperation(task);
      // Cleanup for root: mark as aborted
      return () => {
        aborted = true;
      };
    }
  }, [pdf, parentContext, id, mergedStyle, x, y, w, h, childVer]);

  return (
    <PdfItemContext.Provider value={contextValue}>
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
      {mergedStyle.gap
        ? React.Children.map(children, (child, index) => (
            <React.Fragment>
              {index > 0 && <PdfSpacer height={mergedStyle.gap} />}
              {child}
            </React.Fragment>
          ))
        : children}
    </PdfItemContext.Provider>
  );
};

const PdfSpacer: React.FC<{ height?: number }> = ({ height }) => {
  const context = usePdfItemContext();
  const pdf = usePdf();
  const id = useId();

  useLayoutEffect(() => {
    if (!height) return;
    const op = () => {
      pdf.moveCursor(0, height);
    };
    if (context) {
      context.registerOperation(id, op);
      return () => context.unregisterOperation(id);
    } else {
      pdf.queueOperation(op);
    }
  }, [height, pdf, context, id]);

  return null;
};
