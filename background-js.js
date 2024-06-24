// Import necessary modules (assuming we're using ES modules)
import { categorizeTab } from './services/categoryService.js';
import { syncWithBackend } from './services/syncService.js';

// Store tab information
let tabsInfo = {};

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTabInfo(tab);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabsInfo[tabId];
  syncWithBackend(tabsInfo);
});

// Update tab information
async function updateTabInfo(tab) {
  const category = await categorizeTab(tab);
  tabsInfo[tab.id] = {
    url: tab.url,
    title: tab.title,
    category: category
  };
  syncWithBackend(tabsInfo);
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabsInfo') {
    sendResponse(tabsInfo);
  } else if (request.action === 'sendMessageToTab') {
    chrome.tabs.sendMessage(request.tabId, { message: request.message });
  }
});

// Initialize: get all current tabs
chrome.tabs.query({}, (tabs) => {
  tabs.forEach(updateTabInfo);
});
