const { google } = require('googleapis');
const ZapierPlatform = require('zapier-platform-core');
const axios = require('axios');
const config = require('../config');

class IntegrationService {
  constructor() {
    this.googleAuth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.zapier = ZapierPlatform.createAppTester();
    
    // Only initialize Notion if it's enabled
    if (config.notionIntegrationEnabled) {
      this.notionApiKey = process.env.NOTION_API_KEY;
    }
  }

  // ... (keep existing methods)

  async syncAuditToNotion(auditData) {
    if (!config.notionIntegrationEnabled) {
      throw new Error('Notion integration is not enabled');
    }
    
    const notionProperties = this.convertAuditToNotionProperties(auditData);
    const notionPage = await this.createNotionPage(process.env.NOTION_AUDIT_DATABASE_ID, notionProperties);
    
    // Trigger Zapier workflow to perform additional actions
    await this.triggerZapierWorkflow('notionAuditCreatedTrigger', {
      notionPageId: notionPage.id,
      auditId: auditData.id
    });

    return notionPage;
  }

  // ... (keep other methods)
}

module.exports = new IntegrationService();
