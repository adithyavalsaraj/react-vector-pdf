export type PDFFormat = 'a4' | 'letter' | [number, number];
export type Align = 'left' | 'center' | 'right' | 'justify';
export interface PDFOptions {
    format?: PDFFormat;
    orientation?: 'p' | 'l';
    unit?: 'mm' | 'pt';
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    font?: {
        name?: string;
        style?: 'normal' | 'bold' | 'italic' | 'bolditalic';
        size?: number;
    };
    color?: string;
    lineHeight?: number;
}
export interface TextStyle {
    fontSize?: number;
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    color?: string;
    align?: Align;
    lineHeight?: number;
}
export interface BoxStyle {
    borderColor?: string;
    borderWidth?: number;
    fillColor?: string;
    radius?: number;
    padding?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}
export type PageNumberPreset = 'page-slash-total' | 'slash' | 'page-of-total';
export interface PageNumberOptions {
    enabled?: boolean;
    position?: 'header' | 'footer';
    align?: 'left' | 'right' | 'center';
    preset?: PageNumberPreset;
    template?: string;
    y?: number;
    offsetX?: number;
    style?: TextStyle;
    scope?: 'all' | 'first-only' | 'except-first';
    format?: 'arabic' | 'roman-upper' | 'roman-lower';
}
export interface CenterLabelOptions {
    enabled?: boolean;
    position?: 'header' | 'footer';
    text: string;
    scope?: 'all' | 'first-only' | 'except-first' | number[];
    y?: number;
    offsetX?: number;
    style?: TextStyle;
}
