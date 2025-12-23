import React, { useEffect, useRef, useState } from "react";

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
  const [hasScroll, setHasScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setHasScroll(
          scrollRef.current.scrollHeight > scrollRef.current.clientHeight
        );
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [code, style]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-block ${className}`} style={style}>
      <div className="code-scroll" ref={scrollRef}>
        <pre>{code}</pre>
      </div>
      <button
        className={`copy-btn ${hasScroll ? "has-scroll" : ""}`}
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};
