import { ColorPicker } from "../ColorPicker";

interface HeaderSettingsProps {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  text: string;
  setText: (val: string) => void;
  align: "left" | "center" | "right";
  setAlign: (val: "left" | "center" | "right") => void;
  color: string;
  setColor: (val: string) => void;
  fontSize: string;
  setFontSize: (val: string) => void;
  border: boolean;
  setBorder: (val: boolean) => void;
  borderColor: string;
  setBorderColor: (val: string) => void;
  scope: "all" | "first-only" | "except-first" | "custom";
  setScope: (val: any) => void;
  customPages: string;
  setCustomPages: (val: string) => void;
}

export const HeaderSettings: React.FC<HeaderSettingsProps> = (props) => {
  return (
    <div className="card p-4 border rounded-md">
      <div
        className={`hstack justify-between items-center ${
          props.enabled ? "mb-4" : ""
        }`}
      >
        <div className="hstack gap-2 items-center">
          <input
            className="w-5 h-5"
            type="checkbox"
            id="headerEnabled"
            checked={props.enabled}
            onChange={(e) => props.setEnabled(e.target.checked)}
          />
          <label
            htmlFor="headerEnabled"
            className="text-sm font-bold uppercase text-muted m-0"
          >
            Header Settings
          </label>
        </div>
        {props.enabled && (
          <div className="hstack gap-2">
            <select
              className="select-sm"
              value={props.scope}
              onChange={(e) => props.setScope(e.target.value as any)}
            >
              <option value="all">All Pages</option>
              <option value="first-only">First Only</option>
              <option value="except-first">Except First</option>
              <option value="custom">Custom</option>
            </select>
            {props.scope === "custom" && (
              <input
                className="input-sm"
                style={{ width: "120px" }}
                value={props.customPages}
                onChange={(e) => props.setCustomPages(e.target.value)}
                placeholder="e.g. 2,5"
              />
            )}
          </div>
        )}
      </div>

      {props.enabled && (
        <div className="grid grid-3">
          <div className="control">
            <label>Text</label>
            <input
              value={props.text}
              onChange={(e) => props.setText(e.target.value)}
            />
          </div>
          <div className="control">
            <label>Align</label>
            <select
              value={props.align}
              onChange={(e) => props.setAlign(e.target.value as any)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="control">
            <label>Font Size</label>
            <input
              value={props.fontSize}
              onChange={(e) => props.setFontSize(e.target.value)}
              placeholder="10"
            />
          </div>
          <ColorPicker
            label="Text Color"
            value={props.color}
            onChange={(val) => props.setColor(val || "#000000")}
          />

          <div className="control col-span-3 hstack gap-4 items-end border-t pt-2 mt-2">
            <div className="hstack gap-2 items-center">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="headerBorder"
                checked={props.border}
                onChange={(e) => props.setBorder(e.target.checked)}
              />
              <label htmlFor="headerBorder">Show Bottom Border</label>
            </div>
            {props.border && (
              <div className="flex-1">
                <ColorPicker
                  label="Border Color"
                  value={props.borderColor}
                  onChange={(val) => props.setBorderColor(val || "#e5e7eb")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
