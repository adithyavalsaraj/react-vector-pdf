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

import "./styles.css";

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
    <div
      className={`pdf-preview-container ${className || ""}`}
      style={{ width, height, ...style }}
    >
      {/* Invisible Document which generates the blob */}
      <div className="pdf-preview-hidden">
        <PdfDocument {...documentProps} onReady={handleReady} autoSave={false}>
          {documentProps.children}
        </PdfDocument>
      </div>

      {blobUrl ? (
        <iframe
          src={blobUrl}
          width="100%"
          height="100%"
          className={`pdf-preview-iframe ${iframeClassName || ""}`}
          style={iframeStyle}
          title="PDF Preview"
        />
      ) : (
        <div className="pdf-preview-placeholder">Generating Preview...</div>
      )}
    </div>
  );
};
