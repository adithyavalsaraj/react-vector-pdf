import React from "react";
import { PdfDocument } from "../components";
import { DemoPdfContent } from "./components/DemoPdfContent";
import { PdfItem } from "./types";
import {
  createFooterRenderer,
  createHeaderRenderer,
  parsePages,
} from "./utils/pdfHelpers";

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
  items: PdfItem[];
  onReady: (pdf: any) => void;
  filename: string;
  imgLayout?: "fixed" | "flow";
  imgSizing?: "fit" | "fill" | "auto";
  tableStriped?: boolean;
  tableBorderWidth?: string;
  tableHeaderColor?: string;
  // Header Props
  headerEnabled: boolean;
  headerText: string;
  headerAlign: "left" | "center" | "right";
  headerColor: string;
  headerFontSize: string;
  headerBorder: boolean;
  headerBorderColor: string;
  // Footer Props
  footerEnabled: boolean;
  footerText: string;
  footerAlign: "left" | "center" | "right";
  footerColor: string;
  footerFontSize: string;
  footerBorder: boolean;
  footerBorderColor: string;
}

export const DemoPdfDocument: React.FC<DemoPdfProps> = ({
  pnEnabled,
  pnPos,
  pnAlign,
  pnPreset,
  pnTemplate,
  pnFormat,
  pnScope,
  pnCustomPages,
  pnY,
  pnOffsetX,
  pnFontSize,
  pnColor,
  clEnabled,
  clPos,
  clText,
  clScope,
  clCustomPages,
  clY,
  clOffsetX,
  clFontSize,
  clColor,
  items,
  onReady,
  filename,
  imgLayout,
  imgSizing,
  tableStriped,
  tableBorderWidth,
  tableHeaderColor,
  headerEnabled,
  headerText,
  headerAlign,
  headerColor,
  headerFontSize,
  headerBorder,
  headerBorderColor,
  footerEnabled,
  footerText,
  footerAlign,
  footerColor,
  footerFontSize,
  footerBorder,
  footerBorderColor,
}) => {
  const pnScopeVal = pnScope === "custom" ? parsePages(pnCustomPages) : pnScope;
  const clScopeVal = clScope === "custom" ? parsePages(clCustomPages) : clScope;

  const headerRenderer = createHeaderRenderer({
    enabled: headerEnabled,
    text: headerText,
    align: headerAlign,
    color: headerColor,
    fontSize: headerFontSize,
    border: headerBorder,
    borderColor: headerBorderColor,
  });

  const footerRenderer = createFooterRenderer({
    enabled: footerEnabled,
    text: footerText,
    align: footerAlign,
    color: footerColor,
    fontSize: footerFontSize,
    border: footerBorder,
    borderColor: footerBorderColor,
  });

  return (
    <PdfDocument
      options={{
        margin: { top: 18, right: 15, bottom: 15, left: 15 },
        font: { size: 12 },
        color: "#111827",
        lineHeight: 1.35,
      }}
      header={headerRenderer}
      footer={footerRenderer}
      pageNumbers={{
        enabled: pnEnabled,
        position: pnPos,
        align: pnAlign,
        preset: pnTemplate ? undefined : pnPreset,
        template: pnTemplate || undefined,
        format: pnFormat,
        scope: pnScopeVal as any,
        y: pnY ? Number(pnY) : undefined,
        offsetX: pnOffsetX ? Number(pnOffsetX) : undefined,
        style: {
          fontSize: pnFontSize ? Number(pnFontSize) : undefined,
          color: pnColor || undefined,
        },
      }}
      centerLabel={{
        enabled: clEnabled,
        position: clPos,
        text: clText,
        scope: clScopeVal as any,
        y: clY ? Number(clY) : undefined,
        offsetX: clOffsetX ? Number(clOffsetX) : undefined,
        style: {
          fontSize: clFontSize ? Number(clFontSize) : undefined,
          color: clColor || undefined,
        },
      }}
      onReady={onReady}
      filename={filename}
      autoSave={false}
    >
      <DemoPdfContent
        items={items}
        imgLayout={imgLayout}
        imgSizing={imgSizing}
        tableStriped={tableStriped}
        tableBorderWidth={tableBorderWidth}
        tableHeaderColor={tableHeaderColor}
      />
    </PdfDocument>
  );
};
