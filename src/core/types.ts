export type PDFFormat = "a4" | "letter" | [number, number]; // mm
export type Align = "left" | "center" | "right" | "justify";

export interface PDFOptions {
  format?: PDFFormat;
  orientation?: "p" | "l";
  unit?: "mm" | "pt";
  margin?: { top: number; right: number; bottom: number; left: number };
  font?: {
    name?: string;
    style?: "normal" | "bold" | "italic" | "bolditalic";
    size?: number;
  };
  color?: string; // hex like '#111'
  lineHeight?: number; // multiplier, e.g., 1.2
}

export interface TextStyle {
  fontSize?: number;
  fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
  color?: string;
  align?: Align;
  verticalAlign?: "top" | "middle" | "bottom";
  lineHeight?: number;
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
}

export interface BoxStyle {
  borderColor?: string;
  borderWidth?: number;
  fillColor?: string;
  radius?: number;
  padding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  gap?: number;
}

export interface ViewStyle extends BoxStyle {
  margin?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  width?: number | string; // mm or '100%'
  height?: number; // mm
  showInAllPages?: boolean;
  scope?: "all" | "first-only" | "except-first" | number[];
}

export type PageNumberPreset =
  | "page-slash-total" // "Page {page}/{total}"
  | "slash" // "{page}/{total}"
  | "page-of-total"; // "Page {page} of {total}"

export interface PageNumberOptions {
  enabled?: boolean;
  position?: "header" | "footer";
  align?: "left" | "right" | "center";
  preset?: PageNumberPreset;
  template?: string;
  y?: number;
  offsetX?: number;
  style?: TextStyle;
  scope?: "all" | "first-only" | "except-first";
  format?: "arabic" | "roman-upper" | "roman-lower";
}

export interface CenterLabelOptions {
  enabled?: boolean;
  position?: "header" | "footer";
  text: string;
  scope?: "all" | "first-only" | "except-first" | number[];
  y?: number;
  offsetX?: number;
  style?: TextStyle;
}
