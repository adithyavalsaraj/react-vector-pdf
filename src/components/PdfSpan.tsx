import React from "react";
import type { TextStyle } from "../core/types";

export interface PdfSpanProps extends TextStyle {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PdfSpan: React.FC<PdfSpanProps> = ({
  children,
  className,
  style,
  link,
  ...textStyle
}) => {
  const inlineStyle: React.CSSProperties = {
    ...style,
    fontSize: textStyle.fontSize ? `${textStyle.fontSize}pt` : undefined,
    color: textStyle.color ?? undefined,
    fontFamily: textStyle.fontName ?? undefined,
    fontWeight:
      textStyle.fontStyle === "bold" || textStyle.fontStyle === "bolditalic"
        ? "bold"
        : undefined,
    fontStyle:
      textStyle.fontStyle === "italic" || textStyle.fontStyle === "bolditalic"
        ? "italic"
        : undefined,
  };

  return (
    <span className={className} style={inlineStyle} data-link={link}>
      {children}
    </span>
  );
};

(PdfSpan as any).displayName = "PdfSpan";
