import { useState, useEffect } from "react";
import db, { TagAlias } from "db";

export const useTagAliases = () => {
  const [tagAliases, setTagAliases] = useState<TagAlias[]>([]);
  const [searchingWords, setSearchingWords] = useState<string[]>([""]);

  const addTagAlias = async (alias: TagAlias) => {};

  useEffect(() => {
    (async () => {
      setTagAliases(await db.searchAliases(searchingWords));
    })();
  }, [searchingWords]);

  const putTagAlias = async (tagAlias: TagAlias) => {
    await db.putTagAlias(tagAlias);
    // 追加したタグエイリアスもtagAliasesに含まれるように
    setSearchingWords([...searchingWords]);
  };

  const removeTagAlias = async (tagAliasName: string) => {
    await db.removeTagAlias(tagAliasName);
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
