// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the controller function for handling geolocation data
const { getLocation } = require('../controllers/geolocationController');

// Define GET route for fetching location data
router.get('/location', getLocation);

// Export the router so it can be used in the main app file
module.exports = router;