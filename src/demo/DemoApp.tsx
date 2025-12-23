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
import { ImageSettings } from "./components/settings/ImageSettings";
import { PageNumberSettings } from "./components/settings/PageNumberSettings";
import { TableSettings } from "./components/settings/TableSettings";
import { useDemoApp } from "./hooks/useDemoApp";
import { generateReactCode } from "./utils/codeGenerator";
import { demoFooter, demoHeader, parsePages } from "./utils/pdfHelpers";

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
    imgLayout,
    setImgLayout,
    imgSizing,
    setImgSizing,
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
      const filename = "pdfify-configurable-demo.pdf";
      const save = (r: any) => r.save(filename);

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
  };

  // Effect to keep preview updated when in preview mode
  React.useEffect(() => {
    if (mode === "preview") {
      setPreviewConfig({
        options: {
          margin: { top: 18, right: 15, bottom: 15, left: 15 },
          font: { size: 12 },
          color: "#111827",
          lineHeight: 1.35,
        },
        header: demoHeader,
        footer: demoFooter,
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
                <h3 className="text-sm font-bold uppercase text-muted m-0">
                  Global Settings
                </h3>

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
                  striped={tableStriped}
                  setStriped={setTableStriped}
                  borderWidth={tableBorderWidth}
                  setBorderWidth={setTableBorderWidth}
                  headerColor={tableHeaderColor}
                  setHeaderColor={setTableHeaderColor}
                />

                <ImageSettings
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
                  {previewConfig && (
                    <div className="shadow-lg w-full h-full relative">
                      <PdfPreview {...previewConfig}>
                        <DemoPdfContent items={previewConfig.items} />
                      </PdfPreview>
                    </div>
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
                      clEnabled,
                      clText,
                      clScope,
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
