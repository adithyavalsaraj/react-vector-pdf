export type PdfItemType = "text" | "image" | "list" | "table" | "view";

export interface PdfItem {
  id: string;
  type: PdfItemType;
  props: any;
  showInAllPages?: boolean;
  scope?: any;
}

export type DemoTab = "demo" | "docs" | "repro";
export type DemoMode = "download" | "preview" | "code";
