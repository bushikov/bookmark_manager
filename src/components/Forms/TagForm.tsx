import React, { useState, useEffect } from "react";

import { Tag } from "db";

type TagFormProps = {
  tag: Tag;
  onSubmit: (arg0: Tag) => void;
  onCancel: () => void;
};

export const TagForm: React.FC<TagFormProps> = ({
  tag,
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState<string>("");

  return (
    <div
      className="flex flex-col space-y-2 rounded shadow-md p-4 bg-white"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex justify-center">{tag.name}</div>
      <label className="flex flex-row">
        <div className="w-24">New tag</div>
        <input
          type="text"
          className="flex-grow px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </label>
      <div className="flex flex-row justify-center space-x-4">
        <button
          className="rounded shadow-md focus:shadow-inner px-4 py-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            const newTag = text.trim().replace(/\s/g, " ");
            if (!newTag) return;
            if (newTag.indexOf(" ") !== -1) return;
            if (newTag === tag.name) return;
            onSubmit({ ...tag, name: newTag });
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
