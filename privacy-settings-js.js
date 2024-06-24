import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

export const PrivacySettings = () => {
  const [collectAnalytics, setCollectAnalytics] = useState(false);
  const [encryptData, setEncryptData] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await browser.storage.sync.get(['collectAnalytics', 'encryptData']);
      setCollectAnalytics(settings.collectAnalytics || false);
      setEncryptData(settings.encryptData !== undefined ? settings.encryptData : true);
    };
    loadSettings();
  }, []);

  const handleCollectAnalyticsChange = async (e) => {
    const newCollectAnalytics = e.target.checked;
    setCollectAnalytics(newCollectAnalytics);
    await browser.storage.sync.set({ collectAnalytics: newCollectAnalytics });
  };

  const handleEncryptDataChange = async (e) => {
    const newEncryptData = e.target.checked;
    setEncryptData(newEncryptData);
    await browser.storage.sync.set({ encryptData: newEncryptData });
  };

  return (
    <div className="privacy-settings">
      <h2>Privacy Settings</h2>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={collectAnalytics} 
            onChange={handleCollectAnalyticsChange}
          />
          Allow anonymous usage data collection
        </label>
      </div>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={encryptData} 
            onChange={handleEncryptDataChange}
          />
          Encrypt stored data
        </label>
      </div>
    </div>
  );
};
