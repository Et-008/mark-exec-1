// Type definitions for the newsletter builder

export type ComponentType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "layout"
  | "socialLinks"
  | "paragraph"
  | "html";

export interface BaseComponentProps {
  id: string;
  type: ComponentType;
  styles?: React.CSSProperties;
}

export interface TextComponentProps extends BaseComponentProps {
  type: "text";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
}

export interface ParagraphComponentProps extends BaseComponentProps {
  type: "paragraph";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: "left" | "center" | "right" | "justify";
  lineHeight?: number;
  backgroundColor?: string;
}

export interface HeadingComponentProps extends BaseComponentProps {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
  h1?: {
    fontWeight?: number;
    fontSize?: number;
    fontFamily?: string;
  };
  h2?: {
    fontWeight?: number;
    fontSize?: number;
    fontFamily?: string;
  };
  h3?: {
    fontWeight?: number;
    fontSize?: number;
    fontFamily?: string;
  };
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: "left" | "center" | "right";
  fontWeight?: number;
}

export interface ImageComponentProps extends BaseComponentProps {
  type: "image";
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  alignment?: "left" | "center" | "right";
  borderRadius?: number;
  linkUrl?: string;
}

export interface ButtonComponentProps extends BaseComponentProps {
  type: "button";
  text: string;
  href: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  padding?: string;
  fontSize?: number;
  alignment?: "left" | "center" | "right";
  width?: string;
}

export interface DividerComponentProps extends BaseComponentProps {
  type: "divider";
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  thickness?: number;
  width?: string;
  marginTop?: number;
  marginBottom?: number;
}

export interface SpacerComponentProps extends BaseComponentProps {
  type: "spacer";
  height: number;
}

export interface LayoutComponentProps extends BaseComponentProps {
  type: "layout";
  columns: NewsletterComponent[][];
  columnWidths?: string[];
  gap?: number;
  backgroundColor?: string;
  padding?: string;
  direction?: "horizontal" | "vertical";
  stackOnMobile?: boolean;
}

export interface SocialLink {
  type:
    | "facebook"
    | "twitter"
    | "instagram"
    | "linkedin"
    | "youtube"
    | "github";
  url: string;
}

export interface SocialLinksComponentProps extends BaseComponentProps {
  type: "socialLinks";
  platforms: SocialLink[];
  iconSize?: number;
  spacing?: number;
  alignment?: "left" | "center" | "right";
  iconStyle?: "circular" | "square";
}

export interface HtmlComponentProps extends BaseComponentProps {
  type: "html";
  content: string;
  minHeight?: number;
}

export type NewsletterComponent =
  | TextComponentProps
  | HeadingComponentProps
  | ImageComponentProps
  | ButtonComponentProps
  | DividerComponentProps
  | SpacerComponentProps
  | LayoutComponentProps
  | SocialLinksComponentProps
  | ParagraphComponentProps
  | HtmlComponentProps;

export interface NewsletterState {
  name: string;
  components: NewsletterComponent[];
  selectedComponentId: string | null;
  selectedNestedComponent: {
    layoutId: string;
    columnIndex: number;
    componentId: string;
  } | null;
  history: NewsletterComponent[][];
  historyIndex: number;
}

export interface NewsletterContextType {
  state: NewsletterState;
  updateName: (name: string) => void;
  addComponent: (component: NewsletterComponent, index?: number) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<NewsletterComponent>) => void;
  reorderComponents: (components: NewsletterComponent[]) => void;
  selectComponent: (id: string | null) => void;
  selectNestedComponent: (layoutId: string, columnIndex: number, componentId: string) => void;
  clearNestedSelection: () => void;
  duplicateComponent: (id: string) => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}
