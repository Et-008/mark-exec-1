import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import {
  LayoutComponentProps,
  NewsletterComponent,
  ComponentType,
} from "../../types";
import {
  TextComponent,
  HeadingComponent,
  ImageComponent,
  ButtonComponent,
  DividerComponent,
  SpacerComponent,
  SocialLinksComponent,
  ParagraphComponent,
  HtmlComponent,
} from "../index";
import { useNewsletter } from "../../context/NewsletterContext";

// ============================================
// Nested Layout Component (for one-level nesting)
// ============================================
interface NestedLayoutComponentProps {
  component: LayoutComponentProps;
  isSelected: boolean;
  onUpdate?: (updates: Partial<NewsletterComponent>) => void;
  parentColumnIndex: number;
  onSelect?: () => void;
}

const NestedLayoutComponent: React.FC<NestedLayoutComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onSelect,
}) => {
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);
  const isVertical = component.direction === "vertical";

  const containerStyles: React.CSSProperties = {
    backgroundColor: component.backgroundColor || "transparent",
    padding: component.padding || "8px",
    ...component.styles,
  };

  const getDefaultWidths = () => {
    const numCols = component.columns.length;
    return Array(numCols).fill(`${(100 / numCols).toFixed(2)}%`);
  };

  const columnWidths =
    component.columnWidths?.length === component.columns.length
      ? component.columnWidths
      : getDefaultWidths();

  const columnsContainerStyles: React.CSSProperties = isVertical
    ? {
        display: "flex",
        flexDirection: "column",
        gap: `${component.gap || 12}px`,
      }
    : {
        display: "grid",
        gridTemplateColumns: columnWidths.join(" "),
        gap: `${component.gap || 12}px`,
      };

  const createNestedComponent = (type: ComponentType): NewsletterComponent => {
    const id = uuidv4();
    const baseComponent = { id, type, styles: {} };

    switch (type) {
      case "text":
        return {
          ...baseComponent,
          type: "text",
          content: "Nested text...",
          fontSize: 14,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
        };
      case "heading":
        return {
          ...baseComponent,
          type: "heading",
          text: "Nested Heading",
          level: 3,
          fontSize: 18,
          color: "#000000",
          alignment: "left",
          fontWeight: 600,
        };
      case "paragraph":
        return {
          ...baseComponent,
          type: "paragraph",
          content: "<p>Nested paragraph...</p>",
          fontSize: 14,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
          backgroundColor: "transparent",
        };
      case "image":
        return {
          ...baseComponent,
          type: "image",
          src: "https://via.placeholder.com/200x100",
          alt: "Nested image",
          width: "100%",
          alignment: "center",
          borderRadius: 0,
        };
      case "button":
        return {
          ...baseComponent,
          type: "button",
          text: "Button",
          href: "#",
          backgroundColor: "#007bff",
          textColor: "#ffffff",
          borderRadius: 4,
          padding: "8px 16px",
          fontSize: 14,
          alignment: "center",
        };
      case "divider":
        return {
          ...baseComponent,
          type: "divider",
          style: "solid",
          color: "#e5e7eb",
          thickness: 1,
          width: "100%",
          marginTop: 8,
          marginBottom: 8,
        };
      case "spacer":
        return { ...baseComponent, type: "spacer", height: 16 };
      case "socialLinks":
        return {
          ...baseComponent,
          type: "socialLinks",
          platforms: [],
          iconSize: 24,
          spacing: 8,
          alignment: "center",
          iconStyle: "circular",
        };
      case "html":
        return {
          ...baseComponent,
          type: "html",
          content: '<div style="padding: 10px;">Custom HTML</div>',
          minHeight: 50,
        };
      default:
        return {
          ...baseComponent,
          type: "text",
          content: "Content",
          fontSize: 14,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
        };
    }
  };

  const handleAddComponent = (columnIndex: number, type: ComponentType) => {
    if (!onUpdate) return;
    const newComponent = createNestedComponent(type);
    const newColumns = [...component.columns];
    newColumns[columnIndex] = [...newColumns[columnIndex], newComponent];
    onUpdate({ columns: newColumns });
    setShowAddMenu(null);
  };

  const handleRemoveComponent = (columnIndex: number, componentId: string) => {
    if (!onUpdate) return;
    const newColumns = [...component.columns];
    newColumns[columnIndex] = newColumns[columnIndex].filter(
      (c) => c.id !== componentId
    );
    onUpdate({ columns: newColumns });
  };

  const handleComponentUpdate = (
    columnIndex: number,
    componentId: string,
    updates: Partial<NewsletterComponent>
  ) => {
    if (!onUpdate) return;
    const newColumns = component.columns.map((col, idx) =>
      idx === columnIndex
        ? col.map((c) =>
            c.id === componentId
              ? ({ ...c, ...updates } as NewsletterComponent)
              : c
          )
        : col
    );
    onUpdate({ columns: newColumns });
  };

  const renderNestedComponent = (
    comp: NewsletterComponent,
    columnIndex: number
  ) => {
    const handleUpdate = (updates: Partial<NewsletterComponent>) => {
      handleComponentUpdate(columnIndex, comp.id, updates);
    };

    switch (comp.type) {
      case "text":
        return (
          <TextComponent
            component={comp}
            isSelected={false}
            isEditing={false}
            onContentChange={(content) => handleUpdate({ content })}
          />
        );
      case "heading":
        return (
          <HeadingComponent
            component={comp}
            isSelected={false}
            isEditing={false}
            onTextChange={(text) => handleUpdate({ text })}
          />
        );
      case "image":
        return (
          <ImageComponent
            component={comp}
            isSelected={false}
            onImageChange={(src) => handleUpdate({ src })}
          />
        );
      case "button":
        return (
          <ButtonComponent
            component={comp}
            isSelected={false}
            onTextChange={(text) => handleUpdate({ text })}
          />
        );
      case "divider":
        return <DividerComponent component={comp} isSelected={false} />;
      case "spacer":
        return <SpacerComponent component={comp} isSelected={false} />;
      case "socialLinks":
        return <SocialLinksComponent component={comp} isSelected={false} />;
      case "paragraph":
        return (
          <ParagraphComponent
            component={comp}
            isSelected={false}
            isEditing={false}
            onContentChange={(content) => handleUpdate({ content })}
            onUpdate={handleUpdate}
          />
        );
      case "html":
        return (
          <HtmlComponent
            component={comp}
            isSelected={false}
            isEditing={false}
            onContentChange={(content) => handleUpdate({ content })}
            onUpdate={handleUpdate}
          />
        );
      default:
        return <div className="text-xs text-gray-500">Unsupported</div>;
    }
  };

  const nestedComponentOptions = [
    { type: "text" as ComponentType, label: "Text", icon: "📝" },
    { type: "paragraph" as ComponentType, label: "Paragraph", icon: "📄" },
    { type: "heading" as ComponentType, label: "Heading", icon: "📰" },
    { type: "image" as ComponentType, label: "Image", icon: "🖼️" },
    { type: "button" as ComponentType, label: "Button", icon: "🔘" },
    { type: "divider" as ComponentType, label: "Divider", icon: "➖" },
    { type: "spacer" as ComponentType, label: "Spacer", icon: "↕️" },
    { type: "socialLinks" as ComponentType, label: "Social", icon: "🔗" },
    { type: "html" as ComponentType, label: "HTML", icon: "</>" },
  ];

  return (
    <div
      className={`relative transition-all duration-200 min-h-[60px] rounded-md border-2 cursor-pointer ${
        isSelected
          ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 shadow-[0_0_0_2px_rgba(168,85,247,0.3)]"
          : "border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
      }`}
      style={containerStyles}
      onClick={(e) => {
        // Don't stop propagation - let parent handle selection
        // Just close the add menu if open
        setShowAddMenu(null);
        // Call onSelect to ensure this nested layout is selected
        if (onSelect) {
          onSelect();
        }
      }}
    >
      {/* Nested Layout Badge */}
      <div
        className={`absolute top-1 right-1 ${
          isSelected
            ? "bg-purple-600 dark:bg-purple-500"
            : "bg-purple-400 dark:bg-purple-600"
        } text-white text-[10px] px-1.5 py-0.5 rounded z-10 flex items-center gap-1`}
      >
        <span>{isVertical ? "↕" : "↔"}</span>
        <span>
          Nested {component.columns.length}
          {isVertical ? "R" : "C"}
        </span>
      </div>

      <div style={columnsContainerStyles} className="mt-5">
        {component.columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="min-h-[50px] p-1.5 border border-dashed border-gray-200 dark:border-gray-700 rounded bg-white/50 dark:bg-gray-800/50"
          >
            {/* Add Button */}
            <div className="mb-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddMenu(
                    showAddMenu === columnIndex ? null : columnIndex
                  );
                }}
                className="w-full py-1 px-2 text-[10px] font-medium bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center justify-center gap-1"
              >
                <span>+</span> Add
              </button>

              {showAddMenu === columnIndex && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-30 max-h-[200px] overflow-y-auto">
                  {nestedComponentOptions.map((item) => (
                    <button
                      key={item.type}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddComponent(columnIndex, item.type);
                      }}
                      className="w-full px-2 py-1.5 text-left text-xs hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center gap-1.5 text-gray-800 dark:text-gray-200"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column Content */}
            {column.length === 0 ? (
              <div className="text-[10px] text-gray-400 text-center py-2">
                Empty
              </div>
            ) : (
              column.map((comp) => (
                <div
                  key={comp.id}
                  className="relative my-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveComponent(columnIndex, comp.id);
                    }}
                    className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-none cursor-pointer items-center justify-center z-10 hidden group-hover:flex hover:bg-red-600"
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="p-1 text-sm">
                    {renderNestedComponent(comp, columnIndex)}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {component.columns.every((col) => col.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-5">
          <p className="text-[10px] text-gray-400 m-0">
            Nested {isVertical ? "vertical" : "horizontal"} layout
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// Main Layout Component
// ============================================

interface LayoutComponentRenderProps {
  component: LayoutComponentProps;
  isSelected: boolean;
  onUpdate?: (updates: Partial<LayoutComponentProps>) => void;
  onComponentUpdate?: (
    columnIndex: number,
    componentId: string,
    updates: Partial<NewsletterComponent>
  ) => void;
  onComponentRemove?: (columnIndex: number, componentId: string) => void;
}

export const LayoutComponent: React.FC<LayoutComponentRenderProps> = ({
  component,
  isSelected,
  onUpdate,
  onComponentUpdate,
  onComponentRemove,
}) => {
  const { state, selectNestedComponent } = useNewsletter();
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

  // Check if a nested component in this layout is selected
  const selectedNestedComponent =
    state.selectedNestedComponent?.layoutId === component.id
      ? state.selectedNestedComponent
      : null;

  const isVertical = component.direction === "vertical";

  const containerStyles: React.CSSProperties = {
    backgroundColor: component.backgroundColor,
    padding: component.padding,
    ...component.styles,
  };

  // Generate default column widths if not provided
  const getDefaultWidths = () => {
    const numCols = component.columns.length;
    return Array(numCols).fill(`${(100 / numCols).toFixed(2)}%`);
  };

  const columnWidths =
    component.columnWidths?.length === component.columns.length
      ? component.columnWidths
      : getDefaultWidths();

  const columnsContainerStyles: React.CSSProperties = isVertical
    ? {
        display: "flex",
        flexDirection: "column",
        gap: `${component.gap || 16}px`,
      }
    : {
        display: "grid",
        gridTemplateColumns: columnWidths.join(" "),
        gap: `${component.gap || 16}px`,
      };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onUpdate) return;

    const sourceColIndex = parseInt(result.source.droppableId.split("-")[1]);
    const destColIndex = parseInt(result.destination.droppableId.split("-")[1]);

    const newColumns = component.columns.map((col) => [...col]);

    // Get the dragged item
    const [draggedItem] = newColumns[sourceColIndex].splice(
      result.source.index,
      1
    );

    // Add to destination
    newColumns[destColIndex].splice(result.destination.index, 0, draggedItem);

    onUpdate({ columns: newColumns });
  };

  const handleComponentRemoveFromColumn = (
    columnIndex: number,
    componentId: string
  ) => {
    if (onComponentRemove) {
      onComponentRemove(columnIndex, componentId);
    }
  };

  const createDefaultComponent = (type: ComponentType): NewsletterComponent => {
    const id = uuidv4();
    const baseComponent = { id, type, styles: {} };

    switch (type) {
      case "text":
        return {
          ...baseComponent,
          type: "text",
          content: "Enter your text here...",
          fontSize: 16,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
        };
      case "heading":
        return {
          ...baseComponent,
          type: "heading",
          text: "Heading",
          level: 2,
          fontSize: 24,
          color: "#000000",
          alignment: "left",
          fontWeight: 700,
        };
      case "paragraph":
        return {
          ...baseComponent,
          type: "paragraph",
          content: "<p>Enter your paragraph here...</p>",
          fontSize: 16,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
          backgroundColor: "transparent",
        };
      case "image":
        return {
          ...baseComponent,
          type: "image",
          src: "https://via.placeholder.com/400x200",
          alt: "Placeholder image",
          width: "100%",
          alignment: "center",
          borderRadius: 0,
        };
      case "button":
        return {
          ...baseComponent,
          type: "button",
          text: "Click Here",
          href: "#",
          backgroundColor: "#007bff",
          textColor: "#ffffff",
          borderRadius: 4,
          padding: "12px 24px",
          fontSize: 16,
          alignment: "center",
        };
      case "divider":
        return {
          ...baseComponent,
          type: "divider",
          style: "solid",
          color: "#e5e7eb",
          thickness: 1,
          width: "100%",
          marginTop: 16,
          marginBottom: 16,
        };
      case "spacer":
        return {
          ...baseComponent,
          type: "spacer",
          height: 20,
        };
      case "socialLinks":
        return {
          ...baseComponent,
          type: "socialLinks",
          platforms: [],
          iconSize: 32,
          spacing: 12,
          alignment: "center",
          iconStyle: "circular",
        };
      case "html":
        return {
          ...baseComponent,
          type: "html",
          content:
            '<div style="padding: 20px; text-align: center;">\n  <h3>Custom HTML</h3>\n  <p>Edit this content</p>\n</div>',
          minHeight: 100,
        };
      case "layout":
        return {
          ...baseComponent,
          type: "layout",
          columns: [[], []],
          columnWidths: ["50%", "50%"],
          gap: 12,
          backgroundColor: "transparent",
          padding: "8px",
          direction: "horizontal",
          stackOnMobile: true,
        };
      default:
        return {
          ...baseComponent,
          type: "text",
          content: "Component",
          fontSize: 16,
          color: "#000000",
          alignment: "left",
          lineHeight: 1.5,
        };
    }
  };

  const handleAddComponentToColumn = (
    columnIndex: number,
    type: ComponentType
  ) => {
    if (!onUpdate) return;

    const newComponent = createDefaultComponent(type);
    const newColumns = [...component.columns];
    newColumns[columnIndex] = [...newColumns[columnIndex], newComponent];

    onUpdate({ columns: newColumns });
    setShowAddMenu(null);
    selectNestedComponent(component.id, columnIndex, newComponent.id);
  };

  const renderComponent = (
    comp: NewsletterComponent,
    columnIndex: number,
    isComponentSelected: boolean
  ) => {
    const handleComponentUpdate = (updates: Partial<NewsletterComponent>) => {
      if (onComponentUpdate) {
        onComponentUpdate(columnIndex, comp.id, updates);
      }
    };

    switch (comp.type) {
      case "text":
        return (
          <TextComponent
            component={comp}
            isSelected={isComponentSelected}
            isEditing={isComponentSelected}
            onContentChange={(content) => handleComponentUpdate({ content })}
          />
        );
      case "heading":
        return (
          <HeadingComponent
            component={comp}
            isSelected={isComponentSelected}
            isEditing={isComponentSelected}
            onTextChange={(text) => handleComponentUpdate({ text })}
          />
        );
      case "image":
        return (
          <ImageComponent
            component={comp}
            isSelected={isComponentSelected}
            onImageChange={(src) => handleComponentUpdate({ src })}
          />
        );
      case "button":
        return (
          <ButtonComponent
            component={comp}
            isSelected={isComponentSelected}
            onTextChange={(text) => handleComponentUpdate({ text })}
          />
        );
      case "divider":
        return (
          <DividerComponent component={comp} isSelected={isComponentSelected} />
        );
      case "spacer":
        return (
          <SpacerComponent component={comp} isSelected={isComponentSelected} />
        );
      case "socialLinks":
        return (
          <SocialLinksComponent
            component={comp}
            isSelected={isComponentSelected}
          />
        );
      case "paragraph":
        return (
          <ParagraphComponent
            component={comp}
            isSelected={isComponentSelected}
            isEditing={isComponentSelected}
            onContentChange={(content) => handleComponentUpdate({ content })}
            onUpdate={handleComponentUpdate}
          />
        );
      case "html":
        return (
          <HtmlComponent
            component={comp}
            isSelected={isComponentSelected}
            isEditing={isComponentSelected}
            onContentChange={(content) => handleComponentUpdate({ content })}
            onUpdate={handleComponentUpdate}
          />
        );
      case "layout":
        // Render nested layout (one level nesting supported)
        return (
          <NestedLayoutComponent
            component={comp}
            isSelected={isComponentSelected}
            onUpdate={handleComponentUpdate}
            parentColumnIndex={columnIndex}
            onSelect={() => {
              selectNestedComponent(component.id, columnIndex, comp.id);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-2 transition-all duration-200 min-h-[100px] relative ${
        isSelected
          ? "bg-blue-50/50 dark:bg-blue-900/20 outline-2 outline-blue-600 dark:outline-blue-500 outline-offset-2"
          : ""
      }`}
      style={containerStyles}
      onClick={() => setShowAddMenu(null)}
    >
      {/* Layout Info Badge */}
      {isSelected && (
        <div className="absolute top-1 right-1 bg-blue-600 dark:bg-blue-500 text-white text-xs px-2 py-1 rounded-md z-10 flex items-center gap-1">
          <span>{isVertical ? "↕" : "↔"}</span>
          <span>
            {component.columns.length} {isVertical ? "Row" : "Column"}
            {component.columns.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={columnsContainerStyles}>
          {component.columns.map((column, columnIndex) => (
            <Droppable
              key={`column-${columnIndex}`}
              droppableId={`column-${columnIndex}`}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[80px] p-2 border-2 border-dashed rounded-md transition-all duration-200 ${
                    snapshot.isDraggingOver
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  {/* Add Component Button */}
                  <div className="mb-2 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddMenu(
                          showAddMenu === columnIndex ? null : columnIndex
                        );
                      }}
                      className="w-full py-2 px-3 text-xs font-medium bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <span>+</span> Add Component
                    </button>

                    {/* Dropdown Menu */}
                    {showAddMenu === columnIndex && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 max-h-[300px] overflow-y-auto">
                        {[
                          {
                            type: "text" as ComponentType,
                            label: "Text",
                            icon: "📝",
                          },
                          {
                            type: "paragraph" as ComponentType,
                            label: "Paragraph",
                            icon: "📄",
                          },
                          {
                            type: "heading" as ComponentType,
                            label: "Heading",
                            icon: "📰",
                          },
                          {
                            type: "image" as ComponentType,
                            label: "Image",
                            icon: "🖼️",
                          },
                          {
                            type: "button" as ComponentType,
                            label: "Button",
                            icon: "🔘",
                          },
                          {
                            type: "divider" as ComponentType,
                            label: "Divider",
                            icon: "➖",
                          },
                          {
                            type: "spacer" as ComponentType,
                            label: "Spacer",
                            icon: "↕️",
                          },
                          {
                            type: "socialLinks" as ComponentType,
                            label: "Social Links",
                            icon: "🔗",
                          },
                          {
                            type: "html" as ComponentType,
                            label: "Raw HTML",
                            icon: "</>",
                          },
                          {
                            type: "layout" as ComponentType,
                            label: "Nested Layout",
                            icon: "📐",
                          },
                        ].map((item) => (
                          <button
                            key={item.type}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddComponentToColumn(
                                columnIndex,
                                item.type
                              );
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2 text-gray-800 dark:text-gray-200 transition-colors"
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {column.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[60px] text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
                        Click "Add Component" above
                      </p>
                    </div>
                  ) : (
                    column.map((comp, index) => {
                      const isComponentSelected =
                        selectedNestedComponent?.columnIndex === columnIndex &&
                        selectedNestedComponent?.componentId === comp.id;

                      return (
                        <Draggable
                          key={comp.id}
                          draggableId={comp.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative my-1 transition-all duration-200 border-2 rounded ${
                                isComponentSelected
                                  ? "border-blue-600 dark:border-blue-500 shadow-[0_0_0_1px_#2563eb] dark:shadow-[0_0_0_1px_#3b82f6]"
                                  : "border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                              } ${
                                snapshot.isDragging
                                  ? "opacity-80 shadow-lg dark:shadow-gray-950/50"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectNestedComponent(
                                  component.id,
                                  columnIndex,
                                  comp.id
                                );
                              }}
                            >
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-4 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity duration-200 bg-gray-300 dark:bg-gray-600 rounded text-[10px] text-gray-600 dark:text-gray-300"
                              >
                                ⋮⋮
                              </div>

                              {/* Delete Button */}
                              {isComponentSelected && (
                                <button
                                  className="absolute top-[-8px] right-[-8px] w-5 h-5 rounded-full bg-red-600 dark:bg-red-500 text-white text-sm leading-none cursor-pointer flex items-center justify-center z-10 transition-all duration-200 shadow-md hover:bg-red-700 dark:hover:bg-red-600 hover:scale-110"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleComponentRemoveFromColumn(
                                      columnIndex,
                                      comp.id
                                    );
                                  }}
                                  title="Delete"
                                >
                                  ×
                                </button>
                              )}

                              {/* Component Content */}
                              <div className="bg-white dark:bg-gray-900 rounded">
                                {renderComponent(
                                  comp,
                                  columnIndex,
                                  isComponentSelected
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Empty State */}
      {component.columns.every((col) => col.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-4">
            <div className="text-4xl mb-2 opacity-50">
              {isVertical ? "📊" : "📐"}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
              {isVertical ? "Vertical" : "Multi-column"} layout (
              {component.columns.length} {isVertical ? "rows" : "columns"})
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 m-0 mt-1">
              Click "Add Component" in any {isVertical ? "row" : "column"} to
              start
            </p>
          </div>
        </div>
      )}

      {/* Nested Component Info */}
      {isSelected && selectedNestedComponent && (
        <div className="absolute bottom-1 left-1 bg-green-600 dark:bg-green-500 text-white text-xs px-2 py-1 rounded-md z-10">
          Component selected in {isVertical ? "Row" : "Column"}{" "}
          {selectedNestedComponent.columnIndex + 1}
        </div>
      )}
    </div>
  );
};
