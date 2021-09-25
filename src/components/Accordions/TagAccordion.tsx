import React, { useState } from "react";

import { Tag, TagSearchType } from "db";

export type TagAccordionProps = {
  title: string;
  tags: Tag[];
  isFocus: boolean;
  checkedTagNames: Set<string>;
  onTagSearchTypeChange: (arg0: TagSearchType) => void;
  onTagCheckChange: (arg0: string) => void;
  onRename: (arg0: Tag) => void;
};

export const TagAccordion: React.FC<TagAccordionProps> = ({
  title,
  tags,
  isFocus,
  checkedTagNames,
  onTagSearchTypeChange,
  onTagCheckChange,
  onRename,
}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [type, setType] = useState<TagSearchType>("or");

  return (
    <div>
      <div
        className="flex flex-row justify-between border border-gray-200 p-3 cursor-pointer"
        onClick={() => setIsFolded(!isFolded)}
      >
        {title}
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          タグ検索条件
          <select
            className="ml-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
            value={type}
            onChange={(e) => {
              setType(e.target.value as TagSearchType);
              onTagSearchTypeChange(e.target.value as TagSearchType);
            }}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>
      </div>
      {!isFolded &&
        tags.map((tag, index) => (
          <div
            key={tag.id}
            className={`border border-gray-200 pl-8 py-2 pr-2 ${
              isFocus && checkedTagNames.has(tag.name)
                ? "bg-gray-100"
                : "bg-white"
            }`}
          >
            <label className="flex flex-row justify-between items-center">
              <input
                type="checkbox"
                style={{ height: 12, width: 12 }}
                checked={checkedTagNames.has(tag.name)}
                onChange={() => {
                  onTagCheckChange(tag.name);
                }}
              />
              <p className="px-2 py-1 flex-grow">{tag.name}</p>
              <div className="flex space-x-3">
                <button
                  className="rounded px-2 py-1 bg-blue-500 text-white hover:bg-blue-700 focus:ring shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename(tag);
                  }}
                >
                  RENAME
                </button>
              </div>
            </label>
          </div>
        ))}
    </div>
  );
};
