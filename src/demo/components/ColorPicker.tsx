import React from "react";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
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

  return (
    <div className="control relative" ref={containerRef}>
      <label>{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hstack gap-2 border p-2 rounded bg-white cursor-pointer items-center min-h-9"
      >
        <div
          className="rounded border"
          style={{
            width: "20px",
            height: "20px",
            background:
              value ||
              "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEACJ98y/GfABYhIsgAJAAnuO/yX8X8DJACOYfzfAAkgIwAAOfEHBSp+8N4AAAAASUVORK5CYII=)",
          }}
        />
        <span className={`text-xs ${value ? "text-main" : "text-muted"}`}>
          {value ? `${hex} (${Math.round(alpha * 100)}%)` : "None"}
        </span>
      </div>

      {isOpen && (
        <div className="card vstack gap-3 shadow-lg absolute top-full left-0 z-max mt-1 p-3 bg-white border w-52">
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
      )}
    </div>
  );
};
