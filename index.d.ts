import { default as default_2 } from 'react';
import { jsPDF } from 'jspdf';

export declare type Align = "left" | "center" | "right" | "justify";

export declare interface BoxStyle {
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
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
}

export declare interface CenterLabelOptions {
    enabled?: boolean;
    position?: "header" | "footer";
    text: string;
    scope?: "all" | "first-only" | "except-first" | number[];
    y?: number;
    offsetX?: number;
    style?: TextStyle;
}

declare type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

export declare interface PageNumberOptions {
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

export declare type PageNumberPreset = "page-slash-total" | "slash" | "page-of-total";

export declare const PdfBox: default_2.FC<PdfBoxProps>;

declare interface PdfBoxProps extends BoxStyle {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    children?: default_2.ReactNode;
}

export declare const PdfDocument: default_2.FC<PdfDocumentProps>;

declare interface PdfDocumentProps {
    options?: PDFOptions;
    header?: (ctx: PdfRenderer, page: number, total: number) => void;
    footer?: (ctx: PdfRenderer, page: number, total: number) => void;
    pageNumbers?: PageNumberOptions;
    centerLabel?: CenterLabelOptions;
    metadata?: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string[];
    };
    children: default_2.ReactNode;
    onReady?: (ctx: PdfRenderer) => void;
    filename?: string;
    autoSave?: boolean;
}

export declare type PDFFormat = "a4" | "letter" | [number, number];

export declare const PdfImage: default_2.FC<PdfImageProps>;

declare interface PdfImageProps {
    src: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    mime?: "PNG" | "JPEG";
    flow?: boolean;
    align?: "left" | "center" | "right";
}

export declare const PdfList: default_2.FC<PdfListProps>;

declare interface PdfListProps {
    items: string[];
    ordered?: boolean;
    style?: TextStyle;
    indent?: number;
    markerWidth?: number;
    spacing?: number;
}

export declare interface PDFOptions {
    format?: PDFFormat;
    orientation?: "p" | "l";
    unit?: "mm" | "pt";
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    font?: {
        name?: string;
        style?: "normal" | "bold" | "italic" | "bolditalic";
        size?: number;
    };
    color?: string;
    lineHeight?: number;
}

export declare const PdfPreview: default_2.FC<PdfPreviewProps>;

declare interface PdfPreviewProps extends Omit<PdfDocumentProps, "onReady" | "autoSave" | "filename"> {
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: default_2.CSSProperties;
    iframeClassName?: string;
    iframeStyle?: default_2.CSSProperties;
}

export declare class PdfRenderer {
    private pdf;
    private pageWidth;
    private pageHeight;
    private options;
    private cursorX;
    private cursorY;
    private contentWidth;
    private margin;
    private defaultFont;
    private defaultColor;
    private defaultLineHeight;
    private headerDrawer?;
    private footerDrawer?;
    private pendingTasks;
    private opQueue;
    private generation;
    constructor(opts?: PDFOptions);
    get instance(): jsPDF;
    get width(): number;
    get height(): number;
    get contentLeft(): number;
    get contentRight(): number;
    get contentTop(): number;
    get contentBottom(): number;
    get contentHeight(): number;
    get contentAreaWidth(): number;
    get baseFont(): {
        name?: string;
        style: FontStyle;
        size: number;
    };
    get baseLineHeight(): number;
    resetFlowCursor(): void;
    reset(): void;
    setHeaderFooter(header?: (pdf: jsPDF, pageNum: number, pageCount: number, renderer: PdfRenderer) => void, footer?: (pdf: jsPDF, pageNum: number, pageCount: number, renderer: PdfRenderer) => void): void;
    private applyBaseFont;
    addPage(): void;
    private ensureSpace;
    setTextStyle(style?: TextStyle): void;
    textRaw(text: string, x: number, y: number, style?: TextStyle, maxWidth?: number, align?: TextStyle["align"]): void;
    box(x: number, y: number, w: number, h: number, style?: BoxStyle): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    imageFromUrl(url: string, opts?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
        mime?: "PNG" | "JPEG";
        align?: "left" | "center" | "right";
    }): Promise<{
        width: number;
        height: number;
        x: number | undefined;
        y: number;
    }>;
    queueOperation(op: () => Promise<void> | void): void;
    private registerTask;
    waitForTasks(): Promise<void>;
    private loadImageAsDataURL;
    paragraph(text: string, style?: TextStyle, maxWidth?: number): number;
    moveCursor(dx: number, dy: number): void;
    setCursor(x: number, y: number): void;
    getCursor(): {
        x: number;
        y: number;
    };
    getPageCount(): number;
    applyHeaderFooter(): void;
    measureText(text: string, style?: TextStyle, maxWidth?: number): {
        width: number;
        height: number;
    };
    setMetadata(metadata: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string[];
    }): void;
    save(filename: string): void;
    getBlobUrl(): URL;
}

export declare const PdfTable: default_2.FC<PdfTableProps>;

declare interface PdfTableProps {
    data: any[];
    columns: TableColumn[];
    width?: number | string;
    borderWidth?: number;
    borderColor?: string;
    cellPadding?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    headerStyle?: TextStyle & BoxStyle;
    rowStyle?: TextStyle & BoxStyle;
    alternateRowStyle?: TextStyle & BoxStyle;
    headerHeight?: number;
}

export declare const PdfText: default_2.FC<PdfTextProps>;

declare interface PdfTextProps extends TextStyle {
    children: string;
    x?: number;
    y?: number;
    maxWidth?: number;
    spacingBelow?: number;
}

export declare const PdfView: default_2.FC<PdfViewProps>;

declare interface PdfViewProps {
    style?: ViewStyle;
    children?: default_2.ReactNode;
    debug?: boolean;
}

declare interface TableColumn {
    header?: string;
    accessor?: string | ((row: any) => default_2.ReactNode);
    width?: number | string;
    align?: "left" | "center" | "right";
    id?: string;
}

export declare interface TextStyle {
    fontSize?: number;
    fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
    color?: string;
    align?: Align;
    verticalAlign?: "top" | "middle" | "bottom";
    lineHeight?: number;
}

export declare interface ViewStyle extends BoxStyle {
    margin?: number | {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    width?: number | string;
    height?: number;
}

export { }
