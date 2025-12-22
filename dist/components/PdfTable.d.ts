import { default as React } from 'react';
import { BoxStyle, TextStyle } from '../core/types';
export interface Column {
    header: string;
    width: number;
    key: string;
    align?: "left" | "center" | "right";
}
export interface PdfTableProps {
    columns: Column[];
    data: Array<Record<string, any>>;
    rowHeight?: number;
    headerStyle?: TextStyle & BoxStyle;
    cellStyle?: TextStyle & BoxStyle;
    zebra?: boolean;
    topGap?: number;
}
export declare const PdfTable: React.FC<PdfTableProps>;
