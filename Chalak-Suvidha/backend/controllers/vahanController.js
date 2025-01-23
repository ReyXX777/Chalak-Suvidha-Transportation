
const axios = require('axios');
const NodeCache = require('node-cache');
const { RateLimiter } = require('limiter');
const { VAHAN_API_URL, VAHAN_API_TOKEN } = require('../config/apiConfig');

// Initialize cache with a TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Initialize rate limiter to allow 10 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 10, interval: 'second' });

/**
 * Fetches vehicle data based on the engine number.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
async function getVehicleData(req, res) {
  const { enginenumber } = req.body;

  // Validate engine number format
  const engineNumberRegex = /^[a-zA-Z0-9]{1,20}$/;
  if (!engineNumberRegex.test(enginenumber)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid engine number. It should match the pattern ^[a-zA-Z0-9]{1,20}$"
    });
  }

  try {
    // Check if the response is cached
    const cachedResponse = cache.get(enginenumber);
    if (cachedResponse) {
      console.log(`✅ Serving cached response for engine number: ${enginenumber}`);
      return res.status(200).json({
        response: cachedResponse,
        error: false,
        code: "200",
        message: "Success (cached)"
      });
    }

    // Apply rate limiting
    await limiter.removeTokens(1);

    // Send POST request to the VAHAN API
    const response = await axios.post(
      `${VAHAN_API_URL}/VAHAN/03`,
      { enginenumber },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${VAHAN_API_TOKEN}`,
          'content-type': 'application/json'
        },
        timeout: 5000 // Set a 5-second timeout for the request
      }
    );

    // Cache the response
    cache.set(enginenumber, response.data.response);
    console.log(`✅ Fetched and cached response for engine number: ${enginenumber}`);

    // Respond with success
    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "Success"
    });
  } catch (error) {
    // Handle specific HTTP errors from the API
    if (error.response) {
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.data?.message || error.response.statusText || "Unknown error occurred"
      });
    } else {
      // Handle network or other unexpected errors
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "Server is not responding. Please try again later."
      });
    }
  }
}

module.exports = {
  getVehicleData
};
