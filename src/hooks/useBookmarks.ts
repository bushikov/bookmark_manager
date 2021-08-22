import { useState, useEffect } from "react";
import db, { Bookmark, TagAlias } from "db";
import { useBookmarksUpdateSwitch } from "hooks";

type BookmarkUpdateCondition = {
  type: "url" | "tag" | "tagAlias" | null;
  detail?: {
    urls?: string[];
    tags?: Set<string>;
    tagAlias?: TagAlias;
  };
};

const initialBookmarkUpdateCondition: BookmarkUpdateCondition = {
  type: null,
};

export const useBookmarks = () => {
  const [urls, setUrls] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Set<string>>(new Set([]));
  const [tagAlias, setTagAlias] = useState<TagAlias | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [conditions, setConditions] = useState<BookmarkUpdateCondition>(
    initialBookmarkUpdateCondition
  );

  const { updateState } = useBookmarksUpdateSwitch();

  useEffect(() => {
    setConditions({ type: "url", detail: { urls: urls.map((u) => u.url) } });
  }, [urls]);

  useEffect(() => {
    setConditions({ type: "tag", detail: { tags } });
  }, [tags]);

  useEffect(() => {
    if (!tagAlias) return;
    setConditions({ type: "tagAlias", detail: { tagAlias } });
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
        (async () => {
          setBookmarks(await db.getBookmarksByTags(conditions.detail.tags));
        })();
        break;
      case "tagAlias":
        (async () => {
          setBookmarks(
            await db.getBookmarksByTagAlias(conditions.detail.tagAlias)
          );
        })();
        break;
      default:
    }
  }, [conditions, updateState]);

  return {
    bookmarks,
    setUrls,
    setTags,
    setTagAlias,
  };
};
