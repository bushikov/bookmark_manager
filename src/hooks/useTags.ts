import { useState, useEffect } from "react";
import db, { Bookmark, Tag } from "db";
import { useBookmarksUpdateSwitch, useTagsUpdateSwitch } from "hooks";

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchingWords, setSearchingWords] = useState<string[]>([""]);

  const { switchState: switchBookmarkState } = useBookmarksUpdateSwitch();
  const { updateState, switchState: switchTagsState } = useTagsUpdateSwitch();

  const addTag = async (tag: string, bookmark: Bookmark) => {
    await db.addTag(tag, bookmark);
    switchBookmarkState();
    switchTagsState();
  };

  const renameTag = async (newTag: Tag) => {
    await db.renameTag(newTag);
    switchBookmarkState();
    switchTagsState();
  };

  const removeTag = async (tag: string, bookmark: Bookmark) => {
    await db.removeTag(tag, bookmark);
    switchBookmarkState();
    switchTagsState();
  };

  useEffect(() => {
    (async () => {
      setTags(await db.searchTags(searchingWords));
    })();
  }, [searchingWords, updateState]);

  return {
    tags,
    addTag,
    renameTag,
    removeTag,
    setSearchingWords,
  };
};
