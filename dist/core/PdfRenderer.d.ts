import { jsPDF } from 'jspdf';
import { BoxStyle, PDFOptions, TextStyle } from './types';
export declare class PdfRenderer {
    private pdf;
    private pageWidth;
    private pageHeight;
    private cursorX;
    private cursorY;
    private contentWidth;
    private margin;
    private defaultFont;
    private defaultColor;
    private defaultLineHeight;
    private headerDrawer?;
    private footerDrawer?;
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
    resetFlowCursor(): void;
    setHeaderFooter(header?: (pdf: jsPDF, pageNum: number, pageCount: number, renderer: PdfRenderer) => void, footer?: (pdf: jsPDF, pageNum: number, pageCount: number, renderer: PdfRenderer) => void): void;
    private applyBaseFont;
    addPage(): void;
    private ensureSpace;
    setTextStyle(style?: TextStyle): void;
    textRaw(text: string, x: number, y: number, style?: TextStyle, maxWidth?: number, align?: TextStyle["align"]): void;
    box(x: number, y: number, w: number, h: number, style?: BoxStyle): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    imageFromUrl(url: string, x: number, y: number, w: number, h: number, mime?: "PNG" | "JPEG"): Promise<void>;
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
}
