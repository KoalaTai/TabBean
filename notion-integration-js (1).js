import React, { useState } from 'react';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import api from '../../services/api';

const NotionIntegration = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = async (event) => {
    setIsEnabled(event.target.checked);
    if (event.target.checked) {
      // Trigger Zapier workflow to set up Notion integration
      await api.post('/api/integrations/zapier-trigger', {
        workflow: 'setupNotionIntegration'
      });
    }
  };

  const syncAudit = async () => {
    const auditData = {
      // Fetch current audit data or use props if this component is child of an Audit component
      id: '12345',
      company: 'Example Corp',
      date: new Date().toISOString(),
      type: 'Internal',
      status: 'In Progress'
    };

    try {
      const response = await api.post('/api/sync-audit-to-notion', { auditData });
      if (response.data.success) {
        alert(`Audit synced to Notion. Page ID: ${response.data.notionPageId}`);
      } else {
        alert('Failed to sync audit to Notion');
      }
    } catch (error) {
      console.error('Error syncing audit to Notion:', error);
      alert('An error occurred while syncing to Notion');
    }
  };

  return (
    <div>
      <Typography variant="h6">Notion Integration</Typography>
      <FormControlLabel
        control={<Switch checked={isEnabled} onChange={handleToggle} />}
        label="Enable Notion Integration"
      />
      {isEnabled && (
        <Button variant="contained" color="primary" onClick={syncAudit}>
          Sync Current Audit to Notion
        </Button>
      )}
    </div>
  );
};

export default NotionIntegration;
