chrome.action.onClicked.addListener(async () => {
  let url = chrome.runtime.getURL("main.html");
  await chrome.tabs.create({ url });
});
