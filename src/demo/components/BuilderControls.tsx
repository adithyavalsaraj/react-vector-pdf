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
  const tools: { type: PdfItemType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      type: "text",
      label: "Rich Text",
      description: "Add spans, weights & links",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      type: "view",
      label: "Grid Row",
      description: "Multi-column responsive flex",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      ),
    },
    {
      type: "svg",
      label: "Vector SVG",
      description: "Draw scalable vector shapes",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      type: "table",
      label: "Data Table",
      description: "Structured tabular columns",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      type: "list",
      label: "Bullets List",
      description: "Multi-level item sequences",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      type: "image",
      label: "Cover Image",
      description: "Embed high-res assets",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="premium-controls-panel">
      <div className="controls-toolbox">
        {tools.map((tool) => (
          <button
            key={tool.type}
            className="toolbox-btn"
            onClick={() => onAddItem(tool.type)}
            title={tool.description}
          >
            <span className="toolbox-btn-icon">{tool.icon}</span>
            <div className="toolbox-btn-meta">
              <span className="toolbox-btn-title">{tool.label}</span>
              <span className="toolbox-btn-desc">{tool.description}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="controls-actions">
        <button className="btn btn-ghost btn-sm text-danger" onClick={onClearAll}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Clear All Sandbox Items
        </button>
      </div>
    </div>
  );
};
