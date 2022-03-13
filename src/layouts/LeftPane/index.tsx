import React, { useState, useCallback } from "react";

import db, { TagAlias, TagSearchType } from "db";
import { TabHeader } from "components/TabHeader";
import { WindowList } from "./WindowList";
import { TagList } from "./TagList";

const TabLabels = ["Window", "Tag"];

type LeftPaneProps = {
  height: number;
  onWindowSelect: (arg0: number) => void;
  onTagsSelect: (arg0: Set<string>) => void;
  onTabChange: () => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
  onTagSearchTypeChange: (arg0: TagSearchType) => void;
};

export const LeftPane: React.FC<LeftPaneProps> = ({
  height,
  onWindowSelect,
  onTagsSelect,
  onTabChange,
  onTagAliasSelect,
  onTagSearchTypeChange,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  // https://qiita.com/kerupani129/items/99fd7a768538fcd33420#12-%E6%96%B9%E6%B3%952-blob-url-%E3%82%92%E4%BD%BF%E3%81%86
  const downloadBookmarks = useCallback(async () => {
    const bookmarks = await db.getAllBookmarks();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(bookmarks)], { type: "text/plain" })
    );
    a.download = "bookmarks.txt";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const downloadTags = useCallback(async () => {
    const tags = await db.getAllTags();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(tags)], { type: "text/plain" })
    );
    a.download = "tags.txt";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const downloadAliases = useCallback(async () => {
    const aliases = await db.getAllAliases();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(aliases)], { type: "text/plain" })
    );
    a.download = "aliases.txt";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return (
    <div className="px-4 pb-4 overflow-y-auto" style={{ height }}>
      <div className="py-2 flex gap-x-1">
        <p>Download: </p>
        <button
          className="rounded bg-blue-500 hover:bg-blue-700 text-white px-2 focus:ring px-2 cursor-pointer"
          onClick={downloadBookmarks}
        >
          Bookmarks
        </button>
        <button
          className="rounded bg-blue-500 hover:bg-blue-700 text-white px-2 focus:ring px-2 cursor-pointer"
          onClick={downloadTags}
        >
          Tags
        </button>
        <button
          className="rounded bg-blue-500 hover:bg-blue-700 text-white px-2 focus:ring px-2 cursor-pointer"
          onClick={downloadAliases}
        >
          TagAliases
        </button>
      </div>
      <TabHeader
        labels={TabLabels}
        onChange={(i) => {
          onTabChange();
          setTabIndex(i);
        }}
      />
      <div className="pt-4">
        {tabIndex === 0 ? (
          <WindowList onWindowSelect={onWindowSelect} />
        ) : (
          <TagList
            onTagsSelect={onTagsSelect}
            onTagAliasSelect={onTagAliasSelect}
            onTagSearchTypeChange={onTagSearchTypeChange}
          />
        )}
      </div>
    </div>
  );
};
