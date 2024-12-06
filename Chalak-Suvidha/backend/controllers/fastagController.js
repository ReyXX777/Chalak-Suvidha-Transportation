const axios = require('axios');
const { FASTAG_API_URL, FASTAG_API_TOKEN } = require('../config/apiConfig');

// Helper function to validate input fields
const validateInput = (fieldName, value, regex, res, errorMessage) => {
  if (!regex.test(value)) {
    res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: `${fieldName}: ${errorMessage}`,
    });
    return false;
  }
  return true;
};

// Controller for fetching Fastag data by vehicle number
async function getFastagDataByVehicleNumber(req, res) {
  const { vehiclenumber } = req.body;

  // Validate vehicle number
  const vehicleNumberRegex = /^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$/;
  if (!validateInput('vehiclenumber', vehiclenumber, vehicleNumberRegex, res, "Format should follow ^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$")) {
    return;
  }

  try {
    const response = await axios.post(
      `${FASTAG_API_URL}/FASTAG/01`,
      { vehiclenumber },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${FASTAG_API_TOKEN}`,
          'content-type': 'application/json',
        },
      }
    );

    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "Success",
    });
  } catch (error) {
    handleError(error, res);
  }
}

// Controller for fetching Fastag data by vehicle number or tag ID
async function getFastagDataByVehicleNumberOrTagId(req, res) {
  const { vehiclenumber, tagid } = req.body;

  // Validate inputs
  const vehicleNumberRegex = /^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$/;
  const tagIdRegex = /^[A-Z0-9]{0,25}$/;

  if (vehiclenumber && !validateInput('vehiclenumber', vehiclenumber, vehicleNumberRegex, res, "Format should follow ^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$")) {
    return;
  }

  if (tagid && !validateInput('tagid', tagid, tagIdRegex, res, "Format should follow ^[A-Z0-9]{0,25}$")) {
    return;
  }

  // Check for mutually exclusive inputs
  if (!vehiclenumber && !tagid) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "vehiclenumber or tagid must not be empty or null. Please provide either vehiclenumber or tagid.",
    });
  }

  if (vehiclenumber && tagid) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Only one of vehiclenumber or tagid should be provided.",
    });
  }

  try {
    const response = await axios.post(
      `${FASTAG_API_URL}/FASTAG/02`,
      { vehiclenumber, tagid },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${FASTAG_API_TOKEN}`,
          'content-type': 'application/json',
        },
      }
    );

    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "Success",
    });
  } catch (error) {
    handleError(error, res);
  }
}

// Helper function to handle errors
const handleError = (error, res) => {
  if (error.response) {
    console.error(
      `API Error: Status ${error.response.status}, Message: ${error.response.statusText}`
    );
    res.status(error.response.status).json({
      response: null,
      error: true,
      code: error.response.status.toString(),
      message: error.response.statusText,
    });
  } else {
    console.error('Network Error:', error.message);
    res.status(502).json({
      response: null,
      error: true,
      code: "502",
      message: "Server is not responding.",
    });
  }
};

module.exports = {
  getFastagDataByVehicleNumber,
  getFastagDataByVehicleNumberOrTagId,
};
