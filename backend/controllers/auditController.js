const Audit = require('../models/Audit');

const { detectAnomalies } = require('../ai/anomalyDetection');

exports.createAudit = async (req, res) => {
  const audit = new Audit(req.body);

  // Detect anomalies
  const anomalies = detectAnomalies(audit);

  if (anomalies.length > 0) {
    return res.status(400).json({
      message: 'Audit contains anomalies',
      anomalies
    });
  }

  try {
    const newAudit = await audit.save();
    res.status(201).json(newAudit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
