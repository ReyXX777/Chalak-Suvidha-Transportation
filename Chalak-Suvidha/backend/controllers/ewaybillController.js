const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Added UUID for request tracking
const { performance } = require('perf_hooks'); // Added performance monitoring
const { RateLimiter } = require('limiter'); // Added rate limiting
const { EWAYBILL_API_URL, EWAYBILL_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Initialize rate limiter to allow 5 requests per second (adjust as needed)
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });

// Helper function to fetch API token
const fetchAuthToken = async () => {
  try {
    if (ENVIRONMENT === 'production') {
      const authResponse = await axios.post(
        `${EWAYBILL_API_URL}/user/login`,
        {
          username: process.env.EWAYBILL_USERNAME,
          password: process.env.EWAYBILL_PASSWORD,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 5000 // Added timeout to the request
        }
      );
      return authResponse.data.token;
    }
    return EWAYBILL_API_TOKEN; // Use pre-configured token for non-production environments
  } catch (error) {
    console.error('Error fetching auth token:', error.message);
    throw new Error('Failed to fetch authentication token.');
  }
};

// Controller for fetching eWaybill data
async function getEwaybillData(req, res) {
  const requestId = uuidv4(); // Generate unique request ID
  const startTime = performance.now(); // Record start time
  const { ewbNo } = req.body;

  // Validate eWaybill number format
  const ewbNoRegex = /^[0-9]{12}$/;
  if (!ewbNoRegex.test(ewbNo)) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid eWaybill number format. Expected a 12-digit numeric value.",
      requestId: requestId,
      duration: duration.toFixed(2)
    });
  }

  const apiUrl = `${EWAYBILL_API_URL}/EWAYBILL/01`;

  try {
    const token = await fetchAuthToken(); // Get token based on environment

    // Apply rate limiting
    await limiter.removeTokens(1);

    console.log(`➡️ Making API request to ${apiUrl} for ewbNo: ${ewbNo} (Request ID: ${requestId})`);

    // Make the API request
    const response = await axios.post(
      apiUrl,
      { ewbNo },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000 // Added timeout to the request
      }
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Send success response
    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "eWaybill data fetched successfully.",
      requestId: requestId,
      duration: duration.toFixed(2)
    });
    console.log(`✅ API request successful to ${apiUrl} for ewbNo: ${ewbNo} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);

  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (error.response) {
      // Log detailed error for debugging
      console.error(
        `API Error: Status ${error.response.status}, Message: ${error.response.data?.message || error.response.statusText} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`
      );
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.data?.message || error.response.statusText,
        requestId: requestId,
        duration: duration.toFixed(2)
      });
    } else {
      // Handle network or unexpected errors
      console.error('Network Error:', error.message, `(Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "The server is not responding. Please try again later.",
        requestId: requestId,
        duration: duration.toFixed(2)
      });
    }
  }
}

module.exports = {
  getEwaybillData,
};

