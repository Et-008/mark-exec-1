import React, { useRef } from "react";
import { ImageComponentProps } from "../../types";
import { useGetAccountId } from "../../../../hooks";

const API_URL = process.env.API_URL;

interface ImageComponentRenderProps {
  component: ImageComponentProps;
  isSelected: boolean;
  onImageChange?: (src: string) => void;
}

export const ImageComponent: React.FC<ImageComponentRenderProps> = ({
  component,
  isSelected,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accountId = useGetAccountId();

  const containerStyles: React.CSSProperties = {
    textAlign: component.alignment,
    ...component.styles,
  };

  const imageStyles: React.CSSProperties = {
    width: component.width,
    height: component.height,
    borderRadius: `${component.borderRadius}px`,
    display: "inline-block",
    maxWidth: "100%",
  };

  const handleImageClick = () => {
    if (isSelected && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    fetch(`${API_URL}/assets/upload-image/`, {
      method: "POST",
      body: formData,
      headers: {
        accountId: accountId,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.image_url) {
          console.log(data, " data");
          onImageChange(`${API_URL}${data?.image_url}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // const reader = new FileReader();
      // reader.onload = (event) => {
      //   const result = event.target?.result as string;
      //   if (onImageChange) {
      //     onImageChange(result);
      //   }
      // };
      // reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const ImageContent = component.linkUrl ? (
    <a href={component.linkUrl} style={{ display: "inline-block" }}>
      {component.src ? (
        <img
          src={component.src}
          alt={component.alt}
          style={imageStyles}
          onClick={handleImageClick}
        />
      ) : (
        <div
          className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 inline-flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-600 dark:hover:border-gray-500 h-[200px] max-h-[200px] w-full"
          style={imageStyles}
          onClick={handleImageClick}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-5xl">📷</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload image
            </span>
          </div>
        </div>
      )}
    </a>
  ) : (
    <>
      {component.src ? (
        <img
          src={component.src}
          alt={component.alt}
          style={imageStyles}
          onClick={handleImageClick}
        />
      ) : (
        <div
          className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 inline-flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-600 dark:hover:border-gray-500 h-[200px] max-h-[200px] w-full"
          style={imageStyles}
          onClick={handleImageClick}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-5xl">📷</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload image
            </span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className={`p-2 transition-all duration-200 ${
        isSelected ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
      } [&_img]:cursor-pointer [&_img]:transition-opacity ${
        isSelected ? "[&_img]:hover:opacity-80" : ""
      }`}
      style={containerStyles}
    >
      {ImageContent}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};
