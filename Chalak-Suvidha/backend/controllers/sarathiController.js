
const axios = require('axios');
const NodeCache = require('node-cache');
const { SARATHI_API_URL, SARATHI_API_TOKEN } = require('../config/apiConfig');

// Initialize cache with a TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Helper function to validate inputs
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

async function getDrivingLicenseData(req, res) {
  const { dlnumber, dob } = req.body;

  // Validation rules
  const dlNumberRegex = /^(([A-Z]{2}-[0-9]{2})|([A-Z]{2}[0-9]{2}))((19|20)[0-9]{2})[0-9]{7}$/;
  const dobRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

  // Validate inputs
  if (
    !validateInput('dlnumber', dlnumber, dlNumberRegex, res, "Format should follow ^(([A-Z]{2}-[0-9]{2})|([A-Z]{2}[0-9]{2}))((19|20)[0-9]{2})[0-9]{7}$") ||
    !validateInput('dob', dob, dobRegex, res, "Format should follow ^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$")
  ) {
    return;
  }

  // Generate a unique cache key
  const cacheKey = `${dlnumber}-${dob}`;

  try {
    // Check if the response is cached
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      console.log(`✅ Serving cached response for DL Number: ${dlnumber}`);
      return res.status(200).json({
        response: cachedResponse,
        error: false,
        code: "200",
        message: "Success (cached)",
      });
    }

    // Make API request with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await axios.post(
          `${SARATHI_API_URL}/SARATHI/01`,
          { dlnumber, dob },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${SARATHI_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            timeout: 5000, // Set a 5-second timeout for the request
          }
        );

        // Cache the response
        cache.set(cacheKey, response.data.response);
        console.log(`✅ Fetched and cached response for DL Number: ${dlnumber}`);

        return res.status(200).json({
          response: response.data.response,
          error: false,
          code: "200",
          message: "Success",
        });
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error; // Throw error if all retries fail
        }
        console.warn(`⚠️ Retrying API request for DL Number: ${dlnumber}. Attempts left: ${retries}`);
      }
    }
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
  getDrivingLicenseData,
};
