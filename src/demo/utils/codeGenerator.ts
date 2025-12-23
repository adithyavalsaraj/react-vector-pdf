import { PdfItem } from "../types";

export const generateReactCode = (
  items: PdfItem[],
  settings: {
    pnEnabled: boolean;
    pnPos: string;
    pnAlign: string;
    pnScope: string;
    pnCustomPages?: string;
    pnY?: string;
    pnOffsetX?: string;
    pnFontSize?: string;
    pnColor?: string;
    pnPreset?: string;
    pnTemplate?: string;
    pnFormat?: string;

    clEnabled: boolean;
    clText: string;
    clScope: string;
    clCustomPages?: string;
    clY?: string;
    clOffsetX?: string;
    clFontSize?: string;
    clColor?: string;
    clPos?: string;

    headerEnabled: boolean;
    headerText: string;
    headerAlign: string;
    headerColor: string;
    headerFontSize: string;
    headerBorder: boolean;
    headerBorderColor: string;

    footerEnabled: boolean;
    footerText: string;
    footerAlign: string;
    footerColor: string;
    footerFontSize: string;
    footerBorder: boolean;
    footerBorderColor: string;

    imgLayout?: string;
    imgSizing?: string;
    tableStriped?: boolean;
    tableBorderWidth?: string;
    tableHeaderColor?: string;
    margin?: { top: number; right: number; bottom: number; left: number };
  }
): string => {
  const itemCode = items
    .map((item) => {
      let propsString = JSON.stringify(item.props, null, 2);
      // Clean up the JSON string to look more like props
      propsString = propsString
        .replace(/^\{\n/, "")
        .replace(/\n\}$/, "")
        .replace(/"(\w+)":/g, "$1=")
        .trim();

      // Simple formatting for single-line props if short
      if (propsString.length < 50 && !propsString.includes("\n")) {
        propsString = propsString.replace(/,\n/g, " ");
      }

      const commonProps = [];
      if (item.showInAllPages) commonProps.push("showInAllPages");
      if (item.scope) commonProps.push(`scope={${JSON.stringify(item.scope)}}`);

      const commonPropsStr = commonProps.length
        ? "\n    " + commonProps.join("\n    ")
        : "";

      switch (item.type) {
        case "text":
          return `  <PdfText\n    ${propsString}${commonPropsStr}\n  />`;
        case "image":
          let imgProps = "";
          if (settings.imgLayout && settings.imgLayout !== "fixed")
            imgProps += `\n    layout="${settings.imgLayout}"`;
          if (settings.imgSizing && settings.imgSizing !== "fit")
            imgProps += `\n    sizing="${settings.imgSizing}"`;

          return `  <PdfImage\n    ${propsString}${imgProps}${commonPropsStr}\n  />`;
        case "table":
          let tableProps = "";
          if (settings.tableStriped) tableProps += `\n    striped`;
          if (settings.tableBorderWidth && settings.tableBorderWidth !== "0.1")
            tableProps += `\n    borderWidth={${settings.tableBorderWidth}}`;
          if (
            settings.tableHeaderColor &&
            settings.tableHeaderColor !== "#e4e4e7"
          ) {
            tableProps += `\n    headerStyle={{ fillColor: "${settings.tableHeaderColor}", fontStyle: "bold" }}`;
          }

          return `  <PdfTable\n    data={data} // Replace with your data\n    columns={columns} // Replace with your columns${tableProps}${commonPropsStr}\n  />`;
        case "list":
          return `  <PdfList\n    ${propsString}${commonPropsStr}\n  />`;
        case "view":
          return `  <PdfView\n    style={{ ... }}${commonPropsStr}\n  >\n    {/* Content */}\n  </PdfView>`;
        default:
          return "";
      }
    })
    .join("\n\n");

  const buildHeaderCode = () => {
    if (!settings.headerEnabled) return "undefined";
    return `(renderer) => {
        const pdf = renderer.instance;
        pdf.setFontSize(${settings.headerFontSize || 10});
        pdf.setTextColor('${settings.headerColor || "#000000"}');
        
        // Align logic
        const text = "${settings.headerText}";
        // ... (implementation of alignment logic here similar to pdfHelpers.ts)
        pdf.text(text, renderer.contentLeft, 10);
        
        ${
          settings.headerBorder
            ? `pdf.setDrawColor('${
                settings.headerBorderColor || "#000000"
              }');\n        pdf.setLineWidth(0.1);\n        pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);`
            : ""
        }
      }`;
  };

  const buildFooterCode = () => {
    if (!settings.footerEnabled) return "undefined";
    return `(renderer) => {
          const pdf = renderer.instance;
          pdf.setFontSize(${settings.footerFontSize || 9});
          pdf.setTextColor('${settings.footerColor || "#000000"}'); // ${
      settings.footerColor
    }
          const y = renderer.height - 10;
          pdf.text("${settings.footerText}", renderer.contentLeft, y);
          ${
            settings.footerBorder
              ? `pdf.setDrawColor('${
                  settings.footerBorderColor || "#000000"
                }');\n          pdf.setLineWidth(0.1);\n          pdf.line(renderer.contentLeft, y - 4, renderer.contentRight, y - 4);`
              : ""
          }
        }`;
  };

  const pnConfig = settings.pnEnabled
    ? JSON.stringify(
        {
          position: settings.pnPos,
          align: settings.pnAlign,
          scope:
            settings.pnScope === "custom"
              ? settings.pnCustomPages
              : settings.pnScope,
          preset: settings.pnTemplate ? undefined : settings.pnPreset,
          template: settings.pnTemplate || undefined,
          format: settings.pnFormat,
          y: settings.pnY ? Number(settings.pnY) : undefined,
          offsetX: settings.pnOffsetX ? Number(settings.pnOffsetX) : undefined,
          style: {
            fontSize: settings.pnFontSize
              ? Number(settings.pnFontSize)
              : undefined,
            color: settings.pnColor,
          },
        },
        null,
        4
      )
    : "undefined";

  const clConfig = settings.clEnabled
    ? JSON.stringify(
        {
          position: settings.clPos,
          text: settings.clText,
          scope:
            settings.clScope === "custom"
              ? settings.clCustomPages
              : settings.clScope,
          y: settings.clY ? Number(settings.clY) : undefined,
          offsetX: settings.clOffsetX ? Number(settings.clOffsetX) : undefined,
          style: {
            fontSize: settings.clFontSize
              ? Number(settings.clFontSize)
              : undefined,
            color: settings.clColor,
          },
        },
        null,
        4
      )
    : "undefined";

  return `import React from 'react';
import { PdfDocument, PdfText, PdfImage, PdfTable, PdfList } from 'react-vector-pdf';

export const MyPdfDocument = () => {
  return (
    <PdfDocument
      options={{
        margin: { top: 18, right: 15, bottom: 15, left: 15 },
        font: { size: 12 },
        color: "#111827",
        lineHeight: 1.35,
      }}
      header={${buildHeaderCode()}}
      footer={${buildFooterCode()}}
      pageNumbers={${pnConfig}}
      centerLabel={${clConfig}}
    >
${itemCode}
    </PdfDocument>
  );
};
`;
};
