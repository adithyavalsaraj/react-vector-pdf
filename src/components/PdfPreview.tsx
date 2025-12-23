import React, { useState } from "react";
import { PdfRenderer } from "../core/PdfRenderer";
import { PdfDocument, PdfDocumentProps } from "./PdfProvider";

export interface PdfPreviewProps
  extends Omit<PdfDocumentProps, "onReady" | "autoSave" | "filename"> {
  width?: string | number;
  height?: string | number;
  className?: string; // Container className
  style?: React.CSSProperties; // Container style
  iframeClassName?: string;
  iframeStyle?: React.CSSProperties;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  width = "inherit",
  height = "inherit",
  className,
  style,
  iframeClassName,
  iframeStyle,
  ...documentProps
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const handleReady = (renderer: PdfRenderer) => {
    const url = renderer.getBlobUrl();
    setBlobUrl(url.toString());
  };

  return (
    <div className={className} style={{ width, height, ...style }}>
      {/* Invisible Document which generates the blob */}
      <div style={{ display: "none" }}>
        <PdfDocument {...documentProps} onReady={handleReady} autoSave={false}>
          {documentProps.children}
        </PdfDocument>
      </div>

      {blobUrl ? (
        <iframe
          src={blobUrl}
          width="100%"
          height="100%"
          className={iframeClassName}
          style={{ border: "none", ...iframeStyle }}
          title="PDF Preview"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
          }}
        >
          Generating Preview...
        </div>
      )}
    </div>
  );
};
