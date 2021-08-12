import { useState, useEffect } from "react";
import db, { TagAlias } from "db";

type UseTagsProps = {
  base: "all" | "nothing";
};

export const useTags = ({ base }: UseTagsProps) => {
  const [texts, setTexts] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagAliases, setTagAliases] = useState<TagAlias[]>([]);

  useEffect(() => {
    if (texts.length === 1 && texts[0] === "" && base === "nothing") {
      setTags([]);
    } else {
      db.getTags(texts).then((result) => {
        setTags(result);
      });
      db.getAliases(texts).then((result) => {
        setTagAliases(result);
      });
    }
  }, [texts]);

  const addAlias = async (alias: TagAlias) => {
    await db.putAlias(alias);
    const aliases = await db.getAliases(texts);
    setTagAliases(aliases);
  };

  const removeAlias = async (aliasName: string) => {
    await db.removeAlias(aliasName);
    const aliases = await db.getAliases(texts);
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
