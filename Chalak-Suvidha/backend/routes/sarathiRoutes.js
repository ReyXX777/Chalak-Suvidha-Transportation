// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the controller function for handling driving license data
const { getDrivingLicenseData } = require('../controllers/sarathiController');

// Define POST route for driving license data
router.post('/sarathi', getDrivingLicenseData);

// Export the router so it can be used in the main app file
module.exports = router;