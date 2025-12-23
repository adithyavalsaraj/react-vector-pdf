import React from "react";
import { CodeBlock } from "./CodeBlock";

export const DocsContent: React.FC = () => {
  return (
    <div className="vstack">
      <h2>Documentation & Features</h2>
      <p>
        <strong>Vector-based, React-driven PDF generation.</strong>
        <br />
        react-vector-pdf is a React wrapper around jsPDF that allows you to
        build complex, multi-page PDFs using declarative React components.
      </p>
      <div className="hr"></div>

      <h3>Features</h3>
      <ul className="list-disc">
        <li>
          <strong>Vector Text</strong>: High-quality, selectable, and searchable
          text (no canvas rasterization).
        </li>
        <li>
          <strong>Smart Layout</strong>: Auto-paging, flow & absolute
          positioning, intelligent page breaking.
        </li>
        <li>
          <strong>Advanced Components</strong>: Tables with
          rowspan/colspan/striping, images with flow layout, lists, and
          containers.
        </li>
        <li>
          <strong>Recurring Elements</strong>: Make any component appear on all
          pages or specific pages using <code>showInAllPages</code> and{" "}
          <code>scope</code>.
        </li>
        <li>
          <strong>Global Features</strong>: Page numbering, center labels,
          custom headers/footers, metadata.
        </li>
        <li>
          <strong>TypeScript</strong>: Written in TypeScript with complete type
          definitions.
        </li>
      </ul>

      <div className="hr"></div>

      <h3>Components Reference</h3>

      <h4>1. PdfDocument</h4>
      <p>
        The main wrapper component that provides context and handles PDF
        generation.
      </p>
      <ul className="list-disc">
        <li>
          <code>options</code>: PDF configuration (format, orientation, margins,
          fonts)
        </li>
        <li>
          <code>metadata</code>: Document metadata (title, author, subject,
          keywords)
        </li>
        <li>
          <code>header</code>, <code>footer</code>: Custom render functions
        </li>
        <li>
          <code>pageNumbers</code>, <code>centerLabel</code>: Global features
        </li>
        <li>
          <code>onReady</code>: Callback when PDF is ready
        </li>
        <li>
          <code>filename</code>, <code>autoSave</code>: Auto-save configuration
        </li>
      </ul>

      <h4>2. PdfText</h4>
      <p>Renders a paragraph of text with automatic wrapping.</p>
      <ul className="list-disc">
        <li>
          <code>fontSize</code> (number): Font size in points.
        </li>
        <li>
          <code>fontStyle</code> ('normal' | 'bold' | 'italic' | 'bolditalic'):
          Font style.
        </li>
        <li>
          <code>color</code> (string): Hex color or RGBA (e.g., "rgba(255, 0, 0,
          0.5)").
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
        <li>
          <code>showInAllPages</code> (boolean): Make this text appear on
          multiple pages.
        </li>
        <li>
          <code>scope</code> ('all' | 'first-only' | 'except-first' | number[]):
          Which pages to show on.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfText fontSize={12} fontStyle="bold" align="center">
  Hello World
</PdfText>

{/* Recurring header on all pages except first */}
<PdfText showInAllPages scope="except-first" fontSize={10}>
  Document Header
</PdfText>`}
      />

      <h4>3. PdfPreview</h4>
      <p>
        Embeds a PDF preview iframe. Automatically updates when props change.
      </p>
      <CodeBlock
        code={`<PdfPreview width="100%" height={500}>
  <PdfText>Content...</PdfText>
</PdfPreview>`}
      />

      <h4>4. PdfTable</h4>
      <p>Robust table with spanning, striping, and smart breaking.</p>
      <ul className="list-disc">
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
          <code>striped</code> (boolean): Enable alternating row colors.
        </li>
        <li>
          <code>repeatHeader</code> (boolean): Repeat header on each page
          (default: true).
        </li>
        <li>
          <code>headerHeight</code>: Minimum header height.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfTable
  striped={true}
  repeatHeader={true}
  borderWidth={0.5}
  headerStyle={{ fillColor: "#f3f4f6", fontStyle: "bold" }}
  cellPadding={{ top: 4, bottom: 4 }}
  columns={[{ header: "Item", accessor: "name" }]}
  data={data}
/>`}
      />

      <h4>5. PdfList</h4>
      <p>Renders bullet or numbered lists.</p>
      <ul className="list-disc">
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
  items={["Item 1", "Item 2", "Item 3"]}
/>`}
      />

      <h4>6. PdfImage</h4>
      <p>Embed images with flow or absolute positioning.</p>
      <ul className="list-disc">
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
          <code>layout</code> ('fixed' | 'flow'): Layout mode (default:
          'fixed').
        </li>
        <li>
          <code>sizing</code> ('fit' | 'fill' | 'auto'): How to size the image.
        </li>
        <li>
          <code>align</code>: Horizontal alignment (flow mode).
        </li>
        <li>
          <code>showInAllPages</code> (boolean): Make this image appear on
          multiple pages.
        </li>
        <li>
          <code>scope</code>: Which pages to show on.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfImage 
  src="logo.png" 
  layout="flow"
  sizing="fit"
  align="center" 
  h={30} 
/>

{/* Recurring logo on all pages */}
<PdfImage
  src="logo.png"
  showInAllPages
  scope="all"
  x={10}
  y={10}
  h={15}
/>`}
      />

      <h4>7. PdfView</h4>
      <p>
        A container component for grouping content and adding backgrounds or
        borders. Supports both <strong>flow layout</strong> (automatic) and
        <strong> absolute positioning</strong>.
      </p>
      <ul className="list-disc">
        <li>
          <code>style</code>: margin, padding, borderWidth, borderColor,
          fillColor (supports RGBA), radius.
        </li>
        <li>
          <code>x</code>, <code>y</code>, <code>w</code>, <code>h</code>:
          Optional coordinates for fixed placement.
        </li>
        <li>
          <code>showInAllPages</code>, <code>scope</code>: Recurring element
          options.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfView style={{ 
  marginTop: 10, 
  padding: 5, 
  fillColor: "rgba(240, 240, 240, 0.5)" 
}}>
  <PdfText>Boxed Content</PdfText>
</PdfView>`}
      />

      <div className="hr"></div>

      <h3>Global Document Props</h3>
      <p>
        Props passed to <code>&lt;PdfDocument&gt;</code>.
      </p>

      <h4>Document Options</h4>
      <CodeBlock
        code={`<PdfDocument
  options={{
    format: "a4",           // or "letter", or [width, height] in mm
    orientation: "p",       // "p" for portrait, "l" for landscape
    margin: { top: 20, right: 15, bottom: 15, left: 15 },
    font: { size: 12, name: "helvetica" },
    lineHeight: 1.25
  }}
>`}
      />

      <h4>Document Metadata</h4>
      <CodeBlock
        code={`<PdfDocument
  metadata={{
    title: "Annual Report 2024",
    author: "Acme Corp",
    subject: "Financial Report",
    keywords: ["finance", "2024", "report"]
  }}
>`}
      />

      <h4>Page Numbering</h4>
      <ul className="list-disc">
        <li>
          <code>enabled</code>, <code>position</code> (header/footer),{" "}
          <code>align</code> (left/center/right).
        </li>
        <li>
          <code>preset</code> ('page-slash-total', 'slash', 'page-of-total') or{" "}
          <code>template</code> ("Pg {`{page}`} / {`{total}`}").
        </li>
        <li>
          <code>format</code> ('arabic', 'roman-upper', 'roman-lower').
        </li>
        <li>
          <code>scope</code> ('all', 'first-only', 'except-first', or [2,3,5]).
        </li>
        <li>
          <code>y</code>, <code>offsetX</code>: Custom positioning.
        </li>
        <li>
          <code>style</code>: TextStyle object.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfDocument
  pageNumbers={{
    enabled: true,
    position: "footer",
    align: "right",
    preset: "page-slash-total",
    scope: "except-first",
    format: "arabic",
    style: { fontSize: 9, color: "#666" }
  }}
>`}
      />

      <h4>Center Label (Watermark)</h4>
      <ul className="list-disc">
        <li>Same positioning and scope logic as Page Numbers.</li>
        <li>
          <code>text</code>: The string to display.
        </li>
        <li>
          <code>position</code>, <code>scope</code>, <code>y</code>,{" "}
          <code>offsetX</code>, <code>style</code>.
        </li>
      </ul>
      <CodeBlock
        code={`<PdfDocument
  centerLabel={{
    enabled: true,
    text: "CONFIDENTIAL",
    position: "header",
    scope: "all",
    style: { color: "red", fontSize: 12 }
  }}
>`}
      />

      <h4>Custom Headers & Footers</h4>
      <p>For complete control, use custom render functions:</p>
      <CodeBlock
        code={`<PdfDocument
  header={(renderer, page, total) => {
    const pdf = renderer.instance;
    pdf.setFontSize(10);
    pdf.text("My Company", renderer.contentLeft, 10);
    pdf.text(\`Page \${page}\`, renderer.contentRight, 10, { align: 'right' });
  }}
  footer={(renderer, page, total) => {
    const pdf = renderer.instance;
    pdf.setFontSize(9);
    pdf.text("© 2024 My Company", renderer.contentLeft, renderer.height - 10);
  }}
>`}
      />

      <div className="hr"></div>

      <h3>Advanced Features</h3>

      <h4>Recurring Items</h4>
      <p>Make any component appear on multiple pages:</p>
      <CodeBlock
        code={`{/* Appear on all pages */}
<PdfText showInAllPages scope="all">
  This appears on every page
</PdfText>

{/* Appear on all pages except first */}
<PdfImage 
  src="logo.png" 
  showInAllPages 
  scope="except-first"
  x={10} 
  y={10} 
  h={15}
/>

{/* Appear on specific pages */}
<PdfText showInAllPages scope={[2, 3, 5]}>
  Pages 2, 3, and 5 only
</PdfText>`}
      />

      <h4>RGBA Color Support</h4>
      <p>All color props support both hex and RGBA formats:</p>
      <CodeBlock
        code={`<PdfText color="#FF0000">Red text</PdfText>
<PdfText color="rgba(255, 0, 0, 0.5)">Semi-transparent red</PdfText>

<PdfView style={{ fillColor: "rgba(0, 0, 255, 0.1)" }}>
  <PdfText>Semi-transparent blue background</PdfText>
</PdfView>`}
      />

      <h4>Auto-Save</h4>
      <p>Automatically save the PDF when it's generated:</p>
      <CodeBlock
        code={`<PdfDocument
  filename="my-document.pdf"
  autoSave={true}
>
  {/* PDF will automatically download */}
</PdfDocument>`}
      />

      <div className="hr"></div>

      <h3>TypeScript Support</h3>
      <p>
        This library is written in TypeScript and includes complete type
        definitions. All components and props are fully typed for the best
        developer experience.
      </p>
    </div>
  );
};
