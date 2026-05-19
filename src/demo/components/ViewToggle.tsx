import React from "react";
import { DemoMode } from "../types";

export interface ViewToggleProps {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="premium-toggle-group" role="tablist">
      <button
        className={`premium-toggle-btn ${mode === "preview" ? "active" : ""}`}
        onClick={() => setMode("preview")}
        role="tab"
        aria-selected={mode === "preview"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="toggle-icon">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>Live Canvas</span>
      </button>
      <button
        className={`premium-toggle-btn ${mode === "code" ? "active" : ""}`}
        onClick={() => setMode("code")}
        role="tab"
        aria-selected={mode === "code"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="toggle-icon">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span>React Code</span>
      </button>
    </div>
  );
};
