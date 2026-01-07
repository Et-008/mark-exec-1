import React, { useState } from "react";
import { TextInput, Button } from "flowbite-react";
import { useGetAccountId } from "../../../../hooks";
import { toast } from "react-toastify";
import { Subscriber } from "../../../../types";

const API_URL = process.env.API_URL;

function SubscriberConfigForm({
  subscriber: subscriberFromProps,
  handleClose,
}: {
  subscriber: Subscriber | undefined;
  handleClose: () => void;
}) {
  const accountId = useGetAccountId();

  const [subscriber, setSubscriber] = useState<Subscriber>(
    subscriberFromProps ?? {
      id: Math.random(),
      email: "",
      name: "",
      is_active: true,
      subscription: {
        active: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        resubscribed_at: null,
      },
    }
  );
  const [loading, setLoading] = useState(false);

  function handleSubscriberUpdate(id: number, field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubscriber({ ...subscriber, [field]: e.target.value });
    };
  }

  const handleSubscribe = () => {
    if (subscriber.email === "" || subscriber.name === "") {
      toast.error("Email and name are required");
      return;
    }
    setLoading(true);
    const input: any = {
      email: subscriber.email,
      name: subscriber.name,
    };
    if (!!subscriberFromProps) {
      input.subscriber_id = subscriberFromProps?.id;
    } else {
      input.accountId = accountId;
    }
    const csrftoken = document.cookie
      .split("; ")
      .find((r) => r.startsWith("csrftoken="))
      ?.split("=")[1];

    fetch(
      `${API_URL}/${
        !!subscriberFromProps ? "update-subscriber" : "subscribe"
      }/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(input),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          toast.success(
            !!subscriberFromProps
              ? "Subscriber updated successfully"
              : "Subscriber added successfully"
          );
          handleClose();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, pleease try again!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Email
        </h2>
        <TextInput
          type="text"
          name="email"
          size={100}
          className="w-fit"
          value={subscriber.email}
          onChange={handleSubscriberUpdate(subscriber.id, "email")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Name
        </h2>
        <TextInput
          type="text"
          name="name"
          size={100}
          className="w-fit"
          value={subscriber.name}
          onChange={handleSubscriberUpdate(subscriber.id, "name")}
        />
      </div>
      <div className="flex flex-row gap-2 mt-4">
        <Button color="lime" onClick={handleSubscribe}>
          {!!subscriberFromProps ? "Update" : "Create"}
        </Button>
        <Button color="alternative" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default SubscriberConfigForm;
