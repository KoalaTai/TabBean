const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/', auditController.getAudits);
router.post('/', auditController.createAudit);
module.exports = router;
