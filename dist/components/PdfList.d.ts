import { default as React } from 'react';
import { TextStyle } from '../core/types';
export interface PdfListProps {
    items: string[];
    ordered?: boolean;
    style?: TextStyle;
    indent?: number;
    markerWidth?: number;
    spacing?: number;
}
export declare const PdfList: React.FC<PdfListProps>;
