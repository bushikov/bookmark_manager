import { useState, useEffect } from "react";
import db from "db";

export const useTags = () => {
  const [texts, setTexts] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    db.getTags(texts).then((result) => {
      setTags(result);
    });
  }, [texts]);

  return {
    tags,
    setTexts,
  };
};
