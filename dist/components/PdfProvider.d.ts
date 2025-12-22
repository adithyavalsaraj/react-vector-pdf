import { default as React } from 'react';
import { PdfRenderer } from '../core/PdfRenderer';
import { CenterLabelOptions, PDFOptions, PageNumberOptions } from '../core/types';
export declare const usePdf: () => PdfRenderer;
export interface PdfDocumentProps {
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
    children: React.ReactNode;
    onReady?: (ctx: PdfRenderer) => void;
    filename?: string;
    autoSave?: boolean;
}
export declare const PdfDocument: React.FC<PdfDocumentProps>;
