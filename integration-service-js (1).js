const { google } = require('googleapis');
const ZapierPlatform = require('zapier-platform-core');
const axios = require('axios');

class IntegrationService {
  constructor() {
    this.googleAuth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.zapier = ZapierPlatform.createAppTester();
    this.notionApiKey = process.env.NOTION_API_KEY;
  }

  async connectGoogleWorkspace(authCode) {
    const { tokens } = await this.googleAuth.getToken(authCode);
    this.googleAuth.setCredentials(tokens);
    return tokens;
  }

  async fetchGoogleDocs(folderId) {
    const drive = google.drive({ version: 'v3', auth: this.googleAuth });
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
      fields: 'files(id, name)',
    });
    return res.data.files;
  }

  async triggerZapierWorkflow(workflowId, data) {
    const workflow = this.zapier.export();
    const result = await workflow.performSubscribe(workflowId, data);
    return result;
  }

  async createNotionPage(databaseId, properties) {
    const response = await axios.post('https://api.notion.com/v1/pages', {
      parent: { database_id: databaseId },
      properties: properties
    }, {
      headers: {
        'Authorization': `Bearer ${this.notionApiKey}`,
        'Notion-Version': '2021-08-16',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async syncAuditToNotion(auditData) {
    const notionProperties = this.convertAuditToNotionProperties(auditData);
    const notionPage = await this.createNotionPage(process.env.NOTION_AUDIT_DATABASE_ID, notionProperties);
    
    // Trigger Zapier workflow to perform additional actions
    await this.triggerZapierWorkflow('notionAuditCreatedTrigger', {
      notionPageId: notionPage.id,
      auditId: auditData.id
    });

    return notionPage;
  }

  convertAuditToNotionProperties(auditData) {
    // Convert audit data to Notion properties format
    return {
      'Audit ID': { title: [{ text: { content: auditData.id } }] },
      'Company': { select: { name: auditData.company } },
      'Date': { date: { start: auditData.date } },
      'Type': { select: { name: auditData.type } },
      'Status': { status: { name: auditData.status } },
      // Add more properties as needed
    };
  }
}

module.exports = new IntegrationService();
