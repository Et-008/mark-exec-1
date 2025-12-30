import React, { useRef, useEffect, useState } from "react";
import { ParagraphComponentProps } from "../../types";

interface ParagraphComponentRenderProps {
  component: ParagraphComponentProps;
  isSelected: boolean;
  isEditing: boolean;
  onContentChange?: (content: string) => void;
  onUpdate?: (updates: Partial<ParagraphComponentProps>) => void;
}

export const ParagraphComponent: React.FC<ParagraphComponentRenderProps> = ({
  component,
  isSelected,
  isEditing,
  onContentChange,
  onUpdate,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);

  const componentStyles: React.CSSProperties = {
    fontSize: `${component.fontSize}px`,
    fontFamily: component.fontFamily,
    color: component.color,
    textAlign: component.alignment,
    lineHeight: component.lineHeight,
    padding: "8px",
    minHeight: "40px",
    ...component.styles,
  };

  useEffect(() => {
    if (contentRef.current && isEditing) {
      contentRef.current.focus();
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, [isEditing]);

  const handleInput = () => {
    if (contentRef.current && onContentChange) {
      onContentChange(contentRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const handleBlur = () => {
    if (contentRef.current && onContentChange) {
      onContentChange(contentRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdate) {
      onUpdate({ fontSize: parseInt(e.target.value) });
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdate) {
      onUpdate({ fontFamily: e.target.value });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate({ color: e.target.value });
    }
  };

  const handleAlignmentChange = (
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    if (onUpdate) {
      onUpdate({ alignment });
    }
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    title: string;
    icon: string;
    active?: boolean;
  }> = ({ onClick, title, icon, active }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        active
          ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
          : "border-gray-300 dark:border-gray-600"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`relative transition-all duration-200 ${
        isSelected ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
      }`}
    >
      {/* Rich Text Editor Toolbar */}
      {showToolbar && isEditing && (
        <div className="absolute -top-28 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-10 flex flex-wrap gap-1 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => execCommand("bold")}
              title="Bold (Ctrl+B)"
              icon="B"
            />
            <ToolbarButton
              onClick={() => execCommand("italic")}
              title="Italic (Ctrl+I)"
              icon="I"
            />
            <ToolbarButton
              onClick={() => execCommand("underline")}
              title="Underline (Ctrl+U)"
              icon="U"
            />
            <ToolbarButton
              onClick={() => execCommand("strikeThrough")}
              title="Strikethrough"
              icon="S"
            />
          </div>

          {/* Subscript & Superscript */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => execCommand("subscript")}
              title="Subscript"
              icon="X₂"
            />
            <ToolbarButton
              onClick={() => execCommand("superscript")}
              title="Superscript"
              icon="X²"
            />
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => execCommand("insertUnorderedList")}
              title="Bullet List"
              icon="•"
            />
            <ToolbarButton
              onClick={() => execCommand("insertOrderedList")}
              title="Numbered List"
              icon="1."
            />
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <ToolbarButton
              onClick={() => handleAlignmentChange("left")}
              title="Align Left"
              icon="⬅"
              active={component.alignment === "left"}
            />
            <ToolbarButton
              onClick={() => handleAlignmentChange("center")}
              title="Align Center"
              icon="↔"
              active={component.alignment === "center"}
            />
            <ToolbarButton
              onClick={() => handleAlignmentChange("right")}
              title="Align Right"
              icon="➡"
              active={component.alignment === "right"}
            />
            <ToolbarButton
              onClick={() => handleAlignmentChange("justify")}
              title="Justify"
              icon="⬌"
              active={component.alignment === "justify"}
            />
          </div>

          {/* Font Size */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <select
              value={component.fontSize}
              onChange={handleFontSizeChange}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Font Size"
            >
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map(
                (size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                )
              )}
            </select>
          </div>

          {/* Font Family */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <select
              value={component.fontFamily}
              onChange={handleFontFamilyChange}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              title="Font Family"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              <option value="Impact, fantasy">Impact</option>
            </select>
          </div>

          {/* Text Color */}
          <div className="flex gap-1 items-center">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="color"
                value={component.color}
                onChange={handleColorChange}
                className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                title="Text Color"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Color
              </span>
            </label>
          </div>

          {/* Emoji hint */}
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: Paste emojis directly
          </div>
        </div>
      )}

      {/* Content Area */}
      <div
        ref={contentRef}
        className={`outline-none transition-all duration-200 focus:outline-2 focus:outline-blue-600 dark:focus:outline-blue-500 focus:outline-offset-2
          [&_p]:m-0 [&_p]:mb-2 [&_p:last-child]:mb-0
          [&_strong]:font-bold [&_b]:font-bold
          [&_em]:italic [&_i]:italic
          [&_u]:underline
          [&_s]:line-through
          [&_sub]:text-xs [&_sub]:align-sub
          [&_sup]:text-xs [&_sup]:align-super
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
          [&_li]:mb-1
          [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline
        `}
        style={componentStyles}
        contentEditable={isEditing}
        suppressContentEditableWarning
        // onInput={handleInput}
        onPaste={handlePaste}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: component.content }}
      />
    </div>
  );
};
