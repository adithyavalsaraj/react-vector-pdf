import React from "react";
import {
  PdfImage,
  PdfList,
  PdfTable,
  PdfText,
  PdfView,
} from "../../components";
import { PdfItem } from "../types";

export interface DemoPdfContentProps {
  items: PdfItem[];
  imgLayout?: "fixed" | "flow";
  imgSizing?: "fit" | "fill" | "auto";
  tableStriped?: boolean;
  tableBorderWidth?: string;
  tableHeaderColor?: string;
}

export const DemoPdfContent: React.FC<DemoPdfContentProps> = ({
  items,
  imgLayout,
  imgSizing,
  tableStriped,
  tableBorderWidth,
  tableHeaderColor,
}) => {
  const renderItem = (item: PdfItem) => {
    const common = {
      showInAllPages: item.showInAllPages,
      scope: item.scope,
    };

    switch (item.type) {
      case "text":
        // Example: Add a utility class to text items for demonstration if they don't have one
        // Ideally we should let the user pick classes in the UI, but for now we hardcode a test
        // or map existing props to classes.
        // Let's map strict colors to classes if possible, or just pass generic class.
        return (
          <PdfText
            key={item.id}
            {...item.props}
            {...common}
            // Demo: apply 'mb-2' (margin-bottom 2mm approx) via class
            className="mb-2"
          >
            {item.props.children}
          </PdfText>
        );
      case "image":
        return (
          <PdfImage
            key={item.id}
            layout={imgLayout}
            sizing={imgSizing}
            {...item.props}
            {...common}
            className="mb-4"
          />
        );
      case "list":
        return (
          <PdfList key={item.id} {...item.props} className="mb-4" {...common} />
        );
      case "table":
        // Map header color to class if it matches our utilities
        let headerClass = "";
        let headerStyle = { ...item.props.headerStyle, fontStyle: "bold" };

        if (tableHeaderColor === "#f3f4f6") headerClass = "bg-gray-50";
        else if (tableHeaderColor === "#eff6ff") headerClass = "bg-blue-50";
        else headerStyle.fillColor = tableHeaderColor;

        return (
          <PdfTable
            key={item.id}
            striped={tableStriped}
            borderWidth={
              tableBorderWidth ? Number(tableBorderWidth) : undefined
            }
            // We can pass headerStyle WITH className.
            // If className sets bg, it overrides defaults.
            // Explicit style supercedes class.
            headerStyle={headerStyle}
            className={`mb-4 w-full ${headerClass}`}
            {...item.props}
            {...common}
          />
        );
      case "view":
        return (
          <PdfView
            key={item.id}
            {...item.props}
            {...common}
            // Add a gap class for demonstration if it's a view item
            className={`${item.props.className || ""} gap-2`}
          >
            {typeof item.props.children === "string" ? (
              <>
                <PdfText>{`${item.props.children} (Item 1)`}</PdfText>
                <PdfText>{`${item.props.children} (Item 2 - Gap Test)`}</PdfText>
              </>
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
