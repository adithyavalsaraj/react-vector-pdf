# react-vector-pdf

**Vector-based, React-driven PDF generation.**

[**Live Demo**](https://adithyavalsaraj.github.io/react-vector-pdf/)

`react-vector-pdf` is a React wrapper around **jsPDF** that allows you to build complex, multi-page PDFs using declarative React components. Unlike HTML-to-Canvas solutions, this library renders **selectable, searchable vector text**, resulting in smaller file sizes and crystal-clear output at any zoom level.

## Features

- **Vector Text**: High-quality, selectable, and searchable text (no canvas rasterization).
- **React Component API**: Build PDFs using declarative components like `<PdfDocument>`, `<PdfText>`, `<PdfTable>`, `<PdfView>`, etc.
- **Smart Layout Engine**:
  - **Auto-Paging**: Content that exceeds the page height automatically moves to the next page.
  - **Flow & Absolute Positioning**: Stack elements naturally or place them at fixed coordinates.
- **Advanced Components**:
  - **PdfTable**: Supports auto-wrapping, **row spans**, **col spans**, **vertical alignment**, custom cell styling, **striped rows**, and **intelligent page breaking** (keeps spanned rows together).
  - **PdfImage**: Renders images from URLs with options for flow or absolute positioning. Automatically handles page breaks in flow mode.
  - **PdfList**: Bullet and numbered lists with auto-wrapping and **orphan protection**.
  - **PdfView**: Advanced container with **perfect multi-page spanning**, support for borders, background colors (rendered strictly behind content), and granular **persistent padding** (padding is maintained across page breaks).
- **Global Document Options**:
  - **Formatting**: A4, Letter, custom sizes, portrait/landscape orientation, distinct margins, base fonts.
  - **Headers & Footers**: Custom render functions with full control.
  - **Page Numbering**: Highly configurable (presets, templates, scopes, formats like Roman/Arabic).
  - **Center Labels**: Watermarks or classification labels in header/footer.
  - **Metadata**: Set PDF title, author, subject, and keywords.
- **Recurring Elements**: Make any component appear on all pages or specific pages using `showInAllPages` and `scope`.
- **TypeScript**: Written in TypeScript with complete type definitions.

## Installation

```bash
npm install react-vector-pdf
```

## Quick Start

Wrap your application in the `PdfDocument` component. This component serves as the context provider and renderer.

```tsx
import React from "react";
import { PdfDocument, PdfText, PdfTable } from "react-vector-pdf";

const MyPdf = () => {
  const handleSave = (pdf) => {
    pdf.save("my-document.pdf");
  };

  return (
    <PdfDocument
      onReady={handleSave}
      options={{
        format: "a4", // or "letter", or [width, height] in mm
        orientation: "p", // "p" for portrait, "l" for landscape
        margin: { top: 20, right: 15, bottom: 15, left: 15 },
        font: { size: 12, name: "helvetica" },
        lineHeight: 1.25,
      }}
      metadata={{
        title: "My Document",
        author: "Your Name",
        subject: "Document Subject",
        keywords: ["pdf", "react"],
      }}
    >
      <PdfText fontSize={18} fontStyle="bold" spacingBelow={10}>
        Hello World
      </PdfText>

      <PdfText>This is a vector PDF generated from React components.</PdfText>
    </PdfDocument>
  );
};
```

## Previewing

You can embed a live preview of the PDF using the `PdfPreview` component. This component renders an `iframe` containing the generated PDF blob.

```tsx
import { PdfPreview, PdfText } from "react-vector-pdf";

<PdfPreview width="100%" height={600} options={{ ... }}>
  <PdfText>I am visible in the preview!</PdfText>
</PdfPreview>
```

**Props:**

- All `PdfDocument` props (`options`, `metadata`, `pageNumbers`, `centerLabel`, etc.) are supported and passed through.
- `width` (string | number): Width of the container (default "100%").
- `height` (string | number): Height of the container (default "100%").
- `className` / `style`: Styling for the wrapper div.
- `iframeClassName` / `iframeStyle`: Styling for the internal iframe.

**Note:** Changing props (like options, colors, fonts) will automatically regenerate and update the preview.

## Styling with CSS Classes

You can use standard CSS classes (including generic CSS or utility frameworks like **Tailwind CSS**) to style PDF components using the `className` prop. The library extracts valid styles (colors, fonts, borders, padding, margin) from the class and applies them to the PDF vector output.

```tsx
// Using Tailwind CSS classes
<PdfText className="text-red-600 font-bold text-xl mb-4">
  Styled with Tailwind!
</PdfText>

<PdfView className="border border-gray-300 p-4 bg-gray-50 rounded gap-4">
  <PdfText className="text-gray-800">
    This box uses utility classes for padding, border, and background.
  </PdfText>
  <PdfText>
    Items inside this view are separated by a 1rem (approx 4mm) gap.
  </PdfText>
</PdfView>
```

> **Note**: Properties like `display: flex` or `grid` are **not supported** as PDF layout is strictly standard flow or absolute positioning. However, `gap` **is supported** in `PdfView` to add spacing between flow items. Only box-model properties (padding/margin/border/gap) and typography/color styles are mapped.

## Components

### 1. `PdfDocument`

The main wrapper component that provides context and handles PDF generation.

**Props:**

- `options`: PDF configuration (format, margins, fonts, etc.)
- `metadata`: Document metadata (title, author, subject, keywords)
- `header`: Custom header render function `(renderer, page, total) => void`
- `footer`: Custom footer render function `(renderer, page, total) => void`
- `pageNumbers`: Page numbering configuration
- `centerLabel`: Center label/watermark configuration
- `onReady`: Callback when PDF is ready `(renderer) => void`
- `filename`: Filename for auto-save
- `autoSave`: Automatically save PDF when rendered (default: false)

### 2. `PdfText`

Renders a paragraph of text. Automatically wraps to the content width.

**Props:**

- `fontSize` (number): Font size in points.
- `fontStyle` ('normal' | 'bold' | 'italic' | 'bolditalic'): Font style.
- `color` (string): Hex color (e.g., "#FF0000") or RGBA (e.g., "rgba(255, 0, 0, 0.5)").
- `align` ('left' | 'center' | 'right' | 'justify'): Text alignment.
- `lineHeight` (number): Line height multiplier.
- `spacingBelow` (number): Vertical space (mm) to add after the paragraph.
- `showInAllPages` (boolean): Make this text appear on multiple pages.
- `scope` ('all' | 'first-only' | 'except-first' | number[]): Which pages to show on.

```tsx
<PdfText
  fontSize={14}
  fontStyle="bold"
  color="#333333"
  align="center"
  spacingBelow={5}
>
  I am a centered, bold heading.
</PdfText>;

{
  /* Recurring header on all pages except first */
}
<PdfText showInAllPages scope="except-first" fontSize={10} color="#666">
  Document Header
</PdfText>;
```

### 3. `PdfTable`

A robust table component designed for dynamic data.

**Key Features:**

- **Auto-layout**: Columns can use explicit widths or percentage-based widths.
- **Spanning**: Support for `rowSpan` and `colSpan`.
- **Page Breaking**: Smartly handles page breaks, ensuring rows with rowspans are kept together if possible.
- **Styling**: Supports granular padding (`paddingTop`, `paddingLeft`, etc.) and borders.
- **Alignment**: Supports both horizontal (`align`) and vertical (`verticalAlign`) alignment.
- **Striped Rows**: Alternating row colors for better readability.
- **Header Repeat**: Optionally repeat header row on each page.

**Props:**

- `data`: Array of objects or cell definitions.
- `columns`: Array of column definitions `{ header, accessor, width, align }`.
- `width`: Table width (number or string percentage like "100%").
- `borderWidth`, `borderColor`: Global table border settings.
- `headerStyle`, `rowStyle`: Default styles for headers and rows.
- `cellPadding`: Default padding for cells (number or object).
- `striped` (boolean): Enable alternating row colors.
- `repeatHeader` (boolean): Repeat header on each page (default: true).

**Complex Cell Example:**

```tsx
<PdfTable
  width="100%"
  striped={true}
  repeatHeader={true}
  borderWidth={0.5}
  headerStyle={{ fillColor: "#f3f4f6", fontStyle: "bold" }}
  columns={[
    { header: "ID", accessor: "id", width: 10 },
    { header: "Description", accessor: "desc", width: "auto" },
    { header: "Price", accessor: "price", width: 20, align: "right" },
  ]}
  data={[
    // Simple Row
    { id: 1, desc: "Standard Item", price: "$10.00" },

    // Row with Spans and Custom Styles
    {
      id: "2",
      desc: {
        content: "I span 2 rows and am vertically centered",
        rowSpan: 2,
        style: {
          fillColor: "#e0f2fe",
          align: "center",
          verticalAlign: "middle", // 'top' | 'middle' | 'bottom'
          paddingTop: 5,
        },
      },
      price: "$20.00",
    },
    // Next row must account for the rowspan above
    { id: 3, desc: null, price: "$5.00" },
  ]}
/>
```

### 4. `PdfImage`

Embed images (JPEG/PNG).

**Props:**

- `src` (string): URL or Base64 data of the image.
- `x`, `y` (number): Optional fixed coordinates. If omitted, uses **flow layout**.
- `w`, `h` (number): Explicit dimensions. If only one is provided, aspect ratio is maintained.
- `align` ('left' | 'center' | 'right'): Horizontal alignment (flow mode only).
- `layout` ('fixed' | 'flow'): Layout mode (default: 'fixed').
- `sizing` ('fit' | 'fill' | 'auto'): How to size the image (default: 'fit').
- `showInAllPages` (boolean): Make this image appear on multiple pages.
- `scope` ('all' | 'first-only' | 'except-first' | number[]): Which pages to show on.

**Flow Behavior**: In flow mode, if an image is too tall for the remaining page space, it will automatically trigger a page break and render on the next page.

```tsx
{
  /* Flow layout with auto-sizing */
}
<PdfImage
  src="https://example.com/logo.png"
  h={20}
  align="center"
  layout="flow"
  sizing="fit"
/>;

{
  /* Recurring logo on all pages */
}
<PdfImage src="logo.png" h={15} showInAllPages scope="all" x={10} y={10} />;
```

### 5. `PdfView`

A container component for grouping content, adding borders, backgrounds, or margins/padding. It is the primary container for both flow and absolute layouts.

**Props:**

- `style`: Object with `margin`, `padding` (granular: `marginTop`, `paddingLeft` etc.), `borderWidth`, `borderColor`, `fillColor`, `radius`.
- `x`, `y`, `w`, `h`: Optional props for **absolute positioning**. If provided, the view will be placed at exactly these coordinates.
- `children`: Nested components to render inside the view.
- `showInAllPages` (boolean): Make this view appear on multiple pages.
- `scope` ('all' | 'first-only' | 'except-first' | number[]): Which pages to show on.

```tsx
<PdfView
  style={{
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    borderWidth: 0.2,
    borderColor: "#ccc",
    fillColor: "rgba(240, 240, 240, 0.5)",
  }}
>
  <PdfText>Content inside a styled box.</PdfText>
</PdfView>
```

### 6. `PdfList`

Renders bulleted or numbered lists.

**Props:**

- `items`: Array of strings.
- `ordered`: Boolean. `true` for numbered (1., 2.), `false` for bullets.
- `indent`: Number (mm) for indentation. Default 5.
- `markerWidth`: Number (mm) for the marker area. Default 5.
- `spacing`: Number (mm) for space between items. Default 2.
- `style`: TextStyle object for the list items.

```tsx
<PdfList
  ordered={true}
  indent={10}
  spacing={3}
  items={["First item", "Second item", "Third item"]}
/>
```

## Global Document Features

Configuration is passed via the `PdfDocument` props.

### Page Numbering

Automatically adds page numbers to every page (or specific pages) with full customization.

```tsx
<PdfDocument
  pageNumbers={{
    enabled: true,
    position: "footer",       // 'header' | 'footer'
    align: "right",           // 'left' | 'center' | 'right'
    preset: "page-slash-total", // 'Page 1/10', '1/10', 'Page 1 of 10'
    scope: "except-first",    // 'all' | 'first-only' | 'except-first' | [2,3,5]
    template: "Pg {page} / {total}", // Custom template (overrides preset)
    format: "arabic",         // 'arabic' | 'roman-upper' | 'roman-lower'
    y: 285,                   // Custom Y position (optional)
    offsetX: 0,               // X offset from alignment (optional)
    style: { fontSize: 9, color: "#666" }
  }}
>
```

### Center Label / Watermark

Adds a centered label (e.g., "CONFIDENTIAL") to the header or footer area.

```tsx
<PdfDocument
  centerLabel={{
    enabled: true,
    text: "CONFIDENTIAL",
    position: "header",       // 'header' | 'footer'
    scope: "all",             // 'all' | 'first-only' | 'except-first' | [2,3,5]
    y: 10,                    // Custom Y position (optional)
    offsetX: 0,               // X offset (optional)
    style: { color: "red", fontSize: 12 }
  }}
>
```

### Custom Headers & Footers

For complete control, use custom render functions:

```tsx
<PdfDocument
  header={(renderer, page, total) => {
    const pdf = renderer.instance;

    // Set font and color
    pdf.setFontSize(10);
    pdf.setTextColor("#333");

    // Draw custom header
    pdf.text("My Company", renderer.contentLeft, 10);
    pdf.text(`Page ${page}`, renderer.contentRight, 10, { align: 'right' });

    // Draw a line
    pdf.setDrawColor("#e5e7eb");
    pdf.setLineWidth(0.5);
    pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
  }}
  footer={(renderer, page, total) => {
    const pdf = renderer.instance;
    const y = renderer.height - 10;

    pdf.setFontSize(9);
    pdf.setTextColor("#666");
    pdf.text("© 2024 My Company", renderer.contentLeft, y);
  }}
>
```

### Metadata

Set PDF document metadata for better organization and searchability:

```tsx
<PdfDocument
  metadata={{
    title: "Annual Report 2024",
    author: "John Doe",
    subject: "Financial Analysis",
    keywords: ["finance", "report", "2024", "analysis"]
  }}
>
```

### Page Format & Orientation

Configure page size and orientation:

```tsx
<PdfDocument
  options={{
    format: "a4",           // "a4", "letter", or custom [width, height] in mm
    orientation: "p",       // "p" for portrait, "l" for landscape
    margin: { top: 20, right: 15, bottom: 15, left: 15 },
  }}
>

{/* Custom page size */}
<PdfDocument
  options={{
    format: [210, 297],     // Custom size in mm (width, height)
    orientation: "p",
  }}
>
```

## Advanced Features

### Recurring Items

Make any component appear on multiple pages using `showInAllPages` and `scope`:

```tsx
{
  /* Appear on all pages */
}
<PdfText showInAllPages scope="all">
  This appears on every page
</PdfText>;

{
  /* Appear on all pages except the first */
}
<PdfImage
  src="logo.png"
  showInAllPages
  scope="except-first"
  x={10}
  y={10}
  h={15}
/>;

{
  /* Appear only on first page */
}
<PdfView showInAllPages scope="first-only">
  <PdfText>Cover page content</PdfText>
</PdfView>;

{
  /* Appear on specific pages */
}
<PdfText showInAllPages scope={[2, 3, 5]}>
  This appears only on pages 2, 3, and 5
</PdfText>;
```

### RGBA Color Support

All color props support both hex and RGBA formats:

```tsx
<PdfText color="#FF0000">Red text</PdfText>
<PdfText color="rgba(255, 0, 0, 0.5)">Semi-transparent red text</PdfText>

<PdfView style={{ fillColor: "rgba(0, 0, 255, 0.1)" }}>
  <PdfText>Content with semi-transparent blue background</PdfText>
</PdfView>
```

### Auto-Save

Automatically save the PDF when it's generated:

```tsx
<PdfDocument filename="my-document.pdf" autoSave={true}>
  {/* PDF will automatically download when rendered */}
</PdfDocument>
```

## TypeScript Support

This library is written in TypeScript and includes complete type definitions. All components and props are fully typed for the best developer experience.

```tsx
import { PdfDocument, PdfText, PdfDocumentProps } from "react-vector-pdf";

const MyComponent: React.FC = () => {
  const pdfOptions: PdfDocumentProps["options"] = {
    format: "a4",
    orientation: "p",
    margin: { top: 20, right: 15, bottom: 15, left: 15 },
  };

  return (
    <PdfDocument options={pdfOptions}>
      <PdfText>Fully typed!</PdfText>
    </PdfDocument>
  );
};
```

## License

MIT
