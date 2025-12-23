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
    <div className="builder-list vstack gap-2">
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
  );
};
