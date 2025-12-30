import { Button, Spinner } from "flowbite-react";
import { useGetAccountId } from "../../../../hooks";
import React, { useEffect, useImperativeHandle, useState } from "react";
import Select, { ActionMeta } from "react-select";

interface EmailProvider {
  id: number;
  name: string;
  from_email: string;
  is_active: boolean;
  is_primary: boolean;
  provider: string;
  host: string;
  port: number;
  username: string;
  password: string;
  use_tls: boolean;
  use_ssl: boolean;
  from_name: string;
  reply_to: string;
}

interface EmailProviderSelectProps {
  ref: React.RefObject<any>;
}
const EmailProviderSelect: React.FC<EmailProviderSelectProps> = ({ ref }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailProviders, setEmailProviders] = useState<any[]>([]);
  const [selectedEmailProvider, setSelectedEmailProvider] = useState<
    any | null
  >(null);
  const accountId = useGetAccountId();
  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.API_URL}/config/list/`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setEmailProviders(
          [...data?.data]?.map((emailProvider: any) => ({
            ...emailProvider,
            value: emailProvider.id,
            label: emailProvider.name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useImperativeHandle(ref, () => ({
    getSelectedEmailProvider: () => selectedEmailProvider,
  }));

  useEffect(() => {
    if (emailProviders?.length > 0) {
      setSelectedEmailProvider(emailProviders[0]);
    }
  }, [emailProviders]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Email Provider
      </h2>
      <Select
        options={emailProviders}
        value={selectedEmailProvider}
        onChange={(
          newValue: EmailProvider,
          actionMeta: ActionMeta<EmailProvider>
        ) => {
          if (actionMeta.action === "select-option") {
            setSelectedEmailProvider(newValue);
          }
        }}
      />
    </div>
  );
};

export default EmailProviderSelect;
