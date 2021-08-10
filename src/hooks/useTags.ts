import { useState, useEffect } from "react";
import db from "db";

type UseTagsProps = {
  base: "all" | "nothing";
};

export const useTags = ({ base }: UseTagsProps) => {
  const [texts, setTexts] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (texts.length === 1 && texts[0] === "" && base === "nothing") {
      setTags([]);
    } else {
      db.getTags(texts).then((result) => {
        setTags(result);
      });
    }
  }, [texts]);

  return {
    tags,
    setTexts,
  };
};
