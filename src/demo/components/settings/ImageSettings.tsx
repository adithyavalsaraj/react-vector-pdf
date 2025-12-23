import React from "react";

export interface ImageSettingsProps {
  layout: "flow" | "absolute";
  setLayout: (val: "flow" | "absolute") => void;
  sizing: "auto" | "fixed";
  setSizing: (val: "auto" | "fixed") => void;
}

export const ImageSettings: React.FC<ImageSettingsProps> = (props) => {
  return (
    <div className="vstack">
      <h3>Image Options (Global Defaults)</h3>
      <div className="grid grid-3">
        <div className="control">
          <label>Layout</label>
          <select
            value={props.layout}
            onChange={(e) => props.setLayout(e.target.value as any)}
          >
            <option value="flow">Flow (Automatic)</option>
            <option value="absolute">Absolute (Fixed)</option>
          </select>
        </div>
        <div className="control">
          <label>Default Sizing</label>
          <select
            value={props.sizing}
            onChange={(e) => props.setSizing(e.target.value as any)}
          >
            <option value="auto">Auto Aspect</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
