import { default as React } from 'react';
import { BoxStyle } from '../core/types';
export interface PdfBoxProps extends BoxStyle {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    children?: React.ReactNode;
}
export declare const PdfBox: React.FC<PdfBoxProps>;
