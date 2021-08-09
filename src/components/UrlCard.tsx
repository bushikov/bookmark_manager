import React, { useState } from "react";
import { Tag } from "components/Tag";

type UrlCardProps = {
  title: string;
  url: string;
  tags?: string[];
  onAdd: (arg0: string) => void;
  onDelete: (arg0: string) => void;
};

export const UrlCard: React.FC<UrlCardProps> = ({
  title,
  url,
  tags,
  onAdd,
  onDelete,
}) => {
  const [text, setText] = useState("");

  return (
    <div className="block w-full rounded pb-2 shadow-md">
      <div className="px-4 pb-2 bg-gray-100">
        <a href={url} rel="noreferrer noopener" target="_blank">
          <p className="text-left m-0 pt-2 text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {title}
          </p>
          <p className="text-left m-0 pt-2 text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
            {decodeURI(url)}
          </p>
        </a>
      </div>
      {tags && (
        <div className="px-4 pt-2 flex flex-row space-x-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              title={tag}
              onCrossClick={(text) => onDelete(text)}
            />
          ))}
        </div>
      )}
      <div className="px-4 pt-2 space-x-2 flex flex-row">
        <button
          className="rounded bg-red-500 hover:bg-red-700 text-white font-bold px-2 focus:ring"
          onClick={() => {
            setText("");
            onAdd(text);
          }}
        >
          ADD
        </button>
        <input
          type="text"
          className="px-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
};
