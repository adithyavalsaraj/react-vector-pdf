import React from "react";

export interface ImageItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const ImageItemEditor: React.FC<ImageItemEditorProps> = ({
  props,
  onChange,
}) => {
  return (
    <>
      <div className="control col-span-2">
        <label>Image URL</label>
        <input
          value={props.src}
          onChange={(e) => onChange({ src: e.target.value })}
        />
      </div>
      <div className="control">
        <label>Height</label>
        <input
          type="number"
          value={props.h}
          onChange={(e) => onChange({ h: Number(e.target.value) })}
        />
      </div>
    </>
  );
};
