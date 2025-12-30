import { v4 as uuidv4 } from "uuid";
import { NewsletterComponent, ComponentType } from "../types";
import { DEFAULT_STYLES } from "./defaultStyles";
import {
  TypeOutlineIcon,
  HeadingIcon,
  ImageIcon,
  Link2Icon,
  SquareSplitVerticalIcon,
  BetweenHorizonalStartIcon,
  LayoutTemplateIcon,
  Share2Icon,
  PilcrowIcon,
  CodeIcon,
} from "lucide-react";

export const createComponent = (type: ComponentType): NewsletterComponent => {
  const id = uuidv4();

  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        content: "<p>Enter your text here...</p>",
        ...DEFAULT_STYLES.text,
      };

    case "heading":
      return {
        id,
        type: "heading",
        text: "Heading",
        level: 2,
        ...DEFAULT_STYLES.heading,
        fontSize: DEFAULT_STYLES.heading.h2.fontSize,
        fontWeight: DEFAULT_STYLES.heading.h2.fontWeight,
      };

    case "image":
      return {
        id,
        type: "image",
        src: "",
        alt: DEFAULT_STYLES.image.alt,
        width: DEFAULT_STYLES.image.width,
        height: DEFAULT_STYLES.image.height,
        alignment: DEFAULT_STYLES.image.alignment,
        borderRadius: DEFAULT_STYLES.image.borderRadius,
      };

    case "button":
      return {
        id,
        type: "button",
        text: "Click Here",
        href: "#",
        ...DEFAULT_STYLES.button,
      };

    case "divider":
      return {
        id,
        type: "divider",
        ...DEFAULT_STYLES.divider,
      };

    case "spacer":
      return {
        id,
        type: "spacer",
        height: DEFAULT_STYLES.spacer.height,
      };

    case "layout":
      return {
        id,
        type: "layout",
        columns: [[], []],
        ...DEFAULT_STYLES.layout,
        direction: "horizontal",
        stackOnMobile: true,
      };

    case "socialLinks":
      return {
        id,
        type: "socialLinks",
        platforms: [],
        ...DEFAULT_STYLES.socialLinks,
      };

    case "paragraph":
      return {
        id,
        type: "paragraph",
        content: "<p>Start writing your paragraph here...</p>",
        ...DEFAULT_STYLES.paragraph,
      };

    case "html":
      return {
        id,
        type: "html",
        content:
          '<div style="padding: 20px; text-align: center;">\n  <h2>Custom HTML</h2>\n  <p>Edit this to add your own HTML content</p>\n</div>',
        minHeight: 100,
      };

    default:
      throw new Error(`Unknown component type: ${type}`);
  }
};

export const componentLabels: Record<ComponentType, string> = {
  text: "Text Block",
  heading: "Heading",
  image: "Image",
  button: "Button",
  divider: "Divider",
  spacer: "Spacer",
  layout: "Layout",
  socialLinks: "Social Links",
  paragraph: "Paragraph",
  html: "HTML",
};

export const componentIcons: Record<ComponentType, React.ElementType> = {
  text: TypeOutlineIcon,
  heading: HeadingIcon,
  image: ImageIcon,
  button: Link2Icon,
  divider: SquareSplitVerticalIcon,
  spacer: BetweenHorizonalStartIcon,
  layout: LayoutTemplateIcon,
  socialLinks: Share2Icon,
  paragraph: PilcrowIcon,
  html: CodeIcon,
};
