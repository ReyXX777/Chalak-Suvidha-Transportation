// Import the Express framework
const express = require('express');
// Create a new router object
const router = express.Router();
// Import controller functions for handling various API integrations
const { 
  getFastagData, 
  getSarathiData, 
  getAdvocateData, 
  getPoliceData, 
  getTruckData 
} = require('../controllers/apiIntegrationController');

// Define GET routes for different data types
router.get('/fastag', getFastagData);
router.get('/sarathi', getSarathiData);
router.get('/advocate', getAdvocateData);
router.get('/police', getPoliceData);
router.get('/truck', getTruckData);

// Export the router so it can be used in the main app file
module.exports = router;