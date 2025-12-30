import React, { useState, useEffect } from "react";
import { HtmlComponentProps } from "../../types";

interface HtmlComponentRenderProps {
  component: HtmlComponentProps;
  isSelected: boolean;
  isEditing?: boolean;
  onContentChange?: (content: string) => void;
  onUpdate?: (updates: Partial<HtmlComponentProps>) => void;
}

export const HtmlComponent: React.FC<HtmlComponentRenderProps> = ({
  component,
  isSelected,
  isEditing = false,
  onContentChange,
  onUpdate,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editableContent, setEditableContent] = useState(component.content);

  // Sync editableContent when component.content changes externally
  useEffect(() => {
    setEditableContent(component.content);
  }, [component.content]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContentChange) {
      onContentChange(editableContent);
    }
    setShowEditor(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditableContent(component.content);
    setShowEditor(false);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: component.minHeight ? `${component.minHeight}px` : "50px",
    position: "relative",
    ...component.styles,
  };

  if (showEditor) {
    return (
      <div
        style={containerStyles}
        className="p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Raw HTML Editor
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        <textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          className="w-full min-h-[200px] p-3 border border-gray-400 dark:border-gray-600 rounded-md text-sm font-mono bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
          placeholder="Enter your HTML code here..."
          spellCheck={false}
        />
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-300">
          ⚠️ Be careful with raw HTML. Invalid code may break the newsletter layout.
        </div>
      </div>
    );
  }

  return (
    <div
      style={containerStyles}
      className={`relative transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setShowEditor(true);
      }}
    >
      {component.content ? (
        <div dangerouslySetInnerHTML={{ __html: component.content }} />
      ) : (
        <div className="flex items-center justify-center min-h-[100px] text-center p-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
          <div>
            <div className="text-3xl mb-2 opacity-50">{"</>"}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 m-0">
              Double-click to edit HTML
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 m-0 mt-1">
              or use the property panel
            </p>
          </div>
        </div>
      )}
      {isSelected && !showEditor && component.content && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEditor(true);
          }}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md transition-colors z-10"
        >
          Edit HTML
        </button>
      )}
    </div>
  );
};

