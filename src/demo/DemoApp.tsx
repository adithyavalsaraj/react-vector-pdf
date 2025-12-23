import React from "react";
import { PdfPreview } from "../components/PdfPreview";
import { PdfRenderer } from "../core/PdfRenderer";
import { CodeBlock } from "./CodeBlock";
import {
  DemoPdfContent,
  DemoPdfDocument,
  PdfItem,
  PdfItemType,
} from "./DemoPdfDocument";

const ColorPicker: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const parseValue = (val?: string) => {
    if (!val) return { hex: "#000000", alpha: 1 };
    if (val.length === 9) {
      return {
        hex: val.slice(0, 7),
        alpha: parseInt(val.slice(7, 9), 16) / 255,
      };
    }
    return { hex: val, alpha: 1 };
  };

  const { hex, alpha } = parseValue(value);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleHexChange = (newHex: string) => {
    const aa = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    onChange(newHex + aa);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const aa = Math.round(newAlpha * 255)
      .toString(16)
      .padStart(2, "0");
    onChange(hex + aa);
  };

  return (
    <div
      className="control"
      style={{ position: "relative" }}
      ref={containerRef}
    >
      <label>{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hstack gap-2"
        style={{
          border: "1px solid #e5e7eb",
          padding: "5px 8px",
          borderRadius: "6px",
          background: "#fff",
          cursor: "pointer",
          minHeight: "36px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            background:
              value ||
              "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEACJ98y/GfABYhIsgAJAAnuO/yX8X8DJACOYfzfAAkgIwAAOfEHBSp+8N4AAAAASUVORK5CYII=)", // checkered transparent bg
            border: "1px solid #ddd",
          }}
        />
        <span
          style={{ fontSize: "13px", color: value ? "#374151" : "#9ca3af" }}
        >
          {value ? `${hex} (${Math.round(alpha * 100)}%)` : "None"}
        </span>
      </div>

      {isOpen && (
        <div
          className="card vstack gap-3 shadow-lg"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
            marginTop: "5px",
            padding: "12px",
            width: "200px",
            background: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>Picker</span>
            <label
              className="hstack gap-1"
              style={{
                fontSize: "11px",
                cursor: "pointer",
                margin: 0,
              }}
            >
              <input
                type="checkbox"
                checked={!value}
                onChange={(e) =>
                  onChange(e.target.checked ? undefined : hex + "ff")
                }
              />
              None
            </label>
          </div>

          {!value ? (
            <div
              className="vstack"
              style={{
                height: "100px",
                border: "2px dashed #eee",
                borderRadius: "8px",
                alignItems: "center",
                justifyContent: "center",
                color: "#ccc",
                fontSize: "12px",
              }}
            >
              Inherited / None
            </div>
          ) : (
            <div className="vstack gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                style={{
                  width: "100%",
                  height: "34px",
                  padding: "0",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <div className="vstack gap-1">
                <div
                  className="hstack"
                  style={{ justifyContent: "space-between" }}
                >
                  <label style={{ fontSize: "11px", margin: 0 }}>Opacity</label>
                  <span style={{ fontSize: "11px" }}>
                    {Math.round(alpha * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={alpha}
                  onChange={(e) =>
                    handleAlphaChange(parseFloat(e.target.value))
                  }
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DemoApp: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"demo" | "docs">("demo");
  const [mode, setMode] = React.useState<"download" | "preview">("download");
  const [downloading, setDownloading] = React.useState(false);
  const [previewConfig, setPreviewConfig] = React.useState<any>(null);

  const [previewWidth, setPreviewWidth] = React.useState("100%");
  const [previewHeight, setPreviewHeight] = React.useState("600px");

  // Page Numbers config
  const [pnEnabled, setPnEnabled] = React.useState(true);
  const [pnPos, setPnPos] = React.useState<"header" | "footer">("footer");
  const [pnAlign, setPnAlign] = React.useState<"left" | "center" | "right">(
    "right"
  );
  const [pnPreset, setPnPreset] = React.useState<
    "page-slash-total" | "slash" | "page-of-total"
  >("page-slash-total");
  const [pnTemplate, setPnTemplate] = React.useState("");
  const [pnFormat, setPnFormat] = React.useState<
    "arabic" | "roman-upper" | "roman-lower"
  >("arabic");
  const [pnScope, setPnScope] = React.useState<
    "all" | "first-only" | "except-first" | "custom"
  >("all");
  const [pnCustomPages, setPnCustomPages] = React.useState("");
  const [pnY, setPnY] = React.useState<string>("");
  const [pnOffsetX, setPnOffsetX] = React.useState<string>("");
  const [pnFontSize, setPnFontSize] = React.useState<string>("10");
  const [pnColor, setPnColor] = React.useState<string>("#374151");

  // Center Label config
  const [clEnabled, setClEnabled] = React.useState(false);
  const [clPos, setClPos] = React.useState<"header" | "footer">("header");
  const [clText, setClText] = React.useState("CONFIDENTIAL");
  const [clScope, setClScope] = React.useState<
    "all" | "first-only" | "except-first" | "custom"
  >("first-only");
  const [clCustomPages, setClCustomPages] = React.useState("");
  const [clY, setClY] = React.useState<string>("");
  const [clOffsetX, setClOffsetX] = React.useState<string>("");
  const [clFontSize, setClFontSize] = React.useState<string>("10");
  const [clColor, setClColor] = React.useState<string>("#9CA3AF");

  // New Features config
  const [imgLayout, setImgLayout] = React.useState<"flow" | "absolute">("flow");
  const [imgSizing, setImgSizing] = React.useState<"auto" | "fixed">("auto");

  // Table config
  const [tableStriped, setTableStriped] = React.useState(true);
  const [tableBorderWidth, setTableBorderWidth] = React.useState("0.1");
  const [tableHeaderColor, setTableHeaderColor] = React.useState("#f3f4f6");

  // Builder state
  const [items, setItems] = React.useState<PdfItem[]>([
    {
      id: "1",
      type: "text",
      props: {
        children: "Interactive Demo Header",
        fontSize: 18,
        fontStyle: "bold",
      },
      showInAllPages: true,
      scope: "all",
    },
    {
      id: "2",
      type: "text",
      props: {
        children:
          "Below is a list of dynamic items you can add, remove, and edit. Try adding dozens of items to see how recurring sections and page breaks work.",
        color: "#6b7280",
      },
    },
  ]);

  const addItem = (type: PdfItemType) => {
    const id = Math.random().toString(36).substr(2, 9);
    let newItem: PdfItem = { id, type, props: {} };

    switch (type) {
      case "text":
        newItem.props = { children: "New Text Paragraph", fontSize: 12 };
        break;
      case "image":
        newItem.props = {
          src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
          h: 20,
        };
        break;
      case "list":
        newItem.props = {
          ordered: false,
          items: ["Item A", "Item B", "Item C"],
        };
        break;
      case "table":
        newItem.props = {
          width: "100%",
          repeatHeader: true,
          columns: [
            { header: "Name", accessor: "name", width: 40 },
            { header: "Value", accessor: "val", width: 60 },
          ],
          data: [
            { name: "Sample 1", val: "$100" },
            { name: "Sample 2", val: "$200" },
          ],
        };
        break;
      case "view":
        newItem.props = {
          children: "Grouped content or box",
          style: { padding: 4, borderWidth: 0.2, borderColor: "#ccc" },
        };
        break;
    }

    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, updates: Partial<PdfItem>) => {
    setItems(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const updateItemProps = (id: string, propUpdates: any) => {
    setItems(
      items.map((it) =>
        it.id === id ? { ...it, props: { ...it.props, ...propUpdates } } : it
      )
    );
  };

  const handleGenerate = () => {
    if (mode === "download") {
      setDownloading(true);
      setTimeout(() => {
        const filename = "pdfify-configurable-demo.pdf";
        const save = (r: any) => r.save(filename);

        // Create a component that renders DemoPdfDocument with current state
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
      // Preview Mode: Snapshot current config
      setPreviewConfig({
        options: {
          margin: { top: 18, right: 15, bottom: 15, left: 15 },
          font: { size: 12 },
          color: "#111827",
          lineHeight: 1.35,
        },
        header: (renderer: PdfRenderer, page: number, total: number) => {
          const pdf = renderer.instance;
          pdf.setFontSize(10);
          pdf.text("react-vector-pdf — Demo", renderer.contentLeft, 10);
          pdf.setLineWidth(0.2);
          pdf.line(renderer.contentLeft, 12, renderer.contentRight, 12);
        },
        footer: (renderer: PdfRenderer, page: number, total: number) => {
          const pdf = renderer.instance;
          pdf.setFontSize(9);
          pdf.setTextColor(120);
          pdf.text(
            "Generated with jsPDF (vector text, selectable)",
            renderer.contentLeft,
            renderer.height - 7
          );
        },
        pageNumbers: {
          enabled: pnEnabled,
          position: pnPos,
          align: pnAlign,
          preset: pnTemplate ? undefined : pnPreset,
          template: pnTemplate || undefined,
          format: pnFormat,
          scope: (pnScope === "custom"
            ? pnCustomPages
                .split(",")
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n))
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
            ? clCustomPages
                .split(",")
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n))
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

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "demo" ? "active" : ""}`}
            onClick={() => setActiveTab("demo")}
          >
            Interactive Demo
          </button>
          <button
            className={`tab-btn ${activeTab === "docs" ? "active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Library Documentation
          </button>
        </div>

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
              <div className="hstack gap-2 wrap mb-4">
                <button className="btn btn-sm" onClick={() => addItem("text")}>
                  + Text
                </button>
                <button className="btn btn-sm" onClick={() => addItem("image")}>
                  + Image
                </button>
                <button className="btn btn-sm" onClick={() => addItem("list")}>
                  + List
                </button>
                <button className="btn btn-sm" onClick={() => addItem("table")}>
                  + Table
                </button>
                <button className="btn btn-sm" onClick={() => addItem("view")}>
                  + View
                </button>
                <button
                  className="btn btn-sm outline"
                  onClick={() => setItems([])}
                >
                  Clear All
                </button>
              </div>

              <div className="builder-list vstack gap-2">
                {items.map((it, idx) => (
                  <div key={it.id} className="builder-item card p-3 border">
                    <div className="hstack justify-between mb-2">
                      <strong>
                        {idx + 1}. {it.type.toUpperCase()}
                      </strong>
                      <button
                        className="btn btn-sm danger"
                        onClick={() => removeItem(it.id)}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-3 gap-2">
                      {it.type === "text" && (
                        <div className="control col-span-3">
                          <label>Text Content</label>
                          <textarea
                            rows={3}
                            value={it.props.children}
                            onChange={(e) =>
                              updateItemProps(it.id, {
                                children: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}

                      {it.type === "image" && (
                        <>
                          <div className="control col-span-2">
                            <label>Image URL</label>
                            <input
                              value={it.props.src}
                              onChange={(e) =>
                                updateItemProps(it.id, { src: e.target.value })
                              }
                            />
                          </div>
                          <div className="control">
                            <label>Height</label>
                            <input
                              type="number"
                              value={it.props.h}
                              onChange={(e) =>
                                updateItemProps(it.id, {
                                  h: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {it.type === "list" && (
                        <div className="control col-span-3 card p-2 bg-light">
                          <label className="mb-2 block">List Items</label>
                          <div className="vstack gap-1">
                            {(it.props.items || []).map(
                              (li: string, lidx: number) => (
                                <div key={lidx} className="hstack gap-2">
                                  <input
                                    value={li}
                                    onChange={(e) => {
                                      const newItems = [...it.props.items];
                                      newItems[lidx] = e.target.value;
                                      updateItemProps(it.id, {
                                        items: newItems,
                                      });
                                    }}
                                  />
                                  <button
                                    className="btn btn-sm danger"
                                    onClick={() => {
                                      const newItems = it.props.items.filter(
                                        (_: any, i: number) => i !== lidx
                                      );
                                      updateItemProps(it.id, {
                                        items: newItems,
                                      });
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )
                            )}
                            <button
                              className="btn btn-sm"
                              onClick={() => {
                                updateItemProps(it.id, {
                                  items: [
                                    ...(it.props.items || []),
                                    "New Item",
                                  ],
                                });
                              }}
                            >
                              + Add Item
                            </button>
                            <label className="mt-2 hstack gap-2">
                              <input
                                type="checkbox"
                                checked={it.props.ordered}
                                onChange={(e) =>
                                  updateItemProps(it.id, {
                                    ordered: e.target.checked,
                                  })
                                }
                              />{" "}
                              Ordered (Numbered)
                            </label>
                          </div>
                        </div>
                      )}

                      {it.type === "table" && (
                        <div className="control col-span-3 card p-2 bg-light vstack gap-3">
                          <div>
                            <label className="mb-1 block">Columns</label>
                            <div className="vstack gap-1">
                              {(it.props.columns || []).map(
                                (col: any, cidx: number) => (
                                  <div key={cidx} className="hstack gap-1">
                                    <input
                                      placeholder="Header"
                                      value={col.header}
                                      onChange={(e) => {
                                        const newCols = [...it.props.columns];
                                        newCols[cidx] = {
                                          ...col,
                                          header: e.target.value,
                                        };
                                        updateItemProps(it.id, {
                                          columns: newCols,
                                        });
                                      }}
                                    />
                                    <input
                                      placeholder="Prop"
                                      value={col.accessor}
                                      onChange={(e) => {
                                        const newCols = [...it.props.columns];
                                        newCols[cidx] = {
                                          ...col,
                                          accessor: e.target.value,
                                        };
                                        updateItemProps(it.id, {
                                          columns: newCols,
                                        });
                                      }}
                                    />
                                    <button
                                      className="btn btn-xs danger"
                                      onClick={() => {
                                        const newCols = it.props.columns.filter(
                                          (_: any, i: number) => i !== cidx
                                        );
                                        updateItemProps(it.id, {
                                          columns: newCols,
                                        });
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )
                              )}
                              <button
                                className="btn btn-xs"
                                onClick={() => {
                                  const newCols = [
                                    ...(it.props.columns || []),
                                    { header: "New", accessor: "key" },
                                  ];
                                  updateItemProps(it.id, { columns: newCols });
                                }}
                              >
                                + Add Column
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block">Data Rows</label>
                            <div className="vstack gap-2 overflow-x-auto">
                              {(it.props.data || []).map(
                                (row: any, ridx: number) => (
                                  <div key={ridx} className="card p-2 border">
                                    <div className="hstack justify-between mb-1">
                                      <span className="text-xs font-bold">
                                        Row {ridx + 1}
                                      </span>
                                      <button
                                        className="btn btn-xs danger"
                                        onClick={() => {
                                          const newData = it.props.data.filter(
                                            (_: any, i: number) => i !== ridx
                                          );
                                          updateItemProps(it.id, {
                                            data: newData,
                                          });
                                        }}
                                      >
                                        Delete Row
                                      </button>
                                    </div>
                                    <div className="hstack gap-2 wrap">
                                      {it.props.columns.map((col: any) => {
                                        const cell =
                                          typeof row[col.accessor] === "object"
                                            ? row[col.accessor]
                                            : { content: row[col.accessor] };
                                        return (
                                          <div
                                            key={col.accessor}
                                            className="vstack gap-1 border p-1 rounded"
                                          >
                                            <span className="text-xs text-muted">
                                              {col.header}
                                            </span>
                                            <input
                                              className="text-xs"
                                              value={cell.content}
                                              onChange={(e) => {
                                                const newData = [
                                                  ...it.props.data,
                                                ];
                                                newData[ridx] = {
                                                  ...row,
                                                  [col.accessor]: {
                                                    ...cell,
                                                    content: e.target.value,
                                                  },
                                                };
                                                updateItemProps(it.id, {
                                                  data: newData,
                                                });
                                              }}
                                            />
                                            <div className="hstack gap-1">
                                              <div
                                                className="vstack gap-0"
                                                style={{ width: "50%" }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "10px",
                                                    color: "#666",
                                                  }}
                                                >
                                                  RowSpan
                                                </span>
                                                <input
                                                  type="number"
                                                  className="text-xs"
                                                  style={{ width: "100%" }}
                                                  value={cell.rowSpan || ""}
                                                  onChange={(e) => {
                                                    const raw = parseInt(
                                                      e.target.value
                                                    );
                                                    if (isNaN(raw)) {
                                                      const newData = [
                                                        ...it.props.data,
                                                      ];
                                                      // @ts-ignore
                                                      newData[ridx] = {
                                                        ...row,
                                                        [col.accessor]: {
                                                          ...cell,
                                                          rowSpan: undefined,
                                                        },
                                                      };
                                                      updateItemProps(it.id, {
                                                        data: newData,
                                                      });
                                                      return;
                                                    }
                                                    // Validation: min 1, max based on remaining rows
                                                    const maxPossible =
                                                      it.props.data.length -
                                                      ridx;
                                                    const val = Math.max(
                                                      1,
                                                      Math.min(raw, maxPossible)
                                                    );

                                                    if (val !== raw) {
                                                      alert(
                                                        `RowSpan adjusted to ${val} (Max available: ${maxPossible})`
                                                      );
                                                    }

                                                    const newData = [
                                                      ...it.props.data,
                                                    ];
                                                    newData[ridx] = {
                                                      ...row,
                                                      [col.accessor]: {
                                                        ...cell,
                                                        rowSpan: val,
                                                      },
                                                    };
                                                    updateItemProps(it.id, {
                                                      data: newData,
                                                    });
                                                  }}
                                                />
                                              </div>
                                              <div
                                                className="vstack gap-0"
                                                style={{ width: "50%" }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "10px",
                                                    color: "#666",
                                                  }}
                                                >
                                                  ColSpan
                                                </span>
                                                <input
                                                  type="number"
                                                  className="text-xs"
                                                  style={{ width: "100%" }}
                                                  value={cell.colSpan || ""}
                                                  onChange={(e) => {
                                                    const raw = parseInt(
                                                      e.target.value
                                                    );
                                                    if (isNaN(raw)) {
                                                      const newData = [
                                                        ...it.props.data,
                                                      ];
                                                      // @ts-ignore
                                                      newData[ridx] = {
                                                        ...row,
                                                        [col.accessor]: {
                                                          ...cell,
                                                          colSpan: undefined,
                                                        },
                                                      };
                                                      updateItemProps(it.id, {
                                                        data: newData,
                                                      });
                                                      return;
                                                    }
                                                    // Validation: min 1, max based on remaining columns
                                                    const colIdx =
                                                      it.props.columns.findIndex(
                                                        (c: any) =>
                                                          c.accessor ===
                                                          col.accessor
                                                      );
                                                    const maxPossible =
                                                      it.props.columns.length -
                                                      colIdx;
                                                    const val = Math.max(
                                                      1,
                                                      Math.min(raw, maxPossible)
                                                    );

                                                    if (val !== raw) {
                                                      alert(
                                                        `ColSpan adjusted to ${val} (Max available: ${maxPossible})`
                                                      );
                                                    }

                                                    const newData = [
                                                      ...it.props.data,
                                                    ];
                                                    newData[ridx] = {
                                                      ...row,
                                                      [col.accessor]: {
                                                        ...cell,
                                                        colSpan: val,
                                                      },
                                                    };
                                                    updateItemProps(it.id, {
                                                      data: newData,
                                                    });
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )
                              )}
                              <button
                                className="btn btn-xs"
                                onClick={() => {
                                  const newRow: any = {};
                                  it.props.columns.forEach((c: any) => {
                                    newRow[c.accessor] = "Value";
                                  });
                                  updateItemProps(it.id, {
                                    data: [...(it.props.data || []), newRow],
                                  });
                                }}
                              >
                                + Add Row
                              </button>
                            </div>
                          </div>

                          <div className="control card p-3 bg-white border">
                            <label className="hstack gap-3 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                style={{ width: "20px", height: "20px" }}
                                checked={it.props.repeatHeader !== false}
                                onChange={(e) =>
                                  updateItemProps(it.id, {
                                    repeatHeader: e.target.checked,
                                  })
                                }
                              />
                              <div className="vstack gap-0">
                                <strong className="text-sm">
                                  Repeat Header on new pages
                                </strong>
                                <p className="text-xs text-muted mb-0">
                                  If unchecked, the header row will only appear
                                  on the first page of the table.
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {it.type === "view" && (
                        <div className="control col-span-3 card p-2 bg-light vstack gap-2">
                          <label className="font-bold">
                            View Configuration
                          </label>
                          <div className="grid grid-2 gap-2">
                            <ColorPicker
                              label="Background Color"
                              value={it.props.style?.fillColor}
                              onChange={(val) =>
                                updateItemProps(it.id, {
                                  style: {
                                    ...it.props.style,
                                    fillColor: val,
                                  },
                                })
                              }
                            />
                            <ColorPicker
                              label="Border Color"
                              value={it.props.style?.borderColor}
                              onChange={(val) =>
                                updateItemProps(it.id, {
                                  style: {
                                    ...it.props.style,
                                    borderColor: val,
                                  },
                                })
                              }
                            />
                            <div className="control">
                              <label>Border Width</label>
                              <input
                                type="number"
                                step="0.1"
                                value={it.props.style?.borderWidth || 0}
                                onChange={(e) =>
                                  updateItemProps(it.id, {
                                    style: {
                                      ...it.props.style,
                                      borderWidth: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="control">
                              <label>Padding</label>
                              <input
                                type="number"
                                value={it.props.style?.padding || 0}
                                onChange={(e) =>
                                  updateItemProps(it.id, {
                                    style: {
                                      ...it.props.style,
                                      padding: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="control col-span-2">
                              <label>Inner Content (Text)</label>
                              <input
                                value={it.props.children}
                                onChange={(e) =>
                                  updateItemProps(it.id, {
                                    children: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="control">
                        <label>Recurring?</label>
                        <select
                          value={it.showInAllPages ? "true" : "false"}
                          onChange={(e) =>
                            updateItem(it.id, {
                              showInAllPages: e.target.value === "true",
                            })
                          }
                        >
                          <option value="false">Once (Flow)</option>
                          <option value="true">Persistent (Recurring)</option>
                        </select>
                      </div>

                      {it.showInAllPages && (
                        <div className="control">
                          <label>Scope</label>
                          <select
                            value={it.scope || "all"}
                            onChange={(e) =>
                              updateItem(it.id, { scope: e.target.value })
                            }
                          >
                            <option value="all">Every Page</option>
                            <option value="except-first">Except First</option>
                            <option value="first-only">First Only</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hr"></div>

            <div className="vstack">
              <h3>Page Numbers</h3>
              <div className="grid grid-3">
                <div className="control">
                  <label>Enabled</label>
                  <select
                    value={pnEnabled ? "true" : "false"}
                    onChange={(e) => setPnEnabled(e.target.value === "true")}
                  >
                    <option value="true">On</option>
                    <option value="false">Off</option>
                  </select>
                </div>
                <div className="control">
                  <label>Position</label>
                  <select
                    value={pnPos}
                    onChange={(e) => setPnPos(e.target.value as any)}
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div className="control">
                  <label>Align</label>
                  <select
                    value={pnAlign}
                    onChange={(e) => setPnAlign(e.target.value as any)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div className="control">
                  <label>Preset</label>
                  <select
                    value={pnPreset}
                    onChange={(e) => setPnPreset(e.target.value as any)}
                  >
                    <option value="page-slash-total">Page 1/10</option>
                    <option value="slash">1/10</option>
                    <option value="page-of-total">Page 1 of 10</option>
                  </select>
                  <small className="mono">
                    If template is set, it overrides preset.
                  </small>
                </div>
                <div className="control">
                  <label>Custom Template</label>
                  <input
                    placeholder="e.g., Pg {page} / {total}"
                    value={pnTemplate}
                    onChange={(e) => setPnTemplate(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Format</label>
                  <select
                    value={pnFormat}
                    onChange={(e) => setPnFormat(e.target.value as any)}
                  >
                    <option value="arabic">Arabic (1,2,3)</option>
                    <option value="roman-upper">
                      Roman Upper (I, II, III)
                    </option>
                    <option value="roman-lower">
                      Roman Lower (i, ii, iii)
                    </option>
                  </select>
                </div>

                <div className="control">
                  <label>Scope</label>
                  <select
                    value={pnScope}
                    onChange={(e) => setPnScope(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="first-only">First page only</option>
                    <option value="except-first">All except first</option>
                    <option value="custom">Custom pages</option>
                  </select>
                </div>
                <div className="control">
                  <label>Custom Pages (comma sep)</label>
                  <input
                    placeholder="e.g., 2,3,5"
                    value={pnCustomPages}
                    onChange={(e) => setPnCustomPages(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Y (mm)</label>
                  <input
                    placeholder="auto"
                    value={pnY}
                    onChange={(e) => setPnY(e.target.value)}
                  />
                </div>

                <div className="control">
                  <label>OffsetX (mm)</label>
                  <input
                    placeholder="0"
                    value={pnOffsetX}
                    onChange={(e) => setPnOffsetX(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Font Size</label>
                  <input
                    placeholder="10"
                    value={pnFontSize}
                    onChange={(e) => setPnFontSize(e.target.value)}
                  />
                </div>
                <ColorPicker
                  label="Color"
                  value={pnColor}
                  onChange={(val) => setPnColor(val || "#000000")}
                />
              </div>
            </div>

            <div className="hr"></div>

            <div className="vstack">
              <h3>Center Label (e.g., CONFIDENTIAL)</h3>
              <div className="grid grid-3">
                <div className="control">
                  <label>Enabled</label>
                  <select
                    value={clEnabled ? "true" : "false"}
                    onChange={(e) => setClEnabled(e.target.value === "true")}
                  >
                    <option value="true">On</option>
                    <option value="false">Off</option>
                  </select>
                </div>
                <div className="control">
                  <label>Position</label>
                  <select
                    value={clPos}
                    onChange={(e) => setClPos(e.target.value as any)}
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div className="control">
                  <label>Text</label>
                  <input
                    value={clText}
                    onChange={(e) => setClText(e.target.value)}
                  />
                </div>

                <div className="control">
                  <label>Scope</label>
                  <select
                    value={clScope}
                    onChange={(e) => setClScope(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="first-only">First page only</option>
                    <option value="except-first">All except first</option>
                    <option value="custom">Custom pages</option>
                  </select>
                </div>
                <div className="control">
                  <label>Custom Pages (comma sep)</label>
                  <input
                    placeholder="e.g., 2,3"
                    value={clCustomPages}
                    onChange={(e) => setClCustomPages(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Y (mm)</label>
                  <input
                    placeholder="auto"
                    value={clY}
                    onChange={(e) => setClY(e.target.value)}
                  />
                </div>

                <div className="control">
                  <label>OffsetX (mm)</label>
                  <input
                    placeholder="0"
                    value={clOffsetX}
                    onChange={(e) => setClOffsetX(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Font Size</label>
                  <input
                    placeholder="10"
                    value={clFontSize}
                    onChange={(e) => setClFontSize(e.target.value)}
                  />
                </div>
                <ColorPicker
                  label="Color"
                  value={clColor}
                  onChange={(val) => setClColor(val || "#000000")}
                />
              </div>
            </div>

            <div className="hr"></div>

            <div className="vstack">
              <h3>Table Options</h3>
              <div className="grid grid-3">
                <div className="control">
                  <label>Striped Rows</label>
                  <select
                    value={tableStriped ? "true" : "false"}
                    onChange={(e) => setTableStriped(e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="control">
                  <label>Border Width</label>
                  <input
                    value={tableBorderWidth}
                    onChange={(e) => setTableBorderWidth(e.target.value)}
                  />
                </div>
                <ColorPicker
                  label="Header Color"
                  value={tableHeaderColor}
                  onChange={(val) => setTableHeaderColor(val || "#f3f4f6")}
                />
              </div>
            </div>

            <div className="hstack mb-4" style={{ marginBottom: 20 }}>
              <label>
                <strong>Mode:</strong>
              </label>
              <div className="hstack gap-2">
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="download"
                    checked={mode === "download"}
                    onChange={() => setMode("download")}
                  />{" "}
                  Download
                </label>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="preview"
                    checked={mode === "preview"}
                    onChange={() => setMode("preview")}
                  />{" "}
                  Preview
                </label>
              </div>
            </div>

            {mode === "preview" && (
              <div className="grid grid-2 mb-4">
                <div className="control">
                  <label>Preview Width</label>
                  <input
                    value={previewWidth}
                    onChange={(e) => setPreviewWidth(e.target.value)}
                  />
                </div>
                <div className="control">
                  <label>Preview Height</label>
                  <input
                    value={previewHeight}
                    onChange={(e) => setPreviewHeight(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="hstack">
              <button
                className="btn"
                onClick={handleGenerate}
                disabled={downloading}
              >
                {downloading ? "Generating…" : "Generate PDF"}
              </button>
              <small className="mono">
                Tip: set a custom template like{" "}
                <code>{"Pg {page} / {total}"}</code>
              </small>
            </div>

            {mode === "preview" && previewConfig && (
              <div
                className="preview-container"
                style={{ marginTop: 20, border: "1px solid #e5e7eb" }}
              >
                <PdfPreview
                  width={previewConfig?.width || previewWidth}
                  height={previewConfig?.height || previewHeight}
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
          <div className="vstack">
            <h2>Documentation & Features</h2>
            <p>
              <strong>Vector-based, React-driven PDF generation.</strong>
              <br />
              react-vector-pdf is a React wrapper around jsPDF that allows you
              to build complex, multi-page PDFs using declarative React
              components.
            </p>
            <div className="hr"></div>

            <h3>Features</h3>
            <ul className="list-disc pl-5">
              <li>
                <strong>Vector Text</strong>: High-quality, selectable, and
                searchable text.
              </li>
              <li>
                <strong>Smart Layout</strong>: Auto-paging, flow positioning,
                row spanning.
              </li>
              <li>
                <strong>Metadata</strong>: Set title, author, subject, and
                keywords.
              </li>
            </ul>

            <div className="hr"></div>

            <h3>Components Reference</h3>

            <h4>1. PdfText</h4>
            <p>Renders a paragraph of text with automatic wrapping.</p>
            <ul className="list-disc pl-5 mb-2">
              <li>
                <code>fontSize</code> (number): Font size in points.
              </li>
              <li>
                <code>fontStyle</code> ('normal' | 'bold' | 'italic'): Font
                style.
              </li>
              <li>
                <code>color</code> (string): Hex color code.
              </li>
              <li>
                <code>align</code> ('left' | 'center' | 'right' | 'justify'):
                Text alignment.
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
            <ul className="list-disc pl-5 mb-2">
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
                <code>borderWidth</code>, <code>borderColor</code>: Global
                border settings.
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
            <ul className="list-disc pl-5 mb-2">
              <li>
                <code>items</code> (string[]): List of strings.
              </li>
              <li>
                <code>ordered</code> (boolean): true for numbers, false for
                bullets.
              </li>
              <li>
                <code>indent</code>, <code>markerWidth</code>,{" "}
                <code>spacing</code> (number): Layout tuning (mm).
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
            <ul className="list-disc pl-5 mb-2">
              <li>
                <code>src</code> (string): URL or base64.
              </li>
              <li>
                <code>x</code>, <code>y</code> (number): Optional fixed
                coordinates.
              </li>
              <li>
                <code>w</code>, <code>h</code> (number): Dimensions.
              </li>
              <li>
                <code>align</code>: Horizontal alignment (flow mode).
              </li>
              <li>
                <code>flow</code> (boolean): Force flow (default if x/y
                omitted).
              </li>
            </ul>
            <CodeBlock code={`<PdfImage src="..." align="center" h={30} />`} />

            <h4>6. PdfView</h4>
            <p>
              A container component for grouping content and adding backgrounds
              or borders. Supports both <strong>flow layout</strong> (automatic)
              and
              <strong>absolute positioning</strong>.
            </p>
            <ul className="list-disc pl-5 mb-2">
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
            <ul className="list-disc pl-5 mb-2">
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
            <ul className="list-disc pl-5 mb-2">
              <li>Same positioning and scope logic as Page Numbers.</li>
              <li>
                <code>text</code>: The string to display.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
