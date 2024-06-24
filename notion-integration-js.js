import React, { useState } from 'react';
import { Button, Typography, Switch, FormControlLabel } from '@material-ui/core';
import api from '../../services/api';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';

const NotionIntegration = () => {
  const { notionIntegrationEnabled } = useFeatureFlags();
  const [isEnabled, setIsEnabled] = useState(false);

  if (!notionIntegrationEnabled) {
    return null; // Don't render anything if the feature is not enabled
  }

  // ... (keep the rest of the component logic)
};

export default NotionIntegration;
