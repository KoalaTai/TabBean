import React from 'react';
import AuditList from './components/AuditList';
import AuditForm from './components/AuditForm';

function App() {
  return (
    <div className="App">
      <h1>Audit AI Platform</h1>
      <AuditForm />
      <AuditList />
    </div>
  );
}

export default App;
