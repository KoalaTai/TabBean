const Audit = require('../models/Audit');

exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err\.message });
  }
};

exports.createAudit = async (req, res) => {
  const audit = new Audit({}, req.body);

  try {
    const newAudit = await audit.save();
    res.status(201).json(newAudit);
  } catch (err){
    res.status(400).json({ message: err\.message });
  }
};
