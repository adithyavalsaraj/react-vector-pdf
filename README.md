# react-vector-pdf

**Vector-based, React-driven PDF generation.**

`react-vector-pdf` is a React wrapper around **jsPDF** that allows you to build complex, multi-page PDFs using declarative React components. Unlike HTML-to-Canvas solutions, this library renders **selectable, searchable vector text**, resulting in smaller file sizes and crystal-clear output at any zoom level.

## Features

- **Vector Text**: High-quality, selectable, and searchable text (no canvas rasterization).
- **React Component API**: Build PDFs using declarative components like `<PdfDocument>`, `<PdfText>`, `<PdfTable>`, `<PdfView>`, etc.
- **Smart Layout Engine**:
  - **Auto-Paging**: Content that exceeds the page height automatically moves to the next page.
  - **Flow & Absolute Positioning**: Stack elements naturally or place them at fixed coordinates.
- **Advanced Components**:
  - **PdfTable**: Supports auto-wrapping, **row spans**, **col spans**, **vertical alignment**, custom cell styling, and **intelligent page breaking** (keeps spanned rows together).
  - **PdfImage**: Renders images from URLs with options for flow or absolute positioning. Automatically handles page breaks in flow mode.
  - **PdfList**: Bullet and numbered lists with auto-wrapping.
  - **PdfView/PdfBox**: Container components with support for borders, background colors, and granular **padding/margin** (e.g., `paddingTop`, `marginBottom`).
- **Global Document Options**:
  - **Formatting**: A4, Letter, distinct margins, base fonts.
  - **Headers & Footers**: Custom render functions.
  - **Page Numbering**: Highly configurable (presets, templates, scopes, formats like Roman/Arabic).
  - **Center Labels**: Watermarks or classification labels in header/footer.
  - **Metadata**: Set PDF title, author, subject, and keywords.

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
        margin: { top: 20, right: 15, bottom: 15, left: 15 },
        font: { size: 12, name: "helvetica" }, // default font
        lineHeight: 1.25,
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

63:
64: ## Previewing
65:
66: You can embed a live preview of the PDF using the `PdfPreview` component. This component renders an `iframe` containing the generated PDF blob.
67:
68: `tsx
69: import { PdfPreview, PdfText } from "react-vector-pdf";
70: 
71: <PdfPreview width="100%" height={600} options={{ ... }}>
72:   <PdfText>I am visible in the preview!</PdfText>
73: </PdfPreview>
74: `
75:
76: **Props:**
77:
78: - All `PdfDocument` props (`options`, `metadata`, `pageNumbers`, `centerLabel`, etc.) are supported and passed through.
79: - `width` (string | number): Width of the container (default "100%").
80: - `height` (string | number): Height of the container (default "100%").
81: - `className` / `style`: Styling for the wrapper div.
82: - `iframeClassName` / `iframeStyle`: Styling for the internal iframe.
83:
84: **Note:** Changing props (like options, colors, fonts) will automatically regenerate and update the preview.
85:
86: ## Components

## Components

### 1. `PdfText`

Renders a paragraph of text. Automatically wraps to the content width.

**Props:**

- `fontSize` (number): Font size in points.
- `fontStyle` ('normal' | 'bold' | 'italic' | 'bolditalic'): Font style.
- `color` (string): Hex color code (e.g., "#FF0000").
- `align` ('left' | 'center' | 'right' | 'justify'): Text alignment.
- `lineHeight` (number): Line height multiplier.
- `spacingBelow` (number): Vertical space (mm) to add after the paragraph.

```tsx
<PdfText
  fontSize={14}
  fontStyle="bold"
  color="#333333"
  align="center"
  spacingBelow={5}
>
  I am a centered, bold heading.
</PdfText>
```

### 2. `PdfTable`

A robust table component designed for dynamic data.

**Key Features:**

- **Auto-layout**: Columns can use explicit widths or percentage-based widths.
- **Spanning**: Support for `rowSpan` and `colSpan`.
- **Page Breaking**: Smartly handles page breaks, ensuring rows with rowspans are kept together if possible.
- **Styling**: Supports granular padding (`paddingTop`, `paddingLeft`, etc.) and borders.
- **Alignment**: Supports both horizontal (`align`) and vertical (`verticalAlign`) alignment.

**Props:**

- `data`: Array of objects or cell definitions.
- `columns`: Array of column definitions `{ header, accessor, width, align }`.
- `width`: Table width (number or string percentage like "100%").
- `borderWidth`, `borderColor`: Global table border settings.
- `headerStyle`, `rowStyle`: Default styles for headers and rows.
- `cellPadding`: Default padding for cells (number or object).

**Complex Cell Example:**

```tsx
<PdfTable
  width="100%"
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
      id: "2", // Simple cell
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

### 3. `PdfImage`

Embed images (JPEG/PNG).

**Props:**

- `src` (string): URL or Base64 data of the image.
- `x`, `y` (number): Optional fixed coordinates. If omitted, uses **flow layout**.
- `w`, `h` (number): Explicit dimensions. If only one is provided, aspect ratio is maintained.
- `align` ('left' | 'center' | 'right'): Horizontal alignment (flow mode only).
- `flow` (boolean): Force flow mode if necessary.

**Flow Behavior**: In flow mode, if an image is too tall for the remaining page space, it will automatically trigger a page break and render on the next page.

```tsx
<PdfImage src="https://example.com/logo.png" h={20} align="center" />
```

### 4. `PdfView` & `PdfBox`

Containers for grouping content, adding borders, backgrounds, or margins/padding.

`PdfView` is akin to a block-level `div`, and `PdfBox` is similar but allows explicit positioning.

**Styling Support:**

- `margin` / `padding`: Shorthand (number or object `{top, right...}`).
- **Granular Props**: `marginTop`, `marginBottom`, `paddingLeft`, `paddingRight`, etc.
- `borderWidth`, `borderColor`: Draw borders.
- `fillColor`: Background color.

```tsx
<PdfView
  style={{
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    borderWidth: 0.2,
    borderColor: "#ccc",
  }}
>
  <PdfText>Content inside a styled box.</PdfText>
</PdfView>
```

### 5. `PdfList`

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
  items={["First item", "Second item"]}
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
    align: "right",
    format: "page-slash-total", // 'Page 1/10', '1/10', 'Page 1 of 10'
    scope: "except-first",    // 'all' | 'first-only' | 'except-first' | 'custom'
    template: "Pg {page} / {total}", // Custom template support
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
    position: "header",
    scope: "all",
    style: { color: "red", fontSize: 12 }
  }}
>
```

## License

MIT
