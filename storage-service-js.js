import browser from 'webextension-polyfill';
import encryptionService from './encryptionService';

class StorageService {
  constructor() {
    this.encryptionEnabled = false;
    this.encryptionKey = null;
  }

  async init() {
    const settings = await browser.storage.sync.get('encryptData');
    this.encryptionEnabled = settings.encryptData || false;
    if (this.encryptionEnabled) {
      await this.setupEncryption();
    }
  }

  async setupEncryption() {
    let storedKey = await browser.storage.local.get('encryptionKey');
    if (!storedKey.encryptionKey) {
      const newKey = await encryptionService.generateKey();
      const exportedKey = await encryptionService.exportKey(newKey);
      await browser.storage.local.set({ encryptionKey: exportedKey });
      storedKey = { encryptionKey: exportedKey };
    }
    this.encryptionKey = await encryptionService.importKey(storedKey.encryptionKey);
  }

  async set(key, value) {
    if (this.encryptionEnabled) {
      const encryptedData = await encryptionService.encrypt(value, this.encryptionKey);
      await browser.storage.local.set({ [key]: encryptedData });
    } else {
      await browser.storage.local.set({ [key]: value });
    }
  }

  async get(key) {
    const result = await browser.storage.local.get(key);
    if (this.encryptionEnabled && result[key]) {
      return await encryptionService.decrypt(result[key], this.encryptionKey);
    }
    return result[key];
  }

  async remove(key) {
    await browser.storage.local.remove(key);
  }

  async clear() {
    await browser.storage.local.clear();
  }
}

export default new StorageService();
