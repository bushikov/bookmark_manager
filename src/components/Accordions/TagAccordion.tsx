import React, { useState } from "react";

import { Tag } from "db";

export type TagAccordionProps = {
  title: string;
  tags: Tag[];
  isFocus: boolean;
  onCheck: (arg0: Set<Tag>) => void;
  onRename: (arg0: Tag) => void;
};

export const TagAccordion: React.FC<TagAccordionProps> = ({
  title,
  tags,
  isFocus,
  onCheck,
  onRename,
}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [checkedTags, setCheckedTags] = useState<Set<Tag>>(new Set());

  return (
    <div>
      <div
        className="border border-gray-200 p-3 cursor-pointer"
        onClick={() => setIsFolded(!isFolded)}
      >
        {title}
      </div>
      {!isFolded &&
        tags.map((tag, index) => (
          <div
            key={tag.id}
            className={`border border-gray-200 pl-8 py-2 pr-2 ${
              isFocus && checkedTags.has(tag) ? "bg-gray-100" : "bg-white"
            }`}
          >
            <label className="flex flex-row justify-between items-center">
              <input
                type="checkbox"
                style={{ height: 12, width: 12 }}
                checked={checkedTags.has(tag)}
                onChange={() => {
                  let newTags = new Set([...checkedTags]);
                  if (checkedTags.has(tag)) {
                    newTags.delete(tag);
                    setCheckedTags(newTags);
                  } else {
                    newTags.add(tag);
                    setCheckedTags(newTags);
                  }

                  onCheck(newTags);
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
