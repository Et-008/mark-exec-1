import React, { useRef } from "react";
import { exportToHTML } from "../../utils/htmlExport";
import { NewsletterComponent } from "../../types";
import { SubscribersSelect, EmailProviderSelect } from "../Dropdowns";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = process.env.API_URL;

interface PreviewModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  components: NewsletterComponent[];
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  title,
  isOpen,
  onClose,
  components,
}) => {
  const subscribersSelectRef = useRef<any>(null);
  const emailProviderSelectRef = useRef<any>(null);
  const { id } = useParams();
  const isEdit = id && id !== "new";
  if (!isOpen) return null;

  const html = exportToHTML({ title: title, components: components });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSend = async () => {
    const selectedSubscribers =
      subscribersSelectRef.current?.getSelectedSubscribers();

    const selectedEmailProvider =
      emailProviderSelectRef.current?.getSelectedEmailProvider();

    if (selectedSubscribers.length === 0) {
      toast.error("Please select at least one subscriber");
      return;
    }

    try {
      fetch(`${API_URL}/newsletter/send-email/`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          newsletter_id: id,
          subscribers: selectedSubscribers,
          title,
          html,
          email_config_id: selectedEmailProvider?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            toast.success("Newsletter sent successfully");
            onClose();
          }
        })
        .catch((err) => {
          toast.error("Something went wrong, pleease try again!");
        });
    } catch (error) {
      toast.error("Something went wrong, pleease try again!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-[1000] p-5"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-[1250px] max-h-[90vh] flex flex-col shadow-2xl">
        <div className="py-5 px-6 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
          <h2 className="m-0 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Preview
          </h2>
          <button
            className="w-8 h-8 rounded-full border-none bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl leading-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 hover:rotate-90"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="flex flex-row overflow-auto">
          <div className="w-3/5 flex-1 p-6 overflow-auto bg-gray-100 dark:bg-gray-950">
            <iframe
              title="Newsletter Preview"
              srcDoc={html}
              className="w-full h-[600px] border-none bg-white rounded-lg shadow-md"
              sandbox="allow-same-origin"
            />
          </div>
          <div className="w-2/5 py-4 px-6 border-t border-gray-300 dark:border-gray-700 flex flex-col gap-3">
            <EmailProviderSelect ref={emailProviderSelectRef} />
            <SubscribersSelect ref={subscribersSelectRef} />
            {isEdit ? (
              <button
                className="py-2.5 px-6 border-none rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 bg-lime-600 dark:bg-lime-500 text-white hover:bg-lime-700 dark:hover:bg-lime-600 hover:-translate-y-0.5 self-end mt-auto"
                onClick={handleSend}
              >
                Send
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
