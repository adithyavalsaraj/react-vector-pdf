import React from "react";
import { PdfItem } from "../types";
import { ImageItemEditor } from "./editors/ImageItemEditor";
import { ListItemEditor } from "./editors/ListItemEditor";
import { TableItemEditor } from "./editors/TableItemEditor";
import { TextItemEditor } from "./editors/TextItemEditor";
import { ViewItemEditor } from "./editors/ViewItemEditor";

export interface BuilderItemProps {
  item: PdfItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PdfItem>) => void;
  onUpdateProps: (id: string, propUpdates: any) => void;
}

export const BuilderItem: React.FC<BuilderItemProps> = ({
  item,
  index,
  onRemove,
  onUpdate,
  onUpdateProps,
}) => {
  const renderEditor = () => {
    const commonProps = {
      props: item.props,
      onChange: (updates: any) => onUpdateProps(item.id, updates),
    };

    switch (item.type) {
      case "text":
        return <TextItemEditor {...commonProps} />;
      case "image":
        return <ImageItemEditor {...commonProps} />;
      case "list":
        return <ListItemEditor {...commonProps} />;
      case "table":
        return <TableItemEditor {...commonProps} />;
      case "view":
        return <ViewItemEditor {...commonProps} />;
      case "svg":
        return (
          <div className="premium-editor-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Vector SVG shape automatically rendered (Custom Star Preset).</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article className="premium-builder-item shadow-sm">
      <header className="item-header">
        <div className="item-meta">
          <span className="item-index">{index + 1}</span>
          <span className="item-type-badge">{item.type.toUpperCase()}</span>
        </div>
        <div className="item-actions">
          <div className="custom-select-wrapper">
            <select
              className="premium-select select-xs"
              value={item.showInAllPages ? "true" : "false"}
              title="Page recurrence mode"
              onChange={(e) =>
                onUpdate(item.id, {
                  showInAllPages: e.target.value === "true",
                })
              }
            >
              <option value="false">Once (Flow)</option>
              <option value="true">Recurring</option>
            </select>
          </div>
          
          {item.showInAllPages && (
            <div className="custom-select-wrapper">
              <select
                className="premium-select select-xs"
                value={item.scope || "all"}
                title="Define pages scope"
                onChange={(e) => onUpdate(item.id, { scope: e.target.value })}
              >
                <option value="all">Every Page</option>
                <option value="except-first">Except First</option>
                <option value="first-only">First Only</option>
              </select>
            </div>
          )}
          
          <button
            className="btn btn-ghost btn-xs text-danger"
            onClick={() => onRemove(item.id)}
            title="Delete this block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </header>
      
      <main className="item-body">
        {renderEditor()}
      </main>
    </article>
  );
};
