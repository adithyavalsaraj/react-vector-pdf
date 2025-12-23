import React from "react";

export interface ImageSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  layout: "fixed" | "flow";
  setLayout: (val: "fixed" | "flow") => void;
  sizing: "fit" | "fill" | "auto";
  setSizing: (val: "fit" | "fill" | "auto") => void;
}

export const ImageSettings: React.FC<ImageSettingsProps> = (props) => {
  return (
    <div className="card p-4 border rounded-md">
      <div
        className={`hstack justify-between items-center ${
          props.enabled ? "mb-4" : ""
        }`}
      >
        <div className="hstack gap-2 items-center">
          <input
            className="w-5 h-5"
            type="checkbox"
            id="imgEnabled"
            checked={props.enabled}
            onChange={(e) => props.setEnabled(e.target.checked)}
          />
          <label
            htmlFor="imgEnabled"
            className="text-sm font-bold uppercase text-muted m-0"
          >
            Image Options (Global Defaults)
          </label>
        </div>
      </div>

      {props.enabled && (
        <div className="grid grid-3">
          <div className="control">
            <label>Layout</label>
            <select
              value={props.layout}
              onChange={(e) => props.setLayout(e.target.value as any)}
            >
              <option value="fixed">Fixed (Absolute)</option>
              <option value="flow">Flow (Automatic)</option>
            </select>
          </div>
          <div className="control">
            <label>Default Sizing</label>
            <select
              value={props.sizing}
              onChange={(e) => props.setSizing(e.target.value as any)}
            >
              <option value="fit">Fit Container</option>
              <option value="fill">Fill Container</option>
              <option value="auto">Auto (Original)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
