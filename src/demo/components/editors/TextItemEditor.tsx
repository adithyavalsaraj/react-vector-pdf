import React from "react";

export interface TextItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const TextItemEditor: React.FC<TextItemEditorProps> = ({
  props,
  onChange,
}) => {
  return (
    <div className="control col-span-3 vstack gap-2">
      <div className="hstack justify-between">
        <label className="font-bold">Text Configuration</label>
      </div>

      <div className="control">
        <label>CSS Class</label>
        <input
          type="text"
          value={props.className || ""}
          onChange={(e) => onChange({ className: e.target.value })}
          placeholder="e.g. text-lg font-bold text-blue-600"
          className="input-sm"
        />
      </div>

      <div className="control">
        <label>Text Content</label>
        <textarea
          rows={3}
          value={props.children}
          onChange={(e) => onChange({ children: e.target.value })}
          className="input-sm"
        />
      </div>
    </div>
  );
};
