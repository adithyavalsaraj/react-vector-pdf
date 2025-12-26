import { jsPDF } from "jspdf";
import { BoxStyle, PDFOptions, TextStyle } from "./types";
import { hexToRgb, inScope } from "./utils";

type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

export class PdfRenderer {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private options: PDFOptions;

  private cursorX = 0;
  private cursorY = 0;
  private contentWidth = 0;
  private reservedBottomHeight = 0;

  public margin = { top: 15, right: 15, bottom: 15, left: 15 };
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
  public generation = 0;

  // Recording Stack for nested buffering
  private recordingStack: Array<Array<() => void>> = [];

  private recurringItems: Array<{
    draw: () => void;
    scope: any;
    y: number;
    height: number;
  }> = [];

  constructor(opts: PDFOptions = {}) {
    // ... ctor ...
    this.options = opts;
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

  // Implementation of Stack Methods
  startRecording() {
    this.recordingStack.push([]);
  }

  stopRecording() {
    const buffer = this.recordingStack.pop();
    return buffer || [];
  }

  playback(ops: Array<() => void>) {
    ops.forEach((op) => op());
  }

  private drawOp(op: () => void) {
    if (this.recordingStack.length > 0) {
      // Push to the top-most buffer
      this.recordingStack[this.recordingStack.length - 1].push(op);
    } else {
      op();
    }
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

  /**
   * Returns the top Y position for content on a given page, accounting for recurring items.
   * This is useful for drawing background boxes that shouldn't overlap headers.
   */
  getSafeContentTop(pageNum: number) {
    let top = this.margin.top;

    // Check all recurring items that apply to this page
    for (const item of this.recurringItems) {
      if (inScope(pageNum, item.scope)) {
        // If the item starts near the top (e.g. typical header), assume it pushes content down.
        // We use a loose heuristic (top 50% of page) to detect top-anchored recurring items.
        // Ideally, recurring items explicitly declare if they are headers, but position is a good proxy.
        // We also check if the item.y is effectively the current top margin or higher.
        if (item.y <= top + 10) {
          const itemBottom = item.y + item.height;
          if (itemBottom > top) {
            top = itemBottom;
          }
        }
      }
    }
    return top;
  }
  get contentBottom() {
    return this.pageHeight - this.margin.bottom - this.reservedBottomHeight;
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

  setReservedHeight(h: number) {
    this.reservedBottomHeight = h;
  }

  private indentStack: { left: number; right: number }[] = [];
  private currentIndent = { left: 0, right: 0 };

  pushIndent(left: number, right: number) {
    this.indentStack.push({ ...this.currentIndent });
    this.currentIndent.left += left;
    this.currentIndent.right += right;

    // Update cursor and content width immediately
    // Note: We don't move cursor Y, only X and constraints
    this.cursorX += left;
    this.contentWidth =
      this.pageWidth -
      this.margin.left -
      this.margin.right -
      this.currentIndent.left -
      this.currentIndent.right;
  }

  popIndent() {
    const prev = this.indentStack.pop();
    if (prev) {
      const diffLeft = this.currentIndent.left - prev.left;
      this.currentIndent = prev;

      // Restore cursor X (reverse the shift) if possible, or just re-calc
      // We assume flow layout, so just shifting back is reasonable?
      // Actually, if we are in a new line, we should reset to margin + indent.
      // If we are mid-line... it's tricky. But usually pop happens at block end.

      this.contentWidth =
        this.pageWidth -
        this.margin.left -
        this.margin.right -
        this.currentIndent.left -
        this.currentIndent.right;

      // We don't forcefully reset cursorX since we might be finishing a block,
      // but typically we should align with new bounds.
      // For now let's just update bounds.
    }
  }

  resetFlowCursor() {
    this.cursorX = this.margin.left + this.currentIndent.left;
    this.cursorY = this.margin.top;
    this.contentWidth =
      this.pageWidth -
      this.margin.left -
      this.margin.right -
      this.currentIndent.left -
      this.currentIndent.right;
  }

  reset() {
    // Re-initialize jsPDF with saved options
    this.pdf = new jsPDF({
      unit: this.options.unit ?? "mm",
      format: this.options.format ?? "a4",
      orientation: this.options.orientation ?? "p",
    });

    this.generation++; // Invalidate pending operations

    this.cursorX = 0;
    this.cursorY = 0;
    this.reservedBottomHeight = 0;
    this.pendingTasks = new Set();
    this.opQueue = Promise.resolve();
    this.indentStack = [];
    this.currentIndent = { left: 0, right: 0 };
    this.recordingStack = [];

    // Re-apply defaults
    this.resetFlowCursor();
    this.applyBaseFont();
    if (this.options.color) {
      const rgb = hexToRgb(this.options.color);
      if (rgb) this.pdf.setTextColor(...rgb);
    }
    this.recurringItems = [];
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
    const style = this.defaultFont.style;
    const size = this.defaultFont.size;
    const color = this.defaultColor;

    this.drawOp(() => {
      this.pdf.setFont(family, style);
      this.pdf.setFontSize(size);
      const rgb = hexToRgb(color);
      if (rgb) this.pdf.setTextColor(...rgb);
    });
  }

  addPage() {
    // Save current horizontal state (indentation)
    const savedIndentX = this.margin.left + this.currentIndent.left;

    this.drawOp(() => {
      this.pdf.addPage();
    });
    this.resetFlowCursor();

    const currentPage = this.getPageCount();
    // Re-draw recurring items and advance cursor
    for (const item of this.recurringItems) {
      if (inScope(currentPage, item.scope)) {
        item.draw();
        // If it starts at or above current cursor, move cursor below it
        if (item.y + item.height > this.cursorY) {
          this.cursorY = item.y + item.height;
        }
      }
    }

    // Restore horizontal cursor to the intended indentation
    this.cursorX = savedIndentX;
  }

  private ensureSpace(neededHeight: number) {
    if (this.cursorY + neededHeight > this.contentBottom) {
      this.addPage();
      return;
    }

    const currentPage = this.getPageCount();
    let moved = true;
    while (moved) {
      moved = false;
      for (const item of this.recurringItems) {
        if (inScope(currentPage, item.scope)) {
          // Check overlap: does [cursorY, cursorY + neededHeight] overlap with [item.y, item.y + item.height]?
          const overlap =
            this.cursorY < item.y + item.height &&
            this.cursorY + neededHeight > item.y;
          if (overlap) {
            this.cursorY = item.y + item.height;
            moved = true;

            // After move, check if we hit page bottom
            if (this.cursorY + neededHeight > this.contentBottom) {
              this.addPage();
              return;
            }
          }
        }
      }
    }
  }

  setTextStyle(style?: TextStyle) {
    if (!style) return;

    // Capture values
    const fontSize = style.fontSize;
    const fontStyle = style.fontStyle;
    const colorStr = style.color;

    this.drawOp(() => {
      if (fontSize) this.pdf.setFontSize(fontSize);

      if (fontStyle) {
        const family = this.pdf.getFont().fontName;
        this.pdf.setFont(family, fontStyle as FontStyle);
      }

      if (colorStr) {
        const color = hexToRgb(colorStr);
        if (color) {
          this.pdf.setTextColor(color[0], color[1], color[2]);
          if (color[3] !== undefined) {
            // @ts-ignore
            this.pdf.setGState(
              new (this.pdf as any).GState({ opacity: color[3] })
            );
          } else {
            // @ts-ignore
            this.pdf.setGState(new (this.pdf as any).GState({ opacity: 1 }));
          }
        }
      }
    });
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
    this.drawOp(() => {
      this.pdf.text(text, x, y, opts);
    });
    this.applyBaseFont();
  }

  box(x: number, y: number, w: number, h: number, style?: BoxStyle) {
    const s = style ?? {};

    this.drawOp(() => {
      if (s.borderWidth || s.borderColor || s.fillColor) {
        // Set Fill
        if (s.fillColor) {
          const fillRgb = hexToRgb(s.fillColor);
          if (fillRgb) {
            if (fillRgb[3] !== undefined) {
              // @ts-ignore
              this.pdf.setGState(
                new (this.pdf as any).GState({ opacity: fillRgb[3] })
              );
            }
            this.pdf.setFillColor(fillRgb[0], fillRgb[1], fillRgb[2]);
          }
        }

        // Set Stroke
        if (s.borderWidth || s.borderColor) {
          if (s.borderWidth) this.pdf.setLineWidth(s.borderWidth);
          if (s.borderColor) {
            const strokeRgb = hexToRgb(s.borderColor);
            if (strokeRgb) {
              if (strokeRgb[3] !== undefined) {
                // @ts-ignore
                this.pdf.setGState(
                  new (this.pdf as any).GState({ opacity: strokeRgb[3] })
                );
              }
              this.pdf.setDrawColor(strokeRgb[0], strokeRgb[1], strokeRgb[2]);
            }
          }
        }

        // Determine Style String (F=Fill, S=Stroke, DF=Both)
        let styleStr = "";
        if (s.fillColor) styleStr += "F";
        if (s.borderWidth || s.borderColor) styleStr += "D";

        if (styleStr) {
          if (s.radius) {
            this.pdf.roundedRect(x, y, w, h, s.radius, s.radius, styleStr);
          } else {
            this.pdf.rect(x, y, w, h, styleStr);
          }
        }

        // Reset defaults
        this.pdf.setLineWidth(0.2);
        this.pdf.setDrawColor(0, 0, 0);
        // @ts-ignore
        this.pdf.setGState(new (this.pdf as any).GState({ opacity: 1 }));
      }
    });
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    this.drawOp(() => {
      this.pdf.line(x1, y1, x2, y2);
    });
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
    // Capture current generation
    const gen = this.generation;

    // Chain the operation to the queue
    const task = this.opQueue.then(async () => {
      // Abort if generation has changed (renderer was reset)
      if (this.generation !== gen) return;

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
      const fontSizeMm = fontSize * 0.3528;
      const halfLeading = (lineHeightMm - fontSizeMm) / 2;

      // Center text vertically in the line box:
      // cursorY (top) + half-leading (space) + fontSizeMm (baseline offset)
      const textY = this.cursorY + fontSizeMm + halfLeading;

      let textX = this.cursorX;
      if (align === "center") {
        textX = this.cursorX + width / 2;
      } else if (align === "right") {
        textX = this.cursorX + width;
      }

      this.drawOp(() => {
        this.pdf.text(ln, textX, textY, { align, maxWidth: width });
      });

      // Advance cursor
      this.cursorY += lineHeightMm;
      totalHeight += lineHeightMm;
    });

    // Add small spacing after block
    // this.cursorY += 1; // Removed as per user request to avoid extra space
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

  registerRecurringItem(item: {
    draw: () => void;
    scope: any;
    y: number;
    height: number;
  }) {
    this.recurringItems.push(item);
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
    if (metadata.keywords) {
      if (Array.isArray(metadata.keywords)) {
        this.pdf.setDocumentProperties({
          keywords: metadata.keywords.join(", "),
        });
      } else {
        this.pdf.setDocumentProperties({
          keywords: String(metadata.keywords),
        });
      }
    }
  }

  save(filename: string) {
    this.applyHeaderFooter();
    this.pdf.save(filename);
  }

  getBlobUrl() {
    this.applyHeaderFooter();
    return this.pdf.output("bloburl");
  }

  /**
   * Injects a filled rectangle at the beginning of the page stream.
   * This ensures the background is drawn BEHIND all other content on the page.
   */
  injectFill(
    pageNum: number,
    rect: { x: number; y: number; w: number; h: number },
    color: string,
    radius?: number
  ) {
    // @ts-ignore
    const pages = this.pdf.internal.pages;

    let page = pages[pageNum];

    // Fallback if page not found (e.g. 0-based indexing or other mismatch)
    if (!page && pages[pageNum - 1]) {
      page = pages[pageNum - 1];
    }

    if (!page) return;

    // @ts-ignore
    const k = this.pdf.internal.scaleFactor;
    // @ts-ignore
    const pageHeight = this.pdf.internal.pageSize.getHeight();

    // Convert coordinates to PDF points (Bottom-Up Y axis)
    // x = x * k
    // y = (pageHeight - (y + h)) * k (flip y)
    // w = w * k
    // h = h * k
    const x = rect.x * k;
    const h = rect.h * k;
    const w = rect.w * k;
    const y = (pageHeight - (rect.y + rect.h)) * k;

    const rgb = hexToRgb(color);
    if (!rgb) return;

    const ops: string[] = ["q"]; // Save graphics state

    // Set Fill Color (rg) - divide by 255
    ops.push(
      `${(rgb[0] / 255).toFixed(3)} ${(rgb[1] / 255).toFixed(3)} ${(
        rgb[2] / 255
      ).toFixed(3)} rg`
    );

    // Draw Rectangle (re) and Fill (f)
    if (radius && radius > 0) {
      // approximate rounded rect with lines/curves if we want to be raw,
      // OR rely on 're' not being enough?
      // raw streams don't have 'roundedRect' primitive easily in older specs,
      // but jsPDF uses curves (c/v/y).
      // Since we are injecting raw PDF stream ops, we must output PDF Drawing Commands.
      // A simple 're' (x y w h re) is rectangle.
      // Rounded needs moves (m) and curves (c).
      // For simplicity/reliability/safety, if we can't easily emulate curves in raw stream
      // generally developers avoid raw injection for complex shapes.
      // HOWEVER, we can just assume 're' is square.
      // If the user REALLY wants fixed background for rounded component behind content...
      // We can try to manually construct the path.

      // Actually, let's use a simpler hack:
      // If we want rounded, we might have to accept that 'injectFill' is primitive.
      // But wait, allow me to try generating the ops via a dummy context or just standard curve approximation.
      // Or... standard solution: Just draw a rectangle.
      // User complained "appearing out of border".

      // Let's implement basic corner clipping if possible.
      // It's quite complex to implement raw bezier curves here without a library.
      // BUT, we can just use the 're' operator (rectangle).
      // If I can't easily do rounded, I will just do rect.
      // Oh, wait, I can just use the same logic as 'box' but prepend?
      // No, 'box' calls `this.pdf.roundedRect`. `roundedRect` writes to the current page stream.
      // `injectFill` writes to the START of the stream.

      // Alternative: Don't use `injectFill`. Use `pdf.roundedRect` normally, but
      // ensure it is drawn BEFORE children?
      // In `PdfView`, we draw children, THEN we draw border.
      // If we draw background *after* processing children (to know height),
      // it overlays the children text if the background is opaque?
      // No, standard PDF painting model: 'f' fills. 'S' strokes.
      // Objects drawn later cover earlier ones.
      // If we draw BG later, it covers text.
      // That's why `injectFill` exists: to put it at the start.

      // To support rounded rect in `injectFill`, I need the raw PDF operators for a rounded rect.
      // I will use a simple implementation of "m ... l ... c ..."
      // For strictness, let's keep it simple.
      // Corner radius r.
      // x, y. w, h.
      // K = 0.551784 (kappa for bezier circle approx)

      const r = radius * k; // Scale radius
      const K = 0.551784;
      const kr = r * K;

      // PDF coords: y is up.
      // Top-Left in our system is x, y(up).
      // Our 'y' var above is actually the PDF bottom-left y.
      // Wait, the calc `y = (pageHeight - (rect.y + rect.h)) * k` refers to the visual bottom of the rect?
      // Yes, PDF 're' takes x, y (bottom-left), w, h.
      // So 'y' is the bottom edge. 'y+h' is the top edge.

      const left = x;
      const right = x + w;
      const bottom = y;
      const top = y + h;

      ops.push(`${(left + r).toFixed(2)} ${top.toFixed(2)} m`); // Move to Top-Left start (after corner)
      ops.push(`${(right - r).toFixed(2)} ${top.toFixed(2)} l`); // Line to Top-Right start
      ops.push(
        `${(right - r + kr).toFixed(2)} ${top.toFixed(2)} ${right.toFixed(
          2
        )} ${(top - r + kr).toFixed(2)} ${right.toFixed(2)} ${(top - r).toFixed(
          2
        )} c`
      ); // Curve to Top-Right end
      ops.push(`${right.toFixed(2)} ${(bottom + r).toFixed(2)} l`); // Line to Bottom-Right start
      ops.push(
        `${right.toFixed(2)} ${(bottom + r - kr).toFixed(2)} ${(
          right -
          r +
          kr
        ).toFixed(2)} ${bottom.toFixed(2)} ${(right - r).toFixed(
          2
        )} ${bottom.toFixed(2)} c`
      ); // Curve to Bottom-Right end
      ops.push(`${(left + r).toFixed(2)} ${bottom.toFixed(2)} l`); // Line to Bottom-Left start
      ops.push(
        `${(left + r - kr).toFixed(2)} ${bottom.toFixed(2)} ${left.toFixed(
          2
        )} ${(bottom + r - kr).toFixed(2)} ${left.toFixed(2)} ${(
          bottom + r
        ).toFixed(2)} c`
      ); // Curve to Bottom-Left end
      ops.push(`${left.toFixed(2)} ${(top - r).toFixed(2)} l`); // Line to Top-Left start
      ops.push(
        `${left.toFixed(2)} ${(top - r + kr).toFixed(2)} ${(
          left +
          r -
          kr
        ).toFixed(2)} ${top.toFixed(2)} ${(left + r).toFixed(2)} ${top.toFixed(
          2
        )} c`
      ); // Curve to Top-Left end (Close)

      ops.push("f"); // Fill
    } else {
      ops.push(
        `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`
      );
    }

    ops.push("Q"); // Restore graphics state

    // Prepend to page stream to ensure it's drawn first (background)
    if (page && Array.isArray(page)) {
      page.unshift(ops.join(" "));
    }
  }
}
