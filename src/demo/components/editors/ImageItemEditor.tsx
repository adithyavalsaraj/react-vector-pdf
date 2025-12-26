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
    <>
      <div className="control col-span-3">
        <label className="font-bold mb-2 block">Image Configuration</label>
      </div>

      <div className="grid grid-2 gap-2 col-span-3">
        {/* ClassName */}
        <div className="control col-span-2">
          <label>CSS Class</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g. mb-4 rounded"
            className="input-sm"
          />
        </div>

        {/* Image Source */}
        <div className="control col-span-2">
          <label>Image URL</label>
          <input
            value={props.src}
            onChange={(e) => onChange({ src: e.target.value })}
            className="input-sm"
          />
        </div>

        {/* Dimensions */}
        <div className="control">
          <label>Width (mm)</label>
          <input
            type="number"
            min="0"
            value={props.w || ""}
            placeholder="Auto"
            onChange={(e) => {
              const val = e.target.value;
              onChange({ w: val ? Math.max(0, Number(val)) : undefined });
            }}
            className="input-sm"
          />
        </div>

        <div className="control">
          <label>Height (mm)</label>
          <input
            type="number"
            min="0"
            value={props.h || ""}
            placeholder="Auto"
            onChange={(e) => {
              const val = e.target.value;
              onChange({ h: val ? Math.max(0, Number(val)) : undefined });
            }}
            className="input-sm"
          />
        </div>

        {/* Alignment */}
        <div className="control">
          <label>Alignment</label>
          <select
            value={props.align || "left"}
            onChange={(e) => onChange({ align: e.target.value })}
            className="select-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Advanced Layout (Simplified) */}
        <div className="control">
          <label>Behavior</label>
          <select
            value={props.sizing || "auto"}
            onChange={(e) => onChange({ sizing: e.target.value })}
            className="select-sm"
          >
            <option value="auto">Natural Size</option>
            <option value="fit">Fit Container</option>
            <option value="fill">Fill Width</option>
          </select>
        </div>
      </div>
    </>
  );
};
