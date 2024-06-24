import browser from 'webextension-polyfill';
import TabManager from '../services/tabManager';
import KnowledgeBaseGenerator from '../services/knowledgeBaseGenerator';
import CommunicationModule from '../services/communicationModule';

class BackgroundScript {
  constructor() {
    this.setupMessageListener();
    this.setupTabListeners();
  }

  setupMessageListener() {
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'contentScriptLoaded') {
        this.handleContentScriptLoaded(sender.tab);
      } else if (request.action === 'extractContent') {
        this.handleContentExtraction(sender.tab);
      }
    });
  }

  setupTabListeners() {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        this.handleTabUpdate(tab);
      }
    });

    browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
      this.handleTabRemove(tabId);
    });
  }

  async handleContentScriptLoaded(tab) {
    console.log(`Content script loaded for tab: ${tab.url}`);
    // You can perform any initialization or data extraction here if needed
  }

  async handleContentExtraction(tab) {
    try {
      const content = await browser.tabs.sendMessage(tab.id, { action: 'extractContent' });
      await KnowledgeBaseGenerator.processAndStoreContent(content.title, content.content, tab.url);
      console.log(`Content extracted and stored for tab: ${tab.url}`);
    } catch (error) {
      console.error('Error extracting content:', error);
    }
  }

  async handleTabUpdate(tab) {
    await TabManager.updateTab(tab.id, { url: tab.url, title: tab.title });
    CommunicationModule.sendMessage({ type: 'tabUpdated', tabId: tab.id, url: tab.url, title: tab.title });
  }

  async handleTabRemove(tabId) {
    await TabManager.removeTab(tabId);
    CommunicationModule.sendMessage({ type: 'tabRemoved', tabId: tabId });
  }
}

// Initialize the background script
const backgroundScript = new BackgroundScript();
