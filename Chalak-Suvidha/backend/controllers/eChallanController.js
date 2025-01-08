const axios = require('axios');
const { ECHALLAN_API_URL, ECHALLAN_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

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
    const token = await fetchAuthToken(); // Get the appropriate token

    // Make the API request
    const response = await axios.post(
      apiUrl,
      { vehicleNumber },
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      }
    );

    // Respond with the successful API response
    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "eChallan data fetched successfully.",
    });
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
