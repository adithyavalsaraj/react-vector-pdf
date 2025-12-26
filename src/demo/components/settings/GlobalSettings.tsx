import React from "react";
import { ColorPicker } from "../ColorPicker";

export interface GlobalSettingsProps {
  // Metadata
  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string;
  };
  setMetadata: (val: any) => void;

  // Layout
  layout: {
    format: string; // "a4", "letter"
    orientation: "p" | "l";
  };
  setLayout: (val: any) => void;

  // Margins
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  setMargins: (val: any) => void;

  // Typography
  typography: {
    fontSize: number;
    lineHeight: number;
    fontName: string;
  };
  setTypography: (val: any) => void;

  // Global Colors
  baseColor: string;
  setBaseColor: (val: string) => void;

  // Auto Save
  autoSave: boolean;
  setAutoSave: (val: boolean) => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({
  metadata,
  setMetadata,
  layout,
  setLayout,
  margins,
  setMargins,
  typography,
  setTypography,
  baseColor,
  setBaseColor,
  autoSave,
  setAutoSave,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="card p-4 border rounded-md vstack gap-4">
      <div
        className="hstack justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-bold uppercase text-muted m-0">
          Global Document Settings
        </h3>
        <span className="text-xs text-muted">
          {isOpen ? "Collapse" : "Expand"}
        </span>
      </div>

      {isOpen && (
        <div className="vstack gap-4">
          {/* Metadata Section */}
          <div className="vstack gap-2">
            <h4 className="text-xs font-bold uppercase text-gray-400">
              Metadata
            </h4>
            <div className="grid grid-2 gap-2">
              <div className="control">
                <label>Title</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) =>
                    setMetadata({ ...metadata, title: e.target.value })
                  }
                  className="input-sm"
                />
              </div>
              <div className="control">
                <label>Author</label>
                <input
                  type="text"
                  value={metadata.author}
                  onChange={(e) =>
                    setMetadata({ ...metadata, author: e.target.value })
                  }
                  className="input-sm"
                />
              </div>
              <div className="control col-span-2">
                <label>Subject</label>
                <input
                  type="text"
                  value={metadata.subject}
                  onChange={(e) =>
                    setMetadata({ ...metadata, subject: e.target.value })
                  }
                  className="input-sm"
                />
              </div>
              <div className="control col-span-2">
                <label>Keywords (comma separated)</label>
                <input
                  type="text"
                  value={metadata.keywords}
                  onChange={(e) =>
                    setMetadata({ ...metadata, keywords: e.target.value })
                  }
                  className="input-sm"
                />
              </div>
            </div>
          </div>

          <div className="hr" />

          {/* Layout Section */}
          <div className="vstack gap-2">
            <h4 className="text-xs font-bold uppercase text-gray-400">
              Page Layout
            </h4>
            <div className="grid grid-2 gap-2">
              <div className="control">
                <label>Format</label>
                <select
                  value={layout.format}
                  onChange={(e) =>
                    setLayout({ ...layout, format: e.target.value })
                  }
                  className="select-sm"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="a3">A3</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div className="control">
                <label>Orientation</label>
                <select
                  value={layout.orientation}
                  onChange={(e) =>
                    setLayout({ ...layout, orientation: e.target.value })
                  }
                  className="select-sm"
                >
                  <option value="p">Portrait</option>
                  <option value="l">Landscape</option>
                </select>
              </div>
            </div>

            {/* Margins */}
            <div className="control">
              <label>Margins (Top, Right, Bottom, Left) mm</label>
              <div className="grid grid-4 gap-2">
                <input
                  type="number"
                  value={margins.top}
                  onChange={(e) =>
                    setMargins({ ...margins, top: Number(e.target.value) })
                  }
                  className="input-sm"
                />
                <input
                  type="number"
                  value={margins.right}
                  onChange={(e) =>
                    setMargins({ ...margins, right: Number(e.target.value) })
                  }
                  className="input-sm"
                />
                <input
                  type="number"
                  value={margins.bottom}
                  onChange={(e) =>
                    setMargins({ ...margins, bottom: Number(e.target.value) })
                  }
                  className="input-sm"
                />
                <input
                  type="number"
                  value={margins.left}
                  onChange={(e) =>
                    setMargins({ ...margins, left: Number(e.target.value) })
                  }
                  className="input-sm"
                />
              </div>
            </div>
          </div>

          <div className="hr" />

          {/* Typography & Color */}
          <div className="vstack gap-2">
            <h4 className="text-xs font-bold uppercase text-gray-400">
              Typography & Style
            </h4>
            <div className="grid grid-2 gap-2">
              <div className="control">
                <label>Base Font Size (pt)</label>
                <input
                  type="number"
                  value={typography.fontSize}
                  onChange={(e) =>
                    setTypography({
                      ...typography,
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="input-sm"
                />
              </div>
              <div className="control">
                <label>Line Height</label>
                <input
                  type="number"
                  step="0.05"
                  value={typography.lineHeight}
                  onChange={(e) =>
                    setTypography({
                      ...typography,
                      lineHeight: Number(e.target.value),
                    })
                  }
                  className="input-sm"
                />
              </div>
              <ColorPicker
                label="Base Text Color"
                value={baseColor}
                onChange={(val) => setBaseColor(val || "#111827")}
              />
              <div className="control">
                <label>Auto Save?</label>
                <select
                  value={autoSave ? "yes" : "no"}
                  onChange={(e) => setAutoSave(e.target.value === "yes")}
                  className="select-sm"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
