import React from "react";

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
                        className="text-xs"
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
                            className="text-xs w-full"
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
                            className="text-xs w-full"
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
