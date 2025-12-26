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
    <div className="control col-span-3 card p-2 bg-light vstack gap-3">
      <div className="hstack justify-between">
        <label className="font-bold">Table Configuration</label>
      </div>

      <div className="grid grid-2 gap-2">
        {/* ClassName */}
        <div className="control col-span-2">
          <label>CSS Class</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g. mb-4 text-sm"
            className="input-sm"
          />
        </div>

        {/* Global Table Settings */}
        <div className="control">
          <label>Border Width (mm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Global"
            value={props.borderWidth ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                borderWidth: val === "" ? undefined : Math.max(0, Number(val)),
              });
            }}
            className="input-sm"
          />
        </div>

        <div className="control">
          <label>Cell Padding (mm)</label>
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
            className="input-sm"
          />
        </div>
      </div>

      <div className="hr"></div>

      {/* HEADER Configuration */}
      <div>
        <label className="font-bold text-xs uppercase text-muted mb-2 block">
          Header Styling
        </label>
        <div className="grid grid-2 gap-2">
          <ColorPicker
            label="Background Color"
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
          <ColorPicker
            label="Text Color"
            value={props.headerStyle?.color}
            onChange={(val) =>
              onChange({
                headerStyle: { ...props.headerStyle, color: val || undefined },
              })
            }
          />
          <div className="control">
            <label>Vertical Align</label>
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
              className="select-sm"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hr"></div>

      {/* BODY / ROW Configuration */}
      <div>
        <label className="font-bold text-xs uppercase text-muted mb-2 block">
          Row Styling
        </label>
        <div className="grid grid-2 gap-2">
          <div className="control">
            <label>Striped Rows</label>
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
              className="select-sm"
            >
              <option value="global">Global Setting</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Stripe Color (only if striped is yes or global?) - Let's just show it */}
          <ColorPicker
            label="Stripe Color"
            value={props.stripeColor}
            onChange={(val) => onChange({ stripeColor: val || undefined })}
          />

          <ColorPicker
            label="Text Color"
            value={props.rowStyle?.color}
            onChange={(val) =>
              onChange({
                rowStyle: { ...props.rowStyle, color: val || undefined },
              })
            }
          />

          <div className="control">
            <label>Vertical Align</label>
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
              className="select-sm"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hr"></div>

      <div>
        <label className="mb-1 block">Columns</label>
        <div className="vstack gap-1">
          {columns.map((col: any, cidx: number) => (
            <div key={cidx} className="hstack gap-1">
              <input
                placeholder="Header"
                value={col.header}
                onChange={(e) => {
                  const newCols = [...columns];
                  newCols[cidx] = {
                    ...col,
                    header: e.target.value,
                  };
                  onChange({ columns: newCols });
                }}
                className="input-sm"
              />
              <input
                placeholder="Prop"
                value={col.accessor}
                onChange={(e) => {
                  const newCols = [...columns];
                  newCols[cidx] = {
                    ...col,
                    accessor: e.target.value,
                  };
                  onChange({ columns: newCols });
                }}
                className="input-sm"
              />
              <button
                className="btn btn-xs danger"
                onClick={() => {
                  const newCols = columns.filter(
                    (_: any, i: number) => i !== cidx
                  );
                  onChange({ columns: newCols });
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="btn btn-sm mt-2"
            onClick={() => {
              const newCols = [...columns, { header: "New", accessor: "key" }];
              onChange({ columns: newCols });
            }}
          >
            + Add Column
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block">Data Rows</label>
        <div className="vstack gap-2 overflow-x-auto">
          {data.map((row: any, ridx: number) => (
            <div key={ridx} className="card p-2 border">
              <div className="hstack justify-between mb-1">
                <span className="text-xs font-bold">Row {ridx + 1}</span>
                <button
                  className="btn btn-xs danger"
                  onClick={() => {
                    const newData = data.filter(
                      (_: any, i: number) => i !== ridx
                    );
                    onChange({ data: newData });
                  }}
                >
                  Delete Row
                </button>
              </div>
              <div className="hstack gap-2 wrap">
                {columns.map((col: any) => {
                  const cell =
                    typeof row[col.accessor] === "object"
                      ? row[col.accessor]
                      : { content: row[col.accessor] };
                  return (
                    <div
                      key={col.accessor}
                      className="vstack gap-1 border p-1 rounded"
                    >
                      <span className="text-xs text-muted">{col.header}</span>
                      <input
                        className="text-xs input-sm"
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
                      <div className="hstack gap-1">
                        <div className="vstack gap-0 w-1/2">
                          <span className="text-2xs text-muted">RowSpan</span>
                          <input
                            type="number"
                            className="text-xs w-full input-sm"
                            value={cell.rowSpan || ""}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value);
                              const newData = [...data];
                              if (isNaN(raw)) {
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: {
                                    ...cell,
                                    rowSpan: undefined,
                                  },
                                };
                              } else {
                                const maxPossible = data.length - ridx;
                                const val = Math.max(
                                  1,
                                  Math.min(raw, maxPossible)
                                );
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: { ...cell, rowSpan: val },
                                };
                              }
                              onChange({ data: newData });
                            }}
                          />
                        </div>
                        <div className="vstack gap-0 w-1/2">
                          <span className="text-2xs text-muted">ColSpan</span>
                          <input
                            type="number"
                            className="text-xs w-full input-sm"
                            value={cell.colSpan || ""}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value);
                              const newData = [...data];
                              if (isNaN(raw)) {
                                newData[ridx] = {
                                  ...row,
                                  [col.accessor]: {
                                    ...cell,
                                    colSpan: undefined,
                                  },
                                };
                              } else {
                                const colIdx = columns.findIndex(
                                  (c: any) => c.accessor === col.accessor
                                );
                                const maxPossible = columns.length - colIdx;
                                const val = Math.max(
                                  1,
                                  Math.min(raw, maxPossible)
                                );
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
            className="btn btn-sm mt-2"
            onClick={() => {
              const newRow: any = {};
              columns.forEach((c: any) => {
                newRow[c.accessor] = "Value";
              });
              onChange({ data: [...data, newRow] });
            }}
          >
            + Add Row
          </button>
        </div>
      </div>

      <div className="control card p-3 bg-white border">
        <label className="cursor-pointer w-fit">
          <div className="hstack gap-2 items-center">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={props.repeatHeader !== false}
              onChange={(e) => onChange({ repeatHeader: e.target.checked })}
            />
            <strong className="text-sm">Repeat Header on new pages</strong>
          </div>
        </label>

        <div className="vstack gap-0">
          <p className="text-xs text-muted mb-0">
            If unchecked, the header row will only appear on the first page of
            the table.
          </p>
        </div>
      </div>
    </div>
  );
};
