import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface TableSettingsProps {
  striped: boolean;
  setStriped: (val: boolean) => void;
  borderWidth: string;
  setBorderWidth: (val: string) => void;
  headerColor: string;
  setHeaderColor: (val: string) => void;
}

export const TableSettings: React.FC<TableSettingsProps> = (props) => {
  return (
    <div className="vstack">
      <h3>Table Options</h3>
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
    </div>
  );
};
