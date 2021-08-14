import { useState, useEffect } from "react";
import db, { Tag, TagAlias } from "db";

type UseTagsProps = {
  base: "all" | "nothing";
};

export const useTags = ({ base }: UseTagsProps) => {
  const [texts, setTexts] = useState<string[]>([""]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagAliases, setTagAliases] = useState<TagAlias[]>([]);

  useEffect(() => {
    if (texts.length === 1 && texts[0] === "" && base === "nothing") {
      setTags([]);
    } else {
      db.searchTags(texts).then((result) => {
        setTags(result);
      });
      db.searchAliases(texts).then((result) => {
        setTagAliases(result);
      });
    }
  }, [texts]);

  const addAlias = async (alias: TagAlias) => {
    await db.putAlias(alias);
    const aliases = await db.searchAliases(texts);
    setTagAliases(aliases);
  };

  const removeAlias = async (aliasName: string) => {
    await db.removeAlias(aliasName);
    const aliases = await db.searchAliases(texts);
    setTagAliases(aliases);
  };

  return {
    tags,
    tagAliases,
    setTexts,
    addAlias,
    removeAlias,
  };
};
