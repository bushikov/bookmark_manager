import React, { useState, useEffect } from "react";
import { useTags } from "hooks";
import { UrlCard } from "components/UrlCard";
import { Bookmark } from "db";

type RightPaneProps = {
  height: number;
  bookmarks: Bookmark[];
  reflashFlg: any;
};

export const RightPane: React.FC<RightPaneProps> = ({
  height,
  bookmarks,
  reflashFlg,
}) => {
  const { tags, addTag, removeTag, setSearchingWords } = useTags();
  const [tagLabels, setTagLabels] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [extractedBookmarks, setExtractedBookmarks] = useState<Bookmark[]>(
    bookmarks
  );

  useEffect(() => {
    // スクロール位置の初期化
    document.getElementById("rightpane").scrollTo(0, 0);
  }, [reflashFlg]);

  useEffect(() => {
    setTagLabels(tags.map((tag) => tag.name));
  }, [tags]);

  useEffect(() => {
    setExtractedBookmarks(
      bookmarks.filter((b) => {
        if (text === "") return true;
        if (b.title.indexOf(text) !== -1) return true;
        if (b.url.indexOf(text) !== -1) return true;
        return false;
      })
    );
  }, [text, bookmarks]);

  return (
    <div
      id="rightpane"
      className="pt-7 pl-12 pr-4 pb-4 overflow-auto"
      style={{ height }}
    >
      <div className="pt-8">
        <input
          type="text"
          className="px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none w-full text-base"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <p className="text-base pt-4">
          {`${extractedBookmarks.length} ${
            extractedBookmarks.length === 1 ? "tab" : "tabs"
          }`}
        </p>
      </div>
      {extractedBookmarks.map((bookmark) => {
        return (
          <div className="pt-2">
            <UrlCard
              title={bookmark.title}
              url={bookmark.url}
              tags={bookmark.tags ? [...bookmark.tags] : []}
              tagCandidates={tagLabels}
              onAdd={(tag) => {
                if (tag === "") return;
                setSearchingWords([]);
                addTag(tag, bookmark);
              }}
              onDelete={(tag) => {
                setSearchingWords([]);
                removeTag(tag, bookmark);
              }}
              onChange={(text) => {
                setSearchingWords([text]);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
