import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface CenterLabelSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  pos: "header" | "footer";
  setPos: (val: "header" | "footer") => void;
  text: string;
  setText: (val: string) => void;
  scope: string;
  setScope: (val: any) => void;
  customPages: string;
  setCustomPages: (val: string) => void;
  y: string;
  setY: (val: string) => void;
  offsetX: string;
  setOffsetX: (val: string) => void;
  fontSize: string;
  setFontSize: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
}

export const CenterLabelSettings: React.FC<CenterLabelSettingsProps> = (
  props
) => {
  return (
    <div className="vstack">
      <h3>Center Label (e.g., CONFIDENTIAL)</h3>
      <div className="grid grid-3">
        <div className="control">
          <label>Enabled</label>
          <select
            value={props.enabled ? "true" : "false"}
            onChange={(e) => props.setEnabled(e.target.value === "true")}
          >
            <option value="true">On</option>
            <option value="false">Off</option>
          </select>
        </div>
        <div className="control">
          <label>Position</label>
          <select
            value={props.pos}
            onChange={(e) => props.setPos(e.target.value as any)}
          >
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
        </div>
        <div className="control">
          <label>Text</label>
          <input
            value={props.text}
            onChange={(e) => props.setText(e.target.value)}
          />
        </div>

        <div className="control">
          <label>Scope</label>
          <select
            value={props.scope}
            onChange={(e) => props.setScope(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="first-only">First page only</option>
            <option value="except-first">All except first</option>
            <option value="custom">Custom pages</option>
          </select>
        </div>
        <div className="control">
          <label>Custom Pages (comma sep)</label>
          <input
            placeholder="e.g., 2,3"
            value={props.customPages}
            onChange={(e) => props.setCustomPages(e.target.value)}
          />
        </div>
        <div className="control">
          <label>Y (mm)</label>
          <input
            placeholder="auto"
            value={props.y}
            onChange={(e) => props.setY(e.target.value)}
          />
        </div>

        <div className="control">
          <label>OffsetX (mm)</label>
          <input
            placeholder="0"
            value={props.offsetX}
            onChange={(e) => props.setOffsetX(e.target.value)}
          />
        </div>
        <div className="control">
          <label>Font Size</label>
          <input
            placeholder="10"
            value={props.fontSize}
            onChange={(e) => props.setFontSize(e.target.value)}
          />
        </div>
        <ColorPicker
          label="Color"
          value={props.color}
          onChange={(val) => props.setColor(val || "#000000")}
        />
      </div>
    </div>
  );
};
