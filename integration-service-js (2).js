const { google } = require('googleapis');
const ZapierPlatform = require('zapier-platform-core');

class IntegrationService {
  constructor() {
    this.googleAuth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.zapier = ZapierPlatform.createAppTester();
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
    // This is a simplified representation of triggering a Zapier workflow
    const workflow = this.zapier.export();
    const result = await workflow.performSubscribe(workflowId, data);
    return result;
  }

  // Add more integration methods as needed
}

module.exports = new IntegrationService();
