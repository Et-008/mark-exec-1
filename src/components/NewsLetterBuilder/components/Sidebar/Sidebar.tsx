import React from "react";
import { ComponentType } from "../../types";
import { componentLabels, componentIcons } from "../../utils/componentRegistry";

interface SidebarProps {
  onComponentAdd: (type: ComponentType) => void;
}

const componentTypes: ComponentType[] = [
  "layout",
  "divider",
  "spacer",
  "heading",
  "text",
  "button",
  "paragraph",
  "image",
  "socialLinks",
  "html",
];

export const Sidebar: React.FC<SidebarProps> = ({ onComponentAdd }) => {
  return (
    <div className="w-[220px] bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="m-0 text-base font-semibold text-gray-800 dark:text-gray-200">
          Components
        </h3>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        {componentTypes.map((type) => {
          const Icon = componentIcons[type];
          return (
            <button
              key={type}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all duration-200 text-left text-sm w-full hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/30 active:translate-y-0"
              onClick={() => onComponentAdd(type)}
              title={`Add ${componentLabels[type]}`}
            >
              <span className="text-2xl flex-shrink-0">
                <Icon size={24} />
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {componentLabels[type]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <p className="m-0 text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          Click to add components to your newsletter
        </p>
      </div>
    </div>
  );
};
