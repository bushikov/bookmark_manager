import { useState, useEffect } from "react";
import { Bookmark } from "db";

const getChromeTabs = async (windowId: number): Promise<chrome.tabs.Tab[]> => {
  return await chrome.tabs.query({ windowId });
};

type ChromeTabs = {
  urls: Bookmark[];
  setTargetWindowId: (arg0?: number | null) => void;
};

const initialChromeTabs: Bookmark[] = [];

export const useChromeTabs = (): ChromeTabs => {
  const [targetWindowId, setTargetWindowId] = useState<number | null>(null);
  const [urls, setUrls] = useState(initialChromeTabs);

  useEffect(() => {
    const callback = async () => {
      if (targetWindowId) {
        const tabs = await getChromeTabs(targetWindowId);
        setUrls(
          tabs.map((t) => ({
            title: t.title,
            url: t.url,
            favIconUrl: t.favIconUrl,
          }))
        );
      } else {
        setUrls(initialChromeTabs);
      }
    };
    callback();

    chrome.tabs.onUpdated.addListener(callback);
    chrome.tabs.onRemoved.addListener(callback);
    chrome.tabs.onMoved.addListener(callback);
    chrome.tabs.onAttached.addListener(callback);

    return () => {
      chrome.tabs.onUpdated.removeListener(callback);
      chrome.tabs.onRemoved.removeListener(callback);
      chrome.tabs.onMoved.removeListener(callback);
      chrome.tabs.onAttached.removeListener(callback);
    };
  }, [targetWindowId]);

  return {
    urls,
    setTargetWindowId,
  };
};
