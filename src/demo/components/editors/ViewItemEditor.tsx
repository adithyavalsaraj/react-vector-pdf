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

  const handleStyleChange = (key: string, value: any) => {
    onChange({
      style: {
        ...style,
        [key]: value,
      },
    });
  };

  return (
    <div className="control col-span-3 card p-2 bg-light vstack gap-2">
      <div className="hstack justify-between">
        <label className="font-bold">View Configuration</label>
      </div>

      <div className="grid grid-2 gap-2">
        {/* ClassName & Gap */}
        <div className="control">
          <label>CSS Class</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g. p-4 bg-gray-100"
            className="input-sm"
          />
        </div>
        <div className="control">
          <label>Gap (mm)</label>
          <input
            type="number"
            min="0"
            value={style.gap || 0}
            onChange={(e) => handleStyleChange("gap", Number(e.target.value))}
            className="input-sm"
          />
        </div>

        {/* Colors */}
        <ColorPicker
          label="Background Color"
          value={style.fillColor}
          onChange={(val) => handleStyleChange("fillColor", val)}
        />
        <ColorPicker
          label="Border Color"
          value={style.borderColor}
          onChange={(val) => handleStyleChange("borderColor", val)}
        />

        {/* Dimensions */}
        <div className="control">
          <label>Border Width</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={style.borderWidth || 0}
            onChange={(e) =>
              handleStyleChange("borderWidth", Number(e.target.value))
            }
            className="input-sm"
          />
        </div>
        <div className="control">
          <label>Padding</label>
          <input
            type="number"
            min="0"
            value={style.padding ?? ""}
            onChange={(e) =>
              handleStyleChange(
                "padding",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="input-sm"
          />
        </div>
        <div className="control">
          <label>Border Radius</label>
          <input
            type="number"
            min="0"
            value={style.radius || 0}
            onChange={(e) =>
              handleStyleChange("radius", Number(e.target.value))
            }
            className="input-sm"
          />
        </div>
      </div>

      <div className="control mt-2">
        <ColorPicker
          label="Text Color"
          value={style.color || "#000000"}
          onChange={(val) => handleStyleChange("color", val)}
        />
      </div>

      <div className="control mt-2">
        <label>Content (Text)</label>
        <textarea
          rows={2}
          value={typeof props.children === "string" ? props.children : ""}
          onChange={(e) => onChange({ children: e.target.value })}
          placeholder="Enter text to display inside the box..."
          className="input-sm"
        />
      </div>
    </div>
  );
};
