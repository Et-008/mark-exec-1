import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  NewsletterState,
  NewsletterContextType,
  NewsletterComponent,
} from "../types";
import { Campaign } from "../../../types";

const MAX_HISTORY = 50;

const initialState: NewsletterState = {
  name: "",
  components: [],
  selectedComponentId: null,
  selectedNestedComponent: null,
  history: [[]],
  historyIndex: 0,
};

type Action =
  | { type: "ADD_COMPONENT"; component: NewsletterComponent; index?: number }
  | { type: "REMOVE_COMPONENT"; id: string }
  | {
      type: "UPDATE_COMPONENT";
      id: string;
      updates: Partial<NewsletterComponent>;
    }
  | { type: "REORDER_COMPONENTS"; components: NewsletterComponent[] }
  | { type: "SELECT_COMPONENT"; id: string | null }
  | {
      type: "SELECT_NESTED_COMPONENT";
      layoutId: string;
      columnIndex: number;
      componentId: string;
    }
  | { type: "CLEAR_NESTED_SELECTION" }
  | { type: "DUPLICATE_COMPONENT"; id: string }
  | { type: "CLEAR_ALL" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "IMPORT_STATE"; components: NewsletterComponent[]; name?: string }
  | { type: "UPDATE_NAME"; name: string };

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const addToHistory = (
  state: NewsletterState,
  components: NewsletterComponent[]
): NewsletterState => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(deepClone(components));

  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
    return {
      ...state,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

const newsletterReducer = (
  state: NewsletterState,
  action: Action
): NewsletterState => {
  switch (action.type) {
    case "UPDATE_NAME": {
      const newState = {
        ...state,
        name: action?.name,
      };
      return newState;
    }
    case "ADD_COMPONENT": {
      const newComponents = [...state.components];
      if (action.index !== undefined) {
        newComponents.splice(action.index, 0, action.component);
      } else {
        newComponents.push(action.component);
      }
      const newState = {
        ...state,
        components: newComponents,
        selectedComponentId: action.component.id,
      };
      return addToHistory(newState, newComponents);
    }

    case "REMOVE_COMPONENT": {
      const newComponents = state.components.filter((c) => c.id !== action.id);
      const newState = {
        ...state,
        components: newComponents,
        selectedComponentId:
          state.selectedComponentId === action.id
            ? null
            : state.selectedComponentId,
      };
      return addToHistory(newState, newComponents);
    }

    case "UPDATE_COMPONENT": {
      const newComponents = state.components.map((c) =>
        c.id === action.id ? { ...c, ...action.updates } : c
      );
      const newState: any = {
        ...state,
        components: newComponents,
      };
      return addToHistory(newState, newComponents as NewsletterComponent[]);
    }

    case "REORDER_COMPONENTS": {
      const newState = {
        ...state,
        components: action.components,
      };
      return addToHistory(newState, action.components);
    }

    case "SELECT_COMPONENT":
      return {
        ...state,
        selectedComponentId: action.id,
        selectedNestedComponent: null,
      };

    case "SELECT_NESTED_COMPONENT":
      return {
        ...state,
        selectedComponentId: action.layoutId,
        selectedNestedComponent: {
          layoutId: action.layoutId,
          columnIndex: action.columnIndex,
          componentId: action.componentId,
        },
      };

    case "CLEAR_NESTED_SELECTION":
      return {
        ...state,
        selectedNestedComponent: null,
      };

    case "DUPLICATE_COMPONENT": {
      const componentToDuplicate = state.components.find(
        (c) => c.id === action.id
      );
      if (!componentToDuplicate) return state;

      const duplicated = deepClone(componentToDuplicate);
      duplicated.id = uuidv4();

      const index = state.components.findIndex((c) => c.id === action.id);
      const newComponents = [...state.components];
      newComponents.splice(index + 1, 0, duplicated);

      const newState = {
        ...state,
        components: newComponents,
        selectedComponentId: duplicated.id,
      };
      return addToHistory(newState, newComponents);
    }

    case "CLEAR_ALL": {
      const newState: NewsletterState = {
        ...state,
        components: [],
        selectedComponentId: null,
      };
      return addToHistory(newState, []);
    }

    case "UNDO": {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          components: deepClone(state.history[newIndex]),
          historyIndex: newIndex,
          selectedComponentId: null,
        };
      }
      return state;
    }

    case "REDO": {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          components: deepClone(state.history[newIndex]),
          historyIndex: newIndex,
          selectedComponentId: null,
        };
      }
      return state;
    }

    case "IMPORT_STATE": {
      const newState: NewsletterState = {
        ...state,
        name: action.name || "Untitled",
        components: action.components,
        selectedComponentId: null,
      };
      return addToHistory(newState, action.components);
    }

    default:
      return state;
  }
};

const NewsletterContext = createContext<NewsletterContextType | undefined>(
  undefined
);

export const NewsletterProvider: React.FC<{
  children: React.ReactNode;
  newsLetterTitle?: string;
  newsletterComponents: NewsletterComponent[];
}> = ({ children, newsLetterTitle, newsletterComponents }) => {
  const [state, dispatch] = useReducer(newsletterReducer, {
    ...initialState,
    name: newsLetterTitle || "Untitled",
    components: newsletterComponents,
  });

  const updateName = useCallback((name: string) => {
    dispatch({ type: "UPDATE_NAME", name });
  }, []);

  const addComponent = useCallback(
    (component: NewsletterComponent, index?: number) => {
      dispatch({ type: "ADD_COMPONENT", component, index });
    },
    []
  );

  const removeComponent = useCallback((id: string) => {
    dispatch({ type: "REMOVE_COMPONENT", id });
  }, []);

  const updateComponent = useCallback(
    (id: string, updates: Partial<NewsletterComponent>) => {
      dispatch({ type: "UPDATE_COMPONENT", id, updates });
    },
    []
  );

  const reorderComponents = useCallback((components: NewsletterComponent[]) => {
    dispatch({ type: "REORDER_COMPONENTS", components });
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_COMPONENT", id });
  }, []);

  const selectNestedComponent = useCallback(
    (layoutId: string, columnIndex: number, componentId: string) => {
      dispatch({
        type: "SELECT_NESTED_COMPONENT",
        layoutId,
        columnIndex,
        componentId,
      });
    },
    []
  );

  const clearNestedSelection = useCallback(() => {
    dispatch({ type: "CLEAR_NESTED_SELECTION" });
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    dispatch({ type: "DUPLICATE_COMPONENT", id });
  }, []);

  const clearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all components?")) {
      dispatch({ type: "CLEAR_ALL" });
    }
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const exportToJSON = useCallback(() => {
    return JSON.stringify(state.components, null, 2);
  }, [state.components]);

  const importFromJSON = useCallback((json: string) => {
    try {
      const components = JSON.parse(json);
      if (Array.isArray(components)) {
        dispatch({ type: "IMPORT_STATE", components });
      } else {
        alert("Invalid JSON format");
      }
    } catch (error) {
      alert("Error parsing JSON");
    }
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const contextValue = useMemo(
    () => ({
      state,
      updateName,
      addComponent,
      removeComponent,
      updateComponent,
      reorderComponents,
      selectComponent,
      selectNestedComponent,
      clearNestedSelection,
      duplicateComponent,
      clearAll,
      undo,
      redo,
      canUndo,
      canRedo,
      exportToJSON,
      importFromJSON,
    }),
    [
      state,
      updateName,
      addComponent,
      removeComponent,
      updateComponent,
      reorderComponents,
      selectComponent,
      selectNestedComponent,
      clearNestedSelection,
      duplicateComponent,
      clearAll,
      undo,
      redo,
      canUndo,
      canRedo,
      exportToJSON,
      importFromJSON,
    ]
  );

  useEffect(() => {
    if (newsletterComponents.length > 0 || newsLetterTitle) {
      dispatch({
        type: "IMPORT_STATE",
        components: newsletterComponents,
        name: newsLetterTitle,
      });
    }
  }, [newsletterComponents, newsLetterTitle]);

  return (
    <NewsletterContext.Provider value={contextValue}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletter = (): NewsletterContextType => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter must be used within NewsletterProvider");
  }
  return context;
};
