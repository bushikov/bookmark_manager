import React, { useState, useEffect } from "react";
import { Tag } from "components/Tag";

type UrlCardProps = {
  title: string;
  url: string;
  tags?: string[];
  tagCandidates: string[];
  onAdd: (arg0: string) => void;
  onDelete: (arg0: string) => void;
  onChange: (arg0: string) => void;
};

export const UrlCard: React.FC<UrlCardProps> = ({
  title,
  url,
  tags,
  tagCandidates,
  onAdd,
  onDelete,
  onChange,
}) => {
  const [text, setText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const addableTagCandidates = tags
    ? tagCandidates.filter((c) => !tags.includes(c))
    : tagCandidates;

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
      {tags && tags.length !== 0 && (
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
            onAdd(text);
            setText("");
            onChange("");
          }}
        >
          ADD
        </button>
        <div className="w-full relative">
          <input
            type="text"
            className="px-2 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none w-full"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onChange(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // 候補クリック前に候補が非表示にならないように
              setTimeout(() => setIsFocused(false), 100);
            }}
          />
          {isFocused &&
            addableTagCandidates &&
            addableTagCandidates.length !== 0 && (
              <ul className="absolute bg-white w-full border border-gray-200 pl-2 py-1 max-h-32 overflow-y-scroll">
                {addableTagCandidates.map((tagCandidate) => (
                  <li
                    className="cursor-pointer"
                    key={tagCandidate}
                    onClick={() => {
                      onAdd(tagCandidate);
                      setText("");
                      onChange("");
                    }}
                  >
                    {tagCandidate}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
};
