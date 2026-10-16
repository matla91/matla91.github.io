// CI-only extension. It has access only to the local test server.
// The test uses the native tabs.setZoom API; no portfolio code is injected.
chrome.runtime.onInstalled.addListener(() => {});
