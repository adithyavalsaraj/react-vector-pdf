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
    <div className="control col-span-3">
      <label>Text Content</label>
      <textarea
        rows={3}
        value={props.children}
        onChange={(e) => onChange({ children: e.target.value })}
      />
    </div>
  );
};
