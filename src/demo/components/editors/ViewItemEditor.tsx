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

  const isRichNode = typeof props.children === "object" && props.children !== null;

  return (
    <div className="editor-group-container">
      {/* CLASS AND GAP */}
      <div className="editor-row gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">CSS Class Utilities</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g., flex flex-row gap-4 p-4 rounded"
            className="premium-input"
          />
        </div>
        <div className="editor-field w-32">
          <label className="editor-label">Item Gap (mm)</label>
          <input
            type="number"
            min="0"
            value={style.gap || 0}
            onChange={(e) => handleStyleChange("gap", Number(e.target.value))}
            className="premium-input"
          />
        </div>
      </div>

      {/* COLORS */}
      <div className="editor-row mt-3 gap-4">
        <div className="editor-field flex-1">
          <ColorPicker
            label="Background Fill"
            value={style.fillColor}
            onChange={(val) => handleStyleChange("fillColor", val)}
          />
        </div>
        <div className="editor-field flex-1">
          <ColorPicker
            label="Border Stroke"
            value={style.borderColor}
            onChange={(val) => handleStyleChange("borderColor", val)}
          />
        </div>
      </div>

      {/* DIMENSIONS & RADIUS */}
      <div className="editor-row mt-3 gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">Border Width (mm)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={style.borderWidth || 0}
            onChange={(e) => handleStyleChange("borderWidth", Number(e.target.value))}
            className="premium-input"
          />
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">Padding (mm)</label>
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
            className="premium-input"
          />
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">Corner Radius (mm)</label>
          <input
            type="number"
            min="0"
            value={style.radius || 0}
            onChange={(e) => handleStyleChange("radius", Number(e.target.value))}
            className="premium-input"
          />
        </div>
      </div>

      {/* TEXT COLOR & CHILDREN */}
      <div className="editor-row mt-3 gap-4">
        <div className="editor-field w-52">
          <ColorPicker
            label="Default Text Color"
            value={style.color || "#000000"}
            onChange={(val) => handleStyleChange("color", val)}
          />
        </div>
      </div>

      <div className="editor-row mt-3">
        <div className="editor-field flex-1">
          <label className="editor-label">Box Inner Content</label>
          {isRichNode ? (
            <div className="rich-badge-alert">
              <span className="sparkle-icon">✨</span>
              <div className="rich-badge-content">
                <strong>Flex Grid Active:</strong> This container wraps sibling columns side-by-side. You can edit this structure in the <strong>"React Code"</strong> tab or clear it to use simple text children.
              </div>
            </div>
          ) : (
            <textarea
              rows={2}
              value={typeof props.children === "string" ? props.children : ""}
              onChange={(e) => onChange({ children: e.target.value })}
              placeholder="Enter text to render inside the view..."
              className="premium-textarea"
            />
          )}
        </div>
      </div>
    </div>
  );
};
