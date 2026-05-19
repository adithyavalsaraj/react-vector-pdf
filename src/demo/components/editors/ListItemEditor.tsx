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
    <div className="editor-group-container">
      <div className="editor-row gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">CSS Class Utilities</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g., mb-2 pl-4"
            className="premium-input"
          />
        </div>
        <div className="editor-field w-52">
          <ColorPicker
            label="Bullet/Text Color"
            value={props.color}
            onChange={(val) => onChange({ color: val })}
          />
        </div>
      </div>

      <div className="editor-row mt-4">
        <div className="editor-field flex-1">
          <label className="editor-label mb-2">Sequence Items</label>
          <div className="vstack gap-2">
            {items.map((li: string, lidx: number) => (
              <div key={lidx} className="hstack gap-2 items-stretch">
                <input
                  value={li}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[lidx] = e.target.value;
                    onChange({ items: newItems });
                  }}
                  className="premium-input flex-1"
                  placeholder={`Item ${lidx + 1}`}
                />
                <button
                  className="btn danger btn-sm"
                  onClick={() => {
                    const newItems = items.filter((_: any, i: number) => i !== lidx);
                    onChange({ items: newItems });
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            <div className="hstack justify-between mt-2 pt-2 border-top">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onChange({ items: [...items, "New Item"] })}
              >
                + Add List Item
              </button>
              <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                <input
                  type="checkbox"
                  checked={props.ordered}
                  onChange={(e) => onChange({ ordered: e.target.checked })}
                  className="premium-checkbox"
                />
                <span>Ordered List (1, 2, 3)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
