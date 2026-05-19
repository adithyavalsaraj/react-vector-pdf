import React, { useState } from "react";

export interface CodeBlockProps {
  code: string;
  style?: React.CSSProperties;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  style,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`premium-code-container ${className}`} style={style}>
      <div className="code-header">
        <div className="code-header-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="code-header-title">ReactComponent.tsx</span>
        <button
          onClick={handleCopy}
          className="code-copy-btn"
          title="Copy to clipboard"
        >
          {copied ? (
            <span className="text-success hstack gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="hstack gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Code
            </span>
          )}
        </button>
      </div>
      <div className="code-body-scroll custom-scrollbar">
        <pre className="code-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
