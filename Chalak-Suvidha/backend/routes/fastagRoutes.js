// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import controller functions for handling FASTag data
const { 
  getFastagDataByVehicleNumber, 
  getFastagDataByVehicleNumberOrTagId 
} = require('../controllers/fastagController');

// Define POST route for FASTag data by vehicle number
router.post('/fastag/01', getFastagDataByVehicleNumber);

// Define POST route for FASTag data by either vehicle number or Tag ID
router.post('/fastag/02', getFastagDataByVehicleNumberOrTagId);

// Export the router so it can be used in the main app file
module.exports = router;