
const axios = require('axios');
const NodeCache = require('node-cache');
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
  const { vehicleNumber } = req.body;

  // Validate vehicle number format
  const vehicleNumberRegex = /^[a-zA-Z0-9]{5,11}$/;
  if (!vehicleNumberRegex.test(vehicleNumber)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid vehicleNumber format. Please provide 5-11 alphanumeric characters.",
    });
  }

  const apiUrl = `${ECHALLAN_API_URL}/ECHALLAN/01`;

  try {
    // Check if the response is cached
    const cachedResponse = cache.get(vehicleNumber);
    if (cachedResponse) {
      console.log(`✅ Serving cached response for vehicleNumber: ${vehicleNumber}`);
      return res.status(200).json({
        response: cachedResponse,
        error: false,
        code: "200",
        message: "eChallan data fetched successfully (cached).",
      });
    }

    const token = await fetchAuthToken(); // Get the appropriate token

    // Make the API request with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
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
        console.log(`✅ Fetched and cached response for vehicleNumber: ${vehicleNumber}`);

        // Respond with the successful API response
        return res.status(200).json({
          response: response.data.response,
          error: false,
          code: "200",
          message: "eChallan data fetched successfully.",
        });
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error; // Throw error if all retries fail
        }
        console.warn(`⚠️ Retrying API request for vehicleNumber: ${vehicleNumber}. Attempts left: ${retries}`);
      }
    }
  } catch (error) {
    if (error.response) {
      // Log the error for debugging
      console.error(
        `API Error: Status ${error.response.status}, Message: ${error.response.data?.message || error.response.statusText}`
      );
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.data?.message || error.response.statusText,
      });
    } else {
      console.error('Network Error:', error.message);
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "The server is not responding. Please try again later.",
      });
    }
  }
}

module.exports = {
  getEChallanData,
};
