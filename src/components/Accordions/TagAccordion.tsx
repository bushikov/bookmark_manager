import React, { useState, useEffect } from "react";

import { Tag, TagSearchType } from "db";

type SortType = "Tag Asc" | "Tag Desc" | "Number Asc" | "Number Desc";

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
  const [sortType, setSortType] = useState<SortType>("Tag Asc");
  const [sortedTags, setSortedTags] = useState<Tag[]>(tags);

  useEffect(() => {
    console.log("===================");
    console.log(sortType);

    switch (sortType) {
      case "Tag Asc": {
        const t = [...tags];
        t.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        setSortedTags(t);
        break;
      }
      case "Tag Desc": {
        const t = [...tags];
        t.sort((a, b) => {
          if (a.name < b.name) return 1;
          if (a.name > b.name) return -1;
          return 0;
        });
        setSortedTags(t);
        break;
      }
      case "Number Asc": {
        const t = [...tags];
        t.sort((a, b) => {
          if (a.bookmarkIds.size < b.bookmarkIds.size) return -1;
          if (a.bookmarkIds.size > b.bookmarkIds.size) return 1;
          return 0;
        });
        setSortedTags(t);
        break;
      }
      case "Number Desc": {
        const t = [...tags];
        t.sort((a, b) => {
          if (a.bookmarkIds.size < b.bookmarkIds.size) return 1;
          if (a.bookmarkIds.size > b.bookmarkIds.size) return -1;
          return 0;
        });
        setSortedTags(t);
        break;
      }
    }
  }, [sortType, tags]);

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
          ソート
          <select
            className="ml-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none"
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value as SortType);
            }}
          >
            <option value="Tag Asc">Tag Asc</option>
            <option value="Tag Desc">Tag Desc</option>
            <option value="Number Asc">Number Asc</option>
            <option value="Number Desc">Number Desc</option>
          </select>
        </div>
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
        sortedTags.map((tag, index) => (
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
              <p className="px-2 py-1 flex-grow">{`${tag.name} ( ${tag.bookmarkIds.size} )`}</p>
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
