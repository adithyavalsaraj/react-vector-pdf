import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface TableItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const TableItemEditor: React.FC<TableItemEditorProps> = ({
  props,
  onChange,
}) => {
  const columns = props.columns || [];
  const data = props.data || [];

  return (
    <div className="editor-group-container">
      {/* GLOBAL SETTINGS */}
      <div className="editor-row gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">CSS Class Utilities</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g., border mb-4 text-xs"
            className="premium-input"
          />
        </div>
      </div>

      <div className="editor-row mt-3 gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">Border Width (mm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Default"
            value={props.borderWidth ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                borderWidth: val === "" ? undefined : Math.max(0, Number(val)),
              });
            }}
            className="premium-input"
          />
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">Cell Padding (mm)</label>
          <input
            type="number"
            min="0"
            placeholder="Default"
            value={props.cellPadding ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                cellPadding: val === "" ? undefined : Math.max(0, Number(val)),
              });
            }}
            className="premium-input"
          />
        </div>
      </div>

      {/* HEADER STYLING */}
      <div className="editor-section-card mt-4">
        <h4 className="editor-section-title">Header Styling</h4>
        <div className="editor-row gap-4 mt-2">
          <div className="editor-field flex-1">
            <ColorPicker
              label="Fill Color"
              value={props.headerStyle?.fillColor}
              onChange={(val) =>
                onChange({
                  headerStyle: {
                    ...props.headerStyle,
                    fillColor: val || undefined,
                  },
                })
              }
            />
          </div>
          <div className="editor-field flex-1">
            <ColorPicker
              label="Text Color"
              value={props.headerStyle?.color}
              onChange={(val) =>
                onChange({
                  headerStyle: { ...props.headerStyle, color: val || undefined },
                })
              }
            />
          </div>
          <div className="editor-field w-32">
            <label className="editor-label">Align</label>
            <select
              value={props.headerStyle?.verticalAlign ?? "middle"}
              onChange={(e) =>
                onChange({
                  headerStyle: {
                    ...props.headerStyle,
                    verticalAlign: e.target.value,
                  },
                })
              }
              className="premium-select"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROW STYLING */}
      <div className="editor-section-card mt-4">
        <h4 className="editor-section-title">Row Styling</h4>
        <div className="editor-row gap-4 mt-2">
          <div className="editor-field flex-1">
            <label className="editor-label">Striped Pattern</label>
            <select
              value={
                props.striped === undefined
                  ? "global"
                  : props.striped
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                onChange({
                  striped:
                    e.target.value === "global"
                      ? undefined
                      : e.target.value === "yes",
                })
              }
              className="premium-select"
            >
              <option value="global">Use Global</option>
              <option value="yes">Striped</option>
              <option value="no">Solid</option>
            </select>
          </div>
          <div className="editor-field flex-1">
            <ColorPicker
              label="Stripe Color"
              value={props.stripeColor}
              onChange={(val) => onChange({ stripeColor: val || undefined })}
            />
          </div>
        </div>
        <div className="editor-row gap-4 mt-3">
          <div className="editor-field flex-1">
            <ColorPicker
              label="Row Text Color"
              value={props.rowStyle?.color}
              onChange={(val) =>
                onChange({
                  rowStyle: { ...props.rowStyle, color: val || undefined },
                })
              }
            />
          </div>
          <div className="editor-field flex-1">
            <label className="editor-label">Vertical Align</label>
            <select
              value={props.rowStyle?.verticalAlign ?? "top"}
              onChange={(e) =>
                onChange({
                  rowStyle: {
                    ...props.rowStyle,
                    verticalAlign: e.target.value,
                  },
                })
              }
              className="premium-select"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      </div>

      {/* COLUMNS */}
      <div className="editor-section-card mt-4">
        <h4 className="editor-section-title">Table Columns</h4>
        <div className="vstack gap-2 mt-2">
          {columns.map((col: any, cidx: number) => (
            <div key={cidx} className="hstack gap-2 items-center">
              <input
                placeholder="Column Header"
                value={col.header}
                onChange={(e) => {
                  const newCols = [...columns];
                  newCols[cidx] = {
                    ...col,
                    header: e.target.value,
                  };
                  onChange({ columns: newCols });
                }}
                className="premium-input flex-1"
              />
              <input
                placeholder="Accessor key"
                value={col.accessor}
                onChange={(e) => {
                  const newCols = [...columns];
                  newCols[cidx] = {
                    ...col,
                    accessor: e.target.value,
                  };
                  onChange({ columns: newCols });
                }}
                className="premium-input flex-1"
              />
              <button
                className="btn danger btn-sm"
                onClick={() => {
                  const newCols = columns.filter((_: any, i: number) => i !== cidx);
                  onChange({ columns: newCols });
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline btn-sm mt-2 w-fit"
            onClick={() => {
              const newCols = [...columns, { header: "New Column", accessor: "new_col" }];
              onChange({ columns: newCols });
            }}
          >
            + Add Column
          </button>
        </div>
      </div>

      {/* DATA ROWS */}
      <div className="editor-section-card mt-4">
        <h4 className="editor-section-title">Data Rows</h4>
        <div className="vstack gap-3 mt-2">
          {data.map((row: any, ridx: number) => (
            <div key={ridx} className="card p-3 border rounded bg-gray-50">
              <div className="hstack justify-between mb-2">
                <span className="text-xs font-bold text-muted">Row #{ridx + 1}</span>
                <button
                  className="btn danger btn-xs"
                  onClick={() => {
                    const newData = data.filter((_: any, i: number) => i !== ridx);
                    onChange({ data: newData });
                  }}
                >
                  Remove Row
                </button>
              </div>
              <div className="vstack gap-3">
                {columns.map((col: any) => {
                  const cell =
                    typeof row[col.accessor] === "object"
                      ? row[col.accessor]
                      : { content: row[col.accessor] };
                  return (
                    <div key={col.accessor} className="border-bottom pb-2">
                      <span className="text-2xs font-bold uppercase text-muted block mb-1">{col.header}</span>
                      <input
                        className="premium-input text-xs"
                        value={cell.content}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[ridx] = {
                            ...row,
                            [col.accessor]: {
                              ...cell,
                              content: e.target.value,
                            },
                          };
                          onChange({ data: newData });
                        }}
                      />
                      <div className="hstack gap-4 mt-2">
                        <div className="flex-1">
                          <span className="text-2xs text-muted">Row Span</span>
                          <input
                            type="number"
                            className="premium-input text-xs mt-1"
                            value={cell.rowSpan || ""}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value);
                              const newData = [...data];
                              if (isNaN(raw)) {
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: { ...cell, rowSpan: undefined },
                                };
                              } else {
                                const maxPossible = data.length - ridx;
                                const val = Math.max(1, Math.min(raw, maxPossible));
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: { ...cell, rowSpan: val },
                                };
                              }
                              onChange({ data: newData });
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-2xs text-muted">Col Span</span>
                          <input
                            type="number"
                            className="premium-input text-xs mt-1"
                            value={cell.colSpan || ""}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value);
                              const newData = [...data];
                              if (isNaN(raw)) {
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: { ...cell, colSpan: undefined },
                                };
                              } else {
                                const colIdx = columns.findIndex((c: any) => c.accessor === col.accessor);
                                const maxPossible = columns.length - colIdx;
                                const val = Math.max(1, Math.min(raw, maxPossible));
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: { ...cell, colSpan: val },
                                };
                              }
                              onChange({ data: newData });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline btn-sm mt-2 w-fit"
            onClick={() => {
              const newRow: any = {};
              columns.forEach((c: any) => {
                newRow[c.accessor] = "Cell Value";
              });
              onChange({ data: [...data, newRow] });
            }}
          >
            + Add Row
          </button>
        </div>
      </div>

      {/* HEADER REPEAT OPTION */}
      <div className="editor-row mt-4">
        <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
          <input
            type="checkbox"
            checked={props.repeatHeader !== false}
            onChange={(e) => onChange({ repeatHeader: e.target.checked })}
            className="premium-checkbox"
          />
          <span>Repeat header row on new pages</span>
        </label>
      </div>
    </div>
  );
};
