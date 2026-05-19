import React from "react";

export interface ImageItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const ImageItemEditor: React.FC<ImageItemEditorProps> = ({
  props,
  onChange,
}) => {
  return (
    <div className="editor-group-container">
      <div className="editor-row gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">Image URL / Data URI</label>
          <input
            type="text"
            value={props.src || ""}
            onChange={(e) => onChange({ src: e.target.value })}
            placeholder="https://example.com/image.png"
            className="premium-input"
          />
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">CSS Class Utilities</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g., rounded shadow mb-4"
            className="premium-input"
          />
        </div>
      </div>

      <div className="editor-row mt-3 gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">Width (mm)</label>
          <input
            type="number"
            min="0"
            value={props.w || ""}
            placeholder="Auto"
            onChange={(e) => {
              const val = e.target.value;
              onChange({ w: val ? Math.max(0, Number(val)) : undefined });
            }}
            className="premium-input"
          />
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">Height (mm)</label>
          <input
            type="number"
            min="0"
            value={props.h || ""}
            placeholder="Auto"
            onChange={(e) => {
              const val = e.target.value;
              onChange({ h: val ? Math.max(0, Number(val)) : undefined });
            }}
            className="premium-input"
          />
        </div>
      </div>

      <div className="editor-row mt-3 gap-4">
        <div className="editor-field flex-1">
          <label className="editor-label">Horizontal Alignment</label>
          <select
            value={props.align || "left"}
            onChange={(e) => onChange({ align: e.target.value })}
            className="premium-select"
          >
            <option value="left">Left-aligned</option>
            <option value="center">Centered</option>
            <option value="right">Right-aligned</option>
          </select>
        </div>
        <div className="editor-field flex-1">
          <label className="editor-label">Sizing Behavior</label>
          <select
            value={props.sizing || "auto"}
            onChange={(e) => onChange({ sizing: e.target.value })}
            className="premium-select"
          >
            <option value="auto">Natural aspect-ratio</option>
            <option value="fit">Fit aspect to container</option>
            <option value="fill">Stretched to full width</option>
          </select>
        </div>
      </div>
    </div>
  );
};
