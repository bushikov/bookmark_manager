import { useState, useEffect } from "react";
import db, { Bookmark, TagAlias, TagSearchType } from "db";
import { useBookmarksUpdateSwitch } from "hooks";

type BookmarkUpdateCondition =
  | InitialCondition
  | UrlCondition
  | TagCondition
  | TagAliasCondition;

type InitialCondition = {
  type: null;
  detail: null;
};

type UrlCondition = {
  type: "url";
  detail: string[];
};

type TagCondition = {
  type: "tag";
  detail: {
    data: Set<string>;
    tagSearchType: TagSearchType;
  };
};

type TagAliasCondition = {
  type: "tagAlias";
  detail: TagAlias;
};

const initialBookmarkUpdateCondition: BookmarkUpdateCondition = {
  type: null,
  detail: null,
};

export const useBookmarks = () => {
  const [urls, setUrls] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Set<string>>(new Set([]));
  const [tagAlias, setTagAlias] = useState<TagAlias | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [conditions, setConditions] = useState<BookmarkUpdateCondition>(
    initialBookmarkUpdateCondition
  );
  const [tagSearchType, setTagSearchType] = useState<TagSearchType>(
    "or" as TagSearchType
  );

  const { updateState } = useBookmarksUpdateSwitch();

  useEffect(() => {
    setConditions({ type: "url", detail: urls.map((u) => u.url) });
  }, [urls]);

  useEffect(() => {
    setConditions({ type: "tag", detail: { data: tags, tagSearchType } });
  }, [tags, tagSearchType]);

  useEffect(() => {
    if (!tagAlias) return;
    setConditions({ type: "tagAlias", detail: tagAlias });
  }, [tagAlias]);

  useEffect(() => {
    switch (conditions.type) {
      case "url":
        (async () => {
          const records = await db.getBookmarksByUrls(urls.map((u) => u.url));
          const bookmarks = urls.map((url) => {
            const storedBookmark = records.find(
              (record) => record.url === url.url
            );
            if (storedBookmark) return storedBookmark;
            return url;
          });
          setBookmarks(bookmarks);
        })();
        break;
      case "tag":
        console.log("================");
        console.log(conditions);

        (async () => {
          setBookmarks(
            await db.getBookmarksByTags(
              conditions.detail.data,
              conditions.detail.tagSearchType
            )
          );
        })();
        break;
      case "tagAlias":
        (async () => {
          setBookmarks(await db.getBookmarksByTagAlias(conditions.detail));
        })();
        break;
      default:
    }
  }, [conditions, updateState]);

  return {
    bookmarks,
    setUrls,
    setTags,
    setTagSearchType,
    setTagAlias,
  };
};
