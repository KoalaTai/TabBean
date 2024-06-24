import TabManager from '../../src/services/tabManager';
import browser from 'webextension-polyfill';

jest.mock('webextension-polyfill', () => ({
    tabs: {
        query: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    }
}));

describe('TabManager', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all tabs', async () => {
        const mockTabs = [
            { id: 1, url: 'https://example.com', title: 'Example' },
            { id: 2, url: 'https://test.com', title: 'Test' }
        ];
        browser.tabs.query.mockResolvedValue(mockTabs);

        const tabs = await TabManager.getAllTabs();
        expect(tabs).toEqual(mockTabs);
        expect(browser.tabs.query).toHaveBeenCalledWith({});
    });

    it('should create a new tab', async () => {
        const newTab = { id: 3, url: 'https://new.com', title: 'New' };
        browser.tabs.create.mockResolvedValue(newTab);

        const createdTab = await TabManager.createTab('https://new.com');
        expect(createdTab).toEqual(newTab);
        expect(browser.tabs.create).toHaveBeenCalledWith({ url: 'https://new.com' });
    });

    it('should update a tab', async () => {
        const updatedTab = { id: 1, url: 'https://updated.com', title: 'Updated' };
        browser.tabs.update.mockResolvedValue(updatedTab);

        const result = await TabManager.updateTab(1, { url: 'https://updated.com' });
        expect(result).toEqual(updatedTab);
        expect(browser.tabs.update).toHaveBeenCalledWith(1, { url: 'https://updated.com' });
    });

    it('should remove a tab', async () => {
        browser.tabs.remove.mockResolvedValue(undefined);

        await TabManager.removeTab(1);
        expect(browser.tabs.remove).toHaveBeenCalledWith(1);
    });
});
