import React, { useEffect } from "react";
import { useWindowHeight, useChromeTabs, useBookmarks } from "hooks";
import { LeftPane } from "layouts/LeftPane";
import { RightPane } from "layouts/RightPane";

const App: React.FC<{}> = () => {
  const windowHeight = useWindowHeight();
  const { urls, setTargetWindowId } = useChromeTabs();
  const { bookmarks, setUrls, setTags, setTagAlias } = useBookmarks();

  useEffect(() => {
    setUrls(urls);
  }, [urls]);

  return (
    <div className="grid grid-cols-3">
      <LeftPane
        height={windowHeight}
        onWindowSelect={(windowId) => setTargetWindowId(windowId)}
        onTagSelect={setTags}
        onTabChange={setTargetWindowId}
        onTagAliasSelect={setTagAlias}
      />
      <div className="col-span-2">
        <RightPane
          height={windowHeight}
          bookmarks={bookmarks}
          reflashFlg={urls}
        />
      </div>
    </div>
  );
};

export default App;
