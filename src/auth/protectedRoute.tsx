import { Button } from "flowbite-react";
import { useUserStore } from "../stores";
import React from "react";

function ProtectedRoute({
  element,
}: {
  element: React.ReactElement;
}): React.ReactElement | null {
  const { isAuthenticated, setAuthModalOpen } = useUserStore();
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold">
          You need an account to access this page
        </h1>
        <p className="text-gray-500">
          Please login or create an account to continue
        </p>
        <Button
          onClick={() => {
            setAuthModalOpen(true);
          }}
          color="lime"
        >
          Login or Create Account
        </Button>
      </div>
    );
  }
  return element;
}

export default ProtectedRoute;
