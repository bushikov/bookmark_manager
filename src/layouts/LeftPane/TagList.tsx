import React, { useState, useEffect } from "react";

import { Tag, TagAlias, TagSearchType } from "db";
import { useTags, useTagAliases } from "hooks";
import { TagAccordion, TagAliasAccordion } from "components/Accordions";
import { TagForm, TagAliasForm } from "components/Forms";

const initialTagAlias: TagAlias = {
  name: "",
  type: "and",
  tags: new Set(),
};

type TagListProps = {
  onTagsSelect: (arg0: Set<string>) => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
  onTagSearchTypeChange: (arg0: TagSearchType) => void;
};

export const TagList: React.FC<TagListProps> = ({
  onTagsSelect,
  onTagAliasSelect,
  onTagSearchTypeChange,
}) => {
  const { tags, renameTag, setSearchingWords } = useTags();
  const { tagAliases, putTagAlias, removeTagAlias } = useTagAliases();
  const [focusedComponent, setFocusedComponent] = useState<"tag" | "alias">(
    "tag"
  );
  const [isTagFormOn, setIsTagFormOn] = useState(false);
  const [targetTag, setTargetTag] = useState<Tag | null>(null);
  const [isTagAliasFormOn, setIsTagAliasFormOn] = useState(false);
  const [targetTagAlias, setTargetTagAlias] = useState<TagAlias>(
    initialTagAlias
  );
  const [checkedTagNames, setCheckedTagNames] = useState<Set<string>>(
    new Set([])
  );

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
          tags={tags}
          isFocus={focusedComponent === "tag"}
          checkedTagNames={checkedTagNames}
          onTagSearchTypeChange={onTagSearchTypeChange}
          onTagCheckChange={(tagName) => {
            setFocusedComponent("tag");

            let newTagNames = new Set([...checkedTagNames]);
            if (checkedTagNames.has(tagName)) {
              newTagNames.delete(tagName);
            } else {
              newTagNames.add(tagName);
            }
            setCheckedTagNames(newTagNames);

            onTagsSelect(newTagNames);
          }}
          onRename={(tag) => {
            setTargetTag(tag);
            setIsTagFormOn(true);
          }}
        />
        <TagAliasAccordion
          title="Tag alias"
          tagAliases={tagAliases}
          isFocus={focusedComponent == "alias"}
          onSelect={(tagAlias) => {
            setFocusedComponent("alias");
            // ?????????????????????????????????????????????????????????useEffect?????????????????????????????????
            onTagAliasSelect({ ...tagAlias });
          }}
          onAdd={() => {
            setIsTagAliasFormOn(true);
          }}
          onEdit={(tagAlias) => {
            setTargetTagAlias(tagAlias);
            setIsTagAliasFormOn(true);
            setFocusedComponent("alias");
          }}
          onDelete={(tagAlias) => {
            removeTagAlias(tagAlias);
          }}
        />
        {isTagFormOn && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 p-20 z-50"
            onClick={() => {
              setIsTagFormOn(false);
              setTargetTag(null);
            }}
          >
            <TagForm
              tag={targetTag}
              onSubmit={(tag) => {
                renameTag(tag);
                setIsTagFormOn(false);
              }}
              onCancel={() => {
                setIsTagFormOn(false);
                setTargetTag(null);
              }}
            />
          </div>
        )}
        {isTagAliasFormOn && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 p-20 z-50"
            onClick={() => {
              setIsTagAliasFormOn(false);
              setTargetTagAlias(initialTagAlias);
            }}
          >
            <TagAliasForm
              tagAlias={targetTagAlias}
              onSubmit={(alias) => {
                putTagAlias({ ...alias, tags: new Set(alias.tags) });
                setIsTagAliasFormOn(false);
              }}
              onCancel={() => {
                setIsTagAliasFormOn(false);
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
