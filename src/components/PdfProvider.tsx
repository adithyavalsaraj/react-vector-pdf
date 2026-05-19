import React, { createContext, useContext } from "react";
import { PdfRenderer } from "../core/PdfRenderer";
import type {
  CenterLabelOptions,
  PDFOptions,
  PageNumberOptions,
} from "../core/types";
import { toRoman } from "../core/utils";

const PdfContext = createContext<PdfRenderer | null>(null);

export const usePdf = () => {
  const ctx = useContext(PdfContext);
  if (!ctx) throw new Error("usePdf must be used within <PdfDocument>");
  return ctx;
};

export interface PdfDocumentProps {
  options?: PDFOptions;
  header?: (ctx: PdfRenderer, page: number, total: number) => void;
  footer?: (ctx: PdfRenderer, page: number, total: number) => void;
  pageNumbers?: PageNumberOptions;
  centerLabel?: CenterLabelOptions;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
  };
  children: React.ReactNode;
  onReady?: (ctx: PdfRenderer) => void;
  filename?: string;
  autoSave?: boolean;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  options,
  header,
  footer,
  pageNumbers,
  centerLabel,
  metadata,
  children,
  onReady,
  filename,
  autoSave = false,
}) => {
  const renderer = React.useMemo(() => new PdfRenderer(options), [options]);

  // Track the current configuration as a ref so header/footer drawers always
  // have the latest values without needing to recreate the renderer.
  const configRef = React.useRef({ header, footer, pageNumbers, centerLabel, metadata, onReady });
  configRef.current = { header, footer, pageNumbers, centerLabel, metadata, onReady };

  React.useEffect(() => {
    const inScope = (
      page: number,
      scope: PageNumberOptions["scope"] | CenterLabelOptions["scope"]
    ) => {
      if (!scope || scope === "all") return true;
      if (scope === "first-only") return page === 1;
      if (scope === "except-first") return page > 1;
      if (Array.isArray(scope)) return scope.includes(page);
      return true;
    };

    const fmtNum = (n: number, format: PageNumberOptions["format"]) => {
      if (format === "roman-upper") return toRoman(n, true);
      if (format === "roman-lower") return toRoman(n, false);
      return String(n);
    };

    const drawPageNumber = (
      area: "header" | "footer",
      page: number,
      total: number
    ) => {
      const { pageNumbers } = configRef.current;
      if (!pageNumbers?.enabled) return;
      if (!inScope(page, pageNumbers.scope)) return;
      const preset = pageNumbers.preset ?? "page-slash-total";
      const tpl =
        pageNumbers.template ??
        (preset === "page-slash-total"
          ? "Page {page}/{total}"
          : preset === "page-of-total"
          ? "Page {page} of {total}"
          : "{page}/{total}");
      const text = tpl
        .replace("{page}", fmtNum(page, pageNumbers.format))
        .replace("{total}", fmtNum(total, pageNumbers.format));

      const align: "left" | "right" | "center" = pageNumbers.align ?? "right";
      const x =
        align === "left"
          ? renderer.contentLeft + (pageNumbers.offsetX ?? 0)
          : align === "right"
          ? renderer.contentRight - (pageNumbers.offsetX ?? 0)
          : (renderer.contentLeft + renderer.contentRight) / 2 +
            (pageNumbers.offsetX ?? 0);

      const defaultY = area === "header" ? 10 : renderer.height - 7;
      const y = typeof pageNumbers.y === "number" ? pageNumbers.y : defaultY;

      renderer.textRaw(text, x, y, pageNumbers.style, undefined, align);
    };

    const drawCenterLabel = (
      area: "header" | "footer",
      page: number,
      total: number
    ) => {
      const { centerLabel } = configRef.current;
      if (!centerLabel?.enabled) return;
      if (!inScope(page, centerLabel.scope)) return;
      const align: "left" | "right" | "center" = "center";
      const x =
        (renderer.contentLeft + renderer.contentRight) / 2 +
        (centerLabel.offsetX ?? 0);
      const defaultY = area === "header" ? 10 : renderer.height - 7;
      const y = typeof centerLabel.y === "number" ? centerLabel.y : defaultY;
      renderer.textRaw(
        centerLabel.text,
        x,
        y,
        centerLabel.style,
        undefined,
        align
      );
    };

    renderer.setHeaderFooter(
      (pdf, page, total) => {
        const { header, pageNumbers, centerLabel } = configRef.current;
        if (header) header(renderer, page, total);
        if (pageNumbers?.position === "header")
          drawPageNumber("header", page, total);
        if (centerLabel?.position === "header")
          drawCenterLabel("header", page, total);
      },
      (pdf, page, total) => {
        const { footer, pageNumbers, centerLabel } = configRef.current;
        if (pageNumbers?.position === "footer")
          drawPageNumber("footer", page, total);
        if (footer) footer(renderer, page, total);
        if (centerLabel?.position === "footer")
          drawCenterLabel("footer", page, total);
      }
    );

    // Wait for async tasks (images) then call onReady
    renderer.waitForTasks().then(() => {
      const { onReady } = configRef.current;
      onReady?.(renderer);
    });

    return () => {
      renderer.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer]);

  React.useEffect(() => {
    if (metadata) {
      renderer.setMetadata(metadata);
    }
  }, [renderer, metadata]);

  React.useEffect(() => {
    if (autoSave && filename) {
      renderer.save(filename);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSave, filename]);

  return <PdfContext.Provider value={renderer}>{children}</PdfContext.Provider>;
};
