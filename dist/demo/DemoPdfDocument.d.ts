import { default as React } from 'react';
export interface DemoPdfContentProps {
    tableHeaderColor: string;
    tableStriped: boolean;
    tableBorderWidth: string;
}
export declare const DemoPdfContent: React.FC<DemoPdfContentProps>;
export interface DemoPdfProps {
    pnEnabled: boolean;
    pnPos: "header" | "footer";
    pnAlign: "left" | "center" | "right";
    pnPreset: "page-slash-total" | "slash" | "page-of-total";
    pnTemplate: string;
    pnFormat: "arabic" | "roman-upper" | "roman-lower";
    pnScope: "all" | "first-only" | "except-first" | "custom";
    pnCustomPages: string;
    pnY: string;
    pnOffsetX: string;
    pnFontSize: string;
    pnColor: string;
    clEnabled: boolean;
    clPos: "header" | "footer";
    clText: string;
    clScope: "all" | "first-only" | "except-first" | "custom";
    clCustomPages: string;
    clY: string;
    clOffsetX: string;
    clFontSize: string;
    clColor: string;
    tableStriped: boolean;
    tableBorderWidth: string;
    tableHeaderColor: string;
    onReady: (pdf: any) => void;
    filename: string;
}
export declare const DemoPdfDocument: React.FC<DemoPdfProps>;
