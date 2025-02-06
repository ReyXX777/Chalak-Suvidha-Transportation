const axios = require('axios');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid'); // Added UUID for request tracking
const { performance } = require('perf_hooks'); // Added performance monitoring
const { ECHALLAN_API_URL, ECHALLAN_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Initialize cache with a TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

// Helper function to fetch API token
const fetchAuthToken = async () => {
  try {
    if (ENVIRONMENT === 'production') {
      const authResponse = await axios.post(
        `${ECHALLAN_API_URL}/user/login`,
        {
          username: process.env.ECHALLAN_USERNAME,
          password: process.env.ECHALLAN_PASSWORD,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 5000, // Set a 5-second timeout for the request
        }
      );
      return authResponse.data.token;
    }
    return ECHALLAN_API_TOKEN; // Use pre-configured token for non-production environments
  } catch (error) {
    console.error('Error fetching auth token:', error.message);
    throw new Error('Failed to fetch authentication token.');
  }
};

// Controller to get eChallan Data
async function getEChallanData(req, res) {
  const requestId = uuidv4(); // Generate unique request ID
  const startTime = performance.now(); // Record start time
  const { vehicleNumber } = req.body;

  // Validate vehicle number format
  const vehicleNumberRegex = /^[a-zA-Z0-9]{5,11}$/;
  if (!vehicleNumberRegex.test(vehicleNumber)) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid vehicleNumber format. Please provide 5-11 alphanumeric characters.",
      requestId: requestId,
      duration: duration.toFixed(2)
    });
  }

  const apiUrl = `${ECHALLAN_API_URL}/ECHALLAN/01`;

  try {
    // Check if the response is cached
    const cachedResponse = cache.get(vehicleNumber);
    if (cachedResponse) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`✅ Serving cached response for vehicleNumber: ${vehicleNumber} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
      return res.status(200).json({
        response: cachedResponse,
        error: false,
        code: "200",
        message: "eChallan data fetched successfully (cached).",
        requestId: requestId,
        duration: duration.toFixed(2)
      });
    }

    const token = await fetchAuthToken(); // Get the appropriate token

    // Make the API request with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`➡️ Making API request to ${apiUrl} for vehicleNumber: ${vehicleNumber} (Request ID: ${requestId})`);

        const response = await axios.post(
          apiUrl,
          { vehicleNumber },
          {
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
            timeout: 5000, // Set a 5-second timeout for the request
          }
        );

        // Cache the response
        cache.set(vehicleNumber, response.data.response);
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`✅ Fetched and cached response for vehicleNumber: ${vehicleNumber} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);

        // Respond with the successful API response
        return res.status(200).json({
          response: response.data.response,
          error: false,
          code: "200",
          message: "eChallan data fetched successfully.",
          requestId: requestId,
          duration: duration.toFixed(2)
        });
      } catch (error) {
        retries--;
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (retries === 0) {
          throw error; // Throw error if all retries fail
        }
        console.warn(`⚠️ Retrying API request for vehicleNumber: ${vehicleNumber}. Attempts left: ${retries} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
      }
    }
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (error.response) {
      // Log the error for debugging
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
  getEChallanData,
};

