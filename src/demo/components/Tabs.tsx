import React from "react";
import { DemoTab } from "../types";

export interface TabsProps {
  activeTab: DemoTab;
  setActiveTab: (tab: DemoTab) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${activeTab === "demo" ? "active" : ""}`}
        onClick={() => setActiveTab("demo")}
      >
        Interactive Demo
      </button>
      <button
        className={`tab-btn ${activeTab === "docs" ? "active" : ""}`}
        onClick={() => setActiveTab("docs")}
      >
        Library Documentation
      </button>
    </div>
  );
};
