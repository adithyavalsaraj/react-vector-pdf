import React from "react";

export interface TextItemEditorProps {
  props: any;
  onChange: (updates: any) => void;
}

export const TextItemEditor: React.FC<TextItemEditorProps> = ({
  props,
  onChange,
}) => {
  const isRichNode = typeof props.children === "object" && props.children !== null;

  return (
    <div className="editor-group-container">
      <div className="editor-row">
        <div className="editor-field flex-1">
          <label className="editor-label">CSS Class Utilities</label>
          <input
            type="text"
            value={props.className || ""}
            onChange={(e) => onChange({ className: e.target.value })}
            placeholder="e.g., text-lg font-bold text-indigo-600 mb-2"
            className="premium-input"
          />
        </div>
      </div>

      <div className="editor-row mt-3">
        <div className="editor-field flex-1">
          <label className="editor-label">Text Content</label>
          {isRichNode ? (
            <div className="rich-badge-alert">
              <span className="sparkle-icon">✨</span>
              <div className="rich-badge-content">
                <strong>Rich Spans Active:</strong> This text block contains advanced inline spans, weights, colors, and hyperlinks. You can edit its source code in the <strong>"React Code"</strong> tab, or clear this item to type plain text.
              </div>
            </div>
          ) : (
            <textarea
              rows={3}
              value={props.children || ""}
              onChange={(e) => onChange({ children: e.target.value })}
              className="premium-textarea"
              placeholder="Enter paragraph text..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
