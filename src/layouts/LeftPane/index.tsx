import React, { useState, useEffect } from "react";

import { TagAlias, TagSearchType } from "db";
import { TabHeader } from "components/TabHeader";
import { WindowList } from "./WindowList";
import { TagList } from "./TagList";

const TabLabels = ["Window", "Tag"];

type LeftPaneProps = {
  height: number;
  onWindowSelect: (arg0: number) => void;
  onTagsSelect: (arg0: Set<string>) => void;
  onTabChange: () => void;
  onTagAliasSelect: (arg0: TagAlias) => void;
  onTagSearchTypeChange: (arg0: TagSearchType) => void;
};

export const LeftPane: React.FC<LeftPaneProps> = ({
  height,
  onWindowSelect,
  onTagsSelect,
  onTabChange,
  onTagAliasSelect,
  onTagSearchTypeChange,
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
            onTagsSelect={onTagsSelect}
            onTagAliasSelect={onTagAliasSelect}
            onTagSearchTypeChange={onTagSearchTypeChange}
          />
        )}
      </div>
    </div>
  );
};
