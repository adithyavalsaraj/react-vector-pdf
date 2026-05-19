# Changelog

## [0.7.0] - 2026-05-19

### ✨ New Features

#### **Inline Styled Spans & Hyperlinks (`<PdfSpan>`)**

- Added first-class support for `<PdfSpan>` component inside paragraphs.
- Mix distinct colors, styles (`bold`, `italic`, `bolditalic`), and sizes within a single `<PdfText>` paragraph.
- Added native active clickable hyperlink support (`link` prop) that adds interactive navigation overlays directly inside PDF text segments.

#### **Lightweight Vector SVG Elements (`<PdfSvg>`)**

- Added native vector path parsing support via the new `<PdfSvg>` element.
- Seamlessly processes `<path>`, `<line>`, `<rect>`, `<circle>`, `<ellipse>`, `<polygon>`, and `<polyline>` children.
- Draws high-performance vector graphics natively into the PDF stream preserving full vector quality without pixelation.

#### **Flexbox Grid Rows**

- Added side-by-side flex layout modeling (`flex flex-row gap-*`) for sibling containers.
- Siblings divide available content width dynamically inside the horizontal row flexbox zone.

#### **Visual Spacing Debug Boundaries**

- Added `debug={true}` visual overlay options to `<PdfView>`, `<PdfText>`, and `<PdfTable>`.
- Renders outer margins as a dotted red boundary, border boxes and padding as a solid green line, and content zones as a dashed blue container.

### 🐛 Bug Fixes & Refactoring

- **Unified Single-Pass Geometry Breaking**: Consolidated rowspan/colspan table splitting into a single-pass layout algorithm to prevent alignment drifts.
- **Zero `@ts-ignore` Strict Compliance**: Implemented robust TS interfaces extending jsPDF (`jsPDFExtension`, `PdfPage`, `PdfDrawState`) to eliminate all TS ignore statements from the repository.

### 📚 Documentation & Demo Upgrades

- Added dedicated components references for `<PdfSpan>` and `<PdfSvg>` in `README.md`.
- Implemented SSR, Spacing boundaries, and inline spans documentation inside the application's live tab (`DocsContent.tsx`).
- Created a beautifully styled interactive showcase in the builder featuring multi-column flex rows, debug overlays, clickable hyperlinks, inline styles, and SVG stars right on initial load.

## [0.6.1] - 2025-12-26

### ✨ New Features

#### **CSS ClassName Support**

- **Added `className` prop to all PDF components** (`PdfText`, `PdfView`, `PdfTable`, `PdfImage`, `PdfList`)
- **New `useClassStyles` hook** that converts CSS classes to PDF-compatible properties
- **Full Tailwind CSS support** and other utility-first CSS frameworks
- **Automatic style conversion**:
  - Pixels (px) → Millimeters (mm) for dimensions and spacing
  - Pixels (px) → Points (pt) for font sizes
  - CSS color formats → PDF color formats (hex and RGBA)
  - Font weight/style → PDF font styles (normal/bold/italic/bolditalic)
- **Supported CSS properties**:
  - Typography: `color`, `font-size`, `font-weight`, `font-style`, `text-align`, `line-height`
  - Box model: `padding-*`, `margin-*`, `border-width`, `border-color`, `border-radius`
  - Layout: `width`, `height`, `gap` (PdfView only)
  - Background: `background-color` (with RGBA support)
- **Validation system** that warns about unsupported CSS properties (shadows, transforms, flex/grid, etc.)
- **Property priority**: Direct props override `className` styles for fine-grained control

#### **Gap Support in PdfView**

- Added `gap` property to `PdfView` component
- Automatically adds spacing between child elements in flow layout
- Supports both `className` (e.g., `gap-4` in Tailwind) and direct `style` prop
- Works seamlessly with multi-page spanning

#### **Enhanced Documentation**

- Comprehensive CSS property mapping table in README
- Detailed "How It Works" section explaining the style conversion process
- Clear examples of className usage with Tailwind CSS
- Updated all component documentation with `className` and `style` props
- Added unsupported properties list with explanations

### 🐛 Bug Fixes

- Fixed default padding logic in `PdfView` to avoid conflicts with `className`-based padding
- Improved style precedence: direct props now properly override className styles
- Fixed padding inheritance for tables when using `className`

### 📚 Documentation

- Added "Supported CSS Properties" section with conversion table
- Added "Unsupported Properties" list with console warning details
- Enhanced component props documentation to include `className` and `style`
- Updated examples to showcase CSS framework integration
- Added "How It Works" technical explanation for className support

### 🔧 Internal Improvements

- Implemented `useClassStyles` hook with hidden DOM element for style computation
- Added comprehensive CSS property parsers (color, padding, margin, dimensions)
- Improved type safety with `ResolvedStyle` type combining TextStyle, BoxStyle, and ViewStyle
- Enhanced validation system for CSS properties

---

# [0.6.0](https://github.com/adithyavalsaraj/react-vector-pdf/compare/v0.5.1...v0.6.0) (2025-12-24)

### Bug Fixes & Rendering Improvements

- **core:** reimplemented rendering engine with "Safe Stream Injection" to fix background z-index issues and threaded state corruption.
- **core:** added "Indentation Stack" to persist padding and indentation across page breaks for multi-page `PdfView` components.
- **PdfView:** fixed height clamping and background drawing coordinates for views that span 3+ pages.
- **PdfList:** fixed orphaned bullet points by adding preemptive space checking before drawing markers.
- **PdfTable:** improved visibility of striped rows by darkening the default alternate row color.
- **layout:** improved stability of infinite loop detection and page breaking logic.

# [0.5.0](https://github.com/adithyavalsaraj/react-vector-pdf/compare/v0.3.8...v0.5.0) (2025-12-23)

### Features

- improve demo UI and global settings functionality ([13e8923](https://github.com/adithyavalsaraj/react-vector-pdf/commit/13e8923b0a5a9f1b493b4704f001fa01f4762ebe))
- rgba support, recurring items, and refactored demo app with tabs ([e4edbac](https://github.com/adithyavalsaraj/react-vector-pdf/commit/e4edbacb0dca374380f2e341bfa825beb48ea359))

## [0.3.8](https://github.com/adithyavalsaraj/react-vector-pdf/compare/v0.3.7...v0.3.8) (2025-12-22)

## [0.3.7](https://github.com/adithyavalsaraj/react-vector-pdf/compare/v0.3.2...v0.3.7) (2025-12-22)
