const axios = require('axios');
const { EWAYBILL_API_URL, EWAYBILL_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

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
  const { ewbNo } = req.body;

  // Validate eWaybill number format
  const ewbNoRegex = /^[0-9]{12}$/;
  if (!ewbNoRegex.test(ewbNo)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid eWaybill number format. Expected a 12-digit numeric value.",
    });
  }

  const apiUrl = `${EWAYBILL_API_URL}/EWAYBILL/01`;

  try {
    const token = await fetchAuthToken(); // Get token based on environment

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
      }
    );

    // Send success response
    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "eWaybill data fetched successfully.",
    });
  } catch (error) {
    if (error.response) {
      // Log detailed error for debugging
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
      // Handle network or unexpected errors
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
  getEwaybillData,
};
