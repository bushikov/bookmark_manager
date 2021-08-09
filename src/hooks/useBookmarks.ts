import { useState, useEffect } from "react";
import db, { BookmarkWithTags } from "db";

export const useBookmarks = () => {
  const [urls, setUrls] = useState([]);
  const [tag, setTag] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    db.getBookmarksWithTagsByUrls(urls.map((u) => u.url)).then((result) => {
      const bookmarks = urls.map((url) => {
        const storedBookmark = result.find((r) => r.url === url.url);

        if (storedBookmark) {
          return storedBookmark;
        }

        return url;
      });
      setBookmarks(bookmarks);
    });
  }, [urls, reloadFlag]);

  useEffect(() => {
    db.getBookmarksWithTagsByTag(tag).then((result) => {
      setBookmarks(result);
    });
  }, [tag]);

  const addTag = async (tag: string, bookmark: BookmarkWithTags) => {
    await db.addTag(tag, bookmark);
    setReloadFlag(!reloadFlag);
  };

  const removeTag = async (tag: string, bookmark: BookmarkWithTags) => {
    await db.removeTag(tag, bookmark);
    setReloadFlag(!reloadFlag);
  };

  return {
    bookmarks,
    setUrls,
    setTag,
    addTag,
    removeTag,
  };
};
