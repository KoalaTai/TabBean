import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

export const GeneralSettings = () => {
  const [autoSave, setAutoSave] = useState(false);
  const [syncInterval, setSyncInterval] = useState(15);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await browser.storage.sync.get(['autoSave', 'syncInterval']);
      setAutoSave(settings.autoSave || false);
      setSyncInterval(settings.syncInterval || 15);
    };
    loadSettings();
  }, []);

  const handleAutoSaveChange = async (e) => {
    const newAutoSave = e.target.checked;
    setAutoSave(newAutoSave);
    await browser.storage.sync.set({ autoSave: newAutoSave });
  };

  const handleSyncIntervalChange = async (e) => {
    const newSyncInterval = parseInt(e.target.value, 10);
    setSyncInterval(newSyncInterval);
    await browser.storage.sync.set({ syncInterval: newSyncInterval });
  };

  return (
    <div className="general-settings">
      <h2>General Settings</h2>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={autoSave} 
            onChange={handleAutoSaveChange}
          />
          Auto-save tabs
        </label>
      </div>
      <div>
        <label>
          Sync Interval (minutes):
          <input 
            type="number" 
            value={syncInterval} 
            onChange={handleSyncIntervalChange}
            min="1"
            max="60"
          />
        </label>
      </div>
    </div>
  );
};
