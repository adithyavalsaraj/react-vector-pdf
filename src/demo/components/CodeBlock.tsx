import React, { useState } from "react";

interface CodeBlockProps {
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
    <div className={`code-block ${className}`} style={style}>
      <div className="code-scroll">
        <pre>{code}</pre>
      </div>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};
