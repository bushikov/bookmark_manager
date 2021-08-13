import React, { useState } from "react";
import { AliasType } from "db";

type FormProps = {
  initialAliasName: string;
  initialType: AliasType;
  initialTags: string;
  onSubmit: (arg0: {
    aliasName: string;
    type: AliasType;
    tags: string[];
  }) => void;
  onCancel: () => void;
};

export const Form: React.FC<FormProps> = ({
  initialAliasName,
  initialType,
  initialTags,
  onSubmit,
  onCancel,
}) => {
  const [aliasName, setAliasName] = useState<string>(initialAliasName);
  const [type, setType] = useState<AliasType>(initialType);
  const [tags, setTags] = useState<string>(initialTags);

  return (
    <div
      className="flex flex-col space-y-2 rounded shadow-md p-4 bg-white"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label className="flex flex-row">
        <div className="w-24">Alias Name</div>
        <input
          type="text"
          className="flex-grow px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={aliasName}
          onChange={(e) => {
            setAliasName(e.target.value);
          }}
        />
      </label>
      <label className="flex flex-row">
        <div className="w-24">Type</div>
        <select
          className="px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={type}
          onChange={(e) => {
            setType(e.target.value as AliasType);
          }}
        >
          <option value="rename">RENAME</option>
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
      </label>
      <label className="flex flex-row">
        <div className="w-24">Tags</div>
        <input
          type="text"
          className="flex-grow px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
        />
      </label>
      <div className="flex flex-row justify-center space-x-4">
        <button
          className="rounded shadow-md focus:shadow-inner px-4 py-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            onSubmit({
              aliasName,
              type,
              tags: tags
                .trim()
                .replace(/\s{2,}/g, " ")
                .split(/,|\s/),
            });
          }}
        >
          OK
        </button>
        <button
          className="rounded shadow-md focus:shadow-inner p-2 bg-gray-100 hover:bg-gray-200"
          onClick={onCancel}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};
