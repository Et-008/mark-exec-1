import React, { useEffect, useState } from "react";
import { Button, Badge, Spinner } from "flowbite-react";
import { MailIcon, PencilIcon, User2Icon, Calendar1Icon } from "lucide-react";
import { create } from "zustand";
import { useGetAccountId } from "../hooks";
import Loader from "../components/loader";
import { useUserStore } from "../stores";
import { toast } from "react-toastify";

const API_URL = process.env.API_URL;

interface Subscriber {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_on: string;
}

const useSubscribersStore = create<SubscribersStore>((set) => ({
  subscribers: [] as Subscriber[],
  setSubscribers: (newSubscribers: Subscriber[]) =>
    set({ subscribers: newSubscribers }),
}));

interface SubscribersStore {
  subscribers: Subscriber[];
  setSubscribers: (newSubscribers: Subscriber[]) => void;
}

const SubcriptionPage: React.FC = () => {
  const { setNewSubscriberConfigModalOpen } = useUserStore();

  const { subscribers, setSubscribers }: SubscribersStore =
    useSubscribersStore();

  const accountId = useGetAccountId();

  const [loading, setLoading] = useState(false);

  function getAllSubscribers() {
    setLoading(true);
    setTimeout(() => {
      fetch(`${API_URL}/auth/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          accountId: accountId,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setSubscribers(data?.users);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  }

  useEffect(() => {
    getAllSubscribers();
  }, []);

  const toggleAddSubscriber = () => {
    setNewSubscriberConfigModalOpen(true);
  };

  const handleSubscriberStatusChange = (
    subscriberId: number,
    activeStatus: boolean
  ): Promise<void> => {
    const csrftoken = document.cookie
      .split("; ")
      .find((r) => r.startsWith("csrftoken="))
      ?.split("=")[1];

    return fetch(`${API_URL}/unsubscribe/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        activeStatus: activeStatus,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          toast.success(
            `Subscriber ${
              activeStatus ? "activated" : "deactivated"
            } successfully`
          );
          setSubscribers(
            subscribers.map((subscriber: Subscriber) =>
              subscriber.id === subscriberId
                ? { ...subscriber, is_active: activeStatus }
                : subscriber
            )
          );
        } else {
          toast.error("Something went wrong, pleease try again!");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong, pleease try again!");
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative">
      <div key="NewSubscriber" className="ml-auto absolute top-0 right-0">
        <Button color="lime" onClick={toggleAddSubscriber}>
          Add Subscriber
        </Button>
      </div>
      <div className="text-2xl font-bold">Subscribers</div>
      <SubscriberList
        subscribers={subscribers.sort((a: Subscriber, b: Subscriber) => {
          return (
            new Date(b.subscribed_on).getTime() -
            new Date(a.subscribed_on).getTime()
          );
        })}
        handleSubscriberStatusChange={handleSubscriberStatusChange}
      />
    </div>
  );
};

export default SubcriptionPage;

function SubscriberList({
  subscribers,
  handleSubscriberStatusChange,
}: {
  subscribers: Subscriber[];
  handleSubscriberStatusChange: (
    subscriberId: number,
    activeStatus: boolean
  ) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {subscribers.map((subscriber: Subscriber) => (
        <Subscriber
          key={subscriber.id}
          subscriber={subscriber}
          handleSubscriberStatusChange={() =>
            handleSubscriberStatusChange(subscriber.id, !subscriber.is_active)
          }
        />
      ))}
    </div>
  );
}

function Subscriber({
  subscriber,
  handleSubscriberStatusChange,
}: {
  subscriber: Subscriber;
  handleSubscriberStatusChange: () => Promise<void>;
}) {
  const { setNewSubscriberConfigModalOpen } = useUserStore();
  const [loading, setLoading] = useState(false);

  const toggleEditMode = () => {
    setNewSubscriberConfigModalOpen(true, subscriber);
  };

  const handleStatusChange = async () => {
    setLoading(true);
    handleSubscriberStatusChange().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };

  return (
    <div
      className={`grid gap-1 border-2 border-gray-200 p-2 rounded-2xl dark:border-gray-700 ${
        subscriber.is_active
          ? "bg-white dark:bg-black"
          : "bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
      } w-xs min-h-36`}
    >
      <div className="flex items-center gap-2 card-title text-ellipsis w-full overflow-hidden pl-2 pr-2">
        <Calendar1Icon size={16} />
        <span className="text-xs text-gray-500">
          {new Date(subscriber.subscribed_on).toLocaleString()}
        </span>
        <Badge color={subscriber.is_active ? "green" : "red"}>
          {subscriber.is_active ? "Active" : "Inactive"}
        </Badge>
        <PencilIcon
          size={16}
          onClick={toggleEditMode}
          className="ml-auto cursor-pointer text-gray-500 hover:text-black"
        />
      </div>
      <div className="flex items-center gap-2 card-title text-ellipsis w-full overflow-hidden pl-2 pr-2">
        <User2Icon size={16} />
        <span className="text-sm text-ellipsis overflow-hidden w-full mask-ellipse">
          {subscriber.name}
        </span>
      </div>
      <div className="flex items-center gap-2 per-position text-ellipsis w-full overflow-hidden pl-2 pr-2">
        <MailIcon size={16} />
        <span className="text-sm text-ellipsis overflow-hidden w-full mask-ellipse">
          {subscriber.email}
        </span>
      </div>
      {/* <div className="social-icons">
          <i className="fab fa-linkedin-in" title="LinkedIn"></i>
          <i className="fab fa-twitter" title="Twitter"></i>
          <i className="fab fa-facebook-f" title="Facebook"></i>
        </div> */}
      <div className="card-btn">
        <Button
          size="xs"
          color={subscriber.is_active ? "alternative" : "lime"}
          onClick={handleStatusChange}
          disabled={loading}
        >
          {loading ? (
            <Spinner size="xs" />
          ) : subscriber.is_active ? (
            "Deactivate"
          ) : (
            "Activate"
          )}
        </Button>
      </div>
    </div>
  );
}
