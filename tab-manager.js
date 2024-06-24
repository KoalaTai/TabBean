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
}

export default new TabManager();
