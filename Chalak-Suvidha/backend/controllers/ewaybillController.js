const axios = require('axios');
const { EWAYBILL_API_URL, EWAYBILL_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Helper function to fetch API token
const fetchAuthToken = async () => {
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
        }
      }
    );
    return authResponse.data.token;
  }
  return EWAYBILL_API_TOKEN;
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
      message: "Invalid ewbNo format. Expected 12-digit number.",
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
          accept: 'application/json',
          authorization: `Bearer ${token}`,
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
    if (error.response) {
      // Log error details for debugging
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
      // Handle network or unexpected errors
      console.error('Network Error:', error.message);
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "Server is not responding.",
      });
    }
  }
}

module.exports = {
  getEwaybillData,
};
