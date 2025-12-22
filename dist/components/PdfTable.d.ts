import { default as React } from 'react';
import { BoxStyle, TextStyle } from '../core/types';
export interface TableColumn {
    header?: string;
    accessor?: string | ((row: any) => React.ReactNode);
    width?: number | string;
    align?: "left" | "center" | "right";
    id?: string;
}
export interface TableCell {
    content?: string | number;
    colSpan?: number;
    rowSpan?: number;
    style?: TextStyle & BoxStyle;
}
export interface PdfTableProps {
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
export declare const PdfTable: React.FC<PdfTableProps>;
