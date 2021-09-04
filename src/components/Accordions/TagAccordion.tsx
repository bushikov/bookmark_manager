import React, { useState } from "react";

import { Tag } from "db";

export type TagAccordionProps = {
  title: string;
  tags: Tag[];
  isFocus: boolean;
  onSelect: (arg0: string) => void;
  onRename: (arg0: Tag) => void;
};

export const TagAccordion: React.FC<TagAccordionProps> = ({
  title,
  tags,
  isFocus,
  onSelect,
  onRename,
}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
              isFocus && index === selectedIndex ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex flex-row justify-between">
              <p className="py-1">{tag.name}</p>
              <div className="flex space-x-3">
                <button
                  className="rounded px-2 py-1 bg-blue-500 text-white hover:bg-blue-700 focus:ring shadow-lg"
                  onClick={() => {
                    onRename(tag);
                  }}
                >
                  RENAME
                </button>
                <button
                  className={`rounded px-2 py-1 bg-gray-100 hover:bg-gray-300 focus:ring ${
                    isFocus && index == selectedIndex
                      ? "shadow-inner"
                      : "shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedIndex(index);
                    onSelect(tag.name);
                  }}
                >
                  SELECT
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
