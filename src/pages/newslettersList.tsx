import { Button, Spinner, Tooltip } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Campaign, NewsLetter } from "../types";
import { useGetAccountId } from "../hooks";
import { toast } from "react-toastify";
import Loader from "../components/loader";

const API_URL = process.env.API_URL;

function NewsLetterCard({
  newsletter,
  handleDeleteNewsLetter,
}: {
  newsletter: NewsLetter;
  handleDeleteNewsLetter: () => Promise<void>;
}) {
  const navigate = useNavigate();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setDeleteLoading(true);
    handleDeleteNewsLetter().then(() => {
      setTimeout(() => {
        setDeleteLoading(false);
      }, 1000);
    });
  };

  return (
    <div
      key={newsletter.id}
      onClick={() => {
        navigate(`/newsletter-config/${newsletter.id}`);
      }}
      className="flex flex-col gap-2 w-[400px] min-h-[100px] cursor-pointer border-1 border-gray-300 dark:border-gray-700 p-2 py-4 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
    >
      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <span className="text-sm text-gray-500 dark:text-white">
          @ {new Date(newsletter.date_generated).toLocaleString()}
        </span>
        <span className="flex flex-row gap-2">
          <span className="cursor-pointer w-fit ml-auto  mr-3">
            {" "}
            <Tooltip content="Edit">
              <PencilIcon size={16} />{" "}
            </Tooltip>
          </span>
          <span
            className="cursor-pointer w-fit mr-3"
            onClick={(e) => handleDelete(e)}
          >
            {" "}
            {deleteLoading ? (
              <Spinner size="xs" />
            ) : (
              <Tooltip content="Delete">
                <TrashIcon size={16} color="red" />{" "}
              </Tooltip>
            )}
          </span>
        </span>
      </div>
      # {newsletter.title}{" "}
      <span
        className={`text-sm text-gray-500 dark:text-gray-400 ${
          newsletter.sent
            ? "text-green-500 font-bold"
            : "text-red-500 font-bold"
        }`}
      >
        {newsletter.sent ? "Sent" : "Not Sent"}
      </span>
    </div>
  );
}

const NewslettersList = () => {
  const navigate = useNavigate();

  const accountId = useGetAccountId();

  const [newsletters, setNewsletters] = useState<NewsLetter[]>([]);

  const [loading, setLoading] = useState(false);

  function getAllNewsLetters() {
    setLoading(true);
    setTimeout(() => {
      const headers = new Headers();
      headers.append("accountId", `${accountId}`);
      fetch(`${API_URL}/newsletters`, {
        headers: headers,
      })
        .then((res) => res.json())
        .then((data) => {
          setNewsletters(data.newsletters);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  }

  const handleDeleteNewsLetter = async (
    newsletterId: string
  ): Promise<void> => {
    return fetch(`${API_URL}/newsletter/delete/`, {
      method: "POST",
      headers: {
        accountId: `${accountId}`,
      },
      body: JSON.stringify({
        newsletter_id: newsletterId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          toast.success("Newsletter deleted successfully");
          setNewsletters(
            newsletters.filter(
              (newsletter: NewsLetter) => newsletter.id !== Number(newsletterId)
            )
          );
        } else {
          toast.error("Failed to delete newsletter");
        }
      })
      .catch((err) => {
        toast.error("Failed to delete newsletter");
      });
  };

  useEffect(() => {
    getAllNewsLetters();
  }, []);

  function createNewsLetter() {
    navigate(`/newsletter-config/new`);
  }

  if (loading) {
    return <Loader />;
  }

  if (!newsletters?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Button color="lime" onClick={createNewsLetter}>
          <PlusIcon /> Create new
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex flex-row gap-2 w-full items-center justify-between">
        <h1 className="text-2xl font-bold">My Newsletters</h1>

        <Button color="lime" onClick={createNewsLetter}>
          <PlusIcon /> Create new
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {newsletters?.map((newsletter) => {
          return (
            <NewsLetterCard
              key={newsletter.id}
              newsletter={newsletter}
              handleDeleteNewsLetter={handleDeleteNewsLetter.bind(
                null,
                newsletter.id.toString()
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewslettersList;
