import React, { useState, useEffect } from "react";
import { useTags } from "hooks";
import { UrlCard } from "components/UrlCard";
import { Bookmark } from "db";

type RightPaneProps = {
  height: number;
  bookmarks: Bookmark[];
  addTag: (arg0: string, arg1: Bookmark) => void;
  removeTag: (arg0: string, arg1: Bookmark) => void;
  reflashFlg: any;
};

export const RightPane: React.FC<RightPaneProps> = ({
  height,
  bookmarks,
  addTag,
  removeTag,
  reflashFlg,
}) => {
  const { tags, setTexts } = useTags({ base: "all" });
  const [tagLabels, setTagLabels] = useState<string[]>([]);

  useEffect(() => {
    // スクロール位置の初期化
    document.getElementById("rightpane").scrollTo(0, 0);
  }, [reflashFlg]);

  useEffect(() => {
    setTagLabels(tags.map((tag) => tag.name));
  }, [tags]);

  return (
    <div
      id="rightpane"
      className="pt-7 pl-12 pr-4 pb-4 overflow-auto"
      style={{ height }}
    >
      <p className="text-base">
        {`${bookmarks.length} ${bookmarks.length === 1 ? "tab" : "tabs"}`}
      </p>
      {bookmarks.map((bookmark) => {
        return (
          <div className="pt-2">
            <UrlCard
              title={bookmark.title}
              url={bookmark.url}
              tags={bookmark.tags ? [...bookmark.tags] : []}
              tagCandidates={tagLabels}
              onAdd={(tag) => {
                setTexts([]);
                addTag(tag, bookmark);
              }}
              onDelete={(tag) => {
                setTexts([]);
                removeTag(tag, bookmark);
              }}
              onChange={(text) => {
                setTexts([text]);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
