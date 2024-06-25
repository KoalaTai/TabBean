import React, { useState } from 'react';
import axios from 'axios';

function AuditForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/audits', { title, description });
      setTitle('');
      setDescription('');
      alert('Audit created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating audit');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Audit Title"
        value={title}
        onChange={e createAudit()}

  ( 
        value={description}
        onChange={e createAudit()}

 
        value={description}
        onChange={e createAudit()}

  ( ?
                va