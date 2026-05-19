import React from "react";
import { PdfPreview } from "../components/PdfPreview";
import { DemoPdfDocument } from "./DemoPdfDocument";
import { BuilderControls } from "./components/BuilderControls";
import { BuilderList } from "./components/BuilderList";
import { CodeBlock } from "./components/CodeBlock";
import { DemoPdfContent } from "./components/DemoPdfContent";
import { DocsContent } from "./components/DocsContent";
import { Tabs } from "./components/Tabs";
import { ViewToggle } from "./components/ViewToggle";
import { SettingsPanel } from "./components/settings/SettingsPanel";
import { useDemoApp } from "./hooks/useDemoApp";
import { generateReactCode } from "./utils/codeGenerator";
import {
  createFooterRenderer,
  createHeaderRenderer,
  parsePages,
} from "./utils/pdfHelpers";

export const DemoApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    mode,
    setMode,
    downloading,
    setDownloading,
    previewConfig,
    setPreviewConfig,
    previewWidth,
    setPreviewWidth,
    previewHeight,
    setPreviewHeight,
    pnEnabled,
    setPnEnabled,
    pnPos,
    setPnPos,
    pnAlign,
    setPnAlign,
    pnPreset,
    setPnPreset,
    pnTemplate,
    setPnTemplate,
    pnFormat,
    setPnFormat,
    pnScope,
    setPnScope,
    pnCustomPages,
    setPnCustomPages,
    pnY,
    setPnY,
    pnOffsetX,
    setPnOffsetX,
    pnFontSize,
    setPnFontSize,
    pnColor,
    setPnColor,
    clEnabled,
    setClEnabled,
    clPos,
    setClPos,
    clText,
    setClText,
    clScope,
    setClScope,
    clCustomPages,
    setClCustomPages,
    clY,
    setClY,
    clOffsetX,
    setClOffsetX,
    clFontSize,
    setClFontSize,
    clColor,
    setClColor,
    imgEnabled,
    setImgEnabled,
    imgLayout,
    setImgLayout,
    imgSizing,
    setImgSizing,
    tableEnabled,
    setTableEnabled,
    tableStriped,
    setTableStriped,
    tableBorderWidth,
    setTableBorderWidth,
    tableHeaderColor,
    setTableHeaderColor,

    // Metadata
    metadata,
    setMetadata,
    layout,
    setLayout,
    margins,
    setMargins,
    typography,
    setTypography,
    baseColor,
    setBaseColor,
    autoSave,
    setAutoSave,

    // Builder state
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    updateItemProps,
    clearAllItems,

    // Header & Footer settings
    headerEnabled,
    setHeaderEnabled,
    headerText,
    setHeaderText,
    footerEnabled,
    setFooterEnabled,
    footerText,
    setFooterText,
    headerAlign,
    setHeaderAlign,
    headerColor,
    setHeaderColor,
    headerFontSize,
    setHeaderFontSize,
    headerBorder,
    setHeaderBorder,
    headerBorderColor,
    setHeaderBorderColor,
    headerScope,
    setHeaderScope,
    headerCustomPages,
    setHeaderCustomPages,
    footerAlign,
    setFooterAlign,
    footerColor,
    setFooterColor,
    footerFontSize,
    setFooterFontSize,
    footerBorder,
    setFooterBorder,
    footerBorderColor,
    setFooterBorderColor,
    footerScope,
    setFooterScope,
    footerCustomPages,
    setFooterCustomPages,
    filename,
    setFilename,
  } = useDemoApp();

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      const fname = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      const save = (renderer: any) => renderer.save(fname);

      const RootDoc: React.FC = () => (
        <DemoPdfDocument
          metadata={metadata}
          layout={layout}
          margins={margins}
          typography={typography}
          baseColor={baseColor}
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
          items={items}
          onReady={save}
          filename={fname}
          imgLayout={imgEnabled ? imgLayout : undefined}
          imgSizing={imgEnabled ? imgSizing : undefined}
          tableStriped={tableEnabled ? tableStriped : undefined}
          tableBorderWidth={tableEnabled ? tableBorderWidth : undefined}
          tableHeaderColor={tableEnabled ? tableHeaderColor : undefined}
          headerEnabled={headerEnabled}
          headerText={headerText}
          headerAlign={headerAlign}
          headerColor={headerColor}
          headerFontSize={headerFontSize}
          headerBorder={headerBorder}
          headerBorderColor={headerBorderColor}
          headerScope={headerScope}
          headerCustomPages={headerCustomPages}
          footerEnabled={footerEnabled}
          footerText={footerText}
          footerAlign={footerAlign}
          footerColor={footerColor}
          footerFontSize={footerFontSize}
          footerBorder={footerBorder}
          footerBorderColor={footerBorderColor}
          footerScope={footerScope}
          footerCustomPages={footerCustomPages}
        />
      );

      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);
      import("react-dom/client").then(({ createRoot }) => {
        const root = createRoot(tempContainer);
        root.render(<RootDoc />);
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(tempContainer);
          setDownloading(false);
        }, 120);
      });
    }, 60);
  };

  const [isStale, setIsStale] = React.useState(false);
  const [previewKey, setPreviewKey] = React.useState(0);
  const [sidebarTab, setSidebarTab] = React.useState<"builder" | "settings">(
    "builder",
  );
  const [mobileView, setMobileView] = React.useState<
    "builder" | "preview" | "code"
  >("builder");

  const buildConfig = () => ({
    autoSave,
    metadata,
    options: {
      margin: margins,
      format: layout.format === "custom" ? [210, 297] : layout.format,
      orientation: layout.orientation,
      font: { size: typography.fontSize, name: typography.fontName },
      color: baseColor,
      lineHeight: typography.lineHeight,
    },
    header: createHeaderRenderer({
      enabled: headerEnabled,
      text: headerText,
      align: headerAlign,
      color: headerColor,
      fontSize: headerFontSize,
      border: headerBorder,
      borderColor: headerBorderColor,
      scope: (headerScope === "custom"
        ? parsePages(headerCustomPages)
        : headerScope) as any,
    }),
    footer: createFooterRenderer({
      enabled: footerEnabled,
      text: footerText,
      align: footerAlign,
      color: footerColor,
      fontSize: footerFontSize,
      border: footerBorder,
      borderColor: footerBorderColor,
      scope: (footerScope === "custom"
        ? parsePages(footerCustomPages)
        : footerScope) as any,
    }),
    pageNumbers: {
      enabled: pnEnabled,
      position: pnPos,
      align: pnAlign,
      preset: pnTemplate ? undefined : pnPreset,
      template: pnTemplate || undefined,
      format: pnFormat,
      scope: (pnScope === "custom"
        ? parsePages(pnCustomPages)
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
        ? parsePages(clCustomPages)
        : clScope) as any,
      y: clY ? Number(clY) : undefined,
      offsetX: clOffsetX ? Number(clOffsetX) : undefined,
      style: {
        fontSize: clFontSize ? Number(clFontSize) : undefined,
        color: clColor || undefined,
      },
    },
    items,
    width: previewWidth,
    height: previewHeight,
  });

  const handleUpdatePreview = () => {
    setPreviewConfig(buildConfig());
    setPreviewKey((k) => k + 1);
    setIsStale(false);
  };

  React.useEffect(() => {
    if (mode === "preview") {
      // Always regenerate immediately on any config change
      setPreviewConfig(buildConfig());
      setPreviewKey((k) => k + 1);
      setIsStale(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    pnEnabled,
    pnPos,
    pnAlign,
    pnPreset,
    pnTemplate,
    pnFormat,
    pnScope,
    pnCustomPages,
    pnY,
    pnOffsetX,
    pnFontSize,
    pnColor,
    clEnabled,
    clPos,
    clText,
    clScope,
    clCustomPages,
    clY,
    clOffsetX,
    clFontSize,
    clColor,
    items,
    previewWidth,
    previewHeight,
    headerEnabled,
    headerText,
    headerAlign,
    headerColor,
    headerFontSize,
    headerBorder,
    headerBorderColor,
    headerScope,
    headerCustomPages,
    footerEnabled,
    footerText,
    footerAlign,
    footerColor,
    footerFontSize,
    footerBorder,
    footerBorderColor,
    footerScope,
    footerCustomPages,
    filename,
    imgLayout,
    imgSizing,
    tableStriped,
    tableBorderWidth,
    tableHeaderColor,
    metadata,
    layout,
    margins,
    typography,
    baseColor,
    autoSave,
  ]);

  const resetAllSettings = () => {
    setMetadata({
      title: "Document Title",
      author: "Author",
      subject: "Subject",
      keywords: "",
    });
    setLayout({ format: "a4", orientation: "p" });
    setMargins({ top: 15, right: 15, bottom: 15, left: 15 });
    setTypography({ fontSize: 11, lineHeight: 1.3, fontName: "helvetica" });
    setBaseColor("#1e293b");
    setAutoSave(false);

    setPnEnabled(true);
    setPnPos("footer");
    setPnAlign("right");
    setPnPreset("page-slash-total");
    setPnTemplate("");
    setPnFormat("arabic");
    setPnScope("all");
    setPnCustomPages("");
    setPnY("");
    setPnOffsetX("");
    setPnFontSize("9");
    setPnColor("#475569");

    setClEnabled(false);
    setClPos("header");
    setClText("DRAFT");
    setClScope("all");
    setClCustomPages("");
    setClY("");
    setClOffsetX("");
    setClFontSize("9");
    setClColor("#94a3b8");

    setHeaderEnabled(true);
    setHeaderText("react-vector-pdf Studio");
    setHeaderAlign("left");
    setHeaderColor("#1e293b");
    setHeaderFontSize("9");
    setHeaderBorder(true);
    setHeaderBorderColor("#e2e8f0");
    setHeaderScope("all");
    setHeaderCustomPages("");

    setFooterEnabled(false);
    setFooterText("");
    setFooterAlign("left");
    setFooterColor("");
    setFooterFontSize("");
    setFooterBorder(false);
    setFooterBorderColor("");
    setFooterScope("all");
    setFooterCustomPages("");

    setImgEnabled(false);
    setImgLayout("fixed");
    setImgSizing("fit");
    setTableEnabled(false);
    setTableStriped(false);
    setTableBorderWidth("0.1");
    setTableHeaderColor("");
    setFilename("react-vector-pdf-spec");
  };

  const codeString = generateReactCode(items, {
    metadata,
    layout,
    margins,
    typography,
    baseColor,
    autoSave,
    pnEnabled,
    pnPos,
    pnAlign,
    pnScope,
    pnCustomPages,
    pnY,
    pnOffsetX,
    pnFontSize,
    pnColor,
    pnPreset,
    pnTemplate,
    pnFormat,
    clEnabled,
    clText,
    clScope,
    clCustomPages,
    clY,
    clOffsetX,
    clFontSize,
    clColor,
    clPos,
    headerEnabled,
    headerText,
    headerAlign,
    headerColor,
    headerFontSize,
    headerBorder,
    headerBorderColor,
    footerEnabled,
    footerText,
    footerAlign,
    footerColor,
    footerFontSize,
    footerBorder,
    footerBorderColor,
    imgLayout,
    imgSizing,
    tableStriped,
    tableBorderWidth,
    tableHeaderColor,
  });

  return (
    <div className="app-wrapper">
      {/* HEADER COMPONENT */}
      <header className="app-header shadow-sm">
        <div className="header-brand">
          <div className="brand-logo-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="logo-svg"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="brand-meta">
            <span className="brand-title">react-vector-pdf</span>
            <span className="brand-subtitle">Design Studio Pro</span>
          </div>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="header-actions"></div>
      </header>

      {/* CORE WORKSPACE */}
      {activeTab === "demo" ? (
        <main className={`app-main premium-split mobile-view-${mobileView}`}>
          {/* Mobile Workspace Toggle Dock */}
          <div className="mobile-view-tabs">
            <button
              className={`mobile-tab-btn ${mobileView === "builder" ? "active" : ""}`}
              onClick={() => setMobileView("builder")}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <span>Controls</span>
            </button>
            <button
              className={`mobile-tab-btn ${mobileView === "preview" ? "active" : ""}`}
              onClick={() => setMobileView("preview")}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Live PDF</span>
            </button>
            <button
              className={`mobile-tab-btn ${mobileView === "code" ? "active" : ""}`}
              onClick={() => setMobileView("code")}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>React Code</span>
            </button>
          </div>

          {/* SIDEBAR EDIT PANEL */}
          <aside className="pane-sidebar custom-scrollbar">
            {/* Sidebar Navigation Tabs */}
            <div className="sidebar-tabs-toggle mb-2">
              <button
                className={`sidebar-tab-btn ${sidebarTab === "builder" ? "active" : ""}`}
                onClick={() => setSidebarTab("builder")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Canvas Builder</span>
              </button>
              <button
                className={`sidebar-tab-btn ${sidebarTab === "settings" ? "active" : ""}`}
                onClick={() => setSidebarTab("settings")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Studio Settings</span>
              </button>
            </div>

            {sidebarTab === "builder" ? (
              <>
                <div className="sidebar-section">
                  <div className="section-title-bar">
                    <h3 className="section-category-title">Canvas Elements</h3>
                    <span className="section-counter-badge">
                      {items.length} Blocks
                    </span>
                  </div>
                  <BuilderControls
                    onAddItem={addItem}
                    onClearAll={clearAllItems}
                  />
                </div>

                <div className="sidebar-section mt-1">
                  <BuilderList
                    items={items}
                    onRemove={removeItem}
                    onUpdate={updateItem}
                    onUpdateProps={updateItemProps}
                  />
                </div>
              </>
            ) : (
              <div className="sidebar-section">
                <SettingsPanel
                  filename={filename}
                  setFilename={setFilename}
                  metadata={metadata}
                  setMetadata={setMetadata}
                  layout={layout}
                  setLayout={setLayout}
                  margins={margins}
                  setMargins={setMargins}
                  typography={typography}
                  setTypography={setTypography}
                  baseColor={baseColor}
                  setBaseColor={setBaseColor}
                  autoSave={autoSave}
                  setAutoSave={setAutoSave}
                  headerEnabled={headerEnabled}
                  setHeaderEnabled={setHeaderEnabled}
                  headerText={headerText}
                  setHeaderText={setHeaderText}
                  headerAlign={headerAlign}
                  setHeaderAlign={setHeaderAlign}
                  headerColor={headerColor}
                  setHeaderColor={setHeaderColor}
                  headerFontSize={headerFontSize}
                  setHeaderFontSize={setHeaderFontSize}
                  headerBorder={headerBorder}
                  setHeaderBorder={setHeaderBorder}
                  headerBorderColor={headerBorderColor}
                  setHeaderBorderColor={setHeaderBorderColor}
                  footerEnabled={footerEnabled}
                  setFooterEnabled={setFooterEnabled}
                  footerText={footerText}
                  setFooterText={setFooterText}
                  footerAlign={footerAlign}
                  setFooterAlign={setFooterAlign}
                  footerColor={footerColor}
                  setFooterColor={setFooterColor}
                  footerFontSize={footerFontSize}
                  setFooterFontSize={setFooterFontSize}
                  footerBorder={footerBorder}
                  setFooterBorder={setFooterBorder}
                  footerBorderColor={footerBorderColor}
                  setFooterBorderColor={setFooterBorderColor}
                  pnEnabled={pnEnabled}
                  setPnEnabled={setPnEnabled}
                  pnPos={pnPos}
                  setPnPos={setPnPos}
                  pnAlign={pnAlign}
                  setPnAlign={setPnAlign}
                  pnPreset={pnPreset}
                  setPnPreset={setPnPreset}
                  pnTemplate={pnTemplate}
                  setPnTemplate={setPnTemplate}
                  pnFormat={pnFormat}
                  setPnFormat={setPnFormat}
                  pnY={pnY}
                  setPnY={setPnY}
                  pnOffsetX={pnOffsetX}
                  setPnOffsetX={setPnOffsetX}
                  pnFontSize={pnFontSize}
                  setPnFontSize={setPnFontSize}
                  pnColor={pnColor}
                  setPnColor={setPnColor}
                  clEnabled={clEnabled}
                  setClEnabled={setClEnabled}
                  clPos={clPos}
                  setClPos={setClPos}
                  clText={clText}
                  setClText={setClText}
                  clY={clY}
                  setClY={setClY}
                  clOffsetX={clOffsetX}
                  setClOffsetX={setClOffsetX}
                  clFontSize={clFontSize}
                  setClFontSize={setClFontSize}
                  clColor={clColor}
                  setClColor={setClColor}
                  tableEnabled={tableEnabled}
                  setTableEnabled={setTableEnabled}
                  tableStriped={tableStriped}
                  setTableStriped={setTableStriped}
                  tableBorderWidth={tableBorderWidth}
                  setTableBorderWidth={setTableBorderWidth}
                  tableHeaderColor={tableHeaderColor}
                  setTableHeaderColor={setTableHeaderColor}
                  imgEnabled={imgEnabled}
                  setImgEnabled={setImgEnabled}
                  imgLayout={imgLayout}
                  setImgLayout={setImgLayout}
                  imgSizing={imgSizing}
                  setImgSizing={setImgSizing}
                  onReset={resetAllSettings}
                />
              </div>
            )}
          </aside>

          {/* VISUAL CANVAS & OUTPUT ZONE */}
          <section className="pane-canvas flex flex-col">
            <div className="canvas-header-bar">
              <ViewToggle mode={mode} setMode={setMode} />
            </div>

            <div className="canvas-body custom-scrollbar">
              {mode === "preview" ? (
                <div className="pdf-viewport">
                  {isStale ? (
                    <div className="premium-empty-state outline border p-5 max-w-sm rounded bg-white shadow-sm">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-primary mb-2 animate-pulse"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                      <p className="empty-title">Changes Pending</p>
                      <p className="empty-subtitle">
                        Click the build button below to regenerate the active
                        PDF preview sheet.
                      </p>
                      <button
                        className="btn btn-primary btn-sm mt-3 w-full"
                        onClick={handleUpdatePreview}
                      >
                        Regenerate Sheet
                      </button>
                    </div>
                  ) : (
                    previewConfig && (
                      <div className="pdf-paper shadow-premium">
                        <PdfPreview key={previewKey} {...previewConfig}>
                          <DemoPdfContent
                            items={previewConfig.items}
                            imgLayout={imgEnabled ? imgLayout : undefined}
                            imgSizing={imgEnabled ? imgSizing : undefined}
                            tableStriped={
                              tableEnabled ? tableStriped : undefined
                            }
                            tableBorderWidth={
                              tableEnabled ? tableBorderWidth : undefined
                            }
                            tableHeaderColor={
                              tableEnabled ? tableHeaderColor : undefined
                            }
                          />
                        </PdfPreview>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="code-block-viewer-wrapper">
                  <CodeBlock code={codeString} />
                </div>
              )}
            </div>
          </section>
        </main>
      ) : (
        /* DOCUMENTATION INTERFACE */
        <main className="app-main documentation-container custom-scrollbar">
          <div className="docs-workspace">
            {/* Navigatable Table of Contents Sidebar */}
            <aside className="docs-toc-sidebar">
              <div className="toc-title">Documentation</div>
              <nav className="toc-nav">
                <a href="#features" className="toc-link">
                  Features
                </a>

                <div className="toc-group">
                  <span className="toc-group-title">Components</span>
                  <a href="#pdfdocument" className="toc-link">
                    PdfDocument
                  </a>
                  <a href="#pdftext" className="toc-link">
                    PdfText
                  </a>
                  <a href="#pdfpreview" className="toc-link">
                    PdfPreview
                  </a>
                  <a href="#pdftable" className="toc-link">
                    PdfTable
                  </a>
                  <a href="#pdflist" className="toc-link">
                    PdfList
                  </a>
                  <a href="#pdfimage" className="toc-link">
                    PdfImage
                  </a>
                  <a href="#pdfview" className="toc-link">
                    PdfView
                  </a>
                  <a href="#pdfspan" className="toc-link">
                    PdfSpan
                  </a>
                  <a href="#pdfsvg" className="toc-link">
                    PdfSvg
                  </a>
                </div>

                <a href="#debug-spacing" className="toc-link">
                  Debug Overlays
                </a>
                <a href="#css-classes" className="toc-link">
                  CSS Styling
                </a>
                <a href="#global-props" className="toc-link">
                  Global Props
                </a>

                <div className="toc-group">
                  <span className="toc-group-title">Advanced</span>
                  <a href="#recurring" className="toc-link">
                    Recurring Items
                  </a>
                  <a href="#rgba" className="toc-link">
                    RGBA Colors
                  </a>
                  <a href="#auto-save" className="toc-link">
                    Auto-Save
                  </a>
                  <a href="#custom-export" className="toc-link">
                    Custom Exporter
                  </a>
                </div>

                <a href="#typescript" className="toc-link">
                  TypeScript
                </a>
              </nav>
            </aside>

            {/* Scrollable Documentation Content */}
            <div className="docs-viewer-container">
              <DocsContent />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
