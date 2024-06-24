const express = require('express');
const mongoose = require('mongoose');
const aiService = require('./services/aiService');
const integrationService = require('./services/integrationService');
const auditRoutes = require('./routes/auditRoutes');
const regulationRoutes = require('./routes/regulationRoutes');
const userRoutes = require('./routes/userRoutes');
const config = require('./config');

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.use('/api/audits', auditRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/users', userRoutes);

// ... (keep existing routes)

// Optional Notion integration route
if (config.notionIntegrationEnabled) {
  app.post('/api/sync-audit-to-notion', async (req, res) => {
    const { auditData } = req.body;
    try {
      const notionPage = await integrationService.syncAuditToNotion(auditData);
      res.json({ success: true, notionPageId: notionPage.id });
    } catch (error) {
      console.error('Error syncing audit to Notion:', error);
      res.status(500).json({ success: false, error: 'Failed to sync audit to Notion' });
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
