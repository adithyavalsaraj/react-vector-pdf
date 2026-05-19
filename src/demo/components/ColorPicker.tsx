import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ColorPickerProps {
  label: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const parseValue = (val?: string) => {
    if (!val) return { hex: "#000000", alpha: 1 };
    if (val.length === 9) {
      return {
        hex: val.slice(0, 7),
        alpha: parseInt(val.slice(7, 9), 16) / 255,
      };
    }
    return { hex: val, alpha: 1 };
  };

  const { hex, alpha } = parseValue(value);

  // Position calculation
  useEffect(() => {
    if (isOpen && containerRef.current && popupRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      let top = rect.bottom + window.scrollY + 4;
      let left = rect.left + window.scrollX;

      // Check vertical space (bottom)
      if (rect.bottom + popupRect.height + 10 > window.innerHeight) {
        // Render above if not enough space below
        top = rect.top + window.scrollY - popupRect.height - 4;
      }

      // Check horizontal space (right)
      if (left + popupRect.width + 10 > window.innerWidth) {
        // Shift left
        left = window.innerWidth - popupRect.width - 10;
      }

      setCoords({ top, left });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleHexChange = (newHex: string) => {
    const aa = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    onChange(newHex + aa);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const aa = Math.round(newAlpha * 255)
      .toString(16)
      .padStart(2, "0");
    onChange(hex + aa);
  };

  const popupContent = (
    <div
      ref={popupRef}
      className="card vstack gap-3 shadow-lg p-3 bg-white border w-52"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        zIndex: 99999, // Ensure it's on top of everything
        visibility: coords.top === 0 ? "hidden" : "visible", // Hide until positioned
      }}
    >
      <div className="hstack justify-between">
        <span className="text-xs font-bold">Picker</span>
        <label className="hstack gap-1 text-xs cursor-pointer m-0">
          <input
            type="checkbox"
            checked={!value}
            onChange={(e) =>
              onChange(e.target.checked ? undefined : hex + "ff")
            }
          />
          None
        </label>
      </div>

      {!value ? (
        <div className="vstack border-dashed rounded-md h-24 items-center justify-center text-muted text-xs">
          Inherited / None
        </div>
      ) : (
        <div className="vstack gap-3">
          <input
            type="color"
            className="w-full cursor-pointer h-9 p-0 border-none"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
          />
          <div className="vstack gap-1">
            <div className="hstack justify-between">
              <label className="text-xs m-0">Opacity</label>
              <span className="text-xs">{Math.round(alpha * 100)}%</span>
            </div>
            <input
              type="range"
              className="cursor-pointer"
              min="0"
              max="1"
              step="0.01"
              value={alpha}
              onChange={(e) =>
                handleAlphaChange(parseFloat(e.target.value))
              }
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="control relative" ref={containerRef}>
      <label>{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hstack gap-2 border p-2 rounded bg-white cursor-pointer items-center max-h-9"
      >
        <div
          className="rounded border color-swatch"
          style={
            value
              ? {
                  background: value,
                }
              : undefined
          }
        />
        <span className={`text-xs ${value ? "text-main" : "text-muted"}`}>
          {value ? `${hex} (${Math.round(alpha * 100)}%)` : "None"}
        </span>
      </div>

      {isOpen && typeof document !== "undefined"
        ? createPortal(popupContent, document.body)
        : null}
    </div>
  );
};
