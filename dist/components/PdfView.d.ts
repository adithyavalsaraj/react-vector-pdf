import { default as React } from 'react';
import { ViewStyle } from '../core/types';
export interface PdfViewProps {
    style?: ViewStyle;
    children?: React.ReactNode;
    debug?: boolean;
}
export declare const PdfView: React.FC<PdfViewProps>;
