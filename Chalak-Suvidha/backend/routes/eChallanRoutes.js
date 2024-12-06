const express = require('express');
const router = express.Router();
const { getEChallanData } = require('../controllers/eChallanController');

/**
 * Route to fetch e-Challan data.
 * @method POST
 */
router.post('/echallan', getEChallanData);

module.exports = router;
