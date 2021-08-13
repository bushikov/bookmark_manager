import { useState, useEffect } from "react";
import db, { BookmarkWithTags, TagAlias } from "db";

export const useBookmarks = () => {
  const [urls, setUrls] = useState([]);
  const [tags, setTags] = useState([""]);
  const [tagAlias, setTagAlias] = useState<TagAlias | null>(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [lastUpdateMeans, setLastUpdateMeans] = useState<
    "urls" | "tags" | "alias" | null
  >(null);

  const getBookmarksByUrls = async () => {
    const records = await db.getBookmarksWithTagsByUrls(urls.map((u) => u.url));
    const bookmarks = urls.map((url) => {
      const storedBookmark = records.find((record) => record.url === url.url);
      if (storedBookmark) return storedBookmark;
      return url;
    });
    setBookmarks(bookmarks);
  };

  const getBookmarksByTags = async () => {
    const bookmarks = await db.getBookmarksWithTagsByTags(tags);
    setBookmarks(bookmarks);
  };

  const getBookmarksByTagAlias = async () => {
    const bookmarks = await db.getBookmarksByTagAlias(tagAlias);
    setBookmarks(bookmarks);
  };

  useEffect(() => {
    getBookmarksByUrls();
    setLastUpdateMeans("urls");
  }, [urls]);

  useEffect(() => {
    getBookmarksByTags();
    setLastUpdateMeans("tags");
  }, [tags]);

  useEffect(() => {
    getBookmarksByTagAlias();
    setLastUpdateMeans("alias");
  }, [tagAlias]);

  const addTag = async (tag: string, bookmark: BookmarkWithTags) => {
    await db.addTag(tag, bookmark);
    switch (lastUpdateMeans) {
      case "urls":
        getBookmarksByUrls();
        setLastUpdateMeans("urls");
      case "tags":
        getBookmarksByTags();
        setLastUpdateMeans("tags");
      case "alias":
        getBookmarksByTagAlias();
        setLastUpdateMeans("alias");
      default:
    }
  };

  const removeTag = async (tag: string, bookmark: BookmarkWithTags) => {
    await db.removeTag(tag, bookmark);
    switch (lastUpdateMeans) {
      case "urls":
        getBookmarksByUrls();
        setLastUpdateMeans("urls");
      case "tags":
        getBookmarksByTags();
        setLastUpdateMeans("tags");
      case "alias":
        getBookmarksByTagAlias();
        setLastUpdateMeans("alias");
      default:
    }
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
