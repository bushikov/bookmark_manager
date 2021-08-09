import { useState, useEffect } from "react";

const getChromeWindows = async (): Promise<ChromeWindows> => {
  const windows = await chrome.windows.getAll();
  const currentWindow = windows.filter((w) => w.focused)[0];
  const otherWindows = windows.filter((w) => !w.focused);
  return {
    currentWindow,
    otherWindows,
  };
};

type ChromeWindows = {
  currentWindow: chrome.windows.Window | null;
  otherWindows: chrome.windows.Window[];
};

const initialChromeWindows: ChromeWindows = {
  currentWindow: null,
  otherWindows: [],
};

export const useChromeWindows = (): ChromeWindows => {
  const [chromeWindows, setChromeWindows] = useState(initialChromeWindows);

  useEffect(() => {
    const callback = async () => {
      setChromeWindows(await getChromeWindows());
    };

    callback();

    chrome.tabs.onUpdated.addListener(callback);
    chrome.tabs.onRemoved.addListener(callback);
    chrome.tabs.onMoved.addListener(callback);
    chrome.tabs.onAttached.addListener(callback);

    chrome.windows.onCreated.addListener(callback);
    chrome.windows.onRemoved.addListener(callback);

    return () => {
      chrome.tabs.onUpdated.removeListener(callback);
      chrome.tabs.onRemoved.removeListener(callback);
      chrome.tabs.onMoved.removeListener(callback);
      chrome.tabs.onAttached.removeListener(callback);

      chrome.windows.onCreated.removeListener(callback);
      chrome.windows.onRemoved.removeListener(callback);
    };
  }, []);

  return chromeWindows;
};
