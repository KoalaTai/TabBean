const mongoose = require('mongoose');

const RegulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  body: { type: String, required: true }, // e.g., 'FDA', 'ISO', 'EU'
  identifier: { type: String, required: true }, // e.g., '21 CFR Part 820', 'ISO 13485:2016'
  version: String,
  effectiveDate: Date,
  description: String,
  fullText: String,
  sections: [{
    number: String,
    title: String,
    content: String
  }],
  relatedRegulations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Regulation' }]
}, { timestamps: true });

module.exports = mongoose.model('Regulation', RegulationSchema);
