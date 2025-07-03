const express = require('express');
const router = express.Router();
const controller = require('../controllers/batteryController');

router.post('/data', controller.insertBatteryData);
router.get('/:id', controller.getBatteryData);
router.get('/:id/:field', controller.getBatteryFieldData);

module.exports = router;
