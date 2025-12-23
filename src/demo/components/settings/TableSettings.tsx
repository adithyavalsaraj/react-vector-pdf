import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface TableSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  striped: boolean;
  setStriped: (val: boolean) => void;
  borderWidth: string;
  setBorderWidth: (val: string) => void;
  headerColor: string;
  setHeaderColor: (val: string) => void;
}

export const TableSettings: React.FC<TableSettingsProps> = (props) => {
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
            id="tableEnabled"
            checked={props.enabled}
            onChange={(e) => props.setEnabled(e.target.checked)}
          />
          <label
            htmlFor="tableEnabled"
            className="text-sm font-bold uppercase text-muted m-0"
          >
            Table Options
          </label>
        </div>
      </div>

      {props.enabled && (
        <div className="grid grid-3">
          <div className="control">
            <label>Striped Rows</label>
            <select
              value={props.striped ? "true" : "false"}
              onChange={(e) => props.setStriped(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="control">
            <label>Border Width</label>
            <input
              value={props.borderWidth}
              onChange={(e) => props.setBorderWidth(e.target.value)}
            />
          </div>
          <ColorPicker
            label="Header Color"
            value={props.headerColor}
            onChange={(val) => props.setHeaderColor(val || "#f3f4f6")}
          />
        </div>
      )}
    </div>
  );
};
