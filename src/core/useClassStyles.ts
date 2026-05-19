import React, { useRef } from "react";
import { Align, BoxStyle, TextStyle, ViewStyle } from "./types";

const RESOLUTION_DPI = 96;
const MM_PER_INCH = 25.4;
const PX_TO_MM = MM_PER_INCH / RESOLUTION_DPI;
const PX_TO_PT = 72 / RESOLUTION_DPI;

const UNSUPPORTED_PROPERTIES = [
  "boxShadow",
  "textShadow",
  // "opacity", // Ignored silently
  "zIndex",
  // "display", // Ignored silently
  // "position", // Ignored silently
  "float",
  "overflow",
  "cursor",
  // "transition", // Ignored silently
  "transform",
  // "animation", // Ignored silently
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

function resolveServerStyle(styleProp?: React.CSSProperties): ResolvedStyle {
  if (!styleProp) return {};
  const res: ResolvedStyle = {};

  const toMm = (val: any): number | undefined => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return undefined;
      if (val.endsWith("px")) return parsed * PX_TO_MM;
      if (val.endsWith("mm")) return parsed;
      if (val.endsWith("pt")) return parsed * 0.3528;
      return parsed;
    }
    return undefined;
  };

  const toPt = (val: any): number | undefined => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return undefined;
      if (val.endsWith("px")) return parsed * PX_TO_PT;
      if (val.endsWith("mm")) return parsed / 0.3528;
      if (val.endsWith("pt")) return parsed;
      return parsed;
    }
    return undefined;
  };

  if (styleProp.fontFamily) {
    const cleanFont = styleProp.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
    if (cleanFont && cleanFont !== "sans-serif" && cleanFont !== "serif" && cleanFont !== "monospace") {
      res.fontName = cleanFont;
    }
  }

  if (styleProp.fontSize !== undefined) {
    const fs = toPt(styleProp.fontSize);
    if (fs) res.fontSize = fs;
  }

  const fw = styleProp.fontWeight;
  const fs = styleProp.fontStyle;
  if (fs === "italic") {
    if (fw === "bold" || fw === "700" || (typeof fw === "number" && fw >= 700)) {
      res.fontStyle = "bolditalic";
    } else {
      res.fontStyle = "italic";
    }
  } else if (fw === "bold" || fw === "700" || (typeof fw === "number" && fw >= 700)) {
    res.fontStyle = "bold";
  } else if (fs === "normal" || fs === "oblique") {
    res.fontStyle = "normal";
  }

  if (styleProp.color) res.color = styleProp.color;

  if (styleProp.textAlign) {
    const align = parseAlign(styleProp.textAlign);
    if (align) res.align = align;
  }

  if (styleProp.verticalAlign) {
    const va = parseVerticalAlign(styleProp.verticalAlign as string);
    if (va) res.verticalAlign = va;
  }

  if (styleProp.lineHeight !== undefined) {
    if (typeof styleProp.lineHeight === "number") {
      res.lineHeight = styleProp.lineHeight;
    } else if (typeof styleProp.lineHeight === "string") {
      const parsed = parseFloat(styleProp.lineHeight);
      if (!isNaN(parsed)) res.lineHeight = parsed;
    }
  }

  if (styleProp.backgroundColor) res.fillColor = styleProp.backgroundColor;
  if (styleProp.borderColor) res.borderColor = styleProp.borderColor;

  if (styleProp.borderWidth !== undefined) {
    const bw = toMm(styleProp.borderWidth);
    if (bw) res.borderWidth = bw;
  }

  const padTop = toMm(styleProp.paddingTop ?? styleProp.padding);
  const padRight = toMm(styleProp.paddingRight ?? styleProp.padding);
  const padBottom = toMm(styleProp.paddingBottom ?? styleProp.padding);
  const padLeft = toMm(styleProp.paddingLeft ?? styleProp.padding);
  if (padTop !== undefined || padRight !== undefined || padBottom !== undefined || padLeft !== undefined) {
    res.padding = {
      top: padTop ?? 0,
      right: padRight ?? 0,
      bottom: padBottom ?? 0,
      left: padLeft ?? 0,
    };
  }

  const margTop = toMm(styleProp.marginTop ?? styleProp.margin);
  const margRight = toMm(styleProp.marginRight ?? styleProp.margin);
  const margBottom = toMm(styleProp.marginBottom ?? styleProp.margin);
  const margLeft = toMm(styleProp.marginLeft ?? styleProp.margin);
  if (margTop !== undefined || margRight !== undefined || margBottom !== undefined || margLeft !== undefined) {
    res.margin = {
      top: margTop ?? 0,
      right: margRight ?? 0,
      bottom: margBottom ?? 0,
      left: margLeft ?? 0,
    };
  }

  if (styleProp.width !== undefined) {
    const wVal = toMm(styleProp.width);
    if (wVal) res.width = wVal;
  }
  if (styleProp.height !== undefined) {
    const hVal = toMm(styleProp.height);
    if (hVal) res.height = hVal;
  }

  if (styleProp.gap !== undefined) {
    const gp = toMm(styleProp.gap);
    if (gp) res.gap = gp;
  }

  if (styleProp.borderRadius !== undefined) {
    const rad = toMm(styleProp.borderRadius);
    if (rad) res.radius = rad;
  }

  return res;
}

export type ResolvedStyle = TextStyle & BoxStyle & ViewStyle;

const computedStyleCache = new Map<string, ResolvedStyle>();

export function useClassStyles(
  className?: string,
  style?: React.CSSProperties
) {
  const ref = useRef<HTMLDivElement>(null);

  // Return a getter that ensures we read after render
  const computeStyle = (): ResolvedStyle => {
    // If window is undefined (SSR / server environments), resolve styles inline immediately
    if (typeof window === "undefined") {
      return resolveServerStyle(style);
    }

    const hasInlineStyle = style && Object.keys(style).length > 0;
    if (className && !hasInlineStyle && computedStyleCache.has(className)) {
      return computedStyleCache.get(className)!;
    }

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
    const fontFamily = computed.fontFamily;
    if (fontFamily) {
      const cleanFont = fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      if (cleanFont && cleanFont !== "sans-serif" && cleanFont !== "serif" && cleanFont !== "monospace") {
        res.fontName = cleanFont;
      }
    }

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

    if (className && !hasInlineStyle) {
      computedStyleCache.set(className, res);
    }

    return res;
  };

  return { ref, computeStyle };
}
