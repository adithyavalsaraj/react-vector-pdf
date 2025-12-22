import { default as React } from 'react';
import { TextStyle } from '../core/types';
export interface PdfTextProps extends TextStyle {
    children: string;
    x?: number;
    y?: number;
    maxWidth?: number;
    spacingBelow?: number;
}
export declare const PdfText: React.FC<PdfTextProps>;
