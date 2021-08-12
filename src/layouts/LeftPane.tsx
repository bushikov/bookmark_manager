import React, { useState } from "react";
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
  aliasName: "",
  type: "rename",
  tags: [],
};

type TagListProps = {
  onTagSelect: (arg0: string) => void;
};

const TagList: React.FC<TagListProps> = ({ onTagSelect }) => {
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
          labels={tags}
          isFocus={focusedComponent === "tag"}
          onSelect={(label) => {
            setFocusedComponent("tag");
            onTagSelect(label);
          }}
        />
        <FunctionalAccordion
          title="Tag alias"
          labels={tagAliases.map((alias) => alias.aliasName)}
          isFocus={focusedComponent == "alias"}
          onSelect={(label) => {
            setFocusedComponent("alias");
            console.log(label);
          }}
          onAdd={() => {
            setIsFormOn(true);
          }}
          onEdit={(label) => {
            setTargetTagAlias(
              tagAliases.find((alias) => alias.aliasName === label)
            );
            setIsFormOn(true);
            setFocusedComponent("alias");
          }}
          onDelete={(label) => removeAlias(label)}
        />
        {isFormOn && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-80 p-20"
            onClick={() => {
              setIsFormOn(false);
              setTargetTagAlias(initialTagAlias);
            }}
          >
            <Form
              initialAliasName={targetTagAlias.aliasName}
              initialType={targetTagAlias.type}
              initialTags={targetTagAlias.tags.join(" ")}
              onSubmit={(alias) => {
                addAlias(alias);
                setIsFormOn(false);
              }}
              onCancel={() => {
                setIsFormOn(false);
                setTargetTagAlias(initialTagAlias);
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
  onTagSelect: (arg0: string) => void;
  onTabChange: () => void;
};

export const LeftPane: React.FC<LeftPaneProps> = ({
  height,
  onWindowSelect,
  onTagSelect,
  onTabChange,
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
          <TagList onTagSelect={onTagSelect} />
        )}
      </div>
    </div>
  );
};
