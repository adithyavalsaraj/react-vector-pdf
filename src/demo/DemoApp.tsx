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
import { CenterLabelSettings } from "./components/settings/CenterLabelSettings";
import { FooterSettings } from "./components/settings/FooterSettings";
import { HeaderSettings } from "./components/settings/HeaderSettings";
import { ImageSettings } from "./components/settings/ImageSettings";
import { PageNumberSettings } from "./components/settings/PageNumberSettings";
import { TableSettings } from "./components/settings/TableSettings";
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
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    updateItemProps,
    clearAllItems,
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

  /* 
    Updated Logic:
    - 'preview' mode automatically updates via useEffect in useDemoApp (if we set it up that way) or we can manually trigger it.
    - 'code' mode just renders the string.
    - 'download' action is now explicit via button click, regardless of current view mode.
  */
  const handleGenerate = () => {
    // Always trigger download when this function is called (since it's attached to the "Download PDF" button)
    setDownloading(true);
    setTimeout(() => {
      const fname = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      const save = (r: any) => r.save(fname);

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
          footerEnabled={footerEnabled}
          footerText={footerText}
          footerAlign={footerAlign}
          footerColor={footerColor}
          footerFontSize={footerFontSize}
          footerBorder={footerBorder}
          footerBorderColor={footerBorderColor}
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
  };
  const [isStale, setIsStale] = React.useState(false);

  const buildConfig = () => ({
    options: {
      margin: { top: 18, right: 15, bottom: 15, left: 15 },
      font: { size: 12 },
      color: "#111827",
      lineHeight: 1.35,
    },
    header: createHeaderRenderer({
      enabled: headerEnabled,
      text: headerText,
      align: headerAlign,
      color: headerColor,
      fontSize: headerFontSize,
      border: headerBorder,
      borderColor: headerBorderColor,
    }),
    footer: createFooterRenderer({
      enabled: footerEnabled,
      text: footerText,
      align: footerAlign,
      color: footerColor,
      fontSize: footerFontSize,
      border: footerBorder,
      borderColor: footerBorderColor,
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
    setIsStale(false);
  };

  // Effect to keep preview updated when in preview mode
  React.useEffect(() => {
    if (mode === "preview") {
      if (!previewConfig) {
        handleUpdatePreview();
      } else {
        setIsStale(true);
      }
    }
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
  ]);

  // Fixed full height layout
  return (
    <div className="demo-wrap h-screen flex flex-col overflow-hidden">
      {/* HEADER & TABS */}
      <div className="card vstack gap-4 pb-0">
        <div>
          <h1 className="text-xl font-bold">
            react-vector-pdf — Dynamic Builder Demo
          </h1>
          <p className="text-sm text-muted">
            Configure your document layout and content using the builder below.
          </p>
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === "demo" ? (
        <div className="split-layout">
          {/* LEFT PANE: BUILDER & SETTINGS */}
          <div className="pane-left pane-scrollable">
            <div className="vstack gap-4">
              <div className="vstack">
                <div className="hstack justify-between items-center sticky-top">
                  <h3 className="text-sm font-bold uppercase text-muted m-0">
                    Content
                  </h3>
                  <div className="hstack gap-2">
                    <BuilderControls
                      onAddItem={addItem}
                      onClearAll={clearAllItems}
                    />
                  </div>
                </div>
                {items.length > 0 && (
                  <BuilderList
                    items={items}
                    onRemove={removeItem}
                    onUpdate={updateItem}
                    onUpdateProps={updateItemProps}
                  />
                )}
              </div>

              <div className="hr"></div>

              <div className="vstack gap-4">
                <h3 className="text-sm font-bold uppercase text-muted m-0 sticky-top">
                  Global Settings
                </h3>

                <div className="card p-4 border rounded-md">
                  <div className="control">
                    <label htmlFor="filename">Filename</label>
                    <input
                      type="text"
                      id="filename"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="input-sm"
                      placeholder="e.g. document.pdf"
                    />
                  </div>
                </div>

                <HeaderSettings
                  enabled={headerEnabled}
                  setEnabled={setHeaderEnabled}
                  text={headerText}
                  setText={setHeaderText}
                  align={headerAlign}
                  setAlign={setHeaderAlign}
                  color={headerColor}
                  setColor={setHeaderColor}
                  fontSize={headerFontSize}
                  setFontSize={setHeaderFontSize}
                  border={headerBorder}
                  setBorder={setHeaderBorder}
                  borderColor={headerBorderColor}
                  setBorderColor={setHeaderBorderColor}
                  scope={headerScope}
                  setScope={setHeaderScope}
                  customPages={headerCustomPages}
                  setCustomPages={setHeaderCustomPages}
                />

                <FooterSettings
                  enabled={footerEnabled}
                  setEnabled={setFooterEnabled}
                  text={footerText}
                  setText={setFooterText}
                  align={footerAlign}
                  setAlign={setFooterAlign}
                  color={footerColor}
                  setColor={setFooterColor}
                  fontSize={footerFontSize}
                  setFontSize={setFooterFontSize}
                  border={footerBorder}
                  setBorder={setFooterBorder}
                  borderColor={footerBorderColor}
                  setBorderColor={setFooterBorderColor}
                  scope={footerScope}
                  setScope={setFooterScope}
                  customPages={footerCustomPages}
                  setCustomPages={setFooterCustomPages}
                />

                <PageNumberSettings
                  enabled={pnEnabled}
                  setEnabled={setPnEnabled}
                  pos={pnPos}
                  setPos={setPnPos}
                  align={pnAlign}
                  setAlign={setPnAlign}
                  preset={pnPreset}
                  setPreset={setPnPreset}
                  template={pnTemplate}
                  setTemplate={setPnTemplate}
                  format={pnFormat}
                  setFormat={setPnFormat}
                  scope={pnScope}
                  setScope={setPnScope}
                  customPages={pnCustomPages}
                  setCustomPages={setPnCustomPages}
                  y={pnY}
                  setY={setPnY}
                  offsetX={pnOffsetX}
                  setOffsetX={setPnOffsetX}
                  fontSize={pnFontSize}
                  setFontSize={setPnFontSize}
                  color={pnColor}
                  setColor={setPnColor}
                />

                <CenterLabelSettings
                  enabled={clEnabled}
                  setEnabled={setClEnabled}
                  pos={clPos}
                  setPos={setClPos}
                  text={clText}
                  setText={setClText}
                  scope={clScope}
                  setScope={setClScope}
                  customPages={clCustomPages}
                  setCustomPages={setClCustomPages}
                  y={clY}
                  setY={setClY}
                  offsetX={clOffsetX}
                  setOffsetX={setClOffsetX}
                  fontSize={clFontSize}
                  setFontSize={setClFontSize}
                  color={clColor}
                  setColor={setClColor}
                />

                <TableSettings
                  enabled={tableEnabled}
                  setEnabled={setTableEnabled}
                  striped={tableStriped}
                  setStriped={setTableStriped}
                  borderWidth={tableBorderWidth}
                  setBorderWidth={setTableBorderWidth}
                  headerColor={tableHeaderColor}
                  setHeaderColor={setTableHeaderColor}
                />

                <ImageSettings
                  enabled={imgEnabled}
                  setEnabled={setImgEnabled}
                  layout={imgLayout}
                  setLayout={setImgLayout}
                  sizing={imgSizing}
                  setSizing={setImgSizing}
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANE: PREVIEW & CODE */}
          <div className="pane-right">
            {/* Header */}
            <div className="hstack justify-between p-3 border-bottom bg-white justify-center">
              <ViewToggle mode={mode} setMode={setMode} />
              <div className="hstack gap-2">
                <button
                  className={`btn btn-sm ${downloading ? "loading" : ""}`}
                  onClick={handleGenerate}
                  disabled={downloading}
                >
                  {downloading ? "Processing..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative bg-gray-50 px-4 min-h-0">
              {mode === "preview" ? (
                <div className="pane-scrollable p-4 flex flex-col items-center justify-center bg-gray-100">
                  {isStale ? (
                    <div className="vstack gap-2 items-center text-center">
                      <p className="text-muted">Preview is outdated</p>
                      <button className="btn" onClick={handleUpdatePreview}>
                        Generate Preview
                      </button>
                    </div>
                  ) : (
                    previewConfig && (
                      <div className="shadow-lg w-full h-full relative">
                        <PdfPreview {...previewConfig}>
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
                <div className="h-full">
                  <CodeBlock
                    style={{ height: "calc(100vh - 224px)" }}
                    code={generateReactCode(items, {
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
                    })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto w-full p-4 min-h-0">
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              height: "calc(100vh - 174px)",
              overflow: "auto",
            }}
          >
            <DocsContent />
          </div>
        </div>
      )}
    </div>
  );
};
