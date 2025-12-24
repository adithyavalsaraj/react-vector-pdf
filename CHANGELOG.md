# Changelog

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
