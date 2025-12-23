import React from "react";
import { PdfPreview } from "../components/PdfPreview";
import { DemoPdfDocument } from "./DemoPdfDocument";
import { BuilderControls } from "./components/BuilderControls";
import { BuilderList } from "./components/BuilderList";
import { DemoPdfContent } from "./components/DemoPdfContent";
import { DocsContent } from "./components/DocsContent";
import { Tabs } from "./components/Tabs";
import { CenterLabelSettings } from "./components/settings/CenterLabelSettings";
import { ImageSettings } from "./components/settings/ImageSettings";
import { PageNumberSettings } from "./components/settings/PageNumberSettings";
import { TableSettings } from "./components/settings/TableSettings";
import { useDemoApp } from "./hooks/useDemoApp";
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

  const handleGenerate = () => {
    if (mode === "download") {
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
    } else {
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
  };

  return (
    <div className="demo-wrap">
      <div className="card vstack">
        <h1>react-vector-pdf — Dynamic Builder Demo</h1>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "demo" ? (
          <div className="vstack">
            <p>
              Customize page numbers and watermarks below. Use the{" "}
              <strong>Interactive Builder</strong> to add recurring sections
              (e.g. Member Header) that appear on all pages with automatic space
              reservation.
            </p>
            <div className="hr"></div>

            <div className="vstack">
              <h3>Interactive Builder</h3>
              <p>
                Add components and toggle <code>showInAllPages</code> to see
                space reservation in action.
              </p>

              <BuilderControls onAddItem={addItem} onClearAll={clearAllItems} />
              <BuilderList
                items={items}
                onRemove={removeItem}
                onUpdate={updateItem}
                onUpdateProps={updateItemProps}
              />
            </div>

            <div className="hr"></div>

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

            <div className="hr"></div>

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

            <div className="hr"></div>

            <TableSettings
              striped={tableStriped}
              setStriped={setTableStriped}
              borderWidth={tableBorderWidth}
              setBorderWidth={setTableBorderWidth}
              headerColor={tableHeaderColor}
              setHeaderColor={setTableHeaderColor}
            />

            <div className="hr"></div>

            <ImageSettings
              layout={imgLayout}
              setLayout={setImgLayout}
              sizing={imgSizing}
              setSizing={setImgSizing}
            />

            <div className="hr"></div>

            <div className="vstack gap-3 border p-4 rounded bg-gray-50 mt-4">
              <div className="hstack justify-between">
                <div className="vstack gap-1">
                  <h3 className="mb-0">Generate PDF</h3>
                  <p className="text-sm text-muted mb-0">
                    Process current configuration using the core engine.
                  </p>
                </div>
                <div className="hstack gap-2">
                  <select
                    className="select-sm"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                  >
                    <option value="download">Direct Download</option>
                    <option value="preview">Live Preview</option>
                  </select>
                  <button
                    className={`btn btn-sm ${
                      downloading
                        ? "loading"
                        : mode === "preview"
                        ? "outline"
                        : ""
                    }`}
                    onClick={handleGenerate}
                    disabled={downloading}
                  >
                    {downloading
                      ? "Processing..."
                      : mode === "download"
                      ? "Download"
                      : "Preview"}
                  </button>
                </div>
              </div>
            </div>

            {mode === "preview" && previewConfig && (
              <div className="preview-wrap mt-4">
                <div className="hstack justify-between mb-2">
                  <h3 className="mb-0">Live Preview</h3>
                  <div className="hstack gap-2">
                    <input
                      placeholder="W (e.g. 100%)"
                      className="input-sm w-20"
                      value={previewWidth}
                      onChange={(e) => setPreviewWidth(e.target.value)}
                    />
                    <input
                      placeholder="H (e.g. 600px)"
                      className="input-sm w-20"
                      value={previewHeight}
                      onChange={(e) => setPreviewHeight(e.target.value)}
                    />
                  </div>
                </div>
                <PdfPreview
                  width={previewWidth}
                  height={previewHeight}
                  {...previewConfig}
                >
                  <DemoPdfContent items={previewConfig.items} />
                </PdfPreview>
              </div>
            )}

            <div className="preview" style={{ marginTop: 16 }}>
              <p>
                <strong>Preview notes:</strong> This demo draws directly to
                jsPDF using vector text. Configure options above, then generate
                to see headers, footers, page numbers, and center labels
                rendered as real text.
              </p>
            </div>
          </div>
        ) : (
          <DocsContent />
        )}
      </div>
    </div>
  );
};
