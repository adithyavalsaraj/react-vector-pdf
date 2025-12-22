import { default as React } from 'react';
import { PdfDocumentProps } from './PdfProvider';
export interface PdfPreviewProps extends Omit<PdfDocumentProps, "onReady" | "autoSave" | "filename"> {
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    iframeClassName?: string;
    iframeStyle?: React.CSSProperties;
}
export declare const PdfPreview: React.FC<PdfPreviewProps>;
