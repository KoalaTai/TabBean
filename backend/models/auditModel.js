const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Planned' }
});

module.exports = mongoose.model('Audit', AuditSchema);
