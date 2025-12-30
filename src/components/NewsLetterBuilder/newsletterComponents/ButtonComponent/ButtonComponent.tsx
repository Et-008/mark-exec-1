import React, { useRef } from "react";
import { ButtonComponentProps } from "../../types";

interface ButtonComponentRenderProps {
  component: ButtonComponentProps;
  isSelected: boolean;
  onTextChange?: (text: string) => void;
}

export const ButtonComponent: React.FC<ButtonComponentRenderProps> = ({
  component,
  isSelected,
  onTextChange,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  const containerStyles: React.CSSProperties = {
    textAlign: component.alignment,
    padding: "16px 8px",
    ...component.styles,
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: component.backgroundColor,
    color: component.textColor,
    borderRadius: `${component.borderRadius}px`,
    padding: component.padding,
    fontSize: `${component.fontSize}px`,
    width: component.width,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
    transition: "all 0.2s ease",
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    if (onTextChange) {
      onTextChange(textRef.current?.textContent || "");
    }
  };

  return (
    <div
      className={`transition-all duration-200 ${
        isSelected ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
      }`}
      style={containerStyles}
    >
      <a
        href={component.href}
        style={buttonStyles}
        className="hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
      >
        <span
          ref={textRef}
          contentEditable={isSelected}
          suppressContentEditableWarning
          // onInput={handleInput}
          onBlur={handleInput}
          style={{ outline: "none" }}
        >
          {component.text}
        </span>
      </a>
    </div>
  );
};
