import { PdfItem } from "../types";

export const generateReactCode = (
  items: PdfItem[],
  settings: {
    pnEnabled: boolean;
    pnPos: string;
    pnAlign: string;
    pnScope: string;
    clEnabled: boolean;
    clText: string;
    clScope: string;
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

      switch (item.type) {
        case "text":
          return `  <PdfText\n    ${propsString}\n    ${
            item.showInAllPages ? "showInAllPages" : ""
          }\n  />`;
        case "image":
          return `  <PdfImage\n    ${propsString}\n    ${
            item.showInAllPages ? "showInAllPages" : ""
          }\n  />`;
        case "table":
          return `  <PdfTable\n    data={data} // Replace with your data\n    columns={columns} // Replace with your columns\n  />`;
        case "list":
          return `  <PdfList\n    ${propsString}\n  />`;
        case "view":
          return `  <PdfView\n    style={{ ... }}\n  >\n    {/* Content */}\n  </PdfView>`;
        default:
          return "";
      }
    })
    .join("\n\n");

  return `import React from 'react';
import { PdfDocument, PdfText, PdfImage, PdfTable, PdfList } from '@pdfify/core';

export const MyPdfDocument = () => {
  return (
    <PdfDocument
      pageNumbers={${
        settings.pnEnabled
          ? JSON.stringify(
              {
                position: settings.pnPos,
                align: settings.pnAlign,
                scope: settings.pnScope,
              },
              null,
              4
            )
          : "undefined"
      }}
      centerLabel={${
        settings.clEnabled
          ? JSON.stringify(
              {
                text: settings.clText,
                scope: settings.clScope,
              },
              null,
              4
            )
          : "undefined"
      }}
    >
${itemCode}
    </PdfDocument>
  );
};
`;
};
