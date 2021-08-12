import React, { useState } from "react";

type Type = "rename" | "and" | "or";

type FormProps = {
  onSubmit: (arg0: { aliasName: string; type: Type; tags: string[] }) => void;
  onCancel: () => void;
};

export const Form: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [aliasName, setAliasName] = useState<string>("");
  const [type, setType] = useState<Type>("rename");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="flex flex-col space-y-2 rounded shadow-md p-4">
      <label className="flex flex-row">
        <div className="w-24">Alias Name</div>
        <input
          type="text"
          className="flex-grow px-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={aliasName}
          onChange={(e) => {
            setAliasName(e.target.value);
          }}
        />
      </label>
      <label className="flex flex-row">
        <div className="w-24">Type</div>
        <select
          className="px-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={type}
          onChange={(e) => {
            setType(e.target.value as Type);
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
          className="flex-grow px-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={tags.join(" ")}
          onChange={(e) => {
            setTags(e.target.value.split(" "));
          }}
        />
      </label>
      <div className="flex flex-row justify-center space-x-4">
        <button
          className="rounded shadow-md focus:shadow-inner px-4 py-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            onSubmit({ aliasName, type, tags });
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
