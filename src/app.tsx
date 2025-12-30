import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/navbar";
import * as Pages from "./pages";
import { useUserStore } from "./stores";
import ProtectedRoute from "./auth/protectedRoute";
import { ToastContainer } from "react-toastify";
import ModalComponents from "./components/NewsLetterBuilder/components/Modals";
import Loader from "./components/loader";

export const App: React.FC = () => {
  const { isLoading } = useUserStore();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen w-screen bg-gray-200 dark:bg-gray-900">
      <BrowserRouter>
        <NavbarComponent>
          <Routes>
            <Route
              path="/subscription"
              element={<ProtectedRoute element={<Pages.SubcriptionPage />} />}
            />
            <Route
              path="/newsletter-config/:id"
              element={<ProtectedRoute element={<Pages.NewsletterConfig />} />}
            />
            <Route
              path="/newsletter-config/new"
              element={<ProtectedRoute element={<Pages.NewsletterConfig />} />}
            />
            <Route
              path="/newsletters"
              element={<ProtectedRoute element={<Pages.NewslettersList />} />}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute element={<Pages.SettingsPage />} />}
            />
            <Route path="/" element={<Pages.HomePage />} />
            <Route path="*" element={<Pages.NotFound />} />
          </Routes>
        </NavbarComponent>
      </BrowserRouter>
      <ToastContainer />
      <ModalComponents />
    </div>
  );
};
