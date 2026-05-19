import React from "react";
import { PdfItem } from "../types";
import { BuilderItem } from "./BuilderItem";

export interface BuilderListProps {
  items: PdfItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PdfItem>) => void;
  onUpdateProps: (id: string, propUpdates: any) => void;
}

export const BuilderList: React.FC<BuilderListProps> = ({
  items,
  onRemove,
  onUpdate,
  onUpdateProps,
}) => {
  return (
    <div className="premium-builder-list">
      {items.length === 0 ? (
        <div className="premium-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          <p className="empty-title">Your sandbox is empty</p>
          <p className="empty-subtitle">Click any element block in the toolbox above to build your document structure.</p>
        </div>
      ) : (
        <div className="vstack gap-4">
          {items.map((it, idx) => (
            <BuilderItem
              key={it.id}
              index={idx}
              item={it}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onUpdateProps={onUpdateProps}
            />
          ))}
        </div>
      )}
    </div>
  );
};
