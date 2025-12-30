import React, { useState, useEffect } from "react";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { PropertyPanel } from "./components/PropertyPanel/PropertyPanel";
import { PreviewModal } from "./components/PreviewModal/PreviewModal";
import { useNewsletter } from "./context/NewsletterContext";
import { createComponent } from "./utils/componentRegistry";
import type { ComponentType } from "./types";

export const NewsLetterBuilder: React.FC = () => {
  const { addComponent, state, undo, redo } = useNewsletter();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleComponentAdd = (type: ComponentType) => {
    const newComponent = createComponent(type);
    addComponent(newComponent);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden -m-8 -mb-16"
      style={{ width: "calc(100% + 64px)", height: "calc(100% + 64px)" }}
    >
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPreview={handlePreview}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onComponentAdd={handleComponentAdd} />
        <Canvas viewMode={viewMode} />
        <PropertyPanel />
      </div>
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={state.name}
        components={state.components}
      />
    </div>
  );
};
