import { useState } from "react";
import { DemoMode, DemoTab, PdfItem, PdfItemType } from "../types";

export const useDemoApp = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("demo");
  const [mode, setMode] = useState<DemoMode>("preview");
  const [downloading, setDownloading] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<any>(null);

  const [previewWidth, setPreviewWidth] = useState<string | undefined>(
    undefined
  );
  const [previewHeight, setPreviewHeight] = useState<string | undefined>(
    undefined
  );

  // Page Numbers config
  const [pnEnabled, setPnEnabled] = useState(true);
  const [pnPos, setPnPos] = useState<"header" | "footer">("footer");
  const [pnAlign, setPnAlign] = useState<"left" | "center" | "right">("right");
  const [pnPreset, setPnPreset] = useState<
    "page-slash-total" | "slash" | "page-of-total"
  >("page-slash-total");
  const [pnTemplate, setPnTemplate] = useState("");
  const [pnFormat, setPnFormat] = useState<
    "arabic" | "roman-upper" | "roman-lower"
  >("arabic");
  const [pnScope, setPnScope] = useState<
    "all" | "first-only" | "except-first" | "custom"
  >("all");
  const [pnCustomPages, setPnCustomPages] = useState("");
  const [pnY, setPnY] = useState<string>("");
  const [pnOffsetX, setPnOffsetX] = useState<string>("");
  const [pnFontSize, setPnFontSize] = useState<string>("10");
  const [pnColor, setPnColor] = useState<string>("#374151");

  // Center Label config
  const [clEnabled, setClEnabled] = useState(false);
  const [clPos, setClPos] = useState<"header" | "footer">("header");
  const [clText, setClText] = useState("CONFIDENTIAL");
  const [clScope, setClScope] = useState<
    "all" | "first-only" | "except-first" | "custom"
  >("first-only");
  const [clCustomPages, setClCustomPages] = useState("");
  const [clY, setClY] = useState<string>("");
  const [clOffsetX, setClOffsetX] = useState<string>("");
  const [clFontSize, setClFontSize] = useState<string>("10");
  const [clColor, setClColor] = useState<string>("#9CA3AF");

  // New Features config
  const [imgEnabled, setImgEnabled] = useState(false);
  const [imgLayout, setImgLayout] = useState<"fixed" | "flow">("fixed");
  const [imgSizing, setImgSizing] = useState<"fit" | "fill" | "auto">("fit");

  const [headerEnabled, setHeaderEnabled] = useState(true);
  const [headerText, setHeaderText] = useState("react-vector-pdf — Demo");
  const [headerAlign, setHeaderAlign] = useState<"left" | "center" | "right">(
    "left"
  );
  const [headerColor, setHeaderColor] = useState("#111827");
  const [headerFontSize, setHeaderFontSize] = useState("10");
  const [headerBorder, setHeaderBorder] = useState(true);
  const [headerBorderColor, setHeaderBorderColor] = useState("#e5e7eb");
  const [headerScope, setHeaderScope] = useState<
    "all" | "first-only" | "except-first" | "custom"
  >("all");
  const [headerCustomPages, setHeaderCustomPages] = useState("");

  const [footerEnabled, setFooterEnabled] = useState(true);
  const [footerText, setFooterText] = useState("");
  const [footerAlign, setFooterAlign] = useState<"left" | "center" | "right">(
    "left"
  );
  const [footerColor, setFooterColor] = useState("#9CA3AF");
  const [footerFontSize, setFooterFontSize] = useState("9");
  const [footerBorder, setFooterBorder] = useState(false);
  const [footerBorderColor, setFooterBorderColor] = useState("#e5e7eb");
  const [footerScope, setFooterScope] = useState<
    "all" | "first-only" | "except-first" | "custom"
  >("all");
  const [footerCustomPages, setFooterCustomPages] = useState("");

  const [filename, setFilename] = useState("react-vector-pdf-demo");

  // Table config
  const [tableEnabled, setTableEnabled] = useState(false);
  const [tableStriped, setTableStriped] = useState(true);
  const [tableBorderWidth, setTableBorderWidth] = useState("0.1");
  const [tableHeaderColor, setTableHeaderColor] = useState("#f3f4f6");

  // Builder state
  const [items, setItems] = useState<PdfItem[]>([
    {
      id: "1",
      type: "text",
      props: {
        children: "Interactive Demo Header",
        fontSize: 18,
        fontStyle: "bold",
      },
      showInAllPages: true,
      scope: "all",
    },
    {
      id: "2",
      type: "text",
      props: {
        children:
          "Below is a list of dynamic items you can add, remove, and edit. Try adding dozens of items to see how recurring sections and page breaks work.",
        color: "#6b7280",
      },
    },
  ]);

  const addItem = (type: PdfItemType) => {
    const id = Math.random().toString(36).substr(2, 9);
    let newItem: PdfItem = { id, type, props: {} };

    switch (type) {
      case "text":
        newItem.props = { children: "New Text Paragraph", fontSize: 12 };
        break;
      case "image":
        newItem.props = {
          src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
          h: 20,
        };
        break;
      case "list":
        newItem.props = {
          ordered: false,
          items: ["Item A", "Item B", "Item C"],
        };
        break;
      case "table":
        newItem.props = {
          width: "100%",
          repeatHeader: true,
          columns: [
            { header: "Name", accessor: "name", width: 40 },
            { header: "Value", accessor: "val", width: 60 },
          ],
          data: [
            { name: "Sample 1", val: "$100" },
            { name: "Sample 2", val: "$200" },
          ],
        };
        break;
      case "view":
        newItem.props = {
          children: "Grouped content or box",
          style: { padding: 4, borderWidth: 0.2, borderColor: "#ccc" },
        };
        break;
    }

    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, updates: Partial<PdfItem>) => {
    setItems(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const updateItemProps = (id: string, propUpdates: any) => {
    setItems(
      items.map((it) =>
        it.id === id ? { ...it, props: { ...it.props, ...propUpdates } } : it
      )
    );
  };

  const clearAllItems = () => setItems([]);

  return {
    activeTab,
    setActiveTab,
    mode,
    setMode,
    downloading,
    setDownloading,
    previewConfig,
    setPreviewConfig,
    previewWidth,
    setPreviewWidth,
    previewHeight,
    setPreviewHeight,
    pnEnabled,
    setPnEnabled,
    pnPos,
    setPnPos,
    pnAlign,
    setPnAlign,
    pnPreset,
    setPnPreset,
    pnTemplate,
    setPnTemplate,
    pnFormat,
    setPnFormat,
    pnScope,
    setPnScope,
    pnCustomPages,
    setPnCustomPages,
    pnY,
    setPnY,
    pnOffsetX,
    setPnOffsetX,
    pnFontSize,
    setPnFontSize,
    pnColor,
    setPnColor,
    clEnabled,
    setClEnabled,
    clPos,
    setClPos,
    clText,
    setClText,
    clScope,
    setClScope,
    clCustomPages,
    setClCustomPages,
    clY,
    setClY,
    clOffsetX,
    setClOffsetX,
    clFontSize,
    setClFontSize,
    clColor,
    setClColor,
    imgEnabled,
    setImgEnabled,
    imgLayout,
    setImgLayout,
    imgSizing,
    setImgSizing,
    tableEnabled,
    setTableEnabled,
    tableStriped,
    setTableStriped,
    tableBorderWidth,
    setTableBorderWidth,
    tableHeaderColor,
    setTableHeaderColor,

    headerEnabled,
    setHeaderEnabled,
    headerText,
    setHeaderText,
    headerAlign,
    setHeaderAlign,
    headerColor,
    setHeaderColor,
    headerFontSize,
    setHeaderFontSize,
    headerBorder,
    setHeaderBorder,
    headerBorderColor,
    setHeaderBorderColor,
    headerScope,
    setHeaderScope,
    headerCustomPages,
    setHeaderCustomPages,

    footerEnabled,
    setFooterEnabled,
    footerText,
    setFooterText,
    footerAlign,
    setFooterAlign,
    footerColor,
    setFooterColor,
    footerFontSize,
    setFooterFontSize,
    footerBorder,
    setFooterBorder,
    footerBorderColor,
    setFooterBorderColor,
    footerScope,
    setFooterScope,
    footerCustomPages,
    setFooterCustomPages,

    filename,
    setFilename,

    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    updateItemProps,
    clearAllItems,
  };
};
