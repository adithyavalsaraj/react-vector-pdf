import { default as React } from 'react';
export interface PdfImageProps {
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    mime?: "PNG" | "JPEG";
    flow?: boolean;
}
export declare const PdfImage: React.FC<PdfImageProps>;
