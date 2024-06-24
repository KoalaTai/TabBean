import 'jest-webextension-mock';
import browser from 'webextension-polyfill';
import TabManager from '../../src/services/tabManager';
import StorageService from '../../src/services/storageService';
import KnowledgeBaseGenerator from '../../src/services/knowledgeBaseGenerator';

describe('Extension Integration Tests', () => {
  beforeEach(() => {
    browser.tabs.query.mockResolvedValue([
      { id: 1, url: 'https://example.com', title: 'Example' },
      { id: 2, url: 'https://test.com', title: 'Test' }
    ]);
    browser.storage.local.get.mockResolvedValue({});
    browser.storage.local.set.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('TabManager should interact with browser tabs', async () => {
    const tabs = await TabManager.getAllTabs();
    expect(tabs.length).toBe(2);
    expect(tabs[0].url).toBe('https://example.com');

    await TabManager.createTab('https://new.com');
    expect(browser.tabs.create).toHaveBeenCalledWith({ url: 'https://new.com' });
  });

  test('StorageService should store and retrieve data', async () => {
    await StorageService.set('testKey', 'testValue');
    expect(browser.storage.local.set).toHaveBeenCalledWith({ testKey: 'testValue' });

    browser.storage.local.get.mockResolvedValueOnce({ testKey: 'testValue' });
    const value = await StorageService.get('testKey');
    expect(value).toBe('testValue');
  });

  test('KnowledgeBaseGenerator should process content', async () => {
    const mockContent = 'This is a test content';
    const mockSummary = 'Test summary';
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ summary: mockSummary }),
      })
    );

    const result = await KnowledgeBaseGenerator.processAndStoreContent('Test Title', mockContent, 'https://example.com');
    
    expect(result.title).toBe('Test Title');
    expect(result.content).toBe(mockContent);
    expect(result.summary).toBe(mockSummary);
    expect(result.url).toBe('https://example.com');

    expect(browser.storage.local.set).toHaveBeenCalled();
  });
});
