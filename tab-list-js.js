import React, { useState, useEffect } from 'react';
import TabManager from '../../services/tabManager';

export const TabList = () => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const fetchTabs = async () => {
      const allTabs = await TabManager.getAllTabs();
      setTabs(allTabs);
    };
    fetchTabs();
  }, []);

  const handleTabClick = (tabId) => {
    TabManager.updateTab(tabId, { active: true });
  };

  const handleTabClose = (tabId) => {
    TabManager.removeTab(tabId);
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };

  return (
    <div className="tab-list">
      <h2>Open Tabs</h2>
      <ul>
        {tabs.map(tab => (
          <li key={tab.id}>
            <img src={tab.favIconUrl} alt="Favicon" width="16" height="16" />
            <span onClick={() => handleTabClick(tab.id)}>{tab.title}</span>
            <button onClick={() => handleTabClose(tab.id)}>Close</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
