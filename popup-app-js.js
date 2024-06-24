import React, { useState, useEffect } from 'react';
import { TabList } from './components/TabList';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Communication } from './components/Communication';
import AuthService from '../services/authService';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('tabs');

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await AuthService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    await AuthService.login();
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <h1>Secure Tab Manager</h1>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Secure Tab Manager</h1>
      <nav>
        <button onClick={() => setActiveTab('tabs')} className={activeTab === 'tabs' ? 'active' : ''}>Tabs</button>
        <button onClick={() => setActiveTab('knowledge')} className={activeTab === 'knowledge' ? 'active' : ''}>Knowledge Base</button>
        <button onClick={() => setActiveTab('communication')} className={activeTab === 'communication' ? 'active' : ''}>Communication</button>
      </nav>
      {activeTab === 'tabs' && <TabList />}
      {activeTab === 'knowledge' && <KnowledgeBase />}
      {activeTab === 'communication' && <Communication />}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
