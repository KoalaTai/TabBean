// background.js

// Listener for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(error => console.error('Failed to inject content script:', error));
  }
});

// Listener for tab removals
chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.local.get('tabs', (result) => {
    let tabs = result.tabs || [];
    tabs = tabs.filter(id => id !== tabId);
    chrome.storage.local.set({ tabs: tabs });
  });
});

// Listener for browser action clicks
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: 'popup.html' });
});

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ tabs: [] });
});
