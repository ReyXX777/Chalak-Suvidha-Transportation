// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the controller function for handling vehicle data
const { getVehicleData } = require('../controllers/vahanController');

// Define POST route for vehicle data
router.post('/vahan', getVehicleData);

// Export the router so it can be used in the main app file
module.exports = router;