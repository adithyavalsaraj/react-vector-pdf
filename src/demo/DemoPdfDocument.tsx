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

export interface DemoPdfContentProps {
  tableHeaderColor: string;
  tableStriped: boolean;
  tableBorderWidth: string;
}

export const DemoPdfContent: React.FC<DemoPdfContentProps> = ({
  tableHeaderColor,
  tableStriped,
  tableBorderWidth,
}) => (
  <>
    <PdfText fontSize={18} fontStyle="bold">
      Configurable PDF Demo
    </PdfText>
    <PdfText color="#6b7280">
      Vector text — selectable and searchable. Configure page-numbering and
      labels below, then generate.
    </PdfText>

    <PdfView
      style={{
        marginTop: 5,
        padding: 4,
        borderWidth: 0.3,
        borderColor: "#e5e7eb",
      }}
    >
      <PdfText fontStyle="bold">Bill To</PdfText>
      <PdfText>Jane Doe</PdfText>
      <PdfText>42, Long Street, Sample City</PdfText>
      <PdfText>jane@example.com</PdfText>
    </PdfView>

    <PdfView style={{ margin: { top: 5, bottom: 5 } }}>
      <PdfText>{lipsum.repeat(2)}</PdfText>
    </PdfView>

    <PdfView style={{ marginBottom: 10 }}>
      <PdfText fontSize={14} fontStyle="bold">
        Paragraphs & Lists
      </PdfText>
    </PdfView>

    <PdfText>
      {`This paragraph has standard spacing. ${lipsum.substring(0, 100)}...`}
    </PdfText>

    <PdfList
      ordered={false}
      items={[
        "First item in a bullet list",
        "Second item which is slightly longer to demonstrate how it looks in the PDF",
        "Third item",
      ]}
    />
    <PdfText> </PdfText>
    <PdfList
      ordered={true}
      items={[
        "First numbered item",
        "Second numbered item",
        "Third numbered item",
      ]}
    />

    <PdfText> </PdfText>
    <PdfText fontSize={14} fontStyle="bold" spacingBelow={5}>
      Images & Layout
    </PdfText>

    <PdfImage src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" />
    <PdfText>{lipsum.repeat(2)}</PdfText>

    <PdfText fontSize={14} fontStyle="bold" spacingBelow={5}>
      Complex Table with Wrapping & Spans
    </PdfText>
    <PdfText fontSize={10} color="#555" spacingBelow={5}>
      Demonstrates row spans (kept together on page breaks), col spans, vertical
      alignment (middle), and specific cell styling.
    </PdfText>

    <PdfTable
      width="100%"
      headerHeight={8}
      headerStyle={{ fontStyle: "bold", fillColor: tableHeaderColor }}
      rowStyle={{ fontSize: 10 }}
      alternateRowStyle={
        tableStriped ? { fontSize: 10, fillColor: "#f9fafb" } : undefined
      }
      borderWidth={parseFloat(tableBorderWidth) || 0.1}
      columns={[
        { header: "ID", accessor: "id", width: 10, align: "center" },
        {
          header: "Description",
          accessor: "desc",
          width: "50%",
          align: "left",
        },
        { header: "Qty", accessor: "qty", width: 15, align: "right" },
        { header: "Price", accessor: "price", width: 20, align: "right" },
      ]}
      data={[
        { id: 1, desc: "Standard Item", qty: 5, price: "$10.00" },
        {
          id: 2,
          desc: "A very long item description to test wrapping functionality in the PdfTable component. It should expand the row height automatically.",
          qty: 1,
          price: "$25.00",
        },
        {
          id: {
            content: "3",
            rowSpan: 2,
            style: {
              fillColor: "#e0f2fe",
              verticalAlign: "middle",
            },
          },
          desc: {
            content: "RowSpan Item",
            rowSpan: 2,
            style: {
              fillColor: "#e0f2fe",
              verticalAlign: "middle",
            },
          },
          qty: 10,
          price: "$5.00",
        },
        { desc: "Skipped by rowspan", qty: 2, price: "$5.00" },
        {
          id: 4,
          desc: {
            content: "ColSpan Item",
            colSpan: 2,
            style: { align: "center", fontStyle: "italic" },
          },
          qty: "N/A",
          price: "-",
        },
        { id: 5, desc: "Last Item", qty: 1, price: "$100.00" },
      ]}
    />
  </>
);

function header(renderer: PdfRenderer, page: number, total: number) {
  const pdf = renderer.instance;
  pdf.setFontSize(10);
  pdf.text("pdfify-core — Demo", renderer.contentLeft, 10);
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

  tableStriped: boolean;
  tableBorderWidth: string;
  tableHeaderColor: string;

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
  tableStriped,
  tableBorderWidth,
  tableHeaderColor,
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
      <DemoPdfContent
        tableHeaderColor={tableHeaderColor}
        tableStriped={tableStriped}
        tableBorderWidth={tableBorderWidth}
      />
    </PdfDocument>
  );
};
