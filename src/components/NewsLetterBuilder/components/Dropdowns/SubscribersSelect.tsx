import React, { useEffect, useImperativeHandle, useState } from "react";
import Select from "react-select";
import { useGetAccountId } from "../../../../hooks";

const SubscribersSelect: React.FC<{ ref: React.RefObject<any> }> = ({
  ref,
}) => {
  const accountId = useGetAccountId();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  // State to store the selected values (initialized as an empty array)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Handle the change event
  const handleChange = (selected: any) => {
    // When isMulti is true, the 'selected' argument is an array of the selected options
    setSelectedOptions(selected || []);
  };

  useEffect(() => {
    fetch(`${process.env.API_URL}/auth/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        accountId: accountId,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSubscribers(
          [...data?.users]?.map((user: any) => ({
            ...user,
            value: user?.id,
            label: user?.email,
          }))
        );
        setSelectedOptions(
          [...data?.users]?.map((user: any) => ({
            ...user,
            value: user?.id,
            label: user?.email,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useImperativeHandle(ref, () => ({
    getSelectedSubscribers: () => selectedOptions,
  }));

  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        Subscribers
      </h2>
      <Select
        isMulti // This prop enables multi-selection
        options={subscribers}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select subscribers..."
      />
    </div>
  );
};

export default SubscribersSelect;
