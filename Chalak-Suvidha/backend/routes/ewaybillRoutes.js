// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the controller function for handling e-waybill data
const { getEwaybillData } = require('../controllers/ewaybillController');

// Define POST route for e-waybill
router.post('/ewaybill', getEwaybillData);

// Export the router so it can be used in the main app file
module.exports = router;