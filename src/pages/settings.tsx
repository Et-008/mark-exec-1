import { Badge, Banner, Button, Spinner, Tooltip } from "flowbite-react";
import { useUserStore, User } from "../stores";
import React, { useEffect, useState } from "react";
import { Copy, MessageSquareWarningIcon } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = process.env.API_URL;

interface EmailConfig {
  id: number;
  name: string;
  from_email: string;
  is_active: boolean;
  is_primary: boolean;
  provider: string;
  host: string;
  port: number;
  username: string;
  password_set: boolean;
  use_tls: boolean;
  use_ssl: boolean;
  from_name: string;
  reply_to: string;
  last_verified_at: string | null;
  last_verify_error: string;
  daily_quota: number | null;
  per_minute_rate: number | null;
  created_at: string;
  updated_at: string;
}

function convertTextToCamelCase(text: string) {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/ /g, " ");
}

function EmailConfigCards({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const { setNewEmailConfigModalOpen } = useUserStore();

  function fetchUserConfig() {
    fetch(`${API_URL}/config/list/`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEmailConfigs(data?.data || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function createNewEmailConfig() {
    setNewEmailConfigModalOpen(true);
  }

  useEffect(() => {
    fetchUserConfig();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full md:w-3/4 lg:w-2/3 flex-2">
      <div className="flex flex-row gap-2">
        <h2 className="text-lg font-bold mb-2">Email Configurations</h2>
        <Button
          color="lime"
          size="xs"
          className="ml-auto"
          onClick={createNewEmailConfig}
        >
          Create Email Config
        </Button>
      </div>
      {emailConfigs.map((config) => {
        return (
          <div
            key={config.id}
            onClick={() => {
              setNewEmailConfigModalOpen(true, config.id.toString());
            }}
            className="dark:bg-gray-900 p-4 rounded-lg w-full max-w-[400px] flex-1 cursor-pointer bg-blue-100 dark:hover:bg-gray-800"
          >
            {config.created_at && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(config.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <h3 className="text-lg font-bold flex gap-2 items-center">
              {config.name}
              <Badge color="lime" className="w-fit ml-auto">
                {config.is_active ? "Active" : "Inactive"}
              </Badge>
              <Badge color="dark">
                {config.is_primary ? "Primary" : "Secondary"}
              </Badge>
            </h3>
            <p className="text-sm">{config.from_email}</p>
            <Banner color="info" className="mt-2">
              <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                  <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                    <MessageSquareWarningIcon className="mr-4 h-4 w-4" />
                    {config.last_verified_at ? (
                      <span className="[&_p]:inline">
                        Last verified @{" "}
                        {new Date(config.last_verified_at).toLocaleString()}
                      </span>
                    ) : (
                      <span className="[&_p]:inline">Not verified</span>
                    )}
                  </p>
                </div>
              </div>
            </Banner>
          </div>
        );
      })}
    </div>
  );
}

function SubscriptionEndpointsDetails() {
  const [uniqueAccountId, setUniqueAccountId] = useState<string>("");
  function fetchUniqueAccountId() {
    fetch(`${API_URL}/auth/account-id/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUniqueAccountId(data?.accountId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchUniqueAccountId();
  }, []);

  if (!uniqueAccountId) {
    return <Spinner />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-1/2">
      <h2 className="text-lg font-bold mb-2">Subscription Endpoint</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Get The users emailId and name and call this endpoint to create a new
        subscriber.
      </p>
      <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 w-full overflow-x-auto text-xs font-mono whitespace-pre-wrap relative">
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={async () => {
            await navigator.clipboard
              .writeText(`fetch('${API_URL}/subscribe/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'accountId': '${uniqueAccountId}' 
    },
    body: JSON.stringify({
      email: 'visitor@email.com',
      name: 'John Doe'
    })
  });`);
            toast.success("Copied to clipboard");
          }}
        >
          <Tooltip content="Copy">
            <Copy />
          </Tooltip>
        </div>
        {`fetch('${API_URL}/subscribe/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'accountId': '${uniqueAccountId}' 
    },
    body: JSON.stringify({
      email: 'visitor@email.com',
      name: 'John Doe'
    })
  });`}
      </pre>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 pt-2">
        * emailId and accountId is required. name is optional, if not provided,
        the subscriber's name will be the same as the emailId.
      </p>
    </div>
  );
}

const userToOrganisationMap: Record<keyof User, string> = {
  username: "Name",
  email: "Email",
  name: "Name",
  first_name: "First Name",
  last_name: "Last Name",
  date_joined: "Date Joined",
  last_login: "Last Login",
  is_staff: "Is Staff",
  avatar: "Avatar",
  role: "Role",
  preferences: "Preferences",
  id: "ID",
};

const Settings: React.FC = () => {
  const { user, logout, updateUser } = useUserStore();

  return (
    <div className="flex flex-wrap gap-4 w-full md:-m-2 lg:-m-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full flex flex-row gap-2 items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
        <Button
          className="ml-auto"
          color="lime"
          size="sm"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </div>
      <div className="w-full flex flex-row gap-4">
        <EmailConfigCards user={user} />
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full md:w-1/3 flex-1">
          <h2 className="text-lg font-bold mb-2">Organization Information</h2>
          {Object.keys(user || {}).map((key) => {
            let value = "N/A";
            switch (key) {
              case "date_joined":
                value = new Date(
                  user?.[key as keyof User] as string
                ).toLocaleDateString();
                break;
              case "last_login":
                value = new Date(
                  user?.[key as keyof User] as string
                ).toLocaleDateString();
                break;
              case "is_staff":
                value = (user?.[key as keyof User] as boolean) ? "Yes" : "No";
                break;
              default:
                value = user?.[key as keyof User] as string;
            }
            return (
              <div key={key} className="flex flex-row gap-2 mb-2">
                <h2 className="w-[100px]">
                  {
                    userToOrganisationMap[
                      key as keyof typeof userToOrganisationMap
                    ]
                  }
                  :
                </h2>
                {value ? (
                  <span className="ml-auto flex-1">{value}</span>
                ) : (
                  <span className="ml-auto flex-1 text-gray-300 dark:text-gray-200">
                    n/a
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <SubscriptionEndpointsDetails />
    </div>
  );
};

export default Settings;
