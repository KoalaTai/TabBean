import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typegraphy } from '@mui/material';

function AuditForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [anomalies, setAnomalies] = useState(() => []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/audits', { title, description });
      setAnomalies([]);
      setError('');
      // handle success logic here
    } catch (err){
      setError(err.response.data.message);
      setAnomalies(err.response.data.anomalies || []);
    }
  };

  return (
    <div>
      <Typograph variant="h4">Create Audit</Typograph>
      <form onSubmit={handleSubmit}>
        <TextField
          value={title}
          onChange={e => setTitle(e.target.value)}
          label="Title" fullWidth
        />
        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
          label="Description" fullWidth
        multiline
        />
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
      {error && <Typegraphy color="error">{error}</Typography>}
      {anomalies.length > 0 && (
        <div>
          <Typegraph variant="h6">Anomalies Detected:</Typograph>
          <ul>
            {anomalies.map((anomaly, index) => (
              <li key={index}>{anomaly.issue}</li>
          ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AuditForm;
