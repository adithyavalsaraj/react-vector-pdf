import React, { useState } from "react";
import { ColorPicker } from "../ColorPicker";

export interface SettingsPanelProps {
  // Filename
  filename: string;
  setFilename: (val: string) => void;

  // Metadata & Layout
  metadata: any;
  setMetadata: (val: any) => void;
  layout: any;
  setLayout: (val: any) => void;
  margins: any;
  setMargins: (val: any) => void;
  typography: any;
  setTypography: (val: any) => void;
  baseColor: string;
  setBaseColor: (val: string) => void;
  autoSave: boolean;
  setAutoSave: (val: boolean) => void;

  // Header Settings
  headerEnabled: boolean;
  setHeaderEnabled: (val: boolean) => void;
  headerText: string;
  setHeaderText: (val: string) => void;
  headerAlign: "left" | "center" | "right";
  setHeaderAlign: (val: "left" | "center" | "right") => void;
  headerColor: string;
  setHeaderColor: (val: string) => void;
  headerFontSize: string;
  setHeaderFontSize: (val: string) => void;
  headerBorder: boolean;
  setHeaderBorder: (val: boolean) => void;
  headerBorderColor: string;
  setHeaderBorderColor: (val: string) => void;

  // Footer Settings
  footerEnabled: boolean;
  setFooterEnabled: (val: boolean) => void;
  footerText: string;
  setFooterText: (val: string) => void;
  footerAlign: "left" | "center" | "right";
  setFooterAlign: (val: "left" | "center" | "right") => void;
  footerColor: string;
  setFooterColor: (val: string) => void;
  footerFontSize: string;
  setFooterFontSize: (val: string) => void;
  footerBorder: boolean;
  setFooterBorder: (val: boolean) => void;
  footerBorderColor: string;
  setFooterBorderColor: (val: string) => void;

  // Page Numbers
  pnEnabled: boolean;
  setPnEnabled: (val: boolean) => void;
  pnPos: "header" | "footer";
  setPnPos: (val: "header" | "footer") => void;
  pnAlign: "left" | "center" | "right";
  setPnAlign: (val: "left" | "center" | "right") => void;
  pnPreset: string;
  setPnPreset: (val: any) => void;
  pnTemplate: string;
  setPnTemplate: (val: string) => void;
  pnFormat: "arabic" | "roman-upper" | "roman-lower";
  setPnFormat: (val: any) => void;
  pnY: string;
  setPnY: (val: string) => void;
  pnOffsetX: string;
  setPnOffsetX: (val: string) => void;
  pnFontSize: string;
  setPnFontSize: (val: string) => void;
  pnColor: string;
  setPnColor: (val: string) => void;

  // Center Label
  clEnabled: boolean;
  setClEnabled: (val: boolean) => void;
  clPos: "header" | "footer";
  setClPos: (val: "header" | "footer") => void;
  clText: string;
  setClText: (val: string) => void;
  clY: string;
  setClY: (val: string) => void;
  clOffsetX: string;
  setClOffsetX: (val: string) => void;
  clFontSize: string;
  setClFontSize: (val: string) => void;
  clColor: string;
  setClColor: (val: string) => void;

  // Defaults Table/Image
  tableEnabled: boolean;
  setTableEnabled: (val: boolean) => void;
  tableStriped: boolean;
  setTableStriped: (val: boolean) => void;
  tableBorderWidth: string;
  setTableBorderWidth: (val: string) => void;
  tableHeaderColor: string;
  setTableHeaderColor: (val: string) => void;

  imgEnabled: boolean;
  setImgEnabled: (val: boolean) => void;
  imgLayout: "fixed" | "flow";
  setImgLayout: (val: "fixed" | "flow") => void;
  imgSizing: "fit" | "fill" | "auto";
  setImgSizing: (val: "fit" | "fill" | "auto") => void;

  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = (s) => {
  const [activeSec, setActiveSec] = useState<string | null>("global");

  const toggleSection = (id: string) => {
    setActiveSec(activeSec === id ? null : id);
  };

  const sections = [
    {
      id: "global",
      title: "Document Canvas Setup",
      desc: "Page dimensions, orientation, & base theme variables",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
        </svg>
      ),
    },
    {
      id: "header",
      title: "Document Header Block",
      desc: "Top margin label block & borders",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="4" x2="21" y2="4" />
          <rect x="3" y="8" width="18" height="12" rx="2" />
        </svg>
      ),
    },
    {
      id: "footer",
      title: "Document Footer Block",
      desc: "Bottom label variables & brand borders",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="3" y1="20" x2="21" y2="20" />
        </svg>
      ),
    },
    {
      id: "pagenumbers",
      title: "Page Number Settings",
      desc: "Enable automatic counters & presets",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      id: "centerlabel",
      title: "Watermark / Center Stamps",
      desc: "CONFIDENTIAL / DRAFT stamp presets",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      id: "elements",
      title: "Defaults & Extensions",
      desc: "Tabular formatting & Image default scaling",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="premium-settings-panel">
      <div className="settings-header">
        <h3 className="settings-panel-title">Studio Configurations</h3>
        <button className="btn btn-ghost btn-xs text-muted" onClick={s.onReset}>
          Reset Defaults
        </button>
      </div>

      <div className="settings-accordion">
        {sections.map((sec) => {
          const isOpen = activeSec === sec.id;
          return (
            <div key={sec.id} className={`accordion-card ${isOpen ? "open" : ""}`}>
              <button
                className="accordion-trigger"
                onClick={() => toggleSection(sec.id)}
                aria-expanded={isOpen}
              >
                <div className="trigger-lead">
                  <span className="trigger-icon">{sec.icon}</span>
                  <div className="trigger-meta">
                    <span className="trigger-title">{sec.title}</span>
                    <span className="trigger-desc">{sec.desc}</span>
                  </div>
                </div>
                <span className="trigger-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {isOpen ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="accordion-content">
                  {/* GLOBAL CANVAS CONTENT */}
                  {sec.id === "global" && (
                    <div className="vstack gap-3 pt-2">
                      <div className="editor-row gap-3">
                        <div className="editor-field flex-1">
                          <label className="editor-label">Save Filename</label>
                          <input
                            type="text"
                            value={s.filename}
                            onChange={(e) => s.setFilename(e.target.value)}
                            className="premium-input"
                          />
                        </div>
                      </div>

                      <div className="editor-row gap-3">
                        <div className="editor-field flex-1">
                          <label className="editor-label">Page Layout Format</label>
                          <select
                            value={s.layout.format}
                            onChange={(e) => s.setLayout({ ...s.layout, format: e.target.value })}
                            className="premium-select"
                          >
                            <option value="a4">Standard A4 Sheet</option>
                            <option value="letter">US Letter Portrait</option>
                            <option value="legal">US Legal Document</option>
                            <option value="a3">Standard A3 Sheet</option>
                          </select>
                        </div>
                        <div className="editor-field flex-1">
                          <label className="editor-label">Orientation</label>
                          <select
                            value={s.layout.orientation}
                            onChange={(e) => s.setLayout({ ...s.layout, orientation: e.target.value })}
                            className="premium-select"
                          >
                            <option value="p">Portrait (Vertical)</option>
                            <option value="l">Landscape (Horizontal)</option>
                          </select>
                        </div>
                      </div>

                      <div className="editor-row gap-3">
                        <div className="editor-field flex-1">
                          <ColorPicker
                            label="Document Theme Base Color"
                            value={s.baseColor}
                            onChange={(val) => s.setBaseColor(val || "")}
                          />
                        </div>
                      </div>

                      <div className="editor-section-card mt-2">
                        <h4 className="editor-section-title">Margins (mm)</h4>
                        <div className="grid grid-4 gap-2 mt-2">
                          <div className="editor-field">
                            <label className="editor-label text-center">Top</label>
                            <input
                              type="number"
                              value={s.margins.top}
                              onChange={(e) => s.setMargins({ ...s.margins, top: Number(e.target.value) })}
                              className="premium-input text-center"
                            />
                          </div>
                          <div className="editor-field">
                            <label className="editor-label text-center">Bottom</label>
                            <input
                              type="number"
                              value={s.margins.bottom}
                              onChange={(e) => s.setMargins({ ...s.margins, bottom: Number(e.target.value) })}
                              className="premium-input text-center"
                            />
                          </div>
                          <div className="editor-field">
                            <label className="editor-label text-center">Left</label>
                            <input
                              type="number"
                              value={s.margins.left}
                              onChange={(e) => s.setMargins({ ...s.margins, left: Number(e.target.value) })}
                              className="premium-input text-center"
                            />
                          </div>
                          <div className="editor-field">
                            <label className="editor-label text-center">Right</label>
                            <input
                              type="number"
                              value={s.margins.right}
                              onChange={(e) => s.setMargins({ ...s.margins, right: Number(e.target.value) })}
                              className="premium-input text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="editor-section-card mt-2">
                        <h4 className="editor-section-title">Global Typography</h4>
                        <div className="editor-row gap-3 mt-2">
                          <div className="editor-field flex-1">
                            <label className="editor-label">Font Family</label>
                            <select
                              value={s.typography.fontName}
                              onChange={(e) => s.setTypography({ ...s.typography, fontName: e.target.value })}
                              className="premium-select"
                            >
                              <option value="helvetica">Helvetica (Sans-Serif)</option>
                              <option value="times">Times Roman (Serif)</option>
                              <option value="courier">Courier (Monospace)</option>
                            </select>
                          </div>
                          <div className="editor-field w-20">
                            <label className="editor-label">Size (pt)</label>
                            <input
                              type="number"
                              value={s.typography.fontSize}
                              onChange={(e) => s.setTypography({ ...s.typography, fontSize: Number(e.target.value) })}
                              className="premium-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENT HEADER CONTENT */}
                  {sec.id === "header" && (
                    <div className="vstack gap-3 pt-2">
                      <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={s.headerEnabled}
                          onChange={(e) => s.setHeaderEnabled(e.target.checked)}
                          className="premium-checkbox"
                        />
                        <span>Enable Document-wide Header</span>
                      </label>

                      {s.headerEnabled && (
                        <div className="vstack gap-3 mt-2 border-top pt-3">
                          <div className="editor-field">
                            <label className="editor-label">Header Title Text</label>
                            <input
                              type="text"
                              value={s.headerText}
                              onChange={(e) => s.setHeaderText(e.target.value)}
                              className="premium-input"
                            />
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Horizontal Alignment</label>
                              <select
                                value={s.headerAlign}
                                onChange={(e) => s.setHeaderAlign(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                            <div className="editor-field w-24">
                              <label className="editor-label">Font Size</label>
                              <input
                                type="number"
                                value={s.headerFontSize}
                                onChange={(e) => s.setHeaderFontSize(e.target.value)}
                                className="premium-input"
                              />
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <ColorPicker
                                label="Header Text Color"
                                value={s.headerColor}
                                onChange={(val) => s.setHeaderColor(val || "")}
                              />
                            </div>
                          </div>

                          <div className="editor-section-card mt-2">
                            <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                              <input
                                type="checkbox"
                                checked={s.headerBorder}
                                onChange={(e) => s.setHeaderBorder(e.target.checked)}
                                className="premium-checkbox"
                              />
                              <span>Draw Bottom Border Divider</span>
                            </label>

                            {s.headerBorder && (
                              <div className="mt-2">
                                <ColorPicker
                                  label="Border Stroke Color"
                                  value={s.headerBorderColor}
                                  onChange={(val) => s.setHeaderBorderColor(val || "")}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DOCUMENT FOOTER CONTENT */}
                  {sec.id === "footer" && (
                    <div className="vstack gap-3 pt-2">
                      <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={s.footerEnabled}
                          onChange={(e) => s.setFooterEnabled(e.target.checked)}
                          className="premium-checkbox"
                        />
                        <span>Enable Document-wide Footer</span>
                      </label>

                      {s.footerEnabled && (
                        <div className="vstack gap-3 mt-2 border-top pt-3">
                          <div className="editor-field">
                            <label className="editor-label">Footer Label Text</label>
                            <input
                              type="text"
                              value={s.footerText}
                              onChange={(e) => s.setFooterText(e.target.value)}
                              className="premium-input"
                            />
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Horizontal Alignment</label>
                              <select
                                value={s.footerAlign}
                                onChange={(e) => s.setFooterAlign(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                            <div className="editor-field w-24">
                              <label className="editor-label">Font Size</label>
                              <input
                                type="number"
                                value={s.footerFontSize}
                                onChange={(e) => s.setFooterFontSize(e.target.value)}
                                className="premium-input"
                              />
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <ColorPicker
                                label="Footer Text Color"
                                value={s.footerColor}
                                onChange={(val) => s.setFooterColor(val || "")}
                              />
                            </div>
                          </div>

                          <div className="editor-section-card mt-2">
                            <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                              <input
                                type="checkbox"
                                checked={s.footerBorder}
                                onChange={(e) => s.setFooterBorder(e.target.checked)}
                                className="premium-checkbox"
                              />
                              <span>Draw Top Border Divider</span>
                            </label>

                            {s.footerBorder && (
                              <div className="mt-2">
                                <ColorPicker
                                  label="Border Stroke Color"
                                  value={s.footerBorderColor}
                                  onChange={(val) => s.setFooterBorderColor(val || "")}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PAGE NUMBERS */}
                  {sec.id === "pagenumbers" && (
                    <div className="vstack gap-3 pt-2">
                      <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={s.pnEnabled}
                          onChange={(e) => s.setPnEnabled(e.target.checked)}
                          className="premium-checkbox"
                        />
                        <span>Enable Automatic Page Numbers</span>
                      </label>

                      {s.pnEnabled && (
                        <div className="vstack gap-3 mt-2 border-top pt-3">
                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Position</label>
                              <select
                                value={s.pnPos}
                                onChange={(e) => s.setPnPos(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="header">Top (Header zone)</option>
                                <option value="footer">Bottom (Footer zone)</option>
                              </select>
                            </div>
                            <div className="editor-field flex-1">
                              <label className="editor-label">Alignment</label>
                              <select
                                value={s.pnAlign}
                                onChange={(e) => s.setPnAlign(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Template Preset</label>
                              <select
                                value={s.pnPreset}
                                onChange={(e) => s.setPnPreset(e.target.value)}
                                className="premium-select"
                              >
                                <option value="page-slash-total">Page 1 / 10</option>
                                <option value="slash">1 / 10</option>
                                <option value="page-of-total">Page 1 of 10</option>
                              </select>
                            </div>
                            <div className="editor-field flex-1">
                              <label className="editor-label">Number System</label>
                              <select
                                value={s.pnFormat}
                                onChange={(e) => s.setPnFormat(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="arabic">Arabic (1, 2, 3)</option>
                                <option value="roman-upper">Roman (I, II, III)</option>
                                <option value="roman-lower">Roman (i, ii, iii)</option>
                              </select>
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <ColorPicker
                                label="Number Color"
                                value={s.pnColor}
                                onChange={(val) => s.setPnColor(val || "")}
                              />
                            </div>
                            <div className="editor-field w-20">
                              <label className="editor-label">Font Size</label>
                              <input
                                type="number"
                                value={s.pnFontSize}
                                onChange={(e) => s.setPnFontSize(e.target.value)}
                                className="premium-input"
                              />
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Vertical Offset Y (mm)</label>
                              <input
                                type="number"
                                value={s.pnY}
                                onChange={(e) => s.setPnY(e.target.value)}
                                className="premium-input"
                                placeholder="Auto"
                              />
                            </div>
                            <div className="editor-field flex-1">
                              <label className="editor-label">Horiz Offset X (mm)</label>
                              <input
                                type="number"
                                value={s.pnOffsetX}
                                onChange={(e) => s.setPnOffsetX(e.target.value)}
                                className="premium-input"
                                placeholder="Auto"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CENTER WATERMARK LABEL */}
                  {sec.id === "centerlabel" && (
                    <div className="vstack gap-3 pt-2">
                      <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={s.clEnabled}
                          onChange={(e) => s.setClEnabled(e.target.checked)}
                          className="premium-checkbox"
                        />
                        <span>Enable Page Watermark Label</span>
                      </label>

                      {s.clEnabled && (
                        <div className="vstack gap-3 mt-2 border-top pt-3">
                          <div className="editor-field">
                            <label className="editor-label">Watermark Text</label>
                            <input
                              type="text"
                              value={s.clText}
                              onChange={(e) => s.setClText(e.target.value)}
                              className="premium-input"
                            />
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <label className="editor-label">Stamp Position</label>
                              <select
                                value={s.clPos}
                                onChange={(e) => s.setClPos(e.target.value as any)}
                                className="premium-select"
                              >
                                <option value="header">Top header zone</option>
                                <option value="footer">Bottom footer zone</option>
                              </select>
                            </div>
                          </div>

                          <div className="editor-row gap-3">
                            <div className="editor-field flex-1">
                              <ColorPicker
                                label="Watermark Color"
                                value={s.clColor}
                                onChange={(val) => s.setClColor(val || "")}
                              />
                            </div>
                            <div className="editor-field w-20">
                              <label className="editor-label">Font Size</label>
                              <input
                                type="number"
                                value={s.clFontSize}
                                onChange={(e) => s.setClFontSize(e.target.value)}
                                className="premium-input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ELEMENTS & DEFAULTS */}
                  {sec.id === "elements" && (
                    <div className="vstack gap-3 pt-2">
                      {/* Tables */}
                      <div className="editor-section-card">
                        <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={s.tableEnabled}
                            onChange={(e) => s.setTableEnabled(e.target.checked)}
                            className="premium-checkbox"
                          />
                          <strong className="text-sm">Activate Tabular Styling Rules</strong>
                        </label>

                        {s.tableEnabled && (
                          <div className="vstack gap-3 mt-2 border-top pt-3">
                            <label className="hstack gap-2 cursor-pointer items-center text-sm">
                              <input
                                type="checkbox"
                                checked={s.tableStriped}
                                onChange={(e) => s.setTableStriped(e.target.checked)}
                                className="premium-checkbox animate-none"
                              />
                              <span>Stripe alternating table rows</span>
                            </label>

                            <div className="editor-row gap-3">
                              <div className="editor-field flex-1">
                                <label className="editor-label">Default Border Width (mm)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={s.tableBorderWidth}
                                  onChange={(e) => s.setTableBorderWidth(e.target.value)}
                                  className="premium-input"
                                />
                              </div>
                            </div>

                            <div className="editor-row gap-3">
                              <div className="editor-field flex-1">
                                <ColorPicker
                                  label="Table Header Background Color"
                                  value={s.tableHeaderColor}
                                  onChange={(val) => s.setTableHeaderColor(val || "")}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Images */}
                      <div className="editor-section-card mt-3">
                        <label className="hstack gap-2 cursor-pointer items-center text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={s.imgEnabled}
                            onChange={(e) => s.setImgEnabled(e.target.checked)}
                            className="premium-checkbox"
                          />
                          <strong className="text-sm">Activate Default Image Scaling Rules</strong>
                        </label>

                        {s.imgEnabled && (
                          <div className="vstack gap-3 mt-2 border-top pt-3">
                            <div className="editor-row gap-3">
                              <div className="editor-field flex-1">
                                <label className="editor-label">Image Flow Type</label>
                                <select
                                  value={s.imgLayout}
                                  onChange={(e) => s.setImgLayout(e.target.value as any)}
                                  className="premium-select"
                                >
                                  <option value="fixed">Absolute (Overlay)</option>
                                  <option value="flow">Standard Flow Inline</option>
                                </select>
                              </div>
                              <div className="editor-field flex-1">
                                <label className="editor-label">Sizing Behavior</label>
                                <select
                                  value={s.imgSizing}
                                  onChange={(e) => s.setImgSizing(e.target.value as any)}
                                  className="premium-select"
                                >
                                  <option value="fit">Fit Container</option>
                                  <option value="fill">Fill Width</option>
                                  <option value="auto">Natural aspect</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
