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
      default:
        return null;
    }
  };

  return (
    <div className="builder-item card p-3 border rounded">
      <div className="hstack justify-between mb-2">
        <strong>
          {index + 1}. {item.type.toUpperCase()}
        </strong>
        <div className="hstack gap-2">
          <select
            className="select-sm w-auto"
            value={item.showInAllPages ? "true" : "false"}
            title="Recurring Item?"
            onChange={(e) =>
              onUpdate(item.id, {
                showInAllPages: e.target.value === "true",
              })
            }
          >
            <option value="false">Once (Flow)</option>
            <option value="true">Recurring</option>
          </select>
          {item.showInAllPages && (
            <select
              className="select-sm w-auto"
              value={item.scope || "all"}
              title="Page Scope"
              onChange={(e) => onUpdate(item.id, { scope: e.target.value })}
            >
              <option value="all">Every Page</option>
              <option value="except-first">Except First</option>
              <option value="first-only">First Only</option>
            </select>
          )}
          <button
            className="btn btn-sm danger"
            onClick={() => onRemove(item.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-3 gap-2">{renderEditor()}</div>
    </div>
  );
};
