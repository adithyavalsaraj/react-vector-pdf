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
        return (
          <PdfText key={item.id} {...item.props} {...common}>
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
          />
        );
      case "list":
        return <PdfList key={item.id} {...item.props} {...common} />;
      case "table":
        return (
          <PdfTable
            key={item.id}
            striped={tableStriped}
            borderWidth={
              tableBorderWidth ? Number(tableBorderWidth) : undefined
            }
            headerStyle={{ fillColor: tableHeaderColor, fontStyle: "bold" }}
            {...item.props}
            {...common}
          />
        );
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
