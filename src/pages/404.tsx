import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="relative -m-8">
      <img
        src="/images/empty.webp"
        alt="404"
        className="w-full h-[calc(100vh-64px)] object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-4 absolute bottom-3/5 left-0 right-0 p-4">
        <h3 className="text-2xl font-bold">
          Don't worry, you can find your way back to home.
        </h3>
        <p className="text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Button color="lime" href="/">
          Take me home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
