import React, { useState } from "react";
import { useUserStore } from "../../../../stores";
import { useNewsletter } from "../../context/NewsletterContext";
import { exportToHTML } from "../../utils/htmlExport";
import { useGetAccountId } from "../../../../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeftCircleIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  EraserIcon,
  EyeIcon,
  ImportIcon,
  MonitorIcon,
  Redo2Icon,
  SaveIcon,
  Send,
  Share2Icon,
  ShareIcon,
  StepBackIcon,
  StepForwardIcon,
  TabletSmartphoneIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import { Button, Tooltip } from "flowbite-react";

const API_URL = process.env.API_URL;

interface ToolbarProps {
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  onPreview: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onPreview,
}) => {
  const {
    state,
    undo,
    redo,
    canUndo,
    canRedo,
    clearAll,
    updateName,
    exportToJSON,
    importFromJSON,
  } = useNewsletter();

  const accountId = useGetAccountId();

  const { isAuthenticated, setAuthModalOpen } = useUserStore();

  const navigate = useNavigate();

  const { id } = useParams();

  const [isSaving, setIsSaving] = useState(false);

  const isEdit = id && id !== "new";

  const handleExportHTML = () => {
    const html = exportToHTML({
      title: state.name,
      components: state.components,
    });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const json = exportToJSON();
    const method = isEdit ? "update" : "create";
    setIsSaving(true);
    try {
      fetch(`${API_URL}/newsletter/${method}/`, {
        method: "POST",
        headers: {
          accountId: accountId,
        },
        body: JSON.stringify({
          ...(isEdit ? { newsletter_id: id } : {}),
          title: state?.name,
          sections: json,
          html_content: exportToHTML({
            title: state.name,
            components: state.components,
          }),
        }),
      })
        .then((res) => res.json())
        .then((res: any) => {
          if (res) {
            if (isEdit) {
              navigate(`/newsletters`);
            } else {
              navigate(`/newsletter-config/${res?.newsletter_id}`);
              onPreview();
            }
            toast.success("Newsletter created successfully!");
          }
        })
        .catch((err) => {
          if (err) {
            toast.error(err?.error);
          }
        });
    } catch {
      toast.error("Something went wrong, pleease try again!");
    } finally {
      setIsSaving(false);
    }
    // const blob = new Blob([json], { type: "application/json" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "newsletter.json";
    // a.click();
    // URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          importFromJSON(json);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCopyHTML = async () => {
    const html = exportToHTML({
      title: state.name,
      components: state.components,
    });
    try {
      await navigator.clipboard.writeText(html);
      alert("HTML copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700 flex items-center px-6 gap-6 shadow-sm dark:shadow-gray-900/20">
      <div className="flex-1 flex items-center gap-2">
        <span
          className="cursor-pointer"
          // className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (isAuthenticated) {
              navigate("/newsletters");
            } else {
              navigate(-1);
            }
          }}
          title="Go back"
        >
          <ArrowLeftCircleIcon />
        </span>
        <input
          type="text"
          value={state?.name}
          maxLength={50}
          placeholder="Enter newsletter name"
          className="w-1/2 border-b-2 border-gray-300 dark:border-gray-700 outline-none text-lg font-medium text-gray-700 dark:text-gray-200"
          onChange={(e) => {
            if ("value" in e.target) updateName(e.target.value);
          }}
        />
      </div>

      <div className="flex items-center gap-2 justify-center">
        <button
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          {/* ↶ */}
          <Undo2Icon size={20} />
        </button>
        <button
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          {/* ↷ */}
          <Redo2Icon size={20} />
        </button>
        <button
          className="px-4 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-sm font-medium text-red-600 dark:text-red-400 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-600 dark:hover:border-red-700 hover:-translate-y-0.5 active:translate-y-0"
          onClick={clearAll}
        >
          {/* 🗑️ */}
          <EraserIcon size={20} />
        </button>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
          <button
            className={`px-3 py-1.5 bg-transparent border-none rounded-md text-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              viewMode === "desktop"
                ? "bg-lime-600! dark:bg-lime-500! shadow-md shadow-lime-200 dark:shadow-lime-900/50"
                : ""
            }`}
            onClick={() => onViewModeChange("desktop")}
            title="Desktop View"
          >
            <MonitorIcon size={20} />
          </button>
          <button
            className={`px-3 py-1.5 bg-transparent border-none rounded-md text-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 ${
              viewMode === "mobile"
                ? "bg-lime-600! dark:bg-lime-500! shadow-md shadow-lime-200 dark:shadow-lime-900/50"
                : ""
            }`}
            onClick={() => onViewModeChange("mobile")}
            title="Mobile View"
          >
            <TabletSmartphoneIcon size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Tooltip content="Preview" animation="duration-1000">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0"
            onClick={onPreview}
          >
            <EyeIcon size={20} />
          </button>
        </Tooltip>
        <Tooltip content="Copy" animation="duration-1000">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleCopyHTML}
          >
            <CopyIcon size={20} />
          </button>
        </Tooltip>
        <Tooltip content="Export" animation="duration-1000">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleExportHTML}
          >
            <UploadIcon size={20} />
          </button>
        </Tooltip>
        <Tooltip content="Import" animation="duration-1000">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleImportJSON}
          >
            <DownloadIcon size={20} />
          </button>
        </Tooltip>
        <Tooltip
          content={
            isAuthenticated
              ? "Create and send"
              : "Login/Signup to create or send a newsletter"
          }
          animation="duration-1000"
        >
          <Button
            color="lime"
            onClick={() => {
              if (isAuthenticated) {
                handleSave();
              } else {
                setAuthModalOpen(true);
              }
            }}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <SaveIcon size={20} />{" "}
            {isAuthenticated
              ? isEdit
                ? isSaving
                  ? "Updating..."
                  : "Update"
                : isSaving
                ? "Saving..."
                : "Save and send"
              : "Login/Signup to save and send a newsletter"}
          </Button>
        </Tooltip>
        {isEdit ? (
          <Button
            color="lime"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Send size={20} /> Send
          </Button>
        ) : null}
      </div>
    </div>
  );
};
