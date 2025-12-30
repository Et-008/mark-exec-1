import React, { useRef, useEffect } from "react";
import { TextComponentProps } from "../../types";
import { TextInput } from "flowbite-react";

interface TextComponentRenderProps {
  component: TextComponentProps;
  isSelected: boolean;
  isEditing: boolean;
  onContentChange?: (content: string) => void;
}

export const TextComponent: React.FC<TextComponentRenderProps> = ({
  component,
  isSelected,
  isEditing,
  onContentChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const componentStyles: React.CSSProperties = {
    fontSize: `${component.fontSize}px`,
    fontFamily: component.fontFamily,
    color: component.color,
    textAlign: component.alignment,
    lineHeight: component.lineHeight,
    ...component.styles,
  };

  useEffect(() => {
    if (contentRef.current && isEditing) {
      contentRef.current.focus();
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

  return (
    <div
      ref={contentRef}
      className={`p-2 inline-block min-h-[24px] outline-none transition-all duration-200 focus:outline-2 focus:outline-blue-600 dark:focus:outline-blue-500 focus:outline-offset-2 [&_p]:m-0 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_strong]:font-bold [&_em]:italic [&_u]:underline`}
      style={componentStyles}
      contentEditable={isEditing}
      suppressContentEditableWarning
      // onInput={handleInput}
      onPaste={handlePaste}
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: component.content }}
    />
  );
};
