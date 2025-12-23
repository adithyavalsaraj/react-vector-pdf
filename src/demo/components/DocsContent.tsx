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
          text.
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
      <ul className="list-disc">
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
  items={["Item 1", "Item 2"]}
/>`}
      />

      <h4>5. PdfImage</h4>
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
          <code>align</code>: Horizontal alignment (flow mode).
        </li>
        <li>
          <code>flow</code> (boolean): Force flow (default if x/y omitted).
        </li>
      </ul>
      <CodeBlock code={`<PdfImage src="..." align="center" h={30} />`} />

      <h4>6. PdfView</h4>
      <p>
        A container component for grouping content and adding backgrounds or
        borders. Supports both <strong>flow layout</strong> (automatic) and
        <strong>absolute positioning</strong>.
      </p>
      <ul className="list-disc">
        <li>
          <code>style</code>: margin, padding, borderWidth, borderColor,
          fillColor, radius.
        </li>
        <li>
          <code>x</code>, <code>y</code>, <code>w</code>, <code>h</code>:
          Optional coordinates for fixed placement.
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
      <ul className="list-disc">
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
      <ul className="list-disc">
        <li>Same positioning and scope logic as Page Numbers.</li>
        <li>
          <code>text</code>: The string to display.
        </li>
      </ul>
    </div>
  );
};
