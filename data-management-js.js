import React, { useState } from 'react';
import browser from 'webextension-polyfill';

export const DataManagement = () => {
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleExportData = async () => {
    try {
      const data = await browser.storage.sync.get(null);
      const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      await browser.downloads.download({
        url: url,
        filename: 'secure_tab_manager_data.json',
        saveAs: true
      });
      setExportStatus('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      setExportStatus('Error exporting data');
    }
  };

  const handleImportData = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await browser.storage.sync.clear();
        await browser.storage.sync.set(data);
        setImportStatus('Data imported successfully');
      } catch (error) {
        console.error('Error importing data:', error);
        setImportStatus('Error importing data');
      }
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await browser.storage.sync.clear();
        setImportStatus('All data cleared successfully');
      } catch (error) {
        console.error('Error clearing data:', error);
        setImportStatus('Error clearing data');
      }
    }
  };

  return (
    <div className="data-management">
      <h2>Data Management</h2>
      <div>
        <button onClick={handleExportData}>Export Data</button>
        <span>{exportStatus}</span>
      </div>
      <div>
        <input type="file" accept=".json" onChange={handleImportData} />
        <span>{importStatus}</span>
      </div>
      <div>
        <button onClick={handleClearData}>Clear All Data</button>
      </div>
    </div>
  );
};
