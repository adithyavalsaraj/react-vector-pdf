import React from "react";
import { ColorPicker } from "../ColorPicker";

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
    <div className="control col-span-3 card p-2 bg-light vstack gap-2">
      <div className="hstack justify-between">
        <label className="font-bold">List Configuration</label>
      </div>

      <div className="grid grid-2 gap-2">
        <div className="control">
          <label>CSS Class</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g. mb-2"
            className="input-sm"
          />
        </div>
        <div className="control">
          <ColorPicker
            label="Text Color"
            value={props.color}
            onChange={(val) => onChange({ color: val })}
          />
        </div>
      </div>

      <label className="mb-1 block">List Items</label>
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
              className="input-sm"
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
          className="btn btn-sm mt-2"
          onClick={() => {
            onChange({ items: [...items, "New Item"] });
          }}
        >
          + Add Item
        </button>
        <label className="mt-2 hstack gap-2 cursor-pointer items-center">
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
