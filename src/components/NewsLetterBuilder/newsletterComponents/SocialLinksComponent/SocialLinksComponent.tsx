import React from "react";
import { SocialLinksComponentProps } from "../../types";
import {
  FacebookIcon,
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
  TwitterIcon,
  GithubIcon,
} from "lucide-react";

interface SocialLinksComponentRenderProps {
  component: SocialLinksComponentProps;
  isSelected: boolean;
}

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon size={16} />,
  twitter: <TwitterIcon size={16} />,
  instagram: <InstagramIcon size={16} />,
  linkedin: <LinkedinIcon size={16} />,
  youtube: <YoutubeIcon size={16} />,
  github: <GithubIcon size={16} />,
};

export const SocialLinksComponent: React.FC<
  SocialLinksComponentRenderProps
> = ({ component, isSelected }) => {
  const containerStyles: React.CSSProperties = {
    textAlign: component.alignment,
    padding: "16px 8px",
    ...component.styles,
  };

  const linksContainerStyles: React.CSSProperties = {
    display: "inline-flex",
    gap: `${component.spacing}px`,
    flexWrap: "wrap",
    justifyContent:
      component.alignment === "left"
        ? "flex-start"
        : component.alignment === "right"
        ? "flex-end"
        : "center",
  };

  const iconStyles: React.CSSProperties = {
    width: `${component.iconSize}px`,
    height: `${component.iconSize}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${component.iconSize * 0.6}px`,
    textDecoration: "none",
    borderRadius: component.iconStyle === "circular" ? "50%" : "8px",
    backgroundColor: "#f0f0f0",
    transition: "all 0.2s ease",
  };

  if (component.platforms.length === 0) {
    return (
      <div
        className={`transition-all duration-200 ${
          isSelected ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
        }`}
        style={containerStyles}
      >
        <div className="py-8 px-8 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 text-sm text-center">
          Add social links in the property panel →
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-200 ${
        isSelected ? "bg-blue-50/50" : ""
      }`}
      style={containerStyles}
    >
      <div style={linksContainerStyles}>
        {component.platforms.map((platform, index) => (
          <a
            key={index}
            href={platform.url}
            style={iconStyles}
            className="hover:-translate-y-0.5 hover:shadow-md"
            title={platform.type}
          >
            {socialIcons[platform.type] || "🔗"}
          </a>
        ))}
      </div>
    </div>
  );
};
