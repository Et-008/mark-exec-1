import React, { useState } from "react";
import { useNewsletter } from "../../context/NewsletterContext";
import { FONT_FAMILIES, COLORS } from "../../utils/defaultStyles";
import { componentToHTML } from "../../utils/htmlExport";

export const PropertyPanel: React.FC = () => {
  const { state, updateComponent, removeComponent, duplicateComponent } =
    useNewsletter();
  const [showHtmlOutput, setShowHtmlOutput] = useState(false);
  const [isEditingHtml, setIsEditingHtml] = useState(false);
  const [editedHtml, setEditedHtml] = useState("");

  // Check if we have a nested component selected
  let selectedComponent = state.components.find(
    (c) => c.id === state.selectedComponentId
  );

  let isNested = false;
  let layoutComponent: any = null;

  if (state.selectedNestedComponent && selectedComponent?.type === "layout") {
    isNested = true;
    layoutComponent = selectedComponent;
    const nestedComp = (selectedComponent as any).columns[
      state.selectedNestedComponent.columnIndex
    ]?.find((c: any) => c.id === state.selectedNestedComponent?.componentId);
    if (nestedComp) {
      selectedComponent = nestedComp;
    }
  }

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
        <div className="py-10 px-5 text-center text-gray-500 dark:text-gray-400">
          <p className="m-0 text-sm leading-relaxed">
            Select a component to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: any) => {
    if (isNested && state.selectedNestedComponent && layoutComponent) {
      // Update nested component
      const newColumns = [...layoutComponent.columns];
      newColumns[state.selectedNestedComponent.columnIndex] = newColumns[
        state.selectedNestedComponent.columnIndex
      ].map((comp: any) =>
        comp.id === state.selectedNestedComponent?.componentId
          ? { ...comp, ...updates }
          : comp
      );
      updateComponent(layoutComponent.id, { columns: newColumns });
    } else {
      updateComponent(selectedComponent.id, updates);
    }
  };

  const handleRemove = () => {
    if (isNested && state.selectedNestedComponent && layoutComponent) {
      // Remove nested component
      const newColumns = [...layoutComponent.columns];
      newColumns[state.selectedNestedComponent.columnIndex] = newColumns[
        state.selectedNestedComponent.columnIndex
      ].filter((comp: any) => comp.id !== state.selectedNestedComponent?.componentId);
      updateComponent(layoutComponent.id, { columns: newColumns });
    } else {
      removeComponent(selectedComponent.id);
    }
  };

  const handleDuplicate = () => {
    if (isNested && state.selectedNestedComponent && layoutComponent) {
      // Duplicate nested component
      const columnIndex = state.selectedNestedComponent.columnIndex;
      const compIndex = layoutComponent.columns[columnIndex].findIndex(
        (c: any) => c.id === state.selectedNestedComponent?.componentId
      );
      if (compIndex !== -1) {
        const compToDuplicate = layoutComponent.columns[columnIndex][compIndex];
        const duplicated = JSON.parse(JSON.stringify(compToDuplicate));
        duplicated.id = require("uuid").v4();
        
        const newColumns = [...layoutComponent.columns];
        newColumns[columnIndex] = [...newColumns[columnIndex]];
        newColumns[columnIndex].splice(compIndex + 1, 0, duplicated);
        updateComponent(layoutComponent.id, { columns: newColumns });
      }
    } else {
      duplicateComponent(selectedComponent.id);
    }
  };

  const renderProperties = () => {
    const inputClass =
      "px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-md text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50";
    const labelClass =
      "text-[13px] font-semibold text-gray-700 dark:text-gray-300";
    const propertyGroupClass = "flex flex-col gap-1.5";

    switch (selectedComponent.type) {
      case "text":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Family</label>
              <select
                className={inputClass}
                value={selectedComponent.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font}>
                    {font.split(",")[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Size</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                min="8"
                max="72"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Line Height</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.lineHeight}
                onChange={(e) =>
                  handleUpdate({ lineHeight: parseFloat(e.target.value) })
                }
                min="1"
                max="3"
                step="0.1"
              />
            </div>
          </>
        );

      case "heading":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Heading Level</label>
              <select
                className={inputClass}
                value={selectedComponent.level}
                onChange={(e) =>
                  handleUpdate({ level: parseInt(e.target.value) })
                }
              >
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Size</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                min="12"
                max="72"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Weight</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.fontWeight}
                onChange={(e) =>
                  handleUpdate({ fontWeight: parseInt(e.target.value) })
                }
                min="100"
                max="900"
                step="100"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case "image":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Image URL</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.src}
                onChange={(e) => handleUpdate({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alt Text</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.alt}
                onChange={(e) => handleUpdate({ alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Width</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.width}
                onChange={(e) => handleUpdate({ width: e.target.value })}
                placeholder="100% or 400px"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Border Radius (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.borderRadius}
                onChange={(e) =>
                  handleUpdate({ borderRadius: parseInt(e.target.value) })
                }
                min="0"
                max="50"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Link URL (optional)</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.linkUrl || ""}
                onChange={(e) => handleUpdate({ linkUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case "button":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Button URL</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.href}
                onChange={(e) => handleUpdate({ href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Background Color</label>
              <input
                className="w-full h-10 border border-gray-400 rounded-md cursor-pointer"
                type="color"
                value={selectedComponent.backgroundColor}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Text Color</label>
              <input
                className="w-full h-10 border border-gray-400 rounded-md cursor-pointer"
                type="color"
                value={selectedComponent.textColor}
                onChange={(e) => handleUpdate({ textColor: e.target.value })}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Size</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                min="12"
                max="32"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Border Radius (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.borderRadius}
                onChange={(e) =>
                  handleUpdate({ borderRadius: parseInt(e.target.value) })
                }
                min="0"
                max="50"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Padding</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.padding}
                onChange={(e) => handleUpdate({ padding: e.target.value })}
                placeholder="12px 24px"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case "divider":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Style</label>
              <select
                className={inputClass}
                value={selectedComponent.style}
                onChange={(e) => handleUpdate({ style: e.target.value })}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Thickness (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.thickness}
                onChange={(e) =>
                  handleUpdate({ thickness: parseInt(e.target.value) })
                }
                min="1"
                max="10"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Width</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.width}
                onChange={(e) => handleUpdate({ width: e.target.value })}
                placeholder="100% or 400px"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Margin Top (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.marginTop}
                onChange={(e) =>
                  handleUpdate({ marginTop: parseInt(e.target.value) })
                }
                min="0"
                max="100"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Margin Bottom (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.marginBottom}
                onChange={(e) =>
                  handleUpdate({ marginBottom: parseInt(e.target.value) })
                }
                min="0"
                max="100"
              />
            </div>
          </>
        );

      case "spacer":
        return (
          <div className={propertyGroupClass}>
            <label>Height (px)</label>
            <input
              type="number"
              value={selectedComponent.height}
              onChange={(e) =>
                handleUpdate({ height: parseInt(e.target.value) })
              }
              min="10"
              max="200"
            />
          </div>
        );

      case "socialLinks":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Icon Size (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.iconSize}
                onChange={(e) =>
                  handleUpdate({ iconSize: parseInt(e.target.value) })
                }
                min="24"
                max="64"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Spacing (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.spacing}
                onChange={(e) =>
                  handleUpdate({ spacing: parseInt(e.target.value) })
                }
                min="4"
                max="32"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Icon Style</label>
              <select
                className={inputClass}
                value={selectedComponent.iconStyle}
                onChange={(e) => handleUpdate({ iconStyle: e.target.value })}
              >
                <option value="circular">Circular</option>
                <option value="square">Square</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Social Platforms</label>
              <div className="flex flex-col gap-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
                {[
                  "facebook",
                  "twitter",
                  "instagram",
                  "linkedin",
                  "youtube",
                  "github",
                ].map((platform) => {
                  const existing = selectedComponent.platforms.find(
                    (p) => p.type === platform
                  );
                  return (
                    <div key={platform} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-[18px] h-[18px] cursor-pointer"
                          checked={!!existing}
                          onChange={(e) => {
                            const platforms = e.target.checked
                              ? [
                                  ...selectedComponent.platforms,
                                  { type: platform as any, url: "#" },
                                ]
                              : selectedComponent.platforms.filter(
                                  (p) => p.type !== platform
                                );
                            handleUpdate({ platforms });
                          }}
                        />
                        <label className="text-sm capitalize font-medium flex-1 text-gray-900 dark:text-gray-100">
                          {platform}
                        </label>
                      </div>
                      {existing && (
                        <input
                          type="text"
                          className="w-full py-1.5 px-2.5 border border-gray-400 dark:border-gray-600 rounded text-[13px] mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          value={existing.url}
                          onChange={(e) => {
                            const platforms = selectedComponent.platforms.map(
                              (p) =>
                                p.type === platform
                                  ? { ...p, url: e.target.value }
                                  : p
                            );
                            handleUpdate({ platforms });
                          }}
                          placeholder="URL"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );

      case "layout":
        const numCols = selectedComponent.columns.length;
        const getLayoutPresets = (n: number) => {
          switch (n) {
            case 1:
              return [{ value: "100", label: "Full Width (100%)" }];
            case 2:
              return [
                { value: "50-50", label: "Equal (50% / 50%)" },
                { value: "60-40", label: "60% / 40%" },
                { value: "40-60", label: "40% / 60%" },
                { value: "70-30", label: "70% / 30%" },
                { value: "30-70", label: "30% / 70%" },
                { value: "75-25", label: "75% / 25%" },
                { value: "25-75", label: "25% / 75%" },
              ];
            case 3:
              return [
                { value: "33-33-33", label: "Equal (33% each)" },
                { value: "50-25-25", label: "50% / 25% / 25%" },
                { value: "25-50-25", label: "25% / 50% / 25%" },
                { value: "25-25-50", label: "25% / 25% / 50%" },
                { value: "20-60-20", label: "20% / 60% / 20%" },
              ];
            case 4:
              return [
                { value: "25-25-25-25", label: "Equal (25% each)" },
                { value: "40-20-20-20", label: "40% / 20% / 20% / 20%" },
                { value: "20-20-20-40", label: "20% / 20% / 20% / 40%" },
                { value: "30-20-20-30", label: "30% / 20% / 20% / 30%" },
              ];
            case 5:
              return [
                { value: "20-20-20-20-20", label: "Equal (20% each)" },
                { value: "30-17.5-17.5-17.5-17.5", label: "30% / 17.5% each" },
              ];
            case 6:
              return [
                { value: "16.67-16.67-16.67-16.67-16.67-16.67", label: "Equal (~16.7% each)" },
              ];
            default:
              const equalWidth = (100 / n).toFixed(2);
              return [{ value: Array(n).fill(equalWidth).join("-"), label: `Equal (${equalWidth}% each)` }];
          }
        };

        const parseLayoutValue = (value: string): string[] => {
          return value.split("-").map((v) => `${v}%`);
        };

        return (
          <>
            {/* Direction Toggle */}
            <div className={propertyGroupClass}>
              <label className={labelClass}>Layout Direction</label>
              <div className="flex gap-1">
                <button
                  className={`flex-1 py-2 px-3 text-sm rounded-l-md border transition-colors ${
                    selectedComponent.direction === "horizontal" || !selectedComponent.direction
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => handleUpdate({ direction: "horizontal" })}
                >
                  ↔ Horizontal
                </button>
                <button
                  className={`flex-1 py-2 px-3 text-sm rounded-r-md border transition-colors ${
                    selectedComponent.direction === "vertical"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => handleUpdate({ direction: "vertical" })}
                >
                  ↕ Vertical
                </button>
              </div>
            </div>

            <div className={propertyGroupClass}>
              <label className={labelClass}>Number of {selectedComponent.direction === "vertical" ? "Rows" : "Columns"}</label>
              <div className="flex items-center gap-2">
                <input
                  className={inputClass + " flex-1"}
                  type="number"
                  value={numCols}
                  onChange={(e) => {
                    const newNumColumns = Math.max(1, Math.min(12, parseInt(e.target.value) || 1));
                    const currentColumns = selectedComponent.columns;
                    let newColumns = [...currentColumns];

                    if (newNumColumns > currentColumns.length) {
                      for (let i = currentColumns.length; i < newNumColumns; i++) {
                        newColumns.push([]);
                      }
                    } else if (newNumColumns < currentColumns.length) {
                      newColumns = newColumns.slice(0, newNumColumns);
                    }

                    const equalWidth = `${(100 / newNumColumns).toFixed(2)}%`;
                    const newColumnWidths = Array(newNumColumns).fill(equalWidth);

                    handleUpdate({
                      columns: newColumns,
                      columnWidths: newColumnWidths,
                    });
                  }}
                  min="1"
                  max="12"
                />
                <div className="flex gap-1">
                  <button
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                    onClick={() => {
                      if (numCols > 1) {
                        const newColumns = selectedComponent.columns.slice(0, numCols - 1);
                        const equalWidth = `${(100 / (numCols - 1)).toFixed(2)}%`;
                        handleUpdate({
                          columns: newColumns,
                          columnWidths: Array(numCols - 1).fill(equalWidth),
                        });
                      }
                    }}
                    disabled={numCols <= 1}
                  >
                    −
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                    onClick={() => {
                      if (numCols < 12) {
                        const newColumns = [...selectedComponent.columns, []];
                        const equalWidth = `${(100 / (numCols + 1)).toFixed(2)}%`;
                        handleUpdate({
                          columns: newColumns,
                          columnWidths: Array(numCols + 1).fill(equalWidth),
                        });
                      }
                    }}
                    disabled={numCols >= 12}
                  >
                    +
                  </button>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Min: 1, Max: 12</span>
            </div>

            {selectedComponent.direction !== "vertical" && (
              <div className={propertyGroupClass}>
                <label className={labelClass}>Column Layout Preset</label>
                <select
                  className={inputClass}
                  onChange={(e) => {
                    const widths = parseLayoutValue(e.target.value);
                    handleUpdate({ columnWidths: widths });
                  }}
                >
                  {getLayoutPresets(numCols).map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Width Controls */}
            {selectedComponent.direction !== "vertical" && numCols <= 6 && (
              <div className={propertyGroupClass}>
                <label className={labelClass}>Custom Column Widths</label>
                <div className="flex flex-col gap-2">
                  {selectedComponent.columns.map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-12">Col {idx + 1}</span>
                      <input
                        className={inputClass + " flex-1"}
                        type="text"
                        value={selectedComponent.columnWidths?.[idx] || `${(100 / numCols).toFixed(2)}%`}
                        onChange={(e) => {
                          const newWidths = [...(selectedComponent.columnWidths || [])];
                          newWidths[idx] = e.target.value;
                          handleUpdate({ columnWidths: newWidths });
                        }}
                        placeholder="e.g., 25% or 1fr"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Use %, px, or fr units</span>
              </div>
            )}

            <div className={propertyGroupClass}>
              <label className={labelClass}>Gap Between {selectedComponent.direction === "vertical" ? "Rows" : "Columns"} (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.gap}
                onChange={(e) =>
                  handleUpdate({ gap: parseInt(e.target.value) })
                }
                min="0"
                max="100"
              />
            </div>

            {/* Stack on Mobile */}
            <div className={propertyGroupClass}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedComponent.stackOnMobile !== false}
                  onChange={(e) => handleUpdate({ stackOnMobile: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                />
                <span className={labelClass}>Stack on Mobile</span>
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Columns will stack vertically on smaller screens
              </span>
            </div>

            <div className={propertyGroupClass}>
              <label className={labelClass}>Background Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
              />
            </div>

            <div className={propertyGroupClass}>
              <label className={labelClass}>Padding</label>
              <input
                className={inputClass}
                type="text"
                value={selectedComponent.padding}
                onChange={(e) => handleUpdate({ padding: e.target.value })}
                placeholder="e.g., 16px or 10px 20px"
              />
            </div>

            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300 m-0">
                💡 Use the + and − buttons or type directly to add up to 12 {selectedComponent.direction === "vertical" ? "rows" : "columns"}.
                Each {selectedComponent.direction === "vertical" ? "row" : "column"} can hold multiple components stacked {selectedComponent.direction === "vertical" ? "horizontally" : "vertically"}.
              </p>
            </div>
          </>
        );

      case "paragraph":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Family</label>
              <select
                className={inputClass}
                value={selectedComponent.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font}>
                    {font.split(",")[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Font Size</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) })
                }
                min="8"
                max="72"
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Background Color</label>
              <input
                className="w-full h-10 border border-gray-400 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
                type="color"
                value={selectedComponent.backgroundColor}
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Alignment</label>
              <select
                className={inputClass}
                value={selectedComponent.alignment}
                onChange={(e) => handleUpdate({ alignment: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Line Height</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.lineHeight}
                onChange={(e) =>
                  handleUpdate({ lineHeight: parseFloat(e.target.value) })
                }
                min="1"
                max="3"
                step="0.1"
              />
            </div>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300 m-0">
                💡 Use the inline toolbar when editing to apply bold, italic,
                lists, and more formatting options.
              </p>
            </div>
          </>
        );

      case "html":
        return (
          <>
            <div className={propertyGroupClass}>
              <label className={labelClass}>HTML Content</label>
              <textarea
                className="w-full min-h-[300px] p-3 border border-gray-400 dark:border-gray-600 rounded-md text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                value={selectedComponent.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                placeholder="<div>Your HTML here...</div>"
                spellCheck={false}
              />
            </div>
            <div className={propertyGroupClass}>
              <label className={labelClass}>Min Height (px)</label>
              <input
                className={inputClass}
                type="number"
                value={selectedComponent.minHeight}
                onChange={(e) =>
                  handleUpdate({ minHeight: parseInt(e.target.value) })
                }
                min="50"
                max="1000"
              />
            </div>
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 m-0">
                ⚠️ <strong>Warning:</strong> Raw HTML is rendered directly. Ensure
                your code is valid to avoid breaking the newsletter layout.
              </p>
            </div>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300 m-0">
                💡 You can use inline styles, tables, and most HTML elements.
                Email clients have varying support for CSS.
              </p>
            </div>
          </>
        );

      default:
        return <p>No properties available</p>;
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="m-0 mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          Properties
        </h3>
        <div className="flex flex-col gap-2">
          <div className="inline-block py-1 px-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl text-xs font-medium capitalize">
            {selectedComponent.type}
          </div>
          {isNested && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              In Layout Column {(state.selectedNestedComponent?.columnIndex ?? 0) + 1}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">{renderProperties()}</div>
      
      {/* HTML Output Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => {
            setShowHtmlOutput(!showHtmlOutput);
            if (!showHtmlOutput && selectedComponent) {
              setEditedHtml(componentToHTML(selectedComponent));
              setIsEditingHtml(false);
            }
          }}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>{"</>"}</span>
            <span>View HTML Output</span>
          </span>
          <span className="text-xs">{showHtmlOutput ? "▼" : "▶"}</span>
        </button>
        
        {showHtmlOutput && selectedComponent && (
          <div className="px-4 pb-4">
            {!isEditingHtml ? (
              <>
                <div className="relative">
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded-md text-xs overflow-x-auto max-h-[300px] overflow-y-auto font-mono">
                    {componentToHTML(selectedComponent)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(componentToHTML(selectedComponent));
                    }}
                    className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
                {/* Only show edit button for components that support content editing */}
                {(selectedComponent.type === "html" || selectedComponent.type === "text" || selectedComponent.type === "paragraph") && (
                  <button
                    onClick={() => {
                      setEditedHtml(componentToHTML(selectedComponent));
                      setIsEditingHtml(true);
                    }}
                    className="mt-2 w-full px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Edit HTML Directly
                  </button>
                )}
                {selectedComponent.type !== "html" && selectedComponent.type !== "text" && selectedComponent.type !== "paragraph" && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-600 dark:text-gray-400">
                    ℹ️ HTML output is read-only for this component type. Use the properties panel above to make changes.
                  </div>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  className="w-full min-h-[200px] p-3 border border-gray-400 dark:border-gray-600 rounded-md text-xs font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  spellCheck={false}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      if (selectedComponent.type === "html") {
                        // For HTML component, extract content from table wrapper
                        const match = editedHtml.match(/<td[^>]*style="padding: 0;">\s*([\s\S]*?)\s*<\/td>/);
                        const content = match ? match[1].trim() : editedHtml;
                        handleUpdate({ content });
                      } else if (selectedComponent.type === "text" || selectedComponent.type === "paragraph") {
                        // For text/paragraph components, extract content but keep the type
                        const match = editedHtml.match(/<td[^>]*>\s*([\s\S]*?)\s*<\/td>/);
                        const content = match ? match[1].trim() : editedHtml;
                        handleUpdate({ content });
                      }
                      setIsEditingHtml(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedHtml(componentToHTML(selectedComponent));
                      setIsEditingHtml(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Make sure your HTML is valid to avoid breaking the newsletter layout.
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2">
        <button
          className="flex-1 py-2.5 px-4 border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          onClick={handleDuplicate}
        >
          Duplicate
        </button>
        <button
          className="flex-1 py-2.5 px-4 border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600"
          onClick={handleRemove}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
