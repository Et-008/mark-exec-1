import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { NewsletterComponent } from '../../types';
import { useNewsletter } from '../../context/NewsletterContext';
import {
  TextComponent,
  HeadingComponent,
  ImageComponent,
  ButtonComponent,
  DividerComponent,
  SpacerComponent,
  LayoutComponent,
  SocialLinksComponent,
  ParagraphComponent,
  HtmlComponent,
} from '../../newsletterComponents';

interface DraggableWrapperProps {
  component: NewsletterComponent;
  index: number;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ component, index }) => {
  const { state, selectComponent, removeComponent, updateComponent } = useNewsletter();
  const isSelected = state.selectedComponentId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <TextComponent
            component={component}
            isSelected={isSelected}
            isEditing={isSelected}
            onContentChange={(content) => updateComponent(component.id, { content })}
          />
        );
      case 'heading':
        return (
          <HeadingComponent
            component={component}
            isSelected={isSelected}
            isEditing={isSelected}
            onTextChange={(text) => updateComponent(component.id, { text })}
          />
        );
      case 'image':
        return (
          <ImageComponent
            component={component}
            isSelected={isSelected}
            onImageChange={(src) => updateComponent(component.id, { src })}
          />
        );
      case 'button':
        return (
          <ButtonComponent
            component={component}
            isSelected={isSelected}
            onTextChange={(text) => updateComponent(component.id, { text })}
          />
        );
      case 'divider':
        return <DividerComponent component={component} isSelected={isSelected} />;
      case 'spacer':
        return <SpacerComponent component={component} isSelected={isSelected} />;
      case 'layout':
        return (
          <LayoutComponent
            component={component}
            isSelected={isSelected}
            onUpdate={(updates) => updateComponent(component.id, updates)}
            onComponentUpdate={(columnIndex, componentId, updates) => {
              // Update a nested component within a specific column
              const layoutComponent = component as any;
              const newColumns = [...layoutComponent.columns];
              newColumns[columnIndex] = newColumns[columnIndex].map((comp: any) =>
                comp.id === componentId ? { ...comp, ...updates } : comp
              );
              updateComponent(component.id, { columns: newColumns });
            }}
            onComponentRemove={(columnIndex, componentId) => {
              // Remove a nested component from a specific column
              const layoutComponent = component as any;
              const newColumns = [...layoutComponent.columns];
              newColumns[columnIndex] = newColumns[columnIndex].filter(
                (comp: any) => comp.id !== componentId
              );
              updateComponent(component.id, { columns: newColumns });
            }}
          />
        );
      case 'socialLinks':
        return <SocialLinksComponent component={component} isSelected={isSelected} />;
      case 'paragraph':
        return (
          <ParagraphComponent
            component={component}
            isSelected={isSelected}
            isEditing={isSelected}
            onContentChange={(content) => updateComponent(component.id, { content })}
            onUpdate={(updates) => updateComponent(component.id, updates)}
          />
        );
      case 'html':
        return (
          <HtmlComponent
            component={component}
            isSelected={isSelected}
            isEditing={isSelected}
            onContentChange={(content) => updateComponent(component.id, { content })}
            onUpdate={(updates) => updateComponent(component.id, updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={component.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative my-1 transition-all duration-200 border-2 bg-white dark:bg-gray-800 ${
            isSelected ? 'border-blue-600 dark:border-blue-500 shadow-[0_0_0_1px_#2563eb] dark:shadow-[0_0_0_1px_#3b82f6]' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
          } ${snapshot.isDragging ? 'opacity-80 shadow-lg dark:shadow-gray-950/50' : ''}`}
          onClick={handleClick}
        >
          <div 
            {...provided.dragHandleProps} 
            className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-5 h-10 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity duration-200 bg-gray-200 dark:bg-gray-700 rounded z-10 group-hover:opacity-100"
          >
            <span className="text-xs text-gray-600 dark:text-gray-400 tracking-[-2px]">⋮⋮</span>
          </div>
          {isSelected && (
            <button 
              className="absolute top-[-10px] right-[-10px] w-6 h-6 rounded-full bg-red-600 dark:bg-red-500 text-white border-2 border-white dark:border-gray-900 text-xl leading-none cursor-pointer flex items-center justify-center z-10 transition-all duration-200 shadow-md hover:bg-red-700 dark:hover:bg-red-600 hover:scale-110" 
              onClick={handleDelete} 
              title="Delete"
            >
              ×
            </button>
          )}
          <div className="relative">{renderComponent()}</div>
        </div>
      )}
    </Draggable>
  );
};

