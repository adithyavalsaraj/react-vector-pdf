import { jsPDF } from "jspdf";
import { BoxStyle, PDFOptions, TextStyle } from "./types";
import { hexToRgb } from "./utils";

type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

export class PdfRenderer {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;

  private cursorX = 0;
  private cursorY = 0;
  private contentWidth = 0;

  private margin = { top: 15, right: 15, bottom: 15, left: 15 };
  private defaultFont: { name?: string; style: FontStyle; size: number } = {
    name: undefined,
    style: "normal",
    size: 12,
  };
  private defaultColor = "#111827";
  private defaultLineHeight = 1.25;

  private headerDrawer?: (
    pdf: jsPDF,
    pageNum: number,
    pageCount: number,
    renderer: PdfRenderer
  ) => void;
  private footerDrawer?: (
    pdf: jsPDF,
    pageNum: number,
    pageCount: number,
    renderer: PdfRenderer
  ) => void;

  private pendingTasks: Set<Promise<any>> = new Set();
  private opQueue: Promise<void> = Promise.resolve();

  constructor(opts: PDFOptions = {}) {
    this.margin = opts.margin ?? this.margin;
    this.defaultFont = {
      name: opts.font?.name,
      style: (opts.font?.style ?? "normal") as FontStyle,
      size: opts.font?.size ?? 12,
    };
    this.defaultColor = opts.color ?? this.defaultColor;
    this.defaultLineHeight = opts.lineHeight ?? this.defaultLineHeight;

    this.pdf = new jsPDF({
      unit: opts.unit ?? "mm",
      format: opts.format ?? "a4",
      orientation: opts.orientation ?? "p",
    });

    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();

    this.resetFlowCursor();
    this.applyBaseFont();
  }

  get instance() {
    return this.pdf;
  }
  get width() {
    return this.pageWidth;
  }
  get height() {
    return this.pageHeight;
  }
  get contentLeft() {
    return this.margin.left;
  }
  get contentRight() {
    return this.pageWidth - this.margin.right;
  }
  get contentTop() {
    return this.margin.top;
  }
  get contentBottom() {
    return this.pageHeight - this.margin.bottom;
  }
  get contentHeight() {
    return this.contentBottom - this.contentTop;
  }
  get contentAreaWidth() {
    return this.contentWidth;
  }
  get baseFont() {
    return this.defaultFont;
  }
  get baseLineHeight() {
    return this.defaultLineHeight;
  }

  resetFlowCursor() {
    this.cursorX = this.margin.left;
    this.cursorY = this.margin.top;
    this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;
  }

  setHeaderFooter(
    header?: (
      pdf: jsPDF,
      pageNum: number,
      pageCount: number,
      renderer: PdfRenderer
    ) => void,
    footer?: (
      pdf: jsPDF,
      pageNum: number,
      pageCount: number,
      renderer: PdfRenderer
    ) => void
  ) {
    this.headerDrawer = header;
    this.footerDrawer = footer;
  }

  private applyBaseFont() {
    const family = this.defaultFont.name ?? this.pdf.getFont().fontName;
    this.pdf.setFont(family, this.defaultFont.style);

    this.pdf.setFontSize(this.defaultFont.size);
    const rgb = hexToRgb(this.defaultColor);
    if (rgb) this.pdf.setTextColor(...rgb);
  }

  addPage() {
    this.pdf.addPage();
    this.resetFlowCursor();
  }

  private ensureSpace(neededHeight: number) {
    if (this.cursorY + neededHeight > this.contentBottom) {
      this.addPage();
    }
  }

  setTextStyle(style?: TextStyle) {
    if (!style) return;
    if (style.fontSize) this.pdf.setFontSize(style.fontSize);

    if (style.fontStyle) {
      const family = this.pdf.getFont().fontName;
      this.pdf.setFont(family, style.fontStyle as FontStyle);
    }

    if (style.color) {
      const rgb = hexToRgb(style.color);
      if (rgb) this.pdf.setTextColor(...rgb);
    }
  }

  textRaw(
    text: string,
    x: number,
    y: number,
    style?: TextStyle,
    maxWidth?: number,
    align: TextStyle["align"] = "left"
  ) {
    this.setTextStyle(style);
    const opts: any = { align };
    if (typeof maxWidth === "number") opts.maxWidth = maxWidth;
    this.pdf.text(text, x, y, opts);
    this.applyBaseFont();
  }

  box(x: number, y: number, w: number, h: number, style?: BoxStyle) {
    const s = style ?? {};
    if (s.fillColor) {
      const fillRgb = hexToRgb(s.fillColor);
      if (fillRgb) this.pdf.setFillColor(...fillRgb);
      this.pdf.rect(x, y, w, h, "F");
    }
    if (s.borderWidth || s.borderColor) {
      if (s.borderWidth) this.pdf.setLineWidth(s.borderWidth);
      if (s.borderColor) {
        const strokeRgb = hexToRgb(s.borderColor);
        if (strokeRgb) this.pdf.setDrawColor(...strokeRgb);
      }
      this.pdf.rect(x, y, w, h);
      this.pdf.setLineWidth(0.2);
      this.pdf.setDrawColor(0, 0, 0);
    }
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    this.pdf.line(x1, y1, x2, y2);
  }

  async imageFromUrl(
    url: string,
    opts: {
      x?: number;
      y?: number;
      w?: number;
      h?: number;
      mime?: "PNG" | "JPEG";
      align?: "left" | "center" | "right";
    } = {}
  ) {
    const task = (async () => {
      try {
        const { dataUrl, width, height } = await this.loadImageAsDataURL(url);

        // Convert px to mm (approx 96 DPI: 1 px = 0.264583 mm)
        const PX_TO_MM = 0.264583;
        const natW = width * PX_TO_MM;
        const natH = height * PX_TO_MM;

        let finalW = opts.w;
        let finalH = opts.h;

        if (finalW === undefined && finalH === undefined) {
          finalW = natW;
          finalH = natH;
        } else if (finalW === undefined && finalH !== undefined) {
          finalW = finalH * (natW / natH);
        } else if (finalH === undefined && finalW !== undefined) {
          finalH = finalW * (natH / natW);
        }

        const drawW = finalW ?? natW;
        const drawH = finalH ?? natH;

        let drawX = opts.x;
        let drawY = opts.y ?? this.cursorY;

        if (opts.y === undefined) {
          // Flow mode: check for page break
          if (drawY + drawH > this.contentBottom) {
            this.addPage();
            drawY = this.cursorY;
            // Re-evaluate drawX if it depends on having been carried over?
            // Actually drawX logic below depends on opts.x or alignment.
            // If opts.x was undefined, we used default alignment.
            // We should re-run the drawX logic since we might have reset context (though alignment is static)
          }
        }

        if (drawX === undefined) {
          const align = opts.align ?? "left";
          if (align === "left") {
            drawX = this.contentLeft;
          } else if (align === "center") {
            drawX = (this.contentLeft + this.contentRight) / 2 - drawW / 2;
          } else if (align === "right") {
            drawX = this.contentRight - drawW;
          }
        }

        this.pdf.addImage(
          dataUrl,
          opts.mime ?? "PNG",
          drawX!,
          drawY,
          drawW,
          drawH
        );
        return { width: drawW, height: drawH, x: drawX, y: drawY };
      } catch (e) {
        console.error("Failed to load image", url, e);
        return { width: 0, height: 0, x: 0, y: 0 };
      }
    })();
    this.registerTask(task);
    return task;
  }

  queueOperation(op: () => Promise<void> | void) {
    // Chain the operation to the queue
    const task = this.opQueue.then(async () => {
      try {
        await op();
      } catch (e) {
        console.error("Operation failed", e);
      }
    });

    // Update the queue pointer
    this.opQueue = task;

    // Also track it as a pending task so we don't save too early
    this.registerTask(task);
  }

  private registerTask(promise: Promise<any>) {
    this.pendingTasks.add(promise);
    promise.finally(() => {
      this.pendingTasks.delete(promise);
    });
  }

  async waitForTasks() {
    await Promise.all(this.pendingTasks);
    await this.opQueue; // Ensure queue is drained
  }

  private loadImageAsDataURL(
    url: string
  ): Promise<{ dataUrl: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas 2D context not available"));
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }

  paragraph(text: string, style?: TextStyle, maxWidth?: number) {
    const width = maxWidth ?? this.contentWidth;
    this.setTextStyle(style);
    const lh = style?.lineHeight ?? this.defaultLineHeight;
    const fontSize = style?.fontSize ?? this.defaultFont.size;
    const lineHeightMm = fontSize * lh * 0.3528;

    const lines = this.pdf.splitTextToSize(text, width);
    const align = style?.align ?? "left";
    let totalHeight = 0;

    lines.forEach((ln: string) => {
      // Check if we have space for this line
      if (this.cursorY + lineHeightMm > this.contentBottom) {
        this.addPage();
      }

      // Draw text
      // Original logic used: y = cursorY + idx*lineHeight + fontSizeMm
      // So relative to current cursorY (top of line box), textY is at +fontSizeMm (approx)
      const textY = this.cursorY + fontSize * 0.3528;
      this.pdf.text(ln, this.cursorX, textY, { align, maxWidth: width });

      // Advance cursor
      this.cursorY += lineHeightMm;
      totalHeight += lineHeightMm;
    });

    // Add small spacing after block
    this.cursorY += 1;
    this.applyBaseFont();
    return totalHeight;
  }

  moveCursor(dx: number, dy: number) {
    this.cursorX += dx;
    this.cursorY += dy;
  }
  setCursor(x: number, y: number) {
    this.cursorX = x;
    this.cursorY = y;
  }
  getCursor() {
    return { x: this.cursorX, y: this.cursorY };
  }
  getPageCount() {
    return this.pdf.getNumberOfPages();
  }

  applyHeaderFooter() {
    const count = this.getPageCount();
    if (!this.headerDrawer && !this.footerDrawer) return;
    for (let i = 1; i <= count; i++) {
      this.pdf.setPage(i);
      if (this.headerDrawer) this.headerDrawer(this.pdf, i, count, this);
      if (this.footerDrawer) this.footerDrawer(this.pdf, i, count, this);
    }
    this.pdf.setPage(count);
  }

  measureText(text: string, style?: TextStyle, maxWidth?: number) {
    this.setTextStyle(style);
    const fontSize = style?.fontSize ?? this.defaultFont.size;
    // jsPDF unit handling is tricky, simplified here:
    // lineHeight factor (1.15 is approx default, user modifiable)
    const lh = style?.lineHeight ?? this.defaultLineHeight;
    const lineHeightMm = fontSize * lh * 0.3528;

    if (maxWidth) {
      const lines = this.pdf.splitTextToSize(text, maxWidth);
      return {
        width: maxWidth,
        height: lines.length * lineHeightMm,
      };
    } else {
      const dims = this.pdf.getTextDimensions(text);
      return { width: dims.w, height: dims.h };
    }
  }

  setMetadata(metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
  }) {
    if (metadata.title)
      this.pdf.setDocumentProperties({ title: metadata.title });
    if (metadata.author)
      this.pdf.setDocumentProperties({ author: metadata.author });
    if (metadata.subject)
      this.pdf.setDocumentProperties({ subject: metadata.subject });
    if (metadata.keywords)
      this.pdf.setDocumentProperties({
        keywords: metadata.keywords.join(", "),
      });
  }

  save(filename: string) {
    this.applyHeaderFooter();
    this.pdf.save(filename);
  }
}
