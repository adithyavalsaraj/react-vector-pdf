import { PdfItem } from "../types";

export const generateReactCode = (
  items: PdfItem[],
  settings: {
    metadata: any;
    layout: any;
    margins: any;
    typography: any;
    baseColor: string;
    autoSave?: boolean;

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

    // Defaults for overrides (optional)
    imgLayout?: string;
    imgSizing?: string;
    tableStriped?: boolean;
    tableBorderWidth?: string;
    tableHeaderColor?: string;
  }
): string => {
  const itemCode = items
    .map((item) => {
      // 1. Extract known reserved props to avoid duplication
      const {
        showInAllPages,
        scope,
        className,
        // Item specific props to handle separately
        ...restProps
      } = item.props as any;

      let propsString = JSON.stringify(restProps, null, 2);

      // Clean up JSON to JSX-like props
      propsString = propsString
        .replace(/^\{\n/, "")
        .replace(/\n\}$/, "")
        .replace(/"(\w+)":/g, "$1=")
        .trim();

      // Simple formatting for single-line props if short
      if (propsString.length < 50 && !propsString.includes("\n")) {
        propsString = propsString.replace(/,\n/g, " ");
      }

      // 2. Build common props list
      const commonProps = [];
      if (item.showInAllPages) commonProps.push("showInAllPages");
      if (item.scope) commonProps.push(`scope={${JSON.stringify(item.scope)}}`);
      if (item.props.className)
        commonProps.push(`className="${item.props.className}"`);

      const commonPropsStr = commonProps.length
        ? "\n    " + commonProps.join("\n    ")
        : "";

      // 3. Item specific logic overrides
      switch (item.type) {
        case "text":
          return `  <PdfText\n    ${propsString}${commonPropsStr}\n  />`;
        case "image":
          // Handle overrides: if prop is set in item, it's already in 'restProps' (JSON.stringify)
          // If we want to show global defaults explicitly, we'd need to merge.
          // But here we just show what's on the item.
          return `  <PdfImage\n    ${propsString}${commonPropsStr}\n  />`;

        case "table":
          // Similar logic, propsString contains overrides if they exist in item.props
          // However, we might want to comment about data structure
          return `  <PdfTable\n    data={data} \n    columns={columns}${commonPropsStr}\n    ${propsString}\n  />`;

        case "list":
          return `  <PdfList\n    ${propsString}${commonPropsStr}\n  />`;

        case "view":
          return `  <PdfView\n    ${propsString}${commonPropsStr}\n  >\n    {/* Children content */}\n  </PdfView>`;

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
        const text = "${settings.headerText}";
        // ... alignment logic ...
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
          pdf.setTextColor('${settings.footerColor || "#000000"}'); 
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
import { PdfDocument, PdfText, PdfImage, PdfTable, PdfList, PdfView } from 'react-vector-pdf';

export const MyPdfDocument = () => {
  const data = [/* ... */];
  const columns = [/* ... */];

  return (
    <PdfDocument
      metadata={${JSON.stringify(settings.metadata, null, 2)}}
      options={{
        format: "${settings.layout.format}",
        orientation: "${settings.layout.orientation}",
        margin: ${JSON.stringify(settings.margins)},
        font: { size: ${settings.typography.fontSize}, name: "${
    settings.typography.fontName
  }" },
        color: "${settings.baseColor}",
        lineHeight: ${settings.typography.lineHeight},
      }}
      header={${buildHeaderCode()}}
      footer={${buildFooterCode()}}
      pageNumbers={${pnConfig}}
      centerLabel={${clConfig}}
      autoSave={${settings.autoSave}}
    >
${itemCode}
    </PdfDocument>
  );
};
`;
};
