import React, { useState, useEffect } from "react";
import { useChromeWindows } from "hooks";
import { TabHeader } from "components/TabHeader";
import { TitleCard } from "components/TitleCard";
import { Accordion } from "components/Accordion";
import { useTags } from "hooks";

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

type TagListProps = {
  onTagSelect: (arg0: string) => void;
};

const TagList: React.FC<TagListProps> = ({ onTagSelect }) => {
  const { tags, setTexts } = useTags();

  return (
    <>
      <div className="pb-2">
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
      <div>
        <Accordion
          title="Tag"
          labels={tags}
          isFocus={true}
          onSelect={onTagSelect}
        />
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
