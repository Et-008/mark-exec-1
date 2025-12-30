import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RotateCcwIcon } from "lucide-react";
import { Tooltip, Button, Checkbox, TextInput, Spinner } from "flowbite-react";

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

interface CreateEmailInput {
  id: number;
  name: string;
  from_email: string;
  host: string;
  port: number;
  username: string;
  password: string;
  use_tls: boolean;
  use_ssl: boolean;
  from_name: string;
  reply_to: string;
  is_primary: boolean;
}

function convertTextToCamelCase(text: string) {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/ /g, " ");
}

function EmailConfigForm({ id }: { id?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfig, setEmailConfig] = useState<
    CreateEmailInput | EmailConfig
  >({
    id: Math.random(),
    name: "",
    from_email: "",
    host: "",
    port: 0,
    username: "",
    password: "",
    use_tls: false,
    use_ssl: false,
    from_name: "",
    reply_to: "",
    is_primary: false,
  });
  const [originalEmailConfig, setOriginalEmailConfig] = useState<
    CreateEmailInput | EmailConfig
  >({
    id: Math.random(),
    name: "",
    from_email: "",
    is_active: false,
    is_primary: false,
    provider: "",
    host: "",
    port: 0,
    username: "",
    password: "",
    use_tls: false,
    use_ssl: false,
    from_name: "",
    reply_to: "",
  });

  function fetchEmailConfig() {
    fetch(`${API_URL}/config/get/?id=${id}`, {
      method: "GET",
      credentials: "include", // send session cookie
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const emailConfigData = data.data as EmailConfig;
        setEmailConfig(emailConfigData);
        setOriginalEmailConfig(emailConfigData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (id) {
      fetchEmailConfig();
    }
  }, [id]);

  // helper to read Django CSRF cookie
  function getCookie(name: string) {
    const m = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Create a new email config for the logged-in user
  async function createEmailConfig() {
    // ensure CSRF cookie exists (e.g., fetch '/auth/csrf/' once after login)
    const csrftoken = getCookie("csrftoken");

    const payload = {
      name: "Work SMTP",
      from_email: "team@lang-q.com",
      host: "smtp.zoho.in",
      port: 587,
      username: "team@lang-q.com",
      password: "PHrT2NqBFwy1", // write-only, not returned
      use_tls: true,
      use_ssl: false,
      from_name: "Lang-Q",
      reply_to: "team@lang-q.com",
      is_primary: true,
    };

    console.log(payload);

    // const res = await fetch(`${API_URL}/config/create/`, {
    //   method: "POST",
    //   credentials: "include", // send session cookie
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "X-CSRFToken": csrftoken || "",
    //   },
    //   body: JSON.stringify(payload),
    // });

    // if (!res.ok) {
    //   const err = await res.text();
    //   throw new Error(`Create failed: ${res.status} ${err}`);
    // }

    // const json = await res.json(); // { data: EmailConfig }
    // return json.data;
  }

  async function updateEmailConfig(id: string, updates: any) {
    const csrftoken = getCookie("csrftoken");

    // Example payload (partial updates allowed)
    const payload = {
      name: "Work SMTP (updated)",
      from_email: "me@domain.com",
      host: "smtp.zoho.in",
      port: 587,
      username: "me@domain.com",
      password: "new-app-password", // write-only; sets password_encrypted
      use_tls: true,
      use_ssl: false,
      is_active: true,
      is_primary: true, // will unset others for this user
    };

    const res = await fetch(`/config/${id}/`, {
      method: "PATCH", // or 'POST'
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken || "",
      },
      body: JSON.stringify({ ...payload, ...updates }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Update failed: ${res.status} ${err}`);
    }
    const json = await res.json(); // { data: EmailConfig }
    return json.data;
  }

  async function verifyEmailConfig(id: number) {
    const csrftoken = getCookie("csrftoken");

    const res = await fetch(`${API_URL}/config/${id}/verify/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-CSRFToken": csrftoken || "",
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Verify failed: ${res.status} ${data?.error || ""}`);
    }
    toast.success("Email config verified successfully");
    return data; // { status: "ok", verified_at: "..." }
  }

  function modifyEmailConfig(id: number, updates: any) {
    if (emailConfig) {
      setEmailConfig({ ...emailConfig, ...updates });
    }
  }

  function isDisabled() {
    if (id) {
      return (
        isLoading ||
        (originalEmailConfig?.id === emailConfig?.id &&
          originalEmailConfig?.name === emailConfig?.name &&
          originalEmailConfig?.from_email === emailConfig?.from_email &&
          originalEmailConfig?.host === emailConfig?.host &&
          originalEmailConfig?.port === emailConfig?.port &&
          originalEmailConfig?.username === emailConfig?.username &&
          originalEmailConfig?.from_name === emailConfig?.from_name &&
          originalEmailConfig?.reply_to === emailConfig?.reply_to &&
          originalEmailConfig?.is_primary === emailConfig?.is_primary &&
          originalEmailConfig?.use_tls === emailConfig?.use_tls &&
          originalEmailConfig?.use_ssl === emailConfig?.use_ssl)
      );
    }
    return (
      emailConfig?.name === "" ||
      emailConfig?.from_email === "" ||
      emailConfig?.host === "" ||
      emailConfig?.port === 0 ||
      emailConfig?.username === "" ||
      emailConfig?.from_name === "" ||
      emailConfig?.reply_to === "" ||
      (emailConfig as CreateEmailInput)?.password === ""
    );
  }

  const inputKeys = [
    "name",
    "from_email",
    "host",
    "port",
    "username",
    "from_name",
    "reply_to",
    "password",
  ];

  const dateKeys = ["last_verified_at", "created_at", "updated_at"];
  const numberKeys = ["daily_quota", "per_minute_rate"];
  const booleanKeys = ["is_primary"];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg w-full flex-2">
      <div className="flex flex-row gap-2">
        <h2 className="text-lg font-bold">Email Configurations</h2>
        <span className="flex flex-row gap-2 items-center ml-auto">
          {id && !isDisabled() && (
            <Tooltip content="Reset to original values">
              <RotateCcwIcon
                size={20}
                onClick={() => {
                  setEmailConfig(originalEmailConfig);
                }}
              />
            </Tooltip>
          )}
          {isLoading ? (
            <Spinner />
          ) : (
            <Button
              color="lime"
              onClick={() => {
                createEmailConfig();
              }}
              disabled={isDisabled()}
            >
              Save
            </Button>
          )}
        </span>
      </div>
      {emailConfig && (
        <div key={emailConfig.id} className="flex flex-row">
          <div className="w-1/2">
            {Object.keys(emailConfig)
              .filter((key) => inputKeys.includes(key))
              .map((key) => {
                return (
                  <div key={key} className="flex flex-row gap-2 mb-2">
                    <h3 className="w-[150px]">
                      {convertTextToCamelCase(key)}:{" "}
                    </h3>
                    <span className="ml-auto flex-1">
                      <TextInput
                        type="text"
                        className="w-fit"
                        name={key}
                        size={30}
                        value={
                          emailConfig[
                            key as keyof (CreateEmailInput | EmailConfig)
                          ] as string
                        }
                        onChange={(e) => {
                          modifyEmailConfig(Number(emailConfig.id), {
                            [key]: e.target.value,
                          });
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            <Button
              color="lime"
              onClick={() => {
                verifyEmailConfig(emailConfig.id);
              }}
            >
              Verify config
            </Button>
          </div>
          <div>
            {Object.keys(emailConfig)
              .filter((key) => !inputKeys.includes(key))
              .map((key) => {
                if (dateKeys.includes(key)) {
                  return (
                    <div key={key} className="flex flex-row gap-2 mb-2">
                      <h3 className="w-[150px]">
                        {convertTextToCamelCase(key)}:{" "}
                      </h3>
                      <span className="ml-auto flex-1">
                        {new Date(
                          emailConfig[
                            key as keyof (CreateEmailInput | EmailConfig)
                          ] as string
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                }
                if (booleanKeys.includes(key)) {
                  return (
                    <div key={key} className="flex flex-row gap-2 mb-2">
                      <h3 className="w-[150px]">
                        {convertTextToCamelCase(key)}:{" "}
                      </h3>
                      <span className="ml-auto flex-1">
                        <Checkbox
                          id={key}
                          name={key}
                          checked={
                            emailConfig[
                              key as keyof (CreateEmailInput | EmailConfig)
                            ] as boolean
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            modifyEmailConfig(Number(emailConfig.id), {
                              [key]: e.target.checked,
                            });
                          }}
                        />
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex flex-row gap-2 mb-2">
                    <h3 className="w-[150px]">
                      {convertTextToCamelCase(key)}:{" "}
                    </h3>
                    <span className="ml-auto flex-1">
                      {typeof emailConfig[
                        key as keyof (CreateEmailInput | EmailConfig)
                      ] === "boolean"
                        ? emailConfig[
                            key as keyof (CreateEmailInput | EmailConfig)
                          ].toString()
                        : (emailConfig[
                            key as keyof (CreateEmailInput | EmailConfig)
                          ] as string)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailConfigForm;
