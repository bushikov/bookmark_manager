import React, { useState } from "react";
import { TagAlias, AliasType } from "db";

type TagAliasFormProps = {
  tagAlias: TagAlias;
  onSubmit: (arg0: { name: string; type: AliasType; tags: string[] }) => void;
  onCancel: () => void;
  validate: (arg0: {
    id?: number;
    name: string;
    type: AliasType;
    tags: string[];
  }) => boolean;
};

export const TagAliasForm: React.FC<TagAliasFormProps> = ({
  tagAlias,
  onSubmit,
  onCancel,
  validate,
}) => {
  const [aliasName, setAliasName] = useState<string>(tagAlias.name);
  const [type, setType] = useState<AliasType>(tagAlias.type);
  const [tags, setTags] = useState<string>([...tagAlias.tags].join(" "));

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
            const params = {
              id: tagAlias.id,
              name: aliasName,
              type,
              tags: tags
                .trim()
                .replace(/\s{2,}/g, " ")
                .split(/,|\s/),
            };
            if (validate(params)) onSubmit(params);
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
