import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useNewsletter } from "../../context/NewsletterContext";
import { DraggableWrapper } from "../DraggableWrapper/DraggableWrapper";

interface CanvasProps {
  viewMode: "desktop" | "mobile";
}

export const Canvas: React.FC<CanvasProps> = ({ viewMode }) => {
  const { state, reorderComponents, selectComponent } = useNewsletter();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(state.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderComponents(items);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  const canvasWidth = viewMode === "desktop" ? "600px" : "320px";

  return (
    <div
      className="flex-1 bg-gray-200 dark:bg-gray-950 p-10 pb-0 px-[60px] flex justify-center"
      onClick={handleCanvasClick}
    >
      <div className="w-full h-full flex justify-center overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="newsletter-canvas">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-950/50 p-6 transition-all overflow-y-auto duration-300 relative ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-200 dark:shadow-blue-900/50"
                    : ""
                }`}
                style={{ width: canvasWidth }}
              >
                {state.components.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[600px] text-center text-gray-500 dark:text-gray-400 p-10">
                    <div className="text-[80px] mb-6 opacity-50">📧</div>
                    <h3 className="m-0 mb-3 text-2xl text-gray-700 dark:text-gray-300">
                      Start Building Your Newsletter
                    </h3>
                    <p className="m-0 text-base text-gray-500 dark:text-gray-400">
                      Click on components from the sidebar to add them here
                    </p>
                  </div>
                ) : (
                  state.components.map((component, index) => (
                    <DraggableWrapper
                      key={component.id}
                      component={component}
                      index={index}
                    />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
