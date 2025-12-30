import React from 'react';
import { DividerComponentProps } from '../../types';

interface DividerComponentRenderProps {
  component: DividerComponentProps;
  isSelected: boolean;
}

export const DividerComponent: React.FC<DividerComponentRenderProps> = ({
  component,
  isSelected,
}) => {
  const containerStyles: React.CSSProperties = {
    marginTop: `${component.marginTop}px`,
    marginBottom: `${component.marginBottom}px`,
    padding: '8px 0',
  };

  const dividerStyles: React.CSSProperties = {
    borderTop: `${component.thickness}px ${component.style} ${component.color}`,
    width: component.width,
    margin: '0 auto',
  };

  return (
    <div
      className={`relative transition-all duration-200 ${isSelected ? 'bg-blue-100/50 dark:bg-blue-900/20' : ''}`}
      style={containerStyles}
    >
      <hr className="border-none m-0" style={dividerStyles} />
    </div>
  );
};

