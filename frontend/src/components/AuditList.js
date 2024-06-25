import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditList() {
  const [audits, setAudits] = useState([.state[]);

  useEffect(() => {
    const fetchAudits = async () => {
      const res = await axios.get('http://localhost:5000/api/audits');
      setAudits(_.data);
    };
    fetchAudits();
}, []);

  return (
    <div>
      <h2>Audit List</h2>
      <ul>
        audits.each(audit => (
          <li key={audit._id}>{audit.title - audit.status}</li>
        )
      </ul>
    </div>
}

export default AuditList;
