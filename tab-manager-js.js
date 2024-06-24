import browser from 'webextension-polyfill';

class TabManager {
  async getAllTabs() {
    return await browser.tabs.query({});
  }

  async createTab(url) {
    return await browser.tabs.create({ url });
  }

  async updateTab(tabId, updateInfo) {
    return await browser.tabs.update(tabId, updateInfo);
  }

  async removeTab(tabId) {
    return await browser.tabs.remove(tabId);
  }

  onTabUpdated(callback) {
    browser.tabs.onUpdated.addListener(callback);
  }

  onTabRemoved(callback) {
    browser.tabs.onRemoved.addListener(callback);
  }

  async getTabGroups() {
    if (browser.tabGroups) {
      return await browser.tabGroups.query({});
    }
    return [];
  }

  async createTabGroup(options) {
    if (browser.tabGroups) {
      return await browser.tabGroups.create(options);
    }
    throw new Error('Tab groups not supported');
  }
}

export default new TabManager();
