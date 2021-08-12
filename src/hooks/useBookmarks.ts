import { useState, useEffect } from "react";
import db, { BookmarkWithTags, TagAlias } from "db";

export const useBookmarks = () => {
  const [urls, setUrls] = useState([]);
  const [tags, setTags] = useState([""]);
  const [tagAlias, setTagAlias] = useState<TagAlias | null>(null);
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
    db.getBookmarksWithTagsByTag(tags).then((result) => {
      setBookmarks(result);
    });
  }, [tags]);

  useEffect(() => {
    db.getBookamrksByTagAlias(tagAlias).then((result) => {
      setBookmarks(result);
    });
  }, [tagAlias]);

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
    setTags,
    setTagAlias,
    addTag,
    removeTag,
  };
};
