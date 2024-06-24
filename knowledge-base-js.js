import React, { useState } from 'react';
import KnowledgeBaseGenerator from '../../services/knowledgeBaseGenerator';

export const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await KnowledgeBaseGenerator.searchKnowledgeBase(searchQuery);
    setSearchResults(results);
  };

  const handleGenerateKnowledgeBase = async () => {
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (tabs[0]) {
      const content = await browser.tabs.sendMessage(tabs[0].id, {action: "getPageContent"});
      await KnowledgeBaseGenerator.processAndStoreContent(tabs[0].title, content, tabs[0].url);
      alert('Page added to Knowledge Base');
    }
  };

  return (
    <div className="knowledge-base">
      <h2>Knowledge Base</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search Knowledge Base"
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={handleGenerateKnowledgeBase}>Add Current Page to Knowledge Base</button>
      <ul>
        {searchResults.map(result => (
          <li key={result._id}>
            <h3>{result._source.title}</h3>
            <p>{result._source.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
