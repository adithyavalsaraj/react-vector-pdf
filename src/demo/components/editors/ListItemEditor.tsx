import React from "react";

export interface ListItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const ListItemEditor: React.FC<ListItemEditorProps> = ({
  props,
  onChange,
}) => {
  const items = props.items || [];

  return (
    <div className="control col-span-3 card p-2 bg-light">
      <label className="mb-2 block">List Items</label>
      <div className="vstack gap-1">
        {items.map((li: string, lidx: number) => (
          <div key={lidx} className="hstack gap-2">
            <input
              value={li}
              onChange={(e) => {
                const newItems = [...items];
                newItems[lidx] = e.target.value;
                onChange({ items: newItems });
              }}
            />
            <button
              className="btn btn-sm danger"
              onClick={() => {
                const newItems = items.filter(
                  (_: any, i: number) => i !== lidx
                );
                onChange({ items: newItems });
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className="btn btn-sm"
          onClick={() => {
            onChange({ items: [...items, "New Item"] });
          }}
        >
          + Add Item
        </button>
        <label className="mt-2 hstack gap-2 cursor-pointer select-none items-center">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={props.ordered}
            onChange={(e) => onChange({ ordered: e.target.checked })}
          />
          <span className="text-sm font-medium">Ordered (Numbered)</span>
        </label>
      </div>
    </div>
  );
};
