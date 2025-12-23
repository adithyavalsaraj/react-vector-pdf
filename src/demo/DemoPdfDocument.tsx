import React from "react";
import {
  PdfDocument,
  PdfImage,
  PdfList,
  PdfTable,
  PdfText,
  PdfView,
} from "../components";
import { PdfRenderer } from "../core/PdfRenderer";

const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.`;

export type PdfItemType = "text" | "image" | "list" | "table" | "view";

export interface PdfItem {
  id: string;
  type: PdfItemType;
  props: any;
  showInAllPages?: boolean;
  scope?: any;
}

export interface DemoPdfContentProps {
  items: PdfItem[];
}

export const DemoPdfContent: React.FC<DemoPdfContentProps> = ({ items }) => {
  const renderItem = (item: PdfItem) => {
    const common = {
      showInAllPages: item.showInAllPages,
      scope: item.scope,
    };

    switch (item.type) {
      case "text":
        return (
          <PdfText key={item.id} {...item.props} {...common}>
            {item.props.children}
          </PdfText>
        );
      case "image":
        return <PdfImage key={item.id} {...item.props} {...common} />;
      case "list":
        return <PdfList key={item.id} {...item.props} {...common} />;
      case "table":
        return <PdfTable key={item.id} {...item.props} {...common} />;
      case "view":
        return (
          <PdfView key={item.id} {...item.props} {...common}>
            {typeof item.props.children === "string" ? (
              <PdfText>{item.props.children}</PdfText>
            ) : (
              item.props.children
            )}
          </PdfView>
        );
      default:
        return null;
    }
  };

  return <>{items.map(renderItem)}</>;
};

function header(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(10);
  pdf.text("react-vector-pdf — Demo", renderer.contentLeft, 10);
  pdf.setLineWidth(0.2);
  pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
}

function footer(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text(
    "Generated with jsPDF (vector text, selectable)",
    renderer.contentLeft,
    renderer.height - 7
  );
}
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
}) => {
  const parsePages = (value: string) => {
    const arr = value
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);
    return arr.length ? arr : undefined;
  };

  const pnScopeVal = pnScope === "custom" ? parsePages(pnCustomPages) : pnScope;
  const clScopeVal = clScope === "custom" ? parsePages(clCustomPages) : clScope;

  return (
    <PdfDocument
      options={{
        margin: { top: 18, right: 15, bottom: 15, left: 15 },
        font: { size: 12 },
        color: "#111827",
        lineHeight: 1.35,
      }}
      header={header}
      footer={footer}
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
      <DemoPdfContent items={items} />
    </PdfDocument>
  );
};
