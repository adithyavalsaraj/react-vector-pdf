import React from "react";
import { DemoMode } from "../types";

interface ViewToggleProps {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${mode === "preview" ? "active" : ""}`}
        onClick={() => setMode("preview")}
      >
        Live Preview
      </button>
      <button
        className={`toggle-btn ${mode === "code" ? "active" : ""}`}
        onClick={() => setMode("code")}
      >
        View Code
      </button>
    </div>
  );
};
