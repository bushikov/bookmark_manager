import React, { useState } from "react";

import { TagAlias } from "db";

type TagAliasAccordionProps = {
  title: string;
  isFocus: boolean;
  tagAliases: TagAlias[];
  onSelect: (tagAlias: TagAlias) => void;
  onAdd: () => void;
  onEdit: (tagAlias: TagAlias) => void;
  onDelete: (tagAlias: TagAlias) => void;
};

export const TagAliasAccordion: React.FC<TagAliasAccordionProps> = ({
  title,
  isFocus,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  tagAliases,
}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div>
      <div
        className="border border-gray-200 py-2 pl-3 pr-2 cursor-pointer"
        onClick={() => setIsFolded(!isFolded)}
      >
        <div className="flex flex-row justify-between">
          <p className="py-1">{title}</p>
          <button
            className="rounded px-2 py-1 bg-blue-500 text-white hover:bg-blue-700 focus:ring shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            ADD
          </button>
        </div>
      </div>
      {!isFolded &&
        tagAliases &&
        tagAliases.map((tagAlias, index) => (
          <div
            key={tagAlias.id}
            className={`border border-gray-200 pl-8 py-2 pr-2 ${
              isFocus && index === selectedIndex ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex flex-row justify-between">
              <p className="py-1">{tagAlias.name}</p>
              <div className="flex space-x-3">
                <button
                  className="rounded px-2 py-1 bg-blue-500 text-white hover:bg-blue-700 focus:ring shadow-lg"
                  onClick={() => {
                    setSelectedIndex(null);
                    onEdit(tagAlias);
                  }}
                >
                  EDIT
                </button>
                <button
                  className="rounded px-2 py-1 bg-red-500 text-white hover:bg-red-700 focus:ring shadow-lg"
                  onClick={() => {
                    setSelectedIndex(null);
                    onDelete(tagAlias);
                  }}
                >
                  DELETE
                </button>
                <button
                  className={`rounded px-2 py-1 bg-gray-100 hover:bg-gray-300 focus:ring ${
                    isFocus && index == selectedIndex
                      ? "shadow-inner"
                      : "shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedIndex(index);
                    onSelect(tagAlias);
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
