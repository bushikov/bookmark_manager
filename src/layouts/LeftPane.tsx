import React, { useState, useEffect } from "react";
import { useChromeWindows, useTags } from "hooks";
import { TabHeader } from "components/TabHeader";
import { TitleCard } from "components/TitleCard";
import { Accordion, FunctionalAccordion } from "components/Accordion";
import { Form } from "components/Form";
import { TagAlias } from "db";

type WindowListProps = {
  onWindowSelect: (id: number) => void;
};

const WindowList: React.FC<WindowListProps> = ({ onWindowSelect }) => {
  const { currentWindow, otherWindows } = useChromeWindows();
  const [pressedWindowIndex, setPressedWindowIndex] = useState<number | null>(
    null
  );

  return (
    <>
      {currentWindow && (
        <TitleCard
          title="Current Window"
          id={currentWindow.id}
          onClick={() => {
            setPressedWindowIndex(0);
            onWindowSelect(currentWindow.id);
          }}
          key={currentWindow.id}
          onPressed={pressedWindowIndex === 0}
        />
      )}
      {otherWindows.map((otherWindow, index) => (
        <div className="pt-2">
          <TitleCard
            title={`Window${index + 1}`}
            id={otherWindow.id}
            onClick={() => {
              setPressedWindowIndex(index + 1);
              onWindowSelect(otherWindow.id);
            }}
            key={otherWindow.id}
            onPressed={pressedWindowIndex === index + 1}
          />
        </div>
      ))}
    </>
  );
};

const initialTagAlias: TagAlias = {
  name: "",
  type: "and",
  tags: new Set(),
};

type TagListProps = {
  onTagSelect: (arg0: Set<string>) => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
};

const TagList: React.FC<TagListProps> = ({ onTagSelect, onTagAliasSelect }) => {
  const { tags, tagAliases, setTexts, addAlias, removeAlias } = useTags({
    base: "all",
  });
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
            setTexts(
              e.target.value
                .trim()
                .replace(/\s{2,}/g, " ")
                .split(" ")
            );
          }}
        />
      </div>
      <div className="space-y-4">
        <Accordion
          title="Tag"
          labels={tagLabels}
          isFocus={focusedComponent === "tag"}
          onSelect={(label) => {
            setFocusedComponent("tag");
            onTagSelect(new Set([label]));
          }}
        />
        <FunctionalAccordion
          title="Tag alias"
          labels={tagAliaseLabels}
          isFocus={focusedComponent == "alias"}
          onSelect={(label) => {
            setFocusedComponent("alias");
            // 新しくオブジェクトを作成しているのは、useEffectを毎回動作させたいため
            onTagAliasSelect({
              ...tagAliases.find((alias) => alias.name === label),
            });
          }}
          onAdd={() => {
            setIsFormOn(true);
          }}
          onEdit={(label) => {
            setTargetTagAlias(tagAliases.find((alias) => alias.name === label));
            setIsFormOn(true);
            setFocusedComponent("alias");
          }}
          onDelete={(label) => removeAlias(label)}
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
                addAlias({ ...alias, tags: new Set(alias.tags) });
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

const TabLabels = ["Window", "Tag"];

type LeftPaneProps = {
  height: number;
  onWindowSelect: (arg0: number) => void;
  onTagSelect: (arg0: Set<string>) => void;
  onTabChange: () => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
};

export const LeftPane: React.FC<LeftPaneProps> = ({
  height,
  onWindowSelect,
  onTagSelect,
  onTabChange,
  onTagAliasSelect,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="px-4 pb-4 overflow-y-auto" style={{ height }}>
      <TabHeader
        labels={TabLabels}
        onChange={(i) => {
          onTabChange();
          setTabIndex(i);
        }}
      />
      <div className="pt-4">
        {tabIndex === 0 ? (
          <WindowList onWindowSelect={onWindowSelect} />
        ) : (
          <TagList
            onTagSelect={onTagSelect}
            onTagAliasSelect={onTagAliasSelect}
          />
        )}
      </div>
    </div>
  );
};
