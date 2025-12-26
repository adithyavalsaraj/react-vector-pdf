import React, { useRef } from "react";
import { Align, BoxStyle, TextStyle, ViewStyle } from "./types";

const RESOLUTION_DPI = 96;
const MM_PER_INCH = 25.4;
const PX_TO_MM = MM_PER_INCH / RESOLUTION_DPI;
const PX_TO_PT = 72 / RESOLUTION_DPI;

const UNSUPPORTED_PROPERTIES = [
  "boxShadow",
  "textShadow",
  "opacity",
  "zIndex",
  "display",
  "position",
  "float",
  "overflow",
  "cursor",
  "transition",
  "transform",
  "animation",
];

const DISPLAY_BLOCK = "block";
const DISPLAY_INLINE = "inline";

function pxToMm(px: string | null): number | undefined {
  if (!px || !px.endsWith("px")) return undefined;
  const val = parseFloat(px);
  return isNaN(val) ? undefined : val * PX_TO_MM;
}

function pxToPt(px: string | null): number | undefined {
  if (!px || !px.endsWith("px")) return undefined;
  const val = parseFloat(px);
  return isNaN(val) ? undefined : val * PX_TO_PT;
}

function parseColor(color: string): string | undefined {
  if (!color || color === "rgba(0, 0, 0, 0)" || color === "transparent")
    return undefined;
  return color;
}

function parseAlign(textAlign: string): Align | undefined {
  if (
    textAlign === "left" ||
    textAlign === "center" ||
    textAlign === "right" ||
    textAlign === "justify"
  ) {
    return textAlign;
  }
  return undefined;
}

function parseVerticalAlign(
  verticalAlign: string
): "top" | "middle" | "bottom" | undefined {
  if (verticalAlign === "top") return "top";
  if (verticalAlign === "middle") return "middle";
  if (verticalAlign === "bottom") return "bottom";
  return undefined;
}

function parsePadding(style: CSSStyleDeclaration) {
  const top = pxToMm(style.paddingTop);
  const right = pxToMm(style.paddingRight);
  const bottom = pxToMm(style.paddingBottom);
  const left = pxToMm(style.paddingLeft);
  if (
    top === undefined &&
    right === undefined &&
    bottom === undefined &&
    left === undefined
  )
    return undefined;
  return {
    top: top ?? 0,
    right: right ?? 0,
    bottom: bottom ?? 0,
    left: left ?? 0,
  };
}

function parseMargin(style: CSSStyleDeclaration) {
  const top = pxToMm(style.marginTop);
  const right = pxToMm(style.marginRight);
  const bottom = pxToMm(style.marginBottom);
  const left = pxToMm(style.marginLeft);
  if (
    top === undefined &&
    right === undefined &&
    bottom === undefined &&
    left === undefined
  )
    return undefined;
  return {
    top: top ?? 0,
    right: right ?? 0,
    bottom: bottom ?? 0,
    left: left ?? 0,
  };
}

export type ResolvedStyle = TextStyle & BoxStyle & ViewStyle;

export function useClassStyles(
  className?: string,
  style?: React.CSSProperties
) {
  const ref = useRef<HTMLDivElement>(null);

  // Return a getter that ensures we read after render
  const computeStyle = (): ResolvedStyle => {
    if (!ref.current) return {};
    const computed = window.getComputedStyle(ref.current);

    // Validation
    UNSUPPORTED_PROPERTIES.forEach((prop) => {
      const val = computed[prop as any];
      if (
        val &&
        val !== "none" &&
        val !== "auto" &&
        val !== "0px" &&
        val !== "normal" &&
        val !== "visible" &&
        val !== "static"
      ) {
        if (
          prop === "display" &&
          (val === DISPLAY_BLOCK || val === DISPLAY_INLINE)
        )
          return;
        console.warn(
          `react-vector-pdf: CSS property '${prop}' with value '${val}' is not supported and will be ignored.`
        );
      }
    });

    const res: ResolvedStyle = {};

    // Text Style
    const fontSize = pxToPt(computed.fontSize);
    if (fontSize) res.fontSize = fontSize;

    // FontWeight / FontStyle integration
    const fontWeight = computed.fontWeight;
    const fontStyle = computed.fontStyle;

    if (fontStyle === "italic") {
      if (
        fontWeight === "bold" ||
        fontWeight === "700" ||
        parseInt(fontWeight) >= 700
      ) {
        res.fontStyle = "bolditalic";
      } else {
        res.fontStyle = "italic";
      }
    } else if (
      fontWeight === "bold" ||
      fontWeight === "700" ||
      parseInt(fontWeight) >= 700
    ) {
      res.fontStyle = "bold";
    } else {
      res.fontStyle = "normal";
    }

    const color = parseColor(computed.color);
    if (color) res.color = color;

    const align = parseAlign(computed.textAlign);
    if (align) res.align = align;

    // Logic for line height conversion from multiplier or px
    const lhFn = () => {
      if (computed.lineHeight === "normal") return undefined;
      const lhPx = parseFloat(computed.lineHeight);
      const fsPx = parseFloat(computed.fontSize);
      if (!isNaN(lhPx) && !isNaN(fsPx) && fsPx > 0) {
        return lhPx / fsPx;
      }
      return undefined;
    };
    const lh = lhFn();
    if (lh) res.lineHeight = lh;

    // Box / View Style
    const bg = parseColor(computed.backgroundColor);
    if (bg) res.fillColor = bg;

    const bc = parseColor(computed.borderColor);
    if (bc) res.borderColor = bc;

    // BorderWidth: uniform border support
    const bw = pxToMm(computed.borderTopWidth);
    if (bw) res.borderWidth = bw;

    const pad = parsePadding(computed);
    if (pad) res.padding = pad;

    const marg = parseMargin(computed);
    if (marg) res.margin = marg;

    // Dimensions
    // Map explicit pixel widths to mm.
    // 'auto' is ignored to allow PDF flow logic to take precedence.
    if (computed.width && computed.width !== "auto") {
      const wMm = pxToMm(computed.width);
      if (wMm && wMm > 0) res.width = wMm;
    }
    if (computed.height && computed.height !== "auto") {
      const hMm = pxToMm(computed.height);
      if (hMm && hMm > 0) res.height = hMm;
    }

    // Gap
    const gap = pxToMm(computed.gap) ?? pxToMm(computed.rowGap);
    if (gap) res.gap = gap;

    // Radius
    const rad = pxToMm(computed.borderRadius);
    if (rad) res.radius = rad;

    return res;
  };

  return { ref, computeStyle };
}
