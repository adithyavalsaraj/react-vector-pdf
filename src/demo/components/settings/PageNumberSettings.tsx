import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface PageNumberSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  pos: "header" | "footer";
  setPos: (val: "header" | "footer") => void;
  align: "left" | "center" | "right";
  setAlign: (val: "left" | "center" | "right") => void;
  preset: string;
  setPreset: (val: any) => void;
  template: string;
  setTemplate: (val: string) => void;
  format: string;
  setFormat: (val: any) => void;
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

export const PageNumberSettings: React.FC<PageNumberSettingsProps> = (
  props
) => {
  return (
    <div className="vstack">
      <h3>Page Numbers</h3>
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
          <label>Align</label>
          <select
            value={props.align}
            onChange={(e) => props.setAlign(e.target.value as any)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="control">
          <label>Preset</label>
          <select
            value={props.preset}
            onChange={(e) => props.setPreset(e.target.value as any)}
          >
            <option value="page-slash-total">Page 1/10</option>
            <option value="slash">1/10</option>
            <option value="page-of-total">Page 1 of 10</option>
          </select>
          <small className="mono">
            If template is set, it overrides preset.
          </small>
        </div>
        <div className="control">
          <label>Custom Template</label>
          <input
            placeholder="e.g., Pg {page} / {total}"
            value={props.template}
            onChange={(e) => props.setTemplate(e.target.value)}
          />
        </div>
        <div className="control">
          <label>Format</label>
          <select
            value={props.format}
            onChange={(e) => props.setFormat(e.target.value as any)}
          >
            <option value="arabic">Arabic (1,2,3)</option>
            <option value="roman-upper">Roman Upper (I, II, III)</option>
            <option value="roman-lower">Roman Lower (i, ii, iii)</option>
          </select>
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
            placeholder="e.g., 2,3,5"
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
