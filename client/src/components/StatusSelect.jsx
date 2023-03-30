import Select from "react-select";
import React from "react";
import { useTreasure } from "react-treasure";

// A wrapper around react-select that uses the status-values from
// the projects table stored in context to populate the options.
export const StatusSelect = ({ value, onChange }) => {
  const [statusValues] = useTreasure("status-values");
  const statusOptions = statusValues.map((status) => ({
    value: status.name,
    label: status.name,
  }));

  return (
    <>
      <Select
        value={statusOptions.find((option) => option.value === value)}
        defaultValue={statusOptions.find(
          (option) => option.value === "Next-Up"
        )}
        options={statusOptions}
        onChange={onChange}
      />
    </>
  );
};
