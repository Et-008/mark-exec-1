import React from 'react';
import { SpacerComponentProps } from '../../types';

interface SpacerComponentRenderProps {
  component: SpacerComponentProps;
  isSelected: boolean;
}

export const SpacerComponent: React.FC<SpacerComponentRenderProps> = ({
  component,
  isSelected,
}) => {
  const spacerStyles: React.CSSProperties = {
    height: `${component.height}px`,
  };

  return (
    <div
      className={`relative border-2 border-dashed transition-all duration-200 ${isSelected ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent'}`}
      style={spacerStyles}
    >
      {isSelected && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 py-0.5 px-2 rounded pointer-events-none">
          Spacer: {component.height}px
        </div>
      )}
    </div>
  );
};

