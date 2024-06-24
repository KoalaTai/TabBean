const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Internal', 'External', 'FDA', 'Notified Body'], required: true },
  scope: { type: String, required: true },
  findings: [{
    observation: String,
    regulationReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Regulation' },
    severity: { type: String, enum: ['Minor', 'Major', 'Critical'] },
    correctionPlan: String,
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' }
  }],
  aiGeneratedSummary: String,
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'], default: 'Planned' },
  attachments: [{ filename: String, url: String }]
}, { timestamps: true });

module.exports = mongoose.model('Audit', AuditSchema);
