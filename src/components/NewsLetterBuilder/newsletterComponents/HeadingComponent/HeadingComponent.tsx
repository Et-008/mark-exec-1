import React from "react";
import { HeadingComponentProps } from "../../types";

interface HeadingComponentRenderProps {
  component: HeadingComponentProps;
  isSelected: boolean;
  isEditing: boolean;
  onTextChange?: (text: string) => void;
}

export const HeadingComponent: React.FC<HeadingComponentRenderProps> = ({
  component,
  isSelected,
  isEditing,
  onTextChange,
}) => {
  const HeadingTag = `h${component.level}` as keyof JSX.IntrinsicElements;

  const componentStyles: React.CSSProperties = {
    fontSize: `${component.fontSize}px`,
    fontFamily: component.fontFamily,
    color: component.color,
    textAlign: component.alignment,
    fontWeight: component.fontWeight,
    margin: 0,
    ...component.styles,
  };

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
    if (onTextChange) {
      onTextChange(e.currentTarget.textContent || "");
    }
  };

  const handleBlur = (e: React.FormEvent<HTMLHeadingElement>) => {
    if (onTextChange) {
      onTextChange(e.currentTarget.textContent || "");
    }
  };

  return (
    <HeadingTag
      className="p-2 outline-none transition-all duration-200 focus:outline-2 focus:outline-blue-600 dark:focus:outline-blue-500 focus:outline-offset-2"
      style={componentStyles}
      contentEditable={isEditing}
      suppressContentEditableWarning
      // onInput={handleInput}
      onBlur={handleBlur}
    >
      {component.text}
    </HeadingTag>
  );
};
