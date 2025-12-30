import { Button, Textarea, TextInput } from "flowbite-react";
import React, { useState } from "react";

const NewsletterEditor: React.FC<{ title: string; content: string }> = ({
  title: initialTitle,
  content: initialContent,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const handleSave = () => {
    console.log(title, content);
  };
  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center w-1/2">
        <TextInput
          type="text"
          value={title}
          className="w-full h-10"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          value={content}
          className="w-full h-[400px]"
          onChange={(e) => setContent(e.target.value)}
        />
        <Button color="lime" onClick={handleSave} className="w-1/2">
          Send
        </Button>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center w-1/2 border-2 border-gray-200 rounded-lg p-4 overflow-y-auto bg-accent">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div
          className="w-full h-[400px] overflow-y-auto border-2 border-gray-200 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default NewsletterEditor;
