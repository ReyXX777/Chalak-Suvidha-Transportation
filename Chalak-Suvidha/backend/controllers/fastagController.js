
const axios = require('axios');
const NodeCache = require('node-cache');
const { RateLimiter } = require('limiter');
const { FASTAG_API_URL, FASTAG_API_TOKEN } = require('../config/apiConfig');

// Initialize cache with a TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

// Initialize rate limiter to allow 10 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 10, interval: 'second' });

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
    // Check if the response is cached
    const cachedResponse = cache.get(vehiclenumber);
    if (cachedResponse) {
      console.log(`✅ Serving cached response for vehicleNumber: ${vehiclenumber}`);
      return res.status(200).json({
        response: cachedResponse,
        error: false,
        code: "200",
        message: "Success (cached)",
      });
    }

    // Apply rate limiting
    await limiter.removeTokens(1);

    const response = await axios.post(
      `${FASTAG_API_URL}/FASTAG/01`,
      { vehiclenumber },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${FASTAG_API_TOKEN}`,
          'content-type': 'application/json',
        },
        timeout: 5000, // Set a 5-second timeout for the request
      }
    );

    // Cache the response
    cache.set(vehiclenumber, response.data.response);
    console.log(`✅ Fetched and cached response for vehicleNumber: ${vehiclenumber}`);

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
    // Apply rate limiting
    await limiter.removeTokens(1);

    const response = await axios.post(
      `${FASTAG_API_URL}/FASTAG/02`,
      { vehiclenumber, tagid },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${FASTAG_API_TOKEN}`,
          'content-type': 'application/json',
        },
        timeout: 5000, // Set a 5-second timeout for the request
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
