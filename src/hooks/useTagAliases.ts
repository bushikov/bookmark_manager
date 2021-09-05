import { useState, useEffect } from "react";
import db, { TagAlias } from "db";
import { useTagsUpdateSwitch } from "hooks";

export const useTagAliases = () => {
  const [tagAliases, setTagAliases] = useState<TagAlias[]>([]);
  const [searchingWords, setSearchingWords] = useState<string[]>([""]);

  const { updateState } = useTagsUpdateSwitch();

  const addTagAlias = async (alias: TagAlias) => {};

  useEffect(() => {
    (async () => {
      setTagAliases(await db.searchAliases(searchingWords));
    })();
  }, [searchingWords, updateState]);

  const putTagAlias = async (tagAlias: TagAlias) => {
    await db.putTagAlias(tagAlias);
    // 追加したタグエイリアスもtagAliasesに含まれるように
    setSearchingWords([...searchingWords]);
  };

  const removeTagAlias = async (tagAlias: TagAlias) => {
    await db.removeTagAlias(tagAlias);
    // 追加したタグエイリアスもtagAliasesに含まれるように
    setSearchingWords([...searchingWords]);
  };

  return {
    tagAliases,
    putTagAlias,
    removeTagAlias,
    setSearchingWords,
  };
};
