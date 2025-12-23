import React from "react";
import { PdfItemType } from "../types";

export interface BuilderControlsProps {
  onAddItem: (type: PdfItemType) => void;
  onClearAll: () => void;
}

export const BuilderControls: React.FC<BuilderControlsProps> = ({
  onAddItem,
  onClearAll,
}) => {
  return (
    <div className="hstack gap-2 wrap">
      <button className="btn btn-sm" onClick={() => onAddItem("text")}>
        + Text
      </button>
      <button className="btn btn-sm" onClick={() => onAddItem("image")}>
        + Image
      </button>
      <button className="btn btn-sm" onClick={() => onAddItem("list")}>
        + List
      </button>
      <button className="btn btn-sm" onClick={() => onAddItem("table")}>
        + Table
      </button>
      <button className="btn btn-sm" onClick={() => onAddItem("view")}>
        + View
      </button>
      <button className="btn btn-sm outline" onClick={onClearAll}>
        Clear All
      </button>
    </div>
  );
};
