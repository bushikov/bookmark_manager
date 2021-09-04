import React, { useState, useEffect } from "react";

import { TagAlias } from "db";
import { useTags, useTagAliases } from "hooks";
import { TagAccordion, TagAliasAccordion } from "components/Accordions";
import { Form } from "components/Form";

const initialTagAlias: TagAlias = {
  name: "",
  type: "and",
  tags: new Set(),
};

type TagListProps = {
  onTagSelect: (arg0: Set<string>) => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
};

export const TagList: React.FC<TagListProps> = ({
  onTagSelect,
  onTagAliasSelect,
}) => {
  const { tags, setSearchingWords } = useTags();
  const { tagAliases, putTagAlias, removeTagAlias } = useTagAliases();
  const [focusedComponent, setFocusedComponent] = useState<"tag" | "alias">(
    "tag"
  );
  const [isFormOn, setIsFormOn] = useState(false);
  const [targetTagAlias, setTargetTagAlias] = useState<TagAlias>(
    initialTagAlias
  );
  const [tagLabels, setTagLabels] = useState<string[]>([]);
  const [tagAliaseLabels, setTagAliaseLabels] = useState<string[]>([]);

  useEffect(() => {
    setTagLabels(tags.map((tag) => tag.name));
  }, [tags]);

  useEffect(() => {
    setTagAliaseLabels(tagAliases.map((alias) => alias.name));
  }, [tagAliases]);

  return (
    <>
      <div className="pb-4">
        <input
          type="text"
          className="px-2 py-1 rounded bg-gray-100 shadow-inner focus:ring focus:outline-none w-full text-base"
          onChange={(e) => {
            setSearchingWords(
              e.target.value
                .trim()
                .replace(/\s{2,}/g, " ")
                .split(" ")
            );
          }}
        />
      </div>
      <div className="space-y-4">
        <TagAccordion
          title="Tag"
          labels={tagLabels}
          isFocus={focusedComponent === "tag"}
          onSelect={(label) => {
            setFocusedComponent("tag");
            onTagSelect(new Set([label]));
          }}
        />
        <TagAliasAccordion
          title="Tag alias"
          tagAliases={tagAliases}
          isFocus={focusedComponent == "alias"}
          onSelect={(tagAlias) => {
            setFocusedComponent("alias");
            // 新しくオブジェクトを作成しているのは、useEffectを毎回動作させたいため
            onTagAliasSelect({ ...tagAlias });
          }}
          onAdd={() => {
            setIsFormOn(true);
          }}
          onEdit={(tagAlias) => {
            setTargetTagAlias(tagAlias);
            setIsFormOn(true);
            setFocusedComponent("alias");
          }}
          onDelete={(tagAlias) => {
            removeTagAlias(tagAlias);
          }}
        />
        {isFormOn && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 p-20 z-50"
            onClick={() => {
              setIsFormOn(false);
              setTargetTagAlias(initialTagAlias);
            }}
          >
            <Form
              initialAliasName={targetTagAlias.name}
              initialType={targetTagAlias.type}
              initialTags={[...targetTagAlias.tags].join(" ")}
              onSubmit={(alias) => {
                putTagAlias({ ...alias, tags: new Set(alias.tags) });
                setIsFormOn(false);
              }}
              onCancel={() => {
                setIsFormOn(false);
                setTargetTagAlias(initialTagAlias);
              }}
              validate={({ name, type, tags }) => {
                if (name.trim() === "") return false;
                if (!["and", "or"].includes(type)) return false;
                if (tags.length === 0 || new Set(tags).has("")) return false;
                return true;
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
