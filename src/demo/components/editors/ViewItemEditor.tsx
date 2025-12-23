import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface ViewItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const ViewItemEditor: React.FC<ViewItemEditorProps> = ({
  props,
  onChange,
}) => {
  const style = props.style || {};

  return (
    <div className="control col-span-3 card p-2 bg-light vstack gap-2">
      <label className="font-bold">View Configuration</label>
      <div className="grid grid-2 gap-2">
        <ColorPicker
          label="Background Color"
          value={style.fillColor}
          onChange={(val) =>
            onChange({
              style: { ...style, fillColor: val },
            })
          }
        />
        <ColorPicker
          label="Border Color"
          value={style.borderColor}
          onChange={(val) =>
            onChange({
              style: { ...style, borderColor: val },
            })
          }
        />
        <div className="control">
          <label>Border Width</label>
          <input
            type="number"
            step="0.1"
            value={style.borderWidth || 0}
            onChange={(e) =>
              onChange({
                style: { ...style, borderWidth: Number(e.target.value) },
              })
            }
          />
        </div>
        <div className="control">
          <label>Padding</label>
          <input
            type="number"
            value={style.padding || 0}
            onChange={(e) =>
              onChange({
                style: { ...style, padding: Number(e.target.value) },
              })
            }
          />
        </div>
      </div>
      <div className="control">
        <label>Content (Text)</label>
        <textarea
          rows={2}
          value={typeof props.children === "string" ? props.children : ""}
          onChange={(e) => onChange({ children: e.target.value })}
          placeholder="Enter text to display inside the box..."
        />
      </div>
    </div>
  );
};
