import React from "react";
import { PdfPreview } from "../components/PdfPreview";
import { PdfRenderer } from "../core/PdfRenderer";
import { CodeBlock } from "./CodeBlock";
import { DemoPdfContent, DemoPdfDocument } from "./DemoPdfDocument";

export const DemoApp: React.FC = () => {
  const [mode, setMode] = React.useState<"download" | "preview">("download");
  const [downloading, setDownloading] = React.useState(false);
  const [previewConfig, setPreviewConfig] = React.useState<any>(null);

  const [previewWidth, setPreviewWidth] = React.useState("100%");
  const [previewHeight, setPreviewHeight] = React.useState("600px");

  // Page Numbers config
  const [pnEnabled, setPnEnabled] = React.useState(true);
  const [pnPos, setPnPos] = React.useState<"header" | "footer">("footer");
  const [pnAlign, setPnAlign] = React.useState<"left" | "center" | "right">(
    "right"
  );
  const [pnPreset, setPnPreset] = React.useState<
    "page-slash-total" | "slash" | "page-of-total"
  >("page-slash-total");
  const [pnTemplate, setPnTemplate] = React.useState("");
  const [pnFormat, setPnFormat] = React.useState<
    "arabic" | "roman-upper" | "roman-lower"
  >("arabic");
  const [pnScope, setPnScope] = React.useState<
    "all" | "first-only" | "except-first" | "custom"
  >("all");
  const [pnCustomPages, setPnCustomPages] = React.useState("");
  const [pnY, setPnY] = React.useState<string>("");
  const [pnOffsetX, setPnOffsetX] = React.useState<string>("");
  const [pnFontSize, setPnFontSize] = React.useState<string>("10");
  const [pnColor, setPnColor] = React.useState<string>("#374151");

  // Center Label config
  const [clEnabled, setClEnabled] = React.useState(false);
  const [clPos, setClPos] = React.useState<"header" | "footer">("header");
  const [clText, setClText] = React.useState("CONFIDENTIAL");
  const [clScope, setClScope] = React.useState<
    "all" | "first-only" | "except-first" | "custom"
  >("first-only");
  const [clCustomPages, setClCustomPages] = React.useState("");
  const [clY, setClY] = React.useState<string>("");
  const [clOffsetX, setClOffsetX] = React.useState<string>("");
  const [clFontSize, setClFontSize] = React.useState<string>("10");
  const [clColor, setClColor] = React.useState<string>("#9CA3AF");

  // New Features config
  const [imgLayout, setImgLayout] = React.useState<"flow" | "absolute">("flow");
  const [imgSizing, setImgSizing] = React.useState<"auto" | "fixed">("auto");

  // Table config
  const [tableStriped, setTableStriped] = React.useState(true);
  const [tableBorderWidth, setTableBorderWidth] = React.useState("0.1");
  const [tableHeaderColor, setTableHeaderColor] = React.useState("#f3f4f6");

  const handleGenerate = () => {
    if (mode === "download") {
      setDownloading(true);
      setTimeout(() => {
        const filename = "pdfify-configurable-demo.pdf";
        const save = (r: any) => r.save(filename);

        // Create a component that renders DemoPdfDocument with current state
        const Root: React.FC = () => (
          <DemoPdfDocument
            pnEnabled={pnEnabled}
            pnPos={pnPos}
            pnAlign={pnAlign}
            pnPreset={pnPreset}
            pnTemplate={pnTemplate}
            pnFormat={pnFormat}
            pnScope={pnScope}
            pnCustomPages={pnCustomPages}
            pnY={pnY}
            pnOffsetX={pnOffsetX}
            pnFontSize={pnFontSize}
            pnColor={pnColor}
            clEnabled={clEnabled}
            clPos={clPos}
            clText={clText}
            clScope={clScope}
            clCustomPages={clCustomPages}
            clY={clY}
            clOffsetX={clOffsetX}
            clFontSize={clFontSize}
            clColor={clColor}
            tableStriped={tableStriped}
            tableBorderWidth={tableBorderWidth}
            tableHeaderColor={tableHeaderColor}
            onReady={save}
            filename={filename}
          />
        );

        const temp = document.createElement("div");
        document.body.appendChild(temp);
        import("react-dom/client").then(({ createRoot }) => {
          const root = createRoot(temp);
          root.render(<Root />);
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(temp);
            setDownloading(false);
          }, 100);
        });
      }, 50);
    } else {
      // Preview Mode: Snapshot current config
      setPreviewConfig({
        options: {
          margin: { top: 18, right: 15, bottom: 15, left: 15 },
          font: { size: 12 },
          color: "#111827",
          lineHeight: 1.35,
        },
        header: (renderer: PdfRenderer, page: number, total: number) => {
          const pdf = renderer.instance;
          pdf.setFontSize(10);
          pdf.text("pdfify-core — Demo", renderer.contentLeft, 10);
          pdf.setLineWidth(0.2);
          pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
        },
        footer: (renderer: PdfRenderer, page: number, total: number) => {
          const pdf = renderer.instance;
          pdf.setFontSize(9);
          pdf.setTextColor(120);
          pdf.text(
            "Generated with jsPDF (vector text, selectable)",
            renderer.contentLeft,
            renderer.height - 7
          );
        },
        pageNumbers: {
          enabled: pnEnabled,
          position: pnPos,
          align: pnAlign,
          preset: pnTemplate ? undefined : pnPreset,
          template: pnTemplate || undefined,
          format: pnFormat,
          scope: (pnScope === "custom"
            ? pnCustomPages
                .split(",")
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n))
            : pnScope) as any,
          y: pnY ? Number(pnY) : undefined,
          offsetX: pnOffsetX ? Number(pnOffsetX) : undefined,
          style: {
            fontSize: pnFontSize ? Number(pnFontSize) : undefined,
            color: pnColor || undefined,
          },
        },
        centerLabel: {
          enabled: clEnabled,
          position: clPos,
          text: clText,
          scope: (clScope === "custom"
            ? clCustomPages
                .split(",")
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n))
            : clScope) as any,
          y: clY ? Number(clY) : undefined,
          offsetX: clOffsetX ? Number(clOffsetX) : undefined,
          style: {
            fontSize: clFontSize ? Number(clFontSize) : undefined,
            color: clColor || undefined,
          },
        },
        contentProps: {
          tableHeaderColor,
          tableStriped,
          tableBorderWidth,
        },
        width: previewWidth,
        height: previewHeight,
      });
    }
  };

  return (
    <div className="demo-wrap">
      <div className="card vstack">
        <h1>react-vector-pdf — Fully Configurable Demo</h1>
        <p>
          Pick your page-number options (preset/template, scope, format,
          position, alignment) and optional center label. Then click Generate
          PDF.
        </p>

        <div className="hr"></div>

        <div className="vstack">
          <h3>Page Numbers</h3>
          <div className="grid grid-3">
            <div className="control">
              <label>Enabled</label>
              <select
                value={pnEnabled ? "true" : "false"}
                onChange={(e) => setPnEnabled(e.target.value === "true")}
              >
                <option value="true">On</option>
                <option value="false">Off</option>
              </select>
            </div>
            <div className="control">
              <label>Position</label>
              <select
                value={pnPos}
                onChange={(e) => setPnPos(e.target.value as any)}
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div className="control">
              <label>Align</label>
              <select
                value={pnAlign}
                onChange={(e) => setPnAlign(e.target.value as any)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="control">
              <label>Preset</label>
              <select
                value={pnPreset}
                onChange={(e) => setPnPreset(e.target.value as any)}
              >
                <option value="page-slash-total">Page 1/10</option>
                <option value="slash">1/10</option>
                <option value="page-of-total">Page 1 of 10</option>
              </select>
              <small className="mono">
                If template is set, it overrides preset.
              </small>
            </div>
            <div className="control">
              <label>Custom Template</label>
              <input
                placeholder="e.g., Pg {page} / {total}"
                value={pnTemplate}
                onChange={(e) => setPnTemplate(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Format</label>
              <select
                value={pnFormat}
                onChange={(e) => setPnFormat(e.target.value as any)}
              >
                <option value="arabic">Arabic (1,2,3)</option>
                <option value="roman-upper">Roman Upper (I, II, III)</option>
                <option value="roman-lower">Roman Lower (i, ii, iii)</option>
              </select>
            </div>

            <div className="control">
              <label>Scope</label>
              <select
                value={pnScope}
                onChange={(e) => setPnScope(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="first-only">First page only</option>
                <option value="except-first">All except first</option>
                <option value="custom">Custom pages</option>
              </select>
            </div>
            <div className="control">
              <label>Custom Pages (comma sep)</label>
              <input
                placeholder="e.g., 2,3,5"
                value={pnCustomPages}
                onChange={(e) => setPnCustomPages(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Y (mm)</label>
              <input
                placeholder="auto"
                value={pnY}
                onChange={(e) => setPnY(e.target.value)}
              />
            </div>

            <div className="control">
              <label>OffsetX (mm)</label>
              <input
                placeholder="0"
                value={pnOffsetX}
                onChange={(e) => setPnOffsetX(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Font Size</label>
              <input
                placeholder="10"
                value={pnFontSize}
                onChange={(e) => setPnFontSize(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Color</label>
              <input
                type="color"
                value={pnColor}
                onChange={(e) => setPnColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="hr"></div>

        <div className="vstack">
          <h3>Center Label (e.g., CONFIDENTIAL)</h3>
          <div className="grid grid-3">
            <div className="control">
              <label>Enabled</label>
              <select
                value={clEnabled ? "true" : "false"}
                onChange={(e) => setClEnabled(e.target.value === "true")}
              >
                <option value="true">On</option>
                <option value="false">Off</option>
              </select>
            </div>
            <div className="control">
              <label>Position</label>
              <select
                value={clPos}
                onChange={(e) => setClPos(e.target.value as any)}
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div className="control">
              <label>Text</label>
              <input
                value={clText}
                onChange={(e) => setClText(e.target.value)}
              />
            </div>

            <div className="control">
              <label>Scope</label>
              <select
                value={clScope}
                onChange={(e) => setClScope(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="first-only">First page only</option>
                <option value="except-first">All except first</option>
                <option value="custom">Custom pages</option>
              </select>
            </div>
            <div className="control">
              <label>Custom Pages (comma sep)</label>
              <input
                placeholder="e.g., 2,3"
                value={clCustomPages}
                onChange={(e) => setClCustomPages(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Y (mm)</label>
              <input
                placeholder="auto"
                value={clY}
                onChange={(e) => setClY(e.target.value)}
              />
            </div>

            <div className="control">
              <label>OffsetX (mm)</label>
              <input
                placeholder="0"
                value={clOffsetX}
                onChange={(e) => setClOffsetX(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Font Size</label>
              <input
                placeholder="10"
                value={clFontSize}
                onChange={(e) => setClFontSize(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Color</label>
              <input
                type="color"
                value={clColor}
                onChange={(e) => setClColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="hr"></div>

        <div className="vstack">
          <h3>Table Options</h3>
          <div className="grid grid-3">
            <div className="control">
              <label>Striped Rows</label>
              <select
                value={tableStriped ? "true" : "false"}
                onChange={(e) => setTableStriped(e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="control">
              <label>Border Width</label>
              <input
                value={tableBorderWidth}
                onChange={(e) => setTableBorderWidth(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Header Color</label>
              <input
                type="color"
                value={tableHeaderColor}
                onChange={(e) => setTableHeaderColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="hstack mb-4" style={{ marginBottom: 20 }}>
          <label>
            <strong>Mode:</strong>
          </label>
          <div className="hstack gap-2">
            <label>
              <input
                type="radio"
                name="mode"
                value="download"
                checked={mode === "download"}
                onChange={() => setMode("download")}
              />{" "}
              Download
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="preview"
                checked={mode === "preview"}
                onChange={() => setMode("preview")}
              />{" "}
              Preview
            </label>
          </div>
        </div>

        {mode === "preview" && (
          <div className="grid grid-2 mb-4">
            <div className="control">
              <label>Preview Width</label>
              <input
                value={previewWidth}
                onChange={(e) => setPreviewWidth(e.target.value)}
              />
            </div>
            <div className="control">
              <label>Preview Height</label>
              <input
                value={previewHeight}
                onChange={(e) => setPreviewHeight(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="hstack">
          <button
            className="btn"
            onClick={handleGenerate}
            disabled={downloading}
          >
            {downloading ? "Generating…" : "Generate PDF"}
          </button>
          <small className="mono">
            Tip: set a custom template like <code>{"Pg {page} / {total}"}</code>
          </small>
        </div>

        {mode === "preview" && previewConfig && (
          <div
            className="preview-container"
            style={{ marginTop: 20, border: "1px solid #e5e7eb" }}
          >
            <PdfPreview
              width={previewConfig?.width || previewWidth}
              height={previewConfig?.height || previewHeight}
              {...previewConfig}
            >
              <DemoPdfContent {...previewConfig.contentProps} />
            </PdfPreview>
          </div>
        )}

        <div className="preview" style={{ marginTop: 16 }}>
          <p>
            <strong>Preview notes:</strong> This demo draws directly to jsPDF
            using vector text. Configure options above, then generate to see
            headers, footers, page numbers, and center labels rendered as real
            text.
          </p>
        </div>
      </div>

      <div className="card vstack" style={{ marginTop: 20 }}>
        <h2>Documentation & Features</h2>
        <p>
          <strong>Vector-based, React-driven PDF generation.</strong>
          <br />
          react-vector-pdf is a React wrapper around jsPDF that allows you to
          build complex, multi-page PDFs using declarative React components.
        </p>
        <div className="hr"></div>

        <h3>Features</h3>
        <ul className="list-disc pl-5">
          <li>
            <strong>Vector Text</strong>: High-quality, selectable, and
            searchable text.
          </li>
          <li>
            <strong>Smart Layout</strong>: Auto-paging, flow positioning, row
            spanning.
          </li>
          <li>
            <strong>Metadata</strong>: Set title, author, subject, and keywords.
          </li>
        </ul>

        <div className="hr"></div>

        <h3>Components Reference</h3>

        <h4>1. PdfText</h4>
        <p>Renders a paragraph of text with automatic wrapping.</p>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>fontSize</code> (number): Font size in points.
          </li>
          <li>
            <code>fontStyle</code> ('normal' | 'bold' | 'italic'): Font style.
          </li>
          <li>
            <code>color</code> (string): Hex color code.
          </li>
          <li>
            <code>align</code> ('left' | 'center' | 'right' | 'justify'): Text
            alignment.
          </li>
          <li>
            <code>lineHeight</code> (number): Line height multiplier.
          </li>
          <li>
            <code>spacingBelow</code> (number): Vertical space (mm) after
            paragraph.
          </li>
        </ul>
        <CodeBlock
          code={`<PdfText fontSize={12} fontStyle="bold" align="center">
  Hello World
</PdfText>`}
        />

        <h4>2. PdfPreview</h4>
        <p>Embeds a PDF preview iframe. (Requires wrapping children)</p>
        <CodeBlock
          code={`<PdfPreview width="100%" height={500}>
  <PdfText>Content...</PdfText>
</PdfPreview>`}
        />

        <h4>3. PdfTable</h4>
        <p>Robust table with spanning and smart breaking.</p>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>columns</code>: Array of{" "}
            <code>{`{ header, accessor, width, align }`}</code>.
          </li>
          <li>
            <code>data</code>: Array of objects. Cell objects support{" "}
            <code>{`{ content, rowSpan, colSpan, style }`}</code>.
          </li>
          <li>
            <code>width</code>: Table width (number or "100%").
          </li>
          <li>
            <code>borderWidth</code>, <code>borderColor</code>: Global border
            settings.
          </li>
          <li>
            <code>headerStyle</code>, <code>rowStyle</code>,{" "}
            <code>alternateRowStyle</code>: Style objects.
          </li>
          <li>
            <code>cellPadding</code>: Number or object{" "}
            <code>{`{ top, right, bottom, left }`}</code>.
          </li>
          <li>
            <code>headerHeight</code>: Minimum header height.
          </li>
        </ul>
        <CodeBlock
          code={`<PdfTable
  cellPadding={{ top: 4, bottom: 4 }}
  alternateRowStyle={{ fillColor: "#f9fafb" }}
  columns={[{ header: "Item", accessor: "name" }]}
  data={data}
/>`}
        />

        <h4>4. PdfList</h4>
        <p>Renders bullet or numbered lists.</p>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>items</code> (string[]): List of strings.
          </li>
          <li>
            <code>ordered</code> (boolean): true for numbers, false for bullets.
          </li>
          <li>
            <code>indent</code>, <code>markerWidth</code>, <code>spacing</code>{" "}
            (number): Layout tuning (mm).
          </li>
          <li>
            <code>style</code>: TextStyle object for list items.
          </li>
        </ul>
        <CodeBlock
          code={`<PdfList
  ordered={true}
  indent={10}
  spacing={3}
  items={["Item 1", "Item 2"]}
/>`}
        />

        <h4>5. PdfImage</h4>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>src</code> (string): URL or base64.
          </li>
          <li>
            <code>x</code>, <code>y</code> (number): Optional fixed coordinates.
          </li>
          <li>
            <code>w</code>, <code>h</code> (number): Dimensions.
          </li>
          <li>
            <code>align</code>: Horizontal alignment (flow mode).
          </li>
          <li>
            <code>flow</code> (boolean): Force flow (default if x/y omitted).
          </li>
        </ul>
        <CodeBlock code={`<PdfImage src="..." align="center" h={30} />`} />

        <h4>6. PdfView & PdfBox</h4>
        <p>Containers for grouping and styling.</p>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>style</code>: Object with <code>margin</code>,{" "}
            <code>padding</code> (granular: <code>marginTop</code>,{" "}
            <code>paddingLeft</code> etc.), <code>borderWidth</code>,{" "}
            <code>borderColor</code>, <code>fillColor</code>.
          </li>
        </ul>
        <CodeBlock
          code={`<PdfView style={{ marginTop: 10, padding: 5, fillColor: "#eee" }}>
  <PdfText>Boxed Content</PdfText>
</PdfView>`}
        />

        <div className="hr"></div>

        <h3>Global Document Props</h3>
        <p>
          Props passed to <code>&lt;PdfDocument&gt;</code>.
        </p>

        <h4>Document Metadata</h4>
        <CodeBlock
          code={`<PdfDocument
  metadata={{
    title: "My PDF",
    author: "Acme Corp",
    subject: "Report",
    keywords: ["finance", "2024"]
  }}
>`}
        />

        <h4>Page Numbering</h4>
        <ul className="list-disc pl-5 mb-2">
          <li>
            <code>enabled</code>, <code>position</code> (header/footer),{" "}
            <code>align</code>.
          </li>
          <li>
            <code>preset</code> ('page-slash-total', etc.) or{" "}
            <code>template</code> ("Pg {`{page}`}").
          </li>
          <li>
            <code>format</code> ('arabic', 'roman-upper', 'roman-lower').
          </li>
          <li>
            <code>scope</code> ('all', 'except-first', etc.) or{" "}
            <code>custom</code> pages.
          </li>
          <li>
            <code>style</code>: TextStyle object.
          </li>
        </ul>

        <h4>Center Label (Watermark)</h4>
        <ul className="list-disc pl-5 mb-2">
          <li>Same positioning and scope logic as Page Numbers.</li>
          <li>
            <code>text</code>: The string to display.
          </li>
        </ul>
      </div>
    </div>
  );
};
