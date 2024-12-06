// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the controller function for handling GST data
const { getGstData } = require('../controllers/gstController');

// Define POST route for GST data
router.post('/gst', getGstData);

// Export the router so it can be used in the main app file
module.exports = router;